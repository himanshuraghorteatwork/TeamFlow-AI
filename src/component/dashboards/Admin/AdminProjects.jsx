import React, { useEffect, useMemo, useState } from "react";
import {
  FolderKanban,
  Search,
  Plus,
  Filter,
  Download,
  RotateCcw,
  Grid2X2,
  List,
  Eye,
  Pencil,
  Trash2,
  Copy,
  ChevronDown,
  X,
  Users,
  CalendarDays,
  Building2,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Layers,
  Sparkles,
} from "lucide-react";

import AdminSidebar from "./AdminSidebar.jsx";
import AdminTopbar from "./AdminTopbar.jsx";
import { initialAdminProjects } from "./adminProjectsData.js";
import "./AdminProjects.css";

const STORAGE_KEY = "teamflow_admin_projects";

const DEFAULT_WORKSPACES = [
  "TeamFlow Workspace",
  "Marketing Team",
  "Design Studio",
  "Development Hub",
  "Research Lab",
  "Startup Team",
];

const loadProjects = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error(e);
  }
  return initialAdminProjects;
};

export default function AdminProjects() {
  const [projects, setProjects] = useState(loadProjects);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [workspaceFilter, setWorkspaceFilter] = useState("All");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' | 'table'

  // Modals
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [viewingProject, setViewingProject] = useState(null);
  const [exportOpen, setExportOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // Form State
  const [form, setForm] = useState({
    name: "",
    workspace: "TeamFlow Workspace",
    owner: "Amit Sharma",
    status: "Active",
    priority: "High",
    progress: 45,
    tasks: 10,
    completedTasks: 4,
    members: 4,
    dueDate: "2026-11-30",
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

  const saveProjects = (newProjects) => {
    setProjects(newProjects);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newProjects));
    } catch (e) {}
    window.dispatchEvent(new Event("teamflow_data_update"));
  };

  useEffect(() => {
    const handleSync = () => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) setProjects(JSON.parse(saved));
      } catch (e) {}
    };
    window.addEventListener("storage", handleSync);
    window.addEventListener("teamflow_data_update", handleSync);
    return () => {
      window.removeEventListener("storage", handleSync);
      window.removeEventListener("teamflow_data_update", handleSync);
    };
  }, []);

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const term = search.trim().toLowerCase();
      const matchesSearch =
        !term ||
        p.name?.toLowerCase().includes(term) ||
        p.owner?.toLowerCase().includes(term) ||
        p.workspace?.toLowerCase().includes(term);

      const matchesStatus = statusFilter === "All" || p.status === statusFilter;
      const matchesWorkspace =
        workspaceFilter === "All" || p.workspace === workspaceFilter;

      return matchesSearch && matchesStatus && matchesWorkspace;
    });
  }, [projects, search, statusFilter, workspaceFilter]);

  const stats = useMemo(() => {
    const total = projects.length;
    const active = projects.filter((p) => p.status === "Active").length;
    const completed = projects.filter((p) => p.status === "Completed").length;
    const onHold = projects.filter((p) => p.status === "On Hold").length;
    return { total, active, completed, onHold };
  }, [projects]);

  const openCreateModal = () => {
    setEditingProject(null);
    setForm({
      name: "",
      workspace: "TeamFlow Workspace",
      owner: "Amit Sharma",
      status: "Active",
      priority: "High",
      progress: 20,
      tasks: 8,
      completedTasks: 2,
      members: 4,
      dueDate: "2026-11-30",
      description: "",
    });
    setShowModal(true);
  };

  const openEditModal = (p) => {
    setEditingProject(p);
    setForm({
      name: p.name || "",
      workspace: p.workspace || "TeamFlow Workspace",
      owner: p.owner || "Amit Sharma",
      status: p.status || "Active",
      priority: p.priority || "Medium",
      progress: p.progress || 0,
      tasks: p.tasks || 0,
      completedTasks: p.completedTasks || 0,
      members: p.members || 1,
      dueDate: p.dueDate || "",
      description: p.description || "",
    });
    setShowModal(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      alert("Project name is required.");
      return;
    }

    if (editingProject) {
      const updated = projects.map((p) =>
        p.id === editingProject.id
          ? {
              ...p,
              ...form,
              members: Number(form.members) || 1,
              tasks: Number(form.tasks) || 0,
              completedTasks: Number(form.completedTasks) || 0,
              progress: Number(form.progress) || 0,
            }
          : p
      );
      saveProjects(updated);
      showToast(`Project "${form.name}" updated successfully.`);
    } else {
      const newProject = {
        id: Date.now(),
        ...form,
        members: Number(form.members) || 1,
        tasks: Number(form.tasks) || 0,
        completedTasks: Number(form.completedTasks) || 0,
        progress: Number(form.progress) || 0,
        createdAt: new Date().toISOString().split("T")[0],
      };
      saveProjects([newProject, ...projects]);
      showToast(`Project "${form.name}" created successfully.`);
    }

    setShowModal(false);
  };

  const deleteProject = (id, name) => {
    const confirmed = window.confirm(`Delete project "${name}"?`);
    if (!confirmed) return;
    saveProjects(projects.filter((p) => p.id !== id));
    showToast(`Project deleted.`);
  };

  const exportCSV = () => {
    const headers = ["ID", "Name", "Workspace", "Status", "Priority", "Progress(%)", "Tasks", "Due Date", "Owner"];
    const rows = filteredProjects.map((p) => [
      p.id,
      `"${p.name}"`,
      `"${p.workspace}"`,
      `"${p.status}"`,
      `"${p.priority}"`,
      p.progress,
      `${p.completedTasks || 0}/${p.tasks || 0}`,
      `"${p.dueDate}"`,
      `"${p.owner}"`,
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = `teamflow_projects_${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setExportOpen(false);
    showToast("Exported projects to CSV.");
  };

  const exportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(filteredProjects, null, 2));
    const link = document.createElement("a");
    link.href = dataStr;
    link.download = `teamflow_projects_${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setExportOpen(false);
    showToast("Exported projects to JSON.");
  };

  const resetDemo = () => {
    const confirmed = window.confirm("Reset projects database to demo defaults?");
    if (!confirmed) return;
    saveProjects(initialAdminProjects);
    showToast("Projects reset to demo defaults.");
  };

  return (
    <div className="admin-projects-app">
      <AdminSidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="admin-projects-main">
        <AdminTopbar
          onMobileMenuToggle={() => setMobileOpen(true)}
          onCreateProject={openCreateModal}
        />

        {toast && (
          <div className={`admin-projects-toast toast--${toast.type}`}>
            <CheckCircle2 size={16} />
            <span>{toast.message}</span>
          </div>
        )}

        <main className="admin-projects-content">
          {/* HEADING */}
          <section className="admin-projects-heading">
            <div>
              <h1>Project Management</h1>
              <p>Monitor project roadmaps, track milestone deliverables, and orchestrate cross-functional teams.</p>
            </div>

            <div className="admin-projects-heading-actions">
              <div className="admin-projects-dropdown-wrap">
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
                    <button type="button" onClick={exportJSON}>Export as JSON (.json)</button>
                  </div>
                )}
              </div>

              <button type="button" className="btn-primary" onClick={openCreateModal}>
                <Plus size={17} />
                <span>Create Project</span>
              </button>
            </div>
          </section>

          {/* STATS */}
          <section className="admin-projects-stats">
            <StatCard icon={<FolderKanban size={22} />} title="Total Projects" value={stats.total} type="purple" desc="Across all workspaces" />
            <StatCard icon={<Clock size={22} />} title="Active Projects" value={stats.active} type="blue" desc="Currently in progress" />
            <StatCard icon={<CheckCircle2 size={22} />} title="Completed Projects" value={stats.completed} type="green" desc="Shipped milestones" />
            <StatCard icon={<AlertTriangle size={22} />} title="On Hold" value={stats.onHold} type="amber" desc="Blocked or paused" />
          </section>

          {/* TOOLBAR */}
          <section className="admin-projects-toolbar">
            <div className="admin-projects-search">
              <Search size={17} />
              <input
                type="text"
                placeholder="Search projects by name, owner, or workspace..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button type="button" className="clear-btn" onClick={() => setSearch("")}>
                  <X size={14} />
                </button>
              )}
            </div>

            <div className="admin-projects-controls">
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="All">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Completed">Completed</option>
                <option value="On Hold">On Hold</option>
              </select>

              <select value={workspaceFilter} onChange={(e) => setWorkspaceFilter(e.target.value)}>
                <option value="All">All Workspaces</option>
                {DEFAULT_WORKSPACES.map((ws) => (
                  <option key={ws} value={ws}>{ws}</option>
                ))}
              </select>

              <div className="view-switch">
                <button
                  type="button"
                  className={`view-btn ${viewMode === "grid" ? "active" : ""}`}
                  onClick={() => setViewMode("grid")}
                >
                  <Grid2X2 size={16} />
                </button>
                <button
                  type="button"
                  className={`view-btn ${viewMode === "table" ? "active" : ""}`}
                  onClick={() => setViewMode("table")}
                >
                  <List size={16} />
                </button>
              </div>
            </div>
          </section>

          {/* META HEADER */}
          <div className="admin-projects-meta-header">
            <span>Showing {filteredProjects.length} of {projects.length} projects</span>
            <button type="button" className="reset-btn" onClick={resetDemo}>
              <RotateCcw size={14} />
              Reset Demo Data
            </button>
          </div>

          {/* GRID VIEW */}
          {viewMode === "grid" ? (
            <div className="admin-projects-grid">
              {filteredProjects.map((p) => {
                const progress = p.progress !== undefined ? p.progress : 50;

                return (
                  <div key={p.id} className="admin-projects-card">
                    <div className="card-top">
                      <div className="card-top-left">
                        <div className="project-avatar">
                          {p.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="clickable" onClick={() => setViewingProject(p)}>{p.name}</h3>
                          <div className="project-sub">{p.workspace}</div>
                        </div>
                      </div>

                      <span className={`status-pill status-${(p.status || "Active").toLowerCase().replace(/\s+/g, "-")}`}>
                        {p.status}
                      </span>
                    </div>

                    <div className="project-progress-wrap">
                      <div className="progress-labels">
                        <span>Progress</span>
                        <strong>{progress}%</strong>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${progress}%` }} />
                      </div>
                    </div>

                    <div className="card-meta-row">
                      <div className="meta-item">
                        <Users size={14} />
                        <span>{p.members || 3} members</span>
                      </div>
                      <div className="meta-item">
                        <CalendarDays size={14} />
                        <span>Due {p.dueDate || "Nov 2026"}</span>
                      </div>
                    </div>

                    <div className="card-footer">
                      <span className={`priority-tag priority-${(p.priority || "Medium").toLowerCase()}`}>
                        {p.priority} Priority
                      </span>

                      <div className="card-actions">
                        <button type="button" className="action-btn" title="View" onClick={() => setViewingProject(p)}>
                          <Eye size={15} />
                        </button>
                        <button type="button" className="action-btn" title="Edit" onClick={() => openEditModal(p)}>
                          <Pencil size={15} />
                        </button>
                        <button type="button" className="action-btn delete" title="Delete" onClick={() => deleteProject(p.id, p.name)}>
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* TABLE VIEW */
            <div className="admin-projects-table-wrap">
              <table className="admin-projects-table">
                <thead>
                  <tr>
                    <th>Project</th>
                    <th>Workspace</th>
                    <th>Status</th>
                    <th>Priority</th>
                    <th>Progress</th>
                    <th>Tasks</th>
                    <th>Due Date</th>
                    <th style={{ textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProjects.map((p) => (
                    <tr key={p.id}>
                      <td>
                        <strong className="clickable" onClick={() => setViewingProject(p)}>{p.name}</strong>
                      </td>
                      <td>{p.workspace}</td>
                      <td>
                        <span className={`status-pill status-${(p.status || "Active").toLowerCase().replace(/\s+/g, "-")}`}>
                          {p.status}
                        </span>
                      </td>
                      <td>
                        <span className={`priority-tag priority-${(p.priority || "Medium").toLowerCase()}`}>
                          {p.priority}
                        </span>
                      </td>
                      <td>
                        <div className="table-progress">
                          <span>{p.progress || 0}%</span>
                          <div className="progress-bar sm">
                            <div className="progress-fill" style={{ width: `${p.progress || 0}%` }} />
                          </div>
                        </div>
                      </td>
                      <td>{p.completedTasks || 0} / {p.tasks || 0}</td>
                      <td>{p.dueDate || "-"}</td>
                      <td style={{ textAlign: "right" }}>
                        <div className="table-actions">
                          <button type="button" className="action-btn" onClick={() => setViewingProject(p)}>
                            <Eye size={15} />
                          </button>
                          <button type="button" className="action-btn" onClick={() => openEditModal(p)}>
                            <Pencil size={15} />
                          </button>
                          <button type="button" className="action-btn delete" onClick={() => deleteProject(p.id, p.name)}>
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {filteredProjects.length === 0 && (
            <div className="admin-projects-empty">
              <FolderKanban size={44} />
              <h3>No projects found</h3>
              <p>Try modifying your search filter or status selection.</p>
            </div>
          )}
        </main>
      </div>

      {/* CREATE / EDIT MODAL */}
      {showModal && (
        <div className="modal-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}>
          <div className="modal-box">
            <div className="modal-header">
              <h2>{editingProject ? "Edit Project" : "Create New Project"}</h2>
              <button type="button" className="modal-close" onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label>Project Name <span className="req">*</span></label>
                <input name="name" value={form.name} onChange={handleFormChange} placeholder="e.g. Mobile App Redesign" required />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Workspace</label>
                  <select name="workspace" value={form.workspace} onChange={handleFormChange}>
                    {DEFAULT_WORKSPACES.map((ws) => (
                      <option key={ws} value={ws}>{ws}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Project Lead / Owner</label>
                  <input name="owner" value={form.owner} onChange={handleFormChange} placeholder="e.g. Amit Sharma" />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Status</label>
                  <select name="status" value={form.status} onChange={handleFormChange}>
                    <option value="Active">Active</option>
                    <option value="Completed">Completed</option>
                    <option value="On Hold">On Hold</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Priority</label>
                  <select name="priority" value={form.priority} onChange={handleFormChange}>
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Progress (%)</label>
                  <input type="number" name="progress" min="0" max="100" value={form.progress} onChange={handleFormChange} />
                </div>
                <div className="form-group">
                  <label>Due Date</label>
                  <input type="date" name="dueDate" value={form.dueDate} onChange={handleFormChange} />
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea name="description" rows={3} value={form.description} onChange={handleFormChange} placeholder="Project objectives and scope..." />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-submit">{editingProject ? "Save Changes" : "Create Project"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW MODAL */}
      {viewingProject && (
        <div className="modal-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) setViewingProject(null); }}>
          <div className="modal-box">
            <div className="modal-header">
              <h2>Project Overview</h2>
              <button type="button" className="modal-close" onClick={() => setViewingProject(null)}><X size={20} /></button>
            </div>
            <div className="view-body">
              <h3>{viewingProject.name}</h3>
              <p>{viewingProject.description || "Active organization project."}</p>
              <div className="view-grid">
                <div><label>Workspace</label><span>{viewingProject.workspace}</span></div>
                <div><label>Owner</label><span>{viewingProject.owner}</span></div>
                <div><label>Status</label><span>{viewingProject.status}</span></div>
                <div><label>Priority</label><span>{viewingProject.priority}</span></div>
                <div><label>Progress</label><span>{viewingProject.progress}%</span></div>
                <div><label>Due Date</label><span>{viewingProject.dueDate || "-"}</span></div>
              </div>
            </div>
            <div className="modal-actions">
              <button type="button" className="btn-submit" onClick={() => setViewingProject(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon, title, value, type, desc }) {
  return (
    <div className={`admin-projects-stat-card stat-${type}`}>
      <div className={`stat-icon ${type}`}>{icon}</div>
      <div className="stat-info">
        <span className="stat-label">{title}</span>
        <strong className="stat-value">{value}</strong>
        <small className="stat-desc">{desc}</small>
      </div>
    </div>
  );
}