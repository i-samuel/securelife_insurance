import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Shield, Mail, Calendar } from 'lucide-react';

const ProfileView = () => {
  const { user } = useAuth();

  return (
    <div style={{ maxWidth: 600 }}>
      <h4 className="fw-bold text-dark mb-1">User Profile</h4>
      <p className="text-secondary small mb-4">View your current authenticated staff account details and system authorization.</p>

      <div className="card border-0 shadow-sm rounded-4 p-4 mb-3">
        <div className="d-flex align-items-center gap-3 mb-4 pb-3 border-bottom">
          <div className="crm-avatar-pill" style={{ width: 56, height: 56, fontSize: '1.25rem' }}>
            {user?.firstName ? user.firstName[0] : 'U'}{user?.lastName ? user.lastName[0] : 'S'}
          </div>
          <div>
            <h5 className="fw-bold text-dark mb-0">{user?.firstName} {user?.lastName}</h5>
            <span className="badge bg-primary mt-1">{user?.role}</span>
          </div>
        </div>

        <div className="d-flex flex-column gap-3">
          <div className="d-flex align-items-center justify-content-between p-3 bg-light rounded-3">
            <div className="d-flex align-items-center gap-2 text-secondary">
              <Mail size={18} />
              <span className="small font-weight-medium">Email Address</span>
            </div>
            <strong className="text-dark small">{user?.email}</strong>
          </div>

          <div className="d-flex align-items-center justify-content-between p-3 bg-light rounded-3">
            <div className="d-flex align-items-center gap-2 text-secondary">
              <Shield size={18} />
              <span className="small font-weight-medium">Role Access Level</span>
            </div>
            <strong className="text-dark small">{user?.role === 'ADMIN' ? 'Full Administrator Access' : 'Advisor Lead Access'}</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
