import { CardFrame, SectionEyebrow } from '../components/ui/Primitives';
import CardLibrary from '../components/cards/CardLibrary';

function PageIntro({ eyebrow, title, body, children }) {
  return (
    <section className="shell-page__intro">
      <SectionEyebrow>{eyebrow}</SectionEyebrow>
      <h1>{title}</h1>
      <p>{body}</p>
      {children}
    </section>
  );
}

export function LearnView() {
  return (
    <div className="shell-page shell-page--learn">
      <PageIntro eyebrow="I · Learn" title="Learn the symbolic system." body="Build fluency with the Major and Minor Arcana, numbers, courts, reversals and the flow between cards." />
      <div className="shell-feature-grid">
        <CardFrame><span className="shell-card-index">01</span><h2>Start Here</h2><p>Major vs Minor Arcana, upright and reversed meanings, and how a reading works.</p></CardFrame>
        <CardFrame><span className="shell-card-index">02</span><h2>The Fool’s Journey</h2><p>Follow all twenty-two Major Arcana as one connected visual story.</p></CardFrame>
        <CardFrame><span className="shell-card-index">03</span><h2>The Four Suits</h2><p>Cups feel. Swords think. Wands act. Pentacles build.</p></CardFrame>
      </div>
    </div>
  );
}

export function CardsView() {
  return (
    <div className="shell-page shell-page--cards">
      <PageIntro eyebrow="II · Cards" title="Seventy-eight symbols. One visual language." body="Search the full deck, move between suits and archetypes, and open any card to read its layers." />
      <CardLibrary />
    </div>
  );
}

export function ReadView() {
  return (
    <div className="shell-page shell-page--read">
      <PageIntro eyebrow="III · Read" title="Read the cards in context." body="Choose a spread, place cards, and uncover the thread connecting the whole reading." />
      <div className="shell-reading-preview">
        {['Past','Present','Future'].map((label) => (
          <CardFrame className="shell-reading-slot" key={label}>
            <span>{label}</span>
            <img src={`${import.meta.env.BASE_URL}cards/tarot_card_back.png`} alt="Tarot card back" />
          </CardFrame>
        ))}
      </div>
    </div>
  );
}

export function JournalView() {
  return (
    <div className="shell-page shell-page--journal">
      <PageIntro eyebrow="IV · Journal" title="Return to what the cards revealed." body="Your saved readings, reflections and personal notes will live here locally and privately." />
      <CardFrame className="shell-journal-sheet">
        <div><span>Reading archive</span><strong>Local-first</strong></div>
        <p>Journal persistence arrives in a later phase. The shell is already prepared for the archive, filters and reading detail views.</p>
      </CardFrame>
    </div>
  );
}

export function NotFoundView() {
  return (
    <div className="shell-page">
      <PageIntro eyebrow="Palimpsest" title="That layer is not here." body="Choose one of the four primary paths to continue." />
    </div>
  );
}
