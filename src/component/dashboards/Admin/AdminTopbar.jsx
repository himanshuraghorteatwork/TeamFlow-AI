import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Plus,
  ChevronDown,
  Bell,
  CircleHelp,
  Menu,
  X,
  UserRound,
  Settings,
  Palette,
  ShieldCheck,
  LogOut,
  Building2,
  FolderKanban,
  ListChecks,
  Users,
  Sun,
  Moon,
  Bot,
} from "lucide-react";

import "./AdminTopbar.css";

export default function AdminTopbar({
  onMobileMenuToggle,
  onCreateWorkspace,
  onCreateProject,
  onCreateTask,
  onInviteUser,
  hideCreate = false,
}) {
  const navigate = useNavigate();

  // Dark Mode State
  const [darkMode, setDarkMode] = useState(() => {
    return (
      localStorage.getItem("teamflow_admin_dark") === "true" ||
      document.documentElement.classList.contains("dark")
    );
  });

  // Admin Profile State
  const [adminProfile, setAdminProfile] = useState(() => {
    try {
      const saved = localStorage.getItem("teamflow_admin_profile");
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      firstName: "Amit",
      lastName: "Sharma",
      email: "amit@abctech.com",
      organization: "ABC Technologies",
      avatar: "",
    };
  });

  // Dropdown visibility states
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);
  const [profileOpen, setProfileOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  // Refs for outside click
  const searchRef = useRef(null);
  const notificationRef = useRef(null);
  const profileRef = useRef(null);

  // Sync profile & theme when external updates occur
  useEffect(() => {
    const handleSync = () => {
      try {
        const saved = localStorage.getItem("teamflow_admin_profile");
        if (saved) setAdminProfile(JSON.parse(saved));
      } catch (e) {}
    };

    const handleThemeSync = () => {
      const isDark =
        localStorage.getItem("teamflow_admin_dark") === "true" ||
        document.documentElement.classList.contains("dark");
      setDarkMode(isDark);
    };

    window.addEventListener("storage", handleSync);
    window.addEventListener("storage", handleThemeSync);
    window.addEventListener("teamflow_data_update", handleSync);
    window.addEventListener("teamflow_theme_update", handleThemeSync);
    return () => {
      window.removeEventListener("storage", handleSync);
      window.removeEventListener("storage", handleThemeSync);
      window.removeEventListener("teamflow_data_update", handleSync);
      window.removeEventListener("teamflow_theme_update", handleThemeSync);
    };
  }, []);

  // Sync dark mode class on root HTML
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("teamflow_admin_dark", String(darkMode));
  }, [darkMode]);

  // Global smooth theme transition wrapper
  const applyThemeTransition = (action) => {
    document.documentElement.classList.add("theme-transitioning");
    action();
    window.clearTimeout(window.__tfThemeTimer);
    window.__tfThemeTimer = window.setTimeout(() => {
      document.documentElement.classList.remove("theme-transitioning");
    }, 380);
  };

  const toggleDarkMode = () => {
    applyThemeTransition(() => {
      setDarkMode((prev) => {
        const next = !prev;
        if (next) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
        localStorage.setItem("teamflow_admin_dark", String(next));
        localStorage.setItem("teamflow_theme_mode", next ? "dark" : "light");
        window.dispatchEvent(new Event("teamflow_theme_update"));
        return next;
      });
    });
  };

  const setExplicitTheme = (isDark) => {
    applyThemeTransition(() => {
      setDarkMode(isDark);
      if (isDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      localStorage.setItem("teamflow_admin_dark", String(isDark));
      localStorage.setItem("teamflow_theme_mode", isDark ? "dark" : "light");
      window.dispatchEvent(new Event("teamflow_theme_update"));
    });
  };

  // Close dropdowns on click outside
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setNotificationOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // Keyboard shortcut Ctrl+K
  useEffect(() => {
    const handleShortcut = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        const input = document.querySelector(".tfAdminTopbar__search input");
        input?.focus();
        setSearchOpen(true);
      }
      if (e.key === "Escape") {
        setNotificationOpen(false);
        setProfileOpen(false);
        setSearchOpen(false);
        setHelpOpen(false);
      }
    };

    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  // Live search data
  const searchResults = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return [];

    let projects = [];
    let tasks = [];
    let users = [];
    let workspaces = [];

    try {
      const p = localStorage.getItem("teamflow_admin_projects");
      if (p) projects = JSON.parse(p);
      const t = localStorage.getItem("teamflow_admin_tasks");
      if (t) tasks = JSON.parse(t);
      const u = localStorage.getItem("teamflow_admin_users");
      if (u) users = JSON.parse(u);
      const w = localStorage.getItem("teamflow_admin_workspaces");
      if (w) workspaces = JSON.parse(w);
    } catch (e) {}

    const projectMatches = projects
      .filter((item) => item.name?.toLowerCase().includes(query))
      .map((item) => ({
        id: `project-${item.id}`,
        type: "Project",
        title: item.name,
        subtitle: item.status || "Active",
        route: "/admin/projects",
      }));

    const taskMatches = tasks
      .filter((item) => item.title?.toLowerCase().includes(query))
      .map((item) => ({
        id: `task-${item.id}`,
        type: "Task",
        title: item.title,
        subtitle: item.project || "Task",
        route: "/admin/tasks",
      }));

    const userMatches = users
      .filter(
        (item) =>
          item.name?.toLowerCase().includes(query) ||
          item.email?.toLowerCase().includes(query) ||
          item.role?.toLowerCase().includes(query)
      )
      .map((item) => ({
        id: `user-${item.id}`,
        type: "User",
        title: item.name,
        subtitle: item.role || "Member",
        route: "/admin/users",
      }));

    const workspaceMatches = workspaces
      .filter((item) => item.name?.toLowerCase().includes(query))
      .map((item) => ({
        id: `workspace-${item.id}`,
        type: "Workspace",
        title: item.name,
        subtitle: `${item.plan || "Workspace"} · ${item.members || 0} members`,
        route: "/admin/workspaces",
      }));

    return [...projectMatches, ...taskMatches, ...userMatches, ...workspaceMatches].slice(0, 8);
  }, [search]);

  const goTo = (path) => {
    setNotificationOpen(false);
    setProfileOpen(false);
    setSearchOpen(false);
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.removeItem("teamflow_current_user");
    localStorage.removeItem("teamflow_admin");
    localStorage.removeItem("teamflow_admin_logged_in");
    localStorage.removeItem("teamflow_remember");
    localStorage.removeItem("teamflow_remembered_email");
    localStorage.removeItem("teamflow_remembered_role");

    navigate("/choose-role", {
      replace: true,
      state: { next: "login" },
    });
  };

  const fullName = `${adminProfile.firstName || "Amit"} ${adminProfile.lastName || "Sharma"}`.trim();
  const initial = (adminProfile.firstName || "A").charAt(0).toUpperCase();

  return (
    <>
      <header className="tfAdminTopbar">
        {/* TOPBAR LEFT: HAMBURGER & SEARCH */}
        <div className="tfAdminTopbar__left">
          <button
            type="button"
            className="tfAdminTopbar__mobileMenu"
            onClick={onMobileMenuToggle}
            aria-label="Open navigation"
          >
            <Menu size={20} />
          </button>

          

          {/* SEARCH INPUT */}
          <div className="tfAdminTopbar__searchWrap" ref={searchRef}>
            <div className="tfAdminTopbar__search">
              <Search size={17} />
              <input
                type="text"
                value={search}
                placeholder="Search projects, tasks, users, or anything..."
                onFocus={() => setSearchOpen(true)}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setSearchOpen(true);
                }}
              />
              {search ? (
                <button
                  type="button"
                  className="tfAdminTopbar__clearSearch"
                  onClick={() => {
                    setSearch("");
                    setSearchOpen(false);
                  }}
                  aria-label="Clear search"
                >
                  <X size={15} />
                </button>
              ) : (
                <kbd>Ctrl K</kbd>
              )}
            </div>

            {/* LIVE SEARCH DROPDOWN */}
            {searchOpen && search && (
              <div className="tfAdminTopbar__searchResults">
                {searchResults.length > 0 ? (
                  searchResults.map((result) => (
                    <button
                      key={result.id}
                      type="button"
                      onClick={() => goTo(result.route)}
                    >
                      <span>{result.type}</span>
                      <div>
                        <strong>{result.title}</strong>
                        <small>{result.subtitle}</small>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="tfAdminTopbar__searchEmpty">
                    No results found for "{search}".
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* TOPBAR RIGHT: DARK MODE, NOTIFICATIONS, HELP, PROFILE */}
        <div className="tfAdminTopbar__actions">
          {/* THEME TOGGLE BUTTON / PILL WITH SMOOTH TRANSITION */}
          <div
            className={`tfAdminTopbar__themePill ${darkMode ? "is-dark" : "is-light"}`}
            title={`Current theme: ${darkMode ? "Dark Mode" : "Light Mode"}. Click to toggle.`}
            onClick={toggleDarkMode}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                toggleDarkMode();
              }
            }}
          >
            <span className="tfAdminTopbar__themePillSlider" aria-hidden="true" />
            <button
              type="button"
              className={`tfAdminTopbar__themeBtn ${!darkMode ? "active" : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                setExplicitTheme(false);
              }}
              aria-label="Light mode"
              title="Switch to Light mode"
            >
              <Sun size={15} />
            </button>
            <button
              type="button"
              className={`tfAdminTopbar__themeBtn ${darkMode ? "active" : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                setExplicitTheme(true);
              }}
              aria-label="Dark mode"
              title="Switch to Dark mode"
            >
              <Moon size={15} />
            </button>
          </div>

          {/* NOTIFICATIONS */}
          <div className="tfAdminTopbar__dropdownWrap" ref={notificationRef}>
            <button
              type="button"
              className="tfAdminTopbar__iconButton"
              onClick={() => {
                setNotificationOpen((c) => !c);
                setProfileOpen(false);
              }}
              aria-label="Notifications"
            >
              <Bell size={17} />
              {unreadCount > 0 && <span className="tfAdminTopbar__notificationBadge">{unreadCount}</span>}
            </button>

            {notificationOpen && (
              <div className="tfAdminTopbar__notificationDropdown">
                <div className="tfAdminTopbar__dropdownHeader">
                  <div className="tfAdminTopbar__dropdownHeaderLeft">
                    <strong>Notifications</strong>
                    {unreadCount > 0 && <span className="tfAdminTopbar__unreadTag">{unreadCount} new</span>}
                  </div>
                  <div className="tfAdminTopbar__dropdownHeaderActions">
                    {unreadCount > 0 && (
                      <button type="button" className="tfAdminTopbar__markReadBtn" onClick={() => setUnreadCount(0)}>
                        Mark all read
                      </button>
                    )}
                    <button type="button" onClick={() => goTo("/admin/notifications")}>
                      Settings
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  className="tfAdminTopbar__notificationItem"
                  onClick={() => goTo("/admin/projects")}
                >
                  <span className="tfAdminTopbar__notificationIcon">
                    <FolderKanban size={16} />
                  </span>
                  <div>
                    <strong>New project created</strong>
                    <p>TeamFlow AI Web workspace updated.</p>
                    <small>10 minutes ago</small>
                  </div>
                </button>

                <button
                  type="button"
                  className="tfAdminTopbar__notificationItem"
                  onClick={() => goTo("/admin/users")}
                >
                  <span className="tfAdminTopbar__notificationIcon">
                    <Users size={16} />
                  </span>
                  <div>
                    <strong>New member joined</strong>
                    <p>Sarah Chen joined Marketing Team.</p>
                    <small>35 minutes ago</small>
                  </div>
                </button>

                <button
                  type="button"
                  className="tfAdminTopbar__notificationItem"
                  onClick={() => goTo("/admin/ai-tools")}
                >
                  <span className="tfAdminTopbar__notificationIcon">
                    <Bot size={16} />
                  </span>
                  <div>
                    <strong>AI usage spike</strong>
                    <p>Monthly AI queries reached 12,480 requests.</p>
                    <small>1 hour ago</small>
                  </div>
                </button>
              </div>
            )}
          </div>

          

          {/* PROFILE BUTTON */}
          <div className="tfAdminTopbar__dropdownWrap" ref={profileRef}>
            <button
              type="button"
              className="tfAdminTopbar__profile"
              onClick={() => {
                setProfileOpen((c) => !c);
                setNotificationOpen(false);
              }}
              aria-expanded={profileOpen}
              aria-label="Open account menu"
            >
              <span className="tfAdminTopbar__profileAvatar">
                {adminProfile.avatar ? (
                  <img
                    src={adminProfile.avatar}
                    alt="Admin"
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  initial
                )}
              </span>

              <span className="tfAdminTopbar__profileText">
                <strong>{fullName}</strong>
                <small>Organization Admin</small>
              </span>

              <ChevronDown
                size={14}
                className={
                  profileOpen
                    ? "tfAdminTopbar__profileArrow--open"
                    : "tfAdminTopbar__profileArrow"
                }
              />
            </button>

            {/* PROFILE DROPDOWN */}
            {profileOpen && (
              <div className="tfAdminTopbar__accountMenu">
                <div className="tfAdminTopbar__accountHeader">
                  <div className="tfAdminTopbar__accountAvatar">
                    {adminProfile.avatar ? (
                      <img
                        src={adminProfile.avatar}
                        alt="Admin"
                        style={{
                          width: "100%",
                          height: "100%",
                          borderRadius: "50%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      initial
                    )}
                  </div>
                  <div>
                    <strong>{fullName}</strong>
                    <span>{adminProfile.email || "amit@abctech.com"}</span>
                  </div>
                </div>

                <div className="tfAdminTopbar__accountMenuSection">
                  <button type="button" onClick={() => goTo("/admin/profile")}>
                    <UserRound size={17} />
                    <span>
                      <strong>My Profile</strong>
                      <small>Personal information</small>
                    </span>
                  </button>

                  <button type="button" onClick={() => goTo("/admin/account-settings")}>
                    <Settings size={17} />
                    <span>
                      <strong>Account Settings</strong>
                      <small>Language and preferences</small>
                    </span>
                  </button>

                  <button type="button" onClick={() => goTo("/admin/appearance")}>
                    <Palette size={17} />
                    <span>
                      <strong>Appearance</strong>
                      <small>Theme and display</small>
                    </span>
                  </button>

                  <button type="button" onClick={() => goTo("/admin/notifications")}>
                    <Bell size={17} />
                    <span>
                      <strong>Notifications</strong>
                      <small>Manage alerts</small>
                    </span>
                  </button>

                  <button type="button" onClick={() => goTo("/admin/security")}>
                    <ShieldCheck size={17} />
                    <span>
                      <strong>Security</strong>
                      <small>Password and sessions</small>
                    </span>
                  </button>
                </div>

                <div className="tfAdminTopbar__accountLogout">
                  <button type="button" onClick={handleLogout}>
                    <LogOut size={17} />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* HELP MODAL */}
      {helpOpen && (
        <div
          className="tfAdminTopbar__modalOverlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setHelpOpen(false);
          }}
        >
          <div className="tfAdminTopbar__helpModal">
            <button
              type="button"
              className="tfAdminTopbar__helpClose"
              onClick={() => setHelpOpen(false)}
            >
              <X size={18} />
            </button>
            <div className="tfAdminTopbar__helpIcon">
              <CircleHelp size={28} />
            </div>
            <h3>TeamFlow AI Support Center</h3>
            <p>
              Need assistance managing workspaces, users, permissions, or system security?
              Our customer success and technical teams are ready to help.
            </p>
            <div className="tfAdminTopbar__helpActions">
              <button
                type="button"
                className="primary"
                onClick={() => {
                  setHelpOpen(false);
                  goTo("/admin/support");
                }}
              >
                Help & Support Tickets
              </button>
              <button
                type="button"
                className="secondary"
                onClick={() => {
                  window.location.href =
                    "mailto:support@teamflow.ai?subject=TeamFlow AI Admin Support";
                }}
              >
                Email Support Team
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

