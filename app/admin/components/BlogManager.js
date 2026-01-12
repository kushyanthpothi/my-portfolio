'use client';

import { useState, useEffect } from 'react';
import styles from '../admin.module.css';
import { addBlog, fetchBlogs, deleteBlog } from '@/lib/firestoreUtils';
import { FiEdit2, FiTrash2, FiCpu } from 'react-icons/fi';

export default function BlogManager() {
    const [view, setView] = useState('list'); // 'list', 'edit', 'create'
    const [blogs, setBlogs] = useState([]);
    const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });

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
            console.log('Attempting to delete blog with slug:', slug);

            try {
                const result = await deleteBlog(slug);
                if (result.success) {
                    setStatusMessage({ type: 'success', text: 'Blog deleted successfully.' });
                    await loadBlogs(); // Reload the list
                } else {
                    console.error('Delete failed:', result.error);
                    setStatusMessage({ type: 'error', text: `Failed to delete blog: ${result.error?.message || 'Unknown error'}` });
                }
            } catch (error) {
                console.error('Delete error:', error);
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
            console.error(error);
            setStatusMessage({ type: 'error', text: 'Error occurred.' });
        }
    };

    return (
        <div className={styles.managerContainer}>
            {view === 'list' && (
                <>
                    <div className={styles.managerHeader}>
                        <h2 className={styles.sectionTitle}>Blogs</h2>
                        <button onClick={handleCreateClick} className={styles.createButton}>+ New Blog</button>
                    </div>

                    {statusMessage.text && (
                        <div className={statusMessage.type === 'success' ? styles.successMessage : (statusMessage.type === 'error' ? styles.errorMessage : styles.infoMessage)} style={{ marginBottom: '1rem' }}>
                            {statusMessage.text}
                        </div>
                    )}

                    {/* Standard Blogs Section */}
                    <h3 style={{ margin: '2rem 0 1rem', color: '#ccc', borderBottom: '1px solid #333', paddingBottom: '0.5rem' }}>
                        Standard Content (Human Written)
                    </h3>
                    <div className={styles.listGrid}>
                        {blogs.filter(b => !b.isAI && (!b.tags || !b.tags.includes('AI'))).length === 0 && (
                            <div style={{ padding: '1rem', color: '#666' }}>No standard blogs found.</div>
                        )}
                        {blogs.filter(b => !b.isAI && (!b.tags || !b.tags.includes('AI'))).map((b) => (
                            <div key={b.slug} className={styles.listItem}>
                                <div className={styles.itemImage} style={{ backgroundImage: `url(${b.coverImage})` }}></div>
                                <div className={styles.itemInfo}>
                                    <h3>{b.title}</h3>
                                    <span className={styles.itemMeta}>{b.category} • {new Date(b.date).toLocaleDateString()}</span>
                                </div>
                                <div className={styles.itemActions}>
                                    <button onClick={() => handleEditClick(b)} className={styles.iconButton} title="Edit"><FiEdit2 size={16} /></button>
                                    <button onClick={() => handleDeleteClick(b.slug)} className={styles.iconButton} style={{ color: '#ff4444' }} title="Delete"><FiTrash2 size={16} /></button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* AI Blogs Section */}
                    <div style={{ marginTop: '3rem' }}>
                        <h3 style={{ margin: '0 0 1rem', color: '#ffd700', borderBottom: '1px solid #333', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <FiCpu size={18} /> AI Generated Content
                        </h3>
                        <div className={styles.listGrid}>
                            {blogs.filter(b => b.isAI || (b.tags && b.tags.includes('AI'))).length === 0 && (
                                <div style={{ padding: '1rem', color: '#666' }}>No AI generated blogs found.</div>
                            )}
                            {blogs.filter(b => b.isAI || (b.tags && b.tags.includes('AI'))).map((b) => (
                                <div key={b.slug} className={styles.listItem} style={{ borderLeft: '3px solid #ffd700' }}>
                                    <div className={styles.itemImage} style={{ backgroundImage: `url(${b.coverImage})` }}></div>
                                    <div className={styles.itemInfo}>
                                        <h3>{b.title}</h3>
                                        <span className={styles.itemMeta}>AI Generated • {new Date(b.date).toLocaleDateString()}</span>
                                    </div>
                                    <div className={styles.itemActions}>
                                        <button onClick={() => handleEditClick(b)} className={styles.iconButton} title="Edit"><FiEdit2 size={16} /></button>
                                        <button onClick={() => handleDeleteClick(b.slug)} className={styles.iconButton} style={{ color: '#ff4444' }} title="Delete"><FiTrash2 size={16} /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}

            {(view === 'create' || view === 'edit') && (
                <div className={styles.formContainer}>
                    <div className={styles.formHeader}>
                        <button onClick={handleCancel} className={styles.backButton}>← Back</button>
                        <h2>{view === 'create' ? 'New Blog' : 'Edit Blog'}</h2>
                    </div>

                    {statusMessage.text && (
                        <div className={statusMessage.type === 'success' ? styles.successMessage : styles.errorMessage}>
                            {statusMessage.text}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className={styles.formGrid}>
                        <div className={`${styles.inputGroup} ${styles.colSpan6}`}>
                            <label className={styles.label}>Title *</label>
                            <input name="title" value={formData.title || ''} onChange={handleChange} className={styles.input} required />
                        </div>

                        <div className={`${styles.inputGroup} ${styles.colSpan6}`}>
                            <label className={styles.label}>Slug *</label>
                            <input name="slug" value={formData.slug || ''} onChange={handleChange} className={styles.input} disabled={view === 'edit'} placeholder="Auto-generated if empty" />
                        </div>

                        <div className={`${styles.inputGroup} ${styles.colSpan6}`}>
                            <label className={styles.label}>Category *</label>
                            <input name="category" value={formData.category || ''} onChange={handleChange} className={styles.input} required />
                        </div>

                        <div className={`${styles.inputGroup} ${styles.colSpan12}`}>
                            <label className={styles.label}>Cover Image URL *</label>
                            <input name="coverImage" value={formData.coverImage || ''} onChange={handleChange} className={styles.input} required />
                        </div>

                        <div className={`${styles.inputGroup} ${styles.colSpan12}`}>
                            <label className={styles.label}>Excerpt *</label>
                            <textarea name="excerpt" value={formData.excerpt || ''} onChange={handleChange} className={styles.textarea} required />
                        </div>

                        <div className={`${styles.inputGroup} ${styles.colSpan12}`}>
                            <label className={styles.label}>Content (Markdown) *</label>
                            <div className={styles.helperText} style={{ marginBottom: '0.5rem' }}>
                                Supports: **bold**, *italic*, `code`, # Headers, - Lists, [links](url)
                            </div>
                            <textarea
                                name="content"
                                value={formData.content || ''}
                                onChange={handleChange}
                                className={styles.textarea}
                                style={{ minHeight: '600px', fontFamily: 'monospace' }}
                                required
                            />
                        </div>

                        <div className={styles.colSpan12}>
                            <button type="submit" className={styles.button} style={{ width: '100%' }}>
                                {view === 'create' ? 'Publish Blog' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
