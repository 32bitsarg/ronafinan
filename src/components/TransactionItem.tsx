'use client';

import { useState } from 'react';
import { TrendingUp, TrendingDown, ArrowRightLeft } from 'lucide-react';
import { formatMoney } from '@/lib/formatters';
import TransactionItemActions from './TransactionItemActions';
import ReceiptViewer from './ReceiptViewer';
import styles from './TransactionList.module.css';

interface TransactionItemProps {
    t: any;
}

export default function TransactionItem({ t }: TransactionItemProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    const dateObj = new Date(t.date);
    const isIncome = t.type === 'INCOME';
    const isTransfer = t.type === 'TRANSFER';

    // Decidir icono y colores
    let Icon = isIncome ? TrendingUp : TrendingDown;
    let iconClass = isIncome ? styles.textGreen : styles.textRed;
    let bgClass = isIncome ? styles.bgGreenLight : styles.bgRedLight;

    if (isTransfer) {
        Icon = ArrowRightLeft;
        iconClass = styles.textBlue;
        bgClass = styles.bgBlueLight;
    }

    const hasLongText = (t.category?.length || 0) > 30 || (t.description?.length || 0) > 30;

    return (
        <li
            className={`${styles.listItem} ${hasLongText ? styles.expandable : ''}`}
            onClick={() => hasLongText && setIsExpanded(!isExpanded)}
            style={{ cursor: hasLongText ? 'pointer' : 'default', flexDirection: 'column', alignItems: 'stretch' }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <div className={styles.itemLeft}>
                    <div className={`${styles.itemIcon} ${bgClass}`}>
                        <Icon size={20} className={iconClass} />
                    </div>
                    <div className={styles.itemInfo}>
                        <p className={`${styles.itemCategory} ${!isExpanded && t.category?.length > 25 ? styles.collapsedText : ''}`}>
                            {t.category}
                        </p>
                        <div className={styles.itemDate}>
                            <span className={!isExpanded ? styles.collapsedText : styles.expandedText}>
                                {t.description ? `${t.description} • ` : ''}
                                {dateObj.toLocaleDateString('es-AR', { day: '2-digit', month: 'short' })}
                            </span>
                            {t.receiptUrl && <ReceiptViewer url={t.receiptUrl} transactionId={t.id} />}
                        </div>
                    </div>
                </div>

                <div className={styles.itemRight} style={{ display: 'flex', alignItems: 'center' }}>
                    <p className={`${styles.itemAmount} ${isIncome ? styles.textGreen : (isTransfer ? styles.textBlue : styles.textPrimary)}`}>
                        {isIncome ? '+' : (isTransfer ? '' : '-')}{formatMoney(t.amount, t.currency)}
                    </p>
                    <TransactionItemActions transactionId={t.id} />
                </div>
            </div>

            {/* Si está expandido y tiene texto largo, mostramos el detalle completo abajo si fuera necesario, 
                aunque con las clases CSS de wrap ya debería bastar. Pero forzamos visibilidad clara. */}
            {isExpanded && hasLongText && (
                <div style={{ marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border-subtle)', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    <p><strong>Categoría:</strong> {t.category}</p>
                    {t.description && <p><strong>Nota:</strong> {t.description}</p>}
                </div>
            )}
        </li>
    );
}
