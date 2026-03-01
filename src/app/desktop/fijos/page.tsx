import { getRecurringTransactions, toggleRecurringTransaction, deleteRecurringTransaction } from '@/actions/recurring';
import { RecurringTransactionForm } from '../../mobile/fijos/ClientComponents';
import { Calendar, PlayCircle, PauseCircle, Trash2, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function FijosDesktop() {
    const events = await getRecurringTransactions();

    const activeTotalExpensesArs = events.filter(e => e.isActive && e.type === 'EXPENSE' && e.currency === 'ARS').reduce((sum, e) => sum + e.amount, 0);
    const activeTotalIncomesArs = events.filter(e => e.isActive && e.type === 'INCOME' && e.currency === 'ARS').reduce((sum, e) => sum + e.amount, 0);

    const formatMoney = (val: number, currency = 'ARS') =>
        currency === 'USD'
            ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(val)
            : new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0 }).format(val);

    return (
        <div>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.5rem', margin: '0 0 0.2rem 0', fontWeight: '700' }}>Agenda Automática</h1>
                    <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.9rem' }}>Sueldos fijos, suscripciones y agenda</p>
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '1.5rem' }}>

                {/* Left Column (8 cols): Agenda Map */}
                <div style={{ gridColumn: 'span 8', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                    {/* Summary Impact */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div style={{ backgroundColor: 'var(--bg-surface)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                            <p style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: '600', margin: '0 0 0.5rem 0' }}>
                                <ArrowUpRight size={16} color="var(--success)" /> Ingreso Fijo Proyectado Mensual
                            </p>
                            <p style={{ color: 'var(--success)', fontSize: '2rem', fontWeight: '800', margin: 0 }}>{formatMoney(activeTotalIncomesArs)}</p>
                        </div>
                        <div style={{ backgroundColor: 'var(--bg-surface)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                            <p style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: '600', margin: '0 0 0.5rem 0' }}>
                                <ArrowDownLeft size={16} color="var(--error)" /> Compromiso Fijo Mensual
                            </p>
                            <p style={{ color: 'var(--error)', fontSize: '2rem', fontWeight: '800', margin: 0 }}>{formatMoney(activeTotalExpensesArs)}</p>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0.3rem 0 0 0' }}>
                                Total {events.filter(e => e.isActive).length} operaciones auto.
                            </p>
                        </div>
                    </div>

                    {/* Timeline List */}
                    <div style={{ backgroundColor: 'var(--bg-surface)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                        <h2 style={{ fontSize: '1.1rem', fontWeight: '600', margin: '0 0 1.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Calendar size={20} /> Línea de Tiempo
                        </h2>

                        {events.length === 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '3rem 0', color: 'var(--text-secondary)' }}>
                                <Calendar size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                                <p style={{ fontWeight: '500', margin: '0 0 0.5rem 0' }}>No tienes eventos recurrentes aún.</p>
                                <span style={{ fontSize: '0.9rem' }}>Agenda tu salario, alquiler o internet en el panel lateral.</span>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {events.map((evt) => (
                                    <div key={evt.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'var(--bg-main)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-subtle)', borderLeft: `6px solid ${evt.type === 'INCOME' ? 'var(--success)' : 'var(--error)'}`, opacity: evt.isActive ? 1 : 0.6 }}>

                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '40px' }}>
                                                <span style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-primary)', lineHeight: 1 }}>{evt.dayOfMonth}</span>
                                                <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: '600', letterSpacing: '0.05em', marginTop: '0.2rem' }}>Día</span>
                                            </div>

                                            <div style={{ width: '1px', height: '30px', backgroundColor: 'var(--border-subtle)' }}></div>

                                            <div>
                                                <p style={{ fontWeight: '700', fontSize: '1rem', color: 'var(--text-primary)', margin: '0 0 0.2rem 0' }}>{evt.name}</p>
                                                <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
                                                    {evt.category}
                                                    <span style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem', borderRadius: '4px', backgroundColor: 'var(--bg-surface)', fontWeight: '600' }}>{evt.frequency}</span>
                                                </p>
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                            <span style={{ fontSize: '1.1rem', fontWeight: '700', color: evt.type === 'INCOME' ? 'var(--success)' : 'var(--error)' }}>
                                                {evt.type === 'INCOME' ? '+' : '-'}{formatMoney(evt.amount, evt.currency)}
                                            </span>

                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <form action={async () => { "use server"; await toggleRecurringTransaction(evt.id, evt.isActive); }}>
                                                    <button type="submit" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '6px', padding: '0.5rem', cursor: 'pointer', color: 'var(--text-primary)', display: 'flex', justifyContent: 'center' }} title={evt.isActive ? "Pausar mes" : "Activar"}>
                                                        {evt.isActive ? <PauseCircle size={18} /> : <PlayCircle size={18} />}
                                                    </button>
                                                </form>
                                                <form action={async () => { "use server"; await deleteRecurringTransaction(evt.id); }}>
                                                    <button type="submit" style={{ background: 'var(--error-muted)', border: 'none', borderRadius: '6px', padding: '0.5rem', cursor: 'pointer', color: 'var(--error)', display: 'flex', justifyContent: 'center' }}>
                                                        <Trash2 size={18} />
                                                    </button>
                                                </form>
                                            </div>
                                        </div>

                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column (4 cols): Agenda Form */}
                <div style={{ gridColumn: 'span 4' }}>
                    <div style={{ backgroundColor: 'var(--bg-surface)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-subtle)', position: 'sticky', top: '2rem' }}>
                        <h2 style={{ fontSize: '1.1rem', fontWeight: '600', margin: '0 0 1rem 0' }}>Agregar Evento</h2>
                        <RecurringTransactionForm />
                    </div>
                </div>

            </div>
        </div>
    );
}
