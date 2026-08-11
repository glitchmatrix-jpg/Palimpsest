import fs from 'node:fs';
import { TAROT_CARDS } from '../src/data/tarotDataset.js';
import { buildReadingSnapshot } from '../src/components/read/readingSnapshot.js';

const failures=[];
function fail(message){if(failures.length<250)failures.push(message);}
function words(value=''){return String(value).trim().split(/\s+/).filter(Boolean).length;}

if(TAROT_CARDS.length!==78) fail(`expected 78 enriched cards, found ${TAROT_CARDS.length}`);
if(new Set(TAROT_CARDS.map((card)=>card.id)).size!==78) fail('card ids are not unique');

for(const card of TAROT_CARDS){
  const label=card.name;
  if(!Array.isArray(card.upright)||card.upright.length<3) fail(`${label}: upright keywords missing`);
  if(!Array.isArray(card.reversed)||card.reversed.length<3) fail(`${label}: reversed keywords missing`);
  if(!card.explanation?.upright||words(card.explanation.upright)<8) fail(`${label}: upright explanation too thin`);
  if(!card.explanation?.reversed||words(card.explanation.reversed)<8) fail(`${label}: reversed explanation too thin`);
  if(!card.practicalGuidance?.upright||words(card.practicalGuidance.upright)<12) fail(`${label}: upright guidance too thin`);
  if(!card.practicalGuidance?.reversed||words(card.practicalGuidance.reversed)<12) fail(`${label}: reversed guidance too thin`);
  if(!Array.isArray(card.questions?.upright)||card.questions.upright.length<3) fail(`${label}: upright questions missing`);
  if(!Array.isArray(card.questions?.reversed)||card.questions.reversed.length<3) fail(`${label}: reversed questions missing`);
  if(card.questions.upright.some((item)=>!item.endsWith('?'))) fail(`${label}: malformed upright question`);
  if(card.questions.reversed.some((item)=>!item.endsWith('?'))) fail(`${label}: malformed reversed question`);
  if(!Array.isArray(card.semanticThemes)||card.semanticThemes.length<6) fail(`${label}: semantic themes too thin`);
  if(!Array.isArray(card.symbols)||card.symbols.length<3) fail(`${label}: symbols missing`);
  if(!card.structure||card.structure.arcana!==card.arcana) fail(`${label}: structural arcana mismatch`);
  if(card.arcana==='Major'){
    if(card.structure.developmentalScale!=='archetypal') fail(`${label}: Major should be archetypal`);
    if(!Number.isInteger(card.structure.majorNumber)) fail(`${label}: Major number missing`);
  } else {
    if(card.structure.suit!==card.suit||!card.structure.element||!card.structure.rank) fail(`${label}: Minor structure incomplete`);
    if(['Page','Knight','Queen','King'].includes(card.rank)&&!card.structure.court) fail(`${label}: court role missing`);
    if(!['Page','Knight','Queen','King'].includes(card.rank)&&!card.structure.numberStage) fail(`${label}: number stage missing`);
  }
}

// Snapshot contract: save a representative reading without retaining live object/function references.
{
  const cards=[TAROT_CARDS[2],TAROT_CARDS[19],TAROT_CARDS[34]];
  const entries=cards.map((card,index)=>({card,orientation:index===1?'reversed':'upright',revealed:true}));
  const analysis={
    cards:entries.map((entry,index)=>({keywords:index===1?entry.card.reversed:entry.card.upright,reading:`Reading ${index+1}`})),
    trajectory:'one → two → three',summary:'Summary',synthesis:['A','B','C'],reflection:['Q1','Q2','Q3'],
    relations:[{interesting:true,type:'contrast',strength:80,axis:'one → two',text:'Relationship',evidence:['semantic']}],
    layers:[{id:'test',title:'Pattern',lead:'Lead',text:'Layer text',evidence:['cards']}],
  };
  const spread={name:'Past · Present · Future',positions:['Past','Present','Future']};
  const snapshot=buildReadingSnapshot({analysis,entries,spread,spreadId:'past-present-future',question:'What matters here?',method:'physical',allowReversals:true,note:'Remember this.'});
  if(snapshot.cards.length!==3||snapshot.positions.length!==3) fail('snapshot lost card/position structure');
  if(snapshot.cards[1].orientation!=='reversed') fail('snapshot lost orientation');
  if(snapshot.cards.some((card)=>!Array.isArray(card.semanticThemes))) fail('snapshot lost semantic metadata');
  if(JSON.stringify(snapshot).includes('undefined')) fail('snapshot leaks undefined');
  JSON.parse(JSON.stringify(snapshot));
}

const journalSource=fs.readFileSync(new URL('../src/storage/journalStore.js',import.meta.url),'utf8');
const journalUi=fs.readFileSync(new URL('../src/components/journal/JournalExperience.jsx',import.meta.url),'utf8');
const readUi=fs.readFileSync(new URL('../src/components/read/ReadExperience61.jsx',import.meta.url),'utf8');
const journalCss=fs.readFileSync(new URL('../src/styles/journal.css',import.meta.url),'utf8');

for(const token of ['indexedDB.open','createObjectStore','saveReading','listReadings','deleteReading','buildJournalBackup','validateJournalBackup','restoreJournalBackup']){
  if(!journalSource.includes(token)) fail(`Journal storage contract missing: ${token}`);
}
if(/fetch\(|XMLHttpRequest|WebSocket|localStorage/.test(journalSource)) fail('Journal persistence contains an unexpected network/localStorage path');
for(const token of ['Export JSON','Restore JSON','Save note','Reading archive']) if(!journalUi.includes(token)) fail(`Journal UI missing: ${token}`);
for(const token of ['saveReading','buildReadingSnapshot','SAVE TO JOURNAL','Save reading']) if(!readUi.includes(token)) fail(`Read → Journal bridge missing: ${token}`);
if(!/@media\s*\([^)]*max-width/i.test(journalCss)) fail('Journal has no mobile breakpoint');
if(!/@media\s*\(prefers-reduced-motion:\s*reduce\)/i.test(journalCss)) fail('Journal has no reduced-motion treatment');

if(failures.length){
  console.error(`Phase 7 AUDIT FAILED with ${failures.length} issue(s):`);
  failures.forEach((item)=>console.error(`- ${item}`));
  process.exit(1);
}
console.log('Phase 7 audit passed: 78 enriched cards validated.');
console.log('Journal contract passed: IndexedDB snapshots, local notes, delete, JSON export/restore, Read save bridge, mobile and reduced-motion coverage.');
