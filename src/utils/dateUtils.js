// Date utility functions

export function formatDate(date) {
    return date.toISOString().split('T')[0];
}

export function formatDateDisplay(date) {
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

export function getWeekStart(offset = 0) {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1); // Monday
    const monday = new Date(today.setDate(diff));
    monday.setDate(monday.getDate() + (offset * 7));
    return monday;
}

export function getWeekEnd(weekStart) {
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    return weekEnd;
}

export function isWeekend(date) {
    const day = new Date(date).getDay();
    return day === 0 || day === 6;
}

export function getDayName(date) {
    return new Date(date).toLocaleDateString('en-US', { weekday: 'long' });
}
