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

    // Desktop scroll values
    const yDesktop = useTransform(scrollY, [0, 1600, 3000], [50, 50, -1300]);
    const xDesktop = useTransform(scrollY, [100, 600, 3000], [0, 400, 300]);
    const rotateYDesktopRaw = useTransform(scrollY, [100, 800, 1600], [0, 180, 360]);
    const rotateZDesktop = useTransform(scrollY, [0, 100, 350, 600, 900, 1150, 1400], [0, 0, 0, -5, -5, 0, 5]);

    // Tablet scroll values - 360 flip before About, stop at middle of About, shift right when flipping starts
    // Complete 360° flip before reaching About section (around scroll 800-1000)
    // Stop at middle of About section (around scroll 1400)
    // Shift right when flip starts
    const yTablet = useTransform(scrollY, [0, 400, 1400, 2600], [50, 50, 50, -900]);
    // X Position: Start centered, shift right when flip begins (around scroll 200), move further right
    const xTablet = useTransform(scrollY, [0, 200, 500, 3000], [0, 100, 200, 180]);
    // 360° rotation completing at middle of About section (around scroll 1400)
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
                        src="https://burst.shopifycdn.com/photos/portrait-of-illuminated-laptop.jpg?exif=0&iptc=0"
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
