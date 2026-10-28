/**
 * A visitor's question in a normalised form that responders match against.
 *
 * Text is lower-cased, punctuation becomes spaces, and a trailing "s" is dropped from words longer
 * than three letters, so "Complaints?" and "complaint" compare equal. Match trigger phrases through
 * `hasPhrase`, which applies the same normalisation to the phrase.
 */
export class Query {
  readonly raw: string
  readonly normalized: string

  constructor(raw: string) {
    this.raw = raw.trim()
    this.normalized = Query.normalize(raw)
  }

  static normalize(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9ऀ-ॿ]+/g, ' ')
      .trim()
      .split(' ')
      .filter(Boolean)
      .map((word) => (word.length > 3 && word.endsWith('s') ? word.slice(0, -1) : word))
      .join(' ')
  }

  /** True when the phrase appears as whole words, in order. */
  hasPhrase(phrase: string): boolean {
    const needle = Query.normalize(phrase)
    return needle.length > 0 && ` ${this.normalized} `.includes(` ${needle} `)
  }
}
