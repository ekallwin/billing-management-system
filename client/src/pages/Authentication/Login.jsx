import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShoppingBag, Eye, EyeOff, Mail, Lock, Phone } from 'lucide-react';
import { toast } from 'react-toastify';
import Footer from '../../components/Footer';

const Login = () => {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const { login, resetPassword, loginWithGoogle } = useAuth(); 
    const navigate = useNavigate();

    const getErrorMessage = (errCode) => {
        switch (errCode) {
            case 'auth/invalid-credential':
            case 'auth/wrong-password':
                return 'Invalid password or email';
            case 'auth/user-not-found':
                return 'No user found';
            case 'auth/invalid-email':
                return 'Invalid email address';
            case 'auth/missing-password':
                return 'Please enter password';
            case 'auth/too-many-requests':
                return 'Access blocked. Too many login attempts. Try again later.';
            default:
                return 'Failed to log in';
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            await login(identifier, password);
            navigate('/');
        } catch (err) {
            console.error(err);
            if (err.code) {
                toast.error(getErrorMessage(err.code));
            } else {
                toast.error(err.message || 'Failed to log in');
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
                        <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Welcome Back</h2>
                        <p style={{ color: 'var(--text-muted)' }}>Login to manage your business</p>
                    </div>


                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', marginBottom: '0.5rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Email or Phone Number</label>
                            <div style={{ position: 'relative' }}>
                                {/^\d+$/.test(identifier) ? (
                                    <Phone size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                ) : (
                                    <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                )}
                                <input
                                    className="input-field"
                                    type="text"
                                    style={{ paddingLeft: '3rem' }}
                                    placeholder="Email or 10-digit phone"
                                    value={identifier}
                                    onChange={(e) => setIdentifier(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                <label style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Password</label>
                                <Link to="/forgot-password" style={{ fontSize: '0.75rem', color: 'var(--primary)', textDecoration: 'underline' }}>Forgot Password?</Link>
                            </div>
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
                            {loading ? 'Logging in...' : 'Sign In'}
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
                                    toast.error('Failed to login with Google');
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
                        New merchant? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 'bold', textDecoration: 'none' }}>Create an account</Link>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Login;
