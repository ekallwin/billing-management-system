import { X } from 'lucide-react';

const PrinterInfoModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay animate-fade">
            <div className="glass custom-modal-content" style={{ width: '100%', maxWidth: '400px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Thermal Printer</h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                        <X size={20} />
                    </button>
                </div>
                <p style={{ lineHeight: '1.6', color: 'var(--text-main)', marginBottom: '1.5rem', textAlign: 'justify' }}>
                    A thermal printer is a type of printer commonly used to print bills, receipts, and invoices in places like shops, supermarkets, and restaurants.
                </p>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                        className="btn btn-primary"
                        onClick={onClose}
                    >
                        Got it
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PrinterInfoModal;
