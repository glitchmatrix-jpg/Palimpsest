import { TAROT_CARDS } from '../src/data/cardLibrary.js';
import { buildPairRelation, MIN_RELATION_SCORE } from '../src/components/read/combinationIntelligence.js';

const TRANSITIONS=[['Past','Present'],['Present','Future'],['Situation','Challenge'],['Challenge','Advice'],['Mind','Body'],['Body','Spirit'],['You','Them'],['Them','Relationship']];
const O=['upright','reversed'];
const failures=[];const types=new Set();let total=0,accepted=0,rejected=0;
const fail=(m)=>{if(failures.length<200)failures.push(m)};
const entry=(card,orientation)=>({card,orientation,revealed:true});
const card=(name)=>TAROT_CARDS.find(c=>c.name===name);
const norm=(v='')=>String(v).toLowerCase().replace(/[^a-z0-9 ]+/g,' ').replace(/\s+/g,' ').trim();

// Every card is tested against 24 deterministic partners, all four orientation pairs, all eight position transitions.
for(let ai=0;ai<78;ai++){
 for(let k=1;k<=24;k++){
  const bi=(ai+k*17)%78;if(bi===ai)continue;
  for(let mask=0;mask<4;mask++){
   const ao=O[mask&1],bo=O[(mask>>1)&1];
   for(const [from,to] of TRANSITIONS){
    total++;
    const rel=buildPairRelation(entry(TAROT_CARDS[ai],ao),entry(TAROT_CARDS[bi],bo),from,to);
    const again=buildPairRelation(entry(TAROT_CARDS[ai],ao),entry(TAROT_CARDS[bi],bo),from,to);
    if(JSON.stringify(rel)!==JSON.stringify(again))fail(`${ai}/${bi}/${from}: non-deterministic`);
    if(rel.interesting){accepted++;types.add(rel.type);if(rel.score<MIN_RELATION_SCORE)fail(`${ai}/${bi}: accepted below threshold`);if(!rel.text||!rel.axis)fail(`${ai}/${bi}: accepted relation missing content`);if(!rel.evidence?.some(e=>/curated|semantic|axis|court|number|major\/minor|topology|intensity/i.test(e)))fail(`${ai}/${bi}: weak evidence only`);}
    else{rejected++;if(rel.text||rel.axis)fail(`${ai}/${bi}: rejected pair manufactured content`);}
   }
  }
 }
}
if(total<50000)fail(`pair regression matrix too small: ${total}`);
if(!accepted||!rejected)fail('pair gate failed to exercise both acceptance and refusal');
if(accepted/total>.8)fail(`engine too eager: ${(accepted/total*100).toFixed(1)}% accepted`);

// Gold + direction-aware symbolic regressions.
{
 const r=buildPairRelation(entry(card('Knight of Pentacles'),'upright'),entry(card('Queen of Cups'),'reversed'),'Mind','Body');
 if(!r.interesting||r.type!=='mismatch'||!/responsib|dependable/i.test(r.text)||!/overgiv|overextension|absorption/i.test(r.text))fail('gold mismatch regression failed');
}
{
 const r=buildPairRelation(entry(card('Queen of Cups'),'reversed'),entry(card('Page of Swords'),'upright'),'Body','Spirit');
 if(!r.interesting||r.type!=='correction'||!/question|inquiry|curiosity/i.test(r.text))fail('gold correction regression failed');
}
for(const [a,b,type] of [['The Moon','The Sun','contrast'],['The Tower','The Star','recovery'],['Death','Temperance','integration'],['The Devil','The Tower','exposure'],['The Lovers','The Chariot','commitment'],['The Hanged Man','Death','release']]){
 const f=buildPairRelation(entry(card(a),'upright'),entry(card(b),'upright'),'Present','Future');
 const r=buildPairRelation(entry(card(b),'upright'),entry(card(a),'upright'),'Present','Future');
 if(!f.interesting||f.type!==type)fail(`${a}→${b}: curated relationship lost`);
 if(!r.interesting||norm(f.text)===norm(r.text))fail(`${a}↔${b}: directionality lost`);
}

if(failures.length){console.error(`Phase 6.3 PAIR GATE FAILED with ${failures.length} issue(s):`);failures.forEach(x=>console.error(`- ${x}`));process.exit(1);}
console.log(`Phase 6.3 pair regression gate passed: ${total.toLocaleString()} contexts; accepted=${accepted.toLocaleString()}, refused=${rejected.toLocaleString()}.`);
console.log(`Relationship classes exercised: ${[...types].sort().join(', ')}.`);
console.log('The 192,192-context exhaustive pair certification remains available as npm run audit:combinations:exhaustive.');
