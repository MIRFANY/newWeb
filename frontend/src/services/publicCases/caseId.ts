const CASE_ID_PATTERN = /\bCMP-\d{4}-\d{4}\b/i

/** Case ID used when the tracker is opened without one, so the page shows a worked example. */
export const SAMPLE_CASE_ID = 'CMP-2024-0002'

/** Finds the first case ID in free text, such as "status of cmp-2024-0005?", and returns it upper-cased. */
export function extractCaseId(text: string): string | undefined {
  return text.match(CASE_ID_PATTERN)?.[0].toUpperCase()
}
