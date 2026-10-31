import React, { useRef, useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Activity,
  UserRound,
  FolderKanban,
  CheckSquare,
  Bug,
  CalendarDays,
  MessageCircle,
  Clock3,
  FileText,
  Sparkles,
  BarChart3,
  Bell,
  Settings,
  X,
  Zap,
} from "lucide-react";
import "./TeamLeadSidebar.css";

const sidebarSections = [
  {
    label: null,
    items: [
      {
        label: "Dashboard",
        icon: LayoutDashboard,
        path: "/teamlead/dashboard",
      },
    ],
  },
  {
    label: "MY TEAM & SQUAD",
    items: [
      {
        label: "My Team",
        icon: Users,
        path: "/teamlead/team",
        badgeKey: "members",
      },
      {
        label: "Workload",
        icon: Activity,
        path: "/teamlead/workload",
      },
      {
        label: "Team Members",
        icon: UserRound,
        path: "/teamlead/member",
      },
    ],
  },
  {
    label: "WORK MANAGEMENT",
    items: [
      {
        label: "Sprint Hub",
        icon: Zap,
        path: "/teamlead/sprints",
        badge: "Sprint 24",
        badgeTone: "green",
      },
      {
        label: "Projects",
        icon: FolderKanban,
        path: "/teamlead/projects",
        badgeKey: "projects",
      },
      {
        label: "Tasks",
        icon: CheckSquare,
        path: "/teamlead/tasks",
        badgeKey: "tasks",
      },
      {
        label: "Bugs",
        icon: Bug,
        path: "/teamlead/bugs",
        badgeKey: "bugs",
        badgeTone: "danger",
      },
      {
        label: "Calendar",
        icon: CalendarDays,
        path: "/teamlead/calendar",
      },
    ],
  },
  {
    label: "COLLABORATION",
    items: [
      {
        label: "Team Chat",
        icon: MessageCircle,
        path: "/teamlead/chat",
        badgeKey: "chat",
        badgeTone: "primary",
      },
      {
        label: "Meetings",
        icon: Clock3,
        path: "/teamlead/meetings",
      },
      {
        label: "Files & Docs",
        icon: FileText,
        path: "/teamlead/files",
      },
    ],
  },
  {
    label: "AI INTELLIGENCE",
    items: [
      {
        label: "AI Assistant",
        icon: Sparkles,
        path: "/teamlead/ai-assistant",
        isAi: true,
      },
      {
        label: "Task Suggestions",
        icon: CheckSquare,
        path: "/teamlead/task-suggestions",
        isAi: true,
      },
      {
        label: "AI Summaries",
        icon: FileText,
        path: "/teamlead/ai-summaries",
        isAi: true,
      },
    ],
  },
  {
    label: "REPORTS & ANALYTICS",
    items: [
      {
        label: "Team Performance",
        icon: BarChart3,
        path: "/teamlead/reports",
      },
      {
        label: "Project Reports",
        icon: BarChart3,
        path: "/teamlead/project-reports",
      },
    ],
  },
  {
    label: "SETTINGS",
    items: [
      {
        label: "Notifications",
        icon: Bell,
        path: "/teamlead/notifications",
        badgeKey: "notifications",
        badgeTone: "warning",
      },
      {
        label: "Team Settings",
        icon: Settings,
        path: "/teamlead/settings",
      },
    ],
  },
];

export default function TeamLeadSidebar({ mobileOpen = false, onClose }) {
  const location = useLocation();
  const navRef = useRef(null);

  // Live badge counts loaded from localStorage
  const [counts, setCounts] = useState({
    tasks: 6,
    bugs: 3,
    members: 8,
    projects: 4,
    chat: 2,
    notifications: 3,
  });

  useEffect(() => {
    const loadCounts = () => {
      try {
        const rawTasks = localStorage.getItem("teamflow_teamlead_tasks") || localStorage.getItem("teamflow_tasks");
        if (rawTasks) {
          const parsed = JSON.parse(rawTasks);
          if (Array.isArray(parsed)) {
            const pending = parsed.filter(t => t.status !== "Done" && t.status !== "Completed").length;
            setCounts(c => ({ ...c, tasks: pending || parsed.length }));
          }
        }
      } catch {
        // ignore storage errors
      }

      try {
        const rawBugs = localStorage.getItem("teamflow_bugs");
        if (rawBugs) {
          const parsed = JSON.parse(rawBugs);
          if (Array.isArray(parsed)) {
            const openBugs = parsed.filter(b => b.status === "Open" || b.status === "In Progress").length;
            setCounts(c => ({ ...c, bugs: openBugs || parsed.length }));
          }
        }
      } catch {
        // ignore storage errors
      }

      try {
        const rawProjects = localStorage.getItem("teamflow_projects");
        if (rawProjects) {
          const parsed = JSON.parse(rawProjects);
          if (Array.isArray(parsed)) {
            setCounts(c => ({ ...c, projects: parsed.length }));
          }
        }
      } catch {
        // ignore storage errors
      }
    };

    loadCounts();
    window.addEventListener("storage", loadCounts);
    window.addEventListener("teamflow_data_update", loadCounts);
    return () => {
      window.removeEventListener("storage", loadCounts);
      window.removeEventListener("teamflow_data_update", loadCounts);
    };
  }, []);

  const closeSidebar = () => {
    if (typeof onClose === "function") {
      onClose();
    }
  };

  const handleNavScroll = () => {
    if (navRef.current) {
      sessionStorage.setItem("tf_teamlead_sidebar_scroll", String(navRef.current.scrollTop));
    }
  };

  useEffect(() => {
    const saved = sessionStorage.getItem("tf_teamlead_sidebar_scroll");
    if (saved && navRef.current) {
      navRef.current.scrollTop = Number(saved);
    }
  }, []);

  const isItemActive = (path) => {
    if (path === "/teamlead/member") {
      return location.pathname.startsWith(path);
    }
    return location.pathname === path;
  };

  return (
    <>
      {/* MOBILE BACKDROP OVERLAY */}
      {mobileOpen && (
        <button
          type="button"
          className="tfAdminSidebarOverlay"
          onClick={closeSidebar}
          aria-label="Close sidebar overlay"
        />
      )}

      <aside
        className={`tfAdminSidebar tfTeamLeadSidebar ${
          mobileOpen ? "tfAdminSidebar--open" : ""
        }`}
        aria-label="Team Lead navigation"
      >
        {/* BRAND ROW */}
        <div className="tfAdminSidebar__brandRow">
          <NavLink
            to="/teamlead/dashboard"
            className="tfAdminSidebar__brand superadmin-brand"
            onClick={closeSidebar}
          >
            <div className="superadmin-brand-icon tfAdminSidebar__brandMark">
              <svg
                width="26"
                height="26"
                viewBox="0 0 28 28"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="28" height="28" rx="8" fill="url(#tf-logo-bg-teamlead)" />
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
                    id="tf-logo-bg-teamlead"
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

            <span className="superadmin-brand-name tfAdminSidebar__brandTitle">
              TeamFlow <span>AI</span>
            </span>
          </NavLink>

          <button
            type="button"
            className="tfAdminSidebar__mobileClose"
            onClick={closeSidebar}
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>

        {/* NAVIGATION LINKS */}
        <nav className="tfAdminSidebar__nav" ref={navRef} onScroll={handleNavScroll}>
          {sidebarSections.map((section, idx) => (
            <section
              className="tfAdminSidebar__section"
              key={`${section.label || "main"}-${idx}`}
            >
              {section.label && (
                <div className="tfAdminSidebar__sectionLabel">
                  {section.label}
                </div>
              )}

              <div className="tfAdminSidebar__sectionLinks">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const active = isItemActive(item.path);
                  const badgeValue = item.badgeKey ? counts[item.badgeKey] : null;

                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={closeSidebar}
                      className={`tfAdminSidebar__navItem ${
                        active ? "tfAdminSidebar__navItem--active active" : ""
                      }`}
                    >
                      <Icon size={17} strokeWidth={1.85} />
                      <span className="tfAdminSidebar__navLabel">{item.label}</span>

                      {item.isAi && (
                        <span className="tf-sidebar-ai-chip">AI</span>
                      )}

                      {badgeValue !== null && badgeValue !== undefined && badgeValue > 0 ? (
                        <span
                          className={`tf-sidebar-badge ${
                            item.badgeTone ? `tf-sidebar-badge--${item.badgeTone}` : ""
                          }`}
                        >
                          {badgeValue}
                        </span>
                      ) : item.badge ? (
                        <span
                          className={`tf-sidebar-badge ${
                            item.badgeTone ? `tf-sidebar-badge--${item.badgeTone}` : ""
                          }`}
                        >
                          {item.badge}
                        </span>
                      ) : null}
                    </NavLink>
                  );
                })}
              </div>
            </section>
          ))}
        </nav>
      </aside>
    </>
  );
}
