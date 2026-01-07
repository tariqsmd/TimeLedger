import React, { useMemo, useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import styles from './Sidebar.module.css';
import {
    IconAnalytics, IconTasks, IconSchedule, IconTracker,
    IconSettings, IconClose, IconAppearance, IconModules,
    IconOrganization, IconData, IconGeneral
} from '../Common/Icons';

const allNavItems = [
    { id: 'analytics', label: 'Analytics', icon: <IconAnalytics />, moduleId: 'analytics' },
    { id: 'tasks', label: 'Todo List', icon: <IconTasks />, moduleId: 'todo' },
    { id: 'schedules', label: 'Schedules', icon: <IconSchedule />, moduleId: 'schedule' },
    { id: 'tracker', label: 'Time Tracker', icon: <IconTracker />, moduleId: 'tracker' }
];

const settingsTabs = [
    { id: 'preferences', label: 'General', icon: <IconGeneral /> },
    { id: 'appearance', label: 'Appearance', icon: <IconAppearance /> },
    { id: 'modules', label: 'Features', icon: <IconModules /> },
    { id: 'organization', label: 'Preset Lists', icon: <IconOrganization /> },
    { id: 'data', label: 'DataBase', icon: <IconData /> },
];

export default function Sidebar({ activeTab, onTabChange }) {
    const {
        userProfile, enabledModules,
        activeSettingsTab, setActiveSettingsTab
    } = useApp();

    const [menuMode, setMenuMode] = useState('app');

    useEffect(() => {
        if (activeTab === 'settings') {
            setMenuMode('settings');
        } else {
            setMenuMode('app');
        }
    }, [activeTab]);

    const filteredNavItems = useMemo(() => {
        return allNavItems.filter(item => {
            if (!item.moduleId) return true;
            return enabledModules[item.moduleId];
        });
    }, [enabledModules]);

    const handleSettingsToggle = () => {
        if (menuMode === 'app') {
            setMenuMode('settings');
            onTabChange('settings');
        } else {
            setMenuMode('app');
            onTabChange('analytics');
        }
    };

    return (
        <aside className={styles.sidebar}>
            <div className={styles.sidebarHeader}>
                <div className={styles.logo} onClick={() => { setMenuMode('app'); onTabChange('analytics'); }} style={{ cursor: 'pointer' }}>
                    <div className={styles.logoIcon}>TL</div>
                    <div className={styles.logoText}>Time<span>Ledger</span></div>
                </div>
            </div>

            <div className={styles.menuContainer}>
                <nav className={styles.nav}>
                    <div className={styles.navHeader}>
                        <div className={styles.menuLabel}>
                            {menuMode === 'app' ? 'Main Menu' : 'Settings'}
                        </div>
                        <button
                            className={`${styles.btnSettingsToggle} ${menuMode === 'settings' ? styles.activeSettings : ''}`}
                            onClick={handleSettingsToggle}
                            title={menuMode === 'app' ? "Workspace Settings" : "Close Settings"}
                        >
                            {menuMode === 'app' ? <IconSettings size={16} /> : <IconClose size={16} />}
                        </button>
                    </div>

                    <div className={styles.menuList}>
                        {(menuMode === 'app' ? filteredNavItems : settingsTabs).map((item) => (
                            <button
                                key={item.id}
                                className={`${styles.navItem} ${(menuMode === 'app' ? activeTab === item.id : activeSettingsTab === item.id)
                                    ? styles.active : ''
                                    }`}
                                onClick={() => menuMode === 'app' ? onTabChange(item.id) : setActiveSettingsTab(item.id)}
                            >
                                <span className={styles.icon}>{item.icon}</span>
                                <span className={styles.label}>{item.label}</span>
                                {((menuMode === 'app' ? activeTab === item.id : activeSettingsTab === item.id)) &&
                                    <div className={styles.activeIndicator} />
                                }
                            </button>
                        ))}
                    </div>
                </nav>
            </div>

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
