const db = require('../config/db');

const findByEmail = async (email) => {
  const queryText = `
    SELECT u.id, u.role_id, u.first_name, u.last_name, u.email, u.password_hash, u.is_active, u.created_at,
           r.name AS role_name
    FROM users u
    JOIN roles r ON u.role_id = r.id
    WHERE LOWER(u.email) = LOWER($1);
  `;
  const res = await db.query(queryText, [email.trim()]);
  return res.rows[0];
};

const findById = async (id) => {
  const queryText = `
    SELECT u.id, u.role_id, u.first_name, u.last_name, u.email, u.is_active, u.created_at,
           r.name AS role_name
    FROM users u
    JOIN roles r ON u.role_id = r.id
    WHERE u.id = $1;
  `;
  const res = await db.query(queryText, [id]);
  return res.rows[0];
};

const getAllUsers = async ({ role = null, search = null, activeOnly = false } = {}) => {
  let queryText = `
    SELECT u.id, u.role_id, u.first_name, u.last_name, u.email, u.is_active, u.created_at,
           r.name AS role_name,
           (SELECT COUNT(*) FROM leads l WHERE l.assigned_advisor_id = u.id) AS assigned_leads_count,
           (SELECT COUNT(*) FROM leads l WHERE l.assigned_advisor_id = u.id AND l.status = 'CONVERTED') AS converted_leads_count
    FROM users u
    JOIN roles r ON u.role_id = r.id
    WHERE 1=1
  `;

  const params = [];
  let paramIndex = 1;

  if (activeOnly) {
    queryText += ` AND u.is_active = TRUE`;
  }

  if (role) {
    queryText += ` AND r.name = $${paramIndex}`;
    params.push(role);
    paramIndex++;
  }

  if (search) {
    queryText += ` AND (LOWER(u.first_name) LIKE $${paramIndex} OR LOWER(u.last_name) LIKE $${paramIndex} OR LOWER(u.email) LIKE $${paramIndex})`;
    params.push(`%${search.toLowerCase()}%`);
    paramIndex++;
  }

  queryText += ` ORDER BY u.created_at DESC;`;

  const res = await db.query(queryText, params);
  return res.rows;
};

const createUser = async ({ roleId, firstName, lastName, email, passwordHash }) => {
  const queryText = `
    INSERT INTO users (role_id, first_name, last_name, email, password_hash)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, role_id, first_name, last_name, email, is_active, created_at;
  `;
  const res = await db.query(queryText, [
    roleId,
    firstName.trim(),
    lastName.trim(),
    email.trim().toLowerCase(),
    passwordHash,
  ]);
  return res.rows[0];
};

const updateUser = async (id, { firstName, lastName, email, roleId, isActive, passwordHash }) => {
  const queryText = `
    UPDATE users
    SET first_name = COALESCE($1, first_name),
        last_name = COALESCE($2, last_name),
        email = COALESCE($3, email),
        role_id = COALESCE($4, role_id),
        is_active = COALESCE($5, is_active),
        password_hash = COALESCE($6, password_hash),
        updated_at = CURRENT_TIMESTAMP
    WHERE id = $7
    RETURNING id, role_id, first_name, last_name, email, is_active, updated_at;
  `;
  const res = await db.query(queryText, [
    firstName ? firstName.trim() : null,
    lastName ? lastName.trim() : null,
    email ? email.trim().toLowerCase() : null,
    roleId || null,
    isActive !== undefined ? isActive : null,
    passwordHash || null,
    id,
  ]);
  return res.rows[0];
};

const deleteUser = async (id) => {
  await db.query('UPDATE leads SET assigned_advisor_id = NULL WHERE assigned_advisor_id = $1', [id]);
  const queryText = `DELETE FROM users WHERE id = $1 RETURNING id;`;
  const res = await db.query(queryText, [id]);
  return res.rows[0];
};

const getRoles = async () => {
  const queryText = `SELECT id, name, description FROM roles ORDER BY id ASC;`;
  const res = await db.query(queryText);
  return res.rows;
};

module.exports = {
  findByEmail,
  findById,
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  getRoles,
};
