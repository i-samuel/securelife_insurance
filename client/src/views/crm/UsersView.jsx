import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { Plus, Mail, Edit, Trash2, Eye, EyeOff } from 'lucide-react';

const UsersView = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { user: currentUser } = useAuth();

  const initialUserFormState = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    roleId: 2, // Default ADVISOR
  };

  const [newUserForm, setNewUserForm] = useState(initialUserFormState);
  const [editUserForm, setEditUserForm] = useState({
    id: null,
    firstName: '',
    lastName: '',
    email: '',
    roleId: 2,
    isActive: true,
    password: '',
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const [userRes, roleRes] = await Promise.all([
        apiFetch('/users'),
        apiFetch('/users/roles'),
      ]);

      if (userRes.status === 'success') setUsers(userRes.data.users || []);
      if (roleRes.status === 'success') setRoles(roleRes.data.roles || []);
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await apiFetch('/users', {
        method: 'POST',
        body: newUserForm,
      });
      setShowAddModal(false);
      setNewUserForm(initialUserFormState);
      fetchUsers();
    } catch (err) {
      alert(err.message || 'Failed to create user');
    }
  };

  const openEditUserModal = (userToEdit) => {
    setEditUserForm({
      id: userToEdit.id,
      firstName: userToEdit.first_name,
      lastName: userToEdit.last_name,
      email: userToEdit.email,
      roleId: userToEdit.role_id,
      isActive: userToEdit.is_active,
      password: '',
    });
    setShowEditModal(true);
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      await apiFetch(`/users/${editUserForm.id}`, {
        method: 'PUT',
        body: editUserForm,
      });
      setShowEditModal(false);
      fetchUsers();
    } catch (err) {
      alert(err.message || 'Failed to update user');
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (currentUser && Number(userId) === Number(currentUser.id)) {
      alert('You cannot delete your own active administrator account.');
      return;
    }
    if (!window.confirm(`Are you sure you want to delete user account for "${userName}"? Assigned leads will be set to unassigned.`)) {
      return;
    }
    try {
      await apiFetch(`/users/${userId}`, {
        method: 'DELETE',
      });
      fetchUsers();
    } catch (err) {
      alert(err.message || 'Failed to delete user');
    }
  };

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h4 className="fw-bold text-dark mb-1">User & Advisor Management</h4>
          <p className="text-secondary small mb-0">Manage system users, edit advisor details, register accounts, and monitor assigned lead workloads.</p>
        </div>
        <button
          className="btn btn-primary btn-sm rounded-pill px-3 d-flex align-items-center gap-1"
          onClick={() => {
            setNewUserForm(initialUserFormState);
            setShowAddModal(true);
          }}
        >
          <Plus size={16} />
          <span>Register New Advisor</span>
        </button>
      </div>

      <div className="card border-0 shadow-sm rounded-3">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light text-secondary small">
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Assigned Leads</th>
                <th>Status</th>
                <th>Joined</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-muted">Loading users...</td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className={!u.is_active ? 'bg-light opacity-75' : ''}>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <div className="crm-avatar-pill" style={{ width: 32, height: 32, fontSize: '0.75rem' }}>
                          {u.first_name[0]}{u.last_name[0]}
                        </div>
                        <div className="fw-semibold text-dark">
                          {u.first_name} {u.last_name}
                          {currentUser && Number(u.id) === Number(currentUser.id) && (
                            <span className="badge bg-primary-subtle text-primary ms-2 style-small">You</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center gap-1 text-secondary small">
                        <Mail size={14} />
                        <span>{u.email}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${u.role_name === 'ADMIN' ? 'bg-primary' : 'bg-info text-dark'}`}>
                        {u.role_name}
                      </span>
                    </td>
                    <td>
                      <span className="fw-bold text-dark">{u.assigned_leads_count || 0}</span> leads
                    </td>
                    <td>
                      <span className={`badge ${u.is_active ? 'bg-success-subtle text-success border border-success-subtle' : 'bg-secondary-subtle text-secondary border border-secondary'}`}>
                        {u.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="text-secondary small">
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
                    <td className="text-end">
                      <div className="d-flex justify-content-end gap-1">
                        <button
                          className="btn btn-sm btn-outline-secondary rounded-pill px-2 py-1 style-small"
                          onClick={() => openEditUserModal(u)}
                          title="Edit User"
                        >
                          <Edit size={14} className="me-1" /> Edit
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger rounded-pill px-2 py-1 style-small"
                          disabled={currentUser && Number(u.id) === Number(currentUser.id)}
                          onClick={() => handleDeleteUser(u.id, `${u.first_name} ${u.last_name}`)}
                          title={currentUser && Number(u.id) === Number(currentUser.id) ? "Cannot delete own account" : "Delete User"}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-md">
            <div className="modal-content rounded-4 border-0">
              <div className="modal-header border-bottom">
                <h5 className="modal-title fw-bold">Register Staff / Advisor Account</h5>
                <button type="button" className="btn-close" onClick={() => setShowAddModal(false)}></button>
              </div>
              <form onSubmit={handleCreateUser}>
                <div className="modal-body p-4">
                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <label className="form-label small fw-semibold">First Name *</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        required
                        value={newUserForm.firstName}
                        onChange={(e) => setNewUserForm({ ...newUserForm, firstName: e.target.value })}
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Last Name *</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        required
                        value={newUserForm.lastName}
                        onChange={(e) => setNewUserForm({ ...newUserForm, lastName: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Email Address *</label>
                    <input
                      type="email"
                      className="form-control form-control-sm"
                      required
                      value={newUserForm.email}
                      onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Initial Password *</label>
                    <div className="input-group input-group-sm">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className="form-control"
                        required
                        minLength="6"
                        value={newUserForm.password}
                        onChange={(e) => setNewUserForm({ ...newUserForm, password: e.target.value })}
                      />
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">System Role *</label>
                    <select
                      className="form-select form-select-sm"
                      value={newUserForm.roleId}
                      onChange={(e) => setNewUserForm({ ...newUserForm, roleId: Number(e.target.value) })}
                    >
                      {roles.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.name} — {r.description}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="modal-footer border-top">
                  <button type="button" className="btn btn-light btn-sm" onClick={() => setShowAddModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary btn-sm px-4">Register User</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-md">
            <div className="modal-content rounded-4 border-0">
              <div className="modal-header border-bottom">
                <h5 className="modal-title fw-bold">Edit User Account</h5>
                <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
              </div>
              <form onSubmit={handleUpdateUser}>
                <div className="modal-body p-4">
                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <label className="form-label small fw-semibold">First Name *</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        required
                        value={editUserForm.firstName}
                        onChange={(e) => setEditUserForm({ ...editUserForm, firstName: e.target.value })}
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Last Name *</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        required
                        value={editUserForm.lastName}
                        onChange={(e) => setEditUserForm({ ...editUserForm, lastName: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Email Address *</label>
                    <input
                      type="email"
                      className="form-control form-control-sm"
                      required
                      value={editUserForm.email}
                      onChange={(e) => setEditUserForm({ ...editUserForm, email: e.target.value })}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Reset Password (Optional)</label>
                    <div className="input-group input-group-sm">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className="form-control"
                        placeholder="Leave blank to keep existing password"
                        value={editUserForm.password}
                        onChange={(e) => setEditUserForm({ ...editUserForm, password: e.target.value })}
                      />
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  </div>

                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Role *</label>
                      <select
                        className="form-select form-select-sm"
                        value={editUserForm.roleId}
                        onChange={(e) => setEditUserForm({ ...editUserForm, roleId: Number(e.target.value) })}
                      >
                        {roles.map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Account Status *</label>
                      <select
                        className="form-select form-select-sm"
                        value={editUserForm.isActive}
                        disabled={currentUser && Number(editUserForm.id) === Number(currentUser.id)}
                        onChange={(e) => setEditUserForm({ ...editUserForm, isActive: e.target.value === 'true' })}
                      >
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                      </select>
                      {currentUser && Number(editUserForm.id) === Number(currentUser.id) && (
                        <div className="style-small text-muted mt-1" style={{ fontSize: '0.72rem' }}>
                          (Cannot deactivate own active account)
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="modal-footer border-top">
                  <button type="button" className="btn btn-light btn-sm" onClick={() => setShowEditModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary btn-sm px-4">Save Changes</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersView;
