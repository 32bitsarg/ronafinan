'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { formatMoney } from './formatters';

type Currency = 'ARS' | 'USD';

interface CurrencyContextType {
    currency: Currency;
    setCurrency: (c: Currency) => void;
    format: (amount: number, originalCurrency?: string) => string;
    convertToActive: (amount: number, from: string) => number;
    exchangeRate: number;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({
    children,
    initialExchangeRate
}: {
    children: React.ReactNode;
    initialExchangeRate: number
}) {
    const [currency, setCurrencyState] = useState<Currency>('ARS');

    // Persistencia básica
    useEffect(() => {
        const saved = localStorage.getItem('pref-currency') as Currency;
        if (saved && (saved === 'ARS' || saved === 'USD')) {
            setCurrencyState(saved);
        }
    }, []);

    const setCurrency = (c: Currency) => {
        setCurrencyState(c);
        localStorage.setItem('pref-currency', c);
    };

    const convertToActive = (amount: number, from: string) => {
        if (currency === from) return amount;
        if (currency === 'ARS') {
            return from === 'USD' ? amount * initialExchangeRate : amount;
        } else {
            return from === 'ARS' ? amount / initialExchangeRate : amount;
        }
    };

    const format = (amount: number, originalCurrency?: string) => {
        const targetAmount = originalCurrency ? convertToActive(amount, originalCurrency) : amount;
        return formatMoney(targetAmount, currency);
    };

    return (
        <CurrencyContext.Provider value={{
            currency,
            setCurrency,
            format,
            convertToActive,
            exchangeRate: initialExchangeRate
        }}>
            {children}
        </CurrencyContext.Provider>
    );
}

export function useCurrency() {
    const context = useContext(CurrencyContext);
    if (!context) {
        throw new Error('useCurrency must be used within a CurrencyProvider');
    }
    return context;
}
