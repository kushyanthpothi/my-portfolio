export const themeColors = {
  blue: 'text-blue-600 dark:text-blue-400 bg-blue-600 hover:text-blue-600 dark:hover:text-blue-400 bg-blue-100 hover:bg-blue-200 dark:bg-blue-800',
  red: 'text-red-600 dark:text-red-400 bg-red-600 hover:text-red-600 dark:hover:text-red-400 bg-red-100 hover:bg-red-200 dark:bg-red-800',
  purple: 'text-purple-600 dark:text-purple-400 bg-purple-600 hover:text-purple-600 dark:hover:text-purple-400 bg-purple-100 hover:bg-purple-200 dark:bg-purple-800',
  emerald: 'text-emerald-600 dark:text-emerald-400 bg-emerald-600 hover:text-emerald-600 dark:hover:text-emerald-400 bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-800',
  orange: 'text-orange-600 dark:text-orange-400 bg-orange-600 hover:text-orange-600 dark:hover:text-orange-400 bg-orange-100 hover:bg-orange-200 dark:bg-orange-800',
  pink: 'text-pink-600 dark:text-pink-400 bg-pink-600 hover:text-pink-600 dark:hover:text-pink-400 bg-pink-100 hover:bg-pink-200 dark:bg-pink-800'
};

export const themeClass = (type, currentTheme = 'blue') => {
  switch (type) {
    case 'text':
      return `text-${currentTheme}-600 dark:text-${currentTheme}-400`;
    case 'bg':
      return `bg-${currentTheme}-600`;
    case 'bgLight':
      return `bg-${currentTheme}-100 bg-opacity-70 hover:bg-${currentTheme}-200`;
    case 'borderLight':
      return `border-${currentTheme}-500`;
    case 'border':
      return `border-${currentTheme}-500 dark:border-${currentTheme}-400`;
    case 'bgSelected':
      return `bg-${currentTheme}-50 dark:bg-${currentTheme}-900/20 dark:border-${currentTheme}-400`;
    default:
      return '';
  }
};

// Theme mode constants
export const THEME_MODES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system'
};

// Background options
export const BACKGROUND_OPTIONS = {
  BEAMS: 'beams',
  DITHER: 'dither',
  SILK: 'silk',
  PIXELBLAST: 'pixelblast'
};

// Background utility functions
export const loadBackground = () => {
  if (typeof window === 'undefined') return BACKGROUND_OPTIONS.BEAMS;
  
  const savedBackground = localStorage.getItem('selectedBackground');
  
  // Migration: Replace 'galaxy' with 'dither' for existing users
  if (savedBackground === 'galaxy') {
    localStorage.setItem('selectedBackground', BACKGROUND_OPTIONS.DITHER);
    return BACKGROUND_OPTIONS.DITHER;
  }
  
  if (savedBackground && Object.values(BACKGROUND_OPTIONS).includes(savedBackground)) {
    return savedBackground;
  } else {
    // Default to pixelblast
    localStorage.setItem('selectedBackground', BACKGROUND_OPTIONS.PIXELBLAST);
    return BACKGROUND_OPTIONS.PIXELBLAST;
  }
};

export const setBackground = (background) => {
  if (typeof window === 'undefined') return;
  
  if (!Object.values(BACKGROUND_OPTIONS).includes(background)) {
    background = BACKGROUND_OPTIONS.PIXELBLAST;
  }
  
  localStorage.setItem('selectedBackground', background);
  
  // Dispatch custom event to notify components
  window.dispatchEvent(new CustomEvent('backgroundChanged', {
    detail: { background }
  }));
};

// Check if background switching should be disabled (June 2nd)
export const isBackgroundSwitchDisabled = () => {
  const today = new Date();
  return today.getMonth() === 5 && today.getDate() === 2; // Month is 0-indexed (5 = June)
};

// Dark mode utility functions with system theme support
export const getSystemTheme = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

export const loadThemeMode = () => {
  if (typeof window === 'undefined') return THEME_MODES.SYSTEM;
  
  // Run migration first
  migrateLegacyThemeSettings();
  
  const savedMode = localStorage.getItem('themeMode');
  
  // Check if user has saved preference, otherwise default to system mode
  if (savedMode && Object.values(THEME_MODES).includes(savedMode)) {
    return savedMode;
  } else {
    // Default to system mode when no preference is saved
    localStorage.setItem('themeMode', THEME_MODES.SYSTEM);
    return THEME_MODES.SYSTEM;
  }
};

export const getEffectiveDarkMode = (themeMode = null) => {
  if (typeof window === 'undefined') return false;
  
  const mode = themeMode || loadThemeMode();
  
  switch (mode) {
    case THEME_MODES.LIGHT:
      return false;
    case THEME_MODES.DARK:
      return true;
    case THEME_MODES.SYSTEM:
    default:
      return getSystemTheme();
  }
};

export const loadDarkMode = () => {
  if (typeof window === 'undefined') return false;
  
  const themeMode = loadThemeMode();
  const isDark = getEffectiveDarkMode(themeMode);
  applyDarkMode(isDark);
  return isDark;
};

export const applyDarkMode = (isDarkMode) => {
  if (typeof window === 'undefined') return;
  
  if (isDarkMode) {
    document.documentElement.classList.add('dark');
    document.body.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
    document.body.classList.remove('dark');
  }
};

export const setThemeMode = (mode) => {
  if (typeof window === 'undefined') return false;
  
  if (!Object.values(THEME_MODES).includes(mode)) {
    mode = THEME_MODES.SYSTEM;
  }
  
  localStorage.setItem('themeMode', mode);
  const isDark = getEffectiveDarkMode(mode);
  applyDarkMode(isDark);
  
  // Dispatch storage event to notify other components
  setTimeout(() => {
    window.dispatchEvent(new Event('storage'));
  }, 0);
  
  return isDark;
};

export const toggleDarkMode = () => {
  if (typeof window === 'undefined') return false;
  
  const currentMode = loadThemeMode();
  let newMode;
  
  switch (currentMode) {
    case THEME_MODES.LIGHT:
      newMode = THEME_MODES.DARK;
      break;
    case THEME_MODES.DARK:
      newMode = THEME_MODES.SYSTEM;
      break;
    case THEME_MODES.SYSTEM:
    default:
      newMode = THEME_MODES.LIGHT;
      break;
  }
  
  return setThemeMode(newMode);
};

// Setup system theme listener
export const setupSystemThemeListener = (callback) => {
  if (typeof window === 'undefined') return () => {};
  
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  
  const handleChange = () => {
    const currentMode = loadThemeMode();
    if (currentMode === THEME_MODES.SYSTEM) {
      const isDark = getEffectiveDarkMode();
      applyDarkMode(isDark);
      if (callback) callback(isDark, currentMode);
    }
  };
  
  mediaQuery.addEventListener('change', handleChange);
  
  return () => {
    mediaQuery.removeEventListener('change', handleChange);
  };
};

// Migration function to handle old localStorage format
export const migrateLegacyThemeSettings = () => {
  if (typeof window === 'undefined') return;
  
  // Check if old darkMode setting exists and new themeMode doesn't
  const oldDarkMode = localStorage.getItem('darkMode');
  const newThemeMode = localStorage.getItem('themeMode');
  
  if (oldDarkMode !== null && newThemeMode === null) {
    // Migrate from old boolean darkMode to new themeMode system
    const wasUsingDarkMode = oldDarkMode === 'true';
    const newMode = wasUsingDarkMode ? THEME_MODES.DARK : THEME_MODES.LIGHT;
    
    localStorage.setItem('themeMode', newMode);
    // Keep the old darkMode for backward compatibility, but don't rely on it
  }
};