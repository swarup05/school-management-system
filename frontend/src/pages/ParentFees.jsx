import React, { useState, useEffect } from 'react';
import API from '../api/api';
import { CreditCard, History } from 'lucide-react';

const ParentFees = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await API.get('/parent/dashboard');
            setData(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handlePayment = async () => {
        try {
            await API.post('/parent/payment', { 
                amount: 5000, 
                studentId: data.student.id 
            });
            alert('Mock Payment Successful!');
            fetchData();
        } catch (err) {
            alert('Payment failed');
        }
    };

    if (!data) return <div>Loading...</div>;

    const { fees, student } = data;

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
            <div className="glass-card" style={{ margin: 0 }}>
                <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '25px' }}>
                    <CreditCard size={24} /> Pending Tuition Fees
                </h2>
                <div style={{ padding: '20px', background: '#fff9c4', borderRadius: '15px', marginBottom: '20px' }}>
                    <p style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f57f17' }}>Total Outstanding: ₹{fees.total_amount - fees.paid_amount}</p>
                    <p style={{ fontSize: '0.9rem' }}>Student: {student.name}</p>
                </div>
                <div style={{ marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <span>Paid: ₹{fees.paid_amount}</span>
                        <span>Total: ₹{fees.total_amount}</span>
                    </div>
                    <div style={{ width: '100%', height: '10px', background: '#eee', borderRadius: '5px', overflow: 'hidden' }}>
                        <div style={{ width: `${(fees.paid_amount / fees.total_amount) * 100}%`, height: '100%', background: '#4caf50' }}></div>
                    </div>
                </div>
                {fees.status !== 'paid' ? (
                    <button onClick={handlePayment} className="btn-primary" style={{ background: '#ffa000' }}>Process Payment (₹5,000)</button>
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
                {/* Mock history */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '15px', background: '#f8fafc', borderRadius: '10px' }}>
                        <div>
                            <p style={{ fontWeight: 600 }}>Academic Fee - Installment 1</p>
                            <small style={{ color: 'var(--text-secondary)' }}>Paid on 10 Oct 2025</small>
                        </div>
                        <span style={{ color: '#2e7d32', fontWeight: 700 }}>₹{fees.paid_amount}</span>
                    </div>
                    <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>End of transaction list.</p>
                </div>
            </div>
        </div>
    );
};

export default ParentFees;
