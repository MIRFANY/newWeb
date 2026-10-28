import { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useTranslation } from '../../../i18n'
import { highlights } from '../homeContent'

export function HighlightsSection() {
  const { t, list } = useTranslation()
  return (
    <section className="public-highlights public-band">
      <div className="highlights-heading">
        <div><span className="eyebrow">{t('home.highlights.eyebrow')}</span><h2>{t('home.highlights.title')}</h2></div>
        <p>{t('home.highlights.lead')}</p>
      </div>
      <div className="highlight-grid">
        {highlights.map(({ icon: Icon, titleKey, textKey }) => (
          <article className="highlight-card" key={titleKey}>
            <span className="highlight-icon"><Icon size={22} /></span>
            <div>
              <h3>{t(titleKey)}</h3>
              <p>{t(textKey)}</p>
              <Link to="/how-it-works">{t('home.highlights.learnMore')} <ArrowRight size={14} /></Link>
            </div>
          </article>
        ))}
      </div>
      <div className="coordination-band">
        <div><span className="eyebrow">{t('home.highlights.bandEyebrow')}</span><h3>{t('home.highlights.bandTitle')}</h3></div>
        <div className="coordination-flow">
          {list('home.highlights.chain').map((unit, index) => (
            <Fragment key={unit}>{index > 0 && <b aria-hidden="true">↔</b>}<span>{unit}</span></Fragment>
          ))}
        </div>
      </div>
    </section>
  )
}
