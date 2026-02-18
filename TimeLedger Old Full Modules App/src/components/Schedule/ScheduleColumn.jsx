import React from 'react';
import TimeBlock from './TimeBlock';
import styles from './ScheduleColumn.module.css';

export default function ScheduleColumn({ title, subtitle, blocks, type, dayType }) {
    return (
        <div className={styles.scheduleColumn}>
            <div className={styles.colHeader}>
                <h3 className={styles.title}>{title}</h3>
                {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
            </div>
            <div className={styles.blocksList}>
                {blocks.map((block, index) => (
                    <TimeBlock
                        key={block.id || index}
                        {...block}
                        type={type}
                        dayType={dayType}
                    />
                ))}
            </div>
        </div>
    );
}
