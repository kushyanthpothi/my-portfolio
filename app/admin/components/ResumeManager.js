'use client';

import { useState, useEffect } from 'react';
import styles from '../admin.module.css';
import { saveSettings, getSettings } from '@/lib/firestoreUtils';
import { FiUploadCloud, FiFileText, FiCheck, FiRefreshCw } from 'react-icons/fi';

export default function ResumeManager() {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [currentResume, setCurrentResume] = useState(null);
    const [manualUrl, setManualUrl] = useState('');
    const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });
    const [dragActive, setDragActive] = useState(false);

    useEffect(() => {
        loadResumeInfo();
    }, []);

    const loadResumeInfo = async () => {
        const data = await getSettings('profile');
        if (data && data.resumeUrl) {
            setCurrentResume(data.resumeUrl);
            // If it's a regular URL, pre-fill the manual input
            if (data.resumeUrl.startsWith('http')) {
                setManualUrl(data.resumeUrl);
            }
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            validateAndSetFile(e.target.files[0]);
        }
    };

    const validateAndSetFile = (file) => {
        // 500KB limit for Firestore storage (Base64 adds ~33% overhead, keeping us safely under 1MB doc limit)
        const LIMIT_KB = 500;
        if (file.size > LIMIT_KB * 1024) {
            setStatusMessage({
                type: 'error',
                text: `File too large (${Math.round(file.size / 1024)}KB). Limit is ${LIMIT_KB}KB. Please compress it or use a link.`
            });
            return;
        }
        setFile(file);
        setStatusMessage({ type: '', text: '' });
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            validateAndSetFile(e.dataTransfer.files[0]);
        }
    };

    const handleSave = async () => {
        setUploading(true);
        setStatusMessage({ type: 'info', text: 'Saving...' });

        try {
            let downloadURL = currentResume;

            // Priority 1: File Upload (Stored as Base64 in Firestore)
            if (file) {
                const base64 = await new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result);
                    reader.onerror = error => reject(error);
                    reader.readAsDataURL(file);
                });
                downloadURL = base64;
            }
            // Priority 2: Manual URL
            else if (manualUrl) {
                downloadURL = manualUrl;
            }

            if (!downloadURL) {
                setStatusMessage({ type: 'error', text: 'Please upload a file or enter a link.' });
                setUploading(false);
                return;
            }

            // Save to Firestore
            const result = await saveSettings('profile', {
                resumeUrl: downloadURL,
                resumeUpdatedAt: new Date().toISOString(),
                resumeFileName: file ? file.name : 'External Link'
            });

            if (result.success) {
                setCurrentResume(downloadURL);
                setFile(null);
                setStatusMessage({ type: 'success', text: 'Resume updated successfully!' });
            } else {
                setStatusMessage({ type: 'error', text: 'Failed to save settings.' });
            }
        } catch (error) {
            console.error(error);
            setStatusMessage({ type: 'error', text: 'Save failed: ' + error.message });
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className={styles.managerContainer}>
            <div className={styles.managerHeader}>
                <h2 className={styles.sectionTitle}>Resume Management</h2>
            </div>

            {statusMessage.text && (
                <div className={statusMessage.type === 'success' ? styles.successMessage : (statusMessage.type === 'error' ? styles.errorMessage : styles.infoMessage)}>
                    {statusMessage.text}
                </div>
            )}

            <div className={styles.formContainer}>
                <div className={styles.formGrid}>
                    <div className={styles.colSpan6}>
                        <h3 style={{ marginBottom: '1rem' }}>Current Resume</h3>
                        {currentResume ? (
                            <div className={styles.listItem}>
                                <div className={styles.itemInfo} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <FiFileText size={24} color="#ffd700" />
                                    <div>
                                        <h3>Resume</h3>
                                        <span className={styles.itemMeta} style={{ wordBreak: 'break-all', display: 'block', maxWidth: '100%' }}>
                                            {currentResume.startsWith('data:') ? 'Stored in Database (PDF)' : 'External Link'}
                                        </span>
                                        <a
                                            href={currentResume}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{ color: '#ffd700', textDecoration: 'underline', fontSize: '0.9rem' }}
                                            onClick={(e) => {
                                                if (currentResume.startsWith('data:application/pdf')) {
                                                    e.preventDefault();
                                                    try {
                                                        const base64Data = currentResume.split(',')[1];
                                                        const byteCharacters = atob(base64Data);
                                                        const byteNumbers = new Array(byteCharacters.length);
                                                        for (let i = 0; i < byteCharacters.length; i++) {
                                                            byteNumbers[i] = byteCharacters.charCodeAt(i);
                                                        }
                                                        const byteArray = new Uint8Array(byteNumbers);
                                                        const blob = new Blob([byteArray], { type: 'application/pdf' });
                                                        const blobUrl = URL.createObjectURL(blob);
                                                        window.open(blobUrl, '_blank');
                                                    } catch (err) {
                                                        console.error("Error opening PDF blob:", err);
                                                        alert("Could not open PDF. valid Base64?");
                                                    }
                                                }
                                            }}
                                        >
                                            View/Test Link
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className={styles.listItem}>
                                <div className={styles.itemInfo}>
                                    <span className={styles.itemMeta}>No resume set.</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className={styles.colSpan6}>
                        <h3 style={{ marginBottom: '1rem' }}>Update Resume</h3>

                        {/* Option A: File Upload */}
                        <div
                            className={`${styles.uploadBox} ${dragActive ? styles.dragActive : ''}`}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                            style={{ marginBottom: '1.5rem' }}
                        >
                            <input
                                type="file"
                                id="resume-upload"
                                accept=".pdf"
                                onChange={handleFileChange}
                                style={{ display: 'none' }}
                            />
                            <label htmlFor="resume-upload" className={styles.uploadLabel}>
                                {file ? (
                                    <>
                                        <FiCheck size={32} color="#44ff44" />
                                        <p style={{ marginTop: '1rem', color: '#fff' }}>{file.name}</p>
                                        <p style={{ fontSize: '0.8rem' }}>{(file.size / 1024).toFixed(1)} KB</p>
                                    </>
                                ) : (
                                    <>
                                        <FiUploadCloud size={32} />
                                        <p style={{ marginTop: '1rem' }}>Upload PDF (Max 500KB)</p>
                                        <p style={{ fontSize: '0.8rem', color: '#666' }}>Stored directly in database</p>
                                    </>
                                )}
                            </label>
                        </div>

                        {/* Option B: Manual Link */}
                        <div className={styles.inputGroup} style={{ marginBottom: '1rem' }}>
                            <label className={styles.label}>OR Paste Link (Google Drive, Dropbox, etc.)</label>
                            <input
                                type="text"
                                value={manualUrl}
                                onChange={(e) => {
                                    setManualUrl(e.target.value);
                                    setFile(null); // Clear file if typing URL
                                }}
                                className={styles.input}
                                placeholder="https://drive.google.com/..."
                            />
                        </div>

                        <button
                            onClick={handleSave}
                            className={styles.button}
                            style={{ width: '100%' }}
                            disabled={uploading}
                        >
                            {uploading ? <><FiRefreshCw className={styles.spin} /> Saving...</> : 'Save & Publish'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
