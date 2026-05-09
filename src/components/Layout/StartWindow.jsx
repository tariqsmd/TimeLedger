import React from 'react';
import { IconBoard, IconList, IconClock, IconCheckSquare } from '../../assets/Icons';
import './StartWindow.scss';

export default function StartWindow({ onSelectLayout }) {
    return (
        <div className="start-window-overlay">
            <div className="start-window-container">
                <div className="start-window-header">
                    <div className="logo-large">
                        <div className="logo-icon">TL</div>
                        <h1>Time<span>Ledger</span></h1>
                    </div>
                    <p>Welcome back! Please select your preferred workspace layout.</p>
                </div>

                <div className="layout-options">
                    <div className="layout-card" onClick={() => onSelectLayout('modern')}>
                        <div className="layout-preview modern">
                            <div className="preview-header"></div>
                            <div className="preview-content">
                                <div className="preview-board">
                                    <div className="preview-col"></div>
                                    <div className="preview-col"></div>
                                    <div className="preview-col"></div>
                                </div>
                            </div>
                        </div>
                        <div className="layout-info">
                            <h3><IconBoard size={20} /> Modern Board</h3>
                            <p>Manage your tasks in a beautiful Kanban-style board with categories and timers.</p>
                        </div>
                    </div>

                    <div className="layout-card" onClick={() => onSelectLayout('quick')}>
                        <div className="layout-preview quick">
                            <div className="preview-header"></div>
                            <div className="preview-content">
                                <div className="preview-list-item"></div>
                                <div className="preview-list-item"></div>
                                <div className="preview-list-item"></div>
                            </div>
                        </div>
                        <div className="layout-info">
                            <h3><IconList size={20} /> Quick Ledger</h3>
                            <p>A streamlined, list-focused view for fast task entry and note-taking.</p>
                        </div>
                    </div>
                </div>

                <div className="start-window-footer">
                    <p><IconClock size={14} /> You can always switch between layouts later from the header.</p>
                </div>
            </div>
        </div>
    );
}
