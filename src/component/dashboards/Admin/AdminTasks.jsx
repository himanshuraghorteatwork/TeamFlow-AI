import React, { useEffect, useMemo, useState } from "react";
import {
  ListChecks,
  Search,
  Plus,
  Filter,
  Download,
  RotateCcw,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FolderKanban,
  CalendarDays,
  User,
  Pencil,
  Trash2,
  ChevronDown,
  X,
  Kanban,
  List,
  Grid2X2,
  Eye,
  Check,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronRight,
  Sparkles,
  Tag,
  Building2,
  Folder,
  TrendingUp,
  SlidersHorizontal,
} from "lucide-react";

import AdminSidebar from "./AdminSidebar.jsx";
import AdminTopbar from "./AdminTopbar.jsx";
import { initialAdminTasks } from "./adminTasksData.js";
import "./AdminTasks.css";

const STORAGE_KEY = "teamflow_admin_tasks";

const STATUS_OPTIONS = ["To Do", "In Progress", "Review", "Completed"];
const PRIORITY_OPTIONS = ["Low", "Medium", "High", "Critical"];
const PROJECT_OPTIONS = [
  "TeamFlow Website",
  "Mobile App",
  "AI Integration",
  "Marketing Portal",
  "Design System 2.0",
  "Cloud Telemetry",
  "Security Audit SOC-2",
  "Billing Subscriptions API",
];

const loadTasks = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error("Failed to load tasks from localStorage:", e);
  }
  return initialAdminTasks;
};

const ASSIGNEE_COLORS = [
  "#4f46e5",
  "#2563eb",
  "#0284c7",
  "#7c3aed",
  "#059669",
  "#d97706",
  "#db2777",
  "#6366f1",
];

const getAssigneeColor = (name) => {
  if (!name) return "#4f46e5";
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return ASSIGNEE_COLORS[Math.abs(hash) % ASSIGNEE_COLORS.length];
};

export default function AdminTasks() {
  const [tasks, setTasks] = useState(loadTasks);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Filters & View State
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [projectFilter, setProjectFilter] = useState("All");
  const [viewMode, setViewMode] = useState("table"); // 'table' | 'kanban' | 'cards'
  const [sortKey, setSortKey] = useState("dueDate");
  const [sortOrder, setSortOrder] = useState("asc");

  // Page Format (Pagination)
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(8);

  // Modals
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [viewingTask, setViewingTask] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [toast, setToast] = useState(null);

  // Form State
  const [form, setForm] = useState({
    title: "",
    project: "TeamFlow Website",
    workspace: "TeamFlow Workspace",
    assignee: "Amit Sharma",
    assigneeEmail: "amit@abctech.com",
    priority: "High",
    status: "To Do",
    dueDate: new Date().toISOString().split("T")[0],
    description: "",
  });

  // Sync with LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (e) {
      console.error(e);
    }
  }, [tasks]);

  // Toast auto-dismiss
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  // Sort toggle handler
  const handleSort = (key) => {
    if (sortKey === key) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const renderSortIcon = (key) => {
    if (sortKey !== key) {
      return <ArrowUpDown size={13} className="admin-sort-icon muted" />;
    }
    return sortOrder === "asc" ? (
      <ArrowUp size={13} className="admin-sort-icon active" />
    ) : (
      <ArrowDown size={13} className="admin-sort-icon active" />
    );
  };

  // Filtered & Sorted Tasks
  const filteredTasks = useMemo(() => {
    const list = tasks.filter((t) => {
      const term = search.trim().toLowerCase();
      const matchesSearch =
        !term ||
        t.title?.toLowerCase().includes(term) ||
        t.id?.toLowerCase().includes(term) ||
        t.assignee?.toLowerCase().includes(term) ||
        t.project?.toLowerCase().includes(term);

      const matchesStatus = statusFilter === "All" || t.status === statusFilter;
      const matchesPriority = priorityFilter === "All" || t.priority === priorityFilter;
      const matchesProject = projectFilter === "All" || t.project === projectFilter;

      return matchesSearch && matchesStatus && matchesPriority && matchesProject;
    });

    return [...list].sort((a, b) => {
      let valA = a[sortKey];
      let valB = b[sortKey];

      if (valA === undefined || valA === null) valA = "";
      if (valB === undefined || valB === null) valB = "";

      if (typeof valA === "number" && typeof valB === "number") {
        return sortOrder === "asc" ? valA - valB : valB - valA;
      }

      valA = String(valA).toLowerCase();
      valB = String(valB).toLowerCase();

      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [tasks, search, statusFilter, priorityFilter, projectFilter, sortKey, sortOrder]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, priorityFilter, projectFilter, sortKey, sortOrder]);

  // Paginated Slicing
  const totalPages = Math.max(1, Math.ceil(filteredTasks.length / perPage));
  const paginatedTasks = useMemo(() => {
    const start = (currentPage - 1) * perPage;
    return filteredTasks.slice(start, start + perPage);
  }, [filteredTasks, currentPage, perPage]);

  // Dynamic Statistics
  const stats = useMemo(() => {
    const total = tasks.length;
    const inProgress = tasks.filter((t) => t.status === "In Progress" || t.status === "Review").length;
    const completed = tasks.filter((t) => t.status === "Completed" || t.completed).length;
    const overdue = tasks.filter((t) => {
      if (t.status === "Completed" || t.completed) return false;
      if (!t.dueDate) return false;
      return new Date(t.dueDate) < new Date(new Date().setHours(0, 0, 0, 0));
    }).length;
    return { total, inProgress, completed, overdue };
  }, [tasks]);

  // Toggle complete
  const toggleTaskComplete = (taskId) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const nextCompleted = !(t.completed || t.status === "Completed");
          return {
            ...t,
            completed: nextCompleted,
            status: nextCompleted ? "Completed" : "In Progress",
          };
        }
        return t;
      })
    );
  };

  // Move to next status in Kanban
  const advanceTaskStatus = (taskId) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const currentIndex = STATUS_OPTIONS.indexOf(t.status || "To Do");
          const nextIndex = (currentIndex + 1) % STATUS_OPTIONS.length;
          const nextStatus = STATUS_OPTIONS[nextIndex];
          return {
            ...t,
            status: nextStatus,
            completed: nextStatus === "Completed",
          };
        }
        return t;
      })
    );
  };

  // Open Create Modal
  const openCreateModal = () => {
    setEditingTask(null);
    setForm({
      title: "",
      project: "TeamFlow Website",
      workspace: "TeamFlow Workspace",
      assignee: "Amit Sharma",
      assigneeEmail: "amit@abctech.com",
      priority: "High",
      status: "To Do",
      dueDate: new Date().toISOString().split("T")[0],
      description: "",
    });
    setShowModal(true);
  };

  // Open Edit Modal
  const openEditModal = (task) => {
    setEditingTask(task);
    setForm({
      title: task.title || "",
      project: task.project || "TeamFlow Website",
      workspace: task.workspace || "TeamFlow Workspace",
      assignee: task.assignee || "Amit Sharma",
      assigneeEmail: task.assigneeEmail || "amit@abctech.com",
      priority: task.priority || "Medium",
      status: task.status || "To Do",
      dueDate: task.dueDate || new Date().toISOString().split("T")[0],
      description: task.description || "",
    });
    setShowModal(true);
  };

  // Form submit (create or update)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      showToast("Task title is required.", "error");
      return;
    }

    if (editingTask) {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === editingTask.id
            ? {
                ...t,
                ...form,
                completed: form.status === "Completed",
              }
            : t
        )
      );
      showToast(`Task "${form.title}" updated successfully!`);
    } else {
      const newTask = {
        id: `TSK-${Math.floor(1000 + Math.random() * 9000)}`,
        ...form,
        createdAt: new Date().toISOString().split("T")[0],
        completed: form.status === "Completed",
      };
      setTasks((prev) => [newTask, ...prev]);
      showToast(`Task "${newTask.title}" created successfully!`);
    }

    setShowModal(false);
  };

  // Trigger Delete Modal
  const promptDeleteTask = (task) => {
    setTaskToDelete(task);
  };

  // Confirm Delete Action
  const confirmDeleteTask = () => {
    if (!taskToDelete) return;
    setTasks((prev) => prev.filter((t) => t.id !== taskToDelete.id));
    showToast(`Task "${taskToDelete.title}" deleted successfully.`, "success");
    if (viewingTask?.id === taskToDelete.id) setViewingTask(null);
    setTaskToDelete(null);
  };

  // Trigger Reset Modal
  const promptResetDemo = () => {
    setShowResetConfirm(true);
  };

  // Confirm Reset Demo Action
  const confirmResetDemo = () => {
    setTasks(initialAdminTasks);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialAdminTasks));
    } catch (e) {}
    showToast("Tasks restored to demo state.", "success");
    setShowResetConfirm(false);
  };

  // Export CSV
  const exportTasks = () => {
    const headers = ["ID", "Title", "Project", "Workspace", "Assignee", "Priority", "Status", "Due Date"];
    const rows = filteredTasks.map((t) => [
      t.id,
      `"${(t.title || "").replace(/"/g, '""')}"`,
      `"${(t.project || "").replace(/"/g, '""')}"`,
      `"${(t.workspace || "").replace(/"/g, '""')}"`,
      `"${(t.assignee || "").replace(/"/g, '""')}"`,
      t.priority || "Medium",
      t.status || "To Do",
      t.dueDate || "-",
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `teamflow_tasks_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Tasks exported to CSV successfully!");
  };

  return (
    <div className="admin-tasks-app">
      <AdminSidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <main className="admin-tasks-main">
        <AdminTopbar onMobileMenuToggle={() => setMobileOpen(true)} />

        <div className="admin-tasks-content">
          {/* TOAST MESSAGE */}
          {toast && (
            <div className={`admin-tasks-toast ${toast.type || "success"}`}>
              <CheckCircle2 size={16} />
              <span>{toast.message}</span>
            </div>
          )}

          {/* PAGE HEADER */}
          <section className="admin-tasks-header">
            <div className="admin-tasks-header-left">
              <div className="admin-tasks-header-icon">
                <ListChecks size={24} />
              </div>
              <div>
                <div className="admin-tasks-title-row">
                  <h1>Task Management</h1>
                  <span className="admin-tasks-badge-total">{tasks.length} tasks</span>
                </div>
                <p>Track deliverables, sprint milestones, team assignments, and task completion across all workspaces.</p>
              </div>
            </div>

            <div className="admin-tasks-header-right">
              {/* VIEW SWITCHER */}
              <div className="admin-tasks-view-selector">
                <button
                  type="button"
                  className={`admin-tasks-view-btn ${viewMode === "table" ? "active" : ""}`}
                  onClick={() => setViewMode("table")}
                  title="Table View"
                >
                  <List size={14} />
                  <span>Table</span>
                </button>
                <button
                  type="button"
                  className={`admin-tasks-view-btn ${viewMode === "kanban" ? "active" : ""}`}
                  onClick={() => setViewMode("kanban")}
                  title="Kanban Board"
                >
                  <Kanban size={14} />
                  <span>Kanban</span>
                </button>
                <button
                  type="button"
                  className={`admin-tasks-view-btn ${viewMode === "cards" ? "active" : ""}`}
                  onClick={() => setViewMode("cards")}
                  title="Card Grid"
                >
                  <Grid2X2 size={14} />
                  <span>Cards</span>
                </button>
              </div>

              <button type="button" className="tasks-btn-secondary" onClick={exportTasks} title="Export Tasks CSV">
                <Download size={14} />
                <span>Export CSV</span>
              </button>
              <button type="button" className="tasks-btn-secondary" onClick={promptResetDemo} title="Restore Sample Tasks">
                <RotateCcw size={14} />
                <span>Reset Demo</span>
              </button>
              <button type="button" className="tasks-btn-primary" onClick={openCreateModal}>
                <Plus size={15} />
                <span>Create Task</span>
              </button>
            </div>
          </section>

          {/* KPI STAT CARDS GRID */}
          <section className="admin-tasks-stats-grid">
            {/* 1. TOTAL TASKS */}
            <div className="stat-card">
              <div className="stat-card-left">
                <div className="stat-icon-wrap icon-purple">
                  <ListChecks size={20} />
                </div>
                <div className="stat-meta">
                  <div className="val-row">
                    <strong>{stats.total}</strong>
                    <span className="trend-badge trend-up">
                      <TrendingUp size={11} /> +12%
                    </span>
                  </div>
                  <span className="stat-label">Total Tasks</span>
                </div>
              </div>
              <div className="stat-sparkline">
                <svg width="68" height="32" viewBox="0 0 68 32">
                  <path
                    d="M2 24 C14 24, 18 12, 30 15 C42 18, 48 4, 66 8"
                    fill="none"
                    stroke="#6366f1"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>

            {/* 2. IN PROGRESS */}
            <div className="stat-card">
              <div className="stat-card-left">
                <div className="stat-icon-wrap icon-blue">
                  <Clock size={20} />
                </div>
                <div className="stat-meta">
                  <div className="val-row">
                    <strong>{stats.inProgress}</strong>
                    <span className="trend-badge trend-up">
                      <TrendingUp size={11} /> +8%
                    </span>
                  </div>
                  <span className="stat-label">In Progress</span>
                </div>
              </div>
              <div className="stat-sparkline">
                <svg width="68" height="32" viewBox="0 0 68 32">
                  <path
                    d="M2 22 C14 22, 22 10, 36 14 C48 18, 54 6, 66 4"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>

            {/* 3. COMPLETED */}
            <div className="stat-card">
              <div className="stat-card-left">
                <div className="stat-icon-wrap icon-green">
                  <CheckCircle2 size={20} />
                </div>
                <div className="stat-meta">
                  <div className="val-row">
                    <strong>{stats.completed}</strong>
                    <span className="trend-badge trend-up">
                      <TrendingUp size={11} /> {Math.round((stats.completed / (stats.total || 1)) * 100)}%
                    </span>
                  </div>
                  <span className="stat-label">Completed</span>
                </div>
              </div>
              <div className="stat-sparkline">
                <svg width="68" height="32" viewBox="0 0 68 32">
                  <path
                    d="M2 26 C16 26, 24 16, 38 12 C50 8, 56 6, 66 2"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>

            {/* 4. OVERDUE */}
            <div className="stat-card">
              <div className="stat-card-left">
                <div className="stat-icon-wrap icon-red">
                  <AlertTriangle size={20} />
                </div>
                <div className="stat-meta">
                  <div className="val-row">
                    <strong className="text-red">{stats.overdue}</strong>
                    <span className="trend-badge trend-warn">
                      {stats.overdue > 0 ? "Attention" : "All Clear"}
                    </span>
                  </div>
                  <span className="stat-label">Overdue</span>
                </div>
              </div>
              <div className="stat-sparkline">
                <svg width="68" height="32" viewBox="0 0 68 32">
                  <path
                    d="M2 12 C16 16, 26 22, 40 18 C52 14, 58 24, 66 28"
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
          </section>

          {/* FILTER & SEARCH TOOLBAR */}
          <section className="admin-tasks-filter-bar">
            <div className="search-input-wrap">
              <Search size={16} />
              <input
                type="text"
                placeholder="Search tasks by title, code, assignee, or project..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button type="button" className="clear-search-btn" onClick={() => setSearch("")}>
                  <X size={14} />
                </button>
              )}
            </div>

            <div className="filter-dropdowns-group">
              <div className="custom-select-wrap">
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                  <option value="All">All Statuses</option>
                  {STATUS_OPTIONS.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
                <ChevronDown size={14} className="select-chevron" />
              </div>

              <div className="custom-select-wrap">
                <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
                  <option value="All">All Priorities</option>
                  {PRIORITY_OPTIONS.map((pr) => (
                    <option key={pr} value={pr}>
                      {pr}
                    </option>
                  ))}
                </select>
                <ChevronDown size={14} className="select-chevron" />
              </div>

              <div className="custom-select-wrap">
                <select value={projectFilter} onChange={(e) => setProjectFilter(e.target.value)}>
                  <option value="All">All Projects</option>
                  {PROJECT_OPTIONS.map((pj) => (
                    <option key={pj} value={pj}>
                      {pj}
                    </option>
                  ))}
                </select>
                <ChevronDown size={14} className="select-chevron" />
              </div>

              {(search || statusFilter !== "All" || priorityFilter !== "All" || projectFilter !== "All") && (
                <button
                  type="button"
                  className="clear-all-filters-btn"
                  onClick={() => {
                    setSearch("");
                    setStatusFilter("All");
                    setPriorityFilter("All");
                    setProjectFilter("All");
                  }}
                >
                  <RotateCcw size={12} />
                  <span>Reset Filters</span>
                </button>
              )}
            </div>
          </section>

          {/* META HEADER */}
          <div className="admin-tasks-meta-header">
            <span>
              Showing {filteredTasks.length === 0 ? 0 : (currentPage - 1) * perPage + 1} -{" "}
              {Math.min(currentPage * perPage, filteredTasks.length)} of {filteredTasks.length} tasks
            </span>
            {(search || statusFilter !== "All" || priorityFilter !== "All" || projectFilter !== "All") && (
              <button
                type="button"
                className="clear-all-filters-btn"
                onClick={() => {
                  setSearch("");
                  setStatusFilter("All");
                  setPriorityFilter("All");
                  setProjectFilter("All");
                }}
              >
                Clear Filters
              </button>
            )}
          </div>

          {/* 1. TABLE VIEW */}
          {viewMode === "table" && (
            <div className="admin-tasks-table-wrapper">
              <table className="admin-tasks-table">
                <thead>
                  <tr>
                    <th style={{ width: 44, textAlign: "center" }}>Done</th>
                    <th style={{ width: 50, textAlign: "center" }}>#</th>
                    <th className="sortable-th" onClick={() => handleSort("title")}>
                      <div className="th-content">
                        <span>Task</span>
                        {renderSortIcon("title")}
                      </div>
                    </th>
                    <th className="sortable-th" onClick={() => handleSort("project")}>
                      <div className="th-content">
                        <span>Project</span>
                        {renderSortIcon("project")}
                      </div>
                    </th>
                    <th className="sortable-th" onClick={() => handleSort("assignee")}>
                      <div className="th-content">
                        <span>Assignee</span>
                        {renderSortIcon("assignee")}
                      </div>
                    </th>
                    <th className="sortable-th" onClick={() => handleSort("priority")}>
                      <div className="th-content">
                        <span>Priority</span>
                        {renderSortIcon("priority")}
                      </div>
                    </th>
                    <th className="sortable-th" onClick={() => handleSort("status")}>
                      <div className="th-content">
                        <span>Status</span>
                        {renderSortIcon("status")}
                      </div>
                    </th>
                    <th className="sortable-th" onClick={() => handleSort("dueDate")}>
                      <div className="th-content">
                        <span>Due Date</span>
                        {renderSortIcon("dueDate")}
                      </div>
                    </th>
                    <th style={{ textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedTasks.map((t, idx) => {
                    const isDone = Boolean(t.completed || t.status === "Completed");

                    return (
                      <tr key={t.id} className={isDone ? "row-done" : ""}>
                        <td style={{ textAlign: "center" }}>
                          <button
                            type="button"
                            className={`task-check-circle ${isDone ? "checked" : ""}`}
                            onClick={() => toggleTaskComplete(t.id)}
                            title={isDone ? "Mark Incomplete" : "Mark Complete"}
                          >
                            {isDone && <Check size={12} />}
                          </button>
                        </td>
                        <td style={{ textAlign: "center" }}>
                          <span className="task-row-num">{(currentPage - 1) * perPage + idx + 1}</span>
                        </td>
                        <td>
                          <div className="task-title-cell">
                            <span className="task-code-badge">{t.id}</span>
                            <span className="task-title-text" onClick={() => openEditModal(t)} title={`Edit ${t.title}`}>
                              {t.title}
                            </span>
                          </div>
                        </td>
                        <td>
                          <span className="task-project-chip">
                            <Folder size={12} />
                            <span>{t.project}</span>
                          </span>
                        </td>
                        <td>
                          <div className="task-assignee-cell">
                            <span
                              className="task-avatar"
                              style={{ backgroundColor: getAssigneeColor(t.assignee) }}
                            >
                              {(t.assignee || "A").charAt(0).toUpperCase()}
                            </span>
                            <span>{t.assignee || "Unassigned"}</span>
                          </div>
                        </td>
                        <td>
                          <span className={`priority-pill priority-${(t.priority || "Medium").toLowerCase()}`}>
                            {t.priority}
                          </span>
                        </td>
                        <td>
                          <span className={`status-pill status-${(t.status || "To Do").toLowerCase().replace(/\s+/g, "-")}`}>
                            {t.status}
                          </span>
                        </td>
                        <td>
                          <div className="task-due-cell">
                            <CalendarDays size={13} />
                            <span>{t.dueDate || "-"}</span>
                          </div>
                        </td>
                        <td style={{ textAlign: "right" }}>
                          <div className="table-actions">
                            <button type="button" className="action-btn" title="Edit task" onClick={() => openEditModal(t)}>
                              <Pencil size={15} />
                            </button>
                            <button
                              type="button"
                              className="action-btn delete"
                              title="Delete task"
                              onClick={() => promptDeleteTask(t)}
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* 2. KANBAN BOARD VIEW */}
          {viewMode === "kanban" && (
            <div className="admin-tasks-kanban-board">
              {STATUS_OPTIONS.map((colStatus) => {
                const colTasks = filteredTasks.filter((t) => (t.status || "To Do") === colStatus);

                return (
                  <div key={colStatus} className="kanban-col">
                    <div className="kanban-col-header">
                      <div className="kanban-col-title">
                        <span className={`kanban-status-dot dot-${colStatus.toLowerCase().replace(/\s+/g, "-")}`} />
                        <h3>{colStatus}</h3>
                      </div>
                      <span className="kanban-count-pill">{colTasks.length}</span>
                    </div>

                    <div className="kanban-cards-stack">
                      {colTasks.map((task) => (
                        <div key={task.id} className="kanban-card">
                          <div className="kanban-card-top">
                            <span className="task-code-badge">{task.id}</span>
                            <span className={`priority-pill-sm priority-${(task.priority || "Medium").toLowerCase()}`}>
                              {task.priority}
                            </span>
                          </div>

                          <h4 onClick={() => openEditModal(task)} title={`Edit ${task.title}`}>{task.title}</h4>

                          <div className="kanban-project-tag">
                            <Folder size={11} />
                            <span>{task.project}</span>
                          </div>

                          <div className="kanban-card-footer">
                            <div className="kanban-user">
                              <span
                                className="kanban-avatar"
                                style={{ backgroundColor: getAssigneeColor(task.assignee) }}
                              >
                                {(task.assignee || "A").charAt(0).toUpperCase()}
                              </span>
                              <span>{task.assignee}</span>
                            </div>
                            <div className="kanban-card-actions-wrap">
                              <button
                                type="button"
                                className="action-btn-sm"
                                onClick={() => openEditModal(task)}
                                title="Edit task"
                              >
                                <Pencil size={12} />
                              </button>
                              <button
                                type="button"
                                className="kanban-advance-btn"
                                onClick={() => advanceTaskStatus(task.id)}
                                title="Move to next status"
                              >
                                <ChevronRight size={13} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}

                      {colTasks.length === 0 && (
                        <div className="kanban-empty-col">No {colStatus} tasks</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* 3. CARD GRID VIEW */}
          {viewMode === "cards" && (
            <div className="admin-tasks-cards-grid">
              {paginatedTasks.map((task) => {
                const isDone = Boolean(task.completed || task.status === "Completed");

                return (
                  <div key={task.id} className={`admin-task-card ${isDone ? "card-completed" : ""}`}>
                    {/* CARD TOP */}
                    <div className="task-card-header">
                      <div className="task-card-badges">
                        <span className="task-code-badge">{task.id}</span>
                        <span className={`status-pill status-${(task.status || "To Do").toLowerCase().replace(/\s+/g, "-")}`}>
                          {task.status}
                        </span>
                      </div>
                      <span className={`priority-pill priority-${(task.priority || "Medium").toLowerCase()}`}>
                        {task.priority}
                      </span>
                    </div>

                    {/* CARD MAIN */}
                    <div className="task-card-main">
                      <h3 onClick={() => openEditModal(task)} title={`Edit ${task.title}`}>
                        {task.title}
                      </h3>
                      <div className="task-card-project-pill">
                        <Folder size={12} />
                        <span>{task.project}</span>
                      </div>
                      {task.description && (
                        <p className="task-card-desc">{task.description}</p>
                      )}
                    </div>

                    {/* CARD FOOTER */}
                    <div className="task-card-footer">
                      <div className="task-card-assignee">
                        <span
                          className="task-avatar"
                          style={{ backgroundColor: getAssigneeColor(task.assignee) }}
                        >
                          {(task.assignee || "A").charAt(0).toUpperCase()}
                        </span>
                        <div className="task-assignee-text">
                          <strong>{task.assignee}</strong>
                          <small>{task.dueDate ? `Due ${task.dueDate}` : "No due date"}</small>
                        </div>
                      </div>

                      <div className="task-card-actions">
                        <button
                          type="button"
                          className={`task-complete-btn ${isDone ? "done" : ""}`}
                          onClick={() => toggleTaskComplete(task.id)}
                          title={isDone ? "Mark incomplete" : "Mark completed"}
                        >
                          <Check size={13} />
                        </button>
                        <button
                          type="button"
                          className="action-btn"
                          title="Edit task"
                          onClick={() => openEditModal(task)}
                        >
                          <Pencil size={13} />
                        </button>
                        <button
                          type="button"
                          className="action-btn delete"
                          title="Delete task"
                          onClick={() => promptDeleteTask(task)}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* EMPTY STATE */}
          {filteredTasks.length === 0 && (
            <div className="admin-tasks-empty">
              <ListChecks size={48} />
              <h3>No tasks match your criteria</h3>
              <p>Try modifying your search term, project selection, or status filters.</p>
              <button
                type="button"
                className="tasks-btn-primary mt-3"
                onClick={() => {
                  setSearch("");
                  setStatusFilter("All");
                  setPriorityFilter("All");
                  setProjectFilter("All");
                }}
              >
                Reset All Filters
              </button>
            </div>
          )}

          {/* PAGINATION FOOTER */}
          {filteredTasks.length > 0 && viewMode !== "kanban" && (
            <div className="admin-tasks-pagination">
              <div className="pagination-info">
                <span>Page {currentPage} of {totalPages}</span>
                <select
                  value={perPage}
                  onChange={(e) => {
                    setPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="per-page-select"
                >
                  <option value={6}>6 per page</option>
                  <option value={8}>8 per page</option>
                  <option value={12}>12 per page</option>
                  <option value={24}>24 per page</option>
                </select>
              </div>

              <div className="pagination-buttons">
                <button
                  type="button"
                  className="page-nav-btn"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage <= 1}
                >
                  Previous
                </button>
                <div className="page-numbers">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                    <button
                      key={num}
                      type="button"
                      className={`page-num-btn ${currentPage === num ? "active" : ""}`}
                      onClick={() => setCurrentPage(num)}
                    >
                      {num}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  className="page-nav-btn"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage >= totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* CREATE / EDIT TASK MODAL */}
      {showModal && (
        <div className="modal-overlay" onMouseDown={(e) => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal-box">
            <div className="modal-header">
              <div className="modal-header-left">
                <div className="modal-icon-badge">
                  <ListChecks size={18} />
                </div>
                <div>
                  <div className="modal-title-row">
                    <h2>{editingTask ? "Edit Task" : "Create New Task"}</h2>
                    {editingTask && (
                      <span className={`status-pill status-${(form.status || "To Do").toLowerCase().replace(/\s+/g, "-")}`}>
                        {form.status}
                      </span>
                    )}
                  </div>
                  <p>Organize deliverables, sprint milestones, priority and assignment.</p>
                </div>
              </div>
              <button type="button" className="modal-close" onClick={() => setShowModal(false)} title="Close">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label>Task Title <span className="req">*</span></label>
                <input
                  type="text"
                  placeholder="e.g. Implement OAuth 2.0 authentication flow"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Project</label>
                  <div className="custom-select-wrap">
                    <select
                      value={form.project}
                      onChange={(e) => setForm({ ...form, project: e.target.value })}
                    >
                      {PROJECT_OPTIONS.map((pj) => (
                        <option key={pj} value={pj}>
                          {pj}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={14} className="select-chevron" />
                  </div>
                </div>

                <div className="form-group">
                  <label>Assignee</label>
                  <input
                    type="text"
                    placeholder="e.g. Amit Sharma"
                    value={form.assignee}
                    onChange={(e) => setForm({ ...form, assignee: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-grid-3">
                <div className="form-group">
                  <label>Priority</label>
                  <div className="custom-select-wrap">
                    <select
                      value={form.priority}
                      onChange={(e) => setForm({ ...form, priority: e.target.value })}
                    >
                      {PRIORITY_OPTIONS.map((pr) => (
                        <option key={pr} value={pr}>
                          {pr}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={14} className="select-chevron" />
                  </div>
                </div>

                <div className="form-group">
                  <label>Status</label>
                  <div className="custom-select-wrap">
                    <select
                      value={form.status}
                      onChange={(e) => setForm({ ...form, status: e.target.value })}
                    >
                      {STATUS_OPTIONS.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={14} className="select-chevron" />
                  </div>
                </div>

                <div className="form-group">
                  <label>Due Date</label>
                  <input
                    type="date"
                    value={form.dueDate}
                    onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Description / Deliverable Notes</label>
                <textarea
                  rows={3}
                  placeholder="Describe acceptance criteria, endpoints, or design specs..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  <Check size={14} />
                  <span>{editingTask ? "Save Changes" : "Create Task"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TASK DETAILS PREVIEW MODAL */}
      {viewingTask && (
        <div className="modal-overlay" onMouseDown={(e) => e.target === e.currentTarget && setViewingTask(null)}>
          <div className="modal-box details-modal">
            <div className="modal-header">
              <div className="details-header-title">
                <span className="task-code-badge">{viewingTask.id}</span>
                <h2>{viewingTask.title}</h2>
              </div>
              <button type="button" className="modal-close" onClick={() => setViewingTask(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="details-body">
              <div className="details-meta-grid">
                <div className="meta-block">
                  <span className="meta-label">Project</span>
                  <strong>{viewingTask.project}</strong>
                </div>
                <div className="meta-block">
                  <span className="meta-label">Priority</span>
                  <span className={`priority-pill priority-${(viewingTask.priority || "Medium").toLowerCase()}`}>
                    {viewingTask.priority}
                  </span>
                </div>
                <div className="meta-block">
                  <span className="meta-label">Status</span>
                  <span className={`status-pill status-${(viewingTask.status || "To Do").toLowerCase().replace(/\s+/g, "-")}`}>
                    {viewingTask.status}
                  </span>
                </div>
                <div className="meta-block">
                  <span className="meta-label">Due Date</span>
                  <strong>{viewingTask.dueDate || "-"}</strong>
                </div>
              </div>

              <div className="details-assignee-card">
                <span className="task-avatar">{(viewingTask.assignee || "A").charAt(0)}</span>
                <div>
                  <strong>{viewingTask.assignee || "Unassigned"}</strong>
                  <p>{viewingTask.assigneeEmail || "amit@abctech.com"}</p>
                </div>
              </div>

              {viewingTask.description && (
                <div className="details-notes">
                  <span className="meta-label">Notes & Criteria</span>
                  <p>{viewingTask.description}</p>
                </div>
              )}
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  toggleTaskComplete(viewingTask.id);
                  setViewingTask(null);
                }}
              >
                {viewingTask.status === "Completed" ? "Re-open Task" : "Mark as Completed"}
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={() => {
                  const t = viewingTask;
                  setViewingTask(null);
                  openEditModal(t);
                }}
              >
                Edit Task
              </button>
            </div>
          </div>
        </div>
      )}

      {/* USER-FRIENDLY DELETE TASK CONFIRMATION MODAL */}
      {taskToDelete && (
        <div
          className="tasks-modal-overlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setTaskToDelete(null);
          }}
        >
          <div className="tasks-delete-modal-dialog">
            <div className="tasks-delete-icon-circle">
              <Trash2 size={26} />
            </div>

            <h3 className="tasks-delete-title">Delete Task?</h3>
            <p className="tasks-delete-text">
              Are you sure you want to permanently delete{" "}
              <strong>"{taskToDelete.title}"</strong> ({taskToDelete.id})? This action cannot be undone.
            </p>

            <div className="tasks-delete-task-preview">
              <div className="tasks-delete-preview-item">
                <span className="tasks-preview-label">Project</span>
                <span className="tasks-preview-val">{taskToDelete.project}</span>
              </div>
              <div className="tasks-delete-preview-item">
                <span className="tasks-preview-label">Assignee</span>
                <span className="tasks-preview-val">{taskToDelete.assignee || "Unassigned"}</span>
              </div>
              <div className="tasks-delete-preview-item">
                <span className="tasks-preview-label">Priority</span>
                <span className={`priority-pill priority-${(taskToDelete.priority || "Medium").toLowerCase()}`}>
                  {taskToDelete.priority}
                </span>
              </div>
            </div>

            <div className="tasks-delete-actions">
              <button
                type="button"
                className="tasks-btn-cancel"
                onClick={() => setTaskToDelete(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="tasks-btn-danger"
                onClick={confirmDeleteTask}
              >
                <Trash2 size={14} />
                <span>Delete Task</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* USER-FRIENDLY RESET DEMO CONFIRMATION MODAL */}
      {showResetConfirm && (
        <div
          className="tasks-modal-overlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setShowResetConfirm(false);
          }}
        >
          <div className="tasks-delete-modal-dialog">
            <div className="tasks-reset-icon-circle">
              <RotateCcw size={26} />
            </div>

            <h3 className="tasks-delete-title">Reset Demo Tasks?</h3>
            <p className="tasks-delete-text">
              Are you sure you want to restore the original demo task dataset? All created, edited, and deleted tasks will be restored to their initial factory state.
            </p>

            <div className="tasks-delete-actions">
              <button
                type="button"
                className="tasks-btn-cancel"
                onClick={() => setShowResetConfirm(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="tasks-btn-primary"
                onClick={confirmResetDemo}
              >
                <RotateCcw size={14} />
                <span>Restore Default Tasks</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
