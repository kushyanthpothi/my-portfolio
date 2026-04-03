'use client';

import { useState, useEffect } from 'react';
import styles from '../admin.module.css';
import Loading from '@/components/Loading';
import { fetchProjects, fetchBlogs, getVisitorStats, deleteProject, deleteBlog } from '@/lib/firestoreUtils';
import { FiFolder, FiFileText, FiCpu, FiUsers, FiBarChart2, FiCalendar, FiClock, FiEdit2, FiTrash2, FiArrowRight } from 'react-icons/fi';

export default function Dashboard({ setActiveView }) {
    const [stats, setStats] = useState({
        totalProjects: 0,
        totalBlogs: 0,
        aiBlogs: 0,
        humanBlogs: 0,
        recentBlogs: [],
        recentProjects: []
    });
    const [visitorData, setVisitorData] = useState({ stats: [], totalVisits: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const [projects, blogs, visitors] = await Promise.all([
                fetchProjects(),
                fetchBlogs(),
                getVisitorStats(10)
            ]);

            const aiBlogs = blogs.filter(b => b.isAI || (b.tags && b.tags.includes('AI')));
            const humanBlogs = blogs.filter(b => !b.isAI && (!b.tags || !b.tags.includes('AI')));

            setStats({
                totalProjects: projects.length,
                totalBlogs: blogs.length,
                aiBlogs: aiBlogs.length,
                humanBlogs: humanBlogs.length,
                recentBlogs: blogs.slice(0, 10),
                recentProjects: projects.slice(0, 10)
            });

            setVisitorData(visitors);
        } catch (error) {
            console.error('Error loading stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteBlog = async (slug) => {
        if (confirm('Are you sure you want to delete this blog post?')) {
            const result = await deleteBlog(slug);
            if (result.success) loadStats();
        }
    };

    const handleDeleteProject = async (slug) => {
        if (confirm('Are you sure you want to delete this project?')) {
            const result = await deleteProject(slug);
            if (result.success) loadStats();
        }
    };

    // Calculate max for chart scaling
    const maxVisits = Math.max(...visitorData.stats.map(d => d.count), 1);

    if (loading) {
        return (
            <div className={styles.managerContainer}>
                <Loading text="Loading analytics..." />
            </div>
        );
    }

    // Modern "Glass" Card Style
    const glassCardStyle = {
        background: 'rgba(255, 255, 255, 0.03)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        borderRadius: '24px', // "Perfect rounded"
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        transition: 'transform 0.2s',
        cursor: 'default'
    };

    return (
        <div className={styles.managerContainer}>
            <div className={styles.managerHeader}>
                <h2 className={styles.sectionTitle}>Dashboard</h2>
            </div>

            {/* Stats Cards Row */}
            <div className={styles.statsGrid}>
                {/* Total Visitors */}
                <div style={glassCardStyle}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                        <div style={{
                            padding: '10px',
                            borderRadius: '14px',
                            background: 'rgba(59, 130, 246, 0.1)',
                            color: '#60A5FA'
                        }}>
                            <FiUsers size={24} />
                        </div>
                        <span style={{ color: '#60A5FA', fontSize: '0.75rem', fontWeight: '600' }}>+12%</span>
                    </div>
                    <div>
                        <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#fff', lineHeight: '1' }}>
                            {visitorData.totalVisits}
                        </div>
                        <div style={{ fontSize: '0.875rem', color: '#9CA3AF', marginTop: '0.5rem' }}>
                            Visitors (Last 10 Days)
                        </div>
                    </div>
                </div>

                {/* Total Projects */}
                <div style={glassCardStyle}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                        <div style={{
                            padding: '10px',
                            borderRadius: '14px',
                            background: 'rgba(99, 102, 241, 0.1)',
                            color: '#818CF8'
                        }}>
                            <FiFolder size={24} />
                        </div>
                    </div>
                    <div>
                        <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#fff', lineHeight: '1' }}>
                            {stats.totalProjects}
                        </div>
                        <div style={{ fontSize: '0.875rem', color: '#9CA3AF', marginTop: '0.5rem' }}>
                            Total Projects
                        </div>
                    </div>
                </div>

                {/* Total Blogs */}
                <div style={glassCardStyle}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                        <div style={{
                            padding: '10px',
                            borderRadius: '14px',
                            background: 'rgba(16, 185, 129, 0.1)',
                            color: '#34D399'
                        }}>
                            <FiFileText size={24} />
                        </div>
                    </div>
                    <div>
                        <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#fff', lineHeight: '1' }}>
                            {stats.totalBlogs}
                        </div>
                        <div style={{ fontSize: '0.875rem', color: '#9CA3AF', marginTop: '0.5rem' }}>
                            Total Blogs
                        </div>
                    </div>
                </div>

                {/* AI Generated */}
                <div style={glassCardStyle}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                        <div style={{
                            padding: '10px',
                            borderRadius: '14px',
                            background: 'rgba(255, 215, 0, 0.1)',
                            color: '#FCD34D'
                        }}>
                            <FiCpu size={24} />
                        </div>
                        <span style={{
                            background: 'rgba(255, 215, 0, 0.1)',
                            color: '#FCD34D',
                            padding: '2px 8px',
                            borderRadius: '12px',
                            fontSize: '0.75rem'
                        }}>
                            {Math.round((stats.aiBlogs / (stats.totalBlogs || 1)) * 100)}%
                        </span>
                    </div>
                    <div>
                        <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#fff', lineHeight: '1' }}>
                            {stats.aiBlogs}
                        </div>
                        <div style={{ fontSize: '0.875rem', color: '#9CA3AF', marginTop: '0.5rem' }}>
                            AI Generated Blogs
                        </div>
                    </div>
                </div>
            </div>

            {/* Visitor Chart Section - Transparent Container */}
            <div style={{ marginBottom: '3rem' }}>
                <h3 style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    marginBottom: '1.5rem',
                    color: '#fff',
                    fontSize: '1.25rem',
                    fontWeight: '600'
                }}>
                    <FiBarChart2 />
                    Traffic Overview
                </h3>

                <div style={{
                    ...glassCardStyle,
                    padding: '2rem',
                    height: '300px'
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'flex-end',
                        gap: '12px',
                        height: '100%',
                        width: '100%',
                    }}>
                        {visitorData.stats.map((day, index) => (
                            <div key={day.date} style={{
                                flex: 1,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '12px',
                                height: '100%'
                            }}>
                                <div style={{
                                    flex: 1,
                                    width: '100%',
                                    display: 'flex',
                                    alignItems: 'flex-end',
                                    justifyContent: 'center',
                                    position: 'relative'
                                }}>
                                    {/* Tooltip-like count on hover could act here, but static for now */}
                                    <div style={{
                                        position: 'absolute',
                                        top: `${100 - ((Math.max((day.count / maxVisits) * 100, 5)))}%`, // Position above bar
                                        marginTop: '-25px',
                                        background: 'rgba(0,0,0,0.5)',
                                        padding: '4px 8px',
                                        borderRadius: '6px',
                                        fontSize: '0.75rem',
                                        color: '#fff',
                                        opacity: day.count > 0 ? 1 : 0
                                    }}>
                                        {day.count}
                                    </div>

                                    <div style={{
                                        width: '100%',
                                        maxWidth: '40px',
                                        height: `${Math.max((day.count / maxVisits) * 100, 5)}%`,
                                        background: day.count > 0
                                            ? 'linear-gradient(180deg, #3B82F6 0%, rgba(59, 130, 246, 0.2) 100%)'
                                            : 'rgba(255, 255, 255, 0.05)',
                                        borderRadius: '8px 8px 0 0',
                                        transition: 'all 0.3s ease'
                                    }} />
                                </div>
                                <div style={{
                                    fontSize: '0.75rem',
                                    color: '#9CA3AF',
                                    fontWeight: '500'
                                }}>
                                    {day.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Recent Content Sections - Transparent Headers */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>

                {/* Recent Blogs */}
                <div>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '1.5rem'
                    }}>
                        <h3 style={{
                            fontSize: '1.25rem',
                            fontWeight: '600',
                            color: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem'
                        }}>
                            <FiCalendar /> Latest Blogs
                        </h3>
                        <button
                            onClick={() => setActiveView('blogs')}
                            style={{
                                background: 'rgba(255, 255, 255, 0.06)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '100px',
                                padding: '8px 20px',
                                color: '#fff',
                                fontSize: '0.85rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            View All <FiArrowRight size={14} />
                        </button>
                    </div>

                    {stats.recentBlogs.length === 0 ? (
                        <div style={{ color: '#666' }}>No blogs yet</div>
                    ) : (
                        <div style={{
                            display: 'flex',
                            gap: '1.5rem',
                            overflowX: 'auto',
                            paddingBottom: '1rem',
                            scrollBehavior: 'smooth',
                            scrollbarWidth: 'none'
                        }}>
                            <style jsx global>{`
                                div::-webkit-scrollbar { display: none; }
                                .blog-card {
                                    transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
                                }
                                .blog-card:hover {
                                    transform: translateY(-6px);
                                    border-color: rgba(255, 215, 0, 0.2) !important;
                                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 215, 0, 0.1);
                                }
                                .blog-card:hover .blog-card-image {
                                    transform: scale(1.05);
                                }
                                .blog-card-image {
                                    transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
                                }
                                .card-actions-overlay {
                                    opacity: 0;
                                    transition: opacity 0.3s ease;
                                }
                                .blog-card:hover .card-actions-overlay {
                                    opacity: 1 !important;
                                }
                            `}</style>
                            {stats.recentBlogs.map((blog) => (
                                <div key={blog.slug} className="blog-card" style={{
                                    flex: '0 0 340px',
                                    height: '380px',
                                    background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0.01) 100%)',
                                    border: '1px solid rgba(255, 255, 255, 0.06)',
                                    borderRadius: '24px',
                                    overflow: 'hidden',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    backdropFilter: 'blur(10px)',
                                    position: 'relative'
                                }}>
                                    {/* Image Section */}
                                    <div style={{
                                        width: '100%',
                                        height: '200px',
                                        overflow: 'hidden',
                                        position: 'relative'
                                    }}>
                                        <div
                                            className="blog-card-image"
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                background: `url(${blog.coverImage}) center/cover`,
                                                backgroundColor: '#1a1a2e'
                                            }}
                                        />
                                        {/* Bottom Fade */}
                                        <div style={{
                                            position: 'absolute',
                                            bottom: 0,
                                            left: 0,
                                            right: 0,
                                            height: '100px',
                                            background: 'radial-gradient(ellipse at center bottom, rgba(10, 10, 15, 0.8) 0%, transparent 70%)'
                                        }} />
                                        {/* Hover Edit/Delete Overlay */}
                                        <div className="card-actions-overlay" style={{
                                            position: 'absolute',
                                            inset: 0,
                                            background: 'rgba(0, 0, 0, 0.5)',
                                            backdropFilter: 'blur(4px)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '12px',
                                            zIndex: 10
                                        }}>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setActiveView('blogs'); }}
                                                style={{
                                                    background: 'rgba(255, 255, 255, 0.15)',
                                                    border: '1px solid rgba(255, 255, 255, 0.25)',
                                                    borderRadius: '50%',
                                                    width: '44px',
                                                    height: '44px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: '#fff',
                                                    cursor: 'pointer',
                                                    backdropFilter: 'blur(8px)',
                                                    transition: 'all 0.2s ease'
                                                }}
                                                title="Edit"
                                            >
                                                <FiEdit2 size={18} />
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleDeleteBlog(blog.slug); }}
                                                style={{
                                                    background: 'rgba(255, 68, 68, 0.2)',
                                                    border: '1px solid rgba(255, 68, 68, 0.3)',
                                                    borderRadius: '50%',
                                                    width: '44px',
                                                    height: '44px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: '#ff4444',
                                                    cursor: 'pointer',
                                                    backdropFilter: 'blur(8px)',
                                                    transition: 'all 0.2s ease'
                                                }}
                                                title="Delete"
                                            >
                                                <FiTrash2 size={18} />
                                            </button>
                                        </div>
                                        {/* AI Badge */}
                                        {blog.isAI && (
                                            <div style={{
                                                position: 'absolute',
                                                top: '12px',
                                                right: '12px',
                                                background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.15), rgba(255, 215, 0, 0.05))',
                                                backdropFilter: 'blur(8px)',
                                                color: '#FFD700',
                                                padding: '6px 14px',
                                                borderRadius: '100px',
                                                fontSize: '0.7rem',
                                                fontWeight: '700',
                                                border: '1px solid rgba(255, 215, 0, 0.25)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '5px',
                                                letterSpacing: '0.05em',
                                                textTransform: 'uppercase',
                                                zIndex: 11
                                            }}>
                                                <FiCpu size={13} /> AI
                                            </div>
                                        )}
                                        {/* Category Badge */}
                                        {blog.category && (
                                            <div style={{
                                                position: 'absolute',
                                                bottom: '12px',
                                                left: '12px',
                                                background: 'rgba(255, 255, 255, 0.1)',
                                                backdropFilter: 'blur(8px)',
                                                color: '#fff',
                                                padding: '5px 12px',
                                                borderRadius: '100px',
                                                fontSize: '0.7rem',
                                                fontWeight: '600',
                                                letterSpacing: '0.03em',
                                                textTransform: 'uppercase',
                                                zIndex: 11
                                            }}>
                                                {blog.category}
                                            </div>
                                        )}
                                    </div>
                                    {/* Content Section */}
                                    <div style={{
                                        padding: '1.25rem 1.25rem 1rem',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '0.6rem',
                                        flex: 1
                                    }}>
                                        <h4 style={{
                                            color: '#fff',
                                            fontSize: '1rem',
                                            fontWeight: '600',
                                            lineHeight: '1.4',
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden',
                                            margin: 0
                                        }}>
                                            {blog.title}
                                        </h4>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            color: '#6B7280',
                                            fontSize: '0.8rem',
                                            marginTop: 'auto'
                                        }}>
                                            <FiCalendar size={13} />
                                            <span>{blog.date}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Recent Projects */}
                <div>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '1.5rem'
                    }}>
                        <h3 style={{
                            fontSize: '1.25rem',
                            fontWeight: '600',
                            color: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem'
                        }}>
                            <FiClock /> Latest Projects
                        </h3>
                        <button
                            onClick={() => setActiveView('projects')}
                            style={{
                                background: 'rgba(255, 255, 255, 0.06)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '100px',
                                padding: '8px 20px',
                                color: '#fff',
                                fontSize: '0.85rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            View All <FiArrowRight size={14} />
                        </button>
                    </div>

                    {stats.recentProjects.length === 0 ? (
                        <div style={{ color: '#666' }}>No projects yet</div>
                    ) : (
                        <div style={{
                            display: 'flex',
                            gap: '1.5rem',
                            overflowX: 'auto',
                            paddingBottom: '1rem',
                            scrollBehavior: 'smooth',
                            scrollbarWidth: 'none'
                        }}>
                            <style jsx global>{`
                                .project-card {
                                    transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
                                }
                                .project-card:hover {
                                    transform: translateY(-6px);
                                    border-color: rgba(255, 215, 0, 0.2) !important;
                                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 215, 0, 0.1);
                                }
                                .project-card:hover .project-card-image {
                                    transform: scale(1.05);
                                }
                                .project-card-image {
                                    transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
                                }
                                .project-actions-overlay {
                                    opacity: 0;
                                    transition: opacity 0.3s ease;
                                }
                                .project-card:hover .project-actions-overlay {
                                    opacity: 1 !important;
                                }
                            `}</style>
                            {stats.recentProjects.map((project) => (
                                <div key={project.slug} className="project-card" style={{
                                    flex: '0 0 340px',
                                    height: '380px',
                                    background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0.01) 100%)',
                                    border: '1px solid rgba(255, 255, 255, 0.06)',
                                    borderRadius: '24px',
                                    overflow: 'hidden',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    backdropFilter: 'blur(10px)',
                                    position: 'relative'
                                }}>
                                    {/* Image Section */}
                                    <div style={{
                                        width: '100%',
                                        height: '200px',
                                        overflow: 'hidden',
                                        position: 'relative'
                                    }}>
                                        <div
                                            className="project-card-image"
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                background: `url(${project.heroImage}) center/cover`,
                                                backgroundColor: '#1a1a2e'
                                            }}
                                        />
                                        {/* Hover Edit/Delete Overlay */}
                                        <div className="project-actions-overlay" style={{
                                            position: 'absolute',
                                            inset: 0,
                                            background: 'rgba(0, 0, 0, 0.5)',
                                            backdropFilter: 'blur(4px)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '12px',
                                            zIndex: 10
                                        }}>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setActiveView('projects'); }}
                                                style={{
                                                    background: 'rgba(255, 255, 255, 0.15)',
                                                    border: '1px solid rgba(255, 255, 255, 0.25)',
                                                    borderRadius: '50%',
                                                    width: '44px',
                                                    height: '44px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: '#fff',
                                                    cursor: 'pointer',
                                                    backdropFilter: 'blur(8px)',
                                                    transition: 'all 0.2s ease'
                                                }}
                                                title="Edit"
                                            >
                                                <FiEdit2 size={18} />
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleDeleteProject(project.slug); }}
                                                style={{
                                                    background: 'rgba(255, 68, 68, 0.2)',
                                                    border: '1px solid rgba(255, 68, 68, 0.3)',
                                                    borderRadius: '50%',
                                                    width: '44px',
                                                    height: '44px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: '#ff4444',
                                                    cursor: 'pointer',
                                                    backdropFilter: 'blur(8px)',
                                                    transition: 'all 0.2s ease'
                                                }}
                                                title="Delete"
                                            >
                                                <FiTrash2 size={18} />
                                            </button>
                                        </div>
                                        {/* Category Badge */}
                                        {project.category && (
                                            <div style={{
                                                position: 'absolute',
                                                bottom: '12px',
                                                left: '12px',
                                                background: 'rgba(255, 255, 255, 0.1)',
                                                backdropFilter: 'blur(8px)',
                                                color: '#fff',
                                                padding: '5px 12px',
                                                borderRadius: '100px',
                                                fontSize: '0.7rem',
                                                fontWeight: '600',
                                                letterSpacing: '0.03em',
                                                textTransform: 'uppercase',
                                                zIndex: 11
                                            }}>
                                                {project.category}
                                            </div>
                                        )}
                                    </div>
                                    {/* Content Section */}
                                    <div style={{
                                        padding: '1.25rem 1.25rem 1rem',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '0.6rem',
                                        flex: 1
                                    }}>
                                        <h4 style={{
                                            color: '#fff',
                                            fontSize: '1rem',
                                            fontWeight: '600',
                                            lineHeight: '1.4',
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden',
                                            margin: 0
                                        }}>
                                            {project.title}
                                        </h4>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            color: '#6B7280',
                                            fontSize: '0.8rem',
                                            marginTop: 'auto'
                                        }}>
                                            <FiCalendar size={13} />
                                            <span>{project.year}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
