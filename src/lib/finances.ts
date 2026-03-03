import { prisma } from './prisma';
import { getDolarBlueRate } from './dolar';
import { getAssetPrices } from './assets';
import { formatMoney } from './formatters';

export async function calculateConsolidatedNetWorth(workspaceId: string) {
    const exchangeRate = await getDolarBlueRate();
    const accounts = await prisma.account.findMany({ where: { workspaceId } });
    const investments = await prisma.investment.findMany({ where: { workspaceId } });

    // 1. Efectivo y Bancos
    const totalBalanceArs = accounts
        .filter(acc => acc.currency === 'ARS')
        .reduce((sum, acc) => sum + acc.balance, 0);

    const totalBalanceUsd = accounts
        .filter(acc => acc.currency === 'USD')
        .reduce((sum, acc) => sum + acc.balance, 0);

    // 2. Inversiones
    const symbols = investments.map(inv => inv.name.toUpperCase());
    const realTimePrices = await getAssetPrices(symbols);

    const investmentDetails = investments.map(inv => {
        const symbol = inv.name.toUpperCase();
        const rtPrice = realTimePrices[symbol] || realTimePrices[symbol + '.BA'];
        let rtValue = inv.currentVal || inv.invested;

        // Convención: si invested es pequeño (< 5000), lo tratamos como "unidades" 
        // para habilitar el tiempo real automático si el ticker coincide.
        if (rtPrice && inv.invested < 5000) {
            rtValue = rtPrice * inv.invested;
        }

        return {
            ...inv,
            rtPrice,
            rtValue,
        };
    });

    let totalInvestmentsArs = 0;
    let totalInvestmentsUsd = 0;

    investmentDetails.forEach(inv => {
        if (inv.currency === 'USD') totalInvestmentsUsd += inv.rtValue;
        else totalInvestmentsArs += inv.rtValue;
    });

    const netWorthArs = totalBalanceArs + totalInvestmentsArs + ((totalBalanceUsd + totalInvestmentsUsd) * exchangeRate);

    const assetAllocation = getAssetAllocation({
        totalBalanceArs,
        totalBalanceUsd,
        totalInvestmentsArs,
        totalInvestmentsUsd,
        exchangeRate
    });

    return {
        totalBalanceArs,
        totalBalanceUsd,
        totalInvestmentsArs,
        totalInvestmentsUsd,
        netWorthArs,
        investmentDetails,
        exchangeRate,
        assetAllocation
    };
}

function getAssetAllocation(data: any) {
    const totalLiquidArs = data.totalBalanceArs + (data.totalBalanceUsd * data.exchangeRate);
    const totalInvestedArs = data.totalInvestmentsArs + (data.totalInvestmentsUsd * data.exchangeRate);
    const total = totalLiquidArs + totalInvestedArs;

    if (total === 0) return { liquidP: 0, investedP: 0 };

    return {
        liquidP: Math.round((totalLiquidArs / total) * 100),
        investedP: Math.round((totalInvestedArs / total) * 100)
    };
}

export function getSmartInsights(data: any) {
    const insights: { type: string; message: string; category: string }[] = [];
    const { totalExpenseArs, totalIncomeArs, budgetArs = 0, expensesByCategory } = data;

    const now = new Date();
    const currentDay = now.getDate();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const daysLeft = daysInMonth - currentDay;

    // ─── 1. Presupuesto (SOLO si hay budget definido, previene Infinity%) ───
    if (budgetArs > 0) {
        const budgetUsedPercent = Math.round((totalExpenseArs / budgetArs) * 100);

        if (totalExpenseArs > budgetArs) {
            insights.push({
                type: 'WARNING',
                message: `Superaste tu presupuesto mensual por ${budgetUsedPercent - 100}%. Ajustá tus gastos restantes del mes.`,
                category: 'Presupuesto'
            });
        } else if (budgetUsedPercent >= 80) {
            insights.push({
                type: 'INFO',
                message: `Ya usaste el ${budgetUsedPercent}% de tu presupuesto y quedan ${daysLeft} días del mes.`,
                category: 'Presupuesto'
            });
        } else if (budgetUsedPercent < 50 && currentDay > 15) {
            insights.push({
                type: 'SUCCESS',
                message: `Vas muy bien: solo usaste ${budgetUsedPercent}% del presupuesto a mitad de mes.`,
                category: 'Presupuesto'
            });
        }
    }

    // ─── 2. Tasa de ahorro (si hay ingresos registrados) ───
    if (totalIncomeArs > 0) {
        const savingsRate = Math.round((1 - totalExpenseArs / totalIncomeArs) * 100);

        if (savingsRate >= 50) {
            insights.push({
                type: 'SUCCESS',
                message: `Tasa de ahorro del ${savingsRate}%. Estás conservando más de la mitad de tus ingresos — excelente.`,
                category: 'Ahorro'
            });
        } else if (savingsRate >= 20) {
            insights.push({
                type: 'SUCCESS',
                message: `Tasa de ahorro del ${savingsRate}%. Cumplís la regla 50/30/20 en ahorro.`,
                category: 'Ahorro'
            });
        } else if (savingsRate > 0) {
            insights.push({
                type: 'INFO',
                message: `Tasa de ahorro del ${savingsRate}%. Idealmente deberías apuntar a 20% o más.`,
                category: 'Ahorro'
            });
        } else if (savingsRate < 0) {
            insights.push({
                type: 'WARNING',
                message: `Estás gastando más de lo que ingresás este mes (${Math.abs(savingsRate)}% de déficit).`,
                category: 'Flujo'
            });
        }
    }

    // ─── 3. Flujo neto del mes ───
    if (totalIncomeArs > 0 && totalExpenseArs > 0) {
        const netFlow = totalIncomeArs - totalExpenseArs;
        if (netFlow > 0) {
            const dailyAvailable = Math.round(netFlow / Math.max(1, daysLeft));
            if (daysLeft > 0) {
                insights.push({
                    type: 'INFO',
                    message: `Tu superávit actual es positivo. Tenés ~${formatMoney(dailyAvailable)}/día disponible los próximos ${daysLeft} días.`,
                    category: 'Flujo'
                });
            }
        }
    }

    // ─── 4. Categoría dominante ───
    if (expensesByCategory && totalExpenseArs > 0) {
        const categories = Object.entries(expensesByCategory) as [string, number][];
        if (categories.length > 0) {
            const sorted = categories.sort((a, b) => b[1] - a[1]);
            const [topCategory, topAmount] = sorted[0];
            const topPercent = Math.round((topAmount / totalExpenseArs) * 100);

            if (topPercent >= 50) {
                insights.push({
                    type: 'WARNING',
                    message: `"${topCategory}" representa el ${topPercent}% de todos tus gastos. Considerá diversificar.`,
                    category: 'Categorías'
                });
            } else if (topPercent >= 30) {
                insights.push({
                    type: 'INFO',
                    message: `Tu mayor gasto es "${topCategory}" con el ${topPercent}% del total.`,
                    category: 'Categorías'
                });
            }
        }
    }

    // ─── 5. Velocidad de gasto diario ───
    if (totalExpenseArs > 0 && currentDay > 3) {
        const dailySpendRate = totalExpenseArs / currentDay;
        const projectedMonthEnd = dailySpendRate * daysInMonth;

        if (budgetArs > 0 && projectedMonthEnd > budgetArs * 1.2) {
            insights.push({
                type: 'WARNING',
                message: `A tu ritmo actual (${formatMoney(Math.round(dailySpendRate))}/día), terminarías el mes gastando un ${Math.round((projectedMonthEnd / budgetArs - 1) * 100)}% más del presupuesto.`,
                category: 'Ritmo'
            });
        }
    }

    // ─── 6. Sin ingresos registrados ───
    if (totalIncomeArs === 0 && totalExpenseArs > 0) {
        insights.push({
            type: 'INFO',
            message: 'No registraste ingresos este mes. Si cobraste, agregalos para tener un flujo preciso.',
            category: 'Datos'
        });
    }

    // ─── Fallback: todo bien ───
    if (insights.length === 0) {
        insights.push({
            type: 'SUCCESS',
            message: 'Tu salud financiera se ve estable este mes. ¡Seguí así!',
            category: 'General'
        });
    }

    return insights;
}
