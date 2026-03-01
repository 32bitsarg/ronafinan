import { getSession, getAvailableWorkspaces } from "@/actions/auth";
import { getDashboardData } from "@/actions/transaction";
import { getForecastData } from "@/actions/forecasting";
import WorkspaceSwitcher from "@/components/WorkspaceSwitcher";
import { Wallet, Building, CreditCard, ArrowUpRight, ArrowDownLeft, HandCoins, PieChart, TrendingDown, Target, LineChart, PiggyBank, Banknote, SmartphoneNfc } from "lucide-react";
import DesktopTransactionList from "@/components/DesktopTransactionList";
import ForecastChart from "@/components/ForecastChart";
import { formatMoney } from '@/lib/formatters';

export const dynamic = 'force-dynamic';

export default async function DesktopHome() {
    const session = await getSession();
    const workspaces = await getAvailableWorkspaces();
    const data = await getDashboardData();
    const { accounts, totalBalanceArs, totalBalanceUsd, transactions, initialBalanceArs, initialBalanceUsd } = data;
    const forecastData = await getForecastData();

    const getAccountStyles = (type: string) => {
        switch (type) {
            case 'SAVINGS':
                return {
                    icon: <PiggyBank size={20} />,
                    bgColor: 'hsl(125, 40%, 96%)',
                    textColor: '#1f2937',
                    iconColor: '#10b981'
                };
            case 'CASH':
                return {
                    icon: <Banknote size={20} />,
                    bgColor: 'hsl(45, 40%, 96%)',
                    textColor: '#1f2937',
                    iconColor: '#f59e0b'
                };
            case 'E-WALLET':
                return {
                    icon: <SmartphoneNfc size={20} />,
                    bgColor: 'hsl(199, 40%, 96%)',
                    textColor: '#1f2937',
                    iconColor: '#0ea5e9'
                };
            case 'BANK':
                return {
                    icon: <Building size={20} />,
                    bgColor: 'hsl(220, 30%, 97%)',
                    textColor: '#1f2937',
                    iconColor: '#3b82f6'
                };
            case 'CREDIT_CARD':
                return {
                    icon: <CreditCard size={20} />,
                    bgColor: 'hsl(262, 30%, 97%)',
                    textColor: '#1f2937',
                    iconColor: '#8b5cf6'
                };
            case 'DEBT':
                return {
                    icon: <HandCoins size={20} />,
                    bgColor: 'hsl(0, 30%, 97%)',
                    textColor: '#1f2937',
                    iconColor: '#ef4444'
                };
            default:
                return {
                    icon: <Wallet size={20} />,
                    bgColor: 'var(--bg-surface)',
                    textColor: 'var(--text-primary)',
                    iconColor: 'var(--accent-primary)'
                };
        }
    };

    let totalIncomeArs = 0, totalExpenseArs = 0, totalIncomeUsd = 0, totalExpenseUsd = 0;
    const expensesByCategory: Record<string, number> = {};

    transactions.forEach((t: any) => {
        if (t.type === 'INCOME') {
            if (t.currency === 'USD') totalIncomeUsd += t.amount;
            else totalIncomeArs += t.amount;
        }
        if (t.type === 'EXPENSE') {
            if (t.currency === 'USD') totalExpenseUsd += t.amount;
            else totalExpenseArs += t.amount;
            expensesByCategory[t.category] = (expensesByCategory[t.category] || 0) + t.amount;
        }
    });



    return (
        <div>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.5rem', margin: '0 0 0.2rem 0', fontWeight: '700' }}>Panel General</h1>
                    <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.9rem' }}>Vista resumida de tu dinero y movimientos</p>
                </div>
                <div style={{ width: '250px' }}>
                    <WorkspaceSwitcher
                        workspaces={workspaces.map(w => ({ id: w.id, name: w.name.replace(/^Personal de .*$/, 'Personal') }))}
                        activeId={session.activeWorkspaceId!}
                    />
                </div>
            </header>

            {/* Grid Layout for Desktop */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '1.5rem' }}>

                {/* Left Column: Net Worth & Stats (8 cols) */}
                <div style={{ gridColumn: 'span 8', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                    {/* Patrimonio Neto Enorme */}
                    <div style={{ backgroundColor: 'var(--bg-surface)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: '0 0 0.2rem 0', fontWeight: '500' }}>Patrimonio Neto Total</p>
                            <h2 style={{ fontSize: '2.5rem', margin: 0, fontWeight: '800' }}>{formatMoney(totalBalanceArs)}</h2>
                            <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center', marginTop: '0.2rem' }}>
                                {totalBalanceUsd > 0 && <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', margin: 0, fontWeight: '500' }}>{formatMoney(totalBalanceUsd, 'USD')}</p>}
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, opacity: 0.8 }}>
                                    (Iniciaste el mes con: <strong>{formatMoney(initialBalanceArs)}</strong>{initialBalanceUsd > 0 && ` + ${formatMoney(initialBalanceUsd, 'USD')}`})
                                </p>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <div style={{ backgroundColor: 'var(--bg-main)', padding: '1rem', borderRadius: '8px', minWidth: '130px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--success)', fontSize: '0.85rem' }}>
                                    <ArrowUpRight size={16} /> <span style={{ fontWeight: '600' }}>Ingresos</span>
                                </div>
                                <p style={{ fontSize: '1.25rem', margin: '0.4rem 0 0 0', fontWeight: '700' }}>{formatMoney(totalIncomeArs)}</p>
                            </div>
                            <div style={{ backgroundColor: 'var(--bg-main)', padding: '1rem', borderRadius: '8px', minWidth: '130px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--error)', fontSize: '0.85rem' }}>
                                    <ArrowDownLeft size={16} /> <span style={{ fontWeight: '600' }}>Gastos</span>
                                </div>
                                <p style={{ fontSize: '1.25rem', margin: '0.4rem 0 0 0', fontWeight: '700' }}>{formatMoney(totalExpenseArs)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Desktop Transaction List (Using a Table) */}
                    <div style={{ backgroundColor: 'var(--bg-surface)', borderRadius: '12px', border: '1px solid var(--border-subtle)', padding: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.1rem', margin: '0 0 1rem 0', fontWeight: '600' }}>Movimientos Recientes</h3>
                        <DesktopTransactionList transactions={transactions} />
                    </div>
                </div>

                {/* Right Column: Wallets & Quick Actions (4 cols) */}
                <div style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                    {/* Billeteras Card */}
                    <div style={{ backgroundColor: 'var(--bg-surface)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                        <h3 style={{ fontSize: '1.1rem', margin: '0 0 1rem 0', fontWeight: '600' }}>Mis Billeteras</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {accounts.length === 0 ? (
                                <p style={{ color: 'var(--text-secondary)' }}>No tienes billeteras.</p>
                            ) : (
                                accounts.map(acc => {
                                    const stylesObj = getAccountStyles(acc.type);
                                    return (
                                        <div
                                            key={acc.id}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                padding: '0.75rem 1rem',
                                                backgroundColor: stylesObj.bgColor,
                                                borderRadius: '8px',
                                                border: '1px solid rgba(0,0,0,0.05)'
                                            }}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                <div style={{ padding: '8px', backgroundColor: 'rgba(255,255,255,0.4)', borderRadius: '50%', color: stylesObj.iconColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    {stylesObj.icon}
                                                </div>
                                                <p style={{ fontWeight: '600', fontSize: '0.95rem', margin: 0, color: stylesObj.textColor }}>{acc.name}</p>
                                            </div>
                                            <p style={{ margin: 0, fontWeight: '700', fontSize: '1rem', color: stylesObj.textColor }}>
                                                {formatMoney(acc.balance, acc.currency)}
                                            </p>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>

                </div>
            </div>

            {/* Segunda Fila de Grid (Estadísticas y Forecast) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '1.5rem', marginTop: '1.5rem' }}>
                <div style={{ gridColumn: 'span 8', backgroundColor: 'var(--bg-surface)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <h3 style={{ fontSize: '1.1rem', margin: 0, fontWeight: '600' }}>Flujo de Caja Proyectado</h3>
                        <LineChart size={20} color="var(--text-secondary)" />
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Estimación combinando presupuestos y suscripciones activas.</p>
                    <ForecastChart data={forecastData} />
                </div>

                <div style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ backgroundColor: 'var(--bg-surface)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.1rem', margin: 0, fontWeight: '600' }}>Resumen de Gastos</h3>
                            <PieChart size={20} color="var(--text-secondary)" />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {Object.keys(expensesByCategory).length === 0 ? (
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>No hay gastos para analizar.</p>
                            ) : (
                                Object.entries(expensesByCategory).sort(([, a], [, b]) => b - a).map(([cat, amount], idx) => {
                                    const percentage = totalExpenseArs > 0 ? (amount / totalExpenseArs) * 100 : 0;
                                    const colors = ['#0F172A', '#334155', '#475569', '#64748B'];
                                    const bgColor = colors[idx % colors.length];
                                    return (
                                        <div key={cat}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.3rem' }}>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '500' }}>
                                                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: bgColor }} />
                                                    {cat}
                                                </span>
                                                <span style={{ fontWeight: '600' }}>{formatMoney(amount)}</span>
                                            </div>
                                            <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--bg-main)', borderRadius: '99px', overflow: 'hidden' }}>
                                                <div style={{ width: `${percentage}%`, height: '100%', backgroundColor: bgColor }} />
                                            </div>
                                        </div>
                                    )
                                })
                            )}
                        </div>
                    </div>

                    <div style={{ backgroundColor: 'var(--bg-surface)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1rem' }}>
                            <div style={{ backgroundColor: 'var(--bg-main)', padding: '0.5rem', borderRadius: '8px' }}>
                                <Target size={18} color="var(--accent-primary)" />
                            </div>
                            <div>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>Tasa de Ahorro</p>
                                <p style={{ fontSize: '1.1rem', fontWeight: '700', margin: 0 }}>
                                    {totalIncomeArs > 0 ? `${Math.max(0, Math.round(((totalIncomeArs - totalExpenseArs) / totalIncomeArs) * 100))}%` : '0%'}
                                </p>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                            <div style={{ backgroundColor: 'var(--bg-main)', padding: '0.5rem', borderRadius: '8px' }}>
                                <TrendingDown size={18} color="var(--error)" />
                            </div>
                            <div>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>Mayor Gasto</p>
                                <p style={{ fontSize: '1.1rem', fontWeight: '700', margin: 0 }}>
                                    {Object.keys(expensesByCategory).length > 0
                                        ? Object.keys(expensesByCategory).reduce((a, b) => expensesByCategory[a] > expensesByCategory[b] ? a : b)
                                        : 'N/A'
                                    }
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
