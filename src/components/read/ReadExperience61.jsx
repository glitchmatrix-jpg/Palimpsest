import { useMemo, useState } from 'react';
import SpotlightCard from '../../vendor/react-bits/SpotlightCard/SpotlightCard';
import { TAROT_CARDS } from '../../data/cardLibrary';
import { buildDeepReading, primaryKeyword } from './deepReading';

const asset = (path) => `${import.meta.env.BASE_URL}${path}`;

const SPREADS = [
  { id:'past-present-future', name:'Past · Present · Future', short:'Trace how the situation formed, what is active now, and where the current pattern points.', positions:['Past','Present','Future'] },
  { id:'situation-challenge-advice', name:'Situation · Challenge · Advice', short:'Separate what is happening from what complicates it, then identify the most useful response.', positions:['Situation','Challenge','Advice'] },
  { id:'mind-body-spirit', name:'Mind · Body · Spirit', short:'Compare interpretation, lived conditions, and the deeper value or identity question underneath them.', positions:['Mind','Body','Spirit'] },
  { id:'you-them-relationship', name:'You · Them · Relationship', short:'Distinguish two observable stances from the pattern created between them.', positions:['You','Them','Relationship'] },
];

function shuffledDraw(count){
  const pool=[...TAROT_CARDS];
  for(let i=pool.length-1;i>0;i-=1){const j=Math.floor(Math.random()*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]];}
  return pool.slice(0,count).map(card=>({card,orientation:Math.random()<.5?'upright':'reversed',revealed:false}));
}

function SpreadChoice({spread,selected,onSelect}){
  return <button className={`read-spread ${selected?'is-selected':''}`} type="button" onClick={onSelect}>
    <SpotlightCard className="read-spread__spotlight" spotlightColor="rgba(214,180,92,.2)">
      <span>{spread.positions.join(' · ')}</span><h3>{spread.name}</h3><p>{spread.short}</p><i>{selected?'Selected':'Choose spread'} →</i>
    </SpotlightCard>
  </button>;
}

function CardPicker({usedIds,onChoose,onClose}){
  const [query,setQuery]=useState('');
  const [orientation,setOrientation]=useState('upright');
  const visible=useMemo(()=>{const q=query.trim().toLowerCase();return TAROT_CARDS.filter(card=>!usedIds.has(card.id)&&(!q||[card.name,card.suit,card.arcana,...(card.upright||[])].filter(Boolean).join(' ').toLowerCase().includes(q)));},[query,usedIds]);
  return <div className="read-picker" role="dialog" aria-modal="true" aria-label="Choose a tarot card" onMouseDown={e=>e.target===e.currentTarget&&onClose()}>
    <div className="read-picker__panel">
      <div className="read-picker__head"><div><span>PHYSICAL DECK</span><h2>Choose the card you drew.</h2></div><button type="button" onClick={onClose} aria-label="Close">×</button></div>
      <div className="read-picker__tools"><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search the deck…" autoFocus/><div className="read-picker__orientation"><button className={orientation==='upright'?'is-active':''} type="button" onClick={()=>setOrientation('upright')}>Upright</button><button className={orientation==='reversed'?'is-active':''} type="button" onClick={()=>setOrientation('reversed')}>Reversed</button></div></div>
      <div className="read-picker__grid">{visible.map(card=><button type="button" key={card.id} onClick={()=>onChoose({card,orientation,revealed:false})}><img src={asset(card.image)} alt=""/><span>{card.name}</span></button>)}</div>
    </div>
  </div>;
}

function DealtCard({label,entry,index,method,onPick,onReveal}){
  return <div className="read-dealt"><span className="read-dealt__position">{label}</span><button className={`read-flip ${entry?.revealed?'is-revealed':''}`} type="button" onClick={()=>{if(!entry)onPick(index);else if(!entry.revealed)onReveal(index);}}><div className="read-flip__inner"><div className="read-flip__face read-flip__back"><img src={asset('cards/tarot_card_back.png')} alt="Tarot card back"/>{!entry&&method==='physical'&&<span>Choose card</span>}</div><div className={`read-flip__face read-flip__front ${entry?.orientation==='reversed'?'is-reversed':''}`}>{entry&&<img src={asset(entry.card.image)} alt={entry.card.name}/>}</div></div></button><div className="read-dealt__caption">{!entry&&<span>{method==='physical'?'Enter your draw':'Waiting'}</span>}{entry&&!entry.revealed&&<span>Tap to reveal</span>}{entry?.revealed&&<><strong>{entry.card.name}</strong><span>{entry.orientation}</span></>}</div></div>;
}

function CardReading({entry}){
  return <div className="reading-card">
    <div className={`reading-card__art ${entry.orientation==='reversed'?'is-reversed':''}`}><img src={asset(entry.card.image)} alt={entry.card.name}/></div>
    <div>
      <span>{entry.position} · {entry.orientation}</span>
      <h3>{entry.card.name}</h3>
      <strong>{entry.keyword}</strong>
      <p>{entry.meaning}</p>
      <div className="reading-card__lens"><small>WHAT IT MEANS HERE</small><p>{entry.contextual}</p></div>
      <div className="reading-card__lens"><small>FIT IT TO YOUR QUESTION</small><p>{entry.questionFit}</p></div>
      <div className="reading-card__lens"><small>ORIENTATION</small><p>{entry.orientationNote}</p></div>
      <div className="reading-card__lens"><small>MAKE IT USEFUL</small><p>{entry.practicalMove}</p></div>
      <div className="reading-card__lens"><small>DON'T OVERCLAIM</small><p>{entry.uncertaintyNote}</p></div>
    </div>
  </div>;
}

export default function ReadExperience61(){
  const [stage,setStage]=useState('setup');
  const [question,setQuestion]=useState('');
  const [spreadId,setSpreadId]=useState(SPREADS[0].id);
  const [method,setMethod]=useState('physical');
  const [entries,setEntries]=useState([null,null,null]);
  const [pickerIndex,setPickerIndex]=useState(null);
  const spread=SPREADS.find(item=>item.id===spreadId)||SPREADS[0];
  const allChosen=entries.every(Boolean);
  const allRevealed=entries.every(entry=>entry?.revealed);
  const analysis=useMemo(()=>allChosen?buildDeepReading(entries,spread.positions,question):null,[allChosen,entries,spread.positions,question]);

  const begin=()=>{setEntries(method==='digital'?shuffledDraw(3):[null,null,null]);setStage('deal');window.scrollTo({top:0,behavior:'smooth'});};
  const chooseManual=(entry)=>{setEntries(current=>current.map((item,index)=>index===pickerIndex?entry:item));setPickerIndex(null);};
  const reveal=index=>setEntries(current=>current.map((item,i)=>i===index?{...item,revealed:true}:item));
  const revealAll=()=>setEntries(current=>current.map(item=>item?{...item,revealed:true}:item));
  const reset=()=>{setStage('setup');setEntries([null,null,null]);setPickerIndex(null);window.scrollTo({top:0,behavior:'smooth'});};

  return <div className={`read-experience read-experience--${stage}`}>
    <div className="read-atmosphere" aria-hidden="true"><i/><i/><i/><i/></div>

    {stage==='setup'&&<section className="read-setup">
      <div className="read-kicker">III · READ</div><h1>What are you<br/>reading for?</h1>
      <p className="read-setup__lead">A useful reading starts with a question precise enough to examine but open enough to learn something. Palimpsest treats the cards as prompts for pattern recognition, not as proof of hidden facts.</p>
      <label className="read-question"><span>OPTIONAL QUESTION</span><textarea value={question} onChange={e=>setQuestion(e.target.value)} placeholder="What am I not seeing clearly about…? What pattern is shaping…? What would help me handle…?" rows="3"/><small>Specific questions produce specific readings. Ask about a situation, pattern, choice, relationship, or pressure you can actually compare against your experience.</small></label>
      <div className="read-setup__section"><div className="read-section-head"><span>01</span><div><h2>Choose a spread.</h2><p>The positions determine what each card is being asked to explain.</p></div></div><div className="read-spreads">{SPREADS.map(item=><SpreadChoice key={item.id} spread={item} selected={spreadId===item.id} onSelect={()=>setSpreadId(item.id)}/>)}</div></div>
      <div className="read-setup__section read-method-section"><div className="read-section-head"><span>02</span><div><h2>How are you drawing?</h2><p>Use your physical deck or let Palimpsest draw three unique cards.</p></div></div><div className="read-methods"><button className={method==='physical'?'is-active':''} type="button" onClick={()=>setMethod('physical')}><span>PHYSICAL DECK</span><strong>I already have the cards.</strong><p>Draw normally, then enter each card and orientation.</p></button><button className={method==='digital'?'is-active':''} type="button" onClick={()=>setMethod('digital')}><span>DIGITAL DRAW</span><strong>Draw inside Palimpsest.</strong><p>Three unique cards. Reversals are randomized independently.</p></button></div></div>
      <button className="read-begin" type="button" onClick={begin}><span>BEGIN READING</span><i>◇</i></button>
    </section>}

    {stage==='deal'&&<section className="read-table"><div className="read-table__head"><span>{spread.name}</span><h1>Turn the cards over<br/>one at a time.</h1><p>{question.trim()||'No question entered — read this as a general diagnostic snapshot and keep the interpretation broad until something concrete fits.'}</p></div><div className="read-deal-grid">{spread.positions.map((label,index)=><DealtCard key={label} label={label} entry={entries[index]} index={index} method={method} onPick={setPickerIndex} onReveal={reveal}/>)}</div><div className="read-table__actions">{allChosen&&!allRevealed&&<button type="button" onClick={revealAll}>Reveal all</button>}<button className="read-interpret" type="button" disabled={!allRevealed} onClick={()=>{setStage('reading');window.scrollTo({top:0,behavior:'smooth'});}}>INTERPRET READING <i>→</i></button><button className="read-reset-link" type="button" onClick={reset}>Start over</button></div></section>}

    {stage==='reading'&&analysis&&<article className="read-result">
      <header className="read-result__hero"><span>PALIMPSEST · {spread.name.toUpperCase()}</span><h1>Read the movement,<br/>then test it against your life.</h1><p>{analysis.summary}</p><div className="read-trajectory">{analysis.trajectory.split(' → ').map((item,index,arr)=><span key={`${item}-${index}`}><b>{item}</b>{index<arr.length-1&&<i>→</i>}</span>)}</div></header>

      <section className="reading-layer reading-layer--cards"><div className="reading-layer__title"><span>01</span><div><small>THE CARDS</small><h2>Give every card a job.</h2><p>A card becomes personal when its general meaning is filtered through the question, the spread position, the orientation, and something you can actually observe.</p></div></div><div className="reading-cards">{analysis.cards.map(entry=><CardReading key={entry.position} entry={entry}/>)}</div></section>

      <section className="reading-layer reading-layer--thread"><div className="reading-layer__title"><span>02</span><div><small>THE THREAD</small><h2>Explain how one card changes the next.</h2><p>The relationship between cards is where a reading stops being a glossary and starts becoming a model of the situation.</p></div></div><div className="thread-map"><svg viewBox="0 0 1000 300" preserveAspectRatio="none" aria-hidden="true"><path d="M120 150 C270 35 350 265 500 150 S730 35 880 150" pathLength="1"/></svg>{analysis.cards.map((entry,index)=><div className={`thread-node thread-node--${index+1}`} key={entry.position}><img src={asset(entry.card.image)} alt=""/><span>{entry.position}</span><strong>{entry.card.name}</strong><b>{entry.keyword}</b></div>)}</div><div className="thread-relations">{analysis.relations.map((relation,index)=><div key={`${relation.type}-${index}`}><span>{String(index+1).padStart(2,'0')} · {relation.type}</span><h3>{relation.axis}</h3><strong>{relation.headline}</strong><p>{relation.text}</p></div>)}</div></section>

      <section className="reading-layer reading-layer--layers"><div className="reading-layer__title"><span>03</span><div><small>THE LAYERS</small><h2>Use patterns only when they sharpen the story.</h2><p>Major/minor balance, suit repetition, reversals, and symbolic contrasts are useful only if they tell you something more specific than the cards already told you.</p></div></div><div className="layers-grid">{analysis.layers.map(layer=><div className="layer-card" key={layer.title}><span>◇</span><h3>{layer.title}</h3><strong>{layer.lead}</strong><p>{layer.text}</p></div>)}</div></section>

      <section className="reading-layer reading-layer--reflection"><div className="reading-layer__title"><span>04</span><div><small>REFLECTION</small><h2>Turn interpretation into better information.</h2><p>The goal is not to leave with a mysterious sentence. It is to know what to notice, what to test, what to question, and what you can influence.</p></div></div><div className="reflection-list">{analysis.reflection.map((item,index)=><div key={item}><span>0{index+1}</span><p>{item}</p></div>)}</div><div className="reading-close"><div><strong>WORKING SYNTHESIS</strong>{analysis.synthesis.map((paragraph,index)=><p key={index}>{paragraph}</p>)}</div><button type="button" onClick={reset}>New reading</button></div></section>
    </article>}

    {pickerIndex!==null&&<CardPicker usedIds={new Set(entries.filter(Boolean).map(entry=>entry.card.id))} onChoose={chooseManual} onClose={()=>setPickerIndex(null)}/>} 
  </div>;
}
