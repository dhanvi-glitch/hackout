import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('OptiGrid ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return typeof this.props.fallback === 'function'
          ? this.props.fallback({ error: this.state.error, reset: this.handleReset })
          : this.props.fallback;
      }

      return (
        <div className="bg-[#131B29] border border-amber-500/40 rounded-xl p-6 shadow-xl space-y-4 my-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-lg shrink-0 border border-amber-500/20">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-slate-100 text-base">
                ⚠️ OptiGrid encountered an unexpected error.
              </h3>
              <p className="text-sm text-slate-300">
                The application is still running, but this section could not render.
              </p>
            </div>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-3 font-mono text-xs text-rose-300 break-all">
            <span className="font-bold text-slate-400 block mb-1">Error:</span>
            {this.state.error?.message || 'Unknown render error occurred'}
          </div>

          <div className="flex items-center gap-3 pt-1">
            <button
              type="button"
              onClick={this.handleReset}
              className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs rounded-lg transition-colors cursor-pointer shadow-md shadow-cyan-950/30"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Try Again
            </button>
            <span className="text-[11px] text-slate-500 font-mono">
              OptiGrid fault isolation active
            </span>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
