import { useSearchParams } from 'react-router-dom'
import { PublicLayout } from '../../components/public/PublicLayout'
import { SectionIntro } from '../../components/public/SectionIntro'
import { useTranslation } from '../../i18n'
import { publicCaseStatusSource, SAMPLE_CASE_ID } from '../../services/publicCases'
import { CaseNotFound, CaseStatusCard } from './CaseStatusCard'
import { TrackerHelp } from './TrackerHelp'
import { TrackerSearchForm } from './TrackerSearchForm'
import './Track.css'

/**
 * Public complaint tracker. The case ID lives in the URL (`/track?case=CMP-2024-0002`) so a result
 * can be linked to, including from the assistant. Without one, a sample case is shown.
 */
export default function TrackPage() {
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
  const caseId = (searchParams.get('case') ?? SAMPLE_CASE_ID).toUpperCase()
  const status = publicCaseStatusSource.findByCaseId(caseId)

  return (
    <PublicLayout>
      <section className="public-band page-band media-page tracker-page">
        <SectionIntro eyebrow={t('track.eyebrow')} title={t('track.title')}><p>{t('track.lead')}</p></SectionIntro>
        <TrackerSearchForm key={caseId} initialValue={caseId} onTrack={(id) => setSearchParams({ case: id })} />
        <div className="tracker-layout">
          {status ? <CaseStatusCard status={status} /> : <CaseNotFound caseId={caseId} />}
          <TrackerHelp />
        </div>
      </section>
    </PublicLayout>
  )
}
