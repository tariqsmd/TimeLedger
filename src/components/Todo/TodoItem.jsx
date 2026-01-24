/**
 * TodoItem.jsx
 * Renders a single todo item with inline controls
 */
import React from 'react';
import { useIsOverdue, getLiveDuration, formatDateShort } from './useTodoUtils';
import { useState, useEffect } from 'react';
import { IconClock, IconCalendar, IconCheckSquare, IconAlignLeft, IconTag } from '../../assets/Icons';

export default function TodoItem({
    todo,
    onToggle,
    onEdit,
    onDragStart,
    onDragOver,
    onDragEnd,
    draggedItem,
    viewMode
}) {
    const [tick, setTick] = useState(0);

    useEffect(() => {
        let interval;
        if (todo.status === 'running') {
            interval = setInterval(() => setTick(t => t + 1), 1000);
        }
        return () => clearInterval(interval);
    }, [todo.status]);

    const isOverdue = useIsOverdue(todo);
    const hasIncompleteSubtasks = !todo.completed && todo.subtasks?.some(st => !st.done);

    const handleTaskClick = (e) => {
        // Prevent opening modal if clicking interactive elements
        if (e.target.closest('.checkbox') || e.target.closest('.inline-controls') || e.target.closest('.btn-menu') || e.target.closest('.dropdown') || e.target.closest('.btn-text') || e.target.closest('.btn-expand')) {
            return;
        }
        onEdit(todo);
    };

    return (
        <div
            className={`todo-item ${todo.completed ? 'completed' : ''} ${isOverdue ? 'overdue' : ''} ${draggedItem?.id === todo.id ? 'dragging' : ''}`}
            draggable={viewMode === 'board'}
            onDragStart={(e) => onDragStart(e, todo)}
            onDragOver={(e) => onDragOver(e, todo)}
            onDragEnd={onDragEnd}
            onClick={handleTaskClick}
        >
            {todo.coverColor && (
                <div className="card-cover-strip" style={{ backgroundColor: todo.coverColor }}></div>
            )}

            {/* Leading indicator: Checkbox or Timer */}
            {todo.status === 'running' ? (
                <div className="item-timer-indicator">
                    <IconClock size={14} />
                    <span className="timer-text">{getLiveDuration(todo)}</span>
                </div>
            ) : (
                <div
                    className={`checkbox ${hasIncompleteSubtasks ? 'disabled' : ''}`}
                    onClick={(e) => { e.stopPropagation(); if (!hasIncompleteSubtasks) onToggle(todo.id); }}
                    title={hasIncompleteSubtasks ? "Complete all subtasks first" : "Toggle completion"}>
                    {todo.completed && (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                    )}
                </div>
            )}

            <div className="todo-body">
                <span
                    className={`todo-text ${hasIncompleteSubtasks ? 'text-disabled' : ''}`}
                    style={{ cursor: 'pointer' }}>
                    {todo.text}
                </span>

                <div className="task-primary-info">
                    <div className="task-badges-row">
                        {todo.priority && todo.priority !== 'none' && (
                            <div className={`task-badge priority-badge priority-${todo.priority}`}>
                                <span>{todo.priority}</span>
                            </div>
                        )}
                        {todo.listTitle && todo.listTitle !== 'Default' && (
                            <div className="task-badge project-badge">
                                <span>{todo.listTitle}</span>
                            </div>
                        )}
                        {todo.dueAt && (
                            <div className={`task-badge due-badge ${isOverdue ? 'overdue' : ''}`}>
                                <IconCalendar size={12} className="badge-icon" />
                                <span>{formatDateShort(todo.dueAt)}</span>
                            </div>
                        )}
                        {todo.subtasks?.length > 0 && (
                            <div className={`task-badge subtasks-badge ${todo.subtasks.every(s => s.done) ? 'all-done' : ''}`}>
                                <IconCheckSquare size={12} className="badge-icon" />
                                <span>{todo.subtasks.filter(s => s.done).length}/{todo.subtasks.length}</span>
                            </div>
                        )}

                        {todo.labels && todo.labels.length > 0 && (
                            <div className="task-labels-container">
                                {todo.labels.map((label, idx) => (
                                    <span key={idx} className="item-label-tag">
                                        <IconTag size={10} />
                                        {label}
                                    </span>
                                ))}
                            </div>
                        )}

                        {todo.description && (
                            <div className="task-badge desc-badge" title="Has description">
                                <IconAlignLeft size={12} className="badge-icon" />
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
}
