
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import {
  Activity,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Bell,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  CircleHelp,
  Clock3,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageCircle,
  MoreHorizontal,
  Plus,
  Search,
  Settings,
  Sparkles,
  Target,
  Users,
  X,
  Zap,
    Sun,
  Moon,
} from "lucide-react";
import "./TeamLeadDashboard.css";

const activityData = [
  { day: "Mon", completed: 18, created: 12 },
  { day: "Tue", completed: 24, created: 16 },
  { day: "Wed", completed: 20, created: 13 },
  { day: "Thu", completed: 32, created: 21 },
  { day: "Fri", completed: 28, created: 17 },
  { day: "Sat", completed: 37, created: 24 },
  { day: "Sun", completed: 34, created: 19 },
];

const projectData = [
  { name: "TeamFlow Website", progress: 84 },
  { name: "Mobile Application", progress: 67 },
  { name: "Admin Dashboard", progress: 52 },
  { name: "Analytics Module", progress: 38 },
];

const initialTasks = [
  {
    id: "TF-1024",
    title: "Redesign dashboard overview",
    project: "TeamFlow Website",
    assignee: "KP",
    assigneeName: "Komal Pawar",
    priority: "High",
    status: "In Progress",
    due: "Oct 26",
    color: "#7c5cff",
  },
  {
    id: "TF-1025",
    title: "Fix responsive navigation",
    project: "Mobile Application",
    assignee: "AS",
    assigneeName: "Aarav Shah",
    priority: "Medium",
    status: "In Review",
    due: "Oct 27",
    color: "#0ea5e9",
  },
  {
    id: "TF-1026",
    title: "Create analytics components",
    project: "Analytics Module",
    assignee: "PR",
    assigneeName: "Priya Rao",
    priority: "High",
    status: "To Do",
    due: "Oct 28",
    color: "#ec4899",
  },
  {
    id: "TF-1027",
    title: "Update authentication flow",
    project: "Admin Dashboard",
    assignee: "RK",
    assigneeName: "Rohan Kulkarni",
    priority: "Low",
    status: "Completed",
    due: "Oct 24",
    color: "#10b981",
  },
];

const teamMembers = [
  {
    id: 1,
    name: "Komal Pawar",
    role: "Frontend Developer",
    initials: "KP",
    color: "#ede9fe",
    textColor: "#6d4aff",
    status: "Online",
    tasks: 8,
  },
  {
    id: 2,
    name: "Aarav Shah",
    role: "Backend Developer",
    initials: "AS",
    color: "#dbeafe",
    textColor: "#2563eb",
    status: "Online",
    tasks: 6,
  },
  {
    id: 3,
    name: "Priya Rao",
    role: "UI/UX Designer",
    initials: "PR",
    color: "#fce7f3",
    textColor: "#db2777",
    status: "In a meeting",
    tasks: 5,
  },
  {
    id: 4,
    name: "Rohan Kulkarni",
    role: "QA Engineer",
    initials: "RK",
    color: "#d1fae5",
    textColor: "#059669",
    status: "Offline",
    tasks: 4,
  },
];

const upcomingEvents = [
  {
    day: "25",
    month: "OCT",
    title: "Daily Standup",
    time: "10:00 AM – 10:30 AM",
    type: "Meeting",
  },
  {
    day: "26",
    month: "OCT",
    title: "Sprint Planning",
    time: "11:30 AM – 12:30 PM",
    type: "Planning",
  },
  {
    day: "28",
    month: "OCT",
    title: "Project Review",
    time: "02:00 PM – 03:00 PM",
    type: "Review",
  },
];

const taskStatusData = [
  { name: "Completed", value: 42, color: "#10b981" },
  { name: "In Progress", value: 28, color: "#7c5cff" },
  { name: "In Review", value: 18, color: "#f59e0b" },
  { name: "To Do", value: 12, color: "#cbd5e1" },
];

function StatCard({
  title,
  value,
  change,
  description,
  icon: Icon,
  iconColor,
  iconBg,
  negative = false,
}) {
  return (
    <article className="tld-stat-card">
      <div className="tld-stat-top">
        <span className="tld-stat-label">{title}</span>
        <span
          className="tld-stat-icon"
          style={{ color: iconColor, background: iconBg }}
        >
          <Icon size={20} />
        </span>
      </div>

      <div className="tld-stat-value">{value}</div>

      <div className="tld-stat-bottom">
        <span className={`tld-stat-change ${negative ? "negative" : ""}`}>
          {negative ? (
            <ArrowDownRight size={15} />
          ) : (
            <ArrowUpRight size={15} />
          )}
          {change}
        </span>
        <span className="tld-stat-description">{description}</span>
      </div>
    </article>
  );
}

function SectionHeader({ title, subtitle, action, onAction }) {
  return (
    <div className="tld-section-header">
      <div>
        <h2>{title}</h2>
        {subtitle && <p>{subtitle}</p>}
      </div>

      {action && (
        <button className="tld-text-button" onClick={onAction}>
          {action} <ArrowRight size={15} />
        </button>
      )}
    </div>
  );
}

export default function TeamLeadDashboard() {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState(initialTasks);
  const [searchTerm, setSearchTerm] = useState("");
  const [activePeriod, setActivePeriod] = useState("7 days");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(
  () => document.documentElement.classList.contains("dark-mode")
);

const toggleMode = () => {
  const nextMode = !isDarkMode;

  document.documentElement.classList.toggle("dark-mode", nextMode);
  setIsDarkMode(nextMode);
};

  const filteredTasks = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();

    if (!term) return tasks;

    return tasks.filter((task) =>
      [
        task.id,
        task.title,
        task.project,
        task.assigneeName,
        task.status,
        task.priority,
      ]
        .join(" ")
        .toLowerCase()
        .includes(term)
    );
  }, [tasks, searchTerm]);

  const completedCount = tasks.filter(
    (task) => task.status === "Completed"
  ).length;

  const openCount = tasks.filter(
    (task) => task.status !== "Completed"
  ).length;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.clear();
    navigate("/choose-role");
  };

  const handleCreateTask = () => {
    setShowCreateMenu(false);
    navigate("/teamlead/tasks");
  };

  const handleTaskStatusChange = (taskId, status) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId ? { ...task, status } : task
      )
    );
  };

  const goToTasks = () => navigate("/teamlead/tasks");
  const goToProjects = () => navigate("/teamlead/projects");
  const goToTeam = () => navigate("/teamlead/team");
  const goToCalendar = () => navigate("/teamlead/calendar");

  return (
    <div className="tld-dashboard">
      {/* TOP NAVIGATION — NO SIDEBAR */}
   

{/* TOP NAVIGATION — FULL WIDTH SEARCH + MODE + HELP */}
<header className="tld-topbar">
  <div className="tld-topbar-actions">

    {/* Expanded Search Bar */}
    <label className="tld-search">
      <Search size={18} />

      <input
        type="text"
        placeholder="Search tasks, projects..."
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
      />

      <kbd>Ctrl K</kbd>
    </label>

    {/* Notifications */}
    <div className="tld-popover-wrap">
      <button
        className={`tld-icon-button ${
          showNotifications ? "active" : ""
        }`}
        title="Notifications"
        aria-label="Notifications"
        onClick={() => {
          setShowNotifications(!showNotifications);
          setShowProfile(false);
        }}
      >
        <Bell size={19} />
        <span className="tld-notification-dot" />
      </button>

      {showNotifications && (
        <div className="tld-popover tld-notifications">
          <div className="tld-popover-heading">
            <strong>Notifications</strong>
            <span className="tld-unread-badge">3 new</span>
          </div>

          <div className="tld-notification-item">
            <span className="tld-notification-icon purple">
              <MessageCircle size={17} />
            </span>
            <div>
              <strong>New team comment</strong>
              <p>Aarav commented on the dashboard task.</p>
              <small>10 minutes ago</small>
            </div>
          </div>

          <div className="tld-notification-item">
            <span className="tld-notification-icon green">
              <CheckCircle2 size={17} />
            </span>
            <div>
              <strong>Task completed</strong>
              <p>Authentication flow is ready for review.</p>
              <small>30 minutes ago</small>
            </div>
          </div>

          <div className="tld-notification-item">
            <span className="tld-notification-icon orange">
              <CalendarDays size={17} />
            </span>
            <div>
              <strong>Upcoming meeting</strong>
              <p>Your sprint planning is coming up.</p>
              <small>1 hour ago</small>
            </div>
          </div>
        </div>
      )}
    </div>

    {/* Profile Dropdown */}
    <div className="tld-popover-wrap">
      <button
        className="tld-profile-button"
        onClick={() => {
          setShowProfile(!showProfile);
          setShowNotifications(false);
        }}
        aria-label="Open profile menu"
      >
        <span className="tld-avatar tld-avatar-purple">KP</span>

        <span className="tld-profile-details">
          <strong>Team Lead</strong>
          <small>Administrator</small>
        </span>

        <ChevronDown size={15} />
      </button>

      {showProfile && (
        <div className="tld-popover tld-profile-menu">
          <button
            onClick={() => {
              setShowProfile(false);
              navigate("/teamlead/settings");
            }}
          >
            <Settings size={16} />
            Settings
          </button>

          <button
            onClick={() => {
              setShowProfile(false);
              setShowHelp(true);
            }}
          >
            <CircleHelp size={16} />
            Help center
          </button>

          <div className="tld-menu-divider" />

          <button
            className="tld-logout-button"
            onClick={handleLogout}
          >
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      )}
    </div>

    {/* Mode Toggle */}
  {/* Mode Toggle */}
<button
  className="tld-icon-button tld-mode-button"
  title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
  aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
  onClick={toggleMode}
>
  {isDarkMode ? <Moon size={19} /> : <Sun size={19} />}
</button>

    {/* Help Button */}
    <button
      className="tld-icon-button tld-help-button"
      title="Help and support"
      aria-label="Help and support"
      onClick={() => setShowHelp(true)}
    >
      <CircleHelp size={19} />
    </button>

    {/* Mobile Menu */}
    <button
      className="tld-icon-button tld-mobile-menu"
      onClick={() => setShowMobileMenu(!showMobileMenu)}
      aria-label="Open quick navigation"
    >
      {showMobileMenu ? <X size={20} /> : <Menu size={20} />}
    </button>

  </div>
</header>



      {/* MOBILE QUICK NAVIGATION — NOT A SIDEBAR */}
      {showMobileMenu && (
        <nav className="tld-mobile-nav">
          <button onClick={() => navigate("/teamlead/tasks")}>
            <CheckCircle2 size={17} /> Tasks
          </button>
          <button onClick={goToProjects}>
            <FolderKanban size={17} /> Projects
          </button>
          <button onClick={goToTeam}>
            <Users size={17} /> Team
          </button>
          <button onClick={goToCalendar}>
            <CalendarDays size={17} /> Calendar
          </button>
          <button onClick={() => navigate("/teamlead/chat")}>
            <MessageCircle size={17} /> Chat
          </button>
          <button onClick={() => navigate("/teamlead/settings")}>
            <Settings size={17} /> Settings
          </button>
        </nav>
      )}

      {/* MAIN FULL-WIDTH CONTENT */}
      <main className="tld-main">
        <section className="tld-welcome-section">
          <div>
            <div className="tld-eyebrow">
              <Sparkles size={15} /> TEAM WORKSPACE
            </div>

            <h1>
              Good afternoon, <span>Team Lead!</span>
            </h1>

            <p>
              Here's what's happening with your team today. Let's make
              progress together.
            </p>
          </div>

          <div className="tld-welcome-actions">
            <button className="tld-secondary-button" onClick={goToCalendar}>
              <CalendarDays size={17} /> View calendar
            </button>

            <div className="tld-create-wrap">
              <button
                className="tld-primary-button"
                onClick={() => setShowCreateMenu(!showCreateMenu)}
              >
                <Plus size={18} /> Create new <ChevronDown size={15} />
              </button>

              {showCreateMenu && (
                <div className="tld-create-menu">
                  <button onClick={handleCreateTask}>
                    <CheckCircle2 size={16} /> New task
                  </button>
                  <button
                    onClick={() => {
                      setShowCreateMenu(false);
                      goToProjects();
                    }}
                  >
                    <FolderKanban size={16} /> New project
                  </button>
                  <button
                    onClick={() => {
                      setShowCreateMenu(false);
                      goToTeam();
                    }}
                  >
                    <Users size={16} /> Manage team
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* KPI CARDS */}
        <section className="tld-stats-grid">
          <StatCard
            title="Total Projects"
            value="12"
            change="+16.8%"
            description="vs. last month"
            icon={FolderKanban}
            iconColor="#7554f6"
            iconBg="#eee9ff"
          />

          <StatCard
            title="Active Tasks"
            value={String(openCount + 20)}
            change="+8.2%"
            description="vs. last week"
            icon={Activity}
            iconColor="#0d9fe8"
            iconBg="#e1f5ff"
          />

          <StatCard
            title="Completed Tasks"
            value={String(completedCount + 126)}
            change="+12.5%"
            description="vs. last month"
            icon={CheckCircle2}
            iconColor="#0ca678"
            iconBg="#dcfce7"
          />

          <StatCard
            title="Team Efficiency"
            value="94.2%"
            change="+4.3%"
            description="vs. last month"
            icon={Target}
            iconColor="#e99b19"
            iconBg="#fff1d6"
          />
        </section>

        {/* CHARTS */}
        <section className="tld-charts-grid">
          <article className="tld-panel tld-activity-panel">
            <SectionHeader
              title="Task Activity"
              subtitle="Track task creation and completion over time"
            />

            <div className="tld-chart-legend">
              <span>
                <i className="tld-legend-dot purple-dot" /> Completed
              </span>
              <span>
                <i className="tld-legend-dot blue-dot" /> Created
              </span>

              <select
                value={activePeriod}
                onChange={(event) => setActivePeriod(event.target.value)}
                aria-label="Activity period"
              >
                <option>7 days</option>
                <option>30 days</option>
                <option>90 days</option>
              </select>
            </div>

            <div className="tld-activity-chart">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={activityData}
                  margin={{ top: 12, right: 8, left: -18, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="tldPurpleGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="#7958f5"
                        stopOpacity={0.24}
                      />
                      <stop
                        offset="95%"
                        stopColor="#7958f5"
                        stopOpacity={0}
                      />
                    </linearGradient>

                    <linearGradient
                      id="tldBlueGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="#29a7ed"
                        stopOpacity={0.15}
                      />
                      <stop
                        offset="95%"
                        stopColor="#29a7ed"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    stroke="#edf0f6"
                    strokeDasharray="4 4"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#8b93a7", fontSize: 12 }}
                    dy={10}
                  />

                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#8b93a7", fontSize: 12 }}
                  />

                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      border: "1px solid #eceef5",
                      boxShadow: "0 8px 30px #17203312",
                    }}
                  />

                  <Area
                    type="monotone"
                    dataKey="completed"
                    name="Completed"
                    stroke="#7958f5"
                    strokeWidth={3}
                    fill="url(#tldPurpleGradient)"
                    activeDot={{ r: 5 }}
                  />

                  <Area
                    type="monotone"
                    dataKey="created"
                    name="Created"
                    stroke="#29a7ed"
                    strokeWidth={2.5}
                    fill="url(#tldBlueGradient)"
                    activeDot={{ r: 4 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="tld-chart-footer">
              <span>
                <span className="tld-trend-up">
                  <ArrowUpRight size={15} /> 18.6%
                </span>
                more tasks completed
              </span>
              <span className="tld-muted">Compared to previous period</span>
            </div>
          </article>

          <article className="tld-panel tld-status-panel">
            <SectionHeader
              title="Task Distribution"
              subtitle="Current status of all team tasks"
              action="View tasks"
              onAction={goToTasks}
            />

            <div className="tld-status-content">
              <div className="tld-donut-wrap">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={taskStatusData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius="67%"
                      outerRadius="90%"
                      paddingAngle={4}
                      stroke="none"
                    >
                      {taskStatusData.map((item) => (
                        <Cell key={item.name} fill={item.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>

                <div className="tld-donut-center">
                  <strong>248</strong>
                  <span>Total tasks</span>
                </div>
              </div>

              <div className="tld-status-legend">
                {taskStatusData.map((item) => (
                  <div className="tld-status-legend-item" key={item.name}>
                    <div>
                      <span
                        className="tld-legend-dot"
                        style={{ background: item.color }}
                      />
                      <span>{item.name}</span>
                    </div>
                    <strong>{item.value}%</strong>
                  </div>
                ))}
              </div>
            </div>

            <div className="tld-status-summary">
              <span className="tld-summary-icon">
                <CheckCircle2 size={17} />
              </span>
              <p>
                Your team has completed <strong>42%</strong> of all tasks.
                Keep up the great work!
              </p>
            </div>
          </article>
        </section>

        {/* PROJECT PROGRESS AND TEAM */}
        <section className="tld-middle-grid">
          <article className="tld-panel">
            <SectionHeader
              title="Project Progress"
              subtitle="Monitor progress across active projects"
              action="All projects"
              onAction={goToProjects}
            />

            <div className="tld-project-chart">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={projectData}
                  layout="vertical"
                  margin={{ top: 4, right: 18, left: 8, bottom: 0 }}
                  barCategoryGap={19}
                >
                  <CartesianGrid
                    stroke="#edf0f6"
                    strokeDasharray="4 4"
                    horizontal={false}
                  />
                  <XAxis
                    type="number"
                    domain={[0, 100]}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#9299ab", fontSize: 11 }}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={120}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#626d83", fontSize: 11 }}
                  />
                  <Tooltip formatter={(value) => [`${value}%`, "Progress"]} />
                  <Bar
                    dataKey="progress"
                    fill="#7958f5"
                    radius={[0, 8, 8, 0]}
                    barSize={15}
                    background={{ fill: "#f0eefb", radius: 8 }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </article>

          <article className="tld-panel">
            <SectionHeader
              title="Team Availability"
              subtitle="Your team's current status"
              action="View team"
              onAction={goToTeam}
            />

            <div className="tld-team-list">
              {teamMembers.map((member) => (
                <button
                  className="tld-team-member"
                  key={member.id}
                  onClick={() => navigate(`/teamlead/member/${member.id}`)}
                >
                  <span
                    className="tld-avatar"
                    style={{
                      background: member.color,
                      color: member.textColor,
                    }}
                  >
                    {member.initials}
                  </span>

                  <span className="tld-team-info">
                    <strong>{member.name}</strong>
                    <small>{member.role}</small>
                  </span>

                  <span className="tld-team-status-wrap">
                    <span
                      className={`tld-status-indicator ${
                        member.status === "Online"
                          ? "online"
                          : member.status === "Offline"
                          ? "offline"
                          : "meeting"
                      }`}
                    />
                    <small>{member.status}</small>
                  </span>

                  <span className="tld-member-task-count">
                    {member.tasks} tasks
                  </span>
                </button>
              ))}
            </div>

            <button className="tld-invite-button" onClick={goToTeam}>
              <Plus size={16} /> Manage team members
            </button>
          </article>
        </section>

        {/* TASK TABLE AND EVENTS */}
        <section className="tld-bottom-grid">
          <article className="tld-panel tld-tasks-panel">
            <SectionHeader
              title="Recent Tasks"
              subtitle="Review and manage your team's latest work"
              action="View all tasks"
              onAction={goToTasks}
            />

            <div className="tld-task-filters">
              <span className="tld-task-filter-active">
                All tasks <span>{tasks.length}</span>
              </span>
              <span>In progress</span>
              <span>Completed</span>
            </div>

            <div className="tld-table-wrapper">
              <table className="tld-task-table">
                <thead>
                  <tr>
                    <th>Task</th>
                    <th>Project</th>
                    <th>Assignee</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Due date</th>
                    <th />
                  </tr>
                </thead>

                <tbody>
                  {filteredTasks.map((task) => (
                    <tr key={task.id}>
                      <td>
                        <div className="tld-task-name">
                          <span
                            className={`tld-task-check ${
                              task.status === "Completed" ? "checked" : ""
                            }`}
                          >
                            {task.status === "Completed" && (
                              <CheckCircle2 size={14} />
                            )}
                          </span>
                          <div>
                            <strong>{task.title}</strong>
                            <small>{task.id}</small>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span className="tld-project-name">
                          <span
                            className="tld-project-indicator"
                            style={{ background: task.color }}
                          />
                          {task.project}
                        </span>
                      </td>

                      <td>
                        <span className="tld-assignee">
                          <span
                            className="tld-avatar tld-small-avatar"
                            style={{
                              background: `${task.color}20`,
                              color: task.color,
                            }}
                          >
                            {task.assignee}
                          </span>
                          {task.assigneeName}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`tld-priority ${
                            task.priority === "High"
                              ? "priority-high"
                              : task.priority === "Medium"
                              ? "priority-medium"
                              : "priority-low"
                          }`}
                        >
                          {task.priority}
                        </span>
                      </td>

                      <td>
                        <select
                          className={`tld-task-status ${
                            task.status === "Completed"
                              ? "status-completed"
                              : task.status === "In Progress"
                              ? "status-progress"
                              : task.status === "In Review"
                              ? "status-review"
                              : "status-todo"
                          }`}
                          value={task.status}
                          onChange={(event) =>
                            handleTaskStatusChange(
                              task.id,
                              event.target.value
                            )
                          }
                          aria-label={`Status for ${task.title}`}
                        >
                          <option>To Do</option>
                          <option>In Progress</option>
                          <option>In Review</option>
                          <option>Completed</option>
                        </select>
                      </td>

                      <td>
                        <span className="tld-due-date">
                          <CalendarDays size={14} /> {task.due}
                        </span>
                      </td>

                      <td>
                        <button
                          className="tld-row-menu"
                          aria-label={`More options for ${task.title}`}
                          onClick={goToTasks}
                        >
                          <MoreHorizontal size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}

                  {filteredTasks.length === 0 && (
                    <tr>
                      <td colSpan="7" className="tld-empty-state">
                        No tasks match "{searchTerm}".
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="tld-table-footer">
              Showing {filteredTasks.length} of {tasks.length} sample tasks
              <button onClick={goToTasks}>
                Open task management <ArrowRight size={14} />
              </button>
            </div>
          </article>

          <article className="tld-panel tld-events-panel">
            <SectionHeader
              title="Upcoming Events"
              subtitle="Meetings and important deadlines"
              action="Calendar"
              onAction={goToCalendar}
            />

            <div className="tld-events-list">
              {upcomingEvents.map((event, index) => (
                <div className="tld-event" key={event.title}>
                  <div className="tld-event-date">
                    <strong>{event.day}</strong>
                    <span>{event.month}</span>
                  </div>

                  <div className="tld-event-info">
                    <strong>{event.title}</strong>
                    <span>
                      <Clock3 size={13} /> {event.time}
                    </span>
                    <small>{event.type}</small>
                  </div>

                  <button
                    className="tld-event-arrow"
                    onClick={goToCalendar}
                    aria-label={`View ${event.title}`}
                  >
                    <ArrowRight size={16} />
                  </button>
                </div>
              ))}
            </div>

            <button className="tld-calendar-button" onClick={goToCalendar}>
              <CalendarDays size={16} /> View full calendar
            </button>

            <div className="tld-ai-card">
              <span className="tld-ai-icon">
                <Sparkles size={19} />
              </span>
              <div>
                <strong>Need a productivity boost?</strong>
                <p>Get AI-powered insights for your team's workflow.</p>
                <button
                  onClick={() => navigate("/teamlead/ai-assistant")}
                >
                  Explore AI assistant <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </article>
        </section>

        {/* FOOTER */}
        <footer className="tld-footer">
          <span>
            <span className="tld-footer-dot" /> All systems operational
          </span>
          <span>TeamFlow.ai · Team Lead Workspace</span>
          <button onClick={() => setShowHelp(true)}>
            <CircleHelp size={14} /> Help & support
          </button>
        </footer>
      </main>

      {/* HELP MODAL */}
      {showHelp && (
        <div
          className="tld-modal-overlay"
          onClick={() => setShowHelp(false)}
        >
          <div
            className="tld-help-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="tld-modal-close"
              onClick={() => setShowHelp(false)}
              aria-label="Close help"
            >
              <X size={19} />
            </button>

            <span className="tld-help-icon">
              <CircleHelp size={28} />
            </span>

            <h2>How can we help?</h2>
            <p>
              Find your way around TeamFlow.ai or get help with your workspace.
            </p>

            <button
              className="tld-help-option"
              onClick={() => {
                setShowHelp(false);
                goToTasks();
              }}
            >
              <CheckCircle2 size={19} />
              <span>
                <strong>Managing tasks</strong>
                <small>View, update, and track tasks</small>
              </span>
              <ArrowRight size={17} />
            </button>

            <button
              className="tld-help-option"
              onClick={() => {
                setShowHelp(false);
                goToProjects();
              }}
            >
              <FolderKanban size={19} />
              <span>
                <strong>Project management</strong>
                <small>Check project progress and activity</small>
              </span>
              <ArrowRight size={17} />
            </button>

            <button
              className="tld-help-option"
              onClick={() => {
                setShowHelp(false);
                goToTeam();
              }}
            >
              <Users size={19} />
              <span>
                <strong>Team management</strong>
                <small>Review members and assignments</small>
              </span>
              <ArrowRight size={17} />
            </button>

            <button
              className="tld-primary-button tld-help-done"
              onClick={() => setShowHelp(false)}
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
