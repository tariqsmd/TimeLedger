/**
 * Board.jsx
 * Renders tasks in a board layout
 */
import React from 'react';
import TodoItem from './TodoItem';
import InlineAddTask from './InlineAddTask';
import { IconPlus } from '../../assets/Icons';
import { useApp } from '../../utils/AppContext';

export default function Board({
    filteredTodos,
    onUpdateTodoStatus,
    draggedItem,
    viewMode,
    onToggle,
    onEdit,
    onDragStart,
    onDragOver,
    onDragEnd
}) {
    const { addTodo, boardColumns } = useApp();

    const columns = [
        { id: 'idle', title: 'To Do', icon: <IconPlus size={16} /> },
        { id: 'running', title: 'In Progress', icon: '⚡' },
        { id: 'completed', title: 'Completed', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg> }
    ];

    return (
        <div className="board-view" style={{ gridTemplateColumns: `repeat(${boardColumns}, 1fr)` }}>
            {columns.map(col => (
                <div
                    key={col.id}
                    className="board-column"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => {
                        if (!draggedItem) return;
                        let targetStatus = col.id;
                        // Do not start time when card is move to in progress board
                        if (targetStatus === 'running' && draggedItem.status !== 'running') {
                            targetStatus = 'paused';
                        }
                        onUpdateTodoStatus(draggedItem.id, targetStatus);
                    }}
                >
                    <div className="col-header">
                        <span className="col-label">{col.icon} {col.title}</span>
                        <span className="count-badge">
                            {filteredTodos.filter(t => col.id === 'running' ? (t.status === 'running' || t.status === 'paused') : t.status === col.id).length}
                        </span>
                    </div>
                    <div className="board-list">
                        {filteredTodos
                            .filter(t => col.id === 'running' ? (t.status === 'running' || t.status === 'paused') : t.status === col.id)
                            .map(todo => (
                                <TodoItem
                                    key={todo.id}
                                    todo={todo}
                                    onToggle={onToggle}
                                    onEdit={onEdit}
                                    onDragStart={onDragStart}
                                    onDragOver={onDragOver}
                                    onDragEnd={onDragEnd}
                                    draggedItem={draggedItem}
                                    viewMode={viewMode}
                                />
                            ))}
                    </div>
                    <InlineAddTask status={col.id} onAdd={(text, list, status) => addTodo(text, list, '', { status })} />
                </div>
            ))}
        </div>
    );
}
