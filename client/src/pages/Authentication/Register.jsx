import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShoppingBag, Eye, EyeOff, User, Phone, Mail, Lock } from 'lucide-react';
import { toast } from 'react-toastify';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { RiVerifiedBadgeFill } from "react-icons/ri";
import Footer from '../../components/Footer';
import OTPInput from '../../components/OTPInput';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const { register, loginWithGoogle } = useAuth();
    const navigate = useNavigate();

    const [otp, setOtp] = useState('');
    const [userOtp, setUserOtp] = useState('');
    const [showOtpModal, setShowOtpModal] = useState(false);
    const [timer, setTimer] = useState(120);
    const [isResendDisabled, setIsResendDisabled] = useState(true);
    const [isVerified, setIsVerified] = useState(false);

    const generateOtp = () => {
        return Math.floor(100000 + Math.random() * 900000).toString();
    };

    const sendOtp = async () => {
        if (!email) return toast.error('Please enter an email first');

        const newOtp = generateOtp();
        setOtp(newOtp);
        setTimer(120);
        setIsResendDisabled(true);
        setShowOtpModal(true);

        try {
            const SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL;

            const formData = new URLSearchParams();
            formData.append('email', email);
            formData.append('otp', newOtp);
            formData.append('name', name);

            await fetch(SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                body: formData
            });
        } catch (err) {
            console.error('Failed to send OTP:', err);
        }
    };

    React.useEffect(() => {
        let interval;
        if (showOtpModal && timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        } else if (timer === 0) {
            setIsResendDisabled(false);
        }
        return () => clearInterval(interval);
    }, [showOtpModal, timer]);

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        if (userOtp === otp) {
            setIsVerified(true);
            setShowOtpModal(false);
            setUserOtp('');
        } else {
            toast.error('Invalid OTP');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name) return toast.error('Please enter business name');
        if (!email) return toast.error('Please enter email address');
        if (!phone) return toast.error('Please enter phone number');
        if (!password) return toast.error('Please enter password');

        if (phone.length !== 10) {
            return toast.error('Phone number must be 10 digits');
        }

        if (!isVerified) {
            return toast.error('Please verify your email address first');
        }

        try {
            setLoading(true);
            await register(email, password, name, phone);
            confirmAlert({
                title: 'Success',
                message: 'Account created successfully!',
                buttons: [
                    {
                        label: 'OK',
                        onClick: () => navigate('/')
                    }
                ]
            });
        } catch (err) {
            console.error(err);
            if (err.code === 'auth/email-already-in-use') {
                toast.error('Email already exists. Please Login.');
            } else if (err.code === 'auth/invalid-email') {
                toast.error('Invalid Email address');
            } else if (err.code === 'auth/weak-password') {
                toast.error('Password should be at least 6 characters.');
            } else {
                toast.error('Failed to create account: ' + err.message);
            }
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
                        <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Create Account</h2>
                        <p style={{ color: 'var(--text-muted)' }}>Start managing your business billing</p>
                    </div>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', marginBottom: '0.5rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Business Name</label>
                            <div style={{ position: 'relative' }}>
                                <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input
                                    className="input-field"
                                    style={{ paddingLeft: '3rem' }}
                                    placeholder="Enter business name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', marginBottom: '0.5rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Email Address</label>
                            <div style={{ position: 'relative' }}>
                                <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input
                                    className="input-field"
                                    type="email"
                                    style={{ paddingLeft: '3rem', paddingRight: '6rem' }}
                                    placeholder="name@business.com"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        setIsVerified(false);
                                    }}
                                    disabled={isVerified}
                                />
                                {isVerified ? (
                                    <span style={{
                                        position: 'absolute',
                                        right: '1rem',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        color: 'green',
                                        fontSize: '0.8rem',
                                        fontWeight: 'bold',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.25rem'
                                    }}>
                                        <RiVerifiedBadgeFill size={16} /> Verified
                                    </span>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={sendOtp}
                                        style={{
                                            position: 'absolute',
                                            right: '0.5rem',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            background: 'var(--primary)',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '0.5rem',
                                            padding: '0.25rem 0.75rem',
                                            fontSize: '0.75rem',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Verify
                                    </button>
                                )}
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', marginBottom: '0.5rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Phone Number</label>
                            <div style={{ position: 'relative' }}>
                                <Phone size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input
                                    className="input-field"
                                    type="tel"
                                    inputMode="numeric"
                                    style={{ paddingLeft: '3rem' }}
                                    placeholder="10 digit phone number"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                />
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', marginBottom: '0.5rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Password</label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input
                                    className="input-field"
                                    type={showPassword ? 'text' : 'password'}
                                    style={{ paddingLeft: '3rem', paddingRight: '3rem' }}
                                    placeholder=""
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{
                                        position: 'absolute',
                                        right: '1rem',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        background: 'none',
                                        border: 'none',
                                        color: 'var(--text-muted)',
                                        cursor: 'pointer',
                                        padding: '5px'
                                    }}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button
                            className="btn btn-primary"
                            type="submit"
                            disabled={loading}
                            style={{ fontSize: '1rem', marginTop: '1rem' }}
                        >
                            {loading ? 'Creating Account...' : 'Register Business'}
                        </button>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '0.5rem 0' }}>
                            <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }}></div>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>OR</span>
                            <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }}></div>
                        </div>

                        <button
                            type="button"
                            onClick={async () => {
                                try {
                                    setLoading(true);
                                    await loginWithGoogle();
                                    navigate('/');
                                } catch (err) {
                                    console.error(err);
                                    toast.error('Failed to sign up with Google');
                                    setLoading(false);
                                }
                            }}
                            className="btn"
                            style={{
                                background: 'white',
                                color: '#333',
                                border: '1px solid #ddd',
                                padding: '0.8rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem',
                                fontWeight: '500'
                            }}
                        >
                            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" style={{ width: '18px', height: '18px' }} />
                            Continue with Google
                        </button>
                    </form>

                    <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                        Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 'bold', textDecoration: 'none' }}>Login instead</Link>
                    </div>
                </div>
            </div>

            {/* OTP Modal */}
            {showOtpModal && (
                <div className="modal-overlay animate-fade">
                    <div className="glass custom-modal-content" style={{ maxWidth: '400px', width: '100%', textAlign: 'center' }}>
                        <h2 style={{ marginBottom: '1rem' }}>Verify Email</h2>
                        <p style={{ marginBottom: '1.5rem', color: 'var(--text-muted)' }}>
                            We've sent a 6-digit code to <strong>{email}</strong>.
                        </p>



                        <form onSubmit={handleVerifyOtp}>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <OTPInput
                                    length={6}
                                    value={userOtp}
                                    onChange={setUserOtp}
                                />
                            </div>

                            <div style={{ marginBottom: '1.5rem', fontSize: '0.9rem', color: timer < 30 ? 'var(--danger)' : 'var(--text-muted)' }}>
                                Time Remaining: {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, '0')}
                            </div>

                            <button className="btn btn-primary" type="submit" style={{ width: '100%', marginBottom: '1rem' }}>
                                Verify Email
                            </button>
                        </form>

                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
                            <button
                                className="btn"
                                onClick={() => setShowOtpModal(false)}
                                style={{ fontSize: '0.8rem', color: 'black', outline: '1px solid black' }}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn btn-success"
                                disabled={isResendDisabled}
                                onClick={sendOtp}
                                style={{ fontSize: '0.8rem', color: 'white', cursor: isResendDisabled ? 'not-allowed' : 'pointer' }}
                            >
                                Resend Code
                            </button>
                        </div>
                    </div>
                </div>
            )}



            <Footer />
        </div>
    );
};

export default Register;
