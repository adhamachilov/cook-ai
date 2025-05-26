import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ errorInfo });
    console.error('Uncaught error:', error, errorInfo);
  }

  public render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '20px',
          maxWidth: '800px',
          margin: '0 auto',
          fontFamily: 'sans-serif',
          backgroundColor: '#fff',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          marginTop: '50px'
        }}>
          <h1 style={{ color: '#e67e22' }}>Something went wrong</h1>
          <details style={{ 
            whiteSpace: 'pre-wrap',
            backgroundColor: '#f8f8f8',
            padding: '10px',
            borderRadius: '4px',
            marginBottom: '20px',
            border: '1px solid #ddd'
          }}>
            <summary style={{ 
              cursor: 'pointer',
              fontWeight: 'bold',
              padding: '8px',
              backgroundColor: '#eee'
            }}>
              Error Details
            </summary>
            <p style={{ color: 'red', fontWeight: 'bold' }}>
              {this.state.error && this.state.error.toString()}
            </p>
            <p style={{ marginTop: '10px' }}>Component Stack:</p>
            <pre style={{ overflow: 'auto' }}>
              {this.state.errorInfo && this.state.errorInfo.componentStack}
            </pre>
          </details>
          <p>
            This error boundary was added to help diagnose the white screen issue.
            The above details show which component is causing the problem.
          </p>
          <div style={{ marginTop: '20px' }}>
            <button 
              onClick={() => window.location.reload()}
              style={{
                backgroundColor: '#e67e22',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
