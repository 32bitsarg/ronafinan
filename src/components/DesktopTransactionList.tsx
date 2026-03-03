'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Paperclip, ArrowRightLeft, ChevronDown } from 'lucide-react';
import TransactionItemActions from './TransactionItemActions';
import ReceiptViewer from './ReceiptViewer';
import { formatMoney } from '@/lib/formatters';
import styles from './DesktopTransactionList.module.css';

export default function DesktopTransactionList({ transactions }: { transactions: any[] }) {
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const toggleExpand = (id: string, e: React.MouseEvent) => {
        // Prevent expansion if clicking on actions or receipt
        if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('a')) return;
        setExpandedId(expandedId === id ? null : id);
    };

    if (!transactions || transactions.length === 0) {
        return (
            <div className={styles.empty}>
                <Paperclip size={48} opacity={0.2} />
                <p>Aún no hay movimientos registrados.</p>
            </div>
        );
    }

    return (
        <div className={styles.wrapper}>
            <table className={styles.table}>
                <thead className={styles.thead}>
                    <tr>
                        <th style={{ paddingLeft: '1rem' }}>Descripción</th>
                        <th>Fecha y Hora</th>
                        <th>Estado</th>
                        <th style={{ textAlign: 'right', paddingRight: '1rem' }}>Monto</th>
                        <th style={{ width: '40px' }}></th>
                    </tr>
                </thead>
                <tbody className={styles.tbody}>
                    {transactions.map(t => {
                        const dateObj = new Date(t.date);
                        const isExpanded = expandedId === t.id;

                        let badgeClass = styles.badge;
                        let label = 'Egreso';

                        if (t.type === 'INCOME') {
                            badgeClass += ` ${styles.badgeIncome}`;
                            label = 'Ingreso';
                        } else if (t.type === 'TRANSFER') {
                            badgeClass += ` ${styles.badgeTransfer}`;
                            label = 'Transf.';
                        } else {
                            badgeClass += ` ${styles.badgeExpense}`;
                        }

                        return (
                            <tr
                                key={t.id}
                                className={`${styles.row} ${isExpanded ? styles.expandedRow : ''}`}
                                onClick={(e) => toggleExpand(t.id, e)}
                            >
                                <td style={{ paddingLeft: '1rem' }}>
                                    <div className={styles.infoColumn}>
                                        <div className={`${styles.iconBox} ${t.type === 'INCOME' ? styles.badgeIncome : (t.type === 'TRANSFER' ? styles.badgeTransfer : styles.badgeExpense)}`}>
                                            {t.type === 'INCOME' ? <TrendingUp size={20} /> : (t.type === 'TRANSFER' ? <ArrowRightLeft size={20} /> : <TrendingDown size={20} />)}
                                        </div>
                                        <div className={styles.textContainer}>
                                            <p className={`${styles.title} ${isExpanded ? styles.fullText : ''}`}>{t.description || t.category}</p>
                                            <p className={`${styles.subtitle} ${isExpanded ? styles.fullText : ''}`}>{t.category}</p>

                                            {isExpanded && t.description && (
                                                <div className={styles.expandedContent}>
                                                    <p><strong>Nota:</strong> {t.description}</p>
                                                </div>
                                            )}
                                        </div>
                                        {t.receiptUrl && <ReceiptViewer url={t.receiptUrl} transactionId={t.id} />}
                                    </div>
                                </td>
                                <td className={styles.date}>
                                    {mounted ? (
                                        <>
                                            {dateObj.toLocaleDateString('es-AR', { day: '2-digit', month: 'short' })} · {dateObj.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
                                        </>
                                    ) : (
                                        <span style={{ opacity: 0 }}>Cargando...</span>
                                    )}
                                </td>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <span className={badgeClass}>{label}</span>
                                        <ChevronDown size={14} style={{ transform: isExpanded ? 'rotate(180deg)' : 'none', opacity: 0.3, transition: 'transform 0.2s' }} />
                                    </div>
                                </td>
                                <td
                                    className={styles.amount}
                                    style={{
                                        textAlign: 'right',
                                        paddingRight: '0.5rem',
                                        color: t.type === 'INCOME' ? '#10b981' : (t.type === 'TRANSFER' ? '#3b82f6' : '#ef4444')
                                    }}
                                >
                                    {t.type === 'INCOME' ? '+' : (t.type === 'TRANSFER' ? '' : '-')}{formatMoney(t.amount, t.currency)}
                                </td>
                                <td onClick={(e) => e.stopPropagation()}>
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
