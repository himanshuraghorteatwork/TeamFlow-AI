import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Plus,
  ChevronDown,
  Bell,
  CircleHelp,
  Moon,
  Sun,
  CheckCircle2,
  FolderKanban,
  Users,
  MessageCircle,
  CalendarDays,
  Settings,
  X,
  Bug,
  ArrowRight,
} from "lucide-react";
import "./TeamLeadTopbar.css";

export default function TeamLeadTopbar({ profileName = "Komal Pawar" }) {
  const navigate = useNavigate();
  const searchInputRef = useRef(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const [isDarkMode, setIsDarkMode] = useState(() => {
    return (
      localStorage.getItem("teamflow_dark_mode") === "true" ||
      document.documentElement.classList.contains("dark-mode")
    );
  });

  // Keep dark-mode class in sync with state
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark-mode");
    } else {
      document.documentElement.classList.remove("dark-mode");
    }
  }, [isDarkMode]);

  // Global Ctrl+K shortcut to focus search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Close popovers on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".tlt-popover-wrap")) {
        setShowCreateMenu(false);
        setShowNotifications(false);
        setShowProfile(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const toggleDarkMode = () => {
    const next = !isDarkMode;
    setIsDarkMode(next);
    localStorage.setItem("teamflow_dark_mode", String(next));
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

  const handleSearchSubmit = (e) => {
    if (e.key === "Enter" && searchTerm.trim()) {
      const q = searchTerm.trim().toLowerCase();
      if (q.includes("task") || q.includes("todo")) navigate("/teamlead/tasks");
      else if (q.includes("project")) navigate("/teamlead/projects");
      else if (q.includes("bug") || q.includes("issue")) navigate("/teamlead/bugs");
      else if (q.includes("team") || q.includes("member")) navigate("/teamlead/team");
      else if (q.includes("meet") || q.includes("call")) navigate("/teamlead/meetings");
      else if (q.includes("file") || q.includes("doc")) navigate("/teamlead/files");
      else if (q.includes("ai") || q.includes("suggest")) navigate("/teamlead/task-suggestions");
      else if (q.includes("report")) navigate("/teamlead/reports");
      else navigate("/teamlead/tasks");
    }
  };

  return (
    <header className="tlt-topbar">
      {/* Search Bar */}
      <label className="tlt-search">
        <Search size={18} />
        <input
          ref={searchInputRef}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleSearchSubmit}
          placeholder="Search projects, tasks, team members, or AI..."
          aria-label="Search TeamFlow workspace"
        />
        <kbd>Ctrl K</kbd>
      </label>

      {/* Action Buttons */}
      <div className="tlt-topbar-actions">
        {/* Create Dropdown */}
        <div className="tlt-popover-wrap">
          <button
            className="tlt-primary-button"
            onClick={(e) => {
              e.stopPropagation();
              setShowCreateMenu((v) => !v);
              setShowNotifications(false);
              setShowProfile(false);
            }}
          >
            <Plus size={17} />
            <span className="tlt-create-button-text">Create</span>
            <ChevronDown size={14} />
          </button>

          {showCreateMenu && (
            <div className="tlt-popover tlt-create-menu">
              <button
                onClick={() => {
                  setShowCreateMenu(false);
                  navigate("/teamlead/tasks");
                }}
              >
                <CheckCircle2 size={16} /> New task
              </button>
              <button
                onClick={() => {
                  setShowCreateMenu(false);
                  navigate("/teamlead/projects");
                }}
              >
                <FolderKanban size={16} /> New project
              </button>
              <button
                onClick={() => {
                  setShowCreateMenu(false);
                  navigate("/teamlead/bugs");
                }}
              >
                <Bug size={16} /> Report bug
              </button>
              <button
                onClick={() => {
                  setShowCreateMenu(false);
                  navigate("/teamlead/team");
                }}
              >
                <Users size={16} /> Manage team
              </button>
            </div>
          )}
        </div>

        {/* Notifications Popover */}
        <div className="tlt-popover-wrap">
          <button
            className="tlt-icon-button"
            onClick={(e) => {
              e.stopPropagation();
              setShowNotifications((v) => !v);
              setShowCreateMenu(false);
              setShowProfile(false);
            }}
            aria-label="Notifications"
          >
            <Bell size={19} />
            <span className="tlt-notification-count">3</span>
          </button>

          {showNotifications && (
            <div className="tlt-popover">
              <div className="tlt-popover-heading">
                <strong>Notifications</strong>
                <span>3 new</span>
              </div>

              <div
                className="tlt-notification-item"
                onClick={() => {
                  setShowNotifications(false);
                  navigate("/teamlead/chat");
                }}
              >
                <span className="tlt-notice-icon purple">
                  <MessageCircle size={17} />
                </span>
                <div>
                  <b>New team comment</b>
                  <p>Aarav commented on the dashboard task.</p>
                  <small>10 minutes ago</small>
                </div>
              </div>

              <div
                className="tlt-notification-item"
                onClick={() => {
                  setShowNotifications(false);
                  navigate("/teamlead/tasks");
                }}
              >
                <span className="tlt-notice-icon green">
                  <CheckCircle2 size={17} />
                </span>
                <div>
                  <b>Task completed</b>
                  <p>Authentication flow is ready for review.</p>
                  <small>30 minutes ago</small>
                </div>
              </div>

              <div
                className="tlt-notification-item"
                onClick={() => {
                  setShowNotifications(false);
                  navigate("/teamlead/meetings");
                }}
              >
                <span className="tlt-notice-icon orange">
                  <CalendarDays size={17} />
                </span>
                <div>
                  <b>Upcoming meeting</b>
                  <p>Sprint planning starts in 30 minutes.</p>
                  <small>1 hour ago</small>
                </div>
              </div>

              <button
                className="tlt-view-all-notifications"
                onClick={() => {
                  setShowNotifications(false);
                  navigate("/teamlead/notifications");
                }}
              >
                <span>View all notifications</span>
                <ArrowRight size={13} />
              </button>
            </div>
          )}
        </div>

        {/* Help Button */}
        <button
          className="tlt-icon-button"
          aria-label="Help and support"
          title="Help and support"
          onClick={() => navigate("/teamlead/settings")}
        >
          <CircleHelp size={19} />
        </button>

        {/* Dark Mode Toggle */}
        <button
          className="tlt-icon-button"
          aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          onClick={toggleDarkMode}
        >
          {isDarkMode ? <Sun size={19} /> : <Moon size={19} />}
        </button>

        {/* User Profile Menu */}
        <div className="tlt-popover-wrap">
          <button
            className="tlt-profile-button"
            onClick={(e) => {
              e.stopPropagation();
              setShowProfile((v) => !v);
              setShowCreateMenu(false);
              setShowNotifications(false);
            }}
            aria-label="Open profile menu"
          >
            <span className="tlt-avatar">KP</span>
            <span className="tlt-profile-details">
              <strong>{profileName}</strong>
              <small>Team Lead</small>
            </span>
            <ChevronDown size={14} />
          </button>

          {showProfile && (
            <div className="tlt-popover tlt-profile-menu">
              <button
                onClick={() => {
                  setShowProfile(false);
                  navigate("/teamlead/settings");
                }}
              >
                <Settings size={15} /> Profile &amp; settings
              </button>
              <button
                onClick={() => {
                  setShowProfile(false);
                  navigate("/teamlead/notifications");
                }}
              >
                <Bell size={15} /> Notifications center
              </button>
              <button
                onClick={() => {
                  setShowProfile(false);
                  navigate("/teamlead/settings");
                }}
              >
                <CircleHelp size={15} /> Help &amp; documentation
              </button>
              <button className="logout" onClick={handleLogout}>
                <X size={15} /> Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
