
import { useMemo, useState } from "react";
import {
  Plus,
  Search,
  CalendarDays,
  LayoutGrid,
  List,
  MoreHorizontal,
  X,
  CheckCircle2,
  Clock3,
  AlertCircle,
  ClipboardList,
  Trash2,
  Pencil,
  ChevronDown,
  UserRound,
} from "lucide-react";

import AppSidebar from "../../layouts/AppSidebar";
import {
  initialTasks,
  taskStatuses,
  taskPriorities,
  teamMembers,
} from "./tasksData";
import "./Tasks.css";

const emptyTask = {
  title: "",
  description: "",
  project: "Website Redesign",
  assignee: teamMembers[0],
  status: "To Do",
  priority: "Medium",
  dueDate: "",
};

const columns = [
  { name: "To Do", color: "todo", icon: ClipboardList },
  { name: "In Progress", color: "progress", icon: Clock3 },
  { name: "In Review", color: "review", icon: AlertCircle },
  { name: "Done", color: "done", icon: CheckCircle2 },
];

function initials(name = "") {
  return name
    .split(/\s+/)
    .map((part) => part[0] || "")
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function formatDate(date) {
  if (!date) return "No due date";

  return new Date(`${date}T12:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function isOverdue(task) {
  if (!task.dueDate || task.status === "Done") return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return new Date(`${task.dueDate}T00:00:00`) < today;
}

function Tasks() {
  const [tasks, setTasks] = useState(initialTasks);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [priorityFilter, setPriorityFilter] = useState("All Priorities");
  const [view, setView] = useState("board");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyTask);
  const [error, setError] = useState("");
  const [openMenu, setOpenMenu] = useState(null);

  const stats = useMemo(
    () => [
      {
        label: "Total Tasks",
        value: tasks.length,
        icon: ClipboardList,
        color: "purple",
      },
      {
        label: "In Progress",
        value: tasks.filter((task) => task.status === "In Progress").length,
        icon: Clock3,
        color: "blue",
      },
      {
        label: "Completed",
        value: tasks.filter((task) => task.status === "Done").length,
        icon: CheckCircle2,
        color: "green",
      },
      {
        label: "Overdue",
        value: tasks.filter(isOverdue).length,
        icon: AlertCircle,
        color: "orange",
      },
    ],
    [tasks]
  );

  const filteredTasks = useMemo(() => {
    const query = search.trim().toLowerCase();

    return tasks.filter((task) => {
      const matchesSearch = [
        task.title,
        task.description,
        task.project,
        task.assignee,
      ].some((value) => value.toLowerCase().includes(query));

      const matchesStatus =
        statusFilter === "All Statuses" || task.status === statusFilter;

      const matchesPriority =
        priorityFilter === "All Priorities" ||
        task.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tasks, search, statusFilter, priorityFilter]);

  function updateField(field, value) {
    setForm((previous) => ({ ...previous, [field]: value }));
    setError("");
  }

  function openCreateModal() {
    setEditingId(null);
    setForm({ ...emptyTask });
    setError("");
    setShowModal(true);
  }

  function openEditModal(task) {
    setEditingId(task.id);
    setForm({
      title: task.title,
      description: task.description,
      project: task.project,
      assignee: task.assignee,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate,
    });
    setError("");
    setOpenMenu(null);
    setShowModal(true);
  }

  function saveTask(event) {
    event.preventDefault();

    const title = form.title.trim();

    if (!title) {
      setError("Please enter a task title.");
      return;
    }

    if (editingId !== null) {
      setTasks((previous) =>
        previous.map((task) =>
          task.id === editingId
            ? { ...task, ...form, title }
            : task
        )
      );
    } else {
      setTasks((previous) => [
        { ...form, title, id: Date.now() },
        ...previous,
      ]);
    }

    setShowModal(false);
    setForm({ ...emptyTask });
    setEditingId(null);
    setError("");
  }

  function updateStatus(id, status) {
    setTasks((previous) =>
      previous.map((task) =>
        task.id === id ? { ...task, status } : task
      )
    );
    setOpenMenu(null);
  }

  function deleteTask(task) {
    const confirmed = window.confirm(
      `Delete "${task.title}"? This cannot be undone.`
    );

    if (!confirmed) return;

    setTasks((previous) => previous.filter((item) => item.id !== task.id));
    setOpenMenu(null);
  }

  function TaskCard({ task }) {
    return (
      <article className="tasks-card">
        <div className="tasks-card-top">
          <span className={`tasks-priority ${task.priority.toLowerCase()}`}>
            <span />
            {task.priority}
          </span>

          <div className="tasks-menu-wrap">
            <button
              type="button"
              className="tasks-icon-button"
              aria-label={`Actions for ${task.title}`}
              aria-expanded={openMenu === task.id}
              onClick={() =>
                setOpenMenu(openMenu === task.id ? null : task.id)
              }
            >
              <MoreHorizontal size={19} />
            </button>

            {openMenu === task.id && (
              <>
                <button
                  type="button"
                  className="tasks-menu-backdrop"
                  aria-label="Close task actions"
                  onClick={() => setOpenMenu(null)}
                />
                <div className="tasks-action-menu">
                  <button type="button" onClick={() => openEditModal(task)}>
                    <Pencil size={15} /> Edit task
                  </button>

                  <div className="tasks-menu-label">Move to</div>

                  {taskStatuses.map((status) => (
                    <button
                      type="button"
                      key={status}
                      className={task.status === status ? "selected" : ""}
                      onClick={() => updateStatus(task.id, status)}
                    >
                      {status}
                    </button>
                  ))}

                  <button
                    type="button"
                    className="danger"
                    onClick={() => deleteTask(task)}
                  >
                    <Trash2 size={15} /> Delete task
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        <button
          type="button"
          className="tasks-card-title"
          onClick={() => openEditModal(task)}
        >
          {task.title}
        </button>

        {task.description && (
          <p className="tasks-card-description">{task.description}</p>
        )}

        <div className="tasks-project">{task.project}</div>

        <div className="tasks-card-footer">
          <div className="tasks-assignee" title={task.assignee}>
            <span className="tasks-avatar">{initials(task.assignee)}</span>
            <span>{task.assignee.split(" ")[0]}</span>
          </div>

          <span className={`tasks-due-date ${isOverdue(task) ? "overdue" : ""}`}>
            <CalendarDays size={14} />
            {formatDate(task.dueDate)}
          </span>
        </div>
      </article>
    );
  }

  return (
    <div className="tasks-page">
      <AppSidebar />

      <main className="tasks-main">
        <div className="tasks-content">
          <header className="tasks-header">
            <div>
              <div className="tasks-breadcrumb">Workspace / Tasks</div>
              <h1>Tasks</h1>
              <p>Plan work, track progress, and keep your team moving.</p>
            </div>

            <button
              type="button"
              className="tasks-primary-button"
              onClick={openCreateModal}
            >
              <Plus size={18} />
              Create Task
            </button>
          </header>

          <section className="tasks-stats">
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <article className="tasks-stat-card" key={stat.label}>
                  <div className={`tasks-stat-icon ${stat.color}`}>
                    <Icon size={20} />
                  </div>
                  <div>
                    <span>{stat.label}</span>
                    <strong>{stat.value}</strong>
                  </div>
                </article>
              );
            })}
          </section>

          <section className="tasks-workspace">
            <div className="tasks-toolbar">
              <div className="tasks-toolbar-heading">
                <div>
                  <h2>Task Board</h2>
                  <p>Organize and manage your team's workload.</p>
                </div>
                <span className="tasks-total-badge">
                  {filteredTasks.length} tasks
                </span>
              </div>

              <div className="tasks-controls">
                <div className="tasks-search">
                  <Search size={17} />
                  <input
                    type="search"
                    placeholder="Search tasks..."
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    aria-label="Search tasks"
                  />
                  {search && (
                    <button
                      type="button"
                      aria-label="Clear search"
                      onClick={() => setSearch("")}
                    >
                      <X size={15} />
                    </button>
                  )}
                </div>

                <label className="tasks-filter">
                  <span className="sr-only">Filter by status</span>
                  <select
                    value={statusFilter}
                    onChange={(event) => setStatusFilter(event.target.value)}
                  >
                    <option>All Statuses</option>
                    {taskStatuses.map((status) => (
                      <option key={status}>{status}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} />
                </label>

                <label className="tasks-filter">
                  <span className="sr-only">Filter by priority</span>
                  <select
                    value={priorityFilter}
                    onChange={(event) => setPriorityFilter(event.target.value)}
                  >
                    <option>All Priorities</option>
                    {taskPriorities.map((priority) => (
                      <option key={priority}>{priority}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} />
                </label>

                <div className="tasks-view-toggle">
                  <button
                    type="button"
                    className={view === "board" ? "active" : ""}
                    onClick={() => setView("board")}
                    aria-label="Board view"
                    title="Board view"
                  >
                    <LayoutGrid size={17} />
                  </button>
                  <button
                    type="button"
                    className={view === "list" ? "active" : ""}
                    onClick={() => setView("list")}
                    aria-label="List view"
                    title="List view"
                  >
                    <List size={18} />
                  </button>
                </div>
              </div>
            </div>

            {view === "board" ? (
              <div className="tasks-board">
                {columns.map((column) => {
                  const Icon = column.icon;
                  const columnTasks = filteredTasks.filter(
                    (task) => task.status === column.name
                  );

                  return (
                    <section
                      className="tasks-column"
                      key={column.name}
                    >
                      <div className="tasks-column-header">
                        <div className="tasks-column-name">
                          <span className={`tasks-column-dot ${column.color}`} />
                          <h3>{column.name}</h3>
                          <span className="tasks-column-count">
                            {columnTasks.length}
                          </span>
                        </div>

                        <button
                          type="button"
                          className="tasks-add-small"
                          onClick={() => {
                            setForm({
                              ...emptyTask,
                              status: column.name,
                            });
                            setEditingId(null);
                            setError("");
                            setShowModal(true);
                          }}
                          aria-label={`Add task to ${column.name}`}
                        >
                          <Plus size={17} />
                        </button>
                      </div>

                      <div className="tasks-column-body">
                        {columnTasks.map((task) => (
                          <TaskCard task={task} key={task.id} />
                        ))}

                        {columnTasks.length === 0 && (
                          <div className="tasks-column-empty">
                            <Icon size={20} />
                            <span>No tasks here</span>
                          </div>
                        )}

                        <button
                          type="button"
                          className="tasks-add-task"
                          onClick={() => {
                            setForm({ ...emptyTask, status: column.name });
                            setEditingId(null);
                            setError("");
                            setShowModal(true);
                          }}
                        >
                          <Plus size={15} /> Add task
                        </button>
                      </div>
                    </section>
                  );
                })}
              </div>
            ) : (
              <div className="tasks-list-view">
                <div className="tasks-list-head">
                  <span>Task</span>
                  <span>Assignee</span>
                  <span>Priority</span>
                  <span>Status</span>
                  <span>Due date</span>
                  <span>Actions</span>
                </div>

                {filteredTasks.map((task) => (
                  <div className="tasks-list-row" key={task.id}>
                    <button
                      type="button"
                      className="tasks-list-title"
                      onClick={() => openEditModal(task)}
                    >
                      <strong>{task.title}</strong>
                      <small>{task.project}</small>
                    </button>
                    <span className="tasks-list-assignee">
                      <span className="tasks-avatar">
                        {initials(task.assignee)}
                      </span>
                      {task.assignee}
                    </span>
                    <span className={`tasks-priority ${task.priority.toLowerCase()}`}>
                      <span />
                      {task.priority}
                    </span>
                    <select
                      className="tasks-status-select"
                      value={task.status}
                      onChange={(event) =>
                        updateStatus(task.id, event.target.value)
                      }
                      aria-label={`Status for ${task.title}`}
                    >
                      {taskStatuses.map((status) => (
                        <option key={status}>{status}</option>
                      ))}
                    </select>
                    <span className={`tasks-due-date ${isOverdue(task) ? "overdue" : ""}`}>
                      {formatDate(task.dueDate)}
                    </span>
                    <button
                      type="button"
                      className="tasks-icon-button"
                      aria-label={`Edit ${task.title}`}
                      onClick={() => openEditModal(task)}
                    >
                      <Pencil size={16} />
                    </button>
                  </div>
                ))}

                {filteredTasks.length === 0 && (
                  <div className="tasks-list-empty">
                    No tasks match your search or filters.
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      </main>

      {showModal && (
        <div
          className="tasks-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setShowModal(false);
              setError("");
            }
          }}
        >
          <section
            className="tasks-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="tasks-modal-title"
          >
            <div className="tasks-modal-top">
              <div className="tasks-modal-icon">
                <ClipboardList size={21} />
              </div>
              <button
                type="button"
                className="tasks-modal-close"
                aria-label="Close form"
                onClick={() => {
                  setShowModal(false);
                  setError("");
                }}
              >
                <X size={20} />
              </button>
            </div>

            <h2 id="tasks-modal-title">
              {editingId !== null ? "Edit task" : "Create a new task"}
            </h2>
            <p className="tasks-modal-subtitle">
              Add the details and assign the work to a teammate.
            </p>

            <form className="tasks-form" onSubmit={saveTask}>
              <label>
                Task title *
                <input
                  autoFocus
                  value={form.title}
                  onChange={(event) => updateField("title", event.target.value)}
                  placeholder="What needs to be done?"
                  required
                />
              </label>

              <label>
                Description
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(event) =>
                    updateField("description", event.target.value)
                  }
                  placeholder="Add details about this task..."
                />
              </label>

              <label>
                Project
                <input
                  value={form.project}
                  onChange={(event) => updateField("project", event.target.value)}
                  placeholder="Project name"
                />
              </label>

              <div className="tasks-form-grid">
                <label>
                  Assignee
                  <select
                    value={form.assignee}
                    onChange={(event) =>
                      updateField("assignee", event.target.value)
                    }
                  >
                    {teamMembers.map((member) => (
                      <option key={member}>{member}</option>
                    ))}
                  </select>
                </label>

                <label>
                  Priority
                  <select
                    value={form.priority}
                    onChange={(event) =>
                      updateField("priority", event.target.value)
                    }
                  >
                    {taskPriorities.map((priority) => (
                      <option key={priority}>{priority}</option>
                    ))}
                  </select>
                </label>

                <label>
                  Status
                  <select
                    value={form.status}
                    onChange={(event) => updateField("status", event.target.value)}
                  >
                    {taskStatuses.map((status) => (
                      <option key={status}>{status}</option>
                    ))}
                  </select>
                </label>

                <label>
                  Due date
                  <input
                    type="date"
                    value={form.dueDate}
                    onChange={(event) =>
                      updateField("dueDate", event.target.value)
                    }
                  />
                </label>
              </div>

              {error && (
                <p className="tasks-form-error" role="alert">
                  {error}
                </p>
              )}

              <div className="tasks-modal-actions">
                <button
                  type="button"
                  className="tasks-cancel-button"
                  onClick={() => {
                    setShowModal(false);
                    setError("");
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="tasks-primary-button">
                  <Plus size={16} />
                  {editingId !== null ? "Save changes" : "Create task"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}

export default Tasks;
