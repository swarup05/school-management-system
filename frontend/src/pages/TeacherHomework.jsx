import React, { useState } from 'react';
import API from '../api/api';
import { BookOpen, Upload } from 'lucide-react';

const TeacherHomework = () => {
    const [className, setClassName] = useState('1st Standard');
    const [homework, setHomework] = useState({ subject: '', description: '', file: null });

    const handleHomeworkSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('className', className);
        formData.append('subject', homework.subject);
        formData.append('description', homework.description);
        if (homework.file) formData.append('homeworkFile', homework.file);

        try {
            await API.post('/teacher/homework', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert('Homework assigned to class ' + className);
            setHomework({ subject: '', description: '', file: null });
        } catch (err) {
            alert('Homework upload failed');
        }
    };

    return (
        <div className="glass-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '25px' }}>
                <BookOpen size={24} /> New Homework Assignment
            </h2>
            <form onSubmit={handleHomeworkSubmit}>
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ fontSize: '0.9rem' }}>Target Class</label>
                    <select className="input-field" value={className} onChange={(e) => setClassName(e.target.value)}>
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
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ fontSize: '0.9rem' }}>Subject Name</label>
                    <input 
                        type="text" 
                        className="input-field" 
                        placeholder="e.g. Physics, History" 
                        value={homework.subject} 
                        onChange={(e) => setHomework({...homework, subject: e.target.value})} 
                        required 
                    />
                </div>
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ fontSize: '0.9rem' }}>Details / Instructions</label>
                    <textarea 
                        className="input-field" 
                        style={{ minHeight: '120px' }}
                        placeholder="Describe the assignment..." 
                        value={homework.description} 
                        onChange={(e) => setHomework({...homework, description: e.target.value})} 
                        required
                    ></textarea>
                </div>
                <div style={{ marginBottom: '25px', padding: '20px', border: '2px dashed #e2e8f0', borderRadius: '15px', textAlign: 'center' }}>
                    <label style={{ cursor: 'pointer', color: 'var(--primary)', fontWeight: 600 }}>
                        <Upload size={30} style={{ display: 'block', margin: '0 auto 10px' }} />
                        {homework.file ? homework.file.name : 'Upload Reference File (PDF/Image)'}
                        <input 
                            type="file" 
                            style={{ display: 'none' }}
                            onChange={(e) => setHomework({...homework, file: e.target.files[0]})}
                        />
                    </label>
                </div>
                <button type="submit" className="btn-primary">Post to Students</button>
            </form>
        </div>
    );
};

export default TeacherHomework;
