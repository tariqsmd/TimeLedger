/**
 * useTodoUtils.js
 * Utility functions for todo formatting and calculations
 */

export function useIsOverdue(todo) {
    if (!todo.dueAt || todo.completed) return false;
    return new Date(todo.dueAt) < new Date();
}

export function formatTime(isoString) {
    if (!isoString) return '';
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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

export function formatDueDate(dateString) {
    if (!dateString) return '';
    if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
        const [year, month, day] = dateString.split('-').map(Number);
        return new Date(year, month - 1, day).toLocaleDateString();
    }
    return new Date(dateString).toLocaleDateString();
}

export function getFullDateLabel(dateKey) {
    const date = new Date(dateKey);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return date.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });
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

export function getGroupedTodos(todos, groupBy) {
    return todos.reduce((groups, todo) => {
        let key;
        if (groupBy === 'date') key = new Date(todo.createdAt).toDateString();
        else key = todo.listTitle || 'Default';

        if (!groups[key]) groups[key] = [];
        groups[key].push(todo);
        return groups;
    }, {});
}

export function sortTasks(tasks, sortBy) {
    if (sortBy === 'manual') return tasks;
    return [...tasks].sort((a, b) => {
        if (sortBy === 'alphabetical') return a.text.localeCompare(b.text);
        return new Date(b.createdAt) - new Date(a.createdAt);
    });
}
