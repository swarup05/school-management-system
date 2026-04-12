const db = require('../config/db');
const bcrypt = require('bcryptjs');

// Add Teacher
exports.addTeacher = async (req, res) => {
    const { name, email, password, subject } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const [userResult] = await db.query('INSERT INTO users (email, password, role) VALUES (?, ?, ?)', [email, hashedPassword, 'teacher']);
        const userId = userResult.insertId;

        await db.query('INSERT INTO teachers (id, name, email, subject) VALUES (?, ?, ?, ?)', [userId, name, email, subject]);
        res.status(201).json({ message: 'Teacher added successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Add Student
exports.addStudent = async (req, res) => {
    const { name, email, password, className, rollNo, parentName, parentPhone } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // 1. Create Parent User (Simple approach: one parent user per student for this demo)
        const parentEmail = `p_${email}`;
        const [parentUserResult] = await db.query('INSERT INTO users (email, password, role) VALUES (?, ?, ?)', [parentEmail, hashedPassword, 'parent']);
        const parentId = parentUserResult.insertId;
        await db.query('INSERT INTO parents (id, name, phone, email) VALUES (?, ?, ?, ?)', [parentId, parentName, parentPhone, parentEmail]);

        // 2. Create Student User (Wait, the request doesn't say student needs a login, but they might need one eventually. Let's stick to student data + parent login)
        // Actually, the parent is the one who logs in.
        await db.query('INSERT INTO students (name, class, roll_no, parent_id) VALUES (?, ?, ?, ?)', [name, className, rollNo, parentId]);
        
        res.status(201).json({ message: 'Student and Parent added successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Send Notice
exports.sendNotice = async (req, res) => {
    const { message } = req.body;
    try {
        await db.query('INSERT INTO notices (message) VALUES (?)', [message]);
        res.status(201).json({ message: 'Notice sent successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get Detailed Dashboard Data
exports.getUsers = async (req, res) => {
    try {
        const [teachers] = await db.query('SELECT u.id, t.name, u.email, t.subject FROM users u JOIN teachers t ON u.id = t.id');
        const [students] = await db.query('SELECT s.id, s.name, s.class, s.roll_no, p.name as parent_name FROM students s LEFT JOIN parents p ON s.parent_id = p.id');
        
        res.json({
            teachers,
            students
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete User
exports.deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        if (parseInt(id) === req.userId) {
            return res.status(403).json({ message: 'Error: You cannot delete your own admin account.' });
        }
        await db.query('DELETE FROM users WHERE id = ?', [id]);
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
