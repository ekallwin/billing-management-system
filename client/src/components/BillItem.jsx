import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';

const BillItem = ({ item, onUpdate, onRemove }) => {
    return (
        <tr className="animate-fade" style={{ borderBottom: '1px solid var(--border-color)' }}>
            <td style={{ padding: '1rem', fontWeight: 600 }}>{item.name}</td>
            <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>₹{item.price}</td>
            <td style={{ padding: '1rem' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#f1f5f9', padding: '0.25rem', borderRadius: '0.4rem' }}>
                    <button
                        onClick={() => onUpdate(item._id, -1)}
                        style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer', display: 'flex' }}
                    >
                        <Minus size={14} />
                    </button>
                    <span style={{ minWidth: '20px', textAlign: 'center', fontWeight: 'bold', fontSize: '0.9rem' }}>{item.quantity}</span>
                    <button
                        onClick={() => onUpdate(item._id, 1)}
                        style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer', display: 'flex' }}
                    >
                        <Plus size={14} />
                    </button>
                </div>
            </td>
            <td style={{ padding: '1rem', fontWeight: 'bold', textAlign: 'right' }}>
                ₹{item.price * item.quantity}
            </td>
            <td style={{ padding: '1rem', textAlign: 'right' }}>
                <button
                    onClick={() => onRemove(item._id)}
                    style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: '0.5rem' }}
                >
                    <Trash2 size={18} />
                </button>
            </td>
        </tr>
    );
};

export default BillItem;
