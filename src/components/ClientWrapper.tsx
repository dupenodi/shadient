'use client';

import { useEffect, useState } from 'react';

interface ClientWrapperProps {
  children: React.ReactNode;
}

export function ClientWrapper({ children }: ClientWrapperProps) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return (
      <div className="h-screen bg-gray-950 text-white flex items-center justify-center" suppressHydrationWarning>
        <div className="text-center">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-4">
            <div className="w-4 h-4 bg-white rounded-full animate-pulse" />
          </div>
          <h1 className="text-xl font-bold mb-2">Shadient</h1>
          <p className="text-gray-400">Loading Gradient Playground...</p>
        </div>
      </div>
    );
  }

  return <div suppressHydrationWarning>{children}</div>;
} 