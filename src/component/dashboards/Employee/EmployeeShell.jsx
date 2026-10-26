import React, { useState, useEffect } from "react";
import AppSidebar from "./AppSidebar";
import EmployeeTopbar from "./EmployeeTopbar";
import { getEmployeeTheme } from "./EmployeeAuth";
import { X, CheckSquare, Bug, Calendar, Plus, Network } from "lucide-react";
import "./EmployeeTokens.css";
import "./EmployeeShell.css";

function EmployeeShell({
  children,
  searchQuery,
  onSearchChange,
  activeRoute,
  searchPlaceholder,
  noScroll = false,
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState(getEmployeeTheme);
  const [createModal, setCreateModal] = useState(null); // 'task' | 'bug' | 'event' | 'project' | null

  // Task form state
  const [taskForm, setTaskForm] = useState({
    title: "",
    project: "TeamFlow Website",
    priority: "Medium",
    dueDate: new Date().toISOString().split("T")[0],
  });

  // Bug form state
  const [bugForm, setBugForm] = useState({
    title: "",
    project: "TeamFlow Website",
    severity: "Medium",
    description: "",
  });

  // Event form state
  const [eventForm, setEventForm] = useState({
    title: "",
    date: new Date().toISOString().split("T")[0],
    time: "10:00",
    category: "meeting",
  });

  // Project form state
  const [projectForm, setProjectForm] = useState({
    name: "",
    category: "UI/UX Design",
    progress: 10,
  });

  // Theme synchronization
  useEffect(() => {
    const handleThemeChange = (e) => {
      const current = e.detail || getEmployeeTheme();
      setTheme(current);
      document.documentElement.setAttribute("data-theme", current);
    };

    const initial = getEmployeeTheme();
    document.documentElement.setAttribute("data-theme", initial);

    window.addEventListener("tf_theme_change", handleThemeChange);
    return () => window.removeEventListener("tf_theme_change", handleThemeChange);
  }, []);

  // Handle Quick Create Task
  const handleSaveTask = (e) => {
    e.preventDefault();
    if (!taskForm.title.trim()) return;

    try {
      const existing = JSON.parse(localStorage.getItem("tf_tasks") || "[]");
      const newTask = {
        id: Date.now(),
        title: taskForm.title.trim(),
        project: taskForm.project,
        status: "todo",
        priority: taskForm.priority,
        due: "Today",
        dueDate: taskForm.dueDate,
        overdue: false,
      };
      const updated = [newTask, ...existing];
      localStorage.setItem("tf_tasks", JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent("tf_tasks_updated", { detail: newTask }));
    } catch (err) {
      console.error("Error creating task:", err);
    }

    setTaskForm({
      title: "",
      project: "TeamFlow Website",
      priority: "Medium",
      dueDate: new Date().toISOString().split("T")[0],
    });
    setCreateModal(null);
  };

  // Handle Quick Report Bug
  const handleSaveBug = (e) => {
    e.preventDefault();
    if (!bugForm.title.trim()) return;

    try {
      const existing = JSON.parse(localStorage.getItem("teamflow_bugs") || "[]");
      const newBug = {
        id: `BUG-${Date.now().toString().slice(-4)}`,
        title: bugForm.title.trim(),
        project: bugForm.project,
        severity: bugForm.severity,
        priority: bugForm.severity === "High" ? "Critical" : "Medium",
        description: bugForm.description || "Reported from employee dashboard quick create.",
        status: "Open",
        createdAt: "Just now",
        assignee: "You",
      };
      const updated = [newBug, ...existing];
      localStorage.setItem("teamflow_bugs", JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent("tf_bugs_updated", { detail: newBug }));
    } catch (err) {
      console.error("Error creating bug:", err);
    }

    setBugForm({
      title: "",
      project: "TeamFlow Website",
      severity: "Medium",
      description: "",
    });
    setCreateModal(null);
  };

  // Handle Quick Add Event
  const handleSaveEvent = (e) => {
    e.preventDefault();
    if (!eventForm.title.trim()) return;

    try {
      const existing = JSON.parse(localStorage.getItem("tf_events") || "[]");
      const newEvent = {
        id: `event-${Date.now()}`,
        title: eventForm.title.trim(),
        date: eventForm.date,
        time: eventForm.time,
        category: eventForm.category,
        location: "TeamFlow Online",
        description: "Scheduled event",
      };
      const updated = [newEvent, ...existing];
      localStorage.setItem("tf_events", JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent("tf_events_updated", { detail: newEvent }));
    } catch (err) {
      console.error("Error creating event:", err);
    }

    setEventForm({
      title: "",
      date: new Date().toISOString().split("T")[0],
      time: "10:00",
      category: "meeting",
    });
    setCreateModal(null);
  };

  // Handle Quick Create Project
  const handleSaveProject = (e) => {
    e.preventDefault();
    if (!projectForm.name.trim()) return;

    try {
      const existing = JSON.parse(localStorage.getItem("tf_projects") || "[]");
      const newProj = {
        id: Date.now(),
        name: projectForm.name.trim(),
        category: projectForm.category,
        progress: Number(projectForm.progress) || 10,
        barColor: "blue",
      };
      const updated = [newProj, ...existing];
      localStorage.setItem("tf_projects", JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent("tf_projects_updated", { detail: newProj }));
    } catch (err) {
      console.error("Error creating project:", err);
    }

    setProjectForm({
      name: "",
      category: "UI/UX Design",
      progress: 10,
    });
    setCreateModal(null);
  };

  return (
    <div className={`employee-shell ${theme === "dark" ? "tf-dark" : ""}`}>
      {/* Shared Sidebar */}
      <AppSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeRoute={activeRoute}
      />

      {/* Main Layout Area */}
      <div className="employee-main-wrapper">
        {/* Shared Topbar */}
        <EmployeeTopbar
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
          onOpenCreateModal={(type) => setCreateModal(type)}
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          searchPlaceholder={searchPlaceholder}
        />

        {/* Page Content Viewport */}
        <main
          className={`employee-content-area ${noScroll ? "no-scroll" : ""}`}
          id="employee-content-scroll"
        >
          {children}
        </main>
      </div>

      {/* Quick Create Modals */}
      {createModal && (
        <div
          className="tf-modal-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget) setCreateModal(null);
          }}
        >
          <div className="tf-modal-card" role="dialog" aria-modal="true">
            <div className="tf-modal-header">
              <div className="tf-modal-title-group">
                <div className={`tf-modal-icon-box ${createModal}`}>
                  {createModal === "task" && <CheckSquare size={18} />}
                  {createModal === "project" && <Network size={18} />}
                  {createModal === "bug" && <Bug size={18} />}
                  {createModal === "event" && <Calendar size={18} />}
                </div>
                <div>
                  <h3>
                    {createModal === "task" && "Create New Task"}
                    {createModal === "project" && "Create New Project"}
                    {createModal === "bug" && "Report an Issue"}
                    {createModal === "event" && "Schedule Calendar Event"}
                  </h3>
                  <p>
                    {createModal === "task" && "Add a task to your personal workflow"}
                    {createModal === "project" && "Initialize a new project or milestone"}
                    {createModal === "bug" && "Document a bug for tracking and fixing"}
                    {createModal === "event" && "Set a deadline, meeting, or milestone"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="tf-modal-close"
                onClick={() => setCreateModal(null)}
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            {/* Task Form */}
            {createModal === "task" && (
              <form onSubmit={handleSaveTask} className="tf-modal-form">
                <div className="tf-form-group">
                  <label>Task Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Update mobile responsive styles"
                    value={taskForm.title}
                    onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                    autoFocus
                  />
                </div>
                <div className="tf-form-row">
                  <div className="tf-form-group">
                    <label>Project</label>
                    <select
                      value={taskForm.project}
                      onChange={(e) => setTaskForm({ ...taskForm, project: e.target.value })}
                    >
                      <option value="TeamFlow Website">TeamFlow Website</option>
                      <option value="Mobile App">Mobile App</option>
                      <option value="AI Integration">AI Integration</option>
                      <option value="Marketing Portal">Marketing Portal</option>
                    </select>
                  </div>
                  <div className="tf-form-group">
                    <label>Priority</label>
                    <select
                      value={taskForm.priority}
                      onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Urgent">Urgent</option>
                    </select>
                  </div>
                </div>
                <div className="tf-form-group">
                  <label>Due Date</label>
                  <input
                    type="date"
                    value={taskForm.dueDate}
                    onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                  />
                </div>
                <div className="tf-modal-actions">
                  <button
                    type="button"
                    className="tf-btn-secondary"
                    onClick={() => setCreateModal(null)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="tf-btn-primary">
                    <Plus size={16} /> Create Task
                  </button>
                </div>
              </form>
            )}

            {/* Project Form */}
            {createModal === "project" && (
              <form onSubmit={handleSaveProject} className="tf-modal-form">
                <div className="tf-form-group">
                  <label>Project Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Marketing Portal Redesign"
                    value={projectForm.name}
                    onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
                    autoFocus
                  />
                </div>
                <div className="tf-form-row">
                  <div className="tf-form-group">
                    <label>Category / Track</label>
                    <select
                      value={projectForm.category}
                      onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                    >
                      <option value="UI/UX Design">UI/UX Design</option>
                      <option value="API Integration">API Integration</option>
                      <option value="Testing & Bugs">Testing & Bugs</option>
                      <option value="Content & Design">Content & Design</option>
                      <option value="DevOps & Infra">DevOps & Infra</option>
                    </select>
                  </div>
                  <div className="tf-form-group">
                    <label>Initial Progress (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={projectForm.progress}
                      onChange={(e) => setProjectForm({ ...projectForm, progress: e.target.value })}
                    />
                  </div>
                </div>
                <div className="tf-modal-actions">
                  <button
                    type="button"
                    className="tf-btn-secondary"
                    onClick={() => setCreateModal(null)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="tf-btn-primary">
                    <Plus size={16} /> Create Project
                  </button>
                </div>
              </form>
            )}

            {/* Bug Form */}
            {createModal === "bug" && (
              <form onSubmit={handleSaveBug} className="tf-modal-form">
                <div className="tf-form-group">
                  <label>Bug Summary *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., File upload fails on safari"
                    value={bugForm.title}
                    onChange={(e) => setBugForm({ ...bugForm, title: e.target.value })}
                    autoFocus
                  />
                </div>
                <div className="tf-form-row">
                  <div className="tf-form-group">
                    <label>Project</label>
                    <select
                      value={bugForm.project}
                      onChange={(e) => setBugForm({ ...bugForm, project: e.target.value })}
                    >
                      <option value="TeamFlow Website">TeamFlow Website</option>
                      <option value="Mobile App">Mobile App</option>
                      <option value="AI Integration">AI Integration</option>
                    </select>
                  </div>
                  <div className="tf-form-group">
                    <label>Severity</label>
                    <select
                      value={bugForm.severity}
                      onChange={(e) => setBugForm({ ...bugForm, severity: e.target.value })}
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Critical">Critical</option>
                    </select>
                  </div>
                </div>
                <div className="tf-form-group">
                  <label>Description / Steps to Reproduce</label>
                  <textarea
                    rows={3}
                    placeholder="Describe how to trigger the bug..."
                    value={bugForm.description}
                    onChange={(e) => setBugForm({ ...bugForm, description: e.target.value })}
                  />
                </div>
                <div className="tf-modal-actions">
                  <button
                    type="button"
                    className="tf-btn-secondary"
                    onClick={() => setCreateModal(null)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="tf-btn-primary danger">
                    <Bug size={16} /> Report Bug
                  </button>
                </div>
              </form>
            )}

            {/* Event Form */}
            {createModal === "event" && (
              <form onSubmit={handleSaveEvent} className="tf-modal-form">
                <div className="tf-form-group">
                  <label>Event Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Sprint Demo or Design Sync"
                    value={eventForm.title}
                    onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                    autoFocus
                  />
                </div>
                <div className="tf-form-row">
                  <div className="tf-form-group">
                    <label>Date</label>
                    <input
                      type="date"
                      value={eventForm.date}
                      onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                    />
                  </div>
                  <div className="tf-form-group">
                    <label>Time</label>
                    <input
                      type="time"
                      value={eventForm.time}
                      onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })}
                    />
                  </div>
                </div>
                <div className="tf-form-group">
                  <label>Category</label>
                  <select
                    value={eventForm.category}
                    onChange={(e) => setEventForm({ ...eventForm, category: e.target.value })}
                  >
                    <option value="meeting">Meeting</option>
                    <option value="deadline">Task Deadline</option>
                    <option value="milestone">Milestone</option>
                    <option value="personal">Personal</option>
                  </select>
                </div>
                <div className="tf-modal-actions">
                  <button
                    type="button"
                    className="tf-btn-secondary"
                    onClick={() => setCreateModal(null)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="tf-btn-primary">
                    <Calendar size={16} /> Save Event
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default EmployeeShell;
