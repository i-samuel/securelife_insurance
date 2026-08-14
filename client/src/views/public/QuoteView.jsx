import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../../utils/api';
import { Shield, CheckCircle, ArrowLeft, PhoneCall } from 'lucide-react';

const QuoteView = () => {
  const [plans, setPlans] = useState([]);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: 'Male',
    occupation: '',
    requestedCoverage: '500000',
    requestedPolicyTerm: '20',
    monthlyBudget: '45',
    interestedPlanId: '',
  });

  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(null);
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    const fetchPublicPlans = async () => {
      try {
        const res = await apiFetch('/plans/public');
        if (res.status === 'success') {
          setPlans(res.data.plans || []);
        }
      } catch (err) {
        console.error('Error loading plans for quote form:', err);
      }
    };
    fetchPublicPlans();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitting(true);
    setFormSuccess(null);
    setFormError(null);

    try {
      const res = await apiFetch('/public/leads', {
        method: 'POST',
        body: formData,
      });

      if (res.status === 'success') {
        setFormSuccess('Thank you! Your quote enquiry has been submitted. A licensed SecureLife advisor will review your details and contact you shortly.');
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          dateOfBirth: '',
          gender: 'Male',
          occupation: '',
          requestedCoverage: '500000',
          requestedPolicyTerm: '20',
          monthlyBudget: '45',
          interestedPlanId: '',
        });
      }
    } catch (err) {
      setFormError(err.message || 'Failed to submit quote enquiry. Please check your inputs and try again.');
    } finally {
      setFormSubmitting(false);
    }
  };

  return (
    <div className="py-5" style={{ backgroundColor: '#F4F7FA', minHeight: '100vh' }}>
      <div className="container py-3">
        {/* Back Link */}
        <div className="mb-4">
          <Link to="/" className="text-secondary text-decoration-none d-inline-flex align-items-center gap-2 small fw-semibold">
            <ArrowLeft size={16} /> Back to home
          </Link>
        </div>

        {/* Section Heading */}
        <div className="mb-5">
          <span className="fw-bold small text-uppercase tracking-wider d-block mb-1" style={{ letterSpacing: '0.08em', fontSize: '0.78rem', color: '#0265DC' }}>
            LEAD ENQUIRY
          </span>
          <h1 className="fw-bold text-dark display-5 mb-3" style={{ color: '#0B132A' }}>
            Request your personalised quote
          </h1>
          <p className="text-secondary lead fs-6 max-w-2xl mb-0" style={{ maxWidth: '640px' }}>
            Share a few details about yourself and the cover you're looking for. A licensed SecureLife advisor will review your request and send a tailored quote — no payment or obligation required.
          </p>
        </div>

        {/* Form & Info Cards Row */}
        <div className="row g-4 align-items-start">
          {/* Left Form Card */}
          <div className="col-12 col-lg-7">
            <div className="bg-white rounded-4 p-4 p-md-5 shadow-sm border border-light-subtle">
              {formSuccess && (
                <div className="alert alert-success d-flex align-items-center gap-3 rounded-3 mb-4">
                  <CheckCircle size={22} className="flex-shrink-0" />
                  <div>{formSuccess}</div>
                </div>
              )}

              {formError && (
                <div className="alert alert-danger rounded-3 mb-4 small">{formError}</div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="row g-3 mb-3">
                  <div className="col-12 col-md-6">
                    <label className="form-label small fw-semibold text-dark">First name</label>
                    <input
                      type="text"
                      className="form-control py-2 bg-light-subtle"
                      required
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    />
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label small fw-semibold text-dark">Last name</label>
                    <input
                      type="text"
                      className="form-control py-2 bg-light-subtle"
                      required
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    />
                  </div>
                </div>

                <div className="row g-3 mb-3">
                  <div className="col-12 col-md-6">
                    <label className="form-label small fw-semibold text-dark">Email</label>
                    <input
                      type="email"
                      className="form-control py-2 bg-light-subtle"
                      required
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label small fw-semibold text-dark">Phone</label>
                    <input
                      type="tel"
                      className="form-control py-2 bg-light-subtle"
                      placeholder="+1 (555) 000-0000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="row g-3 mb-3">
                  <div className="col-12 col-md-6">
                    <label className="form-label small fw-semibold text-dark">Date of birth</label>
                    <input
                      type="date"
                      className="form-control py-2 bg-light-subtle"
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    />
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label small fw-semibold text-dark">Gender</label>
                    <select
                      className="form-select py-2 bg-light-subtle"
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="row g-3 mb-3">
                  <div className="col-12 col-md-6">
                    <label className="form-label small fw-semibold text-dark">Occupation</label>
                    <input
                      type="text"
                      className="form-control py-2 bg-light-subtle"
                      placeholder="e.g. Software engineer"
                      value={formData.occupation}
                      onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                    />
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label small fw-semibold text-dark">Monthly budget (USD)</label>
                    <input
                      type="number"
                      className="form-control py-2 bg-light-subtle"
                      placeholder="e.g. 45"
                      value={formData.monthlyBudget}
                      onChange={(e) => setFormData({ ...formData, monthlyBudget: e.target.value })}
                    />
                  </div>
                </div>

                <div className="row g-3 mb-3">
                  <div className="col-12 col-md-6">
                    <label className="form-label small fw-semibold text-dark">Requested coverage amount (USD)</label>
                    <input
                      type="number"
                      className="form-control py-2 bg-light-subtle"
                      placeholder="e.g. 500000"
                      value={formData.requestedCoverage}
                      onChange={(e) => setFormData({ ...formData, requestedCoverage: e.target.value })}
                    />
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label small fw-semibold text-dark">Requested policy term (years)</label>
                    <input
                      type="number"
                      className="form-control py-2 bg-light-subtle"
                      placeholder="e.g. 20"
                      value={formData.requestedPolicyTerm}
                      onChange={(e) => setFormData({ ...formData, requestedPolicyTerm: e.target.value })}
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label small fw-semibold text-dark">Interested plan</label>
                  <select
                    className="form-select py-2 bg-light-subtle"
                    value={formData.interestedPlanId}
                    onChange={(e) => setFormData({ ...formData, interestedPlanId: e.target.value })}
                  >
                    <option value="">Select a plan</option>
                    {plans.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} (${p.min_premium} - ${p.max_premium}/mo)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 pt-2">
                  <p className="text-secondary small mb-0" style={{ fontSize: '0.78rem', maxWidth: '340px' }}>
                    By submitting you agree to be contacted about your enquiry. We never share your details.
                  </p>
                  <button
                    type="submit"
                    className="btn btn-primary px-4 py-2.5 fw-semibold rounded-3 shadow-sm"
                    style={{ backgroundColor: '#0265DC', borderColor: '#0265DC' }}
                    disabled={formSubmitting}
                  >
                    {formSubmitting ? 'Submitting...' : 'Submit enquiry'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Dark Card with Accent Cyan Icons and Phone Color */}
          <div className="col-12 col-lg-5">
            <div className="text-white rounded-4 p-4 p-md-5 shadow-sm" style={{ backgroundColor: '#0B132A' }}>
              <div className="d-flex align-items-center gap-2 mb-4 fs-5 fw-bold text-white">
                <div className="rounded-circle p-1.5 d-flex align-items-center justify-content-center" style={{ backgroundColor: 'rgba(56, 189, 248, 0.15)', color: '#38BDF8' }}>
                  <Shield size={20} />
                </div>
                <span>Why request a quote</span>
              </div>

              <div className="d-flex flex-column gap-3 mb-4 small opacity-90">
                <div className="d-flex align-items-start gap-3">
                  <div className="rounded-circle p-1 d-flex align-items-center justify-content-center flex-shrink-0 mt-0.5" style={{ backgroundColor: 'rgba(56, 189, 248, 0.15)', color: '#38BDF8', width: 24, height: 24 }}>
                    <CheckCircle size={14} />
                  </div>
                  <span className="text-white opacity-90">Advisor-reviewed pricing for your household</span>
                </div>
                <div className="d-flex align-items-start gap-3">
                  <div className="rounded-circle p-1 d-flex align-items-center justify-content-center flex-shrink-0 mt-0.5" style={{ backgroundColor: 'rgba(56, 189, 248, 0.15)', color: '#38BDF8', width: 24, height: 24 }}>
                    <CheckCircle size={14} />
                  </div>
                  <span className="text-white opacity-90">Basic, Gold and Premium compared side by side</span>
                </div>
                <div className="d-flex align-items-start gap-3">
                  <div className="rounded-circle p-1 d-flex align-items-center justify-content-center flex-shrink-0 mt-0.5" style={{ backgroundColor: 'rgba(56, 189, 248, 0.15)', color: '#38BDF8', width: 24, height: 24 }}>
                    <CheckCircle size={14} />
                  </div>
                  <span className="text-white opacity-90">No payment details, no obligation</span>
                </div>
                <div className="d-flex align-items-start gap-3">
                  <div className="rounded-circle p-1 d-flex align-items-center justify-content-center flex-shrink-0 mt-0.5" style={{ backgroundColor: 'rgba(56, 189, 248, 0.15)', color: '#38BDF8', width: 24, height: 24 }}>
                    <CheckCircle size={14} />
                  </div>
                  <span className="text-white opacity-90">Claims team answers the first time you call</span>
                </div>
              </div>

              <hr className="border-secondary opacity-25 my-4" />

              <div className="pt-2">
                <div className="text-uppercase small fw-bold tracking-wider text-secondary mb-2" style={{ letterSpacing: '0.08em', fontSize: '0.72rem', color: '#94A3B8' }}>
                  PREFER TO TALK?
                </div>
                <div className="fs-4 fw-bold mb-1 d-flex align-items-center gap-2" style={{ color: '#38BDF8' }}>
                  <PhoneCall size={20} />
                  <span>+1 (800) 555-0142</span>
                </div>
                <div className="text-secondary style-small" style={{ color: '#94A3B8' }}>Mon-Fri, 8am-8pm ET</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuoteView;
