export function CardFrame({ children, className = '', as: Tag = 'article' }) {
  return <Tag className={`ui-card-frame ${className}`.trim()}>{children}</Tag>;
}

export function LoadingState({ label = 'Loading Palimpsest…' }) {
  return (
    <div className="ui-loading" role="status" aria-live="polite">
      <span className="ui-loading__glyph" aria-hidden="true">◇</span>
      <span>{label}</span>
    </div>
  );
}

export function SectionEyebrow({ children }) {
  return <span className="ui-eyebrow">{children}</span>;
}
