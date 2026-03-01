'use server';

import { prisma } from '../lib/prisma';
import { revalidatePath } from 'next/cache';
import { getSession } from './auth';

export async function getBudgets(month: number, year: number) {
    const user = await getSession();
    const wsId = user.activeWorkspaceId!;

    // 1. Obtener los límites definidos
    const budgets = await prisma.budget.findMany({
        where: { workspaceId: wsId, month, year },
        orderBy: { limit: 'desc' }
    });

    // Filtros de fecha de inicio a fin del mes solicitado
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0); // 0th day is last day of previous month

    // 2. Traer TODAS las transacciones de GASTO reales del mes para esta familia
    const transactions = await prisma.transaction.findMany({
        where: {
            workspaceId: wsId,
            type: 'EXPENSE',
            date: { gte: startDate, lte: endDate }
        }
    });

    // 3. Cruzar datos (O(N) mapping)
    const enrichedBudgets = budgets.map(budget => {
        // Encontramos todos los tickets que pertenezcan exactamente a esta categoría
        const spent = transactions
            .filter(t => t.category.toLowerCase() === budget.category.toLowerCase())
            .reduce((sum, t) => sum + t.amount, 0);

        return {
            ...budget,
            spent,
            left: budget.limit - spent
        };
    });

    return enrichedBudgets;
}
export async function getMonthlyIncomeProjection(month: number, year: number) {
    const user = await getSession();
    const wsId = user.activeWorkspaceId!;

    // Traemos todos los ingresos "activos"
    const incomes = await prisma.recurringTransaction.findMany({
        where: { workspaceId: wsId, type: 'INCOME', isActive: true }
    });

    // MVP Simple: Sumamos los ingresos (asumiendo formato mensual)
    return incomes.reduce((sum, income) => sum + income.amount, 0);
}

export async function addBudget(formData: FormData) {
    const user = await getSession();
    const wsId = user.activeWorkspaceId!;

    const category = formData.get('category') as string;
    const limitStr = formData.get('limit') as string;
    const limit = parseFloat(limitStr);

    // Default to strict current month for MVP
    const today = new Date();
    const month = today.getMonth();
    const year = today.getFullYear();

    if (isNaN(limit) || limit <= 0) {
        throw new Error('El límite asignado debe ser un valor positivo.');
    }

    // Upsert para actualizar si la categoría este mes ya existe en esta familia
    await prisma.budget.upsert({
        where: {
            category_month_year_workspaceId: {
                category,
                month,
                year,
                workspaceId: wsId
            }
        },
        update: {
            limit: { increment: limit } // Permite "recargar el sobre" incrementando lo asignado
        },
        create: {
            category,
            limit,
            month,
            year,
            workspaceId: wsId
        }
    });

    revalidatePath('/mobile/presupuesto');
}

export async function deleteBudget(id: string) {
    const user = await getSession();
    const wsId = user.activeWorkspaceId!;

    await prisma.budget.deleteMany({
        where: { id, workspaceId: wsId }
    });
    revalidatePath('/mobile/presupuesto');
}
