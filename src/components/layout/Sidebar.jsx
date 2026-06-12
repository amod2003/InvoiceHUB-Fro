import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Users,
  CreditCard,
  Settings as SettingsIcon,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const mainNav = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/invoices', label: 'Invoices', icon: FileText },
  { to: '/clients', label: 'Clients', icon: Users },
  { to: '/payments', label: 'Payments', icon: CreditCard },
];

const bottomNav = [
  { to: '/settings', label: 'Settings', icon: SettingsIcon },
];

function NavItem({ to, label, icon: Icon }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
          isActive
            ? 'text-white bg-gradient-to-r from-indigo-500/20 via-violet-500/10 to-transparent border border-white/[0.1] shadow-glow-indigo'
            : 'text-text-muted hover:text-text-primary hover:bg-white/[0.05]'
        }`
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full gradient-primary shadow-glow-indigo" />
          )}
          <span
            className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200 ${
              isActive
                ? 'bg-gradient-to-br from-indigo-500/30 to-violet-500/20 text-indigo-300'
                : 'text-text-muted group-hover:text-accent-indigo group-hover:bg-white/[0.06]'
            }`}
          >
            <Icon className="w-4 h-4" />
          </span>
          <span className={isActive ? 'gradient-text font-semibold' : ''}>{label}</span>
        </>
      )}
    </NavLink>
  );
}

export default function Sidebar() {
  const { user, logout } = useAuth();
  const initials = (user?.full_name || 'U').slice(0, 2).toUpperCase();

  return (
    <aside className="hidden lg:flex flex-col w-72 shrink-0 border-r border-white/[0.06] bg-bg-surface/50 backdrop-blur-2xl">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 h-[68px] border-b border-white/[0.06]">
        <div className="relative w-10 h-10 rounded-2xl gradient-primary flex items-center justify-center shadow-glow-indigo shrink-0">
          <Sparkles className="w-5 h-5 text-white" />
          <div className="absolute inset-0 rounded-2xl gradient-primary opacity-40 blur-md -z-10" />
        </div>
        <div>
          <p className="text-base font-bold gradient-text leading-none tracking-tight">InvoiceHub</p>
          <p className="text-[10px] text-text-muted mt-1 tracking-widest uppercase font-medium">
            Billing Platform
          </p>
        </div>
      </div>

      {/* Main nav */}
      <nav className="flex-1 px-3 pt-6 pb-3 space-y-1 overflow-y-auto">
        <p className="px-3 mb-2 text-[9px] font-semibold uppercase tracking-widest text-text-muted/60">
          Main
        </p>
        {mainNav.map((item) => (
          <NavItem key={item.to} {...item} />
        ))}
      </nav>

      {/* Divider + bottom nav */}
      <div className="px-3 pb-3 border-t border-white/[0.06] pt-3 space-y-1">
        <p className="px-3 mb-2 text-[9px] font-semibold uppercase tracking-widest text-text-muted/60">
          Account
        </p>
        {bottomNav.map((item) => (
          <NavItem key={item.to} {...item} />
        ))}
      </div>

      {/* User footer */}
      <div className="p-3 border-t border-white/[0.06]">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.07] hover:border-white/[0.12] transition-all group">
          {/* Avatar with gradient ring */}
          <div className="relative shrink-0">
            <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center text-sm font-bold text-white">
              {initials}
            </div>
            <div className="absolute -inset-[1.5px] rounded-xl gradient-primary opacity-40 blur-sm -z-10" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-text-primary truncate">
              {user?.full_name || 'User'}
            </p>
            <p className="text-[10px] text-text-muted truncate mt-0.5">{user?.email}</p>
          </div>
          <button
            onClick={logout}
            title="Sign out"
            className="p-1.5 rounded-lg text-text-muted hover:text-red-400 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
