import { Link, useLocation } from 'react-router-dom';
import { Search, Bell, Plus } from 'lucide-react';
import Button from '../ui/Button';
import { useAuth } from '../../hooks/useAuth';

const routes = {
  '/dashboard': { title: 'Dashboard', sub: 'Overview of your workspace' },
  '/invoices': { title: 'Invoices', sub: 'Manage and track all invoices' },
  '/invoices/new': { title: 'New Invoice', sub: 'Create a new invoice' },
  '/clients': { title: 'Clients', sub: 'Manage your client directory' },
  '/clients/new': { title: 'New Client', sub: 'Add a new client' },
  '/payments': { title: 'Payments', sub: 'Track incoming payments' },
  '/settings': { title: 'Settings', sub: 'Configure your workspace' },
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
  const { title, sub } = deriveRoute(pathname);
  const initials = (user?.full_name || 'U').slice(0, 2).toUpperCase();

  return (
    <header className="sticky top-0 z-30 h-[68px] border-b border-white/[0.06] bg-bg-base/80 backdrop-blur-2xl">
      <div className="h-full flex items-center justify-between px-6 gap-4">
        {/* Page title + breadcrumb */}
        <div className="min-w-0">
          <h1 className="text-lg font-semibold text-text-primary leading-tight">{title}</h1>
          {sub && <p className="text-[11px] text-text-muted leading-none mt-0.5">{sub}</p>}
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="hidden md:flex items-center gap-2 px-3 h-9 w-80 rounded-xl bg-bg-elevated border border-border-subtle hover:border-border-strong focus-within:border-accent-indigo focus-within:shadow-glow-indigo transition-all duration-200">
            <Search className="w-3.5 h-3.5 text-text-muted shrink-0" />
            <input
              type="text"
              placeholder="Search invoices, clients…"
              className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-muted min-w-0"
            />
            <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-white/[0.06] text-[10px] text-text-muted font-mono border border-white/[0.08] shrink-0">
              ⌘K
            </kbd>
          </div>

          {/* Notification bell */}
          <button className="relative p-2 rounded-xl text-text-muted hover:text-text-primary hover:bg-white/[0.07] transition-all">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 border border-bg-base">
              <span className="absolute inset-0 rounded-full bg-red-500 animate-ping-slow" />
            </span>
          </button>

          {/* User avatar */}
          <div className="relative">
            <div className="w-8 h-8 rounded-xl gradient-primary flex items-center justify-center text-[11px] font-bold text-white cursor-pointer hover:shadow-glow-indigo transition-all">
              {initials}
            </div>
            <div className="absolute -inset-[1px] rounded-xl gradient-primary opacity-30 blur-sm -z-10" />
          </div>

          {/* New Invoice */}
          <Link to="/invoices/new">
            <Button size="sm" icon={Plus}>
              New Invoice
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
