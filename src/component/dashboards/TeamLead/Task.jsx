import { useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock3,
  Download,
  Eye,
  Filter,
  List,
  ListChecks,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  Trash2,
  UserRound,
  X,
  LayoutGrid,
  FolderKanban,
} from "lucide-react";
import {
  initialTasks,
  taskPriorities,
  taskStatuses,
  teamMembers,
} from "../Employee/tasksData.js";
import "./Task.css";

const TASKS_STORAGE_KEY = "teamflow_teamlead_tasks";
const STATUSES = taskStatuses?.length
  ? taskStatuses
  : ["To Do", "In Progress", "In Review", "Done"];
const PRIORITIES = taskPriorities?.length
  ? taskPriorities
  : ["Urgent", "High", "Medium", "Low"];

const emptyForm = () => ({
  title: "",
  description: "",
  project: "",
  assignee: teamMembers?.[0] || "",
  priority: "Medium",
  status: "To Do",
  dueDate: "",
});

function readTasks() {
  try {
    const saved = localStorage.getItem(TASKS_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (error) {
    console.error("Could not read Team Lead tasks:", error);
  }
  return Array.isArray(initialTasks) ? initialTasks : [];
}

function safeText(value) {
  return typeof value === "string" ? value : value == null ? "" : String(value);
}

function initials(name = "") {
  return safeText(name)
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase() || "—";
}

function formatDate(value) {
  if (!value) return "No due date";
  const date = new Date(`${value}T12:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function isOverdue(task) {
  if (!task.dueDate || ["Done", "Completed"].includes(task.status)) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(`${task.dueDate}T00:00:00`);
  return !Number.isNaN(due.getTime()) && due < today;
}

function priorityClass(value = "Medium") {
  return safeText(value).toLowerCase().replace(/\s+/g, "-");
}

function statusClass(value = "To Do") {
  return safeText(value).toLowerCase().replace(/\s+/g, "-");
}

export default function Task() {
  const [tasks, setTasks] = useState(readTasks);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [viewMode, setViewMode] = useState("table");
  const [sortKey, setSortKey] = useState("dueDate");
  const [sortOrder, setSortOrder] = useState("asc");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [viewingTask, setViewingTask] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState("");
  const [toast, setToast] = useState("");

  function notify(message) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  }

  function saveTasks(nextTasks) {
    setTasks(nextTasks);
    try {
      localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(nextTasks));
      window.dispatchEvent(new Event("teamflow_data_update"));
    } catch (error) {
      console.error("Could not save Team Lead tasks:", error);
      notify("Could not save changes in this browser.");
      return;
    }
  }

  const stats = useMemo(() => ({
    total: tasks.length,
    inProgress: tasks.filter((task) => task.status === "In Progress").length,
    completed: tasks.filter((task) => ["Done", "Completed"].includes(task.status)).length,
    overdue: tasks.filter(isOverdue).length,
  }), [tasks]);

  const filteredTasks = useMemo(() => {
    const query = search.trim().toLowerCase();
    const rows = tasks.filter((task) => {
      const matchesSearch = !query || [
        task.title, task.description, task.project, task.assignee, task.id,
      ].some((value) => safeText(value).toLowerCase().includes(query));
      const matchesStatus = statusFilter === "All" || task.status === statusFilter;
      const matchesPriority = priorityFilter === "All" || task.priority === priorityFilter;
      return matchesSearch && matchesStatus && matchesPriority;
    });

    return [...rows].sort((a, b) => {
      const left = safeText(a[sortKey]).toLowerCase();
      const right = safeText(b[sortKey]).toLowerCase();
      const comparison = sortKey === "dueDate"
        ? left.localeCompare(right)
        : left.localeCompare(right, undefined, { numeric: true });
      return sortOrder === "asc" ? comparison : -comparison;
    });
  }, [tasks, search, statusFilter, priorityFilter, sortKey, sortOrder]);

  function changeSort(key) {
    if (sortKey === key) setSortOrder((order) => order === "asc" ? "desc" : "asc");
    else {
      setSortKey(key);
      setSortOrder("asc");
    }
  }

  function sortIcon(key) {
    if (sortKey !== key) return <ArrowUpDown size={13} className="tl-task-sort-muted" />;
    return sortOrder === "asc"
      ? <ArrowUp size={13} className="tl-task-sort-active" />
      : <ArrowDown size={13} className="tl-task-sort-active" />;
  }

  function openCreate() {
    setEditingTask(null);
    setForm(emptyForm());
    setFormError("");
    setModalOpen(true);
  }

  function openEdit(task) {
    setEditingTask(task);
    setForm({
      title: safeText(task.title),
      description: safeText(task.description),
      project: safeText(task.project),
      assignee: safeText(task.assignee) || teamMembers?.[0] || "",
      priority: task.priority || "Medium",
      status: task.status || "To Do",
      dueDate: safeText(task.dueDate),
    });
    setFormError("");
    setViewingTask(null);
    setModalOpen(true);
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!form.title.trim()) {
      setFormError("Please enter a task title.");
      return;
    }
    if (!form.project.trim()) {
      setFormError("Please enter a project name.");
      return;
    }

    if (editingTask) {
      const updated = tasks.map((task) =>
        task.id === editingTask.id
          ? { ...task, ...form, title: form.title.trim(), project: form.project.trim() }
          : task
      );
      saveTasks(updated);
      notify("Task updated successfully.");
    } else {
      const newTask = {
        id: `lead-${Date.now()}`,
        ...form,
        title: form.title.trim(),
        project: form.project.trim(),
        description: form.description.trim(),
        createdAt: new Date().toISOString().slice(0, 10),
      };
      saveTasks([newTask, ...tasks]);
      notify("Task created and assigned.");
    }
    setModalOpen(false);
  }

  function deleteTask(task) {
    if (!window.confirm(`Delete "${task.title}"? This cannot be undone.`)) return;
    saveTasks(tasks.filter((item) => item.id !== task.id));
    setViewingTask(null);
    notify("Task deleted.");
  }

  function updateStatus(task, status) {
    if (!STATUSES.includes(status)) return;
    saveTasks(tasks.map((item) => item.id === task.id ? { ...item, status } : item));
    notify("Task status updated.");
  }

  function updateAssignee(task, assignee) {
    saveTasks(tasks.map((item) => item.id === task.id ? { ...item, assignee } : item));
    notify("Task assignment updated.");
  }

  function exportCSV() {
    const headers = ["No.", "Task", "Project", "Assignee", "Priority", "Status", "Due date"];
    const escapeCSV = (value) => `"${safeText(value).replace(/"/g, '""')}"`;
    const rows = filteredTasks.map((task, index) => [
      index + 1, task.title, task.project, task.assignee,
      task.priority, task.status, task.dueDate,
    ].map(escapeCSV).join(","));
    const csv = [headers.map(escapeCSV).join(","), ...rows].join("\r\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `teamflow-team-tasks-${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    notify("Filtered tasks exported to CSV.");
  }

  function resetFilters() {
    setSearch("");
    setStatusFilter("All");
    setPriorityFilter("All");
    setSortKey("dueDate");
    setSortOrder("asc");
  }

  return (
    <section className="tl-task-page">
      <header className="tl-task-header">
        <div>
          <span className="tl-task-eyebrow">TEAM WORKSPACE / WORK MANAGEMENT</span>
          <h1>Task Management</h1>
          <p>Assign work, track progress, and keep every project moving.</p>
        </div>
        <div className="tl-task-header-actions">
          <button type="button" className="tl-task-secondary-button" onClick={exportCSV}>
            <Download size={16} /> Export
          </button>
          <button type="button" className="tl-task-create-button" onClick={openCreate}>
            <Plus size={17} /> Assign a task
          </button>
        </div>
      </header>

      <section className="tl-task-stats" aria-label="Task summary">
        <StatCard icon={<ListChecks size={21} />} title="Total Tasks" value={stats.total} description="Across all projects" tone="purple" />
        <StatCard icon={<Clock3 size={21} />} title="In Progress" value={stats.inProgress} description="Currently underway" tone="blue" />
        <StatCard icon={<CheckCircle2 size={21} />} title="Completed" value={stats.completed} description="Finished tasks" tone="green" />
        <StatCard icon={<AlertCircle size={21} />} title="Overdue" value={stats.overdue} description="Needs attention" tone="amber" />
      </section>

      <section className="tl-task-panel">
        <div className="tl-task-panel-heading">
          <div>
            <h2>Team tasks <span className="tl-task-count">{filteredTasks.length}</span></h2>
            <p>Search, filter, edit, and update task assignments.</p>
          </div>
          <div className="tl-task-view-switch" aria-label="Task view">
            <button type="button" className={viewMode === "table" ? "active" : ""} onClick={() => setViewMode("table")} aria-pressed={viewMode === "table"}>
              <List size={16} /> List
            </button>
            <button type="button" className={viewMode === "board" ? "active" : ""} onClick={() => setViewMode("board")} aria-pressed={viewMode === "board"}>
              <LayoutGrid size={16} /> Board
            </button>
          </div>
        </div>

        <div className="tl-task-toolbar">
          <label className="tl-task-search">
            <Search size={17} aria-hidden="true" />
            <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search task, project, or assignee..." />
            {search && <button type="button" aria-label="Clear search" onClick={() => setSearch("")}><X size={14} /></button>}
          </label>
          <label className="tl-task-filter">
            <Filter size={15} aria-hidden="true" />
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} aria-label="Filter by status">
              <option value="All">All statuses</option>
              {STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}
            </select>
          </label>
          <label className="tl-task-filter">
            <Filter size={15} aria-hidden="true" />
            <select value={priorityFilter} onChange={(event) => setPriorityFilter(event.target.value)} aria-label="Filter by priority">
              <option value="All">All priorities</option>
              {PRIORITIES.map((priority) => <option key={priority} value={priority}>{priority}</option>)}
            </select>
          </label>
          {(search || statusFilter !== "All" || priorityFilter !== "All") && (
            <button type="button" className="tl-task-reset-button" onClick={resetFilters}><RotateCcw size={14} /> Reset</button>
          )}
        </div>

        {viewMode === "table" ? (
          <div className="tl-task-table-wrap">
            <table className="tl-task-table">
              <thead>
                <tr>
                  <th className="number-column">#</th>
                  <th><button type="button" className="tl-task-sort-button" onClick={() => changeSort("title")}>Task {sortIcon("title")}</button></th>
                  <th><button type="button" className="tl-task-sort-button" onClick={() => changeSort("project")}>Project {sortIcon("project")}</button></th>
                  <th><button type="button" className="tl-task-sort-button" onClick={() => changeSort("assignee")}>Assignee {sortIcon("assignee")}</button></th>
                  <th><button type="button" className="tl-task-sort-button" onClick={() => changeSort("priority")}>Priority {sortIcon("priority")}</button></th>
                  <th><button type="button" className="tl-task-sort-button" onClick={() => changeSort("status")}>Status {sortIcon("status")}</button></th>
                  <th><button type="button" className="tl-task-sort-button" onClick={() => changeSort("dueDate")}>Due date {sortIcon("dueDate")}</button></th>
                  <th className="actions-column">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.map((task, index) => (
                  <tr key={task.id}>
                    <td className="number-column"><span className="tl-task-row-number">{index + 1}</span></td>
                    <td className="task-cell">
                      <button type="button" className="tl-task-title-button" onClick={() => setViewingTask(task)}>{task.title || "Untitled task"}</button>
                      <small>{task.description || "No description added"}</small>
                    </td>
                    <td><span className="tl-task-project-chip"><FolderKanban size={13} />{task.project || "No project"}</span></td>
                    <td>
                      <label className="tl-task-assignee-cell">
                        <span className="tl-task-avatar">{initials(task.assignee)}</span>
                        <select value={task.assignee || ""} onChange={(event) => updateAssignee(task, event.target.value)} aria-label={`Change assignee for ${task.title}`}>
                          {!task.assignee && <option value="">Unassigned</option>}
                          {(teamMembers || []).map((member) => <option key={member} value={member}>{member}</option>)}
                        </select>
                      </label>
                    </td>
                    <td><span className={`tl-task-priority-badge ${priorityClass(task.priority)}`}>{task.priority || "Medium"}</span></td>
                    <td>
                      <select className={`tl-task-status-select ${statusClass(task.status)}`} value={task.status || "To Do"} onChange={(event) => updateStatus(task, event.target.value)} aria-label={`Change status for ${task.title}`}>
                        {STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}
                      </select>
                    </td>
                    <td><span className={`tl-task-date ${isOverdue(task) ? "overdue" : ""}`}><CalendarDays size={14} />{formatDate(task.dueDate)}{isOverdue(task) && <em>Overdue</em>}</span></td>
                    <td>
                      <div className="tl-task-row-actions">
                        <button type="button" title="View task" aria-label={`View ${task.title}`} onClick={() => setViewingTask(task)}><Eye size={15} /></button>
                        <button type="button" title="Edit task" aria-label={`Edit ${task.title}`} onClick={() => openEdit(task)}><Pencil size={15} /></button>
                        <button type="button" className="delete" title="Delete task" aria-label={`Delete ${task.title}`} onClick={() => deleteTask(task)}><Trash2 size={15} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredTasks.length === 0 && <EmptyState onReset={resetFilters} />}
            <div className="tl-task-table-footer">
              Showing <strong>{filteredTasks.length ? 1 : 0}–{filteredTasks.length}</strong> of <strong>{tasks.length}</strong> tasks
            </div>
          </div>
        ) : (
          <div className="tl-task-board">
            {STATUSES.map((status) => {
              const columnTasks = filteredTasks.filter((task) => task.status === status);
              return (
                <section className={`tl-task-board-column ${statusClass(status)}`} key={status}>
                  <header><h3>{status}</h3><span>{columnTasks.length}</span></header>
                  {columnTasks.map((task) => (
                    <article className="tl-task-board-card" key={task.id}>
                      <div className="tl-task-board-card-top">
                        <span className={`tl-task-priority-badge ${priorityClass(task.priority)}`}>{task.priority}</span>
                        {isOverdue(task) && <em>Overdue</em>}
                      </div>
                      <button type="button" className="tl-task-title-button" onClick={() => setViewingTask(task)}>{task.title}</button>
                      <p>{task.description || "No description added."}</p>
                      <div className="tl-task-board-card-meta"><span><UserRound size={14} />{task.assignee || "Unassigned"}</span><span><CalendarDays size={14} />{formatDate(task.dueDate)}</span></div>
                      <label className="tl-task-board-status">Update status
                        <select value={task.status} onChange={(event) => updateStatus(task, event.target.value)}>
                          {STATUSES.map((item) => <option key={item} value={item}>{item}</option>)}
                        </select>
                      </label>
                      <div className="tl-task-row-actions">
                        <button type="button" aria-label={`Edit ${task.title}`} onClick={() => openEdit(task)}><Pencil size={15} /></button>
                        <button type="button" className="delete" aria-label={`Delete ${task.title}`} onClick={() => deleteTask(task)}><Trash2 size={15} /></button>
                      </div>
                    </article>
                  ))}
                  {!columnTasks.length && <div className="tl-task-board-empty">No tasks in this status</div>}
                </section>
              );
            })}
          </div>
        )}
      </section>

      {modalOpen && (
        <div className="tl-task-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setModalOpen(false); }}>
          <section className="tl-task-modal" role="dialog" aria-modal="true" aria-labelledby="tl-task-modal-title">
            <header className="tl-task-modal-header">
              <span className="tl-task-modal-icon"><ListChecks size={20} /></span>
              <div><h2 id="tl-task-modal-title">{editingTask ? "Edit task" : "Assign a new task"}</h2><p>Set task details, priority, owner, and due date.</p></div>
              <button type="button" className="tl-task-modal-close" aria-label="Close task form" onClick={() => setModalOpen(false)}><X size={19} /></button>
            </header>
            <form className="tl-task-form" onSubmit={handleSubmit}>
              <label className="tl-task-form-field full"><span>Task title <b>*</b></span><input autoFocus maxLength={100} value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="e.g. Prepare the sprint review" /></label>
              <label className="tl-task-form-field full"><span>Description</span><textarea rows={3} maxLength={500} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="Describe the task and expected outcome" /></label>
              <label className="tl-task-form-field"><span>Project <b>*</b></span><input maxLength={80} value={form.project} onChange={(event) => setForm({ ...form, project: event.target.value })} placeholder="Project name" /></label>
              <label className="tl-task-form-field"><span>Assignee</span><select value={form.assignee} onChange={(event) => setForm({ ...form, assignee: event.target.value })}>{(teamMembers || []).map((member) => <option key={member} value={member}>{member}</option>)}</select></label>
              <label className="tl-task-form-field"><span>Priority</span><select value={form.priority} onChange={(event) => setForm({ ...form, priority: event.target.value })}>{PRIORITIES.map((priority) => <option key={priority} value={priority}>{priority}</option>)}</select></label>
              <label className="tl-task-form-field"><span>Status</span><select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}>{STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}</select></label>
              <label className="tl-task-form-field full"><span>Due date</span><input type="date" value={form.dueDate} onChange={(event) => setForm({ ...form, dueDate: event.target.value })} /></label>
              {formError && <p className="tl-task-form-error" role="alert">{formError}</p>}
              <footer className="tl-task-form-actions">
                <button type="button" className="tl-task-cancel-button" onClick={() => setModalOpen(false)}>Cancel</button>
                <button type="submit" className="tl-task-create-button"><Check size={16} />{editingTask ? "Save changes" : "Create task"}</button>
              </footer>
            </form>
          </section>
        </div>
      )}

      {viewingTask && (
        <div className="tl-task-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setViewingTask(null); }}>
          <section className="tl-task-details-modal" role="dialog" aria-modal="true" aria-labelledby="tl-task-details-title">
            <header className="tl-task-modal-header">
              <span className="tl-task-modal-icon"><Eye size={20} /></span>
              <div><h2 id="tl-task-details-title">Task details</h2><p>Review the task and its current assignment.</p></div>
              <button type="button" className="tl-task-modal-close" aria-label="Close task details" onClick={() => setViewingTask(null)}><X size={19} /></button>
            </header>
            <div className="tl-task-details-body">
              <div className="tl-task-details-badges"><span className={`tl-task-priority-badge ${priorityClass(viewingTask.priority)}`}>{viewingTask.priority}</span><span className={`tl-task-status-label ${statusClass(viewingTask.status)}`}>{viewingTask.status}</span></div>
              <h3>{viewingTask.title}</h3>
              <p className="tl-task-details-description">{viewingTask.description || "No description has been added."}</p>
              <div className="tl-task-details-grid">
                <div><small>Project</small><strong>{viewingTask.project || "No project"}</strong></div>
                <div><small>Assignee</small><strong>{viewingTask.assignee || "Unassigned"}</strong></div>
                <div><small>Due date</small><strong>{formatDate(viewingTask.dueDate)}</strong></div>
                <div><small>Status</small><strong>{viewingTask.status || "To Do"}</strong></div>
              </div>
              <footer className="tl-task-form-actions">
                <button type="button" className="tl-task-cancel-button" onClick={() => deleteTask(viewingTask)}>Delete task</button>
                <button type="button" className="tl-task-create-button" onClick={() => openEdit(viewingTask)}><Pencil size={15} /> Edit task</button>
              </footer>
            </div>
          </section>
        </div>
      )}

      {toast && <div className="tl-task-toast" role="status"><CheckCircle2 size={17} />{toast}</div>}
    </section>
  );
}

function StatCard({ icon, title, value, description, tone }) {
  return (
    <article className="tl-task-stat">
      <span className={`tl-task-stat-icon ${tone}`}>{icon}</span>
      <div><small>{title}</small><strong>{value}</strong><span>{description}</span></div>
    </article>
  );
}

function EmptyState({ onReset }) {
  return (
    <div className="tl-task-empty-state">
      <Search size={34} />
      <h3>No tasks found</h3>
      <p>Try changing your search or filters.</p>
      <button type="button" onClick={onReset}>Clear filters</button>
    </div>
  );
}
