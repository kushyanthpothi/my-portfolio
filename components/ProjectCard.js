'use client';

import Link from 'next/link';
import Image from 'next/image';
import styles from './ProjectCard.module.css';

export default function ProjectCard({ project }) {
    return (
        <Link href={`/projects/${project.slug}`} className={styles.cardLink} data-cursor-hover>
            <div className={styles.projectCard}>
                <div className={styles.imageWrapper}>
                    <Image
                        src={project.heroImage}
                        alt={project.title}
                        fill
                        className={styles.image}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                </div>
                <div className={styles.content}>
                    <span className={styles.category}>{project.category}</span>
                    <h3 className={styles.title}>{project.title}</h3>
                    <p className={styles.excerpt}>
                        {project.summary.substring(0, 120)}...
                    </p>
                </div>
            </div>
        </Link>
    );
}
