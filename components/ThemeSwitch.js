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

        // Fallback for browsers without View Transitions API
        if (!document.startViewTransition) {
            applyTheme(newTheme);
            return;
        }

        // Capture switch position to anchor the clip-path animation.
        // Use visualViewport API — it always matches getBoundingClientRect() coords,
        // correctly accounting for Chrome's URL bar on mobile (window.innerHeight does not).
        const rect = event.currentTarget.getBoundingClientRect();
        const vv = window.visualViewport;

        // Visual viewport dimensions — excludes URL bar, keyboard, etc.
        const vpWidth  = Math.round(vv ? vv.width  : window.innerWidth);
        const vpHeight = Math.round(vv ? vv.height : window.innerHeight);

        // When pinch-zoomed, the visual viewport can be offset within the layout viewport.
        // getBoundingClientRect on fixed elements is relative to visual viewport origin,
        // so we add these offsets to translate to layout viewport coordinates.
        const offsetTop  = vv ? Math.round(vv.offsetTop)  : 0;
        const offsetLeft = vv ? Math.round(vv.offsetLeft) : 0;

        const top    = Math.round(rect.top)  + offsetTop;
        const left   = Math.round(rect.left) + offsetLeft;
        const width  = Math.round(rect.width);
        const height = Math.round(rect.height);

        const domStyle = document.documentElement.style;
        domStyle.setProperty('--transition-top',    `${top}px`);
        domStyle.setProperty('--transition-left',   `${left}px`);
        domStyle.setProperty('--transition-width',  `${width}px`);
        domStyle.setProperty('--transition-height', `${height}px`);
        domStyle.setProperty('--viewport-width',    `${vpWidth}px`);
        domStyle.setProperty('--viewport-height',   `${vpHeight + offsetTop}px`);
        // Pill radius = half the switch height — matches the exact toggle shape
        domStyle.setProperty('--transition-radius', `${Math.round(height / 2)}px`);

        document.documentElement.setAttribute('data-theme-direction', `to-${newTheme}`);
        document.documentElement.setAttribute('data-theme-transitioning', 'true');

        const transition = document.startViewTransition(() => {
            applyTheme(newTheme);
        });

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
