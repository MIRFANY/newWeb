import { PublicLayout } from '../../components/public/PublicLayout'
import { AssistantSection } from './sections/AssistantSection'
import { HeroSection } from './sections/HeroSection'
import { HighlightsSection } from './sections/HighlightsSection'
import { OutcomesSection } from './sections/OutcomesSection'
import { OverlapExplainerSection } from './sections/OverlapExplainerSection'
import { StatsStrip } from './sections/StatsStrip'
import { TrustSection } from './sections/TrustSection'
import './Home.css'

export default function HomePage() {
  return (
    <PublicLayout>
      <HeroSection />
      <StatsStrip />
      <HighlightsSection />
      <OverlapExplainerSection />
      <AssistantSection />
      <TrustSection />
      <OutcomesSection />
    </PublicLayout>
  )
}
