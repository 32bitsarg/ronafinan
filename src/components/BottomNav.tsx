'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, PieChart, Repeat, Settings, PlusCircle, CreditCard, Plus } from "lucide-react";
import styles from "./BottomNav.module.css";

import { useState } from 'react';

export default function BottomNav() {
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Ocultar barra en las pantallas de Auth
    if (pathname?.includes('/login') || pathname?.includes('/registro')) {
        return null;
    }

    // Rutas disponibles adaptadas al layout /mobile
    const links = [
        { href: "/mobile", label: "Inicio", icon: Home },
        { href: "/mobile/presupuesto", label: "Presupuesto", icon: PieChart },
        // El botón central de Agregar (ahora sin href directo)
        { label: "Nuevo", icon: PlusCircle, isMainAction: true },
        { href: "/mobile/fijos", label: "Agenda", icon: Repeat },
        { href: "/mobile/ajustes", label: "Ajustes", icon: Settings },
    ];

    return (
        <>
            {/* Menú Flotante (Overlay) */}
            {isMenuOpen && (
                <div className={styles.overlay} onClick={() => setIsMenuOpen(false)}>
                    <div className={styles.menuContainer} onClick={e => e.stopPropagation()}>
                        <Link href="/mobile/ajustes/cuentas" className={styles.menuItem} onClick={() => setIsMenuOpen(false)}>
                            <div className={styles.menuIconWrap} style={{ backgroundColor: 'hsl(125, 40%, 90%)' }}>
                                <CreditCard size={20} color="#065f46" />
                            </div>
                            <span>Nueva Billetera</span>
                        </Link>
                        <Link href="/mobile/nuevo" className={styles.menuItem} onClick={() => setIsMenuOpen(false)}>
                            <div className={styles.menuIconWrap} style={{ backgroundColor: 'var(--accent-primary)' }}>
                                <Plus size={20} color="#fff" />
                            </div>
                            <span>Nuevo Movimiento</span>
                        </Link>
                    </div>
                </div>
            )}

            <nav className={styles.nav}>
                {links.map((link, idx) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href;

                    if (link.isMainAction) {
                        return (
                            <button
                                key="main-action"
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className={`${styles.mainActionButton} ${isMenuOpen ? styles.rotated : ""}`}
                            >
                                <div className={styles.mainActionInner}>
                                    <Icon size={28} color="#fff" />
                                </div>
                            </button>
                        );
                    }

                    return (
                        <Link
                            key={link.href || idx}
                            href={link.href!}
                            className={`${styles.navItem} ${isActive ? styles.active : ""}`}
                        >
                            <Icon size={24} />
                            <span>{link.label}</span>
                        </Link>
                    );
                })}
            </nav>
        </>
    );
}
