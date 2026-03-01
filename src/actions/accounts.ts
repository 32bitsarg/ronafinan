'use server';

import { prisma } from '../lib/prisma';
import { getSession } from './auth';
import { revalidatePath } from 'next/cache';

export async function createAccount(prevState: any, formData: FormData) {
    try {
        const user = await getSession();
        if (!user.activeWorkspaceId) throw new Error("No hay un workspace activo.");

        const name = formData.get('name') as string;
        const type = formData.get('type') as string;
        const currency = formData.get('currency') as string;
        const balanceInputStr = formData.get('balance') as string;
        const balance = balanceInputStr ? parseFloat(balanceInputStr.replace(',', '.')) : 0;

        if (!name || !type || !currency) throw new Error("Faltan datos de la cuenta.");

        // Si es una deuda, la forzamos a nacer en negativo lógicamente
        let finalBalance = balance;
        if (['DEBT', 'CREDIT_CARD'].includes(type) && balance > 0) {
            finalBalance = balance * -1;
        }

        await prisma.account.create({
            data: {
                name,
                type,
                currency,
                balance: finalBalance,
                workspaceId: user.activeWorkspaceId
            }
        });

        // La revalidación reconstruye la UI del Dashboard y Ajustes 
        revalidatePath('/');
        return { success: true, message: `Cuenta ${name} creada exitosamente.` };
    } catch (e: any) {
        return { error: e.message };
    }
}

export async function editAccount(prevState: any, formData: FormData) {
    try {
        const user = await getSession();
        if (!user.activeWorkspaceId) throw new Error("No hay un workspace activo.");

        const accountId = formData.get('accountId') as string;
        const name = formData.get('name') as string;
        const balanceInput = formData.get('balance') as string;
        const balance = balanceInput ? parseFloat(balanceInput.replace(',', '.')) : null;

        if (!accountId || !name) throw new Error("Faltan datos de la cuenta.");

        const account = await prisma.account.findFirst({
            where: { id: accountId, workspaceId: user.activeWorkspaceId }
        });

        if (!account) throw new Error("Cuenta no encontrada o sin permisos.");

        let finalBalance = balance !== null ? balance : account.balance;

        // Mantener lógica de deuda si aplica, y si el usuario mandó un balance nuevo
        if (balance !== null && ['DEBT', 'CREDIT_CARD'].includes(account.type) && balance > 0) {
            finalBalance = balance * -1;
        }

        await prisma.account.update({
            where: { id: account.id },
            data: {
                name,
                balance: finalBalance
            }
        });

        revalidatePath('/');
        revalidatePath('/mobile');
        revalidatePath('/desktop');
        return { success: true };
    } catch (e: any) {
        return { error: e.message };
    }
}
