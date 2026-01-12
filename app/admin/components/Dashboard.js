'use client';

import { useState, useEffect } from 'react';
import styles from '../admin.module.css';
import Loading from '@/components/Loading';
import { fetchProjects, fetchBlogs, getVisitorStats } from '@/lib/firestoreUtils';
import { FiFolder, FiFileText, FiCpu, FiUsers, FiBarChart2, FiArrowUpRight, FiCalendar, FiClock } from 'react-icons/fi';

export default function Dashboard() {
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
                            scrollbarWidth: 'none' // Firefox
                        }}>
                            <style jsx>{`
                                div::-webkit-scrollbar { display: none; }
                            `}</style>
                            {stats.recentBlogs.map((blog) => (
                                <div key={blog.slug} style={{
                                    flex: '0 0 320px', // Extra Width
                                    background: 'rgba(255, 255, 255, 0.03)',
                                    border: '1px solid rgba(255, 255, 255, 0.05)',
                                    borderRadius: '20px',
                                    padding: '1rem',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '1rem',
                                    backdropFilter: 'blur(5px)'
                                }}>
                                    <div style={{
                                        width: '100%',
                                        aspectRatio: '16/10', // Modern ratio
                                        borderRadius: '16px',
                                        background: `url(${blog.coverImage}) center/cover`,
                                        position: 'relative',
                                        overflow: 'hidden'
                                    }}>
                                        {blog.isAI && (
                                            <div style={{
                                                position: 'absolute',
                                                top: '12px',
                                                right: '12px',
                                                background: 'rgba(0, 0, 0, 0.6)',
                                                backdropFilter: 'blur(4px)',
                                                color: '#FFD700',
                                                padding: '4px 12px',
                                                borderRadius: '100px',
                                                fontSize: '0.75rem',
                                                fontWeight: '600',
                                                border: '1px solid rgba(255, 215, 0, 0.3)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '4px'
                                            }}>
                                                <FiCpu size={12} /> AI
                                            </div>
                                        )}
                                    </div>
                                    <div style={{ padding: '0 0.5rem' }}>
                                        <h4 style={{
                                            color: '#fff',
                                            fontSize: '1.1rem',
                                            fontWeight: '600',
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            marginBottom: '0.5rem'
                                        }}>
                                            {blog.title}
                                        </h4>
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            color: '#9CA3AF',
                                            fontSize: '0.85rem'
                                        }}>
                                            <span>{blog.category}</span>
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
                    </div>

                    {stats.recentProjects.length === 0 ? (
                        <div style={{ color: '#666' }}>No projects yet</div>
                    ) : (
                        <div style={{
                            display: 'flex',
                            gap: '1.5rem',
                            overflowX: 'auto',
                            paddingBottom: '1rem',
                            scrollBehavior: 'smooth'
                        }}>
                            {stats.recentProjects.map((project) => (
                                <div key={project.slug} style={{
                                    flex: '0 0 320px', // Extra Width
                                    background: 'rgba(255, 255, 255, 0.03)',
                                    border: '1px solid rgba(255, 255, 255, 0.05)',
                                    borderRadius: '20px',
                                    padding: '1rem',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '1rem',
                                    backdropFilter: 'blur(5px)'
                                }}>
                                    <div style={{
                                        width: '100%',
                                        aspectRatio: '16/10',
                                        borderRadius: '16px',
                                        background: `url(${project.heroImage}) center/cover`
                                    }} />
                                    <div style={{ padding: '0 0.5rem' }}>
                                        <h4 style={{
                                            color: '#fff',
                                            fontSize: '1.1rem',
                                            fontWeight: '600',
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            marginBottom: '0.5rem'
                                        }}>
                                            {project.title}
                                        </h4>
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            color: '#9CA3AF',
                                            fontSize: '0.85rem'
                                        }}>
                                            <span>{project.category}</span>
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
