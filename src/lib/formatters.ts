export function formatMoney(val: number, currency: string = 'ARS') {
    // Check si hay decimales que importen para mostrarlos o no
    const hasDecimals = val % 1 !== 0;

    if (currency === 'USD') {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: hasDecimals ? 2 : 0,
            maximumFractionDigits: 2
        }).format(val);
    }

    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
        minimumFractionDigits: hasDecimals ? 2 : 0,
        maximumFractionDigits: 2
    }).format(val);
}
