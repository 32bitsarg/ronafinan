import { getSession, getAvailableWorkspaces } from "@/actions/auth";
import { getDashboardData } from "@/actions/transaction";
import { getForecastData, getHybridRunway } from "@/actions/forecasting";
import WorkspaceSwitcher from "@/components/WorkspaceSwitcher";
import RunwayDashboard from "./RunwayDashboard";
import { SimulationProvider } from "@/lib/SimulationContext";
import {
    Wallet,
    Building,
    CreditCard,
    ArrowUpRight,
    HandCoins,
    PieChart,
    Target,
    LineChart,
    PiggyBank,
    Banknote,
    SmartphoneNfc,
    Plus,
    Calendar,
    CheckCircle2,
    AlertCircle
} from "lucide-react";
import { processDueRecurringTransactions } from "@/actions/engine";
import DesktopTransactionList from "@/components/DesktopTransactionList";
import ForecastChart from "@/components/ForecastChart";
import { formatMoney } from '@/lib/formatters';
import styles from './page.module.css';
import Link from 'next/link';
import QuickWalletEdit from "./QuickWalletEdit";
import { CurrencyProvider } from "@/lib/CurrencyContext";
import CurrencySwitcher from "@/components/CurrencySwitcher";
import FormattedAmount from "@/components/FormattedAmount";
import DistributionChart from "@/components/DistributionChart";
import BudgetTracker from "@/components/BudgetTracker";
import InsightsPanel from "@/components/InsightsPanel";
import { getSmartInsights } from "@/lib/finances";
import { getMonthlyBudgetTotal } from "@/actions/budget";

export const dynamic = 'force-dynamic';

export default async function DesktopHome() {
    await processDueRecurringTransactions();
    const session = await getSession();
    const workspaces = await getAvailableWorkspaces();
    const data = await getDashboardData();
    const {
        accounts,
        totalBalanceArs,
        totalBalanceUsd,
        totalInvestmentsArs,
        totalInvestmentsUsd,
        netWorthArs,
        transactions,
        initialBalanceArs,
        investments: rawInvestments,
        investmentDetails,
        recurring,
        totalIncomeArs,
        totalExpenseArs,
        savingsRate,
        expensesByCategory,
        EXCHANGE_RATE,
        assetAllocation
    } = data;
    const forecastData = await getForecastData();
    const runwayData = await getHybridRunway();

    // Budget: Traer presupuesto real de la DB (suma de todos los Budget del mes)
    const budgetData = await getMonthlyBudgetTotal();

    // Smart Insights (usa presupuesto real solo si está configurado)
    const premiumInsights = getSmartInsights({
        totalExpenseArs,
        totalIncomeArs,
        expensesByCategory,
        budgetArs: budgetData.total
    });

    // ─── Helper: account icon/color by type ───
    const getAccountStyles = (type: string) => {
        switch (type) {
            case 'SAVINGS':
                return { icon: <PiggyBank size={18} />, bgColor: 'hsl(125, 40%, 96%)', iconColor: '#10b981' };
            case 'CASH':
                return { icon: <Banknote size={18} />, bgColor: 'hsl(45, 40%, 96%)', iconColor: '#f59e0b' };
            case 'E-WALLET':
                return { icon: <SmartphoneNfc size={18} />, bgColor: 'hsl(199, 40%, 96%)', iconColor: '#0ea5e9' };
            case 'BANK':
                return { icon: <Building size={18} />, bgColor: 'hsl(220, 30%, 97%)', iconColor: '#3b82f6' };
            case 'CREDIT_CARD':
                return { icon: <CreditCard size={18} />, bgColor: 'hsl(262, 30%, 97%)', iconColor: '#8b5cf6' };
            case 'DEBT':
                return { icon: <HandCoins size={18} />, bgColor: 'hsl(0, 30%, 97%)', iconColor: '#ef4444' };
            default:
                return { icon: <Wallet size={18} />, bgColor: '#f5f5f5', iconColor: '#0a0a0a' };
        }
    };

    // ─── Helper: runway status ───
    const getRunwayStatus = () => {
        if (runwayData.daysLeft === -1) return { label: 'Saludable', color: '#22c55e', icon: <CheckCircle2 size={14} /> };
        if (runwayData.status === 'CRITICAL') return { label: 'Crítico', color: '#ef4444', icon: <AlertCircle size={14} /> };
        if (runwayData.status === 'WARNING') return { label: 'Atención', color: '#f59e0b', icon: <AlertCircle size={14} /> };
        return { label: 'Saludable', color: '#22c55e', icon: <CheckCircle2 size={14} /> };
    };
    const runwayStatus = getRunwayStatus();

    return (
        <section className={styles.container}>
            <CurrencyProvider initialExchangeRate={EXCHANGE_RATE}>
                {/* ═══════ HEADER ═══════ */}
                <header className={styles.header}>
                    <div className={styles.titleGroup}>
                        <h1>Dashboard</h1>
                        <p>Resumen consolidado de patrimonio y actividad.</p>
                    </div>

                    <div className={styles.headerActions}>
                        <CurrencySwitcher />
                        <Link href="/desktop/nuevo" className={styles.primaryAction}>
                            <Plus size={16} />
                            <span>Nuevo</span>
                        </Link>
                        <div className={styles.switcherWrapper}>
                            <WorkspaceSwitcher
                                workspaces={workspaces.map(w => ({ id: w.id, name: w.name.replace(/^Personal de .*$/, 'Personal') }))}
                                activeId={session.activeWorkspaceId!}
                            />
                        </div>
                    </div>
                </header>

                <SimulationProvider>
                    <div className={styles.dashboardGrid}>

                        {/* ═══════ 1. HERO — Patrimonio Neto (Full Width, Dark) ═══════ */}
                        <div className={`${styles.card} ${styles.heroCard}`}>
                            <div className={styles.heroHeader}>
                                <p className={styles.heroLabel}>Patrimonio Neto</p>
                                <Target size={18} style={{ opacity: 0.3 }} />
                            </div>
                            <h2 className={styles.heroAmount}>
                                <FormattedAmount amount={netWorthArs} originalCurrency="ARS" />
                            </h2>
                            <div className={styles.heroFooter}>
                                <span className={styles.heroTrend}>
                                    <ArrowUpRight size={14} />
                                    Líquido: <FormattedAmount amount={totalBalanceArs + (totalBalanceUsd * EXCHANGE_RATE)} originalCurrency="ARS" />
                                </span>
                                <span className={styles.heroTrend}>
                                    <PieChart size={14} />
                                    Invertido: <FormattedAmount amount={totalInvestmentsArs + (totalInvestmentsUsd * EXCHANGE_RATE)} originalCurrency="ARS" />
                                </span>
                            </div>
                        </div>

                        {/* ═══════ 2. STATS ROW — 4 KPI Cards ═══════ */}
                        <div className={styles.statsRow}>
                            {/* Ingresos */}
                            <div className={styles.statCard}>
                                <span className={styles.statLabel}>Ingresos Brutos</span>
                                <span className={styles.statValue}>
                                    <FormattedAmount amount={totalIncomeArs} originalCurrency="ARS" />
                                </span>
                                <span className={styles.statMeta}>
                                    <span className={styles.statIndicator} style={{ backgroundColor: '#22c55e' }} />
                                    este mes
                                </span>
                            </div>

                            {/* Gastos */}
                            <div className={styles.statCard}>
                                <span className={styles.statLabel}>Gastos Brutos</span>
                                <span className={styles.statValue}>
                                    <FormattedAmount amount={totalExpenseArs} originalCurrency="ARS" />
                                </span>
                                <span className={styles.statMeta}>
                                    <span className={styles.statIndicator} style={{ backgroundColor: '#ef4444' }} />
                                    este mes
                                </span>
                            </div>

                            {/* Inversiones */}
                            <div className={styles.statCard}>
                                <span className={styles.statLabel}>Inversiones</span>
                                <span className={styles.statValue}>
                                    <FormattedAmount amount={totalInvestmentsArs + (totalInvestmentsUsd * EXCHANGE_RATE)} originalCurrency="ARS" />
                                </span>
                                <span className={styles.statMeta}>
                                    <span className={styles.statIndicator} style={{ backgroundColor: '#3b82f6' }} />
                                    activos
                                </span>
                            </div>

                            {/* Runway — Compact */}
                            <div className={styles.statCard}>
                                <span className={styles.statLabel}>Runway</span>
                                <span className={styles.statValue}>
                                    {runwayData.daysLeft === -1 ? '∞' : runwayData.daysLeft}
                                    <span style={{ fontSize: '0.8rem', fontWeight: 500, color: '#737373', marginLeft: '0.35rem' }}>
                                        días
                                    </span>
                                </span>
                                <span className={styles.statMeta}>
                                    <span className={styles.statIndicator} style={{ backgroundColor: runwayStatus.color }} />
                                    {runwayStatus.label} • {formatMoney(runwayData.burnRate)}/día
                                </span>
                            </div>
                        </div>

                        {/* ═══════ 2.5. RUNWAY SIMULATOR — Compact full-width ═══════ */}
                        <div className={styles.card}>
                            <RunwayDashboard data={runwayData} />
                        </div>

                        {/* ═══════ 3. CONTENT ROW — Chart + Wallets ═══════ */}
                        <div className={styles.contentRow}>
                            {/* Chart */}
                            <div className={styles.card}>
                                <div className={styles.cardTitle}>
                                    <span>Flujo Mensual</span>
                                    <LineChart size={16} style={{ opacity: 0.3 }} />
                                </div>
                                <ForecastChart data={forecastData} />
                            </div>

                            {/* Wallets */}
                            <div className={styles.card}>
                                <div className={styles.cardTitle}>
                                    <span>Billeteras</span>
                                    <Link href="/desktop/ajustes/cuentas" style={{ fontSize: '0.7rem', color: '#a3a3a3', textDecoration: 'none', fontWeight: 500 }}>
                                        Gestionar →
                                    </Link>
                                </div>
                                <div className={styles.walletList}>
                                    {accounts.slice(0, 6).map(acc => {
                                        const stylesObj = getAccountStyles(acc.type);
                                        return (
                                            <div key={acc.id} className={styles.walletItem}>
                                                <div className={styles.walletIconBox} style={{ color: stylesObj.iconColor, backgroundColor: stylesObj.bgColor }}>
                                                    {stylesObj.icon}
                                                </div>
                                                <div className={styles.walletInfo}>
                                                    <p className={styles.walletNameText}>{acc.name}</p>
                                                    <p className={styles.walletBalanceText}>
                                                        <FormattedAmount amount={acc.balance} originalCurrency={acc.currency} />
                                                    </p>
                                                </div>
                                                <QuickWalletEdit account={acc} />
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* ═══════ 4. ANALYSIS ROW — Distribution + Budget + Agenda ═══════ */}
                        <div className={styles.analysisRow}>
                            {/* Distribution */}
                            <div className={styles.card}>
                                <div className={styles.cardTitle}>Distribución de Activos</div>
                                <DistributionChart
                                    liquidArs={totalBalanceArs + (totalBalanceUsd * EXCHANGE_RATE)}
                                    investedArs={totalInvestmentsArs + (totalInvestmentsUsd * EXCHANGE_RATE)}
                                />
                            </div>

                            {/* Budget */}
                            <div className={styles.card}>
                                <div className={styles.cardTitle}>Control de Presupuesto</div>
                                {budgetData.isConfigured ? (
                                    <BudgetTracker
                                        currentExpenseArs={totalExpenseArs}
                                        monthlyBudgetArs={budgetData.total}
                                    />
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, gap: '0.75rem', padding: '1.5rem 0' }}>
                                        <Target size={32} style={{ opacity: 0.15 }} />
                                        <p style={{ margin: 0, fontSize: '0.85rem', color: '#a3a3a3', textAlign: 'center' }}>
                                            No tenés presupuestos definidos para este mes.
                                        </p>
                                        <Link
                                            href="/desktop/presupuesto"
                                            style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0a0a0a', textDecoration: 'underline', textUnderlineOffset: '3px' }}
                                        >
                                            Crear presupuesto →
                                        </Link>
                                    </div>
                                )}
                            </div>

                            {/* Agenda */}
                            <div className={styles.card}>
                                <div className={styles.cardTitle}>
                                    Próximas en Agenda
                                    <Calendar size={16} style={{ opacity: 0.3 }} />
                                </div>
                                <div className={styles.activityList}>
                                    {recurring
                                        .filter(r => (r.dayOfMonth || 0) >= new Date().getDate())
                                        .sort((a, b) => (a.dayOfMonth || 0) - (b.dayOfMonth || 0))
                                        .slice(0, 4)
                                        .map(r => (
                                            <div key={r.id} className={styles.activityItem}>
                                                <div className={styles.activityDot} style={{ backgroundColor: r.type === 'INCOME' ? '#22c55e' : '#0a0a0a' }} />
                                                <div style={{ flex: 1 }}>
                                                    <p style={{ margin: 0, fontWeight: 600, fontSize: '0.85rem', color: '#0a0a0a' }}>{r.name}</p>
                                                    <p style={{ margin: 0, fontSize: '0.78rem', color: '#a3a3a3' }}>
                                                        Día {r.dayOfMonth} • <FormattedAmount amount={r.amount} originalCurrency={r.currency} />
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                                {recurring.length === 0 && <p className={styles.emptyText}>No hay nada pendiente.</p>}
                            </div>

                            {/* Smart Insights */}
                            <div className={styles.card}>
                                <div className={styles.cardTitle}>Smart Insights</div>
                                <InsightsPanel insights={premiumInsights as any} />
                            </div>
                        </div>
                    </div>

                    {/* ═══════ 5. TRANSACTIONS — Full Width Footer ═══════ */}
                    <div className={styles.transactionsCard}>
                        <div className={styles.transactionsHeader}>
                            Movimientos Recientes
                        </div>
                        <div className={styles.transactionsBody}>
                            <DesktopTransactionList transactions={transactions} />
                        </div>
                    </div>
                </SimulationProvider>
            </CurrencyProvider>
        </section>
    );
}
