import React from 'react';
import styles from './AnalysisBox.module.css';

export default function AnalysisBox({ title, items, variant }) {
    return (
        <div className={`${styles.analysisBox} ${styles[variant]}`}>
            <h3>{title}</h3>
            <ul>
                {items.map((item, index) => (
                    <li key={index}>{item}</li>
                ))}
            </ul>
        </div>
    );
}
