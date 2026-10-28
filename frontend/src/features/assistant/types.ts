/** A page the assistant points to so the visitor can continue there. */
export interface AssistantLink {
  label: string
  to: string
}

/** One answer from the assistant, rendered as a chat bubble. */
export interface AssistantReply {
  text: string
  /** Short facts listed under the text, such as the fields of a case status. */
  details?: string[]
  links?: AssistantLink[]
  /** Follow-up questions offered as one-tap chips. */
  suggestions?: string[]
}

export type ChatMessage =
  | { id: string; author: 'visitor'; text: string }
  | { id: string; author: 'assistant'; reply: AssistantReply }
