'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { getSettings } from '@/lib/firestoreUtils';
import { ArrowLeft, Download, Printer } from 'lucide-react';
import styles from './resume.module.css';

export default function ResumePage() {
    const router = useRouter();
    const iframeRef = useRef(null);
    const [pdfData, setPdfData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchResume = async () => {
            try {
                const profile = await getSettings('profile');
                const url = profile?.resumeUrl;

                if (!url) {
                    setError('No resume found.');
                    setLoading(false);
                    return;
                }

                if (url.startsWith('http')) {
                    window.location.replace(url);
                    return;
                }

                if (url.startsWith('data:application/pdf')) {
                    const base64Data = url.split(',')[1];
                    const byteCharacters = atob(base64Data);
                    const byteNumbers = new Array(byteCharacters.length);
                    for (let i = 0; i < byteCharacters.length; i++) {
                        byteNumbers[i] = byteCharacters.charCodeAt(i);
                    }
                    const byteArray = new Uint8Array(byteNumbers);
                    const file = new File([byteArray], "My_Resume.pdf", { type: 'application/pdf' });
                    const blobUrl = URL.createObjectURL(file);

                    setPdfData(blobUrl);
                    setLoading(false);
                } else {
                    setError('Invalid resume format.');
                    setLoading(false);
                }

            } catch (err) {
                console.error(err);
                setError('Failed to load resume.');
                setLoading(false);
            }
        };

        fetchResume();
    }, []);

    const handlePrint = () => {
        if (iframeRef.current) {
            iframeRef.current.contentWindow.print();
        }
    };

    const handleDownload = () => {
        if (pdfData) {
            const link = document.createElement('a');
            link.href = pdfData;
            link.download = 'Kushyanth_Resume.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const handleBack = () => {
        // If opened in a new tab (history length is 1), try to close it
        if (window.history.length <= 2) {
            window.close();
            // Fallback if window.close() is blocked or fails (delay to allow close to happen)
            setTimeout(() => {
                router.push('/');
            }, 100);
        } else {
            router.back();
        }
    };

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.loader}></div>
                <p>Opening Resume...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.container}>
                <p className={styles.error}>{error}</p>
                <button onClick={handleBack} className={styles.backButton}>Go Back</button>
            </div>
        );
    }

    return (
        <div className={styles.wrapper}>
            {/* Custom Toolbar */}
            <header className={styles.header}>
                <div className={styles.headerLeft}>
                    <button onClick={handleBack} className={styles.iconButton} title="Back">
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className={styles.title}>My Resume</h1>
                </div>

                <div className={styles.headerRight}>
                    <button onClick={handlePrint} className={styles.iconButton} title="Print">
                        <Printer size={20} />
                    </button>
                    <button onClick={handleDownload} className={`${styles.iconButton} ${styles.primaryBtn}`} title="Download">
                        <Download size={20} />
                        <span>Download</span>
                    </button>
                </div>
            </header>

            {/* Hidden Toolbar PDF Viewer */}
            <div className={styles.pdfContainer}>
                <iframe
                    ref={iframeRef}
                    src={`${pdfData}#toolbar=0&navpanes=0`}
                    className={styles.pdfFrame}
                    title="Resume"
                />
            </div>
        </div>
    );
}
