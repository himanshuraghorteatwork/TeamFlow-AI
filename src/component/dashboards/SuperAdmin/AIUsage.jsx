import { useMemo, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  Sparkles,
  Hexagon,
  Clock3,
  TriangleAlert,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Building2,
  ChevronDown,
  Bot,
  Zap,
  Search,
  SlidersHorizontal,
  RefreshCw,
  ChevronsLeft,
  ChevronsRight,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Eye,
  Sliders,
  RotateCcw,
  AlertTriangle,
  Layers,
  X,
  Check,
  TrendingUp,
  BarChart3,
  ShieldCheck,
  Flame,
  Info,
} from "lucide-react";
import "./SuperAdminCommon.css";
import "./AIUsage.css";

// Organization & Provider Brand Logos
import orgAvatarImg from "../../../assets/images/organization-avatar.png";
import geminiLogo from "../../../assets/images/ai-providers/gemini.svg";
import openaiLogo from "../../../assets/images/ai-providers/openai.svg";
import anthropicLogo from "../../../assets/images/ai-providers/anthropic.svg";
import deepseekLogo from "../../../assets/images/ai-providers/deepseek.svg";
import ollamaLogo from "../../../assets/images/ai-providers/ollama.svg";

const STORAGE_ORGS_KEY = "teamflow_superadmin_ai_usage_orgs_v2";

const AI_DATA_BY_PERIOD = {
  "This Month": {
    requests: "84,520",
    requestsChange: "+18%",
    requestsSub: "+12,400 invocations this month",
    tokens: "8.42M",
    tokensChange: "+22%",
    tokensSub: "Across 186 active tenant organizations",
    latency: "1.18s",
    latencyChange: "12% faster",
    latencySub: "P95 latency: 2.05s (SLA Optimal)",
    failed: "124",
    failedChange: "-40%",
    failedSub: "0.14% failure rate (99.86% success)",
    dailyTokens: [
      { day: "Oct 20", tokens: 280000, requests: 2840, cost: "$1.12" },
      { day: "Oct 21", tokens: 340000, requests: 3410, cost: "$1.36" },
      { day: "Oct 22", tokens: 310000, requests: 3080, cost: "$1.24" },
      { day: "Oct 23", tokens: 420000, requests: 4190, cost: "$1.68" },
      { day: "Oct 24", tokens: 390000, requests: 3850, cost: "$1.56" },
      { day: "Oct 25", tokens: 480000, requests: 4720, cost: "$1.92" },
      { day: "Oct 26", tokens: 520000, requests: 5120, cost: "$2.08" },
    ],
  },
  "Last 30 Days": {
    requests: "79,410",
    requestsChange: "+15%",
    requestsSub: "+10,800 invocations in 30 days",
    tokens: "7.85M",
    tokensChange: "+18%",
    tokensSub: "Across 182 active tenant organizations",
    latency: "1.20s",
    latencyChange: "10% faster",
    latencySub: "P95 latency: 2.10s (SLA Optimal)",
    failed: "96",
    failedChange: "-35%",
    failedSub: "0.12% failure rate (99.88% success)",
    dailyTokens: [
      { day: "Wk 1", tokens: 1650000, requests: 17200, cost: "$6.60" },
      { day: "Wk 2", tokens: 1980000, requests: 19400, cost: "$7.92" },
      { day: "Wk 3", tokens: 2020000, requests: 20800, cost: "$8.08" },
      { day: "Wk 4", tokens: 2200000, requests: 22010, cost: "$8.80" },
    ],
  },
  "This Quarter": {
    requests: "248,600",
    requestsChange: "+28%",
    requestsSub: "+54,200 invocations this quarter",
    tokens: "24.50M",
    tokensChange: "+31%",
    tokensSub: "Across 210 active tenant organizations",
    latency: "1.22s",
    latencyChange: "8% faster",
    latencySub: "P95 latency: 2.15s (SLA Optimal)",
    failed: "310",
    failedChange: "-25%",
    failedSub: "0.12% failure rate (99.88% success)",
    dailyTokens: [
      { day: "Aug", tokens: 7200000, requests: 74200, cost: "$28.80" },
      { day: "Sep", tokens: 8400000, requests: 84800, cost: "$33.60" },
      { day: "Oct", tokens: 8900000, requests: 89600, cost: "$35.60" },
    ],
  },
};

const MODEL_DISTRIBUTION = [
  {
    id: "gemini",
    name: "Google Gemini 2.0 Flash",
    percent: 54,
    tokens: "4.55M",
    logo: geminiLogo,
    color: "#3b66ff",
    speed: "18ms",
  },
  {
    id: "openai",
    name: "OpenAI GPT-4o",
    percent: 24,
    tokens: "2.02M",
    logo: openaiLogo,
    color: "#10b981",
    speed: "34ms",
  },
  {
    id: "anthropic",
    name: "Anthropic Claude 3.5 Sonnet",
    percent: 14,
    tokens: "1.18M",
    logo: anthropicLogo,
    color: "#d97706",
    speed: "42ms",
  },
  {
    id: "deepseek",
    name: "DeepSeek AI V3",
    percent: 5,
    tokens: "0.42M",
    logo: deepseekLogo,
    color: "#0284c7",
    speed: "28ms",
  },
  {
    id: "ollama",
    name: "Self-Hosted / Local LLM (Ollama)",
    percent: 3,
    tokens: "0.25M",
    logo: ollamaLogo,
    color: "#8b5cf6",
    speed: "12ms",
  },
];

const INITIAL_ORGANIZATIONS = [
  {
    id: "ORG-AI-01",
    name: "ABC Technologies",
    contact: "Himanshu Rao",
    email: "himanshu@abc.com",
    plan: "Business Plan",
    requests: 28420,
    tokens: "2.84M",
    rawTokens: 2840000,
    quotaLimit: "3.50M",
    rawQuota: 3500000,
    pctOfTotal: 33.8,
    avgLatency: "1.1s",
    quotaUsed: 75,
    primaryModel: "gemini-2.0-flash",
    topFeatures: ["Document Summarizer", "AI Code Review", "Smart Workflow Bot"],
  },
  {
    id: "ORG-AI-02",
    name: "NovaTech Solutions",
    contact: "Priya Nair",
    email: "priya@novatech.io",
    plan: "Enterprise Plan",
    requests: 22150,
    tokens: "2.21M",
    rawTokens: 2210000,
    quotaLimit: "5.00M",
    rawQuota: 5000000,
    pctOfTotal: 26.3,
    avgLatency: "1.0s",
    quotaUsed: 44,
    primaryModel: "gpt-4o",
    topFeatures: ["Executive Dashboards", "Compliance Scanner", "SSO Auditing"],
  },
  {
    id: "ORG-AI-03",
    name: "XYZ Software",
    contact: "Amit Verma",
    email: "amit@xyz.com",
    plan: "Pro Plan",
    requests: 14890,
    tokens: "1.48M",
    rawTokens: 1480000,
    quotaLimit: "1.65M",
    rawQuota: 1650000,
    pctOfTotal: 17.6,
    avgLatency: "1.3s",
    quotaUsed: 89,
    primaryModel: "gemini-2.0-flash",
    topFeatures: ["Sprint Estimator", "Automated Standups", "Bug Triage"],
  },
  {
    id: "ORG-AI-04",
    name: "Startup Labs",
    contact: "Kunal Shah",
    email: "kunal@startuplabs.io",
    plan: "Pro Plan",
    requests: 8920,
    tokens: "0.94M",
    rawTokens: 940000,
    quotaLimit: "1.00M",
    rawQuota: 1000000,
    pctOfTotal: 11.2,
    avgLatency: "1.2s",
    quotaUsed: 94,
    primaryModel: "deepseek-chat-v3",
    topFeatures: ["Pitch Deck Generator", "Lead Scoring", "Email Copilot"],
  },
  {
    id: "ORG-AI-05",
    name: "NextGen Solutions",
    contact: "Sana Sheikh",
    email: "sana@nextgen.com",
    plan: "Business Plan",
    requests: 11200,
    tokens: "1.12M",
    rawTokens: 1120000,
    quotaLimit: "2.00M",
    rawQuota: 2000000,
    pctOfTotal: 13.3,
    avgLatency: "1.2s",
    quotaUsed: 56,
    primaryModel: "claude-3-5-sonnet",
    topFeatures: ["Contract Analysis", "Policy Generator", "Vendor Diligence"],
  },
  {
    id: "ORG-AI-06",
    name: "DesignHub",
    contact: "Rohan Kapoor",
    email: "rohan@designhub.in",
    plan: "Pro Plan",
    requests: 4860,
    tokens: "0.48M",
    rawTokens: 480000,
    quotaLimit: "0.90M",
    rawQuota: 900000,
    pctOfTotal: 5.7,
    avgLatency: "1.4s",
    quotaUsed: 53,
    primaryModel: "gemini-2.0-flash",
    topFeatures: ["Design Tokens Extraction", "Image Alt-Text", "CSS Palettes"],
  },
  {
    id: "ORG-AI-07",
    name: "Acme Corporation",
    contact: "Sarah Jenkins",
    email: "admin@acmecorp.com",
    plan: "Enterprise Plan",
    requests: 19400,
    tokens: "1.94M",
    rawTokens: 1940000,
    quotaLimit: "5.00M",
    rawQuota: 5000000,
    pctOfTotal: 23.1,
    avgLatency: "0.9s",
    quotaUsed: 38,
    primaryModel: "gpt-4o",
    topFeatures: ["Global Knowledge Base", "Legal QA Engine", "Sales Enablement"],
  },
  {
    id: "ORG-AI-08",
    name: "PixelCraft Studio",
    contact: "Tanya Sen",
    email: "tanya@pixelcraft.design",
    plan: "Pro Plan",
    requests: 3940,
    tokens: "0.39M",
    rawTokens: 390000,
    quotaLimit: "0.85M",
    rawQuota: 850000,
    pctOfTotal: 4.6,
    avgLatency: "1.3s",
    quotaUsed: 45,
    primaryModel: "claude-3-5-sonnet",
    topFeatures: ["UX Copy Generation", "Accessibility Audits"],
  },
  {
    id: "ORG-AI-09",
    name: "BrightLabs",
    contact: "Alex Rivera",
    email: "hello@brightlabs.io",
    plan: "Business Plan",
    requests: 7650,
    tokens: "0.76M",
    rawTokens: 760000,
    quotaLimit: "1.50M",
    rawQuota: 1500000,
    pctOfTotal: 9.1,
    avgLatency: "1.1s",
    quotaUsed: 51,
    primaryModel: "gemini-2.0-flash",
    topFeatures: ["Customer Sentiment", "Ticket Auto-Responder"],
  },
  {
    id: "ORG-AI-10",
    name: "Vertex Digital",
    contact: "Vikram Malhotra",
    email: "hello@vertexdigital.io",
    plan: "Pro Plan",
    requests: 5120,
    tokens: "0.51M",
    rawTokens: 510000,
    quotaLimit: "0.80M",
    rawQuota: 800000,
    pctOfTotal: 6.1,
    avgLatency: "1.2s",
    quotaUsed: 64,
    primaryModel: "deepseek-chat-v3",
    topFeatures: ["SQL Query Assistant", "Data Pipeline Alerts"],
  },
  {
    id: "ORG-AI-11",
    name: "CloudNine Technologies",
    contact: "Elena Rostova",
    email: "admin@cloudnine.dev",
    plan: "Enterprise Plan",
    requests: 16300,
    tokens: "1.63M",
    rawTokens: 1630000,
    quotaLimit: "4.00M",
    rawQuota: 4000000,
    pctOfTotal: 19.4,
    avgLatency: "1.0s",
    quotaUsed: 41,
    primaryModel: "llama3.3:70b",
    topFeatures: ["On-Premise Private Inference", "Code Synthesizer"],
  },
];

function readStoredOrgs() {
  try {
    const raw = localStorage.getItem(STORAGE_ORGS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (err) {
    console.error("Failed to read AI usage organizations from storage:", err);
  }
  return INITIAL_ORGANIZATIONS;
}

function AIUsage() {
  const [organizations, setOrganizations] = useState(readStoredOrgs);
  const [period, setPeriod] = useState("This Month");
  const [chartMetric, setChartMetric] = useState("tokens"); // "tokens" | "requests"
  const [hoveredDay, setHoveredDay] = useState(null);
  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState("All");
  const [quotaFilter, setQuotaFilter] = useState("All");
  const [density, setDensity] = useState("standard");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [toast, setToast] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Modals
  const [detailsModalOrg, setDetailsModalOrg] = useState(null);
  const [adjustQuotaModalOrg, setAdjustQuotaModalOrg] = useState(null);
  const [newQuotaValue, setNewQuotaValue] = useState("");
  const [resetCounterConfirmOrg, setResetCounterConfirmOrg] = useState(null);

  // Sync organizations state to storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_ORGS_KEY, JSON.stringify(organizations));
    } catch (err) {
      console.error("Failed to save AI usage organizations to storage:", err);
    }
  }, [organizations]);

  // Keyboard accessibility: Escape key closes active modals
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setDetailsModalOrg(null);
        setAdjustQuotaModalOrg(null);
        setResetCounterConfirmOrg(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const notify = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3200);
  };

  const currentAI = AI_DATA_BY_PERIOD[period] || AI_DATA_BY_PERIOD["This Month"];

  const maxChartValue = useMemo(() => {
    return Math.max(
      ...currentAI.dailyTokens.map((d) => (chartMetric === "tokens" ? d.tokens : d.requests))
    );
  }, [currentAI, chartMetric]);

  const handleRefreshTelemetry = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      notify("Real-time AI gateway telemetry refreshed successfully.");
    }, 800);
  };

  const filteredOrgs = useMemo(() => {
    const q = search.trim().toLowerCase();
    return organizations.filter((org) => {
      const matchSearch =
        !q ||
        org.id.toLowerCase().includes(q) ||
        org.name.toLowerCase().includes(q) ||
        org.contact.toLowerCase().includes(q) ||
        org.plan.toLowerCase().includes(q) ||
        org.primaryModel.toLowerCase().includes(q);

      const matchPlan =
        planFilter === "All" || org.plan.toLowerCase().includes(planFilter.toLowerCase());

      const matchQuota =
        quotaFilter === "All"
          ? true
          : quotaFilter === "Normal"
          ? org.quotaUsed < 75
          : quotaFilter === "High"
          ? org.quotaUsed >= 75 && org.quotaUsed < 90
          : org.quotaUsed >= 90;

      return matchSearch && matchPlan && matchQuota;
    });
  }, [organizations, search, planFilter, quotaFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredOrgs.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginatedOrgs = filteredOrgs.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleExportCSV = () => {
    const headers = [
      "Tenant ID",
      "Organization Name",
      "Primary Contact",
      "Subscribed Plan",
      "Total Invocations",
      "Tokens Consumed",
      "Quota Ceiling",
      "Quota Used %",
      "Platform Share %",
      "Avg P95 Latency",
      "Primary Model",
    ];

    const rows = filteredOrgs.map((o) => [
      o.id,
      o.name,
      o.contact,
      o.plan,
      o.requests,
      o.tokens,
      o.quotaLimit,
      `${o.quotaUsed}%`,
      `${o.pctOfTotal}%`,
      o.avgLatency,
      o.primaryModel,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8,\uFEFF" +
      [headers, ...rows]
        .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
        .join("\n");

    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = `teamflow_ai_token_usage_${period.toLowerCase().replace(/ /g, "_")}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    notify("Exported AI token consumption spreadsheet.");
  };

  // Open Quota Modal
  const openAdjustQuotaModal = (org) => {
    setAdjustQuotaModalOrg(org);
    setNewQuotaValue(org.quotaLimit.replace("M", ""));
  };

  // Save Quota Adjustment
  const handleSaveAdjustQuota = (e) => {
    e.preventDefault();
    const parsed = parseFloat(newQuotaValue);
    if (isNaN(parsed) || parsed <= 0) {
      notify("Please enter a valid numeric token quota ceiling in Millions.");
      return;
    }

    const updatedLimitStr = `${parsed.toFixed(2)}M`;
    const newRawQuota = parsed * 1000000;

    setOrganizations((prev) =>
      prev.map((o) => {
        if (o.id === adjustQuotaModalOrg.id) {
          const newQuotaUsed = Math.min(100, Math.round((o.rawTokens / newRawQuota) * 100));
          return {
            ...o,
            quotaLimit: updatedLimitStr,
            rawQuota: newRawQuota,
            quotaUsed: newQuotaUsed,
          };
        }
        return o;
      })
    );

    notify(`Updated monthly token ceiling for ${adjustQuotaModalOrg.name} to ${updatedLimitStr}.`);
    setAdjustQuotaModalOrg(null);
  };

  // Reset Token Counter
  const handleResetCounter = (org) => {
    setOrganizations((prev) =>
      prev.map((o) =>
        o.id === org.id
          ? {
              ...o,
              requests: 0,
              tokens: "0.00M",
              rawTokens: 0,
              quotaUsed: 0,
            }
          : o
      )
    );
    notify(`Reset monthly consumption counter to 0 for ${org.name}.`);
    setResetCounterConfirmOrg(null);
  };

  return (
    <div className="aiu-page">
      {/* 1. Master Header Panel */}
      <section className="sap-header-panel">
        <div className="sap-header-left">
          <div className="aiu-header-title-row">
            <h1>AI Token Usage &amp; Gateway Telemetry</h1>
            <span className="aiu-live-tag">
              <span className="aiu-live-dot" /> Live Gateway Sync
            </span>
          </div>
          <p className="sap-header-subtitle">
            Enterprise token telemetry, multi-model consumption audits, tenant quota utilization, and P95 latency diagnostics.
          </p>
        </div>

        <div className="sap-header-actions">
          <div className="aiu-select-filter">
            <select value={period} onChange={(e) => setPeriod(e.target.value)}>
              <option value="This Month">Period: This Month</option>
              <option value="Last 30 Days">Period: Last 30 Days</option>
              <option value="This Quarter">Period: This Quarter</option>
            </select>
            <ChevronDown size={13} className="aiu-chevron" />
          </div>

          <button
            type="button"
            className="sa-btn sa-btn-secondary"
            onClick={handleRefreshTelemetry}
            disabled={isRefreshing}
            title="Refresh real-time gateway stats"
          >
            <RefreshCw size={14} className={isRefreshing ? "aiu-spin" : ""} />
            <span>{isRefreshing ? "Syncing..." : "Sync Telemetry"}</span>
          </button>

          <button
            type="button"
            className="sa-btn sa-btn-primary"
            onClick={handleExportCSV}
          >
            <Download size={14} /> Export Spreadsheet
          </button>
        </div>
      </section>

      {/* 2. Top 4 Telemetry Metric KPI Cards */}
      <section className="sap-kpi-grid">
        <article className="sa-kpi-card">
          <div className="sa-kpi-icon-box purple">
            <Sparkles size={24} strokeWidth={2.2} />
          </div>
          <div className="sa-kpi-body">
            <p className="sa-kpi-title">Total AI Invocations</p>
            <div className="sa-kpi-val-row">
              <span className="sa-kpi-value">{currentAI.requests}</span>
              <span className="sa-kpi-trend positive">
                <ArrowUpRight size={14} /> {currentAI.requestsChange}
              </span>
            </div>
            <span className="sa-kpi-subtitle">{currentAI.requestsSub}</span>
          </div>
        </article>

        <article className="sa-kpi-card">
          <div className="sa-kpi-icon-box amber">
            <Hexagon size={24} strokeWidth={2.2} />
          </div>
          <div className="sa-kpi-body">
            <p className="sa-kpi-title">Tokens Consumed</p>
            <div className="sa-kpi-val-row">
              <span className="sa-kpi-value">{currentAI.tokens}</span>
              <span className="sa-kpi-trend positive">
                <ArrowUpRight size={14} /> {currentAI.tokensChange}
              </span>
            </div>
            <span className="sa-kpi-subtitle">{currentAI.tokensSub}</span>
          </div>
        </article>

        <article className="sa-kpi-card">
          <div className="sa-kpi-icon-box green">
            <Clock3 size={24} strokeWidth={2.2} />
          </div>
          <div className="sa-kpi-body">
            <p className="sa-kpi-title">Avg. Model Latency</p>
            <div className="sa-kpi-val-row">
              <span className="sa-kpi-value">{currentAI.latency}</span>
              <span className="sa-kpi-trend positive">
                <ArrowDownRight size={14} /> {currentAI.latencyChange}
              </span>
            </div>
            <span className="sa-kpi-subtitle">{currentAI.latencySub}</span>
          </div>
        </article>

        <article className="sa-kpi-card">
          <div className="sa-kpi-icon-box red">
            <TriangleAlert size={24} strokeWidth={2.2} />
          </div>
          <div className="sa-kpi-body">
            <p className="sa-kpi-title">Failed Inferences</p>
            <div className="sa-kpi-val-row">
              <span className="sa-kpi-value">{currentAI.failed}</span>
              <span className="sa-kpi-trend negative">
                <ArrowDownRight size={14} /> {currentAI.failedChange}
              </span>
            </div>
            <span className="sa-kpi-subtitle">{currentAI.failedSub}</span>
          </div>
        </article>
      </section>

      {/* Floating Toast Notification */}
      {toast && (
        <div className="sa-toast-banner">
          <CheckCircle2 size={16} /> {toast}
        </div>
      )}

      {/* 3. Interactive Charts Grid */}
      <section className="aiu-charts-grid">
        {/* Chart 1: Token Volume & Daily Load Distribution */}
        <article className="aiu-chart-card">
          <div className="aiu-chart-header">
            <div>
              <h3 className="aiu-chart-title">Load Distribution &amp; Volume Trends</h3>
              <span className="aiu-chart-subtitle">
                Temporal distribution across active gateway shards ({period})
              </span>
            </div>

            <div className="aiu-metric-toggle">
              <button
                type="button"
                className={`aiu-metric-btn ${chartMetric === "tokens" ? "active" : ""}`}
                onClick={() => setChartMetric("tokens")}
              >
                Tokens
              </button>
              <button
                type="button"
                className={`aiu-metric-btn ${chartMetric === "requests" ? "active" : ""}`}
                onClick={() => setChartMetric("requests")}
              >
                Invocations
              </button>
            </div>
          </div>

          <div className="aiu-bar-chart-stage">
            {currentAI.dailyTokens.map((item, idx) => {
              const val = chartMetric === "tokens" ? item.tokens : item.requests;
              const heightPct = Math.max(14, (val / maxChartValue) * 100);
              const isHovered = hoveredDay === idx;
              return (
                <div
                  key={item.day}
                  className={`aiu-bar-col ${isHovered ? "is-hovered" : ""}`}
                  onMouseEnter={() => setHoveredDay(idx)}
                  onMouseLeave={() => setHoveredDay(null)}
                >
                  <div className="aiu-bar-track">
                    <div
                      className="aiu-bar-fill"
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>

                  <span className="aiu-bar-label">{item.day}</span>

                  {isHovered && (
                    <div className="aiu-floating-tooltip">
                      <div className="aiu-tooltip-title">{item.day} Gateway Traffic</div>
                      <div className="aiu-tooltip-row">
                        <span>Tokens:</span>
                        <strong>{(item.tokens / 1000).toFixed(0)}k</strong>
                      </div>
                      <div className="aiu-tooltip-row">
                        <span>Invocations:</span>
                        <strong>{item.requests.toLocaleString()}</strong>
                      </div>
                      <div className="aiu-tooltip-row">
                        <span>Compute Cost:</span>
                        <strong style={{ color: "#10b981" }}>{item.cost}</strong>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="aiu-chart-footer">
            <span className="aiu-chart-stat">
              Peak Traffic: <strong>520k tokens / day</strong> on Oct 26
            </span>
            <span className="aiu-chart-stat">
              Average Token Efficiency: <strong>99.86% successful inferences</strong>
            </span>
          </div>
        </article>

        {/* Chart 2: Model Consumption Breakdown */}
        <article className="aiu-chart-card">
          <div className="aiu-chart-header">
            <div>
              <h3 className="aiu-chart-title">Model Consumption Breakdown</h3>
              <span className="aiu-chart-subtitle">
                Traffic routed by TeamFlow multi-model gateway
              </span>
            </div>
            <span className="aiu-total-badge">5 Active Engines</span>
          </div>

          <div className="aiu-models-list">
            {MODEL_DISTRIBUTION.map((m) => (
              <div key={m.id} className="aiu-model-row">
                <div className="aiu-model-header-row">
                  <div className="aiu-model-title-wrap">
                    <div className="aiu-model-logo-box">
                      <img
                        src={m.logo}
                        alt={m.name}
                        className="aiu-model-logo-img"
                        loading="lazy"
                      />
                    </div>
                    <div>
                      <span className="aiu-model-name">{m.name}</span>
                      <span className="aiu-model-latency">Latency: {m.speed}</span>
                    </div>
                  </div>

                  <div className="aiu-model-val-wrap">
                    <strong className="aiu-model-tokens">{m.tokens}</strong>
                    <span className="aiu-model-pct">({m.percent}%)</span>
                  </div>
                </div>

                <div className="aiu-progress-track">
                  <div
                    className="aiu-progress-fill"
                    style={{ width: `${m.percent}%`, backgroundColor: m.color }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="aiu-chart-footer">
            <span className="aiu-chart-stat">
              Primary Driver: <strong>Gemini 2.0 Flash</strong> accounts for 54% of platform inferences
            </span>
          </div>
        </article>
      </section>

      {/* 4. Top Consuming Organizations Table Card */}
      <section className="sap-table-card">
        {/* Toolbar & Filter Bar */}
        <div className="sap-toolbar">
          <div className="sap-toolbar-left">
            <div className="sap-search-input">
              <Search size={15} style={{ color: "var(--sa-text-muted)" }} />
              <input
                type="text"
                placeholder="Search tenant code, organization name, contact, or model..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
              {search && (
                <button
                  type="button"
                  style={{ background: "transparent", border: 0, cursor: "pointer", color: "#94a3b8" }}
                  onClick={() => setSearch("")}
                >
                  <X size={13} />
                </button>
              )}
            </div>

            <select
              className="sap-filter-select"
              value={planFilter}
              onChange={(e) => {
                setPlanFilter(e.target.value);
                setPage(1);
              }}
            >
              <option value="All">Plan: All Tiers</option>
              <option value="Enterprise">Enterprise Tier</option>
              <option value="Business">Business Tier</option>
              <option value="Pro">Pro Tier</option>
            </select>

            <select
              className="sap-filter-select"
              value={quotaFilter}
              onChange={(e) => {
                setQuotaFilter(e.target.value);
                setPage(1);
              }}
            >
              <option value="All">Quota: All Levels</option>
              <option value="Normal">Normal (&lt;75% Used)</option>
              <option value="High">Elevated (75-90% Used)</option>
              <option value="Critical">Critical (&gt;90% Used)</option>
            </select>
          </div>

          <div className="sap-toolbar-right">
            {/* Density Switcher */}
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
              onClick={() => {
                setSearch("");
                setPlanFilter("All");
                setQuotaFilter("All");
                setPage(1);
              }}
              title="Reset all filters"
            >
              <RotateCcw size={15} />
            </button>
          </div>
        </div>

        {/* 5. The SAP Table Data Grid */}
        <div className="sap-table-wrapper">
          <table className={`sap-grid is-${density}`}>
            <thead>
              <tr>
                <th style={{ width: 110 }}>Tenant Code</th>
                <th style={{ minWidth: 230 }}>Organization Identity</th>
                <th style={{ minWidth: 140 }}>Plan Tier</th>
                <th style={{ minWidth: 130 }}>Invocations</th>
                <th style={{ minWidth: 120 }}>Token Volume</th>
                <th style={{ minWidth: 110 }}>Share %</th>
                <th style={{ minWidth: 180 }}>Quota Utilization</th>
                <th style={{ minWidth: 110 }}>Avg. Latency</th>
                <th style={{ textAlign: "right", minWidth: 190, width: 190 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedOrgs.map((org) => {
                const isCritical = org.quotaUsed >= 90;
                const isHigh = org.quotaUsed >= 75 && !isCritical;
                return (
                  <tr key={org.id}>
                    <td>
                      <span className="sap-id-cell">{org.id}</span>
                    </td>
                    <td>
                      <div className="aiu-org-cell">
                        <div className="aiu-org-avatar-wrap">
                          <img
                            src={orgAvatarImg}
                            alt={org.name}
                            className="aiu-org-avatar-img"
                            loading="lazy"
                          />
                        </div>
                        <div className="aiu-org-info">
                          <strong
                            className="aiu-org-name"
                            onClick={() => setDetailsModalOrg(org)}
                            title="View AI Telemetry details"
                          >
                            {org.name}
                          </strong>
                          <span className="aiu-org-sub">
                            {org.contact} · {org.email}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span
                        className={`aiu-plan-pill ${
                          org.plan.includes("Enterprise")
                            ? "enterprise"
                            : org.plan.includes("Business")
                            ? "business"
                            : "pro"
                        }`}
                      >
                        {org.plan}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontFamily: "ui-monospace, monospace", fontSize: 12.5 }}>
                        {org.requests.toLocaleString()}
                      </span>
                    </td>
                    <td>
                      <strong style={{ fontFamily: "ui-monospace, monospace", fontSize: 13 }}>
                        {org.tokens}
                      </strong>
                    </td>
                    <td>
                      <span className="aiu-share-tag">{org.pctOfTotal}%</span>
                    </td>
                    <td>
                      <div className="aiu-quota-cell">
                        <div className="aiu-quota-bar-track">
                          <div
                            className={`aiu-quota-bar-fill ${
                              isCritical ? "critical" : isHigh ? "high" : "normal"
                            }`}
                            style={{ width: `${Math.min(100, org.quotaUsed)}%` }}
                          />
                        </div>
                        <span
                          className={`aiu-quota-val ${
                            isCritical ? "critical" : isHigh ? "high" : ""
                          }`}
                        >
                          {org.quotaUsed}%
                        </span>
                      </div>
                      <span className="aiu-quota-limit-sub">
                        Ceiling: {org.quotaLimit}
                      </span>
                    </td>
                    <td>
                      <span className="aiu-latency-badge">{org.avgLatency}</span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <div className="aiu-actions-group">
                        <button
                          type="button"
                          className="aiu-action-btn btn-view"
                          onClick={() => setDetailsModalOrg(org)}
                          title="View Tenant AI Telemetry & Logs"
                        >
                          <Eye size={13} />
                          <span>Details</span>
                        </button>
                        <button
                          type="button"
                          className="aiu-action-btn btn-quota"
                          onClick={() => openAdjustQuotaModal(org)}
                          title="Adjust Token Quota Ceiling"
                        >
                          <Sliders size={13} />
                          <span>Quota</span>
                        </button>
                        <button
                          type="button"
                          className="aiu-action-btn btn-reset"
                          onClick={() => setResetCounterConfirmOrg(org)}
                          title="Reset Monthly Consumption Counter"
                        >
                          <RotateCcw size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {paginatedOrgs.length === 0 && (
                <tr>
                  <td colSpan="9" style={{ textAlign: "center", padding: "40px" }}>
                    <div style={{ color: "var(--sa-text-muted)", fontSize: 13 }}>
                      <strong>No organizations found matching your search query.</strong>
                      <p style={{ margin: "6px 0 12px", fontSize: 12 }}>
                        Try clearing or adjusting active filters.
                      </p>
                      <button
                        type="button"
                        className="sa-btn sa-btn-secondary sa-btn-sm"
                        onClick={() => {
                          setSearch("");
                          setPlanFilter("All");
                          setQuotaFilter("All");
                        }}
                      >
                        Reset All Filters
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 6. The SAP Footer Bar */}
        <div className="sap-footer-bar">
          <div className="sap-footer-counts" style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div className="sap-counter">
              Showing{" "}
              <strong>
                {filteredOrgs.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}
              </strong>{" "}
              to{" "}
              <strong>
                {Math.min(currentPage * pageSize, filteredOrgs.length)}
              </strong>{" "}
              of <strong>{filteredOrgs.length}</strong> monitored organizations
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

      {/* ======================================================================
          7. MODAL 1: TENANT DEEP-DIVE AI TELEMETRY
          ====================================================================== */}
      {detailsModalOrg &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="sa-modal-backdrop"
            onClick={() => setDetailsModalOrg(null)}
          >
            <div
              className="aiu-modal-dialog"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="aiu-modal-header">
                <div className="aiu-modal-header-left">
                  <div className="aiu-org-avatar-wrap" style={{ width: 40, height: 40 }}>
                    <img
                      src={orgAvatarImg}
                      alt={detailsModalOrg.name}
                      className="aiu-org-avatar-img"
                    />
                  </div>
                  <div>
                    <h3 className="aiu-modal-title">{detailsModalOrg.name}</h3>
                    <div className="aiu-modal-subtitle">
                      <span>{detailsModalOrg.plan}</span>
                      <span>·</span>
                      <span>Admin: {detailsModalOrg.contact}</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  className="sa-modal-close"
                  onClick={() => setDetailsModalOrg(null)}
                >
                  <X size={17} />
                </button>
              </div>

              <div className="aiu-modal-body">
                {/* 3 Telemetry Cards inside Modal */}
                <div className="aiu-modal-kpi-grid">
                  <div className="aiu-kpi-stat">
                    <span className="aiu-kpi-stat-label">Monthly Tokens</span>
                    <strong className="aiu-kpi-stat-val">{detailsModalOrg.tokens}</strong>
                    <span className="aiu-kpi-stat-sub">Limit: {detailsModalOrg.quotaLimit}</span>
                  </div>
                  <div className="aiu-kpi-stat">
                    <span className="aiu-kpi-stat-label">Invocations</span>
                    <strong className="aiu-kpi-stat-val">
                      {detailsModalOrg.requests.toLocaleString()}
                    </strong>
                    <span className="aiu-kpi-stat-sub">Avg latency: {detailsModalOrg.avgLatency}</span>
                  </div>
                  <div className="aiu-kpi-stat">
                    <span className="aiu-kpi-stat-label">Quota Used</span>
                    <strong
                      className={`aiu-kpi-stat-val ${
                        detailsModalOrg.quotaUsed >= 90 ? "critical" : ""
                      }`}
                    >
                      {detailsModalOrg.quotaUsed}%
                    </strong>
                    <span className="aiu-kpi-stat-sub">Reset in 14 days</span>
                  </div>
                </div>

                {/* Quota Progress Bar */}
                <div className="aiu-modal-section">
                  <div className="aiu-modal-section-header">
                    <span>Monthly Quota Utilization</span>
                    <strong>
                      {detailsModalOrg.tokens} / {detailsModalOrg.quotaLimit}
                    </strong>
                  </div>
                  <div className="aiu-progress-track" style={{ height: 10 }}>
                    <div
                      className={`aiu-progress-fill ${
                        detailsModalOrg.quotaUsed >= 90
                          ? "critical"
                          : detailsModalOrg.quotaUsed >= 75
                          ? "high"
                          : ""
                      }`}
                      style={{
                        width: `${Math.min(100, detailsModalOrg.quotaUsed)}%`,
                        backgroundColor:
                          detailsModalOrg.quotaUsed >= 90
                            ? "#ef4444"
                            : detailsModalOrg.quotaUsed >= 75
                            ? "#f59e0b"
                            : "#3b66ff",
                      }}
                    />
                  </div>
                </div>

                {/* Preferred Model & Engine */}
                <div className="aiu-modal-section">
                  <div className="aiu-modal-section-title">
                    <Bot size={15} /> Primary Routing Engine
                  </div>
                  <div className="aiu-model-pill-card">
                    <div>
                      <strong>{detailsModalOrg.primaryModel}</strong>
                      <p style={{ margin: "2px 0 0", fontSize: 11.5, color: "var(--sa-text-muted)" }}>
                        Configured as the default prompt completion model for workspace users.
                      </p>
                    </div>
                    <span className="aiu-speed-pill">Avg. {detailsModalOrg.avgLatency}</span>
                  </div>
                </div>

                {/* Top Features */}
                <div className="aiu-modal-section">
                  <div className="aiu-modal-section-title">
                    <Flame size={15} color="#f59e0b" /> Highest Token Consuming Features
                  </div>
                  <div className="aiu-features-list">
                    {detailsModalOrg.topFeatures?.map((f, i) => (
                      <div key={i} className="aiu-feature-chip">
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="aiu-modal-footer">
                <button
                  type="button"
                  className="sa-btn sa-btn-secondary"
                  onClick={() => setDetailsModalOrg(null)}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="sa-btn sa-btn-primary"
                  onClick={() => {
                    const target = detailsModalOrg;
                    setDetailsModalOrg(null);
                    openAdjustQuotaModal(target);
                  }}
                >
                  <Sliders size={14} /> Adjust Quota Limit
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* ======================================================================
          8. MODAL 2: ADJUST TENANT AI QUOTA CEILING
          ====================================================================== */}
      {adjustQuotaModalOrg &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="sa-modal-backdrop"
            onClick={() => setAdjustQuotaModalOrg(null)}
          >
            <div
              className="aiu-modal-dialog"
              style={{ maxWidth: 480 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="aiu-modal-header">
                <div className="aiu-modal-header-left">
                  <div className="aiu-modal-icon-box">
                    <Sliders size={18} />
                  </div>
                  <div>
                    <h3 className="aiu-modal-title">Adjust Token Quota Ceiling</h3>
                    <div className="aiu-modal-subtitle">
                      Organization: <strong>{adjustQuotaModalOrg.name}</strong>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  className="sa-modal-close"
                  onClick={() => setAdjustQuotaModalOrg(null)}
                >
                  <X size={17} />
                </button>
              </div>

              <form onSubmit={handleSaveAdjustQuota}>
                <div className="aiu-modal-body">
                  <div className="aiu-field-group">
                    <label className="aiu-field-label">
                      <span>Monthly Token Quota Limit (Millions) *</span>
                      <span style={{ fontSize: 11, color: "var(--sa-text-muted)" }}>
                        Current: {adjustQuotaModalOrg.quotaLimit}
                      </span>
                    </label>
                    <div className="aiu-input-with-suffix">
                      <input
                        type="number"
                        step="0.25"
                        min="0.5"
                        max="50"
                        className="aiu-field-input"
                        placeholder="e.g. 5.0"
                        value={newQuotaValue}
                        onChange={(e) => setNewQuotaValue(e.target.value)}
                        required
                      />
                      <span className="aiu-input-suffix">Million Tokens / mo</span>
                    </div>
                    <span className="aiu-field-hint">
                      Increasing the token ceiling permits higher LLM invocation bandwidth before throttling kicks in.
                    </span>
                  </div>

                  {/* Quick-Preset Chips */}
                  <div className="aiu-presets-group">
                    <span className="aiu-presets-label">Quick Allocations:</span>
                    <div className="aiu-presets-row">
                      {[1.5, 2.5, 5.0, 10.0].map((num) => (
                        <button
                          key={num}
                          type="button"
                          className="aiu-preset-chip"
                          onClick={() => setNewQuotaValue(num.toString())}
                        >
                          {num}M Tokens
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="aiu-modal-footer">
                  <button
                    type="button"
                    className="sa-btn sa-btn-secondary"
                    onClick={() => setAdjustQuotaModalOrg(null)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="sa-btn sa-btn-primary">
                    <CheckCircle2 size={14} /> Save New Quota
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}

      {/* ======================================================================
          9. MODAL 3: RESET TOKEN COUNTER CONFIRMATION
          ====================================================================== */}
      {resetCounterConfirmOrg &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="sa-modal-backdrop"
            onClick={() => setResetCounterConfirmOrg(null)}
          >
            <div
              className="aiu-delete-dialog"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="aiu-delete-icon-box">
                <RotateCcw size={22} />
              </div>
              <h3 className="aiu-delete-title">
                Reset Monthly Token Counter?
              </h3>
              <p className="aiu-delete-desc">
                Are you sure you want to reset the current billing cycle token count to <strong>0</strong> for{" "}
                <strong>{resetCounterConfirmOrg.name}</strong>? This will clear all rate limits and reset quota utilization back to 0%.
              </p>
              <div className="aiu-delete-actions">
                <button
                  type="button"
                  className="sa-btn sa-btn-secondary"
                  onClick={() => setResetCounterConfirmOrg(null)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="sa-btn sa-btn-primary"
                  onClick={() => handleResetCounter(resetCounterConfirmOrg)}
                >
                  Yes, Reset Token Counter
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}

export default AIUsage;
