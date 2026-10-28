import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from 'react'
import { Bot, MessageCircle, SendHorizontal, X } from 'lucide-react'
import { useTranslation } from '../../../i18n'
import { useAssistant } from '../context/AssistantContext'
import type { ChatMessage } from '../types'
import { ChatMessageBubble } from './ChatMessageBubble'
import './ChatWidget.css'

/** Follow-up chips come from the latest assistant reply, and only while the assistant is not typing. */
function currentSuggestions(messages: ChatMessage[], isTyping: boolean): string[] {
  const last = messages[messages.length - 1]
  if (isTyping || last?.author !== 'assistant') return []
  return last.reply.suggestions ?? []
}

/** Floating launcher and chat panel for the shared assistant. Render once per page layout. */
export function ChatWidget() {
  const { t } = useTranslation()
  const { messages, isTyping, isOpen, open, close, send } = useAssistant()
  const [draft, setDraft] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const logRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) inputRef.current?.focus()
  }, [isOpen])

  useEffect(() => {
    const log = logRef.current
    if (log) log.scrollTop = log.scrollHeight
  }, [messages, isTyping, isOpen])

  const submit = (event: FormEvent) => {
    event.preventDefault()
    send(draft)
    setDraft('')
  }

  const closeOnEscape = (event: KeyboardEvent) => {
    if (event.key === 'Escape') close()
  }

  const suggestions = currentSuggestions(messages, isTyping)

  return (
    <div className="chat-widget">
      {isOpen && (
        <section className="chat-panel" role="dialog" aria-label={t('assistant.ui.dialogLabel')} onKeyDown={closeOnEscape}>
          <header className="chat-header">
            <span className="chat-avatar"><Bot size={20} /></span>
            <div>
              <strong>{t('assistant.ui.title')}</strong>
              <span><i className="chat-online-dot" /> {t('assistant.ui.subtitle')}</span>
            </div>
            <button type="button" className="chat-icon-button" aria-label={t('assistant.ui.close')} onClick={close}><X size={18} /></button>
          </header>

          <div className="chat-log" ref={logRef} aria-live="polite">
            {messages.map((message) => <ChatMessageBubble key={message.id} message={message} onNavigate={close} />)}
            {isTyping && <div className="chat-typing" role="status" aria-label={t('assistant.ui.typing')}><span /><span /><span /></div>}
          </div>

          {suggestions.length > 0 && (
            <div className="chat-suggestions">
              {suggestions.map((suggestion) => (
                <button type="button" key={suggestion} onClick={() => send(suggestion)}>{suggestion}</button>
              ))}
            </div>
          )}

          <form className="chat-composer" onSubmit={submit}>
            <input
              ref={inputRef}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder={t('assistant.ui.placeholder')}
              aria-label={t('assistant.ui.inputLabel')}
            />
            <button type="submit" className="chat-send" aria-label={t('assistant.ui.send')} disabled={!draft.trim()}><SendHorizontal size={18} /></button>
          </form>
        </section>
      )}

      <button type="button" className="chat-launcher" aria-expanded={isOpen} onClick={isOpen ? close : open}>
        {isOpen ? <X size={20} /> : <MessageCircle size={20} />}
        <span>{isOpen ? t('assistant.ui.launcherClose') : t('assistant.ui.launcher')}</span>
      </button>
    </div>
  )
}
