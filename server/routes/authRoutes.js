const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { validateLogin } = require('../middleware/validateMiddleware');

router.post('/login', validateLogin, authController.login);
router.get('/me', protect, authController.getMe);

module.exports = router;
