import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchInstitution } from '../../api';
import { StatusBadge, BureauTag } from '../../components/shared/Badges';
import { format } from 'date-fns';
import { ArrowLeft, Building2, MapPin, Tag, AlertCircle, RefreshCw } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell
} from 'recharts';
import { mockOverlapGroups } from '../../mocks/data';
import type { CaseStatus } from '../../types';

const STATUS_COLORS: Record<CaseStatus, string> = {
  'Pending':       '#f59e0b',
  'Under Process': '#3b82f6',
  'Disposed':      '#10b981',
  'Transferred':   '#8b5cf6',
  'Escalated':     '#ef4444',
};

export default function InstitutionProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ['institution', id],
    queryFn: () => fetchInstitution(id!),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400">
        <RefreshCw size={20} className="animate-spin mr-2" /> Loading institution…
      </div>
    );
  }

  if (!data) return <div className="text-red-500">Institution not found.</div>;

  const overlaps = mockOverlapGroups.filter((g) => g.institution_id === id);

  // Compute bureau breakdown
  const bureauBreakdown: Record<string, number> = {};
  data.cases.forEach((c) => {
    bureauBreakdown[c.assigned_bureau] = (bureauBreakdown[c.assigned_bureau] ?? 0) + 1;
  });
  const bureauData = Object.entries(bureauBreakdown).map(([bureau, count]) => ({ bureau, count }));

  // Status breakdown
  const statusBreakdown: Record<string, number> = {};
  data.cases.forEach((c) => {
    statusBreakdown[c.current_status] = (statusBreakdown[c.current_status] ?? 0) + 1;
  });
  const statusData = Object.entries(statusBreakdown).map(([status, count]) => ({ status, count }));

  return (
    <div className="space-y-5 max-w-5xl">
      {/* Back + header */}
      <div className="flex items-start gap-3">
        <button id="btn-back-institutions" onClick={() => navigate(-1)} className="btn-ghost btn-sm mt-0.5">
          <ArrowLeft size={15} />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-9 h-9 rounded-lg bg-brand-100 flex items-center justify-center shrink-0">
              <Building2 size={17} className="text-brand-700" />
            </div>
            <h1 className="page-title">{data.name}</h1>
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-500 flex-wrap">
            <span className="font-mono text-xs bg-slate-100 px-2 py-0.5 rounded">{data.aicte_permanent_id}</span>
            <span className="flex items-center gap-1"><MapPin size={12} />{data.state} · {data.region}</span>
          </div>
        </div>
      </div>

      {/* Overlap alert */}
      {overlaps.filter((g) => g.status === 'Open').length > 0 && (
        <div className="alert-banner-warning">
          <AlertCircle size={16} className="shrink-0" />
          <div>
            <strong>Potential Overlapping Cases – Coordination Required.</strong>{' '}
            {overlaps.filter((g) => g.status === 'Open').length} open overlap group(s) detected for this institution.{' '}
            <button
              id="btn-view-overlaps-from-inst"
              onClick={() => navigate('/overlaps')}
              className="underline font-medium"
            >
              View overlap groups →
            </button>
          </div>
        </div>
      )}

      {/* Info + charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Basic info */}
        <div className="card">
          <div className="card-header"><h2 className="text-sm font-semibold">Institution Details</h2></div>
          <div className="card-body space-y-3">
            <div>
              <p className="form-label">Address</p>
              <p className="text-sm text-slate-700">{data.address}</p>
            </div>
            <div>
              <p className="form-label">Region / State</p>
              <p className="text-sm text-slate-700">{data.region} · {data.state}</p>
            </div>
            <div>
              <p className="form-label">Known Aliases</p>
              <div className="flex flex-wrap gap-1">
                {data.aliases.map((a) => (
                  <span key={a} className="badge bg-slate-100 text-slate-600 text-2xs">
                    <Tag size={8} className="mr-0.5" />{a}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="form-label">Total Complaints</p>
              <p className="text-2xl font-bold text-slate-800">{data.cases.length}</p>
            </div>
          </div>
        </div>

        {/* Bureau breakdown chart */}
        <div className="card">
          <div className="card-header"><h2 className="text-sm font-semibold">Bureau-wise Breakdown</h2></div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={150}>
              <BarChart data={bureauData} margin={{ top: 0, right: 0, left: -24, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="bureau" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ fontSize: 12 }} />
                <Bar dataKey="count" fill="#1a3c6e" radius={[3,3,0,0]} name="Cases" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status breakdown chart */}
        <div className="card">
          <div className="card-header"><h2 className="text-sm font-semibold">Status Breakdown</h2></div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={150}>
              <BarChart data={statusData} margin={{ top: 0, right: 0, left: -24, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="status" tick={{ fontSize: 9 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ fontSize: 12 }} />
                <Bar dataKey="count" radius={[3,3,0,0]} name="Cases">
                  {statusData.map((entry, i) => (
                    <Cell key={i} fill={STATUS_COLORS[entry.status as CaseStatus] ?? '#94a3b8'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Overlap groups */}
      {overlaps.length > 0 && (
        <div className="card">
          <div className="card-header">
            <h2 className="text-sm font-semibold">Overlap Groups</h2>
            <span className="text-xs text-slate-400">{overlaps.length} group(s)</span>
          </div>
          <div className="card-body space-y-3">
            {overlaps.map((g) => (
              <div key={g.id} className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                <AlertCircle size={15} className="text-orange-500 mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-slate-700">Overlap Group {g.id}</span>
                    <span className={`badge text-2xs ${g.status === 'Open' ? 'badge-open' : g.status === 'Linked' ? 'badge-linked' : 'badge-dismissed'}`}>{g.status}</span>
                  </div>
                  <p className="text-xs text-slate-600 mb-1">Cases: {g.case_ids.join(', ')}</p>
                  <div className="flex flex-wrap gap-1">
                    {g.reasons.map((r, i) => (
                      <span key={i} className="text-2xs bg-white border border-orange-200 px-1.5 py-0.5 rounded text-orange-700">{r}</span>
                    ))}
                  </div>
                </div>
                <button
                  id={`btn-view-overlap-${g.id}`}
                  onClick={() => navigate(`/overlaps/${g.id}`)}
                  className="btn-secondary btn-xs shrink-0"
                >
                  View →
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Complaint history table */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-sm font-semibold">Consolidated Complaint History</h2>
          <span className="text-xs text-slate-400">{data.cases.length} cases</span>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Case ID</th>
                <th>Category</th>
                <th>Bureau</th>
                <th>Status</th>
                <th>Date Received</th>
                <th>Last Action</th>
              </tr>
            </thead>
            <tbody>
              {data.cases.map((c) => (
                <tr
                  key={c.id}
                  className="cursor-pointer"
                  onClick={() => navigate(`/cases/${c.id}`)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && navigate(`/cases/${c.id}`)}
                >
                  <td><span className="font-mono text-xs text-brand-700 font-medium">{c.id}</span></td>
                  <td><span className="text-xs text-slate-600 bg-slate-100 px-2 py-0.5 rounded">{c.category}</span></td>
                  <td><BureauTag bureau={c.assigned_bureau} /></td>
                  <td><StatusBadge status={c.current_status} /></td>
                  <td className="text-xs text-slate-500">{format(new Date(c.date_received), 'dd MMM yyyy')}</td>
                  <td className="text-xs text-slate-600 max-w-xs truncate">{c.last_action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
