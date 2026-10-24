import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import {
  Search,
  Plus,
  ChevronDown,
  Moon,
  Sun,
  Bell,
  CircleHelp,
  Building2,
  Users,
  FolderKanban,
  Grid2X2,
  List,
  MoreVertical,
  Eye,
  Ban,
  CheckCircle2,
  X,
  Settings,
  LogOut,
  CheckCheck,
  Mail,
  RotateCcw,
  HardDrive,
  Trash2,
  UserRound,
} from "lucide-react";

import "./AdminWorkspace.css";

import AdminSidebar from "../../../layouts/AdminSidebar/AdminSidebar.jsx";
/* =========================================================
   DEFAULT DATA
========================================================= */

const DEFAULT_WORKSPACES = [
  {
    id: 1,
    name: "TeamFlow Workspace",
    status: "Active",
    owner: "John Doe",
    email: "john@company.com",
    members: 24,
    projects: 12,
    storage: 72,
    plan: "Enterprise",
    created: "Oct 21, 2026",
  },
  {
    id: 2,
    name: "Marketing Team",
    status: "Active",
    owner: "Sarah Chen",
    email: "sarah@modernlab.com",
    members: 12,
    projects: 8,
    storage: 48,
    plan: "Business",
    created: "Oct 18, 2026",
  },
  {
    id: 3,
    name: "Design Studio",
    status: "Active",
    owner: "Emily Parker",
    email: "emily@designhub.com",
    members: 8,
    projects: 6,
    storage: 61,
    plan: "Pro",
    created: "Oct 15, 2026",
  },
  {
    id: 4,
    name: "Research Lab",
    status: "Suspended",
    owner: "Alex Morgan",
    email: "alex@researchlab.com",
    members: 18,
    projects: 9,
    storage: 83,
    plan: "Enterprise",
    created: "Oct 12, 2026",
  },
  {
    id: 5,
    name: "Development Hub",
    status: "Active",
    owner: "David Kim",
    email: "david@devhub.com",
    members: 28,
    projects: 14,
    storage: 67,
    plan: "Business",
    created: "Oct 10, 2026",
  },
  {
    id: 6,
    name: "Startup Team",
    status: "Inactive",
    owner: "Lisa Brown",
    email: "lisa@startup.com",
    members: 7,
    projects: 4,
    storage: 32,
    plan: "Free",
    created: "Oct 08, 2026",
  },
];

const SEARCH_ITEMS = [
  { label: "Dashboard", path: "/admin/dashboard" },
  { label: "Workspaces", path: "/admin/workspaces" },
  { label: "Users", path: "/admin/users" },
  { label: "Projects", path: "/admin/projects" },
  { label: "Tasks", path: "/admin/tasks" },
  { label: "AI Tools", path: "/admin/ai-tools" },
  { label: "Billing & Payments", path: "/admin/billing" },
  { label: "Subscriptions", path: "/admin/subscriptions" },
  { label: "Analytics", path: "/admin/analytics" },
  { label: "Announcements", path: "/admin/announcements" },
  { label: "Reports", path: "/admin/reports" },
  { label: "Settings", path: "/admin/settings" },
];

/* =========================================================
   COMPONENT
========================================================= */

function AdminWorkspace() {
  const navigate = useNavigate();

  const topbarRef = useRef(null);
  const globalSearchRef = useRef(null);

  /* ================= DATA ================= */

  const [workspaces, setWorkspaces] = useState(() => {
    try {
      const saved = localStorage.getItem("teamflow_admin_workspaces");

      if (saved) {
        const parsed = JSON.parse(saved);

        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (error) {
      console.error("Workspace data error:", error);
    }

    return DEFAULT_WORKSPACES;
  });

  /* ================= FILTERS ================= */

  const [workspaceSearch, setWorkspaceSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [planFilter, setPlanFilter] = useState("All");
  const [viewMode, setViewMode] = useState("grid");

  /* ================= TOPBAR ================= */

  const [globalSearch, setGlobalSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("teamflow_admin_dark") === "true";
  });

  /* ================= WORKSPACE MENU ================= */

  const [activeMenu, setActiveMenu] = useState(null);

  /* ================= MODALS ================= */

  const [createModal, setCreateModal] = useState(false);
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);

  const [newWorkspace, setNewWorkspace] = useState({
    name: "",
    owner: "",
    email: "",
    plan: "Free",
  });

  /* ================= NOTIFICATIONS ================= */

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "New workspace created",
      message: "Development Hub was added successfully.",
      time: "2 min ago",
      read: false,
    },
    {
      id: 2,
      title: "New member joined",
      message: "A member joined Marketing Team.",
      time: "18 min ago",
      read: false,
    },
    {
      id: 3,
      title: "Storage warning",
      message: "Research Lab storage reached 83%.",
      time: "1 hour ago",
      read: false,
    },
  ]);

  /* =========================================================
     LOCAL STORAGE
  ========================================================= */

  useEffect(() => {
    localStorage.setItem(
      "teamflow_admin_workspaces",
      JSON.stringify(workspaces)
    );
  }, [workspaces]);

  useEffect(() => {
    localStorage.setItem("teamflow_admin_dark", String(darkMode));
  }, [darkMode]);

  /* =========================================================
     KEYBOARD
  ========================================================= */

  useEffect(() => {
    const handleKeyboard = (event) => {
      if (
        (event.ctrlKey || event.metaKey) &&
        event.key.toLowerCase() === "k"
      ) {
        event.preventDefault();

        globalSearchRef.current?.focus();
        setSearchOpen(true);
      }

      if (event.key === "Escape") {
        closeMenus();
        setCreateModal(false);
        setSelectedWorkspace(null);
        setHelpOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyboard);

    return () => {
      window.removeEventListener("keydown", handleKeyboard);
    };
  }, []);

  /* =========================================================
     OUTSIDE CLICK
  ========================================================= */

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (topbarRef.current && !topbarRef.current.contains(event.target)) {
        setCreateOpen(false);
        setNotificationOpen(false);
        setProfileOpen(false);
        setSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  /* =========================================================
     HELPERS
  ========================================================= */

  const closeMenus = () => {
    setCreateOpen(false);
    setNotificationOpen(false);
    setProfileOpen(false);
    setSearchOpen(false);
    setActiveMenu(null);
  };

  const navigateTo = (path) => {
    closeMenus();
    setGlobalSearch("");
    navigate(path);
  };

  /* =========================================================
     GLOBAL SEARCH
  ========================================================= */

  const globalResults = useMemo(() => {
    if (!globalSearch.trim()) return [];

    return SEARCH_ITEMS.filter((item) =>
      item.label.toLowerCase().includes(globalSearch.toLowerCase())
    );
  }, [globalSearch]);

  /* =========================================================
     FILTER WORKSPACES
  ========================================================= */

  const filteredWorkspaces = useMemo(() => {
    const query = workspaceSearch.trim().toLowerCase();

    return workspaces.filter((workspace) => {
      const searchMatch =
        !query ||
        workspace.name.toLowerCase().includes(query) ||
        workspace.owner.toLowerCase().includes(query) ||
        workspace.email.toLowerCase().includes(query);

      const statusMatch =
        statusFilter === "All" || workspace.status === statusFilter;

      const planMatch =
        planFilter === "All" || workspace.plan === planFilter;

      return searchMatch && statusMatch && planMatch;
    });
  }, [workspaces, workspaceSearch, statusFilter, planFilter]);

  /* =========================================================
     STATISTICS
  ========================================================= */

  const totalWorkspaces = workspaces.length;

  const activeWorkspaces = workspaces.filter(
    (workspace) => workspace.status === "Active"
  ).length;

  const suspendedWorkspaces = workspaces.filter(
    (workspace) => workspace.status === "Suspended"
  ).length;

  const totalMembers = workspaces.reduce(
    (total, workspace) => total + Number(workspace.members || 0),
    0
  );

  /* =========================================================
     CREATE WORKSPACE
  ========================================================= */

  const handleCreateWorkspace = (event) => {
    event.preventDefault();

    const name = newWorkspace.name.trim();
    const owner = newWorkspace.owner.trim();
    const email = newWorkspace.email.trim();

    if (!name || !owner || !email) {
      alert("Please complete all required fields.");
      return;
    }

    const workspace = {
      id: Date.now(),
      name,
      owner,
      email,
      status: "Active",
      members: 1,
      projects: 0,
      storage: 0,
      plan: newWorkspace.plan,
      created: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }),
    };

    setWorkspaces((current) => [workspace, ...current]);

    setNotifications((current) => [
      {
        id: Date.now(),
        title: "Workspace created",
        message: `${name} was created successfully.`,
        time: "Just now",
        read: false,
      },
      ...current,
    ]);

    setNewWorkspace({
      name: "",
      owner: "",
      email: "",
      plan: "Free",
    });

    setCreateModal(false);
  };

  /* =========================================================
     STATUS
  ========================================================= */

  const toggleStatus = (id) => {
    setWorkspaces((current) =>
      current.map((workspace) => {
        if (workspace.id !== id) return workspace;

        return {
          ...workspace,
          status: workspace.status === "Active" ? "Suspended" : "Active",
        };
      })
    );

    setActiveMenu(null);
  };

  /* =========================================================
     DELETE
  ========================================================= */

  const deleteWorkspace = (id) => {
    const workspace = workspaces.find((item) => item.id === id);

    if (!workspace) return;

    const confirmed = window.confirm(
      `Delete "${workspace.name}" workspace?`
    );

    if (!confirmed) return;

    setWorkspaces((current) =>
      current.filter((workspaceItem) => workspaceItem.id !== id)
    );

    setActiveMenu(null);
  };

  /* =========================================================
     RESET
  ========================================================= */

  const resetData = () => {
    const confirmed = window.confirm(
      "Reset all workspace demo data?"
    );

    if (!confirmed) return;

    setWorkspaces(DEFAULT_WORKSPACES);

    setWorkspaceSearch("");
    setStatusFilter("All");
    setPlanFilter("All");
  };

  /* =========================================================
     NOTIFICATIONS
  ========================================================= */

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  const readNotification = (id) => {
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllRead = () => {
    setNotifications((current) =>
      current.map((notification) => ({
        ...notification,
        read: true,
      }))
    );
  };

  /* =========================================================
     LOGOUT
  ========================================================= */

  const logout = () => {
    const confirmed = window.confirm("Do you want to logout?");

    if (!confirmed) return;

    localStorage.removeItem("teamflow_admin");
    localStorage.removeItem("teamflow_admin_logged_in");
    localStorage.removeItem("teamflow_current_user");

    sessionStorage.removeItem("teamflow_admin");
    sessionStorage.removeItem("teamflow_admin_logged_in");

    navigate("/login", {
      replace: true,
    });
  };

  return (
    <div
      className={`admin-workspace-app ${darkMode ? "dark" : ""}`}
    >
      <AdminSidebar />

      <div className="admin-workspace-main">

        {/* =====================================================
            TOPBAR
        ===================================================== */}

        <header
          ref={topbarRef}
          className="admin-workspace-topbar"
        >
          {/* GLOBAL SEARCH */}

          <div className="admin-workspace-global-search-wrapper">
            <div className="admin-workspace-global-search">
              <Search size={18} />

              <input
                ref={globalSearchRef}
                value={globalSearch}
                placeholder="Search workspaces, users, projects..."
                onFocus={() => setSearchOpen(true)}
                onChange={(event) => {
                  setGlobalSearch(event.target.value);
                  setSearchOpen(true);
                }}
              />

              {globalSearch ? (
                <button
                  type="button"
                  className="admin-workspace-search-clear"
                  onClick={() => setGlobalSearch("")}
                >
                  <X size={14} />
                </button>
              ) : (
                <span>Ctrl + K</span>
              )}
            </div>

            {searchOpen && globalSearch && (
              <div className="admin-workspace-search-results">
                {globalResults.length > 0 ? (
                  globalResults.map((item) => (
                    <button
                      type="button"
                      key={item.path}
                      onClick={() => navigateTo(item.path)}
                    >
                      <Search size={15} />
                      {item.label}
                    </button>
                  ))
                ) : (
                  <p>No results found</p>
                )}
              </div>
            )}
          </div>

          {/* ACTIONS */}

          <div className="admin-workspace-top-actions">

            {/* CREATE */}

            <div className="admin-workspace-top-dropdown">
              <button
                type="button"
                className="admin-workspace-create-top"
                onClick={() => {
                  setCreateOpen((current) => !current);
                  setNotificationOpen(false);
                  setProfileOpen(false);
                }}
              >
                <Plus size={17} />
                <span>Create</span>
                <ChevronDown size={14} />
              </button>

              {createOpen && (
                <div className="admin-workspace-create-menu">
                  <button
                    type="button"
                    onClick={() => {
                      closeMenus();
                      setCreateModal(true);
                    }}
                  >
                    <Building2 size={17} />

                    <span>
                      <strong>Workspace</strong>
                      <small>Create a new workspace</small>
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => navigateTo("/admin/users")}
                  >
                    <Users size={17} />

                    <span>
                      <strong>User</strong>
                      <small>Manage platform users</small>
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => navigateTo("/admin/projects")}
                  >
                    <FolderKanban size={17} />

                    <span>
                      <strong>Project</strong>
                      <small>Manage projects</small>
                    </span>
                  </button>
                </div>
              )}
            </div>

            {/* DARK MODE */}

            <button
              type="button"
              className={`admin-workspace-icon-btn ${
                darkMode ? "active" : ""
              }`}
              title={darkMode ? "Light Mode" : "Dark Mode"}
              onClick={() => setDarkMode((current) => !current)}
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* NOTIFICATIONS */}

            <div className="admin-workspace-top-dropdown">
              <button
                type="button"
                className={`admin-workspace-icon-btn notification ${
                  notificationOpen ? "active" : ""
                }`}
                onClick={() => {
                  setNotificationOpen((current) => !current);
                  setCreateOpen(false);
                  setProfileOpen(false);
                }}
              >
                <Bell size={18} />

                {unreadCount > 0 && <span>{unreadCount}</span>}
              </button>

              {notificationOpen && (
                <div className="admin-workspace-notification-menu">
                  <div className="admin-workspace-notification-header">
                    <div>
                      <strong>Notifications</strong>
                      <small>{unreadCount} unread</small>
                    </div>

                    <button
                      type="button"
                      onClick={markAllRead}
                    >
                      <CheckCheck size={13} />
                      Mark all read
                    </button>
                  </div>

                  {notifications.map((notification) => (
                    <button
                      type="button"
                      key={notification.id}
                      className={`admin-workspace-notification-item ${
                        !notification.read ? "unread" : ""
                      }`}
                      onClick={() =>
                        readNotification(notification.id)
                      }
                    >
                      <span className="admin-workspace-notification-item-icon">
                        <Bell size={14} />
                      </span>

                      <span className="admin-workspace-notification-item-content">
                        <strong>{notification.title}</strong>

                        <small>{notification.message}</small>

                        <em>{notification.time}</em>
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* HELP */}

            <button
              type="button"
              className="admin-workspace-icon-btn"
              onClick={() => setHelpOpen(true)}
            >
              <CircleHelp size={18} />
            </button>

            {/* PROFILE */}

            <div className="admin-workspace-top-dropdown">
              <button
                type="button"
                className="admin-workspace-profile"
                onClick={() => {
                  setProfileOpen((current) => !current);
                  setCreateOpen(false);
                  setNotificationOpen(false);
                }}
              >
                <div className="admin-workspace-avatar">
                  HR
                </div>

                <div>
                  <strong>Himanshu</strong>
                  <small>Super Administrator</small>
                </div>

                <ChevronDown size={15} />
              </button>

              {profileOpen && (
                <div className="admin-workspace-profile-menu">
                  <div className="admin-workspace-profile-menu-header">
                    <span className="admin-workspace-profile-menu-avatar">
                      HR
                    </span>

                    <div>
                      <strong>Himanshu</strong>
                      <small>Super Administrator</small>
                    </div>
                  </div>

                  <div className="admin-workspace-profile-divider" />

                  <button
                    type="button"
                    onClick={() => navigateTo("/admin/settings")}
                  >
                    <Settings size={16} />
                    Settings
                  </button>

                  <button
                    type="button"
                    className="admin-workspace-logout-btn"
                    onClick={logout}
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* =====================================================
            PAGE
        ===================================================== */}

        <main className="admin-workspace-content">

          {/* HEADING */}

          <section className="admin-workspace-heading">
            <div>
              <p className="admin-workspace-eyebrow">
                <Building2 size={14} />
                ADMIN / WORKSPACES
              </p>

              <h1>Workspace Management</h1>

              <p>
                Manage and monitor every TeamFlow AI workspace.
              </p>
            </div>

            <button
              type="button"
              className="admin-workspace-primary-btn"
              onClick={() => setCreateModal(true)}
            >
              <Plus size={17} />
              Create Workspace
            </button>
          </section>

          {/* STATS */}

          <section className="admin-workspace-stats">
            <StatCard
              icon={<Building2 size={21} />}
              color="purple"
              title="Total Workspaces"
              value={totalWorkspaces}
              description="Across TeamFlow AI"
            />

            <StatCard
              icon={<CheckCircle2 size={21} />}
              color="green"
              title="Active Workspaces"
              value={activeWorkspaces}
              description="Currently operational"
            />

            <StatCard
              icon={<Ban size={21} />}
              color="red"
              title="Suspended"
              value={suspendedWorkspaces}
              description="Require attention"
            />

            <StatCard
              icon={<Users size={21} />}
              color="blue"
              title="Total Members"
              value={totalMembers}
              description="Across all workspaces"
            />
          </section>

          {/* TOOLBAR */}

          <section className="admin-workspace-toolbar">
            <div className="admin-workspace-search">
              <Search size={17} />

              <input
                value={workspaceSearch}
                placeholder="Search workspace name, owner or email..."
                onChange={(event) =>
                  setWorkspaceSearch(event.target.value)
                }
              />

              {workspaceSearch && (
                <button
                  type="button"
                  className="admin-workspace-search-clear"
                  onClick={() => setWorkspaceSearch("")}
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value)
              }
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Suspended">Suspended</option>
              <option value="Inactive">Inactive</option>
            </select>

            <select
              value={planFilter}
              onChange={(event) =>
                setPlanFilter(event.target.value)
              }
            >
              <option value="All">All Plans</option>
              <option value="Free">Free</option>
              <option value="Pro">Pro</option>
              <option value="Business">Business</option>
              <option value="Enterprise">Enterprise</option>
            </select>

            <div className="admin-workspace-view-buttons">
              <button
                type="button"
                className={viewMode === "grid" ? "active" : ""}
                onClick={() => setViewMode("grid")}
              >
                <Grid2X2 size={16} />
              </button>

              <button
                type="button"
                className={viewMode === "list" ? "active" : ""}
                onClick={() => setViewMode("list")}
              >
                <List size={17} />
              </button>
            </div>
          </section>

          {/* RESULT */}

          <div className="admin-workspace-result-row">
            <span>
              Showing {filteredWorkspaces.length} workspace
              {filteredWorkspaces.length !== 1 ? "s" : ""}
            </span>

            <button
              type="button"
              onClick={resetData}
            >
              <RotateCcw size={13} />
              Reset Demo Data
            </button>
          </div>

          {/* WORKSPACE CARDS */}

          {filteredWorkspaces.length > 0 ? (
            <section
              className={`admin-workspace-grid ${
                viewMode === "list"
                  ? "admin-workspace-list-mode"
                  : ""
              }`}
            >
              {filteredWorkspaces.map((workspace) => (
                <WorkspaceCard
                  key={workspace.id}
                  workspace={workspace}
                  activeMenu={activeMenu}
                  setActiveMenu={setActiveMenu}
                  onView={() => {
                    setSelectedWorkspace(workspace);
                    setActiveMenu(null);
                  }}
                  onStatus={() => toggleStatus(workspace.id)}
                  onDelete={() => deleteWorkspace(workspace.id)}
                />
              ))}
            </section>
          ) : (
            <div className="admin-workspace-empty">
              <Building2 size={40} />

              <h3>No workspaces found</h3>

              <p>
                Try changing your search or filters.
              </p>

              <button
                type="button"
                onClick={() => {
                  setWorkspaceSearch("");
                  setStatusFilter("All");
                  setPlanFilter("All");
                }}
              >
                Clear Filters
              </button>
            </div>
          )}
        </main>
      </div>

      {/* =====================================================
          CREATE MODAL
      ===================================================== */}

      {createModal && (
        <div
          className="admin-workspace-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setCreateModal(false);
            }
          }}
        >
          <div className="admin-workspace-modal">
            <div className="admin-workspace-modal-header">
              <div>
                <h2>Create Workspace</h2>
                <p>
                  Create and configure a new TeamFlow AI workspace.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setCreateModal(false)}
              >
                <X size={17} />
              </button>
            </div>

            <form
              className="admin-workspace-form"
              onSubmit={handleCreateWorkspace}
            >
              <label>
                Workspace Name

                <input
                  type="text"
                  required
                  placeholder="Engineering Team"
                  value={newWorkspace.name}
                  onChange={(event) =>
                    setNewWorkspace({
                      ...newWorkspace,
                      name: event.target.value,
                    })
                  }
                />
              </label>

              <div className="admin-workspace-form-grid">
                <label>
                  Owner Name

                  <input
                    type="text"
                    required
                    placeholder="John Doe"
                    value={newWorkspace.owner}
                    onChange={(event) =>
                      setNewWorkspace({
                        ...newWorkspace,
                        owner: event.target.value,
                      })
                    }
                  />
                </label>

                <label>
                  Owner Email

                  <input
                    type="email"
                    required
                    placeholder="john@company.com"
                    value={newWorkspace.email}
                    onChange={(event) =>
                      setNewWorkspace({
                        ...newWorkspace,
                        email: event.target.value,
                      })
                    }
                  />
                </label>
              </div>

              <label>
                Subscription Plan

                <select
                  value={newWorkspace.plan}
                  onChange={(event) =>
                    setNewWorkspace({
                      ...newWorkspace,
                      plan: event.target.value,
                    })
                  }
                >
                  <option value="Free">Free</option>
                  <option value="Pro">Pro</option>
                  <option value="Business">Business</option>
                  <option value="Enterprise">Enterprise</option>
                </select>
              </label>

              <div className="admin-workspace-modal-actions">
                <button
                  type="button"
                  className="admin-workspace-cancel"
                  onClick={() => setCreateModal(false)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="admin-workspace-save"
                >
                  <Plus size={15} />
                  Create Workspace
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================
          VIEW DETAILS
      ===================================================== */}

      {selectedWorkspace && (
        <div
          className="admin-workspace-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedWorkspace(null);
            }
          }}
        >
          <div className="admin-workspace-details">
            <button
              type="button"
              className="admin-workspace-details-close"
              onClick={() => setSelectedWorkspace(null)}
            >
              <X size={17} />
            </button>

            <div className="admin-workspace-details-logo">
              {selectedWorkspace.name.charAt(0).toUpperCase()}
            </div>

            <h2>{selectedWorkspace.name}</h2>

            <StatusBadge status={selectedWorkspace.status} />

            <div className="admin-workspace-details-grid">
              <Detail
                label="Owner"
                value={selectedWorkspace.owner}
              />

              <Detail
                label="Email"
                value={selectedWorkspace.email}
              />

              <Detail
                label="Members"
                value={selectedWorkspace.members}
              />

              <Detail
                label="Projects"
                value={selectedWorkspace.projects}
              />

              <Detail
                label="Plan"
                value={selectedWorkspace.plan}
              />

              <Detail
                label="Storage"
                value={`${selectedWorkspace.storage}%`}
              />

              <Detail
                label="Created"
                value={selectedWorkspace.created}
              />

              <Detail
                label="Status"
                value={selectedWorkspace.status}
              />
            </div>

            <button
              type="button"
              className="admin-workspace-save"
              onClick={() => setSelectedWorkspace(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* =====================================================
          HELP
      ===================================================== */}

      {helpOpen && (
        <div
          className="admin-workspace-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setHelpOpen(false);
            }
          }}
        >
          <div className="admin-workspace-help-card">
            <button
              type="button"
              className="admin-workspace-help-close"
              onClick={() => setHelpOpen(false)}
            >
              <X size={17} />
            </button>

            <span className="admin-workspace-help-icon">
              <CircleHelp size={25} />
            </span>

            <h2>TeamFlow AI Support</h2>

            <p>
              Need help managing users, workspaces,
              subscriptions or platform settings?
              Contact the TeamFlow AI support team.
            </p>

            <button
              type="button"
              onClick={() => {
                window.location.href =
                  "mailto:support@teamflow.ai?subject=TeamFlow AI Admin Support";
              }}
            >
              Contact Support
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
  icon,
  color,
  title,
  value,
  description,
}) {
  return (
    <div className="admin-workspace-stat-card">
      <div className={`admin-workspace-stat-icon ${color}`}>
        {icon}
      </div>

      <div>
        <span>{title}</span>
        <strong>{value}</strong>
        <small>{description}</small>
      </div>
    </div>
  );
}

/* =========================================================
   WORKSPACE CARD
========================================================= */

function WorkspaceCard({
  workspace,
  activeMenu,
  setActiveMenu,
  onView,
  onStatus,
  onDelete,
}) {
  return (
    <article className="admin-workspace-card">

      <div className="admin-workspace-card-header">
        <div className="admin-workspace-title-area">
          <div className="admin-workspace-card-logo">
            {workspace.name.charAt(0).toUpperCase()}
          </div>

          <div>
            <h3>{workspace.name}</h3>

            <StatusBadge status={workspace.status} />
          </div>
        </div>

        <div className="admin-workspace-menu-container">
          <button
            type="button"
            className="admin-workspace-menu-button"
            onClick={() =>
              setActiveMenu(
                activeMenu === workspace.id
                  ? null
                  : workspace.id
              )
            }
          >
            <MoreVertical size={17} />
          </button>

          {activeMenu === workspace.id && (
            <div className="admin-workspace-dropdown">
              <button
                type="button"
                onClick={onView}
              >
                <Eye size={15} />
                View
              </button>

              <button
                type="button"
                onClick={onStatus}
              >
                {workspace.status === "Active" ? (
                  <>
                    <Ban size={15} />
                    Suspend
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={15} />
                    Activate
                  </>
                )}
              </button>

              <button
                type="button"
                className="danger"
                onClick={onDelete}
              >
                <Trash2 size={15} />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* OWNER */}

      <div className="admin-workspace-owner">
        <div className="admin-workspace-owner-avatar">
          {workspace.owner.charAt(0).toUpperCase()}
        </div>

        <div>
          <strong>{workspace.owner}</strong>
          <span>{workspace.email}</span>
        </div>
      </div>

      {/* STATS */}

      <div className="admin-workspace-card-stats">
        <div>
          <Users size={15} />

          <span>
            <strong>{workspace.members}</strong>
            Members
          </span>
        </div>

        <div>
          <FolderKanban size={15} />

          <span>
            <strong>{workspace.projects}</strong>
            Projects
          </span>
        </div>
      </div>

      {/* STORAGE */}

      <div className="admin-workspace-storage">
        <div>
          <span>
            <HardDrive size={13} />
            Storage
          </span>

          <strong>{workspace.storage}%</strong>
        </div>

        <div className="admin-workspace-storage-track">
          <span
            style={{
              width: `${workspace.storage}%`,
            }}
          />
        </div>
      </div>

      {/* META */}

      <div className="admin-workspace-card-meta">
        <PlanBadge plan={workspace.plan} />

        <small>
          Created {workspace.created}
        </small>
      </div>

      <button
        type="button"
        className="admin-workspace-view-btn"
        onClick={onView}
      >
        <Eye size={14} />
        View Workspace
      </button>
    </article>
  );
}

/* =========================================================
   STATUS
========================================================= */

function StatusBadge({ status }) {
  return (
    <span
      className={`admin-workspace-status ${status.toLowerCase()}`}
    >
      {status}
    </span>
  );
}

/* =========================================================
   PLAN
========================================================= */

function PlanBadge({ plan }) {
  return (
    <span
      className={`admin-workspace-plan ${plan.toLowerCase()}`}
    >
      {plan}
    </span>
  );
}

/* =========================================================
   DETAIL
========================================================= */

function Detail({ label, value }) {
  return (
    <div className="admin-workspace-detail-item">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

export default AdminWorkspace;