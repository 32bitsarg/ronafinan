import styles from '../fijos/page.module.css'; // Reusing matching layout system
import { getBudgets, getMonthlyIncomeProjection } from '@/actions/budget';
import { BudgetForm, DeleteBudgetButton } from './ClientComponents';
import { PieChart, ListChecks } from 'lucide-react';
import { formatMoney } from '@/lib/formatters';

export const dynamic = 'force-dynamic';

export default async function PresupuestoPage() {
    const today = new Date();
    const month = today.getMonth();
    const year = today.getFullYear();

    const budgets = await getBudgets(month, year);
    const projectedIncome = await getMonthlyIncomeProjection(month, year);

    // Sumamos todo lo que el usuario YA separó en "bolsas" (sobres)
    const totalBudgeted = budgets.reduce((sum, b) => sum + b.limit, 0);

    // EL NUMERO CLAVE: Dinero sin asignar. El juego es llevar esto a 0.
    const leftToBudget = projectedIncome - totalBudgeted;



    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Distribución Mensual</h1>
                <p className={styles.subtitle}>Dale a cada peso un trabajo (Zero-Based Budgeting)</p>
            </header>

            <main className={styles.mainContent}>

                {/* 1. Dashboard Principal ZBB */}
                <section className={styles.summaryCard} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', backgroundColor: leftToBudget === 0 ? 'var(--success-muted)' : 'var(--bg-card)' }}>

                    <div style={{ textAlign: 'center', margin: '1rem 0' }}>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: '0.5rem' }}>Dinero Sin Asignar</p>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: leftToBudget === 0 ? 'var(--success)' : leftToBudget < 0 ? 'var(--error)' : 'var(--accent-primary)', margin: 0 }}>
                            {formatMoney(leftToBudget)}
                        </h2>
                        {leftToBudget === 0
                            ? <p style={{ color: 'var(--success)', marginTop: '0.5rem', fontWeight: 'bold' }}>¡Presupuesto Perfecto! (Fórmula Base Cero 🎉)</p>
                            : leftToBudget < 0
                                ? <p style={{ color: 'var(--error)', marginTop: '0.5rem' }}>¡Peligro! Asignaste ${Math.abs(leftToBudget)} de más.</p>
                                : <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Tienes dinero ocioso. Créale un sobre abajo.</p>
                        }
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
                        <div>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Ingreso Proyectado</p>
                            <p style={{ fontWeight: 'bold' }}>{formatMoney(projectedIncome)}</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Total Asignado</p>
                            <p style={{ fontWeight: 'bold' }}>{formatMoney(totalBudgeted)}</p>
                        </div>
                    </div>
                </section>

                {/* 2. Formulario para Crear Sobres */}
                <section className={styles.actionSection} style={{ marginTop: '2rem' }}>
                    <h2 className={styles.sectionTitle}>Asignar Dinero a Sobre</h2>
                    <BudgetForm />
                </section>

                {/* 3. Listado de Sobres y Ejecución en Tiempo Real */}
                <section className={styles.listSection} style={{ marginTop: '2rem' }}>
                    <h2 className={styles.sectionTitle} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <ListChecks size={20} /> Estado de los Sobres
                    </h2>

                    {budgets.length === 0 ? (
                        <div className={styles.emptyState}>
                            <PieChart size={48} className={styles.emptyIcon} />
                            <p>Aún no has creado sobres.</p>
                            <span>Divide tu dinero en "Comida", "Alquiler", etc.</span>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                            {budgets.map((b) => {
                                const progress = Math.min((b.spent / b.limit) * 100, 100);
                                const isOverBudget = b.left < 0;

                                return (
                                    <div key={b.id} style={{ backgroundColor: 'var(--bg-surface)', padding: '1rem', borderRadius: '12px', border: `1px solid ${isOverBudget ? 'var(--error)' : 'var(--border-subtle)'}` }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.8rem' }}>
                                            <div>
                                                <h3 style={{ margin: 0, fontSize: '1.1rem', color: isOverBudget ? 'var(--error)' : 'white' }}>{b.category}</h3>
                                                <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                                    {isOverBudget ? 'Gastaste de más' : `${formatMoney(b.left)} disponibles`}
                                                </p>
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                                <DeleteBudgetButton id={b.id} />
                                                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Asignado: {formatMoney(b.limit)}</span>
                                            </div>
                                        </div>

                                        {/* Barra de Progreso Matemática */}
                                        <div style={{ width: '100%', backgroundColor: 'var(--bg-main)', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                                            <div style={{
                                                width: `${progress}%`,
                                                height: '100%',
                                                backgroundColor: isOverBudget ? 'var(--error)' : progress > 80 ? 'var(--accent-primary)' : 'var(--success)',
                                                transition: 'width 0.3s ease'
                                            }} />
                                        </div>

                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                                            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Gastado: {formatMoney(b.spent)}</span>
                                            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 'bold' }}>{progress.toFixed(0)}% Consumido</span>
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
