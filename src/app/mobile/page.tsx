import styles from "./page.module.css";
import {
  Wallet, Building, CreditCard, HandCoins, PiggyBank,
  Banknote, SmartphoneNfc, ArrowUpRight, PieChart,
  Calendar, Target, CheckCircle2, AlertCircle
} from "lucide-react";
import { processDueRecurringTransactions } from "@/actions/engine";
import { getDashboardData } from "@/actions/transaction";
import { getForecastData, getHybridRunway } from "@/actions/forecasting";
import { getAvailableWorkspaces, getSession } from "@/actions/auth";
import { getMonthlyBudgetTotal } from "@/actions/budget";
import { getSmartInsights } from "@/lib/finances";
import { formatMoney } from '@/lib/formatters';
import WorkspaceSwitcher from "@/components/WorkspaceSwitcher";
import ForecastChart from "@/components/ForecastChart";
import DistributionChart from "@/components/DistributionChart";
import BudgetTracker from "@/components/BudgetTracker";
import TransactionItem from "@/components/TransactionItem";
import FormattedAmount from "@/components/FormattedAmount";
import CurrencySwitcher from "@/components/CurrencySwitcher";
import { CurrencyProvider } from "@/lib/CurrencyContext";
import { SimulationProvider } from "@/lib/SimulationContext";
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function MobileHome() {
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
    recurring,
    totalIncomeArs,
    totalExpenseArs,
    expensesByCategory,
    EXCHANGE_RATE,
  } = data;
  const forecastData = await getForecastData();
  const runwayData = await getHybridRunway();
  const budgetData = await getMonthlyBudgetTotal();

  const premiumInsights = getSmartInsights({
    totalExpenseArs,
    totalIncomeArs,
    expensesByCategory,
    budgetArs: budgetData.total
  });

  // ─── Helper: Icons por tipo de cuenta ───
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

  // ─── Helper: Runway status ───
  const getRunwayStatus = () => {
    if (runwayData.daysLeft === -1) return { label: 'Saludable', color: '#22c55e' };
    if (runwayData.status === 'CRITICAL') return { label: 'Crítico', color: '#ef4444' };
    if (runwayData.status === 'WARNING') return { label: 'Atención', color: '#f59e0b' };
    return { label: 'Saludable', color: '#22c55e' };
  };
  const runwayStatus = getRunwayStatus();

  // Insight icons
  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'WARNING': return <AlertCircle size={14} color="#ef4444" />;
      case 'SUCCESS': return <CheckCircle2 size={14} color="#22c55e" />;
      default: return <Target size={14} color="#3b82f6" />;
    }
  };

  const getInsightBg = (type: string) => {
    switch (type) {
      case 'WARNING': return 'rgba(239, 68, 68, 0.04)';
      case 'SUCCESS': return 'rgba(34, 197, 94, 0.04)';
      default: return 'rgba(59, 130, 246, 0.04)';
    }
  };

  return (
    <div className={styles.appContainer}>
      <CurrencyProvider initialExchangeRate={EXCHANGE_RATE}>
        {/* ═══════ HEADER ═══════ */}
        <header className={styles.appHeader}>
          <div className={styles.headerLeft}>
            <div style={{ display: 'inline-flex', backgroundColor: '#0a0a0a', color: '#fff', padding: '5px', borderRadius: '50%' }}>
              <Wallet size={16} />
            </div>
            <span className={styles.headerBrand}>RoNa</span>
          </div>

          <div className={styles.headerActions}>
            <CurrencySwitcher />
            <WorkspaceSwitcher
              workspaces={workspaces.map(w => ({ id: w.id, name: w.name.replace(/^Personal de .*$/, 'Personal') }))}
              activeId={session.activeWorkspaceId!}
            />
          </div>
        </header>

        <SimulationProvider>
          <main className={styles.mainContent}>

            {/* ═══════ 1. HERO — Patrimonio Neto ═══════ */}
            <div className={styles.heroCard}>
              <p className={styles.heroLabel}>Patrimonio Neto</p>
              <h1 className={styles.heroAmount}>
                <FormattedAmount amount={netWorthArs} originalCurrency="ARS" />
              </h1>
              <div className={styles.heroFooter}>
                <span className={styles.heroTrend}>
                  <ArrowUpRight size={12} />
                  Líquido: <FormattedAmount amount={totalBalanceArs + (totalBalanceUsd * EXCHANGE_RATE)} originalCurrency="ARS" />
                </span>
                <span className={styles.heroTrend}>
                  <PieChart size={12} />
                  Invertido: <FormattedAmount amount={totalInvestmentsArs + (totalInvestmentsUsd * EXCHANGE_RATE)} originalCurrency="ARS" />
                </span>
              </div>
            </div>

            {/* ═══════ 2. STATS — 2×2 Grid ═══════ */}
            <div className={styles.statsScroll}>
              <div className={styles.statCard}>
                <span className={styles.statLabel}>Ingresos</span>
                <span className={styles.statValue}>
                  <FormattedAmount amount={totalIncomeArs} originalCurrency="ARS" />
                </span>
                <span className={styles.statMeta}>
                  <span className={styles.statIndicator} style={{ backgroundColor: '#22c55e' }} />
                  este mes
                </span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statLabel}>Gastos</span>
                <span className={styles.statValue}>
                  <FormattedAmount amount={totalExpenseArs} originalCurrency="ARS" />
                </span>
                <span className={styles.statMeta}>
                  <span className={styles.statIndicator} style={{ backgroundColor: '#ef4444' }} />
                  este mes
                </span>
              </div>
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
              <div className={styles.statCard}>
                <span className={styles.statLabel}>Runway</span>
                <span className={styles.statValue}>
                  {runwayData.daysLeft === -1 ? '∞' : runwayData.daysLeft}
                  <span style={{ fontSize: '0.7rem', fontWeight: 500, color: '#737373', marginLeft: '0.25rem' }}>días</span>
                </span>
                <span className={styles.statMeta}>
                  <span className={styles.statIndicator} style={{ backgroundColor: runwayStatus.color }} />
                  {runwayStatus.label}
                </span>
              </div>
            </div>

            {/* ═══════ 3. WALLETS CAROUSEL ═══════ */}
            {accounts.length > 0 && (
              <section className={styles.accountsSection}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                  <span className={styles.sectionTitleSmall}>Billeteras</span>
                  <Link href="/mobile/ajustes/cuentas" className={styles.ctaLink}>Gestionar</Link>
                </div>
                <div className={styles.accountsScroll}>
                  {accounts.map(acc => {
                    const s = getAccountStyles(acc.type);
                    return (
                      <div key={acc.id} className={styles.accountCard}>
                        <div className={styles.accountIconWrap} style={{ color: s.iconColor, backgroundColor: s.bgColor }}>
                          {s.icon}
                        </div>
                        <div className={styles.accountCardInfo}>
                          <p className={styles.accountName}>{acc.name}</p>
                          <p className={styles.accountBalance}>
                            <FormattedAmount amount={acc.balance} originalCurrency={acc.currency} />
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* ═══════ 4. FORECAST CHART ═══════ */}
            <div className={styles.card}>
              <div className={styles.cardTitle}>Flujo Mensual</div>
              <ForecastChart data={forecastData} />
            </div>

            {/* ═══════ 5. DISTRIBUTION + BUDGET (side by side on wider phones, stacked on narrow) ═══════ */}
            <div className={styles.card}>
              <div className={styles.cardTitle}>Distribución de Activos</div>
              <DistributionChart
                liquidArs={totalBalanceArs + (totalBalanceUsd * EXCHANGE_RATE)}
                investedArs={totalInvestmentsArs + (totalInvestmentsUsd * EXCHANGE_RATE)}
              />
            </div>

            <div className={styles.card}>
              <div className={styles.cardTitle}>Control de Presupuesto</div>
              {budgetData.isConfigured ? (
                <BudgetTracker
                  currentExpenseArs={totalExpenseArs}
                  monthlyBudgetArs={budgetData.total}
                />
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', padding: '1rem 0' }}>
                  <Target size={28} style={{ opacity: 0.15 }} />
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#a3a3a3', textAlign: 'center' }}>
                    No tenés presupuestos definidos.
                  </p>
                  <Link href="/mobile/presupuesto" className={styles.ctaLink}>
                    Crear presupuesto →
                  </Link>
                </div>
              )}
            </div>

            {/* ═══════ 6. AGENDA ═══════ */}
            <div className={styles.card}>
              <div className={styles.cardTitle}>
                <span>Próximas en Agenda</span>
                <Calendar size={14} style={{ opacity: 0.3 }} />
              </div>
              {recurring
                .filter(r => (r.dayOfMonth || 0) >= new Date().getDate())
                .sort((a, b) => (a.dayOfMonth || 0) - (b.dayOfMonth || 0))
                .slice(0, 3)
                .map(r => (
                  <div key={r.id} className={styles.activityItem}>
                    <div className={styles.activityDot} style={{ backgroundColor: r.type === 'INCOME' ? '#22c55e' : '#0a0a0a' }} />
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: 0, fontWeight: 600, fontSize: '0.82rem', color: '#0a0a0a' }}>{r.name}</p>
                      <p style={{ margin: 0, fontSize: '0.72rem', color: '#a3a3a3' }}>
                        Día {r.dayOfMonth} • <FormattedAmount amount={r.amount} originalCurrency={r.currency} />
                      </p>
                    </div>
                  </div>
                ))}
              {recurring.filter(r => (r.dayOfMonth || 0) >= new Date().getDate()).length === 0 && (
                <p className={styles.emptyText}>No hay pagos pendientes este mes.</p>
              )}
            </div>

            {/* ═══════ 7. SMART INSIGHTS ═══════ */}
            <div className={styles.card}>
              <div className={styles.cardTitle}>Smart Insights</div>
              {(premiumInsights as any[]).map((insight: any, idx: number) => (
                <div
                  key={idx}
                  className={styles.insightItem}
                  style={{ backgroundColor: getInsightBg(insight.type) }}
                >
                  {getInsightIcon(insight.type)}
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', color: '#737373' }}>{insight.category}</p>
                    <p style={{ margin: '0.15rem 0 0', fontSize: '0.82rem', fontWeight: 600, color: '#0a0a0a', lineHeight: 1.35 }}>{insight.message}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* ═══════ 8. TRANSACTIONS ═══════ */}
            <div className={styles.transactionsSection}>
              <div className={styles.transactionsHeader}>
                <span className={styles.transactionsTitle}>Movimientos Recientes</span>
              </div>
              <div className={styles.transactionsBody}>
                {transactions.length === 0 ? (
                  <p className={styles.emptyText}>Aún no hay movimientos registrados.</p>
                ) : (
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.35rem', padding: 0, margin: 0 }}>
                    {transactions.map((t: any) => (
                      <TransactionItem key={t.id} t={t} />
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </main>
        </SimulationProvider>
      </CurrencyProvider>
    </div>
  );
}
