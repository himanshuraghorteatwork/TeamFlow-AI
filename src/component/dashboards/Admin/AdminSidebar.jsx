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
        label: "Team Chat",
        icon: MessageCircle,
        path: "/admin/chat",
      },
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
            className="tfAdminSidebar__brand"
            onClick={closeSidebar}
          >
            <div className="tfAdminSidebar__brandMark">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="24" height="24" rx="6" fill="url(#tfSideBrandGrad)" />
                <path d="M6 8.5C6 7.67 6.67 7 7.5 7H16.5C17.33 7 18 7.67 18 8.5C18 9.33 17.33 10 16.5 10H13.2V16.5C13.2 17.33 12.53 18 11.7 18C10.87 18 10.2 17.33 10.2 16.5V10H7.5C6.67 10 6 9.33 6 8.5Z" fill="#ffffff" />
                <circle cx="16.5" cy="8.5" r="1.6" fill="#38bdf8" />
                <defs>
                  <linearGradient id="tfSideBrandGrad" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#3b82f6" />
                    <stop offset="0.5" stopColor="#6366f1" />
                    <stop offset="1" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            <div className="tfAdminSidebar__brandTitle">
              <strong>TeamFlow</strong>
              <span className="tfAdminSidebar__brandAi">AI</span>
            </div>
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