'use client';

import { useRef, useState, useEffect } from 'react';
import styles from './ErrorPage.module.css';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function ErrorPage({ startAnimation = true }) {
    const container = useRef(null);
    const [isMobile, setIsMobile] = useState(false);

    const { scrollYProgress } = useScroll({
        target: container,
        offset: ['start start', 'end start']
    });

    const y = useTransform(scrollYProgress, [0, 1], [0, 200]);

    useEffect(() => {
        // Detect mobile screen size
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
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
                {/* Left Side - 404 */}
                <div className={styles.leftText}>
                    <div style={{ overflow: 'hidden', paddingBottom: '10px' }}>
                        <motion.h1
                            className={styles.titleLarge}
                            variants={textReveal}
                            initial="initial"
                            animate={startAnimation ? "animate" : "initial"}
                            transition={{ ...textReveal.animate.transition, delay: 0.1 }}
                        >
                            404
                        </motion.h1>
                    </div>
                </div>

                {/* Center - Image */}
                <div className={styles.centerContainer}>
                    <motion.div
                        style={{ position: 'relative' }}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={startAnimation ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                        transition={{ duration: 1.2, ease: [0.34, 1.56, 0.64, 1] }}
                    >
                        <div className={styles.imageContainer} suppressHydrationWarning>
                            <img
                                src="https://framerusercontent.com/images/rOqFilA8RpIjfoVVNgLDAjVvnwQ.jpg?scale-down-to=1024"
                                alt="404 Error"
                                className={styles.heroImage}
                            />
                        </div>
                    </motion.div>

                    {/* Home Button Below Card */}
                    <motion.a
                        href="/"
                        className={styles.homeButton}
                        initial={{ opacity: 0, y: 20 }}
                        animate={startAnimation ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        transition={{ delay: 0.8, duration: 0.8 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                            <polyline points="9 22 9 12 15 12 15 22"></polyline>
                        </svg>
                        Home
                    </motion.a>
                </div>

                {/* Right Side - OOPS! + description */}
                <div className={styles.rightText}>
                    <div style={{ overflow: 'hidden', paddingBottom: '10px' }}>
                        <motion.h1
                            className={styles.titleLarge}
                            variants={textReveal}
                            initial="initial"
                            animate={startAnimation ? "animate" : "initial"}
                            transition={{ ...textReveal.animate.transition, delay: 0.2 }}
                        >
                            OOPS!
                        </motion.h1>
                    </div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={startAnimation ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                    >
                        <p className={styles.subtitle}>
                            The page you're looking for doesn't exist
                        </p>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
}
