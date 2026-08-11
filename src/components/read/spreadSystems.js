function clean(value='') {
  return String(value || '').trim();
}

function questionLead(question) {
  const q = clean(question);
  return q ? `For “${q}”, ` : '';
}

function isInteresting(relation) {
  return Boolean(relation?.interesting);
}

function relationPhrase(relation) {
  if (!isInteresting(relation)) return '';
  const axis = clean(relation.axis);
  if (!axis) return '';
  const type = relation.type || 'relationship';
  if (type === 'mismatch' || type === 'contradiction') return `the clearest tension is ${axis}`;
  if (type === 'correction') return `the second card corrects the first through ${axis}`;
  if (type === 'reinforcement') return `the two cards reinforce ${axis}`;
  if (type === 'cause → effect') return `the strongest causal movement is ${axis}`;
  if (type === 'escalation') return `the pressure intensifies through ${axis}`;
  if (type === 'Major ↔ Minor') return `the issue moves between a larger principle and lived reality through ${axis}`;
  return `the strongest direct link is ${axis}`;
}

function cue(card) {
  return clean(card?.cue) || clean(card?.keyword) || 'a meaningful shift';
}

function pastPresentFuture(cards, relations, question) {
  const [past, present, future] = cards;
  const [intoPresent, intoFuture] = relations;
  const lead = questionLead(question);

  let p1 = `${lead}the spread begins with ${past.card.name} as background and ${present.card.name} as the present hinge. That gives you a useful distinction: ${cue(past)} belongs to what has already shaped your expectations, while ${cue(present)} is what actually needs to be handled now.`;
  if (isInteresting(intoPresent)) {
    p1 += ` Between those two cards, ${relationPhrase(intoPresent)}. That makes the past relevant because something about it is still feeding the present.`;
  } else {
    p1 += ` The cards do not justify saying the past directly caused the present, so keep the first card as context rather than turning sequence into causation.`;
  }

  let p2 = `${future.card.name} then changes the reading from explanation to direction. Its role is to show what becomes more relevant if the current pattern continues: ${cue(future)}.`;
  if (isInteresting(intoFuture)) {
    p2 += ` Here, ${relationPhrase(intoFuture)}. That gives the future card a real bridge from the present rather than leaving it as a detached prediction.`;
  } else {
    p2 += ` There is no strong pair link from the present, so read it as a possibility to watch for rather than an outcome the cards have proven.`;
  }

  const p3 = `The practical reading is this: identify what the past taught you that is still useful, separate it from what is merely familiar, and judge the future by what the present is actually reinforcing. The future card matters most as an early-warning signal—you can notice the direction before it becomes the only direction available.`;

  return {
    summary: `${past.card.name} explains the background, ${present.card.name} shows the active hinge, and ${future.card.name} describes the direction to watch—not a guaranteed outcome.`,
    synthesis: [p1,p2,p3],
  };
}

function situationChallengeAdvice(cards, relations, question) {
  const [situation, challenge, advice] = cards;
  const [intoChallenge, intoAdvice] = relations;
  const lead = questionLead(question);

  let p1 = `${lead}${situation.card.name} and ${challenge.card.name} separate the problem from the thing making it difficult. The situation is organized around ${cue(situation)}; the friction comes from ${cue(challenge)}. That distinction matters because solving the visible situation will not help much if the challenge keeps recreating the same difficulty.`;
  if (isInteresting(intoChallenge)) {
    p1 += ` In this pair, ${relationPhrase(intoChallenge)}.`;
  } else {
    p1 += ` They do not form a strong direct pair, so the challenge may be an independent pressure rather than a consequence of the situation itself.`;
  }

  let p2 = `${advice.card.name} is where the spread becomes useful rather than descriptive. It points toward ${cue(advice)} as the response worth testing.`;
  if (isInteresting(intoAdvice)) {
    p2 += ` The reason it fits is that ${relationPhrase(intoAdvice)}.`;
  } else {
    p2 += ` The cards do not give it a neat symbolic bridge from the Challenge card, so judge the advice by whether it changes the actual conditions rather than whether it sounds thematically elegant.`;
  }

  const p3 = `Put the spread into action by asking three separate questions: What is true about the situation? What specifically is making it harder? What would I do differently if I took the Advice card seriously for one concrete decision? If the third answer does not change behavior, the reading has not yet reached the useful part.`;

  return {
    summary: `${situation.card.name} diagnoses the situation, ${challenge.card.name} isolates the friction, and ${advice.card.name} gives you something concrete to test.`,
    synthesis: [p1,p2,p3],
  };
}

function mindBodySpirit(cards, relations, question) {
  const [mind, body, spirit] = cards;
  const [mindBody, bodySpirit] = relations;
  const lead = questionLead(question);

  let p1;
  if (isInteresting(mindBody) && ['mismatch','contradiction'].includes(mindBody.type)) {
    p1 = `${lead}the first thing to notice is that your mental strategy and your lived reality are not saying the same thing. ${mind.card.name} shows ${cue(mind)} in the way you are interpreting events, while ${body.card.name} shows ${cue(body)} in what your routines, energy or behavior are actually reporting. ${relationPhrase(mindBody)}. In practice, that means your explanation of the situation may need to catch up with the evidence of living it.`;
  } else if (isInteresting(mindBody) && mindBody.type === 'reinforcement') {
    p1 = `${lead}your thinking and lived reality are pointing in the same direction. ${mind.card.name} frames the issue through ${cue(mind)}, and ${body.card.name} shows ${cue(body)} in daily life. ${relationPhrase(mindBody)}. Because the same pattern appears at both levels, it deserves more weight than a passing mood or one bad day.`;
  } else {
    p1 = `${lead}${mind.card.name} and ${body.card.name} ask you to compare the story in your head with the evidence of daily life. Your thinking is organized around ${cue(mind)}, while your lived conditions show ${cue(body)}. The cards do not prove those two levels match, so the useful move is to compare belief with behavior instead of assuming one explains the other.`;
  }

  let p2 = `${spirit.card.name} then changes the scale of the reading. Rather than asking how to manage the immediate pattern better, it asks what ${cue(spirit)} means for the values, identity or standards you want to live by.`;
  if (isInteresting(bodySpirit)) {
    p2 += ` Here, ${relationPhrase(bodySpirit)}. That suggests the practical reality is pressing on a deeper question rather than merely asking for better coping.`;
  } else {
    p2 += ` There is no strong direct bridge from Body to Spirit, so let the deeper question stand on its own instead of inventing a lesson just because the cards are adjacent.`;
  }

  const p3 = `Put simply, this spread is asking for alignment. What you believe, what you can actually sustain, and what you consider worth building your life around should not be three unrelated answers. The most useful insight is the place where one of those layers is forcing the other two to change.`;

  return {
    summary: `${mind.card.name} shows the mental strategy, ${body.card.name} shows the lived evidence, and ${spirit.card.name} asks what the situation means at the level of values or identity.`,
    synthesis: [p1,p2,p3],
  };
}

function youThemRelationship(cards, relations, question) {
  const [you, them, relationship] = cards;
  const [betweenPeople, intoPattern] = relations;
  const lead = questionLead(question);

  let p1 = `${lead}this spread is best read as two observable contributions meeting each other. ${you.card.name} puts ${cue(you)} on your side; ${them.card.name} puts ${cue(them)} on the other side. Neither card needs to be a complete description of a person—they describe what each side is currently adding to the exchange.`;
  if (isInteresting(betweenPeople)) {
    p1 += ` Between those two contributions, ${relationPhrase(betweenPeople)}.`;
  } else {
    p1 += ` There is no strong symbolic pair between them, so keep them as separate contributions instead of inventing a compatibility story.`;
  }

  let p2 = `${relationship.card.name} matters most when judging the connection itself. It points to ${cue(relationship)} as the pattern the interaction is creating, which is different from either person’s private intention.`;
  if (isInteresting(intoPattern)) {
    p2 += ` The second side feeds into that pattern strongly enough that ${relationPhrase(intoPattern)}.`;
  } else {
    p2 += ` The cards do not justify blaming that pattern on the other person alone; it belongs to the system created when both sides meet.`;
  }

  const p3 = `The useful reading is therefore not “who secretly feels what?” It is: what are you contributing, what can you actually observe from the other side, and what does the relationship keep producing regardless of intention? If you want the connection to change, start with the part of that system you can alter directly—your pacing, communication, boundaries, expectations or willingness to name the pattern out loud.`;

  return {
    summary: `${you.card.name} describes your contribution, ${them.card.name} describes the other side only through observable behavior, and ${relationship.card.name} shows the pattern the connection itself is producing.`,
    synthesis: [p1,p2,p3],
  };
}

export function buildSpreadSystem(cards, relations, positions, question='') {
  const key = positions.join('|');
  if (key === 'Past|Present|Future') return pastPresentFuture(cards, relations, question);
  if (key === 'Situation|Challenge|Advice') return situationChallengeAdvice(cards, relations, question);
  if (key === 'Mind|Body|Spirit') return mindBodySpirit(cards, relations, question);
  if (key === 'You|Them|Relationship') return youThemRelationship(cards, relations, question);

  return {
    summary: cards.map((card) => `${card.position}: ${card.card.name}`).join(' · '),
    synthesis: [
      'Read each card in its position first.',
      'Use only relationships that are strong enough to add information.',
      'Then decide what the spread changes about your understanding or next action.',
    ],
  };
}
