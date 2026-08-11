import { buildPairRelation } from './combinationIntelligence.js';
import { buildSpreadSystem } from './spreadSystems.js';

const SUIT_DOMAINS = {
  Cups: 'feelings, relationships, attachment, pleasure and emotional needs',
  Swords: 'thought, communication, conflict, fear, decisions and truth',
  Wands: 'motivation, ambition, creativity, initiative and momentum',
  Pentacles: 'work, money, routine, health, security, skill and practical life',
};

const SUIT_RELATION_LENSES = {
  Cups: 'emotional availability, care, reciprocity and boundaries',
  Swords: 'communication, interpretation, conflict and decision-making',
  Wands: 'pace, initiative, pursuit and follow-through',
  Pentacles: 'consistency, time, resources and practical security',
};

const MAJOR_CUES = {
  'The Fool': {
    upright: 'a willingness to begin before certainty',
    reversed: 'a beginning being rushed, mistimed or held back',
  },
  'The Magician': {
    upright: 'focused agency and deliberate use of available tools',
    reversed: 'ability becoming scattered, performative or manipulative',
  },
  'The High Priestess': {
    upright: 'quiet observation and trust in inner signals',
    reversed: 'inner signals being ignored or confused with fear',
  },
  'The Empress': {
    upright: 'growth through care, embodiment and nourishment',
    reversed: 'care turning into depletion, dependence or creative stagnation',
  },
  'The Emperor': {
    upright: 'structure, boundaries and responsible direction',
    reversed: 'structure hardening into control or rigidity',
  },
  'The Hierophant': {
    upright: 'learning from shared systems, teachers or tradition',
    reversed: 'rules, labels or inherited expectations being questioned',
  },
  'The Lovers': {
    upright: 'alignment between desire, values and choice',
    reversed: 'a gap between what is wanted, valued and actually chosen',
  },
  'The Chariot': {
    upright: 'competing forces being directed toward one clear aim',
    reversed: 'direction fragmenting or control turning into force',
  },
  Strength: {
    upright: 'self-regulation joined with courage and patience',
    reversed: 'confidence weakening or pressure being handled through force',
  },
  'The Hermit': {
    upright: 'distance creating useful reflection and clarity',
    reversed: 'reflection turning into withdrawal or avoidance',
  },
  'Wheel of Fortune': {
    upright: 'changing conditions requiring adaptation',
    reversed: 'a cycle stalling or repeating because change is resisted',
  },
  Justice: {
    upright: 'facts, consequences and responsibility coming into balance',
    reversed: 'accountability or judgment being distorted',
  },
  'The Hanged Man': {
    upright: 'progress requiring a changed perspective rather than more force',
    reversed: 'a useful pause turning into stalling or purposeless sacrifice',
  },
  Death: {
    upright: 'an ending making real transformation possible',
    reversed: 'necessary change being delayed by attachment or fear',
  },
  Temperance: {
    upright: 'different needs being integrated into workable proportion',
    reversed: 'extremes remaining separate or out of proportion',
  },
  'The Devil': {
    upright: 'an attachment or appetite having more leverage than it deserves',
    reversed: 'a limiting bond becoming visible enough to loosen',
  },
  'The Tower': {
    upright: 'false stability giving way to unavoidable reality',
    reversed: 'necessary change being postponed or contained privately',
  },
  'The Star': {
    upright: 'hope becoming a credible direction after disruption',
    reversed: 'renewal being difficult to trust despite signs of recovery',
  },
  'The Moon': {
    upright: 'moving through incomplete information without manufacturing certainty',
    reversed: 'confusion beginning to clear or a fear becoming easier to name',
  },
  'The Sun': {
    upright: 'clarity, vitality and direct participation returning',
    reversed: 'positive potential being muted by timing, confidence or overexposure',
  },
  Judgement: {
    upright: 'a reckoning with the past demanding a different response now',
    reversed: 'a necessary reckoning being delayed by doubt or avoidance',
  },
  'The World': {
    upright: 'a cycle integrating enough to truly complete',
    reversed: 'closure remaining incomplete because something still needs acknowledgment',
  },
};

export const SUPPORTED_POSITIONS = [
  'Past','Present','Future','Situation','Challenge','Advice',
  'Mind','Body','Spirit','You','Them','Relationship',
];

function clean(text='') { return String(text || '').trim(); }

export function primaryKeyword(entry) {
  const source = entry.orientation === 'reversed' ? entry.card.reversed : entry.card.upright;
  return source?.[0] || 'development';
}

function keywords(entry) {
  const source = entry.orientation === 'reversed' ? entry.card.reversed : entry.card.upright;
  return source || [];
}

function meaningFor(entry) {
  const orientation = entry.orientation === 'reversed' ? 'reversed' : 'upright';
  return clean(
    entry.card.explanation?.[orientation]
    || (orientation === 'reversed' ? entry.card.reversedMeaning : entry.card.meaning)
    || entry.card.meaning
  );
}

function courtRank(card) {
  return ['Page','Knight','Queen','King'].find((rank) => card.name.startsWith(`${rank} of `)) || null;
}

function courtSentence(entry, position) {
  const rank = courtRank(entry.card);
  if (!rank) return '';
  const role = {
    Page: 'learning, testing and asking questions',
    Knight: 'pursuing something actively and committing energy to it',
    Queen: 'embodying and sustaining the quality rather than merely trying it',
    King: 'directing, managing and taking responsibility for the quality',
  }[rank];

  if (position === 'Mind') return `As a ${rank}, this mental style is active rather than passive: it works through ${role}.`;
  if (position === 'Body') return `As a ${rank}, watch how ${role} is affecting your actual capacity and behaviour.`;
  if (position === 'Spirit') return `As a ${rank}, the deeper lesson is about ${role} in a way you can genuinely own.`;
  if (position === 'Advice') return `The ${rank} makes the advice practical: ${role} matters more here than waiting for perfect certainty.`;
  return '';
}

function majorSentence(entry, position) {
  if (entry.card.arcana !== 'Major') return '';
  if (position === 'Past') return `Because this is Major Arcana, that background may have changed your stance or values, not just the circumstances around you.`;
  if (position === 'Present') return `Because this is Major Arcana, the present issue may be asking for a change of stance rather than a quick tactical fix.`;
  if (position === 'Future') return `Because this is Major Arcana, the direction ahead looks more like a turning point in perspective or responsibility than a small practical development.`;
  if (position === 'Mind') return `This may be more than a passing thought; a larger belief or worldview could be shaping how you interpret what is happening.`;
  if (position === 'Body') return `The effect may be broad enough to show up across several parts of daily life rather than one isolated habit.`;
  if (position === 'Spirit') return `The card has unusual weight here because identity, values and meaning are already the job of this position.`;
  return '';
}

function suitAngle(entry, position) {
  const suit = entry.card.suit;
  if (!suit) return '';
  const map = {
    Mind: {
      Cups: 'Your thinking may be colored by emotional expectations, attachment, hope, hurt or the need for connection.',
      Swords: 'Pay attention to the story you are telling yourself, the facts you emphasize, and the conclusions you keep rehearsing.',
      Wands: 'Your attention may be pulled toward momentum, possibility, urgency or what you want to make happen next.',
      Pentacles: 'You may be prioritizing what feels practical, stable, efficient or sustainable, sometimes at the expense of reconsidering the plan itself.',
    },
    Body: {
      Cups: 'Look at emotional bandwidth, boundaries, rest, closeness and how much of other people’s emotional weight you are carrying.',
      Swords: 'This can show up through tension, stress, difficult conversations, avoidance, overthinking or the physical cost of staying mentally activated.',
      Wands: 'This is about energy and output: pace, workload, motivation, movement and whether your current level of effort is sustainable.',
      Pentacles: 'This is especially literal here: routines, money, health, work, sleep, resources and the practical structure of everyday life all matter.',
    },
    Spirit: {
      Cups: 'The deeper question is what you believe healthy care, intimacy and emotional honesty should look like.',
      Swords: 'The deeper question is what truth, intellectual honesty or clear communication you are willing to live by.',
      Wands: 'The deeper question is what deserves your energy and what kind of ambition or creative direction still feels alive to you.',
      Pentacles: 'The deeper question is what security, competence, responsibility and a well-built life actually mean to you.',
    },
    Advice: {
      Cups: 'Respond through emotional honesty: name the feeling, protect the boundary, or have the conversation instead of managing everything indirectly.',
      Swords: 'Respond through clarity: identify the fact, ask the direct question, make the distinction, or say what needs to be said.',
      Wands: 'Respond through deliberate movement: choose a direction and put energy behind it instead of waiting for motivation to become perfect.',
      Pentacles: 'Respond practically: simplify the plan, improve the routine, check the resources, and make the next step concrete enough to repeat.',
    },
  };
  return map[position]?.[suit] || '';
}

function relationAngle(entry, position) {
  const lens = entry.card.suit ? SUIT_RELATION_LENSES[entry.card.suit] : null;
  if (position === 'You') {
    if (lens) return `On your side, look at your own ${lens}. That is where this card is most likely to become visible in the exchange.`;
    return 'On your side, treat this as a stance you are actively bringing into the connection through your choices, boundaries and responses.';
  }
  if (position === 'Them') {
    if (lens) return `Judge this through observable ${lens}: what they repeatedly do, say, initiate, avoid or fail to follow through on.`;
    return 'Judge this through observable behaviour only: choices, communication, avoidance, consistency and follow-through—not guessed private motives.';
  }
  if (position === 'Relationship') {
    if (lens) return `For the relationship itself, look at the pattern repeatedly created around ${lens} when both sides meet.`;
    return 'For the relationship itself, this describes the pattern created between two people, not a personality label that belongs to either one.';
  }
  return '';
}

function coreCue(entry) {
  const orientation = entry.orientation === 'reversed' ? 'reversed' : 'upright';
  if (entry.card.arcana === 'Major') {
    return MAJOR_CUES[entry.card.name]?.[orientation] || primaryKeyword(entry);
  }
  const domain = SUIT_RELATION_LENSES[entry.card.suit] || SUIT_DOMAINS[entry.card.suit] || 'daily life';
  const keyword = primaryKeyword(entry);
  return orientation === 'reversed'
    ? `${keyword} disrupting ${domain}`
    : `${keyword} shaping ${domain}`;
}

function positionReading(entry, position) {
  const card = entry.card.name;
  const meaning = meaningFor(entry);
  const reversed = entry.orientation === 'reversed';
  const display = reversed ? `${card} reversed` : card;
  const court = courtSentence(entry, position);
  const major = majorSentence(entry, position);
  const suit = suitAngle(entry, position);
  const relation = relationAngle(entry, position);
  const keyword = primaryKeyword(entry);

  const readings = {
    Past: `In the past, ${display} describes an influence that helped shape the present. ${meaning} The part worth carrying forward is not the label “${keyword}” itself, but what that period taught you to expect, tolerate, protect or repeat. Notice which of those habits are still active now. ${major}`,
    Present: `Right now, ${display} is the card asking for attention. ${meaning} Treat ${keyword} as the clearest signal of what is active, then look at where it is already affecting choices, pressure or timing in the present. ${major}`,
    Future: `Looking ahead, ${display} describes a direction the current pattern could develop toward. ${meaning} This is not a fixed outcome. Watch for the first concrete signs of ${keyword}, because those signs tell you whether the present course is strengthening that direction or giving you a chance to alter it. ${major}`,
    Situation: `${display} describes the condition at the center of the situation. ${meaning} The useful task is to recognize where ${keyword} is actually operating before trying to solve anything around it. If that diagnosis is wrong, the rest of the spread will be answering the wrong problem.`,
    Challenge: `${display} identifies the part that is hardest to handle cleanly. ${meaning} Here, ${keyword} matters because of what it costs: energy, clarity, options, trust or the ability to respond proportionately. The challenge is to deal with that pressure directly instead of reacting only to its symptoms.`,
    Advice: `As advice, ${display} asks for a deliberate response rather than more analysis. ${meaning} ${suit || entry.card.practicalGuidance?.[reversed ? 'reversed' : 'upright'] || `Turn ${keyword} into one concrete choice you can actually carry out.`} ${court}`,
    Mind: `Mentally, ${display} describes the strategy or story shaping how you interpret what is happening. ${meaning} ${suit || 'Notice which assumptions this card makes easier to believe and which alternatives it makes easier to ignore.'} The useful check is whether this mental approach is clarifying the situation or quietly narrowing what you are willing to reconsider. ${court} ${major}`,
    Body: `In your lived, day-to-day reality, ${display} shows what the situation is costing, changing or asking of your actual capacity. ${meaning} ${suit || 'Give more weight to what your energy, routines and behaviour are already showing than to what you intended to be able to sustain.'} This position is evidence: what is happening repeatedly matters more than what was supposed to happen. ${court} ${major}`,
    Spirit: `At the deeper level, ${display} asks what this situation means for the values or identity you are building. ${meaning} ${suit || 'The question here is not only what works, but what kind of principle or way of living you want to stand behind when the immediate pressure passes.'} Let this card change the standard you are using, not just your description of the problem. ${court} ${major}`,
    You: `On your side of the dynamic, ${display} describes what you are currently contributing to the exchange. ${meaning} ${relation} The useful question is not whether the card is “you,” but where your own choices are reinforcing, interrupting or complicating this pattern.`,
    Them: `From the outside, ${display} describes what the other person’s behaviour appears to be bringing into the exchange. ${meaning} ${relation} Keep the interpretation there; the card can describe a pattern you can observe without claiming access to what they secretly think or feel.`,
    Relationship: `For the connection itself, ${display} describes the pattern created when both sides meet. ${meaning} ${relation} This is the card to use when asking what the relationship repeatedly produces, regardless of either person’s stated intentions.`,
  };

  return clean((readings[position] || `${display}: ${meaning}`).replace(/\s+/g, ' '));
}

export function buildCardRead(entry, position, question='') {
  return {
    ...entry,
    position,
    keyword: primaryKeyword(entry),
    keywords: keywords(entry),
    cue: coreCue(entry),
    reading: positionReading(entry, position, question),
  };
}

function relationBetween(a, b, fromPosition, toPosition) {
  return buildPairRelation(a, b, fromPosition, toPosition);
}

function buildLayers(entries) {
  const layers = [];
  const majors = entries.filter((e) => e.card.arcana === 'Major');
  if (majors.length === 3) {
    layers.push({
      title: '3 Major Arcana',
      lead: 'This is a high-level reading about direction, values or a significant transition.',
      text: `With ${majors.map((e) => e.card.name).join(', ')} filling the entire spread, the story is less about one minor incident and more about the principles, choices or turning points organizing this period.`
    });
  } else if (majors.length === 2) {
    const minor = entries.find((e) => e.card.arcana !== 'Major');
    layers.push({
      title: '2 Major Arcana',
      lead: 'The spread has a broader developmental emphasis.',
      text: `${majors[0].card.name} and ${majors[1].card.name} widen the frame beyond day-to-day logistics.${minor ? ` ${minor.card.name} is useful because it shows how that larger issue is being lived in a more concrete way.` : ''}`
    });
  } else if (majors.length === 1) {
    layers.push({
      title: 'One Major Arcana',
      lead: `${majors[0].card.name} acts like the chapter heading.`,
      text: 'The Minor Arcana around it show how that bigger issue is appearing in ordinary behaviour, work, relationships, thought or emotion.'
    });
  }

  const suitCounts = entries.reduce((acc,e)=>{ if(e.card.suit) acc[e.card.suit]=(acc[e.card.suit]||0)+1; return acc; },{});
  const dominant = Object.entries(suitCounts).sort((a,b)=>b[1]-a[1])[0];
  if (dominant?.[1] >= 2) {
    layers.push({
      title: `${dominant[0]} emphasis`,
      lead: `The reading keeps returning to ${SUIT_DOMAINS[dominant[0]]}.`,
      text: 'That repetition gives the spread a clear center of gravity. Whatever else the cards are saying, this is where the story is being lived most directly.'
    });
  }
  return layers;
}

function buildReflection(cards, positions) {
  const [a,b,c] = cards;
  if (positions.join('|') === 'Past|Present|Future') {
    return [
      `What from the ${a.card.name} period are you still carrying into the present?`,
      `Where is ${b.keyword} most obvious in your life right now?`,
      `If ${c.card.name} is the direction rather than a guarantee, what choice would make its healthier expression more likely?`,
    ];
  }
  if (positions.join('|') === 'Situation|Challenge|Advice') {
    return [
      `What part of ${a.card.name} best matches the facts of the situation?`,
      `How is ${b.card.name} making this harder than it first appears?`,
      `What would ${c.keyword} look like as one concrete action this week?`,
    ];
  }
  if (positions.join('|') === 'Mind|Body|Spirit') {
    return [
      `Where might your mental story about ${a.keyword} be stronger than the evidence?`,
      `What does your actual routine, body, workload or behaviour say about ${b.keyword}?`,
      `What value or belief is ${c.card.name} asking you to reconsider or define more clearly?`,
    ];
  }
  return [
    `What are you doing that makes ${a.card.name} visible on your side of the exchange?`,
    `What repeated behaviour from the other person actually supports the ${b.card.name} interpretation?`,
    `What does the relationship keep producing that makes ${c.card.name} relevant between you?`,
  ];
}

export function buildDeepReading(entries, positions, question='') {
  const cards = entries.map((entry,index)=>buildCardRead(entry,positions[index],question));
  const relations = [
    relationBetween(entries[0],entries[1],positions[0],positions[1]),
    relationBetween(entries[1],entries[2],positions[1],positions[2]),
  ];
  const spreadSystem = buildSpreadSystem(cards,relations,positions,question);
  return {
    cards,
    relations,
    trajectory: cards.map((c)=>c.keyword).join(' → '),
    summary: spreadSystem.summary,
    synthesis: spreadSystem.synthesis,
    layers: buildLayers(entries),
    reflection: buildReflection(cards,positions),
  };
}