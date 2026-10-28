import { ReactNode, useMemo } from 'react'
import { useTranslation } from '../../../i18n'
import { createPublicAssistant } from '../createPublicAssistant'
import { AssistantProvider } from './AssistantProvider'

/**
 * Provides the public-site assistant in the visitor's current language.
 *
 * Changing the language starts a fresh conversation, so earlier messages never mix languages.
 */
export function PublicAssistantProvider({ children }: { children: ReactNode }) {
  const translator = useTranslation()
  const assistant = useMemo(() => createPublicAssistant(translator), [translator])

  return <AssistantProvider key={translator.locale} assistant={assistant}>{children}</AssistantProvider>
}
