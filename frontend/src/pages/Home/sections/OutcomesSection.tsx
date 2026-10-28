import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { useTranslation } from '../../../i18n'

export function OutcomesSection() {
  const { t, list } = useTranslation()
  return (
    <section className="public-band outcomes-section">
      <div>
        <span className="eyebrow">{t('home.outcomes.eyebrow')}</span>
        <h2>{t('home.outcomes.title')}</h2>
        <p>{t('home.outcomes.lead')}</p>
        <Link className="secondary-button" to="/login">{t('home.outcomes.officerLogin')} <ArrowRight size={17} /></Link>
      </div>
      <ul className="outcomes-list">
        {list('home.outcomes.items').map((outcome) => <li key={outcome}><CheckCircle2 size={19} /> {outcome}</li>)}
      </ul>
    </section>
  )
}
