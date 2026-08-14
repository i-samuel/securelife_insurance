import React, { useState, useEffect, useCallback } from 'react';
import { apiFetch } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { Shield, Plus, CheckCircle, ToggleLeft, ToggleRight, Trash2, Edit } from 'lucide-react';

// Modular CRM Components
import AddPlanModal from '../../components/crm/AddPlanModal';
import EditPlanModal from '../../components/crm/EditPlanModal';

const InsurancePlansView = () => {
  const [plans, setPlans] = useState([]);
  const [masterBenefits, setMasterBenefits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  
  const initialPlanFormState = {
    name: '',
    slug: '',
    description: '',
    minAge: 18,
    maxAge: 65,
    minCoverage: 50000,
    maxCoverage: 500000,
    minPolicyTerm: 5,
    maxPolicyTerm: 30,
    minPremium: 50,
    maxPremium: 300,
    eligibilityDescription: '',
    benefitIds: [],
  };

  const [newPlanForm, setNewPlanForm] = useState(initialPlanFormState);
  const [editPlanForm, setEditPlanForm] = useState({ id: null, ...initialPlanFormState });

  const { isAdmin } = useAuth();

  const fetchPlansAndBenefits = useCallback(async () => {
    try {
      setLoading(true);
      const [planRes, benRes] = await Promise.all([
        apiFetch('/plans'),
        apiFetch('/plans/benefits'),
      ]);

      if (planRes.status === 'success') setPlans(planRes.data.plans || []);
      if (benRes.status === 'success') setMasterBenefits(benRes.data.benefits || []);
    } catch (err) {
      console.error('Error fetching plans & benefits:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlansAndBenefits();
  }, [fetchPlansAndBenefits]);

  const handleToggleActive = async (planId, currentStatus) => {
    try {
      await apiFetch(`/plans/${planId}/status`, {
        method: 'PATCH',
        body: { isActive: !currentStatus },
      });
      fetchPlansAndBenefits();
    } catch (err) {
      alert(err.message || 'Failed to toggle plan status');
    }
  };

  const handleDeletePlan = async (planId, planName) => {
    if (!window.confirm(`Are you sure you want to delete the insurance plan "${planName}"?`)) return;
    try {
      await apiFetch(`/plans/${planId}`, {
        method: 'DELETE',
      });
      fetchPlansAndBenefits();
    } catch (err) {
      alert(err.message || 'Failed to delete plan');
    }
  };

  const handleBenefitCheckboxToggle = (benefitId, isEdit = false) => {
    const targetId = Number(benefitId);
    if (isEdit) {
      const currentIds = (editPlanForm.benefitIds || []).map(Number);
      const updatedIds = currentIds.includes(targetId)
        ? currentIds.filter((id) => id !== targetId)
        : [...currentIds, targetId];
      setEditPlanForm({ ...editPlanForm, benefitIds: updatedIds });
    } else {
      const currentIds = (newPlanForm.benefitIds || []).map(Number);
      const updatedIds = currentIds.includes(targetId)
        ? currentIds.filter((id) => id !== targetId)
        : [...currentIds, targetId];
      setNewPlanForm({ ...newPlanForm, benefitIds: updatedIds });
    }
  };

  const handleCreatePlan = async (e) => {
    e.preventDefault();
    try {
      await apiFetch('/plans', {
        method: 'POST',
        body: newPlanForm,
      });
      setShowAddModal(false);
      setNewPlanForm(initialPlanFormState);
      fetchPlansAndBenefits();
    } catch (err) {
      alert(err.message || 'Failed to create plan');
    }
  };

  const openEditModal = (plan) => {
    const includedIds = (plan.benefits || [])
      .filter((b) => b.isIncluded === true || b.is_included === true)
      .map((b) => Number(b.id));

    setEditPlanForm({
      id: plan.id,
      name: plan.name,
      slug: plan.slug,
      description: plan.description || '',
      minAge: plan.min_age,
      maxAge: plan.max_age,
      minCoverage: Number(plan.min_coverage),
      maxCoverage: Number(plan.max_coverage),
      minPolicyTerm: plan.min_policy_term,
      maxPolicyTerm: plan.max_policy_term,
      minPremium: Number(plan.min_premium),
      maxPremium: Number(plan.max_premium),
      eligibilityDescription: plan.eligibility_description || '',
      benefitIds: includedIds,
    });
    setShowEditModal(true);
  };

  const handleUpdatePlan = async (e) => {
    e.preventDefault();
    try {
      await apiFetch(`/plans/${editPlanForm.id}`, {
        method: 'PUT',
        body: editPlanForm,
      });
      setShowEditModal(false);
      fetchPlansAndBenefits();
    } catch (err) {
      alert(err.message || 'Failed to update plan');
    }
  };

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h4 className="fw-bold text-dark mb-1">Insurance Plan Management</h4>
          <p className="text-secondary small mb-0">Configure life insurance policy tiers, age limits, coverage ranges, and premium terms.</p>
        </div>
        {isAdmin && (
          <button
            className="btn btn-primary btn-sm rounded-pill px-3 d-flex align-items-center gap-1"
            onClick={() => {
              setNewPlanForm(initialPlanFormState);
              setShowAddModal(true);
            }}
          >
            <Plus size={16} />
            <span>Create New Plan</span>
          </button>
        )}
      </div>

      <div className="row g-3">
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary"></div>
          </div>
        ) : (
          plans.map((plan) => {
            const includedBenefits = (plan.benefits || []).filter((b) => b.isIncluded === true || b.is_included === true);
            return (
              <div key={plan.id} className="col-12 col-md-6 col-lg-4">
                <div className={`card h-100 border-0 shadow-sm rounded-4 p-4 ${!plan.is_active ? 'opacity-75 bg-light' : 'bg-white'}`}>
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <div className="d-flex align-items-center gap-2">
                      <Shield className="text-primary" size={24} />
                      <h5 className="fw-bold mb-0 text-dark">{plan.name}</h5>
                    </div>
                    {isAdmin && (
                      <div className="d-flex align-items-center gap-2">
                        <button
                          className="btn btn-sm btn-light border text-secondary p-1"
                          onClick={() => openEditModal(plan)}
                          title="Edit Plan"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          className="btn btn-sm btn-light border text-danger p-1"
                          onClick={() => handleDeletePlan(plan.id, plan.name)}
                          title="Delete Plan"
                        >
                          <Trash2 size={14} />
                        </button>
                        <button
                          className="btn btn-link p-0 text-decoration-none ms-1"
                          onClick={() => handleToggleActive(plan.id, plan.is_active)}
                          title="Toggle active status"
                        >
                          {plan.is_active ? <ToggleRight size={28} className="text-success" /> : <ToggleLeft size={28} className="text-secondary" />}
                        </button>
                      </div>
                    )}
                  </div>

                  <p className="text-muted small mb-3">{plan.description}</p>

                  <div className="bg-light p-3 rounded-3 mb-3 small">
                    <div className="d-flex justify-content-between mb-1">
                      <span className="text-secondary">Age Eligibility:</span>
                      <strong className="text-dark">{plan.min_age} - {plan.max_age} yrs</strong>
                    </div>
                    <div className="d-flex justify-content-between mb-1">
                      <span className="text-secondary">Coverage Limits:</span>
                      <strong className="text-dark">${Number(plan.min_coverage).toLocaleString()} - ${Number(plan.max_coverage).toLocaleString()}</strong>
                    </div>
                    <div className="d-flex justify-content-between mb-1">
                      <span className="text-secondary">Policy Term:</span>
                      <strong className="text-dark">{plan.min_policy_term} - {plan.max_policy_term} yrs</strong>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span className="text-secondary">Est. Premium:</span>
                      <strong className="text-primary">${plan.min_premium} - ${plan.max_premium}/mo</strong>
                    </div>
                  </div>

                  {plan.eligibility_description && (
                    <div className="mb-3 small text-muted">
                      <strong>Eligibility:</strong> {plan.eligibility_description}
                    </div>
                  )}

                  <div className="border-top pt-3 mt-auto">
                    <div className="fw-semibold small text-secondary mb-2">Included Relational Benefits:</div>
                    <div className="d-flex flex-column gap-1">
                      {includedBenefits.length === 0 ? (
                        <span className="text-muted style-small">No benefits assigned</span>
                      ) : (
                        includedBenefits.map((ben) => (
                          <div key={ben.id} className="d-flex align-items-center gap-2 style-small">
                            <CheckCircle size={14} className="text-success flex-shrink-0" />
                            <span>{ben.name}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Plan Modal */}
      <AddPlanModal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleCreatePlan}
        formData={newPlanForm}
        setFormData={setNewPlanForm}
        masterBenefits={masterBenefits}
        onBenefitToggle={handleBenefitCheckboxToggle}
      />

      {/* Edit Plan Modal */}
      <EditPlanModal
        show={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSubmit={handleUpdatePlan}
        formData={editPlanForm}
        setFormData={setEditPlanForm}
        masterBenefits={masterBenefits}
        onBenefitToggle={handleBenefitCheckboxToggle}
      />
    </div>
  );
};

export default InsurancePlansView;
