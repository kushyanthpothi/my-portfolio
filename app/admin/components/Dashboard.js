'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../admin.module.css';
import Loading from '@/components/Loading';
import { fetchProjects, fetchBlogs, getVisitorStats, deleteProject, deleteBlog } from '@/lib/firestoreUtils';
import { FiSearch, FiMenu, FiTrendingUp } from 'react-icons/fi';

export default function Dashboard() {
    const router = useRouter();
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

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <Loading text="Loading dashboard..." />
            </div>
        );
    }

    const neumorphicCard = {
        background: '#161b22', /* Darker card background for contrast */
        borderRadius: '24px',
        padding: '1.5rem',
        boxShadow: '0 10px 30px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)', /* Smoother less-laggy shadow */
        display: 'flex',
        flexDirection: 'column',
    };

    // Calculate max for bar chart
    const maxVisits = Math.max(...visitorData.stats.map(d => d.count), 1);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Dashboard Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#828b9c', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                        <FiMenu size={16} /> <span>Dashboard</span>
                    </div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '700', color: '#fff', margin: 0 }}>
                        Hello there, Admin
                    </h1>
                </div>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    background: '#161b22',
                    borderRadius: '12px',
                    padding: '0.8rem 1rem',
                    width: '300px',
                    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.02)'
                }}>
                    <FiSearch color="#828b9c" size={18} style={{ marginRight: '10px' }} />
                    <input 
                        type="text" 
                        placeholder="Search here" 
                        style={{ border: 'none', background: 'transparent', color: '#fff', outline: 'none', width: '100%', fontSize: '0.9rem' }}
                    />
                </div>
            </div>

            {/* Top Stat Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                {/* Card 1 */}
                <div style={neumorphicCard}>
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                        <span style={{ fontSize: '0.65rem', padding: '0.3rem 0.6rem', borderRadius: '6px', background: '#e5e7eb', color: '#374151', fontWeight: 'bold' }}>All</span>
                        <span style={{ fontSize: '0.65rem', padding: '0.3rem 0.6rem', borderRadius: '6px', background: '#ffe4e6', color: '#be123c', fontWeight: 'bold' }}>Active</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '0.5rem' }}>
                        <h3 style={{ margin: 0, color: '#fff', fontSize: '1.2rem' }}>Total Projects</h3>
                        <span style={{ color: '#ef4444', fontWeight: 'bold', fontSize: '1.2rem' }}>{stats.totalProjects}</span>
                    </div>
                    <p style={{ color: '#828b9c', fontSize: '0.8rem', lineHeight: '1.4', marginBottom: '1.5rem' }}>
                        Overview of all your deployed and draft projects currently sitting in the portfolio database.
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                        <div style={{ display: 'flex' }}>
                            {[1,2,3].map((i) => (
                                <div key={i} style={{
                                    width: '30px', height: '30px', borderRadius: '50%', background: '#fff', 
                                    marginLeft: i === 1 ? '0' : '-10px', border: '2px solid #161b22',
                                    backgroundImage: `url(https://api.dicebear.com/7.x/avataaars/svg?seed=proj${i})`, backgroundSize: 'cover'
                                }} />
                            ))}
                            <div style={{
                                width: '30px', height: '30px', borderRadius: '50%', background: '#3b82f6', 
                                marginLeft: '-10px', border: '2px solid #161b22', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.7rem', fontWeight: 'bold'
                            }}>+</div>
                        </div>
                        <div style={{ width: '35px', height: '35px', borderRadius: '50%', background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d97706', cursor: 'pointer' }} onClick={() => router.push('/admin/projects')}>
                            <FiTrendingUp size={16} />
                        </div>
                    </div>
                </div>

                {/* Card 2 */}
                <div style={neumorphicCard}>
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                        <span style={{ fontSize: '0.65rem', padding: '0.3rem 0.6rem', borderRadius: '6px', background: '#dcfce7', color: '#166534', fontWeight: 'bold' }}>AI</span>
                        <span style={{ fontSize: '0.65rem', padding: '0.3rem 0.6rem', borderRadius: '6px', background: '#e0e7ff', color: '#3730a3', fontWeight: 'bold' }}>Human</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '0.5rem' }}>
                        <h3 style={{ margin: 0, color: '#fff', fontSize: '1.2rem' }}>Total Blogs</h3>
                        <span style={{ color: '#ef4444', fontWeight: 'bold', fontSize: '1.2rem' }}>{stats.totalBlogs}</span>
                    </div>
                    <p style={{ color: '#828b9c', fontSize: '0.8rem', lineHeight: '1.4', marginBottom: '1.5rem' }}>
                        Automated AI blogs and manually written articles contributing to your overall platform SEO. 
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                        <div style={{ display: 'flex' }}>
                            {[4,5,6].map((i) => (
                                <div key={i} style={{
                                    width: '30px', height: '30px', borderRadius: '50%', background: '#fff', 
                                    marginLeft: i === 4 ? '0' : '-10px', border: '2px solid #161b22',
                                    backgroundImage: `url(https://api.dicebear.com/7.x/avataaars/svg?seed=blog${i})`, backgroundSize: 'cover'
                                }} />
                            ))}
                            <div style={{
                                width: '30px', height: '30px', borderRadius: '50%', background: '#8b5cf6', 
                                marginLeft: '-10px', border: '2px solid #161b22', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.7rem', fontWeight: 'bold'
                            }}>+</div>
                        </div>
                        <div style={{ width: '35px', height: '35px', borderRadius: '50%', background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#dc2626', cursor: 'pointer' }} onClick={() => router.push('/admin/blogs')}>
                            <FiTrendingUp size={16} />
                        </div>
                    </div>
                </div>

                {/* Card 3 */}
                <div style={neumorphicCard}>
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                        <span style={{ fontSize: '0.65rem', padding: '0.3rem 0.6rem', borderRadius: '6px', background: '#fef3c7', color: '#92400e', fontWeight: 'bold' }}>Organic</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '0.5rem' }}>
                        <h3 style={{ margin: 0, color: '#fff', fontSize: '1.2rem' }}>Total Visitors</h3>
                        <span style={{ color: '#ef4444', fontWeight: 'bold', fontSize: '1.2rem' }}>{visitorData.totalVisits}</span>
                    </div>
                    <p style={{ color: '#828b9c', fontSize: '0.8rem', lineHeight: '1.4', marginBottom: '1.5rem' }}>
                        Analytics summarizing organic user hits across your portfolio over the last 10 days period.
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                        <div style={{ display: 'flex' }}>
                            {[7,8,9].map((i) => (
                                <div key={i} style={{
                                    width: '30px', height: '30px', borderRadius: '50%', background: '#fff', 
                                    marginLeft: i === 7 ? '0' : '-10px', border: '2px solid #161b22',
                                    backgroundImage: `url(https://api.dicebear.com/7.x/avataaars/svg?seed=user${i})`, backgroundSize: 'cover'
                                }} />
                            ))}
                            <div style={{
                                width: '30px', height: '30px', borderRadius: '50%', background: '#10b981', 
                                marginLeft: '-10px', border: '2px solid #161b22', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.7rem', fontWeight: 'bold'
                            }}>+</div>
                        </div>
                        <div style={{ width: '35px', height: '35px', borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16a34a', cursor: 'pointer' }}>
                            <FiTrendingUp size={16} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Middle Row Charts */}
            <div style={{ display: 'flex', gap: '1.5rem', height: '300px' }}>
                {/* Bar Chart (Traffic) */}
                <div style={{ ...neumorphicCard, flex: 2 }}>
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', fontSize: '0.75rem', fontWeight: 'bold' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#828b9c' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3b82f6' }}></div> Visitors</span>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flex: 1, paddingBottom: '1rem' }}>
                        {visitorData.stats.map((day, idx) => {
                            const barHeight = Math.max((day.count / maxVisits) * 100, 5);
                            return (
                                <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', height: '100%', width: '100%' }}>
                                    <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', width: '100%', justifyContent: 'center' }}>
                                        {/* Segmented bar look */}
                                        <div style={{
                                            width: '12px',
                                            height: `${barHeight}%`,
                                            background: 'linear-gradient(180deg, #10b981 0%, #3b82f6 50%, #6366f1 100%)',
                                            borderRadius: '6px',
                                            boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)'
                                        }}></div>
                                    </div>
                                    <span style={{ fontSize: '0.65rem', color: '#555e70' }}>{day.label}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Pie Charts */}
                <div style={{ ...neumorphicCard, flex: 1 }}>
                    <h3 style={{ margin: '0 0 1.5rem 0', color: '#fff', fontSize: '1.1rem' }}>Very Important Stats</h3>
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', fontSize: '0.75rem', fontWeight: 'bold', flexWrap: 'wrap' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#828b9c' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }}></div> AI Blogs</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#828b9c' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#8b5cf6' }}></div> Human</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#828b9c' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }}></div> Projects</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', flex: 1 }}>
                        {/* Circular Progress 1 */}
                        <div style={{ position: 'relative', width: '80px', height: '80px', borderRadius: '50%', background: 'conic-gradient(#10b981 67%, rgba(255,255,255,0.05) 0)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div style={{ position: 'absolute', width: '65px', height: '65px', borderRadius: '50%', background: '#161b22', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981', fontWeight: 'bold', fontSize: '0.9rem' }}>
                                {Math.round((stats.aiBlogs / (stats.totalBlogs || 1)) * 100)}%
                            </div>
                        </div>

                        {/* Circular Progress 2 */}
                        <div style={{ position: 'relative', width: '80px', height: '80px', borderRadius: '50%', background: 'conic-gradient(#8b5cf6 46%, rgba(255,255,255,0.05) 0)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div style={{ position: 'absolute', width: '65px', height: '65px', borderRadius: '50%', background: '#1a2035', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8b5cf6', fontWeight: 'bold', fontSize: '0.9rem' }}>
                                {Math.round((stats.humanBlogs / (stats.totalBlogs || 1)) * 100)}%
                            </div>
                        </div>

                        {/* Circular Progress 3 */}
                        <div style={{ position: 'relative', width: '80px', height: '80px', borderRadius: '50%', background: 'conic-gradient(#ef4444 85%, rgba(255,255,255,0.05) 0)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div style={{ position: 'absolute', width: '65px', height: '65px', borderRadius: '50%', background: '#1a2035', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444', fontWeight: 'bold', fontSize: '0.9rem' }}>
                                {stats.totalProjects > 0 ? '100%' : '0%'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom List Row */}
            <div style={{ ...neumorphicCard, flex: 1, padding: '0.5rem 1.5rem' }}>
                {stats.recentProjects.slice(0, 3).map((project, idx) => (
                    <div key={project.slug} style={{ 
                        display: 'flex', alignItems: 'center', padding: '1rem 0', 
                        borderBottom: idx !== 2 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                        gap: '2rem'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1.5 }}>
                            <img src={project.heroImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${project.slug}`} alt="Project" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', background: '#333' }} />
                            <div>
                                <h4 style={{ margin: 0, color: '#fff', fontSize: '0.9rem' }}>{project.title}</h4>
                                <span style={{ color: '#828b9c', fontSize: '0.75rem' }}>Project • {project.year}</span>
                            </div>
                        </div>

                        <div style={{ flex: 1 }}>
                            <h4 style={{ margin: 0, color: '#fff', fontSize: '0.9rem' }}>{project.category || 'General'}</h4>
                            <span style={{ color: '#828b9c', fontSize: '0.75rem' }}>Category</span>
                        </div>

                        <div style={{ flex: 1 }}>
                            <h4 style={{ margin: 0, color: '#fff', fontSize: '0.9rem' }}>Active</h4>
                            <span style={{ color: '#828b9c', fontSize: '0.75rem' }}>Status</span>
                        </div>

                        <div style={{ flex: 1 }}>
                            <h4 style={{ margin: 0, color: '#10b981', fontSize: '0.9rem' }}>✓</h4>
                            <span style={{ color: '#828b9c', fontSize: '0.75rem' }}>Deployed</span>
                        </div>

                        <div style={{ flex: 0.5, textAlign: 'right' }}>
                            <button onClick={() => router.push('/admin/projects')} style={{ background: 'transparent', border: 'none', color: '#828b9c', cursor: 'pointer', fontSize: '1.2rem' }}>
                                ›
                            </button>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
}
