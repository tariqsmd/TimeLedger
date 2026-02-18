import React from 'react';
import { useApp } from '../../contexts/AppContext';
import { formatDateDisplay, getDayName, isWeekend } from '../../utils/dateUtils';
import { scheduleData } from '../../data/scheduleData';
import Chip from '../shared/Chip';
import styles from './TrackerEntry.module.css';

export default function TrackerEntry({ entry }) {
    const { openModal, deleteEntry } = useApp();
    const entryDate = new Date(entry.date);
    const dayName = getDayName(entryDate);
    const blocks = isWeekend(entryDate)
        ? scheduleData.current.weekend
        : scheduleData.current.weekday;

    const completionClass = entry.completion >= 75 ? 'high'
        : entry.completion >= 50 ? 'medium'
            : 'low';

    const statusClass = entry.completion >= 75 ? 'completed'
        : entry.completion >= 50 ? 'partial'
            : 'missed';

    const handleEdit = () => {
        openModal(entry);
    };

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this entry?')) {
            deleteEntry(entry.id);
        }
    };

    return (
        <div className={`${styles.trackerEntry} ${styles[statusClass]}`}>
            <div className={styles.entryHeader}>
                <div className={styles.entryDate}>
                    {dayName}, {formatDateDisplay(entryDate)}
                </div>
                <div className={`${styles.entryCompletion} ${styles[completionClass]}`}>
                    {entry.completion}% Complete
                </div>
            </div>

            <div className={styles.entryBlocks}>
                {entry.completedBlocks.map(idx => {
                    const block = blocks[idx];
                    return (
                        <Chip
                            key={idx}
                            icon={block.icon}
                            time={block.time}
                            category={block.category}
                        />
                    );
                })}
            </div>

            {entry.notes && (
                <div className={styles.entryNotes}>"{entry.notes}"</div>
            )}

            <div className={styles.entryActions}>
                <button className={styles.btnEdit} onClick={handleEdit}>
                    Edit
                </button>
                <button className={styles.btnDelete} onClick={handleDelete}>
                    Delete
                </button>
            </div>
        </div>
    );
}
