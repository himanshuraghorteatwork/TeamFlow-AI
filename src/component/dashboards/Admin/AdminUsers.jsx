import React, { useEffect, useMemo, useState } from "react";
import {
  Users,
  UserCheck,
  UserX,
  ShieldCheck,
  Search,
  Plus,
  Filter,
  Download,
  RotateCcw,
  Pencil,
  Trash2,
  CheckCircle2,
  X,
  Mail,
  Building2,
  Phone,
  Briefcase,
  MoreVertical,
  Check,
  AlertCircle,
  Eye,
  Shield,
  Layers,
  Sparkles,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Calendar,
} from "lucide-react";

import AdminSidebar from "./AdminSidebar.jsx";
import AdminTopbar from "./AdminTopbar.jsx";
import { initialUsers } from "./adminUsersData.js";
import "./AdminUsers.css";

const STORAGE_KEY = "teamflow_admin_users";

const DEFAULT_WORKSPACES = [
  "TeamFlow Workspace",
  "Marketing Team",
  "Design Studio",
  "Development Hub",
  "Research Lab",
  "Startup Team",
];

const DEFAULT_ROLES = ["Admin", "Team Lead", "Member", "Viewer"];

const DEFAULT_DEPARTMENTS = [
  "Engineering",
  "Design",
  "Product",
  "Marketing",
  "Sales",
  "Operations",
  "Finance",
  "Human Resources",
  "Customer Support",
];

const loadUsers = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error("Error loading admin users:", e);
  }
  return initialUsers;
};

export default function AdminUsers() {
  const [usersList, setUsersList] = useState(loadUsers);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All Roles");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [workspaceFilter, setWorkspaceFilter] = useState("All Workspaces");
  const [sortKey, setSortKey] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(8); // 'asc' | 'desc'

  // Selection & Bulk Actions
  const [selectedIds, setSelectedIds] = useState([]);

  // Modals
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [viewingUser, setViewingUser] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null); // { type: 'single' | 'bulk' | 'reset', id, name, count }
  const [openMenu, setOpenMenu] = useState(null);
  const [exportOpen, setExportOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // Form State
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "Member",
    workspace: "TeamFlow Workspace",
    department: "Engineering",
    status: "Active",
    phone: "",
  });

  // Toast auto-dismiss
  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  // Sync users to localStorage and trigger global update
  const saveUsers = (newUsers) => {
    setUsersList(newUsers);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newUsers));
    } catch (e) {
      console.error("Failed to save users:", e);
    }
    window.dispatchEvent(new Event("teamflow_data_update"));
  };

  // Listen to external data changes
  useEffect(() => {
    const handleSync = () => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) setUsersList(JSON.parse(saved));
      } catch (e) {}
    };

    window.addEventListener("storage", handleSync);
    window.addEventListener("teamflow_data_update", handleSync);
    return () => {
      window.removeEventListener("storage", handleSync);
      window.removeEventListener("teamflow_data_update", handleSync);
    };
  }, []);

  // Column sort toggle handler
  const handleSort = (key) => {
    if (sortKey === key) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const renderSortIcon = (key) => {
    if (sortKey !== key) {
      return <ArrowUpDown size={13} className="admin-sort-icon muted" />;
    }
    return sortOrder === "asc" ? (
      <ArrowUp size={13} className="admin-sort-icon active" />
    ) : (
      <ArrowDown size={13} className="admin-sort-icon active" />
    );
  };

  // Filtered & Sorted Users List
  const filteredUsers = useMemo(() => {
    const list = usersList.filter((user) => {
      const term = search.trim().toLowerCase();
      const matchesSearch =
        !term ||
        (user.name && user.name.toLowerCase().includes(term)) ||
        (user.email && user.email.toLowerCase().includes(term)) ||
        (user.workspace && user.workspace.toLowerCase().includes(term)) ||
        (user.department && user.department.toLowerCase().includes(term)) ||
        (user.role && user.role.toLowerCase().includes(term));

      const matchesRole =
        roleFilter === "All Roles" || user.role === roleFilter;

      const matchesStatus =
        statusFilter === "All Status" || user.status === statusFilter;

      const matchesWorkspace =
        workspaceFilter === "All Workspaces" ||
        user.workspace === workspaceFilter;

      return matchesSearch && matchesRole && matchesStatus && matchesWorkspace;
    });

    return [...list].sort((a, b) => {
      if (sortKey === "id") {
        const numA = Number(a.id) || 0;
        const numB = Number(b.id) || 0;
        return sortOrder === "asc" ? numA - numB : numB - numA;
      }
      let valA = a[sortKey] || "";
      let valB = b[sortKey] || "";

      if (typeof valA === "string") valA = valA.toLowerCase();
      if (typeof valB === "string") valB = valB.toLowerCase();

      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [usersList, search, roleFilter, statusFilter, workspaceFilter, sortKey, sortOrder]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, roleFilter, statusFilter, workspaceFilter, sortKey, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / perPage));
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * perPage;
    return filteredUsers.slice(start, start + perPage);
  }, [filteredUsers, currentPage, perPage]);

  // Statistics
  const stats = useMemo(() => {
    const total = usersList.length;
    const active = usersList.filter((u) => u.status === "Active").length;
    const inactive = usersList.filter((u) => u.status !== "Active").length;
    const admins = usersList.filter(
      (u) => u.role === "Admin" || u.role === "Super Admin"
    ).length;
    return { total, active, inactive, admins };
  }, [usersList]);

  // Open Add Modal
  const openAddModal = () => {
    setEditingUser(null);
    setForm({
      name: "",
      email: "",
      role: "Member",
      workspace: "TeamFlow Workspace",
      department: "Engineering",
      status: "Active",
      phone: "",
    });
    setOpenMenu(null);
    setShowModal(true);
  };

  // Open Edit Modal
  const openEditModal = (user) => {
    setEditingUser(user);
    setForm({
      name: user.name || "",
      email: user.email || "",
      role: user.role || "Member",
      workspace: user.workspace || "TeamFlow Workspace",
      department: user.department || "Engineering",
      status: user.status || "Active",
      phone: user.phone || "+1 (555) 019-2834",
    });
    setOpenMenu(null);
    setShowModal(true);
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      showToast("Please enter a valid full name and email.", "error");
      return;
    }

    const initials = form.name
      .trim()
      .split(" ")
      .map((w) => w[0])
      .join("")
      .substring(0, 2)
      .toUpperCase() || "U";

    if (editingUser) {
      const updated = usersList.map((u) =>
        u.id === editingUser.id
          ? {
              ...u,
              ...form,
              initials,
            }
          : u
      );
      saveUsers(updated);
      showToast(`User "${form.name}" updated successfully.`);
    } else {
      const newUser = {
        id: Date.now(),
        ...form,
        phone: form.phone.trim() || "+1 (555) 019-2834",
        initials,
        joined: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        }),
      };
      saveUsers([newUser, ...usersList]);
      showToast(`User "${form.name}" created successfully.`);
    }

    setShowModal(false);
  };

  const deleteUser = (id, userName) => {
    setOpenMenu(null);
    const targetUser = usersList.find((u) => u.id === id);
    setConfirmDelete({
      type: "single",
      id,
      name: userName || targetUser?.name || "this user",
      user: targetUser,
    });
  };

  const handleConfirmDeleteExecution = () => {
    if (!confirmDelete) return;

    if (confirmDelete.type === "single") {
      const remaining = usersList.filter((u) => u.id !== confirmDelete.id);
      saveUsers(remaining);
      setSelectedIds((prev) => prev.filter((item) => item !== confirmDelete.id));
      if (viewingUser && viewingUser.id === confirmDelete.id) {
        setViewingUser(null);
      }
      showToast(`User "${confirmDelete.name}" deleted.`);
    } else if (confirmDelete.type === "bulk") {
      const count = selectedIds.length;
      const remaining = usersList.filter((u) => !selectedIds.includes(u.id));
      saveUsers(remaining);
      setSelectedIds([]);
      showToast(`${count} users permanently deleted.`);
    } else if (confirmDelete.type === "reset") {
      saveUsers(initialUsers);
      setSelectedIds([]);
      showToast("User database reset to demo defaults.");
    }

    setConfirmDelete(null);
  };

  const toggleUserStatus = (id) => {
    const updated = usersList.map((u) => {
      if (u.id === id) {
        const nextStatus = u.status === "Active" ? "Suspended" : "Active";
        return { ...u, status: nextStatus };
      }
      return u;
    });
    saveUsers(updated);
    setOpenMenu(null);
    showToast("User status updated.");
  };

  // Bulk Selection
  const toggleSelectAll = () => {
    if (selectedIds.length === filteredUsers.length && filteredUsers.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredUsers.map((u) => u.id));
    }
  };

  const toggleSelectOne = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBulkStatus = (status) => {
    if (selectedIds.length === 0) return;
    const updated = usersList.map((u) =>
      selectedIds.includes(u.id) ? { ...u, status } : u
    );
    saveUsers(updated);
    setSelectedIds([]);
    showToast(`${selectedIds.length} users marked as ${status}.`);
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    setConfirmDelete({
      type: "bulk",
      count: selectedIds.length,
    });
  };

  // Export
  const exportUsersCSV = () => {
    const headers = ["ID", "Name", "Email", "Role", "Workspace", "Status", "Joined"];
    const rows = filteredUsers.map((u) => [
      u.id,
      `"${u.name}"`,
      `"${u.email}"`,
      `"${u.role}"`,
      `"${u.workspace}"`,
      `"${u.status}"`,
      `"${u.joined}"`,
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `teamflow_users_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setExportOpen(false);
    showToast("Exported users to CSV.");
  };

  const exportUsersJSON = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(filteredUsers, null, 2));
    const link = document.createElement("a");
    link.setAttribute("href", dataStr);
    link.setAttribute("download", `teamflow_users_${Date.now()}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setExportOpen(false);
    showToast("Exported users to JSON.");
  };

  const resetDemoData = () => {
    setConfirmDelete({
      type: "reset",
    });
  };

  return (
    <div className="admin-users-app">
      {/* SIDEBAR */}
      <AdminSidebar
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      <div className="admin-users-main">
        {/* UNIFIED TOPBAR */}
        <AdminTopbar
          onMobileMenuToggle={() => setMobileOpen(true)}
          onInviteUser={openAddModal}
        />

        {/* TOAST NOTIFICATION */}
        {toast && (
          <div className={`admin-users-toast admin-users-toast--${toast.type}`}>
            <CheckCircle2 size={16} />
            <span>{toast.message}</span>
          </div>
        )}

        {/* PAGE CONTENT */}
        <main className="admin-users-content">
          {/* HEADING */}
          <section className="admin-users-heading">
            <div>
              <h1>User Management</h1>
              <p>
                Configure user credentials, manage role assignments, monitor
                account statuses, and enforce organizational privileges.
              </p>
            </div>

            <div className="admin-users-heading-actions">
              {/* EXPORT DROPDOWN */}
              <div className="admin-users-dropdown-wrapper">
                <button
                  type="button"
                  className="admin-users-export-btn"
                  onClick={() => setExportOpen((prev) => !prev)}
                >
                  <Download size={16} />
                  <span>Export</span>
                  <ChevronDown size={14} />
                </button>

                {exportOpen && (
                  <div className="admin-users-export-menu">
                    <button type="button" onClick={exportUsersCSV}>
                      Export as CSV (.csv)
                    </button>
                    <button type="button" onClick={exportUsersJSON}>
                      Export as JSON (.json)
                    </button>
                  </div>
                )}
              </div>

              {/* ADD USER BUTTON */}
              <button
                type="button"
                className="admin-users-add-button"
                onClick={openAddModal}
              >
                <Plus size={18} />
                <span>Add User</span>
              </button>
            </div>
          </section>

          {/* STATS KPI CARDS */}
          <section className="admin-users-stats">
            <StatCard
              icon={<Users size={22} />}
              title="Total Users"
              value={stats.total}
              type="purple"
              description="Registered organization accounts"
            />
            <StatCard
              icon={<UserCheck size={22} />}
              title="Active Users"
              value={stats.active}
              type="green"
              description="Operational with full access"
            />
            <StatCard
              icon={<UserX size={22} />}
              title="Suspended / Inactive"
              value={stats.inactive}
              type="red"
              description="Requires administrative review"
            />
            <StatCard
              icon={<ShieldCheck size={22} />}
              title="Administrators"
              value={stats.admins}
              type="blue"
              description="Privileged administrative role"
            />
          </section>

          {/* TOOLBAR: SEARCH & FILTERS */}
          <section className="admin-users-filter-card">
            <div className="admin-users-search">
              <Search size={18} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, email, role, or workspace..."
              />
              {search && (
                <button
                  type="button"
                  className="admin-users-clear-search"
                  onClick={() => setSearch("")}
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <div className="admin-users-filter-group">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                aria-label="Filter by role"
              >
                <option value="All Roles">All Roles</option>
                {DEFAULT_ROLES.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                aria-label="Filter by status"
              >
                <option value="All Status">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Suspended">Suspended</option>
              </select>

              <select
                value={workspaceFilter}
                onChange={(e) => setWorkspaceFilter(e.target.value)}
                aria-label="Filter by workspace"
              >
                <option value="All Workspaces">All Workspaces</option>
                {DEFAULT_WORKSPACES.map((ws) => (
                  <option key={ws} value={ws}>
                    {ws}
                  </option>
                ))}
              </select>

              <select
                value={`${sortKey}-${sortOrder}`}
                onChange={(e) => {
                  const [k, ord] = e.target.value.split("-");
                  setSortKey(k);
                  setSortOrder(ord);
                }}
                aria-label="Sort users"
                className="admin-users-sort-select"
              >
                <option value="name-asc">Sort: Name (A to Z)</option>
                <option value="name-desc">Sort: Name (Z to A)</option>
                <option value="role-asc">Sort: Role (A to Z)</option>
                <option value="status-asc">Sort: Status</option>
                <option value="workspace-asc">Sort: Workspace</option>
                <option value="joined-desc">Sort: Recently Joined</option>
              </select>

              {(search || roleFilter !== "All Roles" || statusFilter !== "All Status" || workspaceFilter !== "All Workspaces") && (
                <button
                  type="button"
                  className="admin-users-clear-filters-btn"
                  onClick={() => {
                    setSearch("");
                    setRoleFilter("All Roles");
                    setStatusFilter("All Status");
                    setWorkspaceFilter("All Workspaces");
                  }}
                >
                  <X size={13} />
                  Clear Filters
                </button>
              )}
            </div>
          </section>

          {/* BULK ACTION BAR */}
          {selectedIds.length > 0 && (
            <div className="admin-users-bulk-bar">
              <div className="admin-users-bulk-info">
                <strong>{selectedIds.length}</strong> users selected
              </div>
              <div className="admin-users-bulk-buttons">
                <button
                  type="button"
                  className="bulk-btn bulk-activate"
                  onClick={() => handleBulkStatus("Active")}
                >
                  <UserCheck size={15} />
                  Activate
                </button>
                <button
                  type="button"
                  className="bulk-btn bulk-suspend"
                  onClick={() => handleBulkStatus("Suspended")}
                >
                  <UserX size={15} />
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

          {/* TABLE META HEADER */}
          <div className="admin-users-meta-header">
            <span>
              Showing {filteredUsers.length === 0 ? 0 : (currentPage - 1) * perPage + 1} - {Math.min(currentPage * perPage, filteredUsers.length)} of {filteredUsers.length} users
            </span>
            <button
              type="button"
              className="admin-users-reset-btn"
              onClick={resetDemoData}
            >
              <RotateCcw size={14} />
              Reset Demo Data
            </button>
          </div>

          {/* USERS TABLE */}
          <section className="admin-users-table-card">
            <div className="admin-users-table-wrapper">
              <table className="admin-users-table">
                <thead>
                  <tr>
                    <th style={{ width: 44, textAlign: "center" }}>
                      <input
                        type="checkbox"
                        checked={
                          selectedIds.length === filteredUsers.length &&
                          filteredUsers.length > 0
                        }
                        onChange={toggleSelectAll}
                        aria-label="Select all users"
                      />
                    </th>
                    <th className="sortable-th" style={{ width: 110, textAlign: "center" }} onClick={() => handleSort("id")}>
                      <div className="th-content" style={{ justifyContent: "center" }}>
                        <span># User ID</span>
                        {renderSortIcon("id")}
                      </div>
                    </th>
                    <th className="sortable-th" onClick={() => handleSort("name")}>
                      <div className="th-content">
                        <span>User Member</span>
                        {renderSortIcon("name")}
                      </div>
                    </th>
                    <th className="sortable-th" onClick={() => handleSort("role")}>
                      <div className="th-content">
                        <span>Role</span>
                        {renderSortIcon("role")}
                      </div>
                    </th>
                    <th className="sortable-th" onClick={() => handleSort("department")}>
                      <div className="th-content">
                        <span>Department</span>
                        {renderSortIcon("department")}
                      </div>
                    </th>
                    <th className="sortable-th" onClick={() => handleSort("workspace")}>
                      <div className="th-content">
                        <span>Workspace</span>
                        {renderSortIcon("workspace")}
                      </div>
                    </th>
                    <th>Contact</th>
                    <th className="sortable-th" onClick={() => handleSort("status")}>
                      <div className="th-content">
                        <span>Status</span>
                        {renderSortIcon("status")}
                      </div>
                    </th>
                    <th className="sortable-th" onClick={() => handleSort("joined")}>
                      <div className="th-content">
                        <span>Joined</span>
                        {renderSortIcon("joined")}
                      </div>
                    </th>
                    <th style={{ textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {paginatedUsers.map((user, idx) => {
                    const isSelected = selectedIds.includes(user.id);
                    return (
                      <tr
                        key={user.id}
                        className={isSelected ? "row-selected" : ""}
                      >
                        <td style={{ textAlign: "center" }}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelectOne(user.id)}
                            aria-label={`Select ${user.name}`}
                          />
                        </td>

                        <td style={{ textAlign: "center" }}>
                          <span
                            className="admin-row-num user-id-pill"
                            title={`User ID: USR-${String(user.id).padStart(3, "0")}`}
                          >
                            USR-{String(user.id).length > 6 ? String(user.id).slice(-4) : String(user.id).padStart(3, "0")}
                          </span>
                        </td>

                        {/* USER AVATAR + DETAILS */}
                        <td>
                          <div className="admin-users-user-cell">
                            <div className="admin-users-user-avatar">
                              {user.initials || "U"}
                            </div>
                            <div className="admin-users-user-text">
                              <strong
                                className="user-clickable-name"
                                onClick={() => setViewingUser(user)}
                              >
                                {user.name}
                              </strong>
                              <span>{user.email}</span>
                            </div>
                          </div>
                        </td>

                        {/* ROLE WITH QUICK SELECT */}
                        <td>
                          <span
                            className={`admin-users-role role-${(
                              user.role || "Member"
                            )
                              .toLowerCase()
                              .replace(/\s+/g, "-")}`}
                          >
                            {user.role}
                          </span>
                        </td>

                        {/* DEPARTMENT */}
                        <td>
                          <span
                            className={`admin-users-dept-badge dept-${(
                              user.department || "Engineering"
                            )
                              .toLowerCase()
                              .replace(/[^a-z0-9]/g, "-")}`}
                          >
                            {user.department || "Engineering"}
                          </span>
                        </td>

                        {/* WORKSPACE */}
                        <td>
                          <div className="admin-users-workspace">
                            <Building2 size={15} />
                            <span>{user.workspace || "TeamFlow Workspace"}</span>
                          </div>
                        </td>

                        {/* CONTACT / PHONE */}
                        <td>
                          <span className="admin-users-phone-text">
                            {user.phone || "+1 (555) 019-2834"}
                          </span>
                        </td>

                        {/* STATUS */}
                        <td>
                          <span
                            className={`admin-users-status status-${(
                              user.status || "Active"
                            ).toLowerCase()}`}
                          >
                            <span className="status-dot" />
                            {user.status || "Active"}
                          </span>
                        </td>

                        {/* JOINED DATE */}
                        <td>
                          <span className="admin-users-date">
                            {user.joined || "Oct 21, 2026"}
                          </span>
                        </td>

                        {/* ACTIONS */}
                        <td className="admin-users-action-cell">
                          <div className="admin-users-inline-actions">
                            <button
                              type="button"
                              className="action-icon-btn view"
                              title="View details"
                              onClick={() => setViewingUser(user)}
                            >
                              <Eye size={15} />
                            </button>
                            <button
                              type="button"
                              className="action-icon-btn edit"
                              title="Edit user"
                              onClick={() => openEditModal(user)}
                            >
                              <Pencil size={15} />
                            </button>
                            <button
                              type="button"
                              className="action-icon-btn delete"
                              title="Delete user"
                              onClick={() => deleteUser(user.id, user.name)}
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

              {filteredUsers.length === 0 && (
                <div className="admin-users-empty">
                  <Users size={44} />
                  <h3>No users match your criteria</h3>
                  <p>Try adjusting your search query, status, or role filter.</p>
                  <button
                    type="button"
                    className="admin-users-clear-filters-btn"
                    onClick={() => {
                      setSearch("");
                      setRoleFilter("All Roles");
                      setStatusFilter("All Status");
                      setWorkspaceFilter("All Workspaces");
                    }}
                  >
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>

            {/* TABLE FOOTER / PAGINATION BAR (Matching Workspace, Tasks, Projects & Bugs) */}
            {filteredUsers.length > 0 && (
              <div className="ws-pagination-bar bp-pagination-bar admin-users-pagination-bar">
                <div className="ws-pagination-info bp-pagination-info">
                  <span>
                    Showing {(currentPage - 1) * perPage + 1} to{" "}
                    {Math.min(currentPage * perPage, filteredUsers.length)} of {filteredUsers.length} users
                  </span>
                  <div className="ws-page-size-wrap bp-page-size-wrap">
                    <span>Rows per page:</span>
                    <select
                      value={perPage}
                      onChange={(e) => {
                        setPerPage(Number(e.target.value));
                        setCurrentPage(1);
                      }}
                    >
                      <option value={5}>5</option>
                      <option value={8}>8</option>
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                    </select>
                  </div>
                </div>

                <div className="ws-pagination-controls bp-pagination-controls">
                  <button
                    type="button"
                    className="ws-page-nav-btn bp-page-nav-btn"
                    disabled={currentPage <= 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  >
                    Previous
                  </button>

                  <div className="ws-page-pills bp-page-pills">
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                      .map((p, i, arr) => (
                        <React.Fragment key={p}>
                          {i > 0 && p - arr[i - 1] > 1 && (
                            <span className="ws-page-ellipsis bp-page-ellipsis">…</span>
                          )}
                          <button
                            type="button"
                            className={`ws-page-num-pill bp-page-num-pill ${
                              currentPage === p ? "active" : ""
                            }`}
                            onClick={() => setCurrentPage(p)}
                          >
                            {p}
                          </button>
                        </React.Fragment>
                      ))}
                  </div>

                  <button
                    type="button"
                    className="ws-page-nav-btn bp-page-nav-btn"
                    disabled={currentPage >= totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </section>
        </main>
      </div>

      {/* ADD / EDIT USER MODAL */}
      {showModal && (
        <div
          className="admin-users-modal-overlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setShowModal(false);
          }}
        >
          <div className="admin-users-modal" role="dialog" aria-modal="true">
            <div className="admin-users-modal-header">
              <div>
                <h2>{editingUser ? "Edit User Account" : "Add New User"}</h2>
                <p>
                  {editingUser
                    ? "Update organizational role, status, and permissions."
                    : "Create a new TeamFlow AI credential with assigned privileges."}
                </p>
              </div>
              <button
                type="button"
                className="admin-users-modal-close"
                onClick={() => setShowModal(false)}
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="admin-users-form">
              <div className="admin-users-form-group">
                <label>
                  Full Name <span className="req">*</span>
                </label>
                <div className="admin-users-input">
                  <Users size={17} />
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleFormChange}
                    placeholder="e.g. John Doe"
                    required
                  />
                </div>
              </div>

              <div className="admin-users-form-group">
                <label>
                  Work Email <span className="req">*</span>
                </label>
                <div className="admin-users-input">
                  <Mail size={17} />
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

              <div className="admin-users-form-row">
                <div className="admin-users-form-group">
                  <label>Role</label>
                  <select
                    name="role"
                    value={form.role}
                    onChange={handleFormChange}
                  >
                    {DEFAULT_ROLES.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="admin-users-form-group">
                  <label>Account Status</label>
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleFormChange}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>
              </div>

              <div className="admin-users-form-row">
                <div className="admin-users-form-group">
                  <label>Assigned Workspace</label>
                  <select
                    name="workspace"
                    value={form.workspace}
                    onChange={handleFormChange}
                  >
                    {DEFAULT_WORKSPACES.map((ws) => (
                      <option key={ws} value={ws}>
                        {ws}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="admin-users-form-group">
                  <label>Department</label>
                  <select
                    name="department"
                    value={form.department}
                    onChange={handleFormChange}
                  >
                    {DEFAULT_DEPARTMENTS.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="admin-users-form-group">
                <label>Contact Phone</label>
                <div className="admin-users-input">
                  <Phone size={17} />
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleFormChange}
                    placeholder="e.g. +1 (555) 019-2834"
                  />
                </div>
              </div>

              <div className="admin-users-modal-actions">
                <button
                  type="button"
                  className="admin-users-cancel-btn"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="admin-users-save-btn">
                  {editingUser ? "Save Changes" : "Create User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW USER DETAILS MODAL */}
      {viewingUser && (
        <div
          className="admin-users-modal-overlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setViewingUser(null);
          }}
        >
          <div className="admin-users-modal user-profile-overview-modal" role="dialog" aria-modal="true">
            <div className="admin-users-modal-header profile-overview-header">
              <div className="profile-header-title-wrap">
                <div className="profile-header-icon">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h2>User Profile Overview</h2>
                  <p>Complete organizational credential records & tenant access.</p>
                </div>
              </div>
              <button
                type="button"
                className="admin-users-modal-close"
                onClick={() => setViewingUser(null)}
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            <div className="admin-users-view-body">
              {/* HERO SECTION */}
              <div className="admin-users-view-hero">
                <div className="admin-users-view-avatar-wrap">
                  <div className="admin-users-view-avatar">
                    {viewingUser.initials || "U"}
                  </div>
                  <span className={`avatar-status-indicator status-${(viewingUser.status || "active").toLowerCase()}`} />
                </div>
                <div className="admin-users-view-hero-info">
                  <div className="hero-name-row">
                    <h3>{viewingUser.name}</h3>
                    <span className="user-id-badge">
                      USR-{String(viewingUser.id).length > 6 ? String(viewingUser.id).slice(-4) : String(viewingUser.id).padStart(3, "0")}
                    </span>
                  </div>
                  <p className="hero-email">
                    <Mail size={14} />
                    <span>{viewingUser.email}</span>
                  </p>
                  <div className="admin-users-view-badges">
                    <span
                      className={`admin-users-role role-${(
                        viewingUser.role || "Member"
                      )
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}
                    >
                      <Shield size={12} />
                      {viewingUser.role}
                    </span>
                    <span
                      className={`admin-users-status status-${(
                        viewingUser.status || "Active"
                      ).toLowerCase()}`}
                    >
                      <span className="status-dot" />
                      {viewingUser.status}
                    </span>
                    <span
                      className={`admin-users-dept-badge dept-${(
                        viewingUser.department || "Engineering"
                      )
                        .toLowerCase()
                        .replace(/[^a-z0-9]/g, "-")}`}
                    >
                      {viewingUser.department || "Engineering"}
                    </span>
                  </div>
                </div>
              </div>

              {/* DETAILS GRID */}
              <div className="admin-users-view-grid">
                <div className="view-grid-item">
                  <div className="grid-item-header">
                    <Building2 size={15} />
                    <label>Workspace</label>
                  </div>
                  <span>{viewingUser.workspace || "TeamFlow Workspace"}</span>
                </div>
                <div className="view-grid-item">
                  <div className="grid-item-header">
                    <Briefcase size={15} />
                    <label>Department</label>
                  </div>
                  <span>{viewingUser.department || "Engineering"}</span>
                </div>
                <div className="view-grid-item">
                  <div className="grid-item-header">
                    <Calendar size={15} />
                    <label>Joined Date</label>
                  </div>
                  <span>{viewingUser.joined || "Oct 21, 2026"}</span>
                </div>
                <div className="view-grid-item">
                  <div className="grid-item-header">
                    <Phone size={15} />
                    <label>Contact Phone</label>
                  </div>
                  <span>{viewingUser.phone || "+1 (555) 019-2834"}</span>
                </div>
              </div>
            </div>

            <div className="admin-users-modal-actions profile-overview-actions">
              <button
                type="button"
                className="admin-users-delete-btn"
                onClick={() => {
                  const targetUser = viewingUser;
                  setConfirmDelete({
                    type: "single",
                    id: targetUser.id,
                    name: targetUser.name,
                    user: targetUser,
                  });
                }}
              >
                <Trash2 size={15} /> Delete User
              </button>
              <div className="profile-actions-right">
                <button
                  type="button"
                  className="admin-users-cancel-btn"
                  onClick={() => {
                    const userToEdit = viewingUser;
                    setViewingUser(null);
                    openEditModal(userToEdit);
                  }}
                >
                  <Pencil size={15} /> Edit User
                </button>
                <button
                  type="button"
                  className="admin-users-save-btn"
                  onClick={() => setViewingUser(null)}
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DELETE / RESET CONFIRMATION MODAL (USER FRIENDLY & ACCESSIBLE) */}
      {confirmDelete && (
        <div
          className="admin-users-modal-overlay"
          onClick={() => setConfirmDelete(null)}
          role="presentation"
        >
          <div
            className="admin-users-modal delete-confirm-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-user-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="modal-header delete-modal-header">
              <div className="delete-modal-icon-badge">
                <Trash2 size={20} />
              </div>
              <div className="delete-modal-header-text">
                <h3 id="delete-user-modal-title">
                  {confirmDelete.type === "single"
                    ? "Delete User Account?"
                    : confirmDelete.type === "bulk"
                    ? `Delete ${confirmDelete.count} Users?`
                    : "Reset to Demo Users?"}
                </h3>
                <span className="delete-modal-subtitle">
                  {confirmDelete.type === "single"
                    ? `User ID: #${confirmDelete.id || (confirmDelete.user && confirmDelete.user.id) || "—"} • Permanent Administrative Action`
                    : confirmDelete.type === "bulk"
                    ? `Batch Deletion of ${confirmDelete.count} Selected Accounts`
                    : "Administrative Database Restore"}
                </span>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setConfirmDelete(null)}
                aria-label="Close dialog"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="modal-body delete-modal-body">
              <p className="delete-modal-lead">
                {confirmDelete.type === "single"
                  ? `Are you sure you want to permanently delete user "${confirmDelete.name}"? All assigned roles, workspaces, and permissions will be removed.`
                  : confirmDelete.type === "bulk"
                  ? `Are you sure you want to permanently delete ${confirmDelete.count} selected users? This action cannot be undone.`
                  : "Are you sure you want to restore default demo users? Any newly created users and role adjustments will be overwritten."}
              </p>

              {/* Single User Preview Card */}
              {confirmDelete.type === "single" && (
                (() => {
                  const u = confirmDelete.user || usersList.find((x) => x.id === confirmDelete.id) || {};
                  return (
                    <div className="delete-user-preview-card">
                      <div className="preview-user-avatar">
                        {u.initials || (u.name || confirmDelete.name || "U").slice(0, 2).toUpperCase()}
                      </div>
                      <div className="preview-user-info">
                        <div className="preview-user-top">
                          <strong className="preview-user-name">{u.name || confirmDelete.name}</strong>
                          {u.status && (
                            <span className={`preview-status-pill status-${(u.status || "active").toLowerCase()}`}>
                              <span className="status-dot" />
                              {u.status}
                            </span>
                          )}
                        </div>
                        <span className="preview-user-email">{u.email || "No email assigned"}</span>
                        <div className="preview-user-chips">
                          {u.role && (
                            <span className="preview-chip role">
                              <Shield size={11} /> {u.role}
                            </span>
                          )}
                          {u.workspace && (
                            <span className="preview-chip workspace">
                              <Building2 size={11} /> {u.workspace}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })()
              )}

              {/* Warning Alert Banner */}
              <div className="delete-modal-alert">
                <AlertCircle size={16} />
                <span>
                  {confirmDelete.type === "single"
                    ? "Warning: This action is permanent and cannot be undone. User authentication sessions and security keys will be revoked immediately."
                    : confirmDelete.type === "bulk"
                    ? "Warning: All selected accounts and their workspace permissions will be permanently expunged."
                    : "Warning: All current user modifications will be replaced by the default template accounts."}
                </span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="modal-footer delete-modal-footer">
              <button
                type="button"
                className="btn-cancel"
                onClick={() => setConfirmDelete(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-danger"
                onClick={handleConfirmDeleteExecution}
              >
                <Trash2 size={15} />
                <span>
                  {confirmDelete.type === "reset"
                    ? "Reset to Demo"
                    : confirmDelete.type === "bulk"
                    ? `Delete ${confirmDelete.count} Users`
                    : "Delete User"}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon, title, value, type, description }) {
  return (
    <div className={`admin-users-stat-card stat-${type}`}>
      <div className={`admin-users-stat-icon ${type}`}>{icon}</div>
      <div className="admin-users-stat-info">
        <span className="admin-users-stat-label">{title}</span>
        <strong className="admin-users-stat-value">{value}</strong>
        <small className="admin-users-stat-desc">{description}</small>
      </div>
    </div>
  );
}