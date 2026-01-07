import React, { useState, useMemo } from 'react';
import { useApp } from '../../contexts/AppContext';
import ScheduleColumn from './ScheduleColumn';
import styles from './ScheduleView.module.css';

export default function ScheduleView() {
    const {
        customSchedules,
        addScheduleBlock,
        monthlyGoals,
        addMonthlyGoal,
        toggleMonthlyGoal,
        deleteMonthlyGoal,
        searchQuery
    } = useApp();

    const [activeTab, setActiveTab] = useState('daily'); // 'daily' | 'monthly'
    const [activeSubTab, setActiveSubTab] = useState('current');
    const [showAddForm, setShowAddForm] = useState(false);

    // Form state for new block
    const [newBlock, setNewBlock] = useState({
        time: '08:00-09:00',
        activity: '',
        hours: 1,
        category: 'own',
        icon: '🚀'
    });

    // Form state for monthly goal
    const [newGoal, setNewGoal] = useState('');
    const [dueDate, setDueDate] = useState('');

    const schedule = useMemo(() => {
        if (!customSchedules) return null;
        const current = customSchedules[activeSubTab];
        if (!searchQuery.trim()) return current;

        const query = searchQuery.toLowerCase();
        const filterFn = (blocks) => blocks.filter(b =>
            b.activity.toLowerCase().includes(query) ||
            b.category.toLowerCase().includes(query) ||
            b.time.toLowerCase().includes(query)
        );

        return {
            weekday: filterFn(current.weekday),
            weekend: filterFn(current.weekend)
        };
    }, [customSchedules, activeSubTab, searchQuery]);

    const filteredGoals = useMemo(() => {
        if (!searchQuery.trim()) return monthlyGoals;
        const query = searchQuery.toLowerCase();
        return monthlyGoals.filter(g => g.text.toLowerCase().includes(query));
    }, [monthlyGoals, searchQuery]);

    if (!customSchedules) return <div className={styles.loading}>Initializing Workspace...</div>;

    const isOptimized = activeSubTab === 'optimized';

    const handleAddBlock = (e, dayType) => {
        e.preventDefault();
        addScheduleBlock(activeSubTab, dayType, newBlock);
        setShowAddForm(false);
        setNewBlock({ ...newBlock, activity: '' });
    };

    const handleAddGoal = (e) => {
        e.preventDefault();
        if (newGoal.trim()) {
            addMonthlyGoal({
                text: newGoal.trim(),
                dueDate: dueDate || null
            });
            setNewGoal('');
            setDueDate('');
        }
    };

    const formatDueDate = (dateStr) => {
        if (!dateStr) return null;
        const date = new Date(dateStr);
        return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    };

    const getRemainingDays = (dateStr) => {
        if (!dateStr) return null;
        const diff = new Date(dateStr) - new Date();
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
        if (days < 0) return 'Overdue';
        if (days === 0) return 'Today';
        return `${days}d left`;
    };

    return (
        <div className={styles.scheduleView}>
            <div className={styles.tabBar}>
                <div className={styles.mainTabs}>
                    <button
                        className={`${styles.tabLink} ${activeTab === 'daily' ? styles.active : ''}`}
                        onClick={() => setActiveTab('daily')}
                    >
                        Routine Builder
                    </button>
                    <button
                        className={`${styles.tabLink} ${activeTab === 'monthly' ? styles.active : ''}`}
                        onClick={() => setActiveTab('monthly')}
                    >
                        Monthly Objectives
                    </button>
                </div>

                {activeTab === 'daily' && (
                    <div className={styles.subTabs}>
                        <button
                            className={`${styles.subTab} ${activeSubTab === 'current' ? styles.activeSubTab : ''}`}
                            onClick={() => setActiveSubTab('current')}
                        >
                            Standard
                        </button>
                        <button
                            className={`${styles.subTab} ${activeSubTab === 'optimized' ? styles.activeSubTab : ''}`}
                            onClick={() => setActiveSubTab('optimized')}
                        >
                            AI-Optimized
                        </button>
                    </div>
                )}
            </div>

            {activeTab === 'daily' ? (
                <>
                    <div className={styles.toolbar}>
                        <button className={styles.btnAddBlock} onClick={() => setShowAddForm(!showAddForm)}>
                            {showAddForm ? '✕ Close Portal' : '+ Append Routine Block'}
                        </button>
                    </div>

                    {showAddForm && (
                        <div className={styles.addFormCard}>
                            <h3>New Schedule Block</h3>
                            <div className={styles.formGrid}>
                                <input
                                    placeholder="Activity Name"
                                    value={newBlock.activity}
                                    onChange={e => setNewBlock({ ...newBlock, activity: e.target.value })}
                                />
                                <input
                                    placeholder="Time Range (e.g. 09:00-10:00)"
                                    value={newBlock.time}
                                    onChange={e => setNewBlock({ ...newBlock, time: e.target.value })}
                                />
                                <select
                                    value={newBlock.category}
                                    onChange={e => setNewBlock({ ...newBlock, category: e.target.value })}
                                >
                                    <option value="health">💪 Health</option>
                                    <option value="learning">📚 Learning</option>
                                    <option value="company">💼 Company</option>
                                    <option value="own">🚀 Own Projects</option>
                                    <option value="family">👨‍👩‍👧 Family</option>
                                    <option value="rest">🛋️ Rest</option>
                                </select>
                                <div className={styles.formActions}>
                                    <button onClick={(e) => handleAddBlock(e, 'weekday')}>Add to Weekday</button>
                                    <button onClick={(e) => handleAddBlock(e, 'weekend')}>Add to Weekend</button>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className={styles.scheduleGrid}>
                        <div className={styles.colWrapper}>
                            <ScheduleColumn
                                title="Weekdays"
                                subtitle="Primary routine for Mon-Fri"
                                blocks={schedule.weekday}
                                type={activeSubTab}
                                dayType="weekday"
                            />
                        </div>
                        <div className={styles.colWrapper}>
                            <ScheduleColumn
                                title="Weekends"
                                subtitle="Rest & reset period (Sat/Sun)"
                                blocks={schedule.weekend}
                                type={activeSubTab}
                                dayType="weekend"
                            />
                        </div>
                    </div>

                    {(schedule.weekday.length === 0 && schedule.weekend.length === 0 && searchQuery) && (
                        <div className={styles.emptySearch}>
                            <div className={styles.emptyIcon}>🔍</div>
                            <p>No routine blocks match your search.</p>
                        </div>
                    )}
                </>
            ) : (
                <div className={styles.monthlySection}>
                    <div className={styles.monthlyHeader}>
                        <h3>High-Level Monthly Planning</h3>
                        <p>Set overarching goals that span across your daily tracks.</p>
                    </div>

                    <form className={styles.goalForm} onSubmit={handleAddGoal}>
                        <input
                            className={styles.goalTextIn}
                            placeholder="Type a new monthly objective..."
                            value={newGoal}
                            onChange={e => setNewGoal(e.target.value)}
                            required
                        />
                        <div className={styles.dateInputWrapper}>
                            <span className={styles.dateIcon}>📅</span>
                            <input
                                type="date"
                                className={styles.goalDateIn}
                                value={dueDate}
                                onChange={e => setDueDate(e.target.value)}
                            />
                        </div>
                        <button type="submit" className={styles.btnSetGoal}>Set Milestone</button>
                    </form>

                    <div className={styles.goalsContainer}>
                        {filteredGoals.length === 0 ? (
                            <div className={styles.emptyGoals}>
                                <div className={styles.emptyIcon}>{searchQuery ? '🔍' : '🎯'}</div>
                                <p>{searchQuery ? 'No milestones match your search.' : 'No active milestones for this month.'}</p>
                            </div>
                        ) : (
                            <div className={styles.goalsList}>
                                {filteredGoals.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)).map(goal => (
                                    <div key={goal.id} className={`${styles.goalItem} ${goal.completed ? styles.goalDone : ''}`}>
                                        <div className={styles.goalCheck} onClick={() => toggleMonthlyGoal(goal.id)}>
                                            {goal.completed && '✓'}
                                        </div>
                                        <div className={styles.goalMain}>
                                            <span className={styles.goalText}>{goal.text}</span>
                                            {goal.dueDate && (
                                                <div className={styles.goalMeta}>
                                                    <span className={styles.dueDateLabel}>
                                                        Due: {formatDueDate(goal.dueDate)}
                                                    </span>
                                                    <span className={`${styles.daysLeft} ${getRemainingDays(goal.dueDate) === 'Overdue' ? styles.overdue : ''}`}>
                                                        ({getRemainingDays(goal.dueDate)})
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        <button className={styles.btnDeleteGoal} onClick={() => deleteMonthlyGoal(goal.id)}>🗑️</button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
