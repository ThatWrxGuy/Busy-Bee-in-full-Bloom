import { Component } from 'react';
import { Button } from './ui/button';

/**
 * Error Boundary Component
 * Catches JavaScript errors anywhere in the component tree
 * and displays a fallback UI instead of crashing the app
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to console in development
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // In production, you would send this to an error reporting service
    // like Sentry, Bugsnag, etc.
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <div className="max-w-md w-full text-center">
            <div className="mb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-destructive/10 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-destructive"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-foreground">Something went wrong</h1>
              <p className="text-foreground-muted mt-2">
                We're sorry, but something unexpected happened.
              </p>
            </div>

            <div className="space-y-4">
              <Button onClick={this.handleReset}>Try again</Button>

              <div>
                <button
                  onClick={() => (window.location.href = '/')}
                  className="text-sm text-foreground-muted hover:text-foreground underline"
                >
                  Go to homepage
                </button>
              </div>
            </div>

            {/* Show error details in development */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-foreground-muted mb-2">
                  Error Details
                </summary>
                <pre className="p-4 bg-card rounded-lg text-xs overflow-auto border border-border">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export { ErrorBoundary };
