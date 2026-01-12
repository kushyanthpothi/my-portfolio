'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import ThemeSwitch from '../../components/ThemeSwitch';
import Loading from '../../components/Loading';
import styles from './blogs.module.css';
import { motion } from 'framer-motion';
import { fetchBlogs } from '@/lib/firestoreUtils';

// Smart Image Component - chooses cover/contain based on aspect ratio
const SmartImage = ({ src, alt, className, wrapperClassName }) => {
    const imgRef = useRef(null);
    const [objectFit, setObjectFit] = useState('cover');

    useEffect(() => {
        const img = imgRef.current;
        if (!img) return;

        const handleLoad = () => {
            const imgRatio = img.naturalWidth / img.naturalHeight;

            if (imgRatio < 0.9) {
                setObjectFit('contain');
            } else {
                setObjectFit('cover');
            }
        };

        if (img.complete) {
            handleLoad();
        } else {
            img.addEventListener('load', handleLoad);
            return () => img.removeEventListener('load', handleLoad);
        }
    }, [src]);

    return (
        <img
            ref={imgRef}
            src={src}
            alt={alt}
            className={className}
            style={{
                objectFit: objectFit,
                backgroundColor: objectFit === 'contain' ? 'var(--bg-secondary)' : 'transparent'
            }}
        />
    );
};

// Blog Card Component
const BlogCard = ({ blog, index }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
        >
            <Link href={`/blogs/${blog.slug}`} className={styles.blogCard} data-cursor-blog>
                <div className={styles.blogImageWrapper}>
                    <SmartImage
                        src={blog.coverImage}
                        alt={blog.title}
                        className={styles.blogImage}
                    />
                </div>
                <div className={styles.blogContent}>
                    <div className={styles.blogMeta}>
                        <span className={styles.categoryBadge}>{blog.category}</span>
                        <span className={styles.blogDate}>{blog.date}</span>
                    </div>
                    <h3 className={styles.blogTitle}>{blog.title}</h3>
                    <p className={styles.blogExcerpt}>{blog.excerpt}</p>
                </div>
            </Link>
        </motion.div>
    );
};

// Featured Blog Card Component
const FeaturedBlogCard = ({ blog }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
        >
            <Link href={`/blogs/${blog.slug}`} className={styles.featuredCard} data-cursor-blog>
                <div className={styles.featuredImageWrapper}>
                    <span className={styles.mostViewedBadge}>Most Viewed</span>
                    <SmartImage
                        src={blog.coverImage}
                        alt={blog.title}
                        className={styles.featuredImage}
                    />
                </div>
                <div className={styles.featuredContent}>
                    <div className={styles.featuredMeta}>
                        <span className={styles.categoryBadge}>{blog.category}</span>
                        <span className={styles.blogDate}>{blog.date}</span>
                    </div>
                    <h2 className={styles.featuredTitle}>{blog.title}</h2>
                    <p className={styles.featuredExcerpt}>{blog.excerpt}</p>
                </div>
            </Link>
        </motion.div>
    );
};

export default function BlogsClient() {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadBlogs = async () => {
            try {
                const fetchedBlogs = await fetchBlogs();
                if (fetchedBlogs) {
                    setBlogs(fetchedBlogs);
                }
            } catch (error) {
                console.error("Failed to load blogs:", error);
            } finally {
                setLoading(false);
            }
        };
        loadBlogs();
    }, []);

    // Featured blog (first one or most viewed)
    const featuredBlog = blogs.length > 0 ? blogs[0] : null;
    // Rest of the blogs
    const otherBlogs = blogs.slice(1);

    return (
        <main className={styles.pageContainer}>
            <Navbar />

            {/* Hero Section */}
            <section className={styles.heroSection}>
                <motion.h1
                    className={styles.mainTitle}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    BLOGS
                </motion.h1>
                <motion.p
                    className={styles.heroDescription}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    Insights, tutorials, and thoughts on software development,
                    technology trends, and the creative process.
                </motion.p>
            </section>

            {loading ? (
                <Loading text="Loading articles..." />
            ) : blogs.length === 0 ? (
                <div className={styles.emptyState}>
                    <h2 className={styles.emptyTitle}>No blogs yet</h2>
                    <p className={styles.emptyText}>Check back soon for new content!</p>
                </div>
            ) : (
                <>
                    {/* Featured Blog Section */}
                    {featuredBlog && (
                        <section className={styles.featuredSection}>
                            <FeaturedBlogCard blog={featuredBlog} />
                        </section>
                    )}

                    {/* Blog Grid Section */}
                    {otherBlogs.length > 0 && (
                        <section className={styles.gridSection}>
                            <div className={styles.blogsGrid}>
                                {otherBlogs.map((blog, index) => (
                                    <BlogCard
                                        key={blog.slug}
                                        blog={blog}
                                        index={index}
                                    />
                                ))}
                            </div>
                        </section>
                    )}
                </>
            )}

            <Footer />
            <ThemeSwitch />
        </main>
    );
}
