import React, { useMemo, useState } from "react";
import {
  Sparkles,
  CheckCircle2,
  Clock3,
  Search,
  RefreshCw,
  TrendingUp,
  AlertTriangle,
  Zap,
  Check,
  X,
  Edit3,
  Trash2,
  FolderKanban,
  Bot,
} from "lucide-react";
import "./TaskSuggestions.css";

const INITIAL_SUGGESTIONS = [
  {
    id: "TSG-101",
    title: "Reassign API Gateway timeout bug #408 to Aarav Shah",
    category: "Workload Balance",
    tagTone: "purple",
    impact: "High",
    confidence: 98,
    project: "TeamFlow Website",
    estimate: "2.5 hrs",
    assignee: "Aarav Shah",
    role: "Backend Developer",
    avatarBg: "#0877bd",
    initials: "AS",
    reasoning:
      "Komal Pawar is currently at 90% capacity with 8 active tasks. Aarav Shah authored the original API Gateway client, has 72% capacity, and solved a similar timeout defect in Sprint 12.",
    accepted: false,
  },
  {
    id: "TSG-102",
    title: "Generate automated unit tests for Auth Token renewal",
    category: "Bug Mitigation",
    tagTone: "blue",
    impact: "High",
    confidence: 95,
    project: "Mobile Application",
    estimate: "4.0 hrs",
    assignee: "Rohan Kulkarni",
    role: "QA Engineer",
    avatarBg: "#087f5b",
    initials: "RK",
    reasoning:
      "3 regression bugs reported in the last 2 sprints were tied to token renewal edge cases. Creating targeted Jest integration suites will proactively block future auth failures.",
    accepted: false,
  },
  {
    id: "TSG-103",
    title: "Extract reusable Analytics Chart components into shared UI package",
    category: "Skill Matching",
    tagTone: "green",
    impact: "Medium",
    confidence: 91,
    project: "Analytics Module",
    estimate: "5.0 hrs",
    assignee: "Priya Rao",
    role: "UI/UX Designer",
    avatarBg: "#be287c",
    initials: "PR",
    reasoning:
      "Priya finished sprint design wireframes 2 days early. Her Recharts and CSS layout mastery will save approximately 11 developer hours across the admin and team lead portals.",
    accepted: false,
  },
  {
    id: "TSG-104",
    title: "Split Epic: 'Real-time Team Chat' into 4 bite-sized subtasks",
    category: "Sprint Goals",
    tagTone: "orange",
    impact: "High",
    confidence: 96,
    project: "TeamFlow Website",
    estimate: "6.0 hrs",
    assignee: "Neha Patil",
    role: "Full Stack Developer",
    avatarBg: "#df6d0b",
    initials: "NP",
    reasoning:
      "The current epic is oversized (estimated 32 story points). Splitting into WebSocket sync, SQLite store, UI list, and Unread counts will de-risk sprint delivery by 40%.",
    accepted: false,
  },
  {
    id: "TSG-105",
    title: "Schedule Pre-Deployment Staging Review alignment meeting",
    category: "Sprint Goals",
    tagTone: "orange",
    impact: "Medium",
    confidence: 89,
    project: "Mobile Application",
    estimate: "45 mins",
    assignee: "Komal Pawar",
    role: "Team Lead",
    avatarBg: "#6547dc",
    initials: "KP",
    reasoning:
      "Sprint cutoff is in 3 days. A brief 45-minute sync with backend and QA stakeholders will resolve pending PR blockers (#194 and #203) before release cutoff.",
    accepted: false,
  },
  {
    id: "TSG-106",
    title: "Compress and optimize SVG asset bundle before production push",
    category: "Workload Balance",
    tagTone: "purple",
    impact: "Low",
    confidence: 87,
    project: "Marketing Portal",
    estimate: "1.5 hrs",
    assignee: "Neha Patil",
    role: "Full Stack Developer",
    avatarBg: "#df6d0b",
    initials: "NP",
    reasoning:
      "Current build bundle includes 3.4 MB of unminified vector graphics. SVGO pipeline compression will trim initial page load time by an estimated 420ms.",
    accepted: false,
  },
];

const CATEGORIES = [
  "All Suggestions",
  "Workload Balance",
  "Bug Mitigation",
  "Skill Matching",
  "Sprint Goals",
];

export default function TaskSuggestions() {
  const [suggestions, setSuggestions] = useState(INITIAL_SUGGESTIONS);
  const [activeCategory, setActiveCategory] = useState("All Suggestions");
  const [search, setSearch] = useState("");
  const [impactFilter, setImpactFilter] = useState("All");
  const [selectedIds, setSelectedIds] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [editingItem, setEditingItem] = useState(null);

  const stats = useMemo(() => {
    const pendingCount = suggestions.filter((s) => !s.accepted).length;
    const acceptedCount = suggestions.filter((s) => s.accepted).length;
    const highImpactCount = suggestions.filter(
      (s) => s.impact === "High" && !s.accepted
    ).length;
    return {
      pending: pendingCount,
      accepted: acceptedCount,
      hoursSaved: "18.5 hrs",
      highImpact: highImpactCount,
      balanceScore: "94%",
    };
  }, [suggestions]);

  const filteredSuggestions = useMemo(() => {
    const q = search.trim().toLowerCase();
    return suggestions.filter((item) => {
      const matchesCategory =
        activeCategory === "All Suggestions" ||
        item.category === activeCategory;
      const matchesImpact =
        impactFilter === "All" || item.impact === impactFilter;
      const matchesSearch =
        !q ||
        [
          item.title,
          item.reasoning,
          item.assignee,
          item.project,
          item.category,
        ]
          .join(" ")
          .toLowerCase()
          .includes(q);

      return matchesCategory && matchesImpact && matchesSearch;
    });
  }, [suggestions, activeCategory, impactFilter, search]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setToastMessage("AI scanned recent commits, workload, and backlog. All suggestions are up to date!");
    }, 800);
  };

  const handleAccept = (id) => {
    setSuggestions((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, accepted: true } : item
      )
    );
    const target = suggestions.find((s) => s.id === id);
    setToastMessage(`Accepted: "${target?.title}". Task assigned to ${target?.assignee}.`);
  };

  const handleDismiss = (id) => {
    const target = suggestions.find((s) => s.id === id);
    setSuggestions((prev) => prev.filter((item) => item.id !== id));
    setSelectedIds((prev) => prev.filter((item) => item !== id));
    setToastMessage(`Suggestion dismissed: "${target?.title}".`);
  };

  const handleSelectToggle = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filteredSuggestions.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredSuggestions.map((item) => item.id));
    }
  };

  const handleBulkAccept = () => {
    setSuggestions((prev) =>
      prev.map((item) =>
        selectedIds.includes(item.id) ? { ...item, accepted: true } : item
      )
    );
    setToastMessage(`${selectedIds.length} AI suggestions accepted and assigned to team members.`);
    setSelectedIds([]);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingItem) return;
    setSuggestions((prev) =>
      prev.map((item) =>
        item.id === editingItem.id ? editingItem : item
      )
    );
    setToastMessage(`Updated suggestion "${editingItem.title}".`);
    setEditingItem(null);
  };

  return (
    <div className="tsg-page">
      {/* Header */}
      <header className="tsg-header">
        <div>
          <div className="tsg-breadcrumb">
            Workspace <span>/</span> AI Tools <span>/</span> Task Suggestions
          </div>
          <div className="tsg-title-row">
            <h1>AI Task Suggestions</h1>
            <span className="tsg-ai-badge">
              <Sparkles size={14} /> AI Powered
            </span>
          </div>
          <p className="tsg-header-desc">
            Intelligent task assignment and workload balancing recommendations generated from sprint velocity, developer availability, and open defect patterns.
          </p>
        </div>

        <div className="tsg-header-actions">
          <button
            className="tsg-btn tsg-btn-secondary"
            onClick={handleRefresh}
            disabled={isRefreshing}
            title="Refresh AI suggestions"
          >
            <RefreshCw
              size={15}
              className={isRefreshing ? "spin-icon" : ""}
            />
            {isRefreshing ? "Analyzing..." : "Refresh Suggestions"}
          </button>
          <button
            className="tsg-btn tsg-btn-primary"
            onClick={handleBulkAccept}
            disabled={selectedIds.length === 0}
          >
            <CheckCircle2 size={16} />
            Accept Selected ({selectedIds.length})
          </button>
        </div>
      </header>

      {/* Toast Notice */}
      {toastMessage && (
        <div className="tsg-notice">
          <span>{toastMessage}</span>
          <button
            className="tsg-notice-close"
            onClick={() => setToastMessage("")}
            aria-label="Dismiss notice"
          >
            <X size={15} />
          </button>
        </div>
      )}

      {/* Metrics Grid */}
      <section className="tsg-stats-grid" aria-label="Suggestions metrics">
        <article className="tsg-stat-card">
          <div className="tsg-stat-icon purple">
            <Bot size={22} />
          </div>
          <div className="tsg-stat-info">
            <span className="tsg-stat-label">Pending Suggestions</span>
            <strong className="tsg-stat-value">{stats.pending}</strong>
            <span className="tsg-stat-sub">{stats.accepted} accepted this sprint</span>
          </div>
        </article>

        <article className="tsg-stat-card">
          <div className="tsg-stat-icon blue">
            <Clock3 size={22} />
          </div>
          <div className="tsg-stat-info">
            <span className="tsg-stat-label">Est. Time Saved</span>
            <strong className="tsg-stat-value">{stats.hoursSaved}</strong>
            <span className="tsg-stat-sub">Across 4 active projects</span>
          </div>
        </article>

        <article className="tsg-stat-card">
          <div className="tsg-stat-icon green">
            <TrendingUp size={22} />
          </div>
          <div className="tsg-stat-info">
            <span className="tsg-stat-label">Workload Balance</span>
            <strong className="tsg-stat-value">{stats.balanceScore}</strong>
            <span className="tsg-stat-sub">+6% balance optimization</span>
          </div>
        </article>

        <article className="tsg-stat-card">
          <div className="tsg-stat-icon orange">
            <AlertTriangle size={22} />
          </div>
          <div className="tsg-stat-info">
            <span className="tsg-stat-label">High Impact Alerts</span>
            <strong className="tsg-stat-value">{stats.highImpact}</strong>
            <span className="tsg-stat-sub">Needs immediate assignment</span>
          </div>
        </article>
      </section>

      {/* Filter and Category Toolbar */}
      <div className="tsg-toolbar">
        <div className="tsg-category-tabs">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`tsg-tab ${activeCategory === cat ? "active" : ""}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="tsg-filters-right">
          <label className="tsg-search">
            <Search size={15} />
            <input
              type="text"
              placeholder="Search recommendations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>

          <select
            className="tsg-select"
            value={impactFilter}
            onChange={(e) => setImpactFilter(e.target.value)}
            aria-label="Filter by impact level"
          >
            <option value="All">All Impact Levels</option>
            <option value="High">High Impact</option>
            <option value="Medium">Medium Impact</option>
            <option value="Low">Low Impact</option>
          </select>
        </div>
      </div>

      {/* Bulk Selection Bar */}
      {filteredSuggestions.length > 0 && (
        <div className="tsg-bulk-bar">
          <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
            <input
              type="checkbox"
              className="tsg-checkbox"
              checked={
                selectedIds.length > 0 &&
                selectedIds.length === filteredSuggestions.length
              }
              onChange={handleSelectAll}
            />
            <span>
              Select All ({selectedIds.length} of {filteredSuggestions.length} selected)
            </span>
          </label>

          {selectedIds.length > 0 && (
            <div className="tsg-bulk-actions">
              <button
                className="tsg-btn tsg-btn-primary"
                style={{ minHeight: "32px", padding: "0 12px", fontSize: "12px" }}
                onClick={handleBulkAccept}
              >
                <Check size={14} /> Accept ({selectedIds.length})
              </button>
            </div>
          )}
        </div>
      )}

      {/* Suggestions List */}
      <section className="tsg-card-list">
        {filteredSuggestions.map((item) => (
          <article
            key={item.id}
            className={`tsg-card ${item.accepted ? "accepted" : ""}`}
          >
            <div className="tsg-card-top">
              <div className="tsg-card-meta">
                <input
                  type="checkbox"
                  className="tsg-checkbox"
                  checked={selectedIds.includes(item.id)}
                  onChange={() => handleSelectToggle(item.id)}
                  aria-label={`Select ${item.title}`}
                />
                <span className={`tsg-tag ${item.tagTone}`}>
                  <Zap size={11} /> {item.category}
                </span>
                <span className={`tsg-impact ${item.impact.toLowerCase()}`}>
                  {item.impact} Impact
                </span>
                <span className="tsg-score">
                  AI Match: <b>{item.confidence}%</b>
                </span>
              </div>

              <div className="tsg-meta-item">
                <FolderKanban size={14} />
                <span>{item.project}</span>
              </div>
            </div>

            <h2 className="tsg-card-title">{item.title}</h2>

            <div className="tsg-reasoning-bubble">
              <Bot size={17} className="tsg-reasoning-icon" />
              <p>
                <strong>AI Context:</strong> {item.reasoning}
              </p>
            </div>

            <footer className="tsg-card-footer">
              <div className="tsg-card-details">
                <div className="tsg-assignee-chip">
                  <span
                    className="tsg-avatar"
                    style={{ backgroundColor: item.avatarBg }}
                  >
                    {item.initials}
                  </span>
                  <div className="tsg-assignee-text">
                    <b>{item.assignee}</b>
                    <small>{item.role}</small>
                  </div>
                </div>

                <div className="tsg-meta-item">
                  <Clock3 size={14} />
                  <span>Est: {item.estimate}</span>
                </div>
              </div>

              <div className="tsg-card-actions">
                <button
                  className="tsg-action-btn tsg-action-edit"
                  onClick={() => setEditingItem({ ...item })}
                  title="Customize task assignment"
                >
                  <Edit3 size={13} /> Edit
                </button>
                <button
                  className="tsg-action-btn tsg-action-dismiss"
                  onClick={() => handleDismiss(item.id)}
                  title="Dismiss suggestion"
                >
                  <Trash2 size={14} />
                </button>
                <button
                  className={`tsg-action-btn tsg-action-accept ${
                    item.accepted ? "accepted" : ""
                  }`}
                  onClick={() => !item.accepted && handleAccept(item.id)}
                  disabled={item.accepted}
                >
                  {item.accepted ? (
                    <>
                      <Check size={14} /> Assigned
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={14} /> Accept & Assign
                    </>
                  )}
                </button>
              </div>
            </footer>
          </article>
        ))}

        {filteredSuggestions.length === 0 && (
          <div className="tsg-empty">
            <div className="tsg-empty-icon">
              <Sparkles size={26} />
            </div>
            <h3>No matching suggestions found</h3>
            <p>
              Try clearing filters or search keywords, or click "Refresh Suggestions" to run an AI analysis across the codebase and sprint boards.
            </p>
            <button
              className="tsg-btn tsg-btn-primary"
              onClick={() => {
                setActiveCategory("All Suggestions");
                setImpactFilter("All");
                setSearch("");
              }}
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>

      {/* Edit / Customize Modal */}
      {editingItem && (
        <div
          className="tsg-modal-overlay"
          onClick={(e) => e.target === e.currentTarget && setEditingItem(null)}
        >
          <form className="tsg-modal" onSubmit={handleSaveEdit}>
            <div className="tsg-modal-header">
              <h2>Customize Task Assignment</h2>
              <button
                type="button"
                className="tsg-modal-close"
                onClick={() => setEditingItem(null)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="tsg-form-group">
              <label>Task Title</label>
              <input
                type="text"
                value={editingItem.title}
                onChange={(e) =>
                  setEditingItem({ ...editingItem, title: e.target.value })
                }
                required
              />
            </div>

            <div className="tsg-form-group">
              <label>Assignee</label>
              <select
                value={editingItem.assignee}
                onChange={(e) =>
                  setEditingItem({ ...editingItem, assignee: e.target.value })
                }
              >
                <option value="Komal Pawar">Komal Pawar (Frontend / Team Lead)</option>
                <option value="Aarav Shah">Aarav Shah (Backend Developer)</option>
                <option value="Priya Rao">Priya Rao (UI/UX Designer)</option>
                <option value="Rohan Kulkarni">Rohan Kulkarni (QA Engineer)</option>
                <option value="Neha Patil">Neha Patil (Full Stack Developer)</option>
              </select>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div className="tsg-form-group">
                <label>Estimated Effort</label>
                <input
                  type="text"
                  value={editingItem.estimate}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, estimate: e.target.value })
                  }
                />
              </div>

              <div className="tsg-form-group">
                <label>Priority / Impact</label>
                <select
                  value={editingItem.impact}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, impact: e.target.value })
                  }
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </div>

            <div className="tsg-form-group">
              <label>Project</label>
              <input
                type="text"
                value={editingItem.project}
                onChange={(e) =>
                  setEditingItem({ ...editingItem, project: e.target.value })
                }
              />
            </div>

            <div className="tsg-modal-footer">
              <button
                type="button"
                className="tsg-btn tsg-btn-secondary"
                onClick={() => setEditingItem(null)}
              >
                Cancel
              </button>
              <button type="submit" className="tsg-btn tsg-btn-primary">
                Save & Update
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
