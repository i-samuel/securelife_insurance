import React from 'react';

const AddPlanModal = ({
  show,
  onClose,
  onSubmit,
  formData,
  setFormData,
  masterBenefits,
  onBenefitToggle,
}) => {
  if (!show) return null;

  return (
    <div className="modal fade show d-block crm-modal-backdrop">
      <div className="modal-dialog modal-lg">
        <div className="modal-content rounded-4 border-0 shadow-lg" style={{ maxHeight: '90vh', overflow: 'hidden' }}>
          <div className="modal-header border-bottom bg-light">
            <h5 className="modal-title fw-bold">Create Insurance Plan</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={onSubmit} className="d-flex flex-column" style={{ maxHeight: 'calc(90vh - 65px)' }}>
            <div className="modal-body p-4 crm-modal-scrollable-body">
              <div className="row g-2 mb-3">
                <div className="col-6">
                  <label className="form-label small fw-semibold">Plan Name *</label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    required
                    placeholder="e.g. Diamond Life Cover"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                  />
                </div>
                <div className="col-6">
                  <label className="form-label small fw-semibold">Slug *</label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    required
                    placeholder="e.g. diamond-life-cover"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold">Description</label>
                <textarea
                  className="form-control form-control-sm"
                  rows="2"
                  placeholder="Brief policy overview..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                ></textarea>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold">Eligibility Description</label>
                <textarea
                  className="form-control form-control-sm"
                  rows="2"
                  placeholder="e.g. Available to non-smokers aged 18 to 65 with medical checkup."
                  value={formData.eligibilityDescription}
                  onChange={(e) => setFormData({ ...formData, eligibilityDescription: e.target.value })}
                ></textarea>
              </div>

              <div className="row g-2 mb-3">
                <div className="col-3">
                  <label className="form-label small fw-semibold">Min Age</label>
                  <input type="number" className="form-control form-control-sm" value={formData.minAge} onChange={(e) => setFormData({ ...formData, minAge: Number(e.target.value) })} />
                </div>
                <div className="col-3">
                  <label className="form-label small fw-semibold">Max Age</label>
                  <input type="number" className="form-control form-control-sm" value={formData.maxAge} onChange={(e) => setFormData({ ...formData, maxAge: Number(e.target.value) })} />
                </div>
                <div className="col-3">
                  <label className="form-label small fw-semibold">Min Coverage ($)</label>
                  <input type="number" className="form-control form-control-sm" value={formData.minCoverage} onChange={(e) => setFormData({ ...formData, minCoverage: Number(e.target.value) })} />
                </div>
                <div className="col-3">
                  <label className="form-label small fw-semibold">Max Coverage ($)</label>
                  <input type="number" className="form-control form-control-sm" value={formData.maxCoverage} onChange={(e) => setFormData({ ...formData, maxCoverage: Number(e.target.value) })} />
                </div>
              </div>

              <div className="row g-2 mb-3">
                <div className="col-3">
                  <label className="form-label small fw-semibold">Min Term (yrs)</label>
                  <input type="number" className="form-control form-control-sm" value={formData.minPolicyTerm} onChange={(e) => setFormData({ ...formData, minPolicyTerm: Number(e.target.value) })} />
                </div>
                <div className="col-3">
                  <label className="form-label small fw-semibold">Max Term (yrs)</label>
                  <input type="number" className="form-control form-control-sm" value={formData.maxPolicyTerm} onChange={(e) => setFormData({ ...formData, maxPolicyTerm: Number(e.target.value) })} />
                </div>
                <div className="col-3">
                  <label className="form-label small fw-semibold">Min Premium ($)</label>
                  <input type="number" className="form-control form-control-sm" value={formData.minPremium} onChange={(e) => setFormData({ ...formData, minPremium: Number(e.target.value) })} />
                </div>
                <div className="col-3">
                  <label className="form-label small fw-semibold">Max Premium ($)</label>
                  <input type="number" className="form-control form-control-sm" value={formData.maxPremium} onChange={(e) => setFormData({ ...formData, maxPremium: Number(e.target.value) })} />
                </div>
              </div>

              {/* Relational Master Benefits Checkbox Selection */}
              <div className="mb-3">
                <label className="form-label small fw-semibold">Select Included Policy Benefits</label>
                <div className="bg-light p-3 rounded-3 border">
                  {masterBenefits.map((ben) => {
                    const isChecked = (formData.benefitIds || []).map(Number).includes(Number(ben.id));
                    return (
                      <div key={ben.id} className="form-check mb-2 style-small">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id={`add-ben-${ben.id}`}
                          checked={isChecked}
                          onChange={() => onBenefitToggle(ben.id, false)}
                        />
                        <label className="form-check-label text-dark fw-medium" htmlFor={`add-ben-${ben.id}`}>
                          {ben.name}
                        </label>
                        <div className="text-muted style-tiny-text">{ben.description}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="modal-footer border-top bg-light p-3 mt-auto">
              <button type="button" className="btn btn-light btn-sm" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-primary btn-sm px-4 fw-bold">Create Insurance Plan</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddPlanModal;
