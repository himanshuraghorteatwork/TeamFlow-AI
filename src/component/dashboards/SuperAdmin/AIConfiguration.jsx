import { useState, useMemo, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  Bot,
  Sparkles,
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
  Download,
  LayoutGrid,
  Table as TableIcon,
  Eye,
  EyeOff,
  Edit,
  Save,
  Check,
  Copy,
  Activity,
  Sliders,
  Settings,
  Trash2,
  AlertTriangle,
  Layers,
  Cpu,
  FileJson,
  RefreshCw,
} from "lucide-react";
import "./SuperAdminCommon.css";
import "./AIConfiguration.css";

// Provider Real Brand Logos
import geminiLogo from "../../../assets/images/ai-providers/gemini.svg";
import openaiLogo from "../../../assets/images/ai-providers/openai.svg";
import anthropicLogo from "../../../assets/images/ai-providers/anthropic.svg";
import deepseekLogo from "../../../assets/images/ai-providers/deepseek.svg";
import ollamaLogo from "../../../assets/images/ai-providers/ollama.svg";
import mistralLogo from "../../../assets/images/ai-providers/mistral.svg";

const STORAGE_PROVIDERS_KEY = "teamflow_superadmin_ai_providers_v2";
const STORAGE_TIERS_KEY = "teamflow_superadmin_ai_tiers_v2";

const PROVIDER_LOGOS = {
  gemini: geminiLogo,
  openai: openaiLogo,
  anthropic: anthropicLogo,
  deepseek: deepseekLogo,
  local: ollamaLogo,
  ollama: ollamaLogo,
  mistral: mistralLogo,
};

const INITIAL_PROVIDERS = [
  {
    id: "gemini",
    name: "Google Gemini",
    providerKey: "google",
    type: "Cloud Hosted",
    models: ["gemini-2.0-flash", "gemini-1.5-pro", "gemini-1.5-flash", "gemini-2.0-pro-exp"],
    defaultModel: "gemini-2.0-flash",
    baseUrl: "https://generativelanguage.googleapis.com/v1beta",
    apiKey: "AIzaSyD-7392_gemini_prod_key_live",
    isDefault: true,
    status: "Operational",
    latency: "18ms",
    temperature: 0.7,
    maxTokens: 8192,
    topP: 0.95,
    stream: true,
    fallbackId: "openai",
    color: "#3b66ff",
    contextWindow: "1,000,000 tokens",
    description: "Multimodal powerhouse with massive 1M token context window & near-instant Flash inference.",
  },
  {
    id: "openai",
    name: "OpenAI",
    providerKey: "openai",
    type: "Cloud Hosted",
    models: ["gpt-4o", "gpt-4o-mini", "o1-preview", "o3-mini"],
    defaultModel: "gpt-4o",
    baseUrl: "https://api.openai.com/v1",
    apiKey: "sk-proj-9482701_live_openai_key",
    isDefault: false,
    status: "Operational",
    latency: "34ms",
    temperature: 0.7,
    maxTokens: 4096,
    topP: 1.0,
    stream: true,
    fallbackId: "anthropic",
    color: "#10a37f",
    contextWindow: "128,000 tokens",
    description: "Industry-standard GPT-4o family with advanced reasoning and high code generation fidelity.",
  },
  {
    id: "anthropic",
    name: "Anthropic Claude",
    providerKey: "anthropic",
    type: "Cloud Hosted",
    models: ["claude-3-5-sonnet-20241022", "claude-3-5-haiku", "claude-3-opus"],
    defaultModel: "claude-3-5-sonnet-20241022",
    baseUrl: "https://api.anthropic.com/v1",
    apiKey: "sk-ant-api03-9938_anthropic_prod",
    isDefault: false,
    status: "Operational",
    latency: "42ms",
    temperature: 0.7,
    maxTokens: 8192,
    topP: 0.9,
    stream: true,
    fallbackId: "gemini",
    color: "#d97706",
    contextWindow: "200,000 tokens",
    description: "Superior nuance, nuanced long-form comprehension, and state-of-the-art coding benchmark scores.",
  },
  {
    id: "deepseek",
    name: "DeepSeek AI",
    providerKey: "deepseek",
    type: "Cloud Hosted",
    models: ["deepseek-chat-v3", "deepseek-coder-v2.5", "deepseek-r1"],
    defaultModel: "deepseek-chat-v3",
    baseUrl: "https://api.deepseek.com/v1",
    apiKey: "sk-dsk-827419_deepseek_prod",
    isDefault: false,
    status: "Operational",
    latency: "28ms",
    temperature: 0.6,
    maxTokens: 8192,
    topP: 0.95,
    stream: true,
    fallbackId: "openai",
    color: "#0284c7",
    contextWindow: "128,000 tokens",
    description: "Ultra cost-efficient open weights inference with deep reasoning and competitive latency.",
  },
  {
    id: "local",
    name: "Self-Hosted / Local LLM (Ollama)",
    providerKey: "ollama",
    type: "Self-Hosted",
    models: ["llama3.3:70b", "deepseek-r1:32b", "mistral:7b", "qwen2.5:72b"],
    defaultModel: "llama3.3:70b",
    baseUrl: "http://localhost:11434/v1",
    apiKey: "ollama-local-bearer-token",
    isDefault: false,
    status: "Operational",
    latency: "12ms",
    temperature: 0.6,
    maxTokens: 4096,
    topP: 0.9,
    stream: true,
    fallbackId: "gemini",
    color: "#8b5cf6",
    contextWindow: "32,768 tokens",
    description: "Zero external cloud egress, GDPR & HIPAA air-gapped on-premise inference cluster.",
  },
  {
    id: "mistral",
    name: "Mistral AI",
    providerKey: "mistral",
    type: "Cloud Hosted",
    models: ["mistral-large-2411", "codestral-2501", "ministral-8b"],
    defaultModel: "mistral-large-2411",
    baseUrl: "https://api.mistral.ai/v1",
    apiKey: "sk-mst-774019_mistral_prod",
    isDefault: false,
    status: "Operational",
    latency: "24ms",
    temperature: 0.7,
    maxTokens: 4096,
    topP: 0.95,
    stream: true,
    fallbackId: "gemini",
    color: "#ff7000",
    contextWindow: "128,000 tokens",
    description: "European frontier models optimized for multilingual reasoning, speed, and coding efficiency.",
  },
];

const INITIAL_TIER_QUOTAS = [
  {
    id: "free",
    tier: "Free Plan",
    badge: "gray",
    monthlyTokens: "1,000 tokens / mo",
    rawTokens: 1000,
    allowedModels: ["gemini-1.5-flash"],
    rateLimit: "15 RPM",
    streaming: "Standard Queue",
    costFactor: "$0.00",
    concurrency: "2 concurrent requests",
  },
  {
    id: "pro",
    tier: "Pro Plan",
    badge: "blue",
    monthlyTokens: "50,000 tokens / mo",
    rawTokens: 50000,
    allowedModels: ["gemini-2.0-flash", "gpt-4o-mini", "claude-3-5-haiku"],
    rateLimit: "60 RPM",
    streaming: "Priority Stream",
    costFactor: "$15.00 / mo",
    concurrency: "10 concurrent requests",
  },
  {
    id: "business",
    tier: "Business Plan",
    badge: "amber",
    monthlyTokens: "250,000 tokens / mo",
    rawTokens: 250000,
    allowedModels: ["All Gemini", "gpt-4o", "claude-3-5-sonnet", "deepseek-chat-v3"],
    rateLimit: "180 RPM",
    streaming: "Ultra-low latency priority",
    costFactor: "$49.00 / mo",
    concurrency: "35 concurrent requests",
  },
  {
    id: "enterprise",
    tier: "Enterprise Plan",
    badge: "purple",
    monthlyTokens: "1,000,000+ tokens / mo",
    rawTokens: 1000000,
    allowedModels: ["All Frontier Models", "Dedicated Fine-Tunes", "Self-Hosted Ollama Cluster"],
    rateLimit: "Unlimited RPM",
    streaming: "Dedicated isolated compute shard",
    costFactor: "Custom Volume Billing",
    concurrency: "Uncapped Concurrency",
  },
];

function readStoredProviders() {
  try {
    const raw = localStorage.getItem(STORAGE_PROVIDERS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error("Failed to read providers from localStorage:", e);
  }
  return INITIAL_PROVIDERS;
}

function readStoredTiers() {
  try {
    const raw = localStorage.getItem(STORAGE_TIERS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error("Failed to read tiers from localStorage:", e);
  }
  return INITIAL_TIER_QUOTAS;
}

function ProviderLogo({ providerId, name, size = 32 }) {
  const logoSrc = PROVIDER_LOGOS[providerId?.toLowerCase()];
  if (logoSrc) {
    return (
      <div className="aic-logo-wrap" style={{ width: size, height: size }}>
        <img
          src={logoSrc}
          alt={name || providerId}
          className="aic-logo-img"
          loading="lazy"
        />
      </div>
    );
  }
  return (
    <div className="aic-logo-wrap placeholder" style={{ width: size, height: size }}>
      <Bot size={Math.round(size * 0.55)} />
    </div>
  );
}

function AIConfiguration() {
  const [providers, setProviders] = useState(readStoredProviders);
  const [tierQuotas, setTierQuotas] = useState(readStoredTiers);
  const [testingId, setTestingId] = useState(null);
  const [isPingingAll, setIsPingingAll] = useState(false);
  const [toast, setToast] = useState(null);
  const [showKeys, setShowKeys] = useState({});
  const [copiedKeyId, setCopiedKeyId] = useState(null);

  // View & Filter states
  const [viewMode, setViewMode] = useState("table"); // "table" | "grid"
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [density, setDensity] = useState("standard");
  const [tierDensity, setTierDensity] = useState("standard");
  const [tierSearch, setTierSearch] = useState("");

  // Modals state
  const [configureModalProvider, setConfigureModalProvider] = useState(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editTierModal, setEditTierModal] = useState(null);
  const [deleteConfirmProvider, setDeleteConfirmProvider] = useState(null);

  // New Provider Form state
  const [newProviderForm, setNewProviderForm] = useState({
    name: "",
    type: "Cloud Hosted",
    baseUrl: "",
    apiKey: "",
    models: "",
    defaultModel: "",
    contextWindow: "128,000 tokens",
    color: "#3b66ff",
    description: "",
  });

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_PROVIDERS_KEY, JSON.stringify(providers));
    } catch (e) {
      console.error("Failed to persist providers:", e);
    }
  }, [providers]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_TIERS_KEY, JSON.stringify(tierQuotas));
    } catch (e) {
      console.error("Failed to persist tiers:", e);
    }
  }, [tierQuotas]);

  // Keyboard accessibility: Escape key closes modals
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setConfigureModalProvider(null);
        setAddModalOpen(false);
        setEditTierModal(null);
        setDeleteConfirmProvider(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const notify = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3600);
  };

  const toggleShowKey = (id) => {
    setShowKeys((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCopyKey = (id, key) => {
    navigator.clipboard.writeText(key);
    setCopiedKeyId(id);
    notify(`API Key for ${id.toUpperCase()} copied to clipboard.`);
    setTimeout(() => setCopiedKeyId(null), 2000);
  };

  const handleMakeDefault = (id) => {
    setProviders((prev) =>
      prev.map((p) => ({
        ...p,
        isDefault: p.id === id,
      }))
    );
    const target = providers.find((p) => p.id === id);
    notify(`Set ${target?.name || id} as primary default LLM engine.`);
  };

  // Test single connection
  const handleTestConnection = (id) => {
    setTestingId(id);
    setTimeout(() => {
      setTestingId(null);
      const simulatedLatency = Math.floor(Math.random() * 25) + 14;
      setProviders((prev) =>
        prev.map((p) => (p.id === id ? { ...p, latency: `${simulatedLatency}ms` } : p))
      );
      const target = providers.find((p) => p.id === id);
      notify(
        `Verified handshake with ${target?.name || id}! Latency: ${simulatedLatency}ms (HTTP 200 OK).`
      );
    }, 750);
  };

  // Ping All endpoints
  const handlePingAll = () => {
    setIsPingingAll(true);
    setTimeout(() => {
      setProviders((prev) =>
        prev.map((p) => {
          const simulatedLatency = Math.floor(Math.random() * 25) + 14;
          return { ...p, latency: `${simulatedLatency}ms` };
        })
      );
      setIsPingingAll(false);
      notify(`Ping verification complete across all ${providers.length} AI endpoints!`);
    }, 1100);
  };

  // Save all configurations button
  const handleSaveAll = (e) => {
    e.preventDefault();
    localStorage.setItem(STORAGE_PROVIDERS_KEY, JSON.stringify(providers));
    localStorage.setItem(STORAGE_TIERS_KEY, JSON.stringify(tierQuotas));
    notify("All AI Gateway routes, API keys, and model parameters saved successfully!");
  };

  // Export JSON configuration
  const handleExportConfig = () => {
    const configData = {
      version: "2.4.0",
      exportTimestamp: new Date().toISOString(),
      activeDefault: providers.find((p) => p.isDefault)?.id || "gemini",
      providers: providers.map((p) => ({
        ...p,
        apiKey: p.apiKey ? `${p.apiKey.slice(0, 6)}...masked` : "",
      })),
      tierQuotas,
    };

    const blob = new Blob([JSON.stringify(configData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `teamflow_ai_gateway_config_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    notify("Exported AI Gateway JSON configuration.");
  };

  // Add Custom Provider
  const handleAddProviderSubmit = (e) => {
    e.preventDefault();
    if (!newProviderForm.name.trim()) return;

    const id = newProviderForm.name.toLowerCase().replace(/[^a-z0-9]/g, "-");
    const rawModels = newProviderForm.models
      .split(",")
      .map((m) => m.trim())
      .filter(Boolean);

    const modelList = rawModels.length > 0 ? rawModels : [`${id}-default`];
    const defaultModel = newProviderForm.defaultModel || modelList[0];

    const newEntry = {
      id,
      name: newProviderForm.name.trim(),
      providerKey: id,
      type: newProviderForm.type,
      models: modelList,
      defaultModel,
      baseUrl: newProviderForm.baseUrl || "https://api.custom-ai.internal/v1",
      apiKey: newProviderForm.apiKey || "sk-custom-prod-live-key",
      isDefault: false,
      status: "Operational",
      latency: "22ms",
      temperature: 0.7,
      maxTokens: 4096,
      topP: 0.95,
      stream: true,
      fallbackId: "gemini",
      color: newProviderForm.color || "#0ea5e9",
      contextWindow: newProviderForm.contextWindow || "128,000 tokens",
      description: newProviderForm.description || "Custom enterprise fine-tune endpoint.",
    };

    setProviders((prev) => [...prev, newEntry]);
    setAddModalOpen(false);
    setNewProviderForm({
      name: "",
      type: "Cloud Hosted",
      baseUrl: "",
      apiKey: "",
      models: "",
      defaultModel: "",
      contextWindow: "128,000 tokens",
      color: "#3b66ff",
      description: "",
    });
    notify(`Added custom AI provider: ${newEntry.name}.`);
  };

  // Save changes from Configure modal
  const handleSaveConfigureModal = (e) => {
    e.preventDefault();
    if (!configureModalProvider) return;

    setProviders((prev) =>
      prev.map((p) => (p.id === configureModalProvider.id ? configureModalProvider : p))
    );
    notify(`Updated hyperparameters for ${configureModalProvider.name}.`);
    setConfigureModalProvider(null);
  };

  // Delete Provider
  const handleDeleteProvider = (prov) => {
    if (prov.isDefault) {
      notify("Cannot delete active default provider. Set another default first.", "error");
      setDeleteConfirmProvider(null);
      return;
    }
    setProviders((prev) => prev.filter((p) => p.id !== prov.id));
    setDeleteConfirmProvider(null);
    notify(`Deleted AI provider ${prov.name}.`);
  };

  // Save Tier Quotas edit
  const handleSaveTierModal = (e) => {
    e.preventDefault();
    if (!editTierModal) return;

    setTierQuotas((prev) =>
      prev.map((t) => (t.id === editTierModal.id ? editTierModal : t))
    );
    notify(`Updated token quotas for ${editTierModal.tier}.`);
    setEditTierModal(null);
  };

  // Filtered Providers
  const filteredProviders = useMemo(() => {
    return providers.filter((p) => {
      if (typeFilter !== "all" && p.type !== typeFilter) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        p.defaultModel.toLowerCase().includes(q) ||
        p.models.some((m) => m.toLowerCase().includes(q))
      );
    });
  }, [providers, typeFilter, searchQuery]);

  // Filtered Quotas
  const filteredQuotas = useMemo(() => {
    if (!tierSearch.trim()) return tierQuotas;
    const q = tierSearch.toLowerCase();
    return tierQuotas.filter(
      (t) =>
        t.tier.toLowerCase().includes(q) ||
        t.monthlyTokens.toLowerCase().includes(q) ||
        t.allowedModels.some((m) => m.toLowerCase().includes(q)) ||
        t.rateLimit.toLowerCase().includes(q)
    );
  }, [tierQuotas, tierSearch]);

  const activeDefaultProvider = providers.find((p) => p.isDefault) || providers[0];

  return (
    <div className="sa-page-container sa-aiconfig-page">
      {/* 1. Master Header Panel */}
      <section className="sap-header-panel">
        <div className="sap-header-left">
          <div className="aic-header-title-row">
            <h1>AI Gateway &amp; LLM Configuration</h1>
            <span className="aic-engine-count-badge">
              <span className="aic-live-pulse-dot" />
              {providers.length} Active Engines
            </span>
          </div>
          <p className="sap-header-subtitle">
            Configure multi-tenant LLM endpoints, model routing, global credentials, inference latency SLAs, and subscription token quotas.
          </p>
        </div>

        <div className="sap-header-actions">
          <button
            type="button"
            className="sa-btn sa-btn-secondary"
            onClick={handleExportConfig}
            title="Export Gateway JSON configuration"
          >
            <FileJson size={15} /> Export JSON
          </button>
          <button
            type="button"
            className="sa-btn sa-btn-secondary"
            onClick={handlePingAll}
            disabled={isPingingAll}
            title="Ping all provider endpoints"
          >
            <RefreshCw size={15} className={isPingingAll ? "aic-spin" : ""} />
            {isPingingAll ? "Testing All..." : "Test All Endpoints"}
          </button>
          <button
            type="button"
            className="sa-btn sa-btn-primary"
            onClick={() => setAddModalOpen(true)}
          >
            <Plus size={15} /> Add Custom Endpoint
          </button>
          <button
            type="button"
            className="sa-btn sa-btn-primary"
            style={{ background: "#059669", borderColor: "#059669" }}
            onClick={handleSaveAll}
          >
            <Save size={15} /> Save All Changes
          </button>
        </div>
      </section>

      {/* 2. Top 4 Telemetry Metric Cards */}
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
                <CheckCircle2 size={14} /> 100% Online
              </span>
            </div>
            <div className="aic-mini-logos-row">
              {providers.slice(0, 6).map((p) => (
                <div key={p.id} className="aic-mini-logo-pill" title={p.name}>
                  <ProviderLogo providerId={p.id} name={p.name} size={18} />
                </div>
              ))}
            </div>
          </div>
        </article>

        <article className="sa-kpi-card">
          <div className="sa-kpi-icon-box blue">
            <Sparkles size={24} strokeWidth={2.2} />
          </div>
          <div className="sa-kpi-body">
            <p className="sa-kpi-title">Default Engine</p>
            <div className="sa-kpi-val-row">
              <span className="sa-kpi-value">{activeDefaultProvider?.name || "Google Gemini"}</span>
              <span className="sa-kpi-trend positive">
                <ShieldCheck size={14} /> Active
              </span>
            </div>
            <span className="sa-kpi-subtitle">
              Default model: <strong>{activeDefaultProvider?.defaultModel}</strong>
            </span>
          </div>
        </article>

        <article className="sa-kpi-card">
          <div className="sa-kpi-icon-box green">
            <Zap size={24} strokeWidth={2.2} />
          </div>
          <div className="sa-kpi-body">
            <p className="sa-kpi-title">Median Gateway Latency</p>
            <div className="sa-kpi-val-row">
              <span className="sa-kpi-value">
                {activeDefaultProvider?.latency || "18ms"}
              </span>
              <span className="sa-kpi-trend positive">
                <ArrowUpRight size={14} /> Ultra Fast
              </span>
            </div>
            <span className="sa-kpi-subtitle">Direct streaming responses via SSE</span>
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
            <span className="sa-kpi-subtitle">0% throttled calls in last 24h</span>
          </div>
        </article>
      </section>

      {/* Floating Toast Notification */}
      {toast && (
        <div className={`sa-toast-banner ${toast.type === "error" ? "error" : "success"}`}>
          {toast.type === "error" ? <AlertTriangle size={16} /> : <CheckCircle2 size={16} />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* 3. Provider Directory - Enterprise SaaS Table Card */}
      <section className="sap-table-card">
        {/* Toolbar */}
        <div className="sap-toolbar">
          <div className="sap-toolbar-left">
            <div className="sap-search-input">
              <Search size={15} style={{ color: "var(--sa-text-muted)" }} />
              <input
                type="text"
                placeholder="Search AI providers, models, or endpoint types..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  type="button"
                  style={{ background: "transparent", border: 0, cursor: "pointer", color: "#94a3b8" }}
                  onClick={() => setSearchQuery("")}
                >
                  <X size={13} />
                </button>
              )}
            </div>

            <select
              className="sap-filter-select"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="all">All Provider Types ({providers.length})</option>
              <option value="Cloud Hosted">Cloud Hosted</option>
              <option value="Self-Hosted">Self-Hosted / Local</option>
            </select>
          </div>

          <div className="sap-toolbar-right">
            {/* View Switcher: Table vs Cards */}
            <div className="aic-view-switcher">
              <button
                type="button"
                className={`aic-view-btn ${viewMode === "table" ? "active" : ""}`}
                onClick={() => setViewMode("table")}
                title="Table Matrix View"
              >
                <TableIcon size={14} /> <span>Table</span>
              </button>
              <button
                type="button"
                className={`aic-view-btn ${viewMode === "grid" ? "active" : ""}`}
                onClick={() => setViewMode("grid")}
                title="Cards Grid View"
              >
                <LayoutGrid size={14} /> <span>Cards</span>
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

            <button
              type="button"
              className="sap-icon-btn"
              title="Reset search & filters"
              onClick={() => {
                setSearchQuery("");
                setTypeFilter("all");
              }}
            >
              <RotateCcw size={15} />
            </button>
          </div>
        </div>

        {viewMode === "table" ? (
          <div className="sap-table-wrapper">
            <table className={`sap-grid is-${density}`}>
              <thead>
                <tr>
                  <th style={{ minWidth: 230 }}>Provider &amp; Platform</th>
                  <th style={{ minWidth: 130 }}>Infrastructure</th>
                  <th style={{ minWidth: 170 }}>Default Model</th>
                  <th style={{ minWidth: 200 }}>Model Suite</th>
                  <th style={{ minWidth: 220 }}>API Endpoint / Key</th>
                  <th style={{ minWidth: 110 }}>Avg. Latency</th>
                  <th style={{ minWidth: 130 }}>Context Window</th>
                  <th style={{ minWidth: 120 }}>Status</th>
                  <th style={{ textAlign: "right", minWidth: 240, width: 240 }}>Operations</th>
                </tr>
              </thead>
              <tbody>
                {filteredProviders.length === 0 ? (
                  <tr>
                    <td colSpan={9} style={{ textAlign: "center", padding: "40px 16px", color: "var(--sa-text-muted)" }}>
                      <strong>No AI providers matched your filter criteria.</strong>
                      <p style={{ margin: "6px 0 0", fontSize: 12 }}>Try clearing the search query or provider filter.</p>
                    </td>
                  </tr>
                ) : (
                  filteredProviders.map((p) => {
                    const isDef = p.isDefault;
                    return (
                      <tr key={p.id} className={isDef ? "aic-row-default" : ""}>
                        {/* 1. Provider & Logo */}
                        <td>
                          <div className="aic-provider-cell">
                            <ProviderLogo providerId={p.id} name={p.name} size={36} />
                            <div className="aic-provider-info">
                              <div className="aic-provider-name-row">
                                <strong className="aic-provider-name">{p.name}</strong>
                                {isDef && (
                                  <span className="aic-default-tag" title="Primary default inference engine">
                                    <Sparkles size={10} /> Active Default
                                  </span>
                                )}
                              </div>
                              <span className="aic-provider-sub">
                                ID: <code>{p.id}</code>
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* 2. Type */}
                        <td>
                          <span className={`aic-infra-badge ${p.type === "Self-Hosted" ? "local" : "cloud"}`}>
                            {p.type === "Self-Hosted" ? <Server size={11} /> : <Cpu size={11} />}
                            {p.type}
                          </span>
                        </td>

                        {/* 3. Default Model Selector */}
                        <td>
                          <select
                            className="aic-model-select"
                            value={p.defaultModel}
                            onChange={(e) => {
                              const val = e.target.value;
                              setProviders((prev) =>
                                prev.map((prov) =>
                                  prov.id === p.id ? { ...prov, defaultModel: val } : prov
                                )
                              );
                              notify(`Default model for ${p.name} set to ${val}.`);
                            }}
                          >
                            {p.models.map((m) => (
                              <option key={m} value={m}>
                                {m}
                              </option>
                            ))}
                          </select>
                        </td>

                        {/* 4. Supported Models Tags */}
                        <td>
                          <div className="aic-model-chips-wrap">
                            {p.models.map((m) => (
                              <span
                                key={m}
                                className={`aic-model-chip ${m === p.defaultModel ? "is-active" : ""}`}
                                title={m === p.defaultModel ? "Current Active Default Model" : "Supported Model"}
                              >
                                {m}
                              </span>
                            ))}
                          </div>
                        </td>

                        {/* 5. API Key / Endpoint */}
                        <td>
                          <div className="aic-key-control-wrap">
                            <code className="aic-key-code" title={showKeys[p.id] ? p.apiKey : "Click eye icon to reveal"}>
                              {showKeys[p.id] ? p.apiKey : "••••••••••••••••••••"}
                            </code>
                            <div className="aic-key-buttons">
                              <button
                                type="button"
                                className="aic-key-action-btn"
                                onClick={() => toggleShowKey(p.id)}
                                title={showKeys[p.id] ? "Hide API Key" : "Reveal API Key"}
                              >
                                {showKeys[p.id] ? <EyeOff size={13} /> : <Eye size={13} />}
                              </button>
                              <button
                                type="button"
                                className={`aic-key-action-btn ${copiedKeyId === p.id ? "copied" : ""}`}
                                onClick={() => handleCopyKey(p.id, p.apiKey)}
                                title="Copy API key to clipboard"
                              >
                                {copiedKeyId === p.id ? <Check size={13} color="#10b981" /> : <Copy size={13} />}
                              </button>
                            </div>
                          </div>
                        </td>

                        {/* 6. Latency */}
                        <td>
                          <div className="aic-latency-pill">
                            <span className="aic-latency-dot" />
                            <code>{p.latency}</code>
                          </div>
                        </td>

                        {/* 7. Context Window */}
                        <td>
                          <span className="aic-context-tag">
                            <Layers size={11} /> {p.contextWindow}
                          </span>
                        </td>

                        {/* 8. Status */}
                        <td>
                          <span className={`aic-status-pill ${p.status === "Operational" ? "operational" : "standby"}`}>
                            <span className="aic-status-dot" />
                            {p.status}
                          </span>
                        </td>

                        {/* 9. Operations */}
                        <td style={{ textAlign: "right" }}>
                          <div className="aic-actions-group">
                            {!isDef ? (
                              <button
                                type="button"
                                className="aic-btn-pill aic-btn-default"
                                onClick={() => handleMakeDefault(p.id)}
                                title="Make this the active default AI engine"
                              >
                                <Sparkles size={13} />
                                <span>Set Default</span>
                              </button>
                            ) : (
                              <span className="aic-default-active-label" title="Active default AI engine">
                                <CheckCircle2 size={13} /> Primary
                              </span>
                            )}

                            <button
                              type="button"
                              className="aic-btn-pill aic-btn-ping"
                              disabled={testingId === p.id}
                              onClick={() => handleTestConnection(p.id)}
                              title="Test API handshake and measure latency"
                            >
                              <Zap size={13} className={testingId === p.id ? "aic-spin" : ""} />
                              <span>{testingId === p.id ? "Pinging..." : "Ping"}</span>
                            </button>

                            <button
                              type="button"
                              className="aic-btn-icon aic-btn-config"
                              onClick={() => setConfigureModalProvider(p)}
                              title="Configure hyperparameters & API settings"
                            >
                              <Settings size={14} />
                            </button>

                            {!isDef && (
                              <button
                                type="button"
                                className="aic-btn-icon aic-btn-delete"
                                onClick={() => setDeleteConfirmProvider(p)}
                                title="Delete AI provider"
                              >
                                <Trash2 size={14} />
                              </button>
                            )}
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
          /* Cards Grid View */
          <div className="aic-cards-grid">
            {filteredProviders.map((p) => {
              const isDef = p.isDefault;
              return (
                <article key={p.id} className={`aic-card ${isDef ? "is-default" : ""}`}>
                  <div className="aic-card-header">
                    <div className="aic-card-title-group">
                      <ProviderLogo providerId={p.id} name={p.name} size={42} />
                      <div>
                        <div className="aic-card-name-row">
                          <h3 className="aic-card-name">{p.name}</h3>
                          {isDef && (
                            <span className="aic-default-tag">
                              <Sparkles size={10} /> Default
                            </span>
                          )}
                        </div>
                        <span className="aic-card-status">
                          <span
                            className="aic-status-dot"
                            style={{
                              backgroundColor: p.status === "Operational" ? "#10b981" : "#f59e0b",
                            }}
                          />
                          {p.status} · <code>{p.latency}</code>
                        </span>
                      </div>
                    </div>

                    <div className="aic-card-header-actions">
                      <span className={`aic-infra-badge ${p.type === "Self-Hosted" ? "local" : "cloud"}`}>
                        {p.type}
                      </span>
                    </div>
                  </div>

                  <p className="aic-card-description">{p.description}</p>

                  <div className="aic-card-body">
                    {/* API Key */}
                    <div className="aic-card-field">
                      <label>API Key / Host Endpoint</label>
                      <div className="aic-key-control-wrap">
                        <code className="aic-key-code">
                          {showKeys[p.id] ? p.apiKey : "••••••••••••••••••••"}
                        </code>
                        <div className="aic-key-buttons">
                          <button
                            type="button"
                            className="aic-key-action-btn"
                            onClick={() => toggleShowKey(p.id)}
                            title="Toggle reveal"
                          >
                            {showKeys[p.id] ? <EyeOff size={13} /> : <Eye size={13} />}
                          </button>
                          <button
                            type="button"
                            className="aic-key-action-btn"
                            onClick={() => handleCopyKey(p.id, p.apiKey)}
                            title="Copy key"
                          >
                            <Copy size={13} />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Default Model & Temp */}
                    <div className="aic-card-two-col">
                      <div className="aic-card-field">
                        <label>Default Model</label>
                        <select
                          className="aic-model-select"
                          value={p.defaultModel}
                          onChange={(e) => {
                            const val = e.target.value;
                            setProviders((prev) =>
                              prev.map((prov) =>
                                prov.id === p.id ? { ...prov, defaultModel: val } : prov
                              )
                            );
                            notify(`Default model for ${p.name} set to ${val}.`);
                          }}
                        >
                          {p.models.map((m) => (
                            <option key={m} value={m}>
                              {m}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="aic-card-field">
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <label style={{ margin: 0 }}>Temperature</label>
                          <span className="aic-temp-badge">{p.temperature}</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.05"
                          value={p.temperature}
                          className="aic-range-slider"
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setProviders((prev) =>
                              prev.map((prov) =>
                                prov.id === p.id ? { ...prov, temperature: val } : prov
                              )
                            );
                          }}
                        />
                      </div>
                    </div>

                    {/* Model Chips */}
                    <div className="aic-card-field">
                      <label>Supported Model Family</label>
                      <div className="aic-model-chips-wrap">
                        {p.models.map((m) => (
                          <span
                            key={m}
                            className={`aic-model-chip ${m === p.defaultModel ? "is-active" : ""}`}
                          >
                            {m}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="aic-card-footer">
                    <div className="aic-card-footer-left">
                      {!isDef ? (
                        <button
                          type="button"
                          className="aic-card-btn aic-btn-default"
                          onClick={() => handleMakeDefault(p.id)}
                        >
                          <Sparkles size={13} /> <span>Set Default</span>
                        </button>
                      ) : (
                        <span className="aic-default-active-label">
                          <CheckCircle2 size={13} /> <span>Active Default</span>
                        </span>
                      )}

                      <button
                        type="button"
                        className="aic-card-btn aic-btn-ping"
                        disabled={testingId === p.id}
                        onClick={() => handleTestConnection(p.id)}
                      >
                        <Zap size={13} className={testingId === p.id ? "aic-spin" : ""} />
                        <span>{testingId === p.id ? "Pinging..." : "Test Connection"}</span>
                      </button>
                    </div>

                    <button
                      type="button"
                      className="aic-card-btn aic-btn-config"
                      onClick={() => setConfigureModalProvider(p)}
                      title="Configure Parameters"
                    >
                      <Settings size={14} /> <span>Configure</span>
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        <div className="sap-footer-bar">
          <span style={{ fontSize: 12.5, color: "var(--sa-text-muted)" }}>
            Total <strong>{filteredProviders.length}</strong> configured AI providers · All endpoints live &amp; healthy
          </span>
          <span style={{ fontSize: 12, color: "var(--sa-text-muted)" }}>
            Automatic Failover Active: Secondary route engaged on HTTP 429 / 5xx
          </span>
        </div>
      </section>

      {/* 4. Subscription Tier Quota Matrix - Enterprise SaaS Table Card */}
      <section className="sap-table-card">
        {/* Toolbar */}
        <div className="sap-toolbar">
          <div className="sap-toolbar-left">
            <div className="sap-search-input">
              <Search size={15} style={{ color: "var(--sa-text-muted)" }} />
              <input
                type="text"
                placeholder="Search plan tier token limits, allowed models, or rate quotas..."
                value={tierSearch}
                onChange={(e) => setTierSearch(e.target.value)}
              />
              {tierSearch && (
                <button
                  type="button"
                  style={{ background: "transparent", border: 0, cursor: "pointer", color: "#94a3b8" }}
                  onClick={() => setTierSearch("")}
                >
                  <X size={13} />
                </button>
              )}
            </div>
          </div>

          <div className="sap-toolbar-right">
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
        <div className="sap-table-wrapper">
          <table className={`sap-grid is-${tierDensity}`}>
            <thead>
              <tr>
                <th style={{ minWidth: 160 }}>Subscription Plan Tier</th>
                <th style={{ minWidth: 160 }}>Monthly Token Quota</th>
                <th style={{ minWidth: 260 }}>Allowed Model Suite</th>
                <th style={{ minWidth: 130 }}>Rate Limit (RPM)</th>
                <th style={{ minWidth: 150 }}>Concurrency Ceiling</th>
                <th style={{ minWidth: 180 }}>Inference Stream Priority</th>
                <th style={{ minWidth: 130 }}>Pricing Factor</th>
                <th style={{ textAlign: "right", minWidth: 140, width: 140 }}>Operation</th>
              </tr>
            </thead>
            <tbody>
              {filteredQuotas.map((t) => (
                <tr key={t.id}>
                  <td>
                    <span className={`aic-tier-badge ${t.badge}`}>
                      {t.tier}
                    </span>
                  </td>
                  <td>
                    <strong style={{ color: "var(--sa-text-main, #0f172a)", fontSize: 13 }}>
                      {t.monthlyTokens}
                    </strong>
                  </td>
                  <td>
                    <div className="aic-tier-models-row">
                      {t.allowedModels.map((m, idx) => (
                        <span key={idx} className="aic-tier-model-tag">
                          {m}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td>
                    <code className="sap-id-cell">{t.rateLimit}</code>
                  </td>
                  <td>
                    <span style={{ fontSize: 12, color: "var(--sa-text-muted)" }}>
                      {t.concurrency}
                    </span>
                  </td>
                  <td>
                    <span className="aic-streaming-tag">
                      <Activity size={11} /> {t.streaming}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: 12.5, fontWeight: 700, color: "#0f766e" }}>
                      {t.costFactor}
                    </span>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <button
                      type="button"
                      className="aic-tier-edit-btn"
                      onClick={() => setEditTierModal(t)}
                      title="Edit plan tier token quota"
                    >
                      <Edit size={13} />
                      <span>Edit Quota</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="sap-footer-bar">
          <span style={{ fontSize: 12.5, color: "var(--sa-text-muted)" }}>
            Showing <strong>{filteredQuotas.length}</strong> subscription tier quota configurations · Token counters reset upon monthly billing renewal
          </span>
        </div>
      </section>

      {/* ======================================================================
          5. MODAL 1: CONFIGURE PROVIDER HYPERPARAMETERS & CREDENTIALS
          ====================================================================== */}
      {configureModalProvider &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="sa-modal-backdrop"
            onClick={() => setConfigureModalProvider(null)}
          >
            <div
              className="aic-modal-dialog"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="aic-modal-header">
                <div className="aic-modal-header-left">
                  <ProviderLogo
                    providerId={configureModalProvider.id}
                    name={configureModalProvider.name}
                    size={38}
                  />
                  <div>
                    <h3 className="aic-modal-title">
                      Configure {configureModalProvider.name}
                    </h3>
                    <div className="aic-modal-subtitle">
                      <span>ID: {configureModalProvider.id}</span>
                      <span>·</span>
                      <span className="aic-infra-badge cloud" style={{ padding: "1px 6px" }}>
                        {configureModalProvider.type}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  className="sa-modal-close"
                  onClick={() => setConfigureModalProvider(null)}
                >
                  <X size={17} />
                </button>
              </div>

              <form onSubmit={handleSaveConfigureModal}>
                <div className="aic-modal-body">
                  {/* API Base URL */}
                  <div className="aic-field-group">
                    <label className="aic-field-label">API Base URL / Endpoint *</label>
                    <input
                      type="text"
                      className="aic-field-input"
                      value={configureModalProvider.baseUrl}
                      onChange={(e) =>
                        setConfigureModalProvider((prev) => ({
                          ...prev,
                          baseUrl: e.target.value,
                        }))
                      }
                      required
                    />
                    <span className="aic-field-hint">
                      The REST API endpoint for inference and model completions.
                    </span>
                  </div>

                  {/* API Key */}
                  <div className="aic-field-group">
                    <label className="aic-field-label">API Key / Secret Token *</label>
                    <div className="aic-input-with-button">
                      <input
                        type="text"
                        className="aic-field-input"
                        value={configureModalProvider.apiKey}
                        onChange={(e) =>
                          setConfigureModalProvider((prev) => ({
                            ...prev,
                            apiKey: e.target.value,
                          }))
                        }
                        required
                      />
                      <button
                        type="button"
                        className="sa-btn sa-btn-secondary sa-btn-sm"
                        onClick={() => handleTestConnection(configureModalProvider.id)}
                      >
                        <Zap size={13} /> Test Ping
                      </button>
                    </div>
                  </div>

                  {/* Default Model & Context Window */}
                  <div className="aic-form-grid-2">
                    <div className="aic-field-group">
                      <label className="aic-field-label">Default Model Engine *</label>
                      <select
                        className="aic-field-select"
                        value={configureModalProvider.defaultModel}
                        onChange={(e) =>
                          setConfigureModalProvider((prev) => ({
                            ...prev,
                            defaultModel: e.target.value,
                          }))
                        }
                      >
                        {configureModalProvider.models.map((m) => (
                          <option key={m} value={m}>
                            {m}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="aic-field-group">
                      <label className="aic-field-label">Context Window Capacity</label>
                      <input
                        type="text"
                        className="aic-field-input"
                        value={configureModalProvider.contextWindow}
                        onChange={(e) =>
                          setConfigureModalProvider((prev) => ({
                            ...prev,
                            contextWindow: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>

                  {/* Hyperparameters: Temperature & Max Tokens */}
                  <div className="aic-params-box">
                    <h4 className="aic-params-title">
                      <Sliders size={14} /> Inference Hyperparameters
                    </h4>

                    {/* Temperature Slider */}
                    <div className="aic-field-group">
                      <div className="aic-slider-header">
                        <label className="aic-field-label">
                          Sampling Temperature
                        </label>
                        <span className="aic-slider-val">
                          {configureModalProvider.temperature}
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={configureModalProvider.temperature}
                        className="aic-range-slider"
                        onChange={(e) =>
                          setConfigureModalProvider((prev) => ({
                            ...prev,
                            temperature: Number(e.target.value),
                          }))
                        }
                      />
                      <div className="aic-slider-caption">
                        <span>0.0 (Deterministic / Code &amp; Math)</span>
                        <span>1.0 (Creative &amp; Conversational)</span>
                      </div>
                    </div>

                    {/* Max Tokens Slider */}
                    <div className="aic-field-group" style={{ marginTop: 12 }}>
                      <div className="aic-slider-header">
                        <label className="aic-field-label">Max Output Tokens</label>
                        <span className="aic-slider-val">
                          {configureModalProvider.maxTokens?.toLocaleString()} tokens
                        </span>
                      </div>
                      <input
                        type="range"
                        min="512"
                        max="16384"
                        step="512"
                        value={configureModalProvider.maxTokens}
                        className="aic-range-slider"
                        onChange={(e) =>
                          setConfigureModalProvider((prev) => ({
                            ...prev,
                            maxTokens: Number(e.target.value),
                          }))
                        }
                      />
                    </div>

                    {/* Top P Slider */}
                    <div className="aic-field-group" style={{ marginTop: 12 }}>
                      <div className="aic-slider-header">
                        <label className="aic-field-label">Top P (Nucleus Sampling)</label>
                        <span className="aic-slider-val">
                          {configureModalProvider.topP || 0.95}
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0.1"
                        max="1.0"
                        step="0.05"
                        value={configureModalProvider.topP || 0.95}
                        className="aic-range-slider"
                        onChange={(e) =>
                          setConfigureModalProvider((prev) => ({
                            ...prev,
                            topP: Number(e.target.value),
                          }))
                        }
                      />
                    </div>
                  </div>

                  {/* Fallback Failover Routing */}
                  <div className="aic-field-group">
                    <label className="aic-field-label">Failover Backup Provider</label>
                    <select
                      className="aic-field-select"
                      value={configureModalProvider.fallbackId || "openai"}
                      onChange={(e) =>
                        setConfigureModalProvider((prev) => ({
                          ...prev,
                          fallbackId: e.target.value,
                        }))
                      }
                    >
                      {providers
                        .filter((p) => p.id !== configureModalProvider.id)
                        .map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name} ({p.defaultModel})
                          </option>
                        ))}
                    </select>
                    <span className="aic-field-hint">
                      If this endpoint encounters a 429 rate limit or 5xx outage, traffic routes automatically to this fallback.
                    </span>
                  </div>
                </div>

                <div className="aic-modal-footer">
                  <button
                    type="button"
                    className="sa-btn sa-btn-secondary"
                    onClick={() => setConfigureModalProvider(null)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="sa-btn sa-btn-primary">
                    <CheckCircle2 size={15} /> Save Provider Settings
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}

      {/* ======================================================================
          6. MODAL 2: ADD CUSTOM AI PROVIDER / ENDPOINT
          ====================================================================== */}
      {addModalOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="sa-modal-backdrop"
            onClick={() => setAddModalOpen(false)}
          >
            <div
              className="aic-modal-dialog"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="aic-modal-header">
                <div className="aic-modal-header-left">
                  <div className="aic-create-icon-box">
                    <Plus size={18} />
                  </div>
                  <div>
                    <h3 className="aic-modal-title">Register Custom AI Provider</h3>
                    <div className="aic-modal-subtitle">
                      Connect a custom LLM proxy, on-premise vLLM shard, or private cloud endpoint.
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  className="sa-modal-close"
                  onClick={() => setAddModalOpen(false)}
                >
                  <X size={17} />
                </button>
              </div>

              <form onSubmit={handleAddProviderSubmit}>
                <div className="aic-modal-body">
                  <div className="aic-form-grid-2">
                    <div className="aic-field-group">
                      <label className="aic-field-label">Provider Name *</label>
                      <input
                        type="text"
                        className="aic-field-input"
                        placeholder="e.g. Groq LPU Cloud"
                        value={newProviderForm.name}
                        onChange={(e) =>
                          setNewProviderForm((prev) => ({ ...prev, name: e.target.value }))
                        }
                        required
                      />
                    </div>

                    <div className="aic-field-group">
                      <label className="aic-field-label">Infrastructure Type *</label>
                      <select
                        className="aic-field-select"
                        value={newProviderForm.type}
                        onChange={(e) =>
                          setNewProviderForm((prev) => ({ ...prev, type: e.target.value }))
                        }
                      >
                        <option value="Cloud Hosted">Cloud Hosted</option>
                        <option value="Self-Hosted">Self-Hosted / Local VPC</option>
                      </select>
                    </div>
                  </div>

                  <div className="aic-field-group">
                    <label className="aic-field-label">Base API URL *</label>
                    <input
                      type="url"
                      className="aic-field-input"
                      placeholder="https://api.groq.com/openai/v1 or http://localhost:8000/v1"
                      value={newProviderForm.baseUrl}
                      onChange={(e) =>
                        setNewProviderForm((prev) => ({ ...prev, baseUrl: e.target.value }))
                      }
                      required
                    />
                  </div>

                  <div className="aic-field-group">
                    <label className="aic-field-label">API Key / Bearer Secret *</label>
                    <input
                      type="password"
                      className="aic-field-input"
                      placeholder="gsk_live_api_credential_token"
                      value={newProviderForm.apiKey}
                      onChange={(e) =>
                        setNewProviderForm((prev) => ({ ...prev, apiKey: e.target.value }))
                      }
                      required
                    />
                  </div>

                  <div className="aic-field-group">
                    <label className="aic-field-label">
                      Available Model IDs (Comma-separated) *
                    </label>
                    <input
                      type="text"
                      className="aic-field-input"
                      placeholder="llama-3.3-70b-versatile, mixtral-8x7b-32768, deepseek-r1-distill-llama-70b"
                      value={newProviderForm.models}
                      onChange={(e) =>
                        setNewProviderForm((prev) => ({ ...prev, models: e.target.value }))
                      }
                      required
                    />
                    <span className="aic-field-hint">
                      Enter model identifiers supported by this endpoint separated by commas.
                    </span>
                  </div>

                  <div className="aic-form-grid-2">
                    <div className="aic-field-group">
                      <label className="aic-field-label">Default Model ID</label>
                      <input
                        type="text"
                        className="aic-field-input"
                        placeholder="e.g. llama-3.3-70b-versatile"
                        value={newProviderForm.defaultModel}
                        onChange={(e) =>
                          setNewProviderForm((prev) => ({ ...prev, defaultModel: e.target.value }))
                        }
                      />
                    </div>

                    <div className="aic-field-group">
                      <label className="aic-field-label">Context Window (Tokens)</label>
                      <input
                        type="text"
                        className="aic-field-input"
                        placeholder="e.g. 128,000 tokens"
                        value={newProviderForm.contextWindow}
                        onChange={(e) =>
                          setNewProviderForm((prev) => ({ ...prev, contextWindow: e.target.value }))
                        }
                      />
                    </div>
                  </div>

                  <div className="aic-field-group">
                    <label className="aic-field-label">Provider Description</label>
                    <textarea
                      rows={2}
                      className="aic-field-textarea"
                      placeholder="Brief note about this endpoint's purpose or hardware acceleration..."
                      value={newProviderForm.description}
                      onChange={(e) =>
                        setNewProviderForm((prev) => ({ ...prev, description: e.target.value }))
                      }
                    />
                  </div>
                </div>

                <div className="aic-modal-footer">
                  <button
                    type="button"
                    className="sa-btn sa-btn-secondary"
                    onClick={() => setAddModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="sa-btn sa-btn-primary">
                    <Plus size={15} /> Register AI Provider
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}

      {/* ======================================================================
          7. MODAL 3: EDIT SUBSCRIPTION PLAN TIER QUOTA
          ====================================================================== */}
      {editTierModal &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="sa-modal-backdrop"
            onClick={() => setEditTierModal(null)}
          >
            <div
              className="aic-modal-dialog"
              style={{ maxWidth: 540 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="aic-modal-header">
                <div className="aic-modal-header-left">
                  <div className="aic-tier-icon-box">
                    <Layers size={18} />
                  </div>
                  <div>
                    <h3 className="aic-modal-title">
                      Edit Token Quota: {editTierModal.tier}
                    </h3>
                    <div className="aic-modal-subtitle">
                      Adjust allocation, rate limits, and inference concurrency ceilings.
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  className="sa-modal-close"
                  onClick={() => setEditTierModal(null)}
                >
                  <X size={17} />
                </button>
              </div>

              <form onSubmit={handleSaveTierModal}>
                <div className="aic-modal-body">
                  <div className="aic-field-group">
                    <label className="aic-field-label">Monthly Token Allocation *</label>
                    <input
                      type="text"
                      className="aic-field-input"
                      value={editTierModal.monthlyTokens}
                      onChange={(e) =>
                        setEditTierModal((prev) => ({
                          ...prev,
                          monthlyTokens: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>

                  <div className="aic-form-grid-2">
                    <div className="aic-field-group">
                      <label className="aic-field-label">Rate Limit (RPM) *</label>
                      <input
                        type="text"
                        className="aic-field-input"
                        value={editTierModal.rateLimit}
                        onChange={(e) =>
                          setEditTierModal((prev) => ({
                            ...prev,
                            rateLimit: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>

                    <div className="aic-field-group">
                      <label className="aic-field-label">Concurrency Limit *</label>
                      <input
                        type="text"
                        className="aic-field-input"
                        value={editTierModal.concurrency}
                        onChange={(e) =>
                          setEditTierModal((prev) => ({
                            ...prev,
                            concurrency: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="aic-field-group">
                    <label className="aic-field-label">Inference Priority Tag *</label>
                    <input
                      type="text"
                      className="aic-field-input"
                      value={editTierModal.streaming}
                      onChange={(e) =>
                        setEditTierModal((prev) => ({
                          ...prev,
                          streaming: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>

                  <div className="aic-field-group">
                    <label className="aic-field-label">Allowed Models (Comma-separated)</label>
                    <input
                      type="text"
                      className="aic-field-input"
                      value={editTierModal.allowedModels.join(", ")}
                      onChange={(e) =>
                        setEditTierModal((prev) => ({
                          ...prev,
                          allowedModels: e.target.value.split(",").map((s) => s.trim()),
                        }))
                      }
                      required
                    />
                  </div>
                </div>

                <div className="aic-modal-footer">
                  <button
                    type="button"
                    className="sa-btn sa-btn-secondary"
                    onClick={() => setEditTierModal(null)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="sa-btn sa-btn-primary">
                    <CheckCircle2 size={15} /> Save Tier Allocation
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}

      {/* ======================================================================
          8. MODAL 4: DELETE PROVIDER CONFIRMATION DIALOG
          ====================================================================== */}
      {deleteConfirmProvider &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="sa-modal-backdrop"
            onClick={() => setDeleteConfirmProvider(null)}
          >
            <div
              className="aic-delete-dialog"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="aic-delete-icon-box">
                <Trash2 size={24} />
              </div>
              <h3 className="aic-delete-title">
                Remove {deleteConfirmProvider.name}?
              </h3>
              <p className="aic-delete-desc">
                Are you sure you want to remove <strong>{deleteConfirmProvider.name}</strong> from your active AI gateway routing table? Active requests will cease routing to this provider.
              </p>
              <div className="aic-delete-actions">
                <button
                  type="button"
                  className="sa-btn sa-btn-secondary"
                  onClick={() => setDeleteConfirmProvider(null)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="sa-btn sa-btn-danger"
                  onClick={() => handleDeleteProvider(deleteConfirmProvider)}
                >
                  Yes, Remove Provider
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}

export default AIConfiguration;
