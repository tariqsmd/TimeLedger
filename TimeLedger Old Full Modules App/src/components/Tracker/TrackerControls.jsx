import React from 'react';
import { useApp } from '../../contexts/AppContext';
import { exportToJSON } from '../../utils/exportUtils';
import { formatDate } from '../../utils/dateUtils';
import styles from './TrackerControls.module.css';

export default function TrackerControls() {
    const { openModal, trackerData } = useApp();

    const handleExport = () => {
        const filename = `timeblock-tracker-${formatDate(new Date())}.json`;
        exportToJSON(trackerData, filename);
    };

    return (
        <div className={styles.trackerControls}>
            <button className={styles.btnPrimary} onClick={() => openModal()}>
                + Add New Entry
            </button>
            <button className={styles.btnSecondary} onClick={handleExport}>
                📊 Export Data
            </button>
        </div>
    );
}
