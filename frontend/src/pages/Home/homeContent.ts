import {
  AlertTriangle,
  CheckCircle2,
  ClipboardList,
  Clock3,
  GitMerge,
  LockKeyhole,
  ScrollText,
  ShieldCheck,
  Sparkles,
  Target,
  UserCheck,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { TextKey } from '../../i18n'
import { mockEvaluationResult } from '../../mocks/data'
import type { CaseCategory, CaseStatus } from '../../types'
import { formatPercent } from '../../utils/formatPercent'

/**
 * Structure of the landing page: icons, figures and the translation key for each piece of text.
 * The words themselves live in the locale files under `home.*`.
 */

export type Tone = 'blue' | 'green' | 'violet' | 'amber'

export interface IconCard {
  icon: LucideIcon
  titleKey: TextKey
  textKey: TextKey
}

export interface PublicStat {
  icon: LucideIcon
  value: string
  labelKey: TextKey
  tone: Tone
}

export interface ExampleCase {
  bureau: 'RB' | 'PGRC'
  caseId: string
  category: CaseCategory
  /** Kept as written in the complaint, since the point is that spellings differ. */
  institutionAsWritten: string
  complaintKey: TextKey
  raisedOn: string
  status: CaseStatus
}

export const publicStats: PublicStat[] = [
  { icon: ClipboardList, value: '1,284', labelKey: 'home.stats.received', tone: 'blue' },
  { icon: CheckCircle2, value: '421', labelKey: 'home.stats.disposed', tone: 'green' },
  { icon: GitMerge, value: '4', labelKey: 'home.stats.bureaus', tone: 'violet' },
  { icon: AlertTriangle, value: '23', labelKey: 'home.stats.overlaps', tone: 'amber' },
]

export const highlights: IconCard[] = [
  { icon: ShieldCheck, titleKey: 'home.highlights.trustedRecordTitle', textKey: 'home.highlights.trustedRecordText' },
  { icon: Sparkles, titleKey: 'home.highlights.matchingTitle', textKey: 'home.highlights.matchingText' },
  { icon: Clock3, titleKey: 'home.highlights.timelinesTitle', textKey: 'home.highlights.timelinesText' },
]

/** One overlapping pair, used by both the hero preview and the explanation section. */
export const exampleOverlap: [ExampleCase, ExampleCase] = [
  {
    bureau: 'RB',
    caseId: 'CMP-2601',
    category: 'Fees',
    institutionAsWritten: 'Sri Venkateshwara Inst. of Tech.',
    complaintKey: 'home.explainer.rbComplaint',
    raisedOn: '2026-10-03',
    status: 'Under Process',
  },
  {
    bureau: 'PGRC',
    caseId: 'CMP-2602',
    category: 'Fees',
    institutionAsWritten: 'Sri Venkateshwara Institute of Technology',
    complaintKey: 'home.explainer.pgrcComplaint',
    raisedOn: '2026-10-09',
    status: 'Pending',
  },
]

export const trustPoints: IconCard[] = [
  { icon: LockKeyhole, titleKey: 'home.trust.roleTitle', textKey: 'home.trust.roleText' },
  { icon: ScrollText, titleKey: 'home.trust.auditTitle', textKey: 'home.trust.auditText' },
  { icon: Target, titleKey: 'home.trust.qualityTitle', textKey: 'home.trust.qualityText' },
  { icon: UserCheck, titleKey: 'home.trust.decideTitle', textKey: 'home.trust.decideText' },
]

/** Matching quality figures, filled into any text that mentions {{precision}} or {{recall}}. */
export const evaluationFigures = {
  precision: formatPercent(mockEvaluationResult.precision),
  recall: formatPercent(mockEvaluationResult.recall),
}
