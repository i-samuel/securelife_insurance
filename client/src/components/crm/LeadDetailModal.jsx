import React from 'react';
import { Sparkles, UserCheck, CheckCircle, XCircle } from 'lucide-react';

const LeadDetailModal = ({
  show,
  onClose,
  leadDetail,
  advisors,
  isAdmin,
  statuses,
  onStatusChange,
  onAssignAdvisor,
  onAddNote,
  newNote,
  setNewNote,
  noteSubmitting,
}) => {
  if (!show || !leadDetail) return null;

  return (
    <div className="modal fade show d-block crm-modal-backdrop">
      <div className="modal-dialog modal-xl modal-dialog-scrollable">
        <div className="modal-content rounded-4 border-0">
          <div className="modal-header border-bottom">
            <div className="d-flex align-items-center gap-2">
              <h5 className="modal-title fw-bold">
                Lead Detail #{leadDetail.lead.id} — {leadDetail.lead.first_name} {leadDetail.lead.last_name}
              </h5>
              <span className={`badge badge-status-${leadDetail.lead.status.toLowerCase()}`}>
                {leadDetail.lead.status}
              </span>
            </div>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          <div className="modal-body p-4">
            <div className="row g-4">
              {/* Left Column: Lead Profile & Quick Actions */}
              <div className="col-12 col-lg-6">
                <div className="card border-0 bg-light p-3 rounded-3 mb-3">
                  <h6 className="fw-bold text-dark mb-2">Applicant Profile</h6>
                  <div className="row g-2 small">
                    <div className="col-6">
                      <span className="text-secondary">Email:</span> <strong>{leadDetail.lead.email}</strong>
                    </div>
                    <div className="col-6">
                      <span className="text-secondary">Phone:</span> <strong>{leadDetail.lead.phone || 'N/A'}</strong>
                    </div>
                    <div className="col-6">
                      <span className="text-secondary">Age:</span> <strong>{leadDetail.lead.calculated_age || 'N/A'} yrs</strong>
                    </div>
                    <div className="col-6">
                      <span className="text-secondary">Gender:</span> <strong>{leadDetail.lead.gender || 'N/A'}</strong>
                    </div>
                    <div className="col-6">
                      <span className="text-secondary">Occupation:</span> <strong>{leadDetail.lead.occupation || 'N/A'}</strong>
                    </div>
                    <div className="col-6">
                      <span className="text-secondary">Source:</span> <strong>{leadDetail.lead.source || 'Public Form'}</strong>
                    </div>
                    <div className="col-6">
                      <span className="text-secondary">Requested Coverage:</span> <strong>${Number(leadDetail.lead.requested_coverage).toLocaleString()}</strong>
                    </div>
                    <div className="col-6">
                      <span className="text-secondary">Policy Term:</span> <strong>{leadDetail.lead.requested_policy_term} yrs</strong>
                    </div>
                    <div className="col-6">
                      <span className="text-secondary">Monthly Budget:</span> <strong>${leadDetail.lead.monthly_budget} / mo</strong>
                    </div>
                  </div>
                </div>

                {/* Pipeline Status Updater */}
                <div className="card border p-3 rounded-3 mb-3">
                  <h6 className="fw-bold text-dark mb-2">Update Pipeline Status</h6>
                  <div className="d-flex flex-wrap gap-1">
                    {statuses.map((st) => (
                      <button
                        key={st}
                        className={`btn btn-sm rounded-pill style-small ${leadDetail.lead.status === st ? 'btn-primary fw-bold' : 'btn-outline-secondary'}`}
                        onClick={() => onStatusChange(st)}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Advisor Assignment */}
                {isAdmin && (
                  <div className="card border p-3 rounded-3 mb-3">
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <UserCheck size={18} className="text-primary" />
                      <h6 className="fw-bold text-dark mb-0">Assigned Advisor</h6>
                    </div>
                    <select
                      className="form-select form-select-sm"
                      value={leadDetail.lead.assigned_advisor_id || ''}
                      onChange={(e) => onAssignAdvisor(e.target.value)}
                    >
                      <option value="">Unassigned</option>
                      {advisors.map((adv) => (
                        <option key={adv.id} value={adv.id}>
                          {adv.first_name} {adv.last_name} ({adv.role_name})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Activity Trail Audit & Notes */}
                <div className="card border p-3 rounded-3">
                  <h6 className="fw-bold text-dark mb-2">Activity History & Advisor Notes</h6>
                  
                  {/* Notes Feed */}
                  <div className="mb-3" style={{ maxHeight: 180, overflowY: 'auto' }}>
                    {leadDetail.notes.length === 0 ? (
                      <div className="text-muted small">No notes added yet.</div>
                    ) : (
                      leadDetail.notes.map((n) => (
                        <div key={n.id} className="p-2 bg-white rounded border mb-2 small">
                          <div className="d-flex justify-content-between text-secondary style-small mb-1">
                            <strong>{n.author_first_name} {n.author_last_name}</strong>
                            <span>{new Date(n.created_at).toLocaleString()}</span>
                          </div>
                          <div>{n.content}</div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Add Note Form */}
                  <form onSubmit={onAddNote}>
                    <div className="input-group input-group-sm">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Add internal note..."
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        required
                      />
                      <button type="submit" className="btn btn-primary" disabled={noteSubmitting}>
                        Add Note
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              {/* Right Column: Smart Plan Recommendation Matching Engine */}
              <div className="col-12 col-lg-6">
                <div className="card border-primary p-3 h-100">
                  <div className="d-flex align-items-center gap-2 mb-3">
                    <Sparkles size={20} className="text-primary" />
                    <h6 className="fw-bold mb-0 text-primary">Smart Plan Recommendation Engine</h6>
                  </div>

                  <div className="d-flex flex-column gap-3 crm-recommendation-scroll-box">
                    {leadDetail.recommendations.map((rec, index) => (
                      <div key={rec.plan.id} className="border rounded-3 p-3 bg-white shadow-sm">
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadDetailModal;
