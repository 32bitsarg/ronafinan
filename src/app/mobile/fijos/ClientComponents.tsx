'use client';

import { useActionState, useRef } from 'react';
import { addRecurringTransaction } from '@/actions/recurring';
import { PlusCircle, Loader2 } from 'lucide-react';
import styles from './page.module.css'; // Optional CSS mapping, standardizes UI

export function RecurringTransactionForm() {
    const formRef = useRef<HTMLFormElement>(null);
    // useActionState requires the updated syntax for Next.js 15
    const [state, action, isPending] = useActionState(async (prevState: any, formData: FormData) => {
        try {
            await addRecurringTransaction(formData);
            formRef.current?.reset();
            return { success: true };
        } catch (e: any) {
            return { error: e.message };
        }
    }, null);

    return (
        <form ref={formRef} action={action} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', backgroundColor: 'var(--bg-surface)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Tipo de Evento</label>
                    <select name="type" required style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-main)', color: 'white', marginTop: '0.3rem' }}>
                        <option value="EXPENSE">Gasto / Suscripción</option>
                        <option value="INCOME">Ingreso Fijo (Ej. Sueldo)</option>
                    </select>
                </div>
                <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Frecuencia</label>
                    <select name="frequency" required style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-main)', color: 'white', marginTop: '0.3rem' }}>
                        <option value="MONTHLY">Mensual</option>
                        <option value="WEEKLY" disabled>Semanal (Próximamente)</option>
                        <option value="DAILY" disabled>Diario (Próximamente)</option>
                    </select>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 2 }}>
                    <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Nombre de Referencia</label>
                    <input type="text" name="name" placeholder="Ej. Netflix, Gimnasio, Sueldo Globant" required style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-main)', color: 'white', marginTop: '0.3rem' }} />
                </div>
                <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Categoría</label>
                    <input type="text" name="category" placeholder="Streaming, Salud..." required style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-main)', color: 'white', marginTop: '0.3rem' }} />
                </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Día del Mes</label>
                    <input type="number" name="dayOfMonth" min="1" max="31" placeholder="Ej. 5" required style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-main)', color: 'white', marginTop: '0.3rem' }} />
                </div>
                <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Moneda</label>
                    <select name="currency" required style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-main)', color: 'white', marginTop: '0.3rem' }}>
                        <option value="ARS">ARS ($)</option>
                        <option value="USD">USD (U$D)</option>
                    </select>
                </div>
                <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Monto Fijo</label>
                    <input type="number" name="amount" min="1" step="0.01" placeholder="Ej. 10000" required style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-main)', color: 'white', marginTop: '0.3rem' }} />
                </div>
            </div>

            {state?.error && <p style={{ color: 'var(--error)', fontSize: '0.9rem', marginTop: '0.5rem' }}>{state.error}</p>}

            <button disabled={isPending} type="submit" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', width: '100%', padding: '1rem', borderRadius: '8px', border: 'none', background: 'var(--accent-primary)', color: 'white', fontWeight: 'bold', fontSize: '1rem', marginTop: '1rem', cursor: 'pointer' }}>
                {isPending ? <Loader2 size={20} className="animate-spin" /> : <PlusCircle size={20} />}
                {isPending ? 'Guardando Agenda...' : 'Añadir al Calendario Automático'}
            </button>
        </form>
    );
}
