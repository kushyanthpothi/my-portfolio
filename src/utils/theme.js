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

// Dark mode utility functions
export const loadDarkMode = () => {
  if (typeof window === 'undefined') return false;
  
  const savedDarkMode = localStorage.getItem('darkMode');
  
  // Check if user has saved preference, otherwise default to light mode
  if (savedDarkMode !== null && savedDarkMode !== undefined) {
    const isDark = savedDarkMode === 'true';
    applyDarkMode(isDark);
    return isDark;
  } else {
    // Default to light mode when no preference is saved
    applyDarkMode(false);
    localStorage.setItem('darkMode', 'false');
    return false;
  }
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

export const toggleDarkMode = () => {
  if (typeof window === 'undefined') return false;
  
  const currentMode = localStorage.getItem('darkMode') === 'true';
  const newMode = !currentMode;
  
  localStorage.setItem('darkMode', newMode.toString());
  applyDarkMode(newMode);
  
  // Dispatch storage event to notify other components
  setTimeout(() => {
    window.dispatchEvent(new Event('storage'));
  }, 0);
  
  return newMode;
};