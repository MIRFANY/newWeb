import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchCase, updateCaseStatus } from '../../api';
import { StatusBadge, BureauTag, ConfidenceBar, ScorePill } from '../../components/shared/Badges';
import { format } from 'date-fns';
import {
  ArrowLeft, Building2, Calendar, User, GitMerge,
  AlertCircle, CheckCircle2, RefreshCw, FileText, Clock
} from 'lucide-react';
import { useState } from 'react';
import type { CaseStatus } from '../../types';
import { useAuthStore } from '../../store/authStore';

const statusTransitions: Record<CaseStatus, CaseStatus[]> = {
  'Pending':       ['Under Process', 'Transferred', 'Escalated'],
  'Under Process': ['Disposed', 'Transferred', 'Escalated'],
  'Disposed':      [],
  'Transferred':   ['Under Process', 'Disposed'],
  'Escalated':     ['Under Process', 'Disposed'],
};

export default function CaseDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState<CaseStatus | ''>('');
  const [remarks, setRemarks] = useState('');

  const { data: caseData, isLoading } = useQuery({
    queryKey: ['case', id],
    queryFn: () => fetchCase(id!),
  });

  const updateMutation = useMutation({
    mutationFn: ({ status, remarks }: { status: CaseStatus; remarks: string }) =>
      updateCaseStatus(id!, status, remarks),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['case', id] });
      queryClient.invalidateQueries({ queryKey: ['cases'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      setShowStatusModal(false);
      setRemarks('');
      setNewStatus('');
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400">
        <RefreshCw size={20} className="animate-spin mr-2" /> Loading case…
      </div>
    );
  }

  if (!caseData) return <div className="text-red-500">Case not found.</div>;

  const c = caseData;
  const canUpdateStatus =
    user?.role !== 'Senior_Management' &&
    (user?.role === 'Admin' || c.assigned_bureau === user?.bureau);
  const transitions = statusTransitions[c.current_status] ?? [];

  const actionTypeColors: Record<string, string> = {
    Created:         'bg-brand-100 text-brand-700',
    'Notice Issued': 'bg-amber-100 text-amber-700',
    Escalated:       'bg-red-100 text-red-700',
    Transferred:     'bg-violet-100 text-violet-700',
    Disposed:        'bg-emerald-100 text-emerald-700',
    'Overlap Detected': 'bg-orange-100 text-orange-700',
    Forwarded:       'bg-blue-100 text-blue-700',
  };

  return (
    <div className="space-y-5 max-w-5xl">
      {/* Back + header */}
      <div className="flex items-start gap-3">
        <button
          id="btn-back-cases"
          onClick={() => navigate(-1)}
          className="btn-ghost btn-sm mt-0.5"
        >
          <ArrowLeft size={15} />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="page-title font-mono">{c.id}</h1>
            <StatusBadge status={c.current_status} />
            <BureauTag bureau={c.assigned_bureau} />
            {c.overlap_group_id && (
              <Link
                to={`/overlaps/${c.overlap_group_id}`}
                id={`link-overlap-group-${c.overlap_group_id}`}
                className="badge bg-orange-100 text-orange-700 flex items-center gap-1 hover:bg-orange-200 transition-colors"
              >
                <AlertCircle size={10} /> Overlap Group
              </Link>
            )}
          </div>
          <p className="page-subtitle">{c.category} complaint — {c.raw_institution_name}</p>
        </div>

        {canUpdateStatus && transitions.length > 0 && (
          <button
            id="btn-update-status"
            onClick={() => setShowStatusModal(true)}
            className="btn-primary btn-sm"
          >
            <RefreshCw size={14} /> Update Status
          </button>
        )}
      </div>

      {/* Alert if needs mapping */}
      {c.needs_manual_mapping && (
        <div className="alert-banner-warning">
          <AlertCircle size={16} className="shrink-0" />
          <div>
            <strong>Institution mapping required.</strong> The system could not confidently resolve "{c.raw_institution_name}" to a known institution (confidence {Math.round(c.confidence_score * 100)}%). Please map this case manually.
          </div>
        </div>
      )}

      {/* 3-column info grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main details */}
        <div className="card lg:col-span-2 space-y-0">
          <div className="card-header">
            <h2 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <FileText size={15} className="text-slate-400" /> Complaint Details
            </h2>
          </div>
          <div className="card-body space-y-4">
            <div>
              <p className="form-label">Description</p>
              <p className="text-sm text-slate-700 leading-relaxed">{c.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="form-label">Source</p>
                <p className="text-sm text-slate-700">{c.source}</p>
              </div>
              <div>
                <p className="form-label">Category</p>
                <p className="text-sm text-slate-700">{c.category}</p>
              </div>
              <div>
                <p className="form-label">Assigned Officer</p>
                <p className="text-sm text-slate-700 flex items-center gap-1">
                  <User size={13} className="text-slate-400" /> {c.assigned_officer}
                </p>
              </div>
              <div>
                <p className="form-label">Assigned Bureau</p>
                <BureauTag bureau={c.assigned_bureau} />
              </div>
              <div>
                <p className="form-label">Last Action</p>
                <p className="text-sm text-slate-700">{c.last_action}</p>
              </div>
              <div>
                <p className="form-label">Next Action</p>
                <p className="text-sm text-slate-700">{c.next_action}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Side metadata */}
        <div className="space-y-4">
          {/* Dates */}
          <div className="card">
            <div className="card-header">
              <h2 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Calendar size={14} className="text-slate-400" /> Timeline
              </h2>
            </div>
            <div className="card-body space-y-3">
              {[
                { label: 'Date Received', value: format(new Date(c.date_received), 'dd MMM yyyy') },
                { label: 'Last Action Date', value: format(new Date(c.last_action_date), 'dd MMM yyyy') },
                { label: 'Expected Disposal', value: format(new Date(c.expected_disposal_date), 'dd MMM yyyy') },
              ].map((item) => (
                <div key={item.label} className="flex justify-between items-center">
                  <span className="text-xs text-slate-500">{item.label}</span>
                  <span className="text-xs font-medium text-slate-700">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Institution */}
          <div className="card">
            <div className="card-header">
              <h2 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Building2 size={14} className="text-slate-400" /> Institution
              </h2>
            </div>
            <div className="card-body space-y-2">
              <div>
                <p className="form-label">Raw Input Name</p>
                <p className="text-xs font-mono text-slate-600 bg-slate-50 p-2 rounded">{c.raw_institution_name}</p>
              </div>
              {c.institution && (
                <>
                  <div>
                    <p className="form-label">Resolved Institution</p>
                    <Link
                      to={`/institutions/${c.institution_id}`}
                      id={`link-institution-${c.institution_id}`}
                      className="text-sm font-medium text-brand-700 hover:underline"
                    >
                      {c.institution.name}
                    </Link>
                  </div>
                  <div>
                    <p className="form-label">AICTE Permanent ID</p>
                    <span className="font-mono text-xs text-slate-600">{c.institution.aicte_permanent_id}</span>
                  </div>
                </>
              )}
              <div>
                <p className="form-label">Resolution Confidence</p>
                <ConfidenceBar score={c.confidence_score} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action History */}
      <div id="case-action-history" className="card">
        <div className="card-header">
          <h2 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <Clock size={15} className="text-slate-400" /> Action History
          </h2>
          <span className="text-xs text-slate-400">{c.actions.length} actions</span>
        </div>
        <div className="card-body">
          {c.actions.length === 0 ? (
            <p className="text-sm text-slate-400">No actions recorded yet.</p>
          ) : (
            <div className="space-y-4">
              {c.actions.map((action, i) => (
                <div key={action.id} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${actionTypeColors[action.action_type] ?? 'bg-slate-100 text-slate-600'}`}>
                      {i + 1}
                    </div>
                    {i < c.actions.length - 1 && <div className="w-px flex-1 bg-slate-100 my-1" />}
                  </div>
                  <div className="flex-1 pb-2">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`badge text-2xs ${actionTypeColors[action.action_type] ?? ''}`}>{action.action_type}</span>
                      <span className="text-2xs text-slate-400">{format(new Date(action.timestamp), 'dd MMM yyyy, HH:mm')}</span>
                    </div>
                    <p className="text-sm text-slate-700 mb-1">{action.remarks}</p>
                    {(action.from_bureau || action.to_bureau) && (
                      <p className="text-2xs text-slate-400">
                        {action.from_bureau && <><BureauTag bureau={action.from_bureau} /> → </>}
                        {action.to_bureau && <BureauTag bureau={action.to_bureau} />}
                      </p>
                    )}
                    {action.document_url && (
                      <a
                        href={action.document_url}
                        id={`doc-link-${action.id}`}
                        className="text-2xs text-brand-600 flex items-center gap-1 mt-1 hover:underline"
                      >
                        <FileText size={10} /> {action.document_url.split('/').pop()}
                      </a>
                    )}
                    <p className="text-2xs text-slate-400 mt-1">By {action.officer}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Status Update Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" role="dialog" aria-modal="true">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-base font-semibold text-slate-800 mb-1">Update Case Status</h3>
            <p className="text-xs text-slate-500 mb-4">Current: <StatusBadge status={c.current_status} /></p>

            <div className="space-y-4">
              <div>
                <label htmlFor="new-status-select" className="form-label">New Status</label>
                <select
                  id="new-status-select"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as CaseStatus)}
                  className="form-select"
                >
                  <option value="">Select…</option>
                  {transitions.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="status-remarks" className="form-label">Remarks <span className="text-red-500">*</span></label>
                <textarea
                  id="status-remarks"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="form-textarea"
                  rows={3}
                  placeholder="Describe the action taken…"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-5 justify-end">
              <button id="btn-cancel-status" onClick={() => setShowStatusModal(false)} className="btn-secondary">Cancel</button>
              <button
                id="btn-confirm-status"
                disabled={!newStatus || !remarks.trim() || updateMutation.isPending}
                onClick={() => updateMutation.mutate({ status: newStatus as CaseStatus, remarks })}
                className="btn-primary"
              >
                {updateMutation.isPending ? <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4" /> : <CheckCircle2 size={14} />}
                Confirm Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
