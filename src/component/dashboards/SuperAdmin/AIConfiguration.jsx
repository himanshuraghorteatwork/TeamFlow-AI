import { useState } from "react";
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
} from "lucide-react";
import "./SuperAdminCommon.css";
import "./AIConfiguration.css";

const INITIAL_PROVIDERS = [
  {
    id: "gemini",
    name: "Google Gemini",
    models: ["gemini-2.0-flash", "gemini-1.5-pro", "gemini-1.5-flash"],
    defaultModel: "gemini-2.0-flash",
    apiKey: "AIzaSyD-7392_gemini_prod_key_live",
    isDefault: true,
    status: "Operational",
    latency: "18ms",
    temperature: 0.7,
    maxTokens: 8192,
    color: "#3b66ff",
  },
  {
    id: "openai",
    name: "OpenAI",
    models: ["gpt-4o", "gpt-4o-mini", "o1-preview"],
    defaultModel: "gpt-4o",
    apiKey: "sk-proj-9482701_live_openai_key",
    isDefault: false,
    status: "Operational",
    latency: "34ms",
    temperature: 0.7,
    maxTokens: 4096,
    color: "#10b981",
  },
  {
    id: "anthropic",
    name: "Anthropic Claude",
    models: ["claude-3-5-sonnet-20241022", "claude-3-5-haiku"],
    defaultModel: "claude-3-5-sonnet-20241022",
    apiKey: "sk-ant-api03-9938_anthropic_prod",
    isDefault: false,
    status: "Operational",
    latency: "42ms",
    temperature: 0.7,
    maxTokens: 8192,
    color: "#f59e0b",
  },
  {
    id: "local",
    name: "Self-Hosted / Local LLM (Ollama)",
    models: ["llama3.3:70b", "deepseek-coder:33b", "mistral:7b"],
    defaultModel: "llama3.3:70b",
    apiKey: "http://localhost:11434/v1",
    isDefault: false,
    status: "Standby",
    latency: "12ms",
    temperature: 0.6,
    maxTokens: 4096,
    color: "#8b5cf6",
  },
];

function AIConfiguration() {
  const [providers, setProviders] = useState(INITIAL_PROVIDERS);
  const [testingId, setTestingId] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

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
    }, 900);
  };

  const handleSaveAll = (e) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
  };

  return (
    <div className="sa-page-container sa-aiconfig-page">
      {/* 1. Page Header */}
      <section className="sa-page-header">
        <div className="sa-page-header-left">
          <h1>AI Configuration & Models</h1>
          <p>Configure LLM endpoints, model routing, global API credentials, and token quotas.</p>
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
      <section className="sa-kpi-grid">
        <article className="sa-kpi-card">
          <div className="sa-kpi-icon-box purple">
            <Bot size={24} strokeWidth={2.2} />
          </div>
          <div className="sa-kpi-body">
            <p className="sa-kpi-title">Active Providers</p>
            <div className="sa-kpi-val-row">
              <span className="sa-kpi-value">4 Providers</span>
              <span className="sa-kpi-trend positive">
                <CheckCircle2 size={14} /> Ready
              </span>
            </div>
            <span className="sa-kpi-subtitle">Gemini, OpenAI, Claude, Local</span>
          </div>
        </article>

        <article className="sa-kpi-card">
          <div className="sa-kpi-icon-box blue">
            <Sparkles size={24} strokeWidth={2.2} />
          </div>
          <div className="sa-kpi-body">
            <p className="sa-kpi-title">Default Engine</p>
            <div className="sa-kpi-val-row">
              <span className="sa-kpi-value">Gemini 2.0</span>
              <span className="sa-kpi-trend positive">
                Default
              </span>
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
              <span className="sa-kpi-trend positive">
                Optimal
              </span>
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

      {/* 3. Provider Cards */}
      <section className="sa-providers-grid">
        {providers.map((p) => (
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
      </section>

      {/* 4. Token Allocation by Plan Tier */}
      <section className="sa-card sa-tier-quotas-card">
        <div className="sa-card-header">
          <h3>Tenant Quota Allocations by Subscription Tier</h3>
        </div>

        <div className="sa-table-wrapper">
          <table className="sa-table">
            <thead>
              <tr>
                <th>Tier</th>
                <th>Monthly Token Quota</th>
                <th>Allowed Models</th>
                <th>Rate Limit (RPM)</th>
                <th>Priority Streaming</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <span className="sa-pill sa-pill-neutral">Free Plan</span>
                </td>
                <td>1,000 tokens / mo</td>
                <td>gemini-1.5-flash only</td>
                <td>15 RPM</td>
                <td>Standard Queue</td>
              </tr>
              <tr>
                <td>
                  <span className="sa-pill sa-pill-info">Pro Plan</span>
                </td>
                <td>50,000 tokens / mo</td>
                <td>gemini-2.0-flash, gpt-4o-mini</td>
                <td>60 RPM</td>
                <td>Priority Stream</td>
              </tr>
              <tr>
                <td>
                  <span className="sa-pill sa-pill-warning">Business Plan</span>
                </td>
                <td>250,000 tokens / mo</td>
                <td>All Gemini, GPT-4o, Claude 3.5 Sonnet</td>
                <td>180 RPM</td>
                <td>Ultra-low latency priority</td>
              </tr>
              <tr>
                <td>
                  <span className="sa-pill sa-pill-purple">Enterprise Plan</span>
                </td>
                <td>1,000,000+ tokens / mo</td>
                <td>All models + Dedicated fine-tunes</td>
                <td>Unlimited</td>
                <td>Dedicated compute instance</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default AIConfiguration;

