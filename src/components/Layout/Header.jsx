import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../contexts/AppContext';
import styles from './Header.module.css';
import { IconSearch } from '../Common/Icons';

export default function Header() {
    const { searchQuery, setSearchQuery, activeTab } = useApp();
    const [time, setTime] = useState(new Date());

    const headerData = useMemo(() => {
        const data = {
            analytics: { title: 'Analytics', subtitle: 'Global performance metrics and health insights' },
            tasks: { title: 'Todo List', subtitle: 'The ultimate dashboard for your daily execution' },
            schedules: { title: 'Schedules', subtitle: 'Design your routines and track monthly milestones' },
            tracker: { title: 'Time Tracker', subtitle: 'Real-time focus and activity logging' },
            settings: { title: 'Settings', subtitle: 'Customize, modularize, and synchronize your environment' },
            profile: { title: 'Profile', subtitle: 'Manage your professional focus profile' }
        };
        return data[activeTab] || { title: 'TimeLedger', subtitle: 'Master your mission' };
    }, [activeTab]);

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const formatDate = (date) => {
        return date.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });
    };

    return (
        <header className={styles.header}>
            <div className={styles.left}>
                <h1 className={styles.title}>{headerData.title}</h1>
                <p className={styles.subtitle}>{headerData.subtitle}</p>
            </div>

            <div className={styles.center}>
                <div className={styles.searchBar}>
                    <span className={styles.searchIcon}>
                        <IconSearch size={18} />
                    </span>
                    <input
                        type="text"
                        placeholder="Search entries, tasks, or projects..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className={styles.right}>
                <div className={styles.timeStack}>
                    <div className={styles.timeContainer}>
                        <span className={styles.time}>{formatTime(time)}</span>
                    </div>
                    <p className={styles.date}>{formatDate(time)}</p>
                </div>
            </div>
        </header>
    );
}
