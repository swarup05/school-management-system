import React, { useState, useEffect } from 'react';
import API from '../api/api';
import { CreditCard, History, Users } from 'lucide-react';

const ParentFees = () => {
    const [children, setChildren] = useState([]);
    const [selectedIdx, setSelectedIdx] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await API.get('/parent/dashboard');
            setChildren(res.data.children || []);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const handlePayment = async (studentId) => {
        try {
            await API.post('/parent/payment', { 
                amount: 5000, 
                studentId: studentId 
            });
            alert('Mock Payment Successful!');
            fetchData();
        } catch (err) {
            alert('Payment failed');
        }
    };

    if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;
    if (children.length === 0) return (
        <div style={{ padding: '40px', textAlign: 'center' }}>
            <CreditCard size={48} style={{ color: '#ccc', marginBottom: '20px' }} />
            <h3>No fee records found.</h3>
        </div>
    );

    const active = children[selectedIdx];
    const { fees, student } = active || {};

    return (
        <div>
            <header style={{ marginBottom: '30px' }}>
                <h1 style={{ fontWeight: 800, color: 'var(--primary)' }}>Fees Management</h1>
                <p style={{ color: 'var(--text-secondary)' }}>View and pay academic fees for your children.</p>
            </header>

            {/* Child Selector */}
            {children.length > 1 && (
                <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', flexWrap: 'wrap' }}>
                    {children.map((c, idx) => (
                        <button
                            key={c.student.id}
                            onClick={() => setSelectedIdx(idx)}
                            style={{
                                padding: '10px 20px',
                                borderRadius: '25px',
                                border: '2px solid var(--primary)',
                                background: selectedIdx === idx ? 'var(--primary)' : 'white',
                                color: selectedIdx === idx ? 'white' : 'var(--primary)',
                                fontWeight: 700,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                        >
                            <Users size={16} />
                            {c.student.name}
                        </button>
                    ))}
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px' }}>
                <div className="glass-card" style={{ margin: 0 }}>
                    <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '25px' }}>
                        <CreditCard size={24} /> Pending Tuition Fees
                    </h2>
                    <div style={{ padding: '20px', background: '#fff9c4', borderRadius: '15px', marginBottom: '20px' }}>
                        <p style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f57f17' }}>Total Outstanding: ₹{(fees?.total_amount || 0) - (fees?.paid_amount || 0)}</p>
                        <p style={{ fontSize: '0.9rem' }}>Student: {student?.name}</p>
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                            <span>Paid: ₹{fees?.paid_amount || 0}</span>
                            <span>Total: ₹{fees?.total_amount || 0}</span>
                        </div>
                        <div style={{ width: '100%', height: '10px', background: '#eee', borderRadius: '5px', overflow: 'hidden' }}>
                            <div style={{ width: `${((fees?.paid_amount || 0) / (fees?.total_amount || 1)) * 100}%`, height: '100%', background: '#4caf50' }}></div>
                        </div>
                    </div>
                    {fees?.status !== 'paid' ? (
                        <button onClick={() => handlePayment(student?.id)} className="btn-primary" style={{ background: '#ffa000' }}>Process Payment (₹5,000)</button>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '15px', background: '#e8f5e9', color: '#2e7d32', borderRadius: '10px', fontWeight: 600 }}>
                            Fees Fully Paid for Current Session
                        </div>
                    )}
                </div>

                <div className="glass-card" style={{ margin: 0 }}>
                    <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '25px' }}>
                        <History size={24} /> Transaction History
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '15px', background: '#f8fafc', borderRadius: '10px' }}>
                            <div>
                                <p style={{ fontWeight: 600 }}>Academic Fee - Installment 1</p>
                                <small style={{ color: 'var(--text-secondary)' }}>Paid on 10 Oct 2025</small>
                            </div>
                            <span style={{ color: '#2e7d32', fontWeight: 700 }}>₹{fees?.paid_amount || 0}</span>
                        </div>
                        <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>End of transaction list.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ParentFees;
