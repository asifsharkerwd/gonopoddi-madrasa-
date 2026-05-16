import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Fix for "fetch is read-only" error in sandbox
if (typeof window !== 'undefined') {
  try {
    const originalFetch = window.fetch;
    if (originalFetch) {
      Object.defineProperty(window, 'fetch', {
        value: originalFetch,
        writable: false,
        configurable: false
      });
    }
  } catch (e) {
    // Already defined or restricted, move on
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
