import { Eye, Flag, HeartHandshake, ShieldCheck } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { PublicLayout } from '../../components/public/PublicLayout'
import { SectionIntro } from '../../components/public/SectionIntro'
import { useTranslation } from '../../i18n'
import type { TextKey } from '../../i18n'
import './About.css'

const values: { icon: LucideIcon; titleKey: TextKey; textKey: TextKey }[] = [
  { icon: Eye, titleKey: 'about.visionTitle', textKey: 'about.visionText' },
  { icon: Flag, titleKey: 'about.missionTitle', textKey: 'about.missionText' },
  { icon: HeartHandshake, titleKey: 'about.valuesTitle', textKey: 'about.valuesText' },
]

const bureaus: { codeKey: TextKey; titleKey: TextKey; textKey: TextKey; tone: string }[] = [
  { codeKey: 'about.rbCode', titleKey: 'bureau.RB', textKey: 'about.rbText', tone: 'rb' },
  { codeKey: 'about.pgrcCode', titleKey: 'bureau.PGRC', textKey: 'about.pgrcText', tone: 'pgrc' },
  { codeKey: 'about.roCode', titleKey: 'about.roTitle', textKey: 'about.roText', tone: 'ro' },
  { codeKey: 'about.otherCode', titleKey: 'about.otherTitle', textKey: 'about.otherText', tone: 'other' },
]

const glance: { value: string; labelKey: TextKey }[] = [
  { value: '1,284', labelKey: 'about.casesThisYear' },
  { value: '540+', labelKey: 'about.institutionsCovered' },
  { value: '86%', labelKey: 'about.matchedAutomatically' },
  { value: '23', labelKey: 'about.overlapsFlagged' },
]

export default function AboutPage() {
  const { t } = useTranslation()

  return (
    <PublicLayout>
      <section className="public-band page-band media-page about-page">
        <SectionIntro eyebrow={t('about.eyebrow')} title={t('about.title')}><p>{t('about.lead')}</p></SectionIntro>

        <div className="about-values">
          {values.map(({ icon: Icon, titleKey, textKey }) => (
            <article className="about-value" key={titleKey}>
              <span className="about-value-icon"><Icon size={22} /></span>
              <h3>{t(titleKey)}</h3>
              <p>{t(textKey)}</p>
            </article>
          ))}
        </div>

        <div className="about-grid">
          <div>
            <h2 className="about-heading">{t('about.bureausHeading')}</h2>
            <div className="about-bureaus">
              {bureaus.map(({ codeKey, titleKey, textKey, tone }) => (
                <article className={`about-bureau ${tone}`} key={titleKey}>
                  <span className="about-bureau-code">{t(codeKey)}</span>
                  <h3>{t(titleKey)}</h3>
                  <p>{t(textKey)}</p>
                </article>
              ))}
            </div>
          </div>

          <aside className="about-glance">
            <h2 className="about-heading">{t('about.glanceHeading')}</h2>
            <div className="about-glance-stats">
              {glance.map(({ value, labelKey }) => (
                <div key={labelKey}><strong>{value}</strong><span>{t(labelKey)}</span></div>
              ))}
            </div>
            <p className="about-glance-note"><ShieldCheck size={18} /> {t('about.glanceNote')}</p>
          </aside>
        </div>
      </section>
    </PublicLayout>
  )
}
