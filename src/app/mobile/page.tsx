import styles from "./page.module.css";
import TransactionList from "@/components/TransactionList";
import { User, Bell, Wallet, Building, CreditCard, HandCoins } from "lucide-react";
import { processDueRecurringTransactions } from "@/actions/engine";
import { getDashboardData } from "@/actions/transaction";
import { getAvailableWorkspaces, getSession } from "@/actions/auth";
import WorkspaceSwitcher from "@/components/WorkspaceSwitcher";
import Link from 'next/link';
import { formatMoney } from '@/lib/formatters';

export const dynamic = 'force-dynamic';

export default async function Home() {
  await processDueRecurringTransactions();
  const session = await getSession();
  const workspaces = await getAvailableWorkspaces();
  const data = await getDashboardData();
  const { accounts, totalBalanceArs, totalBalanceUsd } = data;

  // Función para renderizar el icono adecuado por tipo de cuenta
  const renderAccountIcon = (type: string) => {
    switch (type) {
      case 'CASH': return <Wallet size={20} />;
      case 'BANK': return <Building size={20} />;
      case 'CREDIT_CARD': return <CreditCard size={20} color="var(--accent-primary)" />;
      case 'DEBT': return <HandCoins size={20} color="var(--error)" />;
      default: return <Wallet size={20} />;
    }
  };

  return (
    <div className={styles.appContainer}>
      <header className={styles.appHeader} style={{ position: 'relative', alignItems: 'center', flexDirection: 'column', gap: '1.5rem', paddingTop: '1.5rem' }}>

        {/* Botón de Notificaciones Fijo en la Esquina */}
        <button className={styles.iconButton} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem' }}>
          <Bell size={24} />
        </button>

        {/* 1. Branding Header: Logo + App Name + Switcher (Centrados) */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', marginTop: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ display: 'inline-flex', backgroundColor: 'var(--text-primary)', color: 'var(--bg-main)', padding: '6px', borderRadius: '50%' }}>
              <Wallet size={20} />
            </div>
            <span style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>RoNa Finance</span>
          </div>

          <div style={{ transform: 'scale(0.95)' }}>
            <WorkspaceSwitcher
              workspaces={workspaces.map(w => ({
                id: w.id,
                // Recortamos "Personal de X" a simplemente "Personal" para UX
                name: w.name.replace(/^Personal de .*$/, 'Personal')
              }))}
              activeId={session.activeWorkspaceId!}
            />
          </div>
        </div>

      </header>

      <main className={styles.mainContent}>
        {/* Carrusel de Cuentas (Billeteras y Bancos) */}
        <section className={styles.accountsSection}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', padding: '0 1.5rem' }}>
            <h2 className={styles.sectionTitleSmall} style={{ margin: 0 }}>Billeteras</h2>
          </div>

          {accounts.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: 'var(--bg-surface)', margin: '0 1.5rem', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
              <Wallet size={32} style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }} />
              <p style={{ color: 'var(--text-primary)', fontWeight: '600', marginBottom: '0.2rem' }}>No tienes billeteras</p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1rem' }}>Crea una billetera en ajustes para comenzar a registrar tu dinero.</p>
              <Link href="/mobile/ajustes" style={{ backgroundColor: 'var(--accent-primary)', color: 'white', textDecoration: 'none', padding: '0.6rem 1.2rem', borderRadius: '6px', fontWeight: '600', fontSize: '0.9rem' }}>
                Crear Billetera
              </Link>
            </div>
          ) : (
            <div className={styles.accountsScroll}>
              {accounts.map(acc => (
                <div key={acc.id} className={styles.accountCard}>
                  <div className={styles.accountIconWrap}>
                    {renderAccountIcon(acc.type)}
                  </div>
                  <div className={styles.accountCardInfo}>
                    <p className={styles.accountName}>{acc.name}</p>
                    <p className={styles.accountBalance}>
                      {formatMoney(acc.balance, acc.currency)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Aquí está la Lista de Movimientos Recientes */}
        <TransactionList />
      </main>
    </div>
  );
}
