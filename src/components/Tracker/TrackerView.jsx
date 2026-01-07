import React from 'react';
import WeekSelector from './WeekSelector';
import TrackerControls from './TrackerControls';
import TrackerList from './TrackerList';
import styles from './TrackerView.module.css';

export default function TrackerView() {
    return (
        <div className={styles.trackerView}>
            <div className={styles.contentGrid}>
                <div className={styles.mainCol}>
                    <WeekSelector />
                    <TrackerControls />
                    <TrackerList />
                </div>

                <div className={styles.sideCol}>
                    <div className={styles.statsCard}>
                        <h4>Quick Stats</h4>
                        <div className={styles.statItem}>
                            <span>Consistency</span>
                            <span className={styles.statValue}>84%</span>
                        </div>
                        <div className={styles.statItem}>
                            <span>Focus Score</span>
                            <span className={styles.statValue}>9.2</span>
                        </div>
                    </div>

                    <div className={styles.tipsBox}>
                        <h3>📝 Tracking Tips</h3>
                        <ul>
                            <li>Track at the end of each day for accuracy</li>
                            <li>Be honest about what worked and what didn't</li>
                            <li>Note any obstacles or distractions</li>
                            <li>Review weekly to identify patterns</li>
                            <li>Aim for 80% adherence (flexibility is key)</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
