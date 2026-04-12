import React, { useState, useEffect } from 'react';
import API from '../api/api';
import { User, Calendar, CreditCard, Bell, FileText } from 'lucide-react';

const ParentDashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await API.get('/parent/dashboard');
            setData(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
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

    if (loading) return <div>Loading...</div>;
    if (!data) return <div>No data found.</div>;

    const { student, attendance, fees, homework, notices } = data;

    return (
        <div>
            <header style={{ marginBottom: '30px' }}>
                <h1 style={{ fontWeight: 800, color: 'var(--primary)' }}>Parent Portal</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Monitoring progress for <strong>{student.name}</strong> (Class {student.class})</p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '25px', marginBottom: '40px' }}>
                {/* Profile Card */}
                <div className="glass-card" style={{ maxWidth: 'none', margin: 0, borderTop: '5px solid var(--primary)' }}>
                    <h3 style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}><User size={20} /> Student Profile</h3>
                    <div style={{ fontSize: '0.95rem' }}>
                        <p><strong>Name:</strong> {student.name}</p>
                        <p><strong>Roll No:</strong> {student.roll_no}</p>
                        <p><strong>Class:</strong> {student.class}</p>
                    </div>
                </div>

                {/* Fees Card */}
                <div className="glass-card" style={{ maxWidth: 'none', margin: 0, borderTop: '5px solid var(--secondary)' }}>
                    <h3 style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}><CreditCard size={20} /> Fees Status</h3>
                    <div style={{ marginBottom: '15px' }}>
                        <p>Total: ₹{fees.total_amount}</p>
                        <p>Paid: ₹{fees.paid_amount}</p>
                        <p>Remaining: <span style={{ color: 'red', fontWeight: 'bold' }}>₹{fees.total_amount - fees.paid_amount}</span></p>
                    </div>
                    {fees.status !== 'paid' && (
                        <button onClick={handlePayment} className="btn-primary" style={{ background: '#ffa000' }}>Pay Online (Mock)</button>
                    )}
                    {fees.status === 'paid' && <span style={{ color: '#4caf50', fontWeight: 'bold' }}>✓ Fully Paid</span>}
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                    {/* Attendance Table */}
                    <div className="glass-card" style={{ maxWidth: 'none', margin: 0 }}>
                        <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}><Calendar size={20} /> Recent Attendance</h3>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid #f1f5f9', textAlign: 'left' }}>
                                    <th style={{ padding: '10px' }}>Date</th>
                                    <th style={{ padding: '10px' }}>Subject</th>
                                    <th style={{ padding: '10px' }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {attendance.map(record => (
                                    <tr key={record.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                        <td style={{ padding: '10px' }}>{new Date(record.date).toLocaleDateString()}</td>
                                        <td style={{ padding: '10px' }}>{record.subject}</td>
                                        <td style={{ padding: '10px' }}>
                                            <span style={{ color: record.status === 'present' ? '#2e7d32' : '#d32f2f', fontWeight: 600 }}>
                                                {record.status.toUpperCase()}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Homework Section */}
                    <div className="glass-card" style={{ maxWidth: 'none', margin: 0 }}>
                        <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}><FileText size={20} /> Homework & Assignments</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {homework.map(hw => (
                                <div key={hw.id} style={{ padding: '20px', background: '#f8fafc', borderRadius: '15px', borderLeft: '5px solid #ffa000' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                        <h4 style={{ color: 'var(--primary)' }}>{hw.subject}</h4>
                                        <small style={{ color: 'var(--text-secondary)' }}>Assigned: {new Date(hw.created_at).toLocaleDateString()}</small>
                                    </div>
                                    <p style={{ fontSize: '0.95rem', marginBottom: '15px', lineHeight: 1.5 }}>{hw.description}</p>
                                    {hw.file_url && (
                                        <a 
                                            href={`http://localhost:5000${hw.file_url}`} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="btn-primary"
                                            style={{ display: 'inline-flex', width: 'auto', padding: '8px 15px', fontSize: '0.85rem', background: '#374151', gap: '5px' }}
                                        >
                                            <FileText size={16} /> View/Download Attachment
                                        </a>
                                    )}
                                </div>
                            ))}
                            {homework.length === 0 && (
                                <p style={{ textAlign: 'center', padding: '20px', color: 'var(--text-secondary)' }}>No pending homework assigned.</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="glass-card" style={{ maxWidth: 'none', margin: 0 }}>
                    <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}><Bell size={20} /> School Notices</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {notices.map(notice => (
                            <div key={notice.id} style={{ padding: '12px', background: '#f8fafc', borderRadius: '10px', borderLeft: '3px solid var(--primary)' }}>
                                <p style={{ fontSize: '0.9rem', marginBottom: '5px' }}>{notice.message}</p>
                                <small style={{ color: 'var(--text-secondary)' }}>{new Date(notice.created_at).toLocaleString()}</small>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ParentDashboard;
