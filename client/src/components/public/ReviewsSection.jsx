import React from 'react';
import { Star } from 'lucide-react';

const ReviewsSection = () => {
  return (
    <section id="reviews" className="py-5 bg-white">
      <div className="container py-4">
        <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-5">
          <div>
            <h2 className="fw-bold text-navy-dark display-6 mb-1">
              Trusted by 240,000 policyholders
            </h2>
          </div>
          <div className="text-secondary style-small mt-2 mt-md-0">
            4.8 / 5 average rating across 12,400 verified reviews
          </div>
        </div>

        <div className="row g-4">
          <div className="col-12 col-md-4">
            <div className="bg-light-subtle p-4 rounded-4 border h-100 d-flex flex-column justify-content-between">
              <div>
                <div className="d-flex gap-1 text-warning mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>
                <p className="text-dark small mb-4">
                  "Our claim was settled in two days while we were still in the hospital. Nobody asked us to chase paperwork."
                </p>
              </div>
              <div>
                <div className="fw-bold text-dark style-small">Amara Silva</div>
                <div className="text-secondary style-small" style={{ fontSize: '0.75rem' }}>Gold plan · policyholder since 2021</div>
              </div>
            </div>
          </div>

          <div className="col-12 col-md-4">
            <div className="bg-light-subtle p-4 rounded-4 border h-100 d-flex flex-column justify-content-between">
              <div>
                <div className="d-flex gap-1 text-warning mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>
                <p className="text-dark small mb-4">
                  "The advisor talked me out of cover I did not need. That is the first time an insurer saved me money."
                </p>
              </div>
              <div>
                <div className="fw-bold text-dark style-small">Daniel Reyes</div>
                <div className="text-secondary style-small" style={{ fontSize: '0.75rem' }}>Premium plan · freelance architect</div>
              </div>
            </div>
          </div>

          <div className="col-12 col-md-4">
            <div className="bg-light-subtle p-4 rounded-4 border h-100 d-flex flex-column justify-content-between">
              <div>
                <div className="d-flex gap-1 text-warning mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>
                <p className="text-dark small mb-4">
                  "Straightforward pricing and a portal my wife and I can both use. Renewal took four minutes."
                </p>
              </div>
              <div>
                <div className="fw-bold text-dark style-small">Priya Menon</div>
                <div className="text-secondary style-small" style={{ fontSize: '0.75rem' }}>Basic plan · policyholder since 2023</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
