import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../utils/AppContext';
import { IconClock, IconCalendar, IconCheckSquare, IconAlignLeft, IconTag, IconEdit, IconPlus, IconTrash, IconClose, IconPlay, IconPause, IconStop, IconRefresh, IconBell, IconInfo } from '../../assets/Icons';
import { getLiveDuration, formatDateFull, formatDateShort } from './useTodoUtils';
import RichEditor from '../Common/RichEditor';
import Board from './Board';
import InlineAddTask from './InlineAddTask';

// Multi-color label palette
// Palette for manual picking
const LABEL_COLORS = [
    '#61bd4f', '#f2d600', '#ff9f1a', '#eb5a46', '#c377e0',
    '#0079bf', '#00c2e0', '#51e898', '#ff78cb', '#344563'
];

const ColorPicker = ({ selected, onSelect }) => (
    <div className="color-picker-mini">
        {LABEL_COLORS.map(color => (
            <div
                key={color}
                className={`color-swatch ${selected === color ? 'selected' : ''}`}
                style={{ backgroundColor: color }}
                onClick={() => onSelect(color)}
            />
        ))}
    </div>
);

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
        addGlobalLabel,
        addChecklist,
        removeChecklist,
        updateChecklist,
        addGlobalCategory,
        isTodoModalOpen,
        setIsTodoModalOpen,
        sortBy,
        setViewMode,
        showGlobalBadges,
        setShowGlobalBadges,
        categories,
        allLabels,
        updateTodo
    } = useApp();

    // Form state
    const [inputValue, setInputValue] = useState('');
    const [description, setDescription] = useState('');
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [editingTodoId, setEditingTodoId] = useState(null);
    const [draggedItem, setDraggedItem] = useState(null);
    const [priority, setPriority] = useState('medium');
    const [dueDate, setDueDate] = useState('');
    const [labels, setLabels] = useState([]);
    const [checklists, setChecklists] = useState([]);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [newCategoryColor, setNewCategoryColor] = useState('#61bd4f');
    const [newLabelName, setNewLabelName] = useState('');
    const [newLabelColor, setNewLabelColor] = useState('#61bd4f');
    const [coverColor, setCoverColor] = useState(null);
    const [isDescriptionEditing, setIsDescriptionEditing] = useState(false);
    const [isCatPopupOpen, setIsCatPopupOpen] = useState(false);
    const [isLabPopupOpen, setIsLabPopupOpen] = useState(false);

    const getLabelColor = (name) => {
        const label = allLabels?.find(l => l.name === name);
        return label ? label.color : '#344563';
    };

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
                t.categories?.some(c => c.toLowerCase().includes(query)) ||
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
                priority,
                dueAt: dueDate || null,
                categories: selectedCategories,
                labels,
                checklists,
                coverColor
            };

            if (editingTodoId) {
                updateTodo(editingTodoId, payload);
                setEditingTodoId(null);
            } else {
                addTodo(payload.text, payload.categories[0] || 'Default', payload.description, payload);
            }

            handleCancel();
        }
    };

    const handleEdit = (todo) => {
        setEditingTodoId(todo.id);
        setInputValue(todo.text);
        setDescription(todo.description || '');
        setSelectedCategories(todo.categories || (todo.listTitle ? [todo.listTitle] : []));
        setPriority(todo.priority || 'medium');
        setDueDate(todo.dueAt ? todo.dueAt.split('T')[0] : '');
        setIsTodoModalOpen(true);
        setChecklists(todo.checklists || []);
        setLabels(todo.labels || []);
        setCoverColor(todo.coverColor || null);
        setIsDescriptionEditing(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancel = () => {
        setEditingTodoId(null);
        setInputValue('');
        setDescription('');
        setSelectedCategories([]);
        setPriority('medium');
        setDueDate('');
        setChecklists([]);
        setLabels([]);
        setNewCategoryName('');
        setNewLabelName('');
        setCoverColor(null);
        setIsDescriptionEditing(false);
        setIsTodoModalOpen(false);
    };

    const updateChecklistItem = (todoId, checklistId, itemId, updates) => {
        const newChecklists = checklists.map(c => {
            if (c.id === checklistId) {
                const newItems = c.items.map(item =>
                    item.id === itemId ? { ...item, ...updates } : item
                );
                return { ...c, items: newItems };
            }
            return c;
        });
        setChecklists(newChecklists);
        if (todoId) {
            updateTodo(todoId, { checklists: newChecklists });
        }
    };

    const addChecklistItem = (todoId, checklistId, text) => {
        if (!text.trim()) return;
        const newChecklists = checklists.map(c => {
            if (c.id === checklistId) {
                const newItem = {
                    id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
                    text: text.trim(),
                    done: false
                };
                return { ...c, items: [...c.items, newItem] };
            }
            return c;
        });
        setChecklists(newChecklists);
        if (todoId) {
            updateTodo(todoId, { checklists: newChecklists });
        }
    };

    const removeChecklistItem = (todoId, checklistId, itemId) => {
        const newChecklists = checklists.map(c => {
            if (c.id === checklistId) {
                return { ...c, items: c.items.filter(item => item.id !== itemId) };
            }
            return c;
        });
        setChecklists(newChecklists);
        if (todoId) {
            updateTodo(todoId, { checklists: newChecklists });
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

            {viewMode === 'list' && (
                <div className="todo-list-view">
                    <div className="view-header">
                        <h2>Tasks</h2>
                    </div>
                    <div className="list-content">
                        {filteredTodos.map(todo => (
                            <div key={todo.id} className="todo-item-row" onClick={() => handleEdit(todo)}>
                                <div className="item-check" onClick={(e) => { e.stopPropagation(); toggleTodo(todo.id); }}>
                                    {todo.completed ? (
                                        <IconCheckSquare size={20} color="var(--primary)" />
                                    ) : (
                                        <div className="check-placeholder"></div>
                                    )}
                                </div>
                                <div className="item-main">
                                    <div className="item-title-row">
                                        <div className={`item-title ${todo.completed ? 'completed' : ''}`}>{todo.text}</div>
                                        <button
                                            className={`btn-toggle-badges ${showGlobalBadges ? 'active' : ''}`}
                                            onClick={(e) => { e.stopPropagation(); setShowGlobalBadges(!showGlobalBadges); }}
                                            title="Toggle Badges Globally"
                                        >
                                            <IconInfo size={14} />
                                        </button>
                                    </div>
                                    {showGlobalBadges && (
                                        <div className="item-meta">
                                            <span className={`priority-tag priority-${todo.priority}`}>
                                                <IconBell size={12} />
                                                {todo.priority}
                                            </span>
                                            {todo.categories?.map((cat, idx) => (
                                                <span key={`${cat}-${idx}`} className="category-tag">
                                                    <IconTag size={12} />
                                                    {cat}
                                                </span>
                                            ))}
                                            {todo.labels?.map((l, idx) => (
                                                <span key={`${l}-${idx}`} className="label-tag-badge" style={{ backgroundColor: getLabelColor(l) }}>
                                                    {l}
                                                </span>
                                            ))}
                                            {todo.dueAt && (
                                                <span className="due-tag">
                                                    <IconCalendar size={12} /> {formatDateShort(todo.dueAt)}
                                                </span>
                                            )}
                                            {todo.checklists?.some(c => c.items.length > 0) && (
                                                <span className="info-tag">
                                                    <IconCheckSquare size={12} />
                                                    {(() => {
                                                        const total = todo.checklists.reduce((acc, c) => acc + c.items.length, 0);
                                                        const done = todo.checklists.reduce((acc, c) => acc + c.items.filter(i => i.done).length, 0);
                                                        return `${done}/${total}`;
                                                    })()}
                                                </span>
                                            )}
                                            {todo.description && (
                                                <span className="info-tag">
                                                    <IconAlignLeft size={12} />
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>
                                <div className="item-status">
                                    <span className={`status-pill ${todo.status}`}>{todo.status.toUpperCase()}</span>
                                </div>
                            </div>
                        ))}
                        <div className="list-inline-add">
                            <InlineAddTask onAdd={(text, list, status) => addTodo(text, list || 'Default', '', { status: status || 'idle' })} />
                        </div>
                    </div>
                    {filteredTodos.length === 0 && (
                        <div className="empty-state">No tasks found</div>
                    )}
                </div>
            )}

            {viewMode === 'table' && (
                <div className="todo-table-view">
                    <div className="view-header">
                        <h2>Task Master List</h2>
                    </div>
                    <div className="table-container">
                        <table className="tasks-table">
                            <thead>
                                <tr>
                                    <th className="col-check">Done</th>
                                    <th className="col-title">Task Title</th>
                                    <th className="col-category">Category</th>
                                    <th className="col-priority">Priority</th>
                                    <th className="col-due">Due Date</th>
                                    <th className="col-status">Status</th>
                                    <th className="col-info">Info</th>
                                    <th className="col-time">Time</th>
                                    <th className="col-actions"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTodos.map(todo => (
                                    <tr key={todo.id} onClick={() => handleEdit(todo)} className={todo.completed ? 'completed-row' : ''}>
                                        <td className="col-check" onClick={(e) => { e.stopPropagation(); toggleTodo(todo.id); }}>
                                            {todo.completed ? (
                                                <IconCheckSquare size={18} color="var(--primary)" />
                                            ) : (
                                                <div className="check-placeholder"></div>
                                            )}
                                        </td>
                                        <td className="col-title">
                                            <div className="title-text">{todo.text}</div>
                                        </td>
                                        <td className="col-category">
                                            <div className="badge-list-cell">
                                                {todo.categories?.map((cat, idx) => (
                                                    <span key={`${cat}-${idx}`} className="category-pill">
                                                        {cat}
                                                    </span>
                                                ))}
                                                {(!todo.categories || todo.categories.length === 0) && <span className="category-pill">Default</span>}
                                            </div>
                                        </td>
                                        <td className="col-priority">
                                            <span className={`priority-pill ${todo.priority}`}>{todo.priority}</span>
                                        </td>
                                        <td className="col-due">
                                            {todo.dueAt ? new Date(todo.dueAt).toLocaleDateString() : '-'}
                                        </td>
                                        <td className="col-status">
                                            <span className={`status-pill ${todo.status}`}>{todo.status}</span>
                                        </td>
                                        <td className="col-info">
                                            <div className="info-badges">
                                                {todo.checklists?.some(c => c.items.length > 0) && (
                                                    <span className="info-item">
                                                        <IconCheckSquare size={14} />
                                                        <small>
                                                            {(() => {
                                                                const total = todo.checklists.reduce((acc, c) => acc + c.items.length, 0);
                                                                const done = todo.checklists.reduce((acc, c) => acc + c.items.filter(i => i.done).length, 0);
                                                                return `${done}/${total}`;
                                                            })()}
                                                        </small>
                                                    </span>
                                                )}
                                                {todo.description && (
                                                    <span className="info-item" title="Has description">
                                                        <IconAlignLeft size={14} />
                                                    </span>
                                                )}
                                                {todo.labels?.length > 0 && (
                                                    <div className="label-dots-cell">
                                                        {todo.labels.map((l, idx) => (
                                                            <span key={`${l}-${idx}`} className="label-dot" style={{ backgroundColor: getLabelColor(l) }} title={l}></span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="col-time">
                                            <div className={`time-display ${todo.status === 'running' ? 'active' : ''}`}>
                                                {getLiveDuration(todo)}
                                            </div>
                                        </td>
                                        <td className="col-actions" onClick={(e) => e.stopPropagation()}>
                                            <div className="actions-cell">
                                                <button className="btn-table-action" onClick={() => handleEdit(todo)} title="Edit">
                                                    <IconEdit size={14} />
                                                </button>
                                                <button className="btn-table-action color-danger" onClick={() => deleteTodo(todo.id)} title="Delete">
                                                    <IconTrash size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr >
                                ))}
                                <tr className="row-inline-add">
                                    <td colSpan="9">
                                        <InlineAddTask onAdd={(text, list, status) => addTodo(text, list || 'Default', '', { status: status || 'idle' })} />
                                    </td>
                                </tr>
                            </tbody >
                        </table >
                        {
                            filteredTodos.length === 0 && (
                                <div className="empty-state">No tasks found</div>
                            )
                        }
                    </div >
                </div >
            )}

            {/* Modal for Add/Edit Task */}
            {
                isTodoModalOpen && (
                    <div className="modal-overlay" onClick={handleCancel}>
                        <form className="modal-card" onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <div className="header-info">
                                    <div className="header-text">
                                        <div className="title-row">
                                            <h2 className="modal-title">{editingTodoId ? 'Edit Task' : 'Add Task'}</h2>
                                        </div>
                                    </div>
                                </div>
                                <div className="header-actions">
                                    {editingTodoId && currentEditingTodo && (
                                        <div className="header-timer-indicator">
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
                                            <div className="header-time-spent">
                                                <IconClock size={16} />
                                                <span>{getLiveDuration(currentEditingTodo)}</span>
                                            </div>
                                        </div>
                                    )}
                                    <button type="button" className="btn-close-modal" onClick={handleCancel} title="Close">
                                        <IconClose size={24} />
                                    </button>
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
                                                placeholder="E.g., Complete category proposal"
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
                                                    <RichEditor
                                                        value={description}
                                                        onChange={setDescription}
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
                                                            className="description-content prose"
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

                                        {/* Multiple Subtask Lists */}
                                        <div className="checklists-container">
                                            {checklists.map((c) => {
                                                const total = c.items ? c.items.length : 0;
                                                const done = c.items ? c.items.filter(i => i.done).length : 0;
                                                const percent = total > 0 ? Math.round((done / total) * 100) : 0;

                                                return (
                                                    <div key={c.id} className="checklist-block form-group">
                                                        <div className="subtasks-header-row">
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                                                                <IconCheckSquare size={20} />
                                                                <input
                                                                    type="text"
                                                                    className="checklist-title-input"
                                                                    value={c.title}
                                                                    onChange={(e) => {
                                                                        const newCL = checklists.map(cl => cl.id === c.id ? { ...cl, title: e.target.value } : cl);
                                                                        setChecklists(newCL);
                                                                        if (editingTodoId) updateTodo(editingTodoId, { checklists: newCL });
                                                                    }}
                                                                />
                                                            </div>
                                                            <div className="header-actions-checklist">
                                                                {total > 0 && <span className="subtasks-percentage">{percent}%</span>}
                                                                <button
                                                                    type="button"
                                                                    className="btn-remove-checklist"
                                                                    onClick={() => {
                                                                        const newCL = checklists.filter(cl => cl.id !== c.id);
                                                                        setChecklists(newCL);
                                                                        if (editingTodoId) updateTodo(editingTodoId, { checklists: newCL });
                                                                    }}
                                                                >
                                                                    Delete
                                                                </button>
                                                            </div>
                                                        </div>

                                                        {total > 0 && (
                                                            <div className="subtasks-progress-bar">
                                                                <div className="progress-fill" style={{ width: `${percent}%` }}></div>
                                                            </div>
                                                        )}

                                                        <div className="subtask-list">
                                                            {c.items && c.items.map((item) => (
                                                                <div key={item.id || item.text} className="added-subtask">
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={item.done}
                                                                        onChange={() => updateChecklistItem(editingTodoId, c.id, item.id, { done: !item.done })}
                                                                    />
                                                                    <span
                                                                        className={item.done ? 'subtask-done' : ''}
                                                                        contentEditable="true"
                                                                        onBlur={(e) => updateChecklistItem(editingTodoId, c.id, item.id, { text: e.target.innerText })}
                                                                        suppressContentEditableWarning={true}
                                                                    >
                                                                        {item.text}
                                                                    </span>
                                                                    <button
                                                                        type="button"
                                                                        className="btn-remove-subtask"
                                                                        onClick={() => removeChecklistItem(editingTodoId, c.id, item.id)}
                                                                    >
                                                                        <IconTrash size={14} />
                                                                    </button>
                                                                </div>
                                                            ))}
                                                        </div>

                                                        <div className="subtask-input-wrapper">
                                                            <input
                                                                type="text"
                                                                className="input-field"
                                                                placeholder="Add an item..."
                                                                onKeyDown={(e) => {
                                                                    if (e.key === 'Enter' && e.target.value.trim()) {
                                                                        addChecklistItem(editingTodoId, c.id, e.target.value);
                                                                        e.target.value = '';
                                                                    }
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                );
                                            })}

                                            <button
                                                type="button"
                                                className="btn-add-another-checklist"
                                                onClick={() => {
                                                    const newCL = [...checklists, { id: Date.now().toString() + Math.random().toString(36).substr(2, 5), title: 'Subtask List', items: [] }];
                                                    setChecklists(newCL);
                                                    if (editingTodoId) updateTodo(editingTodoId, { checklists: newCL });
                                                }}
                                            >
                                                <IconPlus size={16} /> Add another list
                                            </button>
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

                                        <div className="form-group">
                                            <div className="side-label-row">
                                                <label className="form-label">Categories</label>
                                                <button type="button" className="btn-add-tag-header" onClick={() => setIsCatPopupOpen(!isCatPopupOpen)}>
                                                    {isCatPopupOpen === true ? "Close" : "Add"}
                                                </button>
                                            </div>
                                            <div className="selected-tags-container">
                                                {selectedCategories.length > 0 && (
                                                    selectedCategories.map((cat, idx) => (<span key={`${cat}-${idx}`} className="tag-badge-pill" style={{ color: `#000` }}>{cat}</span>))
                                                )}
                                            </div>

                                            {isCatPopupOpen && (
                                                <div className="tag-selector-popup">
                                                    <div className="popup-header">
                                                        <span>Select Category</span>
                                                    </div>
                                                    <div className="popup-body">
                                                        <div className="tag-search-list">
                                                            {categories && categories.map(c => (
                                                                <div key={c.name} className="tag-item-option" onClick={() => {
                                                                    const isSelected = selectedCategories.includes(c.name);
                                                                    const newCats = isSelected ? selectedCategories.filter(i => i !== c.name) : [...selectedCategories, c.name];
                                                                    setSelectedCategories(newCats);
                                                                    if (editingTodoId) updateTodo(editingTodoId, { categories: newCats });
                                                                }}>
                                                                    <div className="tag-color-circle" style={{ backgroundColor: c.color }}></div>
                                                                    <span>{c.name}</span>
                                                                    {selectedCategories.includes(c.name) && <IconCheckSquare size={14} color="var(--primary)" />}
                                                                </div>
                                                            ))}
                                                        </div>
                                                        <div className="popup-divider"></div>
                                                        <div className="popup-add-form">
                                                            <input
                                                                type="text"
                                                                placeholder="Add new category..."
                                                                value={newCategoryName}
                                                                onChange={(e) => setNewCategoryName(e.target.value)}
                                                                onKeyDown={(e) => {
                                                                    if (e.key === 'Enter' && newCategoryName.trim()) {
                                                                        addGlobalCategory(newCategoryName.trim(), newCategoryColor);
                                                                        const newCats = [...selectedCategories, newCategoryName.trim()];
                                                                        setSelectedCategories(newCats);
                                                                        if (editingTodoId) updateTodo(editingTodoId, { categories: newCats });
                                                                        setNewCategoryName('');
                                                                    }
                                                                }}
                                                            />
                                                            <div className="color-picker-row">
                                                                <ColorPicker selected={newCategoryColor} onSelect={setNewCategoryColor} />
                                                                <button type="button" className="btn-add-mini" onClick={() => {
                                                                    if (newCategoryName.trim()) {
                                                                        addGlobalCategory(newCategoryName.trim(), newCategoryColor);
                                                                        const newCats = [...selectedCategories, newCategoryName.trim()];
                                                                        setSelectedCategories(newCats);
                                                                        if (editingTodoId) updateTodo(editingTodoId, { categories: newCats });
                                                                        setNewCategoryName('');
                                                                    }
                                                                }}>Add</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="form-group">
                                            <div className="side-label-row">
                                                <label className="form-label">Labels</label>
                                                <button type="button" className="btn-add-tag-header" onClick={() => setIsLabPopupOpen(!isLabPopupOpen)}>
                                                    {isLabPopupOpen === true ? "Close" : "Add"}
                                                </button>
                                            </div>
                                            <div className="selected-tags-container">
                                                {labels.length > 0 ? (
                                                    labels.map((l, idx) => (
                                                        <span key={`${l}-${idx}`} className="tag-badge-pill" style={{ backgroundColor: getLabelColor(l) }}>
                                                            {l}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="no-tags-placeholder">No labels</span>
                                                )}
                                            </div>

                                            {isLabPopupOpen && (
                                                <div className="tag-selector-popup">
                                                    <div className="popup-header">
                                                        <span>Select Label</span>
                                                    </div>
                                                    <div className="popup-body">
                                                        <div className="tag-search-list">
                                                            {allLabels && allLabels.map(l => (
                                                                <div key={l.name} className="tag-item-option" onClick={() => {
                                                                    const isSelected = labels.includes(l.name);
                                                                    const newLabs = isSelected ? labels.filter(i => i !== l.name) : [...labels, l.name];
                                                                    setLabels(newLabs);
                                                                    if (editingTodoId) updateTodo(editingTodoId, { labels: newLabs });
                                                                }}>
                                                                    <div className="tag-color-circle" style={{ backgroundColor: l.color }}></div>
                                                                    <span>{l.name}</span>
                                                                    {labels.includes(l.name) && <IconCheckSquare size={14} color="var(--primary)" />}
                                                                </div>
                                                            ))}
                                                        </div>
                                                        <div className="popup-divider"></div>
                                                        <div className="popup-add-form">
                                                            <input
                                                                type="text"
                                                                placeholder="Add new label..."
                                                                value={newLabelName}
                                                                onChange={(e) => setNewLabelName(e.target.value)}
                                                                onKeyDown={(e) => {
                                                                    if (e.key === 'Enter' && newLabelName.trim()) {
                                                                        addGlobalLabel(newLabelName.trim(), newLabelColor);
                                                                        const newLabs = [...labels, newLabelName.trim()];
                                                                        setLabels(newLabs);
                                                                        if (editingTodoId) updateTodo(editingTodoId, { labels: newLabs });
                                                                        setNewLabelName('');
                                                                    }
                                                                }}
                                                            />
                                                            <div className="color-picker-row">
                                                                <ColorPicker selected={newLabelColor} onSelect={setNewLabelColor} />
                                                                <button type="button" className="btn-add-mini" onClick={() => {
                                                                    if (newLabelName.trim()) {
                                                                        addGlobalLabel(newLabelName.trim(), newLabelColor);
                                                                        const newLabs = [...labels, newLabelName.trim()];
                                                                        setLabels(newLabs);
                                                                        if (editingTodoId) updateTodo(editingTodoId, { labels: newLabs });
                                                                        setNewLabelName('');
                                                                    }
                                                                }}>Add</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {editingTodoId && (
                                            <div className="sidebar-footer-actions">
                                                <button
                                                    type="button"
                                                    className="btn-sidebar-delete"
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
                                        )}
                                    </div>
                                </div>
                            </div>

                            {!editingTodoId && (
                                <div className="modal-actions-footer">
                                    <button type="submit" className="btn-primary btn-save-full">
                                        Create Task
                                    </button>
                                </div>
                            )}
                        </form>
                    </div>
                )
            }
        </div >
    );
}
