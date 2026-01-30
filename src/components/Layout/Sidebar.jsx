import React, { useEffect, useState } from 'react';
import { useApp } from '../../utils/AppContext';
import LayoutView from '../Common/LayoutView'

export default function Sidebar() {
    const {
        isSidebarOpen,
        setIsSidebarOpen,
        sortBy,
        setSortBy,
        appFontBody,
        setAppFontBody,
        appFontWeightBody,
        setAppFontWeightBody,
        appFontHeading,
        setAppFontHeading,
        appFontWeightHeading,
        setAppFontWeightHeading,
        appTheme,
        setAppTheme,
        boardBackgroundType,
        setBoardBackgroundType,
        boardBackgroundValue,
        setBoardBackgroundValue
    } = useApp();

    const [activePanel, setActivePanel] = React.useState('main'); // 'main', 'typography', 'background', 'theme'
    const [uploadedImages, setUploadedImages] = React.useState([]);

    React.useEffect(() => {
        if (activePanel === 'background') {
            fetch('http://localhost:5175/api/uploads')
                .then(res => res.json())
                .then(setUploadedImages)
                .catch(err => console.error('Failed to fetch uploads:', err));
        }
    }, [activePanel]);

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

    const fontWeights = ['300', '400', '500', '600', '700', '800'];

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

    const presetGradients = [
        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'linear-gradient(to right, #ff7e5f, #feb47b)',
        'linear-gradient(to right, #00c6ff, #0072ff)',
        'linear-gradient(to right, #f83600, #f9d423)',
        'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        'linear-gradient(to right, #434343 0%, black 100%)'
    ];

    const presetImages = [
        'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=2000',
        'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&q=80&w=2000',
        'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=2000',
        'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&q=80&w=2000'
    ];

    const presetColors = [
        '#f8fafc', '#f1f5f9', '#e2e8f0', '#cbd5e1', '#94a3b8',
        '#64748b', '#475569', '#334155', '#1e293b', '#0f172a',
        '#fff1f2', '#ffe4e6', '#fecdd3', '#fda4af', '#f43f5e',
        '#f0fdf4', '#dcfce7', '#bbf7d0', '#86efac', '#22c55e'
    ];

    // Load fonts dynamically
    useEffect(() => {
        const fontsToLoad = [
            { family: appFontBody, weight: appFontWeightBody },
            { family: appFontHeading, weight: appFontWeightHeading }
        ];

        const fontQuery = fontsToLoad
            .map(f => `${f.family.replace(/ /g, '+')}:wght@${f.weight}`)
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

        // Apply font family & weight to document root
        document.documentElement.style.setProperty('--font-body', `"${appFontBody}", sans-serif`);
        document.documentElement.style.setProperty('--font-weight-body', appFontWeightBody);
        document.documentElement.style.setProperty('--font-heading', `"${appFontHeading}", sans-serif`);
        document.documentElement.style.setProperty('--font-weight-heading', appFontWeightHeading);
    }, [appFontBody, appFontWeightBody, appFontHeading, appFontWeightHeading]);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', appTheme);
    }, [appTheme]);

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = async () => {
                try {
                    const response = await fetch('http://localhost:5175/api/upload', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ image: reader.result })
                    });
                    const data = await response.json();
                    if (data.url) {
                        setBoardBackgroundValue(data.url);
                        setBoardBackgroundType('image');
                        // Refresh uploads
                        fetch('http://localhost:5175/api/uploads')
                            .then(res => res.json())
                            .then(setUploadedImages);
                    }
                } catch (error) {
                    console.error('Upload failed:', error);
                    alert('Failed to upload image to server');
                }
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
            <div className="sidebar-header">
                {activePanel !== 'main' && (
                    <button className="btn-back" onClick={() => setActivePanel('main')}>←</button>
                )}
                <h3>{activePanel === 'main' ? 'App Settings' : activePanel.charAt(0).toUpperCase() + activePanel.slice(1)}</h3>
                <button
                    className="btn-close-sidebar"
                    onClick={() => setIsSidebarOpen(false)}
                    title="Close"
                >
                    ✕
                </button>
            </div>
            <div className="sidebar-content">
                {activePanel === 'main' && (
                    <div className="settings-menu">
                        <div className="settings-group">
                            <button className="menu-item" onClick={() => setActivePanel('typography')}>
                                <div className="menu-icon typo">Aa</div>
                                <div className="menu-text">
                                    <span>Typography</span>
                                    <small>{appFontHeading} & {appFontBody}</small>
                                </div>
                                <div className="menu-arrow">→</div>
                            </button>

                            <button className="menu-item" onClick={() => setActivePanel('background')}>
                                <div className="menu-icon bg">🖼️</div>
                                <div className="menu-text">
                                    <span>Background</span>
                                    <small>{boardBackgroundType}</small>
                                </div>
                                <div className="menu-arrow">→</div>
                            </button>

                            <button className="menu-item" onClick={() => setActivePanel('theme')}>
                                <div className="menu-icon theme">🎨</div>
                                <div className="menu-text">
                                    <span>Color Theme</span>
                                    <small>{themes.find(t => t.id === appTheme)?.name}</small>
                                </div>
                                <div className="menu-arrow">→</div>
                            </button>
                        </div>

                        <div className="settings-group">
                            <label className="settings-label">View Mode</label>
                            <LayoutView customClasses="sidebar-toggle" />
                        </div>

                        <div className="settings-group">
                            <label className="settings-label">Sort Tasks By</label>
                            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="select-field">
                                <option value="createdAt">Date Created</option>
                                <option value="priority">Priority</option>
                                <option value="dueAt">Due Date</option>
                                <option value="alpha">Alphabetical</option>
                            </select>
                        </div>

                        <button
                            className="btn-sidebar-reset"
                            onClick={() => {
                                if (window.confirm('Are you sure you want to reset all theme, font and background settings to default?')) {
                                    setAppFontHeading('Outfit');
                                    setAppFontWeightHeading('700');
                                    setAppFontBody('Inter');
                                    setAppFontWeightBody('400');
                                    setAppTheme('default');
                                    setBoardBackgroundType('none');
                                    setBoardBackgroundValue('');
                                }
                            }}
                        >
                            Reset to Default Settings
                        </button>
                    </div>
                )}

                {activePanel === 'typography' && (
                    <div className="settings-panel">
                        <div className="settings-group">
                            <label className="settings-label">Body Font</label>
                            <select value={appFontBody} onChange={(e) => setAppFontBody(e.target.value)} className="select-field">
                                {bodyFonts.map(f => <option key={f.value} value={f.value}>{f.name}</option>)}
                            </select>
                        </div>
                        <div className="settings-group">
                            <label className="settings-label">Body Weight</label>
                            <div className="weight-selector">
                                {fontWeights.map(w => (
                                    <button key={w} className={`weight-btn ${appFontWeightBody === w ? 'active' : ''}`} onClick={() => setAppFontWeightBody(w)}>
                                        {w}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="settings-group">
                            <label className="settings-label">Heading Font</label>
                            <select value={appFontHeading} onChange={(e) => setAppFontHeading(e.target.value)} className="select-field">
                                {headingFonts.map(f => <option key={f.value} value={f.value}>{f.name}</option>)}
                            </select>
                        </div>
                        <div className="settings-group">
                            <label className="settings-label">Heading Weight</label>
                            <div className="weight-selector">
                                {fontWeights.map(w => (
                                    <button key={w} className={`weight-btn ${appFontWeightHeading === w ? 'active' : ''}`} onClick={() => setAppFontWeightHeading(w)}>
                                        {w}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activePanel === 'background' && (
                    <div className="settings-panel">
                        <div className="settings-group">
                            <label className="settings-label">Background Type</label>
                            <div className="type-selector">
                                {['none', 'color', 'gradient', 'image'].map(type => (
                                    <button key={type} className={`type-btn ${boardBackgroundType === type ? 'active' : ''}`} onClick={() => setBoardBackgroundType(type)}>
                                        {type.charAt(0).toUpperCase() + type.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {boardBackgroundType === 'color' && (
                            <div className="settings-group">
                                <label className="settings-label">Preset Colors</label>
                                <div className="preset-grid color-presets">
                                    {presetColors.map((c, i) => (
                                        <div key={i} className={`preset-item ${boardBackgroundValue === c ? 'active' : ''}`} style={{ background: c }} onClick={() => setBoardBackgroundValue(c)} />
                                    ))}
                                </div>
                                <label className="settings-label mt-3">Custom Color</label>
                                <div className="color-input-wrapper">
                                    <input type="color" value={boardBackgroundValue.startsWith('#') ? boardBackgroundValue : '#ffffff'} onChange={(e) => setBoardBackgroundValue(e.target.value)} className="color-picker-input" />
                                    <input type="text" value={boardBackgroundValue} onChange={(e) => setBoardBackgroundValue(e.target.value)} className="input-field hex-input" placeholder="#FFFFFF" />
                                </div>
                            </div>
                        )}

                        {boardBackgroundType === 'gradient' && (
                            <div className="settings-group">
                                <label className="settings-label">Preset Gradients</label>
                                <div className="preset-grid">
                                    {[...presetGradients,
                                        'linear-gradient(45deg, #ee0979, #ff6a00)',
                                        'linear-gradient(to right, #00b09b, #96c93d)',
                                        'linear-gradient(to right, #8e2de2, #4a00e0)'
                                    ].map((g, i) => (
                                        <div key={i} className={`preset-item ${boardBackgroundValue === g ? 'active' : ''}`} style={{ background: g }} onClick={() => setBoardBackgroundValue(g)} />
                                    ))}
                                </div>
                                <label className="settings-label mt-2">Custom Gradient CSS</label>
                                <textarea className="input-field text-area" rows="3" value={boardBackgroundValue} onChange={(e) => setBoardBackgroundValue(e.target.value)} placeholder="linear-gradient(...)" />
                            </div>
                        )}

                        {boardBackgroundType === 'image' && (
                            <div className="settings-group">
                                <label className="settings-label">Upload Background</label>
                                <div className="upload-container" onClick={() => document.getElementById('bg-upload').click()}>
                                    <span className="upload-icon">⬆️</span>
                                    <span>Click to Upload Image</span>
                                    <input id="bg-upload" type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                                </div>

                                {uploadedImages.length > 0 && (
                                    <>
                                        <label className="settings-label mt-3">Your Uploads</label>
                                        <div className="preset-grid">
                                            {uploadedImages.map((img, i) => (
                                                <div key={i} className={`preset-item ${boardBackgroundValue === img ? 'active' : ''}`} style={{ backgroundImage: `url(${img})`, backgroundSize: 'cover', backgroundPosition: 'center' }} onClick={() => setBoardBackgroundValue(img)} />
                                            ))}
                                        </div>
                                    </>
                                )}

                                <label className="settings-label mt-3">Preset Images</label>
                                <div className="preset-grid">
                                    {presetImages.map((img, i) => (
                                        <div key={i} className={`preset-item ${boardBackgroundValue === img ? 'active' : ''}`} style={{ backgroundImage: `url(${img})`, backgroundSize: 'cover' }} onClick={() => setBoardBackgroundValue(img)} />
                                    ))}
                                </div>
                                <label className="settings-label mt-2">Image URL</label>
                                <input type="text" className="input-field" value={boardBackgroundValue} onChange={(e) => setBoardBackgroundValue(e.target.value)} placeholder="https://..." />
                            </div>
                        )}
                    </div>
                )}

                {activePanel === 'theme' && (
                    <div className="settings-panel">
                        <div className="settings-group">
                            <label className="settings-label">Choose Theme</label>
                            <div className="theme-grid">
                                <div className={`theme-card ${appTheme === 'default' ? 'active' : ''}`} onClick={() => setAppTheme('default')}>
                                    <div className="theme-color" style={{ background: '#4f46e5' }} />
                                    <span>Default Indigo</span>
                                </div>
                                {themes.filter(t => t.id !== 'default').map(t => (
                                    <div key={t.id} className={`theme-card ${appTheme === t.id ? 'active' : ''}`} onClick={() => setAppTheme(t.id)}>
                                        <div className="theme-color" style={{ background: t.primary }} />
                                        <span>{t.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>

    );
}