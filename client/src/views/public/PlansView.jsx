import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../utils/api';
import PlanCardsSection from '../../components/public/PlanCardsSection';
import CompareTable from '../../components/public/CompareTable';

const PlansView = () => {
  const [plans, setPlans] = useState([]);
  const [masterBenefits, setMasterBenefits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const [planRes, benRes] = await Promise.all([
          apiFetch('/plans/public'),
          apiFetch('/plans/benefits'),
        ]);

        if (isMounted) {
          if (planRes.status === 'success') setPlans(planRes.data.plans || []);
          if (benRes.status === 'success') setMasterBenefits(benRes.data.benefits || []);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Error loading public plans & benefits:', err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="py-5 bg-white min-vh-100">
      <div className="container py-3">
        {/* Policy Cards Section */}
        <PlanCardsSection plans={plans} loadingPlans={loading} />

        {/* Polished Dynamic Compare Matrix Table */}
        {!loading && (
          <CompareTable plans={plans} masterBenefits={masterBenefits} />
        )}
      </div>
    </div>
  );
};

export default PlansView;
