import { TAROT_CARDS as BASE_CARDS, CARD_FILTERS } from './cardLibrary.js';
import { enrichCard, TAROT_STRUCTURE } from './cardSemantics.js';

export const TAROT_CARDS = BASE_CARDS.map(enrichCard);
export { CARD_FILTERS, TAROT_STRUCTURE };

export function cardById(id){
  return TAROT_CARDS.find((card)=>card.id===id) || null;
}
