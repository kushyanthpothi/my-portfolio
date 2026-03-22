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

    const toggleTheme = (event) => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';

        // Check if browser supports View Transitions API
        if (!document.startViewTransition) {
            applyTheme(newTheme);
            return;
        }

        // Get the switch's dimensions and position
        const rect = event.currentTarget.getBoundingClientRect();
        
        // Pass everything needed to calculate the 'inset' clip-path
        const style = document.documentElement.style;
        style.setProperty('--transition-top', `${rect.top}px`);
        style.setProperty('--transition-left', `${rect.left}px`);
        style.setProperty('--transition-width', `${rect.width}px`);
        style.setProperty('--transition-height', `${rect.height}px`);
        style.setProperty('--viewport-width', `${window.innerWidth}px`);
        style.setProperty('--viewport-height', `${window.innerHeight}px`);

        // Set direction and state
        document.documentElement.setAttribute('data-theme-direction', `to-${newTheme}`);
        document.documentElement.setAttribute('data-theme-transitioning', 'true');

        // Start the view transition
        const transition = document.startViewTransition(() => {
            applyTheme(newTheme);
        });

        // Clean up attributes after transition
        transition.finished.finally(() => {
            document.documentElement.removeAttribute('data-theme-transitioning');
            document.documentElement.removeAttribute('data-theme-direction');
        });
    };

    const applyTheme = (newTheme) => {
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
