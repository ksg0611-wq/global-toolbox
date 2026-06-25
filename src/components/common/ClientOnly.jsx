import { useState, useEffect } from 'react';

export default function ClientOnly({ children }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // react-snap(Puppeteer headless 환경)이거나 마운트 전이라면 무조건 null을 반환하여 정적 HTML을 완전히 비워둠
  const isSnapEnvironment = typeof window !== 'undefined' && (navigator.webdriver || window.__snapshot);

  if (!isMounted || isSnapEnvironment) {
    return null;
  }

  return <>{children}</>;
}
