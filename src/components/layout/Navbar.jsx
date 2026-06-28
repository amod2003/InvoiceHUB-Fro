import { Link, useLocation } from 'react-router-dom';
import { Search, Bell, Plus, Sun, Moon } from 'lucide-react';
import Button from '../ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { useThemeStore } from '../../store/themeStore';

const routes = {
  '/dashboard':    { title: 'Dashboard',    sub: 'Overview of your workspace' },
  '/invoices':     { title: 'Invoices',     sub: 'Manage and track all invoices' },
  '/invoices/new': { title: 'New Invoice',  sub: 'Create a new invoice' },
  '/clients':      { title: 'Clients',      sub: 'Manage your client directory' },
  '/clients/new':  { title: 'New Client',   sub: 'Add a new client' },
  '/payments':     { title: 'Payments',     sub: 'Track incoming payments' },
  '/settings':     { title: 'Settings',     sub: 'Configure your workspace' },
};

function deriveRoute(pathname) {
  if (routes[pathname]) return routes[pathname];
  if (pathname.startsWith('/invoices/')) return { title: 'Invoice Detail', sub: 'View invoice details' };
  if (pathname.startsWith('/clients/') && pathname.endsWith('/edit')) return { title: 'Edit Client', sub: 'Update client information' };
  return { title: 'InvoiceHub', sub: '' };
}

export default function Navbar() {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const { theme, toggleTheme } = useThemeStore();
  const { title, sub } = deriveRoute(pathname);
  const initials = (user?.full_name || 'U').slice(0, 2).toUpperCase();

  return (
    <header className="sticky top-0 z-30 h-[68px] border-b border-border-subtle bg-bg-base/90 backdrop-blur-2xl transition-colors duration-200">
      <div className="h-full flex items-center justify-between px-6 gap-4">
        {/* Page title */}
        <div className="min-w-0">
          <h1 className="text-base font-semibold text-text-primary leading-tight">{title}</h1>
          {sub && <p className="text-[11px] text-text-muted leading-none mt-0.5">{sub}</p>}
        </div>

        <div className="flex items-center gap-2.5">
          {/* Search */}
          <div className="hidden md:flex items-center gap-2 px-3 h-9 w-72 rounded-xl bg-bg-elevated border border-border-subtle hover:border-border-strong focus-within:border-text-muted transition-all duration-200">
            <Search className="w-3.5 h-3.5 text-text-muted shrink-0" />
            <input
              type="text"
              placeholder="Search invoices, clients…"
              className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-muted min-w-0"
            />
            <kbd className="hidden lg:inline-flex items-center px-1.5 py-0.5 rounded-md bg-text-primary/[0.06] text-[10px] text-text-muted font-mono border border-border-subtle shrink-0">
              ⌘K
            </kbd>
          </div>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className="p-2 rounded-xl text-text-muted hover:text-text-primary hover:bg-text-primary/[0.06] transition-all"
          >
            {theme === 'dark'
              ? <Sun className="w-4 h-4" />
              : <Moon className="w-4 h-4" />
            }
          </button>

          {/* Bell */}
          <button className="relative p-2 rounded-xl text-text-muted hover:text-text-primary hover:bg-text-primary/[0.06] transition-all">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-red-500 border border-bg-base">
              <span className="absolute inset-0 rounded-full bg-red-500 animate-ping-slow opacity-75" />
            </span>
          </button>

          {/* User avatar */}
          <div className="w-8 h-8 rounded-xl bg-text-primary flex items-center justify-center text-[11px] font-bold text-bg-base cursor-pointer hover:bg-text-primary/90 transition-all">
            {initials}
          </div>

          {/* New Invoice */}
          <Link to="/invoices/new">
            <Button size="sm" icon={Plus}>New Invoice</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
