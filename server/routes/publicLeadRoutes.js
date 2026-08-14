const express = require('express');
const router = express.Router();
const publicLeadController = require('../controllers/publicLeadController');

router.post('/', publicLeadController.createPublicLead);

module.exports = router;
