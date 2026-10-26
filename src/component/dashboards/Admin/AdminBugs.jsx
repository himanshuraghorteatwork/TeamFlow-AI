import React, { useEffect, useMemo, useState } from "react";
import {
  Bug,
  Search,
  Plus,
  Filter,
  Download,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Pencil,
  Trash2,
  ChevronDown,
  X,
  User,
  Check,
  Eye,
} from "lucide-react";

import AdminSidebar from "./AdminSidebar.jsx";
import AdminTopbar from "./AdminTopbar.jsx";
import "./AdminBugs.css";

const STORAGE_KEY = "teamflow_admin_bugs";

const SEVERITIES = ["Critical", "High", "Medium", "Low"];
const BUG_STATUSES = ["Open", "In Progress", "In Review", "Resolved", "Closed"];

const initialBugs = [
  {
    id: 1,
    title: "OAuth 2.0 Token Refresh Failure on Mobile Safari",
    project: "Backend API",
    severity: "Critical",
    status: "In Progress",
    reporter: "Amit Sharma",
    assignee: "Rahul Sharma",
    dueDate: "2026-10-28",
    createdAt: "2026-10-24",
    description: "JWT session fails to refresh after 30 minutes of inactivity on iOS devices.",
  },
  {
    id: 2,
    title: "Memory leak in real-time notification socket listener",
    project: "TeamFlow AI Web",
    severity: "High",
    status: "Open",
    reporter: "Sarah Chen",
    assignee: "Abhishek Verma",
    dueDate: "2026-10-30",
    createdAt: "2026-10-23",
    description: "Component unmount does not cleanly unsubscribe WebSocket channels.",
  },
  {
    id: 3,
    title: "Kanban board drag-and-drop ghost element on Firefox",
    project: "Frontend Portal",
    severity: "Medium",
    status: "In Review",
    reporter: "Emily Parker",
    assignee: "Sneha Gupta",
    dueDate: "2026-11-02",
    createdAt: "2026-10-22",
    description: "Cards leave temporary transparent clones when dragged rapidly across columns.",
  },
  {
    id: 4,
    title: "Storage quota percentage calculation NaN when quota is 0",
    project: "Organization Hub",
    severity: "Low",
    status: "Resolved",
    reporter: "David Lee",
    assignee: "Amit Sharma",
    dueDate: "2026-10-21",
    createdAt: "2026-10-20",
    description: "Division by zero guard was missing in initial quota calculator.",
  },
];

const loadBugs = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {}
  return initialBugs;
};

export default function AdminBugs() {
  const [bugs, setBugs] = useState(loadBugs);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Filters
  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  // Modals
  const [showModal, setShowModal] = useState(false);
  const [editingBug, setEditingBug] = useState(null);
  const [viewingBug, setViewingBug] = useState(null);
  const [toast, setToast] = useState(null);

  // Form State
  const [form, setForm] = useState({
    title: "",
    project: "TeamFlow AI Web",
    severity: "High",
    status: "Open",
    reporter: "Amit Sharma",
    assignee: "Rahul Sharma",
    dueDate: "2026-11-15",
    description: "",
  });

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const showToast = (message, type = "success") => setToast({ message, type });

  const saveBugs = (newBugs) => {
    setBugs(newBugs);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newBugs));
    } catch (e) {}
    window.dispatchEvent(new Event("teamflow_data_update"));
  };

  const filteredBugs = useMemo(() => {
    return bugs.filter((b) => {
      const term = search.trim().toLowerCase();
      const matchesSearch =
        !term ||
        b.title?.toLowerCase().includes(term) ||
        b.project?.toLowerCase().includes(term) ||
        b.assignee?.toLowerCase().includes(term);

      const matchesSeverity = severityFilter === "All" || b.severity === severityFilter;
      const matchesStatus = statusFilter === "All" || b.status === statusFilter;

      return matchesSearch && matchesSeverity && matchesStatus;
    });
  }, [bugs, search, severityFilter, statusFilter]);

  const stats = useMemo(() => {
    const total = bugs.length;
    const critical = bugs.filter((b) => b.severity === "Critical" && b.status !== "Closed" && b.status !== "Resolved").length;
    const inProgress = bugs.filter((b) => b.status === "In Progress" || b.status === "In Review").length;
    const resolved = bugs.filter((b) => b.status === "Resolved" || b.status === "Closed").length;
    return { total, critical, inProgress, resolved };
  }, [bugs]);

  const openCreateModal = () => {
    setEditingBug(null);
    setForm({
      title: "",
      project: "TeamFlow AI Web",
      severity: "High",
      status: "Open",
      reporter: "Amit Sharma",
      assignee: "Rahul Sharma",
      dueDate: "2026-11-15",
      description: "",
    });
    setShowModal(true);
  };

  const openEditModal = (b) => {
    setEditingBug(b);
    setForm({
      title: b.title || "",
      project: b.project || "TeamFlow AI Web",
      severity: b.severity || "High",
      status: b.status || "Open",
      reporter: b.reporter || "Amit Sharma",
      assignee: b.assignee || "",
      dueDate: b.dueDate || "",
      description: b.description || "",
    });
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      alert("Bug title is required.");
      return;
    }

    if (editingBug) {
      const updated = bugs.map((b) =>
        b.id === editingBug.id ? { ...b, ...form } : b
      );
      saveBugs(updated);
      showToast("Bug ticket updated.");
    } else {
      const newBug = {
        id: Date.now(),
        ...form,
        createdAt: new Date().toISOString().split("T")[0],
      };
      saveBugs([newBug, ...bugs]);
      showToast("Bug ticket filed successfully.");
    }
    setShowModal(false);
  };

  const resolveBug = (id) => {
    const updated = bugs.map((b) =>
      b.id === id ? { ...b, status: "Resolved" } : b
    );
    saveBugs(updated);
    showToast("Bug marked as Resolved.");
  };

  const deleteBug = (id) => {
    const confirmed = window.confirm("Delete this bug ticket?");
    if (!confirmed) return;
    saveBugs(bugs.filter((b) => b.id !== id));
    showToast("Bug ticket removed.");
  };

  return (
    <div className="admin-bugs-app">
      <AdminSidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="admin-bugs-main">
        <AdminTopbar onMobileMenuToggle={() => setMobileOpen(true)} />

        {toast && (
          <div className={`admin-bugs-toast toast--${toast.type}`}>
            <CheckCircle2 size={16} />
            <span>{toast.message}</span>
          </div>
        )}

        <main className="admin-bugs-content">
          <section className="admin-bugs-heading">
            <div>
              <h1>Bug & Issue Tracking</h1>
              <p>Monitor critical regressions, triage software exceptions, and allocate fixes to engineering squads.</p>
            </div>

            <button type="button" className="btn-primary" onClick={openCreateModal}>
              <Plus size={17} />
              <span>Report Bug</span>
            </button>
          </section>

          {/* STATS */}
          <section className="admin-bugs-stats">
            <StatCard icon={<Bug size={22} />} title="Total Issues" value={stats.total} type="purple" desc="Reported tickets" />
            <StatCard icon={<AlertTriangle size={22} />} title="Critical Bugs" value={stats.critical} type="red" desc="High priority blockers" />
            <StatCard icon={<Clock size={22} />} title="In Triage & Fix" value={stats.inProgress} type="blue" desc="Currently investigated" />
            <StatCard icon={<CheckCircle2 size={22} />} title="Resolved / Closed" value={stats.resolved} type="green" desc="Shipped patches" />
          </section>

          {/* TOOLBAR */}
          <section className="admin-bugs-toolbar">
            <div className="admin-bugs-search">
              <Search size={17} />
              <input
                type="text"
                placeholder="Search issues by title, project, or assignee..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button type="button" className="clear-btn" onClick={() => setSearch("")}><X size={14} /></button>
              )}
            </div>

            <div className="admin-bugs-controls">
              <select value={severityFilter} onChange={(e) => setSeverityFilter(e.target.value)}>
                <option value="All">All Severities</option>
                {SEVERITIES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>

              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="All">All Statuses</option>
                {BUG_STATUSES.map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>
          </section>

          {/* BUGS TABLE */}
          <div className="admin-bugs-table-wrap">
            <table className="admin-bugs-table">
              <thead>
                <tr>
                  <th>Bug Description</th>
                  <th>Project</th>
                  <th>Severity</th>
                  <th>Status</th>
                  <th>Assignee</th>
                  <th>Reported</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBugs.map((b) => (
                  <tr key={b.id}>
                    <td>
                      <div className="bug-title-cell">
                        <strong className="clickable" onClick={() => setViewingBug(b)}>{b.title}</strong>
                        <small>{b.description?.substring(0, 70)}...</small>
                      </div>
                    </td>
                    <td><span className="project-chip">{b.project}</span></td>
                    <td>
                      <span className={`severity-tag severity-${b.severity.toLowerCase()}`}>
                        {b.severity}
                      </span>
                    </td>
                    <td>
                      <span className={`status-pill status-${b.status.toLowerCase().replace(/\s+/g, "-")}`}>
                        {b.status}
                      </span>
                    </td>
                    <td>{b.assignee || "Unassigned"}</td>
                    <td>{b.createdAt || "-"}</td>
                    <td style={{ textAlign: "right" }}>
                      <div className="table-actions">
                        {b.status !== "Resolved" && (
                          <button type="button" className="action-btn resolve" title="Resolve" onClick={() => resolveBug(b.id)}>
                            <Check size={14} />
                          </button>
                        )}
                        <button type="button" className="action-btn" title="Edit" onClick={() => openEditModal(b)}>
                          <Pencil size={15} />
                        </button>
                        <button type="button" className="action-btn delete" title="Delete" onClick={() => deleteBug(b.id)}>
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {/* CREATE / EDIT MODAL */}
      {showModal && (
        <div className="modal-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}>
          <div className="modal-box">
            <div className="modal-header">
              <h2>{editingBug ? "Edit Bug Ticket" : "Report New Software Issue"}</h2>
              <button type="button" className="modal-close" onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label>Issue Title <span className="req">*</span></label>
                <input name="title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Broken authentication redirect" required />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Project</label>
                  <input name="project" value={form.project} onChange={(e) => setForm({ ...form, project: e.target.value })} placeholder="Backend API" />
                </div>
                <div className="form-group">
                  <label>Assignee</label>
                  <input name="assignee" value={form.assignee} onChange={(e) => setForm({ ...form, assignee: e.target.value })} placeholder="Rahul Sharma" />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Severity Level</label>
                  <select name="severity" value={form.severity} onChange={(e) => setForm({ ...form, severity: e.target.value })}>
                    {SEVERITIES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select name="status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                    {BUG_STATUSES.map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Steps to Reproduce / Description</label>
                <textarea rows={3} name="description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="1. Log in with SSO\n2. Click dashboard..." />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-submit">{editingBug ? "Update Ticket" : "Submit Issue"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW MODAL */}
      {viewingBug && (
        <div className="modal-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) setViewingBug(null); }}>
          <div className="modal-box">
            <div className="modal-header">
              <h2>Issue Details</h2>
              <button type="button" className="modal-close" onClick={() => setViewingBug(null)}><X size={20} /></button>
            </div>
            <div className="view-body">
              <h3>{viewingBug.title}</h3>
              <p>{viewingBug.description || "No steps provided."}</p>
              <div className="view-grid">
                <div><label>Project</label><span>{viewingBug.project}</span></div>
                <div><label>Severity</label><span>{viewingBug.severity}</span></div>
                <div><label>Status</label><span>{viewingBug.status}</span></div>
                <div><label>Assignee</label><span>{viewingBug.assignee || "Unassigned"}</span></div>
              </div>
            </div>
            <div className="modal-actions">
              <button type="button" className="btn-submit" onClick={() => setViewingBug(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon, title, value, type, desc }) {
  return (
    <div className={`admin-bugs-stat-card stat-${type}`}>
      <div className={`stat-icon ${type}`}>{icon}</div>
      <div className="stat-info">
        <span className="stat-label">{title}</span>
        <strong className="stat-value">{value}</strong>
        <small className="stat-desc">{desc}</small>
      </div>
    </div>
  );
}

