import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, FileText, Users, CreditCard,
  Settings as SettingsIcon, LogOut,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const mainNav = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/invoices',  label: 'Invoices',  icon: FileText },
  { to: '/clients',   label: 'Clients',   icon: Users },
  { to: '/payments',  label: 'Payments',  icon: CreditCard },
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
            ? 'bg-text-primary text-bg-base'
            : 'text-text-muted hover:text-text-primary hover:bg-text-primary/[0.05]'
        }`
      }
    >
      {({ isActive }) => (
        <>
          <span className={`flex items-center justify-center w-7 h-7 rounded-lg transition-all duration-200 ${
            isActive ? 'bg-bg-base/10' : 'group-hover:bg-text-primary/[0.06]'
          }`}>
            <Icon className="w-4 h-4" />
          </span>
          <span className={isActive ? 'font-semibold' : ''}>{label}</span>
        </>
      )}
    </NavLink>
  );
}

export default function Sidebar() {
  const { user, logout } = useAuth();
  const initials = (user?.full_name || 'U').slice(0, 2).toUpperCase();

  return (
    <aside className="hidden lg:flex flex-col w-72 shrink-0 border-r border-border-subtle bg-bg-surface transition-colors duration-200">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 h-[68px] border-b border-border-subtle">
        <img
          src="/invoicehub-logo.svg"
          alt="InvoiceHub"
          className="w-10 h-10 rounded-xl object-cover shrink-0"
        />
        <div>
          <p className="text-sm font-bold text-text-primary leading-none tracking-tight">InvoiceHub</p>
          <p className="text-[10px] text-text-muted mt-1 tracking-widest uppercase font-medium">
            Billing Platform
          </p>
        </div>
      </div>

      {/* Main nav */}
      <nav className="flex-1 px-3 pt-6 pb-3 space-y-1 overflow-y-auto">
        <p className="px-3 mb-3 text-[9px] font-semibold uppercase tracking-widest text-text-muted/60">
          Main
        </p>
        {mainNav.map((item) => <NavItem key={item.to} {...item} />)}
      </nav>

      {/* Bottom nav */}
      <div className="px-3 pb-3 border-t border-border-subtle pt-3 space-y-1">
        <p className="px-3 mb-2 text-[9px] font-semibold uppercase tracking-widest text-text-muted/60">
          Account
        </p>
        {bottomNav.map((item) => <NavItem key={item.to} {...item} />)}
      </div>

      {/* User footer */}
      <div className="p-3 border-t border-border-subtle">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-text-primary/[0.03] border border-text-primary/[0.08] hover:border-text-primary/[0.15] transition-all group">
          <div className="w-8 h-8 rounded-xl bg-text-primary flex items-center justify-center text-xs font-bold text-bg-base shrink-0">
            {initials}
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
            className="p-1.5 rounded-lg text-text-muted hover:text-red-500 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
