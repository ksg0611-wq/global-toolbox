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

  if (!hasMounted) {
    return null;
  }

  return <>{children}</>;
}
