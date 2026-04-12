import React, { useState, useEffect } from 'react';
import API from '../api/api';
import { Bell, Send } from 'lucide-react';

const NoticesPage = () => {
    const [notices, setNotices] = useState([]);
    const [newNotice, setNewNotice] = useState('');
    const [loading, setLoading] = useState(true);
    const role = localStorage.getItem('role');

    useEffect(() => {
        fetchNotices();
    }, []);

    const fetchNotices = async () => {
        try {
            const { data } = await API.get('/parent/dashboard'); // Notices are shared
            setNotices(data.notices);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const handleSendNotice = async (e) => {
        e.preventDefault();
        try {
            await API.post('/admin/send-notice', { message: newNotice });
            alert('Notice broadcasted successfully!');
            setNewNotice('');
            fetchNotices();
        } catch (err) {
            alert('Failed to send notice');
        }
    };

    return (
        <div style={{ display: 'grid', gridTemplateColumns: role === 'admin' ? '1fr 1.5fr' : '1fr', gap: '30px' }}>
            {role === 'admin' && (
                <div className="glass-card" style={{ margin: 0 }}>
                    <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                        <Send size={24} /> Create Notice
                    </h2>
                    <form onSubmit={handleSendNotice}>
                        <textarea 
                            className="input-field" 
                            style={{ minHeight: '150px' }}
                            placeholder="Type the official announcement here..."
                            value={newNotice}
                            onChange={(e) => setNewNotice(e.target.value)}
                            required
                        ></textarea>
                        <button type="submit" className="btn-primary">Post Announcement</button>
                    </form>
                </div>
            )}

            <div className="glass-card" style={{ margin: 0 }}>
                <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                    <Bell size={24} /> Official Notice Board
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {notices.map(notice => (
                        <div key={notice.id} style={{ padding: '20px', background: '#f8fafc', borderRadius: '15px', borderLeft: '5px solid var(--primary)' }}>
                            <p style={{ fontSize: '1.1rem', marginBottom: '10px', lineHeight: '1.6' }}>{notice.message}</p>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                    Posted: {new Date(notice.created_at).toLocaleString()}
                                </span>
                                <span style={{ fontSize: '0.7rem', background: '#e0e7ff', color: '#3730a3', padding: '2px 8px', borderRadius: '10px', fontWeight: 600 }}>OFFICIAL</span>
                            </div>
                        </div>
                    ))}
                    {notices.length === 0 && !loading && (
                        <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '40px' }}>
                            Zero active notices.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NoticesPage;
