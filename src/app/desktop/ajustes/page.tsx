import {
    User,
    Bell,
    Shield,
    Smartphone,
    DatabaseBackup,
    ChevronRight,
    CreditCard,
    Users
} from 'lucide-react';
import { getSession } from '@/actions/auth';
import { LogoutButton } from '../../mobile/ajustes/ClientComponents';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AjustesDesktop() {
    const user = await getSession();

    return (
        <div>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.5rem', margin: '0 0 0.2rem 0', fontWeight: '700' }}>Ajustes de Plataforma</h1>
                    <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.9rem' }}>Configuraciones, cuentas y preferencias</p>
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '1.5rem' }}>

                {/* Left Column (8 cols): Main Settings */}
                <div style={{ gridColumn: 'span 8', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                    {/* Perfil */}
                    <div style={{ backgroundColor: 'var(--bg-surface)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <div style={{ padding: '1.2rem', backgroundColor: 'var(--bg-main)', borderRadius: '50%', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)' }}>
                            <User size={40} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', margin: '0 0 0.2rem 0', color: 'var(--text-primary)' }}>{user.name}</h2>
                            <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.9rem' }}>{user.email}</p>
                        </div>
                        <button style={{ backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', padding: '0.6rem 1.2rem', borderRadius: '6px', fontWeight: '500', cursor: 'pointer', transition: 'background 0.2s' }}>
                            Editar Perfil
                        </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        {/* Menus de Configuración */}
                        <div style={{ backgroundColor: 'var(--bg-surface)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                            <h3 style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--text-secondary)', margin: '0 0 1rem 0' }}>Gestión Patrimonial</h3>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <Link href="/ajustes/familia" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', backgroundColor: 'var(--bg-main)', borderRadius: '8px', textDecoration: 'none', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <Users size={20} color="var(--text-secondary)" />
                                        <span style={{ fontWeight: '500', fontSize: '0.9rem' }}>Mi Familia (Workspace)</span>
                                    </div>
                                    <ChevronRight size={18} color="var(--text-secondary)" />
                                </Link>

                                <Link href="/ajustes/cuentas" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', backgroundColor: 'var(--bg-main)', borderRadius: '8px', textDecoration: 'none', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <CreditCard size={20} color="var(--text-secondary)" />
                                        <span style={{ fontWeight: '500', fontSize: '0.9rem' }}>Mis Bancos y Billeteras</span>
                                    </div>
                                    <ChevronRight size={18} color="var(--text-secondary)" />
                                </Link>
                            </div>
                        </div>

                        {/* Preferencias */}
                        <div style={{ backgroundColor: 'var(--bg-surface)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                            <h3 style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--text-secondary)', margin: '0 0 1rem 0' }}>Datos y Plataforma</h3>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <Link href="/ajustes/seguridad" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', backgroundColor: 'var(--bg-main)', borderRadius: '8px', textDecoration: 'none', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <Shield size={20} color="var(--success)" />
                                        <span style={{ fontWeight: '500', fontSize: '0.9rem' }}>Privacidad Avanzada</span>
                                    </div>
                                    <ChevronRight size={18} color="var(--text-secondary)" />
                                </Link>

                                <a href="/api/exportar" target="_blank" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', backgroundColor: 'var(--bg-main)', borderRadius: '8px', textDecoration: 'none', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <DatabaseBackup size={20} color="var(--accent-primary)" />
                                        <span style={{ fontWeight: '500', fontSize: '0.9rem' }}>Exportar Datos (CSV)</span>
                                    </div>
                                    <ChevronRight size={18} color="var(--text-secondary)" />
                                </a>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Right Column (4 cols): Info Panel */}
                <div style={{ gridColumn: 'span 4' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                        <div style={{ backgroundColor: 'var(--bg-surface)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                            <h3 style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--text-secondary)', margin: '0 0 1rem 0' }}>Estado del Sistema</h3>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                <li style={{ display: 'flex', justifyContent: 'space-between' }}><span>Versión</span> <strong>v0.0.1 Desktop</strong></li>
                                <li style={{ display: 'flex', justifyContent: 'space-between' }}><span>Sincronización API</span> <strong style={{ color: 'var(--success)' }}>En Línea</strong></li>
                                <li style={{ display: 'flex', justifyContent: 'space-between' }}><span>Dólar Blue (API)</span> <strong style={{ color: 'var(--success)' }}>Activo</strong></li>
                                <li style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.8rem', marginTop: '0.5rem' }}>
                                    <span>Workspace ID</span> <strong style={{ fontSize: '0.7rem' }}>{user.activeWorkspaceId?.substring(0, 8)}...</strong>
                                </li>
                            </ul>
                        </div>

                        <div style={{ backgroundColor: 'rgba(255,59,48,0.1)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--error-muted)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                            <p style={{ color: 'var(--error)', margin: '0', fontWeight: '500', fontSize: '0.9rem', textAlign: 'center' }}>¿Terminaste de gestionar tus finanzas?</p>
                            <LogoutButton />
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
}
