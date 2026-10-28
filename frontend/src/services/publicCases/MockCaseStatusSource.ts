import type { Case, Institution } from '../../types'
import type { CaseStatusSource, ProgressStep, PublicCaseStatus } from './types'

/**
 * Builds the public timeline from fields that are safe to show: dates, the handling bureau and the
 * latest recorded action. Officer names and internal remarks are left out.
 */
function buildProgress(record: Case): ProgressStep[] {
  const steps: ProgressStep[] = [
    { kind: 'received', state: 'done', date: record.date_received },
    { kind: 'registered', state: 'done', date: record.date_received },
  ]

  if (record.current_status === 'Disposed') {
    steps.push({ kind: 'closure', state: 'done', date: record.last_action_date, note: record.last_action })
    return steps
  }

  if (record.last_action_date !== record.date_received) {
    steps.push({ kind: 'action', state: 'done', date: record.last_action_date, note: record.last_action })
  }
  steps.push(
    { kind: 'review', state: 'current' },
    { kind: 'closure', state: 'upcoming', date: record.expected_disposal_date },
  )
  return steps
}

/** Reads public case status from in-memory case and institution lists, such as the mock data set. */
export class MockCaseStatusSource implements CaseStatusSource {
  private readonly cases: readonly Case[]
  private readonly institutions: readonly Institution[]

  constructor(cases: readonly Case[], institutions: readonly Institution[]) {
    this.cases = cases
    this.institutions = institutions
  }

  findByCaseId(caseId: string): PublicCaseStatus | undefined {
    const record = this.cases.find((item) => item.id === caseId)
    if (!record) return undefined

    const institution = this.institutions.find((item) => item.id === record.institution_id)
    return {
      caseId: record.id,
      category: record.category,
      institutionName: institution?.name ?? record.raw_institution_name,
      status: record.current_status,
      bureau: record.assigned_bureau,
      receivedOn: record.date_received,
      expectedDisposal: record.expected_disposal_date,
      latestStep: record.last_action,
      progress: buildProgress(record),
    }
  }
}
