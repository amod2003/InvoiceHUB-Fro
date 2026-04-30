import { Sparkles, ShieldCheck, Zap, BarChart3 } from 'lucide-react';

const features = [
  { icon: Zap, title: 'Send invoices in seconds', desc: 'Beautiful invoices with line items, taxes, and payment links built-in.' },
  { icon: ShieldCheck, title: 'Stripe-powered payments', desc: 'Get paid online with auto-status updates and webhook reconciliation.' },
  { icon: BarChart3, title: 'Real-time analytics', desc: 'Revenue, overdue alerts, and top clients — all in one dashboard.' },
];

export default function AuthLayout({ children, eyebrow, heading }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left — gradient hero */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 overflow-hidden">
        <div className="absolute inset-0 ambient-glow" />
        <div className="absolute inset-0 grid-pattern opacity-40" />

        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-glow-indigo">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold gradient-text">InvoiceHub</span>
        </div>

        <div className="relative max-w-md">
          <p className="text-xs font-medium text-accent-cyan uppercase tracking-widest mb-3">
            Multi-tenant SaaS
          </p>
          <h2 className="text-4xl font-bold text-text-primary leading-tight mb-4">
            Invoicing that
            <span className="gradient-text"> actually feels modern.</span>
          </h2>
          <p className="text-text-secondary leading-relaxed">
            Stop wrestling with spreadsheets. Create invoices, collect payments, and track revenue
            from one beautiful workspace.
          </p>

          <ul className="mt-10 space-y-5">
            {features.map((f) => (
              <li key={f.title} className="flex gap-4">
                <div className="w-10 h-10 rounded-xl glass-card flex items-center justify-center shrink-0">
                  <f.icon className="w-4 h-4 text-accent-cyan" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-primary">{f.title}</p>
                  <p className="text-xs text-text-muted mt-0.5">{f.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-text-muted">
          © {new Date().getFullYear()} InvoiceHub. Built with React + FastAPI + MongoDB.
        </p>
      </div>

      {/* Right — form */}
      <div className="relative flex items-center justify-center p-6 lg:p-12">
        <div className="absolute inset-0 lg:hidden ambient-glow" />
        <div className="relative w-full max-w-md">
          {eyebrow && (
            <p className="text-xs font-medium text-accent-cyan uppercase tracking-widest mb-2">
              {eyebrow}
            </p>
          )}
          {heading && (
            <h1 className="text-3xl font-bold text-text-primary mb-8">{heading}</h1>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}
