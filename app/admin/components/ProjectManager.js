'use client';

import { useState, useEffect } from 'react';
import styles from '../admin.module.css';
import { addProject, fetchProjects, deleteProject } from '@/lib/firestoreUtils';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';

export default function ProjectManager() {
    const [view, setView] = useState('list'); // 'list', 'edit', 'create'
    const [projects, setProjects] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });

    // ... (rest of form state)

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

    // Fetch projects on load
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
        setEditingId(project.slug); // Assuming slug is ID
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

    // Form Handlers
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // ... (rest of array handlers and submit)
    const [inputTech, setInputTech] = useState('');
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

    const [inputImage, setInputImage] = useState('');
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

    // Submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatusMessage({ type: 'info', text: view === 'create' ? 'Publishing...' : 'Updating...' });

        try {
            // Re-using addProject which uses setDoc (upsert)
            // Ideally should check for ID conflicts if creating new
            const result = await addProject(formData);

            if (result.success) {
                setStatusMessage({ type: 'success', text: view === 'create' ? 'Project created!' : 'Project updated!' });
                loadProjects(); // Refresh list
                if (view === 'create') handleCancel(); // Go back to list
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
                        <h2 className={styles.sectionTitle}>Projects</h2>
                        <button onClick={handleCreateClick} className={styles.createButton}>+ New Project</button>
                    </div>

                    {statusMessage.text && (
                        <div className={statusMessage.type === 'success' ? styles.successMessage : (statusMessage.type === 'error' ? styles.errorMessage : styles.infoMessage)} style={{ marginBottom: '1rem' }}>
                            {statusMessage.text}
                        </div>
                    )}

                    <div className={styles.listGrid}>
                        {projects.map((p) => (
                            <div key={p.slug} className={styles.listItem}>
                                <div className={styles.itemImage} style={{ backgroundImage: `url(${p.heroImage})` }}></div>
                                <div className={styles.itemInfo}>
                                    <h3>{p.title}</h3>
                                    <span className={styles.itemMeta}>{p.category} • {p.year}</span>
                                </div>
                                <div className={styles.itemActions}>
                                    <button onClick={() => handleEditClick(p)} className={styles.iconButton} title="Edit"><FiEdit2 size={16} /></button>
                                    <button onClick={() => handleDeleteClick(p.slug)} className={styles.iconButton} style={{ color: '#ff4444' }} title="Delete"><FiTrash2 size={16} /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {(view === 'create' || view === 'edit') && (
                <div className={styles.formContainer}>
                    <div className={styles.formHeader}>
                        <button onClick={handleCancel} className={styles.backButton}>← Back</button>
                        <h2>{view === 'create' ? 'New Project' : 'Edit Project'}</h2>
                    </div>

                    {statusMessage.text && (
                        <div className={statusMessage.type === 'success' ? styles.successMessage : styles.errorMessage}>
                            {statusMessage.text}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className={styles.formGrid}>
                        {/* Same form fields as before, wrapped in new layout */}
                        <div className={`${styles.inputGroup} ${styles.colSpan6}`}>
                            <label className={styles.label}>Title *</label>
                            <input name="title" value={formData.title || ''} onChange={handleChange} className={styles.input} required />
                        </div>

                        <div className={`${styles.inputGroup} ${styles.colSpan6}`}>
                            <label className={styles.label}>Slug (ID) *</label>
                            <input name="slug" value={formData.slug || ''} onChange={handleChange} className={styles.input} disabled={view === 'edit'} placeholder="Auto-generated if empty" />
                        </div>

                        <div className={`${styles.inputGroup} ${styles.colSpan6}`}>
                            <label className={styles.label}>Category *</label>
                            <input name="category" value={formData.category || ''} onChange={handleChange} className={styles.input} required />
                        </div>

                        <div className={`${styles.inputGroup} ${styles.colSpan12}`}>
                            <label className={styles.label}>Summary *</label>
                            <textarea name="summary" value={formData.summary || ''} onChange={handleChange} className={styles.textarea} required />
                        </div>

                        <div className={`${styles.inputGroup} ${styles.colSpan12}`}>
                            <label className={styles.label}>Hero Image URL *</label>
                            <input name="heroImage" value={formData.heroImage || ''} onChange={handleChange} className={styles.input} required />
                        </div>

                        <div className={`${styles.inputGroup} ${styles.colSpan3}`}>
                            <label className={styles.label}>Year *</label>
                            <input name="year" value={formData.year || ''} onChange={handleChange} className={styles.input} required />
                        </div>
                        <div className={`${styles.inputGroup} ${styles.colSpan3}`}>
                            <label className={styles.label}>Industry</label>
                            <input name="industry" value={formData.industry || ''} onChange={handleChange} className={styles.input} />
                        </div>
                        <div className={`${styles.inputGroup} ${styles.colSpan3}`}>
                            <label className={styles.label}>Client</label>
                            <input name="client" value={formData.client || ''} onChange={handleChange} className={styles.input} />
                        </div>
                        <div className={`${styles.inputGroup} ${styles.colSpan3}`}>
                            <label className={styles.label}>Duration</label>
                            <input name="duration" value={formData.duration || ''} onChange={handleChange} className={styles.input} />
                        </div>

                        <div className={`${styles.inputGroup} ${styles.colSpan6}`}>
                            <label className={styles.label}>Problem *</label>
                            <textarea name="problem" value={formData.problem || ''} onChange={handleChange} className={styles.textarea} style={{ minHeight: '200px' }} required />
                        </div>

                        <div className={`${styles.inputGroup} ${styles.colSpan6}`}>
                            <label className={styles.label}>Solution *</label>
                            <textarea name="solution" value={formData.solution || ''} onChange={handleChange} className={styles.textarea} style={{ minHeight: '200px' }} required />
                        </div>

                        <div className={`${styles.inputGroup} ${styles.colSpan12}`}>
                            <label className={styles.label}>Challenge</label>
                            <textarea name="challenge" value={formData.challenge || ''} onChange={handleChange} className={styles.textarea} style={{ minHeight: '150px' }} />
                        </div>

                        <div className={`${styles.inputGroup} ${styles.colSpan6}`}>
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
                                    style={{ background: 'transparent', border: 'none', color: 'white', outline: 'none', flex: 1, minWidth: '100px' }}
                                    placeholder="Add tech..."
                                />
                            </div>
                        </div>

                        <div className={`${styles.inputGroup} ${styles.colSpan6}`}>
                            <label className={styles.label}>Content Images</label>
                            <div className={styles.arrayInputContainer}>
                                {formData.contentImages?.map((img, i) => (
                                    <span key={i} className={styles.tag}>
                                        Image {i + 1} <span onClick={() => removeContentImage(i)} className={styles.removeTag}>×</span>
                                    </span>
                                ))}
                                <input
                                    value={inputImage}
                                    onChange={(e) => setInputImage(e.target.value)}
                                    onKeyDown={addContentImage}
                                    style={{ background: 'transparent', border: 'none', color: 'white', outline: 'none', flex: 1, minWidth: '100px' }}
                                    placeholder="Add URL..."
                                />
                            </div>
                        </div>

                        <div className={`${styles.inputGroup} ${styles.colSpan6}`}>
                            <label className={styles.label}>GitHub URL</label>
                            <input name="github" value={formData.github || ''} onChange={handleChange} className={styles.input} />
                        </div>

                        <div className={`${styles.inputGroup} ${styles.colSpan6}`}>
                            <label className={styles.label}>Live URL</label>
                            <input name="liveUrl" value={formData.liveUrl || ''} onChange={handleChange} className={styles.input} />
                        </div>

                        <div className={styles.colSpan12}>
                            <button type="submit" className={styles.button} style={{ width: '100%' }}>
                                {view === 'create' ? 'Publish Project' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
