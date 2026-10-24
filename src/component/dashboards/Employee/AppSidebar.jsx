import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  Users,
  House,
  MessageCircle,
  SquareCheckBig,
  FolderKanban,
  Bug,
  CalendarDays,
  UserRound,
  Files,
  Sparkles,
  Settings,
  ChevronDown,
  MoreVertical,
  LayoutGrid,
  User,
  LogOut,
} from "lucide-react";

import "./AppSidebar.css";

const navigation = [
  { label: "Dashboard", path: "/employee/dashboard", icon: House },
  { label: "Chat", path: "/employee/chat", icon: MessageCircle },
  { label: "Tasks", path: "/employee/tasks", icon: SquareCheckBig },
  { label: "Projects", path: "/employee/projects", icon: FolderKanban },
  { label: "Bugs", path: "/employee/bugs", icon: Bug },
  { label: "Calendar", path: "/employee/calendar", icon: CalendarDays },
  { label: "Team", path: "/employee/team", icon: UserRound },
  { label: "Files", path: "/employee/files", icon: Files },
  { label: "AI Assistant", path: "/employee/ai-assistant", icon: Sparkles },
  { label: "Settings", path: "/employee/settings", icon: Settings },
];

function AppSidebar() {
    const handleLogout = () => {
    localStorage.removeItem("teamflow_admin");
    localStorage.removeItem("teamflow_admin_logged_in");

    navigate("/login");
  };
  const [profile, setProfile] = useState(() => {
    try {
      const settings = JSON.parse(
        localStorage.getItem("teamflow-settings") || "null"
      );
      const user = JSON.parse(
        localStorage.getItem("teamflow_current_user") || "null"
      );

      const firstName =
        settings?.profile?.firstName ||
        (user?.name ? user.name.split(" ")[0] : "John");
      const lastName =
        settings?.profile?.lastName ||
        (user?.name ? user.name.split(" ").slice(1).join(" ") : "Doe");
      const fullName = `${firstName} ${lastName}`.trim() || "John Doe";
      const email =
        settings?.profile?.email || user?.email || "john@company.com";
      const photo = settings?.profile?.photo || "/avatar.png";
      const initials = `${firstName[0] || "J"}${lastName[0] || "D"}`.toUpperCase();

      return { fullName, email, photo, initials };
    } catch {
      return {
        fullName: "John Doe",
        email: "john@company.com",
        photo: null,
        initials: "JD",
      };
    }
  });

  return (
    <aside className="app-sidebar">
      <NavLink to="/employee/dashboard" className="app-sidebar-brand">
        <span className="app-brand-icon">
          <Users size={22} />
        </span>
        <span className="app-brand-name">
          TeamFlow <span>AI</span>
        </span>
      </NavLink>

      <button className="app-workspace-switcher" type="button">
        <span className="app-workspace-icon">
          <LayoutGrid size={20} />
        </span>
        <span className="app-workspace-info">
          <strong>Product Team</strong>
          <small>Free Plan</small>
        </span>
        <ChevronDown size={17} />
      </button>

      <nav className="app-sidebar-nav" aria-label="Main navigation">
        {navigation.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `app-sidebar-link ${isActive ? "active" : ""}`
            }
          >
            <Icon size={19} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="app-sidebar-profile">
        {/* {profile.photo ? (
          <img
            src={profile.photo}
            alt={profile.fullName}
            className="app-profile-avatar"
          />
        ) : (
          <span className="app-profile-avatar app-profile-initials">
            {profile.initials}
          </span>
        )} */}

        {/* <div className="app-profile-info">
          <strong>{profile.fullName}</strong>
          <span title={profile.email}>{profile.email}</span>
        </div> */}
        <div className="sidebar-bottom">
          <button
            type="button"
            className="sidebar-logout"
            onClick={() => {
              const confirmed = window.confirm(
                "Are you sure you want to logout?"
              );

              if (confirmed) {
                // Clear authentication/session data if you use it
                localStorage.removeItem("token");
                localStorage.removeItem("user");

                // Redirect to login
                window.location.href = "http://localhost:5173/choose-role";
              }
            }}
          >
            <LogOut size={18} strokeWidth={2} />
            <span>Logout</span>
          </button>
        </div>

        <NavLink
          to="/employee/settings"
          className="app-sidebar-profile-btn"
          aria-label="Settings"
          title="Profile & Settings"
        >
          <MoreVertical size={19} />
        </NavLink>
      </div>
    </aside>
  );
}

export default AppSidebar;
