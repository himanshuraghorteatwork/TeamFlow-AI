import React, { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Bug,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  CircleHelp,
  FolderKanban,
  Sparkles,
  Users,
  FileText,
} from "lucide-react";
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
} from "recharts";
import { initialTasks as defaultTasks } from "../Employee/tasksData.js";
import { initialBugs as defaultBugs } from "../Employee/bugdata.js";
import { initialProjects as defaultProjects } from "../Employee/projectData.js";
import { initialMembers as defaultMembers } from "../Employee/teamData.js";
import "./TeamLeadDashboard.css";

/* =========================================================
   ANIMATED NUMBER COMPONENT
========================================================= */
function AnimatedNumber({ value, prefix = "", suffix = "" }) {
  const numericValue = useMemo(() => {
    if (typeof value === "number") return value;
    const cleaned = String(value).replace(/[^0-9]/g, "");
    return parseInt(cleaned, 10) || 0;
  }, [value]);

  const [displayValue, setDisplayValue] = useState(numericValue);

  useEffect(() => {
    let startVal = displayValue;
    let endVal = numericValue;
    if (startVal === endVal) return;

    let startTime = null;
    const duration = 400;

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const factor = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = Math.floor(startVal + (endVal - startVal) * factor);
      setDisplayValue(current);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    const reqId = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(reqId);
  }, [numericValue, displayValue]);

  return <>{prefix}{displayValue.toLocaleString()}{suffix}</>;
}

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
    const [, m, d] = dateStr.slice(0, 10).split("-");
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
      className={`tld-stat-card ${onClick ? "clickable" : ""}`}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
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

  // Sprint Velocity & Burndown controls
  const [velocityTimeframe, setVelocityTimeframe] = useState("Sprint 24 (Active)");
  const [hoveredVelocityBar, setHoveredVelocityBar] = useState(null);
  const [card1View, setCard1View] = useState("velocity"); // 'velocity' | 'projects'

  // Task & Bug donut telemetry state
  const [taskStatusTimeframe, setTaskStatusTimeframe] = useState("Sprint 24");
  const [bugStatusTimeframe, setBugStatusTimeframe] = useState("All Bugs");
  const [hoveredTaskSlice, setHoveredTaskSlice] = useState(null);
  const [hoveredBugSlice, setHoveredBugSlice] = useState(null);

  // Velocity bar data
  const velocityBars = useMemo(() => {
    switch (velocityTimeframe) {
      case "Today":
        return [
          { label: "09:00", val: 4 },
          { label: "11:00", val: 9 },
          { label: "13:00", val: 15 },
          { label: "15:00", val: 22 },
          { label: "17:00", val: 28 },
          { label: "19:00", val: 32 },
        ];
      case "Last 7 Days":
        return [
          { label: "Mon", val: 16 },
          { label: "Tue", val: 24 },
          { label: "Wed", val: 19 },
          { label: "Thu", val: 31 },
          { label: "Fri", val: 28 },
          { label: "Sat", val: 14 },
          { label: "Sun", val: 10 },
        ];
      case "This Month":
        return [
          { label: "W1", val: 45 },
          { label: "W2", val: 72 },
          { label: "W3", val: 98 },
          { label: "W4", val: 124 },
        ];
      case "Sprint 23":
        return [
          { label: "Mon", val: 14 },
          { label: "Tue", val: 20 },
          { label: "Wed", val: 26 },
          { label: "Thu", val: 28 },
          { label: "Fri", val: 34 },
          { label: "Sat", val: 12 },
          { label: "Sun", val: 8 },
        ];
      case "Sprint 24 (Active)":
      default:
        return [
          { label: "Mon", val: 18 },
          { label: "Tue", val: 26 },
          { label: "Wed", val: 22 },
          { label: "Thu", val: 34 },
          { label: "Fri", val: 38 },
          { label: "Sat", val: 16 },
          { label: "Sun", val: 12 },
        ];
    }
  }, [velocityTimeframe]);

  const maxVelocityVal = useMemo(() => {
    const rawMax = Math.max(...velocityBars.map((b) => b.val || 0), 20);
    return Math.ceil(rawMax / 10) * 10;
  }, [velocityBars]);

  const velocityGridLabels = useMemo(() => {
    const step = maxVelocityVal / 4;
    return [
      maxVelocityVal,
      Math.round(step * 3),
      Math.round(step * 2),
      Math.round(step),
      0,
    ];
  }, [maxVelocityVal]);

  // Project Progress list
  const projectProgressList = useMemo(() => {
    if (projects.length === 0) return [];
    return projects.slice(0, 4).map((p, i) => {
      let progress;
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

  // SVG Donut geometry
  const donutRadius = 54;
  const donutCircumference = 2 * Math.PI * donutRadius; // ~339.292

  // Task Status Donut Data
  const taskDonutData = useMemo(() => {
    let completed = tasks.filter((t) => t.status === "Completed" || t.status === "Done").length;
    let inProgress = tasks.filter((t) => t.status === "In Progress").length;
    let inReview = tasks.filter((t) => t.status === "In Review" || t.status === "Review").length;
    let todo = tasks.filter((t) => t.status === "To Do" || t.status === "Todo").length;

    let total = completed + inProgress + inReview + todo;
    if (total === 0) {
      completed = 14;
      inProgress = 8;
      inReview = 4;
      todo = 6;
      total = 32;
    }

    const completedPct = Math.round((completed / total) * 100);
    const inProgressPct = Math.round((inProgress / total) * 100);
    const inReviewPct = Math.round((inReview / total) * 100);
    const todoPct = Math.max(0, 100 - completedPct - inProgressPct - inReviewPct);

    return {
      total,
      slices: [
        { key: "completed", name: "Completed", count: completed, pct: completedPct, color: "#10b981", dotClass: "dot-green" },
        { key: "inProgress", name: "In Progress", count: inProgress, pct: inProgressPct, color: "#3b82f6", dotClass: "dot-blue" },
        { key: "inReview", name: "In Review", count: inReview, pct: inReviewPct, color: "#8b5cf6", dotClass: "dot-purple" },
        { key: "todo", name: "To Do", count: todo, pct: todoPct, color: "#f59e0b", dotClass: "dot-amber" },
      ],
    };
  }, [tasks]);

  const taskSlicesWithOffsets = useMemo(() => {
    let acc = 0;
    const slices = [];
    for (let i = 0; i < taskDonutData.slices.length; i++) {
      const slice = taskDonutData.slices[i];
      const len = (slice.pct / 100) * donutCircumference;
      slices.push({
        ...slice,
        length: len,
        offset: -acc,
      });
      acc += len;
    }
    return slices;
  }, [taskDonutData, donutCircumference]);

  const activeTaskSliceMeta = useMemo(() => {
    if (!hoveredTaskSlice) return null;
    return taskSlicesWithOffsets.find((s) => s.key === hoveredTaskSlice) || null;
  }, [hoveredTaskSlice, taskSlicesWithOffsets]);

  // Bug Status Donut Data
  const bugDonutData = useMemo(() => {
    let open = bugs.filter((b) => b.status === "Open" || b.status === "New").length;
    let inProgress = bugs.filter((b) => b.status === "In Progress" || b.status === "Investigating").length;
    let resolved = bugs.filter((b) => b.status === "Resolved" || b.status === "Closed").length;
    let critical = bugs.filter((b) => (b.priority === "Critical" || b.priority === "Urgent") && b.status !== "Resolved" && b.status !== "Closed").length;

    let total = open + inProgress + resolved + critical;
    if (total === 0) {
      open = 5;
      inProgress = 4;
      resolved = 9;
      critical = 2;
      total = 20;
    }

    const openPct = Math.round((open / total) * 100);
    const inProgressPct = Math.round((inProgress / total) * 100);
    const resolvedPct = Math.round((resolved / total) * 100);
    const criticalPct = Math.max(0, 100 - openPct - inProgressPct - resolvedPct);

    return {
      total,
      slices: [
        { key: "open", name: "Open", count: open, pct: openPct, color: "#ef4444", dotClass: "dot-red" },
        { key: "inProgress", name: "In Progress", count: inProgress, pct: inProgressPct, color: "#3b82f6", dotClass: "dot-blue" },
        { key: "resolved", name: "Resolved", count: resolved, pct: resolvedPct, color: "#10b981", dotClass: "dot-green" },
        { key: "critical", name: "Critical", count: critical, pct: criticalPct, color: "#f59e0b", dotClass: "dot-amber" },
      ],
    };
  }, [bugs]);

  const bugSlicesWithOffsets = useMemo(() => {
    let acc = 0;
    const slices = [];
    for (let i = 0; i < bugDonutData.slices.length; i++) {
      const slice = bugDonutData.slices[i];
      const len = (slice.pct / 100) * donutCircumference;
      slices.push({
        ...slice,
        length: len,
        offset: -acc,
      });
      acc += len;
    }
    return slices;
  }, [bugDonutData, donutCircumference]);

  const activeBugSliceMeta = useMemo(() => {
    if (!hoveredBugSlice) return null;
    return bugSlicesWithOffsets.find((s) => s.key === hoveredBugSlice) || null;
  }, [hoveredBugSlice, bugSlicesWithOffsets]);

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

          {/* =========================================================
              ROW 2: CHARTS & ANALYTICS (SPRINT VELOCITY | TASK STATUS | BUG STATUS)
          ========================================================= */}
          <section className="tld-row-grid tld-row-charts">
            {/* 1. SPRINT VELOCITY & BURNDOWN (BAR GRAPH) */}
            <article className="tld-panel tld-velocity-panel">
              <div className="tld-panel-header">
                <div className="tld-card-header-title-group">
                  <h2>{card1View === "velocity" ? "Sprint Velocity & Burndown" : "Project Progress"}</h2>
                  <span className="tld-live-badge">
                    <span className="tld-live-pulse-dot" /> Live
                  </span>
                </div>
                <div className="tld-card-header-controls">
                  <div className="tld-view-toggle-pill" role="tablist">
                    <button
                      type="button"
                      className={`tld-toggle-btn ${card1View === "velocity" ? "active" : ""}`}
                      onClick={() => setCard1View("velocity")}
                      title="Show Sprint Velocity Bar Graph"
                    >
                      Velocity
                    </button>
                    <button
                      type="button"
                      className={`tld-toggle-btn ${card1View === "projects" ? "active" : ""}`}
                      onClick={() => setCard1View("projects")}
                      title="Show Project Progress List"
                    >
                      Projects
                    </button>
                  </div>

                  {card1View === "velocity" ? (
                    <div className="tld-select-pill">
                      <select
                        value={velocityTimeframe}
                        onChange={(e) => setVelocityTimeframe(e.target.value)}
                        aria-label="Filter velocity timeframe"
                      >
                        <option value="Sprint 24 (Active)">Sprint 24</option>
                        <option value="Last 7 Days">Last 7 Days</option>
                        <option value="This Month">This Month</option>
                        <option value="Sprint 23">Sprint 23</option>
                        <option value="Today">Today</option>
                      </select>
                      <ChevronDown size={13} />
                    </div>
                  ) : (
                    <button type="button" className="tld-link-button" onClick={goToProjects}>
                      View all <ArrowRight size={12} />
                    </button>
                  )}
                </div>
              </div>

              {card1View === "velocity" ? (
                <div className="tld-velocity-chart-container">
                  <div className="tld-velocity-yaxis">
                    {velocityGridLabels.map((val, idx) => (
                      <span key={idx}>{val}</span>
                    ))}
                  </div>

                  <div className="tld-velocity-bars-area">
                    <div className="tld-grid-lines">
                      <span /><span /><span /><span /><span />
                    </div>

                    <div className="tld-bars-track">
                      {velocityBars.map((b) => {
                        const isHovered = hoveredVelocityBar === b.label;
                        const isAnyHovered = hoveredVelocityBar !== null;
                        const heightPct = Math.min(100, Math.max(10, (b.val / maxVelocityVal) * 100));

                        return (
                          <div
                            key={b.label}
                            className={`tld-bar-group ${isHovered ? "is-hovered" : ""} ${isAnyHovered && !isHovered ? "is-dimmed" : ""}`}
                            onMouseEnter={() => setHoveredVelocityBar(b.label)}
                            onMouseLeave={() => setHoveredVelocityBar(null)}
                          >
                            {/* Live floating interactive Tooltip */}
                            {isHovered && (
                              <div className="tld-bar-tooltip" role="tooltip">
                                <span className="tooltip-val">{b.val} Tasks</span>
                                <span className="tooltip-lbl">{b.label} · Velocity</span>
                                <div className="tooltip-arrow" />
                              </div>
                            )}
                            <div className="tld-bar-rail">
                              <div
                                className="tld-bar-fill"
                                style={{ height: `${heightPct}%` }}
                              >
                                <span className="tld-bar-shimmer" />
                              </div>
                            </div>
                            <span className={`tld-bar-label ${isHovered ? "active" : ""}`}>
                              {b.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="tld-project-list">
                  {projectProgressList.map((project, i) => (
                    <div
                      className="tld-project-row"
                      key={project.name}
                      onClick={goToProjects}
                      title={`Click to open ${project.name}`}
                    >
                      <span className={`tld-project-icon project-tone-${i % 4}`}>
                        <FolderKanban size={17} />
                      </span>
                      <span className="tld-project-title">{project.name}</span>
                      <div className="tld-progress-track">
                        <span style={{ width: `${project.progress}%` }}>
                          <span className="tld-progress-shimmer" />
                        </span>
                      </div>
                      <b>{project.progress}%</b>
                    </div>
                  ))}
                </div>
              )}
            </article>

            {/* 2. TASK STATUS OVERVIEW (SVG DONUT CHART) */}
            <article className="tld-panel">
              <div className="tld-panel-header">
                <div className="tld-card-header-title-group">
                  <h2>Task Status</h2>
                  <span className="tld-live-badge">
                    <span className="tld-live-pulse-dot" /> Live
                  </span>
                </div>
                <div className="tld-card-header-controls">
                  <div className="tld-select-pill">
                    <select
                      value={taskStatusTimeframe}
                      onChange={(e) => setTaskStatusTimeframe(e.target.value)}
                      aria-label="Filter task status timeframe"
                    >
                      <option value="Sprint 24">Sprint 24</option>
                      <option value="All Tasks">All Tasks</option>
                      <option value="This Month">This Month</option>
                      <option value="Last 7 Days">Last 7 Days</option>
                    </select>
                    <ChevronDown size={13} />
                  </div>
                  <button type="button" className="tld-link-button" onClick={goToTasks}>
                    View all <ArrowRight size={12} />
                  </button>
                </div>
              </div>

              <div className="tld-telemetry-donut-layout">
                {/* SVG DONUT CHART WITH TELEMETRY EFFECTS */}
                <div className="tld-donut-box">
                  <svg viewBox="0 0 140 140" className="tld-donut-svg">
                    <defs>
                      <filter id="taskDonutSliceGlow" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="0" stdDeviation="3.5" floodColor="#3b82f6" floodOpacity="0.6" />
                      </filter>
                    </defs>

                    {/* Ambient outer orbital ring */}
                    <circle cx="70" cy="70" r="65" fill="none" className="tld-donut-aura-ring" />

                    {/* Expanding live sonar wave */}
                    <circle cx="70" cy="70" r={donutRadius} fill="none" className="tld-donut-sonar-wave" />

                    {/* Subtle background track */}
                    <circle
                      cx="70"
                      cy="70"
                      r={donutRadius}
                      fill="none"
                      strokeWidth={16}
                      className="tld-donut-bg-ring"
                    />

                    {/* Slices rotated -90deg */}
                    <g transform="rotate(-90 70 70)">
                      {taskSlicesWithOffsets.map((slice) => {
                        const isHovered = hoveredTaskSlice === slice.key;
                        const isDimmed = hoveredTaskSlice && !isHovered;
                        return (
                          <circle
                            key={slice.key}
                            cx="70"
                            cy="70"
                            r={donutRadius}
                            fill="none"
                            stroke={slice.color}
                            strokeWidth={isHovered ? 21 : 16}
                            strokeDasharray={`${slice.length} ${donutCircumference - slice.length}`}
                            strokeDashoffset={slice.offset}
                            className={`tld-donut-slice slice-${slice.key} ${isHovered ? "active" : ""} ${isDimmed ? "dimmed" : ""}`}
                            onMouseEnter={() => setHoveredTaskSlice(slice.key)}
                            onMouseLeave={() => setHoveredTaskSlice(null)}
                          />
                        );
                      })}
                    </g>

                    {/* Orbiting Live Satellite Beacon */}
                    <g className="tld-donut-orbit-beacon" style={{ transformOrigin: "70px 70px" }}>
                      <circle cx="70" cy="16" r="6" fill="none" className="tld-beacon-pulse" />
                      <circle cx="70" cy="16" r="3" className="tld-beacon-core" />
                    </g>
                  </svg>

                  {/* Center Telemetry Counter */}
                  <div className={`tld-donut-center-telemetry ${activeTaskSliceMeta ? "has-hover" : ""}`}>
                    {activeTaskSliceMeta ? (
                      <>
                        <strong style={{ color: activeTaskSliceMeta.color }}>
                          {activeTaskSliceMeta.count}
                        </strong>
                        <span className="tld-donut-active-sub" style={{ color: activeTaskSliceMeta.color }}>
                          {activeTaskSliceMeta.name} ({activeTaskSliceMeta.pct}%)
                        </span>
                      </>
                    ) : (
                      <>
                        <strong>
                          <AnimatedNumber value={taskDonutData.total} />
                        </strong>
                        <span className="tld-donut-center-sub">
                          <span className="tld-live-pulse-dot" /> Total Tasks
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Status Breakdown Legend with Bidirectional Synchronization */}
                <div className="tld-status-list">
                  {taskSlicesWithOffsets.map((slice) => {
                    const isHovered = hoveredTaskSlice === slice.key;
                    const isDimmed = hoveredTaskSlice && !isHovered;
                    return (
                      <div
                        key={slice.key}
                        className={`tld-status-row ${isHovered ? `is-active is-${slice.key}` : ""} ${isDimmed ? "is-dimmed" : ""}`}
                        onMouseEnter={() => setHoveredTaskSlice(slice.key)}
                        onMouseLeave={() => setHoveredTaskSlice(null)}
                      >
                        <div className="status-label-group">
                          <span className={`dot ${slice.dotClass}`} />
                          <span className="status-name">{slice.name}</span>
                        </div>
                        <span className="status-pct">{slice.pct}%</span>
                        <b className="status-count">{slice.count}</b>
                      </div>
                    );
                  })}
                </div>
              </div>
            </article>

            {/* 3. BUG STATUS & TRIAGE (SVG DONUT CHART) */}
            <article className="tld-panel">
              <div className="tld-panel-header">
                <div className="tld-card-header-title-group">
                  <h2>Bug Status</h2>
                  <span className="tld-live-badge tld-live-badge--amber">
                    <span className="tld-live-pulse-dot tld-live-pulse-dot--amber" /> Live
                  </span>
                </div>
                <div className="tld-card-header-controls">
                  <div className="tld-select-pill">
                    <select
                      value={bugStatusTimeframe}
                      onChange={(e) => setBugStatusTimeframe(e.target.value)}
                      aria-label="Filter bug status"
                    >
                      <option value="All Bugs">All Bugs</option>
                      <option value="Active Sprint">Active Sprint</option>
                      <option value="Critical Only">Critical Only</option>
                    </select>
                    <ChevronDown size={13} />
                  </div>
                  <button type="button" className="tld-link-button" onClick={() => navigate("/teamlead/bugs")}>
                    View all <ArrowRight size={12} />
                  </button>
                </div>
              </div>

              <div className="tld-telemetry-donut-layout">
                {/* SVG DONUT CHART WITH TELEMETRY EFFECTS */}
                <div className="tld-donut-box">
                  <svg viewBox="0 0 140 140" className="tld-donut-svg">
                    <defs>
                      <filter id="bugDonutSliceGlow" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="0" stdDeviation="3.5" floodColor="#ef4444" floodOpacity="0.6" />
                      </filter>
                    </defs>

                    {/* Ambient outer orbital ring */}
                    <circle cx="70" cy="70" r="65" fill="none" className="tld-donut-aura-ring" />

                    {/* Expanding live sonar wave */}
                    <circle cx="70" cy="70" r={donutRadius} fill="none" className="tld-donut-sonar-wave tld-donut-sonar-wave--bug" />

                    {/* Subtle background track */}
                    <circle
                      cx="70"
                      cy="70"
                      r={donutRadius}
                      fill="none"
                      strokeWidth={16}
                      className="tld-donut-bg-ring"
                    />

                    {/* Slices rotated -90deg */}
                    <g transform="rotate(-90 70 70)">
                      {bugSlicesWithOffsets.map((slice) => {
                        const isHovered = hoveredBugSlice === slice.key;
                        const isDimmed = hoveredBugSlice && !isHovered;
                        return (
                          <circle
                            key={slice.key}
                            cx="70"
                            cy="70"
                            r={donutRadius}
                            fill="none"
                            stroke={slice.color}
                            strokeWidth={isHovered ? 21 : 16}
                            strokeDasharray={`${slice.length} ${donutCircumference - slice.length}`}
                            strokeDashoffset={slice.offset}
                            className={`tld-donut-slice slice-${slice.key} ${isHovered ? "active" : ""} ${isDimmed ? "dimmed" : ""}`}
                            onMouseEnter={() => setHoveredBugSlice(slice.key)}
                            onMouseLeave={() => setHoveredBugSlice(null)}
                          />
                        );
                      })}
                    </g>

                    {/* Orbiting Live Satellite Beacon */}
                    <g className="tld-donut-orbit-beacon" style={{ transformOrigin: "70px 70px" }}>
                      <circle cx="70" cy="16" r="6" fill="none" className="tld-beacon-pulse tld-beacon-pulse--bug" />
                      <circle cx="70" cy="16" r="3" className="tld-beacon-core tld-beacon-core--bug" />
                    </g>
                  </svg>

                  {/* Center Telemetry Counter */}
                  <div className={`tld-donut-center-telemetry ${activeBugSliceMeta ? "has-hover" : ""}`}>
                    {activeBugSliceMeta ? (
                      <>
                        <strong style={{ color: activeBugSliceMeta.color }}>
                          {activeBugSliceMeta.count}
                        </strong>
                        <span className="tld-donut-active-sub" style={{ color: activeBugSliceMeta.color }}>
                          {activeBugSliceMeta.name} ({activeBugSliceMeta.pct}%)
                        </span>
                      </>
                    ) : (
                      <>
                        <strong>
                          <AnimatedNumber value={bugDonutData.total} />
                        </strong>
                        <span className="tld-donut-center-sub">
                          <span className="tld-live-pulse-dot" /> Total Bugs
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Status Breakdown Legend with Bidirectional Synchronization */}
                <div className="tld-status-list">
                  {bugSlicesWithOffsets.map((slice) => {
                    const isHovered = hoveredBugSlice === slice.key;
                    const isDimmed = hoveredBugSlice && !isHovered;
                    return (
                      <div
                        key={slice.key}
                        className={`tld-status-row ${isHovered ? `is-active is-${slice.key}` : ""} ${isDimmed ? "is-dimmed" : ""}`}
                        onMouseEnter={() => setHoveredBugSlice(slice.key)}
                        onMouseLeave={() => setHoveredBugSlice(null)}
                      >
                        <div className="status-label-group">
                          <span className={`dot ${slice.dotClass}`} />
                          <span className="status-name">{slice.name}</span>
                        </div>
                        <span className="status-pct">{slice.pct}%</span>
                        <b className="status-count">{slice.count}</b>
                      </div>
                    );
                  })}
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
