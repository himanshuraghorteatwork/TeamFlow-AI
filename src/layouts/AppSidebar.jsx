
import React from "react";
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
  LayoutDashboard,
} from "lucide-react";

import "./AppSidebar.css";

const navigation = [
  { label: "Dashboard", path: "/dashboard", icon: House },
  { label: "Chat", path: "/chat", icon: MessageCircle },
  { label: "Tasks", path: "/tasks", icon: SquareCheckBig },
  { label: "Projects", path: "/projects", icon: FolderKanban },
  { label: "Bugs", path: "/bugs", icon: Bug },
  { label: "Calendar", path: "/calendar", icon: CalendarDays },
  { label: "Team", path: "/team", icon: UserRound },
  { label: "Files", path: "/files", icon: Files },
  { label: "AI Assistant", path: "/ai-assistant", icon: Sparkles },
  { label: "Settings", path: "/settings", icon: Settings },
];

function AppSidebar() {
  return (
    <aside className="app-sidebar">
      <NavLink to="/" className="app-sidebar-brand">
        <span className="app-brand-icon">
          <Users size={22} />
        </span>
        <span className="app-brand-name">
          TeamFlow <span>AI</span>
        </span>
      </NavLink>

      <button className="app-workspace-switcher" type="button">
        <span className="app-workspace-icon">
          <LayoutDashboard size={22} />
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
        <img
          src="https://i.pravatar.cc/100?img=68"
          alt="John Doe"
        />
        <div className="app-profile-info">
          <strong>John Doe</strong>
          <span>john@company.com</span>
        </div>
        <button type="button" aria-label="Profile options">
          <MoreVertical size={19} />
        </button>
      </div>
    </aside>
  );
}

export default AppSidebar;
