import React from 'react';
import { Link } from 'react-router-dom';
import { FileX, Home, FolderOpen } from 'lucide-react';

const NotFound: React.FC = () => {
    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            background: 'linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%)',
            padding: '2rem'
        }}>
            <div style={{
                maxWidth: '480px',
                width: '100%',
                textAlign: 'center',
                background: 'white',
                borderRadius: '20px',
                padding: '3rem 2.5rem',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.05)'
            }}>
                <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '20px',
                    background: 'linear-gradient(135deg, #fee2e2, #fecaca)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.5rem'
                }}>
                    <FileX size={36} color="#dc2626" />
                </div>

                <h1 style={{
                    fontSize: '1.75rem',
                    fontWeight: '700',
                    color: '#1e293b',
                    margin: '0 0 0.75rem'
                }}>
                    Page Not Found
                </h1>

                <p style={{
                    fontSize: '1rem',
                    color: '#64748b',
                    lineHeight: '1.6',
                    margin: '0 0 2rem'
                }}>
                    The page you're looking for doesn't exist or the link may have expired.
                    If you followed a document sharing link, it may no longer be available.
                </p>

                <div style={{
                    display: 'flex',
                    gap: '0.75rem',
                    justifyContent: 'center',
                    flexWrap: 'wrap'
                }}>
                    <Link
                        to="/"
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.75rem 1.5rem',
                            borderRadius: '12px',
                            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                            color: 'white',
                            textDecoration: 'none',
                            fontWeight: '600',
                            fontSize: '0.95rem',
                            transition: 'all 0.2s ease',
                            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
                        }}
                    >
                        <Home size={18} />
                        Go Home
                    </Link>
                    <Link
                        to="/dataroom"
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.75rem 1.5rem',
                            borderRadius: '12px',
                            background: '#f1f5f9',
                            color: '#475569',
                            textDecoration: 'none',
                            fontWeight: '600',
                            fontSize: '0.95rem',
                            transition: 'all 0.2s ease',
                            border: '1px solid #e2e8f0'
                        }}
                    >
                        <FolderOpen size={18} />
                        Dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
