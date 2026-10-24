import { useMemo, useState } from "react";
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  CircleDashed,
  ClipboardList,
  Clock3,
  FolderKanban,
  ListFilter,
  Plus,
  Search,
  UserRound,
  X,
} from "lucide-react";
import {
  initialTasks,
  taskPriorities,
  taskStatuses,
  teamMembers,
} from "../Employee/tasksData.js";
import "./Task.css";

const TASKS_STORAGE_KEY = "teamflow_teamlead_tasks";

const COLUMNS = [
  { name: "To Do", className: "todo", icon: ClipboardList },
  { name: "In Progress", className: "progress", icon: Clock3 },
  { name: "In Review", className: "review", icon: AlertCircle },
  { name: "Done", className: "done", icon: CheckCircle2 },
];

const PRIORITIES = ["All Priorities", "Urgent", "High", "Medium", "Low"];

function getInitials(name = "") {
  return name
    .trim()
    .split(/\s+/)
    .map(part => part[0] || "")
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function formatDate(date) {
  if (!date) return "No due date";

  const parsedDate = new Date(`${date}T12:00:00`);
  if (Number.isNaN(parsedDate.getTime())) return "No due date";

  return parsedDate.toLocaleDateString("en-US", {
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

function getSavedTasks() {
  try {
    const savedTasks = localStorage.getItem(TASKS_STORAGE_KEY);
    if (!savedTasks) return initialTasks;

    const parsedTasks = JSON.parse(savedTasks);
    if (!Array.isArray(parsedTasks)) {
      throw new TypeError("Saved Team Lead tasks must be an array.");
    }

    return parsedTasks;
  } catch (error) {
    console.error("Failed to load Team Lead tasks:", error);
    return initialTasks;
  }
}

export default function Task() {
  const [tasks, setTasks] = useState(getSavedTasks);
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("All Priorities");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formError, setFormError] = useState("");
  const [storageError, setStorageError] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    project: "",
    assignee: teamMembers[0] || "",
    priority: "Medium",
    dueDate: "",
  });

  function saveTasks(nextTasks) {
    setTasks(nextTasks);
    try {
      localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(nextTasks));
      setStorageError(false);
    } catch (error) {
      console.error("Failed to save Team Lead tasks:", error);
      setStorageError(true);
    }
  }

  const stats = useMemo(() => ({
    total: tasks.length,
    inProgress: tasks.filter(task => task.status === "In Progress").length,
    completed: tasks.filter(task => task.status === "Done").length,
    overdue: tasks.filter(isOverdue).length,
  }), [tasks]);

  const filteredTasks = useMemo(() => {
    const query = search.trim().toLowerCase();
    return tasks.filter(task => {
      const matchesSearch = !query
        || task.title.toLowerCase().includes(query)
        || task.description.toLowerCase().includes(query)
        || task.project.toLowerCase().includes(query)
        || task.assignee.toLowerCase().includes(query);
      const matchesPriority = priorityFilter === "All Priorities"
        || task.priority === priorityFilter;
      return matchesSearch && matchesPriority;
    });
  }, [tasks, search, priorityFilter]);

  function updateStatus(id, status) {
    if (!taskStatuses.includes(status)) return;
    saveTasks(tasks.map(task => (
      task.id === id ? { ...task, status } : task
    )));
  }

  function updateAssignee(id, assignee) {
    saveTasks(tasks.map(task => (
      task.id === id ? { ...task, assignee } : task
    )));
  }

  function handleCreateTask(event) {
    event.preventDefault();
    const title = newTask.title.trim();
    const project = newTask.project.trim();

    if (!title || !project || !newTask.assignee) {
      setFormError("Add a task name, project, and team member before assigning.");
      return;
    }

    saveTasks([{
      id: `lead-${Date.now()}`,
      title,
      description: newTask.description.trim(),
      project,
      assignee: newTask.assignee,
      status: "To Do",
      priority: newTask.priority,
      dueDate: newTask.dueDate,
    }, ...tasks]);
    setNewTask({
      title: "",
      description: "",
      project: "",
      assignee: teamMembers[0] || "",
      priority: "Medium",
      dueDate: "",
    });
    setFormError("");
    setIsCreateOpen(false);
  }

  return (
    <section className="tl-task-page">
      <header className="tl-task-header">
        <div>
          <span className="tl-task-eyebrow">TEAM WORKSPACE / WORK MANAGEMENT</span>
          <h1>Tasks</h1>
          <p>Plan the work, assign clear owners, and keep every project moving.</p>
        </div>
        <button className="tl-task-create-button" type="button" onClick={() => setIsCreateOpen(true)}>
          <Plus size={18} aria-hidden="true" />
          Assign a task
        </button>
      </header>

      {storageError && (
        <p className="tl-task-storage-warning" role="status">
          Changes are available for this session but could not be saved in this browser.
        </p>
      )}

      <section className="tl-task-stats" aria-label="Task summary">
        <article className="tl-task-stat">
          <span className="tl-task-stat-icon purple"><ClipboardList size={20} /></span>
          <div><small>Total Tasks</small><b>{stats.total}</b><span>Across all projects</span></div>
        </article>
        <article className="tl-task-stat">
          <span className="tl-task-stat-icon blue"><CircleDashed size={20} /></span>
          <div><small>In Progress</small><b>{stats.inProgress}</b><span>Currently being worked on</span></div>
        </article>
        <article className="tl-task-stat">
          <span className="tl-task-stat-icon green"><CheckCircle2 size={20} /></span>
          <div><small>Completed</small><b>{stats.completed}</b><span>Tasks finished</span></div>
        </article>
        <article className="tl-task-stat">
          <span className="tl-task-stat-icon orange"><AlertCircle size={20} /></span>
          <div><small>Overdue</small><b>{stats.overdue}</b><span>Needs attention</span></div>
        </article>
      </section>

      <section className="tl-task-board">
        <div className="tl-task-board-header">
          <div>
            <h2>Team task board <span>{filteredTasks.length}</span></h2>
            <p>Track ownership and progress across your team.</p>
          </div>
          <div className="tl-task-controls">
            <label className="tl-task-search">
              <Search size={17} aria-hidden="true" />
              <input
                type="search"
                placeholder="Search tasks, projects, or people"
                value={search}
                onChange={event => setSearch(event.target.value)}
              />
            </label>
            <label className="tl-task-priority-filter">
              <ListFilter size={16} aria-hidden="true" />
              <span className="tl-task-sr-only">Filter by priority</span>
              <select
                value={priorityFilter}
                onChange={event => setPriorityFilter(event.target.value)}
              >
                {PRIORITIES.map(priority => <option key={priority}>{priority}</option>)}
              </select>
            </label>
          </div>
        </div>

        <div className="tl-task-columns">
          {COLUMNS.map(({ name, className, icon: Icon }) => {
            const columnTasks = filteredTasks.filter(task => task.status === name);

            return (
              <section className={`tl-task-column ${className}`} key={name}>
                <header className="tl-task-column-header">
                  <div>
                    <Icon size={17} aria-hidden="true" />
                    <h3>{name}</h3>
                    <span>{columnTasks.length}</span>
                  </div>
                </header>

                <div className="tl-task-column-content">
                  {columnTasks.length > 0 ? columnTasks.map(task => (
                    <article className="tl-task-card" key={task.id}>
                      <div className="tl-task-card-top">
                        <span className={`tl-task-priority ${task.priority.toLowerCase()}`}>
                          <i />
                          {task.priority}
                        </span>
                        {isOverdue(task) && <span className="tl-task-overdue">Overdue</span>}
                      </div>

                      <h4>{task.title}</h4>
                      <p className="tl-task-description">{task.description}</p>

                      <div className="tl-task-project">
                        <span className="tl-task-project-mark">{getInitials(task.project).slice(0, 1)}</span>
                        <span>{task.project}</span>
                      </div>

                      <footer className="tl-task-card-footer">
                        <label className="tl-task-assignee" title="Assign this task to a team member">
                          <span>{getInitials(task.assignee)}</span>
                          <select
                            aria-label={`Assign ${task.title} to a team member`}
                            value={task.assignee}
                            onChange={event => updateAssignee(task.id, event.target.value)}
                          >
                            {teamMembers.map(member => <option key={member}>{member}</option>)}
                          </select>
                        </label>
                        <div className={`tl-task-due${isOverdue(task) ? " overdue" : ""}`}>
                          <CalendarDays size={14} aria-hidden="true" />
                          <time dateTime={task.dueDate || undefined}>{formatDate(task.dueDate)}</time>
                        </div>
                      </footer>

                      <label className="tl-task-status-control">
                        <span>Update status</span>
                        <select
                          aria-label={`Update status for ${task.title}`}
                          value={task.status}
                          onChange={event => updateStatus(task.id, event.target.value)}
                        >
                          {taskStatuses.map(status => <option key={status}>{status}</option>)}
                        </select>
                      </label>
                    </article>
                  )) : (
                    <div className="tl-task-empty-column">No tasks here</div>
                  )}
                </div>
              </section>
            );
          })}
        </div>
      </section>

      {isCreateOpen && (
        <div className="tl-task-modal-backdrop" onMouseDown={event => {
          if (event.target === event.currentTarget) setIsCreateOpen(false);
        }}>
          <section className="tl-task-modal" role="dialog" aria-modal="true" aria-labelledby="tl-task-modal-title">
            <header className="tl-task-modal-header">
              <span className="tl-task-modal-icon"><ClipboardList size={20} /></span>
              <div>
                <h2 id="tl-task-modal-title">Assign a new task</h2>
                <p>Create the task and choose a team member to own it.</p>
              </div>
              <button type="button" className="tl-task-modal-close" aria-label="Close task form" onClick={() => setIsCreateOpen(false)}>
                <X size={19} />
              </button>
            </header>
            <form className="tl-task-form" onSubmit={handleCreateTask}>
              <label className="tl-task-form-field full">
                <span>Task name <b>*</b></span>
                <input autoFocus maxLength={100} value={newTask.title} onChange={event => setNewTask(previous => ({ ...previous, title: event.target.value }))} placeholder="e.g. Prepare the launch checklist" />
              </label>
              <label className="tl-task-form-field full">
                <span>Description</span>
                <textarea rows={3} maxLength={300} value={newTask.description} onChange={event => setNewTask(previous => ({ ...previous, description: event.target.value }))} placeholder="Add context and a clear next step for the assignee" />
              </label>
              <label className="tl-task-form-field">
                <span><FolderKanban size={15} /> Project <b>*</b></span>
                <input maxLength={60} value={newTask.project} onChange={event => setNewTask(previous => ({ ...previous, project: event.target.value }))} placeholder="Project name" />
              </label>
              <label className="tl-task-form-field">
                <span><UserRound size={15} /> Assign to <b>*</b></span>
                <select value={newTask.assignee} onChange={event => setNewTask(previous => ({ ...previous, assignee: event.target.value }))}>
                  {teamMembers.map(member => <option key={member}>{member}</option>)}
                </select>
              </label>
              <label className="tl-task-form-field">
                <span>Priority</span>
                <select value={newTask.priority} onChange={event => setNewTask(previous => ({ ...previous, priority: event.target.value }))}>
                  {taskPriorities.map(priority => <option key={priority}>{priority}</option>)}
                </select>
              </label>
              <label className="tl-task-form-field">
                <span><CalendarDays size={15} /> Due date</span>
                <input type="date" value={newTask.dueDate} onChange={event => setNewTask(previous => ({ ...previous, dueDate: event.target.value }))} />
              </label>
              {formError && <p className="tl-task-form-error" role="alert">{formError}</p>}
              <footer className="tl-task-form-actions">
                <button type="button" className="tl-task-cancel-button" onClick={() => { setIsCreateOpen(false); setFormError(""); }}>Cancel</button>
                <button type="submit" className="tl-task-create-button"><Plus size={17} /> Create and assign</button>
              </footer>
            </form>
          </section>
        </div>
      )}
    </section>
  );
}