export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6 gap-4">
      {Icon && (
        <div className="relative">
          <div className="absolute inset-0 blur-2xl bg-gradient-to-r from-indigo-500/40 to-cyan-400/40 rounded-full" />
          <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-cyan-400/20 border border-white/10 flex items-center justify-center">
            <Icon className="w-7 h-7 text-text-secondary" />
          </div>
        </div>
      )}
      <div className="max-w-sm">
        <h3 className="text-base font-semibold text-text-primary">{title}</h3>
        {description && <p className="text-sm text-text-muted mt-1">{description}</p>}
      </div>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
