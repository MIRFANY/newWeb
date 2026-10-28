import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchOverlapGroup, linkOverlapGroup, dismissOverlapGroup, addOverlapNote } from '../../api';
import { OverlapBadge, StatusBadge, BureauTag, ScorePill } from '../../components/shared/Badges';
import { format } from 'date-fns';
import {
  ArrowLeft, AlertCircle, CheckCircle, XCircle, MessageSquare,
  RefreshCw, GitMerge, Send, Building2, Info
} from 'lucide-react';
import { useState } from 'react';
import type { Bureau } from '../../types';
import { useAuthStore } from '../../store/authStore';

const BUREAUS: Bureau[] = ['RB', 'PGRC', 'Regional'];

export default function OverlapDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showDismissModal, setShowDismissModal] = useState(false);
  const [leadBureau, setLeadBureau] = useState<Bureau>('RB');
  const [linkNote, setLinkNote] = useState('');
  const [dismissRemark, setDismissRemark] = useState('');
  const [newNote, setNewNote] = useState('');

  const { data: group, isLoading } = useQuery({
    queryKey: ['overlap', id],
    queryFn: () => fetchOverlapGroup(id!),
  });

  const linkMutation = useMutation({
    mutationFn: () => linkOverlapGroup(id!, leadBureau, linkNote),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['overlap', id] }); setShowLinkModal(false); },
  });

  const dismissMutation = useMutation({
    mutationFn: () => dismissOverlapGroup(id!, dismissRemark),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['overlap', id] }); setShowDismissModal(false); },
  });

  const noteMutation = useMutation({
    mutationFn: () => addOverlapNote(id!, newNote, user?.full_name ?? 'Officer'),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['overlap', id] }); setNewNote(''); },
  });

  if (isLoading) {
    return <div className="flex items-center justify-center h-64 text-slate-400"><RefreshCw size={20} className="animate-spin mr-2" /> Loading…</div>;
  }
  if (!group) return <div className="text-red-500">Overlap group not found.</div>;

  const canAct = user?.role !== 'Senior_Management';

  return (
    <div className="space-y-5 max-w-4xl">
      {/* Back + header */}
      <div className="flex items-start gap-3">
        <button id="btn-back-overlaps" onClick={() => navigate(-1)} className="btn-ghost btn-sm mt-0.5">
          <ArrowLeft size={15} />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap mb-1">
            <GitMerge size={18} className="text-orange-500" />
            <h1 className="page-title">Overlap Group {group.id}</h1>
            <OverlapBadge status={group.status} />
            <ScorePill score={group.similarity_score} />
          </div>
          <p className="page-subtitle">{group.institution_name}</p>
        </div>
        {canAct && group.status === 'Open' && (
          <div className="flex gap-2">
            <button id="btn-link-overlap" onClick={() => setShowLinkModal(true)} className="btn-primary btn-sm">
              <CheckCircle size={14} /> Link Cases
            </button>
            <button id="btn-dismiss-overlap" onClick={() => setShowDismissModal(true)} className="btn-secondary btn-sm">
              <XCircle size={14} /> Dismiss
            </button>
          </div>
        )}
      </div>

      {/* Alert banner for open groups */}
      {group.status === 'Open' && (
        <div className="alert-banner-warning">
          <AlertCircle size={16} className="shrink-0" />
          <div>
            <strong>Potential Overlapping Cases – Coordination Required.</strong>{' '}
            The system has detected that the following cases from different bureaus may relate to the same issue at <strong>{group.institution_name}</strong>. Officers from all involved bureaus should coordinate before taking independent action.
          </div>
        </div>
      )}

      {group.status === 'Linked' && group.lead_bureau && (
        <div className="alert-banner-info">
          <Info size={16} className="shrink-0" />
          <div>
            Cases are linked. <strong>{group.lead_bureau}</strong> is the lead bureau for this complaint. Other bureaus should defer action pending lead bureau's outcome.
          </div>
        </div>
      )}

      {/* Scoring explainer */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <GitMerge size={15} className="text-slate-400" /> Similarity Analysis & Reasoning
          </h2>
          <ScorePill score={group.similarity_score} />
        </div>
        <div className="card-body">
          <div className="mb-3">
            <div className="progress-bar">
              <div className="progress-fill bg-orange-500" style={{ width: `${Math.round(group.similarity_score * 100)}%` }} />
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Overall similarity: {Math.round(group.similarity_score * 100)}% — computed from:
              <span className="ml-1 text-slate-600">50% embedding cosine similarity + 30% category match + 20% time proximity</span>
            </p>
          </div>
          <p className="text-xs font-medium text-slate-600 mb-2">Why the system flagged this:</p>
          <div className="flex flex-wrap gap-2">
            {group.reasons.map((r, i) => (
              <span key={i} className="badge bg-orange-50 border border-orange-200 text-orange-800 text-xs">
                ✓ {r}
              </span>
            ))}
          </div>
          <p className="text-2xs text-slate-400 mt-3">
            <Info size={10} className="inline mr-1" />
            This is a system suggestion only. Human officers must review and decide to link or dismiss. No case is auto-closed or auto-merged.
          </p>
        </div>
      </div>

      {/* Involved cases */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-sm font-semibold text-slate-700">Involved Cases ({group.case_ids.length})</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Case ID</th>
                <th>Bureau</th>
                <th>Category</th>
                <th>Status</th>
                <th>Date</th>
                <th>Description (snippet)</th>
              </tr>
            </thead>
            <tbody>
              {(group.cases ?? []).map((c) => (
                <tr key={c.id}>
                  <td>
                    <Link to={`/cases/${c.id}`} id={`overlap-case-link-${c.id}`} className="font-mono text-xs text-brand-700 font-medium hover:underline">
                      {c.id}
                    </Link>
                  </td>
                  <td><BureauTag bureau={c.assigned_bureau} /></td>
                  <td><span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">{c.category}</span></td>
                  <td><StatusBadge status={c.current_status} /></td>
                  <td className="text-xs text-slate-500">{format(new Date(c.date_received), 'dd MMM yyyy')}</td>
                  <td className="text-xs text-slate-600 max-w-xs truncate">{c.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Shared notes */}
      <div id="overlap-notes-section" className="card">
        <div className="card-header">
          <h2 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <MessageSquare size={15} className="text-slate-400" /> Shared Notes
          </h2>
          <span className="text-xs text-slate-400">{group.notes?.length ?? 0} note(s)</span>
        </div>
        <div className="card-body space-y-4">
          {(group.notes ?? []).length === 0 ? (
            <p className="text-sm text-slate-400">No notes yet. Add a note to coordinate with other bureaus.</p>
          ) : (
            (group.notes ?? []).map((note) => (
              <div key={note.id} className="flex gap-3">
                <div className="w-7 h-7 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-semibold text-xs shrink-0">
                  {note.author.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-semibold text-slate-700">{note.author}</span>
                    <span className="text-2xs text-slate-400">{note.author_role.replace('_', ' ')}</span>
                    <span className="text-2xs text-slate-400">{format(new Date(note.timestamp), 'dd MMM yyyy, HH:mm')}</span>
                  </div>
                  <p className="text-sm text-slate-700 bg-slate-50 rounded-lg p-3">{note.text}</p>
                </div>
              </div>
            ))
          )}

          {/* Add note */}
          {canAct && (
            <div className="flex gap-3 pt-2 border-t border-slate-100">
              <div className="w-7 h-7 rounded-full bg-brand-700 flex items-center justify-center text-white font-semibold text-xs shrink-0">
                {user?.full_name.charAt(0) ?? 'U'}
              </div>
              <div className="flex-1 flex gap-2">
                <textarea
                  id="new-overlap-note"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="form-textarea flex-1"
                  rows={2}
                  placeholder="Add a shared note visible to all bureaus involved…"
                />
                <button
                  id="btn-add-overlap-note"
                  disabled={!newNote.trim() || noteMutation.isPending}
                  onClick={() => noteMutation.mutate()}
                  className="btn-primary btn-sm self-end"
                >
                  <Send size={13} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Link Modal */}
      {showLinkModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-base font-semibold mb-1">Link Cases & Assign Lead Bureau</h3>
            <p className="text-xs text-slate-500 mb-4">All cases will be coordinated under the lead bureau. Ensure all involved officers agree before linking.</p>
            <div className="space-y-3">
              <div>
                <label htmlFor="lead-bureau-select" className="form-label">Lead Bureau <span className="text-red-500">*</span></label>
                <select id="lead-bureau-select" value={leadBureau} onChange={(e) => setLeadBureau(e.target.value as Bureau)} className="form-select">
                  {BUREAUS.map((b) => <option key={b}>{b}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="link-note-input" className="form-label">Coordination Note</label>
                <textarea id="link-note-input" value={linkNote} onChange={(e) => setLinkNote(e.target.value)} className="form-textarea" rows={3} placeholder="Explain the decision to link these cases…" />
              </div>
            </div>
            <div className="flex gap-3 mt-5 justify-end">
              <button id="btn-cancel-link" onClick={() => setShowLinkModal(false)} className="btn-secondary">Cancel</button>
              <button
                id="btn-confirm-link"
                onClick={() => linkMutation.mutate()}
                disabled={linkMutation.isPending}
                className="btn-primary"
              >
                {linkMutation.isPending ? <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4" /> : <CheckCircle size={14} />}
                Link Cases
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dismiss Modal */}
      {showDismissModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-base font-semibold mb-1">Dismiss Overlap Group</h3>
            <p className="text-xs text-slate-500 mb-4">Dismissing means these cases are NOT related. Provide a clear reason. This will be audit-logged.</p>
            <div>
              <label htmlFor="dismiss-remark" className="form-label">Reason <span className="text-red-500">*</span></label>
              <textarea id="dismiss-remark" value={dismissRemark} onChange={(e) => setDismissRemark(e.target.value)} className="form-textarea" rows={3} placeholder="Explain why these cases are not related…" />
            </div>
            <div className="flex gap-3 mt-5 justify-end">
              <button id="btn-cancel-dismiss" onClick={() => setShowDismissModal(false)} className="btn-secondary">Cancel</button>
              <button
                id="btn-confirm-dismiss"
                onClick={() => dismissMutation.mutate()}
                disabled={!dismissRemark.trim() || dismissMutation.isPending}
                className="btn-danger"
              >
                <XCircle size={14} /> Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
