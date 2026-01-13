import React, { createContext, useContext, useState } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { sampleTasks, sampleTaskGroups } from './appData';

const AppContext = createContext();

export function AppProvider({ children }) {

    // Project State
    const [projects, setProjects] = useLocalStorage('taskGroups', sampleTaskGroups);

    // Modal & Editing State
    const [editingEntry, setEditingEntry] = useState(null);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);


    console.log(sampleTasks);
    console.log(sampleTaskGroups);

    // Load Sample Data
    const loadSampleData = () => {
        if (window.confirm('This will replace your current data with sample data. Are you sure?')) {
            try {
                localStorage.setItem('tasks', JSON.stringify(sampleTasks));
                localStorage.setItem('taskGroups', JSON.stringify(sampleTaskGroups));

                // Force state update as well in case reload is delayed or prevented (though reload usually clears state)
                setTodos(sampleTasks);
                setProjects(sampleTaskGroups);

                window.location.reload();
            } catch (error) {
                console.error("Failed to load sample data:", error);
                alert("An error occurred while loading sample data. Please check the console.");
            }
        }
    };

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [todos, setTodos] = useState([]); // Start empty, fetch from server
    const [isDataLoaded, setIsDataLoaded] = useState(false); // Flag to prevent overwriting server data on init

    // --- File Persistence Logic ---
    const API_URL = 'http://localhost:5175/api/tasks';

    // 1. Fetch initial data from server (appData.json)
    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(API_URL);
                if (response.ok) {
                    const data = await response.json();
                    if (data && data.tasks) {
                        setTodos(data.tasks);
                        setIsDataLoaded(true);
                        console.log('Loaded tasks from file server:', data.tasks.length);
                    }
                } else {
                    console.error('Failed to fetch from local server');
                }
            } catch (error) {
                console.error('Error connecting to local server:', error);
            }
        };
        fetchData();
    }, []);

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

    const [viewMode, setViewMode] = useLocalStorage('todoViewMode', 'board');
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useLocalStorage('activeView', 'tasks');
    const [isTodoModalOpen, setIsTodoModalOpen] = useState(false);
    const [boardBackground, setBoardBackground] = useLocalStorage('todoBoardBackground', null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [boardColumns, setBoardColumns] = useLocalStorage('boardColumns', 3);
    const [sortBy, setSortBy] = useLocalStorage('sortBy', 'createdAt'); // 'createdAt', 'priority', 'dueAt', 'alpha'
    const [appFontBody, setAppFontBody] = useLocalStorage('appFontBody', 'Inter');
    const [appFontHeading, setAppFontHeading] = useLocalStorage('appFontHeading', 'Outfit');
    const [appTheme, setAppTheme] = useLocalStorage('appTheme', 'default');
    const [customBoards, setCustomBoards] = useLocalStorage('customBoards', ['To Do', 'In Progress', 'Completed']);

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
            subtasks: [],
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

    // Project Management
    const addProject = (name) => {
        if (name && !projects.includes(name)) {
            setProjects([...projects, name]);
        }
    };

    const removeProject = (name) => {
        setProjects(projects.filter(p => p !== name));
    };


    const value = {
        isModalOpen,
        editingEntry,
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
        openModal,
        closeModal,
        isTodoModalOpen,
        setIsTodoModalOpen,
        boardBackground,
        setBoardBackground,
        loadSampleData,
        projects,
        addProject,
        removeProject,
        isSidebarOpen,
        setIsSidebarOpen,
        boardColumns,
        setBoardColumns,
        sortBy,
        setSortBy,
        appFontBody,
        setAppFontBody,
        appFontHeading,
        setAppFontHeading,
        appTheme,
        setAppTheme,
        customBoards,
        setCustomBoards,
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
