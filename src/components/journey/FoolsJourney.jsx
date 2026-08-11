import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Threads from '../../vendor/react-bits/Threads/Threads';
import ScrollReveal from '../../vendor/react-bits/ScrollReveal/ScrollReveal';

const asset = (path) => `${import.meta.env.BASE_URL}${path}`;

const MAJORS = [
  ['00','The Fool','00_The_Fool.png','Begin','Openness before certainty. The Fool matters because development has to start before you can know exactly who you will become.','The journey begins with capacity rather than mastery: enough trust to enter experience without pretending to control it.'],
  ['01','The Magician','01_The_Magician.png','Act','Potential becomes agency. Attention, tools and intention are gathered into a deliberate first move.','The Fool stops being merely available to experience and discovers: I can affect what happens next.'],
  ['02','The High Priestess','02_The_High_Priestess.png','Listen','Action is not enough. Some information arrives through observation, pattern recognition, restraint and what has not yet been said.','After proving agency, the next lesson is limits: not everything useful can be forced into immediate action.'],
  ['03','The Empress','03_The_Empress.png','Nourish','Growth needs conditions. The Empress asks what must be fed, protected and given time if it is going to become more than an idea.','Inner awareness becomes something embodied: care turns possibility into living form.'],
  ['04','The Emperor','04_The_Emperor.png','Structure','What grows also needs boundaries, responsibility and a framework strong enough to hold it.','Nurture without structure can sprawl. The Emperor adds shape, limits and accountability to what the Empress helped grow.'],
  ['05','The Hierophant','05_The_Hierophant.png','Learn the system','No one develops alone. Traditions, teachers and institutions transmit knowledge — and also rules that eventually need examination.','Private structure becomes social structure: the Fool encounters systems that existed long before them.'],
  ['06','The Lovers','06_The_Lovers.png','Choose','Values become real when they cost something. The Lovers is not only connection; it is the pressure to choose in alignment with what matters.','After inheriting rules, the Fool has to decide which values are genuinely theirs.'],
  ['07','The Chariot','07_The_Chariot.png','Direct','Conflicting motives do not disappear; they must be coordinated. Direction is the ability to move while holding tension.','Choice becomes commitment. The Chariot tests whether values can survive contact with momentum and opposition.'],
  ['08','Strength','08_Strength.png','Regulate','Force is easy to recognize. Regulation is harder: staying capable without becoming ruled by fear, anger or urgency.','The Chariot controls direction externally; Strength develops control internally.'],
  ['09','The Hermit','09_The_Hermit.png','Examine','Solitude creates distance from noise. The point is not withdrawal for its own sake, but enough quiet to inspect what experience has actually taught you.','After learning self-command, the Fool turns inward to ask whether the direction itself is worth continuing.'],
  ['10','Wheel of Fortune','10_Wheel_of_Fortune.png','Adapt','Reflection cannot stop change. Conditions shift, timing changes, and some forces remain outside personal control.','The Hermit finds an inner compass; the Wheel tests whether that compass can survive an unstable world.'],
  ['11','Justice','11_Justice.png','Account','Change does not erase consequence. Justice asks what is true, what followed from your choices, and what responsibility now belongs to you.','After confronting uncertainty outside the self, the Fool confronts causality: actions leave a record.'],
  ['12','The Hanged Man','12_The_Hanged_Man.png','Reframe','Some problems cannot be solved from the position that created them. Suspension interrupts reflex and makes another angle possible.','Justice clarifies what is. The Hanged Man asks whether seeing clearly is enough — or whether the frame itself must change.'],
  ['13','Death','13_Death.png','End','A real ending removes options. Transformation begins when an exhausted form is allowed to close instead of being endlessly repaired.','Perspective changes what you can see; Death changes what can continue.'],
  ['14','Temperance','14_Temperance.png','Integrate','After disruption, the task is not to return unchanged. Temperance combines what remains into a more workable proportion.','Death clears the old arrangement. Temperance asks what a better arrangement actually looks like in practice.'],
  ['15','The Devil','15_The_Devil.png','Name the attachment','Integration exposes what still has leverage over you: appetite, fear, shame, status, avoidance, dependency. Naming the bond restores choice.','Balance is tested by the parts of us that do not want balance.'],
  ['16','The Tower','16_The_Tower.png','Let false structure fail','Some structures cannot be moderated because their premise is broken. The Tower is the moment reality becomes stronger than maintenance.','The Devil reveals the bond; the Tower shows what happens when the system built around that bond can no longer hold.'],
  ['17','The Star','17_The_Star.png','Reorient','After collapse, hope is useful only if it gives direction. The Star is the first credible picture of a future worth rebuilding toward.','The Tower removes false certainty. The Star replaces certainty with orientation.'],
  ['18','The Moon','18_The_Moon.png','Move through ambiguity','Recovery does not eliminate projection, fear or incomplete information. The Moon teaches careful movement when certainty is unavailable.','Hope creates direction, but direction still has to pass through uncertainty.'],
  ['19','The Sun','19_The_Sun.png','See clearly','What was ambiguous becomes visible enough to participate in directly. Clarity restores energy because less effort is spent guessing.','The Moon teaches you not to fake certainty. The Sun arrives when enough has become visible to act without pretending.'],
  ['20','Judgement','20_Judgement.png','Reckon','Insight becomes consequential when you answer it. Judgement is an honest review of the past followed by a different response in the present.','Clarity creates responsibility: once you can see the pattern, continuing it becomes a choice.'],
  ['21','The World','21_The_World.png','Integrate and complete','Completion is not perfection. It is the point where enough has been learned, embodied and connected that the cycle can genuinely close.','Judgement changes the response; the World integrates the change into a whole. Completion then makes another beginning possible.']
].map(([number,name,file,verb,insight,bridge],index)=>({number,name,file,verb,insight,bridge,index}));

const ACTS = [
  {id:'act-1', label:'ACT I', range:'0–VII', title:'Identity and participation', text:'The Fool enters the world, develops agency, meets structure and inherited systems, then learns to choose and move with intention.', from:0, to:7},
  {id:'act-2', label:'ACT II', range:'VIII–XIV', title:'Self-mastery and transformation', text:'External momentum gives way to regulation, reflection, consequence, reframing, endings and the difficult work of integration.', from:8, to:14},
  {id:'act-3', label:'ACT III', range:'XV–XXI', title:'Disruption and integration', text:'The remaining attachments are exposed, weak structures fail, orientation returns, uncertainty clears and the cycle is consciously completed.', from:15, to:21}
];

function CardThumb({card,onOpen}) {
  return <button className="journey-node__card" type="button" onClick={()=>onOpen(card)} aria-label={`Open ${card.name}`}>
    <img src={asset(`cards/Major_Arcana/${card.file}`)} alt={card.name}/>
    <span className="journey-node__glint" aria-hidden="true"/>
  </button>;
}

function FocusPanel({card,onClose,onSelect}) {
  if(!card) return null;
  const prev=MAJORS[card.index-1];
  const next=MAJORS[card.index+1];
  return createPortal(<div className="journey-focus" role="dialog" aria-modal="true" aria-label={`${card.name} in the Fool's Journey`} onMouseDown={e=>{if(e.target===e.currentTarget)onClose();}}>
    <article className="journey-focus__panel">
      <button className="journey-focus__close" type="button" onClick={onClose} aria-label="Close">×</button>
      <div className="journey-focus__sequence">
        <button disabled={!prev} onClick={()=>prev&&onSelect(prev)}><span>{prev?.number||'—'}</span><strong>{prev?.name||'Beginning'}</strong></button>
        <i>→</i>
        <div className="is-current"><span>{card.number}</span><strong>{card.name}</strong></div>
        <i>→</i>
        <button disabled={!next} onClick={()=>next&&onSelect(next)}><span>{next?.number||'—'}</span><strong>{next?.name||'Completion'}</strong></button>
      </div>
      <div className="journey-focus__body">
        <figure><img src={asset(`cards/Major_Arcana/${card.file}`)} alt={card.name}/></figure>
        <div className="journey-focus__copy">
          <span>{card.number} · {card.verb}</span>
          <h2>{card.name}</h2>
          <p className="journey-focus__insight">{card.insight}</p>
          <div className="journey-focus__bridge"><small>WHY IT FOLLOWS</small><p>{card.bridge}</p></div>
          <p className="journey-focus__question"><b>Use it:</b> What changes in a reading if you treat this card as a developmental task rather than a personality label?</p>
        </div>
      </div>
    </article>
  </div>,document.body);
}

export default function FoolsJourney(){
  const root=useRef(null);
  const [selected,setSelected]=useState(null);
  const [active,setActive]=useState(0);

  useEffect(()=>{
    const el=root.current;if(!el)return;
    let raf=0;
    const update=()=>{raf=0;const rect=el.getBoundingClientRect();const total=Math.max(1,rect.height-window.innerHeight);const progress=Math.min(1,Math.max(0,-rect.top/total));el.style.setProperty('--journey-progress',progress);setActive(Math.min(21,Math.max(0,Math.round(progress*21))));};
    const onScroll=()=>{if(!raf)raf=requestAnimationFrame(update)};
    update();window.addEventListener('scroll',onScroll,{passive:true});window.addEventListener('resize',onScroll);
    return()=>{window.removeEventListener('scroll',onScroll);window.removeEventListener('resize',onScroll);if(raf)cancelAnimationFrame(raf)};
  },[]);

  useEffect(()=>{if(!selected)return;const close=e=>{if(e.key==='Escape')setSelected(null)};document.addEventListener('keydown',close);return()=>document.removeEventListener('keydown',close)},[selected]);

  const actFor=useMemo(()=>MAJORS.map(c=>ACTS.find(a=>c.index>=a.from&&c.index<=a.to)),[]);

  return <div className="fools-journey" ref={root}>
    <div className="journey-atmosphere" aria-hidden="true"><Threads color={[0.55,0.36,0.76]} amplitude={0.5} distance={0.16} enableMouseInteraction={false}/></div>
    <header className="journey-hero">
      <span>PALIMPSEST · THE MAJOR ARCANA</span>
      <h1>The Fool’s Journey</h1>
      <ScrollReveal className="journey-hero__reveal" baseOpacity={0.18} baseRotation={0.6} blurStrength={1.5}>Twenty-two cards become easier to remember when they stop being twenty-two definitions and become one sequence of problems a person has to learn how to solve.</ScrollReveal>
      <p className="journey-hero__note">This is a teaching model, not a claim that every life follows one fixed path. Use the sequence to understand how each Major changes the problem introduced by the one before it.</p>
      <div className="journey-hero__cue"><i/><span>scroll to unfold</span></div>
    </header>

    <div className="journey-stage">
      <svg className="journey-path" viewBox="0 0 100 2200" preserveAspectRatio="none" aria-hidden="true">
        <path className="journey-path__ghost" d="M50 0 C12 75,88 125,50 200 S12 325,50 400 S88 525,50 600 S12 725,50 800 S88 925,50 1000 S12 1125,50 1200 S88 1325,50 1400 S12 1525,50 1600 S88 1725,50 1800 S12 1925,50 2000 S88 2125,50 2200"/>
        <path className="journey-path__live" pathLength="1" d="M50 0 C12 75,88 125,50 200 S12 325,50 400 S88 525,50 600 S12 725,50 800 S88 925,50 1000 S12 1125,50 1200 S88 1325,50 1400 S12 1525,50 1600 S88 1725,50 1800 S12 1925,50 2000 S88 2125,50 2200"/>
      </svg>

      {ACTS.map(act=><section className={`journey-act journey-act--${act.id}`} key={act.id}>
        <div className="journey-act__label"><span>{act.label}</span><strong>{act.range}</strong><h2>{act.title}</h2><p>{act.text}</p></div>
        <div className="journey-act__nodes">
          {MAJORS.filter(c=>c.index>=act.from&&c.index<=act.to).map(card=><article className={`journey-node ${card.index%2?'is-right':'is-left'} ${active===card.index?'is-active':''}`} key={card.number}>
            <div className="journey-node__dot" aria-hidden="true"><i/></div>
            <div className="journey-node__content">
              <CardThumb card={card} onOpen={setSelected}/>
              <div className="journey-node__copy"><span>{card.number}</span><h3>{card.name}</h3><strong>{card.verb}</strong><p>{card.insight}</p><button type="button" onClick={()=>setSelected(card)}>See the transition <i>→</i></button></div>
            </div>
          </article>)}
        </div>
      </section>)}
    </div>

    <footer className="journey-ending">
      <span>XXI → 0</span>
      <h2>Completion changes the next beginning.</h2>
      <p>The World does not make the Fool obsolete. It makes the next Fool less naive. A completed cycle becomes context for whatever you begin next.</p>
    </footer>
    <FocusPanel card={selected} onClose={()=>setSelected(null)} onSelect={setSelected}/>
  </div>;
}
