'use server';

import { prisma } from '../lib/prisma';
import { getSession } from './auth';
import { revalidatePath } from 'next/cache';

export async function createWorkspace(prevState: any, formData: FormData) {
    try {
        const user = await getSession();
        const name = formData.get('name') as string;

        if (!name) throw new Error("El nombre de la familia es requerido.");

        // Generamos un código único "Rona-XXXX"
        const inviteCode = 'RONA-' + Math.random().toString(36).substring(2, 8).toUpperCase();

        const workspace = await prisma.workspace.create({
            data: {
                name,
                inviteCode,
                members: {
                    create: {
                        userId: user.id,
                        role: 'ADMIN' // El creador es el administrador
                    }
                }
            }
        });

        // Cambiamos automáticamente al usuario a este nuevo entorno recién creado
        await prisma.user.update({
            where: { id: user.id },
            data: { activeWorkspaceId: workspace.id }
        });

        revalidatePath('/');
        return { success: true, message: `Familia creada con éxito. Código de invitación: ${inviteCode}` };
    } catch (e: any) {
        return { error: e.message };
    }
}

export async function joinWorkspace(prevState: any, formData: FormData) {
    try {
        const user = await getSession();
        let inviteCode = formData.get('inviteCode') as string;

        if (!inviteCode) throw new Error("Código de invitación requerido.");
        inviteCode = inviteCode.trim().toUpperCase(); // Normalización para UX

        // Buscamos la casa/workspace por medio de su código
        const workspace = await prisma.workspace.findUnique({
            where: { inviteCode }
        });

        if (!workspace) throw new Error("Código de invitación inválido o no existe.");

        // Verificamos si el usuario ya es miembro de esa familia
        const existingMember = await prisma.workspaceMember.findUnique({
            where: {
                userId_workspaceId: {
                    userId: user.id,
                    workspaceId: workspace.id
                }
            }
        });

        if (existingMember) throw new Error("Ya eres miembro de esta familia.");

        // Lo agregamos como miembro normal
        await prisma.workspaceMember.create({
            data: {
                userId: user.id,
                workspaceId: workspace.id,
                role: 'MEMBER'
            }
        });

        // Cambiamos automáticamente al usuario a su nueva familia
        await prisma.user.update({
            where: { id: user.id },
            data: { activeWorkspaceId: workspace.id }
        });

        revalidatePath('/');
        return { success: true, message: `Te has unido a la familia: ${workspace.name}` };
    } catch (e: any) {
        return { error: e.message };
    }
}
