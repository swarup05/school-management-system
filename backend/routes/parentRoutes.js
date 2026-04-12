const express = require('express');
const router = express.Router();
const parentController = require('../controllers/parentController');
const { verifyToken, authorize } = require('../middleware/authMiddleware');

router.use(verifyToken);
router.use(authorize(['parent']));

router.get('/dashboard', parentController.getStudentDashboard);
router.post('/payment', parentController.makePayment);

module.exports = router;
