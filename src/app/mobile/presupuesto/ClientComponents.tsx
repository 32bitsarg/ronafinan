'use client';

import { useActionState, useRef } from 'react';
import { addBudget, deleteBudget } from '@/actions/budget';
import { PlusCircle, Loader2, Trash2, PieChart } from 'lucide-react';

export function BudgetForm() {
    const formRef = useRef<HTMLFormElement>(null);
    const [state, action, isPending] = useActionState(async (prevState: any, formData: FormData) => {
        try {
            await addBudget(formData);
            formRef.current?.reset();
            return { success: true };
        } catch (e: any) {
            return { error: e.message };
        }
    }, null);

    return (
        <form ref={formRef} action={action} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', backgroundColor: 'var(--bg-surface)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ flex: 2 }}>
                    <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Categoría del Sobre</label>
                    <input type="text" name="category" placeholder="Ej. Supermercado, Alquiler" required style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-main)', color: 'white', marginTop: '0.3rem' }} />
                </div>
                <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Asignar ($)</label>
                    <input type="number" name="limit" min="1" step="0.01" placeholder="Ej. 50000" required style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-main)', color: 'white', marginTop: '0.3rem' }} />
                </div>
            </div>

            {state?.error && <p style={{ color: 'var(--error)', fontSize: '0.9rem', marginTop: '0.5rem' }}>{state.error}</p>}

            <button disabled={isPending} type="submit" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', width: '100%', padding: '1rem', borderRadius: '8px', border: 'none', background: 'var(--accent-primary)', color: 'white', fontWeight: 'bold', fontSize: '1rem', marginTop: '0.5rem', cursor: 'pointer' }}>
                {isPending ? <Loader2 size={20} className="animate-spin" /> : <PlusCircle size={20} />}
                {isPending ? 'Creando Sobre...' : 'Crear Sobre Virtual'}
            </button>
        </form>
    );
}

export function DeleteBudgetButton({ id }: { id: string }) {
    return (
        <form action={async () => { await deleteBudget(id); }}>
            <button type="submit" style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '0.5rem' }}>
                <Trash2 size={18} />
            </button>
        </form>
    );
}
