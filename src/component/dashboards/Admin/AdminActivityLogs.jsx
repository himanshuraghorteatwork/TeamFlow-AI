import React, { useEffect, useMemo, useState } from "react";
import {
  Activity,
  Search,
  Filter,
  Download,
  RotateCcw,
  Shield,
  CheckCircle2,
  AlertTriangle,
  Info,
  Clock,
  User,
  Trash2,
  ChevronDown,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  X,
  Eye,
  Plus,
  Globe,
  Server,
  Calendar,
  FileText,
  Lock,
} from "lucide-react";

import AdminSidebar from "./AdminSidebar.jsx";
import AdminTopbar from "./AdminTopbar.jsx";
import "./AdminActivityLogs.css";

const STORAGE_KEY = "teamflow_admin_activities";

const defaultActivities = [
  { id: 1, user: "Amit Sharma", role: "Org Admin", action: "Updated storage quota to 200 GB", entity: "Development Hub", ip: "192.168.1.10", severity: "info", time: "10 mins ago", fullDate: "2026-10-26 21:50:00" },
  { id: 2, user: "Sarah Chen", role: "Team Lead", action: "Created project board", entity: "Marketing Portal", ip: "104.28.19.2", severity: "success", time: "35 mins ago", fullDate: "2026-10-26 21:25:00" },
  { id: 3, user: "David Lee", role: "Admin", action: "Revoked active login session", entity: "API Service Key", ip: "172.16.0.4", severity: "warning", time: "2 hours ago", fullDate: "2026-10-26 20:00:00" },
  { id: 4, user: "System Guard", role: "Security Bot", action: "Blocked unauthorized login attempt", entity: "Auth Gateway", ip: "45.33.32.156", severity: "danger", time: "5 hours ago", fullDate: "2026-10-26 17:00:00" },
  { id: 5, user: "Emily Parker", role: "Designer", action: "Invited new team member", entity: "Design Studio", ip: "192.168.1.15", severity: "success", time: "Yesterday", fullDate: "2026-10-25 15:30:00" },
  { id: 6, user: "Amit Sharma", role: "Org Admin", action: "Modified custom role permissions", entity: "Engineering Lead", ip: "192.168.1.10", severity: "info", time: "2 days ago", fullDate: "2026-10-24 11:20:00" },
  { id: 7, user: "Michael Chang", role: "Billing Admin", action: "Upgraded subscription tier to Enterprise", entity: "Billing Portal", ip: "192.168.1.42", severity: "success", time: "3 days ago", fullDate: "2026-10-23 09:15:00" },
  { id: 8, user: "Security Watcher", role: "Audit Daemon", action: "Detected multi-geo concurrent logins", entity: "Auth Service", ip: "185.220.101.5", severity: "danger", time: "4 days ago", fullDate: "2026-10-22 14:02:00" }
];

export default function AdminActivityLogs() {
  const [logs, setLogs] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return defaultActivities;
  });

  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState("All");
  const [sortKey, setSortKey] = useState("id");
  const [sortOrder, setSortOrder] = useState("desc");
  const [toast, setToast] = useState(null);

  // Modals
  const [viewingLog, setViewingLog] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newLogData, setNewLogData] = useState({
    user: "Amit Sharma",
    role: "Org Admin",
    action: "",
    entity: "",
    ip: "192.168.1.10",
    severity: "info",
  });

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const showToast = (message) => setToast(message);

  const saveLogs = (newLogs) => {
    setLogs(newLogs);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newLogs));
    } catch (e) {}
  };

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const renderSortIcon = (key) => {
    if (sortKey !== key) {
      return <ArrowUpDown size={13} className="sort-icon muted" />;
    }
    return sortOrder === "asc" ? (
      <ArrowUp size={13} className="sort-icon active" />
    ) : (
      <ArrowDown size={13} className="sort-icon active" />
    );
  };

  const filteredLogs = useMemo(() => {
    return [...logs]
      .filter((l) => {
        const term = search.trim().toLowerCase();
        const matchesSearch =
          !term ||
          l.user.toLowerCase().includes(term) ||
          l.action.toLowerCase().includes(term) ||
          l.entity.toLowerCase().includes(term) ||
          l.ip.toLowerCase().includes(term);
        const matchesSeverity =
          severityFilter === "All" || l.severity === severityFilter;
        return matchesSearch && matchesSeverity;
      })
      .sort((a, b) => {
        let valA = a[sortKey];
        let valB = b[sortKey];

        if (sortKey === "id") {
          return sortOrder === "asc" ? a.id - b.id : b.id - a.id;
        }

        if (typeof valA === "string") valA = valA.toLowerCase();
        if (typeof valB === "string") valB = valB.toLowerCase();

        if (valA < valB) return sortOrder === "asc" ? -1 : 1;
        if (valA > valB) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
  }, [logs, search, severityFilter, sortKey, sortOrder]);

  const stats = useMemo(() => {
    const total = logs.length;
    const warnings = logs.filter(
      (l) => l.severity === "warning" || l.severity === "danger"
    ).length;
    const success = logs.filter((l) => l.severity === "success").length;
    return { total, warnings, success };
  }, [logs]);

  const exportCSV = () => {
    const headers = [
      "ID",
      "User",
      "Role",
      "Action",
      "Entity",
      "IP Address",
      "Severity",
      "Timestamp",
    ];
    const rows = filteredLogs.map((l) => [
      l.id,
      `"${l.user}"`,
      `"${l.role}"`,
      `"${l.action}"`,
      `"${l.entity}"`,
      `"${l.ip}"`,
      `"${l.severity}"`,
      `"${l.time}"`,
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = `teamflow_audit_logs_${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Exported audit logs to CSV.");
  };

  const clearLogs = () => {
    const confirmed = window.confirm("Purge historical audit log records?");
    if (!confirmed) return;
    saveLogs([]);
    showToast("Audit logs purged.");
  };

  const resetDemoLogs = () => {
    saveLogs(defaultActivities);
    showToast("Reset to default sample audit records.");
  };

  const handleDeleteLog = (id) => {
    const next = logs.filter((l) => l.id !== id);
    saveLogs(next);
    showToast("Audit log record removed.");
  };

  const handleCreateLog = (e) => {
    e.preventDefault();
    if (!newLogData.action || !newLogData.entity) {
      showToast("Please fill in Action and Resource Target.", "error");
      return;
    }
    const newEntry = {
      id: Date.now(),
      user: newLogData.user,
      role: newLogData.role,
      action: newLogData.action,
      entity: newLogData.entity,
      ip: newLogData.ip || "127.0.0.1",
      severity: newLogData.severity,
      time: "Just now",
      fullDate: new Date().toISOString().replace("T", " ").substring(0, 19),
    };
    saveLogs([newEntry, ...logs]);
    setShowCreateModal(false);
    setNewLogData({
      user: "Amit Sharma",
      role: "Org Admin",
      action: "",
      entity: "",
      ip: "192.168.1.10",
      severity: "info",
    });
    showToast("Recorded new audit log event.");
  };

  return (
    <div className="admin-logs-app">
      <AdminSidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="admin-logs-main">
        <AdminTopbar onMobileMenuToggle={() => setMobileOpen(true)} />

        {toast && (
          <div className="admin-logs-toast">
            <CheckCircle2 size={16} />
            <span>{toast}</span>
          </div>
        )}

        <main className="admin-logs-content">
          <section className="admin-logs-heading">
            <div>
              <span className="admin-logs-breadcrumb">Security & Telemetry</span>
              <h1>Organizational Activity & Audit Trail</h1>
              <p>
                Comprehensive security logging, administrator actions, data
                mutations, and access telemetry.
              </p>
            </div>

            <div className="admin-logs-actions">
              <button
                type="button"
                className="btn-create"
                onClick={() => setShowCreateModal(true)}
              >
                <Plus size={15} />
                <span>Record Event</span>
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={exportCSV}
              >
                <Download size={15} />
                <span>Export Audit CSV</span>
              </button>
            </div>
          </section>

          {/* STATS */}
          <section className="admin-logs-stats">
            <div className="log-stat-card">
              <Activity size={22} className="stat-icon purple" />
              <div>
                <span>Total Audit Records</span>
                <strong>{stats.total} Events</strong>
              </div>
            </div>
            <div className="log-stat-card">
              <CheckCircle2 size={22} className="stat-icon green" />
              <div>
                <span>Successful Operations</span>
                <strong>{stats.success} Events</strong>
              </div>
            </div>
            <div className="log-stat-card">
              <AlertTriangle size={22} className="stat-icon amber" />
              <div>
                <span>Security Warnings & Flags</span>
                <strong>{stats.warnings} Events</strong>
              </div>
            </div>
          </section>

          {/* SAAS TOOLBAR */}
          <section className="admin-logs-toolbar">
            <div className="admin-logs-search">
              <Search size={16} />
              <input
                type="text"
                placeholder="Search audit trail by user, action, IP, or resource..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="admin-logs-controls">
              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                aria-label="Filter by severity"
              >
                <option value="All">All Severities</option>
                <option value="info">Info</option>
                <option value="success">Success</option>
                <option value="warning">Warning</option>
                <option value="danger">Critical / Blocked</option>
              </select>

              <select
                value={`${sortKey}-${sortOrder}`}
                onChange={(e) => {
                  const [k, ord] = e.target.value.split("-");
                  setSortKey(k);
                  setSortOrder(ord);
                }}
                aria-label="Sort activity logs"
              >
                <option value="id-desc">Sort: Newest First</option>
                <option value="id-asc">Sort: Oldest First</option>
                <option value="user-asc">Sort: Actor (A to Z)</option>
                <option value="user-desc">Sort: Actor (Z to A)</option>
                <option value="severity-asc">Sort: Severity</option>
                <option value="entity-asc">Sort: Resource Target</option>
              </select>

              {(search || severityFilter !== "All") && (
                <button
                  type="button"
                  className="clear-filters-btn"
                  onClick={() => {
                    setSearch("");
                    setSeverityFilter("All");
                  }}
                >
                  <X size={13} />
                  Clear Filters
                </button>
              )}

              <button
                type="button"
                className="btn-purge"
                onClick={clearLogs}
                title="Purge all audit logs"
              >
                <Trash2 size={14} />
                <span>Purge Records</span>
              </button>
            </div>
          </section>

          {/* TABLE COUNT & RESET BAR */}
          <div className="admin-logs-meta-bar">
            <span>Showing {filteredLogs.length} of {logs.length} audit records</span>
            {logs.length < defaultActivities.length && (
              <button type="button" className="reset-demo-link" onClick={resetDemoLogs}>
                <RotateCcw size={13} />
                Reset Sample Data
              </button>
            )}
          </div>

          {/* TABLE */}
          <div className="admin-logs-table-wrap">
            <table className="admin-logs-table">
              <thead>
                <tr>
                  <th style={{ width: 48, textAlign: "center" }}>#</th>
                  <th className="sortable-th" onClick={() => handleSort("user")}>
                    <div className="th-content">
                      <span>ACTOR / USER</span>
                      {renderSortIcon("user")}
                    </div>
                  </th>
                  <th className="sortable-th" onClick={() => handleSort("action")}>
                    <div className="th-content">
                      <span>ACTION DETAILS</span>
                      {renderSortIcon("action")}
                    </div>
                  </th>
                  <th className="sortable-th" onClick={() => handleSort("entity")}>
                    <div className="th-content">
                      <span>RESOURCE TARGET</span>
                      {renderSortIcon("entity")}
                    </div>
                  </th>
                  <th className="sortable-th" onClick={() => handleSort("ip")}>
                    <div className="th-content">
                      <span>IP ADDRESS</span>
                      {renderSortIcon("ip")}
                    </div>
                  </th>
                  <th className="sortable-th" onClick={() => handleSort("severity")}>
                    <div className="th-content">
                      <span>SEVERITY</span>
                      {renderSortIcon("severity")}
                    </div>
                  </th>
                  <th className="sortable-th" onClick={() => handleSort("id")}>
                    <div className="th-content">
                      <span>TIMESTAMP</span>
                      {renderSortIcon("id")}
                    </div>
                  </th>
                  <th style={{ textAlign: "right" }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ textAlign: "center", padding: "48px 20px" }}>
                      <Activity size={36} style={{ color: "#94a3b8", marginBottom: 8 }} />
                      <p style={{ margin: 0, fontWeight: 600, color: "#64748b" }}>
                        No audit events match your filter criteria.
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((l, idx) => (
                    <tr key={l.id}>
                      <td style={{ textAlign: "center" }}>
                        <span className="admin-row-num">{idx + 1}</span>
                      </td>
                      <td>
                        <div className="actor-cell">
                          <div className="actor-avatar">
                            {(l.user || "U").charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <strong>{l.user}</strong>
                            <small>{l.role}</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="action-text-cell">
                          <span>{l.action}</span>
                        </div>
                      </td>
                      <td>
                        <span className="entity-chip">{l.entity}</span>
                      </td>
                      <td>
                        <code className="ip-code">{l.ip}</code>
                      </td>
                      <td>
                        <span className={`log-severity-pill ${l.severity}`}>
                          {l.severity}
                        </span>
                      </td>
                      <td>
                        <div className="time-cell">
                          <Clock size={13} style={{ color: "#94a3b8" }} />
                          <span>{l.time}</span>
                        </div>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <div className="table-actions">
                          <button
                            type="button"
                            className="action-btn"
                            title="Inspect Event Details"
                            onClick={() => setViewingLog(l)}
                          >
                            <Eye size={15} />
                          </button>
                          <button
                            type="button"
                            className="action-btn delete"
                            title="Delete Event Record"
                            onClick={() => handleDeleteLog(l.id)}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {/* VIEW EVENT DETAILS MODAL */}
      {viewingLog && (
        <div className="admin-logs-modal-backdrop" onClick={() => setViewingLog(null)}>
          <div
            className="admin-logs-modal-box"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="admin-logs-modal-header">
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Shield size={20} style={{ color: "#6366f1" }} />
                <h3>Audit Log Event Inspection</h3>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setViewingLog(null)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="admin-logs-modal-body">
              <div className="inspection-grid">
                <div className="inspect-item">
                  <span className="label">Event ID</span>
                  <span className="value">#{viewingLog.id}</span>
                </div>
                <div className="inspect-item">
                  <span className="label">Severity Level</span>
                  <span className={`log-severity-pill ${viewingLog.severity}`}>
                    {viewingLog.severity}
                  </span>
                </div>
                <div className="inspect-item">
                  <span className="label">Actor / Initiator</span>
                  <span className="value font-bold">{viewingLog.user} ({viewingLog.role})</span>
                </div>
                <div className="inspect-item">
                  <span className="label">Origin IP</span>
                  <span className="value"><code>{viewingLog.ip}</code></span>
                </div>
                <div className="inspect-item full-width">
                  <span className="label">Resource Target</span>
                  <span className="value entity-highlight">{viewingLog.entity}</span>
                </div>
                <div className="inspect-item full-width">
                  <span className="label">Action Payload</span>
                  <div className="inspect-payload-box">{viewingLog.action}</div>
                </div>
                <div className="inspect-item">
                  <span className="label">Relative Time</span>
                  <span className="value">{viewingLog.time}</span>
                </div>
                <div className="inspect-item">
                  <span className="label">Full ISO Timestamp</span>
                  <span className="value">{viewingLog.fullDate || "2026-10-26 21:50:00"}</span>
                </div>
              </div>
            </div>

            <div className="admin-logs-modal-footer">
              <button
                type="button"
                className="btn-danger-outline"
                onClick={() => {
                  handleDeleteLog(viewingLog.id);
                  setViewingLog(null);
                }}
              >
                <Trash2 size={14} />
                Delete Record
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={() => setViewingLog(null)}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RECORD NEW EVENT MODAL */}
      {showCreateModal && (
        <div className="admin-logs-modal-backdrop" onClick={() => setShowCreateModal(false)}>
          <div
            className="admin-logs-modal-box"
            onClick={(e) => e.stopPropagation()}
          >
            <form onSubmit={handleCreateLog}>
              <div className="admin-logs-modal-header">
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Plus size={20} style={{ color: "#6366f1" }} />
                  <h3>Record Custom Audit Event</h3>
                </div>
                <button
                  type="button"
                  className="modal-close-btn"
                  onClick={() => setShowCreateModal(false)}
                >
                  <X size={18} />
                </button>
              </div>

              <div className="admin-logs-modal-body form-body">
                <div className="form-group">
                  <label>Actor Name</label>
                  <input
                    type="text"
                    required
                    value={newLogData.user}
                    onChange={(e) =>
                      setNewLogData({ ...newLogData, user: e.target.value })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Role</label>
                  <input
                    type="text"
                    required
                    value={newLogData.role}
                    onChange={(e) =>
                      setNewLogData({ ...newLogData, role: e.target.value })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Action Description</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Modified custom role permissions"
                    value={newLogData.action}
                    onChange={(e) =>
                      setNewLogData({ ...newLogData, action: e.target.value })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Resource / Target Entity</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Auth Gateway, Billing Portal"
                    value={newLogData.entity}
                    onChange={(e) =>
                      setNewLogData({ ...newLogData, entity: e.target.value })
                    }
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Severity Level</label>
                    <select
                      value={newLogData.severity}
                      onChange={(e) =>
                        setNewLogData({ ...newLogData, severity: e.target.value })
                      }
                    >
                      <option value="info">Info</option>
                      <option value="success">Success</option>
                      <option value="warning">Warning</option>
                      <option value="danger">Danger / Critical</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>IP Address</label>
                    <input
                      type="text"
                      value={newLogData.ip}
                      onChange={(e) =>
                        setNewLogData({ ...newLogData, ip: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="admin-logs-modal-footer">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Record Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
