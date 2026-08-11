const SUIT_DOMAINS = {
  Cups: 'feelings, relationships, attachment, pleasure and emotional needs',
  Swords: 'thought, communication, conflict, fear, decisions and truth',
  Wands: 'motivation, ambition, creativity, initiative and momentum',
  Pentacles: 'work, money, routine, health, security, skill and practical life',
};

const QUESTION_DOMAINS = [
  { id: 'relationship', words: ['relationship','partner','love','dating','friend','friendship','marriage','boyfriend','girlfriend','him','her','them'], label: 'relationship' },
  { id: 'work', words: ['job','career','work','internship','boss','project','promotion','money','business'], label: 'work or career' },
  { id: 'study', words: ['school','college','university','class','exam','study','degree','research'], label: 'study or academic life' },
  { id: 'decision', words: ['choose','choice','decision','decide','option','should i','whether'], label: 'decision' },
  { id: 'self', words: ['myself','identity','confidence','purpose','life','happening in my life','stuck','change'], label: 'personal life' },
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

function detectQuestionDomain(question='') {
  const q = question.toLowerCase();
  return QUESTION_DOMAINS.find((domain) => domain.words.some((word) => q.includes(word))) || { id: 'general', label: 'your situation' };
}

function suitSentence(entry) {
  if (!entry.card.suit) return '';
  const domain = SUIT_DOMAINS[entry.card.suit];
  return `${entry.card.suit} keeps this grounded in ${domain}.`;
}

function questionSentence(entry, question) {
  if (!clean(question)) return '';
  const domain = detectQuestionDomain(question);
  const key = primaryKeyword(entry);
  const byDomain = {
    relationship: `In a relationship reading, that is most likely to show up through the way people communicate, protect themselves, seek closeness, set boundaries, or repeat the same interaction.` ,
    work: `In work or career, look for this through responsibilities, authority, workload, opportunity, recognition, money, or the practical consequences of a decision.`,
    study: `In academic life, this is likely to show up through preparation, confidence, feedback, workload, concentration, skill or the structure around your work.`,
    decision: `For a decision, ${key} describes an important condition of the choice rather than a yes-or-no verdict.`,
    self: `In a broad life reading, this is most useful where it is already producing a noticeable behaviour, tension or consequence.`,
    general: '',
  };
  return byDomain[domain.id] || '';
}

function positionReading(entry, position, question) {
  const card = entry.card.name;
  const key = primaryKeyword(entry);
  const meaning = baseMeaning(entry);
  const reversed = entry.orientation === 'reversed';
  const orientationPhrase = reversed
    ? `Because it is reversed, the theme is less straightforward: it may be blocked, internalized, overdone, delayed, or expressed in a way that is no longer helping.`
    : '';

  const openings = {
    Past: `In the past, ${card} suggests that ${key} played an important part in shaping where you are now. ${meaning} This looks less like a finished chapter than a background influence you may still be carrying forward.`,
    Present: `Right now, ${card} puts the emphasis on ${key}. ${meaning} This is the card I would treat as the clearest description of what is actively demanding your attention in the present.`,
    Future: `Looking ahead, ${card} points toward ${key}. ${meaning} Read this as the direction the current pattern is leaning toward, not as an unavoidable prediction.`,
    Situation: `${card} describes the situation through ${key}. ${meaning} Before trying to fix anything, take this as the basic condition the rest of the spread is responding to.`,
    Challenge: `The challenge is ${card}: ${key} is where the situation becomes difficult. ${meaning} This may be the obstacle itself, or the quality you need but are struggling to use cleanly.`,
    Advice: `As advice, ${card} says to work consciously with ${key}. ${meaning} The useful part is not to imitate the card literally, but to bring its strongest quality into one concrete choice, conversation or boundary.`,
    Mind: `In the Mind position, ${card} describes the lens through which you are interpreting events. ${meaning} ${key} may be shaping what you expect, fear, assume, or keep returning to mentally.`,
    Body: `In the Body position, ${card} brings ${key} into lived reality. ${meaning} Look for this in your energy, habits, routines, workload, health, resources, environment, or what you are actually doing day to day.`,
    Spirit: `In the Spirit position, ${card} points to the larger value or identity question underneath the immediate problem. ${meaning} ${key} may be showing you what principle, belief, or definition of a meaningful life is being tested.`,
    You: `For you, ${card} describes the stance you are bringing into the dynamic. ${meaning} ${key} may show what you are seeking, protecting, avoiding, or contributing without fully realizing it.`,
    Them: `For the other person, ${card} suggests a visible stance of ${key}. ${meaning} Keep this tied to what you can actually observe in their behaviour rather than assuming access to motives they have never stated.`,
    Relationship: `For the relationship itself, ${card} shows a pattern of ${key}. ${meaning} This is less about either person individually and more about what the two of you repeatedly create together.`,
  };

  const parts = [openings[position] || `${card} emphasizes ${key}. ${meaning}`, orientationPhrase, suitSentence(entry), questionSentence(entry, question)].filter(Boolean);
  return parts.join(' ');
}

function buildCardRead(entry, position, question) {
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
