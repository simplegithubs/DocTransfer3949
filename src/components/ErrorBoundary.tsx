import React, { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error: Error): Partial<State> {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        this.setState({ errorInfo });
        console.error('React Error Boundary caught an error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                    backgroundColor: '#f9fafb',
                    padding: '2rem'
                }}>
                    <div style={{
                        maxWidth: '600px',
                        width: '100%',
                        backgroundColor: 'white',
                        borderRadius: '16px',
                        padding: '2.5rem',
                        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)',
                        textAlign: 'center'
                    }}>
                        <div style={{
                            width: '64px',
                            height: '64px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 1.5rem',
                            fontSize: '1.75rem'
                        }}>
                            ⚠️
                        </div>
                        <h1 style={{
                            fontSize: '1.5rem',
                            fontWeight: 700,
                            color: '#1f2937',
                            marginBottom: '0.75rem'
                        }}>
                            Something went wrong
                        </h1>
                        <p style={{
                            color: '#6b7280',
                            fontSize: '1rem',
                            lineHeight: 1.6,
                            marginBottom: '1.5rem'
                        }}>
                            The application encountered an unexpected error. Please try refreshing the page.
                        </p>
                        {this.state.error && (
                            <div style={{
                                backgroundColor: '#fef2f2',
                                border: '1px solid #fecaca',
                                borderRadius: '8px',
                                padding: '1rem',
                                marginBottom: '1.5rem',
                                textAlign: 'left',
                                fontSize: '0.8rem',
                                fontFamily: 'monospace',
                                color: '#991b1b',
                                wordBreak: 'break-word',
                                maxHeight: '200px',
                                overflow: 'auto'
                            }}>
                                <strong>{this.state.error.name}:</strong> {this.state.error.message}
                            </div>
                        )}
                        <button
                            onClick={() => window.location.reload()}
                            style={{
                                padding: '0.75rem 2rem',
                                borderRadius: '12px',
                                border: 'none',
                                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                                color: 'white',
                                fontSize: '1rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
                            }}
                        >
                            Refresh Page
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
