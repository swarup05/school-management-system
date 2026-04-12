const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyToken, authorize } = require('../middleware/authMiddleware');

router.use(verifyToken);
router.use(authorize(['admin']));

router.post('/add-teacher', adminController.addTeacher);
router.post('/add-student', adminController.addStudent);
router.post('/send-notice', adminController.sendNotice);
router.get('/users', adminController.getUsers);
router.delete('/delete-user/:id', adminController.deleteUser);

module.exports = router;
