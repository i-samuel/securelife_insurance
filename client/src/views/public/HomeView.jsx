import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../utils/api';
import { Shield, CheckCircle, ArrowRight, PhoneCall, Sparkles, Send } from 'lucide-react';

const HomeView = () => {
  const [plans, setPlans] = useState([]);
  const [loadingPlans, setLoadingPlans] = useState(true);

  // Quote Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    requestedCoverage: '100000',
    requestedPolicyTerm: '20',
    monthlyBudget: '150',
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
        console.error('Error loading public plans:', err);
      } finally {
        setLoadingPlans(false);
      }
    };

    fetchPublicPlans();
  }, []);

  const handleQuoteSubmit = async (e) => {
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
        setFormSuccess(res.message);
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          dateOfBirth: '',
          requestedCoverage: '100000',
          requestedPolicyTerm: '20',
          monthlyBudget: '150',
          interestedPlanId: '',
        });
      }
    } catch (err) {
      setFormError(err.message || 'Failed to submit quote request.');
    } finally {
      setFormSubmitting(false);
    }
  };

  return (
    <div>
      {/* Hero Banner */}
      <section className="bg-primary text-white py-5">
        <div className="container py-4">
          <div className="row align-items-center g-4">
            <div className="col-12 col-lg-7">
              <span className="badge bg-white text-primary rounded-pill px-3 py-2 fw-semibold mb-3">
                Modern Life Insurance & Coverage
              </span>
              <h1 className="display-4 fw-bold mb-3">
                Protect What Matters Most. Build a Secure Tomorrow.
              </h1>
              <p className="lead opacity-90 mb-4">
                SecureLife Insurance PLC provides flexible individual, family, and wealth protection plans tailored to your age and budget.
              </p>
              <div className="d-flex gap-3">
                <a href="#quote-form" className="btn btn-light text-primary btn-lg rounded-pill px-4 fw-bold">
                  Get a Free Quote
                </a>
                <a href="#plans" className="btn btn-outline-light btn-lg rounded-pill px-4">
                  Explore Plans
                </a>
              </div>
            </div>
            <div className="col-12 col-lg-5 text-center">
              <div className="bg-white text-dark rounded-4 p-4 shadow-lg">
                <div className="d-flex align-items-center justify-content-center gap-2 mb-3 text-primary fw-bold fs-5">
                  <Shield size={28} />
                  <span>SecureLife Assurance</span>
                </div>
                <div className="p-3 bg-light rounded-3 mb-3 text-start small">
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <CheckCircle size={16} className="text-success" />
                    <span>Instant Plan Recommendation Matching</span>
                  </div>
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <CheckCircle size={16} className="text-success" />
                    <span>Direct Connection to Dedicated Advisors</span>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <CheckCircle size={16} className="text-success" />
                    <span>Guaranteed Financial Security & Peace of Mind</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Plans Section */}
      <section id="plans" className="py-5 bg-white">
        <div className="container py-3">
          <div className="text-center max-w-lg mx-auto mb-5">
            <h2 className="fw-bold text-dark mb-2">Our Insurance Policies</h2>
            <p className="text-secondary">Compare tiers, eligibility criteria, and benefits to find the plan right for you.</p>
          </div>

          <div className="row g-4">
            {loadingPlans ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary"></div>
              </div>
            ) : (
              plans.map((plan) => (
                <div key={plan.id} className="col-12 col-md-4">
                  <div className="card h-100 border-0 shadow-sm rounded-4 p-4">
                    <div className="badge bg-primary-subtle text-primary rounded-pill w-max px-3 py-1 mb-3">
                      Age {plan.min_age} - {plan.max_age} yrs
                    </div>
                    <h4 className="fw-bold text-dark mb-2">{plan.name}</h4>
                    <p className="text-secondary small mb-3">{plan.description}</p>
                    
                    <div className="fs-3 fw-bold text-primary mb-3">
                      ${plan.min_premium} <span className="fs-6 text-muted font-normal">/ mo starting</span>
                    </div>

                    <div className="border-top pt-3 mt-auto">
                      <div className="fw-semibold small text-dark mb-2">Key Coverage & Benefits:</div>
                      <ul className="list-unstyled mb-4 small">
                        {(plan.benefits || []).map((ben, idx) => (
                          <li key={idx} className="d-flex align-items-center gap-2 mb-2 text-secondary">
                            <CheckCircle size={16} className="text-success flex-shrink-0" />
                            <span>{ben}</span>
                          </li>
                        ))}
                      </ul>
                      <a href="#quote-form" className="btn btn-outline-primary w-100 rounded-pill fw-semibold">
                        Select This Plan
                      </a>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Quote Form Section connected to CRM Backend */}
      <section id="quote-form" className="py-5 bg-light">
        <div className="container py-3">
          <div className="row justify-content-center">
            <div className="col-12 col-lg-8">
              <div className="card border-0 shadow rounded-4 p-4 p-md-5">
                <div className="text-center mb-4">
                  <div className="badge bg-primary text-white rounded-pill px-3 py-1 mb-2">
                    Direct CRM Integration
                  </div>
                  <h3 className="fw-bold text-dark mb-1">Get a Free Quote & Talk to an Advisor</h3>
                  <p className="text-secondary small">Fill out your details below. Our intelligent engine will match your criteria and assign a dedicated advisor.</p>
                </div>

                {formSuccess && (
                  <div className="alert alert-success d-flex align-items-center gap-2 rounded-3 mb-4">
                    <CheckCircle size={20} />
                    <div>{formSuccess}</div>
                  </div>
                )}

                {formError && (
                  <div className="alert alert-danger rounded-3 mb-4 small">{formError}</div>
                )}

                <form onSubmit={handleQuoteSubmit}>
                  <div className="row g-3 mb-3">
                    <div className="col-12 col-md-6">
                      <label className="form-label small fw-semibold">First Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        required
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label small fw-semibold">Last Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        required
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-12 col-md-6">
                      <label className="form-label small fw-semibold">Email Address *</label>
                      <input
                        type="email"
                        className="form-control"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label small fw-semibold">Phone Number</label>
                      <input
                        type="tel"
                        className="form-control"
                        placeholder="+1 555-0199"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-12 col-md-4">
                      <label className="form-label small fw-semibold">Date of Birth</label>
                      <input
                        type="date"
                        className="form-control"
                        value={formData.dateOfBirth}
                        onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                      />
                    </div>
                    <div className="col-12 col-md-4">
                      <label className="form-label small fw-semibold">Requested Coverage ($)</label>
                      <select
                        className="form-select"
                        value={formData.requestedCoverage}
                        onChange={(e) => setFormData({ ...formData, requestedCoverage: e.target.value })}
                      >
                        <option value="50000">$50,000</option>
                        <option value="100000">$100,000</option>
                        <option value="250000">$250,000</option>
                        <option value="500000">$500,000</option>
                        <option value="1000000">$1,000,000</option>
                      </select>
                    </div>
                    <div className="col-12 col-md-4">
                      <label className="form-label small fw-semibold">Monthly Budget ($)</label>
                      <select
                        className="form-select"
                        value={formData.monthlyBudget}
                        onChange={(e) => setFormData({ ...formData, monthlyBudget: e.target.value })}
                      >
                        <option value="50">$50 / mo</option>
                        <option value="100">$100 / mo</option>
                        <option value="200">$200 / mo</option>
                        <option value="400">$400 / mo</option>
                        <option value="800">$800+ / mo</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="form-label small fw-semibold">Preferred Insurance Plan (Optional)</label>
                    <select
                      className="form-select"
                      value={formData.interestedPlanId}
                      onChange={(e) => setFormData({ ...formData, interestedPlanId: e.target.value })}
                    >
                      <option value="">Let Smart Recommendation Engine Decide</option>
                      {plans.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} (${p.min_premium} - ${p.max_premium}/mo)
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary btn-lg w-100 rounded-pill fw-bold py-3"
                    disabled={formSubmitting}
                  >
                    {formSubmitting ? 'Submitting to CRM...' : 'Request Free Quote & Connect to Advisor'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomeView;
