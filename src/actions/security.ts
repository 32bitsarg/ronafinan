'use server';

import { prisma } from '../lib/prisma';
import { getSession } from './auth';
import bcrypt from 'bcryptjs';

export async function changePassword(prevState: any, formData: FormData) {
    try {
        const user = await getSession();

        const currentPassword = formData.get('currentPassword') as string;
        const newPassword = formData.get('newPassword') as string;
        const confirmPassword = formData.get('confirmPassword') as string;

        if (!currentPassword || !newPassword || !confirmPassword) {
            throw new Error('Todos los campos son obligatorios.');
        }

        if (newPassword !== confirmPassword) {
            throw new Error('Las nuevas contraseñas no coinciden.');
        }

        if (newPassword.length < 6) {
            throw new Error('La nueva contraseña debe tener al menos 6 caracteres.');
        }

        // Recuperar el usuario con su password guardado
        const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
        if (!dbUser) throw new Error('Usuario no encontrado.');

        // Verificar la contraseña actual
        const isValid = await bcrypt.compare(currentPassword, dbUser.password);
        if (!isValid) {
            throw new Error('La contraseña actual es incorrecta.');
        }

        // Hashear la nueva contraseña y actualizar
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        await prisma.user.update({
            where: { id: user.id },
            data: { password: hashedNewPassword }
        });

        return { success: true, message: '¡Tu contraseña ha sido actualizada con éxito!' };
    } catch (e: any) {
        return { error: e.message };
    }
}
