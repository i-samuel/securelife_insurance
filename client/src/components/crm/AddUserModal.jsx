import React from 'react';

const AddUserModal = ({
  show,
  onClose,
  onSubmit,
  formData,
  setFormData,
  roles,
}) => {
  if (!show) return null;

  return (
    <div className="modal fade show d-block crm-modal-backdrop">
      <div className="modal-dialog">
        <div className="modal-content rounded-4 border-0 shadow-lg">
          <div className="modal-header border-bottom bg-light">
            <h5 className="modal-title fw-bold">Register Staff Account</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={onSubmit}>
            <div className="modal-body p-4">
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

              <div className="mb-3">
                <label className="form-label small fw-semibold">Email Address *</label>
                <input
                  type="email"
                  className="form-control form-control-sm"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold">Password *</label>
                <input
                  type="password"
                  className="form-control form-control-sm"
                  required
                  placeholder="Min 6 characters"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold">Role *</label>
                <select
                  className="form-select form-select-sm"
                  value={formData.roleId}
                  onChange={(e) => setFormData({ ...formData, roleId: e.target.value })}
                >
                  {roles.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} ({r.description})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="modal-footer border-top bg-light p-3">
              <button type="button" className="btn btn-light btn-sm" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-primary btn-sm px-4 fw-bold">Register Account</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddUserModal;
