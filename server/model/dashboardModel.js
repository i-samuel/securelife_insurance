const db = require('../config/db');

const getDashboardStats = async (advisorId = null) => {
  let whereClause = '';
  const params = [];

  if (advisorId) {
    whereClause = 'WHERE assigned_advisor_id = $1';
    params.push(advisorId);
  }

  // 1. Overall Metrics
  const metricsQuery = `
    SELECT
      COUNT(*) AS total_leads,
      COUNT(CASE WHEN status = 'NEW' THEN 1 END) AS new_leads,
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
  const conversionRate = totalLeads > 0 ? ((convertedLeads / totalLeads) * 100).toFixed(1) : 0;

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

  // 3. Top Advisors Performance Table
  const advisorQuery = `
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
    GROUP BY u.id, u.first_name, u.last_name, u.email
    ORDER BY converted_count DESC, total_assigned DESC;
  `;
  const advisorRes = await db.query(advisorQuery);

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

  // 4. Recent Activities Feed
  const recentActivitiesQuery = `
    SELECT a.id, a.lead_id, a.activity_type, a.description, a.created_at,
           l.first_name AS lead_first_name, l.last_name AS lead_last_name,
           u.first_name AS user_first_name, u.last_name AS user_last_name
    FROM lead_activities a
    JOIN leads l ON a.lead_id = l.id
    LEFT JOIN users u ON a.user_id = u.id
    ORDER BY a.created_at DESC
    LIMIT 10;
  `;
  const recentActivitiesRes = await db.query(recentActivitiesQuery);

  return {
    kpis: {
      totalLeads,
      newLeads: parseInt(metrics.new_leads, 10),
      qualifiedLeads: parseInt(metrics.qualified_leads, 10),
      convertedLeads,
      leadsThisWeek: parseInt(metrics.leads_this_week, 10),
      conversionRate: parseFloat(conversionRate),
    },
    pipeline,
    topAdvisors,
    recentActivities: recentActivitiesRes.rows,
  };
};

module.exports = {
  getDashboardStats,
};
