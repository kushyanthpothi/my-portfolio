'use client';

import { usePathname, useRouter } from 'next/navigation';
import styles from '../admin.module.css';
import { FiLayout, FiFolder, FiFileText, FiBriefcase, FiCpu, FiLogOut } from 'react-icons/fi';

const menuItems = [
    { path: '/admin', label: 'Overview', icon: FiLayout },
    { path: '/admin/projects', label: 'Projects', icon: FiFolder },
    { path: '/admin/blogs', label: 'Blogs', icon: FiFileText },
    { path: '/admin/experiences', label: 'Experiences', icon: FiBriefcase },
    { path: '/admin/ai-automation', label: 'AI Automation', icon: FiCpu },
];

export default function AdminSidebar({ onLogout }) {
    const pathname = usePathname();
    const router = useRouter();

    const isActive = (path) => {
        if (path === '/admin') return pathname === '/admin';
        return pathname === path || pathname.startsWith(path + '/');
    };

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
                            key={item.path}
                            className={`${styles.sidebarItem} ${isActive(item.path) ? styles.sidebarItemActive : ''}`}
                            onClick={() => router.push(item.path)}
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
