import React, { useState, useEffect } from 'react';
import API from '../api/api';
import { Users, Trash2, Search } from 'lucide-react';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const { data } = await API.get('/admin/users');
            setUsers(data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to permanently delete this user account?')) return;
        try {
            await API.delete(`/admin/delete-user/${id}`);
            fetchUsers();
        } catch (err) {
            alert('Deletion failed. The user might have linked records (attendance/marks).');
        }
    };

    const filteredUsers = users.filter(user => 
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
        user.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="glass-card" style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Users size={24} /> School User Directory
                </h2>
                <div style={{ position: 'relative', width: '300px' }}>
                    <Search size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-secondary)' }} />
                    <input 
                        type="text" 
                        className="input-field" 
                        placeholder="Search by email or role..." 
                        style={{ marginBottom: 0, paddingLeft: '40px' }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: '#f8fafc', textAlign: 'left' }}>
                            <th style={{ padding: '15px' }}>ID</th>
                            <th style={{ padding: '15px' }}>Email Address</th>
                            <th style={{ padding: '15px' }}>Role</th>
                            <th style={{ padding: '15px' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map(user => (
                            <tr key={user.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                <td style={{ padding: '15px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>#{user.id}</td>
                                <td style={{ padding: '15px', fontWeight: 500 }}>{user.email}</td>
                                <td style={{ padding: '15px' }}>
                                    <span style={{ 
                                        padding: '5px 12px', 
                                        borderRadius: '20px', 
                                        fontSize: '0.75rem',
                                        fontWeight: 600,
                                        textTransform: 'uppercase',
                                        background: user.role === 'admin' ? '#fee2e2' : user.role === 'teacher' ? '#e0f2fe' : '#f0fdf4',
                                        color: user.role === 'admin' ? '#991b1b' : user.role === 'teacher' ? '#075985' : '#166534'
                                    }}>{user.role}</span>
                                </td>
                                <td style={{ padding: '15px' }}>
                                    {user.id !== parseInt(localStorage.getItem('userId')) && (
                                        <button 
                                            onClick={() => handleDelete(user.id)}
                                            style={{ border: 'none', background: 'none', color: '#ef4444', cursor: 'pointer', padding: '5px' }}
                                            title="Delete User"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredUsers.length === 0 && !loading && (
                    <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                        No users found matching your search.
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserList;
