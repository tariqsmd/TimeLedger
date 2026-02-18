import React from 'react';
import { useApp } from '../../contexts/AppContext';
import styles from './TimeBlock.module.css';

export default function TimeBlock({ id, time, activity, hours, category, icon, type, dayType }) {
    const { deleteScheduleBlock, openModal } = useApp();

    const handleTrack = () => {
        // Pre-fill the entry modal with this activity
        openModal({
            activity,
            category,
            duration: hours,
            date: new Date().toISOString().split('T')[0]
        });
    };

    return (
        <div className={`${styles.timeBlock} ${styles[category]}`}>
            <div className={styles.blockInfo}>
                <div className={styles.blockTime}>
                    <span className={styles.icon}>{icon}</span>
                    <span className={styles.timeText}>{time}</span>
                    <span className={styles.duration}>({hours}h)</span>
                </div>
                <div className={styles.blockActivity}>{activity}</div>
            </div>

            <div className={styles.blockActions}>
                <button
                    className={styles.btnTrack}
                    title="Log this activity"
                    onClick={handleTrack}
                >
                    ⏱️
                </button>
                <button
                    className={styles.btnDelete}
                    title="Remove from schedule"
                    onClick={() => deleteScheduleBlock(type, dayType, id || time)}
                >
                    🗑️
                </button>
            </div>
        </div>
    );
}
