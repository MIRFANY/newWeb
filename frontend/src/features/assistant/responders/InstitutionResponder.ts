import type { Translator } from '../../../i18n'
import type { Query } from '../core/Query'
import type { Responder } from '../core/Responder'
import type { AssistantReply } from '../types'

export interface InstitutionIdentity {
  name: string
  aicteId: string
  location: string
  aliases: readonly string[]
}

export interface InstitutionMatch {
  institution: InstitutionIdentity
  /** Every name or alias of this institution found in the question, longest first. */
  mentions: string[]
}

export interface InstitutionDirectory {
  findMentioned(query: Query): InstitutionMatch | undefined
}

/**
 * Answers when a question names an institution, by showing which AICTE record that name resolves to.
 *
 * Demonstrates name matching: short forms and misspellings lead to one institution profile.
 */
export class InstitutionResponder implements Responder {
  private readonly directory: InstitutionDirectory
  private readonly translator: Translator

  constructor(directory: InstitutionDirectory, translator: Translator) {
    this.directory = directory
    this.translator = translator
  }

  respond(query: Query): AssistantReply | null {
    const match = this.directory.findMentioned(query)
    if (!match) return null

    const { t, list } = this.translator
    const { institution, mentions } = match
    return {
      text: this.describeMentions(mentions, institution.name),
      details: [
        t('assistant.institution.aicteId', { value: institution.aicteId }),
        t('assistant.institution.location', { value: institution.location }),
        t('assistant.institution.alsoWrittenAs', { value: institution.aliases.join(', ') }),
      ],
      suggestions: list('assistant.institution.suggestions'),
    }
  }

  private describeMentions(mentions: string[], institution: string): string {
    const { t } = this.translator
    const quoted = mentions.map((mention) => `"${mention}"`)
    if (quoted.length === 1) return t('assistant.institution.single', { name: mentions[0], institution })

    const names = `${quoted.slice(0, -1).join(', ')} ${t('assistant.institution.and')} ${quoted[quoted.length - 1]}`
    return t('assistant.institution.multiple', { names, institution })
  }
}
