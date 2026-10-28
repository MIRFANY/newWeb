import en from './locales/en.json'
import hi from './locales/hi.json'

/** The English file defines the shape every other language must follow. */
export type Messages = typeof en

export type Locale = 'en' | 'hi'

export const DEFAULT_LOCALE: Locale = 'en'

/** Languages offered in the site's language switcher, labelled in their own script. */
export const supportedLocales: { code: Locale; label: string }[] = [
  { code: 'en', label: 'EN' },
  { code: 'hi', label: 'हिंदी' },
]

// Typing each entry as `Messages` makes a missing or misspelt key in hi.json a compile error.
const hindi: Messages = hi

export const messagesByLocale: Record<Locale, Messages> = { en, hi: hindi }

export function isLocale(value: unknown): value is Locale {
  return supportedLocales.some((option) => option.code === value)
}
