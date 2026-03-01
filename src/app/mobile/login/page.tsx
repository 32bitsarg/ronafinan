'use client';

import { useActionState, useState } from 'react';
import { login } from '@/actions/auth';
import Link from 'next/link';
import { Wallet, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [error, formAction, isPending] = useActionState(async (prevState: any, formData: FormData) => {
        try {
            const res = await login(formData);
            if (res?.success) {
                window.location.href = '/';
            }
            return null;
        } catch (err: any) {
            return err.message;
        }
    }, null);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', padding: '2rem', height: '100vh', justifyContent: 'center', backgroundColor: 'var(--bg-main)' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <div style={{ display: 'inline-flex', backgroundColor: 'var(--text-primary)', color: 'var(--bg-main)', padding: '12px', borderRadius: '50%', marginBottom: '1rem' }}>
                    <Wallet size={32} />
                </div>
                <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>RoNa Finance</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Tu gestor de riqueza de nivel Wall Street.</p>
            </div>

            <form action={formAction} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <input
                    name="email"
                    type="email"
                    placeholder="Correo Electrónico"
                    style={{ padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)' }}
                    required
                />
                <div style={{ position: 'relative' }}>
                    <input
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Contraseña"
                        style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)' }}
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{ position: 'absolute', right: '1rem', top: '1rem', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
                    >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>

                {error && <p style={{ color: 'var(--error)', fontSize: '0.85rem' }}>{error}</p>}

                <button
                    disabled={isPending}
                    style={{ padding: '1rem', borderRadius: '8px', border: 'none', background: 'var(--accent-primary)', color: '#fff', fontWeight: 600, marginTop: '0.5rem' }}
                >
                    {isPending ? 'Ingresando...' : 'Iniciar Sesión'}
                </button>
            </form>

            <p style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--text-secondary)' }}>
                ¿No tienes cuenta? <Link href="/registro" style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>Regístrate aquí</Link>
            </p>
        </div>
    );
}
