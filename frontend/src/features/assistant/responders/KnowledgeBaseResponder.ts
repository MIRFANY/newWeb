import type { Query } from '../core/Query'
import type { Responder } from '../core/Responder'
import type { AssistantReply } from '../types'

/** A scripted answer and the phrases that call it up. */
export interface Intent {
  id: string
  /** Each phrase found in the question adds its word count to the intent's score. */
  triggers: readonly string[]
  reply: AssistantReply
}

/**
 * Answers from a fixed list of intents by picking the one whose triggers best cover the question.
 *
 * Multi-word triggers score higher than single words, so "who can see my data" beats a stray "data".
 * On a tie the intent listed first wins.
 */
export class KnowledgeBaseResponder implements Responder {
  private readonly intents: readonly Intent[]

  constructor(intents: readonly Intent[]) {
    this.intents = intents
  }

  respond(query: Query): AssistantReply | null {
    let best: { intent: Intent; score: number } | null = null
    for (const intent of this.intents) {
      const score = this.score(intent, query)
      if (score > 0 && (!best || score > best.score)) best = { intent, score }
    }
    return best?.intent.reply ?? null
  }

  private score(intent: Intent, query: Query): number {
    return intent.triggers
      .filter((trigger) => query.hasPhrase(trigger))
      .reduce((total, trigger) => total + trigger.split(/\s+/).length, 0)
  }
}
