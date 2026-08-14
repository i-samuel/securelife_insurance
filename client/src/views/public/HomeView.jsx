import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../../utils/api';
import { Shield, Check, ArrowRight, UserCheck, Clock, Award, Star, PhoneCall, CheckCircle2 } from 'lucide-react';

// Lightweight JS Animated Counter Component for Hero Stats
const AnimatedCounter = ({ end, suffix = '', duration = 1800 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Ease-out quadratic formula
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeOut * end));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [end, duration]);

  return (
    <span>
      {count}
      {suffix}
    </span>
  );
};

const HomeView = () => {
  const [plans, setPlans] = useState([]);
  const [loadingPlans, setLoadingPlans] = useState(true);

  useEffect(() => {
    const fetchPublicPlans = async () => {
      try {
        const res = await apiFetch('/plans/public');
        if (res.status === 'success') setPlans(res.data.plans || []);
      } catch (err) {
        console.error('Error loading public plans:', err);
      } finally {
        setLoadingPlans(false);
      }
    };

    fetchPublicPlans();
  }, []);

  return (
    <div style={{ backgroundColor: '#FFFFFF' }}>
      {/* 1. Hero Section */}
      <section className="py-5 bg-white border-bottom">
        <div className="container py-4">
          <div className="row align-items-center g-5">
            <div className="col-12 col-lg-7">
              <div className="d-inline-flex align-items-center gap-2 bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 rounded-pill px-3 py-1.5 fw-semibold mb-3 style-small">
                <Shield size={14} className="text-primary" />
                <span>A+ rated · 98.4% of claims paid in 2025</span>
              </div>
              <h1 className="display-4 fw-bold mb-3 text-dark" style={{ color: '#0B132A', letterSpacing: '-0.03em', lineHeight: 1.15 }}>
                Protection for the life you are already building.
              </h1>
              <p className="lead text-secondary mb-4 opacity-90" style={{ maxWidth: '560px', fontSize: '1.1rem', lineHeight: 1.6 }}>
                SecureLife offers life, health and income protection plans designed with licensed advisors — transparent pricing, fast claims, and cover that adapts as your family and income change.
              </p>
              
              <div className="d-flex flex-wrap align-items-center gap-3 mb-5">
                <Link to="/quote" className="btn btn-primary btn-lg rounded-pill px-4 py-3 fw-semibold d-inline-flex align-items-center gap-2 btn-animate-arrow" style={{ backgroundColor: '#0265DC', borderColor: '#0265DC', fontSize: '0.98rem' }}>
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

      {/* 2. Three Feature Pillars */}
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

      {/* 3. Insurance Plans Section */}
      <section id="plans" className="py-5 bg-white">
        <div className="container py-4">
          <div className="text-center max-w-lg mx-auto mb-5" style={{ maxWidth: '600px' }}>
            <span className="text-primary fw-bold small text-uppercase tracking-wider d-block mb-1" style={{ letterSpacing: '0.08em', fontSize: '0.78rem' }}>
              INSURANCE PLANS
            </span>
            <h2 className="fw-bold text-dark display-6 mb-2" style={{ color: '#0B132A' }}>
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
                        <span className="position-absolute top-0 end-0 translate-middle-y me-4 badge bg-primary text-white rounded-pill px-3 py-1 fw-bold style-small">
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

      {/* 4. Why SecureLife Dark Section (White Titles & Cyan Icons) */}
      <section id="why-securelife" className="py-5 text-white" style={{ backgroundColor: '#0B132A' }}>
        <div className="container py-4">
          <div className="row g-5 align-items-center">
            <div className="col-12 col-lg-5">
              <span className="text-uppercase small fw-bold tracking-wider d-block mb-2" style={{ letterSpacing: '0.08em', fontSize: '0.75rem', color: '#38BDF8' }}>
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
                      <div className="rounded-circle p-1 d-flex align-items-center justify-content-center flex-shrink-0" style={{ backgroundColor: 'rgba(56, 189, 248, 0.15)', color: '#38BDF8', width: 28, height: 28 }}>
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
                      <div className="rounded-circle p-1 d-flex align-items-center justify-content-center flex-shrink-0" style={{ backgroundColor: 'rgba(56, 189, 248, 0.15)', color: '#38BDF8', width: 28, height: 28 }}>
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
                      <div className="rounded-circle p-1 d-flex align-items-center justify-content-center flex-shrink-0" style={{ backgroundColor: 'rgba(56, 189, 248, 0.15)', color: '#38BDF8', width: 28, height: 28 }}>
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
                      <div className="rounded-circle p-1 d-flex align-items-center justify-content-center flex-shrink-0" style={{ backgroundColor: 'rgba(56, 189, 248, 0.15)', color: '#38BDF8', width: 28, height: 28 }}>
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

      {/* 5. How It Works Section */}
      <section id="how-it-works" className="py-5 bg-light-subtle border-bottom">
        <div className="container py-4">
          <div className="mb-5">
            <span className="text-uppercase small fw-bold tracking-wider text-primary d-block mb-1" style={{ letterSpacing: '0.08em', fontSize: '0.75rem' }}>
              HOW IT WORKS
            </span>
            <h2 className="fw-bold text-dark display-6 mb-0" style={{ color: '#0B132A' }}>
              From quote to cover in 3 steps
            </h2>
          </div>

          <div className="row g-4">
            <div className="col-12 col-md-4">
              <div>
                <div className="fw-bold mb-2 style-small" style={{ color: '#0265DC', fontSize: '0.95rem', letterSpacing: '0.05em' }}>01</div>
                <h5 className="fw-bold text-dark mb-2">Request your quote</h5>
                <p className="text-secondary style-small mb-0" style={{ lineHeight: 1.6 }}>
                  Answer six questions about your household, income and cover goals. Takes about two minutes.
                </p>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div>
                <div className="fw-bold mb-2 style-small" style={{ color: '#0265DC', fontSize: '0.95rem', letterSpacing: '0.05em' }}>02</div>
                <h5 className="fw-bold text-dark mb-2">Review with an advisor</h5>
                <p className="text-secondary style-small mb-0" style={{ lineHeight: 1.6 }}>
                  A licensed advisor calls within one business day to confirm the numbers and flag anything you do not need.
                </p>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div>
                <div className="fw-bold mb-2 style-small" style={{ color: '#0265DC', fontSize: '0.95rem', letterSpacing: '0.05em' }}>03</div>
                <h5 className="fw-bold text-dark mb-2">Choose your plan</h5>
                <p className="text-secondary style-small mb-0" style={{ lineHeight: 1.6 }}>
                  Compare Basic, Gold and Premium side by side, then activate the plan that fits — cover starts the same day.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Reviews Section */}
      <section id="reviews" className="py-5 bg-white">
        <div className="container py-4">
          <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-5">
            <div>
              <h2 className="fw-bold text-dark display-6 mb-1" style={{ color: '#0B132A' }}>
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

      {/* 7. Bottom Call-to-Action Dark Banner */}
      <section className="py-5 bg-white">
        <div className="container">
          <div className="rounded-4 p-4 p-md-5 text-white shadow-lg" style={{ backgroundColor: '#0B132A' }}>
            <div className="row align-items-center justify-content-between g-4">
              <div className="col-12 col-lg-7">
                <h2 className="fw-bold display-6 mb-2 text-white">
                  Get your SecureLife quote in about two minutes
                </h2>
                <p className="text-secondary opacity-75 small mb-0" style={{ maxWidth: '520px' }}>
                  No payment details, no obligation. You will receive an advisor-reviewed quote with Basic, Gold and Premium priced for your household.
                </p>
              </div>
              <div className="col-12 col-lg-5 d-flex flex-wrap gap-3 justify-content-lg-end">
                <Link to="/quote" className="btn btn-primary rounded-pill px-4 py-3 fw-semibold d-inline-flex align-items-center gap-2 btn-animate-arrow" style={{ backgroundColor: '#0265DC', borderColor: '#0265DC' }}>
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
    </div>
  );
};

export default HomeView;
