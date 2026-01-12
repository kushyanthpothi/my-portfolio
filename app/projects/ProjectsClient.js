'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import ThemeSwitch from '../../components/ThemeSwitch';
import MouseBubble from '../../components/MouseBubble';
import ProjectCard from '../../components/ProjectCard';
import Loading from '../../components/Loading';
import styles from './projects.module.css';

// Stack Card Component for Featured Projects
const StackCard = ({ card, index }) => {
    const topOffset = index * 40 + 40;

    return (
        <Link href={`/projects/${card.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div
                className={styles.cardWrapper}
                style={{
                    top: `${topOffset}px`,
                    zIndex: index
                }}
            >
                <div
                    className={styles.card}
                    style={{
                        backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.7)), url(${card.heroImage})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                    data-cursor-hover
                >
                    <div className={styles.cardContentWrapper}>
                        <div className={styles.badgeWrapper}>
                            <span className={styles.categoryBadge}>{card.category}</span>
                        </div>

                        <div className={styles.centerContent}>
                            <h2 className={styles.cardTitle}>{card.title}</h2>
                            <p className={styles.cardDescription}>{card.summary}</p>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};


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

    return (
        <main className={styles.pageContainer}>
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
