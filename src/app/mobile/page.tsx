import styles from "./page.module.css";
import TransactionList from "@/components/TransactionList";
import { User, Bell, Wallet, Building, CreditCard, HandCoins, PiggyBank, Banknote, SmartphoneNfc } from "lucide-react";
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
  const { accounts, totalBalanceArs, totalBalanceUsd, initialBalanceArs, initialBalanceUsd } = data;

  // Función para obtener iconos y colores por tipo de cuenta
  const getAccountStyles = (type: string) => {
    switch (type) {
      case 'SAVINGS':
        return {
          icon: <PiggyBank size={20} />,
          bgColor: 'hsl(125, 40%, 96%)',
          textColor: '#1f2937',
          iconColor: '#10b981'
        };
      case 'CASH':
        return {
          icon: <Banknote size={20} />,
          bgColor: 'hsl(45, 40%, 96%)',
          textColor: '#1f2937',
          iconColor: '#f59e0b'
        };
      case 'E-WALLET':
        return {
          icon: <SmartphoneNfc size={20} />,
          bgColor: 'hsl(199, 40%, 96%)',
          textColor: '#1f2937',
          iconColor: '#0ea5e9'
        };
      case 'BANK':
        return {
          icon: <Building size={20} />,
          bgColor: 'hsl(220, 30%, 97%)',
          textColor: '#1f2937',
          iconColor: '#3b82f6'
        };
      case 'CREDIT_CARD':
        return {
          icon: <CreditCard size={20} />,
          bgColor: 'hsl(262, 30%, 97%)',
          textColor: '#1f2937',
          iconColor: '#8b5cf6'
        };
      case 'DEBT':
        return {
          icon: <HandCoins size={20} />,
          bgColor: 'hsl(0, 30%, 97%)',
          textColor: '#1f2937',
          iconColor: '#ef4444'
        };
      default:
        return {
          icon: <Wallet size={20} />,
          bgColor: 'var(--bg-surface)',
          textColor: 'var(--text-primary)',
          iconColor: 'var(--accent-primary)'
        };
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
              {accounts.map(acc => {
                const stylesObj = getAccountStyles(acc.type);
                return (
                  <div
                    key={acc.id}
                    className={styles.accountCard}
                    style={{ backgroundColor: stylesObj.bgColor, borderColor: 'rgba(0,0,0,0.05)' }}
                  >
                    <div className={styles.accountIconWrap} style={{ backgroundColor: 'rgba(255,255,255,0.5)', color: stylesObj.iconColor, border: 'none' }}>
                      {stylesObj.icon}
                    </div>
                    <div className={styles.accountCardInfo}>
                      <p className={styles.accountName} style={{ color: stylesObj.textColor, opacity: 0.8 }}>{acc.name}</p>
                      <p className={styles.accountBalance} style={{ color: stylesObj.textColor }}>
                        {formatMoney(acc.balance, acc.currency)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Aquí está la Lista de Movimientos Recientes */}
        <TransactionList />
      </main>
    </div>
  );
}
