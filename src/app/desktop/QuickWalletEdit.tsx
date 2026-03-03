'use client';

import { useState, useActionState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Pencil, X, Save } from 'lucide-react';
import { editAccount } from '@/actions/accounts';
import styles from './page.module.css';

interface QuickWalletEditProps {
    account: {
        id: string;
        name: string;
        balance: number;
        currency: string;
        type: string;
    };
}

export default function QuickWalletEdit({ account }: QuickWalletEditProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [state, action, isPending] = useActionState(editAccount, null);

    // Aseguramos que el portal solo se intente renderizar en el cliente
    useEffect(() => {
        setMounted(true);
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    const closeModal = () => setIsOpen(false);

    const modalJSX = (
        <div className={styles.modalOverlay} onClick={closeModal}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h3>Editar Billetera</h3>
                    <button onClick={closeModal} className={styles.closeBtn}><X size={20} /></button>
                </div>

                <form action={async (formData) => {
                    await action(formData);
                    setIsOpen(false);
                }} className={styles.modalForm}>
                    <input type="hidden" name="accountId" value={account.id} />

                    <div className={styles.formGroup}>
                        <label>Nombre de la Cuenta</label>
                        <input
                            type="text"
                            name="name"
                            defaultValue={account.name}
                            required
                            autoFocus
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Saldo Actual ({account.currency})</label>
                        <input
                            type="number"
                            step="any"
                            name="balance"
                            defaultValue={account.balance < 0 ? account.balance * -1 : account.balance}
                            required
                        />
                    </div>

                    <div className={styles.modalActions}>
                        <button type="button" onClick={closeModal} className={styles.cancelBtn}>Cancelar</button>
                        <button type="submit" disabled={isPending} className={styles.saveBtn}>
                            {isPending ? 'Guardando...' : <><Save size={18} /> Guardar Cambios</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );

    return (
        <>
            <button
                onClick={(e) => { e.stopPropagation(); setIsOpen(true); }}
                className={styles.editWalletBtn}
                title="Editar Billetera"
            >
                <Pencil size={14} />
            </button>

            {isOpen && mounted && createPortal(modalJSX, document.body)}
        </>
    );
}
