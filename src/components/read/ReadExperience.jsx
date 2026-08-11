import { useMemo, useState } from 'react';
import SpotlightCard from '../../vendor/react-bits/SpotlightCard/SpotlightCard';
import { TAROT_CARDS } from '../../data/cardLibrary';

const asset = (path) => `${import.meta.env.BASE_URL}${path}`;

const SPREADS = [
  {
    id: 'past-present-future',
    name: 'Past · Present · Future',
    short: 'Trace how a situation became what it is, what is active now, and where the current pattern points.',
    positions: ['Past', 'Present', 'Future'],
  },
  {
    id: 'situation-challenge-advice',
    name: 'Situation · Challenge · Advice',
    short: 'Separate what is happening from what complicates it, then identify the most useful response.',
    positions: ['Situation', 'Challenge', 'Advice'],
  },
  {
    id: 'mind-body-spirit',
    name: 'Mind · Body · Spirit',
    short: 'Compare thought, lived reality, and the larger meaning or value organizing the situation.',
    positions: ['Mind', 'Body', 'Spirit'],
  },
  {
    id: 'you-them-relationship',
    name: 'You · Them · Relationship',
    short: 'Distinguish two perspectives from the dynamic created between them.',
    positions: ['You', 'Them', 'Relationship'],
  },
];

const POSITION_LENSES = {
  Past: 'Treat this as a condition, decision, or pattern that helped create the present situation.',
  Present: 'Treat this as the pressure that is most active now — the part that needs to be recognized before anything changes.',
  Future: 'Treat this as a likely direction if the current pattern continues, not as a fixed prediction.',
  Situation: 'Use this card to name the situation before trying to solve it.',
  Challenge: 'Use this card to identify the friction, blind spot, or demand that makes the situation harder.',
  Advice: 'Use this card as a practical response: what quality, action, boundary, or perspective would improve the situation?',
  Mind: 'Read this as the dominant interpretation, assumption, or mental pressure shaping the situation.',
  Body: 'Read this as what is materially happening: capacity, routine, action, health, resources, or lived conditions.',
  Spirit: 'Read this as the value, meaning, or developmental question underneath the immediate problem.',
  You: 'Read this as your current stance, need, or contribution to the dynamic.',
  Them: 'Read this as the other person’s apparent stance or role without pretending to know their private thoughts.',
  Relationship: 'Read this as the pattern produced between both sides — what the connection itself is doing.',
};

const PAIR_RULES = [
  [['The Moon', 'The Sun'], 'contrast', 'uncertainty moves toward visibility', 'hidden → revealed · night → day · ambiguity → clarity'],
  [['The Tower', 'The Star'], 'recovery', 'collapse is followed by reorientation', 'false structure → clearing → credible hope'],
  [['Death', 'Temperance'], 'integration', 'an ending creates room for a better arrangement', 'closure → re-composition'],
  [['The Devil', 'The Tower'], 'release', 'an attachment becomes impossible to maintain in its old structure', 'bond → exposure → rupture'],
  [['The Hermit', 'Wheel of Fortune'], 'adaptation', 'inner clarity meets conditions you cannot control', 'reflection → changing circumstances'],
  [['The Lovers', 'The Chariot'], 'commitment', 'a value-based choice becomes sustained direction', 'choice → coordination → movement'],
  [['The Hanged Man', 'Death'], 'transition', 'a changed perspective becomes a real ending', 'reframe → release'],
];

function shuffledDraw(count) {
  const pool = [...TAROT_CARDS];
  for (let i = pool.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, count).map((card) => ({ card, orientation: Math.random() < 0.5 ? 'upright' : 'reversed', revealed: false }));
}

function cardKeywords(entry) {
  return entry.orientation === 'reversed' ? entry.card.reversed : entry.card.upright;
}

function cardMeaning(entry) {
  return entry.orientation === 'reversed' ? entry.card.reversedMeaning : entry.card.meaning;
}

function keyword(entry) {
  return cardKeywords(entry)?.[0] || 'development';
}

function relationBetween(a, b) {
  for (const [names, type, sentence, axis] of PAIR_RULES) {
    if (names.includes(a.card.name) && names.includes(b.card.name)) return { type, sentence, axis };
  }
  if (a.card.suit && a.card.suit === b.card.suit) {
    return {
      type: 'reinforcement',
      sentence: `Both cards stay in ${a.card.suit}, so the reading keeps pressure on the same life domain rather than changing subjects.`,
      axis: `${keyword(a)} → ${keyword(b)}`,
    };
  }
  if (a.card.arcana === 'Major' && b.card.arcana === 'Major') {
    return {
      type: 'archetypal shift',
      sentence: 'Two Major Arcana in sequence widen the frame: the movement is less about one isolated event and more about a larger change in stance or development.',
      axis: `${keyword(a)} → ${keyword(b)}`,
    };
  }
  if (a.orientation !== b.orientation) {
    return {
      type: 'change in expression',
      sentence: 'The orientation changes between these cards, suggesting that the issue moves between direct expression and something more blocked, internal, excessive, or redirected.',
      axis: `${keyword(a)} → ${keyword(b)}`,
    };
  }
  return {
    type: 'progression',
    sentence: `The second card changes the problem introduced by the first: ${keyword(a)} does not stay static; it develops into ${keyword(b)}.`,
    axis: `${keyword(a)} → ${keyword(b)}`,
  };
}

function buildLayers(entries) {
  const layers = [];
  const majors = entries.filter((entry) => entry.card.arcana === 'Major');
  if (majors.length >= 2) {
    layers.push({
      title: `${majors.length} Major Arcana`,
      lead: 'Broader developmental emphasis',
      text: 'Most of the spread is operating at the level of identity, values, transition, or major reorientation rather than only day-to-day logistics.',
    });
  } else if (majors.length === 1) {
    layers.push({
      title: 'One Major Arcana',
      lead: `${majors[0].card.name} is the widest frame`,
      text: 'The Major card acts like the chapter heading; the Minor cards show how that larger issue is being lived in concrete terms.',
    });
  }

  const suitCounts = entries.reduce((acc, entry) => {
    if (entry.card.suit) acc[entry.card.suit] = (acc[entry.card.suit] || 0) + 1;
    return acc;
  }, {});
  const dominant = Object.entries(suitCounts).sort((a, b) => b[1] - a[1])[0];
  if (dominant?.[1] >= 2) {
    const domains = {
      Cups: 'Emotion / relationship emphasis',
      Swords: 'Thought / truth / conflict emphasis',
      Wands: 'Action / ambition / momentum emphasis',
      Pentacles: 'Work / body / resources emphasis',
    };
    layers.push({
      title: `${dominant[0]} emphasis`,
      lead: domains[dominant[0]],
      text: `Two or more cards come from ${dominant[0]}. That means the spread keeps returning to this domain instead of treating it as background context.`,
    });
  }

  const reversed = entries.filter((entry) => entry.orientation === 'reversed').length;
  if (reversed === 0) {
    layers.push({ title: 'All upright', lead: 'Direct expression', text: 'The themes are showing themselves relatively openly. The main work is deciding how to respond, not first locating where the energy has gone underground.' });
  } else if (reversed >= 2) {
    layers.push({ title: `${reversed} reversed cards`, lead: 'Modified expression', text: 'Much of the spread is operating indirectly: blocked, internalized, excessive, delayed, or in need of redirection. Reversal changes the mode of a card; it does not automatically make it negative.' });
  }

  for (let i = 0; i < entries.length - 1; i += 1) {
    const rel = relationBetween(entries[i], entries[i + 1]);
    if (PAIR_RULES.some(([names]) => names.includes(entries[i].card.name) && names.includes(entries[i + 1].card.name))) {
      layers.push({ title: `${entries[i].card.name} ↔ ${entries[i + 1].card.name}`, lead: rel.type, text: `${rel.axis}. ${rel.sentence}` });
    }
  }

  return layers.slice(0, 4);
}

function synthesize(entries, positions, question) {
  const relations = [relationBetween(entries[0], entries[1]), relationBetween(entries[1], entries[2])];
  const trajectory = entries.map(keyword).join(' → ');
  const questionLead = question?.trim() ? `For “${question.trim()}”, ` : '';
  const summary = `${questionLead}the spread moves from ${keyword(entries[0])}, through ${keyword(entries[1])}, toward ${keyword(entries[2])}. The middle card matters because it explains the mechanism of change rather than acting as filler.`;
  const cards = entries.map((entry, index) => ({
    ...entry,
    position: positions[index],
    lens: POSITION_LENSES[positions[index]],
    meaning: cardMeaning(entry),
  }));
  const reflection = [
    `What would it look like to respond to ${keyword(entries[1])} directly instead of trying to skip from ${keyword(entries[0])} to ${keyword(entries[2])}?`,
    `Which part of this sequence is already observable in your situation, and which part are you only assuming?`,
    `If ${keyword(entries[2])} is a direction rather than a promise, what choice now would make that direction more plausible?`,
  ];
  return { cards, relations, trajectory, summary, layers: buildLayers(entries), reflection };
}

function SpreadChoice({ spread, selected, onSelect }) {
  return (
    <button className={`read-spread ${selected ? 'is-selected' : ''}`} type="button" onClick={onSelect}>
      <SpotlightCard className="read-spread__spotlight" spotlightColor="rgba(214,180,92,.2)">
        <span>{spread.positions.join(' · ')}</span>
        <h3>{spread.name}</h3>
        <p>{spread.short}</p>
        <i>{selected ? 'Selected' : 'Choose spread'} →</i>
      </SpotlightCard>
    </button>
  );
}

function CardPicker({ usedIds, onChoose, onClose }) {
  const [query, setQuery] = useState('');
  const [orientation, setOrientation] = useState('upright');
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return TAROT_CARDS.filter((card) => !usedIds.has(card.id) && (!q || [card.name, card.suit, card.arcana, ...(card.upright || [])].filter(Boolean).join(' ').toLowerCase().includes(q)));
  }, [query, usedIds]);

  return (
    <div className="read-picker" role="dialog" aria-modal="true" aria-label="Choose a tarot card" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="read-picker__panel">
        <div className="read-picker__head">
          <div><span>PHYSICAL DECK</span><h2>Choose the card you drew.</h2></div>
          <button type="button" onClick={onClose} aria-label="Close">×</button>
        </div>
        <div className="read-picker__tools">
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search the deck…" autoFocus />
          <div className="read-picker__orientation">
            <button className={orientation === 'upright' ? 'is-active' : ''} type="button" onClick={() => setOrientation('upright')}>Upright</button>
            <button className={orientation === 'reversed' ? 'is-active' : ''} type="button" onClick={() => setOrientation('reversed')}>Reversed</button>
          </div>
        </div>
        <div className="read-picker__grid">
          {visible.map((card) => (
            <button type="button" key={card.id} onClick={() => onChoose({ card, orientation, revealed: false })}>
              <img src={asset(card.image)} alt="" /><span>{card.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function DealtCard({ label, entry, index, method, onPick, onReveal }) {
  return (
    <div className="read-dealt">
      <span className="read-dealt__position">{label}</span>
      <button className={`read-flip ${entry?.revealed ? 'is-revealed' : ''}`} type="button" onClick={() => {
        if (!entry) onPick(index);
        else if (!entry.revealed) onReveal(index);
      }} aria-label={!entry ? `Choose card for ${label}` : entry.revealed ? `${entry.card.name}, ${entry.orientation}` : `Reveal ${label} card`}>
        <div className="read-flip__inner">
          <div className="read-flip__face read-flip__back">
            <img src={asset('cards/tarot_card_back.png')} alt="Tarot card back" />
            {!entry && method === 'physical' && <span>Choose card</span>}
          </div>
          <div className={`read-flip__face read-flip__front ${entry?.orientation === 'reversed' ? 'is-reversed' : ''}`}>
            {entry && <img src={asset(entry.card.image)} alt={entry.card.name} />}
          </div>
        </div>
      </button>
      <div className="read-dealt__caption">
        {!entry && <span>{method === 'physical' ? 'Enter your draw' : 'Waiting'}</span>}
        {entry && !entry.revealed && <span>Tap to reveal</span>}
        {entry?.revealed && <><strong>{entry.card.name}</strong><span>{entry.orientation}</span></>}
      </div>
    </div>
  );
}

export default function ReadExperience() {
  const [stage, setStage] = useState('setup');
  const [question, setQuestion] = useState('');
  const [spreadId, setSpreadId] = useState(SPREADS[0].id);
  const [method, setMethod] = useState('physical');
  const [entries, setEntries] = useState([null, null, null]);
  const [pickerIndex, setPickerIndex] = useState(null);

  const spread = SPREADS.find((item) => item.id === spreadId) || SPREADS[0];
  const allChosen = entries.every(Boolean);
  const allRevealed = entries.every((entry) => entry?.revealed);
  const analysis = useMemo(() => allChosen ? synthesize(entries, spread.positions, question) : null, [allChosen, entries, spread.positions, question]);

  const begin = () => {
    const next = method === 'digital' ? shuffledDraw(3) : [null, null, null];
    setEntries(next);
    setStage('deal');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const chooseManual = (entry) => {
    setEntries((current) => current.map((item, index) => index === pickerIndex ? entry : item));
    setPickerIndex(null);
  };

  const reveal = (index) => {
    setEntries((current) => current.map((item, i) => i === index ? { ...item, revealed: true } : item));
  };

  const revealAll = () => setEntries((current) => current.map((item) => item ? { ...item, revealed: true } : item));

  const reset = () => {
    setStage('setup');
    setEntries([null, null, null]);
    setPickerIndex(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={`read-experience read-experience--${stage}`}>
      <div className="read-atmosphere" aria-hidden="true"><i /><i /><i /><i /></div>

      {stage === 'setup' && (
        <section className="read-setup">
          <div className="read-kicker">III · READ</div>
          <h1>What are you<br />reading for?</h1>
          <p className="read-setup__lead">A useful reading begins with a question that leaves room for information. You do not need to make it mystical; you need to make it specific enough to examine.</p>

          <label className="read-question">
            <span>OPTIONAL QUESTION</span>
            <textarea value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="What am I not seeing clearly about…? What would help me handle…? What is changing in…?" rows="3" />
            <small>Prefer “what / how / where” over yes-or-no questions. Tarot is better at framing a situation than certifying an outcome.</small>
          </label>

          <div className="read-setup__section">
            <div className="read-section-head"><span>01</span><div><h2>Choose a spread.</h2><p>The positions determine what each card is being asked to do.</p></div></div>
            <div className="read-spreads">
              {SPREADS.map((item) => <SpreadChoice key={item.id} spread={item} selected={spreadId === item.id} onSelect={() => setSpreadId(item.id)} />)}
            </div>
          </div>

          <div className="read-setup__section read-method-section">
            <div className="read-section-head"><span>02</span><div><h2>How are you drawing?</h2><p>Use your physical deck or let Palimpsest draw three unique cards.</p></div></div>
            <div className="read-methods">
              <button className={method === 'physical' ? 'is-active' : ''} type="button" onClick={() => setMethod('physical')}><span>PHYSICAL DECK</span><strong>I already have the cards.</strong><p>Draw normally, then enter each card and orientation.</p></button>
              <button className={method === 'digital' ? 'is-active' : ''} type="button" onClick={() => setMethod('digital')}><span>DIGITAL DRAW</span><strong>Draw inside Palimpsest.</strong><p>Three cards, no replacement. Reversals are randomized independently.</p></button>
            </div>
          </div>

          <button className="read-begin" type="button" onClick={begin}><span>BEGIN READING</span><i>◇</i></button>
        </section>
      )}

      {stage === 'deal' && (
        <section className="read-table">
          <div className="read-table__head">
            <span>{spread.name}</span>
            <h1>Turn the cards over<br />one at a time.</h1>
            <p>{question.trim() || 'No question entered — read the spread as a general snapshot of the situation occupying your attention.'}</p>
          </div>
          <div className="read-deal-grid">
            {spread.positions.map((label, index) => <DealtCard key={label} label={label} entry={entries[index]} index={index} method={method} onPick={setPickerIndex} onReveal={reveal} />)}
          </div>
          <div className="read-table__actions">
            {allChosen && !allRevealed && <button type="button" onClick={revealAll}>Reveal all</button>}
            <button className="read-interpret" type="button" disabled={!allRevealed} onClick={() => { setStage('reading'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>INTERPRET READING <i>→</i></button>
            <button className="read-reset-link" type="button" onClick={reset}>Start over</button>
          </div>
        </section>
      )}

      {stage === 'reading' && analysis && (
        <article className="read-result">
          <header className="read-result__hero">
            <span>PALIMPSEST · {spread.name.toUpperCase()}</span>
            <h1>Read the movement,<br />not three definitions.</h1>
            <p>{analysis.summary}</p>
            <div className="read-trajectory">{analysis.trajectory.split(' → ').map((item, index, arr) => <span key={`${item}-${index}`}><b>{item}</b>{index < arr.length - 1 && <i>→</i>}</span>)}</div>
          </header>

          <section className="reading-layer reading-layer--cards">
            <div className="reading-layer__title"><span>01</span><div><small>THE CARDS</small><h2>First, read each position cleanly.</h2><p>Position changes function. The same card can mean something different as a cause, obstacle, advice, or direction.</p></div></div>
            <div className="reading-cards">
              {analysis.cards.map((entry) => (
                <div className="reading-card" key={entry.position}>
                  <div className={`reading-card__art ${entry.orientation === 'reversed' ? 'is-reversed' : ''}`}><img src={asset(entry.card.image)} alt={entry.card.name} /></div>
                  <div><span>{entry.position} · {entry.orientation}</span><h3>{entry.card.name}</h3><strong>{keyword(entry)}</strong><p>{entry.meaning}</p><div className="reading-card__lens"><small>POSITION LENS</small><p>{entry.lens}</p></div></div>
                </div>
              ))}
            </div>
          </section>

          <section className="reading-layer reading-layer--thread">
            <div className="reading-layer__title"><span>02</span><div><small>THE THREAD</small><h2>Now ask what changes from card to card.</h2><p>A spread becomes useful when the middle explains how the first condition could become the last.</p></div></div>
            <div className="thread-map">
              <svg viewBox="0 0 1000 300" preserveAspectRatio="none" aria-hidden="true"><path d="M120 150 C270 35 350 265 500 150 S730 35 880 150" pathLength="1" /></svg>
              {analysis.cards.map((entry, index) => <div className={`thread-node thread-node--${index + 1}`} key={entry.position}><img src={asset(entry.card.image)} alt="" /><span>{entry.position}</span><strong>{entry.card.name}</strong><b>{keyword(entry)}</b></div>)}
            </div>
            <div className="thread-relations">
              {analysis.relations.map((relation, index) => <div key={`${relation.type}-${index}`}><span>{String(index + 1).padStart(2, '0')} · {relation.type}</span><h3>{relation.axis}</h3><p>{relation.sentence}</p></div>)}
            </div>
          </section>

          <section className="reading-layer reading-layer--layers">
            <div className="reading-layer__title"><span>03</span><div><small>THE LAYERS</small><h2>Patterns underneath the individual cards.</h2><p>These are structural observations, not mystical statistics. They matter only when they help explain the spread more clearly.</p></div></div>
            <div className="layers-grid">
              {analysis.layers.map((layer) => <div className="layer-card" key={layer.title}><span>◇</span><h3>{layer.title}</h3><strong>{layer.lead}</strong><p>{layer.text}</p></div>)}
            </div>
          </section>

          <section className="reading-layer reading-layer--reflection">
            <div className="reading-layer__title"><span>04</span><div><small>REFLECTION</small><h2>Turn interpretation into something usable.</h2><p>The reading is finished when it gives you a better question, distinction, or next action — not when it sounds impressive.</p></div></div>
            <div className="reflection-list">{analysis.reflection.map((item, index) => <div key={item}><span>0{index + 1}</span><p>{item}</p></div>)}</div>
            <div className="reading-close"><p><strong>Working synthesis:</strong> {analysis.summary}</p><button type="button" onClick={reset}>New reading</button></div>
          </section>
        </article>
      )}

      {pickerIndex !== null && <CardPicker usedIds={new Set(entries.filter(Boolean).map((entry) => entry.card.id))} onChoose={chooseManual} onClose={() => setPickerIndex(null)} />}
    </div>
  );
}
