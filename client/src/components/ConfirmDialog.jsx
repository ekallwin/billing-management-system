import React, { useState } from 'react';

const ConfirmDialog = ({ title, message, onConfirm, onClose, confirmText = "Yes, Save", cancelText = "Cancel", isDestructive = false }) => {
    const [loading, setLoading] = useState(false);

    const handleConfirm = async () => {
        setLoading(true);
        try {
            await onConfirm();
        } finally {
            if (!loading) { 
                setLoading(false);
            }
        }
    };

    return (
        <div className="glass custom-modal-content animate-fade" style={{ textAlign: 'center', padding: '2rem' }}>
            <h2 style={{ marginBottom: '1rem', color: 'var(--text-main)' }}>{title}</h2>
            <p style={{ marginBottom: '2rem', color: 'var(--text-muted)' }}>{message}</p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <button
                    className="btn"
                    style={{ background: '#e2e8f0', color: 'var(--text-main)', padding: '0.6rem 1.5rem' }}
                    onClick={onClose}
                    disabled={loading}
                >
                    {cancelText}
                </button>
                <button
                    className="btn"
                    style={{
                        background: isDestructive ? 'var(--danger)' : 'var(--accent)',
                        color: 'white',
                        padding: '0.6rem 1.5rem',
                        opacity: loading ? 0.7 : 1,
                        cursor: loading ? 'not-allowed' : 'pointer'
                    }}
                    onClick={handleConfirm}
                    disabled={loading}
                >
                    {loading ? 'Processing...' : confirmText}
                </button>
            </div>
        </div>
    );
};

export default ConfirmDialog;
