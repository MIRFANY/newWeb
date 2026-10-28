import type { AssistantReply } from '../types'
import { Query } from './Query'
import type { FallbackResponder, Responder } from './Responder'

export interface ChatAssistantConfig {
  /** The first message shown when a conversation opens. */
  greeting: AssistantReply
  /** Asked in order; the first non-null answer wins, so put the most specific responders first. */
  responders: readonly Responder[]
  fallback: FallbackResponder
}

/**
 * Answers free-text questions by asking a chain of responders.
 *
 * Add a capability by writing a new `Responder` and adding it to the config; this class does not
 * change. Answers are synchronous because every responder works from local data.
 */
export class ChatAssistant {
  readonly greeting: AssistantReply
  private readonly responders: readonly Responder[]
  private readonly fallback: FallbackResponder

  constructor({ greeting, responders, fallback }: ChatAssistantConfig) {
    this.greeting = greeting
    this.responders = responders
    this.fallback = fallback
  }

  reply(text: string): AssistantReply {
    const query = new Query(text)
    for (const responder of this.responders) {
      const answer = responder.respond(query)
      if (answer) return answer
    }
    return this.fallback.respond(query)
  }
}
