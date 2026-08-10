import { useEffect, useMemo, useRef, useState } from 'react';
import Dither from '../vendor/react-bits/Dither/Dither';
import MoltenMetal from '../vendor/react-bits/MoltenMetal/MoltenMetal';
import SpotlightCard from '../vendor/react-bits/SpotlightCard/SpotlightCard';

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
  const [entering, setEntering] = useState(false);
  const [entered, setEntered] = useState(false);
  const particles = useMemo(() => PARTICLES, []);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero || entered) return undefined;

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
  }, [entered]);

  const handleButtonMove = (event) => {
    if (!buttonRef.current || entering) return;
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

  const enterPalimpsest = () => {
    if (entering) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setEntering(true);

    window.setTimeout(() => {
      setEntered(true);
      setEntering(false);
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    }, reduced ? 180 : 820);
  };

  const returnToPortal = () => {
    setEntered(false);
    setEntering(false);
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  };

  if (entered) {
    return (
      <main className="home home--inside">
        <section className="portal-section" id="palimpsest-interface" aria-label="Palimpsest home">
          <div className="portal-shell">
            <button className="portal-return" type="button" onClick={returnToPortal}>
              <span aria-hidden="true">◇</span>
              <span>Return to portal</span>
            </button>

            <div className="portal-section__head">
              <span className="portal-section__eyebrow">Palimpsest</span>
              <h2>Choose a layer.</h2>
              <p>
                Learn the system, read cards in context, or return to the meanings you have
                discovered over time.
              </p>
            </div>

            <div className="portal-grid">
              <SpotlightCard className="portal-tile">
                <span className="portal-tile__number">I · LEARN</span>
                <h3>Learn</h3>
                <p>Follow the Fool’s Journey and understand suits, numbers, courts and reversals.</p>
              </SpotlightCard>

              <SpotlightCard className="portal-tile">
                <span className="portal-tile__number">II · READ</span>
                <h3>Read</h3>
                <p>Interpret each position, then uncover the thread connecting the whole spread.</p>
              </SpotlightCard>

              <SpotlightCard className="portal-tile">
                <span className="portal-tile__number">III · REFLECT</span>
                <h3>Reflect</h3>
                <p>Keep a private history of readings, notes and patterns that become personal.</p>
              </SpotlightCard>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className={`home ${entering ? 'is-entering' : ''}`}>
      <section className="hero" ref={heroRef} aria-label="Enter Palimpsest">
        <div className="hero__field" aria-hidden="true">
          <Dither
            waveColor={[0.43, 0.19, 0.68]}
            enableMouseInteraction
            mouseRadius={0.3}
            colorNum={5}
            pixelSize={2}
            waveAmplitude={0.32}
            waveFrequency={2.7}
            waveSpeed={0.04}
          />
        </div>

        <div className="hero__metal" aria-hidden="true">
          <MoltenMetal
            color1="#1B0C2E"
            color2="#6F3FA8"
            color3="#D6B45C"
            speed={0.2}
            scale={4.6}
            detail={3}
            glow={1.45}
            coreSize={0.08}
            swirl={0.9}
            fold={-0.18}
            blackPoint={0.07}
            brightness={1.15}
            grain
            grainIntensity={0.03}
            mouseInteraction
            mouseStrength={0.18}
            opacity={0.88}
          />
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
              <img
                className="portal-card"
                src={asset('cards/tarot_card_back.png')}
                alt="Palimpsest tarot card back"
              />
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
              disabled={entering}
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
