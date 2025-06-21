'use client';

import { useEffect } from 'react';
import { loadDarkMode, applyDarkMode } from '@/utils/theme';

export default function ClientLayout({ children }) {
  useEffect(() => {
    // Apply dark mode immediately on mount
    const darkModeEnabled = loadDarkMode();
    applyDarkMode(darkModeEnabled);
    
    // Listen for storage events to sync dark mode across tabs/pages
    const handleStorageChange = (e) => {
      if (e.key === 'darkMode' || e.type === 'storage') {
        const darkModeEnabled = loadDarkMode();
        applyDarkMode(darkModeEnabled);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return <>{children}</>;
}