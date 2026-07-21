import { Component } from "react";
import "./ErrorBoundary.css";

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-boundary-content">
            <h2>Something went wrong</h2>
            <p>An unexpected error occurred. Please try refreshing the page.</p>
            {this.props.fallback || (
              <button
                className="error-boundary-retry"
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                }}
              >
                Try again
              </button>
            )}
            <details className="error-boundary-details">
              <summary>Error details</summary>
              <pre>{this.state.error?.message}</pre>
            </details>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
