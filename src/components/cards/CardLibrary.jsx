import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import TiltedCard from '../../vendor/react-bits/TiltedCard/TiltedCard';
import { CARD_FILTERS, TAROT_CARDS } from '../../data/tarotDataset';

const asset = (path) => `${import.meta.env.BASE_URL}${path}`;

function matchesFilter(card, filter) {
  if (filter === 'All') return true;
  if (filter === 'Major') return card.arcana === 'Major';
  return card.suit === filter;
}

function CardTile({ card, onOpen }) {
  return (
    <button className="library-card" type="button" onClick={() => onOpen(card)} aria-label={`Open ${card.name}`}>
      <div className="library-card__art">
        <TiltedCard imageSrc={asset(card.image)} altText={card.name} rotateAmplitude={4} scaleOnHover={1.022} />
        <span className="library-card__glint" aria-hidden="true" />
      </div>
      <div className="library-card__meta">
        <span>{card.arcana === 'Major' ? `Major · ${card.number}` : `${card.suit} · ${card.rank}`}</span>
        <strong>{card.name}</strong>
      </div>
    </button>
  );
}

function CardDetail({ card, onClose }) {
  const [orientation, setOrientation] = useState('upright');
  const closeRef = useRef(null);

  useEffect(() => {
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.body.classList.add('card-modal-open');
    closeRef.current?.focus();

    const onKey = (event) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = oldOverflow;
      document.body.classList.remove('card-modal-open');
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  const reversed = orientation === 'reversed';
  const keywords = reversed ? card.reversed : card.upright;
  const meaning = reversed ? card.explanation.reversed : card.explanation.upright;
  const guidance = reversed ? card.practicalGuidance.reversed : card.practicalGuidance.upright;
  const questions = reversed ? card.questions.reversed : card.questions.upright;

  const modal = (
    <div
      className="card-focus"
      role="dialog"
      aria-modal="true"
      aria-labelledby="card-focus-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="card-focus__panel">
        <button ref={closeRef} className="card-focus__close" type="button" onClick={onClose} aria-label="Close card detail">×</button>

        <div className="card-focus__art-column">
          <p className="card-focus__eyebrow">{card.arcana === 'Major' ? `Major Arcana · ${card.number}` : `${card.suit} · ${card.rank}`}</p>
          <h2 id="card-focus-title">{card.name}</h2>
          <div className={`card-focus__image-wrap ${reversed ? 'is-reversed' : ''}`}>
            <img src={asset(card.image)} alt={card.name} />
          </div>
        </div>

        <div className="card-focus__content">
          <div className="orientation-switch" role="group" aria-label="Card orientation">
            <button type="button" className={!reversed ? 'is-active' : ''} onClick={() => setOrientation('upright')}>Upright</button>
            <button type="button" className={reversed ? 'is-active' : ''} onClick={() => setOrientation('reversed')}>Reversed</button>
          </div>

          <div className="card-focus__keywords" aria-label={`${orientation} keywords`}>
            {keywords.map((keyword) => <span key={keyword}>{keyword}</span>)}
          </div>

          <section>
            <span className="card-focus__label">Meaning</span>
            <p>{meaning}</p>
          </section>
          <section>
            <span className="card-focus__label">Symbols</span>
            <div className="card-focus__symbols">{card.symbols.map((symbol) => <span key={symbol}>◇ {symbol}</span>)}</div>
          </section>
          <section>
            <span className="card-focus__label">Guidance</span>
            <p>{guidance}</p>
          </section>
          <section>
            <span className="card-focus__label">Questions</span>
            <div className="card-focus__questions">{questions.map((question) => <p className="card-focus__reflection" key={question}>{question}</p>)}</div>
          </section>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}

export default function CardLibrary() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All');
  const [selected, setSelected] = useState(null);

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return TAROT_CARDS.filter((card) => {
      if (!matchesFilter(card, filter)) return false;
      if (!needle) return true;
      const haystack = [card.name, card.arcana, card.suit, card.rank, ...(card.upright || []), ...(card.reversed || []), ...(card.semanticThemes || [])]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return haystack.includes(needle);
    });
  }, [filter, query]);

  return (
    <div className="living-library">
      <div className="library-tools">
        <label className="library-search">
          <span className="sr-only">Search tarot cards</span>
          <span aria-hidden="true">⌕</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search cards, themes or keywords…" />
          {query && <button type="button" onClick={() => setQuery('')} aria-label="Clear search">×</button>}
        </label>

        <div className="library-filters" role="group" aria-label="Filter tarot cards">
          {CARD_FILTERS.map((item) => (
            <button key={item} type="button" className={filter === item ? 'is-active' : ''} onClick={() => setFilter(item)}>{item}</button>
          ))}
        </div>

        <div className="library-count" aria-live="polite">
          <span>{String(visible.length).padStart(2, '0')}</span>
          <span>{filter === 'All' ? 'cards visible' : `${filter.toLowerCase()} cards`}</span>
        </div>
      </div>

      {visible.length ? (
        <div className="library-grid">
          {visible.map((card) => <CardTile key={card.id} card={card} onOpen={setSelected} />)}
        </div>
      ) : (
        <div className="library-empty">
          <span>◇</span>
          <h2>No card found.</h2>
          <p>Try another name, suit or theme.</p>
        </div>
      )}

      {selected && <CardDetail card={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
