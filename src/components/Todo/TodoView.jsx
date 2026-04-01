import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../utils/AppContext';
import { IconTrash, IconPlus, IconClose, IconPlay, IconPause, IconStop, IconRefresh, IconClock, IconCheckSquare } from '../../assets/Icons';
import Board from './Board';
import { getLiveDuration, formatDateFull } from './useTodoUtils';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

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
        updateTodoStatus,
        searchQuery,
        updateTodo,
        projects,
        addProject,
        isTodoModalOpen,
        setIsTodoModalOpen,
        sortBy
    } = useApp();

    // Form state
    const [inputValue, setInputValue] = useState('');
    const [description, setDescription] = useState('');
    const [newListTitle, setNewListTitle] = useState('');
    const [editingTodoId, setEditingTodoId] = useState(null);
    const [draggedItem, setDraggedItem] = useState(null);
    const [priority, setPriority] = useState('medium');
    const [dueDate, setDueDate] = useState('');
    const [subtasks, setSubtasks] = useState([]);
    const [subtaskInput, setSubtaskInput] = useState('');
    const [labels, setLabels] = useState([]);
    const [labelInput, setLabelInput] = useState('');
    const [coverColor, setCoverColor] = useState(null);
    const [isDescriptionEditing, setIsDescriptionEditing] = useState(false);

    const coverColors = [
        { name: 'None', value: null },
        { name: 'Blue', value: '#4b7bec' },
        { name: 'Green', value: '#20bf6b' },
        { name: 'Red', value: '#eb3b5a' },
        { name: 'Yellow', value: '#f7b731' },
        { name: 'Purple', value: '#a55eea' },
        { name: 'Orange', value: '#fa8231' },
        { name: 'Slate', value: '#778ca3' }
    ];

    // Live duration updates
    const [, setTick] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => setTick(t => t + 1), 1000);
        return () => clearInterval(interval);
    }, []);

    // Filtered & Sorted Todos
    const filteredTodos = useMemo(() => {
        let result = todos;

        // 1. Filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(t =>
                t.text.toLowerCase().includes(query) ||
                t.description?.toLowerCase().includes(query) ||
                t.listTitle?.toLowerCase().includes(query)
            );
        }

        // 2. Sort
        return [...result].sort((a, b) => { // Copy to avoid mutation
            switch (sortBy) {
                case 'priority':
                    const pMap = { high: 3, medium: 2, low: 1 };
                    return (pMap[b.priority] || 0) - (pMap[a.priority] || 0);
                case 'alpha':
                    return a.text.localeCompare(b.text);
                case 'dueAt':
                    if (!a.dueAt) return 1;
                    if (!b.dueAt) return -1;
                    return new Date(a.dueAt) - new Date(b.dueAt);
                case 'createdAt':
                default:
                    // Default behavior: Newest first
                    return new Date(b.createdAt) - new Date(a.createdAt);
            }
        });
    }, [todos, searchQuery, sortBy]);


    // Handlers
    const handleDragStart = (e, todo) => {
        setDraggedItem(todo);
        e.dataTransfer.effectAllowed = "move";
    };

    const handleDragOver = (e, targetTodo) => {
        e.preventDefault();
        // Since we only use Board view now, column-based status updates are handled in Board.jsx onDrop
        // Manual reordering across tasks is disabled for now to maintain column integrity
    };

    const handleDragEnd = () => setDraggedItem(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (inputValue.trim()) {
            const payload = {
                text: inputValue.trim(),
                description: description.trim(),
                listTitle: newListTitle || 'Default',
                priority,
                dueAt: dueDate || null,
                subtasks,
                labels,
                coverColor
            };

            if (editingTodoId) {
                updateTodo(editingTodoId, payload);
                setEditingTodoId(null);
            } else {
                addTodo(payload.text, payload.listTitle, payload.description, payload);
            }

            // Sync project list if new
            const finalProject = payload.listTitle;
            if (finalProject !== 'Default' && !projects.includes(finalProject)) {
                addProject(finalProject);
            }

            // Reset form
            handleCancel();
        }
    };

    const handleEdit = (todo) => {
        setEditingTodoId(todo.id);
        setInputValue(todo.text);
        setDescription(todo.description || '');
        setNewListTitle(todo.listTitle || '');
        setPriority(todo.priority || 'medium');
        setDueDate(todo.dueAt ? todo.dueAt.split('T')[0] : '');
        setIsTodoModalOpen(true);
        setSubtasks(todo.subtasks || []);
        setLabels(todo.labels || []);
        setCoverColor(todo.coverColor || null);
        setIsDescriptionEditing(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancel = () => {
        setEditingTodoId(null);
        setInputValue('');
        setDescription('');
        setNewListTitle('');
        setPriority('medium');
        setDueDate('');
        setSubtasks([]);
        setSubtaskInput('');
        setLabels([]);
        setLabelInput('');
        setCoverColor(null);
        setIsDescriptionEditing(false);
        setIsTodoModalOpen(false);
    };

    const toggleSubtask = (todoId, idx) => {
        const todo = todos.find(t => t.id === todoId);
        if (!todo) return;
        const updatedSubtasks = todo.subtasks?.map((s, i) =>
            i === idx ? { ...s, done: !s.done } : s
        );
        updateTodo(todoId, { subtasks: updatedSubtasks });
        // Update local state if this is the currently editing todo
        if (editingTodoId === todoId) {
            setSubtasks(updatedSubtasks);
        }
    };

    const currentEditingTodo = useMemo(() => {
        return todos.find(t => t.id === editingTodoId);
    }, [todos, editingTodoId]);

    return (
        <div className="todo-view main-col">
            {/* Render based on view mode */}
            {viewMode === 'board' && (
                <Board
                    filteredTodos={filteredTodos}
                    onUpdateTodoStatus={updateTodoStatus}
                    draggedItem={draggedItem}
                    viewMode={viewMode}
                    onToggle={toggleTodo}
                    onEdit={handleEdit}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDragEnd={handleDragEnd}
                />
            )}

            {/* Modal for Add/Edit Task */}
            {isTodoModalOpen && (
                <div className="modal-overlay" onClick={handleCancel}>
                    <form className="modal-card" onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <div className="header-info">
                                <div className="header-text">
                                    <div className="title-row">
                                        <h2 className="modal-title">{editingTodoId ? 'Edit Task' : 'Add Task'}</h2>
                                    </div>
                                    <p className="modal-subtitle">
                                        {editingTodoId ? 'Update your task details' : 'What needs to be done?'}
                                    </p>
                                </div>
                            </div>
                            <div className="header-actions">
                                <button type="button" className="btn-secondary btn-cancel" onClick={handleCancel}>
                                    {editingTodoId ? 'Close' : 'Cancel'}
                                </button>
                                {!editingTodoId && (
                                    <button type="submit" className="btn-primary btn-save">
                                        Create Task
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="modal-body-wrapper">
                            <div className="form-body">
                                {/* Left Column: Main Content */}
                                <div className="form-main">

                                    <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        {editingTodoId && currentEditingTodo && (
                                            <div
                                                className={`modal-check-circle ${currentEditingTodo.completed ? 'checked' : ''}`}
                                                onClick={() => toggleTodo(editingTodoId)}
                                                title={currentEditingTodo.completed ? "Mark as Undone" : "Mark as Done"}
                                                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', color: currentEditingTodo.completed ? 'var(--primary)' : 'var(--text-muted)' }}
                                            >
                                                {currentEditingTodo.completed ? <IconCheckSquare size={24} /> : <div style={{ width: 24, height: 24, border: '2px solid currentColor', borderRadius: 6 }}></div>}
                                            </div>
                                        )}
                                        <input
                                            type="text"
                                            className="input-field main-input"
                                            placeholder="E.g., Complete project proposal"
                                            value={inputValue}
                                            onChange={(e) => setInputValue(e.target.value)}
                                            onBlur={() => {
                                                if (editingTodoId && inputValue.trim()) {
                                                    updateTodo(editingTodoId, { text: inputValue.trim() });
                                                }
                                            }}
                                            required
                                            autoFocus={!!editingTodoId}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <div className="description-header">
                                            <label className="form-label">Description</label>
                                            {editingTodoId && !isDescriptionEditing && (
                                                <button
                                                    type="button"
                                                    className="btn-edit-description"
                                                    onClick={() => setIsDescriptionEditing(true)}
                                                >
                                                    Edit
                                                </button>
                                            )}
                                        </div>

                                        {(!editingTodoId || isDescriptionEditing) ? (
                                            <div className="description-edit-wrapper">
                                                <ReactQuill
                                                    theme="snow"
                                                    value={description}
                                                    onChange={setDescription}
                                                    className="quill-editor"
                                                    placeholder="Add details about this task..."
                                                />
                                                {editingTodoId && isDescriptionEditing && (
                                                    <div className="description-actions">
                                                        <button
                                                            type="button"
                                                            className="btn-primary btn-save-desc"
                                                            onClick={() => {
                                                                updateTodo(editingTodoId, { description });
                                                                setIsDescriptionEditing(false);
                                                            }}
                                                        >
                                                            Save
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="btn-secondary btn-cancel-desc"
                                                            onClick={() => {
                                                                const todo = todos.find(t => t.id === editingTodoId);
                                                                setDescription(todo?.description || '');
                                                                setIsDescriptionEditing(false);
                                                            }}
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div
                                                className="description-display"
                                                onClick={() => setIsDescriptionEditing(true)}
                                            >
                                                {description ? (
                                                    <div
                                                        className="description-content ql-editor"
                                                        dangerouslySetInnerHTML={{ __html: description }}
                                                    />
                                                ) : (
                                                    <div className="description-placeholder">
                                                        Add a more detailed description...
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Subtasks */}
                                    <div className="form-group">
                                        <div className="subtasks-header-row">
                                            <label className="form-label">Subtasks</label>
                                            {subtasks.length > 0 && (
                                                <span className="subtasks-percentage">
                                                    {Math.round((subtasks.filter(s => s.done).length / subtasks.length) * 100)}%
                                                </span>
                                            )}
                                        </div>

                                        {subtasks.length > 0 && (
                                            <div className="subtasks-progress-bar">
                                                <div
                                                    className="progress-fill"
                                                    style={{ width: `${(subtasks.filter(s => s.done).length / subtasks.length) * 100}%` }}
                                                ></div>
                                            </div>
                                        )}

                                        <div className="subtask-input-wrapper">
                                            <input
                                                type="text"
                                                className="input-field"
                                                placeholder="Add a subtask..."
                                                value={subtaskInput}
                                                onChange={(e) => setSubtaskInput(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' && subtaskInput.trim()) {
                                                        const newST = [...subtasks, { text: subtaskInput.trim(), done: false }];
                                                        setSubtasks(newST);
                                                        if (editingTodoId) updateTodo(editingTodoId, { subtasks: newST });
                                                        setSubtaskInput('');
                                                    }
                                                }}
                                            />
                                            <button
                                                type="button"
                                                className="btn-add-subtask"
                                                onClick={() => {
                                                    if (subtaskInput.trim()) {
                                                        const newST = [...subtasks, { text: subtaskInput.trim(), done: false }];
                                                        setSubtasks(newST);
                                                        if (editingTodoId) updateTodo(editingTodoId, { subtasks: newST });
                                                        setSubtaskInput('');
                                                    }
                                                }}
                                            >
                                                <IconPlus size={18} />
                                            </button>
                                        </div>
                                        {subtasks.length > 0 && (
                                            <div className="subtask-list">
                                                {subtasks.map((s, i) => (
                                                    <div key={i} className="added-subtask">
                                                        <input
                                                            type="checkbox"
                                                            checked={s.done}
                                                            onChange={() => toggleSubtask(editingTodoId, i)}
                                                            disabled={!editingTodoId}
                                                        />
                                                        <span style={{ textDecoration: s.done ? 'line-through' : 'none' }}>{s.text}</span>
                                                        <button
                                                            type="button"
                                                            className="btn-remove-subtask"
                                                            onClick={() => {
                                                                const newST = subtasks.filter((_, idx) => idx !== i);
                                                                setSubtasks(newST);
                                                                if (editingTodoId) updateTodo(editingTodoId, { subtasks: newST });
                                                            }}
                                                        >
                                                            ✕
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Right Column: Meta Info */}
                                <div className="form-sidebar">

                                    {editingTodoId && currentEditingTodo && (
                                        <div className="form-group side-info-group">
                                            <label className="form-label">Task Info</label>
                                            <div className="side-detail-item">
                                                <span className="detail-label">Task ID:</span>
                                                <span className="detail-value">#{currentEditingTodo.id.slice(-6)}</span>
                                            </div>
                                            <div className="side-detail-item">
                                                <span className="detail-label">Status:</span>
                                                <span className="detail-value status-badge-inline" data-status={currentEditingTodo.status}>
                                                    {currentEditingTodo.status.toUpperCase()}
                                                </span>
                                            </div>
                                            <div className="side-detail-item">
                                                <span className="detail-label">Time Spent:</span>
                                                <span className="detail-value">
                                                    <IconClock size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                                                    {getLiveDuration(currentEditingTodo)}
                                                </span>
                                            </div>
                                            <div className="side-detail-item">
                                                <span className="detail-value">{formatDateFull(currentEditingTodo.createdAt)}</span>
                                            </div>
                                        </div>
                                    )}


                                    <div className="form-group">
                                        <label className="form-label">Set Priority</label>
                                        <div className="priority-grid">
                                            {['low', 'medium', 'high'].map((p) => (
                                                <div
                                                    key={p}
                                                    className={`priority-option priority-${p} ${priority === p ? 'selected' : ''}`}
                                                    onClick={() => {
                                                        setPriority(p);
                                                        if (editingTodoId) updateTodo(editingTodoId, { priority: p });
                                                    }}
                                                >
                                                    {p.charAt(0).toUpperCase() + p.slice(1)}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Project</label>
                                        <div className="project-input-wrapper">
                                            <input
                                                type="text"
                                                className="input-field"
                                                placeholder="Select or type a project..."
                                                list="project-list"
                                                value={newListTitle}
                                                onChange={(e) => setNewListTitle(e.target.value)}
                                                onBlur={() => {
                                                    if (editingTodoId) updateTodo(editingTodoId, { listTitle: newListTitle || 'Default' });
                                                    // Also sync project list if new
                                                    if (newListTitle && newListTitle !== 'Default' && !projects.includes(newListTitle)) {
                                                        addProject(newListTitle);
                                                    }
                                                }}
                                            />
                                            <datalist id="project-list">
                                                <option value="Default" />
                                                {projects.map(p => (
                                                    <option key={p} value={p} />
                                                ))}
                                            </datalist>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Labels</label>
                                        <div className="label-input-wrapper">
                                            <input
                                                type="text"
                                                className="input-field"
                                                placeholder="Add a label (press Enter)..."
                                                value={labelInput}
                                                onChange={(e) => setLabelInput(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' && labelInput.trim()) {
                                                        e.preventDefault();
                                                        const cleanLabel = labelInput.trim();
                                                        if (!labels.includes(cleanLabel)) {
                                                            const newLabels = [...labels, cleanLabel];
                                                            setLabels(newLabels);
                                                            if (editingTodoId) updateTodo(editingTodoId, { labels: newLabels });
                                                        }
                                                        setLabelInput('');
                                                    }
                                                }}
                                            />
                                        </div>
                                        {labels.length > 0 && (
                                            <div className="label-tags-list">
                                                {labels.map((l, i) => (
                                                    <span key={i} className="label-tag">
                                                        {l}
                                                        <button
                                                            type="button"
                                                            className="btn-remove-tag"
                                                            onClick={() => {
                                                                const newLabels = labels.filter((_, idx) => idx !== i);
                                                                setLabels(newLabels);
                                                                if (editingTodoId) updateTodo(editingTodoId, { labels: newLabels });
                                                            }}
                                                        >
                                                            ✕
                                                        </button>
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Set Due Date</label>
                                        <input
                                            type="date"
                                            className="input-field"
                                            value={dueDate}
                                            onChange={e => {
                                                setDueDate(e.target.value);
                                                if (editingTodoId) updateTodo(editingTodoId, { dueAt: e.target.value });
                                            }}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Card Cover</label>
                                        <div className="cover-color-grid">
                                            {coverColors.map((c) => (
                                                <div
                                                    key={c.name}
                                                    className={`cover-option ${coverColor === c.value ? 'selected' : ''}`}
                                                    style={{ backgroundColor: c.value || 'transparent', border: !c.value ? '2px dashed var(--glass-border)' : 'none' }}
                                                    onClick={() => {
                                                        setCoverColor(c.value);
                                                        if (editingTodoId) updateTodo(editingTodoId, { coverColor: c.value });
                                                    }}
                                                    title={c.name}
                                                >
                                                    {!c.value && <IconClose size={14} />}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {editingTodoId && currentEditingTodo && (
                            <div className="modal-footer">
                                <div className="footer-left">
                                    <div className="timer-controls-inline">
                                        {currentEditingTodo.status === 'idle' && (
                                            <button type="button" className="btn-timer-control start" onClick={() => startTodo(editingTodoId)} title="Start Timer">
                                                <IconPlay size={16} />
                                                <span>Start</span>
                                            </button>
                                        )}
                                        {currentEditingTodo.status === 'running' && (
                                            <button type="button" className="btn-timer-control pause" onClick={() => pauseTodo(editingTodoId)} title="Pause Timer">
                                                <IconPause size={16} />
                                                <span>Pause</span>
                                            </button>
                                        )}
                                        {currentEditingTodo.status === 'paused' && (
                                            <button type="button" className="btn-timer-control resume" onClick={() => resumeTodo(editingTodoId)} title="Resume Timer">
                                                <IconPlay size={16} />
                                                <span>Resume</span>
                                            </button>
                                        )}
                                        {(currentEditingTodo.status === 'running' || currentEditingTodo.status === 'paused') && (
                                            <button type="button" className="btn-timer-control complete" onClick={() => endTodo(editingTodoId)} title="Stop Timer (Saved)">
                                                <IconStop size={16} />
                                                <span>Stop</span>
                                            </button>
                                        )}
                                        {currentEditingTodo.status === 'completed' && (
                                            <button type="button" className="btn-timer-control restart" onClick={() => restartTodo(editingTodoId)} title="Restart Task">
                                                <IconRefresh size={16} />
                                                <span>Restart</span>
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <div className="footer-right">
                                    <button
                                        type="button"
                                        className="btn-secondary btn-danger-outline"
                                        onClick={() => {
                                            if (window.confirm('Are you sure you want to delete this task?')) {
                                                deleteTodo(editingTodoId);
                                                handleCancel();
                                            }
                                        }}
                                    >
                                        <IconTrash size={16} /> Delete Task
                                    </button>
                                </div>
                            </div>
                        )}
                    </form>
                </div>
            )}
        </div>
    );
}
