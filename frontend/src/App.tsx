import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Navigate, Route, Routes, BrowserRouter } from 'react-router-dom'
import AppLayout from './components/Layout/AppLayout'
import { useAuthStore } from './store/authStore'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Alerts from './pages/Alerts'
import InstitutionList from './pages/Institutions/InstitutionList'
import InstitutionProfile from './pages/Institutions/InstitutionProfile'
import CaseList from './pages/Cases/CaseList'
import CaseDetail from './pages/Cases/CaseDetail'
import NewCase from './pages/Cases/NewCase'
import OverlapList from './pages/Overlaps/OverlapList'
import OverlapDetail from './pages/Overlaps/OverlapDetail'
import { AuditLog, Evaluation, Reports, SimulatedTime, SlaConfig } from './pages/Operations'
import AboutPage from './pages/About/AboutPage'
import HowItWorksPage from './pages/HowItWorks/HowItWorksPage'
import HomePage from './pages/Home/HomePage'
import TrackPage from './pages/Track/TrackPage'
import { PublicAssistantProvider } from './features/assistant'
import { I18nProvider } from './i18n'

const queryClient = new QueryClient()

function ProtectedRoutes() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  if (!isAuthenticated) return <Navigate to="/login" replace />

  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="institutions" element={<InstitutionList />} />
        <Route path="institutions/:id" element={<InstitutionProfile />} />
        <Route path="cases" element={<CaseList />} />
        <Route path="cases/new" element={<NewCase />} />
        <Route path="cases/:id" element={<CaseDetail />} />
        <Route path="overlaps" element={<OverlapList />} />
        <Route path="overlaps/:id" element={<OverlapDetail />} />
        <Route path="alerts" element={<Alerts />} />
        <Route path="reports" element={<Reports />} />
        <Route path="evaluation" element={<Evaluation />} />
        <Route path="admin/sla" element={<SlaConfig />} />
        <Route path="admin/time" element={<SimulatedTime />} />
        <Route path="admin/audit" element={<AuditLog />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <I18nProvider>
        <BrowserRouter>
          <PublicAssistantProvider>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/how-it-works" element={<HowItWorksPage />} />
              <Route path="/track" element={<TrackPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/*" element={<ProtectedRoutes />} />
            </Routes>
          </PublicAssistantProvider>
        </BrowserRouter>
      </I18nProvider>
    </QueryClientProvider>
  )
}
