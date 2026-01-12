'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import styles from './admin.module.css';
import AdminSidebar from './components/AdminSidebar';
import ProjectManager from './components/ProjectManager';
import BlogManager from './components/BlogManager';
import AIAutoBlogger from './components/AIAutoBlogger.js';
import ExperienceManager from './components/ExperienceManager';
import Dashboard from './components/Dashboard';

export default function AdminPage() {
    const { user, login, logout, loading } = useAuth();
    const [activeView, setActiveView] = useState('dashboard');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');

    // Import motion dynamically to avoid server-side issues (though this is a client component)
    const { motion } = require('framer-motion');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
        } catch (error) {
            setLoginError('Invalid credentials. Access denied.');
            console.error(error);
        }
    };

    if (loading) {
        return (
            <div className={styles.loginWrapper}>
                <div className={styles.loadingSpinner}></div>
            </div>
        );
    }

    if (!user) {
        return (
            <main className={styles.loginWrapper}>
                <motion.div
                    className={styles.loginCard}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <h1 className={styles.title}>Admin Access</h1>
                        <p className={styles.subtitle}>Secure Gateway</p>
                    </motion.div>

                    <form onSubmit={handleLogin} className={styles.form}>
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={styles.input}
                                placeholder="name@example.com"
                                required
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={styles.input}
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        {loginError && (
                            <motion.div
                                className={styles.errorMessage}
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                            >
                                {loginError}
                            </motion.div>
                        )}

                        <motion.button
                            type="submit"
                            className={styles.button}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            Enter Dashboard
                        </motion.button>
                    </form>
                </motion.div>
            </main>
        );
    }

    return (
        <div className={styles.dashboardLayout}>
            <AdminSidebar
                activeView={activeView}
                setActiveView={setActiveView}
                onLogout={logout}
            />

            <main className={styles.mainContent}>
                {activeView === 'dashboard' && <Dashboard />}

                {activeView === 'projects' && <ProjectManager />}

                {activeView === 'blogs' && <BlogManager />}

                {activeView === 'experiences' && <ExperienceManager />}

                {activeView === 'ai-automation' && <AIAutoBlogger />}
            </main>
        </div>
    );
}
