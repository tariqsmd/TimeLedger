import React from 'react';
import { useApp } from '../../contexts/AppContext';
import styles from './Sidebar.module.css';

const navItems = [
    { id: 'analytics', label: 'Analytics', icon: '📊' },
    { id: 'tasks', label: 'Todo List', icon: '✅' },
    { id: 'schedules', label: 'Schedules', icon: '📅' },
    { id: 'tracker', label: 'Time Tracker', icon: '⏱️' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
];

export default function Sidebar({ activeTab, onTabChange }) {
    const { userProfile } = useApp();

    return (
        <aside className={styles.sidebar}>
            <div className={styles.logo}>
                <div className={styles.logoIcon}>TL</div>
                <div className={styles.logoText}>Time<span>Ledger</span></div>
            </div>

            <nav className={styles.nav}>
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        className={`${styles.navItem} ${activeTab === item.id ? styles.active : ''}`}
                        onClick={() => onTabChange(item.id)}
                    >
                        <span className={styles.icon}>{item.icon}</span>
                        <span className={styles.label}>{item.label}</span>
                        {activeTab === item.id && <div className={styles.activeIndicator} />}
                    </button>
                ))}
            </nav>

            <div className={styles.footer}>
                <div
                    className={`${styles.profile} ${activeTab === 'profile' ? styles.activeProfile : ''}`}
                    onClick={() => onTabChange('profile')}
                >
                    <div className={styles.avatar}>{userProfile.avatar || userProfile.name[0]}</div>
                    <div className={styles.profileInfo}>
                        <div className={styles.profileName}>{userProfile.name}</div>
                        <div className={styles.profileStatus}>{userProfile.role}</div>
                    </div>
                </div>
            </div>
        </aside>
    );
}
