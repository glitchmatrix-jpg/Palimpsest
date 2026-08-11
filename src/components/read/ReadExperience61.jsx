import { useMemo, useState } from 'react';
import SpotlightCard from '../../vendor/react-bits/SpotlightCard/SpotlightCard';
import { TAROT_CARDS } from '../../data/tarotDataset';
import { saveReading } from '../../storage/journalStore';
import { buildValidatedReading } from './readEngine65';
import { buildReadingSnapshot } from './readingSnapshot';

const asset = (path) => `${import.meta.env.BASE_URL}${path}`;
const QUESTION_MAX = 280;
const NOTE_MAX = 1800;

const SPREADS = [
  { id:'past-present-future', name:'Past · Present · Future', short:'Trace how the situation formed, what is active now, and where the current pattern points.', positions:['Past','Present','Future'] },
  { id:'situation-challenge-advice', name:'Situation · Challenge · Advice', short:'Separate what is happening from what complicates it, then identify the most useful response.', positions:['Situation','Challenge','Advice'] },
  { id:'mind-body-spirit', name:'Mind · Body · Spirit', short:'Compare interpretation, lived conditions, and the deeper value or identity question underneath them.', positions:['Mind','Body','Spirit'] },
  { id:'you-them-relationship', name:'You · Them · Relationship', short:'Distinguish two observable stances from the pattern created between them.', positions:['You','Them','Relationship'] },
];

function shuffledDraw(count,allowReversals=true){
  const pool=[...TAROT_CARDS];
  for(let i=pool.length-1;i>0;i-=1){const j=Math.floor(Math.random()*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]];}
  return pool.slice(0,count).map(card=>({card,orientation:allowReversals&&Math.random()<.5?'reversed':'upright',revealed:false}));
}

function SpreadChoice({spread,selected,onSelect}){
  return <button className={`read-spread ${selected?'is-selected':''}`} type="button" onClick={onSelect}>
    <SpotlightCard className="read-spread__spotlight" spotlightColor="rgba(214,180,92,.2)">
      <span>{spread.positions.join(' · ')}</span><h3>{spread.name}</h3><p>{spread.short}</p><i>{selected?'Selected':'Choose spread'} →</i>
    </SpotlightCard>
  </button>;
}

function CardPicker({usedIds,onChoose,onClose,allowReversals}){
  const [query,setQuery]=useState('');
  const [orientation,setOrientation]=useState('upright');
  const visible=useMemo(()=>{const q=query.trim().toLowerCase();return TAROT_CARDS.filter(card=>!usedIds.has(card.id)&&(!q||[card.name,card.suit,card.arcana,...(card.upright||[])].filter(Boolean).join(' ').toLowerCase().includes(q)));},[query,usedIds]);
  const chosenOrientation=allowReversals?orientation:'upright';
  return <div className="read-picker" role="dialog" aria-modal="true" aria-label="Choose a tarot card" onMouseDown={e=>e.target===e.currentTarget&&onClose()}>
    <div className="read-picker__panel">
      <div className="read-picker__head"><div><span>PHYSICAL DECK</span><h2>Choose the card you drew.</h2></div><button type="button" onClick={onClose} aria-label="Close">×</button></div>
      <div className="read-picker__tools"><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search the deck…" autoFocus/>{allowReversals&&<div className="read-picker__orientation"><button className={orientation==='upright'?'is-active':''} type="button" onClick={()=>setOrientation('upright')}>Upright</button><button className={orientation==='reversed'?'is-active':''} type="button" onClick={()=>setOrientation('reversed')}>Reversed</button></div>}</div>
      <div className="read-picker__grid">{visible.map(card=><button type="button" key={card.id} onClick={()=>onChoose({card,orientation:chosenOrientation,revealed:false})}><img src={asset(card.image)} alt=""/><span>{card.name}</span></button>)}</div>
    </div>
  </div>;
}

function DealtCard({label,entry,index,method,onPick,onReveal}){
  return <div className="read-dealt"><span className="read-dealt__position">{label}</span><button className={`read-flip ${entry?.revealed?'is-revealed':''}`} type="button" onClick={()=>{if(!entry)onPick(index);else if(!entry.revealed)onReveal(index);}}><div className="read-flip__inner"><div className="read-flip__face read-flip__back"><img src={asset('cards/tarot_card_back.png')} alt="Tarot card back"/>{!entry&&method==='physical'&&<span>Choose card</span>}</div><div className={`read-flip__face read-flip__front ${entry?.orientation==='reversed'?'is-reversed':''}`}>{entry&&<img src={asset(entry.card.image)} alt={entry.card.name}/>}</div></div></button><div className="read-dealt__caption">{!entry&&<span>{method==='physical'?'Enter your draw':'Waiting'}</span>}{entry&&!entry.revealed&&<span>Tap to reveal</span>}{entry?.revealed&&<><strong>{entry.card.name}</strong><span>{entry.orientation}</span></>}</div></div>;
}

function CardReading({entry}){
  return <div className="reading-card reading-card--proper-reading">
    <div className={`reading-card__art ${entry.orientation==='reversed'?'is-reversed':''}`}><img src={asset(entry.card.image)} alt={entry.card.name}/></div>
    <div className="reading-card__copy"><span>{entry.position} · {entry.orientation}</span><h3>{entry.card.name}</h3><strong>{entry.keywords.join(' · ')}</strong><p className="reading-card__reading">{entry.reading}</p></div>
  </div>;
}

export default function ReadExperience61(){
  const [stage,setStage]=useState('setup');
  const [question,setQuestion]=useState('');
  const [spreadId,setSpreadId]=useState(SPREADS[0].id);
  const [method,setMethod]=useState('physical');
  const [allowReversals,setAllowReversals]=useState(true);
  const [entries,setEntries]=useState([null,null,null]);
  const [pickerIndex,setPickerIndex]=useState(null);
  const [journalNote,setJournalNote]=useState('');
  const [savedReadingId,setSavedReadingId]=useState(null);
  const [saveStatus,setSaveStatus]=useState('');
  const spread=SPREADS.find(item=>item.id===spreadId)||SPREADS[0];
  const allChosen=entries.every(Boolean);
  const allRevealed=entries.every(entry=>entry?.revealed);
  const analysis=useMemo(()=>allChosen?buildValidatedReading(entries,spread.positions,question.trim()):null,[allChosen,entries,spread.positions,question]);
  const strongRelations=analysis?.relations?.filter(relation=>relation.interesting)||[];
  const hasLayers=Boolean(analysis?.layers?.length);
  const reflectionNumber=hasLayers?'04':'03';

  const begin=()=>{setEntries(method==='digital'?shuffledDraw(3,allowReversals):[null,null,null]);setStage('deal');setJournalNote('');setSavedReadingId(null);setSaveStatus('');window.scrollTo({top:0,behavior:'smooth'});};
  const chooseManual=(entry)=>{setEntries(current=>current.map((item,index)=>index===pickerIndex?entry:item));setPickerIndex(null);};
  const reveal=index=>setEntries(current=>current.map((item,i)=>i===index?{...item,revealed:true}:item));
  const revealAll=()=>setEntries(current=>current.map(item=>item?{...item,revealed:true}:item));
  const reset=()=>{setStage('setup');setEntries([null,null,null]);setPickerIndex(null);setJournalNote('');setSavedReadingId(null);setSaveStatus('');window.scrollTo({top:0,behavior:'smooth'});};
  const changeReversals=(enabled)=>{setAllowReversals(enabled);setEntries([null,null,null]);setPickerIndex(null);setJournalNote('');setSavedReadingId(null);setSaveStatus('');};
  const saveToJournal=async()=>{
    if(!analysis||!allRevealed)return;
    setSaveStatus('Saving…');
    try{
      const snapshot=buildReadingSnapshot({analysis,entries,spread,spreadId,question,method,allowReversals,note:journalNote});
      const saved=await saveReading(savedReadingId?{...snapshot,id:savedReadingId}:snapshot);
      setSavedReadingId(saved.id);
      setSaveStatus('Saved locally to Journal.');
    }catch(error){setSaveStatus(error.message||'Could not save this reading.');}
  };

  return <div className={`read-experience read-experience--${stage}`}>
    <div className="read-atmosphere" aria-hidden="true"><i/><i/><i/><i/></div>

    {stage==='setup'&&<section className="read-setup">
      <div className="read-kicker">III · READ</div><h1>What are you<br/>reading for?</h1>
      <p className="read-setup__lead">A useful reading starts with a question precise enough to examine but open enough to learn something. You can also leave it blank for a broad three-card reading.</p>
      <label className="read-question"><span>OPTIONAL QUESTION</span><textarea value={question} maxLength={QUESTION_MAX} onChange={e=>setQuestion(e.target.value)} placeholder="What am I not seeing clearly about…? What pattern is shaping…? What would help me handle…?" rows="3"/><small>Specific questions produce more personal readings. Broad questions produce broader readings. {question.length}/{QUESTION_MAX}</small></label>
      <div className="read-setup__section"><div className="read-section-head"><span>01</span><div><h2>Choose a spread.</h2><p>The positions give each card its role in the story.</p></div></div><div className="read-spreads">{SPREADS.map(item=><SpreadChoice key={item.id} spread={item} selected={spreadId===item.id} onSelect={()=>setSpreadId(item.id)}/>)}</div></div>
      <div className="read-setup__section read-method-section"><div className="read-section-head"><span>02</span><div><h2>How are you drawing?</h2><p>Use your physical deck or let Palimpsest draw three unique cards.</p></div></div><div className="read-methods"><button className={method==='physical'?'is-active':''} type="button" onClick={()=>setMethod('physical')}><span>PHYSICAL DECK</span><strong>I already have the cards.</strong><p>Draw normally, then enter each card{allowReversals?' and orientation':''}.</p></button><button className={method==='digital'?'is-active':''} type="button" onClick={()=>setMethod('digital')}><span>DIGITAL DRAW</span><strong>Draw inside Palimpsest.</strong><p>Three unique cards. {allowReversals?'Reversals are randomized independently.':'Every card will be upright.'}</p></button></div></div>
      <div className="read-setup__section read-preferences"><div className="read-section-head"><span>03</span><div><h2>Use reversals?</h2><p>Turn them off if your physical practice is upright-only or you want a cleaner learning read.</p></div></div><div className="read-methods"><button className={allowReversals?'is-active':''} type="button" onClick={()=>changeReversals(true)}><span>REVERSALS ON</span><strong>Use upright and reversed meanings.</strong><p>Digital draws may reverse; physical entry lets you choose orientation.</p></button><button className={!allowReversals?'is-active':''} type="button" onClick={()=>changeReversals(false)}><span>UPRIGHT ONLY</span><strong>Keep every card upright.</strong><p>No hidden reversal state, no reversed picker option, no reversed digital draws.</p></button></div></div>
      <button className="read-begin" type="button" onClick={begin}><span>BEGIN READING</span><i>◇</i></button>
    </section>}

    {stage==='deal'&&<section className="read-table"><div className="read-table__head"><span>{spread.name}</span><h1>Turn the cards over<br/>one at a time.</h1><p>{question.trim()||'No question entered — read this as a broad snapshot of the pattern around you right now.'}</p></div><div className="read-deal-grid">{spread.positions.map((label,index)=><DealtCard key={label} label={label} entry={entries[index]} index={index} method={method} onPick={setPickerIndex} onReveal={reveal}/>)}</div><div className="read-table__actions">{allChosen&&!allRevealed&&<button type="button" onClick={revealAll}>Reveal all</button>}<button className="read-interpret" type="button" disabled={!allRevealed} onClick={()=>{setStage('reading');window.scrollTo({top:0,behavior:'smooth'});}}>INTERPRET READING <i>→</i></button><button className="read-reset-link" type="button" onClick={reset}>Start over</button></div></section>}

    {stage==='reading'&&analysis&&<article className="read-result">
      <header className="read-result__hero"><span>PALIMPSEST · {spread.name.toUpperCase()}</span><h1>Read the movement,<br/>not three definitions.</h1><p>{analysis.summary}</p><div className="read-trajectory">{analysis.trajectory.split(' → ').map((item,index,arr)=><span key={`${item}-${index}`}><b>{item}</b>{index<arr.length-1&&<i>→</i>}</span>)}</div></header>

      <section className="reading-layer reading-layer--cards"><div className="reading-layer__title"><span>01</span><div><small>THE CARDS</small><h2>Read each card in its position.</h2><p>Each card gets one clear interpretation first. Then the spread tells us how those three meanings connect.</p></div></div><div className="reading-cards">{analysis.cards.map(entry=><CardReading key={entry.position} entry={entry}/>)}</div></section>

      <section className="reading-layer reading-layer--thread"><div className="reading-layer__title"><span>02</span><div><small>THE THREAD</small><h2>Now read the strongest relationships between them.</h2><p>A connection only belongs here when the cards give us a specific reason to make it.</p></div></div><div className="thread-map"><svg viewBox="0 0 1000 300" preserveAspectRatio="none" aria-hidden="true"><path d="M120 150 C270 35 350 265 500 150 S730 35 880 150" pathLength="1"/></svg>{analysis.cards.map((entry,index)=><div className={`thread-node thread-node--${index+1}`} key={entry.position}><img src={asset(entry.card.image)} alt=""/><span>{entry.position}</span><strong>{entry.card.name}</strong><b>{entry.keyword}</b></div>)}</div><div className="thread-relations">{strongRelations.length?strongRelations.map((relation,index)=><div key={`${relation.type}-${index}`}><span>{String(index+1).padStart(2,'0')} · {relation.type} · {relation.strength}</span><h3>{relation.axis}</h3><p>{relation.text}</p></div>):<div className="thread-empty"><span>NO FORCED LINK</span><h3>These cards do not form a strong direct pair.</h3><p>Keep their positional meanings separate. Palimpsest will not invent a relationship from suit, orientation, or adjacency alone.</p></div>}</div></section>

      {hasLayers&&<section className="reading-layer reading-layer--layers"><div className="reading-layer__title"><span>03</span><div><small>THE LAYERS</small><h2>What stands out across the whole spread?</h2><p>This section only appears when a pattern adds information the individual cards and Thread do not already give you.</p></div></div><div className="layers-grid">{analysis.layers.map(layer=><div className="layer-card" key={layer.id||layer.title}><span>◇</span><h3>{layer.title}</h3><strong>{layer.lead}</strong><p>{layer.text}</p></div>)}</div></section>}

      <section className="reading-layer reading-layer--reflection"><div className="reading-layer__title"><span>{reflectionNumber}</span><div><small>REFLECTION</small><h2>What do you do with the reading?</h2><p>Use these after you have read the story, not instead of reading it.</p></div></div><div className="reflection-list">{analysis.reflection.map((item,index)=><div key={item}><span>0{index+1}</span><p>{item}</p></div>)}</div><div className="reading-close"><div><strong>OVERALL READING</strong>{analysis.synthesis.map((paragraph,index)=><p key={index}>{paragraph}</p>)}</div><div className="reading-save"><label><span>SAVE TO JOURNAL</span><textarea value={journalNote} maxLength={NOTE_MAX} rows="5" onChange={(event)=>{setJournalNote(event.target.value);setSaveStatus(savedReadingId?'Note changed — save again to update.':'');}} placeholder="Optional note: what resonated, what happened, or what do you want to remember?"/><small>{journalNote.length}/{NOTE_MAX}</small></label><div><small role="status">{saveStatus}</small><button type="button" onClick={saveToJournal}>{savedReadingId?'Update saved reading':'Save reading'}</button></div></div><button type="button" onClick={reset}>New reading</button></div></section>
    </article>}

    {pickerIndex!==null&&<CardPicker usedIds={new Set(entries.filter(Boolean).map(entry=>entry.card.id))} onChoose={chooseManual} onClose={()=>setPickerIndex(null)} allowReversals={allowReversals}/>} 
  </div>;
}
