'use client';

import { useCurrency } from '@/lib/CurrencyContext';
import styles from './CurrencySwitcher.module.css';

export default function CurrencySwitcher() {
    const { currency, setCurrency } = useCurrency();

    return (
        <div className={styles.container}>
            <button
                onClick={() => setCurrency('ARS')}
                className={`${styles.toggleBtn} ${currency === 'ARS' ? styles.active : ''}`}
            >
                ARS
            </button>
            <button
                onClick={() => setCurrency('USD')}
                className={`${styles.toggleBtn} ${currency === 'USD' ? styles.active : ''}`}
            >
                USD
            </button>
            <div className={`${styles.slider} ${currency === 'USD' ? styles.slideRight : ''}`} />
        </div>
    );
}
