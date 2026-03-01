'use server';

import { prisma } from '../lib/prisma';
import { getSession } from './auth';
import { getDolarBlueRate } from '../lib/dolar';

export async function getForecastData() {
    const user = await getSession();
    const wsId = user.activeWorkspaceId!;

    // Obtener la cotización real y en vivo del dólar Blue
    const EXCHANGE_RATE_USD_ARS = await getDolarBlueRate();

    // 1. Obtener Patrimonio Neto Actual Consolidado (ARS)
    const accounts = await prisma.account.findMany({ where: { workspaceId: wsId } });
    let currentNetWorth = accounts.reduce((acc, account) => {
        let balanceInArs = account.balance;
        if (account.currency === 'USD') balanceInArs *= EXCHANGE_RATE_USD_ARS;
        return acc + balanceInArs;
    }, 0);

    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    // 2. Proyección de Ingresos utilizando la nueva Arquitectura de "Agenda"
    const recurringIncomes = await prisma.recurringTransaction.findMany({
        where: { isActive: true, type: 'INCOME', workspaceId: wsId }
    });
    const projectedMonthlyIncome = recurringIncomes.reduce((sum, f) => sum + (f.currency === 'USD' ? f.amount * EXCHANGE_RATE_USD_ARS : f.amount), 0);

    // 3. Proyección de Gastos Fijos (Agenda)
    const recurringExpenses = await prisma.recurringTransaction.findMany({
        where: { isActive: true, type: 'EXPENSE', workspaceId: wsId }
    });
    const monthlyFixedCost = recurringExpenses.reduce((sum, f) => sum + (f.currency === 'USD' ? f.amount * EXCHANGE_RATE_USD_ARS : f.amount), 0);

    // 4. Proyección de Presupuesto Base Cero (Sobres)
    const budgets = await prisma.budget.findMany({
        where: { month: currentMonth, year: currentYear, workspaceId: wsId }
    });
    // Si no gastan los sobres, asumimos que el límite se consume a final de mes.
    const monthlyBudgetCost = budgets.reduce((sum, b) => sum + b.limit, 0);

    const forecast = [];
    let projectedBalance = currentNetWorth;
    const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

    // Calculamos el flujo mensual de este mes y los siguientes 5
    for (let i = 0; i < 6; i++) {
        const targetMonthIndex = (currentMonth + i) % 12;

        if (i > 0) {
            projectedBalance = projectedBalance + projectedMonthlyIncome - monthlyFixedCost - monthlyBudgetCost;
        }

        forecast.push({
            month: monthNames[targetMonthIndex],
            expectedBalance: projectedBalance
        });
    }

    return forecast;
}
