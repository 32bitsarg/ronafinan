'use client';
import styles from './ForecastChart.module.css';

interface ForecastData {
    month: string;
    expectedBalance: number;
}

export default function ForecastChart({ data }: { data: ForecastData[] }) {
    if (!data || data.length === 0) return null;

    // Matemáticas de renderizado para grilla vectorial SVG (Wall Street Minimalist)
    const maxVal = Math.max(...data.map(d => d.expectedBalance));
    // Damos un colchón para q no toque el fondo, a menos q caiga en negativo
    const minVal = Math.min(...data.map(d => d.expectedBalance), 0);

    const height = 160;
    const width = 340;
    const paddingX = 20;
    const paddingY = 30;

    const range = (maxVal - minVal) || 1;

    // Calculamos las coordenadas exactas de cada mes proyectado
    const points = data.map((d, i) => {
        const x = paddingX + (i * ((width - paddingX * 2) / (data.length - 1)));
        const y = height - paddingY - ((d.expectedBalance - minVal) / range) * (height - paddingY * 2);
        return `${x},${y}`;
    }).join(' ');

    const formatShortMoney = (val: number) => {
        if (Math.abs(val) >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
        if (Math.abs(val) >= 1000) return `${(val / 1000).toFixed(0)}k`;
        return val.toFixed(0);
    };

    return (
        <div className={styles.chartWrapper}>
            <svg viewBox={`0 0 ${width} ${height}`} className={styles.svg}>
                {/* Eje X (Línea de base temporal) */}
                <line
                    x1={paddingX} y1={height - paddingY + 10}
                    x2={width - paddingX} y2={height - paddingY + 10}
                    stroke="var(--border-subtle)" strokeWidth="1"
                />

                {/* Línea del gráfico */}
                <polyline
                    fill="none"
                    stroke="var(--accent-primary)"
                    strokeWidth="3"
                    points={points}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={styles.animatedLine}
                />

                {/* Puntos de Datos Mes a Mes */}
                {data.map((d, i) => {
                    const x = paddingX + (i * ((width - paddingX * 2) / (data.length - 1)));
                    const y = height - paddingY - ((d.expectedBalance - minVal) / range) * (height - paddingY * 2);

                    const isNegativeTrend = d.expectedBalance < data[0].expectedBalance;

                    return (
                        <g key={d.month}>
                            {/* Círculo del punto */}
                            <circle
                                cx={x} cy={y} r="5"
                                fill="var(--bg-main)"
                                stroke={isNegativeTrend && i > 0 ? "var(--error)" : "var(--accent-primary)"}
                                strokeWidth="2.5"
                                className={styles.animatedDot}
                            />

                            {/* Etiqueta del Mes */}
                            <text x={x} y={height - 5} fontSize="11" fill="var(--text-secondary)" textAnchor="middle" fontWeight="500">
                                {d.month}
                            </text>

                            {/* Hover / Label del Monto */}
                            <text x={x} y={y - 12} fontSize="10" fill="var(--text-primary)" textAnchor="middle" fontWeight="700">
                                ${formatShortMoney(d.expectedBalance)}
                            </text>
                        </g>
                    );
                })}
            </svg>
        </div>
    );
}
