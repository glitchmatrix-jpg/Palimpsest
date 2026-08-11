import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const RouterContext = createContext(null);

const normalizeRoute = (value) => {
  const route = String(value || '/learn').replace(/^#/, '');
  if (!route.startsWith('/')) return `/${route}`;
  return route;
};

const readRoute = () => normalizeRoute(window.location.hash || '/learn');

export function RouterProvider({ children }) {
  const [route, setRoute] = useState(readRoute);

  useEffect(() => {
    const sync = () => setRoute(readRoute());
    window.addEventListener('hashchange', sync);
    return () => window.removeEventListener('hashchange', sync);
  }, []);

  const navigate = useCallback((nextRoute, { replace = false } = {}) => {
    const next = normalizeRoute(nextRoute);
    const nextHash = `#${next}`;

    if (replace) {
      window.history.replaceState(null, '', nextHash);
      setRoute(next);
      return;
    }

    if (window.location.hash !== nextHash) window.location.hash = next;
  }, []);

  const value = useMemo(() => ({ route, navigate }), [route, navigate]);
  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}

export function usePalimpsestRouter() {
  const context = useContext(RouterContext);
  if (!context) throw new Error('usePalimpsestRouter must be used inside RouterProvider');
  return context;
}
