import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Bell } from 'lucide-react';

const Topbar = () => {
  const { user } = useAuth();

  const getInitials = () => {
    if (!user) return 'SK';
    const first = user.firstName ? user.firstName.charAt(0) : '';
    const last = user.lastName ? user.lastName.charAt(0) : '';
    return `${first}${last}`.toUpperCase() || 'SK';
  };

  return (
    <header className="crm-topbar">
      <div className="fw-semibold text-secondary small">
        SecureLife Insurance CRM Portal
      </div>

      <div className="d-flex align-items-center gap-3">
        <div className="position-relative cursor-pointer text-secondary">
          <Bell size={20} />
        </div>

        <div className="d-flex align-items-center gap-2">
          <div className="crm-avatar-pill">{getInitials()}</div>
          <div className="d-none d-md-block text-end">
            <div className="fw-semibold small text-dark">
              {user ? `${user.firstName} ${user.lastName}` : 'Admin User'}
            </div>
            <div className="text-muted" style={{ fontSize: '0.72rem' }}>
              {user?.role || 'Admin'}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
