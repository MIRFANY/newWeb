import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Building2, FileText, GitMerge, Bell,
  BarChart3, FlaskConical, LogOut, ChevronRight,
  ShieldCheck, Users, Clock, X
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { RoleBadge } from '../shared/Badges';
import { useQuery } from '@tanstack/react-query';
import { fetchAlerts } from '../../api';
import clsx from 'clsx';

interface NavItem {
  label: string;
  to: string;
  icon: React.ElementType;
  roles?: string[];
}

const nav: NavItem[] = [
  { label: 'Dashboard',     to: '/dashboard',     icon: LayoutDashboard },
  { label: 'Institutions',  to: '/institutions',  icon: Building2 },
  { label: 'Cases',         to: '/cases',         icon: FileText },
  { label: 'Overlaps',      to: '/overlaps',      icon: GitMerge },
  { label: 'Alerts',        to: '/alerts',        icon: Bell },
  { label: 'Reports',       to: '/reports',       icon: BarChart3 },
  { label: 'Evaluation',    to: '/evaluation',    icon: FlaskConical },
];

const adminNav: NavItem[] = [
  { label: 'SLA Config',    to: '/admin/sla',     icon: Clock },
  { label: 'Simulated Time',to: '/admin/time',    icon: ShieldCheck, roles: ['Admin'] },
  { label: 'Audit Log',     to: '/admin/audit',   icon: Users },
];

interface SidebarProps {
  /** Whether the drawer is showing on screens below the lg breakpoint. Always visible from lg up. */
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const { data: alerts = [] } = useQuery({
    queryKey: ['alerts'],
    queryFn: fetchAlerts,
    refetchInterval: 15000,
  });

  const unreadCount = alerts.filter((a) => !a.is_read).length;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside
      id="sidebar"
      className={clsx(
        'h-screen w-60 bg-brand-900 flex flex-col shrink-0 fixed left-0 top-0 z-30',
        'transition-transform duration-200 lg:translate-x-0',
        open ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
      )}
      aria-label="Main navigation"
    >
      {/* Logo */}
      <div className="px-4 py-5 border-b border-brand-800">
        <div className="flex items-center gap-2">
          <img className="w-8 h-8 rounded-md object-contain shrink-0" src="/media/samanvay-logo.png" alt="Samanvay" />
          <div className="flex-1">
            <p className="text-white text-sm font-bold leading-tight">Samanvay</p>
            <p className="text-brand-300 text-2xs leading-tight">Complaint Monitoring</p>
          </div>
          <button onClick={onClose} className="lg:hidden text-brand-300 hover:text-white p-1" aria-label="Close navigation">
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Main nav */}
      <nav className="flex-1 overflow-y-auto scrollbar-none px-3 py-4 space-y-0.5">
        {nav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            id={`nav-${item.label.toLowerCase().replace(/\s/g, '-')}`}
            className={({ isActive }) =>
              clsx(isActive ? 'nav-item-active' : 'nav-item-inactive')
            }
          >
            <item.icon size={16} className="shrink-0" />
            <span className="flex-1">{item.label}</span>
            {item.label === 'Alerts' && unreadCount > 0 && (
              <span className="bg-red-500 text-white text-2xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                {unreadCount}
              </span>
            )}
            {item.label === 'Overlaps' && (
              <ChevronRight size={12} className="opacity-40" />
            )}
          </NavLink>
        ))}

        {/* Admin section */}
        {(user?.role === 'Admin' || user?.role === 'Senior_Management') && (
          <>
            <div className="pt-4 pb-1 px-3">
              <p className="text-2xs font-semibold text-brand-400 uppercase tracking-wider">Administration</p>
            </div>
            {adminNav
              .filter((item) => !item.roles || item.roles.includes(user?.role ?? ''))
              .map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  id={`nav-admin-${item.label.toLowerCase().replace(/\s/g, '-')}`}
                  className={({ isActive }) =>
                    clsx(isActive ? 'nav-item-active' : 'nav-item-inactive')
                  }
                >
                  <item.icon size={16} className="shrink-0" />
                  {item.label}
                </NavLink>
              ))}
          </>
        )}
      </nav>

      {/* User footer */}
      <div className="px-3 py-4 border-t border-brand-800 space-y-2">
        {user && (
          <div className="flex items-start gap-2 px-2">
            <div className="w-7 h-7 rounded-full bg-brand-600 flex items-center justify-center shrink-0 text-white text-xs font-bold">
              {user.full_name.charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="text-white text-xs font-medium truncate">{user.full_name}</p>
              <RoleBadge role={user.role} />
            </div>
          </div>
        )}
        <button
          id="btn-logout"
          onClick={handleLogout}
          className="nav-item-inactive w-full text-left"
        >
          <LogOut size={15} />
          Sign out
        </button>
      </div>
    </aside>
  );
}
