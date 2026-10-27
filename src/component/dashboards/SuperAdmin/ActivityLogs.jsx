
import { useMemo, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  Activity,
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Download,
  Eye,
  Filter,
  LogIn,
  RefreshCw,
  RotateCcw,
  Search,
  Shield,
  SlidersHorizontal,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import "./SuperAdminCommon.css";
import "./ActivityLogs.css";

const INITIAL_LOGS = [
  {
    id: "ACT-1001",
    action: "User created",
    category: "User Management",
    description: "A new user account was created.",
    actor: "Himanshu (Super Admin)",
    email: "admin@teamflow.demo",
    target: "Aarav Sharma",
    organization: "Acme Technologies",
    status: "Success",
    date: "2026-10-23T09:42:00",
    ip: "192.168.1.104",
  },
  {
    id: "ACT-1002",
    action: "Organization created",
    category: "Organization",
    description: "A new organization was registered.",
    actor: "Himanshu (Super Admin)",
    email: "admin@teamflow.demo",
    target: "Nova Solutions",
    organization: "Nova Solutions",
    status: "Success",
    date: "2026-10-23T09:15:00",
    ip: "192.168.1.104",
  },
  {
    id: "ACT-1003",
    action: "Login successful",
    category: "Authentication",
    description: "An administrator signed in successfully.",
    actor: "Priya Patel",
    email: "priya@teamflow.demo",
    target: "Admin portal",
    organization: "Acme Technologies",
    status: "Success",
    date: "2026-10-23T08:51:00",
    ip: "192.168.1.115",
  },
  {
    id: "ACT-1004",
    action: "Login failed",
    category: "Security",
    description: "A sign-in attempt was unsuccessful.",
    actor: "Unknown user",
    email: "unknown@example.demo",
    target: "Admin portal",
    organization: "Unknown",
    status: "Warning",
    date: "2026-10-23T08:34:00",
    ip: "203.0.113.42",
  },
  {
    id: "ACT-1005",
    action: "User suspended",
    category: "User Management",
    description: "A user account was suspended.",
    actor: "Himanshu (Super Admin)",
    email: "admin@teamflow.demo",
    target: "Rohan Mehta",
    organization: "Pixel Studios",
    status: "Success",
    date: "2026-10-22T17:20:00",
    ip: "192.168.1.104",
  },
  {
    id: "ACT-1006",
    action: "Organization updated",
    category: "Organization",
    description: "Organization information was modified.",
    actor: "Meera Shah",
    email: "meera@teamflow.demo",
    target: "Bright Labs",
    organization: "Bright Labs",
    status: "Success",
    date: "2026-10-22T15:12:00",
    ip: "192.168.1.120",
  },
  {
    id: "ACT-1007",
    action: "Permission changed",
    category: "Security",
    description: "A role permission was updated.",
    actor: "Himanshu (Super Admin)",
    email: "admin@teamflow.demo",
    target: "Project Manager role",
    organization: "Nova Solutions",
    status: "Warning",
    date: "2026-10-22T13:45:00",
    ip: "192.168.1.104",
  },
  {
    id: "ACT-1008",
    action: "User invited",
    category: "User Management",
    description: "An invitation was sent to a new user.",
    actor: "Priya Patel",
    email: "priya@teamflow.demo",
    target: "Karan Joshi",
    organization: "Vertex Systems",
    status: "Success",
    date: "2026-10-22T11:06:00",
    ip: "192.168.1.115",
  },
  {
    id: "ACT-1009",
    action: "Login failed",
    category: "Security",
    description: "Multiple sign-in attempts were rejected.",
    actor: "Unknown user",
    email: "attempt@example.demo",
    target: "Admin portal",
    organization: "Unknown",
    status: "Warning",
    date: "2026-10-21T19:30:00",
    ip: "203.0.113.67",
  },
  {
    id: "ACT-1010",
    action: "Organization suspended",
    category: "Organization",
    description: "Organization access was suspended.",
    actor: "Himanshu (Super Admin)",
    email: "admin@teamflow.demo",
    target: "Old Demo Workspace",
    organization: "Old Demo Workspace",
    status: "Success",
    date: "2026-10-21T14:08:00",
    ip: "192.168.1.104",
  },
  {
    id: "ACT-1011",
    action: "User role updated",
    category: "User Management",
    description: "A user's platform role was changed.",
    actor: "Meera Shah",
    email: "meera@teamflow.demo",
    target: "Aarav Sharma",
    organization: "Acme Technologies",
    status: "Success",
    date: "2026-10-20T16:21:00",
    ip: "192.168.1.120",
  },
  {
    id: "ACT-1012",
    action: "Session expired",
    category: "Authentication",
    description: "A user session expired.",
    actor: "Karan Joshi",
    email: "karan@teamflow.demo",
    target: "TeamFlow workspace",
    organization: "Vertex Systems",
    status: "Info",
    date: "2026-10-20T10:17:00",
    ip: "192.168.1.130",
  },
];

const CATEGORY_OPTIONS = [
  "All categories",
  "Authentication",
  "User Management",
  "Organization",
  "Security",
];

const getActionIcon = (action) => {
  const value = action.toLowerCase();

  if (value.includes("login") || value.includes("session")) return LogIn;
  if (value.includes("organization")) return Building2;
  if (value.includes("permission")) return Shield;
  if (value.includes("invited") || value.includes("created")) return UserPlus;
  if (value.includes("suspended")) return AlertTriangle;
  if (value.includes("user")) return Users;

  return Activity;
};

const formatDate = (value) =>
  new Date(value).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

function ActivityLogs() {
  const [logs, setLogs] = useState(INITIAL_LOGS);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All categories");
  const [status, setStatus] = useState("All statuses");
  const [dateRange, setDateRange] = useState("all");
  const [actorType, setActorType] = useState("All actors");
  const [sortField, setSortField] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [page, setPage] = useState(1);
  const [selectedLog, setSelectedLog] = useState(null);
  const [toast, setToast] = useState("");

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.body.style.overflow = selectedLog ? "hidden" : "";
    }
    return () => {
      if (typeof document !== "undefined") {
        document.body.style.overflow = "";
      }
    };
  }, [selectedLog]);

  const [pageSize, setPageSize] = useState(10);
  const [density, setDensity] = useState("standard");
  const [selectedIds, setSelectedIds] = useState(new Set());

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(new Set(pageLogs.map((l) => l.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectOne = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  const filteredLogs = useMemo(() => {
    const query = search.trim().toLowerCase();
    const now = new Date();

    let result = logs.filter((log) => {
      const matchesSearch =
        !query ||
        [
          log.id,
          log.action,
          log.description,
          log.actor,
          log.email,
          log.target,
          log.organization,
          log.ip,
        ].some((value) => value.toLowerCase().includes(query));

      const matchesCategory =
        category === "All categories" || log.category === category;

      const matchesStatus = status === "All statuses" || log.status === status;

      const matchesActorType =
        actorType === "All actors" ||
        (actorType === "Super Admin" && log.actor.includes("Super Admin")) ||
        (actorType === "Admin" && !log.actor.includes("Super Admin") && !log.actor.toLowerCase().includes("unknown")) ||
        (actorType === "Unknown" && log.actor.toLowerCase().includes("unknown"));

      const logDate = new Date(log.date);
      const daysOld = (now.getTime() - logDate.getTime()) / 86400000;

      const matchesDate =
        dateRange === "all" ||
        (dateRange === "today" && logDate.toDateString() === now.toDateString()) ||
        (dateRange === "7days" && daysOld >= 0 && daysOld <= 7) ||
        (dateRange === "30days" && daysOld >= 0 && daysOld <= 30);

      return (
        matchesSearch &&
        matchesCategory &&
        matchesStatus &&
        matchesActorType &&
        matchesDate
      );
    });

    result.sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];
      if (sortField === "date") {
        valA = new Date(valA).getTime();
        valB = new Date(valB).getTime();
      } else {
        if (typeof valA === "string") valA = valA.toLowerCase();
        if (typeof valB === "string") valB = valB.toLowerCase();
      }
      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [logs, search, category, status, actorType, dateRange, sortField, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageLogs = filteredLogs.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const stats = useMemo(
    () => ({
      total: logs.length,
      success: logs.filter((log) => log.status === "Success").length,
      warnings: logs.filter((log) => log.status === "Warning").length,
      categories: new Set(logs.map((log) => log.category)).size,
    }),
    [logs]
  );

  const showToast = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  };

  const resetFilters = () => {
    setSearch("");
    setCategory("All categories");
    setStatus("All statuses");
    setDateRange("all");
    setActorType("All actors");
    setSortField("date");
    setSortOrder("desc");
    setPage(1);
  };

  const exportCsv = () => {
    const headers = [
      "ID",
      "Action",
      "Category",
      "Description",
      "Actor",
      "Email",
      "Target",
      "Organization",
      "Status",
      "Date",
      "IP Address",
    ];

    const rows = filteredLogs.map((log) => [
      log.id,
      log.action,
      log.category,
      log.description,
      log.actor,
      log.email,
      log.target,
      log.organization,
      log.status,
      formatDate(log.date),
      log.ip,
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row
          .map((value) => `"${String(value).replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "teamflow-activity-logs.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);

    showToast("Activity logs exported successfully.");
  };

  const _clearDemoLogs = () => {
    const confirmed = window.confirm(
      "Clear all demo activity logs? This only affects this page's current demo data."
    );

    if (!confirmed) return;

    setLogs([]);
    setPage(1);
    setSelectedLog(null);
    showToast("Demo logs cleared.");
  };

  return (
    <div className="activity-logs-page">
      {/* 1. SAP Master Header Bar */}
      <section className="sap-header-panel">
        <div className="sap-header-left">
          <h1>Audit &amp; Security Activity Logs</h1>
          <p className="sap-header-subtitle">
            Immutable enterprise event feed, authentication audit trails, security warnings, and administrative action telemetry.
          </p>
        </div>

        <div className="sap-header-actions">
          <button
            type="button"
            className="sa-btn sa-btn-secondary"
            onClick={resetFilters}
          >
            <RefreshCw size={15} /> Reset Filters
          </button>

          <button
            type="button"
            className="sa-btn sa-btn-primary"
            onClick={exportCsv}
          >
            <Download size={15} /> Export Audit Log
          </button>
        </div>
      </section>

      {/* 2. Top 4 Telemetry Cards */}
      <section className="sap-kpi-grid">
        <article className="sa-kpi-card">
          <div className="sa-kpi-icon-box purple">
            <Activity size={24} strokeWidth={2.2} />
          </div>
          <div className="sa-kpi-body">
            <p className="sa-kpi-title">Total Audit Events</p>
            <div className="sa-kpi-val-row">
              <span className="sa-kpi-value">{stats.total}</span>
              <span className="sa-kpi-trend positive">Immutable</span>
            </div>
            <span className="sa-kpi-subtitle">Logged audit records</span>
          </div>
        </article>

        <article className="sa-kpi-card">
          <div className="sa-kpi-icon-box green">
            <CheckCircle2 size={24} strokeWidth={2.2} />
          </div>
          <div className="sa-kpi-body">
            <p className="sa-kpi-title">Successful Executions</p>
            <div className="sa-kpi-val-row">
              <span className="sa-kpi-value">{stats.success}</span>
              <span className="sa-kpi-trend positive">100% Verified</span>
            </div>
            <span className="sa-kpi-subtitle">Completed system operations</span>
          </div>
        </article>

        <article className="sa-kpi-card">
          <div className="sa-kpi-icon-box red">
            <AlertTriangle size={24} strokeWidth={2.2} />
          </div>
          <div className="sa-kpi-body">
            <p className="sa-kpi-title">Security Warnings</p>
            <div className="sa-kpi-val-row">
              <span className="sa-kpi-value">{stats.warnings}</span>
              <span className="sa-kpi-trend negative">Requires Action</span>
            </div>
            <span className="sa-kpi-subtitle">Failed logins &amp; overrides</span>
          </div>
        </article>

        <article className="sa-kpi-card">
          <div className="sa-kpi-icon-box sky">
            <Filter size={24} strokeWidth={2.2} />
          </div>
          <div className="sa-kpi-body">
            <p className="sa-kpi-title">Active Categories</p>
            <div className="sa-kpi-val-row">
              <span className="sa-kpi-value">{stats.categories}</span>
              <span className="sa-kpi-trend positive">Monitored</span>
            </div>
            <span className="sa-kpi-subtitle">Governance modules tracked</span>
          </div>
        </article>
      </section>

      {/* 3. The SAP Audit Data Grid Card */}
      <section className="sap-table-card">
        {/* Multi-Selection Batch Actions Bar */}
        {selectedIds.size > 0 && (
          <div className="sap-batch-banner">
            <span>
              <strong>{selectedIds.size}</strong> event records selected
            </span>
            <div className="sap-batch-actions">
              <button
                type="button"
                className="sa-btn sa-btn-secondary sa-btn-sm"
                onClick={exportCsv}
              >
                <Download size={13} /> Export Selected
              </button>
              <button
                type="button"
                className="sa-btn sa-btn-sm"
                style={{ background: "transparent", color: "inherit", border: 0 }}
                onClick={() => setSelectedIds(new Set())}
              >
                Clear
              </button>
            </div>
          </div>
        )}

        {/* Quick Category / Status Tabs */}
        <div className="sub-quick-tabs">
          {[
            { label: "All Events", count: logs.length, type: "all" },
            { label: "Successful", count: stats.success, type: "status", val: "Success" },
            { label: "Warnings", count: stats.warnings, type: "status", val: "Warning" },
            { label: "User Management", count: logs.filter((l) => l.category === "User Management").length, type: "cat", val: "User Management" },
            { label: "Authentication", count: logs.filter((l) => l.category === "Authentication").length, type: "cat", val: "Authentication" },
            { label: "Organizations", count: logs.filter((l) => l.category === "Organization").length, type: "cat", val: "Organization" },
          ].map((tab) => {
            let isActive = false;
            if (tab.type === "all") isActive = status === "All statuses" && category === "All categories";
            else if (tab.type === "status") isActive = status === tab.val;
            else if (tab.type === "cat") isActive = category === tab.val;

            return (
              <button
                key={tab.label}
                type="button"
                className={`sub-quick-tab ${isActive ? "active" : ""}`}
                onClick={() => {
                  if (tab.type === "all") {
                    setStatus("All statuses");
                    setCategory("All categories");
                  } else if (tab.type === "status") {
                    setStatus(tab.val);
                  } else if (tab.type === "cat") {
                    setCategory(tab.val);
                  }
                  setPage(1);
                }}
              >
                <span>{tab.label}</span>
                <span className="sub-quick-tab-badge">{tab.count}</span>
              </button>
            );
          })}
        </div>

        {/* Toolbar & Filter Bar */}
        <div className="sap-toolbar">
          <div className="sap-toolbar-left">
            <div className="sap-search-input">
              <Search size={15} style={{ color: "var(--sa-text-muted)" }} />
              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search event, actor, organization, IP address, ID..."
              />
            </div>

            <select
              className="sap-filter-select"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setPage(1);
              }}
            >
              {CATEGORY_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option === "All categories" ? "Category: All Categories" : option}
                </option>
              ))}
            </select>

            <select
              className="sap-filter-select"
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
            >
              <option value="All statuses">Status: All Statuses</option>
              <option value="Success">Success (Operational)</option>
              <option value="Warning">Warning (Review Needed)</option>
              <option value="Info">Info (Audit Note)</option>
            </select>

            <select
              className="sap-filter-select"
              value={dateRange}
              onChange={(e) => {
                setDateRange(e.target.value);
                setPage(1);
              }}
            >
              <option value="all">Date: All Time</option>
              <option value="today">Date: Today Only</option>
              <option value="7days">Date: Last 7 Days</option>
              <option value="30days">Date: Last 30 Days</option>
            </select>

            <select
              className="sap-filter-select"
              value={actorType}
              onChange={(e) => {
                setActorType(e.target.value);
                setPage(1);
              }}
            >
              <option value="All actors">Actor: All Actors</option>
              <option value="Super Admin">Super Admin Accounts</option>
              <option value="Admin">Tenant Admin Accounts</option>
              <option value="Unknown">Unknown / Gateway System</option>
            </select>
          </div>

          <div className="sap-toolbar-right">
            {/* Table Density Switcher */}
            <button
              type="button"
              className="sap-icon-btn"
              onClick={() => setDensity((d) => (d === "standard" ? "compact" : "standard"))}
              title={`Switch density (currently ${density})`}
            >
              <SlidersHorizontal size={15} />
            </button>

            {/* Reset Filters */}
            <button
              type="button"
              className="sap-icon-btn"
              onClick={resetFilters}
              title="Reset all filters"
            >
              <RefreshCw size={15} />
            </button>
          </div>
        </div>

        {/* 4. The SAP Table Data Grid */}
        <div className="sap-table-wrapper">
          <table className={`sap-grid is-${density}`}>
            <thead>
              <tr>
                <th style={{ width: 38, textAlign: "center" }}>
                  <input
                    type="checkbox"
                    checked={
                      pageLogs.length > 0 &&
                      pageLogs.every((l) => selectedIds.has(l.id))
                    }
                    onChange={handleSelectAll}
                  />
                </th>
                <th style={{ width: 110 }}>Log ID</th>
                <th
                  onClick={() => handleSort("action")}
                  style={{ cursor: "pointer", userSelect: "none" }}
                >
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                    Audit Event &amp; Category
                    {sortField === "action" ? (
                      sortOrder === "asc" ? <ArrowUp size={13} /> : <ArrowDown size={13} />
                    ) : (
                      <ArrowUpDown size={12} opacity={0.4} />
                    )}
                  </span>
                </th>
                <th
                  onClick={() => handleSort("actor")}
                  style={{ cursor: "pointer", userSelect: "none" }}
                >
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                    Actor &amp; Credential
                    {sortField === "actor" ? (
                      sortOrder === "asc" ? <ArrowUp size={13} /> : <ArrowDown size={13} />
                    ) : (
                      <ArrowUpDown size={12} opacity={0.4} />
                    )}
                  </span>
                </th>
                <th
                  onClick={() => handleSort("organization")}
                  style={{ cursor: "pointer", userSelect: "none" }}
                >
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                    Target &amp; Organization
                    {sortField === "organization" ? (
                      sortOrder === "asc" ? <ArrowUp size={13} /> : <ArrowDown size={13} />
                    ) : (
                      <ArrowUpDown size={12} opacity={0.4} />
                    )}
                  </span>
                </th>
                <th
                  onClick={() => handleSort("ip")}
                  style={{ cursor: "pointer", userSelect: "none" }}
                >
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                    Origin IP
                    {sortField === "ip" ? (
                      sortOrder === "asc" ? <ArrowUp size={13} /> : <ArrowDown size={13} />
                    ) : (
                      <ArrowUpDown size={12} opacity={0.4} />
                    )}
                  </span>
                </th>
                <th
                  onClick={() => handleSort("date")}
                  style={{ cursor: "pointer", userSelect: "none" }}
                >
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                    Timestamp
                    {sortField === "date" ? (
                      sortOrder === "asc" ? <ArrowUp size={13} /> : <ArrowDown size={13} />
                    ) : (
                      <ArrowUpDown size={12} opacity={0.4} />
                    )}
                  </span>
                </th>
                <th
                  onClick={() => handleSort("status")}
                  style={{ cursor: "pointer", userSelect: "none" }}
                >
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                    Result Status
                    {sortField === "status" ? (
                      sortOrder === "asc" ? <ArrowUp size={13} /> : <ArrowDown size={13} />
                    ) : (
                      <ArrowUpDown size={12} opacity={0.4} />
                    )}
                  </span>
                </th>
                <th style={{ textAlign: "right" }}>Inspect</th>
              </tr>
            </thead>

            <tbody>
              {pageLogs.map((log) => {
                const ActionIcon = getActionIcon(log.action);
                const isSelected = selectedIds.has(log.id);

                return (
                  <tr key={log.id} className={isSelected ? "is-selected" : ""}>
                    <td style={{ textAlign: "center" }}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectOne(log.id)}
                      />
                    </td>
                    <td>
                      <span className="sap-id-cell">{log.id}</span>
                    </td>
                    <td>
                      <div className="sap-user-badge">
                        <div className="sap-avatar-chip" style={{ width: 30, height: 30 }}>
                          <ActionIcon size={16} />
                        </div>
                        <div className="sap-user-info">
                          <strong className="sap-user-name">{log.action}</strong>
                          <span className="sap-user-email">{log.category}</span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div>
                        <strong style={{ fontSize: "13px", color: "var(--sa-text-primary)" }}>
                          {log.actor}
                        </strong>
                        <div style={{ fontSize: "11px", color: "var(--sa-text-muted)" }}>
                          {log.email}
                        </div>
                      </div>
                    </td>

                    <td>
                      <div>
                        <strong style={{ fontSize: "13px", color: "var(--sa-text-primary)" }}>
                          {log.target}
                        </strong>
                        <div style={{ fontSize: "11px", color: "var(--sa-text-muted)" }}>
                          {log.organization}
                        </div>
                      </div>
                    </td>

                    <td>
                      <span
                        style={{
                          fontFamily: "ui-monospace, monospace",
                          fontSize: "12px",
                          padding: "2px 7px",
                          borderRadius: "4px",
                          backgroundColor: "var(--sa-badge-bg, #f1f5f9)",
                          color: "var(--sa-text-primary, #334155)",
                          border: "1px solid var(--sa-border-subtle, #e2e8f0)",
                        }}
                      >
                        {log.ip}
                      </span>
                    </td>

                    <td>
                      <div style={{ fontSize: "12px", color: "var(--sa-text-primary)" }}>
                        {formatDate(log.date).split(",")[0]}
                      </div>
                      <small style={{ color: "var(--sa-text-muted)", fontSize: "11px" }}>
                        {formatDate(log.date).split(",").slice(1).join(",")}
                      </small>
                    </td>

                    <td>
                      <span
                        className={`sap-status-pill ${
                          log.status === "Success"
                            ? "is-active"
                            : log.status === "Warning"
                            ? "is-suspended"
                            : "is-active"
                        }`}
                      >
                        <span className="sap-status-dot" />
                        {log.status}
                      </span>
                    </td>

                    <td style={{ textAlign: "right" }}>
                      <div className="sap-action-group">
                        <button
                          type="button"
                          className="sap-icon-btn"
                          title="View event details"
                          onClick={() => setSelectedLog(log)}
                        >
                          <Eye size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {pageLogs.length === 0 && (
                <tr>
                  <td colSpan="9">
                    <div className="activity-logs-empty">
                      <CalendarDays size={27} />
                      <strong>No activity found</strong>
                      <span>Try changing your search or filter settings.</span>
                      <button type="button" onClick={resetFilters}>
                        Clear filters
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 5. The SAP Pagination Footer Bar */}
        <div className="sap-footer-bar">
          <div className="sap-footer-counts" style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div className="sap-counter">
              Showing{" "}
              <strong>
                {filteredLogs.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}
              </strong>{" "}
              to{" "}
              <strong>
                {Math.min(currentPage * pageSize, filteredLogs.length)}
              </strong>{" "}
              of <strong>{filteredLogs.length}</strong> events
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#64748b" }}>
              <span>Rows per page:</span>
              <select
                className="sap-filter-select"
                style={{ padding: "3px 6px", fontSize: 12, height: 26 }}
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>

          <div className="sap-pagination">
            <button
              type="button"
              className="sap-page-btn"
              disabled={currentPage <= 1}
              onClick={() => setPage(1)}
              title="First Page"
            >
              <ChevronsLeft size={15} />
            </button>
            <button
              type="button"
              className="sap-page-btn"
              disabled={currentPage <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              title="Previous Page"
            >
              <ChevronLeft size={15} />
            </button>
            <span className="sap-page-indicator">
              Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
            </span>
            <button
              type="button"
              className="sap-page-btn"
              disabled={currentPage >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              title="Next Page"
            >
              <ChevronRight size={15} />
            </button>
            <button
              type="button"
              className="sap-page-btn"
              disabled={currentPage >= totalPages}
              onClick={() => setPage(totalPages)}
              title="Last Page"
            >
              <ChevronsRight size={15} />
            </button>
          </div>
        </div>
      </section>

      <p className="activity-logs-disclaimer">
        <Shield size={14} />
        Demo audit records only. Real audit logging should be generated and
        stored by the backend, not by the browser.
      </p>

      {selectedLog &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="activity-logs-modal-backdrop"
            onClick={(event) => {
              if (event.target === event.currentTarget) setSelectedLog(null);
            }}
          >
            <section
              className="activity-logs-modal activity-view-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="activity-log-modal-title"
            >
              <header className="activity-view-header">
                <div className="activity-view-header-left">
                  <span className="activity-logs-modal-icon">
                    <Eye size={18} />
                  </span>
                  <div>
                    <h2 id="activity-log-modal-title">Audit Event Details</h2>
                    <p className="activity-view-id-tag">{selectedLog.id}</p>
                  </div>
                </div>

                <button
                  type="button"
                  className="activity-logs-icon-button"
                  onClick={() => setSelectedLog(null)}
                  aria-label="Close details"
                >
                  <X size={18} />
                </button>
              </header>

              <div className="activity-view-modal-body">
                {/* Event Summary Banner */}
                <div className="activity-view-summary">
                  <div className="activity-view-summary-head">
                    <span
                      className={`activity-logs-status activity-logs-status-${selectedLog.status.toLowerCase()}`}
                    >
                      <span />
                      {selectedLog.status}
                    </span>
                    <span className="activity-view-category-pill">
                      {selectedLog.category}
                    </span>
                  </div>
                  <h3>{selectedLog.action}</h3>
                  <p>{selectedLog.description}</p>
                </div>

                {/* 2-Column Structured Info Grid */}
                <div className="activity-view-grid">
                  <div className="activity-view-grid-card">
                    <span className="activity-view-label">Actor</span>
                    <strong className="activity-view-val">{selectedLog.actor}</strong>
                  </div>

                  <div className="activity-view-grid-card">
                    <span className="activity-view-label">Actor Email</span>
                    <strong className="activity-view-val">{selectedLog.email}</strong>
                  </div>

                  <div className="activity-view-grid-card">
                    <span className="activity-view-label">Organization</span>
                    <strong className="activity-view-val">{selectedLog.organization}</strong>
                  </div>

                  <div className="activity-view-grid-card">
                    <span className="activity-view-label">Target Resource</span>
                    <strong className="activity-view-val">{selectedLog.target}</strong>
                  </div>

                  <div className="activity-view-grid-card">
                    <span className="activity-view-label">Date & Time</span>
                    <strong className="activity-view-val">{formatDate(selectedLog.date)}</strong>
                  </div>

                  <div className="activity-view-grid-card">
                    <span className="activity-view-label">IP Address</span>
                    <strong className="activity-view-val">{selectedLog.ip}</strong>
                  </div>
                </div>
              </div>

              <footer className="activity-view-footer">
                <button
                  type="button"
                  onClick={() => setSelectedLog(null)}
                  className="activity-logs-button activity-logs-button-primary"
                >
                  Close Details
                </button>
              </footer>
            </section>
          </div>,
          document.body
        )}

      {toast && <div className="activity-logs-toast">{toast}</div>}
    </div>
  );
}

export default ActivityLogs;
