import { useState, useMemo } from "react";
import {
  Shield,
  ShieldCheck,
  Lock,
  Key,
  Globe,
  Smartphone,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  X,
  LogOut,
  ArrowUpRight,
  Clock,
  Search,
  Filter,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Download,
  Trash2,
  Eye,
  Laptop,
  Check,
} from "lucide-react";
import "./SuperAdminCommon.css";
import "./Security.css";

const INITIAL_SESSIONS = [
  {
    id: "SES-101",
    device: "Chrome 130 on Windows 11 Pro",
    ip: "192.168.1.104",
    location: "New Delhi, India",
    isCurrent: true,
    lastActive: "Active right now",
    status: "Active",
    loginTime: "2026-10-27 08:15 AM",
    browser: "Chrome 130.0",
    os: "Windows 11",
  },
  {
    id: "SES-102",
    device: "Safari 18 on macOS Sequoia",
    ip: "103.21.244.12",
    location: "Mumbai, India",
    isCurrent: false,
    lastActive: "2 hours ago",
    status: "Active",
    loginTime: "2026-10-27 06:12 AM",
    browser: "Safari 18.0",
    os: "macOS",
  },
  {
    id: "SES-103",
    device: "TeamFlow AI Mobile App on iOS 18",
    ip: "182.72.18.90",
    location: "Bengaluru, India",
    isCurrent: false,
    lastActive: "Yesterday, 08:30 PM",
    status: "Active",
    loginTime: "2026-10-26 08:30 PM",
    browser: "Mobile Native",
    os: "iOS 18",
  },
  {
    id: "SES-104",
    device: "Firefox 131 on Ubuntu 24.04 LTS",
    ip: "49.205.122.45",
    location: "Hyderabad, India",
    isCurrent: false,
    lastActive: "3 days ago",
    status: "Active",
    loginTime: "2026-10-24 11:45 AM",
    browser: "Firefox 131.0",
    os: "Linux",
  },
  {
    id: "SES-105",
    device: "Edge 129 on Windows 10 Workstation",
    ip: "103.45.67.89",
    location: "Pune, India",
    isCurrent: false,
    lastActive: "5 days ago",
    status: "Active",
    loginTime: "2026-10-22 03:15 PM",
    browser: "Edge 129.0",
    os: "Windows 10",
  },
];

const INITIAL_SECURITY_EVENTS = [
  {
    id: "EVT-901",
    time: "Today, 10:20 AM",
    event: "Organization Suspended",
    actor: "Himanshu (Super Admin)",
    ip: "192.168.1.104",
    severity: "Medium",
    details: "Suspended XYZ Software due to payment audit",
    action: "TENANT_SUSPEND",
  },
  {
    id: "EVT-902",
    time: "Today, 08:15 AM",
    event: "Super Admin 2FA Login",
    actor: "Himanshu (Super Admin)",
    ip: "192.168.1.104",
    severity: "Low",
    details: "Successful TOTP verification code entered",
    action: "AUTH_TOTP_SUCCESS",
  },
  {
    id: "EVT-903",
    time: "Yesterday, 11:42 PM",
    event: "Blocked Brute Force Probe",
    actor: "System Firewall",
    ip: "45.142.120.8",
    severity: "High",
    details: "Auto-banned IP after 5 invalid password attempts",
    action: "FIREWALL_BLOCK",
  },
  {
    id: "EVT-904",
    time: "Yesterday, 04:10 PM",
    event: "SMTP Credentials Updated",
    actor: "Himanshu (Super Admin)",
    ip: "192.168.1.104",
    severity: "Medium",
    details: "Rotated SendGrid production API key",
    action: "CONFIG_CHANGE",
  },
  {
    id: "EVT-905",
    time: "Oct 25, 2026, 02:18 PM",
    event: "Role Permission Escalation",
    actor: "Priya Nair (Tenant Admin)",
    ip: "103.21.244.12",
    severity: "Low",
    details: "Assigned DevSecOps role to Vikram Singh",
    action: "RBAC_UPDATE",
  },
  {
    id: "EVT-906",
    time: "Oct 24, 2026, 09:30 AM",
    event: "Suspicious Location Access Flag",
    actor: "Unknown Session",
    ip: "194.26.29.112",
    severity: "High",
    details: "Blocked login attempt from blacklisted Tor exit node",
    action: "TOR_EXIT_BLOCK",
  },
  {
    id: "EVT-907",
    time: "Oct 23, 2026, 06:45 PM",
    event: "Session Revocation Broadcast",
    actor: "Himanshu (Super Admin)",
    ip: "192.168.1.104",
    severity: "Medium",
    details: "Terminated 4 inactive operator sessions globally",
    action: "SES_KILL_BATCH",
  },
];

function Security() {
  const [sessions, setSessions] = useState(INITIAL_SESSIONS);
  const [events, setEvents] = useState(INITIAL_SECURITY_EVENTS);
  const [securityRules, setSecurityRules] = useState({
    enforce2FA: true,
    autoTimeout: true,
    ipAllowlist: false,
    bruteForceProtection: true,
  });
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sessions Table State
  const [sessionSearch, setSessionSearch] = useState("");
  const [sessionFilter, setSessionFilter] = useState("all"); // "all" | "current" | "others"
  const [sessionDensity, setSessionDensity] = useState("standard");
  const [selectedSessionIds, setSelectedSessionIds] = useState(new Set());
  const [sessionPage, setSessionPage] = useState(1);
  const [sessionPageSize, setSessionPageSize] = useState(5);

  // Audit Events Table State
  const [eventSearch, setEventSearch] = useState("");
  const [eventSeverityFilter, setEventSeverityFilter] = useState("all");
  const [eventDensity, setEventDensity] = useState("standard");
  const [selectedEventIds, setSelectedEventIds] = useState(new Set());
  const [eventPage, setEventPage] = useState(1);
  const [eventPageSize, setEventPageSize] = useState(5);

  // Selected Detail Modal
  const [detailModalItem, setDetailModalItem] = useState(null);

  const handleRevokeSession = (id) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
    setSelectedSessionIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const handleRevokeAllOthers = () => {
    const active = sessions.filter((s) => s.isCurrent);
    setSessions(active);
    setSelectedSessionIds(new Set());
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleRevokeSelectedSessions = () => {
    setSessions((prev) => prev.filter((s) => s.isCurrent || !selectedSessionIds.has(s.id)));
    setSelectedSessionIds(new Set());
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleToggle = (key) => {
    setSecurityRules((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  // Filtered Sessions
  const filteredSessions = useMemo(() => {
    return sessions.filter((s) => {
      if (sessionFilter === "current" && !s.isCurrent) return false;
      if (sessionFilter === "others" && s.isCurrent) return false;

      if (!sessionSearch.trim()) return true;
      const q = sessionSearch.toLowerCase();
      return (
        s.id.toLowerCase().includes(q) ||
        s.device.toLowerCase().includes(q) ||
        s.ip.toLowerCase().includes(q) ||
        s.location.toLowerCase().includes(q)
      );
    });
  }, [sessions, sessionFilter, sessionSearch]);

  const paginatedSessions = useMemo(() => {
    const start = (sessionPage - 1) * sessionPageSize;
    return filteredSessions.slice(start, start + sessionPageSize);
  }, [filteredSessions, sessionPage]);

  const totalSessionPages = Math.ceil(filteredSessions.length / sessionPageSize) || 1;

  // Filtered Events
  const filteredEvents = useMemo(() => {
    return events.filter((ev) => {
      if (eventSeverityFilter !== "all" && ev.severity !== eventSeverityFilter) return false;

      if (!eventSearch.trim()) return true;
      const q = eventSearch.toLowerCase();
      return (
        ev.id.toLowerCase().includes(q) ||
        ev.event.toLowerCase().includes(q) ||
        ev.actor.toLowerCase().includes(q) ||
        ev.ip.toLowerCase().includes(q) ||
        ev.details.toLowerCase().includes(q)
      );
    });
  }, [events, eventSeverityFilter, eventSearch]);

  const paginatedEvents = useMemo(() => {
    const start = (eventPage - 1) * eventPageSize;
    return filteredEvents.slice(start, start + eventPageSize);
  }, [filteredEvents, eventPage]);

  const totalEventPages = Math.ceil(filteredEvents.length / eventPageSize) || 1;

  // Session selection handlers
  const handleSelectAllSessions = (e) => {
    if (e.target.checked) {
      const revocable = filteredSessions.filter((s) => !s.isCurrent).map((s) => s.id);
      setSelectedSessionIds(new Set(revocable));
    } else {
      setSelectedSessionIds(new Set());
    }
  };

  const handleToggleSessionSelect = (id) => {
    setSelectedSessionIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Event selection handlers
  const handleSelectAllEvents = (e) => {
    if (e.target.checked) {
      setSelectedEventIds(new Set(filteredEvents.map((ev) => ev.id)));
    } else {
      setSelectedEventIds(new Set());
    }
  };

  const handleToggleEventSelect = (id) => {
    setSelectedEventIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleExportEventsCSV = () => {
    const dataToExport = selectedEventIds.size > 0
      ? events.filter((e) => selectedEventIds.has(e.id))
      : filteredEvents;

    const headers = ["Event ID", "Timestamp", "Event Type", "Actor", "IP Address", "Severity", "Details"];
    const rows = dataToExport.map((e) => [
      e.id,
      e.time,
      e.event,
      e.actor,
      e.ip,
      e.severity,
      `"${e.details.replace(/"/g, '""')}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `security_audit_logs_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="sa-page-container sa-security-page">
      {/* 1. SAP Enterprise Header */}
      <section className="sap-header-panel">
        <div className="sa-page-header-left">
          <h1>Platform Security &amp; Access Control</h1>
          <p>Two-factor authentication enforcement, session management, and firewall telemetry.</p>
        </div>

        <div className="sa-page-header-actions">
          <button
            type="button"
            className="sa-btn sa-btn-danger"
            onClick={handleRevokeAllOthers}
          >
            <LogOut size={15} /> Revoke All Other Sessions
          </button>
        </div>
      </section>

      {/* 2. Top 4 KPI Stat Cards */}
      <section className="sap-kpi-grid">
        <article className="sa-kpi-card">
          <div className="sa-kpi-icon-box green">
            <ShieldCheck size={24} strokeWidth={2.2} />
          </div>
          <div className="sa-kpi-body">
            <p className="sa-kpi-title">Security Posture</p>
            <div className="sa-kpi-val-row">
              <span className="sa-kpi-value">98/100</span>
              <span className="sa-kpi-trend positive">
                <CheckCircle2 size={14} /> Excellent
              </span>
            </div>
            <span className="sa-kpi-subtitle">Zero active vulnerabilities</span>
          </div>
        </article>

        <article className="sa-kpi-card">
          <div className="sa-kpi-icon-box blue">
            <Smartphone size={24} strokeWidth={2.2} />
          </div>
          <div className="sa-kpi-body">
            <p className="sa-kpi-title">2FA Adoption</p>
            <div className="sa-kpi-val-row">
              <span className="sa-kpi-value">89%</span>
              <span className="sa-kpi-trend positive">
                <ArrowUpRight size={14} /> 6.4%
              </span>
            </div>
            <span className="sa-kpi-subtitle">Admins & Super Admins</span>
          </div>
        </article>

        <article className="sa-kpi-card">
          <div className="sa-kpi-icon-box amber">
            <Globe size={24} strokeWidth={2.2} />
          </div>
          <div className="sa-kpi-body">
            <p className="sa-kpi-title">Active Super Sessions</p>
            <div className="sa-kpi-val-row">
              <span className="sa-kpi-value">{sessions.length} Online</span>
              <span className="sa-kpi-trend positive">Verified</span>
            </div>
            <span className="sa-kpi-subtitle">TLS 1.3 encrypted</span>
          </div>
        </article>

        <article className="sa-kpi-card">
          <div className="sa-kpi-icon-box red">
            <AlertTriangle size={24} strokeWidth={2.2} />
          </div>
          <div className="sa-kpi-body">
            <p className="sa-kpi-title">Firewall Blocks</p>
            <div className="sa-kpi-val-row">
              <span className="sa-kpi-value">34 Probes</span>
              <span className="sa-kpi-trend positive">Auto-blocked</span>
            </div>
            <span className="sa-kpi-subtitle">Past 24 hours</span>
          </div>
        </article>
      </section>

      {saveSuccess && (
        <div className="sa-toast-banner">
          <CheckCircle2 size={16} /> Security policy rule updated successfully!
        </div>
      )}

      {/* 3. Security Policy Toggles */}
      <section className="sa-card sa-security-rules-card" style={{ marginBottom: 20 }}>
        <div className="sa-card-header">
          <div>
            <h3 style={{ margin: 0, fontSize: 16 }}>Platform Governance Policies</h3>
            <p style={{ margin: "4px 0 0", color: "#64748b", fontSize: 12 }}>
              Configure perimeter access safeguards and authentication enforcement rules
            </p>
          </div>
        </div>

        <div className="sa-rules-grid">
          <div className="sa-rule-row">
            <div>
              <strong>Enforce Two-Factor Authentication (2FA)</strong>
              <p>Require Google Authenticator or hardware security key for all Super Admin actions.</p>
            </div>
            <label className="sa-toggle-switch">
              <input
                type="checkbox"
                checked={securityRules.enforce2FA}
                onChange={() => handleToggle("enforce2FA")}
              />
              <span className="sa-toggle-slider" />
            </label>
          </div>

          <div className="sa-rule-row">
            <div>
              <strong>Inactivity Session Timeout (30 Mins)</strong>
              <p>Automatically invalidate session tokens after 30 minutes of idle inactivity.</p>
            </div>
            <label className="sa-toggle-switch">
              <input
                type="checkbox"
                checked={securityRules.autoTimeout}
                onChange={() => handleToggle("autoTimeout")}
              />
              <span className="sa-toggle-slider" />
            </label>
          </div>

          <div className="sa-rule-row">
            <div>
              <strong>IP Allowlist Restriction for Super Admin Console</strong>
              <p>Restrict console access exclusively to registered corporate office VPN addresses.</p>
            </div>
            <label className="sa-toggle-switch">
              <input
                type="checkbox"
                checked={securityRules.ipAllowlist}
                onChange={() => handleToggle("ipAllowlist")}
              />
              <span className="sa-toggle-slider" />
            </label>
          </div>

          <div className="sa-rule-row">
            <div>
              <strong>Automated Brute Force & Rate Limit Lockdown</strong>
              <p>Temporary 24h ban for IP addresses exceeding 5 consecutive failed authentications.</p>
            </div>
            <label className="sa-toggle-switch">
              <input
                type="checkbox"
                checked={securityRules.bruteForceProtection}
                onChange={() => handleToggle("bruteForceProtection")}
              />
              <span className="sa-toggle-slider" />
            </label>
          </div>
        </div>
      </section>

      {/* 4. Active Sessions Table - SaaS Enterprise Table Card */}
      <section className="sap-table-card" style={{ marginBottom: 24 }}>
        {/* Batch action banner */}
        {selectedSessionIds.size > 0 && (
          <div className="sap-batch-banner">
            <span>
              <strong>{selectedSessionIds.size}</strong> sessions selected
            </span>
            <div className="sap-batch-actions">
              <button
                type="button"
                className="sa-btn sa-btn-danger sa-btn-sm"
                onClick={handleRevokeSelectedSessions}
              >
                <Trash2 size={13} /> Terminate Selected ({selectedSessionIds.size})
              </button>
              <button
                type="button"
                className="sa-btn sa-btn-sm"
                style={{ background: "transparent", color: "inherit", border: 0 }}
                onClick={() => setSelectedSessionIds(new Set())}
              >
                Clear
              </button>
            </div>
          </div>
        )}

        {/* Toolbar */}
        <div className="sap-toolbar">
          <div className="sap-search-input">
            <Search size={15} />
            <input
              type="text"
              placeholder="Search sessions by device, IP, or location..."
              value={sessionSearch}
              onChange={(e) => {
                setSessionSearch(e.target.value);
                setSessionPage(1);
              }}
            />
            {sessionSearch && (
              <button
                type="button"
                onClick={() => {
                  setSessionSearch("");
                  setSessionPage(1);
                }}
              >
                <X size={13} />
              </button>
            )}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div className="sap-filter-select">
              <Filter size={14} />
              <select
                value={sessionFilter}
                onChange={(e) => {
                  setSessionFilter(e.target.value);
                  setSessionPage(1);
                }}
              >
                <option value="all">All Devices ({sessions.length})</option>
                <option value="current">Current Device</option>
                <option value="others">Other Devices</option>
              </select>
            </div>

            <button
              type="button"
              className="sap-icon-btn"
              title={`Switch density (currently ${sessionDensity})`}
              onClick={() =>
                setSessionDensity((prev) => (prev === "standard" ? "compact" : "standard"))
              }
            >
              <SlidersHorizontal size={15} />
            </button>
          </div>
        </div>

        {/* Sessions Table */}
        <div className="sa-table-wrapper">
          <table className={`sap-grid is-${sessionDensity}`}>
            <thead>
              <tr>
                <th style={{ width: 40, textAlign: "center" }}>
                  <input
                    type="checkbox"
                    checked={
                      filteredSessions.filter((s) => !s.isCurrent).length > 0 &&
                      filteredSessions
                        .filter((s) => !s.isCurrent)
                        .every((s) => selectedSessionIds.has(s.id))
                    }
                    onChange={handleSelectAllSessions}
                    aria-label="Select all other sessions"
                  />
                </th>
                <th>Device & Client</th>
                <th>IP Address</th>
                <th>Approx. Location</th>
                <th>Login Time</th>
                <th>Last Active</th>
                <th>Security State</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedSessions.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: "center", padding: "36px 16px", color: "#64748b" }}>
                    No active sessions matched your search filters.
                  </td>
                </tr>
              ) : (
                paginatedSessions.map((ses) => (
                  <tr key={ses.id}>
                    <td style={{ textAlign: "center" }}>
                      {!ses.isCurrent && (
                        <input
                          type="checkbox"
                          checked={selectedSessionIds.has(ses.id)}
                          onChange={() => handleToggleSessionSelect(ses.id)}
                        />
                      )}
                    </td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: 6,
                            backgroundColor: ses.isCurrent ? "#e0f2fe" : "#f1f5f9",
                            color: ses.isCurrent ? "#0284c7" : "#475569",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {ses.device.includes("Mobile") ? <Smartphone size={16} /> : <Laptop size={16} />}
                        </div>
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <strong>{ses.device}</strong>
                            {ses.isCurrent && (
                              <span className="sap-status-pill green">
                                Current Device
                              </span>
                            )}
                          </div>
                          <span style={{ fontSize: 11, color: "#64748b" }}>{ses.browser} · {ses.os}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <code className="sap-id-cell">{ses.ip}</code>
                    </td>
                    <td>{ses.location}</td>
                    <td style={{ fontSize: 12, color: "#64748b" }}>{ses.loginTime}</td>
                    <td style={{ fontSize: 12, color: "#475569" }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                        <Clock size={12} style={{ color: ses.isCurrent ? "#10b981" : "#94a3b8" }} />
                        {ses.lastActive}
                      </span>
                    </td>
                    <td>
                      <span className={`sap-status-pill ${ses.isCurrent ? "green" : "blue"}`}>
                        TLS 1.3 Verified
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      {ses.isCurrent ? (
                        <span style={{ color: "#10b981", fontSize: 12, fontWeight: 600 }}>
                          Active Now
                        </span>
                      ) : (
                        <button
                          type="button"
                          className="sa-btn sa-btn-secondary sa-btn-sm"
                          style={{ color: "#dc2626", borderColor: "#fecaca" }}
                          onClick={() => handleRevokeSession(ses.id)}
                        >
                          Revoke
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="sap-footer-bar">
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ fontSize: 12.5, color: "#64748b" }}>
              Showing <strong>{filteredSessions.length === 0 ? 0 : (sessionPage - 1) * sessionPageSize + 1}</strong> to{" "}
              <strong>{Math.min(sessionPage * sessionPageSize, filteredSessions.length)}</strong> of{" "}
              <strong>{filteredSessions.length}</strong> active devices
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#64748b" }}>
              <span>Rows per page:</span>
              <select
                className="sap-filter-select"
                style={{ padding: "3px 6px", fontSize: 12, height: 26 }}
                value={sessionPageSize}
                onChange={(e) => {
                  setSessionPageSize(Number(e.target.value));
                  setSessionPage(1);
                }}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>

          <div style={{ display: "flex", gap: 6 }}>
            <button
              type="button"
              className="sap-page-btn"
              disabled={sessionPage <= 1}
              onClick={() => setSessionPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft size={14} />
            </button>
            <span style={{ fontSize: 12.5, padding: "4px 8px", color: "#475569" }}>
              Page {sessionPage} of {totalSessionPages}
            </span>
            <button
              type="button"
              className="sap-page-btn"
              disabled={sessionPage >= totalSessionPages}
              onClick={() => setSessionPage((p) => Math.min(totalSessionPages, p + 1))}
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* 5. Security Audit Trail Table - SaaS Enterprise Table Card */}
      <section className="sap-table-card">
        {/* Batch action banner */}
        {selectedEventIds.size > 0 && (
          <div className="sap-batch-banner">
            <span>
              <strong>{selectedEventIds.size}</strong> audit records selected
            </span>
            <div className="sap-batch-actions">
              <button
                type="button"
                className="sa-btn sa-btn-secondary sa-btn-sm"
                onClick={handleExportEventsCSV}
              >
                <Download size={13} /> Export Selected ({selectedEventIds.size})
              </button>
              <button
                type="button"
                className="sa-btn sa-btn-sm"
                style={{ background: "transparent", color: "inherit", border: 0 }}
                onClick={() => setSelectedEventIds(new Set())}
              >
                Clear
              </button>
            </div>
          </div>
        )}

        {/* Toolbar */}
        <div className="sap-toolbar">
          <div className="sap-search-input">
            <Search size={15} />
            <input
              type="text"
              placeholder="Search audit trail by event type, actor, IP, or details..."
              value={eventSearch}
              onChange={(e) => {
                setEventSearch(e.target.value);
                setEventPage(1);
              }}
            />
            {eventSearch && (
              <button
                type="button"
                onClick={() => {
                  setEventSearch("");
                  setEventPage(1);
                }}
              >
                <X size={13} />
              </button>
            )}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div className="sap-filter-select">
              <Filter size={14} />
              <select
                value={eventSeverityFilter}
                onChange={(e) => {
                  setEventSeverityFilter(e.target.value);
                  setEventPage(1);
                }}
              >
                <option value="all">All Severities</option>
                <option value="High">High Severity</option>
                <option value="Medium">Medium Severity</option>
                <option value="Low">Low Severity</option>
              </select>
            </div>

            <button
              type="button"
              className="sa-btn sa-btn-secondary sa-btn-sm"
              onClick={handleExportEventsCSV}
              title="Export filtered records to CSV"
            >
              <Download size={14} /> Export CSV
            </button>

            <button
              type="button"
              className="sap-icon-btn"
              title={`Switch density (currently ${eventDensity})`}
              onClick={() =>
                setEventDensity((prev) => (prev === "standard" ? "compact" : "standard"))
              }
            >
              <SlidersHorizontal size={15} />
            </button>
          </div>
        </div>

        {/* Events Table */}
        <div className="sa-table-wrapper">
          <table className={`sap-grid is-${eventDensity}`}>
            <thead>
              <tr>
                <th style={{ width: 40, textAlign: "center" }}>
                  <input
                    type="checkbox"
                    checked={
                      filteredEvents.length > 0 &&
                      filteredEvents.every((ev) => selectedEventIds.has(ev.id))
                    }
                    onChange={handleSelectAllEvents}
                    aria-label="Select all audit events"
                  />
                </th>
                <th>Event ID</th>
                <th>Timestamp</th>
                <th>Event Type</th>
                <th>Actor Identity</th>
                <th>Origin IP</th>
                <th>Risk Level</th>
                <th>Audit Details</th>
                <th style={{ textAlign: "right" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedEvents.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: "center", padding: "36px 16px", color: "#64748b" }}>
                    No security events matched your search criteria.
                  </td>
                </tr>
              ) : (
                paginatedEvents.map((ev) => (
                  <tr key={ev.id}>
                    <td style={{ textAlign: "center" }}>
                      <input
                        type="checkbox"
                        checked={selectedEventIds.has(ev.id)}
                        onChange={() => handleToggleEventSelect(ev.id)}
                      />
                    </td>
                    <td>
                      <code className="sap-id-cell">{ev.id}</code>
                    </td>
                    <td style={{ fontSize: 12, color: "#64748b" }}>{ev.time}</td>
                    <td>
                      <strong>{ev.event}</strong>
                    </td>
                    <td>
                      <span className="sap-user-badge">{ev.actor}</span>
                    </td>
                    <td>
                      <code className="sap-id-cell">{ev.ip}</code>
                    </td>
                    <td>
                      <span
                        className={`sap-status-pill ${
                          ev.severity === "High"
                            ? "red"
                            : ev.severity === "Medium"
                            ? "amber"
                            : "green"
                        }`}
                      >
                        {ev.severity}
                      </span>
                    </td>
                    <td style={{ color: "#334155", fontSize: 12.5, maxWidth: 320 }}>
                      {ev.details}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <button
                        type="button"
                        className="sap-icon-btn"
                        title="View Event Forensic Details"
                        onClick={() => setDetailModalItem(ev)}
                      >
                        <Eye size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="sap-footer-bar">
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ fontSize: 12.5, color: "#64748b" }}>
              Showing <strong>{filteredEvents.length === 0 ? 0 : (eventPage - 1) * eventPageSize + 1}</strong> to{" "}
              <strong>{Math.min(eventPage * eventPageSize, filteredEvents.length)}</strong> of{" "}
              <strong>{filteredEvents.length}</strong> immutable events
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#64748b" }}>
              <span>Rows per page:</span>
              <select
                className="sap-filter-select"
                style={{ padding: "3px 6px", fontSize: 12, height: 26 }}
                value={eventPageSize}
                onChange={(e) => {
                  setEventPageSize(Number(e.target.value));
                  setEventPage(1);
                }}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>

          <div style={{ display: "flex", gap: 6 }}>
            <button
              type="button"
              className="sap-page-btn"
              disabled={eventPage <= 1}
              onClick={() => setEventPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft size={14} />
            </button>
            <span style={{ fontSize: 12.5, padding: "4px 8px", color: "#475569" }}>
              Page {eventPage} of {totalEventPages}
            </span>
            <button
              type="button"
              className="sap-page-btn"
              disabled={eventPage >= totalEventPages}
              onClick={() => setEventPage((p) => Math.min(totalEventPages, p + 1))}
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* Forensic Detail Modal */}
      {detailModalItem && (
        <div className="sa-modal-backdrop" onClick={() => setDetailModalItem(null)}>
          <div
            className="sa-modal-content"
            style={{ maxWidth: 540 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sa-modal-header">
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <ShieldCheck size={20} color="#3b66ff" />
                <h3 style={{ margin: 0 }}>Security Incident Telemetry</h3>
              </div>
              <button
                type="button"
                className="sa-modal-close"
                onClick={() => setDetailModalItem(null)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="sa-modal-body" style={{ padding: "20px 24px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }}>
                <div>
                  <span style={{ fontSize: 11, color: "#64748b", textTransform: "uppercase" }}>Event ID</span>
                  <p style={{ margin: "4px 0 0", fontFamily: "monospace", fontWeight: 700 }}>
                    {detailModalItem.id}
                  </p>
                </div>
                <div>
                  <span style={{ fontSize: 11, color: "#64748b", textTransform: "uppercase" }}>Timestamp</span>
                  <p style={{ margin: "4px 0 0", fontWeight: 600 }}>{detailModalItem.time}</p>
                </div>
                <div>
                  <span style={{ fontSize: 11, color: "#64748b", textTransform: "uppercase" }}>Event Category</span>
                  <p style={{ margin: "4px 0 0", fontWeight: 600 }}>{detailModalItem.event}</p>
                </div>
                <div>
                  <span style={{ fontSize: 11, color: "#64748b", textTransform: "uppercase" }}>Risk Severity</span>
                  <p style={{ margin: "4px 0 0" }}>
                    <span
                      className={`sap-status-pill ${
                        detailModalItem.severity === "High"
                          ? "red"
                          : detailModalItem.severity === "Medium"
                          ? "amber"
                          : "green"
                      }`}
                    >
                      {detailModalItem.severity}
                    </span>
                  </p>
                </div>
                <div>
                  <span style={{ fontSize: 11, color: "#64748b", textTransform: "uppercase" }}>Actor Principal</span>
                  <p style={{ margin: "4px 0 0", fontWeight: 600 }}>{detailModalItem.actor}</p>
                </div>
                <div>
                  <span style={{ fontSize: 11, color: "#64748b", textTransform: "uppercase" }}>IP Address</span>
                  <p style={{ margin: "4px 0 0", fontFamily: "monospace" }}>{detailModalItem.ip}</p>
                </div>
              </div>

              <div>
                <span style={{ fontSize: 11, color: "var(--sa-text-secondary, #64748b)", textTransform: "uppercase" }}>Event Description & Payload</span>
                <div
                  style={{
                    marginTop: 6,
                    padding: 12,
                    background: "var(--sa-bg, #f8fafc)",
                    border: "1px solid var(--sa-border, #e2e8f0)",
                    borderRadius: 6,
                    fontSize: 13,
                    color: "var(--sa-text-main, #1e293b)",
                  }}
                >
                  {detailModalItem.details}
                </div>
              </div>
            </div>

            <div className="sa-modal-footer">
              <button
                type="button"
                className="sa-btn sa-btn-secondary"
                onClick={() => setDetailModalItem(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Security;
