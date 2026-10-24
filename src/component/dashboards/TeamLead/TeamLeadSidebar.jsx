
import {
  BarChart3,
  Bug,
  CalendarDays,
  CheckSquare,
  FolderKanban,
  LayoutDashboard,
  MessageCircle,
  Settings,
  Sparkles,
  UserRound,
  Users,
  Headphones,
  LogOut,
} from "lucide-react";

import { useLocation, useNavigate } from "react-router-dom";

import "./TeamLeadSidebar.css";

const NAV_ITEMS = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/teamlead/dashboard",
  },
  {
    label: "My Team",
    icon: Users,
    path: "/teamlead/team",
  },
  {
    label: "Projects",
    icon: FolderKanban,
    path: "/teamlead/projects",
  },
  {
    label: "Tasks",
    icon: CheckSquare,
    path: "/teamlead/tasks",
  },
  {
    label: "Bugs",
    icon: Bug,
    path: "/teamlead/bugs",
  },
  {
    label: "Calendar",
    icon: CalendarDays,
    path: "/teamlead/calendar",
  },
  {
    label: "Team Members",
    icon: UserRound,
    path: "/teamlead/member",
  },
  {
    label: "Reports",
    icon: BarChart3,
    path: "/teamlead/reports",
  },
  {
    label: "Chat",
    icon: MessageCircle,
    path: "/teamlead/chat",
  },
  {
    label: "AI Assistant",
    icon: Sparkles,
    path: "/teamlead/ai-assistant",
  },
  {
    label: "Settings",
    icon: Settings,
    path: "/teamlead/settings",
  },
];

export default function TeamLeadSidebar({
  onLogout,
  onProfile,
  profileName = "Priya Sharma",
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = (path) => {
    navigate(path);
  };

  const isActive = (path) => {
    if (path === "/teamlead/member") {
      return location.pathname.startsWith("/teamlead/member");
    }

    return location.pathname === path;
  };

  const handleLogout = () => {
    // Clear the active session
    [
      "teamflow_current_user",
      "teamflow_teamlead",
      "teamflow_admin",
      "teamflow_admin_logged_in",
      "teamflow_superadmin",
      "teamflow_user",
    ].forEach((key) => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    });

    // Use the parent's logout callback if provided
    if (onLogout) {
      onLogout();
      return;
    }

    navigate("/choose-role", { replace: true });
  };

  const handleProfile = () => {
    if (onProfile) {
      onProfile();
      return;
    }

    navigate("/teamlead/settings");
  };

  const handleSupport = () => {
    navigate("/teamlead/settings");
  };

  const initials = profileName
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <aside className="team-lead-sidebar">
      {/* Brand */}
      <button
        type="button"
        className="tls-brand"
        onClick={() => navigate("/teamlead/dashboard")}
        aria-label="TeamFlow AI Team Lead Dashboard"
      >
        <span className="tls-logo">
          <Users size={22} strokeWidth={2} />
        </span>

        <span className="tls-brand-copy">
          <span className="tls-brand-name">
            TeamFlow <b>AI</b>
          </span>

          <span className="tls-admin-badge">
            Team Lead
          </span>
        </span>
      </button>

      {/* Navigation */}
      <nav
        className="tls-nav"
        aria-label="Team Lead navigation"
      >
        {NAV_ITEMS.map(({ label, icon: Icon, path }) => {
          const active = isActive(path);

          return (
            <button
              key={label}
              type="button"
              className={`tls-nav-item ${
                active ? "active" : ""
              }`}
              aria-current={active ? "page" : undefined}
              onClick={() => handleNavigate(path)}
            >
              <Icon
                size={19}
                strokeWidth={1.8}
                aria-hidden="true"
              />

              <span>{label}</span>
            </button>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="tls-sidebar-bottom">
        {/* Support */}
        <div className="tls-support-card">
          <div className="tls-support-heading">
            <div className="tls-support-icon">
              <Headphones size={21} strokeWidth={2} />
            </div>

            <div className="tls-support-copy">
              <b>Need Help?</b>
              <small>Contact support team</small>
            </div>
          </div>

          <button
            className="tls-support-button"
            type="button"
            onClick={handleSupport}
          >
            Contact Support
          </button>
        </div>

        {/* Profile */}
        <button
          className="tls-profile-button"
          type="button"
          onClick={handleProfile}
          aria-label={`Open profile for ${profileName}`}
        >
          <span className="tls-avatar">{initials}</span>

          <span className="tls-profile-copy">
            <b>{profileName}</b>
            <small>Team Lead · View profile</small>
          </span>

          <UserRound size={17} aria-hidden="true" />
        </button>

        {/* Logout */}
        <button
          className="tls-nav-item tls-logout"
          type="button"
          onClick={handleLogout}
        >
          <LogOut
            size={19}
            strokeWidth={1.8}
            aria-hidden="true"
          />

          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
