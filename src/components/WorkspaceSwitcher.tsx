'use client';
import { useTransition } from 'react';
import { switchWorkspace } from '@/actions/auth';
import { usePathname } from 'next/navigation';
import { Users } from 'lucide-react';
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
    const pathname = usePathname();

    const handleSwitch = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newId = e.target.value;
        startTransition(async () => {
            await switchWorkspace(newId, pathname);
        });
    };

    return (
        <div className={styles.switcherWrapper}>
            <div className={styles.iconWrapper}>
                <Users size={16} />
            </div>
            <select
                title="Cambiar Espacio de Trabajo"
                value={activeId}
                onChange={handleSwitch}
                className={styles.select}
                disabled={isPending}
            >
                {workspaces.map(w => (
                    <option key={w.id} value={w.id}>
                        {w.name}
                    </option>
                ))}
            </select>
            {isPending && <span className={styles.loader}></span>}
        </div>
    );
}
