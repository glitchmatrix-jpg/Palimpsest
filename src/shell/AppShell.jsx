import { useMemo, useState } from 'react';
import Modal from '../components/ui/Modal';
import { usePalimpsestRouter } from './router';
import { CardsView, JournalView, JourneyView, LearnView, NotFoundView, ReadView } from './RouteViews';

const NAV_ITEMS = [
  { route: '/learn', label: 'Learn', glyph: '◇' },
  { route: '/cards', label: 'Cards', glyph: '◈' },
  { route: '/read', label: 'Read', glyph: '✦' },
  { route: '/journal', label: 'Journal', glyph: '○' }
];

const ROUTES = {
  '/learn': LearnView,
  '/journey': JourneyView,
  '/cards': CardsView,
  '/read': ReadView,
  '/journal': JournalView
};

const isNavActive = (route, itemRoute) => itemRoute === '/learn' ? route === '/learn' || route === '/journey' : route === itemRoute;

export default function AppShell({ onReturnToPortal }) {
  const { route, navigate } = usePalimpsestRouter();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const ActiveView = useMemo(() => ROUTES[route] || NotFoundView, [route]);

  return (
    <main className="app-shell">
      <div className="app-shell__dark-cap" aria-hidden="true" />

      <header className="shell-header">
        <button className="shell-brand" type="button" onClick={() => navigate('/learn')} aria-label="Palimpsest Learn home">
          <span className="shell-brand__mark" aria-hidden="true">◇</span>
          <span>PALIMPSEST</span>
        </button>

        <nav className="shell-nav shell-nav--desktop" aria-label="Primary navigation">
          {NAV_ITEMS.map((item) => {
            const active = isNavActive(route, item.route);
            return (
              <button
                key={item.route}
                type="button"
                className={active ? 'is-active' : ''}
                onClick={() => navigate(item.route)}
                aria-current={active ? 'page' : undefined}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="shell-header__actions">
          <button className="shell-orb" type="button" onClick={() => setSettingsOpen(true)} aria-label="Open settings">◌</button>
        </div>
      </header>

      <div className="shell-rule" aria-hidden="true" />

      <section className="shell-surface" key={route}>
        <div className="shell-surface__glow" aria-hidden="true" />
        <div className="shell-content">
          <ActiveView />
        </div>
      </section>

      <nav className="shell-nav shell-nav--mobile" aria-label="Primary navigation">
        {NAV_ITEMS.map((item) => {
          const active = isNavActive(route, item.route);
          return (
            <button
              key={item.route}
              type="button"
              className={active ? 'is-active' : ''}
              onClick={() => navigate(item.route)}
              aria-current={active ? 'page' : undefined}
            >
              <span className="shell-mobile-glyph" aria-hidden="true">{item.glyph}</span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <Modal open={settingsOpen} title="Palimpsest settings" onClose={() => setSettingsOpen(false)}>
        <div className="settings-list">
          <div><span>Storage</span><strong>Local to this browser</strong></div>
          <div><span>Motion</span><strong>Follows system preference</strong></div>
          <button type="button" className="settings-return" onClick={() => { setSettingsOpen(false); onReturnToPortal?.(); }}>
            Return to portal
          </button>
        </div>
      </Modal>
    </main>
  );
}
