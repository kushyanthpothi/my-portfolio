'use client';

import { useEffect } from 'react';

export default function ThemeInitializer() {
    useEffect(() => {
        // This runs on every page load to ensure theme is set
        const savedTheme = localStorage.getItem('theme') || 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);
    }, []);

    return null; // This component doesn't render anything
}
