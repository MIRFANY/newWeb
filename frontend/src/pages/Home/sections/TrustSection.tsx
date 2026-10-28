import { useTranslation } from '../../../i18n'
import { evaluationFigures, trustPoints } from '../homeContent'

export function TrustSection() {
  const { t } = useTranslation()
  return (
    <section className="public-band trust-section">
      <div className="section-heading">
        <span className="eyebrow">{t('home.trust.eyebrow')}</span>
        <h2>{t('home.trust.title')}</h2>
      </div>
      <div className="trust-grid">
        {trustPoints.map(({ icon: Icon, titleKey, textKey }) => (
          <article className="trust-card" key={titleKey}>
            <span className="highlight-icon"><Icon size={21} /></span>
            <h3>{t(titleKey)}</h3>
            <p>{t(textKey, evaluationFigures)}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
