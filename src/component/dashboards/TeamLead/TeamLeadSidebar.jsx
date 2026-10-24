import {
  BarChart3,
  Bug,
  CalendarDays,
  CheckSquare,
  ChevronRight,
  FolderKanban,
  LayoutDashboard,
  Layers,
  LogOut,
  MessageCircle,
  Settings,
  ShieldCheck,
  Sparkles,
  UserRound,
  Users,
} from "lucide-react";

import { useLocation, useNavigate } from "react-router-dom";

import "./TeamLeadSidebar.css";

/* ================= NAVIGATION ITEMS ================= */

const NAV_ITEMS = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/teamlead/dashboard" },
  { label: "My Team", icon: Users, path: "/teamlead/team" },
  { label: "Projects", icon: FolderKanban, path: "/teamlead/projects" },
  { label: "Tasks", icon: CheckSquare, path: "/teamlead/tasks" },
  { label: "Bugs", icon: Bug, path: "/teamlead/bugs" },
  { label: "Calendar", icon: CalendarDays, path: "/teamlead/calendar" },
  { label: "Team Members", icon: UserRound, path: "/teamlead/member" },
  { label: "Reports", icon: BarChart3, path: "/teamlead/reports" },
  { label: "Chat", icon: MessageCircle, path: "/teamlead/chat" },
  { label: "AI Assistant", icon: Sparkles, path: "/teamlead/ai-assistant" },
  { label: "Settings", icon: Settings, path: "/teamlead/settings" },
];

/* ================= COMPONENT ================= */

export default function TeamLeadSidebar({
  onLogout,
  onProfile,
  profileName = "Priya Sharma",
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = (path) => navigate(path);

  const isActive = (path) => {
    if (path === "/teamlead/member") {
      return location.pathname.startsWith("/teamlead/member");
    }
    return location.pathname === path;
  };

const handleLogout = () => {
  if (onLogout) {
    onLogout();
    return;
  }

  localStorage.removeItem("teamflow_current_user");
  localStorage.removeItem("teamflow_teamlead");
  localStorage.removeItem("teamflow_user");

  sessionStorage.removeItem("teamflow_current_user");
  sessionStorage.removeItem("teamflow_teamlead");
  sessionStorage.removeItem("teamflow_user");

  navigate("/choose-role", { replace: true });
};

  const handleProfile = () => {
    if (onProfile) {
      onProfile();
      return;
    }
    navigate("/teamlead/settings");
  };

  const handleTeamControl = () => navigate("/teamlead/settings");

  const initials = profileName
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <aside className="team-lead-sidebar">
      {/* ================= BRAND ================= */}
      <button
        type="button"
        className="tls-brand"
        onClick={() => navigate("/teamlead/dashboard")}
        aria-label="TeamFlow AI Team Lead Dashboard"
      >
        <span className="tls-logo">
          <Layers size={22} strokeWidth={2} />
        </span>

        <span className="tls-brand-copy">
          <span className="tls-brand-name">
            TeamFlow <b>AI</b>
          </span>
          <span className="tls-brand-sub">Team Lead Console</span>
        </span>
      </button>

      {/* ================= ROLE CARD ================= */}
      <div className="tls-role-card">
        <span className="tls-role-icon">
          <ShieldCheck size={20} strokeWidth={2} />
        </span>

        <span className="tls-role-copy">
          <b>Team Lead</b>
          <small>Team Management</small>
        </span>

        <span className="tls-status-dot" aria-hidden="true" />
      </div>

      {/* ================= NAVIGATION ================= */}
      <div className="tls-section-label">Team Management</div>

      <nav className="tls-nav" aria-label="Team Lead navigation">
        {NAV_ITEMS.map(({ label, icon: Icon, path }) => {
          const active = isActive(path);

          return (
            <button
              key={label}
              type="button"
              className={`tls-nav-item ${active ? "active" : ""}`}
              aria-current={active ? "page" : undefined}
              onClick={() => handleNavigate(path)}
            >
              <Icon size={18} strokeWidth={1.8} aria-hidden="true" />
              <span>{label}</span>
              {active && <i className="tls-active-bar" aria-hidden="true" />}
            </button>
          );
        })}
      </nav>

      {/* ================= BOTTOM ================= */}
      <div className="tls-sidebar-bottom">
        <button
          type="button"
          className="tls-control-card"
          onClick={handleTeamControl}
        >
          <span className="tls-control-icon">
            <ShieldCheck size={19} strokeWidth={2} />
          </span>

          <span className="tls-control-copy">
            <b>Team Control</b>
            <small>Manage team workspace and settings</small>
          </span>

          <ChevronRight size={17} aria-hidden="true" />
        </button>

        <div className="tls-bottom-divider" />

        <button
          type="button"
          className="tls-profile-button"
          onClick={handleProfile}
          aria-label={`Open profile for ${profileName}`}
        >
          <span className="tls-avatar">{initials}</span>

          <span className="tls-profile-copy">
            <b>{profileName}</b>
            <small>Team Lead</small>
          </span>
        </button>

        <button
          type="button"
          className="tls-nav-item tls-logout"
          onClick={handleLogout}
        >
          <LogOut size={17} strokeWidth={1.8} aria-hidden="true" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}