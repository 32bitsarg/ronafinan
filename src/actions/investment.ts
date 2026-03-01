'use server';

import { prisma } from '../lib/prisma';
import { getSession } from './auth';
import { revalidatePath } from 'next/cache';

export async function getInvestments() {
    const user = await getSession();
    const wsId = user.activeWorkspaceId!;

    return await prisma.investment.findMany({
        where: { workspaceId: wsId },
        orderBy: { invested: 'desc' }
    });
}

export async function addInvestment(formData: FormData) {
    const user = await getSession();
    const wsId = user.activeWorkspaceId!;

    const name = formData.get('name') as string;
    const platform = formData.get('platform') as string;
    const currency = formData.get('currency') as string;

    const investedStr = formData.get('invested') as string;
    const invested = parseFloat(investedStr);

    const currentValStr = formData.get('currentVal') as string;
    const currentVal = currentValStr ? parseFloat(currentValStr) : invested; // Default to invested if not tracking yield yet

    if (isNaN(invested) || invested <= 0) {
        throw new Error('El monto inicial debe ser un valor positivo.');
    }

    await prisma.investment.create({
        data: {
            name,
            platform,
            currency,
            invested,
            currentVal,
            workspaceId: wsId
        }
    });

    revalidatePath('/mobile/inversiones');
    revalidatePath('/mobile');
}

export async function deleteInvestment(id: string) {
    const user = await getSession();
    const wsId = user.activeWorkspaceId!;

    await prisma.investment.deleteMany({
        where: { id, workspaceId: wsId }
    });

    revalidatePath('/mobile/inversiones');
    revalidatePath('/mobile');
}
