// src/component/AdminTasks/AdminTasks.jsx

import React, { useEffect, useMemo, useState } from "react";

import {
  Search,
  Plus,
  ListChecks,
  Clock3,
  CircleCheckBig,
  AlertTriangle,
  Filter,
  MoreVertical,
  Pencil,
  Trash2,
  X,
  UserRound,
  FolderKanban,
  Building2,
  CalendarDays,
  ChevronDown,
  CheckCircle2,
  RotateCcw,
} from "lucide-react";

import AdminSidebar from "../../../layouts/AdminSidebar/AdminSidebar.jsx";

import "./AdminTasks.css";

import {
  initialAdminTasks,
  taskStatusOptions,
  taskPriorityOptions,
  taskAssignees,
  taskProjects,
  taskWorkspaces,
} from "./adminTasksData.js";

const STORAGE_KEY = "teamflow_admin_tasks";

const emptyTask = {
  title: "",
  project: "",
  workspace: "",
  assignee: "",
  assigneeEmail: "",
  priority: "Medium",
  status: "To Do",
  dueDate: "",
};

function AdminTasks() {
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (saved) {
        return JSON.parse(saved);
      }

      return initialAdminTasks;
    } catch {
      return initialAdminTasks;
    }
  });

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");

  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const [form, setForm] = useState(emptyTask);

  const [openMenu, setOpenMenu] = useState(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const value = search.toLowerCase().trim();

      const matchesSearch =
        !value ||
        task.title.toLowerCase().includes(value) ||
        task.id.toLowerCase().includes(value) ||
        task.assignee.toLowerCase().includes(value) ||
        task.project.toLowerCase().includes(value) ||
        task.workspace.toLowerCase().includes(value);

      const matchesStatus =
        statusFilter === "All" ||
        task.status === statusFilter;

      const matchesPriority =
        priorityFilter === "All" ||
        task.priority === priorityFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPriority
      );
    });
  }, [tasks, search, statusFilter, priorityFilter]);

  const totalTasks = tasks.length;

  const inProgressTasks = tasks.filter(
    (task) => task.status === "In Progress"
  ).length;

  const completedTasks = tasks.filter(
    (task) => task.status === "Completed"
  ).length;

  const criticalTasks = tasks.filter(
    (task) => task.priority === "Critical"
  ).length;

  const openCreateModal = () => {
    setEditingTask(null);
    setForm(emptyTask);
    setShowModal(true);
  };

  const openEditModal = (task) => {
    setEditingTask(task);

    setForm({
      title: task.title,
      project: task.project,
      workspace: task.workspace,
      assignee: task.assignee,
      assigneeEmail: task.assigneeEmail,
      priority: task.priority,
      status: task.status,
      dueDate: task.dueDate,
    });

    setOpenMenu(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingTask(null);
    setForm(emptyTask);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    if (name === "assignee") {
      const selectedUser = taskAssignees.find(
        (user) => user.name === value
      );

      setForm((previous) => ({
        ...previous,
        assignee: value,
        assigneeEmail: selectedUser?.email || "",
      }));

      return;
    }

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (
      !form.title.trim() ||
      !form.project ||
      !form.workspace ||
      !form.assignee ||
      !form.dueDate
    ) {
      alert("Please complete all required fields.");
      return;
    }

    if (editingTask) {
      setTasks((previous) =>
        previous.map((task) =>
          task.id === editingTask.id
            ? {
                ...task,
                ...form,
              }
            : task
        )
      );
    } else {
      const newTask = {
        id: `TSK-${Date.now()
          .toString()
          .slice(-5)}`,

        ...form,

        createdAt: new Date()
          .toISOString()
          .split("T")[0],
      };

      setTasks((previous) => [
        newTask,
        ...previous,
      ]);
    }

    closeModal();
  };

  const deleteTask = (taskId) => {
    const task = tasks.find(
      (item) => item.id === taskId
    );

    const confirmed = window.confirm(
      `Delete "${task?.title}"?`
    );

    if (!confirmed) return;

    setTasks((previous) =>
      previous.filter(
        (taskItem) =>
          taskItem.id !== taskId
      )
    );

    setOpenMenu(null);
  };

  const changeTaskStatus = (
    taskId,
    newStatus
  ) => {
    setTasks((previous) =>
      previous.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status: newStatus,
            }
          : task
      )
    );
  };

  const resetDemoData = () => {
    const confirmed = window.confirm(
      "Reset all Admin Tasks to demo data?"
    );

    if (!confirmed) return;

    setTasks(initialAdminTasks);
    setSearch("");
    setStatusFilter("All");
    setPriorityFilter("All");
  };

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("All");
    setPriorityFilter("All");
  };

  return (
    <div className="admin-tasks-shell">
      <AdminSidebar />

      <main className="admin-tasks-main">
        {/* TOP NAVBAR */}

        <header className="admin-tasks-topbar">
          <div className="admin-tasks-global-search">
            <Search size={17} />

            <input
              type="text"
              placeholder="Search users, workspaces, projects, or anything..."
            />

            <span>Ctrl + K</span>
          </div>

          <div className="admin-tasks-top-actions">
            <button
              type="button"
              className="admin-tasks-create-top"
              onClick={openCreateModal}
            >
              <Plus size={18} />
              Create
              <ChevronDown size={15} />
            </button>

            <div className="admin-tasks-profile">
              <div className="admin-tasks-avatar">
                HR
              </div>

              <div>
                <strong>Himanshu</strong>
                <span>
                  Super Administrator
                </span>
              </div>

              <ChevronDown size={15} />
            </div>
          </div>
        </header>

        {/* PAGE */}

        <div className="admin-tasks-content">
          <section className="admin-tasks-page-header">
            <div>
              <div className="admin-tasks-breadcrumb">
                <ListChecks size={15} />

                <span>
                  ADMIN / TASKS
                </span>
              </div>

              <h1>
                Task Management
              </h1>

              <p>
                Manage and monitor tasks
                across all TeamFlow AI
                workspaces.
              </p>
            </div>

            <button
              type="button"
              className="admin-tasks-primary-button"
              onClick={openCreateModal}
            >
              <Plus size={17} />
              Create Task
            </button>
          </section>

          {/* STATS */}

          <section className="admin-tasks-stats">
            <StatCard
              icon={ListChecks}
              label="Total Tasks"
              value={totalTasks}
              description="Across all workspaces"
              type="purple"
            />

            <StatCard
              icon={Clock3}
              label="In Progress"
              value={inProgressTasks}
              description="Currently active"
              type="blue"
            />

            <StatCard
              icon={CircleCheckBig}
              label="Completed"
              value={completedTasks}
              description="Successfully completed"
              type="green"
            />

            <StatCard
              icon={AlertTriangle}
              label="Critical Tasks"
              value={criticalTasks}
              description="Require attention"
              type="red"
            />
          </section>

          {/* FILTERS */}

          <section className="admin-tasks-toolbar">
            <div className="admin-tasks-search-box">
              <Search size={17} />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Search task, project, workspace or assignee..."
              />
            </div>

            <div className="admin-tasks-filter">
              <Filter size={16} />

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(
                    event.target.value
                  )
                }
              >
                <option value="All">
                  All Status
                </option>

                {taskStatusOptions.map(
                  (status) => (
                    <option
                      key={status}
                      value={status}
                    >
                      {status}
                    </option>
                  )
                )}
              </select>
            </div>

            <select
              className="admin-tasks-select"
              value={priorityFilter}
              onChange={(event) =>
                setPriorityFilter(
                  event.target.value
                )
              }
            >
              <option value="All">
                All Priority
              </option>

              {taskPriorityOptions.map(
                (priority) => (
                  <option
                    key={priority}
                    value={priority}
                  >
                    {priority}
                  </option>
                )
              )}
            </select>

            <button
              type="button"
              className="admin-tasks-reset-button"
              onClick={clearFilters}
            >
              Clear
            </button>
          </section>

          {/* RESULTS */}

          <div className="admin-tasks-results-row">
            <span>
              Showing{" "}
              <strong>
                {filteredTasks.length}
              </strong>{" "}
              of{" "}
              <strong>
                {tasks.length}
              </strong>{" "}
              tasks
            </span>

            <button
              type="button"
              onClick={resetDemoData}
            >
              <RotateCcw size={14} />
              Reset Demo Data
            </button>
          </div>

          {/* TABLE */}

          <section className="admin-tasks-table-card">
            <div className="admin-tasks-table-scroll">
              <table className="admin-tasks-table">
                <thead>
                  <tr>
                    <th>Task</th>
                    <th>Project</th>
                    <th>Workspace</th>
                    <th>Assignee</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Due Date</th>
                    <th />
                  </tr>
                </thead>

                <tbody>
                  {filteredTasks.length >
                  0 ? (
                    filteredTasks.map(
                      (task) => (
                        <tr key={task.id}>
                          <td>
                            <div className="admin-task-name-cell">
                              <div className="admin-task-check-icon">
                                <ListChecks
                                  size={17}
                                />
                              </div>

                              <div>
                                <strong>
                                  {
                                    task.title
                                  }
                                </strong>

                                <span>
                                  {task.id}
                                </span>
                              </div>
                            </div>
                          </td>

                          <td>
                            <div className="admin-task-simple-cell">
                              <FolderKanban
                                size={15}
                              />
                              {
                                task.project
                              }
                            </div>
                          </td>

                          <td>
                            <div className="admin-task-simple-cell">
                              <Building2
                                size={15}
                              />
                              {
                                task.workspace
                              }
                            </div>
                          </td>

                          <td>
                            <div className="admin-task-user-cell">
                              <div className="admin-task-user-avatar">
                                {getInitials(
                                  task.assignee
                                )}
                              </div>

                              <div>
                                <strong>
                                  {
                                    task.assignee
                                  }
                                </strong>

                                <span>
                                  {
                                    task.assigneeEmail
                                  }
                                </span>
                              </div>
                            </div>
                          </td>

                          <td>
                            <PriorityBadge
                              priority={
                                task.priority
                              }
                            />
                          </td>

                          <td>
                            <select
                              className={`admin-task-status-select ${getStatusClass(
                                task.status
                              )}`}
                              value={
                                task.status
                              }
                              onChange={(
                                event
                              ) =>
                                changeTaskStatus(
                                  task.id,
                                  event
                                    .target
                                    .value
                                )
                              }
                            >
                              {taskStatusOptions.map(
                                (
                                  status
                                ) => (
                                  <option
                                    key={
                                      status
                                    }
                                    value={
                                      status
                                    }
                                  >
                                    {
                                      status
                                    }
                                  </option>
                                )
                              )}
                            </select>
                          </td>

                          <td>
                            <div className="admin-task-date">
                              <CalendarDays
                                size={15}
                              />

                              {formatDate(
                                task.dueDate
                              )}
                            </div>
                          </td>

                          <td className="admin-task-action-cell">
                            <button
                              type="button"
                              className="admin-task-more-button"
                              onClick={() =>
                                setOpenMenu(
                                  openMenu ===
                                    task.id
                                    ? null
                                    : task.id
                                )
                              }
                            >
                              <MoreVertical
                                size={18}
                              />
                            </button>

                            {openMenu ===
                              task.id && (
                              <div className="admin-task-menu">
                                <button
                                  type="button"
                                  onClick={() =>
                                    openEditModal(
                                      task
                                    )
                                  }
                                >
                                  <Pencil
                                    size={
                                      15
                                    }
                                  />
                                  Edit Task
                                </button>

                                <button
                                  type="button"
                                  onClick={() =>
                                    changeTaskStatus(
                                      task.id,
                                      "Completed"
                                    )
                                  }
                                >
                                  <CheckCircle2
                                    size={
                                      15
                                    }
                                  />
                                  Mark
                                  Completed
                                </button>

                                <button
                                  type="button"
                                  className="danger"
                                  onClick={() =>
                                    deleteTask(
                                      task.id
                                    )
                                  }
                                >
                                  <Trash2
                                    size={
                                      15
                                    }
                                  />
                                  Delete Task
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      )
                    )
                  ) : (
                    <tr>
                      <td
                        colSpan="8"
                        className="admin-tasks-empty"
                      >
                        <ListChecks
                          size={40}
                        />

                        <h3>
                          No tasks found
                        </h3>

                        <p>
                          Try changing
                          your search or
                          filter.
                        </p>

                        <button
                          type="button"
                          className="admin-tasks-primary-button"
                          onClick={
                            clearFilters
                          }
                        >
                          Clear Filters
                        </button>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>

      {/* CREATE / EDIT MODAL */}

      {showModal && (
        <div
          className="admin-task-modal-overlay"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              closeModal();
            }
          }}
        >
          <div className="admin-task-modal">
            <div className="admin-task-modal-header">
              <div>
                <h2>
                  {editingTask
                    ? "Edit Task"
                    : "Create New Task"}
                </h2>

                <p>
                  {editingTask
                    ? "Update task information."
                    : "Create a new task for a TeamFlow workspace."}
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="admin-task-form"
            >
              <div className="admin-task-field admin-task-field-full">
                <label>
                  Task Title *
                </label>

                <div className="admin-task-input-wrap">
                  <ListChecks
                    size={17}
                  />

                  <input
                    name="title"
                    value={form.title}
                    onChange={
                      handleInputChange
                    }
                    placeholder="Enter task title"
                  />
                </div>
              </div>

              <div className="admin-task-form-grid">
                <div className="admin-task-field">
                  <label>
                    Project *
                  </label>

                  <select
                    name="project"
                    value={form.project}
                    onChange={
                      handleInputChange
                    }
                  >
                    <option value="">
                      Select Project
                    </option>

                    {taskProjects.map(
                      (project) => (
                        <option
                          key={
                            project
                          }
                          value={
                            project
                          }
                        >
                          {project}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div className="admin-task-field">
                  <label>
                    Workspace *
                  </label>

                  <select
                    name="workspace"
                    value={
                      form.workspace
                    }
                    onChange={
                      handleInputChange
                    }
                  >
                    <option value="">
                      Select Workspace
                    </option>

                    {taskWorkspaces.map(
                      (workspace) => (
                        <option
                          key={
                            workspace
                          }
                          value={
                            workspace
                          }
                        >
                          {
                            workspace
                          }
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div className="admin-task-field">
                  <label>
                    Assignee *
                  </label>

                  <select
                    name="assignee"
                    value={
                      form.assignee
                    }
                    onChange={
                      handleInputChange
                    }
                  >
                    <option value="">
                      Select User
                    </option>

                    {taskAssignees.map(
                      (user) => (
                        <option
                          key={
                            user.email
                          }
                          value={
                            user.name
                          }
                        >
                          {user.name}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div className="admin-task-field">
                  <label>
                    Priority
                  </label>

                  <select
                    name="priority"
                    value={
                      form.priority
                    }
                    onChange={
                      handleInputChange
                    }
                  >
                    {taskPriorityOptions.map(
                      (priority) => (
                        <option
                          key={
                            priority
                          }
                          value={
                            priority
                          }
                        >
                          {priority}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div className="admin-task-field">
                  <label>
                    Status
                  </label>

                  <select
                    name="status"
                    value={form.status}
                    onChange={
                      handleInputChange
                    }
                  >
                    {taskStatusOptions.map(
                      (status) => (
                        <option
                          key={status}
                          value={
                            status
                          }
                        >
                          {status}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div className="admin-task-field">
                  <label>
                    Due Date *
                  </label>

                  <input
                    type="date"
                    name="dueDate"
                    value={
                      form.dueDate
                    }
                    onChange={
                      handleInputChange
                    }
                  />
                </div>
              </div>

              <div className="admin-task-modal-actions">
                <button
                  type="button"
                  className="admin-task-cancel-button"
                  onClick={closeModal}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="admin-tasks-primary-button"
                >
                  {editingTask ? (
                    <>
                      <Pencil
                        size={16}
                      />
                      Save Changes
                    </>
                  ) : (
                    <>
                      <Plus size={16} />
                      Create Task
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  description,
  type,
}) {
  return (
    <article className="admin-task-stat-card">
      <div
        className={`admin-task-stat-icon ${type}`}
      >
        <Icon size={22} />
      </div>

      <div>
        <span>{label}</span>
        <strong>{value}</strong>
        <small>
          {description}
        </small>
      </div>
    </article>
  );
}

function PriorityBadge({ priority }) {
  return (
    <span
      className={`admin-task-priority ${priority.toLowerCase()}`}
    >
      {priority}
    </span>
  );
}

function getInitials(name) {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function getStatusClass(status) {
  return status
    .toLowerCase()
    .replaceAll(" ", "-");
}

function formatDate(value) {
  if (!value) return "Not set";

  const date = new Date(
    `${value}T00:00:00`
  );

  return date.toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  );
}

export default AdminTasks;