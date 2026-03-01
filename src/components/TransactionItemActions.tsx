'use client';

import { useTransition } from 'react';
import { Trash2, Loader2 } from 'lucide-react';
import { deleteTransaction } from '@/actions/transaction';

export default function TransactionItemActions({ transactionId }: { transactionId: string }) {
    const [isPending, startTransition] = useTransition();

    const handleDelete = () => {
        if (confirm("¿Estás seguro de que deseas eliminar y revertir este movimiento?")) {
            startTransition(async () => {
                try {
                    await deleteTransaction(transactionId);
                } catch (e: any) {
                    alert(e.message);
                }
            });
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={isPending}
            style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-secondary)',
                cursor: isPending ? 'wait' : 'pointer',
                padding: '0.4rem',
                marginLeft: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}
            title="Eliminar movimiento"
        >
            {isPending ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
        </button>
    );
}
