import React, { createContext, useContext, useState, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { sampleTasks, sampleCategories } from './appData';

const AppContext = createContext();
const SAMPLES_BOOTSTRAPPED_KEY = 'tl_samples_bootstrapped_v1';

export function AppProvider({ children }) {
    // Category/Group State
    const [categories, setCategories] = useLocalStorage('taskGroups', sampleCategories);
    const [allLabels, setAllLabels] = useLocalStorage('allLabels', [
        { name: 'Urgent', color: '#eb5a46' },
        { name: 'Bug', color: '#344563' },
        { name: 'Feature', color: '#00c2e0' }
    ]);

    // Data Normalization (for backward compatibility)
    React.useEffect(() => {
        let changed = false;
        let normCats = [...categories];
        let normLabels = [...allLabels];

        if (categories && categories.length > 0 && typeof categories[0] === 'string') {
            normCats = categories.map(c => ({ name: c, color: '#0079bf' }));
            changed = true;
        }

        if (allLabels && allLabels.length > 0 && typeof allLabels[0] === 'string') {
            normLabels = allLabels.map(l => ({ name: l, color: '#61bd4f' }));
            changed = true;
        }

        if (changed) {
            setCategories(normCats);
            setAllLabels(normLabels);
        }
    }, [categories, allLabels, setCategories, setAllLabels]);

    const [todos, setTodos] = useState([]);
    const [isDataLoaded, setIsDataLoaded] = useState(false); // Flag to prevent overwriting server data on init

    // --- File Persistence Logic ---
    const API_URL = 'http://localhost:5175/api/tasks';

    // 1. Fetch initial data from server (appData.json), falling back to sample auto-bootstrap.
    //    First ever run (no persisted data anywhere) seeds sampleTasks / sampleCategories
    //    into localStorage AND the JSON file server so users immediately see real examples
    //    demonstrating every feature (rich text, priorities, due dates, checklists, cover
    //    colors, running/paused/completed timers, etc.).
    const bootstrapSamples = useCallback((targetTodos, targetCategories) => {
        try {
            localStorage.setItem('tasks', JSON.stringify(targetTodos));
            localStorage.setItem('taskGroups', JSON.stringify(targetCategories));
            localStorage.setItem(SAMPLES_BOOTSTRAPPED_KEY, '1');
        } catch (e) {
            console.warn('Could not save samples to localStorage:', e);
        }
    }, []);

    React.useEffect(() => {
        const fetchData = async () => {
            let fileTodos = null;
            let serverAvailable = false;
            try {
                const response = await fetch(API_URL);
                if (response.ok) {
                    const data = await response.json();
                    fileTodos = data?.tasks ?? null;
                    serverAvailable = true;
                } else {
                    console.warn('Task file endpoint returned non-ok status:', response.status);
                }
            } catch (error) {
                console.info('Local JSON server not reachable, using localStorage + samples fallback.');
            }

            const lsTasks = (() => {
                try {
                    const raw = localStorage.getItem('tasks');
                    return raw ? JSON.parse(raw) : null;
                } catch { return null; }
            })();
            const lsHasTasks = Array.isArray(lsTasks) && lsTasks.length > 0;
            const fileHasTasks = Array.isArray(fileTodos) && fileTodos.length > 0;
            const alreadyBootstrapped = localStorage.getItem(SAMPLES_BOOTSTRAPPED_KEY) === '1';

            let finalTodos = lsHasTasks ? lsTasks : fileTodos;

            // First-run: no user data anywhere yet. Seed the curated sample data
            // so every feature of the app is immediately visible.
            if (!lsHasTasks && !fileHasTasks && !alreadyBootstrapped) {
                finalTodos = sampleTasks;
                setCategories(sampleCategories);
                bootstrapSamples(sampleTasks, sampleCategories);

                // Also write samples to the JSON file server so on next load the
                // persisted samples are loaded back (matching localStorage state).
                if (serverAvailable) {
                    try {
                        fetch(API_URL, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ tasks: sampleTasks })
                        }).catch(() => { /* silent — localStorage copy is canonical */ });
                    } catch { /* noop */ }
                }
            }

            // If we only have data in the JSON file (no localStorage), mirror it.
            if (!lsHasTasks && fileHasTasks) {
                try { localStorage.setItem('tasks', JSON.stringify(fileTodos)); } catch { /* noop */ }
            }

            setTodos(Array.isArray(finalTodos) ? finalTodos : []);
            setIsDataLoaded(true);
            console.log('Loaded tasks:', (finalTodos || []).length, serverAvailable ? '(file+localStorage)' : '(localStorage only)');
        };
        fetchData();
    }, [bootstrapSamples, setCategories]);

    // 2. Auto-save changes to server (appData.json)
    React.useEffect(() => {
        if (!isDataLoaded) return; // Don't save before initial load

        const saveData = async () => {
            try {
                await fetch(API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ tasks: todos })
                });
                console.log('Saved changes to file server');
            } catch (error) {
                console.error('Failed to save changes:', error);
            }
        };
        // Debounce slightly to avoid too many writes
        const timeoutId = setTimeout(saveData, 500);
        return () => clearTimeout(timeoutId);
    }, [todos, isDataLoaded]);

    // Electron lifecycle - save data on app close
    const saveDataToServer = useCallback(async () => {
        if (!isDataLoaded) return;
        try {
            await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tasks: todos })
            });
            console.log('Data saved before app close');
        } catch (error) {
            console.error('Failed to save data before close:', error);
        }
    }, [todos, isDataLoaded]);

    const [viewMode, setViewMode] = useLocalStorage('todoViewMode', 'board');
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useLocalStorage('activeView', 'tasks');
    const [isTodoModalOpen, setIsTodoModalOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [sortBy, setSortBy] = useLocalStorage('sortBy', 'createdAt'); // 'createdAt', 'priority', 'dueAt', 'alpha'
    const [appFontBody, setAppFontBody] = useLocalStorage('appFontBody', 'Inter');
    const [appFontWeightBody, setAppFontWeightBody] = useLocalStorage('appFontWeightBody', '400');
    const [appFontHeading, setAppFontHeading] = useLocalStorage('appFontHeading', 'Outfit');
    const [appFontWeightHeading, setAppFontWeightHeading] = useLocalStorage('appFontWeightHeading', '700');
    const [appTheme, setAppTheme] = useLocalStorage('appTheme', 'default');
    const [boardBackgroundType, setBoardBackgroundType] = useLocalStorage('boardBackgroundType', 'none'); // 'none', 'color', 'gradient', 'image'
    const [boardBackgroundValue, setBoardBackgroundValue] = useLocalStorage('boardBackgroundValue', '');
    const [customBoards, setCustomBoards] = useLocalStorage('customBoards', ['To Do', 'In Progress', 'Completed']);
    const [showGlobalBadges, setShowGlobalBadges] = useLocalStorage('showGlobalBadges', true);

    // Todo Actions
    const addTodo = (text, listTitle = '', description = '', extraData = {}) => {
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
            lastStartedAt: null,
            priority: 'medium',
            categories: listTitle ? [listTitle] : [], // Multiple categories support
            labels: [], // Multiple labels support
            checklists: [], // Multiple checklists support
            ...extraData
        };
        setTodos([newTodo, ...todos]);
    };


    const toggleTodo = (id) => {
        setTodos(todos.map(todo => {
            if (todo.id === id) {
                const now = new Date().toISOString();
                const willBeCompleted = !todo.completed;
                let updates = { completed: willBeCompleted };

                if (willBeCompleted) {
                    updates.status = 'completed';
                    updates.endTime = now;
                    if (todo.status === 'running') {
                        const sessionTime = new Date(now) - new Date(todo.lastStartedAt);
                        updates.accumulatedTime = todo.accumulatedTime + sessionTime;
                        updates.lastStartedAt = null;
                    }
                } else {
                    updates.status = 'idle';
                    updates.endTime = null;
                    // Keep accumulatedTime as is
                }
                return { ...todo, ...updates };
            }
            return todo;
        }));
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
                    status: 'paused', // STOPPED -> Paused state to preserve time
                    completed: false, // Do NOT mark as completed
                    // endTime: now, // Do NOT set End Time if not completed
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
                    updates.completed = false;
                    updates.startTime = todo.startTime || now;
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

    // Category Management
    const addGlobalCategory = (name, color = '#61bd4f') => {
        if (name && !categories.some(c => c.name === name)) {
            setCategories([...categories, { name, color }]);
        }
    };

    const removeCategory = (name) => {
        setCategories(categories.filter(p => p.name !== name));
    };

    const addGlobalLabel = (name, color = '#61bd4f') => {
        if (name && !allLabels.some(l => l.name === name)) {
            setAllLabels([...allLabels, { name, color }]);
        }
    };

    const addChecklist = (todoId, title = 'Checklist') => {
        setTodos(todos.map(todo => {
            if (todo.id === todoId) {
                const newChecklists = [...(todo.checklists || []), {
                    id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
                    title,
                    items: []
                }];
                return { ...todo, checklists: newChecklists };
            }
            return todo;
        }));
    };

    const removeChecklist = (todoId, checklistId) => {
        setTodos(todos.map(todo => {
            if (todo.id === todoId) {
                return { ...todo, checklists: todo.checklists.filter(c => c.id !== checklistId) };
            }
            return todo;
        }));
    };

    const updateChecklist = (todoId, checklistId, updates) => {
        setTodos(todos.map(todo => {
            if (todo.id === todoId) {
                return {
                    ...todo,
                    checklists: todo.checklists.map(c => c.id === checklistId ? { ...c, ...updates } : c)
                };
            }
            return todo;
        }));
    };


    const value = {
        todos,
        viewMode,
        setViewMode,
        addTodo,
        toggleTodo,
        deleteTodo,
        startTodo,
        pauseTodo,
        resumeTodo,
        endTodo,
        restartTodo,
        reorderTodos,
        updateTodoStatus,
        updateTodo,
        searchQuery,
        setSearchQuery,
        activeTab,
        setActiveTab,
        isTodoModalOpen,
        setIsTodoModalOpen,
        categories,
        addGlobalCategory,
        removeCategory,
        allLabels,
        addGlobalLabel,
        addChecklist,
        removeChecklist,
        updateChecklist,
        isSidebarOpen,
        setIsSidebarOpen,
        sortBy,
        setSortBy,
        appFontBody,
        setAppFontBody,
        appFontWeightBody,
        setAppFontWeightBody,
        appFontHeading,
        setAppFontHeading,
        appFontWeightHeading,
        setAppFontWeightHeading,
        appTheme,
        setAppTheme,
        boardBackgroundType,
        setBoardBackgroundType,
        boardBackgroundValue,
        setBoardBackgroundValue,
        customBoards,
        setCustomBoards,
        showGlobalBadges,
        setShowGlobalBadges,
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
