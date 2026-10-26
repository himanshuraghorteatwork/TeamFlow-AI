
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  Users,
  ChartNoAxesCombined,
  Activity,
  CreditCard,
  Settings,
  ShieldCheck,
  LogOut,
  X,
  Layers,
  ChevronRight,
} from "lucide-react";

import "./SuperAdminSidebar.css";

const navigationItems = [
  {
    label: "Dashboard",
    path: "/superadmin/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Organizations",
    path: "/superadmin/organizations",
    icon: Building2,
  },
  {
    label: "Users",
    path: "/superadmin/users",
    icon: Users,
  },
  {
    label: "Analytics",
    path: "/superadmin/analytics",
    icon: ChartNoAxesCombined,
  },
  {
    label: "Activity Logs",
    path: "/superadmin/activity-logs",
    icon: Activity,
  },
  {
    label: "Subscriptions",
    path: "/superadmin/subscriptions",
    icon: CreditCard,
  },
  {
    label: "Settings",
    path: "/superadmin/settings",
    icon: Settings,
  },
];

function SuperAdminSidebar({
  sidebarOpen = false,
  setSidebarOpen,
}) {
  const navigate = useNavigate();

  const closeSidebar = () => {
    setSidebarOpen?.(false);
  };

  const handleLogout = () => {
    [
      "teamflow_current_user",
      "teamflow_superadmin",
      "teamflow_admin",
      "teamflow_admin_logged_in",
      "teamflow_teamlead",
      "teamflow_user",
    ].forEach((key) => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    });

    closeSidebar();

    navigate("/choose-role", { replace: true });
  };

  const handlePlatformControl = () => {
    closeSidebar();
    navigate("/superadmin/settings");
  };

  return (
    <aside
      className={`superadmin-sidebar ${
        sidebarOpen ? "superadmin-sidebar-open" : ""
      }`}
      aria-label="Super Admin navigation"
    >
      {/* Brand Header */}
      <div className="superadmin-sidebar-header">
        <NavLink
          to="/superadmin/dashboard"
          className="superadmin-brand"
          onClick={closeSidebar}
        >
          <div className="superadmin-brand-icon">
            <Layers size={25} strokeWidth={2} />
          </div>

          <div className="superadmin-brand-text">
            <span className="superadmin-brand-name">
              TeamFlow <span>AI</span>
            </span>

            <span className="superadmin-brand-caption">
              Super Admin Console
            </span>
          </div>
        </NavLink>

        <button
          type="button"
          className="superadmin-close-sidebar"
          onClick={closeSidebar}
          aria-label="Close sidebar"
        >
          <X size={20} />
        </button>
      </div>

      {/* Super Admin Workspace */}
      <div className="superadmin-workspace">
        <div className="superadmin-workspace-icon">
          <ShieldCheck size={21} strokeWidth={2} />
        </div>

        <div className="superadmin-workspace-info">
          <span className="superadmin-workspace-title">
            Super Admin
          </span>

          <span className="superadmin-workspace-subtitle">
            Full Platform Access
          </span>
        </div>

        <span
          className="superadmin-status-dot"
          title="Active"
          aria-label="Active"
        />
      </div>

      {/* Navigation */}
      <nav className="superadmin-navigation">
        <p className="superadmin-nav-heading">
          PLATFORM MANAGEMENT
        </p>

        <div className="superadmin-nav-links">
          {navigationItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/superadmin/dashboard"}
                className={({ isActive }) =>
                  `superadmin-nav-link ${
                    isActive ? "superadmin-nav-link-active" : ""
                  }`
                }
                onClick={closeSidebar}
              >
                <Icon
                  className="superadmin-nav-icon"
                  size={19}
                  strokeWidth={1.9}
                />

                <span className="superadmin-nav-label">
                  {item.label}
                </span>

                <span
                  className="superadmin-nav-indicator"
                  aria-hidden="true"
                />
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* Bottom Section */}
      <div className="superadmin-sidebar-bottom">
        <button
          type="button"
          className="superadmin-support-card"
          onClick={handlePlatformControl}
        >
          <div className="superadmin-support-icon">
            <ShieldCheck size={20} strokeWidth={2} />
          </div>

          <div className="superadmin-support-info">
            <span className="superadmin-support-title">
              Platform Control
            </span>

            <span className="superadmin-support-text">
              Manage the entire platform
            </span>
          </div>

          <ChevronRight
            className="superadmin-support-arrow"
            size={18}
          />
        </button>

        {/* Profile with one Logout button */}
        <div className="superadmin-profile">
          <div className="superadmin-profile-avatar">SA</div>

          <div className="superadmin-profile-info">
            <span className="superadmin-profile-name">
              Super Admin
            </span>

            <span className="superadmin-profile-role">
              Platform Owner
            </span>
          </div>

          <button
            type="button"
            className="superadmin-logout-button"
            onClick={handleLogout}
            title="Logout"
            aria-label="Logout"
          >
            <LogOut size={19} strokeWidth={1.9} />
          </button>
        </div>
      </div>
    </aside>
  );
}

export default SuperAdminSidebar;
