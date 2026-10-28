import type { Locale, Messages } from './messages'

/** Dotted paths to every value of type `V` in `T`, e.g. "home.hero.title". Arrays count as leaves. */
type PathsTo<T, V, Prefix extends string = ''> = {
  [K in keyof T & string]: T[K] extends V
    ? `${Prefix}${K}`
    : T[K] extends readonly unknown[]
      ? never
      : T[K] extends object
        ? PathsTo<T[K], V, `${Prefix}${K}.`>
        : never
}[keyof T & string]

export type TextKey = PathsTo<Messages, string>
export type ListKey = PathsTo<Messages, readonly string[]>
export type Vars = Record<string, string | number>

export interface Translator {
  locale: Locale
  /** The full message tree, for content that is iterated rather than looked up by key. */
  messages: Messages
  /** A single string with `{{name}}` placeholders filled from `vars`. */
  t(key: TextKey, vars?: Vars): string
  /** A list of strings, each with placeholders filled from `vars`. */
  list(key: ListKey, vars?: Vars): string[]
  /** A date such as "15 Jan 2024", written in the active language. */
  date(isoDate: string): string
}

const INTL_LOCALES: Record<Locale, string> = { en: 'en-IN', hi: 'hi-IN' }

/** Replaces each `{{name}}` in the text with `vars.name`. Unknown names are left as written. */
export function interpolate(text: string, vars: Vars = {}): string {
  return text.replace(/\{\{(\w+)\}\}/g, (placeholder, name: string) => (name in vars ? String(vars[name]) : placeholder))
}

function lookup(messages: Messages, key: string): unknown {
  return key.split('.').reduce<unknown>((node, part) => (node as Record<string, unknown> | undefined)?.[part], messages)
}

export function createTranslator(locale: Locale, messages: Messages): Translator {
  const dateFormat = new Intl.DateTimeFormat(INTL_LOCALES[locale], { day: 'numeric', month: 'short', year: 'numeric' })

  return {
    locale,
    messages,
    t: (key, vars) => interpolate(String(lookup(messages, key) ?? key), vars),
    list: (key, vars) => ((lookup(messages, key) as string[] | undefined) ?? []).map((item) => interpolate(item, vars)),
    date: (isoDate) => dateFormat.format(new Date(`${isoDate}T00:00:00`)),
  }
}
