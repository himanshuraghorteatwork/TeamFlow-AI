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
    name: "ABC Technologies",
    plan: "Business Plan",
    requests: 28420,
    tokens: "2.84M",
    pctOfTotal: 33.8,
    avgLatency: "1.1s",
    quotaUsed: 75,
  },
  {
    name: "NovaTech Solutions",
    plan: "Enterprise Plan",
    requests: 22150,
    tokens: "2.21M",
    pctOfTotal: 26.3,
    avgLatency: "1.0s",
    quotaUsed: 44,
  },
  {
    name: "XYZ Software",
    plan: "Pro Plan",
    requests: 14890,
    tokens: "1.48M",
    pctOfTotal: 17.6,
    avgLatency: "1.3s",
    quotaUsed: 89,
  },
  {
    name: "NextGen Solutions",
    plan: "Business Plan",
    requests: 11200,
    tokens: "1.12M",
    pctOfTotal: 13.3,
    avgLatency: "1.2s",
    quotaUsed: 62,
  },
  {
    name: "DesignHub",
    plan: "Pro Plan",
    requests: 4860,
    tokens: "0.48M",
    pctOfTotal: 5.7,
    avgLatency: "1.4s",
    quotaUsed: 52,
  },
];

function AIUsage() {
  const [period, setPeriod] = useState("This Month");
  const [hoveredDay, setHoveredDay] = useState(null);

  const currentAI = AI_DATA_BY_PERIOD[period] || AI_DATA_BY_PERIOD["This Month"];
  const maxTokens = Math.max(...currentAI.dailyTokens.map((d) => d.tokens));

  return (
    <div className="sa-page-container sa-aiusage-page">
      {/* 1. Page Header */}
      <section className="sa-page-header">
        <div className="sa-page-header-left">
          <h1>AI Usage & Token Analytics</h1>
          <p>Real-time token telemetry, model consumption breakdowns, and tenant usage metrics.</p>
        </div>

        <div className="sa-page-header-actions">
          <div className="sa-select-filter">
            <select value={period} onChange={(e) => setPeriod(e.target.value)}>
              <option value="This Month">This Month</option>
              <option value="Last 30 Days">Last 30 Days</option>
              <option value="This Quarter">This Quarter</option>
            </select>
            <ChevronDown size={13} className="sa-chevron" />
          </div>

          <button
            type="button"
            className="sa-btn sa-btn-secondary"
            onClick={() => alert("AI usage report exported successfully!")}
          >
            <Download size={15} /> Export Usage Report
          </button>
        </div>
      </section>

      {/* 2. Top 4 KPI Stat Cards */}
      <section className="sa-kpi-grid">
        <article className="sa-kpi-card">
          <div className="sa-kpi-icon-box purple">
            <Sparkles size={24} strokeWidth={2.2} />
          </div>
          <div className="sa-kpi-body">
            <p className="sa-kpi-title">Total AI Requests</p>
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
            <p className="sa-kpi-title">Avg. Response Time</p>
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
            <p className="sa-kpi-title">Failed Requests</p>
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

      {/* 3. Charts: Daily Token Consumption Curve + Model Distribution */}
      <section className="sa-ai-charts-grid">
        {/* Token Daily Volume */}
        <article className="sa-card sa-ai-chart-card">
          <div className="sa-card-header">
            <h3>Token Volume & Daily Load</h3>
            <span className="sa-total-tag">Live telemetry for {period}</span>
          </div>

          <div className="sa-ai-bar-chart">
            {currentAI.dailyTokens.map((d, index) => {
              const heightPct = (d.tokens / maxTokens) * 100;
              return (
                <div
                  key={d.day}
                  className="sa-ai-bar-col"
                  onMouseEnter={() => setHoveredDay(d)}
                  onMouseLeave={() => setHoveredDay(null)}
                >
                  <div className="sa-ai-track">
                    <div
                      className="sa-ai-fill"
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>
                  <span className="sa-ai-day">{d.day}</span>
                  <span className="sa-ai-count">{(d.tokens / 1000).toFixed(0)}k</span>
                </div>
              );
            })}
          </div>

          {hoveredDay && (
            <div className="sa-hover-info-badge">
              <strong>{hoveredDay.day}:</strong> {hoveredDay.tokens.toLocaleString()} tokens ({hoveredDay.requests.toLocaleString()} requests)
            </div>
          )}
        </article>

        {/* Model Distribution Breakdown */}
        <article className="sa-card sa-ai-models-card">
          <div className="sa-card-header">
            <h3>Model Consumption Share</h3>
          </div>

          <div className="sa-model-bars-list">
            {modelDistribution.map((m) => (
              <div key={m.name} className="sa-model-row">
                <div className="sa-model-info-row">
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span
                      className="sa-donut-legend-dot"
                      style={{ backgroundColor: m.color }}
                    />
                    <strong>{m.name}</strong>
                  </div>
                  <span>
                    {m.tokens} ({m.percent}%)
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

      {/* 4. Top Consuming Organizations Table */}
      <section className="sa-card sa-top-orgs-card">
        <div className="sa-card-header">
          <h3>Top Consuming Organizations</h3>
          <span className="sa-total-tag">Ranked by token volume</span>
        </div>

        <div className="sa-table-wrapper">
          <table className="sa-table">
            <thead>
              <tr>
                <th>Organization</th>
                <th>Plan Tier</th>
                <th>Total Requests</th>
                <th>Tokens Used</th>
                <th>Platform Share</th>
                <th>Quota Used</th>
                <th>Avg. Latency</th>
              </tr>
            </thead>
            <tbody>
              {topOrganizations.map((org) => (
                <tr key={org.name}>
                  <td>
                    <div className="sa-user-badge">
                      <div className="sa-org-avatar-icon blue" style={{ width: 28, height: 28 }}>
                        <Building2 size={15} />
                      </div>
                      <strong>{org.name}</strong>
                    </div>
                  </td>
                  <td>
                    <span
                      className={`sa-pill ${
                        org.plan.includes("Enterprise")
                          ? "sa-pill-purple"
                          : org.plan.includes("Business")
                          ? "sa-pill-warning"
                          : "sa-pill-info"
                      }`}
                    >
                      {org.plan}
                    </span>
                  </td>
                  <td>{org.requests.toLocaleString()}</td>
                  <td>
                    <strong>{org.tokens}</strong>
                  </td>
                  <td>{org.pctOfTotal}%</td>
                  <td style={{ width: 140 }}>
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
                      <span style={{ fontSize: 11, fontWeight: 600 }}>
                        {org.quotaUsed}%
                      </span>
                    </div>
                  </td>
                  <td style={{ color: "#10b981", fontWeight: 600 }}>
                    {org.avgLatency}
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

export default AIUsage;

