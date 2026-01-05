import React, { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import styles from './TodoView.module.css';

export default function TodoView() {
    const {
        todos, addTodo, toggleTodo, deleteTodo,
        startTodo, pauseTodo, resumeTodo, endTodo, restartTodo,
        viewMode, setViewMode, sortBy, setSortBy,
        groupBy, setGroupBy, renameList, reorderTodos,
        updateTodoStatus
    } = useApp();

    const [inputValue, setInputValue] = useState('');
    const [description, setDescription] = useState('');
    const [newListTitle, setNewListTitle] = useState('');
    const [editingListTitle, setEditingListTitle] = useState(null);
    const [tempTitle, setTempTitle] = useState('');
    const [draggedItem, setDraggedItem] = useState(null);

    // Live duration updates
    const [, setTick] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => setTick(t => t + 1), 1000);
        return () => clearInterval(interval);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (inputValue.trim()) {
            addTodo(inputValue.trim(), newListTitle || 'Default', description.trim());
            setInputValue('');
            setDescription('');
        }
    };

    const handleRename = (oldTitle) => {
        if (tempTitle.trim() && tempTitle !== oldTitle) {
            renameList(oldTitle, tempTitle.trim());
        }
        setEditingListTitle(null);
    };

    const formatTime = (isoString) => {
        if (!isoString) return '';
        return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const formatDateShort = (isoString) => {
        if (!isoString) return '';
        const date = new Date(isoString);
        return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    };

    const getFullDateLabel = (dateKey) => {
        const date = new Date(dateKey);
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);

        if (date.toDateString() === today.toDateString()) return 'Today';
        if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
        return date.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });
    };

    const getLiveDuration = (todo) => {
        let totalMs = todo.accumulatedTime || 0;
        if (todo.status === 'running' && todo.lastStartedAt) {
            totalMs += (new Date() - new Date(todo.lastStartedAt));
        }

        const mins = Math.floor(totalMs / 60000);
        const hrs = Math.floor(mins / 60);
        if (hrs > 0) return `${hrs}h ${mins % 60}m`;
        if (mins > 0) return `${mins}m ${Math.floor((totalMs % 60000) / 1000)}s`;
        return `${Math.floor(totalMs / 1000)}s`;
    };

    // Drag and Drop
    const handleDragStart = (e, todo) => {
        setDraggedItem(todo);
        e.dataTransfer.effectAllowed = "move";
    };

    const handleDragOver = (e, targetTodo) => {
        e.preventDefault();
        if (!draggedItem || draggedItem.id === targetTodo.id) return;
        if (viewMode === 'kanban') return; // Kanban has different logic

        const newTodos = [...todos];
        const draggedIdx = newTodos.findIndex(t => t.id === draggedItem.id);
        const targetIdx = newTodos.findIndex(t => t.id === targetTodo.id);

        newTodos.splice(draggedIdx, 1);
        newTodos.splice(targetIdx, 0, draggedItem);
        reorderTodos(newTodos);
    };

    const handleDragEnd = () => setDraggedItem(null);

    // Grouping & Sorting
    const getGroupedTodos = () => {
        return todos.reduce((groups, todo) => {
            let key;
            if (groupBy === 'date') key = new Date(todo.createdAt).toDateString();
            else key = todo.listTitle || 'Default';

            if (!groups[key]) groups[key] = [];
            groups[key].push(todo);
            return groups;
        }, {});
    };

    const sortTasks = (tasks) => {
        if (sortBy === 'manual') return tasks;
        return [...tasks].sort((a, b) => {
            if (sortBy === 'alphabetical') return a.text.localeCompare(b.text);
            return new Date(b.createdAt) - new Date(a.createdAt);
        });
    };

    // Layout Renderers
    const renderTodoItem = (todo, compact = false) => (
        <div
            key={todo.id}
            className={`${styles.todoItem} ${todo.completed ? styles.completed : ''} ${draggedItem?.id === todo.id ? styles.dragging : ''} ${compact ? styles.compactItem : ''}`}
            draggable={sortBy === 'manual' || viewMode === 'kanban'}
            onDragStart={(e) => handleDragStart(e, todo)}
            onDragOver={(e) => handleDragOver(e, todo)}
            onDragEnd={handleDragEnd}
        >
            <div className={styles.checkbox} onClick={() => toggleTodo(todo.id)}>
                {todo.completed && '✓'}
            </div>

            <div className={styles.todoBody}>
                <div className={styles.todoInfo}>
                    <div className={styles.todoMain}>
                        <div className={styles.taskLeft}>
                            <span className={styles.todoText} onClick={() => toggleTodo(todo.id)}>
                                {todo.text}
                            </span>
                            {!compact && <span className={styles.listTag}>{todo.listTitle || 'Default'}</span>}
                        </div>
                        <div className={styles.taskRight}>
                            <span className={styles.dateTag}>{formatDateShort(todo.createdAt)}</span>
                        </div>
                    </div>
                    {!compact && todo.description && (
                        <p className={styles.todoDesc}>{todo.description}</p>
                    )}
                </div>

                <div className={styles.timeFooter}>
                    <div className={styles.timeMetrics}>
                        {todo.startTime && !compact && (
                            <span className={styles.metric}>
                                Start: {formatTime(todo.startTime)}
                            </span>
                        )}
                        {(todo.accumulatedTime > 0 || todo.status === 'running') && (
                            <span className={styles.liveDuration}>
                                {todo.status === 'running' ? '⚡ ' : '⏱ '}
                                {getLiveDuration(todo)}
                            </span>
                        )}
                    </div>

                    <div className={styles.taskControls}>
                        {todo.status === 'idle' && (
                            <button className={styles.btnStart} onClick={() => startTodo(todo.id)}>▶</button>
                        )}
                        {todo.status === 'running' && (
                            <button className={styles.btnPause} onClick={() => pauseTodo(todo.id)}>⏸</button>
                        )}
                        {todo.status === 'paused' && (
                            <button className={styles.btnResume} onClick={() => resumeTodo(todo.id)}>⏯</button>
                        )}
                        {todo.status !== 'completed' && todo.status !== 'idle' && (
                            <button className={styles.btnEnd} onClick={() => endTodo(todo.id)}>⏹</button>
                        )}
                        {todo.status === 'completed' && (
                            <button className={styles.btnRestart} onClick={() => restartTodo(todo.id)}>🔄</button>
                        )}
                        <button className={styles.btnDeleteInline} onClick={() => deleteTodo(todo.id)}>🗑</button>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderKanban = () => {
        const columns = [
            { id: 'idle', title: 'To Do', icon: '📝' },
            { id: 'running', title: 'In Progress', icon: '⚡' },
            { id: 'completed', title: 'Completed', icon: '✅' }
        ];

        return (
            <div className={styles.kanbanBoard}>
                {columns.map(col => (
                    <div
                        key={col.id}
                        className={styles.kanbanColumn}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={() => draggedItem && updateTodoStatus(draggedItem.id, col.id)}
                    >
                        <div className={styles.colHeader}>
                            <span>{col.icon} {col.title}</span>
                            <span className={styles.countBadge}>
                                {todos.filter(t => col.id === 'running' ? (t.status === 'running' || t.status === 'paused') : t.status === col.id).length}
                            </span>
                        </div>
                        <div className={styles.kanbanList}>
                            {todos
                                .filter(t => col.id === 'running' ? (t.status === 'running' || t.status === 'paused') : t.status === col.id)
                                .map(todo => renderTodoItem(todo, true))}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    const renderFocus = () => {
        const activeTask = todos.find(t => t.status === 'running') || todos.find(t => t.status === 'paused') || todos.find(t => !t.completed);

        if (!activeTask) return <div className={styles.emptyFocus}>All caught up! Grab some coffee. ☕</div>;

        return (
            <div className={styles.focusContainer}>
                <div className={styles.focusCard}>
                    <span className={styles.focusTag}>{activeTask.listTitle}</span>
                    <h1 className={styles.focusTitle}>{activeTask.text}</h1>
                    <p className={styles.focusDesc}>{activeTask.description}</p>

                    <div className={styles.focusTimer}>
                        <div className={styles.timerLarge}>{getLiveDuration(activeTask)}</div>
                        <p className={styles.timerLabel}>{activeTask.status === 'running' ? 'Focusing Now' : 'Session Paused'}</p>
                    </div>

                    <div className={styles.focusActions}>
                        {activeTask.status === 'idle' && (
                            <button className={styles.btnFocusStart} onClick={() => startTodo(activeTask.id)}>Start Deep Work</button>
                        )}
                        {activeTask.status === 'running' && (
                            <button className={styles.btnFocusPause} onClick={() => pauseTodo(activeTask.id)}>Pause</button>
                        )}
                        {activeTask.status === 'paused' && (
                            <button className={styles.btnFocusResume} onClick={() => resumeTodo(activeTask.id)}>Resume</button>
                        )}
                        {activeTask.status !== 'idle' && !activeTask.completed && (
                            <button className={styles.btnFocusEnd} onClick={() => endTodo(activeTask.id)}>Finish Task</button>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    const renderTimeline = () => {
        const entries = [...todos].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        return (
            <div className={styles.timelineView}>
                {entries.map((todo, idx) => (
                    <div key={todo.id} className={styles.timelineItem}>
                        <div className={styles.timelineEdge}>
                            <div className={`${styles.timelineDot} ${styles[todo.status]}`} />
                            {idx < entries.length - 1 && <div className={styles.timelineLine} />}
                        </div>
                        <div className={styles.timelineContent}>
                            <div className={styles.timelineMeta}>
                                <span>{formatTime(todo.createdAt)}</span>
                                <span className={styles.timelineDate}>{formatDateShort(todo.createdAt)}</span>
                            </div>
                            {renderTodoItem(todo, true)}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    const grouped = getGroupedTodos();
    const sortedKeys = Object.keys(grouped).sort((a, b) => groupBy === 'date' ? new Date(b) - new Date(a) : a.localeCompare(b));

    return (
        <div className={styles.todoView}>
            <div className={styles.viewHeader}>
                <div>
                    <h2 className="view-title">Workflow Engine</h2>
                    <p className="view-subtitle">The ultimate dashboard for your daily execution</p>
                </div>

                <div className={styles.controls}>
                    <div className={styles.viewToggle}>
                        <button className={viewMode === 'list' ? styles.activeView : ''} onClick={() => setViewMode('list')} title="List">📜</button>
                        <button className={viewMode === 'grid' ? styles.activeView : ''} onClick={() => setViewMode('grid')} title="Grid">▦</button>
                        <button className={viewMode === 'kanban' ? styles.activeView : ''} onClick={() => setViewMode('kanban')} title="Kanban">📋</button>
                        <button className={viewMode === 'timeline' ? styles.activeView : ''} onClick={() => setViewMode('timeline')} title="Timeline">⏱</button>
                        <button className={viewMode === 'focus' ? styles.activeView : ''} onClick={() => setViewMode('focus')} title="Focus">🧘</button>
                        <button className={viewMode === 'compact' ? styles.activeView : ''} onClick={() => setViewMode('compact')} title="Compact">➡</button>
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

            <div className={styles.todoLayout}>
                <div className={styles.mainCol}>
                    {viewMode !== 'focus' && (
                        <form className={styles.inputArea} onSubmit={handleSubmit}>
                            <div className={styles.inputStack}>
                                <div className={styles.inputMainRow}>
                                    <input
                                        type="text"
                                        className={styles.mainInput}
                                        placeholder="Add a new goal..."
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        required
                                    />
                                    <input
                                        type="text"
                                        className={styles.listTagInput}
                                        placeholder="Project"
                                        value={newListTitle}
                                        onChange={(e) => setNewListTitle(e.target.value)}
                                    />
                                    <button type="submit" className={styles.btnAdd}>Add</button>
                                </div>
                                <textarea
                                    className={styles.descInput}
                                    placeholder="Details and context..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>
                        </form>
                    )}

                    <div className={styles.todoContainer}>
                        {viewMode === 'kanban' ? renderKanban() :
                            viewMode === 'focus' ? renderFocus() :
                                viewMode === 'timeline' ? renderTimeline() :
                                    sortedKeys.map(key => (
                                        <div key={key} className={styles.todoGroup}>
                                            <h3 className={styles.groupTitle}>{groupBy === 'date' ? getFullDateLabel(key) : key}</h3>
                                            <div className={styles.todoList}>
                                                {sortTasks(grouped[key]).map(todo => renderTodoItem(todo, viewMode === 'compact'))}
                                            </div>
                                        </div>
                                    ))}

                        {todos.length === 0 && (
                            <div className={styles.emptyState}>
                                <div className={styles.emptyIcon}>🚀</div>
                                <p>No tasks. Time to plan something big!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
