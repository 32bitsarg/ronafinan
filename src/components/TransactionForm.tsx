'use client';

import { useRef, useTransition, useState } from 'react';
import imageCompression from 'browser-image-compression';
import { addTransaction } from '@/actions/transaction';
import styles from './TransactionForm.module.css';
import { PlusCircle, Loader2, ArrowRightLeft, Camera } from 'lucide-react';

type Account = {
    id: string;
    name: string;
    type: string;
    balance: number;
    currency: string;
};

type Props = {
    accounts: Account[];
};

export default function TransactionForm({ accounts }: Props) {
    const formRef = useRef<HTMLFormElement>(null);
    const [isPending, startTransition] = useTransition();
    const [transactionType, setTransactionType] = useState('EXPENSE');
    const [isInstallments, setIsInstallments] = useState(false);
    const [receiptFile, setReceiptFile] = useState<File | null>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) {
            setReceiptFile(null);
            return;
        }

        try {
            const options = {
                maxSizeMB: 0.5, // 500 KB max
                maxWidthOrHeight: 1024,
                useWebWorker: true,
            };
            const compressedFile = await imageCompression(file, options);
            setReceiptFile(compressedFile);
        } catch (error) {
            console.error(error);
            alert("Error al procesar la imagen.");
        }
    };

    async function actionSubmit(formData: FormData) {
        if (receiptFile) {
            formData.append('receipt', receiptFile);
        }

        startTransition(async () => {
            try {
                const res = await addTransaction(formData);
                if (res?.error) {
                    alert(res.error);
                } else {
                    formRef.current?.reset();
                    setTransactionType('EXPENSE');
                    setReceiptFile(null);
                }
            } catch (err) {
                alert((err as Error).message);
            }
        });
    }

    return (
        <div className={styles.formCard}>
            <form ref={formRef} action={actionSubmit} className={styles.formContainer}>

                {/* 1. Selector de Tipo y Monto */}
                <div className={styles.row}>
                    <div className={styles.fieldGroup}>
                        <label htmlFor="type">Tipo</label>
                        <select
                            name="type"
                            id="type"
                            className={styles.input}
                            required
                            value={transactionType}
                            onChange={(e) => setTransactionType(e.target.value)}
                        >
                            <option value="EXPENSE">Gasto</option>
                            <option value="INCOME">Ingreso</option>
                            <option value="TRANSFER">Inter-Transferencia</option>
                        </select>
                    </div>
                    <div className={styles.fieldGroup}>
                        <label htmlFor="amount">Monto ($)</label>
                        <input
                            name="amount"
                            id="amount"
                            type="number"
                            step="any"
                            placeholder="Ej. 1500"
                            className={styles.input}
                            required
                        />
                    </div>
                </div>

                {/* 2. Lógica Dinámica de Cuentas (Desde -> Hacia) */}
                <div className={styles.row}>
                    <div className={styles.fieldGroup}>
                        <label htmlFor="accountId">
                            {transactionType === 'INCOME' ? 'Guardar Dinero En' : 'Mover Dinero Desde'}
                        </label>
                        <select name="accountId" id="accountId" className={styles.input} required>
                            {accounts.map(acc => (
                                <option key={acc.id} value={acc.id}>
                                    {acc.name} ({acc.currency} {acc.balance})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Si es una transferencia INTERNA, mostramos dinámicamente el destino */}
                    {transactionType === 'TRANSFER' && (
                        <div className={styles.fieldGroup}>
                            <label htmlFor="toAccountId">Hacia (Destino)</label>
                            <select name="toAccountId" id="toAccountId" className={styles.input} required>
                                {accounts.map(acc => (
                                    <option key={acc.id} value={acc.id}>
                                        {acc.name} ({acc.currency})
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>

                {/* --- Lógica Smart Debt: Cuotas (Aislado para Gastos) --- */}
                {transactionType === 'EXPENSE' && (
                    <div className={styles.row}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '0.5rem 0', width: '100%' }}>
                            <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    checked={isInstallments}
                                    onChange={(e) => setIsInstallments(e.target.checked)}
                                    style={{ transform: 'scale(1.2)' }}
                                />
                                💳 Gasto en Cuotas
                            </label>

                            {isInstallments && (
                                <div style={{ flex: 1 }}>
                                    <input
                                        name="installments"
                                        type="number"
                                        min="2"
                                        max="48"
                                        defaultValue="3"
                                        placeholder="Cuotas"
                                        className={styles.input}
                                        required={isInstallments}
                                        style={{ marginTop: 0, padding: '0.6rem' }}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* 3. Categoría y Notas */}
                <div className={styles.fieldGroup}>
                    <label htmlFor="category">Categoría</label>
                    <input
                        name="category"
                        id="category"
                        type="text"
                        placeholder="Comida, Sueldo, Transferencia..."
                        className={styles.input}
                        required
                    />
                </div>

                <div className={styles.fieldGroup}>
                    <label htmlFor="description">Descripción (Opcional)</label>
                    <input
                        name="description"
                        id="description"
                        type="text"
                        placeholder="Notas adicionales..."
                        className={styles.input}
                    />
                </div>

                {/* Comprobante Image Upload */}
                <div className={styles.fieldGroup} style={{ border: '1px dashed var(--border-subtle)', padding: '1rem', borderRadius: '8px', textAlign: 'center', backgroundColor: 'var(--bg-main)' }}>
                    <label htmlFor="receipt" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                        <Camera size={24} color={receiptFile ? 'var(--success)' : 'var(--text-secondary)'} />
                        <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>
                            {receiptFile ? `✅ ${receiptFile.name} (${(receiptFile.size / 1024).toFixed(0)} KB)` : 'Adjuntar Comprobante (Opcional)'}
                        </span>
                    </label>
                    <input
                        type="file"
                        id="receipt"
                        accept="image/*"
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                    />
                </div>

                <button
                    type="submit"
                    disabled={isPending}
                    className={styles.submitBtn}
                >
                    {isPending ? (
                        <>
                            <Loader2 size={20} className="animate-spin" />
                            Procesando...
                        </>
                    ) : (
                        <>
                            {transactionType === 'TRANSFER' ? <ArrowRightLeft size={20} /> : <PlusCircle size={20} />}
                            {transactionType === 'TRANSFER' ? 'Registrar Transferencia' : 'Añadir Registro'}
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}
