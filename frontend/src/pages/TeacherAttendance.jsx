import React, { useState, useEffect } from 'react';
import API from '../api/api';
import { ClipboardList, Download } from 'lucide-react';

const TeacherAttendance = () => {
    const [className, setClassName] = useState('Playgroup');
    const [students, setStudents] = useState([]);
    const [attendance, setAttendance] = useState({});
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        fetchStudents();
    }, [className]);

    const fetchStudents = async () => {
        try {
            const { data } = await API.get(`/teacher/students/${className}`);
            setStudents(data);
            const initial = {};
            data.forEach(s => initial[s.id] = 'present');
            setAttendance(initial);
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
                date: date,
                subject: 'General'
            });
            alert('Attendance submitted successfully!');
        } catch (err) {
            alert('Failed to submit attendance');
        }
    };

    const downloadReport = async () => {
        try {
            const { data } = await API.get(`/teacher/attendance-report?className=${className}&date=${date}`);
            window.open(`http://localhost:5000${data.downloadUrl}`, '_blank');
        } catch (err) {
            alert('Error generating report.');
        }
    };

    return (
        <div className="glass-card" style={{ maxWidth: '900px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <ClipboardList size={24} /> Class Attendance
                </h2>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <select className="input-field" style={{ width: '180px', marginBottom: 0 }} value={className} onChange={(e) => setClassName(e.target.value)}>
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
                    <input type="date" className="input-field" style={{ width: '150px', marginBottom: 0 }} value={date} onChange={(e) => setDate(e.target.value)} />
                    <button onClick={downloadReport} className="btn-primary" style={{ width: 'auto', padding: '0 20px', background: '#4caf50' }}>
                        <Download size={18} />
                    </button>
                </div>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ borderBottom: '2px solid #f1f5f9', textAlign: 'left' }}>
                        <th style={{ padding: '15px' }}>Roll No</th>
                        <th style={{ padding: '15px' }}>Full Name</th>
                        <th style={{ padding: '15px' }}>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map(student => (
                        <tr key={student.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                            <td style={{ padding: '15px' }}>{student.roll_no}</td>
                            <td style={{ padding: '15px', fontWeight: 500 }}>{student.name}</td>
                            <td style={{ padding: '15px' }}>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button 
                                        onClick={() => handleAttendanceChange(student.id, 'present')}
                                        style={{ 
                                            padding: '6px 15px', borderRadius: '8px', border: '1px solid #ddd',
                                            background: attendance[student.id] === 'present' ? 'var(--primary)' : 'white',
                                            color: attendance[student.id] === 'present' ? 'white' : 'black',
                                            cursor: 'pointer', fontWeight: 600
                                        }}
                                    >P</button>
                                    <button 
                                        onClick={() => handleAttendanceChange(student.id, 'absent')}
                                        style={{ 
                                            padding: '6px 15px', borderRadius: '8px', border: '1px solid #ddd',
                                            background: attendance[student.id] === 'absent' ? '#ef4444' : 'white',
                                            color: attendance[student.id] === 'absent' ? 'white' : 'black',
                                            cursor: 'pointer', fontWeight: 600
                                        }}
                                    >A</button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button onClick={submitAttendance} className="btn-primary" style={{ marginTop: '30px' }}>Save Attendance Records</button>
        </div>
    );
};

export default TeacherAttendance;
