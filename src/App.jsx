import React from 'react';
import { AppProvider, useApp } from './contexts/AppContext';
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


import Footer from './components/Layout/Footer';

function MainLayout() {
    const { activeTab, setActiveTab } = useApp();

    return (
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
                <Footer />
            </main>

            <InfoSidebar activeTab={activeTab} />
            <EntryModal />
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
