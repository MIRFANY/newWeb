import type { Translator } from '../../i18n'
import { mockInstitutions } from '../../mocks/data'
import { publicCaseStatusSource } from '../../services/publicCases'
import { ChatAssistant } from './core/ChatAssistant'
import { buildPublicKnowledgeBase } from './content/buildPublicKnowledgeBase'
import { CaseStatusResponder } from './responders/CaseStatusResponder'
import { HelpMenuResponder } from './responders/HelpMenuResponder'
import { InstitutionResponder } from './responders/InstitutionResponder'
import { KnowledgeBaseResponder } from './responders/KnowledgeBaseResponder'
import { AliasInstitutionDirectory } from './sources/AliasInstitutionDirectory'

const institutionDirectory = new AliasInstitutionDirectory(mockInstitutions)

/**
 * Builds the assistant used on the public website, answering in the translator's language.
 *
 * Case status comes from the shared public case source, so answers match the tracker page. To answer
 * from a backend, swap the `CaseStatusSource` and `InstitutionDirectory` implementations; the responders
 * and UI stay as they are.
 */
export function createPublicAssistant(translator: Translator): ChatAssistant {
  const knowledgeBase = buildPublicKnowledgeBase(translator)
  return new ChatAssistant({
    greeting: knowledgeBase.greeting,
    responders: [
      new CaseStatusResponder(publicCaseStatusSource, translator),
      new InstitutionResponder(institutionDirectory, translator),
      new KnowledgeBaseResponder(knowledgeBase.intents),
    ],
    fallback: new HelpMenuResponder(translator.t('assistant.fallback'), knowledgeBase.starterQuestions),
  })
}
