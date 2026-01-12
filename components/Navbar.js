'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import styles from './Navbar.module.css';
import Magnetic from './Magnetic';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Projects', href: '/projects' },
    { name: 'Blogs', href: '/blogs' },
];

export default function Navbar() {
    const [showStatus, setShowStatus] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        let lastScrollY = window.scrollY;

        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            const isScrollingDown = currentScrollY > lastScrollY;

            // Show Status Badge (collapsed) ONLY if scrolling down AND past 200px
            if (isScrollingDown && currentScrollY > 200) {
                setShowStatus(true);
            } else {
                // Show Nav Items (expanded) if scrolling up OR near top
                setShowStatus(false);
            }

            lastScrollY = currentScrollY;
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const scrollToContact = (e) => {
        e.preventDefault();

        // If on home page or about page, scroll to contact form
        if (pathname === '/' || pathname === '/about') {
            const contactSection = document.getElementById('contact-form');
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
            }
        } else {
            // If on any other page, navigate to home with hash
            router.push('/#contact-form');
        }
        setIsMenuOpen(false);
    };

    return (
        <div className={styles.navContainer}>
            <motion.nav
                className={`${styles.navPill} ${isMenuOpen ? styles.navPillExpanded : ''}`}
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            >
                {/* Desktop View */}
                <div className={styles.desktopView}>
                    <div className={styles.profileImage}>
                        <img
                            src="https://i.ibb.co/G39RwbX6/Profile-Photo-small.jpg"
                            alt="Profile"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                    </div>

                    <AnimatePresence mode="wait">
                        {showStatus ? (
                            <motion.div
                                key="status"
                                className={styles.statusContainer}
                                initial={{ opacity: 0, width: 0 }}
                                animate={{ opacity: 1, width: 'auto' }}
                                exit={{ opacity: 0, width: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className={styles.statusBadge}>
                                    <span>Available for work</span>
                                    <span className={styles.statusDot}></span>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="nav-content"
                                initial={{ opacity: 0, width: 0 }}
                                animate={{ opacity: 1, width: 'auto' }}
                                exit={{ opacity: 0, width: 0 }}
                                transition={{ duration: 0.3 }}
                                style={{ display: 'flex', alignItems: 'center', overflow: 'hidden' }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', minWidth: 'max-content' }}>
                                    {navItems.map((item) => (
                                        <a key={item.name} href={item.href} className={styles.navLink}>
                                            <div className={styles.textContainer}>
                                                <span className={styles.originalText}>{item.name}</span>
                                                <span className={styles.hoverText}>{item.name}</span>
                                            </div>
                                        </a>
                                    ))}
                                    <a href="#contact-form" className={styles.contactBtn} onClick={scrollToContact}>
                                        <span className={styles.btnText}>Let's Talk</span>
                                    </a>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Mobile View */}
                <div className={styles.mobileView}>
                    <div className={styles.mobileHeader}>
                        <div className={styles.profileImage}>
                            <img
                                src="https://i.ibb.co/G39RwbX6/Profile-Photo-small.jpg"
                                alt="Profile"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        </div>
                        <div className={styles.statusBadgeMobile}>
                            <span>Available for work</span>
                            <span className={styles.statusDot}></span>
                        </div>

                        <button
                            className={`${styles.menuToggle} ${isMenuOpen ? styles.menuToggleActive : ''}`}
                            onClick={toggleMenu}
                            aria-label="Toggle Menu"
                        >
                            <div className={styles.burgerIcon}>
                                <motion.span
                                    className={styles.burgerLine}
                                    animate={{
                                        rotate: isMenuOpen ? 45 : 0,
                                        y: isMenuOpen ? 0 : -4
                                    }}
                                    transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                                />
                                <motion.span
                                    className={styles.burgerLine}
                                    animate={{
                                        rotate: isMenuOpen ? -45 : 0,
                                        y: isMenuOpen ? 0 : 4
                                    }}
                                    transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                                />
                            </div>
                        </button>
                    </div>

                    <motion.div
                        className={styles.mobileContent}
                        initial={false}
                        animate={{
                            height: isMenuOpen ? 'auto' : 0,
                            opacity: isMenuOpen ? 1 : 0
                        }}
                        transition={{
                            duration: 0.4,
                            ease: [0.4, 0, 0.2, 1],
                            opacity: { duration: 0.3 }
                        }}
                    >
                        <div className={styles.mobileMenuLinks}>
                            {navItems.map((item, index) => (
                                <motion.a
                                    key={item.name}
                                    href={item.href}
                                    className={styles.mobileNavLink}
                                    onClick={toggleMenu}
                                    initial={false}
                                    animate={{
                                        opacity: isMenuOpen ? 1 : 0,
                                        y: isMenuOpen ? 0 : 10
                                    }}
                                    transition={{
                                        delay: isMenuOpen ? 0.1 + index * 0.05 : 0,
                                        duration: 0.3,
                                        ease: [0.4, 0, 0.2, 1]
                                    }}
                                >
                                    {item.name}
                                </motion.a>
                            ))}
                        </div>
                        <motion.div
                            className={styles.mobileMenuFooter}
                            initial={false}
                            animate={{
                                opacity: isMenuOpen ? 1 : 0,
                                y: isMenuOpen ? 0 : 10
                            }}
                            transition={{
                                delay: isMenuOpen ? 0.3 : 0,
                                duration: 0.3,
                                ease: [0.4, 0, 0.2, 1]
                            }}
                        >
                            <a href="#contact-form" className={styles.contactBtn} onClick={scrollToContact}>
                                <span className={styles.btnText}>Let's Talk</span>
                            </a>
                        </motion.div>
                    </motion.div>
                </div>
            </motion.nav>
        </div>
    );
}
