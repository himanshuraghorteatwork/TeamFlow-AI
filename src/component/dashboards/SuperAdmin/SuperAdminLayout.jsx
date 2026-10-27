import { useEffect, useMemo, useRef, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import {
  Search,
  Sun,
  Moon,
  Bell,
  ChevronDown,
  Menu,
  X,
  Building2,
  Users,
  LayoutDashboard,
  ChartNoAxesCombined,
  FileText,
  Settings,
  CreditCard,
  Gem,
  Receipt,
  Mail,
  LayoutTemplate,
  Megaphone,
  Sliders,
  Sparkles,
  ShieldCheck,
  HeartPulse,
  Shield,
  ArrowUpRight,
  Command,
  User,
  Activity,
  ArrowLeftRight,
  LogOut,
  LifeBuoy,
  KeyRound,
  ShieldAlert,
  Check,
} from "lucide-react";

import SuperAdminSidebar from "./SuperAdminSidebar.jsx";
import SuperAdminErrorBoundary from "./SuperAdminErrorBoundary.jsx";
import "./SuperAdminCommon.css";
import "./SuperAdminLayout.css";

const SEARCH_PAGES = [
  { label: "Dashboard", description: "Platform overview & live metrics", path: "/superadmin/dashboard", keywords: "home overview kpis" },
  { label: "Organizations", description: "Manage tenant organizations", path: "/superadmin/organizations", keywords: "tenants companies clients" },
  { label: "Users", description: "Manage platform users & members", path: "/superadmin/users", keywords: "accounts members people" },
  { label: "Roles & Permissions", description: "Role matrix and user permission directory", path: "/superadmin/roles", keywords: "roles permissions access matrix security users" },
  { label: "Plans", description: "Subscription tiers and pricing", path: "/superadmin/plans", keywords: "pricing tiers free pro business enterprise" },
  { label: "Subscriptions", description: "Review active subscriptions & renewals", path: "/superadmin/subscriptions", keywords: "plans billing renewal" },
  { label: "Billing & Payments", description: "Payment gateway, transactions & payouts", path: "/superadmin/billing", keywords: "transactions revenue payouts stripe razorpay" },
  { label: "Invoices", description: "Download invoices & billing history", path: "/superadmin/invoices", keywords: "receipts pdf payment history" },
  { label: "SMTP / Email", description: "Configure mail servers & delivery settings", path: "/superadmin/email", keywords: "smtp mail server host port tls" },
  { label: "Email Templates", description: "Customize automated notifications & emails", path: "/superadmin/email-templates", keywords: "templates welcome reset invoice notifications" },
  { label: "Announcements", description: "Broadcast alerts and banner notices", path: "/superadmin/announcements", keywords: "broadcast notice banner maintenance alert" },
  { label: "Help & Support", description: "Customer tickets, issues & resolution hub", path: "/superadmin/help-support", keywords: "support tickets issues help desk requests inquiries" },
  { label: "AI Configuration", description: "Configure LLM providers and API keys", path: "/superadmin/ai-configuration", keywords: "openai claude gemini api key models tokens" },
  { label: "AI Usage", description: "Live AI tokens, latency & cost analytics", path: "/superadmin/ai-usage", keywords: "tokens requests latency cost consumption" },
  { label: "Analytics", description: "Platform growth and usage charts", path: "/superadmin/analytics", keywords: "charts reports metrics telemetry" },
  { label: "Audit Logs", description: "Security and administrative audit trail", path: "/superadmin/activity-logs", keywords: "audit logs security activity events" },
  { label: "System Health", description: "Live server uptime & latency monitors", path: "/superadmin/system-health", keywords: "servers uptime latency api database memory cpu" },
  { label: "Security", description: "2FA, IP allowlisting & active sessions", path: "/superadmin/security", keywords: "2fa mfa ip sessions security auth" },
  { label: "Settings", description: "Super Admin preferences & environment", path: "/superadmin/settings", keywords: "configuration general preferences" },
];

const PAGE_ICONS = {
  Dashboard: LayoutDashboard,
  Organizations: Building2,
  Users,
  "Roles & Permissions": KeyRound,
  Plans: Gem,
  Subscriptions: CreditCard,
  "Billing & Payments": Receipt,
  Invoices: FileText,
  "SMTP / Email": Mail,
  "Email Templates": LayoutTemplate,
  Announcements: Megaphone,
  "Help & Support": LifeBuoy,
  "AI Configuration": Sliders,
  "AI Usage": Sparkles,
  Analytics: ChartNoAxesCombined,
  "Audit Logs": ShieldCheck,
  "System Health": HeartPulse,
  Security: Shield,
  Settings,
};

const ORGANIZATION_STORAGE_KEY = "teamflow_superadmin_organizations";
const NOTIFICATIONS_STORAGE_KEY = "teamflow_superadmin_notifications_state";

const INITIAL_NOTIFICATIONS = [
  {
    id: "notif-1",
    title: "High-risk login attempt blocked",
    message: "Suspicious login attempt from IP 194.26.29.112 (Frankfurt, DE). Automated 2FA challenge triggered.",
    time: "5m ago",
    type: "security",
    category: "Security Alert",
    unread: true,
    link: "/superadmin/security",
    icon: ShieldAlert,
    iconColor: "#ef4444",
    iconBg: "rgba(239, 68, 68, 0.12)",
  },
  {
    id: "notif-2",
    title: "Plan upgraded to Business Tier",
    message: "ABC Technologies upgraded plan (₹14,999/mo). 84 enterprise seats provisioned.",
    time: "28m ago",
    type: "billing",
    category: "Billing & Subscriptions",
    unread: true,
    link: "/superadmin/billing",
    icon: CreditCard,
    iconColor: "#10b981",
    iconBg: "rgba(16, 185, 129, 0.12)",
  },
  {
    id: "notif-3",
    title: "Urgent support ticket raised",
    message: "NovaTech Solutions: 'Cluster gateway latency elevated on region eu-west-1'. Priority 1 ticket.",
    time: "1h ago",
    type: "support",
    category: "Help & Support",
    unread: true,
    link: "/superadmin/help-support",
    icon: LifeBuoy,
    iconColor: "#3b66ff",
    iconBg: "rgba(59, 102, 255, 0.12)",
  },
  {
    id: "notif-4",
    title: "AI token threshold warning",
    message: "OpenAI GPT-4o daily token usage reached 85% of allocated tenant limit.",
    time: "3h ago",
    type: "ai",
    category: "AI Management",
    unread: false,
    link: "/superadmin/ai-usage",
    icon: Sparkles,
    iconColor: "#8b5cf6",
    iconBg: "rgba(139, 92, 246, 0.12)",
  },
  {
    id: "notif-5",
    title: "New tenant workspace registered",
    message: "Nexora Digital registered on 14-day Free Trial with 12 initial team member seats.",
    time: "5h ago",
    type: "org",
    category: "Organizations",
    unread: false,
    link: "/superadmin/organizations",
    icon: Building2,
    iconColor: "#0ea5e9",
    iconBg: "rgba(14, 165, 233, 0.12)",
  },
];

function readOrganizations() {
  try {
    const stored = localStorage.getItem(ORGANIZATION_STORAGE_KEY);
    const parsed = stored ? JSON.parse(stored) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function SuperAdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    try {
      return localStorage.getItem("teamflow_superadmin_dark_mode") === "true";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("teamflow_superadmin_dark_mode", String(darkMode));
      localStorage.setItem("teamflow_admin_dark", String(darkMode));
      localStorage.setItem("teamflow_theme_mode", darkMode ? "dark" : "light");
      if (typeof document !== "undefined") {
        document.body.classList.toggle("sa-dark-mode", Boolean(darkMode));
        document.body.classList.toggle("dark", Boolean(darkMode));
        document.body.classList.toggle("dark-theme", Boolean(darkMode));
        document.documentElement.classList.toggle("sa-dark-mode", Boolean(darkMode));
        document.documentElement.classList.toggle("dark", Boolean(darkMode));
        document.documentElement.setAttribute("data-theme", darkMode ? "dark" : "light");
      }
      window.dispatchEvent(new Event("teamflow_theme_update"));
    } catch {}
  }, [darkMode]);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeResult, setActiveResult] = useState(0);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const searchWrapperRef = useRef(null);
  const profileMenuRef = useRef(null);
  const notificationsMenuRef = useRef(null);
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState(() => {
    try {
      const stored = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return INITIAL_NOTIFICATIONS.map((item) => {
            const found = parsed.find((p) => p.id === item.id);
            return found ? { ...item, unread: found.unread } : item;
          });
        }
      }
    } catch {}
    return INITIAL_NOTIFICATIONS;
  });

  const unreadCount = useMemo(() => {
    return notifications.filter((item) => item.unread).length;
  }, [notifications]);

  const markAllNotificationsRead = () => {
    const updated = notifications.map((item) => ({ ...item, unread: false }));
    setNotifications(updated);
    try {
      localStorage.setItem(
        NOTIFICATIONS_STORAGE_KEY,
        JSON.stringify(updated.map((n) => ({ id: n.id, unread: false })))
      );
    } catch {}
  };

  const handleNotificationClick = (item) => {
    const updated = notifications.map((n) =>
      n.id === item.id ? { ...n, unread: false } : n
    );
    setNotifications(updated);
    try {
      localStorage.setItem(
        NOTIFICATIONS_STORAGE_KEY,
        JSON.stringify(updated.map((n) => ({ id: n.id, unread: n.unread })))
      );
    } catch {}
    setNotificationsOpen(false);
    if (item.link) {
      navigate(item.link);
    }
  };

  const query = searchQuery.trim().toLowerCase();

  const searchResults = useMemo(() => {
    if (!query) return [];

    const pageResults = SEARCH_PAGES.filter((page) =>
      `${page.label} ${page.description} ${page.keywords}`
        .toLowerCase()
        .includes(query)
    ).map((page) => ({
      type: "page",
      label: page.label,
      description: page.description,
      path: page.path,
      Icon: PAGE_ICONS[page.label] || Search,
    }));

    const organizationResults = readOrganizations()
      .filter((org) =>
        [org.name, org.email, org.domain, org.id, org.plan, org.status].some(
          (value) => String(value || "").toLowerCase().includes(query)
        )
      )
      .slice(0, 5)
      .map((org) => ({
        type: "organization",
        label: org.name,
        description: `${org.email || org.domain || org.id} · ${org.plan || "No plan"}`,
        path: `/superadmin/organizations?search=${encodeURIComponent(org.name)}`,
        Icon: Building2,
      }));

    return [...organizationResults, ...pageResults].slice(0, 8);
  }, [query]);

  const goToResult = (result) => {
    if (!result) return;
    setSearchOpen(false);
    setSearchQuery("");
    setActiveResult(0);
    setSidebarOpen(false);
    navigate(result.path);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    if (!query) return;

    if (searchResults.length > 0) {
      goToResult(searchResults[activeResult] || searchResults[0]);
      return;
    }

    goToResult({
      path: `/superadmin/organizations?search=${encodeURIComponent(searchQuery.trim())}`,
    });
  };

  const handleSearchKeyDown = (event) => {
    if (event.key === "Escape") {
      setSearchOpen(false);
      return;
    }

    if (event.key === "ArrowDown" && searchResults.length) {
      event.preventDefault();
      setActiveResult((current) => (current + 1) % searchResults.length);
    }

    if (event.key === "ArrowUp" && searchResults.length) {
      event.preventDefault();
      setActiveResult(
        (current) => (current - 1 + searchResults.length) % searchResults.length
      );
    }
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        searchWrapperRef.current &&
        !searchWrapperRef.current.contains(event.target)
      ) {
        setSearchOpen(false);
      }
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setProfileOpen(false);
      }
      if (
        notificationsMenuRef.current &&
        !notificationsMenuRef.current.contains(event.target)
      ) {
        setNotificationsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <div className={`superadmin-layout ${darkMode ? "sa-dark-mode" : ""}`}>
      <SuperAdminSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {sidebarOpen && (
        <button
          type="button"
          className="superadmin-sidebar-overlay"
          aria-label="Close navigation menu"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="superadmin-main">
        <header className="superadmin-topbar">
          <button
            type="button"
            className="superadmin-menu-toggle"
            onClick={() => setSidebarOpen((open) => !open)}
            aria-label={sidebarOpen ? "Close menu" : "Open menu"}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div className="sa-global-search-wrap" ref={searchWrapperRef}>
            <form
              className={`superadmin-search ${searchOpen ? "is-focused" : ""}`}
              onSubmit={handleSearchSubmit}
              role="search"
            >
              <Search size={18} className="sa-search-icon" />

              <input
                type="search"
                value={searchQuery}
                onFocus={() => setSearchOpen(true)}
                onChange={(event) => {
                  setSearchQuery(event.target.value);
                  setSearchOpen(true);
                }}
                onKeyDown={handleSearchKeyDown}
                placeholder="Search organizations, users, plans, payments, or AI..."
                aria-label="Search platform"
              />

              {searchQuery ? (
                <button
                  type="button"
                  className="sa-search-clear"
                  aria-label="Clear search"
                  onClick={() => {
                    setSearchQuery("");
                    setSearchOpen(true);
                  }}
                >
                  <X size={14} />
                </button>
              ) : (
                <span className="sa-search-shortcut">
                  <Command size={11} /> K
                </span>
              )}
            </form>

            {searchOpen && query && (
              <div
                className="sa-global-search-results"
                id="sa-global-search-results"
                role="listbox"
              >
                <div className="sa-search-results-heading">
                  <span>SEARCH RESULTS</span>
                  {searchResults.length > 0 && (
                    <span>{searchResults.length} found</span>
                  )}
                </div>

                {searchResults.length > 0 ? (
                  searchResults.map((result, index) => {
                    const ResultIcon = result.Icon;

                    return (
                      <button
                        type="button"
                        role="option"
                        aria-selected={activeResult === index}
                        key={`${result.type}-${result.path}-${result.label}`}
                        className={`sa-search-result ${
                          activeResult === index ? "is-active" : ""
                        }`}
                        onMouseEnter={() => setActiveResult(index)}
                        onClick={() => goToResult(result)}
                      >
                        <span className="sa-search-result-icon">
                          <ResultIcon size={16} />
                        </span>

                        <span className="sa-search-result-copy">
                          <strong>{result.label}</strong>
                          <small>{result.description}</small>
                        </span>

                        <ArrowUpRight size={14} className="sa-search-result-arrow" />
                      </button>
                    );
                  })
                ) : (
                  <div className="sa-search-empty">
                    <Search size={20} />
                    <strong>No exact matches found</strong>
                    <span>Press Enter to search organizations for “{searchQuery}”</span>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="superadmin-topbar-actions">
            {/* Theme Toggle Sun / Moon Animated Switch */}
            <button
              type="button"
              className={`superadmin-theme-toggle ${darkMode ? "is-dark" : "is-light"}`}
              onClick={() => setDarkMode((prev) => !prev)}
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
              title={darkMode ? "Dark mode active · Click for Light mode" : "Light mode active · Click for Dark mode"}
            >
              <span className="sa-toggle-track">
                <Sun size={12} className="sa-toggle-sun-icon" />
                <Moon size={12} className="sa-toggle-moon-icon" />
              </span>
              <span className="sa-toggle-thumb">
                {darkMode ? (
                  <Moon size={12} className="sa-thumb-icon-moon" />
                ) : (
                  <Sun size={12} className="sa-thumb-icon-sun" />
                )}
              </span>
            </button>

            {/* Notification Menu with Dropdown */}
            <div className="superadmin-notification-menu" ref={notificationsMenuRef}>
              <button
                type="button"
                className={`superadmin-notification-button ${notificationsOpen ? "is-active" : ""}`}
                onClick={() => {
                  setNotificationsOpen((open) => !open);
                  setProfileOpen(false);
                }}
                aria-label="Notifications"
                title="Notifications"
                aria-expanded={notificationsOpen}
              >
                <Bell size={19} />
                {unreadCount > 0 && (
                  <span className="sa-notification-count">{unreadCount}</span>
                )}
              </button>

              {notificationsOpen && (
                <div className="superadmin-notifications-dropdown" role="menu">
                  <div className="sa-notif-header">
                    <div className="sa-notif-header-title">
                      <strong>Notifications</strong>
                      {unreadCount > 0 ? (
                        <span className="sa-notif-badge">{unreadCount} new</span>
                      ) : (
                        <span className="sa-notif-badge-read">All caught up</span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        type="button"
                        className="sa-notif-action-btn"
                        onClick={markAllNotificationsRead}
                        title="Mark all notifications as read"
                      >
                        <Check size={13} /> Mark all read
                      </button>
                    )}
                  </div>

                  <div className="sa-notif-list">
                    {notifications.map((item) => {
                      const IconComp = item.icon;
                      return (
                        <div
                          key={item.id}
                          className={`sa-notif-item ${item.unread ? "is-unread" : ""}`}
                          onClick={() => handleNotificationClick(item)}
                          role="menuitem"
                          tabIndex={0}
                        >
                          <div
                            className="sa-notif-icon-box"
                            style={{
                              color: item.iconColor,
                              backgroundColor: item.iconBg,
                            }}
                          >
                            <IconComp size={16} strokeWidth={2.2} />
                          </div>

                          <div className="sa-notif-content">
                            <div className="sa-notif-meta">
                              <span className="sa-notif-category">{item.category}</span>
                              <span className="sa-notif-time">{item.time}</span>
                            </div>
                            <div className="sa-notif-title">{item.title}</div>
                            <p className="sa-notif-desc">{item.message}</p>
                          </div>

                          {item.unread && <span className="sa-notif-unread-dot" />}
                        </div>
                      );
                    })}
                  </div>

                  <div className="sa-notif-footer">
                    <button
                      type="button"
                      className="sa-notif-footer-link"
                      onClick={() => {
                        setNotificationsOpen(false);
                        navigate("/superadmin/activity-logs");
                      }}
                    >
                      View all system audit logs →
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Trigger */}
            <div className="superadmin-profile-menu" ref={profileMenuRef}>
              <button
                type="button"
                className="superadmin-profile-trigger"
                onClick={() => {
                  setProfileOpen((open) => !open);
                  setNotificationsOpen(false);
                }}
                aria-expanded={profileOpen}
              >
                <span className="superadmin-top-avatar">H</span>
                <span className="superadmin-top-profile-text">
                  <strong>Himanshu</strong>
                  <small>Super Admin</small>
                </span>
                <ChevronDown size={15} />
              </button>

              {profileOpen && (
                <div className="superadmin-profile-dropdown" role="menu">
                  <div className="sa-profile-dropdown-header">
                    <span className="sa-dropdown-avatar">H</span>
                    <div className="sa-dropdown-user-info">
                      <strong>Himanshu Rao</strong>
                      <span>superadmin@teamflow.ai</span>
                      <span className="sa-dropdown-role-tag">Super Admin</span>
                    </div>
                  </div>

                  <div className="sa-dropdown-divider" />

                  <button
                    type="button"
                    className="sa-dropdown-item"
                    onClick={() => {
                      setProfileOpen(false);
                      navigate("/superadmin/settings");
                    }}
                  >
                    <User size={15} />
                    <span>My Profile & Account</span>
                  </button>

                  <button
                    type="button"
                    className="sa-dropdown-item"
                    onClick={() => {
                      setProfileOpen(false);
                      navigate("/superadmin/security");
                    }}
                  >
                    <ShieldCheck size={15} />
                    <span>Security & 2FA</span>
                  </button>

                  <button
                    type="button"
                    className="sa-dropdown-item"
                    onClick={() => {
                      setProfileOpen(false);
                      navigate("/superadmin/activity-logs");
                    }}
                  >
                    <Activity size={15} />
                    <span>Audit Activity Logs</span>
                  </button>

                  <button
                    type="button"
                    className="sa-dropdown-item"
                    onClick={() => {
                      setProfileOpen(false);
                      navigate("/choose-role");
                    }}
                  >
                    <ArrowLeftRight size={15} />
                    <span>Switch Portal / Role</span>
                  </button>

                  <div className="sa-dropdown-divider" />

                  <button
                    type="button"
                    className="sa-dropdown-item sa-dropdown-danger"
                    onClick={() => {
                      setProfileOpen(false);
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
                      navigate("/choose-role", { replace: true });
                    }}
                  >
                    <LogOut size={15} />
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="superadmin-content">
          <SuperAdminErrorBoundary>
            <Outlet />
          </SuperAdminErrorBoundary>
        </main>
      </div>
    </div>
  );
}

export default SuperAdminLayout;
