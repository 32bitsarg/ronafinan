'use server';

import { prisma } from '../lib/prisma';
import { revalidatePath } from 'next/cache';
import { getSession } from './auth';
import { uploadReceipt, deleteReceiptFile } from '../lib/appwrite';


// 0. Obtener cuentas del WORKSPACE ACTUAL
export async function getAccounts() {
    const user = await getSession();
    const wsId = user.activeWorkspaceId!;

    const accounts = await prisma.account.findMany({ where: { workspaceId: wsId } });
    return accounts;
}

// 1. Añadir Transacción (Aislando por Workspace)
export async function addTransaction(formData: FormData) {
    const user = await getSession();
    const wsId = user.activeWorkspaceId!;

    const amountStr = formData.get('amount') as string;
    const amount = amountStr ? parseFloat(amountStr.replace(',', '.')) : 0;
    const type = formData.get('type') as string;
    const category = formData.get('category') as string;
    const description = formData.get('description') as string;

    const accountId = formData.get('accountId') as string;
    const toAccountId = formData.get('toAccountId') as string;

    const installmentsStr = formData.get('installments') as string;
    const installments = installmentsStr ? parseInt(installmentsStr, 10) : 1;
    const frequency = (formData.get('frequency') as string) || 'MONTHLY';

    // Procesar comprobante si viene
    const receiptFile = formData.get('receipt') as File | null;
    let receiptUrl: string | null = null;

    if (isNaN(amount) || amount <= 0) return { error: 'El monto debe ser un valor positivo.' };
    if (!accountId) return { error: 'Debes seleccionar una cuenta de origen.' };

    const account = await prisma.account.findFirst({ where: { id: accountId, workspaceId: wsId } });
    if (!account) return { error: 'Cuenta no encontrada o no pertenece a este entorno.' };

    try {
        if (receiptFile && receiptFile.size > 0) {
            receiptUrl = await uploadReceipt(receiptFile);
        }

        if ((type === 'EXPENSE' || type === 'INCOME') && installments > 1) {
            // Lógica de Compra/Cobro en Cuotas (Smart Debt/Income)
            const amountPerInstallment = amount / installments;

            await prisma.recurringTransaction.create({
                data: {
                    name: description || `${type === 'INCOME' ? 'Cobro' : 'Compra'} en Cuotas - ${category}`,
                    amount: amountPerInstallment,
                    currency: account.currency,
                    type: type as 'EXPENSE' | 'INCOME',
                    category,
                    frequency: frequency as 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY',
                    dayOfMonth: new Date().getDate(),
                    isActive: true,
                    totalInstallments: installments,
                    currentInstallment: 1,
                    workspaceId: wsId
                }
            });
        } else {
            // Transacción Estándar Inmediata
            await prisma.$transaction(async (tx) => {
                await tx.transaction.create({
                    data: {
                        amount,
                        type,
                        currency: account.currency,
                        category,
                        description: description || null,
                        receiptUrl,
                        accountId,
                        toAccountId: type === 'TRANSFER' ? toAccountId : null,
                        workspaceId: wsId // ASIGNADO AL TENANT
                    },
                });

                if (type === 'INCOME') {
                    await tx.account.update({ where: { id: accountId }, data: { balance: { increment: amount } } });
                }
                else if (type === 'EXPENSE') {
                    await tx.account.update({ where: { id: accountId }, data: { balance: { decrement: amount } } });
                }
                else if (type === 'TRANSFER') {
                    if (!toAccountId || accountId === toAccountId) throw new Error("Selecciona una cuenta destino diferente.");

                    const toAccount = await tx.account.findFirst({ where: { id: toAccountId, workspaceId: wsId } });
                    if (account.currency !== toAccount?.currency) {
                        throw new Error("Para transferir entre monedas diferentes se requiere Exchange (No soportado)");
                    }

                    await tx.account.update({ where: { id: accountId }, data: { balance: { decrement: amount } } });
                    await tx.account.update({ where: { id: toAccountId }, data: { balance: { increment: amount } } });
                }
            });
        }

        revalidatePath('/');
        revalidatePath('/estadisticas');
        return { success: true };

    } catch (e: any) {
        console.error("Detalle del error en addTransaction:", e);
        return { error: e?.message || "Algo falló en el servidor." };
    }
}

// 2. Traer info del Dashboard (Aislado por Workspace)
export async function getDashboardData() {
    const user = await getSession();
    const wsId = user.activeWorkspaceId!;

    const transactions = await prisma.transaction.findMany({
        where: { workspaceId: wsId },
        orderBy: { date: 'desc' },
        take: 20,
    });

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Todas las transacciones del mes para calcular el saldo inicial
    const monthTransactions = await prisma.transaction.findMany({
        where: {
            workspaceId: wsId,
            date: { gte: startOfMonth }
        }
    });

    const accounts = await prisma.account.findMany({ where: { workspaceId: wsId } });

    const totalBalanceArs = accounts
        .filter(account => account.currency === 'ARS')
        .reduce((sum, account) => sum + account.balance, 0);

    const totalBalanceUsd = accounts
        .filter(account => account.currency === 'USD')
        .reduce((sum, account) => sum + account.balance, 0);

    // Calcular diferencia neta del mes para revertir al saldo inicial
    let monthDiffArs = 0;
    let monthDiffUsd = 0;

    monthTransactions.forEach(t => {
        const amount = t.amount;
        if (t.type === 'INCOME') {
            if (t.currency === 'USD') monthDiffUsd += amount;
            else monthDiffArs += amount;
        } else if (t.type === 'EXPENSE') {
            if (t.currency === 'USD') monthDiffUsd -= amount;
            else monthDiffArs -= amount;
        }
        // Las transferencias no afectan el patrimonio neto total, así que se ignoran aquí
    });

    const initialBalanceArs = totalBalanceArs - monthDiffArs;
    const initialBalanceUsd = totalBalanceUsd - monthDiffUsd;

    return {
        transactions,
        totalBalanceArs,
        totalBalanceUsd,
        initialBalanceArs,
        initialBalanceUsd,
        accounts,
        activeWorkspaceName: user.workspaces.find(w => w.workspaceId === wsId)?.workspace.name || 'Desconocido'
    };
}

// 3. Modificar Historia (Borrar Transacción y Deshacer el Saldo)
export async function deleteTransaction(transactionId: string) {
    const user = await getSession();
    const wsId = user.activeWorkspaceId!;

    const transaction = await prisma.transaction.findFirst({
        where: { id: transactionId, workspaceId: wsId }
    });

    if (!transaction) throw new Error("Movimiento no encontrado o sin permisos.");

    // Envolver en transacción ACID para que los saldos retrocedan sin fallas
    await prisma.$transaction(async (tx) => {
        // En base al tipo de origen, hacer el reverso contable
        const amount = transaction.amount;
        const accountId = transaction.accountId!;

        if (transaction.type === 'INCOME') {
            await tx.account.update({ where: { id: accountId }, data: { balance: { decrement: amount } } });
        } else if (transaction.type === 'EXPENSE') {
            await tx.account.update({ where: { id: accountId }, data: { balance: { increment: amount } } });
        } else if (transaction.type === 'TRANSFER' && transaction.toAccountId) {
            // El origen que mandó recupera dinero (decremento -> incremento)
            await tx.account.update({ where: { id: accountId }, data: { balance: { increment: amount } } });
            // El destino que recibió devuelve dinero (incremento -> decremento)
            await tx.account.update({ where: { id: transaction.toAccountId }, data: { balance: { decrement: amount } } });
        }

        // Borrar evidencia del registro histórico
        await tx.transaction.delete({ where: { id: transactionId } });
    });

    revalidatePath('/');
    revalidatePath('/estadisticas');
}

// 4. Eliminar comprobante de transaccion
export async function deleteReceipt(transactionId: string) {
    const user = await getSession();
    const wsId = user.activeWorkspaceId!;

    const transaction = await prisma.transaction.findFirst({
        where: { id: transactionId, workspaceId: wsId }
    });

    if (!transaction || !transaction.receiptUrl) throw new Error("Comprobante no encontrado.");

    await deleteReceiptFile(transaction.receiptUrl);
    await prisma.transaction.update({
        where: { id: transactionId },
        data: { receiptUrl: null }
    });

    revalidatePath('/');
    revalidatePath('/estadisticas');
}
