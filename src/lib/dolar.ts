/**
 * Servicio genérico para cotización en tiempo real del Dólar.
 * Utiliza DolarAPI (https://dolarapi.com/docs/) para obtener la cotización del Dólar Blue.
 * Se implementa ISR/Caching automático de Next.js para aligerar la carga de la red.
 */

export async function getDolarBlueRate(): Promise<number> {
    try {
        // Obtenemos la cotización del Blue, con cache revalidada cada 1 hora (3600 segundos) para no abrumar la API.
        const res = await fetch('https://dolarapi.com/v1/dolares/blue', {
            next: { revalidate: 3600 }
        });

        if (!res.ok) {
            console.error('Error al contactar DolarAPI:', res.statusText);
            return 1200; // Fallback de seguridad en caso de caída temporal
        }

        const data = await res.json();

        // Retornamos el valor de "venta" del dólar blue (cotización de mercado libre)
        return data.venta || 1200;

    } catch (error) {
        console.error('Excepción al consultar cotización:', error);
        return 1200; // Fallback de red
    }
}
