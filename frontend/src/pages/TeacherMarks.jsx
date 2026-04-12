import React, { useState, useEffect } from 'react';
import API from '../api/api';
import { Award, Save } from 'lucide-react';

const TeacherMarks = () => {
    const [className, setClassName] = useState('1st Standard');
    const [subject, setSubject] = useState('');
    const [students, setStudents] = useState([]);
    const [marks, setMarks] = useState({});

    useEffect(() => {
        fetchStudents();
    }, [className]);

    const fetchStudents = async () => {
        try {
            const { data } = await API.get(`/teacher/students/${className}`);
            setStudents(data);
            const initial = {};
            data.forEach(s => initial[s.id] = '');
            setMarks(initial);
        } catch (err) {
            console.error(err);
        }
    };

    const handleMarkChange = (id, value) => {
        setMarks(prev => ({ ...prev, [id]: value }));
    };

    const submitMarks = async () => {
        const entry = Object.keys(marks).map(id => ({
            student_id: parseInt(id),
            marks: parseInt(marks[id])
        }));
        try {
            await API.post('/teacher/marks', { 
                studentMarks: entry, 
                className, 
                subject 
            });
            alert('Marks uploaded successfully!');
        } catch (err) {
            alert('Failed to upload marks');
        }
    };

    return (
        <div className="glass-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Award size={24} /> Examination Marks Entry
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
                </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '0.9rem' }}>Subject Name</label>
                <input 
                    type="text" 
                    className="input-field" 
                    placeholder="e.g. Science Mid-term" 
                    value={subject} 
                    onChange={(e) => setSubject(e.target.value)} 
                    required 
                />
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ borderBottom: '2px solid #f1f5f9', textAlign: 'left' }}>
                        <th style={{ padding: '15px' }}>Roll No</th>
                        <th style={{ padding: '15px' }}>Student Name</th>
                        <th style={{ padding: '15px' }}>Marks (out of 100)</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map(student => (
                        <tr key={student.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                            <td style={{ padding: '15px' }}>{student.roll_no}</td>
                            <td style={{ padding: '15px', fontWeight: 500 }}>{student.name}</td>
                            <td style={{ padding: '15px' }}>
                                <input 
                                    type="number" 
                                    className="input-field" 
                                    style={{ width: '100px', marginBottom: 0 }}
                                    max="100"
                                    min="0"
                                    value={marks[student.id]}
                                    onChange={(e) => handleMarkChange(student.id, e.target.value)}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button onClick={submitMarks} className="btn-primary" style={{ marginTop: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                <Save size={20} /> Save Exam Records
            </button>
        </div>
    );
};

export default TeacherMarks;
