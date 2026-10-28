import { FormEvent, useState } from 'react'
import { Search } from 'lucide-react'
import { useTranslation } from '../../i18n'
import { extractCaseId } from '../../services/publicCases'

interface TrackerSearchFormProps {
  initialValue: string
  /** Receives the case ID, upper-cased and trimmed. */
  onTrack(caseId: string): void
}

export function TrackerSearchForm({ initialValue, onTrack }: TrackerSearchFormProps) {
  const { t } = useTranslation()
  const [draft, setDraft] = useState(initialValue)

  const submit = (event: FormEvent) => {
    event.preventDefault()
    const caseId = extractCaseId(draft) ?? draft.trim().toUpperCase()
    if (caseId) onTrack(caseId)
  }

  return (
    <form className="tracker-search" onSubmit={submit}>
      <input aria-label={t('track.inputLabel')} value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="CMP-2024-0002" />
      <button className="primary-button" type="submit"><Search size={17} /> {t('track.submit')}</button>
    </form>
  )
}
