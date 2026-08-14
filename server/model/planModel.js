const db = require('../config/db');

const getAllPlans = async ({ includeInactive = false } = {}) => {
  let queryText = `
    SELECT p.id, p.name, p.slug, p.description, p.min_age, p.max_age, p.min_coverage, p.max_coverage,
           p.min_policy_term, p.max_policy_term, p.min_premium, p.max_premium, p.eligibility_description, p.is_active, p.created_at, p.updated_at,
           COALESCE(
             json_agg(
               json_build_object(
                 'id', b.id,
                 'name', b.name,
                 'description', b.description,
                 'category', b.category,
                 'isIncluded', pb.is_included,
                 'notes', pb.notes
               ) ORDER BY b.id ASC
             ) FILTER (WHERE b.id IS NOT NULL), '[]'
           ) AS benefits
    FROM insurance_plans p
    LEFT JOIN plan_benefits pb ON pb.plan_id = p.id
    LEFT JOIN benefits b ON pb.benefit_id = b.id
  `;

  if (!includeInactive) {
    queryText += ` WHERE p.is_active = TRUE`;
  }

  queryText += ` GROUP BY p.id ORDER BY p.min_premium ASC;`;

  const res = await db.query(queryText);
  return res.rows;
};

const getPlanById = async (id) => {
  const queryText = `
    SELECT p.id, p.name, p.slug, p.description, p.min_age, p.max_age, p.min_coverage, p.max_coverage,
           p.min_policy_term, p.max_policy_term, p.min_premium, p.max_premium, p.eligibility_description, p.is_active, p.created_at, p.updated_at,
           COALESCE(
             json_agg(
               json_build_object(
                 'id', b.id,
                 'name', b.name,
                 'description', b.description,
                 'category', b.category,
                 'isIncluded', pb.is_included,
                 'notes', pb.notes
               ) ORDER BY b.id ASC
             ) FILTER (WHERE b.id IS NOT NULL), '[]'
           ) AS benefits
    FROM insurance_plans p
    LEFT JOIN plan_benefits pb ON pb.plan_id = p.id
    LEFT JOIN benefits b ON pb.benefit_id = b.id
    WHERE p.id = $1
    GROUP BY p.id;
  `;
  const res = await db.query(queryText, [id]);
  return res.rows[0];
};

const getPlanBySlug = async (slug) => {
  const queryText = `
    SELECT p.id, p.name, p.slug, p.description, p.min_age, p.max_age, p.min_coverage, p.max_coverage,
           p.min_policy_term, p.max_policy_term, p.min_premium, p.max_premium, p.eligibility_description, p.is_active, p.created_at, p.updated_at,
           COALESCE(
             json_agg(
               json_build_object(
                 'id', b.id,
                 'name', b.name,
                 'description', b.description,
                 'category', b.category,
                 'isIncluded', pb.is_included,
                 'notes', pb.notes
               ) ORDER BY b.id ASC
             ) FILTER (WHERE b.id IS NOT NULL), '[]'
           ) AS benefits
    FROM insurance_plans p
    LEFT JOIN plan_benefits pb ON pb.plan_id = p.id
    LEFT JOIN benefits b ON pb.benefit_id = b.id
    WHERE p.slug = $1
    GROUP BY p.id;
  `;
  const res = await db.query(queryText, [slug]);
  return res.rows[0];
};

const getAllBenefits = async () => {
  const res = await db.query(`SELECT id, name, description, category FROM benefits ORDER BY id ASC;`);
  return res.rows;
};

const syncPlanBenefits = async (planId, includedBenefitIds = [], benefitNames = []) => {
  // Clear existing junction mapping
  await db.query(`DELETE FROM plan_benefits WHERE plan_id = $1;`, [planId]);

  // Fetch all master benefits
  const allBenefits = await getAllBenefits();

  for (const ben of allBenefits) {
    const isIncluded =
      includedBenefitIds.includes(Number(ben.id)) ||
      includedBenefitIds.includes(String(ben.id)) ||
      benefitNames.includes(ben.name);

    await db.query(
      `INSERT INTO plan_benefits (plan_id, benefit_id, is_included) VALUES ($1, $2, $3);`,
      [planId, ben.id, isIncluded]
    );
  }
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
    eligibilityDescription,
    benefitIds = [],
    benefits = [],
  } = data;

  const queryText = `
    INSERT INTO insurance_plans (
      name, slug, description, min_age, max_age, min_coverage, max_coverage,
      min_policy_term, max_policy_term, min_premium, max_premium, eligibility_description
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
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
    eligibilityDescription,
  ]);

  const newPlan = res.rows[0];
  await syncPlanBenefits(newPlan.id, benefitIds, benefits);

  return await getPlanById(newPlan.id);
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
    eligibilityDescription,
    isActive,
    benefitIds,
    benefits,
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
        eligibility_description = COALESCE($12, eligibility_description),
        is_active = COALESCE($13, is_active),
        updated_at = CURRENT_TIMESTAMP
    WHERE id = $14
    RETURNING *;
  `;

  await db.query(queryText, [
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
    eligibilityDescription,
    isActive,
    id,
  ]);

  if (benefitIds !== undefined || benefits !== undefined) {
    await syncPlanBenefits(id, benefitIds || [], benefits || []);
  }

  return await getPlanById(id);
};

const togglePlanActive = async (id, isActive) => {
  const queryText = `
    UPDATE insurance_plans
    SET is_active = $1, updated_at = CURRENT_TIMESTAMP
    WHERE id = $2
    RETURNING *;
  `;
  await db.query(queryText, [isActive, id]);
  return await getPlanById(id);
};

const deletePlan = async (id) => {
  const queryText = `DELETE FROM insurance_plans WHERE id = $1 RETURNING id;`;
  const res = await db.query(queryText, [id]);
  return res.rows[0];
};

module.exports = {
  getAllPlans,
  getPlanById,
  getPlanBySlug,
  getAllBenefits,
  createPlan,
  updatePlan,
  togglePlanActive,
  deletePlan,
};
