import React, { useMemo } from 'react';
import { useApp } from '../../contexts/AppContext';
import { getWeekStart, getWeekEnd } from '../../utils/dateUtils';
import TrackerEntry from './TrackerEntry';
import styles from './TrackerList.module.css';

export default function TrackerList() {
    const { trackerData, weekOffset, searchQuery } = useApp();

    const weekStart = getWeekStart(weekOffset);
    const weekEnd = getWeekEnd(weekStart);

    const filteredEntries = useMemo(() => {
        let entries = trackerData.entries.filter(entry => {
            const entryDate = new Date(entry.date);
            return entryDate >= weekStart && entryDate <= weekEnd;
        });

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            entries = entries.filter(entry =>
                (entry.reflection && entry.reflection.toLowerCase().includes(query)) ||
                (entry.blocks && entry.blocks.some(b => b.text.toLowerCase().includes(query)))
            );
        }

        return entries.sort((a, b) => new Date(b.date) - new Date(a.date));
    }, [trackerData.entries, weekStart, weekEnd, searchQuery]);

    if (filteredEntries.length === 0) {
        return (
            <div className={styles.emptyState}>
                <p>
                    {searchQuery
                        ? `No entries match "${searchQuery}" for this week.`
                        : 'No entries for this week. Click "Add Today\'s Entry" to start tracking!'}
                </p>
            </div>
        );
    }

    return (
        <div className={styles.trackerList}>
            {filteredEntries.map(entry => (
                <TrackerEntry key={entry.id} entry={entry} />
            ))}
        </div>
    );
}
