import { TAROT_CARDS } from '../src/data/cardLibrary.js';
import { buildDeepReading } from '../src/components/read/deepReading.js';

const SPREADS = [
  ['Past','Present','Future'],
  ['Situation','Challenge','Advice'],
  ['Mind','Body','Spirit'],
  ['You','Them','Relationship'],
];
const ORIENTATIONS=['upright','reversed'];
const failures=[];
let reads=0;

function fail(message){ if(failures.length<220) failures.push(message); }
function entry(card,orientation){ return {card,orientation,revealed:true}; }
function norm(value=''){ return String(value||'').toLowerCase().replace(/[“”‘’]/g,"'").replace(/[^a-z0-9' ]+/g,' ').replace(/\s+/g,' ').trim(); }
function sentences(value=''){ return String(value||'').split(/(?<=[.!?])\s+/).map(norm).filter(Boolean); }
function card(name){ const found=TAROT_CARDS.find((item)=>item.name===name); if(!found) throw new Error(`Missing ${name}`); return found; }

const forbiddenGeneric=[
  'the visible movement is',
  'whether the pair relationships are strong or weak',
  'where the thread finds a strong connection',
  'the positional logic still matters',
  'without assuming every transition must contain a hidden message',
];

// Deterministic broad corpus: every card appears repeatedly in every slot, orientation and spread.
for(let a=0;a<TAROT_CARDS.length;a+=1){
  for(let offset=1;offset<=9;offset+=1){
    const b=(a+offset*7)%TAROT_CARDS.length;
    let c=(a+offset*19+11)%TAROT_CARDS.length;
    if(b===a) continue;
    if(c===a||c===b) c=(c+13)%TAROT_CARDS.length;
    if(c===a||c===b) continue;

    const perSpread=[];
    for(let s=0;s<SPREADS.length;s+=1){
      const positions=SPREADS[s];
      const mask=(a*5+offset*3+s)%8;
      const orientations=[0,1,2].map((bit)=>(mask&(1<<bit))?ORIENTATIONS[1]:ORIENTATIONS[0]);
      const entries=[entry(TAROT_CARDS[a],orientations[0]),entry(TAROT_CARDS[b],orientations[1]),entry(TAROT_CARDS[c],orientations[2])];
      const reading=buildDeepReading(entries,positions,'What is most useful to understand here?');
      reads+=1;
      perSpread.push(reading);
      const label=`${entries.map((e)=>e.card.name).join(' → ')} / ${positions.join('→')}`;

      if(!reading.summary?.trim()) fail(`${label}: missing summary`);
      if(!Array.isArray(reading.synthesis)||reading.synthesis.length!==3) fail(`${label}: synthesis must have exactly 3 paragraphs`);
      for(const [i,p] of (reading.synthesis||[]).entries()){
        if(p.split(/\s+/).length<35) fail(`${label}: synthesis paragraph ${i+1} too thin`);
        for(const phrase of forbiddenGeneric){ if(norm(p).includes(norm(phrase))) fail(`${label}: old generic synthesis phrase survived: ${phrase}`); }
      }
      const synthesisText=(reading.synthesis||[]).join(' ');
      if(!norm(synthesisText).includes(norm(TAROT_CARDS[a].name))||!norm(synthesisText).includes(norm(TAROT_CARDS[b].name))||!norm(synthesisText).includes(norm(TAROT_CARDS[c].name))) fail(`${label}: overall reading lost a card name`);
      if(!norm(reading.synthesis?.[0]).includes('what is most useful to understand here')) fail(`${label}: question not grounded in opening synthesis`);

      const synSentences=(reading.synthesis||[]).flatMap(sentences);
      if(new Set(synSentences).size!==synSentences.length) fail(`${label}: duplicate synthesis sentence`);

      // Overall Reading may use relation metadata, but must not paste The Thread explanation back verbatim.
      for(const relation of reading.relations||[]){
        if(relation.interesting && relation.text && norm(synthesisText).includes(norm(relation.text))) fail(`${label}: Overall Reading repeats Thread prose verbatim`);
      }

      const key=positions.join('|');
      const text=norm(synthesisText);
      if(key==='Past|Present|Future'){
        if(!/background|past/.test(text)||!/present|active now/.test(text)||!/future|direction/.test(text)) fail(`${label}: temporal grammar missing`);
        if(/guaranteed|definitely will|will certainly/.test(text)) fail(`${label}: future became deterministic`);
      }
      if(key==='Situation|Challenge|Advice'){
        if(!/situation/.test(text)||!/challenge|difficulty|friction/.test(text)||!/advice|response|test/.test(text)) fail(`${label}: diagnosis→friction→response grammar missing`);
      }
      if(key==='Mind|Body|Spirit'){
        if(!/mind|mental/.test(text)||!/body|lived|daily/.test(text)||!/spirit|value|identity|deeper/.test(text)) fail(`${label}: mind/body/spirit grammar missing`);
      }
      if(key==='You|Them|Relationship'){
        if(!/your side|you are bringing|stance/.test(text)||!/other side|other person|observable/.test(text)||!/relationship|connection|interaction/.test(text)) fail(`${label}: relationship grammar missing`);
        if(/knows that|secretly wants|secretly feels|is definitely thinking/.test(text)) fail(`${label}: relationship spread mind-reads`);
      }
    }

    const normalizedSystems=perSpread.map((r)=>norm(r.synthesis.join(' ')));
    if(new Set(normalizedSystems).size!==4) fail(`${TAROT_CARDS[a].name}/${TAROT_CARDS[b].name}/${TAROT_CARDS[c].name}: spread systems collapsed to identical synthesis`);
    const normalizedSummaries=perSpread.map((r)=>norm(r.summary));
    if(new Set(normalizedSummaries).size!==4) fail(`${TAROT_CARDS[a].name}/${TAROT_CARDS[b].name}/${TAROT_CARDS[c].name}: spread summaries collapsed to identical text`);
  }
}

// Gold-standard motivating example.
{
  const entries=[
    entry(card('Knight of Pentacles'),'upright'),
    entry(card('Queen of Cups'),'reversed'),
    entry(card('Page of Swords'),'upright'),
  ];
  const reading=buildDeepReading(entries,['Mind','Body','Spirit'],'What is happening in my life?');
  const text=norm(reading.synthesis.join(' '));
  if(!/mismatch/.test(text)) fail('gold example: missing mind/body mismatch');
  if(!/consistency/.test(text)||!/overgiving/.test(text)||!/curiosity/.test(text)) fail('gold example: lost core card themes');
  if(!/mental strategy|mind wants|mental system/.test(text)) fail('gold example: Mind card not functioning as mental strategy');
  if(!/lived reality|actual capacity|daily life/.test(text)) fail('gold example: Body card not functioning as lived evidence');
  if(!/values|identity|deeper task|deeper question/.test(text)) fail('gold example: Spirit card not functioning as deeper frame');
  if(!/endure|revise|maintain/.test(text)) fail('gold example: synthesis does not reach a practical interpretive conclusion');
  for(const relation of reading.relations){ if(relation.interesting&&norm(reading.synthesis.join(' ')).includes(norm(relation.text))) fail('gold example: synthesis pasted Thread relation text'); }
}

if(failures.length){
  console.error(`Phase 6.4 SPREAD-SYSTEM AUDIT FAILED with ${failures.length} captured issue(s):`);
  failures.forEach((item)=>console.error(`- ${item}`));
  process.exit(1);
}

console.log(`Phase 6.4 spread-system audit passed: ${reads.toLocaleString()} full readings checked across all four presets.`);
console.log('Checks passed: preset-specific grammar, question grounding, non-repetition, non-deterministic futures, relationship safety, three-paragraph synthesis, cross-preset differentiation and gold-example quality.');
