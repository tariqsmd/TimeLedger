import React from 'react';
import { useApp } from '../../contexts/AppContext';
import { getWeekStart, getWeekEnd } from '../../utils/dateUtils';
import TrackerEntry from './TrackerEntry';
import styles from './TrackerList.module.css';

export default function TrackerList() {
    const { trackerData, weekOffset } = useApp();

    const weekStart = getWeekStart(weekOffset);
    const weekEnd = getWeekEnd(weekStart);

    const weekEntries = trackerData.entries.filter(entry => {
        const entryDate = new Date(entry.date);
        return entryDate >= weekStart && entryDate <= weekEnd;
    }).sort((a, b) => new Date(b.date) - new Date(a.date));

    if (weekEntries.length === 0) {
        return (
            <div className={styles.emptyState}>
                <p>No entries for this week. Click "Add Today's Entry" to start tracking!</p>
            </div>
        );
    }

    return (
        <div className={styles.trackerList}>
            {weekEntries.map(entry => (
                <TrackerEntry key={entry.id} entry={entry} />
            ))}
        </div>
    );
}
