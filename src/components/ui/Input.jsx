import { forwardRef } from 'react';

const Input = forwardRef(function Input(
  { label, error, icon: Icon, hint, className = '', containerClassName = '', ...rest },
  ref
) {
  return (
    <div className={`flex flex-col gap-1.5 ${containerClassName}`}>
      {label && (
        <label className="text-xs font-medium text-text-secondary uppercase tracking-wider">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
        )}
        <input
          ref={ref}
          className={`w-full h-10 ${Icon ? 'pl-10' : 'pl-3.5'} pr-3.5 rounded-lg bg-bg-elevated border border-border-subtle text-sm text-text-primary placeholder:text-text-muted transition-all focus:border-accent-indigo focus:bg-bg-surface focus:ring-2 focus:ring-accent-indigo/20 ${error ? 'border-status-danger/60' : ''} ${className}`}
          {...rest}
        />
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
      {hint && !error && <p className="text-xs text-text-muted">{hint}</p>}
    </div>
  );
});

export default Input;
