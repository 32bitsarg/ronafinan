import { getDolarBlueRate } from './dolar';

/**
 * Simulación de API de Activos Real-time (Stocks/Crypto)
 * En un entorno productivo usaríamos AlphaVantage o CoinGecko.
 * Por ahora usaremos Yahoo Finance o un Mock robusto de CEDEARs si falla.
 */
export async function getAssetPrices(symbols: string[]) {
    if (!symbols || symbols.length === 0) return {};

    // Unificar para Argentina: Si es ALUA, GGAL, etc., son del MERVAL o CEDEARs.
    // Usaremos Yahoo Finance public API endpoint.
    try {
        const tickers = symbols.join(',');
        const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${tickers}`;

        const response = await fetch(url);
        const data = await response.json();

        const prices: Record<string, number> = {};

        if (data?.quoteResponse?.result) {
            data.quoteResponse.result.forEach((item: any) => {
                prices[item.symbol] = item.regularMarketPrice;
            });
        }

        return prices;
    } catch (error) {
        console.error("Error fetching asset prices:", error);
        // Fallback a precios estáticos si el fetch falla (sin internet o bloqueo)
        return {};
    }
}
