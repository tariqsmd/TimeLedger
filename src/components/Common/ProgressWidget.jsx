/**
 * ProgressWidget.jsx
 * Reusable progress widget component
 */
import React from 'react';

export default function ProgressWidget({ todos = [], title = '' }) {
    const completedCount = todos.filter(t => t.completed).length;
    const progress = todos.length > 0 ? (completedCount / todos.length) * 100 : 0;

    return (
        <div className="progress-widget">
            {title && (<h3 className="section-title">{title}</h3>)}
            <div className="progress-card">
                <div className="progress-tasks">
                    <span>{completedCount}/{todos.length} Tasks</span>
                </div>
                <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${progress}%` }} />
                </div>
                <div className="progress-stats">
                    <span className="percentage">{Math.round(progress)}%</span>
                </div>
            </div>
        </div >
    );
}
