'use server';

import { prisma } from '../lib/prisma';
import { revalidatePath } from 'next/cache';

/**
 * Función Lazy Load para registrar Transacciones Recurrentes (Ingresos o Suscripciones) que hayan vencido.
 * Se llama automáticamente cada vez que el usuario abre el Dashboard.
 */
export async function processDueRecurringTransactions() {
    const today = new Date();
    // Normalizamos 'today' a fecha sin horas para evitar problemas de desfase horario
    const currentDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    // 1. Buscamos todas las transacciones recurrentes activas
    const activeRecurring = await prisma.recurringTransaction.findMany({
        where: { isActive: true }
    });

    let newChargesCount = 0;

    for (const recur of activeRecurring) {
        // MVP: Solo soportamos pagos MENSUALES por ahora, más adelante expandir "WEEKLY/DAILY"
        let shouldProcess = false;
        let targetDate = currentDate;

        // Lógica de cálculo de fecha de vencimiento según frecuencia
        if (recur.frequency === 'MONTHLY') {
            if (recur.dayOfMonth && currentDate.getDate() >= recur.dayOfMonth) {
                if (!recur.lastProcessed) {
                    shouldProcess = true;
                } else {
                    const lastDate = new Date(recur.lastProcessed);
                    if (lastDate.getFullYear() !== currentDate.getFullYear() || lastDate.getMonth() !== currentDate.getMonth()) {
                        shouldProcess = true;
                    }
                }
                targetDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), recur.dayOfMonth || 1);
            }
        } else {
            // Para WEEKLY y BIWEEKLY usamos diferencia de días
            const lastDate = recur.lastProcessed ? new Date(recur.lastProcessed) : new Date(recur.createdAt);
            const diffTime = Math.abs(currentDate.getTime() - lastDate.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            const daysNeeded = recur.frequency === 'WEEKLY' ? 7 : 14;

            if (diffDays >= daysNeeded) {
                shouldProcess = true;
                // La fecha de compra/cobro es N días después de la última
                targetDate = new Date(lastDate);
                targetDate.setDate(targetDate.getDate() + daysNeeded);
            }
        }

        if (shouldProcess) {
            // Si es cuota, lo agregamos a la descripción
            let desc = `Cobro/Pago Automático: ${recur.name}`;
            let isNowCompleted = false;
            let nextInstallment = recur.currentInstallment;

            if (recur.totalInstallments && recur.currentInstallment) {
                desc = `${recur.name} (Cuota ${recur.currentInstallment}/${recur.totalInstallments})`;

                if (recur.currentInstallment >= recur.totalInstallments) {
                    isNowCompleted = true; // Se acabó la fiesta
                } else {
                    nextInstallment = recur.currentInstallment + 1;
                }
            }

            // 2. Insertamos la transacción real
            await prisma.transaction.create({
                data: {
                    amount: recur.amount,
                    currency: recur.currency,
                    type: recur.type,
                    category: recur.category,
                    description: desc,
                    date: targetDate,
                    workspaceId: recur.workspaceId
                }
            });

            // 3. MARCADO: Actualizamos para indicar que "ya se procesó"
            await prisma.recurringTransaction.update({
                where: { id: recur.id },
                data: {
                    lastProcessed: targetDate, // Usamos la fecha del evento, no necesariamente 'hoy' si hay atraso
                    isActive: !isNowCompleted,
                    currentInstallment: nextInstallment
                }
            });

            newChargesCount++;
        }
    }

    // Le decimos a Next que si hubo cobros nuevos, refresque el balance del inicio
    if (newChargesCount > 0) {
        revalidatePath('/');
    }

    return newChargesCount;
}
