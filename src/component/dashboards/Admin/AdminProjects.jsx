import React, { useEffect, useMemo, useState } from "react";
import {
  FolderKanban,
  Search,
  Plus,
  Filter,
  Download,
  RotateCcw,
  LayoutGrid,
  List,
  Pencil,
  Trash2,
  Copy,
  ChevronDown,
  X,
  Users,
  CalendarDays,
  Building2,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Play,
  Folder,
  Layout,
  Smartphone,
  Sparkles,
  Megaphone,
  BarChart3,
  Bug,
  MoreVertical,
  Calendar,
  ArrowRight,
  TrendingUp,
  UserCheck,
  Check,
  Layers,
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

import AdminSidebar from "./AdminSidebar.jsx";
import AdminTopbar from "./AdminTopbar.jsx";
import {
  initialAdminProjects,
  projectStatuses,
  projectPriorities,
  workspaceOptions,
  teamMembersList,
  recentActivities,
} from "./adminProjectsData.js";
import "./AdminProjects.css";

const STORAGE_KEY = "teamflow_admin_projects_v2";

const loadProjects = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error(e);
  }
  return initialAdminProjects;
};

export default function AdminProjects() {
  const [projects, setProjects] = useState(loadProjects);
  const [mobileOpen, setMobileOpen] = useState(false);

  // View Mode: 'kanban' | 'list' | 'timeline'
  const [viewMode, setViewMode] = useState("kanban");

  // Filters & Search
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [workspaceFilter, setWorkspaceFilter] = useState("All");
  const [memberFilter, setMemberFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [sortKey, setSortKey] = useState("recentlyUpdated"); // 'recentlyUpdated' | 'name-asc' | 'name-desc' | 'progress-desc' | 'dueDate'

  // Card Dropdown State
  const [activeMenuId, setActiveMenuId] = useState(null);

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // Form State
  const [form, setForm] = useState({
    name: "",
    workspace: "TeamFlow",
    owner: "Rahul Sharma",
    ownerEmail: "rahul@teamflow.ai",
    status: "Active",
    priority: "High",
    progress: 45,
    tasks: 12,
    completedTasks: 5,
    dueDate: "2026-11-30",
    description: "",
    color: "#6366f1",
    iconType: "layout",
  });

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const saveProjects = (newProjects, notifyMsg = null) => {
    setProjects(newProjects);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newProjects));
    } catch (e) {}
    window.dispatchEvent(new Event("teamflow_data_update"));
    if (notifyMsg) showToast(notifyMsg);
  };

  // Close menus on outside click
  useEffect(() => {
    const handleOutside = () => setActiveMenuId(null);
    window.addEventListener("click", handleOutside);
    return () => window.removeEventListener("click", handleOutside);
  }, []);

  // Filtered & Sorted Projects
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const term = search.trim().toLowerCase();
      const matchesSearch =
        !term ||
        p.name?.toLowerCase().includes(term) ||
        p.owner?.toLowerCase().includes(term) ||
        p.workspace?.toLowerCase().includes(term) ||
        p.description?.toLowerCase().includes(term);

      const matchesStatus = statusFilter === "All" || p.status === statusFilter;
      const matchesWorkspace =
        workspaceFilter === "All" || p.workspace === workspaceFilter;
      const matchesPriority =
        priorityFilter === "All" || p.priority === priorityFilter;
      const matchesMember =
        memberFilter === "All" ||
        p.owner === memberFilter ||
        p.team?.some((m) => m.name === memberFilter);

      return (
        matchesSearch &&
        matchesStatus &&
        matchesWorkspace &&
        matchesPriority &&
        matchesMember
      );
    }).sort((a, b) => {
      if (sortKey === "name-asc") return a.name.localeCompare(b.name);
      if (sortKey === "name-desc") return b.name.localeCompare(a.name);
      if (sortKey === "progress-desc") return (b.progress || 0) - (a.progress || 0);
      if (sortKey === "dueDate") return (a.dueDate || "").localeCompare(b.dueDate || "");
      // recentlyUpdated
      return b.id - a.id;
    });
  }, [
    projects,
    search,
    statusFilter,
    workspaceFilter,
    priorityFilter,
    memberFilter,
    sortKey,
  ]);

  // Overall Statistics matching reference design
  const stats = useMemo(() => {
    const total = projects.length;
    const active = projects.filter((p) => p.status === "Active").length;
    const completed = projects.filter((p) => p.status === "Completed").length;
    const onHold = projects.filter((p) => p.status === "On Hold").length;
    return { total, active, completed, onHold };
  }, [projects]);

  // Workspace distribution stats for Bar Chart
  const workspaceStats = useMemo(() => {
    const counts = { TeamFlow: 0, Marketing: 0, Development: 0, Design: 0 };
    projects.forEach((p) => {
      if (counts[p.workspace] !== undefined) {
        counts[p.workspace]++;
      } else {
        counts.TeamFlow++;
      }
    });
    return counts;
  }, [projects]);

  // Progress overview for top 4 projects
  const progressOverviewList = useMemo(() => {
    return projects.slice(0, 4);
  }, [projects]);

  // Open Create Modal
  const openCreateModal = () => {
    setEditingProject(null);
    setForm({
      name: "",
      workspace: "TeamFlow",
      owner: "Rahul Sharma",
      ownerEmail: "rahul@teamflow.ai",
      status: "Active",
      priority: "High",
      progress: 0,
      tasks: 10,
      completedTasks: 0,
      dueDate: "2026-12-15",
      description: "",
      color: "#6366f1",
      iconType: "layout",
    });
    setShowCreateModal(true);
  };

  // Open Edit Modal
  const openEditModal = (p) => {
    setEditingProject(p);
    setForm({
      name: p.name || "",
      workspace: p.workspace || "TeamFlow",
      owner: p.owner || "Rahul Sharma",
      ownerEmail: p.ownerEmail || "rahul@teamflow.ai",
      status: p.status || "Active",
      priority: p.priority || "Medium",
      progress: p.progress || 0,
      tasks: p.tasks || 10,
      completedTasks: p.completedTasks || 0,
      dueDate: p.dueDate || "",
      description: p.description || "",
      color: p.color || "#6366f1",
      iconType: p.iconType || "layout",
    });
    setShowCreateModal(true);
  };

  // Submit Create or Edit Form
  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      showToast("Project title is required", "error");
      return;
    }

    const calcProgress =
      form.tasks > 0
        ? Math.round((Number(form.completedTasks) / Number(form.tasks)) * 100)
        : Number(form.progress) || 0;

    if (editingProject) {
      const updated = projects.map((p) =>
        p.id === editingProject.id
          ? {
              ...p,
              ...form,
              tasks: Number(form.tasks),
              completedTasks: Number(form.completedTasks),
              progress: calcProgress,
            }
          : p
      );
      saveProjects(updated, `Updated "${form.name}" successfully.`);
    } else {
      const newProj = {
        id: Date.now(),
        ...form,
        tasks: Number(form.tasks),
        completedTasks: Number(form.completedTasks),
        progress: calcProgress,
        createdAt: new Date().toISOString().split("T")[0],
        team: [
          { name: form.owner, avatar: form.owner.slice(0, 2).toUpperCase(), color: form.color },
          { name: "Priya Patel", avatar: "PP", color: "#10b981" },
        ],
        extraMembers: 2,
      };
      saveProjects([newProj, ...projects], `Created "${form.name}" successfully.`);
    }

    setShowCreateModal(false);
  };

  // Duplicate Project
  const handleDuplicate = (p) => {
    const clone = {
      ...p,
      id: Date.now(),
      name: `${p.name} (Copy)`,
      createdAt: new Date().toISOString().split("T")[0],
    };
    saveProjects([clone, ...projects], `Duplicated "${p.name}".`);
  };

  // Delete Project
  const confirmDeleteProject = () => {
    if (!projectToDelete) return;
    const remaining = projects.filter((p) => p.id !== projectToDelete.id);
    saveProjects(remaining, `Deleted "${projectToDelete.name}".`);
    setProjectToDelete(null);
  };

  // Reset Demo Data
  const handleResetDemoData = () => {
    saveProjects(initialAdminProjects, "Reset projects to default demo data.");
    setShowResetConfirm(false);
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ["ID", "Name", "Workspace", "Status", "Priority", "Progress", "Tasks", "Due Date", "Owner"];
    const rows = filteredProjects.map((p) => [
      p.id,
      `"${p.name}"`,
      `"${p.workspace}"`,
      `"${p.status}"`,
      `"${p.priority}"`,
      `${p.progress}%`,
      `${p.completedTasks}/${p.tasks}`,
      `"${p.dueDate}"`,
      `"${p.owner}"`,
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = `teamflow_projects_${Date.now()}.csv`;
    link.click();
    setExportOpen(false);
    showToast("Projects exported to CSV.");
  };

  // Export JSON
  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(filteredProjects, null, 2));
    const link = document.createElement("a");
    link.href = dataStr;
    link.download = `teamflow_projects_${Date.now()}.json`;
    link.click();
    setExportOpen(false);
    showToast("Projects exported to JSON.");
  };

  // Icon Helper for project cards
  const renderProjectIcon = (iconType, color = "#6366f1") => {
    switch (iconType) {
      case "mobile":
        return <Smartphone size={20} />;
      case "brain":
        return <Sparkles size={20} />;
      case "megaphone":
        return <Megaphone size={20} />;
      case "chart":
        return <BarChart3 size={20} />;
      case "users":
        return <Users size={20} />;
      case "bug":
        return <Bug size={20} />;
      case "folder":
        return <Folder size={20} />;
      default:
        return <Layout size={20} />;
    }
  };

  // Donut chart stroke calculation
  const totalCount = stats.total || 1;
  const activePct = Math.round((stats.active / totalCount) * 100);
  const completedPct = Math.round((stats.completed / totalCount) * 100);
  const onHoldPct = Math.round((stats.onHold / totalCount) * 100);

  return (
    <div className="admin-projects-app projectManagementPage">
      <AdminSidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="admin-projects-main">
        <AdminTopbar
          onMobileMenuToggle={() => setMobileOpen(true)}
          onCreateProject={openCreateModal}
        />

        {toast && (
          <div className={`ap-toast ap-toast--${toast.type}`}>
            <CheckCircle2 size={16} />
            <span>{toast.message}</span>
          </div>
        )}

        <main className="ap-content-container">
          {/* =========================================================
             1. TOP HEADER ROW (Matching reference design)
          ========================================================= */}
          <div className="ap-main-header">
            <div className="ap-header-left">
              <div className="ap-header-icon-chip">
                <Folder size={24} />
              </div>
              <div>
                <h1 className="ap-header-title">Project Management</h1>
                <p className="ap-header-sub">
                  Plan, track, and deliver your projects with your team.
                </p>
              </div>
            </div>

            <div className="ap-header-right">
              {/* VIEW SWITCHER */}
              <div className="ap-view-selector">
                <button
                  type="button"
                  className={`ap-view-btn ${viewMode === "kanban" ? "active" : ""}`}
                  onClick={() => setViewMode("kanban")}
                >
                  <FolderKanban size={14} />
                  <span>Kanban</span>
                </button>
                <button
                  type="button"
                  className={`ap-view-btn ${viewMode === "list" ? "active" : ""}`}
                  onClick={() => setViewMode("list")}
                >
                  <List size={14} />
                  <span>List</span>
                </button>
                <button
                  type="button"
                  className={`ap-view-btn ${viewMode === "timeline" ? "active" : ""}`}
                  onClick={() => setViewMode("timeline")}
                >
                  <CalendarDays size={14} />
                  <span>Timeline</span>
                </button>
              </div>

              {/* CREATE PROJECT BUTTON */}
              <button
                type="button"
                className="ap-btn-create-project"
                onClick={openCreateModal}
              >
                <Plus size={16} />
                <span>Create Project</span>
              </button>
            </div>
          </div>

          {/* =========================================================
             2. TOP STATS KPI ROW (4 Cards with sparklines)
          ========================================================= */}
          <div className="ap-stats-row">
            {/* Total Projects */}
            <div className="ap-stat-card">
              <div className="ap-stat-left">
                <div className="ap-stat-icon-wrap blue">
                  <Folder size={20} />
                </div>
                <div>
                  <span className="ap-stat-title">Total Projects</span>
                  <div className="ap-stat-val-row">
                    <strong className="ap-stat-val">{stats.total}</strong>
                    <span className="ap-stat-badge up">↑ 20%</span>
                  </div>
                  <small className="ap-stat-sub">+2 this month</small>
                </div>
              </div>
              <div className="ap-sparkline-wrap">
                <svg width="68" height="32" viewBox="0 0 68 32">
                  <path
                    d="M2,24 Q16,28 26,14 T50,18 T66,6"
                    fill="none"
                    stroke="#6366f1"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>

            {/* Active Projects */}
            <div className="ap-stat-card">
              <div className="ap-stat-left">
                <div className="ap-stat-icon-wrap green">
                  <Play size={18} fill="currentColor" />
                </div>
                <div>
                  <span className="ap-stat-title">Active Projects</span>
                  <div className="ap-stat-val-row">
                    <strong className="ap-stat-val">{stats.active}</strong>
                    <span className="ap-stat-badge up">↑ 14%</span>
                  </div>
                  <small className="ap-stat-sub">+1 this month</small>
                </div>
              </div>
              <div className="ap-sparkline-wrap">
                <svg width="68" height="32" viewBox="0 0 68 32">
                  <path
                    d="M2,26 Q18,22 30,12 T52,14 T66,4"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>

            {/* Completed */}
            <div className="ap-stat-card">
              <div className="ap-stat-left">
                <div className="ap-stat-icon-wrap blue-check">
                  <CheckCircle2 size={20} />
                </div>
                <div>
                  <span className="ap-stat-title">Completed</span>
                  <div className="ap-stat-val-row">
                    <strong className="ap-stat-val">{stats.completed}</strong>
                    <span className="ap-stat-badge up">↑ 50%</span>
                  </div>
                  <small className="ap-stat-sub">+1 this month</small>
                </div>
              </div>
              <div className="ap-sparkline-wrap">
                <svg width="68" height="32" viewBox="0 0 68 32">
                  <path
                    d="M2,28 Q18,24 32,16 T52,10 T66,2"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>

            {/* On Hold */}
            <div className="ap-stat-card">
              <div className="ap-stat-left">
                <div className="ap-stat-icon-wrap amber">
                  <Clock size={20} />
                </div>
                <div>
                  <span className="ap-stat-title">On Hold</span>
                  <div className="ap-stat-val-row">
                    <strong className="ap-stat-val">{stats.onHold}</strong>
                    <span className="ap-stat-badge down">↓ 50%</span>
                  </div>
                  <small className="ap-stat-sub">-1 this month</small>
                </div>
              </div>
              <div className="ap-sparkline-wrap">
                <svg width="68" height="32" viewBox="0 0 68 32">
                  <path
                    d="M2,10 Q20,6 34,18 T52,22 T66,26"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* =========================================================
             3. ANALYTICS & CHARTS ROW (3 Cards matching design)
          ========================================================= */}
          <div className="ap-charts-row">
            {/* 1. Project Status Distribution (Donut Chart) */}
            <div className="ap-chart-card">
              <div className="ap-chart-card-header">
                <h3>Project Status Distribution</h3>
                <button type="button" className="ap-btn-icon-more" aria-label="More options">
                  <MoreVertical size={16} />
                </button>
              </div>

              <div className="ap-donut-content">
                <div className="ap-donut-svg-wrap">
                  <svg width="120" height="120" viewBox="0 0 120 120">
                    <circle
                      cx="60"
                      cy="60"
                      r="46"
                      stroke="#f1f5f9"
                      strokeWidth="14"
                      fill="transparent"
                      className="ap-donut-base-ring"
                    />
                    {/* Active (Green) Arc: 67% */}
                    <circle
                      cx="60"
                      cy="60"
                      r="46"
                      stroke="#10b981"
                      strokeWidth="14"
                      strokeDasharray="289"
                      strokeDashoffset="95"
                      strokeLinecap="round"
                      fill="transparent"
                      transform="rotate(-90 60 60)"
                    />
                    {/* Completed (Blue) Arc: 25% */}
                    <circle
                      cx="60"
                      cy="60"
                      r="46"
                      stroke="#3b82f6"
                      strokeWidth="14"
                      strokeDasharray="72 217"
                      strokeDashoffset="-194"
                      fill="transparent"
                      transform="rotate(-90 60 60)"
                    />
                    {/* On Hold (Yellow) Arc: 8% */}
                    <circle
                      cx="60"
                      cy="60"
                      r="46"
                      stroke="#f59e0b"
                      strokeWidth="14"
                      strokeDasharray="23 266"
                      strokeDashoffset="-266"
                      fill="transparent"
                      transform="rotate(-90 60 60)"
                    />
                  </svg>
                  <div className="ap-donut-center-label">
                    <strong>{stats.total}</strong>
                    <small>Projects</small>
                  </div>
                </div>

                <div className="ap-donut-legend">
                  <div className="ap-legend-row">
                    <span className="ap-legend-dot green" />
                    <span className="ap-legend-name">Active</span>
                    <strong className="ap-legend-val">{stats.active} ({activePct}%)</strong>
                  </div>
                  <div className="ap-legend-row">
                    <span className="ap-legend-dot blue" />
                    <span className="ap-legend-name">Completed</span>
                    <strong className="ap-legend-val">{stats.completed} ({completedPct}%)</strong>
                  </div>
                  <div className="ap-legend-row">
                    <span className="ap-legend-dot yellow" />
                    <span className="ap-legend-name">On Hold</span>
                    <strong className="ap-legend-val">{stats.onHold} ({onHoldPct}%)</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Projects by Workspace (Vertical Bar Chart) */}
            <div className="ap-chart-card">
              <div className="ap-chart-card-header">
                <h3>Projects by Workspace</h3>
              </div>

              <div className="ap-bar-chart-body">
                <div className="ap-bar-chart-axis">
                  <span>6</span>
                  <span>4</span>
                  <span>2</span>
                  <span>0</span>
                </div>

                <div className="ap-bar-chart-bars">
                  {/* TeamFlow (5) */}
                  <div className="ap-bar-col">
                    <span className="ap-bar-top-val">{workspaceStats.TeamFlow}</span>
                    <div className="ap-bar-pillar-wrap">
                      <div
                        className="ap-bar-pillar purple"
                        style={{ height: `${(workspaceStats.TeamFlow / 6) * 100}%` }}
                      />
                    </div>
                    <span className="ap-bar-col-name">TeamFlow</span>
                  </div>

                  {/* Marketing (3) */}
                  <div className="ap-bar-col">
                    <span className="ap-bar-top-val">{workspaceStats.Marketing}</span>
                    <div className="ap-bar-pillar-wrap">
                      <div
                        className="ap-bar-pillar blue"
                        style={{ height: `${(workspaceStats.Marketing / 6) * 100}%` }}
                      />
                    </div>
                    <span className="ap-bar-col-name">Marketing</span>
                  </div>

                  {/* Development (2) */}
                  <div className="ap-bar-col">
                    <span className="ap-bar-top-val">{workspaceStats.Development}</span>
                    <div className="ap-bar-pillar-wrap">
                      <div
                        className="ap-bar-pillar green"
                        style={{ height: `${(workspaceStats.Development / 6) * 100}%` }}
                      />
                    </div>
                    <span className="ap-bar-col-name">Development</span>
                  </div>

                  {/* Design (2) */}
                  <div className="ap-bar-col">
                    <span className="ap-bar-top-val">{workspaceStats.Design}</span>
                    <div className="ap-bar-pillar-wrap">
                      <div
                        className="ap-bar-pillar yellow"
                        style={{ height: `${(workspaceStats.Design / 6) * 100}%` }}
                      />
                    </div>
                    <span className="ap-bar-col-name">Design</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Project Progress Overview (Horizontal Bars) */}
            <div className="ap-chart-card">
              <div className="ap-chart-card-header">
                <h3>Project Progress Overview</h3>
              </div>

              <div className="ap-progress-overview-list">
                {progressOverviewList.map((item, idx) => {
                  const colors = ["#6366f1", "#2563eb", "#10b981", "#94a3b8"];
                  return (
                    <div key={item.id} className="ap-overview-item">
                      <div className="ap-overview-top-line">
                        <span className="ap-overview-name">{item.name}</span>
                        <strong className="ap-overview-pct">{item.progress}%</strong>
                      </div>
                      <div className="ap-overview-meter-track">
                        <div
                          className="ap-overview-meter-fill"
                          style={{
                            width: `${item.progress}%`,
                            backgroundColor: item.color || colors[idx % colors.length],
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* =========================================================
             4. TOOLBAR, SEARCH & FILTER CONTROLS ROW
          ========================================================= */}
          <div className="ap-toolbar-row">
            <div className="ap-search-input-wrap">
              <Search size={15} />
              <input
                type="text"
                placeholder="Search projects by name, owner, or workspace..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button type="button" onClick={() => setSearch("")} aria-label="Clear search">
                  <X size={13} />
                </button>
              )}
            </div>

            <div className="ap-filters-group">
              {/* STATUS FILTER */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                aria-label="Filter status"
              >
                {projectStatuses.map((s) => (
                  <option key={s} value={s}>
                    {s === "All" ? "All Statuses" : s}
                  </option>
                ))}
              </select>

              {/* WORKSPACE FILTER */}
              <select
                value={workspaceFilter}
                onChange={(e) => setWorkspaceFilter(e.target.value)}
                aria-label="Filter workspace"
              >
                {workspaceOptions.map((w) => (
                  <option key={w} value={w}>
                    {w === "All" ? "All Workspaces" : w}
                  </option>
                ))}
              </select>

              {/* MEMBERS FILTER */}
              <select
                value={memberFilter}
                onChange={(e) => setMemberFilter(e.target.value)}
                aria-label="Filter member"
              >
                {teamMembersList.map((m) => (
                  <option key={m} value={m}>
                    {m === "All" ? "All Members" : m}
                  </option>
                ))}
              </select>

              {/* PRIORITIES FILTER */}
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                aria-label="Filter priority"
              >
                {projectPriorities.map((p) => (
                  <option key={p} value={p}>
                    {p === "All" ? "All Priorities" : p}
                  </option>
                ))}
              </select>

              {/* SORT DROPDOWN */}
              <select
                value={sortKey}
                onChange={(e) => setSortKey(e.target.value)}
                aria-label="Sort projects"
              >
                <option value="recentlyUpdated">Recently Updated</option>
                <option value="name-asc">Name (A to Z)</option>
                <option value="name-desc">Name (Z to A)</option>
                <option value="progress-desc">Highest Progress</option>
                <option value="dueDate">Due Date</option>
              </select>

              {/* LAYOUT GRID / LIST TOGGLE ICONS */}
              <div className="ap-layout-icons">
                <button
                  type="button"
                  className={`ap-layout-btn ${viewMode === "kanban" ? "active" : ""}`}
                  onClick={() => setViewMode("kanban")}
                  title="Grid View"
                >
                  <LayoutGrid size={15} />
                </button>
                <button
                  type="button"
                  className={`ap-layout-btn ${viewMode === "list" ? "active" : ""}`}
                  onClick={() => setViewMode("list")}
                  title="List View"
                >
                  <List size={15} />
                </button>
              </div>

              {/* EXPORT DROPDOWN */}
              <div className="ap-export-dropdown-wrap">
                <button
                  type="button"
                  className="ap-btn-export-trigger"
                  onClick={() => setExportOpen((prev) => !prev)}
                  title="Export options"
                >
                  <Download size={14} />
                  <span>Export</span>
                </button>

                {exportOpen && (
                  <div className="ap-export-menu">
                    <button type="button" onClick={handleExportCSV}>Export as CSV (.csv)</button>
                    <button type="button" onClick={handleExportJSON}>Export as JSON (.json)</button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* =========================================================
             5. MAIN VIEW AREA (KANBAN CARDS / LIST TABLE / TIMELINE)
          ========================================================= */}

          {/* KANBAN / CARDS VIEW */}
          {viewMode === "kanban" && (
            <div className="ap-two-col-layout">
              {/* LEFT 75%: PROJECT CARDS GRID */}
              <div className="ap-cards-grid-col">
                {filteredProjects.length === 0 ? (
                  <div className="ap-empty-state-card">
                    <FolderKanban size={36} />
                    <h3>No projects match your filter</h3>
                    <p>Try searching for a different keyword or reset active filters.</p>
                    <button
                      type="button"
                      className="ap-btn-reset-filters"
                      onClick={() => {
                        setSearch("");
                        setStatusFilter("All");
                        setWorkspaceFilter("All");
                        setPriorityFilter("All");
                        setMemberFilter("All");
                      }}
                    >
                      Reset All Filters
                    </button>
                  </div>
                ) : (
                  <div className="ap-projects-cards-grid">
                    {filteredProjects.map((p) => {
                      const completed = p.completedTasks !== undefined ? p.completedTasks : Math.round((p.tasks * p.progress) / 100);
                      const isMenuOpen = activeMenuId === p.id;

                      return (
                        <div key={p.id} className="ap-project-card">
                          {/* CARD HEADER */}
                          <div className="ap-pcard-header">
                            <div
                              className="ap-pcard-icon-chip"
                              style={{
                                backgroundColor: `${p.color || "#6366f1"}15`,
                                color: p.color || "#6366f1",
                              }}
                            >
                              {renderProjectIcon(p.iconType, p.color)}
                            </div>

                            <span className={`ap-pcard-status-badge ${p.status.toLowerCase().replace(/\s+/g, "-")}`}>
                              {p.status}
                            </span>

                            {/* 3-DOTS ACTION MENU */}
                            <div className="ap-pcard-menu-anchor" onClick={(e) => e.stopPropagation()}>
                              <button
                                type="button"
                                className="ap-pcard-menu-btn"
                                onClick={() => setActiveMenuId(isMenuOpen ? null : p.id)}
                                aria-label="Card options"
                              >
                                <MoreVertical size={15} />
                              </button>

                              {isMenuOpen && (
                                <div className="ap-pcard-dropdown">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setActiveMenuId(null);
                                      openEditModal(p);
                                    }}
                                  >
                                    <Pencil size={13} />
                                    <span>Edit Project</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setActiveMenuId(null);
                                      handleDuplicate(p);
                                    }}
                                  >
                                    <Copy size={13} />
                                    <span>Duplicate</span>
                                  </button>
                                  <button
                                    type="button"
                                    className="delete"
                                    onClick={() => {
                                      setActiveMenuId(null);
                                      setProjectToDelete(p);
                                    }}
                                  >
                                    <Trash2 size={13} />
                                    <span>Delete</span>
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* TITLE & DESCRIPTION */}
                          <h4
                            className="ap-pcard-title"
                            onClick={() => openEditModal(p)}
                            title={`Edit ${p.name}`}
                          >
                            {p.name}
                          </h4>
                          <p className="ap-pcard-desc">{p.description}</p>

                          {/* TASKS PROGRESS BAR */}
                          <div className="ap-pcard-tasks-row">
                            <span className="ap-pcard-tasks-count">
                              {completed} / {p.tasks} tasks
                            </span>
                            <span className="ap-pcard-tasks-pct">{p.progress}%</span>
                          </div>
                          <div className="ap-pcard-meter-track">
                            <div
                              className="ap-pcard-meter-fill"
                              style={{
                                width: `${p.progress}%`,
                                backgroundColor: p.color || "#6366f1",
                              }}
                            />
                          </div>

                          {/* FOOTER: AVATARS, DUE DATE, PRIORITY */}
                          <div className="ap-pcard-footer">
                            <div className="ap-avatar-stack">
                              {p.team?.slice(0, 2).map((member, i) => (
                                <span
                                  key={i}
                                  className="ap-avatar-circle"
                                  style={{ backgroundColor: member.color || "#6366f1" }}
                                  title={member.name}
                                >
                                  {member.avatar}
                                </span>
                              ))}
                              {p.extraMembers > 0 && (
                                <span className="ap-avatar-circle ap-avatar-extra">
                                  +{p.extraMembers}
                                </span>
                              )}
                            </div>

                            <div className="ap-pcard-due-date">
                              <Calendar size={13} />
                              <span>{p.dueDate}</span>
                            </div>

                            <span className={`ap-pcard-priority-pill ${p.priority.toLowerCase()}`}>
                              {p.priority}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* RIGHT 25%: SIDEBAR (My Projects + Recent Activity) */}
              <div className="ap-sidebar-col">
                {/* 1. MY PROJECTS CARD */}
                <div className="ap-sidebar-card">
                  <div className="ap-sidebar-card-header">
                    <h4>My Projects</h4>
                    <button
                      type="button"
                      className="ap-view-all-link"
                      onClick={() => {
                        setMemberFilter("Rahul Sharma");
                        showToast("Filtered to projects created by you.");
                      }}
                    >
                      <span>View all</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>

                  <div className="ap-my-projects-list">
                    <div className="ap-my-proj-item">
                      <div className="ap-my-proj-label">
                        <Users size={14} className="ap-icon-muted" />
                        <span>Created by me</span>
                      </div>
                      <strong className="ap-my-proj-count">5</strong>
                    </div>

                    <div className="ap-my-proj-item">
                      <div className="ap-my-proj-label">
                        <UserCheck size={14} className="ap-icon-muted" />
                        <span>Assigned to me</span>
                      </div>
                      <strong className="ap-my-proj-count">8</strong>
                    </div>

                    <div className="ap-my-proj-item">
                      <div className="ap-my-proj-label">
                        <Layers size={14} className="ap-icon-muted" />
                        <span>I'm a member</span>
                      </div>
                      <strong className="ap-my-proj-count">12</strong>
                    </div>
                  </div>
                </div>

                {/* 2. RECENT ACTIVITY CARD */}
                <div className="ap-sidebar-card">
                  <div className="ap-sidebar-card-header">
                    <h4>Recent Activity</h4>
                    <button
                      type="button"
                      className="ap-view-all-link"
                      onClick={() => showToast("Navigating to full activity logs...", "info")}
                    >
                      <span>View all</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>

                  <div className="ap-activity-timeline">
                    {recentActivities.map((act) => (
                      <div key={act.id} className="ap-act-timeline-item">
                        <span className={`ap-act-dot ${act.type}`} />
                        <span className="ap-act-avatar" style={{ backgroundColor: act.color }}>
                          {act.avatar}
                        </span>
                        <div className="ap-act-details">
                          <p>
                            <strong>{act.user}</strong> {act.action}{" "}
                            <span className="ap-act-proj-name">{act.project}</span>
                          </p>
                          <small>{act.time}</small>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* LIST / TABLE VIEW */}
          {viewMode === "list" && (
            <div className="ap-list-card">
              <div className="ap-table-wrap">
                <table className="ap-projects-table">
                  <thead>
                    <tr>
                      <th>PROJECT NAME</th>
                      <th>WORKSPACE</th>
                      <th>STATUS</th>
                      <th>PRIORITY</th>
                      <th>PROGRESS</th>
                      <th>TASKS</th>
                      <th>DUE DATE</th>
                      <th>MEMBERS</th>
                      <th style={{ textAlign: "right" }}>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProjects.map((p) => {
                      const completed = p.completedTasks !== undefined ? p.completedTasks : Math.round((p.tasks * p.progress) / 100);
                      return (
                        <tr key={p.id}>
                          <td>
                            <div className="ap-table-name-cell">
                              <span
                                className="ap-table-icon"
                                style={{
                                  backgroundColor: `${p.color || "#6366f1"}15`,
                                  color: p.color || "#6366f1",
                                }}
                              >
                                {renderProjectIcon(p.iconType, p.color)}
                              </span>
                              <div>
                                <strong
                                  className="ap-table-title"
                                  onClick={() => openEditModal(p)}
                                  title={`Edit ${p.name}`}
                                >
                                  {p.name}
                                </strong>
                                <small>{p.owner}</small>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className="ap-table-workspace-tag">{p.workspace}</span>
                          </td>
                          <td>
                            <span className={`ap-pcard-status-badge ${p.status.toLowerCase().replace(/\s+/g, "-")}`}>
                              {p.status}
                            </span>
                          </td>
                          <td>
                            <span className={`ap-pcard-priority-pill ${p.priority.toLowerCase()}`}>
                              {p.priority}
                            </span>
                          </td>
                          <td>
                            <div className="ap-table-progress-wrap">
                              <div className="ap-pcard-meter-track">
                                <div
                                  className="ap-pcard-meter-fill"
                                  style={{
                                    width: `${p.progress}%`,
                                    backgroundColor: p.color || "#6366f1",
                                  }}
                                />
                              </div>
                              <span>{p.progress}%</span>
                            </div>
                          </td>
                          <td>
                            <span className="ap-table-tasks">{completed}/{p.tasks}</span>
                          </td>
                          <td>
                            <span className="ap-table-due-date">{p.dueDate}</span>
                          </td>
                          <td>
                            <div className="ap-avatar-stack">
                              {p.team?.slice(0, 2).map((m, i) => (
                                <span
                                  key={i}
                                  className="ap-avatar-circle"
                                  style={{ backgroundColor: m.color || "#6366f1" }}
                                >
                                  {m.avatar}
                                </span>
                              ))}
                              {p.extraMembers > 0 && (
                                <span className="ap-avatar-circle ap-avatar-extra">
                                  +{p.extraMembers}
                                </span>
                              )}
                            </div>
                          </td>
                          <td style={{ textAlign: "right" }}>
                            <div className="ap-table-actions">
                              <button
                                type="button"
                                className="action-btn"
                                onClick={() => openEditModal(p)}
                                title="Edit project"
                              >
                                <Pencil size={14} />
                              </button>
                              <button
                                type="button"
                                className="action-btn"
                                onClick={() => handleDuplicate(p)}
                                title="Duplicate"
                              >
                                <Copy size={14} />
                              </button>
                              <button
                                type="button"
                                className="action-btn delete"
                                onClick={() => setProjectToDelete(p)}
                                title="Delete"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TIMELINE / GANTT VIEW */}
          {viewMode === "timeline" && (
            <div className="ap-timeline-card">
              <div className="ap-timeline-header">
                <h3>Project Schedules & Timeline Deliverables</h3>
                <small>Chronological milestone tracking across upcoming sprint quarters.</small>
              </div>

              <div className="ap-timeline-body">
                {filteredProjects.map((p) => {
                  return (
                    <div key={p.id} className="ap-timeline-row">
                      <div className="ap-timeline-proj-info">
                        <strong>{p.name}</strong>
                        <small>{p.workspace} • Due {p.dueDate}</small>
                      </div>
                      <div className="ap-timeline-track">
                        <div
                          className="ap-timeline-bar"
                          style={{
                            width: `${Math.max(25, p.progress)}%`,
                            backgroundColor: p.color || "#6366f1",
                          }}
                        >
                          <span>{p.progress}% Complete</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* RESET DEMO DATA BAR */}
          <div className="ap-reset-bar">
            <span>
              Showing <strong>{filteredProjects.length}</strong> of <strong>{projects.length}</strong> total projects
            </span>
            <button
              type="button"
              className="ap-btn-reset-demo"
              onClick={() => setShowResetConfirm(true)}
            >
              <RotateCcw size={13} />
              <span>Reset Demo Data</span>
            </button>
          </div>
        </main>
      </div>

      {/* =========================================================
         MODALS: CREATE / EDIT / VIEW / DELETE CONFIRMATION
      ========================================================= */}

      {/* CREATE & EDIT MODAL */}
      {showCreateModal && (
        <div
          className="ap-modal-backdrop"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setShowCreateModal(false);
          }}
        >
          <div className="ap-modal-box">
            <div className="ap-modal-header">
              <div className="ap-modal-header-left">
                <div
                  className="ap-modal-icon-badge"
                  style={{
                    backgroundColor: `${form.color || "#6366f1"}15`,
                    color: form.color || "#6366f1",
                  }}
                >
                  <Folder size={18} />
                </div>
                <div>
                  <div className="ap-modal-title-row">
                    <h2>{editingProject ? "Edit Project" : "Create New Project"}</h2>
                    {editingProject && (
                      <span className={`ap-pcard-status-badge ${form.status.toLowerCase().replace(/\s+/g, "-")}`}>
                        {form.status}
                      </span>
                    )}
                  </div>
                  <p>
                    {editingProject
                      ? "Update project settings, workspace allocation, priority and deadlines."
                      : "Organize sprints, assign workspace ownership, and track progress."}
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="ap-modal-close"
                onClick={() => setShowCreateModal(false)}
                title="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="ap-modal-form">
              {/* PROJECT TITLE */}
              <div className="ap-form-group">
                <label htmlFor="ap-proj-name">
                  Project Title <span className="ap-required">*</span>
                </label>
                <input
                  id="ap-proj-name"
                  type="text"
                  required
                  placeholder="e.g. Website Redesign"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              {/* WORKSPACE & OWNER */}
              <div className="ap-form-grid-2">
                <div className="ap-form-group">
                  <label htmlFor="ap-proj-workspace">Workspace</label>
                  <div className="ap-select-wrap">
                    <select
                      id="ap-proj-workspace"
                      value={form.workspace}
                      onChange={(e) => setForm({ ...form, workspace: e.target.value })}
                    >
                      {workspaceOptions
                        .filter((w) => w !== "All")
                        .map((w) => (
                          <option key={w} value={w}>
                            {w}
                          </option>
                        ))}
                    </select>
                    <ChevronDown size={14} className="ap-select-chevron" />
                  </div>
                </div>

                <div className="ap-form-group">
                  <label htmlFor="ap-proj-owner">Project Owner</label>
                  <div className="ap-select-wrap">
                    <select
                      id="ap-proj-owner"
                      value={form.owner}
                      onChange={(e) => setForm({ ...form, owner: e.target.value })}
                    >
                      {teamMembersList
                        .filter((m) => m !== "All")
                        .map((m) => (
                          <option key={m} value={m}>
                            {m}
                          </option>
                        ))}
                    </select>
                    <ChevronDown size={14} className="ap-select-chevron" />
                  </div>
                </div>
              </div>

              {/* STATUS & PRIORITY */}
              <div className="ap-form-grid-2">
                <div className="ap-form-group">
                  <label htmlFor="ap-proj-status">Status</label>
                  <div className="ap-select-wrap">
                    <select
                      id="ap-proj-status"
                      value={form.status}
                      onChange={(e) => setForm({ ...form, status: e.target.value })}
                    >
                      <option value="Active">Active</option>
                      <option value="Completed">Completed</option>
                      <option value="On Hold">On Hold</option>
                      <option value="Overdue">Overdue</option>
                    </select>
                    <ChevronDown size={14} className="ap-select-chevron" />
                  </div>
                </div>

                <div className="ap-form-group">
                  <label htmlFor="ap-proj-priority">Priority</label>
                  <div className="ap-select-wrap">
                    <select
                      id="ap-proj-priority"
                      value={form.priority}
                      onChange={(e) => setForm({ ...form, priority: e.target.value })}
                    >
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                      <option value="Critical">Critical</option>
                    </select>
                    <ChevronDown size={14} className="ap-select-chevron" />
                  </div>
                </div>
              </div>

              {/* TASKS & SCHEDULE */}
              <div className="ap-form-grid-3">
                <div className="ap-form-group">
                  <label htmlFor="ap-proj-tasks">Total Tasks</label>
                  <input
                    id="ap-proj-tasks"
                    type="number"
                    min="1"
                    value={form.tasks}
                    onChange={(e) =>
                      setForm({ ...form, tasks: Math.max(1, parseInt(e.target.value) || 1) })
                    }
                  />
                </div>

                <div className="ap-form-group">
                  <label htmlFor="ap-proj-completed">Completed</label>
                  <input
                    id="ap-proj-completed"
                    type="number"
                    min="0"
                    value={form.completedTasks}
                    onChange={(e) =>
                      setForm({ ...form, completedTasks: Math.max(0, parseInt(e.target.value) || 0) })
                    }
                  />
                </div>

                <div className="ap-form-group">
                  <label htmlFor="ap-proj-due">Due Date</label>
                  <input
                    id="ap-proj-due"
                    type="date"
                    value={form.dueDate}
                    onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                  />
                </div>
              </div>

              {/* LIVE PROGRESS FEEDBACK */}
              <div className="ap-modal-progress-preview">
                <div className="ap-modal-prog-header">
                  <span>Milestone Completion</span>
                  <strong>
                    {form.tasks > 0
                      ? Math.min(100, Math.round((Number(form.completedTasks) / Number(form.tasks)) * 100))
                      : 0}
                    %
                  </strong>
                </div>
                <div className="ap-pcard-meter-track">
                  <div
                    className="ap-pcard-meter-fill"
                    style={{
                      width: `${
                        form.tasks > 0
                          ? Math.min(100, Math.round((Number(form.completedTasks) / Number(form.tasks)) * 100))
                          : 0
                      }%`,
                      backgroundColor: form.color || "#6366f1",
                    }}
                  />
                </div>
                <span className="ap-modal-prog-sub">
                  {form.completedTasks || 0} of {form.tasks || 0} tasks completed
                </span>
              </div>

              {/* DESCRIPTION */}
              <div className="ap-form-group">
                <label htmlFor="ap-proj-desc">Description</label>
                <textarea
                  id="ap-proj-desc"
                  rows={3}
                  placeholder="Summarize project milestones, goals, and sprint objectives..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>

              {/* COLOR ACCENT PICKER */}
              <div className="ap-form-group">
                <label>Project Color Accent</label>
                <div className="ap-color-picker-row">
                  {[
                    { color: "#6366f1", label: "Indigo" },
                    { color: "#3b82f6", label: "Blue" },
                    { color: "#10b981", label: "Emerald" },
                    { color: "#f59e0b", label: "Amber" },
                    { color: "#ef4444", label: "Red" },
                    { color: "#8b5cf6", label: "Purple" },
                    { color: "#06b6d4", label: "Cyan" },
                  ].map((c) => (
                    <button
                      key={c.color}
                      type="button"
                      className={`ap-color-chip ${form.color === c.color ? "active" : ""}`}
                      style={{ backgroundColor: c.color }}
                      onClick={() => setForm({ ...form, color: c.color })}
                      title={c.label}
                    >
                      {form.color === c.color && <Check size={12} color="#ffffff" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* MODAL FOOTER */}
              <div className="ap-modal-footer">
                <button
                  type="button"
                  className="ap-btn-cancel"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="ap-btn-submit">
                  <Check size={15} />
                  <span>{editingProject ? "Save Changes" : "Create Project"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {projectToDelete && (
        <div
          className="ap-modal-backdrop"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setProjectToDelete(null);
          }}
        >
          <div className="ap-modal-box ap-modal-sm">
            <div className="ap-delete-icon-circle">
              <Trash2 size={24} />
            </div>
            <h3>Delete Project "{projectToDelete.name}"?</h3>
            <p>
              Are you sure you want to delete this project? All associated tasks, milestones, and member assignments will be permanently removed.
            </p>
            <div className="ap-modal-footer">
              <button
                type="button"
                className="ap-btn-cancel"
                onClick={() => setProjectToDelete(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="ap-btn-danger"
                onClick={confirmDeleteProject}
              >
                Delete Project
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RESET DEMO DATA CONFIRMATION */}
      {showResetConfirm && (
        <div
          className="ap-modal-backdrop"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setShowResetConfirm(false);
          }}
        >
          <div className="ap-modal-box ap-modal-sm">
            <div className="ap-delete-icon-circle warning">
              <RotateCcw size={24} />
            </div>
            <h3>Restore Default Projects?</h3>
            <p>
              This will reset the projects directory back to the 12 standard demo projects matching your dashboard. Any newly created projects will be overwritten.
            </p>
            <div className="ap-modal-footer">
              <button
                type="button"
                className="ap-btn-cancel"
                onClick={() => setShowResetConfirm(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="ap-btn-submit"
                onClick={handleResetDemoData}
              >
                Reset Demo Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
