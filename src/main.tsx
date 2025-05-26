// Import Three.js compatibility layer first to ensure it's loaded before any component uses Three.js
import './lib/three-compat';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import ErrorBoundary from './components/ErrorBoundary';
import { RecipeProvider } from './context/RecipeContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <RecipeProvider>
          <App />
        </RecipeProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>
);