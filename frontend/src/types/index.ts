// ─── Users & Auth ────────────────────────────────────────────────────────────

export type Role =
  | 'Admin'
  | 'RB_Officer'
  | 'PGRC_Officer'
  | 'Regional_Officer'
  | 'Senior_Management';

export type Bureau = 'RB' | 'PGRC' | 'Regional' | 'Admin';

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: Role;
  bureau: Bureau;
  region?: string;
  is_active: boolean;
}

export interface AuthTokens {
  access_token: string;
  token_type: string;
  user: User;
}

// ─── Institutions ─────────────────────────────────────────────────────────────

export interface Institution {
  id: string;
  aicte_permanent_id: string;
  name: string;
  aliases: string[];
  address: string;
  region: Region;
  state: string;
  created_at: string;
}

export type Region =
  | 'North'
  | 'South'
  | 'East'
  | 'West'
  | 'Central'
  | 'North-East';

// ─── Cases ────────────────────────────────────────────────────────────────────

export type CaseStatus =
  | 'Pending'
  | 'Under Process'
  | 'Disposed'
  | 'Transferred'
  | 'Escalated';

export type CaseCategory =
  | 'Fees'
  | 'Accreditation'
  | 'Infrastructure'
  | 'Faculty'
  | 'Admission'
  | 'Examination'
  | 'Harassment'
  | 'Other';

export interface Case {
  id: string; // case_id UUID
  institution_id: string | null;
  raw_institution_name: string;
  category: CaseCategory;
  description: string;
  source: string;
  date_received: string;
  current_status: CaseStatus;
  assigned_bureau: Bureau;
  assigned_officer: string;
  last_action: string;
  next_action: string;
  last_action_date: string;
  expected_disposal_date: string;
  confidence_score: number;
  needs_manual_mapping: boolean;
  overlap_group_id?: string | null;
  institution?: Institution;
}

export interface CaseAction {
  id: string;
  case_id: string;
  action_type: string;
  from_bureau: Bureau | null;
  to_bureau: Bureau | null;
  officer: string;
  remarks: string;
  document_url: string | null;
  timestamp: string;
}

// ─── Overlaps ─────────────────────────────────────────────────────────────────

export type OverlapStatus = 'Open' | 'Linked' | 'Dismissed';

export interface OverlapGroup {
  id: string;
  institution_id: string;
  institution_name: string;
  case_ids: string[];
  similarity_score: number;
  reasons: string[];
  status: OverlapStatus;
  lead_bureau: Bureau | null;
  created_at: string;
  notes?: OverlapNote[];
  cases?: Case[];
}

export interface OverlapNote {
  id: string;
  group_id: string;
  author: string;
  author_role: Role;
  text: string;
  timestamp: string;
}

// ─── Alerts ───────────────────────────────────────────────────────────────────

export type AlertType = 'Overlap' | 'Pending' | 'Escalation' | 'SLA';

export interface Alert {
  id: string;
  type: AlertType;
  case_id: string | null;
  group_id: string | null;
  target_role: Role;
  message: string;
  is_read: boolean;
  created_at: string;
}

// ─── Audit ────────────────────────────────────────────────────────────────────

export interface AuditLog {
  id: string;
  user: string;
  action: string;
  entity: string;
  entity_id: string;
  before_state: Record<string, unknown> | null;
  after_state: Record<string, unknown> | null;
  timestamp: string;
}

// ─── SLA ──────────────────────────────────────────────────────────────────────

export interface SLAConfig {
  id: string;
  bureau: Bureau;
  category: CaseCategory | null;
  days: number;
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export interface DashboardStats {
  total: number;
  pending: number;
  under_process: number;
  disposed: number;
  transferred: number;
  escalated: number;
  past_sla: number;
  overlap_groups_open: number;
}

export interface BureauWorkload {
  bureau: Bureau;
  pending: number;
  under_process: number;
  disposed: number;
  escalated: number;
}

export interface AgeingBucket {
  bucket: string;
  count: number;
}

export interface RegionStat {
  region: Region;
  count: number;
}

export interface MonthlyTrend {
  month: string;
  received: number;
  disposed: number;
}

// ─── Evaluation ───────────────────────────────────────────────────────────────

export interface EvaluationResult {
  precision: number;
  recall: number;
  f1: number;
  true_positives: number;
  false_positives: number;
  false_negatives: number;
  pair_details: EvalPairDetail[];
}

export interface EvalPairDetail {
  case_a: string;
  case_b: string;
  predicted: boolean;
  actual: boolean;
  score: number;
  reasons: string[];
}

// ─── Pagination ───────────────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

// ─── Reports ──────────────────────────────────────────────────────────────────

export interface ReportFilter {
  report_type: 'bureau' | 'region' | 'institution' | 'ageing' | 'disposal' | 'overlaps' | 'monthly' | 'quarterly';
  date_from?: string;
  date_to?: string;
  bureau?: Bureau;
  region?: Region;
  institution_id?: string;
}
