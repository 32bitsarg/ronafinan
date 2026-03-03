'use client';

import { useState, useMemo } from 'react';
import {
    Zap,
    Calendar,
    TrendingDown,
    AlertCircle,
    CheckCircle2,
    ArrowRight,
    MousePointer2
} from 'lucide-react';
import styles from './RunwayDashboard.module.css';
import { formatMoney } from '@/lib/formatters';
import { useSimulation } from '@/lib/SimulationContext';

interface RunwayData {
    currentNetWorth: number;
    daysLeft: number;
    status: 'STABLE' | 'WARNING' | 'CRITICAL';
    stabilityScore: number;
    burnRate: number;
    projectedEndBalance: number;
    confidence: number;
}

export default function RunwayDashboard({ data }: { data: RunwayData }) {
    const { savingPercent, setSavingPercent } = useSimulation();

    // Simulador logic: Reducir el burnrate por el porcentaje de ahorro
    const simulatedDaysLeft = useMemo(() => {
        if (data.burnRate <= 0) return -1;
        const simulatedBurnRate = data.burnRate * (1 - savingPercent / 100);
        if (simulatedBurnRate <= 0) return -1;

        // Asumiendo que el ahorro afecta el variable spending
        const days = Math.floor(data.currentNetWorth / simulatedBurnRate);
        return days;
    }, [data.currentNetWorth, data.burnRate, savingPercent]);

    const getStatusInfo = (status: string, days: number) => {
        if (days === -1) return {
            label: 'Pista Infinita',
            color: '#10b981',
            icon: <CheckCircle2 size={20} />,
            desc: 'Tu balance proyectado es positivo para este mes.'
        };

        switch (status) {
            case 'CRITICAL':
                return {
                    label: 'Crítico',
                    color: '#ef4444',
                    icon: <AlertCircle size={20} />,
                    desc: `Te quedan aprox. ${days} días de saldo.`
                };
            case 'WARNING':
                return {
                    label: 'Atención',
                    color: '#f59e0b',
                    icon: <AlertCircle size={20} />,
                    desc: `Pista reducida: ${days} días restantes.`
                };
            default:
                return {
                    label: 'Saludable',
                    color: '#10b981',
                    icon: <CheckCircle2 size={20} />,
                    desc: 'Tu ritmo de gasto es sostenible.'
                };
        }
    };

    const statusInfo = getStatusInfo(data.status, data.daysLeft);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.titleGroup}>
                    <p className={styles.label}>Nuestra Predicción</p>
                    <h3 className={styles.title}>Caja Vacía (Runway)</h3>
                </div>
                <div className={styles.badge} style={{ backgroundColor: statusInfo.color + '15', color: statusInfo.color }}>
                    {statusInfo.icon}
                    <span>{statusInfo.label}</span>
                </div>
            </div>

            <div className={styles.mainScore}>
                <div className={styles.runwayCircle}>
                    <div className={styles.runwayValue}>
                        {data.daysLeft === -1 ? '∞' : data.daysLeft}
                    </div>
                    <div className={styles.runwayUnit}>días</div>
                </div>

                <div className={styles.statsGrid}>
                    <div className={styles.statItem}>
                        <span className={styles.statLabel}>Velocidad de Gasto</span>
                        <span className={styles.statValue}>{formatMoney(data.burnRate)}/día</span>
                    </div>
                    <div className={styles.statItem}>
                        <span className={styles.statLabel}>Stability Score</span>
                        <span className={styles.statValue}>{data.stabilityScore}%</span>
                    </div>
                </div>
            </div>

            <div className={styles.simulatorSection}>
                <div className={styles.simulatorHeader}>
                    <div className={styles.simTitle}>
                        <Zap size={14} fill="currentColor" />
                        <span>Simulador de Ahorro</span>
                    </div>
                    <div className={styles.simValue}>
                        {savingPercent}% extra
                    </div>
                </div>

                <input
                    type="range"
                    min="0"
                    max="50"
                    step="5"
                    value={savingPercent}
                    onChange={(e) => setSavingPercent(parseInt(e.target.value))}
                    className={styles.rangeInput}
                />

                <div className={styles.simResult}>
                    {savingPercent > 0 ? (
                        <>
                            <span className={styles.simOldValue}>{data.daysLeft === -1 ? '∞' : data.daysLeft}</span>
                            <ArrowRight size={14} className={styles.simArrow} />
                            <span className={styles.simNewValue} style={{ color: '#10b981' }}>
                                {simulatedDaysLeft === -1 ? '∞' : simulatedDaysLeft} días
                            </span>
                        </>
                    ) : (
                        <span className={styles.simHint}>Mueve el slider para ver el impacto</span>
                    )}
                </div>
            </div>

            <div className={styles.footerNote}>
                <Calendar size={12} opacity={0.5} />
                <span>Confianza del modelo: {data.confidence}%</span>
            </div>
        </div>
    );
}
