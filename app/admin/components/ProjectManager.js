'use client';

import { useState, useEffect } from 'react';
import styles from '../admin.module.css';
import { addProject, fetchProjects, deleteProject } from '@/lib/firestoreUtils';
import { ContentCard } from './ContentCard';
import { FiPlus, FiSearch, FiFolder, FiEdit2, FiTrash2 } from 'react-icons/fi';

export default function ProjectManager() {
    const [view, setView] = useState('list');
    const [projects, setProjects] = useState([]);
    const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });
    const [searchQuery, setSearchQuery] = useState('');
    const [inputTech, setInputTech] = useState('');
    const [inputImage, setInputImage] = useState('');

    // eslint-disable-next-line no-unused-vars
    const [editingId, setEditingId] = useState(null);

    const initialFormState = {
        title: '',
        slug: '',
        summary: '',
        category: '',
        heroImage: '',
        year: new Date().getFullYear().toString(),
        industry: '',
        client: '',
        duration: '',
        problem: '',
        solution: '',
        challenge: '',
        techStack: [],
        github: '',
        liveUrl: '',
        contentImages: []
    };
    const [formData, setFormData] = useState(initialFormState);

    useEffect(() => {
        loadProjects();
    }, []);

    const loadProjects = async () => {
        try {
            const data = await fetchProjects();
            setProjects(data);
        } catch (error) {
            console.error("Error loading projects:", error);
        }
    };

    const handleCreateClick = () => {
        setFormData(initialFormState);
        setView('create');
        setStatusMessage({ type: '', text: '' });
    };

    const handleEditClick = (project) => {
        setFormData(project);
        setEditingId(project.slug);
        setView('edit');
        setStatusMessage({ type: '', text: '' });
    };

    const handleDeleteClick = async (slug) => {
        if (confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
            setStatusMessage({ type: 'info', text: 'Deleting project...' });
            const result = await deleteProject(slug);
            if (result.success) {
                setStatusMessage({ type: 'success', text: 'Project deleted successfully.' });
                loadProjects();
            } else {
                setStatusMessage({ type: 'error', text: 'Failed to delete project.' });
            }
        }
    };

    const handleCancel = () => {
        setView('list');
        setEditingId(null);
        setFormData(initialFormState);
        setStatusMessage({ type: '', text: '' });
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const addTech = (e) => {
        if (e.key === 'Enter' && inputTech.trim()) {
            e.preventDefault();
            const newTechs = inputTech.split(',').map(t => t.trim()).filter(t => t);
            setFormData({ ...formData, techStack: [...(formData.techStack || []), ...newTechs] });
            setInputTech('');
        }
    };
    const removeTech = (index) => {
        setFormData({ ...formData, techStack: formData.techStack.filter((_, i) => i !== index) });
    };

    const addContentImage = (e) => {
        if (e.key === 'Enter' && inputImage.trim()) {
            e.preventDefault();
            setFormData({ ...formData, contentImages: [...(formData.contentImages || []), inputImage.trim()] });
            setInputImage('');
        }
    };
    const removeContentImage = (index) => {
        setFormData({ ...formData, contentImages: formData.contentImages.filter((_, i) => i !== index) });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatusMessage({ type: 'info', text: view === 'create' ? 'Publishing...' : 'Updating...' });

        try {
            const result = await addProject(formData);
            if (result.success) {
                setStatusMessage({ type: 'success', text: view === 'create' ? 'Project created!' : 'Project updated!' });
                loadProjects();
                if (view === 'create') handleCancel();
            } else {
                setStatusMessage({ type: 'error', text: 'Operation failed.' });
            }
        } catch (error) {
            console.error(error);
            setStatusMessage({ type: 'error', text: 'Error occurred.' });
        }
    };

    const filteredProjects = projects.filter(p => {
        const query = searchQuery.toLowerCase();
        return p.title?.toLowerCase().includes(query) ||
            p.category?.toLowerCase().includes(query) ||
            p.summary?.toLowerCase().includes(query);
    });

    return (
        <div className={styles.managerContainer}>
            {view === 'list' && (
                <>
                    {/* Modern Header */}
                    <div className={styles.modernPageHeader}>
                        <div>
                            <h2 className={styles.sectionTitle}>Projects</h2>
                            <p className={styles.pageSubtitle}>Showcase your work and portfolio pieces</p>
                        </div>
                        <button onClick={handleCreateClick} className={styles.modernCreateBtn}>
                            <FiPlus size={16} />
                            New Project
                        </button>
                    </div>

                    {/* Search + Stats */}
                    <div className={styles.modernControls}>
                        <div className={styles.searchInput}>
                            <FiSearch size={16} />
                            <input
                                type="text"
                                placeholder="Search projects..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className={styles.blogStats}>
                            <span className={styles.statBadge}>
                                {filteredProjects.length} Project{filteredProjects.length !== 1 ? 's' : ''}
                            </span>
                        </div>
                    </div>

                    {statusMessage.text && (
                        <div className={`${statusMessage.type === 'success' ? styles.successMessage : styles.errorMessage}`}>
                            {statusMessage.text}
                        </div>
                    )}

                    {/* Projects Grid */}
                    {filteredProjects.length === 0 ? (
                        <div className={styles.emptyState}>
                            <FiFolder size={32} />
                            <p>{projects.length === 0 ? 'No projects yet. Create your first one!' : 'No matching projects found.'}</p>
                        </div>
                    ) : (
                        <div className={styles.listGrid}>
                            {filteredProjects.map((p) => (
                                <ContentCard
                                    key={p.slug}
                                    imageUrl={p.heroImage}
                                    badge={p.category}
                                    title={p.title}
                                    metaDate={p.year}
                                    onEdit={() => handleEditClick(p)}
                                    onDelete={() => handleDeleteClick(p.slug)}
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
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                <path d="M15 18l-6-6 6-6" />
                            </svg>
                            Back
                        </button>
                        <div className={styles.modernFormTitle}>
                            <div className={styles.modernFormIconProject} />
                            <h2>{view === 'create' ? 'Create New Project' : 'Edit Project'}</h2>
                        </div>
                        <div className={styles.modernFormPlaceholder} />
                    </div>

                    {statusMessage.text && (
                        <div className={statusMessage.type === 'success' ? styles.successMessage : styles.errorMessage}>
                            {statusMessage.text}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className={styles.formGrid}>
                        {/* Overview Section */}
                        <div className={styles.formSectionTitle}><h3>Overview</h3></div>

                        <div className={`${styles.inputGroup} ${styles.colSpan6}`}>
                            <label className={styles.label}>Title</label>
                            <input name="title" value={formData.title || ''} onChange={handleChange} className={styles.input} placeholder="Project name" required />
                        </div>

                        <div className={`${styles.inputGroup} ${styles.colSpan6}`}>
                            <label className={styles.label}>Slug (ID)</label>
                            <input name="slug" value={formData.slug || ''} onChange={handleChange} className={`${styles.input} ${styles.inputDisabled}`} disabled={view === 'edit'} placeholder="Auto-generated if empty" />
                        </div>

                        <div className={`${styles.inputGroup} ${styles.colSpan4}`}>
                            <label className={styles.label}>Category</label>
                            <input name="category" value={formData.category || ''} onChange={handleChange} className={styles.input} placeholder="e.g. Web App" required />
                        </div>

                        <div className={`${styles.inputGroup} ${styles.colSpan4}`}>
                            <label className={styles.label}>Year</label>
                            <input name="year" value={formData.year || ''} onChange={handleChange} className={styles.input} placeholder="2026" required />
                        </div>

                        <div className={`${styles.inputGroup} ${styles.colSpan4}`}>
                            <label className={styles.label}>Industry</label>
                            <input name="industry" value={formData.industry || ''} onChange={handleChange} className={styles.input} placeholder="e.g. Technology" />
                        </div>

                        <div className={`${styles.inputGroup} ${styles.colSpan12}`}>
                            <label className={styles.label}>Summary</label>
                            <textarea name="summary" value={formData.summary || ''} onChange={handleChange} className={styles.textarea} placeholder="Brief description of the project..." required style={{ minHeight: '120px' }} />
                        </div>

                        <div className={styles.colSpan12}>
                            <label className={styles.label}>Hero Image URL</label>
                            <input name="heroImage" value={formData.heroImage || ''} onChange={handleChange} className={styles.input} placeholder="URL for the hero image" required />
                        </div>

                        {/* Case Study */}
                        <div className={styles.formSectionTitle}><h3>Case Study</h3></div>

                        <div className={`${styles.inputGroup} ${styles.colSpan6}`}>
                            <label className={styles.label}>Problem</label>
                            <textarea name="problem" value={formData.problem || ''} onChange={handleChange} className={styles.textarea} placeholder="What problem does this solve?" style={{ minHeight: '180px' }} required />
                        </div>

                        <div className={`${styles.inputGroup} ${styles.colSpan6}`}>
                            <label className={styles.label}>Solution</label>
                            <textarea name="solution" value={formData.solution || ''} onChange={handleChange} className={styles.textarea} placeholder="How did you solve it?" style={{ minHeight: '180px' }} required />
                        </div>

                        <div className={styles.colSpan12}>
                            <label className={styles.label}>Challenge</label>
                            <textarea name="challenge" value={formData.challenge || ''} onChange={handleChange} className={styles.textarea} placeholder="Any challenges faced during development?" style={{ minHeight: '150px' }} />
                        </div>

                        {/* Team & Links */}
                        <div className={styles.formSectionTitle}><h3>Details</h3></div>

                        <div className={`${styles.inputGroup} ${styles.colSpan6}`}>
                            <label className={styles.label}>Client</label>
                            <input name="client" value={formData.client || ''} onChange={handleChange} className={styles.input} placeholder="Client or personal project" />
                        </div>

                        <div className={`${styles.inputGroup} ${styles.colSpan6}`}>
                            <label className={styles.label}>Duration</label>
                            <input name="duration" value={formData.duration || ''} onChange={handleChange} className={styles.input} placeholder="e.g. 3 months" />
                        </div>

                        <div className={styles.colSpan12}>
                            <label className={styles.label}>Tech Stack</label>
                            <div className={styles.arrayInputContainer}>
                                {formData.techStack?.map((tech, i) => (
                                    <span key={i} className={styles.tag}>
                                        {tech} <span onClick={() => removeTech(i)} className={styles.removeTag}>×</span>
                                    </span>
                                ))}
                                <input
                                    value={inputTech}
                                    onChange={(e) => setInputTech(e.target.value)}
                                    onKeyDown={addTech}
                                    placeholder="Type and press Enter (comma-separated for multiple)"
                                />
                            </div>
                        </div>

                        <div className={`${styles.inputGroup} ${styles.colSpan6}`}>
                            <label className={styles.label}>GitHub URL</label>
                            <input name="github" value={formData.github || ''} onChange={handleChange} className={styles.input} placeholder="https://github.com/..." />
                        </div>

                        <div className={`${styles.inputGroup} ${styles.colSpan6}`}>
                            <label className={styles.label}>Live URL</label>
                            <input name="liveUrl" value={formData.liveUrl || ''} onChange={handleChange} className={styles.input} placeholder="https://..." />
                        </div>

                        <div className={styles.colSpan12}>
                            <label className={styles.label}>Content Images</label>
                            <div className={styles.arrayInputContainer}>
                                {formData.contentImages?.map((img, i) => (
                                    <span key={i} className={styles.imgTag}>
                                        Image {i + 1} <span onClick={() => removeContentImage(i)} className={styles.removeTag}>×</span>
                                    </span>
                                ))}
                                <input
                                    value={inputImage}
                                    onChange={(e) => setInputImage(e.target.value)}
                                    onKeyDown={addContentImage}
                                    placeholder="Add image URL and press Enter"
                                />
                            </div>
                        </div>

                        <div className={styles.colSpan12}>
                            <button type="submit" className={styles.submitButton}>
                                {view === 'create' ? 'Publish Project' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
