import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import styles from './SettingsView.module.css';

export default function SettingsView() {
    const {
        activeTheme, setActiveTheme,
        dbEngine, switchDatabase,
        projects, addProject, removeProject,
        enabledModules, toggleModule,
        activeSettingsTab
    } = useApp();

    const [newProjName, setNewProjName] = useState('');

    const handleAddProject = (e) => {
        e.preventDefault();
        if (newProjName.trim()) {
            addProject(newProjName.trim());
            setNewProjName('');
        }
    };

    const themes = [
        // LIGHT THEMES (12)
        { id: 'light', name: 'Cloud Light', desc: 'Standard clean workspace', colors: ['#ffffff', '#4f46e5'], category: 'light' },
        { id: 'frost', name: 'Minimalist Frost', desc: 'Modern white aesthetic', colors: ['#f0f4f8', '#2b6cb0'], category: 'light' },
        { id: 'google', name: 'Google Clean', desc: 'Classic Material Design', colors: ['#ffffff', '#4285f4'], category: 'light' },
        { id: 'apple', name: 'Apple Silicon', desc: 'Sleek grey and glass', colors: ['#f5f5f7', '#007aff'], category: 'light' },
        { id: 'notion', name: 'Notion Minimal', desc: 'Soft paper-white', colors: ['#ffffff', '#37352f'], category: 'light' },
        { id: 'matcha', name: 'Matcha Zen', desc: 'Earthy organic green', colors: ['#f0f4ef', '#588157'], category: 'light' },
        { id: 'lavender', name: 'Gentle Lavender', desc: 'Creative soft purple', colors: ['#f5f3ff', '#8b5cf6'], category: 'light' },
        { id: 'sakura', name: 'Sakura Spring', desc: 'Soft pink and cherry bliss', colors: ['#fff5f7', '#ec4899'], category: 'light' },
        { id: 'sand', name: 'Desert Sand', desc: 'Warm professional neutrals', colors: ['#fdfaf6', '#d946ef'], category: 'light' },
        { id: 'aqua', name: 'Crystal Aqua', desc: 'Fresh teal and white', colors: ['#f0fdfa', '#14b8a6'], category: 'light' },
        { id: 'paper', name: 'Classic Paper', desc: 'Clinical eggshell white', colors: ['#f9f9f9', '#2c3e50'], category: 'light' },
        { id: 'mint', name: 'Spring Mint', desc: 'Cool pastel green focus', colors: ['#f6fffa', '#00b894'], category: 'light' },

        // DARK THEMES (18)
        { id: 'obsidian', name: 'Obsidian Night', desc: 'Pure focus dark mode', colors: ['#0a0a0b', '#6366f1'], category: 'dark' },
        { id: 'cyber', name: 'Midnight Cyber', desc: 'High-contrast neon UI', colors: ['#020617', '#38bdf8'], category: 'dark' },
        { id: 'synthwave', name: 'Neon Synthwave', desc: 'Vaporwave aesthetics', colors: ['#140628', '#ff00ff'], category: 'dark' },
        { id: 'solaris', name: 'Warm Solaris', desc: 'sunset gold energy', colors: ['#2a1b15', '#f59e0b'], category: 'dark' },
        { id: 'aura', name: 'Midnight Aura', desc: 'Bioluminescent indigo', colors: ['#03001c', '#a5d7e8'], category: 'dark' },
        { id: 'nord', name: 'Nordic Mist', desc: 'Icy cold productivity', colors: ['#2e3440', '#88c0d0'], category: 'dark' },
        { id: 'dracula', name: 'Dracula Pro', desc: 'Modern dev standard', colors: ['#282a36', '#bd93f9'], category: 'dark' },
        { id: 'void', name: 'Eternal Void', desc: 'True black experience', colors: ['#000000', '#ffffff'], category: 'dark' },
        { id: 'midnight', name: 'Midnight Abyss', desc: 'Deep professional navy', colors: ['#020617', '#3b82f6'], category: 'dark' },
        { id: 'carbon', name: 'Carbon Grey', desc: 'Industrial slate focus', colors: ['#171717', '#d4d4d4'], category: 'dark' },
        { id: 'nebula', name: 'Cosmic Nebula', desc: 'Deep space purple', colors: ['#0c0a1e', '#c084fc'], category: 'dark' },
        { id: 'vscode', name: 'VS Code Dark', desc: 'Legendary developer skin', colors: ['#1e1e1e', '#007acc'], category: 'dark' },
        { id: 'monokai', name: 'Monokai/Sublime', desc: 'High-vibrancy classic', colors: ['#272822', '#f92672'], category: 'dark' },
        { id: 'github-dark', name: 'GitHub Pro', desc: 'Clinical coding environment', colors: ['#0d1117', '#58a6ff'], category: 'dark' },
        { id: 'onedark', name: 'One Dark Pro', desc: 'Atom-style aesthetics', colors: ['#21252b', '#61afef'], category: 'dark' },
        { id: 'oceanic', name: 'Deep Oceanic', desc: 'Calm relaxed navy', colors: ['#0f172a', '#38bdf8'], category: 'dark' },
        { id: 'rose', name: 'Rose Pine', desc: 'Soft aesthetic dark', colors: ['#1f1d2e', '#ebbcba'], category: 'dark' },
        { id: 'emerald', name: 'Emerald Forest', desc: 'Earthy green focus', colors: ['#064e3b', '#34d399'], category: 'dark' }
    ];

    const [themeCategory, setThemeCategory] = useState('dark');

    const moduleConfigs = [
        { id: 'todo', label: 'Workflow Engine', desc: 'Task management and Kanban board', icon: '✅' },
        { id: 'schedule', label: 'Schedule Architect', desc: 'Routine planning and monthly goals', icon: '📅' },
        { id: 'tracker', label: 'Time Tracker', icon: '⏱️', desc: 'Daily performance and focus logging' },
        { id: 'analytics', label: 'Intelligence Hub', icon: '📊', desc: 'Advanced productivity insights and charts' }
    ];

    const renderContent = () => {
        switch (activeSettingsTab) {
            case 'appearance':
                return (
                    <section className={styles.tabContent}>
                        <div className={styles.sectionHeader}>
                            <h3 className={styles.sectionTitle}>Visual Experience</h3>
                            <p className={styles.sectionDesc}>Choose a skin that matches your current environment and mood.</p>
                        </div>

                        <div className={styles.categoryTabs}>
                            <button className={themeCategory === 'dark' ? styles.activeCategory : ''} onClick={() => setThemeCategory('dark')}>Deep Dark (18)</button>
                            <button className={themeCategory === 'light' ? styles.activeCategory : ''} onClick={() => setThemeCategory('light')}>Atmospheric Light (12)</button>
                        </div>

                        <div className={styles.themeGrid}>
                            {themes.filter(t => t.category === themeCategory).map(theme => (
                                <div
                                    key={theme.id}
                                    className={`${styles.themeCard} ${activeTheme === theme.id ? styles.activeTheme : ''}`}
                                    onClick={() => setActiveTheme(theme.id)}
                                >
                                    <div className={styles.themePreview}>
                                        <div className={styles.colorCircle} style={{ backgroundColor: theme.colors[0] }}></div>
                                        <div className={styles.colorCircle} style={{ backgroundColor: theme.colors[1] }}></div>
                                    </div>
                                    <div className={styles.themeInfo}>
                                        <h4 className={styles.themeName}>{theme.name}</h4>
                                        <p className={styles.themeDesc}>{theme.desc}</p>
                                    </div>
                                    {activeTheme === theme.id && <div className={styles.check}>✓</div>}
                                </div>
                            ))}
                        </div>
                    </section>
                );
            case 'modules':
                return (
                    <section className={styles.tabContent}>
                        <div className={styles.sectionHeader}>
                            <h3 className={styles.sectionTitle}>Workspace Modules</h3>
                            <p className={styles.sectionDesc}>Enable or disable core features to customize your workflow.</p>
                        </div>
                        <div className={styles.prefList}>
                            {moduleConfigs.map(mod => (
                                <div key={mod.id} className={styles.prefItem}>
                                    <div className={styles.prefText}>
                                        <div className={styles.prefLabel}>{mod.icon} {mod.label}</div>
                                        <div className={styles.prefDesc}>{mod.desc}</div>
                                    </div>
                                    <input
                                        type="checkbox"
                                        className={styles.toggle}
                                        checked={enabledModules[mod.id]}
                                        onChange={() => toggleModule(mod.id)}
                                    />
                                </div>
                            ))}
                        </div>
                    </section>
                );
            case 'organization':
                return (
                    <section className={styles.tabContent}>
                        <div className={styles.sectionHeader}>
                            <h3 className={styles.sectionTitle}>Workspace Organization</h3>
                            <p className={styles.sectionDesc}>Manage the tags and projects used across your tasks and schedules.</p>
                        </div>
                        <div className={styles.projectManager}>
                            <form className={styles.addProjForm} onSubmit={handleAddProject}>
                                <input
                                    type="text"
                                    placeholder="Add new project type..."
                                    value={newProjName}
                                    onChange={(e) => setNewProjName(e.target.value)}
                                />
                                <button type="submit">Add Project</button>
                            </form>
                            <div className={styles.projectList}>
                                {projects.map(proj => (
                                    <div key={proj} className={styles.projectTag}>
                                        <span>{proj}</span>
                                        <button onClick={() => removeProject(proj)} title="Remove Project">✕</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                );
            case 'data':
                return (
                    <section className={styles.tabContent}>
                        <div className={styles.sectionHeader}>
                            <h3 className={styles.sectionTitle}>Persistence Engine</h3>
                            <p className={styles.sectionDesc}>Select where your data is stored. Cloud providers enable cross-device sync.</p>
                        </div>
                        <div className={styles.dbGrid}>
                            <div
                                className={`${styles.dbCard} ${dbEngine === 'local' ? styles.activeDb : ''}`}
                                onClick={() => switchDatabase('local')}
                            >
                                <div className={styles.dbIcon}>💻</div>
                                <div className={styles.dbInfo}>
                                    <h4>Local Storage</h4>
                                    <p>Fast, offline-only, stored in browser.</p>
                                </div>
                            </div>
                            <div
                                className={`${styles.dbCard} ${dbEngine === 'firebase' ? styles.activeDb : ''}`}
                                onClick={() => switchDatabase('firebase')}
                            >
                                <div className={styles.dbIcon}>🔥</div>
                                <div className={styles.dbInfo}>
                                    <h4>Firebase Firestore</h4>
                                    <p>Real-time sync, cloud persistence.</p>
                                </div>
                            </div>
                            <div
                                className={`${styles.dbCard} ${dbEngine === 'supabase' ? styles.activeDb : ''}`}
                                onClick={() => switchDatabase('supabase')}
                            >
                                <div className={styles.dbIcon}>⚡</div>
                                <div className={styles.dbInfo}>
                                    <h4>Supabase (Postgres)</h4>
                                    <p>Relational, robust, SQL-based.</p>
                                </div>
                            </div>
                        </div>
                    </section>
                );
            case 'preferences':
                return (
                    <section className={styles.tabContent}>
                        <div className={styles.sectionHeader}>
                            <h3 className={styles.sectionTitle}>General Preferences</h3>
                            <p className={styles.sectionDesc}>Fine-tune notification and alert behaviors.</p>
                        </div>
                        <div className={styles.prefList}>
                            <div className={styles.prefItem}>
                                <div className={styles.prefText}>
                                    <div className={styles.prefLabel}>Enable Desktop Notifications</div>
                                    <div className={styles.prefDesc}>Receive alerts when the timer ends or daily logs are due.</div>
                                </div>
                                <input type="checkbox" className={styles.toggle} defaultChecked />
                            </div>
                            <div className={styles.prefItem}>
                                <div className={styles.prefText}>
                                    <div className={styles.prefLabel}>Sound Alerts</div>
                                    <div className={styles.prefDesc}>Play a soft chime when tasks are completed.</div>
                                </div>
                                <input type="checkbox" className={styles.toggle} defaultChecked />
                            </div>
                        </div>
                    </section>
                );
            default:
                return null;
        }
    };

    return (
        <div className={styles.settingsView}>
            <div className={styles.mainContent}>
                {renderContent()}
            </div>
        </div>
    );
}
