import { Fragment } from 'react'
import { AlertTriangle, Clock3, FileCheck2, GitMerge, Landmark, Sparkles } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { PublicLayout } from '../../components/public/PublicLayout'
import { SectionIntro } from '../../components/public/SectionIntro'
import { useTranslation } from '../../i18n'
import type { TextKey } from '../../i18n'
import './HowItWorks.css'

const steps: { titleKey: TextKey; textKey: TextKey }[] = [
  { titleKey: 'howItWorks.steps.receivedTitle', textKey: 'howItWorks.steps.receivedText' },
  { titleKey: 'howItWorks.steps.identifiedTitle', textKey: 'howItWorks.steps.identifiedText' },
  { titleKey: 'howItWorks.steps.registeredTitle', textKey: 'howItWorks.steps.registeredText' },
  { titleKey: 'howItWorks.steps.overlapTitle', textKey: 'howItWorks.steps.overlapText' },
  { titleKey: 'howItWorks.steps.coordinationTitle', textKey: 'howItWorks.steps.coordinationText' },
  { titleKey: 'howItWorks.steps.monitoringTitle', textKey: 'howItWorks.steps.monitoringText' },
  { titleKey: 'howItWorks.steps.disposalTitle', textKey: 'howItWorks.steps.disposalText' },
]

const supports: { icon: LucideIcon; titleKey: TextKey; textKey: TextKey }[] = [
  { icon: Landmark, titleKey: 'howItWorks.supports.profileTitle', textKey: 'howItWorks.supports.profileText' },
  { icon: Sparkles, titleKey: 'howItWorks.supports.matchingTitle', textKey: 'howItWorks.supports.matchingText' },
  { icon: AlertTriangle, titleKey: 'howItWorks.supports.overlapTitle', textKey: 'howItWorks.supports.overlapText' },
  { icon: GitMerge, titleKey: 'howItWorks.supports.workspaceTitle', textKey: 'howItWorks.supports.workspaceText' },
  { icon: Clock3, titleKey: 'howItWorks.supports.alertsTitle', textKey: 'howItWorks.supports.alertsText' },
  { icon: FileCheck2, titleKey: 'howItWorks.supports.reportsTitle', textKey: 'howItWorks.supports.reportsText' },
]

export default function HowItWorksPage() {
  const { t, list } = useTranslation()

  return (
    <PublicLayout>
      <section className="public-band page-band media-page">
        <SectionIntro eyebrow={t('howItWorks.eyebrow')} title={t('howItWorks.title')}><p>{t('howItWorks.lead')}</p></SectionIntro>
        <ol className="how-steps">
          {steps.map(({ titleKey, textKey }, index) => (
            <li className="how-step" key={titleKey}>
              <span className="how-step-number">{index + 1}</span>
              <h3>{t(titleKey)}</h3>
              <p>{t(textKey)}</p>
            </li>
          ))}
        </ol>
        <h2 className="how-supports-heading">{t('howItWorks.supportHeading')}</h2>
        <div className="how-supports">
          {supports.map(({ icon: Icon, titleKey, textKey }) => (
            <article className="how-support" key={titleKey}>
              <span className="how-support-icon"><Icon size={21} /></span>
              <div><h3>{t(titleKey)}</h3><p>{t(textKey)}</p></div>
            </article>
          ))}
        </div>
        <div className="how-chain">
          {list('howItWorks.chain').map((unit, index) => (
            <Fragment key={unit}>{index > 0 && <b aria-hidden="true">↔</b>}<span>{unit}</span></Fragment>
          ))}
        </div>
      </section>
    </PublicLayout>
  )
}
