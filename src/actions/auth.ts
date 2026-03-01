'use server';

import { prisma } from '../lib/prisma';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';
import { createSession, deleteSession, verifySession } from '../lib/session';
import { redirect } from 'next/navigation';

export async function login(formData: FormData) {
    try {
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return { error: "Credenciales inválidas." };

        const passwordsMatch = await bcrypt.compare(password, user.password);
        if (!passwordsMatch) return { error: "Credenciales inválidas." };

        await createSession(user.id);
        return { success: true };
    } catch (e: any) {
        return { error: "Error de servidor o base de datos temporal." };
    }
}

export async function register(formData: FormData) {
    try {
        const name = formData.get('name') as string;
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        const confirmPassword = formData.get('confirmPassword') as string;

        if (!name || !email || !password) return { error: "Todos los campos son requeridos." };
        if (password !== confirmPassword) return { error: "Las contraseñas no coinciden." };

        // Validación de seguridad de contraseña
        if (password.length < 10) return { error: "La contraseña debe tener al menos 10 caracteres." };
        if (!/[A-Z]/.test(password)) return { error: "La contraseña debe contener al menos una letra mayúscula." };
        if (!/[a-z]/.test(password)) return { error: "La contraseña debe contener al menos una letra minúscula." };
        if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) return { error: "La contraseña debe contener al menos un carácter especial." };

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) return { error: "El email ya está en uso." };

        const hashedPassword = await bcrypt.hash(password, 10);
        const workspaceId = crypto.randomUUID();

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                activeWorkspaceId: workspaceId,
                workspaces: {
                    create: [
                        {
                            workspace: { create: { id: workspaceId, name: `Personal` } },
                            role: 'ADMIN'
                        }
                    ]
                }
            }
        });

        await createSession(user.id);
        return { success: true };
    } catch (e: any) {
        return { error: "Error de servidor o base de datos. Verifica conexión." };
    }
}

export async function logout() {
    await deleteSession();
    redirect('/login');
}

export async function getSession() {
    const session = await verifySession();
    if (!session) {
        redirect('/login?clear_session=true');
    }

    const user = await prisma.user.findUnique({
        where: { id: session.userId },
        include: { workspaces: { include: { workspace: true } } }
    });

    if (!user) {
        redirect('/login?clear_session=true');
    }
    return user;
}

export async function getAvailableWorkspaces() {
    const user = await getSession();
    return user.workspaces.map(m => m.workspace);
}

export async function switchWorkspace(workspaceId: string, currentPath: string) {
    const user = await getSession();
    await prisma.user.update({
        where: { id: user.id },
        data: { activeWorkspaceId: workspaceId }
    });
    revalidatePath(currentPath);
}
