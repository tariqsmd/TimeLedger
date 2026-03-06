// Analytics calculation utilities

export function calculateTotalDays(entries) {
    return entries.length;
}

export function calculateCompletionRate(entries) {
    if (entries.length === 0) return 0;
    const completedDays = entries.filter(e => e.completion >= 75).length;
    return Math.round((completedDays / entries.length) * 100);
}

export function calculateStreaks(entries) {
    const sortedEntries = [...entries].sort((a, b) =>
        new Date(a.date) - new Date(b.date)
    );

    let currentStreak = 0;
    let bestStreak = 0;
    let tempStreak = 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = sortedEntries.length - 1; i >= 0; i--) {
        const entry = sortedEntries[i];
        const entryDate = new Date(entry.date);
        entryDate.setHours(0, 0, 0, 0);

        if (entry.completion >= 75) {
            tempStreak++;
            if (tempStreak > bestStreak) {
                bestStreak = tempStreak;
            }

            const daysDiff = Math.floor((today - entryDate) / (1000 * 60 * 60 * 24));
            if (daysDiff <= tempStreak - 1) {
                currentStreak = tempStreak;
            }
        } else {
            tempStreak = 0;
        }
    }

    return { currentStreak, bestStreak };
}

export function analyzeDayPerformance(entries) {
    if (entries.length === 0) return null;

    const dayStats = {};

    entries.forEach(entry => {
        const dayName = new Date(entry.date).toLocaleDateString('en-US', { weekday: 'long' });
        if (!dayStats[dayName]) {
            dayStats[dayName] = { total: 0, count: 0 };
        }
        dayStats[dayName].total += entry.completion;
        dayStats[dayName].count++;
    });

    let bestDay = null;
    let bestAvg = 0;

    Object.keys(dayStats).forEach(day => {
        const avg = dayStats[day].total / dayStats[day].count;
        if (avg > bestAvg) {
            bestAvg = avg;
            bestDay = day;
        }
    });

    return { bestDay, bestAvg: Math.round(bestAvg) };
}

export function analyzeBlockCompletion(entries, scheduleData) {
    if (entries.length === 0) return null;

    const blockCompletionRates = {};

    entries.forEach(entry => {
        const isWeekend = new Date(entry.date).getDay() === 0 || new Date(entry.date).getDay() === 6;
        const blocks = isWeekend ? scheduleData.current.weekend : scheduleData.current.weekday;

        entry.completedBlocks.forEach(idx => {
            const blockKey = blocks[idx].activity;
            if (!blockCompletionRates[blockKey]) {
                blockCompletionRates[blockKey] = { completed: 0, total: 0 };
            }
            blockCompletionRates[blockKey].completed++;
        });

        blocks.forEach(block => {
            const blockKey = block.activity;
            if (!blockCompletionRates[blockKey]) {
                blockCompletionRates[blockKey] = { completed: 0, total: 0 };
            }
            blockCompletionRates[blockKey].total++;
        });
    });

    let lowestRate = 100;
    let challengingBlock = null;

    Object.keys(blockCompletionRates).forEach(block => {
        const stats = blockCompletionRates[block];
        const rate = (stats.completed / stats.total) * 100;
        if (rate < lowestRate) {
            lowestRate = rate;
            challengingBlock = block;
        }
    });

    return { challengingBlock, lowestRate: Math.round(lowestRate) };
}
