import { getInvestments } from '@/actions/investment';
import { InvestmentForm, DeleteInvestmentButton } from '../../mobile/inversiones/ClientComponents';
import { LineChart, Building, AlertCircle } from 'lucide-react';
import { getDolarBlueRate } from '@/lib/dolar';
import { formatMoney } from '@/lib/formatters';

export const dynamic = 'force-dynamic';

export default async function InversionesDesktop() {
    const investments = await getInvestments();
    const EXCHANGE_RATE_USD_ARS = await getDolarBlueRate();

    const totalInvestedInArs = investments.reduce((sum, inv) => {
        let val = inv.invested;
        if (inv.currency === 'USD') val *= EXCHANGE_RATE_USD_ARS;
        return sum + val;
    }, 0);

    const totalCurrentValInArs = investments.reduce((sum, inv) => {
        let val = inv.currentVal || inv.invested;
        if (inv.currency === 'USD') val *= EXCHANGE_RATE_USD_ARS;
        return sum + val;
    }, 0);



    const globalYieldPerc = totalInvestedInArs > 0 ? ((totalCurrentValInArs - totalInvestedInArs) / totalInvestedInArs) * 100 : 0;
    const isGlobalPositive = globalYieldPerc >= 0;

    return (
        <div>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.5rem', margin: '0 0 0.2rem 0', fontWeight: '700' }}>Inversiones</h1>
                    <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.9rem' }}>Supervisa tu dinero trabajando para ti</p>
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '1.5rem' }}>

                {/* Left Column (8 cols): Portfolio Summary & List */}
                <div style={{ gridColumn: 'span 8', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                    {/* Dashboard Metric */}
                    <div style={{ backgroundColor: 'var(--bg-surface)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: '500' }}>Valor Actual del Portafolio (ARS Consolidado)</p>
                            <h2 style={{ fontSize: '3rem', fontWeight: '800', margin: 0, color: 'var(--text-primary)' }}>
                                {formatMoney(totalCurrentValInArs)}
                            </h2>
                            {totalInvestedInArs > 0 && (
                                <p style={{ color: isGlobalPositive ? 'var(--success)' : 'var(--error)', marginTop: '0.5rem', fontWeight: '600', fontSize: '1.1rem' }}>
                                    Rendimiento {isGlobalPositive ? 'Positivo' : 'Negativo'}: {isGlobalPositive ? '+' : ''}{globalYieldPerc.toFixed(2)}%
                                </p>
                            )}
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '0.5rem' }}>
                                Sincronización bursátil: U$D a {formatMoney(EXCHANGE_RATE_USD_ARS)}
                            </p>
                        </div>

                        <div style={{ display: 'flex', gap: '2rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.5rem' }}>
                            <div style={{ flex: 1 }}>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '0 0 0.3rem 0', fontWeight: '500' }}>Capital Invertido Neto</p>
                                <p style={{ fontWeight: '700', fontSize: '1.4rem', margin: 0 }}>{formatMoney(totalInvestedInArs)}</p>
                            </div>
                            <div style={{ flex: 1 }}>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '0 0 0.3rem 0', fontWeight: '500' }}>Cantidad Dispersada</p>
                                <p style={{ fontWeight: '700', fontSize: '1.4rem', margin: 0 }}>{investments.length} Activos</p>
                            </div>
                        </div>
                    </div>

                    {/* Assets Grid */}
                    <div style={{ backgroundColor: 'var(--bg-surface)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                        <h2 style={{ fontSize: '1.1rem', fontWeight: '600', margin: '0 0 1.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <LineChart size={20} /> Mis Activos en Cartera
                        </h2>

                        {investments.length === 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '3rem 0', color: 'var(--text-secondary)' }}>
                                <AlertCircle size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                                <p style={{ fontWeight: '500', margin: '0 0 0.5rem 0' }}>Aún no declaraste inversiones en este entorno.</p>
                                <span style={{ fontSize: '0.9rem' }}>Registra depósitos a plazo, criptos o CEDEARs a la derecha.</span>
                            </div>
                        ) : (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                                {investments.map((inv) => {
                                    const currentValSafeguard = inv.currentVal || inv.invested;
                                    const yieldVal = currentValSafeguard - inv.invested;
                                    const yieldPerc = inv.invested > 0 ? (yieldVal / inv.invested) * 100 : 0;
                                    const isPositive = yieldPerc >= 0;

                                    return (
                                        <div key={inv.id} style={{ backgroundColor: 'var(--bg-main)', padding: '1.2rem', borderRadius: '12px', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                                                    <div style={{ backgroundColor: 'var(--bg-surface)', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                                                        <Building size={20} color="var(--accent-primary)" />
                                                    </div>
                                                    <div>
                                                        <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: '600', color: 'var(--text-primary)' }}>{inv.name}</h3>
                                                        <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                                            Broker: {inv.platform}
                                                        </p>
                                                    </div>
                                                </div>
                                                <DeleteInvestmentButton id={inv.id} />
                                            </div>

                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', borderTop: '1px dashed var(--border-subtle)', paddingTop: '0.8rem' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '500' }}>Invertido</span>
                                                    <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: '600' }}>{formatMoney(inv.invested, inv.currency)}</span>
                                                </div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '500' }}>Valor Actual</span>
                                                    <div style={{ textAlign: 'right' }}>
                                                        <span style={{ fontSize: '1rem', color: 'var(--text-primary)', fontWeight: '700', display: 'block' }}>
                                                            {formatMoney(currentValSafeguard, inv.currency)}
                                                        </span>
                                                        <span style={{ color: isPositive ? 'var(--success)' : 'var(--error)', fontSize: '0.8rem', fontWeight: '600' }}>
                                                            {isPositive ? '+' : ''}{yieldPerc.toFixed(2)}%
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column (4 cols): Declarate Form */}
                <div style={{ gridColumn: 'span 4' }}>
                    <div style={{ backgroundColor: 'var(--bg-surface)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-subtle)', position: 'sticky', top: '2rem' }}>
                        <h2 style={{ fontSize: '1.1rem', fontWeight: '600', margin: '0 0 1rem 0' }}>Declarar Inversión</h2>
                        <InvestmentForm />
                    </div>
                </div>

            </div>
        </div>
    );
}
