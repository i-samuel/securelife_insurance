import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../utils/api';
import { Shield, Check, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const PlansView = () => {
  const [plans, setPlans] = useState([]);
  const [masterBenefits, setMasterBenefits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [planRes, benRes] = await Promise.all([
          apiFetch('/plans/public'),
          apiFetch('/plans/benefits'),
        ]);

        if (planRes.status === 'success') setPlans(planRes.data.plans || []);
        if (benRes.status === 'success') setMasterBenefits(benRes.data.benefits || []);
      } catch (err) {
        console.error('Error fetching public plan comparison:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="py-5 bg-light min-vh-100">
      <div className="container">
        <div className="text-center max-w-lg mx-auto mb-5">
          <h2 className="display-6 fw-bold text-dark mb-2">Compare Policy Tiers & Coverage Features</h2>
          <p className="text-secondary">Explore side-by-side protection tiers, critical illness benefits, and policy limits.</p>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary"></div>
          </div>
        ) : (
          <>
            {/* Top Plan Cards */}
            <div className="row g-4 mb-5">
              {plans.map((plan) => (
                <div key={plan.id} className="col-12 col-md-4">
                  <div className="card h-100 border-0 shadow-sm rounded-4 p-4 bg-white">
                    <div className="d-flex align-items-center gap-2 mb-2 text-primary">
                      <Shield size={24} />
                      <span className="fw-bold fs-5">{plan.name}</span>
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
                        <span className="text-muted">Est. Premium:</span>
                        <strong className="text-primary">${plan.min_premium} - ${plan.max_premium}/mo</strong>
                      </div>
                    </div>

                    <Link to="/#quote-form" className="btn btn-outline-primary w-100 rounded-pill fw-semibold mt-auto">
                      Get a Quote for {plan.name}
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Relational Policy Feature Comparison Matrix Table */}
            <div className="card border-0 shadow rounded-4 overflow-hidden mb-4">
              <div className="card-header bg-dark text-white p-4 border-0">
                <h5 className="fw-bold mb-1">Relational Policy Benefits Matrix</h5>
                <p className="small text-secondary mb-0">Detailed breakdown of included benefits per plan tier</p>
              </div>

              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0 text-center">
                  <thead className="table-light">
                    <tr>
                      <th className="text-start ps-4 py-3 text-secondary" style={{ width: '40%' }}>Policy Feature / Benefit</th>
                      {plans.map((p) => (
                        <th key={p.id} className="py-3 text-dark fw-bold" style={{ width: `${60 / plans.length}%` }}>
                          {p.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {/* Basic Plan Info Rows */}
                    <tr className="table-subheading text-start bg-light fw-bold text-muted small">
                      <td colSpan={plans.length + 1} className="ps-4 py-2">POLICY METRICS</td>
                    </tr>
                    <tr>
                      <td className="text-start ps-4 fw-medium text-dark">Age Eligibility</td>
                      {plans.map((p) => (
                        <td key={p.id} className="small text-muted">{p.min_age} - {p.max_age} yrs</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="text-start ps-4 fw-medium text-dark">Coverage Limit Range</td>
                      {plans.map((p) => (
                        <td key={p.id} className="small text-dark fw-semibold">${Number(p.min_coverage).toLocaleString()} - ${Number(p.max_coverage).toLocaleString()}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="text-start ps-4 fw-medium text-dark">Monthly Premium Estimate</td>
                      {plans.map((p) => (
                        <td key={p.id} className="small text-primary fw-bold">${p.min_premium} - ${p.max_premium}/mo</td>
                      ))}
                    </tr>

                    {/* Master Relational Benefits Rows */}
                    <tr className="table-subheading text-start bg-light fw-bold text-muted small">
                      <td colSpan={plans.length + 1} className="ps-4 py-2">COVERAGE & BENEFIT INCLUSIONS</td>
                    </tr>

                    {masterBenefits.map((benefit) => (
                      <tr key={benefit.id}>
                        <td className="text-start ps-4">
                          <div className="fw-semibold text-dark small">{benefit.name}</div>
                          <div className="text-muted style-small" style={{ fontSize: '0.75rem' }}>{benefit.description}</div>
                        </td>
                        {plans.map((plan) => {
                          const planBenObj = (plan.benefits || []).find((b) => b.id === benefit.id || b.name === benefit.name);
                          const isIncluded = planBenObj ? planBenObj.isIncluded : false;
                          return (
                            <td key={plan.id}>
                              {isIncluded ? (
                                <span className="d-inline-flex align-items-center justify-content-center bg-success-subtle text-success rounded-circle" style={{ width: 28, height: 28 }}>
                                  <Check size={18} />
                                </span>
                              ) : (
                                <span className="d-inline-flex align-items-center justify-content-center bg-light text-muted rounded-circle" style={{ width: 28, height: 28 }}>
                                  <X size={18} />
                                </span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PlansView;
