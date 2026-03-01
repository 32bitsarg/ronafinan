import styles from './page.module.css';
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
import { LogoutButton } from './ClientComponents';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AjustesPage() {
    const user = await getSession();

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Ajustes</h1>
            </header>

            <main className={styles.mainContent}>
                {/* 1. Perfil de Usuario */}
                <section className={styles.profileSection}>
                    <div className={styles.avatarLarge}>
                        <User size={32} />
                    </div>
                    <div>
                        <h2 className={styles.profileName}>{user.name}</h2>
                        <p className={styles.profileEmail}>{user.email}</p>
                    </div>
                    <button className={styles.editBtn}>Editar</button>
                </section>

                {/* 2. Cuentas y Familias */}
                <div className={styles.settingsGroup}>
                    <h3 className={styles.groupTitle}>Gestión Patrimonial</h3>

                    <Link href="/mobile/ajustes/familia" className={styles.settingItem}>
                        <div className={styles.settingLeft}>
                            <div className={styles.iconWrap}>
                                <Users size={20} className={styles.iconSecondary} />
                            </div>
                            <span>Mi Familia (Workspace)</span>
                        </div>
                        <ChevronRight size={20} className={styles.chevron} />
                    </Link>

                    <Link href="/mobile/ajustes/cuentas" className={styles.settingItem}>
                        <div className={styles.settingLeft}>
                            <div className={styles.iconWrap}>
                                <CreditCard size={20} className={styles.iconSecondary} />
                            </div>
                            <span>Mis Cuentas y Billeteras</span>
                        </div>
                        <ChevronRight size={20} className={styles.chevron} />
                    </Link>
                </div>

                {/* 3. Opciones de Configuración */}
                <div className={styles.settingsGroup}>
                    <h3 className={styles.groupTitle}>Preferencias</h3>

                    <button className={styles.settingItem}>
                        <div className={styles.settingLeft}>
                            <div className={styles.iconWrap}>
                                <Bell size={20} className={styles.iconSecondary} />
                            </div>
                            <span>Notificaciones</span>
                        </div>
                        <ChevronRight size={20} className={styles.chevron} />
                    </button>

                    <button className={styles.settingItem}>
                        <div className={styles.settingLeft}>
                            <div className={styles.iconWrap}>
                                <Smartphone size={20} className={styles.iconSecondary} />
                            </div>
                            <span>Apariencia (Tema)</span>
                        </div>
                        <div className={styles.settingRight}>
                            <span className={styles.settingValue}>Oscuro</span>
                            <ChevronRight size={20} className={styles.chevron} />
                        </div>
                    </button>
                </div>

                <div className={styles.settingsGroup}>
                    <h3 className={styles.groupTitle}>Datos y Seguridad</h3>

                    <Link href="/mobile/ajustes/seguridad" className={styles.settingItem} style={{ textDecoration: 'none' }}>
                        <div className={styles.settingLeft}>
                            <div className={styles.iconWrap}>
                                <Shield size={20} className={styles.iconSecondary} />
                            </div>
                            <span>Privacidad y Seguridad</span>
                        </div>
                        <ChevronRight size={20} className={styles.chevron} />
                    </Link>

                    {/* Agregado Botón Descarga CSV */}
                    <a href="/api/exportar" className={styles.settingItem} style={{ textDecoration: 'none' }} target="_blank">
                        <div className={styles.settingLeft}>
                            <div className={styles.iconWrap}>
                                <DatabaseBackup size={20} className={styles.iconSecondary} />
                            </div>
                            <span>Exportar Datos (CSV)</span>
                        </div>
                        <ChevronRight size={20} className={styles.chevron} />
                    </a>
                </div>

                {/* 4. Zona de Peligro / Salir */}
                <div className={styles.dangerZone}>
                    <LogoutButton />
                </div>

                <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '1rem', paddingBottom: '2rem' }}>
                    RoNa Finance v0.0.1
                </p>
            </main>
        </div>
    );
}
