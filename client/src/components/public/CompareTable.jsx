import React from 'react';
import { Check } from 'lucide-react';

const CompareTable = ({ plans, masterBenefits }) => {
  return (
    <div className="card border rounded-4 shadow-sm overflow-hidden mb-4 border-light-subtle">
      <div className="card-header bg-light border-bottom p-4">
        <h5 className="fw-bold text-dark mb-0">Compare plans side by side</h5>
      </div>
      <div className="table-responsive">
        <table className="table align-middle mb-0 text-center compare-matrix-table">
          <thead className="table-light text-secondary small border-bottom">
            <tr>
              <th className="text-start ps-4 text-secondary fw-semibold" style={{ width: '40%' }}>Policy Feature / Benefit</th>
              {plans.map((p) => (
                <th key={p.id} className="text-dark fw-bold" style={{ width: `${60 / (plans.length || 1)}%` }}>
                  {p.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="small">
            {/* 1. Database Policy Metrics Rows */}
            <tr className="table-subheading text-start bg-light-subtle fw-bold text-muted style-small">
              <td colSpan={(plans.length || 0) + 1} className="ps-4 text-uppercase tracking-wider">
                POLICY METRICS
              </td>
            </tr>
            <tr>
              <td className="text-start ps-4 fw-medium text-dark">Max Coverage Limit</td>
              {plans.map((p) => (
                <td key={p.id} className="fw-semibold text-dark">
                  ${Number(p.max_coverage).toLocaleString()}
                </td>
              ))}
            </tr>
            <tr>
              <td className="text-start ps-4 fw-medium text-dark">Age Eligibility</td>
              {plans.map((p) => (
                <td key={p.id} className="text-secondary">
                  {p.min_age} - {p.max_age} yrs
                </td>
              ))}
            </tr>
            <tr>
              <td className="text-start ps-4 fw-medium text-dark">Policy Term Range</td>
              {plans.map((p) => (
                <td key={p.id} className="text-secondary">
                  {p.min_policy_term} - {p.max_policy_term} yrs
                </td>
              ))}
            </tr>
            <tr>
              <td className="text-start ps-4 fw-medium text-dark">Monthly Premium Estimate</td>
              {plans.map((p) => (
                <td key={p.id} className="fw-bold text-primary">
                  ${p.min_premium} - ${p.max_premium}/mo
                </td>
              ))}
            </tr>

            {/* 2. Database Relational Master Benefits Rows */}
            <tr className="table-subheading text-start bg-light-subtle fw-bold text-muted style-small">
              <td colSpan={(plans.length || 0) + 1} className="ps-4 text-uppercase tracking-wider">
                COVERAGE & BENEFIT INCLUSIONS
              </td>
            </tr>
            {masterBenefits.map((benefit) => (
              <tr key={benefit.id}>
                <td className="text-start ps-4">
                  <div className="fw-semibold text-dark">{benefit.name}</div>
                  {benefit.description && (
                    <div className="text-muted style-small" style={{ fontSize: '0.75rem' }}>{benefit.description}</div>
                  )}
                </td>
                {plans.map((plan) => {
                  const planBenObj = (plan.benefits || []).find((b) => Number(b.id) === Number(benefit.id) || b.name === benefit.name);
                  const isIncluded = planBenObj ? Boolean(planBenObj.isIncluded) : false;

                  return (
                    <td key={plan.id}>
                      {isIncluded ? (
                        <Check size={18} className="text-primary" />
                      ) : (
                        <span className="text-muted">—</span>
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
  );
};

export default CompareTable;
