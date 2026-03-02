import React from 'react';
import { AppProvider, useApp } from './utils/AppContext';
import Header from './components/Layout/Header';
import TodoView from './components/Todo/TodoView';
import { IconBoard, IconList, IconTable } from './assets/Icons';

function MainLayout() {
    const {
        boardBackground,
        setBoardBackground,
        isSidebarOpen,
        setIsSidebarOpen,
        boardColumns,
        setBoardColumns,
        sortBy,
        setSortBy,
        viewMode,
        setViewMode,
        appFont,
        setAppFont,
        appTheme,
        setAppTheme
    } = useApp();

    const backgrounds = [
        { name: 'Default', value: null },
        { name: 'Night Sky', value: 'linear-gradient(to bottom, #2c3e50, #000000)' },
        { name: 'Aurora', value: 'linear-gradient(to right, #00c6ff, #0072ff)' },
        { name: 'Sunset', value: 'linear-gradient(to right, #f83600, #f9d423)' },
        { name: 'Midnight', value: '#1a1a2e' },
        { name: 'Slate', value: '#334756' }
    ];

    const fonts = [
        { name: 'Modern (Inter)', value: 'Inter' },
        { name: 'Geometric (Outfit)', value: 'Outfit' },
        { name: 'Technical (JetBrains)', value: 'JetBrains Mono' },
        { name: 'Clean (Roboto)', value: 'Roboto' }
    ];

    const themes = [
        { id: 'default', name: 'Premium Dark', primary: '#4f46e5' },
        { id: 'midnight', name: 'Deep Midnight', primary: '#7c3aed' },
        { id: 'emerald', name: 'Forest Emerald', primary: '#059669' },
        { id: 'sunset', name: 'Golden Sunset', primary: '#f59e0b' },
        { id: 'rose', name: 'Velvet Rose', primary: '#e11d48' }
    ];

    React.useEffect(() => {
        document.documentElement.setAttribute('data-theme', appTheme);
        document.documentElement.setAttribute('data-font', appFont);
    }, [appTheme, appFont]);

    return (
        <div className="dashboard-layout" style={{ background: boardBackground }} data-theme={appTheme} data-font={appFont}>
            <Header />
            <main className="main-content">
                <div className="content-area">
                    <TodoView />
                </div>
                <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
                    <div className="sidebar-header">
                        <h3>Design & Settings</h3>
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
                            <label className="settings-label">App Font Family</label>
                            <div className="font-selector">
                                {fonts.map(f => (
                                    <button
                                        key={f.value}
                                        className={`font-option ${appFont === f.value ? 'active' : ''}`}
                                        onClick={() => setAppFont(f.value)}
                                        style={{ fontFamily: f.value }}
                                    >
                                        {f.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="settings-group">
                            <label className="settings-label">Color Theme</label>
                            <div className="theme-selector">
                                {themes.map(t => (
                                    <button
                                        key={t.id}
                                        className={`theme-option ${appTheme === t.id ? 'active' : ''}`}
                                        onClick={() => setAppTheme(t.id)}
                                        title={t.name}
                                    >
                                        <div className="theme-preview" style={{ background: t.primary }}></div>
                                        <span>{t.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

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
                            <label className="settings-label">View Mode</label>
                            <div className="view-mode-toggle sidebar-toggle">
                                <button
                                    className={`toggle-btn ${viewMode === 'board' ? 'active' : ''}`}
                                    onClick={() => setViewMode('board')}
                                >
                                    <IconBoard size={16} /> Board
                                </button>
                                <button
                                    className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                                    onClick={() => setViewMode('list')}
                                >
                                    <IconList size={16} /> List
                                </button>
                                <button
                                    className={`toggle-btn ${viewMode === 'table' ? 'active' : ''}`}
                                    onClick={() => setViewMode('table')}
                                >
                                    <IconTable size={16} /> Table
                                </button>
                            </div>
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
