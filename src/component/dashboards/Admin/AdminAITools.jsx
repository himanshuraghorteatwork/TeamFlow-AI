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
  CheckCircle2,
  X,
  Send,
  Eye,
  Grid2X2,
  List,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  AlertTriangle,
  AlertCircle,
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
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // If stored tools are only the old 6 items, upgrade to the full 14 items
          if (parsed.length <= 6 && initialAITools.length > parsed.length) {
            return initialAITools;
          }
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return initialAITools;
  });

  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [viewMode, setViewMode] = useState("table"); // 'table' | 'grid'
  const [sortKey, setSortKey] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(6);

  // Prompt Playground State
  const [promptInput, setPromptInput] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  // Modals
  const [showModal, setShowModal] = useState(false);
  const [editingTool, setEditingTool] = useState(null);
  const [viewingTool, setViewingTool] = useState(null);
  const [toolToDelete, setToolToDelete] = useState(null);
  const [toast, setToast] = useState(null);

  // Close modals on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        if (toolToDelete) setToolToDelete(null);
        else if (viewingTool) setViewingTool(null);
        else if (showModal) setShowModal(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toolToDelete, viewingTool, showModal]);

  // Column sort toggle handler
  const handleSort = (key) => {
    if (sortKey === key) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
    setCurrentPage(1);
  };

  const renderSortIcon = (key) => {
    if (sortKey !== key) {
      return <ArrowUpDown size={13} className="admin-sort-icon muted" />;
    }
    return sortOrder === "asc" ? (
      <ArrowUp size={13} className="admin-sort-icon active" />
    ) : (
      <ArrowDown size={13} className="admin-sort-icon active" />
    );
  };

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
    } catch {
      // ignore
    }
  };

  const filteredTools = useMemo(() => {
    const list = tools.filter((t) => {
      const term = search.trim().toLowerCase();
      const matchesSearch = !term || t.name?.toLowerCase().includes(term) || t.description?.toLowerCase().includes(term);
      const matchesCategory = categoryFilter === "All" || t.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });

    const sortedList = [...list].sort((a, b) => {
      let valA = a[sortKey];
      let valB = b[sortKey];

      if (valA === undefined || valA === null) valA = "";
      if (valB === undefined || valB === null) valB = "";

      if (typeof valA === "boolean") {
        valA = valA ? 1 : 0;
        valB = valB ? 1 : 0;
      }

      if (typeof valA === "number" && typeof valB === "number") {
        return sortOrder === "asc" ? valA - valB : valB - valA;
      }

      valA = String(valA).toLowerCase();
      valB = String(valB).toLowerCase();

      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
    return sortedList;
  }, [tools, search, categoryFilter, sortKey, sortOrder]);

  // Pagination calculations
  const totalPages = Math.max(1, Math.ceil(filteredTools.length / perPage));
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

  const paginatedTools = useMemo(() => {
    const start = (safeCurrentPage - 1) * perPage;
    return filteredTools.slice(start, start + perPage);
  }, [filteredTools, safeCurrentPage, perPage]);

  // Page numbers generator matching Activity Logs
  const getPageNumbers = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (safeCurrentPage <= 4) {
      return [1, 2, 3, 4, 5, "...", totalPages];
    }
    if (safeCurrentPage >= totalPages - 3) {
      return [1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }
    return [1, "...", safeCurrentPage - 1, safeCurrentPage, safeCurrentPage + 1, "...", totalPages];
  };

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

  const confirmDeleteTool = () => {
    if (!toolToDelete) return;
    const deletedId = toolToDelete.id;
    const deletedName = toolToDelete.name;
    const updated = tools.filter((t) => t.id !== deletedId);
    saveTools(updated);
    if (viewingTool?.id === deletedId) {
      setViewingTool(null);
    }
    if (editingTool?.id === deletedId) {
      setShowModal(false);
      setEditingTool(null);
    }
    setToolToDelete(null);
    showToast(`AI feature "${deletedName}" permanently removed.`);
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
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
              />
              {search && (
                <button
                  type="button"
                  className="clear-btn"
                  onClick={() => {
                    setSearch("");
                    setCurrentPage(1);
                  }}
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <div className="admin-ai-controls">
              <select
                value={categoryFilter}
                onChange={(e) => {
                  setCategoryFilter(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="All">All Categories</option>
                <option value="Assistant">Assistant</option>
                <option value="Generation">Generation</option>
                <option value="Automation">Automation</option>
                <option value="Analytics">Analytics</option>
              </select>

              <select
                value={`${sortKey}-${sortOrder}`}
                onChange={(e) => {
                  const [k, ord] = e.target.value.split("-");
                  setSortKey(k);
                  setSortOrder(ord);
                  setCurrentPage(1);
                }}
                aria-label="Sort AI features"
              >
                <option value="name-asc">Sort: Name (A to Z)</option>
                <option value="name-desc">Sort: Name (Z to A)</option>
                <option value="requests-desc">Sort: Highest Requests</option>
                <option value="requests-asc">Sort: Lowest Requests</option>
                <option value="category-asc">Sort: Category</option>
                <option value="model-asc">Sort: AI Model</option>
                <option value="enabled-desc">Sort: Active First</option>
              </select>

              {(search || categoryFilter !== "All") && (
                <button
                  type="button"
                  className="clear-filters-btn"
                  onClick={() => {
                    setSearch("");
                    setCategoryFilter("All");
                    setCurrentPage(1);
                  }}
                >
                  <X size={13} />
                  Clear Filters
                </button>
              )}

              <div className="view-switch">
                <button
                  type="button"
                  className={`view-btn ${viewMode === "table" ? "active" : ""}`}
                  onClick={() => setViewMode("table")}
                  title="Table view"
                >
                  <List size={16} />
                </button>
                <button
                  type="button"
                  className={`view-btn ${viewMode === "grid" ? "active" : ""}`}
                  onClick={() => setViewMode("grid")}
                  title="Grid view"
                >
                  <Grid2X2 size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* TABLE VIEW (PRIMARY) */}
          {viewMode === "table" ? (
            <div className="admin-ai-table-wrap">
              <table className="admin-ai-table">
                <thead>
                  <tr>
                    <th style={{ width: 48, textAlign: "center" }}>#</th>
                    <th className="sortable-th" onClick={() => handleSort("name")}>
                      <div className="th-content">
                        <span>AI Feature</span>
                        {renderSortIcon("name")}
                      </div>
                    </th>
                    <th className="sortable-th" onClick={() => handleSort("category")}>
                      <div className="th-content">
                        <span>Category</span>
                        {renderSortIcon("category")}
                      </div>
                    </th>
                    <th className="sortable-th" onClick={() => handleSort("model")}>
                      <div className="th-content">
                        <span>Model Engine</span>
                        {renderSortIcon("model")}
                      </div>
                    </th>
                    <th className="sortable-th" onClick={() => handleSort("enabled")}>
                      <div className="th-content">
                        <span>Status</span>
                        {renderSortIcon("enabled")}
                      </div>
                    </th>
                    <th className="sortable-th" onClick={() => handleSort("requests")}>
                      <div className="th-content">
                        <span>Requests</span>
                        {renderSortIcon("requests")}
                      </div>
                    </th>
                    <th style={{ textAlign: "right", minWidth: 175 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedTools.map((t, idx) => (
                    <tr key={t.id} className={t.enabled ? "" : "row-disabled"}>
                      <td style={{ textAlign: "center" }}>
                        <span className="admin-row-num">{(safeCurrentPage - 1) * perPage + idx + 1}</span>
                      </td>
                      <td>
                        <div className="tool-title-cell">
                          <strong className="clickable-title" onClick={() => setViewingTool(t)}>
                            {t.name}
                          </strong>
                          <small>{t.description?.substring(0, 65)}...</small>
                        </div>
                      </td>
                      <td>
                        <span className="tool-cat">{t.category}</span>
                      </td>
                      <td>
                        <span className="tool-model-chip">{t.model || "GPT-4o"}</span>
                      </td>
                      <td>
                        <span className={`status-pill status-${t.enabled ? "active" : "inactive"}`}>
                          <span className="dot" />
                          {t.enabled ? "Active" : "Disabled"}
                        </span>
                      </td>
                      <td>
                        <strong>{(t.requests || 120).toLocaleString()}</strong> calls
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <div className="admin-ai-actions-cell table-actions">
                          <button
                            type="button"
                            className="ai-action-pill ai-view-btn view"
                            title="View details & Prompt"
                            aria-label="View details & Prompt"
                            onClick={() => setViewingTool(t)}
                          >
                            <Eye size={13} />
                            <span>View</span>
                          </button>
                          <button
                            type="button"
                            className={`ai-action-icon ai-power-btn ${t.enabled ? "on" : "off"}`}
                            title={t.enabled ? "Disable Feature" : "Enable Feature"}
                            aria-label={t.enabled ? "Disable Feature" : "Enable Feature"}
                            onClick={() => toggleToolEnabled(t.id)}
                          >
                            <Power size={13} />
                          </button>
                          <button
                            type="button"
                            className="ai-action-icon ai-edit-btn edit"
                            title="Edit AI Feature"
                            aria-label="Edit AI Feature"
                            onClick={() => openEditModal(t)}
                          >
                            <Pencil size={13} />
                          </button>
                          <button
                            type="button"
                            className="ai-action-icon ai-delete-btn delete"
                            title="Delete AI Feature"
                            aria-label="Delete AI Feature"
                            onClick={() => setToolToDelete(t)}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredTools.length === 0 && (
                <div className="admin-ai-empty">
                  <Bot size={40} />
                  <h3>No AI features found</h3>
                  <p>Try clearing filters or search query.</p>
                </div>
              )}
            </div>
          ) : (
            /* TOOLS GRID */
            <div className="admin-ai-grid">
              {paginatedTools.map((t, idx) => (
                <div key={t.id} className={`ai-tool-card ${t.enabled ? "" : "disabled"}`}>
                  <div className="tool-card-top">
                    <div className="tool-card-info">
                      <span className="admin-row-num sm">{(safeCurrentPage - 1) * perPage + idx + 1}</span>
                      <div className="tool-avatar"><Bot size={20} /></div>
                      <div>
                        <h3 className="clickable-title" onClick={() => setViewingTool(t)}>{t.name}</h3>
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
                    <div className="admin-ai-actions-cell tool-actions">
                      <button
                        type="button"
                        className="ai-action-pill ai-view-btn view"
                        title="View details & Prompt"
                        aria-label="View details & Prompt"
                        onClick={() => setViewingTool(t)}
                      >
                        <Eye size={12} />
                        <span>View</span>
                      </button>
                      <button
                        type="button"
                        className="ai-action-icon ai-edit-btn edit"
                        title="Edit AI Feature"
                        aria-label="Edit AI Feature"
                        onClick={() => openEditModal(t)}
                      >
                        <Pencil size={13} />
                      </button>
                      <button
                        type="button"
                        className="ai-action-icon ai-delete-btn delete"
                        title="Delete AI Feature"
                        aria-label="Delete AI Feature"
                        onClick={() => setToolToDelete(t)}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* PAGINATION BAR (Exact Activity Logs Style) */}
          {filteredTools.length > 0 && (
            <div className={`admin-logs-pagination-bar admin-ai-pagination-bar ${viewMode === "grid" ? "is-grid" : ""}`}>
              <div className="admin-logs-pagination-info admin-ai-pagination-info">
                <span>
                  Showing {(safeCurrentPage - 1) * perPage + 1} to{" "}
                  {Math.min(safeCurrentPage * perPage, filteredTools.length)} of {filteredTools.length} AI features
                </span>
                <div className="admin-logs-page-size-wrap admin-ai-page-size-wrap">
                  <span>AI features per page:</span>
                  <select
                    value={perPage}
                    onChange={(e) => {
                      setPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    aria-label="AI features per page"
                  >
                    <option value={6}>6</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                </div>
              </div>

              <div className="admin-logs-pagination-controls admin-ai-pagination-controls">
                <button
                  type="button"
                  className="admin-logs-page-nav-btn admin-ai-page-nav-btn"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={safeCurrentPage <= 1}
                >
                  Previous
                </button>
                <div className="admin-logs-page-pills admin-ai-page-pills">
                  {getPageNumbers().map((item, idx) =>
                    item === "..." ? (
                      <span key={`ellipsis-${idx}`} className="admin-logs-page-ellipsis admin-ai-page-ellipsis">
                        ...
                      </span>
                    ) : (
                      <button
                        key={item}
                        type="button"
                        className={`admin-logs-page-num-pill admin-ai-page-num-pill ${safeCurrentPage === item ? "active" : ""}`}
                        onClick={() => setCurrentPage(item)}
                      >
                        {item}
                      </button>
                    )
                  )}
                </div>
                <button
                  type="button"
                  className="admin-logs-page-nav-btn admin-ai-page-nav-btn"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={safeCurrentPage >= totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          )}
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

      {/* VIEW TOOL MODAL */}
      {viewingTool && (
        <div className="modal-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) setViewingTool(null); }}>
          <div className="modal-box ai-view-modal">
            <div className="modal-header">
              <div className="modal-header-left">
                <span className="tool-model-chip">{viewingTool.model || "GPT-4o"}</span>
                <span className="tool-cat">{viewingTool.category}</span>
                <span className={`status-pill status-${viewingTool.enabled ? "active" : "inactive"}`}>
                  <span className="dot" />
                  {viewingTool.enabled ? "Active in Production" : "Disabled"}
                </span>
              </div>
              <button type="button" className="modal-close" onClick={() => setViewingTool(null)}><X size={20} /></button>
            </div>

            <div className="view-body" style={{ padding: "16px 0", display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div className="tool-avatar" style={{ width: 42, height: 42 }}><Bot size={24} /></div>
                <div>
                  <h3 className="view-tool-title" style={{ margin: 0, fontSize: 18 }}>{viewingTool.name}</h3>
                  <small className="view-tool-sub">Execution count: {(viewingTool.requests || 120).toLocaleString()} requests</small>
                </div>
              </div>

              <div className="view-desc-card">
                <strong className="view-desc-header">Description & Capabilities</strong>
                <p className="view-desc-text">{viewingTool.description}</p>
              </div>
            </div>

            <div className="modal-actions ai-view-modal-actions">
              <button
                type="button"
                className="btn-danger-outline"
                style={{ marginRight: "auto" }}
                onClick={() => setToolToDelete(viewingTool)}
              >
                <Trash2 size={14} />
                <span>Delete Feature</span>
              </button>
              <button
                type="button"
                className="btn-cancel"
                onClick={() => {
                  toggleToolEnabled(viewingTool.id);
                  setViewingTool(prev => prev ? { ...prev, enabled: !prev.enabled } : null);
                }}
              >
                <Power size={14} />
                {viewingTool.enabled ? "Disable Feature" : "Enable Feature"}
              </button>
              <button
                type="button"
                className="btn-submit"
                onClick={() => {
                  const toEdit = viewingTool;
                  setViewingTool(null);
                  openEditModal(toEdit);
                }}
              >
                <Pencil size={14} />
                Edit AI Feature
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CUSTOM CSS DELETE CONFIRMATION MODAL */}
      {toolToDelete && (
        <div
          className="modal-overlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setToolToDelete(null);
          }}
        >
          <div
            className="modal-box delete-confirm-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-tool-title"
          >
            <div className="modal-header delete-modal-header">
              <div className="delete-modal-icon-badge">
                <AlertTriangle size={20} />
              </div>
              <div className="delete-modal-header-text">
                <h2 id="delete-tool-title">Delete AI Feature</h2>
                <span className="delete-modal-subtitle">Feature ID: #{toolToDelete.id}</span>
              </div>
              <button
                type="button"
                className="modal-close"
                onClick={() => setToolToDelete(null)}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="modal-body delete-modal-body">
              <p className="delete-modal-lead">
                Are you sure you want to permanently remove this AI feature? Workspace members and automated workflows will no longer have access to this engine.
              </p>

              <div className="delete-tool-preview-box">
                <div className="preview-top">
                  <span className="preview-id">#{toolToDelete.id}</span>
                  <span className="tool-model-chip">{toolToDelete.model || "GPT-4o"}</span>
                  <span className={`status-pill status-${toolToDelete.enabled ? "active" : "inactive"}`}>
                    <span className="dot" />
                    {toolToDelete.enabled ? "Active" : "Disabled"}
                  </span>
                </div>
                <h4 className="preview-title">{toolToDelete.name}</h4>
                <p className="preview-desc-snippet">{toolToDelete.description}</p>
                <div className="preview-meta">
                  <span>Category: {toolToDelete.category}</span>
                  <span>•</span>
                  <span>Usage: {(toolToDelete.requests || 0).toLocaleString()} calls</span>
                  {toolToDelete.successRate && (
                    <>
                      <span>•</span>
                      <span>Success Rate: {toolToDelete.successRate}%</span>
                    </>
                  )}
                </div>
              </div>

              <div className="delete-modal-alert">
                <AlertCircle size={16} />
                <span>Active microservices and connected prompt triggers relying on this feature will immediately cease execution.</span>
              </div>
            </div>

            <div className="modal-actions delete-modal-footer">
              <button
                type="button"
                className="btn-cancel"
                onClick={() => setToolToDelete(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="admin-ai-btn-danger"
                onClick={confirmDeleteTool}
              >
                <Trash2 size={15} />
                <span>Delete AI Feature</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
