import React, { useState } from 'react';
import { IconPlus, IconSettings } from '../../assets//Icons';

import { useApp } from '../../utils/AppContext';
import Search from '../Common/Search';
import TimeDisplay from '../Common/TimeDisplay';
import DateDisplay from '../Common/DateDisplay';
import ProgressWidget from '../Common/ProgressWidget';

export default function Header() {
    const {
        searchQuery, setSearchQuery,
        todos,
        isSidebarOpen,
        setIsSidebarOpen,
        loadSampleData
    } = useApp();

    return (
        <header className="header">
            {/* Left Column: Logo */}
            <div className="header-left">
                <div className="logo">
                    <div className="logo-icon">TL</div>
                    <div className="logo-text">Time<span>Ledger</span></div>
                </div>

                <Search value={searchQuery} onChange={setSearchQuery} placeholder="Search" />
            </div>

            {/* Right Column: User Controls */}
            <div className="header-right">
                {/* <button className="btn-add-task" onClick={loadSampleData}>Load Samples</button> */}

                <ProgressWidget todos={todos} />
                <TimeDisplay format="2-digit-minute" />
                <DateDisplay format="full" />

                <button
                    className="btn-icon settings-btn"
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    title="Settings"
                >
                    <IconSettings size={20} />
                </button>
            </div>
        </header>
    );
}