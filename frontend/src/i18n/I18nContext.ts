import { createContext, useContext } from 'react'
import type { Locale } from './messages'
import type { Translator } from './translator'

export interface I18nControls extends Translator {
  setLocale(locale: Locale): void
}

export const I18nContext = createContext<I18nControls | null>(null)

/** The active language's translator plus `setLocale`. Use inside `I18nProvider`. */
export function useTranslation(): I18nControls {
  const controls = useContext(I18nContext)
  if (!controls) throw new Error('useTranslation must be used inside an I18nProvider')
  return controls
}
