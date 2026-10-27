import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Bell,
  Menu,
  CheckSquare,
  Network,
  User,
  Settings,
  Activity,
  LogOut,
  X,
  Sparkles,
  Sun,
  Moon,
} from "lucide-react";

import {
  getEmployeeProfile,
  getEmployeeTheme,
  setEmployeeTheme,
  handleEmployeeLogout,
} from "./EmployeeAuth";
import "./EmployeeTopbar.css";

function EmployeeTopbar({
  onToggleSidebar,
  searchQuery = "",
  onSearchChange,
  searchPlaceholder,
}) {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(getEmployeeProfile);
  const [theme, setTheme] = useState(getEmployeeTheme);

  // Dropdown states
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  // Search local state
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [searchFocused, setSearchFocused] = useState(false);

  const notifRef = useRef(null);
  const profileRef = useRef(null);

  // Sync profile & theme
  useEffect(() => {
    const handleStorage = () => {
      setProfile(getEmployeeProfile());
      setTheme(getEmployeeTheme());
    };
    const handleThemeChange = (e) => {
      setTheme(e.detail || getEmployeeTheme());
    };
    window.addEventListener("storage", handleStorage);
    window.addEventListener("tf_profile_updated", handleStorage);
    window.addEventListener("tf_theme_change", handleThemeChange);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("tf_profile_updated", handleStorage);
      window.removeEventListener("tf_theme_change", handleThemeChange);
    };
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Theme switch toggle handler
  const handleToggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    setEmployeeTheme(nextTheme);
  };

  // Sample notifications matching context
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      sender: "Rahul Sharma",
      title: "Hey team, the API is ready for testing.",
      time: "10:24 AM",
      unread: true,
      path: "/employee/chat",
    },
    {
      id: 2,
      sender: "Rahul Sharma",
      title: "Assigned you a task: API integration testing",
      time: "09:45 AM",
      unread: true,
      path: "/employee/tasks",
    },
    {
      id: 3,
      sender: "Sneha (TeamFlow - General)",
      title: "Meeting at 4 PM today.",
      time: "09:20 AM",
      unread: true,
      path: "/employee/calendar",
    },
  ]);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const handleSearchInput = (val) => {
    setLocalSearch(val);
    if (onSearchChange) onSearchChange(val);
  };

  const handleAskAIFromSearch = (e) => {
    if (e.key === "Enter" && localSearch.trim()) {
      navigate(`/employee/ai-assistant?query=${encodeURIComponent(localSearch.trim())}`);
      setSearchFocused(false);
    }
  };

  return (
    <header className="tf-topbar">
      {/* Left: Mobile Toggle & Global Search Bar */}
      <div className="tf-topbar-left">
        <button
          type="button"
          className="tf-mobile-toggle-btn"
          onClick={onToggleSidebar}
          aria-label="Toggle navigation menu"
        >
          <Menu size={20} />
        </button>

        <div className={`tf-global-search ${searchFocused ? "focused" : ""}`}>
          <Search size={16} className="tf-topbar-search-icon" />
          <input
            type="text"
            className="tf-topbar-search-input"
            placeholder={searchPlaceholder || "Search tasks, projects, messages, or ask AI..."}
            value={onSearchChange ? searchQuery : localSearch}
            onChange={(e) => handleSearchInput(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
            onKeyDown={handleAskAIFromSearch}
            aria-label="Global search"
          />
          {!localSearch && (
            <span className="tf-topbar-shortcut-badge">Ctrl + K</span>
          )}
          {localSearch && (
            <button
              type="button"
              className="tf-topbar-search-clear"
              onClick={() => handleSearchInput("")}
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}

          {/* Quick AI Search Suggestion */}
          {searchFocused && localSearch.trim().length > 1 && (
            <div className="tf-search-dropdown">
              <div
                className="tf-search-quick-item ai-item"
                onMouseDown={() => {
                  navigate(`/employee/ai-assistant?query=${encodeURIComponent(localSearch.trim())}`);
                }}
              >
                <Sparkles size={15} />
                <span>
                  Ask TeamFlow AI: <strong>"{localSearch}"</strong>
                </span>
              </div>
              <div
                className="tf-search-quick-item"
                onMouseDown={() => {
                  navigate(`/employee/tasks?search=${encodeURIComponent(localSearch.trim())}`);
                }}
              >
                <CheckSquare size={14} />
                <span>Search in My Tasks</span>
              </div>
              <div
                className="tf-search-quick-item"
                onMouseDown={() => {
                  navigate(`/employee/projects?search=${encodeURIComponent(localSearch.trim())}`);
                }}
              >
                <Network size={14} />
                <span>Search in My Projects</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Action Group: Theme Switch Toggle, Bell, Help, Profile */}
      <div className="tf-topbar-right">
        {/* 1. Theme Switch Toggle: Light <-> Dark Mode */}
        <button
          type="button"
          className={`tf-theme-toggle-switch ${theme === "dark" ? "is-dark" : "is-light"}`}
          onClick={handleToggleTheme}
          aria-label={theme === "dark" ? "Switch to Light mode" : "Switch to Dark mode"}
          title={theme === "dark" ? "Switch to Light mode" : "Switch to Dark mode"}
        >
          <span className="tf-toggle-label-sun" aria-hidden="true">
            <Sun size={13} strokeWidth={2.4} />
          </span>
          <span className="tf-toggle-label-moon" aria-hidden="true">
            <Moon size={13} strokeWidth={2.4} />
          </span>
          <div className="tf-toggle-knob">
            {theme === "dark" ? (
              <Moon size={12} strokeWidth={2.5} className="knob-icon moon" />
            ) : (
              <Sun size={12} strokeWidth={2.5} className="knob-icon sun" />
            )}
          </div>
        </button>

        {/* 2. Notification Bell with Red Badge "3" */}
        <div className="tf-icon-wrapper" ref={notifRef}>
          <button
            type="button"
            className="tf-icon-button"
            onClick={() => setNotifOpen((prev) => !prev)}
            aria-label="Notifications"
            title="Notifications"
          >
            <Bell size={19} className="tf-bell-icon" />
            {unreadCount > 0 && (
              <span className="tf-notif-badge">{unreadCount}</span>
            )}
          </button>

          {notifOpen && (
            <div className="tf-notifications-dropdown">
              <div className="tf-notif-header">
                <div>
                  <strong>Notifications</strong>
                  <span className="tf-notif-count-label">{unreadCount} new</span>
                </div>
                {unreadCount > 0 && (
                  <button type="button" className="tf-notif-mark" onClick={markAllRead}>
                    Mark all read
                  </button>
                )}
              </div>

              <div className="tf-notif-list">
                {notifications.map((item) => (
                  <div
                    key={item.id}
                    className={`tf-notif-item ${item.unread ? "unread" : ""}`}
                    onClick={() => {
                      setNotifications((prev) =>
                        prev.map((n) => (n.id === item.id ? { ...n, unread: false } : n))
                      );
                      setNotifOpen(false);
                      navigate(item.path);
                    }}
                  >
                    <div className="tf-notif-dot" />
                    <div className="tf-notif-body">
                      <strong>{item.sender}</strong>
                      <p>{item.title}</p>
                      <small>{item.time}</small>
                    </div>
                  </div>
                ))}
              </div>

              <div className="tf-notif-footer">
                <button
                  type="button"
                  onClick={() => {
                    setNotifOpen(false);
                    navigate("/employee/settings?tab=notifications");
                  }}
                >
                  Notification preferences →
                </button>
              </div>
            </div>
          )}
        </div>


        {/* 4. User Profile (John Doe, Employee) */}
        <div className="tf-profile-wrapper" ref={profileRef}>
          <button
            type="button"
            className="tf-profile-button"
            onClick={() => setProfileOpen((prev) => !prev)}
            aria-expanded={profileOpen}
            aria-haspopup="true"
          >
            <div className="tf-profile-avatar">
              {profile.photo ? (
                <img
                  src={profile.photo}
                  alt={profile.fullName || "John Doe"}
                  style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "9999px" }}
                />
              ) : (
                profile.initials || "JD"
              )}
            </div>
            <div className="tf-profile-meta">
              <span className="tf-profile-name">{profile.fullName || "John Doe"}</span>
              <span className="tf-profile-role">
                {profile.role && profile.role.toLowerCase() !== "product manager"
                  ? profile.role
                  : "Employee"}
              </span>
            </div>
          </button>

          {profileOpen && (
            <div className="tf-profile-dropdown" role="menu">
              <div className="tf-dropdown-header">
                <div className="tf-dropdown-avatar">
                  {profile.photo ? (
                    <img
                      src={profile.photo}
                      alt={profile.fullName || "John Doe"}
                      style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "9999px" }}
                    />
                  ) : (
                    profile.initials || "JD"
                  )}
                </div>
                <div className="tf-dropdown-user-info">
                  <strong>{profile.fullName || "John Doe"}</strong>
                  <span className="tf-user-role-badge">
                    {profile.role && profile.role.toLowerCase() !== "product manager"
                      ? profile.role
                      : "Employee"}
                  </span>
                  <small>{profile.email || "john.doe@teamflow.com"}</small>
                </div>
              </div>

              <div className="tf-dropdown-divider" />

              <button
                type="button"
                className="tf-menu-item"
                onClick={() => {
                  setProfileOpen(false);
                  navigate("/employee/settings");
                }}
              >
                <User size={16} />
                <span>My Profile</span>
              </button>

              <button
                type="button"
                className="tf-menu-item"
                onClick={() => {
                  setProfileOpen(false);
                  navigate("/employee/settings");
                }}
              >
                <Settings size={16} />
                <span>Settings</span>
              </button>

              <button
                type="button"
                className="tf-menu-item"
                onClick={() => {
                  setProfileOpen(false);
                  navigate("/employee/settings?tab=activity");
                }}
              >
                <Activity size={16} />
                <span>My Activity</span>
              </button>

              <div className="tf-dropdown-divider" />

              <button
                type="button"
                className="tf-menu-item tf-logout-btn"
                onClick={() => {
                  setProfileOpen(false);
                  handleEmployeeLogout(navigate);
                }}
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default EmployeeTopbar;
