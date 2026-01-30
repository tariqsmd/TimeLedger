/**
 * LayoutView.jsx
 * Reusable component
 */
import { useApp } from '../../utils/AppContext';
import { IconBoard, IconList, IconTable } from '../../assets/Icons';

export default function LayoutView({ customClasses = "", showLabels = true }) {
    const {
        viewMode,
        setViewMode,
    } = useApp();

    return (
        <div className={`view-mode-toggle ${customClasses}`}>
            <button className={`toggle-btn ${viewMode === 'board' ? 'active' : ''}`} onClick={() => setViewMode('board')}>
                <IconBoard size={16} />
                {showLabels ? 'Board' : ''}
            </button>
            <button className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`} onClick={() => setViewMode('list')}>
                <IconList size={16} />
                {showLabels ? 'List' : ''}
            </button>
            <button className={`toggle-btn ${viewMode === 'table' ? 'active' : ''}`} onClick={() => setViewMode('table')}>
                <IconTable size={16} />
                {showLabels ? 'Table' : ''}
            </button>
        </div>
    );
}
