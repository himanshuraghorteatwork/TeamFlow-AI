import React, { useMemo, useState, useEffect } from "react";
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
  Activity,
  CheckCircle2,
  Clock3,
  Zap,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { initialAdminProjects } from "../Admin/adminProjectsData.js";
import "./ProjectReports.css";

const VELOCITY_DATA = [
  { sprint: "Sprint 11", planned: 42, completed: 39, efficiency: 93 },
  { sprint: "Sprint 12", planned: 48, completed: 46, efficiency: 96 },
  { sprint: "Sprint 13", planned: 50, completed: 48, efficiency: 96 },
  { sprint: "Sprint 14", planned: 55, completed: 51, efficiency: 93 },
  { sprint: "Sprint 15", planned: 58, completed: 54, efficiency: 93 },
];

const BURNDOWN_DATA = [
  { day: "Day 1", ideal: 60, remaining: 60 },
  { day: "Day 3", ideal: 48, remaining: 50 },
  { day: "Day 5", ideal: 36, remaining: 38 },
  { day: "Day 7", ideal: 24, remaining: 22 },
  { day: "Day 9", ideal: 12, remaining: 10 },
  { day: "Day 10", ideal: 0, remaining: 2 },
];

const FILTERS = ["All Projects", "On Track", "At Risk", "Delayed", "Completed"];

function mapAdminStatusToReportStatus(p) {
  const s = String(p.status || "").toLowerCase().trim();
  const prog = Number(p.progress) || 0;

  if (s === "completed" || prog === 100) {
    return { status: "Completed", type: "completed" };
  }
  if (s === "overdue" || s === "delayed") {
    return { status: "Delayed", type: "delayed" };
  }
  if (s === "on hold" || p.priority === "Critical" || (prog < 35 && s === "active")) {
    return { status: "At Risk", type: "at-risk" };
  }
  return { status: "On Track", type: "on-track" };
}

function normalizeAdminProject(p, idx) {
  const { status, type } = mapAdminStatusToReportStatus(p);
  const tasksTotal = typeof p.tasks === "number" ? p.tasks : Array.isArray(p.tasks) ? p.tasks.length : 24;
  const tasksCompleted = typeof p.completedTasks === "number"
    ? p.completedTasks
    : Math.round((tasksTotal * (Number(p.progress) || 0)) / 100);
  const hoursBudgeted = p.hoursBudgeted || (tasksTotal * 8) || 160;
  const hoursSpent = p.hoursSpent || Math.round((hoursBudgeted * (Number(p.progress) || 10)) / 100);

  let formattedDue = p.dueDate || "Nov 30, 2026";
  if (p.dueDate && p.dueDate.includes("-")) {
    try {
      const d = new Date(p.dueDate);
      if (!isNaN(d.getTime())) {
        formattedDue = d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
      }
    } catch {
      // keep
    }
  }

  let members = ["KP", "AS"];
  if (Array.isArray(p.team) && p.team.length > 0) {
    members = p.team.map((m) =>
      m.avatar || (m.name ? m.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase() : "TM")
    );
  }

  const tones = ["purple", "blue", "green", "orange", "pink"];
  const tone = tones[idx % tones.length];

  const milestones = p.milestones || [
    { name: "Phase 1: Architecture & UX Blueprint", status: (p.progress >= 25 ? "Completed" : "In Progress"), date: "Oct 15" },
    { name: "Phase 2: Core Engineering & Modules", status: (p.progress >= 60 ? "Completed" : p.progress >= 30 ? "In Progress" : "Pending"), date: "Nov 05" },
    { name: "Phase 3: QA Verification & Benchmarks", status: (p.progress >= 90 ? "Completed" : p.progress >= 50 ? "In Progress" : "Pending"), date: "Nov 25" },
    { name: "Phase 4: Production Release & Deploy", status: (p.progress >= 100 ? "Completed" : "Pending"), date: formattedDue },
  ];

  return {
    id: p.id ? (String(p.id).startsWith("PRJ-") ? p.id : `PRJ-${String(p.id).padStart(2, "0")}`) : `PRJ-${idx + 1}`,
    rawId: p.id,
    name: p.name || `Project ${idx + 1}`,
    category: p.workspace || p.category || (p.description ? p.description.slice(0, 28) : "Engineering"),
    tone,
    status,
    statusType: type,
    progress: Number(p.progress) || 0,
    tasksTotal,
    tasksCompleted,
    hoursBudgeted,
    hoursSpent,
    dueDate: formattedDue,
    lead: p.owner || p.lead || "Komal Pawar",
    members,
    milestones,
  };
}

function loadConnectedProjects() {
  try {
    const adminRaw = localStorage.getItem("teamflow_admin_projects_v2");
    if (adminRaw) {
      const list = JSON.parse(adminRaw);
      if (Array.isArray(list) && list.length > 0) {
        return list.map(normalizeAdminProject);
      }
    }
  } catch (err) {
    console.error("Failed to parse admin projects for reports:", err);
  }
  return (initialAdminProjects || []).map(normalizeAdminProject);
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="pr-custom-tooltip">
      <div className="pr-tooltip-title">{label}</div>
      {payload.map((item, idx) => (
        <div key={idx} className="pr-tooltip-row">
          <span className="pr-tooltip-dot" style={{ background: item.color || item.fill }} />
          <span className="pr-tooltip-label">
            {item.name === "completed"
              ? "Completed Velocity"
              : item.name === "planned"
              ? "Planned Velocity"
              : item.name === "remaining"
              ? "Remaining Points"
              : item.name === "ideal"
              ? "Ideal Burndown"
              : item.name}
            :
          </span>
          <span className="pr-tooltip-val">{item.value} pts</span>
        </div>
      ))}
    </div>
  );
}

export default function ProjectReports() {
  const [projects, setProjects] = useState(loadConnectedProjects);
  const [activeFilter, setActiveFilter] = useState("All Projects");
  const [search, setSearch] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);
  const [exportNotice, setExportNotice] = useState("");
  const [chartMode, setChartMode] = useState("velocity"); // "velocity" | "burndown"
  const [isDark, setIsDark] = useState(() => {
    if (typeof document === "undefined") return false;
    return (
      document.documentElement.classList.contains("dark") ||
      localStorage.getItem("teamflow_admin_dark") === "true" ||
      localStorage.getItem("teamflow_theme_mode") === "dark"
    );
  });

  // Theme observer
  useEffect(() => {
    const updateTheme = () => {
      const dark =
        document.documentElement.classList.contains("dark") ||
        localStorage.getItem("teamflow_admin_dark") === "true" ||
        localStorage.getItem("teamflow_theme_mode") === "dark";
      setIsDark(dark);
    };

    window.addEventListener("teamflow_theme_update", updateTheme);
    window.addEventListener("storage", updateTheme);

    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "data-theme"] });

    return () => {
      window.removeEventListener("teamflow_theme_update", updateTheme);
      window.removeEventListener("storage", updateTheme);
      observer.disconnect();
    };
  }, []);

  // Live storage sync with Admin panel projects
  useEffect(() => {
    const handleStorage = () => {
      setProjects(loadConnectedProjects());
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener("teamflow_projects_updated", handleStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("teamflow_projects_updated", handleStorage);
    };
  }, []);

  const stats = useMemo(() => {
    const total = projects.length || 1;
    const onTrack = projects.filter((p) => p.status === "On Track").length;
    const completed = projects.filter((p) => p.status === "Completed").length;
    const atRisk = projects.filter((p) => p.status === "At Risk").length;
    const delayed = projects.filter((p) => p.status === "Delayed").length;
    const avgProgress = Math.round(
      projects.reduce((acc, p) => acc + (p.progress || 0), 0) / total
    );

    return {
      total: projects.length,
      onTrack,
      completed,
      atRisk,
      delayed,
      atRiskTotal: atRisk + delayed,
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

  const handleExportCSV = () => {
    const headers = [
      "Project ID",
      "Project Name",
      "Category/Workspace",
      "Status",
      "Progress (%)",
      "Tasks Completed",
      "Tasks Total",
      "Hours Spent",
      "Hours Budgeted",
      "Due Date",
      "Lead",
    ];
    const rows = filteredProjects.map((p) => [
      p.id,
      `"${p.name.replace(/"/g, '""')}"`,
      `"${p.category.replace(/"/g, '""')}"`,
      p.status,
      p.progress,
      p.tasksCompleted,
      p.tasksTotal,
      p.hoursSpent,
      p.hoursBudgeted,
      p.dueDate,
      `"${p.lead.replace(/"/g, '""')}"`,
    ]);
    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `teamflow-project-report-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setExportNotice("Project reports CSV successfully generated and downloaded.");
    setTimeout(() => setExportNotice(""), 3500);
  };

  const handleExportPDF = () => {
    window.print();
    setExportNotice("Print/PDF dialog triggered. Choose 'Save as PDF' to save.");
    setTimeout(() => setExportNotice(""), 3500);
  };

  const reloadData = () => {
    setProjects(loadConnectedProjects());
    setExportNotice("Synchronized project performance reports with Admin Panel.");
    setTimeout(() => setExportNotice(""), 3000);
  };

  // Recharts styling
  const gridStroke = isDark ? "#1e293b" : "#edf1f7";
  const axisColor = isDark ? "#94a3b8" : "#6d7a96";
  const plannedBarColor = isDark ? "#334155" : "#e2e8f0";
  const completedBarColor = "#6366f1";

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
              <span className="pr-pulse-dot" />
              <BarChart3 size={14} /> Live Sprint Tracking
            </span>
          </div>
          <p className="pr-header-desc">
            Analyze milestone burndown, sprint velocity, delivery risks, and resource utilization across your engineering team.
          </p>
        </div>

        <div className="pr-header-actions">
          <button
            type="button"
            className="pr-btn pr-btn-secondary"
            onClick={reloadData}
            title="Refresh latest projects from Admin panel"
          >
            <RefreshCw size={14} /> Sync Live
          </button>
          <button
            type="button"
            className="pr-btn pr-btn-secondary"
            onClick={handleExportCSV}
          >
            <FileSpreadsheet size={15} /> Export CSV
          </button>
          <button
            type="button"
            className="pr-btn pr-btn-primary"
            onClick={handleExportPDF}
          >
            <Download size={15} /> Export PDF Report
          </button>
        </div>
      </header>

      {/* Export Notice */}
      {exportNotice && (
        <div className="pr-toast-notice" role="status">
          <Sparkles size={16} />
          <span>{exportNotice}</span>
        </div>
      )}

      {/* Metric Cards (Clickable Filters) */}
      <section className="pr-stats-grid" aria-label="Project metrics summary">
        <article
          className={`pr-stat-card${activeFilter === "On Track" ? " selected" : ""}`}
          onClick={() => setActiveFilter(activeFilter === "On Track" ? "All Projects" : "On Track")}
          role="button"
          tabIndex={0}
          title="Click to filter On-Track projects"
        >
          <div className="pr-stat-icon green">
            <ShieldCheck size={22} />
          </div>
          <div className="pr-stat-info">
            <span className="pr-stat-label">On-Track Projects</span>
            <strong className="pr-stat-value">
              {stats.onTrack + stats.completed} of {stats.total}
            </strong>
            <span className="pr-stat-sub">
              {Math.round(((stats.onTrack + stats.completed) / (stats.total || 1)) * 100)}% delivery confidence
            </span>
          </div>
        </article>

        <article
          className="pr-stat-card"
          onClick={() => setChartMode("velocity")}
          role="button"
          tabIndex={0}
          title="Click to view Sprint Velocity chart"
        >
          <div className="pr-stat-icon purple">
            <TrendingUp size={22} />
          </div>
          <div className="pr-stat-info">
            <span className="pr-stat-label">Sprint Velocity</span>
            <strong className="pr-stat-value">{stats.velocity}</strong>
            <span className="pr-stat-sub">+6.2% vs previous sprint</span>
          </div>
        </article>

        <article
          className={`pr-stat-card${activeFilter === "All Projects" ? " selected" : ""}`}
          onClick={() => setActiveFilter("All Projects")}
          role="button"
          tabIndex={0}
          title="Click to view all projects"
        >
          <div className="pr-stat-icon blue">
            <FolderKanban size={22} />
          </div>
          <div className="pr-stat-info">
            <span className="pr-stat-label">Average Completion</span>
            <strong className="pr-stat-value">{stats.avgProgress}</strong>
            <span className="pr-stat-sub">Across {stats.total} tracked projects</span>
          </div>
        </article>

        <article
          className={`pr-stat-card${activeFilter === "At Risk" ? " selected" : ""}`}
          onClick={() => setActiveFilter(activeFilter === "At Risk" ? "All Projects" : "At Risk")}
          role="button"
          tabIndex={0}
          title="Click to filter At-Risk projects"
        >
          <div className="pr-stat-icon orange">
            <AlertTriangle size={22} />
          </div>
          <div className="pr-stat-info">
            <span className="pr-stat-label">Projects at Risk</span>
            <strong className="pr-stat-value">{stats.atRiskTotal}</strong>
            <span className="pr-stat-sub">Requires timeline review</span>
          </div>
        </article>
      </section>

      {/* Charts Row */}
      <section className="pr-charts-row">
        {/* Main Chart Panel */}
        <article className="pr-panel">
          <div className="pr-panel-header">
            <div>
              <h2>
                {chartMode === "velocity"
                  ? "Sprint Velocity (Planned vs Completed)"
                  : "Sprint Burndown Trajectory"}
              </h2>
              <p>
                {chartMode === "velocity"
                  ? "Story points delivered across the last 5 sprints"
                  : "Ideal trajectory vs actual points remaining in Sprint 15"}
              </p>
            </div>
            <div className="pr-chart-toggle-group">
              <button
                type="button"
                className={`pr-chart-toggle-btn${chartMode === "velocity" ? " active" : ""}`}
                onClick={() => setChartMode("velocity")}
              >
                <BarChart3 size={13} /> Velocity Bar
              </button>
              <button
                type="button"
                className={`pr-chart-toggle-btn${chartMode === "burndown" ? " active" : ""}`}
                onClick={() => setChartMode("burndown")}
              >
                <Activity size={13} /> Burndown Area
              </button>
            </div>
          </div>

          <div className="pr-chart-wrap">
            <ResponsiveContainer width="100%" height="100%">
              {chartMode === "velocity" ? (
                <BarChart
                  data={VELOCITY_DATA}
                  margin={{ top: 12, right: 12, left: -16, bottom: 0 }}
                >
                  <CartesianGrid stroke={gridStroke} strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="sprint"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11.5, fill: axisColor }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11.5, fill: axisColor }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="planned"
                    fill={plannedBarColor}
                    radius={[5, 5, 0, 0]}
                    isAnimationActive={true}
                    animationDuration={800}
                  />
                  <Bar
                    dataKey="completed"
                    fill={completedBarColor}
                    radius={[5, 5, 0, 0]}
                    isAnimationActive={true}
                    animationDuration={1000}
                  />
                </BarChart>
              ) : (
                <AreaChart
                  data={BURNDOWN_DATA}
                  margin={{ top: 12, right: 12, left: -16, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorRemaining" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke={gridStroke} strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11.5, fill: axisColor }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11.5, fill: axisColor }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="ideal"
                    stroke="#94a3b8"
                    strokeDasharray="4 4"
                    fill="none"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="remaining"
                    stroke="#6366f1"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorRemaining)"
                    isAnimationActive={true}
                    animationDuration={1000}
                  />
                </AreaChart>
              )}
            </ResponsiveContainer>
          </div>
        </article>

        {/* Health Breakdown Panel */}
        <article className="pr-panel">
          <div className="pr-panel-header">
            <div>
              <h2>Project Health Breakdown</h2>
              <p>Status categorization across ongoing work</p>
            </div>
            <span className="pr-health-pill">{stats.total} Projects</span>
          </div>

          <div className="pr-health-list">
            <div
              className={`pr-health-row${activeFilter === "On Track" ? " active" : ""}`}
              onClick={() => setActiveFilter(activeFilter === "On Track" ? "All Projects" : "On Track")}
              role="button"
              tabIndex={0}
              title="Click to filter On Track projects"
            >
              <span className="pr-health-label">
                <i className="pr-health-dot green" /> On Track
              </span>
              <div className="pr-health-bar-track">
                <span
                  style={{
                    width: `${Math.round((stats.onTrack / (stats.total || 1)) * 100)}%`,
                    background: "#10b981",
                  }}
                />
              </div>
              <span className="pr-health-count">{stats.onTrack}</span>
            </div>

            <div
              className={`pr-health-row${activeFilter === "Completed" ? " active" : ""}`}
              onClick={() => setActiveFilter(activeFilter === "Completed" ? "All Projects" : "Completed")}
              role="button"
              tabIndex={0}
              title="Click to filter Completed projects"
            >
              <span className="pr-health-label">
                <i className="pr-health-dot blue" /> Completed
              </span>
              <div className="pr-health-bar-track">
                <span
                  style={{
                    width: `${Math.round((stats.completed / (stats.total || 1)) * 100)}%`,
                    background: "#3b82f6",
                  }}
                />
              </div>
              <span className="pr-health-count">{stats.completed}</span>
            </div>

            <div
              className={`pr-health-row${activeFilter === "At Risk" ? " active" : ""}`}
              onClick={() => setActiveFilter(activeFilter === "At Risk" ? "All Projects" : "At Risk")}
              role="button"
              tabIndex={0}
              title="Click to filter At Risk projects"
            >
              <span className="pr-health-label">
                <i className="pr-health-dot orange" /> At Risk
              </span>
              <div className="pr-health-bar-track">
                <span
                  style={{
                    width: `${Math.round((stats.atRisk / (stats.total || 1)) * 100)}%`,
                    background: "#f59e0b",
                  }}
                />
              </div>
              <span className="pr-health-count">{stats.atRisk}</span>
            </div>

            <div
              className={`pr-health-row${activeFilter === "Delayed" ? " active" : ""}`}
              onClick={() => setActiveFilter(activeFilter === "Delayed" ? "All Projects" : "Delayed")}
              role="button"
              tabIndex={0}
              title="Click to filter Delayed projects"
            >
              <span className="pr-health-label">
                <i className="pr-health-dot red" /> Delayed
              </span>
              <div className="pr-health-bar-track">
                <span
                  style={{
                    width: `${Math.round((stats.delayed / (stats.total || 1)) * 100)}%`,
                    background: "#ef4444",
                  }}
                />
              </div>
              <span className="pr-health-count">{stats.delayed}</span>
            </div>
          </div>
        </article>
      </section>

      {/* Toolbar & Filters */}
      <div className="pr-toolbar">
        <div className="pr-filter-tabs">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              className={`pr-tab${activeFilter === f ? " active" : ""}`}
              onClick={() => setActiveFilter(f)}
            >
              {f}
              {f === "All Projects" && (
                <span className="pr-tab-count">{projects.length}</span>
              )}
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
          {search && (
            <button
              type="button"
              className="pr-search-clear"
              onClick={() => setSearch("")}
              aria-label="Clear search"
            >
              <X size={13} />
            </button>
          )}
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
                    <span style={{ color: "var(--pr-subtext)" }}> / {p.tasksTotal}</span>
                  </td>
                  <td>
                    <b>{p.hoursSpent}h</b>
                    <span style={{ color: "var(--pr-subtext)" }}> / {p.hoursBudgeted}h</span>
                  </td>
                  <td>
                    <span className="pr-due-date">
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
                            background: ["#6366f1", "#0ea5e9", "#10b981", "#ec4899", "#8b5cf6"][
                              i % 5
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
                      type="button"
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
                  <td colSpan="8" style={{ textAlign: "center", padding: "48px 20px" }}>
                    <Search size={28} style={{ color: "#9ca7bc", marginBottom: "8px", opacity: 0.6 }} />
                    <p style={{ margin: 0, fontWeight: 600, color: "var(--pr-subtext)" }}>
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
                <span className="pr-modal-sub">
                  Lead: {selectedProject.lead} · Due: {selectedProject.dueDate} · Progress: {selectedProject.progress}%
                </span>
              </div>
              <button
                type="button"
                className="pr-modal-close"
                onClick={() => setSelectedProject(null)}
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            <div className="pr-milestone-list">
              {selectedProject.milestones.map((m, i) => (
                <div key={i} className="pr-milestone-item">
                  <div className="pr-milestone-info">
                    <b>{m.name}</b>
                    <small>Target Completion: {m.date}</small>
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

            <div className="pr-modal-footer">
              <button
                type="button"
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
