import { SecurityToggles, ChangePasswordForm } from '../../../mobile/ajustes/seguridad/ClientComponents';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default async function DesktopSeguridadPage() {
    return (
        <div>
            <header style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <Link href="/desktop/ajustes" style={{ color: 'var(--text-primary)' }}>
                    <ArrowLeft size={28} />
                </Link>
                <div>
                    <h1 style={{ fontSize: '1.5rem', margin: '0 0 0.2rem 0', fontWeight: '700' }}>Privacidad y Seguridad</h1>
                    <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.9rem' }}>Contraseñas y control de tu cuenta</p>
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '1.5rem' }}>
                <div style={{ gridColumn: 'span 8', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ backgroundColor: 'var(--bg-surface)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                        <SecurityToggles />
                    </div>
                    <div style={{ backgroundColor: 'var(--bg-surface)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                        <ChangePasswordForm />
                    </div>
                </div>
            </div>
        </div>
    );
}
