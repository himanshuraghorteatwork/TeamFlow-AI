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
  Eye,
  Check,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

import AdminSidebar from "./AdminSidebar.jsx";
import AdminTopbar from "./AdminTopbar.jsx";
import { initialAdminTasks } from "./adminTasksData.js";
import "./AdminTasks.css";

const STORAGE_KEY = "teamflow_admin_tasks";

const STATUSES = ["To Do", "In Progress", "In Review", "Completed"];
const PRIORITIES = ["Critical", "High", "Medium", "Low"];

const loadTasks = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error(e);
  }
  return initialAdminTasks;
};

export default function AdminTasks() {
  const [tasks, setTasks] = useState(loadTasks);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [viewMode, setViewMode] = useState("list"); // 'list' | 'kanban'
  const [sortKey, setSortKey] = useState("dueDate");
  const [sortOrder, setSortOrder] = useState("asc"); // 'asc' | 'desc'

  // Modals
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [viewingTask, setViewingTask] = useState(null);
  const [exportOpen, setExportOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // Column sort toggle handler
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

  // Form State
  const [form, setForm] = useState({
    title: "",
    project: "TeamFlow AI",
    assignee: "Amit Sharma",
    priority: "High",
    status: "To Do",
    dueDate: "2026-11-20",
    completed: false,
    description: "",
  });

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  const saveTasks = (newTasks) => {
    setTasks(newTasks);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newTasks));
    } catch (e) {}
    window.dispatchEvent(new Event("teamflow_data_update"));
  };

  useEffect(() => {
    const handleSync = () => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) setTasks(JSON.parse(saved));
      } catch (e) {}
    };
    window.addEventListener("storage", handleSync);
    window.addEventListener("teamflow_data_update", handleSync);
    return () => {
      window.removeEventListener("storage", handleSync);
      window.removeEventListener("teamflow_data_update", handleSync);
    };
  }, []);

  const filteredTasks = useMemo(() => {
    const list = tasks.filter((t) => {
      const term = search.trim().toLowerCase();
      const matchesSearch =
        !term ||
        t.title?.toLowerCase().includes(term) ||
        t.project?.toLowerCase().includes(term) ||
        t.assignee?.toLowerCase().includes(term);

      const matchesStatus = statusFilter === "All" || t.status === statusFilter;
      const matchesPriority = priorityFilter === "All" || t.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });

    return [...list].sort((a, b) => {
      let valA = a[sortKey];
      let valB = b[sortKey];

      if (valA === undefined || valA === null) valA = "";
      if (valB === undefined || valB === null) valB = "";

      if (typeof valA === "boolean") valA = valA ? 1 : 0;
      if (typeof valB === "boolean") valB = valB ? 1 : 0;

      if (typeof valA === "number" && typeof valB === "number") {
        return sortOrder === "asc" ? valA - valB : valB - valA;
      }

      valA = String(valA).toLowerCase();
      valB = String(valB).toLowerCase();

      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [tasks, search, statusFilter, priorityFilter, sortKey, sortOrder]);

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed || t.status === "Completed").length;
    const inProgress = tasks.filter((t) => t.status === "In Progress" || t.status === "In Review").length;
    const todo = tasks.filter((t) => t.status === "To Do" || (!t.completed && t.status !== "In Progress")).length;
    return { total, completed, inProgress, todo };
  }, [tasks]);

  const toggleTaskComplete = (id) => {
    const updated = tasks.map((t) => {
      if (t.id === id) {
        const nextCompleted = !t.completed;
        return {
          ...t,
          completed: nextCompleted,
          status: nextCompleted ? "Completed" : "In Progress",
        };
      }
      return t;
    });
    saveTasks(updated);
    showToast("Task status updated.");
  };

  const openCreateModal = () => {
    setEditingTask(null);
    setForm({
      title: "",
      project: "TeamFlow AI",
      assignee: "Amit Sharma",
      priority: "Medium",
      status: "To Do",
      dueDate: "2026-11-25",
      completed: false,
      description: "",
    });
    setShowModal(true);
  };

  const openEditModal = (t) => {
    setEditingTask(t);
    setForm({
      title: t.title || "",
      project: t.project || "TeamFlow AI",
      assignee: t.assignee || "",
      priority: t.priority || "Medium",
      status: t.status || "To Do",
      dueDate: t.dueDate || "",
      completed: Boolean(t.completed),
      description: t.description || "",
    });
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      alert("Task title is required.");
      return;
    }

    if (editingTask) {
      const updated = tasks.map((t) =>
        t.id === editingTask.id ? { ...t, ...form } : t
      );
      saveTasks(updated);
      showToast(`Task updated successfully.`);
    } else {
      const newTask = {
        id: Date.now(),
        ...form,
        createdAt: new Date().toISOString().split("T")[0],
      };
      saveTasks([newTask, ...tasks]);
      showToast(`Task created successfully.`);
    }

    setShowModal(false);
  };

  const deleteTask = (id, title) => {
    const confirmed = window.confirm(`Delete task "${title}"?`);
    if (!confirmed) return;
    saveTasks(tasks.filter((t) => t.id !== id));
    showToast("Task deleted.");
  };

  const exportCSV = () => {
    const headers = ["ID", "Title", "Project", "Assignee", "Priority", "Status", "Due Date"];
    const rows = filteredTasks.map((t) => [
      t.id,
      `"${t.title}"`,
      `"${t.project}"`,
      `"${t.assignee}"`,
      `"${t.priority}"`,
      `"${t.status}"`,
      `"${t.dueDate}"`,
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = `teamflow_tasks_${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setExportOpen(false);
    showToast("Exported tasks to CSV.");
  };

  const resetDemo = () => {
    const confirmed = window.confirm("Reset tasks database to demo defaults?");
    if (!confirmed) return;
    saveTasks(initialAdminTasks);
    showToast("Tasks reset to demo defaults.");
  };

  return (
    <div className="admin-tasks-app">
      <AdminSidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="admin-tasks-main">
        <AdminTopbar
          onMobileMenuToggle={() => setMobileOpen(true)}
          onCreateTask={openCreateModal}
        />

        {toast && (
          <div className={`admin-tasks-toast toast--${toast.type}`}>
            <CheckCircle2 size={16} />
            <span>{toast.message}</span>
          </div>
        )}

        <main className="admin-tasks-content">
          {/* HEADING */}
          <section className="admin-tasks-heading">
            <div>
              <h1>Task Management</h1>
              <p>Track sprints, prioritize engineering tickets, and monitor deliverables across teams.</p>
            </div>

            <div className="admin-tasks-heading-actions">
              <div className="admin-tasks-dropdown-wrap">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setExportOpen((prev) => !prev)}
                >
                  <Download size={15} />
                  <span>Export</span>
                  <ChevronDown size={14} />
                </button>

                {exportOpen && (
                  <div className="export-menu">
                    <button type="button" onClick={exportCSV}>Export as CSV (.csv)</button>
                  </div>
                )}
              </div>

              <button type="button" className="btn-primary" onClick={openCreateModal}>
                <Plus size={17} />
                <span>Create Task</span>
              </button>
            </div>
          </section>

          {/* STATS */}
          <section className="admin-tasks-stats">
            <StatCard icon={<ListChecks size={22} />} title="Total Tasks" value={stats.total} type="purple" desc="Across all projects" />
            <StatCard icon={<Clock size={22} />} title="In Progress" value={stats.inProgress} type="blue" desc="Currently underway" />
            <StatCard icon={<CheckCircle2 size={22} />} title="Completed" value={stats.completed} type="green" desc="Verified and done" />
            <StatCard icon={<AlertTriangle size={22} />} title="To Do" value={stats.todo} type="amber" desc="Pending execution" />
          </section>

          {/* TOOLBAR */}
          <section className="admin-tasks-toolbar">
            <div className="admin-tasks-search">
              <Search size={17} />
              <input
                type="text"
                placeholder="Search tasks by title, project, or assignee..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button type="button" className="clear-btn" onClick={() => setSearch("")}>
                  <X size={14} />
                </button>
              )}
            </div>

            <div className="admin-tasks-controls">
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="All">All Statuses</option>
                {STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>

              <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
                <option value="All">All Priorities</option>
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>

              <select
                value={`${sortKey}-${sortOrder}`}
                onChange={(e) => {
                  const [k, ord] = e.target.value.split("-");
                  setSortKey(k);
                  setSortOrder(ord);
                }}
                aria-label="Sort tasks"
              >
                <option value="dueDate-asc">Sort: Due Date (Earliest)</option>
                <option value="dueDate-desc">Sort: Due Date (Latest)</option>
                <option value="title-asc">Sort: Title (A to Z)</option>
                <option value="title-desc">Sort: Title (Z to A)</option>
                <option value="priority-asc">Sort: Priority</option>
                <option value="status-asc">Sort: Status</option>
                <option value="assignee-asc">Sort: Assignee</option>
              </select>

              {(search || statusFilter !== "All" || priorityFilter !== "All") && (
                <button
                  type="button"
                  className="clear-filters-btn"
                  onClick={() => {
                    setSearch("");
                    setStatusFilter("All");
                    setPriorityFilter("All");
                  }}
                >
                  <X size={13} />
                  Clear Filters
                </button>
              )}

              <div className="view-switch">
                <button
                  type="button"
                  className={`view-btn ${viewMode === "list" ? "active" : ""}`}
                  onClick={() => setViewMode("list")}
                >
                  <List size={16} />
                </button>
                <button
                  type="button"
                  className={`view-btn ${viewMode === "kanban" ? "active" : ""}`}
                  onClick={() => setViewMode("kanban")}
                >
                  <Kanban size={16} />
                </button>
              </div>
            </div>
          </section>

          {/* META HEADER */}
          <div className="admin-tasks-meta-header">
            <span>Showing {filteredTasks.length} of {tasks.length} tasks</span>
            <button type="button" className="reset-btn" onClick={resetDemo}>
              <RotateCcw size={14} />
              Reset Demo Data
            </button>
          </div>

          {/* LIST VIEW */}
          {viewMode === "list" ? (
            <div className="admin-tasks-table-wrap">
              <table className="admin-tasks-table">
                <thead>
                  <tr>
                    <th style={{ width: 44, textAlign: "center" }}>Done</th>
                    <th style={{ width: 48, textAlign: "center" }}>#</th>
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
                  {filteredTasks.map((t, idx) => {
                    const isDone = Boolean(t.completed || t.status === "Completed");

                    return (
                      <tr key={t.id} className={isDone ? "row-done" : ""}>
                        <td style={{ textAlign: "center" }}>
                          <button
                            type="button"
                            className={`check-circle-btn ${isDone ? "checked" : ""}`}
                            onClick={() => toggleTaskComplete(t.id)}
                            title={isDone ? "Mark as Incomplete" : "Mark as Completed"}
                          >
                            {isDone && <Check size={13} />}
                          </button>
                        </td>
                        <td style={{ textAlign: "center" }}>
                          <span className="admin-row-num">{idx + 1}</span>
                        </td>
                        <td>
                          <strong
                            className={`task-title clickable ${isDone ? "strikethrough" : ""}`}
                            onClick={() => setViewingTask(t)}
                          >
                            {t.title}
                          </strong>
                        </td>
                        <td>
                          <span className="project-chip">{t.project}</span>
                        </td>
                        <td>{t.assignee || "Unassigned"}</td>
                        <td>
                          <span className={`priority-tag priority-${(t.priority || "Medium").toLowerCase()}`}>
                            {t.priority}
                          </span>
                        </td>
                        <td>
                          <span className={`status-pill status-${(t.status || "To Do").toLowerCase().replace(/\s+/g, "-")}`}>
                            {t.status}
                          </span>
                        </td>
                        <td>{t.dueDate || "-"}</td>
                        <td style={{ textAlign: "right" }}>
                          <div className="table-actions">
                            <button type="button" className="action-btn" title="View details" onClick={() => setViewingTask(t)}>
                              <Eye size={15} />
                            </button>
                            <button type="button" className="action-btn" title="Edit task" onClick={() => openEditModal(t)}>
                              <Pencil size={15} />
                            </button>
                            <button type="button" className="action-btn delete" title="Delete task" onClick={() => deleteTask(t.id, t.title)}>
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
          ) : (
            /* KANBAN BOARD VIEW */
            <div className="admin-tasks-kanban">
              {STATUSES.map((statusCol) => {
                const columnTasks = filteredTasks.filter((t) => (t.status || "To Do") === statusCol);

                return (
                  <div key={statusCol} className="kanban-column">
                    <div className="column-header">
                      <h3>{statusCol}</h3>
                      <span className="col-count">{columnTasks.length}</span>
                    </div>

                    <div className="column-cards">
                      {columnTasks.map((t) => (
                        <div key={t.id} className="kanban-card">
                          <div className="kanban-card-top">
                            <span className="project-chip">{t.project}</span>
                            <span className={`priority-tag priority-${(t.priority || "Medium").toLowerCase()}`}>
                              {t.priority}
                            </span>
                          </div>

                          <h4 onClick={() => openEditModal(t)}>{t.title}</h4>

                          <div className="kanban-card-footer">
                            <div className="kanban-assignee">
                              <User size={13} />
                              <span>{t.assignee || "Unassigned"}</span>
                            </div>
                            <span className="kanban-date">{t.dueDate}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {filteredTasks.length === 0 && (
            <div className="admin-tasks-empty">
              <ListChecks size={44} />
              <h3>No tasks found</h3>
              <p>Try modifying your search or status filter.</p>
            </div>
          )}
        </main>
      </div>

      {/* CREATE / EDIT MODAL */}
      {showModal && (
        <div className="modal-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}>
          <div className="modal-box">
            <div className="modal-header">
              <h2>{editingTask ? "Edit Task" : "Create New Task"}</h2>
              <button type="button" className="modal-close" onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label>Task Title <span className="req">*</span></label>
                <input name="title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Implement OAuth Flow" required />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Project</label>
                  <input name="project" value={form.project} onChange={(e) => setForm({ ...form, project: e.target.value })} placeholder="e.g. TeamFlow AI" />
                </div>
                <div className="form-group">
                  <label>Assignee</label>
                  <input name="assignee" value={form.assignee} onChange={(e) => setForm({ ...form, assignee: e.target.value })} placeholder="e.g. Amit Sharma" />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Status</label>
                  <select name="status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Priority</label>
                  <select name="priority" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
                    {PRIORITIES.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Due Date</label>
                <input type="date" name="dueDate" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-submit">{editingTask ? "Save Changes" : "Create Task"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* VIEW TASK MODAL */}
      {viewingTask && (
        <div className="modal-overlay" onClick={() => setViewingTask(null)}>
          <div className="task-view-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-header-left">
                <span className="project-chip">{viewingTask.project}</span>
                <span className={`priority-tag priority-${(viewingTask.priority || "Medium").toLowerCase()}`}>
                  {viewingTask.priority}
                </span>
                <span className={`status-pill status-${(viewingTask.status || "To Do").toLowerCase().replace(/\s+/g, "-")}`}>
                  {viewingTask.status}
                </span>
              </div>
              <button type="button" className="close-btn" onClick={() => setViewingTask(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="task-view-body">
              <h2>{viewingTask.title}</h2>
              <p className="task-desc">{viewingTask.description || "No specific detailed description entered for this task ticket."}</p>

              <div className="task-details-grid">
                <div className="detail-item">
                  <span className="label">Assignee</span>
                  <strong>{viewingTask.assignee || "Unassigned"}</strong>
                </div>
                <div className="detail-item">
                  <span className="label">Due Date</span>
                  <strong>{viewingTask.dueDate || "No deadline"}</strong>
                </div>
                <div className="detail-item">
                  <span className="label">Status</span>
                  <strong>{viewingTask.status}</strong>
                </div>
                <div className="detail-item">
                  <span className="label">Completion</span>
                  <strong>{viewingTask.completed ? "Completed" : "In Progress"}</strong>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  toggleTaskComplete(viewingTask.id);
                  setViewingTask(prev => prev ? { ...prev, completed: !prev.completed, status: !prev.completed ? "Completed" : "In Progress" } : null);
                }}
              >
                <Check size={15} />
                {viewingTask.completed ? "Mark as Incomplete" : "Mark as Completed"}
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={() => {
                  const taskToEdit = viewingTask;
                  setViewingTask(null);
                  openEditModal(taskToEdit);
                }}
              >
                <Pencil size={15} />
                Edit Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon, title, value, type, desc }) {
  return (
    <div className={`admin-tasks-stat-card stat-${type}`}>
      <div className={`stat-icon ${type}`}>{icon}</div>
      <div className="stat-info">
        <span className="stat-label">{title}</span>
        <strong className="stat-value">{value}</strong>
        <small className="stat-desc">{desc}</small>
      </div>
    </div>
  );
}
