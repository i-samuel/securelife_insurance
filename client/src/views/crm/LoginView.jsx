import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Shield, Lock, Mail, Eye, EyeOff } from 'lucide-react';

const LoginView = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await login(email, password);
      navigate('/crm/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFillDemoAdmin = () => {
    setEmail('admin@securelife.com');
    setPassword('Password123!');
  };

  const handleFillDemoAdvisor = () => {
    setEmail('advisor.david@securelife.com');
    setPassword('Password123!');
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light p-3">
      <div className="card shadow-sm border-0 rounded-4 p-4" style={{ maxWidth: 420, width: '100%' }}>
        <div className="text-center mb-4">
          <div className="bg-primary text-white rounded-3 d-inline-flex align-items-center justify-content-center mb-2" style={{ width: 48, height: 48 }}>
            <Shield size={28} />
          </div>
          <h4 className="fw-bold text-dark mb-1">SecureLife CRM</h4>
          <p className="text-secondary small">Staff & Advisor Login Portal</p>
        </div>

        {error && <div className="alert alert-danger py-2 small">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label small fw-semibold text-secondary">Email Address</label>
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0 text-muted">
                <Mail size={16} />
              </span>
              <input
                type="email"
                className="form-control border-start-0 ps-0"
                placeholder="admin@securelife.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label small fw-semibold text-secondary">Password</label>
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0 text-muted">
                <Lock size={16} />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-control border-start-0 border-end-0 ps-0"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="btn btn-outline-secondary bg-white border-start-0 text-muted"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-100 rounded-3 py-2 fw-semibold" disabled={submitting}>
            {submitting ? 'Authenticating...' : 'Sign In to CRM'}
          </button>
        </form>

        <div className="border-top mt-4 pt-3 text-center">
          <div className="text-muted style-small mb-2">Demo Quick Sign-In Credentials:</div>
          <div className="d-flex gap-2 justify-content-center">
            <button type="button" className="btn btn-outline-secondary btn-sm rounded-pill" onClick={handleFillDemoAdmin}>
              Fill Admin Demo
            </button>
            <button type="button" className="btn btn-outline-secondary btn-sm rounded-pill" onClick={handleFillDemoAdvisor}>
              Fill Advisor Demo
            </button>
          </div>
        </div>

        <div className="text-center mt-3">
          <Link to="/" className="text-primary text-decoration-none small">
            ← Back to Public Website
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginView;
