export const formatTime = (date, format) => {
    if (format === '2-digit-minute') {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleTimeString();
};

export const formatDate = (dateObj, format) => {
    if (format === 'full') {
        return dateObj.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });
    } else if (format === 'short') {
        return dateObj.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
    return dateObj.toISOString().split('T')[0];
};
