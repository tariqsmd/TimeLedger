import React, { createContext, useContext, useState, useEffect } from 'react';

const QuickTasksContext = createContext();

export const useQuickTasks = () => useContext(QuickTasksContext);

export function QuickTasksProvider({ children }) {
    const [quickTasks, setQuickTasks] = useState([]);
    const [isQuickTasksModalOpen, setIsQuickTasksModalOpen] = useState(false);
    const [quickTasksModalMode, setQuickTasksModalMode] = useState('add'); // 'add' or 'view'
    const [isLoaded, setIsLoaded] = useState(false);

    const API_URL = 'http://localhost:5175/api/quick-tasks';

    // Fetch initial data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(API_URL);
                if (response.ok) {
                    const data = await response.json();
                    if (data && data.tasks) {
                        setQuickTasks(data.tasks);
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

    const addQuickTask = (task) => {
        const newTask = {
            id: Date.now(),
            createdAt: new Date().toISOString(),
            status: 'pending',
            ...task
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
            task.id === id ? { ...task, status: task.status === 'complete' ? 'pending' : 'complete' } : task
        ));
    };

    const openQuickTasksModal = (mode = 'add') => {
        setQuickTasksModalMode(mode);
        setIsQuickTasksModalOpen(true);
    };

    return (
        <QuickTasksContext.Provider value={{
            quickTasks,
            addQuickTask,
            updateQuickTask,
            deleteQuickTask,
            toggleQuickTaskStatus,
            isQuickTasksModalOpen,
            setIsQuickTasksModalOpen,
            quickTasksModalMode,
            setQuickTasksModalMode,
            openQuickTasksModal
        }}>
            {children}
        </QuickTasksContext.Provider>
    );
}
