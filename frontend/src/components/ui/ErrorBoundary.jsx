import { Component } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-dark-800 border border-white/10 rounded-2xl p-8 text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-lg font-bold text-white mb-2">Something went wrong</h2>
          <p className="text-sm text-gray-400 mb-6">
            {this.state.error?.message || 'An unexpected error occurred'}
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="flex-1 bg-dark-700 border border-white/10 text-gray-300 py-3 rounded-xl text-sm font-medium hover:bg-dark-600 transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" /> Try again
            </button>
            <button
              onClick={() => window.location.href = '/dashboard'}
              className="flex-1 bg-brand-500 hover:bg-brand-600 text-white py-3 rounded-xl text-sm font-medium transition-colors"
            >
              Go home
            </button>
          </div>
        </div>
      </div>
    );
  }
}