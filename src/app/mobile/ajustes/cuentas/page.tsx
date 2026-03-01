import styles from '../page.module.css';
import { AccountManager } from '../ClientComponents';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default async function CuentasPage() {
    return (
        <div className={styles.container}>
            <header className={styles.header} style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <Link href="/mobile/ajustes" style={{ color: 'var(--text-primary)' }}>
                    <ArrowLeft size={28} />
                </Link>
                <h1 className={styles.title} style={{ margin: 0 }}>Gestión de Cuentas</h1>
            </header>
            <main className={styles.mainContent}>
                <AccountManager />
            </main>
        </div>
    );
}
