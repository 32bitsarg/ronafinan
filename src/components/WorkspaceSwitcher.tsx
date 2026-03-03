'use client';

import { useTransition, useState, useRef, useEffect } from 'react';
import { switchWorkspace } from '@/actions/auth';
import { usePathname } from 'next/navigation';
import { Users, ChevronDown, Check } from 'lucide-react';
import styles from './WorkspaceSwitcher.module.css';

type Workspace = { id: string, name: string };

export default function WorkspaceSwitcher({
    workspaces,
    activeId
}: {
    workspaces: Workspace[],
    activeId: string
}) {
    const [isPending, startTransition] = useTransition();
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const dropdownRef = useRef<HTMLDivElement>(null);

    const activeWorkspace = workspaces.find(w => w.id === activeId);

    const handleSwitch = (newId: string) => {
        if (newId === activeId) {
            setIsOpen(false);
            return;
        }
        setIsOpen(false);
        startTransition(async () => {
            await switchWorkspace(newId, pathname);
        });
    };

    // Close when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className={styles.container} ref={dropdownRef}>
            <button
                className={`${styles.trigger} ${isOpen ? styles.activeTrigger : ''}`}
                onClick={() => setIsOpen(!isOpen)}
                disabled={isPending}
            >
                <div className={styles.iconWrapper}>
                    <Users size={16} />
                </div>
                <span className={styles.activeLabel}>{activeWorkspace?.name || 'Seleccionar...'}</span>
                <ChevronDown size={14} className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`} />

                {isPending && <div className={styles.pendingOverlay} />}
            </button>

            {isOpen && (
                <div className={styles.dropdown}>
                    <div className={styles.dropdownHeader}>Espacios de Trabajo</div>
                    <div className={styles.optionsList}>
                        {workspaces.map(w => (
                            <button
                                key={w.id}
                                className={`${styles.option} ${w.id === activeId ? styles.selectedOption : ''}`}
                                onClick={() => handleSwitch(w.id)}
                            >
                                <span>{w.name}</span>
                                {w.id === activeId && <Check size={14} />}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
