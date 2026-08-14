import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../utils/api';
import { Shield, CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const PlansView = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await apiFetch('/plans/public');
        if (res.status === 'success') setPlans(res.data.plans || []);
      } catch (err) {
        console.error('Error fetching plans:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  return (
    <div className="py-5">
      <div className="container">
        <div className="text-center max-w-lg mx-auto mb-5">
          <h2 className="display-6 fw-bold text-dark mb-2">Compare SecureLife Insurance Plans</h2>
          <p className="text-secondary">Comprehensive financial protection, critical illness shield, and wealth accumulation features.</p>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary"></div>
          </div>
        ) : (
          <div className="row g-4">
            {plans.map((plan) => (
              <div key={plan.id} className="col-12 col-md-4">
                <div className="card h-100 border-0 shadow-sm rounded-4 p-4">
                  <div className="d-flex align-items-center gap-2 mb-2 text-primary">
                    <Shield size={24} />
                    <span className="fw-bold">{plan.name}</span>
                  </div>
                  <p className="text-secondary small mb-3">{plan.description}</p>
                  
                  <div className="bg-light p-3 rounded-3 mb-3 small">
                    <div className="d-flex justify-content-between mb-1">
                      <span className="text-muted">Age Limits:</span>
                      <strong className="text-dark">{plan.min_age} - {plan.max_age} yrs</strong>
                    </div>
                    <div className="d-flex justify-content-between mb-1">
                      <span className="text-muted">Coverage Limit:</span>
                      <strong className="text-dark">${Number(plan.min_coverage).toLocaleString()} - ${Number(plan.max_coverage).toLocaleString()}</strong>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span className="text-muted">Policy Term:</span>
                      <strong className="text-dark">{plan.min_policy_term} - {plan.max_policy_term} yrs</strong>
                    </div>
                  </div>

                  <div className="mt-auto">
                    <div className="fw-semibold small text-dark mb-2">Included Benefits:</div>
                    <ul className="list-unstyled mb-4 small">
                      {(plan.benefits || []).map((ben, idx) => (
                        <li key={idx} className="d-flex align-items-center gap-2 mb-2 text-secondary">
                          <CheckCircle size={16} className="text-success flex-shrink-0" />
                          <span>{ben}</span>
                        </li>
                      ))}
                    </ul>
                    <Link to="/#quote-form" className="btn btn-primary w-100 rounded-pill fw-semibold">
                      Apply for {plan.name}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PlansView;
