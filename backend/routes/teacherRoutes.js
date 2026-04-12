const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const teacherController = require('../controllers/teacherController');
const { verifyToken, authorize } = require('../middleware/authMiddleware');

// Multer config for homework
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/homework/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

router.use(verifyToken);
router.use(authorize(['teacher']));

router.get('/students/:className', teacherController.getStudentsByClass);
router.post('/attendance', teacherController.markAttendance);
router.post('/marks', teacherController.uploadMarks);
router.post('/homework', upload.single('homeworkFile'), teacherController.uploadHomework);
router.get('/attendance-report', teacherController.generateAttendancePDF);

module.exports = router;
