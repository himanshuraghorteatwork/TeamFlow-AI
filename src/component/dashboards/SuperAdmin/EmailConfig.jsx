import { useState } from "react";
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
} from "lucide-react";
import "./SuperAdminCommon.css";
import "./EmailConfig.css";

const INITIAL_LOGS = [
  {
    id: "EML-401",
    recipient: "priya@abc.com",
    subject: "Invitation to join ABC Technologies on TeamFlow AI",
    template: "Workspace Invite",
    time: "Today, 10:31 AM",
    latency: "32ms",
    status: "Delivered",
  },
  {
    id: "EML-402",
    recipient: "admin@novatech.io",
    subject: "Your TeamFlow AI Enterprise Monthly Invoice #INV-1087",
    template: "Invoice Receipt",
    time: "Today, 09:15 AM",
    latency: "28ms",
    status: "Delivered",
  },
  {
    id: "EML-403",
    recipient: "amit@xyz.com",
    subject: "Security Alert: New Super Admin Login from IP 192.168.1.104",
    template: "Security Notice",
    time: "Today, 08:40 AM",
    latency: "21ms",
    status: "Delivered",
  },
  {
    id: "EML-404",
    recipient: "alex@startup.org",
    subject: "Welcome to TeamFlow AI! Complete your setup",
    template: "Welcome Onboarding",
    time: "Yesterday, 07:12 PM",
    latency: "45ms",
    status: "Delivered",
  },
  {
    id: "EML-405",
    recipient: "invalid-user@baddomain.test",
    subject: "Reset your TeamFlow AI password",
    template: "Password Reset",
    time: "Yesterday, 02:22 PM",
    latency: "112ms",
    status: "Bounced",
  },
];

function EmailConfig() {
  const [smtpConfig, setSmtpConfig] = useState({
    host: "smtp.sendgrid.net",
    port: "587",
    encryption: "TLS",
    username: "apikey",
    password: "SG.e8aB9f939401kdmx9302_teamflow",
    fromName: "TeamFlow AI",
    fromEmail: "notifications@teamflow.ai",
  });

  const [pingState, setPingState] = useState(null); // null | "testing" | "success" | "error"
  const [testModalOpen, setTestModalOpen] = useState(false);
  const [testEmailTo, setTestEmailTo] = useState("himanshu@teamflow.ai");
  const [testSendStatus, setTestSendStatus] = useState(null);
  const [saveStatus, setSaveStatus] = useState(false);
  const [logs, setLogs] = useState(INITIAL_LOGS);

  const handleTestConnection = () => {
    setPingState("testing");
    setTimeout(() => {
      setPingState("success");
    }, 1000);
  };

  const handleSaveConfig = (e) => {
    e.preventDefault();
    setSaveStatus(true);
    setTimeout(() => {
      setSaveStatus(false);
    }, 3000);
  };

  const handleSendTestEmail = (e) => {
    e.preventDefault();
    setTestSendStatus("sending");
    setTimeout(() => {
      setTestSendStatus("sent");
      setLogs((prev) => [
        {
          id: `EML-${Date.now().toString().slice(-3)}`,
          recipient: testEmailTo,
          subject: "Test message from TeamFlow AI SMTP diagnostic tool",
          template: "Diagnostic Ping",
          time: "Just now",
          latency: "24ms",
          status: "Delivered",
        },
        ...prev,
      ]);
      setTimeout(() => {
        setTestModalOpen(false);
        setTestSendStatus(null);
      }, 1500);
    }, 1200);
  };

  return (
    <div className="sa-page-container sa-email-page">
      {/* 1. Page Header */}
      <section className="sa-page-header">
        <div className="sa-page-header-left">
          <h1>SMTP / Email Configuration</h1>
          <p>Configure transactional mail servers, verify DKIM/SPF headers, and test delivery.</p>
        </div>

        <div className="sa-page-header-actions">
          <button
            type="button"
            className="sa-btn sa-btn-secondary"
            onClick={() => setTestModalOpen(true)}
          >
            <Send size={15} /> Send Test Email
          </button>
        </div>
      </section>

      {/* 2. Top 4 KPI Stat Cards */}
      <section className="sa-kpi-grid">
        <article className="sa-kpi-card">
          <div className="sa-kpi-icon-box green">
            <CheckCircle2 size={24} strokeWidth={2.2} />
          </div>
          <div className="sa-kpi-body">
            <p className="sa-kpi-title">SMTP Status</p>
            <div className="sa-kpi-val-row">
              <span className="sa-kpi-value">Operational</span>
              <span className="sa-kpi-trend positive">
                <ArrowUpRight size={14} /> 99.8%
              </span>
            </div>
            <span className="sa-kpi-subtitle">TLS Encrypted Port 587</span>
          </div>
        </article>

        <article className="sa-kpi-card">
          <div className="sa-kpi-icon-box blue">
            <Mail size={24} strokeWidth={2.2} />
          </div>
          <div className="sa-kpi-body">
            <p className="sa-kpi-title">Emails Sent (Month)</p>
            <div className="sa-kpi-val-row">
              <span className="sa-kpi-value">48,290</span>
              <span className="sa-kpi-trend positive">
                <ArrowUpRight size={14} /> 12%
              </span>
            </div>
            <span className="sa-kpi-subtitle">+ 5,200 this month</span>
          </div>
        </article>

        <article className="sa-kpi-card">
          <div className="sa-kpi-icon-box sky">
            <Zap size={24} strokeWidth={2.2} />
          </div>
          <div className="sa-kpi-body">
            <p className="sa-kpi-title">Avg. Delivery Latency</p>
            <div className="sa-kpi-val-row">
              <span className="sa-kpi-value">24ms</span>
              <span className="sa-kpi-trend positive">
                Optimal
              </span>
            </div>
            <span className="sa-kpi-subtitle">Direct relay connection</span>
          </div>
        </article>

        <article className="sa-kpi-card">
          <div className="sa-kpi-icon-box amber">
            <AlertTriangle size={24} strokeWidth={2.2} />
          </div>
          <div className="sa-kpi-body">
            <p className="sa-kpi-title">Bounce Rate</p>
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

      {/* 3. SMTP Server Configuration Form */}
      <section className="sa-card sa-smtp-form-card">
        <div className="sa-card-header">
          <h3>Outgoing Mail Server (SMTP) Settings</h3>
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              type="button"
              className="sa-btn sa-btn-secondary sa-btn-sm"
              onClick={handleTestConnection}
              disabled={pingState === "testing"}
            >
              {pingState === "testing" ? (
                <>Testing...</>
              ) : pingState === "success" ? (
                <span style={{ color: "#10b981", display: "flex", alignItems: "center", gap: 4 }}>
                  <CheckCircle2 size={13} /> Connection Verified
                </span>
              ) : (
                <>
                  <Server size={13} /> Test SMTP Connection
                </>
              )}
            </button>
          </div>
        </div>

        <form onSubmit={handleSaveConfig}>
          <div className="sa-smtp-fields-grid">
            <div className="sa-form-group">
              <label>SMTP Host</label>
              <input
                type="text"
                className="sa-form-input"
                value={smtpConfig.host}
                onChange={(e) =>
                  setSmtpConfig({ ...smtpConfig, host: e.target.value })
                }
                required
              />
            </div>

            <div className="sa-form-group">
              <label>Port</label>
              <input
                type="text"
                className="sa-form-input"
                value={smtpConfig.port}
                onChange={(e) =>
                  setSmtpConfig({ ...smtpConfig, port: e.target.value })
                }
                required
              />
            </div>

            <div className="sa-form-group">
              <label>Encryption Protocol</label>
              <select
                className="sa-form-select"
                value={smtpConfig.encryption}
                onChange={(e) =>
                  setSmtpConfig({ ...smtpConfig, encryption: e.target.value })
                }
              >
                <option value="TLS">TLS (Recommended)</option>
                <option value="SSL">SSL</option>
                <option value="None">None / Plain</option>
              </select>
            </div>

            <div className="sa-form-group">
              <label>SMTP Username</label>
              <input
                type="text"
                className="sa-form-input"
                value={smtpConfig.username}
                onChange={(e) =>
                  setSmtpConfig({ ...smtpConfig, username: e.target.value })
                }
                required
              />
            </div>

            <div className="sa-form-group">
              <label>SMTP Password / API Key</label>
              <input
                type="password"
                className="sa-form-input"
                value={smtpConfig.password}
                onChange={(e) =>
                  setSmtpConfig({ ...smtpConfig, password: e.target.value })
                }
                required
              />
            </div>

            <div className="sa-form-group">
              <label>Default Sender Name</label>
              <input
                type="text"
                className="sa-form-input"
                value={smtpConfig.fromName}
                onChange={(e) =>
                  setSmtpConfig({ ...smtpConfig, fromName: e.target.value })
                }
                required
              />
            </div>

            <div className="sa-form-group">
              <label>Default Sender Email</label>
              <input
                type="email"
                className="sa-form-input"
                value={smtpConfig.fromEmail}
                onChange={(e) =>
                  setSmtpConfig({ ...smtpConfig, fromEmail: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="sa-smtp-footer-actions">
            {saveStatus && (
              <span className="sa-save-success-msg">
                <CheckCircle2 size={15} /> SMTP Configuration saved successfully!
              </span>
            )}
            <button type="submit" className="sa-btn sa-btn-primary">
              Save Configuration
            </button>
          </div>
        </form>
      </section>

      {/* 4. Recent Email Logs Table */}
      <section className="sa-card sa-email-logs-card">
        <div className="sa-card-header">
          <h3>Recent Outgoing Email Logs</h3>
          <span className="sa-total-tag">Live Feed</span>
        </div>

        <div className="sa-table-wrapper">
          <table className="sa-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Recipient</th>
                <th>Subject</th>
                <th>Template</th>
                <th>Timestamp</th>
                <th>Latency</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id}>
                  <td>
                    <strong style={{ color: "#3b66ff" }}>{log.id}</strong>
                  </td>
                  <td>
                    <strong>{log.recipient}</strong>
                  </td>
                  <td style={{ color: "#334155" }}>{log.subject}</td>
                  <td>
                    <span className="sa-pill sa-pill-neutral">{log.template}</span>
                  </td>
                  <td style={{ color: "#64748b" }}>{log.time}</td>
                  <td style={{ color: "#64748b" }}>{log.latency}</td>
                  <td>
                    <span
                      className={`sa-pill ${
                        log.status === "Delivered"
                          ? "sa-pill-success"
                          : "sa-pill-danger"
                      }`}
                    >
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 5. Send Test Email Modal */}
      {testModalOpen && (
        <div className="sa-modal-backdrop">
          <div className="sa-modal-content">
            <div className="sa-modal-header">
              <h3>Send Test Diagnostic Email</h3>
              <button
                type="button"
                className="sa-modal-close"
                onClick={() => setTestModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSendTestEmail}>
              <div className="sa-modal-body">
                <p style={{ margin: "0 0 16px", color: "#64748b", fontSize: 12 }}>
                  Test your SMTP credentials and delivery pipeline by sending an automated diagnostic message.
                </p>

                <div className="sa-form-group">
                  <label>Recipient Email Address</label>
                  <input
                    type="email"
                    className="sa-form-input"
                    value={testEmailTo}
                    onChange={(e) => setTestEmailTo(e.target.value)}
                    required
                  />
                </div>

                <div className="sa-form-group">
                  <label>Message Subject</label>
                  <input
                    type="text"
                    className="sa-form-input"
                    value="TeamFlow AI SMTP Diagnostic Test"
                    disabled
                  />
                </div>
              </div>

              <div className="sa-modal-footer">
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
                    "Sending..."
                  ) : testSendStatus === "sent" ? (
                    "Sent Successfully!"
                  ) : (
                    <>
                      <Send size={14} /> Send Now
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default EmailConfig;

