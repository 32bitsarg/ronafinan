import styles from '../page.module.css';
import { WorkspaceManager } from '../ClientComponents';
import { getSession } from '@/actions/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function FamiliaPage() {
    const user = await getSession();
    let activeInviteCode = null;
    if (user.activeWorkspaceId) {
        const workspace = await prisma.workspace.findUnique({
            where: { id: user.activeWorkspaceId },
            select: { inviteCode: true }
        });
        activeInviteCode = workspace?.inviteCode || null;
    }

    return (
        <div className={styles.container}>
            <header className={styles.header} style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <Link href="/ajustes" style={{ color: 'var(--text-primary)' }}>
                    <ArrowLeft size={28} />
                </Link>
                <h1 className={styles.title} style={{ margin: 0 }}>Mi Familia</h1>
            </header>
            <main className={styles.mainContent}>
                <WorkspaceManager activeInviteCode={activeInviteCode} />
            </main>
        </div>
    );
}
