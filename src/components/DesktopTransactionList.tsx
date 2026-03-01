'use client';

import { TrendingUp, TrendingDown, Paperclip } from 'lucide-react';
import TransactionItemActions from './TransactionItemActions';
import ReceiptViewer from './ReceiptViewer';
import { formatMoney } from '@/lib/formatters';

export default function DesktopTransactionList({ transactions }: { transactions: any[] }) {
    if (!transactions || transactions.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-secondary)' }}>
                <p>Aún no hay movimientos registrados.</p>
            </div>
        );
    }


    return (
        <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}>
                        <th style={{ padding: '1rem', fontWeight: 500 }}>Tipo</th>
                        <th style={{ padding: '1rem', fontWeight: 500 }}>Categoría</th>
                        <th style={{ padding: '1rem', fontWeight: 500 }}>Descripción</th>
                        <th style={{ padding: '1rem', fontWeight: 500 }}>Fecha</th>
                        <th style={{ padding: '1rem', fontWeight: 500, textAlign: 'right' }}>Monto</th>
                        <th style={{ padding: '1rem', fontWeight: 500, textAlign: 'center' }}>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map(t => {
                        const dateObj = new Date(t.date);
                        const isIncome = t.type === 'INCOME';

                        return (
                            <tr key={t.id} style={{ borderBottom: '1px solid var(--border-subtle)', transition: 'background 0.2s' }}>
                                <td style={{ padding: '1rem' }}>
                                    <div style={{ display: 'inline-flex', padding: '8px', borderRadius: '50%', backgroundColor: isIncome ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: isIncome ? 'var(--success)' : 'var(--error)' }}>
                                        {isIncome ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                                    </div>
                                </td>
                                <td style={{ padding: '1rem', fontWeight: 500 }}>{t.category}</td>
                                <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>
                                    {t.description || '-'}
                                    {t.receiptUrl && <ReceiptViewer url={t.receiptUrl} transactionId={t.id} />}
                                </td>
                                <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{dateObj.toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                                <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 'bold', color: isIncome ? 'var(--success)' : 'var(--text-primary)' }}>
                                    {isIncome ? '+' : '-'}{formatMoney(t.amount, t.currency)}
                                </td>
                                <td style={{ padding: '1rem', textAlign: 'center' }}>
                                    <TransactionItemActions transactionId={t.id} />
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
