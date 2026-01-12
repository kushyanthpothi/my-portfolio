'use client';

import { useRef, useState, useEffect } from 'react';
import styles from './Hero.module.css';
import { motion, useScroll, useTransform } from 'framer-motion';


export default function Hero({ startAnimation = true }) {
    const container = useRef(null);
    const [theme, setTheme] = useState('dark');
    const [isMobile, setIsMobile] = useState(false);

    const { scrollYProgress } = useScroll({
        target: container,
        offset: ['start start', 'end start']
    });

    const y = useTransform(scrollYProgress, [0, 1], [0, 200]);

    useEffect(() => {
        // Initialize theme from localStorage
        const savedTheme = localStorage.getItem('theme') || 'dark';
        setTheme(savedTheme);
        document.documentElement.setAttribute('data-theme', savedTheme);

        // Detect mobile screen size
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    };

    const [isFooterVisible, setIsFooterVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const footer = document.getElementById('contact');
            if (footer) {
                const rect = footer.getBoundingClientRect();
                setIsFooterVisible(rect.top < window.innerHeight);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const textReveal = {
        initial: { y: "100%" },
        animate: {
            y: "0%",
            transition: { duration: 0.9, ease: [0.33, 1, 0.68, 1] }
        }
    };

    return (
        <div className={styles.heroSection} ref={container}>
            <motion.div
                className={styles.heroContent}
                initial={{ opacity: 0 }}
                animate={startAnimation ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: isMobile ? 0.3 : 1 }}
            >
                {/* Left Side - Name and SOFTWARE stacked */}
                <div className={styles.leftText}>
                    <div style={{ overflow: 'hidden', paddingBottom: '5px' }}>
                        <motion.div
                            className={styles.nameSmall}
                            variants={textReveal}
                            initial="initial"
                            animate={startAnimation ? "animate" : "initial"}
                        >
                            Kushyanth Pothineni
                        </motion.div>
                    </div>
                    <div style={{ overflow: 'hidden', paddingBottom: '10px' }}>
                        <motion.h1
                            className={styles.titleLarge}
                            variants={textReveal}
                            initial="initial"
                            animate={startAnimation ? "animate" : "initial"}
                            transition={{ ...textReveal.animate.transition, delay: 0.1 }}
                        >
                            SOFTWARE
                        </motion.h1>
                    </div>
                </div>

                {/* Center - Image + Badge */}
                <div className={styles.centerContainer}>
                    <motion.div
                        style={{ y: isMobile ? 0 : y, position: 'relative', transformStyle: 'preserve-3d' }}
                        initial={{ rotateY: 180, opacity: 0 }}
                        animate={startAnimation ? { rotateY: 0, opacity: 1 } : { rotateY: 180, opacity: 0 }}
                        transition={{ duration: 1.5, ease: [0.34, 1.56, 0.64, 1] }}
                    >
                        <div className={styles.imageContainer} suppressHydrationWarning>
                            <img
                                src="https://i.ibb.co/d0PPzCfB/Gemini-memoji-1-1.png"
                                alt="Kushyanth Pothineni"
                                className={styles.heroImage}
                            />
                            {isMobile && (
                                <div className={styles.hiBadge}>
                                    Hi
                                </div>
                            )}
                        </div>


                    </motion.div>
                </div>

                {/* Right Side - DEVELOPER + description */}
                <div className={styles.rightText}>
                    <div style={{ overflow: 'hidden', paddingBottom: '10px' }}>
                        <motion.h1
                            className={styles.titleLarge}
                            variants={textReveal}
                            initial="initial"
                            animate={startAnimation ? "animate" : "initial"}
                            transition={{ ...textReveal.animate.transition, delay: 0.2 }}
                        >
                            DEVELOPER
                        </motion.h1>
                    </div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={startAnimation ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                    >
                        <p className={styles.subtitle}>
                            Crafting backend systems with performance in mind
                        </p>
                    </motion.div>
                </div>
            </motion.div>


        </div>
    );
}
