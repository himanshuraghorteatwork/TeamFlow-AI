import React, { useEffect, useMemo, useState } from "react";
import {
  ShieldCheck,
  Plus,
  Search,
  Check,
  X,
  Pencil,
  Trash2,
  Copy,
  Users,
  Lock,
  Download,
  RotateCcw,
  Sliders,
  CheckCircle2,
  AlertCircle,
  Eye,
  KeyRound,
  Shield,
  Layers,
  Sparkles,
} from "lucide-react";

import AdminSidebar from "./AdminSidebar.jsx";
import AdminTopbar from "./AdminTopbar.jsx";
import "./AdminRoles.css";

/* =========================================================
   DEFAULT PERMISSION DEFINITIONS
========================================================= */

const PERMISSION_MODULES = [
  {
    category: "Workspaces",
    description: "Manage organizational tenant environments & quotas",
    permissions: [
      { id: "workspaces.view", name: "View Workspaces", desc: "Access and browse workspaces" },
      { id: "workspaces.create", name: "Create Workspace", desc: "Provision new workspaces" },
      { id: "workspaces.edit", name: "Edit Workspace", desc: "Modify tenant quotas and owners" },
      { id: "workspaces.delete", name: "Delete Workspace", desc: "Permanently remove workspaces" },
      { id: "workspaces.export", name: "Export Workspace Data", desc: "Download CSV/JSON exports" },
    ],
  },
  {
    category: "Projects",
    description: "Team projects, milestones and deadlines",
    permissions: [
      { id: "projects.view", name: "View Projects", desc: "View all project boards" },
      { id: "projects.create", name: "Create Projects", desc: "Initiate new team projects" },
      { id: "projects.edit", name: "Edit Projects", desc: "Change project status & details" },
      { id: "projects.delete", name: "Delete Projects", desc: "Remove or archive projects" },
    ],
  },
  {
    category: "Tasks",
    description: "Work management and task tracking",
    permissions: [
      { id: "tasks.view", name: "View Tasks", desc: "View all task lists and kanbans" },
      { id: "tasks.create", name: "Create Tasks", desc: "Create and assign task tickets" },
      { id: "tasks.update", name: "Update Status", desc: "Mark complete or change status" },
      { id: "tasks.delete", name: "Delete Tasks", desc: "Remove task tickets" },
    ],
  },
  {
    category: "Users & Teams",
    description: "User membership, roles, and profiles",
    permissions: [
      { id: "users.view", name: "View Users", desc: "Browse members directory" },
      { id: "users.invite", name: "Invite Members", desc: "Send invitations to new users" },
      { id: "users.edit", name: "Edit Roles", desc: "Reassign roles and departments" },
      { id: "users.delete", name: "Suspend & Delete", desc: "Revoke platform access" },
    ],
  },
  {
    category: "AI Tools",
    description: "AI assistant, task generation, and automated insights",
    permissions: [
      { id: "ai.assistant", name: "Access AI Assistant", desc: "Interact with TeamFlow AI bot" },
      { id: "ai.generate", name: "Task Suggestions", desc: "Generate automatic task breakdowns" },
      { id: "ai.analytics", name: "View AI Analytics", desc: "Monitor organization token usage" },
    ],
  },
  {
    category: "Billing & Subscriptions",
    description: "Invoicing, payment methods, and tier management",
    permissions: [
      { id: "billing.view", name: "View Invoices", desc: "View past receipts and invoices" },
      { id: "billing.manage", name: "Manage Subscription", desc: "Upgrade/downgrade subscription tier" },
    ],
  },
  {
    category: "Security & Settings",
    description: "Authentication policies, 2FA, and audit trails",
    permissions: [
      { id: "security.audit", name: "View Audit Logs", desc: "Review security and login logs" },
      { id: "security.settings", name: "Organization Settings", desc: "Modify platform configuration" },
    ],
  },
];

// All permission IDs flattened
const ALL_PERMISSION_IDS = PERMISSION_MODULES.flatMap((m) =>
  m.permissions.map((p) => p.id)
);

const DEFAULT_ROLES = [
  {
    id: "role-super-admin",
    name: "Super Admin",
    isSystem: true,
    color: "#6840f5",
    description: "Full, unrestricted root administrative control across all features and configurations.",
    usersCount: 2,
    permissions: [...ALL_PERMISSION_IDS],
  },
  {
    id: "role-org-admin",
    name: "Organization Admin",
    isSystem: true,
    color: "#5b5cf0",
    description: "Manage workspaces, team members, projects, tasks, and organization security settings.",
    usersCount: 3,
    permissions: ALL_PERMISSION_IDS.filter((p) => !p.startsWith("billing.manage")),
  },
  {
    id: "role-team-lead",
    name: "Team Lead",
    isSystem: true,
    color: "#2563eb",
    description: "Oversee project development, assign tasks, review progress, and invite team members.",
    usersCount: 5,
    permissions: [
      "workspaces.view",
      "projects.view",
      "projects.create",
      "projects.edit",
      "tasks.view",
      "tasks.create",
      "tasks.update",
      "users.view",
      "users.invite",
      "ai.assistant",
      "ai.generate",
    ],
  },
  {
    id: "role-member",
    name: "Member / Developer",
    isSystem: true,
    color: "#10b981",
    description: "Execute assigned project tasks, collaborate with team chat, and utilize AI assistants.",
    usersCount: 14,
    permissions: [
      "workspaces.view",
      "projects.view",
      "tasks.view",
      "tasks.update",
      "users.view",
      "ai.assistant",
    ],
  },
  {
    id: "role-viewer",
    name: "Viewer / Guest",
    isSystem: true,
    color: "#64748b",
    description: "Read-only preview access to shared projects and organizational announcements.",
    usersCount: 4,
    permissions: ["workspaces.view", "projects.view", "tasks.view", "users.view"],
  },
];

const STORAGE_KEY = "teamflow_admin_roles";

export default function AdminRoles() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Load roles from localStorage or defaults
  const [roles, setRoles] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return DEFAULT_ROLES;
  });

  const [activeTab, setActiveTab] = useState("matrix"); // 'matrix' | 'cards'
  const [selectedRole, setSelectedRole] = useState(roles[1]); // default to Org Admin
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState("matrix"); // "matrix" | "detail"
  const [toast, setToast] = useState(null);

  // Modals
  const [createModal, setCreateModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [editingRole, setEditingRole] = useState(null);

  const [createForm, setCreateForm] = useState({
    name: "",
    description: "",
    color: "#8b5cf6",
    cloneFrom: "role-member",
    permissions: [],
  });

  // Save roles & log activity
  const saveRoles = (newRoles) => {
    setRoles(newRoles);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newRoles));
    } catch (e) {}
    window.dispatchEvent(new Event("teamflow_data_update"));
  };

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Toggle single permission for selected role
  const handleTogglePermission = (roleId, permissionId) => {
    const targetRole = roles.find((r) => r.id === roleId);
    if (!targetRole) return;

    if (targetRole.id === "role-super-admin") {
      showToast("Super Admin permissions cannot be modified.", "error");
      return;
    }

    const hasPerm = targetRole.permissions.includes(permissionId);
    const updatedPermissions = hasPerm
      ? targetRole.permissions.filter((p) => p !== permissionId)
      : [...targetRole.permissions, permissionId];

    const nextRoles = roles.map((r) =>
      r.id === roleId ? { ...r, permissions: updatedPermissions } : r
    );

    saveRoles(nextRoles);
    setSelectedRole((prev) =>
      prev?.id === roleId ? { ...prev, permissions: updatedPermissions } : prev
    );
    showToast(`Updated permission for ${targetRole.name}`);
  };

  // Toggle entire module category permissions
  const handleToggleModuleAll = (roleId, modulePermissions) => {
    const targetRole = roles.find((r) => r.id === roleId);
    if (!targetRole) return;

    if (targetRole.id === "role-super-admin") {
      showToast("Super Admin permissions cannot be modified.", "error");
      return;
    }

    const moduleIds = modulePermissions.map((p) => p.id);
    const allEnabled = moduleIds.every((id) => targetRole.permissions.includes(id));

    let updatedPermissions = [];
    if (allEnabled) {
      // Disable all in this module
      updatedPermissions = targetRole.permissions.filter((id) => !moduleIds.includes(id));
    } else {
      // Enable all in this module
      const toAdd = moduleIds.filter((id) => !targetRole.permissions.includes(id));
      updatedPermissions = [...targetRole.permissions, ...toAdd];
    }

    const nextRoles = roles.map((r) =>
      r.id === roleId ? { ...r, permissions: updatedPermissions } : r
    );

    saveRoles(nextRoles);
    setSelectedRole((prev) =>
      prev?.id === roleId ? { ...prev, permissions: updatedPermissions } : prev
    );
    showToast(`Updated permissions for ${targetRole.name}`);
  };

  // Create Custom Role
  const handleCreateRole = (e) => {
    e.preventDefault();
    const name = createForm.name.trim();
    if (!name) {
      showToast("Role name is required.", "error");
      return;
    }

    const baseRole = roles.find((r) => r.id === createForm.cloneFrom);
    const initialPerms = baseRole ? [...baseRole.permissions] : [];

    const newRole = {
      id: `role-${Date.now()}`,
      name,
      description: createForm.description || "Custom organization role with tailored access rights.",
      color: createForm.color || "#8b5cf6",
      isSystem: false,
      usersCount: 0,
      permissions: initialPerms,
    };

    const nextRoles = [...roles, newRole];
    saveRoles(nextRoles);
    setSelectedRole(newRole);
    setCreateModal(false);
    setCreateForm({
      name: "",
      description: "",
      color: "#8b5cf6",
      cloneFrom: "role-member",
      permissions: [],
    });
    showToast(`Custom role "${name}" created successfully!`, "success");
  };

  // Edit Role Modal
  const openEditRoleModal = (role) => {
    setEditingRole({ ...role });
    setEditModal(true);
  };

  const handleUpdateRole = (e) => {
    e.preventDefault();
    if (!editingRole) return;

    const nextRoles = roles.map((r) =>
      r.id === editingRole.id ? { ...r, ...editingRole } : r
    );

    saveRoles(nextRoles);
    setSelectedRole((prev) => (prev?.id === editingRole.id ? { ...editingRole } : prev));
    setEditModal(false);
    setEditingRole(null);
    showToast(`Role "${editingRole.name}" updated!`);
  };

  // Delete Custom Role
  const handleDeleteRole = (roleId) => {
    const role = roles.find((r) => r.id === roleId);
    if (!role) return;

    if (role.isSystem) {
      showToast("System protected roles cannot be deleted.", "error");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete role "${role.name}"? Users with this role will revert to Member.`
    );
    if (!confirmed) return;

    const nextRoles = roles.filter((r) => r.id !== roleId);
    saveRoles(nextRoles);
    if (selectedRole?.id === roleId) {
      setSelectedRole(nextRoles[0]);
    }
    showToast(`Role "${role.name}" deleted.`, "info");
  };

  // Clone Role
  const handleDuplicateRole = (role) => {
    const cloned = {
      ...role,
      id: `role-${Date.now()}`,
      name: `${role.name} (Copy)`,
      isSystem: false,
      usersCount: 0,
    };

    const nextRoles = [...roles, cloned];
    saveRoles(nextRoles);
    setSelectedRole(cloned);
    showToast(`Duplicated role as "${cloned.name}"!`);
  };

  // Reset to default roles
  const handleResetDefaults = () => {
    const confirmed = window.confirm("Reset all roles and permissions to factory defaults?");
    if (!confirmed) return;

    saveRoles(DEFAULT_ROLES);
    setSelectedRole(DEFAULT_ROLES[1]);
    showToast("Roles reset to system defaults.");
  };

  // Export Matrix
  const handleExportMatrix = () => {
    const exportData = roles.map((r) => ({
      id: r.id,
      name: r.name,
      description: r.description,
      usersCount: r.usersCount,
      permissionsCount: r.permissions.length,
      permissions: r.permissions,
    }));

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `teamflow_roles_permissions_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("Roles & permissions exported to JSON!", "success");
  };

  // Filter modules/permissions by search
  const filteredModules = useMemo(() => {
    if (!search.trim()) return PERMISSION_MODULES;
    const q = search.toLowerCase();
    return PERMISSION_MODULES.map((m) => ({
      ...m,
      permissions: m.permissions.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.desc.toLowerCase().includes(q) ||
          m.category.toLowerCase().includes(q)
      ),
    })).filter((m) => m.permissions.length > 0);
  }, [search]);

  return (
    <div className="tfAdminRoles">
      {/* SIDEBAR */}
      <AdminSidebar
        mobileOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />

      <div className="tfAdminRoles__main">
        {/* UNIFIED TOPBAR */}
        <AdminTopbar onMobileMenuToggle={() => setMobileSidebarOpen(true)} />

        {/* TOAST ALERT */}
        {toast && (
          <div className={`tfAdminRoles__toast tfAdminRoles__toast--${toast.type || "success"}`}>
            <Check size={16} />
            <span>{toast.message}</span>
          </div>
        )}

        <div className="tfAdminRoles__content">
          {/* HEADER */}
          <div className="tfAdminRoles__header">
            <div>
              <h1>Roles & Permissions</h1>
              <p>
                Manage role access controls, define granular tenant permissions, and secure multi-user governance.
              </p>
            </div>

            <div className="tfAdminRoles__headerActions">
              <button
                type="button"
                className="tfAdminRoles__btnSecondary"
                onClick={handleExportMatrix}
              >
                <Download size={15} />
                <span>Export Matrix</span>
              </button>

              <button
                type="button"
                className="tfAdminRoles__btnPrimary"
                onClick={() => setCreateModal(true)}
              >
                <Plus size={16} />
                <span>Create Role</span>
              </button>
            </div>
          </div>

          {/* ROLES SUMMARY CARDS */}
          <div className="tfAdminRoles__kpiGrid">
            <div className="tfAdminRoles__kpiCard">
              <div className="tfAdminRoles__kpiIcon purple">
                <ShieldCheck size={22} />
              </div>
              <div>
                <span>Configured Roles</span>
                <strong>{roles.length}</strong>
                <small>{roles.filter((r) => !r.isSystem).length} Custom Roles</small>
              </div>
            </div>

            <div className="tfAdminRoles__kpiCard">
              <div className="tfAdminRoles__kpiIcon blue">
                <KeyRound size={22} />
              </div>
              <div>
                <span>System Permissions</span>
                <strong>{ALL_PERMISSION_IDS.length}</strong>
                <small>Across 7 security modules</small>
              </div>
            </div>

            <div className="tfAdminRoles__kpiCard">
              <div className="tfAdminRoles__kpiIcon green">
                <Users size={22} />
              </div>
              <div>
                <span>Assigned Users</span>
                <strong>{roles.reduce((acc, r) => acc + (r.usersCount || 0), 0)}</strong>
                <small>Users with defined roles</small>
              </div>
            </div>

            <div className="tfAdminRoles__kpiCard">
              <div className="tfAdminRoles__kpiIcon amber">
                <Lock size={22} />
              </div>
              <div>
                <span>RBAC Security</span>
                <strong>Enforced</strong>
                <small>Role-based access active</small>
              </div>
            </div>
          </div>

          {/* ROLE SELECTOR BAR & TABS */}
          <div className="tfAdminRoles__controlsBar">
            <div className="tfAdminRoles__rolesTabs">
              {roles.map((role) => {
                const isActive = selectedRole?.id === role.id;
                return (
                  <button
                    key={role.id}
                    type="button"
                    className={`tfAdminRoles__roleTab ${isActive ? "active" : ""}`}
                    onClick={() => setSelectedRole(role)}
                  >
                    <span
                      className="tfAdminRoles__roleDot"
                      style={{ backgroundColor: role.color || "#5b5cf0" }}
                    />
                    <strong>{role.name}</strong>
                    <span className="tfAdminRoles__roleCount">
                      {role.permissions.length} perms
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="tfAdminRoles__controlsRight">
              <div className="tfAdminRoles__search">
                <Search size={15} />
                <input
                  type="text"
                  placeholder="Filter permissions..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                {search && (
                  <button type="button" onClick={() => setSearch("")}>
                    <X size={14} />
                  </button>
                )}
              </div>

              <button
                type="button"
                className="tfAdminRoles__btnReset"
                onClick={handleResetDefaults}
                title="Reset to system defaults"
              >
                <RotateCcw size={14} />
                <span>Reset Defaults</span>
              </button>
            </div>
          </div>


          {/* VIEW MODE TOGGLE */}
          <div className="tfAdminRoles__viewModeRow">
            <div className="tfAdminRoles__viewModeToggle">
              <button
                type="button"
                className={`view-mode-btn ${viewMode === "matrix" ? "active" : ""}`}
                onClick={() => setViewMode("matrix")}
              >
                <Layers size={14} />
                <span>Full Permissions Matrix</span>
              </button>
              <button
                type="button"
                className={`view-mode-btn ${viewMode === "detail" ? "active" : ""}`}
                onClick={() => setViewMode("detail")}
              >
                <Sliders size={14} />
                <span>Role Inspector & Toggles</span>
              </button>
            </div>
          </div>

          {/* VIEW 1: FULL SAAS TABLE MATRIX */}
          {viewMode === "matrix" && (
            <div className="tfAdminRoles__tableCard">
              <div className="tfAdminRoles__tableResponsive">
                <table className="tfAdminRoles__matrixTable">
                  <thead>
                    <tr>
                      <th className="perm-col">PERMISSION & CAPABILITY</th>
                      {roles.map((r) => (
                        <th key={r.id} className="role-col">
                          <div className="role-th">
                            <span className="th-dot" style={{ backgroundColor: r.color }} />
                            <span>{r.name}</span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredModules.map((module) => (
                      <React.Fragment key={module.category}>
                        <tr className="category-row">
                          <td colSpan={roles.length + 1}>
                            <div className="category-header-wrap">
                              <strong>{module.category}</strong>
                              <span>{module.description}</span>
                            </div>
                          </td>
                        </tr>
                        {module.permissions.map((p) => (
                          <tr key={p.id} className="permission-row">
                            <td className="perm-info-td">
                              <strong>{p.name}</strong>
                              <small>{p.desc}</small>
                            </td>
                            {roles.map((r) => {
                              const hasPerm = r.permissions.includes(p.id);
                              const isLocked = r.id === "role-super-admin";
                              return (
                                <td key={r.id} className="role-check-td">
                                  <label className="matrix-checkbox-wrap">
                                    <input
                                      type="checkbox"
                                      checked={hasPerm}
                                      disabled={isLocked}
                                      onChange={() => handleTogglePermission(r.id, p.id)}
                                      title={isLocked ? "Super Admin permissions are locked" : `Toggle ${p.name} for ${r.name}`}
                                    />
                                    <span className={`matrix-check-custom ${hasPerm ? "checked" : ""} ${isLocked ? "locked" : ""}`}>
                                      {hasPerm && <Check size={11} strokeWidth={3} />}
                                    </span>
                                  </label>
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* VIEW 2: ROLE DETAIL CARDS & TOGGLES */}
          {viewMode === "detail" && (
            <>
          {/* ACTIVE ROLE DETAIL CARD */}
          {selectedRole && (
            <div className="tfAdminRoles__roleBanner">
              <div className="tfAdminRoles__roleBannerLeft">
                <div
                  className="tfAdminRoles__roleBadge"
                  style={{
                    backgroundColor: `${selectedRole.color || "#5b5cf0"}18`,
                    color: selectedRole.color || "#5b5cf0",
                    borderColor: `${selectedRole.color || "#5b5cf0"}35`,
                  }}
                >
                  <Shield size={16} />
                  <span>{selectedRole.name}</span>
                </div>

                <div className="tfAdminRoles__roleMeta">
                  <p>{selectedRole.description}</p>
                  <div className="tfAdminRoles__rolePills">
                    <span>
                      <Users size={13} /> {selectedRole.usersCount || 0} Assigned Members
                    </span>
                    <span>
                      <CheckCircle2 size={13} /> {selectedRole.permissions.length} of{" "}
                      {ALL_PERMISSION_IDS.length} Permissions Active
                    </span>
                    {selectedRole.isSystem && (
                      <span className="system-pill">System Role</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="tfAdminRoles__roleBannerActions">
                <button
                  type="button"
                  className="action-btn"
                  onClick={() => openEditRoleModal(selectedRole)}
                  title="Edit role details"
                >
                  <Pencil size={15} />
                  <span>Edit</span>
                </button>

                <button
                  type="button"
                  className="action-btn"
                  onClick={() => handleDuplicateRole(selectedRole)}
                  title="Clone this role"
                >
                  <Copy size={15} />
                  <span>Clone</span>
                </button>

                {!selectedRole.isSystem && (
                  <button
                    type="button"
                    className="action-btn delete"
                    onClick={() => handleDeleteRole(selectedRole.id)}
                    title="Delete custom role"
                  >
                    <Trash2 size={15} />
                    <span>Delete</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* PERMISSIONS MATRIX */}
          <div className="tfAdminRoles__matrixCard">
            <div className="tfAdminRoles__matrixHeader">
              <h3>Permissions Matrix for {selectedRole?.name}</h3>
              <p>
                Toggle access rights below. Changes are saved automatically and take effect across the workspace.
              </p>
            </div>

            <div className="tfAdminRoles__matrixList">
              {filteredModules.map((module) => {
                const moduleIds = module.permissions.map((p) => p.id);
                const activeCount = moduleIds.filter((id) =>
                  selectedRole?.permissions.includes(id)
                ).length;
                const isAllActive = activeCount === moduleIds.length;

                return (
                  <div key={module.category} className="tfAdminRoles__moduleSection">
                    <div className="tfAdminRoles__moduleHeader">
                      <div>
                        <h4>{module.category}</h4>
                        <small>{module.description}</small>
                      </div>

                      <div className="tfAdminRoles__moduleHeaderRight">
                        <span className="count-tag">
                          {activeCount} of {moduleIds.length} enabled
                        </span>
                        <button
                          type="button"
                          className="toggle-all-btn"
                          onClick={() =>
                            handleToggleModuleAll(selectedRole.id, module.permissions)
                          }
                        >
                          {isAllActive ? "Deselect All" : "Select All"}
                        </button>
                      </div>
                    </div>

                    <div className="tfAdminRoles__permGrid">
                      {module.permissions.map((perm) => {
                        const isGranted = selectedRole?.permissions.includes(perm.id);
                        return (
                          <div
                            key={perm.id}
                            className={`tfAdminRoles__permItem ${isGranted ? "granted" : ""}`}
                            onClick={() =>
                              handleTogglePermission(selectedRole.id, perm.id)
                            }
                          >
                            <div className="tfAdminRoles__checkboxWrap">
                              <input
                                type="checkbox"
                                checked={isGranted}
                                onChange={() => {}} // handled by wrapper click
                                aria-label={perm.name}
                              />
                            </div>

                            <div className="tfAdminRoles__permInfo">
                              <strong>{perm.name}</strong>
                              <p>{perm.desc}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
            </>
          )}
        </div>
      </div>

      {/* CREATE ROLE MODAL */}
      {createModal && (
        <div
          className="tfAdminRoles__modalOverlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setCreateModal(false);
          }}
        >
          <div className="tfAdminRoles__modal">
            <div className="tfAdminRoles__modalHeader">
              <div>
                <h2>Create Custom Role</h2>
                <p>Define a new role and clone existing permission templates.</p>
              </div>
              <button type="button" onClick={() => setCreateModal(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateRole} className="tfAdminRoles__form">
              <label>
                Role Name *
                <input
                  type="text"
                  required
                  placeholder="e.g. Product Manager"
                  value={createForm.name}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, name: e.target.value })
                  }
                />
              </label>

              <label>
                Role Description
                <textarea
                  rows="2"
                  placeholder="Describe the scope of responsibilities for this role..."
                  value={createForm.description}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, description: e.target.value })
                  }
                />
              </label>

              <div className="tfAdminRoles__formGrid">
                <label>
                  Clone Permissions From
                  <select
                    value={createForm.cloneFrom}
                    onChange={(e) =>
                      setCreateForm({ ...createForm, cloneFrom: e.target.value })
                    }
                  >
                    {roles.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name} ({r.permissions.length} perms)
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  Role Badge Color
                  <select
                    value={createForm.color}
                    onChange={(e) =>
                      setCreateForm({ ...createForm, color: e.target.value })
                    }
                  >
                    <option value="#5b5cf0">TeamFlow Indigo (#5b5cf0)</option>
                    <option value="#2563eb">Royal Blue (#2563eb)</option>
                    <option value="#10b981">Emerald Green (#10b981)</option>
                    <option value="#8b5cf6">Purple (#8b5cf6)</option>
                    <option value="#f43f5e">Rose (#f43f5e)</option>
                    <option value="#f59e0b">Amber (#f59e0b)</option>
                  </select>
                </label>
              </div>

              <div className="tfAdminRoles__modalActions">
                <button
                  type="button"
                  className="cancel"
                  onClick={() => setCreateModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="save">
                  <Plus size={16} />
                  <span>Create Role</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT ROLE MODAL */}
      {editModal && editingRole && (
        <div
          className="tfAdminRoles__modalOverlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setEditModal(false);
          }}
        >
          <div className="tfAdminRoles__modal">
            <div className="tfAdminRoles__modalHeader">
              <div>
                <h2>Edit Role</h2>
                <p>Update title, description, and visual theme for this role.</p>
              </div>
              <button type="button" onClick={() => setEditModal(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleUpdateRole} className="tfAdminRoles__form">
              <label>
                Role Name *
                <input
                  type="text"
                  required
                  disabled={editingRole.isSystem}
                  value={editingRole.name}
                  onChange={(e) =>
                    setEditingRole({ ...editingRole, name: e.target.value })
                  }
                />
              </label>

              <label>
                Role Description
                <textarea
                  rows="2"
                  value={editingRole.description || ""}
                  onChange={(e) =>
                    setEditingRole({ ...editingRole, description: e.target.value })
                  }
                />
              </label>

              <label>
                Badge Color
                <select
                  value={editingRole.color || "#5b5cf0"}
                  onChange={(e) =>
                    setEditingRole({ ...editingRole, color: e.target.value })
                  }
                >
                  <option value="#5b5cf0">TeamFlow Indigo</option>
                  <option value="#2563eb">Royal Blue</option>
                  <option value="#10b981">Emerald Green</option>
                  <option value="#8b5cf6">Purple</option>
                  <option value="#f43f5e">Rose</option>
                  <option value="#f59e0b">Amber</option>
                </select>
              </label>

              <div className="tfAdminRoles__modalActions">
                <button
                  type="button"
                  className="cancel"
                  onClick={() => setEditModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="save">
                  <Check size={16} />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

