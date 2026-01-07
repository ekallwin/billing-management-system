import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Printer, CheckCircle, QrCode as QRIcon } from 'lucide-react';
import api from '../api';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import ConfirmDialog from './ConfirmDialog';

const BillPreview = ({ items, total, settings, onReset }) => {
    const [showQR, setShowQR] = useState(false);

    const {
        upiId, merchantName, transactionName,
        taxEnabled, taxName, taxPercent,
        businessName, address, phone, email, gstNumber, fssai
    } = settings;

    const taxAmount = taxEnabled ? (total * (Number(taxPercent) || 0)) / 100 : 0;
    const grandTotal = total + taxAmount;

    const formatDate = (date) => {
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        let hours = d.getHours();
        const minutes = String(d.getMinutes()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        return `${day}-${month}-${year} ${hours}:${minutes} ${ampm}`;
    };

    const upiLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(merchantName || 'Merchant')}&tn=${encodeURIComponent(transactionName || 'Payment')}&am=${grandTotal.toFixed(2)}`;

    const handlePrint = () => {
        window.print();
    };

    const handleMarkAsPaid = () => {
        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <ConfirmDialog
                        title="Confirm Payment"
                        message="Are you sure you want to save this bill and mark it as paid?"
                        confirmText="Yes, Save & Pay"
                        onClose={onClose}
                        onConfirm={async () => {
                            try {
                                await api.post('/bills', {
                                    items,
                                    subtotal: total,
                                    taxAmount,
                                    totalAmount: grandTotal,
                                    status: 'Paid'
                                });
                                onReset();
                                onClose();
                                confirmAlert({
                                    title: 'Success',
                                    message: 'Transaction Successful!',
                                    buttons: [{ label: 'OK', onClick: () => { } }]
                                });
                            } catch (err) {
                                console.error(err);
                                confirmAlert({
                                    title: 'Error',
                                    message: 'Error saving bill',
                                    buttons: [{ label: 'OK', onClick: () => { } }]
                                });
                            }
                        }}
                    />
                );
            }
        });
    };

    return (
        <div className="glass card animate-fade" style={{ position: 'sticky', top: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px dotted var(--border-color)', paddingBottom: '0.5rem' }}>Bill Summary</h3>

            <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span>Subtotal:</span>
                    <span>₹{total}</span>
                </div>

                {taxEnabled && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        <span>{taxName} ({taxPercent}%):</span>
                        <span>₹{taxAmount.toFixed(2)}</span>
                    </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.2rem', marginTop: '1rem', borderTop: '1px dotted var(--border-color)', paddingTop: '1rem' }}>
                    <span>Grand Total:</span>
                    <span style={{ color: 'var(--accent)' }}>₹{grandTotal.toFixed(2)}</span>
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                <button
                    className="btn btn-primary"
                    onClick={() => {
                        if (!upiId) {
                            confirmAlert({
                                title: 'Missing UPI ID',
                                message: 'Please add UPI ID in settings to use QR codes',
                                buttons: [{ label: 'OK', onClick: () => { } }]
                            });
                            return;
                        }
                        setShowQR(true);
                    }}
                    style={{ width: '100%', justifyContent: 'center' }}
                    disabled={items.length === 0}
                >
                    <QRIcon size={18} /> Show QR
                </button>

                {showQR && (
                    <div className="modal-overlay" onClick={() => setShowQR(false)}>
                        <div className="custom-modal-content" onClick={e => e.stopPropagation()}>
                            <h3 style={{ marginBottom: '1rem' }}>Scan to Pay</h3>
                            <div style={{ display: 'flex', justifyContent: 'center', padding: '1.5rem', background: '#f8fafc', borderRadius: '0.75rem', marginBottom: '1.5rem' }}>
                                <QRCodeSVG value={upiLink} size={200} />
                            </div>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Grand Total: ₹{grandTotal.toFixed(2)}</div>
                            </div>
                            <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setShowQR(false)}>
                                Close
                            </button>
                        </div>
                    </div>
                )}

                <button
                    className="btn"
                    onClick={handlePrint}
                    style={{ width: '100%', justifyContent: 'center', border: '1px dotted var(--primary)', color: 'var(--primary)' }}
                    disabled={items.length === 0}
                >
                    <Printer size={18} /> Print Receipt
                </button>

                <button
                    className="btn btn-primary"
                    onClick={handleMarkAsPaid}
                    disabled={items.length === 0}
                    style={{ width: '100%', justifyContent: 'center', background: 'var(--accent)' }}
                >
                    <CheckCircle size={18} /> Mark as Paid
                </button>
            </div>

            {/* Print Only Section - Optimized for Thermal or Standard Printers */}

            <div id="print-section" className={settings.thermalPrint ? 'thermal-mode' : ''}>
                <div id="print-area" style={{
                    width: '100%',
                    maxWidth: settings.thermalPrint ? '80mm' : '100%',
                    margin: settings.thermalPrint ? '0' : '0 auto',
                    padding: settings.thermalPrint ? '8px' : '40px',
                    fontFamily: 'Arial, sans-serif',
                    color: '#000',
                    lineHeight: '1.2',
                    boxSizing: 'border-box',
                    fontSize: settings.thermalPrint ? '11pt' : '12pt'
                }}>
                    <div style={{ textAlign: 'center', marginBottom: '10px', borderBottom: '1px solid #000', paddingBottom: '10px' }}>

                        {businessName && <div style={{ fontWeight: 'bold', fontSize: '1.8rem', marginTop: '5px' }}>{businessName}</div>}
                        {address && <div style={{ fontSize: '0.8rem', whiteSpace: 'pre-line' }}>{address}</div>}
                        {phone && <div style={{ fontSize: '0.9rem' }}>Phone: {phone}</div>}
                        {email && <div style={{ fontSize: '0.9rem' }}>Email: {email}</div>}
                        {gstNumber && <div style={{ fontSize: '0.9rem' }}>GST: {gstNumber}</div>}
                        {fssai && <div style={{ fontSize: '0.9rem' }}>FSSAI: {fssai}</div>}
                        <h2 style={{ margin: '0', marginTop: '5px', fontSize: '0.9rem', fontWeight: '900' }}>RECEIPT</h2>

                        <div style={{ fontSize: '0.9rem', marginTop: '5px', paddingTop: '5px' }}>
                            {formatDate(new Date())}
                        </div>
                    </div>

                    <div style={{ marginBottom: '10px' }}>
                        <div style={{ display: 'flex', borderBottom: '1px solid #000', paddingBottom: '5px', marginBottom: '10px', fontWeight: 'bold' }}>
                            <span style={{ flex: '3' }}>ITEM</span>
                            <span style={{ flex: '1', textAlign: 'center' }}>QTY</span>
                            <span style={{ flex: '2', textAlign: 'right' }}>TOTAL</span>
                        </div>
                        {items.map((item, idx) => (
                            <div key={idx} style={{
                                display: 'flex',
                                marginBottom: settings.thermalPrint ? '8px' : '12px',
                                alignItems: 'flex-start'
                            }}>
                                <div style={{ flex: '3', paddingRight: '10px' }}>
                                    <div style={{ fontWeight: 'bold' }}>{item.name}</div>
                                    <div style={{ fontSize: '9pt', color: '#333' }}>₹{item.price} x {item.quantity}</div>
                                </div>
                                <div style={{ flex: '1', textAlign: 'center' }}>{item.quantity}</div>
                                <div style={{ flex: '2', textAlign: 'right', fontWeight: 'bold' }}>₹{item.price * item.quantity}</div>
                            </div>
                        ))}
                    </div>

                    <div style={{ borderTop: '1px dashed #000', paddingTop: '10px', marginTop: '10px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <span>Subtotal:</span>
                            <span>₹{total.toFixed(2)}</span>
                        </div>
                        {taxEnabled && (
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <span>{taxName} ({taxPercent}%):</span>
                                <span>₹{taxAmount.toFixed(2)}</span>
                            </div>
                        )}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            fontWeight: '900',
                            fontSize: settings.thermalPrint ? '1.1rem' : '1.5rem',
                            marginTop: '10px',
                            borderTop: '1px solid #000',
                            paddingTop: '10px'
                        }}>
                            <span>GRAND TOTAL:</span>
                            <span>₹{grandTotal.toFixed(2)}</span>
                        </div>
                    </div>

                    <div style={{
                        textAlign: 'center',
                        marginTop: settings.thermalPrint ? '30px' : '60px',
                        fontSize: '1rem',
                        borderTop: '1px dashed #000',
                        paddingTop: '15px'
                    }}>
                        <div style={{ fontWeight: 'bold' }}>THANK YOU!</div>
                        <div>Visit Again</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BillPreview;
