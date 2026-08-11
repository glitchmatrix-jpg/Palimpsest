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
  if (type === 'mismatch' || type === 'contradiction') return `The strongest tension is ${axis}`;
  if (type === 'correction') return `The clearest corrective movement is ${axis}`;
  if (type === 'reinforcement') return `The cards reinforce ${axis}`;
  if (type === 'cause → effect') return `The strongest causal link is ${axis}`;
  if (type === 'escalation') return `The pressure intensifies through ${axis}`;
  if (type === 'Major ↔ Minor') return `The same issue moves between a larger principle and lived reality through ${axis}`;
  return `The strongest direct link is ${axis}`;
}

function pastPresentFuture(cards, relations, question) {
  const [past, present, future] = cards;
  const [intoPresent, intoFuture] = relations;
  const lead = questionLead(question);

  let p1 = `${lead}${past.card.name} places ${past.keyword} in the background of the story, while ${present.card.name} makes ${present.keyword} the condition that is active now. `;
  if (isInteresting(intoPresent)) {
    p1 += `${relationPhrase(intoPresent)}. That means the past matters here because it helps explain the shape the present has taken, not simply because it happened first.`;
  } else {
    p1 += `There is no strong enough direct link to claim that one caused the other, so treat the past as context and judge the present on its own evidence.`;
  }

  let p2 = `${present.card.name} is the hinge of this spread. `;
  if (isInteresting(intoFuture)) {
    p2 += `${relationPhrase(intoFuture)}. ${future.card.name} therefore reads as a development emerging from what is active now, not as an isolated prediction.`;
  } else {
    p2 += `${future.card.name} still gives the direction ahead through ${future.keyword}, but the cards do not justify pretending there is a neat causal bridge from the present to that outcome.`;
  }

  const p3 = `Put simply: something shaped by ${past.keyword} has brought you to a present organized around ${present.keyword}. If the current pattern continues, ${future.keyword} becomes increasingly relevant. The useful question is not “will ${future.card.name} happen?” but “what in the present is making that direction more or less likely?”`;

  return {
    summary: `${past.keyword} shaped the background; ${present.keyword} is active now; ${future.keyword} is the direction to watch if the current pattern continues.`,
    synthesis: [p1,p2,p3],
  };
}

function situationChallengeAdvice(cards, relations, question) {
  const [situation, challenge, advice] = cards;
  const [intoChallenge, intoAdvice] = relations;
  const lead = questionLead(question);

  let p1 = `${lead}${situation.card.name} says the situation is fundamentally about ${situation.keyword}; ${challenge.card.name} says the difficulty is ${challenge.keyword}. `;
  if (isInteresting(intoChallenge)) {
    p1 += `${relationPhrase(intoChallenge)}. This is useful because it tells you how the basic situation turns into friction rather than treating the Challenge card as a second, unrelated problem.`;
  } else {
    p1 += `The two cards do not form a strong direct relationship, so do not force the challenge to be “caused” by the situation. It may be a separate pressure that still has to be handled.`;
  }

  let p2 = `${advice.card.name} shifts the reading from diagnosis to response: ${advice.keyword} is what you are being asked to try, practice, protect or change. `;
  if (isInteresting(intoAdvice)) {
    p2 += `${relationPhrase(intoAdvice)}. The advice earns its place because it answers something specific in the difficulty rather than offering a generic positive quality.`;
  } else {
    p2 += `There is no strong pair link tying it neatly to the Challenge card, so use the advice on its own terms and judge whether it actually improves the situation in practice.`;
  }

  const p3 = `Put simply: name ${situation.keyword} accurately, stop treating ${challenge.keyword} as a side issue, and test ${advice.keyword} as the response. This spread is useful only if the advice changes what you do, not merely how elegantly you can describe the problem.`;

  return {
    summary: `The situation centers on ${situation.keyword}; ${challenge.keyword} is the friction; ${advice.keyword} is the response to test.`,
    synthesis: [p1,p2,p3],
  };
}

function mindBodySpirit(cards, relations, question) {
  const [mind, body, spirit] = cards;
  const [mindBody, bodySpirit] = relations;
  const lead = questionLead(question);

  let p1;
  if (isInteresting(mindBody) && ['mismatch','contradiction'].includes(mindBody.type)) {
    p1 = `${lead}The first thing that stands out is a mismatch between how you are trying to understand the situation and what your lived reality is showing you. ${mind.card.name} puts ${mind.keyword} in the Mind position; ${body.card.name} puts ${body.keyword} in the Body position. ${relationPhrase(mindBody)}. In plain terms, your mental strategy may be asking one thing of you while your actual capacity, habits or behaviour are reporting something else.`;
  } else if (isInteresting(mindBody) && mindBody.type === 'reinforcement') {
    p1 = `${lead}Your thinking and lived reality appear to be reinforcing the same pattern. ${mind.card.name} frames the issue through ${mind.keyword}, and ${body.card.name} shows ${body.keyword} in what you are actually living. ${relationPhrase(mindBody)}. That makes this harder to dismiss as “just in your head” or “just circumstances”; the pattern is showing up at both levels.`;
  } else {
    p1 = `${lead}${mind.card.name} shows a mental approach built around ${mind.keyword}, while ${body.card.name} shows ${body.keyword} in lived reality. The cards do not prove those two levels are aligned. Compare what you believe is happening with what your energy, routines, choices and actual circumstances are showing you.`;
  }

  let p2 = `${spirit.card.name} changes the scale of the reading. The Spirit position is not asking for another description of the problem; it asks what ${spirit.keyword} means for your values, identity or definition of a life that actually fits you. `;
  if (isInteresting(bodySpirit)) {
    p2 += `${relationPhrase(bodySpirit)}. That suggests the practical reality is pushing you toward a deeper reconsideration rather than merely demanding better coping.`;
  } else {
    p2 += `There is no strong direct bridge from the Body card, so let this deeper question stand on its own instead of manufacturing a lesson from adjacency.`;
  }

  let p3;
  if (isInteresting(mindBody) && mindBody.type === 'mismatch') {
    p3 = `Put simply: your mind wants ${mind.keyword}, your lived experience is showing ${body.keyword}, and the deeper task is ${spirit.keyword}. The reading is asking whether the mental system you are trying to maintain still fits the life you are actually living — and whether ${spirit.keyword} requires you to revise that system rather than simply endure it better.`;
  } else {
    p3 = `Put simply: compare ${mind.keyword} as the story in your head with ${body.keyword} as the evidence of daily life, then ask what ${spirit.keyword} requires at the level of values. The useful insight is whatever becomes clearer when belief, lived reality and meaning are read together instead of treated as three separate topics.`;
  }

  return {
    summary: `Your mind is working through ${mind.keyword}; your lived reality shows ${body.keyword}; underneath both is a deeper question about ${spirit.keyword}.`,
    synthesis: [p1,p2,p3],
  };
}

function youThemRelationship(cards, relations, question) {
  const [you, them, relationship] = cards;
  const [betweenPeople, intoPattern] = relations;
  const lead = questionLead(question);

  let p1 = `${lead}${you.card.name} describes the stance you are bringing through ${you.keyword}. ${them.card.name} describes ${them.keyword} only as an observable stance on the other side — what their behaviour, choices, communication or avoidance appears to show. `;
  if (isInteresting(betweenPeople)) {
    p1 += `${relationPhrase(betweenPeople)}. That gives you a useful point of comparison between the two sides without pretending the cards reveal anyone's private thoughts.`;
  } else {
    p1 += `There is no strong direct relationship between those two cards, so do not force the two people into a neat opposition or compatibility story.`;
  }

  let p2 = `${relationship.card.name} is the most important card for judging the connection itself. It says the interaction is producing a pattern of ${relationship.keyword}; that pattern is different from either person's individual intentions. `;
  if (isInteresting(intoPattern)) {
    p2 += `${relationPhrase(intoPattern)}. This is where an individual stance appears to feed into the relationship climate strongly enough to matter.`;
  } else {
    p2 += `The other person's card does not form a strong enough direct link to claim it creates the relationship pattern by itself; the dynamic belongs to the interaction between both sides.`;
  }

  const p3 = `Put simply: you are bringing ${you.keyword}, the other side appears to be bringing ${them.keyword}, and together the connection is producing ${relationship.keyword}. The practical question is not “who secretly feels what?” but “what repeated interaction creates this pattern, and what can you change on your side without requiring the other person to become someone different first?”`;

  return {
    summary: `You are bringing ${you.keyword}; the other side appears to bring ${them.keyword}; the relationship itself is producing ${relationship.keyword}.`,
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
    summary: cards.map((card) => `${card.position}: ${card.keyword}`).join(' · '),
    synthesis: [`Read each card in its position first.`, `Use only relationships that are strong enough to add information.`, `Then decide what the spread changes about your understanding or next action.`],
  };
}
