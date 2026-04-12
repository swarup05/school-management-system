import React, { useState } from 'react';
import API from '../api/api';
import { UserPlus } from 'lucide-react';

const AddTeacher = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        subject: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await API.post('/admin/add-teacher', formData);
            alert('Teacher added successfully!');
            setFormData({ name: '', email: '', password: '', subject: '' });
        } catch (err) {
            alert('Failed to add teacher');
        }
    };

    return (
        <div className="glass-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{ marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <UserPlus size={24} /> Register New Teacher
            </h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Full Name</label>
                    <input 
                        type="text" 
                        className="input-field" 
                        placeholder="e.g. John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        required
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Email Address</label>
                    <input 
                        type="email" 
                        className="input-field" 
                        placeholder="teacher@school.com"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        required
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Initial Password</label>
                    <input 
                        type="password" 
                        className="input-field" 
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        required
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Primary Subject</label>
                    <input 
                        type="text" 
                        className="input-field" 
                        placeholder="e.g. Mathematics"
                        value={formData.subject}
                        onChange={(e) => setFormData({...formData, subject: e.target.value})}
                        required
                    />
                </div>
                <button type="submit" className="btn-primary" style={{ marginTop: '10px' }}>Save Teacher Account</button>
            </form>
        </div>
    );
};

export default AddTeacher;
