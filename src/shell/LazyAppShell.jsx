import { lazy, Suspense } from 'react';

const AppShell = lazy(() => import('./AppShell'));

export default function LazyAppShell(props) {
  return (
    <Suspense fallback={<main className="app-shell" aria-busy="true" aria-label="Loading Palimpsest" />}>
      <AppShell {...props} />
    </Suspense>
  );
}
