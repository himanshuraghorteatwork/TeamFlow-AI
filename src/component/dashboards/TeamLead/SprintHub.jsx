import React, { useState, useEffect, useMemo } from "react";
import {
  Zap,
  Plus,
  CheckCircle2,
  Clock,
  Users,
  Target,
  TrendingUp,
  AlertCircle,
  FolderKanban,
  CheckSquare,
  Bug,
  Flame,
  ArrowRight,
  ArrowLeft,
  Trash2,
  Edit2,
  X,
  Search,
  Filter,
  Check,
  ChevronDown,
  Layers,
  Sparkles,
} from "lucide-react";
import "./SprintHub.css";

// Initial sample sprint issues
const INITIAL_SPRINT_ISSUES = [
  // Sprint Backlog
  {
    id: "TF-241",
    title: "Implement OAuth 2.0 PKCE auth flow for mobile clients",
    type: "Story",
    points: 5,
    priority: "High",
    stage: "backlog",
    assignee: "Alex Morgan",
    assigneeAvatar: "AM",
    assigneeColor: "#3b82f6",
    description: "Upgrade OAuth flow to support PKCE security guidelines across iOS & Android apps.",
  },
  {
    id: "TF-242",
    title: "Database index tuning on activity logs table",
    type: "Task",
    points: 3,
    priority: "Medium",
    stage: "backlog",
    assignee: "Noah Davis",
    assigneeAvatar: "ND",
    assigneeColor: "#0ea5e9",
    description: "Add compound index on (workspace_id, created_at) to speed up telemetry queries.",
  },
  {
    id: "TF-243",
    title: "Spike: Evaluate WebSocket clustering with Redis streams",
    type: "Spike",
    points: 5,
    priority: "Low",
    stage: "backlog",
    assignee: "Sophia Chen",
    assigneeAvatar: "SC",
    assigneeColor: "#8b5cf6",
    description: "Benchmark Redis pub/sub vs Streams for 50k concurrent team chat subscribers.",
  },

  // In Development
  {
    id: "TF-244",
    title: "AI Co-pilot v2 live telemetry streaming endpoint",
    type: "Story",
    points: 8,
    priority: "Urgent",
    stage: "in_progress",
    assignee: "Lucas Martin",
    assigneeAvatar: "LM",
    assigneeColor: "#6366f1",
    description: "Provide SSE endpoint for real-time AI standup insights and sprint burndown updates.",
  },
  {
    id: "TF-245",
    title: "Dark mode contrast calibration across modal dialogues",
    type: "Task",
    points: 3,
    priority: "Medium",
    stage: "in_progress",
    assignee: "Ethan Williams",
    assigneeAvatar: "EW",
    assigneeColor: "#10b981",
    description: "Refactor border variables to meet WCAG AA contrast ratio in dark theme.",
  },
  {
    id: "TF-246",
    title: "Race condition in notification badge unread sync",
    type: "Bug",
    points: 5,
    priority: "High",
    stage: "in_progress",
    assignee: "Olivia Patel",
    assigneeAvatar: "OP",
    assigneeColor: "#ec4899",
    description: "Multi-tab browser sync occasionally increments badge count twice on reconnect.",
  },

  // Code Review & QA
  {
    id: "TF-247",
    title: "Microservices health check and circuit breaker fallback",
    type: "Task",
    points: 5,
    priority: "High",
    stage: "review",
    assignee: "Noah Davis",
    assigneeAvatar: "ND",
    assigneeColor: "#0ea5e9",
    description: "Wrap external integrations in Resilience4j circuit breakers with graceful fallbacks.",
  },
  {
    id: "TF-248",
    title: "Export Sprint burndown telemetry to CSV and PDF",
    type: "Story",
    points: 5,
    priority: "Medium",
    stage: "review",
    assignee: "Emma Taylor",
    assigneeAvatar: "ET",
    assigneeColor: "#f59e0b",
    description: "Enable team leads to download weekly sprint velocity and burndown summaries.",
  },
  {
    id: "TF-249",
    title: "Fix date picker calendar boundary overflow on mobile",
    type: "Bug",
    points: 2,
    priority: "Low",
    stage: "review",
    assignee: "Liam Wilson",
    assigneeAvatar: "LW",
    assigneeColor: "#06b6d4",
    description: "Calendar popup clips viewport right edge when opened on screens < 480px.",
  },

  // Done / Shipped
  {
    id: "TF-250",
    title: "Interactive Sprint Velocity Bar Graph with tooltips",
    type: "Story",
    points: 8,
    priority: "High",
    stage: "done",
    assignee: "Ethan Williams",
    assigneeAvatar: "EW",
    assigneeColor: "#10b981",
    description: "Integrated SVG burndown bars, timeframe switcher, and live velocity metrics.",
  },
  {
    id: "TF-251",
    title: "SVG Telemetry Donut Charts for Task & Bug breakdown",
    type: "Story",
    points: 8,
    priority: "High",
    stage: "done",
    assignee: "Alex Morgan",
    assigneeAvatar: "AM",
    assigneeColor: "#3b82f6",
    description: "Built animated telemetry rings with aura pulses and synchronized legends.",
  },
  {
    id: "TF-252",
    title: "Pure CSS Admin-grade Delete Confirmation Modals",
    type: "Task",
    points: 5,
    priority: "Medium",
    stage: "done",
    assignee: "Sophia Chen",
    assigneeAvatar: "SC",
    assigneeColor: "#8b5cf6",
    description: "Replaced all browser window.confirm alerts with branded Admin delete modals.",
  },
  {
    id: "TF-253",
    title: "Fix memory leak in background SSE heartbeat listener",
    type: "Bug",
    points: 3,
    priority: "Urgent",
    stage: "done",
    assignee: "Emma Taylor",
    assigneeAvatar: "ET",
    assigneeColor: "#f59e0b",
    description: "Properly clean up EventSource event listeners on React component unmount.",
  },
];

// Squad Members for allocation & assignment
const SQUAD_MEMBERS = [
  { name: "Alex Morgan", role: "Lead Backend Architect", avatar: "AM", color: "#3b82f6", capacityPts: 14, currentPts: 13 },
  { name: "Sophia Chen", role: "Senior Fullstack Engineer", avatar: "SC", color: "#8b5cf6", capacityPts: 12, currentPts: 10 },
  { name: "Ethan Williams", role: "Staff Frontend Engineer", avatar: "EW", color: "#10b981", capacityPts: 12, currentPts: 11 },
  { name: "Olivia Patel", role: "UI/UX Product Designer", avatar: "OP", color: "#ec4899", capacityPts: 8, currentPts: 5 },
  { name: "Noah Davis", role: "DevOps & Cloud Engineer", avatar: "ND", color: "#0ea5e9", capacityPts: 10, currentPts: 8 },
  { name: "Emma Taylor", role: "Senior QA Automation Engineer", avatar: "ET", color: "#f59e0b", capacityPts: 10, currentPts: 8 },
  { name: "Liam Wilson", role: "Mobile Platform Developer", avatar: "LW", color: "#06b6d4", capacityPts: 8, currentPts: 6 },
  { name: "Lucas Martin", role: "Backend Systems Engineer", avatar: "LM", color: "#6366f1", capacityPts: 10, currentPts: 8 },
];

// Available Sprints
const SPRINTS_LIST = [
  { id: "sprint-24", name: "Sprint 24", status: "Active", dateRange: "Oct 16 – Oct 31, 2026", goal: "Deliver AI Copilot v2 telemetry, harden auth flows, and eliminate critical P0 bugs before release freeze." },
  { id: "sprint-25", name: "Sprint 25", status: "Planning", dateRange: "Nov 01 – Nov 15, 2026", goal: "Automated test coverage to 90%, Kubernetes cluster migration, and multi-tenant billing tiers." },
  { id: "sprint-23", name: "Sprint 23", status: "Completed", dateRange: "Oct 01 – Oct 15, 2026", goal: "TeamFlow AI 2.0 release rollout, real-time presence indicators, and team lead workspace polish." },
];

// Burndown 14-day telemetry data (Total committed: 68 pts)
const BURNDOWN_DAYS = [
  { day: 1, label: "Day 1", date: "Oct 16", ideal: 68.0, actual: 68.0 },
  { day: 2, label: "Day 2", date: "Oct 17", ideal: 62.8, actual: 68.0 },
  { day: 3, label: "Day 3", date: "Oct 18", ideal: 57.5, actual: 65.0 },
  { day: 4, label: "Day 4", date: "Oct 19", ideal: 52.3, actual: 61.0 },
  { day: 5, label: "Day 5", date: "Oct 20", ideal: 47.1, actual: 56.0 },
  { day: 6, label: "Day 6", date: "Oct 21", ideal: 41.8, actual: 52.0 },
  { day: 7, label: "Day 7", date: "Oct 22", ideal: 36.6, actual: 47.0 },
  { day: 8, label: "Day 8", date: "Oct 23", ideal: 31.4, actual: 41.0 },
  { day: 9, label: "Day 9", date: "Oct 24", ideal: 26.2, actual: 36.0 },
  { day: 10, label: "Day 10", date: "Oct 25", ideal: 20.9, actual: 30.0 },
  { day: 11, label: "Day 11 (Today)", date: "Oct 26", ideal: 15.7, actual: 24.0 },
  { day: 12, label: "Day 12", date: "Oct 27", ideal: 10.5, actual: null },
  { day: 13, label: "Day 13", date: "Oct 28", ideal: 5.2, actual: null },
  { day: 14, label: "Day 14", date: "Oct 31", ideal: 0.0, actual: null },
];

export default function SprintHub() {
  // Load issues from localStorage or fallback
  const [issues, setIssues] = useState(() => {
    try {
      const saved = localStorage.getItem("teamflow_sprint_issues_v24");
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_SPRINT_ISSUES;
  });

  // Current selected sprint
  const [selectedSprintId, setSelectedSprintId] = useState("sprint-24");
  const [sprintDropdownOpen, setSprintDropdownOpen] = useState(false);

  // Filters & search
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");

  // Active tab: 'board' or 'capacity'
  const [activeTab, setActiveTab] = useState("board");

  // Burndown chart interactive hover
  const [hoveredDay, setHoveredDay] = useState(BURNDOWN_DAYS[10]); // default to Day 11

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingIssue, setEditingIssue] = useState(null);
  const [issueToDelete, setIssueToDelete] = useState(null);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Form state for new/edit issue
  const [formData, setFormData] = useState({
    title: "",
    type: "Story",
    points: 3,
    priority: "Medium",
    stage: "backlog",
    assignee: "Alex Morgan",
    description: "",
  });

  // Save to localStorage when issues change
  useEffect(() => {
    try {
      localStorage.setItem("teamflow_sprint_issues_v24", JSON.stringify(issues));
    } catch {
      // ignore
    }
  }, [issues]);

  const activeSprint = SPRINTS_LIST.find((s) => s.id === selectedSprintId) || SPRINTS_LIST[0];

  // Show temporary toast
  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Metrics calculations
  const totalPoints = useMemo(() => issues.reduce((acc, curr) => acc + (Number(curr.points) || 0), 0), [issues]);
  const completedPoints = useMemo(
    () => issues.filter((i) => i.stage === "done").reduce((acc, curr) => acc + (Number(curr.points) || 0), 0),
    [issues]
  );
  const remainingPoints = totalPoints - completedPoints;
  const completionPercentage = totalPoints > 0 ? Math.round((completedPoints / totalPoints) * 100) : 0;

  // Filtered issues
  const filteredIssues = useMemo(() => {
    return issues.filter((issue) => {
      const matchSearch =
        issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        issue.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        issue.assignee.toLowerCase().includes(searchQuery.toLowerCase());
      const matchType = typeFilter === "All" || issue.type === typeFilter;
      const matchPriority = priorityFilter === "All" || issue.priority === priorityFilter;
      return matchSearch && matchType && matchPriority;
    });
  }, [issues, searchQuery, typeFilter, priorityFilter]);

  // Stage columns
  const COLUMNS = [
    { key: "backlog", title: "Sprint Backlog", tone: "slate" },
    { key: "in_progress", title: "In Development", tone: "blue" },
    { key: "review", title: "Code Review & QA", tone: "amber" },
    { key: "done", title: "Done / Shipped", tone: "green" },
  ];

  // Stage movement handlers
  const moveIssueStage = (issueId, direction) => {
    const stageOrder = ["backlog", "in_progress", "review", "done"];
    setIssues((prev) =>
      prev.map((item) => {
        if (item.id !== issueId) return item;
        const curIdx = stageOrder.indexOf(item.stage);
        const nextIdx = direction === "next" ? curIdx + 1 : curIdx - 1;
        if (nextIdx >= 0 && nextIdx < stageOrder.length) {
          return { ...item, stage: stageOrder[nextIdx] };
        }
        return item;
      })
    );
  };

  // Open create issue modal
  const openCreateModal = () => {
    setEditingIssue(null);
    setFormData({
      title: "",
      type: "Story",
      points: 3,
      priority: "Medium",
      stage: "backlog",
      assignee: SQUAD_MEMBERS[0].name,
      description: "",
    });
    setIsCreateModalOpen(true);
  };

  // Open edit issue modal
  const openEditModal = (issue) => {
    setEditingIssue(issue);
    setFormData({
      title: issue.title,
      type: issue.type,
      points: issue.points,
      priority: issue.priority,
      stage: issue.stage,
      assignee: issue.assignee,
      description: issue.description || "",
    });
    setIsCreateModalOpen(true);
  };

  // Save issue (create or update)
  const handleSaveIssue = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    const member = SQUAD_MEMBERS.find((m) => m.name === formData.assignee) || SQUAD_MEMBERS[0];

    if (editingIssue) {
      setIssues((prev) =>
        prev.map((item) =>
          item.id === editingIssue.id
            ? {
                ...item,
                title: formData.title.trim(),
                type: formData.type,
                points: Number(formData.points) || 1,
                priority: formData.priority,
                stage: formData.stage,
                assignee: member.name,
                assigneeAvatar: member.avatar,
                assigneeColor: member.color,
                description: formData.description.trim(),
              }
            : item
        )
      );
      triggerToast(`Issue ${editingIssue.id} updated successfully.`);
    } else {
      const nextNum = Math.floor(254 + Math.random() * 100);
      const newIssue = {
        id: `TF-${nextNum}`,
        title: formData.title.trim(),
        type: formData.type,
        points: Number(formData.points) || 1,
        priority: formData.priority,
        stage: formData.stage,
        assignee: member.name,
        assigneeAvatar: member.avatar,
        assigneeColor: member.color,
        description: formData.description.trim(),
      };
      setIssues((prev) => [newIssue, ...prev]);
      triggerToast(`New issue ${newIssue.id} added to ${formData.stage.replace("_", " ")}.`);
    }

    setIsCreateModalOpen(false);
    setEditingIssue(null);
  };

  // Delete issue confirmation
  const confirmDeleteIssue = () => {
    if (!issueToDelete) return;
    setIssues((prev) => prev.filter((i) => i.id !== issueToDelete.id));
    triggerToast(`Issue ${issueToDelete.id} removed from sprint.`);
    setIssueToDelete(null);
  };

  // Complete sprint action
  const handleCompleteSprint = () => {
    setIsCompleteModalOpen(false);
    triggerToast("Sprint 24 marked as complete! 4 incomplete issues rolled over to Sprint 25.");
  };

  // SVG Burndown Chart Coordinates
  const chartW = 760;
  const chartH = 150;
  const padL = 38;
  const padR = 20;
  const padT = 14;
  const padB = 26;

  const innerW = chartW - padL - padR;
  const innerH = chartH - padT - padB;
  const maxPts = 80;

  const getX = (idx) => padL + (idx / (BURNDOWN_DAYS.length - 1)) * innerW;
  const getY = (val) => padT + innerH - (val / maxPts) * innerH;

  // Ideal line path
  const idealPath = BURNDOWN_DAYS.map((d, i) => `${i === 0 ? "M" : "L"} ${getX(i)} ${getY(d.ideal)}`).join(" ");

  // Actual points line path (up to Day 11)
  const actualDays = BURNDOWN_DAYS.filter((d) => d.actual !== null);
  const actualLinePath = actualDays.map((d, i) => `${i === 0 ? "M" : "L"} ${getX(i)} ${getY(d.actual)}`).join(" ");

  // Actual area under curve
  const actualAreaPath = actualDays.length > 0
    ? `${actualLinePath} L ${getX(actualDays.length - 1)} ${padT + innerH} L ${getX(0)} ${padT + innerH} Z`
    : "";

  return (
    <div className="tf-sprint-hub">
      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="tf-sprint-toast">
          <CheckCircle2 size={16} className="tf-sprint-toast-icon" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* HEADER SECTION */}
      <div className="tf-sprint-header">
        <div className="tf-sprint-header-left">
          <div className="tf-sprint-breadcrumb">
            <span>WORK MANAGEMENT</span>
            <span className="tf-sprint-breadcrumb-sep">/</span>
            <span className="tf-sprint-breadcrumb-current">Sprint Hub</span>
          </div>

          <div className="tf-sprint-title-row">
            <h1 className="tf-sprint-title">Sprint Management Hub</h1>

            {/* SPRINT SELECTOR DROPDOWN */}
            <div className="tf-sprint-selector-wrap">
              <button
                type="button"
                className="tf-sprint-selector-btn"
                onClick={() => setSprintDropdownOpen((prev) => !prev)}
              >
                <div className="tf-sprint-pulse-indicator">
                  <span className="tf-sprint-pulse-dot" />
                </div>
                <span className="tf-sprint-selector-name">{activeSprint.name}</span>
                <span className="tf-sprint-selector-badge">{activeSprint.status}</span>
                <ChevronDown size={14} className="tf-sprint-selector-caret" />
              </button>

              {sprintDropdownOpen && (
                <div className="tf-sprint-dropdown-menu">
                  <div className="tf-sprint-dropdown-heading">Switch Sprint</div>
                  {SPRINTS_LIST.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      className={`tf-sprint-dropdown-item ${s.id === selectedSprintId ? "active" : ""}`}
                      onClick={() => {
                        setSelectedSprintId(s.id);
                        setSprintDropdownOpen(false);
                      }}
                    >
                      <div className="tf-sprint-dropdown-item-info">
                        <span className="tf-sprint-dropdown-item-name">{s.name}</span>
                        <span className="tf-sprint-dropdown-item-dates">{s.dateRange}</span>
                      </div>
                      <span className={`tf-sprint-status-tag ${s.status.toLowerCase()}`}>
                        {s.status}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* SQUAD BADGE */}
            <div className="tf-sprint-squad-badge">
              <Users size={14} />
              <span>Engineering Squad</span>
              <span className="tf-sprint-squad-meta">• 8 Active Members</span>
            </div>
          </div>

          <p className="tf-sprint-subtitle">
            Active Agile cycle covering {activeSprint.dateRange} · 3 days remaining until code freeze.
          </p>
        </div>

        {/* HEADER ACTIONS */}
        <div className="tf-sprint-header-actions">
          <button
            type="button"
            className="tf-sprint-btn tf-sprint-btn-secondary"
            onClick={() => setIsCompleteModalOpen(true)}
          >
            <CheckCircle2 size={16} />
            <span>Complete Sprint</span>
          </button>

          <button
            type="button"
            className="tf-sprint-btn tf-sprint-btn-primary"
            onClick={openCreateModal}
          >
            <Plus size={16} />
            <span>New Story / Task</span>
          </button>
        </div>
      </div>

      {/* SPRINT GOAL & PROGRESS BANNER */}
      <div className="tf-sprint-goal-banner">
        <div className="tf-sprint-goal-icon-wrap">
          <Target size={22} />
        </div>
        <div className="tf-sprint-goal-content">
          <div className="tf-sprint-goal-top">
            <span className="tf-sprint-goal-label">Current Sprint Goal</span>
            <div className="tf-sprint-goal-stats">
              <span className="tf-sprint-stat-pill">
                <Clock size={12} />
                3 Days Left
              </span>
              <span className="tf-sprint-stat-pill highlight">
                <Flame size={12} />
                Velocity 94%
              </span>
            </div>
          </div>
          <p className="tf-sprint-goal-text">{activeSprint.goal}</p>

          <div className="tf-sprint-progress-bar-wrap">
            <div className="tf-sprint-progress-bar-info">
              <span>Sprint Story Points Burndown Progress</span>
              <span className="tf-sprint-progress-nums">
                <strong>{completedPoints}</strong> / {totalPoints} pts completed ({completionPercentage}%)
              </span>
            </div>
            <div className="tf-sprint-progress-track">
              <div
                className="tf-sprint-progress-fill"
                style={{ width: `${Math.min(100, completionPercentage)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 5 KPI METRICS CARDS */}
      <div className="tf-sprint-metrics-grid">
        <div className="tf-sprint-metric-card">
          <div className="tf-sprint-metric-header">
            <span className="tf-sprint-metric-title">Points Committed</span>
            <div className="tf-sprint-metric-icon bg-indigo">
              <FolderKanban size={16} />
            </div>
          </div>
          <div className="tf-sprint-metric-val">
            {totalPoints} <span className="tf-sprint-metric-unit">pts</span>
          </div>
          <div className="tf-sprint-metric-footer">
            <span className="tf-sprint-metric-sub">
              <strong>{completedPoints}</strong> done · <strong>{remainingPoints}</strong> remaining
            </span>
          </div>
        </div>

        <div className="tf-sprint-metric-card">
          <div className="tf-sprint-metric-header">
            <span className="tf-sprint-metric-title">Sprint Velocity</span>
            <div className="tf-sprint-metric-icon bg-emerald">
              <TrendingUp size={16} />
            </div>
          </div>
          <div className="tf-sprint-metric-val">
            94% <span className="tf-sprint-metric-badge-up">↑ +4%</span>
          </div>
          <div className="tf-sprint-metric-footer">
            <span className="tf-sprint-metric-sub">Target 40 pts · On schedule</span>
          </div>
        </div>

        <div className="tf-sprint-metric-card">
          <div className="tf-sprint-metric-header">
            <span className="tf-sprint-metric-title">Daily Burn Rate</span>
            <div className="tf-sprint-metric-icon bg-amber">
              <Zap size={16} />
            </div>
          </div>
          <div className="tf-sprint-metric-val">
            -3.4 <span className="tf-sprint-metric-unit">pts/day</span>
          </div>
          <div className="tf-sprint-metric-footer">
            <span className="tf-sprint-metric-sub">Required: -3.0 pts/day</span>
          </div>
        </div>

        <div className="tf-sprint-metric-card">
          <div className="tf-sprint-metric-header">
            <span className="tf-sprint-metric-title">Active Scope</span>
            <div className="tf-sprint-metric-icon bg-sky">
              <Layers size={16} />
            </div>
          </div>
          <div className="tf-sprint-metric-val">{issues.length}</div>
          <div className="tf-sprint-metric-footer">
            <span className="tf-sprint-metric-sub">
              {issues.filter((i) => i.type === "Story").length} Stories ·{" "}
              {issues.filter((i) => i.type === "Bug").length} Bugs ·{" "}
              {issues.filter((i) => i.type === "Task").length} Tasks
            </span>
          </div>
        </div>

        <div className="tf-sprint-metric-card">
          <div className="tf-sprint-metric-header">
            <span className="tf-sprint-metric-title">Squad Capacity</span>
            <div className="tf-sprint-metric-icon bg-purple">
              <Users size={16} />
            </div>
          </div>
          <div className="tf-sprint-metric-val">84%</div>
          <div className="tf-sprint-metric-footer">
            <span className="tf-sprint-metric-sub">320 hrs / 380 hrs allocated</span>
          </div>
        </div>
      </div>

      {/* INTERACTIVE BURNDOWN CHART SECTION */}
      <div className="tf-sprint-chart-card">
        <div className="tf-sprint-chart-header">
          <div>
            <div className="tf-sprint-chart-eyebrow">SPRINT TELEMETRY</div>
            <h3 className="tf-sprint-chart-title">Sprint 24 Burndown Telemetry</h3>
            <p className="tf-sprint-chart-sub">
              Comparison between ideal linear burndown trajectory and actual daily team story points remaining.
            </p>
          </div>

          <div className="tf-sprint-chart-legend">
            <div className="tf-sprint-legend-item">
              <span className="tf-sprint-legend-line ideal" />
              <span>Ideal Burndown</span>
            </div>
            <div className="tf-sprint-legend-item">
              <span className="tf-sprint-legend-line actual" />
              <span>Actual Remaining ({remainingPoints} pts)</span>
            </div>
          </div>
        </div>

        {/* SVG BURNDOWN CHART */}
        <div className="tf-sprint-svg-wrapper">
          <svg
            viewBox={`0 0 ${chartW} ${chartH}`}
            className="tf-sprint-svg-chart"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <linearGradient id="tfActualBurnGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.28" />
                <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Horizontal Grid lines */}
            {[0, 20, 40, 60, 80].map((v) => {
              const y = getY(v);
              return (
                <g key={`grid-y-${v}`}>
                  <line
                    x1={padL}
                    y1={y}
                    x2={chartW - padR}
                    y2={y}
                    className="tf-sprint-grid-line"
                  />
                  <text
                    x={padL - 10}
                    y={y + 4}
                    textAnchor="end"
                    className="tf-sprint-axis-text"
                  >
                    {v}
                  </text>
                </g>
              );
            })}

            {/* Area under actual burndown */}
            {actualAreaPath && (
              <path d={actualAreaPath} fill="url(#tfActualBurnGradient)" />
            )}

            {/* Ideal burndown line (Dashed) */}
            <path
              d={idealPath}
              fill="none"
              stroke="#94a3b8"
              strokeWidth="2"
              strokeDasharray="5,5"
              strokeLinecap="round"
            />

            {/* Actual burndown line */}
            <path
              d={actualLinePath}
              fill="none"
              stroke="#4f46e5"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Data points for actual days */}
            {actualDays.map((d, i) => {
              const cx = getX(i);
              const cy = getY(d.actual);
              const isHovered = hoveredDay && hoveredDay.day === d.day;
              return (
                <g
                  key={`actual-pt-${d.day}`}
                  className="tf-sprint-chart-point"
                  onMouseEnter={() => setHoveredDay(d)}
                >
                  <circle
                    cx={cx}
                    cy={cy}
                    r={isHovered ? 6 : 4}
                    className={`tf-sprint-point-dot ${isHovered ? "active" : ""}`}
                  />
                  <text
                    x={cx}
                    y={chartH - 8}
                    textAnchor="middle"
                    className="tf-sprint-axis-text x-axis"
                  >
                    {d.day === 11 ? "Today" : `D${d.day}`}
                  </text>
                </g>
              );
            })}

            {/* Future days X-axis labels */}
            {BURNDOWN_DAYS.slice(actualDays.length).map((d) => {
              const cx = getX(d.day - 1);
              return (
                <text
                  key={`future-axis-${d.day}`}
                  x={cx}
                  y={chartH - 8}
                  textAnchor="middle"
                  className="tf-sprint-axis-text x-axis future"
                >
                  D{d.day}
                </text>
              );
            })}
          </svg>

          {/* INTERACTIVE HOVER CARD */}
          {hoveredDay && (
            <div className="tf-sprint-chart-hover-pill">
              <span className="tf-sprint-hover-day">
                {hoveredDay.label} · {hoveredDay.date}
              </span>
              <span className="tf-sprint-hover-stat">
                Actual: <strong>{hoveredDay.actual !== null ? `${hoveredDay.actual} pts` : "Projected"}</strong>
              </span>
              <span className="tf-sprint-hover-stat">
                Ideal Target: <strong>{hoveredDay.ideal.toFixed(1)} pts</strong>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* VIEW NAVIGATION TABS */}
      <div className="tf-sprint-tab-row">
        <div className="tf-sprint-tab-btns">
          <button
            type="button"
            className={`tf-sprint-tab-btn ${activeTab === "board" ? "active" : ""}`}
            onClick={() => setActiveTab("board")}
          >
            <FolderKanban size={16} />
            <span>Agile Kanban Board ({filteredIssues.length})</span>
          </button>
          <button
            type="button"
            className={`tf-sprint-tab-btn ${activeTab === "capacity" ? "active" : ""}`}
            onClick={() => setActiveTab("capacity")}
          >
            <Users size={16} />
            <span>Squad Capacity & Workload (8 Engineers)</span>
          </button>
        </div>

        {/* SEARCH & FILTERS */}
        {activeTab === "board" && (
          <div className="tf-sprint-filter-bar">
            <div className="tf-sprint-search-input-wrap">
              <Search size={15} className="tf-sprint-search-icon" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search sprint issues..."
                className="tf-sprint-search-input"
              />
              {searchQuery && (
                <button
                  type="button"
                  className="tf-sprint-search-clear"
                  onClick={() => setSearchQuery("")}
                >
                  <X size={13} />
                </button>
              )}
            </div>

            <div className="tf-sprint-filter-group">
              <Filter size={14} className="tf-sprint-filter-icon" />
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="tf-sprint-select"
              >
                <option value="All">All Types</option>
                <option value="Story">Story</option>
                <option value="Task">Task</option>
                <option value="Bug">Bug</option>
                <option value="Spike">Spike</option>
              </select>

              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="tf-sprint-select"
              >
                <option value="All">All Priorities</option>
                <option value="Urgent">Urgent</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* TAB 1: AGILE KANBAN BOARD */}
      {activeTab === "board" && (
        <div className="tf-sprint-board-grid">
          {COLUMNS.map((col) => {
            const colIssues = filteredIssues.filter((i) => i.stage === col.key);
            const colPts = colIssues.reduce((acc, c) => acc + (Number(c.points) || 0), 0);

            return (
              <div key={col.key} className={`tf-sprint-col tf-sprint-col--${col.tone}`}>
                <div className="tf-sprint-col-header">
                  <div className="tf-sprint-col-title-wrap">
                    <span className="tf-sprint-col-dot" />
                    <h4 className="tf-sprint-col-name">{col.title}</h4>
                  </div>
                  <div className="tf-sprint-col-counts">
                    <span className="tf-sprint-col-issue-cnt">{colIssues.length}</span>
                    <span className="tf-sprint-col-pts-badge">{colPts} pts</span>
                  </div>
                </div>

                <div className="tf-sprint-cards-stack">
                  {colIssues.length === 0 ? (
                    <div className="tf-sprint-empty-col">
                      <p>No issues in this stage</p>
                    </div>
                  ) : (
                    colIssues.map((issue) => (
                      <div key={issue.id} className="tf-sprint-issue-card">
                        <div className="tf-sprint-card-top">
                          <div className="tf-sprint-card-type-wrap">
                            <span className={`tf-sprint-type-badge ${issue.type.toLowerCase()}`}>
                              {issue.type === "Story" && <FolderKanban size={11} />}
                              {issue.type === "Task" && <CheckSquare size={11} />}
                              {issue.type === "Bug" && <Bug size={11} />}
                              {issue.type === "Spike" && <Zap size={11} />}
                              {issue.type}
                            </span>
                            <span className="tf-sprint-card-key">{issue.id}</span>
                          </div>

                          <div className="tf-sprint-card-top-right">
                            <span className="tf-sprint-points-pill">{issue.points} pts</span>
                            <span className={`tf-sprint-priority-badge ${issue.priority.toLowerCase()}`}>
                              {issue.priority}
                            </span>
                          </div>
                        </div>

                        <h5 className="tf-sprint-card-title">{issue.title}</h5>

                        {issue.description && (
                          <p className="tf-sprint-card-desc">{issue.description}</p>
                        )}

                        <div className="tf-sprint-card-footer">
                          {/* Assignee Avatar */}
                          <div className="tf-sprint-card-assignee">
                            <span
                              className="tf-sprint-assignee-avatar"
                              style={{ backgroundColor: issue.assigneeColor || "#4f46e5" }}
                            >
                              {issue.assigneeAvatar || issue.assignee.slice(0, 2).toUpperCase()}
                            </span>
                            <span className="tf-sprint-assignee-name">{issue.assignee}</span>
                          </div>

                          {/* Card Actions */}
                          <div className="tf-sprint-card-actions">
                            {/* Move Left */}
                            {col.key !== "backlog" && (
                              <button
                                type="button"
                                className="tf-sprint-card-btn"
                                title="Move to previous stage"
                                onClick={() => moveIssueStage(issue.id, "prev")}
                              >
                                <ArrowLeft size={13} />
                              </button>
                            )}

                            {/* Move Right */}
                            {col.key !== "done" && (
                              <button
                                type="button"
                                className="tf-sprint-card-btn"
                                title="Advance to next stage"
                                onClick={() => moveIssueStage(issue.id, "next")}
                              >
                                <ArrowRight size={13} />
                              </button>
                            )}

                            {/* Edit */}
                            <button
                              type="button"
                              className="tf-sprint-card-btn"
                              title="Edit Issue"
                              onClick={() => openEditModal(issue)}
                            >
                              <Edit2 size={13} />
                            </button>

                            {/* Delete */}
                            <button
                              type="button"
                              className="tf-sprint-card-btn delete"
                              title="Remove Issue"
                              onClick={() => setIssueToDelete(issue)}
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: SQUAD CAPACITY & ALLOCATION */}
      {activeTab === "capacity" && (
        <div className="tf-sprint-capacity-panel">
          <div className="tf-sprint-capacity-intro">
            <div>
              <h3 className="tf-sprint-capacity-title">Squad Capacity Balancing</h3>
              <p className="tf-sprint-capacity-sub">
                Engineering squad story point commitment and bandwidth utilization for Sprint 24.
              </p>
            </div>
            <div className="tf-sprint-capacity-summary-pill">
              Total Squad Bandwidth: <strong>86 pts</strong> · Committed: <strong>{totalPoints} pts</strong>
            </div>
          </div>

          <div className="tf-sprint-capacity-grid">
            {SQUAD_MEMBERS.map((member) => {
              const memberIssues = issues.filter((i) => i.assignee === member.name);
              const assignedPts = memberIssues.reduce((acc, c) => acc + (Number(c.points) || 0), 0);
              const pct = Math.round((assignedPts / member.capacityPts) * 100);
              const isOver = pct > 100;
              const isOptimal = pct >= 75 && pct <= 100;

              return (
                <div key={member.name} className="tf-sprint-member-card">
                  <div className="tf-sprint-member-top">
                    <div className="tf-sprint-member-info">
                      <span
                        className="tf-sprint-member-avatar"
                        style={{ backgroundColor: member.color }}
                      >
                        {member.avatar}
                      </span>
                      <div>
                        <div className="tf-sprint-member-name">{member.name}</div>
                        <div className="tf-sprint-member-role">{member.role}</div>
                      </div>
                    </div>

                    <span
                      className={`tf-sprint-member-status-pill ${
                        isOver ? "danger" : isOptimal ? "optimal" : "normal"
                      }`}
                    >
                      {isOver ? "Overloaded" : isOptimal ? "Optimal" : "Balanced"}
                    </span>
                  </div>

                  <div className="tf-sprint-member-progress-block">
                    <div className="tf-sprint-member-progress-labels">
                      <span>Workload Allocated</span>
                      <span>
                        <strong>{assignedPts}</strong> / {member.capacityPts} pts ({pct}%)
                      </span>
                    </div>
                    <div className="tf-sprint-member-track">
                      <div
                        className={`tf-sprint-member-fill ${isOver ? "over" : ""}`}
                        style={{ width: `${Math.min(100, pct)}%` }}
                      />
                    </div>
                  </div>

                  <div className="tf-sprint-member-issues-list">
                    <span className="tf-sprint-assigned-count">
                      {memberIssues.length} Sprint {memberIssues.length === 1 ? "Issue" : "Issues"} Assigned:
                    </span>
                    <div className="tf-sprint-assigned-chips">
                      {memberIssues.map((iss) => (
                        <span key={iss.id} className="tf-sprint-assigned-chip">
                          {iss.id} ({iss.points}p)
                        </span>
                      ))}
                      {memberIssues.length === 0 && (
                        <span className="tf-sprint-assigned-none">No active issues assigned</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* CREATE / EDIT ISSUE MODAL */}
      {isCreateModalOpen && (
        <div className="tf-sprint-modal-overlay" onClick={() => setIsCreateModalOpen(false)}>
          <div className="tf-sprint-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="tf-sprint-modal-header">
              <div className="tf-sprint-modal-title-wrap">
                <div className="tf-sprint-modal-icon bg-indigo">
                  <Sparkles size={18} />
                </div>
                <div>
                  <h3 className="tf-sprint-modal-title">
                    {editingIssue ? `Edit Issue (${editingIssue.id})` : "Create Sprint Issue"}
                  </h3>
                  <p className="tf-sprint-modal-sub">
                    {editingIssue
                      ? "Update ticket details, story points, and sprint stage."
                      : "Add a new story, task, or bug directly into the active Sprint 24 backlog."}
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="tf-sprint-modal-close"
                onClick={() => setIsCreateModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveIssue} className="tf-sprint-form">
              <div className="tf-sprint-form-group">
                <label className="tf-sprint-form-label">Issue Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Implement OAuth 2.0 PKCE flow..."
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="tf-sprint-input"
                />
              </div>

              <div className="tf-sprint-form-row">
                <div className="tf-sprint-form-group">
                  <label className="tf-sprint-form-label">Issue Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="tf-sprint-input"
                  >
                    <option value="Story">Story (Feature)</option>
                    <option value="Task">Task (Technical)</option>
                    <option value="Bug">Bug (Fix)</option>
                    <option value="Spike">Spike (Research)</option>
                  </select>
                </div>

                <div className="tf-sprint-form-group">
                  <label className="tf-sprint-form-label">Story Points</label>
                  <select
                    value={formData.points}
                    onChange={(e) => setFormData({ ...formData, points: Number(e.target.value) })}
                    className="tf-sprint-input"
                  >
                    <option value={1}>1 pt (Trivial)</option>
                    <option value={2}>2 pts (Minor)</option>
                    <option value={3}>3 pts (Standard)</option>
                    <option value={5}>5 pts (Medium)</option>
                    <option value={8}>8 pts (Large)</option>
                    <option value={13}>13 pts (Epic / Complex)</option>
                  </select>
                </div>
              </div>

              <div className="tf-sprint-form-row">
                <div className="tf-sprint-form-group">
                  <label className="tf-sprint-form-label">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="tf-sprint-input"
                  >
                    <option value="Urgent">Urgent (P0)</option>
                    <option value="High">High (P1)</option>
                    <option value="Medium">Medium (P2)</option>
                    <option value="Low">Low (P3)</option>
                  </select>
                </div>

                <div className="tf-sprint-form-group">
                  <label className="tf-sprint-form-label">Stage Column</label>
                  <select
                    value={formData.stage}
                    onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                    className="tf-sprint-input"
                  >
                    <option value="backlog">Sprint Backlog</option>
                    <option value="in_progress">In Development</option>
                    <option value="review">Code Review & QA</option>
                    <option value="done">Done / Shipped</option>
                  </select>
                </div>
              </div>

              <div className="tf-sprint-form-group">
                <label className="tf-sprint-form-label">Assignee</label>
                <select
                  value={formData.assignee}
                  onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
                  className="tf-sprint-input"
                >
                  {SQUAD_MEMBERS.map((m) => (
                    <option key={m.name} value={m.name}>
                      {m.name} ({m.role})
                    </option>
                  ))}
                </select>
              </div>

              <div className="tf-sprint-form-group">
                <label className="tf-sprint-form-label">Description / Acceptance Criteria</label>
                <textarea
                  rows={3}
                  placeholder="Describe implementation details, scope, or edge cases..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="tf-sprint-input tf-sprint-textarea"
                />
              </div>

              <div className="tf-sprint-modal-footer">
                <button
                  type="button"
                  className="tf-sprint-btn tf-sprint-btn-secondary"
                  onClick={() => setIsCreateModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="tf-sprint-btn tf-sprint-btn-primary">
                  <Check size={16} />
                  <span>{editingIssue ? "Save Changes" : "Create Issue"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* COMPLETE SPRINT MODAL */}
      {isCompleteModalOpen && (
        <div className="tf-sprint-modal-overlay" onClick={() => setIsCompleteModalOpen(false)}>
          <div className="tf-sprint-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="tf-sprint-modal-header">
              <div className="tf-sprint-modal-title-wrap">
                <div className="tf-sprint-modal-icon bg-emerald">
                  <CheckCircle2 size={18} />
                </div>
                <div>
                  <h3 className="tf-sprint-modal-title">Complete Sprint 24</h3>
                  <p className="tf-sprint-modal-sub">
                    Review completed accomplishments and roll over open work items.
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="tf-sprint-modal-close"
                onClick={() => setIsCompleteModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="tf-sprint-complete-summary">
              <div className="tf-sprint-complete-metric">
                <span className="tf-sprint-complete-lbl">Shipped Story Points</span>
                <span className="tf-sprint-complete-val">{completedPoints} pts</span>
              </div>
              <div className="tf-sprint-complete-metric">
                <span className="tf-sprint-complete-lbl">Open Rollover Issues</span>
                <span className="tf-sprint-complete-val">{issues.filter((i) => i.stage !== "done").length}</span>
              </div>
              <div className="tf-sprint-complete-metric">
                <span className="tf-sprint-complete-lbl">Completion Rate</span>
                <span className="tf-sprint-complete-val">{completionPercentage}%</span>
              </div>
            </div>

            <p className="tf-sprint-complete-note">
              Incomplete issues will be moved to <strong>Sprint 25 (Planning)</strong> and recorded in the team retrospective report.
            </p>

            <div className="tf-sprint-modal-footer">
              <button
                type="button"
                className="tf-sprint-btn tf-sprint-btn-secondary"
                onClick={() => setIsCompleteModalOpen(false)}
              >
                Keep Active
              </button>
              <button
                type="button"
                className="tf-sprint-btn tf-sprint-btn-primary"
                onClick={handleCompleteSprint}
              >
                <CheckCircle2 size={16} />
                <span>Confirm & Close Sprint 24</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PURE CSS ADMIN-GRADE DELETE CONFIRMATION MODAL */}
      {issueToDelete && (
        <div className="tl-delete-modal-overlay" onClick={() => setIssueToDelete(null)}>
          <div className="tl-delete-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="tl-delete-modal-icon-circle">
              <AlertCircle size={28} />
            </div>
            <h3>Remove Sprint Issue?</h3>
            <p>
              Are you sure you want to remove <strong>{issueToDelete.id}</strong> (
              <em>{issueToDelete.title}</em>)? This action cannot be undone.
            </p>
            <div className="tl-delete-modal-footer">
              <button
                type="button"
                className="tl-btn-secondary"
                onClick={() => setIssueToDelete(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="tl-btn-danger"
                onClick={confirmDeleteIssue}
              >
                Delete Issue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

