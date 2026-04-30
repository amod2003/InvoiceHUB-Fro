export default function Card({ children, className = '', glow = false, ...rest }) {
  return (
    <div
      className={`glass-card rounded-2xl ${glow ? 'shadow-glow-indigo' : 'shadow-card'} ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}

export function CardHeader({ title, subtitle, action, className = '' }) {
  return (
    <div className={`flex items-start justify-between gap-4 px-6 pt-6 pb-4 ${className}`}>
      <div>
        {title && <h3 className="text-base font-semibold text-text-primary">{title}</h3>}
        {subtitle && <p className="text-sm text-text-muted mt-0.5">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function CardBody({ children, className = '' }) {
  return <div className={`px-6 pb-6 ${className}`}>{children}</div>;
}
