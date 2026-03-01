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
        if (recur.frequency === 'MONTHLY' && recur.dayOfMonth && currentDate.getDate() >= recur.dayOfMonth) {
            let shouldProcess = false;

            // CASO A: Nunca se ha procesado (es nuevo este mes)
            if (!recur.lastProcessed) {
                shouldProcess = true;
            }
            // CASO B: Se procesó antes, pero ¿fue este mes?
            else {
                const lastDate = new Date(recur.lastProcessed);
                const lastMonth = lastDate.getMonth();
                const lastYear = lastDate.getFullYear();

                // Si el año o el mes es diferente, significa que todavía no se cobró/ingresó este mes exacto
                if (lastYear !== currentDate.getFullYear() || lastMonth !== currentDate.getMonth()) {
                    shouldProcess = true;
                }
            }

            if (shouldProcess) {
                // Generamos la fecha exacta del evento de este mes
                const eventDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), recur.dayOfMonth);

                // Si es cuota, lo agregamos a la descripción
                let desc = `Cobro/Pago Automático: ${recur.name}`;
                let isNowCompleted = false;
                let nextInstallment = recur.currentInstallment;

                if (recur.totalInstallments && recur.currentInstallment) {
                    desc = `${recur.name} (Cuota ${recur.currentInstallment}/${recur.totalInstallments})`;

                    if (recur.currentInstallment >= recur.totalInstallments) {
                        isNowCompleted = true; // Se acabó la fiesta, desactivamos la cuota para el próximo mes
                    } else {
                        nextInstallment = recur.currentInstallment + 1;
                    }
                }

                // 2. Insertamos la transacción real en el historial conectada a la familia
                await prisma.transaction.create({
                    data: {
                        amount: recur.amount,
                        currency: recur.currency,
                        type: recur.type, // INCOME o EXPENSE dinámico
                        category: recur.category,
                        description: desc,
                        date: eventDate,
                        workspaceId: recur.workspaceId // Asignado a su respectivo tenant!
                    }
                });

                // 3. MARCADO: Actualizamos para indicar que "ya se cobró hoy" y progresar/cerrar la cuota
                await prisma.recurringTransaction.update({
                    where: { id: recur.id },
                    data: {
                        lastProcessed: currentDate,
                        isActive: !isNowCompleted,
                        currentInstallment: nextInstallment
                    }
                });

                newChargesCount++;
            }
        }
    }

    // Le decimos a Next que si hubo cobros nuevos, refresque el balance del inicio
    if (newChargesCount > 0) {
        revalidatePath('/');
    }

    return newChargesCount;
}
