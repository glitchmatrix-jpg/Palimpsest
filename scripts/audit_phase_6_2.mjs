import { TAROT_CARDS } from '../src/data/cardLibrary.js';
import { buildCardRead, SUPPORTED_POSITIONS } from '../src/components/read/deepReading.js';

const ORIENTATIONS = ['upright', 'reversed'];
const failures = [];
const warnings = [];
const corpus = [];

const FORBIDDEN = [
  'keeps this grounded in',
  'Because it is reversed, the theme is less straightforward',
  'In the Mind position',
  'In the Body position',
  'In the Spirit position',
  "does not prove that",
  'hypothesis to compare',
  'fit it to your question',
  "don't overclaim",
  'turn this into an experiment',
  'the card “must” be about',
];

const OVERCLAIMS = [
  /\bwill definitely\b/i,
  /\bguarantee(?:d|s)?\b/i,
  /\bdestined\b/i,
  /\bmust happen\b/i,
  /\bwill happen\b/i,
  /\bthey secretly\b/i,
  /\bthey definitely (?:feel|think|want|believe)\b/i,
];

const POSITION_SIGNALS = {
  Past: [/past/i, /shap(?:e|ed|ing)/i, /background/i, /carried/i, /created/i],
  Present: [/right now/i, /present/i, /active/i, /foreground/i, /attention/i],
  Future: [/ahead/i, /direction/i, /moving toward/i, /more likely/i, /not (?:a )?fixed/i],
  Situation: [/situation/i, /condition/i, /going on/i, /fundamentally/i],
  Challenge: [/challenge/i, /difficult/i, /difficulty/i, /friction/i, /cost/i, /obstacle/i],
  Advice: [/advice/i, /respond/i, /choose/i, /do\b/i, /action/i, /step/i, /conversation/i, /boundary/i],
  Mind: [/mentally/i, /thinking/i, /thought/i, /expect/i, /assum/i, /interpret/i],
  Body: [/lived/i, /day-to-day/i, /body/i, /energy/i, /routine/i, /behavio/i, /capacity/i, /health/i],
  Spirit: [/deeper/i, /value/i, /identity/i, /meaning/i, /belie/i, /principle/i],
  You: [/your side/i, /you are/i, /your stance/i, /you may/i, /your contribution/i],
  Them: [/other person/i, /from the outside/i, /they (?:do|say|avoid|choose)/i, /observable/i, /appears?/i],
  Relationship: [/between you/i, /relationship/i, /connection/i, /interaction/i, /both sides/i, /recurring pattern/i],
};

const ROLE_SIGNALS = {
  Page: [/learn/i, /question/i, /curious/i, /test/i, /explor/i, /beginner/i],
  Knight: [/pursu/i, /active/i, /commit/i, /movement/i, /drive/i, /effort/i],
  Queen: [/embody/i, /sustain/i, /hold/i, /matur/i, /integrat/i, /capacity/i],
  King: [/direct/i, /manage/i, /responsib/i, /lead/i, /authority/i, /standards/i],
};

function words(text) {
  return String(text || '').trim().split(/\s+/).filter(Boolean);
}

function sentences(text) {
  return String(text || '')
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function normalize(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/[“”‘’]/g, "'")
    .replace(/[^a-z0-9' ]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function tokenSet(text) {
  return new Set(normalize(text).split(' ').filter((w) => w.length > 2));
}

function jaccard(a, b) {
  const A = tokenSet(a);
  const B = tokenSet(b);
  if (!A.size && !B.size) return 1;
  let intersection = 0;
  for (const token of A) if (B.has(token)) intersection += 1;
  return intersection / (A.size + B.size - intersection);
}

function rankOf(card) {
  return ['Page', 'Knight', 'Queen', 'King'].find((rank) => card.name.startsWith(`${rank} of `)) || null;
}

function hasTheme(reading, entry) {
  const themes = entry.orientation === 'reversed' ? entry.card.reversed : entry.card.upright;
  const haystack = normalize(reading);
  return themes.some((theme) => {
    const parts = normalize(theme).split(' ').filter((p) => p.length > 3);
    return parts.some((part) => haystack.includes(part));
  });
}

function assert(condition, message) {
  if (!condition) failures.push(message);
}

let count = 0;
const byKey = new Map();

for (const card of TAROT_CARDS) {
  for (const orientation of ORIENTATIONS) {
    const entry = { card, orientation, revealed: true };
    const outputs = new Map();

    for (const position of SUPPORTED_POSITIONS) {
      count += 1;
      const result = buildCardRead(entry, position, '');
      const reading = String(result.reading || '').trim();
      const wc = words(reading).length;
      const label = `${card.name} ${orientation} / ${position}`;
      const normalized = normalize(reading);

      corpus.push({ card, orientation, position, reading, normalized });
      byKey.set(`${card.id}|${orientation}|${position}`, reading);

      assert(wc >= 42, `${label}: too short (${wc} words)`);
      assert(wc <= 155, `${label}: too long (${wc} words)`);
      assert(reading.includes(card.name), `${label}: card name missing`);
      assert(hasTheme(reading, entry), `${label}: does not clearly carry an orientation-specific card theme`);
      assert(!FORBIDDEN.some((phrase) => reading.toLowerCase().includes(phrase.toLowerCase())), `${label}: contains deprecated template/disclaimer language`);
      assert(!OVERCLAIMS.some((pattern) => pattern.test(reading)), `${label}: contains deterministic or mind-reading language`);
      assert(POSITION_SIGNALS[position].some((pattern) => pattern.test(reading)), `${label}: position does not read distinctly enough as ${position}`);
      assert(!/\b(\w+)\s+\1\b/i.test(reading), `${label}: contains a doubled word`);
      assert(!/\s{2,}/.test(reading), `${label}: contains repeated whitespace`);
      assert(!/[.!?]{2,}/.test(reading), `${label}: contains malformed punctuation`);

      const sentenceList = sentences(reading).map(normalize);
      assert(new Set(sentenceList).size === sentenceList.length, `${label}: repeats a sentence internally`);

      if (position === 'Future') {
        assert(/direction|more likely|not (?:a )?fixed|current path|moving toward/i.test(reading), `${label}: future reads too much like certainty`);
      }
      if (position === 'Them') {
        assert(/outside|actually|do, say|do or say|appears?|observable|behavio|repeatedly choose/i.test(reading), `${label}: Them reading does not sufficiently anchor to observable behaviour`);
      }
      if (position === 'Advice') {
        assert(/respond|choose|step|decision|boundary|conversation|pause|ask|name|simplify|improve|check|move|protect|clarity|practical/i.test(reading), `${label}: Advice lacks an actionable response`);
      }

      const rank = rankOf(card);
      if (rank && ['Mind', 'Body', 'Spirit', 'Advice'].includes(position)) {
        assert(ROLE_SIGNALS[rank].some((pattern) => pattern.test(reading)), `${label}: ${rank} role is not visible in the reading`);
      }

      if (outputs.has(normalized)) {
        failures.push(`${card.name} ${orientation}: duplicate reading for ${outputs.get(normalized)} and ${position}`);
      }
      outputs.set(normalized, position);
    }
  }
}

for (const card of TAROT_CARDS) {
  for (const position of SUPPORTED_POSITIONS) {
    const up = byKey.get(`${card.id}|upright|${position}`);
    const rev = byKey.get(`${card.id}|reversed|${position}`);
    const similarity = jaccard(up, rev);
    assert(similarity < 0.82, `${card.name} / ${position}: upright and reversed are too similar (${similarity.toFixed(2)})`);
  }
}

for (const card of TAROT_CARDS) {
  for (const orientation of ORIENTATIONS) {
    for (let i = 0; i < SUPPORTED_POSITIONS.length; i += 1) {
      for (let j = i + 1; j < SUPPORTED_POSITIONS.length; j += 1) {
        const aPos = SUPPORTED_POSITIONS[i];
        const bPos = SUPPORTED_POSITIONS[j];
        const a = byKey.get(`${card.id}|${orientation}|${aPos}`);
        const b = byKey.get(`${card.id}|${orientation}|${bPos}`);
        const similarity = jaccard(a, b);
        assert(similarity < 0.80, `${card.name} ${orientation}: ${aPos} and ${bPos} are too similar (${similarity.toFixed(2)})`);
      }
    }
  }
}

const sentenceFrequency = new Map();
for (const item of corpus) {
  for (const sentence of sentences(item.reading)) {
    const s = normalize(sentence)
      .replace(normalize(item.card.name), '<card>')
      .replace(/\b(?:upright|reversed)\b/g, '<orientation>');
    if (s.length < 35) continue;
    sentenceFrequency.set(s, (sentenceFrequency.get(s) || 0) + 1);
  }
}
for (const [sentence, frequency] of sentenceFrequency) {
  if (frequency > 78) failures.push(`boilerplate sentence appears ${frequency} times: "${sentence.slice(0, 140)}"`);
  else if (frequency > 45) warnings.push(`common sentence appears ${frequency} times: "${sentence.slice(0, 120)}"`);
}

const expected = TAROT_CARDS.length * ORIENTATIONS.length * SUPPORTED_POSITIONS.length;
assert(count === expected, `coverage mismatch: generated ${count}, expected ${expected}`);
assert(TAROT_CARDS.length === 78, `deck coverage mismatch: expected 78 cards, found ${TAROT_CARDS.length}`);
assert(SUPPORTED_POSITIONS.length === 12, `position coverage mismatch: expected 12 positions, found ${SUPPORTED_POSITIONS.length}`);

if (warnings.length) {
  console.warn(`Phase 6.2 audit warnings (${warnings.length}):`);
  warnings.slice(0, 30).forEach((warning) => console.warn(`- ${warning}`));
}

if (failures.length) {
  console.error(`Phase 6.2 DEEP AUDIT FAILED with ${failures.length} issue(s):`);
  failures.slice(0, 120).forEach((failure) => console.error(`- ${failure}`));
  if (failures.length > 120) console.error(`...and ${failures.length - 120} more.`);
  process.exit(1);
}

console.log(`Phase 6.2 deep audit passed: ${count} readings (${TAROT_CARDS.length} cards × ${ORIENTATIONS.length} orientations × ${SUPPORTED_POSITIONS.length} positions).`);
console.log('Checks passed: coverage, length, card themes, position semantics, reversals, courts, safety, duplication, boilerplate, grammar and determinism.');
