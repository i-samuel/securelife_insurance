const leadModel = require('../model/leadModel');
const planModel = require('../model/planModel');
const { matchPlansForLead } = require('../utils/recommendationEngine');

const getLeads = async (req, res) => {
  try {
    const { status, advisorId, search, limit, offset } = req.query;

    // If logged in user is an ADVISOR and not ADMIN, show their assigned leads by default if no advisor filter specified
    let targetAdvisorId = advisorId;
    if (req.user.role === 'ADVISOR' && !advisorId) {
      targetAdvisorId = req.user.id;
    }

    const leads = await leadModel.getAllLeads({
      status,
      advisorId: targetAdvisorId,
      search,
      limit: limit ? parseInt(limit, 10) : 50,
      offset: offset ? parseInt(offset, 10) : 0,
    });

    return res.status(200).json({
      status: 'success',
      results: leads.length,
      data: { leads },
    });
  } catch (error) {
    console.error('Error fetching leads:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error fetching CRM leads.',
    });
  }
};

const getLead = async (req, res) => {
  try {
    const { id } = req.params;
    const lead = await leadModel.getLeadById(id);

    if (!lead) {
      return res.status(404).json({
        status: 'fail',
        message: 'Lead not found.',
      });
    }

    // Fetch notes & activity history concurrently
    const [notes, activities, activePlans] = await Promise.all([
      leadModel.getLeadNotes(id),
      leadModel.getLeadActivities(id),
      planModel.getAllPlans({ includeInactive: false }),
    ]);

    // Calculate smart plan recommendations for this lead
    const recommendations = matchPlansForLead(
      {
        dateOfBirth: lead.date_of_birth,
        requestedCoverage: lead.requested_coverage,
        requestedPolicyTerm: lead.requested_policy_term,
        monthlyBudget: lead.monthly_budget,
      },
      activePlans
    );

    return res.status(200).json({
      status: 'success',
      data: {
        lead,
        notes,
        activities,
        recommendations,
      },
    });
  } catch (error) {
    console.error('Error fetching lead details:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error fetching lead details.',
    });
  }
};

const createLead = async (req, res) => {
  try {
    const { firstName, lastName, email } = req.body;

    if (!firstName || !lastName || !email) {
      return res.status(400).json({
        status: 'fail',
        message: 'First name, last name, and email are required.',
      });
    }

    const newLead = await leadModel.createLead(req.body, req.user.id);

    return res.status(201).json({
      status: 'success',
      message: 'Lead created successfully.',
      data: { lead: newLead },
    });
  } catch (error) {
    console.error('Error creating CRM lead:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error creating lead.',
    });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['NEW', 'CONTACTED', 'QUALIFIED', 'PLAN_RECOMMENDED', 'PROPOSAL', 'CONVERTED', 'LOST'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        status: 'fail',
        message: `Invalid lead status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const lead = await leadModel.getLeadById(id);
    if (!lead) {
      return res.status(404).json({
        status: 'fail',
        message: 'Lead not found.',
      });
    }

    const updatedLead = await leadModel.updateLeadStatus(id, status, req.user.id);

    return res.status(200).json({
      status: 'success',
      message: `Lead status updated to ${status}.`,
      data: { lead: updatedLead },
    });
  } catch (error) {
    console.error('Error updating lead status:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error updating status.',
    });
  }
};

const assignLeadAdvisor = async (req, res) => {
  try {
    const { id } = req.params;
    const { advisorId } = req.body;

    const lead = await leadModel.getLeadById(id);
    if (!lead) {
      return res.status(404).json({
        status: 'fail',
        message: 'Lead not found.',
      });
    }

    const updatedLead = await leadModel.assignAdvisor(id, advisorId || null, req.user.id);

    return res.status(200).json({
      status: 'success',
      message: 'Advisor assignment updated.',
      data: { lead: updatedLead },
    });
  } catch (error) {
    console.error('Error assigning advisor:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error updating advisor assignment.',
    });
  }
};

const addNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({
        status: 'fail',
        message: 'Note content cannot be empty.',
      });
    }

    const lead = await leadModel.getLeadById(id);
    if (!lead) {
      return res.status(404).json({
        status: 'fail',
        message: 'Lead not found.',
      });
    }

    const newNote = await leadModel.addLeadNote(id, req.user.id, content);

    return res.status(201).json({
      status: 'success',
      message: 'Note added to lead timeline.',
      data: { note: newNote },
    });
  } catch (error) {
    console.error('Error adding lead note:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error adding note.',
    });
  }
};

module.exports = {
  getLeads,
  getLead,
  createLead,
  updateStatus,
  assignLeadAdvisor,
  addNote,
};
