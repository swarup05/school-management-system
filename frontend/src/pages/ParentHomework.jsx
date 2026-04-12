import React, { useState, useEffect } from 'react';
import API from '../api/api';
import { BookOpen, FileText, Calendar } from 'lucide-react';

const ParentHomework = () => {
    const [homework, setHomework] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHomework();
    }, []);

    const fetchHomework = async () => {
        try {
            const { data } = await API.get('/parent/dashboard');
            setHomework(data.homework || []);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching homework:', err);
            setLoading(false);
        }
    };

    if (loading) return <div style={{ padding: '20px' }}>Loading Homework...</div>;

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <header style={{ marginBottom: '30px' }}>
                <h1 style={{ fontWeight: 800, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <BookOpen size={32} /> Homework & Assignments
                </h1>
                <p style={{ color: 'var(--text-secondary)' }}>Review and download current assignments for your child's class.</p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '25px' }}>
                {homework.map(hw => (
                    <div key={hw.id} className="glass-card" style={{ maxWidth: 'none', margin: 0, padding: '25px', borderLeft: '6px solid #ffa000' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                            <div>
                                <h3 style={{ color: 'var(--primary)', marginBottom: '5px' }}>{hw.subject}</h3>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                                    <Calendar size={14} /> Assigned on {new Date(hw.created_at).toLocaleDateString()}
                                </div>
                            </div>
                        </div>
                        
                        <p style={{ fontSize: '1rem', lineHeight: 1.6, marginBottom: '20px', color: '#334155' }}>
                            {hw.description}
                        </p>

                        {hw.file_url && (
                            <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <FileText size={20} style={{ color: '#075985' }} />
                                    <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>Assignment Reference File</span>
                                </div>
                                <a 
                                    href={`http://localhost:5000${hw.file_url}`} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="btn-primary"
                                    style={{ width: 'auto', padding: '8px 20px', fontSize: '0.9rem', background: '#0284c7' }}
                                >
                                    Download
                                </a>
                            </div>
                        )}
                    </div>
                ))}

                {homework.length === 0 && (
                    <div className="glass-card" style={{ textAlign: 'center', padding: '60px' }}>
                        <BookOpen size={48} style={{ color: '#cbd5e1', marginBottom: '15px' }} />
                        <h3 style={{ color: 'var(--text-secondary)' }}>No Homework Assigned</h3>
                        <p style={{ color: '#94a3b8' }}>Perfect! All assignments are currently up to date.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ParentHomework;
