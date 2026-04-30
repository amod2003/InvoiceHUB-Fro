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

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/invoices', label: 'Invoices', icon: FileText },
  { to: '/clients', label: 'Clients', icon: Users },
  { to: '/payments', label: 'Payments', icon: CreditCard },
  { to: '/settings', label: 'Settings', icon: SettingsIcon },
];

export default function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 border-r border-white/[0.05] bg-bg-surface/40 backdrop-blur-xl">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 h-16 border-b border-white/[0.05]">
        <div className="relative w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shadow-glow-indigo">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-base font-bold gradient-text leading-none">InvoiceHub</p>
          <p className="text-[10px] text-text-muted mt-0.5 tracking-wider uppercase">
            Billing Platform
          </p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-6 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `group relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'text-white bg-gradient-to-r from-indigo-500/15 to-cyan-400/10 border border-white/[0.08] shadow-glow-indigo'
                  : 'text-text-secondary hover:text-text-primary hover:bg-white/[0.04]'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full gradient-primary" />
                )}
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User footer */}
      <div className="p-3 border-t border-white/[0.05]">
        <div className="flex items-center gap-3 p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.05]">
          <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center text-sm font-semibold text-white shrink-0">
            {(user?.full_name || 'U').slice(0, 1).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-text-primary truncate">
              {user?.full_name || 'User'}
            </p>
            <p className="text-[10px] text-text-muted truncate">{user?.email}</p>
          </div>
          <button
            onClick={logout}
            title="Sign out"
            className="p-1.5 rounded-md text-text-muted hover:text-red-400 hover:bg-red-500/10 transition"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
