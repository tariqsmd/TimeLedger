import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../contexts/AppContext';
import styles from './Header.module.css';
import { IconSearch, IconPlus } from '../Common/Icons';

export default function Header() {
    const {
        searchQuery,
        setSearchQuery,
        activeTab,
        viewMode,
        setViewMode,
        sortBy,
        setSortBy,
        groupBy,
        setGroupBy,
        setIsTodoModalOpen
    } = useApp();

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
            <div className={styles.topRow}>
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
            </div>

            {/* Dynamic Toolbar for Tasks */}
            {activeTab === 'tasks' && (
                <div className={styles.toolbarRow}>
                    <button className={styles.btnFullAdd} onClick={() => setIsTodoModalOpen(true)}>
                        <IconPlus size={18} />
                        <span>Add Task</span>
                    </button>

                    <div className={styles.viewWrapper}>
                        <div className={styles.viewToggle}>
                            <button className={viewMode === 'list' ? styles.activeView : ''} onClick={() => setViewMode('list')} title="List Layout">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></svg>
                            </button>
                            <button className={viewMode === 'grid' ? styles.activeView : ''} onClick={() => setViewMode('grid')} title="Grid Layout">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
                            </button>
                            <button className={viewMode === 'kanban' ? styles.activeView : ''} onClick={() => setViewMode('kanban')} title="Kanban Board">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><line x1="9" y1="3" x2="9" y2="21" /></svg>
                            </button>
                            <button className={viewMode === 'timeline' ? styles.activeView : ''} onClick={() => setViewMode('timeline')} title="Timeline View">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                            </button>
                            <button className={viewMode === 'focus' ? styles.activeView : ''} onClick={() => setViewMode('focus')} title="Focus Mode">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>
                            </button>
                            <button className={viewMode === 'compact' ? styles.activeView : ''} onClick={() => setViewMode('compact')} title="Compact Mode">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="21" y1="12" x2="9" y2="12" /><polyline points="15 18 21 12 15 6" /><path d="M3 12h0" /></svg>
                            </button>
                        </div>

                        <div className={styles.selectGroup}>
                            <select value={groupBy} onChange={(e) => setGroupBy(e.target.value)}>
                                <option value="date">Group by Date</option>
                                <option value="title">Group by Project</option>
                            </select>
                            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                                <option value="manual">Manual Sort</option>
                                <option value="time">Newest</option>
                                <option value="alphabetical">A-Z</option>
                            </select>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
