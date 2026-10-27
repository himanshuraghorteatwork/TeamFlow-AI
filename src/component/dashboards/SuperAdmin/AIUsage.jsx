import { useMemo, useState } from "react";
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
} from "lucide-react";
import "./SuperAdminCommon.css";
import "./AIUsage.css";

const AI_DATA_BY_PERIOD = {
  "This Month": {
    requests: "84,520",
    requestsChange: "18%",
    requestsSub: "+ 12,400 this month",
    tokens: "8.4M",
    tokensChange: "22%",
    tokensSub: "Across 186 organizations",
    latency: "1.2s",
    latencyChange: "12% faster",
    latencySub: "P95 latency: 2.1s",
    failed: "124",
    failedChange: "40%",
    failedSub: "0.14% failure rate",
    dailyTokens: [
      { day: "Oct 20", tokens: 280000, requests: 2840 },
      { day: "Oct 21", tokens: 340000, requests: 3410 },
      { day: "Oct 22", tokens: 310000, requests: 3080 },
      { day: "Oct 23", tokens: 420000, requests: 4190 },
      { day: "Oct 24", tokens: 390000, requests: 3850 },
      { day: "Oct 25", tokens: 480000, requests: 4720 },
      { day: "Oct 26", tokens: 520000, requests: 5120 },
    ],
  },
  "Last 30 Days": {
    requests: "79,410",
    requestsChange: "15%",
    requestsSub: "+ 10,800 in 30 days",
    tokens: "7.8M",
    tokensChange: "18%",
    tokensSub: "Across 182 organizations",
    latency: "1.18s",
    latencyChange: "10% faster",
    latencySub: "P95 latency: 2.05s",
    failed: "96",
    failedChange: "35%",
    failedSub: "0.12% failure rate",
    dailyTokens: [
      { day: "Wk 1", tokens: 1650000, requests: 17200 },
      { day: "Wk 2", tokens: 1980000, requests: 19400 },
      { day: "Wk 3", tokens: 2020000, requests: 20800 },
      { day: "Wk 4", tokens: 2150000, requests: 22010 },
    ],
  },
  "This Quarter": {
    requests: "248,600",
    requestsChange: "28%",
    requestsSub: "+ 54,200 this quarter",
    tokens: "24.5M",
    tokensChange: "31%",
    tokensSub: "Across 210 organizations",
    latency: "1.22s",
    latencyChange: "8% faster",
    latencySub: "P95 latency: 2.15s",
    failed: "310",
    failedChange: "25%",
    failedSub: "0.12% failure rate",
    dailyTokens: [
      { day: "Aug", tokens: 7200000, requests: 74200 },
      { day: "Sep", tokens: 8400000, requests: 84800 },
      { day: "Oct", tokens: 8900000, requests: 89600 },
    ],
  },
};

const modelDistribution = [
  { name: "Google Gemini 2.0 Flash", percent: 55, tokens: "4.6M", color: "#3b66ff" },
  { name: "OpenAI GPT-4o", percent: 25, tokens: "2.1M", color: "#10b981" },
  { name: "Anthropic Claude 3.5", percent: 15, tokens: "1.26M", color: "#f59e0b" },
  { name: "Ollama / Local LLM", percent: 5, tokens: "0.44M", color: "#8b5cf6" },
];

const topOrganizations = [
  {
    id: "ORG-AI-01",
    name: "ABC Technologies",
    plan: "Business Plan",
    requests: 28420,
    tokens: "2.84M",
    pctOfTotal: 33.8,
    avgLatency: "1.1s",
    quotaUsed: 75,
  },
  {
    id: "ORG-AI-02",
    name: "NovaTech Solutions",
    plan: "Enterprise Plan",
    requests: 22150,
    tokens: "2.21M",
    pctOfTotal: 26.3,
    avgLatency: "1.0s",
    quotaUsed: 44,
  },
  {
    id: "ORG-AI-03",
    name: "XYZ Software",
    plan: "Pro Plan",
    requests: 14890,
    tokens: "1.48M",
    pctOfTotal: 17.6,
    avgLatency: "1.3s",
    quotaUsed: 89,
  },
  {
    id: "ORG-AI-04",
    name: "NextGen Solutions",
    plan: "Business Plan",
    requests: 11200,
    tokens: "1.12M",
    pctOfTotal: 13.3,
    avgLatency: "1.2s",
    quotaUsed: 62,
  },
  {
    id: "ORG-AI-05",
    name: "DesignHub",
    plan: "Pro Plan",
    requests: 4860,
    tokens: "0.48M",
    pctOfTotal: 5.7,
    avgLatency: "1.4s",
    quotaUsed: 52,
  },
  {
    id: "ORG-AI-06",
    name: "PixelCraft Studio",
    plan: "Pro Plan",
    requests: 3940,
    tokens: "0.39M",
    pctOfTotal: 4.6,
    avgLatency: "1.3s",
    quotaUsed: 42,
  },
];

function AIUsage() {
  const [period, setPeriod] = useState("This Month");
  const [hoveredDay, setHoveredDay] = useState(null);
  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState("All");
  const [density, setDensity] = useState("standard");
  const [page, setPage] = useState(1);
  const [toast, setToast] = useState("");

  const [pageSize, setPageSize] = useState(10);

  const notify = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2800);
  };

  const currentAI = AI_DATA_BY_PERIOD[period] || AI_DATA_BY_PERIOD["This Month"];
  const maxTokens = Math.max(...currentAI.dailyTokens.map((d) => d.tokens));

  const filteredOrgs = useMemo(() => {
    const q = search.trim().toLowerCase();
    return topOrganizations.filter((org) => {
      const matchSearch =
        !q ||
        org.name.toLowerCase().includes(q) ||
        org.plan.toLowerCase().includes(q);

      const matchPlan =
        planFilter === "All" || org.plan.toLowerCase().includes(planFilter.toLowerCase());

      return matchSearch && matchPlan;
    });
  }, [search, planFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredOrgs.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginatedOrgs = filteredOrgs.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleExportCSV = () => {
    const headers = ["Organization ID", "Organization Name", "Plan Tier", "Total Requests", "Tokens Used", "Platform Share %", "Quota Used %", "Avg Latency"];
    const rows = filteredOrgs.map((o) => [o.id, o.name, o.plan, o.requests, o.tokens, `${o.pctOfTotal}%`, `${o.quotaUsed}%`, o.avgLatency]);
    const csvContent =
      "data:text/csv;charset=utf-8,\uFEFF" +
      [headers, ...rows]
        .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
        .join("\n");
    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = `teamflow_ai_usage_${period.toLowerCase().replace(/ /g, "_")}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    notify("Exported AI token analytics spreadsheet.");
  };

  return (
    <div className="ai-usage-page">
      {/* 1. SAP Master Header Bar */}
      <section className="sap-header-panel">
        <div className="sap-header-left">
          <h1>AI Token Analytics &amp; LLM Routing Telemetry</h1>
          <p className="sap-header-subtitle">
            Real-time multi-model token telemetry, tenant quota utilization, latency benchmarking, and LLM consumption audits.
          </p>
        </div>

        <div className="sap-header-actions">
          <div className="sa-select-filter">
            <select value={period} onChange={(e) => setPeriod(e.target.value)}>
              <option value="This Month">Period: This Month</option>
              <option value="Last 30 Days">Period: Last 30 Days</option>
              <option value="This Quarter">Period: This Quarter</option>
            </select>
            <ChevronDown size={13} className="sa-chevron" />
          </div>

          <button
            type="button"
            className="sa-btn sa-btn-secondary"
            onClick={handleExportCSV}
          >
            <Download size={15} /> Export Spreadsheet
          </button>
        </div>
      </section>

      {/* 2. Top 4 Telemetry Cards */}
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

      {/* 3. Charts Grid */}
      <section className="sa-ai-charts-grid" style={{ marginBottom: 20 }}>
        {/* Token Daily Volume */}
        <article className="sa-card sa-ai-chart-card">
          <div className="sa-card-header">
            <h3>Token Volume &amp; Daily Load Distribution</h3>
            <span className="sa-total-tag">Live telemetry for {period}</span>
          </div>

          <div className="sa-ai-bar-chart">
            {currentAI.dailyTokens.map((item, idx) => {
              const heightPercent = Math.max(12, (item.tokens / maxTokens) * 100);
              const isHovered = hoveredDay === idx;
              return (
                <div
                  key={item.day}
                  className="sa-ai-bar-col"
                  onMouseEnter={() => setHoveredDay(idx)}
                  onMouseLeave={() => setHoveredDay(null)}
                >
                  <div className="sa-ai-bar-track">
                    <div
                      className="sa-ai-bar-fill"
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>
                  <span className="sa-ai-bar-day">{item.day}</span>
                  {isHovered && (
                    <div className="sa-ai-tooltip">
                      <strong>{(item.tokens / 1000).toFixed(0)}k Tokens</strong>
                      <span>{item.requests.toLocaleString()} calls</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </article>

        {/* Model Market Share */}
        <article className="sa-card sa-model-dist-card">
          <div className="sa-card-header">
            <h3>Model Consumption Breakdown</h3>
            <span className="sa-total-tag">Multi-LLM Router</span>
          </div>

          <div className="sa-model-bars-list">
            {modelDistribution.map((m) => (
              <div key={m.name} className="sa-model-dist-row">
                <div className="sa-model-row-meta">
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Bot size={15} style={{ color: m.color }} />
                    <span className="sa-model-name">{m.name}</span>
                  </div>
                  <span className="sa-model-share">
                    <strong>{m.tokens}</strong> ({m.percent}%)
                  </span>
                </div>
                <div className="sa-sub-progress">
                  <div
                    className="sa-sub-progress-fill"
                    style={{ width: `${m.percent}%`, backgroundColor: m.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>

      {toast && (
        <div className="sa-toast-banner">
          <CheckCircle2 size={16} /> {toast}
        </div>
      )}

      {/* 4. Top Consuming Organizations Table Card */}
      <section className="sap-table-card">
        {/* Toolbar & Filter Bar */}
        <div className="sap-toolbar">
          <div className="sap-toolbar-left">
            <div className="sap-search-input">
              <Search size={15} style={{ color: "var(--sa-text-muted)" }} />
              <input
                type="text"
                placeholder="Search organization or plan tier..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
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
              <option value="Enterprise">Enterprise Tiers</option>
              <option value="Business">Business Tiers</option>
              <option value="Pro">Pro Tiers</option>
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
                setPage(1);
              }}
              title="Reset all filters"
            >
              <RefreshCw size={15} />
            </button>
          </div>
        </div>

        {/* 5. The SAP Table Data Grid */}
        <div className="sap-table-wrapper">
          <table className={`sap-grid is-${density}`}>
            <thead>
              <tr>
                <th style={{ width: 110 }}>Tenant Code</th>
                <th>Organization Identity</th>
                <th>Subscribed Tier</th>
                <th>Total Invocations</th>
                <th>Token Volume</th>
                <th>Platform Share</th>
                <th>Quota Utilization</th>
                <th>Avg. P95 Latency</th>
              </tr>
            </thead>
            <tbody>
              {paginatedOrgs.map((org) => (
                <tr key={org.name}>
                  <td>
                    <span className="sap-id-cell">{org.id}</span>
                  </td>
                  <td>
                    <div className="sap-user-badge">
                      <div className="sap-avatar-chip">
                        <Building2 size={15} />
                      </div>
                      <div className="sap-user-info">
                        <strong className="sap-user-name">{org.name}</strong>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span
                      className={`sap-role-badge ${
                        org.plan.includes("Enterprise")
                          ? "role-admin"
                          : org.plan.includes("Business")
                          ? "role-manager"
                          : "role-member"
                      }`}
                    >
                      {org.plan}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontFamily: "ui-monospace, monospace" }}>
                      {org.requests.toLocaleString()}
                    </span>
                  </td>
                  <td>
                    <strong style={{ fontFamily: "ui-monospace, monospace" }}>
                      {org.tokens}
                    </strong>
                  </td>
                  <td>
                    <span style={{ fontSize: 13, fontWeight: 700 }}>{org.pctOfTotal}%</span>
                  </td>
                  <td style={{ minWidth: 160 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div className="sa-sub-progress" style={{ flex: 1 }}>
                        <div
                          className="sa-sub-progress-fill"
                          style={{
                            width: `${org.quotaUsed}%`,
                            backgroundColor:
                              org.quotaUsed > 85 ? "#ef4444" : "#3b66ff",
                          }}
                        />
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 700 }}>
                        {org.quotaUsed}%
                      </span>
                    </div>
                  </td>
                  <td>
                    <span style={{ color: "#10b981", fontWeight: 700, fontFamily: "ui-monospace, monospace" }}>
                      {org.avgLatency}
                    </span>
                  </td>
                </tr>
              ))}
              {paginatedOrgs.length === 0 && (
                <tr>
                  <td colSpan="8" style={{ textAlign: "center", padding: "40px" }}>
                    No organizations match your search query or filters.
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
    </div>
  );
}

export default AIUsage;
