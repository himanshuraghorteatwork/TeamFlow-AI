import React, { useEffect, useMemo, useState } from "react";
import {
  Bot,
  Sparkles,
  Zap,
  Cpu,
  Search,
  Plus,
  Pencil,
  Trash2,
  Power,
  RotateCcw,
  CheckCircle2,
  X,
  MessageSquareText,
  Sliders,
  Play,
  Send,
  Layers,
} from "lucide-react";

import AdminSidebar from "./AdminSidebar.jsx";
import AdminTopbar from "./AdminTopbar.jsx";
import { initialAITools } from "./adminAIToolsData.js";
import "./AdminAITools.css";

const STORAGE_KEY = "teamflow_admin_ai_tools";

export default function AdminAITools() {
  const [tools, setTools] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return initialAITools;
  });

  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  // Prompt Playground State
  const [promptInput, setPromptInput] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  // Modals
  const [showModal, setShowModal] = useState(false);
  const [editingTool, setEditingTool] = useState(null);
  const [toast, setToast] = useState(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "Assistant",
    model: "GPT-4o",
    status: "Active",
    enabled: true,
  });

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const showToast = (message) => setToast(message);

  const saveTools = (newTools) => {
    setTools(newTools);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newTools));
    } catch (e) {}
  };

  const filteredTools = useMemo(() => {
    return tools.filter((t) => {
      const term = search.trim().toLowerCase();
      const matchesSearch = !term || t.name?.toLowerCase().includes(term) || t.description?.toLowerCase().includes(term);
      const matchesCategory = categoryFilter === "All" || t.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [tools, search, categoryFilter]);

  const stats = useMemo(() => {
    const total = tools.length;
    const enabled = tools.filter((t) => t.enabled).length;
    const requests = tools.reduce((acc, curr) => acc + (curr.requests || 120), 0);
    return { total, enabled, requests };
  }, [tools]);

  const toggleToolEnabled = (id) => {
    const updated = tools.map((t) => (t.id === id ? { ...t, enabled: !t.enabled } : t));
    saveTools(updated);
    showToast("AI tool status toggled.");
  };

  const openCreateModal = () => {
    setEditingTool(null);
    setForm({
      name: "",
      description: "",
      category: "Assistant",
      model: "GPT-4o",
      status: "Active",
      enabled: true,
    });
    setShowModal(true);
  };

  const openEditModal = (t) => {
    setEditingTool(t);
    setForm(t);
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    if (editingTool) {
      const updated = tools.map((t) => (t.id === editingTool.id ? { ...t, ...form } : t));
      saveTools(updated);
      showToast("AI tool updated.");
    } else {
      const newTool = { id: Date.now(), ...form, requests: 0 };
      saveTools([...tools, newTool]);
      showToast("AI tool provisioned.");
    }
    setShowModal(false);
  };

  const deleteTool = (id) => {
    saveTools(tools.filter((t) => t.id !== id));
    showToast("AI tool removed.");
  };

  // Run AI Test Prompt
  const handleTestPrompt = (e) => {
    e.preventDefault();
    if (!promptInput.trim()) return;
    setIsGenerating(true);
    setAiResponse("");

    setTimeout(() => {
      setIsGenerating(false);
      setAiResponse(
        `[TeamFlow AI Assistant Analysis]\n\nPrompt: "${promptInput}"\n\nExecutive Summary:\n• All organizational microservices are reporting optimal health (99.98% SLA).\n• Highest velocity workspace: Development Hub (18 completed deliverables this sprint).\n• Recommended action: Review storage allocations for Research Lab before Nov 1st.`
      );
    }, 600);
  };

  return (
    <div className="admin-ai-app">
      <AdminSidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="admin-ai-main">
        <AdminTopbar onMobileMenuToggle={() => setMobileOpen(true)} />

        {toast && (
          <div className="admin-ai-toast">
            <CheckCircle2 size={16} />
            <span>{toast}</span>
          </div>
        )}

        <main className="admin-ai-content">
          <section className="admin-ai-heading">
            <div>
              <h1>AI Assistant & Tools Console</h1>
              <p>Configure automated intelligence engines, provision team agents, and test prompt generation.</p>
            </div>

            <button type="button" className="btn-primary" onClick={openCreateModal}>
              <Plus size={17} />
              <span>Add AI Feature</span>
            </button>
          </section>

          {/* STATS */}
          <section className="admin-ai-stats">
            <div className="ai-stat-card">
              <Sparkles size={22} className="stat-icon purple" />
              <div><span>Configured AI Tools</span><strong>{stats.total}</strong></div>
            </div>
            <div className="ai-stat-card">
              <Zap size={22} className="stat-icon green" />
              <div><span>Active in Production</span><strong>{stats.enabled}</strong></div>
            </div>
            <div className="ai-stat-card">
              <Cpu size={22} className="stat-icon blue" />
              <div><span>Monthly Invocations</span><strong>{stats.requests.toLocaleString()}</strong></div>
            </div>
          </section>

          {/* AI TEST PLAYGROUND */}
          <div className="ai-playground-card">
            <div className="playground-header">
              <Bot size={20} className="bot-icon" />
              <div>
                <h3>TeamFlow AI Assistant Playground</h3>
                <p>Run immediate test queries across your organization's workspaces and telemetry.</p>
              </div>
            </div>

            <form onSubmit={handleTestPrompt} className="playground-form">
              <input
                type="text"
                placeholder="Ask TeamFlow AI e.g. 'Summarize organizational velocity this sprint'..."
                value={promptInput}
                onChange={(e) => setPromptInput(e.target.value)}
              />
              <button type="submit" className="playground-btn" disabled={isGenerating || !promptInput.trim()}>
                {isGenerating ? <Zap size={16} className="spinning" /> : <Send size={16} />}
                <span>{isGenerating ? "Analyzing..." : "Generate"}</span>
              </button>
            </form>

            {aiResponse && (
              <div className="ai-response-box">
                <pre>{aiResponse}</pre>
              </div>
            )}
          </div>

          {/* TOOLBAR */}
          <div className="admin-ai-toolbar">
            <div className="admin-ai-search">
              <Search size={17} />
              <input
                type="text"
                placeholder="Search AI features and models..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && <button type="button" className="clear-btn" onClick={() => setSearch("")}><X size={14} /></button>}
            </div>

            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
              <option value="All">All Categories</option>
              <option value="Assistant">Assistant</option>
              <option value="Generation">Generation</option>
              <option value="Automation">Automation</option>
              <option value="Analytics">Analytics</option>
            </select>
          </div>

          {/* TOOLS GRID */}
          <div className="admin-ai-grid">
            {filteredTools.map((t) => (
              <div key={t.id} className={`ai-tool-card ${t.enabled ? "" : "disabled"}`}>
                <div className="tool-card-top">
                  <div className="tool-card-info">
                    <div className="tool-avatar"><Bot size={20} /></div>
                    <div>
                      <h3>{t.name}</h3>
                      <span className="tool-model-chip">{t.model || "GPT-4o"}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className={`power-btn ${t.enabled ? "on" : "off"}`}
                    title={t.enabled ? "Disable Feature" : "Enable Feature"}
                    onClick={() => toggleToolEnabled(t.id)}
                  >
                    <Power size={16} />
                  </button>
                </div>

                <p className="tool-desc">{t.description}</p>

                <div className="tool-card-footer">
                  <span className="tool-cat">{t.category}</span>
                  <div className="tool-actions">
                    <button type="button" className="action-btn" onClick={() => openEditModal(t)}><Pencil size={14} /></button>
                    <button type="button" className="action-btn delete" onClick={() => deleteTool(t.id)}><Trash2 size={14} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* CREATE / EDIT MODAL */}
      {showModal && (
        <div className="modal-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}>
          <div className="modal-box">
            <div className="modal-header">
              <h2>{editingTool ? "Edit AI Tool" : "Provision AI Feature"}</h2>
              <button type="button" className="modal-close" onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label>Feature Name <span className="req">*</span></label>
                <input name="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Automated Sprint Summarizer" required />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>
                  <select name="category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                    <option value="Assistant">Assistant</option>
                    <option value="Generation">Generation</option>
                    <option value="Automation">Automation</option>
                    <option value="Analytics">Analytics</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>LLM Engine</label>
                  <select name="model" value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })}>
                    <option value="GPT-4o">GPT-4o</option>
                    <option value="Claude 3.5 Sonnet">Claude 3.5 Sonnet</option>
                    <option value="Gemini 1.5 Pro">Gemini 1.5 Pro</option>
                    <option value="TeamFlow Core">TeamFlow Core</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Feature capabilities and triggers..." />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-submit">{editingTool ? "Save Changes" : "Provision"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
