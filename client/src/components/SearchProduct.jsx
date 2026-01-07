import React, { useState, useEffect, useRef } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import api from '../api';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

const SearchProduct = ({ onAdd }) => {
    const [query, setQuery] = useState('');
    const [products, setProducts] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const dropdownRef = useRef(null);
    const listRef = useRef(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await api.get('/products');
                setProducts(res.data.sort((a, b) => a.name.localeCompare(b.name)));
            } catch (err) {
                console.error(err);
            }
        };
        fetchProducts();
    }, []);

    useEffect(() => {
        const results = products.filter(p =>
            p.name.toLowerCase().includes(query.toLowerCase())
        );
        setFiltered(results);
        setSelectedIndex(-1);
    }, [query, products]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (selectedIndex >= 0 && listRef.current) {
            const selectedElement = listRef.current.childNodes[selectedIndex];
            if (selectedElement) {
                selectedElement.scrollIntoView({ block: 'nearest' });
            }
        }
    }, [selectedIndex]);

    const handleSelect = (product) => {
        if (!product) return;
        onAdd(product);
        setQuery('');
        setShowDropdown(false);
        setSelectedIndex(-1);
    };

    const handleKeyDown = (e) => {
        if (!showDropdown) {
            if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                setShowDropdown(true);
            }
            return;
        }

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setSelectedIndex(prev => (prev < filtered.length - 1 ? prev + 1 : prev));
                break;
            case 'ArrowUp':
                e.preventDefault();
                setSelectedIndex(prev => (prev > 0 ? prev - 1 : 0));
                break;
            case 'Enter':
                e.preventDefault();
                if (selectedIndex >= 0 && selectedIndex < filtered.length) {
                    handleSelect(filtered[selectedIndex]);
                }
                break;
            case 'Escape':
                setShowDropdown(false);
                break;
            default:
                break;
        }
    };

    return (
        <div style={{ position: 'relative', marginBottom: '1.5rem' }} ref={dropdownRef}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>
                Select Product
            </label>
            <div style={{ position: 'relative' }}>
                <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                    type="text"
                    className="input-field"
                    placeholder="Search or click to select..."
                    style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem', cursor: 'pointer' }}
                    value={query}
                    onChange={(e) => {
                        if (products.length === 0) {
                            confirmAlert({
                                title: 'No Products',
                                message: 'Please add products in Products page to continue.',
                                buttons: [{ label: 'OK', onClick: () => { } }]
                            });
                            return;
                        }
                        setQuery(e.target.value);
                        setShowDropdown(true);
                    }}
                    onFocus={() => {
                        if (products.length === 0) {
                            confirmAlert({
                                title: 'No Products',
                                message: 'Please add products in Products page to continue.',
                                buttons: [{ label: 'OK', onClick: () => { } }]
                            });
                            return;
                        }
                        setShowDropdown(true);
                    }}
                    onClick={() => {
                        if (products.length === 0) {
                            confirmAlert({
                                title: 'No Products',
                                message: 'Please add products in Products page to continue.',
                                buttons: [{ label: 'OK', onClick: () => { } }]
                            });
                            return;
                        }
                        setShowDropdown(true);
                    }}
                    onKeyDown={handleKeyDown}
                />
                <ChevronDown size={18} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
            </div>

            {showDropdown && (
                <div className="glass" style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    zIndex: 100,
                    marginTop: '0.5rem',
                    maxHeight: '260px',
                    overflowY: 'auto',
                    boxShadow: 'var(--shadow-lg)',
                    padding: '0.5rem'
                }} ref={listRef}>
                    {filtered.length === 0 ? (
                        <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                            No products found
                        </div>
                    ) : (
                        filtered.map((p, index) => (
                            <div
                                key={p._id}
                                onClick={() => handleSelect(p)}
                                style={{
                                    padding: '0.75rem 1rem',
                                    cursor: 'pointer',
                                    borderRadius: '0.4rem',
                                    transition: 'background 0.1s',
                                    marginBottom: '2px',
                                    background: selectedIndex === index ? '#4f46e515' : 'transparent',
                                    border: selectedIndex === index ? '1px solid var(--primary)' : '1px solid transparent'
                                }}
                                className="dropdown-item-hover"
                                onMouseEnter={() => setSelectedIndex(index)}
                            >
                                <div style={{ fontWeight: 600, fontSize: '0.9rem', color: selectedIndex === index ? 'var(--primary)' : 'inherit' }}>{p.name}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Price: ₹{p.price}</div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchProduct;
