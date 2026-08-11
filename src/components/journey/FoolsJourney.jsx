import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Threads from '../../vendor/react-bits/Threads/Threads';

const asset = (path) => `${import.meta.env.BASE_URL}${path}`;

const MAJORS = [
  ['00','The Fool','00_The_Fool.png','BEGIN','Start before certainty','Development starts with participation. The Fool is not ignorance; it is willingness to enter experience before you can guarantee the outcome.','Potential has to move before it can become agency.'],
  ['01','The Magician','01_The_Magician.png','ACT','Turn possibility into agency','The Magician gathers attention, tools and intention into a deliberate move. The lesson is simple: capacity matters only when it is directed.','The Fool enters. The Magician discovers that entry can become influence.'],
  ['02','The High Priestess','02_The_High_Priestess.png','LISTEN','Know when not to force','Action is not the only way to learn. Observation, restraint and pattern recognition reveal information that speed can hide.','After proving agency, the next lesson is its limit: not everything useful responds to force.'],
  ['03','The Empress','03_The_Empress.png','NOURISH','Give growth conditions','Possibility becomes real only when it is fed, protected and given time. The Empress asks what deserves sustained care rather than another burst of enthusiasm.','Inner awareness becomes embodied: care turns possibility into living form.'],
  ['04','The Emperor','04_The_Emperor.png','STRUCTURE','Build what can hold','Growth without boundaries can sprawl. The Emperor adds structure, responsibility and limits strong enough to support what matters.','Nurture creates life; structure makes it sustainable.'],
  ['05','The Hierophant','05_The_Hierophant.png','LEARN THE SYSTEM','Understand inherited rules','No one develops alone. Teachers, traditions and institutions transmit useful knowledge — and assumptions that eventually need examination.','Private structure becomes social structure: now the Fool meets systems that existed first.'],
  ['06','The Lovers','06_The_Lovers.png','CHOOSE','Make values costly enough to matter','Values become meaningful when a choice excludes another possibility. The Lovers asks what you will actually organize your life around.','After inheriting rules, the Fool has to decide which values are genuinely theirs.'],
  ['07','The Chariot','07_The_Chariot.png','DIRECT','Coordinate competing drives','Conflicting motives do not vanish when you choose. Progress requires holding tension without letting every impulse steer.','Choice becomes commitment; commitment now has to survive momentum and opposition.'],
  ['08','Strength','08_Strength.png','REGULATE','Control yourself before the situation','Force is easy to recognize. Strength is quieter: staying capable without becoming ruled by fear, anger or urgency.','The Chariot directs movement outside. Strength develops control inside.'],
  ['09','The Hermit','09_The_Hermit.png','EXAMINE','Create enough distance to think','Solitude is useful when it separates signal from noise. The Hermit asks what experience has actually taught you once performance and reaction fall away.','After self-command comes a harder question: is the direction itself worth continuing?'],
  ['10','Wheel of Fortune','10_Wheel_of_Fortune.png','ADAPT','Keep an inner compass in a changing system','Reflection cannot freeze conditions. Timing shifts, luck changes and some forces stay outside personal control.','The Hermit finds an inner compass; the Wheel tests whether it survives an unstable world.'],
  ['11','Justice','11_Justice.png','ACCOUNT','Trace choices to consequences','Change does not erase causality. Justice asks what is true, what followed from your decisions and what responsibility now belongs to you.','After uncertainty outside the self comes consequence inside the record of what you did.'],
  ['12','The Hanged Man','12_The_Hanged_Man.png','REFRAME','Change the position, not just the answer','Some problems resist effort because the frame itself is wrong. Suspension interrupts reflex long enough for another angle to become possible.','Justice clarifies what is. The Hanged Man asks whether seeing clearly is enough.'],
  ['13','Death','13_Death.png','END','Let exhausted forms stop','A real ending removes options. Transformation begins when something finished is allowed to close instead of being endlessly repaired.','Perspective changes what you can see; Death changes what can continue.'],
  ['14','Temperance','14_Temperance.png','INTEGRATE','Build a better proportion','After disruption, the task is not restoration. Temperance combines what remains into a more workable arrangement.','Death clears the old arrangement. Temperance asks what deserves to replace it.'],
  ['15','The Devil','15_The_Devil.png','NAME THE ATTACHMENT','Identify what still has leverage','Appetite, fear, shame, status, avoidance and dependency gain power when they stay unnamed. Seeing the bond restores the possibility of choice.','Balance gets tested by the parts of us that benefit from imbalance.'],
  ['16','The Tower','16_The_Tower.png','LET FALSE STRUCTURE FAIL','Stop maintaining what reality has disproved','Some structures cannot be improved because their premise is broken. The Tower is the point where reality becomes stronger than maintenance.','The Devil names the bond; the Tower removes the system built around it.'],
  ['17','The Star','17_The_Star.png','REORIENT','Choose a future worth rebuilding toward','Hope is useful when it gives direction. The Star is not optimism for its own sake; it is the first credible orientation after collapse.','The Tower removes false certainty. The Star replaces certainty with direction.'],
  ['18','The Moon','18_The_Moon.png','MOVE THROUGH AMBIGUITY','Do not manufacture certainty','Recovery does not eliminate projection, fear or incomplete information. The Moon teaches careful movement when the map is still partial.','Direction is not certainty. The Star points; the Moon tests whether you can proceed without pretending to know.'],
  ['19','The Sun','19_The_Sun.png','SEE CLEARLY','Use visibility to participate','What was ambiguous becomes visible enough to engage directly. Clarity restores energy because less effort is spent guessing.','The Moon teaches you not to fake certainty. The Sun arrives when enough is actually visible.'],
  ['20','Judgement','20_Judgement.png','RECKON','Answer what you now understand','Insight becomes consequential when it changes the response. Judgement is an honest review of the past followed by different action in the present.','Once the pattern is visible, repeating it becomes a choice.'],
  ['21','The World','21_The_World.png','COMPLETE','Let a finished cycle become context','Completion is not perfection. It is enough learning, embodiment and connection for a cycle to genuinely close.','Judgement changes the response; the World integrates that change into a whole.']
].map(([number,name,file,verb,task,insight,bridge],index)=>({number,name,file,verb,task,insight,bridge,index}));

const ACTS = [
  {from:0,to:7,label:'ACT I',range:'0–VII',title:'Identity and participation',short:'Enter, act, learn, choose, commit.',tone:'violet'},
  {from:8,to:14,label:'ACT II',range:'VIII–XIV',title:'Self-mastery and transformation',short:'Regulate, examine, adapt, end, integrate.',tone:'indigo'},
  {from:15,to:21,label:'ACT III',range:'XV–XXI',title:'Disruption and integration',short:'Expose, collapse, reorient, clarify, complete.',tone:'gold'}
];

function actFor(index){return ACTS.find(a=>index>=a.from&&index<=a.to) || ACTS[0];}

function FocusPanel({card,onClose,onSelect}){
  if(!card)return null;
  const prev=MAJORS[card.index-1],next=MAJORS[card.index+1];
  return createPortal(
    <div className="journey-focus" role="dialog" aria-modal="true" aria-label={`${card.name} in the Fool's Journey`} onMouseDown={e=>{if(e.target===e.currentTarget)onClose();}}>
      <article className="journey-focus__panel">
        <button className="journey-focus__close" type="button" onClick={onClose} aria-label="Close">×</button>
        <div className="journey-focus__neighbors">
          <button disabled={!prev} onClick={()=>prev&&onSelect(prev)}>{prev&&<><small>{prev.number}</small><span>{prev.name}</span></>}</button>
          <div><small>{card.number}</small><span>{card.name}</span></div>
          <button disabled={!next} onClick={()=>next&&onSelect(next)}>{next&&<><small>{next.number}</small><span>{next.name}</span></>}</button>
        </div>
        <div className="journey-focus__body">
          <figure><img src={asset(`cards/Major_Arcana/${card.file}`)} alt={card.name}/></figure>
          <div className="journey-focus__copy">
            <span>{card.number} · {card.verb}</span>
            <h2>{card.name}</h2>
            <h3>{card.task}</h3>
            <p>{card.insight}</p>
            <div className="journey-focus__bridge"><small>WHY IT FOLLOWS</small><p>{card.bridge}</p></div>
            <div className="journey-focus__use"><small>USE IT IN A READING</small><p>Ask what task this card introduces here. What has to be learned, changed, accepted or completed before the situation can move?</p></div>
          </div>
        </div>
      </article>
    </div>,document.body
  );
}

function JourneyScene({card,isActive,onOpen}){
  const prev=MAJORS[card.index-1],next=MAJORS[card.index+1],act=actFor(card.index);
  return <section className={`journey-scene journey-scene--${act.tone} ${isActive?'is-active':''}`} data-index={card.index}>
    <div className="journey-scene__halo" aria-hidden="true"/>
    <div className="journey-scene__ghost journey-scene__ghost--prev" aria-hidden="true">{prev&&<img src={asset(`cards/Major_Arcana/${prev.file}`)} alt=""/>}</div>
    <div className="journey-scene__ghost journey-scene__ghost--next" aria-hidden="true">{next&&<img src={asset(`cards/Major_Arcana/${next.file}`)} alt=""/>}</div>
    <div className="journey-scene__act"><span>{act.label}</span><b>{act.range}</b></div>
    <div className="journey-scene__card-wrap">
      <button className="journey-scene__card" type="button" onClick={()=>onOpen(card)} aria-label={`Open ${card.name}`}>
        <img src={asset(`cards/Major_Arcana/${card.file}`)} alt={card.name}/>
        <i className="journey-scene__sheen" aria-hidden="true"/>
      </button>
      <div className="journey-scene__number" aria-hidden="true">{card.number}</div>
    </div>
    <div className="journey-scene__copy">
      <span>{card.number} · {card.verb}</span>
      <h2>{card.name}</h2>
      <h3>{card.task}</h3>
      <p>{card.insight}</p>
      <div className="journey-scene__handoff"><small>WHY THIS COMES NEXT</small><p>{card.bridge}</p></div>
      <button type="button" onClick={()=>onOpen(card)}>Open this transition <i>↗</i></button>
    </div>
    <div className="journey-scene__pulse" aria-hidden="true"><i/><i/><i/></div>
  </section>;
}

export default function FoolsJourney(){
  const root=useRef(null);
  const [active,setActive]=useState(0);
  const [selected,setSelected]=useState(null);
  const activeAct=actFor(active);

  useEffect(()=>{
    const el=root.current;if(!el)return;
    const scenes=[...el.querySelectorAll('.journey-scene')];
    const io=new IntersectionObserver(entries=>{
      let best=null;
      for(const entry of entries){if(entry.isIntersecting&&(!best||entry.intersectionRatio>best.intersectionRatio))best=entry;}
      if(best)setActive(Number(best.target.dataset.index));
    },{threshold:[.35,.55,.72]});
    scenes.forEach(s=>io.observe(s));
    return()=>io.disconnect();
  },[]);

  useEffect(()=>{
    const el=root.current;if(!el)return;
    let raf=0;
    const update=()=>{raf=0;const r=el.getBoundingClientRect();const total=Math.max(1,r.height-window.innerHeight);const p=Math.max(0,Math.min(1,-r.top/total));el.style.setProperty('--journey-progress',p.toFixed(4));};
    const onScroll=()=>{if(!raf)raf=requestAnimationFrame(update)};
    update();window.addEventListener('scroll',onScroll,{passive:true});window.addEventListener('resize',onScroll);
    return()=>{window.removeEventListener('scroll',onScroll);window.removeEventListener('resize',onScroll);if(raf)cancelAnimationFrame(raf)};
  },[]);

  useEffect(()=>{if(!selected)return;const key=e=>{if(e.key==='Escape')setSelected(null)};document.addEventListener('keydown',key);document.body.classList.add('journey-modal-open');return()=>{document.removeEventListener('keydown',key);document.body.classList.remove('journey-modal-open');}},[selected]);

  return <div className={`fools-journey fools-journey--${activeAct.tone}`} ref={root}>
    <div className="journey-fixed" aria-hidden="true">
      <div className="journey-fixed__threads"><Threads color={[0.62,0.42,0.78]} amplitude={0.72} distance={0.19} enableMouseInteraction={false}/></div>
      <div className="journey-fixed__vignette"/>
      <div className="journey-fixed__stars"/>
      <div className="journey-fixed__orb journey-fixed__orb--a"/>
      <div className="journey-fixed__orb journey-fixed__orb--b"/>
    </div>

    <header className="journey-hero">
      <div className="journey-hero__sigil" aria-hidden="true"><i/><i/><i/></div>
      <span>PALIMPSEST · THE MAJOR ARCANA</span>
      <h1>The Fool’s<br/>Journey</h1>
      <p className="journey-hero__thesis">Twenty-two cards become memorable when you stop treating them as definitions and start seeing a sequence of problems a person learns to solve.</p>
      <p className="journey-hero__note">A teaching model, not a prediction. The value is in the transitions: each Major changes the problem introduced by the one before it.</p>
      <div className="journey-hero__cue"><span>SCROLL TO ENTER</span><i/></div>
    </header>

    <div className="journey-progress" aria-hidden="true">
      <div className="journey-progress__track"><i/></div>
      <div className="journey-progress__meta"><span>{activeAct.label}</span><b>{String(active+1).padStart(2,'0')} / 22</b></div>
    </div>

    <main className="journey-story">
      {ACTS.map(act=><section className={`journey-act-break journey-act-break--${act.tone}`} key={act.label}>
        <span>{act.label} · {act.range}</span><h2>{act.title}</h2><p>{act.short}</p><i aria-hidden="true"/>
      </section>)}
      {MAJORS.map(card=><JourneyScene key={card.number} card={card} isActive={active===card.index} onOpen={setSelected}/>)}
    </main>

    <footer className="journey-ending">
      <span>XXI → 0</span>
      <h2>Completion changes the next beginning.</h2>
      <p>The World does not make the Fool obsolete. It makes the next Fool less naive. What you complete becomes context for what you begin next.</p>
      <div className="journey-ending__ring" aria-hidden="true"><i/><i/></div>
    </footer>

    <FocusPanel card={selected} onClose={()=>setSelected(null)} onSelect={setSelected}/>
  </div>;
}
