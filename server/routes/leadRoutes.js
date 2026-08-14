const express = require('express');
const router = express.Router();
const leadController = require('../controllers/leadController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', leadController.getLeads);
router.post('/', leadController.createLead);
router.get('/:id', leadController.getLead);
router.patch('/:id/status', leadController.updateStatus);
router.patch('/:id/assign', leadController.assignLeadAdvisor);
router.post('/:id/notes', leadController.addNote);

module.exports = router;
