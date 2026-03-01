import { WorkspaceManager } from '../../../mobile/ajustes/ClientComponents';
import { getSession } from '@/actions/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function DesktopFamiliaPage() {
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
        <div>
            <header style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <Link href="/desktop/ajustes" style={{ color: 'var(--text-primary)' }}>
                    <ArrowLeft size={28} />
                </Link>
                <div>
                    <h1 style={{ fontSize: '1.5rem', margin: '0 0 0.2rem 0', fontWeight: '700' }}>Mi Familia</h1>
                    <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.9rem' }}>Gestiona los miembros de tu Workspace</p>
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '1.5rem' }}>
                <div style={{ gridColumn: 'span 8', backgroundColor: 'var(--bg-surface)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                    <WorkspaceManager activeInviteCode={activeInviteCode} />
                </div>
            </div>
        </div>
    );
}
