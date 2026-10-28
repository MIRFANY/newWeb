import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const pageTitles: Record<string, string> = {
  '/dashboard':   'Dashboard Overview',
  '/institutions':'Institutions',
  '/cases':       'Cases',
  '/overlaps':    'Overlap Groups',
  '/alerts':      'Alerts & Notifications',
  '/reports':     'Reports',
  '/evaluation':  'Evaluation Metrics',
  '/admin/sla':   'SLA Configuration',
  '/admin/time':  'Simulated Time',
  '/admin/audit': 'Audit Log',
};

function getTitle(pathname: string): string {
  // exact match first
  if (pageTitles[pathname]) return pageTitles[pathname];
  // prefix match
  const prefix = Object.keys(pageTitles).find((k) => pathname.startsWith(k + '/'));
  return prefix ? pageTitles[prefix] : 'Samanvay Dashboard';
}

export default function AppLayout() {
  const { pathname } = useLocation();
  const title = getTitle(pathname);
  // Below the lg breakpoint the sidebar is a drawer. It stays open only on the page it was opened
  // from, so following a link closes it.
  const [navOpenedOn, setNavOpenedOn] = useState<string | null>(null);
  const navOpen = navOpenedOn === pathname;
  const closeNav = () => setNavOpenedOn(null);

  useEffect(() => {
    if (!navOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => event.key === 'Escape' && setNavOpenedOn(null);
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [navOpen]);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar open={navOpen} onClose={closeNav} />

      {navOpen && (
        <div className="fixed inset-0 z-20 bg-slate-900/40 lg:hidden" aria-hidden="true" onClick={closeNav} />
      )}

      {/* Main area offset by sidebar width on large screens */}
      <div className="flex flex-col flex-1 lg:ml-60 min-w-0 overflow-hidden">
        <Topbar title={title} onOpenNav={() => setNavOpenedOn(pathname)} />

        <main
          id="main-content"
          className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50"
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
