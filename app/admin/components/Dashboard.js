'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../admin.module.css';
import Loading from '@/components/Loading';
import { fetchProjects, fetchBlogs, getVisitorStats, deleteProject, deleteBlog } from '@/lib/firestoreUtils';
import { FiMenu, FiTrendingUp, FiArrowUp, FiArrowDown, FiExternalLink, FiEdit2, FiTrash2, FiZap, FiSun, FiMoon } from 'react-icons/fi';

// ─── Global site theme helpers (mirrors ThemeSwitch.js logic) ───────────────
const SITE_THEME_KEY = 'theme'; // Same key used by ThemeSwitch.js and layout.js

function getGlobalTheme() {
    if (typeof localStorage === 'undefined') return 'dark';
    return localStorage.getItem(SITE_THEME_KEY) || 'dark';
}

/**
 * Applies theme globally to the entire site by setting data-theme on <html>.
 * Uses the View Transitions API when available — same as ThemeSwitch.js.
 */
function applyGlobalTheme(newTheme, triggerRect = null) {
    const html = document.documentElement;

    const commit = () => {
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem(SITE_THEME_KEY, newTheme);
    };

    if (!document.startViewTransition || !triggerRect) {
        commit();
        return;
    }

    // Set CSS transition properties for the reveal/contract animation
    const s = html.style;
    s.setProperty('--transition-top', `${triggerRect.top}px`);
    s.setProperty('--transition-left', `${triggerRect.left}px`);
    s.setProperty('--transition-width', `${triggerRect.width}px`);
    s.setProperty('--transition-height', `${triggerRect.height}px`);
    s.setProperty('--viewport-width', `${window.innerWidth}px`);
    s.setProperty('--viewport-height', `${window.innerHeight}px`);

    html.setAttribute('data-theme-direction', `to-${newTheme}`);
    html.setAttribute('data-theme-transitioning', 'true');

    const transition = document.startViewTransition(commit);
    transition.finished.finally(() => {
        html.removeAttribute('data-theme-transitioning');
        html.removeAttribute('data-theme-direction');
    });
}

// ─── AI Smart Search Bar ────────────────────────────────────────────────────
function AISearchBar({ onAction, stats }) {
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState(null);
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef(null);
    const responseTimer = useRef(null);

    const suggestions = [
        'add new article in blogs',
        'go to projects',
        'turn off dark mode',
        'show my stats',
    ];

    const executeSearch = useCallback(async (q) => {
        const trimmed = q.trim();
        if (!trimmed) return;

        // Clear any pending response timer
        if (responseTimer.current) clearTimeout(responseTimer.current);

        setLoading(true);
        setResponse(null);
        setIsFocused(false);

        try {
            const res = await fetch('/api/admin/ai-search', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: trimmed, context: stats }),
            });
            const data = await res.json();
            const action = data.result;

            // Show response message immediately
            setResponse(action.message);

            // Execute the action immediately (no delay for theme toggle / navigation)
            onAction(action);

            // Auto-clear message after 4 seconds
            responseTimer.current = setTimeout(() => setResponse(null), 4000);

        } catch {
            setResponse('Could not reach AI. Please try again.');
        } finally {
            setLoading(false);
            setQuery('');
        }
    }, [stats, onAction]);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') executeSearch(query);
        if (e.key === 'Escape') { setIsFocused(false); inputRef.current?.blur(); }
    };

    // Cleanup timer on unmount
    useEffect(() => () => { if (responseTimer.current) clearTimeout(responseTimer.current); }, []);

    return (
        <div className={styles.aiSearchContainer}>
            <div className={`${styles.aiSearchBar} ${isFocused ? styles.aiSearchBarFocused : ''}`}>
                {loading ? (
                    <div className={styles.aiSearchSpinner} />
                ) : (
                    <FiZap size={15} className={styles.aiSearchIcon} />
                )}
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setTimeout(() => setIsFocused(false), 150)}
                    placeholder="Ask AI anything: add blog, toggle dark mode…"
                    className={styles.aiSearchInput}
                    disabled={loading}
                />
                {query && !loading && (
                    <button className={styles.aiSearchSendBtn} onClick={() => executeSearch(query)} aria-label="Send">↵</button>
                )}
            </div>

            {/* Suggestion dropdown */}
            {isFocused && !query && (
                <div className={styles.aiSuggestionsDropdown}>
                    <div className={styles.aiSuggestionsLabel}>Try asking</div>
                    {suggestions.map((s) => (
                        <button
                            key={s}
                            className={styles.aiSuggestionItem}
                            onMouseDown={() => executeSearch(s)}
                        >
                            <FiZap size={11} />
                            {s}
                        </button>
                    ))}
                </div>
            )}

            {/* Response pill */}
            {response && (
                <div className={styles.aiResponsePill}>
                    <FiZap size={11} />
                    <span>{response}</span>
                </div>
            )}
        </div>
    );
}

// ─── Vertical Carousel ───────────────────────────────────────────────────────
function VerticalCarousel({ items, type, onView, onEdit, onDelete }) {
    const [offset, setOffset] = useState(0);
    const VISIBLE = 3;
    const canUp = offset > 0;
    const canDown = offset + VISIBLE < items.length;
    const visible = items.slice(offset, offset + VISIBLE);

    return (
        <div className={styles.carouselPanel}>
            <div className={styles.carouselHeader}>
                <h3 className={styles.carouselTitle}>
                    {type === 'blogs' ? '✦ Recent Blogs' : '◈ Recent Projects'}
                </h3>
                <div className={styles.carouselNavBtns}>
                    <button
                        className={`${styles.carouselNavBtn} ${!canUp ? styles.carouselNavBtnDisabled : ''}`}
                        onClick={() => setOffset((o) => Math.max(0, o - 1))}
                        disabled={!canUp}
                        aria-label="Previous"
                    >
                        <FiArrowUp size={13} />
                    </button>
                    <button
                        className={`${styles.carouselNavBtn} ${!canDown ? styles.carouselNavBtnDisabled : ''}`}
                        onClick={() => setOffset((o) => Math.min(items.length - VISIBLE, o + 1))}
                        disabled={!canDown}
                        aria-label="Next"
                    >
                        <FiArrowDown size={13} />
                    </button>
                </div>
            </div>

            <div className={styles.carouselViewport}>
                {visible.length === 0 ? (
                    <div className={styles.carouselEmpty}>No {type} yet.</div>
                ) : (
                    visible.map((item, i) => (
                        <div key={item.slug} className={styles.carouselCard} style={{ animationDelay: `${i * 50}ms` }}>
                            <div
                                className={styles.carouselThumb}
                                style={{ backgroundImage: `url(${type === 'blogs' ? item.coverImage : item.heroImage})` }}
                            >
                                {type === 'blogs' && item.isAI && (
                                    <span className={styles.carouselAiBadge}>AI</span>
                                )}
                            </div>
                            <div className={styles.carouselInfo}>
                                <h4 className={styles.carouselItemTitle}>{item.title}</h4>
                                <span className={styles.carouselItemMeta}>
                                    {type === 'blogs'
                                        ? item.date
                                        : `${item.category || 'Project'} · ${item.year || ''}`}
                                </span>
                            </div>
                            <div className={styles.carouselActions}>
                                <button className={styles.carouselActionBtn} onClick={() => onView(item)} title="View">
                                    <FiExternalLink size={12} /><span>View</span>
                                </button>
                                <button className={`${styles.carouselActionBtn} ${styles.carouselEditBtn}`} onClick={() => onEdit(item)} title="Edit">
                                    <FiEdit2 size={12} />
                                </button>
                                <button className={`${styles.carouselActionBtn} ${styles.carouselDeleteBtn}`} onClick={() => onDelete(item)} title="Delete">
                                    <FiTrash2 size={12} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className={styles.carouselFooter}>
                <span className={styles.carouselCount}>
                    {items.length === 0 ? '0' : `${offset + 1}–${Math.min(offset + VISIBLE, items.length)}`} of {items.length}
                </span>
            </div>
        </div>
    );
}

// ─── Donut Chart ─────────────────────────────────────────────────────────────
function DonutChart({ percent, color, label }) {
    const clamped = Math.min(100, Math.max(0, Math.round(percent)));
    return (
        <div className={styles.donutWrapper}>
            <div
                className={styles.donutOuter}
                style={{ background: `conic-gradient(${color} ${clamped}%, rgba(255,255,255,0.05) 0)` }}
            >
                <div className={styles.donutInner} style={{ color }}>
                    {clamped}%
                </div>
            </div>
            <span className={styles.donutLabel}>{label}</span>
        </div>
    );
}

// ─── Stat Card ───────────────────────────────────────────────────────────────
function StatCard({ badges, title, value, desc, iconColor, onClick }) {
    return (
        <div className={styles.statCard}>
            <div className={styles.statBadgeRow}>
                {badges.map((b) => (
                    <span key={b.label} className={styles.statBadgeChip} style={{ background: b.bg, color: b.color }}>
                        {b.label}
                    </span>
                ))}
            </div>
            <div className={styles.statCardHeader}>
                <h3 className={styles.statCardTitle}>{title}</h3>
                <span className={styles.statCardValue}>{value}</span>
            </div>
            <p className={styles.statCardDesc}>{desc}</p>
            <div className={styles.statCardFooter}>
                {onClick && (
                    <button className={styles.statCardBtn} onClick={onClick} style={{ color: iconColor, background: `${iconColor}22`, borderColor: `${iconColor}33` }}>
                        <FiTrendingUp size={15} />
                    </button>
                )}
            </div>
        </div>
    );
}

// ─── Main Dashboard ──────────────────────────────────────────────────────────
export default function Dashboard() {
    const router = useRouter();
    const themeToggleBtnRef = useRef(null);

    // Mirror the global site theme (reads same localStorage key as ThemeSwitch.js)
    const [theme, setTheme] = useState('dark');
    const [stats, setStats] = useState({
        totalProjects: 0, totalBlogs: 0, aiBlogs: 0, humanBlogs: 0,
        activeProjects: 0, recentBlogs: [], recentProjects: [],
    });
    const [visitorData, setVisitorData] = useState({ stats: [], totalVisits: 0 });
    const [loading, setLoading] = useState(true);

    // Sync local state with the global data-theme on mount
    useEffect(() => {
        setTheme(getGlobalTheme());

        // Listen for theme changes made by ThemeSwitch on other pages
        const observer = new MutationObserver(() => {
            const current = document.documentElement.getAttribute('data-theme') || 'dark';
            setTheme(current);
        });
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
        return () => observer.disconnect();
    }, []);

    // Global toggle — affects the entire website
    const toggleTheme = useCallback((newTheme) => {
        const rect = themeToggleBtnRef.current?.getBoundingClientRect() ?? null;
        setTheme(newTheme);
        applyGlobalTheme(newTheme, rect);
    }, []);

    useEffect(() => { loadStats(); }, []);

    const loadStats = async () => {
        try {
            const [projects, blogs, visitors] = await Promise.all([
                fetchProjects(), fetchBlogs(), getVisitorStats(10),
            ]);
            const aiBlogs = blogs.filter((b) => b.isAI || (b.tags && b.tags.includes('AI')));
            const humanBlogs = blogs.filter((b) => !b.isAI && (!b.tags || !b.tags.includes('AI')));
            const activeProjects = projects.filter((p) => p.status !== 'draft');
            setStats({
                totalProjects: projects.length, totalBlogs: blogs.length,
                aiBlogs: aiBlogs.length, humanBlogs: humanBlogs.length,
                activeProjects: activeProjects.length,
                recentBlogs: blogs.slice(0, 10), recentProjects: projects.slice(0, 10),
            });
            setVisitorData(visitors);
        } catch (err) {
            console.error('Error loading stats:', err);
        } finally {
            setLoading(false);
        }
    };

    // ── AI action handler ──
    const handleAIAction = useCallback((action) => {
        switch (action.action) {
            case 'navigate':
                router.push(action.target);
                break;
            case 'toggleTheme': {
                const newTheme = action.theme === 'light' ? 'light' : 'dark';
                toggleTheme(newTheme);
                break;
            }
            case 'openCreateBlog':
                router.push('/admin/blogs?action=create');
                break;
            case 'openCreateProject':
                router.push('/admin/projects?action=create');
                break;
            case 'showStats':
                document.getElementById('admin-dashboard-root')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                break;
            default:
                break;
        }
    }, [router, toggleTheme]);

    const handleViewItem = (item, type) => {
        window.open(type === 'blogs' ? `/blogs/${item.slug}` : `/projects/${item.slug}`, '_blank');
    };
    const handleEditItem = (item, type) => {
        router.push(type === 'blogs' ? '/admin/blogs' : '/admin/projects');
    };
    const handleDeleteItem = async (item, type) => {
        if (!confirm(`Delete "${item.title}"? This cannot be undone.`)) return;
        await (type === 'blogs' ? deleteBlog(item.slug) : deleteProject(item.slug));
        loadStats();
    };

    if (loading) {
        return (
            <div className={styles.dashboardLoading}>
                <Loading text="Loading dashboard..." />
            </div>
        );
    }

    const maxVisits = Math.max(...visitorData.stats.map((d) => d.count), 1);
    const projectsPct = (stats.activeProjects / (stats.totalProjects || 1)) * 100;
    const aiBlogsPct = (stats.aiBlogs / (stats.totalBlogs || 1)) * 100;
    const humanBlogsPct = (stats.humanBlogs / (stats.totalBlogs || 1)) * 100;

    return (
        <div id="admin-dashboard-root" className={styles.dashboardRoot}>

            {/* ── Header ── */}
            <div className={styles.dashHeader}>
                <div className={styles.dashHeaderLeft}>
                    <div className={styles.dashBreadcrumb}>
                        <FiMenu size={14} />
                        <span>Dashboard</span>
                    </div>
                    <h1 className={styles.dashTitle}>Hello there, Admin</h1>
                </div>
                <div className={styles.dashHeaderRight}>
                    {/* Global theme toggle — affects entire website */}
                    <button
                        ref={themeToggleBtnRef}
                        className={styles.themeToggleBtn}
                        onClick={(e) => {
                            const newTheme = theme === 'dark' ? 'light' : 'dark';
                            const rect = e.currentTarget.getBoundingClientRect();
                            setTheme(newTheme);
                            applyGlobalTheme(newTheme, rect);
                        }}
                        title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode (affects entire site)`}
                    >
                        {theme === 'dark' ? <FiSun size={16} /> : <FiMoon size={16} />}
                    </button>
                    <AISearchBar onAction={handleAIAction} stats={stats} />
                </div>
            </div>

            {/* ── Stat Cards ── */}
            <div className={styles.statCardsGrid}>
                <StatCard
                    badges={[{ label: 'All', bg: '#e5e7eb', color: '#374151' }, { label: 'Active', bg: '#fef3c7', color: '#92400e' }]}
                    title="Total Projects"
                    value={stats.totalProjects}
                    desc={`${stats.activeProjects} active · ${stats.totalProjects - stats.activeProjects} draft`}
                    iconColor="#FACC15"
                    onClick={() => router.push('/admin/projects')}
                />
                <StatCard
                    badges={[{ label: 'AI', bg: '#dcfce7', color: '#166534' }, { label: 'Human', bg: '#e0e7ff', color: '#3730a3' }]}
                    title="Total Blogs"
                    value={stats.totalBlogs}
                    desc={`${stats.aiBlogs} AI-generated · ${stats.humanBlogs} manually written`}
                    iconColor="#FACC15"
                    onClick={() => router.push('/admin/blogs')}
                />
                <StatCard
                    badges={[{ label: 'Organic', bg: '#fef3c7', color: '#92400e' }]}
                    title="Total Visitors"
                    value={visitorData.totalVisits}
                    desc="Organic visits across your portfolio (last 10 days)"
                    iconColor="#10b981"
                />
            </div>

            {/* ── Charts Row ── */}
            <div className={styles.chartsRow}>
                {/* Bar chart */}
                <div className={`${styles.dashCard} ${styles.barChartCard}`}>
                    <div className={styles.chartLegend}>
                        <div className={styles.chartDot} style={{ background: '#FACC15' }} />
                        <span>Visitors — last 10 days</span>
                    </div>
                    <div className={styles.barChart}>
                        {visitorData.stats.map((day, idx) => {
                            const barH = Math.max((day.count / maxVisits) * 100, 5);
                            return (
                                <div key={idx} className={styles.barCol}>
                                    <div className={styles.barTrack}>
                                        <div
                                            className={styles.barFill}
                                            style={{ height: `${barH}%` }}
                                            title={`${day.count} visits`}
                                        />
                                    </div>
                                    <span className={styles.barLabel}>{day.label}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Donut charts */}
                <div className={`${styles.dashCard} ${styles.donutCard}`}>
                    <h3 className={styles.cardSectionTitle}>Content Breakdown</h3>
                    <div className={styles.donutsRow}>
                        <DonutChart percent={aiBlogsPct} color="#10b981" label="AI Blogs" />
                        <DonutChart percent={humanBlogsPct} color="#8b5cf6" label="Human" />
                        <DonutChart percent={projectsPct} color="#FACC15" label="Active Projects" />
                    </div>
                </div>
            </div>

            {/* ── Dual Carousels ── */}
            <div className={styles.dualCarouselRow}>
                <VerticalCarousel
                    items={stats.recentProjects}
                    type="projects"
                    onView={(item) => handleViewItem(item, 'projects')}
                    onEdit={(item) => handleEditItem(item, 'projects')}
                    onDelete={(item) => handleDeleteItem(item, 'projects')}
                />
                <VerticalCarousel
                    items={stats.recentBlogs}
                    type="blogs"
                    onView={(item) => handleViewItem(item, 'blogs')}
                    onEdit={(item) => handleEditItem(item, 'blogs')}
                    onDelete={(item) => handleDeleteItem(item, 'blogs')}
                />
            </div>
        </div>
    );
}
