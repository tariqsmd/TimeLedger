import { IconSettings, IconPlus } from '../../assets/Icons';
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

    const { activeLayout, openQuickTasksModal } = useQuickTasks();

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
            <div className="header-cener"></div>

            {/* Right Column */}
            <div className="header-right">
                <button 
                    className="btn-prominent-header" 
                    onClick={() => openQuickTasksModal()}
                    title="Add Quick Task/Note"
                    style={{ marginRight: '10px' }}
                >
                    <IconPlus size={18} />
                    <span>Add Task</span>
                </button>
                {activeLayout === 'modern' && (
                    <>
                        <ProgressWidget todos={todos} />
                        <LayoutView showLabels={false} />
                    </>
                )}
                <TimeDisplay format="2-digit-minute" showDate={true} />
                <button className="btn-icon settings-btn" onClick={() => setIsSidebarOpen(!isSidebarOpen)} title="Settings"><IconSettings size={20} /></button>
            </div>
        </header>
    );
}
