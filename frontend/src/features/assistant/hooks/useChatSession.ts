import { useCallback, useEffect, useRef, useState } from 'react'
import type { ChatAssistant } from '../core/ChatAssistant'
import type { AssistantReply, ChatMessage } from '../types'

export interface ChatSession {
  messages: ChatMessage[]
  isTyping: boolean
  send(text: string): void
}

const MIN_TYPING_MS = 450
const MAX_TYPING_MS = 1400
const TYPING_MS_PER_CHAR = 4

/** A short pause before each reply, longer for longer answers, so the conversation reads naturally. */
function typingDelay(reply: AssistantReply): number {
  return Math.min(MAX_TYPING_MS, MIN_TYPING_MS + reply.text.length * TYPING_MS_PER_CHAR)
}

/** Holds one conversation with an assistant: the message list, the typing state and a `send` action. */
export function useChatSession(assistant: ChatAssistant): ChatSession {
  const nextId = useRef(0)
  const createId = useCallback(() => `message-${nextId.current++}`, [])

  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    { id: 'greeting', author: 'assistant', reply: assistant.greeting },
  ])
  const [pendingReplies, setPendingReplies] = useState(0)

  const timers = useRef(new Set<number>())
  useEffect(() => {
    const activeTimers = timers.current
    return () => activeTimers.forEach((timer) => window.clearTimeout(timer))
  }, [])

  const send = useCallback((text: string) => {
    const question = text.trim()
    if (!question) return

    const reply = assistant.reply(question)
    setMessages((current) => [...current, { id: createId(), author: 'visitor', text: question }])
    setPendingReplies((count) => count + 1)

    const timer = window.setTimeout(() => {
      timers.current.delete(timer)
      setMessages((current) => [...current, { id: createId(), author: 'assistant', reply }])
      setPendingReplies((count) => count - 1)
    }, typingDelay(reply))
    timers.current.add(timer)
  }, [assistant, createId])

  return { messages, isTyping: pendingReplies > 0, send }
}
