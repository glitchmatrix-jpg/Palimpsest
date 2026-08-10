import Dither from '../vendor/react-bits/Dither/Dither';
import MoltenMetal from '../vendor/react-bits/MoltenMetal/MoltenMetal';
import TiltedCard from '../vendor/react-bits/TiltedCard/TiltedCard';
import SpotlightCard from '../vendor/react-bits/SpotlightCard/SpotlightCard';
import SplitText from '../vendor/react-bits/SplitText/SplitText';

const asset = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;

export default function Home() {
  const scrollIn = () => document.querySelector('#portals')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <main className="home">
      <section className="hero">
        <div className="hero__field">
          <Dither
            waveColor={[0.42, 0.22, 0.68]}
            enableMouseInteraction
            mouseRadius={0.32}
            colorNum={5}
            pixelSize={2}
            waveAmplitude={0.28}
            waveFrequency={2.8}
            waveSpeed={0.035}
          />
        </div>

        <div className="hero__metal">
          <MoltenMetal />
        </div>

        <div className="hero__vignette" />
        <div className="hero__grain" />

        <div className="hero__content">
          <div className="hero__copy">
            <SplitText text="PALIMPSEST" className="wordmark" tag="h1" />
            <p className="hero__tag">Learn the symbols. Read the layers.</p>
          </div>

          <div className="hero__card-zone">
            <div className="hero__card-halo" />
            <TiltedCard
              imageSrc={asset('cards/tarot_card_back.png')}
              altText="Palimpsest tarot card back"
              rotateAmplitude={4}
              scaleOnHover={1.025}
            />
          </div>

          <div className="hero__enter">
            <button className="enter-button" type="button" onClick={scrollIn}>
              Enter Palimpsest
            </button>
          </div>
        </div>
      </section>

      <section className="portal-section" id="portals">
        <div className="portal-section__head">
          <span className="portal-section__eyebrow">Three ways inward</span>
          <h2>Every card has layers.</h2>
          <p>
            Learn the symbolic system, read cards in context, and return to the meanings
            you discover over time.
          </p>
        </div>

        <div className="portal-grid">
          <SpotlightCard className="portal-tile">
            <span className="portal-tile__number">I · LEARN</span>
            <h3>Learn</h3>
            <p>Follow the Fool’s Journey, master the four suits, numbers, courts and reversals.</p>
          </SpotlightCard>

          <SpotlightCard className="portal-tile">
            <span className="portal-tile__number">II · READ</span>
            <h3>Read</h3>
            <p>Interpret each position, then uncover the thread connecting the whole spread.</p>
          </SpotlightCard>

          <SpotlightCard className="portal-tile">
            <span className="portal-tile__number">III · REFLECT</span>
            <h3>Reflect</h3>
            <p>Keep a private journal of readings, notes and the patterns that become personal.</p>
          </SpotlightCard>
        </div>
      </section>
    </main>
  );
}
