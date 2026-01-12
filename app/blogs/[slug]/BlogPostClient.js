'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import ThemeSwitch from '../../../components/ThemeSwitch';
import styles from './blogPost.module.css';
import { motion } from 'framer-motion';

export default function BlogPostClient() {
    const params = useParams();
    const [blog, setBlog] = useState(null);
    const [relatedBlogs, setRelatedBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadBlog = async () => {
            try {
                const { fetchBlogBySlug, fetchBlogs } = await import('@/lib/firestoreUtils');
                const fetchedBlog = await fetchBlogBySlug(params.slug);
                setBlog(fetchedBlog);

                // Update document title to blog title
                if (fetchedBlog?.title) {
                    document.title = fetchedBlog.title;
                }

                // Fetch related blogs (other blogs in the same category or just other blogs)
                const allBlogs = await fetchBlogs();
                const related = allBlogs.filter(b => b.slug !== params.slug).slice(0, 3);
                setRelatedBlogs(related);
            } catch (error) {
                console.error("Failed to load blog:", error);
            } finally {
                setLoading(false);
            }
        };

        if (params.slug) {
            loadBlog();
        }
    }, [params.slug]);

    if (loading) {
        return (
            <main className={styles.pageContainer}>
                <Navbar />
                <div className={styles.loadingContainer}>
                    <div className={styles.loadingSpinner}></div>
                    <span className={styles.loadingText}>Loading article...</span>
                </div>
            </main>
        );
    }

    if (!blog) {
        return (
            <main className={styles.pageContainer}>
                <Navbar />
                <div className={styles.errorContainer}>
                    <h1 className={styles.errorTitle}>ARTICLE NOT FOUND</h1>
                    <p className={styles.errorText}>The article you're looking for doesn't exist.</p>
                    <Link href="/blogs" className={styles.backButton}>
                        Back to Blogs
                    </Link>
                </div>
                <Footer />
                <ThemeSwitch />
            </main>
        );
    }

    // Helper to parse inline markdown (bold, italic, links, code)
    const parseInlineMarkdown = (text) => {
        if (!text) return text;

        // Split text by markdown patterns and convert to React elements
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

            // Find the earliest match
            const matches = [
                { type: 'bold', match: boldMatch, index: boldMatch?.index ?? Infinity },
                { type: 'italic', match: italicMatch, index: italicMatch?.index ?? Infinity },
                { type: 'code', match: codeMatch, index: codeMatch?.index ?? Infinity },
                { type: 'link', match: linkMatch, index: linkMatch?.index ?? Infinity },
            ].filter(m => m.match).sort((a, b) => a.index - b.index);

            if (matches.length === 0) {
                parts.push(remaining);
                break;
            }

            const earliest = matches[0];

            // Add text before the match
            if (earliest.index > 0) {
                parts.push(remaining.substring(0, earliest.index));
            }

            // Add the formatted element
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
                case 'link':
                    parts.push(
                        <a key={key++} href={earliest.match[2]} target="_blank" rel="noopener noreferrer" className={styles.contentLink}>
                            {earliest.match[1]}
                        </a>
                    );
                    remaining = remaining.substring(earliest.index + earliest.match[0].length);
                    break;
            }
        }

        return parts.length === 1 && typeof parts[0] === 'string' ? parts[0] : parts;
    };

    // Parse content into sections
    const renderContent = (content) => {
        // Safety check: ensure content is a string
        if (!content || typeof content !== 'string') {
            console.error('Invalid content type:', typeof content);
            return <p className={styles.contentParagraph}>Content unavailable</p>;
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

    return (
        <main className={styles.pageContainer}>
            <Navbar />

            <article className={styles.article}>
                {/* Article Header - Portavia Style */}
                <motion.header
                    className={styles.articleHeader}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: [0.33, 1, 0.68, 1] }}
                >
                    <div className={styles.metaRow}>
                        <span className={styles.categoryBadge}>{blog.category}</span>
                        <span className={styles.articleDate}>{blog.date}</span>
                    </div>

                    <h1 className={styles.articleTitle}>{blog.title}</h1>

                    <p className={styles.articleExcerpt}>{blog.excerpt}</p>
                </motion.header>

                {/* Featured Image - Full Width with Rounded Corners */}
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
                </motion.div>

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
            {relatedBlogs.length > 0 && (
                <section className={styles.relatedSection}>
                    <div className={styles.relatedHeader}>
                        <h2 className={styles.relatedTitle}>MORE POSTS</h2>
                    </div>
                    <div className={styles.relatedGrid}>
                        {relatedBlogs.map((relatedBlog, index) => (
                            <motion.div
                                key={relatedBlog.slug}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.1 * index }}
                            >
                                <Link href={`/blogs/${relatedBlog.slug}`} className={styles.relatedCard} data-cursor-blog>
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
                            </motion.div>
                        ))}
                    </div>
                </section>
            )}

            <Footer />
            <ThemeSwitch />
        </main>
    );
}
