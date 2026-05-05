'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import ThemeSwitch from '../../../components/ThemeSwitch';
import styles from './blogPost.module.css';
import { motion } from 'framer-motion';
import Loading from '../../../components/Loading';

export default function BlogPostClient({ initialBlog = null, initialRelatedBlogs = [], isPreview = false }) {
    const params = useParams();
    const [blog, setBlog] = useState(initialBlog);
    const [relatedBlogs, setRelatedBlogs] = useState(initialRelatedBlogs);
    const [loading, setLoading] = useState(!initialBlog);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [isPlaying, setIsPlaying] = useState(true);
    const carouselRef = useRef(null);

    const openLightbox  = useCallback(() => setLightboxOpen(true),  []);
    const closeLightbox = useCallback(() => setLightboxOpen(false), []);

    useEffect(() => {
        if (!lightboxOpen) return;
        const onKey = (e) => { if (e.key === 'Escape') closeLightbox(); };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [lightboxOpen, closeLightbox]);

    useEffect(() => {
        const track = carouselRef.current;
        if (!track || relatedBlogs.length === 0 || !isPlaying) return;

        let paused = false;
        const onEnter = () => { paused = true; };
        const onLeave = () => { paused = false; };
        track.addEventListener('mouseenter', onEnter);
        track.addEventListener('mouseleave', onLeave);

        const interval = setInterval(() => {
            if (paused) return;
            const cardWidth = track.firstElementChild?.offsetWidth + 24 || 360;
            const maxScroll = track.scrollWidth - track.clientWidth;
            if (track.scrollLeft >= maxScroll - 4) {
                track.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                track.scrollBy({ left: cardWidth, behavior: 'smooth' });
            }
        }, 3500);

        return () => {
            clearInterval(interval);
            track.removeEventListener('mouseenter', onEnter);
            track.removeEventListener('mouseleave', onLeave);
        };
    }, [relatedBlogs, isPlaying]);

    const scrollCarousel = useCallback((dir) => {
        const track = carouselRef.current;
        if (!track) return;
        const cardWidth = track.firstElementChild?.offsetWidth + 24 || 360;
        track.scrollBy({ left: dir * cardWidth, behavior: 'smooth' });
    }, []);

    useEffect(() => {
        // Only fetch if we don't have initial data (fallback scenario)
        if (initialBlog) {
            setLoading(false);
            return;
        }

        const loadBlog = async () => {
            try {
                let slug = params.slug;

                // Handle Firebase fallback rewrite
                if (slug === '__fallback' && typeof window !== 'undefined') {
                    // Extract actual slug from URL: /blogs/actual-slug
                    const pathParts = window.location.pathname.split('/').filter(p => p);
                    slug = pathParts[pathParts.length - 1];
                }

                if (!slug) return;

                const { fetchBlogBySlug, fetchBlogs } = await import('@/lib/firestoreUtils');
                const fetchedBlog = await fetchBlogBySlug(slug);
                setBlog(fetchedBlog);

                // Update document title for dynamically loaded blogs
                if (fetchedBlog?.title) {
                    document.title = `${fetchedBlog.title} | Kushyanth Pothineni`;
                }

                // Fetch related blogs (other blogs in the same category or just other blogs)
                const allBlogs = await fetchBlogs();
                const related = allBlogs.filter(b => b.slug !== slug).slice(0, 3);
                setRelatedBlogs(related);
            } catch (error) {
                console.error("Failed to load blog:", error);
            } finally {
                setLoading(false);
            }
        };

        loadBlog();
    }, [params.slug, initialBlog]);

    if (loading) {
        return (
            <main className={`${styles.pageContainer} ${isPreview ? styles.previewContainer : ''}`}>
                {!isPreview && <Navbar />}
                <Loading text="Loading article..." />
            </main>
        );
    }

    if (!blog) {
        return (
            <main className={`${styles.pageContainer} ${isPreview ? styles.previewContainer : ''}`}>
                {!isPreview && <Navbar />}
                <div className={styles.errorContainer}>
                    <h1 className={styles.errorTitle}>ARTICLE NOT FOUND</h1>
                    <p className={styles.errorText}>The article you're looking for doesn't exist.</p>
                    <Link href="/blogs" className={styles.backButton}>
                        Back to Blogs
                    </Link>
                </div>
            </main>
        );
    }

    /**
     * Sanitizes a URL extracted from markdown content.
     * Only http, https, and mailto schemes are permitted.
     * Any other scheme (javascript:, data:, vbscript:, etc.) returns '#'
     * to prevent DOM-based XSS (issue #15 — DOM text reinterpreted as HTML).
     */
    const sanitizeHref = (href) => {
        if (!href || typeof href !== 'string') return '#';
        try {
            const parsed = new URL(href);
            const allowed = ['http:', 'https:', 'mailto:'];
            return allowed.includes(parsed.protocol) ? parsed.href : '#';
        } catch {
            // Relative URLs (no scheme) are not expected in blog content links.
            return '#';
        }
    };

    // Helper to parse inline markdown (bold, italic, links, code)
    const parseInlineMarkdown = (text) => {
        if (!text) return text;

        const parts = [];
        let remaining = text;
        let key = 0;

        while (remaining.length > 0) {
            // Bold text: **text**
            const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
            // Italic text: *text* or _text_
            const italicMatch = remaining.match(/(?<!\*)\*([^*]+)\*(?!\*)|_([^_]+)_/);
            // Inline code: `code`
            const codeMatch = remaining.match(/`([^`]+)`/);
            // Links: [text](url)
            const linkMatch = remaining.match(/\[([^\]]+)\]\(([^)]+)\)/);

            const matches = [
                { type: 'bold',   match: boldMatch,   index: boldMatch?.index   ?? Infinity },
                { type: 'italic', match: italicMatch, index: italicMatch?.index ?? Infinity },
                { type: 'code',   match: codeMatch,   index: codeMatch?.index   ?? Infinity },
                { type: 'link',   match: linkMatch,   index: linkMatch?.index   ?? Infinity },
            ].filter(m => m.match).sort((a, b) => a.index - b.index);

            if (matches.length === 0) {
                parts.push(remaining);
                break;
            }

            const earliest = matches[0];

            if (earliest.index > 0) {
                parts.push(remaining.substring(0, earliest.index));
            }

            switch (earliest.type) {
                case 'bold':
                    parts.push(<strong key={key++} className={styles.boldText}>{earliest.match[1]}</strong>);
                    remaining = remaining.substring(earliest.index + earliest.match[0].length);
                    break;
                case 'italic':
                    parts.push(<em key={key++}>{earliest.match[1] || earliest.match[2]}</em>);
                    remaining = remaining.substring(earliest.index + earliest.match[0].length);
                    break;
                case 'code':
                    parts.push(<code key={key++} className={styles.inlineCode}>{earliest.match[1]}</code>);
                    remaining = remaining.substring(earliest.index + earliest.match[0].length);
                    break;
                case 'link': {
                    // Sanitize the href before rendering to block javascript: and
                    // other dangerous URI schemes (issue #15).
                    const safeHref = sanitizeHref(earliest.match[2]);
                    parts.push(
                        <a key={key++} href={safeHref} target="_blank" rel="noopener noreferrer" className={styles.contentLink}>
                            {earliest.match[1]}
                        </a>
                    );
                    remaining = remaining.substring(earliest.index + earliest.match[0].length);
                    break;
                }
            }
        }

        return parts.length === 1 && typeof parts[0] === 'string' ? parts[0] : parts;
    };

    // Parse content into sections
    const renderContent = (content) => {
        // Safety check: ensure content is a string
        if (typeof content !== 'string') {
            console.error('Invalid content type:', typeof content);
            return <p className={styles.contentParagraph}>Content unavailable</p>;
        }

        if (!content.trim()) {
            return <p className={styles.contentParagraph} style={{ opacity: 0.6 }}>Write your blog content here...</p>;
        }

        const sections = content.split('\n\n');
        return sections.map((section, index) => {
            // Handle H2 headers: ## Header
            if (section.startsWith('## ')) {
                return (
                    <h2 key={index} className={styles.contentH2}>
                        {parseInlineMarkdown(section.replace('## ', ''))}
                    </h2>
                );
            }
            // Handle H3 headers: ### Header
            if (section.startsWith('### ')) {
                return (
                    <h3 key={index} className={styles.contentH3}>
                        {parseInlineMarkdown(section.replace('### ', ''))}
                    </h3>
                );
            }
            // Handle standalone bold headers (like **Title**)
            if (section.startsWith('**') && section.endsWith('**') && !section.slice(2, -2).includes('**')) {
                return (
                    <h3 key={index} className={styles.contentH3}>
                        {section.replace(/\*\*/g, '')}
                    </h3>
                );
            }
            // Handle blockquotes: > text
            if (section.startsWith('> ')) {
                return (
                    <blockquote key={index} className={styles.blockquote}>
                        {parseInlineMarkdown(section.replace(/^> /gm, ''))}
                    </blockquote>
                );
            }
            // Handle lists: - item
            if (section.startsWith('- ')) {
                const items = section.split('\n').filter(item => item.trim());
                return (
                    <ul key={index} className={styles.contentList}>
                        {items.map((item, i) => (
                            <li key={i}>{parseInlineMarkdown(item.replace('- ', ''))}</li>
                        ))}
                    </ul>
                );
            }
            // Handle numbered lists: 1. item
            if (/^\d+\. /.test(section)) {
                const items = section.split('\n').filter(item => item.trim());
                return (
                    <ol key={index} className={styles.orderedList}>
                        {items.map((item, i) => (
                            <li key={i}>{parseInlineMarkdown(item.replace(/^\d+\. /, ''))}</li>
                        ))}
                    </ol>
                );
            }
            // Handle code blocks: ```code```
            if (section.startsWith('```') && section.endsWith('```')) {
                const code = section.slice(3, -3).replace(/^\w+\n/, ''); // Remove language identifier
                return (
                    <pre key={index} className={styles.codeBlock}>
                        <code>{code}</code>
                    </pre>
                );
            }
            // Regular paragraphs with inline markdown
            if (section.trim()) {
                return (
                    <p key={index} className={styles.contentParagraph}>
                        {parseInlineMarkdown(section)}
                    </p>
                );
            }
            return null;
        });
    };

    // Show unique related blogs (fixed repetition issue)
    const displayBlogs = relatedBlogs;

    return (
        <main className={`${styles.pageContainer} ${isPreview ? styles.previewContainer : ''}`}>
            {!isPreview && <Navbar />}

            <article className={styles.article}>
                {/* Article Header - Portavia Style */}
                <motion.header
                    className={styles.articleHeader}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: [0.33, 1, 0.68, 1] }}
                >
                    <div className={styles.metaRow}>
                        <span className={styles.categoryBadge}>{blog.category || 'Category'}</span>
                        <span className={styles.articleDate}>{blog.date || 'Date'}</span>
                    </div>

                    <h1 className={styles.articleTitle}>{blog.title || 'Untitled Blog Post'}</h1>

                    <p className={styles.articleExcerpt} style={!blog.excerpt ? { opacity: 0.6 } : {}}>
                        {blog.excerpt || 'Write a short excerpt summarizing your blog post here...'}
                    </p>
                </motion.header>

                {/* Featured Image - Full Width with Rounded Corners */}
                {blog.coverImage && (
                    <motion.div
                        className={styles.featuredImageWrapper}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.15, ease: [0.33, 1, 0.68, 1] }}
                    >
                        <img
                            src={blog.coverImage}
                            alt={blog.title}
                            className={styles.featuredImage}
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
                    </motion.div>
                )}

                {lightboxOpen && blog.coverImage && (
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
                            src={blog.coverImage}
                            alt={blog.title}
                            className={styles.lightboxImage}
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                )}

                {/* Article Content */}
                <motion.div
                    className={styles.articleContent}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.25, ease: [0.33, 1, 0.68, 1] }}
                >
                    {renderContent(blog.content)}
                </motion.div>
            </article>

            {/* Related Posts Section - Portavia Style */}
            {!isPreview && relatedBlogs.length > 0 && (
                <section className={styles.relatedSection}>
                    <div className={styles.relatedHeader}>
                        <h2 className={styles.relatedTitle}>MORE POSTS</h2>
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
                                aria-label="Previous blogs"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="15 18 9 12 15 6"/>
                                </svg>
                            </button>
                            <button
                                className={styles.carouselArrow}
                                onClick={() => scrollCarousel(1)}
                                aria-label="Next blogs"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="9 18 15 12 9 6"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div className={styles.carouselTrack} ref={carouselRef}>
                        {displayBlogs.map((relatedBlog, index) => (
                            <Link
                                key={`${relatedBlog.slug}-${index}`}
                                href={`/blogs/${relatedBlog.slug}`}
                                className={styles.relatedCard}
                                data-cursor-blog
                            >
                                <div className={styles.relatedImageWrapper}>
                                    <img
                                        src={relatedBlog.coverImage}
                                        alt={relatedBlog.title}
                                        className={styles.relatedImage}
                                    />
                                </div>
                                <div className={styles.relatedContent}>
                                    <div className={styles.relatedMeta}>
                                        <span className={styles.relatedCategory}>{relatedBlog.category}</span>
                                        <span className={styles.relatedDate}>{relatedBlog.date}</span>
                                    </div>
                                    <h3 className={styles.relatedCardTitle}>{relatedBlog.title}</h3>
                                    <p className={styles.relatedExcerpt}>{relatedBlog.excerpt}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {!isPreview && <Footer />}
            {!isPreview && <ThemeSwitch />}
        </main>
    );
}
