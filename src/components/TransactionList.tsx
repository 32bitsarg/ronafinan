import { getDashboardData } from '@/actions/transaction';
import styles from './TransactionList.module.css';
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownLeft, LineChart } from 'lucide-react';
import TransactionItemActions from './TransactionItemActions';
import Link from 'next/link';

export default async function TransactionList() {
    const data = await getDashboardData();
    const { transactions, totalBalanceArs, totalBalanceUsd } = data;

    // Calculamos gastos e ingresos separados por moneda
    let totalIncomeArs = 0;
    let totalExpenseArs = 0;
    let totalIncomeUsd = 0;
    let totalExpenseUsd = 0;

    transactions.forEach((t: any) => {
        if (t.type === 'INCOME') {
            if (t.currency === 'USD') totalIncomeUsd += t.amount;
            else totalIncomeArs += t.amount;
        }
        if (t.type === 'EXPENSE') {
            if (t.currency === 'USD') totalExpenseUsd += t.amount;
            else totalExpenseArs += t.amount;
        }
    });

    const formatMoney = (val: number, currency: string = 'ARS') => {
        if (currency === 'USD') {
            return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(val);
        }
        return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0 }).format(val);
    };

    return (
        <div className={styles.container}>
            {/* 1. Main Balance Hero Card */}
            <div className={styles.balanceHero}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)', marginBottom: '1.5rem' }}>
                    <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Patrimonio Neto</p>
                    <h1 style={{ margin: 0, textAlign: 'center', fontSize: '2.5rem', fontWeight: '800', color: 'white' }}>
                        {formatMoney(totalBalanceArs)}
                    </h1>
                    {totalBalanceUsd > 0 && (
                        <h2 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-secondary)', fontWeight: '500', textAlign: 'center' }}>
                            {formatMoney(totalBalanceUsd, 'USD')}
                        </h2>
                    )}
                </div>

                <p className={styles.balanceLabel}>Resumen de Flujo Mensual (ARS)</p>
                <div className={styles.heroStatsContainer}>
                    <div className={styles.heroStat}>
                        <div className={`${styles.iconWrap} ${styles.iconWrapGreen}`}>
                            <ArrowUpRight size={18} />
                        </div>
                        <div>
                            <p className={styles.heroStatLabel}>Ingresos ($)</p>
                            <p className={styles.heroStatValueGreen}>{formatMoney(totalIncomeArs)}</p>
                        </div>
                    </div>
                    <div className={styles.divider}></div>
                    <div className={styles.heroStat}>
                        <div className={`${styles.iconWrap} ${styles.iconWrapRed}`}>
                            <ArrowDownLeft size={18} />
                        </div>
                        <div>
                            <p className={styles.heroStatLabel}>Gastos ($)</p>
                            <p className={styles.heroStatValueRed}>{formatMoney(totalExpenseArs)}</p>
                        </div>
                    </div>
                </div>

                {(totalIncomeUsd > 0 || totalExpenseUsd > 0) && (
                    <>
                        <p className={styles.balanceLabel} style={{ marginTop: '1rem' }}>Resumen de Flujo Mensual (USD)</p>
                        <div className={styles.heroStatsContainer}>
                            <div className={styles.heroStat}>
                                <div className={`${styles.iconWrap} ${styles.iconWrapGreen}`}>
                                    <ArrowUpRight size={18} />
                                </div>
                                <div>
                                    <p className={styles.heroStatLabel}>Ingresos (U$D)</p>
                                    <p className={styles.heroStatValueGreen}>{formatMoney(totalIncomeUsd, 'USD')}</p>
                                </div>
                            </div>
                            <div className={styles.divider}></div>
                            <div className={styles.heroStat}>
                                <div className={`${styles.iconWrap} ${styles.iconWrapRed}`}>
                                    <ArrowDownLeft size={18} />
                                </div>
                                <div>
                                    <p className={styles.heroStatLabel}>Gastos (U$D)</p>
                                    <p className={styles.heroStatValueRed}>{formatMoney(totalExpenseUsd, 'USD')}</p>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Acceso a Inversiones */}
            <Link href="/mobile/inversiones" style={{ display: 'flex', backgroundColor: 'var(--bg-surface)', padding: '1rem', borderRadius: '12px', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: 'var(--accent-primary)', textDecoration: 'none', fontSize: '1rem', marginBottom: '2rem', fontWeight: 'bold', border: '1px solid var(--border-subtle)' }}>
                <LineChart size={20} /> Ver mi Portafolio
            </Link>

            {/* 2. Recent Transactions */}
            <div className={styles.transactionsSection}>
                <div className={styles.transactionsHeader}>
                    <h3 className={styles.title}>Movimientos Recientes</h3>
                    <span className={styles.viewAll}>Ver todo</span>
                </div>

                {transactions.length === 0 ? (
                    <div className={styles.emptyState}>
                        <div className={styles.emptyIcon}>💸</div>
                        <p>Aún no hay movimientos.</p>
                        <span>Empieza a registrar tus gastos.</span>
                    </div>
                ) : (
                    <ul className={styles.list}>
                        {transactions.map((t: any) => {
                            const dateObj = new Date(t.date);
                            const isIncome = t.type === 'INCOME';

                            return (
                                <li key={t.id} className={styles.listItem}>
                                    <div className={styles.itemLeft}>
                                        <div className={`${styles.itemIcon} ${isIncome ? styles.bgGreenLight : styles.bgRedLight}`}>
                                            {isIncome ? <TrendingUp size={20} className={styles.textGreen} /> : <TrendingDown size={20} className={styles.textRed} />}
                                        </div>
                                        <div className={styles.itemInfo}>
                                            <p className={styles.itemCategory}>{t.category}</p>
                                            <p className={styles.itemDate}>
                                                {t.description ? `${t.description} • ` : ''}
                                                {dateObj.toLocaleDateString('es-AR', { day: '2-digit', month: 'short' })}
                                            </p>
                                        </div>
                                    </div>

                                    <div className={styles.itemRight} style={{ display: 'flex', alignItems: 'center' }}>
                                        <p className={`${styles.itemAmount} ${isIncome ? styles.textGreen : styles.textPrimary}`}>
                                            {isIncome ? '+' : '-'}{formatMoney(t.amount, t.currency)}
                                        </p>
                                        <TransactionItemActions transactionId={t.id} />
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>
        </div>
    );
}
