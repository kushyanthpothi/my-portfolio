'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import ThemeSwitch from '../../components/ThemeSwitch';
import MouseBubble from '../../components/MouseBubble';
import ProjectCard from '../../components/ProjectCard';
import StackCard from '../../components/StackCard';
import Loading from '../../components/Loading';
import styles from './projects.module.css';

import { fetchProjects } from '@/lib/firestoreUtils';

export default function ProjectsClient() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isPlaying, setIsPlaying] = useState(true);

    const carouselRef = useRef(null);
    const containerRef = useRef(null);

    useEffect(() => {
        const loadProjects = async () => {
            try {
                const fetchedProjects = await fetchProjects();
                if (fetchedProjects) {
                    const sortedProjects = [...fetchedProjects].sort((a, b) => {
                        if (a.createdAt && b.createdAt) {
                            return new Date(b.createdAt) - new Date(a.createdAt);
                        }
                        return (b.id || 0) - (a.id || 0);
                    });
                    setProjects(sortedProjects);
                }
            } catch (error) {
                console.error("Failed to load projects:", error);
            } finally {
                setLoading(false);
            }
        };
        loadProjects();
    }, []);

    // Mouse glow effect
    useEffect(() => {
        const handleMouseMove = (e) => {
            if (containerRef.current) {
                containerRef.current.style.setProperty("--mouse-client-x", `${e.clientX}px`);
                containerRef.current.style.setProperty("--mouse-client-y", `${e.clientY}px`);
            }
        };
        window.addEventListener('mousemove', handleMouseMove, { passive: true });
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // Auto-scroll carousel using rAF — avoids CSS scroll-snap conflicts in production
    useEffect(() => {
        const track = carouselRef.current;
        if (!track || !isPlaying) return;

        let paused = false;
        let animationId = null;
        let timeoutId = null;

        const onEnter = () => { paused = true; };
        const onLeave = () => { paused = false; };
        track.addEventListener('mouseenter', onEnter);
        track.addEventListener('mouseleave', onLeave);

        const smoothScrollTo = (target, duration = 500) => {
            if (animationId) cancelAnimationFrame(animationId);
            const start = track.scrollLeft;
            const distance = target - start;
            const startTime = performance.now();

            const step = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                // Ease-in-out cubic
                const ease = progress < 0.5
                    ? 4 * progress * progress * progress
                    : 1 - Math.pow(-2 * progress + 2, 3) / 2;
                track.scrollLeft = start + distance * ease;
                if (progress < 1) {
                    animationId = requestAnimationFrame(step);
                }
            };
            animationId = requestAnimationFrame(step);
        };

        const scheduleNext = () => {
            timeoutId = setTimeout(() => {
                if (paused) { scheduleNext(); return; }
                const cardWidth = (track.firstElementChild?.offsetWidth ?? 336) + 24;
                const maxScroll = track.scrollWidth - track.clientWidth;
                const nextLeft = track.scrollLeft >= maxScroll - 4 ? 0 : track.scrollLeft + cardWidth;
                smoothScrollTo(nextLeft);
                scheduleNext();
            }, 3500);
        };

        scheduleNext();

        return () => {
            clearTimeout(timeoutId);
            if (animationId) cancelAnimationFrame(animationId);
            track.removeEventListener('mouseenter', onEnter);
            track.removeEventListener('mouseleave', onLeave);
        };
    }, [projects, isPlaying]);

    const scrollCarousel = useCallback((dir) => {
        const track = carouselRef.current;
        if (!track) return;
        const cardWidth = (track.firstElementChild?.offsetWidth ?? 336) + 24;
        const maxScroll = track.scrollWidth - track.clientWidth;
        let target = track.scrollLeft + dir * cardWidth;
        target = Math.max(0, Math.min(target, maxScroll));

        if (track._rAF) cancelAnimationFrame(track._rAF);
        const start = track.scrollLeft;
        const distance = target - start;
        const startTime = performance.now();

        const step = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / 400, 1);
            const ease = progress < 0.5
                ? 4 * progress * progress * progress
                : 1 - Math.pow(-2 * progress + 2, 3) / 2;
            track.scrollLeft = start + distance * ease;
            if (progress < 1) track._rAF = requestAnimationFrame(step);
        };
        track._rAF = requestAnimationFrame(step);
    }, []);

    const featuredProjects = projects.slice(0, 3);
    const moreProjects = projects.slice(3);

    return (
        <main className={styles.pageContainer} ref={containerRef}>
            <Navbar />
            <MouseBubble />

            {/* Featured Projects Section */}
            <section className={styles.featuredSection}>
                <div className={styles.sectionHeader}>
                    <h1 className={styles.mainTitle}>FEATURED PROJECTS</h1>
                    <p className={styles.sectionDescription}>
                        Explore my latest work showcasing innovative solutions across web development,
                        mobile applications, and creative design. Each project represents a unique challenge
                        solved with modern technologies and user-centric design principles.
                    </p>
                </div>

                {loading ? (
                    <Loading text="Loading Projects..." />
                ) : (
                    <div className={styles.stackContainer}>
                        {featuredProjects.map((project, index) => (
                            <StackCard
                                key={project.slug || `${project.id}-feat-${index}`}
                                card={project}
                                index={index}
                            />
                        ))}
                    </div>
                )}
            </section>

            {/* More Projects — Carousel */}
            {moreProjects.length > 0 && (
                <section className={styles.moreProjectsSection}>
                    <div className={styles.carouselHeader}>
                        <div className={styles.sectionDividerLeft}>
                            <h2 className={styles.sectionTitle}>MORE PROJECTS</h2>
                        </div>
                        <div className={styles.carouselControls}>
                            <button
                                className={styles.playPauseBtn}
                                onClick={() => setIsPlaying((p) => !p)}
                                aria-label={isPlaying ? 'Pause auto-scroll' : 'Play auto-scroll'}
                                title={isPlaying ? 'Pause' : 'Play'}
                            >
                                {isPlaying ? (
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                        <rect x="6" y="4" width="4" height="16" />
                                        <rect x="14" y="4" width="4" height="16" />
                                    </svg>
                                ) : (
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M8 5v14l11-7z" />
                                    </svg>
                                )}
                            </button>
                            <button
                                className={styles.carouselArrow}
                                onClick={() => scrollCarousel(-1)}
                                aria-label="Previous projects"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="15 18 9 12 15 6" />
                                </svg>
                            </button>
                            <button
                                className={styles.carouselArrow}
                                onClick={() => scrollCarousel(1)}
                                aria-label="Next projects"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="9 18 15 12 9 6" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div className={styles.carouselTrack} ref={carouselRef}>
                        {moreProjects.map((project, index) => (
                            <div key={project.id || `more-${index}`} className={styles.carouselItem}>
                                <ProjectCard project={project} />
                            </div>
                        ))}
                    </div>
                </section>
            )}

            <Footer />
            <ThemeSwitch />
        </main>
    );
}
