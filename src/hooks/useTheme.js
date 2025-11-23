import { useState, useEffect, useCallback } from 'react';
import {
    loadTheme,
    setTheme as setThemeUtil,
    loadThemeMode,
    setThemeMode as setThemeModeUtil,
    getEffectiveDarkMode,
    setupSystemThemeListener,
    THEME_MODES,
    loadBackground,
    setBackground as setBackgroundUtil,
} from '../utils/theme';

/**
 * Custom hook for theme management
 * Handles theme color, dark mode, and background selection
 */
export function useTheme() {
    const [currentTheme, setCurrentTheme] = useState('orange');
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [themeMode, setThemeModeState] = useState(THEME_MODES.SYSTEM);
    const [currentBackground, setCurrentBackground] = useState('colorbends');
    const [previousTheme, setPreviousTheme] = useState('orange');

    // Initialize theme on mount
    useEffect(() => {
        const savedTheme = loadTheme();
        setCurrentTheme(savedTheme);
        setPreviousTheme(savedTheme);

        const savedBackground = loadBackground();
        setCurrentBackground(savedBackground);

        // Special handling for ColorBends
        if (savedBackground === 'colorbends') {
            setThemeUtil('lightgray');
            setCurrentTheme('lightgray');
        }

        const savedThemeMode = loadThemeMode();
        setThemeModeState(savedThemeMode);

        const darkModeEnabled = getEffectiveDarkMode();
        setIsDarkMode(darkModeEnabled);

        // Setup system theme listener
        const cleanup = setupSystemThemeListener((isDark, mode) => {
            setIsDarkMode(isDark);
            setThemeModeState(mode);
        });

        // Listen for background changes
        const handleBackgroundChange = (event) => {
            const newBackground = event.detail.background;

            // Store previous theme when switching to ColorBends
            if (newBackground === 'colorbends' && currentBackground !== 'colorbends') {
                setPreviousTheme(currentTheme);
            }

            // Restore previous theme when switching away from ColorBends
            if (currentBackground === 'colorbends' && newBackground !== 'colorbends') {
                setThemeUtil(previousTheme);
                setCurrentTheme(previousTheme);
            }

            setCurrentBackground(newBackground);

            // Special handling for ColorBends
            if (newBackground === 'colorbends') {
                setThemeUtil('lightgray');
                setCurrentTheme('lightgray');
            }
        };

        window.addEventListener('backgroundChanged', handleBackgroundChange);

        return () => {
            cleanup();
            window.removeEventListener('backgroundChanged', handleBackgroundChange);
        };
    }, []);

    const changeTheme = useCallback((color) => {
        setCurrentTheme(color);
        setThemeUtil(color);
    }, []);

    const changeThemeMode = useCallback((mode) => {
        const isDark = setThemeModeUtil(mode);
        setThemeModeState(mode);
        setIsDarkMode(isDark);

        // Force a re-render to ensure all components update
        setTimeout(() => {
            window.dispatchEvent(new Event('storage'));
        }, 0);
    }, []);

    const changeBackground = useCallback((background) => {
        // Store previous theme when switching to ColorBends
        if (background === 'colorbends' && currentBackground !== 'colorbends') {
            setPreviousTheme(currentTheme);
        }

        // Restore previous theme when switching away from ColorBends
        if (currentBackground === 'colorbends' && background !== 'colorbends') {
            setThemeUtil(previousTheme);
            setCurrentTheme(previousTheme);
        }

        // Special handling for ColorBends
        if (background === 'colorbends') {
            setThemeUtil('lightgray');
            setCurrentTheme('lightgray');
        }

        setBackgroundUtil(background);
        setCurrentBackground(background);
    }, [currentBackground, currentTheme, previousTheme]);

    return {
        currentTheme,
        isDarkMode,
        themeMode,
        currentBackground,
        changeTheme,
        changeThemeMode,
        changeBackground,
    };
}
