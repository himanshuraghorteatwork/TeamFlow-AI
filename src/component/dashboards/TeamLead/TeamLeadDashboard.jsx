import React, { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Activity,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Bug,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  CircleHelp,
  Clock3,
  FolderKanban,
  Sparkles,
  Users,
  MessageCircle,
  FileText,
} from "lucide-react";
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import { initialTasks as defaultTasks } from "../Employee/tasksData.js";
import { initialBugs as defaultBugs } from "../Employee/bugdata.js";
import { initialProjects as defaultProjects } from "../Employee/projectData.js";
import { initialMembers as defaultMembers } from "../Employee/teamData.js";
import "./TeamLeadDashboard.css";

const TASKS_STORAGE_KEY = "teamflow_teamlead_tasks";
const BUGS_STORAGE_KEY = "teamflow_bugs";
const PROJECTS_STORAGE_KEY = "teamflow_projects";
const MEMBERS_STORAGE_KEY = "teamflow_members";

function loadStoredTasks() {
  try {
    const saved = localStorage.getItem(TASKS_STORAGE_KEY) || localStorage.getItem("teamflow_tasks");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (err) {
    console.error("Failed to load tasks:", err);
  }
  return defaultTasks || [];
}

function loadStoredBugs() {
  try {
    const saved = localStorage.getItem(BUGS_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (err) {
    console.error("Failed to load bugs:", err);
  }
  return defaultBugs || [];
}

function loadStoredProjects() {
  try {
    const saved = localStorage.getItem(PROJECTS_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (err) {
    console.error("Failed to load projects:", err);
  }
  return defaultProjects || [];
}

function loadStoredMembers() {
  try {
    const saved = localStorage.getItem(MEMBERS_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (err) {
    console.error("Failed to load members:", err);
  }
  return defaultMembers || [];
}

function getLeadName() {
  try {
    const userJson =
      localStorage.getItem("teamflow_teamlead") ||
      localStorage.getItem("teamflow_current_user") ||
      localStorage.getItem("teamflow_user") ||
      localStorage.getItem("user");
    if (userJson) {
      const parsed = JSON.parse(userJson);
      return parsed.name || parsed.fullName || parsed.username || "Komal";
    }
  } catch {
    // fallback
  }
  return "Komal";
}

function formatTaskDate(dateStr) {
  if (!dateStr) return "No due date";
  if (/^\d{4}-\d{2}-\d{2}/.test(dateStr)) {
    const [y, m, d] = dateStr.slice(0, 10).split("-");
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthIdx = parseInt(m, 10) - 1;
    if (monthIdx >= 0 && monthIdx < 12) {
      return `${months[monthIdx]} ${parseInt(d, 10)}`;
    }
  }
  return dateStr;
}

function formatDateRange(start, end) {
  const format = (value) => value.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  return `${format(start)} - ${format(end)}`;
}

function toDateInputValue(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function StatCard({ title, value, change, description, icon: Icon, tone = "blue", negative = false, onClick }) {
  return (
    <article
      className="tld-stat-card"
      onClick={onClick}
      style={{
        cursor: onClick ? "pointer" : "default",
        userSelect: "none",
        transition: "transform 0.18s ease, box-shadow 0.18s ease",
      }}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onMouseEnter={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = "translateY(-2px)";
          e.currentTarget.style.boxShadow = "0 8px 20px rgba(24,39,75,.09)";
        }
      }}
      onMouseLeave={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = "none";
          e.currentTarget.style.boxShadow = "";
        }
      }}
      onKeyDown={(e) => {
        if (onClick && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <div className={`tld-stat-icon ${tone}`}><Icon size={21} /></div>
      <div className="tld-stat-copy">
        <span className="tld-stat-label">{title}</span>
        <div className="tld-stat-value-row">
          <strong className="tld-stat-value">{value}</strong>
          {change && (
            <span className={`tld-stat-change ${negative ? "negative" : ""}`}>
              {negative ? <ArrowDownRight size={15} /> : <ArrowUpRight size={15} />}{change}
            </span>
          )}
        </div>
        <span className="tld-stat-description">{description}</span>
      </div>
    </article>
  );
}

function PanelHeader({ title, subtitle, action, onAction }) {
  return (
    <div className="tld-panel-header">
      <div>
        <h2>{title}</h2>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {action && (
        <button className="tld-link-button" onClick={onAction}>
          {action}
          <ArrowRight size={15} />
        </button>
      )}
    </div>
  );
}

export default function TeamLeadDashboard() {
  const navigate = useNavigate();
  const dateDropdownRef = useRef(null);

  const [tasks, setTasks] = useState(loadStoredTasks);
  const [bugs, setBugs] = useState(loadStoredBugs);
  const [projects, setProjects] = useState(loadStoredProjects);
  const [members, setMembers] = useState(loadStoredMembers);

  const [leadName] = useState(getLeadName);
  const [selectedCalendarDay, setSelectedCalendarDay] = useState(new Date().getDate());
  const [calendarMonthOffset, setCalendarMonthOffset] = useState(0);
  const [dateMenuOpen, setDateMenuOpen] = useState(false);
  const [customStart, setCustomStart] = useState(() => {
    const today = new Date();
    return toDateInputValue(new Date(today.getFullYear(), today.getMonth(), 1));
  });
  const [customEnd, setCustomEnd] = useState(() => {
    const today = new Date();
    return toDateInputValue(new Date(today.getFullYear(), today.getMonth() + 1, 0));
  });
  const [dateFilter, setDateFilter] = useState(() => {
    const today = new Date();
    return formatDateRange(
      new Date(today.getFullYear(), today.getMonth(), 1),
      new Date(today.getFullYear(), today.getMonth() + 1, 0),
    );
  });
  const [dateRangeError, setDateRangeError] = useState("");

  useEffect(() => {
    if (!dateMenuOpen) return undefined;
    const closeOnOutsideClick = (event) => {
      if (dateDropdownRef.current && !dateDropdownRef.current.contains(event.target)) {
        setDateMenuOpen(false);
        setDateRangeError("");
      }
    };
    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, [dateMenuOpen]);

  // Sync state if localStorage changes or window gains focus
  useEffect(() => {
    const syncAll = () => {
      setTasks(loadStoredTasks());
      setBugs(loadStoredBugs());
      setProjects(loadStoredProjects());
      setMembers(loadStoredMembers());
    };

    window.addEventListener("storage", syncAll);
    window.addEventListener("focus", syncAll);
    return () => {
      window.removeEventListener("storage", syncAll);
      window.removeEventListener("focus", syncAll);
    };
  }, []);

  const goToTasks = () => navigate("/teamlead/tasks");
  const goToProjects = () => navigate("/teamlead/projects");
  const goToTeam = () => navigate("/teamlead/team");
  const goToWorkload = () => navigate("/teamlead/workload");
  const goToCalendar = () => navigate("/teamlead/calendar");

  // Toggle upcoming task completion and persist to localStorage
  const handleToggleTask = (taskId) => {
    setTasks((prev) => {
      const next = prev.map((t) => {
        if (t.id === taskId) {
          const isDone = t.status === "Completed" || t.status === "Done";
          return { ...t, status: isDone ? "To Do" : "Completed" };
        }
        return t;
      });
      try {
        localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(next));
      } catch (err) {
        console.error("Failed to save task update:", err);
      }
      return next;
    });
  };

  // Dynamic statistics calculations
  const completedCount = useMemo(() => {
    return tasks.filter((t) => t.status === "Completed" || t.status === "Done").length;
  }, [tasks]);

  const openCount = tasks.length - completedCount;
  const completedPercent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  const activeProjectsCount = useMemo(() => {
    return projects.filter((p) => {
      const s = (p.status || "").toLowerCase();
      return s !== "completed" && s !== "archived";
    }).length;
  }, [projects]);

  const activeMembersCount = useMemo(() => {
    return members.filter((m) => {
      const s = (m.status || "").toLowerCase();
      return s === "active" || s === "online" || !s;
    }).length;
  }, [members]);

  const { openBugsCount, criticalBugsCount } = useMemo(() => {
    let open = 0;
    let critical = 0;
    bugs.forEach((b) => {
      const s = (b.status || "").toLowerCase();
      const isClosed = s === "resolved" || s === "closed";
      if (!isClosed) {
        open++;
        const p = (b.priority || "").toLowerCase();
        if (p === "critical" || p === "urgent") {
          critical++;
        }
      }
    });
    return { openBugsCount: open, criticalBugsCount: critical };
  }, [bugs]);

  const { upcomingCount, overdueCount } = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let upcoming = 0;
    let overdue = 0;

    tasks.forEach((task) => {
      const status = (task.status || "").toLowerCase();
      if (status === "completed" || status === "done") return;

      const dateStr = task.dueDate || task.due;
      if (!dateStr) return;

      let taskDate;
      if (/^\d{4}-\d{2}-\d{2}/.test(dateStr)) {
        taskDate = new Date(`${dateStr.slice(0, 10)}T00:00:00`);
      } else {
        taskDate = new Date(`${dateStr}, ${today.getFullYear()}`);
      }

      if (Number.isNaN(taskDate.getTime())) return;

      const diffTime = taskDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays < 0) {
        overdue++;
      } else if (diffDays <= 7) {
        upcoming++;
      }
    });

    return {
      upcomingCount: upcoming,
      overdueCount: overdue,
    };
  }, [tasks]);

  // Project Progress list
  const projectProgressList = useMemo(() => {
    if (projects.length === 0) return [];
    return projects.slice(0, 4).map((p, i) => {
      let progress = 0;
      if (Array.isArray(p.tasks) && p.tasks.length > 0) {
        const done = p.tasks.filter((t) => t.status === "Completed" || t.status === "Done").length;
        progress = Math.round((done / p.tasks.length) * 100);
      } else if (typeof p.progress === "number") {
        progress = p.progress;
      } else {
        progress = [85, 62, 40, 25][i % 4];
      }
      return {
        name: p.name,
        progress: Math.min(100, Math.max(0, progress)),
      };
    });
  }, [projects]);

  // Dynamic Task status data for pie chart
  const taskStatusData = useMemo(() => {
    if (tasks.length === 0) {
      return [
        { name: "Completed", value: 100, count: 0, color: "#10b981" },
      ];
    }
    const completed = tasks.filter((t) => t.status === "Completed" || t.status === "Done").length;
    const inProgress = tasks.filter((t) => t.status === "In Progress").length;
    const inReview = tasks.filter((t) => t.status === "In Review" || t.status === "Review").length;
    const todo = Math.max(0, tasks.length - completed - inProgress - inReview);

    const slices = [
      { name: "Completed", count: completed, color: "#10b981" },
      { name: "In Progress", count: inProgress, color: "#2787f5" },
      { name: "To Do", count: todo, color: "#f59e0b" },
      { name: "In Review", count: inReview, color: "#8b5cf6" },
    ].filter((s) => s.count > 0);

    const total = tasks.length || 1;
    return slices.map((s) => ({
      ...s,
      value: Math.round((s.count / total) * 100),
    }));
  }, [tasks]);

  // Dynamic Bug status data for pie chart
  const bugStatusData = useMemo(() => {
    const open = bugs.filter((b) => b.status === "Open").length;
    const inProg = bugs.filter((b) => b.status === "In Progress").length;
    const resolved = bugs.filter((b) => b.status === "Resolved" || b.status === "Closed").length;
    const critical = bugs.filter((b) => (b.priority === "Critical" || b.priority === "Urgent") && b.status !== "Resolved" && b.status !== "Closed").length;

    const slices = [
      { name: "Open", count: open, color: "#f04452" },
      { name: "In Progress", count: inProg, color: "#2787f5" },
      { name: "Resolved", count: resolved, color: "#10b981" },
      { name: "Critical", count: critical, color: "#f59e0b" },
    ];

    const total = bugs.length || 1;
    return slices.map((s) => ({
      ...s,
      value: Math.round((s.count / total) * 100),
    }));
  }, [bugs]);

  // Team members preview
  const displayTeamMembers = useMemo(() => {
    if (members.length === 0) return [];
    const colors = [
      { color: "#eee9ff", textColor: "#6547dc" },
      { color: "#e0f2fe", textColor: "#0877bd" },
      { color: "#fce7f3", textColor: "#be287c" },
      { color: "#d1fae5", textColor: "#087f5b" },
    ];
    return members.slice(0, 4).map((member, i) => {
      const tone = colors[i % colors.length];
      const initials =
        member.initials ||
        member.name
          ?.trim()
          .split(/\s+/)
          .slice(0, 2)
          .map((part) => part[0]?.toUpperCase())
          .join("") ||
        "TM";

      const currentTask =
        member.department ||
        (tasks[i] ? tasks[i].title : ["UI redesign", "API integration", "Mobile screens", "Testing & bugs"][i % 4]);

      return {
        id: member.id || i + 1,
        name: member.name,
        role: member.role || "Team Member",
        initials,
        color: tone.color,
        textColor: tone.textColor,
        status: member.status || (i % 2 === 0 ? "Online" : "In a meeting"),
        currentTask,
      };
    });
  }, [members, tasks]);

  // Team Workload preview data
  const workloadChartData = useMemo(() => {
    if (members.length > 0) {
      return members.slice(0, 4).map((m, i) => {
        const memberTasks = tasks.filter((t) => t.assignee?.toLowerCase() === m.name?.toLowerCase());
        const workloadVal =
          memberTasks.length > 0
            ? Math.min(100, memberTasks.length * 20)
            : [80, 65, 70, 50][i % 4];
        const firstName = m.name?.split(" ")[0] || `Member ${i + 1}`;
        return {
          name: firstName,
          value: workloadVal,
        };
      });
    }
    return [
      { name: "Komal", value: 80 },
      { name: "Aarav", value: 65 },
      { name: "Priya", value: 70 },
      { name: "Rohan", value: 50 },
    ];
  }, [members, tasks]);

  // Calendar dates
  const calendarDisplayDate = useMemo(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + calendarMonthOffset);
    return d;
  }, [calendarMonthOffset]);

  const monthYearLabel = calendarDisplayDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const setPresetDateRange = (range) => {
    const today = new Date();
    const end = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const start = new Date(end);
    if (range === "Last 7 Days") start.setDate(start.getDate() - 6);
    if (range === "Last 30 Days") start.setDate(start.getDate() - 29);
    if (range === "This Quarter") {
      start.setMonth(Math.floor(start.getMonth() / 3) * 3, 1);
    }
    if (range === "This Year") {
      start.setMonth(0, 1);
    }
    setDateFilter(range === "Today" ? "Today" : formatDateRange(start, end));
    setDateMenuOpen(false);
    setDateRangeError("");
  };

  const applyCustomDateRange = () => {
    if (!customStart || !customEnd) {
      setDateRangeError("Choose both a start and end date.");
      return;
    }
    if (customStart > customEnd) {
      setDateRangeError("The start date must be on or before the end date.");
      return;
    }
    const start = new Date(`${customStart}T12:00:00`);
    const end = new Date(`${customEnd}T12:00:00`);
    setDateFilter(formatDateRange(start, end));
    setDateMenuOpen(false);
    setDateRangeError("");
  };

  return (
    <div className="tld-app">
      <div className="tld-workspace">
        <main className="tld-main">
          {/* Welcome Section */}
          <section className="tld-welcome-section">
            <div>
              <div className="tld-eyebrow">
                <Sparkles size={15} /> TEAM WORKSPACE
              </div>
              <h1>
                Welcome back, {leadName}! <span aria-hidden="true">👋</span>
              </h1>
              <p>Here's what's happening with your team today.</p>
            </div>
            <div className="tld-welcome-actions">
              <div className="tld-date-selector" ref={dateDropdownRef}>
                <button
                  type="button"
                  className="tld-secondary-button tld-date-button"
                  aria-expanded={dateMenuOpen}
                  aria-haspopup="true"
                  onClick={() => setDateMenuOpen((open) => !open)}
                >
                  <CalendarDays size={16} /> <span>{dateFilter}</span> <ChevronDown size={14} />
                </button>
                {dateMenuOpen && (
                  <div className="tld-date-dropdown">
                    {["Today", "Last 7 Days", "Last 30 Days", "This Quarter", "This Year"].map((range) => (
                      <button
                        key={range}
                        type="button"
                        className={`tld-date-option${dateFilter === range ? " is-selected" : ""}`}
                        onClick={() => setPresetDateRange(range)}
                      >
                        {range}
                      </button>
                    ))}
                    <div className="tld-date-custom">
                      <span className="tld-date-custom-title">Custom Range</span>
                      <div className="tld-date-inputs">
                        <input
                          type="date"
                          aria-label="Custom range start date"
                          value={customStart}
                          onChange={(event) => { setCustomStart(event.target.value); setDateRangeError(""); }}
                        />
                        <input
                          type="date"
                          aria-label="Custom range end date"
                          value={customEnd}
                          onChange={(event) => { setCustomEnd(event.target.value); setDateRangeError(""); }}
                        />
                      </div>
                      {dateRangeError && <p className="tld-date-error" role="alert">{dateRangeError}</p>}
                      <button type="button" className="tld-date-apply" onClick={applyCustomDateRange}>
                        Apply Range
                      </button>
                      <button type="button" className="tld-date-calendar-link" onClick={() => { setDateMenuOpen(false); goToCalendar(); }}>
                        Open calendar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Key Stat Cards (Interactive & Dynamic) */}
          <section className="tld-stats-grid">
            <StatCard
              title="Total Projects"
              value={String(projects.length)}
              change={`${activeProjectsCount} active`}
              description={projects.length === 1 ? "1 project tracked" : `${projects.length} projects tracked`}
              icon={FolderKanban}
              tone="blue"
              onClick={goToProjects}
            />
            <StatCard
              title="Total Tasks"
              value={String(tasks.length)}
              change={`${completedPercent}% done`}
              description={`${completedCount} completed · ${openCount} open`}
              icon={CheckCircle2}
              tone="green"
              onClick={goToTasks}
            />
            <StatCard
              title="Open Bugs"
              value={String(openBugsCount)}
              change={criticalBugsCount > 0 ? `${criticalBugsCount} critical` : "0 critical"}
              description={`${bugs.length} total tracked`}
              icon={Bug}
              tone="red"
              negative={openBugsCount > 0}
              onClick={() => navigate("/teamlead/bugs")}
            />
            <StatCard
              title="Team Members"
              value={String(members.length)}
              change={`${activeMembersCount} active`}
              description="In workspace"
              icon={Users}
              tone="sky"
              onClick={goToTeam}
            />
            <StatCard
              title="Upcoming Deadlines"
              value={String(upcomingCount)}
              change={overdueCount > 0 ? `${overdueCount} overdue` : "In next 7 days"}
              description={overdueCount > 0 ? `${overdueCount} task(s) overdue` : "Due this week"}
              icon={CalendarDays}
              tone="orange"
              negative={overdueCount > 0 || upcomingCount > 0}
              onClick={goToTasks}
            />
          </section>

          {/* Chart Panels */}
          <section className="tld-row-grid tld-row-charts">
            {/* Project Progress */}
            <article className="tld-panel tld-project-panel">
              <PanelHeader title="Project Progress" action="View all" onAction={goToProjects} />
              <div className="tld-project-list">
                {projectProgressList.map((project, i) => (
                  <div
                    className="tld-project-row"
                    key={project.name}
                    onClick={goToProjects}
                    style={{ cursor: "pointer" }}
                    title={`Click to open ${project.name}`}
                  >
                    <span className={`tld-project-icon project-tone-${i % 4}`}>
                      <FolderKanban size={17} />
                    </span>
                    <span className="tld-project-title">{project.name}</span>
                    <div className="tld-progress-track">
                      <span style={{ width: `${project.progress}%` }} />
                    </div>
                    <b>{project.progress}%</b>
                  </div>
                ))}
              </div>
            </article>

            {/* Task Status Donut */}
            <article className="tld-panel">
              <PanelHeader title="Task Status" action="View all" onAction={goToTasks} />
              <div className="tld-donut-layout">
                <div className="tld-donut-wrap">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={taskStatusData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius="65%"
                        outerRadius="90%"
                        paddingAngle={3}
                        stroke="none"
                      >
                        {taskStatusData.map((item) => (
                          <Cell key={item.name} fill={item.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(val, name, entry) => [`${entry.payload.count || 0} tasks (${val}%)`, name]} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="tld-donut-center">
                    <strong>{tasks.length}</strong>
                    <span>Total Tasks</span>
                  </div>
                </div>
                <div className="tld-status-legend">
                  {taskStatusData.map((item) => (
                    <div className="tld-status-legend-item" key={item.name}>
                      <span>
                        <i style={{ background: item.color }} />
                        {item.name}
                      </span>
                      <b>{item.count ?? item.value}</b>
                    </div>
                  ))}
                </div>
              </div>
            </article>

            {/* Bug Status Donut */}
            <article className="tld-panel">
              <PanelHeader title="Bug Status" action="View all" onAction={() => navigate("/teamlead/bugs")} />
              <div className="tld-donut-layout">
                <div className="tld-donut-wrap">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={bugStatusData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius="65%"
                        outerRadius="90%"
                        paddingAngle={3}
                        stroke="none"
                      >
                        {bugStatusData.map((item) => (
                          <Cell key={item.name} fill={item.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(val, name, entry) => [`${entry.payload.count || 0} bugs`, name]} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="tld-donut-center">
                    <strong>{bugs.length}</strong>
                    <span>Total Bugs</span>
                  </div>
                </div>
                <div className="tld-status-legend">
                  {bugStatusData.map((item) => (
                    <div className="tld-status-legend-item" key={item.name}>
                      <span>
                        <i style={{ background: item.color }} />
                        {item.name}
                      </span>
                      <b>{item.count}</b>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          </section>

          {/* Middle Row: My Team, Upcoming Tasks, Mini Calendar */}
          <section className="tld-row-grid tld-row-middle">
            {/* My Team */}
            <article className="tld-panel tld-team-panel">
              <PanelHeader title="My Team" action="View all" onAction={goToTeam} />
              <div className="tld-table-scroll">
                <table className="tld-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Role</th>
                      <th>Current Task</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayTeamMembers.map((member) => (
                      <tr
                        key={member.id}
                        onClick={goToTeam}
                        style={{ cursor: "pointer" }}
                        title={`Click to view team member ${member.name}`}
                      >
                        <td>
                          <span className="tld-member-cell">
                            <span className="tld-avatar" style={{ background: member.color, color: member.textColor }}>
                              {member.initials}
                            </span>
                            {member.name}
                          </span>
                        </td>
                        <td>{member.role}</td>
                        <td style={{ maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis" }}>
                          {member.currentTask}
                        </td>
                        <td>
                          <span
                            className={`tld-badge ${
                              member.status === "Online" || member.status === "Active"
                                ? "success"
                                : member.status === "Offline"
                                ? "muted"
                                : "warning"
                            }`}
                          >
                            {member.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </article>

            {/* My Upcoming Tasks */}
            <article className="tld-panel tld-upcoming-panel">
              <PanelHeader title="Upcoming Tasks" action="View all" onAction={goToTasks} />
              <div className="tld-upcoming-list">
                {tasks.slice(0, 4).map((task) => {
                  const isDone = task.status === "Completed" || task.status === "Done";
                  const priority = task.priority || "Medium";
                  const displayDate = formatTaskDate(task.dueDate || task.due);

                  return (
                    <div className="tld-upcoming-task" key={task.id}>
                      <button
                        className={`tld-task-check ${isDone ? "checked" : ""}`}
                        aria-label={`Mark ${task.title} complete`}
                        onClick={() => handleToggleTask(task.id)}
                        title={isDone ? "Mark incomplete" : "Mark completed"}
                      >
                        {isDone && <CheckCircle2 size={16} />}
                      </button>
                      <div className="tld-upcoming-copy" onClick={goToTasks} style={{ cursor: "pointer" }}>
                        <b style={{ textDecoration: isDone ? "line-through" : "none", opacity: isDone ? 0.6 : 1 }}>
                          {task.title}
                        </b>
                        <small>{task.project || "General"}</small>
                      </div>
                      <span className="tld-task-due">{displayDate}</span>
                      <span
                        className={`tld-badge ${
                          priority === "High" || priority === "Urgent"
                            ? "danger"
                            : priority === "Medium"
                            ? "warning"
                            : "success"
                        }`}
                      >
                        {priority}
                      </span>
                    </div>
                  );
                })}
              </div>
            </article>

            {/* Calendar */}
            <article className="tld-panel tld-calendar-panel">
              <PanelHeader title="Calendar" action="View all" onAction={goToCalendar} />
              <div className="tld-calendar-heading">
                <button
                  type="button"
                  aria-label="Previous month"
                  onClick={() => setCalendarMonthOffset((prev) => prev - 1)}
                >
                  ‹
                </button>
                <b>{monthYearLabel}</b>
                <button
                  type="button"
                  aria-label="Next month"
                  onClick={() => setCalendarMonthOffset((prev) => prev + 1)}
                >
                  ›
                </button>
              </div>
              <div className="tld-calendar-grid">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <span className="tld-calendar-day-name" key={day}>
                    {day}
                  </span>
                ))}
                {Array.from({ length: 35 }, (_, i) => {
                  const day = i - 3;
                  const valid = day >= 1 && day <= 31;
                  const isSelected = valid && day === selectedCalendarDay && calendarMonthOffset === 0;

                  return (
                    <button
                      key={i}
                      type="button"
                      className={`${isSelected ? "selected" : ""} ${!valid ? "outside" : ""}`}
                      onClick={() => {
                        if (valid) {
                          setSelectedCalendarDay(day);
                          goToCalendar();
                        }
                      }}
                      disabled={!valid}
                    >
                      {valid ? day : day < 1 ? 27 + day : day - 31}
                    </button>
                  );
                })}
              </div>
              <div className="tld-calendar-legend">
                <span>
                  <i className="red-dot" />
                  Deadline
                </span>
                <span>
                  <i className="blue-dot" />
                  Meeting
                </span>
                <span>
                  <i className="green-dot" />
                  Milestone
                </span>
              </div>
            </article>
          </section>

          {/* Bottom Row: Recent Activity, Workload, AI Assistant */}
          <section className="tld-row-grid tld-row-bottom">
            <article className="tld-panel">
              <PanelHeader title="Recent Activity" action="View all" onAction={() => navigate("/teamlead/reports")} />
              <div className="tld-table-scroll">
                <table className="tld-table tld-activity-table">
                  <thead>
                    <tr>
                      <th>Time</th>
                      <th>User</th>
                      <th>Action</th>
                      <th>Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["10:42 AM", "Komal Pawar", "Completed task", "UI design updated"],
                      ["10:20 AM", "Aarav Shah", "Created bug", "Login issue #245"],
                      ["09:55 AM", "Priya Rao", "Updated project", "Mobile App progress 62%"],
                      ["09:32 AM", "Rohan Kulkarni", "Added comment", "On API integration"],
                      ["09:10 AM", "Komal Pawar", "Moved task", "To In Progress"],
                    ].map((row, i) => (
                      <tr key={row[0]}>
                        <td>{row[0]}</td>
                        <td>
                          <span className="tld-activity-user">
                            <span className={`tld-mini-avatar tone-${i % 5}`}>
                              {row[1]
                                .split(" ")
                                .map((s) => s[0])
                                .join("")}
                            </span>
                            {row[1]}
                          </span>
                        </td>
                        <td>{row[2]}</td>
                        <td>{row[3]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </article>

            {/* Team Workload */}
            <article className="tld-panel">
              <PanelHeader title="Team Workload" action="View all" onAction={goToWorkload} />
              <div className="tld-workload-chart">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={workloadChartData} margin={{ top: 12, right: 5, left: -20, bottom: 0 }}>
                    <CartesianGrid stroke="#edf0f6" strokeDasharray="3 3" vertical={false} />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 11, fill: "#65718a" }}
                    />
                    <YAxis
                      domain={[0, 100]}
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 10, fill: "#65718a" }}
                    />
                    <Tooltip formatter={(v) => [`${v}%`, "Workload"]} />
                    <Bar dataKey="value" radius={[5, 5, 0, 0]} fill="#8b75f8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </article>

            {/* AI Assistant */}
            <article className="tld-panel tld-ai-panel">
              <PanelHeader title="AI Assistant" action="View all" onAction={() => navigate("/teamlead/ai-assistant")} />
              {[
                ["Generate task summary", "Summarize team progress", FileText],
                ["Suggest next tasks", "Get AI-powered suggestions", Sparkles],
                ["Analyze project risks", "Identify potential blockers", Bug],
                ["Create meeting notes", "Summarize meeting discussions", CalendarDays],
              ].map(([title, subtitle, Icon], i) => (
                <button
                  className="tld-ai-action"
                  key={title}
                  onClick={() => navigate("/teamlead/ai-assistant")}
                  type="button"
                >
                  <span className={`tld-ai-action-icon tone-${i}`}>
                    <Icon size={17} />
                  </span>
                  <span>
                    <b>{title}</b>
                    <small>{subtitle}</small>
                  </span>
                  <ArrowRight size={14} />
                </button>
              ))}
            </article>
          </section>

          {/* Footer */}
          <footer className="tld-footer">
            <span>
              <i /> All systems operational
            </span>
            <span>TeamFlow AI · Team Lead Workspace</span>
            <button type="button" onClick={() => navigate("/teamlead/settings")}>
              <CircleHelp size={14} /> Help &amp; support
            </button>
          </footer>
        </main>
      </div>
    </div>
  );
}
