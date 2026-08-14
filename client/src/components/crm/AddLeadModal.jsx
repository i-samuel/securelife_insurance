import React from 'react';

const AddLeadModal = ({
  show,
  onClose,
  onSubmit,
  formData,
  setFormData,
  advisors,
  plans,
}) => {
  if (!show) return null;

  return (
    <div className="modal fade show d-block crm-modal-backdrop">
      <div className="modal-dialog modal-lg">
        <div className="modal-content rounded-4 border-0 shadow-lg" style={{ maxHeight: '90vh', overflow: 'hidden' }}>
          <div className="modal-header border-bottom bg-light">
            <h5 className="modal-title fw-bold">Create New Lead Entry</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={onSubmit} className="d-flex flex-column" style={{ maxHeight: 'calc(90vh - 65px)' }}>
            <div className="modal-body p-4 crm-modal-scrollable-body">
              <div className="row g-2 mb-3">
                <div className="col-6">
                  <label className="form-label small fw-semibold">First Name *</label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  />
                </div>
                <div className="col-6">
                  <label className="form-label small fw-semibold">Last Name *</label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  />
                </div>
              </div>

              <div className="row g-2 mb-3">
                <div className="col-6">
                  <label className="form-label small fw-semibold">Email Address *</label>
                  <input
                    type="email"
                    className="form-control form-control-sm"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="col-6">
                  <label className="form-label small fw-semibold">Phone Number</label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="+1 555-0199"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="row g-2 mb-3">
                <div className="col-4">
                  <label className="form-label small fw-semibold">Date of Birth</label>
                  <input
                    type="date"
                    className="form-control form-control-sm"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  />
                </div>
                <div className="col-4">
                  <label className="form-label small fw-semibold">Gender</label>
                  <select
                    className="form-select form-select-sm"
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="col-4">
                  <label className="form-label small fw-semibold">Occupation</label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="e.g. Software Engineer"
                    value={formData.occupation}
                    onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                  />
                </div>
              </div>

              <div className="row g-2 mb-3">
                <div className="col-4">
                  <label className="form-label small fw-semibold">Requested Coverage ($)</label>
                  <input
                    type="number"
                    className="form-control form-control-sm"
                    value={formData.requestedCoverage}
                    onChange={(e) => setFormData({ ...formData, requestedCoverage: e.target.value })}
                  />
                </div>
                <div className="col-4">
                  <label className="form-label small fw-semibold">Policy Term (yrs)</label>
                  <input
                    type="number"
                    className="form-control form-control-sm"
                    value={formData.requestedPolicyTerm}
                    onChange={(e) => setFormData({ ...formData, requestedPolicyTerm: e.target.value })}
                  />
                </div>
                <div className="col-4">
                  <label className="form-label small fw-semibold">Monthly Budget ($)</label>
                  <input
                    type="number"
                    className="form-control form-control-sm"
                    placeholder="150"
                    value={formData.monthlyBudget}
                    onChange={(e) => setFormData({ ...formData, monthlyBudget: e.target.value })}
                  />
                </div>
              </div>

              <div className="row g-2 mb-3">
                <div className="col-6">
                  <label className="form-label small fw-semibold">Assign Advisor</label>
                  <select
                    className="form-select form-select-sm"
                    value={formData.assignedAdvisorId}
                    onChange={(e) => setFormData({ ...formData, assignedAdvisorId: e.target.value })}
                  >
                    <option value="">Unassigned</option>
                    {advisors.map((adv) => (
                      <option key={adv.id} value={adv.id}>
                        {adv.first_name} {adv.last_name} ({adv.role_name})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-6">
                  <label className="form-label small fw-semibold">Preferred Plan (Optional)</label>
                  <select
                    className="form-select form-select-sm"
                    value={formData.interestedPlanId}
                    onChange={(e) => setFormData({ ...formData, interestedPlanId: e.target.value })}
                  >
                    <option value="">None / System Recommendation</option>
                    {plans.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} (${p.min_premium} - ${p.max_premium}/mo)
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="modal-footer border-top bg-light p-3 mt-auto">
              <button type="button" className="btn btn-light btn-sm" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-primary btn-sm px-4 fw-bold">Create Lead</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddLeadModal;
