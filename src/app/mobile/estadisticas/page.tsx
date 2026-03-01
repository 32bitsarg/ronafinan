import styles from './page.module.css';
import { PieChart as PieChartIcon, TrendingDown, Target, HelpCircle, LineChart } from 'lucide-react';
import { getDashboardData } from '@/actions/transaction';
import { getForecastData } from '@/actions/forecasting';
import ForecastChart from '@/components/ForecastChart';

export const dynamic = 'force-dynamic';

export default async function EstadisticasPage() {
    const data = await getDashboardData();
    const { transactions } = data;

    // Obtener información de proyecciones
    const forecastData = await getForecastData();

    // Calcular gastos por categoría e ingresos/gastos totales (agrupación simple en memoria)
    const expensesByCategory: Record<string, number> = {};
    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach((t: any) => {
        if (t.type === 'EXPENSE') {
            expensesByCategory[t.category] = (expensesByCategory[t.category] || 0) + t.amount;
            totalExpense += t.amount;
        } else if (t.type === 'INCOME') {
            totalIncome += t.amount;
        }
    });

    const formatMoney = (val: number) =>
        new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0 }).format(val);

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Estadísticas</h1>
                <p className={styles.subtitle}>Análisis de este mes</p>
            </header>

            <main className={styles.mainContent}>
                {/* 1. Gráfico Circular (Simulado con UI para MVP) */}
                <section className={styles.card}>
                    <div className={styles.cardHeader}>
                        <h2 className={styles.cardTitle}>Resumen de Gastos</h2>
                        <PieChartIcon size={20} className={styles.iconSubtle} />
                    </div>

                    <div className={styles.fakeChartContainer}>
                        <div className={styles.totalPill}>
                            <span className={styles.pillLabel}>Total Gastado</span>
                            <span className={styles.pillValue}>{formatMoney(totalExpense)}</span>
                        </div>
                    </div>

                    <div className={styles.categoriesList}>
                        {Object.keys(expensesByCategory).length === 0 ? (
                            <p className={styles.emptyText}>No hay gastos registrados aún.</p>
                        ) : (
                            Object.entries(expensesByCategory)
                                .sort(([, a], [, b]) => b - a)
                                .map(([cat, amount], idx) => {
                                    const percentage = totalExpense > 0 ? (amount / totalExpense) * 100 : 0;
                                    // Colores cíclicos para las barras
                                    const colors = ['#0F172A', '#334155', '#475569', '#64748B'];
                                    const bgColor = colors[idx % colors.length];

                                    return (
                                        <div key={cat} className={styles.categoryItem}>
                                            <div className={styles.categoryHeader}>
                                                <span className={styles.categoryName}>
                                                    <span className={styles.dot} style={{ backgroundColor: bgColor }} />
                                                    {cat}
                                                </span>
                                                <span className={styles.categoryAmount}>{formatMoney(amount)}</span>
                                            </div>
                                            <div className={styles.progressBarBg}>
                                                <div
                                                    className={styles.progressBarFill}
                                                    style={{ width: `${percentage}%`, backgroundColor: bgColor }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })
                        )}
                    </div>
                </section>

                {/* 2. Patrones de Consumo / Insights */}
                <section className={styles.card}>
                    <div className={styles.cardHeader}>
                        <h2 className={styles.cardTitle}>Insights</h2>
                        <HelpCircle size={20} className={styles.iconSubtle} />
                    </div>

                    <div className={styles.insightsWrapper}>
                        <div className={styles.insightBox}>
                            <div className={styles.insightIconWrapper}>
                                <TrendingDown size={18} className={styles.textPrimary} />
                            </div>
                            <div>
                                <p className={styles.insightTitle}>Mayor Gasto</p>
                                <p className={styles.insightDesc}>
                                    {Object.keys(expensesByCategory).length > 0
                                        ? Object.keys(expensesByCategory).reduce((a, b) => expensesByCategory[a] > expensesByCategory[b] ? a : b)
                                        : 'N/A'
                                    }
                                </p>
                            </div>
                        </div>

                        <div className={styles.insightBox}>
                            <div className={styles.insightIconWrapper}>
                                <Target size={18} className={styles.textPrimary} />
                            </div>
                            <div>
                                <p className={styles.insightTitle}>Tasa de Ahorro</p>
                                <p className={styles.insightDesc}>
                                    {totalIncome > 0
                                        ? `${Math.max(0, Math.round(((totalIncome - totalExpense) / totalIncome) * 100))}%`
                                        : '0%'
                                    }
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 4. Proyección de Flujo de Caja (Forecasting) */}
                <section className={styles.card}>
                    <div className={styles.cardHeader}>
                        <h2 className={styles.cardTitle}>Flujo de Caja Proyectado</h2>
                        <LineChart size={20} className={styles.iconSubtle} />
                    </div>

                    <p className={styles.emptyText} style={{ textAlign: 'left', fontSize: '0.8rem', paddingBottom: 0 }}>
                        Estimación a 6 meses combinando tus presupuestos estrictos y suscripciones activas.
                    </p>

                    <ForecastChart data={forecastData} />
                </section>
            </main>
        </div>
    );
}
