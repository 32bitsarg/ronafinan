'use client';

import React, { useMemo } from 'react';
import { useCurrency } from '@/lib/CurrencyContext';
import styles from './DistributionChart.module.css';
import FormattedAmount from './FormattedAmount';

interface DistributionChartProps {
    liquidArs: number;
    investedArs: number;
}

export default function DistributionChart({ liquidArs, investedArs }: DistributionChartProps) {
    const { currency } = useCurrency();
    const total = liquidArs + investedArs;

    // Calcular porcentajes para la visualización
    const liquidP = total > 0 ? (liquidArs / total) * 100 : 0;
    const investedP = total > 0 ? (investedArs / total) * 100 : 0;

    const data = useMemo(() => [
        { label: 'Líquido', value: liquidArs, percent: liquidP, color: '#3b82f6' },
        { label: 'Invertido', value: investedArs, percent: investedP, color: '#10b981' }
    ], [liquidArs, investedArs, liquidP, investedP]);

    const radius = 60;
    const strokeWidth = 14;
    const normalizedRadius = radius - strokeWidth / 2;
    const circumference = normalizedRadius * 2 * Math.PI;

    return (
        <div className={styles.container}>
            <div className={styles.chartWrapper}>
                <svg height={radius * 2} width={radius * 2} style={{ transform: 'rotate(-90deg)' }}>
                    <circle
                        stroke="rgba(0,0,0,0.03)"
                        fill="transparent"
                        strokeWidth={strokeWidth}
                        r={normalizedRadius}
                        cx={radius}
                        cy={radius}
                    />
                    {/* Liquid Segment */}
                    <circle
                        stroke="#3b82f6"
                        fill="transparent"
                        strokeDasharray={`${(liquidP / 100) * circumference} ${circumference}`}
                        style={{ strokeDashoffset: 0, transition: 'stroke-dasharray 0.5s ease' }}
                        strokeWidth={strokeWidth}
                        strokeLinecap="round"
                        r={normalizedRadius}
                        cx={radius}
                        cy={radius}
                    />
                    {/* Invested Segment */}
                    {investedP > 0 && (
                        <circle
                            stroke="#10b981"
                            fill="transparent"
                            strokeDasharray={`${(investedP / 100) * circumference} ${circumference}`}
                            style={{
                                strokeDashoffset: -((liquidP / 100) * circumference),
                                transition: 'stroke-dasharray 0.5s ease'
                            }}
                            strokeWidth={strokeWidth}
                            strokeLinecap="round"
                            r={normalizedRadius}
                            cx={radius}
                            cy={radius}
                        />
                    )}
                </svg>
                <div className={styles.centerText}>
                    <span className={styles.totalLabel}>TOTAL</span>
                    <span className={styles.totalValue}>
                        <FormattedAmount amount={total} originalCurrency="ARS" />
                    </span>
                </div>
            </div>

            <div className={styles.legend}>
                {data.map((item, index) => (
                    <div key={index} className={styles.legendItem}>
                        <div className={styles.dot} style={{ backgroundColor: item.color }} />
                        <div className={styles.legendInfo}>
                            <span className={styles.legendLabel}>{item.label}</span>
                            <span className={styles.legendPercent}>{Math.round(item.percent)}%</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
