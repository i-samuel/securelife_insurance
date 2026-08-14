import React, { useState, useEffect, useCallback } from 'react';
import { apiFetch } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { UserPlus, ToggleLeft, ToggleRight, Trash2, Edit } from 'lucide-react';

// Modular CRM Components
import AddUserModal from '../../components/crm/AddUserModal';
import EditUserModal from '../../components/crm/EditUserModal';

const UsersView = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const initialUserFormState = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    roleId: '2',
  };

  const [newUserForm, setNewUserForm] = useState(initialUserFormState);
  const [editUserForm, setEditUserForm] = useState({
    id: null,
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    roleId: '2',
    isActive: true,
  });

  const { user: currentUser } = useAuth();

  const fetchUsersAndRoles = useCallback(async () => {
    try {
      setLoading(true);
      const [userRes, roleRes] = await Promise.all([
        apiFetch('/users'),
        apiFetch('/users/roles'),
      ]);

      if (userRes.status === 'success') setUsers(userRes.data.users || []);
      if (roleRes.status === 'success') setRoles(roleRes.data.roles || []);
    } catch (err) {
      console.error('Error loading user accounts:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsersAndRoles();
  }, [fetchUsersAndRoles]);

  const handleToggleActive = async (targetUser) => {
    if (targetUser.id === currentUser.id) {
      alert('You cannot deactivate your own active logged-in account.');
      return;
    }

    try {
      await apiFetch(`/users/${targetUser.id}/status`, {
        method: 'PATCH',
        body: { isActive: !targetUser.is_active },
      });
      fetchUsersAndRoles();
    } catch (err) {
      alert(err.message || 'Failed to update user status');
    }
  };

  const handleDeleteUser = async (targetUser) => {
    if (targetUser.id === currentUser.id) {
      alert('You cannot delete your own active logged-in account.');
      return;
    }

    if (!window.confirm(`Are you sure you want to delete user account "${targetUser.email}"?`)) return;

    try {
      await apiFetch(`/users/${targetUser.id}`, {
        method: 'DELETE',
      });
      fetchUsersAndRoles();
    } catch (err) {
      alert(err.message || 'Failed to delete user');
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await apiFetch('/users', {
        method: 'POST',
        body: newUserForm,
      });
      setShowAddModal(false);
      setNewUserForm(initialUserFormState);
      fetchUsersAndRoles();
    } catch (err) {
      alert(err.message || 'Failed to register account');
    }
  };

  const openEditModal = (targetUser) => {
    setEditUserForm({
      id: targetUser.id,
      firstName: targetUser.first_name,
      lastName: targetUser.last_name,
      email: targetUser.email,
      password: '',
      roleId: String(targetUser.role_id),
      isActive: targetUser.is_active,
    });
    setShowEditModal(true);
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();

    if (Number(editUserForm.id) === Number(currentUser.id) && editUserForm.isActive === false) {
      alert('You cannot deactivate your own active logged-in account.');
      return;
    }

    try {
      await apiFetch(`/users/${editUserForm.id}`, {
        method: 'PUT',
        body: editUserForm,
      });
      setShowEditModal(false);
      fetchUsersAndRoles();
    } catch (err) {
      alert(err.message || 'Failed to update user');
    }
  };

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h4 className="fw-bold text-dark mb-1">Staff & Advisor Administration</h4>
          <p className="text-secondary small mb-0">Manage system access, assign roles (Admin / Advisor), and register new staff members.</p>
        </div>
        <button
          className="btn btn-primary btn-sm rounded-pill px-3 d-flex align-items-center gap-1"
          onClick={() => {
            setNewUserForm(initialUserFormState);
            setShowAddModal(true);
          }}
        >
          <UserPlus size={16} />
          <span>Register New Staff</span>
        </button>
      </div>

      {/* Users Table */}
      <div className="card border-0 shadow-sm rounded-3">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light text-secondary small">
              <tr>
                <th>User ID</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Workload (Assigned Leads)</th>
                <th>Status</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-muted">Loading staff directory...</td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-muted">No staff accounts found.</td>
                </tr>
              ) : (
                users.map((u) => {
                  const isSelf = u.id === currentUser.id;
                  return (
                    <tr key={u.id}>
                      <td className="fw-semibold text-secondary">#{u.id}</td>
                      <td className="fw-bold text-dark">
                        {u.first_name} {u.last_name} {isSelf && <span className="badge bg-primary-subtle text-primary ms-1">You</span>}
                      </td>
                      <td className="text-secondary">{u.email}</td>
                      <td>
                        <span className={`badge ${u.role_name === 'ADMIN' ? 'bg-purple-subtle text-purple border' : 'bg-info-subtle text-info border'}`}>
                          {u.role_name}
                        </span>
                      </td>
                      <td>
                        <span className="badge bg-light text-dark border">
                          {u.assigned_leads_count || 0} Leads ({u.converted_leads_count || 0} Won)
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${u.is_active ? 'bg-success-subtle text-success border' : 'bg-danger-subtle text-danger border'}`}>
                          {u.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="text-end">
                        <div className="d-inline-flex align-items-center gap-1">
                          <button
                            className="btn btn-sm btn-light border text-secondary p-1"
                            onClick={() => openEditModal(u)}
                            title="Edit User"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            className="btn btn-sm btn-light border text-danger p-1"
                            disabled={isSelf}
                            onClick={() => handleDeleteUser(u)}
                            title={isSelf ? 'Cannot delete yourself' : 'Delete User'}
                          >
                            <Trash2 size={14} />
                          </button>
                          <button
                            className="btn btn-link p-0 text-decoration-none ms-1"
                            disabled={isSelf}
                            onClick={() => handleToggleActive(u)}
                            title={isSelf ? 'Cannot deactivate yourself' : 'Toggle active status'}
                          >
                            {u.is_active ? <ToggleRight size={26} className={isSelf ? 'text-muted' : 'text-success'} /> : <ToggleLeft size={26} className="text-secondary" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      <AddUserModal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleCreateUser}
        formData={newUserForm}
        setFormData={setNewUserForm}
        roles={roles}
      />

      {/* Edit User Modal */}
      <EditUserModal
        show={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSubmit={handleUpdateUser}
        formData={editUserForm}
        setFormData={setEditUserForm}
        roles={roles}
        currentUserId={currentUser?.id}
      />
    </div>
  );
};

export default UsersView;
