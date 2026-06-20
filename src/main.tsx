import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { ClerkProvider } from '@clerk/clerk-react'
import ErrorBoundary from './components/ErrorBoundary'

// Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

try {
  if (!PUBLISHABLE_KEY) {
    createRoot(document.getElementById('root')!).render(
      <StrictMode>
        <ErrorBoundary>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            fontFamily: 'system-ui, sans-serif',
            backgroundColor: '#f9fafb',
            color: '#1f2937'
          }}>
            <div style={{
              padding: '2rem',
              backgroundColor: 'white',
              borderRadius: '0.5rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              maxWidth: '500px',
              textAlign: 'center'
            }}>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#dc2626' }}>
                Missing Configuration
              </h1>
              <p style={{ marginBottom: '1rem' }}>
                The application cannot start because the Clerk Publishable Key is missing.
              </p>
              <div style={{
                backgroundColor: '#f3f4f6',
                padding: '1rem',
                borderRadius: '0.375rem',
                fontFamily: 'monospace',
                marginBottom: '1rem',
                wordBreak: 'break-all'
              }}>
                VITE_CLERK_PUBLISHABLE_KEY
              </div>
              <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                Please check your Vercel Project Settings or local .env file to ensure the key is being picked up.
              </p>
            </div>
          </div>
        </ErrorBoundary>
      </StrictMode>
    )
  } else {
    createRoot(document.getElementById('root')!).render(
      <StrictMode>
        <ErrorBoundary>
          <ClerkProvider
            publishableKey={PUBLISHABLE_KEY}
            signInFallbackRedirectUrl="/dataroom"
            signUpFallbackRedirectUrl="/dataroom"
            afterSignOutUrl="/"
          >
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </ClerkProvider>
        </ErrorBoundary>
      </StrictMode>,
    )
  }
} catch (err) {
  // Catch any module-level initialization errors
  const root = document.getElementById('root');
  if (root) {
    root.innerHTML = `
      <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;font-family:system-ui,sans-serif;background:#f9fafb;padding:2rem">
        <div style="max-width:600px;width:100%;background:white;border-radius:16px;padding:2.5rem;box-shadow:0 10px 40px rgba(0,0,0,0.08);text-align:center">
          <h1 style="font-size:1.5rem;font-weight:700;color:#dc2626;margin-bottom:1rem">Application Error</h1>
          <p style="color:#6b7280;margin-bottom:1rem">The application failed to initialize.</p>
          <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:1rem;text-align:left;font-family:monospace;font-size:0.8rem;color:#991b1b;word-break:break-word">${err instanceof Error ? err.message : String(err)}</div>
          <button onclick="window.location.reload()" style="margin-top:1.5rem;padding:0.75rem 2rem;border-radius:12px;border:none;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:white;font-size:1rem;font-weight:600;cursor:pointer">Refresh Page</button>
        </div>
      </div>
    `;
  }
  console.error('Fatal application error:', err);
}
