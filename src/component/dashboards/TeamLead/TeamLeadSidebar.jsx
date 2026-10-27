import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Activity, BarChart3, Bug, CalendarDays, CheckSquare, FileText,
  FolderKanban, House, MessageCircle, Settings,
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

export default function TeamLeadSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => path === "/teamlead/member"
    ? location.pathname.startsWith(path)
    : location.pathname === path;

  return (
    <aside className="team-lead-sidebar">
      <button type="button" className="tls-brand superadmin-brand" onClick={() => navigate("/teamlead/dashboard")} aria-label="TeamFlow AI dashboard">
        <span className="superadmin-brand-icon tls-logo-clean">
          <svg
            width="26"
            height="26"
            viewBox="0 0 28 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="28" height="28" rx="8" fill="url(#tf-logo-bg-tl)" />
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
                id="tf-logo-bg-tl"
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
        </span>
        <span className="superadmin-brand-name">
          TeamFlow <span>AI</span>
        </span>
      </button>

      <nav className="tls-nav" aria-label="Team Lead navigation">
        <div className="tls-nav-group tls-dashboard-group">
          {(() => {
            const Icon = DASHBOARD_ITEM.icon;
            const active = location.pathname === DASHBOARD_ITEM.path;
            return <button type="button" className={`tls-nav-item ${active ? "active" : ""}`} aria-current={active ? "page" : undefined} onClick={() => navigate(DASHBOARD_ITEM.path)}>
              <Icon size={17} strokeWidth={1.9} aria-hidden="true" /><span>{DASHBOARD_ITEM.label}</span>
            </button>;
          })()}
        </div>
        {NAV_GROUPS.map(group => <div className="tls-nav-group" key={group.title}>
          <h2 className="tls-section-label">{group.title}</h2>
          {group.items.map(({ label, icon: Icon, path }) => {
            const active = isActive(path);
            return <button key={label} type="button" className={`tls-nav-item ${active ? "active" : ""}`} aria-current={active ? "page" : undefined} onClick={() => navigate(path)}>
              <Icon size={17} strokeWidth={1.9} aria-hidden="true" /><span>{label}</span>
            </button>;
          })}
        </div>)}
      </nav>

      <div className="tls-sidebar-bottom">
        <div className="tls-support-card">
          <div className="tls-support-heading"><span className="tls-support-icon"><MessageCircle size={19} /></span><span className="tls-support-copy"><b>Need help?</b><small>We're here for your team</small></span></div>
          <button className="tls-support-button" type="button" onClick={() => navigate("/teamlead/settings")}>Contact support</button>
        </div>
      </div>
    </aside>
  );
}
