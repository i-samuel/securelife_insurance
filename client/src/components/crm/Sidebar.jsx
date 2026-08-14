import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, Users, Shield, FileText, User, LogOut } from 'lucide-react';

const Sidebar = () => {
  const { user, logout, isAdmin } = useAuth();

  return (
    <aside className="crm-sidebar">
      <div>
        <div className="crm-brand">
          <div className="crm-brand-icon">S</div>
          <div>
            <div className="fw-bold text-white fs-6">SecureLife</div>
            <div className="text-secondary style-small" style={{ fontSize: '0.72rem' }}>
              Insurance CRM
            </div>
          </div>
        </div>

        <div className="crm-nav-section">Workspace</div>

        <NavLink to="/crm/dashboard" className={({ isActive }) => `crm-nav-link ${isActive ? 'active' : ''}`}>
          <LayoutDashboard size={18} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/crm/leads" className={({ isActive }) => `crm-nav-link ${isActive ? 'active' : ''}`}>
          <Users size={18} />
          <span>Leads</span>
        </NavLink>

        <NavLink to="/crm/plans" className={({ isActive }) => `crm-nav-link ${isActive ? 'active' : ''}`}>
          <Shield size={18} />
          <span>Insurance Plans</span>
        </NavLink>

        {isAdmin && (
          <NavLink to="/crm/users" className={({ isActive }) => `crm-nav-link ${isActive ? 'active' : ''}`}>
            <FileText size={18} />
            <span>Users & Advisors</span>
          </NavLink>
        )}

        <NavLink to="/crm/profile" className={({ isActive }) => `crm-nav-link ${isActive ? 'active' : ''}`}>
          <User size={18} />
          <span>Profile</span>
        </NavLink>
      </div>

      <div className="crm-user-footer">
        <div className="d-flex align-items-center justify-content-between">
          <div>
            <div className="fw-bold text-white small">Signed in as {user?.role || 'Staff'}</div>
            <div className="text-secondary" style={{ fontSize: '0.72rem' }}>
              {user?.email}
            </div>
          </div>
          <button
            onClick={logout}
            className="btn btn-sm btn-outline-light border-0 text-secondary p-1"
            title="Log out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
