import React, { useEffect, useMemo, useState } from "react";
import {
  Activity,
  SlidersHorizontal,
  Search,
  Download,
  RotateCcw,
  Shield,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Clock,
  Trash2,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  X,
  Eye,
  Plus,
  ChevronRight,
  HardDrive,
  Users,
  FolderKanban,
  Info,
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
  { id: 8, user: "Security Watcher", role: "Audit Daemon", action: "Detected multi-geo concurrent logins", entity: "Auth Service", ip: "185.220.101.5", severity: "danger", time: "4 days ago", fullDate: "2026-10-22 14:02:00" },
  { id: 9, user: "Priya Patel", role: "Product Manager", action: "Archived Q3 Roadmap Workspace", entity: "Product Strategy", ip: "192.168.1.28", severity: "warning", time: "4 days ago", fullDate: "2026-10-22 11:45:00" },
  { id: 10, user: "Rahul Sharma", role: "Lead Architect", action: "Rotated OAuth Client Secret tokens", entity: "API Gateway Core", ip: "172.16.2.14", severity: "info", time: "5 days ago", fullDate: "2026-10-21 16:30:00" },
  { id: 11, user: "Sneha Singh", role: "DevOps Engineer", action: "Deployed production container cluster v2.4", entity: "Kubernetes Node Pool", ip: "10.0.4.18", severity: "success", time: "5 days ago", fullDate: "2026-10-21 12:10:00" },
  { id: 12, user: "System Guard", role: "Security Bot", action: "Triggered rate-limit throttle on /auth/token", entity: "Public Gateway", ip: "89.144.20.91", severity: "danger", time: "6 days ago", fullDate: "2026-10-20 22:15:00" },
  { id: 13, user: "David Lee", role: "Admin", action: "Changed SAML SSO enforcement policy", entity: "Identity Provider", ip: "172.16.0.4", severity: "warning", time: "1 week ago", fullDate: "2026-10-19 14:20:00" },
  { id: 14, user: "Emily Parker", role: "Designer", action: "Exported design assets library", entity: "Brand Guidelines", ip: "192.168.1.15", severity: "info", time: "1 week ago", fullDate: "2026-10-19 10:05:00" },
  { id: 15, user: "Amit Sharma", role: "Org Admin", action: "Provisioned 15 new seat licenses", entity: "Organization Plan", ip: "192.168.1.10", severity: "success", time: "1 week ago", fullDate: "2026-10-18 17:40:00" },
  { id: 16, user: "Karan Mehta", role: "Security Auditor", action: "Completed quarterly penetration audit", entity: "Security Compliance", ip: "192.168.2.88", severity: "info", time: "8 days ago", fullDate: "2026-10-18 09:30:00" },
  { id: 17, user: "System Guard", role: "Security Bot", action: "Flagged brute force credential spray pattern", entity: "LDAP Connector", ip: "194.26.29.112", severity: "danger", time: "9 days ago", fullDate: "2026-10-17 03:22:00" },
  { id: 18, user: "Sarah Chen", role: "Team Lead", action: "Transferred project ownership to Design Ops", entity: "Design System v3", ip: "104.28.19.2", severity: "info", time: "10 days ago", fullDate: "2026-10-16 15:45:00" },
  { id: 19, user: "Michael Chang", role: "Billing Admin", action: "Generated annual tax compliance invoice", entity: "Finance Ledger", ip: "192.168.1.42", severity: "info", time: "11 days ago", fullDate: "2026-10-15 11:10:00" },
  { id: 20, user: "Priya Patel", role: "Product Manager", action: "Updated bug workflow escalation matrix", entity: "BugFlow Engine", ip: "192.168.1.28", severity: "success", time: "12 days ago", fullDate: "2026-10-14 16:50:00" },
  { id: 21, user: "Security Watcher", role: "Audit Daemon", action: "Blocked CORS origin anomaly from unknown host", entity: "CORS Filter", ip: "77.88.55.60", severity: "danger", time: "2 weeks ago", fullDate: "2026-10-12 18:04:00" },
  { id: 22, user: "Rahul Sharma", role: "Lead Architect", action: "Re-indexed Elasticsearch audit indices", entity: "Telemetry Store", ip: "172.16.2.14", severity: "info", time: "2 weeks ago", fullDate: "2026-10-11 13:25:00" },
  { id: 23, user: "Amit Sharma", role: "Org Admin", action: "Enabled hardware 2FA requirement for Admins", entity: "Org Security Baseline", ip: "192.168.1.10", severity: "warning", time: "2 weeks ago", fullDate: "2026-10-10 14:15:00" },
  { id: 24, user: "Sneha Singh", role: "DevOps Engineer", action: "Restored PostgreSQL standby replica snapshot", entity: "DB Cluster Primary", ip: "10.0.4.18", severity: "success", time: "3 weeks ago", fullDate: "2026-10-05 08:30:00" }
];


const formatDetailKey = (key) => {
  const keyMap = {
    workspace: "Target Workspace",
    members: "Member Allocation",
    quota: "Storage Quota",
    storageQuota: "Storage Quota",
    currentUsage: "Current Usage",
    plan: "Subscription Tier",
    tier: "Plan Tier",
    projects: "Linked Projects",
    projectsAdded: "Projects Provisioned",
    assignedOwner: "Workspace Owner",
    previousSeats: "Previous Seat Count",
    updatedSeats: "Updated Seat Count",
    previousQuota: "Previous Quota",
    newQuota: "New Quota",
    adjustment: "Quota Delta",
    previousStatus: "Previous Status",
    newStatus: "New Status",
    reason: "Operation Reason",
    synchronizedCount: "Sync Project Count",
    activeProjects: "Active Project Boards",
    status: "Lifecycle State",
    storagePreserved: "Preserved Storage",
    invitedEmail: "Invited Email Address",
    role: "Assigned Role",
    projectId: "Project Reference",
    tasksCount: "Active Task Count",
    auditedSeats: "Audited Seat Count",
    complianceStatus: "Compliance Status",
    initialProjects: "Initial Projects",
  };
  if (keyMap[key]) return keyMap[key];
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase());
};

const formatDetailValue = (key, val) => {
  if (Array.isArray(val)) {
    return (
      <div className="ws-param-pills-list">
        {val.map((item, idx) => (
          <span key={idx} className="ws-param-pill-tag">
            {item}
          </span>
        ))}
      </div>
    );
  }
  if (typeof val === "number") {
    if (key.toLowerCase().includes("quota") && !String(val).includes("GB")) {
      return `${val} GB`;
    }
    return val.toLocaleString();
  }
  if (typeof val === "boolean") {
    return val ? "Enabled" : "Disabled";
  }
  return String(val);
};

export default function AdminActivityLogs() {
  const [logs, setLogs] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // If saved logs is the old small demo set (<= 8 items), upgrade to rich 24 items dataset
          if (parsed.length <= 8 && defaultActivities.length > parsed.length) {
            return defaultActivities;
          }
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return defaultActivities;
  });

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(6);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState("All");
  const [sortKey, setSortKey] = useState("id");
  const [sortOrder, setSortOrder] = useState("desc");
  const [toast, setToast] = useState(null);

  // Modals
  const [viewingLog, setViewingLog] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPurgeModal, setShowPurgeModal] = useState(false);
  const [logToDelete, setLogToDelete] = useState(null);
  const [newLogData, setNewLogData] = useState({
    user: "Amit Sharma",
    role: "Org Admin",
    action: "",
    entity: "",
    ip: "192.168.1.10",
    severity: "info",
  });

  // Active Tab: "security" | "workspace"
  const [activeTab, setActiveTab] = useState(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get("tab") === "workspace" || window.location.hash.includes("workspace")) {
        return "workspace";
      }
    } catch {}
    return "security";
  });

  useEffect(() => {
    const handleUrlChange = () => {
      try {
        const params = new URLSearchParams(window.location.search);
        if (params.get("tab") === "workspace" || window.location.hash.includes("workspace")) {
          setActiveTab("workspace");
        }
      } catch {}
    };
    window.addEventListener("popstate", handleUrlChange);
    window.addEventListener("hashchange", handleUrlChange);
    return () => {
      window.removeEventListener("popstate", handleUrlChange);
      window.removeEventListener("hashchange", handleUrlChange);
    };
  }, []);

  // Workspace Activity & Audit Logs State (Moved from Analytics to Activity Logs)
  const WORKSPACE_STORAGE_KEY = "teamflow_admin_workspace_activities_v2";

  const [workspaceActivities, setWorkspaceActivities] = useState(() => {
    try {
      const saved = localStorage.getItem(WORKSPACE_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return initialWorkspaceActivities;
  });

  const [wsSearch, setWsSearch] = useState("");
  const [wsCategory, setWsCategory] = useState("All");
  const [wsSeverity, setWsSeverity] = useState("All");
  const [wsPage, setWsPage] = useState(1);
  const [wsPageSize, setWsPageSize] = useState(6);
  const [selectedWsDetail, setSelectedWsDetail] = useState(null);

  // Sync to local storage & listen for live updates
  useEffect(() => {
    try {
      localStorage.setItem(WORKSPACE_STORAGE_KEY, JSON.stringify(workspaceActivities));
    } catch (e) {}
  }, [workspaceActivities]);

  useEffect(() => {
    const handleStorageUpdate = () => {
      try {
        const saved = localStorage.getItem(WORKSPACE_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) setWorkspaceActivities(parsed);
        }
      } catch (e) {}
    };

    window.addEventListener("teamflow_data_update", handleStorageUpdate);
    window.addEventListener("storage", handleStorageUpdate);
    return () => {
      window.removeEventListener("teamflow_data_update", handleStorageUpdate);
      window.removeEventListener("storage", handleStorageUpdate);
    };
  }, []);

  const filteredWsActivities = useMemo(() => {
    return workspaceActivities.filter((act) => {
      const q = wsSearch.toLowerCase().trim();
      const matchesQ =
        !q ||
        (act.action || "").toLowerCase().includes(q) ||
        (act.workspace || "").toLowerCase().includes(q) ||
        (act.user || "").toLowerCase().includes(q) ||
        (act.id || "").toLowerCase().includes(q);

      const matchesCat = wsCategory === "All" || act.category === wsCategory;
      const matchesSev = wsSeverity === "All" || act.severity === wsSeverity;

      return matchesQ && matchesCat && matchesSev;
    });
  }, [workspaceActivities, wsSearch, wsCategory, wsSeverity]);

  const totalWsPages = Math.max(1, Math.ceil(filteredWsActivities.length / wsPageSize));
  const safeWsPage = Math.min(wsPage, totalWsPages);
  const paginatedWsActivities = useMemo(() => {
    const start = (safeWsPage - 1) * wsPageSize;
    return filteredWsActivities.slice(start, start + wsPageSize);
  }, [filteredWsActivities, safeWsPage, wsPageSize]);

  const getWsPageNumbers = () => {
    if (totalWsPages <= 7) {
      return Array.from({ length: totalWsPages }, (_, i) => i + 1);
    }
    if (safeWsPage <= 4) {
      return [1, 2, 3, 4, 5, "...", totalWsPages];
    }
    if (safeWsPage >= totalWsPages - 3) {
      return [1, "...", totalWsPages - 4, totalWsPages - 3, totalWsPages - 2, totalWsPages - 1, totalWsPages];
    }
    return [1, "...", safeWsPage - 1, safeWsPage, safeWsPage + 1, "...", totalWsPages];
  };

  const exportWsCSV = () => {
    const headers = ["ID", "Workspace", "Action", "Category", "Severity", "Actor", "Role", "Timestamp"];
    const rows = filteredWsActivities.map((a) => [
      `"${a.id}"`,
      `"${a.workspace}"`,
      `"${(a.action || "").replace(/"/g, '""')}"`,
      `"${a.category}"`,
      `"${a.severity}"`,
      `"${a.user}"`,
      `"${a.role}"`,
      `"${a.fullDate || a.time}"`,
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `workspace-audit-logs-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast("Exported workspace audit logs to CSV.");
  };

  // Close modals on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        if (showPurgeModal) setShowPurgeModal(false);
        else if (logToDelete) setLogToDelete(null);
        else if (viewingLog) setViewingLog(null);
        else if (showCreateModal) setShowCreateModal(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showPurgeModal, logToDelete, viewingLog, showCreateModal]);

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
    } catch {
      // ignore
    }
  };

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
    setCurrentPage(1);
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

  // Pagination calculations
  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / perPage));
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

  const paginatedLogs = useMemo(() => {
    const start = (safeCurrentPage - 1) * perPage;
    return filteredLogs.slice(start, start + perPage);
  }, [filteredLogs, safeCurrentPage, perPage]);

  const getPageNumbers = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (safeCurrentPage <= 4) {
      return [1, 2, 3, 4, 5, "...", totalPages];
    }
    if (safeCurrentPage >= totalPages - 3) {
      return [1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }
    return [1, "...", safeCurrentPage - 1, safeCurrentPage, safeCurrentPage + 1, "...", totalPages];
  };



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
    setShowPurgeModal(true);
  };

  const confirmPurgeLogs = () => {
    saveLogs([]);
    setCurrentPage(1);
    setShowPurgeModal(false);
    showToast("Historical audit logs have been purged.");
  };

  const resetDemoLogs = () => {
    saveLogs(defaultActivities);
    setCurrentPage(1);
    showToast("Reset to default sample audit records.");
  };

  const confirmDeleteSingleLog = () => {
    if (!logToDelete) return;
    const deletedId = logToDelete.id;
    const next = logs.filter((l) => l.id !== deletedId);
    saveLogs(next);
    showToast(`Audit log event #${deletedId} removed.`);
    setLogToDelete(null);
    if (viewingLog && viewingLog.id === deletedId) {
      setViewingLog(null);
    }
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
    setCurrentPage(1);
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

          {/* TAB NAVIGATION: SECURITY AUDIT vs WORKSPACE ACTIVITY LOGS */}
          <div className="admin-logs-tabs-nav">
            <button
              type="button"
              className={`logs-tab-btn ${activeTab === "security" ? "active" : ""}`}
              onClick={() => setActiveTab("security")}
            >
              <Shield size={16} />
              <span>Platform & Security Audit Logs</span>
              <span className="logs-count-pill">{logs.length}</span>
            </button>

            <button
              type="button"
              className={`logs-tab-btn ${activeTab === "workspace" ? "active" : ""}`}
              onClick={() => setActiveTab("workspace")}
            >
              <Activity size={16} />
              <span>Workspace Activity & Audit Logs</span>
              <span className="logs-count-pill live">{workspaceActivities.length}</span>
            </button>
          </div>

          {activeTab === "security" && (
            <>
            {/* Promo Card: Workspace Activity & Audit Logs Section */}
            <div className="analytics-audit-preview-card ws-logs-banner">
              <div className="preview-card-left">
                <div className="preview-icon-box">
                  <Activity size={22} />
                </div>
                <div>
                  <div className="preview-title-row">
                    <h3>Workspace Activity & Audit Logs Section</h3>
                    <span className="analytics-preview-badge">Live Audit Trail</span>
                  </div>
                  <p>
                    Tracking {workspaceActivities.length} real-time workspace lifecycle operations, storage quota customizations, member seat allocations, and project synchronizations across all organizational workspaces.
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="analytics-btn-open-section"
                onClick={() => setActiveTab("workspace")}
              >
                <span>Open Activity Logs Section</span>
                <ChevronRight size={15} />
              </button>
            </div>

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
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>

            <div className="admin-logs-controls">
              <select
                value={severityFilter}
                onChange={(e) => {
                  setSeverityFilter(e.target.value);
                  setCurrentPage(1);
                }}
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
                  setCurrentPage(1);
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
                    setCurrentPage(1);
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
            <span>
              Showing {filteredLogs.length > 0 ? (safeCurrentPage - 1) * perPage + 1 : 0} to{" "}
              {Math.min(safeCurrentPage * perPage, filteredLogs.length)} of {filteredLogs.length} filtered ({logs.length} total) audit records
            </span>
            <button
              type="button"
              className="reset-demo-link"
              onClick={resetDemoLogs}
              title="Reset to 24 default audit records"
            >
              <RotateCcw size={13} />
              Reset Sample Data
            </button>
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
                {paginatedLogs.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ textAlign: "center", padding: "48px 20px" }}>
                      <Activity size={36} style={{ color: "#94a3b8", marginBottom: 8 }} />
                      <p style={{ margin: 0, fontWeight: 600, color: "#64748b" }}>
                        No audit events match your filter criteria.
                      </p>
                    </td>
                  </tr>
                ) : (
                  paginatedLogs.map((l, idx) => {
                    const rowNumber = (currentPage - 1) * perPage + idx + 1;
                    return (
                      <tr key={l.id}>
                        <td style={{ textAlign: "center" }}>
                          <span className="admin-row-num">{rowNumber}</span>
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
                            className="action-btn action-btn--view view"
                            title="Inspect Event Details"
                            onClick={() => setViewingLog(l)}
                          >
                            <Eye size={15} />
                          </button>
                          <button
                            type="button"
                            className="action-btn action-btn--delete delete"
                            title="Delete Event Record"
                            aria-label="Delete Event Record"
                            onClick={() => setLogToDelete(l)}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION BAR */}
          {filteredLogs.length > 0 && (
            <div className="admin-logs-pagination-bar">
              <div className="admin-logs-pagination-info">
                <span>
                  Showing {(safeCurrentPage - 1) * perPage + 1} to{" "}
                  {Math.min(safeCurrentPage * perPage, filteredLogs.length)} of {filteredLogs.length} records
                </span>
                <div className="admin-logs-page-size-wrap">
                  <span>Records per page:</span>
                  <select
                    value={perPage}
                    onChange={(e) => {
                      setPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    aria-label="Records per page"
                  >
                    <option value={6}>6</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                </div>
              </div>

              <div className="admin-logs-pagination-controls">
                <button
                  type="button"
                  className="admin-logs-page-nav-btn"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={safeCurrentPage <= 1}
                >
                  Previous
                </button>
                <div className="admin-logs-page-pills">
                  {getPageNumbers().map((item, idx) =>
                    item === "..." ? (
                      <span key={`ellipsis-${idx}`} className="admin-logs-page-ellipsis">
                        ...
                      </span>
                    ) : (
                      <button
                        key={item}
                        type="button"
                        className={`admin-logs-page-num-pill ${safeCurrentPage === item ? "active" : ""}`}
                        onClick={() => setCurrentPage(item)}
                      >
                        {item}
                      </button>
                    )
                  )}
                </div>
                <button
                  type="button"
                  className="admin-logs-page-nav-btn"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={safeCurrentPage >= totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          )}
          </>
          )}

          {/* =========================================================
             TAB 2: WORKSPACE ACTIVITY & AUDIT LOGS (Moved to Activity Logs)
          ========================================================= */}
          {activeTab === "workspace" && (
            <div className="ws-activity-tab-content">
              {/* TOP BANNER */}
              <div className="analytics-audit-preview-card ws-logs-banner active-mode">
                <div className="preview-card-left">
                  <div className="preview-icon-box">
                    <Activity size={22} />
                  </div>
                  <div>
                    <div className="preview-title-row">
                      <h3>Workspace Activity & Audit Logs Section</h3>
                      <span className="analytics-preview-badge">Live Audit Trail</span>
                    </div>
                    <p>
                      Tracking {workspaceActivities.length} real-time workspace lifecycle operations, storage quota customizations, member seat allocations, and project synchronizations across all organizational workspaces.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  className="analytics-btn-export-activity"
                  onClick={exportWsCSV}
                  title="Export workspace audit logs to CSV"
                >
                  <Download size={14} />
                  <span>Export Logs CSV</span>
                </button>
              </div>

              {/* KPI STATS ROW */}
              <div className="analytics-activity-kpi-grid">
                <div className="analytics-activity-kpi-card">
                  <div className="analytics-kpi-icon-wrap purple">
                    <Activity size={18} />
                  </div>
                  <div>
                    <span className="analytics-kpi-label">Total Logged Events</span>
                    <strong className="analytics-kpi-val">{workspaceActivities.length}</strong>
                  </div>
                </div>

                <div className="analytics-activity-kpi-card">
                  <div className="analytics-kpi-icon-wrap blue">
                    <HardDrive size={18} />
                  </div>
                  <div>
                    <span className="analytics-kpi-label">Storage Quota Events</span>
                    <strong className="analytics-kpi-val">
                      {workspaceActivities.filter((a) => a.category === "Storage Quotas").length}
                    </strong>
                  </div>
                </div>

                <div className="analytics-activity-kpi-card">
                  <div className="analytics-kpi-icon-wrap green">
                    <Users size={18} />
                  </div>
                  <div>
                    <span className="analytics-kpi-label">Member Allocations</span>
                    <strong className="analytics-kpi-val">
                      {workspaceActivities.filter((a) => a.category === "Members").length}
                    </strong>
                  </div>
                </div>

                <div className="analytics-activity-kpi-card">
                  <div className="analytics-kpi-icon-wrap amber">
                    <FolderKanban size={18} />
                  </div>
                  <div>
                    <span className="analytics-kpi-label">Project Synchronizations</span>
                    <strong className="analytics-kpi-val">
                      {workspaceActivities.filter((a) => a.category === "Project Sync").length}
                    </strong>
                  </div>
                </div>
              </div>

              {/* FILTER TOOLBAR */}
              <div className="analytics-activity-toolbar">
                <div className="analytics-activity-search">
                  <Search size={16} />
                  <input
                    type="text"
                    placeholder="Search workspace audit logs by action, workspace, actor, or ID..."
                    value={wsSearch}
                    onChange={(e) => {
                      setWsSearch(e.target.value);
                      setWsPage(1);
                    }}
                  />
                  {wsSearch && (
                    <button type="button" onClick={() => setWsSearch("")} className="clear-btn">
                      <X size={13} />
                    </button>
                  )}
                </div>

                <div className="analytics-activity-filters">
                  <select
                    value={wsCategory}
                    onChange={(e) => {
                      setWsCategory(e.target.value);
                      setWsPage(1);
                    }}
                    aria-label="Filter category"
                  >
                    <option value="All">All Categories</option>
                    <option value="Storage Quotas">Storage Quotas</option>
                    <option value="Project Sync">Project Sync</option>
                    <option value="Members">Members</option>
                    <option value="Lifecycle">Lifecycle</option>
                    <option value="Plans & Tiers">Plans & Tiers</option>
                  </select>

                  <select
                    value={wsSeverity}
                    onChange={(e) => {
                      setWsSeverity(e.target.value);
                      setWsPage(1);
                    }}
                    aria-label="Filter severity"
                  >
                    <option value="All">All Severities</option>
                    <option value="success">Success</option>
                    <option value="info">Info</option>
                    <option value="warning">Warning</option>
                  </select>

                  {(wsSearch || wsCategory !== "All" || wsSeverity !== "All") && (
                    <button
                      type="button"
                      className="analytics-clear-activity-filter"
                      onClick={() => {
                        setWsSearch("");
                        setWsCategory("All");
                        setWsSeverity("All");
                        setWsPage(1);
                      }}
                    >
                      <RotateCcw size={13} />
                      <span>Reset</span>
                    </button>
                  )}
                </div>
              </div>

              {/* META INFO BAR */}
              <div className="admin-logs-meta-bar">
                <span>
                  Showing {filteredWsActivities.length > 0 ? (safeWsPage - 1) * wsPageSize + 1 : 0} to{" "}
                  {Math.min(safeWsPage * wsPageSize, filteredWsActivities.length)} of {filteredWsActivities.length} filtered ({workspaceActivities.length} total) workspace audit records
                </span>
                <button
                  type="button"
                  className="reset-demo-link"
                  onClick={() => {
                    setWorkspaceActivities(initialWorkspaceActivities);
                    setWsPage(1);
                    showToast("Reset workspace activities to default 15 records.");
                  }}
                  title="Reset to 15 default records"
                >
                  <RotateCcw size={13} />
                  Reset Sample Data
                </button>
              </div>

              {/* DATA TABLE */}
              <div className="analytics-activity-table-wrapper admin-logs-table-wrap">
                <table className="analytics-activity-table admin-logs-table">
                  <thead>
                    <tr>
                      <th style={{ width: 44, textAlign: "center" }}>#</th>
                      <th style={{ width: 140 }}>TIMESTAMP</th>
                      <th>WORKSPACE</th>
                      <th>ACTIVITY / ACTION</th>
                      <th>PERFORMED BY</th>
                      <th>CATEGORY</th>
                      <th>STATUS</th>
                      <th style={{ textAlign: "right", width: 80 }}>DETAILS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedWsActivities.map((act, idx) => (
                      <tr key={act.id}>
                        <td style={{ textAlign: "center" }}>
                          <span className="analytics-row-num">
                            {(safeWsPage - 1) * wsPageSize + idx + 1}
                          </span>
                        </td>

                        <td>
                          <div className="analytics-act-time">
                            <strong>{act.time}</strong>
                            <small>{act.fullDate?.slice(0, 10)}</small>
                          </div>
                        </td>

                        <td>
                          <div className="analytics-act-workspace-cell">
                            <span className="analytics-act-workspace-dot" />
                            <strong>{act.workspace}</strong>
                          </div>
                        </td>

                        <td>
                          <div className="analytics-act-action-cell">
                            <span>{act.action}</span>
                            {act.details?.storageQuota && (
                              <span className="analytics-act-quota-badge">
                                <HardDrive size={10} /> {act.details.storageQuota}
                              </span>
                            )}
                          </div>
                        </td>

                        <td>
                          <div className="analytics-act-actor-cell">
                            {act.avatar ? (
                              <img src={act.avatar} alt={act.user} className="analytics-act-avatar" />
                            ) : (
                              <div className="analytics-act-avatar fallback">
                                {(act.user || "A").slice(0, 2).toUpperCase()}
                              </div>
                            )}
                            <div>
                              <strong>{act.user}</strong>
                              <small>{act.role}</small>
                            </div>
                          </div>
                        </td>

                        <td>
                          <span className={`analytics-act-cat-pill cat--${(act.category || "").toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}>
                            {act.category}
                          </span>
                        </td>

                        <td>
                          <span className={`analytics-act-sev-pill sev--${act.severity}`}>
                            {act.severity === "success" && <CheckCircle2 size={11} />}
                            {act.severity === "info" && <Info size={11} />}
                            {act.severity === "warning" && <AlertTriangle size={11} />}
                            <span>{act.severity}</span>
                          </span>
                        </td>

                        <td style={{ textAlign: "right" }}>
                          <button
                            type="button"
                            className="analytics-act-detail-btn view"
                            onClick={() => setSelectedWsDetail(act)}
                            title="View activity record payload"
                          >
                            <Eye size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}

                    {paginatedWsActivities.length === 0 && (
                      <tr>
                        <td colSpan={8} className="analytics-act-empty-cell">
                          <div className="analytics-act-empty-state">
                            <Activity size={32} />
                            <h4>No workspace activity records found</h4>
                            <p>Try clearing filters or adjusting your search keyword.</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* ATTACHED ACTIVITY LOGS PAGINATION (ZERO EXTRA SPACING) */}
              {filteredWsActivities.length > 0 && (
                <div className="admin-logs-pagination-bar ws-activity-attached-pagination">
                  <div className="admin-logs-pagination-info">
                    <span>
                      Showing {(safeWsPage - 1) * wsPageSize + 1} to{" "}
                      {Math.min(safeWsPage * wsPageSize, filteredWsActivities.length)} of {filteredWsActivities.length} logs
                    </span>
                    <div className="admin-logs-page-size-wrap">
                      <span>Logs per page:</span>
                      <select
                        value={wsPageSize}
                        onChange={(e) => {
                          setWsPageSize(Number(e.target.value));
                          setWsPage(1);
                        }}
                      >
                        <option value={5}>5</option>
                        <option value={6}>6</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                      </select>
                    </div>
                  </div>

                  <div className="admin-logs-pagination-controls">
                    <button
                      type="button"
                      className="admin-logs-page-nav-btn"
                      onClick={() => setWsPage((p) => Math.max(1, p - 1))}
                      disabled={safeWsPage <= 1}
                    >
                      Previous
                    </button>

                    <div className="admin-logs-page-pills">
                      {getWsPageNumbers().map((num, i) =>
                        num === "..." ? (
                          <span key={`ellipsis-${i}`} className="admin-logs-page-ellipsis">
                            ...
                          </span>
                        ) : (
                          <button
                            key={num}
                            type="button"
                            className={`admin-logs-page-num-pill ${safeWsPage === num ? "active" : ""}`}
                            onClick={() => setWsPage(num)}
                          >
                            {num}
                          </button>
                        )
                      )}
                    </div>

                    <button
                      type="button"
                      className="admin-logs-page-nav-btn"
                      onClick={() => setWsPage((p) => Math.min(totalWsPages, p + 1))}
                      disabled={safeWsPage >= totalWsPages}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* WORKSPACE ACTIVITY DETAIL PAYLOAD MODAL */}
      {selectedWsDetail && (
        <div
          className="analytics-modal-backdrop admin-logs-modal-backdrop"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setSelectedWsDetail(null);
          }}
        >
          <div className="analytics-modal-box">
            <div className="analytics-modal-header">
              <div className="analytics-modal-header-left">
                <div className="analytics-modal-icon-badge">
                  <Activity size={20} />
                </div>
                <div>
                  <h2>Workspace Activity Detail</h2>
                  <p>Audit Reference: {selectedWsDetail.id}</p>
                </div>
              </div>
              <button
                type="button"
                className="analytics-modal-close"
                onClick={() => setSelectedWsDetail(null)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="analytics-activity-detail-body">
              <div className="analytics-act-detail-hero">
                <div>
                  <h4>{selectedWsDetail.action}</h4>
                  <small>Workspace: <strong>{selectedWsDetail.workspace}</strong></small>
                </div>
                <span className={`analytics-act-sev-pill sev--${selectedWsDetail.severity}`}>
                  {selectedWsDetail.severity}
                </span>
              </div>

              <div className="analytics-act-detail-rows">
                <div className="analytics-act-detail-row">
                  <span>Timestamp:</span>
                  <strong>{selectedWsDetail.fullDate || selectedWsDetail.time} ({selectedWsDetail.time})</strong>
                </div>
                <div className="analytics-act-detail-row">
                  <span>Event Category:</span>
                  <strong>{selectedWsDetail.category}</strong>
                </div>
                <div className="analytics-act-detail-row">
                  <span>Triggered By:</span>
                  <strong>{selectedWsDetail.user} ({selectedWsDetail.role})</strong>
                </div>
                <div className="analytics-act-detail-row">
                  <span>Origin IP:</span>
                  <strong>{selectedWsDetail.ip || "192.168.1.10"}</strong>
                </div>
              </div>

              {selectedWsDetail.details && Object.keys(selectedWsDetail.details).length > 0 && (
                <div className="ws-act-params-wrap">
                  <div className="ws-params-header">
                    <div className="ws-params-header-title">
                      <SlidersHorizontal size={13} />
                      <span>Audit Parameters & Configuration</span>
                    </div>
                    <span className="ws-params-count-badge">
                      {Object.keys(selectedWsDetail.details).length} parameters
                    </span>
                  </div>

                  <div className="ws-params-grid">
                    {Object.entries(selectedWsDetail.details).map(([k, v]) => (
                      <div key={k} className="ws-param-card">
                        <span className="ws-param-key">{formatDetailKey(k)}</span>
                        <div className="ws-param-val">
                          {formatDetailValue(k, v)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="analytics-modal-footer">
              <button
                type="button"
                className="analytics-btn-modal-close"
                onClick={() => setSelectedWsDetail(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

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
                  setLogToDelete(viewingLog);
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

              <div className="admin-logs-modal-footer logs-create-modal-footer">
                <button
                  type="button"
                  className="btn-cancel logs-modal-cancel-btn"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary logs-modal-submit-btn">
                  Record Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* PURGE ALL AUDIT RECORDS CONFIRMATION MODAL */}
      {showPurgeModal && (
        <div className="admin-logs-modal-backdrop" onClick={() => setShowPurgeModal(false)}>
          <div
            className="admin-logs-modal-box admin-logs-delete-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="purge-logs-title"
          >
            <div className="admin-logs-modal-header delete-modal-header">
              <div className="delete-modal-icon-badge">
                <AlertTriangle size={20} />
              </div>
              <div className="delete-modal-header-text">
                <h3 id="purge-logs-title">Purge Historical Audit Logs</h3>
                <span className="delete-modal-subtitle">Permanent Ledger Purge</span>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setShowPurgeModal(false)}
                aria-label="Close dialog"
              >
                <X size={18} />
              </button>
            </div>

            <div className="admin-logs-modal-body delete-modal-body">
              <p className="delete-modal-lead">
                Are you sure you want to purge all historical audit log records? All recorded user sessions, system mutations, and access telemetry will be cleared immediately.
              </p>

              <div className="delete-log-preview-box">
                <div className="preview-top">
                  <span className="preview-id">ALL AUDIT TRAILS</span>
                  <span className="log-severity-pill danger">Critical Scope</span>
                  <span className="preview-stat-count">{logs.length} Total Events</span>
                </div>
                <h4 className="preview-desc">Complete Activity Ledger Reset</h4>
                <div className="preview-meta">
                  <span>Warnings / High Severity: <strong>{stats.warnings}</strong></span>
                  <span>•</span>
                  <span>Normal Operations: <strong>{stats.success}</strong></span>
                </div>
              </div>

              <div className="delete-modal-alert">
                <AlertCircle size={16} />
                <span>SOC-2, ISO-27001, and HIPAA compliance policies require retaining 90+ days of audit telemetry for security verification.</span>
              </div>
            </div>

            <div className="admin-logs-modal-footer delete-modal-footer">
              <button
                type="button"
                className="admin-logs-btn-secondary"
                onClick={() => setShowPurgeModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="admin-logs-btn-danger"
                onClick={confirmPurgeLogs}
              >
                <Trash2 size={15} />
                <span>Purge All Records</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SINGLE AUDIT LOG EVENT DELETE CONFIRMATION MODAL */}
      {logToDelete && (
        <div className="admin-logs-modal-backdrop" onClick={() => setLogToDelete(null)}>
          <div
            className="admin-logs-modal-box admin-logs-delete-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-log-title"
          >
            <div className="admin-logs-modal-header delete-modal-header">
              <div className="delete-modal-icon-badge">
                <AlertTriangle size={20} />
              </div>
              <div className="delete-modal-header-text">
                <h3 id="delete-log-title">Delete Audit Log Event</h3>
                <span className="delete-modal-subtitle">Event Record #{logToDelete.id}</span>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setLogToDelete(null)}
                aria-label="Close dialog"
              >
                <X size={18} />
              </button>
            </div>

            <div className="admin-logs-modal-body delete-modal-body">
              <p className="delete-modal-lead">
                Are you sure you want to permanently delete this audit record? This event will be removed from your activity logs table.
              </p>

              <div className="delete-log-preview-box">
                <div className="preview-top">
                  <span className="preview-id">#LOG-{logToDelete.id}</span>
                  <span className={`log-severity-pill ${logToDelete.severity}`}>
                    {logToDelete.severity}
                  </span>
                  <span className="preview-time">{logToDelete.time}</span>
                </div>
                <h4 className="preview-desc">{logToDelete.action}</h4>
                <div className="preview-meta">
                  <span>Actor: <strong>{logToDelete.user}</strong> ({logToDelete.role})</span>
                  <span>•</span>
                  <span>Target: <strong>{logToDelete.entity}</strong></span>
                </div>
                <div className="preview-meta" style={{ marginTop: 6 }}>
                  <span>Origin IP: <code>{logToDelete.ip}</code></span>
                  <span>•</span>
                  <span>Timestamp: {logToDelete.fullDate || logToDelete.time}</span>
                </div>
              </div>

              <div className="delete-modal-alert">
                <AlertCircle size={16} />
                <span>Manual event deletion modifies audit ledger continuity and cannot be undone.</span>
              </div>
            </div>

            <div className="admin-logs-modal-footer delete-modal-footer">
              <button
                type="button"
                className="admin-logs-btn-secondary"
                onClick={() => setLogToDelete(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="admin-logs-btn-danger"
                onClick={confirmDeleteSingleLog}
              >
                <Trash2 size={15} />
                <span>Delete Event</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
