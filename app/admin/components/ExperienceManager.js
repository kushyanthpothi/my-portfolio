'use client';

import { useState, useEffect } from 'react';
import styles from '../admin.module.css';
import { fetchExperiences, addExperience, updateExperience, deleteExperience } from '@/lib/firestoreUtils';
import { FiEdit2, FiTrash2, FiPlus, FiSave, FiX } from 'react-icons/fi';

export default function ExperienceManager() {
    const [experiences, setExperiences] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState({
        role: '',
        company: '',
        period: '',
        desc: ''
    });
    const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        loadExperiences();
    }, []);

    const loadExperiences = async () => {
        const data = await fetchExperiences();
        // Sort by createdAt descending (newest first)
        setExperiences(data.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.role || !form.company || !form.period) {
            setStatusMessage({ type: 'error', text: 'Please fill in all required fields.' });
            return;
        }

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
        }
    };

    const handleEdit = (exp) => {
        setForm({
            role: exp.role,
            company: exp.company,
            period: exp.period,
            desc: exp.desc
        });
        setEditingId(exp.id);
        setIsEditing(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this experience?')) return;

        setStatusMessage({ type: 'info', text: 'Deleting...' });
        const result = await deleteExperience(id);

        if (result.success) {
            setStatusMessage({ type: 'success', text: 'Experience deleted!' });
            await loadExperiences();
        } else {
            setStatusMessage({ type: 'error', text: 'Failed to delete experience.' });
        }
    };

    const resetForm = () => {
        setForm({ role: '', company: '', period: '', desc: '' });
        setEditingId(null);
        setIsEditing(false);
    };

    return (
        <div className={styles.managerContainer}>
            <div className={styles.managerHeader}>
                <h2 className={styles.sectionTitle}>Experience Manager</h2>
                <button
                    onClick={() => setIsEditing(!isEditing)}
                    className={styles.button}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                    {isEditing ? <FiX size={16} /> : <FiPlus size={16} />}
                    {isEditing ? 'Cancel' : 'Add New'}
                </button>
            </div>

            {statusMessage.text && (
                <div className={`${styles.statusMessage} ${styles[statusMessage.type]}`}>
                    {statusMessage.text}
                </div>
            )}

            {isEditing && (
                <form onSubmit={handleSubmit} className={styles.formContainer}>
                    <h3>{editingId ? 'Edit Experience' : 'Add New Experience'}</h3>

                    <div className={styles.formGrid}>
                        <div className={`${styles.inputGroup} ${styles.colSpan6}`}>
                            <label className={styles.label}>Role/Position *</label>
                            <input
                                name="role"
                                value={form.role}
                                onChange={handleChange}
                                className={styles.input}
                                placeholder="e.g., Software Development Engineer"
                                required
                            />
                        </div>

                        <div className={`${styles.inputGroup} ${styles.colSpan6}`}>
                            <label className={styles.label}>Company *</label>
                            <input
                                name="company"
                                value={form.company}
                                onChange={handleChange}
                                className={styles.input}
                                placeholder="e.g., Google"
                                required
                            />
                        </div>

                        <div className={`${styles.inputGroup} ${styles.colSpan6}`}>
                            <label className={styles.label}>Period *</label>
                            <input
                                name="period"
                                value={form.period}
                                onChange={handleChange}
                                className={styles.input}
                                placeholder="e.g., 2023 - Present"
                                required
                            />
                        </div>

                        {/* Order field removed as requested */}

                        <div className={`${styles.inputGroup} ${styles.colSpan12}`}>
                            <label className={styles.label}>Description</label>
                            <textarea
                                name="desc"
                                value={form.desc}
                                onChange={handleChange}
                                className={styles.textarea}
                                rows="4"
                                placeholder="Brief description of your role and achievements..."
                            />
                        </div>
                    </div>

                    <div className={styles.formActions}>
                        <button type="submit" className={styles.button} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <FiSave size={16} />
                            {editingId ? 'Update Experience' : 'Add Experience'}
                        </button>
                        <button type="button" onClick={resetForm} className={styles.buttonSecondary}>
                            Cancel
                        </button>
                    </div>
                </form>
            )}

            <div className={styles.listContainer}>
                <h3>All Experiences ({experiences.length})</h3>

                {experiences.length === 0 ? (
                    <p style={{ color: '#888', textAlign: 'center', padding: '2rem' }}>
                        No experiences yet. Click "Add New" to create one.
                    </p>
                ) : (
                    <div className={styles.experienceGrid}>
                        {experiences.map((exp) => (
                            <div key={exp.id} className={styles.experienceCard}>
                                <div className={styles.cardHeader}>
                                    <h4 className={styles.cardTitle}>{exp.role}</h4>
                                    <div className={styles.cardActions}>
                                        <button
                                            onClick={() => handleEdit(exp)}
                                            className={styles.iconButton}
                                            title="Edit"
                                        >
                                            <FiEdit2 size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(exp.id)}
                                            className={styles.iconButtonDanger}
                                            title="Delete"
                                        >
                                            <FiTrash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                                <div className={styles.cardMeta}>
                                    <span className={styles.companyBadge}>{exp.company}</span>
                                    <span className={styles.periodText}>{exp.period}</span>
                                </div>
                                {exp.desc && <p className={styles.cardDesc}>{exp.desc}</p>}
                                <div className={styles.cardFooter}>
                                    Added: {exp.createdAt ? new Date(exp.createdAt).toLocaleDateString() : 'Just now'}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
