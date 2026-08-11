import { TAROT_CARDS } from '../src/data/cardLibrary.js';
import { buildPairRelation } from '../src/components/read/combinationIntelligence.js';
import { buildDeepReading } from '../src/components/read/deepReading.js';

const O=['upright','reversed'];
const SPREADS=[
  ['Past','Present','Future'],
  ['Situation','Challenge','Advice'],
  ['Mind','Body','Spirit'],
  ['You','Them','Relationship'],
];
const TRANSITIONS=SPREADS.flatMap((p)=>[[p[0],p[1]],[p[1],p[2]]]);
const N=TAROT_CARDS.length;
const failures=[],warnings=[];
const cache=new Array(TRANSITIONS.length*N*2*N*2);
const shapeCounts=[0,0,0];
const typePairs=new Map();
let triples=0,fullReads=0;

function fail(m){if(failures.length<300)failures.push(m);}
function warn(m){if(warnings.length<100)warnings.push(m);}
function entry(card,orientation){return{card,orientation,revealed:true};}
function norm(v=''){return String(v).toLowerCase().replace(/[“”‘’]/g,"'").replace(/[^a-z0-9' ]+/g,' ').replace(/\s+/g,' ').trim();}
function sentences(v=''){return String(v).split(/(?<=[.!?])\s+/).map(norm).filter(Boolean);}
function ix(t,a,ao,b,bo){return ((((t*N+a)*2+ao)*N+b)*2+bo);}

for(let t=0;t<TRANSITIONS.length;t+=1){
  const[from,to]=TRANSITIONS[t];
  for(let ai=0;ai<N;ai+=1){
    const a=TAROT_CARDS[ai];
    for(let bi=0;bi<N;bi+=1){
      if(ai===bi)continue;
      const b=TAROT_CARDS[bi];
      for(let ao=0;ao<2;ao+=1){
        for(let bo=0;bo<2;bo+=1){
          const relation=buildPairRelation(entry(a,O[ao]),entry(b,O[bo]),from,to);
          cache[ix(t,ai,ao,bi,bo)]={...relation,_normText:norm(relation.text),_normAxis:norm(relation.axis)};
          if((ao===1||bo===1)&&relation.interesting&&relation.evidence?.includes('curated')&&relation.evidence?.includes('symbolic'))fail(`${a.name} ${O[ao]} → ${b.name} ${O[bo]} / ${from}→${to}: upright curated prose won despite reversal`);
          if(relation.interesting&&relation.evidence?.includes('orientation-specific')&&/is reversed, so/i.test(relation.text))fail(`${a.name} → ${b.name} / ${from}→${to}: curated reversal explained twice`);
        }
      }
    }
  }
}

for(let s=0;s<SPREADS.length;s+=1){
  const positions=SPREADS[s],t1=s*2,t2=s*2+1;
  for(let ai=0;ai<N;ai+=1){
    for(let bi=0;bi<N;bi+=1){
      if(ai===bi)continue;
      for(let ci=0;ci<N;ci+=1){
        if(ci===ai||ci===bi)continue;
        for(let ao=0;ao<2;ao+=1){
          for(let bo=0;bo<2;bo+=1){
            const r1=cache[ix(t1,ai,ao,bi,bo)];
            for(let co=0;co<2;co+=1){
              triples+=1;
              const r2=cache[ix(t2,bi,bo,ci,co)];
              const active=(r1.interesting?1:0)+(r2.interesting?1:0);
              shapeCounts[active]+=1;
              if(active===2){
                const tp=`${r1.type}|${r2.type}`;typePairs.set(tp,(typePairs.get(tp)||0)+1);
                if(r1._normText===r2._normText)fail(`${TAROT_CARDS[ai].name} → ${TAROT_CARDS[bi].name} → ${TAROT_CARDS[ci].name} / ${positions.join('→')}: duplicate Thread explanations`);
                if(r1._normAxis===r2._normAxis&&r1.type===r2.type&&!['reinforcement','number progression','number regression','court development','court reset'].includes(r1.type))warn(`${TAROT_CARDS[ai].name} → ${TAROT_CARDS[bi].name} → ${TAROT_CARDS[ci].name}: repeated ${r1.type} axis`);
              }
            }
          }
        }
      }
    }
  }
}

const expected=78*77*76*8*4;
if(triples!==expected)fail(`triple coverage mismatch: ${triples}, expected ${expected}`);
if(shapeCounts.reduce((a,b)=>a+b,0)!==triples)fail('shape accounting mismatch');
if(shapeCounts.some((x)=>x===0))fail(`missing Thread shape: ${shapeCounts.join('/')}`);
if(shapeCounts[2]/triples>0.35)fail(`Thread too eager: ${(shapeCounts[2]/triples*100).toFixed(1)}% have two links`);

// Full integration sample: every ordered first/second-card pairing is represented,
// with a deterministic third card, all four presets, and all eight orientation masks distributed across it.
for(let ai=0;ai<N;ai+=1){
  for(let bi=0;bi<N;bi+=1){
    if(ai===bi)continue;
    const ci=(ai*17+bi*31+13)%N;if(ci===ai||ci===bi)continue;
    for(let s=0;s<SPREADS.length;s+=1){
      const positions=SPREADS[s],mask=(ai*7+bi*11+s*3)%8;
      const entries=[0,1,2].map((bit)=>entry(TAROT_CARDS[[ai,bi,ci][bit]],(mask&(1<<bit))?'reversed':'upright'));
      const reading=buildDeepReading(entries,positions,'What is most useful to understand here?');fullReads+=1;
      if(reading.cards?.length!==3)fail(`full ${ai}/${bi}/${s}: card count`);
      if(reading.relations?.length!==2)fail(`full ${ai}/${bi}/${s}: relation count`);
      if(!Array.isArray(reading.synthesis)||reading.synthesis.length<3)fail(`full ${ai}/${bi}/${s}: synthesis missing`);
      const all=[reading.summary,...(reading.synthesis||[]),...(reading.reflection||[])].join(' ');
      if(/\bundefined\b|\bnull\b|\bNaN\b/.test(all))fail(`full ${ai}/${bi}/${s}: leaked invalid value`);
      const ss=(reading.synthesis||[]).flatMap(sentences);if(new Set(ss).size!==ss.length)fail(`full ${ai}/${bi}/${s}: duplicate synthesis sentence`);
      const active=reading.relations.filter((r)=>r.interesting).length,thread=reading.synthesis[1]||'';
      if(active===0&&!/neither adjacent pair|keep the three positional meanings separate/i.test(thread))fail(`full ${ai}/${bi}/${s}: zero-link Thread mismatch`);
      if(active===1&&!/only one adjacent pair|other pair is better left/i.test(thread))fail(`full ${ai}/${bi}/${s}: one-link Thread mismatch`);
      if(active===2&&/only one adjacent pair|neither adjacent pair/i.test(thread))fail(`full ${ai}/${bi}/${s}: two-link Thread mismatch`);
    }
  }
}

if(failures.length){console.error(`Phase 6.3 FULL-SPREAD AUDIT FAILED with ${failures.length} captured issue(s):`);failures.forEach((x)=>console.error(`- ${x}`));process.exit(1);}
console.log(`Phase 6.3 full-spread audit passed: ${triples.toLocaleString()} complete spread contexts assembled.`);
console.log(`Thread shapes: zero=${shapeCounts[0].toLocaleString()} (${(shapeCounts[0]/triples*100).toFixed(1)}%), one=${shapeCounts[1].toLocaleString()} (${(shapeCounts[1]/triples*100).toFixed(1)}%), two=${shapeCounts[2].toLocaleString()} (${(shapeCounts[2]/triples*100).toFixed(1)}%).`);
console.log(`Complete buildDeepReading integrations checked: ${fullReads.toLocaleString()}.`);
console.log(`Distinct adjacent relation-type sequences exercised: ${typePairs.size}.`);
if(warnings.length)console.log(`Repeated-axis observations captured: ${warnings.length} (capped, non-failing).`);
