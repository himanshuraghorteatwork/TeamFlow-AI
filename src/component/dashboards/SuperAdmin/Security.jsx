import { useState, useMemo, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
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
  Copy,
  Terminal,
  Activity,
  Fingerprint,
  RefreshCw,
  Sliders,
  UserCheck,
  Server,
  Wifi,
  Radio,
  FileCode,
  Zap,
} from "lucide-react";
import "./SuperAdminCommon.css";
import "./Security.css";

// High-fidelity active super admin session records
const INITIAL_SESSIONS = [
  {
    id: "SES-101",
    device: "Chrome 130 on Windows 11 Pro",
    ip: "192.168.1.104",
    network: "Corporate VPN (IPSec / WireGuard)",
    location: "New Delhi, India",
    isCurrent: true,
    lastActive: "Active right now",
    status: "Active",
    loginTime: "2026-10-28 08:15 AM",
    browser: "Chrome 130.0 Enterprise",
    os: "Windows 11 Pro (x64)",
    tlsCipher: "TLS 1.3 / AES-256-GCM / ECDHE",
    clientType: "desktop",
    expiresIn: "7 hours 45 mins",
  },
  {
    id: "SES-102",
    device: "Safari 18 on macOS Sequoia",
    ip: "103.21.244.12",
    network: "Encrypted Fiber Peering",
    location: "Mumbai, India",
    isCurrent: false,
    lastActive: "2 hours ago",
    status: "Active",
    loginTime: "2026-10-28 06:12 AM",
    browser: "Safari 18.0.1",
    os: "macOS 15.0 Sequoia (Apple Silicon M3)",
    tlsCipher: "TLS 1.3 / ChaCha20-Poly1305",
    clientType: "desktop",
    expiresIn: "5 hours 12 mins",
  },
  {
    id: "SES-103",
    device: "TeamFlow AI Mobile App on iOS 18",
    ip: "182.72.18.90",
    network: "Cellular 5G (Airtel Secure APN)",
    location: "Bengaluru, India",
    isCurrent: false,
    lastActive: "Yesterday, 08:30 PM",
    status: "Active",
    loginTime: "2026-10-27 08:30 PM",
    browser: "TeamFlow Native iOS v2.4",
    os: "iOS 18.1 (iPhone 16 Pro)",
    tlsCipher: "TLS 1.3 / AES-128-GCM / Mutual TLS",
    clientType: "mobile",
    expiresIn: "18 hours 20 mins",
  },
  {
    id: "SES-104",
    device: "Firefox 131 on Ubuntu 24.04 LTS",
    ip: "49.205.122.45",
    network: "DevOps Bastion Gateway",
    location: "Hyderabad, India",
    isCurrent: false,
    lastActive: "3 days ago",
    status: "Active",
    loginTime: "2026-10-25 11:45 AM",
    browser: "Firefox Developer Edition 131",
    os: "Ubuntu Linux 24.04 LTS (x86_64)",
    tlsCipher: "TLS 1.3 / AES-256-GCM",
    clientType: "desktop",
    expiresIn: "2 days 4 hours",
  },
  {
    id: "SES-105",
    device: "Edge 129 on Windows 10 Workstation",
    ip: "103.45.67.89",
    network: "Authorized Office Subnet",
    location: "Pune, India",
    isCurrent: false,
    lastActive: "5 days ago",
    status: "Active",
    loginTime: "2026-10-23 03:15 PM",
    browser: "Microsoft Edge 129.0",
    os: "Windows 10 Enterprise",
    tlsCipher: "TLS 1.3 / AES-256-GCM",
    clientType: "desktop",
    expiresIn: "4 days 10 hours",
  },
];

// Rich immutable security audit trail
const INITIAL_SECURITY_EVENTS = [
  {
    id: "EVT-908",
    time: "Today, 11:45 AM",
    event: "WAF Rate Limit Enforced",
    actor: "Cloudflare Autonomous WAF",
    ip: "185.220.101.42",
    severity: "High",
    riskScore: "8.6 / 10",
    endpoint: "POST /api/v1/auth/token",
    details: "Blocked coordinated credential-stuffing probe exceeding 200 req/min from blacklisted ASN.",
    action: "FIREWALL_DROP",
    mitreCode: "T1110.004 (Credential Stuffing)",
  },
  {
    id: "EVT-907",
    time: "Today, 10:20 AM",
    event: "Organization Suspended",
    actor: "Himanshu (Super Admin)",
    ip: "192.168.1.104",
    severity: "Medium",
    riskScore: "5.4 / 10",
    endpoint: "PATCH /api/v1/superadmin/orgs/ORG-008",
    details: "Suspended XYZ Software due to billing audit anomaly and token abuse threshold.",
    action: "TENANT_SUSPEND",
    mitreCode: "T1078 (Valid Accounts)",
  },
  {
    id: "EVT-906",
    time: "Today, 08:15 AM",
    event: "Super Admin 2FA Login",
    actor: "Himanshu (Super Admin)",
    ip: "192.168.1.104",
    severity: "Low",
    riskScore: "1.2 / 10",
    endpoint: "POST /api/v1/auth/totp/verify",
    details: "Successful hardware WebAuthn / TOTP challenge verification code entered.",
    action: "AUTH_TOTP_SUCCESS",
    mitreCode: "T1556 (Modify Auth Process)",
  },
  {
    id: "EVT-905",
    time: "Yesterday, 11:42 PM",
    event: "Blocked Brute Force Probe",
    actor: "System Firewall Operator",
    ip: "45.142.120.8",
    severity: "High",
    riskScore: "8.9 / 10",
    endpoint: "POST /api/v1/superadmin/login",
    details: "Automated 24h IP quarantine enforced after 5 consecutive invalid authentication attempts.",
    action: "FIREWALL_BLOCK",
    mitreCode: "T1110.001 (Password Guessing)",
  },
  {
    id: "EVT-904",
    time: "Yesterday, 04:10 PM",
    event: "SMTP Credentials Rotated",
    actor: "Himanshu (Super Admin)",
    ip: "192.168.1.104",
    severity: "Medium",
    riskScore: "4.8 / 10",
    endpoint: "PUT /api/v1/superadmin/email/credentials",
    details: "Rotated SendGrid production API key and refreshed KMS encrypted parameter store.",
    action: "CONFIG_CHANGE",
    mitreCode: "T1098 (Account Manipulation)",
  },
  {
    id: "EVT-903",
    time: "Oct 26, 2026, 02:18 PM",
    event: "Role Permission Escalation",
    actor: "Priya Nair (Tenant Admin)",
    ip: "103.21.244.12",
    severity: "Low",
    riskScore: "2.5 / 10",
    endpoint: "POST /api/v1/rbac/roles/assign",
    details: "Assigned DevSecOps role to Vikram Singh with dual-operator approval receipt.",
    action: "RBAC_UPDATE",
    mitreCode: "T1078.004 (Cloud Accounts)",
  },
  {
    id: "EVT-902",
    time: "Oct 24, 2026, 09:30 AM",
    event: "Tor Exit Node Probed",
    actor: "Perimeter Shield Agent",
    ip: "194.26.29.112",
    severity: "High",
    riskScore: "9.1 / 10",
    endpoint: "CONNECT /internal/rpc",
    details: "Intercepted and dropped connection attempt originating from known Tor exit node router.",
    action: "TOR_EXIT_BLOCK",
    mitreCode: "T1090.003 (Multi-hop Proxy)",
  },
  {
    id: "EVT-901",
    time: "Oct 23, 2026, 06:45 PM",
    event: "Session Revocation Broadcast",
    actor: "Himanshu (Super Admin)",
    ip: "192.168.1.104",
    severity: "Medium",
    riskScore: "5.0 / 10",
    endpoint: "POST /api/v1/superadmin/sessions/revoke-batch",
    details: "Globally invalidated 4 idle operator session tokens and purged Redis session keys.",
    action: "SES_KILL_BATCH",
    mitreCode: "T1531 (Account Access Removal)",
  },
];

function Security() {
  const [sessions, setSessions] = useState(INITIAL_SESSIONS);
  const [events, setEvents] = useState(INITIAL_SECURITY_EVENTS);

  // 6 Enterprise Security Policies
  const [securityRules, setSecurityRules] = useState({
    enforce2FA: true,
    autoTimeout: true,
    ipAllowlist: false,
    bruteForceProtection: true,
    geoAnomaly: true,
    auditImmutability: true,
  });

  const [isScanning, setIsScanning] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [copiedField, setCopiedField] = useState(null);

  // Quick Filter Tabs for Sessions: "all" | "current" | "desktop" | "mobile"
  const [sessionQuickTab, setSessionQuickTab] = useState("all");
  const [sessionSearch, setSessionSearch] = useState("");
  const [sessionDensity, setSessionDensity] = useState("standard");
  const [selectedSessionIds, setSelectedSessionIds] = useState(new Set());
  const [sessionPage, setSessionPage] = useState(1);
  const [sessionPageSize, setSessionPageSize] = useState(5);

  // Quick Filter Tabs for Audit Events: "all" | "high" | "medium" | "low"
  const [eventQuickTab, setEventQuickTab] = useState("all");
  const [eventSearch, setEventSearch] = useState("");
  const [eventSeverityFilter, setEventSeverityFilter] = useState("all");
  const [eventDensity, setEventDensity] = useState("standard");
  const [selectedEventIds, setSelectedEventIds] = useState(new Set());
  const [eventPage, setEventPage] = useState(1);
  const [eventPageSize, setEventPageSize] = useState(5);

  // Portaled Viewport Modals (Zero vertical scrolling needed)
  const [inspectingSession, setInspectingSession] = useState(null);
  const [detailModalItem, setDetailModalItem] = useState(null);

  // Close modals on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setInspectingSession(null);
        setDetailModalItem(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const triggerToast = (msg, duration = 3500) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage("");
    }, duration);
  };

  const handleCopyText = (text, fieldName) => {
    navigator.clipboard?.writeText(text);
    setCopiedField(fieldName);
    triggerToast(`Copied ${fieldName} to clipboard`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Run comprehensive security audit scan
  const handleRunSecurityAudit = () => {
    if (isScanning) return;
    setIsScanning(true);
    triggerToast("Executing full perimeter security audit & cryptographic token verification...", 2000);

    setTimeout(() => {
      setIsScanning(false);
      triggerToast("Perimeter Security Scan Complete: Grade A+ (98/100). Zero anomalous tokens detected.", 4500);
    }, 1200);
  };

  const handleRevokeSession = (id, deviceName) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
    setSelectedSessionIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    if (inspectingSession?.id === id) setInspectingSession(null);
    triggerToast(`Terminated session ${id} (${deviceName || "Client Device"}).`);
  };

  const handleRevokeAllOthers = () => {
    const active = sessions.filter((s) => s.isCurrent);
    const countRevoked = sessions.length - active.length;
    setSessions(active);
    setSelectedSessionIds(new Set());
    triggerToast(`Revoked ${countRevoked} other active session(s) globally.`);
  };

  const handleRevokeSelectedSessions = () => {
    const count = selectedSessionIds.size;
    setSessions((prev) => prev.filter((s) => s.isCurrent || !selectedSessionIds.has(s.id)));
    setSelectedSessionIds(new Set());
    triggerToast(`Terminated ${count} selected session(s).`);
  };

  const handleToggle = (key, policyName) => {
    const nextVal = !securityRules[key];
    setSecurityRules((prev) => ({
      ...prev,
      [key]: nextVal,
    }));
    triggerToast(`Security Policy: "${policyName}" is now ${nextVal ? "Enforced" : "Disabled"}.`);
  };

  // Filtered Sessions
  const filteredSessions = useMemo(() => {
    return sessions.filter((s) => {
      // Quick tabs
      if (sessionQuickTab === "current" && !s.isCurrent) return false;
      if (sessionQuickTab === "desktop" && s.clientType !== "desktop") return false;
      if (sessionQuickTab === "mobile" && s.clientType !== "mobile") return false;

      if (!sessionSearch.trim()) return true;
      const q = sessionSearch.toLowerCase();
      return (
        s.id.toLowerCase().includes(q) ||
        s.device.toLowerCase().includes(q) ||
        s.ip.toLowerCase().includes(q) ||
        s.location.toLowerCase().includes(q) ||
        s.browser.toLowerCase().includes(q) ||
        s.os.toLowerCase().includes(q)
      );
    });
  }, [sessions, sessionQuickTab, sessionSearch]);

  const paginatedSessions = useMemo(() => {
    const start = (sessionPage - 1) * sessionPageSize;
    return filteredSessions.slice(start, start + sessionPageSize);
  }, [filteredSessions, sessionPage, sessionPageSize]);

  const totalSessionPages = Math.ceil(filteredSessions.length / sessionPageSize) || 1;

  // Filtered Audit Events
  const filteredEvents = useMemo(() => {
    return events.filter((ev) => {
      // Quick tabs
      if (eventQuickTab === "high" && ev.severity !== "High") return false;
      if (eventQuickTab === "medium" && ev.severity !== "Medium") return false;
      if (eventQuickTab === "low" && ev.severity !== "Low") return false;

      // Dropdown filter
      if (eventSeverityFilter !== "all" && ev.severity !== eventSeverityFilter) return false;

      if (!eventSearch.trim()) return true;
      const q = eventSearch.toLowerCase();
      return (
        ev.id.toLowerCase().includes(q) ||
        ev.event.toLowerCase().includes(q) ||
        ev.actor.toLowerCase().includes(q) ||
        ev.ip.toLowerCase().includes(q) ||
        ev.details.toLowerCase().includes(q) ||
        (ev.mitreCode && ev.mitreCode.toLowerCase().includes(q))
      );
    });
  }, [events, eventQuickTab, eventSeverityFilter, eventSearch]);

  const paginatedEvents = useMemo(() => {
    const start = (eventPage - 1) * eventPageSize;
    return filteredEvents.slice(start, start + eventPageSize);
  }, [filteredEvents, eventPage, eventPageSize]);

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
    const dataToExport =
      selectedEventIds.size > 0
        ? events.filter((e) => selectedEventIds.has(e.id))
        : filteredEvents;

    const headers = [
      "Event ID",
      "Timestamp",
      "Event Type",
      "Severity",
      "Risk Score",
      "Actor",
      "Origin IP",
      "Endpoint",
      "MITRE ATT&CK",
      "Details",
    ];
    const rows = dataToExport.map((e) => [
      e.id,
      e.time,
      e.event,
      e.severity,
      e.riskScore || "N/A",
      e.actor,
      e.ip,
      e.endpoint || "/api",
      e.mitreCode || "N/A",
      `"${(e.details || "").replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `security_audit_telemetry_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="sa-page-container sa-security-page">
      {/* 1. SAP Enterprise Header */}
      <section className="sap-header-panel sec-header-panel">
        <div className="sa-page-header-left">
          <div className="sec-title-row">
            <h1>Platform Security &amp; Access Control</h1>
            <span className="sec-live-shield-badge">
              <ShieldCheck size={13} /> SOC2 / ISO 27001 Certified
            </span>
          </div>
          <p>
            Cryptographic authentication safeguards, active super administrator sessions, and real-time firewall threat telemetry.
          </p>
        </div>

        <div className="sa-page-header-actions sec-header-actions">
          <button
            type="button"
            className="sa-btn sec-audit-btn"
            onClick={handleRunSecurityAudit}
            disabled={isScanning}
            title="Execute on-demand cryptographic security scan"
          >
            <Activity size={15} className={isScanning ? "sa-spin" : ""} />
            <span>{isScanning ? "Scanning Perimeter..." : "Run Security Audit"}</span>
          </button>

          <button
            type="button"
            className="sa-btn sa-btn-danger sec-revoke-all-btn"
            onClick={handleRevokeAllOthers}
            disabled={sessions.length <= 1}
            title="Invalidate all active sessions except your current device"
          >
            <LogOut size={15} />
            <span>Revoke Other Sessions</span>
          </button>
        </div>
      </section>

      {/* 2. Top 4 KPI Scorecard Grid */}
      <section className="sap-kpi-grid sec-kpi-grid">
        <article className="sa-kpi-card sec-kpi-card">
          <div className="sa-kpi-icon-box green">
            <ShieldCheck size={24} strokeWidth={2.2} />
          </div>
          <div className="sa-kpi-body">
            <p className="sa-kpi-title">Security Posture Score</p>
            <div className="sa-kpi-val-row">
              <span className="sa-kpi-value">98 / 100</span>
              <span className="sa-kpi-trend positive">
                <CheckCircle2 size={13} /> Grade A+
              </span>
            </div>
            <span className="sa-kpi-subtitle">Zero active CVE vulnerabilities</span>
          </div>
        </article>

        <article className="sa-kpi-card sec-kpi-card">
          <div className="sa-kpi-icon-box blue">
            <Fingerprint size={24} strokeWidth={2.2} />
          </div>
          <div className="sa-kpi-body">
            <p className="sa-kpi-title">Super Admin 2FA Coverage</p>
            <div className="sa-kpi-val-row">
              <span className="sa-kpi-value">100% Active</span>
              <span className="sa-kpi-trend positive">
                <ShieldCheck size={13} /> Enforced
              </span>
            </div>
            <span className="sa-kpi-subtitle">FIDO2 WebAuthn &amp; TOTP Verified</span>
          </div>
        </article>

        <article className="sa-kpi-card sec-kpi-card">
          <div className="sa-kpi-icon-box sky">
            <Globe size={24} strokeWidth={2.2} />
          </div>
          <div className="sa-kpi-body">
            <p className="sa-kpi-title">Active Super Sessions</p>
            <div className="sa-kpi-val-row">
              <span className="sa-kpi-value">{sessions.length} Live</span>
              <span className="sa-kpi-trend positive">
                <Zap size={13} /> TLS 1.3
              </span>
            </div>
            <span className="sa-kpi-subtitle">Mutual TLS encryption enforced</span>
          </div>
        </article>

        <article className="sa-kpi-card sec-kpi-card">
          <div className="sa-kpi-icon-box amber">
            <AlertTriangle size={24} strokeWidth={2.2} />
          </div>
          <div className="sa-kpi-body">
            <p className="sa-kpi-title">Firewall &amp; WAF Defense</p>
            <div className="sa-kpi-val-row">
              <span className="sa-kpi-value">48 Blocked</span>
              <span className="sa-kpi-trend positive">
                Mitigated
              </span>
            </div>
            <span className="sa-kpi-subtitle">Probes dropped in past 24 hours</span>
          </div>
        </article>
      </section>

      {/* Global Security Posture Strip */}
      <section className="sec-posture-strip">
        <div className="sec-posture-item">
          <Lock size={14} className="sec-posture-icon" />
          <span className="sec-posture-label">Root Key Vault:</span>
          <strong>AWS KMS (AES-256 HSM)</strong>
        </div>
        <div className="sec-posture-separator" />
        <div className="sec-posture-item">
          <Key size={14} className="sec-posture-icon" />
          <span className="sec-posture-label">JWT Algorithm:</span>
          <strong>Ed25519 / RS256 Asymmetric</strong>
        </div>
        <div className="sec-posture-separator" />
        <div className="sec-posture-item">
          <Shield size={14} className="sec-posture-icon" />
          <span className="sec-posture-label">Perimeter WAF:</span>
          <strong>Cloudflare Layer 7 Shield</strong>
        </div>
        <div className="sec-posture-separator" />
        <div className="sec-posture-item">
          <Terminal size={14} className="sec-posture-icon" />
          <span className="sec-posture-label">Audit Log Hash:</span>
          <strong>SHA-256 Chain Verified</strong>
        </div>
      </section>

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="sa-toast-banner sec-toast-banner">
          <CheckCircle2 size={16} /> {toastMessage}
        </div>
      )}

      {/* 3. Platform Governance & Security Policy Toggles */}
      <section className="sa-card sec-rules-card">
        <div className="sec-rules-header">
          <div className="sec-rules-header-left">
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <ShieldCheck size={18} color="#3b66ff" />
              <h2 className="sec-rules-title">Platform Governance &amp; Security Safeguards</h2>
            </div>
            <p className="sec-rules-desc">
              Manage perimeter defense enforcement, access token lifespans, and autonomous brute-force mitigation triggers.
            </p>
          </div>
        </div>

        <div className="sec-policies-grid">
          {/* Policy 1 */}
          <div className={`sec-policy-tile ${securityRules.enforce2FA ? "is-active" : ""}`}>
            <div className="sec-policy-info">
              <div className="sec-policy-icon-box">
                <Fingerprint size={18} />
              </div>
              <div>
                <strong className="sec-policy-name">Enforce Two-Factor Authentication (2FA)</strong>
                <p className="sec-policy-desc">
                  Require hardware FIDO2 WebAuthn keys or TOTP (Google Authenticator) for all Super Admin operations.
                </p>
              </div>
            </div>
            <div className="sec-policy-action">
              <span className={`sec-policy-status-pill ${securityRules.enforce2FA ? "on" : "off"}`}>
                {securityRules.enforce2FA ? "Enforced" : "Disabled"}
              </span>
              <label className="sa-toggle-switch sec-switch" aria-label="Toggle 2FA Enforcement">
                <input
                  type="checkbox"
                  checked={securityRules.enforce2FA}
                  onChange={() => handleToggle("enforce2FA", "Two-Factor Authentication (2FA)")}
                />
                <span className="sa-toggle-slider" />
              </label>
            </div>
          </div>

          {/* Policy 2 */}
          <div className={`sec-policy-tile ${securityRules.autoTimeout ? "is-active" : ""}`}>
            <div className="sec-policy-info">
              <div className="sec-policy-icon-box">
                <Clock size={18} />
              </div>
              <div>
                <strong className="sec-policy-name">Adaptive Inactivity Timeout (30 Mins)</strong>
                <p className="sec-policy-desc">
                  Automatically revoke active session credentials and invalidate JWT tokens after 30 minutes of idle inactivity.
                </p>
              </div>
            </div>
            <div className="sec-policy-action">
              <span className={`sec-policy-status-pill ${securityRules.autoTimeout ? "on" : "off"}`}>
                {securityRules.autoTimeout ? "Active (30m)" : "Disabled"}
              </span>
              <label className="sa-toggle-switch sec-switch" aria-label="Toggle Inactivity Timeout">
                <input
                  type="checkbox"
                  checked={securityRules.autoTimeout}
                  onChange={() => handleToggle("autoTimeout", "Inactivity Session Timeout")}
                />
                <span className="sa-toggle-slider" />
              </label>
            </div>
          </div>

          {/* Policy 3 */}
          <div className={`sec-policy-tile ${securityRules.ipAllowlist ? "is-active" : ""}`}>
            <div className="sec-policy-info">
              <div className="sec-policy-icon-box">
                <Lock size={18} />
              </div>
              <div>
                <strong className="sec-policy-name">Strict IP CIDR &amp; Corporate VPN Allowlist</strong>
                <p className="sec-policy-desc">
                  Restrict console access strictly to corporate office VPN addresses and registered IP CIDR blocks.
                </p>
              </div>
            </div>
            <div className="sec-policy-action">
              <span className={`sec-policy-status-pill ${securityRules.ipAllowlist ? "on" : "off"}`}>
                {securityRules.ipAllowlist ? "Strict Mode" : "Any Authorized"}
              </span>
              <label className="sa-toggle-switch sec-switch" aria-label="Toggle IP Allowlist">
                <input
                  type="checkbox"
                  checked={securityRules.ipAllowlist}
                  onChange={() => handleToggle("ipAllowlist", "IP Allowlist Restriction")}
                />
                <span className="sa-toggle-slider" />
              </label>
            </div>
          </div>

          {/* Policy 4 */}
          <div className={`sec-policy-tile ${securityRules.bruteForceProtection ? "is-active" : ""}`}>
            <div className="sec-policy-info">
              <div className="sec-policy-icon-box">
                <ShieldAlert size={18} />
              </div>
              <div>
                <strong className="sec-policy-name">Autonomous WAF &amp; Brute Force Lockdown</strong>
                <p className="sec-policy-desc">
                  Temporary 24h IP quarantine and honeypot challenge after 5 consecutive failed authentication probes.
                </p>
              </div>
            </div>
            <div className="sec-policy-action">
              <span className={`sec-policy-status-pill ${securityRules.bruteForceProtection ? "on" : "off"}`}>
                {securityRules.bruteForceProtection ? "Shield Active" : "Disabled"}
              </span>
              <label className="sa-toggle-switch sec-switch" aria-label="Toggle Brute Force Protection">
                <input
                  type="checkbox"
                  checked={securityRules.bruteForceProtection}
                  onChange={() => handleToggle("bruteForceProtection", "Brute Force Lockdown")}
                />
                <span className="sa-toggle-slider" />
              </label>
            </div>
          </div>

          {/* Policy 5 */}
          <div className={`sec-policy-tile ${securityRules.geoAnomaly ? "is-active" : ""}`}>
            <div className="sec-policy-info">
              <div className="sec-policy-icon-box">
                <Globe size={18} />
              </div>
              <div>
                <strong className="sec-policy-name">Impossible Travel &amp; Tor Exit Node Filter</strong>
                <p className="sec-policy-desc">
                  Detect geo-velocity anomalies (&gt;800 km/h) and automatically reject connections originating from Tor exit relays.
                </p>
              </div>
            </div>
            <div className="sec-policy-action">
              <span className={`sec-policy-status-pill ${securityRules.geoAnomaly ? "on" : "off"}`}>
                {securityRules.geoAnomaly ? "Active Shield" : "Disabled"}
              </span>
              <label className="sa-toggle-switch sec-switch" aria-label="Toggle Geo Anomaly Protection">
                <input
                  type="checkbox"
                  checked={securityRules.geoAnomaly}
                  onChange={() => handleToggle("geoAnomaly", "Impossible Travel & Tor Blocking")}
                />
                <span className="sa-toggle-slider" />
              </label>
            </div>
          </div>

          {/* Policy 6 */}
          <div className={`sec-policy-tile ${securityRules.auditImmutability ? "is-active" : ""}`}>
            <div className="sec-policy-info">
              <div className="sec-policy-icon-box">
                <Terminal size={18} />
              </div>
              <div>
                <strong className="sec-policy-name">Cryptographic Log Signing &amp; WORM Mirroring</strong>
                <p className="sec-policy-desc">
                  Write-Once-Read-Many (WORM) audit ledger with SHA-256 block hashing and real-time external syslog mirroring.
                </p>
              </div>
            </div>
            <div className="sec-policy-action">
              <span className={`sec-policy-status-pill ${securityRules.auditImmutability ? "on" : "off"}`}>
                {securityRules.auditImmutability ? "Immutable" : "Standard"}
              </span>
              <label className="sa-toggle-switch sec-switch" aria-label="Toggle Audit Immutability">
                <input
                  type="checkbox"
                  checked={securityRules.auditImmutability}
                  onChange={() => handleToggle("auditImmutability", "Cryptographic Log Signing")}
                />
                <span className="sa-toggle-slider" />
              </label>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Active Super Admin Sessions Table */}
      <section className="sap-table-card sec-table-card">
        {/* Section Header */}
        <div className="sec-section-header">
          <div className="sec-section-header-left">
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Laptop size={18} color="#3b66ff" />
              <h2 className="sec-section-title">Active Super Admin Operator Sessions</h2>
            </div>
            <p className="sec-section-desc">
              Real-time TLS 1.3 authenticated sessions connected to the Super Admin control plane.
            </p>
          </div>
        </div>

        {/* Quick Tabs for Sessions */}
        <div className="sec-quick-tabs-bar">
          <div className="sec-quick-tabs">
            <button
              type="button"
              className={`sec-quick-tab ${sessionQuickTab === "all" ? "active" : ""}`}
              onClick={() => {
                setSessionQuickTab("all");
                setSessionPage(1);
              }}
            >
              All Active Sessions
              <span className="sec-tab-badge">{sessions.length}</span>
            </button>
            <button
              type="button"
              className={`sec-quick-tab ${sessionQuickTab === "current" ? "active" : ""}`}
              onClick={() => {
                setSessionQuickTab("current");
                setSessionPage(1);
              }}
            >
              <span className="sec-tab-dot green" />
              Current Device
              <span className="sec-tab-badge green">1</span>
            </button>
            <button
              type="button"
              className={`sec-quick-tab ${sessionQuickTab === "desktop" ? "active" : ""}`}
              onClick={() => {
                setSessionQuickTab("desktop");
                setSessionPage(1);
              }}
            >
              Desktop Workstations
              <span className="sec-tab-badge">{sessions.filter((s) => s.clientType === "desktop").length}</span>
            </button>
            <button
              type="button"
              className={`sec-quick-tab ${sessionQuickTab === "mobile" ? "active" : ""}`}
              onClick={() => {
                setSessionQuickTab("mobile");
                setSessionPage(1);
              }}
            >
              Mobile Clients
              <span className="sec-tab-badge">{sessions.filter((s) => s.clientType === "mobile").length}</span>
            </button>
          </div>
        </div>

        {/* Batch action banner */}
        {selectedSessionIds.size > 0 && (
          <div className="sap-batch-banner sec-batch-banner">
            <span>
              <strong>{selectedSessionIds.size}</strong> sessions selected for termination
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
                Clear Selection
              </button>
            </div>
          </div>
        )}

        {/* Toolbar */}
        <div className="sap-toolbar sec-toolbar">
          <div className="sap-search-input sec-search-input">
            <Search size={15} />
            <input
              type="text"
              placeholder="Search sessions by device, IP, location, browser..."
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
                aria-label="Clear search"
              >
                <X size={13} />
              </button>
            )}
          </div>

          <div className="sec-toolbar-actions">
            <button
              type="button"
              className="sap-icon-btn sec-density-btn"
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
        <div className="sa-table-wrapper sec-table-wrapper">
          <table className={`sap-grid is-${sessionDensity} sec-table`}>
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
                <th>Device &amp; Operating System</th>
                <th>Origin IP Address</th>
                <th>Network &amp; Location</th>
                <th>Authenticated When</th>
                <th>Last Heartbeat</th>
                <th>Cipher / Security</th>
                <th style={{ textAlign: "right", minWidth: 150 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedSessions.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: "center", padding: "40px 16px", color: "var(--sa-text-muted)" }}>
                    No active sessions matched your filter criteria.
                  </td>
                </tr>
              ) : (
                paginatedSessions.map((ses) => (
                  <tr key={ses.id} className="sec-table-row">
                    <td style={{ textAlign: "center" }}>
                      {!ses.isCurrent && (
                        <input
                          type="checkbox"
                          checked={selectedSessionIds.has(ses.id)}
                          onChange={() => handleToggleSessionSelect(ses.id)}
                          aria-label={`Select session ${ses.id}`}
                        />
                      )}
                    </td>
                    <td>
                      <div className="sec-device-cell">
                        <div className={`sec-device-icon-box ${ses.isCurrent ? "is-current" : ""}`}>
                          {ses.clientType === "mobile" ? <Smartphone size={16} /> : <Laptop size={16} />}
                        </div>
                        <div className="sec-device-info">
                          <div className="sec-device-title-row">
                            <strong className="sec-device-name">{ses.device}</strong>
                            {ses.isCurrent && (
                              <span className="sap-status-pill green sec-current-pill">
                                <span className="sec-pulse-dot" /> Current Device
                              </span>
                            )}
                          </div>
                          <span className="sec-device-subtext">{ses.browser} · {ses.os}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <code className="sap-id-cell sec-code-id">{ses.ip}</code>
                    </td>
                    <td>
                      <div className="sec-location-cell">
                        <span className="sec-location-name">
                          <Globe size={11} /> {ses.location}
                        </span>
                        <span className="sec-network-tag">{ses.network}</span>
                      </div>
                    </td>
                    <td style={{ fontSize: 12, color: "var(--sa-text-secondary)" }}>{ses.loginTime}</td>
                    <td>
                      <span className="sec-heartbeat-pill">
                        <Clock size={12} className={ses.isCurrent ? "sec-val-success" : ""} />
                        {ses.lastActive}
                      </span>
                    </td>
                    <td>
                      <span className="sec-cipher-badge">
                        <ShieldCheck size={11} /> {ses.tlsCipher.split(" / ")[0]}
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <div className="sec-action-buttons-group">
                        <button
                          type="button"
                          className="sec-action-btn inspect"
                          onClick={() => setInspectingSession(ses)}
                          title="Inspect Session Forensics"
                        >
                          <Eye size={12} />
                          <span>Inspect</span>
                        </button>

                        {!ses.isCurrent ? (
                          <button
                            type="button"
                            className="sec-action-btn terminate"
                            onClick={() => handleRevokeSession(ses.id, ses.device)}
                            title="Terminate this session token"
                          >
                            <Trash2 size={12} />
                            <span>Revoke</span>
                          </button>
                        ) : (
                          <span className="sec-active-now-tag">
                            Active
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="sap-footer-bar sec-footer-bar">
          <div className="sec-footer-meta-left">
            <span>
              Showing <strong>{filteredSessions.length === 0 ? 0 : (sessionPage - 1) * sessionPageSize + 1}</strong> to{" "}
              <strong>{Math.min(sessionPage * sessionPageSize, filteredSessions.length)}</strong> of{" "}
              <strong>{filteredSessions.length}</strong> active devices
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12 }}>
              <span>Rows per page:</span>
              <select
                className="sec-page-select"
                value={sessionPageSize}
                onChange={(e) => {
                  setSessionPageSize(Number(e.target.value));
                  setSessionPage(1);
                }}
                aria-label="Select session rows per page"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>

          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <button
              type="button"
              className="sap-page-btn"
              disabled={sessionPage <= 1}
              onClick={() => setSessionPage((p) => Math.max(1, p - 1))}
              aria-label="Previous session page"
            >
              <ChevronLeft size={14} />
            </button>
            <span style={{ fontSize: 12.5, padding: "4px 8px", color: "var(--sa-text-secondary)" }}>
              Page {sessionPage} of {totalSessionPages}
            </span>
            <button
              type="button"
              className="sap-page-btn"
              disabled={sessionPage >= totalSessionPages}
              onClick={() => setSessionPage((p) => Math.min(totalSessionPages, p + 1))}
              aria-label="Next session page"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* 5. Security Audit Trail Table */}
      <section className="sap-table-card sec-table-card">
        {/* Section Header */}
        <div className="sec-section-header">
          <div className="sec-section-header-left">
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <ShieldAlert size={18} color="#3b66ff" />
              <h2 className="sec-section-title">Cryptographic Security Audit Trail</h2>
            </div>
            <p className="sec-section-desc">
              Immutable WORM log of administrative authorization challenges, policy mutations, and perimeter threat blocks.
            </p>
          </div>
        </div>

        {/* Quick Tabs for Audit Events */}
        <div className="sec-quick-tabs-bar">
          <div className="sec-quick-tabs">
            <button
              type="button"
              className={`sec-quick-tab ${eventQuickTab === "all" ? "active" : ""}`}
              onClick={() => {
                setEventQuickTab("all");
                setEventPage(1);
              }}
            >
              All Events
              <span className="sec-tab-badge">{events.length}</span>
            </button>
            <button
              type="button"
              className={`sec-quick-tab ${eventQuickTab === "high" ? "active" : ""}`}
              onClick={() => {
                setEventQuickTab("high");
                setEventPage(1);
              }}
            >
              <span className="sec-tab-dot red" />
              High Severity
              <span className="sec-tab-badge red">{events.filter((e) => e.severity === "High").length}</span>
            </button>
            <button
              type="button"
              className={`sec-quick-tab ${eventQuickTab === "medium" ? "active" : ""}`}
              onClick={() => {
                setEventQuickTab("medium");
                setEventPage(1);
              }}
            >
              <span className="sec-tab-dot amber" />
              Medium Risk
              <span className="sec-tab-badge amber">{events.filter((e) => e.severity === "Medium").length}</span>
            </button>
            <button
              type="button"
              className={`sec-quick-tab ${eventQuickTab === "low" ? "active" : ""}`}
              onClick={() => {
                setEventQuickTab("low");
                setEventPage(1);
              }}
            >
              <span className="sec-tab-dot green" />
              Low Risk
              <span className="sec-tab-badge green">{events.filter((e) => e.severity === "Low").length}</span>
            </button>
          </div>
        </div>

        {/* Batch action banner */}
        {selectedEventIds.size > 0 && (
          <div className="sap-batch-banner sec-batch-banner">
            <span>
              <strong>{selectedEventIds.size}</strong> audit records selected for export
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
                Clear Selection
              </button>
            </div>
          </div>
        )}

        {/* Toolbar */}
        <div className="sap-toolbar sec-toolbar">
          <div className="sap-search-input sec-search-input">
            <Search size={15} />
            <input
              type="text"
              placeholder="Search audit trail by event type, actor, IP, endpoint, or details..."
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
                aria-label="Clear search"
              >
                <X size={13} />
              </button>
            )}
          </div>

          <div className="sec-toolbar-actions">
            <div className="sec-filter-group">
              <Filter size={13} className="sec-filter-icon" />
              <select
                className="sec-filter-select"
                value={eventSeverityFilter}
                onChange={(e) => {
                  setEventSeverityFilter(e.target.value);
                  setEventPage(1);
                }}
                aria-label="Filter events by severity"
              >
                <option value="all">All Severities</option>
                <option value="High">High Severity</option>
                <option value="Medium">Medium Severity</option>
                <option value="Low">Low Severity</option>
              </select>
            </div>

            <button
              type="button"
              className="sa-btn sa-btn-secondary sa-btn-sm sec-export-btn"
              onClick={handleExportEventsCSV}
              title="Export filtered records to CSV"
            >
              <Download size={14} /> <span>Export CSV</span>
            </button>

            <button
              type="button"
              className="sap-icon-btn sec-density-btn"
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
        <div className="sa-table-wrapper sec-table-wrapper">
          <table className={`sap-grid is-${eventDensity} sec-table`}>
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
                <th>Security Action</th>
                <th>Actor Principal</th>
                <th>Origin IP</th>
                <th>Risk Level</th>
                <th>Forensic Payload</th>
                <th style={{ textAlign: "right" }}>Forensics</th>
              </tr>
            </thead>
            <tbody>
              {paginatedEvents.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: "center", padding: "40px 16px", color: "var(--sa-text-muted)" }}>
                    No security events matched your search criteria.
                  </td>
                </tr>
              ) : (
                paginatedEvents.map((ev) => (
                  <tr key={ev.id} className="sec-table-row">
                    <td style={{ textAlign: "center" }}>
                      <input
                        type="checkbox"
                        checked={selectedEventIds.has(ev.id)}
                        onChange={() => handleToggleEventSelect(ev.id)}
                        aria-label={`Select event ${ev.id}`}
                      />
                    </td>
                    <td>
                      <code className="sap-id-cell sec-code-id">{ev.id}</code>
                    </td>
                    <td style={{ fontSize: 12, color: "var(--sa-text-secondary)" }}>{ev.time}</td>
                    <td>
                      <div className="sec-event-cell">
                        <strong className="sec-event-name">{ev.event}</strong>
                        <span className="sec-action-code">{ev.action}</span>
                      </div>
                    </td>
                    <td>
                      <span className="sap-user-badge sec-actor-badge">{ev.actor}</span>
                    </td>
                    <td>
                      <code className="sap-id-cell sec-code-id">{ev.ip}</code>
                    </td>
                    <td>
                      <span
                        className={`sec-sev-badge ${
                          ev.severity === "High"
                            ? "high"
                            : ev.severity === "Medium"
                            ? "medium"
                            : "low"
                        }`}
                      >
                        {ev.severity} ({ev.riskScore ? ev.riskScore.split(" / ")[0] : "Low"})
                      </span>
                    </td>
                    <td className="sec-details-cell">
                      <span>{ev.details}</span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <button
                        type="button"
                        className="sec-action-btn inspect"
                        title="View Event Forensic Details"
                        onClick={() => setDetailModalItem(ev)}
                      >
                        <Eye size={12} />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="sap-footer-bar sec-footer-bar">
          <div className="sec-footer-meta-left">
            <span>
              Showing <strong>{filteredEvents.length === 0 ? 0 : (eventPage - 1) * eventPageSize + 1}</strong> to{" "}
              <strong>{Math.min(eventPage * eventPageSize, filteredEvents.length)}</strong> of{" "}
              <strong>{filteredEvents.length}</strong> immutable events
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12 }}>
              <span>Rows per page:</span>
              <select
                className="sec-page-select"
                value={eventPageSize}
                onChange={(e) => {
                  setEventPageSize(Number(e.target.value));
                  setEventPage(1);
                }}
                aria-label="Select event rows per page"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>

          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <button
              type="button"
              className="sap-page-btn"
              disabled={eventPage <= 1}
              onClick={() => setEventPage((p) => Math.max(1, p - 1))}
              aria-label="Previous event page"
            >
              <ChevronLeft size={14} />
            </button>
            <span style={{ fontSize: 12.5, padding: "4px 8px", color: "var(--sa-text-secondary)" }}>
              Page {eventPage} of {totalEventPages}
            </span>
            <button
              type="button"
              className="sap-page-btn"
              disabled={eventPage >= totalEventPages}
              onClick={() => setEventPage((p) => Math.min(totalEventPages, p + 1))}
              aria-label="Next event page"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          PORTALED MODAL 1: SESSION FORENSICS & CLIENT TELEMETRY
          (Portaled to document.body: Centered, Zero Vertical Scrolling Needed)
         ========================================================================= */}
      {inspectingSession &&
        createPortal(
          <div
            className="sec-modal-overlay"
            onClick={() => setInspectingSession(null)}
            role="dialog"
            aria-modal="true"
          >
            <div className="sec-modal-container" onClick={(e) => e.stopPropagation()}>
              <div className="sec-modal-header">
                <div className="sec-modal-header-left">
                  <div className="sec-modal-icon-wrap">
                    <Laptop size={20} />
                  </div>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <h3 className="sec-modal-title">{inspectingSession.device}</h3>
                      <code className="sec-code-id">{inspectingSession.id}</code>
                      {inspectingSession.isCurrent && (
                        <span className="sap-status-pill green">Current Session</span>
                      )}
                    </div>
                    <div className="sec-modal-subline">
                      <span>{inspectingSession.os}</span>
                      <span>·</span>
                      <span>{inspectingSession.browser}</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  className="sec-modal-close-btn"
                  onClick={() => setInspectingSession(null)}
                  aria-label="Close modal"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="sec-modal-body">
                {/* 4 Metric Tiles */}
                <div className="sec-modal-metrics-grid">
                  <div className="sec-modal-metric-card">
                    <span className="sec-modal-metric-label">SESSION STATUS</span>
                    <strong className="sec-modal-metric-val sec-val-success">Authenticated</strong>
                    <small style={{ fontSize: 10.5, color: "var(--sa-text-muted)", marginTop: 2 }}>
                      TLS 1.3 Verified
                    </small>
                  </div>

                  <div className="sec-modal-metric-card">
                    <span className="sec-modal-metric-label">TIME UNTIL EXPIRY</span>
                    <strong className="sec-modal-metric-val">{inspectingSession.expiresIn}</strong>
                    <small style={{ fontSize: 10.5, color: "var(--sa-text-muted)", marginTop: 2 }}>
                      JWT Bearer
                    </small>
                  </div>

                  <div className="sec-modal-metric-card">
                    <span className="sec-modal-metric-label">HEARTBEAT</span>
                    <strong className="sec-modal-metric-val">{inspectingSession.lastActive}</strong>
                    <small style={{ fontSize: 10.5, color: "var(--sa-text-muted)", marginTop: 2 }}>
                      Socket Kept-Alive
                    </small>
                  </div>

                  <div className="sec-modal-metric-card">
                    <span className="sec-modal-metric-label">NETWORK TIER</span>
                    <strong className="sec-modal-metric-val" style={{ fontSize: 12 }}>
                      {inspectingSession.network.split(" ")[0]}
                    </strong>
                    <small style={{ fontSize: 10.5, color: "var(--sa-text-muted)", marginTop: 2 }}>
                      Encrypted Tunnel
                    </small>
                  </div>
                </div>

                {/* Session Details */}
                <div className="sec-modal-details-grid">
                  <div className="sec-modal-detail-row">
                    <span className="sec-modal-detail-key">Origin IP Address:</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <strong className="sec-modal-detail-val" style={{ fontFamily: "monospace" }}>
                        {inspectingSession.ip}
                      </strong>
                      <button
                        type="button"
                        className="sec-copy-btn"
                        onClick={() => handleCopyText(inspectingSession.ip, "IP Address")}
                        title="Copy IP"
                      >
                        {copiedField === "IP Address" ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
                      </button>
                    </div>
                  </div>

                  <div className="sec-modal-detail-row">
                    <span className="sec-modal-detail-key">Geolocation:</span>
                    <strong className="sec-modal-detail-val">{inspectingSession.location}</strong>
                  </div>

                  <div className="sec-modal-detail-row">
                    <span className="sec-modal-detail-key">Authentication Timestamp:</span>
                    <strong className="sec-modal-detail-val">{inspectingSession.loginTime}</strong>
                  </div>

                  <div className="sec-modal-detail-row">
                    <span className="sec-modal-detail-key">Cryptographic Cipher Suite:</span>
                    <strong className="sec-modal-detail-val sec-val-success">
                      {inspectingSession.tlsCipher}
                    </strong>
                  </div>

                  <div className="sec-modal-detail-row" style={{ gridColumn: "1 / -1" }}>
                    <span className="sec-modal-detail-key">Network Identity:</span>
                    <strong className="sec-modal-detail-val">{inspectingSession.network}</strong>
                  </div>
                </div>
              </div>

              <div className="sec-modal-footer">
                {!inspectingSession.isCurrent ? (
                  <button
                    type="button"
                    className="sa-btn sa-btn-danger sa-btn-sm"
                    onClick={() => handleRevokeSession(inspectingSession.id, inspectingSession.device)}
                  >
                    <Trash2 size={13} />
                    <span>Terminate Session</span>
                  </button>
                ) : (
                  <span style={{ fontSize: 12, color: "#10b981", fontWeight: 600 }}>
                    Active Workstation (Protected)
                  </span>
                )}

                <button
                  type="button"
                  className="sa-btn sa-btn-secondary sa-btn-sm"
                  onClick={() => setInspectingSession(null)}
                >
                  Close Telemetry
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* =========================================================================
          PORTALED MODAL 2: INCIDENT & EVENT FORENSICS
          (Portaled to document.body: Centered, Zero Vertical Scrolling Needed)
         ========================================================================= */}
      {detailModalItem &&
        createPortal(
          <div
            className="sec-modal-overlay"
            onClick={() => setDetailModalItem(null)}
            role="dialog"
            aria-modal="true"
          >
            <div className="sec-modal-container" onClick={(e) => e.stopPropagation()}>
              <div className="sec-modal-header">
                <div className="sec-modal-header-left">
                  <div className="sec-modal-icon-wrap event">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <h3 className="sec-modal-title">{detailModalItem.event}</h3>
                      <code className="sec-code-id">{detailModalItem.id}</code>
                      <span
                        className={`sec-sev-badge ${
                          detailModalItem.severity === "High"
                            ? "high"
                            : detailModalItem.severity === "Medium"
                            ? "medium"
                            : "low"
                        }`}
                      >
                        {detailModalItem.severity} Risk
                      </span>
                    </div>
                    <div className="sec-modal-subline">
                      <span>{detailModalItem.time}</span>
                      <span>·</span>
                      <span>{detailModalItem.actor}</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  className="sec-modal-close-btn"
                  onClick={() => setDetailModalItem(null)}
                  aria-label="Close modal"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="sec-modal-body">
                {/* 4 Metric Tiles */}
                <div className="sec-modal-metrics-grid">
                  <div className="sec-modal-metric-card">
                    <span className="sec-modal-metric-label">RISK SEVERITY</span>
                    <strong className="sec-modal-metric-val">{detailModalItem.severity}</strong>
                    <small style={{ fontSize: 10.5, color: "var(--sa-text-muted)", marginTop: 2 }}>
                      Score: {detailModalItem.riskScore || "Standard"}
                    </small>
                  </div>

                  <div className="sec-modal-metric-card">
                    <span className="sec-modal-metric-label">ACTION TAKEN</span>
                    <strong className="sec-modal-metric-val sec-val-success">{detailModalItem.action}</strong>
                    <small style={{ fontSize: 10.5, color: "var(--sa-text-muted)", marginTop: 2 }}>
                      Automated Enforcement
                    </small>
                  </div>

                  <div className="sec-modal-metric-card">
                    <span className="sec-modal-metric-label">ACTOR IDENTITY</span>
                    <strong className="sec-modal-metric-val" style={{ fontSize: 12 }}>
                      {detailModalItem.actor.split(" ")[0]}
                    </strong>
                    <small style={{ fontSize: 10.5, color: "var(--sa-text-muted)", marginTop: 2 }}>
                      Verified Principal
                    </small>
                  </div>

                  <div className="sec-modal-metric-card">
                    <span className="sec-modal-metric-label">MITRE ATT&amp;CK</span>
                    <strong className="sec-modal-metric-val" style={{ fontSize: 11 }}>
                      {detailModalItem.mitreCode ? detailModalItem.mitreCode.split(" ")[0] : "T1078"}
                    </strong>
                    <small style={{ fontSize: 10.5, color: "var(--sa-text-muted)", marginTop: 2 }}>
                      Threat Category
                    </small>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="sec-modal-details-grid">
                  <div className="sec-modal-detail-row">
                    <span className="sec-modal-detail-key">Origin IP:</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <strong className="sec-modal-detail-val" style={{ fontFamily: "monospace" }}>
                        {detailModalItem.ip}
                      </strong>
                      <button
                        type="button"
                        className="sec-copy-btn"
                        onClick={() => handleCopyText(detailModalItem.ip, "Event IP")}
                        title="Copy IP"
                      >
                        {copiedField === "Event IP" ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
                      </button>
                    </div>
                  </div>

                  <div className="sec-modal-detail-row">
                    <span className="sec-modal-detail-key">Target API Endpoint:</span>
                    <code className="sec-modal-url-code">{detailModalItem.endpoint || "/api/v1/auth"}</code>
                  </div>
                </div>

                {/* Description Payload */}
                <div className="sec-incident-desc-box">
                  <span className="sec-modal-metric-label">EVENT FORENSIC DESCRIPTION</span>
                  <p>{detailModalItem.details}</p>
                </div>
              </div>

              <div className="sec-modal-footer">
                <button
                  type="button"
                  className="sa-btn sa-btn-secondary sa-btn-sm"
                  onClick={() =>
                    handleCopyText(
                      `[${detailModalItem.id}] ${detailModalItem.event} - ${detailModalItem.details} (IP: ${detailModalItem.ip})`,
                      "Audit Payload"
                    )
                  }
                >
                  <Copy size={13} />
                  <span>Copy Forensic Record</span>
                </button>

                <button
                  type="button"
                  className="sa-btn sa-btn-primary sa-btn-sm"
                  onClick={() => setDetailModalItem(null)}
                >
                  Close Report
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}

export default Security;
