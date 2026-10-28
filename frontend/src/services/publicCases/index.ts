import { mockCases, mockInstitutions } from '../../mocks/data'
import { MockCaseStatusSource } from './MockCaseStatusSource'
import type { CaseStatusSource } from './types'

export type { CaseStatusSource, ProgressKind, ProgressState, ProgressStep, PublicCaseStatus } from './types'
export { extractCaseId, SAMPLE_CASE_ID } from './caseId'

/**
 * The single source of public case status for the website. The tracker page and the assistant both
 * read from it, so they always agree. Replace it with a backend-backed source when one exists.
 */
export const publicCaseStatusSource: CaseStatusSource = new MockCaseStatusSource(mockCases, mockInstitutions)
