'use client';

import { useEffect } from 'react';
import { loadDarkMode } from '@/utils/theme';

export default function DarkModeSync() {
  useEffect(() => {
    // Initialize dark mode on component mount
    loadDarkMode();
    
    // Listen for storage changes to sync dark mode across tabs/components
    const handleStorageChange = (e) => {
      if (e.key === 'darkMode' || e.type === 'storage') {
        loadDarkMode();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return null; // This component doesn't render anything
}