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

function isValidDateString(date) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;

  const [year, month, day] = date.split("-").map(Number);
  const parsedDate = new Date(Date.UTC(year, month - 1, day));

  return (
    parsedDate.getUTCFullYear() === year &&
    parsedDate.getUTCMonth() === month - 1 &&
    parsedDate.getUTCDate() === day
  );
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
        task.title || "",
        task.description || "",
        task.project || "",
        task.assignee || "",
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

  function openCreateModal(defaultStatus = emptyTask.status) {
    setEditingId(null);
    setForm({ ...emptyTask, status: defaultStatus });
    setError("");
    setShowModal(true);
  }

  function openEditModal(task) {
    setEditingId(task.id);
    setForm({
      title: task.title || "",
      description: task.description || "",
      project: task.project || "",
      assignee: task.assignee || teamMembers[0],
      status: task.status || "To Do",
      priority: task.priority || "Medium",
      dueDate: task.dueDate || "",
    });
    setError("");
    setOpenMenu(null);
    setShowModal(true);
  }

  function saveTask(event) {
    event.preventDefault();
    setError("");

    const title = form.title.trim();
    const description = form.description.trim();
    const project = form.project.trim();

    // 1. Task title validation
    if (!title) {
      setError("Task title is required.");
      return;
    }

    if (title.length > 100) {
      setError("Task title cannot exceed 100 characters.");
      return;
    }

    // 2. Description validation
    if (description.length > 1000) {
      setError("Description cannot exceed 1,000 characters.");
      return;
    }

    // 3. Project validation
    if (!project) {
      setError("Please enter a project name.");
      return;
    }

    if (project.length > 100) {
      setError("Project name cannot exceed 100 characters.");
      return;
    }

    // 4. Assignee validation
    if (!teamMembers.includes(form.assignee)) {
      setError("Please select a valid team member.");
      return;
    }

    // 5. Priority validation
    if (!taskPriorities.includes(form.priority)) {
      setError("Please select a valid task priority.");
      return;
    }

    // 6. Status validation
    if (!taskStatuses.includes(form.status)) {
      setError("Please select a valid task status.");
      return;
    }

    // 7. Due date validation
    if (form.dueDate) {
      if (!isValidDateString(form.dueDate)) {
        setError("Please select a valid due date.");
        return;
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const selectedDate = new Date(`${form.dueDate}T00:00:00`);

      if (selectedDate < today) {
        setError("Past due dates are not allowed. Please select today or a future date.");
        return;
      }
    }

    // 8. Duplicate task validation
    const duplicateTask = tasks.some((task) => {
      const sameTitle =
        (task.title || "").trim().toLowerCase() === title.toLowerCase();

      const sameProject =
        (task.project || "").trim().toLowerCase() === project.toLowerCase();

      const isDifferentTask = task.id !== editingId;

      return sameTitle && sameProject && isDifferentTask;
    });

    if (duplicateTask) {
      setError("A task with this title already exists in this project.");
      return;
    }

    // Save validated and normalized data
    const validatedTask = {
      ...form,
      title,
      description,
      project,
    };

    if (editingId !== null) {
      setTasks((previous) =>
        previous.map((task) =>
          task.id === editingId ? { ...task, ...validatedTask } : task
        )
      );
    } else {
      setTasks((previous) => [
        { ...validatedTask, id: Date.now() },
        ...previous,
      ]);
    }

    setShowModal(false);
    setForm({ ...emptyTask });
    setEditingId(null);
    setError("");
  }

  function updateStatus(id, status) {
    if (!taskStatuses.includes(status)) return;

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

  function closeModal() {
    setShowModal(false);
    setError("");
    setEditingId(null);
    setForm({ ...emptyTask });
  }

  function TaskCard({ task }) {
    return (
      <article className="tasks-card">
        <div className="tasks-card-top">
          <span className={`tasks-priority ${(task.priority || "Medium").toLowerCase()}`}>
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
            <span>{(task.assignee || "Unassigned").split(" ")[0]}</span>
          </div>

          <span
            className={`tasks-due-date ${isOverdue(task) ? "overdue" : ""}`}
          >
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
              onClick={() => openCreateModal()}
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
                    <section className="tasks-column" key={column.name}>
                      <div className="tasks-column-header">
                        <div className="tasks-column-name">
                          <span
                            className={`tasks-column-dot ${column.color}`}
                          />

                          <h3>{column.name}</h3>

                          <span className="tasks-column-count">
                            {columnTasks.length}
                          </span>
                        </div>

                        <button
                          type="button"
                          className="tasks-add-small"
                          onClick={() => openCreateModal(column.name)}
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
                          onClick={() => openCreateModal(column.name)}
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

                    <span
                      className={`tasks-priority ${(task.priority || "Medium").toLowerCase()}`}
                    >
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

                    <span
                      className={`tasks-due-date ${isOverdue(task) ? "overdue" : ""}`}
                    >
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
              closeModal();
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
                onClick={closeModal}
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
                  onChange={(event) =>
                    updateField("title", event.target.value)
                  }
                  placeholder="What needs to be done?"
                  maxLength={100}
                  required
                  aria-invalid={Boolean(error)}
                />
                <small>{form.title.length}/100 characters</small>
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
                  maxLength={1000}
                />
                <small>{form.description.length}/1000 characters</small>
              </label>

              <label>
                Project *
                <input
                  value={form.project}
                  onChange={(event) =>
                    updateField("project", event.target.value)
                  }
                  placeholder="Project name"
                  maxLength={100}
                  required
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
                      <option key={member} value={member}>
                        {member}
                      </option>
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
                      <option key={priority} value={priority}>
                        {priority}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  Status
                  <select
                    value={form.status}
                    onChange={(event) =>
                      updateField("status", event.target.value)
                    }
                  >
                    {taskStatuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  Due date
                  <input
                    type="date"
                    value={form.dueDate}
                    min={new Date().toLocaleDateString("en-CA")}
                    onChange={(event) => {
                      const selectedDate = event.target.value;

                      if (!selectedDate) {
                        updateField("dueDate", "");
                        return;
                      }

                      const today = new Date();
                      today.setHours(0, 0, 0, 0);

                      const chosenDate = new Date(`${selectedDate}T00:00:00`);

                      if (chosenDate < today) {
                        setError("Past due dates are not allowed. Please select today or a future date.");
                        return;
                      }

                      updateField("dueDate", selectedDate);
                    }}
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
                  onClick={closeModal}
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