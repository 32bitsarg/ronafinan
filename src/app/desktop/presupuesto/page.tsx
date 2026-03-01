import { getBudgets, getMonthlyIncomeProjection } from '@/actions/budget';
import { BudgetForm, DeleteBudgetButton } from '../../mobile/presupuesto/ClientComponents';
import { PieChart, ListChecks } from 'lucide-react';
import { formatMoney } from '@/lib/formatters';

export const dynamic = 'force-dynamic';

export default async function PresupuestoDesktop() {
    const today = new Date();
    const month = today.getMonth();
    const year = today.getFullYear();

    const budgets = await getBudgets(month, year);
    const projectedIncome = await getMonthlyIncomeProjection(month, year);

    const totalBudgeted = budgets.reduce((sum, b) => sum + b.limit, 0);
    const leftToBudget = projectedIncome - totalBudgeted;



    return (
        <div>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.5rem', margin: '0 0 0.2rem 0', fontWeight: '700' }}>Presupuestos ZBB</h1>
                    <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.9rem' }}>Dale a cada peso un trabajo (Zero-Based Budgeting)</p>
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '1.5rem' }}>
                {/* Left Column (8 cols): Dashboard and Envelopes List */}
                <div style={{ gridColumn: 'span 8', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                    {/* ZBB Core Card */}
                    <div style={{ backgroundColor: leftToBudget === 0 ? 'var(--success-muted)' : 'var(--bg-surface)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: '500' }}>Dinero Sin Asignar</p>
                        <h2 style={{ fontSize: '3rem', fontWeight: '800', color: leftToBudget === 0 ? 'var(--success)' : leftToBudget < 0 ? 'var(--error)' : 'var(--accent-primary)', margin: 0 }}>
                            {formatMoney(leftToBudget)}
                        </h2>
                        {leftToBudget === 0
                            ? <p style={{ color: 'var(--success)', marginTop: '0.5rem', fontWeight: '600', fontSize: '1rem' }}>¡Presupuesto Perfecto! (Fórmula Base Cero 🎉)</p>
                            : leftToBudget < 0
                                ? <p style={{ color: 'var(--error)', marginTop: '0.5rem', fontWeight: '500', fontSize: '0.9rem' }}>¡Peligro! Asignaste ${Math.abs(leftToBudget)} de más.</p>
                                : <p style={{ color: 'var(--accent-primary)', marginTop: '0.5rem', fontWeight: '500', fontSize: '0.9rem' }}>Tienes dinero ocioso. Créale un sobre al lado derecho.</p>
                        }

                        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem', marginTop: '1.5rem' }}>
                            <div>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '0 0 0.2rem 0' }}>Ingreso Proyectado</p>
                                <p style={{ fontWeight: '700', fontSize: '1.2rem', margin: 0 }}>{formatMoney(projectedIncome)}</p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '0 0 0.2rem 0' }}>Total Asignado</p>
                                <p style={{ fontWeight: '700', fontSize: '1.2rem', margin: 0 }}>{formatMoney(totalBudgeted)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Envelopes Grid */}
                    <div style={{ backgroundColor: 'var(--bg-surface)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                        <h2 style={{ fontSize: '1.1rem', fontWeight: '600', margin: '0 0 1.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <ListChecks size={20} /> Estado de los Sobres
                        </h2>

                        {budgets.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-secondary)' }}>
                                <PieChart size={48} style={{ margin: '0 auto 1rem auto', opacity: 0.5 }} />
                                <p style={{ fontWeight: '500', margin: '0 0 0.5rem 0' }}>Aún no has creado sobres.</p>
                                <span style={{ fontSize: '0.9rem' }}>Divide tu dinero en "Comida", "Alquiler", etc.</span>
                            </div>
                        ) : (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                                {budgets.map((b) => {
                                    const progress = Math.min((b.spent / b.limit) * 100, 100);
                                    const isOverBudget = b.left < 0;

                                    return (
                                        <div key={b.id} style={{ backgroundColor: 'var(--bg-main)', padding: '1.2rem', borderRadius: '12px', border: `1px solid ${isOverBudget ? 'var(--error)' : 'var(--border-subtle)'}` }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.8rem' }}>
                                                <div>
                                                    <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '600', color: isOverBudget ? 'var(--error)' : 'white' }}>{b.category}</h3>
                                                    <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                                        {isOverBudget ? 'Gastaste de más' : `${formatMoney(b.left)} disponibles`}
                                                    </p>
                                                </div>
                                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.4rem' }}>
                                                    <DeleteBudgetButton id={b.id} />
                                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '500' }}>Asignado: {formatMoney(b.limit)}</span>
                                                </div>
                                            </div>

                                            {/* Progress Bar */}
                                            <div style={{ width: '100%', backgroundColor: 'var(--bg-surface)', height: '6px', borderRadius: '3px', overflow: 'hidden', marginTop: '1rem' }}>
                                                <div style={{
                                                    width: `${progress}%`,
                                                    height: '100%',
                                                    backgroundColor: isOverBudget ? 'var(--error)' : progress > 80 ? 'var(--accent-primary)' : 'var(--success)',
                                                    transition: 'width 0.3s ease'
                                                }} />
                                            </div>

                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                                                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Gastado: {formatMoney(b.spent)}</span>
                                                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '600' }}>{progress.toFixed(0)}%</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column (4 cols): Budget Form */}
                <div style={{ gridColumn: 'span 4' }}>
                    <div style={{ backgroundColor: 'var(--bg-surface)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-subtle)', position: 'sticky', top: '2rem' }}>
                        <h2 style={{ fontSize: '1.1rem', fontWeight: '600', margin: '0 0 1rem 0' }}>Asignar Dinero</h2>
                        <BudgetForm />
                    </div>
                </div>

            </div>
        </div>
    );
}
