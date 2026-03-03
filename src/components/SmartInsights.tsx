'use client';

import React from 'react';
import styles from './SmartInsights.module.css';
import { Lightbulb, AlertTriangle, TrendingUp, Wallet } from 'lucide-react';

interface Insight {
    type: 'TIP' | 'WARNING' | 'POSITIVE' | 'NEUTRAL';
    title: string;
    text: string;
}

interface SmartInsightsProps {
    insights: Insight[];
}

export default function SmartInsights({ insights }: SmartInsightsProps) {
    const getIcon = (type: string) => {
        switch (type) {
            case 'TIP': return <Lightbulb size={18} className={styles.iconTip} />;
            case 'WARNING': return <AlertTriangle size={18} className={styles.iconWarning} />;
            case 'POSITIVE': return <TrendingUp size={18} className={styles.iconPositive} />;
            default: return <Wallet size={18} className={styles.iconNeutral} />;
        }
    };

    if (!insights || insights.length === 0) {
        return (
            <div className={styles.empty}>
                <p>No hay insights nuevos hoy. ¡Buen trabajo manteniendo el control!</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            {insights.map((insight, index) => (
                <div key={index} className={styles.insightCard}>
                    <div className={styles.header}>
                        {getIcon(insight.type)}
                        <span className={styles.title}>{insight.title}</span>
                    </div>
                    <p className={styles.text}>{insight.text}</p>
                </div>
            ))}
        </div>
    );
}
