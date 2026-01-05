import React from 'react';
import styles from './StatCard.module.css';

export default function StatCard({ value, label, icon, color }) {
    return (
        <div className={styles.statCard}>
            <div className={styles.icon} style={{ color: color || 'var(--primary)' }}>
                {icon}
            </div>
            <div className={styles.info}>
                <div className={styles.value}>{value}</div>
                <div className={styles.label}>{label}</div>
            </div>
        </div>
    );
}
