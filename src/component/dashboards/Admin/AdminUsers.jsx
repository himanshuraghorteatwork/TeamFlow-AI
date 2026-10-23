import React, { useMemo, useState } from "react";
import {
  Search,
  Plus,
  Moon,
  Bell,
  CircleHelp,
  ChevronDown,
  Users,
  UserCheck,
  UserX,
  ShieldCheck,
  MoreVertical,
  X,
  Mail,
  Building2,
  Trash2,
  Pencil,
} from "lucide-react";

import AdminSidebar from "../../../layouts/AdminSidebar/AdminSidebar.jsx";
import { initialUsers } from "./adminUsersData.js";
import "./AdminUsers.css";

const STORAGE_KEY = "teamflow_admin_users";

const loadUsers = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : initialUsers;
  } catch {
    return initialUsers;
  }
};

function AdminUsers() {
  const [usersList, setUsersList] = useState(loadUsers);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All Roles");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [openMenu, setOpenMenu] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "Member",
    workspace: "TeamFlow Workspace",
    status: "Active",
  });

  const saveUsers = (newUsers) => {
    setUsersList(newUsers);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUsers));
  };

  const filteredUsers = useMemo(() => {
    return usersList.filter((user) => {
      const term = search.toLowerCase();

      const matchesSearch =
        user.name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term) ||
        user.workspace.toLowerCase().includes(term);

      const matchesRole =
        roleFilter === "All Roles" || user.role === roleFilter;

      const matchesStatus =
        statusFilter === "All Status" || user.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [usersList, search, roleFilter, statusFilter]);

  const stats = {
    total: usersList.length,
    active: usersList.filter((u) => u.status === "Active").length,
    inactive: usersList.filter((u) => u.status !== "Active").length,
    admins: usersList.filter((u) => u.role === "Admin").length,
  };

  const openAddModal = () => {
    setEditingUser(null);

    setForm({
      name: "",
      email: "",
      role: "Member",
      workspace: "TeamFlow Workspace",
      status: "Active",
    });

    setShowModal(true);
  };

  const openEditModal = (user) => {
    setEditingUser(user);

    setForm({
      name: user.name,
      email: user.email,
      role: user.role,
      workspace: user.workspace,
      status: user.status,
    });

    setOpenMenu(null);
    setShowModal(true);
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.name.trim() || !form.email.trim()) {
      alert("Please enter name and email.");
      return;
    }

    if (editingUser) {
      const updatedUsers = usersList.map((user) =>
        user.id === editingUser.id
          ? {
              ...user,
              ...form,
              initials: form.name
                .split(" ")
                .map((word) => word[0])
                .join("")
                .substring(0, 2)
                .toUpperCase(),
            }
          : user
      );

      saveUsers(updatedUsers);
    } else {
      const newUser = {
        id: Date.now(),
        ...form,
        initials: form.name
          .split(" ")
          .map((word) => word[0])
          .join("")
          .substring(0, 2)
          .toUpperCase(),
        joined: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        }),
      };

      saveUsers([newUser, ...usersList]);
    }

    setShowModal(false);
  };

  const deleteUser = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmed) return;

    saveUsers(usersList.filter((user) => user.id !== id));
    setOpenMenu(null);
  };

  const toggleUserStatus = (id) => {
    const updated = usersList.map((user) =>
      user.id === id
        ? {
            ...user,
            status: user.status === "Active" ? "Suspended" : "Active",
          }
        : user
    );

    saveUsers(updated);
    setOpenMenu(null);
  };

  return (
    <div className="admin-users-app">
      <AdminSidebar />

      <div className="admin-users-main">
        {/* TOPBAR */}
        <header className="admin-users-topbar">
          <div className="admin-users-global-search">
            <Search size={18} />

            <input
              type="text"
              placeholder="Search users, workspaces, projects..."
            />

            <span>Ctrl + K</span>
          </div>

          <div className="admin-users-top-actions">
            <button className="admin-users-create" onClick={openAddModal}>
              <Plus size={18} />
              Create
              <ChevronDown size={15} />
            </button>

            <button className="admin-users-icon-button">
              <Moon size={18} />
            </button>

            <button className="admin-users-icon-button notification-button">
              <Bell size={18} />
              <span className="notification-count">12</span>
            </button>

            <button className="admin-users-icon-button">
              <CircleHelp size={18} />
            </button>

            <div className="admin-users-profile">
              <div className="admin-users-avatar">HR</div>

              <div>
                <strong>Himanshu</strong>
                <small>Super Administrator</small>
              </div>

              <ChevronDown size={16} />
            </div>
          </div>
        </header>

        {/* PAGE */}
        <main className="admin-users-content">
          <div className="admin-users-heading">
            <div>
              <span className="admin-users-breadcrumb">
                USERS / MANAGEMENT
              </span>

              <h1>User Management</h1>

              <p>
                Manage users, roles, permissions and account access across
                TeamFlow AI.
              </p>
            </div>

            <button className="admin-users-add-button" onClick={openAddModal}>
              <Plus size={18} />
              Add User
            </button>
          </div>

          {/* STATS */}
          <section className="admin-users-stats">
            <StatCard
              icon={<Users size={22} />}
              title="Total Users"
              value={stats.total}
              type="purple"
              description="Across TeamFlow AI"
            />

            <StatCard
              icon={<UserCheck size={22} />}
              title="Active Users"
              value={stats.active}
              type="green"
              description="Currently active"
            />

            <StatCard
              icon={<UserX size={22} />}
              title="Inactive / Suspended"
              value={stats.inactive}
              type="red"
              description="Require attention"
            />

            <StatCard
              icon={<ShieldCheck size={22} />}
              title="Administrators"
              value={stats.admins}
              type="blue"
              description="Admin accounts"
            />
          </section>

          {/* FILTERS */}
          <section className="admin-users-filter-card">
            <div className="admin-users-search">
              <Search size={18} />

              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search name, email or workspace..."
              />
            </div>

            <select
              value={roleFilter}
              onChange={(event) => setRoleFilter(event.target.value)}
            >
              <option>All Roles</option>
              <option>Admin</option>
              <option>Team Lead</option>
              <option>Member</option>
            </select>

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option>All Status</option>
              <option>Active</option>
              <option>Inactive</option>
              <option>Suspended</option>
            </select>
          </section>

          <div className="admin-users-result">
            Showing {filteredUsers.length} users
          </div>

          {/* TABLE */}
          <section className="admin-users-table-card">
            <div className="admin-users-table-wrapper">
              <table className="admin-users-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Role</th>
                    <th>Workspace</th>
                    <th>Status</th>
                    <th>Joined</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <div className="admin-users-user-cell">
                          <div className="admin-users-user-avatar">
                            {user.initials}
                          </div>

                          <div>
                            <strong>{user.name}</strong>
                            <span>{user.email}</span>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span
                          className={`admin-users-role role-${user.role
                            .toLowerCase()
                            .replace(" ", "-")}`}
                        >
                          {user.role}
                        </span>
                      </td>

                      <td>
                        <div className="admin-users-workspace">
                          <Building2 size={16} />
                          {user.workspace}
                        </div>
                      </td>

                      <td>
                        <span
                          className={`admin-users-status status-${user.status.toLowerCase()}`}
                        >
                          <span />
                          {user.status}
                        </span>
                      </td>

                      <td>{user.joined}</td>

                      <td className="admin-users-action-cell">
                        <button
                          className="admin-users-menu-button"
                          onClick={() =>
                            setOpenMenu(
                              openMenu === user.id ? null : user.id
                            )
                          }
                        >
                          <MoreVertical size={18} />
                        </button>

                        {openMenu === user.id && (
                          <div className="admin-users-dropdown">
                            <button onClick={() => openEditModal(user)}>
                              <Pencil size={15} />
                              Edit User
                            </button>

                            <button
                              onClick={() => toggleUserStatus(user.id)}
                            >
                              <UserCheck size={15} />
                              {user.status === "Active"
                                ? "Suspend User"
                                : "Activate User"}
                            </button>

                            <button
                              className="delete"
                              onClick={() => deleteUser(user.id)}
                            >
                              <Trash2 size={15} />
                              Delete User
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredUsers.length === 0 && (
                <div className="admin-users-empty">
                  <Users size={42} />
                  <h3>No users found</h3>
                  <p>Try changing your search or filters.</p>
                </div>
              )}
            </div>
          </section>
        </main>
      </div>

      {/* MODAL */}
      {showModal && (
        <div
          className="admin-users-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setShowModal(false);
            }
          }}
        >
          <div className="admin-users-modal">
            <div className="admin-users-modal-header">
              <div>
                <h2>{editingUser ? "Edit User" : "Add New User"}</h2>
                <p>
                  {editingUser
                    ? "Update user account information."
                    : "Create a new TeamFlow AI user."}
                </p>
              </div>

              <button onClick={() => setShowModal(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <label>
                Full Name
                <div className="admin-users-input">
                  <Users size={17} />

                  <input
                    name="name"
                    value={form.name}
                    onChange={handleFormChange}
                    placeholder="Enter full name"
                  />
                </div>
              </label>

              <label>
                Email Address
                <div className="admin-users-input">
                  <Mail size={17} />

                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleFormChange}
                    placeholder="name@company.com"
                  />
                </div>
              </label>

              <div className="admin-users-form-row">
                <label>
                  Role
                  <select
                    name="role"
                    value={form.role}
                    onChange={handleFormChange}
                  >
                    <option>Admin</option>
                    <option>Team Lead</option>
                    <option>Member</option>
                  </select>
                </label>

                <label>
                  Status
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleFormChange}
                  >
                    <option>Active</option>
                    <option>Inactive</option>
                    <option>Suspended</option>
                  </select>
                </label>
              </div>

              <label>
                Workspace
                <select
                  name="workspace"
                  value={form.workspace}
                  onChange={handleFormChange}
                >
                  <option>TeamFlow Workspace</option>
                  <option>Marketing Team</option>
                  <option>Design Studio</option>
                  <option>Development Hub</option>
                  <option>Research Lab</option>
                  <option>Startup Team</option>
                </select>
              </label>

              <div className="admin-users-modal-actions">
                <button
                  type="button"
                  className="admin-users-cancel"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>

                <button type="submit" className="admin-users-save">
                  {editingUser ? "Save Changes" : "Add User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon, title, value, type, description }) {
  return (
    <div className="admin-users-stat-card">
      <div className={`admin-users-stat-icon ${type}`}>{icon}</div>

      <div>
        <span>{title}</span>
        <strong>{value}</strong>
        <small>{description}</small>
      </div>
    </div>
  );
}

export default AdminUsers;