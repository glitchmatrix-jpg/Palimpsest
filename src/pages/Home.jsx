import { useEffect, useMemo, useRef, useState } from 'react';
import AppShell from '../shell/LazyAppShell';
import { DitherGate as Dither, MoltenGate as MoltenMetal } from '../components/performance/PortalEffects';

const asset = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;

const PARTICLES = [
  [10, 18, 0.9, 0.2], [18, 71, 0.55, 1.4], [26, 37, 0.75, 2.1],
  [34, 82, 0.45, 0.8], [40, 14, 0.5, 2.8], [46, 62, 0.8, 1.1],
  [54, 28, 0.45, 3.2], [60, 77, 0.7, 0.4], [68, 19, 0.6, 2.4],
  [74, 58, 0.85, 1.7], [82, 33, 0.55, 3.5], [89, 76, 0.65, 0.9],
  [15, 47, 0.4, 3.0], [29, 10, 0.5, 1.0], [71, 90, 0.5, 2.6],
  [91, 48, 0.45, 1.9], [7, 84, 0.45, 2.3], [49, 91, 0.65, 1.3]
];

export default function Home() {
  const heroRef = useRef(null);
  const buttonRef = useRef(null);
  const transitionTimerRef = useRef(null);
  const [entering, setEntering] = useState(false);
  const [entered, setEntered] = useState(false);
  const [transitionPrep, setTransitionPrep] = useState(false);
  const [coarseMotion, setCoarseMotion] = useState(false);
  const particles = useMemo(() => PARTICLES, []);

  useEffect(() => {
    const query = window.matchMedia('(pointer: coarse), (max-width: 600px)');
    const sync = () => setCoarseMotion(query.matches);
    sync();
    query.addEventListener?.('change', sync);
    return () => query.removeEventListener?.('change', sync);
  }, []);

  useEffect(() => () => {
    if (transitionTimerRef.current) window.clearTimeout(transitionTimerRef.current);
  }, []);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero || entered || transitionPrep) return undefined;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    if (reduced || !finePointer) return undefined;

    const move = (event) => {
      const rect = hero.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      hero.style.setProperty('--pointer-x', x.toFixed(3));
      hero.style.setProperty('--pointer-y', y.toFixed(3));
      hero.style.setProperty('--tilt-x', `${(-y * 7).toFixed(2)}deg`);
      hero.style.setProperty('--tilt-y', `${(x * 7).toFixed(2)}deg`);
    };

    const leave = () => {
      hero.style.setProperty('--pointer-x', '0');
      hero.style.setProperty('--pointer-y', '0');
      hero.style.setProperty('--tilt-x', '0deg');
      hero.style.setProperty('--tilt-y', '0deg');
    };

    hero.addEventListener('pointermove', move);
    hero.addEventListener('pointerleave', leave);
    return () => {
      hero.removeEventListener('pointermove', move);
      hero.removeEventListener('pointerleave', leave);
    };
  }, [entered, transitionPrep]);

  const handleButtonMove = (event) => {
    if (!buttonRef.current || entering || transitionPrep) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const x = (event.clientX - rect.left - rect.width / 2) * 0.055;
    const y = (event.clientY - rect.top - rect.height / 2) * 0.055;
    buttonRef.current.style.setProperty('--mag-x', `${x.toFixed(1)}px`);
    buttonRef.current.style.setProperty('--mag-y', `${y.toFixed(1)}px`);
  };

  const resetButton = () => {
    if (!buttonRef.current) return;
    buttonRef.current.style.setProperty('--mag-x', '0px');
    buttonRef.current.style.setProperty('--mag-y', '0px');
  };

  const finishEntry = (duration) => {
    transitionTimerRef.current = window.setTimeout(() => {
      setEntered(true);
      setEntering(false);
      setTransitionPrep(false);
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    }, duration);
  };

  const beginPreparedDive = (duration) => {
    setTransitionPrep(true);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setEntering(true);
        finishEntry(duration);
      });
    });
  };

  const enterPalimpsest = () => {
    if (entering || transitionPrep) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduced) {
      setEntering(true);
      finishEntry(220);
      return;
    }

    beginPreparedDive(coarseMotion ? 1320 : 1450);
  };

  const returnToPortal = () => {
    if (transitionTimerRef.current) window.clearTimeout(transitionTimerRef.current);
    setEntered(false);
    setEntering(false);
    setTransitionPrep(false);
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  };

  if (entered) {
    return (
      <>
        <div className="inside-entry-wash" aria-hidden="true" />
        <AppShell onReturnToPortal={returnToPortal} />
      </>
    );
  }

  const suspendWebGL = transitionPrep && coarseMotion;
  const ditherColor = coarseMotion ? [0.30, 0.055, 0.36] : [0.50, 0.21, 0.78];
  const moltenPalette = coarseMotion
    ? { color1: '#0D0715', color2: '#4A1F68', color3: '#C9A85F' }
    : { color1: '#1A092C', color2: '#7541AF', color3: '#E0BD61' };

  return (
    <main className={`home ${transitionPrep ? 'is-transition-prep' : ''} ${entering ? 'is-entering' : ''}`}>
      <section className="hero" ref={heroRef} aria-label="Enter Palimpsest">
        <div className="hero__field" aria-hidden="true">
          {!suspendWebGL && (
            <Dither
              waveColor={ditherColor}
              disableAnimation={entering}
              enableMouseInteraction={!entering}
              mouseRadius={0.3}
              colorNum={coarseMotion ? 5 : 4}
              pixelSize={2}
              waveAmplitude={coarseMotion ? 0.30 : 0.35}
              waveFrequency={coarseMotion ? 2.35 : 2.55}
              waveSpeed={coarseMotion ? 0.020 : 0.026}
            />
          )}
        </div>

        <div className="hero__metal" aria-hidden="true">
          {!suspendWebGL && (
            <MoltenMetal
              color1={moltenPalette.color1}
              color2={moltenPalette.color2}
              color3={moltenPalette.color3}
              speed={coarseMotion ? 0.11 : 0.14}
              scale={coarseMotion ? 5.45 : 5.15}
              detail={3}
              glow={coarseMotion ? 1.36 : 1.55}
              coreSize={0.075}
              swirl={coarseMotion ? 0.62 : 0.72}
              fold={-0.16}
              blackPoint={coarseMotion ? 0.095 : 0.075}
              brightness={coarseMotion ? 1.02 : 1.18}
              grain
              grainIntensity={coarseMotion ? 0.018 : 0.024}
              mouseInteraction={!entering}
              mouseStrength={0.14}
              opacity={coarseMotion ? 0.72 : 0.9}
            />
          )}
        </div>

        <div className="hero__depth hero__depth--far" aria-hidden="true" />
        <div className="hero__depth hero__depth--near" aria-hidden="true" />
        <div className="hero__rays" aria-hidden="true" />
        <div className="hero__rings" aria-hidden="true" />

        <div className="hero__particles" aria-hidden="true">
          {particles.map(([x, y, scale, delay], index) => (
            <span
              className="portal-particle"
              key={`${x}-${y}-${index}`}
              style={{
                '--x': `${x}%`,
                '--y': `${y}%`,
                '--particle-scale': scale,
                '--delay': `${delay}s`
              }}
            />
          ))}
        </div>

        <div className="hero__vignette" aria-hidden="true" />
        <div className="hero__grain" aria-hidden="true" />
        <div className="portal-flash" aria-hidden="true" />

        <div className="portal-stage">
          <header className="portal-heading">
            <p className="portal-kicker">A symbolic space for learning and reading tarot</p>
            <h1 className="wordmark">PALIMPSEST</h1>
            <p className="hero__tag">
              <span>Learn the symbols.</span>
              <span>Read the layers.</span>
            </p>
          </header>

          <div className="portal-core">
            <div className="portal-orbit portal-orbit--one" aria-hidden="true" />
            <div className="portal-orbit portal-orbit--two" aria-hidden="true" />
            <div className="hero__card-halo" aria-hidden="true" />

            <div className="portal-card-wrap">
              <div className="portal-card-edge" aria-hidden="true" />
              <img className="portal-card" src={asset('cards/tarot_card_back.png')} alt="Palimpsest tarot card back" />
              <div className="portal-card-sheen" aria-hidden="true" />
            </div>
          </div>

          <div className="hero__enter">
            <button
              ref={buttonRef}
              className="enter-button"
              type="button"
              onClick={enterPalimpsest}
              onPointerMove={handleButtonMove}
              onPointerLeave={resetButton}
              disabled={entering || transitionPrep}
            >
              <span>Enter Palimpsest</span>
              <span className="enter-button__glyph" aria-hidden="true">◇</span>
            </button>
            <p className="enter-hint">Pass through the card</p>
          </div>
        </div>
      </section>
    </main>
  );
}
