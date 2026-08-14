import React from 'react';

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-5 bg-light-subtle border-bottom">
      <div className="container py-4">
        <div className="mb-5">
          <span className="section-tag text-primary d-block mb-1">
            HOW IT WORKS
          </span>
          <h2 className="fw-bold text-navy-dark display-6 mb-0">
            From quote to cover in 3 steps
          </h2>
        </div>

        <div className="row g-4">
          <div className="col-12 col-md-4">
            <div>
              <div className="fw-bold mb-2 text-brand-blue style-small" style={{ fontSize: '0.95rem', letterSpacing: '0.05em' }}>01</div>
              <h5 className="fw-bold text-dark mb-2">Request your quote</h5>
              <p className="text-secondary style-small mb-0" style={{ lineHeight: 1.6 }}>
                Answer six questions about your household, income and cover goals. Takes about two minutes.
              </p>
            </div>
          </div>

          <div className="col-12 col-md-4">
            <div>
              <div className="fw-bold mb-2 text-brand-blue style-small" style={{ fontSize: '0.95rem', letterSpacing: '0.05em' }}>02</div>
              <h5 className="fw-bold text-dark mb-2">Review with an advisor</h5>
              <p className="text-secondary style-small mb-0" style={{ lineHeight: 1.6 }}>
                A licensed advisor calls within one business day to confirm the numbers and flag anything you do not need.
              </p>
            </div>
          </div>

          <div className="col-12 col-md-4">
            <div>
              <div className="fw-bold mb-2 text-brand-blue style-small" style={{ fontSize: '0.95rem', letterSpacing: '0.05em' }}>03</div>
              <h5 className="fw-bold text-dark mb-2">Choose your plan</h5>
              <p className="text-secondary style-small mb-0" style={{ lineHeight: 1.6 }}>
                Compare Basic, Gold and Premium side by side, then activate the plan that fits — cover starts the same day.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
