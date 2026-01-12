'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

// --- Data ---
// Keep cardsData as fallback
// Initial empty state, fetched from Firestore
const cardsDataFallback = [];

// --- Stack Card Component ---
const StackCard = ({ card, index }) => {
    // Sticky Logic:
    const topOffset = index * 40 + 40;

    return (
        <Link
            href={card.link || `/projects/${card.slug}`}
            style={{ textDecoration: 'none', color: 'inherit' }}
            data-cursor-hover
        >
            <div
                className="card-wrapper"
                style={{
                    top: `${topOffset}px`,
                    zIndex: index
                }}
            >
                <div
                    className="card"
                    style={{
                        backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.6)), url(${card.image || card.heroImage})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                >
                    <div className="card-content-wrapper">
                        {/* Top Badge */}
                        <div className="badge-wrapper">
                            <span className="category-badge">{card.category}</span>
                        </div>

                        {/* Center Content */}
                        <div className="center-content">
                            <h2 className="card-title">{card.title}</h2>
                            <p className="card-description">{card.description || card.summary?.substring(0, 150) + '...'}</p>
                        </div>

                        {/* Bottom Action */}
                        <div className="action-wrapper">
                            {/* No button needed */}
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};

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
        @import url('https://fonts.googleapis.com/css2?family=Antonio:wght@100..700&family=Inter:wght@300;400;500;600&family=Outfit:wght@300;400;500;600;700;800&display=swap');

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
            color: white;
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

        /* Card Wrapper (Sticky Logic) */
        .card-wrapper {
          position: -webkit-sticky;
          position: sticky;
          margin-bottom: 3rem;
        }

        /* Card Visuals */
        .card {
          position: relative;
          overflow: hidden;
          border-radius: 2rem;
          color: white;
          min-height: 650px; /* Increased height as requested */
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: transform 0.5s ease-out;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        @media (min-width: 768px) {
           /* Can add hover effects specifically for desktop if needed */
        }

        .card-content-wrapper {
          width: 100%;
          height: 100%;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          z-index: 10;
        }

        /* Category Badge */
        .badge-wrapper {
           margin-bottom: 1.5rem;
        }

        .category-badge {
            background-color: #bef264; /* Lime green like reference 'Branding' badge */
            color: #1a2e05;
            padding: 0.5rem 1.25rem;
            border-radius: 9999px;
            font-size: 0.9rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            display: inline-block;
        }

        /* Typography */
        .card-title {
            font-family: 'Antonio', sans-serif; /* Changed to Antonio */
            font-size: 6rem; /* Increased size for impact */
            line-height: 0.9;
            font-weight: 700;
            text-transform: uppercase;
            margin-bottom: 1rem;
            letter-spacing: 0.02em;
            text-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }

        .card-description {
            font-family: 'Inter', sans-serif; /* Changed to Inter */
            font-size: 1.125rem;
            line-height: 1.6;
            max-width: 40rem;
            margin: 0 auto;
            color: rgba(255, 255, 255, 0.9);
            font-weight: 500;
            text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }

        /* Arrow Button */
        .action-wrapper {
            margin-top: 2rem;
        }

        .arrow-button {
            background: rgba(255, 255, 255, 0.2);
            border: 2px solid rgba(255, 255, 255, 0.4);
            border-radius: 50%;
            width: 50px;
            height: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.3s ease;
            backdrop-filter: blur(10px);
        }

        .arrow-button:hover {
            background: rgba(255, 255, 255, 0.3);
            border-color: rgba(255, 255, 255, 0.6);
            transform: scale(1.1);
        }

        .arrow-button svg {
            color: white;
        }

        @media (max-width: 600px) {
            .card {
                min-height: 400px;
            }
            .card-title {
                font-size: 2.5rem;
            }
            .card-description {
                font-size: 1rem;
            }
            .card-content-wrapper {
                padding: 1.5rem;
            }
            .card-wrapper {
                margin-bottom: 2rem;
            }
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
