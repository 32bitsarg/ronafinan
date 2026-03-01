'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, PieChart, Repeat, Settings, PlusCircle } from "lucide-react";
import styles from "./BottomNav.module.css";

export default function BottomNav() {
    const pathname = usePathname();

    // Ocultar barra en las pantallas de Auth
    if (pathname?.includes('/login') || pathname?.includes('/registro')) {
        return null;
    }

    // Rutas disponibles adaptadas al layout /mobile
    const links = [
        { href: "/mobile", label: "Inicio", icon: Home },
        { href: "/mobile/presupuesto", label: "Presupuesto", icon: PieChart },
        // El botón central de Agregar
        { href: "/mobile/nuevo", label: "Nuevo", icon: PlusCircle, isMainAction: true },
        { href: "/mobile/fijos", label: "Agenda", icon: Repeat },
        { href: "/mobile/ajustes", label: "Ajustes", icon: Settings },
    ];

    return (
        <nav className={styles.nav}>
            {links.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;

                if (link.isMainAction) {
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={styles.mainActionButton}
                        >
                            <div className={styles.mainActionInner}>
                                <Icon size={28} color="#fff" />
                            </div>
                        </Link>
                    );
                }

                return (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={`${styles.navItem} ${isActive ? styles.active : ""}`}
                    >
                        <Icon size={24} />
                        <span>{link.label}</span>
                    </Link>
                );
            })}
        </nav>
    );
}
