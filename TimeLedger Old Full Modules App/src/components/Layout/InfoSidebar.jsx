import React from 'react';
import { useApp } from '../../contexts/AppContext';
import { scheduleData } from '../../data/scheduleData';
import { analysisData } from '../../data/analysisData';
import {
    calculateCompletionRate,
    analyzeDayPerformance,
    analyzeBlockCompletion
} from '../../utils/analyticsUtils';
import styles from './InfoSidebar.module.css';

export default function InfoSidebar({ activeTab }) {
    const { notices, removeNotice, todos, trackerData } = useApp();
    const entries = trackerData.entries;

    const activeTasks = todos.filter(t => t.status === 'running' || t.status === 'paused');
    const completionRate = calculateCompletionRate(entries);

    // AI Insights Logic
    const generateInsights = () => {
        const insights = [];
        const totalTodos = todos.length;
        const completedTodos = todos.filter(t => t.completed).length;
        const todoCompletionRate = totalTodos > 0 ? Math.round((completedTodos / totalTodos) * 100) : 0;

        if (entries.length === 0 && totalTodos === 0) {
            return ['Start tracking to see personalized insights!'];
        }

        const dayPerf = analyzeDayPerformance(entries);
        if (dayPerf) insights.push(`Best day: ${dayPerf.bestDay} (${dayPerf.bestAvg}%)`);

        const blockAnalysis = analyzeBlockCompletion(entries, scheduleData);
        if (blockAnalysis && blockAnalysis.lowestRate < 70) {
            insights.push(`⚠️ "${blockAnalysis.challengingBlock}" needs focus (${blockAnalysis.lowestRate}%)`);
        }

        if (todoCompletionRate >= 80) insights.push('🚀 Peak productivity detected!');
        else if (todoCompletionRate < 50 && totalTodos > 5) insights.push('📝 Try breaking down larger tasks.');

        return insights;
    };

    const renderDefaultInfo = () => (
        <>
            <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Intelligence Hub</h3>
                <div className={styles.noticeList}>
                    {notices.map(notice => (
                        <div key={notice.id} className={`${styles.noticeCard} ${styles[notice.type]}`}>
                            <div className={styles.noticeHeader}>
                                <span className={styles.noticeIcon}>{notice.icon}</span>
                                <button className={styles.btnClose} onClick={() => removeNotice(notice.id)}>&times;</button>
                            </div>
                            <h4 className={styles.noticeTitle}>{notice.title}</h4>
                            <p className={styles.noticeText}>{notice.text}</p>
                        </div>
                    ))}
                    {notices.length === 0 && <div className={styles.emptyNotices}>All clear! ✨</div>}
                </div>
            </div>
            <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Global Metrics</h3>
                <div className={styles.metricsGrid}>
                    <div className={styles.metricCard}>
                        <span className={styles.metricLabel}>Sessions</span>
                        <span className={styles.metricValue}>{activeTasks.length}</span>
                    </div>
                    <div className={styles.metricCard}>
                        <span className={styles.metricLabel}>Adherence</span>
                        <span className={styles.metricValue}>{completionRate}%</span>
                    </div>
                </div>
            </div>
        </>
    );

    const renderAnalyticsWidgets = () => (
        <div className={styles.section}>
            <h3 className={styles.sectionTitle}>💡 Contextual Insights</h3>
            <div className={styles.insightsList}>
                {generateInsights().map((insight, idx) => (
                    <div key={idx} className={styles.insightCard}>
                        {insight}
                    </div>
                ))}
            </div>
        </div>
    );

    const renderTaskWidgets = () => {
        const completedCount = todos.filter(t => t.completed).length;
        const progress = todos.length > 0 ? (completedCount / todos.length) * 100 : 0;

        return (
            <>
                <div className={styles.section}>
                    <h3 className={styles.sectionTitle}>Current Progress</h3>
                    <div className={styles.progressCard}>
                        <div className={styles.progressBar}>
                            <div className={styles.progressFill} style={{ width: `${progress}%` }} />
                        </div>
                        <div className={styles.progressStats}>
                            <span>{completedCount}/{todos.length} Tasks</span>
                            <span className={styles.percentage}>{Math.round(progress)}%</span>
                        </div>
                    </div>
                </div>
                <div className={styles.section}>
                    <h3 className={styles.sectionTitle}>Status Legend</h3>
                    <div className={styles.guideGrid}>
                        <div className={styles.guideItem}><span className={styles.dotIdle}></span> To Do</div>
                        <div className={styles.guideItem}><span className={styles.dotRunning}></span> Active</div>
                        <div className={styles.guideItem}><span className={styles.dotPaused}></span> Paused</div>
                        <div className={styles.guideItem}><span className={styles.dotCompleted}></span> Done</div>
                    </div>
                </div>
            </>
        );
    };

    const renderScheduleWidgets = () => (
        <>
            <div className={styles.section}>
                <h3 className={styles.sectionTitle}>✅ Strategy Strengths</h3>
                <div className={styles.analysisList}>
                    {analysisData.strengths.map((item, idx) => (
                        <div key={idx} className={`${styles.analysisItem} ${styles.strength}`}>{item}</div>
                    ))}
                </div>
            </div>
            <div className={styles.section}>
                <h3 className={styles.sectionTitle}>⚠️ Performance Risks</h3>
                <div className={styles.analysisList}>
                    {analysisData.concerns.map((item, idx) => (
                        <div key={idx} className={`${styles.analysisItem} ${styles.concern}`}>{item}</div>
                    ))}
                </div>
            </div>
        </>
    );

    return (
        <aside className={styles.infoSidebar}>
            {/* Contextual Dynamic Widgets - Moved to Top */}
            <div className={styles.dynamicContainer}>
                {activeTab === 'analytics' && renderAnalyticsWidgets()}
                {activeTab === 'tasks' && renderTaskWidgets()}
                {activeTab === 'schedules' && renderScheduleWidgets()}

                {activeTab === 'profile' && (
                    <div className={styles.section}>
                        <h3 className={styles.sectionTitle}>👤 Profile Stats</h3>
                        <div className={styles.metricCard}>
                            <span className={styles.metricLabel}>Last Active</span>
                            <span className={styles.metricValue}>Just Now</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Default Global Info - Now Below Dynamic Content */}
            <div className={styles.divider}></div>
            {renderDefaultInfo()}

            <div className={styles.footer}>
                <div className={styles.systemStatus}>
                    <span className={styles.statusDot}></span>
                    <span>Synchronized</span>
                </div>
                <div className={styles.version}>v2.4.0</div>
            </div>
        </aside>
    );
}
