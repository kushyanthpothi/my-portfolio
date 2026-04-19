'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import styles from './ProjectCarousel.module.css';

export default function ProjectCarousel({ images, title }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [isPlaying, setIsPlaying] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const trackRef = useRef(null);

    // Auto-Scroll generic behavior hook
    useEffect(() => {
        if (!images || images.length <= 1) return;

        let interval;
        if (!isHovered && isPlaying) {
            interval = setInterval(() => {
                setCurrentIndex((prev) => (prev + 1) % images.length);
            }, 2000); // 2 seconds auto-scroll
        }

        return () => clearInterval(interval);
    }, [images, isHovered, isPlaying]);

    // Active item scroll tracker
    useEffect(() => {
        const track = trackRef.current;
        if (!track || !track.children[currentIndex]) return;
        
        const activeChild = track.children[currentIndex];
        
        // Calculate safe local horizontal scroll to center the item
        const childOffsetLeft = activeChild.offsetLeft;
        const childWidth = activeChild.offsetWidth;
        const trackWidth = track.clientWidth;
        
        const scrollPosition = childOffsetLeft - (trackWidth / 2) + (childWidth / 2);
        
        track.scrollTo({
            left: scrollPosition,
            behavior: 'smooth'
        });
    }, [currentIndex]);

    // Escape key handler for fullscreen exit
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && isFullscreen) {
                setIsFullscreen(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isFullscreen]);

    if (!images || images.length === 0) return null;

    // Single image fallback
    if (images.length === 1) {
        return (
            <div className={styles.carouselContainer}>
                <div className={styles.mainImageWrapper}>
                    <Image
                        src={images[0]}
                        alt={`${title || 'Project'} content`}
                        fill
                        className={styles.mainImage}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className={`${styles.carouselContainer} ${isFullscreen ? styles.fullscreenMode : ''}`}>
            {/* Main Image Display */}
            <div 
                className={styles.mainImageWrapper}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {images.map((img, index) => (
                    <Image
                        key={index}
                        src={img}
                        alt={`${title || 'Project'} preview ${index + 1}`}
                        fill
                        className={styles.mainImage}
                        style={{
                            opacity: currentIndex === index ? 1 : 0,
                            zIndex: currentIndex === index ? 1 : 0,
                            pointerEvents: currentIndex === index ? 'auto' : 'none'
                        }}
                    />
                ))}
            </div>

            {/* Thumbnail Track with Arrows */}
            <div className={styles.thumbnailSection}>
                <button 
                    className={`${styles.arrowButton} ${isPlaying ? styles.playActive : styles.pausedActive}`}
                    onClick={() => setIsPlaying(!isPlaying)}
                    aria-label={isPlaying ? "Pause" : "Play"}
                >
                    {isPlaying ? (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                            <rect x="6" y="4" width="4" height="16"></rect>
                            <rect x="14" y="4" width="4" height="16"></rect>
                        </svg>
                    ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ marginLeft: '2px' }}>
                            <polygon points="5 3 19 12 5 21 5 3"></polygon>
                        </svg>
                    )}
                </button>

                <button 
                    className={styles.arrowButton} 
                    onClick={() => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)}
                    aria-label="Previous image"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                </button>

                <div className={styles.thumbnailTrack} ref={trackRef}>
                    {images.map((img, index) => (
                        <div 
                            key={index}
                            className={`${styles.thumbnailWrapper} ${currentIndex === index ? styles.thumbnailActive : ''}`}
                            onClick={() => setCurrentIndex(index)}
                        >
                            <Image
                                src={img}
                                alt={`Thumbnail ${index + 1}`}
                                fill
                                className={styles.thumbnailImage}
                            />
                        </div>
                    ))}
                </div>

                <button 
                    className={styles.arrowButton} 
                    onClick={() => setCurrentIndex((prev) => (prev + 1) % images.length)}
                    aria-label="Next image"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                </button>

                {/* Expand Fullscreen Button */}
                <button
                    className={styles.arrowButton}
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    aria-label={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
                    style={{ marginLeft: '0.5rem', background: 'transparent' }}
                >
                    {isFullscreen ? (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="4 14 10 14 10 20"></polyline>
                            <polyline points="20 10 14 10 14 4"></polyline>
                            <line x1="14" y1="10" x2="21" y2="3"></line>
                            <line x1="3" y1="21" x2="10" y2="14"></line>
                        </svg>
                    ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="15 3 21 3 21 9"></polyline>
                            <polyline points="9 21 3 21 3 15"></polyline>
                            <line x1="21" y1="3" x2="14" y2="10"></line>
                            <line x1="3" y1="21" x2="10" y2="14"></line>
                        </svg>
                    )}
                </button>
            </div>
        </div>
    );
}
