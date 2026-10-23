import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  Plus,
  Moon,
  Bell,
  CircleHelp,
  ChevronDown,
  FolderKanban,
  CircleCheckBig,
  Clock3,
  AlertTriangle,
  Users,
  CalendarDays,
  MoreVertical,
  Eye,
  Pencil,
  Trash2,
  X,
  LayoutGrid,
  List,
  BriefcaseBusiness,
} from "lucide-react";

import AdminSidebar from "../../../layouts/AdminSidebar/AdminSidebar.jsx";
import "./AdminProjects.css";

import {
  initialAdminProjects,
  projectStatuses,
  projectPriorities,
  workspaceOptions,
} from "./adminProjectsData.js";

const STORAGE_KEY = "teamflow_admin_projects";

function getStoredProjects() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      return JSON.parse(saved);
    }

    return initialAdminProjects;
  } catch {
    return initialAdminProjects;
  }
}

function AdminProjects() {
  const [projects, setProjects] = useState(getStoredProjects);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [workspaceFilter, setWorkspaceFilter] = useState("All");
  const [view, setView] = useState("grid");

  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const [selectedProject, setSelectedProject] = useState(null);
  const [editingProject, setEditingProject] = useState(null);
  const [menuId, setMenuId] = useState(null);

  const emptyForm = {
    name: "",
    workspace: workspaceOptions[0],
    owner: "",
    ownerEmail: "",
    status: "Active",
    priority: "Medium",
    members: 1,
    tasks: 0,
    completedTasks: 0,
    dueDate: "",
    description: "",
  };

  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  }, [projects]);

  const stats = useMemo(() => {
    return {
      total: projects.length,

      active: projects.filter((project) => project.status === "Active")
        .length,

      completed: projects.filter(
        (project) => project.status === "Completed"
      ).length,

      attention: projects.filter(
        (project) =>
          project.status === "On Hold" || project.status === "Overdue"
      ).length,
    };
  }, [projects]);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const query = search.toLowerCase().trim();

      const matchesSearch =
        !query ||
        project.name.toLowerCase().includes(query) ||
        project.workspace.toLowerCase().includes(query) ||
        project.owner.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" || project.status === statusFilter;

      const matchesWorkspace =
        workspaceFilter === "All" ||
        project.workspace === workspaceFilter;

      return matchesSearch && matchesStatus && matchesWorkspace;
    });
  }, [projects, search, statusFilter, workspaceFilter]);

  const calculateProgress = (project) => {
    if (!project.tasks) return 0;

    return Math.min(
      100,
      Math.round((project.completedTasks / project.tasks) * 100)
    );
  };

  const openCreateModal = () => {
    setEditingProject(null);
    setForm(emptyForm);
    setShowProjectModal(true);
  };

  const openEditModal = (project) => {
    setEditingProject(project);
    setForm({
      name: project.name,
      workspace: project.workspace,
      owner: project.owner,
      ownerEmail: project.ownerEmail,
      status: project.status,
      priority: project.priority,
      members: project.members,
      tasks: project.tasks,
      completedTasks: project.completedTasks,
      dueDate: project.dueDate,
      description: project.description,
    });

    setMenuId(null);
    setShowProjectModal(true);
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const saveProject = (event) => {
    event.preventDefault();

    if (!form.name.trim() || !form.owner.trim()) {
      alert("Project name and owner are required.");
      return;
    }

    const totalTasks = Number(form.tasks) || 0;

    const completedTasks = Math.min(
      Number(form.completedTasks) || 0,
      totalTasks
    );

    if (editingProject) {
      setProjects((previous) =>
        previous.map((project) =>
          project.id === editingProject.id
            ? {
                ...project,
                ...form,
                members: Number(form.members) || 0,
                tasks: totalTasks,
                completedTasks,
              }
            : project
        )
      );
    } else {
      const newProject = {
        id: Date.now(),
        ...form,
        members: Number(form.members) || 0,
        tasks: totalTasks,
        completedTasks,
        createdAt: new Date().toISOString().split("T")[0],
      };

      setProjects((previous) => [newProject, ...previous]);
    }

    setShowProjectModal(false);
    setEditingProject(null);
    setForm(emptyForm);
  };

  const deleteProject = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this project?"
    );

    if (!confirmed) return;

    setProjects((previous) =>
      previous.filter((project) => project.id !== id)
    );

    setMenuId(null);
  };

  const viewProject = (project) => {
    setSelectedProject(project);
    setShowDetailsModal(true);
    setMenuId(null);
  };

  const resetDemoData = () => {
    const confirmed = window.confirm(
      "Reset all project data to the original demo projects?"
    );

    if (!confirmed) return;

    setProjects(initialAdminProjects);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <div className="admin-projects-page">
      <AdminSidebar />

      <main className="admin-projects-main">
        {/* TOPBAR */}

        <header className="admin-projects-topbar">
          <div className="admin-projects-global-search">
            <Search size={18} />

            <input
              type="text"
              placeholder="Search users, workspaces, projects, or anything..."
            />

            <span>Ctrl + K</span>
          </div>

          <div className="admin-projects-top-actions">
            <button
              className="admin-projects-create-top"
              type="button"
              onClick={openCreateModal}
            >
              <Plus size={18} />
              Create
              <ChevronDown size={16} />
            </button>

            <button
              className="admin-projects-icon-button"
              type="button"
              aria-label="Theme"
            >
              <Moon size={19} />
            </button>

            <button
              className="admin-projects-icon-button notification"
              type="button"
              aria-label="Notifications"
            >
              <Bell size={19} />
              <span>12</span>
            </button>

            <button
              className="admin-projects-icon-button"
              type="button"
              aria-label="Help"
            >
              <CircleHelp size={19} />
            </button>

            <div className="admin-projects-profile">
              <div className="admin-projects-avatar">HR</div>

              <div>
                <strong>Himanshu</strong>
                <small>Super Administrator</small>
              </div>

              <ChevronDown size={16} />
            </div>
          </div>
        </header>

        {/* CONTENT */}

        <div className="admin-projects-content">
          <section className="admin-projects-heading">
            <div>
              <div className="admin-projects-breadcrumb">
                <FolderKanban size={16} />
                ADMIN / PROJECTS
              </div>

              <h1>Project Management</h1>

              <p>
                Monitor and manage projects across every TeamFlow AI
                workspace.
              </p>
            </div>

            <button
              className="admin-projects-primary-button"
              type="button"
              onClick={openCreateModal}
            >
              <Plus size={18} />
              Create Project
            </button>
          </section>

          {/* STATS */}

          <section className="admin-projects-stats">
            <StatCard
              icon={<FolderKanban size={23} />}
              title="Total Projects"
              value={stats.total}
              subtitle="Across all workspaces"
              type="purple"
            />

            <StatCard
              icon={<BriefcaseBusiness size={23} />}
              title="Active Projects"
              value={stats.active}
              subtitle="Currently running"
              type="green"
            />

            <StatCard
              icon={<CircleCheckBig size={23} />}
              title="Completed"
              value={stats.completed}
              subtitle="Successfully completed"
              type="blue"
            />

            <StatCard
              icon={<AlertTriangle size={23} />}
              title="Needs Attention"
              value={stats.attention}
              subtitle="On hold or overdue"
              type="red"
            />
          </section>

          {/* FILTERS */}

          <section className="admin-projects-filters">
            <div className="admin-project-search">
              <Search size={18} />

              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search project name, workspace or owner..."
              />
            </div>

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option value="All">All Status</option>

              {projectStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>

            <select
              value={workspaceFilter}
              onChange={(event) => setWorkspaceFilter(event.target.value)}
            >
              <option value="All">All Workspaces</option>

              {workspaceOptions.map((workspace) => (
                <option key={workspace} value={workspace}>
                  {workspace}
                </option>
              ))}
            </select>

            <div className="admin-project-view-buttons">
              <button
                className={view === "grid" ? "active" : ""}
                type="button"
                onClick={() => setView("grid")}
              >
                <LayoutGrid size={18} />
              </button>

              <button
                className={view === "list" ? "active" : ""}
                type="button"
                onClick={() => setView("list")}
              >
                <List size={19} />
              </button>
            </div>
          </section>

          <div className="admin-projects-result-row">
            <span>
              Showing <strong>{filteredProjects.length}</strong> projects
            </span>

            <button type="button" onClick={resetDemoData}>
              Reset Demo Data
            </button>
          </div>

          {/* PROJECTS */}

          {filteredProjects.length === 0 ? (
            <div className="admin-projects-empty">
              <FolderKanban size={45} />

              <h3>No projects found</h3>

              <p>Try changing your search or filters.</p>
            </div>
          ) : (
            <section
              className={`admin-projects-grid ${
                view === "list" ? "list-view" : ""
              }`}
            >
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  progress={calculateProgress(project)}
                  menuId={menuId}
                  setMenuId={setMenuId}
                  onView={() => viewProject(project)}
                  onEdit={() => openEditModal(project)}
                  onDelete={() => deleteProject(project.id)}
                />
              ))}
            </section>
          )}
        </div>
      </main>

      {/* CREATE / EDIT MODAL */}

      {showProjectModal && (
        <div className="admin-project-modal-overlay">
          <div className="admin-project-modal">
            <div className="admin-project-modal-header">
              <div>
                <h2>
                  {editingProject ? "Edit Project" : "Create New Project"}
                </h2>

                <p>
                  {editingProject
                    ? "Update project information."
                    : "Create a project inside a TeamFlow AI workspace."}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowProjectModal(false)}
              >
                <X size={21} />
              </button>
            </div>

            <form onSubmit={saveProject}>
              <div className="admin-project-form-grid">
                <FormField label="Project Name">
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleFormChange}
                    placeholder="Example: TeamFlow Mobile App"
                    required
                  />
                </FormField>

                <FormField label="Workspace">
                  <select
                    name="workspace"
                    value={form.workspace}
                    onChange={handleFormChange}
                  >
                    {workspaceOptions.map((workspace) => (
                      <option key={workspace} value={workspace}>
                        {workspace}
                      </option>
                    ))}
                  </select>
                </FormField>

                <FormField label="Project Owner">
                  <input
                    name="owner"
                    value={form.owner}
                    onChange={handleFormChange}
                    placeholder="Owner name"
                    required
                  />
                </FormField>

                <FormField label="Owner Email">
                  <input
                    name="ownerEmail"
                    type="email"
                    value={form.ownerEmail}
                    onChange={handleFormChange}
                    placeholder="owner@company.com"
                  />
                </FormField>

                <FormField label="Status">
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleFormChange}
                  >
                    {projectStatuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </FormField>

                <FormField label="Priority">
                  <select
                    name="priority"
                    value={form.priority}
                    onChange={handleFormChange}
                  >
                    {projectPriorities.map((priority) => (
                      <option key={priority} value={priority}>
                        {priority}
                      </option>
                    ))}
                  </select>
                </FormField>

                <FormField label="Members">
                  <input
                    name="members"
                    type="number"
                    min="0"
                    value={form.members}
                    onChange={handleFormChange}
                  />
                </FormField>

                <FormField label="Total Tasks">
                  <input
                    name="tasks"
                    type="number"
                    min="0"
                    value={form.tasks}
                    onChange={handleFormChange}
                  />
                </FormField>

                <FormField label="Completed Tasks">
                  <input
                    name="completedTasks"
                    type="number"
                    min="0"
                    value={form.completedTasks}
                    onChange={handleFormChange}
                  />
                </FormField>

                <FormField label="Due Date">
                  <input
                    name="dueDate"
                    type="date"
                    value={form.dueDate}
                    onChange={handleFormChange}
                  />
                </FormField>
              </div>

              <FormField label="Description">
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleFormChange}
                  rows="4"
                  placeholder="Describe the project..."
                />
              </FormField>

              <div className="admin-project-modal-actions">
                <button
                  className="cancel"
                  type="button"
                  onClick={() => setShowProjectModal(false)}
                >
                  Cancel
                </button>

                <button className="save" type="submit">
                  {editingProject ? "Save Changes" : "Create Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DETAILS */}

      {showDetailsModal && selectedProject && (
        <div className="admin-project-modal-overlay">
          <div className="admin-project-details-modal">
            <div className="admin-project-modal-header">
              <div>
                <span className="admin-project-detail-label">
                  PROJECT DETAILS
                </span>

                <h2>{selectedProject.name}</h2>

                <p>{selectedProject.workspace}</p>
              </div>

              <button
                type="button"
                onClick={() => setShowDetailsModal(false)}
              >
                <X size={21} />
              </button>
            </div>

            <div className="admin-project-detail-status">
              <span
                className={`project-status status-${selectedProject.status
                  .toLowerCase()
                  .replaceAll(" ", "-")}`}
              >
                {selectedProject.status}
              </span>

              <span
                className={`project-priority priority-${selectedProject.priority.toLowerCase()}`}
              >
                {selectedProject.priority} Priority
              </span>
            </div>

            <p className="admin-project-description">
              {selectedProject.description}
            </p>

            <div className="admin-project-detail-grid">
              <DetailItem
                label="Owner"
                value={selectedProject.owner}
              />

              <DetailItem
                label="Owner Email"
                value={selectedProject.ownerEmail || "Not provided"}
              />

              <DetailItem
                label="Members"
                value={selectedProject.members}
              />

              <DetailItem
                label="Total Tasks"
                value={selectedProject.tasks}
              />

              <DetailItem
                label="Completed Tasks"
                value={selectedProject.completedTasks}
              />

              <DetailItem
                label="Due Date"
                value={selectedProject.dueDate || "No due date"}
              />
            </div>

            <div className="admin-project-detail-progress">
              <div>
                <span>Project Progress</span>

                <strong>
                  {calculateProgress(selectedProject)}%
                </strong>
              </div>

              <div className="project-progress-track">
                <div
                  style={{
                    width: `${calculateProgress(selectedProject)}%`,
                  }}
                />
              </div>
            </div>

            <button
              className="admin-project-details-close"
              type="button"
              onClick={() => setShowDetailsModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon, title, value, subtitle, type }) {
  return (
    <article className="admin-project-stat-card">
      <div className={`admin-project-stat-icon ${type}`}>
        {icon}
      </div>

      <div>
        <span>{title}</span>
        <strong>{value}</strong>
        <small>{subtitle}</small>
      </div>
    </article>
  );
}

function ProjectCard({
  project,
  progress,
  menuId,
  setMenuId,
  onView,
  onEdit,
  onDelete,
}) {
  return (
    <article className="admin-project-card">
      <div className="admin-project-card-top">
        <div className="admin-project-title-area">
          <div className="admin-project-folder">
            <FolderKanban size={21} />
          </div>

          <div>
            <h3>{project.name}</h3>
            <span>{project.workspace}</span>
          </div>
        </div>

        <div className="admin-project-menu-wrapper">
          <button
            type="button"
            onClick={() =>
              setMenuId(menuId === project.id ? null : project.id)
            }
          >
            <MoreVertical size={19} />
          </button>

          {menuId === project.id && (
            <div className="admin-project-dropdown">
              <button type="button" onClick={onView}>
                <Eye size={16} />
                View
              </button>

              <button type="button" onClick={onEdit}>
                <Pencil size={16} />
                Edit
              </button>

              <button
                className="delete"
                type="button"
                onClick={onDelete}
              >
                <Trash2 size={16} />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="admin-project-badges">
        <span
          className={`project-status status-${project.status
            .toLowerCase()
            .replaceAll(" ", "-")}`}
        >
          {project.status}
        </span>

        <span
          className={`project-priority priority-${project.priority.toLowerCase()}`}
        >
          {project.priority}
        </span>
      </div>

      <p className="admin-project-card-description">
        {project.description}
      </p>

      <div className="admin-project-owner">
        <div>
          {project.owner
            .split(" ")
            .map((name) => name[0])
            .join("")
            .slice(0, 2)}
        </div>

        <span>
          <small>Project Owner</small>
          <strong>{project.owner}</strong>
        </span>
      </div>

      <div className="admin-project-card-metrics">
        <div>
          <Users size={17} />

          <span>
            <strong>{project.members}</strong>
            Members
          </span>
        </div>

        <div>
          <FolderKanban size={17} />

          <span>
            <strong>{project.tasks}</strong>
            Tasks
          </span>
        </div>
      </div>

      <div className="admin-project-progress">
        <div>
          <span>Progress</span>
          <strong>{progress}%</strong>
        </div>

        <div className="project-progress-track">
          <div style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="admin-project-card-footer">
        <span>
          <CalendarDays size={15} />
          {project.dueDate || "No due date"}
        </span>

        <button type="button" onClick={onView}>
          <Eye size={16} />
          View Project
        </button>
      </div>
    </article>
  );
}

function FormField({ label, children }) {
  return (
    <label className="admin-project-form-field">
      <span>{label}</span>
      {children}
    </label>
  );
}

function DetailItem({ label, value }) {
  return (
    <div className="admin-project-detail-item">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

export default AdminProjects;