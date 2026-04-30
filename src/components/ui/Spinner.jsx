import { Loader2 } from 'lucide-react';

export default function Spinner({ size = 'md', className = '' }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-10 h-10' };
  return <Loader2 className={`${sizes[size]} animate-spin text-accent-indigo ${className}`} />;
}

export function CenterSpinner({ label }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <Spinner size="lg" />
      {label && <p className="text-sm text-text-muted">{label}</p>}
    </div>
  );
}
