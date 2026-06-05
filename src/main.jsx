import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import { ThemeProvider } from 'next-themes'
import './index.css'
import App from './App.jsx'

// Register Service Worker
registerSW({ immediate: true })

const container = document.getElementById('root');
const app = (
  <StrictMode>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <App />
    </ThemeProvider>
  </StrictMode>
);

if (container.hasChildNodes()) {
  hydrateRoot(container, app);
} else {
  createRoot(container).render(app);
}
