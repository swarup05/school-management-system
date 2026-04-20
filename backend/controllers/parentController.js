const db = require('../config/db');

// Get Student Data (Performance, Fees, Homework) — supports multiple children
exports.getStudentDashboard = async (req, res) => {
    try {
        // Find ALL children of this parent
        const [students] = await db.query('SELECT * FROM students WHERE parent_id = ?', [req.userId]);
        if (students.length === 0) {
            return res.json({ children: [], notices: [], message: 'No student associated with this parent' });
        }

        // Build per-child data
        const childrenData = await Promise.all(students.map(async (student) => {
            try {
                const studentId = student.id;

                const [attendance] = await db.query(
                    'SELECT * FROM attendance WHERE student_id = ? ORDER BY date DESC LIMIT 10',
                    [studentId]
                );
                const [marks] = await db.query('SELECT * FROM marks WHERE student_id = ?', [studentId]);
                const [fees] = await db.query('SELECT * FROM fees WHERE student_id = ?', [studentId]);
                const [homework] = await db.query(
                    'SELECT * FROM homework WHERE class = ? ORDER BY created_at DESC LIMIT 5',
                    [student.class]
                );

                return {
                    student,
                    attendance: attendance || [],
                    marks: marks || [],
                    fees: fees[0] || { total_amount: 0, paid_amount: 0, status: 'unpaid' },
                    homework: homework || []
                };
            } catch (childError) {
                console.error(`Error fetching data for student ${student.id}:`, childError);
                // Return basic student info if deep queries fail
                return {
                    student,
                    attendance: [],
                    marks: [],
                    fees: { total_amount: 0, paid_amount: 0, status: 'error' },
                    homework: []
                };
            }
        }));

        // Get Notices (school-wide)
        const [notices] = await db.query('SELECT * FROM notices ORDER BY created_at DESC LIMIT 5');

        res.json({ 
            children: childrenData, 
            notices: notices || [], 
            parentId: req.userId 
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
