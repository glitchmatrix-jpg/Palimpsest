import { SectionEyebrow } from '../components/ui/Primitives';
import {
  LazyCardLibrary as CardLibrary,
  LazyLearnCourse as LearnCourse,
  LazyFoolsJourney as FoolsJourney,
  LazyReadExperience as ReadExperience,
  LazyJournalExperience as JournalExperience,
} from './LazyRouteComponents';
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
      <PageIntro eyebrow="IV · Journal" title="Return to what the cards revealed." body="Saved readings live only in this browser unless you export them. Revisit the interpretation, add what happened afterward, and keep your own record without an account or cloud dependency." />
      <JournalExperience />
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
