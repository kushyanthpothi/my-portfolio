'use client';

import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import styles from './ErrorPage.module.css';

const LOTTIE_URL =
    'https://cdn.prod.website-files.com/634d5c356b8adeff5a7c6393/6374a8feb22bb3cb2d2190ec_404%20page%20(1).json';

export default function ErrorPage({ startAnimation = true }) {
    const container = useRef(null);
    const [theme, setTheme] = useState('dark');

    useEffect(() => {
        const update = () => {
            setTheme(
                document.documentElement.getAttribute('data-theme') || 'dark'
            );
        };
        update();
        const observer = new MutationObserver(update);
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme'],
        });
        return () => observer.disconnect();
    }, []);

    return (
        <div className={styles.heroSection} ref={container}>
            <motion.div
                className={styles.heroContent}
                initial={{ opacity: 0, y: 30 }}
                animate={startAnimation ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
                {/* Lottie 404 animation */}
                <div
                    className={styles.lottieWrapper}
                    style={theme === 'dark' ? { filter: 'invert(1)' } : {}}
                >
                    <DotLottieReact
                        src={LOTTIE_URL}
                        autoplay
                        loop
                        className={styles.lottie}
                    />
                </div>

                {/* Page Not Found label */}
                <motion.p
                    className={styles.subtitle}
                    initial={{ opacity: 0, y: 16 }}
                    animate={startAnimation ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
                    transition={{ delay: 0.5, duration: 0.7 }}
                >
                    Page Not Found
                </motion.p>


            </motion.div>
        </div>
    );
}
