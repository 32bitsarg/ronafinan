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
        const balance = parseFloat(formData.get('balance') as string) || 0;

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
