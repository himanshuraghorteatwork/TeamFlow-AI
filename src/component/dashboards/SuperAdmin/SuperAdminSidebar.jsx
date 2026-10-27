import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  Users,
  Gem,
  CreditCard,
  Receipt,
  FileText,
  Mail,
  LayoutTemplate,
  Megaphone,
  Sliders,
  Sparkles,
  ChartNoAxesCombined,
  ShieldCheck,
  HeartPulse,
  Shield,
  Settings,
  X,
  KeyRound,
  LifeBuoy,
} from "lucide-react";

import "./SuperAdminSidebar.css";

const navigationGroups = [
  {
    title: "OVERVIEW",
    items: [
      {
        label: "Dashboard",
        path: "/superadmin/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: "TENANT MANAGEMENT",
    items: [
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
        label: "Roles & Permissions",
        path: "/superadmin/roles",
        icon: KeyRound,
      },
    ],
  },
  {
    title: "BILLING & REVENUE",
    items: [
      {
        label: "Plans",
        path: "/superadmin/plans",
        icon: Gem,
      },
      {
        label: "Subscriptions",
        path: "/superadmin/subscriptions",
        icon: CreditCard,
      },
      {
        label: "Billing & Payments",
        path: "/superadmin/billing",
        icon: Receipt,
      },
      {
        label: "Invoices",
        path: "/superadmin/invoices",
        icon: FileText,
      },
    ],
  },
  {
    title: "COMMUNICATION",
    items: [
      {
        label: "SMTP / Email",
        path: "/superadmin/email",
        icon: Mail,
      },
      {
        label: "Email Templates",
        path: "/superadmin/email-templates",
        icon: LayoutTemplate,
      },
      {
        label: "Announcements",
        path: "/superadmin/announcements",
        icon: Megaphone,
      },
      {
        label: "Help & Support",
        path: "/superadmin/help-support",
        icon: LifeBuoy,
      },
    ],
  },
  {
    title: "AI MANAGEMENT",
    items: [
      {
        label: "AI Configuration",
        path: "/superadmin/ai-configuration",
        icon: Sliders,
      },
      {
        label: "AI Usage",
        path: "/superadmin/ai-usage",
        icon: Sparkles,
      },
    ],
  },
  {
    title: "MONITORING",
    items: [
      {
        label: "Analytics",
        path: "/superadmin/analytics",
        icon: ChartNoAxesCombined,
      },
      {
        label: "Audit Logs",
        path: "/superadmin/activity-logs",
        icon: ShieldCheck,
      },
      {
        label: "System Health",
        path: "/superadmin/system-health",
        icon: HeartPulse,
      },
    ],
  },
  {
    title: "PLATFORM",
    items: [
      {
        label: "Security",
        path: "/superadmin/security",
        icon: Shield,
      },
      {
        label: "Settings",
        path: "/superadmin/settings",
        icon: Settings,
      },
    ],
  },
];

function SuperAdminSidebar({ sidebarOpen = false, setSidebarOpen }) {
  const closeSidebar = () => {
    setSidebarOpen?.(false);
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
            <svg
              width="26"
              height="26"
              viewBox="0 0 28 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="28" height="28" rx="8" fill="url(#tf-logo-bg)" />
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
                  id="tf-logo-bg"
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

          <span className="superadmin-brand-name">
            TeamFlow <span>AI</span>
          </span>
        </NavLink>

        <button
          type="button"
          className="superadmin-close-sidebar"
          onClick={closeSidebar}
          aria-label="Close sidebar"
        >
          <X size={18} />
        </button>
      </div>

      {/* Navigation List */}
      <nav className="superadmin-navigation">
        {navigationGroups.map((group) => (
          <section
            className="superadmin-nav-group"
            key={group.title}
            aria-label={group.title}
          >
            {group.title !== "OVERVIEW" && (
              <p className="superadmin-nav-heading">{group.title}</p>
            )}

            <div className="superadmin-nav-links">
              {group.items.map((item) => {
                const Icon = item.icon;

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end
                    className={({ isActive }) =>
                      `superadmin-nav-link ${
                        isActive ? "superadmin-nav-link-active" : ""
                      }`
                    }
                    onClick={closeSidebar}
                  >
                    <Icon
                      className="superadmin-nav-icon"
                      size={17}
                      strokeWidth={1.9}
                    />
                    <span className="superadmin-nav-label">{item.label}</span>
                  </NavLink>
                );
              })}
            </div>
          </section>
        ))}
      </nav>
    </aside>
  );
}

export default SuperAdminSidebar;
