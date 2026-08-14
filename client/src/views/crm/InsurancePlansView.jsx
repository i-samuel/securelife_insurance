import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { Shield, Plus, CheckCircle, ToggleLeft, ToggleRight, Trash2, Edit } from 'lucide-react';

const InsurancePlansView = () => {
  const [plans, setPlans] = useState([]);
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
    benefits: [],
  };

  const [newPlanForm, setNewPlanForm] = useState(initialPlanFormState);
  const [editPlanForm, setEditPlanForm] = useState({ id: null, ...initialPlanFormState });
  const [benefitInput, setBenefitInput] = useState('');

  const { isAdmin } = useAuth();

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const res = await apiFetch('/plans');
      if (res.status === 'success') {
        setPlans(res.data.plans || []);
      }
    } catch (err) {
      console.error('Error fetching plans:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleToggleActive = async (planId, currentStatus) => {
    try {
      await apiFetch(`/plans/${planId}/status`, {
        method: 'PATCH',
        body: { isActive: !currentStatus },
      });
      fetchPlans();
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
      fetchPlans();
    } catch (err) {
      alert(err.message || 'Failed to delete plan');
    }
  };

  const handleAddBenefit = (e, isEdit = false) => {
    e.preventDefault();
    if (!benefitInput.trim()) return;
    if (isEdit) {
      setEditPlanForm({
        ...editPlanForm,
        benefits: [...editPlanForm.benefits, benefitInput.trim()],
      });
    } else {
      setNewPlanForm({
        ...newPlanForm,
        benefits: [...newPlanForm.benefits, benefitInput.trim()],
      });
    }
    setBenefitInput('');
  };

  const handleRemoveBenefit = (indexToRemove, isEdit = false) => {
    if (isEdit) {
      setEditPlanForm({
        ...editPlanForm,
        benefits: editPlanForm.benefits.filter((_, idx) => idx !== indexToRemove),
      });
    } else {
      setNewPlanForm({
        ...newPlanForm,
        benefits: newPlanForm.benefits.filter((_, idx) => idx !== indexToRemove),
      });
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
      fetchPlans();
    } catch (err) {
      alert(err.message || 'Failed to create plan');
    }
  };

  const openEditModal = (plan) => {
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
      benefits: plan.benefits || [],
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
      fetchPlans();
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
          plans.map((plan) => (
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

                <div className="mt-auto">
                  <div className="fw-semibold small text-secondary mb-2">Included Benefits:</div>
                  <div className="d-flex flex-column gap-1">
                    {(plan.benefits || []).map((ben, idx) => (
                      <div key={idx} className="d-flex align-items-center gap-2 style-small">
                        <CheckCircle size={14} className="text-success flex-shrink-0" />
                        <span>{ben}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Plan Modal */}
      {showAddModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-scrollable">
            <div className="modal-content rounded-4 border-0">
              <div className="modal-header border-bottom">
                <h5 className="modal-title fw-bold">Create Insurance Plan</h5>
                <button type="button" className="btn-close" onClick={() => setShowAddModal(false)}></button>
              </div>
              <form onSubmit={handleCreatePlan}>
                <div className="modal-body p-4">
                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Plan Name *</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        required
                        placeholder="e.g. Diamond Life Cover"
                        value={newPlanForm.name}
                        onChange={(e) => setNewPlanForm({ ...newPlanForm, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Slug *</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        required
                        placeholder="e.g. diamond-life-cover"
                        value={newPlanForm.slug}
                        onChange={(e) => setNewPlanForm({ ...newPlanForm, slug: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Description</label>
                    <textarea
                      className="form-control form-control-sm"
                      rows="2"
                      placeholder="Brief policy overview..."
                      value={newPlanForm.description}
                      onChange={(e) => setNewPlanForm({ ...newPlanForm, description: e.target.value })}
                    ></textarea>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Eligibility Description</label>
                    <textarea
                      className="form-control form-control-sm"
                      rows="2"
                      placeholder="e.g. Available to non-smokers aged 18 to 65 with medical checkup."
                      value={newPlanForm.eligibilityDescription}
                      onChange={(e) => setNewPlanForm({ ...newPlanForm, eligibilityDescription: e.target.value })}
                    ></textarea>
                  </div>

                  <div className="row g-2 mb-3">
                    <div className="col-3">
                      <label className="form-label small fw-semibold">Min Age</label>
                      <input type="number" className="form-control form-control-sm" value={newPlanForm.minAge} onChange={(e) => setNewPlanForm({ ...newPlanForm, minAge: Number(e.target.value) })} />
                    </div>
                    <div className="col-3">
                      <label className="form-label small fw-semibold">Max Age</label>
                      <input type="number" className="form-control form-control-sm" value={newPlanForm.maxAge} onChange={(e) => setNewPlanForm({ ...newPlanForm, maxAge: Number(e.target.value) })} />
                    </div>
                    <div className="col-3">
                      <label className="form-label small fw-semibold">Min Coverage ($)</label>
                      <input type="number" className="form-control form-control-sm" value={newPlanForm.minCoverage} onChange={(e) => setNewPlanForm({ ...newPlanForm, minCoverage: Number(e.target.value) })} />
                    </div>
                    <div className="col-3">
                      <label className="form-label small fw-semibold">Max Coverage ($)</label>
                      <input type="number" className="form-control form-control-sm" value={newPlanForm.maxCoverage} onChange={(e) => setNewPlanForm({ ...newPlanForm, maxCoverage: Number(e.target.value) })} />
                    </div>
                  </div>

                  <div className="row g-2 mb-3">
                    <div className="col-3">
                      <label className="form-label small fw-semibold">Min Term (yrs)</label>
                      <input type="number" className="form-control form-control-sm" value={newPlanForm.minPolicyTerm} onChange={(e) => setNewPlanForm({ ...newPlanForm, minPolicyTerm: Number(e.target.value) })} />
                    </div>
                    <div className="col-3">
                      <label className="form-label small fw-semibold">Max Term (yrs)</label>
                      <input type="number" className="form-control form-control-sm" value={newPlanForm.maxPolicyTerm} onChange={(e) => setNewPlanForm({ ...newPlanForm, maxPolicyTerm: Number(e.target.value) })} />
                    </div>
                    <div className="col-3">
                      <label className="form-label small fw-semibold">Min Premium ($)</label>
                      <input type="number" className="form-control form-control-sm" value={newPlanForm.minPremium} onChange={(e) => setNewPlanForm({ ...newPlanForm, minPremium: Number(e.target.value) })} />
                    </div>
                    <div className="col-3">
                      <label className="form-label small fw-semibold">Max Premium ($)</label>
                      <input type="number" className="form-control form-control-sm" value={newPlanForm.maxPremium} onChange={(e) => setNewPlanForm({ ...newPlanForm, maxPremium: Number(e.target.value) })} />
                    </div>
                  </div>

                  {/* Dynamic Benefits Builder */}
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Policy Benefits</label>
                    <div className="input-group mb-2">
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="Add a benefit item (e.g. Critical Illness Rider)..."
                        value={benefitInput}
                        onChange={(e) => setBenefitInput(e.target.value)}
                      />
                      <button className="btn btn-outline-secondary btn-sm" onClick={(e) => handleAddBenefit(e, false)}>
                        Add Benefit
                      </button>
                    </div>

                    <div className="d-flex flex-wrap gap-2">
                      {newPlanForm.benefits.map((b, idx) => (
                        <span key={idx} className="badge bg-light text-dark border p-2 d-flex align-items-center gap-2 style-small">
                          <span>{b}</span>
                          <Trash2 size={14} className="text-danger cursor-pointer" onClick={() => handleRemoveBenefit(idx, false)} />
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="modal-footer border-top">
                  <button type="button" className="btn btn-light btn-sm" onClick={() => setShowAddModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary btn-sm px-4">Create Plan</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Plan Modal */}
      {showEditModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-scrollable">
            <div className="modal-content rounded-4 border-0">
              <div className="modal-header border-bottom">
                <h5 className="modal-title fw-bold">Edit Insurance Plan</h5>
                <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
              </div>
              <form onSubmit={handleUpdatePlan}>
                <div className="modal-body p-4">
                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Plan Name *</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        required
                        value={editPlanForm.name}
                        onChange={(e) => setEditPlanForm({ ...editPlanForm, name: e.target.value })}
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Slug *</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        required
                        value={editPlanForm.slug}
                        onChange={(e) => setEditPlanForm({ ...editPlanForm, slug: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Description</label>
                    <textarea
                      className="form-control form-control-sm"
                      rows="2"
                      value={editPlanForm.description}
                      onChange={(e) => setEditPlanForm({ ...editPlanForm, description: e.target.value })}
                    ></textarea>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Eligibility Description</label>
                    <textarea
                      className="form-control form-control-sm"
                      rows="2"
                      value={editPlanForm.eligibilityDescription}
                      onChange={(e) => setEditPlanForm({ ...editPlanForm, eligibilityDescription: e.target.value })}
                    ></textarea>
                  </div>

                  <div className="row g-2 mb-3">
                    <div className="col-3">
                      <label className="form-label small fw-semibold">Min Age</label>
                      <input type="number" className="form-control form-control-sm" value={editPlanForm.minAge} onChange={(e) => setEditPlanForm({ ...editPlanForm, minAge: Number(e.target.value) })} />
                    </div>
                    <div className="col-3">
                      <label className="form-label small fw-semibold">Max Age</label>
                      <input type="number" className="form-control form-control-sm" value={editPlanForm.maxAge} onChange={(e) => setEditPlanForm({ ...editPlanForm, maxAge: Number(e.target.value) })} />
                    </div>
                    <div className="col-3">
                      <label className="form-label small fw-semibold">Min Coverage ($)</label>
                      <input type="number" className="form-control form-control-sm" value={editPlanForm.minCoverage} onChange={(e) => setEditPlanForm({ ...editPlanForm, minCoverage: Number(e.target.value) })} />
                    </div>
                    <div className="col-3">
                      <label className="form-label small fw-semibold">Max Coverage ($)</label>
                      <input type="number" className="form-control form-control-sm" value={editPlanForm.maxCoverage} onChange={(e) => setEditPlanForm({ ...editPlanForm, maxCoverage: Number(e.target.value) })} />
                    </div>
                  </div>

                  <div className="row g-2 mb-3">
                    <div className="col-3">
                      <label className="form-label small fw-semibold">Min Term (yrs)</label>
                      <input type="number" className="form-control form-control-sm" value={editPlanForm.minPolicyTerm} onChange={(e) => setEditPlanForm({ ...editPlanForm, minPolicyTerm: Number(e.target.value) })} />
                    </div>
                    <div className="col-3">
                      <label className="form-label small fw-semibold">Max Term (yrs)</label>
                      <input type="number" className="form-control form-control-sm" value={editPlanForm.maxPolicyTerm} onChange={(e) => setEditPlanForm({ ...editPlanForm, maxPolicyTerm: Number(e.target.value) })} />
                    </div>
                    <div className="col-3">
                      <label className="form-label small fw-semibold">Min Premium ($)</label>
                      <input type="number" className="form-control form-control-sm" value={editPlanForm.minPremium} onChange={(e) => setEditPlanForm({ ...editPlanForm, minPremium: Number(e.target.value) })} />
                    </div>
                    <div className="col-3">
                      <label className="form-label small fw-semibold">Max Premium ($)</label>
                      <input type="number" className="form-control form-control-sm" value={editPlanForm.maxPremium} onChange={(e) => setEditPlanForm({ ...editPlanForm, maxPremium: Number(e.target.value) })} />
                    </div>
                  </div>

                  {/* Dynamic Benefits Builder */}
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Policy Benefits</label>
                    <div className="input-group mb-2">
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="Add a benefit item..."
                        value={benefitInput}
                        onChange={(e) => setBenefitInput(e.target.value)}
                      />
                      <button className="btn btn-outline-secondary btn-sm" onClick={(e) => handleAddBenefit(e, true)}>
                        Add Benefit
                      </button>
                    </div>

                    <div className="d-flex flex-wrap gap-2">
                      {editPlanForm.benefits.map((b, idx) => (
                        <span key={idx} className="badge bg-light text-dark border p-2 d-flex align-items-center gap-2 style-small">
                          <span>{b}</span>
                          <Trash2 size={14} className="text-danger cursor-pointer" onClick={() => handleRemoveBenefit(idx, true)} />
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="modal-footer border-top">
                  <button type="button" className="btn btn-light btn-sm" onClick={() => setShowEditModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary btn-sm px-4">Save Plan Changes</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InsurancePlansView;
