import { ShieldCheck, Zap, BarChart3, CheckCircle, Clock } from 'lucide-react';

const features = [
  { icon: Zap,         title: 'Send invoices in seconds',  desc: 'Beautiful invoices with line items, taxes, and payment links built-in.' },
  { icon: ShieldCheck, title: 'Stripe-powered payments',   desc: 'Get paid online with auto-status updates and webhook reconciliation.' },
  { icon: BarChart3,   title: 'Real-time analytics',       desc: 'Revenue, overdue alerts, and top clients — all in one dashboard.' },
];

function FloatingInvoiceMockup() {
  return (
    <div className="animate-float">
      <div className="rounded-2xl p-5 w-72 surface-card shadow-card-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-[10px] text-text-muted uppercase tracking-widest">Invoice</p>
            <p className="text-base font-bold text-text-primary font-mono">#INV-2024-042</p>
          </div>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-status-success/15 text-status-success border border-status-success/30 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-status-success" /> Paid
          </span>
        </div>
        <div className="space-y-2 mb-4">
          {[
            { label: 'Web Design',    amount: '$2,400' },
            { label: 'Development',   amount: '$3,200' },
            { label: 'Hosting (1yr)', amount: '$480' },
          ].map((item) => (
            <div key={item.label} className="flex justify-between text-xs">
              <span className="text-text-muted">{item.label}</span>
              <span className="text-text-secondary font-mono">{item.amount}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-border-subtle pt-3 flex justify-between items-center">
          <span className="text-xs text-text-muted">Total</span>
          <span className="text-lg font-bold text-text-primary">$6,080</span>
        </div>
        <div className="mt-3 h-8 rounded-xl bg-text-primary flex items-center justify-center gap-2">
          <CheckCircle className="w-3.5 h-3.5 text-bg-base" />
          <span className="text-[11px] font-semibold text-bg-base">Payment received</span>
        </div>
      </div>
      <div className="mt-3 ml-auto mr-4 w-fit rounded-xl px-3 py-2 flex items-center gap-2 surface-card">
        <div className="w-6 h-6 rounded-lg bg-status-success/15 flex items-center justify-center">
          <Clock className="w-3.5 h-3.5 text-status-success" />
        </div>
        <div>
          <p className="text-[10px] font-medium text-text-primary">Payment received</p>
          <p className="text-[9px] text-text-muted">2 minutes ago</p>
        </div>
      </div>
    </div>
  );
}

export default function AuthLayout({ children, eyebrow, heading }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 transition-colors duration-200">
      {/* Left panel */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 overflow-hidden bg-bg-surface border-r border-border-subtle">
        <div className="absolute inset-0 dot-pattern" />
        <div className="absolute inset-0 mesh-bg mesh-bg-animated" />

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-text-primary flex items-center justify-center shrink-0">
            <Zap className="w-5 h-5 text-bg-base" strokeWidth={2.5} />
          </div>
          <div>
            <span className="text-base font-bold text-text-primary block leading-none">InvoiceHub</span>
            <span className="text-[9px] text-text-muted uppercase tracking-widest">Billing Platform</span>
          </div>
        </div>

        {/* Hero */}
        <div className="relative max-w-md space-y-8">
          <div>
            <p className="text-xs font-semibold text-text-muted uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="inline-block w-5 h-px bg-border-strong" /> Premium SaaS
            </p>
            <h2 className="text-5xl font-bold text-text-primary leading-[1.1] mb-5 tracking-tight">
              Invoicing that<br />
              <span className="text-text-secondary">actually works.</span>
            </h2>
            <p className="text-text-muted leading-relaxed">
              Stop wrestling with spreadsheets. Create invoices, collect payments, and track revenue from one elegant workspace.
            </p>
          </div>

          <ul className="space-y-3">
            {features.map((f) => (
              <li key={f.title} className="flex gap-4 p-4 rounded-xl surface-card">
                <div className="w-8 h-8 rounded-lg bg-text-primary/[0.08] flex items-center justify-center shrink-0">
                  <f.icon className="w-4 h-4 text-text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-primary">{f.title}</p>
                  <p className="text-xs text-text-muted mt-0.5 leading-relaxed">{f.desc}</p>
                </div>
              </li>
            ))}
          </ul>

          <FloatingInvoiceMockup />
        </div>

        <div />
      </div>

      {/* Right — form */}
      <div className="relative flex items-center justify-center p-6 lg:p-12 bg-bg-base">
        <div className="absolute inset-0 dot-pattern opacity-50" />
        <div className="relative w-full max-w-md">
          <div className="border-gradient-top rounded-2xl p-8 glass-card-elevated shadow-card-lg">
            {eyebrow && (
              <p className="text-[10px] font-semibold text-text-muted uppercase tracking-widest mb-3">
                {eyebrow}
              </p>
            )}
            {heading && (
              <h1 className="text-2xl font-bold text-text-primary mb-8 leading-tight tracking-tight">{heading}</h1>
            )}
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
