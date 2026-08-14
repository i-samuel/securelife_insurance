import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../../utils/api';
import { Check } from 'lucide-react';

const PlansView = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await apiFetch('/plans/public');
        if (res.status === 'success') setPlans(res.data.plans || []);
      } catch (err) {
        console.error('Error loading plans:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  return (
    <div className="py-5 bg-white min-vh-100">
      <div className="container py-3">
        {/* INSURANCE PLANS Header Section */}
        <div className="mb-5">
          <span className="fw-bold small text-uppercase tracking-wider d-block mb-1" style={{ letterSpacing: '0.08em', fontSize: '0.78rem', color: '#0265DC' }}>
            INSURANCE PLANS
          </span>
          <h1 className="fw-bold text-dark display-5 mb-2" style={{ color: '#0B132A' }}>
            Three plans, priced clearly. No hidden riders.
          </h1>
          <p className="text-secondary small max-w-lg mb-0" style={{ maxWidth: '640px' }}>
            Every plan includes online policy management and a licensed advisor review before you sign. Switch or upgrade at any renewal without new medical checks.
          </p>
        </div>

        {/* 3 Pricing Cards */}
        <div className="row g-4 mb-5 align-items-stretch">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary"></div>
            </div>
          ) : (
            plans.map((plan) => {
              const isGold = plan.slug && plan.slug.includes('gold');
              const includedBenefits = (plan.benefits || []).filter(
                (b) => (typeof b === 'object' ? b.isIncluded : true)
              );

              return (
                <div key={plan.id} className="col-12 col-md-4">
                  <div className={`card h-100 rounded-4 p-4 plan-card-hover ${isGold ? 'border-primary border-2 shadow-lg position-relative' : 'border shadow-sm bg-white'}`}>
                    {isGold && (
                      <span className="position-absolute top-0 end-0 translate-middle-y me-4 badge text-white rounded-pill px-3 py-1 fw-bold style-small" style={{ backgroundColor: '#0265DC' }}>
                        MOST CHOSEN
                      </span>
                    )}

                    <h4 className="fw-bold text-dark mb-1">{plan.name}</h4>
                    <p className="text-secondary style-small mb-3" style={{ minHeight: '36px' }}>{plan.description}</p>
                    
                    <div className="d-flex align-items-baseline gap-1 mb-4">
                      <span className="display-6 fw-bold text-dark">${plan.min_premium}</span>
                      <span className="text-secondary small">/ month</span>
                    </div>

                    <div className="border-top pt-3 mb-4">
                      <ul className="list-unstyled mb-0 d-flex flex-column gap-2 style-small">
                        {includedBenefits.map((ben, idx) => (
                          <li key={idx} className="d-flex align-items-center gap-2 text-secondary">
                            <Check size={16} className="text-primary flex-shrink-0" />
                            <span>{typeof ben === 'object' ? ben.name : ben}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-auto d-flex flex-column gap-2">
                      <Link
                        to="/quote"
                        className={`btn w-100 rounded-pill fw-semibold py-2.5 ${isGold ? 'btn-primary shadow-sm' : 'btn-outline-primary'}`}
                        style={isGold ? { backgroundColor: '#0265DC', borderColor: '#0265DC' } : {}}
                      >
                        Get a Quote
                      </Link>
                      <button type="button" className="btn btn-link text-secondary text-decoration-none text-center style-small" onClick={() => window.scrollTo({ top: 580, behavior: 'smooth' })}>
                        View details
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Polished Compare plans side by side Table Matrix */}
        <div className="card border rounded-4 shadow-sm overflow-hidden mb-4 border-light-subtle">
          <div className="card-header bg-light border-bottom p-4">
            <h5 className="fw-bold text-dark mb-0">Compare plans side by side</h5>
          </div>
          <div className="table-responsive">
            <table className="table align-middle mb-0 text-center compare-matrix-table">
              <thead className="table-light text-secondary small border-bottom">
                <tr>
                  <th className="text-start ps-4 py-3.5 text-secondary fw-semibold" style={{ width: '40%' }}>Benefit</th>
                  <th className="py-3.5 text-dark fw-bold" style={{ width: '20%' }}>Basic</th>
                  <th className="py-3.5 text-dark fw-bold" style={{ width: '20%' }}>Gold</th>
                  <th className="py-3.5 text-dark fw-bold" style={{ width: '20%' }}>Premium</th>
                </tr>
              </thead>
              <tbody className="small">
                <tr>
                  <td className="text-start ps-4 fw-medium text-dark py-3">Life cover</td>
                  <td className="py-3">$100k</td>
                  <td className="py-3 fw-semibold text-dark">$500k</td>
                  <td className="py-3 fw-bold text-primary">$1.5M</td>
                </tr>
                <tr>
                  <td className="text-start ps-4 fw-medium text-dark py-3">Family members included</td>
                  <td className="py-3">1</td>
                  <td className="py-3">4</td>
                  <td className="py-3">6</td>
                </tr>
                <tr>
                  <td className="text-start ps-4 fw-medium text-dark py-3">Critical illness cover</td>
                  <td className="py-3 text-muted">—</td>
                  <td className="py-3"><Check size={18} className="text-primary" /></td>
                  <td className="py-3"><Check size={18} className="text-primary" /></td>
                </tr>
                <tr>
                  <td className="text-start ps-4 fw-medium text-dark py-3">Income protection</td>
                  <td className="py-3 text-muted">—</td>
                  <td className="py-3 text-muted">—</td>
                  <td className="py-3"><Check size={18} className="text-primary" /></td>
                </tr>
                <tr>
                  <td className="text-start ps-4 fw-medium text-dark py-3">Worldwide coverage</td>
                  <td className="py-3 text-muted">—</td>
                  <td className="py-3 text-secondary">Travel only</td>
                  <td className="py-3"><Check size={18} className="text-primary" /></td>
                </tr>
                <tr>
                  <td className="text-start ps-4 fw-medium text-dark py-3">Claims turnaround</td>
                  <td className="py-3">7 days</td>
                  <td className="py-3">72 hours</td>
                  <td className="py-3 fw-bold text-dark">24 hours</td>
                </tr>
                <tr>
                  <td className="text-start ps-4 fw-medium text-dark py-3">Dedicated advisor</td>
                  <td className="py-3 text-muted">—</td>
                  <td className="py-3"><Check size={18} className="text-primary" /></td>
                  <td className="py-3"><Check size={18} className="text-primary" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlansView;
