import { useEffect, useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Bell,
  Check,
  ChevronLeft,
  ChevronRight,
  Download,
  Filter,
  Globe,
  HardDrive,
  Key,
  Layers,
  LayoutGrid,
  LockKeyhole,
  Monitor,
  Pencil,
  Plus,
  RotateCcw,
  Save,
  Search,
  Server,
  ShieldCheck,
  Sparkles,
  Table as TableIcon,
  UserRound,
  X,
  Zap,
  SlidersHorizontal,
} from "lucide-react";
import "./SuperAdminCommon.css";
import "./Settings.css";

const DEFAULT_SETTINGS = {
  platformName: "TeamFlow AI",
  supportEmail: "support@teamflow.ai",
  timezone: "Asia/Kolkata",
  language: "English",
  maintenanceMode: false,
  allowRegistration: true,
  emailNotifications: true,
  securityAlerts: true,
  weeklyReports: false,
  twoFactorAuth: true,
  sessionTimeout: "30",
  adminName: "Himanshu",
  adminEmail: "admin@teamflow.ai",
  auditRetention: "90 Days",
  passwordPolicy: "12 characters (Recommended)",
  maxUploadSize: "25 MB",
  apiRateLimit: "1,200 req/min",
};

const BASE_SYSTEM_PARAMETERS = [
  {
    key: "platform.name",
    name: "Platform Name",
    description: "Identifies the SaaS platform instance and branding across all dashboard portals.",
    category: "General",
    type: "string",
    stateKey: "platformName",
    scope: "Global",
  },
  {
    key: "platform.support_email",
    name: "Support Contact Email",
    description: "Primary support email address displayed on landing pages, invoices, and help tickets.",
    category: "General",
    type: "string",
    stateKey: "supportEmail",
    scope: "Global",
  },
  {
    key: "system.timezone",
    name: "Default Timezone",
    description: "System timezone for scheduled cron automations, executive reports, and audit timestamps.",
    category: "General",
    type: "select",
    options: ["Asia/Kolkata", "UTC", "America/New_York", "Europe/London", "Asia/Dubai"],
    stateKey: "timezone",
    scope: "Global",
  },
  {
    key: "system.language",
    name: "Display Language",
    description: "Default localized language for platform user interface and system notifications.",
    category: "General",
    type: "select",
    options: ["English", "Hindi"],
    stateKey: "language",
    scope: "Global",
  },
  {
    key: "auth.allow_registration",
    name: "Public Self-Registration",
    description: "Allows new organizations and team members to register through the public signup portal.",
    category: "General",
    type: "boolean",
    stateKey: "allowRegistration",
    scope: "Public Auth",
  },
  {
    key: "system.maintenance_mode",
    name: "Maintenance Mode",
    description: "Restricts non-admin user access and displays a scheduled maintenance banner.",
    category: "General",
    type: "boolean",
    stateKey: "maintenanceMode",
    scope: "Production",
  },
  {
    key: "security.two_factor_auth",
    name: "Two-Factor Authentication (2FA)",
    description: "Enforces mandatory TOTP two-factor authentication challenge upon administrator sign-in.",
    category: "Security",
    type: "boolean",
    stateKey: "twoFactorAuth",
    scope: "Security Policy",
  },
  {
    key: "security.session_timeout",
    name: "Inactive Session Timeout",
    description: "Automatically terminates idle administrator sessions after specified inactivity period.",
    category: "Security",
    type: "select",
    options: ["15", "30", "60", "120"],
    optionsDisplay: { "15": "15 minutes", "30": "30 minutes", "60": "60 minutes", "120": "2 hours" },
    stateKey: "sessionTimeout",
    scope: "Security Policy",
  },
  {
    key: "security.audit_retention",
    name: "Audit Log Retention Policy",
    description: "Number of calendar days security audit events and platform access records are preserved.",
    category: "Security",
    type: "select",
    options: ["30 Days", "90 Days", "180 Days", "365 Days"],
    stateKey: "auditRetention",
    scope: "Compliance",
  },
  {
    key: "security.password_policy",
    name: "Password Complexity Policy",
    description: "Enforces minimum character length and complexity checks for all tenant accounts.",
    category: "Security",
    type: "select",
    options: ["8 characters", "10 characters", "12 characters (Recommended)", "16 characters (Enterprise)"],
    stateKey: "passwordPolicy",
    scope: "Security Policy",
  },
  {
    key: "notify.email_notifications",
    name: "System Email Notifications",
    description: "Dispatches transactional email notifications for account actions, invitations, and invoices.",
    category: "Notifications",
    type: "boolean",
    stateKey: "emailNotifications",
    scope: "System",
  },
  {
    key: "notify.security_alerts",
    name: "Immediate Security Alerts",
    description: "Sends high-priority alerts for repeated failed logins, IP shifts, or privilege changes.",
    category: "Notifications",
    type: "boolean",
    stateKey: "securityAlerts",
    scope: "Security",
  },
  {
    key: "notify.weekly_reports",
    name: "Executive Weekly Digest",
    description: "Automated Monday morning digest summarizing tenant growth, MRR, and platform metrics.",
    category: "Notifications",
    type: "boolean",
    stateKey: "weeklyReports",
    scope: "Analytics",
  },
  {
    key: "admin.name",
    name: "Administrator Display Name",
    description: "Full legal or display name shown for the active Super Administrator profile.",
    category: "Admin Profile",
    type: "string",
    stateKey: "adminName",
    scope: "Administration",
  },
  {
    key: "admin.email",
    name: "Administrator Email",
    description: "Primary notification email address for critical platform escalation and recovery.",
    category: "Admin Profile",
    type: "string",
    stateKey: "adminEmail",
    scope: "Administration",
  },
  {
    key: "storage.max_upload_size",
    name: "Max File Upload Size",
    description: "Maximum allowable upload size per single file attachment across team tasks and chat.",
    category: "System Limits",
    type: "select",
    options: ["10 MB", "25 MB", "50 MB", "100 MB"],
    stateKey: "maxUploadSize",
    scope: "Storage",
  },
  {
    key: "api.rate_limit_rpm",
    name: "API Gateway Rate Limit",
    description: "Maximum API requests per minute per IP address to safeguard platform API endpoints.",
    category: "System Limits",
    type: "select",
    options: ["600 req/min", "1,200 req/min", "3,000 req/min", "Unlimited (Enterprise)"],
    stateKey: "apiRateLimit",
    scope: "Gateway",
  },
];

const STORAGE_KEY = "teamflow_superadmin_settings";
const CUSTOM_PARAMS_KEY = "teamflow_superadmin_custom_params";

function loadSettings() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved
      ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) }
      : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

function loadCustomParams() {
  try {
    const saved = localStorage.getItem(CUSTOM_PARAMS_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function Settings() {
  const [settings, setSettings] = useState(loadSettings);
  const [savedSettings, setSavedSettings] = useState(loadSettings);
  const [customParams, setCustomParams] = useState(loadCustomParams);
  const [viewMode, setViewMode] = useState("table"); // "table" | "form"
  const [activeTab, setActiveTab] = useState("general");
  const [message, setMessage] = useState("");

  // Filters for Table View
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All categories");
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const [typeFilter, setTypeFilter] = useState("All types");
  const [sortField, setSortField] = useState("key");
  const [sortOrder, setSortOrder] = useState("asc");
  const [page, setPage] = useState(1);
  const [density, setDensity] = useState("standard");
  const [pageSize, setPageSize] = useState(10);

  // Modals
  const [editingParam, setEditingParam] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newParamForm, setNewParamForm] = useState({
    key: "",
    name: "",
    description: "",
    category: "General",
    type: "string",
    value: "",
    scope: "Global",
  });

  useEffect(() => {
    if (!message) return;
    const timer = window.setTimeout(() => setMessage(""), 3000);
    return () => window.clearTimeout(timer);
  }, [message]);

  const updateSetting = (key, value) => {
    setSettings((current) => {
      const next = { ...current, [key]: value };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  const handleToggle = (param) => {
    const currentValue = Boolean(settings[param.stateKey]);
    const nextValue = !currentValue;
    updateSetting(param.stateKey, nextValue);
    setMessage(`${param.name} is now ${nextValue ? "Enabled" : "Disabled"}.`);
  };

  const handleSave = (event) => {
    if (event) event.preventDefault();

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      setSavedSettings({ ...settings });
      setMessage("Settings saved successfully.");
    } catch {
      setMessage("Unable to save settings in this browser.");
    }
  };

  const handleReset = () => {
    setSettings({ ...DEFAULT_SETTINGS });
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SETTINGS));
    } catch (e) {
      console.error(e);
    }
    setMessage("Default values restored successfully.");
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const resetFilters = () => {
    setSearchQuery("");
    setCategoryFilter("All categories");
    setStatusFilter("All statuses");
    setTypeFilter("All types");
    setSortField("key");
    setSortOrder("asc");
    setPage(1);
  };

  const allParameters = useMemo(() => {
    return [...BASE_SYSTEM_PARAMETERS, ...customParams];
  }, [customParams]);

  const filteredParameters = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    let list = allParameters.filter((param) => {
      const val = String(settings[param.stateKey] ?? "");
      const matchesSearch =
        !q ||
        param.key.toLowerCase().includes(q) ||
        param.name.toLowerCase().includes(q) ||
        param.description.toLowerCase().includes(q) ||
        param.category.toLowerCase().includes(q) ||
        val.toLowerCase().includes(q);

      const matchesCat =
        categoryFilter === "All categories" ||
        param.category.toLowerCase() === categoryFilter.toLowerCase();

      let matchesStatus = true;
      if (statusFilter === "Enabled / Active") {
        matchesStatus = param.type === "boolean" ? settings[param.stateKey] === true : true;
      } else if (statusFilter === "Disabled") {
        matchesStatus = param.type === "boolean" ? settings[param.stateKey] === false : false;
      }

      let matchesType = true;
      if (typeFilter === "Toggle / Boolean") {
        matchesType = param.type === "boolean";
      } else if (typeFilter === "Select / Option") {
        matchesType = param.type === "select";
      } else if (typeFilter === "Text / String") {
        matchesType = param.type === "string";
      }

      return matchesSearch && matchesCat && matchesStatus && matchesType;
    });

    list.sort((a, b) => {
      let valA = a[sortField] || "";
      let valB = b[sortField] || "";
      if (sortField === "value") {
        valA = String(settings[a.stateKey] ?? "");
        valB = String(settings[b.stateKey] ?? "");
      }
      valA = String(valA).toLowerCase();
      valB = String(valB).toLowerCase();
      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return list;
  }, [allParameters, settings, searchQuery, categoryFilter, statusFilter, typeFilter, sortField, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(filteredParameters.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const visibleParameters = filteredParameters.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleExport = (format = "csv") => {
    if (format === "json") {
      const dataStr =
        "data:text/json;charset=utf-8," +
        encodeURIComponent(JSON.stringify(settings, null, 2));
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", "teamflow-platform-settings.json");
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      setMessage("Configuration exported as JSON.");
      return;
    }

    const headers = [
      "Setting Key",
      "Setting Name",
      "Category",
      "Data Type",
      "Current Value",
      "Scope",
      "Description",
    ];

    const rows = filteredParameters.map((p) => [
      p.key,
      p.name,
      p.category,
      p.type,
      String(settings[p.stateKey] ?? ""),
      p.scope,
      p.description,
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
    link.download = "teamflow-platform-parameters.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    setMessage("Configuration exported as CSV.");
  };

  const handleAddCustomParam = (e) => {
    e.preventDefault();
    if (!newParamForm.key || !newParamForm.name) return;

    const safeKey = newParamForm.key.trim().toLowerCase().replace(/\s+/g, ".");
    const stateKey = `custom_${safeKey.replace(/\./g, "_")}`;

    const newParam = {
      key: safeKey,
      name: newParamForm.name.trim(),
      description: newParamForm.description.trim() || "Custom platform parameter.",
      category: newParamForm.category,
      type: newParamForm.type,
      stateKey,
      scope: newParamForm.scope,
    };

    const nextCustom = [...customParams, newParam];
    setCustomParams(nextCustom);
    try {
      localStorage.setItem(CUSTOM_PARAMS_KEY, JSON.stringify(nextCustom));
    } catch (err) {
      console.error(err);
    }

    updateSetting(stateKey, newParamForm.type === "boolean" ? false : newParamForm.value);
    setShowAddModal(false);
    setNewParamForm({
      key: "",
      name: "",
      description: "",
      category: "General",
      type: "string",
      value: "",
      scope: "Global",
    });
    setMessage(`Custom parameter ${safeKey} created successfully.`);
  };

  const tabs = [
    { id: "general", label: "General", icon: Globe },
    { id: "security", label: "Security", icon: ShieldCheck },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "profile", label: "Admin Profile", icon: UserRound },
  ];

  const isDirty = JSON.stringify(settings) !== JSON.stringify(savedSettings);

  return (
    <div className="sa-settings">
      <div className="sa-settings-header sap-header-panel">
        <div className="sa-page-header-left">
          <h1>Platform Settings</h1>
          <p>
            Manage your platform configuration, security, notifications, and
            administrator profile.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* Table / Form view toggle */}
          <div className="sub-plans-view-toggle">
            <button
              type="button"
              className={`sub-plans-toggle-btn ${viewMode === "table" ? "active" : ""}`}
              onClick={() => setViewMode("table")}
              title="Parameters table view"
            >
              <TableIcon size={15} />
              Config Table
            </button>
            <button
              type="button"
              className={`sub-plans-toggle-btn ${viewMode === "form" ? "active" : ""}`}
              onClick={() => setViewMode("form")}
              title="Categorized form view"
            >
              <LayoutGrid size={15} />
              Category Form
            </button>
          </div>

          <button
            className="subscriptions-button subscriptions-button-light"
            type="button"
            onClick={() => handleExport("csv")}
            title="Export CSV"
          >
            <Download size={16} />
            Export CSV
          </button>

          <button
            className="sa-settings-save"
            type="button"
            onClick={handleSave}
          >
            <Save size={17} />
            Save Changes
          </button>
        </div>
      </div>

      {message && (
        <div
          className={`sa-settings-toast ${
            message.startsWith("Unable") ? "error" : ""
          }`}
          role="status"
        >
          {message.startsWith("Unable") ? null : <Check size={17} />}
          {message}
        </div>
      )}

      {/* Overview Stat Ribbon */}
      <section className="subscriptions-metrics" style={{ marginBottom: 20 }}>
        <article className="subscriptions-metric-card">
          <span className="subscriptions-metric-icon purple">
            <Server size={20} />
          </span>
          <div className="subscriptions-metric-label">Configuration Parameters</div>
          <strong>{allParameters.length}</strong>
          <small className="subscriptions-metric-positive">Active system settings</small>
        </article>

        <article className="subscriptions-metric-card">
          <span className="subscriptions-metric-icon green">
            <ShieldCheck size={20} />
          </span>
          <div className="subscriptions-metric-label">Security &amp; MFA</div>
          <strong>{settings.twoFactorAuth ? "Enforced" : "Optional"}</strong>
          <small className="subscriptions-metric-positive">
            Session: {settings.sessionTimeout}m timeout
          </small>
        </article>

        <article className="subscriptions-metric-card">
          <span className="subscriptions-metric-icon amber">
            <LockKeyhole size={20} />
          </span>
          <div className="subscriptions-metric-label">System State</div>
          <strong>{settings.maintenanceMode ? "Maintenance" : "Production"}</strong>
          <small className={settings.maintenanceMode ? "subscriptions-metric-warning" : "subscriptions-metric-positive"}>
            {settings.allowRegistration ? "Self-signup active" : "Registration restricted"}
          </small>
        </article>

        <article className="subscriptions-metric-card">
          <span className="subscriptions-metric-icon blue">
            <Bell size={20} />
          </span>
          <div className="subscriptions-metric-label">Notification Channels</div>
          <strong>{settings.emailNotifications && settings.securityAlerts ? "Fully Active" : "Partial"}</strong>
          <small>Weekly reports: {settings.weeklyReports ? "On" : "Off"}</small>
        </article>
      </section>

      {/* ============================================================ */}
      {/* VIEW 1: SAAS PLATFORM CONFIGURATION & SYSTEM PARAMETERS TABLE */}
      {/* ============================================================ */}
      {viewMode === "table" ? (
        <section className="sap-table-card subscriptions-table-panel">
          <div className="subscriptions-table-heading">
            <div>
              <h2>Platform Parameters &amp; Configuration Registry</h2>
              <p>Search, filter, inspect, and toggle platform settings live.</p>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                type="button"
                className="subscriptions-button subscriptions-button-light"
                onClick={handleReset}
                title="Restore default settings"
              >
                <RotateCcw size={15} />
                Restore Defaults
              </button>
              <button
                type="button"
                className="subscriptions-button subscriptions-button-primary"
                onClick={() => setShowAddModal(true)}
              >
                <Plus size={16} />
                Add Parameter
              </button>
            </div>
          </div>

          {/* Quick Category Filter Pills */}
          <div className="sub-quick-tabs">
            {[
              { label: "All", count: allParameters.length, val: "All categories" },
              { label: "General", count: allParameters.filter((p) => p.category === "General").length, val: "General" },
              { label: "Security", count: allParameters.filter((p) => p.category === "Security").length, val: "Security" },
              { label: "Notifications", count: allParameters.filter((p) => p.category === "Notifications").length, val: "Notifications" },
              { label: "Admin Profile", count: allParameters.filter((p) => p.category === "Admin Profile").length, val: "Admin Profile" },
              { label: "System Limits", count: allParameters.filter((p) => p.category === "System Limits").length, val: "System Limits" },
            ].map((tab) => {
              const isActive = categoryFilter === tab.val;
              return (
                <button
                  key={tab.label}
                  type="button"
                  className={`sub-quick-tab ${isActive ? "active" : ""}`}
                  onClick={() => {
                    setCategoryFilter(tab.val);
                    setPage(1);
                  }}
                >
                  <span>{tab.label}</span>
                  <span className="sub-quick-tab-badge">{tab.count}</span>
                </button>
              );
            })}
          </div>

          {/* Filter Toolbar */}
          <div className="subscriptions-filters">
            <label className="subscriptions-search">
              <Search size={17} />
              <input
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                placeholder="Search parameter key, name, or description..."
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setPage(1);
                  }}
                  aria-label="Clear search"
                >
                  <X size={14} />
                </button>
              )}
            </label>

            <label className="subscriptions-filter-label">
              <Filter size={14} />
              <select
                value={categoryFilter}
                onChange={(e) => {
                  setCategoryFilter(e.target.value);
                  setPage(1);
                }}
              >
                <option>All categories</option>
                <option>General</option>
                <option>Security</option>
                <option>Notifications</option>
                <option>Admin Profile</option>
                <option>System Limits</option>
              </select>
            </label>

            <select
              className="subscriptions-filter-select"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
            >
              <option>All statuses</option>
              <option>Enabled / Active</option>
              <option>Disabled</option>
            </select>

            <select
              className="subscriptions-filter-select"
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value);
                setPage(1);
              }}
            >
              <option>All types</option>
              <option>Toggle / Boolean</option>
              <option>Select / Option</option>
              <option>Text / String</option>
            </select>

            <button
              type="button"
              className="subscriptions-reset-button"
              onClick={resetFilters}
            >
              <RotateCcw size={14} /> Reset
            </button>

            <button
              type="button"
              className="sap-icon-btn"
              title={`Switch density (currently ${density})`}
              onClick={() =>
                setDensity((prev) => (prev === "standard" ? "compact" : "standard"))
              }
            >
              <SlidersHorizontal size={14} />
            </button>
          </div>

          {/* Table Wrap */}
          <div className="subscriptions-table-wrap">
            <table className={`sap-grid is-${density} subscriptions-table`}>
              <thead>
                <tr>
                  <th
                    onClick={() => handleSort("name")}
                    style={{ cursor: "pointer", userSelect: "none" }}
                  >
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                      Parameter &amp; Key
                      {sortField === "name" ? (
                        sortOrder === "asc" ? <ArrowUp size={13} /> : <ArrowDown size={13} />
                      ) : (
                        <ArrowUpDown size={12} opacity={0.4} />
                      )}
                    </span>
                  </th>
                  <th
                    onClick={() => handleSort("category")}
                    style={{ cursor: "pointer", userSelect: "none" }}
                  >
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                      Category
                      {sortField === "category" ? (
                        sortOrder === "asc" ? <ArrowUp size={13} /> : <ArrowDown size={13} />
                      ) : (
                        <ArrowUpDown size={12} opacity={0.4} />
                      )}
                    </span>
                  </th>
                  <th>Type</th>
                  <th>Value / Control</th>
                  <th>Scope</th>
                  <th>Status</th>
                  <th aria-label="Actions" style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {visibleParameters.map((param) => {
                  const val = settings[param.stateKey];
                  const isBool = param.type === "boolean";
                  const isSelect = param.type === "select";

                  return (
                    <tr key={param.key}>
                      {/* Name & Key */}
                      <td>
                        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                          <strong style={{ fontSize: "13.5px", color: "var(--sa-text-primary, #0f172a)" }}>
                            {param.name}
                          </strong>
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <code
                              style={{
                                fontSize: "11px",
                                fontFamily: "monospace",
                                padding: "1px 6px",
                                borderRadius: "4px",
                                background: "var(--sa-bg, #f1f5f9)",
                                color: "#6366f1",
                                border: "1px solid var(--sa-border, #e2e8f0)",
                              }}
                            >
                              {param.key}
                            </code>
                          </div>
                          <p style={{ margin: "2px 0 0", fontSize: "11.5px", color: "var(--sa-text-muted, #64748b)", lineHeight: 1.35, maxWidth: 360 }}>
                            {param.description}
                          </p>
                        </div>
                      </td>

                      {/* Category */}
                      <td>
                        <span
                          style={{
                            display: "inline-block",
                            padding: "3px 9px",
                            borderRadius: "12px",
                            fontSize: "12px",
                            fontWeight: 600,
                            backgroundColor:
                              param.category === "Security"
                                ? "#fdf4ff"
                                : param.category === "Notifications"
                                ? "#eff6ff"
                                : param.category === "General"
                                ? "#f0fdf4"
                                : "#f8fafc",
                            color:
                              param.category === "Security"
                                ? "#a855f7"
                                : param.category === "Notifications"
                                ? "#2563eb"
                                : param.category === "General"
                                ? "#16a34a"
                                : "#475569",
                            border: "1px solid rgba(0,0,0,0.06)",
                          }}
                        >
                          {param.category}
                        </span>
                      </td>

                      {/* Type */}
                      <td>
                        <span
                          style={{
                            display: "inline-block",
                            padding: "2px 6px",
                            borderRadius: "4px",
                            fontSize: "11px",
                            fontWeight: 600,
                            background: "var(--sa-bg, #f1f5f9)",
                            color: "var(--sa-text-secondary, #64748b)",
                            textTransform: "uppercase",
                          }}
                        >
                          {param.type}
                        </span>
                      </td>

                      {/* Live Control / Current Value */}
                      <td>
                        {isBool ? (
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <button
                              type="button"
                              role="switch"
                              aria-checked={Boolean(val)}
                              className={`sa-settings-switch ${val ? "on" : ""}`}
                              onClick={() => handleToggle(param)}
                              title={`Click to ${val ? "disable" : "enable"}`}
                            >
                              <span />
                            </button>
                            <span style={{ fontSize: "12.5px", fontWeight: 600, color: val ? "#16a34a" : "#94a3b8" }}>
                              {val ? "Enabled" : "Disabled"}
                            </span>
                          </div>
                        ) : isSelect ? (
                          <select
                            style={{
                              padding: "4px 8px",
                              fontSize: "12.5px",
                              borderRadius: "6px",
                              border: "1px solid var(--sa-border, #cbd5e1)",
                              background: "var(--sa-surface, #ffffff)",
                              color: "var(--sa-text-main, #1e293b)",
                              fontWeight: 600,
                            }}
                            value={String(val ?? "")}
                            onChange={(e) => {
                              updateSetting(param.stateKey, e.target.value);
                              setMessage(`${param.name} updated to ${e.target.value}.`);
                            }}
                          >
                            {param.options?.map((opt) => (
                              <option key={opt} value={opt}>
                                {param.optionsDisplay ? param.optionsDisplay[opt] || opt : opt}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <span
                              style={{
                                fontSize: "13px",
                                fontWeight: 600,
                                color: "var(--sa-text-main, #0f172a)",
                                maxWidth: 180,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {String(val ?? "(Empty)")}
                            </span>
                            <button
                              type="button"
                              onClick={() => setEditingParam(param)}
                              title="Edit parameter value"
                              style={{
                                background: "none",
                                border: "none",
                                padding: "2px",
                                cursor: "pointer",
                                color: "#6366f1",
                              }}
                            >
                              <Pencil size={13} />
                            </button>
                          </div>
                        )}
                      </td>

                      {/* Scope */}
                      <td>
                        <span style={{ fontSize: "12px", color: "var(--sa-text-muted, #64748b)" }}>
                          {param.scope}
                        </span>
                      </td>

                      {/* Status */}
                      <td>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 4,
                            padding: "2px 8px",
                            borderRadius: "12px",
                            fontSize: "11.5px",
                            fontWeight: 700,
                            backgroundColor:
                              isBool && !val
                                ? "#f1f5f9"
                                : "#ecfdf5",
                            color:
                              isBool && !val
                                ? "#64748b"
                                : "#059669",
                          }}
                        >
                          <span
                            style={{
                              width: 6,
                              height: 6,
                              borderRadius: "50%",
                              backgroundColor: "currentColor",
                            }}
                          />
                          {isBool ? (val ? "Active" : "Inactive") : "Active"}
                        </span>
                      </td>

                      {/* Row Actions */}
                      <td style={{ textAlign: "right" }}>
                        <div style={{ display: "flex", justifyContent: "flex-end", gap: 6 }}>
                          <button
                            type="button"
                            className="subscriptions-button subscriptions-button-light"
                            style={{ padding: "4px 8px", fontSize: "11.5px" }}
                            onClick={() => setEditingParam(param)}
                            title="Edit parameter"
                          >
                            <Pencil size={12} /> Edit
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {visibleParameters.length === 0 && (
                  <tr>
                    <td colSpan="7" className="analytics-empty-state">
                      No system parameters match your search or filter options.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <footer className="activity-logs-pagination" style={{ marginTop: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <span>
                Showing {filteredParameters.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}–
                {Math.min(currentPage * pageSize, filteredParameters.length)} of {filteredParameters.length} parameters
              </span>
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

            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <button
                type="button"
                className="subscriptions-button subscriptions-button-light"
                style={{ padding: "5px 10px" }}
                disabled={currentPage <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                <ChevronLeft size={16} />
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                type="button"
                className="subscriptions-button subscriptions-button-light"
                style={{ padding: "5px 10px" }}
                disabled={currentPage >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </footer>
        </section>
      ) : (
        /* ============================================================ */
        /* VIEW 2: CATEGORIZED FORM TAB VIEW                            */
        /* ============================================================ */
        <div className="sa-settings-layout">
          <aside className="sa-settings-sidebar">
            <div className="sa-settings-nav-title">CATEGORIES</div>

            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                type="button"
                key={id}
                className={`sa-settings-tab ${activeTab === id ? "active" : ""}`}
                onClick={() => setActiveTab(id)}
              >
                <Icon size={18} />
                <span>{label}</span>
              </button>
            ))}

            <div className="sa-settings-sidebar-note">
              <LockKeyhole size={18} />
              <strong>Administrator Access</strong>
              <p>All settings are persistently synced across dashboard sessions.</p>
            </div>
          </aside>

          <form className="sa-settings-content" onSubmit={handleSave}>
            {activeTab === "general" && (
              <>
                <div className="sa-settings-section-heading">
                  <div className="sa-settings-section-icon">
                    <Globe size={20} />
                  </div>
                  <div>
                    <h2>General Settings</h2>
                    <p>Configure platform identification and regional defaults.</p>
                  </div>
                </div>

                <div className="sa-settings-fields">
                  <label className="sa-settings-field">
                    <span>Platform name</span>
                    <input
                      value={settings.platformName}
                      onChange={(e) => updateSetting("platformName", e.target.value)}
                      required
                    />
                    <small>Branded title shown across team workspaces.</small>
                  </label>

                  <label className="sa-settings-field">
                    <span>Support email</span>
                    <input
                      type="email"
                      value={settings.supportEmail}
                      onChange={(e) => updateSetting("supportEmail", e.target.value)}
                      required
                    />
                    <small>Displayed as your official support contact.</small>
                  </label>

                  <label className="sa-settings-field">
                    <span>Default timezone</span>
                    <select
                      value={settings.timezone}
                      onChange={(e) => updateSetting("timezone", e.target.value)}
                    >
                      <option value="Asia/Kolkata">India Standard Time (IST)</option>
                      <option value="UTC">Coordinated Universal Time (UTC)</option>
                      <option value="America/New_York">Eastern Time (ET)</option>
                      <option value="Europe/London">London (GMT/BST)</option>
                      <option value="Asia/Dubai">Gulf Standard Time (GST)</option>
                    </select>
                  </label>

                  <label className="sa-settings-field">
                    <span>Display language</span>
                    <select
                      value={settings.language}
                      onChange={(e) => updateSetting("language", e.target.value)}
                    >
                      <option>English</option>
                      <option>Hindi</option>
                    </select>
                  </label>
                </div>

                <div className="sa-settings-divider" />

                <h3 className="sa-settings-subheading">Platform Availability</h3>

                <SettingToggle
                  title="Allow new registrations"
                  description="Allow new organizations and team members to register."
                  checked={settings.allowRegistration}
                  onChange={(val) => updateSetting("allowRegistration", val)}
                />

                <SettingToggle
                  title="Maintenance mode"
                  description="Temporarily marks the platform as undergoing scheduled maintenance."
                  checked={settings.maintenanceMode}
                  onChange={(val) => updateSetting("maintenanceMode", val)}
                  warning
                />
              </>
            )}

            {activeTab === "security" && (
              <>
                <div className="sa-settings-section-heading">
                  <div className="sa-settings-section-icon">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <h2>Security &amp; Access Governance</h2>
                    <p>Manage authentication challenges, session limits, and password policies.</p>
                  </div>
                </div>

                <SettingToggle
                  title="Two-factor authentication (2FA)"
                  description="Enforces mandatory two-factor authentication challenge upon administrator sign-in."
                  checked={settings.twoFactorAuth}
                  onChange={(val) => updateSetting("twoFactorAuth", val)}
                />

                <div className="sa-settings-divider" />

                <div className="sa-settings-fields">
                  <label className="sa-settings-field">
                    <span>Session timeout</span>
                    <select
                      value={settings.sessionTimeout}
                      onChange={(e) => updateSetting("sessionTimeout", e.target.value)}
                    >
                      <option value="15">15 minutes</option>
                      <option value="30">30 minutes</option>
                      <option value="60">60 minutes</option>
                      <option value="120">2 hours</option>
                    </select>
                    <small>Idle session invalidation threshold.</small>
                  </label>

                  <label className="sa-settings-field">
                    <span>Audit Log Retention</span>
                    <select
                      value={settings.auditRetention}
                      onChange={(e) => updateSetting("auditRetention", e.target.value)}
                    >
                      <option>30 Days</option>
                      <option>90 Days</option>
                      <option>180 Days</option>
                      <option>365 Days</option>
                    </select>
                    <small>Historical compliance archival window.</small>
                  </label>
                </div>
              </>
            )}

            {activeTab === "notifications" && (
              <>
                <div className="sa-settings-section-heading">
                  <div className="sa-settings-section-icon">
                    <Bell size={20} />
                  </div>
                  <div>
                    <h2>Notifications &amp; Alerts</h2>
                    <p>Configure automated emails, weekly digests, and security alerts.</p>
                  </div>
                </div>

                <SettingToggle
                  title="System email notifications"
                  description="Enables transactional platform emails for invitation links and account updates."
                  checked={settings.emailNotifications}
                  onChange={(val) => updateSetting("emailNotifications", val)}
                />

                <SettingToggle
                  title="Security alerts"
                  description="Dispatches high-priority security warnings for unexpected login events."
                  checked={settings.securityAlerts}
                  onChange={(val) => updateSetting("securityAlerts", val)}
                />

                <SettingToggle
                  title="Executive weekly digest"
                  description="Dispatches an automated Monday morning summary of tenant metrics."
                  checked={settings.weeklyReports}
                  onChange={(val) => updateSetting("weeklyReports", val)}
                />
              </>
            )}

            {activeTab === "profile" && (
              <>
                <div className="sa-settings-section-heading">
                  <div className="sa-settings-section-icon">
                    <UserRound size={20} />
                  </div>
                  <div>
                    <h2>Admin Profile</h2>
                    <p>Manage the display identity for the active administrator.</p>
                  </div>
                </div>

                <div className="sa-settings-profile-card">
                  <div className="sa-settings-avatar">
                    {(settings.adminName || "SA")
                      .trim()
                      .split(/\s+/)
                      .slice(0, 2)
                      .map((word) => word[0])
                      .join("")
                      .toUpperCase()}
                  </div>
                  <div>
                    <strong>{settings.adminName || "Administrator"}</strong>
                    <span>Super Administrator</span>
                  </div>
                </div>

                <div className="sa-settings-fields">
                  <label className="sa-settings-field">
                    <span>Full name</span>
                    <input
                      value={settings.adminName}
                      onChange={(e) => updateSetting("adminName", e.target.value)}
                      required
                    />
                  </label>

                  <label className="sa-settings-field">
                    <span>Admin email</span>
                    <input
                      type="email"
                      value={settings.adminEmail}
                      onChange={(e) => updateSetting("adminEmail", e.target.value)}
                      required
                    />
                  </label>
                </div>
              </>
            )}

            <div className="sa-settings-footer">
              <button
                type="button"
                className="sa-settings-reset"
                onClick={handleReset}
              >
                <RotateCcw size={16} />
                Restore defaults
              </button>

              <button type="submit" className="sa-settings-save">
                <Save size={17} />
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* QUICK EDIT MODAL */}
      {editingParam && (
        <div
          className="subscriptions-modal-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget) setEditingParam(null);
          }}
        >
          <div className="subscriptions-modal subscriptions-form-modal" style={{ maxWidth: 460 }}>
            <header className="subscriptions-view-header">
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span className="subscriptions-modal-icon">
                  <Pencil size={18} />
                </span>
                <div>
                  <h3 style={{ margin: 0, fontSize: 16 }}>Edit Parameter Value</h3>
                  <small style={{ color: "var(--sa-text-muted)" }}>{editingParam.key}</small>
                </div>
              </div>
              <button
                type="button"
                className="subscriptions-icon-button"
                onClick={() => setEditingParam(null)}
              >
                <X size={16} />
              </button>
            </header>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setEditingParam(null);
                setMessage(`Updated ${editingParam.name} successfully.`);
              }}
              style={{ padding: 20 }}
            >
              <label className="subscriptions-form-label" style={{ display: "block", marginBottom: 16 }}>
                <span style={{ display: "block", marginBottom: 6, fontWeight: 600 }}>{editingParam.name}</span>
                {editingParam.type === "boolean" ? (
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <button
                      type="button"
                      role="switch"
                      className={`sa-settings-switch ${settings[editingParam.stateKey] ? "on" : ""}`}
                      onClick={() => handleToggle(editingParam)}
                    >
                      <span />
                    </button>
                    <span>{settings[editingParam.stateKey] ? "Enabled" : "Disabled"}</span>
                  </div>
                ) : editingParam.type === "select" ? (
                  <select
                    className="subscriptions-form-input"
                    value={String(settings[editingParam.stateKey] ?? "")}
                    onChange={(ev) => updateSetting(editingParam.stateKey, ev.target.value)}
                  >
                    {editingParam.options?.map((opt) => (
                      <option key={opt} value={opt}>
                        {editingParam.optionsDisplay ? editingParam.optionsDisplay[opt] || opt : opt}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    className="subscriptions-form-input"
                    value={String(settings[editingParam.stateKey] ?? "")}
                    onChange={(ev) => updateSetting(editingParam.stateKey, ev.target.value)}
                    required
                  />
                )}
                <small style={{ display: "block", marginTop: 6, color: "var(--sa-text-muted)" }}>
                  {editingParam.description}
                </small>
              </label>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                <button
                  type="button"
                  className="subscriptions-button subscriptions-button-light"
                  onClick={() => setEditingParam(null)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="subscriptions-button subscriptions-button-primary"
                >
                  <Save size={15} /> Save Parameter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD PARAMETER MODAL */}
      {showAddModal && (
        <div
          className="subscriptions-modal-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowAddModal(false);
          }}
        >
          <div className="subscriptions-modal subscriptions-form-modal" style={{ maxWidth: 500 }}>
            <header className="subscriptions-view-header">
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span className="subscriptions-modal-icon">
                  <Plus size={18} />
                </span>
                <div>
                  <h3 style={{ margin: 0, fontSize: 16 }}>Add Platform Parameter</h3>
                  <small style={{ color: "var(--sa-text-muted)" }}>Register a new configuration key</small>
                </div>
              </div>
              <button
                type="button"
                className="subscriptions-icon-button"
                onClick={() => setShowAddModal(false)}
              >
                <X size={16} />
              </button>
            </header>

            <form onSubmit={handleAddCustomParam} style={{ padding: 20 }}>
              <div style={{ display: "grid", gap: 14 }}>
                <label className="subscriptions-form-label">
                  <span>Parameter Key *</span>
                  <input
                    className="subscriptions-form-input"
                    placeholder="e.g. integrations.slack_webhook_url"
                    value={newParamForm.key}
                    onChange={(e) => setNewParamForm({ ...newParamForm, key: e.target.value })}
                    required
                  />
                </label>

                <label className="subscriptions-form-label">
                  <span>Display Name *</span>
                  <input
                    className="subscriptions-form-input"
                    placeholder="e.g. Slack Webhook Dispatcher"
                    value={newParamForm.name}
                    onChange={(e) => setNewParamForm({ ...newParamForm, name: e.target.value })}
                    required
                  />
                </label>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <label className="subscriptions-form-label">
                    <span>Category</span>
                    <select
                      className="subscriptions-form-input"
                      value={newParamForm.category}
                      onChange={(e) => setNewParamForm({ ...newParamForm, category: e.target.value })}
                    >
                      <option>General</option>
                      <option>Security</option>
                      <option>Notifications</option>
                      <option>Admin Profile</option>
                      <option>System Limits</option>
                    </select>
                  </label>

                  <label className="subscriptions-form-label">
                    <span>Data Type</span>
                    <select
                      className="subscriptions-form-input"
                      value={newParamForm.type}
                      onChange={(e) => setNewParamForm({ ...newParamForm, type: e.target.value })}
                    >
                      <option value="string">Text / String</option>
                      <option value="boolean">Toggle / Switch</option>
                    </select>
                  </label>
                </div>

                <label className="subscriptions-form-label">
                  <span>Initial Value</span>
                  <input
                    className="subscriptions-form-input"
                    placeholder="e.g. https://hooks.slack.com/..."
                    value={newParamForm.value}
                    onChange={(e) => setNewParamForm({ ...newParamForm, value: e.target.value })}
                  />
                </label>

                <label className="subscriptions-form-label">
                  <span>Description</span>
                  <textarea
                    className="subscriptions-form-input"
                    rows={2}
                    placeholder="Briefly describe what this configuration controls..."
                    value={newParamForm.description}
                    onChange={(e) => setNewParamForm({ ...newParamForm, description: e.target.value })}
                  />
                </label>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 18 }}>
                <button
                  type="button"
                  className="subscriptions-button subscriptions-button-light"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="subscriptions-button subscriptions-button-primary"
                >
                  <Plus size={15} /> Add Parameter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function SettingToggle({
  title,
  description,
  checked,
  onChange,
  warning = false,
}) {
  return (
    <div className="sa-settings-toggle-row">
      <div className="sa-settings-toggle-copy">
        <strong>{title}</strong>
        <p>{description}</p>
        {warning && checked && (
          <small className="sa-settings-warning">
            Demo only: this does not block access to the application.
          </small>
        )}
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={title}
        className={`sa-settings-switch ${checked ? "on" : ""}`}
        onClick={() => onChange(!checked)}
      >
        <span />
      </button>
    </div>
  );
}

export default Settings;
