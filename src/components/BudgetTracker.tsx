'use client';

import React from 'react';
import { useCurrency } from '@/lib/CurrencyContext';
import styles from './BudgetTracker.module.css';
import FormattedAmount from './FormattedAmount';
import { Target } from 'lucide-react';

interface BudgetTrackerProps {
    currentExpenseArs: number;
    monthlyBudgetArs: number;
}

export default function BudgetTracker({ currentExpenseArs, monthlyBudgetArs }: BudgetTrackerProps) {
    const percentage = Math.min(100, (currentExpenseArs / monthlyBudgetArs) * 100);
    const isOverBudget = percentage >= 100;
    const isWarning = percentage >= 80;

    const remaining = Math.max(0, monthlyBudgetArs - currentExpenseArs);

    const now = new Date();
    const currentDay = now.getDate();
    const totalDays = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const timePercentage = (currentDay / totalDays) * 100;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.budgetMain}>
                    <p className={styles.label}>Presupuesto Usado</p>
                    <h3 className={isOverBudget ? styles.valueCritical : styles.value}>
                        {Math.round(percentage)}%
                    </h3>
                </div>
                <div className={styles.targetIcon}>
                    <Target size={20} />
                </div>
            </div>

            <div className={styles.progressSection}>
                <div className={styles.barContainer}>
                    {/* Time marker (Where we should be) */}
                    <div
                        className={styles.timeMarker}
                        style={{ left: `${timePercentage}%` }}
                        title="Día actual del mes"
                    />
                    <div
                        className={`${styles.barFill} ${isOverBudget ? styles.bgCritical : (isWarning ? styles.bgWarning : '')}`}
                        style={{ width: `${percentage}%` }}
                    />
                </div>
                <div className={styles.barLabels}>
                    <span>$0</span>
                    <span><FormattedAmount amount={monthlyBudgetArs} originalCurrency="ARS" /></span>
                </div>
            </div>

            <div className={styles.footer}>
                <div className={styles.footerItem}>
                    <span className={styles.footerLabel}>Restante</span>
                    <span className={styles.footerValue}>
                        <FormattedAmount amount={remaining} originalCurrency="ARS" />
                    </span>
                </div>
                <div className={styles.footerDivider} />
                <div className={styles.footerItem}>
                    <span className={styles.footerLabel}>Gasto Diario Prom.</span>
                    <span className={styles.footerValue}>
                        <FormattedAmount amount={currentExpenseArs / currentDay} originalCurrency="ARS" />
                    </span>
                </div>
            </div>
        </div>
    );
}
