import { contactDetails } from '../../../components/public/contactDetails'
import { interpolate, messagesByLocale } from '../../../i18n'
import type { Messages, TextKey, Translator, Vars } from '../../../i18n'
import { mockEvaluationResult } from '../../../mocks/data'
import { formatPercent } from '../../../utils/formatPercent'
import type { Intent } from '../responders/KnowledgeBaseResponder'
import type { AssistantLink, AssistantReply } from '../types'

type IntentId = keyof Messages['assistant']['intents']

interface IntentCopy {
  triggers: readonly string[]
  text: string
  details: readonly string[]
  suggestions: readonly string[]
}

/** Pages an intent's answer links to. The labels are translated; the routes are not. */
const intentLinks: Partial<Record<IntentId, { labelKey: TextKey; to: string }[]>> = {
  track: [{ labelKey: 'assistant.linkLabels.tracker', to: '/track' }],
  about: [
    { labelKey: 'assistant.linkLabels.about', to: '/about' },
    { labelKey: 'assistant.linkLabels.howItWorks', to: '/how-it-works' },
  ],
  bureaus: [{ labelKey: 'assistant.linkLabels.bureaus', to: '/about' }],
  officerLogin: [{ labelKey: 'assistant.linkLabels.officerLogin', to: '/login' }],
}

/** Values that answers may quote, such as {{email}} or {{precision}}. */
const answerVars: Vars = {
  ...contactDetails,
  precision: formatPercent(mockEvaluationResult.precision),
  recall: formatPercent(mockEvaluationResult.recall),
}

export interface PublicKnowledgeBase {
  greeting: AssistantReply
  starterQuestions: string[]
  intents: Intent[]
}

/**
 * Builds the assistant's scripted answers in the translator's language.
 *
 * Answers come from the active locale. Triggers from the active locale and from English are both
 * accepted, because visitors often mix languages in one question.
 */
export function buildPublicKnowledgeBase(translator: Translator): PublicKnowledgeBase {
  const { t, list, messages } = translator
  const localIntents: Record<IntentId, IntentCopy> = messages.assistant.intents
  const englishIntents: Record<IntentId, IntentCopy> = messagesByLocale.en.assistant.intents
  const starterQuestions = list('assistant.starterQuestions')
  const greeting: AssistantReply = { text: localIntents.greeting.text, suggestions: starterQuestions }

  const toReply = (id: IntentId, copy: IntentCopy): AssistantReply => {
    if (id === 'greeting') return greeting
    const links: AssistantLink[] | undefined = intentLinks[id]?.map(({ labelKey, to }) => ({ label: t(labelKey), to }))
    return {
      text: interpolate(copy.text, answerVars),
      details: copy.details.length ? copy.details.map((detail) => interpolate(detail, answerVars)) : undefined,
      links,
      suggestions: copy.suggestions.length ? [...copy.suggestions] : undefined,
    }
  }

  const intents = (Object.keys(localIntents) as IntentId[]).map((id) => ({
    id,
    triggers: [...new Set([...localIntents[id].triggers, ...englishIntents[id].triggers])],
    reply: toReply(id, localIntents[id]),
  }))

  return { greeting, starterQuestions, intents }
}
