/**
 * Mock API layer — mirrors backend endpoint signatures.
 * All functions return realistic data from mocks with simulated latency.
 * Replace with real axios calls when the backend is ready.
 */

import {
  mockCases,
  mockInstitutions,
  mockOverlapGroups,
  mockAlerts,
  mockAuditLogs,
  mockSLAConfigs,
  mockDashboardStats,
  mockBureauWorkload,
  mockAgeingBuckets,
  mockRegionStats,
  mockMonthlyTrend,
  mockEvaluationResult,
  mockCaseActions,
} from '../mocks/data';

import type {
  Case,
  Institution,
  OverlapGroup,
  Alert,
  AuditLog,
  SLAConfig,
  DashboardStats,
  BureauWorkload,
  AgeingBucket,
  RegionStat,
  MonthlyTrend,
  EvaluationResult,
  PaginatedResponse,
  CaseStatus,
  Bureau,
  OverlapStatus,
  CaseAction,
} from '../types';

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

// ─── Dashboard ────────────────────────────────────────────────────────────────

export async function fetchDashboardStats(): Promise<DashboardStats> {
  await delay(200);
  return { ...mockDashboardStats };
}

export async function fetchBureauWorkload(): Promise<BureauWorkload[]> {
  await delay(200);
  return [...mockBureauWorkload];
}

export async function fetchAgeingBuckets(): Promise<AgeingBucket[]> {
  await delay(200);
  return [...mockAgeingBuckets];
}

export async function fetchRegionStats(): Promise<RegionStat[]> {
  await delay(200);
  return [...mockRegionStats];
}

export async function fetchMonthlyTrend(): Promise<MonthlyTrend[]> {
  await delay(200);
  return [...mockMonthlyTrend];
}

// ─── Cases ────────────────────────────────────────────────────────────────────

export interface CaseSearchParams {
  q?: string;
  case_id?: string;
  bureau?: Bureau | '';
  region?: string;
  category?: string;
  status?: CaseStatus | '';
  date_from?: string;
  date_to?: string;
  needs_manual_mapping?: boolean;
  page?: number;
  page_size?: number;
}

export async function fetchCases(params: CaseSearchParams = {}): Promise<PaginatedResponse<Case>> {
  await delay();
  let results = [...mockCases];

  if (params.q) {
    const q = params.q.toLowerCase();
    results = results.filter(
      (c) =>
        c.raw_institution_name.toLowerCase().includes(q) ||
        c.institution?.name.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
    );
  }
  if (params.case_id) results = results.filter((c) => c.id.toLowerCase().includes(params.case_id!.toLowerCase()));
  if (params.bureau) results = results.filter((c) => c.assigned_bureau === params.bureau);
  if (params.category) results = results.filter((c) => c.category === params.category);
  if (params.status) results = results.filter((c) => c.current_status === params.status);
  if (params.needs_manual_mapping !== undefined) results = results.filter((c) => c.needs_manual_mapping === params.needs_manual_mapping);
  if (params.date_from) results = results.filter((c) => c.date_received >= params.date_from!);
  if (params.date_to) results = results.filter((c) => c.date_received <= params.date_to!);

  const page = params.page ?? 1;
  const page_size = params.page_size ?? 15;
  const total = results.length;
  const start = (page - 1) * page_size;
  const items = results.slice(start, start + page_size).map((c) => ({
    ...c,
    institution: mockInstitutions.find((i) => i.id === c.institution_id),
  }));

  return { items, total, page, page_size, total_pages: Math.ceil(total / page_size) };
}

export async function fetchCase(id: string): Promise<Case & { actions: CaseAction[] }> {
  await delay();
  const c = mockCases.find((c) => c.id === id);
  if (!c) throw new Error(`Case ${id} not found`);
  return {
    ...c,
    institution: mockInstitutions.find((i) => i.id === c.institution_id),
    actions: mockCaseActions[id] ?? [],
  };
}

export async function updateCaseStatus(id: string, status: CaseStatus, remarks: string): Promise<Case> {
  await delay(500);
  const c = mockCases.find((c) => c.id === id);
  if (!c) throw new Error('Not found');
  c.current_status = status;
  c.last_action = remarks;
  c.last_action_date = new Date().toISOString().slice(0, 10);
  return { ...c };
}

export async function createCase(data: Partial<Case>): Promise<Case> {
  await delay(600);
  const newCase: Case = {
    id: `CMP-2024-${String(mockCases.length + 1).padStart(4, '0')}`,
    institution_id: null,
    raw_institution_name: data.raw_institution_name ?? '',
    category: data.category ?? 'Other',
    description: data.description ?? '',
    source: data.source ?? 'Online Portal',
    date_received: new Date().toISOString().slice(0, 10),
    current_status: 'Pending',
    assigned_bureau: data.assigned_bureau ?? 'RB',
    assigned_officer: data.assigned_officer ?? '',
    last_action: 'Case registered',
    next_action: 'Await review',
    last_action_date: new Date().toISOString().slice(0, 10),
    expected_disposal_date: new Date(Date.now() + 45 * 86400000).toISOString().slice(0, 10),
    confidence_score: Math.random() * 0.4 + 0.5,
    needs_manual_mapping: false,
    overlap_group_id: null,
  };
  mockCases.push(newCase);
  return newCase;
}

// ─── Institutions ─────────────────────────────────────────────────────────────

export async function fetchInstitutions(q?: string): Promise<Institution[]> {
  await delay();
  if (!q) return [...mockInstitutions];
  const lower = q.toLowerCase();
  return mockInstitutions.filter(
    (i) =>
      i.name.toLowerCase().includes(lower) ||
      i.aliases.some((a) => a.toLowerCase().includes(lower)) ||
      i.aicte_permanent_id.toLowerCase().includes(lower)
  );
}

export async function fetchInstitution(id: string): Promise<Institution & { cases: Case[] }> {
  await delay();
  const inst = mockInstitutions.find((i) => i.id === id);
  if (!inst) throw new Error(`Institution ${id} not found`);
  const cases = mockCases.filter((c) => c.institution_id === id);
  return { ...inst, cases };
}

// ─── Overlaps ─────────────────────────────────────────────────────────────────

export async function fetchOverlapGroups(status?: OverlapStatus): Promise<OverlapGroup[]> {
  await delay();
  const groups = mockOverlapGroups.map((g) => ({
    ...g,
    cases: g.case_ids.map((cid) => mockCases.find((c) => c.id === cid)!).filter(Boolean),
  }));
  if (status) return groups.filter((g) => g.status === status);
  return groups;
}

export async function fetchOverlapGroup(id: string): Promise<OverlapGroup> {
  await delay();
  const g = mockOverlapGroups.find((g) => g.id === id);
  if (!g) throw new Error('Group not found');
  return {
    ...g,
    cases: g.case_ids.map((cid) => mockCases.find((c) => c.id === cid)!).filter(Boolean),
  };
}

export async function linkOverlapGroup(id: string, leadBureau: Bureau, note: string): Promise<OverlapGroup> {
  await delay(500);
  const g = mockOverlapGroups.find((g) => g.id === id);
  if (!g) throw new Error('Not found');
  g.status = 'Linked';
  g.lead_bureau = leadBureau;
  g.notes = g.notes ?? [];
  g.notes.push({ id: `on${Date.now()}`, group_id: id, author: 'Current User', author_role: 'Admin', text: note, timestamp: new Date().toISOString() });
  return { ...g };
}

export async function dismissOverlapGroup(id: string, remarks: string): Promise<OverlapGroup> {
  await delay(500);
  const g = mockOverlapGroups.find((g) => g.id === id);
  if (!g) throw new Error('Not found');
  g.status = 'Dismissed';
  g.notes = g.notes ?? [];
  g.notes.push({ id: `on${Date.now()}`, group_id: id, author: 'Current User', author_role: 'Admin', text: `Dismissed: ${remarks}`, timestamp: new Date().toISOString() });
  return { ...g };
}

export async function addOverlapNote(groupId: string, text: string, author: string): Promise<void> {
  await delay(300);
  const g = mockOverlapGroups.find((g) => g.id === groupId);
  if (!g) throw new Error('Not found');
  g.notes = g.notes ?? [];
  g.notes.push({ id: `on${Date.now()}`, group_id: groupId, author, author_role: 'Admin', text, timestamp: new Date().toISOString() });
}

// ─── Alerts ───────────────────────────────────────────────────────────────────

export async function fetchAlerts(): Promise<Alert[]> {
  await delay(150);
  return [...mockAlerts].sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export async function markAlertRead(id: string): Promise<void> {
  const a = mockAlerts.find((a) => a.id === id);
  if (a) a.is_read = true;
}

export async function markAllAlertsRead(): Promise<void> {
  mockAlerts.forEach((a) => (a.is_read = true));
}

// ─── SLA Configs ──────────────────────────────────────────────────────────────

export async function fetchSLAConfigs(): Promise<SLAConfig[]> {
  await delay();
  return [...mockSLAConfigs];
}

export async function updateSLAConfig(id: string, days: number): Promise<SLAConfig> {
  await delay(400);
  const cfg = mockSLAConfigs.find((c) => c.id === id);
  if (!cfg) throw new Error('Not found');
  cfg.days = days;
  return { ...cfg };
}

// ─── Audit Logs ───────────────────────────────────────────────────────────────

export async function fetchAuditLogs(): Promise<AuditLog[]> {
  await delay();
  return [...mockAuditLogs].sort((a, b) => b.timestamp.localeCompare(a.timestamp));
}

// ─── Evaluation ───────────────────────────────────────────────────────────────

export async function runEvaluation(): Promise<EvaluationResult> {
  await delay(1500); // simulate computation
  return { ...mockEvaluationResult };
}

// ─── Reports (CSV export) ─────────────────────────────────────────────────────

export function exportCSV(filename: string, rows: Record<string, unknown>[]): void {
  if (!rows.length) return;
  const headers = Object.keys(rows[0]);
  const csv = [
    headers.join(','),
    ...rows.map((r) =>
      headers.map((h) => {
        const val = r[h];
        const s = val === null || val === undefined ? '' : String(val);
        return s.includes(',') || s.includes('"') ? `"${s.replace(/"/g, '""')}"` : s;
      }).join(',')
    ),
  ].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
