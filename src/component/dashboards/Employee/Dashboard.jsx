import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Search,
  Plus,
  ChevronDown,
  Sun,
  Moon,
  Bell,
  HelpCircle,
  CheckSquare,
  Timer,
  CircleCheckBig,
  Flame,
  CalendarDays,
  Sparkles,
  FolderKanban,
  Users,
  Bug,
  X,
  MoreHorizontal,
  Video,
  UserPlus,
  Check,
} from "lucide-react";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";

import AppSidebar from "./AppSidebar";
import "./Dashboard.css";

import {
  initialProjects,
  initialTasks,
  initialActivity,
  taskOverviewData,
  teamActivityData,
} from "./dashboardData";

const PIE_COLORS = ["#20c997", "#316BFF", "#A78BFA", "#FF4D67"];

function Dashboard() {
  const navigate = useNavigate();

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("tf_dark") === "true";
  });

  const [search, setSearch] = useState("");

  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tf_tasks");
    return saved ? JSON.parse(saved) : initialTasks;
  });

  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem("tf_projects");
    return saved ? JSON.parse(saved) : initialProjects;
  });

  const [activities, setActivities] = useState(initialActivity);

  const [workspaces, setWorkspaces] = useState(() => {
    const saved = localStorage.getItem("tf_workspaces");

    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 1,
            name: "TeamFlow Workspace",
          },
        ];
  });

  const [activeWorkspace, setActiveWorkspace] =
    useState("TeamFlow Workspace");

  const [workspaceOpen, setWorkspaceOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);

  const [modal, setModal] = useState(null);

  const [newWorkspace, setNewWorkspace] = useState("");
  const [newTask, setNewTask] = useState("");
  const [newProject, setNewProject] = useState("");

  useEffect(() => {
    localStorage.setItem("tf_dark", darkMode);
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem("tf_tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("tf_projects", JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem("tf_workspaces", JSON.stringify(workspaces));
  }, [workspaces]);

  const stats = useMemo(() => {
    const total = tasks.length;

    const completed = tasks.filter(
      (task) => task.status === "completed"
    ).length;

    const progress = tasks.filter(
      (task) => task.status === "progress"
    ).length;

    const overdue = tasks.filter((task) => task.overdue).length;

    return {
      total,
      completed,
      progress,
      overdue,
    };
  }, [tasks]);

  const projectProgressData = useMemo(() => {
    const completed = stats.completed;
    const progress = stats.progress;
    const overdue = stats.overdue;

    const todo = Math.max(
      stats.total - completed - progress - overdue,
      0
    );

    return [
      {
        name: "Completed",
        value: completed,
      },
      {
        name: "In Progress",
        value: progress,
      },
      {
        name: "To Do",
        value: todo,
      },
      {
        name: "Overdue",
        value: overdue,
      },
    ];
  }, [stats]);

  const completionPercent = stats.total
    ? Math.round((stats.completed / stats.total) * 100)
    : 0;

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(search.toLowerCase())
  );

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(search.toLowerCase())
  );

  const createWorkspace = () => {
    if (!newWorkspace.trim()) return;

    const workspace = {
      id: Date.now(),
      name: newWorkspace.trim(),
    };

    setWorkspaces((prev) => [...prev, workspace]);

    setActiveWorkspace(workspace.name);

    setActivities((prev) => [
      {
        id: Date.now(),
        user: "Alex Morgan",
        text: `created workspace ${workspace.name}`,
        time: "Just now",
      },
      ...prev,
    ]);

    setNewWorkspace("");
    setModal(null);
  };

  const createTask = () => {
    if (!newTask.trim()) return;

    const task = {
      id: Date.now(),
      title: newTask,
      project: activeWorkspace,
      status: "todo",
      priority: "Medium",
      due: "Today",
      overdue: false,
    };

    setTasks((prev) => [task, ...prev]);

    setActivities((prev) => [
      {
        id: Date.now(),
        user: "Alex Morgan",
        text: `created task ${newTask}`,
        time: "Just now",
      },
      ...prev,
    ]);

    setNewTask("");
    setModal(null);
  };

  const createProject = () => {
    if (!newProject.trim()) return;

    const project = {
      id: Date.now(),
      name: newProject,
      type: "New Project",
      tasks: 0,
      progress: 0,
    };

    setProjects((prev) => [project, ...prev]);

    setActivities((prev) => [
      {
        id: Date.now(),
        user: "Alex Morgan",
        text: `created project ${newProject}`,
        time: "Just now",
      },
      ...prev,
    ]);

    setNewProject("");
    setModal(null);
  };

  const completeTask = (id) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? {
              ...task,
              status:
                task.status === "completed"
                  ? "todo"
                  : "completed",
            }
          : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  return (
    <div
      className={`dashboard-shell ${
        darkMode ? "dashboard-dark" : ""
      }`}
    >
      <AppSidebar />

      <main className="dashboard-main">
        {/* TOPBAR */}

        <header className="dashboard-topbar">
          <div className="topbar-workspace-area">
            <div className="workspace-dropdown-wrapper">
              <button
                className="workspace-button"
                onClick={() =>
                  setWorkspaceOpen((prev) => !prev)
                }
              >
                <span className="workspace-avatar">TW</span>

                <span>{activeWorkspace}</span>

                <ChevronDown size={16} />
              </button>

              {workspaceOpen && (
                <div className="workspace-menu">
                  <div className="workspace-menu-title">
                    Workspaces
                  </div>

                  {workspaces.map((workspace) => (
                    <button
                      key={workspace.id}
                      onClick={() => {
                        setActiveWorkspace(workspace.name);
                        setWorkspaceOpen(false);
                      }}
                    >
                      <span className="workspace-small-icon">
                        {workspace.name
                          .substring(0, 2)
                          .toUpperCase()}
                      </span>

                      {workspace.name}

                      {activeWorkspace === workspace.name && (
                        <Check size={16} />
                      )}
                    </button>
                  ))}

                  <button
                    className="create-workspace-option"
                    onClick={() => {
                      setModal("workspace");
                      setWorkspaceOpen(false);
                    }}
                  >
                    <Plus size={17} />
                    Create Workspace
                  </button>
                </div>
              )}
            </div>

            <div className="dashboard-search">
              <Search size={18} />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search tasks, projects, people or files..."
              />
            </div>

            <div className="create-wrapper">
              <button
                className="create-main-button"
                onClick={() =>
                  setCreateOpen((prev) => !prev)
                }
              >
                <Plus size={18} />
                Create
                <ChevronDown size={15} />
              </button>

              {createOpen && (
                <div className="create-menu">
                  <button onClick={() => setModal("task")}>
                    <CheckSquare size={17} />
                    New Task
                  </button>

                  <button onClick={() => setModal("project")}>
                    <FolderKanban size={17} />
                    New Project
                  </button>

                  <button
                    onClick={() => setModal("workspace")}
                  >
                    <Users size={17} />
                    New Workspace
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="topbar-actions">
            <button
              className="icon-button"
              onClick={() => setDarkMode(!darkMode)}
              title="Toggle theme"
            >
              {darkMode ? (
                <Sun size={19} />
              ) : (
                <Moon size={19} />
              )}
            </button>

            <button className="icon-button notification-button">
              <Bell size={19} />
              <span>3</span>
            </button>

            <button className="icon-button">
              <HelpCircle size={19} />
            </button>

            <button className="profile-button">
              <span className="profile-avatar">AM</span>

              <span>
                <strong>Alex Morgan</strong>
                <small>Product Designer</small>
              </span>

              <ChevronDown size={15} />
            </button>
          </div>
        </header>

        <section className="dashboard-content">
          {/* HERO */}

          <section className="dashboard-hero">
            <div className="hero-content">
              <h1>
                Good morning,{" "}
                <span>Alex Morgan</span> 👋
              </h1>

              <p>
                Here's what's happening in{" "}
                <strong>{activeWorkspace}</strong> today.
              </p>

              <div className="hero-actions">
                <button onClick={() => setModal("task")}>
                  <Plus size={16} />
                  Create Task
                </button>

                <button onClick={() => setModal("project")}>
                  <FolderKanban size={16} />
                  New Project
                </button>

                <button>
                  <CalendarDays size={16} />
                  Schedule Meeting
                </button>

                <button
                  onClick={() => navigate("/employee/ai-assistant")}
                >
                  <Sparkles size={16} />
                  Ask TeamFlow AI
                </button>
              </div>
            </div>

            <div className="hero-ai">
              <div className="ai-orbit"></div>

              <div className="ai-bot">
                <Sparkles size={31} />
                <strong>AI</strong>
              </div>

              <div className="ai-message">
                Turn your ideas into progress.
                TeamFlow AI keeps your work organized,
                collaborative and efficient.
              </div>
            </div>

            <div className="hero-time">
              <CalendarDays size={18} />

              <span>Friday, 23 Oct 2026</span>

              <strong>11:26 AM</strong>

              <small>Have a productive day! ☀️</small>
            </div>
          </section>

          {/* STATS */}

          <section className="stats-grid">
            <StatCard
              icon={<CheckSquare />}
              title="Total Tasks"
              value={stats.total}
              text="↑ 12% from last week"
              type="purple"
            />

            <StatCard
              icon={<Timer />}
              title="In Progress"
              value={stats.progress}
              text="↓ 4% from last week"
              type="orange"
            />

            <StatCard
              icon={<CircleCheckBig />}
              title="Completed"
              value={stats.completed}
              text="↑ 22% from last week"
              type="green"
            />

            <StatCard
              icon={<Flame />}
              title="Overdue"
              value={stats.overdue}
              text="Needs attention"
              type="red"
            />
          </section>

          {/* CHART ROW */}

          <section className="analytics-grid">
            {/* PROJECT PROGRESS */}

            <div className="dashboard-card progress-card">
              <CardHeader
                title="Project Progress"
                icon={<FolderKanban size={19} />}
              />

              <div className="progress-chart-area">
                <div className="donut-wrapper">
                  <ResponsiveContainer width="100%" height={230}>
                    <PieChart>
                      <Pie
                        data={projectProgressData}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={65}
                        outerRadius={90}
                        paddingAngle={2}
                      >
                        {projectProgressData.map(
                          (_, index) => (
                            <Cell
                              key={index}
                              fill={
                                PIE_COLORS[
                                  index % PIE_COLORS.length
                                ]
                              }
                            />
                          )
                        )}
                      </Pie>

                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>

                  <div className="donut-center">
                    <strong>
                      {completionPercent}%
                    </strong>
                    <span>Completed</span>
                  </div>
                </div>

                <div className="progress-legend">
                  {projectProgressData.map(
                    (item, index) => (
                      <div key={item.name}>
                        <span
                          className="legend-dot"
                          style={{
                            background:
                              PIE_COLORS[index],
                          }}
                        />

                        <span>{item.name}</span>

                        <strong>{item.value}</strong>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* TEAM ACTIVITY */}

            <div className="dashboard-card">
              <CardHeader
                title="Team Activity"
                icon={<Users size={19} />}
              />

              <div className="chart-container">
                <ResponsiveContainer width="100%" height={245}>
                  <LineChart data={teamActivityData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                    />

                    <XAxis dataKey="day" />

                    <YAxis />

                    <Tooltip />

                    <Legend />

                    <Line
                      type="monotone"
                      dataKey="tasks"
                      stroke="#5F4BFF"
                      strokeWidth={3}
                      dot={false}
                    />

                    <Line
                      type="monotone"
                      dataKey="comments"
                      stroke="#C050F8"
                      strokeWidth={3}
                      dot={false}
                    />

                    <Line
                      type="monotone"
                      dataKey="files"
                      stroke="#FF981F"
                      strokeWidth={3}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* TASK OVERVIEW */}

            <div className="dashboard-card">
              <CardHeader
                title="Task Overview"
                icon={<CheckSquare size={19} />}
              />

              <div className="chart-container">
                <ResponsiveContainer width="100%" height={245}>
                  <BarChart data={taskOverviewData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                    />

                    <XAxis dataKey="day" />

                    <YAxis />

                    <Tooltip />

                    <Legend />

                    <Bar
                      dataKey="created"
                      fill="#6548FF"
                      radius={[5, 5, 0, 0]}
                    />

                    <Bar
                      dataKey="progress"
                      fill="#FF981F"
                      radius={[5, 5, 0, 0]}
                    />

                    <Bar
                      dataKey="completed"
                      fill="#18C57B"
                      radius={[5, 5, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </section>

          {/* LOWER GRID */}

          <section className="lower-grid">
            {/* PROJECTS */}

            <div className="dashboard-card">
              <CardHeader
                title="Recent Projects"
                icon={<FolderKanban size={19} />}
              />

              <div className="project-list">
                {filteredProjects.map((project) => (
                  <div
                    className="project-row"
                    key={project.id}
                  >
                    <div className="project-icon">
                      <FolderKanban size={18} />
                    </div>

                    <div className="project-info">
                      <strong>{project.name}</strong>

                      <span>
                        {project.type} · {project.tasks} tasks
                      </span>
                    </div>

                    <div className="project-progress-bar">
                      <span
                        style={{
                          width: `${project.progress}%`,
                        }}
                      />
                    </div>

                    <strong>{project.progress}%</strong>

                    <MoreHorizontal size={18} />
                  </div>
                ))}
              </div>
            </div>

            {/* TASKS */}

            <div className="dashboard-card">
              <CardHeader
                title="Upcoming Tasks"
                icon={<CalendarDays size={19} />}
              />

              <div className="task-list">
                {filteredTasks.slice(0, 6).map((task) => (
                  <div
                    className={`task-row ${
                      task.status === "completed"
                        ? "task-completed"
                        : ""
                    }`}
                    key={task.id}
                  >
                    <button
                      className="task-checkbox"
                      onClick={() =>
                        completeTask(task.id)
                      }
                    >
                      {task.status === "completed" && (
                        <Check size={14} />
                      )}
                    </button>

                    <div className="task-info">
                      <strong>{task.title}</strong>

                      <span>{task.project}</span>
                    </div>

                    <span
                      className={`priority ${task.priority.toLowerCase()}`}
                    >
                      {task.priority}
                    </span>

                    <span className="task-date">
                      {task.due}
                    </span>

                    <button
                      className="task-delete"
                      onClick={() => deleteTask(task.id)}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* QUICK ACTIONS */}

            <div className="dashboard-card">
              <CardHeader
                title="Quick Actions"
                icon={<Sparkles size={19} />}
              />

              <div className="quick-actions-grid">
                <QuickAction
                  icon={<FolderKanban />}
                  title="New Project"
                  onClick={() => setModal("project")}
                />

                <QuickAction
                  icon={<CheckSquare />}
                  title="New Task"
                  onClick={() => setModal("task")}
                />

                <QuickAction
                  icon={<Bug />}
                  title="Report Bug"
                  onClick={() => navigate("/employee/bugs")}
                />

                <QuickAction
                  icon={<UserPlus />}
                  title="Invite Member"
                  onClick={() => navigate("/employee/team")}
                />

                <QuickAction
                  icon={<Sparkles />}
                  title="Ask AI"
                  onClick={() =>
                    navigate("/employee/ai-assistant")
                  }
                />

                <QuickAction
                  icon={<CalendarDays />}
                  title="Schedule Meeting"
                />
              </div>

              <div className="meeting-section">
                <div className="meeting-title">
                  <Video size={18} />
                  Upcoming Meeting
                </div>

                <div className="meeting-card">
                  <div>
                    <strong>Sprint Planning</strong>
                    <span>10:00 AM - 11:00 AM</span>
                  </div>

                  <button>Join</button>
                </div>
              </div>
            </div>
          </section>

          {/* ACTIVITY FEED */}

          <section className="dashboard-card activity-feed">
            <CardHeader
              title="Recent Team Activity"
              icon={<Users size={19} />}
            />

            {activities.slice(0, 5).map((activity) => (
              <div
                className="activity-row"
                key={activity.id}
              >
                <div className="activity-avatar">
                  {activity.user
                    .split(" ")
                    .map((name) => name[0])
                    .join("")}
                </div>

                <div>
                  <strong>{activity.user}</strong>

                  <span>{activity.text}</span>
                </div>

                <small>{activity.time}</small>
              </div>
            ))}
          </section>
        </section>
      </main>

      {/* MODAL */}

      {modal && (
        <div
          className="modal-overlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              setModal(null);
            }
          }}
        >
          <div className="dashboard-modal">
            <button
              className="modal-close"
              onClick={() => setModal(null)}
            >
              <X size={20} />
            </button>

            {modal === "workspace" && (
              <>
                <div className="modal-icon">
                  <Users />
                </div>

                <h2>Create Workspace</h2>

                <p>
                  Create a new workspace for your team,
                  project or organization.
                </p>

                <input
                  autoFocus
                  value={newWorkspace}
                  onChange={(e) =>
                    setNewWorkspace(e.target.value)
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      createWorkspace();
                    }
                  }}
                  placeholder="Workspace name"
                />

                <button
                  className="modal-primary"
                  onClick={createWorkspace}
                >
                  <Plus size={17} />
                  Create Workspace
                </button>
              </>
            )}

            {modal === "task" && (
              <>
                <div className="modal-icon">
                  <CheckSquare />
                </div>

                <h2>Create Task</h2>

                <p>
                  Add a new task to your current workspace.
                </p>

                <input
                  autoFocus
                  value={newTask}
                  onChange={(e) =>
                    setNewTask(e.target.value)
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      createTask();
                    }
                  }}
                  placeholder="Task title"
                />

                <button
                  className="modal-primary"
                  onClick={createTask}
                >
                  <Plus size={17} />
                  Create Task
                </button>
              </>
            )}

            {modal === "project" && (
              <>
                <div className="modal-icon">
                  <FolderKanban />
                </div>

                <h2>Create Project</h2>

                <p>
                  Start a new project inside{" "}
                  {activeWorkspace}.
                </p>

                <input
                  autoFocus
                  value={newProject}
                  onChange={(e) =>
                    setNewProject(e.target.value)
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      createProject();
                    }
                  }}
                  placeholder="Project name"
                />

                <button
                  className="modal-primary"
                  onClick={createProject}
                >
                  <Plus size={17} />
                  Create Project
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  icon,
  title,
  value,
  text,
  type,
}) {
  return (
    <div className={`stat-card ${type}`}>
      <div className="stat-icon">{icon}</div>

      <div className="stat-main">
        <span>{title}</span>
        <strong>{value}</strong>
        <small>{text}</small>
      </div>

      <div className="mini-chart">
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>
    </div>
  );
}

function CardHeader({ title, icon }) {
  return (
    <div className="card-header">
      <div>
        {icon}
        <h3>{title}</h3>
      </div>

      <button>
        <MoreHorizontal size={19} />
      </button>
    </div>
  );
}

function QuickAction({ icon, title, onClick }) {
  return (
    <button
      className="quick-action"
      onClick={onClick}
    >
      <span>{icon}</span>
      <strong>{title}</strong>
    </button>
  );
}

export default Dashboard;