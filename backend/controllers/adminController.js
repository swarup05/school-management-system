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
        let parentId;

        // 1. Check if a parent with the same phone OR email already exists — reuse their account
        const [existingParent] = await db.query('SELECT id FROM parents WHERE phone = ? OR email = ?', [parentPhone, email]);

        if (existingParent.length > 0) {
            // Reuse existing parent account — same parent, second child (sibling)
            parentId = existingParent[0].id;
        } else {
            // Create a new parent user account using the provided email directly
            const hashedPassword = await bcrypt.hash(password, 10);
            const [parentUserResult] = await db.query(
                'INSERT INTO users (email, password, role) VALUES (?, ?, ?)',
                [email, hashedPassword, 'parent']
            );
            parentId = parentUserResult.insertId;
            await db.query(
                'INSERT INTO parents (id, name, phone, email) VALUES (?, ?, ?, ?)',
                [parentId, parentName, parentPhone, email]
            );
        }

        // 2. Register the student linked to this parent
        await db.query(
            'INSERT INTO students (name, email, class, roll_no, parent_id) VALUES (?, ?, ?, ?, ?)',
            [name, email, className, rollNo, parentId]
        );

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
        const [students] = await db.query('SELECT s.id, s.name, s.email, s.class, s.roll_no, p.name as parent_name, p.phone as parent_phone FROM students s LEFT JOIN parents p ON s.parent_id = p.id');
        
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
