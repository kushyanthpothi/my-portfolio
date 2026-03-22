'use client';

import { useState, useEffect, useRef } from 'react';
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
    // State for projects
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadProjects = async () => {
            try {
                const fetchedProjects = await fetchProjects();
                if (fetchedProjects) {
                    setProjects(fetchedProjects);
                }
            } catch (error) {
                console.error("Failed to load projects:", error);
            } finally {
                setLoading(false);
            }
        };
        loadProjects();
    }, []);

    // Featured projects (first 3)
    const featuredProjects = projects.slice(0, 3);
    // More projects (remaining)
    const moreProjects = projects.slice(3);

    const containerRef = useRef(null);
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

    return (
        <main className={styles.pageContainer} ref={containerRef}>
            <Navbar />
            <MouseBubble />

            {/* Featured Projects Section with Stack Cards */}
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
                                key={project.id || index}
                                card={project}
                                index={index}
                            />
                        ))}
                    </div>
                )}
            </section>

            {/* More Projects Section with Grid */}
            {moreProjects.length > 0 && (
                <section className={styles.moreProjectsSection}>
                    <div className={styles.sectionDivider}>
                        <h2 className={styles.sectionTitle}>MORE PROJECTS</h2>
                    </div>

                    <div className={styles.projectsGrid}>
                        {moreProjects.map((project) => (
                            <ProjectCard key={project.id} project={project} />
                        ))}
                    </div>
                </section>
            )}

            <Footer />
            <ThemeSwitch />
        </main>
    );
}
