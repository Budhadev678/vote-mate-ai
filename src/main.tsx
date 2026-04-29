import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ErrorBoundary } from './components/ErrorBoundary.tsx'
import { validateEnvironment } from './utils/sanitize.ts'

// Validate environment variables on startup
validateEnvironment()

const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('[VoteMate] Root element #root not found in DOM.')
}

createRoot(rootElement).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
