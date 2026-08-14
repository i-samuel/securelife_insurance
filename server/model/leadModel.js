const db = require('../config/db');

const createLead = async (data, creatorUserId = null) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    dateOfBirth,
    gender,
    occupation,
    requestedCoverage,
    requestedPolicyTerm,
    monthlyBudget,
    interestedPlanId,
    status = 'NEW',
    assignedAdvisorId = null,
    source = 'Website Quote Form',
  } = data;

  const client = await db.pool.connect();
  try {
    await client.query('BEGIN');

    const leadQuery = `
      INSERT INTO leads (
        first_name, last_name, email, phone, date_of_birth, gender, occupation,
        requested_coverage, requested_policy_term, monthly_budget, interested_plan_id,
        status, assigned_advisor_id, source
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *;
    `;

    const leadRes = await client.query(leadQuery, [
      firstName.trim(),
      lastName.trim(),
      email.trim().toLowerCase(),
      phone ? phone.trim() : null,
      dateOfBirth || null,
      gender || null,
      occupation ? occupation.trim() : null,
      requestedCoverage ? parseFloat(requestedCoverage) : null,
      requestedPolicyTerm ? parseInt(requestedPolicyTerm, 10) : null,
      monthlyBudget ? parseFloat(monthlyBudget) : null,
      interestedPlanId || null,
      status,
      assignedAdvisorId || null,
      source,
    ]);

    const newLead = leadRes.rows[0];

    // Log Activity
    const activityQuery = `
      INSERT INTO lead_activities (lead_id, user_id, activity_type, description)
      VALUES ($1, $2, 'LEAD_CREATED', $3);
    `;
    await client.query(activityQuery, [
      newLead.id,
      creatorUserId,
      `Lead created via ${source}.`,
    ]);

    if (assignedAdvisorId) {
      await client.query(`
        INSERT INTO lead_activities (lead_id, user_id, activity_type, description)
        VALUES ($1, $2, 'LEAD_ASSIGNED', 'Assigned advisor during lead creation.');
      `, [newLead.id, creatorUserId]);
    }

    await client.query('COMMIT');
    return newLead;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

const getAllLeads = async ({ status = null, advisorId = null, search = null, limit = 50, offset = 0 } = {}) => {
  let queryText = `
    SELECT l.id, l.first_name, l.last_name, l.email, l.phone, l.date_of_birth, l.gender, l.occupation,
           l.requested_coverage, l.requested_policy_term, l.monthly_budget, l.status, l.source,
           l.created_at, l.updated_at,
           p.id AS plan_id, p.name AS plan_name, p.slug AS plan_slug,
           u.id AS advisor_id, u.first_name AS advisor_first_name, u.last_name AS advisor_last_name, u.email AS advisor_email
    FROM leads l
    LEFT JOIN insurance_plans p ON l.interested_plan_id = p.id
    LEFT JOIN users u ON l.assigned_advisor_id = u.id
    WHERE 1=1
  `;

  const params = [];
  let paramIndex = 1;

  if (status) {
    queryText += ` AND l.status = $${paramIndex}`;
    params.push(status);
    paramIndex++;
  }

  if (advisorId) {
    if (advisorId === 'unassigned') {
      queryText += ` AND l.assigned_advisor_id IS NULL`;
    } else {
      queryText += ` AND l.assigned_advisor_id = $${paramIndex}`;
      params.push(advisorId);
      paramIndex++;
    }
  }

  if (search) {
    queryText += ` AND (
      LOWER(l.first_name) LIKE $${paramIndex} OR
      LOWER(l.last_name) LIKE $${paramIndex} OR
      LOWER(l.email) LIKE $${paramIndex} OR
      LOWER(l.phone) LIKE $${paramIndex}
    )`;
    params.push(`%${search.toLowerCase()}%`);
    paramIndex++;
  }

  queryText += ` ORDER BY l.created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1};`;
  params.push(limit, offset);

  const res = await db.query(queryText, params);
  return res.rows;
};

const getLeadById = async (id) => {
  const queryText = `
    SELECT l.id, l.first_name, l.last_name, l.email, l.phone, l.date_of_birth, l.gender, l.occupation,
           l.requested_coverage, l.requested_policy_term, l.monthly_budget, l.status, l.source,
           l.created_at, l.updated_at,
           l.interested_plan_id, l.assigned_advisor_id,
           p.name AS plan_name, p.slug AS plan_slug, p.min_premium, p.max_premium,
           u.first_name AS advisor_first_name, u.last_name AS advisor_last_name, u.email AS advisor_email
    FROM leads l
    LEFT JOIN insurance_plans p ON l.interested_plan_id = p.id
    LEFT JOIN users u ON l.assigned_advisor_id = u.id
    WHERE l.id = $1;
  `;
  const res = await db.query(queryText, [id]);
  return res.rows[0];
};

const updateLeadStatus = async (id, status, userId = null) => {
  const client = await db.pool.connect();
  try {
    await client.query('BEGIN');

    const oldLeadRes = await client.query('SELECT status FROM leads WHERE id = $1', [id]);
    const oldStatus = oldLeadRes.rows[0]?.status;

    const updateQuery = `
      UPDATE leads
      SET status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *;
    `;
    const res = await client.query(updateQuery, [status, id]);
    const updatedLead = res.rows[0];

    // Log status change activity
    await client.query(`
      INSERT INTO lead_activities (lead_id, user_id, activity_type, description)
      VALUES ($1, $2, 'STATUS_CHANGED', $3);
    `, [id, userId, `Status changed from ${oldStatus} to ${status}.`]);

    await client.query('COMMIT');
    return updatedLead;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

const assignAdvisor = async (id, advisorId, userId = null) => {
  const client = await db.pool.connect();
  try {
    await client.query('BEGIN');

    const updateQuery = `
      UPDATE leads
      SET assigned_advisor_id = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *;
    `;
    const res = await client.query(updateQuery, [advisorId, id]);
    const updatedLead = res.rows[0];

    // Get advisor name
    let advisorName = 'Unassigned';
    if (advisorId) {
      const advRes = await client.query('SELECT first_name, last_name FROM users WHERE id = $1', [advisorId]);
      if (advRes.rows[0]) {
        advisorName = `${advRes.rows[0].first_name} ${advRes.rows[0].last_name}`;
      }
    }

    await client.query(`
      INSERT INTO lead_activities (lead_id, user_id, activity_type, description)
      VALUES ($1, $2, 'LEAD_ASSIGNED', $3);
    `, [id, userId, `Lead assigned to ${advisorName}.`]);

    await client.query('COMMIT');
    return updatedLead;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

const addLeadNote = async (leadId, userId, content) => {
  const client = await db.pool.connect();
  try {
    await client.query('BEGIN');

    const noteQuery = `
      INSERT INTO lead_notes (lead_id, user_id, content)
      VALUES ($1, $2, $3)
      RETURNING id, lead_id, user_id, content, created_at;
    `;
    const noteRes = await client.query(noteQuery, [leadId, userId, content.trim()]);
    const newNote = noteRes.rows[0];

    // Log Activity
    await client.query(`
      INSERT INTO lead_activities (lead_id, user_id, activity_type, description)
      VALUES ($1, $2, 'NOTE_ADDED', 'Added a new note.');
    `, [leadId, userId]);

    await client.query('COMMIT');

    // Fetch user details for note
    const userRes = await db.query('SELECT first_name, last_name, email FROM users WHERE id = $1', [userId]);
    return {
      ...newNote,
      user_first_name: userRes.rows[0]?.first_name,
      user_last_name: userRes.rows[0]?.last_name,
    };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

const getLeadNotes = async (leadId) => {
  const queryText = `
    SELECT n.id, n.lead_id, n.user_id, n.content, n.created_at,
           u.first_name AS user_first_name, u.last_name AS user_last_name
    FROM lead_notes n
    JOIN users u ON n.user_id = u.id
    WHERE n.lead_id = $1
    ORDER BY n.created_at DESC;
  `;
  const res = await db.query(queryText, [leadId]);
  return res.rows;
};

const getLeadActivities = async (leadId) => {
  const queryText = `
    SELECT a.id, a.lead_id, a.user_id, a.activity_type, a.description, a.created_at,
           u.first_name AS user_first_name, u.last_name AS user_last_name
    FROM lead_activities a
    LEFT JOIN users u ON a.user_id = u.id
    WHERE a.lead_id = $1
    ORDER BY a.created_at DESC;
  `;
  const res = await db.query(queryText, [leadId]);
  return res.rows;
};

module.exports = {
  createLead,
  getAllLeads,
  getLeadById,
  updateLeadStatus,
  assignAdvisor,
  addLeadNote,
  getLeadNotes,
  getLeadActivities,
};
