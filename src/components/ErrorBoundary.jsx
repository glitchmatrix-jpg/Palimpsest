import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('Palimpsest shell error', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="shell-fallback" role="alert">
          <div className="shell-fallback__mark">◇</div>
          <h1>A layer failed to open.</h1>
          <p>Reload Palimpsest to return to the last stable state.</p>
          <button type="button" onClick={() => window.location.reload()}>Reload</button>
        </main>
      );
    }

    return this.props.children;
  }
}
