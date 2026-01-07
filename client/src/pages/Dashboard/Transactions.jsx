import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Receipt, Search, Calendar as CalendarIcon, X } from 'lucide-react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import api from '../../api';

const Transactions = () => {
    const [bills, setBills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterDate, setFilterDate] = useState(new Date());
    const [showCalendar, setShowCalendar] = useState(false);
    const calendarRef = useRef(null);

    const fetchBills = async (date) => {
        setLoading(true);
        try {
            let url = '/bills';
            if (date) {
                const start = new Date(date);
                start.setHours(0, 0, 0, 0);
                const end = new Date(date);
                end.setHours(23, 59, 59, 999);
                url += `?startDate=${start.toISOString()}&endDate=${end.toISOString()}`;
            }
            const res = await api.get(url);
            setBills(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBills(filterDate);
    }, [filterDate]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (calendarRef.current && !calendarRef.current.contains(event.target)) {
                setShowCalendar(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleDateChange = (date) => {
        setFilterDate(date);
        setShowCalendar(false);
    };

    const formatDate = (date, includeTime = true) => {
        if (!date) return '';
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        if (!includeTime) return `${day}-${month}-${year}`;

        let hours = d.getHours();
        const minutes = String(d.getMinutes()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        return `${day}-${month}-${year} ${hours}:${minutes} ${ampm}`;
    };

    const totalIncome = bills.reduce((acc, bill) => acc + bill.totalAmount, 0);

    return (
        <div className="container">
            <header>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Link to="/" className="btn glass" style={{ padding: '0.5rem', textDecoration: 'none' }}>
                        <ChevronLeft size={24} />
                    </Link>
                    <h1>Transaction History</h1>
                </div>
            </header>

            <div className="glass card animate-fade" style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', flexWrap: 'wrap', gap: '1rem', position: 'relative', zIndex: 50 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                    <CalendarIcon size={20} color="var(--primary)" />
                    <span style={{ fontWeight: '600' }}>Filter by Date</span>
                </div>

                <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center', position: 'relative' }}>
                    <div ref={calendarRef} style={{ position: 'relative' }}>
                        <button
                            className="btn glass"
                            onClick={() => setShowCalendar(!showCalendar)}
                            style={{ border: '1px solid var(--border-color)', minWidth: '220px', justifyContent: 'space-between' }}
                        >
                            {filterDate ? formatDate(filterDate, false) : 'All Transactions'}
                            <CalendarIcon size={16} />
                        </button>

                        {showCalendar && (
                            <div style={{
                                position: 'absolute',
                                top: '100%',
                                right: '0',
                                left: 'auto',
                                marginTop: '0.5rem',
                                zIndex: 9999,
                                minWidth: '350px',
                                background: 'white',
                                borderRadius: '1rem',
                                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)'
                            }}>
                                <Calendar
                                    onChange={handleDateChange}
                                    value={filterDate || new Date()}
                                    calendarType="gregory"
                                    formatShortWeekday={(locale, date) => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()]}
                                    tileDisabled={({ date }) => date > new Date()}
                                    className="glass animate-fade"
                                />
                            </div>
                        )}
                    </div>

                    {filterDate && (
                        <button className="btn" onClick={() => { setFilterDate(null); fetchBills(null); }} style={{ padding: '0.5rem 1rem', border: '1px solid var(--border-color)', color: 'var(--danger)' }}>
                            <X size={16} /> Clear
                        </button>
                    )}
                </div>
            </div>

            {loading ? (
                <div className="glass card" style={{ textAlign: 'center', padding: '4rem' }}>Loading transactions...</div>
            ) : bills.length === 0 ? (
                <div className="glass card" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                    <Receipt size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                    <p>No transactions found for this period.</p>
                </div>
            ) : (
                <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                        <div style={{ textAlign: 'left' }}>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Total Transactions</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-main)' }}>{bills.length}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Total Revenue</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent)' }}>₹{totalIncome.toFixed(2)}</div>
                        </div>
                    </div>
                    <div className="glass responsive-table-container" style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ background: '#f8fafc', textAlign: 'left', borderBottom: '1px solid var(--border-color)' }}>
                                    <th style={{ padding: '1rem', fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Date & Time</th>
                                    <th style={{ padding: '1rem', fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Items</th>
                                    <th style={{ padding: '1rem', fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Subtotal</th>
                                    <th style={{ padding: '1rem', fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Tax</th>
                                    <th style={{ padding: '1rem', fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)', textAlign: 'right' }}>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bills.map(bill => (
                                    <tr key={bill._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                        <td style={{ padding: '1rem', fontSize: '0.9rem', whiteSpace: 'nowrap' }}>
                                            {formatDate(bill.date)}
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <div style={{ fontSize: '0.85rem' }}>
                                                {bill.items.map(i => `${i.name} (${i.quantity})`).join(', ')}
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>₹{bill.subtotal || bill.totalAmount}</td>
                                        <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>
                                            {bill.taxAmount > 0 ? `₹${bill.taxAmount.toFixed(2)}` : '-'}
                                        </td>
                                        <td style={{ padding: '1rem', fontWeight: 'bold', textAlign: 'right' }}>
                                            ₹{bill.totalAmount.toFixed(2)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
};

export default Transactions;
