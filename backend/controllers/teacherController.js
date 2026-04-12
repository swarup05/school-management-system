const db = require('../config/db');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// Get Students by Class
exports.getStudentsByClass = async (req, res) => {
    const { className } = req.params;
    try {
        const [students] = await db.query('SELECT * FROM students WHERE class = ?', [className]);
        res.json(students);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Mark Attendance
exports.markAttendance = async (req, res) => {
    const { attendanceRecords, date, subject } = req.body;
    try {
        for (let record of attendanceRecords) {
            await db.query('INSERT INTO attendance (student_id, date, subject, status) VALUES (?, ?, ?, ?)', 
                [record.student_id, date, subject, record.status]);
        }
        res.status(201).json({ message: 'Attendance recorded successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Upload Marks
exports.uploadMarks = async (req, res) => {
    const { studentMarks, className, subject } = req.body;
    try {
        for (let entry of studentMarks) {
            await db.query('INSERT INTO marks (student_id, class, subject, marks_obtained) VALUES (?, ?, ?, ?)', 
                [entry.student_id, className, subject, entry.marks]);
        }
        res.status(201).json({ message: 'Marks uploaded successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Upload Homework
exports.uploadHomework = async (req, res) => {
    const { className, subject, description } = req.body;
    const fileUrl = req.file ? `/uploads/homework/${req.file.filename}` : null;
    try {
        await db.query('INSERT INTO homework (class, subject, description, file_url) VALUES (?, ?, ?, ?)', 
            [className, subject, description, fileUrl]);
        res.status(201).json({ message: 'Homework uploaded successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Generate Attendance PDF (Daily Summary)
exports.generateAttendancePDF = async (req, res) => {
    const { className, date } = req.query;
    try {
        const [records] = await db.query(`
            SELECT s.name, s.roll_no, a.status 
            FROM attendance a 
            JOIN students s ON a.student_id = s.id 
            WHERE s.class = ? AND a.date = ?
        `, [className, date]);

        const doc = new PDFDocument();
        const filename = `attendance_${className}_${date}.pdf`;
        const filePath = path.join(__dirname, '../uploads', filename);

        doc.pipe(fs.createWriteStream(filePath));
        doc.fontSize(20).text('WARANA VALLEY SCHOOL, SAGAON', { align: 'center' });
        doc.fontSize(16).text(`Attendance Report - Class: ${className}`, { align: 'center' });
        doc.text(`Date: ${date}`, { align: 'center' });
        doc.moveDown();

        records.forEach((record, index) => {
            doc.fontSize(12).text(`${index + 1}. ${record.name} (Roll: ${record.roll_no}) - ${record.status.toUpperCase()}`);
        });

        doc.end();

        res.json({ downloadUrl: `/uploads/${filename}` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
