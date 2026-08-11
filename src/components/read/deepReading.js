import { buildPairRelation } from './combinationIntelligence.js';
import { buildSpreadSystem } from './spreadSystems.js';

const SUIT_DOMAINS = {
  Cups: 'feelings, relationships, attachment, pleasure and emotional needs',
  Swords: 'thought, communication, conflict, fear, decisions and truth',
  Wands: 'motivation, ambition, creativity, initiative and momentum',
  Pentacles: 'work, money, routine, health, security, skill and practical life',
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

function naturalList(items=[]) {
  const values = items.filter(Boolean).slice(0, 3);
  if (!values.length) return 'the card’s central theme';
  if (values.length === 1) return values[0];
  if (values.length === 2) return `${values[0]} and ${values[1]}`;
  return `${values[0]}, ${values[1]} and ${values[2]}`;
}

function baseMeaning(entry) {
  if (entry.orientation !== 'reversed') return entry.card.meaning;
  if (entry.card.arcana === 'Major') return entry.card.reversedMeaning;
  return `${entry.card.name} reversed brings ${naturalList(entry.card.reversed)} into focus.`;
}

function themePhrase(entry) {
  return naturalList(keywords(entry));
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

  if (position === 'Mind') return `As a ${rank}, this is not a passive idea: it describes a mental style built around ${role}.`;
  if (position === 'Body') return `As a ${rank}, the pattern is likely to show up through ${role} in your actual behaviour or capacity.`;
  if (position === 'Spirit') return `As a ${rank}, the deeper lesson involves ${role} in a way that feels personally owned rather than theoretical.`;
  if (position === 'Advice') return `The ${rank} makes the advice practical: ${role} is more useful here than waiting for certainty.`;
  return '';
}

function majorSentence(entry, position) {
  if (entry.card.arcana !== 'Major') return '';
  if (position === 'Past') return `Because ${entry.card.name} is Major Arcana, that period may have changed how you understood yourself or the situation, not just what happened on one particular day.`;
  if (position === 'Present') return `${entry.card.name} being Major Arcana makes the present issue feel broader than a quick tactical problem; attitude, values or direction may be part of what is changing.`;
  if (position === 'Future') return `${entry.card.name} being Major Arcana makes the direction ahead look more like a turning point or change of stance than a small practical development.`;
  if (position === 'Mind') return `With ${entry.card.name} here, this may be more than a passing thought; it can describe a larger belief or worldview shaping how you interpret events.`;
  if (position === 'Body') return `With ${entry.card.name} here, the effect may be broad enough to show up across several parts of daily life rather than one isolated habit.`;
  if (position === 'Spirit') return `${entry.card.name} strongly points toward identity, values, meaning or the kind of person you are trying to become.`;
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
      Cups: 'In practice, look at emotional bandwidth, boundaries, rest, closeness and how much of other people’s emotional weight you are carrying.',
      Swords: 'In practice, this can show up through tension, stress, difficult conversations, avoidance, overthinking or the physical cost of staying mentally activated.',
      Wands: 'In practice, this is about energy and output: pace, workload, motivation, movement and whether your current level of effort is sustainable.',
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

function positionReading(entry, position) {
  const card = entry.card.name;
  const meaning = baseMeaning(entry);
  const theme = themePhrase(entry);
  const reversed = entry.orientation === 'reversed';
  const display = reversed ? `${card} reversed` : card;
  const court = courtSentence(entry, position);
  const major = majorSentence(entry, position);
  const suit = suitAngle(entry, position);

  const readings = {
    Past: `In the past, ${display} points to a period shaped by ${theme}. ${meaning} What matters now is how living through ${theme} taught you what to expect, tolerate, protect or repeat, because some of those habits or assumptions may still be feeding the present. ${major}`,
    Present: `Right now, ${display} puts ${theme} in the foreground. ${meaning} That makes ${theme} the active pressure, opportunity or pattern to deal with before you worry about what comes next. ${major}`,
    Future: `Looking ahead, ${display} suggests the current path is moving toward ${theme}. ${meaning} If nothing important changes, ${theme} is the kind of outcome or atmosphere that becomes more likely. Treat ${theme} as a direction you can still influence, not a fixed prediction. ${major}`,
    Situation: `${display} says the situation itself is organized around ${theme}. ${meaning} Before trying to solve it, get clear on how ${theme} is actually operating; that is the condition the other cards are responding to and the part you would have to understand correctly for any response to work.`,
    Challenge: `${display} makes ${theme} the point of friction. ${meaning} In this position, ask where ${theme} is costing energy, narrowing your options, distorting judgment or making a necessary response harder to carry out. The challenge is to deal with the pressure created by ${theme} directly rather than fighting the card’s label.`,
    Advice: `As advice, ${display} points you toward ${theme}. ${meaning} ${suit || `Turn ${theme} into one concrete response: a decision, boundary, conversation, pause or next step you can actually carry out.`} ${court}`,
    Mind: `Mentally, ${display} suggests you are approaching this through ${theme}. ${meaning} ${suit || `This is likely shaping what you expect, what you keep returning to, and which possibilities you take seriously.`} The useful check is whether ${theme} is helping you see the situation more clearly or narrowing what you are willing to reconsider. ${court} ${major}`,
    Body: `In your lived, day-to-day reality, ${display} points to ${theme}. ${meaning} ${suit || `Look at what your energy, routines, behaviour, workload, environment and capacity are already showing you.`} With ${theme} in the Body position, give more weight to what is actually happening than to what you intend or believe should be happening. ${court} ${major}`,
    Spirit: `Underneath the practical details, ${display} raises a deeper question about ${theme}. ${meaning} ${suit || `At this level, the card is less about one event and more about the value, identity or definition of a meaningful life that the situation is forcing you to examine.`} Ask what living with ${theme} would require from your values when nobody else is choosing for you. ${court} ${major}`,
    You: `On your side of the dynamic, ${display} shows ${theme} in the stance you are bringing. ${meaning} You may be trying to create, protect, avoid or control something through ${theme}. Pay attention to how a stance built around ${theme} changes the exchange, especially where it feels so familiar that you barely notice you are doing it.`,
    Them: `From the outside, ${display} suggests the other person is showing ${theme}. ${meaning} Keep the ${theme} interpretation tied to what they actually do, say, avoid or repeatedly choose. What matters is whether their observable behaviour consistently supports ${theme}; there is no need to invent private motives.`,
    Relationship: `Between you, ${display} suggests the relationship itself is operating through ${theme}. ${meaning} When ${theme} becomes the climate of the connection, look at what the interaction repeatedly produces when both sides meet. A recurring pattern of ${theme} matters more here than deciding which person deserves the label.`,
  };

  return clean((readings[position] || `${display} emphasizes ${theme}. ${meaning}`).replace(/\s+/g, ' '));
}

export function buildCardRead(entry, position, question='') {
  return {
    ...entry,
    position,
    keyword: primaryKeyword(entry),
    keywords: keywords(entry),
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
      text: `That repetition gives the spread a clear center of gravity. Whatever else the cards are saying, this domain is probably where the story is being lived most directly.`
    });
  }

  const reversed = entries.filter((e)=>e.orientation==='reversed').length;
  if (reversed >= 2) {
    layers.push({
      title: `${reversed} reversed cards`,
      lead: 'A lot of the story is happening indirectly.',
      text: 'Expect blocked expression, hesitation, internal conflict, delay, overcorrection, or qualities that are present but difficult to use cleanly. Reversed does not automatically mean negative.'
    });
  } else if (reversed === 0) {
    layers.push({
      title: 'All upright',
      lead: 'The themes are comparatively direct and visible.',
      text: 'That does not make the spread automatically positive; it means the main story is more likely to be showing itself through obvious circumstances and choices rather than hidden or heavily blocked dynamics.'
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
    `What part of ${a.card.name} genuinely describes your current stance?`,
    `What behaviour from the other person actually supports the ${b.card.name} interpretation?`,
    `What pattern would have to change for ${c.card.name} to express itself differently between you?`,
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
