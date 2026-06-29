import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Bell, Plus, Sun, Moon, AlertCircle, CheckCircle2, FileText, X } from 'lucide-react';
import Button from '../ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { useThemeStore } from '../../store/themeStore';
import { invoiceApi } from '../../api/invoiceApi';
import { formatRelative } from '../../utils/dateUtils';
import { formatCurrency } from '../../utils/formatCurrency';

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

function NotificationPanel({ onClose }) {
  const navigate = useNavigate();
  const [overdue, setOverdue] = useState([]);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [ov, rc] = await Promise.all([
          invoiceApi.list({ status: 'overdue', limit: 5 }),
          invoiceApi.list({ limit: 8 }),
        ]);
        setOverdue(ov);
        setRecent(rc.filter((inv) => inv.status !== 'overdue').slice(0, 5));
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const go = (id) => { navigate(`/invoices/${id}`); onClose(); };

  return (
    <div className="absolute right-0 top-full mt-2 w-96 rounded-2xl shadow-card-lg border border-border-subtle bg-bg-surface z-50 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border-subtle">
        <div>
          <p className="text-sm font-semibold text-text-primary">Notifications</p>
          {overdue.length > 0 && (
            <p className="text-[11px] text-status-danger mt-0.5">{overdue.length} overdue invoice{overdue.length > 1 ? 's' : ''} need attention</p>
          )}
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-text-primary/[0.06] transition-all"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="max-h-[420px] overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-5 h-5 rounded-full border-2 border-border-subtle border-t-text-primary animate-spin" />
          </div>
        ) : (
          <>
            {/* Overdue alerts */}
            {overdue.length > 0 && (
              <div>
                <p className="px-5 pt-4 pb-2 text-[10px] font-semibold uppercase tracking-widest text-text-muted">
                  Overdue
                </p>
                {overdue.map((inv) => (
                  <button
                    key={inv.id}
                    onClick={() => go(inv.id)}
                    className="w-full flex items-start gap-3 px-5 py-3 hover:bg-text-primary/[0.04] transition-all text-left group"
                  >
                    <div className="mt-0.5 w-7 h-7 rounded-xl bg-status-danger/10 flex items-center justify-center shrink-0">
                      <AlertCircle className="w-3.5 h-3.5 text-status-danger" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text-primary leading-tight">
                        {inv.invoice_number}
                        <span className="ml-2 text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded-md bg-status-danger/10 text-status-danger">
                          Overdue
                        </span>
                      </p>
                      <p className="text-[11px] text-text-muted mt-0.5">
                        {formatCurrency(inv.total, inv.currency)} · Due {formatRelative(inv.due_date)}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Recent activity */}
            {recent.length > 0 && (
              <div>
                <p className="px-5 pt-4 pb-2 text-[10px] font-semibold uppercase tracking-widest text-text-muted">
                  Recent
                </p>
                {recent.map((inv) => {
                  const isPaid = inv.status === 'paid';
                  return (
                    <button
                      key={inv.id}
                      onClick={() => go(inv.id)}
                      className="w-full flex items-start gap-3 px-5 py-3 hover:bg-text-primary/[0.04] transition-all text-left group"
                    >
                      <div className={`mt-0.5 w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
                        isPaid ? 'bg-status-success/10' : 'bg-text-primary/[0.07]'
                      }`}>
                        {isPaid
                          ? <CheckCircle2 className="w-3.5 h-3.5 text-status-success" />
                          : <FileText className="w-3.5 h-3.5 text-text-muted" />
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text-primary leading-tight font-mono">
                          {inv.invoice_number}
                        </p>
                        <p className="text-[11px] text-text-muted mt-0.5">
                          {formatCurrency(inv.total, inv.currency)} · {inv.status} · {formatRelative(inv.updated_at)}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Empty state */}
            {overdue.length === 0 && recent.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 gap-2">
                <div className="w-10 h-10 rounded-xl bg-text-primary/[0.06] flex items-center justify-center">
                  <Bell className="w-5 h-5 text-text-muted" />
                </div>
                <p className="text-sm font-medium text-text-primary">All caught up</p>
                <p className="text-xs text-text-muted">No notifications right now.</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-border-subtle px-5 py-3">
        <Link
          to="/invoices"
          onClick={onClose}
          className="text-xs text-text-muted hover:text-text-primary transition font-medium"
        >
          View all invoices →
        </Link>
      </div>
    </div>
  );
}

export default function Navbar() {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const { theme, toggleTheme } = useThemeStore();
  const { title, sub } = deriveRoute(pathname);
  const initials = (user?.full_name || 'U').slice(0, 2).toUpperCase();

  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    if (!notifOpen) return;
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [notifOpen]);

  // Close on route change
  useEffect(() => { setNotifOpen(false); }, [pathname]);

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
              className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-muted min-w-0 outline-none"
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
          <div ref={notifRef} className="relative">
            <button
              onClick={() => setNotifOpen((o) => !o)}
              className={`relative p-2 rounded-xl transition-all ${
                notifOpen
                  ? 'text-text-primary bg-text-primary/[0.08]'
                  : 'text-text-muted hover:text-text-primary hover:bg-text-primary/[0.06]'
              }`}
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-red-500 border border-bg-base">
                <span className="absolute inset-0 rounded-full bg-red-500 animate-ping-slow opacity-75" />
              </span>
            </button>

            {notifOpen && (
              <NotificationPanel onClose={() => setNotifOpen(false)} />
            )}
          </div>

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
