import React, { useState, useEffect } from 'react';
import styles from './Header.module.css';

export default function Header() {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const formatDate = (date) => {
        return date.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });
    };

    return (
        <header className={styles.header}>
            <div className={styles.left}>
                <h1 className={styles.title}>Dashboard</h1>
                <p className={styles.date}>{formatDate(time)}</p>
            </div>
            <div className={styles.right}>
                <div className={styles.timeContainer}>
                    <span className={styles.time}>{formatTime(time)}</span>
                </div>
                <div className={styles.searchBar}>
                    <span className={styles.searchIcon}>🔍</span>
                    <input type="text" placeholder="Search entries..." />
                </div>
            </div>
        </header>
    );
}
