import { getSession, getAvailableWorkspaces } from "@/actions/auth";
import { getDashboardData } from "@/actions/transaction";
import WorkspaceSwitcher from "@/components/WorkspaceSwitcher";
import { Wallet, Building, CreditCard, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import DesktopTransactionList from "@/components/DesktopTransactionList";

export const dynamic = 'force-dynamic';

export default async function DesktopHome() {
    const session = await getSession();
    const workspaces = await getAvailableWorkspaces();
    const data = await getDashboardData();
    const { accounts, totalBalanceArs, totalBalanceUsd, transactions } = data;

    const renderAccountIcon = (type: string) => {
        switch (type) {
            case 'CASH': return <Wallet size={20} />;
            case 'BANK': return <Building size={20} />;
            default: return <CreditCard size={20} />;
        }
    };

    let totalIncomeArs = 0, totalExpenseArs = 0, totalIncomeUsd = 0, totalExpenseUsd = 0;
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
                            {totalBalanceUsd > 0 && <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0 0', fontWeight: '500' }}>{formatMoney(totalBalanceUsd, 'USD')}</p>}
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
                                accounts.map(acc => (
                                    <div key={acc.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', backgroundColor: 'var(--bg-main)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <div style={{ padding: '8px', backgroundColor: 'var(--bg-surface)', borderRadius: '50%', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                {renderAccountIcon(acc.type)}
                                            </div>
                                            <p style={{ fontWeight: '600', fontSize: '0.95rem', margin: 0 }}>{acc.name}</p>
                                        </div>
                                        <p style={{ margin: 0, fontWeight: '700', fontSize: '1rem' }}>
                                            {formatMoney(acc.balance, acc.currency)}
                                        </p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
