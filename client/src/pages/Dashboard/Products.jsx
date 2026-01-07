import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import ProductManager from '../../components/ProductManager';

const Products = () => {
    return (
        <div className="container">
            <header>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Link to="/" className="btn glass" style={{ padding: '0.5rem', textDecoration: 'none' }}>
                        <ChevronLeft size={24} />
                    </Link>
                    <h1>Product Management</h1>
                </div>
            </header>

            <div className="glass card animate-fade">
                <ProductManager />
            </div>
        </div>
    );
};

export default Products;
