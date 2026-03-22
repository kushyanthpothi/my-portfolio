'use client';

import Link from 'next/link';
import styles from './StackCard.module.css';

/**
 * Shared sticky-stack card used on both the home Projects section
 * and the /projects page featured section.
 *
 * Props:
 *  - card   : project object  { slug, link?, title, category, heroImage, image?, summary, description? }
 *  - index  : card position used for the sticky top-offset and z-index
 */
const StackCard = ({ card, index }) => {
    const topOffset = index * 40 + 40;

    // Support both heroImage / image field names
    const imageUrl = card.heroImage || card.image;
    // Support both summary / description field names
    const bodyText = card.description || (card.summary ? card.summary.substring(0, 150) + '...' : '');
    // Support an explicit link or derive it from slug
    const href = card.link || `/projects/${card.slug}`;

    return (
        <Link
            href={href}
            style={{ textDecoration: 'none', color: 'inherit' }}
            data-cursor-hover
        >
            <div
                className={styles.cardWrapper}
                style={{
                    top: `${topOffset}px`,
                    zIndex: index,
                }}
            >
                <div
                    className={styles.card}
                    style={{
                        backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.6)), url(${imageUrl})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                >
                    <div className={styles.cardContentWrapper}>
                        {/* Top Badge */}
                        <div className={styles.badgeWrapper}>
                            <span className={styles.categoryBadge}>{card.category}</span>
                        </div>

                        {/* Center Content */}
                        <div className={styles.centerContent}>
                            <h2 className={styles.cardTitle}>{card.title}</h2>
                            <p className={styles.cardDescription}>{bodyText}</p>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default StackCard;
