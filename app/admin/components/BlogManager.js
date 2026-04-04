'use client';

import { useState, useEffect } from 'react';
import styles from '../admin.module.css';
import { addBlog, fetchBlogs, deleteBlog } from '@/lib/firestoreUtils';
import { FiCpu, FiCalendar, FiSearch, FiPlus } from 'react-icons/fi';
import { ContentCard } from './ContentCard';

export default function BlogManager() {
    const [view, setView] = useState('list');
    const [blogs, setBlogs] = useState([]);
    const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });
    const [searchQuery, setSearchQuery] = useState('');

    const initialFormState = {
        title: '',
        slug: '',
        excerpt: '',
        category: '',
        coverImage: '',
        content: ''
    };
    const [formData, setFormData] = useState(initialFormState);

    useEffect(() => {
        loadBlogs();
    }, []);

    const loadBlogs = async () => {
        try {
            const data = await fetchBlogs();
            setBlogs(data);
        } catch (error) {
            console.error("Error loading blogs:", error);
        }
    };

    const handleCreateClick = () => {
        setFormData(initialFormState);
        setView('create');
        setStatusMessage({ type: '', text: '' });
    };

    const handleEditClick = (blog) => {
        setFormData(blog);
        setView('edit');
        setStatusMessage({ type: '', text: '' });
    };

    const handleDeleteClick = async (slug) => {
        if (!slug) {
            setStatusMessage({ type: 'error', text: 'Invalid blog slug.' });
            return;
        }

        if (confirm('Are you sure you want to delete this blog post?')) {
            setStatusMessage({ type: 'info', text: 'Deleting blog...' });
            try {
                const result = await deleteBlog(slug);
                if (result.success) {
                    setStatusMessage({ type: 'success', text: 'Blog deleted successfully.' });
                    await loadBlogs();
                } else {
                    setStatusMessage({ type: 'error', text: `Failed to delete blog: ${result.error?.message || 'Unknown error'}` });
                }
            } catch (error) {
                setStatusMessage({ type: 'error', text: `Error deleting blog: ${error.message}` });
            }
        }
    };

    const handleCancel = () => {
        setView('list');
        setFormData(initialFormState);
        setStatusMessage({ type: '', text: '' });
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatusMessage({ type: 'info', text: view === 'create' ? 'Publishing...' : 'Updating...' });

        try {
            const result = await addBlog(formData);
            if (result.success) {
                setStatusMessage({ type: 'success', text: view === 'create' ? 'Blog published!' : 'Blog updated!' });
                loadBlogs();
                if (view === 'create') handleCancel();
            } else {
                setStatusMessage({ type: 'error', text: 'Operation failed.' });
            }
        } catch (error) {
            setStatusMessage({ type: 'error', text: 'Error occurred.' });
        }
    };

    const filteredBlogs = blogs.filter(blog => {
        const query = searchQuery.toLowerCase();
        return blog.title?.toLowerCase().includes(query) ||
            blog.category?.toLowerCase().includes(query) ||
            blog.excerpt?.toLowerCase().includes(query);
    });

    const standardBlogs = filteredBlogs.filter(b => !b.isAI && (!b.tags || !b.tags.includes('AI')));
    const aiBlogs = filteredBlogs.filter(b => b.isAI || (b.tags && b.tags.includes('AI')));

    return (
        <div className={styles.managerContainer}>
            {view === 'list' && (
                <>
                    {/* Modern Header with Search */}
                    <div className={styles.modernPageHeader}>
                        <div>
                            <h2 className={styles.sectionTitle}>Blog Posts</h2>
                            <p className={styles.pageSubtitle}>Manage and organize your blog content</p>
                        </div>
                        <button onClick={handleCreateClick} className={styles.modernCreateBtn}>
                            <FiPlus size={16} />
                            New Blog
                        </button>
                    </div>

                    {/* Search + Status */}
                    <div className={styles.modernControls}>
                        <div className={styles.searchInput}>
                            <FiSearch size={16} />
                            <input
                                type="text"
                                placeholder="Search blogs..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className={styles.blogStats}>
                            <span className={styles.statBadge}>
                                {standardBlogs.length} Standard
                            </span>
                            <span className={`${styles.statBadge} ${styles.aiStatBadge}`}>
                                {aiBlogs.length} AI Generated
                            </span>
                        </div>
                    </div>

                    {statusMessage.text && (
                        <div className={`${statusMessage.type === 'success' ? styles.successMessage : styles.errorMessage}`}>
                            {statusMessage.text}
                        </div>
                    )}

                    {/* Blog Cards Grid - Standard */}
                    <div className={styles.sectionHeader}>
                        <h3 className={styles.sectionLabel}>Standard Content</h3>
                        <span className={styles.sectionCount}>{standardBlogs.length}</span>
                    </div>

                    {standardBlogs.length === 0 ? (
                        <div className={styles.emptyState}>
                            <FiCalendar size={32} />
                            <p>No standard blogs found.</p>
                        </div>
                    ) : (
                        <div className={styles.listGrid}>
                            {standardBlogs.map((b) => (
                                <ContentCard
                                    key={b.slug}
                                    imageUrl={b.coverImage}
                                    badge={b.category}
                                    title={b.title}
                                    metaDate={new Date(b.date).toLocaleDateString()}
                                    onEdit={() => handleEditClick(b)}
                                    onDelete={() => handleDeleteClick(b.slug)}
                                />
                            ))}
                        </div>
                    )}

                    {/* Blog Cards - AI Generated */}
                    <div className={styles.sectionHeader}>
                        <h3 className={`${styles.sectionLabel} ${styles.sectionLabelAI}`}>AI Generated Content</h3>
                        <span className={styles.sectionCount}>{aiBlogs.length}</span>
                    </div>

                    {aiBlogs.length === 0 ? (
                        <div className={styles.emptyState}>
                            <FiCpu size={32} />
                            <p>No AI generated blogs found.</p>
                        </div>
                    ) : (
                        <div className={styles.listGrid}>
                            {aiBlogs.map((b) => (
                                <ContentCard
                                    key={b.slug}
                                    imageUrl={b.coverImage}
                                    isAI
                                    title={b.title}
                                    metaDate={new Date(b.date).toLocaleDateString()}
                                    metaLabel="AI Generated"
                                    onEdit={() => handleEditClick(b)}
                                    onDelete={() => handleDeleteClick(b.slug)}
                                />
                            ))}
                        </div>
                    )}
                </>
            )}

            {(view === 'create' || view === 'edit') && (
                <div className={styles.modernFormContainer}>
                    <div className={styles.modernFormHeader}>
                        <button onClick={handleCancel} className={styles.modernBackBtn}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M15 18l-6-6 6-6" />
                            </svg>
                            Back
                        </button>
                        <div className={styles.modernFormTitle}>
                            <div className={styles.modernFormIcon} />
                            <h2>{view === 'create' ? 'Create New Blog' : 'Edit Blog'}</h2>
                        </div>
                        <div className={styles.modernFormPlaceholder} />
                    </div>

                    {statusMessage.text && (
                        <div className={statusMessage.type === 'success' ? styles.successMessage : styles.errorMessage}>
                            {statusMessage.text}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className={styles.formGrid}>
                        <div className={`${styles.inputGroup} ${styles.colSpan6}`}>
                            <label className={styles.label}>Title</label>
                            <input name="title" value={formData.title || ''} onChange={handleChange} className={styles.input} placeholder="Enter blog title" required />
                        </div>

                        <div className={`${styles.inputGroup} ${styles.colSpan6}`}>
                            <label className={styles.label}>Slug</label>
                            <input name="slug" value={formData.slug || ''} onChange={handleChange} className={`${styles.input} ${styles.inputDisabled}`} disabled={view === 'edit'} placeholder="Auto-generated if empty" />
                        </div>

                        <div className={`${styles.inputGroup} ${styles.colSpan4}`}>
                            <label className={styles.label}>Category</label>
                            <input name="category" value={formData.category || ''} onChange={handleChange} className={styles.input} placeholder="e.g. Technology" required />
                        </div>

                        <div className={`${styles.inputGroup} ${styles.colSpan8}`}>
                            <label className={styles.label}>Cover Image URL</label>
                            <input name="coverImage" value={formData.coverImage || ''} onChange={handleChange} className={styles.input} placeholder="Paste an image URL here" required />
                        </div>

                        <div className={styles.colSpan12}>
                            <label className={styles.label}>Excerpt</label>
                            <textarea name="excerpt" value={formData.excerpt || ''} onChange={handleChange} className={styles.textarea} placeholder="Short summary for SEO and preview..." required style={{ minHeight: '120px' }} />
                        </div>

                        <div className={styles.colSpan12}>
                            <label className={styles.label}>Content</label>
                            <div className={styles.helperText}>
                                Supports: <code>**bold**</code>, <code>*italic*</code>, <code>code</code>, <code># Headers</code>, <code>- Lists</code>, <code>[links](url)</code>
                            </div>
                            <textarea
                                name="content"
                                value={formData.content || ''}
                                onChange={handleChange}
                                className={styles.textarea}
                                style={{ minHeight: '500px', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace' }}
                                placeholder="Write your blog post in markdown format here..."
                                required
                            />
                        </div>

                        <div className={styles.colSpan12}>
                            <button type="submit" className={styles.submitButton}>
                                {view === 'create' ? 'Publish Blog' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
