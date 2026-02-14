/**
 * DateDisplay.jsx
 * Reusable date display component with live updates
 */
import React, { useState, useEffect } from 'react';

export default function DateDisplay({
    format = 'full' // 'full', 'short', 'iso'
}) {
    const [date, setDate] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setDate(new Date()), 30000); // Update every 30 minute
        return () => clearInterval(timer);
    }, []);
    5
    const formatDate = (dateObj) => {
        if (format === 'full') {
            return dateObj.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });
        } else if (format === 'short') {
            return dateObj.toLocaleDateString([], { month: 'short', day: 'numeric' });
        }
        return dateObj.toISOString().split('T')[0];
    };

    return (
        <p className="date">{formatDate(date)}</p>
    );
}
