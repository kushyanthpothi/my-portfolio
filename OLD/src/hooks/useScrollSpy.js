import { useState, useEffect } from 'react';
import { SCROLL_CONFIG } from '../config';

/**
 * Custom hook for scroll spy functionality
 * Detects which section is currently active based on scroll position
 * Also tracks if page has been scrolled past threshold
 */
export function useScrollSpy(navItems) {
    const [activeSection, setActiveSection] = useState('home');
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const sections = navItems.map(item => document.getElementById(item.section));
            const scrollPosition = window.scrollY + SCROLL_CONFIG.ACTIVE_SECTION_OFFSET;

            // Find active section
            for (let i = sections.length - 1; i >= 0; i--) {
                const section = sections[i];
                if (section && scrollPosition >= section.offsetTop) {
                    setActiveSection(navItems[i].section);
                    break;
                }
            }

            // Update scrolled state
            if (window.scrollY > SCROLL_CONFIG.SCROLL_THRESHOLD) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [navItems]);

    return { activeSection, scrolled };
}
