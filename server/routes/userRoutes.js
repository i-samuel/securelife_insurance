const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect, requireRole } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', authController.getUsers);
router.get('/roles', authController.getRoles);
router.post('/', requireRole('ADMIN'), authController.createUser);

module.exports = router;
