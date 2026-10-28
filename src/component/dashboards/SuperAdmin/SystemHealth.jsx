import { useState, useMemo, useEffect } from "react";
import { createPortal } from "react-dom";
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
  Globe,
  Lock,
  Terminal,
  Copy,
  ExternalLink,
  Shield,
  Gauge,
  Wifi,
  Sparkles,
} from "lucide-react";
import "./SuperAdminCommon.css";
import "./SystemHealth.css";

// 8 Core Microservices with high-fidelity cloud infrastructure metrics
const CORE_SERVICES = [
  {
    id: "SRV-API",
    name: "API Gateway Cluster",
    cluster: "k8s-us-east1-prod",
    desc: "Node.js REST & GraphQL gateway cluster (port 4000)",
    icon: Server,
    category: "Gateway & Routing",
    region: "us-east-1 (N. Virginia)",
    uptime: "99.99%",
    latency: "16ms",
    status: "Operational",
    load: "28%",
    loadValue: 28,
    memory: "4.6 GB / 16.0 GB",
    memoryPercent: 28.7,
    throughput: "4,920 req/s",
    errorRate: "0.001%",
    nodes: "8 active pods (Autoscaled)",
    nodeInstance: "c6i.2xlarge (8 vCPU, 16 GB)",
    version: "Envoy 1.30 / Node.js 20 LTS",
    endpoint: "https://api.internal.teamflow.ai/healthz",
    sslStatus: "Valid (TLS 1.3) · Renews in 78d",
    port: "443 / 4000 (VPC)",
  },
  {
    id: "SRV-PG",
    name: "PostgreSQL Database",
    cluster: "aws-rds-aurora-postgres",
    desc: "Primary & replica failover DB cluster (AWS RDS Multi-AZ)",
    icon: Database,
    category: "Relational Storage",
    region: "us-east-1 (Multi-AZ)",
    uptime: "99.99%",
    latency: "28ms",
    status: "Operational",
    load: "42%",
    loadValue: 42,
    memory: "26.8 GB / 64.0 GB",
    memoryPercent: 41.8,
    throughput: "1,480 qps",
    errorRate: "0.000%",
    nodes: "1 Master + 2 Read Replicas",
    nodeInstance: "db.r6g.2xlarge (8 vCPU, 64 GB)",
    version: "PostgreSQL 16.2 Enterprise",
    endpoint: "pg-cluster.internal.teamflow.ai:5432",
    sslStatus: "Enforced TLS 1.3 · Renews in 182d",
    port: "5432 (Encrypted VPC)",
  },
  {
    id: "SRV-REDIS",
    name: "Redis Cache Cluster",
    cluster: "elasticache-redis-cluster-01",
    desc: "Distributed in-memory session and ratelimit store",
    icon: Zap,
    category: "In-Memory Cache",
    region: "us-east-1b & 1c",
    uptime: "100.0%",
    latency: "1.8ms",
    status: "Operational",
    load: "21%",
    loadValue: 21,
    memory: "4.1 GB / 13.0 GB",
    memoryPercent: 31.5,
    throughput: "19,450 ops/s",
    errorRate: "0.000%",
    nodes: "3 Shards (6 nodes Multi-AZ)",
    nodeInstance: "cache.r6g.large (2 vCPU, 13 GB)",
    version: "Redis 7.2.4 Cluster",
    endpoint: "redis-cluster.internal.teamflow.ai:6379",
    sslStatus: "In-Transit Encryption · Renews in 92d",
    port: "6379 (AUTH Enforced)",
  },
  {
    id: "SRV-AUTH",
    name: "Authentication Engine",
    cluster: "k8s-sec-auth-cluster",
    desc: "OAuth2, JWT tokens, RBAC & TOTP 2FA verification",
    icon: ShieldCheck,
    category: "Identity & Security",
    region: "us-east-1 (Anycast)",
    uptime: "99.98%",
    latency: "11ms",
    status: "Operational",
    load: "18%",
    loadValue: 18,
    memory: "3.8 GB / 16.0 GB",
    memoryPercent: 23.7,
    throughput: "920 req/s",
    errorRate: "0.002%",
    nodes: "4 active worker pods",
    nodeInstance: "m6i.xlarge (4 vCPU, 16 GB)",
    version: "Keycloak 24.0 / OpenID Connect",
    endpoint: "https://auth.internal.teamflow.ai/realms/master/health",
    sslStatus: "Valid RSA-4096 · Renews in 64d",
    port: "8443 (Mutual TLS)",
  },
  {
    id: "SRV-AI",
    name: "AI Inference Router",
    cluster: "k8s-ai-gateway-us-east",
    desc: "Gemini 2.0 Flash, OpenAI GPT-4o & Claude model proxy",
    icon: Bot,
    category: "AI Gateway",
    region: "Multi-Cloud (AWS + GCP Vertex)",
    uptime: "99.95%",
    latency: "1.15s",
    status: "Operational",
    load: "56%",
    loadValue: 56,
    memory: "18.4 GB / 32.0 GB",
    memoryPercent: 57.5,
    throughput: "385 tokens/s (Avg)",
    errorRate: "0.003%",
    nodes: "6 Load Balanced Pods + Circuit Breaker",
    nodeInstance: "g4dn.2xlarge (8 vCPU, 32 GB, T4 GPU)",
    version: "LangChain / GenAI SDK / vLLM",
    endpoint: "https://ai.internal.teamflow.ai/v1/models",
    sslStatus: "Valid (TLS 1.3) · Renews in 110d",
    port: "8000 (Internal Secure Proxy)",
  },
  {
    id: "SRV-S3",
    name: "Distributed Asset Storage",
    cluster: "s3-multi-region-vault",
    desc: "S3 compatible assets, encrypted media & snapshot backup volume",
    icon: HardDrive,
    category: "Object Storage",
    region: "AWS S3 (us-east-1 + R2 Sync)",
    uptime: "100.0%",
    latency: "14ms",
    status: "Operational",
    load: "34%",
    loadValue: 34,
    memory: "8.2 GB / 24.0 GB",
    memoryPercent: 34.1,
    throughput: "2,100 req/s",
    errorRate: "0.000%",
    nodes: "Distributed Object Storage Pool",
    nodeInstance: "AWS S3 Standard + Intelligent Tiering",
    version: "S3 API v4 / AES-256 KMS",
    endpoint: "https://vault-assets.teamflow.ai/health",
    sslStatus: "Cloudflare Wildcard · Renews in 240d",
    port: "443 (HTTPS REST)",
  },
  {
    id: "SRV-MAIL",
    name: "SMTP Relay Service",
    cluster: "rabbitmq-celery-mail-workers",
    desc: "Transactional mail queue & delivery engine (SendGrid / Postmark)",
    icon: Mail,
    category: "Messaging Relay",
    region: "us-east-1c (Worker Tier)",
    uptime: "99.92%",
    latency: "22ms",
    status: "Operational",
    load: "24%",
    loadValue: 24,
    memory: "3.9 GB / 16.0 GB",
    memoryPercent: 24.3,
    throughput: "640 msgs/min",
    errorRate: "0.001%",
    nodes: "8 Celery Worker Pods",
    nodeInstance: "t4g.xlarge (4 vCPU, 16 GB)",
    version: "RabbitMQ 3.13 / Postmark TLS 1.3",
    endpoint: "smtp-relay.internal.teamflow.ai:587",
    sslStatus: "STARTTLS Verified · Renews in 142d",
    port: "587 / 2525 (Secure Submission)",
  },
  {
    id: "SRV-WS",
    name: "Realtime WebSocket Hub",
    cluster: "socketio-cluster-node-fleet",
    desc: "Socket.io live collaboration channel & broadcast server",
    icon: Radio,
    category: "Realtime Gateway",
    region: "us-east-1 (Edge Optimized)",
    uptime: "99.97%",
    latency: "12ms",
    status: "Operational",
    load: "36%",
    loadValue: 36,
    memory: "3.1 GB / 8.0 GB",
    memoryPercent: 38.7,
    throughput: "14,200 active sockets",
    errorRate: "0.000%",
    nodes: "6 WebSocket Cluster Workers",
    nodeInstance: "c6i.xlarge (4 vCPU, 8 GB)",
    version: "Engine.io 6.5 / Socket.io 4.7",
    endpoint: "wss://ws.teamflow.ai/socket.io/",
    sslStatus: "Valid TLS 1.3 (WSS) · Renews in 90d",
    port: "443 (WSS Protocol)",
  },
];

// Rich Incident logs with full SRE post-mortem diagnostics
const INITIAL_INCIDENTS = [
  {
    id: "INC-205",
    date: "Oct 28, 2026, 09:15 AM",
    service: "AI Inference Router",
    category: "AI Gateway",
    severity: "P3 - Minor",
    impact: "Upstream Latency Spike",
    resolvedIn: "6m",
    status: "Resolved",
    engineer: "AI Ops Agent (Autonomous)",
    detection: "Datadog Synthetic Probe P99 > 850ms",
    description:
      "Upstream OpenAI endpoint experienced a regional 420ms latency degradation. The AI Inference Router automated circuit breaker tripped at threshold and shifted 45% of production token traffic to Gemini 2.0 Flash in 4.2 seconds.",
    mitigation:
      "Zero user-visible errors. Circuit restored to balanced weighting after upstream latency normalized below 120ms.",
  },
  {
    id: "INC-204",
    date: "Oct 26, 2026, 03:12 PM",
    service: "PostgreSQL Database",
    category: "Relational Storage",
    severity: "P4 - Maintenance",
    impact: "Index Optimization & Vacuum",
    resolvedIn: "22m",
    status: "Completed",
    engineer: "Database Reliability Engineer (DBA)",
    detection: "Scheduled CloudWatch Cron Maintenance Event",
    description:
      "Automated concurrent B-tree index re-indexing and dead tuple vacuum executed across multi-tenant billing tables. All queries served via read replicas without blocking.",
    mitigation:
      "Buffer cache hit ratio elevated from 98.4% to 99.8%. Average query latency dropped by 4.2ms.",
  },
  {
    id: "INC-203",
    date: "Oct 21, 2026, 08:44 AM",
    service: "API Gateway Cluster",
    category: "Gateway & Routing",
    severity: "P3 - Minor",
    impact: "DDoS Rate Limit Trip",
    resolvedIn: "9m",
    status: "Resolved",
    engineer: "Cloudflare WAF Automated Rule",
    detection: "WAF Alert: 12,000 req/s from suspicious subnet /24",
    description:
      "Aggressive scraping bot targeting authentication endpoint triggered Cloudflare Layer 7 rate limiter. Botnet IPs auto-quarantined into honeypot challenge.",
    mitigation:
      "Platform gateway CPU remained stable at 28%. Zero authorized tenants impacted.",
  },
  {
    id: "INC-202",
    date: "Oct 15, 2026, 04:14 PM",
    service: "SMTP Relay Service",
    category: "Messaging Relay",
    severity: "P3 - Minor",
    impact: "Queue Backpressure",
    resolvedIn: "12m",
    status: "Resolved",
    engineer: "SRE On-Call (P. Sharma)",
    detection: "RabbitMQ Queue Length > 1,500 messages",
    description:
      "Sudden end-of-month invoice dispatch batch caused temporary queue accumulation. Autoscaling rule triggered 4 additional Celery worker pods.",
    mitigation:
      "Queue cleared to 0 within 12 minutes. Email delivery latency normalized to < 3 seconds.",
  },
  {
    id: "INC-201",
    date: "Oct 08, 2026, 11:30 PM",
    service: "Distributed Asset Storage",
    category: "Object Storage",
    severity: "P4 - Maintenance",
    impact: "Automated TLS Cert Renewal",
    resolvedIn: "4m",
    status: "Resolved",
    engineer: "Cert-Manager Automated Operator",
    detection: "Kubernetes cert-manager expiry threshold (30 days)",
    description:
      "Let's Encrypt automated HTTP-01 challenge renewed the wildcard TLS certificate across all S3 storage gateway ingress nodes.",
    mitigation:
      "Zero downtime renewal with seamless rolling proxy reload.",
  },
  {
    id: "INC-200",
    date: "Sep 28, 2026, 08:00 AM",
    service: "Realtime WebSocket Hub",
    category: "Realtime Gateway",
    severity: "P4 - Maintenance",
    impact: "Kubernetes Rolling Deployment",
    resolvedIn: "15m",
    status: "Completed",
    engineer: "Platform DevOps Team",
    detection: "CI/CD Production Deployment Pipeline #482",
    description:
      "Rolling update deployed Engine.io 6.5 with WebSocket reconnection heartbeat optimizations. Connection drain executed gracefully with zero dropped sockets.",
    mitigation:
      "All 14,000+ active client sockets smoothly migrated across pods with 0ms downtime.",
  },
];

function SystemHealth() {
  const [services, setServices] = useState(CORE_SERVICES);
  const [incidents, setIncidents] = useState(INITIAL_INCIDENTS);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isDiagnosticRunning, setIsDiagnosticRunning] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [copiedField, setCopiedField] = useState(null);

  // Live Ping state tracking per service
  const [pingStates, setPingStates] = useState({});

  // Quick Status Filter Tabs for Services
  const [serviceStatusTab, setServiceStatusTab] = useState("all"); // "all" | "operational" | "degraded" | "maintenance"

  // Services View & Filter State
  const [serviceView, setServiceView] = useState("table"); // "table" | "grid"
  const [serviceSearch, setServiceSearch] = useState("");
  const [serviceCategoryFilter, setServiceCategoryFilter] = useState("all");
  const [serviceDensity, setServiceDensity] = useState("standard");

  // Modals (Portaled into document.body to prevent scrolling issues)
  const [inspectingService, setInspectingService] = useState(null);
  const [selectedIncident, setSelectedIncident] = useState(null);

  // Incidents Table State
  const [incidentSearch, setIncidentSearch] = useState("");
  const [incidentServiceFilter, setIncidentServiceFilter] = useState("all");
  const [incidentStatusFilter, setIncidentStatusFilter] = useState("all");
  const [incidentDensity, setIncidentDensity] = useState("standard");
  const [incidentPage, setIncidentPage] = useState(1);
  const [selectedIncidentIds, setSelectedIncidentIds] = useState(new Set());
  const [incidentPageSize, setIncidentPageSize] = useState(5);

  // Keyboard shortcut: close modal on Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setInspectingService(null);
        setSelectedIncident(null);
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

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      triggerToast("Telemetry refreshed: All cluster microservices reporting normal operation.");
    }, 700);
  };

  // Run full platform diagnostics across all microservices
  const handleRunFullDiagnostics = () => {
    if (isDiagnosticRunning) return;
    setIsDiagnosticRunning(true);
    triggerToast("Initiating comprehensive cluster diagnostic probe across all 8 nodes...", 2000);

    // Simulate probing each service
    setTimeout(() => {
      const newPings = {};
      services.forEach((s) => {
        const ms = Math.floor(Math.random() * 15) + 10;
        newPings[s.id] = { text: `${ms}ms (200 OK)`, status: "ok" };
      });
      setPingStates(newPings);
      setIsDiagnosticRunning(false);
      triggerToast("Diagnostics Complete: 8/8 services responded with healthy latency. Zero packet loss.", 4500);
    }, 1400);
  };

  // Individual Live Ping
  const handlePingService = (srvId, srvName, e) => {
    if (e) e.stopPropagation();
    setPingStates((prev) => ({
      ...prev,
      [srvId]: { text: "Pinging...", status: "loading" },
    }));

    setTimeout(() => {
      const simulatedLatency = Math.floor(Math.random() * 20) + 12;
      setPingStates((prev) => ({
        ...prev,
        [srvId]: { text: `${simulatedLatency}ms · 200 OK`, status: "ok" },
      }));
      triggerToast(`Probe to ${srvName} succeeded: ${simulatedLatency}ms (HTTP 200 OK)`);
    }, 450);
  };

  const handleRestartService = (srvId, srvName, e) => {
    if (e) e.stopPropagation();
    triggerToast(`Triggering zero-downtime rolling restart for ${srvName || srvId}...`);
    setTimeout(() => {
      triggerToast(`Service ${srvName || srvId} pods restarted & healthchecks passed.`, 3500);
    }, 1200);
  };

  const handleCopyText = (text, fieldName) => {
    navigator.clipboard?.writeText(text);
    setCopiedField(fieldName);
    triggerToast(`Copied ${fieldName} to clipboard`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Filtered Services based on search, category, and status tab
  const filteredServices = useMemo(() => {
    return services.filter((srv) => {
      // Status tab
      if (serviceStatusTab === "operational" && srv.status !== "Operational") return false;
      if (serviceStatusTab === "degraded" && srv.status !== "Degraded") return false;
      if (serviceStatusTab === "maintenance" && srv.status !== "Maintenance") return false;

      // Category filter
      if (serviceCategoryFilter !== "all" && srv.category !== serviceCategoryFilter) return false;

      // Search query
      if (!serviceSearch.trim()) return true;
      const q = serviceSearch.toLowerCase();
      return (
        srv.name.toLowerCase().includes(q) ||
        srv.desc.toLowerCase().includes(q) ||
        srv.category.toLowerCase().includes(q) ||
        srv.id.toLowerCase().includes(q) ||
        srv.region.toLowerCase().includes(q) ||
        srv.cluster.toLowerCase().includes(q)
      );
    });
  }, [services, serviceStatusTab, serviceCategoryFilter, serviceSearch]);

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
        inc.engineer.toLowerCase().includes(q) ||
        (inc.severity && inc.severity.toLowerCase().includes(q))
      );
    });
  }, [incidents, incidentServiceFilter, incidentStatusFilter, incidentSearch]);

  const paginatedIncidents = useMemo(() => {
    const start = (incidentPage - 1) * incidentPageSize;
    return filteredIncidents.slice(start, start + incidentPageSize);
  }, [filteredIncidents, incidentPage, incidentPageSize]);

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
    const dataToExport =
      selectedIncidentIds.size > 0
        ? incidents.filter((i) => selectedIncidentIds.has(i.id))
        : filteredIncidents;

    const headers = [
      "Incident ID",
      "Timestamp",
      "Severity",
      "Service",
      "Impact",
      "Resolution Time",
      "Status",
      "Engineer",
      "Description",
      "Mitigation",
    ];
    const rows = dataToExport.map((i) => [
      i.id,
      i.date,
      i.severity || "P3",
      i.service,
      i.impact,
      i.resolvedIn,
      i.status,
      i.engineer,
      `"${(i.description || "").replace(/"/g, '""')}"`,
      `"${(i.mitigation || "").replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `system_incident_forensics_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="sa-page-container sa-health-page">
      {/* 1. Header with live status & primary action buttons */}
      <section className="sap-header-panel sh-header-panel">
        <div className="sa-page-header-left">
          <div className="sh-title-row">
            <h1>System Health &amp; Infrastructure</h1>
            <span className="sh-live-pulse-badge">
              <span className="sh-live-pulse-dot" /> Live Telemetry
            </span>
          </div>
          <p>
            Real-time cluster telemetry, multi-region container metrics, and distributed microservice availability monitors.
          </p>
        </div>

        <div className="sa-page-header-actions sh-header-actions">
          <button
            type="button"
            className="sa-btn sh-diagnostics-btn"
            onClick={handleRunFullDiagnostics}
            disabled={isDiagnosticRunning}
            title="Execute live ping probe across all microservices"
          >
            <Activity size={15} className={isDiagnosticRunning ? "sa-spin" : ""} />
            <span>{isDiagnosticRunning ? "Running Diagnostics..." : "Run Full Diagnostics"}</span>
          </button>

          <button
            type="button"
            className="sa-btn sa-btn-secondary"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw size={15} className={isRefreshing ? "sa-spin" : ""} />
            <span>Refresh Telemetry</span>
          </button>
        </div>
      </section>

      {/* 2. Top 4 KPI Stat Cards */}
      <section className="sap-kpi-grid sh-kpi-grid">
        <article className="sa-kpi-card sh-kpi-card">
          <div className="sa-kpi-icon-box green">
            <CheckCircle2 size={24} strokeWidth={2.2} />
          </div>
          <div className="sa-kpi-body">
            <p className="sa-kpi-title">Global Platform Status</p>
            <div className="sa-kpi-val-row">
              <span className="sa-kpi-value">100% Operational</span>
              <span className="sa-kpi-trend positive">
                <CheckCircle2 size={13} /> {services.length}/{services.length} Online
              </span>
            </div>
            <span className="sa-kpi-subtitle">Zero degraded nodes · 0 active alerts</span>
          </div>
        </article>

        <article className="sa-kpi-card sh-kpi-card">
          <div className="sa-kpi-icon-box blue">
            <Activity size={24} strokeWidth={2.2} />
          </div>
          <div className="sa-kpi-body">
            <p className="sa-kpi-title">Rolling SLA Uptime (90d)</p>
            <div className="sa-kpi-val-row">
              <span className="sa-kpi-value">99.992%</span>
              <span className="sa-kpi-trend positive">
                <ArrowUpRight size={13} /> Exceeding SLA (+0.092%)
              </span>
            </div>
            <span className="sa-kpi-subtitle">Guaranteed SLA target: 99.900%</span>
          </div>
        </article>

        <article className="sa-kpi-card sh-kpi-card">
          <div className="sa-kpi-icon-box sky">
            <Cpu size={24} strokeWidth={2.2} />
          </div>
          <div className="sa-kpi-body">
            <p className="sa-kpi-title">Compute Cluster CPU</p>
            <div className="sa-kpi-val-row">
              <span className="sa-kpi-value">31.4% Avg</span>
              <span className="sa-kpi-trend positive">
                24 active pods
              </span>
            </div>
            <span className="sa-kpi-subtitle">Autoscale pool: 8 to 48 pods</span>
          </div>
        </article>

        <article className="sa-kpi-card sh-kpi-card">
          <div className="sa-kpi-icon-box amber">
            <HardDrive size={24} strokeWidth={2.2} />
          </div>
          <div className="sa-kpi-body">
            <p className="sa-kpi-title">Cloud Storage Used</p>
            <div className="sa-kpi-val-row">
              <span className="sa-kpi-value">1.28 TB / 3 TB</span>
              <span className="sa-kpi-trend positive">
                42.6% Allocated
              </span>
            </div>
            <span className="sa-kpi-subtitle">NVMe High-Speed Multi-AZ Tier</span>
          </div>
        </article>
      </section>

      {/* Global Cloud Infrastructure Banner */}
      <section className="sh-infra-strip">
        <div className="sh-infra-item">
          <Globe size={14} className="sh-infra-icon" />
          <span className="sh-infra-label">Primary Region:</span>
          <strong>AWS us-east-1 (N. Virginia)</strong>
        </div>
        <div className="sh-infra-separator" />
        <div className="sh-infra-item">
          <Shield size={14} className="sh-infra-icon" />
          <span className="sh-infra-label">Failover Zone:</span>
          <strong>AWS eu-west-1 (Ireland Multi-AZ)</strong>
        </div>
        <div className="sh-infra-separator" />
        <div className="sh-infra-item">
          <Zap size={14} className="sh-infra-icon" />
          <span className="sh-infra-label">Edge CDN &amp; WAF:</span>
          <strong>Cloudflare Enterprise (280+ PoPs)</strong>
        </div>
        <div className="sh-infra-separator" />
        <div className="sh-infra-item">
          <Lock size={14} className="sh-infra-icon" />
          <span className="sh-infra-label">Encryption:</span>
          <strong>TLS 1.3 / AES-256 KMS</strong>
        </div>
      </section>

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="sa-toast-banner sh-toast-banner">
          <CheckCircle2 size={16} /> {toastMessage}
        </div>
      )}

      {/* 3. Monitored Microservices - Enterprise SaaS Table Card */}
      <section className="sap-table-card sh-table-card">
        {/* Quick Filter Tabs for Services */}
        <div className="sh-quick-tabs-bar">
          <div className="sh-quick-tabs">
            <button
              type="button"
              className={`sh-quick-tab ${serviceStatusTab === "all" ? "active" : ""}`}
              onClick={() => setServiceStatusTab("all")}
            >
              All Microservices
              <span className="sh-tab-badge">{services.length}</span>
            </button>
            <button
              type="button"
              className={`sh-quick-tab ${serviceStatusTab === "operational" ? "active" : ""}`}
              onClick={() => setServiceStatusTab("operational")}
            >
              <span className="sh-tab-dot green" />
              Operational
              <span className="sh-tab-badge green">{services.filter((s) => s.status === "Operational").length}</span>
            </button>
            <button
              type="button"
              className={`sh-quick-tab ${serviceStatusTab === "degraded" ? "active" : ""}`}
              onClick={() => setServiceStatusTab("degraded")}
            >
              <span className="sh-tab-dot yellow" />
              Degraded
              <span className="sh-tab-badge">0</span>
            </button>
            <button
              type="button"
              className={`sh-quick-tab ${serviceStatusTab === "maintenance" ? "active" : ""}`}
              onClick={() => setServiceStatusTab("maintenance")}
            >
              <span className="sh-tab-dot gray" />
              Maintenance
              <span className="sh-tab-badge">0</span>
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="sap-toolbar sh-toolbar">
          <div className="sap-search-input sh-search-input">
            <Search size={15} />
            <input
              type="text"
              placeholder="Search microservices by name, description, region, or ID..."
              value={serviceSearch}
              onChange={(e) => setServiceSearch(e.target.value)}
            />
            {serviceSearch && (
              <button type="button" onClick={() => setServiceSearch("")} aria-label="Clear search">
                <X size={13} />
              </button>
            )}
          </div>

          <div className="sh-toolbar-actions">
            <div className="sh-filter-group">
              <Filter size={13} className="sh-filter-icon" />
              <select
                className="sh-filter-select"
                value={serviceCategoryFilter}
                onChange={(e) => setServiceCategoryFilter(e.target.value)}
                aria-label="Filter by service category"
              >
                <option value="all">All Service Categories ({services.length})</option>
                <option value="Gateway & Routing">Gateway & Routing</option>
                <option value="Relational Storage">Relational Storage</option>
                <option value="In-Memory Cache">In-Memory Cache</option>
                <option value="Identity & Security">Identity & Security</option>
                <option value="AI Gateway">AI Gateway</option>
                <option value="Object Storage">Object Storage</option>
                <option value="Messaging Relay">Messaging Relay</option>
                <option value="Realtime Gateway">Realtime Gateway</option>
              </select>
            </div>

            {/* View Switcher: Table vs Cards */}
            <div className="sa-view-switcher sh-view-switcher">
              <button
                type="button"
                className={`sa-view-btn ${serviceView === "table" ? "active" : ""}`}
                onClick={() => setServiceView("table")}
                title="Table Matrix View"
              >
                <TableIcon size={14} />
                <span className="sh-view-text">Table</span>
              </button>
              <button
                type="button"
                className={`sa-view-btn ${serviceView === "grid" ? "active" : ""}`}
                onClick={() => setServiceView("grid")}
                title="Service Cards Grid View"
              >
                <LayoutGrid size={14} />
                <span className="sh-view-text">Cards</span>
              </button>
            </div>

            {serviceView === "table" && (
              <button
                type="button"
                className="sap-icon-btn sh-density-btn"
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

        {/* Services Render: Table or Grid */}
        {serviceView === "table" ? (
          <div className="sa-table-wrapper sh-table-wrapper">
            <table className={`sap-grid is-${serviceDensity} sh-services-table`}>
              <thead>
                <tr>
                  <th style={{ width: 100 }}>Service ID</th>
                  <th>Microservice &amp; Cluster</th>
                  <th>Category</th>
                  <th>Region / AZ</th>
                  <th>Target SLA</th>
                  <th>Avg Latency</th>
                  <th style={{ minWidth: 150 }}>CPU / Memory</th>
                  <th>Active Nodes</th>
                  <th>Health Status</th>
                  <th style={{ textAlign: "right", minWidth: 220 }}>Operations</th>
                </tr>
              </thead>
              <tbody>
                {filteredServices.length === 0 ? (
                  <tr>
                    <td colSpan={10} style={{ textAlign: "center", padding: "40px 16px", color: "var(--sa-text-muted)" }}>
                      No microservices matched your filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredServices.map((srv) => {
                    const Icon = srv.icon;
                    const pingInfo = pingStates[srv.id];
                    return (
                      <tr key={srv.id} className="sh-service-row">
                        <td>
                          <code className="sap-id-cell sh-code-id">{srv.id}</code>
                        </td>
                        <td>
                          <div className="sh-srv-cell-main">
                            <div className="sh-srv-icon-box">
                              <Icon size={16} />
                            </div>
                            <div className="sh-srv-info-wrap">
                              <strong className="sh-srv-title">{srv.name}</strong>
                              <span className="sh-srv-subtext">{srv.desc}</span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="sap-role-badge sh-cat-badge">{srv.category}</span>
                        </td>
                        <td>
                          <span className="sh-region-pill" title={srv.cluster}>
                            <Globe size={11} /> {srv.region.split(" ")[0]}
                          </span>
                        </td>
                        <td>
                          <strong className="sh-sla-val">{srv.uptime}</strong>
                        </td>
                        <td>
                          <span className="sh-latency-pill">{srv.latency}</span>
                        </td>
                        <td>
                          <div className="sh-resource-cell">
                            <div className="sh-resource-bars">
                              <div className="sh-resource-bar-track">
                                <div
                                  className="sh-resource-bar-fill cpu"
                                  style={{ width: `${srv.loadValue}%` }}
                                />
                              </div>
                              <div className="sh-resource-bar-track">
                                <div
                                  className="sh-resource-bar-fill ram"
                                  style={{ width: `${srv.memoryPercent}%` }}
                                />
                              </div>
                            </div>
                            <div className="sh-resource-labels">
                              <span>CPU: {srv.load}</span>
                              <span>RAM: {srv.memoryPercent}%</span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="sh-nodes-pill" title={srv.nodeInstance}>
                            <Server size={11} /> {srv.nodes.split(" ")[0]} pods
                          </span>
                        </td>
                        <td>
                          <span className="sap-status-pill green sh-status-pill">
                            <span className="sh-pulse-dot" />
                            {srv.status}
                          </span>
                        </td>
                        <td style={{ textAlign: "right" }}>
                          <div className="sh-action-buttons-group">
                            {/* Live Ping Button */}
                            <button
                              type="button"
                              className={`sh-table-action-btn ping ${pingInfo?.status === "loading" ? "loading" : ""}`}
                              onClick={(e) => handlePingService(srv.id, srv.name, e)}
                              title="Send live HTTP health probe"
                            >
                              <Wifi size={12} className={pingInfo?.status === "loading" ? "sa-spin" : ""} />
                              <span>{pingInfo ? pingInfo.text : "Ping"}</span>
                            </button>

                            {/* Inspect Details Button */}
                            <button
                              type="button"
                              className="sh-table-action-btn inspect"
                              onClick={() => setInspectingService(srv)}
                              title="View Deep Telemetry & Node Diagnostics"
                            >
                              <Eye size={12} />
                              <span>Inspect</span>
                            </button>

                            {/* Graceful Restart */}
                            <button
                              type="button"
                              className="sh-table-action-btn restart"
                              onClick={(e) => handleRestartService(srv.id, srv.name, e)}
                              title="Trigger zero-downtime rolling restart"
                            >
                              <RefreshCw size={12} />
                              <span>Restart</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="sa-services-grid sh-grid-container">
            {filteredServices.map((srv) => {
              const Icon = srv.icon;
              const pingInfo = pingStates[srv.id];
              return (
                <article key={srv.id} className="sa-card sh-service-card">
                  <div className="sh-card-header">
                    <div className="sh-card-icon-box">
                      <Icon size={20} strokeWidth={2.2} />
                    </div>
                    <div className="sh-card-titles">
                      <div className="sh-card-title-row">
                        <h3 className="sa-service-name">{srv.name}</h3>
                        <code className="sh-card-id">{srv.id}</code>
                      </div>
                      <p className="sa-service-desc">{srv.desc}</p>
                    </div>
                    <span className="sap-status-pill green sh-card-status">
                      <span className="sh-pulse-dot" /> {srv.status}
                    </span>
                  </div>

                  {/* Region and Cluster Pill */}
                  <div className="sh-card-meta-bar">
                    <span className="sh-region-pill">
                      <Globe size={11} /> {srv.region}
                    </span>
                    <span className="sh-cat-badge">{srv.category}</span>
                  </div>

                  {/* 4 Key Stat Badges */}
                  <div className="sh-card-stats-grid">
                    <div className="sh-card-stat-box">
                      <span className="sa-srv-label">SLA UPTIME</span>
                      <strong className="sh-sla-val">{srv.uptime}</strong>
                    </div>
                    <div className="sh-card-stat-box">
                      <span className="sa-srv-label">AVG LATENCY</span>
                      <strong className="sh-stat-highlight">{srv.latency}</strong>
                    </div>
                    <div className="sh-card-stat-box">
                      <span className="sa-srv-label">CPU LOAD</span>
                      <strong>{srv.load}</strong>
                    </div>
                    <div className="sh-card-stat-box">
                      <span className="sa-srv-label">THROUGHPUT</span>
                      <strong style={{ fontSize: 11.5 }}>{srv.throughput}</strong>
                    </div>
                  </div>

                  {/* Memory & Resource Gauge */}
                  <div className="sh-card-gauge-box">
                    <div className="sh-card-gauge-labels">
                      <span className="sa-srv-label">MEMORY ALLOCATION</span>
                      <span style={{ fontSize: 11, fontWeight: 600 }}>{srv.memory} ({srv.memoryPercent}%)</span>
                    </div>
                    <div className="sh-resource-bar-track">
                      <div
                        className="sh-resource-bar-fill ram"
                        style={{ width: `${srv.memoryPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Card Action Footer */}
                  <div className="sh-card-footer">
                    <button
                      type="button"
                      className={`sh-table-action-btn ping ${pingInfo?.status === "loading" ? "loading" : ""}`}
                      onClick={(e) => handlePingService(srv.id, srv.name, e)}
                    >
                      <Wifi size={12} className={pingInfo?.status === "loading" ? "sa-spin" : ""} />
                      <span>{pingInfo ? pingInfo.text : "Ping Probe"}</span>
                    </button>

                    <button
                      type="button"
                      className="sh-table-action-btn inspect"
                      onClick={() => setInspectingService(srv)}
                    >
                      <Eye size={12} />
                      <span>Inspect</span>
                    </button>

                    <button
                      type="button"
                      className="sh-table-action-btn restart"
                      onClick={(e) => handleRestartService(srv.id, srv.name, e)}
                      title="Graceful Pod Restart"
                    >
                      <RefreshCw size={12} />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        <div className="sap-footer-bar sh-footer-bar">
          <div className="sh-footer-meta-left">
            <span>
              Total <strong>{filteredServices.length}</strong> core services actively monitored ·{" "}
              <strong className="sh-zero-degraded">0 degraded</strong>
            </span>
            <span className="sh-footer-sub">
              Autoscaling Fleet: Active (Min 2 / Max 16 pods per microservice)
            </span>
          </div>
          <div className="sh-footer-meta-right">
            <span>Kubernetes Ingress: <strong style={{ color: "var(--sa-text-main)" }}>Envoy Proxy v1.30</strong></span>
          </div>
        </div>
      </section>

      {/* 4. Incident & Maintenance Log Table - Enterprise SaaS Table Card */}
      <section className="sap-table-card sh-incidents-card">
        {/* Incident Section Header */}
        <div className="sh-incidents-header">
          <div className="sh-incidents-header-left">
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Clock size={18} className="sh-clock-icon" />
              <h2 className="sh-incidents-title">Incident Forensics &amp; Maintenance Logs</h2>
            </div>
            <p className="sh-incidents-desc">
              Immutable audit history of infrastructure anomalies, automatic failovers, and planned maintenance cycles.
            </p>
          </div>
        </div>

        {/* Batch Banner */}
        {selectedIncidentIds.size > 0 && (
          <div className="sap-batch-banner sh-batch-banner">
            <span>
              <strong>{selectedIncidentIds.size}</strong> incident records selected for forensics export
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
        <div className="sap-toolbar sh-toolbar">
          <div className="sap-search-input sh-search-input">
            <Search size={15} />
            <input
              type="text"
              placeholder="Search incidents by service, impact, engineer, severity..."
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

          <div className="sh-toolbar-actions">
            <div className="sh-filter-group">
              <Filter size={13} className="sh-filter-icon" />
              <select
                className="sh-filter-select"
                value={incidentServiceFilter}
                onChange={(e) => {
                  setIncidentServiceFilter(e.target.value);
                  setIncidentPage(1);
                }}
                aria-label="Filter by affected service"
              >
                <option value="all">All Services</option>
                <option value="AI Inference Router">AI Inference Router</option>
                <option value="PostgreSQL Database">PostgreSQL Database</option>
                <option value="API Gateway Cluster">API Gateway Cluster</option>
                <option value="SMTP Relay Service">SMTP Relay Service</option>
                <option value="Distributed Asset Storage">Distributed Asset Storage</option>
                <option value="Realtime WebSocket Hub">Realtime WebSocket Hub</option>
              </select>
            </div>

            <div className="sh-filter-group">
              <select
                className="sh-filter-select"
                value={incidentStatusFilter}
                onChange={(e) => {
                  setIncidentStatusFilter(e.target.value);
                  setIncidentPage(1);
                }}
                aria-label="Filter by incident status"
              >
                <option value="all">All Statuses</option>
                <option value="Resolved">Resolved</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <button
              type="button"
              className="sa-btn sa-btn-secondary sa-btn-sm sh-export-btn"
              onClick={handleExportIncidentsCSV}
            >
              <Download size={14} /> <span>Export CSV</span>
            </button>

            <button
              type="button"
              className="sap-icon-btn sh-density-btn"
              title={`Switch density (currently ${incidentDensity})`}
              onClick={() =>
                setIncidentDensity((prev) => (prev === "standard" ? "compact" : "standard"))
              }
            >
              <SlidersHorizontal size={15} />
            </button>
          </div>
        </div>

        {/* Incident Table */}
        <div className="sa-table-wrapper sh-table-wrapper">
          <table className={`sap-grid is-${incidentDensity} sh-incidents-table`}>
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
                <th>Severity</th>
                <th>Timestamp</th>
                <th>Affected Service</th>
                <th>Impact Scope</th>
                <th>Resolution Window</th>
                <th>Responsible Engineer</th>
                <th>Resolution Status</th>
                <th style={{ textAlign: "right" }}>Forensics</th>
              </tr>
            </thead>
            <tbody>
              {paginatedIncidents.length === 0 ? (
                <tr>
                  <td colSpan={10} style={{ textAlign: "center", padding: "40px 16px", color: "var(--sa-text-muted)" }}>
                    No incident records matched your search query.
                  </td>
                </tr>
              ) : (
                paginatedIncidents.map((inc) => (
                  <tr key={inc.id} className="sh-incident-row">
                    <td style={{ textAlign: "center" }}>
                      <input
                        type="checkbox"
                        checked={selectedIncidentIds.has(inc.id)}
                        onChange={() => handleToggleIncidentSelect(inc.id)}
                      />
                    </td>
                    <td>
                      <code className="sap-id-cell sh-code-id">{inc.id}</code>
                    </td>
                    <td>
                      <span className={`sh-sev-badge ${inc.severity ? inc.severity.toLowerCase().slice(0, 2) : "p3"}`}>
                        {inc.severity || "P3 - Minor"}
                      </span>
                    </td>
                    <td style={{ fontSize: 12, color: "var(--sa-text-secondary)" }}>{inc.date}</td>
                    <td>
                      <strong style={{ color: "var(--sa-text-main)" }}>{inc.service}</strong>
                      <div style={{ fontSize: 11, color: "var(--sa-text-muted)" }}>{inc.category}</div>
                    </td>
                    <td>
                      <span className="sap-role-badge sh-impact-badge">{inc.impact}</span>
                    </td>
                    <td>
                      <span className="sh-window-pill">
                        <Clock size={12} />
                        {inc.resolvedIn}
                      </span>
                    </td>
                    <td>
                      <span className="sh-engineer-pill">{inc.engineer}</span>
                    </td>
                    <td>
                      <span className="sap-status-pill green sh-status-pill">
                        <span className="sh-pulse-dot" />
                        {inc.status}
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <button
                        type="button"
                        className="sh-table-action-btn inspect"
                        title="View Incident Diagnostics & Post-Mortem"
                        onClick={() => setSelectedIncident(inc)}
                      >
                        <Eye size={13} />
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
        <div className="sap-footer-bar sh-footer-bar">
          <div className="sh-footer-meta-left">
            <span style={{ fontSize: 12.5, color: "var(--sa-text-secondary)" }}>
              Showing <strong>{filteredIncidents.length === 0 ? 0 : (incidentPage - 1) * incidentPageSize + 1}</strong> to{" "}
              <strong>{Math.min(incidentPage * incidentPageSize, filteredIncidents.length)}</strong> of{" "}
              <strong>{filteredIncidents.length}</strong> incident logs
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--sa-text-secondary)" }}>
              <span>Rows per page:</span>
              <select
                className="sh-page-select"
                value={incidentPageSize}
                onChange={(e) => {
                  setIncidentPageSize(Number(e.target.value));
                  setIncidentPage(1);
                }}
                aria-label="Select rows per page"
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
              disabled={incidentPage <= 1}
              onClick={() => setIncidentPage((p) => Math.max(1, p - 1))}
              aria-label="Previous page"
            >
              <ChevronLeft size={14} />
            </button>
            <span style={{ fontSize: 12.5, padding: "4px 8px", color: "var(--sa-text-secondary)" }}>
              Page {incidentPage} of {totalIncidentPages}
            </span>
            <button
              type="button"
              className="sap-page-btn"
              disabled={incidentPage >= totalIncidentPages}
              onClick={() => setIncidentPage((p) => Math.min(totalIncidentPages, p + 1))}
              aria-label="Next page"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          PORTALED MODAL 1: SERVICE DEEP TELEMETRY & DIAGNOSTICS
          (Portaled directly to document.body: Centered, Zero Vertical Scrolling Needed)
         ========================================================================= */}
      {inspectingService &&
        createPortal(
          <div
            className="sh-modal-overlay"
            onClick={() => setInspectingService(null)}
            role="dialog"
            aria-modal="true"
          >
            <div
              className="sh-modal-container"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="sh-modal-header">
                <div className="sh-modal-header-left">
                  <div className="sh-modal-icon-wrap">
                    {(() => {
                      const Icon = inspectingService.icon;
                      return <Icon size={20} />;
                    })()}
                  </div>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <h3 className="sh-modal-title">{inspectingService.name}</h3>
                      <code className="sh-code-id">{inspectingService.id}</code>
                      <span className="sap-status-pill green">
                        <span className="sh-pulse-dot" /> {inspectingService.status}
                      </span>
                    </div>
                    <div className="sh-modal-subline">
                      <span>{inspectingService.cluster}</span>
                      <span>·</span>
                      <span>{inspectingService.region}</span>
                      <span>·</span>
                      <span>{inspectingService.category}</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  className="sh-modal-close-btn"
                  onClick={() => setInspectingService(null)}
                  aria-label="Close modal"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Body: Compact 2-column scorecard without vertical scrolling */}
              <div className="sh-modal-body">
                {/* 4 Live Metric Tiles */}
                <div className="sh-modal-metrics-grid">
                  <div className="sh-modal-metric-card">
                    <span className="sh-modal-metric-label">CPU LOAD</span>
                    <strong className="sh-modal-metric-val">{inspectingService.load}</strong>
                    <div className="sh-resource-bar-track" style={{ marginTop: 6 }}>
                      <div
                        className="sh-resource-bar-fill cpu"
                        style={{ width: `${inspectingService.loadValue}%` }}
                      />
                    </div>
                  </div>

                  <div className="sh-modal-metric-card">
                    <span className="sh-modal-metric-label">MEMORY USAGE</span>
                    <strong className="sh-modal-metric-val">{inspectingService.memoryPercent}%</strong>
                    <div className="sh-resource-bar-track" style={{ marginTop: 6 }}>
                      <div
                        className="sh-resource-bar-fill ram"
                        style={{ width: `${inspectingService.memoryPercent}%` }}
                      />
                    </div>
                    <small style={{ fontSize: 10.5, color: "var(--sa-text-muted)", marginTop: 3 }}>
                      {inspectingService.memory}
                    </small>
                  </div>

                  <div className="sh-modal-metric-card">
                    <span className="sh-modal-metric-label">AVG LATENCY / SLA</span>
                    <strong className="sh-modal-metric-val sh-val-success">
                      {inspectingService.latency}
                    </strong>
                    <small style={{ fontSize: 10.5, color: "var(--sa-text-muted)", marginTop: 3 }}>
                      Target SLA: {inspectingService.uptime}
                    </small>
                  </div>

                  <div className="sh-modal-metric-card">
                    <span className="sh-modal-metric-label">THROUGHPUT &amp; ERRORS</span>
                    <strong className="sh-modal-metric-val">{inspectingService.throughput}</strong>
                    <small className="sh-val-success" style={{ fontSize: 10.5, marginTop: 3 }}>
                      Error Rate: {inspectingService.errorRate}
                    </small>
                  </div>
                </div>

                {/* Infrastructure Configuration Details */}
                <div className="sh-modal-details-grid">
                  <div className="sh-modal-detail-row">
                    <span className="sh-modal-detail-key">Compute Instance Tier:</span>
                    <strong className="sh-modal-detail-val">{inspectingService.nodeInstance}</strong>
                  </div>

                  <div className="sh-modal-detail-row">
                    <span className="sh-modal-detail-key">Replica Topology:</span>
                    <strong className="sh-modal-detail-val">{inspectingService.nodes}</strong>
                  </div>

                  <div className="sh-modal-detail-row">
                    <span className="sh-modal-detail-key">Software Stack Version:</span>
                    <strong className="sh-modal-detail-val">{inspectingService.version}</strong>
                  </div>

                  <div className="sh-modal-detail-row">
                    <span className="sh-modal-detail-key">SSL / TLS Protocol:</span>
                    <strong className="sh-modal-detail-val sh-val-success">
                      {inspectingService.sslStatus}
                    </strong>
                  </div>

                  <div className="sh-modal-detail-row" style={{ gridColumn: "1 / -1" }}>
                    <span className="sh-modal-detail-key">Health Check Probe URL:</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, minWidth: 0 }}>
                      <code className="sh-modal-url-code">{inspectingService.endpoint}</code>
                      <button
                        type="button"
                        className="sh-copy-btn"
                        onClick={() => handleCopyText(inspectingService.endpoint, "Health Endpoint")}
                        title="Copy URL"
                      >
                        {copiedField === "Health Endpoint" ? <Check size={12} color="#16a34a" /> : <Copy size={12} />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="sh-modal-footer">
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    type="button"
                    className="sa-btn sa-btn-secondary sa-btn-sm"
                    onClick={(e) => handlePingService(inspectingService.id, inspectingService.name, e)}
                  >
                    <Wifi size={13} />
                    <span>Send Test Probe</span>
                  </button>

                  <button
                    type="button"
                    className="sa-btn sa-btn-secondary sa-btn-sm"
                    onClick={(e) => handleRestartService(inspectingService.id, inspectingService.name, e)}
                  >
                    <RefreshCw size={13} />
                    <span>Graceful Pod Restart</span>
                  </button>
                </div>

                <button
                  type="button"
                  className="sa-btn sa-btn-primary sa-btn-sm"
                  onClick={() => setInspectingService(null)}
                >
                  Close Telemetry
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* =========================================================================
          PORTALED MODAL 2: INCIDENT FORENSIC DIAGNOSTIC REPORT
          (Portaled directly to document.body: Centered, Zero Vertical Scrolling Needed)
         ========================================================================= */}
      {selectedIncident &&
        createPortal(
          <div
            className="sh-modal-overlay"
            onClick={() => setSelectedIncident(null)}
            role="dialog"
            aria-modal="true"
          >
            <div
              className="sh-modal-container"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sh-modal-header">
                <div className="sh-modal-header-left">
                  <div className="sh-modal-icon-wrap incident">
                    <Activity size={20} />
                  </div>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <h3 className="sh-modal-title">Incident Diagnostic Post-Mortem</h3>
                      <code className="sh-code-id">{selectedIncident.id}</code>
                      <span className={`sh-sev-badge ${selectedIncident.severity ? selectedIncident.severity.toLowerCase().slice(0, 2) : "p3"}`}>
                        {selectedIncident.severity || "P3 - Minor"}
                      </span>
                    </div>
                    <div className="sh-modal-subline">
                      <span>{selectedIncident.service}</span>
                      <span>·</span>
                      <span>{selectedIncident.date}</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  className="sh-modal-close-btn"
                  onClick={() => setSelectedIncident(null)}
                  aria-label="Close modal"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Incident Body */}
              <div className="sh-modal-body">
                {/* 4-Step Resolution Timeline */}
                <div className="sh-incident-timeline">
                  <div className="sh-timeline-step completed">
                    <span className="sh-timeline-circle"><Check size={10} /></span>
                    <span className="sh-timeline-label">Detected</span>
                  </div>
                  <div className="sh-timeline-line active" />
                  <div className="sh-timeline-step completed">
                    <span className="sh-timeline-circle"><Check size={10} /></span>
                    <span className="sh-timeline-label">Triaged</span>
                  </div>
                  <div className="sh-timeline-line active" />
                  <div className="sh-timeline-step completed">
                    <span className="sh-timeline-circle"><Check size={10} /></span>
                    <span className="sh-timeline-label">Mitigated</span>
                  </div>
                  <div className="sh-timeline-line active" />
                  <div className="sh-timeline-step resolved">
                    <span className="sh-timeline-circle"><Check size={10} /></span>
                    <span className="sh-timeline-label">Resolved</span>
                  </div>
                </div>

                {/* 2-Column Info Grid */}
                <div className="sh-incident-meta-grid">
                  <div className="sh-incident-meta-card">
                    <span className="sh-modal-metric-label">DETECTION RULE</span>
                    <strong className="sh-incident-meta-val">{selectedIncident.detection || "Prometheus Alertmanager Rule #48"}</strong>
                  </div>

                  <div className="sh-incident-meta-card">
                    <span className="sh-modal-metric-label">RESOLUTION WINDOW</span>
                    <strong className="sh-incident-meta-val sh-val-success">
                      {selectedIncident.resolvedIn} (MTTR)
                    </strong>
                  </div>

                  <div className="sh-incident-meta-card">
                    <span className="sh-modal-metric-label">RESPONSIBLE ENGINEER</span>
                    <strong className="sh-incident-meta-val">{selectedIncident.engineer}</strong>
                  </div>

                  <div className="sh-incident-meta-card">
                    <span className="sh-modal-metric-label">IMPACT SCOPE</span>
                    <strong className="sh-incident-meta-val">{selectedIncident.impact}</strong>
                  </div>
                </div>

                {/* Description & Root Cause */}
                <div className="sh-incident-desc-box">
                  <span className="sh-modal-metric-label">ROOT CAUSE ANALYSIS</span>
                  <p>{selectedIncident.description}</p>
                </div>

                {/* Mitigation & Preventative Action */}
                {selectedIncident.mitigation && (
                  <div className="sh-incident-mitigation-box">
                    <span className="sh-modal-metric-label sh-mitigation-label">
                      MITIGATION &amp; PREVENTATIVE ACTION
                    </span>
                    <p>{selectedIncident.mitigation}</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="sh-modal-footer">
                <button
                  type="button"
                  className="sa-btn sa-btn-secondary sa-btn-sm"
                  onClick={() => handleCopyText(`Incident ${selectedIncident.id}: ${selectedIncident.description}`, "Incident Summary")}
                >
                  <Copy size={13} />
                  <span>Copy Forensics Summary</span>
                </button>

                <button
                  type="button"
                  className="sa-btn sa-btn-primary sa-btn-sm"
                  onClick={() => setSelectedIncident(null)}
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

export default SystemHealth;
