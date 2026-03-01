'use client';

import { useActionState, useState } from 'react';
import { createWorkspace, joinWorkspace } from '@/actions/workspaces';
import { createAccount } from '@/actions/accounts';
import { logout } from '@/actions/auth';
import { LogOut, Users, PlusCircle, CreditCard, Copy } from 'lucide-react';
import styles from './page.module.css';

// ==========================================
// 1. CERRAR SESIÓN
// ==========================================
export function LogoutButton() {
    return (
        <button onClick={() => logout()} className={styles.logoutBtn}>
            <LogOut size={20} />
            <span className={styles.logoutText}>Cerrar Sesión</span>
        </button>
    );
}

// ==========================================
// 2. GESTIÓN DE FAMILIA (WORKSPACES)
// ==========================================
export function WorkspaceManager({ activeInviteCode }: { activeInviteCode: string | null }) {
    const [createState, createAction, isCreating] = useActionState(createWorkspace, null);
    const [joinState, joinAction, isJoining] = useActionState(joinWorkspace, null);

    const copyCode = () => {
        if (activeInviteCode) {
            navigator.clipboard.writeText(activeInviteCode);
            alert("¡Código copiado al portapapeles!");
        }
    };

    return (
        <div className={styles.settingsGroup} style={{ gap: '1rem' }}>
            <h3 className={styles.groupTitle}>Mi Familia (Workspace)</h3>

            {activeInviteCode && (
                <div style={{ padding: '1rem', backgroundColor: 'var(--bg-surface)', borderRadius: '8px', border: '1px solid var(--accent-primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Código de Invitación de Familia:</p>
                        <p style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--accent-primary)', letterSpacing: '2px' }}>{activeInviteCode}</p>
                    </div>
                    <button onClick={copyCode} style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}>
                        <Copy size={20} />
                    </button>
                </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem', backgroundColor: 'var(--bg-surface)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <h4 style={{ fontSize: '1rem', margin: 0 }}>Crear Nueva Familia</h4>
                <form action={createAction} style={{ display: 'flex', gap: '0.5rem' }}>
                    <input type="text" name="name" placeholder="Ej. Familia Gómez" required style={{ flex: 1, padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-subtle)', background: 'var(--bg-main)', color: 'white' }} />
                    <button disabled={isCreating} type="submit" style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: 'none', background: 'var(--accent-primary)', color: 'white', fontWeight: 'bold' }}>
                        {isCreating ? '...' : <PlusCircle size={18} />}
                    </button>
                </form>
                {createState?.error && <p style={{ color: 'var(--error)', fontSize: '0.8rem' }}>{createState.error}</p>}
                {createState?.success && <p style={{ color: 'var(--success)', fontSize: '0.8rem' }}>{createState.message}</p>}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem', backgroundColor: 'var(--bg-surface)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <h4 style={{ fontSize: '1rem', margin: 0 }}>Unirse con Código</h4>
                <form action={joinAction} style={{ display: 'flex', gap: '0.5rem' }}>
                    <input type="text" name="inviteCode" placeholder="RONA-XXXXXX" required style={{ flex: 1, padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-subtle)', background: 'var(--bg-main)', color: 'white' }} />
                    <button disabled={isJoining} type="submit" style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: 'none', background: 'var(--text-primary)', color: 'var(--bg-main)', fontWeight: 'bold' }}>
                        {isJoining ? '...' : <Users size={18} />}
                    </button>
                </form>
                {joinState?.error && <p style={{ color: 'var(--error)', fontSize: '0.8rem' }}>{joinState.error}</p>}
                {joinState?.success && <p style={{ color: 'var(--success)', fontSize: '0.8rem' }}>{joinState.message}</p>}
            </div>
        </div>
    );
}

// ==========================================
// 3. CREACIÓN DE CUENTAS (BANCOS/BILLETERAS)
// ==========================================
export function AccountManager() {
    const [state, action, isPending] = useActionState(createAccount, null);

    return (
        <div className={styles.settingsGroup} style={{ gap: '1rem' }}>
            <h3 className={styles.groupTitle}>Gestión de Cuentas (Billeteras y Bancos)</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem', backgroundColor: 'var(--bg-surface)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <form action={action} style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                    <input type="text" name="name" placeholder="Nombre (Ej. MercadoPago)" required style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid var(--border-subtle)', background: 'var(--bg-main)', color: 'white' }} />

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <select name="type" required style={{ flex: 1, padding: '0.8rem', borderRadius: '6px', border: '1px solid var(--border-subtle)', background: 'var(--bg-main)', color: 'white' }}>
                            <option value="BANK">Banco</option>
                            <option value="E-WALLET">Billetera Virtual</option>
                            <option value="CASH">Efectivo</option>
                        </select>
                        <select name="currency" required style={{ width: '80px', padding: '0.8rem', borderRadius: '6px', border: '1px solid var(--border-subtle)', background: 'var(--bg-main)', color: 'white' }}>
                            <option value="ARS">ARS</option>
                            <option value="USD">USD</option>
                        </select>
                    </div>

                    <input type="number" step="0.01" name="balance" placeholder="Saldo Inicial (Opcional)" style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid var(--border-subtle)', background: 'var(--bg-main)', color: 'white' }} />

                    <button disabled={isPending} type="submit" style={{ padding: '0.8rem', borderRadius: '6px', border: 'none', background: 'var(--accent-primary)', color: 'white', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
                        {isPending ? 'Creando...' : <><CreditCard size={18} /> Agregar Cuenta</>}
                    </button>
                </form>
                {state?.error && <p style={{ color: 'var(--error)', fontSize: '0.8rem' }}>{state.error}</p>}
                {state?.success && <p style={{ color: 'var(--success)', fontSize: '0.8rem' }}>{state.message}</p>}
            </div>
        </div>
    );
}
