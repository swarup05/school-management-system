import React, { useState, useEffect } from 'react';
import API from '../api/api';
import { User, Calendar, CreditCard, Bell, FileText, Users } from 'lucide-react';

const ParentDashboard = () => {
    const [children, setChildren] = useState([]);
    const [notices, setNotices] = useState([]);
    const [selectedIdx, setSelectedIdx] = useState(0);
    const [diagnostics, setDiagnostics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await API.get('/parent/dashboard');
            
            // Handle both new multi-child format and legacy single-child format
            let childrenData = [];
            if (res.data.children) {
                childrenData = res.data.children;
            } else if (res.data.student) {
                // Wrap legacy single student object into the current children array structure
                childrenData = [{
                    student: res.data.student,
                    attendance: res.data.attendance || [],
                    fees: res.data.fees || { total_amount: 0, paid_amount: 0, status: 'unpaid' },
                    homework: res.data.homework || []
                }];
            }

            setChildren(childrenData);
            setNotices(res.data.notices || []);
            setDiagnostics({
                parentId: res.data.parentId || (childrenData[0]?.student?.parent_id),
                childCount: childrenData.length,
                email: localStorage.getItem('email')
            });
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const handlePayment = async (studentId) => {
        try {
            await API.post('/parent/payment', { amount: 5000, studentId });
            alert('Mock Payment Successful!');
            fetchData();
        } catch (err) {
            alert('Payment failed');
        }
    };

    if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;
    if (children.length === 0) return (
        <div className="glass-card" style={{ textAlign: 'center', padding: '60px', marginTop: '40px' }}>
            <Users size={48} style={{ color: '#cbd5e1', marginBottom: '15px' }} />
            <h2 style={{ color: 'var(--primary)', marginBottom: '10px' }}>No Student Records Found</h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto 25px' }}>
                We couldn't find any student profiles linked to your account. 
                If you recently registered, please wait for admin approval or contact the school office.
            </p>
            <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '10px', marginBottom: '25px', fontSize: '0.85rem', color: '#64748b' }}>
                <strong>Session Diagnostic:</strong> Logged in as {diagnostics?.email} (ID: {diagnostics?.parentId})
            </div>
            <button onClick={fetchData} className="btn-primary" style={{ width: 'auto', padding: '10px 30px' }}>
                Retry Sync
            </button>
        </div>
    );

    const active = children[selectedIdx];
    const { student, attendance, fees, homework } = active || {};

    return (
        <div style={{ position: 'relative', minHeight: '80vh' }}>
            <header style={{ marginBottom: '30px' }}>
                <h1 style={{ fontWeight: 800, color: 'var(--primary)' }}>Parent Portal</h1>
                <p style={{ color: 'var(--text-secondary)' }}>
                    Welcome! You have <strong>{children.length}</strong> {children.length === 1 ? 'child' : 'children'} registered.
                </p>
            </header>

            {/* Child Selector Tabs */}
            {children.length > 1 && (
                <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', flexWrap: 'wrap' }}>
                    {children.map((c, idx) => (
                        <button
                            key={c.student?.id || idx}
                            onClick={() => setSelectedIdx(idx)}
                            style={{
                                padding: '10px 24px',
                                borderRadius: '25px',
                                border: '2px solid var(--primary)',
                                background: selectedIdx === idx ? 'var(--primary)' : 'white',
                                color: selectedIdx === idx ? 'white' : 'var(--primary)',
                                fontWeight: 700,
                                cursor: 'pointer',
                                fontSize: '0.95rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            <Users size={16} />
                            {c.student?.name}
                            <span style={{
                                background: selectedIdx === idx ? 'rgba(255,255,255,0.3)' : '#e0f2fe',
                                color: selectedIdx === idx ? 'white' : '#0369a1',
                                borderRadius: '12px',
                                padding: '1px 8px',
                                fontSize: '0.75rem'
                            }}>
                                Class {c.student?.class}
                            </span>
                        </button>
                    ))}
                </div>
            )}

            {/* Active Child Summary */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '25px', marginBottom: '40px' }}>
                <div className="glass-card" style={{ maxWidth: 'none', margin: 0, borderTop: '5px solid var(--primary)' }}>
                    <h3 style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}><User size={20} /> Student Profile</h3>
                    <div style={{ fontSize: '0.95rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <p><strong>Name:</strong> {student?.name}</p>
                        <p><strong>Roll No:</strong> {student?.roll_no}</p>
                        <p><strong>Class:</strong> {student?.class}</p>
                        {student?.email && <p><strong>Email:</strong> {student?.email}</p>}
                    </div>
                </div>

                <div className="glass-card" style={{ maxWidth: 'none', margin: 0, borderTop: '5px solid var(--secondary)' }}>
                    <h3 style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}><CreditCard size={20} /> Fees Status</h3>
                    <div style={{ marginBottom: '15px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <p>Total: <strong>₹{fees?.total_amount || 0}</strong></p>
                        <p>Paid: <strong style={{ color: '#16a34a' }}>₹{fees?.paid_amount || 0}</strong></p>
                        <p>Remaining: <strong style={{ color: '#dc2626' }}>₹{(fees?.total_amount || 0) - (fees?.paid_amount || 0)}</strong></p>
                    </div>
                    {fees?.status !== 'paid' && (
                        <button onClick={() => handlePayment(student?.id)} className="btn-primary" style={{ background: '#ffa000' }}>
                            Pay Online (Mock)
                        </button>
                    )}
                    {fees?.status === 'paid' && <span style={{ color: '#4caf50', fontWeight: 'bold' }}>✓ Fully Paid</span>}
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                    <div className="glass-card" style={{ maxWidth: 'none', margin: 0 }}>
                        <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}><Calendar size={20} /> Recent Attendance</h3>
                        {(attendance || []).length > 0 ? (
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
                                                    {record.status?.toUpperCase()}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p style={{ textAlign: 'center', padding: '20px', color: 'var(--text-secondary)' }}>No attendance records yet.</p>
                        )}
                    </div>

                    <div className="glass-card" style={{ maxWidth: 'none', margin: 0 }}>
                        <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <FileText size={20} /> Homework &amp; Assignments
                            <span style={{ marginLeft: 'auto', fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 400 }}>
                                Class: {student?.class}
                            </span>
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {(homework || []).map(hw => (
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
                            {(homework || []).length === 0 && (
                                <p style={{ textAlign: 'center', padding: '20px', color: 'var(--text-secondary)' }}>No pending homework assigned.</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="glass-card" style={{ maxWidth: 'none', margin: 0 }}>
                    <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}><Bell size={20} /> School Notices</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {(notices || []).map(notice => (
                            <div key={notice.id} style={{ padding: '12px', background: '#f8fafc', borderRadius: '10px', borderLeft: '3px solid var(--primary)' }}>
                                <p style={{ fontSize: '0.9rem', marginBottom: '5px' }}>{notice.message}</p>
                                <small style={{ color: 'var(--text-secondary)' }}>{new Date(notice.created_at).toLocaleString()}</small>
                            </div>
                        ))}
                        {(notices || []).length === 0 && <p style={{ color: 'var(--text-secondary)', textAlign: 'center' }}>No notices.</p>}
                    </div>
                </div>
            </div>

            {/* Diagnostic Footer */}
            <footer style={{ marginTop: '60px', padding: '20px', borderTop: '1px solid #eee', fontSize: '0.8rem', color: '#94a3b8', textAlign: 'center' }}>
                <p>System Diagnostic: Account {diagnostics?.email} | ID {diagnostics?.parentId} | Linked Students: {diagnostics?.childCount}</p>
            </footer>
        </div>
    );
};

export default ParentDashboard;
