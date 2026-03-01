import { AccountManager } from '../../../mobile/ajustes/ClientComponents';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getAccounts } from '@/actions/transaction';

export default async function DesktopCuentasPage() {
    const accounts = await getAccounts();
    return (
        <div>
            <header style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <Link href="/desktop/ajustes" style={{ color: 'var(--text-primary)' }}>
                    <ArrowLeft size={28} />
                </Link>
                <div>
                    <h1 style={{ fontSize: '1.5rem', margin: '0 0 0.2rem 0', fontWeight: '700' }}>Gestión de Cuentas</h1>
                    <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.9rem' }}>Bancos, billeteras virtuales y efectivo</p>
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '1.5rem' }}>
                <div style={{ gridColumn: 'span 8', backgroundColor: 'var(--bg-surface)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                    <AccountManager accounts={accounts} />
                </div>
            </div>
        </div>
    );
}
