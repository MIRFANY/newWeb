import { Fragment, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Link2 } from 'lucide-react'
import { useTranslation } from '../../../i18n'
import { exampleOverlap, ExampleCase } from '../homeContent'

const heroMedia = {
  video: '/media/hero-network-loop.mp4',
  poster: '/media/bg-about-campus.jpg',
}

function CasePreview({ example }: { example: ExampleCase }) {
  const { t } = useTranslation()
  return (
    <div className="case-preview">
      <span className={`bureau-pill ${example.bureau.toLowerCase()}`}>{example.bureau}</span>
      <strong>{example.caseId} · {t(`caseCategory.${example.category}`)}</strong>
      <span>{example.institutionAsWritten} · {t(`caseStatus.${example.status}`)}</span>
    </div>
  )
}

export function HeroSection() {
  const { t, list } = useTranslation()
  const [videoReady, setVideoReady] = useState(false)
  const [first, second] = exampleOverlap

  return (
    <section className="home-hero public-band">
      <div className={`hero-fallback ${videoReady ? 'hero-fallback-hidden' : ''}`} aria-hidden="true" />
      <video className="hero-video" autoPlay muted loop playsInline poster={heroMedia.poster} onCanPlay={() => setVideoReady(true)} aria-hidden="true">
        <source src={heroMedia.video} type="video/mp4" />
      </video>
      <div className="hero-copy">
        <span className="section-rule" />
        <h1>{list('home.hero.titleLines').map((line, index) => <Fragment key={line}>{index > 0 && <br />}{line}</Fragment>)}</h1>
        <p>{t('home.hero.lead')}</p>
        <div className="hero-actions">
          <Link className="primary-button" to="/track">{t('home.hero.trackCta')} <ArrowRight size={17} /></Link>
          <Link className="secondary-button" to="/how-it-works">{t('home.hero.howItWorksCta')}</Link>
        </div>
      </div>
      <div className="hero-overlap" aria-label={t('home.hero.exampleLabel')}>
        <CasePreview example={first} />
        <div className="overlap-ribbon"><Link2 size={15} /> {t('home.hero.linkedNote')}</div>
        <CasePreview example={second} />
        <p>{t('home.hero.caption')}</p>
      </div>
    </section>
  )
}
