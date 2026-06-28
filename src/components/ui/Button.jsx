import { Loader2 } from 'lucide-react';

const variants = {
  primary:
    'bg-text-primary text-bg-base font-semibold hover:bg-text-primary/90 active:scale-[0.98]',
  secondary:
    'bg-text-primary/[0.06] text-text-primary border border-text-primary/[0.12] hover:bg-text-primary/[0.10] hover:border-text-primary/[0.22]',
  ghost:
    'bg-transparent text-text-secondary hover:bg-text-primary/[0.05] hover:text-text-primary',
  danger:
    'bg-status-danger/10 text-red-500 border border-status-danger/30 hover:bg-status-danger/20',
  outline:
    'bg-transparent text-text-primary border border-border-strong hover:border-text-primary/40',
};

const sizes = {
  sm: 'h-8 px-3 text-xs gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
  lg: 'h-12 px-6 text-base gap-2.5',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon: Icon,
  iconRight: IconRight,
  className = '',
  type = 'button',
  disabled,
  ...rest
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 focus-visible:ring-2 focus-visible:ring-text-primary/30 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base ${variants[variant]} ${sizes[size]} ${className}`}
      {...rest}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : Icon ? (
        <Icon className="w-4 h-4" />
      ) : null}
      {children}
      {IconRight && !loading ? <IconRight className="w-4 h-4" /> : null}
    </button>
  );
}
