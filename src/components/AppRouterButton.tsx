'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LayoutDashboard } from 'lucide-react';

export default function AppRouterButton() {
    const router = useRouter();
    const [isChecking, setIsChecking] = useState(false);

    const handleEnterApp = () => {
        setIsChecking(true);
        const isMobile = window.innerWidth <= 768;
        if (isMobile) {
            router.push('/mobile');
        } else {
            router.push('/desktop');
        }
    };

    return (
        <button
            onClick={handleEnterApp}
            disabled={isChecking}
            style={{
                backgroundColor: 'var(--accent-primary)',
                color: 'var(--bg-main)',
                padding: '1rem 2.5rem',
                borderRadius: '12px',
                fontSize: '1.2rem',
                fontWeight: '700',
                border: 'none',
                cursor: isChecking ? 'wait' : 'pointer',
                transition: 'transform 0.2s, opacity 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '0.8rem',
                opacity: isChecking ? 0.8 : 1
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
            <LayoutDashboard size={24} />
            {isChecking ? 'Redirigiendo...' : 'Ir a mi Panel'}
        </button>
    );
}
