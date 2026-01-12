'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion, useSpring } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import styles from './MouseBubble.module.css';

export default function MouseBubble() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);
    const [isBlogHover, setIsBlogHover] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const pathname = usePathname();

    // Smooth spring animation for cursor movement
    const springConfig = { damping: 25, stiffness: 200 };
    const cursorX = useSpring(0, springConfig);
    const cursorY = useSpring(0, springConfig);

    // Reset hover state when pathname changes
    useEffect(() => {
        setIsHovering(false);
        setIsBlogHover(false);
    }, [pathname]);

    useEffect(() => {
        const checkHoverState = (clientX, clientY) => {
            const target = document.elementFromPoint(clientX, clientY);
            if (target && typeof target.closest === 'function') {
                const hoverElement = target.closest('[data-cursor-hover]');
                const blogElement = target.closest('[data-cursor-blog]');
                setIsHovering(!!hoverElement || !!blogElement);
                setIsBlogHover(!!blogElement);
            } else {
                setIsHovering(false);
                setIsBlogHover(false);
            }
        };

        const handleMouseMove = (e) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);
            setIsVisible(true);

            // Check if currently hovering over an element with data-cursor-hover
            checkHoverState(e.clientX, e.clientY);
        };

        const handleScroll = () => {
            // Re-check hover state at current mouse position when scrolling
            const lastX = cursorX.get();
            const lastY = cursorY.get();
            if (lastX && lastY) {
                checkHoverState(lastX, lastY);
            }
        };

        const handleMouseLeave = () => {
            setIsHovering(false);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('scroll', handleScroll, true); // Use capture phase to catch all scrolls
        document.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('scroll', handleScroll, true);
            document.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [cursorX, cursorY]);

    return (
        <>
            <motion.div
                className={`${styles.mouseBubble} ${isBlogHover ? styles.blogCursor : ''}`}
                style={{
                    left: cursorX,
                    top: cursorY,
                    opacity: isVisible ? 1 : 0,
                }}
                animate={{
                    scale: isHovering ? 4 : 1,
                }}
                transition={{
                    scale: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
                }}
            >
                {isHovering && (
                    <motion.div
                        className={styles.arrowIcon}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <ArrowUpRight size={10} strokeWidth={1.5} />
                    </motion.div>
                )}
            </motion.div>
        </>
    );
}
