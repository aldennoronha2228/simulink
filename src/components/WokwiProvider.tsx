'use client';

import { useEffect } from 'react';

export default function WokwiProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Register ALL wokwi custom elements once at app level
    import('@wokwi/elements').catch(console.error);
  }, []);

  return <>{children}</>;
}
