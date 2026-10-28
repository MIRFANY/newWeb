import { Bot, CheckCircle2, MessageCircle } from 'lucide-react'
import { useAssistant } from '../../../features/assistant'
import { useTranslation } from '../../../i18n'

/** Introduces the public assistant. Sample questions open the chat panel and ask on the visitor's behalf. */
export function AssistantSection() {
  const { t, list } = useTranslation()
  const { ask, open } = useAssistant()

  return (
    <section className="public-band assistant-section">
      <div className="assistant-copy">
        <span className="eyebrow">{t('home.assistant.eyebrow')}</span>
        <h2>{t('home.assistant.title')}</h2>
        <p>{t('home.assistant.lead')}</p>
        <ul>
          {list('home.assistant.capabilities').map((capability) => <li key={capability}><CheckCircle2 size={18} /> {capability}</li>)}
        </ul>
        <button type="button" className="primary-button assistant-open" onClick={open}><MessageCircle size={17} /> {t('home.assistant.openCta')}</button>
      </div>
      <div className="assistant-preview">
        <div className="assistant-preview-head"><span className="chat-avatar"><Bot size={20} /></span><strong>{t('home.assistant.tryAsking')}</strong></div>
        {list('home.assistant.sampleQuestions').map((question) => (
          <button type="button" key={question} className="assistant-sample" onClick={() => ask(question)}>
            {question}
          </button>
        ))}
      </div>
    </section>
  )
}
