import type { CaseStatus, OverlapStatus, AlertType, Role } from '../../types';

// ─── Status Badge ─────────────────────────────────────────────────────────────

const statusMap: Record<CaseStatus, string> = {
  'Pending':      'badge-pending',
  'Under Process':'badge-process',
  'Disposed':     'badge-disposed',
  'Transferred':  'badge-transferred',
  'Escalated':    'badge-escalated',
};

export function StatusBadge({ status }: { status: CaseStatus }) {
  return <span className={statusMap[status] ?? 'badge'}>{status}</span>;
}

// ─── Overlap Status Badge ─────────────────────────────────────────────────────

const overlapMap: Record<OverlapStatus, string> = {
  Open:      'badge-open',
  Linked:    'badge-linked',
  Dismissed: 'badge-dismissed',
};

export function OverlapBadge({ status }: { status: OverlapStatus }) {
  return <span className={overlapMap[status] ?? 'badge'}>{status}</span>;
}

// ─── Alert Type Badge ─────────────────────────────────────────────────────────

const alertColorMap: Record<AlertType, string> = {
  Overlap:    'bg-orange-100 text-orange-800',
  SLA:        'bg-red-100 text-red-800',
  Escalation: 'bg-red-100 text-red-800',
  Pending:    'bg-amber-100 text-amber-800',
};

export function AlertTypeBadge({ type }: { type: AlertType }) {
  return <span className={`badge ${alertColorMap[type]}`}>{type}</span>;
}

// ─── Role Badge ───────────────────────────────────────────────────────────────

const roleColors: Record<Role, string> = {
  Admin:              'bg-brand-100 text-brand-800',
  RB_Officer:         'bg-sky-100 text-sky-800',
  PGRC_Officer:       'bg-purple-100 text-purple-800',
  Regional_Officer:   'bg-teal-100 text-teal-800',
  Senior_Management:  'bg-slate-200 text-slate-700',
};

const roleLabels: Record<Role, string> = {
  Admin:              'Admin',
  RB_Officer:         'RB Officer',
  PGRC_Officer:       'PGRC Officer',
  Regional_Officer:   'Regional Officer',
  Senior_Management:  'Senior Management',
};

export function RoleBadge({ role }: { role: Role }) {
  return <span className={`badge ${roleColors[role]}`}>{roleLabels[role]}</span>;
}

// ─── Score Pill ───────────────────────────────────────────────────────────────

export function ScorePill({ score }: { score: number }) {
  const pct = Math.round(score * 100);
  const color =
    pct >= 80 ? 'bg-emerald-100 text-emerald-800' :
    pct >= 60 ? 'bg-amber-100 text-amber-800' :
    'bg-red-100 text-red-800';
  return <span className={`badge ${color}`}>{pct}%</span>;
}

// ─── Bureau Tag ───────────────────────────────────────────────────────────────

const bureauColors: Record<string, string> = {
  RB:       'bg-sky-50 text-sky-700 border border-sky-200',
  PGRC:     'bg-purple-50 text-purple-700 border border-purple-200',
  Regional: 'bg-teal-50 text-teal-700 border border-teal-200',
  Admin:    'bg-slate-50 text-slate-600 border border-slate-200',
};

export function BureauTag({ bureau }: { bureau: string }) {
  return <span className={`badge ${bureauColors[bureau] ?? 'badge'}`}>{bureau}</span>;
}

// ─── Confidence Indicator ─────────────────────────────────────────────────────

export function ConfidenceBar({ score }: { score: number }) {
  const pct = Math.round(score * 100);
  const color = pct >= 80 ? 'bg-emerald-500' : pct >= 60 ? 'bg-amber-400' : 'bg-red-400';
  return (
    <div className="flex items-center gap-2">
      <div className="progress-bar w-20">
        <div className={`progress-fill ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs text-slate-500">{pct}%</span>
    </div>
  );
}
