'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { useAuth, AuthProvider } from '@/lib/AuthContext';
import styles from './admin.module.css';
import AdminSidebar from './components/AdminSidebar';

function AdminContent({ children }) {
    const pathname = usePathname();
    const router = useRouter();
    const { user, login, logout, loading } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const hasRedirected = useRef(false);

    const { motion } = require('framer-motion');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            setLoginError('');
        } catch (error) {
            setLoginError('Invalid credentials. Access denied.');
        }
    };

    useEffect(() => {
        if (user && !hasRedirected.current) {
            hasRedirected.current = true;
            const redirectUrl = localStorage.getItem('adminRedirect');
            localStorage.removeItem('adminRedirect');

            const isRelativePath = (url) => /^\/[^/\\]/.test(url) || url === '/';
            if (redirectUrl && redirectUrl !== '/admin' && isRelativePath(redirectUrl)) {
                router.replace(redirectUrl);
            }
        }
    }, [user, router]);

    const handleLogout = async () => {
        localStorage.setItem('adminRedirect', pathname);
        await logout();
        router.push('/admin');
    };

    if (loading) {
        return <div className={styles.loginWrapper}><div className={styles.loader}></div></div>;
    }

    if (!user) {
        return (
            <main className={styles.loginSplitWrapper}>
                {/* Left animated panel */}
                <div className={styles.loginAnimPanel}>
                    {/* Animated background orbs */}
                    <div className={styles.animOrb1} />
                    <div className={styles.animOrb2} />
                    <div className={styles.animOrb3} />

                    {/* Grid overlay */}
                    <div className={styles.animGridBg} />

                    {/* Orbit rings */}
                    <div className={styles.orbitRing1}>
                        <div className={styles.orbitDot1} />
                    </div>
                    <div className={styles.orbitRing2}>
                        <div className={styles.orbitDot2} />
                    </div>
                    <div className={styles.orbitRing3}>
                        <div className={styles.orbitDot3} />
                    </div>

                    {/* Center content */}
                    <div className={styles.animContent}>
                        <div className={styles.animLogoWrapper}>
                            <div className={styles.animLogo}>
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#FACC15" strokeWidth="1.5">
                                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                                </svg>
                            </div>
                        </div>
                        <h1 className={styles.animTitle}>Portfolio<br />Admin</h1>
                        <p className={styles.animSubtitle}>
                            Your creative command center. Manage projects, craft blog posts, and track your growth — all in one place.
                        </p>

                        <div className={styles.animFeatures}>
                            {['Manage Projects & Blogs', 'AI-Powered Content', 'Real-time Analytics'].map((feat, i) => (
                                <div key={i} className={styles.animFeatureItem} style={{ animationDelay: `${i * 0.15}s` }}>
                                    <div className={styles.animFeatureDot} />
                                    <span>{feat}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Floating particles */}
                    {[...Array(8)].map((_, i) => (
                        <div
                            key={i}
                            className={styles.floatingParticle}
                            style={{
                                left: `${10 + (i * 11) % 80}%`,
                                top: `${15 + (i * 17) % 70}%`,
                                animationDelay: `${i * 0.4}s`,
                                animationDuration: `${3 + (i % 3)}s`,
                                width: `${3 + (i % 4)}px`,
                                height: `${3 + (i % 4)}px`,
                                opacity: 0.3 + (i % 4) * 0.1,
                            }}
                        />
                    ))}
                </div>

                {/* Right login form panel */}
                <div className={styles.loginFormPanel}>
                    <motion.div
                        className={styles.loginCard}
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15 }}
                            className={styles.loginIcon}
                        >
                            <div className={styles.loginIconInner} />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className={styles.loginTextBlock}
                        >
                            <h1 className={styles.title}>Welcome Back</h1>
                            <p className={styles.subtitle}>Sign in to continue to your admin dashboard</p>
                        </motion.div>

                        <form onSubmit={handleLogin} className={styles.form}>
                            <div className={styles.loginInputWrapper}>
                                <svg className={styles.loginInputIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <rect x="2" y="4" width="20" height="16" rx="3" />
                                    <path d="M22 4L12 13L2 4" />
                                </svg>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={styles.loginInput}
                                    placeholder="name@example.com"
                                    required
                                />
                            </div>

                            <div className={styles.loginInputWrapper}>
                                <svg className={styles.loginInputIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <rect x="3" y="11" width="18" height="11" rx="2" />
                                    <path d="M7 11V7a5 5 0 0110 0v4" />
                                </svg>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className={styles.loginInput}
                                    placeholder="Password"
                                    required
                                />
                                <button
                                    type="button"
                                    className={styles.passwordToggle}
                                    onClick={() => setShowPassword(!showPassword)}
                                    tabIndex={-1}
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        {showPassword ? (
                                            <>
                                                <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
                                                <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
                                                <line x1="1" y1="1" x2="23" y2="23" />
                                            </>
                                        ) : (
                                            <>
                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                                <circle cx="12" cy="12" r="3" />
                                            </>
                                        )}
                                    </svg>
                                </button>
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
                                className={styles.loginSubmitBtn}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                Sign In
                            </motion.button>
                        </form>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.35 }}
                            className={styles.loginFooter}
                        >
                            Restricted access · Authorized personnel only
                        </motion.div>
                    </motion.div>
                </div>
            </main>
        );
    }

    const isPreviewPage = pathname.includes('/preview');

    if (isPreviewPage) {
        return <>{children}</>;
    }

    return (
        <div className={styles.dashboardLayout}>
            <AdminSidebar pathname={pathname} onLogout={handleLogout} />
            <main className={styles.mainContent}>
                {children}
            </main>
        </div>
    );
}

export default function AdminLayout({ children }) {
    return (
        <AuthProvider>
            <AdminContent>{children}</AdminContent>
        </AuthProvider>
    );
}
