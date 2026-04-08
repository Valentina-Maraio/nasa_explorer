import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            padding: '40px',
            textAlign: 'center',
            background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.9) 0%, rgba(15, 10, 20, 0.95) 100%)',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            fontFamily: "'Courier New', monospace",
            color: '#00ff9f',
          }}
        >
          <h1 style={{ fontSize: '2rem', marginBottom: '20px', textShadow: '0 0 10px #00ff9f' }}>
            ⚠ SYSTEM ERROR
          </h1>
          <div
            style={{
              background: 'rgba(255, 0, 0, 0.1)',
              border: '1px solid rgba(255, 0, 0, 0.3)',
              padding: '20px',
              borderRadius: '2px',
              maxWidth: '600px',
              marginBottom: '30px',
              textAlign: 'left',
            }}
          >
            <p style={{ margin: '10px 0', color: '#ff6b6b' }}>
              <strong>Error:</strong> {this.state.error?.message || 'Unknown error'}
            </p>
            {this.state.errorInfo && (
              <details style={{ marginTop: '15px', fontSize: '0.85rem' }}>
                <summary style={{ cursor: 'pointer', color: '#00ffff' }}>Technical Details</summary>
                <pre
                  style={{
                    background: 'rgba(0, 0, 0, 0.5)',
                    padding: '10px',
                    overflow: 'auto',
                    marginTop: '10px',
                    color: 'rgba(0, 255, 159, 0.7)',
                  }}
                >
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
          <button
            onClick={this.handleReset}
            style={{
              padding: '12px 30px',
              background: 'rgba(0, 255, 159, 0.1)',
              border: '1px solid rgba(0, 255, 159, 0.5)',
              color: '#00ff9f',
              cursor: 'pointer',
              borderRadius: '2px',
              fontSize: '1rem',
              textShadow: '0 0 5px #00ff9f',
            }}
          >
            ▶ REINITIALIZE SYSTEM
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
