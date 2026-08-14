const leadModel = require('../model/leadModel');

const createPublicLead = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      dateOfBirth,
      gender,
      occupation,
      requestedCoverage,
      requestedPolicyTerm,
      monthlyBudget,
      interestedPlanId,
      source = 'Website Quote Form',
    } = req.body;

    if (!firstName || !lastName || !email) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide first name, last name, and contact email.',
      });
    }

    const newLead = await leadModel.createLead({
      firstName,
      lastName,
      email,
      phone,
      dateOfBirth,
      gender,
      occupation,
      requestedCoverage,
      requestedPolicyTerm,
      monthlyBudget,
      interestedPlanId,
      status: 'NEW',
      source,
    });

    return res.status(201).json({
      status: 'success',
      message: 'Thank you! Your quote request has been submitted. A SecureLife advisor will reach out shortly.',
      data: {
        leadId: newLead.id,
        firstName: newLead.first_name,
        lastName: newLead.last_name,
        email: newLead.email,
        status: newLead.status,
      },
    });
  } catch (error) {
    console.error('Error submitting public lead:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error submitting your quote request.',
    });
  }
};

module.exports = {
  createPublicLead,
};
