import styles from "../page.module.css";
import TransactionForm from "@/components/TransactionForm";
import { getAccounts } from "@/actions/transaction";

export const dynamic = 'force-dynamic';

export default async function NuevoMovimientoPage() {
    // Necesitamos las cuentas para que el usuario pueda seleccionar de dónde sale o entra el dinero
    const accounts = await getAccounts();

    return (
        <div className={styles.appContainer}>
            <header className={styles.appHeader}>
                <div>
                    <h1 className={styles.brandName} style={{ fontSize: '1.5rem' }}>Nuevo Movimiento</h1>
                    <p className={styles.greeting}>Registra ingresos, gastos o transferencias</p>
                </div>
            </header>

            <main className={styles.mainContent} style={{ paddingTop: '1rem' }}>
                <TransactionForm accounts={accounts} />
            </main>
        </div>
    );
}
