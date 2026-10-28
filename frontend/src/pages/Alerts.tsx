import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchAlerts, markAlertRead, markAllAlertsRead } from '../api';
import { AlertTypeBadge } from '../components/shared/Badges';
import { format } from 'date-fns';
import { Bell, CheckCheck, AlertCircle, Clock, TrendingUp, GitMerge } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { AlertType } from '../types';

const AlertIcon = ({ type }: { type: AlertType }) => {
  switch (type) {
    case 'Overlap':    return <GitMerge size={16} className="text-orange-500" />;
    case 'SLA':        return <Clock size={16} className="text-red-500" />;
    case 'Escalation': return <TrendingUp size={16} className="text-red-600" />;
    case 'Pending':    return <AlertCircle size={16} className="text-amber-500" />;
  }
};

export default function AlertsPage() {
  const queryClient = useQueryClient();

  const { data: alerts = [] } = useQuery({
    queryKey: ['alerts'],
    queryFn: fetchAlerts,
    refetchInterval: 15000,
  });

  const readMutation = useMutation({
    mutationFn: markAlertRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['alerts'] }),
  });

  const readAllMutation = useMutation({
    mutationFn: markAllAlertsRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['alerts'] }),
  });

  const unread = alerts.filter((a) => !a.is_read);
  const read = alerts.filter((a) => a.is_read);

  return (
    <div className="space-y-4 max-w-3xl">
      <div className="page-header">
        <div>
          <h1 className="page-title">Alerts & Notifications</h1>
          <p className="page-subtitle">{unread.length} unread · {alerts.length} total</p>
        </div>
        {unread.length > 0 && (
          <button
            id="btn-mark-all-read"
            onClick={() => readAllMutation.mutate()}
            className="btn-secondary btn-sm"
          >
            <CheckCheck size={14} /> Mark all read
          </button>
        )}
      </div>

      {/* Unread */}
      {unread.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Unread ({unread.length})</p>
          <div className="space-y-2">
            {unread.map((alert) => (
              <div
                key={alert.id}
                id={`alert-${alert.id}`}
                className="card border-l-4 border-l-brand-700 flex items-start gap-4 p-4 hover:shadow-card-md transition-all"
              >
                <div className="mt-0.5">
                  <AlertIcon type={alert.type} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <AlertTypeBadge type={alert.type} />
                    <span className="text-2xs text-slate-400">
                      {format(new Date(alert.created_at), 'dd MMM yyyy, HH:mm')}
                    </span>
                    <span className="w-2 h-2 rounded-full bg-brand-600 inline-block" title="Unread" />
                  </div>
                  <p className="text-sm text-slate-800 leading-snug mb-2">{alert.message}</p>
                  <div className="flex items-center gap-3">
                    {alert.group_id && (
                      <Link
                        to={`/overlaps/${alert.group_id}`}
                        id={`alert-link-overlap-${alert.id}`}
                        className="text-xs text-brand-600 hover:underline"
                      >
                        View overlap group →
                      </Link>
                    )}
                    {alert.case_id && !alert.group_id && (
                      <Link
                        to={`/cases/${alert.case_id}`}
                        id={`alert-link-case-${alert.id}`}
                        className="text-xs text-brand-600 hover:underline"
                      >
                        View case {alert.case_id} →
                      </Link>
                    )}
                    <button
                      id={`btn-mark-read-${alert.id}`}
                      onClick={() => readMutation.mutate(alert.id)}
                      className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      Mark read
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Read */}
      {read.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 mt-4">Read ({read.length})</p>
          <div className="space-y-2">
            {read.map((alert) => (
              <div
                key={alert.id}
                id={`alert-read-${alert.id}`}
                className="card flex items-start gap-4 p-4 opacity-60"
              >
                <div className="mt-0.5"><AlertIcon type={alert.type} /></div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <AlertTypeBadge type={alert.type} />
                    <span className="text-2xs text-slate-400">
                      {format(new Date(alert.created_at), 'dd MMM yyyy, HH:mm')}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 leading-snug">{alert.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {alerts.length === 0 && (
        <div className="card p-12 text-center text-slate-400">
          <Bell size={32} className="mx-auto mb-2 opacity-30" />
          <p>No alerts at this time.</p>
        </div>
      )}
    </div>
  );
}
