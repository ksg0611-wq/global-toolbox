if (!Object.hasOwn) {
  Object.hasOwn = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop);
}

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
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

// ✅ 항상 createRoot로 새로 렌더링
// react-snap이 생성한 정적 HTML은 SEO 크롤러용으로만 사용하고,
// React는 hydrateRoot 없이 새로 마운트하여 Error #418을 원천 차단합니다.
createRoot(container).render(app);
