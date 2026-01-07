import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ShoppingBag, Receipt, Settings as SettingsIcon, LogOut } from 'lucide-react';
import { confirmAlert } from 'react-confirm-alert';
import { useAuth } from '../context/AuthContext';

const ResponsiveNavbar = ({ businessName }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { logout } = useAuth();
    const menuRef = useRef(null);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        setIsOpen(false);
        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <div className="glass custom-modal-content animate-fade" style={{ textAlign: 'center', padding: '2rem' }}>
                        <h2 style={{ marginBottom: '1rem', color: 'var(--text-main)' }}>Confirm Logout</h2>
                        <p style={{ marginBottom: '2rem', color: 'var(--text-muted)' }}>Are you sure you want to log out?</p>
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                            <button
                                className="btn"
                                style={{ background: '#e2e8f0', color: 'var(--text-main)', padding: '0.6rem 1.5rem' }}
                                onClick={onClose}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn btn-danger"
                                style={{ padding: '0.6rem 1.5rem' }}
                                onClick={async () => {
                                    onClose();
                                    try {
                                        await logout();
                                    } catch (err) {
                                        console.error('Failed to log out', err);
                                    }
                                }}
                            >
                                Yes, Logout
                            </button>
                        </div>
                    </div>
                );
            }
        });
    };

    const NavItems = () => (
        <>
            <Link to="/products" className="btn glass nav-item" onClick={() => setIsOpen(false)}>
                <ShoppingBag size={18} /> Products
            </Link>
            <Link to="/transactions" className="btn glass nav-item" onClick={() => setIsOpen(false)}>
                <Receipt size={18} /> Transactions
            </Link>
            <Link to="/settings" className="btn glass nav-item" onClick={() => setIsOpen(false)}>
                <SettingsIcon size={18} /> Settings
            </Link>
            <button
                onClick={handleLogout}
                className="btn nav-item"
                style={{ border: '1px solid var(--danger)', color: 'var(--danger)', background: 'transparent' }}
            >
                <LogOut size={18} /> Logout
            </button>
        </>
    );

    return (
        <div style={{ position: 'relative' }} ref={menuRef}>
            {/* Desktop View */}
            <div className="desktop-nav" style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                <NavItems />
            </div>

            {/* Mobile View */}
            <div className="mobile-nav" style={{ display: 'none' }}>
                <button
                    className="btn glass"
                    onClick={() => setIsOpen(!isOpen)}
                    style={{ padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                {isOpen && (
                    <div className="glass animate-fade" style={{
                        position: 'absolute',
                        top: '120%',
                        right: 0,
                        flexDirection: 'column',
                        gap: '0.8rem',
                        padding: '1rem',
                        minWidth: '200px',
                        display: 'flex',
                        zIndex: 100,
                        background: 'white',
                        boxShadow: 'var(--shadow-lg)'
                    }}>
                        <NavItems />
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResponsiveNavbar;
