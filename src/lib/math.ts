/**
 * Utilidades matemáticas para el motor de predicción financiera.
 * Implementa Regresión Lineal Simple y métricas de confianza.
 */

export interface Point {
    x: number; // Generalmente el día del mes
    y: number; // Generalmente el balance acumulado
}

export interface RegressionResult {
    slope: number;      // Pendiente (m): Ritmo de gasto diario
    intercept: number;  // Intercepto (b): Balance inicial proyectado
    r2: number;         // Coeficiente de determinación: Calidad de la predicción (0 a 1)
}

/**
 * Calcula la Regresión Lineal Simple (y = mx + b)
 */
export function simpleLinearRegression(points: Point[]): RegressionResult {
    const n = points.length;
    if (n < 2) {
        return { slope: 0, intercept: points[0]?.y || 0, r2: 0 };
    }

    let sumX = 0;
    let sumY = 0;
    let sumXY = 0;
    let sumXX = 0;
    let sumYY = 0;

    for (const p of points) {
        sumX += p.x;
        sumY += p.y;
        sumXY += p.x * p.y;
        sumXX += p.x * p.x;
        sumYY += p.y * p.y;
    }

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    // Cálculo de R² (Coeficiente de determinación)
    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumXX - sumX * sumX) * (n * sumYY - sumY * sumY));

    // Si el denominador es 0 (puntos verticales u horizontales perfectos), R2 es 1 o 0
    const r2 = denominator === 0 ? 0 : Math.pow(numerator / denominator, 2);

    return { slope, intercept, r2 };
}

/**
 * Calcula el Stability Score basado en la varianza relativa.
 * Premisa: Menos varianza en el ritmo de gasto = Más estabilidad.
 */
export function calculateStabilityScore(points: Point[], regression: RegressionResult): number {
    if (points.length < 3) return 100; // No hay suficientes datos para juzgar

    // Calculamos el error residual promedio
    let totalResidualSq = 0;
    for (const p of points) {
        const predictedY = regression.slope * p.x + regression.intercept;
        totalResidualSq += Math.pow(p.y - predictedY, 2);
    }

    const standardError = Math.sqrt(totalResidualSq / points.length);
    const avgY = points.reduce((acc, p) => acc + p.y, 0) / points.length;

    // Normalizamos el score de 0 a 100
    // Un error del 20% sobre el promedio ya se considera inestable
    const stability = Math.max(0, 100 - (standardError / (avgY || 1)) * 200);

    return Math.round(stability);
}
