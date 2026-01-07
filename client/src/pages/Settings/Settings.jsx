import { ChevronLeft } from 'lucide-react';
import api from '../../api';
import { useAuth } from '../../context/AuthContext';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BusinessProfile from './components/BusinessProfile';
import UPISettings from './components/UPISettings';
import TaxSettings from './components/TaxSettings';
import PrintSettings from './components/PrintSettings';
import DangerZone from './components/DangerZone';
import PasswordModal from './components/PasswordModal';
import DeleteAccountModals from './components/DeleteAccountModals';
import PrinterInfoModal from './components/PrinterInfoModal';

const Settings = () => {
    const { currentUser } = useAuth();
    const [settings, setSettings] = useState({
        upiId: '',
        merchantName: '',
        transactionName: '',
        taxEnabled: false,
        taxName: '',
        taxPercent: '',
        thermalPrint: true,
        businessName: '',
        address: '',
        phone: '',
        email: '',
        gstNumber: '',
        fssai: ''
    });
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState({ upi: false, tax: false, print: false, profile: false });

    const [showPassChangeModal, setShowPassChangeModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showPrinterInfoModal, setShowPrinterInfoModal] = useState(false);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await api.get('/settings');
                setSettings(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        if (currentUser) {
            fetchSettings();
        }
    }, [currentUser]);

    const handleSave = (section) => {
        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <div className="glass custom-modal-content animate-fade" style={{ textAlign: 'center', padding: '2rem' }}>
                        <h2 style={{ marginBottom: '1rem', color: 'var(--text-main)' }}>Update {section}?</h2>
                        <p style={{ marginBottom: '2rem', color: 'var(--text-muted)' }}>Are you sure you want to save the new {section} configuration?</p>
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                            <button
                                className="btn"
                                style={{ background: '#e2e8f0', color: 'var(--text-main)', padding: '0.6rem 1.5rem' }}
                                onClick={onClose}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn btn-primary"
                                style={{ padding: '0.6rem 1.5rem' }}
                                onClick={async () => {
                                    if (section === 'UPI ID' && !settings.upiId) {
                                        confirmAlert({ title: 'Error', message: 'UPI ID is required.', buttons: [{ label: 'OK' }] });
                                        return;
                                    }

                                    if (section === 'Business Profile' && settings.phone && settings.phone.length !== 10) {
                                        confirmAlert({ title: 'Invalid Phone', message: 'Phone number must be exactly 10 digits.', buttons: [{ label: 'OK' }] });
                                        return;
                                    }
                                    try {
                                        await api.put('/settings', settings);
                                        setEditMode({ upi: false, tax: false, print: false, profile: false });
                                        onClose();
                                        confirmAlert({ title: 'Success', message: `${section} updated successfully!`, buttons: [{ label: 'OK' }] });
                                    } catch (err) {
                                        console.error(err);
                                        confirmAlert({ title: 'Error', message: `Failed to update ${section}`, buttons: [{ label: 'OK' }] });
                                        onClose();
                                    }
                                }}
                            >
                                Yes, Save
                            </button>
                        </div>
                    </div>
                );
            }
        });
    };

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', gap: '1rem' }}>
            <div className="spinner" style={{ width: '40px', height: '40px', border: '4px solid var(--border-color)', borderTop: '4px solid var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
            <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Loading settings...</p>
        </div>
    );

    return (
        <div className="container">
            <header>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Link to="/" className="btn glass" style={{ padding: '0.5rem', textDecoration: 'none' }}>
                        <ChevronLeft size={24} />
                    </Link>
                    <h1>Settings</h1>
                </div>
            </header>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginBottom: '2rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>

                    <BusinessProfile
                        settings={settings}
                        setSettings={setSettings}
                        editMode={editMode}
                        setEditMode={setEditMode}
                        handleSave={handleSave}
                        onOpenPasswordModal={() => setShowPassChangeModal(true)}
                    />

                    <UPISettings
                        settings={settings}
                        setSettings={setSettings}
                        editMode={editMode}
                        setEditMode={setEditMode}
                        handleSave={handleSave}
                    />

                    <TaxSettings
                        settings={settings}
                        setSettings={setSettings}
                        editMode={editMode}
                        setEditMode={setEditMode}
                        handleSave={handleSave}
                    />
                </div>

                <PrintSettings
                    settings={settings}
                    setSettings={setSettings}
                    editMode={editMode}
                    setEditMode={setEditMode}
                    handleSave={handleSave}
                    onOpenPrinterInfo={() => setShowPrinterInfoModal(true)}
                />

                <DangerZone
                    currentUser={currentUser}
                    onDeleteStart={() => setShowDeleteModal(true)}
                />

            </div>

            <PasswordModal
                isOpen={showPassChangeModal}
                onClose={() => setShowPassChangeModal(false)}
            />

            <DeleteAccountModals
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                settings={settings}
            />

            <PrinterInfoModal
                isOpen={showPrinterInfoModal}
                onClose={() => setShowPrinterInfoModal(false)}
            />
        </div>
    );
};

export default Settings;
