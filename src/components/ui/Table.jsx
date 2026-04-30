export function Table({ children, className = '' }) {
  return (
    <div className="overflow-x-auto">
      <table className={`w-full text-sm ${className}`}>{children}</table>
    </div>
  );
}

export function THead({ children }) {
  return (
    <thead className="text-xs uppercase tracking-wider text-text-muted">
      {children}
    </thead>
  );
}

export function TBody({ children }) {
  return <tbody className="divide-y divide-white/[0.04]">{children}</tbody>;
}

export function TR({ children, onClick, className = '' }) {
  return (
    <tr
      onClick={onClick}
      className={`${onClick ? 'cursor-pointer hover:bg-white/[0.03]' : ''} transition ${className}`}
    >
      {children}
    </tr>
  );
}

export function TH({ children, className = '', align = 'left' }) {
  return (
    <th className={`px-5 py-3 font-medium text-${align} ${className}`}>{children}</th>
  );
}

export function TD({ children, className = '', align = 'left' }) {
  return (
    <td className={`px-5 py-4 text-${align} text-text-secondary ${className}`}>{children}</td>
  );
}
