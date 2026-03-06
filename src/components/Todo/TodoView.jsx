import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useApp } from '../../contexts/AppContext';
import styles from './TodoView.module.css';
import {
    IconEdit, IconTrash, IconInfo, IconPlus, IconClose
} from '../Common/Icons';

export default function TodoView() {
    const {
        todos, addTodo, toggleTodo, deleteTodo,
        startTodo, pauseTodo, resumeTodo, endTodo, restartTodo,
        viewMode, setViewMode, sortBy, setSortBy,
        groupBy, setGroupBy, reorderTodos,
        updateTodoStatus, searchQuery, updateTodo, projects
    } = useApp();

    const [inputValue, setInputValue] = useState('');
    const [description, setDescription] = useState('');
    const [newListTitle, setNewListTitle] = useState('');
    const [editingTodoId, setEditingTodoId] = useState(null);
    const [openMenuId, setOpenMenuId] = useState(null);
    const [draggedItem, setDraggedItem] = useState(null);
    const [isInputVisible, setIsInputVisible] = useState(false);

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

    const handleSubmit = (e) => {
        e.preventDefault();
        if (inputValue.trim()) {
            if (editingTodoId) {
                updateTodo(editingTodoId, {
                    text: inputValue.trim(),
                    description: description.trim(),
                    listTitle: newListTitle || 'Default'
                });
                setEditingTodoId(null);
            } else {
                addTodo(inputValue.trim(), newListTitle || 'Default', description.trim());
            }
            setInputValue('');
            setDescription('');
            setNewListTitle('');
        }
    };

    const handleEdit = (todo) => {
        setEditingTodoId(todo.id);
        setInputValue(todo.text);
        setDescription(todo.description || '');
        setNewListTitle(todo.listTitle || '');
        setOpenMenuId(null);
        setIsInputVisible(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancel = () => {
        setEditingTodoId(null);
        setInputValue('');
        setDescription('');
        setNewListTitle('');
        setIsInputVisible(false);
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
        if (viewMode === 'kanban') return;

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
        return filteredTodos.reduce((groups, todo) => {
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

    const [expandedIds, setExpandedIds] = useState([]);

    const toggleExpand = (id) => {
        setExpandedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    // Layout Renderers
    const renderTodoItem = (todo, compact = false) => {
        const isExpanded = expandedIds.includes(todo.id);

        return (
            <div
                key={todo.id}
                className={`${styles.todoItem} ${todo.completed ? styles.completed : ''} ${draggedItem?.id === todo.id ? styles.dragging : ''} ${compact ? styles.compactItem : ''}`}
                draggable={sortBy === 'manual' || viewMode === 'kanban'}
                onDragStart={(e) => handleDragStart(e, todo)}
                onDragOver={(e) => handleDragOver(e, todo)}
                onDragEnd={handleDragEnd}
            >
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
                            {todo.description && (
                                <button
                                    className={`${styles.btnExpand} ${isExpanded ? styles.expanded : ''}`}
                                    onClick={() => toggleExpand(todo.id)}
                                    title="Toggle Description"
                                >
                                    <IconInfo size={14} />
                                </button>
                            )}
                            {!compact && <span className={styles.listTag}>{todo.listTitle || 'Default'}</span>}
                        </div>

                        <div className={styles.taskSecondaryInfo}>
                            <div className={styles.timeStack}>
                                {(todo.accumulatedTime > 0 || todo.status === 'running') && (
                                    <span className={styles.inlineDuration}>
                                        {todo.status === 'running' ? '⚡' : '⏱'} {getLiveDuration(todo)}
                                    </span>
                                )}
                                <span className={styles.dateTag}>{formatDateShort(todo.createdAt)}</span>
                            </div>

                            <div className={styles.inlineControls}>
                                {todo.status === 'idle' && (
                                    <button className={styles.btnStartSmall} onClick={() => startTodo(todo.id)} title="Start">
                                        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M5 3l14 9-14 9V3z" /></svg>
                                    </button>
                                )}
                                {todo.status === 'running' && (
                                    <button className={styles.btnPauseSmall} onClick={() => pauseTodo(todo.id)} title="Pause">
                                        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>
                                    </button>
                                )}
                                {todo.status === 'paused' && (
                                    <button className={styles.btnResumeSmall} onClick={() => resumeTodo(todo.id)} title="Resume">
                                        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M5 3l14 9-14 9V3z" /></svg>
                                    </button>
                                )}
                                {todo.status !== 'completed' && todo.status !== 'idle' && (
                                    <button className={styles.btnEndSmall} onClick={() => endTodo(todo.id)} title="Stop">
                                        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" /></svg>
                                    </button>
                                )}
                                {todo.status === 'completed' && (
                                    <button className={styles.btnRestartSmall} onClick={() => restartTodo(todo.id)} title="Restart">
                                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" /></svg>
                                    </button>
                                )}
                            </div>


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
                                        <button onClick={() => { deleteTodo(todo.id); setOpenMenuId(null); }} className={styles.dangerAction}>
                                            <IconTrash size={14} /> Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

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
                </div>
            </div>
        );
    };

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

    const grouped = getGroupedTodos();
    const sortedKeys = Object.keys(grouped).sort((a, b) => groupBy === 'date' ? new Date(b) - new Date(a) : a.localeCompare(b));

    return (
        <div className={styles.todoView}>
            <div className={styles.todoLayout}>
                <div className={styles.mainCol}>
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

                        {filteredTodos.length === 0 && (
                            <div className={styles.emptyState}>
                                <div className={styles.emptyIcon}>
                                    {searchQuery ? <IconSearch size={40} /> : <IconPlus size={40} />}
                                </div>
                                <p>{searchQuery ? `No results found for "${searchQuery}"` : 'No tasks. Time to plan something big!'}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {viewMode !== 'focus' && isInputVisible && (
                <div className={styles.modalOverlay} onClick={handleCancel}>
                    <form className={styles.inputArea} onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()}>
                        <button type="button" className={styles.btnCloseModal} onClick={handleCancel} title="Dismiss">
                            <IconClose size={24} />
                        </button>
                        <div className={styles.inputStack}>
                            <div className={styles.inputHeader}>
                                <h2 className={styles.modalTitle}>{editingTodoId ? 'Edit Workspace Goal' : 'Define New Goal'}</h2>
                                <p className={styles.modalSubtitle}>{editingTodoId ? 'Refine your execution strategy' : 'Plan your next big mission'}</p>
                            </div>
                            <div className={styles.inputMainRow}>
                                <input
                                    type="text"
                                    className={styles.mainInput}
                                    placeholder="What's your primary focus?"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    required
                                    autoFocus={editingTodoId ? true : false}
                                />
                                <input
                                    type="text"
                                    className={styles.listTagInput}
                                    placeholder="Project"
                                    value={newListTitle}
                                    onChange={(e) => setNewListTitle(e.target.value)}
                                    list="project-suggestions"
                                />
                                <datalist id="project-suggestions">
                                    {projects.map(p => <option key={p} value={p} />)}
                                </datalist>
                            </div>
                            <textarea
                                className={styles.descInput}
                                placeholder="Add context, sub-tasks, or notes..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                            <div className={styles.modalActions}>
                                <button type="submit" className={styles.btnAdd}>
                                    {editingTodoId ? 'Update Goal' : 'Establish New Goal'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            )}

            <div className={styles.stickyFooter}>

                <div className={styles.footerControlsBar}>
                    <button
                        className={`${styles.btnFloatAdd} ${isInputVisible ? styles.activeFloat : ''}`}
                        onClick={() => setIsInputVisible(!isInputVisible)}
                        title="Toggle Goal Capture"
                    >
                        <IconPlus size={24} />
                    </button>

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
    );
}
