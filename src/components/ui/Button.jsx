import { Loader2 } from 'lucide-react';

const variants = {
  primary:
    'bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-400 text-white shadow-glow-indigo hover:shadow-glow-violet hover:scale-[1.02] active:scale-[0.98]',
  secondary:
    'bg-white/[0.06] text-text-primary border border-white/10 hover:bg-white/[0.1] hover:border-white/20',
  ghost: 'bg-transparent text-text-secondary hover:bg-white/[0.05] hover:text-text-primary',
  danger:
    'bg-status-danger/10 text-red-300 border border-status-danger/30 hover:bg-status-danger/20',
  outline:
    'bg-transparent text-text-primary border border-border-subtle hover:border-accent-indigo/60 hover:text-white',
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
      className={`inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 focus-visible:ring-2 focus-visible:ring-accent-indigo focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base ${variants[variant]} ${sizes[size]} ${className}`}
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
