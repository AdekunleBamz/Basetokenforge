"use client";

import { Component, ReactNode, ErrorInfo } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class EnhancedErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    this.props.onError?.(error, errorInfo);
    
    // Log to console in development
    if (process.env.NODE_ENV === "development") {
      console.error("Error caught by boundary:", error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[400px] flex items-center justify-center p-8">
          <div className="max-w-md w-full text-center">
            {/* Error icon */}
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center">
              <svg
                className="w-10 h-10 text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>

            {/* Error message */}
            <h2 className="text-2xl font-display font-bold text-white mb-2">
              Something went wrong
            </h2>
            <p className="text-white/60 mb-6">
              We encountered an unexpected error. Please try one of the options below.
            </p>

            {/* Error details (dev only) */}
            {process.env.NODE_ENV === "development" && this.state.error && (
              <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-left overflow-auto">
                <p className="text-red-400 font-mono text-sm break-all">
                  {this.state.error.message}
                </p>
                {this.state.errorInfo && (
                  <pre className="mt-2 text-red-400/60 font-mono text-xs whitespace-pre-wrap">
                    {this.state.errorInfo.componentStack}
                  </pre>
                )}
              </div>
            )}

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleRetry}
                className="px-6 py-3 rounded-xl bg-forge-orange text-base-dark font-semibold hover:bg-forge-gold transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Try Again
              </button>
              <button
                onClick={this.handleReload}
                className="px-6 py-3 rounded-xl bg-white/10 text-white font-semibold hover:bg-white/20 transition-colors"
              >
                Reload Page
              </button>
              <button
                onClick={this.handleGoHome}
                className="px-6 py-3 rounded-xl border border-white/20 text-white/70 font-medium hover:bg-white/5 transition-colors"
              >
                Go Home
              </button>
            </div>

            {/* Support info */}
            <p className="mt-8 text-white/40 text-sm">
              If the problem persists, please contact support or try again later.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Functional wrapper for easier use with hooks
interface ErrorBoundaryWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function ErrorBoundaryWrapper({ children, fallback }: ErrorBoundaryWrapperProps) {
  return (
    <EnhancedErrorBoundary fallback={fallback}>
      {children}
    </EnhancedErrorBoundary>
  );
}

// Section-level error boundary
export function SectionErrorBoundary({ children, sectionName }: { children: ReactNode; sectionName: string }) {
  return (
    <EnhancedErrorBoundary
      fallback={
        <div className="p-8 rounded-2xl bg-white/5 border border-white/10 text-center">
          <p className="text-white/60 mb-4">
            Unable to load {sectionName}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="text-forge-orange hover:text-forge-gold transition-colors text-sm"
          >
            Reload page
          </button>
        </div>
      }
    >
      {children}
    </EnhancedErrorBoundary>
  );
}
