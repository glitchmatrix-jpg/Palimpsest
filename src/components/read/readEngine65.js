import { buildDeepReading } from './deepReading.js';
import { buildEvidenceLayers } from './evidenceLayers.js';

export function buildValidatedReading(entries, positions, question='') {
  const reading = buildDeepReading(entries, positions, question);
  return {
    ...reading,
    layers: buildEvidenceLayers(entries),
  };
}
