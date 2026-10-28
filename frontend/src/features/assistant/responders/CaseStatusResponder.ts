import type { Translator } from '../../../i18n'
import { extractCaseId } from '../../../services/publicCases'
import type { CaseStatusSource, PublicCaseStatus } from '../../../services/publicCases'
import type { Query } from '../core/Query'
import type { Responder } from '../core/Responder'
import type { AssistantReply } from '../types'

/** Answers any question that contains a case ID (for example CMP-2024-0002) with that case's public status. */
export class CaseStatusResponder implements Responder {
  private readonly source: CaseStatusSource
  private readonly translator: Translator

  constructor(source: CaseStatusSource, translator: Translator) {
    this.source = source
    this.translator = translator
  }

  respond(query: Query): AssistantReply | null {
    const caseId = extractCaseId(query.raw)
    if (!caseId) return null

    const status = this.source.findByCaseId(caseId)
    return status ? this.describe(status) : this.notFound(caseId)
  }

  private describe(status: PublicCaseStatus): AssistantReply {
    const { t, list, date } = this.translator
    return {
      text: t('assistant.caseStatus.summary', {
        caseId: status.caseId,
        category: t(`caseCategory.${status.category}`),
        status: t(`caseStatus.${status.status}`).toLocaleLowerCase(),
        institution: status.institutionName,
      }),
      details: [
        t('assistant.caseStatus.handledBy', { value: t(`bureau.${status.bureau}`) }),
        t('assistant.caseStatus.receivedOn', { value: date(status.receivedOn) }),
        t('assistant.caseStatus.latestStep', { value: status.latestStep }),
        t('assistant.caseStatus.expectedDisposal', { value: date(status.expectedDisposal) }),
      ],
      links: [{ label: t('assistant.caseStatus.timelineLink'), to: `/track?case=${status.caseId}` }],
      suggestions: list('assistant.caseStatus.suggestions'),
    }
  }

  private notFound(caseId: string): AssistantReply {
    const { t, list } = this.translator
    return {
      text: t('assistant.caseStatus.notFound', { caseId }),
      suggestions: list('assistant.caseStatus.notFoundSuggestions'),
    }
  }
}
