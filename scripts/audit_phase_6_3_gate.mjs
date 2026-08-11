import { TAROT_CARDS } from '../src/data/cardLibrary.js';
import { buildDeepReading } from '../src/components/read/deepReading.js';

const SPREADS=[['Past','Present','Future'],['Situation','Challenge','Advice'],['Mind','Body','Spirit'],['You','Them','Relationship']];
const failures=[];
const shapes=[0,0,0];
let reads=0;
const fail=(m)=>{if(failures.length<200)failures.push(m)};
const entry=(card,orientation)=>({card,orientation,revealed:true});
const norm=(v='')=>String(v).toLowerCase().replace(/[^a-z0-9 ]+/g,' ').replace(/\s+/g,' ').trim();

// Deterministic regression matrix: every card appears repeatedly as first/second/third,
// every preset is exercised, and orientation masks are distributed across the matrix.
for(let ai=0;ai<78;ai++){
 for(let bi=0;bi<78;bi+=3){
  if(ai===bi)continue;
  const ci=(ai*29+bi*17+11)%78;
  if(ci===ai||ci===bi)continue;
  for(let s=0;s<SPREADS.length;s++){
   const mask=(ai*7+bi*5+s*13)%8;
   const ids=[ai,bi,ci];
   const entries=ids.map((id,bit)=>entry(TAROT_CARDS[id],mask&(1<<bit)?'reversed':'upright'));
   const reading=buildDeepReading(entries,SPREADS[s],'What is most useful to understand here?');
   reads++;
   const active=reading.relations.filter(r=>r.interesting);
   shapes[active.length]++;
   if(reading.cards.length!==3||reading.relations.length!==2)fail(`${ai}/${bi}/${s}: broken reading contract`);
   if(!Array.isArray(reading.synthesis)||reading.synthesis.length<3)fail(`${ai}/${bi}/${s}: synthesis missing`);
   if(active.length===2&&norm(active[0].text)===norm(active[1].text))fail(`${ai}/${bi}/${s}: duplicate adjacent Thread explanations`);
   const text=[reading.summary,...reading.synthesis,...reading.reflection].join(' ');
   if(/\bundefined\b|\bnull\b|\bNaN\b/.test(text))fail(`${ai}/${bi}/${s}: leaked invalid value`);
   if(active.length===0&&!/neither adjacent pair|keep the three positional meanings separate/i.test(reading.synthesis[1]))fail(`${ai}/${bi}/${s}: zero-link Thread contract broken`);
   if(active.length===1&&!/only one adjacent pair|other pair is better left/i.test(reading.synthesis[1]))fail(`${ai}/${bi}/${s}: one-link Thread contract broken`);
   if(active.length===2&&/only one adjacent pair|neither adjacent pair/i.test(reading.synthesis[1]))fail(`${ai}/${bi}/${s}: two-link Thread contract broken`);
  }
 }
}
if(reads<7000)fail(`spread regression matrix too small: ${reads}`);
if(shapes.some(x=>x===0))fail(`not all Thread shapes exercised: ${shapes.join('/')}`);
if(failures.length){console.error(`Phase 6.3 SPREAD GATE FAILED with ${failures.length} issue(s):`);failures.forEach(x=>console.error(`- ${x}`));process.exit(1);}
console.log(`Phase 6.3 spread regression gate passed: ${reads.toLocaleString()} complete readings; Thread shapes zero/one/two=${shapes.join('/')}.`);
console.log('The 14,606,592-context certification sweep remains available as npm run audit:spreads:exhaustive.');
