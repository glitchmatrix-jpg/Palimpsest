const MIN_RELATION_SCORE = 64;

const SUIT_DOMAINS = {
  Cups: 'emotion, attachment, care and relationship',
  Swords: 'thought, truth, conflict and communication',
  Wands: 'energy, ambition, creativity and action',
  Pentacles: 'work, resources, routine, health and material stability',
};

const SUIT_TRANSITIONS = {
  'Pentacles|Cups': 'the movement crosses from practical responsibility into emotional reality',
  'Cups|Pentacles': 'the movement asks an emotional issue to become concrete and sustainable',
  'Swords|Cups': 'the movement crosses from thought or interpretation into feeling and relationship',
  'Cups|Swords': 'the movement asks feeling to become language, distinction or a clearer question',
  'Wands|Pentacles': 'the movement asks momentum to become structure, routine or something sustainable',
  'Pentacles|Wands': 'the movement asks a stable structure to become active rather than merely maintained',
  'Swords|Wands': 'the movement turns an idea, conflict or decision into action',
  'Wands|Swords': 'the movement asks action to be examined, named or directed more precisely',
};

const AXES = [
  {
    id: 'clarity',
    positive: ['clarity','truth','discernment','breakthrough','awareness','revelation','alertness','clear boundaries','ethical judgment'],
    negative: ['confusion','illusion','uncertainty','secrets','self-deception','miscommunication','mental block','poor timing'],
    positiveLabel: 'clarity', negativeLabel: 'uncertainty',
  },
  {
    id: 'connection',
    positive: ['connection','partnership','belonging','friendship','community','compassion','empathy','mutual attraction','family','love'],
    negative: ['isolation','separation','disconnection','exclusion','withdrawal','gossip','social strain','family strain'],
    positiveLabel: 'connection', negativeLabel: 'disconnection',
  },
  {
    id: 'agency',
    positive: ['willpower','direction','determination','confidence','personal power','reclaiming agency','power','leadership','independence'],
    negative: ['powerlessness','self-doubt','loss of control','lack of direction','insecurity','dependence','holding back'],
    positiveLabel: 'agency', negativeLabel: 'loss of agency',
  },
  {
    id: 'balance',
    positive: ['balance','moderation','integration','fairness','emotional balance','adaptability','fair exchange','patience'],
    negative: ['imbalance','excess','overindulgence','overcommitment','overgiving','volatility','unequal power','poor integration'],
    positiveLabel: 'balance', negativeLabel: 'overextension or imbalance',
  },
  {
    id: 'stability',
    positive: ['stability','security','structure','consistency','duty','methodical progress','resilience','persistence','conservation'],
    negative: ['instability','collapse','upheaval','scattered energy','disorganization','delays','false start'],
    positiveLabel: 'stability', negativeLabel: 'instability',
  },
  {
    id: 'release',
    positive: ['release','walking away','moving on','transition','ending','closure','acceptance','delegation','letting go'],
    negative: ['attachment','restriction','stagnation','resistance','stuck transition','fear of leaving','unfinished business','rigidity'],
    positiveLabel: 'release', negativeLabel: 'holding on',
  },
  {
    id: 'rest',
    positive: ['rest','recovery','healing','pause','stillness','contemplation'],
    negative: ['burnout','overload','burden','fatigue','restlessness','exhaustion'],
    positiveLabel: 'recovery', negativeLabel: 'depletion',
  },
  {
    id: 'openness',
    positive: ['curiosity','new ideas','exploration','new perspective','learning','study','question','spontaneity','new direction'],
    negative: ['rigidity','conformity','harsh judgment','fixed','domination','overdefensiveness','paranoia'],
    positiveLabel: 'curiosity and openness', negativeLabel: 'rigidity',
  },
  {
    id: 'conflict',
    positive: ['reconciliation','making amends','resolution','fairness','compassion'],
    negative: ['conflict','tension','competition','aggression','heartbreak','resentment','bitterness','domination'],
    positiveLabel: 'repair', negativeLabel: 'conflict',
  },
  {
    id: 'abundance',
    positive: ['abundance','prosperity','contentment','satisfaction','success','joy','emotional fulfillment','earned comfort'],
    negative: ['scarcity','hardship','loss','grief','dissatisfaction','fear of loss','financial insecurity'],
    positiveLabel: 'enoughness', negativeLabel: 'scarcity or loss',
  },
];

const CORRECTION_RULES = [
  { problem: ['overgiving','emotional absorption','overload','burden','burnout','fatigue','exhaustion'], remedy: ['curiosity','question','clarity','boundaries','rest','recovery','delegation','discernment'], label: 'overextension → reassessment' },
  { problem: ['confusion','illusion','uncertainty','self-deception','miscommunication'], remedy: ['clarity','truth','discernment','question','alertness','breakthrough'], label: 'uncertainty → clearer inquiry' },
  { problem: ['conflict','aggression','resentment','bitterness','tension'], remedy: ['compassion','reconciliation','fairness','balance','moderation','clear boundaries'], label: 'conflict → regulation' },
  { problem: ['rigidity','control','domination','conformity','overdefensiveness'], remedy: ['new perspective','curiosity','adaptability','release','spontaneity'], label: 'rigidity → flexibility' },
  { problem: ['scarcity','hardship','fear of loss','insecurity'], remedy: ['support','recovery','prosperity','fair exchange','self-sufficiency','stability'], label: 'scarcity → support or stability' },
  { problem: ['stagnation','resistance','unfinished business','stuck transition'], remedy: ['movement','transition','release','ending','new direction','change'], label: 'stagnation → movement' },
];

const ESCALATION_WORDS = new Map([
  ['friction',1],['tension',1],['worry',1],['restlessness',1],['disappointment',1],
  ['conflict',2],['anxiety',2],['restriction',2],['burden',2],['heartbreak',2],['aggression',2],['instability',2],
  ['overload',3],['collapse',3],['upheaval',3],['finality',3],['powerlessness',3],['burnout',3],['exhaustion',3],
]);

const RANK_VALUE = { Ace:1, Two:2, Three:3, Four:4, Five:5, Six:6, Seven:7, Eight:8, Nine:9, Ten:10, Page:11, Knight:12, Queen:13, King:14 };
const COURT_ROLE = {
  Page: 'testing, learning and asking questions',
  Knight: 'pursuing and committing energy',
  Queen: 'embodying and sustaining a quality',
  King: 'directing and taking responsibility for a quality',
};

const CURATED_PAIRS = [
  {
    a:'Knight of Pentacles', b:'Queen of Cups', aOrientation:'upright', bOrientation:'reversed', from:'Mind', to:'Body',
    score:112, type:'mismatch', axis:'controlled responsibility → emotional overextension',
    text: 'Your thinking is trying to stay controlled and dependable through the Knight of Pentacles, while the Queen of Cups reversed describes a lived reality of overgiving, insecurity or emotional absorption. That creates a real mismatch: mentally you may be telling yourself to keep going, stay responsible and maintain the routine even while your actual emotional capacity is already running low.'
  },
  {
    a:'Queen of Cups', b:'Page of Swords', aOrientation:'reversed', bOrientation:'upright', from:'Body', to:'Spirit',
    score:112, type:'correction', axis:'overgiving → inquiry',
    text: 'The Queen of Cups reversed shows emotional overextension in what you are actually living. The Page of Swords changes the response from more giving to more inquiry: ask what you are truly responsible for, what you are assuming, and what information or boundary is missing. Curiosity becomes corrective because it interrupts automatic accommodation.'
  },
  {
    names:['The Moon','The Sun'], score:108, type:'contrast', axis:'uncertainty → clarity',
    textForward:'The Moon leaves important information obscured; the Sun brings enough visibility to deal with it directly. The relationship is not “bad card to good card.” It is a change in what can be known: ambiguity, projection or fear becomes easier to test against reality.',
    textReverse:'The Sun begins with visibility and confidence, but the Moon reintroduces ambiguity. Something that looked settled may need to be questioned again because certainty is giving way to incomplete information, projection or intuition that has not yet been verified.'
  },
  {
    names:['The Tower','The Star'], score:108, type:'recovery', axis:'collapse → reorientation',
    textForward:'The Tower removes a structure that can no longer hold; the Star asks what remains credible enough to build hope around afterward. This is not instant recovery. The pair describes the movement from disruption into a quieter process of reorientation.',
    textReverse:'The Star establishes hope or a renewed direction, while the Tower tests whether that hope can survive contact with a structure that still needs to change. Inspiration is not enough if the underlying arrangement remains unstable.'
  },
  {
    names:['Death','Temperance'], score:106, type:'integration', axis:'ending → re-composition',
    textForward:'Death closes the old arrangement; Temperance works with what remains. Together they describe the difference between ending something and actually building a new balance after the ending.',
    textReverse:'Temperance tries to preserve workable balance, but Death says one part of the arrangement has reached its real ending. Integration may now require letting something finish rather than endlessly adjusting around it.'
  },
  {
    names:['The Devil','The Tower'], score:106, type:'exposure', axis:'attachment → rupture',
    textForward:'The Devil identifies the attachment, fear or appetite that has leverage; the Tower removes the structure that allowed that leverage to keep operating. What was tolerated or rationalized becomes much harder to maintain.',
    textReverse:'The Tower exposes instability first; the Devil then asks what attachment could pull you back toward the same pattern. The danger is rebuilding the old structure around the same dependency.'
  },
  {
    names:['The Hermit','Wheel of Fortune'], score:102, type:'adaptation', axis:'reflection → changing conditions',
    textForward:'The Hermit clarifies your own direction; the Wheel of Fortune reminds you that circumstances still move. The relationship asks whether inner clarity is flexible enough to survive a change you did not control.',
    textReverse:'The Wheel changes the conditions first; the Hermit then asks you to step out of the noise long enough to decide what the change means for your own direction.'
  },
  {
    names:['The Lovers','The Chariot'], score:104, type:'commitment', axis:'choice → direction',
    textForward:'The Lovers makes the choice meaningful by tying it to values; the Chariot makes it operational by coordinating behaviour around that choice. Alignment becomes direction.',
    textReverse:'The Chariot shows movement and determination, while the Lovers asks whether that movement is actually aligned with your values or merely efficient. Direction without a real choice can become momentum for its own sake.'
  },
  {
    names:['The Hanged Man','Death'], score:104, type:'release', axis:'reframe → ending',
    textForward:'The Hanged Man changes how the situation is seen; Death asks what must actually end once the old perspective no longer works. Insight becomes consequence.',
    textReverse:'Death closes the old form first; the Hanged Man then asks for enough suspension to understand the ending differently instead of rushing to replace what was lost.'
  },
  {
    names:['Ten of Wands','Four of Swords'], score:101, type:'correction', axis:'overload → recovery',
    textForward:'The Ten of Wands shows responsibility accumulating into overload; the Four of Swords answers by making recovery part of the work rather than a reward after everything is finished. Continuing at the same pace would repeat the problem.',
    textReverse:'The Four of Swords establishes a need for recovery, while the Ten of Wands shows what happens when responsibilities are allowed to pile back on before that recovery has restored capacity.'
  },
  {
    names:['Five of Cups','The Star'], score:100, type:'recovery', axis:'grief → renewal',
    textForward:'The Five of Cups gives loss its proper weight; the Star introduces a future orientation without asking you to deny the grief. Hope works here because it comes after acknowledgment, not instead of it.',
    textReverse:'The Star begins with renewal, but the Five of Cups brings attention back to grief that may not be fully processed. Hope may need to make room for disappointment rather than outrun it.'
  },
  {
    names:['Nine of Swords','The Sun'], score:100, type:'exposure', axis:'private fear → visibility',
    textForward:'The Nine of Swords amplifies fear in private; the Sun brings the issue into visibility where it can be named, checked and shared. Exposure weakens the monopoly of the worst-case story.',
    textReverse:'The Sun begins with apparent clarity, but the Nine of Swords shows how private fear can keep operating even when the external facts are visible. Knowing better and feeling safer are not always the same process.'
  },
  {
    names:['Eight of Cups','Death'], score:100, type:'completion', axis:'leaving → ending',
    textForward:'The Eight of Cups recognizes that emotional investment is no longer enough reason to stay; Death makes the departure more final by closing the form that has run its course. Leaving becomes an actual transition.',
    textReverse:'Death marks an ending first, while the Eight of Cups shows the emotional work of walking away from what the ending has already made unavailable.'
  },
];

function normalize(value='') {
  return String(value).toLowerCase().replace(/[“”‘’]/g,"'").replace(/[^a-z0-9' ]+/g,' ').replace(/\s+/g,' ').trim();
}

function phraseList(entry) {
  return entry.orientation === 'reversed' ? (entry.card.reversed || []) : (entry.card.upright || []);
}

function primary(entry) {
  return phraseList(entry)[0] || 'development';
}

function searchable(entry) {
  const meaning = entry.orientation === 'reversed' ? entry.card.reversedMeaning : entry.card.meaning;
  return normalize([entry.card.name, ...(phraseList(entry) || []), meaning || '', entry.card.suit || '', entry.card.rank || ''].join(' '));
}

function containsAny(text, phrases=[]) {
  return phrases.some((phrase) => text.includes(normalize(phrase)));
}

function axisProfile(entry) {
  const text = searchable(entry);
  return AXES.map((axis) => ({
    axis,
    positive: axis.positive.filter((term) => text.includes(normalize(term))).length,
    negative: axis.negative.filter((term) => text.includes(normalize(term))).length,
  })).filter((row) => row.positive || row.negative);
}

function strongestAxis(entry) {
  const rows = axisProfile(entry).sort((a,b)=>Math.max(b.positive,b.negative)-Math.max(a.positive,a.negative));
  if (!rows.length) return null;
  const row = rows[0];
  const polarity = row.positive >= row.negative ? 'positive' : 'negative';
  return { id:row.axis.id, polarity, label:polarity==='positive'?row.axis.positiveLabel:row.axis.negativeLabel, strength:Math.max(row.positive,row.negative) };
}

function sharedAxis(a,b) {
  const A = axisProfile(a);
  const B = axisProfile(b);
  const matches=[];
  for (const left of A) {
    const right=B.find((row)=>row.axis.id===left.axis.id);
    if (!right) continue;
    const leftPol=left.positive>=left.negative?'positive':'negative';
    const rightPol=right.positive>=right.negative?'positive':'negative';
    matches.push({
      axis:left.axis,
      leftPol,rightPol,
      strength:Math.max(left.positive,left.negative)+Math.max(right.positive,right.negative),
    });
  }
  return matches.sort((x,y)=>y.strength-x.strength)[0] || null;
}

function rankName(card) {
  if (card.rank) return card.rank;
  return Object.keys(RANK_VALUE).find((rank)=>card.name.startsWith(`${rank} of `)) || null;
}

function numericValue(card) {
  const rank=rankName(card);
  return RANK_VALUE[rank] || null;
}

function isCourt(card) {
  return ['Page','Knight','Queen','King'].includes(rankName(card));
}

function intensity(entry) {
  const text=searchable(entry);
  let best=0;
  for (const [term,value] of ESCALATION_WORDS) if (text.includes(term)) best=Math.max(best,value);
  return best;
}

function positionBonus(type, from, to) {
  const key=`${from}|${to}`;
  if (key==='Mind|Body' && ['contradiction','mismatch'].includes(type)) return 10;
  if (key==='Challenge|Advice' && ['correction','release','recovery','repair'].includes(type)) return 10;
  if (key==='Situation|Challenge' && ['escalation','contradiction','cause → effect'].includes(type)) return 7;
  if (key==='Past|Present' && ['cause → effect','escalation','reinforcement'].includes(type)) return 6;
  if (key==='Present|Future' && ['progression','escalation','correction','reinforcement'].includes(type)) return 5;
  if (key==='Body|Spirit' && ['correction','contradiction','reframe'].includes(type)) return 6;
  if (key==='You|Them' && ['contrast','contradiction'].includes(type)) return 5;
  if (key==='Them|Relationship' && ['cause → effect','reinforcement','escalation'].includes(type)) return 5;
  return 0;
}

function positionText(a,b,from,to,kind,conceptA,conceptB) {
  const aName=a.card.name;
  const bName=b.card.name;
  const key=`${from}|${to}`;
  if (key==='Mind|Body') {
    if (['contradiction','mismatch'].includes(kind)) return `${aName} describes a mental frame built around ${conceptA}, while ${bName} shows ${conceptB} in lived reality. The important relationship is the mismatch between what the mind is trying to maintain and what your actual capacity or behaviour is showing you.`;
    return `${aName} makes ${conceptA} part of the way you are interpreting the situation, while ${bName} shows how that frame lands in day-to-day reality as ${conceptB}.`;
  }
  if (key==='Body|Spirit') return `${aName} shows ${conceptA} in lived reality; ${bName} moves the reading toward a deeper question about ${conceptB}. What you are experiencing practically is therefore pushing you to reconsider the principle, value or identity underneath it.`;
  if (key==='Situation|Challenge') return `${aName} establishes ${conceptA} as part of the situation. ${bName} turns ${conceptB} into the point of friction, showing specifically how the situation becomes harder to carry, judge or respond to cleanly.`;
  if (key==='Challenge|Advice') return `${aName} identifies the difficulty as ${conceptA}; ${bName} answers it through ${conceptB}. The second card matters because it changes the response, not because it merely follows the first card in the spread.`;
  if (key==='Past|Present') return `${aName} places ${conceptA} in the background of the story; ${bName} shows ${conceptB} as the form that pattern is taking now. Read the pair as inheritance only where you can actually see the earlier pattern feeding the present one.`;
  if (key==='Present|Future') return `${aName} makes ${conceptA} active now, and ${bName} shows ${conceptB} as the direction that becomes more plausible if the present pattern continues. That is a trajectory, not a prediction.`;
  if (key==='You|Them') return `${aName} describes your side through ${conceptA}, while ${bName} describes the other person's observable stance through ${conceptB}. The relationship is in how those two stances meet; it does not require guessing what the other person privately thinks.`;
  if (key==='Them|Relationship') return `${aName} shows ${conceptA} in the other person's observable stance; ${bName} shows ${conceptB} in the pattern produced between you. The second card matters only to the extent that repeated interaction actually turns that stance into a relationship pattern.`;
  return `${aName} brings ${conceptA}; ${bName} brings ${conceptB}.`;
}

function curatedCandidate(a,b,from,to) {
  for (const rule of CURATED_PAIRS) {
    if (rule.a) {
      if (a.card.name!==rule.a || b.card.name!==rule.b) continue;
      if (rule.aOrientation && a.orientation!==rule.aOrientation) continue;
      if (rule.bOrientation && b.orientation!==rule.bOrientation) continue;
      if (rule.from && from!==rule.from) continue;
      if (rule.to && to!==rule.to) continue;
      return { score:rule.score, type:rule.type, axis:rule.axis, text:rule.text, evidence:['curated','orientation-specific','position-specific'] };
    }
    const [first,second]=rule.names;
    if (a.card.name===first && b.card.name===second) return { score:rule.score, type:rule.type, axis:rule.axis, text:rule.textForward, evidence:['curated','symbolic'] };
    if (a.card.name===second && b.card.name===first) return { score:rule.score-2, type:rule.type, axis:`${primary(a)} → ${primary(b)}`, text:rule.textReverse, evidence:['curated','symbolic','direction-aware'] };
  }
  return null;
}

function correctionCandidate(a,b,from,to) {
  const A=searchable(a), B=searchable(b);
  for (const rule of CORRECTION_RULES) {
    if (!containsAny(A,rule.problem) || !containsAny(B,rule.remedy)) continue;
    const aConcept=primary(a), bConcept=primary(b);
    return {
      score:80+positionBonus('correction',from,to),
      type:'correction', axis:`${aConcept} → ${bConcept}`,
      text:positionText(a,b,from,to,'correction',aConcept,bConcept) + ` In semantic terms, this is a correction from ${rule.label}.`,
      evidence:['semantic correction',`rule:${rule.label}`],
    };
  }
  return null;
}

function contradictionCandidate(a,b,from,to) {
  const shared=sharedAxis(a,b);
  if (!shared || shared.leftPol===shared.rightPol || shared.strength<2) return null;
  const left=shared.leftPol==='positive'?shared.axis.positiveLabel:shared.axis.negativeLabel;
  const right=shared.rightPol==='positive'?shared.axis.positiveLabel:shared.axis.negativeLabel;
  return {
    score:76+Math.min(6,shared.strength*2)+positionBonus('contradiction',from,to),
    type:from==='Mind'&&to==='Body'?'mismatch':'contradiction',
    axis:`${left} ↔ ${right}`,
    text:positionText(a,b,from,to,'contradiction',left,right),
    evidence:['shared semantic axis',`axis:${shared.axis.id}`,'opposing polarity'],
  };
}

function reinforcementCandidate(a,b,from,to) {
  const shared=sharedAxis(a,b);
  if (!shared || shared.leftPol!==shared.rightPol || shared.strength<2) return null;
  const concept=shared.leftPol==='positive'?shared.axis.positiveLabel:shared.axis.negativeLabel;
  const sameSuit=a.card.suit && a.card.suit===b.card.suit;
  return {
    score:66+Math.min(8,shared.strength*2)+(sameSuit?4:0)+positionBonus('reinforcement',from,to),
    type:'reinforcement', axis:`${primary(a)} → ${primary(b)}`,
    text:positionText(a,b,from,to,'reinforcement',primary(a),primary(b)) + ` Both cards independently reinforce ${concept}, so that theme deserves more weight than a superficial suit or orientation change.`,
    evidence:['shared semantic axis',`axis:${shared.axis.id}`,'same polarity',...(sameSuit?['same suit']:[])],
  };
}

function escalationCandidate(a,b,from,to) {
  const left=intensity(a), right=intensity(b);
  if (!left || right<=left) return null;
  const shared=sharedAxis(a,b);
  if (!shared) return null;
  return {
    score:70+(right-left)*3+positionBonus('escalation',from,to),
    type:'escalation', axis:`${primary(a)} → ${primary(b)}`,
    text:positionText(a,b,from,to,'escalation',primary(a),primary(b)) + ` The second card carries a higher-intensity version of the same pressure, so the movement is escalation rather than a simple change of subject.`,
    evidence:['intensity increase','shared semantic axis'],
  };
}

function courtCandidate(a,b,from,to) {
  if (!isCourt(a.card) || !isCourt(b.card)) return null;
  const aRank=rankName(a.card), bRank=rankName(b.card);
  const sameSuit=a.card.suit && a.card.suit===b.card.suit;
  const shared=sharedAxis(a,b);
  if (!sameSuit && !shared) return null;
  const av=RANK_VALUE[aRank], bv=RANK_VALUE[bRank];
  const type=bv>av?'court development':bv<av?'court reset':'court mirror';
  const axis=`${aRank}: ${primary(a)} → ${bRank}: ${primary(b)}`;
  let text=positionText(a,b,from,to,type,primary(a),primary(b));
  text+=` The court roles sharpen the relationship: ${aRank} emphasizes ${COURT_ROLE[aRank]}, while ${bRank} emphasizes ${COURT_ROLE[bRank]}.`;
  return { score:72+(sameSuit?7:0)+(Math.abs(bv-av)===1?4:0), type, axis, text, evidence:['court dynamics',...(sameSuit?['same suit']:['shared semantic axis'])] };
}

function numberCandidate(a,b,from,to) {
  if (isCourt(a.card)||isCourt(b.card)) return null;
  const av=numericValue(a.card), bv=numericValue(b.card);
  if (!av||!bv) return null;
  const sameSuit=a.card.suit && a.card.suit===b.card.suit;
  if (sameSuit && Math.abs(bv-av)===1) {
    const type=bv>av?'number progression':'number regression';
    return { score:78, type, axis:`${rankName(a.card)} → ${rankName(b.card)}`, text:positionText(a,b,from,to,type,primary(a),primary(b)) + ` Because these are adjacent numbers in ${a.card.suit}, the sequence also has a real developmental step rather than a coincidental numerical echo.`, evidence:['adjacent number','same suit'] };
  }
  if (av===bv && a.card.suit && b.card.suit && a.card.suit!==b.card.suit) {
    return { score:68, type:'number echo', axis:`${rankName(a.card)} across ${a.card.suit} → ${b.card.suit}`, text:positionText(a,b,from,to,'number echo',primary(a),primary(b)) + ` The repeated ${rankName(a.card)} suggests the same developmental stage is being worked through in two different life domains.`, evidence:['same number','different suits'] };
  }
  return null;
}

function majorMinorCandidate(a,b,from,to) {
  if (a.card.arcana===b.card.arcana) return null;
  const shared=sharedAxis(a,b);
  if (!shared) return null;
  const major=a.card.arcana==='Major'?a:b;
  const minor=major===a?b:a;
  const concept=shared.leftPol==='positive'?shared.axis.positiveLabel:shared.axis.negativeLabel;
  const text=positionText(a,b,from,to,'major/minor relationship',primary(a),primary(b)) + ` ${major.card.name} widens ${concept} into a larger principle or turning point, while ${minor.card.name} shows how that same issue can appear in ordinary behaviour, work, thought, emotion or relationship.`;
  return { score:71+Math.min(5,shared.strength), type:'Major ↔ Minor', axis:`${major.card.name}: principle ↔ ${minor.card.name}: lived expression`, text, evidence:['major/minor','shared semantic axis',`axis:${shared.axis.id}`] };
}

function causeEffectCandidate(a,b,from,to) {
  const allowed=['Past|Present','Situation|Challenge','Them|Relationship'];
  if (!allowed.includes(`${from}|${to}`)) return null;
  const shared=sharedAxis(a,b);
  const correction=CORRECTION_RULES.some((rule)=>containsAny(searchable(a),rule.problem)&&containsAny(searchable(b),rule.remedy));
  if (!shared && !correction) return null;
  return { score:67+positionBonus('cause → effect',from,to), type:'cause → effect', axis:`${primary(a)} → ${primary(b)}`, text:positionText(a,b,from,to,'cause → effect',primary(a),primary(b)), evidence:['position topology',...(shared?['shared semantic axis']:['semantic correction'])] };
}

function addModifiers(candidate,a,b) {
  if (!candidate) return null;
  const parts=[];
  if (a.card.suit && b.card.suit && a.card.suit!==b.card.suit) {
    const transition=SUIT_TRANSITIONS[`${a.card.suit}|${b.card.suit}`];
    if (transition) parts.push(`The suit change supports this reading because ${transition}.`);
  }
  if (a.orientation!==b.orientation) {
    const reversed=a.orientation==='reversed'?a:b;
    parts.push(`${reversed.card.name} is reversed, so ${primary(reversed)} is the modified or less cleanly expressed part of this relationship; the reversal matters because of that specific theme, not merely because the cards point in different directions.`);
  }
  return { ...candidate, text:[candidate.text,...parts].join(' '), evidence:[...candidate.evidence,...(parts.length?['supporting modifier']:[])] };
}

export function buildPairRelation(a,b,fromPosition='',toPosition='') {
  const candidates=[
    curatedCandidate(a,b,fromPosition,toPosition),
    correctionCandidate(a,b,fromPosition,toPosition),
    contradictionCandidate(a,b,fromPosition,toPosition),
    escalationCandidate(a,b,fromPosition,toPosition),
    courtCandidate(a,b,fromPosition,toPosition),
    numberCandidate(a,b,fromPosition,toPosition),
    majorMinorCandidate(a,b,fromPosition,toPosition),
    reinforcementCandidate(a,b,fromPosition,toPosition),
    causeEffectCandidate(a,b,fromPosition,toPosition),
  ].filter(Boolean).sort((x,y)=>y.score-x.score);

  const winner=candidates[0];
  if (!winner || winner.score<MIN_RELATION_SCORE) {
    return {
      interesting:false,
      strength:'none',
      score:winner?.score || 0,
      type:'no strong relationship',
      axis:'',
      text:'',
      evidence:[],
      considered:candidates.slice(0,3).map((item)=>({type:item.type,score:item.score})),
    };
  }

  const enriched=addModifiers(winner,a,b);
  return {
    ...enriched,
    interesting:true,
    strength:enriched.score>=100?'exceptional':enriched.score>=82?'strong':'meaningful',
    considered:candidates.slice(0,3).map((item)=>({type:item.type,score:item.score})),
  };
}

export { MIN_RELATION_SCORE };
