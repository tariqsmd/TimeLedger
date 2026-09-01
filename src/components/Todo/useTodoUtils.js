export function useIsOverdue(todo) {
    if (!todo.dueAt || todo.completed) return false;
    return new Date(todo.dueAt) < new Date();
}

export function formatDateShort(isoString) {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

export function formatDateFull(isoString) {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' }) + ' at ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function getLiveDuration(todo) {
    let totalMs = todo.accumulatedTime || 0;
    if (todo.status === 'running' && todo.lastStartedAt) {
        totalMs += (new Date() - new Date(todo.lastStartedAt));
    }

    const mins = Math.floor(totalMs / 60000);
    const hrs = Math.floor(mins / 60);
    if (hrs > 0) return `${hrs}h ${mins % 60}m`;
    if (mins > 0) return `${mins}m ${Math.floor((totalMs % 60000) / 1000)}s`;
    return `${Math.floor(totalMs / 1000)}s`;
}
