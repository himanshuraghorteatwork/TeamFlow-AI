import { useState } from "react";
import {
  HeartPulse,
  Server,
  Database,
  ShieldCheck,
  Mail,
  Bot,
  HardDrive,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Cpu,
  Activity,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";
import "./SuperAdminCommon.css";
import "./SystemHealth.css";

const CORE_SERVICES = [
  {
    name: "API Server",
    desc: "Node.js REST & GraphQL gateway cluster",
    icon: Server,
    uptime: "99.99%",
    latency: "18ms",
    status: "Operational",
    load: "31%",
  },
  {
    name: "Database (PostgreSQL)",
    desc: "Primary & replica failover DB cluster",
    icon: Database,
    uptime: "99.99%",
    latency: "32ms",
    status: "Operational",
    load: "45%",
  },
  {
    name: "Authentication Engine",
    desc: "OAuth2, JWT tokens & session cache",
    icon: ShieldCheck,
    uptime: "99.98%",
    latency: "12ms",
    status: "Operational",
    load: "19%",
  },
  {
    name: "SMTP Relay Service",
    desc: "Transactional mail queue & delivery",
    icon: Mail,
    uptime: "99.80%",
    latency: "24ms",
    status: "Operational",
    load: "22%",
  },
  {
    name: "AI Inference Service",
    desc: "Gemini, OpenAI & Claude model router",
    icon: Bot,
    uptime: "99.95%",
    latency: "1.2s",
    status: "Operational",
    load: "58%",
  },
  {
    name: "Distributed File Storage",
    desc: "S3 compatible assets & backup volume",
    icon: HardDrive,
    uptime: "100.0%",
    latency: "15ms",
    status: "Operational",
    load: "42%",
  },
];

const INCIDENT_LOGS = [
  {
    date: "Oct 12, 2024",
    service: "AI Service",
    description: "Upstream OpenAI latency spike resolved within 8 minutes via automated failover to Gemini.",
    impact: "Minor Latency",
    resolvedIn: "8m",
    status: "Resolved",
  },
  {
    date: "Sep 28, 2024",
    service: "Database",
    description: "Routine scheduled indexing maintenance executed with zero query loss.",
    impact: "Maintenance",
    resolvedIn: "24m",
    status: "Completed",
  },
];

function SystemHealth() {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  return (
    <div className="sa-page-container sa-health-page">
      {/* 1. Page Header */}
      <section className="sa-page-header">
        <div className="sa-page-header-left">
          <h1>System Health & Infrastructure</h1>
          <p>Real-time cluster telemetry, container resource metrics, and service availability monitors.</p>
        </div>

        <div className="sa-page-header-actions">
          <button
            type="button"
            className="sa-btn sa-btn-secondary"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw
              size={15}
              className={isRefreshing ? "sa-spin" : ""}
            />{" "}
            Refresh Telemetry
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
            <p className="sa-kpi-title">Global Platform Status</p>
            <div className="sa-kpi-val-row">
              <span className="sa-kpi-value">Operational</span>
              <span className="sa-kpi-trend positive">
                <CheckCircle2 size={14} /> 6/6 Online
              </span>
            </div>
            <span className="sa-kpi-subtitle">All microservices healthy</span>
          </div>
        </article>

        <article className="sa-kpi-card">
          <div className="sa-kpi-icon-box blue">
            <Activity size={24} strokeWidth={2.2} />
          </div>
          <div className="sa-kpi-body">
            <p className="sa-kpi-title">Rolling Uptime (90d)</p>
            <div className="sa-kpi-val-row">
              <span className="sa-kpi-value">99.98%</span>
              <span className="sa-kpi-trend positive">
                <ArrowUpRight size={14} /> Exceeding SLA
              </span>
            </div>
            <span className="sa-kpi-subtitle">Target SLA: 99.90%</span>
          </div>
        </article>

        <article className="sa-kpi-card">
          <div className="sa-kpi-icon-box sky">
            <Cpu size={24} strokeWidth={2.2} />
          </div>
          <div className="sa-kpi-body">
            <p className="sa-kpi-title">Compute Cluster CPU</p>
            <div className="sa-kpi-val-row">
              <span className="sa-kpi-value">28%</span>
              <span className="sa-kpi-trend positive">
                Normal load
              </span>
            </div>
            <span className="sa-kpi-subtitle">8 nodes in autoscale pool</span>
          </div>
        </article>

        <article className="sa-kpi-card">
          <div className="sa-kpi-icon-box amber">
            <HardDrive size={24} strokeWidth={2.2} />
          </div>
          <div className="sa-kpi-body">
            <p className="sa-kpi-title">Cloud Storage Used</p>
            <div className="sa-kpi-val-row">
              <span className="sa-kpi-value">42%</span>
              <span className="sa-kpi-trend positive">
                1.26 TB / 3 TB
              </span>
            </div>
            <span className="sa-kpi-subtitle">NVMe High-Speed Tier</span>
          </div>
        </article>
      </section>

      {/* 3. Six Monitored Microservices */}
      <section className="sa-services-grid">
        {CORE_SERVICES.map((srv) => {
          const Icon = srv.icon;
          return (
            <article key={srv.name} className="sa-card sa-service-card">
              <div className="sa-service-card-top">
                <div className="sa-service-icon-box">
                  <Icon size={20} strokeWidth={2.2} />
                </div>
                <div style={{ flex: 1 }}>
                  <h3 className="sa-service-name">{srv.name}</h3>
                  <p className="sa-service-desc">{srv.desc}</p>
                </div>
                <span className="sa-pill sa-pill-success">
                  <span className="sa-health-dot" /> {srv.status}
                </span>
              </div>

              <div className="sa-service-stats-grid">
                <div>
                  <span className="sa-srv-label">UPTIME</span>
                  <strong>{srv.uptime}</strong>
                </div>
                <div>
                  <span className="sa-srv-label">AVG LATENCY</span>
                  <strong>{srv.latency}</strong>
                </div>
                <div>
                  <span className="sa-srv-label">CURRENT LOAD</span>
                  <strong>{srv.load}</strong>
                </div>
              </div>
            </article>
          );
        })}
      </section>

      {/* 4. Incident & Maintenance Log Table */}
      <section className="sa-card sa-incident-card">
        <div className="sa-card-header">
          <h3>Recent Incidents & Maintenance Windows</h3>
          <span className="sa-total-tag">Past 30 Days</span>
        </div>

        <div className="sa-table-wrapper">
          <table className="sa-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Affected Service</th>
                <th>Incident Description</th>
                <th>Impact Level</th>
                <th>Resolution Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {INCIDENT_LOGS.map((inc, i) => (
                <tr key={i}>
                  <td style={{ color: "#64748b" }}>{inc.date}</td>
                  <td>
                    <strong>{inc.service}</strong>
                  </td>
                  <td style={{ color: "#334155" }}>{inc.description}</td>
                  <td>
                    <span className="sa-pill sa-pill-neutral">{inc.impact}</span>
                  </td>
                  <td style={{ color: "#64748b" }}>{inc.resolvedIn}</td>
                  <td>
                    <span className="sa-pill sa-pill-success">{inc.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default SystemHealth;

