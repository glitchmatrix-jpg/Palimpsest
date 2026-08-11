import { useEffect, useMemo, useState } from 'react';

const asset = (path) => `${import.meta.env.BASE_URL}${path}`;

const COURSE_SECTIONS = [
  ['learn-start', 'Start'],
  ['learn-suits', 'Suits'],
  ['learn-numbers', 'Numbers'],
  ['learn-courts', 'Courts'],
  ['learn-reversals', 'Reversals'],
  ['learn-flow', 'Flow'],
  ['learn-practice', 'Practice']
];

const SUITS = {
  Cups: {
    verb: 'Feel', element: 'Water',
    thesis: 'Cups track emotional reality: attachment, intimacy, grief, pleasure, empathy and the way we relate to what matters.',
    diagnostic: 'When Cups dominate, ask: what is being felt, wanted, protected or avoided?',
    examples: ['01_Ace_of_Cups.png','05_Five_of_Cups.png','08_Eight_of_Cups.png','13_Queen_of_Cups.png'],
    labels: ['opening','grief','departure','emotional maturity']
  },
  Swords: {
    verb: 'Think', element: 'Air',
    thesis: 'Swords track the mind in motion: decisions, language, truth, conflict, anxiety, strategy and the stories we tell ourselves.',
    diagnostic: 'When Swords dominate, ask: what belief, decision or conflict is shaping the situation?',
    examples: ['01_Ace_of_Swords.png','02_Two_of_Swords.png','08_Eight_of_Swords.png','13_Queen_of_Swords.png'],
    labels: ['clarity','stalemate','restriction','discernment']
  },
  Wands: {
    verb: 'Act', element: 'Fire',
    thesis: 'Wands track drive: desire, creativity, ambition, momentum, risk, confidence and the cost of sustaining action.',
    diagnostic: 'When Wands dominate, ask: where is the energy going, and is it focused enough to become progress?',
    examples: ['01_Ace_of_Wands.png','05_Five_of_Wands.png','08_Eight_of_Wands.png','13_Queen_of_Wands.png'],
    labels: ['spark','friction','speed','confidence']
  },
  Pentacles: {
    verb: 'Build', element: 'Earth',
    thesis: 'Pentacles track what becomes tangible: work, money, health, skill, routine, resources, security and long-term cultivation.',
    diagnostic: 'When Pentacles dominate, ask: what is actually being built, maintained, invested in or neglected?',
    examples: ['01_Ace_of_Pentacles.png','05_Five_of_Pentacles.png','08_Eight_of_Pentacles.png','13_Queen_of_Pentacles.png'],
    labels: ['opportunity','scarcity','mastery','stewardship']
  }
};

const NUMBERS = [
  ['Ace','Seed','Potential enters the system. It is real, but undeveloped.'],
  ['2','Polarity','Two forces meet: choice, partnership, tension or balance.'],
  ['3','Growth','Something begins to develop, collaborate or take visible form.'],
  ['4','Structure','Energy stabilizes. This can mean foundation, rest or stagnation.'],
  ['5','Disruption','The existing structure is challenged. Friction exposes what is weak.'],
  ['6','Adjustment','The system responds: support, recovery, recognition or rebalancing.'],
  ['7','Test','Progress meets complexity. Discernment and strategy become necessary.'],
  ['8','Movement','Energy becomes organized, accelerated, practiced or constrained.'],
  ['9','Culmination','The suit nears its mature expression: intensity, independence or endurance.'],
  ['10','Completion','The cycle reaches consequence: fulfillment, burden, ending or legacy.']
];

const COURTS = {
  Page: {
    role:'Discover', question:'What am I learning to notice?',
    text:'Pages are beginners with live curiosity. They receive the suit, experiment with it and often represent a message, new capacity or early-stage attitude.',
    examples:['11_Page_of_Cups.png','11_Page_of_Swords.png','11_Page_of_Wands.png','11_Page_of_Pentacles.png']
  },
  Knight: {
    role:'Pursue', question:'How is this energy being chased?',
    text:'Knights mobilize the suit. They turn interest into pursuit, which makes them powerful but also prone to the suit’s characteristic excess.',
    examples:['12_Knight_of_Cups.png','12_Knight_of_Swords.png','12_Knight_of_Wands.png','12_Knight_of_Pentacles.png']
  },
  Queen: {
    role:'Embody', question:'How is this energy held and integrated?',
    text:'Queens internalize mastery. They show what the suit looks like when it becomes a stable way of being rather than a temporary action.',
    examples:['13_Queen_of_Cups.png','13_Queen_of_Swords.png','13_Queen_of_Wands.png','13_Queen_of_Pentacles.png']
  },
  King: {
    role:'Direct', question:'How is this energy governed or applied?',
    text:'Kings externalize mastery. They organize the suit into decisions, standards, leadership and sustained responsibility.',
    examples:['14_King_of_Cups.png','14_King_of_Swords.png','14_King_of_Wands.png','14_King_of_Pentacles.png']
  }
};

const SUIT_FOLDERS = ['Cups','Swords','Wands','Pentacles'];

function LessonHeader({kicker,title,children}) {
  return <header className="learn-section__head"><span>{kicker}</span><h2>{title}</h2>{children && <p>{children}</p>}</header>;
}

function StartHere() {
  return <section className="learn-section learn-start" id="learn-start">
    <LessonHeader kicker="01 · Start here" title="Tarot is a grammar, not 78 passwords.">
      Memorizing isolated card definitions is slow and brittle. A stronger reader understands the structure underneath the deck, then uses the image and spread position to refine it.
    </LessonHeader>
    <div className="learn-grammar">
      <article className="learn-grammar__major"><span>Major Arcana</span><strong>the chapters</strong><p>Twenty-two archetypal turning points. They usually widen the frame: identity, choice, disruption, transformation, integration.</p></article>
      <div className="learn-grammar__bridge" aria-hidden="true"><i/><b>context</b><i/></div>
      <article className="learn-grammar__minor"><span>Minor Arcana</span><strong>the scenes</strong><p>Fifty-six situations. They show how life is actually being lived: what you feel, think, do and build.</p></article>
    </div>
    <div className="learn-formula" aria-label="Tarot reading formula">
      <span>Suit</span><b>+</b><span>Number / Court</span><b>+</b><span>Orientation</span><b>+</b><span>Position</span><b>=</b><strong>Meaning in context</strong>
    </div>
    <p className="learn-note"><b>Useful rule:</b> start broad, then narrow. First identify the card’s domain and structural role. Only then use details of imagery and the question being asked.</p>
  </section>;
}

function SuitsLesson() {
  const [active,setActive] = useState('Cups');
  const suit = SUITS[active];
  return <section className="learn-section" id="learn-suits">
    <LessonHeader kicker="02 · The four suits" title="Four domains. Four kinds of pressure.">
      A suit is not a mood board. It tells you which part of life the card is primarily describing.
    </LessonHeader>
    <div className="suit-tabs" role="tablist" aria-label="Tarot suits">
      {Object.entries(SUITS).map(([name,data]) => <button key={name} className={active===name?'is-active':''} onClick={()=>setActive(name)} role="tab" aria-selected={active===name}><span>{name}</span><strong>{data.verb}</strong></button>)}
    </div>
    <div className={`suit-world suit-world--${active.toLowerCase()}`}>
      <div className="suit-world__motion" aria-hidden="true"><i/><i/><i/><i/></div>
      <div className="suit-world__copy">
        <span>{suit.element} · {suit.verb}</span>
        <h3>{active}</h3>
        <p>{suit.thesis}</p>
        <blockquote>{suit.diagnostic}</blockquote>
      </div>
      <div className="suit-world__cards">
        {suit.examples.map((file,index)=><figure key={file}><img src={asset(`cards/Minor_Arcana/${active}/${file}`)} alt={`${active} example: ${suit.labels[index]}`}/><figcaption>{suit.labels[index]}</figcaption></figure>)}
      </div>
    </div>
  </section>;
}

function NumbersLesson() {
  const [active,setActive] = useState(0);
  const n = NUMBERS[active];
  const suitExamples = useMemo(()=>SUIT_FOLDERS.map(suit=>({suit,src:asset(`cards/Minor_Arcana/${suit}/${String(active+1).padStart(2,'0')}_${active===0?'Ace':NUMBERS[active][0]==='10'?'Ten':(['','Ace','Two','Three','Four','Five','Six','Seven','Eight','Nine','Ten'][active+1])}_of_${suit}.png`)})),[active]);
  return <section className="learn-section" id="learn-numbers">
    <LessonHeader kicker="03 · Numbers" title="The number tells you what the suit is doing.">
      Compare the same number across all four suits and the pattern becomes easier to remember than four separate definitions.
    </LessonHeader>
    <div className="number-rail" role="tablist" aria-label="Tarot numbers">
      {NUMBERS.map((item,index)=><button key={item[0]} className={active===index?'is-active':''} onClick={()=>setActive(index)}><span>{item[0]}</span><i/></button>)}
    </div>
    <div className="number-focus">
      <div className="number-focus__copy"><span>{n[0]}</span><h3>{n[1]}</h3><p>{n[2]}</p><small>Now combine that structure with the suit.</small></div>
      <div className="number-focus__examples">{suitExamples.map(({suit,src})=><figure key={suit}><img src={src} alt={`${n[0]} of ${suit}`}/><figcaption>{suit}</figcaption></figure>)}</div>
    </div>
    <div className="number-sequence"><span>seed</span><b>→</b><span>polarity</span><b>→</b><span>growth</span><b>→</b><span>structure</span><b>→</b><span>disruption</span><b>→</b><span>adjustment</span><b>→</b><span>test</span><b>→</b><span>movement</span><b>→</b><span>culmination</span><b>→</b><span>completion</span></div>
  </section>;
}

function CourtsLesson() {
  const [active,setActive] = useState('Page');
  const court = COURTS[active];
  return <section className="learn-section" id="learn-courts">
    <LessonHeader kicker="04 · Court cards" title="Stop treating court cards like four random people.">
      Read them as four levels of relationship with a suit. The same sequence works whether the card describes a person, an attitude or a role you are being asked to take.
    </LessonHeader>
    <div className="court-ladder">{Object.entries(COURTS).map(([name,data])=><button key={name} onClick={()=>setActive(name)} className={active===name?'is-active':''}><span>{name}</span><i>→</i><strong>{data.role}</strong></button>)}</div>
    <div className="court-focus">
      <div className="court-focus__copy"><span>{active}</span><h3>{court.role}</h3><p>{court.text}</p><blockquote>{court.question}</blockquote></div>
      <div className="court-focus__cards">{court.examples.map((file,index)=>{const suit=SUIT_FOLDERS[index];return <figure key={file}><img src={asset(`cards/Minor_Arcana/${suit}/${file}`)} alt={`${active} of ${suit}`}/><figcaption>{suit}</figcaption></figure>})}</div>
    </div>
  </section>;
}

function ReversalsLesson(){
  const [mode,setMode]=useState('Internalized');
  const modes={
    Internalized:['The energy is present, but happening inwardly.','Example: upright Strength may show visible steadiness; reversed can point to the private work of rebuilding confidence.'],
    Blocked:['The suit or archetype cannot express cleanly.','Ask what obstacle, fear, resource gap or avoidance is preventing the upright energy from moving.'],
    Excess:['The upright quality is overused until it becomes counterproductive.','Confidence becomes performance. Structure becomes control. Sensitivity becomes emotional absorption.'],
    Redirected:['The energy needs a different route rather than simple suppression.','A reversal can be a correction: slow down, turn inward, renegotiate the method, or stop forcing the original direction.']
  };
  return <section className="learn-section learn-reversals" id="learn-reversals"><LessonHeader kicker="05 · Reversals" title="Reversed does not mean ‘bad.’">A reversal is a modifier. It changes how the card’s energy is operating; it does not magically invert every word in the upright definition.</LessonHeader><div className="reversal-grid">{Object.entries(modes).map(([name,[summary,example]])=><button key={name} className={mode===name?'is-active':''} onClick={()=>setMode(name)}><span>{name}</span><p>{summary}</p>{mode===name&&<small>{example}</small>}</button>)}</div><p className="learn-note"><b>Best practice:</b> choose the reversal model that actually fits the question and surrounding cards. Do not force every reversed card into the same rule.</p></section>
}

function FlowLesson(){
  return <section className="learn-section" id="learn-flow"><LessonHeader kicker="06 · Reading the flow" title="A spread is a sentence, not a stack of definitions.">After reading each card, compare them. Look for movement, contrast, repetition and escalation.</LessonHeader><div className="flow-demo"><div><span>THE MOON</span><strong>uncertainty</strong></div><i>→</i><div><span>EIGHT OF CUPS</span><strong>departure</strong></div><i>→</i><div><span>THE SUN</span><strong>clarity</strong></div></div><div className="flow-rules"><article><span>01</span><h3>Track direction</h3><p>What changes from card to card? Here the sequence moves from ambiguity, through a deliberate leaving, toward visibility.</p></article><article><span>02</span><h3>Notice contrast</h3><p>Moon and Sun form a useful symbolic opposition: hidden versus revealed, night versus day, uncertainty versus clarity.</p></article><article><span>03</span><h3>Respect the middle</h3><p>The Eight of Cups is not filler. It explains the mechanism of change: clarity follows because something unsatisfying is left behind.</p></article></div></section>
}

function Practice(){
  const [revealed,setRevealed]=useState(false);
  return <section className="learn-section learn-practice" id="learn-practice"><LessonHeader kicker="07 · Practice" title="Read before you reveal.">Use the structure you just learned instead of reaching immediately for a memorized keyword.</LessonHeader><div className="practice-card"><div className="practice-card__prompt"><span>Try this</span><h3>Eight of Pentacles</h3><p>Before revealing the explanation, build it yourself:</p><ol><li>What domain does Pentacles describe?</li><li>What does Eight do structurally?</li><li>What meaning appears when you combine them?</li></ol><button onClick={()=>setRevealed(v=>!v)}>{revealed?'Hide synthesis':'Reveal synthesis'}</button></div><figure><img src={asset('cards/Minor_Arcana/Pentacles/08_Eight_of_Pentacles.png')} alt="Eight of Pentacles"/></figure>{revealed&&<div className="practice-card__answer"><span>Synthesis</span><p><b>Pentacles</b> gives us work, skill, resources and tangible practice. <b>Eight</b> gives us organized movement and mastery through repetition. Together: deliberate skill-building — the unglamorous, focused practice that turns effort into competence.</p><small>That is stronger than memorizing “apprenticeship” because you can reconstruct the idea even if the keyword disappears from memory.</small></div>}</div></section>
}

export default function LearnCourse(){
  const [activeSection, setActiveSection] = useState('learn-start');

  useEffect(() => {
    const sections = COURSE_SECTIONS.map(([id]) => document.getElementById(id)).filter(Boolean);
    if (!sections.length || !('IntersectionObserver' in window)) return undefined;

    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible?.target?.id) setActiveSection(visible.target.id);
    }, { rootMargin: '-22% 0px -58% 0px', threshold: [0, .08, .2, .4] });

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id) => {
    const target = document.getElementById(id);
    if (!target) return;
    setActiveSection(id);
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  };

  return <div className="learn-course">
    <nav className="learn-course__rail" aria-label="Course sections">
      {COURSE_SECTIONS.map(([id,label]) => <button key={id} type="button" className={activeSection===id?'is-active':''} aria-current={activeSection===id?'true':undefined} onClick={()=>scrollToSection(id)}>{label}</button>)}
    </nav>
    <StartHere/>
    <SuitsLesson/>
    <NumbersLesson/>
    <CourtsLesson/>
    <ReversalsLesson/>
    <FlowLesson/>
    <Practice/>
  </div>;
}
