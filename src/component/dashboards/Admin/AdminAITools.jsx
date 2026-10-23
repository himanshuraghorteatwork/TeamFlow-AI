// src/component/AdminAITools/AdminAITools.jsx

import React, { useEffect, useMemo, useState } from "react";

import {
  Bot,
  Search,
  Plus,
  Sparkles,
  Zap,
  Users,
  Activity,
  Settings,
  Play,
  Power,
  Bug,
  ListChecks,
  FileText,
  BrainCircuit,
  MessageSquareText,
  MoreVertical,
  X,
  RotateCcw,
  ChevronDown,
  CheckCircle2,
  Cpu,
  BarChart3,
} from "lucide-react";

import AdminSidebar from "../../../layouts/AdminSidebar/AdminSidebar.jsx";

import "./AdminAITools.css";

import {
  initialAITools,
  aiCategories,
  aiModels,
} from "./adminAIToolsData.js";

const STORAGE_KEY = "teamflow_admin_ai_tools";

const emptyTool = {
  name: "",
  description: "",
  category: "Assistant",
  model: "GPT-4o Mini",
  status: "Active",
  enabled: true,
};

function AdminAITools() {
  const [tools, setTools] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      return saved ? JSON.parse(saved) : initialAITools;
    } catch {
      return initialAITools;
    }
  });

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All");

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);

  const [selectedTool, setSelectedTool] = useState(null);
  const [openMenu, setOpenMenu] = useState(null);

  const [form, setForm] = useState(emptyTool);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tools));
  }, [tools]);

  const filteredTools = useMemo(() => {
    return tools.filter((tool) => {
      const value = search.toLowerCase().trim();

      const searchMatch =
        !value ||
        tool.name.toLowerCase().includes(value) ||
        tool.description.toLowerCase().includes(value) ||
        tool.category.toLowerCase().includes(value) ||
        tool.model.toLowerCase().includes(value);

      const categoryMatch =
        category === "All" || tool.category === category;

      const statusMatch =
        status === "All" || tool.status === status;

      return searchMatch && categoryMatch && statusMatch;
    });
  }, [tools, search, category, status]);

  const activeTools = tools.filter((tool) => tool.enabled).length;

  const totalRequests = tools.reduce(
    (total, tool) => total + tool.requests,
    0
  );

  const totalUsers = tools.reduce(
    (total, tool) => total + tool.users,
    0
  );

  const averageSuccess =
    tools.length === 0
      ? 0
      : tools.reduce(
          (total, tool) => total + tool.successRate,
          0
        ) / tools.length;

  const toggleTool = (id) => {
    setTools((previous) =>
      previous.map((tool) =>
        tool.id === id
          ? {
              ...tool,
              enabled: !tool.enabled,
              status: tool.enabled ? "Disabled" : "Active",
            }
          : tool
      )
    );
  };

  const runTool = (tool) => {
    setTools((previous) =>
      previous.map((item) =>
        item.id === tool.id
          ? {
              ...item,
              requests: item.requests + 1,
              lastUsed: "Just now",
            }
          : item
      )
    );

    alert(`${tool.name} test completed successfully.`);
  };

  const openConfiguration = (tool) => {
    setSelectedTool(tool);
    setOpenMenu(null);
    setShowConfigModal(true);
  };

  const saveConfiguration = (event) => {
    event.preventDefault();

    setTools((previous) =>
      previous.map((tool) =>
        tool.id === selectedTool.id ? selectedTool : tool
      )
    );

    setShowConfigModal(false);
  };

  const handleCreate = (event) => {
    event.preventDefault();

    if (!form.name.trim() || !form.description.trim()) {
      alert("Please enter tool name and description.");
      return;
    }

    const newTool = {
      id: Date.now(),
      ...form,
      requests: 0,
      users: 0,
      successRate: 100,
      icon: "assistant",
      lastUsed: "Never",
    };

    setTools((previous) => [newTool, ...previous]);

    setForm(emptyTool);
    setShowCreateModal(false);
  };

  const deleteTool = (id) => {
    const tool = tools.find((item) => item.id === id);

    if (!window.confirm(`Delete "${tool?.name}"?`)) return;

    setTools((previous) =>
      previous.filter((item) => item.id !== id)
    );

    setOpenMenu(null);
  };

  const resetDemoData = () => {
    if (!window.confirm("Reset AI Tools demo data?")) return;

    setTools(initialAITools);
    setSearch("");
    setCategory("All");
    setStatus("All");
  };

  return (
    <div className="admin-ai-shell">
      <AdminSidebar />

      <main className="admin-ai-main">
        {/* TOPBAR */}

        <header className="admin-ai-topbar">
          <div className="admin-ai-global-search">
            <Search size={17} />

            <input
              placeholder="Search users, workspaces, projects, or anything..."
            />

            <span>Ctrl + K</span>
          </div>

          <div className="admin-ai-top-actions">
            <button
              className="admin-ai-create-top"
              type="button"
              onClick={() => setShowCreateModal(true)}
            >
              <Plus size={18} />
              Create
              <ChevronDown size={15} />
            </button>

            <div className="admin-ai-profile">
              <div className="admin-ai-profile-avatar">
                HR
              </div>

              <div className="admin-ai-profile-info">
                <strong>Himanshu</strong>
                <span>Super Administrator</span>
              </div>

              <ChevronDown size={15} />
            </div>
          </div>
        </header>

        <div className="admin-ai-content">
          {/* HEADER */}

          <section className="admin-ai-heading">
            <div>
              <div className="admin-ai-breadcrumb">
                <Bot size={15} />
                ADMIN / AI TOOLS
              </div>

              <h1>AI Tools Management</h1>

              <p>
                Manage AI-powered features, models and usage
                across TeamFlow AI.
              </p>
            </div>

            <button
              className="admin-ai-primary"
              type="button"
              onClick={() => setShowCreateModal(true)}
            >
              <Plus size={17} />
              Add AI Tool
            </button>
          </section>

          {/* STATS */}

          <section className="admin-ai-stats">
            <StatCard
              icon={BrainCircuit}
              title="AI Tools"
              value={tools.length}
              text="Available tools"
              color="purple"
            />

            <StatCard
              icon={Zap}
              title="Active Tools"
              value={activeTools}
              text="Currently enabled"
              color="green"
            />

            <StatCard
              icon={Activity}
              title="AI Requests"
              value={formatNumber(totalRequests)}
              text="Total requests"
              color="blue"
            />

            <StatCard
              icon={CheckCircle2}
              title="Success Rate"
              value={`${averageSuccess.toFixed(1)}%`}
              text="Average performance"
              color="orange"
            />
          </section>

          {/* USAGE PANEL */}

          <section className="admin-ai-overview">
            <div>
              <div className="admin-ai-overview-icon">
                <Sparkles size={25} />
              </div>

              <div>
                <h3>TeamFlow AI Platform</h3>
                <p>
                  AI services are operational and available
                  across your workspaces.
                </p>
              </div>
            </div>

            <div className="admin-ai-overview-metrics">
              <div>
                <Users size={17} />
                <span>AI Users</span>
                <strong>{formatNumber(totalUsers)}</strong>
              </div>

              <div>
                <Cpu size={17} />
                <span>Models</span>
                <strong>
                  {new Set(tools.map((tool) => tool.model)).size}
                </strong>
              </div>

              <div>
                <BarChart3 size={17} />
                <span>Requests</span>
                <strong>{formatNumber(totalRequests)}</strong>
              </div>
            </div>
          </section>

          {/* FILTERS */}

          <section className="admin-ai-toolbar">
            <div className="admin-ai-search">
              <Search size={17} />

              <input
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search AI tools..."
              />
            </div>

            <select
              value={category}
              onChange={(event) =>
                setCategory(event.target.value)
              }
            >
              {aiCategories.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>

            <select
              value={status}
              onChange={(event) =>
                setStatus(event.target.value)
              }
            >
              <option>All</option>
              <option>Active</option>
              <option>Disabled</option>
            </select>
          </section>

          <div className="admin-ai-results">
            <span>
              Showing <strong>{filteredTools.length}</strong>{" "}
              AI tools
            </span>

            <button type="button" onClick={resetDemoData}>
              <RotateCcw size={14} />
              Reset Demo Data
            </button>
          </div>

          {/* CARDS */}

          <section className="admin-ai-grid">
            {filteredTools.map((tool) => (
              <AIToolCard
                key={tool.id}
                tool={tool}
                openMenu={openMenu}
                setOpenMenu={setOpenMenu}
                toggleTool={toggleTool}
                runTool={runTool}
                configure={openConfiguration}
                deleteTool={deleteTool}
              />
            ))}
          </section>

          {filteredTools.length === 0 && (
            <div className="admin-ai-empty">
              <Bot size={42} />

              <h3>No AI tools found</h3>

              <p>
                Change your search or filter to find a tool.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* CREATE MODAL */}

      {showCreateModal && (
        <div className="admin-ai-modal-overlay">
          <div className="admin-ai-modal">
            <ModalHeader
              title="Add AI Tool"
              text="Add a new AI capability to TeamFlow."
              close={() => setShowCreateModal(false)}
            />

            <form
              className="admin-ai-form"
              onSubmit={handleCreate}
            >
              <label>
                Tool Name *
                <input
                  value={form.name}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      name: event.target.value,
                    })
                  }
                  placeholder="Example: AI Code Reviewer"
                />
              </label>

              <label>
                Description *
                <textarea
                  value={form.description}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      description: event.target.value,
                    })
                  }
                  placeholder="Describe what this AI tool does..."
                />
              </label>

              <div className="admin-ai-form-grid">
                <label>
                  Category

                  <select
                    value={form.category}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        category: event.target.value,
                      })
                    }
                  >
                    {aiCategories
                      .filter((item) => item !== "All")
                      .map((item) => (
                        <option key={item}>{item}</option>
                      ))}
                  </select>
                </label>

                <label>
                  AI Model

                  <select
                    value={form.model}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        model: event.target.value,
                      })
                    }
                  >
                    {aiModels.map((model) => (
                      <option key={model}>{model}</option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="admin-ai-modal-actions">
                <button
                  type="button"
                  className="admin-ai-secondary"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="admin-ai-primary"
                >
                  <Plus size={16} />
                  Add AI Tool
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIGURATION MODAL */}

      {showConfigModal && selectedTool && (
        <div className="admin-ai-modal-overlay">
          <div className="admin-ai-modal">
            <ModalHeader
              title={`Configure ${selectedTool.name}`}
              text="Update the AI model and tool configuration."
              close={() => setShowConfigModal(false)}
            />

            <form
              className="admin-ai-form"
              onSubmit={saveConfiguration}
            >
              <label>
                Tool Name

                <input
                  value={selectedTool.name}
                  onChange={(event) =>
                    setSelectedTool({
                      ...selectedTool,
                      name: event.target.value,
                    })
                  }
                />
              </label>

              <label>
                Description

                <textarea
                  value={selectedTool.description}
                  onChange={(event) =>
                    setSelectedTool({
                      ...selectedTool,
                      description: event.target.value,
                    })
                  }
                />
              </label>

              <div className="admin-ai-form-grid">
                <label>
                  Category

                  <select
                    value={selectedTool.category}
                    onChange={(event) =>
                      setSelectedTool({
                        ...selectedTool,
                        category: event.target.value,
                      })
                    }
                  >
                    {aiCategories
                      .filter((item) => item !== "All")
                      .map((item) => (
                        <option key={item}>{item}</option>
                      ))}
                  </select>
                </label>

                <label>
                  Model

                  <select
                    value={selectedTool.model}
                    onChange={(event) =>
                      setSelectedTool({
                        ...selectedTool,
                        model: event.target.value,
                      })
                    }
                  >
                    {aiModels.map((model) => (
                      <option key={model}>{model}</option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="admin-ai-modal-actions">
                <button
                  type="button"
                  className="admin-ai-secondary"
                  onClick={() => setShowConfigModal(false)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="admin-ai-primary"
                >
                  <Settings size={16} />
                  Save Configuration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function AIToolCard({
  tool,
  openMenu,
  setOpenMenu,
  toggleTool,
  runTool,
  configure,
  deleteTool,
}) {
  const Icon = getToolIcon(tool.icon);

  return (
    <article
      className={`admin-ai-card ${
        !tool.enabled ? "disabled" : ""
      }`}
    >
      <div className="admin-ai-card-header">
        <div className="admin-ai-card-title">
          <div className="admin-ai-tool-icon">
            <Icon size={22} />
          </div>

          <div>
            <h3>{tool.name}</h3>

            <span className="admin-ai-category">
              {tool.category}
            </span>
          </div>
        </div>

        <div className="admin-ai-menu-wrapper">
          <button
            className="admin-ai-more"
            type="button"
            onClick={() =>
              setOpenMenu(
                openMenu === tool.id ? null : tool.id
              )
            }
          >
            <MoreVertical size={18} />
          </button>

          {openMenu === tool.id && (
            <div className="admin-ai-menu">
              <button
                type="button"
                onClick={() => configure(tool)}
              >
                <Settings size={15} />
                Configure
              </button>

              <button
                type="button"
                onClick={() => runTool(tool)}
              >
                <Play size={15} />
                Test Tool
              </button>

              <button
                type="button"
                className="danger"
                onClick={() => deleteTool(tool.id)}
              >
                <X size={15} />
                Delete Tool
              </button>
            </div>
          )}
        </div>
      </div>

      <p className="admin-ai-description">
        {tool.description}
      </p>

      <div className="admin-ai-model">
        <Cpu size={15} />

        <div>
          <span>AI Model</span>
          <strong>{tool.model}</strong>
        </div>
      </div>

      <div className="admin-ai-card-stats">
        <div>
          <strong>{formatNumber(tool.requests)}</strong>
          <span>Requests</span>
        </div>

        <div>
          <strong>{tool.users}</strong>
          <span>Users</span>
        </div>

        <div>
          <strong>{tool.successRate}%</strong>
          <span>Success</span>
        </div>
      </div>

      <div className="admin-ai-card-meta">
        <span>
          Last used: <strong>{tool.lastUsed}</strong>
        </span>

        <span
          className={
            tool.enabled
              ? "admin-ai-active"
              : "admin-ai-disabled"
          }
        >
          {tool.enabled ? "Active" : "Disabled"}
        </span>
      </div>

      <div className="admin-ai-card-actions">
        <button
          type="button"
          className="admin-ai-config-button"
          onClick={() => configure(tool)}
        >
          <Settings size={15} />
          Configure
        </button>

        <button
          type="button"
          className="admin-ai-run-button"
          disabled={!tool.enabled}
          onClick={() => runTool(tool)}
        >
          <Play size={15} />
          Test
        </button>

        <button
          type="button"
          title={
            tool.enabled ? "Disable tool" : "Enable tool"
          }
          className={`admin-ai-power ${
            tool.enabled ? "on" : ""
          }`}
          onClick={() => toggleTool(tool.id)}
        >
          <Power size={16} />
        </button>
      </div>
    </article>
  );
}

function StatCard({
  icon: Icon,
  title,
  value,
  text,
  color,
}) {
  return (
    <article className="admin-ai-stat">
      <div className={`admin-ai-stat-icon ${color}`}>
        <Icon size={22} />
      </div>

      <div>
        <span>{title}</span>
        <strong>{value}</strong>
        <small>{text}</small>
      </div>
    </article>
  );
}

function ModalHeader({ title, text, close }) {
  return (
    <div className="admin-ai-modal-header">
      <div>
        <h2>{title}</h2>
        <p>{text}</p>
      </div>

      <button type="button" onClick={close}>
        <X size={20} />
      </button>
    </div>
  );
}

function getToolIcon(icon) {
  switch (icon) {
    case "bug":
      return Bug;

    case "task":
      return ListChecks;

    case "summary":
      return FileText;

    case "meeting":
      return MessageSquareText;

    case "search":
      return Search;

    default:
      return Bot;
  }
}

function formatNumber(value) {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }

  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }

  return value.toString();
}

export default AdminAITools;