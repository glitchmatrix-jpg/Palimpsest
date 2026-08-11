import { lazy, Suspense, useMemo } from 'react';
import { detectGraphicsMode } from '../../utils/graphics';

const Dither = lazy(() => import('../../vendor/react-bits/Dither/Dither'));
const MoltenMetal = lazy(() => import('../../vendor/react-bits/MoltenMetal/MoltenMetal'));

function useGraphicsMode() {
  return useMemo(detectGraphicsMode, []);
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
