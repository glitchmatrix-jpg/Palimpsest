import ErrorBoundary from './components/ErrorBoundary';
import Home from './pages/Home';
import { RouterProvider } from './shell/router';

export default function App() {
  return (
    <ErrorBoundary>
      <RouterProvider>
        <Home />
      </RouterProvider>
    </ErrorBoundary>
  );
}
