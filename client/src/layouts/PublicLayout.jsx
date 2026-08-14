import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Shield, Phone, Mail, MapPin } from 'lucide-react';

const PublicLayout = ({ children }) => {
  return (
    <div className="d-flex flex-column min-vh-100 bg-page-light">
      {/* Top Header Navbar */}
      <header className="bg-white border-bottom sticky-top py-3 shadow-sm" style={{ zIndex: 1020 }}>
        <div className="container d-flex align-items-center justify-content-between">
          <Link to="/" className="d-flex align-items-center gap-2 text-decoration-none">
            <div className="bg-navy-dark text-white rounded-3 p-2 d-flex align-items-center justify-content-center" style={{ width: 34, height: 34 }}>
              <Shield size={20} />
            </div>
            <div className="d-flex flex-column leading-tight">
              <span className="fw-bold fs-5 text-dark" style={{ letterSpacing: '-0.02em', lineHeight: 1.1 }}>SecureLife</span>
              <span className="text-secondary style-small text-uppercase tracking-widest" style={{ fontSize: '0.62rem', letterSpacing: '0.12em' }}>INSURANCE</span>
            </div>
          </Link>

          <nav className="d-none d-md-flex align-items-center gap-4">
            <NavLink to="/plans" className={({ isActive }) => `text-decoration-none fw-medium small ${isActive ? 'text-primary' : 'text-secondary'}`}>
              Plans
            </NavLink>
            <a href="/#why-securelife" className="text-decoration-none fw-medium small text-secondary">
              Why SecureLife
            </a>
            <a href="/#how-it-works" className="text-decoration-none fw-medium small text-secondary">
              How it works
            </a>
            <a href="/#reviews" className="text-decoration-none fw-medium small text-secondary">
              Reviews
            </a>
          </nav>

          <div className="d-flex align-items-center gap-2">
            <Link to="/quote" className="btn btn-brand-navy btn-sm rounded-pill px-3 py-2 fw-semibold small btn-animate-arrow">
              Get a Quote
            </Link>
            <Link to="/crm/login" className="btn btn-outline-secondary btn-sm rounded-pill px-3 py-2 fw-medium small">
              CRM Login
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow-1">{children}</main>

      {/* Dark Navy Footer with Accent Cyan Icons */}
      <footer className="text-white py-5 mt-auto bg-navy-dark">
        <div className="container py-3">
          <div className="row g-4 mb-5">
            {/* Left Brand Info Column */}
            <div className="col-12 col-lg-4">
              <div className="d-flex align-items-center gap-2 mb-3">
                <div className="bg-brand-blue text-white rounded-3 p-2 d-flex align-items-center justify-content-center" style={{ width: 32, height: 32 }}>
                  <Shield size={18} />
                </div>
                <span className="fw-bold fs-5 text-white">SecureLife Insurance</span>
              </div>
              <p className="text-secondary small mb-4 opacity-75 max-w-320" style={{ lineHeight: 1.6 }}>
                Life, health and family protection plans backed by licensed advisors and a claims team that answers the first time you call.
              </p>
              <div className="d-flex flex-column gap-2.5 small">
                <div className="d-flex align-items-center gap-2 text-light opacity-90">
                  <Phone size={15} className="text-cyan-accent" />
                  <span>+1 (800) 555-0142</span>
                </div>
                <div className="d-flex align-items-center gap-2 text-light opacity-90">
                  <Mail size={15} className="text-cyan-accent" />
                  <span>hello@securelife.com</span>
                </div>
                <div className="d-flex align-items-center gap-2 text-light opacity-90">
                  <MapPin size={15} className="text-cyan-accent" />
                  <span>410 Harbor Street, Suite 900, Boston, MA 02110</span>
                </div>
              </div>
            </div>

            {/* Link Column 1: INSURANCE */}
            <div className="col-6 col-md-4 col-lg-2">
              <div className="section-tag text-secondary mb-3">
                INSURANCE
              </div>
              <ul className="list-unstyled d-flex flex-column gap-2 small">
                <li><Link to="/plans" className="text-light opacity-75 text-decoration-none">Basic Plan</Link></li>
                <li><Link to="/plans" className="text-light opacity-75 text-decoration-none">Gold Plan</Link></li>
                <li><Link to="/plans" className="text-light opacity-75 text-decoration-none">Premium Plan</Link></li>
                <li><Link to="/plans" className="text-light opacity-75 text-decoration-none">Compare plans</Link></li>
              </ul>
            </div>

            {/* Link Column 2: COMPANY */}
            <div className="col-6 col-md-4 col-lg-2">
              <div className="section-tag text-secondary mb-3">
                COMPANY
              </div>
              <ul className="list-unstyled d-flex flex-column gap-2 small">
                <li><a href="#about" className="text-light opacity-75 text-decoration-none">About SecureLife</a></li>
                <li><a href="#careers" className="text-light opacity-75 text-decoration-none">Careers</a></li>
                <li><a href="#news" className="text-light opacity-75 text-decoration-none">Newsroom</a></li>
                <li><a href="#contact" className="text-light opacity-75 text-decoration-none">Contact us</a></li>
              </ul>
            </div>

            {/* Link Column 3: SUPPORT */}
            <div className="col-12 col-md-4 col-lg-2">
              <div className="section-tag text-secondary mb-3">
                SUPPORT
              </div>
              <ul className="list-unstyled d-flex flex-column gap-2 small">
                <li><a href="#claim" className="text-light opacity-75 text-decoration-none">File a claim</a></li>
                <li><a href="#documents" className="text-light opacity-75 text-decoration-none">Policy documents</a></li>
                <li><a href="#faq" className="text-light opacity-75 text-decoration-none">FAQ</a></li>
                <li><a href="#advisor" className="text-light opacity-75 text-decoration-none">Find an advisor</a></li>
              </ul>
            </div>
          </div>

          <hr className="border-secondary opacity-25 my-4" />

          <div className="d-flex flex-column flex-md-row align-items-center justify-content-between small text-secondary opacity-75">
            <div>© 2026 SecureLife Insurance. All rights reserved.</div>
            <div className="mt-2 mt-md-0">
              Licensed in 48 states · NAIC #48210 · Privacy · Terms
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
