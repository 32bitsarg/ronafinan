'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { LayoutDashboard, PieChart, LineChart, Wallet, Settings, LogOut, PlusCircle, Plus, CreditCard, ChevronDown } from 'lucide-react';
import styles from './DesktopSidebar.module.css';
import { logout } from '@/actions/auth';

export default function DesktopSidebar() {
    const pathname = usePathname();
    const [isNewMenuOpen, setIsNewMenuOpen] = useState(false);

    const NAV_ITEMS = [
        { label: 'Dashboard', href: '/desktop', icon: <LayoutDashboard size={20} /> },
        { label: 'Presupuestos', href: '/desktop/presupuesto', icon: <PieChart size={20} /> },
        { label: 'Inversiones', href: '/desktop/inversiones', icon: <LineChart size={20} /> },
        { label: 'Suscripciones', href: '/desktop/fijos', icon: <Wallet size={20} /> },
        { label: 'Ajustes', href: '/desktop/ajustes', icon: <Settings size={20} /> }
    ];

    return (
        <aside className={styles.sidebar}>
            <div className={styles.brand}>
                <div className={styles.logo}>
                    <Wallet size={24} />
                </div>
                <h2>RoNa Finance</h2>
            </div>

            <nav className={styles.nav}>
                {/* Botón Nuevo Movimiento con Submenú */}
                <div className={styles.newMenuWrapper}>
                    <button
                        onClick={() => setIsNewMenuOpen(!isNewMenuOpen)}
                        className={`${styles.navItem} ${styles.newBtn} ${isNewMenuOpen ? styles.newBtnActive : ''}`}
                    >
                        <PlusCircle size={20} />
                        <span>Nuevo</span>
                        <ChevronDown size={16} style={{ marginLeft: 'auto', transform: isNewMenuOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                    </button>

                    {isNewMenuOpen && (
                        <div className={styles.subMenu}>
                            <Link href="/desktop/nuevo" className={styles.subNavItem} onClick={() => setIsNewMenuOpen(false)}>
                                <Plus size={16} />
                                <span>Transacción</span>
                            </Link>
                            <Link href="/desktop/ajustes/cuentas" className={styles.subNavItem} onClick={() => setIsNewMenuOpen(false)}>
                                <CreditCard size={16} />
                                <span>Billetera</span>
                            </Link>
                        </div>
                    )}
                </div>

                <div style={{ height: '1rem' }} />

                {NAV_ITEMS.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`${styles.navItem} ${isActive ? styles.active : ''}`}
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </Link>
                    )
                })}
            </nav>

            <div className={styles.footer}>
                <button onClick={() => logout()} className={styles.logoutBtn}>
                    <LogOut size={20} />
                    <span>Cerrar Sesión</span>
                </button>
            </div>
        </aside>
    );
}
