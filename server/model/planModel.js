const db = require('../config/db');

const getAllPlans = async ({ includeInactive = false } = {}) => {
  let queryText = `
    SELECT id, name, slug, description, min_age, max_age, min_coverage, max_coverage,
           min_policy_term, max_policy_term, min_premium, max_premium, benefits,
           eligibility_description, is_active, created_at, updated_at
    FROM insurance_plans
  `;

  if (!includeInactive) {
    queryText += ` WHERE is_active = TRUE`;
  }

  queryText += ` ORDER BY min_premium ASC;`;

  const res = await db.query(queryText);
  return res.rows;
};

const getPlanById = async (id) => {
  const queryText = `
    SELECT id, name, slug, description, min_age, max_age, min_coverage, max_coverage,
           min_policy_term, max_policy_term, min_premium, max_premium, benefits,
           eligibility_description, is_active, created_at, updated_at
    FROM insurance_plans
    WHERE id = $1;
  `;
  const res = await db.query(queryText, [id]);
  return res.rows[0];
};

const getPlanBySlug = async (slug) => {
  const queryText = `
    SELECT id, name, slug, description, min_age, max_age, min_coverage, max_coverage,
           min_policy_term, max_policy_term, min_premium, max_premium, benefits,
           eligibility_description, is_active, created_at, updated_at
    FROM insurance_plans
    WHERE slug = $1;
  `;
  const res = await db.query(queryText, [slug]);
  return res.rows[0];
};

const createPlan = async (data) => {
  const {
    name,
    slug,
    description,
    minAge,
    maxAge,
    minCoverage,
    maxCoverage,
    minPolicyTerm,
    maxPolicyTerm,
    minPremium,
    maxPremium,
    benefits = [],
    eligibilityDescription,
  } = data;

  const queryText = `
    INSERT INTO insurance_plans (
      name, slug, description, min_age, max_age, min_coverage, max_coverage,
      min_policy_term, max_policy_term, min_premium, max_premium, benefits,
      eligibility_description
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
    RETURNING *;
  `;

  const res = await db.query(queryText, [
    name.trim(),
    slug.trim().toLowerCase(),
    description,
    minAge,
    maxAge,
    minCoverage,
    maxCoverage,
    minPolicyTerm,
    maxPolicyTerm,
    minPremium,
    maxPremium,
    JSON.stringify(benefits),
    eligibilityDescription,
  ]);

  return res.rows[0];
};

const updatePlan = async (id, data) => {
  const {
    name,
    slug,
    description,
    minAge,
    maxAge,
    minCoverage,
    maxCoverage,
    minPolicyTerm,
    maxPolicyTerm,
    minPremium,
    maxPremium,
    benefits,
    eligibilityDescription,
    isActive,
  } = data;

  const queryText = `
    UPDATE insurance_plans
    SET name = COALESCE($1, name),
        slug = COALESCE($2, slug),
        description = COALESCE($3, description),
        min_age = COALESCE($4, min_age),
        max_age = COALESCE($5, max_age),
        min_coverage = COALESCE($6, min_coverage),
        max_coverage = COALESCE($7, max_coverage),
        min_policy_term = COALESCE($8, min_policy_term),
        max_policy_term = COALESCE($9, max_policy_term),
        min_premium = COALESCE($10, min_premium),
        max_premium = COALESCE($11, max_premium),
        benefits = COALESCE($12, benefits),
        eligibility_description = COALESCE($13, eligibility_description),
        is_active = COALESCE($14, is_active),
        updated_at = CURRENT_TIMESTAMP
    WHERE id = $15
    RETURNING *;
  `;

  const res = await db.query(queryText, [
    name ? name.trim() : null,
    slug ? slug.trim().toLowerCase() : null,
    description,
    minAge,
    maxAge,
    minCoverage,
    maxCoverage,
    minPolicyTerm,
    maxPolicyTerm,
    minPremium,
    maxPremium,
    benefits ? JSON.stringify(benefits) : null,
    eligibilityDescription,
    isActive,
    id,
  ]);

  return res.rows[0];
};

const togglePlanActive = async (id, isActive) => {
  const queryText = `
    UPDATE insurance_plans
    SET is_active = $1, updated_at = CURRENT_TIMESTAMP
    WHERE id = $2
    RETURNING *;
  `;
  const res = await db.query(queryText, [isActive, id]);
  return res.rows[0];
};

module.exports = {
  getAllPlans,
  getPlanById,
  getPlanBySlug,
  createPlan,
  updatePlan,
  togglePlanActive,
};
