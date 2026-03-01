import styles from './page.module.css';
import { getRecurringTransactions, toggleRecurringTransaction, deleteRecurringTransaction } from '@/actions/recurring';
import { RecurringTransactionForm } from './ClientComponents';
import { Calendar, PlayCircle, PauseCircle, Trash2, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function FijosPage() {
    const events = await getRecurringTransactions();

    // Calculamos cuánto impacto mensual tenemos por tipo
    const activeTotalExpensesArs = events.filter(e => e.isActive && e.type === 'EXPENSE' && e.currency === 'ARS').reduce((sum, e) => sum + e.amount, 0);
    const activeTotalIncomesArs = events.filter(e => e.isActive && e.type === 'INCOME' && e.currency === 'ARS').reduce((sum, e) => sum + e.amount, 0);

    const activeTotalExpensesUsd = events.filter(e => e.isActive && e.type === 'EXPENSE' && e.currency === 'USD').reduce((sum, e) => sum + e.amount, 0);
    const activeTotalIncomesUsd = events.filter(e => e.isActive && e.type === 'INCOME' && e.currency === 'USD').reduce((sum, e) => sum + e.amount, 0);

    const formatMoney = (val: number, currency = 'ARS') =>
        currency === 'USD'
            ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(val)
            : new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0 }).format(val);

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Agenda Automática</h1>
                <p className={styles.subtitle}>Tus sueldos, suscripciones y pagos recurrentes</p>
            </header>

            <main className={styles.mainContent}>
                {/* 1. Dashboard de Costo Fijo y Sueldos */}
                <section className={styles.summaryCard} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                    <div className={styles.summaryInfo}>
                        <p className={styles.summaryLabel} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)' }}>
                            <ArrowUpRight size={16} color="var(--success)" /> Ingreso Fijo Proyectado (ARS)
                        </p>
                        <p className={styles.summaryAmount} style={{ color: 'var(--success)' }}>{formatMoney(activeTotalIncomesArs)}</p>
                    </div>

                    <div className={styles.summaryInfo}>
                        <p className={styles.summaryLabel} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)' }}>
                            <ArrowDownLeft size={16} color="var(--error)" /> Compromiso y Suscripciones (ARS)
                        </p>
                        <p className={styles.summaryAmount} style={{ color: 'var(--error)' }}>{formatMoney(activeTotalExpensesArs)}</p>
                        <p className={styles.summaryHelper}>
                            {events.length} operaciones agendas ({events.filter(e => e.isActive).length} activas mensuales)
                        </p>
                    </div>
                </section>

                {/* 2. Formulario Rápido */}
                <section className={styles.actionSection}>
                    <h2 className={styles.sectionTitle}>Agregar Evento Calendario</h2>
                    <RecurringTransactionForm />
                </section>

                {/* 3. Lista o Calendario de Fijos */}
                <section className={styles.listSection}>
                    <h2 className={styles.sectionTitle}>Línea de Tiempo Mensual</h2>

                    {events.length === 0 ? (
                        <div className={styles.emptyState}>
                            <Calendar size={48} className={styles.emptyIcon} />
                            <p>No tienes eventos recurrentes aún.</p>
                            <span>Agenda tu salario, alquiler o internet.</span>
                        </div>
                    ) : (
                        <div className={styles.timeline}>
                            {events.map((evt) => (
                                <div key={evt.id} className={`${styles.timelineItem} ${!evt.isActive ? styles.inactiveItem : ''}`} style={{ borderLeft: `4px solid ${evt.type === 'INCOME' ? 'var(--success)' : 'var(--error)'}` }}>
                                    <div className={styles.dayCol}>
                                        <span className={styles.dayNumber}>{evt.dayOfMonth}</span>
                                        <span className={styles.dayLabel}>Día</span>
                                    </div>

                                    <div className={styles.infoCol}>
                                        <p className={styles.expenseName}>{evt.name}</p>
                                        <p className={styles.expenseCategory} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                            {evt.category} <span style={{ fontSize: '0.7rem', padding: '0.1rem 0.5rem', borderRadius: '8px', backgroundColor: 'var(--bg-main)' }}>{evt.frequency}</span>
                                        </p>
                                    </div>

                                    <div className={styles.actionCol}>
                                        <p className={styles.expenseAmount} style={{ color: evt.type === 'INCOME' ? 'var(--success)' : 'var(--error)' }}>
                                            {evt.type === 'INCOME' ? '+' : '-'}{formatMoney(evt.amount, evt.currency)}
                                        </p>
                                        <div className={styles.buttonGroup}>
                                            <form action={async () => { "use server"; await toggleRecurringTransaction(evt.id, evt.isActive); }}>
                                                <button type="submit" className={styles.iconBtn} title={evt.isActive ? "Pausar mes" : "Activar"}>
                                                    {evt.isActive ? <PauseCircle size={18} className={styles.iconPause} /> : <PlayCircle size={18} className={styles.iconPlay} />}
                                                </button>
                                            </form>
                                            <form action={async () => { "use server"; await deleteRecurringTransaction(evt.id); }}>
                                                <button type="submit" className={styles.iconBtn}><Trash2 size={18} className={styles.iconTrash} /></button>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}
