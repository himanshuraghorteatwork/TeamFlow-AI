import { useState } from "react";
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
} from "lucide-react";
import "./SuperAdminCommon.css";
import "./Security.css";

const INITIAL_SESSIONS = [
  {
    id: "SES-1",
    device: "Chrome 130 on Windows 11",
    ip: "192.168.1.104",
    location: "New Delhi, India",
    isCurrent: true,
    lastActive: "Active right now",
    status: "Active",
  },
  {
    id: "SES-2",
    device: "Safari on macOS Sonoma",
    ip: "103.21.244.12",
    location: "Mumbai, India",
    isCurrent: false,
    lastActive: "2 hours ago",
    status: "Active",
  },
  {
    id: "SES-3",
    device: "TeamFlow AI Mobile App on iOS 18",
    ip: "182.72.18.90",
    location: "Bengaluru, India",
    isCurrent: false,
    lastActive: "Yesterday",
    status: "Active",
  },
];

const SECURITY_EVENTS = [
  {
    time: "Today, 10:20 AM",
    event: "Organization Suspended",
    actor: "Himanshu (Super Admin)",
    ip: "192.168.1.104",
    severity: "Medium",
    details: "Suspended XYZ Software due to payment audit",
  },
  {
    time: "Today, 08:15 AM",
    event: "Super Admin 2FA Login",
    actor: "Himanshu (Super Admin)",
    ip: "192.168.1.104",
    severity: "Low",
    details: "Successful TOTP verification code entered",
  },
  {
    time: "Yesterday, 11:42 PM",
    event: "Blocked Brute Force Probe",
    actor: "System Firewall",
    ip: "45.142.120.8",
    severity: "High",
    details: "Auto-banned IP after 5 invalid password attempts",
  },
  {
    time: "Yesterday, 04:10 PM",
    event: "SMTP Credentials Updated",
    actor: "Himanshu (Super Admin)",
    ip: "192.168.1.104",
    severity: "Medium",
    details: "Rotated SendGrid production API key",
  },
];

function Security() {
  const [sessions, setSessions] = useState(INITIAL_SESSIONS);
  const [securityRules, setSecurityRules] = useState({
    enforce2FA: true,
    autoTimeout: true,
    ipAllowlist: false,
    bruteForceProtection: true,
  });
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleRevokeSession = (id) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
  };

  const handleRevokeAllOthers = () => {
    setSessions((prev) => prev.filter((s) => s.isCurrent));
    alert("All other sessions terminated successfully!");
  };

  const handleToggle = (key) => {
    setSecurityRules((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="sa-page-container sa-security-page">
      {/* 1. Page Header */}
      <section className="sa-page-header">
        <div className="sa-page-header-left">
          <h1>Platform Security & Access Control</h1>
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
      <section className="sa-kpi-grid">
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
              <span className="sa-kpi-trend positive">
                Verified
              </span>
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
              <span className="sa-kpi-trend positive">
                Auto-blocked
              </span>
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
      <section className="sa-card sa-security-rules-card">
        <div className="sa-card-header">
          <h3>Platform Governance Policies</h3>
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

      {/* 4. Active Sessions Table */}
      <section className="sa-card sa-sessions-card">
        <div className="sa-card-header">
          <h3>Active Super Admin Sessions</h3>
          <span className="sa-total-tag">{sessions.length} Devices</span>
        </div>

        <div className="sa-table-wrapper">
          <table className="sa-table">
            <thead>
              <tr>
                <th>Device & Browser</th>
                <th>IP Address</th>
                <th>Approximate Location</th>
                <th>Last Active</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((ses) => (
                <tr key={ses.id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <Smartphone size={16} style={{ color: "#3b66ff" }} />
                      <div>
                        <strong>{ses.device}</strong>
                        {ses.isCurrent && (
                          <span
                            className="sa-pill sa-pill-success"
                            style={{ marginLeft: 8, fontSize: 10 }}
                          >
                            Current Device
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td>
                    <code>{ses.ip}</code>
                  </td>
                  <td>{ses.location}</td>
                  <td style={{ color: "#64748b" }}>{ses.lastActive}</td>
                  <td>
                    {ses.isCurrent ? (
                      <span style={{ color: "#10b981", fontSize: 11.5, fontWeight: 600 }}>
                        Active Session
                      </span>
                    ) : (
                      <button
                        type="button"
                        className="sa-btn sa-btn-secondary sa-btn-sm"
                        style={{ color: "#dc2626" }}
                        onClick={() => handleRevokeSession(ses.id)}
                      >
                        Revoke
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 5. Security Audit Trail Table */}
      <section className="sa-card sa-sec-events-card">
        <div className="sa-card-header">
          <h3>Recent Security & Authentication Events</h3>
          <span className="sa-total-tag">Immutable Audit Feed</span>
        </div>

        <div className="sa-table-wrapper">
          <table className="sa-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Event Type</th>
                <th>Actor</th>
                <th>IP Address</th>
                <th>Risk Level</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {SECURITY_EVENTS.map((ev, i) => (
                <tr key={i}>
                  <td style={{ color: "#64748b" }}>{ev.time}</td>
                  <td>
                    <strong>{ev.event}</strong>
                  </td>
                  <td>{ev.actor}</td>
                  <td>
                    <code>{ev.ip}</code>
                  </td>
                  <td>
                    <span
                      className={`sa-pill ${
                        ev.severity === "High"
                          ? "sa-pill-danger"
                          : ev.severity === "Medium"
                          ? "sa-pill-warning"
                          : "sa-pill-success"
                      }`}
                    >
                      {ev.severity}
                    </span>
                  </td>
                  <td style={{ color: "#334155" }}>{ev.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default Security;

