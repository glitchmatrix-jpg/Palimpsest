const STAGE_OPENERS = {
  Ace: 'The opening is not flowing cleanly. A beginning can be present without having enough access, timing or support to take form.',
  Two: 'The balance at the center of this card is unstable. A choice, pairing or tension between two forces is becoming harder to hold cleanly.',
  Three: 'Development is being interrupted or pulled off course. Something that should be growing may be scattered, delayed or expressing itself unevenly.',
  Four: 'A structure that should provide stability is becoming too loose, too rigid or difficult to trust. The issue is how the container is functioning, not simply whether it exists.',
  Five: 'The disruption in this card is no longer producing useful movement. Friction may be turning inward, being avoided, or taking more energy than the situation deserves.',
  Six: 'Adjustment is incomplete. The situation is trying to move toward a new balance, but something about the response, timing or exchange is not settling yet.',
  Seven: 'The test is being handled defensively or without enough clarity. Discernment is still needed, but the current response may be exhausting more energy than it protects.',
  Eight: 'Movement is disrupted rather than absent. Momentum exists, but it is not organizing itself into a clean direction.',
  Nine: 'What has accumulated is becoming difficult to carry cleanly. The issue is close enough to culmination that strain, excess or defensiveness is easier to see.',
  Ten: 'The cycle is overloaded or resisting closure. What should be completing may instead be spilling into excess, avoidance or unfinished responsibility.',
  Page: 'The Page’s learning mode is distorted. Curiosity can become insecurity, mixed signals or experimentation without enough grounding.',
  Knight: 'The Knight’s pursuit has lost proportion. Energy is still moving, but the direction, timing or commitment may be unreliable or too forceful.',
  Queen: 'The Queen’s ability to sustain the suit is under strain. What is normally held with maturity may be overextended, internalized or difficult to regulate.',
  King: 'The King’s directing function is out of balance. Authority, standards or self-command may be becoming rigid, detached or hard to use responsibly.',
};

const SUIT_LENSES = {
  Cups: 'emotional exchange, attachment, care or boundaries',
  Swords: 'thought, communication, conflict or judgment',
  Wands: 'pace, initiative, motivation or follow-through',
  Pentacles: 'work, resources, routine, security or practical stability',
};

function naturalList(items=[]){
  const values=items.filter(Boolean).slice(0,3);
  if(values.length===0) return '';
  if(values.length===1) return values[0];
  if(values.length===2) return `${values[0]} and ${values[1]}`;
  return `${values[0]}, ${values[1]} and ${values[2]}`;
}

function overlaps(text,phrase){
  const source=String(text||'').toLowerCase();
  return String(phrase||'').toLowerCase().split(/\s+/).filter(word=>word.length>4).some(word=>source.includes(word));
}

export function polishCardLanguage(card){
  if(card.arcana!=='Minor') return card;
  const opener=STAGE_OPENERS[card.rank] || card.explanation?.reversed || '';
  const lens=SUIT_LENSES[card.suit] || 'the part of life represented by this suit';
  let traits=(card.reversed||[]).filter(trait=>!overlaps(opener,trait));
  if(!traits.length) traits=(card.reversed||[]).slice(-2);
  const list=naturalList(traits);
  const reversed=`${opener} In ${card.suit}, this is most likely to show up through ${lens}${list?`, especially as ${list}`:''}.`;
  return {
    ...card,
    explanation:{...card.explanation,reversed:reversed.replace(/\s+/g,' ').trim()},
  };
}
