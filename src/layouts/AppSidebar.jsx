import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

import {
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
  Headphones,
  LogOut,
  Boxes,
} from "lucide-react";

import "./AppSidebar.css";

// ============================================
// ADMIN SIDEBAR MENU
// ============================================

const menuItems = [
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

// ============================================
// ADMIN SIDEBAR COMPONENT
// ============================================

function AdminSidebar() {
  const navigate = useNavigate();

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {
    localStorage.removeItem("teamflow_admin");
    localStorage.removeItem("teamflow_admin_logged_in");

    navigate("/login", {
      replace: true,
    });
  };

  // ==========================================
  // SUPPORT
  // ==========================================

  const handleSupport = () => {
    alert("TeamFlow AI Support will be available here.");
  };

  return (
    <aside className="admin-sidebar">
      {/* =====================================
          LOGO / BRAND
      ====================================== */}

      <div className="admin-sidebar-brand">
        <div className="admin-sidebar-logo">
          <Boxes size={23} strokeWidth={2} />
        </div>

        <div className="admin-sidebar-brand-text">
          <h2>
            TeamFlow <span>AI</span>
          </h2>

          <small>Admin Panel</small>
        </div>
      </div>

      {/* =====================================
          NAVIGATION
      ====================================== */}

      <nav
        className="admin-sidebar-navigation"
        aria-label="Admin navigation"
      >
        {menuItems.map(({ name, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === "/admin/dashboard"}
            className={({ isActive }) =>
              isActive
                ? "admin-sidebar-item admin-sidebar-item-active"
                : "admin-sidebar-item"
            }
          >
            <Icon
              className="admin-sidebar-menu-icon"
              size={19}
              strokeWidth={2}
            />

            <span>{name}</span>
          </NavLink>
        ))}
      </nav>

      {/* =====================================
          SIDEBAR BOTTOM
      ====================================== */}

      <div className="admin-sidebar-bottom">
        {/* SUPPORT CARD */}

        <div className="admin-support-card">
          <div className="admin-support-header">
            <div className="admin-support-icon">
              <Headphones size={20} />
            </div>

            <div className="admin-support-text">
              <strong>Need Help?</strong>
              <span>Contact support team</span>
            </div>
          </div>

          <button
            className="admin-support-button"
            type="button"
            onClick={handleSupport}
          >
            Contact Support
          </button>
        </div>

        {/* LOGOUT */}

        <button
          className="admin-logout-button"
          type="button"
          onClick={handleLogout}
        >
          <LogOut size={18} />

          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default AdminSidebar;