import { lazy, Suspense } from 'react';

const CardLibrary = lazy(() => import('../components/cards/CardLibrary'));
const LearnCourse = lazy(() => import('../components/learn/LearnCourse'));
const FoolsJourney = lazy(() => import('../components/journey/FoolsJourney'));
const ReadExperience = lazy(() => import('../components/read/ReadExperience61'));
const JournalExperience = lazy(() => import('../components/journal/JournalExperience'));

function RouteFallback() {
  return <div className="shell-route-loading" role="status" aria-live="polite">Loading this layer…</div>;
}

function wrap(Component) {
  return function LazyRouteComponent(props) {
    return <Suspense fallback={<RouteFallback />}><Component {...props} /></Suspense>;
  };
}

export const LazyCardLibrary = wrap(CardLibrary);
export const LazyLearnCourse = wrap(LearnCourse);
export const LazyFoolsJourney = wrap(FoolsJourney);
export const LazyReadExperience = wrap(ReadExperience);
export const LazyJournalExperience = wrap(JournalExperience);
