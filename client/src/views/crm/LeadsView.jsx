import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { Search, Filter, UserCheck, Plus, CheckCircle, XCircle, Send, Sparkles } from 'lucide-react';

const LeadsView = () => {
  const [leads, setLeads] = useState([]);
  const [advisors, setAdvisors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [advisorFilter, setAdvisorFilter] = useState('');
  
  // Selected Lead Modal details
  const [selectedLead, setSelectedLead] = useState(null);
  const [leadDetail, setLeadDetail] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [updatingAdvisor, setUpdatingAdvisor] = useState(false);
  
  // New Lead Modal state (including occupation, policy term, and gender)
  const [showAddModal, setShowAddModal] = useState(false);
  const [newLeadForm, setNewLeadForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: 'Male',
    occupation: '',
    requestedCoverage: '',
    requestedPolicyTerm: '20',
    monthlyBudget: '',
    source: 'CRM Manual Entry',
  });

  const { isAdmin } = useAuth();

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      if (search) queryParams.append('search', search);
      if (statusFilter) queryParams.append('status', statusFilter);
      if (advisorFilter) queryParams.append('advisorId', advisorFilter);

      const res = await apiFetch(`/leads?${queryParams.toString()}`);
      if (res.status === 'success') {
        setLeads(res.data.leads || []);
      }
    } catch (err) {
      console.error('Error fetching leads:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAdvisors = async () => {
    try {
      const res = await apiFetch('/users?role=ADVISOR');
      if (res.status === 'success') {
        setAdvisors(res.data.users || []);
      }
    } catch (err) {
      console.error('Error fetching advisors:', err);
    }
  };

  useEffect(() => {
    fetchLeads();
    fetchAdvisors();
  }, [search, statusFilter, advisorFilter]);

  const openLeadDetail = async (leadId) => {
    setSelectedLead(leadId);
    setModalLoading(true);
    try {
      const res = await apiFetch(`/leads/${leadId}`);
      if (res.status === 'success') {
        setLeadDetail(res.data);
      }
    } catch (err) {
      console.error('Error loading lead detail:', err);
    } finally {
      setModalLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    if (!selectedLead) return;
    setUpdatingStatus(true);
    try {
      await apiFetch(`/leads/${selectedLead}/status`, {
        method: 'PATCH',
        body: { status: newStatus },
      });
      openLeadDetail(selectedLead);
      fetchLeads();
    } catch (err) {
      alert(err.message || 'Failed to update status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleAdvisorAssign = async (newAdvisorId) => {
    if (!selectedLead) return;
    setUpdatingAdvisor(true);
    try {
      await apiFetch(`/leads/${selectedLead}/assign`, {
        method: 'PATCH',
        body: { advisorId: newAdvisorId || null },
      });
      openLeadDetail(selectedLead);
      fetchLeads();
    } catch (err) {
      alert(err.message || 'Failed to assign advisor');
    } finally {
      setUpdatingAdvisor(false);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim() || !selectedLead) return;
    try {
      await apiFetch(`/leads/${selectedLead}/notes`, {
        method: 'POST',
        body: { content: newNote },
      });
      setNewNote('');
      openLeadDetail(selectedLead);
    } catch (err) {
      alert(err.message || 'Failed to add note');
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
      setNewLeadForm({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        gender: 'Male',
        occupation: '',
        requestedCoverage: '',
        requestedPolicyTerm: '20',
        monthlyBudget: '',
        source: 'CRM Manual Entry',
      });
      fetchLeads();
    } catch (err) {
      alert(err.message || 'Failed to create lead');
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'NEW': return 'badge-status-new';
      case 'CONTACTED': return 'badge-status-contacted';
      case 'QUALIFIED': return 'badge-status-qualified';
      case 'PLAN_RECOMMENDED': return 'badge-status-proposal';
      case 'PROPOSAL': return 'badge-status-proposal';
      case 'CONVERTED': return 'badge-status-converted';
      case 'LOST': return 'badge-status-lost';
      default: return 'bg-secondary text-white';
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h4 className="fw-bold text-dark mb-1">Lead Management</h4>
          <p className="text-secondary small mb-0">Track policyholder inquiries, assign advisors, and recommend insurance plans.</p>
        </div>
        <button
          className="btn btn-primary btn-sm rounded-pill px-3 d-flex align-items-center gap-1"
          onClick={() => setShowAddModal(true)}
        >
          <Plus size={16} />
          <span>Add New Lead</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="card border-0 shadow-sm rounded-3 p-3 mb-4">
        <div className="row g-2 align-items-center">
          <div className="col-12 col-md-5">
            <div className="position-relative">
              <Search size={16} className="position-absolute text-muted" style={{ left: '12px', top: '10px' }} />
              <input
                type="text"
                className="form-control form-control-sm ps-5"
                placeholder="Search leads by name, email, phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="col-6 col-md-3">
            <div className="d-flex align-items-center gap-2">
              <Filter size={16} className="text-secondary" />
              <select
                className="form-select form-select-sm"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="NEW">New</option>
                <option value="CONTACTED">Contacted</option>
                <option value="QUALIFIED">Qualified</option>
                <option value="PLAN_RECOMMENDED">Plan Recommended</option>
                <option value="PROPOSAL">Proposal</option>
                <option value="CONVERTED">Converted</option>
                <option value="LOST">Lost</option>
              </select>
            </div>
          </div>

          <div className="col-6 col-md-4">
            <div className="d-flex align-items-center gap-2">
              <UserCheck size={16} className="text-secondary" />
              <select
                className="form-select form-select-sm"
                value={advisorFilter}
                onChange={(e) => setAdvisorFilter(e.target.value)}
              >
                <option value="">All Advisors</option>
                <option value="unassigned">Unassigned Only</option>
                {advisors.map((adv) => (
                  <option key={adv.id} value={adv.id}>
                    {adv.first_name} {adv.last_name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Leads Table */}
      <div className="card border-0 shadow-sm rounded-3">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light text-secondary small">
              <tr>
                <th>Lead Name</th>
                <th>Contact</th>
                <th>Coverage / Term</th>
                <th>Status</th>
                <th>Assigned Advisor</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-muted">
                    <div className="spinner-border spinner-border-sm text-primary me-2"></div>
                    Loading leads...
                  </td>
                </tr>
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-muted">
                    No leads found matching criteria.
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr
                    key={lead.id}
                    style={{ cursor: 'pointer' }}
                    onClick={() => openLeadDetail(lead.id)}
                  >
                    <td>
                      <div className="fw-semibold text-dark">
                        {lead.first_name} {lead.last_name}
                      </div>
                      <div className="text-muted style-small" style={{ fontSize: '0.75rem' }}>
                        Source: {lead.source || 'Website'}
                      </div>
                    </td>
                    <td>
                      <div className="small text-dark">{lead.email}</div>
                      <div className="text-muted style-small">{lead.phone || 'N/A'}</div>
                    </td>
                    <td>
                      <div className="small fw-medium">
                        {lead.requested_coverage ? `$${Number(lead.requested_coverage).toLocaleString()}` : 'Flexible'}
                      </div>
                      <div className="text-muted style-small">
                        {lead.requested_policy_term ? `${lead.requested_policy_term} yrs` : 'Term n/a'}
                      </div>
                    </td>
                    <td>
                      <span className={`badge px-2 py-1 rounded-pill ${getStatusBadgeClass(lead.status)}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td>
                      {lead.advisor_first_name ? (
                        <div className="small fw-medium text-dark">
                          {lead.advisor_first_name} {lead.advisor_last_name}
                        </div>
                      ) : (
                        <span className="badge badge-unassigned rounded-pill">Unassigned</span>
                      )}
                    </td>
                    <td className="text-secondary small">
                      {new Date(lead.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lead Detail & Smart Recommendation Modal */}
      {selectedLead && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-xl modal-dialog-scrollable">
            <div className="modal-content rounded-4 border-0">
              <div className="modal-header border-bottom">
                <h5 className="modal-title fw-bold">
                  {leadDetail?.lead ? `${leadDetail.lead.first_name} ${leadDetail.lead.last_name}` : 'Lead Details'}
                </h5>
                <button type="button" className="btn-close" onClick={() => setSelectedLead(null)}></button>
              </div>

              <div className="modal-body p-4">
                {modalLoading ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-primary"></div>
                  </div>
                ) : leadDetail ? (
                  <div className="row g-4">
                    {/* Left Column: Lead Info & Status Management */}
                    <div className="col-12 col-lg-6">
                      <div className="bg-light p-3 rounded-3 mb-3">
                        <h6 className="fw-bold mb-2">Lead Information</h6>
                        <div className="row g-2 small">
                          <div className="col-6"><strong>Email:</strong> {leadDetail.lead.email}</div>
                          <div className="col-6"><strong>Phone:</strong> {leadDetail.lead.phone || 'N/A'}</div>
                          <div className="col-6"><strong>Gender:</strong> {leadDetail.lead.gender || 'Not specified'}</div>
                          <div className="col-6"><strong>Occupation:</strong> {leadDetail.lead.occupation || 'N/A'}</div>
                          <div className="col-6"><strong>Coverage:</strong> {leadDetail.lead.requested_coverage ? `$${Number(leadDetail.lead.requested_coverage).toLocaleString()}` : 'N/A'}</div>
                          <div className="col-6"><strong>Policy Term:</strong> {leadDetail.lead.requested_policy_term ? `${leadDetail.lead.requested_policy_term} yrs` : 'N/A'}</div>
                          <div className="col-6"><strong>Monthly Budget:</strong> {leadDetail.lead.monthly_budget ? `$${leadDetail.lead.monthly_budget}/mo` : 'N/A'}</div>
                          <div className="col-6"><strong>Date of Birth:</strong> {leadDetail.lead.date_of_birth ? new Date(leadDetail.lead.date_of_birth).toLocaleDateString() : 'N/A'}</div>
                        </div>
                      </div>

                      {/* Status & Advisor Control */}
                      <div className="card p-3 border mb-3">
                        <h6 className="fw-bold mb-2">Lead Status & Advisor Pipeline</h6>
                        <div className="mb-3">
                          <label className="form-label style-small text-muted fw-semibold">Current Pipeline Status</label>
                          <select
                            className="form-select form-select-sm"
                            value={leadDetail.lead.status}
                            disabled={updatingStatus}
                            onChange={(e) => handleStatusChange(e.target.value)}
                          >
                            <option value="NEW">NEW</option>
                            <option value="CONTACTED">CONTACTED</option>
                            <option value="QUALIFIED">QUALIFIED</option>
                            <option value="PLAN_RECOMMENDED">PLAN_RECOMMENDED</option>
                            <option value="PROPOSAL">PROPOSAL</option>
                            <option value="CONVERTED">CONVERTED</option>
                            <option value="LOST">LOST</option>
                          </select>
                        </div>

                        {isAdmin && (
                          <div>
                            <label className="form-label style-small text-muted fw-semibold">Assigned Advisor</label>
                            <select
                              className="form-select form-select-sm"
                              value={leadDetail.lead.assigned_advisor_id || ''}
                              disabled={updatingAdvisor}
                              onChange={(e) => handleAdvisorAssign(e.target.value)}
                            >
                              <option value="">Unassigned</option>
                              {advisors.map((adv) => (
                                <option key={adv.id} value={adv.id}>
                                  {adv.first_name} {adv.last_name}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}
                      </div>

                      {/* Notes Section */}
                      <div className="card p-3 border">
                        <h6 className="fw-bold mb-2">Lead Notes & Timeline</h6>
                        <form onSubmit={handleAddNote} className="mb-3">
                          <div className="input-group">
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              placeholder="Add a new internal note..."
                              value={newNote}
                              onChange={(e) => setNewNote(e.target.value)}
                            />
                            <button className="btn btn-primary btn-sm" type="submit">
                              <Send size={14} />
                            </button>
                          </div>
                        </form>

                        <div className="d-flex flex-column gap-2" style={{ maxHeight: 200, overflowY: 'auto' }}>
                          {leadDetail.notes.map((note) => (
                            <div key={note.id} className="p-2 bg-light rounded small border">
                              <div className="d-flex justify-content-between text-muted style-small mb-1">
                                <strong>{note.user_first_name} {note.user_last_name}</strong>
                                <span>{new Date(note.created_at).toLocaleDateString()}</span>
                              </div>
                              <div>{note.content}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Smart Plan Recommendation Engine */}
                    <div className="col-12 col-lg-6">
                      <div className="card border-primary p-3 h-100">
                        <div className="d-flex align-items-center gap-2 mb-3">
                          <Sparkles size={20} className="text-primary" />
                          <h6 className="fw-bold mb-0 text-primary">Smart Plan Recommendation Engine</h6>
                        </div>

                        <div className="d-flex flex-column gap-3" style={{ maxHeight: 520, overflowY: 'auto' }}>
                          {leadDetail.recommendations.map((rec, index) => (
                            <div key={rec.plan.id} className="border rounded-3 p-3 bg-white">
                              <div className="d-flex align-items-center justify-content-between mb-2">
                                <div className="fw-bold text-dark">
                                  {index === 0 && '🥇 '}
                                  {index === 1 && '🥈 '}
                                  {index === 2 && '🥉 '}
                                  {rec.plan.name}
                                </div>
                                <span className={`badge ${rec.matchPercentage >= 75 ? 'bg-success' : rec.matchPercentage >= 50 ? 'bg-warning text-dark' : 'bg-secondary'}`}>
                                  {rec.matchPercentage}% Match
                                </span>
                              </div>

                              <div className="text-muted small mb-2">{rec.plan.description}</div>

                              <div className="small border-top pt-2 mt-2">
                                <div className="fw-semibold text-secondary mb-1">Eligibility Checklist:</div>
                                {rec.reasons.map((reason, idx) => (
                                  <div key={idx} className="d-flex align-items-start gap-1 style-small mb-1">
                                    {reason.passed ? (
                                      <CheckCircle size={14} className="text-success flex-shrink-0 mt-1" />
                                    ) : (
                                      <XCircle size={14} className="text-danger flex-shrink-0 mt-1" />
                                    )}
                                    <span className={reason.passed ? 'text-dark' : 'text-muted'}>
                                      {reason.message}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Lead Modal */}
      {showAddModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content rounded-4 border-0">
              <div className="modal-header border-bottom">
                <h5 className="modal-title fw-bold">Create New Lead</h5>
                <button type="button" className="btn-close" onClick={() => setShowAddModal(false)}></button>
              </div>
              <form onSubmit={handleCreateLead}>
                <div className="modal-body p-4">
                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <label className="form-label small fw-semibold">First Name *</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        required
                        value={newLeadForm.firstName}
                        onChange={(e) => setNewLeadForm({ ...newLeadForm, firstName: e.target.value })}
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Last Name *</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        required
                        value={newLeadForm.lastName}
                        onChange={(e) => setNewLeadForm({ ...newLeadForm, lastName: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Email Address *</label>
                      <input
                        type="email"
                        className="form-control form-control-sm"
                        required
                        value={newLeadForm.email}
                        onChange={(e) => setNewLeadForm({ ...newLeadForm, email: e.target.value })}
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Phone Number</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="+1 555-0199"
                        value={newLeadForm.phone}
                        onChange={(e) => setNewLeadForm({ ...newLeadForm, phone: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="row g-2 mb-3">
                    <div className="col-4">
                      <label className="form-label small fw-semibold">Date of Birth</label>
                      <input
                        type="date"
                        className="form-control form-control-sm"
                        value={newLeadForm.dateOfBirth}
                        onChange={(e) => setNewLeadForm({ ...newLeadForm, dateOfBirth: e.target.value })}
                      />
                    </div>
                    <div className="col-4">
                      <label className="form-label small fw-semibold">Gender</label>
                      <select
                        className="form-select form-select-sm"
                        value={newLeadForm.gender}
                        onChange={(e) => setNewLeadForm({ ...newLeadForm, gender: e.target.value })}
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="col-4">
                      <label className="form-label small fw-semibold">Occupation</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="e.g. Software Engineer"
                        value={newLeadForm.occupation}
                        onChange={(e) => setNewLeadForm({ ...newLeadForm, occupation: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="row g-2 mb-3">
                    <div className="col-4">
                      <label className="form-label small fw-semibold">Requested Coverage ($)</label>
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        placeholder="100000"
                        value={newLeadForm.requestedCoverage}
                        onChange={(e) => setNewLeadForm({ ...newLeadForm, requestedCoverage: e.target.value })}
                      />
                    </div>
                    <div className="col-4">
                      <label className="form-label small fw-semibold">Requested Policy Term (yrs)</label>
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        placeholder="20"
                        value={newLeadForm.requestedPolicyTerm}
                        onChange={(e) => setNewLeadForm({ ...newLeadForm, requestedPolicyTerm: e.target.value })}
                      />
                    </div>
                    <div className="col-4">
                      <label className="form-label small fw-semibold">Monthly Budget ($)</label>
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        placeholder="150"
                        value={newLeadForm.monthlyBudget}
                        onChange={(e) => setNewLeadForm({ ...newLeadForm, monthlyBudget: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="modal-footer border-top">
                  <button type="button" className="btn btn-light btn-sm" onClick={() => setShowAddModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary btn-sm px-4">Create Lead</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadsView;
