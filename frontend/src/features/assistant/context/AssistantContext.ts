import { createContext, useContext } from 'react'
import type { ChatSession } from '../hooks/useChatSession'

export interface AssistantControls extends ChatSession {
  isOpen: boolean
  open(): void
  close(): void
  /** Opens the chat panel and sends the question, as if the visitor had typed it. */
  ask(question: string): void
}

export const AssistantContext = createContext<AssistantControls | null>(null)

/** Access the shared assistant from any component rendered inside `AssistantProvider`. */
export function useAssistant(): AssistantControls {
  const controls = useContext(AssistantContext)
  if (!controls) throw new Error('useAssistant must be used inside an AssistantProvider')
  return controls
}
