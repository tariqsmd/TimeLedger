import React, { useState, useEffect } from 'react';
import { useApp } from '../../utils/AppContext';
import { useQuickTasks } from '../../utils/QuickTasksContext';
import { IconClose, IconPlus, IconCalendar, IconClock, IconTrash, IconList, IconEdit, IconMoreVertical } from '../../assets/Icons';
import './QuickTasks.scss';

export default function QuickTaskModal({ forcedOpen = false }) {
    const { toggleTodo, deleteTodo: deleteMainTodo, updateTodo } = useApp();
    const { 
        isQuickTasksModalOpen, 
        setIsQuickTasksModalOpen, 
        combinedTasks,
        addQuickTask, 
        deleteQuickTask, 
        toggleQuickTaskStatus,
        updateQuickTask,
        editingTask,
        setEditingTask,
        openQuickTasksModal
    } = useQuickTasks();

    const [text, setText] = useState('');
    const [description, setDescription] = useState('');
    const [dueAt, setDueAt] = useState('');
    const [time, setTime] = useState('');
    const [priority, setPriority] = useState('medium');
    const [activeDropdown, setActiveDropdown] = useState(null);

    // Populate form if editing
    useEffect(() => {
        if (editingTask) {
            setText(editingTask.text || '');
            setDescription(editingTask.description || '');
            setDueAt(editingTask.dueAt || '');
            setTime(editingTask.time || '');
            setPriority(editingTask.priority || 'medium');
        } else {
            setText('');
            setDescription('');
            setDueAt('');
            setTime('');
            setPriority('medium');
        }
    }, [editingTask]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = () => setActiveDropdown(null);
        if (activeDropdown) {
            window.addEventListener('click', handleClickOutside);
        }
        return () => window.removeEventListener('click', handleClickOutside);
    }, [activeDropdown]);

    const formatDayDate = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return dateStr;
        return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!text.trim()) return;

        const taskData = { text, description, dueAt, time, priority };

        if (editingTask) {
            if (editingTask._source === 'quick') {
                updateQuickTask(editingTask.id, taskData);
            } else {
                updateTodo(editingTask.id, taskData);
            }
        } else {
            addQuickTask(taskData);
        }

        setIsQuickTasksModalOpen(false);
        setEditingTask(null);
    };

    const handleToggle = (task) => {
        if (task._source === 'quick') {
            toggleQuickTaskStatus(task.id);
        } else {
            toggleTodo(task.id);
        }
    };

    const handleDelete = (task) => {
        if (task._source === 'quick') {
            deleteQuickTask(task.id);
        } else {
            if (window.confirm('Are you sure you want to delete this board task?')) {
                deleteMainTodo(task.id);
            }
        }
        setActiveDropdown(null);
    };

    const handleEdit = (task) => {
        openQuickTasksModal(task);
        setActiveDropdown(null);
    };

    const toggleDropdown = (e, taskId) => {
        e.stopPropagation();
        setActiveDropdown(activeDropdown === taskId ? null : taskId);
    };

    // MODAL VERSION (Add/Edit Task Form)
    if (isQuickTasksModalOpen && !forcedOpen) {
        return (
            <div className="quick-tasks-modal-overlay" onClick={() => { setIsQuickTasksModalOpen(false); setEditingTask(null); }}>
                <div className="quick-tasks-modal add-task-modal" onClick={e => e.stopPropagation()}>
                    <div className="quick-tasks-header">
                        <h2>{editingTask ? <IconEdit size={20} /> : <IconPlus size={20} />} {editingTask ? 'Edit Task' : 'Add New Task'}</h2>
                        <button className="close-btn" onClick={() => { setIsQuickTasksModalOpen(false); setEditingTask(null); }}>
                            <IconClose size={24} />
                        </button>
                    </div>
                    <div className="quick-tasks-body">
                        <form className="quick-task-form" onSubmit={handleSubmit}>
                            <div className="form-row">
                                <input 
                                    type="text" 
                                    placeholder="Task title..." 
                                    value={text}
                                    onChange={e => setText(e.target.value)}
                                    autoFocus
                                />
                                <select value={priority} onChange={e => setPriority(e.target.value)}>
                                    <option value="low">Low Priority</option>
                                    <option value="medium">Medium Priority</option>
                                    <option value="high">High Priority</option>
                                </select>
                            </div>
                            <div className="form-row">
                                <textarea 
                                    placeholder="Add details or notes..." 
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}
                                />
                            </div>
                            <div className="form-row">
                                <div className="input-group">
                                    <IconCalendar size={16} />
                                    <input type="date" value={dueAt} onChange={e => setDueAt(e.target.value)} />
                                </div>
                                <div className="input-group">
                                    <IconClock size={16} />
                                    <input type="time" value={time} onChange={e => setTime(e.target.value)} />
                                </div>
                                <button type="submit" className="btn-add">{editingTask ? 'Update Task' : 'Save Task'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }

    // PERSISTENT VIEW VERSION (List All)
    if (forcedOpen) {
        return (
            <div className="quick-tasks-persistent-view">
                <div className="quick-tasks-body">
                    <div className="quick-tasks-table-container">
                        {combinedTasks.length === 0 ? (
                            <div className="empty-state">
                                <p>Your ledger is empty.</p>
                                <button onClick={() => openQuickTasksModal()}>Create your first task</button>
                            </div>
                        ) : (
                            <table className="quick-tasks-table">
                                <thead>
                                    <tr>
                                        <th className="col-status"></th>
                                        <th className="col-date">Date & Time</th>
                                        <th className="col-task">Task & Description</th>
                                        <th className="col-priority">Priority</th>
                                        <th className="col-actions"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {combinedTasks.map(task => (
                                        <tr key={task.id} className={`${task.completed ? 'complete' : ''}`}>
                                            <td className="col-status">
                                                <div className="checkbox-wrapper">
                                                    <input 
                                                        type="checkbox" 
                                                        checked={task.completed}
                                                        onChange={() => handleToggle(task)}
                                                    />
                                                </div>
                                            </td>
                                            <td className="col-date">
                                                <div className="date-cell">
                                                    <span className="day">{formatDayDate(task.dueAt)}</span>
                                                    {task.time && <span className="time">{task.time}</span>}
                                                </div>
                                            </td>
                                            <td className="col-task">
                                                <div className="task-cell">
                                                    <div className="title-row">
                                                        <span className="task-text">{task.text}</span>
                                                        {task._source === 'main' && <span className="source-tag">Board</span>}
                                                    </div>
                                                    {task.description && (
                                                        <div className="task-description prose prose-sm" dangerouslySetInnerHTML={{ __html: task.description }}></div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="col-priority">
                                                <span className={`priority-badge ${task.priority}`}>
                                                    {task.priority}
                                                </span>
                                            </td>
                                            <td className="col-actions">
                                                <div className="action-dropdown-container">
                                                    <button 
                                                        className={`btn-action-trigger ${activeDropdown === task.id ? 'active' : ''}`} 
                                                        onClick={(e) => toggleDropdown(e, task.id)}
                                                    >
                                                        <IconMoreVertical size={18} />
                                                    </button>
                                                    {activeDropdown === task.id && (
                                                        <div className="action-dropdown-menu">
                                                            <button onClick={() => handleEdit(task)}>
                                                                <IconEdit size={14} /> Edit
                                                            </button>
                                                            <button className="delete" onClick={() => handleDelete(task)}>
                                                                <IconTrash size={14} /> Delete
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return null;
}
