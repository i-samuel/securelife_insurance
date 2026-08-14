import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../utils/api';

// Modular Public Components
import HeroSection from '../../components/public/HeroSection';
import PillarsSection from '../../components/public/PillarsSection';
import PlanCardsSection from '../../components/public/PlanCardsSection';
import WhySecureLifeSection from '../../components/public/WhySecureLifeSection';
import HowItWorksSection from '../../components/public/HowItWorksSection';
import ReviewsSection from '../../components/public/ReviewsSection';
import CtaBannerSection from '../../components/public/CtaBannerSection';

const HomeView = () => {
  const [plans, setPlans] = useState([]);
  const [loadingPlans, setLoadingPlans] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchPublicPlans = async () => {
      try {
        const res = await apiFetch('/plans/public');
        if (isMounted && res.status === 'success') {
          setPlans(res.data.plans || []);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Error loading public plans:', err);
        }
      } finally {
        if (isMounted) {
          setLoadingPlans(false);
        }
      }
    };

    fetchPublicPlans();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="bg-white">
      <HeroSection />
      <PillarsSection />
      <PlanCardsSection plans={plans} loadingPlans={loadingPlans} />
      <WhySecureLifeSection />
      <HowItWorksSection />
      <ReviewsSection />
      <CtaBannerSection />
    </div>
  );
};

export default HomeView;
