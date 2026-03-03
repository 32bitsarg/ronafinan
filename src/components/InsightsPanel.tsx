import React from 'react';
import { AlertCircle, CheckCircle, Info, Sparkles } from 'lucide-react';
import styles from './InsightsPanel.module.css';

interface Insight {
    type: 'WARNING' | 'SUCCESS' | 'INFO';
    message: string;
    category: string;
}

interface InsightsPanelProps {
    insights: Insight[];
}

export default function InsightsPanel({ insights }: InsightsPanelProps) {
    const getIcon = (type: string) => {
        switch (type) {
            case 'WARNING': return <AlertCircle size={16} color="#ef4444" />;
            case 'SUCCESS': return <CheckCircle size={16} color="#10b981" />;
            default: return <Info size={16} color="#3b82f6" />;
        }
    };

    const getColors = (type: string) => {
        switch (type) {
            case 'WARNING': return { bg: 'rgba(239, 68, 68, 0.05)', border: 'rgba(239, 68, 68, 0.1)' };
            case 'SUCCESS': return { bg: 'rgba(16, 185, 129, 0.05)', border: 'rgba(16, 185, 129, 0.1)' };
            default: return { bg: 'rgba(59, 130, 246, 0.05)', border: 'rgba(59, 130, 246, 0.1)' };
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Sparkles size={16} style={{ color: '#8b5cf6' }} />
                <span className={styles.headerTitle}>OPTIMIZADOR FINANCIERO</span>
            </div>

            {insights.map((insight, idx) => {
                const colors = getColors(insight.type);
                return (
                    <div
                        key={idx}
                        className={styles.insightCard}
                        style={{ backgroundColor: colors.bg, borderColor: colors.border }}
                    >
                        <div className={styles.iconWrapper}>{getIcon(insight.type)}</div>
                        <div className={styles.content}>
                            <p className={styles.category}>{insight.category}</p>
                            <p className={styles.message}>{insight.message}</p>
                        </div>
                    </div>
                );
            })}

            {insights.length === 0 && (
                <div className={styles.emptyState}>
                    <p>No hay nuevos análisis disponibles.</p>
                </div>
            )}
        </div>
    );
}
