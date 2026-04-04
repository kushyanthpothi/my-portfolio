'use client';

import { useState, useEffect } from 'react';
import styles from '../admin.module.css';
import { fetchExperiences, addExperience, updateExperience, deleteExperience } from '@/lib/firestoreUtils';
import { FiSearch, FiPlus, FiBriefcase, FiEdit2, FiTrash2, FiCalendar, FiMapPin, FiX, FiCheck } from 'react-icons/fi';

export default function ExperienceManager() {
    const [experiences, setExperiences] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [form, setForm] = useState({ role: '', company: '', period: '', desc: '' });
    const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });
    const [deletingId, setDeletingId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => { loadExperiences(); }, []);

    useEffect(() => {
        if (statusMessage.text) {
            const timer = setTimeout(() => setStatusMessage({ type: '', text: '' }), 3000);
            return () => clearTimeout(timer);
        }
    }, [statusMessage]);

    const loadExperiences = async () => {
        const data = await fetchExperiences();
        setExperiences(data.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)));
    };

    const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.role || !form.company || !form.period) {
            setStatusMessage({ type: 'error', text: 'Please fill in all required fields.' });
            return;
        }
        setIsLoading(true);
        setStatusMessage({ type: 'info', text: editingId ? 'Updating...' : 'Adding...' });
        try {
            const result = editingId
                ? await updateExperience(editingId, form)
                : await addExperience(form);
            if (result.success) {
                setStatusMessage({ type: 'success', text: editingId ? 'Experience updated!' : 'Experience added!' });
                resetForm();
                await loadExperiences();
            } else {
                setStatusMessage({ type: 'error', text: 'Failed to save experience.' });
            }
        } catch (error) {
            setStatusMessage({ type: 'error', text: `Error: ${error.message}` });
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (exp) => {
        setForm({ role: exp.role, company: exp.company, period: exp.period, desc: exp.desc });
        setEditingId(exp.id);
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (deletingId === id) {
            const result = await deleteExperience(id);
            if (result.success) {
                setStatusMessage({ type: 'success', text: 'Experience deleted!' });
                await loadExperiences();
            }
            setDeletingId(null);
        } else {
            setDeletingId(id);
            // Auto-cancel after 3s
            setTimeout(() => setDeletingId(prev => prev === id ? null : prev), 3000);
        }
    };

    const resetForm = () => {
        setForm({ role: '', company: '', period: '', desc: '' });
        setEditingId(null);
        setShowForm(false);
    };

    const filtered = experiences.filter(exp => {
        const q = searchQuery.toLowerCase();
        return exp.role?.toLowerCase().includes(q) || exp.company?.toLowerCase().includes(q) || exp.desc?.toLowerCase().includes(q);
    });

    if (showForm) {
        return (
            <div className={styles.managerContainer}>
                <div className={styles.expFormWrapper}>
                    {/* Form Header */}
                    <div className={styles.expFormHeader}>
                        <button onClick={resetForm} className={styles.cancelBtn}>
                            <FiX size={14} />
                            {editingId ? 'Cancel Edit' : 'Cancel'}
                        </button>
                        <div className={styles.expFormTitleGroup}>
                            <div className={styles.expFormIconBadge}>
                                <FiBriefcase size={18} />
                            </div>
                            <h2 className={styles.expFormTitle}>{editingId ? 'Edit Experience' : 'New Experience'}</h2>
                        </div>
                    </div>

                    {statusMessage.text && (
                        <div className={statusMessage.type === 'success' ? styles.successMessage : statusMessage.type === 'error' ? styles.errorMessage : styles.infoMessage}>
                            {statusMessage.text}
                        </div>
                    )}

                    <div className={styles.expFormCard}>
                        <form onSubmit={handleSubmit} className={styles.expForm}>
                            <div className={styles.expFormSection}>
                                <p className={styles.expFormSectionLabel}>Basic Info</p>
                                <div className={styles.expFormRow}>
                                    <div className={styles.expField}>
                                        <label className={styles.expLabel}>Role / Position <span className={styles.requiredStar}>*</span></label>
                                        <input
                                            name="role"
                                            value={form.role}
                                            onChange={handleChange}
                                            className={styles.expInput}
                                            placeholder="e.g., Software Engineer"
                                            required
                                        />
                                    </div>
                                    <div className={styles.expField}>
                                        <label className={styles.expLabel}>Company <span className={styles.requiredStar}>*</span></label>
                                        <input
                                            name="company"
                                            value={form.company}
                                            onChange={handleChange}
                                            className={styles.expInput}
                                            placeholder="e.g., Google"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className={styles.expFormSection}>
                                <p className={styles.expFormSectionLabel}>Timeline</p>
                                <div className={styles.expField}>
                                    <label className={styles.expLabel}>Period <span className={styles.requiredStar}>*</span></label>
                                    <input
                                        name="period"
                                        value={form.period}
                                        onChange={handleChange}
                                        className={styles.expInput}
                                        placeholder="e.g., Jun 2023 – Present"
                                        required
                                    />
                                </div>
                            </div>

                            <div className={styles.expFormSection}>
                                <p className={styles.expFormSectionLabel}>Details</p>
                                <div className={styles.expField}>
                                    <label className={styles.expLabel}>Description</label>
                                    <textarea
                                        name="desc"
                                        value={form.desc}
                                        onChange={handleChange}
                                        className={styles.expTextarea}
                                        placeholder="Describe your key responsibilities and achievements..."
                                    />
                                </div>
                            </div>

                            <button type="submit" className={styles.expSubmitBtn} disabled={isLoading}>
                                {isLoading ? (
                                    <span className={styles.btnSpinner} />
                                ) : (
                                    <FiCheck size={16} />
                                )}
                                {editingId ? 'Update Experience' : 'Add Experience'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.managerContainer}>
            {/* Page Header */}
            <div className={styles.modernPageHeader}>
                <div className={styles.expHeaderLeft}>
                    <div className={styles.expHeaderIcon}>
                        <FiBriefcase size={20} />
                    </div>
                    <div>
                        <h2 className={styles.sectionTitle}>Experiences</h2>
                        <p className={styles.pageSubtitle}>Your professional journey and career highlights</p>
                    </div>
                </div>
                <button onClick={() => setShowForm(true)} className={styles.modernCreateBtn}>
                    <FiPlus size={15} /> New Experience
                </button>
            </div>

            {/* Controls */}
            <div className={styles.modernControls}>
                <div className={styles.searchInput}>
                    <FiSearch size={15} />
                    <input
                        type="text"
                        placeholder="Search experiences..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className={styles.blogStats}>
                    <span className={styles.statBadge}>
                        {filtered.length} of {experiences.length} entries
                    </span>
                </div>
            </div>

            {/* Status Message */}
            {statusMessage.text && (
                <div className={statusMessage.type === 'success' ? styles.successMessage : styles.errorMessage}>
                    {statusMessage.text}
                </div>
            )}

            {/* Experience List */}
            {filtered.length === 0 ? (
                <div className={styles.emptyState}>
                    <div className={styles.emptyStateIcon}>
                        <FiBriefcase size={28} />
                    </div>
                    <p className={styles.emptyStateTitle}>
                        {experiences.length === 0 ? 'No experiences yet' : 'No results found'}
                    </p>
                    <p className={styles.emptyStateSubtitle}>
                        {experiences.length === 0
                            ? 'Add your first experience to showcase your professional journey.'
                            : `No experiences match "${searchQuery}". Try a different search term.`}
                    </p>
                    {experiences.length === 0 && (
                        <button onClick={() => setShowForm(true)} className={styles.modernCreateBtn} style={{ marginTop: '1rem' }}>
                            <FiPlus size={15} /> Add First Experience
                        </button>
                    )}
                </div>
            ) : (
                <div className={styles.expTimeline}>
                    {filtered.map((exp, index) => (
                        <div key={exp.id} className={`${styles.expTimelineItem} ${deletingId === exp.id ? styles.expTimelineItemDeleting : ''}`}>
                            {/* Timeline connector */}
                            <div className={styles.expTimelineConnector}>
                                <div className={styles.expTimelineDot}>
                                    <span>{index + 1}</span>
                                </div>
                                {index < filtered.length - 1 && <div className={styles.expTimelineLine} />}
                            </div>

                            {/* Card */}
                            <div className={styles.expTimelineCard}>
                                <div className={styles.expTimelineCardInner}>
                                    {/* Top row: role + actions */}
                                    <div className={styles.expCardHeaderRow}>
                                        <h3 className={styles.expCardTitle}>{exp.role}</h3>
                                        <div className={styles.expCardActions}>
                                            <button
                                                onClick={() => handleEdit(exp)}
                                                className={styles.expEditBtn}
                                                title="Edit"
                                            >
                                                <FiEdit2 size={13} />
                                                <span>Edit</span>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(exp.id)}
                                                className={`${styles.expDeleteBtn} ${deletingId === exp.id ? styles.expDeleteBtnConfirm : ''}`}
                                                title={deletingId === exp.id ? 'Click again to confirm' : 'Delete'}
                                            >
                                                <FiTrash2 size={13} />
                                                <span>{deletingId === exp.id ? 'Confirm?' : 'Delete'}</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Meta row */}
                                    <div className={styles.expCardMetaRow}>
                                        <span className={styles.expCardCompanyBadge}>
                                            <FiMapPin size={11} />
                                            {exp.company}
                                        </span>
                                        <span className={styles.expCardPeriodBadge}>
                                            <FiCalendar size={11} />
                                            {exp.period}
                                        </span>
                                    </div>

                                    {/* Description */}
                                    {exp.desc && (
                                        <p className={styles.expCardDescription}>{exp.desc}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
