'use client';

import { useState, useEffect } from 'react';
import styles from './ThemeSwitch.module.css';

export default function ThemeSwitch({ className = '', style = {} }) {
    // Initialize with a function to read from localStorage synchronously
    const [theme, setTheme] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('theme') || 'dark';
        }
        return 'dark';
    });
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // Mark as mounted and sync theme
        setMounted(true);
        const savedTheme = localStorage.getItem('theme') || 'dark';
        if (savedTheme !== theme) {
            setTheme(savedTheme);
        }
        document.documentElement.setAttribute('data-theme', savedTheme);
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    };

    // Don't render until mounted to prevent hydration issues
    if (!mounted) {
        return <div className={`${styles.themeSwitchContainer} ${className}`} style={{ opacity: 0, ...style }} />;
    }

    return (
        <div className={`${styles.themeSwitchContainer} ${className}`} style={style}>
            <div
                className={`${styles.toggleSwitch} ${theme === 'dark' ? styles.dark : ''}`}
                onClick={toggleTheme}
            >
                <div className={styles.toggleKnob}></div>
            </div>
        </div>
    );
}
