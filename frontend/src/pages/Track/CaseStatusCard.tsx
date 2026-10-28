import { SearchX } from 'lucide-react'
import { useTranslation } from '../../i18n'
import type { Translator } from '../../i18n'
import type { ProgressState, ProgressStep, PublicCaseStatus } from '../../services/publicCases'
import type { Bureau, CaseStatus } from '../../types'

const statusTone: Record<CaseStatus, string> = {
  'Pending': 'pending',
  'Under Process': 'in-process',
  'Disposed': 'disposed',
  'Transferred': 'transferred',
  'Escalated': 'escalated',
}

const progressClass: Record<ProgressState, string> = {
  done: 'progress-item complete',
  current: 'progress-item current',
  upcoming: 'progress-item',
}

/** Words for one timeline step in the active language: its title and the line under it. */
function describeStep(step: ProgressStep, bureau: Bureau, { t, date }: Translator): { title: string; when: string } {
  const when = step.date ? date(step.date) : t('track.inProgress')
  switch (step.kind) {
    case 'received':
      return { title: t('track.steps.received'), when }
    case 'registered':
      return { title: t('track.steps.registered', { bureau: t(`bureau.${bureau}`) }), when }
    case 'action':
      return { title: step.note ?? '', when }
    case 'review':
      return { title: t('track.steps.review'), when: t('track.inProgress') }
    case 'closure':
      return step.state === 'done'
        ? { title: t('track.steps.closureWithNote', { note: step.note ?? '' }), when }
        : { title: t('track.steps.closure'), when: t('track.expectedBy', { date: when }) }
  }
}

export function CaseStatusCard({ status }: { status: PublicCaseStatus }) {
  const translator = useTranslation()
  const { t, date } = translator

  return (
    <article className="tracker-card">
      <div className="tracker-heading">
        <div><strong>{status.caseId}</strong><span>{t(`caseCategory.${status.category}`)} · {status.institutionName}</span></div>
        <span className={`status-pill ${statusTone[status.status]}`}>{t(`caseStatus.${status.status}`)}</span>
      </div>
      <div className="tracker-meta">
        <div><span>{t('track.handledBy')}</span><strong>{t(`bureau.${status.bureau}`)}</strong></div>
        <div><span>{t('track.receivedOn')}</span><strong>{date(status.receivedOn)}</strong></div>
        <div><span>{t('track.expectedDisposal')}</span><strong>{date(status.expectedDisposal)}</strong></div>
      </div>
      <h2>{t('track.progress')}</h2>
      <ol className="progress-list">
        {status.progress.map((step) => {
          const { title, when } = describeStep(step, status.bureau, translator)
          return (
            <li className={progressClass[step.state]} key={`${step.kind}-${step.state}`}>
              <span />
              <div><strong>{title}</strong><small>{when}</small></div>
            </li>
          )
        })}
      </ol>
    </article>
  )
}

export function CaseNotFound({ caseId }: { caseId: string }) {
  const { t } = useTranslation()
  return (
    <article className="tracker-card tracker-not-found">
      <SearchX size={28} />
      <h2>{t('track.notFoundTitle', { caseId })}</h2>
      <p>{t('track.notFoundText')}</p>
    </article>
  )
}
