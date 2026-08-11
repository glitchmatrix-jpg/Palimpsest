import { TAROT_CARDS } from '../src/data/cardLibrary.js';
import { buildPairRelation, MIN_RELATION_SCORE } from '../src/components/read/combinationIntelligence.js';

const ORIENTATIONS=['upright','reversed'];
const TRANSITIONS=[
  ['Past','Present'],['Present','Future'],
  ['Situation','Challenge'],['Challenge','Advice'],
  ['Mind','Body'],['Body','Spirit'],
  ['You','Them'],['Them','Relationship'],
];

const failures=[];
const typeCounts=new Map();
let total=0;
let interesting=0;
let absent=0;

function fail(message){ failures.push(message); }
function entry(card,orientation){ return {card,orientation,revealed:true}; }
function card(name){ const found=TAROT_CARDS.find((item)=>item.name===name); if(!found) throw new Error(`Missing card ${name}`); return found; }
function normalized(value=''){ return String(value).toLowerCase().replace(/[^a-z0-9 ]+/g,' ').replace(/\s+/g,' ').trim(); }
function cloneRelation(value){ return JSON.stringify(value); }

const bannedTypes=new Set(['change in expression','shift in expression','same domain','generic progression']);
const bannedPhrases=[
  'orientation changes between',
  'orientation changed',
  'the issue moves between direct expression',
  'both cards stay in',
  'the second card changes the problem introduced by the first',
  'read them as cause and development: the first creates the conditions',
];

for(const aCard of TAROT_CARDS){
  for(const bCard of TAROT_CARDS){
    if(aCard.id===bCard.id) continue;
    for(const aOrientation of ORIENTATIONS){
      for(const bOrientation of ORIENTATIONS){
        const a=entry(aCard,aOrientation);
        const b=entry(bCard,bOrientation);
        for(const [from,to] of TRANSITIONS){
          total+=1;
          const relation=buildPairRelation(a,b,from,to);
          const again=buildPairRelation(a,b,from,to);
          const label=`${aCard.name} ${aOrientation} → ${bCard.name} ${bOrientation} / ${from}→${to}`;

          if(cloneRelation(relation)!==cloneRelation(again)) fail(`${label}: non-deterministic result`);
          if(typeof relation.interesting!=='boolean') fail(`${label}: missing interesting boolean`);
          if(!Array.isArray(relation.evidence)) fail(`${label}: evidence is not an array`);
          if(!Array.isArray(relation.considered)) fail(`${label}: considered candidates missing`);

          if(relation.interesting){
            interesting+=1;
            typeCounts.set(relation.type,(typeCounts.get(relation.type)||0)+1);
            if(relation.score<MIN_RELATION_SCORE) fail(`${label}: interesting relation below threshold (${relation.score})`);
            if(!relation.type || relation.type==='no strong relationship') fail(`${label}: invalid interesting type`);
            if(bannedTypes.has(relation.type)) fail(`${label}: deprecated generic type ${relation.type}`);
            if(!relation.axis?.trim()) fail(`${label}: missing axis`);
            if(!relation.text?.trim()) fail(`${label}: missing text`);
            if(relation.text.split(/\s+/).length<24) fail(`${label}: relationship explanation too thin`);
            const hay=normalized(relation.text);
            for(const phrase of bannedPhrases){ if(hay.includes(normalized(phrase))) fail(`${label}: contains deprecated generic language: ${phrase}`); }
            if(relation.evidence.length===1 && /orientation|suit/i.test(relation.evidence[0])) fail(`${label}: relation is based only on a weak modifier`);
            if(!relation.evidence.some((ev)=>/curated|semantic|axis|court|number|major\/minor|topology|intensity/i.test(ev))) fail(`${label}: no substantive evidence: ${relation.evidence.join(', ')}`);
            if(/reversed/i.test(relation.text) && !hay.includes(normalized(aCard.name)) && !hay.includes(normalized(bCard.name))) fail(`${label}: reversal modifier is not tied to a specific card`);
          }else{
            absent+=1;
            if(relation.type!=='no strong relationship') fail(`${label}: uninteresting result has type ${relation.type}`);
            if(relation.text!=='' || relation.axis!=='') fail(`${label}: weak relation manufactures explanatory content`);
          }
        }
      }
    }
  }
}

const expected=78*77*4*8;
if(total!==expected) fail(`coverage mismatch: ${total} generated, expected ${expected}`);
if(TAROT_CARDS.length!==78) fail(`deck mismatch: ${TAROT_CARDS.length}`);
if(interesting===0) fail('engine produced no interesting relationships');
if(absent===0) fail('engine never declines a relationship; weak-pair suppression is broken');
const ratio=interesting/total;
if(ratio>0.80) fail(`engine is over-eager: ${(ratio*100).toFixed(1)}% of all pair contexts are called interesting`);
if(ratio<0.08) fail(`engine is under-responsive: only ${(ratio*100).toFixed(1)}% of pair contexts are called interesting`);

// User's motivating example: the scorer must choose semantic/positional intelligence,
// never the mere fact that orientation changed.
{
  const a=entry(card('Knight of Pentacles'),'upright');
  const b=entry(card('Queen of Cups'),'reversed');
  const rel=buildPairRelation(a,b,'Mind','Body');
  if(!rel.interesting) fail('Knight of Pentacles → Queen of Cups reversed should be interesting');
  if(rel.type!=='mismatch') fail(`Knight → Queen example chose ${rel.type}, expected mismatch`);
  if(!/controlled responsibility|dependable|responsib/i.test(rel.text)) fail('Knight → Queen example misses responsibility/control');
  if(!/overgiving|emotional overextension|emotional absorption/i.test(rel.text)) fail('Knight → Queen example misses emotional depletion');
  if(/orientation change|change in expression/i.test(rel.text)) fail('Knight → Queen example fell back to orientation change');
}

{
  const a=entry(card('Queen of Cups'),'reversed');
  const b=entry(card('Page of Swords'),'upright');
  const rel=buildPairRelation(a,b,'Body','Spirit');
  if(!rel.interesting) fail('Queen of Cups reversed → Page of Swords should be interesting');
  if(rel.type!=='correction') fail(`Queen → Page example chose ${rel.type}, expected correction`);
  if(!/ask|question|inquiry|curiosity/i.test(rel.text)) fail('Queen → Page example fails to introduce inquiry');
  if(!/responsible|assuming|information|boundary/i.test(rel.text)) fail('Queen → Page example lacks useful corrective questions');
}

// Strong symbolic pairs must remain direction-aware.
for(const [aName,bName,type] of [
  ['The Moon','The Sun','contrast'],
  ['The Tower','The Star','recovery'],
  ['Death','Temperance','integration'],
  ['The Devil','The Tower','exposure'],
  ['The Lovers','The Chariot','commitment'],
  ['The Hanged Man','Death','release'],
  ['Ten of Wands','Four of Swords','correction'],
]){
  const forward=buildPairRelation(entry(card(aName),'upright'),entry(card(bName),'upright'),'Present','Future');
  const reverse=buildPairRelation(entry(card(bName),'upright'),entry(card(aName),'upright'),'Present','Future');
  if(!forward.interesting || forward.type!==type) fail(`${aName} → ${bName}: curated pair did not win (${forward.type})`);
  if(!reverse.interesting) fail(`${bName} → ${aName}: reverse curated direction disappeared`);
  if(normalized(forward.text)===normalized(reverse.text)) fail(`${aName} ↔ ${bName}: direction-aware text is identical`);
}

// Position is part of the relationship. The same cards should not be explained
// identically when their roles change.
{
  const a=entry(card('Knight of Pentacles'),'upright');
  const b=entry(card('Queen of Cups'),'reversed');
  const mindBody=buildPairRelation(a,b,'Mind','Body');
  const pastPresent=buildPairRelation(a,b,'Past','Present');
  if(mindBody.interesting && pastPresent.interesting && normalized(mindBody.text)===normalized(pastPresent.text)) fail('position-aware pair text collapsed to identical output');
}

// Orientation may modify a strong relation, but orientation alone must never be the evidence.
let orientationOnly=0;
for(const aCard of TAROT_CARDS.slice(0,20)){
  for(const bCard of TAROT_CARDS.slice(20,40)){
    const relation=buildPairRelation(entry(aCard,'upright'),entry(bCard,'reversed'),'Present','Future');
    if(relation.interesting && relation.evidence.every((ev)=>/orientation|modifier|suit/i.test(ev))) orientationOnly+=1;
  }
}
if(orientationOnly) fail(`${orientationOnly} sampled relations were justified only by orientation/suit modifiers`);

if(failures.length){
  console.error(`Phase 6.3 DEEP AUDIT FAILED with ${failures.length} issue(s):`);
  failures.slice(0,140).forEach((item)=>console.error(`- ${item}`));
  if(failures.length>140) console.error(`...and ${failures.length-140} more.`);
  process.exit(1);
}

console.log(`Phase 6.3 deep audit passed: ${total.toLocaleString()} ordered pair contexts checked.`);
console.log(`Interesting relationships: ${interesting.toLocaleString()} (${(ratio*100).toFixed(1)}%); intentionally declined: ${absent.toLocaleString()} (${((absent/total)*100).toFixed(1)}%).`);
console.log(`Relationship types exercised: ${[...typeCounts.entries()].sort((a,b)=>b[1]-a[1]).map(([type,count])=>`${type}=${count}`).join(', ')}.`);
console.log('Checks passed: ranking, semantic evidence, curated pairs, directionality, position context, reversals as modifiers, weak-pair suppression, determinism and exhaustive pair coverage.');
