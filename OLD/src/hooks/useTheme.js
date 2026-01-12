import { useState, useEffect, useCallback } from 'react';
import {
    setTheme as setThemeUtil,
    loadThemeMode,
    setThemeMode as setThemeModeUtil,
    getEffectiveDarkMode,
    setupSystemThemeListener,
    THEME_MODES,
    loadBackground,
    setBackground as setBackgroundUtil,
    loadUserThemePreference,
    setUserThemePreference,
    BACKGROUND_OPTIONS
} from '../utils/theme';

/**
 * Custom hook for theme management
 * Handles theme color, dark mode, and background selection
 * Separates user preference from active (visual) theme
 */
export function useTheme() {
    // Initialize with consistent defaults to prevent hydration mismatch
    // localStorage values will be loaded after first render on client
    const [userTheme, setUserTheme] = useState('orange');
    const [activeTheme, setActiveTheme] = useState('orange');
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [themeMode, setThemeModeState] = useState(THEME_MODES.SYSTEM);
    const [currentBackground, setCurrentBackground] = useState(BACKGROUND_OPTIONS.BEAMS);
    const [isHydrated, setIsHydrated] = useState(false);

    // Initialize theme on mount (client-side only)
    useEffect(() => {
        // 1. Load User Preference
        const savedUserTheme = loadUserThemePreference();
        setUserTheme(savedUserTheme);

        // 2. Load Background
        const savedBackground = loadBackground();
        setCurrentBackground(savedBackground);

        // 3. Determine Active Theme based on Background
        let initialActiveTheme = savedUserTheme;
        if (savedBackground === BACKGROUND_OPTIONS.COLORBENDS) {
            initialActiveTheme = 'lightgray';
        }

        setActiveTheme(initialActiveTheme);
        setThemeUtil(initialActiveTheme); // Apply it globally

        // 4. Load Theme Mode (Dark/Light/System)
        const savedThemeMode = loadThemeMode();
        setThemeModeState(savedThemeMode);

        const darkModeEnabled = getEffectiveDarkMode();
        setIsDarkMode(darkModeEnabled);

        // 5. Mark as hydrated
        setIsHydrated(true);

        // 6. Setup system theme listener
        const cleanup = setupSystemThemeListener((isDark, mode) => {
            setIsDarkMode(isDark);
            setThemeModeState(mode);
        });

        return cleanup;
    }, []);

    const changeTheme = useCallback((color) => {
        // Always update and persist the user's preference
        setUserTheme(color);
        setUserThemePreference(color);

        // Only update the active (visual) theme if we are NOT in an override state
        // (i.e., NOT using ColorBends, which forces lightgray)
        if (currentBackground !== BACKGROUND_OPTIONS.COLORBENDS) {
            setActiveTheme(color);
            setThemeUtil(color);
        }
    }, [currentBackground]);

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
        setBackgroundUtil(background);
        setCurrentBackground(background);

        if (background === BACKGROUND_OPTIONS.COLORBENDS) {
            // ColorBends forces the theme to lightgray
            // We do NOT update userTheme here, so the preference is preserved
            setActiveTheme('lightgray');
            setThemeUtil('lightgray');
        } else {
            // Switching to a normal background
            // Restore the user's preferred theme
            setActiveTheme(userTheme);
            setThemeUtil(userTheme);
        }
    }, [userTheme]);

    return {
        currentTheme: activeTheme, // Components see the active visual theme
        userThemePreference: userTheme, // Exposed in case UI needs to know the hidden preference
        isDarkMode,
        themeMode,
        currentBackground,
        changeTheme,
        changeThemeMode,
        changeBackground,
        isHydrated, // Expose hydration state
    };
}
