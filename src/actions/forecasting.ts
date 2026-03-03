'use server';

import { prisma } from '../lib/prisma';
import { getSession } from './auth';
import { getDolarBlueRate } from '../lib/dolar';
import { simpleLinearRegression, calculateStabilityScore, Point } from '../lib/math';

export async function getForecastData() {
    const user = await getSession();
    const wsId = user.activeWorkspaceId!;
    const EXCHANGE_RATE = await getDolarBlueRate();

    const accounts = await prisma.account.findMany({ where: { workspaceId: wsId } });
    const investments = await prisma.investment.findMany({ where: { workspaceId: wsId } });

    let baseCapital = accounts.reduce((acc, a) => acc + (a.currency === 'USD' ? a.balance * EXCHANGE_RATE : a.balance), 0);
    baseCapital += investments.reduce((acc, i) => acc + (i.currency === 'USD' ? (i.currentVal || i.invested) * EXCHANGE_RATE : (i.currentVal || i.invested)), 0);

    const recurring = await prisma.recurringTransaction.findMany({
        where: { isActive: true, workspaceId: wsId }
    });

    const monthlyNetRecurring = recurring.reduce((sum, r) => {
        const val = r.currency === 'USD' ? r.amount * EXCHANGE_RATE : r.amount;
        return sum + (r.type === 'INCOME' ? val : -val);
    }, 0);

    const today = new Date();
    const currentMonth = today.getMonth();
    const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

    const forecast = [];
    let runningProjected = baseCapital;

    for (let i = 0; i < 6; i++) {
        const monthIdx = (currentMonth + i) % 12;
        if (i > 0) {
            runningProjected += monthlyNetRecurring;
        }
        forecast.push({
            month: monthNames[monthIdx],
            expectedBalance: runningProjected
        });
    }

    return forecast;
}

export async function getHybridRunway() {
    const user = await getSession();
    const wsId = user.activeWorkspaceId!;
    const EXCHANGE_RATE = await getDolarBlueRate();

    const now = new Date();
    const currentDay = now.getDate();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const startOfMonth = new Date(currentYear, currentMonth, 1);
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    // 1. Current Net Worth
    const accounts = await prisma.account.findMany({ where: { workspaceId: wsId } });
    const investments = await prisma.investment.findMany({ where: { workspaceId: wsId } });

    const liquidBalance = accounts.reduce((sum, acc) => {
        return sum + (acc.currency === 'USD' ? acc.balance * EXCHANGE_RATE : acc.balance);
    }, 0);

    const investmentBalance = investments.reduce((sum, inv) => {
        const val = inv.currentVal || inv.invested;
        return sum + (inv.currency === 'USD' ? val * EXCHANGE_RATE : val);
    }, 0);

    const currentNetWorth = liquidBalance + investmentBalance;

    // 2. Spending vs Trends
    const monthTransactions = await prisma.transaction.findMany({
        where: { workspaceId: wsId, date: { gte: startOfMonth } },
        orderBy: { date: 'asc' }
    });

    let totalPeriodicExpenses = 0;
    const dailyDeltas: Record<number, number> = {};

    monthTransactions.forEach(t => {
        const day = new Date(t.date).getDate();
        const val = t.currency === 'USD' ? t.amount * EXCHANGE_RATE : t.amount;

        if (t.type === 'EXPENSE') {
            totalPeriodicExpenses += val;
            dailyDeltas[day] = (dailyDeltas[day] || 0) - val;
        } else if (t.type === 'INCOME') {
            dailyDeltas[day] = (dailyDeltas[day] || 0) + val;
        }
    });

    // visualBurnRate: Pure expenditure averaged per day
    const visualBurnRate = totalPeriodicExpenses / Math.max(1, currentDay);

    // Reconstruct points for Regression
    const points: Point[] = [{ x: currentDay, y: currentNetWorth }];
    let runningCap = currentNetWorth;
    for (let d = currentDay - 1; d >= 1; d--) {
        runningCap -= (dailyDeltas[d + 1] || 0);
        points.unshift({ x: d, y: runningCap });
    }

    const regression = simpleLinearRegression(points);
    const stability = calculateStabilityScore(points, regression);

    // 3. Fixed Costs
    const recurring = await prisma.recurringTransaction.findMany({
        where: { isActive: true, workspaceId: wsId }
    });

    let pendingFixedCostDelta = 0;
    recurring.forEach(r => {
        if (r.dayOfMonth && r.dayOfMonth > currentDay) {
            const val = r.currency === 'USD' ? r.amount * EXCHANGE_RATE : r.amount;
            pendingFixedCostDelta += (r.type === 'EXPENSE' ? val : -val);
        }
    });

    // 4. Final Calculation
    const availableLiquidity = liquidBalance - pendingFixedCostDelta;
    const netTrend = regression.slope;

    let daysLeft = -1;
    let status: 'STABLE' | 'WARNING' | 'CRITICAL' = 'STABLE';

    if (netTrend < 0 && availableLiquidity > 0) {
        daysLeft = Math.floor(availableLiquidity / Math.abs(netTrend));
    } else if (availableLiquidity <= 0) {
        daysLeft = 0;
    }

    if (daysLeft >= 0 && daysLeft < 5) status = 'CRITICAL';
    else if (daysLeft >= 0 && daysLeft < 15) status = 'WARNING';

    const projectedEndBalance = currentNetWorth - pendingFixedCostDelta + (netTrend * (daysInMonth - currentDay));

    return {
        currentNetWorth,
        daysLeft,
        status,
        stabilityScore: stability,
        burnRate: visualBurnRate,
        projectedEndBalance,
        confidence: Math.round(regression.r2 * 100)
    };
}

