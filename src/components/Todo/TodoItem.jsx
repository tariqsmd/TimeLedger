/**
 * TodoItem.jsx
 * Renders a single todo item with inline controls
 */
import React, { useState, useEffect } from 'react';
import { useIsOverdue, getLiveDuration, formatDateShort } from './useTodoUtils';
import { IconClock, IconCalendar, IconCheckSquare, IconAlignLeft, IconTag, IconInfo, IconBell } from '../../assets/Icons';
import { useApp } from '../../utils/AppContext';

// Multi-color label palette
const LABEL_COLORS = [
    '#61bd4f', '#f2d600', '#ff9f1a', '#eb5a46', '#c377e0',
    '#0079bf', '#00c2e0', '#51e898', '#ff78cb', '#344563'
];

const getLabelColor = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return LABEL_COLORS[Math.abs(hash) % LABEL_COLORS.length];
};

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
    const { showGlobalBadges, setShowGlobalBadges, allLabels, categories } = useApp();
    const [tick, setTick] = useState(0);

    useEffect(() => {
        let interval;
        if (todo.status === 'running') {
            interval = setInterval(() => setTick(t => t + 1), 1000);
        }
        return () => clearInterval(interval);
    }, [todo.status]);

    const isOverdue = useIsOverdue(todo);
    const hasIncompleteSubtasks = !todo.completed && todo.checklists?.some(c => c.items.some(i => !i.done));

    const getLabelColorS = (name) => {
        const label = allLabels.find(l => l.name === name);
        return label ? label.color : getLabelColor(name);
    };

    const handleTaskClick = (e) => {
        // Prevent opening modal if clicking interactive elements
        if (e.target.closest('.checkbox') || e.target.closest('.inline-controls') || e.target.closest('.btn-menu') || e.target.closest('.dropdown') || e.target.closest('.btn-text') || e.target.closest('.btn-expand')) {
            return;
        }
        onEdit(todo);
    };

    return (
        <div
            className={`todo-item ${todo.completed ? 'completed' : ''} ${isOverdue ? 'overdue' : ''} ${draggedItem?.id === todo.id ? 'dragging' : ''} view-mode-${viewMode}`}
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
                <div className="todo-header-row">
                    <span
                        className={`todo-text ${hasIncompleteSubtasks ? 'text-disabled' : ''}`}
                        style={{ cursor: 'pointer' }}>
                        {todo.text}
                    </span>
                    <button
                        className={`btn-toggle-badges ${showGlobalBadges ? 'active' : ''}`}
                        onClick={(e) => { e.stopPropagation(); setShowGlobalBadges(!showGlobalBadges); }}
                        title="Toggle Badges Globally"
                    >
                        <IconInfo size={14} />
                    </button>
                </div>

                {showGlobalBadges && (
                    <div className="task-primary-info">
                        <div className="task-badges-row">
                            {todo.priority && todo.priority !== 'none' && (
                                <div className={`task-badge priority-badge priority-${todo.priority}`}>
                                    <IconBell size={12} className="badge-icon" />
                                    <span>{todo.priority}</span>
                                </div>
                            )}
                            {todo.categories && todo.categories.length > 0 ? (
                                todo.categories.map((cat, idx) => (
                                    <div key={`${cat}-${idx}`} className="task-badge category-badge" style={{ color: `#000` }}>
                                        <IconTag size={12} className="badge-icon" />
                                        <span>{cat}</span>
                                    </div>
                                ))
                            ) : (
                                todo.listTitle && todo.listTitle !== 'Default' && (
                                    <div className="task-badge category-badge">
                                        <IconTag size={12} className="badge-icon" />
                                        <span>{todo.listTitle}</span>
                                    </div>
                                )
                            )}
                            {todo.dueAt && (
                                <div className={`task-badge due-badge ${isOverdue ? 'overdue' : ''}`}>
                                    <IconCalendar size={12} className="badge-icon" />
                                    <span>{formatDateShort(todo.dueAt)}</span>
                                </div>
                            )}
                            {todo.checklists?.some(c => c.items.length > 0) && (
                                <div className={`task-badge subtasks-badge ${todo.checklists.every(c => c.items.every(i => i.done)) ? 'all-done' : ''}`}>
                                    <IconCheckSquare size={12} className="badge-icon" />
                                    <span>
                                        {(() => {
                                            const total = todo.checklists.reduce((acc, c) => acc + c.items.length, 0);
                                            const done = todo.checklists.reduce((acc, c) => acc + c.items.filter(i => i.done).length, 0);
                                            return `${done}/${total}`;
                                        })()}
                                    </span>
                                </div>
                            )}

                            {/* {todo.labels && todo.labels.length > 0 && (
                                <div className="task-labels-container">
                                    {todo.labels.map((label, idx) => (
                                        <span key={idx} className="item-label-tag" style={{ backgroundColor: getLabelColorS(label) }}>
                                            {label}
                                        </span>
                                    ))}
                                </div>
                            )} */}

                            {todo.description && (
                                <div className="task-badge desc-badge" title="Has description">
                                    <IconAlignLeft size={12} className="badge-icon" />
                                </div>
                            )}

                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
