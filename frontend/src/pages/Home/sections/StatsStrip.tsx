import { useTranslation } from '../../../i18n'
import { publicStats } from '../homeContent'

export function StatsStrip() {
  const { t } = useTranslation()
  return (
    <div className="public-stats">
      {publicStats.map(({ icon: Icon, value, labelKey, tone }) => (
        <div className="public-stat" key={labelKey}>
          <span className={`stat-icon ${tone}`}><Icon size={22} /></span>
          <div><strong>{value}</strong><span>{t(labelKey)}</span></div>
        </div>
      ))}
    </div>
  )
}
