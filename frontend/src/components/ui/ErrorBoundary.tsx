import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';
import Button from './Button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const isDevelopment = import.meta.env.DEV;

      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 mx-auto mb-5 rounded-2xl bg-red-50 flex items-center justify-center">
              <AlertTriangle className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Something went wrong
            </h2>
            <p className="text-slate-600 mb-6">
              We're sorry, but something unexpected happened. You can try reloading the page or return home.
            </p>

            {/* Development mode - show error details */}
            {isDevelopment && this.state.error && (
              <div className="mb-6 p-4 rounded-xl bg-slate-100 text-left">
                <p className="text-xs font-mono text-red-600 mb-2">
                  {this.state.error.toString()}
                </p>
                {this.state.errorInfo && (
                  <details className="text-xs text-slate-600">
                    <summary className="cursor-pointer font-medium mb-2">Stack trace</summary>
                    <pre className="overflow-auto text-[10px]">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                )}
              </div>
            )}

            <div className="flex gap-3 justify-center">
              <Button variant="secondary" onClick={this.handleRetry} className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4" />
                Try Again
              </Button>
              <Button onClick={this.handleGoHome} className="flex items-center gap-2">
                <Home className="w-4 h-4" />
                Go Home
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
