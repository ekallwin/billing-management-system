import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import api from '../api';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

const ProductManager = () => {
    const [products, setProducts] = useState([]);
    const [editing, setEditing] = useState(null);
    const [formData, setFormData] = useState({ name: '', price: '' });
    const [showAdd, setShowAdd] = useState(false);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        const res = await api.get('/products');
        setProducts(res.data);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const normalizedData = {
            ...formData,
            name: formData.name.split(' ').map(word =>
                word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' ').trim()
        };
        try {
            if (editing) {
                await api.put(`/products/${editing._id}`, normalizedData);
            } else {
                await api.post('/products', normalizedData);
            }
            setFormData({ name: '', price: '' });
            setEditing(null);
            setShowAdd(false);
            fetchProducts();
            confirmAlert({
                title: 'Success',
                message: `Product ${editing ? 'updated' : 'added'} successfully!`,
                buttons: [{ label: 'OK', onClick: () => { } }]
            });
        } catch (err) {
            console.error(err);
            confirmAlert({
                title: 'Error',
                message: 'Failed to process product',
                buttons: [{ label: 'OK', onClick: () => { } }]
            });
        }
    };

    const handleDelete = (id) => {
        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <div className="glass custom-modal-content animate-fade" style={{ textAlign: 'center', padding: '2rem' }}>
                        <h2 style={{ marginBottom: '1rem', color: 'var(--text-main)' }}>Confirm Deletion</h2>
                        <p style={{ marginBottom: '2rem', color: 'var(--text-muted)' }}>Are you sure you want to delete this product? This action cannot be undone.</p>
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                            <button
                                className="btn"
                                style={{ background: '#e2e8f0', color: 'var(--text-main)', padding: '0.6rem 1.5rem' }}
                                onClick={onClose}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn"
                                style={{ background: 'var(--danger)', color: 'white', padding: '0.6rem 1.5rem' }}
                                onClick={async () => {
                                    await api.delete(`/products/${id}`);
                                    fetchProducts();
                                    onClose();
                                }}
                            >
                                Yes, Delete
                            </button>
                        </div>
                    </div>
                );
            }
        });
    };

    const startEdit = (product) => {
        setEditing(product);
        setFormData({ name: product.name, price: product.price });
        setShowAdd(true);
    };

    return (
        <div className="animate-fade">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3>Products</h3>
                <button className="btn btn-primary" onClick={() => { setShowAdd(true); setEditing(null); setFormData({ name: '', price: '' }); }}>
                    <Plus size={18} /> Add Product
                </button>
            </div>

            {showAdd && (
                <div className="glass card animate-fade" style={{ marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <h4>{editing ? 'Modify Product' : 'Add New Product'}</h4>
                        <X size={20} style={{ cursor: 'pointer' }} onClick={() => setShowAdd(false)} />
                    </div>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        <input
                            className="input-field"
                            style={{ flex: 1, minWidth: '200px', textTransform: 'capitalize' }}
                            placeholder="Product Name"
                            required
                            value={formData.name}
                            onChange={e => {
                                const val = e.target.value.split(' ').map(word =>
                                    word.charAt(0).toUpperCase() + word.slice(1)
                                ).join(' ');
                                setFormData({ ...formData, name: val });
                            }}
                        />
                        <input
                            className="input-field"
                            style={{ width: '120px' }}
                            type="number"
                            placeholder="Price"
                            required
                            inputMode="numeric"
                            value={formData.price}
                            onChange={e => setFormData({ ...formData, price: e.target.value })}
                        />
                        <button className="btn btn-primary" type="submit">
                            {editing ? 'Update' : 'Save'}
                        </button>
                    </form>
                </div>
            )}

            {products.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                    <p style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>No products added</p>
                    <p style={{ fontSize: '0.9rem' }}>Click "Add Product" to get started</p>
                </div>
            ) : (
                <div className="glass responsive-table-container" style={{ borderRadius: '1rem', overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: 'rgba(255,255,255,0.05)', textAlign: 'left' }}>
                                <th style={{ padding: '1rem' }}>Name</th>
                                <th style={{ padding: '1rem' }}>Price</th>
                                <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(p => (
                                <tr key={p._id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                    <td style={{ padding: '1rem' }}>{p.name}</td>
                                    <td style={{ padding: '1rem' }}>₹{p.price}</td>
                                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                                            <button className="btn" style={{ padding: '0.4rem', color: 'var(--primary)' }} onClick={() => startEdit(p)}>
                                                <Edit2 size={16} />
                                            </button>
                                            <button className="btn" style={{ padding: '0.4rem', color: 'var(--danger)' }} onClick={() => handleDelete(p._id)}>
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ProductManager;
