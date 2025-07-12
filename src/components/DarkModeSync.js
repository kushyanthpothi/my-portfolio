'use client';

import { useEffect } from 'react';
import { loadDarkMode, setupSystemThemeListener } from '@/utils/theme';

export default function DarkModeSync() {
  useEffect(() => {
    // Initialize theme mode on component mount
    loadDarkMode();
    
    // Setup system theme listener
    const cleanup = setupSystemThemeListener();
    
    // Listen for storage changes to sync theme across tabs/components
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

  return null; // This component doesn't render anything
}