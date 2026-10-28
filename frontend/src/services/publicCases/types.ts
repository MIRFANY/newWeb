import type { Bureau, CaseCategory, CaseStatus } from '../../types'

export type ProgressState = 'done' | 'current' | 'upcoming'

/** What a timeline step records. The screen turns each kind into words in the visitor's language. */
export type ProgressKind = 'received' | 'registered' | 'action' | 'review' | 'closure'

/** One step on the public progress timeline of a case. */
export interface ProgressStep {
  kind: ProgressKind
  state: ProgressState
  /** ISO date (yyyy-mm-dd). For an upcoming closure, the expected date. */
  date?: string
  /** The recorded action text, as entered by the office. */
  note?: string
}

/**
 * The part of a case a member of the public may see. Internal notes and coordination are never
 * included. Values are codes and ISO dates; translate and format them where they are shown.
 */
export interface PublicCaseStatus {
  caseId: string
  category: CaseCategory
  institutionName: string
  status: CaseStatus
  bureau: Bureau
  receivedOn: string
  expectedDisposal: string
  latestStep: string
  progress: ProgressStep[]
}

export interface CaseStatusSource {
  /** Looks a case up by its exact, upper-case ID. Use `extractCaseId` to read an ID from free text. */
  findByCaseId(caseId: string): PublicCaseStatus | undefined
}
