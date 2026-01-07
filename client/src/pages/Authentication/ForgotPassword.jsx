import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Mail, ArrowLeft, Lock, Key } from 'lucide-react';
import { toast } from 'react-toastify';
import Footer from '../../components/Footer';
import OTPInput from '../../components/OTPInput';
import api from '../../api';

const ForgotPassword = () => {
    const [step, setStep] = useState(1); 
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [userOtp, setUserOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [timer, setTimer] = useState(0);

    const navigate = useNavigate();

    useEffect(() => {
        let interval;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

    const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

    const handleSendOtp = async (e) => {
        e.preventDefault();
        if (!email) return toast.error('Please enter your email');

        try {
            setLoading(true);
            const generatedOtp = generateOtp();
            setOtp(generatedOtp);

            const SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL;
            const formData = new URLSearchParams();
            formData.append('email', email);
            formData.append('otp', generatedOtp);
            formData.append('name', "Password Reset"); 

            await fetch(SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                body: formData
            });

            toast.success('OTP sent to your email');
            setStep(2);
            setTimer(120);
        } catch (error) {
            console.error(error);
            toast.error('Failed to send OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = (e) => {
        e.preventDefault();
        if (userOtp === otp) {
            toast.success('Email verified!');
            setStep(3);
        } else {
            toast.error('Invalid OTP');
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();

        if (!newPassword) return toast.error('Please enter new password');
        if (!confirmPassword) return toast.error('Please confirm new password');

        if (newPassword !== confirmPassword) {
            return toast.error('Passwords do not match');
        }
        if (newPassword.length < 6) {
            return toast.error('Password must be at least 6 characters');
        }

        try {
            setLoading(true);
            await api.post('/auth/reset-password', { email, password: newPassword });

            toast.success('Password updated successfully!');
            navigate('/login');
        } catch (error) {
            console.error(error);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <div className="container" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                <div className="glass card animate-fade" style={{ width: '100%', maxWidth: '450px', padding: '2.5rem' }}>
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <div style={{ display: 'inline-flex', padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '1rem', marginBottom: '1rem' }}>
                            <ShoppingBag size={40} className="text-primary" />
                        </div>
                        <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Reset Password</h2>
                        <p style={{ color: 'var(--text-muted)' }}>
                            {step === 1 && "Enter your email to verify identity"}
                            {step === 2 && `Enter the OTP sent to your email ${email}`}
                            {step === 3 && "Create a new password"}
                        </p>
                    </div>

                    {step === 1 && (
                        <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', marginBottom: '0.5rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Email Address</label>
                                <div style={{ position: 'relative' }}>
                                    <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                    <input
                                        className="input-field"
                                        type="email"
                                        style={{ paddingLeft: '3rem' }}
                                        placeholder="name@business.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>
                            <button className="btn btn-primary" type="submit" disabled={loading} style={{ fontSize: '1rem' }}>
                                {loading ? 'Sending...' : 'Send OTP'}
                            </button>
                        </form>
                    )}



                    {step === 2 && (
                        <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', marginBottom: '0.5rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>One-Time Password</label>
                                <OTPInput
                                    length={6}
                                    value={userOtp}
                                    onChange={setUserOtp}
                                />
                                <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'right' }}>
                                    Time Remaining: {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, '0')}
                                </div>
                            </div>
                            <button className="btn btn-primary" type="submit" style={{ fontSize: '1rem' }}>
                                Verify OTP
                            </button>
                        </form>
                    )}

                    {step === 3 && (
                        <form onSubmit={handleResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', marginBottom: '0.5rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>New Password</label>
                                <div style={{ position: 'relative' }}>
                                    <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                    <input
                                        className="input-field"
                                        type="password"
                                        style={{ paddingLeft: '3rem' }}
                                        placeholder="Enter new password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', marginBottom: '0.5rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Confirm Password</label>
                                <div style={{ position: 'relative' }}>
                                    <Key size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                    <input
                                        className="input-field"
                                        type="password"
                                        style={{ paddingLeft: '3rem' }}
                                        placeholder="Confirm new password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                </div>
                            </div>
                            <button className="btn btn-primary" type="submit" disabled={loading} style={{ fontSize: '1rem' }}>
                                {loading ? 'Updating...' : 'Update Password'}
                            </button>
                        </form>
                    )}

                    <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                        <Link to="/login" style={{ color: 'var(--text-muted)', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                            <ArrowLeft size={16} /> Back to Login
                        </Link>
                    </div>
                </div>
            </div>



            <Footer />
        </div>
    );
};

export default ForgotPassword;
