import { lazy, Suspense, useMemo } from 'react';

const Dither = lazy(() => import('../../vendor/react-bits/Dither/Dither'));
const MoltenMetal = lazy(() => import('../../vendor/react-bits/MoltenMetal/MoltenMetal'));

function supportsWebGL() {
  if (typeof document === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    return Boolean(
      canvas.getContext('webgl2', { failIfMajorPerformanceCaveat: true }) ||
      canvas.getContext('webgl', { failIfMajorPerformanceCaveat: true })
    );
  } catch {
    return false;
  }
}

export function resolveGraphicsMode() {
  if (typeof window === 'undefined') return 'off';
  const forced = new URLSearchParams(window.location.search).get('graphics');
  if (forced === 'off') return 'off';
  if (!supportsWebGL()) return 'off';
  if (forced === 'low') return 'low';
  if (forced === 'full') return 'full';

  const memory = Number(navigator.deviceMemory || 0);
  const cores = Number(navigator.hardwareConcurrency || 0);
  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
  if (reduced || (memory > 0 && memory <= 4) || (cores > 0 && cores <= 4)) return 'low';
  return 'full';
}

function useGraphicsMode() {
  return useMemo(resolveGraphicsMode, []);
}

export function DitherGate(props) {
  const mode = useGraphicsMode();
  if (mode === 'off') return null;
  return <Suspense fallback={null}><Dither {...props} /></Suspense>;
}

export function MoltenGate(props) {
  const mode = useGraphicsMode();
  if (mode !== 'full') return null;
  return <Suspense fallback={null}><MoltenMetal {...props} /></Suspense>;
}
