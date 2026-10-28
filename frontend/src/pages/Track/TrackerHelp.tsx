import { LockKeyhole, UsersRound } from 'lucide-react'
import { contactDetails } from '../../components/public/contactDetails'
import { useTranslation } from '../../i18n'

export function TrackerHelp() {
  const { t } = useTranslation()
  return (
    <aside className="tracker-help">
      <div className="info-card">
        <LockKeyhole size={21} />
        <div><h3>{t('track.whatYouSeeTitle')}</h3><p>{t('track.whatYouSeeText')}</p></div>
      </div>
      <div className="info-card">
        <UsersRound size={21} />
        <div><h3>{t('track.needHelpTitle')}</h3><p>{t('track.needHelpText', { email: contactDetails.email, phone: contactDetails.phone })}</p></div>
      </div>
    </aside>
  )
}
