/**
 * DateDisplay.jsx
 * Reusable date display component with live updates
 */
import React, { useState, useEffect } from 'react';
import { formatDate } from '../../utils/Helpers';

export default function DateDisplay({
    format = 'full' // 'full', 'short', 'iso'
}) {
    const [date, setDate] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setDate(new Date()), 30000); // Update every 30 minute
        return () => clearInterval(timer);
    }, []);

    return (
        <p className="date">{formatDate(date, format)}</p>
    );
}
