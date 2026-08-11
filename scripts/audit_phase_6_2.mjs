import { TAROT_CARDS } from '../src/data/cardLibrary.js';
import { buildCardRead, SUPPORTED_POSITIONS } from '../src/components/read/deepReading.js';

const orientations = ['upright', 'reversed'];
const failures = [];
const forbidden = [
  'keeps this grounded in',
  'Because it is reversed, the theme is less straightforward',
  'In the Mind position',
  'In the Body position',
  'In the Spirit position',
];

let count = 0;

for (const card of TAROT_CARDS) {
  for (const orientation of orientations) {
    const entry = { card, orientation, revealed: true };
    const outputs = new Map();

    for (const position of SUPPORTED_POSITIONS) {
      count += 1;
      const result = buildCardRead(entry, position, '');
      const reading = String(result.reading || '').trim();
      const words = reading.split(/\s+/).filter(Boolean).length;

      if (words < 38) failures.push(`${card.name} ${orientation} / ${position}: only ${words} words`);
      if (!reading.includes(card.name)) failures.push(`${card.name} ${orientation} / ${position}: card name missing`);
      if (forbidden.some((phrase) => reading.includes(phrase))) failures.push(`${card.name} ${orientation} / ${position}: contains deprecated template language`);
      if (outputs.has(reading)) failures.push(`${card.name} ${orientation}: duplicate reading for ${outputs.get(reading)} and ${position}`);
      outputs.set(reading, position);
    }
  }
}

const expected = TAROT_CARDS.length * orientations.length * SUPPORTED_POSITIONS.length;
if (count !== expected) failures.push(`coverage mismatch: generated ${count}, expected ${expected}`);

if (failures.length) {
  console.error(`Phase 6.2 audit FAILED with ${failures.length} issue(s):`);
  failures.slice(0, 80).forEach((failure) => console.error(`- ${failure}`));
  if (failures.length > 80) console.error(`...and ${failures.length - 80} more.`);
  process.exit(1);
}

console.log(`Phase 6.2 audit passed: ${count} position-native card readings generated across ${TAROT_CARDS.length} cards.`);
