import { Sparkles, ShieldCheck, Zap, BarChart3, CheckCircle, Clock, FileText } from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: 'Send invoices in seconds',
    desc: 'Beautiful invoices with line items, taxes, and payment links built-in.',
    color: 'from-indigo-500/20 to-indigo-500/5 text-indigo-300 border-l-indigo-500/60',
  },
  {
    icon: ShieldCheck,
    title: 'Stripe-powered payments',
    desc: 'Get paid online with auto-status updates and webhook reconciliation.',
    color: 'from-violet-500/20 to-violet-500/5 text-violet-300 border-l-violet-500/60',
  },
  {
    icon: BarChart3,
    title: 'Real-time analytics',
    desc: 'Revenue, overdue alerts, and top clients — all in one dashboard.',
    color: 'from-cyan-400/20 to-cyan-400/5 text-cyan-300 border-l-cyan-500/60',
  },
];

function FloatingInvoiceMockup() {
  return (
    <div className="animate-float">
      <div className="glass-card-elevated rounded-2xl p-5 w-72 shadow-card-lg border border-white/[0.12]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-[10px] text-text-muted uppercase tracking-widest">Invoice</p>
            <p className="text-base font-bold gradient-text">#INV-2024-042</p>
          </div>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-status-success/15 text-emerald-300 border border-status-success/30 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-status-success" />
            Paid
          </span>
        </div>
        <div className="space-y-2 mb-4">
          {[
            { label: 'Web Design', amount: '$2,400' },
            { label: 'Development', amount: '$3,200' },
            { label: 'Hosting (1yr)', amount: '$480' },
          ].map((item) => (
            <div key={item.label} className="flex justify-between text-xs">
              <span className="text-text-muted">{item.label}</span>
              <span className="text-text-secondary font-mono">{item.amount}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-white/[0.08] pt-3 flex justify-between">
          <span className="text-xs text-text-muted">Total</span>
          <span className="text-base font-bold gradient-text">$6,080</span>
        </div>
        <div className="mt-3 h-7 rounded-lg gradient-primary flex items-center justify-center gap-1.5">
          <CheckCircle className="w-3 h-3 text-white" />
          <span className="text-[10px] font-semibold text-white">Payment received</span>
        </div>
      </div>

      {/* Floating activity chip */}
      <div className="mt-3 ml-auto mr-4 w-fit glass-card rounded-xl px-3 py-2 flex items-center gap-2 border border-white/[0.1]">
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
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left — animated mesh hero */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 overflow-hidden bg-bg-surface">
        {/* Animated mesh gradient */}
        <div className="absolute inset-0 mesh-bg mesh-bg-animated" />
        <div className="absolute inset-0 grid-pattern opacity-30" />

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div className="relative w-11 h-11 rounded-2xl gradient-primary flex items-center justify-center shadow-glow-indigo">
            <Sparkles className="w-5 h-5 text-white" />
            <div className="absolute inset-0 rounded-2xl gradient-primary opacity-40 blur-md -z-10" />
          </div>
          <div>
            <span className="text-lg font-bold gradient-text block leading-none">InvoiceHub</span>
            <span className="text-[9px] text-text-muted uppercase tracking-widest">Billing Platform</span>
          </div>
        </div>

        {/* Hero content */}
        <div className="relative max-w-md space-y-8">
          <div>
            <p className="text-xs font-semibold text-accent-cyan uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="inline-block w-6 h-px bg-accent-cyan" />
              Multi-tenant SaaS
            </p>
            <h2 className="text-5xl font-bold text-text-primary leading-[1.1] mb-5">
              Invoicing that{' '}
              <span className="gradient-text">actually feels modern.</span>
            </h2>
            <p className="text-text-secondary leading-relaxed text-base">
              Stop wrestling with spreadsheets. Create invoices, collect payments, and track revenue
              from one beautiful workspace.
            </p>
          </div>

          {/* Feature cards */}
          <ul className="space-y-3">
            {features.map((f) => (
              <li
                key={f.title}
                className={`flex gap-4 p-4 rounded-xl bg-gradient-to-r border-l-2 glass-card ${f.color}`}
              >
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${f.color.split(' ').slice(0,2).join(' ')} flex items-center justify-center shrink-0`}>
                  <f.icon className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-primary">{f.title}</p>
                  <p className="text-xs text-text-muted mt-0.5 leading-relaxed">{f.desc}</p>
                </div>
              </li>
            ))}
          </ul>

          {/* Floating mockup */}
          <FloatingInvoiceMockup />
        </div>

      </div>

      {/* Right — form panel */}
      <div className="relative flex items-center justify-center p-6 lg:p-12 bg-bg-base">
        <div className="absolute inset-0 lg:hidden mesh-bg mesh-bg-animated" />
        <div className="absolute inset-0 grid-pattern opacity-20" />

        <div className="relative w-full max-w-md">
          {/* Form card */}
          <div className="border-gradient-top glass-card-elevated rounded-2xl p-8 shadow-card-lg">
            {eyebrow && (
              <p className="text-xs font-semibold text-accent-cyan uppercase tracking-widest mb-3 flex items-center gap-2">
                <Sparkles className="w-3 h-3" />
                {eyebrow}
              </p>
            )}
            {heading && (
              <h1 className="text-3xl font-bold text-text-primary mb-8 leading-tight">{heading}</h1>
            )}
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
