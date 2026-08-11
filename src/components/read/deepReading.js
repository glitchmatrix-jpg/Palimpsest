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

function baseMeaning(entry) {
  return entry.orientation === 'reversed' ? entry.card.reversedMeaning : entry.card.meaning;
}

function naturalList(items=[]) {
  const values = items.filter(Boolean).slice(0, 3);
  if (!values.length) return 'the card’s central theme';
  if (values.length === 1) return values[0];
  if (values.length === 2) return `${values[0]} and ${values[1]}`;
  return `${values[0]}, ${values[1]} and ${values[2]}`;
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
  if (position === 'Past') return 'Because this is a Major Arcana card, that period may have shaped more than one isolated event; it may have changed how you understood yourself or the situation.';
  if (position === 'Present') return 'Because this is a Major Arcana card, the present issue may be asking for a broader shift in attitude, values or direction rather than a quick tactical fix.';
  if (position === 'Future') return 'Because this is a Major Arcana card, the direction ahead may feel like a larger turning point or change of stance rather than a small practical development.';
  if (position === 'Mind') return 'This may be more than a passing thought; it can describe a larger belief or worldview shaping how you interpret what is happening.';
  if (position === 'Body') return 'Its effect may be broad enough to show up across several parts of daily life rather than one isolated habit.';
  if (position === 'Spirit') return 'This is a strong signal that the deeper issue concerns identity, values, meaning or the kind of person you are trying to become.';
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
    Past: `In the past, ${display} points to a period shaped by ${theme}. ${meaning} Whatever happened then matters because it helped create the habits, expectations, relationships or conditions that the present is still responding to. ${major}`,

    Present: `Right now, ${display} puts ${theme} in the foreground. ${meaning} This is the part of the situation that looks active now — the pressure, opportunity or pattern that deserves your attention before you worry about what comes next. ${major}`,

    Future: `Looking ahead, ${display} suggests the current path is moving toward ${theme}. ${meaning} If nothing important changes, this is the kind of outcome or atmosphere that becomes more likely. It is a direction, not a fixed sentence, so what you do in the present still matters. ${major}`,

    Situation: `${display} says the situation is fundamentally about ${theme}. ${meaning} Before trying to solve anything, start here: this is the basic condition the other cards are reacting to, and it is probably the clearest description of what is actually going on.` ,

    Challenge: `The difficulty here is ${theme}. ${display} shows where the situation catches, drains energy or becomes harder to handle cleanly. ${meaning} The challenge is not to “beat” this card; it is to recognize what this pattern is costing, distorting or preventing so you can respond to the real problem.` ,

    Advice: `As advice, ${display} points you toward ${theme}. ${meaning} ${suit || 'Turn the card into one concrete response: a decision, boundary, conversation, pause or next step you can actually carry out.'} ${court}`,

    Mind: `Mentally, ${display} suggests you are approaching this through ${theme}. ${meaning} ${suit || 'This is likely shaping what you expect, what you keep returning to, and which possibilities you take seriously.'} ${court} ${major}`,

    Body: `In your lived, day-to-day reality, ${display} points to ${theme}. ${meaning} ${suit || 'Look at what your energy, routines, behaviour, workload, environment and capacity are already showing you.'} ${court} ${major}`,

    Spirit: `Underneath the practical details, ${display} raises a deeper question about ${theme}. ${meaning} ${suit || 'At this level, the card is less about one event and more about the value, identity or definition of a meaningful life that the situation is forcing you to examine.'} ${court} ${major}`,

    You: `On your side of the dynamic, ${display} shows ${theme} in the stance you are bringing. ${meaning} This may be what you are trying to create, protect, avoid or control in the interaction — including the part of your contribution that feels so normal to you that you barely notice it.` ,

    Them: `From the outside, the other person may be showing ${theme}. ${meaning} Read this through what they actually do, say, avoid or repeatedly choose. The card can describe the role they appear to be taking in the dynamic without pretending to reveal private thoughts they have never expressed.` ,

    Relationship: `Between you, ${display} suggests the relationship itself is operating through ${theme}. ${meaning} This is the recurring pattern created by the interaction — what the connection tends to produce when both sides meet — even if neither person is deliberately trying to create it.` ,
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

const NAMED_PAIRS = {
  'The Moon|The Sun': {
    type: 'contrast', axis: 'uncertainty → clarity',
    text: 'The Moon and the Sun are almost a built-in before-and-after. Something that was ambiguous, hidden, feared, or difficult to name becomes visible enough to deal with directly. The important part is not that confusion magically disappears; it is that better information changes what becomes possible.'
  },
  'The Tower|The Star': {
    type: 'recovery', axis: 'collapse → reorientation',
    text: 'The Tower strips away a structure that can no longer hold. The Star follows by asking what is still worth believing in once the shock has passed. This is recovery with evidence, not blind optimism.'
  },
  'Death|Temperance': {
    type: 'integration', axis: 'ending → re-composition',
    text: 'Death ends an arrangement; Temperance works with what remains. Together they describe the shift from accepting that something is over to finding a new balance that actually fits the changed reality.'
  },
  'The Devil|The Tower': {
    type: 'exposure', axis: 'attachment → rupture',
    text: 'The Devil names what has leverage over you; the Tower removes the structure that made that leverage sustainable. What was tolerated, rationalized, or hidden becomes much harder to maintain.'
  },
  'The Hermit|Wheel of Fortune': {
    type: 'adaptation', axis: 'reflection → change',
    text: 'The Hermit clarifies your own direction; the Wheel reminds you that circumstances still move. The pair asks whether your inner clarity is strong enough to survive a change you did not control.'
  },
  'The Lovers|The Chariot': {
    type: 'commitment', axis: 'choice → direction',
    text: 'The Lovers makes the choice meaningful; the Chariot makes it operational. A value or commitment only becomes real when your behaviour can be coordinated around it.'
  },
  'The Hanged Man|Death': {
    type: 'release', axis: 'reframe → ending',
    text: 'The Hanged Man changes how you see the situation; Death asks what must actually end once that old perspective no longer works. Insight becomes consequence.'
  },
};

function relationBetween(a, b) {
  const aKey = primaryKeyword(a);
  const bKey = primaryKeyword(b);
  const named = NAMED_PAIRS[`${a.card.name}|${b.card.name}`] || NAMED_PAIRS[`${b.card.name}|${a.card.name}`];
  if (named) return named;

  if (a.card.suit && a.card.suit === b.card.suit) {
    return {
      type: 'same domain', axis: `${aKey} → ${bKey}`,
      text: `Both cards are ${a.card.suit}, so the story stays in the same part of life: ${SUIT_DOMAINS[a.card.suit]}. ${a.card.name} establishes ${aKey}; ${b.card.name} shows what that same domain looks like once it develops into ${bKey}.`
    };
  }

  if (a.card.arcana === 'Major' && b.card.arcana === 'Major') {
    return {
      type: 'major transition', axis: `${aKey} → ${bKey}`,
      text: `${a.card.name} moving into ${b.card.name} makes this feel bigger than a passing mood. The first card establishes a stance or life lesson around ${aKey}; the second asks what happens when that develops into ${bKey}.`
    };
  }

  if (a.orientation !== b.orientation) {
    return {
      type: 'shift in expression', axis: `${aKey} → ${bKey}`,
      text: `The spread moves from ${aKey} to ${bKey}, but the orientation changes as well. That suggests the issue is not only changing subject; it is changing how openly or cleanly it can be expressed.`
    };
  }

  return {
    type: 'progression', axis: `${aKey} → ${bKey}`,
    text: `${a.card.name} sets up ${aKey}; ${b.card.name} follows with ${bKey}. Read them as cause and development: the first creates the conditions in which the second becomes the next thing you have to deal with.`
  };
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

function storySentence(cards, positions, question) {
  const [a,b,c] = cards;
  const q = clean(question);
  const lead = q ? `For “${q}”, ` : '';
  if (positions.join('|') === 'Past|Present|Future') {
    return `${lead}${a.card.name} shows where the story began, ${b.card.name} describes what is shaping it now, and ${c.card.name} shows what the current pattern is moving toward.`;
  }
  if (positions.join('|') === 'Situation|Challenge|Advice') {
    return `${lead}${a.card.name} names the situation, ${b.card.name} shows why it is difficult, and ${c.card.name} points to the response most likely to move it forward.`;
  }
  if (positions.join('|') === 'Mind|Body|Spirit') {
    return `${lead}${a.card.name} describes the mental frame, ${b.card.name} shows how the issue is being lived in practice, and ${c.card.name} points to the deeper value or identity question underneath both.`;
  }
  return `${lead}${a.card.name} describes your side, ${b.card.name} describes the other side, and ${c.card.name} shows the pattern the connection is producing between you.`;
}

function synthesisParagraphs(cards, relations, positions, question) {
  const [a,b,c] = cards;
  const p1 = storySentence(cards, positions, question);
  const p2 = `The story itself is ${a.keyword} → ${b.keyword} → ${c.keyword}. ${relations[0].text} Then ${relations[1].text}`;

  let p3;
  if (positions.join('|') === 'Past|Present|Future') {
    p3 = `Put simply: the past brought you into ${a.keyword}, the present is asking you to deal with ${b.keyword}, and the future card suggests that ${c.keyword} becomes increasingly important if this course continues. The future is not fixed; ${c.card.name} is showing the kind of outcome your current choices are making more plausible.`;
  } else if (positions.join('|') === 'Situation|Challenge|Advice') {
    p3 = `Put simply: the problem is not just ${a.keyword}. The real difficulty is ${b.keyword}, and ${c.card.name} suggests that progress comes from working consciously with ${c.keyword} rather than trying to bypass the challenge.`;
  } else if (positions.join('|') === 'Mind|Body|Spirit') {
    p3 = `Put simply: what you think is happening, what you are actually living, and what the situation means to you may not be perfectly aligned. The useful work is to notice where ${a.keyword}, ${b.keyword}, and ${c.keyword} support each other — and where one is pulling against the others.`;
  } else {
    p3 = `Put simply: this is not only about what either person wants. ${c.card.name} shows what the interaction itself is becoming. If that pattern is not what you want, changing your own side of the loop is the part you can act on directly.`;
  }
  return [p1,p2,p3];
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
  const relations = [relationBetween(entries[0],entries[1]), relationBetween(entries[1],entries[2])];
  const synthesis = synthesisParagraphs(cards,relations,positions,question);
  return {
    cards,
    relations,
    trajectory: cards.map((c)=>c.keyword).join(' → '),
    summary: synthesis[0],
    synthesis,
    layers: buildLayers(entries),
    reflection: buildReflection(cards,positions),
  };
}