import { useState, useMemo } from "react";
import {
  Sliders,
  Sparkles,
  Bot,
  Zap,
  CheckCircle2,
  Clock,
  Server,
  ShieldCheck,
  RotateCcw,
  Plus,
  Key,
  X,
  ArrowUpRight,
  Search,
  Filter,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Download,
  LayoutGrid,
  Table as TableIcon,
  Eye,
  EyeOff,
  Edit,
  Save,
  Check,
} from "lucide-react";
import "./SuperAdminCommon.css";
import "./AIConfiguration.css";

const INITIAL_PROVIDERS = [
  {
    id: "gemini",
    name: "Google Gemini",
    type: "Cloud Hosted",
    models: ["gemini-2.0-flash", "gemini-1.5-pro", "gemini-1.5-flash"],
    defaultModel: "gemini-2.0-flash",
    apiKey: "AIzaSyD-7392_gemini_prod_key_live",
    isDefault: true,
    status: "Operational",
    latency: "18ms",
    temperature: 0.7,
    maxTokens: 8192,
    color: "#3b66ff",
    contextWindow: "1,000,000 tokens",
  },
  {
    id: "openai",
    name: "OpenAI",
    type: "Cloud Hosted",
    models: ["gpt-4o", "gpt-4o-mini", "o1-preview"],
    defaultModel: "gpt-4o",
    apiKey: "sk-proj-9482701_live_openai_key",
    isDefault: false,
    status: "Operational",
    latency: "34ms",
    temperature: 0.7,
    maxTokens: 4096,
    color: "#10b981",
    contextWindow: "128,000 tokens",
  },
  {
    id: "anthropic",
    name: "Anthropic Claude",
    type: "Cloud Hosted",
    models: ["claude-3-5-sonnet-20241022", "claude-3-5-haiku"],
    defaultModel: "claude-3-5-sonnet-20241022",
    apiKey: "sk-ant-api03-9938_anthropic_prod",
    isDefault: false,
    status: "Operational",
    latency: "42ms",
    temperature: 0.7,
    maxTokens: 8192,
    color: "#f59e0b",
    contextWindow: "200,000 tokens",
  },
  {
    id: "deepseek",
    name: "DeepSeek AI",
    type: "Cloud Hosted",
    models: ["deepseek-chat-v3", "deepseek-coder-v2.5"],
    defaultModel: "deepseek-chat-v3",
    apiKey: "sk-dsk-827419_deepseek_prod",
    isDefault: false,
    status: "Operational",
    latency: "28ms",
    temperature: 0.6,
    maxTokens: 8192,
    color: "#0284c7",
    contextWindow: "128,000 tokens",
  },
  {
    id: "local",
    name: "Self-Hosted / Local LLM (Ollama)",
    type: "Self-Hosted",
    models: ["llama3.3:70b", "deepseek-coder:33b", "mistral:7b"],
    defaultModel: "llama3.3:70b",
    apiKey: "http://localhost:11434/v1",
    isDefault: false,
    status: "Standby",
    latency: "12ms",
    temperature: 0.6,
    maxTokens: 4096,
    color: "#8b5cf6",
    contextWindow: "32,768 tokens",
  },
];

const TIER_QUOTAS = [
  {
    tier: "Free Plan",
    badge: "gray",
    monthlyTokens: "1,000 tokens / mo",
    rawTokens: 1000,
    allowedModels: "gemini-1.5-flash only",
    rateLimit: "15 RPM",
    streaming: "Standard Queue",
    costFactor: "$0.00",
  },
  {
    tier: "Pro Plan",
    badge: "blue",
    monthlyTokens: "50,000 tokens / mo",
    rawTokens: 50000,
    allowedModels: "gemini-2.0-flash, gpt-4o-mini",
    rateLimit: "60 RPM",
    streaming: "Priority Stream",
    costFactor: "$15.00 / mo",
  },
  {
    tier: "Business Plan",
    badge: "amber",
    monthlyTokens: "250,000 tokens / mo",
    rawTokens: 250000,
    allowedModels: "All Gemini, GPT-4o, Claude 3.5 Sonnet",
    rateLimit: "180 RPM",
    streaming: "Ultra-low latency priority",
    costFactor: "$49.00 / mo",
  },
  {
    tier: "Enterprise Plan",
    badge: "purple",
    monthlyTokens: "1,000,000+ tokens / mo",
    rawTokens: 1000000,
    allowedModels: "All models + Dedicated fine-tunes",
    rateLimit: "Unlimited RPM",
    streaming: "Dedicated isolated compute",
    costFactor: "Custom Billing",
  },
];

function AIConfiguration() {
  const [providers, setProviders] = useState(INITIAL_PROVIDERS);
  const [testingId, setTestingId] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showKeys, setShowKeys] = useState({});

  // View & Filter states
  const [viewMode, setViewMode] = useState("table"); // "table" | "grid"
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [density, setDensity] = useState("standard");
  const [tierDensity, setTierDensity] = useState("standard");
  const [tierSearch, setTierSearch] = useState("");

  const toggleShowKey = (id) => {
    setShowKeys((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleMakeDefault = (id) => {
    setProviders((prev) =>
      prev.map((p) => ({
        ...p,
        isDefault: p.id === id,
      }))
    );
  };

  const handleTestConnection = (id) => {
    setTestingId(id);
    setTimeout(() => {
      setTestingId(null);
      alert(`Connection verified for ${id.toUpperCase()}! Response latency: 22ms.`);
    }, 800);
  };

  const handleSaveAll = (e) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
  };

  // Filtered Providers
  const filteredProviders = useMemo(() => {
    return providers.filter((p) => {
      if (typeFilter !== "all" && p.type !== typeFilter) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.defaultModel.toLowerCase().includes(q) ||
        p.models.some((m) => m.toLowerCase().includes(q))
      );
    });
  }, [providers, typeFilter, searchQuery]);

  // Filtered Quotas
  const filteredQuotas = useMemo(() => {
    if (!tierSearch.trim()) return TIER_QUOTAS;
    const q = tierSearch.toLowerCase();
    return TIER_QUOTAS.filter(
      (t) =>
        t.tier.toLowerCase().includes(q) ||
        t.allowedModels.toLowerCase().includes(q) ||
        t.rateLimit.toLowerCase().includes(q)
    );
  }, [tierSearch]);

  return (
    <div className="sa-page-container sa-aiconfig-page">
      {/* 1. SAP Enterprise Header */}
      <section className="sap-header-panel">
        <div className="sa-page-header-left">
          <h1>AI Configuration &amp; Models</h1>
          <p>Configure LLM endpoints, model routing, global API credentials, and tenant token quotas.</p>
        </div>

        <div className="sa-page-header-actions">
          <button
            type="button"
            className="sa-btn sa-btn-primary"
            onClick={handleSaveAll}
          >
            Save All Configurations
          </button>
        </div>
      </section>

      {/* 2. Top 4 KPI Stat Cards */}
      <section className="sap-kpi-grid">
        <article className="sa-kpi-card">
          <div className="sa-kpi-icon-box purple">
            <Bot size={24} strokeWidth={2.2} />
          </div>
          <div className="sa-kpi-body">
            <p className="sa-kpi-title">Active AI Engines</p>
            <div className="sa-kpi-val-row">
              <span className="sa-kpi-value">{providers.length} Providers</span>
              <span className="sa-kpi-trend positive">
                <CheckCircle2 size={14} /> Ready
              </span>
            </div>
            <span className="sa-kpi-subtitle">Gemini, OpenAI, Claude, DeepSeek, Local</span>
          </div>
        </article>

        <article className="sa-kpi-card">
          <div className="sa-kpi-icon-box blue">
            <Sparkles size={24} strokeWidth={2.2} />
          </div>
          <div className="sa-kpi-body">
            <p className="sa-kpi-title">Default Engine</p>
            <div className="sa-kpi-val-row">
              <span className="sa-kpi-value">
                {providers.find((p) => p.isDefault)?.name || "Gemini 2.0"}
              </span>
              <span className="sa-kpi-trend positive">Default</span>
            </div>
            <span className="sa-kpi-subtitle">Flash tier for low-latency tasks</span>
          </div>
        </article>

        <article className="sa-kpi-card">
          <div className="sa-kpi-icon-box green">
            <Zap size={24} strokeWidth={2.2} />
          </div>
          <div className="sa-kpi-body">
            <p className="sa-kpi-title">Avg. Response Time</p>
            <div className="sa-kpi-val-row">
              <span className="sa-kpi-value">1.2s</span>
              <span className="sa-kpi-trend positive">
                <ArrowUpRight size={14} /> 12% faster
              </span>
            </div>
            <span className="sa-kpi-subtitle">Direct streaming responses</span>
          </div>
        </article>

        <article className="sa-kpi-card">
          <div className="sa-kpi-icon-box amber">
            <Clock size={24} strokeWidth={2.2} />
          </div>
          <div className="sa-kpi-body">
            <p className="sa-kpi-title">Global Rate Limit</p>
            <div className="sa-kpi-val-row">
              <span className="sa-kpi-value">10,000 RPM</span>
              <span className="sa-kpi-trend positive">Optimal</span>
            </div>
            <span className="sa-kpi-subtitle">No throttled tenant calls</span>
          </div>
        </article>
      </section>

      {saveSuccess && (
        <div className="sa-toast-banner">
          <CheckCircle2 size={16} /> AI configurations & API key updates saved successfully!
        </div>
      )}

      {/* 3. Provider Directory - Enterprise SaaS Table Card */}
      <section className="sap-table-card" style={{ marginBottom: 24 }}>
        {/* Toolbar */}
        <div className="sap-toolbar">
          <div className="sap-search-input">
            <Search size={15} />
            <input
              type="text"
              placeholder="Search AI providers or models..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button type="button" onClick={() => setSearchQuery("")}>
                <X size={13} />
              </button>
            )}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div className="sap-filter-select">
              <Filter size={14} />
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="all">All Provider Types ({providers.length})</option>
                <option value="Cloud Hosted">Cloud Hosted</option>
                <option value="Self-Hosted">Self-Hosted</option>
              </select>
            </div>

            {/* View Switcher: Table vs Cards */}
            <div className="sa-view-switcher">
              <button
                type="button"
                className={`sa-view-btn ${viewMode === "table" ? "active" : ""}`}
                onClick={() => setViewMode("table")}
                title="Table Matrix View"
              >
                <TableIcon size={14} />
              </button>
              <button
                type="button"
                className={`sa-view-btn ${viewMode === "grid" ? "active" : ""}`}
                onClick={() => setViewMode("grid")}
                title="Cards Grid View"
              >
                <LayoutGrid size={14} />
              </button>
            </div>

            {viewMode === "table" && (
              <button
                type="button"
                className="sap-icon-btn"
                title={`Switch density (currently ${density})`}
                onClick={() =>
                  setDensity((prev) => (prev === "standard" ? "compact" : "standard"))
                }
              >
                <SlidersHorizontal size={15} />
              </button>
            )}
          </div>
        </div>

        {viewMode === "table" ? (
          <div className="sa-table-wrapper">
            <table className={`sap-grid is-${density}`}>
              <thead>
                <tr>
                  <th>Provider & Platform</th>
                  <th>Infrastructure Type</th>
                  <th>Default Model</th>
                  <th>Supported Models</th>
                  <th>API Endpoint / Key</th>
                  <th>Avg Latency</th>
                  <th>Context Window</th>
                  <th>Engine Status</th>
                  <th style={{ textAlign: "right" }}>Operation</th>
                </tr>
              </thead>
              <tbody>
                {filteredProviders.length === 0 ? (
                  <tr>
                    <td colSpan={9} style={{ textAlign: "center", padding: "36px 16px", color: "#64748b" }}>
                      No AI providers matched your filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredProviders.map((p) => (
                    <tr key={p.id}>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div
                            style={{
                              width: 32,
                              height: 32,
                              borderRadius: 6,
                              backgroundColor: `${p.color}15`,
                              color: p.color,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Bot size={16} />
                          </div>
                          <div>
                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                              <strong>{p.name}</strong>
                              {p.isDefault && (
                                <span className="sap-status-pill blue">
                                  Default
                                </span>
                              )}
                            </div>
                            <span style={{ fontSize: 11, color: "#64748b" }}>ID: {p.id}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="sap-role-badge">{p.type}</span>
                      </td>
                      <td>
                        <select
                          className="sap-filter-select"
                          style={{ fontSize: 12, padding: "3px 8px" }}
                          value={p.defaultModel}
                          onChange={(e) => {
                            const val = e.target.value;
                            setProviders((prev) =>
                              prev.map((prov) =>
                                prov.id === p.id ? { ...prov, defaultModel: val } : prov
                              )
                            );
                          }}
                        >
                          {p.models.map((m) => (
                            <option key={m} value={m}>
                              {m}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, maxWidth: 220 }}>
                          {p.models.map((m) => (
                            <span
                              key={m}
                              style={{
                                fontSize: 10.5,
                                padding: "2px 6px",
                                background: m === p.defaultModel ? "#e0f2fe" : "#f1f5f9",
                                color: m === p.defaultModel ? "#0369a1" : "#475569",
                                borderRadius: 4,
                                fontFamily: "monospace",
                              }}
                            >
                              {m}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <code className="sap-id-cell" style={{ maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis" }}>
                            {showKeys[p.id] ? p.apiKey : "••••••••••••••••"}
                          </code>
                          <button
                            type="button"
                            className="sap-icon-btn"
                            style={{ width: 24, height: 24 }}
                            onClick={() => toggleShowKey(p.id)}
                            title={showKeys[p.id] ? "Hide key" : "Reveal key"}
                          >
                            {showKeys[p.id] ? <EyeOff size={12} /> : <Eye size={12} />}
                          </button>
                        </div>
                      </td>
                      <td>
                        <code className="sap-id-cell">{p.latency}</code>
                      </td>
                      <td style={{ fontSize: 12, color: "#64748b" }}>{p.contextWindow}</td>
                      <td>
                        <span className={`sap-status-pill ${p.status === "Operational" ? "green" : "amber"}`}>
                          {p.status}
                        </span>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <div style={{ display: "inline-flex", gap: 6 }}>
                          {!p.isDefault ? (
                            <button
                              type="button"
                              className="sa-btn sa-btn-secondary sa-btn-sm"
                              onClick={() => handleMakeDefault(p.id)}
                            >
                              Set Default
                            </button>
                          ) : (
                            <span style={{ fontSize: 12, color: "#2563eb", fontWeight: 600, padding: "4px 8px" }}>
                              Active Default
                            </span>
                          )}
                          <button
                            type="button"
                            className="sa-btn sa-btn-secondary sa-btn-sm"
                            disabled={testingId === p.id}
                            onClick={() => handleTestConnection(p.id)}
                          >
                            {testingId === p.id ? "Pinging..." : "Test Ping"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="sa-providers-grid" style={{ padding: "16px" }}>
            {filteredProviders.map((p) => (
              <article key={p.id} className="sa-card sa-provider-card">
                <div className="sa-provider-header">
                  <div className="sa-provider-title-group">
                    <div
                      className="sa-provider-icon-badge"
                      style={{ backgroundColor: `${p.color}15`, color: p.color }}
                    >
                      <Bot size={20} />
                    </div>
                    <div>
                      <h3 className="sa-provider-name">{p.name}</h3>
                      <span className="sa-provider-status">
                        <span
                          className="sa-health-dot"
                          style={{
                            backgroundColor:
                              p.status === "Operational" ? "#10b981" : "#f59e0b",
                          }}
                        />
                        {p.status} ({p.latency})
                      </span>
                    </div>
                  </div>

                  {p.isDefault ? (
                    <span className="sa-pill sa-pill-success">Default Provider</span>
                  ) : (
                    <button
                      type="button"
                      className="sa-btn sa-btn-secondary sa-btn-sm"
                      onClick={() => handleMakeDefault(p.id)}
                    >
                      Set as Default
                    </button>
                  )}
                </div>

                <div className="sa-provider-body">
                  <div className="sa-form-group">
                    <label>API Key / Host Endpoint</label>
                    <div className="sa-api-input-wrap">
                      <Key size={14} className="sa-key-icon" />
                      <input
                        type="password"
                        className="sa-form-input sa-key-input"
                        value={p.apiKey}
                        onChange={(e) => {
                          const val = e.target.value;
                          setProviders((prev) =>
                            prev.map((prov) =>
                              prov.id === p.id ? { ...prov, apiKey: val } : prov
                            )
                          );
                        }}
                      />
                    </div>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "12px",
                    }}
                  >
                    <div className="sa-form-group">
                      <label>Default Model</label>
                      <select
                        className="sa-form-select"
                        value={p.defaultModel}
                        onChange={(e) => {
                          const val = e.target.value;
                          setProviders((prev) =>
                            prev.map((prov) =>
                              prov.id === p.id ? { ...prov, defaultModel: val } : prov
                            )
                          );
                        }}
                      >
                        {p.models.map((m) => (
                          <option key={m} value={m}>
                            {m}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="sa-form-group">
                      <label>Temperature ({p.temperature})</label>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={p.temperature}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setProviders((prev) =>
                            prev.map((prov) =>
                              prov.id === p.id ? { ...prov, temperature: val } : prov
                            )
                          );
                        }}
                        style={{ width: "100%", marginTop: "8px" }}
                      />
                    </div>
                  </div>
                </div>

                <div className="sa-provider-footer">
                  <button
                    type="button"
                    className="sa-btn sa-btn-secondary sa-btn-sm"
                    onClick={() => handleTestConnection(p.id)}
                    disabled={testingId === p.id}
                  >
                    {testingId === p.id ? "Pinging..." : "Test Connection"}
                  </button>
                  <span style={{ fontSize: 11, color: "#64748b" }}>
                    Max context: {p.maxTokens.toLocaleString()} tokens
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="sap-footer-bar">
          <span style={{ fontSize: 12.5, color: "#64748b" }}>
            Total <strong>{filteredProviders.length}</strong> configured LLM providers · All operational
          </span>
          <span style={{ fontSize: 12, color: "#94a3b8" }}>
            Failover Policy: Automatic switchover to secondary provider on 5xx status
          </span>
        </div>
      </section>

      {/* 4. Token Allocation by Plan Tier - Enterprise SaaS Table Card */}
      <section className="sap-table-card">
        {/* Toolbar */}
        <div className="sap-toolbar">
          <div className="sap-search-input">
            <Search size={15} />
            <input
              type="text"
              placeholder="Search subscription tier quotas or allowed models..."
              value={tierSearch}
              onChange={(e) => setTierSearch(e.target.value)}
            />
            {tierSearch && (
              <button type="button" onClick={() => setTierSearch("")}>
                <X size={13} />
              </button>
            )}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button
              type="button"
              className="sap-icon-btn"
              title={`Switch density (currently ${tierDensity})`}
              onClick={() =>
                setTierDensity((prev) => (prev === "standard" ? "compact" : "standard"))
              }
            >
              <SlidersHorizontal size={15} />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="sa-table-wrapper">
          <table className={`sap-grid is-${tierDensity}`}>
            <thead>
              <tr>
                <th>Subscription Tier</th>
                <th>Monthly Token Quota</th>
                <th>Allowed Model Suite</th>
                <th>Rate Limit (RPM)</th>
                <th>Inference Queue Priority</th>
                <th>Add-On Pricing Factor</th>
              </tr>
            </thead>
            <tbody>
              {filteredQuotas.map((t) => (
                <tr key={t.tier}>
                  <td>
                    <span className={`sap-status-pill ${t.badge}`}>
                      {t.tier}
                    </span>
                  </td>
                  <td>
                    <strong style={{ color: "var(--sa-text-main, #1e293b)" }}>{t.monthlyTokens}</strong>
                  </td>
                  <td>
                    <span className="sap-role-badge">{t.allowedModels}</span>
                  </td>
                  <td>
                    <code className="sap-id-cell">{t.rateLimit}</code>
                  </td>
                  <td>
                    <span style={{ fontSize: 12, color: "var(--sa-text-secondary, #475569)" }}>{t.streaming}</span>
                  </td>
                  <td>
                    <span style={{ fontSize: 12.5, fontWeight: 600, color: "#0f766e" }}>
                      {t.costFactor}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="sap-footer-bar">
          <span style={{ fontSize: 12.5, color: "#64748b" }}>
            Showing 4 subscription tiers · Token counter resets on billing cycle renewal date
          </span>
        </div>
      </section>
    </div>
  );
}

export default AIConfiguration;
