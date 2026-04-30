import { Link, useLocation } from 'react-router-dom';
import { Search, Bell, Plus } from 'lucide-react';
import Button from '../ui/Button';

const titles = {
  '/dashboard': 'Dashboard',
  '/invoices': 'Invoices',
  '/invoices/new': 'New Invoice',
  '/clients': 'Clients',
  '/clients/new': 'New Client',
  '/payments': 'Payments',
  '/settings': 'Settings',
};

function deriveTitle(pathname) {
  if (titles[pathname]) return titles[pathname];
  if (pathname.startsWith('/invoices/')) return 'Invoice Detail';
  if (pathname.startsWith('/clients/') && pathname.endsWith('/edit')) return 'Edit Client';
  return 'InvoiceHub';
}

export default function Navbar() {
  const { pathname } = useLocation();
  const title = deriveTitle(pathname);

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-white/[0.05] bg-bg-base/70 backdrop-blur-xl">
      <div className="h-full flex items-center justify-between px-6 gap-4">
        <h1 className="text-xl font-semibold text-text-primary">{title}</h1>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-3 h-9 w-72 rounded-lg bg-bg-elevated border border-border-subtle">
            <Search className="w-4 h-4 text-text-muted" />
            <input
              type="text"
              placeholder="Search invoices, clients…"
              className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-muted"
            />
            <kbd className="hidden lg:inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-white/5 text-[10px] text-text-muted font-mono">
              ⌘K
            </kbd>
          </div>

          <button className="relative p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-white/5 transition">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-accent-cyan" />
          </button>

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
