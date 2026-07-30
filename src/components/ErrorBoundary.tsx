import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  showDetails: boolean;
  copiedErrorId: boolean;
  errorId: string;
  timestamp: string;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    showDetails: false,
    copiedErrorId: false,
    errorId: '',
    timestamp: '',
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    const randomHash = Math.random().toString(36).substring(2, 9).toUpperCase();
    return {
      hasError: true,
      error,
      errorId: `ERR_${randomHash}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error inside KONTAGI boundary:', error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  private handleResetSession = () => {
    try {
      localStorage.removeItem('kontagi_auth_session');
      localStorage.removeItem('kontagi_auth');
      localStorage.removeItem('kontagi_user_email');
    } catch {}
    this.setState({ hasError: false, error: null });
    window.location.href = '/login';
  };

  private handleReturnToDashboard = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/script-intelligence';
  };

  private toggleDetails = () => {
    this.setState(prev => ({ showDetails: !prev.showDetails }));
  };

  private handleCopyError = () => {
    const errorText = `Error ID: ${this.state.errorId}\nRoute: ${window.location.pathname}\nTimestamp: ${this.state.timestamp}\nMessage: ${this.state.error?.message || 'Unknown error'}\nStack: ${this.state.error?.stack || 'No stack trace available'}`;
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(errorText);
      this.setState({ copiedErrorId: true });
      setTimeout(() => this.setState({ copiedErrorId: false }), 2000);
    }
  };

  public render() {
    if (this.state.hasError) {
      const pathname = typeof window !== 'undefined' ? window.location.pathname : '/';
      
      return (
        <div
          role="alert"
          aria-live="assertive"
          style={{
            minHeight: '100vh',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            backgroundColor: '#FAF8F3',
            fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            color: '#162A3B',
            boxSizing: 'border-box'
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '640px',
              backgroundColor: '#FFFBF9',
              borderRadius: '20px',
              border: '1px solid #FFDCD2',
              boxShadow: '0 20px 40px -15px rgba(255, 107, 61, 0.06), 0 4px 12px -2px rgba(22, 42, 59, 0.04)',
              padding: '32px 36px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              textAlign: 'left',
              animation: 'toastSlideInUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
              boxSizing: 'border-box'
            }}
          >
            {/* Header Row: Warning Icon + Title + Status Sync Badge */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 9V14M12 17.5H12.01M21.41 11.58L13.41 3.58C12.63 2.8 11.37 2.8 10.59 3.58L2.59 11.58C1.81 12.36 1.81 13.62 2.59 14.4L10.59 22.4C11.37 23.18 12.63 23.18 13.41 22.4L21.41 14.4C22.19 13.62 22.19 12.36 21.41 11.58Z" stroke="#FF6B3D" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <h1 style={{ fontSize: '18px', fontWeight: 700, color: '#162A3B', margin: 0, letterSpacing: '-0.01em' }}>
                  Module Couldn't Be Loaded
                </h1>
              </div>

              {/* Status Sync Badge */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '4px 10px',
                  borderRadius: '9999px',
                  backgroundColor: '#ECFDF5',
                  border: '1px solid #A7F3D0',
                  color: '#047857',
                  fontSize: '11px',
                  fontWeight: 600
                }}
              >
                <span>✓</span>
                <span>All work saved</span>
              </div>
            </div>

            {/* Description */}
            <p style={{ fontSize: '14px', lineHeight: '1.55', color: '#3D5A73', margin: '0 0 20px 0', maxWidth: '540px' }}>
              We couldn't load this section right now. Your work is safe. Upgrade to retry analyzing, or return to your dashboard. Your library and existing results remain fully accessible.
            </p>

            {/* CTA Buttons Row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', flexWrap: 'wrap', marginBottom: '16px' }}>
              <button
                onClick={this.handleRetry}
                style={{
                  padding: '9px 20px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: '#162A3B',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(22, 42, 59, 0.2)',
                  transition: 'all 0.15s ease',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = '#FF6B3D';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = '#162A3B';
                }}
              >
                <span>Retry Loading</span>
              </button>

              <button
                onClick={this.handleReturnToDashboard}
                style={{
                  padding: '9px 18px',
                  borderRadius: '8px',
                  border: '1px solid #E8E3DA',
                  backgroundColor: '#FFFFFF',
                  color: '#162A3B',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = '#FAF8F3';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = '#FFFFFF';
                }}
              >
                Return to Dashboard
              </button>
            </div>

            {/* Collapsible Error Diagnostics */}
            <div style={{ width: '100%', borderTop: '1px solid #E8E3DA', paddingTop: '14px' }}>
              <button
                onClick={this.toggleDetails}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#3D5A73',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 0'
                }}
              >
                <span>{this.state.showDetails ? 'Hide technical details' : 'Show technical details'}</span>
                <span style={{ fontSize: '10px', transform: this.state.showDetails ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }}>▼</span>
              </button>

              {this.state.showDetails && (
                <div
                  style={{
                    marginTop: '12px',
                    textAlign: 'left',
                    backgroundColor: '#1E293B',
                    borderRadius: '10px',
                    padding: '14px 16px',
                    color: '#E2E8F0',
                    fontSize: '12px',
                    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ color: '#94A3B8', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Diagnostics</span>
                    <button
                      onClick={this.handleCopyError}
                      style={{
                        background: 'rgba(255,255,255,0.1)',
                        border: 'none',
                        color: '#F8FAFC',
                        borderRadius: '6px',
                        padding: '3px 8px',
                        fontSize: '11px',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      {this.state.copiedErrorId ? '✓ Copied' : 'Copy Error ID'}
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '4px 10px', color: '#CBD5E1' }}>
                    <span style={{ color: '#94A3B8' }}>Component:</span>
                    <span>Kontagi Module Boundary</span>
                    <span style={{ color: '#94A3B8' }}>Route:</span>
                    <span>{pathname}</span>
                    <span style={{ color: '#94A3B8' }}>Error ID:</span>
                    <span style={{ color: '#FF6B3D' }}>{this.state.errorId || 'ERR_UNCAUGHT'}</span>
                    <span style={{ color: '#94A3B8' }}>Timestamp:</span>
                    <span>{this.state.timestamp}</span>
                  </div>

                  {this.state.error && (
                    <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #334155', color: '#FCA5A5', wordBreak: 'break-word', maxHeight: '90px', overflowY: 'auto' }}>
                      {this.state.error.message}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
