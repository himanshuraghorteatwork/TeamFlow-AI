import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  BrainCircuit,
  Bug as BugIcon,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FolderKanban,
  Plus,
  Search,
  ShieldAlert,
  Sparkles,
  Trash2,
  UserRound,
  WandSparkles,
  X,
} from "lucide-react";
import {
  bugMembers,
  bugPriorities,
  bugProjects,
  bugStatuses,
  initialBugs,
} from "../Employee/bugdata.js";
import "./Bug.css";

const STORAGE_KEY = "teamflow_bugs";
const FILTERS = ["All Bugs", "Open", "In Progress", "Review", "Resolved"];

function getStoredBugs() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return initialBugs;

    const bugs = JSON.parse(saved);
    if (!Array.isArray(bugs)) {
      throw new TypeError("Saved bugs must be an array.");
    }
    return bugs;
  } catch (error) {
    console.error("Failed to load bugs for the Team Lead dashboard:", error);
    return initialBugs;
  }
}

function getInitials(name = "") {
  return name
    .trim()
    .split(/\s+/)
    .map(part => part[0] || "")
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function getCategory(title, description) {
  const text = `${title} ${description}`.toLowerCase();
  if (/login|password|auth/.test(text)) return "Authentication";
  if (/slow|loading|performance/.test(text)) return "Performance";
  if (/mobile|responsive|button|sidebar/.test(text)) return "UI / Responsive";
  if (/file|upload/.test(text)) return "File Upload";
  if (/api|server/.test(text)) return "Backend / API";
  return "Application Logic";
}

function getSuggestion(category) {
  const suggestions = {
    Authentication: "Review authentication responses, login handlers, token storage, and session validation.",
    Performance: "Review network requests, database queries, caching, and unnecessary component updates.",
    "UI / Responsive": "Check responsive breakpoints, container widths, overflow, and mobile layout rules.",
    "File Upload": "Check upload size limits, request configuration, storage constraints, and validation.",
    "Backend / API": "Inspect request payloads, server logs, response codes, and related database operations.",
    "Application Logic": "Reproduce the issue, inspect related state changes, and validate the affected conditions.",
  };
  return suggestions[category];
}

function StatCard({ icon: Icon, label, value, tone }) {
  return (
    <article className="tl-bug-stat">
      <span className={`tl-bug-stat-icon ${tone}`}><Icon size={21} aria-hidden="true" /></span>
      <div><strong>{value}</strong><span>{label}</span></div>
    </article>
  );
}

function PriorityBadge({ priority = "Medium" }) {
  const className = priority.toLowerCase().replaceAll(" ", "-");
  return <span className={`tl-bug-priority ${className}`}>{priority}</span>;
}

function StatusBadge({ status = "Open" }) {
  const className = status.toLowerCase().replaceAll(" ", "-");
  return <span className={`tl-bug-status ${className}`}><i />{status}</span>;
}

function ReportBugModal({ onClose, onSave }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    project: bugProjects[0],
    assignee: bugMembers[0],
    priority: "Medium",
    severity: "Medium",
  });

  function updateField(event) {
    const { name, value } = event.target;
    setForm(previous => ({ ...previous, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!form.title.trim() || !form.description.trim()) return;
    onSave(form);
  }

  return (
    <div className="tl-bug-modal-overlay" onMouseDown={event => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <form className="tl-bug-modal" onSubmit={handleSubmit}>
        <header className="tl-bug-modal-header">
          <div>
            <span><Sparkles size={14} /> BugFlow AI</span>
            <h2>Report a bug</h2>
            <p>Capture the issue and assign it to a project teammate.</p>
          </div>
          <button type="button" className="tl-bug-close" onClick={onClose} aria-label="Close report form">
            <X size={19} />
          </button>
        </header>

        <label className="tl-bug-form-field full">
          Bug title
          <input name="title" value={form.title} onChange={updateField} required maxLength={120} placeholder="e.g. Login button is not responding" />
        </label>
        <label className="tl-bug-form-field full">
          Description
          <textarea name="description" value={form.description} onChange={updateField} required rows={4} placeholder="Describe what happened and how to reproduce it..." />
        </label>
        <div className="tl-bug-form-grid">
          <label className="tl-bug-form-field">
            Project
            <select name="project" value={form.project} onChange={updateField}>
              {bugProjects.map(project => <option key={project}>{project}</option>)}
            </select>
          </label>
          <label className="tl-bug-form-field">
            Assignee
            <select name="assignee" value={form.assignee} onChange={updateField}>
              {bugMembers.map(member => <option key={member}>{member}</option>)}
            </select>
          </label>
          <label className="tl-bug-form-field">
            Priority
            <select name="priority" value={form.priority} onChange={updateField}>
              {bugPriorities.map(priority => <option key={priority}>{priority}</option>)}
            </select>
          </label>
          <label className="tl-bug-form-field">
            Severity
            <select name="severity" value={form.severity} onChange={updateField}>
              {["High", "Medium", "Low"].map(severity => <option key={severity}>{severity}</option>)}
            </select>
          </label>
        </div>
        <footer className="tl-bug-modal-actions">
          <button type="button" className="tl-bug-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="tl-bug-primary"><WandSparkles size={16} /> Analyze &amp; Report</button>
        </footer>
      </form>
    </div>
  );
}

function BugDetails({ bug, onClose, onStatusChange }) {
  return (
    <div className="tl-bug-drawer-overlay" onMouseDown={event => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <aside className="tl-bug-drawer">
        <header className="tl-bug-drawer-header">
          <div><span>{bug.id}</span><h2>{bug.title}</h2></div>
          <button type="button" className="tl-bug-close" onClick={onClose} aria-label="Close bug details"><X size={19} /></button>
        </header>
        <div className="tl-bug-drawer-body">
          <div className="tl-bug-detail-badges"><PriorityBadge priority={bug.priority} /><StatusBadge status={bug.status} /></div>
          <section className="tl-bug-detail-section">
            <h3>Description</h3><p>{bug.description}</p>
          </section>
          <section className="tl-bug-detail-grid">
            <div><FolderKanban size={17} /><span>Project</span><b>{bug.project}</b></div>
            <div><UserRound size={17} /><span>Assignee</span><b>{bug.assignee}</b></div>
            <div><ShieldAlert size={17} /><span>Severity</span><b>{bug.severity}</b></div>
            <div><CalendarDays size={17} /><span>Created</span><b>{bug.createdAt}</b></div>
          </section>
          <section className="tl-bug-ai-analysis">
            <div className="tl-bug-ai-title"><BrainCircuit size={20} /><div><span>BugFlow AI Analysis</span><b>{bug.aiConfidence}% confidence</b></div></div>
            <div><span>Detected category</span><b>{bug.aiCategory}</b></div>
            <div><span>Suggested next step</span><p>{bug.aiSuggestion}</p></div>
          </section>
          <section className="tl-bug-detail-section">
            <h3>Update status</h3>
            <div className="tl-bug-status-flow">
              {bugStatuses.map(status => (
                <button type="button" key={status} className={bug.status === status ? "selected" : ""} onClick={() => onStatusChange(bug.id, status)}>
                  {status}{bug.status !== status && <ArrowRight size={13} />}
                </button>
              ))}
            </div>
          </section>
        </div>
      </aside>
    </div>
  );
}

export default function Bug() {
  const [bugs, setBugs] = useState(getStoredBugs);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All Bugs");
  const [selectedBug, setSelectedBug] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bugs));
    } catch (error) {
      console.error("Failed to save bugs from the Team Lead dashboard:", error);
    }
  }, [bugs]);

  const stats = useMemo(() => ({
    total: bugs.length,
    open: bugs.filter(bug => bug.status === "Open").length,
    progress: bugs.filter(bug => bug.status === "In Progress").length,
    resolved: bugs.filter(bug => bug.status === "Resolved").length,
  }), [bugs]);

  const filteredBugs = useMemo(() => {
    const query = search.trim().toLowerCase();
    return bugs.filter(bug => {
      const matchesSearch = !query
        || [bug.title, bug.id, bug.project, bug.assignee]
          .some(value => value?.toLowerCase().includes(query));
      const matchesFilter = filter === "All Bugs" || bug.status === filter;
      return matchesSearch && matchesFilter;
    });
  }, [bugs, search, filter]);

  function createBug(form) {
    const category = getCategory(form.title, form.description);
    const newBug = {
      ...form,
      id: `BUG-${Date.now()}`,
      status: "Open",
      reporter: "Priya Sharma",
      createdAt: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      aiConfidence: 90,
      aiCategory: category,
      aiSuggestion: getSuggestion(category),
    };
    setBugs(previous => [newBug, ...previous]);
    setShowModal(false);
  }

  function deleteBug(bug) {
    if (!window.confirm(`Delete "${bug.title}"? This cannot be undone.`)) return;
    setBugs(previous => previous.filter(item => item.id !== bug.id));
    if (selectedBug?.id === bug.id) setSelectedBug(null);
  }

  function updateStatus(id, status) {
    setBugs(previous => previous.map(bug => (
      bug.id === id ? { ...bug, status } : bug
    )));
    setSelectedBug(previous => previous?.id === id ? { ...previous, status } : previous);
  }

  return (
    <section className="tl-bug-page">
      <header className="tl-bug-page-header">
        <div>
          <div className="tl-bug-heading">
            <h1>BugFlow AI</h1><span><Sparkles size={13} /> AI Powered</span>
          </div>
          <p>Track, analyze, and resolve your team's bugs faster.</p>
        </div>
        <button type="button" className="tl-bug-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} /> Report Bug
        </button>
      </header>

      <section className="tl-bug-stats" aria-label="Bug summary">
        <StatCard icon={BugIcon} value={stats.total} label="Total Bugs" tone="purple" />
        <StatCard icon={AlertTriangle} value={stats.open} label="Open Bugs" tone="red" />
        <StatCard icon={Clock3} value={stats.progress} label="In Progress" tone="orange" />
        <StatCard icon={CheckCircle2} value={stats.resolved} label="Resolved" tone="green" />
      </section>

      <section className="tl-bug-ai-banner">
        <span className="tl-bug-ai-banner-icon"><BrainCircuit size={23} /></span>
        <div>
          <span>BugFlow AI Insight</span>
          <strong>Authentication and UI issues need the most attention</strong>
          <p>Prioritize critical authentication and file upload issues to reduce their impact on the team.</p>
        </div>
        <button type="button" onClick={() => setFilter("Open")}><WandSparkles size={16} /> Review open bugs</button>
      </section>

      <section className="tl-bug-workspace">
        <div className="tl-bug-controls">
          <div className="tl-bug-tabs" role="tablist" aria-label="Filter bugs by status">
            {FILTERS.map(tab => (
              <button type="button" role="tab" aria-selected={filter === tab} key={tab} className={filter === tab ? "active" : ""} onClick={() => setFilter(tab)}>
                {tab}
                {tab === "All Bugs" && <span>{bugs.length}</span>}
              </button>
            ))}
          </div>
          <label className="tl-bug-search">
            <Search size={17} aria-hidden="true" />
            <input type="search" placeholder="Search bugs, projects, members..." value={search} onChange={event => setSearch(event.target.value)} />
          </label>
        </div>

        {filteredBugs.length > 0 ? (
          <div className="tl-bug-table-scroll">
            <table className="tl-bug-table">
              <thead><tr><th>Bug</th><th>Project</th><th>Priority</th><th>Status</th><th>Assignee</th><th>AI Analysis</th><th>Created</th><th aria-label="Actions" /></tr></thead>
              <tbody>
                {filteredBugs.map(bug => (
                  <tr key={bug.id}>
                    <td>
                      <button type="button" className="tl-bug-title-cell" onClick={() => setSelectedBug(bug)}>
                        <span>{bug.id}</span><strong>{bug.title}</strong><small>{bug.description}</small>
                      </button>
                    </td>
                    <td><span className="tl-bug-project"><FolderKanban size={15} />{bug.project}</span></td>
                    <td><PriorityBadge priority={bug.priority} /></td>
                    <td><StatusBadge status={bug.status} /></td>
                    <td><span className="tl-bug-assignee"><i>{getInitials(bug.assignee)}</i>{bug.assignee}</span></td>
                    <td><span className="tl-bug-ai-score"><Sparkles size={14} /><span><b>{bug.aiConfidence}%</b><small>{bug.aiCategory}</small></span></span></td>
                    <td><span className="tl-bug-date"><CalendarDays size={14} />{bug.createdAt}</span></td>
                    <td><button type="button" className="tl-bug-delete" aria-label={`Delete ${bug.title}`} onClick={() => deleteBug(bug)}><Trash2 size={16} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="tl-bug-empty">
            <BugIcon size={40} /><h2>No bugs found</h2><p>Try changing the status filter or your search.</p>
          </div>
        )}
      </section>

      {selectedBug && <BugDetails bug={selectedBug} onClose={() => setSelectedBug(null)} onStatusChange={updateStatus} />}
      {showModal && <ReportBugModal onClose={() => setShowModal(false)} onSave={createBug} />}
    </section>
  );
}