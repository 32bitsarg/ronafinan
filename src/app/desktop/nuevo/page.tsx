import TransactionForm from "@/components/TransactionForm";
import { getAccounts } from "@/actions/transaction";

export const dynamic = 'force-dynamic';

export default async function NuevoMovimientoDesktop() {
    const accounts = await getAccounts();

    return (
        <div>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.5rem', margin: '0 0 0.2rem 0', fontWeight: '700' }}>Nuevo Movimiento</h1>
                    <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.9rem' }}>Registra ingresos, gastos o transferencias entre cuentas</p>
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '2rem' }}>
                {/* Panel de Formulario Principal (7 Columnas) */}
                <div style={{ gridColumn: 'span 7' }}>
                    <div style={{ backgroundColor: 'var(--bg-surface)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                        <TransactionForm accounts={accounts} />
                    </div>
                </div>

                {/* Panel Informativo / Tips (5 Columnas) */}
                <div style={{ gridColumn: 'span 5', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ backgroundColor: 'var(--bg-main)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--accent-primary)', margin: '0 0 0.8rem 0' }}>💡 Tip de Gestión (Fórmula ZBB)</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5', margin: '0 0 1rem 0' }}>
                            Cada vez que declares un nuevo <strong>ingreso</strong>, recuerda ir a la pestaña de <em>Presupuestos</em> para empaquetarlo dentro de tus Sobres Mensuales.
                        </p>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5', margin: 0 }}>
                            Si retiras dinero del banco por el cajero automático, usa la pestaña de <strong>Transacción</strong> seleccionando de origen tu Banco y destino Efectivo. El balance neto seguirá siendo el mismo.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
