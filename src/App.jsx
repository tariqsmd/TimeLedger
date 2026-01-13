import React, { useEffect } from 'react';
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
        appFontBody,
        setAppFontBody,
        appFontHeading,
        setAppFontHeading,
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

    const bodyFonts = [
        { name: 'Inter', value: 'Inter' },
        { name: 'Roboto', value: 'Roboto' },
        { name: 'Open Sans', value: 'Open Sans' },
        { name: 'Lato', value: 'Lato' },
        { name: 'Montserrat', value: 'Montserrat' },
        { name: 'Poppins', value: 'Poppins' },
        { name: 'Nunito', value: 'Nunito' },
        { name: 'Rubik', value: 'Rubik' },
        { name: 'Work Sans', value: 'Work Sans' },
        { name: 'Quicksand', value: 'Quicksand' },
        { name: 'Karla', value: 'Karla' },
        { name: 'Cabin', value: 'Cabin' },
        { name: 'Arimo', value: 'Arimo' },
        { name: 'Heebo', value: 'Heebo' },
        { name: 'Kanit', value: 'Kanit' }
    ];

    const headingFonts = [
        { name: 'Outfit', value: 'Outfit' },
        { name: 'Playfair Display', value: 'Playfair Display' },
        { name: 'Sora', value: 'Sora' },
        { name: 'Space Grotesk', value: 'Space Grotesk' },
        { name: 'Syne', value: 'Syne' },
        { name: 'Lexend', value: 'Lexend' },
        { name: 'Archivo', value: 'Archivo' },
        { name: 'Fraunces', value: 'Fraunces' },
        { name: 'Manrope', value: 'Manrope' },
        { name: 'Urbanist', value: 'Urbanist' },
        { name: 'Jost', value: 'Jost' },
        { name: 'Unbounded', value: 'Unbounded' },
        { name: 'Figtree', value: 'Figtree' },
        { name: 'Plus Jakarta Sans', value: 'Plus Jakarta Sans' },
        { name: 'Bricolage Grotesque', value: 'Bricolage Grotesque' }
    ];

    const themes = [
        { id: 'default', name: 'Premium Indigo', primary: '#4f46e5' },
        { id: 'midnight', name: 'Deep Midnight', primary: '#7c3aed' },
        { id: 'emerald', name: 'Forest Emerald', primary: '#059669' },
        { id: 'sunset', name: 'Golden Sunset', primary: '#f59e0b' },
        { id: 'rose', name: 'Velvet Rose', primary: '#e11d48' },
        { id: 'oceanic', name: 'Oceanic Blue', primary: '#0ea5e9' },
        { id: 'royal', name: 'Royal Purple', primary: '#8b5cf6' },
        { id: 'carbon', name: 'Carbon Black', primary: '#3f3f46' },
        { id: 'neon', name: 'Neon Lime', primary: '#84cc16' },
        { id: 'cyber', name: 'Cyber Pink', primary: '#d946ef' }
    ];

    // Load fonts dynamically
    useEffect(() => {
        const fontsToLoad = [appFontBody, appFontHeading];
        const fontQuery = fontsToLoad
            .map(font => font.replace(/ /g, '+') + ':wght@400;500;600;700;800')
            .join('&family=');

        const linkId = 'dynamic-google-fonts';
        let link = document.getElementById(linkId);

        if (!link) {
            link = document.createElement('link');
            link.id = linkId;
            link.rel = 'stylesheet';
            document.head.appendChild(link);
        }

        link.href = `https://fonts.googleapis.com/css2?family=${fontQuery}&display=swap`;

        // Apply font family to document root
        document.documentElement.style.setProperty('--font-body', `"${appFontBody}", sans-serif`);
        document.documentElement.style.setProperty('--font-heading', `"${appFontHeading}", sans-serif`);
    }, [appFontBody, appFontHeading]);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', appTheme);
    }, [appTheme]);

    return (
        <div className="dashboard-layout" style={{ background: boardBackground }} data-theme={appTheme}>
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
                            <label className="settings-label">Heading Font</label>
                            <select
                                value={appFontHeading}
                                onChange={(e) => setAppFontHeading(e.target.value)}
                                className="select-field"
                                style={{ fontFamily: appFontHeading }}
                            >
                                {headingFonts.map(f => (
                                    <option key={f.value} value={f.value} style={{ fontFamily: f.value }}>
                                        {f.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="settings-group">
                            <label className="settings-label">Body Font</label>
                            <select
                                value={appFontBody}
                                onChange={(e) => setAppFontBody(e.target.value)}
                                className="select-field"
                                style={{ fontFamily: appFontBody }}
                            >
                                {bodyFonts.map(f => (
                                    <option key={f.value} value={f.value} style={{ fontFamily: f.value }}>
                                        {f.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="settings-group">
                            <label className="settings-label">Color Theme</label>
                            <select
                                value={appTheme}
                                onChange={(e) => setAppTheme(e.target.value)}
                                className="select-field"
                            >
                                {themes.map(t => (
                                    <option key={t.id} value={t.id}>
                                        {t.name}
                                    </option>
                                ))}
                            </select>
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
