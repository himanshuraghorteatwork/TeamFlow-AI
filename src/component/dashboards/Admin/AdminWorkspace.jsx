import React, { useEffect, useMemo, useState } from "react";
import {
  Building2,
  Users,
  FolderKanban,
  HardDrive,
  CheckCircle2,
  Ban,
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
  Mail,
  User,
  Shield,
  Layers,
  Sparkles,
  Sliders,
  Check,
  AlertCircle,
  MoreVertical,
} from "lucide-react";

import AdminSidebar from "./AdminSidebar.jsx";
import AdminTopbar from "./AdminTopbar.jsx";
import "./AdminWorkspace.css";

const STORAGE_KEY = "teamflow_admin_workspaces";

const DEFAULT_WORKSPACES = [
  {
    id: 1,
    name: "TeamFlow Workspace",
    slug: "teamflow-main",
    status: "Active",
    owner: "Amit Sharma",
    email: "amit@abctech.com",
    members: 24,
    projects: 12,
    storage: 72,
    quota: 100,
    plan: "Enterprise",
    created: "Oct 21, 2026",
    description: "Main organization-wide collaboration and engineering hub.",
  },
  {
    id: 2,
    name: "Marketing Team",
    slug: "marketing-team",
    status: "Active",
    owner: "Sarah Chen",
    email: "sarah@modernlab.com",
    members: 12,
    projects: 8,
    storage: 48,
    quota: 100,
    plan: "Business",
    created: "Oct 18, 2026",
    description: "Product marketing campaigns, content generation, and brand assets.",
  },
  {
    id: 3,
    name: "Design Studio",
    slug: "design-studio",
    status: "Active",
    owner: "Emily Parker",
    email: "emily@designhub.com",
    members: 8,
    projects: 6,
    storage: 61,
    quota: 100,
    plan: "Pro",
    created: "Oct 15, 2026",
    description: "UI/UX component design system, wireframes, and creative prototypes.",
  },
  {
    id: 4,
    name: "Development Hub",
    slug: "development-hub",
    status: "Active",
    owner: "David Lee",
    email: "david@techcorp.com",
    members: 32,
    projects: 18,
    storage: 64,
    quota: 200,
    plan: "Enterprise",
    created: "Oct 12, 2026",
    description: "Core backend architecture, cloud microservices, and CI/CD pipelines.",
  },
  {
    id: 5,
    name: "Research Lab",
    slug: "research-lab",
    status: "Suspended",
    owner: "Alex Morgan",
    email: "alex@researchlab.com",
    members: 16,
    projects: 9,
    storage: 88,
    quota: 100,
    plan: "Business",
    created: "Oct 10, 2026",
    description: "Machine learning research, synthetic data models, and neural experiments.",
  },
  {
    id: 6,
    name: "Startup Team",
    slug: "startup-team",
    status: "Inactive",
    owner: "Michael Rodriguez",
    email: "michael@startup.io",
    members: 5,
    projects: 3,
    storage: 18,
    quota: 50,
    plan: "Free",
    created: "Oct 06, 2026",
    description: "Early validation playground and lightweight MVP projects.",
  },
];

const loadStoredWorkspaces = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error("Failed to load workspaces:", e);
  }
  return DEFAULT_WORKSPACES;
};

export default function AdminWorkspace() {
  const [workspaces, setWorkspaces] = useState(loadStoredWorkspaces);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Filters & Controls
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [planFilter, setPlanFilter] = useState("All");
  const [sortBy, setSortBy] = useState("recent");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' | 'table'

  // Selection & Bulk
  const [selectedIds, setSelectedIds] = useState([]);

  // Modals
  const [createModal, setCreateModal] = useState(false);
  const [editingWorkspace, setEditingWorkspace] = useState(null);
  const [viewingWorkspace, setViewingWorkspace] = useState(null);
  const [quotaModal, setQuotaModal] = useState(null); // workspace to adjust quota
  const [quotaValue, setQuotaValue] = useState(100);
  const [exportOpen, setExportOpen] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [toast, setToast] = useState(null);

  // Form
  const [form, setForm] = useState({
    name: "",
    slug: "",
    owner: "",
    email: "",
    plan: "Pro",
    storage: 20,
    quota: 100,
    members: 5,
    projects: 2,
    status: "Active",
    description: "",
  });

  // Auto dismiss toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3200);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  // Save to localStorage & notify
  const saveWorkspaces = (newWorkspaces) => {
    setWorkspaces(newWorkspaces);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newWorkspaces));
    } catch (e) {
      console.error(e);
    }
    window.dispatchEvent(new Event("teamflow_data_update"));
  };

  // Storage listener
  useEffect(() => {
    const handleSync = () => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) setWorkspaces(JSON.parse(saved));
      } catch (e) {}
    };
    window.addEventListener("storage", handleSync);
    window.addEventListener("teamflow_data_update", handleSync);
    return () => {
      window.removeEventListener("storage", handleSync);
      window.removeEventListener("teamflow_data_update", handleSync);
    };
  }, []);

  // Filtered & Sorted Workspaces
  const filteredWorkspaces = useMemo(() => {
    let result = workspaces.filter((ws) => {
      const query = search.trim().toLowerCase();
      const matchesSearch =
        !query ||
        ws.name?.toLowerCase().includes(query) ||
        ws.owner?.toLowerCase().includes(query) ||
        ws.email?.toLowerCase().includes(query) ||
        ws.plan?.toLowerCase().includes(query);

      const matchesStatus = statusFilter === "All" || ws.status === statusFilter;
      const matchesPlan = planFilter === "All" || ws.plan === planFilter;

      return matchesSearch && matchesStatus && matchesPlan;
    });

    result.sort((a, b) => {
      if (sortBy === "name-asc") return (a.name || "").localeCompare(b.name || "");
      if (sortBy === "name-desc") return (b.name || "").localeCompare(a.name || "");
      if (sortBy === "members") return (b.members || 0) - (a.members || 0);
      if (sortBy === "storage") return (b.storage || 0) - (a.storage || 0);
      return (b.id || 0) - (a.id || 0); // default 'recent'
    });

    return result;
  }, [workspaces, search, statusFilter, planFilter, sortBy]);

  // Statistics
  const stats = useMemo(() => {
    const total = workspaces.length;
    const active = workspaces.filter((w) => w.status === "Active").length;
    const suspended = workspaces.filter((w) => w.status === "Suspended").length;
    const inactive = workspaces.filter((w) => w.status === "Inactive").length;
    const members = workspaces.reduce((acc, curr) => acc + (Number(curr.members) || 0), 0);
    const totalStorage = workspaces.reduce((acc, curr) => acc + (Number(curr.storage) || 0), 0);
    return { total, active, suspended, inactive, members, totalStorage };
  }, [workspaces]);

  // Open Create Modal
  const openCreateModal = () => {
    setEditingWorkspace(null);
    setForm({
      name: "",
      slug: "",
      owner: "Amit Sharma",
      email: "amit@abctech.com",
      plan: "Pro",
      storage: 25,
      quota: 100,
      members: 6,
      projects: 2,
      status: "Active",
      description: "",
    });
    setCreateModal(true);
  };

  // Open Edit Modal
  const openEditModal = (ws) => {
    setEditingWorkspace(ws);
    setForm({
      name: ws.name || "",
      slug: ws.slug || "",
      owner: ws.owner || "",
      email: ws.email || "",
      plan: ws.plan || "Pro",
      storage: ws.storage || 20,
      quota: ws.quota || 100,
      members: ws.members || 1,
      projects: ws.projects || 0,
      status: ws.status || "Active",
      description: ws.description || "",
    });
    setActiveMenuId(null);
    setCreateModal(true);
  };

  // Form changes
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    if (name === "name" && !editingWorkspace) {
      const generatedSlug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      setForm((prev) => ({ ...prev, name: value, slug: generatedSlug }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Submit Form
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.owner.trim()) {
      alert("Workspace name and primary owner are required.");
      return;
    }

    if (editingWorkspace) {
      const updated = workspaces.map((w) =>
        w.id === editingWorkspace.id
          ? {
              ...w,
              ...form,
              members: Number(form.members) || 0,
              projects: Number(form.projects) || 0,
              storage: Number(form.storage) || 0,
              quota: Number(form.quota) || 100,
            }
          : w
      );
      saveWorkspaces(updated);
      showToast(`Workspace "${form.name}" updated successfully.`);
    } else {
      const newWorkspace = {
        id: Date.now(),
        ...form,
        members: Number(form.members) || 1,
        projects: Number(form.projects) || 0,
        storage: Number(form.storage) || 10,
        quota: Number(form.quota) || 100,
        created: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        }),
      };
      saveWorkspaces([newWorkspace, ...workspaces]);
      showToast(`Workspace "${form.name}" created successfully.`);
    }

    setCreateModal(false);
  };

  // Delete Workspace
  const deleteWorkspace = (id, name) => {
    const confirmed = window.confirm(
      `Permanently delete workspace "${name}"? All associated settings will be removed.`
    );
    if (!confirmed) return;
    const remaining = workspaces.filter((w) => w.id !== id);
    saveWorkspaces(remaining);
    setSelectedIds((prev) => prev.filter((item) => item !== id));
    setActiveMenuId(null);
    showToast(`Workspace deleted.`);
  };

  // Duplicate Workspace
  const duplicateWorkspace = (ws) => {
    const clone = {
      ...ws,
      id: Date.now(),
      name: `${ws.name} (Copy)`,
      slug: `${ws.slug || "ws"}-copy-${Math.floor(Math.random() * 900)}`,
      created: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }),
    };
    saveWorkspaces([clone, ...workspaces]);
    setActiveMenuId(null);
    showToast(`Workspace duplicated.`);
  };

  // Toggle Status
  const toggleStatus = (id) => {
    const updated = workspaces.map((w) => {
      if (w.id === id) {
        const next = w.status === "Active" ? "Suspended" : "Active";
        return { ...w, status: next };
      }
      return w;
    });
    saveWorkspaces(updated);
    setActiveMenuId(null);
    showToast("Workspace status updated.");
  };

  // Adjust Quota
  const handleSaveQuota = () => {
    if (!quotaModal) return;
    const updated = workspaces.map((w) =>
      w.id === quotaModal.id ? { ...w, quota: Number(quotaValue) } : w
    );
    saveWorkspaces(updated);
    setQuotaModal(null);
    showToast(`Storage quota updated to ${quotaValue} GB.`);
  };

  // Bulk Actions
  const toggleSelectAll = () => {
    if (selectedIds.length === filteredWorkspaces.length && filteredWorkspaces.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredWorkspaces.map((w) => w.id));
    }
  };

  const toggleSelectOne = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBulkStatus = (newStatus) => {
    if (selectedIds.length === 0) return;
    const updated = workspaces.map((w) =>
      selectedIds.includes(w.id) ? { ...w, status: newStatus } : w
    );
    saveWorkspaces(updated);
    setSelectedIds([]);
    showToast(`${selectedIds.length} workspaces set to ${newStatus}.`);
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    const confirmed = window.confirm(
      `Permanently delete ${selectedIds.length} selected workspaces?`
    );
    if (!confirmed) return;
    const remaining = workspaces.filter((w) => !selectedIds.includes(w.id));
    saveWorkspaces(remaining);
    setSelectedIds([]);
    showToast(`${selectedIds.length} workspaces deleted.`);
  };

  // Exports
  const exportCSV = () => {
    const headers = ["ID", "Name", "Slug", "Plan", "Status", "Owner", "Email", "Members", "Projects", "Storage(GB)", "Quota(GB)", "Created"];
    const rows = filteredWorkspaces.map((w) => [
      w.id,
      `"${w.name}"`,
      `"${w.slug || ""}"`,
      `"${w.plan}"`,
      `"${w.status}"`,
      `"${w.owner}"`,
      `"${w.email}"`,
      w.members,
      w.projects,
      w.storage,
      w.quota || 100,
      `"${w.created}"`,
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = `teamflow_workspaces_${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setExportOpen(false);
    showToast("Exported workspaces to CSV.");
  };

  const exportJSON = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(filteredWorkspaces, null, 2));
    const link = document.createElement("a");
    link.href = dataStr;
    link.download = `teamflow_workspaces_${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setExportOpen(false);
    showToast("Exported workspaces to JSON.");
  };

  const resetToDemo = () => {
    const confirmed = window.confirm("Reset workspaces database to factory demo defaults?");
    if (!confirmed) return;
    saveWorkspaces(DEFAULT_WORKSPACES);
    setSelectedIds([]);
    showToast("Reset to demo workspaces.");
  };

  return (
    <div className="admin-workspace-app">
      {/* SIDEBAR */}
      <AdminSidebar
        mobileOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />

      <div className="admin-workspace-main">
        {/* UNIFIED TOPBAR */}
        <AdminTopbar
          onMobileMenuToggle={() => setMobileSidebarOpen(true)}
          onCreateWorkspace={openCreateModal}
        />

        {/* TOAST */}
        {toast && (
          <div className={`admin-workspace-toast toast--${toast.type}`}>
            <CheckCircle2 size={16} />
            <span>{toast.message}</span>
          </div>
        )}

        {/* CONTENT */}
        <main className="admin-workspace-content">
          {/* HEADING */}
          <section className="admin-workspace-heading">
            <div>
              <h1>Workspaces</h1>
              <p>
                Provision multi-tenant team workspaces, manage storage quotas, monitor usage, and configure access privileges.
              </p>
            </div>

            <div className="admin-workspace-heading-actions">
              {/* EXPORT MENU */}
              <div className="admin-workspace-dropdown-wrap">
                <button
                  type="button"
                  className="admin-workspace-btn-secondary"
                  onClick={() => setExportOpen((prev) => !prev)}
                >
                  <Download size={15} />
                  <span>Export</span>
                  <ChevronDown size={14} />
                </button>

                {exportOpen && (
                  <div className="admin-workspace-export-menu">
                    <button type="button" onClick={exportCSV}>
                      Export as CSV (.csv)
                    </button>
                    <button type="button" onClick={exportJSON}>
                      Export as JSON (.json)
                    </button>
                  </div>
                )}
              </div>

              {/* CREATE WORKSPACE BUTTON */}
              <button
                type="button"
                className="admin-workspace-btn-primary"
                onClick={openCreateModal}
              >
                <Plus size={17} />
                <span>Create Workspace</span>
              </button>
            </div>
          </section>

          {/* STATS ROW (4 CARDS) */}
          <section className="admin-workspace-stats">
            <StatCard
              icon={<Building2 size={22} />}
              title="Total Workspaces"
              value={stats.total}
              type="purple"
              description="Active tenant partitions"
            />
            <StatCard
              icon={<CheckCircle2 size={22} />}
              title="Active Workspaces"
              value={stats.active}
              type="green"
              description={`${Math.round((stats.active / (stats.total || 1)) * 100)}% operational`}
            />
            <StatCard
              icon={<Ban size={22} />}
              title="Suspended / Inactive"
              value={stats.suspended + stats.inactive}
              type="red"
              description="Requires administrative review"
            />
            <StatCard
              icon={<Users size={22} />}
              title="Assigned Members"
              value={stats.members}
              type="blue"
              description="Across all workspaces"
            />
          </section>

          {/* TOOLBAR */}
          <section className="admin-workspace-toolbar">
            <div className="admin-workspace-search">
              <Search size={17} />
              <input
                type="text"
                placeholder="Search workspaces by name, owner, email, or plan..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button
                  type="button"
                  className="admin-workspace-clear-btn"
                  onClick={() => setSearch("")}
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <div className="admin-workspace-controls">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                aria-label="Filter by Status"
              >
                <option value="All">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Suspended">Suspended</option>
                <option value="Inactive">Inactive</option>
              </select>

              <select
                value={planFilter}
                onChange={(e) => setPlanFilter(e.target.value)}
                aria-label="Filter by Plan"
              >
                <option value="All">All Plans</option>
                <option value="Free">Free</option>
                <option value="Pro">Pro</option>
                <option value="Business">Business</option>
                <option value="Enterprise">Enterprise</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                aria-label="Sort Workspaces"
              >
                <option value="recent">Recently Created</option>
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
                <option value="members">Most Members</option>
                <option value="storage">Highest Storage</option>
              </select>

              {/* VIEW SWITCHER */}
              <div className="admin-workspace-view-switch">
                <button
                  type="button"
                  className={`view-btn ${viewMode === "grid" ? "active" : ""}`}
                  onClick={() => setViewMode("grid")}
                  aria-label="Grid view"
                >
                  <Grid2X2 size={16} />
                </button>
                <button
                  type="button"
                  className={`view-btn ${viewMode === "table" ? "active" : ""}`}
                  onClick={() => setViewMode("table")}
                  aria-label="Table view"
                >
                  <List size={16} />
                </button>
              </div>
            </div>
          </section>

          {/* BULK ACTION BAR */}
          {selectedIds.length > 0 && (
            <div className="admin-workspace-bulk-bar">
              <div className="bulk-info">
                <strong>{selectedIds.length}</strong> workspaces selected
              </div>
              <div className="bulk-actions">
                <button
                  type="button"
                  className="bulk-btn bulk-activate"
                  onClick={() => handleBulkStatus("Active")}
                >
                  <CheckCircle2 size={15} />
                  Activate
                </button>
                <button
                  type="button"
                  className="bulk-btn bulk-suspend"
                  onClick={() => handleBulkStatus("Suspended")}
                >
                  <Ban size={15} />
                  Suspend
                </button>
                <button
                  type="button"
                  className="bulk-btn bulk-delete"
                  onClick={handleBulkDelete}
                >
                  <Trash2 size={15} />
                  Delete Selected
                </button>
                <button
                  type="button"
                  className="bulk-btn bulk-cancel"
                  onClick={() => setSelectedIds([])}
                >
                  Deselect All
                </button>
              </div>
            </div>
          )}

          {/* META HEADER */}
          <div className="admin-workspace-meta-header">
            <span>
              Showing {filteredWorkspaces.length} of {workspaces.length} workspaces
            </span>
            <button
              type="button"
              className="admin-workspace-reset-btn"
              onClick={resetToDemo}
            >
              <RotateCcw size={14} />
              Reset Demo Data
            </button>
          </div>

          {/* GRID VIEW */}
          {viewMode === "grid" ? (
            <div className="admin-workspace-grid">
              {filteredWorkspaces.map((ws) => {
                const isSelected = selectedIds.includes(ws.id);
                const quota = ws.quota || 100;
                const storagePercent = Math.min(100, Math.round(((ws.storage || 0) / quota) * 100));

                return (
                  <div
                    key={ws.id}
                    className={`admin-workspace-card ${isSelected ? "card-selected" : ""}`}
                  >
                    {/* CARD HEADER */}
                    <div className="admin-workspace-card-header">
                      <div className="card-header-left">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectOne(ws.id)}
                          aria-label={`Select ${ws.name}`}
                        />
                        <div className="admin-workspace-avatar">
                          {ws.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="admin-workspace-title-area">
                          <h3
                            className="clickable-title"
                            onClick={() => setViewingWorkspace(ws)}
                          >
                            {ws.name}
                          </h3>
                          <div className="admin-workspace-tags">
                            <span className={`status-badge status-${(ws.status || "Active").toLowerCase()}`}>
                              <span className="dot" />
                              {ws.status}
                            </span>
                            <span className={`plan-badge plan-${(ws.plan || "Pro").toLowerCase()}`}>
                              {ws.plan}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* MORE MENU */}
                      <div className="card-menu-wrap">
                        <button
                          type="button"
                          className="card-menu-btn"
                          onClick={() => setActiveMenuId(activeMenuId === ws.id ? null : ws.id)}
                          aria-label="More actions"
                        >
                          <MoreVertical size={16} />
                        </button>

                        {activeMenuId === ws.id && (
                          <div className="card-menu-dropdown">
                            <button type="button" onClick={() => { setViewingWorkspace(ws); setActiveMenuId(null); }}>
                              <Eye size={14} /> View Details
                            </button>
                            <button type="button" onClick={() => openEditModal(ws)}>
                              <Pencil size={14} /> Edit Workspace
                            </button>
                            <button type="button" onClick={() => duplicateWorkspace(ws)}>
                              <Copy size={14} /> Duplicate
                            </button>
                            <button type="button" onClick={() => { setQuotaModal(ws); setQuotaValue(ws.quota || 100); setActiveMenuId(null); }}>
                              <Sliders size={14} /> Adjust Quota
                            </button>
                            <button type="button" onClick={() => toggleStatus(ws.id)}>
                              {ws.status === "Active" ? <Ban size={14} /> : <CheckCircle2 size={14} />}
                              {ws.status === "Active" ? "Suspend Workspace" : "Activate Workspace"}
                            </button>
                            <button type="button" className="menu-danger" onClick={() => deleteWorkspace(ws.id, ws.name)}>
                              <Trash2 size={14} /> Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* OWNER ROW */}
                    <div className="admin-workspace-owner-row">
                      <div className="owner-avatar">
                        {(ws.owner || "U").charAt(0).toUpperCase()}
                      </div>
                      <div className="owner-text">
                        <strong>{ws.owner}</strong>
                        <span>{ws.email}</span>
                      </div>
                    </div>

                    {/* METRICS (MEMBERS & PROJECTS) */}
                    <div className="admin-workspace-metrics-row">
                      <div className="metric-box">
                        <Users size={16} />
                        <span><strong>{ws.members}</strong> Members</span>
                      </div>
                      <div className="metric-box">
                        <FolderKanban size={16} />
                        <span><strong>{ws.projects}</strong> Projects</span>
                      </div>
                    </div>

                    {/* STORAGE PROGRESS */}
                    <div className="admin-workspace-storage-area">
                      <div className="storage-labels">
                        <span><HardDrive size={13} /> Storage</span>
                        <strong>{ws.storage} GB / {quota} GB ({storagePercent}%)</strong>
                      </div>
                      <div className="storage-track">
                        <div
                          className={`storage-fill ${storagePercent > 80 ? "critical" : storagePercent > 60 ? "warning" : ""}`}
                          style={{ width: `${storagePercent}%` }}
                        />
                      </div>
                    </div>

                    {/* CARD FOOTER */}
                    <div className="admin-workspace-card-footer">
                      <span className="created-date">Created {ws.created}</span>
                      <div className="card-quick-actions">
                        <button
                          type="button"
                          className="quick-btn"
                          title="View Details"
                          onClick={() => setViewingWorkspace(ws)}
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          type="button"
                          className="quick-btn"
                          title="Edit Workspace"
                          onClick={() => openEditModal(ws)}
                        >
                          <Pencil size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* TABLE VIEW */
            <div className="admin-workspace-table-wrap">
              <table className="admin-workspace-table">
                <thead>
                  <tr>
                    <th style={{ width: 44, textAlign: "center" }}>
                      <input
                        type="checkbox"
                        checked={selectedIds.length === filteredWorkspaces.length && filteredWorkspaces.length > 0}
                        onChange={toggleSelectAll}
                        aria-label="Select all"
                      />
                    </th>
                    <th>Workspace</th>
                    <th>Status</th>
                    <th>Owner</th>
                    <th>Members</th>
                    <th>Projects</th>
                    <th>Storage</th>
                    <th>Created</th>
                    <th style={{ textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredWorkspaces.map((ws) => {
                    const isSelected = selectedIds.includes(ws.id);
                    const quota = ws.quota || 100;
                    const storagePercent = Math.min(100, Math.round(((ws.storage || 0) / quota) * 100));

                    return (
                      <tr key={ws.id} className={isSelected ? "row-selected" : ""}>
                        <td style={{ textAlign: "center" }}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelectOne(ws.id)}
                            aria-label={`Select ${ws.name}`}
                          />
                        </td>
                        <td>
                          <div className="table-ws-cell">
                            <div className="admin-workspace-avatar sm">
                              {ws.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <strong
                                className="clickable-title"
                                onClick={() => setViewingWorkspace(ws)}
                              >
                                {ws.name}
                              </strong>
                              <span className={`plan-badge plan-${(ws.plan || "Pro").toLowerCase()}`}>
                                {ws.plan}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className={`status-badge status-${(ws.status || "Active").toLowerCase()}`}>
                            <span className="dot" />
                            {ws.status}
                          </span>
                        </td>
                        <td>
                          <div className="table-owner-cell">
                            <strong>{ws.owner}</strong>
                            <span>{ws.email}</span>
                          </div>
                        </td>
                        <td>{ws.members}</td>
                        <td>{ws.projects}</td>
                        <td>
                          <div className="table-storage-cell">
                            <span>{ws.storage} / {quota} GB ({storagePercent}%)</span>
                            <div className="storage-track sm">
                              <div
                                className={`storage-fill ${storagePercent > 80 ? "critical" : storagePercent > 60 ? "warning" : ""}`}
                                style={{ width: `${storagePercent}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td>{ws.created}</td>
                        <td style={{ textAlign: "right" }}>
                          <div className="table-actions">
                            <button
                              type="button"
                              className="quick-btn"
                              title="View"
                              onClick={() => setViewingWorkspace(ws)}
                            >
                              <Eye size={15} />
                            </button>
                            <button
                              type="button"
                              className="quick-btn"
                              title="Edit"
                              onClick={() => openEditModal(ws)}
                            >
                              <Pencil size={15} />
                            </button>
                            <button
                              type="button"
                              className="quick-btn delete"
                              title="Delete"
                              onClick={() => deleteWorkspace(ws.id, ws.name)}
                            >
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
          )}

          {filteredWorkspaces.length === 0 && (
            <div className="admin-workspace-empty">
              <Building2 size={44} />
              <h3>No workspaces found</h3>
              <p>Try adjusting your search criteria, status, or plan filter.</p>
              <button
                type="button"
                className="admin-workspace-clear-btn-solid"
                onClick={() => {
                  setSearch("");
                  setStatusFilter("All");
                  setPlanFilter("All");
                }}
              >
                Clear All Filters
              </button>
            </div>
          )}
        </main>
      </div>

      {/* CREATE / EDIT MODAL */}
      {createModal && (
        <div
          className="admin-workspace-modal-overlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setCreateModal(false);
          }}
        >
          <div className="admin-workspace-modal" role="dialog" aria-modal="true">
            <div className="admin-workspace-modal-header">
              <div>
                <h2>{editingWorkspace ? "Edit Workspace" : "Create New Workspace"}</h2>
                <p>
                  {editingWorkspace
                    ? "Update tenant configurations, quotas, and owner assignments."
                    : "Provision a multi-tenant workspace with custom quotas."}
                </p>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setCreateModal(false)}
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="admin-workspace-form">
              <div className="form-group">
                <label>
                  Workspace Name <span className="req">*</span>
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleFormChange}
                  placeholder="e.g. Design Studio"
                  required
                />
              </div>

              <div className="form-group">
                <label>Slug / Identifier</label>
                <input
                  name="slug"
                  value={form.slug}
                  onChange={handleFormChange}
                  placeholder="design-studio"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>
                    Owner Name <span className="req">*</span>
                  </label>
                  <input
                    name="owner"
                    value={form.owner}
                    onChange={handleFormChange}
                    placeholder="e.g. Sarah Chen"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>
                    Owner Email <span className="req">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleFormChange}
                    placeholder="name@company.com"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Subscription Plan</label>
                  <select name="plan" value={form.plan} onChange={handleFormChange}>
                    <option value="Free">Free Plan</option>
                    <option value="Pro">Pro Plan</option>
                    <option value="Business">Business Plan</option>
                    <option value="Enterprise">Enterprise Plan</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Status</label>
                  <select name="status" value={form.status} onChange={handleFormChange}>
                    <option value="Active">Active</option>
                    <option value="Suspended">Suspended</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Storage Quota (GB)</label>
                  <input
                    type="number"
                    name="quota"
                    min="10"
                    max="1000"
                    value={form.quota}
                    onChange={handleFormChange}
                  />
                </div>

                <div className="form-group">
                  <label>Initial Members</label>
                  <input
                    type="number"
                    name="members"
                    min="1"
                    max="500"
                    value={form.members}
                    onChange={handleFormChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  rows={3}
                  value={form.description}
                  onChange={handleFormChange}
                  placeholder="Describe workspace purpose and target department..."
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setCreateModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  {editingWorkspace ? "Save Changes" : "Create Workspace"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW DETAILS MODAL */}
      {viewingWorkspace && (
        <div
          className="admin-workspace-modal-overlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setViewingWorkspace(null);
          }}
        >
          <div className="admin-workspace-modal view-modal">
            <div className="admin-workspace-modal-header">
              <div>
                <h2>Workspace Overview</h2>
                <p>Detailed organizational tenant telemetry.</p>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setViewingWorkspace(null)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="view-modal-body">
              <div className="view-hero">
                <div className="admin-workspace-avatar lg">
                  {viewingWorkspace.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3>{viewingWorkspace.name}</h3>
                  <p>{viewingWorkspace.description || "Multi-tenant workspace."}</p>
                  <div className="view-badges">
                    <span className={`status-badge status-${(viewingWorkspace.status || "Active").toLowerCase()}`}>
                      <span className="dot" />
                      {viewingWorkspace.status}
                    </span>
                    <span className={`plan-badge plan-${(viewingWorkspace.plan || "Pro").toLowerCase()}`}>
                      {viewingWorkspace.plan}
                    </span>
                  </div>
                </div>
              </div>

              <div className="view-details-grid">
                <div className="detail-item">
                  <label>Primary Owner</label>
                  <span>{viewingWorkspace.owner}</span>
                </div>
                <div className="detail-item">
                  <label>Contact Email</label>
                  <span>{viewingWorkspace.email}</span>
                </div>
                <div className="detail-item">
                  <label>Assigned Members</label>
                  <span>{viewingWorkspace.members} seats</span>
                </div>
                <div className="detail-item">
                  <label>Active Projects</label>
                  <span>{viewingWorkspace.projects} projects</span>
                </div>
                <div className="detail-item">
                  <label>Storage Utilization</label>
                  <span>{viewingWorkspace.storage} GB / {viewingWorkspace.quota || 100} GB</span>
                </div>
                <div className="detail-item">
                  <label>Created Date</label>
                  <span>{viewingWorkspace.created}</span>
                </div>
              </div>
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="btn-cancel"
                onClick={() => {
                  const target = viewingWorkspace;
                  setViewingWorkspace(null);
                  openEditModal(target);
                }}
              >
                <Pencil size={15} /> Edit Workspace
              </button>
              <button
                type="button"
                className="btn-submit"
                onClick={() => setViewingWorkspace(null)}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADJUST QUOTA MODAL */}
      {quotaModal && (
        <div
          className="admin-workspace-modal-overlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setQuotaModal(null);
          }}
        >
          <div className="admin-workspace-modal sm">
            <div className="admin-workspace-modal-header">
              <div>
                <h2>Adjust Storage Quota</h2>
                <p>Change allocated disk quota for {quotaModal.name}.</p>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setQuotaModal(null)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="admin-workspace-form">
              <div className="form-group">
                <label>Storage Quota: <strong>{quotaValue} GB</strong></label>
                <input
                  type="range"
                  min="20"
                  max="1000"
                  step="10"
                  value={quotaValue}
                  onChange={(e) => setQuotaValue(e.target.value)}
                />
                <small style={{ color: "#64748b", marginTop: 4 }}>
                  Current usage: {quotaModal.storage} GB
                </small>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setQuotaModal(null)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn-submit"
                  onClick={handleSaveQuota}
                >
                  Save Quota
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon, title, value, type, description }) {
  return (
    <div className={`admin-workspace-stat-card stat-${type}`}>
      <div className={`admin-workspace-stat-icon ${type}`}>{icon}</div>
      <div className="admin-workspace-stat-info">
        <span className="admin-workspace-stat-label">{title}</span>
        <strong className="admin-workspace-stat-value">{value}</strong>
        <small className="admin-workspace-stat-desc">{description}</small>
      </div>
    </div>
  );
}
