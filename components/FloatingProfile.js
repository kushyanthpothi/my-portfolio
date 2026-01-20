'use client';

import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useEffect, useState } from 'react';
import styles from './FloatingProfile.module.css';

export default function FloatingProfile({ onAnimationComplete }) {
    // We'll use window scroll to drive the animation
    const { scrollY } = useScroll();
    const [pageHeight, setPageHeight] = useState(0);
    const [windowHeight, setWindowHeight] = useState(0);
    const [showBack, setShowBack] = useState(false);
    const [isTablet, setIsTablet] = useState(false);

    useEffect(() => {
        // Get dimensions to calibrate scroll ranges
        const updateDimensions = () => {
            setPageHeight(document.body.scrollHeight);
            setWindowHeight(window.innerHeight);
            // Detect tablet viewport (769px - 1024px)
            const width = window.innerWidth;
            setIsTablet(width >= 769 && width <= 1024);
        };

        updateDimensions();
        window.addEventListener('resize', updateDimensions);
        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    // Desktop scroll values - Simple and clean
    // Y-axis: Stay in Hero, then move down smoothly to About
    const yDesktop = useTransform(scrollY, [0, 1600, 3000], [50, 50, -1300]);

    // X-axis: Minimal horizontal movement
    const xDesktop = useTransform(scrollY, [100, 600, 3000], [0, 400, 300]);

    // Rotation: Single 360° flip at the start only
    const rotateYDesktopRaw = useTransform(scrollY, [100, 800, 1600], [0, 180, 360]);

    // Z-axis tilt: Subtle tilt during flip
    const rotateZDesktop = useTransform(scrollY, [0, 100, 350, 600, 900, 1150, 1400], [0, 0, 0, -5, -5, 0, 5]);

    // Tablet scroll values - Simple and clean
    // Y-axis: Stay in Hero, then move down smoothly
    const yTablet = useTransform(scrollY, [0, 400, 1400, 2600], [50, 50, 50, -900]);

    // X-axis: Minimal horizontal shift
    const xTablet = useTransform(scrollY, [0, 200, 500, 3000], [0, 100, 200, 180]);

    // 360° rotation at start only
    const rotateYTabletRaw = useTransform(scrollY, [200, 900, 1400, 1700], [0, 180, 270, 360]);

    // Tilt during flip
    const rotateZTablet = useTransform(scrollY, [0, 400, 600, 800, 1000], [0, -5, -15, -5, 5]);

    // Apply spring physics to rotateY for smooth animation
    // Higher stiffness and damping for more responsive tracking while maintaining smoothness
    const rotateYDesktop = useSpring(rotateYDesktopRaw, { stiffness: 300, damping: 50, mass: 0.1 });
    const rotateYTablet = useSpring(rotateYTabletRaw, { stiffness: 300, damping: 50, mass: 0.1 });

    // Use tablet or desktop values based on viewport
    const y = isTablet ? yTablet : yDesktop;
    const x = isTablet ? xTablet : xDesktop;
    const rotateY = isTablet ? rotateYTablet : rotateYDesktop;
    const rotateZ = isTablet ? rotateZTablet : rotateZDesktop;

    // Scale: Grow as we scroll down
    const scale = useTransform(scrollY, [0, 800], [1, 1.15]);

    // Badge Animation
    // Shrink as we scroll from Hero
    const badgeScale = useTransform(scrollY, [0, 400], [1, 0.5]);
    // Fade out quickly as we leave Hero section (visible in Hero, hidden by About)
    const badgeOpacity = useTransform(scrollY, [0, 500], [1, 0]);

    return (
        <div className={styles.floatingContainer}>
            <motion.div
                className={styles.card}
                initial={{ x: 0, y: 0, rotateY: 0, scale: 1, rotateX: 100 }}
                animate={{ rotateX: 0 }}
                transition={{ duration: 0.7, ease: "easeInOut" }}
                onAnimationComplete={() => {
                    setShowBack(true);
                    if (onAnimationComplete) onAnimationComplete();
                }}
                style={{
                    x,
                    y,
                    rotateY, // Use rotateY for horizontal flip (vertical axis)
                    rotateZ,
                    scale,
                    transformStyle: 'preserve-3d'
                }}
            >
                {/* Front Side (Profile) */}
                <div
                    className={styles.face}
                    style={{
                        backfaceVisibility: 'hidden'
                    }}
                >
                    <img
                        src="https://i.ibb.co/d0PPzCfB/Gemini-memoji-1-1.png"
                        alt="Profile"
                        className={styles.frontImage}
                    />
                </div>

                {/* Back Side (Laptop) */}
                <div
                    className={styles.face}
                    style={{
                        transform: 'rotateY(180deg)', // Match flip axis
                        backfaceVisibility: 'hidden',
                        opacity: showBack ? 1 : 0
                    }}
                >
                    <img
                        src="https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y29tcHV0ZXJ8ZW58MHx8MHx8fDA%3D"
                        alt="Laptop"
                        className={styles.image}
                    />
                </div>

                {/* Hi Badge - Moved outside face to avoid clipping */}
                <motion.div
                    className={styles.hiBadge}
                    style={{
                        scale: badgeScale,
                        opacity: badgeOpacity,
                        backfaceVisibility: 'hidden'
                    }}
                    initial={false}
                    animate={{ transition: { type: "spring", stiffness: 200, damping: 20 } }}
                >
                    Hi
                </motion.div>
            </motion.div>
        </div>
    );
}
