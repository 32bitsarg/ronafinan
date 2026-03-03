'use client';

import { useCurrency } from '@/lib/CurrencyContext';

interface Props {
    amount: number;
    originalCurrency?: string;
}

/**
 * Componente para mostrar montos que reaccionan al CurrencyContext global.
 * Si originalCurrency es proveído, se hará la conversión automática usando el exchangeRate del context.
 */
export default function FormattedAmount({ amount, originalCurrency }: Props) {
    const { format } = useCurrency();
    return <>{format(amount, originalCurrency)}</>;
}
