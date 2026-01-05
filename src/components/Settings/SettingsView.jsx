import React from 'react';
import { useApp } from '../../contexts/AppContext';
import styles from './SettingsView.module.css';

export default function SettingsView() {
    const { activeTheme, setActiveTheme, dbEngine, switchDatabase } = useApp();

    const themes = [
        { id: 'light', name: 'Cloud Light', desc: 'Clean and professional bright theme', colors: ['#ffffff', '#4f46e5'] },
        { id: 'obsidian', name: 'Obsidian Night', desc: 'Ultra-dark theme for deep focus sessions', colors: ['#0a0a0b', '#6366f1'] },
        { id: 'oceanic', name: 'Deep Oceanic', desc: 'Calm navy blue for relaxed productivity', colors: ['#0f172a', '#38bdf8'] },
        { id: 'lavender', name: 'Gentle Lavender', desc: 'Soft purple tones for a creative atmosphere', colors: ['#f5f3ff', '#8b5cf6'] }
    ];

    return (
        <div className={styles.settingsView}>
            <div className="view-header">
                <h2 className="view-title">System Settings</h2>
                <p className="view-subtitle">Personalize your workspace aesthetic and behavior</p>
            </div>

            <section className={styles.section}>
                <h3 className={styles.sectionTitle}>Visual Experience</h3>
                <p className={styles.sectionDesc}>Choose a skin that matches your current environment and mood.</p>

                <div className={styles.themeGrid}>
                    {themes.map(theme => (
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

            <section className={styles.section}>
                <h3 className={styles.sectionTitle}>Persistence Engine</h3>
                <p className={styles.sectionDesc}>Select where your data is stored. Cloud providers enable cross-device sync.</p>

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

            <section className={styles.section}>
                <h3 className={styles.sectionTitle}>Preferences</h3>
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
        </div>
    );
}
