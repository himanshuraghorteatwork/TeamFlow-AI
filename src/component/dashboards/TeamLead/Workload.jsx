import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  CalendarDays,
  ChevronDown,
  Clock3,
  Filter,
  MoreHorizontal,
  Search,
  SlidersHorizontal,
  Sparkles,
  Users,
  AlertTriangle,
  BriefcaseBusiness,
  Trash2,
} from "lucide-react";
import "./Workload.css";

const INITIAL_MEMBERS = [
  { id: 1, name: "Komal Pawar", role: "Frontend Developer", initials: "KP", tone: "purple", assigned: 8, completed: 5, inProgress: 2, overdue: 1, capacity: 90 },
  { id: 2, name: "Aarav Shah", role: "Backend Developer", initials: "AS", tone: "blue", assigned: 6, completed: 4, inProgress: 2, overdue: 0, capacity: 72 },
  { id: 3, name: "Priya Rao", role: "UI/UX Designer", initials: "PR", tone: "pink", assigned: 5, completed: 2, inProgress: 2, overdue: 1, capacity: 84 },
  { id: 4, name: "Rohan Kulkarni", role: "QA Engineer", initials: "RK", tone: "green", assigned: 4, completed: 3, inProgress: 1, overdue: 0, capacity: 55 },
  { id: 5, name: "Neha Patil", role: "Full Stack Developer", initials: "NP", tone: "orange", assigned: 7, completed: 3, inProgress: 3, overdue: 1, capacity: 96 },
];

const WORKLOAD_BARS = [
  { day: "Mon", tasks: 12 }, { day: "Tue", tasks: 18 }, { day: "Wed", tasks: 15 },
  { day: "Thu", tasks: 22 }, { day: "Fri", tasks: 17 }, { day: "Sat", tasks: 9 }, { day: "Sun", tasks: 5 },
];

function WorkloadStat({ icon: Icon, label, value, detail, trend, tone = "blue", down = false }) {
  return (
    <article className="wl-stat-card">
      <span className={`wl-stat-icon ${tone}`}><Icon size={20} /></span>
      <div className="wl-stat-content">
        <span className="wl-stat-label">{label}</span>
        <strong className="wl-stat-value">{value}</strong>
        <div className="wl-stat-foot">
          <span>{detail}</span>
          {trend && (
            <span className={`wl-trend ${down ? "down" : "up"}`}>
              {down ? <ArrowDownRight size={14} /> : <ArrowUpRight size={14} />}{trend}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

function CapacityBadge({ capacity }) {
  const state = capacity >= 90 ? "high" : capacity >= 75 ? "medium" : "healthy";
  const label = capacity >= 90 ? "Overloaded" : capacity >= 75 ? "Near capacity" : "Available";
  return <span className={`wl-capacity-badge ${state}`}>{label}</span>;
}

export default function Workload() {
  const navigate = useNavigate();
  const [members, setMembers] = useState(INITIAL_MEMBERS);
  const [search, setSearch] = useState("");
  const [capacityFilter, setCapacityFilter] = useState("All members");
  const [period, setPeriod] = useState("This week");
  const [showFilters, setShowFilters] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const confirmDeleteWorkload = () => {
    if (!deleteTarget) return;
    setMembers(prev => prev.filter(m => m.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  const filteredMembers = useMemo(() => members.filter(member => {
    const matchesSearch = `${member.name} ${member.role}`.toLowerCase().includes(search.toLowerCase().trim());
    const matchesCapacity = capacityFilter === "All members" ||
      (capacityFilter === "Overloaded" && member.capacity >= 90) ||
      (capacityFilter === "Near capacity" && member.capacity >= 75 && member.capacity < 90) ||
      (capacityFilter === "Available" && member.capacity < 75);
    return matchesSearch && matchesCapacity;
  }), [members, search, capacityFilter]);

  return (
    <div className="wl-page">
      <main className="wl-main">
        <div className="wl-page-heading">
          <div>
            <div className="wl-breadcrumb">Workspace <span>/</span> My Team</div>
            <h1>Team workload</h1>
            <p>Understand your team's capacity, task distribution, and availability.</p>
          </div>
          <div className="wl-heading-actions">
            <label className="wl-period-select">
              <CalendarDays size={16} />
              <select value={period} onChange={e => setPeriod(e.target.value)} aria-label="Workload period">
                <option>This week</option>
                <option>Last week</option>
                <option>This month</option>
              </select>
              <ChevronDown size={14} />
            </label>
            <button className="wl-secondary-button" onClick={() => setShowFilters(v => !v)}>
              <SlidersHorizontal size={16} /> Filters
            </button>
          </div>
        </div>

        <section className="wl-stats-grid" aria-label="Workload summary">
          <WorkloadStat icon={Users} label="Team members" value="5" detail="Across this workspace" tone="purple" />
          <WorkloadStat icon={BriefcaseBusiness} label="Assigned tasks" value="30" detail="8 tasks completed" trend="12%" tone="blue" />
          <WorkloadStat icon={Activity} label="Average capacity" value="79%" detail="Across all members" trend="4%" tone="green" />
          <WorkloadStat icon={AlertTriangle} label="Overloaded members" value="2" detail="Needs attention" trend="1" down tone="orange" />
        </section>

        <section className="wl-overview-grid">
          <article className="wl-card wl-chart-card">
            <div className="wl-card-header">
              <div>
                <h2>Team task activity</h2>
                <p>Tasks assigned across the week</p>
              </div>
              <button className="wl-more-button" aria-label="More chart options">
                <MoreHorizontal size={19} />
              </button>
            </div>
            <div className="wl-chart-legend">
              <span><i className="wl-legend-dot" />Tasks assigned</span>
              <span className="wl-chart-total">98 <small>total tasks</small></span>
            </div>
            <div className="wl-bar-chart" role="img" aria-label="Bar chart of tasks assigned each day of the week">
              {WORKLOAD_BARS.map(item => (
                <div className="wl-bar-column" key={item.day}>
                  <span className="wl-bar-value">{item.tasks}</span>
                  <div className="wl-bar-track">
                    <span style={{ height: `${(item.tasks / 24) * 100}%` }} />
                  </div>
                  <small>{item.day}</small>
                </div>
              ))}
            </div>
          </article>
          <article className="wl-card wl-capacity-card">
            <div className="wl-card-header">
              <div>
                <h2>Capacity overview</h2>
                <p>How your team is tracking</p>
              </div>
              <span className="wl-capacity-summary">79% avg.</span>
            </div>
            <div className="wl-capacity-scale"><span>0%</span><span>50%</span><span>100%</span></div>
            <div className="wl-capacity-list">
              {members.slice(0, 4).map(member => (
                <div className="wl-capacity-row" key={member.id}>
                  <span className={`wl-avatar ${member.tone}`}>{member.initials}</span>
                  <div className="wl-capacity-person">
                    <b>{member.name}</b>
                    <div className="wl-progress-track">
                      <span className={member.capacity >= 90 ? "danger" : member.capacity >= 75 ? "warning" : "normal"} style={{ width: `${member.capacity}%` }} />
                    </div>
                  </div>
                  <strong>{member.capacity}%</strong>
                </div>
              ))}
            </div>
            <div className="wl-capacity-note">
              <span className="wl-note-icon"><Sparkles size={16} /></span>
              <p><b>AI insight</b> Consider moving one task from Neha to Rohan to balance the team's capacity.</p>
            </div>
          </article>
        </section>

        <section className="wl-card wl-members-card">
          <div className="wl-card-header wl-members-header">
            <div>
              <h2>Member workload</h2>
              <p>Review assignments and workload status for each team member.</p>
            </div>
            <div className="wl-table-tools">
              <label className="wl-table-search">
                <Search size={15} />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search members" aria-label="Search members table" />
              </label>
              {showFilters && (
                <label className="wl-filter-select">
                  <Filter size={15} />
                  <select value={capacityFilter} onChange={e => setCapacityFilter(e.target.value)} aria-label="Filter by capacity">
                    <option>All members</option>
                    <option>Overloaded</option>
                    <option>Near capacity</option>
                    <option>Available</option>
                  </select>
                </label>
              )}
            </div>
          </div>
          <div className="wl-table-wrap">
            <table className="wl-table">
              <thead>
                <tr>
                  <th>TEAM MEMBER</th>
                  <th>ASSIGNED</th>
                  <th>COMPLETED</th>
                  <th>IN PROGRESS</th>
                  <th>OVERDUE</th>
                  <th>CAPACITY</th>
                  <th>STATUS</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.map(member => (
                  <tr key={member.id}>
                    <td>
                      <div className="wl-member-cell">
                        <span className={`wl-avatar ${member.tone}`}>{member.initials}</span>
                        <span><b>{member.name}</b><small>{member.role}</small></span>
                      </div>
                    </td>
                    <td>{member.assigned}</td>
                    <td><span className="wl-number-success">{member.completed}</span></td>
                    <td>{member.inProgress}</td>
                    <td>{member.overdue ? <span className="wl-number-danger">{member.overdue}</span> : <span className="wl-muted">—</span>}</td>
                    <td>
                      <div className="wl-table-capacity">
                        <div className="wl-progress-track">
                          <span className={member.capacity >= 90 ? "danger" : member.capacity >= 75 ? "warning" : "normal"} style={{ width: `${member.capacity}%` }} />
                        </div>
                        <span>{member.capacity}%</span>
                      </div>
                    </td>
                    <td><CapacityBadge capacity={member.capacity} /></td>
                    <td>
                      <button
                        type="button"
                        className="wl-action-btn delete tl-btn-delete"
                        title={`Remove ${member.name} from workload view`}
                        aria-label={`Remove ${member.name} from workload view`}
                        onClick={() => setDeleteTarget(member)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredMembers.length === 0 && (
                  <tr>
                    <td colSpan="8">
                      <div className="wl-empty">
                        <Users size={24} />
                        <b>No team members found</b>
                        <span>Try changing your search or filters.</span>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="wl-table-footer">
            <span>Showing <b>{filteredMembers.length}</b> of {members.length} team members</span>
            <button className="wl-link-button" onClick={() => navigate("/teamlead/team")}>
              View team directory <span>→</span>
            </button>
          </div>
        </section>
        <p className="wl-data-note">
          <Clock3 size={14} /> Sample workload data for UI preview. Connect your task and team APIs to display live metrics.
        </p>

        {/* CUSTOM CSS DELETE CONFIRMATION MODAL */}
        {deleteTarget && (
          <div
            className="tl-delete-modal-overlay"
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) setDeleteTarget(null);
            }}
          >
            <div className="tl-delete-modal-box">
              <div className="tl-delete-modal-icon-circle">
                <Trash2 size={24} />
              </div>
              <h3>Remove "{deleteTarget.name}" from Workload?</h3>
              <p>Are you sure you want to clear this workload assignment? The member will remain in the directory.</p>
              <div className="tl-delete-modal-footer">
                <button
                  type="button"
                  className="tl-btn-secondary"
                  onClick={() => setDeleteTarget(null)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="tl-btn-danger"
                  onClick={confirmDeleteWorkload}
                >
                  <Trash2 size={15} /> Remove Assignment
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
