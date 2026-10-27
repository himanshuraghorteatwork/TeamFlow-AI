import React, { useMemo, useState } from "react";
import {
  BarChart3,
  TrendingUp,
  FolderKanban,
  AlertTriangle,
  Download,
  Search,
  Eye,
  ShieldCheck,
  FileSpreadsheet,
  X,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import "./ProjectReports.css";

const VELOCITY_DATA = [
  { sprint: "Sprint 11", planned: 42, completed: 39 },
  { sprint: "Sprint 12", planned: 48, completed: 46 },
  { sprint: "Sprint 13", planned: 50, completed: 48 },
  { sprint: "Sprint 14", planned: 55, completed: 51 },
  { sprint: "Sprint 15", planned: 58, completed: 54 },
];

const INITIAL_PROJECTS = [
  {
    id: "PRJ-01",
    name: "TeamFlow Website",
    category: "Web Application",
    tone: "purple",
    status: "On Track",
    statusType: "on-track",
    progress: 85,
    tasksTotal: 34,
    tasksCompleted: 29,
    hoursBudgeted: 220,
    hoursSpent: 185,
    dueDate: "Nov 12, 2026",
    lead: "Komal Pawar",
    members: ["KP", "AS", "PR", "NP"],
    blockers: 0,
    milestones: [
      { name: "Phase 1: Brand & Layout Refresh", status: "Completed", date: "Oct 10" },
      { name: "Phase 2: Authentication Flow", status: "Completed", date: "Oct 22" },
      { name: "Phase 3: Interactive Dashboards", status: "In Progress", date: "Nov 05" },
      { name: "Phase 4: Deployment & CDN Setup", status: "Pending", date: "Nov 12" },
    ],
  },
  {
    id: "PRJ-02",
    name: "Mobile Application",
    category: "React Native / iOS & Android",
    tone: "blue",
    status: "At Risk",
    statusType: "at-risk",
    progress: 62,
    tasksTotal: 42,
    tasksCompleted: 26,
    hoursBudgeted: 310,
    hoursSpent: 225,
    dueDate: "Nov 28, 2026",
    lead: "Aarav Shah",
    members: ["AS", "RK", "PR"],
    blockers: 2,
    milestones: [
      { name: "Design System & Mobile Screens", status: "Completed", date: "Oct 05" },
      { name: "Push Notification Service", status: "In Progress", date: "Nov 10" },
      { name: "Offline Sync Engine", status: "At Risk", date: "Nov 20" },
      { name: "Store Submission & QA", status: "Pending", date: "Nov 28" },
    ],
  },
  {
    id: "PRJ-03",
    name: "AI Integration Engine",
    category: "Machine Learning / API",
    tone: "green",
    status: "On Track",
    statusType: "on-track",
    progress: 40,
    tasksTotal: 25,
    tasksCompleted: 10,
    hoursBudgeted: 180,
    hoursSpent: 72,
    dueDate: "Dec 15, 2026",
    lead: "Neha Patil",
    members: ["NP", "KP", "AS"],
    blockers: 0,
    milestones: [
      { name: "API Schema & Gemini Client", status: "Completed", date: "Oct 18" },
      { name: "Prompt Pipelines & Token Cache", status: "In Progress", date: "Nov 18" },
      { name: "Smart Task Suggester Engine", status: "In Progress", date: "Dec 02" },
      { name: "Benchmarking & Eval Suite", status: "Pending", date: "Dec 15" },
    ],
  },
  {
    id: "PRJ-04",
    name: "Marketing & Growth Portal",
    category: "Landing & Analytics",
    tone: "orange",
    status: "Delayed",
    statusType: "delayed",
    progress: 25,
    tasksTotal: 20,
    tasksCompleted: 5,
    hoursBudgeted: 140,
    hoursSpent: 48,
    dueDate: "Dec 20, 2026",
    lead: "Priya Rao",
    members: ["PR", "NP"],
    blockers: 1,
    milestones: [
      { name: "Conversion Wireframes & Copy", status: "Completed", date: "Oct 24" },
      { name: "CMS Integration (Headless)", status: "Delayed", date: "Nov 15" },
      { name: "SEO Optimization & Tracking", status: "Pending", date: "Dec 05" },
      { name: "Public Launch Campaign", status: "Pending", date: "Dec 20" },
    ],
  },
  {
    id: "PRJ-05",
    name: "Analytics Module 2.0",
    category: "Enterprise Reporting",
    tone: "pink",
    status: "Completed",
    statusType: "completed",
    progress: 100,
    tasksTotal: 30,
    tasksCompleted: 30,
    hoursBudgeted: 160,
    hoursSpent: 152,
    dueDate: "Oct 20, 2026",
    lead: "Rohan Kulkarni",
    members: ["RK", "KP"],
    blockers: 0,
    milestones: [
      { name: "Database Schema Migration", status: "Completed", date: "Sep 28" },
      { name: "Recharts Custom Dashboards", status: "Completed", date: "Oct 10" },
      { name: "CSV / PDF Exporter", status: "Completed", date: "Oct 18" },
      { name: "Final Acceptance Testing", status: "Completed", date: "Oct 20" },
    ],
  },
];

const FILTERS = ["All Projects", "On Track", "At Risk", "Delayed", "Completed"];

export default function ProjectReports() {
  const [projects] = useState(INITIAL_PROJECTS);
  const [activeFilter, setActiveFilter] = useState("All Projects");
  const [search, setSearch] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);
  const [exportNotice, setExportNotice] = useState("");

  const stats = useMemo(() => {
    const total = projects.length;
    const onTrack = projects.filter((p) => p.status === "On Track").length;
    const completed = projects.filter((p) => p.status === "Completed").length;
    const atRisk = projects.filter((p) => p.status === "At Risk" || p.status === "Delayed").length;
    const avgProgress = Math.round(
      projects.reduce((acc, p) => acc + p.progress, 0) / total
    );

    return {
      total,
      onTrack,
      completed,
      atRisk,
      avgProgress: `${avgProgress}%`,
      velocity: "54 pts",
    };
  }, [projects]);

  const filteredProjects = useMemo(() => {
    const q = search.trim().toLowerCase();
    return projects.filter((item) => {
      const matchesFilter =
        activeFilter === "All Projects" || item.status === activeFilter;
      const matchesSearch =
        !q ||
        [item.name, item.category, item.lead, item.status]
          .join(" ")
          .toLowerCase()
          .includes(q);
      return matchesFilter && matchesSearch;
    });
  }, [projects, activeFilter, search]);

  const handleExport = (format) => {
    setExportNotice(`Exporting project performance report as ${format}... File ready in downloads.`);
    setTimeout(() => setExportNotice(""), 3500);
  };

  return (
    <div className="pr-page">
      {/* Header */}
      <header className="pr-header">
        <div>
          <div className="pr-breadcrumb">
            Workspace <span>/</span> Reports <span>/</span> Project Reports
          </div>
          <div className="pr-title-row">
            <h1>Project Performance &amp; Reports</h1>
            <span className="pr-report-badge">
              <BarChart3 size={14} /> Live Sprint Tracking
            </span>
          </div>
          <p className="pr-header-desc">
            Analyze milestone burndown, sprint velocity, delivery risks, and resource utilization across your engineering team.
          </p>
        </div>

        <div className="pr-header-actions">
          <button
            className="pr-btn pr-btn-secondary"
            onClick={() => handleExport("CSV")}
          >
            <FileSpreadsheet size={15} /> Export CSV
          </button>
          <button
            className="pr-btn pr-btn-primary"
            onClick={() => handleExport("PDF")}
          >
            <Download size={15} /> Export PDF Report
          </button>
        </div>
      </header>

      {/* Export Notice */}
      {exportNotice && (
        <div
          style={{
            padding: "12px 18px",
            marginBottom: "20px",
            background: "#eaf3fe",
            color: "#1267d3",
            borderRadius: "10px",
            border: "1px solid #cbe1fc",
            fontWeight: 500,
          }}
        >
          {exportNotice}
        </div>
      )}

      {/* Metric Cards */}
      <section className="pr-stats-grid" aria-label="Project metrics summary">
        <article className="pr-stat-card">
          <div className="pr-stat-icon green">
            <ShieldCheck size={22} />
          </div>
          <div className="pr-stat-info">
            <span className="pr-stat-label">On-Track Projects</span>
            <strong className="pr-stat-value">
              {stats.onTrack + stats.completed} of {stats.total}
            </strong>
            <span className="pr-stat-sub">
              {Math.round(((stats.onTrack + stats.completed) / stats.total) * 100)}% delivery confidence
            </span>
          </div>
        </article>

        <article className="pr-stat-card">
          <div className="pr-stat-icon purple">
            <TrendingUp size={22} />
          </div>
          <div className="pr-stat-info">
            <span className="pr-stat-label">Sprint Velocity</span>
            <strong className="pr-stat-value">{stats.velocity}</strong>
            <span className="pr-stat-sub">+6.2% vs previous sprint</span>
          </div>
        </article>

        <article className="pr-stat-card">
          <div className="pr-stat-icon blue">
            <FolderKanban size={22} />
          </div>
          <div className="pr-stat-info">
            <span className="pr-stat-label">Average Completion</span>
            <strong className="pr-stat-value">{stats.avgProgress}</strong>
            <span className="pr-stat-sub">Across 5 tracked projects</span>
          </div>
        </article>

        <article className="pr-stat-card">
          <div className="pr-stat-icon orange">
            <AlertTriangle size={22} />
          </div>
          <div className="pr-stat-info">
            <span className="pr-stat-label">Projects at Risk</span>
            <strong className="pr-stat-value">{stats.atRisk}</strong>
            <span className="pr-stat-sub">Requires timeline review</span>
          </div>
        </article>
      </section>

      {/* Charts Row */}
      <section className="pr-charts-row">
        {/* Velocity Chart */}
        <article className="pr-panel">
          <div className="pr-panel-header">
            <div>
              <h2>Sprint Velocity (Planned vs Completed)</h2>
              <p>Story points delivered across the last 5 sprints</p>
            </div>
          </div>
          <div className="pr-chart-wrap">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={VELOCITY_DATA}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid stroke="#edf1f7" strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="sprint"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "#6d7a96" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "#6d7a96" }}
                />
                <Tooltip
                  formatter={(val, name) => [
                    `${val} pts`,
                    name === "completed" ? "Completed" : "Planned",
                  ]}
                />
                <Bar dataKey="planned" fill="#e2e8f0" radius={[4, 4, 0, 0]} />
                <Bar dataKey="completed" fill="#5963f5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>

        {/* Health Distribution */}
        <article className="pr-panel">
          <div className="pr-panel-header">
            <div>
              <h2>Project Health Breakdown</h2>
              <p>Status categorization across ongoing work</p>
            </div>
          </div>

          <div className="pr-health-list">
            <div className="pr-health-row">
              <span className="pr-health-label">
                <i className="pr-health-dot green" /> On Track
              </span>
              <div className="pr-health-bar-track">
                <span style={{ width: "40%", background: "#10b981" }} />
              </div>
              <span className="pr-health-count">2</span>
            </div>

            <div className="pr-health-row">
              <span className="pr-health-label">
                <i className="pr-health-dot blue" /> Completed
              </span>
              <div className="pr-health-bar-track">
                <span style={{ width: "20%", background: "#3b82f6" }} />
              </div>
              <span className="pr-health-count">1</span>
            </div>

            <div className="pr-health-row">
              <span className="pr-health-label">
                <i className="pr-health-dot orange" /> At Risk
              </span>
              <div className="pr-health-bar-track">
                <span style={{ width: "20%", background: "#f59e0b" }} />
              </div>
              <span className="pr-health-count">1</span>
            </div>

            <div className="pr-health-row">
              <span className="pr-health-label">
                <i className="pr-health-dot red" /> Delayed
              </span>
              <div className="pr-health-bar-track">
                <span style={{ width: "20%", background: "#ef4444" }} />
              </div>
              <span className="pr-health-count">1</span>
            </div>
          </div>
        </article>
      </section>

      {/* Toolbar */}
      <div className="pr-toolbar">
        <div className="pr-filter-tabs">
          {FILTERS.map((f) => (
            <button
              key={f}
              className={`pr-tab ${activeFilter === f ? "active" : ""}`}
              onClick={() => setActiveFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>

        <label className="pr-search-box">
          <Search size={15} />
          <input
            type="text"
            placeholder="Search projects, leads, or tech..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
      </div>

      {/* Projects Deep Dive Table */}
      <section className="pr-table-card">
        <div className="pr-table-scroll">
          <table className="pr-table">
            <thead>
              <tr>
                <th>Project</th>
                <th>Health Status</th>
                <th>Progress</th>
                <th>Tasks</th>
                <th>Hours Spent</th>
                <th>Due Date</th>
                <th>Team</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div className="pr-project-cell">
                      <div className={`pr-project-icon ${p.tone}`}>
                        <FolderKanban size={17} />
                      </div>
                      <div className="pr-project-name-col">
                        <strong>{p.name}</strong>
                        <small>{p.category}</small>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`pr-health-badge ${p.statusType}`}>
                      {p.status}
                    </span>
                  </td>
                  <td>
                    <div className="pr-progress-col">
                      <div className="pr-progress-meta">
                        <span>{p.progress}%</span>
                      </div>
                      <div className="pr-progress-track">
                        <span
                          style={{
                            width: `${p.progress}%`,
                            background:
                              p.statusType === "completed"
                                ? "#3b82f6"
                                : p.statusType === "delayed"
                                ? "#ef4444"
                                : p.statusType === "at-risk"
                                ? "#f59e0b"
                                : "#10b981",
                          }}
                        />
                      </div>
                    </div>
                  </td>
                  <td>
                    <b>{p.tasksCompleted}</b>
                    <span style={{ color: "#8a96ab" }}> / {p.tasksTotal}</span>
                  </td>
                  <td>
                    <b>{p.hoursSpent}h</b>
                    <span style={{ color: "#8a96ab" }}> / {p.hoursBudgeted}h</span>
                  </td>
                  <td>
                    <span style={{ color: "#3e4c6a", fontSize: "12px" }}>
                      {p.dueDate}
                    </span>
                  </td>
                  <td>
                    <div className="pr-avatars-row">
                      {p.members.map((m, i) => (
                        <span
                          key={i}
                          className="pr-mini-avatar"
                          style={{
                            background: ["#5963f5", "#0ea5e9", "#10b981", "#d946a6"][
                              i % 4
                            ],
                          }}
                        >
                          {m}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td>
                    <button
                      className="pr-view-btn"
                      onClick={() => setSelectedProject(p)}
                    >
                      <Eye size={13} /> Milestones
                    </button>
                  </td>
                </tr>
              ))}

              {filteredProjects.length === 0 && (
                <tr>
                  <td colSpan="8" style={{ textAlign: "center", padding: "40px" }}>
                    <Search size={24} style={{ color: "#9ca7bc", marginBottom: "8px" }} />
                    <p style={{ margin: 0, color: "#74819d" }}>
                      No projects matched your criteria.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Milestone Modal */}
      {selectedProject && (
        <div
          className="pr-modal-overlay"
          onClick={(e) => e.target === e.currentTarget && setSelectedProject(null)}
        >
          <div className="pr-modal">
            <div className="pr-modal-header">
              <div>
                <h2>{selectedProject.name} — Milestones</h2>
                <span style={{ fontSize: "12px", color: "#75829d" }}>
                  Lead: {selectedProject.lead} · Due: {selectedProject.dueDate}
                </span>
              </div>
              <button
                type="button"
                className="pr-modal-close"
                onClick={() => setSelectedProject(null)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="pr-milestone-list">
              {selectedProject.milestones.map((m, i) => (
                <div key={i} className="pr-milestone-item">
                  <div>
                    <b>{m.name}</b>
                    <div>
                      <span>Target: {m.date}</span>
                    </div>
                  </div>
                  <span
                    className={`pr-health-badge ${
                      m.status === "Completed"
                        ? "completed"
                        : m.status === "At Risk"
                        ? "at-risk"
                        : m.status === "Delayed"
                        ? "delayed"
                        : "on-track"
                    }`}
                  >
                    {m.status}
                  </span>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "16px" }}>
              <button
                className="pr-btn pr-btn-secondary"
                onClick={() => setSelectedProject(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
