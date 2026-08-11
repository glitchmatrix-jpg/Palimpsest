import { CardFrame, SectionEyebrow } from '../components/ui/Primitives';
import CardLibrary from '../components/cards/CardLibrary';
import LearnCourse from '../components/learn/LearnCourse';
import FoolsJourney from '../components/journey/FoolsJourney';
import ReadExperience from '../components/read/ReadExperience61';
import { usePalimpsestRouter } from './router';

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
  const { navigate } = usePalimpsestRouter();
  return (
    <div className="shell-page shell-page--learn">
      <PageIntro eyebrow="I · Learn" title="Learn the system, then read without a crutch." body="Tarot becomes easier when you stop memorizing seventy-eight isolated answers. Learn the structure underneath the deck, then use context to make the reading specific." />
      <button className="journey-launch" type="button" onClick={() => navigate('/journey')}>
        <span>THE MAJOR ARCANA</span>
        <strong>Walk the Fool’s Journey</strong>
        <p>Twenty-two cards as one continuous sequence of development, crisis, correction and integration.</p>
        <i>Enter journey →</i>
      </button>
      <LearnCourse />
    </div>
  );
}

export function JourneyView() {
  return <FoolsJourney />;
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
  return <ReadExperience />;
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
