import { useMemo, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  CircleDashed,
  Clock3,
  FolderKanban,
  Globe2,
  Monitor,
  Search,
  Smartphone,
  Sparkles,
  Users,
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
  MoreVertical,
} from "lucide-react";
import { initialProjects } from "../Employee/projectData.js";
import { initialMembers } from "../Employee/teamData.js";
import "./Project.css";

const STORAGE_KEY = "teamflow_projects";
const FILTERS = ["All Projects", "Active", "On Hold", "Completed"];

const PROJECT_ICONS = {
  mobile: Smartphone,
  globe: Globe2,
  brain: Sparkles,
  database: FolderKanban,
};

function getProjects() {
  try {
    const savedProjects = localStorage.getItem(STORAGE_KEY);
    if (!savedProjects) return initialProjects;

    const parsedProjects = JSON.parse(savedProjects);
    if (!Array.isArray(parsedProjects)) {
      throw new TypeError("Saved projects must be an array.");
    }

    return parsedProjects;
  } catch (error) {
    console.error("Failed to load projects for the Team Lead dashboard:", error);
    return initialProjects;
  }
}

function getProgress(project) {
  const tasks = Array.isArray(project.tasks) ? project.tasks : [];
  if (tasks.length === 0) return 0;

  const completedTasks = tasks.filter(task => task.status === "Completed" || task.status === "Done").length;
  return Math.round((completedTasks / tasks.length) * 100);
}

function formatDate(date) {
  if (!date) return "No due date";

  const parsedDate = new Date(`${date}T00:00:00`);
  if (Number.isNaN(parsedDate.getTime())) return "No due date";

  return parsedDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function ProjectCard({ project, number, onEdit, onDelete, onStatusChange }) {
  const Icon = PROJECT_ICONS[project.icon] || Monitor;
  const progress = getProgress(project);
  const members = Array.isArray(project.members) ? project.members : [];
  const tasks = Array.isArray(project.tasks) ? project.tasks : [];
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <article className="tl-project-card">
      <div className="tl-project-card-top">
        <span className={`tl-project-icon ${project.icon || "default"}`}>
          <Icon size={20} aria-hidden="true" />
        </span>

        <div className="tl-project-card-actions">
          {/* STATUS PILL BUTTON */}
          <button
            type="button"
            className={`tl-project-status-btn tl-project-status ${project.status?.toLowerCase().replaceAll(" ", "-") || "unknown"}`}
            onClick={() => {
              const nextStatus = project.status === "Active" ? "Completed" : project.status === "Completed" ? "On Hold" : "Active";
              onStatusChange(project.id, nextStatus);
            }}
            title="Click to toggle status (Active -> Completed -> On Hold)"
          >
            <i />
            {project.status || "Unknown"}
          </button>

          {/* EDIT & DELETE ACTION MENU */}
          <div className="tl-project-action-menu-wrap">
            <button
              type="button"
              className="tl-project-menu-btn"
              onClick={() => setMenuOpen(!menuOpen)}
              title="Project actions"
              aria-label="Project actions"
            >
              <MoreVertical size={16} />
            </button>

            {menuOpen && (
              <div className="tl-project-menu-popover">
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onEdit(project);
                  }}
                >
                  <Pencil size={14} />
                  <span>Edit Project</span>
                </button>
                <button
                  type="button"
                  className="danger tl-action-delete"
                  onClick={() => {
                    setMenuOpen(false);
                    onDelete(project);
                  }}
                >
                  <Trash2 size={14} />
                  <span>Delete Project</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="tl-project-title-row">
        <div>
          <span className="tl-project-number">#{number}</span>
          <h2>{project.name}</h2>
          <p>{project.description || "No project description provided."}</p>
        </div>
        <span className={`tl-project-priority ${project.priority?.toLowerCase() || "medium"}`}>
          {project.priority || "Medium"}
        </span>
      </div>

      <div className="tl-project-progress">
        <div className="tl-project-progress-label">
          <span>Task progress</span>
          <b>{progress}%</b>
        </div>
        <div
          className="tl-project-progress-track"
          role="progressbar"
          aria-label={`${project.name} task progress`}
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <span style={{ width: `${progress}%` }} />
        </div>
        <small>
          {tasks.filter(task => task.status === "Completed" || task.status === "Done").length} of {tasks.length} tasks completed
        </small>
      </div>

      <div className="tl-project-card-footer">
        <div className="tl-project-members">
          <Users size={15} aria-hidden="true" />
          <div className="tl-project-avatars" aria-label={`${members.length} project members`}>
            {members.slice(0, 4).map(member => (
              <span key={`${project.id}-${member.id}`} title={member.name}>
                {member.initials || member.name?.split(/\s+/).map(part => part[0]).join("").slice(0, 2)}
              </span>
            ))}
          </div>
          <small>{members.length} {members.length === 1 ? "member" : "members"}</small>
        </div>
        <div className="tl-project-due">
          <CalendarDays size={14} aria-hidden="true" />
          <span>{formatDate(project.dueDate)}</span>
        </div>
      </div>
    </article>
  );
}

export default function Project() {
  const [projects, setProjects] = useState(getProjects);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All Projects");
  const [toast, setToast] = useState(null);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    priority: "Medium",
    status: "Active",
    dueDate: "",
    icon: "globe",
  });
  const [selectedMemberIds, setSelectedMemberIds] = useState([1, 2, 3]);
  const [deleteProjectTarget, setDeleteProjectTarget] = useState(null);

  // Sync to localStorage
  const saveProjects = (newList) => {
    setProjects(newList);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
    } catch (e) {
      console.error("Failed to save projects:", e);
    }
    window.dispatchEvent(new Event("teamflow_data_update"));
  };

  const showToastMsg = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const stats = useMemo(() => ({
    total: projects.length,
    active: projects.filter(project => project.status === "Active").length,
    onHold: projects.filter(project => project.status === "On Hold").length,
    completed: projects.filter(project => project.status === "Completed").length,
  }), [projects]);

  const filteredProjects = useMemo(() => {
    const query = search.trim().toLowerCase();

    return projects.filter(project => {
      const matchesFilter = filter === "All Projects" || project.status === filter;
      const matchesSearch = !query
        || project.name?.toLowerCase().includes(query)
        || project.description?.toLowerCase().includes(query)
        || project.members?.some(member => member.name?.toLowerCase().includes(query));

      return matchesFilter && matchesSearch;
    });
  }, [projects, filter, search]);

  const openCreateModal = () => {
    setEditingProject(null);
    setForm({
      name: "",
      description: "",
      priority: "Medium",
      status: "Active",
      dueDate: new Date().toISOString().slice(0, 10),
      icon: "globe",
    });
    setSelectedMemberIds([1, 2, 3]);
    setShowModal(true);
  };

  const openEditModal = (proj) => {
    setEditingProject(proj);
    setForm({
      name: proj.name || "",
      description: proj.description || "",
      priority: proj.priority || "Medium",
      status: proj.status || "Active",
      dueDate: proj.dueDate || "",
      icon: proj.icon || "globe",
    });
    const currentMemberIds = Array.isArray(proj.members)
      ? proj.members.map(m => m.id)
      : [1, 2];
    setSelectedMemberIds(currentMemberIds);
    setShowModal(true);
  };

  const handleStatusChange = (projectId, newStatus) => {
    const updated = projects.map(p => p.id === projectId ? { ...p, status: newStatus } : p);
    saveProjects(updated);
    showToastMsg(`Project status updated to ${newStatus}`);
  };

  const handleDelete = (project) => {
    setDeleteProjectTarget(project);
  };

  const confirmDeleteProject = () => {
    if (!deleteProjectTarget) return;
    const updated = projects.filter(p => p.id !== deleteProjectTarget.id);
    saveProjects(updated);
    showToastMsg("Project deleted successfully");
    setDeleteProjectTarget(null);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      alert("Please provide a project name.");
      return;
    }

    const assignedMembers = initialMembers
      .filter(m => selectedMemberIds.includes(m.id))
      .map(m => ({
        id: m.id,
        name: m.name,
        initials: m.name.split(/\s+/).map(p => p[0]).join("").slice(0, 2),
      }));

    if (editingProject) {
      const updated = projects.map(p => {
        if (p.id === editingProject.id) {
          return {
            ...p,
            ...form,
            name: form.name.trim(),
            description: form.description.trim(),
            members: assignedMembers.length > 0 ? assignedMembers : p.members,
          };
        }
        return p;
      });
      saveProjects(updated);
      showToastMsg("Project updated successfully");
    } else {
      const newProj = {
        id: Date.now(),
        ...form,
        name: form.name.trim(),
        description: form.description.trim(),
        tasks: [],
        members: assignedMembers,
      };
      saveProjects([newProj, ...projects]);
      showToastMsg("New project initiated successfully");
    }

    setShowModal(false);
  };

  const toggleMemberSelection = (memberId) => {
    setSelectedMemberIds(prev =>
      prev.includes(memberId) ? prev.filter(id => id !== memberId) : [...prev, memberId]
    );
  };

  return (
    <section className="tl-project-page">
      {/* TOAST NOTIFICATION */}
      {toast && (
        <div className="tl-project-toast">
          <CheckCircle2 size={16} />
          <span>{toast}</span>
        </div>
      )}

      {/* HEADER WITH TITLE & + CREATE PROJECT BUTTON */}
      <header className="tl-project-header">
        <div>
          <span className="tl-project-eyebrow">WORKSPACE OVERVIEW</span>
          <h1>Projects</h1>
          <p>Track project progress, timelines, squad contributions, and manage project boards.</p>
        </div>

        <div className="tl-project-header-right">
          <div className="tl-project-header-count">
            <FolderKanban size={18} aria-hidden="true" />
            {stats.total} {stats.total === 1 ? "project" : "projects"}
          </div>

          <button
            type="button"
            className="tl-btn-primary"
            onClick={openCreateModal}
          >
            <Plus size={16} />
            <span>New Project</span>
          </button>
        </div>
      </header>

      {/* STATS OVERVIEW */}
      <section className="tl-project-stats" aria-label="Project summary">
        <article className="tl-project-stat">
          <span className="tl-project-stat-icon total"><FolderKanban size={20} /></span>
          <div><small>Total Projects</small><b>{stats.total}</b></div>
        </article>
        <article className="tl-project-stat">
          <span className="tl-project-stat-icon active"><CircleDashed size={20} /></span>
          <div><small>Active</small><b>{stats.active}</b></div>
        </article>
        <article className="tl-project-stat">
          <span className="tl-project-stat-icon hold"><Clock3 size={20} /></span>
          <div><small>On Hold</small><b>{stats.onHold}</b></div>
        </article>
        <article className="tl-project-stat">
          <span className="tl-project-stat-icon completed"><CheckCircle2 size={20} /></span>
          <div><small>Completed</small><b>{stats.completed}</b></div>
        </article>
      </section>

      {/* PROJECT LIST SECTION */}
      <section className="tl-project-list">
        <div className="tl-project-list-heading">
          <div>
            <h2>All projects <span>{filteredProjects.length}</span></h2>
            <p>Browse your team's projects, manage statuses, and track velocity.</p>
          </div>
          <div className="tl-project-controls">
            <label className="tl-project-search">
              <Search size={17} aria-hidden="true" />
              <input
                type="search"
                placeholder="Search projects or members..."
                value={search}
                onChange={event => setSearch(event.target.value)}
              />
            </label>
            <label className="tl-project-filter-label">
              <span className="tl-project-sr-only">Filter projects by status</span>
              <select value={filter} onChange={event => setFilter(event.target.value)}>
                {FILTERS.map(status => <option key={status}>{status}</option>)}
              </select>
            </label>
          </div>
        </div>

        {filteredProjects.length > 0 ? (
          <div className="tl-project-grid">
            {filteredProjects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                number={index + 1}
                onEdit={openEditModal}
                onDelete={handleDelete}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        ) : (
          <div className="tl-project-empty">
            <Search size={24} aria-hidden="true" />
            <h3>No projects found</h3>
            <p>Try another search term or click "New Project" to create one.</p>
            <button type="button" className="tl-btn-primary" onClick={openCreateModal} style={{ marginTop: 14 }}>
              <Plus size={15} />
              <span>Create First Project</span>
            </button>
          </div>
        )}
      </section>

      {/* CREATE / EDIT PROJECT MODAL */}
      {showModal && (
        <div className="tl-modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="tl-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="tl-modal-header">
              <div className="tl-modal-title-wrap">
                <div className="tl-modal-icon">
                  <FolderKanban size={18} />
                </div>
                <div>
                  <h3>{editingProject ? "Edit Project" : "Initiate New Project"}</h3>
                  <small>Configure squad goals, priority level, and timeline.</small>
                </div>
              </div>
              <button
                type="button"
                className="tl-modal-close"
                onClick={() => setShowModal(false)}
                aria-label="Close dialog"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="tl-modal-form">
              <div className="tl-form-group">
                <label>Project Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Enterprise Billing Redesign"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              <div className="tl-form-group">
                <label>Description</label>
                <textarea
                  rows={3}
                  placeholder="Summarize objectives, squad milestones, and requirements..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>

              <div className="tl-form-row">
                <div className="tl-form-group">
                  <label>Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                  >
                    <option value="Active">Active</option>
                    <option value="On Hold">On Hold</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                <div className="tl-form-group">
                  <label>Priority</label>
                  <select
                    value={form.priority}
                    onChange={(e) => setForm({ ...form, priority: e.target.value })}
                  >
                    <option value="Urgent">Urgent</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div className="tl-form-row">
                <div className="tl-form-group">
                  <label>Target Due Date</label>
                  <input
                    type="date"
                    value={form.dueDate}
                    onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                  />
                </div>

                <div className="tl-form-group">
                  <label>Category Icon</label>
                  <select
                    value={form.icon}
                    onChange={(e) => setForm({ ...form, icon: e.target.value })}
                  >
                    <option value="globe">Web / Global App (Globe)</option>
                    <option value="mobile">Mobile Application (Phone)</option>
                    <option value="brain">AI / Machine Learning (Brain)</option>
                    <option value="database">Core Infrastructure (Database)</option>
                  </select>
                </div>
              </div>

              {/* SQUAD MEMBERS SELECTION */}
              <div className="tl-form-group">
                <label>Allocate Squad Members</label>
                <div className="tl-member-checkbox-list">
                  {initialMembers.slice(0, 6).map((m) => {
                    const isSelected = selectedMemberIds.includes(m.id);
                    return (
                      <button
                        key={m.id}
                        type="button"
                        className={`tl-member-chip ${isSelected ? "selected" : ""}`}
                        onClick={() => toggleMemberSelection(m.id)}
                      >
                        <span className="tl-member-chip-initials">
                          {m.name.split(/\s+/).map(p => p[0]).join("").slice(0, 2)}
                        </span>
                        <span>{m.name}</span>
                        {isSelected && <Check size={13} />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="tl-modal-actions">
                <button
                  type="button"
                  className="tl-btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="tl-btn-primary">
                  {editingProject ? "Save Changes" : "Create Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CUSTOM CSS DELETE CONFIRMATION MODAL */}
      {deleteProjectTarget && (
        <div
          className="tl-delete-modal-overlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setDeleteProjectTarget(null);
          }}
        >
          <div className="tl-delete-modal-box">
            <div className="tl-delete-modal-icon-circle">
              <Trash2 size={24} />
            </div>
            <h3>Delete "{deleteProjectTarget.name}"?</h3>
            <p>Are you sure you want to permanently delete this project? All associated tasks, milestones, and timelines will be removed.</p>
            <div className="tl-delete-modal-footer">
              <button
                type="button"
                className="tl-btn-secondary"
                onClick={() => setDeleteProjectTarget(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="tl-btn-danger"
                onClick={confirmDeleteProject}
              >
                <Trash2 size={15} /> Delete Project
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
