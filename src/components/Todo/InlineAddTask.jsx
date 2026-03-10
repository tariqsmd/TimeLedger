import React, { useState } from 'react';
import { IconPlus } from '../../assets/Icons';

export default function InlineAddTask({ listTitle, status, onAdd }) {
    const [isEditing, setIsEditing] = useState(false);
    const [inputValue, setInputValue] = useState('');

    const handleSubmit = (e) => {
        if (e) e.preventDefault();
        if (inputValue.trim()) {
            onAdd(inputValue.trim(), listTitle, status);
            setInputValue('');
            setIsEditing(false);
        }
    };

    if (!isEditing) {
        return (
            <div className="inline-add-task-trigger" onClick={() => setIsEditing(true)}>
                <IconPlus size={16} />
                <span>Add a task</span>
            </div>
        );
    }

    return (
        <div className="inline-add-task-form">
            <div className="inline-input-wrapper">
                <textarea
                    className="inline-task-input"
                    placeholder="Enter a title for this task..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSubmit();
                        }
                        if (e.key === 'Escape') {
                            setIsEditing(false);
                            setInputValue('');
                        }
                    }}
                    autoFocus
                />
                {inputValue.trim() && (
                    <button className="btn-inline-submit" onClick={handleSubmit} title="Add Task">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                    </button>
                )}
            </div>
            <div className="inline-form-actions">
                <button className="btn-inline-cancel" onClick={() => { setIsEditing(false); setInputValue(''); }}>
                    Cancel
                </button>
            </div>
        </div>
    );
}
