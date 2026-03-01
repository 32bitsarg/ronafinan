'use server';

import { prisma } from '../lib/prisma';
import { revalidatePath } from 'next/cache';
import { getSession } from './auth';

export async function getRecurringTransactions() {
    const user = await getSession();
    const wsId = user.activeWorkspaceId!;

    return await prisma.recurringTransaction.findMany({
        where: { workspaceId: wsId },
        orderBy: { dayOfMonth: 'asc' },
    });
}

export async function addRecurringTransaction(formData: FormData) {
    const user = await getSession();
    const wsId = user.activeWorkspaceId!;

    const name = formData.get('name') as string;
    const amountStr = formData.get('amount') as string;
    const amount = parseFloat(amountStr);
    const category = formData.get('category') as string;
    const type = formData.get('type') as string; // 'INCOME' | 'EXPENSE'
    const frequency = formData.get('frequency') as string; // 'MONTHLY' | 'WEEKLY' | 'DAILY'
    const currency = formData.get('currency') as string; // 'ARS' | 'USD'
    const dayStr = formData.get('dayOfMonth') as string;
    const dayOfMonth = dayStr ? parseInt(dayStr, 10) : 1; // MVP default to 1

    if (isNaN(amount) || amount <= 0) {
        throw new Error('El monto debe ser un valor positivo.');
    }

    if (frequency === 'MONTHLY' && (isNaN(dayOfMonth) || dayOfMonth < 1 || dayOfMonth > 31)) {
        throw new Error('El día del mes debe ser entre 1 y 31.');
    }

    await prisma.recurringTransaction.create({
        data: {
            name,
            amount,
            currency,
            type,
            category,
            frequency,
            dayOfMonth,
            isActive: true,
            workspaceId: wsId
        },
    });

    revalidatePath('/mobile/fijos');
}

export async function toggleRecurringTransaction(id: string, currentStatus: boolean) {
    const user = await getSession();
    const wsId = user.activeWorkspaceId!;

    // Check ownership indirectly by filtering by workspaceId
    await prisma.recurringTransaction.updateMany({
        where: { id, workspaceId: wsId },
        data: { isActive: !currentStatus },
    });

    revalidatePath('/mobile/fijos');
}

export async function deleteRecurringTransaction(id: string) {
    const user = await getSession();
    const wsId = user.activeWorkspaceId!;

    await prisma.recurringTransaction.deleteMany({
        where: { id, workspaceId: wsId }
    });
    revalidatePath('/mobile/fijos');
}
