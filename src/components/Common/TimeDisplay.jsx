/**
 * TimeDisplay.jsx
 * Reusable time display component with live updates
 */
import React, { useState, useEffect } from 'react';

export default function TimeDisplay({
    format = '2-digit-minute' // '2-digit-minute', 'full-time', 'custom'
}) {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (date) => {
        if (format === '2-digit-minute') {
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
        return date.toLocaleTimeString();
    };

    return (
        <div className="timeWidget">
            <span>{formatTime(time)}</span>
        </div>
    );
}
