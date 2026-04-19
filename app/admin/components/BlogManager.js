'use client';

import { useState, useEffect, useRef } from 'react';
import styles from '../admin.module.css';
import { addBlog, fetchBlogs, deleteBlog } from '@/lib/firestoreUtils';
import { FiCpu, FiCalendar, FiSearch, FiPlus, FiEye, FiEyeOff, FiExternalLink } from 'react-icons/fi';
import { IoSparkles } from 'react-icons/io5';
import { ContentCard } from './ContentCard';
import { useAuth } from '@/lib/AuthContext';
import BlogPostClient from '../../blogs/[slug]/BlogPostClient';
import MarkdownEditor from './MarkdownEditor';

export default function BlogManager() {
    const [view, setView] = useState('list');
    const [blogs, setBlogs] = useState([]);
    const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });
    const [searchQuery, setSearchQuery] = useState('');
    const [isAiModalOpen, setIsAiModalOpen] = useState(false);
    const [isCreationModalOpen, setIsCreationModalOpen] = useState(false);
    const [linkInput, setLinkInput] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [activeTab, setActiveTab] = useState('editor'); // 'editor' | 'preview'
    const { user } = useAuth();

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

    // BroadcastChannel for reliable cross-tab live preview
    const previewChannel = useRef(null);
    useEffect(() => {
        previewChannel.current = new BroadcastChannel('livePreview_blog');
        return () => previewChannel.current?.close();
    }, []);

    useEffect(() => {
        if ((view === 'create' || view === 'edit') && previewChannel.current) {
            previewChannel.current.postMessage(formData);
        }
    }, [formData, view]);

    const loadBlogs = async () => {
        try {
            const data = await fetchBlogs();
            setBlogs(data);
        } catch (error) {
            console.error("Error loading blogs:", error);
        }
    };

    const handleCreateClick = () => {
        setIsCreationModalOpen(true);
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
        setActiveTab('editor');
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

    const handleGenerateFromLinks = async (e) => {
        e.preventDefault();
        const links = linkInput.split('\n').map(l => l.trim()).filter(l => l.startsWith('http'));
        
        if (links.length === 0) {
            setStatusMessage({ type: 'error', text: 'Please enter at least one valid link.' });
            return;
        }

        setIsGenerating(true);
        setStatusMessage({ type: 'info', text: 'Scraping content and synthesizing blog post...' });

        try {
            const token = await user.getIdToken();
            const response = await fetch('/api/generate-blog-from-links', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ links })
            });

            const result = await response.json();

            if (result.success) {
                setStatusMessage({ type: 'success', text: 'Blog generated successfully! You can now edit it.' });
                setFormData(result.data);
                setView('create');
                setIsAiModalOpen(false);
                setLinkInput('');
            } else {
                setStatusMessage({ type: 'error', text: result.error || 'Failed to generate blog.' });
            }
        } catch (error) {
            console.error('Generation Error:', error);
            setStatusMessage({ type: 'error', text: error.message });
        } finally {
            setIsGenerating(false);
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
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <button onClick={handleCreateClick} className={styles.modernCreateBtn}>
                                <FiPlus size={16} />
                                New Blog
                            </button>
                        </div>
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
                <div className={styles.editorPage}>
                    {/* Editor Topbar */}
                    <div className={styles.editorTopbar}>
                        <button onClick={handleCancel} className={styles.modernBackBtn}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M15 18l-6-6 6-6" />
                            </svg>
                            Back
                        </button>

                        <div className={styles.editorTabGroup}>
                            <button
                                className={`${styles.editorTab} ${activeTab === 'editor' ? styles.editorTabActive : ''}`}
                                onClick={() => setActiveTab('editor')}
                            >
                                <FiEyeOff size={14} />
                                Editor
                            </button>
                            <button
                                className={`${styles.editorTab} ${activeTab === 'preview' ? styles.editorTabActive : ''}`}
                                onClick={() => setActiveTab('preview')}
                            >
                                <FiEye size={14} />
                                Preview
                            </button>
                        </div>

                        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                            <button
                                type="button"
                                className={styles.livePreviewBtn}
                                onClick={() => {
                                    const encoded = btoa(encodeURIComponent(JSON.stringify(formData)));
                                    window.open(`/admin/preview/blog?data=${encoded}`, '_blank');
                                }}
                                title="Open full-page preview"
                            >
                                <FiExternalLink size={14} />
                                Live Preview
                            </button>
                        </div>
                    </div>

                    {statusMessage.text && (
                        <div className={statusMessage.type === 'success' ? styles.successMessage : styles.errorMessage} style={{ margin: '0 0 1.5rem 0' }}>
                            {statusMessage.text}
                        </div>
                    )}

                    <div className={styles.editorBody}>
                        {/* === EDITOR TAB === */}
                        {activeTab === 'editor' && (
                            <form onSubmit={handleSubmit} className={styles.editorFormWrapper}>
                                {/* Title + Slug */}
                                <div className={styles.editorFieldRow}>
                                    <div className={styles.editorFieldGroup}>
                                        <label className={styles.editorLabel}>Title <span style={{color:'#e63946'}}>*</span></label>
                                        <input name="title" value={formData.title || ''} onChange={handleChange} className={styles.editorInput} placeholder="Enter a compelling blog title..." required />
                                    </div>
                                    <div className={styles.editorFieldGroup} style={{ maxWidth: '260px' }}>
                                        <label className={styles.editorLabel}>Slug</label>
                                        <input name="slug" value={formData.slug || ''} onChange={handleChange} className={`${styles.editorInput} ${view === 'edit' ? styles.editorInputDisabled : ''}`} disabled={view === 'edit'} placeholder="auto-generated" />
                                    </div>
                                </div>

                                {/* Category + Cover Image */}
                                <div className={styles.editorFieldRow}>
                                    <div className={styles.editorFieldGroup} style={{ maxWidth: '220px' }}>
                                        <label className={styles.editorLabel}>Category <span style={{color:'#e63946'}}>*</span></label>
                                        <input name="category" value={formData.category || ''} onChange={handleChange} className={styles.editorInput} placeholder="e.g. Technology" required />
                                    </div>
                                    <div className={styles.editorFieldGroup}>
                                        <label className={styles.editorLabel}>Cover Image URL <span style={{color:'#e63946'}}>*</span></label>
                                        <div className={styles.editorImageInputRow}>
                                            <input name="coverImage" value={formData.coverImage || ''} onChange={handleChange} className={styles.editorInput} placeholder="https://..." required />
                                            {formData.coverImage && (
                                                <img src={formData.coverImage} alt="thumb" className={styles.editorImageThumb} onError={e => e.target.style.display='none'} />
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Excerpt */}
                                <div className={styles.editorFieldGroup}>
                                    <label className={styles.editorLabel}>Excerpt / Summary <span style={{color:'#e63946'}}>*</span></label>
                                    <textarea name="excerpt" value={formData.excerpt || ''} onChange={handleChange} className={styles.editorTextarea} placeholder="Short description shown in blog listing and SEO..." required style={{ minHeight: '100px' }} />
                                </div>

                                {/* Content */}
                                <div className={styles.editorFieldGroup}>
                                    <label className={styles.editorLabel}>Content <span style={{color:'#e63946'}}>*</span></label>
                                    <MarkdownEditor
                                        value={formData.content || ''}
                                        onChange={handleChange}
                                        placeholder="Write your blog post in markdown..."
                                        required
                                    />
                                </div>

                                {/* Submit */}
                                <div className={styles.editorSubmitRow}>
                                    <button type="button" className={styles.editorCancelBtn} onClick={handleCancel}>Cancel</button>
                                    <button type="submit" className={styles.editorSubmitBtn}>
                                        {view === 'create' ? '✦ Publish Blog' : '✦ Save Changes'}
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* === PREVIEW TAB === */}
                        {activeTab === 'preview' && (
                            <div className={styles.fullWidthPreview}>
                                <BlogPostClient initialBlog={formData} isPreview={true} />
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* AI Generation Modal */}
            {isAiModalOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <div className={styles.modalTitle}>Generate Blog from Links</div>
                        <p className={styles.modalSubtitle}>Enter one or more URLs (one per line). AI will synthesize them into a single blog post.</p>
                        
                        <form onSubmit={handleGenerateFromLinks}>
                            <textarea
                                className={styles.textarea}
                                style={{ minHeight: '200px', marginBottom: '1rem' }}
                                placeholder="https://techcrunch.com/article1&#10;https://theverge.com/article2"
                                value={linkInput}
                                onChange={(e) => setLinkInput(e.target.value)}
                                disabled={isGenerating}
                                required
                            />
                            
                            <div className={styles.modalActions}>
                                <button 
                                    type="button" 
                                    className={styles.modalCancelBtn}
                                    onClick={() => setIsAiModalOpen(false)}
                                    disabled={isGenerating}
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className={styles.sparkleBtn}
                                    disabled={isGenerating}
                                >
                                    {isGenerating ? (
                                        <>Generating...</>
                                    ) : (
                                        <>
                                            <IoSparkles size={16} />
                                            Generate
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Creation Method Modal */}
            {isCreationModalOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <div className={styles.modalTitle}>Create New Blog</div>
                        <p className={styles.modalSubtitle}>How would you like to create your new blog post?</p>
                        
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                            <button 
                                className={styles.modernCreateBtn}
                                style={{ flex: 1, justifyContent: 'center', padding: '1rem', fontSize: '1rem' }}
                                onClick={() => {
                                    setIsCreationModalOpen(false);
                                    setFormData(initialFormState);
                                    setView('create');
                                    setStatusMessage({ type: '', text: '' });
                                }}
                            >
                                Manual Creation
                            </button>
                            <button 
                                className={styles.sparkleBtn}
                                style={{ flex: 1, justifyContent: 'center', padding: '1rem', fontSize: '1rem' }}
                                onClick={() => {
                                    setIsCreationModalOpen(false);
                                    setIsAiModalOpen(true);
                                }}
                            >
                                <IoSparkles size={18} />
                                AI Generate
                            </button>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1.5rem' }}>
                            <button className={styles.modalCancelBtn} onClick={() => setIsCreationModalOpen(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
