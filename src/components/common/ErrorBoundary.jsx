import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 text-center bg-white dark:bg-zinc-900 rounded-3xl border border-slate-250 dark:border-zinc-800 max-w-md mx-auto my-12 shadow-sm">
          <h3 className="text-base font-extrabold text-red-500 mb-2">Something went wrong</h3>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mb-5 leading-relaxed">
            An unexpected error occurred while rendering this section. This is often caused by browser extension interventions or conflicts.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2.5 rounded-xl bg-slate-950 dark:bg-zinc-100 text-white dark:text-slate-950 text-xs font-bold active:scale-95 transition-all cursor-pointer"
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
