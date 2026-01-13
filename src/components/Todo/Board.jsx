import React, { useState } from 'react';
import TodoItem from './TodoItem';
import InlineAddTask from './InlineAddTask';
import { IconPlus, IconClose } from '../../assets/Icons';
import { useApp } from '../../utils/AppContext';

export default function Board({
    filteredTodos,
    draggedItem,
    viewMode,
    onToggle,
    onEdit,
    onDragStart,
    onDragOver,
    onDragEnd
}) {
    const { addTodo, boardColumns, customBoards, setCustomBoards, updateTodo } = useApp();
    const [isAddingBoard, setIsAddingBoard] = useState(false);
    const [newBoardName, setNewBoardName] = useState('');

    const handleAddBoard = () => {
        if (newBoardName.trim() && !customBoards.includes(newBoardName.trim())) {
            setCustomBoards([...customBoards, newBoardName.trim()]);
            setNewBoardName('');
            setIsAddingBoard(false);
        }
    };

    const handleRemoveBoard = (name) => {
        if (window.confirm(`Are you sure you want to remove the "${name}" board?`)) {
            setCustomBoards(customBoards.filter(b => b !== name));
        }
    };

    return (
        <div className="board-view-container">
            <div className="board-view" style={{ gridTemplateColumns: `repeat(${customBoards.length + 1}, minmax(320px, 1fr))` }}>
                {customBoards.map((boardTitle, index) => (
                    <div
                        key={boardTitle}
                        className="board-column"
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={() => {
                            if (!draggedItem) return;
                            updateTodo(draggedItem.id, { boardTitle: boardTitle });
                        }}
                    >
                        <div className="col-header">
                            <span className="col-label">{boardTitle}</span>
                            <div className="col-header-actions">
                                <span className="count-badge">
                                    {filteredTodos.filter(t => (t.boardTitle === boardTitle) || (!t.boardTitle && index === 0 && boardTitle === customBoards[0])).length}
                                </span>
                                {customBoards.length > 1 && (
                                    <button className="btn-remove-col" onClick={() => handleRemoveBoard(boardTitle)}>✕</button>
                                )}
                            </div>
                        </div>
                        <div className="board-list">
                            {filteredTodos
                                .filter(t => (t.boardTitle === boardTitle) || (!t.boardTitle && index === 0 && boardTitle === customBoards[0]))
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
                        <InlineAddTask onAdd={(text, list, status) => addTodo(text, list || 'Default', '', { boardTitle })} />
                    </div>
                ))}

                {/* Add Board Column */}
                <div className="board-column add-column">
                    {!isAddingBoard ? (
                        <div className="add-board-trigger" onClick={() => setIsAddingBoard(true)}>
                            <IconPlus size={20} />
                            <span>Add Board</span>
                        </div>
                    ) : (
                        <div className="add-board-form">
                            <input
                                type="text"
                                className="input-field"
                                placeholder="Enter board title..."
                                value={newBoardName}
                                onChange={(e) => setNewBoardName(e.target.value)}
                                autoFocus
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleAddBoard();
                                    if (e.key === 'Escape') setIsAddingBoard(false);
                                }}
                            />
                            <div className="add-board-actions">
                                <button className="btn-primary" onClick={handleAddBoard}>Add</button>
                                <button className="btn-icon" onClick={() => setIsAddingBoard(false)}>
                                    <IconClose size={16} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
