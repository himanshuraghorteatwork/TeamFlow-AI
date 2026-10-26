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
} from "lucide-react";

import AdminSidebar from "./AdminSidebar.jsx";
import AdminTopbar from "./AdminTopbar.jsx";
import "./AdminActivityLogs.css";

const STORAGE_KEY = "teamflow_admin_activities";

const defaultActivities = [
  { id: 1, user: "Amit Sharma", role: "Org Admin", action: "Updated storage quota to 200 GB", entity: "Development Hub", ip: "192.168.1.10", severity: "info", time: "10 mins ago" },
  { id: 2, user: "Sarah Chen", role: "Team Lead", action: "Created project board", entity: "Marketing Portal", ip: "104.28.19.2", severity: "success", time: "35 mins ago" },
  { id: 3, user: "David Lee", role: "Admin", action: "Revoked active login session", entity: "API Service Key", ip: "172.16.0.4", severity: "warning", time: "2 hours ago" },
  { id: 4, user: "System Guard", role: "Security Bot", action: "Blocked unauthorized login attempt", entity: "Auth Gateway", ip: "45.33.32.156", severity: "danger", time: "5 hours ago" },
  { id: 5, user: "Emily Parker", role: "Designer", action: "Invited new team member", entity: "Design Studio", ip: "192.168.1.15", severity: "success", time: "Yesterday" },
  { id: 6, user: "Amit Sharma", role: "Org Admin", action: "Modified custom role permissions", entity: "Engineering Lead", ip: "192.168.1.10", severity: "info", time: "2 days ago" },
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
  const [toast, setToast] = useState(null);

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

  const filteredLogs = useMemo(() => {
    return logs.filter((l) => {
      const term = search.trim().toLowerCase();
      const matchesSearch = !term || l.user.toLowerCase().includes(term) || l.action.toLowerCase().includes(term) || l.entity.toLowerCase().includes(term);
      const matchesSeverity = severityFilter === "All" || l.severity === severityFilter;
      return matchesSearch && matchesSeverity;
    });
  }, [logs, search, severityFilter]);

  const stats = useMemo(() => {
    const total = logs.length;
    const warnings = logs.filter((l) => l.severity === "warning" || l.severity === "danger").length;
    const success = logs.filter((l) => l.severity === "success").length;
    return { total, warnings, success };
  }, [logs]);

  const exportCSV = () => {
    const headers = ["ID", "User", "Role", "Action", "Entity", "IP Address", "Severity", "Timestamp"];
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
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
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
              <h1>Organizational Activity & Audit Trail</h1>
              <p>Comprehensive security logging, administrator actions, data mutations, and access telemetry.</p>
            </div>

            <div className="admin-logs-actions">
              <button type="button" className="btn-secondary" onClick={exportCSV}>
                <Download size={15} />
                <span>Export Audit CSV</span>
              </button>
            </div>
          </section>

          {/* STATS */}
          <section className="admin-logs-stats">
            <div className="log-stat-card">
              <Activity size={22} className="stat-icon purple" />
              <div><span>Total Audit Records</span><strong>{stats.total} Events</strong></div>
            </div>
            <div className="log-stat-card">
              <CheckCircle2 size={22} className="stat-icon green" />
              <div><span>Successful Mutations</span><strong>{stats.success} Events</strong></div>
            </div>
            <div className="log-stat-card">
              <AlertTriangle size={22} className="stat-icon amber" />
              <div><span>Security Warnings / Flags</span><strong>{stats.warnings} Events</strong></div>
            </div>
          </section>

          {/* TOOLBAR */}
          <section className="admin-logs-toolbar">
            <div className="admin-logs-search">
              <Search size={16} />
              <input
                type="text"
                placeholder="Search audit trail by user, action or resource..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="admin-logs-controls">
              <select value={severityFilter} onChange={(e) => setSeverityFilter(e.target.value)}>
                <option value="All">All Severities</option>
                <option value="info">Info</option>
                <option value="success">Success</option>
                <option value="warning">Warning</option>
                <option value="danger">Critical / Blocked</option>
              </select>

              <button type="button" className="btn-purge" onClick={clearLogs}>
                <Trash2 size={14} />
                <span>Purge Records</span>
              </button>
            </div>
          </section>

          {/* TABLE */}
          <div className="admin-logs-table-wrap">
            <table className="admin-logs-table">
              <thead>
                <tr>
                  <th>Actor / User</th>
                  <th>Action</th>
                  <th>Resource Target</th>
                  <th>IP Address</th>
                  <th>Severity</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((l) => (
                  <tr key={l.id}>
                    <td>
                      <div className="actor-cell">
                        <div className="actor-avatar">{(l.user || "U").charAt(0).toUpperCase()}</div>
                        <div>
                          <strong>{l.user}</strong>
                          <small>{l.role}</small>
                        </div>
                      </div>
                    </td>
                    <td>{l.action}</td>
                    <td><span className="entity-chip">{l.entity}</span></td>
                    <td><code>{l.ip}</code></td>
                    <td>
                      <span className={`log-severity-pill ${l.severity}`}>
                        {l.severity}
                      </span>
                    </td>
                    <td>{l.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}

