'use client';

import styles from '../admin.module.css';
import { FiLayout, FiFolder, FiFileText, FiBriefcase, FiCpu, FiLogOut } from 'react-icons/fi';

export default function AdminSidebar({ activeView, setActiveView, onLogout }) {
    const menuItems = [
        { id: 'dashboard', label: 'Overview', icon: FiLayout },
        { id: 'projects', label: 'Projects', icon: FiFolder },
        { id: 'blogs', label: 'Blogs', icon: FiFileText },
        { id: 'experiences', label: 'Experiences', icon: FiBriefcase },
        { id: 'resume', label: 'Resume', icon: FiFileText },
        { id: 'ai-automation', label: 'AI Automation', icon: FiCpu },
    ];

    return (
        <aside className={styles.sidebar}>
            <div className={styles.sidebarHeader}>
                <div className={styles.sidebarLogo}>ADMIN</div>
            </div>

            <nav className={styles.sidebarNav}>
                {menuItems.map((item) => {
                    const IconComponent = item.icon;
                    return (
                        <button
                            key={item.id}
                            className={`${styles.sidebarItem} ${activeView === item.id ? styles.sidebarItemActive : ''}`}
                            onClick={() => setActiveView(item.id)}
                        >
                            <span className={styles.itemIcon}><IconComponent size={18} /></span>
                            <span className={styles.itemLabel}>{item.label}</span>
                        </button>
                    );
                })}
            </nav>

            <div className={styles.sidebarFooter}>
                <button onClick={onLogout} className={styles.sidebarLogout}>
                    <span className={styles.itemIcon}><FiLogOut size={18} /></span>
                    <span className={styles.itemLabel}>Logout</span>
                </button>
            </div>
        </aside>
    );
}
