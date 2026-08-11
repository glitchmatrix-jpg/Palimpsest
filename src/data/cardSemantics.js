const NUMBER_THEMES = {
  Ace: { stage:'beginning', theme:'seed, opening and potential' },
  Two: { stage:'polarity', theme:'choice, pairing and tension between two forces' },
  Three: { stage:'growth', theme:'development, expression and something becoming visible' },
  Four: { stage:'structure', theme:'stability, containment and the shape that holds something' },
  Five: { stage:'disruption', theme:'friction, instability and pressure that forces adjustment' },
  Six: { stage:'adjustment', theme:'response, recalibration and movement toward a new balance' },
  Seven: { stage:'test', theme:'discernment, challenge and proving what can hold' },
  Eight: { stage:'movement', theme:'momentum, concentration and a pattern becoming difficult to ignore' },
  Nine: { stage:'culmination', theme:'near-completion, consequence and what has accumulated' },
  Ten: { stage:'completion', theme:'full expression, consequence and the end of a cycle' },
};

const COURT_THEMES = {
  Page: { role:'discover', theme:'learning, curiosity, messages and first-hand experimentation' },
  Knight: { role:'pursue', theme:'movement, pursuit, commitment and the risks of over-identifying with a direction' },
  Queen: { role:'embody', theme:'internal mastery, sustained capacity, boundaries and lived expression' },
  King: { role:'direct', theme:'responsibility, authority, standards and directing the suit deliberately' },
};

const SUIT_THEMES = {
  Cups: { element:'Water', domain:'emotion and relationship', themes:['feeling','attachment','care','intimacy','receptivity'] },
  Swords: { element:'Air', domain:'thought and communication', themes:['thought','truth','communication','conflict','decision'] },
  Wands: { element:'Fire', domain:'energy and action', themes:['motivation','agency','creativity','ambition','momentum'] },
  Pentacles: { element:'Earth', domain:'practical life', themes:['work','resources','body','security','skill'] },
};

function unique(items=[]){ return [...new Set(items.filter(Boolean))]; }
function sentence(value=''){ const text=String(value||'').trim(); return text ? text.replace(/\s+/g,' ') : ''; }
function first(items=[]){ return items?.[0] || 'the card’s central theme'; }
function courtRank(card){ return ['Page','Knight','Queen','King'].find((rank)=>card.name.startsWith(`${rank} of `)) || null; }

function structureFor(card){
  if(card.arcana==='Major'){
    return {
      arcana:'Major',
      majorNumber:Number.parseInt(card.number,10),
      suit:null,
      element:null,
      rank:null,
      court:null,
      numberStage:null,
      developmentalScale:'archetypal',
    };
  }
  const rank=card.rank;
  const court=COURT_THEMES[rank] || null;
  const number=NUMBER_THEMES[rank] || null;
  return {
    arcana:'Minor',
    majorNumber:null,
    suit:card.suit,
    element:card.element || SUIT_THEMES[card.suit]?.element || null,
    rank,
    court: court ? court.role : null,
    numberStage: number ? number.stage : null,
    developmentalScale:'situational',
  };
}

function semanticThemes(card){
  const themes=[...(card.upright||[]), ...(card.reversed||[])];
  if(card.suit) themes.push(...(SUIT_THEMES[card.suit]?.themes||[]));
  const court=COURT_THEMES[courtRank(card)];
  if(court) themes.push(court.role, ...court.theme.split(/, | and /));
  const number=NUMBER_THEMES[card.rank];
  if(number) themes.push(number.stage, ...number.theme.split(/, | and /));
  if(card.arcana==='Major') themes.push('identity','values','development','turning point');
  return unique(themes.map((item)=>String(item).trim().toLowerCase())).slice(0,18);
}

function practicalGuidance(card){
  const upright=first(card.upright);
  const reversed=first(card.reversed);
  const suit=SUIT_THEMES[card.suit];
  const court=COURT_THEMES[courtRank(card)];
  const number=NUMBER_THEMES[card.rank];

  let uprightTail='Name the most concrete place this pattern is already visible, then make one choice that works with it deliberately.';
  if(suit) uprightTail=`Look for this in ${suit.domain}; choose one observable action, boundary, conversation or routine that expresses ${upright} cleanly.`;
  if(number) uprightTail=`Treat this as the ${number.stage} stage of the situation: identify what is changing at this stage and what would help it develop without forcing the next one.`;
  if(court) uprightTail=`Use the ${court.role} role deliberately: ${court.theme}. Notice where that role is useful and where it becomes too narrow.`;
  if(card.arcana==='Major') uprightTail=`Treat ${upright} as a larger stance or developmental task. Ask what decision, value or change in perspective would make that stance real in ordinary life.`;

  let reversedTail=`Find where ${reversed} is already showing up. Reduce the problem to one boundary, decision or adjustment you can test rather than trying to “fix the card.”`;
  if(suit) reversedTail=`Look for where ${reversed} is distorting ${suit.domain}. Restore proportion with one concrete boundary, conversation, pause or change in routine.`;
  if(court) reversedTail=`The ${court.role} role may be misdirected, blocked or overdone. Change how you are using that role before trying to increase its intensity.`;
  if(card.arcana==='Major') reversedTail=`Do not treat the reversal as failure. Ask where ${reversed} is delaying, internalizing or distorting the larger lesson, then identify the smallest honest correction available.`;

  return { upright:sentence(uprightTail), reversed:sentence(reversedTail) };
}

function reflectionQuestions(card){
  const u=first(card.upright);
  const r=first(card.reversed);
  const suit=SUIT_THEMES[card.suit];
  const court=COURT_THEMES[courtRank(card)];
  const number=NUMBER_THEMES[card.rank];

  const upright=[
    `Where is ${u} already visible in what I am doing, choosing or tolerating?`,
    `What would a healthier expression of ${u} look like in one concrete situation?`,
  ];
  const reversed=[
    `Where might ${r} be making this card harder to use cleanly?`,
    `What would change if I responded to ${r} directly instead of compensating for it indirectly?`,
  ];

  if(suit){
    upright.push(`What is this card showing me about ${suit.domain} that I have not put into words yet?`);
    reversed.push(`What evidence in ${suit.domain} would tell me this pattern is improving?`);
  } else {
    upright.push(`What larger value, identity question or turning point does ${card.name} make harder to ignore?`);
    reversed.push(`What am I postponing, resisting or trying to solve at the wrong level in ${card.name}?`);
  }
  if(number) upright.push(`How does the ${number.stage} stage change what this situation needs from me right now?`);
  if(court) upright.push(`Where am I being asked to ${court.role} rather than merely understand this suit?`);

  return { upright:unique(upright).slice(0,4), reversed:unique(reversed).slice(0,4) };
}

export function enrichCard(card){
  const guidance=practicalGuidance(card);
  const questions=reflectionQuestions(card);
  return {
    ...card,
    explanation:{ upright:sentence(card.meaning), reversed:sentence(card.reversedMeaning) },
    practicalGuidance:guidance,
    questions,
    semanticThemes:semanticThemes(card),
    structure:structureFor(card),
  };
}

export const TAROT_STRUCTURE = { NUMBER_THEMES, COURT_THEMES, SUIT_THEMES };
