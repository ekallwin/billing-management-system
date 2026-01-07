import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { confirmAlert } from 'react-confirm-alert';
import OTPInput from '../../../components/OTPInput';
import api from '../../../api';
import { useAuth } from '../../../context/AuthContext';

const DeleteAccountModals = ({ isOpen, onClose, settings }) => {
    const { currentUser, reauthenticate } = useAuth();

    const [step, setStep] = useState('confirm');
    const [deleteConfirmPassword, setDeleteConfirmPassword] = useState('');
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [deleteOtp, setDeleteOtp] = useState('');
    const [userDeleteOtp, setUserDeleteOtp] = useState('');
    const [timer, setTimer] = useState(0);

    useEffect(() => {
        if (!isOpen) {
            setStep('confirm');
            setDeleteConfirmPassword('');
            setUserDeleteOtp('');
            setTimer(0);
        }
    }, [isOpen]);

    useEffect(() => {
        let interval;
        if (timer > 0 && isOpen && step === 'otp') {
            interval = setInterval(() => setTimer(t => t - 1), 1000);
        }
        return () => clearInterval(interval);
    }, [timer, isOpen, step]);

    const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

    const initiateDeleteOTP = async () => {
        const otp = generateOtp();
        setDeleteOtp(otp);
        setTimer(120);
        setStep('otp');
        setUserDeleteOtp('');

        try {
            const SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL;
            const formData = new URLSearchParams();
            formData.append('email', currentUser.email);
            formData.append('otp', otp);
            formData.append('name', settings.businessName || currentUser.displayName || 'User');
            formData.append('type', 'OTP_VERIFICATION');

            await fetch(SCRIPT_URL, { method: 'POST', mode: 'no-cors', body: formData });
        } catch (err) {
            console.error("Failed to send Delete OTP", err);
            confirmAlert({ title: "Error", message: "Failed to send OTP. Please try again.", buttons: [{ label: "OK" }] });
        }
    };

    const handlePasswordConfirm = async (e) => {
        e.preventDefault();
        if (!deleteConfirmPassword) return;
        setDeleteLoading(true);
        try {
            await reauthenticate(deleteConfirmPassword);
            setDeleteConfirmPassword('');
            await initiateDeleteOTP();
        } catch (err) {
            console.error(err);
            let msg = 'Incorrect Password.';
            if (err.code === 'auth/too-many-requests') {
                msg = 'Too many failed attempts. Please try again later.';
            } else if (err.message) {
                msg = err.message;
                if (err.code === 'auth/wrong-password') msg = 'Incorrect Password.';
            }
            confirmAlert({ title: 'Error', message: msg, buttons: [{ label: 'OK' }] });
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleVerifyDeleteOtp = async (e) => {
        e.preventDefault();

        if (String(userDeleteOtp).trim() === String(deleteOtp).trim()) {
            onClose();
            try {
                setDeleteLoading(true);
                const token = await currentUser.getIdToken();
                await api.delete('/auth/delete-account', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                try {
                    const SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL;
                    const formData = new URLSearchParams();
                    formData.append('email', currentUser.email);
                    formData.append('name', settings.businessName || currentUser.displayName || 'User');
                    formData.append('type', 'DELETE_CONFIRMATION');

                    await fetch(SCRIPT_URL, { method: 'POST', mode: 'no-cors', body: formData });
                } catch (e) { console.error("Failed to send confirmation email", e); }

                confirmAlert({
                    title: 'Account Deleted',
                    message: 'Your account has been successfully deleted.',
                    buttons: [{ label: 'Goodbye', onClick: () => window.location.href = '/login' }]
                });
            } catch (err) {
                console.error(err);
                confirmAlert({
                    title: 'Delete Failed',
                    message: err.response?.data?.error || 'Failed to delete account.',
                    buttons: [{ label: 'OK' }]
                });
            } finally {
                setDeleteLoading(false);
            }
        } else {
            toast.error("Invalid OTP");
        }
    };

    if (!isOpen) return null;

    if (step === 'confirm') {
        return (
            <div className="modal-overlay animate-fade">
                <div className="glass custom-modal-content" style={{ width: '100%', maxWidth: '400px', textAlign: 'center' }}>
                    <h2 style={{ marginBottom: '1rem', color: 'var(--danger)' }}>Confirm Deletion</h2>
                    <p style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>Enter your password to continue.</p>
                    <form onSubmit={handlePasswordConfirm}>
                        <input
                            type="password"
                            className="input-field"
                            placeholder="Password"
                            value={deleteConfirmPassword}
                            onChange={e => setDeleteConfirmPassword(e.target.value)}
                            style={{ marginBottom: '1rem', width: '100%' }}
                            autoFocus
                        />
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                            <button type="button" className="btn" onClick={onClose} disabled={deleteLoading} style={{ border: '1px solid var(--border-color)' }}>Cancel</button>
                            <button type="submit" className="btn" disabled={deleteLoading || !deleteConfirmPassword} style={{ background: 'var(--danger)', color: 'white' }}>
                                {deleteLoading ? 'Verifying...' : 'Continue'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="modal-overlay animate-fade">
            <div className="glass custom-modal-content" style={{ maxWidth: '400px', width: '100%', textAlign: 'center', border: '1px solid var(--danger)' }}>
                <h2 style={{ marginBottom: '1rem', color: 'var(--danger)' }}>Confirm Deletion</h2>
                <p style={{ marginBottom: '1.5rem', color: 'var(--text-muted)' }}>
                    Enter the OTP sent to <strong>{currentUser.email}</strong> to permanently delete your account.
                </p>

                <form onSubmit={handleVerifyDeleteOtp}>
                    <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
                        <OTPInput length={6} onChange={setUserDeleteOtp} />
                    </div>

                    <div style={{ marginBottom: '1.5rem', fontSize: '0.9rem', color: timer < 30 ? 'var(--danger)' : 'var(--text-muted)' }}>
                        Time Remaining: {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, '0')}
                    </div>

                    <button className="btn" type="submit" style={{ width: '100%', marginBottom: '1rem', background: 'var(--danger)', color: 'white' }}>
                        Confirm & Delete
                    </button>
                </form>

                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
                    <button
                        className="btn"
                        onClick={onClose}
                        style={{ fontSize: '0.8rem', color: 'black', outline: '1px solid black' }}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteAccountModals;
