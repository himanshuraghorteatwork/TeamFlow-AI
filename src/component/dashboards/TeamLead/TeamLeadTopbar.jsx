import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  ChevronDown,
  Bell,
  Menu,
  X,
  Settings,
  LogOut,
  FolderKanban,
  CheckSquare,
  Bug,
  Users,
  Sun,
  Moon,
  Sparkles,
  CalendarDays,
  Clock3,
  MessageCircle,
  FileText,
  Activity,
  ArrowRight,
  Zap,
} from "lucide-react";
import "../Admin/AdminTopbar.css";
import "./TeamLeadTopbar.css";

export default function TeamLeadTopbar({
  onMobileMenuToggle,
  profileName = "Komal Pawar",
}) {
  const navigate = useNavigate();

  // Helper to read initial dark mode state accurately matching Admin & SuperAdmin
  const getInitialDarkMode = () => {
    try {
      const adminDark = localStorage.getItem("teamflow_admin_dark");
      if (adminDark !== null) return adminDark === "true";

      const themeMode = localStorage.getItem("teamflow_theme_mode");
      if (themeMode !== null) return themeMode === "dark";

      const superDark = localStorage.getItem("teamflow_superadmin_dark_mode");
      if (superDark !== null) return superDark === "true";

      const tlDark = localStorage.getItem("teamflow_dark_mode");
      if (tlDark !== null) return tlDark === "true";

      return (
        document.documentElement.classList.contains("dark") ||
        document.documentElement.classList.contains("dark-mode")
      );
    } catch {
      return false;
    }
  };

  const [darkMode, setDarkMode] = useState(getInitialDarkMode);

  // Synchronize theme to DOM and localStorage matching Admin Panel system
  const applyThemeToDOM = (isDark) => {
    if (typeof document === "undefined") return;

    document.documentElement.classList.add("theme-transitioning");

    if (isDark) {
      document.documentElement.classList.add("dark", "sa-dark-mode", "dark-mode");
      document.body.classList.add("dark", "dark-theme", "sa-dark-mode", "dark-mode");
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark", "sa-dark-mode", "dark-mode");
      document.body.classList.remove("dark", "dark-theme", "sa-dark-mode", "dark-mode");
      document.documentElement.setAttribute("data-theme", "light");
    }

    try {
      localStorage.setItem("teamflow_admin_dark", String(isDark));
      localStorage.setItem("teamflow_superadmin_dark_mode", String(isDark));
      localStorage.setItem("teamflow_theme_mode", isDark ? "dark" : "light");
      localStorage.setItem("teamflow_dark_mode", String(isDark));
    } catch {
      // ignore storage errors
    }

    window.dispatchEvent(new Event("teamflow_theme_update"));

    window.clearTimeout(window.__tfThemeTimer);
    window.__tfThemeTimer = window.setTimeout(() => {
      document.documentElement.classList.remove("theme-transitioning");
    }, 350);
  };

  useEffect(() => {
    applyThemeToDOM(darkMode);
  }, [darkMode]);

  // Sync when external theme changes occur
  useEffect(() => {
    const handleThemeSync = () => {
      const isDark = getInitialDarkMode();
      setDarkMode((cur) => (cur !== isDark ? isDark : cur));
    };

    window.addEventListener("storage", handleThemeSync);
    window.addEventListener("teamflow_theme_update", handleThemeSync);
    return () => {
      window.removeEventListener("storage", handleThemeSync);
      window.removeEventListener("teamflow_theme_update", handleThemeSync);
    };
  }, []);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  // State for popovers
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);

  const searchRef = useRef(null);
  const searchInputRef = useRef(null);
  const notificationRef = useRef(null);
  const profileRef = useRef(null);

  // Keyboard shortcut Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
        setSearchOpen(true);
      }
      if (e.key === "Escape") {
        setSearchOpen(false);
        setNotificationOpen(false);
        setProfileOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setSearchOpen(false);
      if (notificationRef.current && !notificationRef.current.contains(e.target)) setNotificationOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Search dataset
  const searchItems = useMemo(() => [
    { title: "Sprint 24 Dashboard", category: "Navigation", path: "/teamlead/dashboard", icon: LayoutDashboardIcon },
    { title: "Sprint Hub & Active Sprint", category: "Work", path: "/teamlead/sprints", icon: Zap },
    { title: "Team Workload Balancing", category: "Team", path: "/teamlead/workload", icon: Activity },
    { title: "Engineering Squad Members", category: "Team", path: "/teamlead/team", icon: Users },
    { title: "Projects Management", category: "Work", path: "/teamlead/projects", icon: FolderKanban },
    { title: "Sprint Tasks & Kanbans", category: "Work", path: "/teamlead/tasks", icon: CheckSquare },
    { title: "Bug Tracker & Triage", category: "Work", path: "/teamlead/bugs", icon: Bug },
    { title: "Team Standups & Meetings", category: "Collaboration", path: "/teamlead/meetings", icon: Clock3 },
    { title: "Team Chat & Channels", category: "Collaboration", path: "/teamlead/chat", icon: MessageCircle },
    { title: "Sprint Calendar", category: "Collaboration", path: "/teamlead/calendar", icon: CalendarDays },
    { title: "AI Assistant Co-Pilot", category: "AI Tools", path: "/teamlead/ai-assistant", icon: Sparkles },
    { title: "AI Daily Standup Summaries", category: "AI Tools", path: "/teamlead/ai-summaries", icon: FileText },
    { title: "AI Smart Task Suggestions", category: "AI Tools", path: "/teamlead/task-suggestions", icon: Sparkles },
    { title: "Team Performance Velocity", category: "Reports", path: "/teamlead/reports", icon: Activity },
    { title: "Project Burndown Reports", category: "Reports", path: "/teamlead/project-reports", icon: FolderKanban },
    { title: "Team Notifications", category: "Settings", path: "/teamlead/notifications", icon: Bell },
    { title: "Team Settings & Sprint Config", category: "Settings", path: "/teamlead/settings", icon: Settings },
  ], []);

  const searchResults = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return [];
    return searchItems.filter(
      (item) => item.title.toLowerCase().includes(q) || item.category.toLowerCase().includes(q)
    ).slice(0, 7);
  }, [search, searchItems]);

  const handleSelectSearchResult = (path) => {
    setSearch("");
    setSearchOpen(false);
    navigate(path);
  };

  const handleLogout = () => {
    [
      "token",
      "user",
      "teamflow_current_user",
      "teamflow_teamlead",
      "teamflow_user",
    ].forEach((k) => {
      localStorage.removeItem(k);
      sessionStorage.removeItem(k);
    });
    sessionStorage.clear();
    navigate("/choose-role");
  };

  return (
    <header className="tfAdminTopbar tfTeamLeadTopbar">
      {/* LEFT SECTION: MOBILE HAMBURGER + FULL GLOBAL SEARCH (MATCHING ADMIN & SUPER ADMIN) */}
      <div className="tfAdminTopbar__left">
        <button
          type="button"
          className="tfAdminTopbar__mobileMenu"
          onClick={onMobileMenuToggle}
          aria-label="Toggle mobile menu"
        >
          <Menu size={18} />
        </button>

        {/* SEARCH BAR */}
        <div className="tfAdminTopbar__searchWrap" ref={searchRef}>
          <div className="tfAdminTopbar__search">
            <Search size={16} />
            <input
              ref={searchInputRef}
              type="text"
              value={search}
              placeholder="Search tasks, projects, members, bugs, or AI..."
              onChange={(e) => {
                setSearch(e.target.value);
                setSearchOpen(true);
              }}
              onFocus={() => setSearchOpen(true)}
              aria-label="Global search"
            />
            {search && (
              <button
                type="button"
                className="tfAdminTopbar__clearSearch"
                onClick={() => setSearch("")}
                aria-label="Clear search"
              >
                <X size={13} />
              </button>
            )}
            <kbd>Ctrl K</kbd>
          </div>

          {/* SEARCH RESULTS DROPDOWN */}
          {searchOpen && search && (
            <div className="tfAdminTopbar__searchResults">
              {searchResults.length === 0 ? (
                <div className="tfAdminTopbar__searchEmpty">
                  <span>No matching results for "{search}"</span>
                </div>
              ) : (
                searchResults.map((item, idx) => {
                  const Icon = item.icon || FolderKanban;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectSearchResult(item.path)}
                    >
                      <span className="tfAdminTopbar__notificationIcon tfAdminTopbar__notificationIcon--indigo">
                        <Icon size={15} />
                      </span>
                      <div>
                        <strong>{item.title}</strong>
                        <small>{item.category}</small>
                      </div>
                      <ArrowRight size={13} className="tfAdminTopbar__searchArrow" />
                    </button>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>

      {/* TOPBAR RIGHT ACTIONS - 100% IDENTICAL TO ADMIN & SUPER ADMIN PANELS */}
      <div className="tfAdminTopbar__actions">
        {/* 1. ANIMATED THEME TOGGLE SWITCH */}
        <button
          type="button"
          className={`superadmin-theme-toggle tfAdminTopbar__themeToggle ${darkMode ? "is-dark" : "is-light"}`}
          onClick={toggleDarkMode}
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          title={darkMode ? "Dark mode active · Click for Light mode" : "Light mode active · Click for Dark mode"}
        >
          <span className="sa-toggle-track">
            <Sun size={12} className="sa-toggle-sun-icon" />
            <Moon size={12} className="sa-toggle-moon-icon" />
          </span>
          <span className="sa-toggle-thumb">
            {darkMode ? <Moon size={12} /> : <Sun size={12} />}
          </span>
        </button>

        {/* 2. NOTIFICATIONS ICON BUTTON & DROPDOWN */}
        <div className="tfAdminTopbar__dropdownWrap" ref={notificationRef}>
          <button
            type="button"
            className="tfAdminTopbar__iconButton"
            onClick={() => {
              setNotificationOpen((prev) => !prev);
              setProfileOpen(false);
            }}
            aria-label="Team notifications"
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
                {unreadCount > 0 && (
                  <button
                    type="button"
                    className="tfAdminTopbar__markReadBtn"
                    onClick={() => setUnreadCount(0)}
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <button
                type="button"
                className="tfAdminTopbar__notificationItem"
                onClick={() => { setNotificationOpen(false); navigate("/teamlead/chat"); }}
              >
                <span className="tfAdminTopbar__notificationIcon tfAdminTopbar__notificationIcon--purple">
                  <MessageCircle size={16} />
                </span>
                <div>
                  <strong>New team comment</strong>
                  <p>Aarav commented on the authentication task.</p>
                  <small>10 mins ago</small>
                </div>
              </button>

              <button
                type="button"
                className="tfAdminTopbar__notificationItem"
                onClick={() => { setNotificationOpen(false); navigate("/teamlead/tasks"); }}
              >
                <span className="tfAdminTopbar__notificationIcon tfAdminTopbar__notificationIcon--green">
                  <CheckSquare size={16} />
                </span>
                <div>
                  <strong>Task completed</strong>
                  <p>Authentication flow is ready for review.</p>
                  <small>30 mins ago</small>
                </div>
              </button>

              <button
                type="button"
                className="tfAdminTopbar__notificationItem"
                onClick={() => { setNotificationOpen(false); navigate("/teamlead/meetings"); }}
              >
                <span className="tfAdminTopbar__notificationIcon tfAdminTopbar__notificationIcon--orange">
                  <Clock3 size={16} />
                </span>
                <div>
                  <strong>Upcoming Sprint Standup</strong>
                  <p>Meeting starts in 30 minutes on Google Meet.</p>
                  <small>1 hour ago</small>
                </div>
              </button>

              <div className="tf-notif-footer-wrap">
                <button
                  type="button"
                  className="tf-notif-view-all"
                  onClick={() => { setNotificationOpen(false); navigate("/teamlead/notifications"); }}
                >
                  <span>View all notifications</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 3. USER PROFILE PILL BUTTON & ACCOUNT DROPDOWN */}
        <div className="tfAdminTopbar__dropdownWrap" ref={profileRef}>
          <button
            type="button"
            className="tfAdminTopbar__profile"
            onClick={() => {
              setProfileOpen((prev) => !prev);
              setNotificationOpen(false);
            }}
            aria-expanded={profileOpen}
            aria-label="Open team lead profile menu"
          >
            <span className="tfAdminTopbar__profileAvatar">
              KP
            </span>
            <span className="tfAdminTopbar__profileText">
              <strong>{profileName}</strong>
              <small>Team Lead</small>
            </span>
            <ChevronDown
              size={14}
              className={profileOpen ? "tfAdminTopbar__profileArrow--open" : "tfAdminTopbar__profileArrow"}
            />
          </button>

          {profileOpen && (
            <div className="tfAdminTopbar__accountMenu">
              <div className="tfAdminTopbar__accountHeader">
                <div className="tfAdminTopbar__accountAvatar">
                  KP
                </div>
                <div>
                  <strong>{profileName}</strong>
                  <span>komal.pawar@teamflow.demo</span>
                </div>
              </div>

              <div className="tfAdminTopbar__accountMenuSection">
                <button type="button" onClick={() => { setProfileOpen(false); navigate("/teamlead/settings"); }}>
                  <Settings size={16} />
                  <span>
                    <strong>Team Settings</strong>
                    <small>Squad preferences &amp; sprint rules</small>
                  </span>
                </button>

                <button type="button" onClick={() => { setProfileOpen(false); navigate("/teamlead/workload"); }}>
                  <Activity size={16} />
                  <span>
                    <strong>Squad Workload</strong>
                    <small>Member capacity &amp; velocity</small>
                  </span>
                </button>

                <button type="button" onClick={() => { setProfileOpen(false); navigate("/teamlead/notifications"); }}>
                  <Bell size={16} />
                  <span>
                    <strong>Notifications</strong>
                    <small>Manage squad notification alerts</small>
                  </span>
                </button>
              </div>

              <div className="tfAdminTopbar__accountLogout">
                <button type="button" onClick={handleLogout}>
                  <LogOut size={16} />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function LayoutDashboardIcon(props) {
  return (
    <svg width={props.size || 16} height={props.size || 16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="7" height="9" x="3" y="3" rx="1" />
      <rect width="7" height="5" x="14" y="3" rx="1" />
      <rect width="7" height="9" x="14" y="12" rx="1" />
      <rect width="7" height="5" x="3" y="16" rx="1" />
    </svg>
  );
}
