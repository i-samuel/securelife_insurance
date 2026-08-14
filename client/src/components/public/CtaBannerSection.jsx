import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, PhoneCall } from 'lucide-react';

const CtaBannerSection = () => {
  return (
    <section className="py-5 bg-white">
      <div className="container">
        <div className="rounded-4 p-4 p-md-5 text-white shadow-lg bg-navy-dark">
          <div className="row align-items-center justify-content-between g-4">
            <div className="col-12 col-lg-7">
              <h2 className="fw-bold display-6 mb-2 text-white">
                Get your SecureLife quote in about two minutes
              </h2>
              <p className="text-secondary opacity-75 small mb-0 max-w-560">
                No payment details, no obligation. You will receive an advisor-reviewed quote with Basic, Gold and Premium priced for your household.
              </p>
            </div>
            <div className="col-12 col-lg-5 d-flex flex-wrap gap-3 justify-content-lg-end">
              <Link to="/quote" className="btn btn-brand-blue rounded-pill px-4 py-3 fw-semibold d-inline-flex align-items-center gap-2 btn-animate-arrow">
                <span>Get a Quote</span>
                <ArrowRight size={18} />
              </Link>
              <a href="tel:+18005550142" className="btn btn-outline-light rounded-pill px-4 py-3 fw-semibold d-inline-flex align-items-center gap-2">
                <PhoneCall size={18} />
                <span>Talk to an advisor</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaBannerSection;
