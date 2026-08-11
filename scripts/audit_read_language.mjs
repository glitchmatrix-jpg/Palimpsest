import { TAROT_CARDS } from '../src/data/tarotDataset.js';
import { buildCardRead, SUPPORTED_POSITIONS } from '../src/components/read/deepReading.js';
import { buildValidatedReading } from '../src/components/read/readEngine65.js';

const failures=[];
const ORIENTATIONS=['upright','reversed'];
const PRESETS=[
  ['Past','Present','Future'],
  ['Situation','Challenge','Advice'],
  ['Mind','Body','Spirit'],
  ['You','Them','Relationship'],
];

function normalize(text=''){
  return String(text).toLowerCase().replace(/[“”‘’]/g,"'").replace(/[^a-z0-9' ]+/g,' ').replace(/\s+/g,' ').trim();
}
function sentences(text=''){
  return String(text).split(/(?<=[.!?])\s+/).map(normalize).filter(Boolean);
}
function countPhrase(text,phrase){
  const hay=` ${normalize(text)} `, needle=normalize(phrase);
  if(!needle) return 0;
  const target=` ${needle} `;
  let count=0,from=0;
  while((from=hay.indexOf(target,from))!==-1){count+=1;from+=target.length;}
  return count;
}
function assert(condition,message){if(!condition) failures.push(message);}

let cardCount=0;
for(const card of TAROT_CARDS){
  for(const orientation of ORIENTATIONS){
    for(const position of SUPPORTED_POSITIONS){
      cardCount+=1;
      const entry={card,orientation,revealed:true};
      const result=buildCardRead(entry,position,'');
      const text=result.reading;
      const primary=(orientation==='reversed'?card.reversed:card.upright)?.[0]||'';
      assert(countPhrase(text,primary)<=3,`${card.name} ${orientation}/${position}: primary keyword "${primary}" is echoed more than three times.`);
      const bundle=(orientation==='reversed'?card.reversed:card.upright)?.slice(0,3).join(', ')||'';
      assert(countPhrase(text,bundle)<=1,`${card.name} ${orientation}/${position}: full keyword bundle is repeated.`);
      assert(!/rather than treating the energy as absent/i.test(text),`${card.name} ${orientation}/${position}: deprecated generic reversal prose returned.`);
      assert(!/stance built around/i.test(text),`${card.name} ${orientation}/${position}: deprecated recursive theme template returned.`);
      assert(!/what matters is whether their observable behaviour consistently supports/i.test(text),`${card.name} ${orientation}/${position}: deprecated Them template returned.`);
    }
  }
}

const reversalOpeners=new Map();
for(const card of TAROT_CARDS.filter(c=>c.arcana==='Minor')){
  const first=sentences(card.explanation?.reversed||'')[0]||'';
  reversalOpeners.set(first,(reversalOpeners.get(first)||0)+1);
}
for(const [sentence,count] of reversalOpeners){
  assert(count<=4,`Reversed Minor explanation opener appears ${count} times: "${sentence.slice(0,120)}"`);
}

let spreadCount=0;
for(let seed=0;seed<624;seed+=1){
  const a=TAROT_CARDS[seed%78];
  const b=TAROT_CARDS[(seed*17+11)%78];
  const c=TAROT_CARDS[(seed*37+29)%78];
  if(new Set([a.id,b.id,c.id]).size<3) continue;
  const entries=[a,b,c].map((card,index)=>({card,orientation:((seed>>index)&1)?'reversed':'upright',revealed:true}));
  for(const positions of PRESETS){
    spreadCount+=1;
    const reading=buildValidatedReading(entries,positions,seed%5===0?'What am I not seeing clearly about this situation?':'');
    const synthesis=reading.synthesis.join(' ');
    const summary=reading.summary;

    for(const cardRead of reading.cards){
      assert(countPhrase(synthesis,cardRead.cue)<=1,`${positions.join('/')} ${cardRead.card.name}: Overall repeats the same card-specific cue.`);
      const cardSentences=sentences(cardRead.reading).filter(s=>s.split(' ').length>=9);
      const synthSentences=new Set(sentences(synthesis));
      for(const sentence of cardSentences){
        assert(!synthSentences.has(sentence),`${positions.join('/')}: Overall repeats a full Card sentence: "${sentence.slice(0,120)}"`);
      }
    }

    const synthSentences=sentences(synthesis).filter(s=>s.split(' ').length>=8);
    assert(new Set(synthSentences).size===synthSentences.length,`${positions.join('/')}: Overall repeats a sentence internally.`);
    assert(!/put simply: you are bringing/i.test(synthesis),`${positions.join('/')}: old relationship recap template returned.`);
    assert(!/your mind is working through .* your lived reality shows/i.test(summary),`${positions.join('/')}: old keyword-chain summary returned.`);
  }
}

const byName=(name)=>TAROT_CARDS.find(card=>card.name===name);
const regressionEntries=[
  {card:byName('Eight of Wands'),orientation:'reversed',revealed:true},
  {card:byName('The Chariot'),orientation:'reversed',revealed:true},
  {card:byName('The Hierophant'),orientation:'reversed',revealed:true},
];
const regression=buildValidatedReading(regressionEntries,['You','Them','Relationship'],'');
const eight=regression.cards[0].reading;
const regressionSynthesis=regression.synthesis.join(' ');
assert(countPhrase(eight,'delays, scattered energy and miscommunication')<=1,'Gold relationship regression: Eight of Wands repeats its full keyword bundle.');
assert(countPhrase(regressionSynthesis,'delays')<=2,'Gold relationship regression: synthesis overuses "delays".');
assert(countPhrase(regressionSynthesis,'loss of control')<=2,'Gold relationship regression: synthesis overuses "loss of control".');
assert(countPhrase(regressionSynthesis,'conformity')<=2,'Gold relationship regression: synthesis overuses "conformity".');
assert(!regression.summary.includes('delays')&&!regression.summary.includes('loss of control')&&!regression.summary.includes('conformity'),'Gold relationship regression: summary collapsed back into a keyword chain.');

assert(cardCount===1872,`Expected 1,872 card-position-orientation readings, audited ${cardCount}.`);
assert(spreadCount>=2000,`Expected at least 2,000 spread-language samples, audited ${spreadCount}.`);

if(failures.length){
  console.error(`READ LANGUAGE AUDIT FAILED with ${failures.length} issue(s):`);
  failures.slice(0,120).forEach(item=>console.error(`- ${item}`));
  if(failures.length>120) console.error(`...and ${failures.length-120} more.`);
  process.exit(1);
}

console.log(`Read language audit passed: ${cardCount} card readings + ${spreadCount} full spread samples.`);
console.log('Checks passed: exact keyword-bundle repetition, card-specific cue reuse, reversed-Minor variety, Card→Overall sentence duplication, synthesis duplication and Gold relationship regression.');