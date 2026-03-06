import React from 'react';
import styles from './Chip.module.css';

export default function Chip({ icon, time, category }) {
    return (
        <span className={`${styles.chip} ${styles[category]}`}>
            {icon} {time}
        </span>
    );
}
