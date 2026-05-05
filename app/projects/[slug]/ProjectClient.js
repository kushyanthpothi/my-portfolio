'use client';

import { useState, useEffect } from 'react';
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
    const [lightboxOpen, setLightboxOpen] = useState(false);

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
                    const others = allProjects.filter(p => p.slug !== currentSlug).slice(0, 4);
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
                        <div className={styles.sectionDivider}>
                            <h2 className={styles.moreProjectsTitle}>MORE PROJECTS</h2>
                        </div>
                        <div className={styles.projectsGrid}>
                            {otherProjects.map((proj, index) => (
                                <ProjectCard key={proj.slug || `${proj.id}-other-${index}`} project={proj} />
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
