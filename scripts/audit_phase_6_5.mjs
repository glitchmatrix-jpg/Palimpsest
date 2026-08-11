import fs from 'node:fs';
import { TAROT_CARDS } from '../src/data/cardLibrary.js';
import { buildValidatedReading } from '../src/components/read/readEngine65.js';
import { buildEvidenceLayers } from '../src/components/read/evidenceLayers.js';

const SPREADS=[
  ['Past','Present','Future'],
  ['Situation','Challenge','Advice'],
  ['Mind','Body','Spirit'],
  ['You','Them','Relationship'],
];
const ORIENTATIONS=['upright','reversed'];
const failures=[];
let reads=0;
let zeroLayerReads=0;
let layeredReads=0;

function fail(message){ if(failures.length<300) failures.push(message); }
function entry(card,orientation='upright'){ return {card,orientation,revealed:true}; }
function norm(value=''){ return String(value).toLowerCase().replace(/[“”‘’]/g,"'").replace(/[^a-z0-9' ]+/g,' ').replace(/\s+/g,' ').trim(); }
function sentences(value=''){ return String(value).split(/(?<=[.!?])\s+/).map(norm).filter((s)=>s.split(' ').length>=5); }
function overlap(a,b){ const right=new Set(sentences(b)); return sentences(a).filter((s)=>right.has(s)); }
function occurrences(hay,needle){ const h=String(hay); const n=String(needle); if(!n) return 0; return h.split(n).length-1; }

// Layer policy: trivia is forbidden. A normal mixed spread must be allowed to have no Layers section.
{
  const sample=[entry(TAROT_CARDS.find((c)=>c.name==='The Fool')),entry(TAROT_CARDS.find((c)=>c.name==='Three of Cups')),entry(TAROT_CARDS.find((c)=>c.name==='Seven of Swords'))];
  const layers=buildEvidenceLayers(sample);
  if(layers.length!==0) fail(`ordinary mixed spread manufactured Layers: ${layers.map((l)=>l.title).join(', ')}`);
}
for(const suit of ['Cups','Swords','Wands','Pentacles']){
  const cards=TAROT_CARDS.filter((c)=>c.suit===suit).slice(0,3).map((c)=>entry(c));
  const layers=buildEvidenceLayers(cards);
  if(!layers.some((l)=>l.id===`single-suit-${suit.toLowerCase()}`)) fail(`${suit}: three-card suit concentration not recognized`);
}
{
  const majors=TAROT_CARDS.filter((c)=>c.arcana==='Major').slice(0,3).map((c)=>entry(c));
  if(!buildEvidenceLayers(majors).some((l)=>l.id==='major-concentration')) fail('three Major Arcana concentration not recognized');
}

// Stratified long-form abuse test. This deliberately mixes cards, orientations, presets and questions.
const QUESTIONS=[
  '',
  'What am I not seeing clearly about this situation?',
  'What would help me handle this relationship more constructively?',
  'What pattern is shaping my work right now?',
  'What should I understand before I make this decision?',
];
for(let ai=0;ai<TAROT_CARDS.length;ai+=2){
  for(let bi=1;bi<TAROT_CARDS.length;bi+=5){
    if(ai===bi) continue;
    const ci=(ai*19+bi*23+17)%TAROT_CARDS.length;
    if(ci===ai||ci===bi) continue;
    for(let s=0;s<SPREADS.length;s+=1){
      const mask=(ai*5+bi*7+s*11)%8;
      const entries=[0,1,2].map((bit,index)=>entry(TAROT_CARDS[[ai,bi,ci][index]],(mask&(1<<bit))?'reversed':'upright'));
      const question=QUESTIONS[(ai+bi+s)%QUESTIONS.length];
      const reading=buildValidatedReading(entries,SPREADS[s],question);
      reads+=1;
      if(reading.layers.length) layeredReads+=1; else zeroLayerReads+=1;

      const cardText=reading.cards.map((c)=>c.reading).join(' ');
      const threadText=reading.relations.filter((r)=>r.interesting).map((r)=>r.text).join(' ');
      const overallText=(reading.synthesis||[]).join(' ');
      const allText=[cardText,threadText,overallText,...(reading.reflection||[])].join(' ');

      const cardOverall=overlap(cardText,overallText);
      const threadOverall=overlap(threadText,overallText);
      if(cardOverall.length) fail(`${SPREADS[s].join('→')} ${ai}/${bi}/${ci}: Overall repeats Card sentence: ${cardOverall[0]}`);
      if(threadOverall.length) fail(`${SPREADS[s].join('→')} ${ai}/${bi}/${ci}: Overall repeats Thread sentence: ${threadOverall[0]}`);

      if(/\bundefined\b|\bnull\b|\bNaN\b|\[object Object\]/.test(allText)) fail(`${ai}/${bi}/${ci}: leaked programming value`);
      if(/\b(will definitely|will certainly|is guaranteed to|is certain to|must happen|will happen)\b/i.test(allText)) fail(`${ai}/${bi}/${ci}: deterministic future language`);
      if(SPREADS[s][2]==='Future' && !/direction|trajectory|if the current pattern|if nothing important changes|more likely|more plausible/i.test(reading.cards[2].reading+' '+overallText)) fail(`${ai}/${bi}/${ci}: Future lacks trajectory framing`);
      if(SPREADS[s][1]==='Them' && /secretly|deep down they|they definitely feel|they are thinking|their true feelings are/i.test(allText)) fail(`${ai}/${bi}/${ci}: relationship spread mind-reads the other person`);

      for(const layer of reading.layers){
        const layerText=`${layer.title} ${layer.lead} ${layer.text}`;
        if(/all upright|reversed cards|comparatively direct|blocked expression/i.test(layerText)) fail(`${ai}/${bi}/${ci}: trivia Layer returned: ${layer.title}`);
        if(!Array.isArray(layer.evidence)||layer.evidence.length<1) fail(`${ai}/${bi}/${ci}: Layer lacks evidence: ${layer.title}`);
        if(layer.text.split(/\s+/).length<22) fail(`${ai}/${bi}/${ci}: Layer too thin to justify section: ${layer.title}`);
      }

      if(question){
        const count=occurrences(overallText,question.trim());
        if(count!==1) fail(`${ai}/${bi}/${ci}: question should appear once in Overall, found ${count}`);
        if(occurrences(cardText,question.trim())>0) fail(`${ai}/${bi}/${ci}: question shoehorned into individual Card readings`);
      }

      const normalizedSentences=sentences(allText);
      const seen=new Set();
      for(const sentence of normalizedSentences){
        if(seen.has(sentence) && sentence.split(' ').length>=10) fail(`${ai}/${bi}/${ci}: duplicate long sentence across reading: ${sentence}`);
        seen.add(sentence);
      }
    }
  }
}

if(reads<5000) fail(`abuse-test coverage too small: ${reads}`);
if(zeroLayerReads===0) fail('Layers never disappear');
if(layeredReads===0) fail('Layers never appear');
if(layeredReads/reads>0.55) fail(`Layers are too eager: ${(layeredReads/reads*100).toFixed(1)}% of sampled readings render them`);

// UI/settings contract audit. Static checks make these regressions fail CI without a browser dependency.
const readSource=fs.readFileSync(new URL('../src/components/read/ReadExperience61.jsx',import.meta.url),'utf8');
const readCss=fs.readFileSync(new URL('../src/styles/read.css',import.meta.url),'utf8');
for(const token of ['allowReversals','UPRIGHT ONLY','REVERSALS ON','maxLength={QUESTION_MAX}','buildValidatedReading','hasLayers&&','reflectionNumber']){
  if(!readSource.includes(token)) fail(`Read settings/UI contract missing: ${token}`);
}
if(!/allowReversals&&Math\.random\(\)<\.5\?'reversed':'upright'/.test(readSource)) fail('digital draw does not visibly obey reversals setting');
if(!/allowReversals\?orientation:'upright'/.test(readSource)) fail('physical picker does not visibly obey reversals setting');
if(!readSource.includes("setEntries([null,null,null])")) fail('reset/reversal change does not clear cards');
if(!readSource.includes("new Set(entries.filter(Boolean).map(entry=>entry.card.id))")) fail('physical picker uniqueness protection missing');
if(!/@media\s*\([^)]*max-width/i.test(readCss)) fail('Read CSS has no mobile breakpoint');
if(!/@media\s*\(prefers-reduced-motion:\s*reduce\)/i.test(readCss)) fail('Read CSS has no reduced-motion treatment');
if(!/\.read-picker__panel[^}]*max-height:\s*88svh/i.test(readCss)) fail('picker lacks viewport-safe max height');
if(!/\.read-question textarea[^}]*width:\s*100%/i.test(readCss)) fail('question field is not responsive-width');

if(failures.length){
  console.error(`Phase 6.5 ADVERSARIAL AUDIT FAILED with ${failures.length} captured issue(s):`);
  failures.forEach((item)=>console.error(`- ${item}`));
  process.exit(1);
}

console.log(`Phase 6.5 adversarial audit passed: ${reads.toLocaleString()} complete long-form readings checked.`);
console.log(`Conditional Layers: shown in ${layeredReads.toLocaleString()} (${(layeredReads/reads*100).toFixed(1)}%); omitted in ${zeroLayerReads.toLocaleString()} (${(zeroLayerReads/reads*100).toFixed(1)}%).`);
console.log('Checks passed: cross-section repetition, future certainty, relationship mind-reading, question injection, conditional Layers, layer evidence, settings contracts, reset/picker behavior, mobile CSS and reduced motion.');
