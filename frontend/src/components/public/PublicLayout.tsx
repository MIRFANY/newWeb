import { ReactNode, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Mail, MapPin, Menu, Phone, X } from 'lucide-react'
import { ChatWidget } from '../../features/assistant'
import { useTranslation } from '../../i18n'
import type { TextKey } from '../../i18n'
import { contactDetails } from './contactDetails'
import { LanguageSwitcher } from './LanguageSwitcher'
import './Public.css'

const publicNav: { labelKey: TextKey; to: string }[] = [
  { labelKey: 'layout.nav.home', to: '/' },
  { labelKey: 'layout.nav.about', to: '/about' },
  { labelKey: 'layout.nav.howItWorks', to: '/how-it-works' },
  { labelKey: 'layout.nav.track', to: '/track' },
]

const governmentResources: { labelKey: TextKey; href: string }[] = [
  { labelKey: 'layout.footer.indiaGov', href: 'https://www.india.gov.in/' },
  { labelKey: 'layout.footer.ministryOfEducation', href: 'https://www.education.gov.in/' },
  { labelKey: 'layout.footer.myGov', href: 'https://www.mygov.in/' },
  { labelKey: 'layout.footer.openData', href: 'https://data.gov.in/' },
]

const routeClasses: Record<string, string> = {
  '/about': 'about-route',
  '/how-it-works': 'how-route',
  '/track': 'track-route',
}

function GovernmentStrip() {
  const { t } = useTranslation()
  return (
    <div className="gov-strip">
      <span>{t('layout.govStrip')}</span>
      <span className="gov-strip-tagline">{t('layout.tagline')}</span>
    </div>
  )
}

function BrandName() {
  const { t } = useTranslation()
  return <>{t('brand.name')}<br />{t('brand.subtitle')}</>
}

function PublicFooter() {
  const { t } = useTranslation()
  return (
    <footer className="public-footer">
      <div className="footer-main">
        <div className="footer-identity" id="contact">
          <div className="footer-brand-row">
            <img className="footer-logo" src="/media/samanvay-logo.png" alt={t('brand.logoAlt')} />
            <div><strong><BrandName /></strong><span>{t('layout.footer.government')}</span></div>
          </div>
          <p>{t('layout.footer.blurb')}</p>
          <div className="footer-contact">
            <span><MapPin size={16} /> {contactDetails.address}</span>
            <span><Mail size={16} /> {contactDetails.email}</span>
            <span><Phone size={16} /> {contactDetails.phone}</span>
          </div>
        </div>
        <div className="footer-links">
          <h3>{t('layout.footer.quickLinks')}</h3>
          <Link to="/">{t('layout.footer.home')}</Link>
          <Link to="/about">{t('layout.footer.aboutSystem')}</Link>
          <Link to="/how-it-works">{t('layout.footer.howItWorks')}</Link>
          <Link to="/track">{t('layout.footer.trackComplaint')}</Link>
          <Link to="/login">{t('layout.footer.officerLogin')}</Link>
        </div>
        <div className="footer-links">
          <h3>{t('layout.footer.governmentResources')}</h3>
          {governmentResources.map(({ labelKey, href }) => (
            <a key={href} href={href} target="_blank" rel="noreferrer">{t(labelKey)} <span>↗</span></a>
          ))}
        </div>
        <div className="footer-links">
          <h3>{t('layout.footer.services')}</h3>
          <Link to="/track">{t('layout.footer.publicTracker')}</Link>
          <Link to="/login">{t('layout.footer.officerAccess')}</Link>
          <Link to="/about">{t('layout.footer.bureausAndCells')}</Link>
          <Link to="/how-it-works">{t('layout.footer.coordinationProcess')}</Link>
        </div>
      </div>
      <div className="footer-legal">
        <span>{t('layout.footer.copyright')}</span>
        <div>
          <a href="#privacy">{t('layout.footer.privacy')}</a>
          <a href="#terms">{t('layout.footer.terms')}</a>
          <a href="#accessibility">{t('layout.footer.accessibility')}</a>
          <a href="#sitemap">{t('layout.footer.siteMap')}</a>
        </div>
      </div>
    </footer>
  )
}

/** Shell for every public page: government strip, header navigation, footer and the assistant. */
export function PublicLayout({ children }: { children: ReactNode }) {
  const { t } = useTranslation()
  const [menuOpen, setMenuOpen] = useState(false)
  const { pathname } = useLocation()
  const closeMenu = () => setMenuOpen(false)

  return (
    <div className={`public-site ${routeClasses[pathname] ?? 'home-route'}`}>
      <GovernmentStrip />
      <header className="public-header">
        <Link to="/" className="public-brand" onClick={closeMenu}>
          <img className="brand-logo" src="/media/samanvay-logo.png" alt={t('brand.logoAlt')} />
          <span className="brand-council"><BrandName /></span>
        </Link>
        <button className="mobile-menu-button" aria-label={t('layout.toggleNavigation')} onClick={() => setMenuOpen((open) => !open)}>
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <nav className={`public-nav ${menuOpen ? 'public-nav-open' : ''}`}>
          {publicNav.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.to === '/'} onClick={closeMenu}>
              {t(item.labelKey)}
            </NavLink>
          ))}
          <a href="#contact" onClick={closeMenu}>{t('layout.nav.contact')}</a>
          <LanguageSwitcher />
          <Link className="officer-login-link" to="/login" onClick={closeMenu}>{t('layout.nav.officerLogin')}</Link>
        </nav>
      </header>
      <main>{children}</main>
      <PublicFooter />
      <ChatWidget />
    </div>
  )
}
