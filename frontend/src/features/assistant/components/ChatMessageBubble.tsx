import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import type { ChatMessage } from '../types'

interface ChatMessageBubbleProps {
  message: ChatMessage
  /** Called when the visitor follows a link in the reply. */
  onNavigate(): void
}

export function ChatMessageBubble({ message, onNavigate }: ChatMessageBubbleProps) {
  if (message.author === 'visitor') {
    return <div className="chat-bubble chat-bubble-visitor">{message.text}</div>
  }

  const { text, details, links } = message.reply
  return (
    <div className="chat-bubble chat-bubble-assistant">
      <p>{text}</p>
      {details && (
        <ul className="chat-details">
          {details.map((detail) => <li key={detail}>{detail}</li>)}
        </ul>
      )}
      {links && (
        <div className="chat-links">
          {links.map((link) => (
            <Link key={link.to} to={link.to} onClick={onNavigate}>
              {link.label} <ArrowRight size={13} />
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
