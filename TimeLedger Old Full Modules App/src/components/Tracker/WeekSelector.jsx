import React from 'react';
import { useApp } from '../../contexts/AppContext';
import { formatDateDisplay, getWeekStart, getWeekEnd } from '../../utils/dateUtils';
import styles from './WeekSelector.module.css';

export default function WeekSelector() {
    const { weekOffset, setWeekOffset } = useApp();

    const weekStart = getWeekStart(weekOffset);
    const weekEnd = getWeekEnd(weekStart);

    return (
        <div className={styles.weekSelector}>
            <button onClick={() => setWeekOffset(weekOffset - 1)}>
                ← Previous Week
            </button>
            <span>
                {formatDateDisplay(weekStart)} - {formatDateDisplay(weekEnd)}
            </span>
            <button onClick={() => setWeekOffset(weekOffset + 1)}>
                Next Week →
            </button>
        </div>
    );
}
