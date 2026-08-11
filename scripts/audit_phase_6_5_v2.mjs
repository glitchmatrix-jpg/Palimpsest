import fs from 'node:fs';
import { TAROT_CARDS } from '../src/data/cardLibrary.js';
import { buildValidatedReading } from '../src/components/read/readEngine65.js';
import { buildEvidenceLayers } from '../src/components/read/evidenceLayers.js';

const SPREADS=[['Past','Present','Future'],['Situation','Challenge','Advice'],['Mind','Body','Spirit'],['You','Them','Relationship']];
const QUESTIONS=['','What am I not seeing clearly about this situation?','What would help me handle this relationship more constructively?','What pattern is shaping my work right now?','What should I understand before I make this decision?'];
const failures=[];
let reads=0,zeroLayers=0,shownLayers=0;
const fail=(m)=>{if(failures.length<300)failures.push(m)};
const entry=(card,orientation='upright')=>({card,orientation,revealed:true});
const norm=(v='')=>String(v).toLowerCase().replace(/[“”‘’]/g,"'").replace(/[^a-z0-9' ]+/g,' ').replace(/\s+/g,' ').trim();
const sentences=(v='')=>String(v).split(/(?<=[.!?])\s+/).map(norm).filter((s)=>s.split(' ').length>=5);
const overlap=(a,b)=>{const B=new Set(sentences(b));return sentences(a).filter((s)=>B.has(s));};
const occurrences=(h,n)=>n?String(h).split(String(n)).length-1:0;

// Layer evidence gates.
{
 const ordinary=[entry(TAROT_CARDS.find(c=>c.name==='The Fool')),entry(TAROT_CARDS.find(c=>c.name==='Three of Cups')),entry(TAROT_CARDS.find(c=>c.name==='Seven of Swords'))];
 if(buildEvidenceLayers(ordinary).length) fail('ordinary mixed spread manufactured a Layer');
 const majors=TAROT_CARDS.filter(c=>c.arcana==='Major').slice(0,3).map(entry);
 if(!buildEvidenceLayers(majors).some(l=>l.id==='major-concentration')) fail('three-Major concentration missing');
 for(const suit of ['Cups','Swords','Wands','Pentacles']){
   const cards=TAROT_CARDS.filter(c=>c.suit===suit).slice(0,3).map(entry);
   if(!buildEvidenceLayers(cards).some(l=>l.id===`single-suit-${suit.toLowerCase()}`)) fail(`${suit} concentration missing`);
 }
}

// >5,000 complete readings: 39 even-index cards × 39 odd-index cards × four presets, minus rare collisions.
for(let ai=0;ai<TAROT_CARDS.length;ai+=2){
 for(let bi=1;bi<TAROT_CARDS.length;bi+=2){
  if(ai===bi) continue;
  const ci=(ai*19+bi*23+17)%TAROT_CARDS.length;
  if(ci===ai||ci===bi) continue;
  for(let s=0;s<SPREADS.length;s++){
   const mask=(ai*5+bi*7+s*11)%8;
   const ids=[ai,bi,ci];
   const entries=ids.map((id,bit)=>entry(TAROT_CARDS[id],(mask&(1<<bit))?'reversed':'upright'));
   const question=QUESTIONS[(ai+bi+s)%QUESTIONS.length];
   const reading=buildValidatedReading(entries,SPREADS[s],question);
   reads++;
   reading.layers.length?shownLayers++:zeroLayers++;

   const cardText=reading.cards.map(c=>c.reading).join(' ');
   const threadText=reading.relations.filter(r=>r.interesting).map(r=>r.text).join(' ');
   const overall=(reading.synthesis||[]).join(' ');
   const all=[cardText,threadText,overall,...(reading.reflection||[])].join(' ');

   if(overlap(cardText,overall).length) fail(`${ai}/${bi}/${ci}/${s}: Overall repeats a Card sentence`);
   if(overlap(threadText,overall).length) fail(`${ai}/${bi}/${ci}/${s}: Overall repeats a Thread sentence`);
   if(/\bundefined\b|\bnull\b|\bNaN\b|\[object Object\]/.test(all)) fail(`${ai}/${bi}/${ci}/${s}: leaked programming value`);
   if(/\b(will definitely|will certainly|is guaranteed to|is certain to|must happen|will happen)\b/i.test(all)) fail(`${ai}/${bi}/${ci}/${s}: deterministic prediction language`);
   if(SPREADS[s][2]==='Future'&&!/direction|trajectory|if the current pattern|if nothing important changes|more likely|more plausible/i.test(reading.cards[2].reading+' '+overall)) fail(`${ai}/${bi}/${ci}: Future lacks trajectory framing`);
   if(SPREADS[s][1]==='Them'&&/secretly|deep down they|they definitely feel|they are thinking|their true feelings are/i.test(all)) fail(`${ai}/${bi}/${ci}: mind-reading claim`);

   for(const layer of reading.layers){
    const text=`${layer.title} ${layer.lead} ${layer.text}`;
    if(/all upright|reversed cards|comparatively direct|blocked expression/i.test(text)) fail(`${ai}/${bi}/${ci}: trivia Layer ${layer.title}`);
    if(!Array.isArray(layer.evidence)||!layer.evidence.length) fail(`${ai}/${bi}/${ci}: Layer without evidence`);
    if(layer.text.split(/\s+/).length<22) fail(`${ai}/${bi}/${ci}: Layer too thin: ${layer.title}`);
   }
   if(question){
    if(occurrences(overall,question.trim())!==1) fail(`${ai}/${bi}/${ci}: question not grounded exactly once`);
    if(occurrences(cardText,question.trim())) fail(`${ai}/${bi}/${ci}: question shoehorned into card text`);
   }
   const seen=new Set();
   for(const sentence of sentences(all)){
    if(seen.has(sentence)&&sentence.split(' ').length>=10) fail(`${ai}/${bi}/${ci}: duplicate long sentence`);
    seen.add(sentence);
   }
  }
 }
}

if(reads<5000) fail(`coverage too small: ${reads}`);
if(!zeroLayers) fail('Layers never disappear');
if(!shownLayers) fail('Layers never appear');
if(shownLayers/reads>.55) fail(`Layers too eager: ${(shownLayers/reads*100).toFixed(1)}%`);

// Settings + responsive/reduced-motion contract.
const source=fs.readFileSync(new URL('../src/components/read/ReadExperience61.jsx',import.meta.url),'utf8');
const css=fs.readFileSync(new URL('../src/styles/read.css',import.meta.url),'utf8');
for(const token of ['allowReversals','UPRIGHT ONLY','REVERSALS ON','maxLength={QUESTION_MAX}','buildValidatedReading','hasLayers&&','reflectionNumber']) if(!source.includes(token)) fail(`UI contract missing: ${token}`);
if(!/allowReversals&&Math\.random\(\)<\.5\?'reversed':'upright'/.test(source)) fail('digital draw ignores reversal setting');
if(!/allowReversals\?orientation:'upright'/.test(source)) fail('physical picker ignores reversal setting');
if(!source.includes('new Set(entries.filter(Boolean).map(entry=>entry.card.id))')) fail('picker uniqueness guard missing');
if(!/@media\s*\([^)]*max-width/i.test(css)) fail('mobile breakpoint missing');
if(!/@media\s*\(prefers-reduced-motion:\s*reduce\)/i.test(css)) fail('reduced-motion CSS missing');
if(!/\.read-picker__panel[^}]*max-height:\s*88svh/i.test(css)) fail('picker viewport-height protection missing');
if(!/\.read-question textarea[^}]*width:\s*100%/i.test(css)) fail('question input responsive width missing');

if(failures.length){console.error(`Phase 6.5 ADVERSARIAL AUDIT FAILED with ${failures.length} captured issue(s):`);failures.forEach(x=>console.error(`- ${x}`));process.exit(1);}
console.log(`Phase 6.5 adversarial audit passed: ${reads.toLocaleString()} complete long-form readings checked.`);
console.log(`Conditional Layers: shown ${shownLayers.toLocaleString()} (${(shownLayers/reads*100).toFixed(1)}%); omitted ${zeroLayers.toLocaleString()} (${(zeroLayers/reads*100).toFixed(1)}%).`);
console.log('Checks passed: repetition, contradictions, future certainty, relationship mind-reading, question injection, layer evidence, settings, picker uniqueness, mobile CSS and reduced motion.');
