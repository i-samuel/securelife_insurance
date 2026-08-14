const express = require('express');
const router = express.Router();
const publicLeadController = require('../controllers/publicLeadController');
const { validateLead } = require('../middleware/validateMiddleware');

router.post('/', validateLead, publicLeadController.createPublicLead);

module.exports = router;
