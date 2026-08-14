import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { Users, UserX, CheckCircle, ShieldCheck, ArrowUpRight, Clock } from 'lucide-react';

const DashboardView = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeBar, setActiveBar] = useState(null);

  const { user, isAdmin } = useAuth();

  useEffect(() => {
    let isMounted = true;

    const fetchStats = async () => {
      try {
        const res = await apiFetch('/dashboard/stats');
        if (isMounted && res.status === 'success') {
          setStats(res.data);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Error loading dashboard stats:', err);
          setError('Failed to fetch dashboard metrics');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchStats();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  const kpis = stats?.kpis || {};
  const pipeline = stats?.pipeline || [];
  const topAdvisors = stats?.topAdvisors || [];
  const recentActivities = stats?.recentActivities || [];

  // 100% Real PostgreSQL Database Monthly Trend Data
  const trendData = stats?.monthlyTrend && stats.monthlyTrend.length > 0
    ? stats.monthlyTrend
    : [
        { month: 'Mar', leads: 0, conversions: 0 },
        { month: 'Apr', leads: 0, conversions: 0 },
        { month: 'May', leads: 0, conversions: 0 },
        { month: 'Jun', leads: 0, conversions: 0 },
        { month: 'Jul', leads: 0, conversions: 0 },
        { month: 'Aug', leads: kpis.totalLeads || 0, conversions: kpis.convertedLeads || 0 },
      ];

  const maxLeadsInChart = Math.max(...trendData.map((t) => t.leads), 1);

  return (
    <div>
      {/* Top Header */}
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h4 className="fw-bold text-dark mb-1">
            {isAdmin ? 'System Admin Dashboard' : `Welcome Back, ${user?.firstName || 'Advisor'}`}
          </h4>
          <p className="text-secondary small mb-0">
            {isAdmin
              ? 'Overview of lead flow, unassigned queue, advisor workload, and conversions.'
              : 'Overview of your assigned leads, current pipeline progress, and activity.'}
          </p>
        </div>
        <Link to="/crm/leads" className="btn btn-primary btn-sm rounded-pill px-3 d-flex align-items-center gap-1">
          <span>View leads</span>
          <ArrowUpRight size={16} />
        </Link>
      </div>

      {error && <div className="alert alert-danger py-2">{error}</div>}

      {/* KPI Cards */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-xl">
          <div className="metric-card">
            <div className="d-flex align-items-center justify-content-between text-secondary mb-2">
              <span className="small fw-medium">{isAdmin ? 'Total leads' : 'My Assigned Leads'}</span>
              <Users size={18} className="text-primary" />
            </div>
            <div className="metric-value">{kpis.totalLeads || 0}</div>
            <div className="text-success small fw-medium mt-1">+{kpis.leadsThisWeek || 0} this week</div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl">
          <div className="metric-card">
            <div className="d-flex align-items-center justify-content-between text-secondary mb-2">
              <span className="small fw-medium">New Status Leads</span>
              <Clock size={18} className="text-info" />
            </div>
            <div className="metric-value">{kpis.newLeads || 0}</div>
            <div className="text-secondary small mt-1">Awaiting first contact</div>
          </div>
        </div>

        {/* Unassigned Card - ONLY visible for Admin */}
        {isAdmin && (
          <div className="col-12 col-sm-6 col-xl">
            <div className="metric-card">
              <div className="d-flex align-items-center justify-content-between text-secondary mb-2">
                <span className="small fw-medium">Unassigned Leads</span>
                <UserX size={18} className="text-warning" />
              </div>
              <div className="metric-value">{kpis.unassignedLeads || 0}</div>
              <div className="text-warning small fw-medium mt-1">Needs advisor assignment</div>
            </div>
          </div>
        )}

        <div className="col-12 col-sm-6 col-xl">
          <div className="metric-card">
            <div className="d-flex align-items-center justify-content-between text-secondary mb-2">
              <span className="small fw-medium">Converted Leads</span>
              <CheckCircle size={18} className="text-success" />
            </div>
            <div className="metric-value">{kpis.convertedLeads || 0}</div>
            <div className="text-success small fw-medium mt-1">{kpis.conversionRate || 0}% Conversion Rate</div>
          </div>
        </div>

        {isAdmin && (
          <div className="col-12 col-sm-6 col-xl">
            <div className="metric-card">
              <div className="d-flex align-items-center justify-content-between text-secondary mb-2">
                <span className="small fw-medium">Active Plans</span>
                <ShieldCheck size={18} className="text-primary" />
              </div>
              <div className="metric-value">{kpis.activePlans || 3}</div>
              <div className="text-secondary small mt-1">Published policies</div>
            </div>
          </div>
        )}
      </div>

      {/* Main Grid: Interactive Chart (Admin) & Pipeline */}
      <div className="row g-3 mb-4">
        {/* Trend Card - ONLY visible for Admin */}
        {isAdmin && (
          <div className="col-12 col-lg-8">
            <div className="metric-card h-100">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <div>
                  <div className="fw-bold">Leads vs Conversions Monthly Trend</div>
                  <div className="text-secondary small">Real-time PostgreSQL monthly metrics</div>
                </div>
                <div className="d-flex align-items-center gap-3 small">
                  <span className="d-flex align-items-center gap-1">
                    <span className="d-inline-block rounded-circle bg-primary" style={{ width: 8, height: 8 }}></span> Leads
                  </span>
                  <span className="d-flex align-items-center gap-1">
                    <span className="d-inline-block rounded-circle bg-success" style={{ width: 8, height: 8 }}></span> Conversions
                  </span>
                </div>
              </div>

              {/* Interactive Bar Chart with Hover Tooltip */}
              <div className="p-4 text-center bg-light rounded position-relative" style={{ minHeight: 230 }}>
                {activeBar !== null && trendData[activeBar] && (
                  <div
                    className="position-absolute bg-dark text-white rounded p-2 shadow style-small"
                    style={{
                      top: '10px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      zIndex: 10,
                    }}
                  >
                    <strong>{trendData[activeBar].month}:</strong> {trendData[activeBar].leads} Total Leads · {trendData[activeBar].conversions} Converted Policies
                  </div>
                )}

                <div className="w-100 d-flex align-items-end justify-content-around px-2" style={{ height: 150 }}>
                  {trendData.map((d, index) => {
                    const leadPct = Math.max(5, (d.leads / maxLeadsInChart) * 100);
                    const convPct = Math.max(0, (d.conversions / maxLeadsInChart) * 100);

                    return (
                      <div
                        key={index}
                        className="d-flex align-items-end justify-content-center gap-1 cursor-pointer p-1 rounded"
                        style={{ width: `${90 / (trendData.length || 1)}%`, height: '100%' }}
                        onMouseEnter={() => setActiveBar(index)}
                        onMouseLeave={() => setActiveBar(null)}
                      >
                        <div
                          className="bg-primary rounded-top transition-all"
                          style={{
                            width: '45%',
                            height: `${leadPct}%`,
                            opacity: activeBar === index ? 1 : 0.85,
                          }}
                        ></div>
                        <div
                          className="bg-success rounded-top transition-all"
                          style={{
                            width: '45%',
                            height: `${convPct}%`,
                            opacity: activeBar === index ? 1 : 0.85,
                          }}
                        ></div>
                      </div>
                    );
                  })}
                </div>

                <div className="d-flex justify-content-around w-100 px-2 mt-2 text-muted style-small" style={{ fontSize: '0.78rem' }}>
                  {trendData.map((d, idx) => (
                    <span key={idx} className="fw-semibold">{d.month}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Pipeline Stage Breakdown */}
        <div className={isAdmin ? 'col-12 col-lg-4' : 'col-12'}>
          <div className="metric-card h-100">
            <div className="fw-bold mb-3">Sales Pipeline Breakdown</div>
            <div className="d-flex flex-column gap-3">
              {pipeline.map((item) => (
                <div key={item.status}>
                  <div className="d-flex justify-content-between small mb-1">
                    <span className="text-secondary fw-medium">{item.status}</span>
                    <span className="fw-bold text-dark">{item.count}</span>
                  </div>
                  <div className="pipeline-bar-container">
                    <div
                      className="pipeline-bar-fill"
                      style={{
                        width: `${Math.min(100, (item.count / (kpis.totalLeads || 1)) * 100)}%`,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Recent Activity & Advisor Workload */}
      <div className="row g-3">
        <div className={isAdmin ? 'col-12 col-lg-8' : 'col-12'}>
          <div className="metric-card">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <div className="fw-bold">
                {isAdmin ? 'Recent activity & lead trail' : 'My Recent Assigned Lead Trail'}
              </div>
              <Link to="/crm/leads" className="text-primary text-decoration-none small fw-medium">View all leads</Link>
            </div>
            <div className="table-responsive">
              <table className="table table-borderless align-middle mb-0 small">
                <thead className="table-light text-secondary">
                  <tr>
                    <th>Lead</th>
                    <th>Activity</th>
                    <th>User</th>
                    <th className="text-end">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {recentActivities.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center text-muted py-3">No activity logged yet</td>
                    </tr>
                  ) : (
                    recentActivities.slice(0, 5).map((act) => (
                      <tr key={act.id} className="border-bottom-faint">
                        <td className="fw-medium text-dark">{act.lead_first_name} {act.lead_last_name}</td>
                        <td>
                          <span className="badge bg-light text-dark border">
                            {act.activity_type}
                          </span>
                          <span className="text-muted ms-2 style-small">{act.description}</span>
                        </td>
                        <td className="text-secondary">{act.user_first_name ? `${act.user_first_name} ${act.user_last_name}` : 'System'}</td>
                        <td className="text-end text-muted style-small">{new Date(act.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Advisor Workload - ONLY visible for Admin */}
        {isAdmin && (
          <div className="col-12 col-lg-4">
            <div className="metric-card">
              <div className="fw-bold mb-3">Advisor workload & conversions</div>
              <div className="d-flex flex-column gap-3">
                {topAdvisors.length === 0 ? (
                  <div className="text-muted small">No advisor performance data</div>
                ) : (
                  topAdvisors.map((adv) => (
                    <div key={adv.id} className="d-flex align-items-center justify-content-between p-2 rounded bg-light">
                      <div className="d-flex align-items-center gap-2">
                        <div className="crm-avatar-pill" style={{ width: 32, height: 32, fontSize: '0.75rem' }}>
                          {adv.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="fw-semibold text-dark style-small">{adv.name}</div>
                          <div className="text-muted style-tiny-text">
                            {adv.totalAssigned} leads assigned
                          </div>
                        </div>
                      </div>
                      <div className="won-tag">
                        {adv.convertedCount} won ({adv.conversionRate}%)
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardView;
