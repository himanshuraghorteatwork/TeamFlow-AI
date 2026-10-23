
import { useEffect, useMemo, useState } from "react";
import {
  Users as UsersIcon,
  UserCheck,
  UserX,
  UserPlus,
  Search,
  Plus,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  X,
  ChevronLeft,
  ChevronRight,
  Building2,
  CalendarDays,
  ShieldCheck,
  Mail,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Filter,
} from "lucide-react";
import "./Users.css";

const STORAGE_KEY = "teamflow_superadmin_users";

const INITIAL_USERS = [
  {
    id: "USR-1001",
    name: "Aarav Sharma",
    email: "aarav.sharma@example.com",
    organization: "Acme Technologies",
    role: "Admin",
    status: "Active",
    joinedAt: "2026-10-02",
  },
  {
    id: "USR-1002",
    name: "Priya Patel",
    email: "priya.patel@example.com",
    organization: "Bright Solutions",
    role: "Manager",
    status: "Active",
    joinedAt: "2026-10-05",
  },
  {
    id: "USR-1003",
    name: "Rahul Verma",
    email: "rahul.verma@example.com",
    organization: "Acme Technologies",
    role: "Member",
    status: "Active",
    joinedAt: "2026-10-07",
  },
  {
    id: "USR-1004",
    name: "Sneha Desai",
    email: "sneha.desai@example.com",
    organization: "Nova Digital",
    role: "Manager",
    status: "Suspended",
    joinedAt: "2026-09-18",
  },
  {
    id: "USR-1005",
    name: "Arjun Mehta",
    email: "arjun.mehta@example.com",
    organization: "Bright Solutions",
    role: "Member",
    status: "Active",
    joinedAt: "2026-10-12",
  },
  {
    id: "USR-1006",
    name: "Ananya Joshi",
    email: "ananya.joshi@example.com",
    organization: "CloudNine Labs",
    role: "Admin",
    status: "Active",
    joinedAt: "2026-10-15",
  },
  {
    id: "USR-1007",
    name: "Karan Singh",
    email: "karan.singh@example.com",
    organization: "Nova Digital",
    role: "Member",
    status: "Suspended",
    joinedAt: "2026-09-24",
  },
  {
    id: "USR-1008",
    name: "Isha Kulkarni",
    email: "isha.kulkarni@example.com",
    organization: "CloudNine Labs",
    role: "Manager",
    status: "Active",
    joinedAt: "2026-10-19",
  },
  {
    id: "USR-1009",
    name: "Vikram Rao",
    email: "vikram.rao@example.com",
    organization: "Acme Technologies",
    role: "Member",
    status: "Active",
    joinedAt: "2026-10-21",
  },
  {
    id: "USR-1010",
    name: "Meera Shah",
    email: "meera.shah@example.com",
    organization: "Bright Solutions",
    role: "Member",
    status: "Active",
    joinedAt: "2026-10-23",
  },
];

const EMPTY_FORM = {
  name: "",
  email: "",
  organization: "",
  role: "Member",
  status: "Active",
};

const getInitialUsers = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (error) {
    console.error("Unable to load saved users:", error);
  }

  return INITIAL_USERS;
};

const getInitialOrganizations = (users) => [
  ...new Set(users.map((user) => user.organization).filter(Boolean)),
];

const formatDate = (date) => {
  if (!date) return "—";

  const parsed = new Date(`${date}T00:00:00`);

  if (Number.isNaN(parsed.getTime())) return "—";

  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getInitials = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

const getAvatarClass = (name = "") => {
  const colors = ["blue", "purple", "green", "orange", "pink", "cyan"];
  const index = name.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return colors[index % colors.length];
};

export default function Users() {
  const [users, setUsers] = useState(getInitialUsers);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [organizationFilter, setOrganizationFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [menuId, setMenuId] = useState(null);
  const [modal, setModal] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const pageSize = 6;

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    } catch (error) {
      console.error("Unable to save users:", error);
    }
  }, [users]);

  useEffect(() => {
    if (!toast) return undefined;

    const timeout = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timeout);
  }, [toast]);

  useEffect(() => {
    const closeMenu = () => setMenuId(null);
    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, []);

  const organizations = useMemo(
    () => getInitialOrganizations(users),
    [users]
  );

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        !query ||
        [
          user.name,
          user.email,
          user.id,
          user.organization,
          user.role,
        ].some((value) => String(value || "").toLowerCase().includes(query));

      const matchesRole = roleFilter === "All" || user.role === roleFilter;
      const matchesStatus =
        statusFilter === "All" || user.status === statusFilter;
      const matchesOrganization =
        organizationFilter === "All" ||
        user.organization === organizationFilter;

      return (
        matchesSearch &&
        matchesRole &&
        matchesStatus &&
        matchesOrganization
      );
    });
  }, [users, search, roleFilter, statusFilter, organizationFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize));
  const safePage = Math.min(page, totalPages);

  const paginatedUsers = filteredUsers.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize
  );

  const activeCount = users.filter((user) => user.status === "Active").length;
  const suspendedCount = users.filter(
    (user) => user.status === "Suspended"
  ).length;

  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  const newThisMonth = users.filter((user) => {
    if (!user.joinedAt) return false;
    const date = new Date(`${user.joinedAt}T00:00:00`);

    return (
      date.getMonth() === currentMonth &&
      date.getFullYear() === currentYear
    );
  }).length;

  const notify = (message, type = "success") => setToast({ message, type });

  const openAddModal = () => {
    setSelectedUser(null);
    setForm({
      ...EMPTY_FORM,
      organization: organizations[0] || "",
    });
    setErrors({});
    setModal("add");
    setMenuId(null);
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setForm({
      name: user.name || "",
      email: user.email || "",
      organization: user.organization || "",
      role: user.role || "Member",
      status: user.status || "Active",
    });
    setErrors({});
    setModal("edit");
    setMenuId(null);
  };

  const openDetailsModal = (user) => {
    setSelectedUser(user);
    setModal("details");
    setMenuId(null);
  };

  const updateForm = (field, value) => {
    setForm((previous) => ({ ...previous, [field]: value }));
    setErrors((previous) => ({ ...previous, [field]: "" }));
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!form.name.trim()) {
      nextErrors.name = "Full name is required.";
    }

    if (!form.email.trim()) {
      nextErrors.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      nextErrors.email = "Enter a valid email address.";
    }

    const duplicateEmail = users.some(
      (user) =>
        user.email.toLowerCase() === form.email.trim().toLowerCase() &&
        user.id !== selectedUser?.id
    );

    if (duplicateEmail) {
      nextErrors.email = "This email address already exists.";
    }

    if (!form.organization.trim()) {
      nextErrors.organization = "Organization is required.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const saveUser = (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    if (modal === "add") {
      const newUser = {
        id: `USR-${Date.now().toString().slice(-8)}`,
        name: form.name.trim(),
        email: form.email.trim(),
        organization: form.organization.trim(),
        role: form.role,
        status: form.status,
        joinedAt: new Date().toISOString().slice(0, 10),
      };

      setUsers((previous) => [newUser, ...previous]);
      setPage(1);
      notify("User added successfully.");
    } else if (modal === "edit" && selectedUser) {
      setUsers((previous) =>
        previous.map((user) =>
          user.id === selectedUser.id
            ? {
                ...user,
                name: form.name.trim(),
                email: form.email.trim(),
                organization: form.organization.trim(),
                role: form.role,
                status: form.status,
              }
            : user
        )
      );
      notify("User updated successfully.");
    }

    setModal(null);
    setSelectedUser(null);
  };

  const toggleStatus = (user) => {
    const nextStatus = user.status === "Active" ? "Suspended" : "Active";

    setUsers((previous) =>
      previous.map((item) =>
        item.id === user.id ? { ...item, status: nextStatus } : item
      )
    );

    setMenuId(null);
    notify(
      nextStatus === "Active"
        ? `${user.name} has been activated.`
        : `${user.name} has been suspended.`
    );
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;

    setUsers((previous) =>
      previous.filter((user) => user.id !== deleteTarget.id)
    );

    notify(`${deleteTarget.name} has been deleted.`);
    setDeleteTarget(null);
    setMenuId(null);
  };

  const resetFilters = () => {
    setSearch("");
    setRoleFilter("All");
    setStatusFilter("All");
    setOrganizationFilter("All");
    setPage(1);
  };

  const handleSearch = (value) => {
    setSearch(value);
    setPage(1);
  };

  const handleFilter = (setter, value) => {
    setter(value);
    setPage(1);
  };

  return (
    <div className="users-page">
      <header className="users-page-header">
        <div>
          <div className="users-breadcrumb">
            <span>Super Admin</span>
            <span className="users-breadcrumb-separator">/</span>
            <span>Users Management</span>
          </div>

          <h1>Users Management</h1>
          <p className="users-page-subtitle">
            Manage user accounts, roles, and access across your organizations.
          </p>
        </div>

        <button className="users-primary-button" onClick={openAddModal}>
          <Plus size={18} />
          <span>Add User</span>
        </button>
      </header>

      <section className="users-stats-grid">
        <article className="users-stat-card">
          <div className="users-stat-top">
            <div className="users-stat-icon users-stat-blue">
              <UsersIcon size={21} />
            </div>
            <span className="users-stat-label">All accounts</span>
          </div>
          <div className="users-stat-value">{users.length}</div>
          <div className="users-stat-foot">Total registered users</div>
        </article>

        <article className="users-stat-card">
          <div className="users-stat-top">
            <div className="users-stat-icon users-stat-green">
              <UserCheck size={21} />
            </div>
            <span className="users-stat-label">Access enabled</span>
          </div>
          <div className="users-stat-value">{activeCount}</div>
          <div className="users-stat-foot">Active user accounts</div>
        </article>

        <article className="users-stat-card">
          <div className="users-stat-top">
            <div className="users-stat-icon users-stat-orange">
              <UserX size={21} />
            </div>
            <span className="users-stat-label">Access restricted</span>
          </div>
          <div className="users-stat-value">{suspendedCount}</div>
          <div className="users-stat-foot">Suspended accounts</div>
        </article>

        <article className="users-stat-card">
          <div className="users-stat-top">
            <div className="users-stat-icon users-stat-purple">
              <UserPlus size={21} />
            </div>
            <span className="users-stat-label">New members</span>
          </div>
          <div className="users-stat-value">{newThisMonth}</div>
          <div className="users-stat-foot">Joined this month</div>
        </article>
      </section>

      <section className="users-table-panel">
        <div className="users-table-heading">
          <div>
            <h2>User directory</h2>
            <p>View and manage user access across your workspace.</p>
          </div>

          <span className="users-total-badge">
            {filteredUsers.length}{" "}
            {filteredUsers.length === 1 ? "user" : "users"}
          </span>
        </div>

        <div className="users-toolbar">
          <label className="users-search">
            <Search size={18} />
            <input
              type="search"
              placeholder="Search name, email, ID..."
              value={search}
              onChange={(event) => handleSearch(event.target.value)}
            />
          </label>

          <label className="users-filter-control">
            <Filter size={16} />
            <select
              aria-label="Filter by role"
              value={roleFilter}
              onChange={(event) =>
                handleFilter(setRoleFilter, event.target.value)
              }
            >
              <option value="All">All roles</option>
              <option value="Admin">Admin</option>
              <option value="Manager">Manager</option>
              <option value="Member">Member</option>
            </select>
          </label>

          <label className="users-filter-control">
            <select
              aria-label="Filter by status"
              value={statusFilter}
              onChange={(event) =>
                handleFilter(setStatusFilter, event.target.value)
              }
            >
              <option value="All">All statuses</option>
              <option value="Active">Active</option>
              <option value="Suspended">Suspended</option>
            </select>
          </label>

          <label className="users-filter-control users-organization-filter">
            <Building2 size={16} />
            <select
              aria-label="Filter by organization"
              value={organizationFilter}
              onChange={(event) =>
                handleFilter(setOrganizationFilter, event.target.value)
              }
            >
              <option value="All">All organizations</option>
              {organizations.map((organization) => (
                <option key={organization} value={organization}>
                  {organization}
                </option>
              ))}
            </select>
          </label>

          <button
            className="users-reset-button"
            onClick={resetFilters}
            title="Reset filters"
            aria-label="Reset filters"
          >
            <RefreshCw size={16} />
          </button>
        </div>

        <div className="users-table-scroll">
          <table className="users-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Organization</th>
                <th>Role</th>
                <th>Status</th>
                <th>Date joined</th>
                <th className="users-actions-heading">Actions</th>
              </tr>
            </thead>

            <tbody>
              {paginatedUsers.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className="users-identity-cell">
                      <div
                        className={`users-avatar users-avatar-${getAvatarClass(
                          user.name
                        )}`}
                      >
                        {getInitials(user.name)}
                      </div>
                      <div className="users-identity-info">
                        <span className="users-name">{user.name}</span>
                        <span className="users-email">{user.email}</span>
                        <span className="users-id">{user.id}</span>
                      </div>
                    </div>
                  </td>

                  <td>
                    <div className="users-organization-cell">
                      <Building2 size={15} />
                      <span>{user.organization || "—"}</span>
                    </div>
                  </td>

                  <td>
                    <span className={`users-role-tag users-role-${user.role.toLowerCase()}`}>
                      {user.role}
                    </span>
                  </td>

                  <td>
                    <span
                      className={`users-status-tag ${
                        user.status === "Active"
                          ? "users-status-active"
                          : "users-status-suspended"
                      }`}
                    >
                      <span className="users-status-dot" />
                      {user.status}
                    </span>
                  </td>

                  <td>
                    <div className="users-date-cell">
                      <CalendarDays size={15} />
                      <span>{formatDate(user.joinedAt)}</span>
                    </div>
                  </td>

                  <td>
                    <div
                      className="users-row-menu-wrap"
                      onClick={(event) => event.stopPropagation()}
                    >
                      <button
                        className="users-row-menu-trigger"
                        aria-label={`Actions for ${user.name}`}
                        aria-expanded={menuId === user.id}
                        onClick={() =>
                          setMenuId((current) =>
                            current === user.id ? null : user.id
                          )
                        }
                      >
                        <MoreHorizontal size={19} />
                      </button>

                      {menuId === user.id && (
                        <div className="users-row-menu">
                          <button onClick={() => openDetailsModal(user)}>
                            <Eye size={16} />
                            View details
                          </button>
                          <button onClick={() => openEditModal(user)}>
                            <Pencil size={16} />
                            Edit user
                          </button>
                          <button onClick={() => toggleStatus(user)}>
                            {user.status === "Active" ? (
                              <UserX size={16} />
                            ) : (
                              <UserCheck size={16} />
                            )}
                            {user.status === "Active"
                              ? "Suspend user"
                              : "Activate user"}
                          </button>
                          <div className="users-menu-divider" />
                          <button
                            className="users-menu-danger"
                            onClick={() => {
                              setDeleteTarget(user);
                              setMenuId(null);
                            }}
                          >
                            <Trash2 size={16} />
                            Delete user
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {paginatedUsers.length === 0 && (
                <tr>
                  <td colSpan={6}>
                    <div className="users-empty-state">
                      <div className="users-empty-icon">
                        <UsersIcon size={25} />
                      </div>
                      <h3>No users found</h3>
                      <p>
                        Try adjusting your search or filters to find users.
                      </p>
                      <button
                        className="users-secondary-button"
                        onClick={resetFilters}
                      >
                        Reset filters
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <footer className="users-table-footer">
          <span className="users-pagination-summary">
            Showing{" "}
            <strong>
              {filteredUsers.length === 0
                ? 0
                : (safePage - 1) * pageSize + 1}
              –
              {Math.min(safePage * pageSize, filteredUsers.length)}
            </strong>{" "}
            of <strong>{filteredUsers.length}</strong> users
          </span>

          <div className="users-pagination">
            <button
              aria-label="Previous page"
              disabled={safePage <= 1}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
            >
              <ChevronLeft size={17} />
            </button>

            <span>
              Page <strong>{safePage}</strong> of <strong>{totalPages}</strong>
            </span>

            <button
              aria-label="Next page"
              disabled={safePage >= totalPages}
              onClick={() =>
                setPage((current) => Math.min(totalPages, current + 1))
              }
            >
              <ChevronRight size={17} />
            </button>
          </div>
        </footer>
      </section>

      <div className="users-demo-note">
        <ShieldCheck size={17} />
        <span>
          Demo mode: user changes are saved in this browser. Connect the backend
          to manage real accounts and permissions.
        </span>
      </div>

      {toast && (
        <div
          className={`users-toast users-toast-${toast.type}`}
          role="status"
        >
          {toast.type === "success" ? (
            <CheckCircle2 size={18} />
          ) : (
            <AlertTriangle size={18} />
          )}
          <span>{toast.message}</span>
          <button
            aria-label="Dismiss notification"
            onClick={() => setToast(null)}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {(modal === "add" || modal === "edit") && (
        <div
          className="users-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setModal(null);
          }}
        >
          <section
            className="users-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="users-form-title"
          >
            <header className="users-modal-header">
              <div className="users-modal-title-group">
                <div className="users-modal-icon">
                  {modal === "add" ? (
                    <UserPlus size={21} />
                  ) : (
                    <Pencil size={20} />
                  )}
                </div>
                <div>
                  <h2 id="users-form-title">
                    {modal === "add" ? "Add new user" : "Edit user"}
                  </h2>
                  <p>
                    {modal === "add"
                      ? "Enter the details for the new account."
                      : "Update this user's account information."}
                  </p>
                </div>
              </div>
              <button
                className="users-modal-close"
                aria-label="Close dialog"
                onClick={() => setModal(null)}
              >
                <X size={20} />
              </button>
            </header>

            <form onSubmit={saveUser}>
              <div className="users-form-grid">
                <label className="users-form-field users-form-full">
                  <span>Full name <b>*</b></span>
                  <input
                    value={form.name}
                    onChange={(event) => updateForm("name", event.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    autoFocus
                  />
                  {errors.name && (
                    <small className="users-form-error">{errors.name}</small>
                  )}
                </label>

                <label className="users-form-field users-form-full">
                  <span>Email address <b>*</b></span>
                  <div className="users-input-with-icon">
                    <Mail size={17} />
                    <input
                      type="email"
                      value={form.email}
                      onChange={(event) =>
                        updateForm("email", event.target.value)
                      }
                      placeholder="name@company.com"
                    />
                  </div>
                  {errors.email && (
                    <small className="users-form-error">{errors.email}</small>
                  )}
                </label>

                <label className="users-form-field users-form-full">
                  <span>Organization <b>*</b></span>
                  <input
                    list="users-organization-options"
                    value={form.organization}
                    onChange={(event) =>
                      updateForm("organization", event.target.value)
                    }
                    placeholder="Enter organization name"
                  />
                  <datalist id="users-organization-options">
                    {organizations.map((organization) => (
                      <option key={organization} value={organization} />
                    ))}
                  </datalist>
                  {errors.organization && (
                    <small className="users-form-error">
                      {errors.organization}
                    </small>
                  )}
                </label>

                <label className="users-form-field">
                  <span>Role</span>
                  <select
                    value={form.role}
                    onChange={(event) => updateForm("role", event.target.value)}
                  >
                    <option value="Admin">Admin</option>
                    <option value="Manager">Manager</option>
                    <option value="Member">Member</option>
                  </select>
                </label>

                <label className="users-form-field">
                  <span>Account status</span>
                  <select
                    value={form.status}
                    onChange={(event) =>
                      updateForm("status", event.target.value)
                    }
                  >
                    <option value="Active">Active</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </label>
              </div>

              <footer className="users-modal-actions">
                <button
                  type="button"
                  className="users-secondary-button"
                  onClick={() => setModal(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="users-primary-button">
                  {modal === "add" ? (
                    <Plus size={17} />
                  ) : (
                    <CheckCircle2 size={17} />
                  )}
                  {modal === "add" ? "Create user" : "Save changes"}
                </button>
              </footer>
            </form>
          </section>
        </div>
      )}

      {modal === "details" && selectedUser && (
        <div
          className="users-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setModal(null);
          }}
        >
          <section
            className="users-modal users-details-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="users-details-title"
          >
            <header className="users-modal-header">
              <div>
                <h2 id="users-details-title">User details</h2>
                <p>Account information and access status.</p>
              </div>
              <button
                className="users-modal-close"
                aria-label="Close dialog"
                onClick={() => setModal(null)}
              >
                <X size={20} />
              </button>
            </header>

            <div className="users-details-identity">
              <div
                className={`users-avatar users-avatar-large users-avatar-${getAvatarClass(
                  selectedUser.name
                )}`}
              >
                {getInitials(selectedUser.name)}
              </div>
              <div>
                <h3>{selectedUser.name}</h3>
                <p>{selectedUser.email}</p>
                <span
                  className={`users-status-tag ${
                    selectedUser.status === "Active"
                      ? "users-status-active"
                      : "users-status-suspended"
                  }`}
                >
                  <span className="users-status-dot" />
                  {selectedUser.status}
                </span>
              </div>
            </div>

            <div className="users-details-grid">
              <div className="users-detail-item">
                <span>User ID</span>
                <strong>{selectedUser.id}</strong>
              </div>
              <div className="users-detail-item">
                <span>Role</span>
                <strong>{selectedUser.role}</strong>
              </div>
              <div className="users-detail-item">
                <span>Organization</span>
                <strong>{selectedUser.organization || "—"}</strong>
              </div>
              <div className="users-detail-item">
                <span>Date joined</span>
                <strong>{formatDate(selectedUser.joinedAt)}</strong>
              </div>
            </div>

            <footer className="users-modal-actions">
              <button
                className="users-secondary-button"
                onClick={() => setModal(null)}
              >
                Close
              </button>
              <button
                className="users-primary-button"
                onClick={() => openEditModal(selectedUser)}
              >
                <Pencil size={17} />
                Edit user
              </button>
            </footer>
          </section>
        </div>
      )}

      {deleteTarget && (
        <div
          className="users-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setDeleteTarget(null);
          }}
        >
          <section
            className="users-modal users-confirm-modal"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="users-delete-title"
          >
            <div className="users-delete-icon">
              <AlertTriangle size={25} />
            </div>
            <h2 id="users-delete-title">Delete this user?</h2>
            <p>
              This will remove <strong>{deleteTarget.name}</strong> from the
              demo user directory. This action cannot be undone.
            </p>
            <footer className="users-modal-actions">
              <button
                className="users-secondary-button"
                onClick={() => setDeleteTarget(null)}
              >
                Cancel
              </button>
              <button
                className="users-danger-button"
                onClick={confirmDelete}
              >
                <Trash2 size={17} />
                Delete user
              </button>
            </footer>
          </section>
        </div>
      )}
    </div>
  );
}
