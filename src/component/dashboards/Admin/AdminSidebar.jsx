import React, { useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import {
  LayoutDashboard,
  Building2,
  Users,
  ShieldCheck,
  FolderKanban,
  ListChecks,
  Bug,
  CalendarDays,
  MessageCircle,
  Megaphone,
  Bot,
  BarChart3,
  FileText,
  Activity,
  CreditCard,
  ReceiptText,
  Bell,
  Settings,
  HelpCircle,
  LogOut,
  Sparkles,
  X,
} from "lucide-react";

import "./AdminSidebar.css";

const sidebarSections = [
  {
    label: null,
    items: [
      {
        label: "Dashboard",
        icon: LayoutDashboard,
        path: "/admin/dashboard",
      },
    ],
  },

  {
    label: "ORGANIZATION",
    items: [
      {
        label: "Workspaces",
        icon: Building2,
        path: "/admin/workspaces",
      },
      {
        label: "Users",
        icon: Users,
        path: "/admin/users",
      },
      {
        label: "Roles & Permissions",
        icon: ShieldCheck,
        path: "/admin/roles",
      },
    ],
  },

  {
    label: "WORK MANAGEMENT",
    items: [
      {
        label: "Projects",
        icon: FolderKanban,
        path: "/admin/projects",
      },
      {
        label: "Tasks",
        icon: ListChecks,
        path: "/admin/tasks",
      },
      {
        label: "Bugs",
        icon: Bug,
        path: "/admin/bugs",
      },
      {
        label: "Calendar",
        icon: CalendarDays,
        path: "/admin/calendar",
      },
    ],
  },

  {
    label: "COLLABORATION",
    items: [
      
      {
        label: "Announcements",
        icon: Megaphone,
        path: "/admin/announcements",
      },
    ],
  },

  {
    label: "AI TOOLS",
    items: [
      {
        label: "AI Assistant",
        icon: Bot,
        path: "/admin/ai-tools",
      },
      {
        label: "AI Usage",
        icon: Sparkles,
        path: "/admin/ai-usage",
      },
    ],
  },

  {
    label: "ANALYTICS",
    items: [
      {
        label: "Analytics",
        icon: BarChart3,
        path: "/admin/analytics",
      },
      {
        label: "Reports",
        icon: FileText,
        path: "/admin/reports",
      },
      {
        label: "Activity Logs",
        icon: Activity,
        path: "/admin/activity",
      },
    ],
  },

  {
    label: "BILLING",
    items: [
      {
        label: "Subscription",
        icon: CreditCard,
        path: "/admin/subscriptions",
      },
      {
        label: "Invoices",
        icon: ReceiptText,
        path: "/admin/invoices",
      },
    ],
  },

  {
    label: "SETTINGS",
    items: [
      {
        label: "Notifications",
        icon: Bell,
        path: "/admin/notifications",
      },
      {
        label: "Organization Settings",
        icon: Settings,
        path: "/admin/settings",
      },
    ],
  },
  {
    label: "SUPPORT",
    items: [
      {
        label: "Help & Support",
        icon: HelpCircle,
        path: "/admin/support",
      },
    ],
  },
];


export default function AdminSidebar({
  mobileOpen = false,
  onClose,
  onMobileClose,
}) {
  const navigate = useNavigate();
  const navRef = useRef(null);

  useEffect(() => {
    const saved = sessionStorage.getItem("tf_admin_sidebar_scroll");
    if (navRef.current && saved) {
      navRef.current.scrollTop = Number(saved);
    }
  }, []);

  const handleNavScroll = (e) => {
    sessionStorage.setItem("tf_admin_sidebar_scroll", String(e.currentTarget.scrollTop));
  };

  // Supports both prop names so your existing dashboard keeps working.
  const closeSidebar = onMobileClose || onClose || (() => {});

  const handleLogout = () => {
    localStorage.removeItem("teamflow_current_user");
    localStorage.removeItem("teamflow_admin");
    localStorage.removeItem("teamflow_admin_logged_in");
    localStorage.removeItem("teamflow_remember");
    localStorage.removeItem("teamflow_remembered_email");
    localStorage.removeItem("teamflow_remembered_role");

    navigate("/choose-role", {
      replace: true,
      state: {
        next: "login",
      },
    });
  };

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          className="tfAdminSidebarOverlay"
          aria-label="Close navigation"
          onClick={closeSidebar}
        />
      )}

      <aside
        className={`tfAdminSidebar ${
          mobileOpen ? "tfAdminSidebar--open" : ""
        }`}
      >
        {/* BRAND */}
        <div className="tfAdminSidebar__brandRow">
          <NavLink
            to="/admin/dashboard"
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
                <rect width="28" height="28" rx="8" fill="url(#tf-logo-bg-admin)" />
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
                    id="tf-logo-bg-admin"
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
            <X size={20} />
          </button>
        </div>

        {/* NAVIGATION ONLY */}
        <nav className="tfAdminSidebar__nav" ref={navRef} onScroll={handleNavScroll}>
          {sidebarSections.map((section, index) => (
            <section
              className="tfAdminSidebar__section"
              key={`${section.label || "main"}-${index}`}
            >
              {section.label && (
                <div className="tfAdminSidebar__sectionLabel">
                  {section.label}
                </div>
              )}

              <div className="tfAdminSidebar__sectionLinks">
                {section.items.map((item) => {
                  const Icon = item.icon;

                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={closeSidebar}
                      className={({ isActive }) =>
                        `tfAdminSidebar__navItem ${
                          isActive
                            ? "tfAdminSidebar__navItem--active"
                            : ""
                        }`
                      }
                    >
                      <Icon size={18} strokeWidth={1.8} />
                      <span>{item.label}</span>
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