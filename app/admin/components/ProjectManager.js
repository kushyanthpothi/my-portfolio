'use client';

import { useState, useEffect, useRef } from 'react';
import styles from '../admin.module.css';
import { addProject, fetchProjects, deleteProject } from '@/lib/firestoreUtils';
import { ContentCard } from './ContentCard';
import { FiPlus, FiSearch, FiFolder, FiEdit2, FiTrash2, FiEye, FiEyeOff, FiExternalLink } from 'react-icons/fi';
import { IoSparkles } from 'react-icons/io5';
import { useAuth } from '@/lib/AuthContext';
import ProjectClient from '../../projects/[slug]/ProjectClient';

export default function ProjectManager() {
    const [view, setView] = useState('list');
    const [projects, setProjects] = useState([]);
    const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });
    const [searchQuery, setSearchQuery] = useState('');
    const [inputTech, setInputTech] = useState('');
    const [inputImage, setInputImage] = useState('');
    const [githubInput, setGithubInput] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [isCreationModalOpen, setIsCreationModalOpen] = useState(false);
    const [isGithubModalOpen, setIsGithubModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('editor');
    const { user } = useAuth();

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

    // BroadcastChannel for reliable cross-tab live preview
    const previewChannel = useRef(null);
    useEffect(() => {
        previewChannel.current = new BroadcastChannel('livePreview_project');
        return () => previewChannel.current?.close();
    }, []);

    useEffect(() => {
        if ((view === 'create' || view === 'edit') && previewChannel.current) {
            previewChannel.current.postMessage(formData);
        }
    }, [formData, view]);

    const loadProjects = async () => {
        try {
            const data = await fetchProjects();
            setProjects(data);
        } catch (error) {
            console.error("Error loading projects:", error);
        }
    };

    const handleCreateClick = () => {
        setIsCreationModalOpen(true);
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
        setActiveTab('editor');
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

    const handleGithubGenerate = async () => {
        if (!githubInput.trim()) {
            setStatusMessage({ type: 'error', text: 'Please enter a GitHub URL' });
            return;
        }

        setIsGenerating(true);
        setStatusMessage({ type: 'info', text: 'Fetching README and generating project details...' });

        try {
            // Get the current user's ID token for authentication
            const token = await user.getIdToken();

            const response = await fetch('/api/generate-project', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ githubUrl: githubInput })
            });

            const result = await response.json();

            if (result.success) {
                const generatedData = result.data;
                setStatusMessage({ type: 'success', text: 'Content generated! You can now edit it.' });
                setFormData(generatedData);
                setView('create');
                setIsGithubModalOpen(false);
                setGithubInput('');
            } else {
                setStatusMessage({ type: 'error', text: result.error || 'Failed to generate project.' });
            }
        } catch (error) {
            console.error(error);
            setStatusMessage({ type: 'error', text: 'An unexpected error occurred.' });
        } finally {
            setIsGenerating(false);
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

                    {/* Search + Stats + AI Import */}
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

                        <button
                            type="button"
                            className={styles.livePreviewBtn}
                            onClick={() => {
                                const encoded = btoa(encodeURIComponent(JSON.stringify(formData)));
                                window.open(`/admin/preview/project?data=${encoded}`, '_blank');
                            }}
                        >
                            <FiExternalLink size={14} />
                            Live Preview
                        </button>
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
                                {/* Overview */}
                                <div className={styles.editorSectionTitle}>Overview</div>
                                <div className={styles.editorFieldRow}>
                                    <div className={styles.editorFieldGroup}>
                                        <label className={styles.editorLabel}>Title <span style={{color:'#e63946'}}>*</span></label>
                                        <input name="title" value={formData.title || ''} onChange={handleChange} className={styles.editorInput} placeholder="Project name" required />
                                    </div>
                                    <div className={styles.editorFieldGroup} style={{ maxWidth: '220px' }}>
                                        <label className={styles.editorLabel}>Slug (ID)</label>
                                        <input name="slug" value={formData.slug || ''} onChange={handleChange} className={`${styles.editorInput} ${view === 'edit' ? styles.editorInputDisabled : ''}`} disabled={view === 'edit'} placeholder="auto-generated" />
                                    </div>
                                </div>

                                <div className={styles.editorFieldRow}>
                                    <div className={styles.editorFieldGroup} style={{ maxWidth: '200px' }}>
                                        <label className={styles.editorLabel}>Category <span style={{color:'#e63946'}}>*</span></label>
                                        <input name="category" value={formData.category || ''} onChange={handleChange} className={styles.editorInput} placeholder="e.g. Web App" required />
                                    </div>
                                    <div className={styles.editorFieldGroup} style={{ maxWidth: '140px' }}>
                                        <label className={styles.editorLabel}>Year <span style={{color:'#e63946'}}>*</span></label>
                                        <input name="year" value={formData.year || ''} onChange={handleChange} className={styles.editorInput} placeholder="2026" required />
                                    </div>
                                    <div className={styles.editorFieldGroup}>
                                        <label className={styles.editorLabel}>Industry</label>
                                        <input name="industry" value={formData.industry || ''} onChange={handleChange} className={styles.editorInput} placeholder="e.g. Technology" />
                                    </div>
                                </div>

                                <div className={styles.editorFieldGroup}>
                                    <label className={styles.editorLabel}>Summary <span style={{color:'#e63946'}}>*</span></label>
                                    <textarea name="summary" value={formData.summary || ''} onChange={handleChange} className={styles.editorTextarea} placeholder="Brief description of the project..." required style={{ minHeight: '100px' }} />
                                </div>

                                <div className={styles.editorFieldGroup}>
                                    <label className={styles.editorLabel}>Hero Image URL <span style={{color:'#e63946'}}>*</span></label>
                                    <div className={styles.editorImageInputRow}>
                                        <input name="heroImage" value={formData.heroImage || ''} onChange={handleChange} className={styles.editorInput} placeholder="https://..." required />
                                        {formData.heroImage && (
                                            <img src={formData.heroImage} alt="thumb" className={styles.editorImageThumb} onError={e => e.target.style.display='none'} />
                                        )}
                                    </div>
                                </div>

                                {/* Case Study */}
                                <div className={styles.editorSectionTitle}>Case Study</div>
                                <div className={styles.editorFieldRow}>
                                    <div className={styles.editorFieldGroup}>
                                        <label className={styles.editorLabel}>Problem <span style={{color:'#e63946'}}>*</span></label>
                                        <textarea name="problem" value={formData.problem || ''} onChange={handleChange} className={styles.editorTextarea} placeholder="What problem does this solve?" required style={{ minHeight: '160px' }} />
                                    </div>
                                    <div className={styles.editorFieldGroup}>
                                        <label className={styles.editorLabel}>Solution <span style={{color:'#e63946'}}>*</span></label>
                                        <textarea name="solution" value={formData.solution || ''} onChange={handleChange} className={styles.editorTextarea} placeholder="How did you solve it?" required style={{ minHeight: '160px' }} />
                                    </div>
                                </div>
                                <div className={styles.editorFieldGroup}>
                                    <label className={styles.editorLabel}>Challenge</label>
                                    <textarea name="challenge" value={formData.challenge || ''} onChange={handleChange} className={styles.editorTextarea} placeholder="Challenges faced during development..." style={{ minHeight: '120px' }} />
                                </div>

                                {/* Details */}
                                <div className={styles.editorSectionTitle}>Details & Links</div>
                                <div className={styles.editorFieldRow}>
                                    <div className={styles.editorFieldGroup}>
                                        <label className={styles.editorLabel}>Client</label>
                                        <input name="client" value={formData.client || ''} onChange={handleChange} className={styles.editorInput} placeholder="Client or personal project" />
                                    </div>
                                    <div className={styles.editorFieldGroup}>
                                        <label className={styles.editorLabel}>Duration</label>
                                        <input name="duration" value={formData.duration || ''} onChange={handleChange} className={styles.editorInput} placeholder="e.g. 3 months" />
                                    </div>
                                </div>
                                <div className={styles.editorFieldRow}>
                                    <div className={styles.editorFieldGroup}>
                                        <label className={styles.editorLabel}>GitHub URL</label>
                                        <input name="github" value={formData.github || ''} onChange={handleChange} className={styles.editorInput} placeholder="https://github.com/..." />
                                    </div>
                                    <div className={styles.editorFieldGroup}>
                                        <label className={styles.editorLabel}>Live URL</label>
                                        <input name="liveUrl" value={formData.liveUrl || ''} onChange={handleChange} className={styles.editorInput} placeholder="https://..." />
                                    </div>
                                </div>

                                {/* Tech Stack */}
                                <div className={styles.editorFieldGroup}>
                                    <label className={styles.editorLabel}>Tech Stack</label>
                                    <div className={styles.arrayInputContainer}>
                                        {formData.techStack?.map((tech, i) => (
                                            <span key={i} className={styles.tag}>
                                                {tech} <span onClick={() => removeTech(i)} className={styles.removeTag}>×</span>
                                            </span>
                                        ))}
                                        <input value={inputTech} onChange={(e) => setInputTech(e.target.value)} onKeyDown={addTech} placeholder="Type and press Enter" />
                                    </div>
                                </div>

                                {/* Content Images */}
                                <div className={styles.editorFieldGroup}>
                                    <label className={styles.editorLabel}>Content Images</label>
                                    <div className={styles.arrayInputContainer}>
                                        {formData.contentImages?.map((img, i) => (
                                            <span key={i} className={styles.imgTag}>
                                                Image {i + 1} <span onClick={() => removeContentImage(i)} className={styles.removeTag}>×</span>
                                            </span>
                                        ))}
                                        <input value={inputImage} onChange={(e) => setInputImage(e.target.value)} onKeyDown={addContentImage} placeholder="Add image URL and press Enter" />
                                    </div>
                                </div>

                                <div className={styles.editorSubmitRow}>
                                    <button type="button" className={styles.editorCancelBtn} onClick={handleCancel}>Cancel</button>
                                    <button type="submit" className={styles.editorSubmitBtn}>
                                        {view === 'create' ? '✦ Publish Project' : '✦ Save Changes'}
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* === PREVIEW TAB === */}
                        {activeTab === 'preview' && (
                            <div className={styles.fullWidthPreview}>
                                <ProjectClient initialProject={formData} isPreview={true} />
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* AI Generation Modal (GitHub) */}
            {isGithubModalOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <div className={styles.modalTitle}>Generate Project from GitHub</div>
                        <p className={styles.modalSubtitle}>Enter a GitHub repository URL. AI will parse the README and automatically structure a project showcase.</p>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <input
                                type="text"
                                placeholder="https://github.com/username/repository"
                                value={githubInput}
                                onChange={(e) => setGithubInput(e.target.value)}
                                className={styles.input}
                                disabled={isGenerating}
                            />
                            
                            <div className={styles.modalActions}>
                                <button 
                                    type="button" 
                                    className={styles.modalCancelBtn}
                                    onClick={() => setIsGithubModalOpen(false)}
                                    disabled={isGenerating}
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={handleGithubGenerate} 
                                    className={styles.sparkleBtn}
                                    disabled={isGenerating || !githubInput.trim()}
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
                        </div>
                    </div>
                </div>
            )}

            {/* Creation Method Modal */}
            {isCreationModalOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <div className={styles.modalTitle}>Create New Project</div>
                        <p className={styles.modalSubtitle}>How would you like to create your new project?</p>
                        
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
                                    setIsGithubModalOpen(true);
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
