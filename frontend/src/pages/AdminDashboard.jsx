import React, { useState, useEffect } from 'react';
import API from '../api/api';
import { Users, UserCheck } from 'lucide-react';

const AdminDashboard = () => {
    const [teachers, setTeachers] = useState([]);
    const [allStudents, setAllStudents] = useState([]);
    const [selectedClass, setSelectedClass] = useState('1st Standard');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const { data } = await API.get('/admin/users');
            setTeachers(data?.teachers || []);
            setAllStudents(data?.students || []);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching admin dashboard data:', err);
            setLoading(false);
        }
    };

    const filteredStudents = (allStudents || []).filter(s => s && s.class === selectedClass);

    if (loading) return <div style={{ padding: '20px' }}>Loading Dashboard...</div>;

    return (
        <div style={{ paddingBottom: '40px' }}>
            <header style={{ marginBottom: '30px' }}>
                <h1 style={{ fontWeight: 800, color: 'var(--primary)' }}>School Overview</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Welcome to the Warana Valley School Admin Panel.</p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '40px' }}>
                {/* Staff Section */}
                <div className="glass-card" style={{ maxWidth: 'none', margin: 0, padding: '25px' }}>
                    <h2 style={{ fontSize: '1.4rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <UserCheck size={24} /> Staff Directory (Teachers)
                    </h2>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid #f1f5f9', textAlign: 'left' }}>
                                    <th style={{ padding: '15px' }}>Name</th>
                                    <th style={{ padding: '15px' }}>Email</th>
                                    <th style={{ padding: '15px' }}>Subject</th>
                                </tr>
                            </thead>
                            <tbody>
                                {teachers.map((t, idx) => (
                                    <tr key={t.id || idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                        <td style={{ padding: '15px', fontWeight: 600 }}>{t.name}</td>
                                        <td style={{ padding: '15px' }}>{t.email}</td>
                                        <td style={{ padding: '15px' }}>
                                            <span style={{ padding: '4px 12px', background: '#e0f2fe', color: '#075985', borderRadius: '15px', fontSize: '0.8rem', fontWeight: 600 }}>
                                                {t.subject}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {teachers.length === 0 && <p style={{ padding: '20px', textAlign: 'center' }}>No staff members found.</p>}
                    </div>
                </div>

                {/* Students Section */}
                <div className="glass-card" style={{ maxWidth: 'none', margin: 0, padding: '25px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h2 style={{ fontSize: '1.4rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Users size={24} /> Student Records
                        </h2>
                        <select 
                            className="input-field" 
                            style={{ width: '180px', marginBottom: 0 }}
                            value={selectedClass}
                            onChange={(e) => setSelectedClass(e.target.value)}
                        >
                            <option value="Playgroup">Playgroup</option>
                            <option value="LKG">LKG</option>
                            <option value="UKG">UKG</option>
                            <option value="1st Standard">1st Standard</option>
                            <option value="2nd Standard">2nd Standard</option>
                            <option value="3rd Standard">3rd Standard</option>
                            <option value="4th Standard">4th Standard</option>
                            <option value="5th Standard">5th Standard</option>
                            <option value="6th Standard">6th Standard</option>
                            <option value="7th Standard">7th Standard</option>
                            <option value="8th Standard">8th Standard</option>
                            <option value="9th Standard">9th Standard</option>
                            <option value="10th Standard">10th Standard</option>
                        </select>
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid #f1f5f9', textAlign: 'left' }}>
                                    <th style={{ padding: '15px' }}>Roll No</th>
                                    <th style={{ padding: '15px' }}>Student Name</th>
                                    <th style={{ padding: '15px' }}>Parent Name</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredStudents.map((s, idx) => (
                                    <tr key={s.id || idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                        <td style={{ padding: '15px' }}>{s.roll_no}</td>
                                        <td style={{ padding: '15px', fontWeight: 600 }}>{s.name}</td>
                                        <td style={{ padding: '15px', color: 'var(--text-secondary)' }}>{s.parent_name}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredStudents.length === 0 && (
                            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                No students registered for {selectedClass}.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
