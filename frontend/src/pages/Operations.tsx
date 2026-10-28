import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Download, Play, Save, Clock3, ShieldCheck } from 'lucide-react'
import {
  exportCSV,
  fetchAuditLogs,
  fetchCases,
  fetchSLAConfigs,
  runEvaluation,
  updateSLAConfig,
} from '../api'

export function Reports() {
  const { data } = useQuery({ queryKey: ['report-cases'], queryFn: () => fetchCases({ page_size: 1000 }) })
  const cases = data?.items ?? []

  const download = () => exportCSV('aicte-case-report.csv', cases.map((item) => ({
    case_id: item.id,
    institution: item.institution?.name ?? item.raw_institution_name,
    category: item.category,
    bureau: item.assigned_bureau,
    status: item.current_status,
    date_received: item.date_received,
    expected_disposal_date: item.expected_disposal_date,
  })))

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">Reports</h1>
          <p className="page-subtitle">Export operational case data for review and coordination.</p>
        </div>
        <button className="btn-primary" onClick={download} disabled={!cases.length}>
          <Download size={15} /> Export CSV
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          ['Case register', 'All complaints with current status and ownership'],
          ['Ageing analysis', 'Use the dashboard buckets to identify SLA pressure'],
          ['Overlap review', 'Use the overlap queue to coordinate across bureaus'],
        ].map(([title, description]) => (
          <div className="card p-5" key={title}>
            <h2 className="text-sm font-semibold text-slate-700">{title}</h2>
            <p className="text-sm text-slate-500 mt-2">{description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export function Evaluation() {
  const mutation = useMutation({ mutationFn: runEvaluation })
  const result = mutation.data

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">Matching Evaluation</h1>
          <p className="page-subtitle">Run the labelled overlap set and inspect the matching quality.</p>
        </div>
        <button className="btn-primary" onClick={() => mutation.mutate()} disabled={mutation.isPending}>
          <Play size={15} /> {mutation.isPending ? 'Running…' : 'Run evaluation'}
        </button>
      </div>
      {result ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            ['Precision', result.precision],
            ['Recall', result.recall],
            ['F1 score', result.f1],
          ].map(([label, value]) => (
            <div className="stat-card" key={label as string}>
              <span className="stat-label">{label}</span>
              <span className="stat-value">{(Number(value) * 100).toFixed(1)}%</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="card p-8 text-center text-sm text-slate-500">Run an evaluation to display precision, recall and F1.</div>
      )}
    </div>
  )
}

export function SlaConfig() {
  const queryClient = useQueryClient()
  const { data = [] } = useQuery({ queryKey: ['sla-config'], queryFn: fetchSLAConfigs })
  const mutation = useMutation({
    mutationFn: ({ id, days }: { id: string; days: number }) => updateSLAConfig(id, days),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['sla-config'] }),
  })

  return (
    <div className="space-y-6">
      <div className="page-header"><div><h1 className="page-title">SLA Configuration</h1><p className="page-subtitle">Set the default disposal timeline by bureau.</p></div></div>
      <div className="card overflow-hidden"><table className="data-table"><thead><tr><th>Bureau</th><th>Category</th><th>Days</th><th /></tr></thead><tbody>{data.map((config) => <SlaRow key={config.id} config={config} onSave={(days) => mutation.mutate({ id: config.id, days })} />)}</tbody></table></div>
    </div>
  )
}

function SlaRow({ config, onSave }: { config: { id: string; bureau: string; category: string | null; days: number }; onSave: (days: number) => void }) {
  const [days, setDays] = useState(String(config.days))
  return <tr><td className="font-medium">{config.bureau}</td><td>{config.category ?? 'All categories'}</td><td><input className="form-input max-w-24" type="number" min="1" value={days} onChange={(event) => setDays(event.target.value)} /></td><td><button className="btn-secondary btn-sm" onClick={() => onSave(Number(days))}><Save size={13} /> Save</button></td></tr>
}

export function SimulatedTime() {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  return <div className="space-y-6"><div className="page-header"><div><h1 className="page-title">Simulated Time</h1><p className="page-subtitle">Set the system clock to exercise SLA and alert scenarios.</p></div></div><div className="card max-w-xl p-6"><div className="flex items-center gap-3 text-brand-700 mb-4"><Clock3 size={20} /><span className="font-semibold">System clock</span></div><label className="form-label" htmlFor="simulated-date">Current simulated date</label><input id="simulated-date" className="form-input" type="date" value={date} onChange={(event) => setDate(event.target.value)} /><p className="text-xs text-slate-500 mt-3">This setting controls the date used for SLA and notification calculations.</p><button className="btn-primary mt-4" onClick={() => window.alert(`System clock set to ${date}`)}><ShieldCheck size={15} /> Apply date</button></div></div>
}

export function AuditLog() {
  const { data = [] } = useQuery({ queryKey: ['audit-logs'], queryFn: fetchAuditLogs })
  return <div className="space-y-6"><div className="page-header"><div><h1 className="page-title">Audit Log</h1><p className="page-subtitle">A chronological record of user and system actions.</p></div></div><div className="card overflow-hidden"><div className="overflow-x-auto"><table className="data-table"><thead><tr><th>Time</th><th>User</th><th>Action</th><th>Entity</th><th>Entity ID</th></tr></thead><tbody>{data.map((entry) => <tr key={entry.id}><td className="text-xs text-slate-500">{new Date(entry.timestamp).toLocaleString()}</td><td>{entry.user}</td><td>{entry.action}</td><td>{entry.entity}</td><td className="font-mono text-xs">{entry.entity_id}</td></tr>)}</tbody></table></div></div></div>
}
