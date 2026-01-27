import React from 'react';
import { AppProvider, useApp } from './utils/AppContext';
import Header from './components/Layout/Header';
import TodoView from './components/Todo/TodoView';

function MainLayout() {
    const {
        boardBackground,
        setBoardBackground,
        isSidebarOpen,
        setIsSidebarOpen,
        boardColumns,
        setBoardColumns,
        sortBy,
        setSortBy
    } = useApp();

    const backgrounds = [
        { name: 'Default', value: null },
        { name: 'Night Sky', value: 'linear-gradient(to bottom, #2c3e50, #000000)' },
        { name: 'Aurora', value: 'linear-gradient(to right, #00c6ff, #0072ff)' },
        { name: 'Sunset', value: 'linear-gradient(to right, #f83600, #f9d423)' },
        { name: 'Midnight', value: '#1a1a2e' },
        { name: 'Slate', value: '#334756' }
    ];

    return (
        <div className="dashboard-layout" style={{ background: boardBackground }}>
            <Header />
            <main className="main-content">
                <div className="content-area">
                    <TodoView />
                </div>
                <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
                    <div className="sidebar-header">
                        <h3>Settings</h3>
                        <button
                            className="btn-close-sidebar"
                            onClick={() => setIsSidebarOpen(false)}
                            title="Close"
                        >
                            ✕
                        </button>
                    </div>

                    <div className="sidebar-content">
                        <div className="settings-group">
                            <label className="settings-label">Board Background</label>
                            <select
                                value={backgrounds.findIndex(b => b.value === boardBackground)}
                                onChange={(e) => setBoardBackground(backgrounds[e.target.value].value)}
                                className="select-field"
                            >
                                {backgrounds.map((bg, i) => (
                                    <option key={i} value={i}>{bg.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="settings-group">
                            <label className="settings-label">Board Columns</label>
                            <div className="columns-selector">
                                {[2, 3, 4, 5].map(num => (
                                    <button
                                        key={num}
                                        className={`column-option ${boardColumns === num ? 'active' : ''}`}
                                        onClick={() => setBoardColumns(num)}
                                    >
                                        {num}
                                    </button>
                                ))}
                            </div>
                            <p className="settings-hint">Select number of columns for board view</p>
                        </div>

                        <div className="settings-group">
                            <label className="settings-label">Sort Tasks By</label>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="select-field"
                            >
                                <option value="createdAt">Date Created (Default)</option>
                                <option value="priority">Priority (High to Low)</option>
                                <option value="dueAt">Due Date</option>
                                <option value="alpha">Alphabetical</option>
                            </select>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

function App() {
    return (
        <AppProvider>
            <MainLayout />
        </AppProvider>
    );
}

export default App;
