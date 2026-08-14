const express = require('express');
const router = express.Router();
const planController = require('../controllers/planController');
const { protect, requireRole } = require('../middleware/authMiddleware');
const { validatePlan } = require('../middleware/validateMiddleware');

// Public routes for Landing Page / Visitors
router.get('/public', planController.getPublicPlans);
router.get('/public/:identifier', planController.getPlan);
router.post('/recommend', planController.recommendPlans);

// Protected CRM routes
router.use(protect);
router.get('/', planController.getPlans);
router.get('/:identifier', planController.getPlan);

// Admin-only plan management
router.post('/', requireRole('ADMIN'), validatePlan, planController.createPlan);
router.put('/:id', requireRole('ADMIN'), validatePlan, planController.updatePlan);
router.patch('/:id/status', requireRole('ADMIN'), planController.togglePlanStatus);
router.delete('/:id', requireRole('ADMIN'), planController.deletePlan);

module.exports = router;
