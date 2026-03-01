import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifySession } from '@/lib/session';

export async function GET() {
    try {
        const session = await verifySession();
        if (!session) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: session.userId }
        });

        if (!user || !user.activeWorkspaceId) {
            return new NextResponse('Workspace not found', { status: 404 });
        }

        const transactions = await prisma.transaction.findMany({
            where: { workspaceId: user.activeWorkspaceId },
            include: { account: true, toAccount: true },
            orderBy: { date: 'desc' }
        });

        let csv = 'Fecha,Tipo,Categoría,Descripción,Monto,Moneda,Cuenta Origen,Cuenta Destino\n';

        transactions.forEach(t => {
            const date = t.date.toISOString().split('T')[0];
            const type = t.type;
            const category = t.category || '';
            const description = t.description || '';
            const amount = t.amount;
            const currency = t.currency;
            const accountFrom = t.account?.name || '';
            const accountTo = t.toAccount?.name || '';

            csv += `${date},${type},${category},${description},${amount},${currency},${accountFrom},${accountTo}\n`;
        });

        const headers = new Headers();
        headers.set('Content-Type', 'text/csv; charset=utf-8');
        headers.set('Content-Disposition', 'attachment; filename="movimientos.csv"');

        return new NextResponse(csv, { headers });
    } catch (e: any) {
        return new NextResponse('Error exporting data: ' + e.message, { status: 500 });
    }
}
