const COURTS = ['Page','Knight','Queen','King'];

const SUIT_DOMAIN = {
  Cups: 'emotion, attachment, care and relationship',
  Swords: 'thought, truth, conflict and communication',
  Wands: 'energy, ambition, creativity and action',
  Pentacles: 'work, resources, routine, health and material stability',
};

function rankName(card) {
  if (card.rank) return card.rank;
  return ['Ace','Two','Three','Four','Five','Six','Seven','Eight','Nine','Ten',...COURTS]
    .find((rank)=>card.name.startsWith(`${rank} of `)) || null;
}

function isCourt(card) {
  return COURTS.includes(rankName(card));
}

function majorLayer(entries) {
  const majors = entries.filter((entry)=>entry.card.arcana==='Major');
  if (majors.length < 2) return null;
  if (majors.length === 3) {
    return {
      id:'major-concentration',
      title:'3 Major Arcana',
      lead:'The whole spread is operating at the level of larger choices, values or turning points.',
      text:`${majors.map((entry)=>entry.card.name).join(', ')} fill every position. That makes the reading less useful as a prediction about one isolated incident and more useful as a map of the larger stance or transition organizing the situation.`,
      evidence:['three majors'],
    };
  }
  const minor = entries.find((entry)=>entry.card.arcana!=='Major');
  return {
    id:'major-major-minor-anchor',
    title:'2 Major Arcana + one concrete anchor',
    lead:'Two cards widen the frame; the Minor Arcana shows where that bigger issue actually lands.',
    text:`${majors[0].card.name} and ${majors[1].card.name} give the spread broader developmental weight. ${minor.card.name} earns special attention because it is the practical expression of that larger issue rather than just a third theme to memorize.`,
    evidence:['two majors','one minor anchor'],
  };
}

function suitLayer(entries) {
  const suited = entries.filter((entry)=>entry.card.suit);
  if (suited.length !== 3) return null;
  if (!suited.every((entry)=>entry.card.suit===suited[0].card.suit)) return null;
  const suit = suited[0].card.suit;
  return {
    id:`single-suit-${suit.toLowerCase()}`,
    title:`All ${suit}`,
    lead:`Every card is working inside ${SUIT_DOMAIN[suit]}.`,
    text:`This is not just a decorative suit repeat. It means the spread keeps translating every position through the same life domain, so disagreements between the cards are happening inside one arena rather than between unrelated parts of life.`,
    evidence:['three cards same suit'],
  };
}

function rankEchoLayer(entries) {
  const minors = entries.filter((entry)=>entry.card.arcana!=='Major' && !isCourt(entry.card));
  if (minors.length < 2) return null;
  const groups = new Map();
  for (const entry of minors) {
    const rank = rankName(entry.card);
    if (!rank) continue;
    if (!groups.has(rank)) groups.set(rank,[]);
    groups.get(rank).push(entry);
  }
  const hit = [...groups.entries()].find(([,items])=>items.length>=2 && new Set(items.map((item)=>item.card.suit)).size>=2);
  if (!hit) return null;
  const [rank,items] = hit;
  return {
    id:`rank-echo-${rank.toLowerCase()}`,
    title:`${rank} repeated across suits`,
    lead:'The same developmental stage is showing up in more than one life domain.',
    text:`${items.map((item)=>item.card.name).join(' and ')} repeat the ${rank} structure across different suits. That makes the repeated stage more informative than either suit alone: the same kind of task is being worked through in different forms.`,
    evidence:['same rank','different suits'],
  };
}

function courtLayer(entries) {
  const courts = entries.filter((entry)=>isCourt(entry.card));
  if (courts.length < 2) return null;
  const ranks = courts.map((entry)=>rankName(entry.card));
  const uniqueRanks = new Set(ranks);
  const sameSuit = courts.length>=2 && new Set(courts.map((entry)=>entry.card.suit)).size===1;
  if (courts.length===3) {
    return {
      id:'court-concentration',
      title:'Three court cards',
      lead:'The reading is unusually focused on roles, styles of action and how qualities are carried by people.',
      text:`With ${courts.map((entry)=>entry.card.name).join(', ')} filling the spread, pay attention to how each position behaves rather than reducing the courts to three literal people. The useful pattern is the change in role: learning, pursuing, embodying or directing.`,
      evidence:['three courts'],
    };
  }
  if (sameSuit && uniqueRanks.size>1) {
    return {
      id:`court-development-${courts[0].card.suit.toLowerCase()}`,
      title:`Court development in ${courts[0].card.suit}`,
      lead:'The same suit is being handled at two different levels of maturity or responsibility.',
      text:`${courts.map((entry)=>entry.card.name).join(' and ')} keep the domain constant while changing the court role. That makes the difference between how the quality is learned, pursued, embodied or directed more useful than simply noting “two court cards.”`,
      evidence:['two courts','same suit','different ranks'],
    };
  }
  return null;
}

export function buildEvidenceLayers(entries) {
  const candidates=[majorLayer(entries),suitLayer(entries),rankEchoLayer(entries),courtLayer(entries)].filter(Boolean);
  const seen=new Set();
  return candidates.filter((layer)=>{
    if(seen.has(layer.id)) return false;
    seen.add(layer.id);
    return true;
  });
}
