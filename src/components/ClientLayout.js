'use client';

import { useEffect } from 'react';
import { loadDarkMode, setupSystemThemeListener } from '../utils/theme';

export default function ClientLayout({ children }) {
  useEffect(() => {
    // Apply theme mode immediately on mount
    loadDarkMode();
    
    // Setup system theme listener
    const cleanup = setupSystemThemeListener();
    
    // Listen for storage events to sync theme across tabs/pages
    const handleStorageChange = (e) => {
      if (e.key === 'themeMode' || e.key === 'darkMode' || e.type === 'storage') {
        loadDarkMode();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      cleanup();
    };
  }, []);

  return <>{children}</>;
}