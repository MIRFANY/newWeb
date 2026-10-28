import { useNavigate } from 'react-router-dom';
import { Bell, RefreshCw, ChevronDown, Menu } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useQuery } from '@tanstack/react-query';
import { fetchAlerts } from '../../api';
import type { Role } from '../../types';
import { useState } from 'react';
import clsx from 'clsx';

const roles: { label: string; value: Role }[] = [
  { label: 'Admin', value: 'Admin' },
  { label: 'RB Officer', value: 'RB_Officer' },
  { label: 'PGRC Officer', value: 'PGRC_Officer' },
  { label: 'Regional Officer', value: 'Regional_Officer' },
  { label: 'Senior Management', value: 'Senior_Management' },
];

interface TopbarProps {
  title: string;
  /** Opens the navigation drawer on screens below the lg breakpoint. */
  onOpenNav: () => void;
}

export default function Topbar({ title, onOpenNav }: TopbarProps) {
  const { user, switchRole } = useAuthStore();
  const navigate = useNavigate();
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);

  const { data: alerts = [] } = useQuery({
    queryKey: ['alerts'],
    queryFn: fetchAlerts,
    refetchInterval: 15000,
  });

  const unread = alerts.filter((a) => !a.is_read).length;

  return (
    <header
      id="topbar"
      className="h-14 bg-white border-b border-slate-200 flex items-center justify-between gap-3 px-4 sm:px-6 sticky top-0 z-20"
    >
      <div className="flex items-center gap-3 min-w-0">
        <button onClick={onOpenNav} className="lg:hidden btn-ghost btn-sm p-2 -ml-2" aria-label="Open navigation">
          <Menu size={19} />
        </button>
        <h1 className="text-base font-semibold text-slate-800 truncate">{title}</h1>
        <span className="text-slate-300 text-xs hidden sm:inline">|</span>
        <span className="text-slate-400 text-xs hidden sm:inline">
          Samanvay Integrated Dashboard
        </span>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Role switcher */}
        <div className="relative">
          <button
            id="btn-role-switcher"
            onClick={() => setShowRoleSwitcher((v) => !v)}
            className="btn-secondary btn-sm flex items-center gap-1"
            title="Switch role"
          >
            <span className="text-slate-500 hidden sm:inline">Role:</span>
            <span className="font-medium">{user?.role?.replace('_', ' ')}</span>
            <ChevronDown size={13} />
          </button>

          {showRoleSwitcher && (
            <div className="absolute right-0 top-full mt-1 bg-white border border-slate-200 rounded-lg shadow-card-md z-50 min-w-[180px] py-1">
              {roles.map((r) => (
                <button
                  key={r.value}
                  id={`role-opt-${r.value}`}
                  onClick={() => {
                    switchRole(r.value);
                    setShowRoleSwitcher(false);
                  }}
                  className={clsx(
                    'w-full text-left px-3 py-2 text-sm hover:bg-slate-50 transition-colors',
                    user?.role === r.value && 'text-brand-700 font-medium bg-brand-50'
                  )}
                >
                  {r.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Refresh indicator */}
        <span className="text-2xs text-slate-400 hidden sm:flex items-center gap-1">
          <RefreshCw size={10} className="animate-pulse" />
          Live
        </span>

        {/* Notification bell */}
        <button
          id="btn-notifications"
          onClick={() => navigate('/alerts')}
          className="relative btn-ghost btn-sm p-2"
          aria-label={`${unread} unread alerts`}
        >
          <Bell size={17} />
          {unread > 0 && (
            <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-2xs font-bold rounded-full min-w-[16px] h-4 flex items-center justify-center px-0.5">
              {unread}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
