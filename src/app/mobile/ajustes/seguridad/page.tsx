import styles from '../page.module.css';
import { SecurityToggles, ChangePasswordForm } from './ClientComponents';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default async function SeguridadPage() {
    return (
        <div className={styles.container}>
            <header className={styles.header} style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <Link href="/mobile/ajustes" style={{ color: 'var(--text-primary)' }}>
                    <ArrowLeft size={28} />
                </Link>
                <h1 className={styles.title} style={{ margin: 0 }}>Privacidad y Seguridad</h1>
            </header>
            <main className={styles.mainContent}>
                <SecurityToggles />
                <ChangePasswordForm />
            </main>
        </div>
    );
}
