import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { db } from '../services/db/dbService';
import { scheduleData } from '../data/scheduleData';

const AppContext = createContext();

export function AppProvider({ children }) {
    const [trackerData, setTrackerData] = useLocalStorage('timeBlockTrackerData', { entries: [] });
    const [weekOffset, setWeekOffset] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEntry, setEditingEntry] = useState(null);
    const [todos, setTodos] = useLocalStorage('timeBlockTodos', []);
    const [viewMode, setViewMode] = useLocalStorage('todoViewMode', 'list');
    const [sortBy, setSortBy] = useLocalStorage('todoSortBy', 'time');
    const [groupBy, setGroupBy] = useLocalStorage('todoGroupBy', 'date');
    const [customSchedules, setCustomSchedules] = useLocalStorage('timeBlockSchedules', null);
    const [monthlyGoals, setMonthlyGoals] = useLocalStorage('timeBlockMonthlyGoals', []);
    const [activeTheme, setActiveTheme] = useLocalStorage('timeLedgerTheme', 'light');
    const [activeSettingsTab, setActiveSettingsTab] = useState('appearance');
    const [projects, setProjects] = useLocalStorage('mt_projects', ['Work', 'Personal', 'Side Project', 'Learning', 'Health']);
    const [enabledModules, setEnabledModules] = useLocalStorage('mt_enabled_modules', {
        todo: true,
        schedule: true,
        tracker: true,
        analytics: true
    });
    const [dbEngine, setDbEngine] = useLocalStorage('mt_db_engine', 'local');
    const [userProfile, setUserProfile] = useLocalStorage('timeLedgerProfile', {
        name: 'Muhammad Tariq',
        role: 'Senior Web Developer',
        bio: 'Passionate about building tools that help people master their time and reach their full potential.',
        email: 'tariqkhansmd.mob@gmail.com',
        goal: 40, // hours per week
        specialization: 'Web Design & Development',
        avatar: 'MT'
    });
    const [notices, setNotices] = useState([
        { id: 1, type: 'suggest', title: 'Deep Work Suggestion', text: 'You have a 3-hour block open this afternoon. Perfect for "Learning"!', icon: '💡' },
        { id: 2, type: 'error', title: 'Tracker Gap', text: 'You missed logging yesterday\'s evening block. Keep the streak alive?', icon: '⚠️' },
        { id: 3, type: 'notice', title: 'System Update', text: 'Schedule Architect v2.0 is now live! New calendar features added.', icon: '🚀' }
    ]);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useLocalStorage('activeView', 'analytics');

    // Initialize schedules from static data if not present
    useEffect(() => {
        if (!customSchedules) {
            import('../data/scheduleData').then(module => {
                setCustomSchedules(module.scheduleData);
            });
        }
    }, [customSchedules, setCustomSchedules]);

    // Apply theme to body
    useEffect(() => {
        document.body.setAttribute('data-theme', activeTheme);
    }, [activeTheme]);

    // Add or update an entry
    const saveEntry = (entry) => {
        const isUpdate = trackerData.entries.some(e => e.id === entry.id);

        if (isUpdate) {
            setTrackerData({
                entries: trackerData.entries.map(e => e.id === entry.id ? entry : e)
            });
        } else {
            setTrackerData({
                entries: [...trackerData.entries, entry]
            });
        }
    };

    // Delete an entry
    const deleteEntry = (entryId) => {
        setTrackerData({
            entries: trackerData.entries.filter(e => e.id !== entryId)
        });
    };

    // Todo Actions
    const addTodo = (text, listTitle = '', description = '') => {
        const newTodo = {
            id: Date.now().toString(),
            text,
            description,
            completed: false,
            createdAt: new Date().toISOString(),
            listTitle: listTitle || 'Default',
            status: 'idle', // idle, running, paused, completed
            startTime: null,
            endTime: null,
            accumulatedTime: 0,
            lastStartedAt: null
        };
        setTodos([newTodo, ...todos]);
    };

    const renameList = (oldTitle, newTitle) => {
        setTodos(todos.map(todo =>
            todo.listTitle === oldTitle ? { ...todo, listTitle: newTitle } : todo
        ));
    };

    const toggleTodo = (id) => {
        setTodos(todos.map(todo =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        ));
    };

    const deleteTodo = (id) => {
        setTodos(todos.filter(todo => todo.id !== id));
    };

    const startTodo = (id) => {
        const now = new Date().toISOString();
        setTodos(todos.map(todo =>
            todo.id === id ? {
                ...todo,
                status: 'running',
                startTime: todo.startTime || now,
                lastStartedAt: now
            } : todo
        ));
    };

    const pauseTodo = (id) => {
        const now = new Date().toISOString();
        setTodos(todos.map(todo => {
            if (todo.id === id && todo.status === 'running') {
                const sessionTime = new Date(now) - new Date(todo.lastStartedAt);
                return {
                    ...todo,
                    status: 'paused',
                    accumulatedTime: todo.accumulatedTime + sessionTime,
                    lastStartedAt: null
                };
            }
            return todo;
        }));
    };

    const resumeTodo = (id) => {
        const now = new Date().toISOString();
        setTodos(todos.map(todo =>
            todo.id === id ? {
                ...todo,
                status: 'running',
                lastStartedAt: now
            } : todo
        ));
    };

    const endTodo = (id) => {
        const now = new Date().toISOString();
        setTodos(todos.map(todo => {
            if (todo.id === id) {
                let finalTime = todo.accumulatedTime;
                if (todo.status === 'running') {
                    finalTime += (new Date(now) - new Date(todo.lastStartedAt));
                }
                return {
                    ...todo,
                    status: 'completed',
                    completed: true,
                    endTime: now,
                    accumulatedTime: finalTime,
                    lastStartedAt: null
                };
            }
            return todo;
        }));
    };

    const restartTodo = (id) => {
        setTodos(todos.map(todo =>
            todo.id === id ? {
                ...todo,
                status: 'idle',
                completed: false,
                startTime: null,
                endTime: null,
                accumulatedTime: 0,
                lastStartedAt: null
            } : todo
        ));
    };

    const updateTodoStatus = (id, newStatus) => {
        setTodos(todos.map(todo => {
            if (todo.id === id) {
                const now = new Date().toISOString();
                let updates = { status: newStatus };

                if (newStatus === 'completed') {
                    updates.completed = true;
                    updates.endTime = now;
                    if (todo.status === 'running') {
                        const sessionTime = new Date(now) - new Date(todo.lastStartedAt);
                        updates.accumulatedTime = todo.accumulatedTime + sessionTime;
                        updates.lastStartedAt = null;
                    }
                } else if (newStatus === 'running') {
                    updates.completed = false;
                    updates.lastStartedAt = now;
                    updates.startTime = todo.startTime || now;
                } else if (newStatus === 'paused') {
                    if (todo.status === 'running') {
                        const sessionTime = new Date(now) - new Date(todo.lastStartedAt);
                        updates.accumulatedTime = todo.accumulatedTime + sessionTime;
                        updates.lastStartedAt = null;
                    }
                } else if (newStatus === 'idle') {
                    updates.completed = false;
                    updates.lastStartedAt = null;
                }

                return { ...todo, ...updates };
            }
            return todo;
        }));
    };

    const reorderTodos = (newTodos) => {
        setTodos(newTodos);
    };

    const updateTodo = (id, updates) => {
        setTodos(todos.map(todo => todo.id === id ? { ...todo, ...updates } : todo));
    };

    // Schedule Management
    const addScheduleBlock = (type, dayType, block) => {
        const updated = { ...customSchedules };
        updated[type][dayType] = [...updated[type][dayType], { ...block, id: Date.now().toString() }];
        setCustomSchedules(updated);
    };

    const updateScheduleBlock = (type, dayType, blockId, updates) => {
        const updated = { ...customSchedules };
        updated[type][dayType] = updated[type][dayType].map(b =>
            b.id === blockId || (b.time === blockId && !b.id) ? { ...b, ...updates } : b
        );
        setCustomSchedules(updated);
    };

    const deleteScheduleBlock = (type, dayType, blockId) => {
        const updated = { ...customSchedules };
        updated[type][dayType] = updated[type][dayType].filter(b =>
            b.id !== blockId && (b.time !== blockId || b.id)
        );
        setCustomSchedules(updated);
    };

    // Monthly Goal Actions
    const addMonthlyGoal = (goal) => {
        setMonthlyGoals([...monthlyGoals, { ...goal, id: Date.now().toString(), completed: false }]);
    };

    const toggleMonthlyGoal = (id) => {
        setMonthlyGoals(monthlyGoals.map(g => g.id === id ? { ...g, completed: !g.completed } : g));
    };

    const deleteMonthlyGoal = (id) => {
        setMonthlyGoals(monthlyGoals.filter(g => g.id !== id));
    };

    const updateMonthlyGoal = (id, updates) => {
        setMonthlyGoals(monthlyGoals.map(g => g.id === id ? { ...g, ...updates } : g));
    };

    // Project Management
    const addProject = (name) => {
        if (name && !projects.includes(name)) {
            setProjects([...projects, name]);
        }
    };

    const removeProject = (name) => {
        setProjects(projects.filter(p => p !== name));
    };

    const toggleModule = (moduleId) => {
        setEnabledModules(prev => ({
            ...prev,
            [moduleId]: !prev[moduleId]
        }));
    };

    const removeNotice = (id) => {
        setNotices(notices.filter(n => n.id !== id));
    };

    const updateProfile = (updates) => {
        const newProfile = { ...userProfile, ...updates };
        setUserProfile(newProfile);
        db.save('timeLedgerProfile', newProfile);
    };

    const switchDatabase = (engineId) => {
        if (db.setEngine(engineId)) {
            setDbEngine(engineId);
            // In a real scenario, we might trigger a re-load of all data here
            window.location.reload(); // Quickest way to re-instantiate with new DB
        }
    };

    // Open modal for creating/editing entry
    const openModal = (entry = null) => {
        setEditingEntry(entry);
        setIsModalOpen(true);
    };

    // Close modal
    const closeModal = () => {
        setEditingEntry(null);
        setIsModalOpen(false);
    };

    const value = {
        trackerData,
        setTrackerData,
        weekOffset,
        setWeekOffset,
        isModalOpen,
        editingEntry,
        todos,
        viewMode,
        setViewMode,
        sortBy,
        setSortBy,
        groupBy,
        setGroupBy,
        saveEntry,
        deleteEntry,
        addTodo,
        renameList,
        toggleTodo,
        deleteTodo,
        startTodo,
        pauseTodo,
        resumeTodo,
        endTodo,
        restartTodo,
        reorderTodos,
        updateTodoStatus,
        customSchedules,
        addScheduleBlock,
        updateScheduleBlock,
        deleteScheduleBlock,
        monthlyGoals,
        addMonthlyGoal,
        toggleMonthlyGoal,
        deleteMonthlyGoal,
        updateMonthlyGoal,
        updateTodo,
        activeTheme,
        setActiveTheme,
        dbEngine,
        switchDatabase,
        projects,
        addProject,
        removeProject,
        enabledModules,
        toggleModule,
        activeSettingsTab,
        setActiveSettingsTab,
        userProfile,
        updateProfile,
        notices,
        removeNotice,
        searchQuery,
        setSearchQuery,
        activeTab,
        setActiveTab,
        openModal,
        closeModal
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
}
