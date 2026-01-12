import { SCROLL_CONFIG } from '../config';

/**
 * Smoothly scrolls to a section by ID
 * @param {string} sectionId - The ID of the section to scroll to
 * @param {Function} callback - Optional callback to execute after scroll
 */
export function scrollToSection(sectionId, callback) {
    const element = document.getElementById(sectionId);
    if (element) {
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - SCROLL_CONFIG.NAVBAR_OFFSET;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }

    if (callback) {
        callback();
    }
}

/**
 * Scrolls to the contact section
 */
export function scrollToContact() {
    scrollToSection('contact');
}
