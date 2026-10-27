import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Home,
  CheckSquare,
  FolderKanban,
  Bug,
  Calendar,
  FileText,
  MessageSquare,
  Video,
  Sparkles,
  Activity,
  BarChart2,
  Settings,
  X,
} from "lucide-react";

import "./AppSidebar.css";

const navSections = [
  {
    title: "MY WORK",
    items: [
      {
        label: "Dashboard",
        path: "/employee/dashboard",
        icon: Home,
      },
      {
        label: "My Tasks",
        path: "/employee/tasks",
        icon: CheckSquare,
      },
      {
        label: "My Projects",
        path: "/employee/projects",
        icon: FolderKanban,
      },
      {
        label: "Assigned Bugs",
        path: "/employee/bugs",
        icon: Bug,
      },
      {
        label: "Calendar",
        path: "/employee/calendar",
        icon: Calendar,
      },
      {
        label: "My Files",
        path: "/employee/files",
        icon: FileText,
      },
    ],
  },
  {
    title: "COLLABORATION",
    items: [
      {
        label: "Team Chat",
        path: "/employee/chat",
        icon: MessageSquare,
      },
      {
        label: "Meetings",
        path: "/employee/meetings",
        icon: Video,
      },
    ],
  },
  {
    title: "AI TOOLS",
    items: [
      {
        label: "AI Assistant",
        path: "/employee/ai-assistant",
        icon: Sparkles,
      },
    ],
  },
  {
    title: "REPORTS",
    items: [
      {
        label: "My Activity",
        path: "/employee/activity",
        icon: Activity,
      },
      {
        label: "Team Progress",
        path: "/employee/team-progress",
        icon: BarChart2,
      },
    ],
  },
  {
    title: "SETTINGS",
    items: [
      {
        label: "Settings",
        path: "/employee/settings",
        icon: Settings,
      },
    ],
  },
];

function AppSidebar({ isOpen = false, onClose, activeRoute }) {
  const location = useLocation();
  const currentPath = activeRoute || location.pathname;

  // Check if a navigation item is active
  const isItemActive = (itemPath) => {
    const [pathname, search] = itemPath.split("?");

    if (search) {
      return (
        currentPath === pathname &&
        location.search.includes(search)
      );
    }

    if (itemPath === "/employee/dashboard") {
      return (
        currentPath === "/employee/dashboard" ||
        currentPath === "/dashboard" ||
        currentPath === "/employee"
      );
    }

    if (itemPath === "/employee/settings") {
      return (
        currentPath === "/employee/settings" ||
        currentPath === "/settings" ||
        currentPath === "/employee/notifications" ||
        currentPath === "/employee/profile"
      );
    }

    if (itemPath === "/employee/activity") {
      return (
        currentPath === "/employee/activity" ||
        currentPath === "/activity" ||
        currentPath === "/employee/my-activity"
      );
    }

    if (itemPath === "/employee/team-progress") {
      return (
        currentPath === "/employee/team-progress" ||
        currentPath === "/team-progress" ||
        currentPath === "/employee/progress"
      );
    }

    if (itemPath === "/employee/tasks") {
      return currentPath === "/employee/tasks" || currentPath === "/tasks";
    }

    if (itemPath === "/employee/projects") {
      return currentPath === "/employee/projects" || currentPath === "/projects";
    }

    if (itemPath === "/employee/bugs") {
      return currentPath === "/employee/bugs" || currentPath === "/bugs";
    }

    if (itemPath === "/employee/calendar") {
      return currentPath === "/employee/calendar" || currentPath === "/calendar";
    }

    if (itemPath === "/employee/files") {
      return currentPath === "/employee/files" || currentPath === "/files";
    }

    if (itemPath === "/employee/chat") {
      return currentPath === "/employee/chat" || currentPath === "/chat";
    }

    if (itemPath === "/employee/meetings") {
      return currentPath === "/employee/meetings" || currentPath === "/meetings";
    }

    if (itemPath === "/employee/ai-assistant") {
      return (
        currentPath === "/employee/ai-assistant" ||
        currentPath === "/ai-assistant"
      );
    }

    return currentPath === pathname;
  };

  return (
    <>
      {/* =========================================
          MOBILE BACKDROP
      ========================================== */}
      {isOpen && (
        <div
          className="app-sidebar-backdrop"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* =========================================
          SIDEBAR
      ========================================== */}
      <aside className={`app-sidebar ${isOpen ? "open" : ""}`}>

        {/* =========================================
            BRAND HEADER
        ========================================== */}
        <div className="app-sidebar-header">

          <NavLink
            to="/employee/dashboard"
            className="superadmin-brand app-sidebar-brand"
            onClick={onClose}
          >
            <div className="superadmin-brand-icon logo-icon-brand">
              <svg
                width="26"
                height="26"
                viewBox="0 0 28 28"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-label="TeamFlow AI Logo"
                role="img"
              >
                <rect width="28" height="28" rx="8" fill="url(#tf-logo-bg-app)" />
                <path
                  d="M8 9H20M14 9V19M11 19H17"
                  stroke="white"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="21" cy="7" r="2.5" fill="#38bdf8" />
                <defs>
                  <linearGradient
                    id="tf-logo-bg-app"
                    x1="0"
                    y1="0"
                    x2="28"
                    y2="28"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#4361ee" />
                    <stop offset="0.5" stopColor="#3a0ca3" />
                    <stop offset="1" stopColor="#f72585" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            <span className="superadmin-brand-name logo-text">
              TeamFlow <span>AI</span>
            </span>
          </NavLink>

          {/* Mobile Close Button */}
          {onClose && (
            <button
              type="button"
              className="app-sidebar-close-btn"
              onClick={onClose}
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          )}

        </div>

        {/* =========================================
            NAVIGATION SCROLL AREA
        ========================================== */}
        <div className="app-sidebar-scroll">

          {/* =========================================
              MAIN NAVIGATION
          ========================================== */}
          <nav
            className="app-sidebar-nav"
            aria-label="Main employee navigation"
          >

            {navSections.map((section, idx) => (

              <div
                key={section.title || idx}
                className="app-nav-group"
              >

                {/* Section Title */}
                {section.title && (
                  <div className="app-nav-section-title">
                    {section.title}
                  </div>
                )}

                {/* Navigation Items */}
                <ul className="app-nav-list">

                  {section.items.map((item) => {

                    const Icon = item.icon;

                    const active = isItemActive(
                      item.path
                    );

                    return (
                      <li key={item.label}>

                        <NavLink
                          to={item.path}
                          className={`app-sidebar-link ${
                            active ? "active" : ""
                          }`}
                          onClick={onClose}
                        >

                          {/* Icon */}
                          <span className="app-nav-icon">

                            <Icon
                              size={17}
                              strokeWidth={
                                active ? 2.2 : 1.7
                              }
                            />

                          </span>

                          {/* Label */}
                          <span className="app-nav-text">
                            {item.label}
                          </span>

                        </NavLink>

                      </li>
                    );

                  })}

                </ul>

              </div>

            ))}

          </nav>

        </div>

      </aside>
    </>
  );
}

export default AppSidebar;