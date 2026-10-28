import { useQuery } from '@tanstack/react-query';
import {
  fetchDashboardStats,
  fetchBureauWorkload,
  fetchAgeingBuckets,
  fetchRegionStats,
  fetchMonthlyTrend,
} from '../api';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  LineChart, Line, ResponsiveContainer, Cell
} from 'recharts';
import {
  FileText, Clock, CheckCircle2, ArrowRightLeft,
  AlertTriangle, GitMerge, TrendingUp, RefreshCw
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// ─── Stat Card ────────────────────────────────────────────────────────────────

interface StatCardProps {
  id: string;
  label: string;
  value: number;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  onClick?: () => void;
  highlight?: boolean;
}

function StatCard({ id, label, value, icon: Icon, color, bgColor, onClick, highlight }: StatCardProps) {
  return (
    <div
      id={id}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
      className={`stat-card transition-all duration-150 ${onClick ? 'cursor-pointer hover:shadow-card-md hover:-translate-y-0.5' : ''} ${highlight ? 'border-red-300 ring-1 ring-red-200' : ''}`}
    >
      <div className={`w-9 h-9 rounded-lg ${bgColor} flex items-center justify-center mb-2`}>
        <Icon size={18} className={color} />
      </div>
      <p className="stat-value">{value.toLocaleString()}</p>
      <p className="stat-label">{label}</p>
    </div>
  );
}

// ─── Ageing bucket colours ────────────────────────────────────────────────────

const ageColors = ['#10b981', '#f59e0b', '#f97316', '#ef4444'];

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function Dashboard() {
  const navigate = useNavigate();

  const { data: stats, isLoading: statsLoading, dataUpdatedAt } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: fetchDashboardStats,
    refetchInterval: 15000,
  });

  const { data: bureauData = [] } = useQuery({
    queryKey: ['bureau-workload'],
    queryFn: fetchBureauWorkload,
    refetchInterval: 15000,
  });

  const { data: ageing = [] } = useQuery({
    queryKey: ['ageing'],
    queryFn: fetchAgeingBuckets,
    refetchInterval: 15000,
  });

  const { data: regions = [] } = useQuery({
    queryKey: ['regions'],
    queryFn: fetchRegionStats,
    refetchInterval: 15000,
  });

  const { data: monthly = [] } = useQuery({
    queryKey: ['monthly'],
    queryFn: fetchMonthlyTrend,
    refetchInterval: 15000,
  });

  const lastUpdated = dataUpdatedAt ? new Date(dataUpdatedAt).toLocaleTimeString() : '–';

  if (statsLoading) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400">
        <RefreshCw size={20} className="animate-spin mr-2" /> Loading dashboard…
      </div>
    );
  }

  const s = stats!;

  const statCards: StatCardProps[] = [
    { id: 'stat-total',        label: 'Total Received',       value: s.total,         icon: FileText,        color: 'text-brand-700',  bgColor: 'bg-brand-100',   onClick: () => navigate('/cases') },
    { id: 'stat-pending',      label: 'Pending',              value: s.pending,        icon: Clock,           color: 'text-amber-600',  bgColor: 'bg-amber-100',   onClick: () => navigate('/cases?status=Pending') },
    { id: 'stat-underprocess', label: 'Under Process',        value: s.under_process,  icon: TrendingUp,      color: 'text-blue-600',   bgColor: 'bg-blue-100',    onClick: () => navigate('/cases?status=Under+Process') },
    { id: 'stat-disposed',     label: 'Disposed',             value: s.disposed,       icon: CheckCircle2,    color: 'text-emerald-600',bgColor: 'bg-emerald-100', onClick: () => navigate('/cases?status=Disposed') },
    { id: 'stat-transferred',  label: 'Transferred',          value: s.transferred,    icon: ArrowRightLeft,  color: 'text-violet-600', bgColor: 'bg-violet-100',  onClick: () => navigate('/cases?status=Transferred') },
    { id: 'stat-escalated',    label: 'Escalated',            value: s.escalated,      icon: AlertTriangle,   color: 'text-red-600',    bgColor: 'bg-red-100',     onClick: () => navigate('/cases?status=Escalated'), highlight: s.escalated > 10 },
    { id: 'stat-pastsla',      label: 'Past SLA Deadline',    value: s.past_sla,       icon: Clock,           color: 'text-red-600',    bgColor: 'bg-red-100',     highlight: true },
    { id: 'stat-overlaps',     label: 'Open Overlap Groups',  value: s.overlap_groups_open, icon: GitMerge,   color: 'text-orange-600', bgColor: 'bg-orange-100',  onClick: () => navigate('/overlaps?status=Open') },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard Overview</h1>
          <p className="page-subtitle">Real-time complaint monitoring across all AICTE bureaus</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <RefreshCw size={12} className="animate-pulse" />
          Updated {lastUpdated} · Refreshes every 15s
        </div>
      </div>

      {/* Stat Cards */}
      <div id="stat-cards-grid" className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <StatCard key={card.id} {...card} />
        ))}
      </div>

      {/* Row 1: Bureau workload + Monthly trend */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Bureau workload */}
        <div id="chart-bureau-workload" className="card lg:col-span-3">
          <div className="card-header">
            <h2 className="text-sm font-semibold text-slate-700">Bureau-wise Workload</h2>
            <span className="text-xs text-slate-400">By status</span>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={bureauData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="bureau" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 6 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="pending"      fill="#f59e0b" name="Pending"       radius={[3,3,0,0]} />
                <Bar dataKey="under_process"fill="#3b82f6" name="Under Process" radius={[3,3,0,0]} />
                <Bar dataKey="disposed"     fill="#10b981" name="Disposed"      radius={[3,3,0,0]} />
                <Bar dataKey="escalated"    fill="#ef4444" name="Escalated"     radius={[3,3,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly trend */}
        <div id="chart-monthly-trend" className="card lg:col-span-2">
          <div className="card-header">
            <h2 className="text-sm font-semibold text-slate-700">Monthly Trend</h2>
            <span className="text-xs text-slate-400">Received vs Disposed</span>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={monthly} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 6 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="received" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} name="Received" />
                <Line type="monotone" dataKey="disposed" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} name="Disposed" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 2: Ageing + Region distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Ageing buckets */}
        <div id="chart-ageing" className="card">
          <div className="card-header">
            <h2 className="text-sm font-semibold text-slate-700">Ageing Analysis</h2>
            <span className="text-xs text-slate-400">Days since complaint received</span>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={ageing} layout="vertical" margin={{ top: 0, right: 8, left: 70, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis dataKey="bucket" type="category" tick={{ fontSize: 11 }} width={70} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 6 }} />
                <Bar dataKey="count" radius={[0,3,3,0]} name="Cases">
                  {ageing.map((_entry, index) => (
                    <Cell key={index} fill={ageColors[index % ageColors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Region stats */}
        <div id="chart-region" className="card">
          <div className="card-header">
            <h2 className="text-sm font-semibold text-slate-700">Region-wise Distribution</h2>
            <span className="text-xs text-slate-400">Total complaints per region</span>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={regions} margin={{ top: 0, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="region" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 6 }} />
                <Bar dataKey="count" fill="#1a3c6e" radius={[3,3,0,0]} name="Complaints" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Quick links row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Open Overlaps', count: s.overlap_groups_open, to: '/overlaps?status=Open', color: 'text-orange-600 bg-orange-50 border-orange-200' },
          { label: 'Manual Mapping Queue', count: 1, to: '/cases?manual=true', color: 'text-amber-600 bg-amber-50 border-amber-200' },
          { label: 'SLA Breaches', count: s.past_sla, to: '/alerts?type=SLA', color: 'text-red-600 bg-red-50 border-red-200' },
          { label: 'Escalated Cases', count: s.escalated, to: '/cases?status=Escalated', color: 'text-red-700 bg-red-50 border-red-200' },
        ].map((q) => (
          <button
            key={q.label}
            id={`quick-${q.label.toLowerCase().replace(/\s/g, '-')}`}
            onClick={() => navigate(q.to)}
            className={`card p-4 text-left hover:shadow-card-md transition-all border ${q.color}`}
          >
            <p className="text-2xl font-bold">{q.count}</p>
            <p className="text-xs font-medium mt-0.5">{q.label}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
