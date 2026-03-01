'use client';

import { useActionState, useRef } from 'react';
import { addInvestment, deleteInvestment } from '@/actions/investment';
import { PlusCircle, Loader2, Trash2, LineChart } from 'lucide-react';

export function InvestmentForm() {
    const formRef = useRef<HTMLFormElement>(null);
    const [state, action, isPending] = useActionState(async (prevState: any, formData: FormData) => {
        try {
            await addInvestment(formData);
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
                    <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Activo / Ticker</label>
                    <input type="text" name="name" placeholder="Ej. SPY, AAPL, Plazo Fijo" required style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-main)', color: 'white', marginTop: '0.3rem' }} />
                </div>
                <div style={{ flex: 2 }}>
                    <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Plataforma / Broker</label>
                    <input type="text" name="platform" placeholder="Ej. Balanz, Binance" required style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-main)', color: 'white', marginTop: '0.3rem' }} />
                </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Moneda</label>
                    <select name="currency" required style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-main)', color: 'white', marginTop: '0.3rem' }}>
                        <option value="USD">USD (U$D)</option>
                        <option value="ARS">ARS ($)</option>
                    </select>
                </div>
                <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Capital Inicial</label>
                    <input type="number" name="invested" min="0" step="0.01" placeholder="Monto invertido..." required style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-main)', color: 'white', marginTop: '0.3rem' }} />
                </div>
                <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Valor Actual (Opt.)</label>
                    <input type="number" name="currentVal" min="0" step="0.01" placeholder="Cotización hoy..." style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-main)', color: 'white', marginTop: '0.3rem' }} />
                </div>
            </div>

            {state?.error && <p style={{ color: 'var(--error)', fontSize: '0.9rem', marginTop: '0.5rem' }}>{state.error}</p>}

            <button disabled={isPending} type="submit" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', width: '100%', padding: '1rem', borderRadius: '8px', border: 'none', background: 'var(--success)', color: 'white', fontWeight: 'bold', fontSize: '1rem', marginTop: '0.5rem', cursor: 'pointer' }}>
                {isPending ? <Loader2 size={20} className="animate-spin" /> : <LineChart size={20} />}
                {isPending ? 'Agregando Activo...' : 'Añadir Inversión al Portafolio'}
            </button>
        </form>
    );
}

export function DeleteInvestmentButton({ id }: { id: string }) {
    return (
        <form action={async () => { await deleteInvestment(id); }}>
            <button type="submit" style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '0.5rem' }}>
                <Trash2 size={18} />
            </button>
        </form>
    );
}
