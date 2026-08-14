import React, { useState, useEffect, useCallback } from 'react';
import { apiFetch } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { Plus, Search, Filter, Mail, Eye } from 'lucide-react';

// Modular CRM Components
import AddLeadModal from '../../components/crm/AddLeadModal';
import LeadDetailModal from '../../components/crm/LeadDetailModal';

const LeadsView = () => {
  const [leads, setLeads] = useState([]);
  const [advisors, setAdvisors] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [statusFilter, setStatusFilter] = useState('');
  const [advisorFilter, setAdvisorFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [leadDetail, setLeadDetail] = useState(null);
  const [newNote, setNewNote] = useState('');
  const [noteSubmitting, setNoteSubmitting] = useState(false);

  const initialLeadFormState = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: 'Male',
    occupation: '',
    requestedCoverage: '250000',
    requestedPolicyTerm: '20',
    monthlyBudget: '150',
    interestedPlanId: '',
    assignedAdvisorId: '',
  };

  const [newLeadForm, setNewLeadForm] = useState(initialLeadFormState);

  const { isAdmin, isAdvisor, user } = useAuth();

  const fetchLeads = useCallback(async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      if (statusFilter) queryParams.append('status', statusFilter);

      if (isAdvisor) {
        queryParams.append('advisorId', user.id);
      } else if (advisorFilter) {
        queryParams.append('advisorId', advisorFilter);
      }

      if (searchTerm) queryParams.append('search', searchTerm);

      const res = await apiFetch(`/leads?${queryParams.toString()}`);
      if (res.status === 'success') {
        setLeads(res.data.leads || []);
      }
    } catch (err) {
      console.error('Error fetching leads:', err);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, advisorFilter, isAdvisor, user?.id, searchTerm]);

  useEffect(() => {
    let isMounted = true;

    const fetchDropdowns = async () => {
      try {
        const [advRes, planRes] = await Promise.all([
          apiFetch('/users?role=ADVISOR'),
          apiFetch('/plans/public'),
        ]);

        if (isMounted) {
          if (advRes.status === 'success') setAdvisors(advRes.data.users || []);
          if (planRes.status === 'success') setPlans(planRes.data.plans || []);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Error loading dropdown data:', err);
        }
      }
    };

    fetchDropdowns();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const handleOpenDetail = async (leadId) => {
    try {
      const res = await apiFetch(`/leads/${leadId}`);
      if (res.status === 'success') {
        setLeadDetail(res.data);
        setShowDetailModal(true);
      }
    } catch (err) {
      alert(err.message || 'Failed to fetch lead details.');
    }
  };

  const handleCreateLead = async (e) => {
    e.preventDefault();
    try {
      await apiFetch('/leads', {
        method: 'POST',
        body: newLeadForm,
      });
      setShowAddModal(false);
      setNewLeadForm(initialLeadFormState);
      fetchLeads();
    } catch (err) {
      alert(err.message || 'Failed to create lead.');
    }
  };

  const handleStatusChange = async (newStatus) => {
    if (!leadDetail) return;
    try {
      const res = await apiFetch(`/leads/${leadDetail.lead.id}/status`, {
        method: 'PATCH',
        body: { status: newStatus },
      });
      if (res.status === 'success') {
        setLeadDetail((prev) => ({
          ...prev,
          lead: { ...prev.lead, status: newStatus },
        }));
        fetchLeads();
      }
    } catch (err) {
      alert(err.message || 'Failed to update status.');
    }
  };

  const handleAssignAdvisor = async (advisorId) => {
    if (!leadDetail) return;
    try {
      const res = await apiFetch(`/leads/${leadDetail.lead.id}/assign`, {
        method: 'PATCH',
        body: { advisorId: advisorId || null },
      });
      if (res.status === 'success') {
        setLeadDetail((prev) => ({
          ...prev,
          lead: { ...prev.lead, assigned_advisor_id: advisorId || null },
        }));
        fetchLeads();
      }
    } catch (err) {
      alert(err.message || 'Failed to assign advisor.');
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim() || !leadDetail) return;

    setNoteSubmitting(true);
    try {
      const res = await apiFetch(`/leads/${leadDetail.lead.id}/notes`, {
        method: 'POST',
        body: { content: newNote },
      });
      if (res.status === 'success') {
        setNewNote('');
        handleOpenDetail(leadDetail.lead.id);
      }
    } catch (err) {
      alert(err.message || 'Failed to add note.');
    } finally {
      setNoteSubmitting(false);
    }
  };

  const statuses = [
    'NEW',
    'CONTACTED',
    'QUALIFIED',
    'PLAN_RECOMMENDED',
    'PROPOSAL',
    'CONVERTED',
    'LOST',
  ];

  return (
    <div>
      {/* Header Bar */}
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h4 className="fw-bold text-dark mb-1">Lead Management Pipeline</h4>
          <p className="text-secondary small mb-0">Track insurance enquiries, assign leads to advisors, and monitor match recommendations.</p>
        </div>
        <button
          className="btn btn-primary btn-sm rounded-pill px-3 d-flex align-items-center gap-1"
          onClick={() => {
            setNewLeadForm(initialLeadFormState);
            setShowAddModal(true);
          }}
        >
          <Plus size={16} />
          <span>Add New Lead</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="card border-0 shadow-sm rounded-3 p-3 mb-4">
        <div className="row g-2 align-items-center">
          <div className="col-12 col-md-4">
            <div className="input-group input-group-sm">
              <span className="input-group-text bg-white border-end-0">
                <Search size={14} className="text-secondary" />
              </span>
              <input
                type="text"
                className="form-control border-start-0"
                placeholder="Search by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="col-6 col-md-3">
            <div className="d-flex align-items-center gap-2">
              <Filter size={14} className="text-secondary flex-shrink-0" />
              <select
                className="form-select form-select-sm"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Pipeline Statuses</option>
                {statuses.map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>
          </div>

          {isAdmin && (
            <div className="col-6 col-md-3">
              <select
                className="form-select form-select-sm"
                value={advisorFilter}
                onChange={(e) => setAdvisorFilter(e.target.value)}
              >
                <option value="">All Advisors</option>
                {advisors.map((adv) => (
                  <option key={adv.id} value={adv.id}>
                    {adv.first_name} {adv.last_name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="col-12 col-md-2 text-end ms-auto">
            <button
              className="btn btn-sm btn-outline-secondary rounded-pill px-3 w-100"
              onClick={() => {
                setStatusFilter('');
                setAdvisorFilter('');
                setSearchTerm('');
              }}
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* Leads Sheet Table */}
      <div className="card border-0 shadow-sm rounded-3">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light text-secondary small">
              <tr>
                <th>Lead ID</th>
                <th>Applicant</th>
                <th>Contact</th>
                <th>Coverage & Term</th>
                <th>Status</th>
                <th>Assigned Advisor</th>
                <th>Date</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="text-center py-4 text-muted">Loading pipeline leads...</td>
                </tr>
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-4 text-muted">No matching leads found.</td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead.id}>
                    <td className="fw-semibold text-secondary">#{lead.id}</td>
                    <td>
                      <div className="fw-bold text-dark">{lead.first_name} {lead.last_name}</div>
                      {lead.occupation && <div className="text-muted style-small">{lead.occupation}</div>}
                    </td>
                    <td>
                      <div className="d-flex align-items-center gap-1 text-secondary style-small">
                        <Mail size={12} />
                        <span>{lead.email}</span>
                      </div>
                      {lead.phone && <div className="text-muted style-small">{lead.phone}</div>}
                    </td>
                    <td>
                      <div className="fw-semibold text-dark">${Number(lead.requested_coverage).toLocaleString()}</div>
                      <div className="text-muted style-small">{lead.requested_policy_term} yrs · ${lead.monthly_budget}/mo</div>
                    </td>
                    <td>
                      <span className={`badge badge-status-${lead.status.toLowerCase()}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td>
                      {lead.advisor_first_name ? (
                        <div className="fw-medium text-dark style-small">
                          {lead.advisor_first_name} {lead.advisor_last_name}
                        </div>
                      ) : (
                        <span className="badge badge-unassigned">Unassigned</span>
                      )}
                    </td>
                    <td className="text-secondary style-small">
                      {new Date(lead.created_at).toLocaleDateString()}
                    </td>
                    <td className="text-end">
                      <button
                        className="btn btn-sm btn-outline-primary rounded-pill px-3 py-1 style-small"
                        onClick={() => handleOpenDetail(lead.id)}
                      >
                        <Eye size={14} className="me-1" /> View & Match
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Lead Modal */}
      <AddLeadModal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleCreateLead}
        formData={newLeadForm}
        setFormData={setNewLeadForm}
        advisors={advisors}
        plans={plans}
      />

      {/* Lead Detail & Smart Recommendation Matching Modal */}
      <LeadDetailModal
        show={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        leadDetail={leadDetail}
        advisors={advisors}
        isAdmin={isAdmin}
        statuses={statuses}
        onStatusChange={handleStatusChange}
        onAssignAdvisor={handleAssignAdvisor}
        onAddNote={handleAddNote}
        newNote={newNote}
        setNewNote={setNewNote}
        noteSubmitting={noteSubmitting}
      />
    </div>
  );
};

export default LeadsView;
