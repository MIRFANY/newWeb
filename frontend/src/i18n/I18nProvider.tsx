import { ReactNode, useEffect, useMemo, useState } from 'react'
import { I18nContext, I18nControls } from './I18nContext'
import { DEFAULT_LOCALE, isLocale, Locale, messagesByLocale } from './messages'
import { createTranslator } from './translator'

const STORAGE_KEY = 'samanvay.locale'

// Storage can be unavailable (private mode, blocked site data), so the choice is remembered on a best-effort basis.
function readStoredLocale(): Locale {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    return isLocale(stored) ? stored : DEFAULT_LOCALE
  } catch {
    return DEFAULT_LOCALE
  }
}

function storeLocale(locale: Locale): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, locale)
  } catch {
    // The choice still applies for this visit.
  }
}

/** Provides the visitor's chosen language to the app, remembers it, and keeps `<html lang>` in step. */
export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(readStoredLocale)

  useEffect(() => {
    document.documentElement.lang = locale
    storeLocale(locale)
  }, [locale])

  const controls = useMemo<I18nControls>(
    () => ({ ...createTranslator(locale, messagesByLocale[locale]), setLocale }),
    [locale],
  )

  return <I18nContext.Provider value={controls}>{children}</I18nContext.Provider>
}
