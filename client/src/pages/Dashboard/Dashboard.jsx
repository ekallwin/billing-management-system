import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Settings as SettingsIcon, Receipt, ShoppingBag, LogOut } from 'lucide-react';
import SearchProduct from '../../components/SearchProduct';
import BillItem from '../../components/BillItem';
import BillPreview from '../../components/BillPreview';
import api from '../../api';
import { useAuth } from '../../context/AuthContext';
import ResponsiveNavbar from '../../components/ResponsiveNavbar';
import 'react-confirm-alert/src/react-confirm-alert.css';

const Dashboard = () => {
    const { currentUser, logout } = useAuth();
    const [billItems, setBillItems] = useState(() => {
        try {
            const saved = localStorage.getItem('billItems');
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem('billItems', JSON.stringify(billItems));
    }, [billItems]);
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

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await api.get('/settings');
                setSettings(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        if (currentUser) {
            fetchSettings();
        }
    }, [currentUser]);

    const addToBill = (product) => {
        const existing = billItems.find(item => item._id === product._id);
        if (existing) {
            updateQuantity(product._id, 1);
        } else {
            setBillItems([...billItems, { ...product, quantity: 1 }]);
        }
    };

    const updateQuantity = (id, delta) => {
        setBillItems(billItems.map(item => {
            if (item._id === id) {
                const newQty = Math.max(1, item.quantity + delta);
                return { ...item, quantity: newQty };
            }
            return item;
        }));
    };

    const removeItem = (id) => {
        setBillItems(billItems.filter(item => item._id !== id));
    };

    const total = billItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    return (
        <div className="container">
            <header>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ padding: '0.5rem', background: 'var(--bg-secondary)', borderRadius: '0.8rem' }}>
                        <Receipt size={28} color="var(--primary)" />
                    </div>
                    <div>
                        <h2 style={{ fontSize: '1.5rem', margin: 0 }}>
                            Welcome {settings.businessName || ''}!
                        </h2>
                        {/* <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>{currentUser?.email}</p> */}
                    </div>
                </div>
                <ResponsiveNavbar businessName={settings.businessName} />
            </header>

            <div className="dashboard-grid">
                <div>
                    <SearchProduct onAdd={addToBill} />

                    <div style={{ marginTop: '2rem' }}>
                        <h3 style={{ marginBottom: '1.5rem' }}>Current Bill Items</h3>
                        {billItems.length === 0 ? (
                            <div className="glass card" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                                <Receipt size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                                <p>No items added yet. Search for products to start.</p>
                            </div>
                        ) : (
                            <div className="glass responsive-table-container" style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ background: '#f8fafc', textAlign: 'left', borderBottom: '1px solid var(--border-color)' }}>
                                            <th style={{ padding: '1rem', fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Product</th>
                                            <th style={{ padding: '1rem', fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Price</th>
                                            <th style={{ padding: '1rem', fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Quantity</th>
                                            <th style={{ padding: '1rem', fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)', textAlign: 'right' }}>Total</th>
                                            <th style={{ padding: '1rem', width: '60px' }}></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {billItems.map(item => (
                                            <BillItem
                                                key={item._id}
                                                item={item}
                                                onUpdate={updateQuantity}
                                                onRemove={removeItem}
                                            />
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>

                <div>
                    <BillPreview
                        items={billItems}
                        total={total}
                        settings={settings}
                        onReset={() => setBillItems([])}
                    />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
