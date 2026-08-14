const planModel = require('../model/planModel');
const { matchPlansForLead } = require('../utils/recommendationEngine');

const getPublicPlans = async (req, res) => {
  try {
    const plans = await planModel.getAllPlans({ includeInactive: false });
    return res.status(200).json({
      status: 'success',
      results: plans.length,
      data: { plans },
    });
  } catch (error) {
    console.error('Error fetching public plans:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error fetching insurance plans.',
    });
  }
};

const getPlans = async (req, res) => {
  try {
    const plans = await planModel.getAllPlans({ includeInactive: true });
    return res.status(200).json({
      status: 'success',
      results: plans.length,
      data: { plans },
    });
  } catch (error) {
    console.error('Error fetching CRM plans:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error fetching plans.',
    });
  }
};

const getBenefits = async (req, res) => {
  try {
    const benefits = await planModel.getAllBenefits();
    return res.status(200).json({
      status: 'success',
      results: benefits.length,
      data: { benefits },
    });
  } catch (error) {
    console.error('Error fetching master benefits:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error fetching benefits list.',
    });
  }
};

const getPlan = async (req, res) => {
  try {
    const { identifier } = req.params;
    let plan;

    if (!isNaN(identifier)) {
      plan = await planModel.getPlanById(parseInt(identifier, 10));
    } else {
      plan = await planModel.getPlanBySlug(identifier);
    }

    if (!plan) {
      return res.status(404).json({
        status: 'fail',
        message: 'Insurance plan not found.',
      });
    }

    return res.status(200).json({
      status: 'success',
      data: { plan },
    });
  } catch (error) {
    console.error('Error fetching single plan:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error fetching plan details.',
    });
  }
};

const createPlan = async (req, res) => {
  try {
    const { name, slug, minAge, maxAge, minCoverage, maxCoverage, minPolicyTerm, maxPolicyTerm, minPremium, maxPremium } = req.body;

    if (!name || !slug || minAge === undefined || maxAge === undefined || !minCoverage || !maxCoverage || !minPolicyTerm || !maxPolicyTerm || !minPremium || !maxPremium) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide all required plan metrics and eligibility fields.',
      });
    }

    const existingSlug = await planModel.getPlanBySlug(slug);
    if (existingSlug) {
      return res.status(400).json({
        status: 'fail',
        message: 'An insurance plan with this slug already exists.',
      });
    }

    const newPlan = await planModel.createPlan(req.body);
    return res.status(201).json({
      status: 'success',
      message: 'Insurance plan created successfully.',
      data: { plan: newPlan },
    });
  } catch (error) {
    console.error('Error creating plan:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error creating insurance plan.',
    });
  }
};

const updatePlan = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await planModel.getPlanById(id);
    if (!existing) {
      return res.status(404).json({
        status: 'fail',
        message: 'Insurance plan not found.',
      });
    }

    const updatedPlan = await planModel.updatePlan(id, req.body);
    return res.status(200).json({
      status: 'success',
      message: 'Insurance plan updated successfully.',
      data: { plan: updatedPlan },
    });
  } catch (error) {
    console.error('Error updating plan:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error updating plan.',
    });
  }
};

const togglePlanStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const existing = await planModel.getPlanById(id);
    if (!existing) {
      return res.status(404).json({
        status: 'fail',
        message: 'Insurance plan not found.',
      });
    }

    const updatedPlan = await planModel.togglePlanActive(id, Boolean(isActive));
    return res.status(200).json({
      status: 'success',
      message: `Plan ${updatedPlan.is_active ? 'activated' : 'deactivated'} successfully.`,
      data: { plan: updatedPlan },
    });
  } catch (error) {
    console.error('Error toggling plan status:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error changing plan status.',
    });
  }
};

const deletePlan = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await planModel.getPlanById(id);
    if (!existing) {
      return res.status(404).json({
        status: 'fail',
        message: 'Insurance plan not found.',
      });
    }

    await planModel.deletePlan(id);
    return res.status(200).json({
      status: 'success',
      message: 'Insurance plan deleted successfully.',
    });
  } catch (error) {
    console.error('Error deleting plan:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error deleting insurance plan.',
    });
  }
};

const recommendPlans = async (req, res) => {
  try {
    const { age, dateOfBirth, requestedCoverage, requestedPolicyTerm, monthlyBudget } = req.body;

    const activePlans = await planModel.getAllPlans({ includeInactive: false });
    const recommendations = matchPlansForLead(
      { age, dateOfBirth, requestedCoverage, requestedPolicyTerm, monthlyBudget },
      activePlans
    );

    return res.status(200).json({
      status: 'success',
      results: recommendations.length,
      data: { recommendations },
    });
  } catch (error) {
    console.error('Error in plan recommendation:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error running plan recommendation engine.',
    });
  }
};

module.exports = {
  getPublicPlans,
  getPlans,
  getBenefits,
  getPlan,
  createPlan,
  updatePlan,
  togglePlanStatus,
  deletePlan,
  recommendPlans,
};
