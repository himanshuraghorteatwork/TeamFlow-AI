import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

import {
  Boxes,
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
    localStorage.removeItem("teamflow_admin");
    localStorage.removeItem("teamflow_admin_logged_in");

    navigate("/login");
  };

  const handleSupport = () => {
    alert("TeamFlow AI Support");
  };

  return (
    <aside className="adminSimpleSidebar">
      {/* ================= BRAND ================= */}

      <div className="adminSimpleSidebar__brand">
        <div className="adminSimpleSidebar__logo">
          <Boxes size={24} strokeWidth={2} />
        </div>

        <div className="adminSimpleSidebar__brandInfo">
          <h2>
            TeamFlow <span>AI</span>
          </h2>

          <span className="adminSimpleSidebar__badge">
            Admin Panel
          </span>
        </div>
      </div>

      {/* ================= MENU ================= */}

      <nav className="adminSimpleSidebar__nav">
        {adminMenuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/admin/dashboard"}
              className={({ isActive }) =>
                `adminSimpleSidebar__item ${
                  isActive
                    ? "adminSimpleSidebar__item--active"
                    : ""
                }`
              }
            >
              <span className="adminSimpleSidebar__icon">
                <Icon size={19} strokeWidth={1.8} />
              </span>

              <span className="adminSimpleSidebar__label">
                {item.name}
              </span>
            </NavLink>
          );
        })}
      </nav>

      {/* ================= BOTTOM ================= */}

      <div className="adminSimpleSidebar__bottom">
        <div className="adminSimpleSidebar__support">
          <div className="adminSimpleSidebar__supportTop">
            <div className="adminSimpleSidebar__supportIcon">
              <Headphones size={21} />
            </div>

            <div className="adminSimpleSidebar__supportText">
              <strong>Need Help?</strong>
              <span>Contact support team</span>
            </div>
          </div>

          <button
            type="button"
            className="adminSimpleSidebar__supportButton"
            onClick={handleSupport}
          >
            Contact Support
          </button>
        </div>

        <button
          type="button"
          className="adminSimpleSidebar__logout"
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