import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { populateDatabase } from './db/populateDatabase'

// Ensure database is populated before rendering
populateDatabase().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}).catch(error => {
  console.error('Failed to initialize database:', error);
  // Show error UI if needed
  document.body.innerHTML = `
    <div style="display: flex; justify-content: center; align-items: center; height: 100vh; flex-direction: column; gap: 16px;">
      <h2>Failed to load application data</h2>
      <button onclick="window.location.reload()">Retry</button>
    </div>
  `;
});
