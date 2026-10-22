import React, { useEffect, useMemo, useState } from "react";

import {
  Search,
  Bell,
  CircleHelp,
  ChevronDown,
  Plus,
  Bug,
  AlertTriangle,
  Clock3,
  CheckCircle2,
  Sparkles,
  MoreVertical,
  X,
  CalendarDays,
  UserRound,
  FolderKanban,
  ShieldAlert,
  BrainCircuit,
  Trash2,
  ArrowRight,
  WandSparkles,
} from "lucide-react";

import AppSidebar from "../../layouts/AppSidebar.jsx";

import {
  initialBugs,
  bugProjects,
  bugMembers,
  bugStatuses,
  bugPriorities,
} from "./bugdata.js";

import "./Bugs.css";

const STORAGE_KEY = "teamflow_bugs";

const getStoredBugs = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    return saved ? JSON.parse(saved) : initialBugs;
  } catch {
    return initialBugs;
  }
};

function Bugs() {
  const [bugs, setBugs] = useState(getStoredBugs);

  const [search, setSearch] = useState("");

  const [filter, setFilter] = useState("All Bugs");

  const [selectedBug, setSelectedBug] = useState(null);

  const [showDetails, setShowDetails] = useState(false);

  const [showModal, setShowModal] = useState(false);

  const [openMenu, setOpenMenu] = useState(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bugs));
  }, [bugs]);

  const stats = useMemo(() => {
    return {
      total: bugs.length,

      open: bugs.filter((bug) => bug.status === "Open").length,

      progress: bugs.filter(
        (bug) => bug.status === "In Progress"
      ).length,

      resolved: bugs.filter(
        (bug) => bug.status === "Resolved"
      ).length,
    };
  }, [bugs]);

  const filteredBugs = useMemo(() => {
    return bugs.filter((bug) => {
      const query = search.toLowerCase();

      const matchesSearch =
        bug.title.toLowerCase().includes(query) ||
        bug.id.toLowerCase().includes(query) ||
        bug.project.toLowerCase().includes(query) ||
        bug.assignee.toLowerCase().includes(query);

      let matchesFilter = true;

      if (filter === "Open") {
        matchesFilter = bug.status === "Open";
      }

      if (filter === "In Progress") {
        matchesFilter = bug.status === "In Progress";
      }

      if (filter === "Review") {
        matchesFilter = bug.status === "Review";
      }

      if (filter === "Resolved") {
        matchesFilter = bug.status === "Resolved";
      }

      return matchesSearch && matchesFilter;
    });
  }, [bugs, search, filter]);

  const createBug = (data) => {
    const newBug = {
      id: `BUG-${100 + bugs.length + 1}`,

      title: data.title,

      description: data.description,

      project: data.project,

      status: "Open",

      priority: data.priority,

      severity: data.severity,

      assignee: data.assignee,

      reporter: "Himanshu",

      createdAt: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),

      aiConfidence: Math.floor(Math.random() * 10) + 88,

      aiCategory: getAICategory(data.title, data.description),

      aiSuggestion: getAISuggestion(
        data.title,
        data.description
      ),
    };

    setBugs((previous) => [newBug, ...previous]);

    setShowModal(false);
  };

  const deleteBug = (id) => {
    if (!window.confirm("Delete this bug?")) {
      return;
    }

    setBugs((previous) =>
      previous.filter((bug) => bug.id !== id)
    );

    if (selectedBug?.id === id) {
      setSelectedBug(null);
      setShowDetails(false);
    }

    setOpenMenu(null);
  };

  const updateStatus = (id, status) => {
    setBugs((previous) =>
      previous.map((bug) =>
        bug.id === id
          ? {
              ...bug,
              status,
            }
          : bug
      )
    );

    setSelectedBug((previous) =>
      previous?.id === id
        ? {
            ...previous,
            status,
          }
        : previous
    );
  };

  const openBug = (bug) => {
    setSelectedBug(bug);

    setShowDetails(true);

    setOpenMenu(null);
  };

  return (
    <div className="bugs-app">
      <AppSidebar />

      {/* FIXED TOPBAR */}

      <header className="bugs-topbar">
        <div className="bugs-global-search">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search bugs, projects, members..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <div className="bugs-topbar-right">
          <button
            type="button"
            className="bugs-topbar-icon"
            aria-label="Notifications"
          >
            <Bell size={19} />
          </button>

          <button
            type="button"
            className="bugs-topbar-icon"
            aria-label="Help"
          >
            <CircleHelp size={19} />
          </button>

          <button type="button" className="bugs-profile">
            <div className="bugs-profile-avatar">HR</div>

            <div className="bugs-profile-info">
              <strong>Himanshu</strong>

              <span>Tech Team</span>
            </div>

            <ChevronDown size={16} />
          </button>
        </div>
      </header>

      {/* MAIN */}

      <main className="bugs-main">
        <div className="bugs-content">
          {/* HEADER */}

          <section className="bugs-title-row">
            <div>
              <div className="bugs-heading-with-ai">
                <h1>BugFlow AI</h1>

                <span className="bugs-ai-label">
                  <Sparkles size={13} />
                  AI Powered
                </span>
              </div>

              <p>
                Track, analyze and resolve bugs faster with AI.
              </p>
            </div>

            <button
              type="button"
              className="bug-primary-btn"
              onClick={() => setShowModal(true)}
            >
              <Plus size={18} />
              Report Bug
            </button>
          </section>

          {/* STATS */}

          <section className="bug-stats">
            <StatCard
              icon={<Bug />}
              value={stats.total}
              label="Total Bugs"
              className="purple"
            />

            <StatCard
              icon={<AlertTriangle />}
              value={stats.open}
              label="Open Bugs"
              className="red"
            />

            <StatCard
              icon={<Clock3 />}
              value={stats.progress}
              label="In Progress"
              className="orange"
            />

            <StatCard
              icon={<CheckCircle2 />}
              value={stats.resolved}
              label="Resolved"
              className="green"
            />
          </section>

          {/* AI INSIGHT */}

          <section className="bug-ai-banner">
            <div className="bug-ai-banner-icon">
              <BrainCircuit size={24} />
            </div>

            <div className="bug-ai-banner-content">
              <div>
                <span>BugFlow AI Insight</span>

                <strong>
                  Authentication and UI issues need the most attention
                </strong>
              </div>

              <p>
                AI analyzed your current bug list and recommends
                prioritizing critical authentication and file upload
                issues first.
              </p>
            </div>

            <button type="button">
              <WandSparkles size={16} />
              Analyze Bugs
            </button>
          </section>

          {/* FILTERS */}

          <section className="bugs-controls">
            <div className="bug-tabs">
              {[
                "All Bugs",
                "Open",
                "In Progress",
                "Review",
                "Resolved",
              ].map((tab) => (
                <button
                  type="button"
                  key={tab}
                  className={
                    filter === tab
                      ? "bug-tab active"
                      : "bug-tab"
                  }
                  onClick={() => setFilter(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="bug-search">
              <Search size={17} />

              <input
                type="text"
                placeholder="Search bugs..."
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
              />
            </div>
          </section>

          {/* BUG TABLE */}

          {filteredBugs.length > 0 ? (
            <div className="bugs-table-wrap">
              <table className="bugs-table">
                <thead>
                  <tr>
                    <th>Bug</th>
                    <th>Project</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Assignee</th>
                    <th>AI Analysis</th>
                    <th>Created</th>
                    <th></th>
                  </tr>
                </thead>

                <tbody>
                  {filteredBugs.map((bug) => (
                    <BugRow
                      key={bug.id}
                      bug={bug}
                      openMenu={openMenu}
                      setOpenMenu={setOpenMenu}
                      onOpen={() => openBug(bug)}
                      onDelete={() => deleteBug(bug.id)}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bugs-empty">
              <Bug size={45} />

              <h3>No bugs found</h3>

              <p>
                Try changing your filter or report a new bug.
              </p>

              <button
                type="button"
                className="bug-primary-btn"
                onClick={() => setShowModal(true)}
              >
                <Plus size={17} />
                Report Bug
              </button>
            </div>
          )}
        </div>
      </main>

      {/* DETAILS */}

      {showDetails && selectedBug && (
        <BugDetails
          bug={selectedBug}
          onClose={() => setShowDetails(false)}
          onStatusChange={updateStatus}
        />
      )}

      {/* CREATE BUG */}

      {showModal && (
        <BugModal
          onClose={() => setShowModal(false)}
          onSave={createBug}
        />
      )}
    </div>
  );
}

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({ icon, value, label, className }) {
  return (
    <article className="bug-stat-card">
      <div className={`bug-stat-icon ${className}`}>
        {icon}
      </div>

      <div>
        <strong>{value}</strong>

        <span>{label}</span>
      </div>
    </article>
  );
}

/* =========================================================
   BUG ROW
========================================================= */

function BugRow({
  bug,
  openMenu,
  setOpenMenu,
  onOpen,
  onDelete,
}) {
  return (
    <tr>
      <td>
        <button
          type="button"
          className="bug-title-cell"
          onClick={onOpen}
        >
          <span className="bug-id">{bug.id}</span>

          <strong>{bug.title}</strong>

          <small>{bug.description}</small>
        </button>
      </td>

      <td>
        <span className="bug-project">
          <FolderKanban size={15} />

          {bug.project}
        </span>
      </td>

      <td>
        <PriorityBadge priority={bug.priority} />
      </td>

      <td>
        <StatusBadge status={bug.status} />
      </td>

      <td>
        <div className="bug-assignee">
          <span>{getInitials(bug.assignee)}</span>

          {bug.assignee}
        </div>
      </td>

      <td>
        <div className="bug-ai-score">
          <Sparkles size={14} />

          <div>
            <strong>{bug.aiConfidence}%</strong>

            <span>{bug.aiCategory}</span>
          </div>
        </div>
      </td>

      <td>
        <span className="bug-date">
          <CalendarDays size={14} />

          {bug.createdAt}
        </span>
      </td>

      <td>
        <div className="bug-menu-wrap">
          <button
            type="button"
            className="bug-icon-btn"
            onClick={() =>
              setOpenMenu(
                openMenu === bug.id ? null : bug.id
              )
            }
          >
            <MoreVertical size={18} />
          </button>

          {openMenu === bug.id && (
            <div className="bug-menu">
              <button type="button" onClick={onOpen}>
                View Details
              </button>

              <button
                type="button"
                className="danger"
                onClick={onDelete}
              >
                <Trash2 size={14} />
                Delete
              </button>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
}

/* =========================================================
   BADGES
========================================================= */

function PriorityBadge({ priority }) {
  return (
    <span
      className={`bug-priority ${priority
        .toLowerCase()
        .replaceAll(" ", "-")}`}
    >
      {priority}
    </span>
  );
}

function StatusBadge({ status }) {
  return (
    <span
      className={`bug-status ${status
        .toLowerCase()
        .replaceAll(" ", "-")}`}
    >
      {status}
    </span>
  );
}

/* =========================================================
   BUG DETAILS
========================================================= */

function BugDetails({
  bug,
  onClose,
  onStatusChange,
}) {
  return (
    <>
      <div
        className="bug-drawer-overlay"
        onClick={onClose}
      />

      <aside className="bug-details-drawer">
        <div className="bug-details-header">
          <div>
            <span>{bug.id}</span>

            <h2>{bug.title}</h2>
          </div>

          <button type="button" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="bug-details-body">
          <section className="bug-detail-section">
            <div className="bug-detail-badges">
              <PriorityBadge priority={bug.priority} />

              <StatusBadge status={bug.status} />
            </div>

            <h3>Description</h3>

            <p>{bug.description}</p>
          </section>

          <section className="bug-detail-grid">
            <DetailItem
              icon={<FolderKanban />}
              label="Project"
              value={bug.project}
            />

            <DetailItem
              icon={<UserRound />}
              label="Assignee"
              value={bug.assignee}
            />

            <DetailItem
              icon={<ShieldAlert />}
              label="Severity"
              value={bug.severity}
            />

            <DetailItem
              icon={<CalendarDays />}
              label="Created"
              value={bug.createdAt}
            />
          </section>

          <section className="bug-ai-analysis">
            <div className="bug-ai-analysis-heading">
              <div>
                <BrainCircuit size={21} />
              </div>

              <div>
                <span>BugFlow AI Analysis</span>

                <strong>{bug.aiConfidence}% confidence</strong>
              </div>
            </div>

            <div className="bug-ai-category">
              <span>Detected Category</span>

              <strong>{bug.aiCategory}</strong>
            </div>

            <div className="bug-ai-suggestion">
              <span>Suggested Fix</span>

              <p>{bug.aiSuggestion}</p>
            </div>
          </section>

          <section className="bug-detail-section">
            <h3>Update Status</h3>

            <div className="bug-status-flow">
              {bugStatuses.map((status) => (
                <button
                  type="button"
                  key={status}
                  className={
                    bug.status === status ? "active" : ""
                  }
                  onClick={() =>
                    onStatusChange(bug.id, status)
                  }
                >
                  {status}

                  {bug.status !== status && (
                    <ArrowRight size={13} />
                  )}
                </button>
              ))}
            </div>
          </section>
        </div>
      </aside>
    </>
  );
}

function DetailItem({ icon, label, value }) {
  return (
    <div className="bug-detail-item">
      <div>{icon}</div>

      <span>{label}</span>

      <strong>{value}</strong>
    </div>
  );
}

/* =========================================================
   CREATE BUG MODAL
========================================================= */

function BugModal({ onClose, onSave }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    project: bugProjects[0],
    priority: "Medium",
    severity: "Medium",
    assignee: bugMembers[0],
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.title.trim()) {
      alert("Please enter a bug title.");
      return;
    }

    if (!form.description.trim()) {
      alert("Please enter a description.");
      return;
    }

    onSave(form);
  };

  return (
    <div className="bug-modal-overlay">
      <form
        className="bug-modal"
        onSubmit={handleSubmit}
      >
        <div className="bug-modal-header">
          <div>
            <span>BugFlow AI</span>

            <h2>Report New Bug</h2>

            <p>
              AI will automatically analyze and categorize the bug.
            </p>
          </div>

          <button type="button" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="bug-form">
          <label className="full">
            Bug Title

            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Login button not responding"
            />
          </label>

          <label className="full">
            Description

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe the problem..."
            />
          </label>

          <label>
            Project

            <select
              name="project"
              value={form.project}
              onChange={handleChange}
            >
              {bugProjects.map((project) => (
                <option key={project}>
                  {project}
                </option>
              ))}
            </select>
          </label>

          <label>
            Assignee

            <select
              name="assignee"
              value={form.assignee}
              onChange={handleChange}
            >
              {bugMembers.map((member) => (
                <option key={member}>
                  {member}
                </option>
              ))}
            </select>
          </label>

          <label>
            Priority

            <select
              name="priority"
              value={form.priority}
              onChange={handleChange}
            >
              {bugPriorities.map((priority) => (
                <option key={priority}>
                  {priority}
                </option>
              ))}
            </select>
          </label>

          <label>
            Severity

            <select
              name="severity"
              value={form.severity}
              onChange={handleChange}
            >
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
          </label>
        </div>

        <div className="bug-modal-actions">
          <button
            type="button"
            className="bug-cancel-btn"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="bug-primary-btn"
          >
            <Sparkles size={17} />

            Analyze & Report Bug
          </button>
        </div>
      </form>
    </div>
  );
}

/* =========================================================
   SIMPLE AI DEMO
========================================================= */

function getAICategory(title, description) {
  const text = `${title} ${description}`.toLowerCase();

  if (
    text.includes("login") ||
    text.includes("password") ||
    text.includes("auth")
  ) {
    return "Authentication";
  }

  if (
    text.includes("slow") ||
    text.includes("loading")
  ) {
    return "Performance";
  }

  if (
    text.includes("mobile") ||
    text.includes("responsive") ||
    text.includes("button") ||
    text.includes("sidebar")
  ) {
    return "UI / Responsive";
  }

  if (
    text.includes("file") ||
    text.includes("upload")
  ) {
    return "File Upload";
  }

  if (
    text.includes("api") ||
    text.includes("server")
  ) {
    return "Backend / API";
  }

  return "Application Logic";
}

function getAISuggestion(title, description) {
  const category = getAICategory(title, description);

  const suggestions = {
    Authentication:
      "Check authentication API responses, login handlers, token storage, and session validation.",

    Performance:
      "Review network requests, database queries, component re-renders, caching, and pagination.",

    "UI / Responsive":
      "Review CSS breakpoints, container widths, fixed positioning, overflow, and responsive layout rules.",

    "File Upload":
      "Check file size validation, multipart request configuration, storage limits, and backend upload settings.",

    "Backend / API":
      "Inspect API request payloads, server logs, error handling, response codes, and database operations.",

    "Application Logic":
      "Reproduce the issue, inspect related state changes, validate conditions, and check browser console errors.",
  };

  return suggestions[category];
}

function getInitials(name) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default Bugs;