import { useEffect, useRef } from 'react';

export default function Modal({ open, title, onClose, children }) {
  const panelRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const previous = document.activeElement;
    const onKey = (event) => {
      if (event.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', onKey);
    requestAnimationFrame(() => panelRef.current?.focus());
    return () => {
      document.removeEventListener('keydown', onKey);
      previous?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="ui-modal" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose?.();
    }}>
      <section className="ui-modal__panel" role="dialog" aria-modal="true" aria-labelledby="ui-modal-title" tabIndex={-1} ref={panelRef}>
        <div className="ui-modal__head">
          <h2 id="ui-modal-title">{title}</h2>
          <button className="ui-icon-button" type="button" onClick={onClose} aria-label="Close dialog">×</button>
        </div>
        <div className="ui-modal__body">{children}</div>
      </section>
    </div>
  );
}
