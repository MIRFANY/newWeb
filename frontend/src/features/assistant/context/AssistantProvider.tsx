import { ReactNode, useCallback, useMemo, useState } from 'react'
import type { ChatAssistant } from '../core/ChatAssistant'
import { useChatSession } from '../hooks/useChatSession'
import { AssistantContext, AssistantControls } from './AssistantContext'

/**
 * Shares one assistant conversation with everything below it.
 *
 * Mount it above the router's routes so the conversation survives navigation between pages.
 */
export function AssistantProvider({ assistant, children }: { assistant: ChatAssistant; children: ReactNode }) {
  const { messages, isTyping, send } = useChatSession(assistant)
  const [isOpen, setIsOpen] = useState(false)

  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])
  const ask = useCallback((question: string) => {
    setIsOpen(true)
    send(question)
  }, [send])

  const controls = useMemo<AssistantControls>(
    () => ({ messages, isTyping, send, isOpen, open, close, ask }),
    [messages, isTyping, send, isOpen, open, close, ask],
  )

  return <AssistantContext.Provider value={controls}>{children}</AssistantContext.Provider>
}
