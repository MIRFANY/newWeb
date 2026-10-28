import { isLocale, supportedLocales, useTranslation } from '../../i18n'

export function LanguageSwitcher() {
  const { t, locale, setLocale } = useTranslation()
  return (
    <label className="language-control">
      <span className="sr-only">{t('language.label')}</span>
      <select value={locale} aria-label={t('language.label')} onChange={(event) => isLocale(event.target.value) && setLocale(event.target.value)}>
        {supportedLocales.map(({ code, label }) => <option key={code} value={code} lang={code}>{label}</option>)}
      </select>
    </label>
  )
}
