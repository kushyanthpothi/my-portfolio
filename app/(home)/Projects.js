'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import StackCard from '../../components/StackCard';

// Initial empty state, fetched from Firestore
const cardsDataFallback = [];


// --- Main Page Component ---
export default function Projects() {
    const [projects, setProjects] = useState(cardsDataFallback);

    useEffect(() => {
        const loadProjects = async () => {
            try {
                const { fetchProjects } = await import('../../lib/firestoreUtils');
                const fetchedProjects = await fetchProjects();

                if (fetchedProjects && fetchedProjects.length > 0) {
                    // Transform data if needed to match card format
                    // The firestore data has all details, we just need to map it if structure is different
                    // But based on my seeder, I am seeding the exact 'project' object.
                    // The Projects.js uses 'image', 'link', 'description'. 
                    // My data has 'heroImage', 'slug', 'summary'.

                    // I will let the StackCard handle the prop difference (added || logic above)
                    // or map it here.

                    const mappedProjects = fetchedProjects.slice(0, 3).map(p => ({
                        ...p,
                        id: p.id,
                        link: `/projects/${p.slug}`,
                        image: p.heroImage,
                        description: p.summary
                    }));
                    setProjects(mappedProjects);
                }
            } catch (error) {
                console.error("Failed to load projects from Firestore", error);
            }
        };
        loadProjects();
    }, []);

    return (
        <div className="page-container">
            <div className="projects-header">
                <h1 className="projects-title">FEATURED PROJECTS</h1>
            </div>
            <div className="stack-container">
                {projects.map((card, index) => (
                    <StackCard
                        key={card.id || index}
                        card={card}
                        index={index}
                    />
                ))}
            </div>

            <div className="action-wrapper-page">
                <a href="/projects" style={{ textDecoration: 'none' }}>
                    <button className="ctaButton">BROWSE ALL PROJECTS</button>
                </a>
            </div>

            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Antonio:wght@100..700&family=Outfit:wght@300;400;500;600;700;800&display=swap');

        /* Page Layout */
        .page-container {
          min-height: 100vh;
          background-color: var(--bg-primary);
          font-family: 'Outfit', sans-serif;
          padding: 1.5rem;
          padding-bottom: 6rem;
        }

        .projects-header {
            text-align: center;
            padding-top: 4rem;
            padding-bottom: 2rem;
        }

        .projects-title {
            font-family: 'Antonio', sans-serif;
            font-size: 4rem;
            font-weight: 700;
            color: var(--text-primary);
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin: 0;
        }

        @media (max-width: 600px) {
            .projects-title {
                font-size: 2.5rem;
            }
        }

        .stack-container {
          max-width: 80rem;
          margin: 0 auto;
          padding-top: 2.5rem;
          overflow: clip;
        }

        /* Action Button */
        .action-wrapper-page {
            display: flex;
            justify-content: center;
            margin-top: 4rem;
            width: 100%;
        }

        .ctaButton {
            background: transparent;
            border: 1px solid var(--accent-color);
            color: var(--accent-color);
            padding: 20px 50px;
            border-radius: 40px;
            font-size: 1.6rem;
            text-transform: uppercase;
            letter-spacing: 1px;
            cursor: pointer;
            transition: color 0.4s ease;
            font-family: var(--font-heading);
            position: relative;
            overflow: hidden;
            z-index: 1;
        }

        .ctaButton::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: var(--accent-color);
            z-index: -1;
            clip-path: circle(0% at 0% 0%);
            transition: clip-path 0.5s ease-out;
        }

        .ctaButton:hover::before {
            clip-path: circle(150% at 0% 0%);
        }

        .ctaButton:hover {
            color: #000;
        }
      `}</style>
        </div>
    );
}
