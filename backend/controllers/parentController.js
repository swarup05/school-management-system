const db = require('../config/db');

// Get Student Data (Performance, Fees, Homework)
exports.getStudentDashboard = async (req, res) => {
    try {
        // Find parent's children (students)
        const [students] = await db.query('SELECT * FROM students WHERE parent_id = ?', [req.userId]);
        if (students.length === 0) return res.status(404).json({ message: 'No student associated with this parent' });

        const student = students[0];
        const studentId = student.id;

        // Get Attendance
        const [attendance] = await db.query('SELECT * FROM attendance WHERE student_id = ? ORDER BY date DESC LIMIT 10', [studentId]);
        
        // Get Marks
        const [marks] = await db.query('SELECT * FROM marks WHERE student_id = ?', [studentId]);

        // Get Fees
        const [fees] = await db.query('SELECT * FROM fees WHERE student_id = ?', [studentId]);

        // Get Homework for the class
        const [homework] = await db.query('SELECT * FROM homework WHERE class = ? ORDER BY created_at DESC LIMIT 5', [student.class]);

        // Get Notices
        const [notices] = await db.query('SELECT * FROM notices ORDER BY created_at DESC LIMIT 5');

        res.json({
            student,
            attendance,
            marks,
            fees: fees[0] || { total_amount: 0, paid_amount: 0, status: 'unpaid' },
            homework,
            notices
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Mock Payment
exports.makePayment = async (req, res) => {
    const { amount, studentId } = req.body;
    try {
        await db.query('UPDATE fees SET paid_amount = paid_amount + ?, status = CASE WHEN paid_amount + ? >= total_amount THEN "paid" ELSE "partial" END WHERE student_id = ?', 
            [amount, amount, studentId]);
        res.json({ message: 'Payment successful (Mock)' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
