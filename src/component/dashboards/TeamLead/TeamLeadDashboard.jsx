import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Bell,
  CalendarDays,
  CheckCircle2,
  CheckSquare,
  ChevronDown,
  Clock3,
  FolderKanban,
  HelpCircle,
  LogOut,
  MessageCircle,
  Search,
  Settings,
  Sparkles,
  Users,
  X,
} from "lucide-react";

import "./TeamLeadDashboard.css";

/* =========================================================
   PROJECT DATA
========================================================= */

const PROJECTS = [
  {
    id: 1,
    name: "TeamFlow AI - Web",
    members: 4,
    tasks: 5,
    completed: 2,
    progress: 40,
    status: "Active",
  },
  {
    id: 2,
    name: "Mobile App",
    members: 3,
    tasks: 4,
    completed: 2,
    progress: 50,
    status: "Active",
  },
  {
    id: 3,
    name: "Marketing Website",
    members: 2,
    tasks: 3,
    completed: 3,
    progress: 100,
    status: "Completed",
  },
];

/* =========================================================
   TEAM MEMBERS
========================================================= */

const MEMBERS = [
  {
    id: 1,
    name: "Alex Morgan",
    role: "Frontend Developer",
    status: "Available",
    initials: "AM",
  },
  {
    id: 2,
    name: "Sarah Chen",
    role: "UI/UX Designer",
    status: "Available",
    initials: "SC",
  },
  {
    id: 3,
    name: "Mike Johnson",
    role: "Backend Developer",
    status: "Away",
    initials: "MJ",
  },
  {
    id: 4,
    name: "Emily Davis",
    role: "DevOps Engineer",
    status: "Available",
    initials: "ED",
  },
];

/* =========================================================
   TASK DATA
========================================================= */

const TASKS = [
  {
    id: 1,
    task: "Dashboard UI",
    project: "TeamFlow AI - Web",
    assignee: "Himanshu",
    priority: "High",
    status: "In Progress",
    dueDate: "Oct 28",
  },
  {
    id: 2,
    task: "Mobile Navigation",
    project: "Mobile App",
    assignee: "Alex Morgan",
    priority: "Medium",
    status: "Pending",
    dueDate: "Oct 30",
  },
  {
    id: 3,
    task: "Landing Page Design",
    project: "Marketing Website",
    assignee: "Sarah Chen",
    priority: "Low",
    status: "Completed",
    dueDate: "Oct 24",
  },
  {
    id: 4,
    task: "Authentication Flow",
    project: "TeamFlow AI - Web",
    assignee: "Mike Johnson",
    priority: "High",
    status: "In Progress",
    dueDate: "Nov 02",
  },
];

/* =========================================================
   NOTIFICATIONS
========================================================= */

const NOTIFICATIONS = [
  {
    id: 1,
    title: "Task completed",
    text: "Sarah completed Landing Page Design.",
    time: "10 min ago",
  },
  {
    id: 2,
    title: "Project updated",
    text: "TeamFlow AI - Web progress is now 40%.",
    time: "35 min ago",
  },
  {
    id: 3,
    title: "Upcoming deadline",
    text: "Dashboard UI is due on Oct 28.",
    time: "1 hr ago",
  },
];

/* =========================================================
   DASHBOARD
========================================================= */

function TeamLeadDashboard() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [notificationOpen, setNotificationOpen] =
    useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  /* =======================================================
     DASHBOARD STATS
  ======================================================= */

  const stats = useMemo(() => {
    const totalTasks = TASKS.length;

    const completedTasks = TASKS.filter(
      (task) => task.status === "Completed"
    ).length;

    const pendingTasks = TASKS.filter(
      (task) => task.status !== "Completed"
    ).length;

    const completion =
      totalTasks === 0
        ? 0
        : Math.round((completedTasks / totalTasks) * 100);

    return {
      teamMembers: MEMBERS.length,
      activeProjects: PROJECTS.filter(
        (project) => project.status === "Active"
      ).length,
      pendingTasks,
      completion,
    };
  }, []);

  /* =======================================================
     SEARCH
  ======================================================= */

  const filteredTasks = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) {
      return TASKS;
    }

    return TASKS.filter((task) => {
      return (
        task.task.toLowerCase().includes(value) ||
        task.project.toLowerCase().includes(value) ||
        task.assignee.toLowerCase().includes(value) ||
        task.priority.toLowerCase().includes(value) ||
        task.status.toLowerCase().includes(value)
      );
    });
  }, [search]);

  /* =======================================================
     LOGOUT
  ======================================================= */

  const handleLogout = () => {
    localStorage.removeItem("teamflow_current_user");
    localStorage.removeItem("teamflow_teamlead");
    localStorage.removeItem("teamflow_teamlead_logged_in");

    sessionStorage.removeItem("teamflow_current_user");
    sessionStorage.removeItem("teamflow_teamlead");

    navigate("/login");
  };

  return (
    <div className="tld-page">
      {/* ===================================================
          TOP NAVBAR
      =================================================== */}

      <header className="tld-topbar">
        <div className="tld-search-wrapper">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search tasks, projects, members..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />

          {search && (
            <button
              type="button"
              className="tld-search-clear"
              onClick={() => setSearch("")}
              aria-label="Clear search"
            >
              <X size={15} />
            </button>
          )}
        </div>

        <div className="tld-top-actions">
          {/* HELP */}

          <button
            type="button"
            className="tld-icon-button"
            title="Help"
            onClick={() => {
              setHelpOpen(true);
              setNotificationOpen(false);
              setProfileOpen(false);
            }}
          >
            <HelpCircle size={19} />
          </button>

          {/* NOTIFICATION */}

          <div className="tld-dropdown-container">
            <button
              type="button"
              className="tld-icon-button tld-notification-button"
              onClick={() => {
                setNotificationOpen(
                  (previous) => !previous
                );

                setProfileOpen(false);
              }}
            >
              <Bell size={19} />

              <span className="tld-notification-count">
                {NOTIFICATIONS.length}
              </span>
            </button>

            {notificationOpen && (
              <div className="tld-dropdown tld-notification-dropdown">
                <div className="tld-dropdown-heading">
                  <div>
                    <strong>Notifications</strong>
                    <span>
                      {NOTIFICATIONS.length} new updates
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setNotificationOpen(false)
                    }
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="tld-notification-list">
                  {NOTIFICATIONS.map((item) => (
                    <button
                      type="button"
                      className="tld-notification-item"
                      key={item.id}
                      onClick={() =>
                        setNotificationOpen(false)
                      }
                    >
                      <span className="tld-notification-dot" />

                      <span>
                        <strong>{item.title}</strong>
                        <small>{item.text}</small>
                        <em>{item.time}</em>
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* PROFILE */}

          <div className="tld-dropdown-container">
            <button
              type="button"
              className="tld-profile-button"
              onClick={() => {
                setProfileOpen(
                  (previous) => !previous
                );

                setNotificationOpen(false);
              }}
            >
              <span className="tld-profile-avatar">
                PS
              </span>

              <span className="tld-profile-information">
                <strong>Priya Sharma</strong>
                <small>Team Lead</small>
              </span>

              <ChevronDown size={16} />
            </button>

            {profileOpen && (
              <div className="tld-dropdown tld-profile-dropdown">
                <div className="tld-profile-dropdown-user">
                  <span className="tld-profile-large-avatar">
                    PS
                  </span>

                  <div>
                    <strong>Priya Sharma</strong>
                    <span>Team Lead</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setProfileOpen(false);
                    navigate("/teamlead/settings");
                  }}
                >
                  <Settings size={16} />
                  Settings
                </button>

                <button
                  type="button"
                  className="tld-logout-option"
                  onClick={handleLogout}
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ===================================================
          CONTENT
      =================================================== */}

      <main className="tld-content">
        {/* PAGE HEADER */}

        <section className="tld-welcome">
          <div>
            <span className="tld-eyebrow">
              TEAM LEAD DASHBOARD
            </span>

            <h1>
              Welcome back, <span>Priya!</span>
            </h1>

            <p>
              Here's what's happening with your team and
              projects today.
            </p>
          </div>

          <button
            type="button"
            className="tld-primary-button"
            onClick={() =>
              navigate("/teamlead/tasks")
            }
          >
            <CheckSquare size={17} />
            View Tasks
          </button>
        </section>

        {/* =================================================
            STATS
        ================================================= */}

        <section className="tld-stats-grid">
          <StatCard
            icon={Users}
            title="Team Members"
            value={stats.teamMembers}
            text="People in your team"
            type="purple"
            onClick={() =>
              navigate("/teamlead/team")
            }
          />

          <StatCard
            icon={FolderKanban}
            title="Active Projects"
            value={stats.activeProjects}
            text={`${PROJECTS.length} total projects`}
            type="blue"
            onClick={() =>
              navigate("/teamlead/projects")
            }
          />

          <StatCard
            icon={CheckSquare}
            title="Pending Tasks"
            value={stats.pendingTasks}
            text={`${TASKS.length} total tasks`}
            type="orange"
            onClick={() =>
              navigate("/teamlead/tasks")
            }
          />

          <StatCard
            icon={CheckCircle2}
            title="Completion"
            value={`${stats.completion}%`}
            text={`${TASKS.filter(
              (task) =>
                task.status === "Completed"
            ).length} tasks completed`}
            type="green"
            onClick={() =>
              navigate("/teamlead/tasks")
            }
          />
        </section>

        {/* =================================================
            PROJECTS + TEAM
        ================================================= */}

        <section className="tld-main-grid">
          {/* PROJECT PROGRESS */}

          <div className="tld-card">
            <CardHeader
              title="Project Progress"
              subtitle="Current progress of active team projects."
              buttonText="View All"
              onClick={() =>
                navigate("/teamlead/projects")
              }
            />

            <div className="tld-project-list">
              {PROJECTS.map((project) => (
                <button
                  type="button"
                  className="tld-project-row"
                  key={project.id}
                  onClick={() =>
                    navigate("/teamlead/projects")
                  }
                >
                  <div className="tld-project-icon">
                    <FolderKanban size={19} />
                  </div>

                  <div className="tld-project-info">
                    <div className="tld-project-title-row">
                      <div>
                        <strong>
                          {project.name}
                        </strong>

                        <span>
                          {project.members} members ·{" "}
                          {project.tasks} tasks
                        </span>
                      </div>

                      <span
                        className={`tld-project-status ${
                          project.status ===
                          "Completed"
                            ? "completed"
                            : ""
                        }`}
                      >
                        {project.status}
                      </span>
                    </div>

                    <div className="tld-progress-meta">
                      <span>Progress</span>
                      <strong>
                        {project.progress}%
                      </strong>
                    </div>

                    <div className="tld-progress-track">
                      <span
                        style={{
                          width: `${project.progress}%`,
                        }}
                      />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* TEAM AVAILABILITY */}

          <div className="tld-card">
            <CardHeader
              title="Team Availability"
              subtitle="Current availability of your team."
              buttonText="View Team"
              onClick={() =>
                navigate("/teamlead/team")
              }
            />

            <div className="tld-member-list">
              {MEMBERS.map((member) => (
                <button
                  type="button"
                  className="tld-member-row"
                  key={member.id}
                  onClick={() =>
                    navigate(
                      `/teamlead/member/${member.id}`
                    )
                  }
                >
                  <span className="tld-member-avatar">
                    {member.initials}
                  </span>

                  <span className="tld-member-info">
                    <strong>{member.name}</strong>
                    <small>{member.role}</small>
                  </span>

                  <span
                    className={`tld-member-status ${
                      member.status === "Away"
                        ? "away"
                        : ""
                    }`}
                  >
                    <i />
                    {member.status}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* =================================================
            RECENT TASKS
        ================================================= */}

        <section className="tld-card tld-tasks-card">
          <CardHeader
            title="Recent Tasks"
            subtitle={
              search
                ? `Showing results for "${search}"`
                : "Track your team's latest assigned tasks."
            }
            buttonText="View All"
            onClick={() =>
              navigate("/teamlead/tasks")
            }
          />

          <div className="tld-table-wrapper">
            <table className="tld-table">
              <thead>
                <tr>
                  <th>Task</th>
                  <th>Project</th>
                  <th>Assignee</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Due Date</th>
                </tr>
              </thead>

              <tbody>
                {filteredTasks.length > 0 ? (
                  filteredTasks.map((task) => (
                    <tr key={task.id}>
                      <td>
                        <strong>{task.task}</strong>
                      </td>

                      <td>{task.project}</td>

                      <td>
                        <div className="tld-table-user">
                          <span>
                            {getInitials(
                              task.assignee
                            )}
                          </span>

                          {task.assignee}
                        </div>
                      </td>

                      <td>
                        <span
                          className={`tld-priority ${task.priority.toLowerCase()}`}
                        >
                          {task.priority}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`tld-task-status ${task.status
                            .toLowerCase()
                            .replaceAll(" ", "-")}`}
                        >
                          {task.status}
                        </span>
                      </td>

                      <td>{task.dueDate}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="tld-empty-search"
                    >
                      No tasks found for "{search}".
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* =================================================
            BOTTOM SECTION
        ================================================= */}

        <section className="tld-bottom-grid">
          {/* UPCOMING */}

          <div className="tld-card">
            <CardHeader
              title="Upcoming"
              subtitle="Important events and deadlines."
            />

            <div className="tld-upcoming-list">
              <UpcomingItem
                icon={CalendarDays}
                title="Team Standup"
                text="Today · 11:00 AM"
                type="purple"
              />

              <UpcomingItem
                icon={Clock3}
                title="Dashboard UI Deadline"
                text="Oct 28 · TeamFlow AI - Web"
                type="orange"
              />

              <UpcomingItem
                icon={CalendarDays}
                title="Sprint Review"
                text="Oct 30 · 3:00 PM"
                type="blue"
              />
            </div>

            <button
              type="button"
              className="tld-text-button"
              onClick={() =>
                navigate("/teamlead/calendar")
              }
            >
              Open Calendar
            </button>
          </div>

          {/* QUICK ACTIONS */}

          <div className="tld-card">
            <CardHeader
              title="Quick Actions"
              subtitle="Jump directly to common actions."
            />

            <div className="tld-quick-grid">
              <QuickAction
                icon={CheckSquare}
                title="Manage Tasks"
                text="Create and assign tasks"
                onClick={() =>
                  navigate("/teamlead/tasks")
                }
              />

              <QuickAction
                icon={Users}
                title="Manage Team"
                text="View team members"
                onClick={() =>
                  navigate("/teamlead/team")
                }
              />

              <QuickAction
                icon={MessageCircle}
                title="Open Chat"
                text="Message your team"
                onClick={() =>
                  navigate("/teamlead/chat")
                }
              />

              <QuickAction
                icon={Sparkles}
                title="AI Assistant"
                text="Get AI-powered help"
                onClick={() =>
                  navigate(
                    "/teamlead/ai-assistant"
                  )
                }
              />
            </div>
          </div>
        </section>
      </main>

      {/* ===================================================
          HELP MODAL
      =================================================== */}

      {helpOpen && (
        <div
          className="tld-modal-backdrop"
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget
            ) {
              setHelpOpen(false);
            }
          }}
        >
          <div className="tld-help-modal">
            <button
              type="button"
              className="tld-modal-close"
              onClick={() => setHelpOpen(false)}
            >
              <X size={18} />
            </button>

            <span className="tld-help-icon">
              <HelpCircle size={27} />
            </span>

            <h2>Need help?</h2>

            <p>
              Access TeamFlow AI settings or contact
              support if you need help managing your
              workspace.
            </p>

            <div className="tld-help-actions">
              <button
                type="button"
                className="tld-primary-button"
                onClick={() => {
                  setHelpOpen(false);
                  navigate("/teamlead/settings");
                }}
              >
                <Settings size={16} />
                Open Settings
              </button>

              <button
                type="button"
                className="tld-secondary-button"
                onClick={() =>
                  setHelpOpen(false)
                }
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   STAT CARD COMPONENT
========================================================= */

function StatCard({
  icon: Icon,
  title,
  value,
  text,
  type,
  onClick,
}) {
  return (
    <button
      type="button"
      className="tld-stat-card"
      onClick={onClick}
    >
      <span
        className={`tld-stat-icon ${type}`}
      >
        <Icon size={21} />
      </span>

      <span className="tld-stat-content">
        <small>{title}</small>

        <strong>{value}</strong>

        <span>{text}</span>
      </span>
    </button>
  );
}

/* =========================================================
   CARD HEADER
========================================================= */

function CardHeader({
  title,
  subtitle,
  buttonText,
  onClick,
}) {
  return (
    <div className="tld-card-header">
      <div>
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>

      {buttonText && (
        <button
          type="button"
          onClick={onClick}
        >
          {buttonText}
        </button>
      )}
    </div>
  );
}

/* =========================================================
   UPCOMING ITEM
========================================================= */

function UpcomingItem({
  icon: Icon,
  title,
  text,
  type,
}) {
  return (
    <div className="tld-upcoming-item">
      <span
        className={`tld-upcoming-icon ${type}`}
      >
        <Icon size={18} />
      </span>

      <div>
        <strong>{title}</strong>
        <span>{text}</span>
      </div>
    </div>
  );
}

/* =========================================================
   QUICK ACTION
========================================================= */

function QuickAction({
  icon: Icon,
  title,
  text,
  onClick,
}) {
  return (
    <button
      type="button"
      className="tld-quick-action"
      onClick={onClick}
    >
      <span className="tld-quick-icon">
        <Icon size={20} />
      </span>

      <span>
        <strong>{title}</strong>
        <small>{text}</small>
      </span>
    </button>
  );
}

/* =========================================================
   INITIALS
========================================================= */

function getInitials(name) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default TeamLeadDashboard;