import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Activity, BarChart3, Bug, CalendarDays, CheckSquare, FileText,
  FolderKanban, House, LogOut, MessageCircle, Settings,
  Sparkles, Users, UserRound, Bell, Clock3
} from "lucide-react";
import "./TeamLeadSidebar.css";

const DASHBOARD_ITEM = { label: "Dashboard", icon: House, path: "/teamlead/dashboard" };

const NAV_GROUPS = [
  { title: "MY TEAM", items: [
    { label: "My Team", icon: Users, path: "/teamlead/team" },
    { label: "Workload", icon: Activity, path: "/teamlead/workload" },
    { label: "Team Members", icon: UserRound, path: "/teamlead/member" },
  ]},
  { title: "PROJECT MANAGEMENT", items: [
    { label: "Projects", icon: FolderKanban, path: "/teamlead/projects" },
    { label: "Tasks", icon: CheckSquare, path: "/teamlead/tasks" },
    { label: "Bugs", icon: Bug, path: "/teamlead/bugs" },
    { label: "Calendar", icon: CalendarDays, path: "/teamlead/calendar" },
  ]},
  { title: "COLLABORATION", items: [
    { label: "Team Chat", icon: MessageCircle, path: "/teamlead/chat" },
    { label: "Meetings", icon: Clock3, path: "/teamlead/meetings" },
    { label: "Files & Docs", icon: FileText, path: "/teamlead/files" },
  ]},
  { title: "AI TOOLS", items: [
    { label: "AI Assistant", icon: Sparkles, path: "/teamlead/ai-assistant" },
    { label: "Task Suggestions", icon: CheckSquare, path: "/teamlead/task-suggestions" },
    { label: "AI Summaries", icon: FileText, path: "/teamlead/ai-summaries" },
  ]},
  { title: "REPORTS", items: [
    { label: "Team Performance", icon: BarChart3, path: "/teamlead/reports" },
    { label: "Project Reports", icon: BarChart3, path: "/teamlead/project-reports" },
  ]},
  { title: "SETTINGS", items: [
    { label: "Notifications", icon: Bell, path: "/teamlead/notifications" },
    { label: "Team Settings", icon: Settings, path: "/teamlead/settings" },
  ]},
];

export default function TeamLeadSidebar({ onLogout, onProfile, profileName = "Komal Pawar" }) {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => path === "/teamlead/member"
    ? location.pathname.startsWith(path)
    : location.pathname === path;

  const handleLogout = () => {
    if (onLogout) return onLogout();
    ["teamflow_current_user", "teamflow_teamlead", "teamflow_user", "token", "user"].forEach(key => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    });
    navigate("/choose-role");
  };

  const initials = profileName.trim().split(/\s+/).map(part => part[0]).slice(0, 2).join("").toUpperCase();

  return (
    <aside className="team-lead-sidebar">
      <button type="button" className="tls-brand" onClick={() => navigate("/teamlead/dashboard")} aria-label="TeamFlow AI dashboard">
        <span className="tls-logo"><Sparkles size={23} strokeWidth={2.2} /></span>
        <span className="tls-brand-copy"><span className="tls-brand-name">TeamFlow <b>AI</b></span><span className="tls-brand-sub">Team workspace</span></span>
      </button>

      <nav className="tls-nav" aria-label="Team Lead navigation">
        <div className="tls-nav-group tls-dashboard-group">
          {(() => {
            const Icon = DASHBOARD_ITEM.icon;
            const active = location.pathname === DASHBOARD_ITEM.path;
            return <button type="button" className={`tls-nav-item ${active ? "active" : ""}`} aria-current={active ? "page" : undefined} onClick={() => navigate(DASHBOARD_ITEM.path)}>
              <Icon size={18} strokeWidth={1.8} aria-hidden="true" /><span>{DASHBOARD_ITEM.label}</span>
            </button>;
          })()}
        </div>
        {NAV_GROUPS.map(group => <div className="tls-nav-group" key={group.title}>
          <h2 className="tls-section-label">{group.title}</h2>
          {group.items.map(({ label, icon: Icon, path }) => {
            const active = isActive(path);
            return <button key={label} type="button" className={`tls-nav-item ${active ? "active" : ""}`} aria-current={active ? "page" : undefined} onClick={() => navigate(path)}>
              <Icon size={18} strokeWidth={1.8} aria-hidden="true" /><span>{label}</span>
            </button>;
          })}
        </div>)}
      </nav>

      <div className="tls-sidebar-bottom">
        <div className="tls-support-card">
          <div className="tls-support-heading"><span className="tls-support-icon"><MessageCircle size={19} /></span><span className="tls-support-copy"><b>Need help?</b><small>We're here for your team</small></span></div>
          <button className="tls-support-button" type="button" onClick={() => navigate("/teamlead/settings")}>Contact support</button>
        </div>
        <button type="button" className="tls-profile-button" onClick={() => onProfile ? onProfile() : navigate("/teamlead/settings")} aria-label={`Open profile for ${profileName}`}>
          <span className="tls-avatar">{initials}</span><span className="tls-profile-copy"><b>{profileName}</b><small>Team Lead</small></span><UserRound size={17} aria-hidden="true" />
        </button>
        <button type="button" className="tls-nav-item tls-logout" onClick={handleLogout}><LogOut size={17} strokeWidth={1.8} /><span>Sign out</span></button>
      </div>
    </aside>
  );
}
