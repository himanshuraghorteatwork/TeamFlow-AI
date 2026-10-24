import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import {
  Search,
  Plus,
  ChevronDown,
  Moon,
  Sun,
  Bell,
  CircleHelp,
  Users,
  Building2,
  FolderKanban,
  ListChecks,
  DollarSign,
  Bot,
  Activity,
  ArrowUpRight,
  RefreshCw,
  Settings,
  LogOut,
  X,
  CheckCircle2,
  CreditCard,
  Zap,
  TrendingUp,
} from "lucide-react";

import AdminSidebar from "../../../layouts/AdminSidebar/AdminSidebar.jsx";

import {
  fallbackUsers,
  fallbackWorkspaces,
  fallbackProjects,
  fallbackTasks,
  fallbackTransactions,
  fallbackGrowth,
  systemHealth,
} from "./adminDashboardData.js";

import "./AdminDashboard.css";

/* =========================================================
   LOCAL STORAGE
========================================================= */

function readStorage(keys, fallback) {
  for (const key of keys) {
    try {
      const value = localStorage.getItem(key);

      if (value) {
        const parsed = JSON.parse(value);

        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch {
      // Try next storage key.
    }
  }

  return fallback;
}

/* =========================================================
   LINE CHART
========================================================= */

function LineChart({ data }) {
  const width = 650;
  const height = 210;

  const paddingX = 28;
  const paddingTop = 20;
  const paddingBottom = 25;

  const [hovered, setHovered] = useState(null);

  const maxValue = Math.max(
    ...data.flatMap((item) => [
      Number(item.users || 0),
      Number(item.active || 0),
    ]),
    1
  );

  const getPoint = (item, index, key) => {
    const x =
      paddingX +
      (index * (width - paddingX * 2)) /
        Math.max(data.length - 1, 1);

    const y =
      height -
      paddingBottom -
      (Number(item[key] || 0) / maxValue) *
        (height - paddingTop - paddingBottom);

    return {
      x,
      y,
    };
  };

  const createPoints = (key) =>
    data
      .map((item, index) => {
        const point = getPoint(
          item,
          index,
          key
        );

        return `${point.x},${point.y}`;
      })
      .join(" ");

  return (
    <div className="tf-live-line-chart">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
      >
        {[0, 1, 2, 3].map((line) => {
          const y = 40 + line * 42;

          return (
            <line
              key={line}
              x1="0"
              x2={width}
              y1={y}
              y2={y}
              className="tf-chart-grid-line"
            />
          );
        })}

        <polyline
          points={createPoints("users")}
          className="tf-users-line"
        />

        <polyline
          points={createPoints("active")}
          className="tf-active-line"
        />

        {data.map((item, index) => {
          const usersPoint = getPoint(
            item,
            index,
            "users"
          );

          const activePoint = getPoint(
            item,
            index,
            "active"
          );

          return (
            <React.Fragment key={item.label}>
              <circle
                cx={usersPoint.x}
                cy={usersPoint.y}
                r="5"
                className="tf-users-point"
                onMouseEnter={() =>
                  setHovered({
                    ...item,
                    x: usersPoint.x,
                    y: usersPoint.y,
                  })
                }
                onMouseLeave={() =>
                  setHovered(null)
                }
              >
                <title>
                  {item.label}: {item.users} users
                </title>
              </circle>

              <circle
                cx={activePoint.x}
                cy={activePoint.y}
                r="4"
                className="tf-active-point"
                onMouseEnter={() =>
                  setHovered({
                    ...item,
                    x: activePoint.x,
                    y: activePoint.y,
                  })
                }
                onMouseLeave={() =>
                  setHovered(null)
                }
              >
                <title>
                  {item.label}: {item.active} active
                </title>
              </circle>
            </React.Fragment>
          );
        })}

        {hovered && (
          <g className="tf-svg-tooltip">
            <rect
              x={Math.min(
                hovered.x + 8,
                520
              )}
              y={Math.max(
                hovered.y - 58,
                5
              )}
              width="115"
              height="48"
              rx="7"
            />

            <text
              x={Math.min(
                hovered.x + 18,
                530
              )}
              y={Math.max(
                hovered.y - 39,
                24
              )}
            >
              {hovered.label}
            </text>

            <text
              x={Math.min(
                hovered.x + 18,
                530
              )}
              y={Math.max(
                hovered.y - 23,
                40
              )}
            >
              Users: {hovered.users}
            </text>

            <text
              x={Math.min(
                hovered.x + 18,
                530
              )}
              y={Math.max(
                hovered.y - 9,
                54
              )}
            >
              Active: {hovered.active}
            </text>
          </g>
        )}
      </svg>

      <div className="tf-chart-labels">
        {data.map((item) => (
          <span key={item.label}>
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
}

/* =========================================================
   DONUT CHART
========================================================= */

function DonutChart({ workspaces }) {
  const [selectedSegment, setSelectedSegment] =
    useState(null);

  const distribution = useMemo(() => {
    const result = {};

    workspaces.forEach((workspace) => {
      const category =
        workspace.category ||
        workspace.type ||
        "Other";

      result[category] =
        (result[category] || 0) + 1;
    });

    return Object.entries(result);
  }, [workspaces]);

  const total = Math.max(
    workspaces.length,
    1
  );

  let offset = 0;

  const segments = distribution.map(
    ([name, value], index) => {
      const percentage =
        (value / total) * 100;

      const segment = {
        name,
        value,
        percentage,
        offset,
        index,
      };

      offset += percentage;

      return segment;
    }
  );

  const selected = segments.find(
    (segment) =>
      segment.name === selectedSegment
  );

  return (
    <div className="tf-workspace-distribution">
      <div className="tf-donut-wrapper">
        <svg viewBox="0 0 42 42">
          <circle
            cx="21"
            cy="21"
            r="15.9155"
            className="tf-donut-background"
          />

          {segments.map((segment) => (
            <circle
              key={segment.name}
              cx="21"
              cy="21"
              r="15.9155"
              className={`tf-donut-segment tf-donut-${
                segment.index % 6
              } ${
                selectedSegment ===
                segment.name
                  ? "selected"
                  : ""
              }`}
              strokeDasharray={`${
                segment.percentage
              } ${
                100 -
                segment.percentage
              }`}
              strokeDashoffset={
                -segment.offset
              }
              onMouseEnter={() =>
                setSelectedSegment(
                  segment.name
                )
              }
              onMouseLeave={() =>
                setSelectedSegment(null)
              }
            >
              <title>
                {segment.name}:{" "}
                {segment.value} (
                {segment.percentage.toFixed(
                  1
                )}
                %)
              </title>
            </circle>
          ))}
        </svg>

        <div className="tf-donut-center">
          {selected ? (
            <>
              <strong>
                {selected.value}
              </strong>

              <span>
                {selected.name}
              </span>
            </>
          ) : (
            <>
              <strong>
                {workspaces.length}
              </strong>

              <span>
                Workspaces
              </span>
            </>
          )}
        </div>
      </div>

      <div className="tf-donut-legend">
        {segments.map((segment) => (
          <div
            key={segment.name}
            onMouseEnter={() =>
              setSelectedSegment(
                segment.name
              )
            }
            onMouseLeave={() =>
              setSelectedSegment(null)
            }
          >
            <span
              className={`tf-legend-dot tf-legend-${
                segment.index % 6
              }`}
            />

            <span>
              {segment.name}
            </span>

            <strong>
              {segment.value}
            </strong>
          </div>
        ))}
      </div>
    </div>
  );
}

/* =========================================================
   ACTIVITY CHART
========================================================= */

function ActivityChart({ data }) {
  const [hoveredDay, setHoveredDay] =
    useState(null);

  const max = Math.max(
    ...data.map(
      (item) =>
        Number(item.completed || 0) +
        Number(item.progress || 0) +
        Number(item.todo || 0)
    ),
    1
  );

  return (
    <div className="tf-activity-chart">
      {data.map((item) => {
        const total =
          Number(item.completed || 0) +
          Number(item.progress || 0) +
          Number(item.todo || 0);

        const height =
          (total / max) * 100;

        return (
          <div
            className="tf-activity-column"
            key={item.label}
            onMouseEnter={() =>
              setHoveredDay(item.label)
            }
            onMouseLeave={() =>
              setHoveredDay(null)
            }
          >
            <div
              className={`tf-activity-stack ${
                hoveredDay === item.label
                  ? "active"
                  : ""
              }`}
              style={{
                height: `${Math.max(
                  height,
                  10
                )}%`,
              }}
            >
              <span
                className="tf-activity-completed"
                style={{
                  flex:
                    item.completed ||
                    0.1,
                }}
              />

              <span
                className="tf-activity-progress"
                style={{
                  flex:
                    item.progress ||
                    0.1,
                }}
              />

              <span
                className="tf-activity-todo"
                style={{
                  flex:
                    item.todo ||
                    0.1,
                }}
              />
            </div>

            <small>
              {item.label}
            </small>

            {hoveredDay ===
              item.label && (
              <div className="tf-bar-tooltip">
                <strong>
                  {item.label}
                </strong>

                <span>
                  Completed:{" "}
                  {item.completed}
                </span>

                <span>
                  In progress:{" "}
                  {item.progress}
                </span>

                <span>
                  To do: {item.todo}
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* =========================================================
   MAIN DASHBOARD
========================================================= */

function AdminDashboard() {
  const navigate = useNavigate();
  const searchRef = useRef(null);

  const [search, setSearch] =
    useState("");

  const [showSearch, setShowSearch] =
    useState(false);

  const [createOpen, setCreateOpen] =
    useState(false);

  const [
    notificationOpen,
    setNotificationOpen,
  ] = useState(false);

  const [profileOpen, setProfileOpen] =
    useState(false);

  const [darkMode, setDarkMode] =
    useState(false);

  const [period, setPeriod] =
    useState("30");

  const [lastUpdated, setLastUpdated] =
    useState(new Date());

  const [dataVersion, setDataVersion] =
    useState(0);

  const [
    notifications,
    setNotifications,
  ] = useState([
    {
      id: 1,
      text: "New workspace created",
      time: "2 min ago",
      read: false,
    },
    {
      id: 2,
      text: "Enterprise payment received",
      time: "18 min ago",
      read: false,
    },
    {
      id: 3,
      text: "New user joined TeamFlow AI",
      time: "42 min ago",
      read: false,
    },
  ]);

  /* =======================================================
     LIVE DATA
  ======================================================= */

  const users = useMemo(
    () =>
      readStorage(
        [
          "teamflow_admin_users",
          "teamflow_users",
        ],
        fallbackUsers
      ),
    [dataVersion]
  );

  const workspaces = useMemo(
    () =>
      readStorage(
        [
          "teamflow_admin_workspaces",
          "teamflow_workspaces",
        ],
        fallbackWorkspaces
      ),
    [dataVersion]
  );

  const projects = useMemo(
    () =>
      readStorage(
        [
          "teamflow_projects",
          "teamflow_admin_projects",
        ],
        fallbackProjects
      ),
    [dataVersion]
  );

  const tasks = useMemo(() => {
    const directTasks = readStorage(
      ["teamflow_admin_tasks"],
      []
    );

    if (directTasks.length) {
      return directTasks;
    }

    const projectTasks =
      projects.flatMap((project) =>
        Array.isArray(project.tasks)
          ? project.tasks
          : []
      );

    return projectTasks.length
      ? projectTasks
      : fallbackTasks;
  }, [projects, dataVersion]);

  const transactions = useMemo(
    () =>
      readStorage(
        [
          "teamflow_admin_transactions",
        ],
        fallbackTransactions
      ),
    [dataVersion]
  );

  /* =======================================================
     KPI
  ======================================================= */

  const revenue = useMemo(
    () =>
      transactions
        .filter(
          (transaction) =>
            String(
              transaction.status
            ).toLowerCase() ===
            "paid"
        )
        .reduce(
          (sum, transaction) =>
            sum +
            Number(
              transaction.amount || 0
            ),
          0
        ),
    [transactions]
  );

  const aiCredits = useMemo(() => {
    try {
      const tools = JSON.parse(
        localStorage.getItem(
          "teamflow_admin_ai_tools"
        ) || "[]"
      );

      if (!Array.isArray(tools)) {
        return 0;
      }

      return tools.reduce(
        (sum, tool) =>
          sum +
          Number(
            tool.requests ||
              tool.usage ||
              0
          ),
        0
      );
    } catch {
      return 0;
    }
  }, [dataVersion]);

  const completedTasks =
    tasks.filter(
      (task) =>
        String(task.status)
          .trim()
          .toLowerCase() ===
        "completed"
    ).length;

  const activeProjects =
    projects.filter(
      (project) =>
        String(project.status)
          .trim()
          .toLowerCase() !==
        "completed"
    ).length;

  /* =======================================================
     USER GROWTH
  ======================================================= */

  const growthData = useMemo(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem(
          "teamflow_admin_growth"
        ) || "[]"
      );

      if (
        Array.isArray(saved) &&
        saved.length
      ) {
        return saved;
      }
    } catch {
      // Use fallback.
    }

    const multiplier =
      period === "7"
        ? 0.85
        : period === "90"
          ? 1.18
          : 1;

    return fallbackGrowth.map(
      (item) => ({
        ...item,

        users: Math.round(
          item.users * multiplier
        ),

        active: Math.round(
          item.active * multiplier
        ),
      })
    );
  }, [period, dataVersion]);

  /* =======================================================
     PROJECT ACTIVITY
  ======================================================= */

  const liveProjectActivity =
    useMemo(() => {
      try {
        const saved = JSON.parse(
          localStorage.getItem(
            "teamflow_admin_project_activity"
          ) || "[]"
        );

        if (
          Array.isArray(saved) &&
          saved.length
        ) {
          return saved;
        }
      } catch {
        // Generate from tasks.
      }

      const completed =
        tasks.filter(
          (task) =>
            String(task.status)
              .trim()
              .toLowerCase() ===
            "completed"
        ).length;

      const progress =
        tasks.filter((task) => {
          const status = String(
            task.status
          )
            .trim()
            .toLowerCase();

          return (
            status ===
              "in progress" ||
            status === "progress"
          );
        }).length;

      const todo =
        tasks.filter((task) => {
          const status = String(
            task.status
          )
            .trim()
            .toLowerCase();

          return [
            "to do",
            "todo",
            "pending",
            "review",
          ].includes(status);
        }).length;

      const labels = [
        "Mon",
        "Tue",
        "Wed",
        "Thu",
        "Fri",
        "Sat",
        "Sun",
      ];

      const factors = [
        0.55,
        0.68,
        0.61,
        0.82,
        0.7,
        0.9,
        1,
      ];

      return labels.map(
        (label, index) => ({
          label,

          completed: Math.max(
            1,
            Math.round(
              completed *
                factors[index]
            )
          ),

          progress: Math.max(
            1,
            Math.round(
              progress *
                factors[index]
            )
          ),

          todo: Math.max(
            1,
            Math.round(
              todo *
                factors[index]
            )
          ),
        })
      );
    }, [tasks, dataVersion]);

  /* =======================================================
     SEARCH
  ======================================================= */

  const searchItems = [
    {
      title: "Users",
      subtitle: `${users.length} users`,
      path: "/admin/users",
    },
    {
      title: "Workspaces",
      subtitle: `${workspaces.length} workspaces`,
      path: "/admin/workspaces",
    },
    {
      title: "Projects",
      subtitle: `${projects.length} projects`,
      path: "/admin/projects",
    },
    {
      title: "Tasks",
      subtitle: `${tasks.length} tasks`,
      path: "/admin/tasks",
    },
    {
      title: "Analytics",
      subtitle: "Platform analytics",
      path: "/admin/analytics",
    },
    {
      title: "Billing",
      subtitle: "Billing & payments",
      path: "/admin/billing",
    },
    {
      title: "Reports",
      subtitle: "Platform reports",
      path: "/admin/reports",
    },
    {
      title: "Settings",
      subtitle: "Platform settings",
      path: "/admin/settings",
    },
  ];

  const filteredSearch =
    search.trim() === ""
      ? []
      : searchItems.filter((item) =>
          `${item.title} ${item.subtitle}`
            .toLowerCase()
            .includes(
              search.toLowerCase()
            )
        );

  /* =======================================================
     REFRESH
  ======================================================= */

  const refreshDashboard = () => {
    setDataVersion(
      (value) => value + 1
    );

    setLastUpdated(new Date());
  };

  useEffect(() => {
    const handleStorage = () => {
      refreshDashboard();
    };

    window.addEventListener(
      "storage",
      handleStorage
    );

    const interval = setInterval(
      refreshDashboard,
      15000
    );

    return () => {
      window.removeEventListener(
        "storage",
        handleStorage
      );

      clearInterval(interval);
    };
  }, []);

  /* =======================================================
     KEYBOARD
  ======================================================= */

  useEffect(() => {
    const handleKey = (event) => {
      if (
        (event.ctrlKey ||
          event.metaKey) &&
        event.key.toLowerCase() ===
          "k"
      ) {
        event.preventDefault();

        searchRef.current?.focus();
        setShowSearch(true);
      }

      if (event.key === "Escape") {
        setShowSearch(false);
        setCreateOpen(false);
        setNotificationOpen(false);
        setProfileOpen(false);
      }
    };

    window.addEventListener(
      "keydown",
      handleKey
    );

    return () =>
      window.removeEventListener(
        "keydown",
        handleKey
      );
  }, []);

  /* =======================================================
     ACTIONS
  ======================================================= */

  const goTo = (path) => {
    setCreateOpen(false);
    setNotificationOpen(false);
    setProfileOpen(false);
    setShowSearch(false);

    navigate(path);
  };

  const unreadCount =
    notifications.filter(
      (item) => !item.read
    ).length;

  const markAllRead = () => {
    setNotifications((current) =>
      current.map((item) => ({
        ...item,
        read: true,
      }))
    );
  };

  const logout = () => {
    localStorage.removeItem(
      "teamflow_admin"
    );

    localStorage.removeItem(
      "teamflow_admin_logged_in"
    );

    sessionStorage.removeItem(
      "teamflow_admin"
    );

    navigate("/login");
  };

  return (
    <div
      className={`tf-admin-dashboard ${
        darkMode
          ? "tf-admin-dashboard-dark"
          : ""
      }`}
    >
      <AdminSidebar />

      <div className="tf-admin-dashboard-main">
        {/* TOP BAR */}

        <header className="tf-admin-topbar">
          <div className="tf-admin-search-wrap">
            <div className="tf-admin-search">
              <Search size={18} />

              <input
                ref={searchRef}
                value={search}
                placeholder="Search users, workspaces, projects, or anything..."
                onFocus={() =>
                  setShowSearch(true)
                }
                onChange={(event) => {
                  setSearch(
                    event.target.value
                  );

                  setShowSearch(true);
                }}
              />

              {search ? (
                <button
                  type="button"
                  onClick={() =>
                    setSearch("")
                  }
                >
                  <X size={15} />
                </button>
              ) : (
                <kbd>Ctrl + K</kbd>
              )}
            </div>

            {showSearch &&
              search && (
                <div className="tf-search-results">
                  {filteredSearch.length ? (
                    filteredSearch.map(
                      (item) => (
                        <button
                          key={
                            item.path
                          }
                          type="button"
                          onClick={() =>
                            goTo(
                              item.path
                            )
                          }
                        >
                          <Search
                            size={16}
                          />

                          <span>
                            <strong>
                              {
                                item.title
                              }
                            </strong>

                            <small>
                              {
                                item.subtitle
                              }
                            </small>
                          </span>

                          <ArrowUpRight
                            size={14}
                          />
                        </button>
                      )
                    )
                  ) : (
                    <p>
                      No matching
                      results
                    </p>
                  )}
                </div>
              )}
          </div>

          <div className="tf-topbar-actions">
            {/* CREATE */}

            <div className="tf-dropdown-wrap">
              <button
                type="button"
                className="tf-create-btn"
                onClick={() => {
                  setCreateOpen(
                    !createOpen
                  );

                  setNotificationOpen(
                    false
                  );

                  setProfileOpen(false);
                }}
              >
                <Plus size={18} />
                Create
                <ChevronDown
                  size={15}
                />
              </button>

              {createOpen && (
                <div className="tf-create-menu">
                  <button
                    type="button"
                    onClick={() =>
                      goTo(
                        "/admin/workspaces"
                      )
                    }
                  >
                    <Building2
                      size={17}
                    />
                    Workspace
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      goTo(
                        "/admin/users"
                      )
                    }
                  >
                    <Users size={17} />
                    User
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      goTo(
                        "/admin/projects"
                      )
                    }
                  >
                    <FolderKanban
                      size={17}
                    />
                    Project
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      goTo(
                        "/admin/tasks"
                      )
                    }
                  >
                    <ListChecks
                      size={17}
                    />
                    Task
                  </button>
                </div>
              )}
            </div>

            {/* REFRESH */}

            <button
              type="button"
              className="tf-top-icon"
              title="Refresh dashboard"
              onClick={
                refreshDashboard
              }
            >
              <RefreshCw size={17} />
            </button>

            {/* DARK MODE */}

            <button
              type="button"
              className="tf-top-icon"
              title="Toggle dark mode"
              onClick={() =>
                setDarkMode(
                  !darkMode
                )
              }
            >
              {darkMode ? (
                <Sun size={17} />
              ) : (
                <Moon size={17} />
              )}
            </button>

            {/* NOTIFICATIONS */}

            <div className="tf-dropdown-wrap">
              <button
                type="button"
                className="tf-top-icon tf-bell"
                onClick={() => {
                  setNotificationOpen(
                    !notificationOpen
                  );

                  setCreateOpen(false);
                  setProfileOpen(false);
                }}
              >
                <Bell size={17} />

                {unreadCount > 0 && (
                  <span>
                    {unreadCount}
                  </span>
                )}
              </button>

              {notificationOpen && (
                <div className="tf-notification-menu">
                  <div className="tf-notification-head">
                    <div>
                      <strong>
                        Notifications
                      </strong>

                      <small>
                        {unreadCount}{" "}
                        unread
                      </small>
                    </div>

                    <button
                      type="button"
                      onClick={
                        markAllRead
                      }
                    >
                      Mark all read
                    </button>
                  </div>

                  {notifications.map(
                    (item) => (
                      <div
                        key={item.id}
                        className={`tf-notification-row ${
                          !item.read
                            ? "unread"
                            : ""
                        }`}
                      >
                        <span className="tf-notification-icon">
                          <Bell
                            size={14}
                          />
                        </span>

                        <div>
                          <strong>
                            {item.text}
                          </strong>

                          <small>
                            {item.time}
                          </small>
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>

            {/* HELP */}

            <button
              type="button"
              className="tf-top-icon"
              onClick={() =>
                alert(
                  "TeamFlow AI Admin Support"
                )
              }
            >
              <CircleHelp
                size={17}
              />
            </button>

            {/* PROFILE */}

            <div className="tf-dropdown-wrap">
              <button
                type="button"
                className="tf-admin-profile"
                onClick={() => {
                  setProfileOpen(
                    !profileOpen
                  );

                  setCreateOpen(false);

                  setNotificationOpen(
                    false
                  );
                }}
              >
                <span className="tf-profile-avatar">
                  HR
                </span>

                <span>
                  <strong>
                    Himanshu
                  </strong>

                  <small>
                    Super
                    Administrator
                  </small>
                </span>

                <ChevronDown
                  size={15}
                />
              </button>

              {profileOpen && (
                <div className="tf-profile-menu">
                  <button
                    type="button"
                    onClick={() =>
                      goTo(
                        "/admin/settings"
                      )
                    }
                  >
                    <Settings
                      size={16}
                    />
                    Settings
                  </button>

                  <button
                    type="button"
                    className="danger"
                    onClick={logout}
                  >
                    <LogOut
                      size={16}
                    />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* CONTENT */}

        <main className="tf-dashboard-content">
          {/* HERO */}

          <section className="tf-dashboard-hero">
            <div className="tf-hero-copy">
              <span className="tf-eyebrow">
                ADMIN DASHBOARD
              </span>

              <h1>
                Welcome back,{" "}
                <span>Admin!</span> 👋
              </h1>

              <p>
                Here's what's happening
                across TeamFlow AI today.
              </p>

              <div className="tf-live-status">
                <span />

                Live data

                <small>
                  Updated{" "}
                  {lastUpdated.toLocaleTimeString(
                    [],
                    {
                      hour: "2-digit",
                      minute:
                        "2-digit",
                    }
                  )}
                </small>
              </div>
            </div>

            <div className="tf-hero-actions">
              <HeroAction
                icon={<Users />}
                title="Manage Users"
                text={`${users.length} registered users`}
                onClick={() =>
                  goTo(
                    "/admin/users"
                  )
                }
              />

              <HeroAction
                icon={<Activity />}
                title="Monitor Usage"
                text={`${activeProjects} active projects`}
                onClick={() =>
                  goTo(
                    "/admin/analytics"
                  )
                }
              />

              <HeroAction
                icon={<Settings />}
                title="Platform Settings"
                text="Configure your platform"
                onClick={() =>
                  goTo(
                    "/admin/settings"
                  )
                }
              />

              <HeroAction
                icon={<TrendingUp />}
                title="View Reports"
                text="View detailed reports"
                onClick={() =>
                  goTo(
                    "/admin/reports"
                  )
                }
              />
            </div>

            <div className="tf-hero-visual">
              <div className="tf-hero-orbit" />

              <div className="tf-hero-bot">
                <Bot size={34} />
              </div>
            </div>
          </section>

          {/* KPI CARDS */}

          <section className="tf-kpi-grid">
            <StatCard
              icon={<Users />}
              label="Total Users"
              value={users.length}
              note="Registered users"
              path="/admin/users"
              goTo={goTo}
            />

            <StatCard
              icon={<Building2 />}
              label="Workspaces"
              value={
                workspaces.length
              }
              note="Platform workspaces"
              path="/admin/workspaces"
              goTo={goTo}
            />

            <StatCard
              icon={
                <FolderKanban />
              }
              label="Projects"
              value={projects.length}
              note={`${activeProjects} active`}
              path="/admin/projects"
              goTo={goTo}
            />

            <StatCard
              icon={<ListChecks />}
              label="Tasks"
              value={tasks.length}
              note={`${completedTasks} completed`}
              path="/admin/tasks"
              goTo={goTo}
            />

            <StatCard
              icon={<DollarSign />}
              label="Revenue"
              value={`$${revenue.toLocaleString()}`}
              note="Successful payments"
              path="/admin/billing"
              goTo={goTo}
            />

            <StatCard
              icon={<Zap />}
              label="AI Requests"
              value={
                aiCredits
                  ? aiCredits.toLocaleString()
                  : "0"
              }
              note="AI platform usage"
              path="/admin/ai-tools"
              goTo={goTo}
            />
          </section>

          {/* CHARTS */}

          <section className="tf-dashboard-chart-grid">
            {/* USER GROWTH */}

            <div className="tf-dashboard-card tf-growth-panel">
              <CardHeader
                title="User Growth"
                subtitle="Total users vs active users"
              >
                <select
                  value={period}
                  onChange={(event) =>
                    setPeriod(
                      event.target
                        .value
                    )
                  }
                >
                  <option value="7">
                    Last 7 Days
                  </option>

                  <option value="30">
                    Last 30 Days
                  </option>

                  <option value="90">
                    Last 90 Days
                  </option>
                </select>
              </CardHeader>

              <div className="tf-chart-legend-inline">
                <span>
                  <i className="blue" />
                  Total users
                </span>

                <span>
                  <i className="purple" />
                  Active users
                </span>
              </div>

              <LineChart
                data={growthData}
              />
            </div>

            {/* WORKSPACE DISTRIBUTION */}

            <div className="tf-dashboard-card">
              <CardHeader
                title="Workspace Distribution"
                subtitle="Workspace categories"
              >
                <button
                  type="button"
                  className="tf-view-link"
                  onClick={() =>
                    goTo(
                      "/admin/workspaces"
                    )
                  }
                >
                  View

                  <ArrowUpRight
                    size={13}
                  />
                </button>
              </CardHeader>

              <DonutChart
                workspaces={
                  workspaces
                }
              />
            </div>

            {/* PROJECT ACTIVITY */}

            <div className="tf-dashboard-card">
              <CardHeader
                title="Project Activity"
                subtitle="Weekly task activity"
              >
                <button
                  type="button"
                  className="tf-view-link"
                  onClick={() =>
                    goTo(
                      "/admin/projects"
                    )
                  }
                >
                  View

                  <ArrowUpRight
                    size={13}
                  />
                </button>
              </CardHeader>

              <ActivityChart
                data={
                  liveProjectActivity
                }
              />

              <div className="tf-activity-legend">
                <span>
                  <i className="completed" />
                  Completed
                </span>

                <span>
                  <i className="progress" />
                  In progress
                </span>

                <span>
                  <i className="todo" />
                  To do
                </span>
              </div>
            </div>
          </section>

          {/* LOWER */}

          <section className="tf-lower-grid">
            {/* USERS */}

            <div className="tf-dashboard-card">
              <CardHeader
                title="Recent Users"
                subtitle="Latest platform members"
              >
                <button
                  type="button"
                  className="tf-view-link"
                  onClick={() =>
                    goTo(
                      "/admin/users"
                    )
                  }
                >
                  View all
                </button>
              </CardHeader>

              <div className="tf-list">
                {users
                  .slice(0, 4)
                  .map(
                    (
                      user,
                      index
                    ) => (
                      <button
                        type="button"
                        key={
                          user.id ||
                          index
                        }
                        onClick={() =>
                          goTo(
                            "/admin/users"
                          )
                        }
                      >
                        <span className="tf-list-avatar">
                          {String(
                            user.name ||
                              "U"
                          )
                            .charAt(0)
                            .toUpperCase()}
                        </span>

                        <span className="tf-list-info">
                          <strong>
                            {user.name ||
                              "User"}
                          </strong>

                          <small>
                            {user.email ||
                              "TeamFlow member"}
                          </small>
                        </span>

                        <span className="tf-role-pill">
                          {user.role ||
                            "User"}
                        </span>
                      </button>
                    )
                  )}
              </div>
            </div>

            {/* WORKSPACES */}

            <div className="tf-dashboard-card">
              <CardHeader
                title="Recent Workspaces"
                subtitle="Active team spaces"
              >
                <button
                  type="button"
                  className="tf-view-link"
                  onClick={() =>
                    goTo(
                      "/admin/workspaces"
                    )
                  }
                >
                  View all
                </button>
              </CardHeader>

              <div className="tf-list">
                {workspaces
                  .slice(0, 4)
                  .map(
                    (
                      workspace,
                      index
                    ) => (
                      <button
                        type="button"
                        key={
                          workspace.id ||
                          index
                        }
                        onClick={() =>
                          goTo(
                            "/admin/workspaces"
                          )
                        }
                      >
                        <span className="tf-workspace-icon">
                          <Building2
                            size={15}
                          />
                        </span>

                        <span className="tf-list-info">
                          <strong>
                            {
                              workspace.name
                            }
                          </strong>

                          <small>
                            {workspace.category ||
                              "Workspace"}
                          </small>
                        </span>

                        <span className="tf-members">
                          {workspace.members ||
                            0}{" "}
                          members
                        </span>
                      </button>
                    )
                  )}
              </div>
            </div>

            {/* SYSTEM HEALTH */}

            <div className="tf-dashboard-card">
              <CardHeader
                title="System Health"
                subtitle="Live platform services"
              >
                <span className="tf-operational">
                  <CheckCircle2
                    size={12}
                  />
                  Operational
                </span>
              </CardHeader>

              <div className="tf-health-list">
                {systemHealth.map(
                  (health) => (
                    <div
                      className="tf-health-row"
                      key={
                        health.label
                      }
                    >
                      <div className="tf-health-top">
                        <span>
                          <strong>
                            {
                              health.label
                            }
                          </strong>

                          <small>
                            {
                              health.status
                            }
                          </small>
                        </span>

                        <strong>
                          {health.value}%
                        </strong>
                      </div>

                      <div className="tf-health-track">
                        <span
                          style={{
                            width: `${health.value}%`,
                          }}
                        />
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </section>

          {/* SUMMARY */}

          <section className="tf-summary-strip">
            <div>
              <CreditCard
                size={19}
              />

              <span>
                <small>
                  Successful Revenue
                </small>

                <strong>
                  $
                  {revenue.toLocaleString()}
                </strong>
              </span>
            </div>

            <div>
              <ListChecks
                size={19}
              />

              <span>
                <small>
                  Task Completion
                </small>

                <strong>
                  {tasks.length
                    ? Math.round(
                        (completedTasks /
                          tasks.length) *
                          100
                      )
                    : 0}
                  %
                </strong>
              </span>
            </div>

            <div>
              <FolderKanban
                size={19}
              />

              <span>
                <small>
                  Active Projects
                </small>

                <strong>
                  {activeProjects}
                </strong>
              </span>
            </div>

            <div>
              <Activity size={19} />

              <span>
                <small>
                  System Status
                </small>

                <strong>
                  Healthy
                </strong>
              </span>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
  icon,
  label,
  value,
  note,
  path,
  goTo,
}) {
  return (
    <button
      type="button"
      className="tf-stat-card"
      onClick={() => goTo(path)}
    >
      <div className="tf-stat-header">
        <span className="tf-stat-icon">
          {icon}
        </span>

        <ArrowUpRight
          className="tf-stat-arrow"
          size={15}
        />
      </div>

      <span className="tf-stat-label">
        {label}
      </span>

      <strong>{value}</strong>

      <small>{note}</small>
    </button>
  );
}

/* =========================================================
   HERO ACTION
========================================================= */

function HeroAction({
  icon,
  title,
  text,
  onClick,
}) {
  return (
    <button
      type="button"
      className="tf-hero-action"
      onClick={onClick}
    >
      <span>{icon}</span>

      <div>
        <strong>{title}</strong>
        <small>{text}</small>
      </div>

      <ArrowUpRight size={14} />
    </button>
  );
}

/* =========================================================
   CARD HEADER
========================================================= */

function CardHeader({
  title,
  subtitle,
  children,
}) {
  return (
    <div className="tf-card-header">
      <div>
        <h3>{title}</h3>
        <p>{subtitle}</p>
      </div>

      {children}
    </div>
  );
}

export default AdminDashboard;