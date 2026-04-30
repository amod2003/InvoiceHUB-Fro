import { forwardRef } from 'react';

const Textarea = forwardRef(function Textarea(
  { label, error, hint, className = '', containerClassName = '', rows = 3, ...rest },
  ref
) {
  return (
    <div className={`flex flex-col gap-1.5 ${containerClassName}`}>
      {label && (
        <label className="text-xs font-medium text-text-secondary uppercase tracking-wider">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        rows={rows}
        className={`w-full px-3.5 py-2.5 rounded-lg bg-bg-elevated border border-border-subtle text-sm text-text-primary placeholder:text-text-muted transition-all focus:border-accent-indigo focus:bg-bg-surface focus:ring-2 focus:ring-accent-indigo/20 resize-none ${error ? 'border-status-danger/60' : ''} ${className}`}
        {...rest}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
      {hint && !error && <p className="text-xs text-text-muted">{hint}</p>}
    </div>
  );
});

export default Textarea;
