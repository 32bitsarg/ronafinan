'use client';
import styles from './ForecastChart.module.css';
import { useSimulation } from '@/lib/SimulationContext';

interface ForecastData {
    month: string;
    expectedBalance: number;
}

export default function ForecastChart({ data }: { data: ForecastData[] }) {
    if (!data || data.length === 0) return null;

    const maxVal = Math.max(...data.map(d => d.expectedBalance));
    const minVal = Math.min(...data.map(d => d.expectedBalance), 0);
    const range = (maxVal - minVal) || 1;

    const height = 180;
    const width = 500;
    const paddingX = 40;
    const paddingY = 45;

    const getX = (i: number) => paddingX + (i * ((width - paddingX * 2) / (data.length - 1)));
    const getY = (val: number) => height - paddingY - ((val - minVal) / range) * (height - paddingY * 2);

    // Smooth path algorithm (Cubic Bézier)
    const points = data.map((d, i) => ({ x: getX(i), y: getY(d.expectedBalance) }));

    const linePath = points.reduce((path, point, i, rows) => {
        if (i === 0) return `M ${point.x},${point.y}`;
        const prev = rows[i - 1];
        const cp1x = prev.x + (point.x - prev.x) / 2;
        return `${path} C ${cp1x},${prev.y} ${cp1x},${point.y} ${point.x},${point.y}`;
    }, "");

    // Path for the area fill
    const areaPath = `${linePath} L ${getX(data.length - 1)} ${height - paddingY} L ${getX(0)} ${height - paddingY} Z`;

    const formatShortMoney = (val: number) => {
        if (Math.abs(val) >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
        if (Math.abs(val) >= 1000) return `${(val / 1000).toFixed(0)}k`;
        return val.toFixed(0);
    };

    // Ghost Logic (Simulator)
    const { savingPercent } = useSimulation();

    // Simular un ahorro sobre el gasto estimado (asumiendo que gasta el 20% de su patrimonio al mes)
    const savingPower = (data[0].expectedBalance * 0.2) * (savingPercent / 100);
    const ghostPoints = data.map((d, i) => ({
        x: getX(i),
        y: getY(d.expectedBalance + (i * savingPower))
    }));

    const ghostPath = ghostPoints.reduce((path, point, i, rows) => {
        if (i === 0) return `M ${point.x},${point.y}`;
        const prev = rows[i - 1];
        const cp1x = prev.x + (point.x - prev.x) / 2;
        return `${path} C ${cp1x},${prev.y} ${cp1x},${point.y} ${point.x},${point.y}`;
    }, "");

    const ghostAreaPath = `${ghostPath} L ${getX(data.length - 1)} ${height - paddingY} L ${getX(0)} ${height - paddingY} Z`;

    return (
        <div className={styles.chartWrapper}>
            <svg viewBox={`0 0 ${width} ${height}`} className={styles.svg} preserveAspectRatio="xMidYMid meet">
                <defs>
                    <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#000" stopOpacity="0.08" />
                        <stop offset="100%" stopColor="#000" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="ghostGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.1" />
                        <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                    </linearGradient>
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                </defs>

                {/* Grid Lines (Subtle Horizontal) */}
                {[0.25, 0.75].map(tick => {
                    const y = getY(minVal + (tick * range));
                    return (
                        <line
                            key={tick}
                            x1={paddingX} y1={y} x2={width - paddingX} y2={y}
                            stroke="#f5f5f5" strokeWidth="1"
                        />
                    );
                })}

                {/* Ghost Effect (Only if saving) */}
                {savingPercent > 0 && (
                    <>
                        <path d={ghostAreaPath} fill="url(#ghostGradient)" />
                        <path
                            d={ghostPath}
                            fill="none"
                            stroke="#10b981"
                            strokeWidth="2"
                            strokeDasharray="4 4"
                            strokeLinecap="round"
                            opacity="0.6"
                        />
                    </>
                )}

                {/* Area Fill */}
                <path d={areaPath} fill="url(#areaGradient)" className={styles.animatedArea} />

                {/* Main Curve */}
                <path
                    d={linePath}
                    fill="none"
                    stroke="#000"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    filter="url(#glow)"
                    className={styles.animatedLine}
                />

                {/* Legend / Points */}
                {data.map((d, i) => {
                    const x = getX(i);
                    const y = getY(d.expectedBalance);

                    return (
                        <g key={d.month}>
                            {/* Mes label */}
                            <text x={x} y={height - 10} fontSize="11" fill="#999" textAnchor="middle" fontWeight="700">
                                {d.month.toUpperCase()}
                            </text>

                            {/* Data points (Smaller, sharper) */}
                            <circle
                                cx={x} cy={y} r="3"
                                fill="#000"
                                className={styles.animatedDot}
                                style={{ animationDelay: `${i * 0.1}s` }}
                            />

                            {/* Valor focal (Only first and last, or peaks) */}
                            {(i === 0 || i === data.length - 1) && (
                                <text x={x} y={y - 15} fontSize="12" fill="#000" textAnchor="middle" fontWeight="900" letterSpacing="-0.04em">
                                    {formatShortMoney(d.expectedBalance)}
                                </text>
                            )}
                        </g>
                    );
                })}
            </svg>
        </div>
    );
}
