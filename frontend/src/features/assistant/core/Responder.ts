import type { AssistantReply } from '../types'
import type { Query } from './Query'

/**
 * One source of answers for the assistant.
 *
 * Return `null` when the question is outside what this responder knows, so the assistant can ask
 * the next one. Responders must not throw for unrecognised input.
 */
export interface Responder {
  respond(query: Query): AssistantReply | null
}

/** The last responder in the chain. It always has an answer, usually a menu of what can be asked. */
export interface FallbackResponder {
  respond(query: Query): AssistantReply
}
