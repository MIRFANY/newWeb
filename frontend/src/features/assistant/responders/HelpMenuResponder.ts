import type { FallbackResponder } from '../core/Responder'
import type { AssistantReply } from '../types'

/** Replies to anything the other responders could not place, by listing questions the assistant can answer. */
export class HelpMenuResponder implements FallbackResponder {
  private readonly message: string
  private readonly suggestions: readonly string[]

  constructor(message: string, suggestions: readonly string[]) {
    this.message = message
    this.suggestions = suggestions
  }

  respond(): AssistantReply {
    return { text: this.message, suggestions: [...this.suggestions] }
  }
}
