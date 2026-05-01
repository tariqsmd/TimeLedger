import React, { useState } from 'react';
import { useQuickTasks } from '../../utils/QuickTasksContext';
import { IconClose, IconPlus, IconCheckSquare, IconCalendar, IconClock, IconTag, IconTrash, IconList } from '../../assets/Icons';
import './QuickTasks.scss';

export default function QuickTaskModal() {
    const { 
        isQuickTasksModalOpen, 
        setIsQuickTasksModalOpen, 
        quickTasks, 
        addQuickTask, 
        deleteQuickTask, 
        toggleQuickTaskStatus,
        quickTasksModalMode,
        setQuickTasksModalMode
    } = useQuickTasks();

    const [title, setTitle] = useState('');
    const [note, setNote] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [priority, setPriority] = useState('medium');

    if (!isQuickTasksModalOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim()) return;

        addQuickTask({
            title,
            note,
            date,
            time,
            priority
        });

        // Reset form and switch to view mode to see the added task
        setTitle('');
        setNote('');
        setDate('');
        setTime('');
        setPriority('medium');
        setQuickTasksModalMode('view');
    };

    return (
        <div className="quick-tasks-modal-overlay" onClick={() => setIsQuickTasksModalOpen(false)}>
            <div className="quick-tasks-modal" onClick={e => e.stopPropagation()}>
                <div className="quick-tasks-header">
                    <h2>
                        {quickTasksModalMode === 'add' ? <IconPlus size={20} /> : <IconList size={20} />}
                        {quickTasksModalMode === 'add' ? 'Add Quick Task' : 'Quick Tasks & Notes'}
                    </h2>
                    <div className="header-actions">
                        <div className="modal-tabs">
                            <button 
                                className={`tab-btn ${quickTasksModalMode === 'add' ? 'active' : ''}`}
                                onClick={() => setQuickTasksModalMode('add')}
                            >
                                <IconPlus size={16} /> Add
                            </button>
                            <button 
                                className={`tab-btn ${quickTasksModalMode === 'view' ? 'active' : ''}`}
                                onClick={() => setQuickTasksModalMode('view')}
                            >
                                <IconList size={16} /> View All
                            </button>
                        </div>
                        <button className="close-btn" onClick={() => setIsQuickTasksModalOpen(false)}>
                            <IconClose size={24} />
                        </button>
                    </div>
                </div>

                <div className="quick-tasks-body">
                    {quickTasksModalMode === 'add' ? (
                        <form className="quick-task-form" onSubmit={handleSubmit}>
                            <div className="form-row">
                                <input 
                                    type="text" 
                                    placeholder="What needs to be done?" 
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
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
                                    placeholder="Add a note or details..." 
                                    value={note}
                                    onChange={e => setNote(e.target.value)}
                                />
                            </div>
                            <div className="form-row">
                                <div className="input-group">
                                    <IconCalendar size={16} />
                                    <input 
                                        type="date" 
                                        value={date}
                                        onChange={e => setDate(e.target.value)}
                                    />
                                </div>
                                <div className="input-group">
                                    <IconClock size={16} />
                                    <input 
                                        type="time" 
                                        value={time}
                                        onChange={e => setTime(e.target.value)}
                                    />
                                </div>
                                <button type="submit" className="btn-add">Save Task</button>
                            </div>
                        </form>
                    ) : (
                        <div className="quick-tasks-table-container">
                            {quickTasks.length === 0 ? (
                                <div className="empty-state">
                                    No quick tasks yet. <button onClick={() => setQuickTasksModalMode('add')}>Add one</button>
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
                                        {quickTasks.map(task => (
                                            <tr key={task.id} className={`${task.status === 'complete' ? 'complete' : ''}`}>
                                                <td className="col-status">
                                                    <input 
                                                        type="checkbox" 
                                                        checked={task.status === 'complete'}
                                                        onChange={() => toggleQuickTaskStatus(task.id)}
                                                    />
                                                </td>
                                                <td className="col-date">
                                                    <div className="date-cell">
                                                        <span>{task.date || 'No date'}</span>
                                                        <small>{task.time || ''}</small>
                                                    </div>
                                                </td>
                                                <td className="col-task">
                                                    <div className="task-cell">
                                                        <strong>{task.title}</strong>
                                                        {task.note && <p>{task.note}</p>}
                                                    </div>
                                                </td>
                                                <td className="col-priority">
                                                    <span className={`priority-badge ${task.priority}`}>
                                                        {task.priority}
                                                    </span>
                                                </td>
                                                <td className="col-actions">
                                                    <button className="delete-btn" onClick={() => deleteQuickTask(task.id)}>
                                                        <IconTrash size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
