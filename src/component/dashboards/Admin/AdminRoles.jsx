import React, { useEffect, useMemo, useState } from "react";
import {
  ShieldCheck,
  Shield,
  ShieldAlert,
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
  Layers,
  Sparkles,
  Building2,
  Folder,
  CheckSquare,
  CreditCard,
  Crown,
  Code,
  FileText,
  BarChart3,
  Bug,
  Calendar,
  Megaphone,
  Settings,
  ChevronRight,
  ChevronDown,
  Clock,
  ExternalLink,
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight,
  UserCheck,
  UserX,
} from "lucide-react";

import AdminSidebar from "./AdminSidebar.jsx";
import AdminTopbar from "./AdminTopbar.jsx";
import "./AdminRoles.css";

/* =========================================================
   PERMISSION MODULES DEFINITIONS (12 COMPREHENSIVE MODULES)
========================================================= */

export const PERMISSION_MODULES = [
  {
    category: "Workspaces",
    icon: Building2,
    color: "#6366f1",
    bg: "rgba(99, 102, 241, 0.12)",
    description: "Manage organizational workspaces and quotas",
    permissions: [
      { id: "workspaces.view", name: "View Workspaces", desc: "Access and browse workspaces" },
      { id: "workspaces.create", name: "Create Workspace", desc: "Provision new workspaces" },
      { id: "workspaces.edit", name: "Edit Workspace", desc: "Modify tenant quotas and owners" },
      { id: "workspaces.delete", name: "Delete Workspace", desc: "Permanently remove workspaces", sensitive: true },
      { id: "workspaces.export", name: "Export Workspace Data", desc: "Download CSV/JSON exports" },
    ],
  },
  {
    category: "Projects",
    icon: Folder,
    color: "#2563eb",
    bg: "rgba(37, 99, 235, 0.12)",
    description: "Team projects, milestones and deadlines",
    permissions: [
      { id: "projects.view", name: "View Projects", desc: "View all project boards" },
      { id: "projects.create", name: "Create Projects", desc: "Initiate new team projects" },
      { id: "projects.edit", name: "Edit Projects", desc: "Change project status & details" },
      { id: "projects.delete", name: "Delete Projects", desc: "Remove or archive projects", sensitive: true },
    ],
  },
  {
    category: "Tasks",
    icon: CheckSquare,
    color: "#10b981",
    bg: "rgba(16, 185, 129, 0.12)",
    description: "Task management and tracking",
    permissions: [
      { id: "tasks.view", name: "View Tasks", desc: "Access tasks and sprints" },
      { id: "tasks.create", name: "Create Tasks", desc: "Create new task tickets" },
      { id: "tasks.update", name: "Update Status", desc: "Transition task workflow state" },
      { id: "tasks.delete", name: "Delete Tasks", desc: "Purge task tickets", sensitive: true },
    ],
  },
  {
    category: "Bugs",
    icon: Bug,
    color: "#f43f5e",
    bg: "rgba(244, 63, 94, 0.12)",
    description: "Bug tracking and issue management",
    permissions: [
      { id: "bugs.view", name: "View Bugs", desc: "Browse bug reports and triage" },
      { id: "bugs.create", name: "Create Bugs", desc: "Log and submit bug reports" },
      { id: "bugs.update", name: "Update Bugs", desc: "Change severity and status" },
      { id: "bugs.delete", name: "Delete Bugs", desc: "Permanently delete bug records", sensitive: true },
    ],
  },
  {
    category: "Calendar",
    icon: Calendar,
    color: "#f59e0b",
    bg: "rgba(245, 158, 11, 0.12)",
    description: "Manage events, meetings and schedules",
    permissions: [
      { id: "calendar.view", name: "View Calendar", desc: "Access calendar and timelines" },
      { id: "calendar.create", name: "Create Events", desc: "Schedule events and sprints" },
      { id: "calendar.edit", name: "Edit Events", desc: "Modify calendar entries" },
      { id: "calendar.delete", name: "Delete Events", desc: "Cancel scheduled meetings", sensitive: true },
    ],
  },
  {
    category: "Files",
    icon: FileText,
    color: "#06b6d4",
    bg: "rgba(6, 182, 212, 0.12)",
    description: "File storage and document management",
    permissions: [
      { id: "files.view", name: "View Files", desc: "Browse organizational assets" },
      { id: "files.upload", name: "Upload Files", desc: "Upload documents and media" },
      { id: "files.delete", name: "Delete Files", desc: "Remove uploaded files", sensitive: true },
      { id: "files.manage", name: "Manage File Access", desc: "Set file access privileges" },
    ],
  },
  {
    category: "Users & Teams",
    icon: Users,
    color: "#8b5cf6",
    bg: "rgba(139, 92, 246, 0.12)",
    description: "User management and team administration",
    permissions: [
      { id: "users.view", name: "View Users", desc: "Browse members directory" },
      { id: "users.create", name: "Create Users", desc: "Invite new team members" },
      { id: "users.edit", name: "Edit Users", desc: "Modify user credentials & teams" },
      { id: "users.delete", name: "Delete Users", desc: "Revoke organizational access", sensitive: true },
      { id: "users.manage_roles", name: "Manage Roles", desc: "Assign and reassign roles", sensitive: true },
    ],
  },
  {
    category: "Reports & Analytics",
    icon: BarChart3,
    color: "#6366f1",
    bg: "rgba(99, 102, 241, 0.12)",
    description: "Access reports and analytics data",
    permissions: [
      { id: "reports.view", name: "View Reports", desc: "Inspect velocity metrics" },
      { id: "reports.export", name: "Export Reports", desc: "Download executive CSV/PDF" },
      { id: "analytics.view", name: "View Analytics", desc: "View real-time dashboard data" },
      { id: "dashboards.manage", name: "Manage Dashboards", desc: "Configure custom KPI widgets" },
    ],
  },
  {
    category: "AI Assistant",
    icon: Sparkles,
    color: "#14b8a6",
    bg: "rgba(20, 184, 166, 0.12)",
    description: "AI tools and assistant access",
    permissions: [
      { id: "ai.assistant", name: "Access AI Assistant", desc: "Chat with TeamFlow AI agent" },
      { id: "ai.generate", name: "Task Breakdown", desc: "Generate automated task breakdown" },
      { id: "ai.analytics", name: "View AI Analytics", desc: "Monitor prompt tokens and latency" },
    ],
  },
  {
    category: "Announcements",
    icon: Megaphone,
    color: "#38bdf8",
    bg: "rgba(56, 189, 248, 0.12)",
    description: "Create and manage announcements",
    permissions: [
      { id: "announcements.view", name: "View Announcements", desc: "Read organizational bulletins" },
      { id: "announcements.create", name: "Publish Broadcasts", desc: "Create and send announcements" },
      { id: "announcements.delete", name: "Delete Broadcasts", desc: "Remove expired announcements" },
    ],
  },
  {
    category: "Billing",
    icon: CreditCard,
    color: "#eab308",
    bg: "rgba(234, 179, 8, 0.12)",
    description: "Subscription and billing management",
    permissions: [
      { id: "billing.view", name: "View Invoices", desc: "Access subscription history" },
      { id: "billing.manage", name: "Manage Billing", desc: "Upgrade or downgrade plans", sensitive: true },
      { id: "billing.payment", name: "Payment Methods", desc: "Update cards and banking info", sensitive: true },
      { id: "billing.invoices", name: "Download Invoices", desc: "Download tax invoices & receipts" },
    ],
  },
  {
    category: "Organization Settings",
    icon: Settings,
    color: "#f97316",
    bg: "rgba(249, 115, 22, 0.12)",
    description: "Manage organization settings",
    permissions: [
      { id: "org.view", name: "View Org Profile", desc: "Inspect domain and branding info" },
      { id: "org.edit", name: "Edit Org Profile", desc: "Modify tenant name & logo" },
      { id: "security.settings", name: "Security & 2FA", desc: "Configure SSO and 2FA policies", sensitive: true },
      { id: "security.audit", name: "Audit Trail", desc: "Review security and login logs" },
    ],
  },
];

export const ALL_PERMISSION_IDS = PERMISSION_MODULES.flatMap((m) =>
  m.permissions.map((p) => p.id)
);

export const SENSITIVE_PERMISSION_IDS = PERMISSION_MODULES.flatMap((m) =>
  m.permissions.filter((p) => p.sensitive).map((p) => p.id)
);

/* =========================================================
   STANDARD ROLES (5 KEY ROLES MATCHING REFERENCE DESIGN)
========================================================= */

export const DEFAULT_ROLES = [
  {
    id: "role-org-admin",
    code: "ROL-001",
    name: "Organization Admin",
    isSystem: true,
    color: "#6366f1",
    iconKey: "Building2",
    tag: "System Role",
    description: "Manage organization and teams, workspaces, projects, tasks, and organization security settings.",
    usersCount: 28,
    permissions: ALL_PERMISSION_IDS.filter((id) => id !== "workspaces.delete" && id !== "bugs.delete"),
  },
  {
    id: "role-team-lead",
    code: "ROL-002",
    name: "Team Lead",
    isSystem: true,
    color: "#10b981",
    iconKey: "Users",
    tag: "System Role",
    description: "Manage projects and team members, assign tasks, review progress, and invite members.",
    usersCount: 14,
    permissions: [
      "workspaces.view",
      "projects.view",
      "projects.create",
      "projects.edit",
      "tasks.view",
      "tasks.create",
      "tasks.update",
      "bugs.view",
      "bugs.create",
      "bugs.update",
      "calendar.view",
      "calendar.create",
      "calendar.edit",
      "files.view",
      "files.upload",
      "users.view",
      "users.create",
      "reports.view",
      "ai.assistant",
      "ai.generate",
      "announcements.view",
    ],
  },
  {
    id: "role-member",
    code: "ROL-003",
    name: "Member / Developer",
    isSystem: true,
    color: "#2563eb",
    iconKey: "Code",
    tag: "System Role",
    description: "Execute tasks and collaborate with team members, chat, and utilize AI assistants.",
    usersCount: 42,
    permissions: [
      "workspaces.view",
      "projects.view",
      "tasks.view",
      "tasks.create",
      "tasks.update",
      "bugs.view",
      "bugs.create",
      "calendar.view",
      "files.view",
      "files.upload",
      "users.view",
      "ai.assistant",
      "announcements.view",
    ],
  },
  {
    id: "role-viewer",
    code: "ROL-004",
    name: "Viewer / Guest",
    isSystem: true,
    color: "#f43f5e",
    iconKey: "Eye",
    tag: "System Role",
    description: "Read-only access to shared projects, tasks, and organizational announcements.",
    usersCount: 18,
    permissions: [
      "workspaces.view",
      "projects.view",
      "tasks.view",
      "bugs.view",
      "calendar.view",
      "files.view",
      "users.view",
      "announcements.view",
    ],
  },
];

const SAMPLE_USERS = [
  { id: "u-1", name: "David Lee", email: "david@techcorp.com", department: "Engineering", roleId: "role-org-admin", status: "Active", avatar: "DL" },
  { id: "u-2", name: "Emily Parker", email: "emily@designhub.com", department: "Product Design", roleId: "role-team-lead", status: "Active", avatar: "EP" },
  { id: "u-3", name: "John Doe", email: "john@company.com", department: "Management", roleId: "role-org-admin", status: "Active", avatar: "JD" },
  { id: "u-4", name: "Michael Rodriguez", email: "michael@startup.io", department: "Engineering", roleId: "role-member", status: "Inactive", avatar: "MR" },
  { id: "u-5", name: "Sarah Chen", email: "sarah@modernlab.com", department: "Engineering", roleId: "role-member", status: "Active", avatar: "SC" },
  { id: "u-6", name: "Himanshu R", email: "himanshu@teamflow.ai", department: "DevOps & Core", roleId: "role-org-admin", status: "Active", avatar: "HR" },
  { id: "u-7", name: "Alex Morgan", email: "alex@teamflow.io", department: "QA", roleId: "role-viewer", status: "Active", avatar: "AM" },
  { id: "u-8", name: "Jessica Taylor", email: "jessica@growth.com", department: "Marketing", roleId: "role-team-lead", status: "Active", avatar: "JT" },
  { id: "u-9", name: "Robert Fox", email: "robert@teamflow.ai", department: "Security", roleId: "role-org-admin", status: "Active", avatar: "RF" },
  { id: "u-10", name: "Lisa Wong", email: "lisa@client.org", department: "Guest", roleId: "role-viewer", status: "Active", avatar: "LW" },
];

const INITIAL_LOGS = [
  {
    id: "log-1",
    action: "grant",
    permId: "project.create",
    permName: "Create Projects",
    module: "Projects",
    roleId: "role-org-admin",
    roleName: "Organization Admin",
    actor: "Himanshu R",
    time: "2 hours ago",
    timestamp: "2026-10-27T13:52:00Z",
  },
  {
    id: "log-2",
    action: "revoke",
    permId: "workspace.delete",
    permName: "Delete Workspace",
    module: "Workspaces",
    roleId: "role-org-admin",
    roleName: "Organization Admin",
    actor: "Himanshu R",
    time: "1 day ago",
    timestamp: "2026-10-26T14:30:00Z",
  },
  {
    id: "log-3",
    action: "grant",
    permId: "reports.view",
    permName: "View Reports",
    module: "Reports & Analytics",
    roleId: "role-org-admin",
    roleName: "Organization Admin",
    actor: "Himanshu R",
    time: "2 days ago",
    timestamp: "2026-10-25T11:15:00Z",
  },
  {
    id: "log-4",
    action: "grant",
    permId: "ai.generate",
    permName: "Task Breakdown",
    module: "AI Assistant",
    roleId: "role-team-lead",
    roleName: "Team Lead",
    actor: "Himanshu R",
    time: "3 days ago",
    timestamp: "2026-10-24T09:20:00Z",
  },
  {
    id: "log-5",
    action: "grant",
    permId: "billing.view",
    permName: "View Invoices",
    module: "Billing",
    roleId: "role-org-admin",
    roleName: "Organization Admin",
    actor: "Himanshu R",
    time: "4 days ago",
    timestamp: "2026-10-23T16:45:00Z",
  },
];

const ROLE_COLOR_PALETTE = [
  { label: "Indigo", value: "#6366f1" },
  { label: "Royal Blue", value: "#2563eb" },
  { label: "Emerald", value: "#10b981" },
  { label: "Purple", value: "#8b5cf6" },
  { label: "Rose", value: "#f43f5e" },
  { label: "Amber", value: "#f59e0b" },
  { label: "Cyan", value: "#06b6d4" },
];

const STORAGE_KEY = "teamflow_admin_roles_v2";

export default function AdminRoles() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Load roles from localStorage or defaults
  const [roles, setRoles] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const filtered = parsed.filter(
            (r) => r.id !== "role-super-admin" && r.name !== "Super Admin"
          );
          if (filtered.length > 0) return filtered;
        }
      }
    } catch (e) {}
    return DEFAULT_ROLES;
  });

  // Ensure Super Admin is purged from cached localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const filtered = parsed.filter(
            (r) => r.id !== "role-super-admin" && r.name !== "Super Admin"
          );
          if (filtered.length !== parsed.length) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
          }
        }
      }
    } catch (e) {}
  }, []);

  // Selected Role (default: Organization Admin)
  const [selectedRoleId, setSelectedRoleId] = useState(() => {
    const org = roles.find((r) => r.id === "role-org-admin");
    return org ? org.id : roles[0]?.id || "role-org-admin";
  });

  const selectedRole = useMemo(() => {
    return roles.find((r) => r.id === selectedRoleId) || roles[0];
  }, [roles, selectedRoleId]);

  // Sub-Navigation Tabs: 'permissions' | 'users' | 'settings' | 'logs'
  const [activeTab, setActiveTab] = useState("permissions");

  // Filtering & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [moduleFilter, setModuleFilter] = useState("all");

  // Collapsed modules state for module cards
  const [collapsedCards, setCollapsedCards] = useState({});

  // Unsaved changes tracker
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [recentlyChangedPermId, setRecentlyChangedPermId] = useState(null);

  // Audit Logs & Users State
  const [accessLogs, setAccessLogs] = useState(INITIAL_LOGS);
  const [assignedUsers, setAssignedUsers] = useState(SAMPLE_USERS);
  const [userSearch, setUserSearch] = useState("");

  // Modals
  const [createModal, setCreateModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [toast, setToast] = useState(null);

  // Form State for Create Role
  const [createForm, setCreateForm] = useState({
    name: "",
    description: "",
    color: "#6366f1",
    cloneFrom: "role-member",
  });

  // Edit Role Form State
  const [editRoleForm, setEditRoleForm] = useState({
    name: "",
    description: "",
    color: "#6366f1",
  });

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3200);
  };

  // Helper to persist roles
  const persistRoles = (updatedRoles, notify = true) => {
    setRoles(updatedRoles);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRoles));
    } catch (e) {}
    window.dispatchEvent(new Event("teamflow_data_update"));
    if (notify) {
      showToast("Roles and permissions saved successfully!");
    }
  };

  // Expand / Collapse All
  const handleExpandAll = () => {
    setCollapsedCards({});
  };

  const handleCollapseAll = () => {
    const all = {};
    PERMISSION_MODULES.forEach((m) => {
      all[m.category] = true;
    });
    setCollapsedCards(all);
  };

  const toggleCardCollapse = (category) => {
    setCollapsedCards((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  // Toggle single permission for selected role
  const handleTogglePermission = (roleId, permId) => {
    const targetRole = roles.find((r) => r.id === roleId);
    if (!targetRole) return;

    const isSensitive = SENSITIVE_PERMISSION_IDS.includes(permId);
    const hasPerm = targetRole.permissions.includes(permId);

    // If sensitive, prompt confirmation
    if (isSensitive) {
      const permObj = PERMISSION_MODULES.flatMap((m) => m.permissions).find(
        (p) => p.id === permId
      );
      setConfirmAction({
        type: "toggle-sensitive",
        roleId,
        permId,
        permName: permObj?.name || permId,
        roleName: targetRole.name,
        isCurrentlyGranted: hasPerm,
      });
      return;
    }

    applyTogglePermission(roleId, permId);
  };

  // Direct toggle without confirmation
  const applyTogglePermission = (roleId, permId) => {
    const targetRole = roles.find((r) => r.id === roleId);
    if (!targetRole) return;

    const hasPerm = targetRole.permissions.includes(permId);
    const nextPerms = hasPerm
      ? targetRole.permissions.filter((p) => p !== permId)
      : [...targetRole.permissions, permId];

    const nextRoles = roles.map((r) =>
      r.id === roleId ? { ...r, permissions: nextPerms } : r
    );

    setRoles(nextRoles);
    setHasUnsavedChanges(true);
    setRecentlyChangedPermId(permId);
    setTimeout(() => setRecentlyChangedPermId(null), 1200);

    // Append audit log
    const permObj = PERMISSION_MODULES.flatMap((m) => m.permissions).find(
      (p) => p.id === permId
    );
    const modObj = PERMISSION_MODULES.find((m) =>
      m.permissions.some((p) => p.id === permId)
    );

    const newLog = {
      id: `log-${Date.now()}`,
      action: hasPerm ? "revoke" : "grant",
      permId,
      permName: permObj?.name || permId,
      module: modObj?.category || "General",
      roleId,
      roleName: targetRole.name,
      actor: "Himanshu R",
      time: "Just now",
      timestamp: new Date().toISOString(),
    };
    setAccessLogs((prev) => [newLog, ...prev]);
  };

  // Toggle entire module (Toggle switch on module card)
  const handleToggleModule = (category) => {
    if (!selectedRole) return;
    const mod = PERMISSION_MODULES.find((m) => m.category === category);
    if (!mod) return;

    const modPermIds = mod.permissions.map((p) => p.id);
    const allActive = modPermIds.every((id) => selectedRole.permissions.includes(id));

    let updatedPerms;
    if (allActive) {
      // Revoke all in this module
      updatedPerms = selectedRole.permissions.filter((id) => !modPermIds.includes(id));
    } else {
      // Grant all in this module
      const toAdd = modPermIds.filter((id) => !selectedRole.permissions.includes(id));
      updatedPerms = [...selectedRole.permissions, ...toAdd];
    }

    const nextRoles = roles.map((r) =>
      r.id === selectedRole.id ? { ...r, permissions: updatedPerms } : r
    );

    setRoles(nextRoles);
    setHasUnsavedChanges(true);

    showToast(
      allActive
        ? `Disabled all ${category} permissions for ${selectedRole.name}`
        : `Enabled all ${category} permissions for ${selectedRole.name}`
    );
  };

  // Save changes button action
  const handleSaveChanges = () => {
    persistRoles(roles);
    setHasUnsavedChanges(false);
  };

  // Reset to default permissions for current role
  const handleResetCurrentRole = () => {
    setConfirmAction({
      type: "reset-role",
      roleId: selectedRole.id,
      roleName: selectedRole.name,
    });
  };

  // Reset all roles to system defaults
  const handleResetAllDefaults = () => {
    setConfirmAction({
      type: "reset-all",
    });
  };

  // Confirmation modal executions
  const handleConfirmActionExecution = () => {
    if (!confirmAction) return;

    if (confirmAction.type === "toggle-sensitive") {
      applyTogglePermission(confirmAction.roleId, confirmAction.permId);
      showToast(
        `${confirmAction.isCurrentlyGranted ? "Revoked" : "Granted"} sensitive permission: ${confirmAction.permName}`,
        "info"
      );
    } else if (confirmAction.type === "reset-role") {
      const defaultRole = DEFAULT_ROLES.find((r) => r.id === confirmAction.roleId);
      if (defaultRole) {
        const nextRoles = roles.map((r) =>
          r.id === confirmAction.roleId
            ? { ...r, permissions: [...defaultRole.permissions] }
            : r
        );
        persistRoles(nextRoles);
        setHasUnsavedChanges(false);
        showToast(`Reset ${confirmAction.roleName} to default permissions.`);
      }
    } else if (confirmAction.type === "reset-all") {
      persistRoles(DEFAULT_ROLES);
      setHasUnsavedChanges(false);
      showToast("All roles reset to system defaults.");
    } else if (confirmAction.type === "delete-role") {
      const nextRoles = roles.filter((r) => r.id !== confirmAction.roleId);
      persistRoles(nextRoles);
      setSelectedRoleId(nextRoles[0]?.id || "role-org-admin");
      showToast(`Role "${confirmAction.roleName}" deleted.`);
    }

    setConfirmAction(null);
  };

  // Export JSON Matrix
  const handleExportMatrix = () => {
    const exportData = {
      exportedAt: new Date().toISOString(),
      roles: roles.map((r) => ({
        id: r.id,
        code: r.code,
        name: r.name,
        description: r.description,
        usersCount: r.usersCount,
        permissionsCount: r.permissions.length,
        permissions: r.permissions,
      })),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `teamflow_roles_permissions_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("Roles & permissions exported successfully!");
  };

  // Create Role Handler
  const handleCreateRole = (e) => {
    e.preventDefault();
    if (!createForm.name.trim()) return;

    const baseRole = roles.find((r) => r.id === createForm.cloneFrom);
    const initialPerms = baseRole ? [...baseRole.permissions] : [];

    const newRole = {
      id: `role-${Date.now()}`,
      code: `ROL-${String(roles.length + 1).padStart(3, "0")}`,
      name: createForm.name.trim(),
      description: createForm.description || "Custom organization role with tailored access rights.",
      color: createForm.color || "#6366f1",
      iconKey: "ShieldCheck",
      tag: "Custom Role",
      isSystem: false,
      usersCount: 0,
      permissions: initialPerms,
    };

    const nextRoles = [...roles, newRole];
    persistRoles(nextRoles);
    setSelectedRoleId(newRole.id);
    setCreateModal(false);
    setCreateForm({
      name: "",
      description: "",
      color: "#6366f1",
      cloneFrom: "role-member",
    });
    showToast(`Created custom role "${newRole.name}"!`);
  };

  // Edit Role Handler
  const openEditModalForRole = (role) => {
    setEditRoleForm({
      name: role.name,
      description: role.description,
      color: role.color || "#6366f1",
    });
    setEditModal(true);
  };

  const handleUpdateRole = (e) => {
    e.preventDefault();
    if (!selectedRole) return;

    const nextRoles = roles.map((r) =>
      r.id === selectedRole.id
        ? {
            ...r,
            name: r.isSystem ? r.name : editRoleForm.name.trim() || r.name,
            description: editRoleForm.description,
            color: editRoleForm.color,
          }
        : r
    );

    persistRoles(nextRoles);
    setEditModal(false);
    showToast(`Updated "${selectedRole.name}" details!`);
  };

  // Helper for role icon rendering
  const renderRoleIcon = (role, size = 20) => {
    switch (role.iconKey) {
      case "Crown":
        return <Crown size={size} />;
      case "Building2":
        return <Building2 size={size} />;
      case "Users":
        return <Users size={size} />;
      case "Code":
        return <Code size={size} />;
      case "Eye":
        return <Eye size={size} />;
      default:
        return <ShieldCheck size={size} />;
    }
  };

  // Filtered module cards for current search & category filter
  const filteredModules = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return PERMISSION_MODULES.filter((m) => {
      if (moduleFilter !== "all" && m.category !== moduleFilter) return false;
      if (!q) return true;
      const matchesCategory = m.category.toLowerCase().includes(q);
      const matchesDesc = m.description.toLowerCase().includes(q);
      const matchesPerm = m.permissions.some(
        (p) => p.name.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q) || p.id.toLowerCase().includes(q)
      );
      return matchesCategory || matchesDesc || matchesPerm;
    });
  }, [searchQuery, moduleFilter]);

  // Telemetry for selected role
  const selectedRoleActiveCount = selectedRole?.permissions.length || 0;
  const totalPermsCount = ALL_PERMISSION_IDS.length;
  const accessPercentage = Math.round((selectedRoleActiveCount / totalPermsCount) * 100);

  // Users assigned to selected role
  const roleAssignedUsers = useMemo(() => {
    if (!selectedRole) return [];
    return assignedUsers.filter((u) => {
      const matchRole = u.roleId === selectedRole.id;
      if (!userSearch.trim()) return matchRole;
      const q = userSearch.toLowerCase();
      return (
        matchRole &&
        (u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.department.toLowerCase().includes(q))
      );
    });
  }, [assignedUsers, selectedRole, userSearch]);

  // =========================================================
  // PAGINATION STATES (Matching Workspace & Users)
  // =========================================================

  // 1. Pagination for Permissions / Modules (Main Grid)
  const [modulesPage, setModulesPage] = useState(1);
  const [modulesPageSize, setModulesPageSize] = useState(6);

  const totalModulePages = Math.max(1, Math.ceil(filteredModules.length / modulesPageSize));
  const paginatedModules = useMemo(() => {
    const start = (modulesPage - 1) * modulesPageSize;
    return filteredModules.slice(start, start + modulesPageSize);
  }, [filteredModules, modulesPage, modulesPageSize]);

  useEffect(() => {
    setModulesPage(1);
  }, [searchQuery, moduleFilter, selectedRoleId]);

  // 2. Pagination for Assigned Users Tab
  const [usersPage, setUsersPage] = useState(1);
  const [usersPageSize, setUsersPageSize] = useState(5);

  const totalUserPages = Math.max(1, Math.ceil(roleAssignedUsers.length / usersPageSize));
  const paginatedRoleUsers = useMemo(() => {
    const start = (usersPage - 1) * usersPageSize;
    return roleAssignedUsers.slice(start, start + usersPageSize);
  }, [roleAssignedUsers, usersPage, usersPageSize]);

  useEffect(() => {
    setUsersPage(1);
  }, [userSearch, selectedRoleId]);

  // 3. Pagination for Access Logs Tab
  const [logsPage, setLogsPage] = useState(1);
  const [logsPageSize, setLogsPageSize] = useState(8);

  const totalLogsPages = Math.max(1, Math.ceil(accessLogs.length / logsPageSize));
  const paginatedLogs = useMemo(() => {
    const start = (logsPage - 1) * logsPageSize;
    return accessLogs.slice(start, start + logsPageSize);
  }, [accessLogs, logsPage, logsPageSize]);

  // Activity Logs Style Pagination Helper (Zero Extra Spacing)
  const renderPagination = (
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalItems,
    itemLabel,
    isTableFooter = false,
    sizeOptions = [5, 10, 20]
  ) => {
    if (totalItems === 0) return null;
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
    const safePage = Math.min(currentPage, totalPages);

    const getPageNumbers = () => {
      if (totalPages <= 7) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
      }
      if (safePage <= 4) {
        return [1, 2, 3, 4, 5, "...", totalPages];
      }
      if (safePage >= totalPages - 3) {
        return [1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
      }
      return [1, "...", safePage - 1, safePage, safePage + 1, "...", totalPages];
    };

    return (
      <div
        className={`admin-logs-pagination-bar rp-pagination-bar ws-pagination-bar ${
          isTableFooter ? "rp-pagination-table-footer" : ""
        }`}
      >
        <div className="admin-logs-pagination-info rp-pagination-info ws-pagination-info">
          <span>
            Showing {(safePage - 1) * pageSize + 1} to{" "}
            {Math.min(safePage * pageSize, totalItems)} of {totalItems} {itemLabel}
          </span>
          <div className="admin-logs-page-size-wrap rp-page-size-wrap ws-page-size-wrap">
            <span>{itemLabel.charAt(0).toUpperCase() + itemLabel.slice(1)} per page:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              aria-label={`${itemLabel} per page`}
            >
              {sizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="admin-logs-pagination-controls rp-pagination-controls ws-pagination-controls">
          <button
            type="button"
            className="admin-logs-page-nav-btn rp-page-nav-btn ws-page-nav-btn"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={safePage <= 1}
          >
            Previous
          </button>
          <div className="admin-logs-page-pills rp-page-pills ws-page-pills">
            {getPageNumbers().map((num, idx) =>
              num === "..." ? (
                <span key={`ellipsis-${idx}`} className="admin-logs-page-ellipsis rp-page-ellipsis">
                  ...
                </span>
              ) : (
                <button
                  key={num}
                  type="button"
                  className={`admin-logs-page-num-pill rp-page-num-pill ws-page-num-pill ${
                    safePage === num ? "active" : ""
                  }`}
                  onClick={() => setCurrentPage(num)}
                >
                  {num}
                </button>
              )
            )}
          </div>
          <button
            type="button"
            className="admin-logs-page-nav-btn rp-page-nav-btn ws-page-nav-btn"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={safePage >= totalPages}
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="tfAdminRoles rolesPermissionsCardPage">
      {/* SIDEBAR */}
      <AdminSidebar
        mobileOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />

      <div className="tfAdminRoles__main">
        {/* UNIFIED TOPBAR (hideCreate removes "+ Create" from top of the bar) */}
        <AdminTopbar onMobileMenuToggle={() => setMobileSidebarOpen(true)} hideCreate={true} />

        {/* TOAST NOTIFICATION */}
        {toast && (
          <div className={`rp-toast-alert rp-toast-${toast.type || "success"}`}>
            <CheckCircle2 size={16} />
            <span>{toast.message}</span>
          </div>
        )}

        <div className="rp-page-body">
          {/* =========================================================
             1. TOP HEADER ROW (Matching reference design)
          ========================================================= */}
          <div className="rp-main-header">
            <div className="rp-header-left">
              <div className="rp-header-shield-icon">
                <ShieldCheck size={26} />
              </div>
              <div>
                <h1 className="rp-header-title">Roles & Permissions</h1>
                <p className="rp-header-sub">
                  Manage role access controls, define granular permissions, and secure your organization.
                </p>
              </div>
            </div>

            <div className="rp-header-right">
              {/* SEARCH INPUT */}
              <div className="rp-top-search-wrap">
                <Search size={15} />
                <input
                  type="text"
                  placeholder="Search permissions or modules..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button type="button" onClick={() => setSearchQuery("")} aria-label="Clear search">
                    <X size={13} />
                  </button>
                )}
              </div>

              {/* MODULE SELECTOR */}
              <div className="rp-top-module-select">
                <select
                  value={moduleFilter}
                  onChange={(e) => setModuleFilter(e.target.value)}
                  aria-label="Filter module"
                >
                  <option value="all">All Modules</option>
                  {PERMISSION_MODULES.map((m) => (
                    <option key={m.category} value={m.category}>
                      {m.category}
                    </option>
                  ))}
                </select>
              </div>

              {/* EXPORT BUTTON */}
              <button
                type="button"
                className="rp-btn-export"
                onClick={handleExportMatrix}
                title="Export Roles & Permissions"
              >
                <Download size={15} />
                <span>Export</span>
              </button>
            </div>
          </div>

          {/* =========================================================
             2. TOP ROLE CARDS (5 Equal interactive cards matching screenshot)
          ========================================================= */}
          <div className="rp-role-cards-grid">
            {roles.map((role) => {
              const isSelected = selectedRole?.id === role.id;
              const activeCount = role.permissions.length;
              const pct = Math.round((activeCount / totalPermsCount) * 100);

              return (
                <div
                  key={role.id}
                  className={`rp-role-top-card ${isSelected ? "selected" : ""}`}
                  onClick={() => setSelectedRoleId(role.id)}
                  style={{
                    "--role-accent": role.color || "#6366f1",
                  }}
                >
                  <div className="rp-top-card-header">
                    <div
                      className="rp-role-top-icon"
                      style={{
                        backgroundColor: `${role.color || "#6366f1"}15`,
                        color: role.color || "#6366f1",
                      }}
                    >
                      {renderRoleIcon(role, 20)}
                    </div>

                    <div className="rp-role-top-info">
                      <div className="rp-role-title-row">
                        <strong className="rp-role-title">{role.name}</strong>
                        {isSelected && (
                          <span
                            className="rp-role-selected-check"
                            style={{ backgroundColor: role.color || "#6366f1" }}
                          >
                            <Check size={11} strokeWidth={3} />
                          </span>
                        )}
                      </div>
                      <span className="rp-role-tag">{role.tag || "System Role"}</span>
                    </div>

                    {!isSelected && (
                      <ChevronRight size={16} className="rp-role-arrow-chevron" />
                    )}
                  </div>

                  <p className="rp-role-top-desc">{role.description}</p>

                  <div className="rp-role-stats-row">
                    <div className="rp-stat-item">
                      <strong className="rp-stat-val">{activeCount}</strong>
                      <span className="rp-stat-lbl">Permissions</span>
                    </div>
                    <div className="rp-stat-item">
                      <strong className="rp-stat-val">{role.usersCount || 0}</strong>
                      <span className="rp-stat-lbl">Users</span>
                    </div>
                    <div className="rp-stat-item">
                      <strong className="rp-stat-val" style={{ color: role.color || "#6366f1" }}>
                        {pct}%
                      </strong>
                      <span className="rp-stat-lbl">Access</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* =========================================================
             3. SUB-NAVIGATION TABS & SEARCH ROW
          ========================================================= */}
          <div className="rp-subnav-row">
            <div className="rp-subnav-tabs">
              <button
                type="button"
                className={`rp-subnav-tab ${activeTab === "permissions" ? "active" : ""}`}
                onClick={() => setActiveTab("permissions")}
              >
                <Layers size={15} />
                <span>Permissions</span>
              </button>
              <button
                type="button"
                className={`rp-subnav-tab ${activeTab === "users" ? "active" : ""}`}
                onClick={() => setActiveTab("users")}
              >
                <Users size={15} />
                <span>Assigned Users ({selectedRole?.usersCount || 0})</span>
              </button>
              <button
                type="button"
                className={`rp-subnav-tab ${activeTab === "settings" ? "active" : ""}`}
                onClick={() => setActiveTab("settings")}
              >
                <Sliders size={15} />
                <span>Role Settings</span>
              </button>
              <button
                type="button"
                className={`rp-subnav-tab ${activeTab === "logs" ? "active" : ""}`}
                onClick={() => setActiveTab("logs")}
              >
                <Clock size={15} />
                <span>Access Logs</span>
              </button>
            </div>

            <div className="rp-subnav-right">
              {activeTab === "permissions" && (
                <>
                  <div className="rp-subnav-search">
                    <Search size={14} />
                    <input
                      type="text"
                      placeholder="Search modules..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <button
                    type="button"
                    className="rp-subnav-btn"
                    onClick={handleExpandAll}
                    title="Expand all cards"
                  >
                    <ChevronDown size={14} />
                    <span>Expand All</span>
                  </button>
                  <button
                    type="button"
                    className="rp-subnav-btn"
                    onClick={handleCollapseAll}
                    title="Collapse all cards"
                  >
                    <ChevronRight size={14} />
                    <span>Collapse All</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* =========================================================
             4. MAIN CONTENT AREA (PERMISSIONS / USERS / SETTINGS / LOGS)
          ========================================================= */}

          {/* TAB 1: PERMISSIONS (2-COLUMN CARDS LAYOUT) */}
          {activeTab === "permissions" && (
            <div className="rp-main-two-col">
              {/* LEFT COLUMN: MODULE CARDS GRID */}
              <div className="rp-cards-col">
                {/* ROLE BANNER HEADER */}
                <div className="rp-role-banner-bar">
                  <div className="rp-banner-info-left">
                    <div
                      className="rp-banner-icon-chip"
                      style={{
                        backgroundColor: `${selectedRole?.color || "#6366f1"}15`,
                        color: selectedRole?.color || "#6366f1",
                      }}
                    >
                      {renderRoleIcon(selectedRole, 20)}
                    </div>
                    <div>
                      <h3 className="rp-banner-title">
                        Permissions for {selectedRole?.name}
                      </h3>
                      <p className="rp-banner-sub">
                        Select and manage permissions for this role. Changes will apply to all users with this role.
                      </p>
                    </div>
                  </div>

                  <div className="rp-banner-actions">
                    <button
                      type="button"
                      className="rp-btn-reset-default"
                      onClick={handleResetCurrentRole}
                      title="Reset this role to default permissions"
                    >
                      <RotateCcw size={14} />
                      <span>Reset to Default</span>
                    </button>

                    <button
                      type="button"
                      className={`rp-btn-save-changes ${hasUnsavedChanges ? "has-changes" : ""}`}
                      onClick={handleSaveChanges}
                      disabled={!hasUnsavedChanges}
                      title={hasUnsavedChanges ? "Click to persist changes" : "All changes saved"}
                    >
                      <Check size={15} />
                      <span>{hasUnsavedChanges ? "Save Changes" : "Save Changes"}</span>
                    </button>
                  </div>
                </div>

                {/* MODULE CARDS GRID */}
                <div className="rp-modules-card-grid">
                  {filteredModules.length === 0 ? (
                    <div className="rp-empty-modules-card">
                      <AlertCircle size={32} />
                      <h4>No modules match "{searchQuery}"</h4>
                      <p>Try searching another keyword or reset the module filter.</p>
                      <button
                        type="button"
                        className="rp-btn-clear-search"
                        onClick={() => {
                          setSearchQuery("");
                          setModuleFilter("all");
                        }}
                      >
                        Reset Filter
                      </button>
                    </div>
                  ) : (
                    paginatedModules.map((module) => {
                      const IconComp = module.icon || Shield;
                      const modPermIds = module.permissions.map((p) => p.id);
                      const activeInMod = modPermIds.filter((id) =>
                        selectedRole?.permissions.includes(id)
                      ).length;
                      const allActive = activeInMod === modPermIds.length;
                      const isCollapsed = Boolean(collapsedCards[module.category]);

                      return (
                        <div key={module.category} className="rp-module-card">
                          {/* CARD HEADER */}
                          <div className="rp-card-header">
                            <div className="rp-card-header-left">
                              <span
                                className="rp-card-icon-chip"
                                style={{
                                  backgroundColor: module.bg,
                                  color: module.color,
                                }}
                              >
                                <IconComp size={18} />
                              </span>
                              <div>
                                <h4 className="rp-card-title">{module.category}</h4>
                                <span className="rp-card-perm-count">
                                  {module.permissions.length} permissions
                                </span>
                              </div>
                            </div>

                            {/* TOGGLE SWITCH TO ENABLE/DISABLE ALL IN MODULE */}
                            <label
                              className="rp-toggle-switch"
                              title={allActive ? "Disable all in module" : "Enable all in module"}
                            >
                              <input
                                type="checkbox"
                                checked={allActive}
                                onChange={() => handleToggleModule(module.category)}
                              />
                              <span
                                className="rp-toggle-slider"
                                style={{
                                  backgroundColor: allActive ? (selectedRole?.color || "#6366f1") : undefined,
                                }}
                              />
                            </label>
                          </div>

                          <p className="rp-card-description">{module.description}</p>

                          {/* PERMISSION CHECKBOX LIST */}
                          <div className={`rp-card-perms-list ${isCollapsed ? "collapsed" : ""}`}>
                            {module.permissions.map((p) => {
                              const isGranted = selectedRole?.permissions.includes(p.id);
                              const isFlashing = recentlyChangedPermId === p.id;

                              return (
                                <div
                                  key={p.id}
                                  className={`rp-card-checkbox-item ${isFlashing ? "flash" : ""}`}
                                  onClick={() => handleTogglePermission(selectedRole.id, p.id)}
                                >
                                  <label className="rp-custom-check-wrap">
                                    <input
                                      type="checkbox"
                                      checked={isGranted}
                                      onChange={() => {}}
                                      aria-label={p.name}
                                    />
                                    <span
                                      className={`rp-custom-box ${isGranted ? "checked" : ""}`}
                                      style={
                                        isGranted
                                          ? {
                                              backgroundColor: selectedRole?.color || "#6366f1",
                                              borderColor: selectedRole?.color || "#6366f1",
                                            }
                                          : undefined
                                      }
                                    >
                                      {isGranted && <Check size={11} strokeWidth={3} />}
                                    </span>
                                  </label>
                                  <div className="rp-perm-text-wrap">
                                    <span className={`rp-perm-label ${isGranted ? "granted" : ""}`}>
                                      {p.name}
                                    </span>
                                    {p.sensitive && (
                                      <span className="rp-perm-sensitive-indicator" title="Sensitive capability">
                                        •
                                      </span>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          {/* CARD FOOTER */}
                          <div
                            className="rp-card-footer"
                            onClick={() => toggleCardCollapse(module.category)}
                          >
                            <span>
                              {isCollapsed
                                ? `View All (${module.permissions.length})`
                                : `Active: ${activeInMod} / ${module.permissions.length}`}
                            </span>
                            <ChevronRight size={14} className={isCollapsed ? "" : "rotated"} />
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* MODULES PAGINATION BAR (Activity Logs Style, zero-space flush layout) */}
                {renderPagination(modulesPage, setModulesPage, modulesPageSize, setModulesPageSize, filteredModules.length, "modules", false, [4, 6, 8, 12])}
              </div>

              {/* RIGHT COLUMN: ROLE DETAILS SIDEBAR (Exact match to reference design) */}
              <div className="rp-sidebar-col">
                <div className="rp-details-card">
                  {/* SIDEBAR HEADER */}
                  <div className="rp-details-header">
                    <h3>Role Details</h3>
                    <button
                      type="button"
                      className="rp-details-edit-btn"
                      onClick={() => openEditModalForRole(selectedRole)}
                    >
                      <Pencil size={13} />
                      <span>Edit</span>
                    </button>
                  </div>

                  {/* ROLE INFO HEADER */}
                  <div className="rp-details-role-hero">
                    <div
                      className="rp-details-avatar"
                      style={{
                        backgroundColor: `${selectedRole?.color || "#6366f1"}15`,
                        color: selectedRole?.color || "#6366f1",
                      }}
                    >
                      {renderRoleIcon(selectedRole, 26)}
                    </div>
                    <div>
                      <h4 className="rp-details-name">{selectedRole?.name}</h4>
                      <span className="rp-details-tag">{selectedRole?.tag || "System Role"}</span>
                      <p className="rp-details-sub">{selectedRole?.description}</p>
                    </div>
                  </div>

                  {/* QUICK STATS & CIRCULAR ACCESS PROGRESS */}
                  <div className="rp-quick-stats-section">
                    <span className="rp-section-label">- Quick Stats</span>
                    <div className="rp-quick-stats-grid">
                      <div className="rp-stats-numbers">
                        <div className="rp-stat-row">
                          <span className="rp-stat-icon-wrap" style={{ color: "#6366f1", backgroundColor: "#eef2ff" }}>
                            <ShieldCheck size={14} />
                          </span>
                          <div>
                            <strong>{selectedRoleActiveCount} / {totalPermsCount}</strong>
                            <small>Permissions</small>
                          </div>
                        </div>

                        <div className="rp-stat-row">
                          <span className="rp-stat-icon-wrap" style={{ color: "#2563eb", backgroundColor: "#eff6ff" }}>
                            <Users size={14} />
                          </span>
                          <div>
                            <strong>{selectedRole?.usersCount || 0}</strong>
                            <small>Assigned Users</small>
                          </div>
                        </div>

                        <div className="rp-stat-row">
                          <span className="rp-stat-icon-wrap" style={{ color: "#f59e0b", backgroundColor: "#fffbeb" }}>
                            <Lock size={14} />
                          </span>
                          <div>
                            <strong>{PERMISSION_MODULES.length}</strong>
                            <small>Security Modules</small>
                          </div>
                        </div>
                      </div>

                      {/* CIRCULAR SVG PROGRESS RING */}
                      <div className="rp-circle-progress-wrap">
                        <svg className="rp-circle-svg" width="76" height="76" viewBox="0 0 76 76">
                          <circle
                            cx="38"
                            cy="38"
                            r="30"
                            stroke="currentColor"
                            strokeWidth="6"
                            fill="transparent"
                            className="rp-circle-bg"
                          />
                          <circle
                            cx="38"
                            cy="38"
                            r="30"
                            stroke={selectedRole?.color || "#6366f1"}
                            strokeWidth="6"
                            strokeDasharray={2 * Math.PI * 30}
                            strokeDashoffset={2 * Math.PI * 30 * (1 - accessPercentage / 100)}
                            strokeLinecap="round"
                            fill="transparent"
                            transform="rotate(-90 38 38)"
                            className="rp-circle-bar"
                          />
                          <text x="38" y="44" textAnchor="middle" className="rp-circle-text">
                            {accessPercentage}%
                          </text>
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* DESCRIPTION BLOCK */}
                  <div className="rp-description-block">
                    <span className="rp-section-label">Description</span>
                    <p>{selectedRole?.description}</p>
                  </div>

                  {/* PERMISSIONS BREAKDOWN */}
                  <div className="rp-breakdown-section">
                    <span className="rp-section-label">Permissions Breakdown</span>
                    <div className="rp-breakdown-list">
                      {PERMISSION_MODULES.slice(0, 6).map((mod) => {
                        const IconComponent = mod.icon || Shield;
                        const modPermIds = mod.permissions.map((p) => p.id);
                        const activeCount = modPermIds.filter((id) =>
                          selectedRole?.permissions.includes(id)
                        ).length;
                        const pct = Math.round((activeCount / modPermIds.length) * 100);

                        return (
                          <div key={mod.category} className="rp-breakdown-item">
                            <div className="rp-breakdown-label-row">
                              <span className="rp-breakdown-icon" style={{ color: mod.color }}>
                                <IconComponent size={13} />
                              </span>
                              <span className="rp-breakdown-name">{mod.category}</span>
                            </div>

                            <div className="rp-breakdown-meter-wrap">
                              <div
                                className="rp-breakdown-fill"
                                style={{
                                  width: `${pct}%`,
                                  backgroundColor: mod.color,
                                }}
                              />
                            </div>

                            <span className="rp-breakdown-count">
                              {activeCount}/{modPermIds.length}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* RECENT CHANGES AUDIT TRAIL */}
                  <div className="rp-recent-changes-section">
                    <span className="rp-section-label">Recent Changes</span>
                    <div className="rp-recent-changes-list">
                      {accessLogs
                        .filter((l) => l.roleId === selectedRole?.id)
                        .slice(0, 3)
                        .map((log) => (
                          <div key={log.id} className="rp-change-item">
                            <span
                              className={`rp-change-badge ${log.action === "grant" ? "grant" : "revoke"}`}
                            >
                              {log.action === "grant" ? "+" : "-"}
                            </span>
                            <div className="rp-change-info">
                              <strong className="rp-change-title">
                                {log.action === "grant" ? "Granted" : "Revoked"} {log.permId}
                              </strong>
                              <small className="rp-change-time">
                                {log.time} by {log.actor}
                              </small>
                            </div>
                          </div>
                        ))}
                    </div>

                    <button
                      type="button"
                      className="rp-btn-view-logs"
                      onClick={() => setActiveTab("logs")}
                    >
                      <span>View All Logs</span>
                      <ChevronRight size={13} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ASSIGNED USERS */}
          {activeTab === "users" && (
            <div className="rp-tab-pane">
              <div className="rp-tab-card rp-table-card">
                <div className="rp-tab-card-header">
                  <div>
                    <h3>Users assigned to {selectedRole?.name}</h3>
                    <p>Team members who currently inherit this security profile and capabilities.</p>
                  </div>
                  <div className="rp-card-search-box">
                    <Search size={14} />
                    <input
                      type="text"
                      placeholder="Search assigned members..."
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                    />
                  </div>
                </div>

                <div className="rp-users-table-wrap">
                  <table className="rp-users-table">
                    <thead>
                      <tr>
                        <th>USER MEMBER</th>
                        <th>DEPARTMENT</th>
                        <th>CURRENT ROLE</th>
                        <th>STATUS</th>
                        <th style={{ textAlign: "right" }}>ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {roleAssignedUsers.length === 0 ? (
                        <tr>
                          <td colSpan={5} style={{ textAlign: "center", padding: "40px" }}>
                            <Users size={32} style={{ color: "#94a3b8", marginBottom: 8 }} />
                            <p style={{ margin: 0, color: "#64748b" }}>
                              No users match this filter for {selectedRole?.name}.
                            </p>
                          </td>
                        </tr>
                      ) : (
                        paginatedRoleUsers.map((user) => (
                          <tr key={user.id}>
                            <td>
                              <div className="rp-user-cell">
                                <span className="rp-user-avatar">{user.avatar}</span>
                                <div>
                                  <strong>{user.name}</strong>
                                  <small>{user.email}</small>
                                </div>
                              </div>
                            </td>
                            <td>{user.department}</td>
                            <td>
                              <span
                                className="rp-role-chip"
                                style={{
                                  backgroundColor: `${selectedRole?.color}15`,
                                  color: selectedRole?.color,
                                  borderColor: `${selectedRole?.color}35`,
                                }}
                              >
                                {selectedRole?.name}
                              </span>
                            </td>
                            <td>
                              <span
                                className={`rp-status-tag ${user.status === "Active" ? "active" : "inactive"}`}
                              >
                                {user.status}
                              </span>
                            </td>
                            <td style={{ textAlign: "right" }}>
                              <button
                                type="button"
                                className="rp-btn-sm-action"
                                onClick={() => showToast(`Opening profile for ${user.name}`, "info")}
                              >
                                Manage User
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* ASSIGNED USERS PAGINATION BAR (Activity Logs Style, zero-space flush layout) */}
                {renderPagination(usersPage, setUsersPage, usersPageSize, setUsersPageSize, roleAssignedUsers.length, "users", true, [5, 8, 10, 20])}
              </div>
            </div>
          )}

          {/* TAB 3: ROLE SETTINGS */}
          {activeTab === "settings" && (
            <div className="rp-tab-pane">
              <div className="rp-tab-card rp-settings-card">
                <div className="rp-tab-card-header">
                  <div>
                    <h3>Governance & Security Settings for {selectedRole?.name}</h3>
                    <p>Configure role identity, branding accents, and tenant governance tier.</p>
                  </div>
                  <span className={`rp-role-tag-badge ${selectedRole?.isSystem ? "system" : "custom"}`}>
                    {selectedRole?.isSystem ? "System Protected" : "Custom Role"}
                  </span>
                </div>

                <form onSubmit={handleUpdateRole} className="rp-settings-form">
                  <div className="rp-form-group">
                    <label>Role Name *</label>
                    <input
                      type="text"
                      disabled={selectedRole?.isSystem}
                      value={selectedRole?.isSystem ? selectedRole.name : editRoleForm.name}
                      onChange={(e) => setEditRoleForm({ ...editRoleForm, name: e.target.value })}
                    />
                    {selectedRole?.isSystem && (
                      <small className="rp-form-hint">
                        System protected roles cannot be renamed to protect workspace tenant bindings.
                      </small>
                    )}
                  </div>

                  <div className="rp-form-group">
                    <label>Role Description</label>
                    <textarea
                      rows={3}
                      value={editRoleForm.description}
                      onChange={(e) => setEditRoleForm({ ...editRoleForm, description: e.target.value })}
                    />
                  </div>

                  <div className="rp-form-group">
                    <label>Role Badge Accent Color</label>
                    <div className="rp-color-picker-row">
                      {ROLE_COLOR_PALETTE.map((c) => {
                        const isChosen = editRoleForm.color?.toLowerCase() === c.value.toLowerCase();
                        return (
                          <button
                            key={c.value}
                            type="button"
                            className={`rp-color-circle-btn ${isChosen ? "active" : ""}`}
                            onClick={() => setEditRoleForm({ ...editRoleForm, color: c.value })}
                            style={{ backgroundColor: c.value }}
                            title={c.label}
                          >
                            {isChosen && <Check size={12} style={{ color: "#ffffff" }} />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="rp-settings-actions">
                    {!selectedRole?.isSystem && (
                      <button
                        type="button"
                        className="rp-btn-danger"
                        onClick={() =>
                          setConfirmAction({
                            type: "delete-role",
                            roleId: selectedRole.id,
                            roleName: selectedRole.name,
                          })
                        }
                      >
                        <Trash2 size={15} />
                        <span>Delete Custom Role</span>
                      </button>
                    )}
                    <button type="submit" className="rp-btn-save-settings">
                      <Check size={15} />
                      <span>Update Settings</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* TAB 4: ACCESS LOGS */}
          {activeTab === "logs" && (
            <div className="rp-tab-pane">
              <div className="rp-tab-card rp-table-card">
                <div className="rp-tab-card-header">
                  <div>
                    <h3>RBAC Access & Audit Trail Logs</h3>
                    <p>Chronological security history of capabilities granted or revoked across roles.</p>
                  </div>
                  <button
                    type="button"
                    className="rp-btn-export"
                    onClick={() => showToast("Exported audit logs to CSV!", "success")}
                  >
                    <Download size={14} />
                    <span>Export Audit Trail</span>
                  </button>
                </div>

                <div className="rp-logs-table-wrap">
                  <table className="rp-logs-table">
                    <thead>
                      <tr>
                        <th>ACTION</th>
                        <th>CAPABILITY / PERMISSION</th>
                        <th>MODULE</th>
                        <th>TARGET ROLE</th>
                        <th>PERFORMED BY</th>
                        <th>TIMESTAMP</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedLogs.map((log) => (
                        <tr key={log.id}>
                          <td>
                            <span className={`rp-log-action-tag ${log.action}`}>
                              {log.action === "grant" ? "Granted" : "Revoked"}
                            </span>
                          </td>
                          <td>
                            <strong>{log.permName}</strong>
                            <code className="rp-perm-key-badge">{log.permId}</code>
                          </td>
                          <td>{log.module}</td>
                          <td>
                            <span className="rp-role-mini-pill">{log.roleName}</span>
                          </td>
                          <td>{log.actor}</td>
                          <td>
                            <span className="rp-log-time">{log.time}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* AUDIT LOGS PAGINATION BAR (Activity Logs Style, zero-space flush layout) */}
                {renderPagination(logsPage, setLogsPage, logsPageSize, setLogsPageSize, accessLogs.length, "audit logs", true, [5, 8, 10, 20])}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* =========================================================
         MODALS: CREATE ROLE / EDIT ROLE / CONFIRMATION
      ========================================================= */}

      {/* CREATE ROLE MODAL */}
      {createModal && (
        <div
          className="rp-modal-backdrop"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setCreateModal(false);
          }}
        >
          <div className="rp-modal-box" role="dialog" aria-modal="true">
            <div className="rp-modal-header">
              <div className="rp-modal-header-left">
                <div className="rp-modal-icon-chip">
                  <Plus size={20} />
                </div>
                <div>
                  <h2>Create New Role</h2>
                  <p>Configure credentials and clone existing permission templates.</p>
                </div>
              </div>
              <button
                type="button"
                className="rp-modal-close-btn"
                onClick={() => setCreateModal(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateRole} className="rp-modal-form">
              <div className="rp-form-group">
                <label>Role Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Quality Assurance Lead"
                  value={createForm.name}
                  onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                />
              </div>

              <div className="rp-form-group">
                <label>Description</label>
                <textarea
                  rows={3}
                  placeholder="Describe the operational responsibilities of this role..."
                  value={createForm.description}
                  onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                />
              </div>

              <div className="rp-form-grid-2">
                <div className="rp-form-group">
                  <label>Clone Permissions From</label>
                  <select
                    value={createForm.cloneFrom}
                    onChange={(e) => setCreateForm({ ...createForm, cloneFrom: e.target.value })}
                  >
                    {roles.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name} ({r.permissions.length} perms)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="rp-form-group">
                  <label>Role Badge Color</label>
                  <select
                    value={createForm.color}
                    onChange={(e) => setCreateForm({ ...createForm, color: e.target.value })}
                  >
                    {ROLE_COLOR_PALETTE.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="rp-modal-footer">
                <button
                  type="button"
                  className="rp-btn-cancel"
                  onClick={() => setCreateModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="rp-btn-primary">
                  <Plus size={16} />
                  <span>Create Role</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT ROLE MODAL */}
      {editModal && selectedRole && (
        <div
          className="rp-modal-backdrop"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setEditModal(false);
          }}
        >
          <div className="rp-modal-box" role="dialog" aria-modal="true">
            <div className="rp-modal-header">
              <div className="rp-modal-header-left">
                <div
                  className="rp-modal-icon-chip"
                  style={{
                    backgroundColor: `${selectedRole.color || "#6366f1"}15`,
                    color: selectedRole.color || "#6366f1",
                  }}
                >
                  <Pencil size={18} />
                </div>
                <div>
                  <h2>Edit {selectedRole.name}</h2>
                  <p>Update credentials, description, and visual theme.</p>
                </div>
              </div>
              <button
                type="button"
                className="rp-modal-close-btn"
                onClick={() => setEditModal(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleUpdateRole} className="rp-modal-form">
              <div className="rp-form-group">
                <label>Role Name *</label>
                <input
                  type="text"
                  required
                  disabled={selectedRole.isSystem}
                  value={selectedRole.isSystem ? selectedRole.name : editRoleForm.name}
                  onChange={(e) => setEditRoleForm({ ...editRoleForm, name: e.target.value })}
                />
                {selectedRole.isSystem && (
                  <small className="rp-form-hint">
                    System protected roles cannot be renamed.
                  </small>
                )}
              </div>

              <div className="rp-form-group">
                <label>Description</label>
                <textarea
                  rows={3}
                  value={editRoleForm.description}
                  onChange={(e) => setEditRoleForm({ ...editRoleForm, description: e.target.value })}
                />
              </div>

              <div className="rp-form-group">
                <label>Accent Color</label>
                <div className="rp-color-picker-row">
                  {ROLE_COLOR_PALETTE.map((c) => {
                    const isChosen = editRoleForm.color?.toLowerCase() === c.value.toLowerCase();
                    return (
                      <button
                        key={c.value}
                        type="button"
                        className={`rp-color-circle-btn ${isChosen ? "active" : ""}`}
                        onClick={() => setEditRoleForm({ ...editRoleForm, color: c.value })}
                        style={{ backgroundColor: c.value }}
                        title={c.label}
                      >
                        {isChosen && <Check size={12} style={{ color: "#ffffff" }} />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="rp-modal-footer">
                <button
                  type="button"
                  className="rp-btn-cancel"
                  onClick={() => setEditModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="rp-btn-primary">
                  <Check size={16} />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRMATION MODAL (DELETE, SENSITIVE, RESET) */}
      {confirmAction && (
        <div
          className="rp-modal-backdrop"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setConfirmAction(null);
          }}
        >
          <div className="rp-modal-box rp-modal-sm" role="dialog" aria-modal="true">
            <div className={`rp-modal-icon-circle ${confirmAction.type === "toggle-sensitive" ? "warning" : "danger"}`}>
              {confirmAction.type === "toggle-sensitive" ? (
                <ShieldAlert size={28} />
              ) : (
                <Trash2 size={26} />
              )}
            </div>

            <h3 className="rp-modal-confirm-title">
              {confirmAction.type === "toggle-sensitive"
                ? "Modify Sensitive Privilege?"
                : confirmAction.type === "reset-role"
                ? `Reset ${confirmAction.roleName}?`
                : confirmAction.type === "reset-all"
                ? "Reset All Roles?"
                : `Delete Role "${confirmAction.roleName}"?`}
            </h3>

            <p className="rp-modal-confirm-desc">
              {confirmAction.type === "toggle-sensitive"
                ? `You are about to ${confirmAction.isCurrentlyGranted ? "revoke" : "grant"} "${confirmAction.permName}" for ${confirmAction.roleName}. This affects critical administrative access boundaries.`
                : confirmAction.type === "reset-role"
                ? `Are you sure you want to restore default permissions for ${confirmAction.roleName}? Custom changes will be overwritten.`
                : confirmAction.type === "reset-all"
                ? "Are you sure you want to restore all roles and permissions to system defaults?"
                : `Are you sure you want to permanently delete "${confirmAction.roleName}"? Assigned users will revert to standard Member.`}
            </p>

            <div className="rp-modal-footer">
              <button
                type="button"
                className="rp-btn-cancel"
                onClick={() => setConfirmAction(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className={confirmAction.type === "toggle-sensitive" ? "rp-btn-primary" : "rp-btn-danger"}
                onClick={handleConfirmActionExecution}
              >
                {confirmAction.type === "toggle-sensitive"
                  ? (confirmAction.isCurrentlyGranted ? "Revoke Capability" : "Grant Capability")
                  : confirmAction.type === "reset-role" || confirmAction.type === "reset-all"
                  ? "Reset Defaults"
                  : (
                    <>
                      <Trash2 size={16} /> Delete Role
                    </>
                  )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
