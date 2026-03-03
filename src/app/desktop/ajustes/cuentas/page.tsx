import { AccountManager } from '../../../mobile/ajustes/ClientComponents';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { getAccounts } from '@/actions/transaction';

export default async function DesktopCuentasPage() {
    const accounts = await getAccounts();
    return (
        <div>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.75rem', margin: '0 0 0.3rem 0', fontWeight: '800', letterSpacing: '-0.02em' }}>Gestión de Cuentas</h1>
                    <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.95rem' }}>Bancos, billeteras virtuales y efectivo</p>
                </div>

                <Link
                    href="/desktop"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.6rem 1rem',
                        borderRadius: '10px',
                        border: '1px solid #eee',
                        backgroundColor: '#fff',
                        color: 'var(--text-primary)',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        textDecoration: 'none',
                        transition: 'all 0.2s ease'
                    }}
                >
                    <ChevronLeft size={18} />
                    <span>Volver al Dashboard</span>
                </Link>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '1.5rem' }}>
                <div style={{ gridColumn: 'span 8', backgroundColor: 'var(--bg-surface)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                    <AccountManager accounts={accounts} />
                </div>
            </div>
        </div>
    );
}
