'use client';
import { useState, useTransition } from 'react';
import { Paperclip, Loader2, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { deleteReceipt } from '@/actions/transaction';

export default function ReceiptViewer({ url, transactionId }: { url: string, transactionId: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    const handleDelete = () => {
        if (!confirm('¿Seguro que quieres eliminar este comprobante?')) return;
        startTransition(async () => {
            try {
                await deleteReceipt(transactionId);
                setIsOpen(false);
            } catch (err) {
                alert((err as Error).message);
            }
        });
    }

    return (
        <div style={{ display: 'inline-block', marginLeft: '6px' }}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                title="Comprobante Adjunto"
                style={{
                    background: isOpen ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                    border: '1px solid',
                    borderColor: isOpen ? 'var(--accent-primary)' : 'transparent',
                    cursor: 'pointer',
                    color: 'var(--accent-primary)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    transition: 'all 0.2s',
                    verticalAlign: 'middle'
                }}
            >
                <Paperclip size={14} /> {isOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </button>

            {isOpen && (
                <div style={{ display: 'block', marginTop: '10px', backgroundColor: 'var(--bg-main)', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-subtle)', maxWidth: '300px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Archivo Incrustado</span>
                        <button
                            onClick={handleDelete}
                            disabled={isPending}
                            style={{ background: 'var(--error-muted)', border: 'none', color: 'var(--error)', padding: '0.4rem 0.6rem', borderRadius: '6px', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 'bold' }}
                        >
                            {isPending ? <Loader2 size={14} /> : <Trash2 size={14} />}
                            {isPending ? 'Borrando...' : 'Quitar Foto'}
                        </button>
                    </div>
                    <img
                        src={url}
                        alt="Comprobante"
                        style={{ width: '100%', borderRadius: '6px', maxHeight: '400px', objectFit: 'contain', backgroundColor: 'black' }}
                    />
                </div>
            )}
        </div>
    );
}
