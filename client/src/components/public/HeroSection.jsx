import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ArrowRight, UserCheck } from 'lucide-react';
import AnimatedCounter from './AnimatedCounter';

const HeroSection = () => {
  return (
    <section className="py-5 bg-white border-bottom">
      <div className="container py-4">
        <div className="row align-items-center g-5">
          <div className="col-12 col-lg-7">
            <div className="d-inline-flex align-items-center gap-2 bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 rounded-pill px-3 py-1.5 fw-semibold mb-3 style-small">
              <Shield size={14} className="text-primary" />
              <span>A+ rated · 98.4% of claims paid in 2025</span>
            </div>
            <h1 className="display-4 fw-bold mb-3 text-navy-dark" style={{ letterSpacing: '-0.03em', lineHeight: 1.15 }}>
              Protection for the life you are already building.
            </h1>
            <p className="lead text-secondary mb-4 opacity-90 max-w-560" style={{ fontSize: '1.1rem', lineHeight: 1.6 }}>
              SecureLife offers life, health and income protection plans designed with licensed advisors — transparent pricing, fast claims, and cover that adapts as your family and income change.
            </p>
            
            <div className="d-flex flex-wrap align-items-center gap-3 mb-5">
              <Link to="/quote" className="btn btn-brand-blue btn-lg rounded-pill px-4 py-3 fw-semibold d-inline-flex align-items-center gap-2 btn-animate-arrow" style={{ fontSize: '0.98rem' }}>
                <span>Get a Quote</span>
                <ArrowRight size={18} />
              </Link>
              <Link to="/plans" className="btn btn-outline-secondary btn-lg rounded-pill px-4 py-3 fw-semibold" style={{ fontSize: '0.98rem' }}>
                Explore plans
              </Link>
            </div>

            {/* JS Animated Hero Stats Row */}
            <div className="row g-4 border-top pt-4">
              <div className="col-4">
                <div className="fs-3 fw-bold text-dark mb-0">
                  <AnimatedCounter end={240} suffix="k+" />
                </div>
                <div className="text-secondary style-small">Policies in force</div>
              </div>
              <div className="col-4">
                <div className="fs-3 fw-bold text-dark mb-0">
                  <AnimatedCounter end={24} suffix=" hrs" />
                </div>
                <div className="text-secondary style-small">Average claim payout</div>
              </div>
              <div className="col-4">
                <div className="fs-3 fw-bold text-dark mb-0">
                  <AnimatedCounter end={31} suffix=" yrs" />
                </div>
                <div className="text-secondary style-small">Serving families</div>
              </div>
            </div>
          </div>

          {/* Hero Right Image Card */}
          <div className="col-12 col-lg-5">
            <div className="position-relative rounded-4 overflow-hidden shadow-lg border">
              <img
                src="/images/hero-advisor.jpg"
                alt="SecureLife Advisor with Family"
                className="w-100 object-fit-cover"
                style={{ height: '440px', objectPosition: 'center' }}
              />
              <div className="position-absolute bottom-0 start-0 end-0 p-3 bg-white bg-opacity-95 backdrop-blur border-top m-3 rounded-3 shadow-sm">
                <div className="d-flex align-items-center gap-2 mb-1">
                  <UserCheck size={18} className="text-primary" />
                  <span className="fw-bold small text-dark">Advisor-reviewed quotes</span>
                </div>
                <p className="text-secondary mb-0 style-small" style={{ fontSize: '0.78rem' }}>
                  Every quote is checked by a licensed advisor before you commit — no obligation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
