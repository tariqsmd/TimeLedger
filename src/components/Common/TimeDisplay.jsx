/**
 * TimeDisplay.jsx
 * Reusable time display component with live updates
 * format '2-digit-minute', 'full-time', 'custom'
 * formatDate 'full', 'short', 'iso'
 */
import React, { useState, useEffect } from 'react';
import { formatTime, formatDate } from '../../utils/Helpers';

export default function TimeDisplay({
    timeFormat = '2-digit-minute',
    dateFoemat = 'full',
    showDate = false
}) {
    const [time, setTime] = useState(new Date());
    const [date, setDate] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setDate(new Date()), 30000); // Update every 30 minute
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="timeWidget">
            {showDate ? <span className="date">{formatDate(date, dateFoemat)}</span> : ""}
            <span className="time">{formatTime(time, timeFormat)}</span>
        </div>
    );
}