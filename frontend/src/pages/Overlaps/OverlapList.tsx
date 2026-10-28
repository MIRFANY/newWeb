import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchOverlapGroups } from '../../api';
import { useNavigate } from 'react-router-dom';
import { OverlapBadge, ScorePill } from '../../components/shared/Badges';
import { GitMerge, AlertCircle, CheckCircle, XCircle, Filter } from 'lucide-react';
import { format } from 'date-fns';
import type { OverlapStatus } from '../../types';

const STATUSES: OverlapStatus[] = ['Open', 'Linked', 'Dismissed'];

export default function OverlapList() {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<OverlapStatus | ''>('');

  const { data: groups = [], isLoading } = useQuery({
    queryKey: ['overlaps', statusFilter],
    queryFn: () => fetchOverlapGroups(statusFilter || undefined),
    refetchInterval: 15000,
  });

  const counts = {
    Open: groups.filter((g) => g.status === 'Open').length,
    Linked: groups.filter((g) => g.status === 'Linked').length,
    Dismissed: groups.filter((g) => g.status === 'Dismissed').length,
  };

  return (
    <div className="space-y-4">
      <div className="page-header">
        <div>
          <h1 className="page-title">Overlap Detection Groups</h1>
          <p className="page-subtitle">Cases from different bureaus about the same institution and issue</p>
        </div>
      </div>

      {/* Summary pills */}
      <div className="flex gap-3 flex-wrap">
        {[
          { label: 'Open', count: counts.Open, icon: AlertCircle, color: 'bg-orange-50 text-orange-700 border-orange-200' },
          { label: 'Linked', count: counts.Linked, icon: CheckCircle, color: 'bg-teal-50 text-teal-700 border-teal-200' },
          { label: 'Dismissed', count: counts.Dismissed, icon: XCircle, color: 'bg-slate-50 text-slate-600 border-slate-200' },
        ].map((item) => (
          <button
            key={item.label}
            id={`overlap-filter-${item.label.toLowerCase()}`}
            onClick={() => setStatusFilter(statusFilter === item.label as OverlapStatus ? '' : item.label as OverlapStatus)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all ${item.color} ${statusFilter === item.label ? 'ring-2 ring-offset-1 ring-brand-500' : ''}`}
          >
            <item.icon size={14} />
            {item.label}: {item.count}
          </button>
        ))}
      </div>

      {/* Open overlap banner */}
      {counts.Open > 0 && !statusFilter && (
        <div className="alert-banner-warning">
          <AlertCircle size={16} className="shrink-0" />
          <div>
            <strong>Potential Overlapping Cases – Coordination Required.</strong>{' '}
            {counts.Open} open overlap group{counts.Open > 1 ? 's' : ''} detected. Officers from involved bureaus must review and coordinate before taking independent action.
          </div>
        </div>
      )}

      {/* Groups */}
      {isLoading ? (
        <div className="text-center py-12 text-slate-400">Loading overlap groups…</div>
      ) : groups.length === 0 ? (
        <div className="card p-8 text-center text-slate-400">
          <GitMerge size={32} className="mx-auto mb-2 opacity-30" />
          <p>No overlap groups with status "{statusFilter || 'any'}"</p>
        </div>
      ) : (
        <div className="space-y-4">
          {groups.map((group) => (
            <div
              key={group.id}
              id={`overlap-group-${group.id}`}
              className={`card hover:shadow-card-md transition-all cursor-pointer ${group.status === 'Open' ? 'border-orange-200' : ''}`}
              onClick={() => navigate(`/overlaps/${group.id}`)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && navigate(`/overlaps/${group.id}`)}
            >
              <div className="card-header">
                <div className="flex items-center gap-3 flex-wrap">
                  <GitMerge size={16} className={group.status === 'Open' ? 'text-orange-500' : 'text-slate-400'} />
                  <span className="font-semibold text-slate-800 text-sm">{group.institution_name}</span>
                  <OverlapBadge status={group.status} />
                  <ScorePill score={group.similarity_score} />
                  {group.lead_bureau && (
                    <span className="text-2xs text-slate-500">Lead: <strong>{group.lead_bureau}</strong></span>
                  )}
                </div>
                <span className="text-xs text-slate-400">
                  {format(new Date(group.created_at), 'dd MMM yyyy')}
                </span>
              </div>

              <div className="card-body">
                {/* Cases involved */}
                <div className="flex gap-2 flex-wrap mb-3">
                  {group.case_ids.map((cid) => (
                    <span key={cid} className="font-mono text-xs bg-brand-50 text-brand-700 border border-brand-200 px-2 py-0.5 rounded">
                      {cid}
                    </span>
                  ))}
                </div>

                {/* Reasons */}
                <div className="flex flex-wrap gap-1">
                  {group.reasons.map((r, i) => (
                    <span key={i} className="text-2xs bg-orange-50 border border-orange-200 text-orange-700 px-2 py-0.5 rounded">
                      {r}
                    </span>
                  ))}
                </div>

                {/* Notes preview */}
                {group.notes && group.notes.length > 0 && (
                  <div className="mt-3 text-xs text-slate-500 flex items-center gap-1">
                    <Filter size={11} />
                    {group.notes.length} shared note{group.notes.length > 1 ? 's' : ''} from involved bureaus
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
