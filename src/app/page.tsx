import { verifySession } from '@/lib/session';
import Link from 'next/link';
import AppRouterButton from '@/components/AppRouterButton';
import { ArrowRight, ShieldCheck, Wallet, LineChart, PieChart } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function LandingPage() {
    const session = await verifySession();
    const isLoggedIn = !!session?.userId;

    return (
        <div style={{ backgroundColor: 'var(--bg-main)', minHeight: '100vh', color: 'var(--text-primary)', fontFamily: 'var(--font-geist-sans)' }}>

            {/* Header / Nav */}
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 5%', borderBottom: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-surface)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                    <div style={{ backgroundColor: 'var(--text-primary)', color: 'var(--bg-main)', padding: '8px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Wallet size={24} />
                    </div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: '800', margin: 0, letterSpacing: '-0.02em' }}>RoNa Finance</h1>
                </div>

                <nav style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    {!isLoggedIn ? (
                        <>
                            <Link href="/login" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: '600', transition: 'color 0.2s' }}>Iniciar Sesión</Link>
                            <Link href="/registro" style={{ backgroundColor: 'var(--text-primary)', color: 'var(--bg-main)', padding: '0.6rem 1.2rem', borderRadius: '8px', textDecoration: 'none', fontWeight: '600', transition: 'opacity 0.2s' }}>Crear Cuenta</Link>
                        </>
                    ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <span style={{ color: 'var(--success)', fontWeight: '600', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}><ShieldCheck size={18} /> Sesión Activa</span>
                        </div>
                    )}
                </nav>
            </header>

            {/* Hero Section */}
            <main style={{ padding: '6rem 5% 4rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', background: 'radial-gradient(ellipse at top, var(--bg-surface), var(--bg-main) 70%)' }}>
                <div style={{ display: 'inline-block', border: '1px solid var(--border-subtle)', borderRadius: '24px', padding: '0.4rem 1rem', color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '2rem', backgroundColor: 'var(--bg-surface)' }}>
                    ✨ La evolución de las finanzas personales
                </div>

                <h2 style={{ fontSize: 'clamp(3rem, 5vw, 4.5rem)', fontWeight: '800', lineHeight: 1.1, margin: '0 0 1.5rem 0', maxWidth: '800px', letterSpacing: '-0.03em' }}>
                    Maneja tu dinero con precisión <span style={{ color: 'var(--accent-primary)' }}>quirúrgica.</span>
                </h2>

                <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 0 3rem 0', lineHeight: 1.6 }}>
                    RoNa Finance unifica tus cuentas, presupuestos e inversiones en un ecosistema profesional. Base Cero (ZBB) para que cada centavo tenga destino.
                </p>

                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
                    {isLoggedIn ? (
                        <AppRouterButton />
                    ) : (
                        <>
                            <Link href="/registro" style={{
                                backgroundColor: 'var(--accent-primary)', color: 'var(--bg-main)', padding: '1rem 2.5rem', borderRadius: '12px', fontSize: '1.2rem', fontWeight: '700', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.6rem', transition: 'transform 0.2s'
                            }}>
                                Comenzar Gratis <ArrowRight size={20} />
                            </Link>
                        </>
                    )}
                </div>
            </main>

            {/* Features Section */}
            <section style={{ padding: '6rem 5%', backgroundColor: 'var(--bg-main)' }}>
                <h3 style={{ textAlign: 'center', fontSize: '2.5rem', fontWeight: '800', marginBottom: '4rem', color: 'var(--text-primary)' }}>Por qué elegir RoNa</h3>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', maxWidth: '1200px', margin: '0 auto' }}>

                    {/* Feature 1 */}
                    <div style={{ backgroundColor: 'var(--bg-surface)', padding: '2.5rem', borderRadius: '16px', border: '1px solid var(--border-subtle)' }}>
                        <div style={{ backgroundColor: 'var(--bg-main)', width: '50px', height: '50px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', color: 'var(--accent-primary)' }}>
                            <PieChart size={24} />
                        </div>
                        <h4 style={{ fontSize: '1.3rem', fontWeight: '700', margin: '0 0 1rem 0' }}>Zero-Based Budgeting</h4>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>Distribuye tu ingreso hasta quedar en cero. Un método implacable que previene deudas antes de que ocurran garantizando estabilidad a fin de mes.</p>
                    </div>

                    {/* Feature 2 */}
                    <div style={{ backgroundColor: 'var(--bg-surface)', padding: '2.5rem', borderRadius: '16px', border: '1px solid var(--border-subtle)' }}>
                        <div style={{ backgroundColor: 'var(--bg-main)', width: '50px', height: '50px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', color: 'var(--success)' }}>
                            <LineChart size={24} />
                        </div>
                        <h4 style={{ fontSize: '1.3rem', fontWeight: '700', margin: '0 0 1rem 0' }}>Portafolio de Inversión</h4>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>Desde Plazos Fijos hasta Cripto. Controla la plusvalía global de todos tus activos financieros actualizados con el tipo de cambio Dólar Libre en tiempo real.</p>
                    </div>

                    {/* Feature 3 */}
                    <div style={{ backgroundColor: 'var(--bg-surface)', padding: '2.5rem', borderRadius: '16px', border: '1px solid var(--border-subtle)' }}>
                        <div style={{ backgroundColor: 'var(--bg-main)', width: '50px', height: '50px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
                            <Wallet size={24} />
                        </div>
                        <h4 style={{ fontSize: '1.3rem', fontWeight: '700', margin: '0 0 1rem 0' }}>Ecosistema Multi-Billetera</h4>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>Ten cuentas ilimitadas: Bancos, Efectivo, Billeteras Virtuales. Sabe exactamente dónde está cada peso en una agenda inteligente y ordenada.</p>
                    </div>

                </div>
            </section>

            {/* Footer */}
            <footer style={{ padding: '3rem 5%', borderTop: '1px solid var(--border-subtle)', textAlign: 'center', color: 'var(--text-secondary)', backgroundColor: 'var(--bg-surface)' }}>
                <p>&copy; {new Date().getFullYear()} RoNa Finance. Diseñado para Desktop & Mobile.</p>
            </footer>

        </div>
    );
}
