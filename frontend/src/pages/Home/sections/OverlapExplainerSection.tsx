import { AlertTriangle, CheckCircle2, UserCheck } from 'lucide-react'
import { useTranslation } from '../../../i18n'
import { exampleOverlap, ExampleCase } from '../homeContent'

function ComplaintCard({ example }: { example: ExampleCase }) {
  const { t, date } = useTranslation()
  return (
    <article className="explainer-complaint">
      <div className="explainer-complaint-head">
        <span className={`bureau-pill ${example.bureau.toLowerCase()}`}>{example.bureau}</span>
        <span>{example.caseId} · {date(example.raisedOn)}</span>
      </div>
      <blockquote>“{t(example.complaintKey)}”</blockquote>
      <small>{t('home.explainer.institutionAsWritten')} <b>{example.institutionAsWritten}</b></small>
    </article>
  )
}

/** Shows how an overlap alert states its reasons, using the same example pair as the hero. */
export function OverlapExplainerSection() {
  const { t, list } = useTranslation()
  const [first, second] = exampleOverlap

  return (
    <section className="public-band explainer-section">
      <div className="section-heading">
        <span className="eyebrow">{t('home.explainer.eyebrow')}</span>
        <h2>{t('home.explainer.title')}</h2>
        <p>{t('home.explainer.lead')}</p>
      </div>
      <div className="explainer-grid">
        <div className="explainer-complaints">
          <ComplaintCard example={first} />
          <ComplaintCard example={second} />
        </div>
        <aside className="explainer-alert">
          <div className="explainer-alert-title"><AlertTriangle size={18} /> {t('home.explainer.alertTitle')}</div>
          <p>{t('home.explainer.linkedBecause')}</p>
          <ul>
            {list('home.explainer.reasons').map((reason) => <li key={reason}><CheckCircle2 size={17} /> {reason}</li>)}
          </ul>
          <div className="explainer-decision"><UserCheck size={18} /> {t('home.explainer.decision')}</div>
        </aside>
      </div>
    </section>
  )
}
