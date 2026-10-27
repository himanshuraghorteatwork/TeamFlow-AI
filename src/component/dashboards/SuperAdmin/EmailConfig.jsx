import { useState, useMemo } from "react";
import { createPortal } from "react-dom";
import {
  Mail,
  Send,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Server,
  Lock,
  ArrowUpRight,
  ShieldCheck,
  Clock,
  X,
  Zap,
  Search,
  Filter,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Download,
  Eye,
  EyeOff,
  Check,
  Copy,
  Terminal,
  ExternalLink,
  Globe,
  Key,
  Layers,
  Sparkles,
  Info,
  RefreshCw,
} from "lucide-react";
import "./SuperAdminCommon.css";
import "./EmailConfig.css";

const SMTP_PRESETS = [
  {
    id: "sendgrid",
    name: "SendGrid",
    host: "smtp.sendgrid.net",
    port: "587",
    encryption: "TLS",
    username: "apikey",
    badge: "Cloud Relay",
    logoColor: "#1a82e2",
  },
  {
    id: "ses",
    name: "Amazon SES",
    host: "email-smtp.us-east-1.amazonaws.com",
    port: "587",
    encryption: "TLS",
    username: "AKIAIOSFODNN7EXAMPLE",
    badge: "AWS High-Scale",
    logoColor: "#ff9900",
  },
  {
    id: "mailgun",
    name: "Mailgun",
    host: "smtp.mailgun.org",
    port: "587",
    encryption: "TLS",
    username: "postmaster@teamflow.ai",
    badge: "Developer API",
    logoColor: "#e63946",
  },
  {
    id: "postmark",
    name: "Postmark",
    host: "smtp.postmarkapp.com",
    port: "587",
    encryption: "TLS",
    username: "pm-server-token-9921",
    badge: "Low Latency",
    logoColor: "#ffd166",
  },
  {
    id: "google",
    name: "Google Workspace",
    host: "smtp.gmail.com",
    port: "587",
    encryption: "TLS",
    username: "billing@teamflow.ai",
    badge: "OAuth / App Pass",
    logoColor: "#4285f4",
  },
  {
    id: "custom",
    name: "Custom Relay",
    host: "mail.corporate-domain.com",
    port: "465",
    encryption: "SSL",
    username: "smtp_admin",
    badge: "Self-Hosted",
    logoColor: "#64748b",
  },
];

const INITIAL_LOGS = [
  {
    id: "EML-401",
    recipient: "priya@abc.com",
    recipientName: "Priya Nair",
    subject: "Invitation to join ABC Technologies on TeamFlow AI",
    template: "Workspace Invite",
    time: "Today, 10:31 AM",
    latency: "24ms",
    status: "Delivered",
    smtpResponse: "250 2.0.0 Ok: queued as 4QvF8s1289 (TLS 1.3 / AES-256)",
    from: "TeamFlow AI <notifications@teamflow.ai>",
    ip: "192.168.1.104",
    clientHost: "relay-node-01.us-east.teamflow.internal",
    size: "14.2 KB",
  },
  {
    id: "EML-402",
    recipient: "admin@novatech.io",
    recipientName: "Alex Vance",
    subject: "Your TeamFlow AI Enterprise Monthly Invoice #INV-1087",
    template: "Invoice Receipt",
    time: "Today, 09:15 AM",
    latency: "28ms",
    status: "Delivered",
    smtpResponse: "250 2.0.0 Ok: queued as 7KpL9z3491 (TLS 1.3 / AES-256)",
    from: "TeamFlow AI Billing <billing@teamflow.ai>",
    ip: "103.21.244.12",
    clientHost: "billing-worker-02.in.teamflow.internal",
    size: "26.8 KB",
  },
  {
    id: "EML-403",
    recipient: "amit@xyz.com",
    recipientName: "Amit Verma",
    subject: "Security Alert: New Super Admin Login from IP 192.168.1.104",
    template: "Security Notice",
    time: "Today, 08:40 AM",
    latency: "21ms",
    status: "Delivered",
    smtpResponse: "250 2.0.0 Ok: queued as 9MmT3w5520 (TLS 1.3 / AES-256)",
    from: "TeamFlow AI Security <security@teamflow.ai>",
    ip: "192.168.1.104",
    clientHost: "auth-guard-01.us-east.teamflow.internal",
    size: "18.5 KB",
  },
  {
    id: "EML-404",
    recipient: "alex@startup.org",
    recipientName: "Kunal Shah",
    subject: "Welcome to TeamFlow AI! Complete your onboarding setup",
    template: "Welcome Onboarding",
    time: "Yesterday, 07:12 PM",
    latency: "35ms",
    status: "Delivered",
    smtpResponse: "250 2.0.0 Ok: queued as 1XxY8n9921 (TLS 1.3 / AES-256)",
    from: "TeamFlow AI <notifications@teamflow.ai>",
    ip: "49.205.122.45",
    clientHost: "onboard-api-01.us-west.teamflow.internal",
    size: "31.4 KB",
  },
  {
    id: "EML-405",
    recipient: "invalid-user@baddomain.test",
    recipientName: "Unknown User",
    subject: "Reset your TeamFlow AI password",
    template: "Password Reset",
    time: "Yesterday, 02:22 PM",
    latency: "112ms",
    status: "Bounced",
    smtpResponse: "550 5.1.1 User unknown: Remote mail host rejected recipient address",
    from: "TeamFlow AI Accounts <accounts@teamflow.ai>",
    ip: "192.168.1.104",
    clientHost: "auth-guard-01.us-east.teamflow.internal",
    size: "12.1 KB",
  },
  {
    id: "EML-406",
    recipient: "support@hypergrowth.tech",
    recipientName: "Rahul Sharma",
    subject: "TeamFlow AI Monthly Platform Analytics Summary - October",
    template: "Analytics Digest",
    time: "Oct 25, 2026, 05:40 PM",
    latency: "36ms",
    status: "Delivered",
    smtpResponse: "250 2.0.0 Ok: queued as 3PpW7m1140 (TLS 1.3 / AES-256)",
    from: "TeamFlow AI Insights <insights@teamflow.ai>",
    ip: "103.45.67.89",
    clientHost: "insights-cron-01.in.teamflow.internal",
    size: "42.0 KB",
  },
  {
    id: "EML-407",
    recipient: "billing@acme.com",
    recipientName: "Sneha Patel",
    subject: "Payment Success: TeamFlow AI Starter Subscription Renewed",
    template: "Invoice Receipt",
    time: "Oct 24, 2026, 11:10 AM",
    latency: "29ms",
    status: "Delivered",
    smtpResponse: "250 2.0.0 Ok: queued as 5QqR2k7732 (TLS 1.3 / AES-256)",
    from: "TeamFlow AI Billing <billing@teamflow.ai>",
    ip: "182.72.18.90",
    clientHost: "billing-worker-01.in.teamflow.internal",
    size: "24.5 KB",
  },
  {
    id: "EML-408",
    recipient: "david@pixelcraft.co",
    recipientName: "David Chen",
    subject: "TeamFlow AI: 3 Scheduled Team Tasks Completed Successfully",
    template: "Task Notification",
    time: "Oct 24, 2026, 09:12 AM",
    latency: "41ms",
    status: "Delivered",
    smtpResponse: "250 2.0.0 Ok: queued as 8MmN4x0012 (TLS 1.3 / AES-256)",
    from: "TeamFlow AI <notifications@teamflow.ai>",
    ip: "103.21.244.12",
    clientHost: "notify-daemon-01.us-east.teamflow.internal",
    size: "16.8 KB",
  },
  {
    id: "EML-409",
    recipient: "elena@orbit.com",
    recipientName: "Elena Rostova",
    subject: "New API Key Generated for TeamFlow AI Project Workspace",
    template: "Security Notice",
    time: "Oct 23, 2026, 04:30 PM",
    latency: "31ms",
    status: "Delivered",
    smtpResponse: "250 2.0.0 Ok: queued as 2BbV9c1822 (TLS 1.3 / AES-256)",
    from: "TeamFlow AI Security <security@teamflow.ai>",
    ip: "192.168.1.104",
    clientHost: "auth-guard-02.us-east.teamflow.internal",
    size: "15.3 KB",
  },
  {
    id: "EML-410",
    recipient: "temp-mailbox@greyhost.xyz",
    recipientName: "Test Tenant",
    subject: "Confirm your email address for TeamFlow AI",
    template: "Welcome Onboarding",
    time: "Oct 22, 2026, 01:15 PM",
    latency: "89ms",
    status: "Deferred",
    smtpResponse: "451 4.4.0 Connection timed out: Greylisting retry queued in 15m",
    from: "TeamFlow AI Accounts <accounts@teamflow.ai>",
    ip: "192.168.1.104",
    clientHost: "relay-node-02.us-east.teamflow.internal",
    size: "13.6 KB",
  },
];

function EmailConfig() {
  const [activePreset, setActivePreset] = useState("sendgrid");
  const [smtpConfig, setSmtpConfig] = useState({
    host: "smtp.sendgrid.net",
    port: "587",
    encryption: "TLS",
    username: "apikey",
    password: "SG.e8aB9f939401kdmx9302_teamflow_live_auth",
    fromName: "TeamFlow AI",
    fromEmail: "notifications@teamflow.ai",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [pingState, setPingState] = useState(null); // null | "testing" | "success" | "error"
  const [pingDetails, setPingDetails] = useState(null);
  const [testModalOpen, setTestModalOpen] = useState(false);
  const [testEmailTo, setTestEmailTo] = useState("himanshu@teamflow.ai");
  const [testTemplate, setTestTemplate] = useState("Diagnostic Ping");
  const [testSendStatus, setTestSendStatus] = useState(null);
  const [saveStatus, setSaveStatus] = useState(false);
  const [logs, setLogs] = useState(INITIAL_LOGS);
  const [toast, setToast] = useState("");

  // Table Controls
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [templateFilter, setTemplateFilter] = useState("all");
  const [density, setDensity] = useState("standard");
  const [page, setPage] = useState(1);
  const [selectedLogIds, setSelectedLogIds] = useState(new Set());
  const [pageSize, setPageSize] = useState(10);

  // Selected Log Preview Modal
  const [selectedLogPreview, setSelectedLogPreview] = useState(null);
  const [copiedHeader, setCopiedHeader] = useState(false);

  const notify = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2800);
  };

  const handleSelectPreset = (preset) => {
    setActivePreset(preset.id);
    setSmtpConfig((prev) => ({
      ...prev,
      host: preset.host,
      port: preset.port,
      encryption: preset.encryption,
      username: preset.username,
    }));
    setPingState(null);
    setPingDetails(null);
    notify(`Switched SMTP profile preset to ${preset.name}.`);
  };

  const handleTestConnection = () => {
    setPingState("testing");
    setPingDetails(null);
    setTimeout(() => {
      setPingState("success");
      setPingDetails({
        ip: "159.183.141.11",
        latency: "24ms",
        cipher: "TLSv1.3 / ECDHE-RSA-AES256-GCM-SHA384",
        banner: "220 smtp.sendgrid.net ESMTP SendGrid ready",
        timestamp: new Date().toLocaleTimeString(),
      });
      notify("SMTP relay handshake successful. Port 587 TLS 1.3 verified.");
    }, 950);
  };

  const handleSaveConfig = (e) => {
    e.preventDefault();
    setSaveStatus(true);
    notify("SMTP relay credentials and envelope headers saved successfully.");
    setTimeout(() => {
      setSaveStatus(false);
    }, 3200);
  };

  const handleSendTestEmail = (e) => {
    e.preventDefault();
    setTestSendStatus("sending");
    setTimeout(() => {
      setTestSendStatus("sent");
      const newEntry = {
        id: `EML-${Date.now().toString().slice(-3)}`,
        recipient: testEmailTo,
        recipientName: testEmailTo.split("@")[0],
        subject: `[Diagnostic] TeamFlow AI ${testTemplate} Test`,
        template: testTemplate,
        time: "Just now",
        latency: "22ms",
        status: "Delivered",
        smtpResponse: "250 2.0.0 Ok: queued diagnostic delivery",
        from: `${smtpConfig.fromName} <${smtpConfig.fromEmail}>`,
        ip: "192.168.1.104",
        clientHost: "test-diagnostic-runner.internal",
        size: "18.4 KB",
      };
      setLogs((prev) => [newEntry, ...prev]);
      notify(`Diagnostic test email dispatched to ${testEmailTo}.`);
      setTimeout(() => {
        setTestModalOpen(false);
        setTestSendStatus(null);
      }, 1200);
    }, 1000);
  };

  const handleResendLog = (log) => {
    notify(`Resending message ${log.id} to ${log.recipient}...`);
    setTimeout(() => {
      notify(`Message ${log.id} re-queued and delivered successfully.`);
    }, 800);
  };

  const handleCopyDiagnostics = (log) => {
    const diag = `TeamFlow AI SMTP Diagnostic Log
Mail ID: ${log.id}
Recipient: ${log.recipient}
Subject: ${log.subject}
Template: ${log.template}
Status: ${log.status}
SMTP Relay Response: ${log.smtpResponse}
Client IP: ${log.ip}
Dispatched: ${log.time}`;

    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(diag);
    }
    setCopiedHeader(true);
    setTimeout(() => setCopiedHeader(false), 2000);
    notify(`Diagnostic payload for ${log.id} copied to clipboard.`);
  };

  // Filtered Logs
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      if (statusFilter !== "all" && log.status !== statusFilter) return false;
      if (templateFilter !== "all" && log.template !== templateFilter) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        log.id.toLowerCase().includes(q) ||
        log.recipient.toLowerCase().includes(q) ||
        log.recipientName.toLowerCase().includes(q) ||
        log.subject.toLowerCase().includes(q) ||
        log.template.toLowerCase().includes(q)
      );
    });
  }, [logs, statusFilter, templateFilter, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginatedLogs = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredLogs.slice(start, start + pageSize);
  }, [filteredLogs, currentPage, pageSize]);

  // Selection handlers
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedLogIds(new Set(paginatedLogs.map((l) => l.id)));
    } else {
      setSelectedLogIds(new Set());
    }
  };

  const handleToggleSelect = (id) => {
    setSelectedLogIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleExportCSV = () => {
    const dataToExport =
      selectedLogIds.size > 0
        ? logs.filter((l) => selectedLogIds.has(l.id))
        : filteredLogs;

    const headers = [
      "Email ID",
      "Recipient",
      "Recipient Name",
      "Subject",
      "Template",
      "Timestamp",
      "Latency",
      "Status",
      "SMTP Response",
      "From Header",
      "Origin IP",
    ];

    const rows = dataToExport.map((l) => [
      l.id,
      l.recipient,
      `"${l.recipientName || ""}"`,
      `"${l.subject.replace(/"/g, '""')}"`,
      l.template,
      l.time,
      l.latency,
      l.status,
      `"${l.smtpResponse || ""}"`,
      `"${l.from || ""}"`,
      l.ip || "",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8,\uFEFF" +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `email_delivery_telemetry_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    notify(`Exported ${dataToExport.length} email delivery logs.`);
  };

  return (
    <div className="sa-email-page">
      {/* 1. Header Bar */}
      <section className="sap-header-panel">
        <div className="sap-header-left">
          <h1>SMTP / Email Relay Gateway</h1>
          <p className="sap-header-subtitle">
            Configure outgoing mail servers, inspect TLS 1.3 handshakes, verify DKIM/SPF domain authentications, and monitor live delivery logs.
          </p>
        </div>

        <div className="sap-header-actions">
          <button
            type="button"
            className="sa-btn sa-btn-secondary"
            onClick={handleExportCSV}
          >
            <Download size={15} /> Export Telemetry Logs
          </button>
          <button
            type="button"
            className="sa-btn sa-btn-primary"
            onClick={() => setTestModalOpen(true)}
          >
            <Send size={15} /> Send Test Email
          </button>
        </div>
      </section>

      {/* 2. Top 4 Telemetry Cards */}
      <section className="sap-kpi-grid">
        <article className="sa-kpi-card">
          <div className="sa-kpi-icon-box green">
            <CheckCircle2 size={24} strokeWidth={2.2} />
          </div>
          <div className="sa-kpi-body">
            <p className="sa-kpi-title">SMTP Relay Health</p>
            <div className="sa-kpi-val-row">
              <span className="sa-kpi-value">Operational</span>
              <span className="sa-kpi-trend positive">
                <ArrowUpRight size={14} /> 99.8%
              </span>
            </div>
            <span className="sa-kpi-subtitle">TLS 1.3 Encrypted Port {smtpConfig.port}</span>
          </div>
        </article>

        <article className="sa-kpi-card">
          <div className="sa-kpi-icon-box blue">
            <Mail size={24} strokeWidth={2.2} />
          </div>
          <div className="sa-kpi-body">
            <p className="sa-kpi-title">Monthly Relayed Volume</p>
            <div className="sa-kpi-val-row">
              <span className="sa-kpi-value">48,290</span>
              <span className="sa-kpi-trend positive">
                <ArrowUpRight size={14} /> 12%
              </span>
            </div>
            <span className="sa-kpi-subtitle">+5,200 this billing cycle</span>
          </div>
        </article>

        <article className="sa-kpi-card">
          <div className="sa-kpi-icon-box sky">
            <Zap size={24} strokeWidth={2.2} />
          </div>
          <div className="sa-kpi-body">
            <p className="sa-kpi-title">Average Delivery Latency</p>
            <div className="sa-kpi-val-row">
              <span className="sa-kpi-value">24ms</span>
              <span className="sa-kpi-trend positive">
                Optimal
              </span>
            </div>
            <span className="sa-kpi-subtitle">Direct relay node connection</span>
          </div>
        </article>

        <article className="sa-kpi-card">
          <div className="sa-kpi-icon-box amber">
            <AlertTriangle size={24} strokeWidth={2.2} />
          </div>
          <div className="sa-kpi-body">
            <p className="sa-kpi-title">Bounce &amp; Drop Rate</p>
            <div className="sa-kpi-val-row">
              <span className="sa-kpi-value">0.12%</span>
              <span className="sa-kpi-trend positive">
                Healthy
              </span>
            </div>
            <span className="sa-kpi-subtitle">Well below 2.0% industry limit</span>
          </div>
        </article>
      </section>

      {toast && (
        <div className="sa-toast-banner">
          <CheckCircle2 size={16} /> {toast}
        </div>
      )}

      {/* 3. SMTP Relay Configuration & Provider Presets Card */}
      <section className="sa-card sa-smtp-settings-card">
        {/* Card Header with Connection Ping Trigger */}
        <div className="sa-smtp-header-row">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Server size={18} color="#3b66ff" />
              <h3>Outgoing Mail Server (SMTP) Settings</h3>
              <span className="sa-relay-status-chip">Production Relay</span>
            </div>
            <p className="sa-smtp-header-sub">
              Manage default SMTP routing parameters, authentication credentials, and envelope headers
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button
              type="button"
              className="sa-btn sa-btn-secondary sa-btn-sm"
              onClick={handleTestConnection}
              disabled={pingState === "testing"}
            >
              {pingState === "testing" ? (
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <RefreshCw size={13} className="spin-animation" /> Testing Handshake...
                </span>
              ) : pingState === "success" ? (
                <span style={{ color: "#10b981", display: "flex", alignItems: "center", gap: 4 }}>
                  <CheckCircle2 size={13} /> Connection Verified
                </span>
              ) : (
                <>
                  <Server size={13} /> Test SMTP Handshake
                </>
              )}
            </button>
          </div>
        </div>

        {/* Diagnostic Handshake Result Banner */}
        {pingState === "success" && pingDetails && (
          <div className="sa-ping-success-banner">
            <div className="sa-ping-banner-left">
              <CheckCircle2 size={18} color="#10b981" />
              <div>
                <strong>SMTP Relay Connection Verified (Latency: {pingDetails.latency})</strong>
                <p>
                  Remote Host: <code>{smtpConfig.host}</code> ({pingDetails.ip}) · Cipher Suite: <code>{pingDetails.cipher}</code>
                </p>
              </div>
            </div>
            <span className="sa-ping-time">Verified at {pingDetails.timestamp}</span>
          </div>
        )}

        {/* One-Click Provider Presets Selector */}
        <div className="sa-smtp-presets-section">
          <label className="sa-field-label">Quick Provider Presets</label>
          <div className="sa-presets-grid">
            {SMTP_PRESETS.map((preset) => {
              const isSelected = activePreset === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  className={`sa-preset-card ${isSelected ? "is-selected" : ""}`}
                  onClick={() => handleSelectPreset(preset)}
                >
                  <div className="sa-preset-card-top">
                    <span
                      className="sa-preset-dot"
                      style={{ background: preset.logoColor }}
                    />
                    <strong>{preset.name}</strong>
                  </div>
                  <span className="sa-preset-badge">{preset.badge}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* SMTP Configuration Form */}
        <form onSubmit={handleSaveConfig} className="sa-smtp-main-form">
          <div className="sa-smtp-form-grid">
            {/* SMTP Host */}
            <div className="sa-form-field">
              <label>
                SMTP Host <span className="req">*</span>
              </label>
              <input
                type="text"
                className="sa-text-input"
                value={smtpConfig.host}
                onChange={(e) =>
                  setSmtpConfig({ ...smtpConfig, host: e.target.value })
                }
                placeholder="e.g. smtp.sendgrid.net"
                required
              />
              <span className="sa-field-hint">Fully qualified domain name or IP of the mail gateway</span>
            </div>

            {/* Port */}
            <div className="sa-form-field">
              <label>
                Port <span className="req">*</span>
              </label>
              <input
                type="text"
                className="sa-text-input"
                value={smtpConfig.port}
                onChange={(e) =>
                  setSmtpConfig({ ...smtpConfig, port: e.target.value })
                }
                placeholder="587"
                required
              />
              <span className="sa-field-hint">Standard submission ports: 587 (TLS), 465 (SSL), 2525</span>
            </div>

            {/* Encryption Protocol */}
            <div className="sa-form-field">
              <label>Encryption Protocol</label>
              <select
                className="sa-select-input"
                value={smtpConfig.encryption}
                onChange={(e) =>
                  setSmtpConfig({ ...smtpConfig, encryption: e.target.value })
                }
              >
                <option value="TLS">TLS 1.3 / STARTTLS (Recommended)</option>
                <option value="SSL">SSL Implicit Encryption (Port 465)</option>
                <option value="None">None / Plaintext (Internal Relays)</option>
              </select>
              <span className="sa-field-hint">Enforces encrypted transmission tunnel for envelope &amp; payloads</span>
            </div>

            {/* SMTP Username */}
            <div className="sa-form-field">
              <label>
                SMTP Username <span className="req">*</span>
              </label>
              <input
                type="text"
                className="sa-text-input"
                value={smtpConfig.username}
                onChange={(e) =>
                  setSmtpConfig({ ...smtpConfig, username: e.target.value })
                }
                placeholder="e.g. apikey or user@domain.com"
                required
              />
              <span className="sa-field-hint">Account identifier or API key username</span>
            </div>

            {/* SMTP Password / API Key with Show/Hide toggle */}
            <div className="sa-form-field">
              <label>
                SMTP Password / API Key <span className="req">*</span>
              </label>
              <div className="sa-password-input-wrap">
                <input
                  type={showPassword ? "text" : "password"}
                  className="sa-text-input has-toggle"
                  value={smtpConfig.password}
                  onChange={(e) =>
                    setSmtpConfig({ ...smtpConfig, password: e.target.value })
                  }
                  placeholder="Enter API token or password"
                  required
                />
                <button
                  type="button"
                  className="sa-pwd-toggle-btn"
                  onClick={() => setShowPassword((p) => !p)}
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              <span className="sa-field-hint">Encrypted at rest with AES-256 HSM keys</span>
            </div>

            {/* Default Sender Name */}
            <div className="sa-form-field">
              <label>
                Default Sender Name <span className="req">*</span>
              </label>
              <input
                type="text"
                className="sa-text-input"
                value={smtpConfig.fromName}
                onChange={(e) =>
                  setSmtpConfig({ ...smtpConfig, fromName: e.target.value })
                }
                placeholder="TeamFlow AI"
                required
              />
              <span className="sa-field-hint">Friendly display name shown in email client inbox</span>
            </div>

            {/* Default Sender Email */}
            <div className="sa-form-field sa-span-2">
              <label>
                Default Sender Email (From Address) <span className="req">*</span>
              </label>
              <input
                type="email"
                className="sa-text-input"
                value={smtpConfig.fromEmail}
                onChange={(e) =>
                  setSmtpConfig({ ...smtpConfig, fromEmail: e.target.value })
                }
                placeholder="notifications@teamflow.ai"
                required
              />
              <span className="sa-field-hint">Must match verified DNS domain records to pass SPF/DKIM</span>
            </div>

            {/* Live Envelope Preview Card */}
            <div className="sa-form-field sa-span-full">
              <div className="sa-envelope-preview-box">
                <div className="sa-envelope-meta">
                  <Mail size={15} color="#3b66ff" />
                  <span>Outgoing Envelope Identity Preview:</span>
                </div>
                <div className="sa-envelope-chip">
                  <strong>{smtpConfig.fromName}</strong> &lt;{smtpConfig.fromEmail}&gt;
                </div>
              </div>
            </div>
          </div>

          {/* Domain Authentication Status Badges */}
          <div className="sa-dns-auth-strip">
            <div className="sa-dns-auth-item">
              <span className="sa-dns-status-dot valid" />
              <div>
                <strong>SPF Record:</strong> <code>v=spf1 include:{activePreset === "sendgrid" ? "sendgrid.net" : "mailgun.org"} ~all</code>
                <span className="sa-auth-tag">Pass (Domain Verified)</span>
              </div>
            </div>

            <div className="sa-dns-auth-item">
              <span className="sa-dns-status-dot valid" />
              <div>
                <strong>DKIM Signature:</strong> <code>k=rsa; p=MIGfMA0GCSqGSIb3D...</code>
                <span className="sa-auth-tag">2048-bit RSA Active</span>
              </div>
            </div>

            <div className="sa-dns-auth-item">
              <span className="sa-dns-status-dot valid" />
              <div>
                <strong>DMARC Alignment:</strong> <code>v=DMARC1; p=reject; rua=mailto:dmarc@teamflow.ai</code>
                <span className="sa-auth-tag">Policy: Reject Spoofs</span>
              </div>
            </div>
          </div>

          {/* Footer Action Bar */}
          <div className="sa-smtp-footer-bar">
            <div>
              {saveStatus && (
                <span className="sa-save-success-tag">
                  <CheckCircle2 size={15} /> SMTP settings saved and relay routing refreshed!
                </span>
              )}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <button
                type="button"
                className="sa-btn sa-btn-secondary"
                onClick={() => {
                  setSmtpConfig({
                    host: "smtp.sendgrid.net",
                    port: "587",
                    encryption: "TLS",
                    username: "apikey",
                    password: "SG.e8aB9f939401kdmx9302_teamflow_live_auth",
                    fromName: "TeamFlow AI",
                    fromEmail: "notifications@teamflow.ai",
                  });
                  notify("Reset configuration fields to default.");
                }}
              >
                Reset Defaults
              </button>
              <button type="submit" className="sa-btn sa-btn-primary">
                <Check size={14} /> Save Configuration
              </button>
            </div>
          </div>
        </form>
      </section>

      {/* 4. Outgoing Email Delivery Logs Table */}
      <section className="sap-table-card">
        {/* Batch action banner */}
        {selectedLogIds.size > 0 && (
          <div className="sap-batch-banner">
            <span>
              <strong>{selectedLogIds.size}</strong> delivery logs selected
            </span>
            <div className="sap-batch-actions">
              <button
                type="button"
                className="sa-btn sa-btn-secondary sa-btn-sm"
                onClick={handleExportCSV}
              >
                <Download size={13} /> Export Selected ({selectedLogIds.size})
              </button>
              <button
                type="button"
                className="sa-btn sa-btn-primary sa-btn-sm"
                onClick={() => {
                  notify(`Batch re-queue scheduled for ${selectedLogIds.size} messages.`);
                  setSelectedLogIds(new Set());
                }}
              >
                <RotateCcw size={13} /> Batch Resend
              </button>
              <button
                type="button"
                className="sa-btn sa-btn-sm"
                style={{ background: "transparent", color: "inherit", border: 0 }}
                onClick={() => setSelectedLogIds(new Set())}
              >
                Clear
              </button>
            </div>
          </div>
        )}

        {/* Toolbar */}
        <div className="sap-toolbar">
          <div className="sap-toolbar-left">
            <div className="sap-search-input">
              <Search size={15} style={{ color: "var(--sa-text-muted)" }} />
              <input
                type="text"
                placeholder="Search logs by recipient, name, subject, or Mail ID..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setPage(1);
                  }}
                >
                  <X size={13} />
                </button>
              )}
            </div>

            <select
              className="sap-filter-select"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
            >
              <option value="all">Status: All Statuses</option>
              <option value="Delivered">Delivered (250 OK)</option>
              <option value="Bounced">Bounced (550 Error)</option>
              <option value="Deferred">Deferred (Greylisted)</option>
            </select>

            <select
              className="sap-filter-select"
              value={templateFilter}
              onChange={(e) => {
                setTemplateFilter(e.target.value);
                setPage(1);
              }}
            >
              <option value="all">Template: All Templates</option>
              <option value="Workspace Invite">Workspace Invite</option>
              <option value="Invoice Receipt">Invoice Receipt</option>
              <option value="Security Notice">Security Notice</option>
              <option value="Welcome Onboarding">Welcome Onboarding</option>
              <option value="Password Reset">Password Reset</option>
              <option value="Analytics Digest">Analytics Digest</option>
              <option value="Task Notification">Task Notification</option>
              <option value="Diagnostic Ping">Diagnostic Ping</option>
            </select>
          </div>

          <div className="sap-toolbar-right">
            {/* Table Density Switcher */}
            <button
              type="button"
              className="sap-icon-btn"
              onClick={() => setDensity((d) => (d === "standard" ? "compact" : "standard"))}
              title={`Switch table density (currently ${density})`}
            >
              <SlidersHorizontal size={15} />
            </button>

            {/* Reset Filters */}
            <button
              type="button"
              className="sap-icon-btn"
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("all");
                setTemplateFilter("all");
                setPage(1);
                notify("Reset log filters.");
              }}
              title="Reset all filters"
            >
              <RefreshCw size={15} />
            </button>
          </div>
        </div>

        {/* Table Data Grid */}
        <div className="sap-table-wrapper">
          <table className={`sap-grid is-${density}`}>
            <thead>
              <tr>
                <th style={{ width: 38, textAlign: "center" }}>
                  <input
                    type="checkbox"
                    checked={
                      paginatedLogs.length > 0 &&
                      paginatedLogs.every((l) => selectedLogIds.has(l.id))
                    }
                    onChange={handleSelectAll}
                    aria-label="Select all email logs"
                  />
                </th>
                <th style={{ width: 110 }}>Mail ID</th>
                <th>Recipient &amp; Contact</th>
                <th>Subject &amp; Template</th>
                <th>Timestamp</th>
                <th>Latency</th>
                <th>Relay Status</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedLogs.map((log) => {
                const isSelected = selectedLogIds.has(log.id);
                return (
                  <tr key={log.id} className={isSelected ? "is-selected" : ""}>
                    <td style={{ textAlign: "center" }}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleSelect(log.id)}
                      />
                    </td>
                    <td>
                      <span className="sap-id-cell">{log.id}</span>
                    </td>
                    <td>
                      <div className="eml-user-cell">
                        <strong className="eml-user-name">{log.recipient}</strong>
                        <span className="eml-user-sub">{log.recipientName}</span>
                      </div>
                    </td>
                    <td style={{ maxWidth: 320 }}>
                      <div className="eml-subject-text">{log.subject}</div>
                      <span className="eml-template-tag">{log.template}</span>
                    </td>
                    <td style={{ color: "var(--sa-text-muted)", fontSize: 12, whiteSpace: "nowrap" }}>
                      {log.time}
                    </td>
                    <td>
                      <span className={`eml-latency-pill ${parseInt(log.latency, 10) < 40 ? "is-fast" : "is-slow"}`}>
                        <Zap size={11} /> {log.latency}
                      </span>
                    </td>
                    <td>
                      <span className={`eml-status-pill status-${log.status.toLowerCase()}`}>
                        <span className="eml-status-dot" />
                        {log.status}
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <div className="eml-action-group">
                        <button
                          type="button"
                          className="eml-action-btn btn-view"
                          onClick={() => setSelectedLogPreview(log)}
                          title="View SMTP Diagnostic Forensics"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          type="button"
                          className="eml-action-btn btn-resend"
                          onClick={() => handleResendLog(log)}
                          title="Resend this message via SMTP"
                        >
                          <RotateCcw size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {paginatedLogs.length === 0 && (
                <tr>
                  <td colSpan="8" style={{ textAlign: "center", padding: "40px" }}>
                    No outgoing email logs match your search query or filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Pagination Bar */}
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
              of <strong>{filteredLogs.length}</strong> outgoing messages
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

      {/* 5. Diagnostic Log Forensics Modal */}
      {selectedLogPreview &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="sa-modal-backdrop"
            onClick={(e) => {
              if (e.target === e.currentTarget) setSelectedLogPreview(null);
            }}
          >
            <div
              className="sa-forensics-modal-dialog"
              role="dialog"
              aria-modal="true"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="sa-forensics-header">
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span className="sa-forensics-icon-box">
                    <Terminal size={19} color="#3b66ff" />
                  </span>
                  <div>
                    <h3 className="sa-forensics-title">SMTP Delivery Diagnostic Forensics</h3>
                    <p className="sa-forensics-subtitle">
                      Tracking Reference: <strong>{selectedLogPreview.id}</strong> · MIME Message Telemetry
                    </p>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span className={`eml-status-pill status-${selectedLogPreview.status.toLowerCase()}`}>
                    <span className="eml-status-dot" />
                    {selectedLogPreview.status}
                  </span>
                  <button
                    type="button"
                    className="sa-modal-close"
                    onClick={() => setSelectedLogPreview(null)}
                    aria-label="Close forensics modal"
                  >
                    <X size={17} />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="sa-forensics-body">
                {/* 2-Column Metadata Cards */}
                <div className="sa-forensics-grid">
                  {/* Card 1: Envelope & Message Identifiers */}
                  <div className="sa-forensic-card">
                    <div className="sa-card-heading">
                      <Mail size={14} color="#3b66ff" />
                      <span>Envelope &amp; Routing Identity</span>
                    </div>

                    <div className="sa-forensic-field">
                      <label>Sender (From Header)</label>
                      <strong className="mono">{selectedLogPreview.from}</strong>
                    </div>

                    <div className="sa-forensic-field">
                      <label>Recipient (To Header)</label>
                      <div>
                        <strong>{selectedLogPreview.recipient}</strong>
                        <span className="sub"> ({selectedLogPreview.recipientName})</span>
                      </div>
                    </div>

                    <div className="sa-forensic-field">
                      <label>Subject Header</label>
                      <span className="subject">{selectedLogPreview.subject}</span>
                    </div>

                    <div className="sa-forensic-field">
                      <label>Associated Template</label>
                      <span className="eml-template-tag">{selectedLogPreview.template}</span>
                    </div>
                  </div>

                  {/* Card 2: Network & TLS Relay Telemetry */}
                  <div className="sa-forensic-card">
                    <div className="sa-card-heading">
                      <ShieldCheck size={14} color="#16a34a" />
                      <span>Network &amp; TLS Handshake</span>
                    </div>

                    <div className="sa-forensic-field">
                      <label>Client Origin IP</label>
                      <span className="mono">{selectedLogPreview.ip}</span>
                    </div>

                    <div className="sa-forensic-field">
                      <label>Relay Node Host</label>
                      <span className="mono">{selectedLogPreview.clientHost || "relay-node-01.us-east.teamflow"}</span>
                    </div>

                    <div className="sa-forensic-field">
                      <label>Relay Latency &amp; Payload Size</label>
                      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <span className="eml-latency-pill is-fast">
                          <Zap size={11} /> {selectedLogPreview.latency}
                        </span>
                        <span style={{ fontSize: 11.5, color: "#64748b" }}>
                          Size: <strong>{selectedLogPreview.size || "18 KB"}</strong>
                        </span>
                      </div>
                    </div>

                    <div className="sa-forensic-field">
                      <label>Cipher Security Protocol</label>
                      <span className="mono">TLSv1.3 (ECDHE-RSA-AES256-GCM-SHA384)</span>
                    </div>
                  </div>
                </div>

                {/* SMTP Server Response Box */}
                <div className="sa-smtp-response-block">
                  <div className="sa-smtp-response-header">
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <Server size={14} color="#3b66ff" />
                      <span>SMTP Protocol Response Code</span>
                    </div>
                    <button
                      type="button"
                      className="sa-copy-diag-btn"
                      onClick={() => handleCopyDiagnostics(selectedLogPreview)}
                    >
                      {copiedHeader ? <Check size={13} color="#10b981" /> : <Copy size={13} />}
                      {copiedHeader ? "Copied" : "Copy Payload"}
                    </button>
                  </div>

                  <div className={`sa-smtp-terminal-code is-${selectedLogPreview.status.toLowerCase()}`}>
                    <div className="terminal-line"><span className="prefix">&gt;</span> CONNECT {smtpConfig.host}:587</div>
                    <div className="terminal-line"><span className="prefix">&lt;</span> 220 {smtpConfig.host} ESMTP Ready</div>
                    <div className="terminal-line"><span className="prefix">&gt;</span> EHLO {selectedLogPreview.clientHost}</div>
                    <div className="terminal-line"><span className="prefix">&lt;</span> 250-STARTTLS</div>
                    <div className="terminal-line"><span className="prefix">&lt;</span> 250-AUTH LOGIN PLAIN</div>
                    <div className="terminal-line"><span className="prefix">&gt;</span> STARTTLS</div>
                    <div className="terminal-line"><span className="prefix">&lt;</span> 220 2.0.0 Ready to start TLS</div>
                    <div className="terminal-line"><span className="prefix">&gt;</span> MAIL FROM:&lt;{smtpConfig.fromEmail}&gt;</div>
                    <div className="terminal-line"><span className="prefix">&gt;</span> RCPT TO:&lt;{selectedLogPreview.recipient}&gt;</div>
                    <div className="terminal-line"><span className="prefix">&gt;</span> DATA</div>
                    <div className="terminal-line is-highlight"><span className="prefix">&lt;</span> {selectedLogPreview.smtpResponse}</div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="sa-forensics-footer">
                <button
                  type="button"
                  className="sa-btn sa-btn-secondary"
                  onClick={() => setSelectedLogPreview(null)}
                >
                  Close
                </button>

                <div style={{ display: "flex", gap: 10 }}>
                  <button
                    type="button"
                    className="sa-btn sa-btn-secondary"
                    onClick={() => handleCopyDiagnostics(selectedLogPreview)}
                  >
                    <Copy size={14} /> Copy Diagnostic Log
                  </button>

                  <button
                    type="button"
                    className="sa-btn sa-btn-primary"
                    onClick={() => {
                      handleResendLog(selectedLogPreview);
                      setSelectedLogPreview(null);
                    }}
                  >
                    <RotateCcw size={14} /> Re-queue Message Delivery
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* 6. Send Test Diagnostic Email Modal */}
      {testModalOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="sa-modal-backdrop"
            onClick={(e) => {
              if (e.target === e.currentTarget) setTestModalOpen(false);
            }}
          >
            <div
              className="sa-test-email-dialog"
              role="dialog"
              aria-modal="true"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sa-test-modal-header">
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span className="sa-test-icon-box">
                    <Send size={18} color="#3b66ff" />
                  </span>
                  <div>
                    <h3 style={{ margin: 0, fontSize: 16, fontWeight: 750 }}>Send Test Diagnostic Email</h3>
                    <p style={{ margin: "2px 0 0", fontSize: 12, color: "#64748b" }}>
                      Verify live delivery to real mailbox using active SMTP credentials
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  className="sa-modal-close"
                  onClick={() => setTestModalOpen(false)}
                >
                  <X size={17} />
                </button>
              </div>

              <form onSubmit={handleSendTestEmail}>
                <div className="sa-test-modal-body">
                  <div className="sa-test-info-callout">
                    <Info size={16} color="#3b66ff" />
                    <span>
                      This sends a real test message through <strong>{smtpConfig.host}:{smtpConfig.port}</strong>. Check your recipient inbox or spam filter.
                    </span>
                  </div>

                  <div className="sa-form-field">
                    <label>
                      Recipient Email Address <span className="req">*</span>
                    </label>
                    <input
                      type="email"
                      className="sa-text-input"
                      value={testEmailTo}
                      onChange={(e) => setTestEmailTo(e.target.value)}
                      placeholder="your.email@company.com"
                      required
                    />
                  </div>

                  <div className="sa-form-field">
                    <label>Template Payload Simulation</label>
                    <select
                      className="sa-select-input"
                      value={testTemplate}
                      onChange={(e) => setTestTemplate(e.target.value)}
                    >
                      <option value="Diagnostic Ping">Diagnostic Ping (Simple SMTP Healthcheck)</option>
                      <option value="Workspace Invite">Workspace Invite (Button + Link)</option>
                      <option value="Invoice Receipt">Invoice Receipt (Tax Ledger Table)</option>
                      <option value="Security Notice">Security Notice (Urgent Alert)</option>
                      <option value="Welcome Onboarding">Welcome Onboarding (HTML Email)</option>
                    </select>
                  </div>

                  <div className="sa-form-field">
                    <label>Subject Line Preview</label>
                    <input
                      type="text"
                      className="sa-text-input"
                      value={`[Diagnostic] TeamFlow AI ${testTemplate} Test`}
                      disabled
                      style={{ background: "#f8fafc", color: "#64748b" }}
                    />
                  </div>
                </div>

                <div className="sa-test-modal-footer">
                  <button
                    type="button"
                    className="sa-btn sa-btn-secondary"
                    onClick={() => setTestModalOpen(false)}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="sa-btn sa-btn-primary"
                    disabled={testSendStatus === "sending"}
                  >
                    {testSendStatus === "sending" ? (
                      <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <RefreshCw size={14} className="spin-animation" /> Dispatching Relay...
                      </span>
                    ) : testSendStatus === "sent" ? (
                      <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <Check size={14} /> Sent Successfully!
                      </span>
                    ) : (
                      <>
                        <Send size={14} /> Send Diagnostic Ping
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}

export default EmailConfig;
