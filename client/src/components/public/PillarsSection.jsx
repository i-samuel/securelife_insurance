import React from 'react';
import { Shield, Award, Clock } from 'lucide-react';

const PillarsSection = () => {
  return (
    <section className="py-5 bg-light-subtle border-bottom">
      <div className="container py-3">
        <div className="row g-4">
          <div className="col-12 col-md-4">
            <div className="d-flex align-items-start gap-3">
              <div className="p-2 bg-primary bg-opacity-10 text-primary rounded-3 border border-primary border-opacity-25 flex-shrink-0">
                <Shield size={20} />
              </div>
              <div>
                <h6 className="fw-bold text-dark mb-1">Reliable protection</h6>
                <p className="text-secondary style-small mb-0" style={{ lineHeight: 1.5 }}>
                  Fully underwritten policies backed by reinsurance partners, with clear terms and no fine-print exclusions on core benefits.
                </p>
              </div>
            </div>
          </div>

          <div className="col-12 col-md-4">
            <div className="d-flex align-items-start gap-3">
              <div className="p-2 bg-primary bg-opacity-10 text-primary rounded-3 border border-primary border-opacity-25 flex-shrink-0">
                <Award size={20} />
              </div>
              <div>
                <h6 className="fw-bold text-dark mb-1">Flexible plans</h6>
                <p className="text-secondary style-small mb-0" style={{ lineHeight: 1.5 }}>
                  Adjust cover, add family members or pause optional riders at any renewal — without repeating medical assessments.
                </p>
              </div>
            </div>
          </div>

          <div className="col-12 col-md-4">
            <div className="d-flex align-items-start gap-3">
              <div className="p-2 bg-primary bg-opacity-10 text-primary rounded-3 border border-primary border-opacity-25 flex-shrink-0">
                <Clock size={20} />
              </div>
              <div>
                <h6 className="fw-bold text-dark mb-1">Human support</h6>
                <p className="text-secondary style-small mb-0" style={{ lineHeight: 1.5 }}>
                  A named advisor for every policyholder, plus a claims team reachable by phone, email or portal seven days a week.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PillarsSection;
