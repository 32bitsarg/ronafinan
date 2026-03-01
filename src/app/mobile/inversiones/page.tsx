import styles from '../fijos/page.module.css'; // Reusing standard internal layout style mappings
import { getInvestments } from '@/actions/investment';
import { InvestmentForm, DeleteInvestmentButton } from './ClientComponents';
import { LineChart, Building, AlertCircle } from 'lucide-react';
import { getDolarBlueRate } from '@/lib/dolar';

export const dynamic = 'force-dynamic';

export default async function InversionesPage() {
    const investments = await getInvestments();
    const EXCHANGE_RATE_USD_ARS = await getDolarBlueRate();

    // Calculamos totales considerando el rate
    const totalInvestedInArs = investments.reduce((sum, inv) => {
        let val = inv.invested;
        if (inv.currency === 'USD') val *= EXCHANGE_RATE_USD_ARS;
        return sum + val;
    }, 0);

    const totalCurrentValInArs = investments.reduce((sum, inv) => {
        let val = inv.currentVal || inv.invested; // If no currentVal, assume it's flat
        if (inv.currency === 'USD') val *= EXCHANGE_RATE_USD_ARS;
        return sum + val;
    }, 0);

    const formatMoney = (val: number, reqCurrency = 'ARS') =>
        reqCurrency === 'USD'
            ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(val)
            : new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0 }).format(val);

    const globalYieldPerc = totalInvestedInArs > 0 ? ((totalCurrentValInArs - totalInvestedInArs) / totalInvestedInArs) * 100 : 0;
    const isGlobalPositive = globalYieldPerc >= 0;

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Portafolio Total</h1>
                <p className={styles.subtitle}>Supervisa tu dinero trabajando para ti</p>
            </header>

            <main className={styles.mainContent}>

                {/* 1. Dashboard Principal Inversiones */}
                <section className={styles.summaryCard} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', backgroundColor: 'var(--bg-card)' }}>

                    <div style={{ textAlign: 'center', margin: '1rem 0' }}>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: '0.5rem' }}>Valor Actual del Portafolio (ARS Consolidado)</p>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'white', margin: 0 }}>
                            {formatMoney(totalCurrentValInArs)}
                        </h2>
                        {totalInvestedInArs > 0 && (
                            <p style={{ color: isGlobalPositive ? 'var(--success)' : 'var(--error)', marginTop: '0.5rem', fontWeight: 'bold' }}>
                                Rendimiento: {isGlobalPositive ? '+' : ''}{globalYieldPerc.toFixed(2)}%
                            </p>
                        )}
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '1rem' }}>Sincronizado vía DolarAPI: 1 U$D = {formatMoney(EXCHANGE_RATE_USD_ARS)}</p>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
                        <div>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Capital Invertido Neto</p>
                            <p style={{ fontWeight: 'bold' }}>{formatMoney(totalInvestedInArs)}</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Total Activos</p>
                            <p style={{ fontWeight: 'bold' }}>{investments.length}</p>
                        </div>
                    </div>
                </section>

                {/* 2. Formulario para Crear Acticos */}
                <section className={styles.actionSection} style={{ marginTop: '2rem' }}>
                    <h2 className={styles.sectionTitle}>Declarar Inversión</h2>
                    <InvestmentForm />
                </section>

                {/* 3. Listado de Instrumentos */}
                <section className={styles.listSection} style={{ marginTop: '2rem' }}>
                    <h2 className={styles.sectionTitle} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <LineChart size={20} /> Mis Activos
                    </h2>

                    {investments.length === 0 ? (
                        <div className={styles.emptyState}>
                            <AlertCircle size={48} className={styles.emptyIcon} />
                            <p>Aún no declaraste inversiones en este entorno.</p>
                            <span>Registra depósitos a plazo, criptos o CEDEARs.</span>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                            {investments.map((inv) => {
                                const currentValSafeguard = inv.currentVal || inv.invested;
                                const yieldVal = currentValSafeguard - inv.invested;
                                const yieldPerc = inv.invested > 0 ? (yieldVal / inv.invested) * 100 : 0;
                                const isPositive = yieldPerc >= 0;

                                return (
                                    <div key={inv.id} style={{ backgroundColor: 'var(--bg-surface)', padding: '1.2rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.8rem' }}>
                                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                                <div style={{ backgroundColor: 'var(--bg-main)', padding: '0.8rem', borderRadius: '50%' }}>
                                                    <Building size={24} color="var(--accent-primary)" />
                                                </div>
                                                <div>
                                                    <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'white' }}>{inv.name}</h3>
                                                    <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                                        {inv.platform}
                                                    </p>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                                <DeleteInvestmentButton id={inv.id} />
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', borderTop: '1px solid var(--bg-main)', paddingTop: '0.8rem' }}>
                                            <div>
                                                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block' }}>Invertido</span>
                                                <span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>{formatMoney(inv.invested, inv.currency)}</span>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block' }}>Valor (Rendimiento)</span>
                                                <span style={{ fontSize: '1.1rem', color: 'white', fontWeight: 'bold' }}>
                                                    {formatMoney(currentValSafeguard, inv.currency)}
                                                    <span style={{ color: isPositive ? 'var(--success)' : 'var(--error)', fontSize: '0.9rem', marginLeft: '0.5rem' }}>
                                                        ({isPositive ? '+' : ''}{yieldPerc.toFixed(2)}%)
                                                    </span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}
