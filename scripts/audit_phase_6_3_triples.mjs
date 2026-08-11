import { TAROT_CARDS } from '../src/data/cardLibrary.js';
import { buildPairRelation } from '../src/components/read/combinationIntelligence.js';
import { buildDeepReading } from '../src/components/read/deepReading.js';

const ORIENTATIONS=['upright','reversed'];
const SPREADS=[
  ['Past','Present','Future'],
  ['Situation','Challenge','Advice'],
  ['Mind','Body','Spirit'],
  ['You','Them','Relationship'],
];
const failures=[];
const warnings=[];
const relationCache=new Map();
const shapeCounts={0:0,1:0,2:0};
const typePairs=new Map();
let triples=0;
let fullReads=0;

function fail(message){ if(failures.length<300) failures.push(message); }
function warn(message){ if(warnings.length<100) warnings.push(message); }
function entry(card,orientation){ return {card,orientation,revealed:true}; }
function norm(value=''){ return String(value).toLowerCase().replace(/[“”‘’]/g,"'").replace(/[^a-z0-9' ]+/g,' ').replace(/\s+/g,' ').trim(); }
function sentences(value=''){ return String(value).split(/(?<=[.!?])\s+/).map(norm).filter(Boolean); }
function key(a,ao,b,bo,from,to){ return `${a.id}|${ao}|${b.id}|${bo}|${from}|${to}`; }

// Precompute every relation needed by every spread transition exactly once.
for(const positions of SPREADS){
  for(let t=0;t<2;t+=1){
    const from=positions[t], to=positions[t+1];
    for(const a of TAROT_CARDS){
      for(const b of TAROT_CARDS){
        if(a.id===b.id) continue;
        for(const ao of ORIENTATIONS){
          for(const bo of ORIENTATIONS){
            const relation=buildPairRelation(entry(a,ao),entry(b,bo),from,to);
            relationCache.set(key(a,ao,b,bo,from,to),relation);

            // Curated symbolic prose must not silently assume upright meanings for reversed cards.
            if((ao==='reversed'||bo==='reversed') && relation.interesting && relation.evidence?.includes('curated') && relation.evidence?.includes('symbolic')){
              fail(`${a.name} ${ao} → ${b.name} ${bo} / ${from}→${to}: upright-style curated symbolic relation won despite reversal`);
            }
            // Orientation-specific curated prose already accounts for the reversal; it must not get a second generic modifier.
            if(relation.interesting && relation.evidence?.includes('orientation-specific') && relation.evidence?.includes('supporting modifier')){
              fail(`${a.name} ${ao} → ${b.name} ${bo} / ${from}→${to}: orientation-specific curated relation received redundant modifier`);
            }
          }
        }
      }
    }
  }
}

// Exhaustively combine the cached links into every distinct ordered three-card spread.
for(const positions of SPREADS){
  const [p0,p1,p2]=positions;
  for(const a of TAROT_CARDS){
    for(const b of TAROT_CARDS){
      if(b.id===a.id) continue;
      for(const c of TAROT_CARDS){
        if(c.id===a.id || c.id===b.id) continue;
        for(const ao of ORIENTATIONS){
          for(const bo of ORIENTATIONS){
            for(const co of ORIENTATIONS){
              triples+=1;
              const r1=relationCache.get(key(a,ao,b,bo,p0,p1));
              const r2=relationCache.get(key(b,bo,c,co,p1,p2));
              const active=[r1,r2].filter((r)=>r.interesting);
              shapeCounts[active.length]+=1;

              if(active.length===2){
                const pairKey=`${r1.type}|${r2.type}`;
                typePairs.set(pairKey,(typePairs.get(pairKey)||0)+1);
                if(norm(r1.text)===norm(r2.text)) fail(`${a.name} → ${b.name} → ${c.name} / ${positions.join('→')}: duplicate Thread explanations`);
                if(norm(r1.axis)===norm(r2.axis) && r1.type===r2.type && !['reinforcement','number progression','number regression','court development','court reset'].includes(r1.type)){
                  warn(`${a.name} → ${b.name} → ${c.name}: repeated ${r1.type} axis ${r1.axis}`);
                }
              }
            }
          }
        }
      }
    }
  }
}

const expected=78*77*76*8*4;
if(triples!==expected) fail(`triple coverage mismatch: ${triples}, expected ${expected}`);
const totalShapes=shapeCounts[0]+shapeCounts[1]+shapeCounts[2];
if(totalShapes!==triples) fail(`shape accounting mismatch: ${totalShapes} vs ${triples}`);
if(shapeCounts[0]===0) fail('engine never produces a full spread with zero direct links');
if(shapeCounts[1]===0) fail('engine never produces a full spread with exactly one direct link');
if(shapeCounts[2]===0) fail('engine never produces a full spread with two direct links');
if(shapeCounts[2]/triples>0.35) fail(`Thread is too eager at spread level: ${((shapeCounts[2]/triples)*100).toFixed(1)}% have two links`);

// Complete-reading audit on a deterministic stratified sample. This exercises the actual
// integration contract without making CI build all 14.6M long-form card readings.
for(let ai=0;ai<TAROT_CARDS.length;ai+=1){
  for(let bi=0;bi<TAROT_CARDS.length;bi+=1){
    if(ai===bi) continue;
    const ci=(ai*17+bi*31+13)%TAROT_CARDS.length;
    if(ci===ai||ci===bi) continue;
    for(let s=0;s<SPREADS.length;s+=1){
      const positions=SPREADS[s];
      const mask=(ai*7+bi*11+s*3)%8;
      const orientations=[0,1,2].map((bit)=>(mask&(1<<bit))?'reversed':'upright');
      const entries=[entry(TAROT_CARDS[ai],orientations[0]),entry(TAROT_CARDS[bi],orientations[1]),entry(TAROT_CARDS[ci],orientations[2])];
      const reading=buildDeepReading(entries,positions,'What is most useful to understand here?');
      fullReads+=1;

      if(reading.cards?.length!==3) fail(`full read ${ai}/${bi}/${s}: card count broken`);
      if(reading.relations?.length!==2) fail(`full read ${ai}/${bi}/${s}: relation slot count broken`);
      if(!Array.isArray(reading.synthesis)||reading.synthesis.length<3) fail(`full read ${ai}/${bi}/${s}: synthesis missing`);
      const allText=[reading.summary,...(reading.synthesis||[]),...(reading.reflection||[])].join(' ');
      if(/\bundefined\b|\bnull\b|\bNaN\b/.test(allText)) fail(`full read ${ai}/${bi}/${s}: leaked undefined/null/NaN`);
      const synSentences=(reading.synthesis||[]).flatMap(sentences);
      if(new Set(synSentences).size!==synSentences.length) fail(`full read ${ai}/${bi}/${s}: duplicate synthesis sentence`);
      const active=reading.relations.filter((r)=>r.interesting).length;
      const thread=reading.synthesis[1]||'';
      if(active===0 && !/neither adjacent pair|keep the three positional meanings separate/i.test(thread)) fail(`full read ${ai}/${bi}/${s}: zero-link synthesis misstates Thread`);
      if(active===1 && !/only one adjacent pair|other pair is better left/i.test(thread)) fail(`full read ${ai}/${bi}/${s}: one-link synthesis misstates Thread`);
      if(active===2 && /only one adjacent pair|neither adjacent pair/i.test(thread)) fail(`full read ${ai}/${bi}/${s}: two-link synthesis claims missing link`);
    }
  }
}

if(failures.length){
  console.error(`Phase 6.3 FULL-SPREAD AUDIT FAILED with ${failures.length} captured issue(s):`);
  failures.forEach((item)=>console.error(`- ${item}`));
  process.exit(1);
}

console.log(`Phase 6.3 full-spread audit passed: ${triples.toLocaleString()} complete spread contexts assembled.`);
console.log(`Thread shapes: zero links=${shapeCounts[0].toLocaleString()} (${(shapeCounts[0]/triples*100).toFixed(1)}%), one link=${shapeCounts[1].toLocaleString()} (${(shapeCounts[1]/triples*100).toFixed(1)}%), two links=${shapeCounts[2].toLocaleString()} (${(shapeCounts[2]/triples*100).toFixed(1)}%).`);
console.log(`Complete buildDeepReading integrations checked: ${fullReads.toLocaleString()}.`);
console.log(`Distinct adjacent relation-type sequences exercised: ${typePairs.size}.`);
if(warnings.length) console.log(`Non-failing repeated-axis observations captured: ${warnings.length} (capped).`);
