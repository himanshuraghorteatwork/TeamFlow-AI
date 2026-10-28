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
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Clock,
  Copy,
  Download,
  Eye,
  FileCode,
  Filter,
  Globe,
  Key,
  Layers,
  LogIn,
  RefreshCw,
  RotateCcw,
  Search,
  Shield,
  ShieldAlert,
  SlidersHorizontal,
  Terminal,
  UserCheck,
  UserPlus,
  Users,
  X,
  Zap,
} from "lucide-react";
import "./SuperAdminCommon.css";
import "./ActivityLogs.css";
import orgAvatarImg from "../../../assets/images/organization-avatar.png";

const INITIAL_LOGS = [
  {
    id: "ACT-1015",
    action: "Security policy updated",
    category: "Security",
    description: "Multi-factor authentication (MFA) enforcement enabled for all organization administrators.",
    actor: "Himanshu (Super Admin)",
    email: "admin@teamflow.demo",
    target: "MFA Policy Engine",
    organization: "Acme Technologies",
    status: "Success",
    date: "2026-10-28T10:30:00",
    ip: "192.168.1.104",
    requestId: "req_09a1f28e",
    httpStatus: "200 OK",
    userAgent: "TeamFlow-Admin/2.5 (Windows NT 10.0; Win64; x64) Chrome/128.0",
  },
  {
    id: "ACT-1014",
    action: "API Key provisioned",
    category: "AI Gateway",
    description: "New production endpoint key generated for Google Gemini 2.0 Flash inference pipeline.",
    actor: "Priya Patel",
    email: "priya@teamflow.demo",
    target: "AI Gateway Hub",
    organization: "Nova Solutions",
    status: "Success",
    date: "2026-10-28T09:15:00",
    ip: "192.168.1.115",
    requestId: "req_88c4b12a",
    httpStatus: "201 Created",
    userAgent: "TeamFlow-Admin/2.5 (macOS 15.0; arm64) Safari/18.0",
  },
  {
    id: "ACT-1013",
    action: "SuperAdmin login via 2FA",
    category: "Authentication",
    description: "Successful biometric TOTP authentication from authorized corporate subnet.",
    actor: "Himanshu (Super Admin)",
    email: "admin@teamflow.demo",
    target: "SuperAdmin Portal",
    organization: "System",
    status: "Success",
    date: "2026-10-28T08:05:00",
    ip: "192.168.1.104",
    requestId: "req_33d7a89b",
    httpStatus: "200 OK",
    userAgent: "TeamFlow-Admin/2.5 (Windows NT 10.0; Win64; x64) Chrome/128.0",
  },
  {
    id: "ACT-1012",
    action: "Session expired",
    category: "Authentication",
    description: "Idle token lifetime exceeded (120 minutes) and session was terminated cleanly.",
    actor: "Karan Joshi",
    email: "karan@teamflow.demo",
    target: "TeamFlow workspace",
    organization: "Vertex Systems",
    status: "Info",
    date: "2026-10-27T17:45:00",
    ip: "192.168.1.130",
    requestId: "req_77a8b41f",
    httpStatus: "200 OK",
    userAgent: "TeamFlow-Web/2.4 (Ubuntu 24.04; x64) Firefox/131.0",
  },
  {
    id: "ACT-1011",
    action: "User role updated",
    category: "User Management",
    description: "Tenant member promoted to Organization Administrator with billing permissions.",
    actor: "Meera Shah",
    email: "meera@teamflow.demo",
    target: "Aarav Sharma",
    organization: "Acme Technologies",
    status: "Success",
    date: "2026-10-27T14:10:00",
    ip: "192.168.1.120",
    requestId: "req_66e9a03c",
    httpStatus: "200 OK",
    userAgent: "TeamFlow-Admin/2.4 (macOS 14.5; arm64) Chrome/126.0",
  },
  {
    id: "ACT-1010",
    action: "Organization suspended",
    category: "Organization",
    description: "Tenant workspace suspended following subscription non-renewal and grace expiration.",
    actor: "Himanshu (Super Admin)",
    email: "admin@teamflow.demo",
    target: "Old Demo Workspace",
    organization: "Old Demo Workspace",
    status: "Success",
    date: "2026-10-26T16:08:00",
    ip: "192.168.1.104",
    requestId: "req_55f1c29e",
    httpStatus: "200 OK",
    userAgent: "TeamFlow-Admin/2.4 (Windows NT 10.0; Win64; x64) Chrome/126.0",
  },
  {
    id: "ACT-1009",
    action: "Login failed (Rate limit)",
    category: "Security",
    description: "Repeated invalid password attempts triggered automated rate limiting on IP.",
    actor: "Unknown user",
    email: "attempt@example.demo",
    target: "Admin portal",
    organization: "Unknown",
    status: "Warning",
    date: "2026-10-25T19:30:00",
    ip: "203.0.113.67",
    requestId: "req_44a2b910",
    httpStatus: "429 Too Many Requests",
    userAgent: "Python-urllib/3.11",
  },
  {
    id: "ACT-1008",
    action: "User invited",
    category: "User Management",
    description: "Invitation email dispatched to developer with Enterprise seat entitlement.",
    actor: "Priya Patel",
    email: "priya@teamflow.demo",
    target: "Karan Joshi",
    organization: "Vertex Systems",
    status: "Success",
    date: "2026-10-24T11:06:00",
    ip: "192.168.1.115",
    requestId: "req_33b8c471",
    httpStatus: "201 Created",
    userAgent: "TeamFlow-Admin/2.4 (macOS 14.5; arm64) Chrome/126.0",
  },
  {
    id: "ACT-1007",
    action: "Permission changed",
    category: "Security",
    description: "Custom role permissions modified: enabled access to raw deployment telemetry.",
    actor: "Himanshu (Super Admin)",
    email: "admin@teamflow.demo",
    target: "Project Manager role",
    organization: "Nova Solutions",
    status: "Warning",
    date: "2026-10-23T13:45:00",
    ip: "192.168.1.104",
    requestId: "req_22c7a109",
    httpStatus: "200 OK",
    userAgent: "TeamFlow-Admin/2.4 (Windows NT 10.0; Win64; x64) Chrome/126.0",
  },
  {
    id: "ACT-1006",
    action: "Organization updated",
    category: "Organization",
    description: "Organization domain verified and SSO SAML connection enabled.",
    actor: "Meera Shah",
    email: "meera@teamflow.demo",
    target: "Bright Labs",
    organization: "Bright Labs",
    status: "Success",
    date: "2026-10-23T15:12:00",
    ip: "192.168.1.120",
    requestId: "req_11d9f824",
    httpStatus: "200 OK",
    userAgent: "TeamFlow-Admin/2.4 (macOS 14.5; arm64) Chrome/126.0",
  },
  {
    id: "ACT-1005",
    action: "User suspended",
    category: "User Management",
    description: "User account deactivated per internal security audit request.",
    actor: "Himanshu (Super Admin)",
    email: "admin@teamflow.demo",
    target: "Rohan Mehta",
    organization: "Pixel Studios",
    status: "Success",
    date: "2026-10-22T17:20:00",
    ip: "192.168.1.104",
    requestId: "req_99e4b301",
    httpStatus: "200 OK",
    userAgent: "TeamFlow-Admin/2.4 (Windows NT 10.0; Win64; x64) Chrome/126.0",
  },
  {
    id: "ACT-1004",
    action: "Login failed (Bad credentials)",
    category: "Security",
    description: "Authentication failed due to incorrect password credential.",
    actor: "Unknown user",
    email: "unknown@example.demo",
    target: "Admin portal",
    organization: "Unknown",
    status: "Warning",
    date: "2026-10-22T08:34:00",
    ip: "203.0.113.42",
    requestId: "req_88f2a177",
    httpStatus: "401 Unauthorized",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/122.0",
  },
  {
    id: "ACT-1003",
    action: "Login successful",
    category: "Authentication",
    description: "Standard dashboard session started with valid Bearer token.",
    actor: "Priya Patel",
    email: "priya@teamflow.demo",
    target: "Admin portal",
    organization: "Acme Technologies",
    status: "Success",
    date: "2026-10-21T08:51:00",
    ip: "192.168.1.115",
    requestId: "req_77a1b942",
    httpStatus: "200 OK",
    userAgent: "TeamFlow-Admin/2.4 (macOS 14.5; arm64) Safari/17.5",
  },
  {
    id: "ACT-1002",
    action: "Organization created",
    category: "Organization",
    description: "New enterprise tenant organization workspace initialized and provisioned.",
    actor: "Himanshu (Super Admin)",
    email: "admin@teamflow.demo",
    target: "Nova Solutions",
    organization: "Nova Solutions",
    status: "Success",
    date: "2026-10-20T09:15:00",
    ip: "192.168.1.104",
    requestId: "req_66b5c108",
    httpStatus: "201 Created",
    userAgent: "TeamFlow-Admin/2.4 (Windows NT 10.0; Win64; x64) Chrome/126.0",
  },
  {
    id: "ACT-1001",
    action: "User created",
    category: "User Management",
    description: "Primary organization tenant administrator account successfully created.",
    actor: "Himanshu (Super Admin)",
    email: "admin@teamflow.demo",
    target: "Aarav Sharma",
    organization: "Acme Technologies",
    status: "Success",
    date: "2026-10-20T09:42:00",
    ip: "192.168.1.104",
    requestId: "req_55c9d023",
    httpStatus: "201 Created",
    userAgent: "TeamFlow-Admin/2.4 (Windows NT 10.0; Win64; x64) Chrome/126.0",
  },
];

const CATEGORY_OPTIONS = [
  "All categories",
  "Authentication",
  "User Management",
  "Organization",
  "Security",
  "AI Gateway",
];

const getActionIcon = (action) => {
  const value = action.toLowerCase();
  if (value.includes("login") || value.includes("session")) return LogIn;
  if (value.includes("organization")) return Building2;
  if (value.includes("policy") || value.includes("permission") || value.includes("security")) return Shield;
  if (value.includes("api key") || value.includes("gateway")) return Key;
  if (value.includes("invited") || value.includes("created")) return UserPlus;
  if (value.includes("suspended") || value.includes("failed")) return AlertTriangle;
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
  const [pageSize, setPageSize] = useState(10);
  const [density, setDensity] = useState("standard");
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [selectedLog, setSelectedLog] = useState(null);
  const [toast, setToast] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [copiedField, setCopiedField] = useState("");

  // Lock background scroll and listen for Escape key when modal is open
  useEffect(() => {
    if (!selectedLog) return undefined;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setSelectedLog(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedLog]);

  const showToast = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2800);
  };

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

  const resetFilters = () => {
    setSearch("");
    setCategory("All categories");
    setStatus("All statuses");
    setDateRange("all");
    setActorType("All actors");
    setSortField("date");
    setSortOrder("desc");
    setPage(1);
    setSelectedIds(new Set());
    showToast("Filters reset to default.");
  };

  const handleRefreshStream = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      showToast("Audit telemetry stream refreshed with latest events.");
    }, 600);
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
          log.requestId || "",
          log.httpStatus || "",
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

  const exportCsv = () => {
    const targetLogs =
      selectedIds.size > 0
        ? filteredLogs.filter((log) => selectedIds.has(log.id))
        : filteredLogs;

    const headers = [
      "Log ID",
      "Timestamp",
      "Audit Event",
      "Category",
      "Result Status",
      "Actor",
      "Actor Email",
      "Target Resource",
      "Organization",
      "IP Address",
      "Request ID",
      "HTTP Status",
      "User Agent",
      "Description",
    ];

    const rows = targetLogs.map((log) => [
      log.id,
      log.date,
      log.action,
      log.category,
      log.status,
      log.actor,
      log.email,
      log.target,
      log.organization,
      log.ip,
      log.requestId || "N/A",
      log.httpStatus || "200 OK",
      log.userAgent || "TeamFlow-Client/2.4",
      log.description,
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
    link.download = `teamflow-audit-logs-${selectedIds.size > 0 ? "selected" : "feed"}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);

    showToast(
      selectedIds.size > 0
        ? `${selectedIds.size} selected audit logs exported successfully.`
        : "Audit log feed exported successfully."
    );
  };

  const handleCopyJson = (log) => {
    try {
      navigator.clipboard.writeText(JSON.stringify(log, null, 2));
      setCopiedField("json");
      setTimeout(() => setCopiedField(""), 2000);
      showToast(`Event ${log.id} full JSON copied to clipboard.`);
    } catch {
      showToast("Unable to copy to clipboard.");
    }
  };

  const handleCopyText = (text, fieldName) => {
    try {
      navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(""), 2000);
      showToast(`Copied ${fieldName}: ${text}`);
    } catch {}
  };

  return (
    <div className="activity-logs-page">
      {/* 1. Header Bar */}
      <section className="sap-header-panel">
        <div className="sap-header-left">
          <h1>Audit &amp; Security Activity Logs</h1>
          <p className="sap-header-subtitle">
            Immutable platform event ledger, authentication trails, security overrides, and tenant administration telemetry.
          </p>
        </div>

        <div className="sap-header-actions">
          <button
            type="button"
            className="sa-btn sa-btn-secondary"
            onClick={handleRefreshStream}
            disabled={isRefreshing}
          >
            <RefreshCw size={14} className={isRefreshing ? "act-spin" : ""} />
            {isRefreshing ? "Refreshing..." : "Refresh Stream"}
          </button>

          <button
            type="button"
            className="sa-btn sa-btn-primary"
            onClick={exportCsv}
          >
            <Download size={14} /> Export Audit Log
          </button>
        </div>
      </section>

      {/* 2. Top 4 Telemetry Cards */}
      <section className="sap-kpi-grid">
        <article className="sa-kpi-card">
          <div className="sa-kpi-icon-box purple">
            <Activity size={22} strokeWidth={2.2} />
          </div>
          <div className="sa-kpi-body">
            <p className="sa-kpi-title">Total Audit Events</p>
            <div className="sa-kpi-val-row">
              <span className="sa-kpi-value">{stats.total}</span>
              <span className="sa-kpi-trend positive">Immutable</span>
            </div>
            <span className="sa-kpi-subtitle">Continuous event ledger</span>
          </div>
        </article>

        <article className="sa-kpi-card">
          <div className="sa-kpi-icon-box green">
            <CheckCircle2 size={22} strokeWidth={2.2} />
          </div>
          <div className="sa-kpi-body">
            <p className="sa-kpi-title">Verified Executions</p>
            <div className="sa-kpi-val-row">
              <span className="sa-kpi-value">{stats.success}</span>
              <span className="sa-kpi-trend positive">100% Signed</span>
            </div>
            <span className="sa-kpi-subtitle">Completed operations</span>
          </div>
        </article>

        <article className="sa-kpi-card">
          <div className="sa-kpi-icon-box red">
            <AlertTriangle size={22} strokeWidth={2.2} />
          </div>
          <div className="sa-kpi-body">
            <p className="sa-kpi-title">Security Warnings</p>
            <div className="sa-kpi-val-row">
              <span className="sa-kpi-value">{stats.warnings}</span>
              <span className="sa-kpi-trend negative">Review Needed</span>
            </div>
            <span className="sa-kpi-subtitle">Rate limits &amp; bad logins</span>
          </div>
        </article>

        <article className="sa-kpi-card">
          <div className="sa-kpi-icon-box sky">
            <Layers size={22} strokeWidth={2.2} />
          </div>
          <div className="sa-kpi-body">
            <p className="sa-kpi-title">Active Governance Categories</p>
            <div className="sa-kpi-val-row">
              <span className="sa-kpi-value">{stats.categories}</span>
              <span className="sa-kpi-trend positive">Monitored</span>
            </div>
            <span className="sa-kpi-subtitle">Tracked system domains</span>
          </div>
        </article>
      </section>

      {/* 3. The Audit Data Grid Card */}
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
                className="sa-btn sa-btn-primary sa-btn-sm"
                onClick={exportCsv}
              >
                <Download size={13} /> Export Selected ({selectedIds.size})
              </button>
              <button
                type="button"
                className="sa-btn sa-btn-secondary sa-btn-sm"
                onClick={() => setSelectedIds(new Set())}
              >
                Clear Selection
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
            { label: "AI Gateway", count: logs.filter((l) => l.category === "AI Gateway").length, type: "cat", val: "AI Gateway" },
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
                    setCategory("All categories");
                  } else if (tab.type === "cat") {
                    setCategory(tab.val);
                    setStatus("All statuses");
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
              {search && (
                <button
                  type="button"
                  className="act-search-clear"
                  onClick={() => {
                    setSearch("");
                    setPage(1);
                  }}
                  aria-label="Clear search"
                >
                  <X size={13} />
                </button>
              )}
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
              <RotateCcw size={15} />
            </button>
          </div>
        </div>

        {/* 4. The Table Data Grid */}
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
                    aria-label="Select all logs on current page"
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
                <th style={{ textAlign: "center" }}>Actions</th>
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
                        aria-label={`Select log ${log.id}`}
                      />
                    </td>
                    <td>
                      <span className="sap-id-cell">{log.id}</span>
                    </td>
                    <td>
                      <div className="sap-user-badge">
                        <div className="sap-avatar-chip" style={{ width: 34, height: 34, minWidth: 34 }}>
                          <ActionIcon size={16} />
                        </div>
                        <div className="sap-user-info">
                          <strong className="sap-user-name">{log.action}</strong>
                          <span className="act-event-category">{log.category}</span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div className="act-actor-wrap">
                        <strong className="act-actor-name">{log.actor}</strong>
                        <span className="act-actor-email">{log.email}</span>
                      </div>
                    </td>

                    <td className="act-target-td">
                      <div className="act-target-wrap">
                        <strong className="act-target-title">
                          {log.target}
                        </strong>
                        <div className={`act-org-chip ${log.organization === "System" ? "is-system" : log.organization === "Unknown" ? "is-unknown" : ""}`}>
                          {log.organization !== "Unknown" && log.organization !== "System" ? (
                            <img
                              src={orgAvatarImg}
                              alt={log.organization}
                              className="act-org-avatar"
                              loading="lazy"
                            />
                          ) : log.organization === "System" ? (
                            <Shield size={12} className="act-org-icon is-system-icon" />
                          ) : (
                            <Globe size={12} className="act-org-icon is-unknown-icon" />
                          )}
                          <span className="act-org-name">{log.organization}</span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="act-ip-badge">
                        {log.ip}
                      </span>
                    </td>

                    <td>
                      <div className="act-date-wrap">
                        <strong className="act-date-main">{formatDate(log.date).split(",")[0]}</strong>
                        <span className="act-date-sub">{formatDate(log.date).split(",").slice(1).join(",")}</span>
                      </div>
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

                    <td style={{ textAlign: "center" }}>
                      <button
                        type="button"
                        className="act-action-btn-inspect"
                        title={`Inspect audit record ${log.id}`}
                        onClick={() => setSelectedLog(log)}
                      >
                        <Eye size={13} />
                        Inspect
                      </button>
                    </td>
                  </tr>
                );
              })}

              {pageLogs.length === 0 && (
                <tr>
                  <td colSpan="9">
                    <div className="activity-logs-empty">
                      <CalendarDays size={28} />
                      <strong>No audit records match your filters</strong>
                      <span>Try broadening your search term or resetting the status and date parameters.</span>
                      <button type="button" onClick={resetFilters}>
                        Clear All Filters
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 5. Pagination Footer */}
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
        <Shield size={13} />
        Live tamper-evident audit ledger cryptographically signed via SHA-256 HMAC blocks.
      </p>

      {/* 6. Portaled Event Details Inspect Modal (Centered, No Scroll Required) */}
      {selectedLog &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="act-modal-overlay"
            onClick={() => setSelectedLog(null)}
            role="dialog"
            aria-modal="true"
          >
            <div
              className="act-modal-container"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="act-modal-header">
                <div className="act-modal-title-box">
                  <div className="act-modal-icon-wrap">
                    {(() => {
                      const Icon = getActionIcon(selectedLog.action);
                      return <Icon size={18} />;
                    })()}
                  </div>
                  <div>
                    <div className="act-modal-title-row">
                      <h3>{selectedLog.action}</h3>
                      <span className="act-modal-id">{selectedLog.id}</span>
                    </div>
                    <div className="act-modal-sub-meta">
                      <span className="act-modal-cat-pill">{selectedLog.category}</span>
                      <span className="act-modal-dot">•</span>
                      <span>{formatDate(selectedLog.date)}</span>
                      <span className="act-modal-dot">•</span>
                      <span
                        className={`act-modal-status-badge act-status-${selectedLog.status.toLowerCase()}`}
                      >
                        <span className="act-modal-status-dot" />
                        {selectedLog.status}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  className="act-modal-close-btn"
                  onClick={() => setSelectedLog(null)}
                  aria-label="Close details"
                >
                  <X size={17} />
                </button>
              </div>

              {/* Compact Body - Fits completely in viewport without scrolling */}
              <div className="act-modal-body">
                {/* Event Description & HTTP Trace */}
                <div className="act-modal-desc-box">
                  <p>{selectedLog.description}</p>
                  <div className="act-modal-trace-line">
                    <span>
                      <strong>Request ID:</strong> {selectedLog.requestId || "req_09a1f28e"}
                    </span>
                    <span>
                      <strong>HTTP Status:</strong> {selectedLog.httpStatus || "200 OK"}
                    </span>
                  </div>
                </div>

                {/* 2-Column Structured Info Grid */}
                <div className="act-modal-grid">
                  <div className="act-modal-grid-card">
                    <span className="act-modal-label">Actor & Authority</span>
                    <strong className="act-modal-val">{selectedLog.actor}</strong>
                    <small className="act-modal-subval">{selectedLog.email}</small>
                  </div>

                  <div className="act-modal-grid-card">
                    <span className="act-modal-label">Target Resource & Org</span>
                    <strong className="act-modal-val">{selectedLog.target}</strong>
                    <div className={`act-org-chip ${selectedLog.organization === "System" ? "is-system" : selectedLog.organization === "Unknown" ? "is-unknown" : ""}`} style={{ marginTop: 4 }}>
                      {selectedLog.organization !== "Unknown" && selectedLog.organization !== "System" ? (
                        <img
                          src={orgAvatarImg}
                          alt={selectedLog.organization}
                          className="act-org-avatar"
                          loading="lazy"
                        />
                      ) : selectedLog.organization === "System" ? (
                        <Shield size={12} className="act-org-icon is-system-icon" />
                      ) : (
                        <Globe size={12} className="act-org-icon is-unknown-icon" />
                      )}
                      <span className="act-org-name">{selectedLog.organization}</span>
                    </div>
                  </div>

                  <div className="act-modal-grid-card">
                    <span className="act-modal-label">Origin IP & Location</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
                      <strong className="act-modal-val" style={{ fontFamily: "monospace" }}>
                        {selectedLog.ip}
                      </strong>
                      <button
                        type="button"
                        className="act-copy-mini-btn"
                        onClick={() => handleCopyText(selectedLog.ip, "IP Address")}
                        title="Copy IP"
                      >
                        {copiedField === "IP Address" ? <Check size={11} color="#16a34a" /> : <Copy size={11} />}
                      </button>
                    </div>
                    <small className="act-modal-subval">Authorized Gateway Node</small>
                  </div>

                  <div className="act-modal-grid-card">
                    <span className="act-modal-label">Client User-Agent</span>
                    <strong className="act-modal-val" style={{ fontSize: "11px", wordBreak: "break-all" }}>
                      {selectedLog.userAgent || "TeamFlow-Admin/2.5 Chrome/128.0"}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="act-modal-footer">
                <button
                  type="button"
                  className="sa-btn sa-btn-secondary sa-btn-sm"
                  onClick={() => handleCopyJson(selectedLog)}
                >
                  {copiedField === "json" ? (
                    <>
                      <Check size={13} color="#16a34a" /> JSON Copied!
                    </>
                  ) : (
                    <>
                      <FileCode size={13} /> Copy Event JSON
                    </>
                  )}
                </button>

                <button
                  type="button"
                  className="sa-btn sa-btn-primary sa-btn-sm"
                  onClick={() => setSelectedLog(null)}
                >
                  Close Record
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {toast && <div className="activity-logs-toast">{toast}</div>}
    </div>
  );
}

export default ActivityLogs;