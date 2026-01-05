import React from 'react';
import { AppProvider } from './contexts/AppContext';
import Sidebar from './components/Layout/Sidebar';
import InfoSidebar from './components/Layout/InfoSidebar';
import Header from './components/Layout/Header';
import ScheduleView from './components/Schedule/ScheduleView';
import TrackerView from './components/Tracker/TrackerView';
import TodoView from './components/Todo/TodoView';
import AnalyticsView from './components/Analytics/AnalyticsView';
import SettingsView from './components/Settings/SettingsView';
import ProfileView from './components/Profile/ProfileView';
import EntryModal from './components/Modal/EntryModal';
import './App.css';

import { useLocalStorage } from './hooks/useLocalStorage';

function App() {
    const [activeTab, setActiveTab] = useLocalStorage('activeView', 'analytics');

    return (
        <AppProvider>
            <div className="dashboard-layout">
                <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

                <main className="main-content">
                    <Header />
                    <div className="content-area">
                        {activeTab === 'schedules' && <ScheduleView />}
                        {activeTab === 'tracker' && <TrackerView />}
                        {activeTab === 'tasks' && <TodoView />}
                        {activeTab === 'analytics' && <AnalyticsView />}
                        {activeTab === 'settings' && <SettingsView />}
                        {activeTab === 'profile' && <ProfileView />}
                    </div>
                </main>

                <InfoSidebar activeTab={activeTab} />
                <EntryModal />
            </div>
        </AppProvider>
    );
}

export default App;
