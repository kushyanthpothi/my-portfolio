/**
 * Utility functions for scroll position restoration across page refreshes
 */

/**
 * Saves the current scroll position to sessionStorage
 */
export const saveScrollPosition = () => {
  sessionStorage.setItem('scrollPosition', window.scrollY.toString());
};

/**
 * Restores the scroll position from sessionStorage
 * @param {number} delay - Delay in milliseconds before restoring (default: 100ms)
 */
export const restoreScrollPosition = (delay = 100) => {
  const savedScrollPosition = sessionStorage.getItem('scrollPosition');
  if (savedScrollPosition) {
    const scrollY = parseInt(savedScrollPosition, 10);
    // Use setTimeout to ensure DOM is fully loaded
    setTimeout(() => {
      window.scrollTo({
        top: scrollY,
        behavior: 'instant' // Use instant to avoid smooth scrolling on restore
      });
      // Remove the saved position after restoring
      sessionStorage.removeItem('scrollPosition');
    }, delay);
  }
};

/**
 * Sets up scroll position restoration for a component
 * Returns a cleanup function that should be called in useEffect cleanup
 */
export const setupScrollRestore = () => {
  // Add event listener for page unload
  window.addEventListener('beforeunload', saveScrollPosition);

  // Restore scroll position immediately
  restoreScrollPosition();

  // Return cleanup function
  return () => {
    window.removeEventListener('beforeunload', saveScrollPosition);
  };
};

/**
 * Hook-style setup for scroll restoration
 * Use this in useEffect for easy integration
 */
export const useScrollRestore = () => {
  if (typeof window !== 'undefined') {
    return setupScrollRestore();
  }
  return () => {}; // Return empty cleanup function for SSR
};
