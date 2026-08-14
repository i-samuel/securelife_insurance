import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Shield } from 'lucide-react';

const PublicLayout = ({ children }) => {
  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <header className="bg-white border-bottom sticky-top py-3">
        <div className="container d-flex align-items-center justify-content-between">
          <Link to="/" className="d-flex align-items-center gap-2 text-decoration-none text-dark fw-bold fs-5">
            <div className="bg-primary text-white rounded p-1 d-flex align-items-center justify-content-center" style={{ width: 32, height: 32 }}>
              <Shield size={20} />
            </div>
            <span>SecureLife Insurance</span>
          </Link>

          <nav className="d-flex align-items-center gap-4">
            <NavLink to="/" className={({ isActive }) => `text-decoration-none fw-medium ${isActive ? 'text-primary' : 'text-secondary'}`}>
              Home
            </NavLink>
            <NavLink to="/plans" className={({ isActive }) => `text-decoration-none fw-medium ${isActive ? 'text-primary' : 'text-secondary'}`}>
              Insurance Plans
            </NavLink>
            <Link to="/#quote-form" className="btn btn-outline-primary btn-sm rounded-pill px-3">
              Get a Free Quote
            </Link>
            <Link to="/crm/login" className="btn btn-primary btn-sm rounded-pill px-3">
              Staff CRM Login
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-grow-1">{children}</main>

      <footer className="bg-dark text-light py-4 mt-auto">
        <div className="container text-center text-md-between d-md-flex align-items-center justify-content-between small text-secondary">
          <div>© 2026 SecureLife Insurance PLC. All rights reserved.</div>
          <div className="mt-2 mt-md-0">
            <span>Privacy Policy</span> · <span>Terms of Service</span> · <span>Contact Advisor</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
