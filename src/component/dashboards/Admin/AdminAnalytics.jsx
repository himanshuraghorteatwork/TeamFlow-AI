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
  BarChart3,
  Users,
  Building2,
  FolderKanban,
  DollarSign,
  TrendingUp,
  Activity,
  Download,
  RefreshCw,
  ArrowUpRight,
  CircleDollarSign,
  CheckCircle2,
  Zap,
  Database,
  HardDrive,
  Bot,
  Settings,
  LogOut,
  X,
} from "lucide-react";

import AdminSidebar from "../../../layouts/AdminSidebar/AdminSidebar.jsx";

import {
  analyticsSummary,
  growthData,
  revenueData,
  workspaceDistribution,
  planDistribution,
  activityData,
  topWorkspaces,
  systemMetrics,
} from "./adminAnalyticsData.js";

import "./AdminAnalytics.css";

/* =========================================================
   STORAGE HELPER
========================================================= */

function readStorage(keys, fallback = []) {
  for (const key of keys) {
    try {
      const value = localStorage.getItem(key);

      if (!value) continue;

      const parsed = JSON.parse(value);

      if (Array.isArray(parsed)) {
        return parsed;
      }
    } catch {
      // Continue to next key.
    }
  }

  return fallback;
}

/* =========================================================
   ADMIN ANALYTICS
========================================================= */

function AdminAnalytics() {
  const navigate = useNavigate();
  const globalSearchRef = useRef(null);

  const [range, setRange] = useState("30 Days");
  const [search, setSearch] = useState("");
  const [globalSearch, setGlobalSearch] = useState("");

  const [workspaceType, setWorkspaceType] =
    useState("All");

  const [lastUpdated, setLastUpdated] =
    useState(new Date());

  const [dataVersion, setDataVersion] =
    useState(0);

  const [createOpen, setCreateOpen] =
    useState(false);

  const [profileOpen, setProfileOpen] =
    useState(false);

  const [searchOpen, setSearchOpen] =
    useState(false);

  const [refreshing, setRefreshing] =
    useState(false);

  /* =======================================================
     LIVE DATA
  ======================================================= */

  const liveUsers = useMemo(
    () => (dataVersion, readStorage(["teamflow_admin_users", "teamflow_users"], [])),
    [dataVersion]
  );

  const liveWorkspaces = useMemo(
    () => (dataVersion, readStorage(["teamflow_admin_workspaces", "teamflow_workspaces"], topWorkspaces)),
    [dataVersion]
  );

  const liveProjects = useMemo(
    () => (dataVersion, readStorage(["teamflow_admin_projects", "teamflow_projects"], [])),
    [dataVersion]
  );

  const liveTasks = useMemo(() => {
    void dataVersion;
    const savedTasks = readStorage(
      ["teamflow_admin_tasks"],
      []
    );

    if (savedTasks.length) {
      return savedTasks;
    }

    const nestedTasks =
      liveProjects.flatMap((project) =>
        Array.isArray(project.tasks)
          ? project.tasks
          : []
      );

    return nestedTasks;
  }, [liveProjects, dataVersion]);

  const liveTransactions = useMemo(
    () => (dataVersion, readStorage(["teamflow_admin_transactions"], [])),
    [dataVersion]
  );

  /* =======================================================
     SUMMARY
  ======================================================= */

  const summary = useMemo(() => {
    const paidRevenue =
      liveTransactions
        .filter(
          (transaction) =>
            String(
              transaction.status || ""
            ).toLowerCase() === "paid"
        )
        .reduce(
          (sum, transaction) =>
            sum +
            Number(
              transaction.amount || 0
            ),
          0
        );

    const activeUserCount =
      liveUsers.filter((user) => {
        const status = String(
          user.status || "active"
        ).toLowerCase();

        return status === "active";
      }).length;

    return {
      totalUsers:
        liveUsers.length ||
        analyticsSummary.totalUsers,

      activeUsers:
        liveUsers.length
          ? activeUserCount
          : analyticsSummary.activeUsers,

      totalWorkspaces:
        liveWorkspaces.length ||
        analyticsSummary.totalWorkspaces,

      totalProjects:
        liveProjects.length ||
        analyticsSummary.totalProjects,

      totalTasks:
        liveTasks.length ||
        analyticsSummary.totalTasks,

      monthlyRevenue:
        paidRevenue ||
        analyticsSummary.monthlyRevenue,
    };
  }, [
    liveUsers,
    liveWorkspaces,
    liveProjects,
    liveTasks,
    liveTransactions,
  ]);

  /* =======================================================
     GROWTH DATA
  ======================================================= */

  const currentGrowthData =
    growthData[range] ||
    growthData["30 Days"];

  /* =======================================================
     LIVE WORKSPACE TABLE
  ======================================================= */

  const analyticsWorkspaces =
    useMemo(() => {
      if (
        !liveWorkspaces.length
      ) {
        return topWorkspaces;
      }

      return liveWorkspaces.map(
        (workspace, index) => ({
          id:
            workspace.id ??
            index + 1,

          name:
            workspace.name ||
            `Workspace ${index + 1}`,

          owner:
            workspace.owner ||
            workspace.ownerName ||
            "TeamFlow Admin",

          members: Number(
            workspace.members || 0
          ),

          projects: Number(
            workspace.projects ||
              workspace.projectCount ||
              0
          ),

          tasks: Number(
            workspace.tasks ||
              workspace.taskCount ||
              0
          ),

          storage: Number(
            workspace.storage || 0
          ),

          plan:
            workspace.plan || "Free",

          growth: Number(
            workspace.growth ||
              0
          ),
        })
      );
    }, [liveWorkspaces]);

  const filteredWorkspaces =
    useMemo(() => {
      return analyticsWorkspaces.filter(
        (workspace) => {
          const query = search
            .toLowerCase()
            .trim();

          const matchesSearch =
            !query ||
            String(
              workspace.name
            )
              .toLowerCase()
              .includes(query) ||
            String(
              workspace.owner
            )
              .toLowerCase()
              .includes(query);

          const matchesPlan =
            workspaceType === "All" ||
            workspace.plan ===
              workspaceType;

          return (
            matchesSearch &&
            matchesPlan
          );
        }
      );
    }, [
      search,
      workspaceType,
      analyticsWorkspaces,
    ]);

  /* =======================================================
     GLOBAL SEARCH
  ======================================================= */

  const searchItems = useMemo(
    () => [
      {
        name: "Dashboard",
        description:
          "Admin dashboard overview",
        path: "/admin/dashboard",
        icon: Activity,
      },
      {
        name: "Users",
        description: `${summary.totalUsers.toLocaleString()} users`,
        path: "/admin/users",
        icon: Users,
      },
      {
        name: "Workspaces",
        description: `${summary.totalWorkspaces.toLocaleString()} workspaces`,
        path: "/admin/workspaces",
        icon: Building2,
      },
      {
        name: "Projects",
        description: `${summary.totalProjects.toLocaleString()} projects`,
        path: "/admin/projects",
        icon: FolderKanban,
      },
      {
        name: "Tasks",
        description: `${summary.totalTasks.toLocaleString()} tasks`,
        path: "/admin/tasks",
        icon: CheckCircle2,
      },
      {
        name: "Billing & Payments",
        description:
          "Revenue and payments",
        path: "/admin/billing",
        icon: DollarSign,
      },
      {
        name: "Subscriptions",
        description:
          "Subscription plans",
        path: "/admin/subscriptions",
        icon: CircleDollarSign,
      },
      {
        name: "Analytics",
        description:
          "Platform analytics",
        path: "/admin/analytics",
        icon: BarChart3,
      },
      {
        name: "Reports",
        description:
          "Analytics reports",
        path: "/admin/reports",
        icon: TrendingUp,
      },
      {
        name: "Settings",
        description:
          "Platform settings",
        path: "/admin/settings",
        icon: Settings,
      },
    ],
    [summary]
  );

  const globalResults =
    useMemo(() => {
      const query = globalSearch
        .trim()
        .toLowerCase();

      if (!query) return [];

      return searchItems.filter(
        (item) =>
          `${item.name} ${item.description}`
            .toLowerCase()
            .includes(query)
      );
    }, [
      globalSearch,
      searchItems,
    ]);

  /* =======================================================
     REFRESH
  ======================================================= */

  const refreshAnalytics = () => {
    setRefreshing(true);

    setDataVersion(
      (current) => current + 1
    );

    setLastUpdated(new Date());

    window.setTimeout(() => {
      setRefreshing(false);
    }, 500);
  };

  /* =======================================================
     AUTO REFRESH
  ======================================================= */

  useEffect(() => {
    const interval = window.setInterval(
      () => {
        setDataVersion(
          (current) =>
            current + 1
        );

        setLastUpdated(new Date());
      },
      15000
    );

    return () =>
      window.clearInterval(interval);
  }, []);

  /* =======================================================
     STORAGE CHANGES
  ======================================================= */

  useEffect(() => {
    const handleStorage = () => {
      setDataVersion(
        (current) =>
          current + 1
      );

      setLastUpdated(new Date());
    };

    window.addEventListener(
      "storage",
      handleStorage
    );

    return () =>
      window.removeEventListener(
        "storage",
        handleStorage
      );
  }, []);

  /* =======================================================
     CTRL + K / ESC
  ======================================================= */

  useEffect(() => {
    const handleKeyboard = (
      event
    ) => {
      if (
        (event.ctrlKey ||
          event.metaKey) &&
        event.key.toLowerCase() ===
          "k"
      ) {
        event.preventDefault();

        globalSearchRef.current?.focus();

        setSearchOpen(true);
      }

      if (
        event.key === "Escape"
      ) {
        setSearchOpen(false);
        setCreateOpen(false);
        setProfileOpen(false);
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyboard
    );

    return () =>
      window.removeEventListener(
        "keydown",
        handleKeyboard
      );
  }, []);

  /* =======================================================
     NAVIGATION
  ======================================================= */

  const goTo = (path) => {
    setCreateOpen(false);
    setProfileOpen(false);
    setSearchOpen(false);
    setGlobalSearch("");

    navigate(path);
  };

  /* =======================================================
     EXPORT CSV
  ======================================================= */

  const exportAnalytics = () => {
    const headers = [
      "Workspace",
      "Owner",
      "Members",
      "Projects",
      "Tasks",
      "Storage",
      "Plan",
      "Growth",
    ];

    const rows =
      filteredWorkspaces.map(
        (workspace) => [
          workspace.name,
          workspace.owner,
          workspace.members,
          workspace.projects,
          workspace.tasks,
          `${workspace.storage}%`,
          workspace.plan,
          `${workspace.growth}%`,
        ]
      );

    const csv = [
      headers,
      ...rows,
    ]
      .map((row) =>
        row
          .map(
            (value) =>
              `"${String(
                value
              ).replace(
                /"/g,
                '""'
              )}"`
          )
          .join(",")
      )
      .join("\n");

    const blob = new Blob(
      [csv],
      {
        type: "text/csv;charset=utf-8;",
      }
    );

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;

    link.download =
      `teamflow-analytics-${range
        .toLowerCase()
        .replaceAll(
          " ",
          "-"
        )}.csv`;

    document.body.appendChild(
      link
    );

    link.click();

    document.body.removeChild(
      link
    );

    URL.revokeObjectURL(url);
  };

  /* =======================================================
     LOGOUT
  ======================================================= */

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
    <div className="admin-analytics-shell">
      <AdminSidebar />

      <main className="admin-analytics-main">
        {/* =============================================
            TOPBAR
        ============================================== */}

        <header className="admin-analytics-topbar">
          <div className="admin-analytics-global-search-wrapper">
            <div className="admin-analytics-global-search">
              <Search size={17} />

              <input
                ref={
                  globalSearchRef
                }
                type="text"
                value={globalSearch}
                placeholder="Search users, workspaces, projects, or anything..."
                onFocus={() =>
                  setSearchOpen(
                    true
                  )
                }
                onChange={(
                  event
                ) => {
                  setGlobalSearch(
                    event.target
                      .value
                  );

                  setSearchOpen(
                    true
                  );
                }}
              />

              {globalSearch ? (
                <button
                  type="button"
                  className="admin-analytics-clear-search"
                  onClick={() =>
                    setGlobalSearch(
                      ""
                    )
                  }
                >
                  <X size={14} />
                </button>
              ) : (
                <span>Ctrl + K</span>
              )}
            </div>

            {searchOpen &&
              globalSearch && (
                <div className="admin-analytics-search-results">
                  {globalResults.length >
                  0 ? (
                    globalResults.map(
                      (item) => {
                        const Icon =
                          item.icon;

                        return (
                          <button
                            type="button"
                            key={
                              item.path
                            }
                            onClick={() =>
                              goTo(
                                item.path
                              )
                            }
                          >
                            <div className="admin-analytics-search-result-icon">
                              <Icon
                                size={
                                  16
                                }
                              />
                            </div>

                            <span>
                              <strong>
                                {
                                  item.name
                                }
                              </strong>

                              <small>
                                {
                                  item.description
                                }
                              </small>
                            </span>

                            <ArrowUpRight
                              size={14}
                            />
                          </button>
                        );
                      }
                    )
                  ) : (
                    <div className="admin-analytics-search-empty">
                      <Search
                        size={20}
                      />

                      <strong>
                        No results
                        found
                      </strong>

                      <span>
                        Try another
                        search.
                      </span>
                    </div>
                  )}
                </div>
              )}
          </div>

          <div className="admin-analytics-top-actions">
            {/* CREATE */}

            <div className="admin-analytics-dropdown">
              <button
                type="button"
                className="admin-analytics-create"
                onClick={() => {
                  setCreateOpen(
                    !createOpen
                  );

                  setProfileOpen(
                    false
                  );
                }}
              >
                <Plus size={17} />
                Create
                <ChevronDown
                  size={14}
                />
              </button>

              {createOpen && (
                <div className="admin-analytics-create-menu">
                  <button
                    type="button"
                    onClick={() =>
                      goTo(
                        "/admin/workspaces"
                      )
                    }
                  >
                    <Building2
                      size={16}
                    />
                    New Workspace
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      goTo(
                        "/admin/users"
                      )
                    }
                  >
                    <Users
                      size={16}
                    />
                    New User
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
                      size={16}
                    />
                    New Project
                  </button>
                </div>
              )}
            </div>

            {/* PROFILE */}

            <div className="admin-analytics-dropdown">
              <button
                type="button"
                className="admin-analytics-profile"
                onClick={() => {
                  setProfileOpen(
                    !profileOpen
                  );

                  setCreateOpen(
                    false
                  );
                }}
              >
                <div className="admin-analytics-avatar">
                  HR
                </div>

                <div>
                  <strong>
                    Himanshu
                  </strong>

                  <span>
                    Super
                    Administrator
                  </span>
                </div>

                <ChevronDown
                  size={15}
                />
              </button>

              {profileOpen && (
                <div className="admin-analytics-profile-menu">
                  <button
                    type="button"
                    onClick={() =>
                      goTo(
                        "/admin/settings"
                      )
                    }
                  >
                    <Settings
                      size={15}
                    />
                    Settings
                  </button>

                  <button
                    type="button"
                    className="danger"
                    onClick={logout}
                  >
                    <LogOut
                      size={15}
                    />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* =============================================
            CONTENT
        ============================================== */}

        <div className="admin-analytics-content">
          {/* HEADING */}

          <section className="admin-analytics-heading">
            <div>
              <div className="admin-analytics-breadcrumb">
                <BarChart3
                  size={15}
                />

                ADMIN / ANALYTICS
              </div>

              <h1>
                Analytics Overview
              </h1>

              <p>
                Monitor platform
                growth, engagement,
                revenue and workspace
                performance.
              </p>

              <div className="admin-analytics-live-indicator">
                <i />

                <span>
                  Live analytics
                </span>

                <small>
                  Updated{" "}
                  {lastUpdated.toLocaleTimeString(
                    [],
                    {
                      hour:
                        "2-digit",
                      minute:
                        "2-digit",
                    }
                  )}
                </small>
              </div>
            </div>

            <div className="admin-analytics-heading-actions">
              <select
                value={range}
                onChange={(
                  event
                ) =>
                  setRange(
                    event.target
                      .value
                  )
                }
              >
                <option>
                  7 Days
                </option>

                <option>
                  30 Days
                </option>

                <option>
                  90 Days
                </option>
              </select>

              <button
                type="button"
                className="admin-analytics-secondary-button"
                onClick={
                  refreshAnalytics
                }
                disabled={
                  refreshing
                }
              >
                <RefreshCw
                  size={15}
                  className={
                    refreshing
                      ? "admin-analytics-spin"
                      : ""
                  }
                />

                {refreshing
                  ? "Refreshing..."
                  : "Refresh"}
              </button>

              <button
                type="button"
                className="admin-analytics-primary-button"
                onClick={
                  exportAnalytics
                }
              >
                <Download
                  size={15}
                />
                Export Report
              </button>
            </div>
          </section>

          {/* =============================================
              KPI
          ============================================== */}

          <section className="admin-analytics-kpis">
            <KpiCard
              title="Total Users"
              value={summary.totalUsers.toLocaleString()}
              change="+12.4%"
              description="vs previous period"
              icon={Users}
              type="purple"
              onClick={() =>
                goTo(
                  "/admin/users"
                )
              }
            />

            <KpiCard
              title="Active Users"
              value={summary.activeUsers.toLocaleString()}
              change="+8.7%"
              description={`${Math.round(
                (summary.activeUsers /
                  Math.max(
                    summary.totalUsers,
                    1
                  )) *
                  100
              )}% engagement`}
              icon={Activity}
              type="blue"
              onClick={() =>
                goTo(
                  "/admin/users"
                )
              }
            />

            <KpiCard
              title="Workspaces"
              value={summary.totalWorkspaces.toLocaleString()}
              change="+8.6%"
              description="Active platform spaces"
              icon={Building2}
              type="green"
              onClick={() =>
                goTo(
                  "/admin/workspaces"
                )
              }
            />

            <KpiCard
              title="Projects"
              value={summary.totalProjects.toLocaleString()}
              change="+24%"
              description="vs previous period"
              icon={
                FolderKanban
              }
              type="orange"
              onClick={() =>
                goTo(
                  "/admin/projects"
                )
              }
            />

            <KpiCard
              title="Monthly Revenue"
              value={`$${summary.monthlyRevenue.toLocaleString()}`}
              change="+32%"
              description="Recurring revenue"
              icon={DollarSign}
              type="pink"
              onClick={() =>
                goTo(
                  "/admin/billing"
                )
              }
            />
          </section>

          {/* =============================================
              CHART ROW 1
          ============================================== */}

          <section className="admin-analytics-grid admin-analytics-grid-main">
            <ChartCard
              title="User Growth"
              subtitle={`Total vs active users · ${range}`}
              icon={
                TrendingUp
              }
              className="admin-analytics-growth-card"
            >
              <LineChart
                data={
                  currentGrowthData
                }
              />
            </ChartCard>

            <ChartCard
              title="Workspace Distribution"
              subtitle="Workspaces by department"
              icon={Building2}
            >
              <DonutChart
                data={
                  workspaceDistribution
                }
              />
            </ChartCard>
          </section>

          {/* =============================================
              CHART ROW 2
          ============================================== */}

          <section className="admin-analytics-grid admin-analytics-grid-three">
            <ChartCard
              title="Revenue Growth"
              subtitle="Monthly recurring revenue"
              icon={
                CircleDollarSign
              }
            >
              <RevenueChart
                data={
                  revenueData
                }
              />
            </ChartCard>

            <ChartCard
              title="Plan Distribution"
              subtitle="Subscriptions by plan"
              icon={BarChart3}
            >
              <PlanDistribution
                data={
                  planDistribution
                }
              />
            </ChartCard>

            <ChartCard
              title="Project Activity"
              subtitle="Weekly platform activity"
              icon={Zap}
            >
              <ActivityChart
                data={
                  activityData
                }
              />
            </ChartCard>
          </section>

          {/* =============================================
              WORKSPACE + HEALTH
          ============================================== */}

          <section className="admin-analytics-bottom-grid">
            {/* WORKSPACE TABLE */}

            <article className="admin-analytics-card">
              <div className="admin-analytics-card-header">
                <div>
                  <h3>
                    Top Performing
                    Workspaces
                  </h3>

                  <p>
                    Workspaces ranked
                    by activity and
                    growth
                  </p>
                </div>

                <button
                  type="button"
                  className="admin-analytics-card-action"
                  onClick={() =>
                    goTo(
                      "/admin/workspaces"
                    )
                  }
                >
                  View all

                  <ArrowUpRight
                    size={14}
                  />
                </button>
              </div>

              <div className="admin-analytics-workspace-toolbar">
                <div>
                  <Search
                    size={15}
                  />

                  <input
                    value={search}
                    onChange={(
                      event
                    ) =>
                      setSearch(
                        event.target
                          .value
                      )
                    }
                    placeholder="Search workspace..."
                  />

                  {search && (
                    <button
                      type="button"
                      className="admin-analytics-table-search-clear"
                      onClick={() =>
                        setSearch(
                          ""
                        )
                      }
                    >
                      <X
                        size={13}
                      />
                    </button>
                  )}
                </div>

                <select
                  value={
                    workspaceType
                  }
                  onChange={(
                    event
                  ) =>
                    setWorkspaceType(
                      event.target
                        .value
                    )
                  }
                >
                  <option value="All">
                    All Plans
                  </option>

                  <option value="Free">
                    Free
                  </option>

                  <option value="Pro">
                    Pro
                  </option>

                  <option value="Business">
                    Business
                  </option>

                  <option value="Enterprise">
                    Enterprise
                  </option>
                </select>
              </div>

              <div className="admin-analytics-table-wrapper">
                <table className="admin-analytics-table">
                  <thead>
                    <tr>
                      <th>
                        WORKSPACE
                      </th>

                      <th>
                        MEMBERS
                      </th>

                      <th>
                        PROJECTS
                      </th>

                      <th>
                        TASKS
                      </th>

                      <th>
                        PLAN
                      </th>

                      <th>
                        GROWTH
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredWorkspaces.length >
                    0 ? (
                      filteredWorkspaces.map(
                        (
                          workspace
                        ) => (
                          <tr
                            key={
                              workspace.id
                            }
                            onClick={() =>
                              goTo(
                                "/admin/workspaces"
                              )
                            }
                          >
                            <td>
                              <div className="admin-analytics-workspace-name">
                                <div>
                                  {workspace.name
                                    .charAt(
                                      0
                                    )
                                    .toUpperCase()}
                                </div>

                                <span>
                                  <strong>
                                    {
                                      workspace.name
                                    }
                                  </strong>

                                  <small>
                                    {
                                      workspace.owner
                                    }
                                  </small>
                                </span>
                              </div>
                            </td>

                            <td>
                              {
                                workspace.members
                              }
                            </td>

                            <td>
                              {
                                workspace.projects
                              }
                            </td>

                            <td>
                              {
                                workspace.tasks
                              }
                            </td>

                            <td>
                              <span
                                className={`admin-analytics-plan ${String(
                                  workspace.plan
                                ).toLowerCase()}`}
                              >
                                {
                                  workspace.plan
                                }
                              </span>
                            </td>

                            <td>
                              <span className="admin-analytics-growth">
                                <TrendingUp
                                  size={
                                    12
                                  }
                                />

                                {
                                  workspace.growth
                                }
                                %
                              </span>
                            </td>
                          </tr>
                        )
                      )
                    ) : (
                      <tr>
                        <td
                          colSpan="6"
                          className="admin-analytics-no-results"
                        >
                          No workspaces
                          match your
                          filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </article>

            {/* SYSTEM HEALTH */}

            <article className="admin-analytics-card">
              <div className="admin-analytics-card-header">
                <div>
                  <h3>
                    System Performance
                  </h3>

                  <p>
                    Live service health
                    overview
                  </p>
                </div>

                <span className="admin-analytics-system-live">
                  <i />
                  LIVE
                </span>
              </div>

              <div className="admin-analytics-health-list">
                {systemMetrics.map(
                  (
                    metric,
                    index
                  ) => (
                    <SystemMetric
                      key={
                        metric.name
                      }
                      metric={
                        metric
                      }
                      index={
                        index
                      }
                    />
                  )
                )}
              </div>

              <div className="admin-analytics-health-summary">
                <div>
                  <CheckCircle2
                    size={19}
                  />
                </div>

                <span>
                  <strong>
                    All systems
                    operational
                  </strong>

                  <small>
                    No incidents
                    reported
                  </small>
                </span>
              </div>
            </article>
          </section>

          <div className="admin-analytics-updated">
            <span className="admin-analytics-live-dot" />

            Live data · Last updated{" "}
            {lastUpdated.toLocaleTimeString(
              [],
              {
                hour: "2-digit",
                minute: "2-digit",
                second:
                  "2-digit",
              }
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

/* =========================================================
   KPI CARD
========================================================= */

function KpiCard({
  title,
  value,
  change,
  description,
  icon: Icon,
  type,
  onClick,
}) {
  return (
    <button
      type="button"
      className="admin-analytics-kpi"
      onClick={onClick}
    >
      <div
        className={`admin-analytics-kpi-icon ${type}`}
      >
        <Icon size={20} />
      </div>

      <div className="admin-analytics-kpi-info">
        <span>{title}</span>

        <strong>{value}</strong>

        <small>
          <b>{change}</b>{" "}
          {description}
        </small>
      </div>

      <TrendingUp className="admin-analytics-kpi-trend" />

      <ArrowUpRight className="admin-analytics-kpi-arrow" />
    </button>
  );
}

/* =========================================================
   CHART CARD
========================================================= */

function ChartCard({
  title,
  subtitle,
  icon: Icon,
  children,
  className = "",
}) {
  return (
    <article
      className={`admin-analytics-card ${className}`}
    >
      <div className="admin-analytics-card-header">
        <div>
          <h3>
            <Icon size={17} />
            {title}
          </h3>

          <p>{subtitle}</p>
        </div>

        <span className="admin-analytics-chart-live">
          <i />
          Live
        </span>
      </div>

      {children}
    </article>
  );
}

/* =========================================================
   LINE CHART
========================================================= */

function LineChart({ data }) {
  const [hovered, setHovered] =
    useState(null);

  const width = 700;
  const height = 230;
  const padding = 35;

  const maxValue =
    Math.max(
      ...data.flatMap(
        (item) => [
          item.users,
          item.active,
        ]
      ),
      1
    ) * 1.12;

  const getX = (index) =>
    padding +
    (index *
      (width - padding * 2)) /
      Math.max(
        data.length - 1,
        1
      );

  const getY = (value) =>
    height -
    padding -
    (value / maxValue) *
      (height - padding * 2);

  const userPoints = data
    .map(
      (item, index) =>
        `${getX(
          index
        )},${getY(
          item.users
        )}`
    )
    .join(" ");

  const activePoints = data
    .map(
      (item, index) =>
        `${getX(
          index
        )},${getY(
          item.active
        )}`
    )
    .join(" ");

  return (
    <div className="admin-analytics-line-chart">
      <div className="admin-analytics-chart-legend">
        <span>
          <i className="users" />
          Total Users
        </span>

        <span>
          <i className="active" />
          Active Users
        </span>
      </div>

      <div className="admin-analytics-svg-wrapper">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="none"
        >
          {[0, 1, 2, 3, 4].map(
            (line) => {
              const y =
                padding +
                (line *
                  (height -
                    padding *
                      2)) /
                  4;

              return (
                <line
                  key={line}
                  x1={padding}
                  y1={y}
                  x2={
                    width -
                    padding
                  }
                  y2={y}
                  className="admin-analytics-grid-line"
                />
              );
            }
          )}

          <polyline
            points={userPoints}
            className="admin-analytics-users-line"
          />

          <polyline
            points={activePoints}
            className="admin-analytics-active-line"
          />

          {data.map(
            (item, index) => (
              <React.Fragment
                key={
                  item.label
                }
              >
                <circle
                  cx={getX(
                    index
                  )}
                  cy={getY(
                    item.users
                  )}
                  r={
                    hovered?.index ===
                      index &&
                    hovered?.type ===
                      "users"
                      ? 7
                      : 4
                  }
                  className="admin-analytics-user-point"
                  onMouseEnter={() =>
                    setHovered({
                      index,
                      type: "users",
                      item,
                    })
                  }
                  onMouseLeave={() =>
                    setHovered(
                      null
                    )
                  }
                />

                <circle
                  cx={getX(
                    index
                  )}
                  cy={getY(
                    item.active
                  )}
                  r={
                    hovered?.index ===
                      index &&
                    hovered?.type ===
                      "active"
                      ? 7
                      : 4
                  }
                  className="admin-analytics-active-point"
                  onMouseEnter={() =>
                    setHovered({
                      index,
                      type: "active",
                      item,
                    })
                  }
                  onMouseLeave={() =>
                    setHovered(
                      null
                    )
                  }
                />
              </React.Fragment>
            )
          )}
        </svg>

        {hovered && (
          <div
            className="admin-analytics-chart-tooltip"
            style={{
              left: `${Math.min(
                Math.max(
                  (getX(
                    hovered.index
                  ) /
                    width) *
                    100,
                  10
                ),
                86
              )}%`,
              top: `${Math.max(
                (getY(
                  hovered.type ===
                    "users"
                    ? hovered.item
                        .users
                    : hovered.item
                        .active
                ) /
                  height) *
                  100 -
                  8,
                5
              )}%`,
            }}
          >
            <strong>
              {
                hovered.item
                  .label
              }
            </strong>

            <span>
              Total:{" "}
              {hovered.item.users.toLocaleString()}
            </span>

            <span>
              Active:{" "}
              {hovered.item.active.toLocaleString()}
            </span>
          </div>
        )}
      </div>

      <div className="admin-analytics-chart-labels">
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

function DonutChart({ data }) {
  const [selected, setSelected] =
    useState(null);

  const total = data.reduce(
    (sum, item) =>
      sum + item.value,
    0
  );

  const colors = [
    "#6338f5",
    "#168df7",
    "#08b978",
    "#ff9f1a",
    "#f33b65",
    "#c6cad4",
  ];

    const gradient = data
    .reduce(
      (acc, item, index) => {
        const prevTotal = acc.sum;
        const nextTotal = prevTotal + item.value;
        const start = (prevTotal / total) * 100;
        const end = (nextTotal / total) * 100;
        return {
          sum: nextTotal,
          segments: [...acc.segments, `${colors[index]} ${start}% ${end}%`],
        };
      },
      { sum: 0, segments: [] }
    )
    .segments.join(",");

  const activeItem =
    data.find(
      (item) =>
        item.name === selected
    );

  return (
    <div className="admin-analytics-donut-layout">
      <div
        className={`admin-analytics-donut ${
          selected
            ? "is-active"
            : ""
        }`}
        style={{
          background: `conic-gradient(${gradient})`,
        }}
      >
        <div>
          <strong>
            {activeItem
              ? activeItem.value
              : total}
          </strong>

          <span>
            {activeItem
              ? activeItem.name
              : "Total Workspaces"}
          </span>
        </div>
      </div>

      <div className="admin-analytics-donut-legend">
        {data.map(
          (item, index) => (
            <button
              type="button"
              key={item.name}
              className={
                selected ===
                item.name
                  ? "active"
                  : ""
              }
              onMouseEnter={() =>
                setSelected(
                  item.name
                )
              }
              onMouseLeave={() =>
                setSelected(null)
              }
              onFocus={() =>
                setSelected(
                  item.name
                )
              }
              onBlur={() =>
                setSelected(null)
              }
            >
              <span>
                <i
                  style={{
                    background:
                      colors[
                        index
                      ],
                  }}
                />

                {item.name}
              </span>

              <strong>
                {item.value} (
                {Math.round(
                  (item.value /
                    total) *
                    100
                )}
                %)
              </strong>
            </button>
          )
        )}
      </div>
    </div>
  );
}

/* =========================================================
   REVENUE
========================================================= */

function RevenueChart({ data }) {
  const [hovered, setHovered] =
    useState(null);

  const max = Math.max(
    ...data.map(
      (item) => item.revenue
    ),
    1
  );

  return (
    <div className="admin-analytics-revenue-chart">
      <div className="admin-analytics-revenue-bars">
        {data.map(
          (item, index) => (
            <div
              className="admin-analytics-revenue-column"
              key={item.month}
              onMouseEnter={() =>
                setHovered(index)
              }
              onMouseLeave={() =>
                setHovered(null)
              }
            >
              <span className="admin-analytics-bar-value">
                $
                {(
                  item.revenue /
                  1000
                ).toFixed(1)}
                k
              </span>

              <div
                className={`admin-analytics-revenue-bar ${
                  hovered ===
                  index
                    ? "active"
                    : ""
                }`}
                style={{
                  height: `${
                    (item.revenue /
                      max) *
                    150
                  }px`,
                }}
              />

              <small>
                {item.month}
              </small>

              {hovered ===
                index && (
                <div className="admin-analytics-bar-tooltip">
                  <strong>
                    {item.month}
                  </strong>

                  <span>
                    $
                    {item.revenue.toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
}

/* =========================================================
   PLAN DISTRIBUTION
========================================================= */

function PlanDistribution({
  data,
}) {
  const [hovered, setHovered] =
    useState(null);

  const total = data.reduce(
    (sum, item) =>
      sum + item.value,
    0
  );

  return (
    <div className="admin-analytics-plan-list">
      {data.map((item) => {
        const percentage =
          Math.round(
            (item.value /
              total) *
              100
          );

        return (
          <div
            className={`admin-analytics-plan-row ${
              hovered ===
              item.name
                ? "active"
                : ""
            }`}
            key={item.name}
            onMouseEnter={() =>
              setHovered(
                item.name
              )
            }
            onMouseLeave={() =>
              setHovered(null)
            }
          >
            <div>
              <span>
                {item.name}
              </span>

              <strong>
                {item.value}
              </strong>
            </div>

            <div className="admin-analytics-progress">
              <span
                className={item.name.toLowerCase()}
                style={{
                  width: `${percentage}%`,
                }}
              />
            </div>

            <small>
              {percentage}%
            </small>
          </div>
        );
      })}
    </div>
  );
}

/* =========================================================
   ACTIVITY
========================================================= */

function ActivityChart({ data }) {
  const [hovered, setHovered] =
    useState(null);

  const max = Math.max(
    ...data.flatMap(
      (item) => [
        item.created,
        item.updated,
        item.completed,
      ]
    ),
    1
  );

  return (
    <div className="admin-analytics-activity">
      <div className="admin-analytics-activity-bars">
        {data.map(
          (item, index) => (
            <div
              className="admin-analytics-activity-column"
              key={item.day}
              onMouseEnter={() =>
                setHovered(index)
              }
              onMouseLeave={() =>
                setHovered(null)
              }
            >
              <div
                className={`admin-analytics-activity-bar-group ${
                  hovered ===
                  index
                    ? "active"
                    : ""
                }`}
              >
                <span
                  className="created"
                  style={{
                    height: `${
                      (item.created /
                        max) *
                      125
                    }px`,
                  }}
                />

                <span
                  className="updated"
                  style={{
                    height: `${
                      (item.updated /
                        max) *
                      125
                    }px`,
                  }}
                />

                <span
                  className="completed"
                  style={{
                    height: `${
                      (item.completed /
                        max) *
                      125
                    }px`,
                  }}
                />
              </div>

              <small>
                {item.day}
              </small>

              {hovered ===
                index && (
                <div className="admin-analytics-activity-tooltip">
                  <strong>
                    {item.day}
                  </strong>

                  <span>
                    Created:{" "}
                    {
                      item.created
                    }
                  </span>

                  <span>
                    Updated:{" "}
                    {
                      item.updated
                    }
                  </span>

                  <span>
                    Completed:{" "}
                    {
                      item.completed
                    }
                  </span>
                </div>
              )}
            </div>
          )
        )}
      </div>

      <div className="admin-analytics-activity-legend">
        <span>
          <i className="created" />
          Created
        </span>

        <span>
          <i className="updated" />
          Updated
        </span>

        <span>
          <i className="completed" />
          Completed
        </span>
      </div>
    </div>
  );
}

/* =========================================================
   SYSTEM METRIC
========================================================= */

function SystemMetric({
  metric,
  index,
}) {
  const icons = [
    Activity,
    Database,
    Bot,
    HardDrive,
  ];

  const Icon =
    icons[index] || Activity;

  return (
    <div className="admin-analytics-system-metric">
      <div className="admin-analytics-system-icon">
        <Icon size={17} />
      </div>

      <div className="admin-analytics-system-info">
        <div>
          <span>
            {metric.name}
          </span>

          <strong>
            {metric.value}%
          </strong>
        </div>

        <div className="admin-analytics-system-progress">
          <span
            style={{
              width: `${metric.value}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default AdminAnalytics;