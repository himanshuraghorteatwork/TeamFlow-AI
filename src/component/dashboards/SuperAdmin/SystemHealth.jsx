import { useState, useMemo } from "react";
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
  Search,
  Filter,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Download,
  Zap,
  Radio,
  Eye,
  Layers,
  LayoutGrid,
  Table as TableIcon,
  X,
  Play,
  Check,
} from "lucide-react";
import "./SuperAdminCommon.css";
import "./SystemHealth.css";

const CORE_SERVICES = [
  {
    id: "SRV-API",
    name: "API Gateway Cluster",
    desc: "Node.js REST & GraphQL gateway cluster (port 4000)",
    icon: Server,
    category: "Gateway & API",
    uptime: "99.99%",
    latency: "18ms",
    status: "Operational",
    load: "31%",
    loadValue: 31,
    nodes: "8 active pods",
    version: "v2.8.4",
  },
  {
    id: "SRV-PG",
    name: "PostgreSQL Database",
    desc: "Primary & replica failover DB cluster (AWS RDS Multi-AZ)",
    icon: Database,
    category: "Relational Storage",
    uptime: "99.99%",
    latency: "32ms",
    status: "Operational",
    load: "45%",
    loadValue: 45,
    nodes: "2 replicas + 1 master",
    version: "PostgreSQL 16.2",
  },
  {
    id: "SRV-REDIS",
    name: "Redis Cache Cluster",
    desc: "Distributed in-memory session and ratelimit store",
    icon: Zap,
    category: "In-Memory Cache",
    uptime: "99.99%",
    latency: "2ms",
    status: "Operational",
    load: "24%",
    loadValue: 24,
    nodes: "3 shard nodes",
    version: "Redis 7.2",
  },
  {
    id: "SRV-AUTH",
    name: "Authentication Engine",
    desc: "OAuth2, JWT tokens, RBAC & TOTP 2FA verification",
    icon: ShieldCheck,
    category: "Identity & Security",
    uptime: "99.98%",
    latency: "12ms",
    status: "Operational",
    load: "19%",
    loadValue: 19,
    nodes: "4 active pods",
    version: "Auth0 / Keycloak",
  },
  {
    id: "SRV-MAIL",
    name: "SMTP Relay Service",
    desc: "Transactional mail queue & delivery engine (SendGrid / Postmark)",
    icon: Mail,
    category: "Messaging Relay",
    uptime: "99.80%",
    latency: "24ms",
    status: "Operational",
    load: "22%",
    loadValue: 22,
    nodes: "RabbitMQ Queue",
    version: "SMTP TLS 1.3",
  },
  {
    id: "SRV-AI",
    name: "AI Inference Router",
    desc: "Gemini 2.0, OpenAI GPT-4o & Claude model proxy",
    icon: Bot,
    category: "AI Gateway",
    uptime: "99.95%",
    latency: "1.2s",
    status: "Operational",
    load: "58%",
    loadValue: 58,
    nodes: "Load Balanced Proxy",
    version: "LangChain / GenAI SDK",
  },
  {
    id: "SRV-S3",
    name: "Distributed Asset Storage",
    desc: "S3 compatible assets, encrypted media & snapshot backup volume",
    icon: HardDrive,
    category: "Object Storage",
    uptime: "100.0%",
    latency: "15ms",
    status: "Operational",
    load: "42%",
    loadValue: 42,
    nodes: "AWS S3 / Cloudflare R2",
    version: "S3 API v4",
  },
  {
    id: "SRV-WS",
    name: "Realtime WebSocket Hub",
    desc: "Socket.io live collaboration channel & broadcast server",
    icon: Radio,
    category: "Realtime Gateway",
    uptime: "99.94%",
    latency: "14ms",
    status: "Operational",
    load: "37%",
    loadValue: 37,
    nodes: "4 WebSocket workers",
    version: "Engine.io 6.4",
  },
];

const INITIAL_INCIDENTS = [
  {
    id: "INC-204",
    date: "Oct 26, 2026, 10:20 AM",
    service: "AI Inference Router",
    category: "AI Gateway",
    description: "Upstream OpenAI latency spike resolved within 8 minutes via automated failover to Gemini 2.0 Flash.",
    impact: "Minor Latency",
    resolvedIn: "8m",
    status: "Resolved",
    engineer: "AI Ops Agent",
  },
  {
    id: "INC-203",
    date: "Oct 20, 2026, 02:00 AM",
    service: "PostgreSQL Database",
    category: "Relational Storage",
    description: "Routine scheduled indexing maintenance and dead-tuple vacuum executed with zero query loss.",
    impact: "Scheduled Maintenance",
    resolvedIn: "24m",
    status: "Completed",
    engineer: "Database Admin (DBA)",
  },
  {
    id: "INC-202",
    date: "Oct 15, 2026, 04:14 PM",
    service: "SMTP Relay Service",
    category: "Messaging Relay",
    description: "SendGrid webhooks queue backpressure mitigated by auto-scaling background Celery workers.",
    impact: "Minor Latency",
    resolvedIn: "12m",
    status: "Resolved",
    engineer: "SRE On-Call",
  },
  {
    id: "INC-201",
    date: "Oct 08, 2026, 11:30 PM",
    service: "Distributed Asset Storage",
    category: "Object Storage",
    description: "Regional SSL certificate automated renewal executed successfully by cert-manager.",
    impact: "Configuration",
    resolvedIn: "4m",
    status: "Resolved",
    engineer: "DevOps Automated",
  },
  {
    id: "INC-200",
    date: "Sep 28, 2026, 08:00 AM",
    service: "API Gateway Cluster",
    category: "Gateway & API",
    description: "Kubernetes rolling update for microservice pods completed without connection disruption.",
    impact: "Rolling Update",
    resolvedIn: "15m",
    status: "Completed",
    engineer: "Infra Team",
  },
];

function SystemHealth() {
  const [services, setServices] = useState(CORE_SERVICES);
  const [incidents, setIncidents] = useState(INITIAL_INCIDENTS);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Services View & Filter State
  const [serviceView, setServiceView] = useState("table"); // "table" | "grid"
  const [serviceSearch, setServiceSearch] = useState("");
  const [serviceCategoryFilter, setServiceCategoryFilter] = useState("all");
  const [serviceDensity, setServiceDensity] = useState("standard");

  // Incidents Table State
  const [incidentSearch, setIncidentSearch] = useState("");
  const [incidentServiceFilter, setIncidentServiceFilter] = useState("all");
  const [incidentStatusFilter, setIncidentStatusFilter] = useState("all");
  const [incidentDensity, setIncidentDensity] = useState("standard");
  const [incidentPage, setIncidentPage] = useState(1);
  const [selectedIncidentIds, setSelectedIncidentIds] = useState(new Set());
  const [incidentPageSize, setIncidentPageSize] = useState(5);

  // Incident Modal
  const [selectedIncident, setSelectedIncident] = useState(null);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setToastMessage("Telemetry refreshed: All cluster microservices reporting normal operation.");
      setTimeout(() => setToastMessage(""), 3500);
    }, 700);
  };

  const handleRestartService = (srvId) => {
    setToastMessage(`Triggering graceful restart for ${srvId}...`);
    setTimeout(() => {
      setToastMessage(`Service ${srvId} restarted successfully.`);
      setTimeout(() => setToastMessage(""), 3000);
    }, 1200);
  };

  // Filtered Services
  const filteredServices = useMemo(() => {
    return services.filter((srv) => {
      if (serviceCategoryFilter !== "all" && srv.category !== serviceCategoryFilter) return false;
      if (!serviceSearch.trim()) return true;
      const q = serviceSearch.toLowerCase();
      return (
        srv.name.toLowerCase().includes(q) ||
        srv.desc.toLowerCase().includes(q) ||
        srv.category.toLowerCase().includes(q) ||
        srv.id.toLowerCase().includes(q)
      );
    });
  }, [services, serviceCategoryFilter, serviceSearch]);

  // Filtered Incidents
  const filteredIncidents = useMemo(() => {
    return incidents.filter((inc) => {
      if (incidentServiceFilter !== "all" && inc.service !== incidentServiceFilter) return false;
      if (incidentStatusFilter !== "all" && inc.status !== incidentStatusFilter) return false;

      if (!incidentSearch.trim()) return true;
      const q = incidentSearch.toLowerCase();
      return (
        inc.id.toLowerCase().includes(q) ||
        inc.service.toLowerCase().includes(q) ||
        inc.description.toLowerCase().includes(q) ||
        inc.impact.toLowerCase().includes(q) ||
        inc.engineer.toLowerCase().includes(q)
      );
    });
  }, [incidents, incidentServiceFilter, incidentStatusFilter, incidentSearch]);

  const paginatedIncidents = useMemo(() => {
    const start = (incidentPage - 1) * incidentPageSize;
    return filteredIncidents.slice(start, start + incidentPageSize);
  }, [filteredIncidents, incidentPage]);

  const totalIncidentPages = Math.ceil(filteredIncidents.length / incidentPageSize) || 1;

  // Incident selection
  const handleSelectAllIncidents = (e) => {
    if (e.target.checked) {
      setSelectedIncidentIds(new Set(filteredIncidents.map((i) => i.id)));
    } else {
      setSelectedIncidentIds(new Set());
    }
  };

  const handleToggleIncidentSelect = (id) => {
    setSelectedIncidentIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleExportIncidentsCSV = () => {
    const dataToExport = selectedIncidentIds.size > 0
      ? incidents.filter((i) => selectedIncidentIds.has(i.id))
      : filteredIncidents;

    const headers = ["Incident ID", "Timestamp", "Service", "Impact", "Resolution Time", "Status", "Engineer", "Description"];
    const rows = dataToExport.map((i) => [
      i.id,
      i.date,
      i.service,
      i.impact,
      i.resolvedIn,
      i.status,
      i.engineer,
      `"${i.description.replace(/"/g, '""')}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `system_incident_logs_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="sa-page-container sa-health-page">
      {/* 1. SAP Enterprise Header */}
      <section className="sap-header-panel">
        <div className="sa-page-header-left">
          <h1>System Health &amp; Infrastructure</h1>
          <p>Real-time cluster telemetry, container resource metrics, and microservice availability monitors.</p>
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
      <section className="sap-kpi-grid">
        <article className="sa-kpi-card">
          <div className="sa-kpi-icon-box green">
            <CheckCircle2 size={24} strokeWidth={2.2} />
          </div>
          <div className="sa-kpi-body">
            <p className="sa-kpi-title">Global Platform Status</p>
            <div className="sa-kpi-val-row">
              <span className="sa-kpi-value">Operational</span>
              <span className="sa-kpi-trend positive">
                <CheckCircle2 size={14} /> {services.length}/{services.length} Online
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

      {toastMessage && (
        <div className="sa-toast-banner">
          <CheckCircle2 size={16} /> {toastMessage}
        </div>
      )}

      {/* 3. Monitored Microservices - Enterprise SaaS Table Card */}
      <section className="sap-table-card" style={{ marginBottom: 24 }}>
        {/* Toolbar */}
        <div className="sap-toolbar">
          <div className="sap-search-input">
            <Search size={15} />
            <input
              type="text"
              placeholder="Search microservices by name, description, or ID..."
              value={serviceSearch}
              onChange={(e) => setServiceSearch(e.target.value)}
            />
            {serviceSearch && (
              <button type="button" onClick={() => setServiceSearch("")}>
                <X size={13} />
              </button>
            )}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div className="sap-filter-select">
              <Filter size={14} />
              <select
                value={serviceCategoryFilter}
                onChange={(e) => setServiceCategoryFilter(e.target.value)}
              >
                <option value="all">All Service Categories ({services.length})</option>
                <option value="Gateway & API">Gateway & API</option>
                <option value="Relational Storage">Relational Storage</option>
                <option value="In-Memory Cache">In-Memory Cache</option>
                <option value="Identity & Security">Identity & Security</option>
                <option value="Messaging Relay">Messaging Relay</option>
                <option value="AI Gateway">AI Gateway</option>
                <option value="Object Storage">Object Storage</option>
                <option value="Realtime Gateway">Realtime Gateway</option>
              </select>
            </div>

            {/* View Switcher: Table vs Cards */}
            <div className="sa-view-switcher">
              <button
                type="button"
                className={`sa-view-btn ${serviceView === "table" ? "active" : ""}`}
                onClick={() => setServiceView("table")}
                title="Table Matrix View"
              >
                <TableIcon size={14} />
              </button>
              <button
                type="button"
                className={`sa-view-btn ${serviceView === "grid" ? "active" : ""}`}
                onClick={() => setServiceView("grid")}
                title="Service Cards Grid View"
              >
                <LayoutGrid size={14} />
              </button>
            </div>

            {serviceView === "table" && (
              <button
                type="button"
                className="sap-icon-btn"
                title={`Switch density (currently ${serviceDensity})`}
                onClick={() =>
                  setServiceDensity((prev) => (prev === "standard" ? "compact" : "standard"))
                }
              >
                <SlidersHorizontal size={15} />
              </button>
            )}
          </div>
        </div>

        {serviceView === "table" ? (
          <div className="sa-table-wrapper">
            <table className={`sap-grid is-${serviceDensity}`}>
              <thead>
                <tr>
                  <th>Service ID</th>
                  <th>Service Name & Cluster</th>
                  <th>Category</th>
                  <th>Target SLA</th>
                  <th>Avg Latency</th>
                  <th>Current CPU / RAM</th>
                  <th>Replica Nodes</th>
                  <th>Status</th>
                  <th style={{ textAlign: "right" }}>Operation</th>
                </tr>
              </thead>
              <tbody>
                {filteredServices.length === 0 ? (
                  <tr>
                    <td colSpan={9} style={{ textAlign: "center", padding: "36px 16px", color: "#64748b" }}>
                      No microservices matched your filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredServices.map((srv) => {
                    const Icon = srv.icon;
                    return (
                      <tr key={srv.id}>
                        <td>
                          <code className="sap-id-cell">{srv.id}</code>
                        </td>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div
                              style={{
                                width: 32,
                                height: 32,
                                borderRadius: 6,
                                backgroundColor: "#eff6ff",
                                color: "#2563eb",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <Icon size={16} />
                            </div>
                            <div>
                              <strong>{srv.name}</strong>
                              <div style={{ fontSize: 11.5, color: "#64748b" }}>{srv.desc}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="sap-role-badge">{srv.category}</span>
                        </td>
                        <td>
                          <strong style={{ color: "#0f766e" }}>{srv.uptime}</strong>
                        </td>
                        <td>
                          <code className="sap-id-cell">{srv.latency}</code>
                        </td>
                        <td style={{ minWidth: 140 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <div
                              style={{
                                flex: 1,
                                height: 6,
                                background: "var(--sa-bg, #f1f5f9)",
                                borderRadius: 3,
                                overflow: "hidden",
                              }}
                            >
                              <div
                                style={{
                                  width: srv.load,
                                  height: "100%",
                                  background: srv.loadValue > 70 ? "#ef4444" : srv.loadValue > 40 ? "#3b82f6" : "#10b981",
                                  borderRadius: 3,
                                }}
                              />
                            </div>
                            <span style={{ fontSize: 12, fontWeight: 600, minWidth: 32 }}>
                              {srv.load}
                            </span>
                          </div>
                        </td>
                        <td style={{ fontSize: 12, color: "#475569" }}>{srv.nodes}</td>
                        <td>
                          <span className="sap-status-pill green">
                            <span
                              style={{
                                width: 6,
                                height: 6,
                                borderRadius: "50%",
                                background: "#10b981",
                                display: "inline-block",
                                marginRight: 4,
                              }}
                            />
                            {srv.status}
                          </span>
                        </td>
                        <td style={{ textAlign: "right" }}>
                          <button
                            type="button"
                            className="sa-btn sa-btn-secondary sa-btn-sm"
                            title="Gracefully restart pod"
                            onClick={() => handleRestartService(srv.id)}
                          >
                            <RefreshCw size={12} /> Restart
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="sa-services-grid" style={{ padding: "16px" }}>
            {filteredServices.map((srv) => {
              const Icon = srv.icon;
              return (
                <article key={srv.id} className="sa-card sa-service-card">
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
          </div>
        )}

        <div className="sap-footer-bar">
          <span style={{ fontSize: 12.5, color: "#64748b" }}>
            Total <strong>{filteredServices.length}</strong> core services monitored · 0 degraded
          </span>
          <span style={{ fontSize: 12, color: "#94a3b8" }}>
            Autoscaling Engine: Active (Min 2 / Max 16 pods per service)
          </span>
        </div>
      </section>

      {/* 4. Incident & Maintenance Log Table - Enterprise SaaS Table Card */}
      <section className="sap-table-card">
        {/* Batch Banner */}
        {selectedIncidentIds.size > 0 && (
          <div className="sap-batch-banner">
            <span>
              <strong>{selectedIncidentIds.size}</strong> incident records selected
            </span>
            <div className="sap-batch-actions">
              <button
                type="button"
                className="sa-btn sa-btn-secondary sa-btn-sm"
                onClick={handleExportIncidentsCSV}
              >
                <Download size={13} /> Export Selected ({selectedIncidentIds.size})
              </button>
              <button
                type="button"
                className="sa-btn sa-btn-sm"
                style={{ background: "transparent", color: "inherit", border: 0 }}
                onClick={() => setSelectedIncidentIds(new Set())}
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
              placeholder="Search incidents by service, impact, description..."
              value={incidentSearch}
              onChange={(e) => {
                setIncidentSearch(e.target.value);
                setIncidentPage(1);
              }}
            />
            {incidentSearch && (
              <button
                type="button"
                onClick={() => {
                  setIncidentSearch("");
                  setIncidentPage(1);
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
                value={incidentServiceFilter}
                onChange={(e) => {
                  setIncidentServiceFilter(e.target.value);
                  setIncidentPage(1);
                }}
              >
                <option value="all">All Services</option>
                <option value="AI Inference Router">AI Inference Router</option>
                <option value="PostgreSQL Database">PostgreSQL Database</option>
                <option value="SMTP Relay Service">SMTP Relay Service</option>
                <option value="Distributed Asset Storage">Distributed Asset Storage</option>
                <option value="API Gateway Cluster">API Gateway Cluster</option>
              </select>
            </div>

            <div className="sap-filter-select">
              <select
                value={incidentStatusFilter}
                onChange={(e) => {
                  setIncidentStatusFilter(e.target.value);
                  setIncidentPage(1);
                }}
              >
                <option value="all">All Statuses</option>
                <option value="Resolved">Resolved</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <button
              type="button"
              className="sa-btn sa-btn-secondary sa-btn-sm"
              onClick={handleExportIncidentsCSV}
            >
              <Download size={14} /> Export CSV
            </button>

            <button
              type="button"
              className="sap-icon-btn"
              title={`Switch density (currently ${incidentDensity})`}
              onClick={() =>
                setIncidentDensity((prev) => (prev === "standard" ? "compact" : "standard"))
              }
            >
              <SlidersHorizontal size={15} />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="sa-table-wrapper">
          <table className={`sap-grid is-${incidentDensity}`}>
            <thead>
              <tr>
                <th style={{ width: 40, textAlign: "center" }}>
                  <input
                    type="checkbox"
                    checked={
                      filteredIncidents.length > 0 &&
                      filteredIncidents.every((i) => selectedIncidentIds.has(i.id))
                    }
                    onChange={handleSelectAllIncidents}
                    aria-label="Select all incidents"
                  />
                </th>
                <th>Incident ID</th>
                <th>Date & Time</th>
                <th>Affected Service</th>
                <th>Impact Level</th>
                <th>Resolution Window</th>
                <th>Responsible Engineer</th>
                <th>Resolution Status</th>
                <th style={{ textAlign: "right" }}>Forensics</th>
              </tr>
            </thead>
            <tbody>
              {paginatedIncidents.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: "center", padding: "36px 16px", color: "#64748b" }}>
                    No incident records matched your search query.
                  </td>
                </tr>
              ) : (
                paginatedIncidents.map((inc) => (
                  <tr key={inc.id}>
                    <td style={{ textAlign: "center" }}>
                      <input
                        type="checkbox"
                        checked={selectedIncidentIds.has(inc.id)}
                        onChange={() => handleToggleIncidentSelect(inc.id)}
                      />
                    </td>
                    <td>
                      <code className="sap-id-cell">{inc.id}</code>
                    </td>
                    <td style={{ fontSize: 12, color: "#64748b" }}>{inc.date}</td>
                    <td>
                      <strong>{inc.service}</strong>
                      <div style={{ fontSize: 11, color: "#64748b" }}>{inc.category}</div>
                    </td>
                    <td>
                      <span className="sap-role-badge">{inc.impact}</span>
                    </td>
                    <td style={{ fontSize: 12, color: "#475569" }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                        <Clock size={12} color="#64748b" />
                        {inc.resolvedIn}
                      </span>
                    </td>
                    <td>
                      <span className="sap-user-badge">{inc.engineer}</span>
                    </td>
                    <td>
                      <span className="sap-status-pill green">
                        {inc.status}
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <button
                        type="button"
                        className="sap-icon-btn"
                        title="View Incident Forensics"
                        onClick={() => setSelectedIncident(inc)}
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
              Showing <strong>{filteredIncidents.length === 0 ? 0 : (incidentPage - 1) * incidentPageSize + 1}</strong> to{" "}
              <strong>{Math.min(incidentPage * incidentPageSize, filteredIncidents.length)}</strong> of{" "}
              <strong>{filteredIncidents.length}</strong> incident logs
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#64748b" }}>
              <span>Rows per page:</span>
              <select
                className="sap-filter-select"
                style={{ padding: "3px 6px", fontSize: 12, height: 26 }}
                value={incidentPageSize}
                onChange={(e) => {
                  setIncidentPageSize(Number(e.target.value));
                  setIncidentPage(1);
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
              disabled={incidentPage <= 1}
              onClick={() => setIncidentPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft size={14} />
            </button>
            <span style={{ fontSize: 12.5, padding: "4px 8px", color: "#475569" }}>
              Page {incidentPage} of {totalIncidentPages}
            </span>
            <button
              type="button"
              className="sap-page-btn"
              disabled={incidentPage >= totalIncidentPages}
              onClick={() => setIncidentPage((p) => Math.min(totalIncidentPages, p + 1))}
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* Incident Forensics Modal */}
      {selectedIncident && (
        <div className="sa-modal-backdrop" onClick={() => setSelectedIncident(null)}>
          <div
            className="sa-modal-content"
            style={{ maxWidth: 540 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sa-modal-header">
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Activity size={20} color="#3b66ff" />
                <h3 style={{ margin: 0 }}>Incident Diagnostic Report</h3>
              </div>
              <button
                type="button"
                className="sa-modal-close"
                onClick={() => setSelectedIncident(null)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="sa-modal-body" style={{ padding: "20px 24px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }}>
                <div>
                  <span style={{ fontSize: 11, color: "#64748b", textTransform: "uppercase" }}>Incident ID</span>
                  <p style={{ margin: "4px 0 0", fontFamily: "monospace", fontWeight: 700 }}>
                    {selectedIncident.id}
                  </p>
                </div>
                <div>
                  <span style={{ fontSize: 11, color: "#64748b", textTransform: "uppercase" }}>Timestamp</span>
                  <p style={{ margin: "4px 0 0", fontWeight: 600 }}>{selectedIncident.date}</p>
                </div>
                <div>
                  <span style={{ fontSize: 11, color: "#64748b", textTransform: "uppercase" }}>Affected Service</span>
                  <p style={{ margin: "4px 0 0", fontWeight: 600 }}>{selectedIncident.service}</p>
                </div>
                <div>
                  <span style={{ fontSize: 11, color: "#64748b", textTransform: "uppercase" }}>Impact Scope</span>
                  <p style={{ margin: "4px 0 0" }}>
                    <span className="sap-role-badge">{selectedIncident.impact}</span>
                  </p>
                </div>
                <div>
                  <span style={{ fontSize: 11, color: "#64748b", textTransform: "uppercase" }}>Resolution Window</span>
                  <p style={{ margin: "4px 0 0", fontWeight: 600 }}>{selectedIncident.resolvedIn}</p>
                </div>
                <div>
                  <span style={{ fontSize: 11, color: "#64748b", textTransform: "uppercase" }}>Status</span>
                  <p style={{ margin: "4px 0 0" }}>
                    <span className="sap-status-pill green">{selectedIncident.status}</span>
                  </p>
                </div>
              </div>

              <div>
                <span style={{ fontSize: 11, color: "var(--sa-text-secondary, #64748b)", textTransform: "uppercase" }}>Root Cause & Resolution Summary</span>
                <div
                  style={{
                    marginTop: 6,
                    padding: 12,
                    background: "var(--sa-bg, #f8fafc)",
                    border: "1px solid var(--sa-border, #e2e8f0)",
                    borderRadius: 6,
                    fontSize: 13,
                    color: "var(--sa-text-main, #1e293b)",
                    lineHeight: 1.5,
                  }}
                >
                  {selectedIncident.description}
                </div>
              </div>
            </div>

            <div className="sa-modal-footer">
              <button
                type="button"
                className="sa-btn sa-btn-secondary"
                onClick={() => setSelectedIncident(null)}
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

export default SystemHealth;
