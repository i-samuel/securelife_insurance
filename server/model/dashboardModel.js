const db = require('../config/db');

const getDashboardStats = async (advisorId = null) => {
  let whereClause = '';
  const params = [];

  if (advisorId) {
    whereClause = 'WHERE assigned_advisor_id = $1';
    params.push(advisorId);
  }

  // 1. Overall Metrics (Including distinct unassigned_leads and new_leads)
  const metricsQuery = `
    SELECT
      COUNT(*) AS total_leads,
      COUNT(CASE WHEN status = 'NEW' THEN 1 END) AS new_leads,
      COUNT(CASE WHEN assigned_advisor_id IS NULL THEN 1 END) AS unassigned_leads,
      COUNT(CASE WHEN status = 'QUALIFIED' THEN 1 END) AS qualified_leads,
      COUNT(CASE WHEN status = 'CONVERTED' THEN 1 END) AS converted_leads,
      COUNT(CASE WHEN created_at >= NOW() - INTERVAL '7 days' THEN 1 END) AS leads_this_week
    FROM leads
    ${whereClause};
  `;
  const metricsRes = await db.query(metricsQuery, params);
  const metrics = metricsRes.rows[0];

  const totalLeads = parseInt(metrics.total_leads, 10);
  const convertedLeads = parseInt(metrics.converted_leads, 10);
  const unassignedLeads = parseInt(metrics.unassigned_leads, 10);
  const newLeads = parseInt(metrics.new_leads, 10);
  const conversionRate = totalLeads > 0 ? ((convertedLeads / totalLeads) * 100).toFixed(1) : 0;

  // Active Plans Count
  const activePlansRes = await db.query('SELECT COUNT(*) FROM insurance_plans WHERE is_active = TRUE');
  const activePlansCount = parseInt(activePlansRes.rows[0].count, 10);

  // 2. Pipeline Breakdown
  const pipelineQuery = `
    SELECT status, COUNT(*) AS count
    FROM leads
    ${whereClause}
    GROUP BY status;
  `;
  const pipelineRes = await db.query(pipelineQuery, params);

  const statusOrder = ['NEW', 'CONTACTED', 'QUALIFIED', 'PLAN_RECOMMENDED', 'PROPOSAL', 'CONVERTED', 'LOST'];
  const pipelineMap = {};
  statusOrder.forEach((st) => { pipelineMap[st] = 0; });
  pipelineRes.rows.forEach((row) => {
    pipelineMap[row.status] = parseInt(row.count, 10);
  });

  const pipeline = statusOrder.map((st) => ({
    status: st,
    count: pipelineMap[st],
  }));

  // 3. Advisor Performance Table
  let advisorQuery = `
    SELECT
      u.id AS advisor_id,
      u.first_name,
      u.last_name,
      u.email,
      COUNT(l.id) AS total_assigned,
      COUNT(CASE WHEN l.status = 'CONVERTED' THEN 1 END) AS converted_count
    FROM users u
    JOIN roles r ON u.role_id = r.id
    LEFT JOIN leads l ON l.assigned_advisor_id = u.id
    WHERE r.name = 'ADVISOR' AND u.is_active = TRUE
  `;
  const advParams = [];
  if (advisorId) {
    advisorQuery += ` AND u.id = $1`;
    advParams.push(advisorId);
  }
  advisorQuery += ` GROUP BY u.id, u.first_name, u.last_name, u.email ORDER BY converted_count DESC, total_assigned DESC;`;

  const advisorRes = await db.query(advisorQuery, advParams);

  const topAdvisors = advisorRes.rows.map((adv) => {
    const total = parseInt(adv.total_assigned, 10);
    const converted = parseInt(adv.converted_count, 10);
    const rate = total > 0 ? ((converted / total) * 100).toFixed(1) : 0;
    return {
      id: adv.advisor_id,
      name: `${adv.first_name} ${adv.last_name}`,
      email: adv.email,
      totalAssigned: total,
      convertedCount: converted,
      conversionRate: parseFloat(rate),
    };
  });

  // 4. Recent Activities Feed (Filtered for advisor if advisorId present)
  let recentActivitiesQuery = `
    SELECT a.id, a.lead_id, a.activity_type, a.description, a.created_at,
           l.first_name AS lead_first_name, l.last_name AS lead_last_name,
           u.first_name AS user_first_name, u.last_name AS user_last_name
    FROM lead_activities a
    JOIN leads l ON a.lead_id = l.id
    LEFT JOIN users u ON a.user_id = u.id
  `;
  const actParams = [];
  if (advisorId) {
    recentActivitiesQuery += ` WHERE l.assigned_advisor_id = $1`;
    actParams.push(advisorId);
  }
  recentActivitiesQuery += ` ORDER BY a.created_at DESC LIMIT 10;`;

  const recentActivitiesRes = await db.query(recentActivitiesQuery, actParams);

  return {
    kpis: {
      totalLeads,
      newLeads,
      unassignedLeads,
      qualifiedLeads: parseInt(metrics.qualified_leads, 10),
      convertedLeads,
      leadsThisWeek: parseInt(metrics.leads_this_week, 10),
      conversionRate: parseFloat(conversionRate),
      activePlans: activePlansCount,
    },
    pipeline,
    topAdvisors,
    recentActivities: recentActivitiesRes.rows,
  };
};

module.exports = {
  getDashboardStats,
};
