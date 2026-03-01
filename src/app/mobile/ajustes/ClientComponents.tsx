'use client';

import { useActionState, useState } from 'react';
import { createWorkspace, joinWorkspace } from '@/actions/workspaces';
import { createAccount, editAccount } from '@/actions/accounts';
import { logout } from '@/actions/auth';
import { LogOut, Users, PlusCircle, CreditCard, Copy, Pencil, Save, X } from 'lucide-react';
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
export function AccountManager({ accounts }: { accounts: any[] }) {
    const [state, action, isPending] = useActionState(createAccount, null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editState, editAction, isEditing] = useActionState(editAccount, null);

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
                            <option value="CREDIT_CARD">Tarjeta de Crédito</option>
                            <option value="DEBT">Préstamo / Deuda</option>
                        </select>
                        <select name="currency" required style={{ width: '80px', padding: '0.8rem', borderRadius: '6px', border: '1px solid var(--border-subtle)', background: 'var(--bg-main)', color: 'white' }}>
                            <option value="ARS">ARS</option>
                            <option value="USD">USD</option>
                        </select>
                    </div>

                    <input type="number" step="any" name="balance" placeholder="Saldo Inicial (Opcional)" style={{ padding: '0.8rem', borderRadius: '6px', border: '1px solid var(--border-subtle)', background: 'var(--bg-main)', color: 'white' }} />

                    <button disabled={isPending} type="submit" style={{ padding: '0.8rem', borderRadius: '6px', border: 'none', background: 'var(--accent-primary)', color: 'white', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
                        {isPending ? 'Creando...' : <><CreditCard size={18} /> Agregar Cuenta</>}
                    </button>
                </form>
                {state?.error && <p style={{ color: 'var(--error)', fontSize: '0.8rem' }}>{state.error}</p>}
                {state?.success && <p style={{ color: 'var(--success)', fontSize: '0.8rem' }}>{state.message}</p>}
            </div>

            {/* List and Editor */}
            {accounts?.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginTop: '1rem' }}>
                    <h4 style={{ fontSize: '1rem', margin: 0, color: 'var(--text-secondary)' }}>Tus Cuentas Activas</h4>
                    {accounts.map(acc => (
                        <div key={acc.id} style={{ backgroundColor: 'var(--bg-surface)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                            {editingId === acc.id ? (
                                <form action={(formData) => { editAction(formData); setEditingId(null); }} style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                    <input type="hidden" name="accountId" value={acc.id} />
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <p style={{ margin: 0, fontWeight: 'bold' }}>Editando: {acc.type}</p>
                                        <button type="button" onClick={() => setEditingId(null)} style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer' }}><X size={18} /></button>
                                    </div>
                                    <input type="text" name="name" defaultValue={acc.name} placeholder="Nuevo Nombre" required style={{ padding: '0.6rem', borderRadius: '6px', border: '1px solid var(--border-subtle)', background: 'var(--bg-main)', color: 'white' }} />
                                    <input type="number" step="any" name="balance" defaultValue={acc.balance < 0 ? acc.balance * -1 : acc.balance} placeholder="Nuevo Saldo (Sin -)" required style={{ padding: '0.6rem', borderRadius: '6px', border: '1px solid var(--border-subtle)', background: 'var(--bg-main)', color: 'white' }} />
                                    <button disabled={isEditing} type="submit" style={{ padding: '0.6rem', borderRadius: '6px', border: 'none', background: 'var(--success)', color: 'white', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
                                        {isEditing ? 'Guardando...' : <><Save size={16} /> Guardar Cambios</>}
                                    </button>
                                </form>
                            ) : (
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <p style={{ margin: 0, fontWeight: 'bold', fontSize: '1rem' }}>{acc.name}</p>
                                        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Saldo: {acc.currency === 'USD' ? 'u$d' : '$'}{acc.balance}</p>
                                    </div>
                                    <button onClick={() => setEditingId(acc.id)} style={{ background: 'var(--bg-main)', border: '1px solid var(--border-subtle)', padding: '0.5rem', borderRadius: '6px', color: 'var(--text-primary)', cursor: 'pointer' }}>
                                        <Pencil size={16} />
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
