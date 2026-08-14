import React from 'react';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';

const PlanCardsSection = ({ plans, loadingPlans }) => {
  return (
    <section id="plans" className="py-5 bg-white">
      <div className="container py-4">
        <div className="text-center mx-auto mb-5 max-w-640">
          <span className="text-brand-blue section-tag d-block mb-1">
            INSURANCE PLANS
          </span>
          <h2 className="fw-bold text-navy-dark display-6 mb-2">
            Three plans, priced clearly. No hidden riders.
          </h2>
          <p className="text-secondary small">
            Every plan includes online policy management and a licensed advisor review before you sign. Switch or upgrade at any renewal without new medical checks.
          </p>
        </div>

        {/* Pricing Cards with Hover Micro-Animations */}
        <div className="row g-4 mb-4 align-items-stretch">
          {loadingPlans ? (
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
                      <span className="position-absolute top-0 end-0 translate-middle-y me-4 badge bg-brand-blue text-white rounded-pill px-3 py-1 fw-bold style-small">
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
                        className={`btn w-100 rounded-pill fw-semibold py-2.5 ${isGold ? 'btn-brand-blue shadow-sm' : 'btn-outline-primary'}`}
                      >
                        Get a Quote
                      </Link>
                      <Link to="/plans" className="btn btn-link text-secondary text-decoration-none text-center style-small">
                        View details
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
};

export default PlanCardsSection;
