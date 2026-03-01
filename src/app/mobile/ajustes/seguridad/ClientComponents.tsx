'use client';

import { useActionState, useState } from 'react';
import { changePassword } from '@/actions/security';
import styles from '../page.module.css';

export function ChangePasswordForm() {
    const [state, action, isPending] = useActionState(changePassword, null);

    return (
        <div className={styles.settingsGroup} style={{ gap: '1rem', marginTop: '2rem' }}>
            <h3 className={styles.groupTitle}>Cambiar Contraseña</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem', backgroundColor: 'var(--bg-surface)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <form action={action} style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                    <input
                        type="password"
                        name="currentPassword"
                        placeholder="Contraseña Actual"
                        required
                        style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid var(--border-subtle)', background: 'var(--bg-main)', color: 'white' }}
                    />

                    <input
                        type="password"
                        name="newPassword"
                        placeholder="Nueva Contraseña"
                        required
                        style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid var(--border-subtle)', background: 'var(--bg-main)', color: 'white' }}
                    />

                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirmar Nueva Contraseña"
                        required
                        style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid var(--border-subtle)', background: 'var(--bg-main)', color: 'white' }}
                    />

                    <button
                        disabled={isPending}
                        type="submit"
                        style={{ padding: '0.8rem', borderRadius: '6px', border: 'none', background: 'var(--accent-primary)', color: 'white', fontWeight: 'bold', marginTop: '0.5rem' }}
                    >
                        {isPending ? 'Actualizando...' : 'Actualizar Contraseña'}
                    </button>
                </form>

                {state?.error && <p style={{ color: 'var(--error)', fontSize: '0.85rem' }}>{state.error}</p>}
                {state?.success && <p style={{ color: 'var(--success)', fontSize: '0.85rem' }}>{state.message}</p>}
            </div>
        </div>
    );
}

export function SecurityToggles() {
    const [biometrics, setBiometrics] = useState(false);
    const [telemetry, setTelemetry] = useState(true);

    return (
        <div className={styles.settingsGroup} style={{ gap: '1rem' }}>
            <h3 className={styles.groupTitle}>Opciones de Privacidad</h3>

            <div style={{ padding: '1rem', backgroundColor: 'var(--bg-surface)', borderRadius: '8px', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <p style={{ fontWeight: '600', color: 'var(--text-primary)', margin: 0 }}>Autenticación Biométrica</p>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>Usar huella dactilar o Face ID para abrir la app.</p>
                    </div>
                    <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                        <input type="checkbox" checked={biometrics} onChange={(e) => setBiometrics(e.target.checked)} style={{ width: '20px', height: '20px', accentColor: 'var(--accent-primary)' }} />
                    </label>
                </div>

                <hr style={{ border: 'none', borderTop: '1px solid var(--border-subtle)', margin: '0.5rem 0' }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <p style={{ fontWeight: '600', color: 'var(--text-primary)', margin: 0 }}>Compartir Analíticas</p>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>Enviar datos anónimos de errores para mejorar RoNa.</p>
                    </div>
                    <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                        <input type="checkbox" checked={telemetry} onChange={(e) => setTelemetry(e.target.checked)} style={{ width: '20px', height: '20px', accentColor: 'var(--accent-primary)' }} />
                    </label>
                </div>
            </div>
        </div>
    );
}
