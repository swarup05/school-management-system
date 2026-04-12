import React, { useState } from 'react';
import API from '../api/api';
import { GraduationCap } from 'lucide-react';

const AddStudent = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '', // student email
        password: '', // common password for parent
        className: '10A',
        rollNo: '',
        parentName: '',
        parentPhone: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await API.post('/admin/add-student', formData);
            alert('Student & Parent registered!');
            setFormData({
                name: '', email: '', password: '', 
                className: '10A', rollNo: '', 
                parentName: '', parentPhone: ''
            });
        } catch (err) {
            alert('Registration failed');
        }
    };

    return (
        <div className="glass-card" style={{ maxWidth: '700px', margin: '0 auto' }}>
            <h2 style={{ marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <GraduationCap size={24} /> Register New Student
            </h2>
            <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div style={{ gridColumn: 'span 2' }}>
                    <h4 style={{ color: 'var(--primary)', borderBottom: '1px solid #eee', paddingBottom: '5px', marginBottom: '15px' }}>Academic Info</h4>
                </div>
                <div>
                    <label style={{ fontSize: '0.85rem' }}>Full Name</label>
                    <input type="text" className="input-field" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                </div>
                <div>
                    <label style={{ fontSize: '0.85rem' }}>Roll Number</label>
                    <input type="text" className="input-field" value={formData.rollNo} onChange={(e) => setFormData({...formData, rollNo: e.target.value})} required />
                </div>
                <div>
                    <label style={{ fontSize: '0.85rem' }}>Class</label>
                    <select className="input-field" value={formData.className} onChange={(e) => setFormData({...formData, className: e.target.value})}>
                        <option value="Playgroup">Playgroup</option>
                        <option value="LKG">LKG (Lower Kindergarten)</option>
                        <option value="UKG">UKG (Upper Kindergarten)</option>
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
                <div>
                    <label style={{ fontSize: '0.85rem' }}>Student Email (Unique ID)</label>
                    <input type="email" className="input-field" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
                </div>

                <div style={{ gridColumn: 'span 2' }}>
                    <h4 style={{ color: 'var(--primary)', borderBottom: '1px solid #eee', paddingBottom: '5px', marginBottom: '15px', marginTop: '10px' }}>Parent & Security</h4>
                </div>
                <div>
                    <label style={{ fontSize: '0.85rem' }}>Parent Name</label>
                    <input type="text" className="input-field" value={formData.parentName} onChange={(e) => setFormData({...formData, parentName: e.target.value})} required />
                </div>
                <div>
                    <label style={{ fontSize: '0.85rem' }}>Parent Contact</label>
                    <input type="text" className="input-field" value={formData.parentPhone} onChange={(e) => setFormData({...formData, parentPhone: e.target.value})} required />
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                    <label style={{ fontSize: '0.85rem' }}>Portal Password (for Parent Login)</label>
                    <input type="password" className="input-field" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} required placeholder="••••••••" />
                </div>
                
                <div style={{ gridColumn: 'span 2' }}>
                    <button type="submit" className="btn-primary">Finalize Registration</button>
                </div>
            </form>
        </div>
    );
};

export default AddStudent;
