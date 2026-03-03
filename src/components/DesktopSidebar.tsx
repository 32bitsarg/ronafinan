'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, PieChart, LineChart, Wallet, Settings, LogOut } from 'lucide-react';
import styles from './DesktopSidebar.module.css';
import { logout } from '@/actions/auth';

const NAV_ITEMS = [
    { label: 'Dashboard', href: '/desktop', icon: <LayoutDashboard size={20} /> },
    { label: 'Presupuestos', href: '/desktop/presupuesto', icon: <PieChart size={20} /> },
    { label: 'Inversiones', href: '/desktop/inversiones', icon: <LineChart size={20} /> },
    { label: 'Suscripciones', href: '/desktop/fijos', icon: <Wallet size={20} /> },
    { label: 'Ajustes', href: '/desktop/ajustes', icon: <Settings size={20} /> }
];

export default function DesktopSidebar() {
    const pathname = usePathname();

    return (
        <aside className={styles.sidebar}>
            <div className={styles.brand}>
                <div className={styles.logo}>
                    <Wallet size={24} />
                </div>
                <h2>RoNa Finance</h2>
            </div>

            <nav className={styles.nav}>
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
