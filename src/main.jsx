import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import { ThemeProvider } from 'next-themes'
import { HelmetProvider } from 'react-helmet-async'
import './index.css'
import App from './App.jsx'

// Register Service Worker
registerSW({ immediate: true })

const container = document.getElementById('root');
const app = (
  <StrictMode>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </ThemeProvider>
  </StrictMode>
);

if (container.hasChildNodes()) {
  hydrateRoot(container, app);
} else {
  createRoot(container).render(app);
}
