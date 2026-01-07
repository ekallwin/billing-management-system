import { useState } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-toastify';
import { confirmAlert } from 'react-confirm-alert';
import OTPInput from '../../../components/OTPInput';
import api from '../../../api';
import { useAuth } from '../../../context/AuthContext';
import { useEffect } from 'react';

const PasswordModal = ({ isOpen, onClose }) => {
    const { currentUser, changePassword, reauthenticate, reauthenticateWithGoogle, resetPassword } = useAuth();
    const [forgotStep, setForgotStep] = useState('idle');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Forgot Password & OTP State
    const [resetOtp, setResetOtp] = useState('');
    const [userResetOtp, setUserResetOtp] = useState('');
    const [resetNewPassword, setResetNewPassword] = useState('');
    const [resetConfirmPassword, setResetConfirmPassword] = useState('');
    const [resetLoading, setResetLoading] = useState(false);
    const [timer, setTimer] = useState(0);

    useEffect(() => {
        if (!isOpen) {
            setForgotStep('idle');
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setResetNewPassword('');
            setResetConfirmPassword('');
            setUserResetOtp('');
        }
    }, [isOpen]);

    useEffect(() => {
        let interval;
        if (timer > 0 && isOpen) {
            interval = setInterval(() => setTimer(t => t - 1), 1000);
        }
        return () => clearInterval(interval);
    }, [timer, isOpen]);

    const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        const isPasswordProvider = currentUser.providerData.some(p => p.providerId === 'password');

        if (isPasswordProvider && !oldPassword) {
            confirmAlert({ title: 'Error', message: 'Current password is required.', buttons: [{ label: 'OK' }] });
            return;
        }

        if (!newPassword || !confirmPassword) {
            confirmAlert({ title: 'Error', message: 'New and confirm passwords are required.', buttons: [{ label: 'OK' }] });
            return;
        }

        if (newPassword.length < 6) {
            confirmAlert({ title: 'Invalid Password', message: 'New password must be at least 6 characters.', buttons: [{ label: 'OK' }] });
            return;
        }

        if (newPassword !== confirmPassword) {
            confirmAlert({ title: 'Error', message: 'New passwords do not match.', buttons: [{ label: 'OK' }] });
            return;
        }

        try {
            if (isPasswordProvider) {
                await reauthenticate(oldPassword);
            } else {
                await reauthenticateWithGoogle();
            }

            await changePassword(newPassword);
            onClose();
            confirmAlert({ title: 'Success', message: 'Password updated successfully!', buttons: [{ label: 'OK' }] });
        } catch (err) {
            console.error(err);
            let msg = 'Failed to update password.';
            if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
                msg = 'Incorrect old password.';
            } else if (err.code === 'auth/too-many-requests') {
                msg = 'Too many failed attempts. Please try again later.';
            } else if (err.code === 'auth/requires-recent-login') {
                msg = 'For security, please logout and login again to change your password.';
            }
            confirmAlert({ title: 'Error', message: msg, buttons: [{ label: 'OK' }] });
        }
    };

    const initiateResetOTP = async () => {
        const otp = generateOtp();
        setResetOtp(otp);
        setUserResetOtp('');

        try {
            const SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL;
            const formData = new URLSearchParams();
            formData.append('email', currentUser.email);
            formData.append('otp', otp);
            formData.append('name', currentUser.displayName || 'User');
            formData.append('type', 'OTP_VERIFICATION');

            await fetch(SCRIPT_URL, { method: 'POST', mode: 'no-cors', body: formData });

            confirmAlert({
                title: "OTP Sent",
                message: "Check your email for the verification code.",
                buttons: [{
                    label: "OK",
                    onClick: () => {
                        setForgotStep('otp');
                        setTimer(120);
                    }
                }]
            });
        } catch (err) {
            console.error("Failed to send Reset OTP", err);
            confirmAlert({ title: "Error", message: "Failed to send OTP.", buttons: [{ label: "OK" }] });
        }
    };

    const handleVerifyResetOtp = () => {
        if (String(userResetOtp).trim() === String(resetOtp).trim()) {
            setForgotStep('reset');
        } else {
            toast.error("Invalid OTP");
        }
    };

    const handleForceResetPassword = async (e) => {
        e.preventDefault();
        if (resetNewPassword !== resetConfirmPassword) {
            confirmAlert({ title: "Error", message: "Passwords do not match", buttons: [{ label: "OK" }] });
            return;
        }
        if (resetNewPassword.length < 6) {
            confirmAlert({ title: "Error", message: "Password must be at least 6 characters", buttons: [{ label: "OK" }] });
            return;
        }

        setResetLoading(true);
        try {
            const token = await currentUser.getIdToken();
            await api.post('/auth/force-reset-password', { newPassword: resetNewPassword }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            onClose();
            confirmAlert({ title: "Success", message: "Password updated successfully!", buttons: [{ label: "OK" }] });
        } catch (err) {
            console.error(err);
            const errMsg = err.response?.data?.error || err.message || "Failed to update password.";
            confirmAlert({ title: "Error", message: errMsg, buttons: [{ label: "OK" }] });
        } finally {
            setResetLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay animate-fade">
            <div className="glass custom-modal-content" style={{ width: '100%', maxWidth: '400px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.25rem', margin: 0 }}>
                        {forgotStep === 'idle' ? (currentUser.providerData.some(p => p.providerId === 'password') ? 'Change Password' : 'Set Account Password') :
                            forgotStep === 'otp' ? 'Verify OTP' : 'Reset Password'}
                    </h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                        <X size={20} />
                    </button>
                </div>

                {forgotStep === 'idle' && (
                    <form onSubmit={handlePasswordChange} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {currentUser.providerData.some(p => p.providerId === 'password') && (
                            <div>
                                <label style={{ display: 'block', textAlign: 'left', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>OLD PASSWORD</label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type={showOldPassword ? 'text' : 'password'}
                                        className="input-field"
                                        placeholder="Current Password"
                                        value={oldPassword}
                                        onChange={(e) => setOldPassword(e.target.value)}
                                        style={{ width: '100%', paddingRight: '2.5rem' }}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowOldPassword(!showOldPassword)}
                                        style={{ position: 'absolute', right: '0.8rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                                    >
                                        {showOldPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>
                        )}

                        {currentUser.providerData.some(p => p.providerId === 'password') && (
                            <div style={{ textAlign: 'left', marginTop: '-0.5rem' }}>
                                <span onClick={initiateResetOTP} style={{ color: 'var(--primary)', cursor: 'pointer', fontSize: '0.85rem', textDecoration: 'underline' }}>
                                    Forgot Password?
                                </span>
                            </div>
                        )}

                        <div>
                            <label style={{ display: 'block', textAlign: 'left', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>NEW PASSWORD</label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type={showNewPassword ? 'text' : 'password'}
                                    className="input-field"
                                    placeholder="New Password (6+ chars)"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    style={{ width: '100%', paddingRight: '2.5rem' }}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    style={{ position: 'absolute', right: '0.8rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                                >
                                    {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>
                        <div>
                            <label style={{ display: 'block', textAlign: 'left', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>CONFIRM NEW PASSWORD</label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    className="input-field"
                                    placeholder="Confirm New Password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    style={{ width: '100%', paddingRight: '2.5rem' }}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    style={{ position: 'absolute', right: '0.8rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                                >
                                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                            <button type="button" className="btn" onClick={onClose} style={{ color: 'var(--text-muted)', border: '1px solid var(--border-color)' }}>
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-primary">
                                Update Password
                            </button>
                        </div>
                    </form>
                )}

                {forgotStep === 'otp' && (
                    <div className="animate-fade">
                        <p style={{ marginBottom: '1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                            Enter the 6-digit code sent to <strong>{currentUser.email}</strong>.
                        </p>
                        <form onSubmit={(e) => { e.preventDefault(); handleVerifyResetOtp(); }}>
                            <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center' }}>
                                <OTPInput length={6} onChange={setUserResetOtp} />
                            </div>
                            <div style={{ textAlign: 'center', fontSize: '0.9rem', marginBottom: '1.5rem', color: 'var(--text-muted)' }}>
                                Time remaining: <span style={{ fontWeight: 'bold', color: timer < 30 ? 'var(--danger)' : 'var(--primary)' }}>
                                    {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
                                </span>
                            </div>
                            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={userResetOtp.length !== 6}>
                                Verify Code
                            </button>
                        </form>
                        <button className="btn" style={{ width: '100%', marginTop: '0.5rem', background: 'none', color: 'var(--text-muted)' }} onClick={() => setForgotStep('idle')}>
                            Cancel
                        </button>
                    </div>
                )}

                {forgotStep === 'reset' && (
                    <form onSubmit={handleForceResetPassword} className="animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div>
                            <label style={{ display: 'block', textAlign: 'left', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>NEW PASSWORD</label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type="password"
                                    className="input-field"
                                    placeholder="Enter new password"
                                    value={resetNewPassword}
                                    onChange={(e) => setResetNewPassword(e.target.value)}
                                    style={{ width: '100%' }}
                                    autoFocus
                                />
                            </div>
                        </div>
                        <div>
                            <label style={{ display: 'block', textAlign: 'left', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>CONFIRM PASSWORD</label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type="password"
                                    className="input-field"
                                    placeholder="Confirm new password"
                                    value={resetConfirmPassword}
                                    onChange={(e) => setResetConfirmPassword(e.target.value)}
                                    style={{ width: '100%' }}
                                />
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary" disabled={resetLoading || !resetNewPassword || !resetConfirmPassword}>
                            {resetLoading ? 'Updating...' : 'Update Password'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default PasswordModal;
