import { IconSettings, IconPlus, IconList } from '../../assets//Icons';
import { useApp } from '../../utils/AppContext';
import { useQuickTasks } from '../../utils/QuickTasksContext';
import Search from '../Common/Search';
import TimeDisplay from '../Common/TimeDisplay';
import ProgressWidget from '../Common/ProgressWidget';
import LayoutView from '../Common/LayoutView'

export default function Header() {
    const {
        searchQuery,
        setSearchQuery,
        todos,
        isSidebarOpen,
        setIsSidebarOpen,
    } = useApp();

    const { openQuickTasksModal } = useQuickTasks();

    return (
        <header className="header">
            {/* Left Column */}
            <div className="header-left">
                <div className="logo">
                    <div className="logo-icon">TL</div>
                    <div className="logo-text">Time<span>Ledger</span></div>
                </div>

                <Search value={searchQuery} onChange={setSearchQuery} placeholder="Search" />
            </div>

            {/* Center Column */}
            <div className="header-cener">
                <div className="header-quick-actions">
                    <button 
                        className="btn-prominent add-task-btn" 
                        onClick={() => openQuickTasksModal('add')}
                        title="Add Quick Task/Note"
                    >
                        <IconPlus size={18} />
                        <span>Quick Task</span>
                    </button>
                    <button 
                        className="btn-prominent view-tasks-btn" 
                        onClick={() => openQuickTasksModal('view')}
                        title="View Quick Tasks"
                    >
                        <IconList size={18} />
                        <span>View Tasks</span>
                    </button>
                </div>
            </div>

            {/* Right Column */}
            <div className="header-right">
                <ProgressWidget todos={todos} />
                <LayoutView showLabels={false} />
                <TimeDisplay format="2-digit-minute" showDate={true} />
                {/* <DateDisplay format="full" /> */}
                <button className="btn-icon settings-btn" onClick={() => setIsSidebarOpen(!isSidebarOpen)} title="Settings"><IconSettings size={20} /></button>
            </div>
        </header>
    );
}
