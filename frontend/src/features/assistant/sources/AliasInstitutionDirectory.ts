import { Query } from '../core/Query'
import type { InstitutionDirectory, InstitutionIdentity, InstitutionMatch } from '../responders/InstitutionResponder'
import type { Institution } from '../../../types'

interface NameEntry {
  institution: InstitutionIdentity
  spelling: string
  wordCount: number
}

/**
 * Finds institutions by their official name or any known alias, matched as whole words.
 *
 * Aliases shorter than three characters (such as "CU") are skipped because they collide with
 * ordinary words. When names of several institutions appear, the one with the longest match wins.
 */
export class AliasInstitutionDirectory implements InstitutionDirectory {
  private static readonly MIN_ALIAS_LENGTH = 3
  private readonly entries: readonly NameEntry[]

  constructor(institutions: readonly Institution[]) {
    this.entries = institutions.flatMap((record) => {
      const institution = AliasInstitutionDirectory.toIdentity(record)
      return [record.name, ...record.aliases]
        .filter((spelling) => Query.normalize(spelling).length >= AliasInstitutionDirectory.MIN_ALIAS_LENGTH)
        .map((spelling) => ({ institution, spelling, wordCount: Query.normalize(spelling).split(' ').length }))
    })
  }

  findMentioned(query: Query): InstitutionMatch | undefined {
    const found = this.entries
      .filter((entry) => query.hasPhrase(entry.spelling))
      .sort((a, b) => b.wordCount - a.wordCount)
    const best = found[0]
    if (!best) return undefined

    const mentions = found.filter((entry) => entry.institution === best.institution).map((entry) => entry.spelling)
    return { institution: best.institution, mentions }
  }

  private static toIdentity(record: Institution): InstitutionIdentity {
    return {
      name: record.name,
      aicteId: record.aicte_permanent_id,
      location: `${record.address}, ${record.state}`,
      aliases: record.aliases,
    }
  }
}
