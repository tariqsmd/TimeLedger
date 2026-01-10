import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useApp } from '../../contexts/AppContext';
import styles from './TodoView.module.css';
import { IconEdit, IconTrash, IconInfo, IconPlus, IconClose, IconSearch } from '../Common/Icons';

export default function TodoView() {
    const {
        todos,
        addTodo,
        toggleTodo,
        deleteTodo,
        startTodo,
        pauseTodo,
        resumeTodo,
        endTodo,
        restartTodo,
        viewMode,
        setViewMode,
        sortBy,
        setSortBy,
        groupBy,
        setGroupBy,
        reorderTodos,
        updateTodoStatus,
        searchQuery,
        updateTodo,
        projects
    } = useApp();

    const [inputValue, setInputValue] = useState('');
    const [description, setDescription] = useState('');
    const [newListTitle, setNewListTitle] = useState('');
    const [editingTodoId, setEditingTodoId] = useState(null);
    const [openMenuId, setOpenMenuId] = useState(null);
    const [draggedItem, setDraggedItem] = useState(null);
    const [isInputVisible, setIsInputVisible] = useState(false);

    // NEW: Priority and Due Date fields
    const [priority, setPriority] = useState('medium');
    const [dueDate, setDueDate] = useState('');

    // NEW: subtasks
    const [subtasks, setSubtasks] = useState([]);
    const [subtaskInput, setSubtaskInput] = useState('');

    const menuRef = useRef(null);

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setOpenMenuId(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    /* Add productivity shortcuts:
        N → New task
        Esc → Close modal
        Enter → Start focused task
        Space → Pause/resume in focus mode
    */
    useEffect(() => {
        const handler = (e) => {
            if (e.key === 'n' || e.key === 'N') setIsInputVisible(true);
            // if (e.key === 'Escape') handleCancel();
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, []);

    // Live duration updates
    const [, setTick] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => setTick(t => t + 1), 1000);
        return () => clearInterval(interval);
    }, []);

    // Filtered Todos
    const filteredTodos = useMemo(() => {
        if (!searchQuery.trim()) return todos;
        const query = searchQuery.toLowerCase();
        return todos.filter(t =>
            t.text.toLowerCase().includes(query) ||
            t.description?.toLowerCase().includes(query) ||
            t.listTitle?.toLowerCase().includes(query)
        );
    }, [todos, searchQuery]);

    // Handle form submission for Add/Edit Task
    const handleSubmit = (e) => {
        e.preventDefault();
        if (inputValue.trim()) {
            const payload = {
                text: inputValue.trim(),
                description: description.trim(),
                listTitle: newListTitle || 'Default',
                priority,
                dueAt: dueDate || null,
                subtasks
            };

            if (editingTodoId) {
                updateTodo(editingTodoId, payload);
                setEditingTodoId(null);
            } else {
                addTodo(payload.text, payload.listTitle, payload.description, payload);
            }

            // Reset input fields
            setInputValue('');
            setDescription('');
            setNewListTitle('');
            setPriority('medium');
            setDueDate('');
            setSubtasks([]);
            setSubtaskInput('');
            setIsInputVisible(false);
        }
    };

    // Handle editing an existing task
    const handleEdit = (todo) => {
        setEditingTodoId(todo.id);
        setInputValue(todo.text);
        setDescription(todo.description || '');
        setNewListTitle(todo.listTitle || '');
        setPriority(todo.priority || 'medium');
        setDueDate(todo.dueAt ? todo.dueAt.split('T')[0] : '');
        setOpenMenuId(null);
        setIsInputVisible(true);
        setSubtasks(todo.subtasks || []);
        setIsInputVisible(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Cancel input form
    const handleCancel = () => {
        setEditingTodoId(null);
        setInputValue('');
        setDescription('');
        setNewListTitle('');
        setPriority('medium');
        setDueDate('');
        setIsInputVisible(false);
    };

    // Check if task is overdue
    const isOverdue = (todo) => {
        if (!todo.dueAt || todo.completed) return false;
        return new Date(todo.dueAt) < new Date();
    };

    // Format time
    const formatTime = (isoString) => {
        if (!isoString) return '';
        return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    // Format date short
    const formatDateShort = (isoString) => {
        if (!isoString) return '';
        const date = new Date(isoString);
        return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    };

    // Full date label for grouped tasks
    const getFullDateLabel = (dateKey) => {
        const date = new Date(dateKey);
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);

        if (date.toDateString() === today.toDateString()) return 'Today';
        if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
        return date.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });
    };

    // Live duration for active tasks
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

    // Drag and Drop handlers
    const handleDragStart = (e, todo) => {
        setDraggedItem(todo);
        e.dataTransfer.effectAllowed = "move";
    };

    const handleDragOver = (e, targetTodo) => {
        e.preventDefault();
        if (!draggedItem || draggedItem.id === targetTodo.id) return;
        if (viewMode === 'kanban') return;

        const newTodos = [...todos];
        const draggedIdx = newTodos.findIndex(t => t.id === draggedItem.id);
        const targetIdx = newTodos.findIndex(t => t.id === targetTodo.id);

        newTodos.splice(draggedIdx, 1);
        newTodos.splice(targetIdx, 0, draggedItem);
        reorderTodos(newTodos);
    };

    const handleDragEnd = () => setDraggedItem(null);

    // Grouping tasks
    const getGroupedTodos = () => {
        return filteredTodos.reduce((groups, todo) => {
            let key;
            if (groupBy === 'date') key = new Date(todo.createdAt).toDateString();
            else key = todo.listTitle || 'Default';

            if (!groups[key]) groups[key] = [];
            groups[key].push(todo);
            return groups;
        }, {});
    };

    // Sorting tasks
    const sortTasks = (tasks) => {
        if (sortBy === 'manual') return tasks;
        return [...tasks].sort((a, b) => {
            if (sortBy === 'alphabetical') return a.text.localeCompare(b.text);
            return new Date(b.createdAt) - new Date(a.createdAt);
        });
    };

    const [expandedIds, setExpandedIds] = useState([]);

    const toggleExpand = (id) => {
        setExpandedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const toggleSubtask = (todoId, idx) => {
        const todo = todos.find(t => t.id === todoId);
        if (!todo) return;
        const updated = todo.subtasks.map((s, i) =>
            i === idx ? { ...s, done: !s.done } : s
        );
        updateTodo(todoId, { subtasks: updated });
    };

    // Render a single task item
    const renderTodoItem = (todo, compact = false) => {
        const isExpanded = expandedIds.includes(todo.id);

        return (
            <div
                key={todo.id}
                className={`${styles.todoItem} ${todo.completed ? styles.completed : ''} ${isOverdue(todo) ? styles.overdue : ''} ${draggedItem?.id === todo.id ? styles.dragging : ''} ${compact ? styles.compactItem : ''}`}
                draggable={sortBy === 'manual' || viewMode === 'kanban'}
                onDragStart={(e) => handleDragStart(e, todo)}
                onDragOver={(e) => handleDragOver(e, todo)}
                onDragEnd={handleDragEnd}
            >
                {/* Checkbox */}
                <div className={styles.checkbox} onClick={() => toggleTodo(todo.id)}>
                    {todo.completed && (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                    )}
                </div>

                <div className={styles.todoBody}>
                    <div className={styles.todoInlineRow}>
                        <div className={styles.taskPrimaryInfo}>
                            <span className={styles.todoText} onClick={() => toggleTodo(todo.id)}>
                                {todo.text}
                            </span>

                            {/* Expand button for description */}
                            {todo.description && (
                                <button
                                    className={`${styles.btnExpand} ${isExpanded ? styles.expanded : ''}`}
                                    onClick={() => toggleExpand(todo.id)}
                                    title="Toggle Description"
                                >
                                    <IconInfo size={18} />
                                </button>
                            )}

                        </div>

                        {/* Secondary info */}
                        <div className={styles.taskSecondaryInfo}>

                            <div className={styles.timeStack}>

                                {/* Inline controls */}
                                <div className={styles.inlineControls}>
                                    {todo.status === 'idle' && (
                                        <button className={styles.btnStartSmall} onClick={() => startTodo(todo.id)} title="Start">
                                            Start Timer <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M5 3l14 9-14 9V3z" /></svg>
                                        </button>
                                    )}
                                    {todo.status === 'running' && (
                                        <button className={styles.btnPauseSmall} onClick={() => pauseTodo(todo.id)} title="Pause">
                                            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>
                                        </button>
                                    )}
                                    {todo.status === 'paused' && (
                                        <button className={styles.btnResumeSmall} onClick={() => resumeTodo(todo.id)} title="Resume">
                                            Paused <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M5 3l14 9-14 9V3z" /></svg>
                                        </button>
                                    )}
                                    {todo.status !== 'completed' && todo.status !== 'idle' && (
                                        <button className={styles.btnEndSmall} onClick={() => endTodo(todo.id)} title="Stop">
                                            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" /></svg>
                                        </button>
                                    )}
                                    {todo.status === 'completed' && (
                                        <button className={styles.btnRestartSmall} onClick={() => restartTodo(todo.id)} title="Restart">
                                            Restart <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" /></svg>
                                        </button>
                                    )}
                                </div>

                                {(todo.accumulatedTime > 0 || todo.status === 'running') && (
                                    <span className={styles.inlineDuration}>
                                        {todo.status === 'running' ? '⚡' : '⏱'} {getLiveDuration(todo)}
                                    </span>
                                )}
                            </div>

                            {/* NEW: due date */}
                            {!compact && todo.dueAt && (
                                <span className={styles.dueDate}>
                                    Due {new Date(todo.dueAt).toLocaleDateString()}
                                </span>
                            )}

                            {!compact && <span className={styles.listTag}>{todo.listTitle || 'Default'}</span>}

                            {/* Priority badge */}
                            {!compact && todo.priority && (
                                <span className={`${styles.priorityBadge} ${styles[todo.priority]}`}>
                                    {todo.priority}
                                </span>
                            )}

                            <span className={styles.dateTag}>{formatDateShort(todo.createdAt)}</span>

                            {/* Menu */}
                            <div className={styles.menuContainer} ref={openMenuId === todo.id ? menuRef : null}>
                                <button
                                    className={styles.btnMenu}
                                    onClick={() => setOpenMenuId(openMenuId === todo.id ? null : todo.id)}
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="12" r="1" /><circle cx="12" cy="5" r="1" /><circle cx="12" cy="19" r="1" />
                                    </svg>
                                </button>
                                {openMenuId === todo.id && (
                                    <div className={styles.dropdown}>
                                        <button onClick={() => handleEdit(todo)}>
                                            <IconEdit size={14} /> Edit Task
                                        </button>
                                        <button
                                            onClick={() => {
                                                if (window.confirm('Delete this task?')) {
                                                    deleteTodo(todo.id);
                                                    setOpenMenuId(null);
                                                }
                                            }}
                                            className={styles.dangerAction}
                                        >
                                            <IconTrash size={14} /> Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Expanded description */}
                    {isExpanded && todo.description && (
                        <div className={styles.expandedDesc}>
                            <p>{todo.description}</p>
                            {todo.startTime && (
                                <div className={styles.startTimeLabel}>
                                    Started: {formatTime(todo.startTime)}
                                </div>
                            )}
                        </div>
                    )}

                    {/* NEW: subtasks */}
                    {todo.subtasks?.length > 0 && (
                        <div className={styles.subtasks}>
                            {todo.subtasks.map((s, i) => (
                                <label key={i} className={styles.subtaskItem}>
                                    <input
                                        type="checkbox"
                                        checked={s.done}
                                        onChange={() => toggleSubtask(todo.id, i)}
                                    />
                                    <span className={s.done ? styles.subtaskDone : ''}>{s.text}</span>
                                </label>
                            ))}
                        </div>
                    )}

                </div>
            </div>
        );
    };

    // Kanban view renderer
    const renderKanban = () => {
        const columns = [
            { id: 'idle', title: 'To Do', icon: <IconPlus size={16} /> },
            { id: 'running', title: 'In Progress', icon: '⚡' },
            { id: 'completed', title: 'Completed', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg> }
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
                            <span className={styles.colLabel}>{col.icon} {col.title}</span>
                            <span className={styles.countBadge}>
                                {filteredTodos.filter(t => col.id === 'running' ? (t.status === 'running' || t.status === 'paused') : t.status === col.id).length}
                            </span>
                        </div>
                        <div className={styles.kanbanList}>
                            {filteredTodos
                                .filter(t => col.id === 'running' ? (t.status === 'running' || t.status === 'paused') : t.status === col.id)
                                .map(todo => renderTodoItem(todo, true))}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    // Focus mode renderer
    const renderFocus = () => {
        const activeTask = filteredTodos.find(t => t.status === 'running') || filteredTodos.find(t => t.status === 'paused') || filteredTodos.find(t => !t.completed);

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

    // Timeline view renderer
    const renderTimeline = () => {
        const entries = [...filteredTodos].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
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

    // Grouped & sorted keys for List/Compact view
    const grouped = getGroupedTodos();
    const sortedKeys = Object.keys(grouped).sort((a, b) => groupBy === 'date' ? new Date(b) - new Date(a) : a.localeCompare(b));

    // Add task button
    const addTaskButton = () => {
        return (
            <button className={styles.btnFullAdd} onClick={() => setIsInputVisible(true)} >
                <IconPlus size={18} />
                <span>Add Task</span>
            </button>);
    };

    return (
        <div className={styles.todoView}>
            {/* Sticky tasks bar */}
            <div className={styles.stickyTasksBar}>

                <div className={styles.tasksControlsBar}>

                    <div className={styles.tasksActionRow}>
                        {filteredTodos.length > 0 && addTaskButton()}
                    </div>

                    {/* View & Sort Controls */}
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

            </div>

            {/* Main content */}
            <div className={styles.todoLayout}>
                <div className={styles.mainCol}>
                    <div className={styles.todoContainer}>
                        {viewMode === 'kanban' ? renderKanban() :
                            viewMode === 'focus' ? renderFocus() :
                                viewMode === 'timeline' ? renderTimeline() :
                                    sortedKeys.map(key => (
                                        <div key={key} className={styles.todoGroup}>
                                            <h2 className={styles.groupTitle}>{groupBy === 'date' ? getFullDateLabel(key) : key}</h2>
                                            <div className={styles.todoList}>
                                                {sortTasks(grouped[key]).map(todo => renderTodoItem(todo, viewMode === 'compact'))}
                                            </div>
                                        </div>
                                    ))
                        }

                        {/* Empty state */}
                        {filteredTodos.length === 0 && (
                            <div className='noResultsWrapper'>
                                { }
                                <div className={styles.emptyState}>
                                    <div className={styles.emptyIcon}>
                                        {searchQuery ? <IconSearch size={40} /> : addTaskButton('content')}
                                    </div>
                                    <p>{searchQuery ? `No results found for "${searchQuery}"` : 'No tasks. Time to plan something big!'}</p>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>

            {/* Modal for Add/Edit Task */}
            {
                viewMode !== 'focus' && isInputVisible && (
                    <div className={styles.modalOverlay} onClick={handleCancel}>
                        <form className={styles.inputArea} onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()}>
                            <button type="button" className={styles.btnCloseModal} onClick={handleCancel} title="Dismiss">
                                <IconClose size={24} />
                            </button>

                            <div className={styles.formBody}>
                                {/* Left Column: Main Content */}
                                <div className={styles.formMain}>
                                    <div>
                                        <h2 className={styles.modalTitle}>{editingTodoId ? 'Edit Task' : 'Add Task'}</h2>
                                        <p className={styles.modalSubtitle}>{editingTodoId ? 'Update your task details' : 'What needs to be done?'}</p>
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}>Task Name</label>
                                        <input
                                            type="text"
                                            className={styles.mainInput}
                                            placeholder="E.g., Complete project proposal"
                                            value={inputValue}
                                            onChange={(e) => setInputValue(e.target.value)}
                                            required
                                            autoFocus={!!editingTodoId}
                                        />
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}>Description</label>
                                        <textarea
                                            className={styles.descInput}
                                            placeholder="Add details, context, or notes..."
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                        />
                                    </div>

                                    {/* Subtasks */}
                                    <div className={styles.subtasksContainer}>
                                        <label className={styles.formLabel}>Subtasks</label>

                                        {subtasks.length > 0 && (
                                            <div className={styles.subtaskList}>
                                                {subtasks.map((st, idx) => (
                                                    <div key={idx} className={styles.addedSubtask}>
                                                        <span style={{ textDecoration: st.done ? 'line-through' : 'none', opacity: st.done ? 0.6 : 1 }}>{st.text}</span>
                                                        <button
                                                            type="button"
                                                            className={styles.btnRemoveSubtask}
                                                            onClick={() => setSubtasks(subtasks.filter((_, i) => i !== idx))}
                                                            title="Remove subtask"
                                                        >
                                                            <IconTrash size={14} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        <div className={styles.subtaskInputWrapper}>
                                            <input
                                                type="text"
                                                className={styles.enhancedInput}
                                                placeholder="Add new subtask..."
                                                value={subtaskInput}
                                                onChange={e => setSubtaskInput(e.target.value)}
                                                onKeyDown={e => {
                                                    if (e.key === 'Enter' && subtaskInput.trim()) {
                                                        e.preventDefault();
                                                        setSubtasks([...subtasks, { text: subtaskInput.trim(), done: false }]);
                                                        setSubtaskInput('');
                                                    }
                                                }}
                                            />
                                            <button
                                                type="button"
                                                className={styles.btnAddSubtask}
                                                onClick={() => {
                                                    if (subtaskInput.trim()) {
                                                        setSubtasks([...subtasks, { text: subtaskInput.trim(), done: false }]);
                                                        setSubtaskInput('');
                                                    }
                                                }}
                                            >
                                                <IconPlus size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column: Meta Info */}
                                <div className={styles.formSidebar}>
                                    <button type="button" className={styles.btnTextCancel} onClick={handleCancel}>Cancel</button>
                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}>Select Project</label>
                                        <select
                                            className={styles.enhancedSelect}
                                            value={newListTitle || 'Default'}
                                            onChange={(e) => setNewListTitle(e.target.value)}
                                        >
                                            <option value="Default">Default List</option>
                                            {projects.map(p => (
                                                <option key={p} value={p}>{p}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}>Set Due Date</label>
                                        <input
                                            type="date"
                                            className={styles.enhancedInput}
                                            value={dueDate}
                                            onChange={e => setDueDate(e.target.value)}
                                        />
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}>Set Priority</label>
                                        <div className={styles.priorityGrid}>
                                            {['low', 'medium', 'high'].map((p) => (
                                                <div
                                                    key={p}
                                                    className={`${styles.priorityOption} ${styles[p]} ${priority === p ? styles.selected : ''}`}
                                                    onClick={() => setPriority(p)}
                                                >
                                                    {p.charAt(0).toUpperCase() + p.slice(1)}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                </div>
                            </div>

                            <div className={styles.modalActions}>
                                <button type="submit" className={styles.btnAdd}>
                                    {editingTodoId ? 'Save Changes' : 'Create Task'}
                                </button>
                            </div>
                        </form>
                    </div>
                )
            }
        </div >
    );
}
