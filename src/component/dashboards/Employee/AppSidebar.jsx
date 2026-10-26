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

function AppSidebar({ isOpen = false, onClose }) {
  const location = useLocation();

  // Check if a navigation item is active
  const isItemActive = (itemPath) => {
    const [pathname, search] = itemPath.split("?");

    if (search) {
      return (
        location.pathname === pathname &&
        location.search.includes(search)
      );
    }

    return location.pathname === pathname;
  };

  // Dashboard active state
  const isDashboardActive =
    location.pathname === "/employee/dashboard" ||
    location.pathname === "/dashboard" ||
    location.pathname === "/employee";

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
            className="app-sidebar-brand"
            onClick={onClose}
          >

            {/* =====================================
                TEAMFLOW AI LOGO
            ====================================== */}
            <div className="logo-container">

              <div className="logo-icon-brand">

                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 28 28"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-label="TeamFlow AI Logo"
                  role="img"
                >

                  {/* Logo Background */}
                  <rect
                    width="28"
                    height="28"
                    rx="8"
                    fill="url(#tf-sidebar-logo-gradient)"
                  />

                  {/* T / Flow Symbol */}
                  <path
                    d="M8 9H20M14 9V19M11 19H17"
                    stroke="white"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Blue Accent Dot */}
                  <circle
                    cx="21"
                    cy="7"
                    r="2.5"
                    fill="#38BDF8"
                  />

                  {/* Gradient Definition */}
                  <defs>
                    <linearGradient
                      id="tf-sidebar-logo-gradient"
                      x1="0"
                      y1="0"
                      x2="28"
                      y2="28"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop
                        offset="0"
                        stopColor="#4361EE"
                      />

                      <stop
                        offset="0.5"
                        stopColor="#3A0CA3"
                      />

                      <stop
                        offset="1"
                        stopColor="#F72585"
                      />
                    </linearGradient>
                  </defs>

                </svg>

              </div>

              {/* Brand Name */}
              <span className="logo-text">
                TeamFlow{" "}
                <span className="logo-ai">
                  AI
                </span>
              </span>

            </div>

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

          {/* =======================================
              DASHBOARD BUTTON
          ======================================== */}
          <div className="app-nav-top-dashboard">

            <NavLink
              to="/employee/dashboard"
              className={`app-sidebar-dashboard-btn ${
                isDashboardActive ? "active" : ""
              }`}
              onClick={onClose}
            >

              <Home
                size={18}
                strokeWidth={2.2}
                className="app-dashboard-icon"
              />

              <span>
                Dashboard
              </span>

            </NavLink>

          </div>

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