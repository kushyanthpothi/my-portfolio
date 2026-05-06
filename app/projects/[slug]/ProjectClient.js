'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, notFound } from 'next/navigation';
import Image from 'next/image';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import ThemeSwitch from '../../../components/ThemeSwitch';
import MouseBubble from '../../../components/MouseBubble';
import ProjectCard from '../../../components/ProjectCard';
import ProjectCarousel from '../../../components/ProjectCarousel';
import Loading from '../../../components/Loading';
import styles from './projectDetail.module.css';

export default function ProjectClient({ initialProject = null, isPreview = false }) {
    const params = useParams();
    const slug = params?.slug;
    const [project, setProject] = useState(initialProject);
    const [otherProjects, setOtherProjects] = useState([]);
    const [loading, setLoading] = useState(!initialProject);
    const [isPlaying, setIsPlaying] = useState(true);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const carouselRef = useRef(null);

    const openLightbox = () => setLightboxOpen(true);
    const closeLightbox = () => setLightboxOpen(false);

    useEffect(() => {
        if (!lightboxOpen) return;
        const onKey = (e) => { if (e.key === 'Escape') closeLightbox(); };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [lightboxOpen]);

    useEffect(() => {
        if (initialProject) {
            setLoading(false);
            return;
        }

        let currentSlug = slug;

        // Handle Firebase fallback rewrite
        if (currentSlug === '__fallback' && typeof window !== 'undefined') {
            // Extract actual slug from URL: /projects/actual-slug
            const pathParts = window.location.pathname.split('/').filter(p => p);
            currentSlug = pathParts[pathParts.length - 1];
        }

        if (!currentSlug) return;

        const loadProject = async () => {
            try {
                const { fetchProjectBySlug: fetchProject, fetchProjects } = await import('@/lib/firestoreUtils');
                const fetchedProject = await fetchProject(currentSlug);
                if (fetchedProject) {
                    setProject(fetchedProject);
                } else {
                    // Handle not found
                    setProject(null);
                }

                // Also fetch other projects for "More Projects" section
                const allProjects = await fetchProjects();
                if (allProjects && allProjects.length > 0) {
                    // Fetch up to 8 projects for the carousel
                    const others = allProjects.filter(p => p.slug !== currentSlug).slice(0, 8);
                    setOtherProjects(others);
                }

            } catch (error) {
                console.error("Failed to fetch project from Firestore:", error);
            } finally {
                setLoading(false);
            }
        };
        loadProject();
    }, [slug]);

    useEffect(() => {
        if (project && project.title) {
            document.title = `${project.title} | Kushyanth Pothineni`;
        }
    }, [project]);

    // Auto-scroll carousel logic using rAF (consistent with fix)
    useEffect(() => {
        const track = carouselRef.current;
        if (!track || otherProjects.length === 0 || !isPlaying) return;

        let paused = false;
        let animationId = null;
        let timeoutId = null;

        const onEnter = () => { paused = true; };
        const onLeave = () => { paused = false; };
        track.addEventListener('mouseenter', onEnter);
        track.addEventListener('mouseleave', onLeave);

        const smoothScrollTo = (target, duration = 500) => {
            const start = track.scrollLeft;
            const distance = target - start;
            const startTime = performance.now();

            const step = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
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
    }, [otherProjects, isPlaying]);

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

    if (loading) {
        return (
            <main className={`${styles.pageContainer} ${isPreview ? styles.previewContainer : ''}`}>
                {!isPreview && <Navbar />}
                <Loading text="Loading project..." />
            </main>
        );
    }

    if (!project) {
        return notFound();
    }

    return (
        <main className={`${styles.pageContainer} ${isPreview ? styles.previewContainer : ''}`}>
            {!isPreview && <Navbar />}
            {!isPreview && <MouseBubble />}

            <div className={styles.contentWrapper}>
                {/* Hero Section */}
                <section className={styles.heroSection}>
                    <div className={styles.categoryPill}>{project.category || 'Category'}</div>
                    <h1 className={styles.projectTitle}>{project.title || 'Untitled Project'}</h1>
                    <p className={styles.projectSummary} style={!project.summary ? { opacity: 0.6 } : {}}>
                        {project.summary || 'Write a short summary of your project here...'}
                    </p>

                    {/* Metadata Grid */}
                    <div className={styles.metadataGrid}>
                        <div className={styles.metadataItem}>
                            <span className={styles.metadataLabel}>Year</span>
                            <span className={styles.metadataValue}>{project.year || 'YYYY'}</span>
                        </div>
                        <div className={styles.metadataItem}>
                            <span className={styles.metadataLabel}>Industry</span>
                            <span className={styles.metadataValue}>{project.industry || 'Industry'}</span>
                        </div>
                        <div className={styles.metadataItem}>
                            <span className={styles.metadataLabel}>Client</span>
                            <span className={styles.metadataValue}>{project.client || 'Client Name'}</span>
                        </div>
                        <div className={styles.metadataItem}>
                            <span className={styles.metadataLabel}>Project Duration</span>
                            <span className={styles.metadataValue}>{project.duration || 'Duration'}</span>
                        </div>
                    </div>
                </section>

                {/* Hero Image */}
                {project.heroImage && (
                    <div className={styles.heroImageWrapper}>
                        <Image
                            src={project.heroImage}
                            alt={project.title}
                            fill
                            className={styles.heroImage}
                            priority
                        />
                        {!isPreview && (
                            <button
                                className={styles.fullscreenBtn}
                                onClick={openLightbox}
                                aria-label="View image fullscreen"
                                title="View fullscreen"
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="15 3 21 3 21 9"/>
                                    <polyline points="9 21 3 21 3 15"/>
                                    <line x1="21" y1="3" x2="14" y2="10"/>
                                    <line x1="3" y1="21" x2="10" y2="14"/>
                                </svg>
                            </button>
                        )}
                    </div>
                )}

                {lightboxOpen && project.heroImage && (
                    <div
                        className={styles.lightboxOverlay}
                        onClick={closeLightbox}
                        role="dialog"
                        aria-modal="true"
                        aria-label="Image fullscreen view"
                    >
                        <button className={styles.lightboxClose} onClick={closeLightbox} aria-label="Close fullscreen">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"/>
                                <line x1="6" y1="6" x2="18" y2="18"/>
                            </svg>
                        </button>
                        <img
                            src={project.heroImage}
                            alt={project.title}
                            className={styles.lightboxImage}
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                )}

                {/* Content Sections */}
                <section className={styles.contentSection}>
                    <div className={styles.textBlock}>
                        <h2 className={styles.sectionHeading}>PROBLEM :</h2>
                        <p className={styles.sectionText} style={!project.problem ? { opacity: 0.6 } : {}}>
                            {project.problem || 'Describe the problem here...'}
                        </p>
                    </div>

                    <div className={styles.textBlock}>
                        <h2 className={styles.sectionHeading}>SOLUTION :</h2>
                        <p className={styles.sectionText} style={!project.solution ? { opacity: 0.6 } : {}}>
                            {project.solution || 'Describe the solution here...'}
                        </p>
                    </div>

                    <div className={styles.textBlock}>
                        <h2 className={styles.sectionHeading}>CHALLENGE :</h2>
                        <p className={styles.sectionText} style={!project.challenge ? { opacity: 0.6 } : {}}>
                            {project.challenge || 'Describe the challenge here...'}
                        </p>
                    </div>

                    {project.contentImages && project.contentImages.length > 0 && (
                        <ProjectCarousel images={project.contentImages} title={project.title} />
                    )}

                    {/* Tech Stack */}
                    {project.techStack && project.techStack.length > 0 && (
                        <div className={styles.techStackSection}>
                            <h3 className={styles.techStackTitle}>Tech Stack</h3>
                            <div className={styles.techStackGrid}>
                                {project.techStack.map((tech, index) => (
                                    <span key={index} className={styles.techBadge}>
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Links */}
                    <div className={styles.linksSection}>
                        {project.github && (
                            <a
                                href={project.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.projectLink}
                            >
                                View on GitHub
                            </a>
                        )}
                        {project.liveUrl && (
                            <a
                                href={project.liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.projectLink}
                            >
                                Visit Live Site
                            </a>
                        )}
                    </div>
                </section>

                {/* More Projects Section */}
                {!isPreview && otherProjects.length > 0 && (
                    <section className={styles.moreProjectsSection}>
                        <div className={styles.carouselHeader}>
                            <div className={styles.sectionDividerLeft}>
                                <h2 className={styles.moreProjectsTitle}>MORE PROJECTS</h2>
                            </div>
                            <div className={styles.carouselControls}>
                                <button
                                    className={styles.playPauseBtn}
                                    onClick={() => setIsPlaying(!isPlaying)}
                                    aria-label={isPlaying ? "Pause auto-scroll" : "Play auto-scroll"}
                                    title={isPlaying ? "Pause" : "Play"}
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
                                        <polyline points="15 18 9 12 15 6"/>
                                    </svg>
                                </button>
                                <button
                                    className={styles.carouselArrow}
                                    onClick={() => scrollCarousel(1)}
                                    aria-label="Next projects"
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="9 18 15 12 9 6"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div className={styles.carouselTrack} ref={carouselRef}>
                            {otherProjects.map((proj, index) => (
                                <div key={proj.slug || `${proj.id}-other-${index}`} className={styles.carouselItem}>
                                    <ProjectCard project={proj} />
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>

            {!isPreview && <Footer />}
            {!isPreview && <ThemeSwitch />}
        </main>
    );
}
