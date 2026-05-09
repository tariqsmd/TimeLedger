import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useApp } from './AppContext';

const QuickTasksContext = createContext();

export const useQuickTasks = () => useContext(QuickTasksContext);

export function QuickTasksProvider({ children }) {
    const { todos: mainTodos } = useApp();
    const [quickTasks, setQuickTasks] = useState([]);
    const [isQuickTasksModalOpen, setIsQuickTasksModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    
    // Layout selection state
    const [activeLayout, setActiveLayout] = useState(() => {
        return localStorage.getItem('activeLayout') || 'start'; // 'start', 'modern', 'quick'
    });

    const API_URL = 'http://localhost:5175/api/quick-tasks';

    // Combined tasks for unified views
    const combinedTasks = useMemo(() => {
        // Tag them so we know where they came from if needed
        const taggedQuickTasks = quickTasks.map(t => ({ ...t, _source: 'quick' }));
        const taggedMainTasks = (mainTodos || []).map(t => ({ ...t, _source: 'main' }));
        return [...taggedQuickTasks, ...taggedMainTasks].sort((a, b) => 
            new Date(b.createdAt) - new Date(a.createdAt)
        );
    }, [quickTasks, mainTodos]);

    // Fetch initial data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(API_URL);
                if (response.ok) {
                    const data = await response.json();
                    if (data && data.tasks) {
                        // Harmonize data if it's in the old quick-task format
                        const harmonizedTasks = data.tasks.map(task => ({
                            id: task.id,
                            text: task.text || task.title || '',
                            description: task.description || task.note || '',
                            completed: task.completed !== undefined ? task.completed : (task.status === 'complete'),
                            status: task.status || 'idle',
                            createdAt: task.createdAt || new Date().toISOString(),
                            dueAt: task.dueAt || task.date || '',
                            time: task.time || '',
                            priority: task.priority || 'medium',
                            listTitle: task.listTitle || 'Quick Tasks',
                            boardTitle: task.boardTitle || 'To Do'
                        }));
                        setQuickTasks(harmonizedTasks);
                        setIsLoaded(true);
                    }
                }
            } catch (error) {
                console.error('Error fetching quick tasks:', error);
            }
        };
        fetchData();
    }, []);

    // Auto-save changes
    useEffect(() => {
        if (!isLoaded) return;

        const saveData = async () => {
            try {
                await fetch(API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ tasks: quickTasks })
                });
            } catch (error) {
                console.error('Error saving quick tasks:', error);
            }
        };

        const timeoutId = setTimeout(saveData, 1000);
        return () => clearTimeout(timeoutId);
    }, [quickTasks, isLoaded]);

    // Save layout selection
    useEffect(() => {
        localStorage.setItem('activeLayout', activeLayout);
    }, [activeLayout]);

    const addQuickTask = (taskData) => {
        const newTask = {
            id: Date.now().toString(),
            text: taskData.text || '',
            description: taskData.description || '',
            completed: false,
            status: 'idle',
            createdAt: new Date().toISOString(),
            dueAt: taskData.dueAt || '',
            time: taskData.time || '',
            priority: taskData.priority || 'medium',
            listTitle: 'Quick Tasks',
            boardTitle: 'To Do'
        };
        setQuickTasks(prev => [newTask, ...prev]);
    };

    const updateQuickTask = (id, updates) => {
        setQuickTasks(prev => prev.map(task => 
            task.id === id ? { ...task, ...updates } : task
        ));
    };

    const deleteQuickTask = (id) => {
        setQuickTasks(prev => prev.filter(task => task.id !== id));
    };

    const toggleQuickTaskStatus = (id) => {
        setQuickTasks(prev => prev.map(task => 
            task.id === id ? { 
                ...task, 
                completed: !task.completed,
                status: !task.completed ? 'complete' : 'idle'
            } : task
        ));
    };

    const openQuickTasksModal = (task = null) => {
        setEditingTask(task);
        setIsQuickTasksModalOpen(true);
    };

    return (
        <QuickTasksContext.Provider value={{
            quickTasks,
            combinedTasks,
            addQuickTask,
            updateQuickTask,
            deleteQuickTask,
            toggleQuickTaskStatus,
            isQuickTasksModalOpen,
            setIsQuickTasksModalOpen,
            editingTask,
            setEditingTask,
            openQuickTasksModal,
            activeLayout,
            setActiveLayout
        }}>
            {children}
        </QuickTasksContext.Provider>
    );
}
