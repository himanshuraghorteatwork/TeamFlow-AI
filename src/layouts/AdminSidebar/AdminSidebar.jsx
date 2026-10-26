
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

import {
  Layers3,
  LayoutDashboard,
  Building2,
  Users,
  FolderKanban,
  ListChecks,
  Bot,
  CreditCard,
  BadgeDollarSign,
  ChartNoAxesCombined,
  Megaphone,
  FileText,
  Settings,
  ShieldCheck,
  ChevronRight,
  LogOut,
} from "lucide-react";

import "./AdminSidebar.css";

const adminMenuItems = [
  {
    name: "Dashboard",
    path: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Workspaces",
    path: "/admin/workspaces",
    icon: Building2,
  },
  {
    name: "Users",
    path: "/admin/users",
    icon: Users,
  },
  {
    name: "Projects",
    path: "/admin/projects",
    icon: FolderKanban,
  },
  {
    name: "Tasks",
    path: "/admin/tasks",
    icon: ListChecks,
  },
  {
    name: "AI Tools",
    path: "/admin/ai-tools",
    icon: Bot,
  },
  {
    name: "Billing & Payments",
    path: "/admin/billing",
    icon: CreditCard,
  },
  {
    name: "Subscriptions",
    path: "/admin/subscriptions",
    icon: BadgeDollarSign,
  },
  {
    name: "Analytics",
    path: "/admin/analytics",
    icon: ChartNoAxesCombined,
  },
  {
    name: "Announcements",
    path: "/admin/announcements",
    icon: Megaphone,
  },
  {
    name: "Reports",
    path: "/admin/reports",
    icon: FileText,
  },
  {
    name: "Settings",
    path: "/admin/settings",
    icon: Settings,
  },
];

function AdminSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    try {
      // Clear the current login session.
      localStorage.removeItem("teamflow_current_user");
      sessionStorage.removeItem("teamflow_current_user");

      // Clear Admin-specific session data.
      localStorage.removeItem("teamflow_admin");
      localStorage.removeItem("teamflow_admin_logged_in");
      sessionStorage.removeItem("teamflow_admin");
      sessionStorage.removeItem("teamflow_admin_logged_in");

      // Clear remembered login details.
      localStorage.removeItem("teamflow_remember");
      localStorage.removeItem("teamflow_remembered_email");
      localStorage.removeItem("teamflow_remembered_role");
    } catch (error) {
      console.error("Admin logout failed:", error);
    }

    // Return to role selection. Keep registered users intact.
    navigate("/choose-role", {
      replace: true,
      state: {
        next: "login",
      },
    });
  };

  const handleWorkspaceControl = () => {
    navigate("/admin/settings");
  };

  const handleBrandClick = () => {
    navigate("/admin/dashboard");
  };

  return (
    <aside className="adminConsoleSidebar">
      {/* Header */}
      <div className="adminConsoleSidebar__header">
        {/* Brand */}
        <button
          type="button"
          className="adminConsoleSidebar__brand"
          onClick={handleBrandClick}
          aria-label="Go to Admin Dashboard"
        >
          <span className="adminConsoleSidebar__brandLogo">
            <Layers3 size={26} strokeWidth={2.2} />
          </span>

          <span className="adminConsoleSidebar__brandText">
            <strong>
              TeamFlow <em>AI</em>
            </strong>
            <small>Admin Console</small>
          </span>
        </button>

        {/* Header divider */}
        <div className="adminConsoleSidebar__divider" />

        {/* Admin role card */}
        <div className="adminConsoleSidebar__roleCard">
          <span className="adminConsoleSidebar__roleIcon">
            <ShieldCheck size={22} strokeWidth={2} />
          </span>

          <span className="adminConsoleSidebar__roleInfo">
            <strong>Admin</strong>
            <small>Workspace Management</small>
          </span>

          <span
            className="adminConsoleSidebar__online"
            title="Online"
            aria-label="Admin is online"
          >
            <span />
          </span>
        </div>
      </div>

      {/* Navigation */}
      <div className="adminConsoleSidebar__middle">
        <p className="adminConsoleSidebar__sectionTitle">
          PLATFORM MANAGEMENT
        </p>

        <nav
          className="adminConsoleSidebar__nav"
          aria-label="Admin navigation"
        >
          {adminMenuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/admin/dashboard"}
                className={({ isActive }) =>
                  [
                    "adminConsoleSidebar__navItem",
                    isActive
                      ? "adminConsoleSidebar__navItem--active"
                      : "",
                  ]
                    .filter(Boolean)
                    .join(" ")
                }
              >
                <span className="adminConsoleSidebar__navIcon">
                  <Icon size={18} strokeWidth={1.9} />
                </span>

                <span className="adminConsoleSidebar__navLabel">
                  {item.name}
                </span>

                <span
                  className="adminConsoleSidebar__activeIndicator"
                  aria-hidden="true"
                />
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer */}
      <div className="adminConsoleSidebar__footer">
        <div className="adminConsoleSidebar__footerDivider" />

        {/* Workspace settings */}
        <button
          type="button"
          className="adminConsoleSidebar__control"
          onClick={handleWorkspaceControl}
          aria-label="Open workspace settings"
        >
          <span className="adminConsoleSidebar__controlIcon">
            <ShieldCheck size={21} strokeWidth={2} />
          </span>

          <span className="adminConsoleSidebar__controlInfo">
            <strong>Workspace Control</strong>
            <small>
              Manage team workspace
              <br />
              and settings
            </small>
          </span>

          <ChevronRight
            size={18}
            strokeWidth={1.9}
            className="adminConsoleSidebar__controlArrow"
          />
        </button>

        <div className="adminConsoleSidebar__profileDivider" />

        {/* Admin profile */}
        <div className="adminConsoleSidebar__profile">
          <div
            className="adminConsoleSidebar__avatar"
            aria-hidden="true"
          >
            AD
          </div>

          <div className="adminConsoleSidebar__profileInfo">
            <strong>Admin</strong>
            <small>Workspace Administrator</small>
          </div>
        </div>

        {/* Single logout button */}
        <button
          type="button"
          className="adminConsoleSidebar__logout"
          onClick={handleLogout}
          aria-label="Logout from Admin account"
          title="Logout"
        >
          <LogOut size={18} strokeWidth={1.9} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default AdminSidebar;
