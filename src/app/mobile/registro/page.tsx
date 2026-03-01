'use client';

import { useActionState, useState } from 'react';
import { register } from '@/actions/auth';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';

export default function RegisterPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [error, formAction, isPending] = useActionState(async (prevState: any, formData: FormData) => {
        try {
            const res = await register(formData);
            if (res?.error) return res.error;
            if (res?.success) {
                window.location.href = '/';
            }
            return null;
        } catch (err: any) {
            return "Ocurrió un error inesperado al conectar.";
        }
    }, null);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', padding: '2rem', height: '100vh', justifyContent: 'center', backgroundColor: 'var(--bg-main)' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>Crear Cuenta</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Comienza a trackear tu patrimonio</p>
            </div>

            <form action={formAction} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <input
                    name="name"
                    type="text"
                    placeholder="Tu Nombre (Ej. Javier)"
                    style={{ padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)' }}
                    required
                />
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
                        placeholder="Contraseña (+10 carácteres, mayúscula y especial)"
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

                <div style={{ position: 'relative' }}>
                    <input
                        name="confirmPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="Confirmar Contraseña"
                        style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)' }}
                        required
                    />
                </div>

                {error && <p style={{ color: 'var(--error)', fontSize: '0.85rem' }}>{error}</p>}

                <button
                    disabled={isPending}
                    style={{ padding: '1rem', borderRadius: '8px', border: 'none', background: 'var(--text-primary)', color: 'var(--bg-main)', fontWeight: 600, marginTop: '0.5rem' }}
                >
                    {isPending ? 'Creando cuenta...' : 'Confirmar y Entrar'}
                </button>
            </form>

            <p style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--text-secondary)' }}>
                ¿Ya tienes cuenta? <Link href="/login" style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Inicia sesión</Link>
            </p>
        </div>
    );
}
