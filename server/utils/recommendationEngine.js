/**
 * Calculate age from date of birth string or return direct age
 */
function calculateAge(dateOfBirth) {
  if (!dateOfBirth) return null;
  const dob = new Date(dateOfBirth);
  if (isNaN(dob.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age;
}

/**
 * Deterministic Insurance Plan Recommendation Matching Engine
 */
function matchPlansForLead(leadCriteria, availablePlans) {
  const {
    age: directAge,
    dateOfBirth,
    requestedCoverage,
    requestedPolicyTerm,
    monthlyBudget,
  } = leadCriteria;

  const age = directAge || calculateAge(dateOfBirth);

  const scoredPlans = availablePlans.map((plan) => {
    let score = 0;
    let maxPossibleScore = 0;
    const reasons = [];

    const minAge = parseInt(plan.min_age, 10);
    const maxAge = parseInt(plan.max_age, 10);
    const minCoverage = parseFloat(plan.min_coverage);
    const maxCoverage = parseFloat(plan.max_coverage);
    const minTerm = parseInt(plan.min_policy_term, 10);
    const maxTerm = parseInt(plan.max_policy_term, 10);
    const minPremium = parseFloat(plan.min_premium);
    const maxPremium = parseFloat(plan.max_premium);

    // 1. Age Criteria (30 points)
    maxPossibleScore += 30;
    if (age !== null && age !== undefined) {
      if (age >= minAge && age <= maxAge) {
        score += 30;
        reasons.push({
          passed: true,
          criteria: 'Age Eligibility',
          message: `Applicant age (${age}) is eligible for plan range (${minAge}-${maxAge} yrs).`,
        });
      } else {
        reasons.push({
          passed: false,
          criteria: 'Age Eligibility',
          message: `Applicant age (${age}) falls outside plan range (${minAge}-${maxAge} yrs).`,
        });
      }
    } else {
      reasons.push({
        passed: true,
        criteria: 'Age Eligibility',
        message: `Age not specified (range: ${minAge}-${maxAge} yrs).`,
      });
      score += 15; // neutral partial score if age omitted
    }

    // 2. Coverage Criteria (30 points)
    maxPossibleScore += 30;
    const coverage = requestedCoverage ? parseFloat(requestedCoverage) : null;
    if (coverage !== null && !isNaN(coverage)) {
      if (coverage >= minCoverage && coverage <= maxCoverage) {
        score += 30;
        reasons.push({
          passed: true,
          criteria: 'Requested Coverage',
          message: `Requested coverage ($${coverage.toLocaleString()}) fits plan limit ($${minCoverage.toLocaleString()} - $${maxCoverage.toLocaleString()}).`,
        });
      } else if (coverage < minCoverage) {
        score += 15;
        reasons.push({
          passed: false,
          criteria: 'Requested Coverage',
          message: `Coverage requested ($${coverage.toLocaleString()}) is lower than minimum tier ($${minCoverage.toLocaleString()}).`,
        });
      } else {
        score += 10;
        reasons.push({
          passed: false,
          criteria: 'Requested Coverage',
          message: `Coverage requested ($${coverage.toLocaleString()}) exceeds plan maximum limit ($${maxCoverage.toLocaleString()}).`,
        });
      }
    } else {
      reasons.push({
        passed: true,
        criteria: 'Requested Coverage',
        message: `Coverage range ($${minCoverage.toLocaleString()} - $${maxCoverage.toLocaleString()}).`,
      });
      score += 15;
    }

    // 3. Policy Term (20 points)
    maxPossibleScore += 20;
    const term = requestedPolicyTerm ? parseInt(requestedPolicyTerm, 10) : null;
    if (term !== null && !isNaN(term)) {
      if (term >= minTerm && term <= maxTerm) {
        score += 20;
        reasons.push({
          passed: true,
          criteria: 'Policy Term',
          message: `Requested term (${term} yrs) fits available option (${minTerm}-${maxTerm} yrs).`,
        });
      } else {
        reasons.push({
          passed: false,
          criteria: 'Policy Term',
          message: `Requested term (${term} yrs) is outside allowed range (${minTerm}-${maxTerm} yrs).`,
        });
      }
    } else {
      reasons.push({
        passed: true,
        criteria: 'Policy Term',
        message: `Policy term options (${minTerm}-${maxTerm} yrs).`,
      });
      score += 10;
    }

    // 4. Monthly Budget (20 points)
    maxPossibleScore += 20;
    const budget = monthlyBudget ? parseFloat(monthlyBudget) : null;
    if (budget !== null && !isNaN(budget)) {
      if (budget >= minPremium && budget <= maxPremium) {
        score += 20;
        reasons.push({
          passed: true,
          criteria: 'Monthly Budget',
          message: `Monthly budget ($${budget}/mo) falls comfortably in premium range ($${minPremium} - $${maxPremium}/mo).`,
        });
      } else if (budget > maxPremium) {
        score += 20;
        reasons.push({
          passed: true,
          criteria: 'Monthly Budget',
          message: `Monthly budget ($${budget}/mo) fully covers maximum plan premium ($${maxPremium}/mo).`,
        });
      } else {
        score += 5;
        reasons.push({
          passed: false,
          criteria: 'Monthly Budget',
          message: `Monthly budget ($${budget}/mo) is below starting premium ($${minPremium}/mo).`,
        });
      }
    } else {
      reasons.push({
        passed: true,
        criteria: 'Monthly Budget',
        message: `Est. premium ($${minPremium} - $${maxPremium}/mo).`,
      });
      score += 10;
    }

    const matchPercentage = Math.round((score / maxPossibleScore) * 100);
    const isEligible = reasons.filter((r) => !r.passed).length === 0;

    return {
      plan,
      matchPercentage,
      isEligible,
      score,
      reasons,
    };
  });

  // Sort by highest match percentage
  scoredPlans.sort((a, b) => b.matchPercentage - a.matchPercentage);

  return scoredPlans;
}

module.exports = {
  calculateAge,
  matchPlansForLead,
};
