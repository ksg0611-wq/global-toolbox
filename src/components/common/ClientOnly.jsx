import React, { useState, useEffect } from 'react';

/**
 * ClientOnly Component
 * 
 * 📌 Guard wrapper to prevent React hydration mismatches on parts of the DOM
 * that are highly interactive, modified by browser extensions, or have dynamic states.
 * Renders null on server/pre-render and initial client-side render, 
 * then renders children once client-side mounting is complete.
 */
export default function ClientOnly({ children }) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  // react-snap (Puppeteer) 빌드 환경이거나 SSR 환경인 경우 무조건 null 반환
  const isSSROrSnap = typeof window === 'undefined' || 
                      !!window.__snap || 
                      (typeof navigator !== 'undefined' && /HeadlessChrome|puppeteer/i.test(navigator.userAgent));

  if (isSSROrSnap || !hasMounted) {
    return null;
  }

  return <>{children}</>;
}
