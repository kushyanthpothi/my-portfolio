/**
 * Framer Motion animation variants for consistent animations across the app
 */

export const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
};

export const fadeIn = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
};

export const scaleIn = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
};

export const slideInFromLeft = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
};

export const slideInFromRight = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
};

export const navbarSlideDown = {
    initial: { y: -120, opacity: 0 },
    animate: { y: 0, opacity: 1 },
};

/**
 * Common transition configurations
 */
export const transitions = {
    smooth: {
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1],
    },
    spring: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
    },
    fast: {
        duration: 0.3,
    },
    slow: {
        duration: 0.8,
    },
};

/**
 * Viewport configuration for scroll-triggered animations
 */
export const viewport = {
    once: true,
    amount: 0.2,
};
