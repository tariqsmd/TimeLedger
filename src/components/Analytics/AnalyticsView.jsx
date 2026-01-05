import React from 'react';
import { useApp } from '../../contexts/AppContext';
import { scheduleData } from '../../data/scheduleData';
import {
    calculateTotalDays,
    calculateCompletionRate,
    calculateStreaks,
    analyzeDayPerformance,
    analyzeBlockCompletion
} from '../../utils/analyticsUtils';
import StatCard from './StatCard';
import styles from './AnalyticsView.module.css';

export default function AnalyticsView() {
    const { trackerData, todos } = useApp();
    const entries = trackerData.entries;

    // Calculate schedule stats
    const totalDays = calculateTotalDays(entries);
    const completionRate = calculateCompletionRate(entries);
    const { currentStreak, bestStreak } = calculateStreaks(entries);

    // Calculate todo stats
    const totalTodos = todos.length;
    const completedTodos = todos.filter(t => t.completed).length;
    const todoCompletionRate = totalTodos > 0 ? Math.round((completedTodos / totalTodos) * 100) : 0;

    // Calculate total duration tracked in todos
    const totalDurationMins = todos.reduce((acc, todo) => {
        if (todo.startTime && todo.endTime) {
            return acc + (new Date(todo.endTime) - new Date(todo.startTime)) / 60000;
        }
        return acc;
    }, 0);
    const formattedDuration = totalDurationMins >= 60
        ? `${Math.floor(totalDurationMins / 60)}h ${Math.round(totalDurationMins % 60)}m`
        : `${Math.round(totalDurationMins)}m`;

    // Generate insights
    const insights = [];

    if (entries.length === 0 && totalTodos === 0) {
        insights.push('Start tracking to see personalized insights!');
    } else {
        // Schedule insights
        const dayPerf = analyzeDayPerformance(entries);
        if (dayPerf) {
            insights.push(`Your best day is ${dayPerf.bestDay} with ${dayPerf.bestAvg}% average completion.`);
        }

        const blockAnalysis = analyzeBlockCompletion(entries, scheduleData);
        if (blockAnalysis && blockAnalysis.lowestRate < 70) {
            insights.push(`⚠️ "${blockAnalysis.challengingBlock}" is your most challenging block (${blockAnalysis.lowestRate}% completion). Consider adjusting timing or breaking it down.`);
        }

        // Todo insights
        if (totalTodos > 0) {
            if (todoCompletionRate >= 80) {
                insights.push('🚀 Amazing! Your task completion rate is high. You\'re a productivity powerhouse!');
            } else if (todoCompletionRate < 50) {
                insights.push('📝 Consider breaking down your larger tasks into smaller, more manageable ones to improve completion.');
            }

            if (totalDurationMins > 0) {
                insights.push(`⏱️ You've logged a total of ${formattedDuration} of focused work on your tasks.`);
            }
        }
    }

    return (
        <div className={styles.analyticsView}>
            <div className="view-header">
                <h2 className="view-title">Analytics & Insights</h2>
                <p className="view-subtitle">Deep dive into your productivity patterns and habits</p>
            </div>

            <div className={styles.sectionHeader}>
                <h3>📅 Schedule Performance</h3>
            </div>
            <div className={styles.statsGrid}>
                <StatCard value={totalDays} label="Days Tracked" icon="📅" />
                <StatCard value={`${completionRate}%`} label="Avg. Adherence" icon="📈" />
                <StatCard value={currentStreak} label="Current Streak" icon="🔥" color="var(--warning)" />
                <StatCard value={bestStreak} label="Best Streak" icon="🏆" color="var(--accent)" />
            </div>

            <div className={styles.sectionHeader}>
                <h3>✅ Task Analytics</h3>
            </div>
            <div className={styles.statsGrid}>
                <StatCard value={totalTodos} label="Total Tasks" icon="📋" color="var(--primary)" />
                <StatCard value={`${todoCompletionRate}%`} label="Tasks Done" icon="✅" color="var(--accent)" />
                <StatCard value={completedTodos} label="Completed" icon="✨" color="var(--secondary)" />
                <StatCard value={formattedDuration} label="Time Logged" icon="⏱️" color="var(--primary)" />
            </div>

        </div>
    );
}
