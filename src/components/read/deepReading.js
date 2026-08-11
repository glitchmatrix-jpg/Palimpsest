const POSITION_PURPOSE = {
  Past: 'what helped create the present pattern',
  Present: 'what is most active and consequential now',
  Future: 'where the current pattern is likely to lead if nothing important changes',
  Situation: 'what is actually happening before interpretation becomes advice',
  Challenge: 'what complicates the situation or keeps it from resolving cleanly',
  Advice: 'the response most likely to improve the situation',
  Mind: 'the interpretation, belief, expectation or mental pressure shaping your experience',
  Body: 'what is happening in lived reality: capacity, habits, action, resources, health or practical conditions',
  Spirit: 'the value, identity or meaning question underneath the immediate problem',
  You: 'your current stance, need, contribution or blind spot in the dynamic',
  Them: 'the role or behaviour the other person appears to be bringing, without claiming access to private thoughts',
  Relationship: 'the pattern the connection itself is producing between both people',
};

const SUIT_DOMAINS = {
  Cups: 'feelings, attachment, intimacy, empathy and relationships',
  Swords: 'thought, interpretation, communication, conflict and truth',
  Wands: 'drive, initiative, ambition, momentum and creative action',
  Pentacles: 'work, resources, routines, the body, security and tangible results',
};

const QUESTION_DOMAINS = [
  { id: 'relationship', words: ['relationship','partner','love','dating','friend','friendship','marriage','boyfriend','girlfriend','him','her','them'], label: 'relationship' },
  { id: 'work', words: ['job','career','work','internship','boss','project','promotion','money','business'], label: 'work or career' },
  { id: 'study', words: ['school','college','university','class','exam','study','degree','research'], label: 'study or academic life' },
  { id: 'decision', words: ['choose','choice','decision','decide','option','should i','whether'], label: 'decision' },
  { id: 'self', words: ['myself','identity','confidence','purpose','life','happening in my life','stuck','change'], label: 'personal life' },
];

function clean(text='') { return String(text || '').trim(); }
function article(word='') { return /^[aeiou]/i.test(word) ? 'an' : 'a'; }

export function primaryKeyword(entry) {
  const source = entry.orientation === 'reversed' ? entry.card.reversed : entry.card.upright;
  return source?.[0] || 'development';
}

function secondaryKeywords(entry) {
  const source = entry.orientation === 'reversed' ? entry.card.reversed : entry.card.upright;
  return (source || []).slice(1, 4);
}

function baseMeaning(entry) {
  return entry.orientation === 'reversed' ? entry.card.reversedMeaning : entry.card.meaning;
}

function detectQuestionDomain(question='') {
  const q = question.toLowerCase();
  const found = QUESTION_DOMAINS.find((domain) => domain.words.some((word) => q.includes(word)));
  return found || { id: 'general', label: 'the situation you asked about' };
}

function orientationExplanation(entry) {
  if (entry.orientation === 'upright') {
    return 'Because the card is upright, I would first look for this quality in relatively visible, direct behaviour or circumstances before assuming it is hidden.';
  }
  const key = primaryKeyword(entry);
  return `Because the card is reversed, do not read “${key}” as a simple opposite. Ask whether the underlying theme is being blocked, internalized, overdone, delayed, or expressed in a way that no longer works.`;
}

function positionSpecific(entry, position) {
  const key = primaryKeyword(entry);
  const card = entry.card.name;
  const purpose = POSITION_PURPOSE[position] || 'the role assigned to this position';
  const suit = entry.card.suit ? SUIT_DOMAINS[entry.card.suit] : null;

  const byPosition = {
    Past: `${card} is useful here as background, not destiny. Ask where ${key} became part of the conditions that produced the present situation, and whether that influence is still active or merely being repeated out of habit.`,
    Present: `${card} belongs in the foreground. The question is not whether ${key} exists somewhere in your life, but where it is exerting enough pressure that ignoring it would distort the rest of the reading.`,
    Future: `${card} describes a direction, not a guarantee. If the current pattern continues, ${key} is the kind of outcome or atmosphere that becomes more plausible. The value of the card is that it lets you decide whether to reinforce or interrupt that direction.`,
    Situation: `${card} asks you to describe the facts before trying to fix them. Look for concrete evidence of ${key}, then separate that evidence from the story you are telling yourself about it.`,
    Challenge: `${card} names the friction. ${key} may be the obstacle itself, or it may be the quality the situation is demanding from you that you have not yet found a workable way to supply.`,
    Advice: `${card} is not an instruction to “become the card.” Translate ${key} into one behaviour, boundary, conversation, experiment, or perspective shift you can actually carry out.`,
    Mind: `${card} points to the lens through which you are interpreting events. With ${key} in the Mind position, ask which conclusions feel certain because they are well-supported and which feel certain because you have repeated them often.`,
    Body: `${card} has to become concrete here. Look for ${key} in sleep, energy, routines, health signals, workload, money, physical environment, habits, or what you are actually doing day to day — not only in what you think about those things.`,
    Spirit: `${card} widens the question beyond immediate logistics. ${key} may be pointing to a value, inherited rule, identity, or definition of a “good” life that is quietly deciding what choices feel available to you.`,
    You: `${card} is about your observable stance in the dynamic. Look for where ${key} describes what you are protecting, pursuing, avoiding, assuming, or contributing — including the part that may be difficult to admit.`,
    Them: `${card} should be read conservatively here. Use ${key} to describe the role or behaviour you can actually observe from the other person; do not turn the card into a claim about motives or private thoughts you cannot verify.`,
    Relationship: `${card} describes the pattern between people rather than either person alone. Ask how ${key} is being co-created through repeated interaction: what one side does, how the other responds, and what that loop produces.`,
  };

  const sentence = byPosition[position] || `${card} is being asked to speak about ${purpose}.`;
  return suit ? `${sentence} ${entry.card.suit} narrows the domain toward ${suit}.` : sentence;
}

function questionFit(entry, position, question) {
  const domain = detectQuestionDomain(question);
  const key = primaryKeyword(entry);
  if (!clean(question)) {
    return `Because no specific question was entered, keep this broad. Look for the most concrete place where ${key} is already observable before deciding what the card “must” be about.`;
  }

  const domainText = {
    relationship: `In a relationship question, translate ${key} into interaction: who does what, what gets said or withheld, what boundary is present, and what pattern repeats afterward.`,
    work: `In a work or career question, translate ${key} into responsibilities, incentives, communication, workload, opportunity, authority, or the practical consequences of a choice.`,
    study: `In an academic question, translate ${key} into attention, preparation, confidence, workload, feedback, skill development, or the structure around your study rather than treating it as a vague mood.`,
    decision: `In a decision question, use ${key} to test the choice: what does this option require, what does it cost, what assumption does it depend on, and what evidence would change your mind?`,
    self: `In a broad personal-life question, ${key} is too abstract by itself. Find the area where it is producing the clearest behaviour or consequence, then read outward from there.`,
    general: `For this question, keep returning to what can actually be observed. ${key} becomes useful only when you can point to the behaviour, condition, conflict, need, or choice it describes.`,
  };
  return domainText[domain.id] || domainText.general;
}

function practicalMove(entry, position) {
  const key = primaryKeyword(entry);
  const second = secondaryKeywords(entry)[0];
  const reversed = entry.orientation === 'reversed';
  if (position === 'Advice') {
    return `Make the advice testable: choose one small action that embodies ${key}${second ? ` without sliding into ${second}` : ''}, then watch what changes instead of assuming the card has solved the problem.`;
  }
  if (position === 'Challenge') {
    return `Do not fight the keyword abstractly. Identify one place where ${key} is costing time, clarity, energy, trust, or options, and intervene there.`;
  }
  if (position === 'Mind') {
    return `Write down the conclusion you are most certain of, then list the evidence for it and the evidence that would falsify it. That is the fastest way to test whether ${key} is describing reality or your current frame.`;
  }
  if (position === 'Body') {
    return `Check the lived data: sleep, appetite, energy, pain, routine, workload, money, environment, and what you have actually done this week. If the card is relevant here, it should leave fingerprints somewhere concrete.`;
  }
  if (position === 'Spirit') {
    return `Name the rule underneath the choice: “I believe I should…”, “A good person would…”, or “Success means…”. Then decide whether that rule is still yours.`;
  }
  if (reversed) {
    return `Rather than forcing the upright quality, ask what would let it move more cleanly: less pressure, better timing, a boundary, more information, a smaller step, or a different outlet.`;
  }
  return `Turn ${key} into an experiment. Choose one behaviour that would make this quality more visible, then use the result as new information.`;
}

function uncertaintyNote(entry) {
  const key = primaryKeyword(entry);
  return `What not to overclaim: this card does not prove that “${key}” is objectively true. It gives you a hypothesis to compare against your actual circumstances.`;
}

function buildCardRead(entry, position, question) {
  return {
    ...entry,
    position,
    keyword: primaryKeyword(entry),
    meaning: baseMeaning(entry),
    positionPurpose: POSITION_PURPOSE[position],
    contextual: positionSpecific(entry, position),
    questionFit: questionFit(entry, position, question),
    orientationNote: orientationExplanation(entry),
    practicalMove: practicalMove(entry, position),
    uncertaintyNote: uncertaintyNote(entry),
  };
}

function relationType(a, b) {
  const sameSuit = a.card.suit && a.card.suit === b.card.suit;
  const bothMajor = a.card.arcana === 'Major' && b.card.arcana === 'Major';
  const sameOrientation = a.orientation === b.orientation;
  const aKey = primaryKeyword(a);
  const bKey = primaryKeyword(b);

  const named = {
    'The Moon|The Sun': ['contrast', 'ambiguity gives way to visibility', 'The cards form a strong symbolic contrast: hidden versus visible, night versus day, uncertainty versus clarity. The important question is what must happen between them for confusion to become information.'],
    'The Tower|The Star': ['recovery', 'collapse makes honest reorientation possible', 'The Star does not cancel the Tower. It asks what can be rebuilt after false stability has been removed, which makes hope credible only if it is grounded in what the disruption actually taught you.'],
    'Death|Temperance': ['integration', 'an ending has to be metabolized, not merely survived', 'Death closes a form; Temperance asks how the remaining pieces can be recombined into something workable. This pair often shifts the question from “How do I keep the old thing?” to “What arrangement fits reality now?”'],
    'The Devil|The Tower': ['exposure', 'a binding pattern loses the structure protecting it', 'The Devil names leverage — fear, appetite, shame, dependency, status — and the Tower removes the structure that allowed it to remain comfortable or hidden.'],
    'The Hermit|Wheel of Fortune': ['adaptation', 'inner clarity meets conditions you cannot control', 'The Hermit can clarify what is yours to decide; the Wheel immediately tests that clarity against changing conditions. The pair separates internal direction from external control.'],
    'The Lovers|The Chariot': ['commitment', 'a choice becomes a direction', 'The Lovers asks what aligns with your values; the Chariot asks whether you can coordinate your behaviour around that choice once competing motives return.'],
    'The Hanged Man|Death': ['release', 'a changed frame becomes a real ending', 'The Hanged Man loosens the old perspective; Death asks whether you are willing to let the old arrangement actually end once you can no longer see it the same way.'],
  };
  const direct = named[`${a.card.name}|${b.card.name}`] || named[`${b.card.name}|${a.card.name}`];
  if (direct) return { type: direct[0], headline: direct[1], text: direct[2], axis: `${aKey} → ${bKey}` };

  if (sameSuit) {
    return {
      type: 'reinforcement',
      headline: `the issue stays inside ${a.card.suit}`,
      axis: `${aKey} → ${bKey}`,
      text: `Because both cards are ${a.card.suit}, the spread is not changing subject here. It is showing two different expressions of the same domain — ${SUIT_DOMAINS[a.card.suit]}. Read the second card as a development, correction, escalation, or consequence of the first rather than as a separate topic.`,
    };
  }
  if (bothMajor) {
    return {
      type: 'archetypal shift',
      headline: 'the frame widens from an event to a stance or developmental task',
      axis: `${aKey} → ${bKey}`,
      text: `Two Major Arcana together usually deserve more weight than a keyword chain. Ask what change in identity, values, responsibility, perspective, or life structure could connect ${a.card.name} to ${b.card.name}.`,
    };
  }
  if (!sameOrientation) {
    return {
      type: 'change in expression',
      headline: 'the theme changes how it is being expressed',
      axis: `${aKey} → ${bKey}`,
      text: `The orientation changes across this pair. That does not automatically mean “good to bad” or “bad to good.” It suggests that one part of the sequence is more direct while the other may be blocked, internalized, delayed, excessive, or in need of redirection.`,
    };
  }
  return {
    type: 'progression',
    headline: `${aKey} creates the conditions in which ${bKey} becomes relevant`,
    axis: `${aKey} → ${bKey}`,
    text: `Do not treat these as two labels. Ask what would have to happen for a situation described by ${aKey} to produce a situation described by ${bKey}. That causal bridge is usually more useful than either keyword alone.`,
  };
}

function buildLayers(entries) {
  const layers = [];
  const majors = entries.filter((e) => e.card.arcana === 'Major');
  if (majors.length >= 2) {
    layers.push({
      title: `${majors.length} Major Arcana`,
      lead: 'The reading is asking a bigger question than logistics alone.',
      text: `With ${majors.map((e) => e.card.name).join(' and ')} in a three-card spread, pay attention to values, identity, worldview, responsibility, endings, or major reorientation. The Minor card becomes especially useful because it may show how that larger issue is being lived day to day.`,
    });
  } else if (majors.length === 1) {
    layers.push({
      title: 'One Major Arcana',
      lead: `${majors[0].card.name} is the widest frame in the spread.`,
      text: 'Use the Major as the chapter heading and the Minor cards as evidence about how that larger issue is showing up in behaviour, emotion, thought, work, resources, or relationships.',
    });
  }

  const suitCounts = entries.reduce((acc,e)=>{ if(e.card.suit) acc[e.card.suit]=(acc[e.card.suit]||0)+1; return acc; },{});
  const dominant = Object.entries(suitCounts).sort((a,b)=>b[1]-a[1])[0];
  if (dominant?.[1] >= 2) {
    layers.push({
      title: `${dominant[0]} emphasis`,
      lead: `The spread keeps returning to ${SUIT_DOMAINS[dominant[0]]}.`,
      text: `This matters because repeated suit energy narrows the reading. Before inventing a grand explanation, check whether the question can be understood more simply through this domain.`,
    });
  }

  const reversed = entries.filter((e)=>e.orientation==='reversed').length;
  if (reversed >= 2) {
    layers.push({
      title: `${reversed} reversed cards`,
      lead: 'A lot of the reading may be indirect or difficult to express cleanly.',
      text: 'Look for blocked action, internal conflict, overcompensation, delay, mixed signals, or a quality that needs a different route. Do not make every reversal negative; use it to ask how the card is functioning.',
    });
  } else if (reversed === 0) {
    layers.push({
      title: 'All upright',
      lead: 'The central themes are comparatively visible.',
      text: 'That does not make the reading automatically positive. It simply means you can start with what is directly happening before searching for hidden motives or suppressed dynamics.',
    });
  }
  return layers;
}

function synthesisParagraphs(cards, relations, positions, question) {
  const q = clean(question);
  const [a,b,c] = cards;
  const domain = detectQuestionDomain(q);
  const first = primaryKeyword(a), middle = primaryKeyword(b), last = primaryKeyword(c);

  const p1 = q
    ? `For “${q}”, the spread is more useful as a sequence than as three verdicts. ${a.card.name} in ${positions[0]} describes ${first} at the level of ${a.positionPurpose}; ${b.card.name} in ${positions[1]} shows the mechanism or pressure that complicates that picture; and ${c.card.name} in ${positions[2]} describes the stance, consequence, or direction that becomes relevant next.`
    : `Without a narrow question, read this as a diagnostic snapshot. ${a.card.name} establishes the starting condition, ${b.card.name} shows what is mediating or complicating it, and ${c.card.name} shows the direction or larger issue that deserves attention.`;

  const p2 = `The most important part is the middle card. ${b.card.name} is not filler between “${first}” and “${last}.” ${relations[0].text} Then ${relations[1].text}`;

  const p3 = `A grounded way to use this is to separate observation from interpretation. First ask what in your ${domain.label} is already observable and fits these cards. Then ask what you are merely inferring. The reading gets stronger when the cards help you generate a better distinction or test, not when they encourage you to believe a dramatic story because it sounds meaningful.`;

  return [p1,p2,p3];
}

function buildReflection(cards, question) {
  const [a,b,c]=cards;
  const q = clean(question);
  return [
    `Where is ${primaryKeyword(a)} actually observable${q ? ` in relation to “${q}”` : ''}, and what evidence would show that you are misreading it?`,
    `What is ${b.card.name} asking you to notice that your first interpretation of the situation leaves out?`,
    `If ${primaryKeyword(c)} is a direction rather than a prediction, what behaviour, boundary, conversation, or decision would make that direction more or less likely?`,
    `Which card describes something you can influence directly, and which card describes a condition you may need to acknowledge rather than control?`,
  ];
}

export function buildDeepReading(entries, positions, question='') {
  const cards = entries.map((entry,index)=>buildCardRead(entry,positions[index],question));
  const relations = [relationType(entries[0],entries[1]), relationType(entries[1],entries[2])];
  const paragraphs = synthesisParagraphs(cards,relations,positions,question);
  const trajectory = cards.map(primaryKeyword).join(' → ');
  return {
    cards,
    relations,
    trajectory,
    summary: paragraphs[0],
    synthesis: paragraphs,
    layers: buildLayers(entries),
    reflection: buildReflection(cards,question),
    questionDomain: detectQuestionDomain(question),
  };
}
