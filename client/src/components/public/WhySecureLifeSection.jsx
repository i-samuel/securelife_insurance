import React from 'react';
import { CheckCircle2 } from 'lucide-react';

const WhySecureLifeSection = () => {
  return (
    <section id="why-securelife" className="py-5 text-white bg-navy-dark">
      <div className="container py-4">
        <div className="row g-5 align-items-center">
          <div className="col-12 col-lg-5">
            <span className="section-tag d-block mb-2 text-cyan-accent">
              WHY SECURELIFE
            </span>
            <h2 className="display-6 fw-bold mb-3 text-white">
              Insurance that behaves the way it should
            </h2>
            <p className="text-secondary opacity-75 lead fs-6 mb-0" style={{ lineHeight: 1.6 }}>
              We have spent 31 years insuring families, freelancers and small business owners. The product is simple on purpose: clear cover, fair pricing, and a person who answers when it matters.
            </p>
          </div>

          <div className="col-12 col-lg-7">
            <div className="row g-4">
              {/* Item 1 */}
              <div className="col-12 col-md-6">
                <div className="p-3">
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <div className="rounded-circle p-1 d-flex align-items-center justify-content-center flex-shrink-0 bg-cyan-subtle" style={{ width: 28, height: 28 }}>
                      <CheckCircle2 size={16} />
                    </div>
                    <h6 className="fw-bold mb-0 text-white">Transparent pricing</h6>
                  </div>
                  <p className="text-secondary style-small mb-0 opacity-75" style={{ fontSize: '0.84rem', lineHeight: 1.55 }}>
                    The premium you see in your quote is the premium you pay. No onboarding fees, no surprise loadings after signing.
                  </p>
                </div>
              </div>

              {/* Item 2 */}
              <div className="col-12 col-md-6">
                <div className="p-3">
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <div className="rounded-circle p-1 d-flex align-items-center justify-content-center flex-shrink-0 bg-cyan-subtle" style={{ width: 28, height: 28 }}>
                      <CheckCircle2 size={16} />
                    </div>
                    <h6 className="fw-bold mb-0 text-white">Claims paid quickly</h6>
                  </div>
                  <p className="text-secondary style-small mb-0 opacity-75" style={{ fontSize: '0.84rem', lineHeight: 1.55 }}>
                    98.4% of claims approved in 2025, with an average payout time of 24 hours on Premium and 72 hours on Gold.
                  </p>
                </div>
              </div>

              {/* Item 3 */}
              <div className="col-12 col-md-6">
                <div className="p-3">
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <div className="rounded-circle p-1 d-flex align-items-center justify-content-center flex-shrink-0 bg-cyan-subtle" style={{ width: 28, height: 28 }}>
                      <CheckCircle2 size={16} />
                    </div>
                    <h6 className="fw-bold mb-0 text-white">Advice, not sales pressure</h6>
                  </div>
                  <p className="text-secondary style-small mb-0 opacity-75" style={{ fontSize: '0.84rem', lineHeight: 1.55 }}>
                    Advisors are salaried, not commissioned — they recommend the smallest plan that actually covers your risk.
                  </p>
                </div>
              </div>

              {/* Item 4 */}
              <div className="col-12 col-md-6">
                <div className="p-3">
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <div className="rounded-circle p-1 d-flex align-items-center justify-content-center flex-shrink-0 bg-cyan-subtle" style={{ width: 28, height: 28 }}>
                      <CheckCircle2 size={16} />
                    </div>
                    <h6 className="fw-bold mb-0 text-white">One place for everything</h6>
                  </div>
                  <p className="text-secondary style-small mb-0 opacity-75" style={{ fontSize: '0.84rem', lineHeight: 1.55 }}>
                    Manage policies, beneficiaries, documents and claims from a single secure portal shared with your advisor.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhySecureLifeSection;
