import React, { useState, useEffect } from 'react';
import API from '../api/api';
import { ClipboardList, BookOpen, Download, CheckCircle2 } from 'lucide-react';

const TeacherDashboard = () => {
    const [className, setClassName] = useState('1st Standard'); // Default
    const [students, setStudents] = useState([]);
    const [attendance, setAttendance] = useState({});
    const [homework, setHomework] = useState({ subject: '', description: '', file: null });
    const [notices, setNotices] = useState([]);

    useEffect(() => {
        fetchStudents();
        fetchNotices();
    }, [className]);

    const fetchStudents = async () => {
        try {
            const { data } = await API.get(`/teacher/students/${className}`);
            setStudents(data);
            // Init attendance as 'present' for all
            const initial = {};
            data.forEach(s => initial[s.id] = 'present');
            setAttendance(initial);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchNotices = async () => {
        try {
            const { data } = await API.get('/parent/dashboard'); // Teachers can see admin notices too
            setNotices(data.notices);
        } catch (err) {
            console.error(err);
        }
    };

    const handleAttendanceChange = (id, status) => {
        setAttendance(prev => ({ ...prev, [id]: status }));
    };

    const submitAttendance = async () => {
        const records = Object.keys(attendance).map(id => ({
            student_id: parseInt(id),
            status: attendance[id]
        }));
        try {
            await API.post('/teacher/attendance', { 
                attendanceRecords: records, 
                date: new Date().toISOString().split('T')[0],
                subject: 'General'
            });
            alert('Attendance submitted!');
        } catch (err) {
            alert('Failed to submit attendance');
        }
    };

    const downloadReport = async () => {
        const date = new Date().toISOString().split('T')[0];
        try {
            const { data } = await API.get(`/teacher/attendance-report?className=${className}&date=${date}`);
            window.open(`http://localhost:5000${data.downloadUrl}`, '_blank');
        } catch (err) {
            alert('Error generating report. Make sure you submitted attendance for today.');
        }
    };

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
            alert('Homework uploaded!');
            setHomework({ subject: '', description: '', file: null });
        } catch (err) {
            alert('Homework upload failed');
        }
    };

    return (
        <div>
            <header style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontWeight: 800, color: 'var(--primary)' }}>Teacher Portal</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Welcome back! Manage your class "{className}"</p>
                </div>
                <select 
                    className="input-field" 
                    style={{ width: '180px', marginBottom: 0 }}
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
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
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                <div className="glass-card" style={{ maxWidth: 'none', margin: 0 }}>
                    <h2 style={{ fontSize: '1.2rem', marginBottom: '15px' }}>Class Summary</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>You are currently managing <strong>{students.length} students</strong> in Class {className}.</p>
                    <p style={{ marginTop: '10px', fontSize: '0.9rem' }}>Use the sidebar to mark attendance, post homework, or upload marks.</p>
                </div>

                <div className="glass-card" style={{ maxWidth: 'none', margin: 0 }}>
                    <h2 style={{ fontSize: '1.2rem', marginBottom: '15px' }}>Recent Announcements</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {notices.slice(0, 3).map(n => (
                            <div key={n.id} style={{ padding: '10px', background: '#f8fafc', borderRadius: '8px', borderLeft: '3px solid var(--primary)' }}>
                                <p style={{ fontSize: '0.85rem' }}>{n.message.substring(0, 50)}...</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeacherDashboard;
