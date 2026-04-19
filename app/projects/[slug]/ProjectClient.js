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
import styles from './projectDetail.module.css';

export default function ProjectClient({ initialProject = null, isPreview = false }) {
    const params = useParams();
    const slug = params?.slug;
    const [project, setProject] = useState(initialProject);
    const [otherProjects, setOtherProjects] = useState([]);
    const [loading, setLoading] = useState(!initialProject);

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

    if (loading) {
        return (
            <main className={styles.pageContainer}>
                <Navbar />
                <div style={{
                    height: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontFamily: 'var(--font-primary)'
                }}>
                    Loading project...
                </div>
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
