// src/component/AdminAnalytics/AdminAnalytics.jsx

import React, { useMemo, useState } from "react";

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

function AdminAnalytics() {
  const [range, setRange] = useState("30 Days");
  const [search, setSearch] = useState("");
  const [workspaceType, setWorkspaceType] = useState("All");
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const currentGrowthData =
    growthData[range] || growthData["30 Days"];

  const filteredWorkspaces = useMemo(() => {
    return topWorkspaces.filter((workspace) => {
      const query = search.toLowerCase().trim();

      const matchesSearch =
        !query ||
        workspace.name.toLowerCase().includes(query) ||
        workspace.owner.toLowerCase().includes(query);

      const matchesPlan =
        workspaceType === "All" ||
        workspace.plan === workspaceType;

      return matchesSearch && matchesPlan;
    });
  }, [search, workspaceType]);

  const refreshAnalytics = () => {
    setLastUpdated(new Date());
  };

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

    const rows = filteredWorkspaces.map((workspace) => [
      workspace.name,
      workspace.owner,
      workspace.members,
      workspace.projects,
      workspace.tasks,
      `${workspace.storage}%`,
      workspace.plan,
      `${workspace.growth}%`,
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row
          .map(
            (value) =>
              `"${String(value).replace(/"/g, '""')}"`
          )
          .join(",")
      )
      .join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "teamflow-analytics.csv";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  return (
    <div className="admin-analytics-shell">
      <AdminSidebar />

      <main className="admin-analytics-main">
        {/* ================= TOPBAR ================= */}

        <header className="admin-analytics-topbar">
          <div className="admin-analytics-global-search">
            <Search size={17} />

            <input
              type="text"
              placeholder="Search users, workspaces, projects, or anything..."
            />

            <span>Ctrl + K</span>
          </div>

          <div className="admin-analytics-top-actions">
            <button className="admin-analytics-create">
              <Plus size={17} />
              Create
              <ChevronDown size={14} />
            </button>

            <div className="admin-analytics-profile">
              <div className="admin-analytics-avatar">
                HR
              </div>

              <div>
                <strong>Himanshu</strong>
                <span>Super Administrator</span>
              </div>

              <ChevronDown size={15} />
            </div>
          </div>
        </header>

        {/* ================= CONTENT ================= */}

        <div className="admin-analytics-content">
          <section className="admin-analytics-heading">
            <div>
              <div className="admin-analytics-breadcrumb">
                <BarChart3 size={15} />
                ADMIN / ANALYTICS
              </div>

              <h1>Analytics Overview</h1>

              <p>
                Monitor platform growth, engagement,
                revenue and workspace performance.
              </p>
            </div>

            <div className="admin-analytics-heading-actions">
              <select
                value={range}
                onChange={(event) =>
                  setRange(event.target.value)
                }
              >
                <option>7 Days</option>
                <option>30 Days</option>
                <option>90 Days</option>
              </select>

              <button
                className="admin-analytics-secondary-button"
                onClick={refreshAnalytics}
              >
                <RefreshCw size={15} />
                Refresh
              </button>

              <button
                className="admin-analytics-primary-button"
                onClick={exportAnalytics}
              >
                <Download size={15} />
                Export Report
              </button>
            </div>
          </section>

          {/* ================= KPI ================= */}

          <section className="admin-analytics-kpis">
            <KpiCard
              title="Total Users"
              value={analyticsSummary.totalUsers.toLocaleString()}
              change="+12.4%"
              description="vs previous period"
              icon={Users}
              type="purple"
            />

            <KpiCard
              title="Active Users"
              value={analyticsSummary.activeUsers.toLocaleString()}
              change="+8.7%"
              description="71.4% engagement"
              icon={Activity}
              type="blue"
            />

            <KpiCard
              title="Workspaces"
              value={analyticsSummary.totalWorkspaces}
              change="+8.6%"
              description="16 new this month"
              icon={Building2}
              type="green"
            />

            <KpiCard
              title="Projects"
              value={analyticsSummary.totalProjects}
              change="+24%"
              description="vs previous period"
              icon={FolderKanban}
              type="orange"
            />

            <KpiCard
              title="Monthly Revenue"
              value={`$${analyticsSummary.monthlyRevenue.toLocaleString()}`}
              change="+32%"
              description="Recurring revenue"
              icon={DollarSign}
              type="pink"
            />
          </section>

          {/* ================= FIRST CHART ROW ================= */}

          <section className="admin-analytics-grid admin-analytics-grid-main">
            <ChartCard
              title="User Growth"
              subtitle="Total vs active users over time"
              icon={TrendingUp}
              className="admin-analytics-growth-card"
            >
              <LineChart data={currentGrowthData} />
            </ChartCard>

            <ChartCard
              title="Workspace Distribution"
              subtitle="Workspaces by department"
              icon={Building2}
            >
              <DonutChart data={workspaceDistribution} />
            </ChartCard>
          </section>

          {/* ================= SECOND CHART ROW ================= */}

          <section className="admin-analytics-grid admin-analytics-grid-three">
            <ChartCard
              title="Revenue Growth"
              subtitle="Monthly recurring revenue"
              icon={CircleDollarSign}
            >
              <RevenueChart data={revenueData} />
            </ChartCard>

            <ChartCard
              title="Plan Distribution"
              subtitle="Subscriptions by plan"
              icon={BarChart3}
            >
              <PlanDistribution data={planDistribution} />
            </ChartCard>

            <ChartCard
              title="Project Activity"
              subtitle="Weekly platform activity"
              icon={Zap}
            >
              <ActivityChart data={activityData} />
            </ChartCard>
          </section>

          {/* ================= WORKSPACES + HEALTH ================= */}

          <section className="admin-analytics-bottom-grid">
            <article className="admin-analytics-card">
              <div className="admin-analytics-card-header">
                <div>
                  <h3>Top Performing Workspaces</h3>
                  <p>
                    Workspaces ranked by activity and
                    growth
                  </p>
                </div>

                <ArrowUpRight size={17} />
              </div>

              <div className="admin-analytics-workspace-toolbar">
                <div>
                  <Search size={15} />

                  <input
                    value={search}
                    onChange={(event) =>
                      setSearch(event.target.value)
                    }
                    placeholder="Search workspace..."
                  />
                </div>

                <select
                  value={workspaceType}
                  onChange={(event) =>
                    setWorkspaceType(event.target.value)
                  }
                >
                  <option value="All">
                    All Plans
                  </option>
                  <option value="Pro">Pro</option>
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
                      <th>WORKSPACE</th>
                      <th>MEMBERS</th>
                      <th>PROJECTS</th>
                      <th>TASKS</th>
                      <th>PLAN</th>
                      <th>GROWTH</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredWorkspaces.map(
                      (workspace) => (
                        <tr key={workspace.id}>
                          <td>
                            <div className="admin-analytics-workspace-name">
                              <div>
                                {workspace.name.charAt(0)}
                              </div>

                              <span>
                                <strong>
                                  {workspace.name}
                                </strong>

                                <small>
                                  {workspace.owner}
                                </small>
                              </span>
                            </div>
                          </td>

                          <td>{workspace.members}</td>
                          <td>{workspace.projects}</td>
                          <td>{workspace.tasks}</td>

                          <td>
                            <span
                              className={`admin-analytics-plan ${workspace.plan.toLowerCase()}`}
                            >
                              {workspace.plan}
                            </span>
                          </td>

                          <td>
                            <span className="admin-analytics-growth">
                              <TrendingUp size={12} />
                              {workspace.growth}%
                            </span>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </article>

            <article className="admin-analytics-card">
              <div className="admin-analytics-card-header">
                <div>
                  <h3>System Performance</h3>
                  <p>Live service health overview</p>
                </div>

                <Activity size={18} />
              </div>

              <div className="admin-analytics-health-list">
                {systemMetrics.map(
                  (metric, index) => (
                    <SystemMetric
                      key={metric.name}
                      metric={metric}
                      index={index}
                    />
                  )
                )}
              </div>

              <div className="admin-analytics-health-summary">
                <div>
                  <CheckCircle2 size={19} />
                </div>

                <span>
                  <strong>
                    All systems operational
                  </strong>
                  <small>
                    No incidents reported
                  </small>
                </span>
              </div>
            </article>
          </section>

          <div className="admin-analytics-updated">
            Last updated:{" "}
            {lastUpdated.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>
      </main>
    </div>
  );
}

/* =========================================================
   COMPONENTS
========================================================= */

function KpiCard({
  title,
  value,
  change,
  description,
  icon: Icon,
  type,
}) {
  return (
    <article className="admin-analytics-kpi">
      <div
        className={`admin-analytics-kpi-icon ${type}`}
      >
        <Icon size={20} />
      </div>

      <div className="admin-analytics-kpi-info">
        <span>{title}</span>

        <strong>{value}</strong>

        <small>
          <b>{change}</b> {description}
        </small>
      </div>

      <TrendingUp className="admin-analytics-kpi-trend" />
    </article>
  );
}

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

        <button>
          <MoreDots />
        </button>
      </div>

      {children}
    </article>
  );
}

function MoreDots() {
  return <span className="admin-analytics-dots">•••</span>;
}

/* =========================================================
   SVG LINE CHART
========================================================= */

function LineChart({ data }) {
  const width = 700;
  const height = 230;
  const padding = 35;

  const maxValue =
    Math.max(...data.flatMap((item) => [item.users, item.active])) *
    1.12;

  const getX = (index) =>
    padding +
    (index * (width - padding * 2)) /
      Math.max(data.length - 1, 1);

  const getY = (value) =>
    height -
    padding -
    (value / maxValue) * (height - padding * 2);

  const userPoints = data
    .map(
      (item, index) =>
        `${getX(index)},${getY(item.users)}`
    )
    .join(" ");

  const activePoints = data
    .map(
      (item, index) =>
        `${getX(index)},${getY(item.active)}`
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

      <svg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
      >
        {[0, 1, 2, 3, 4].map((line) => {
          const y =
            padding +
            (line * (height - padding * 2)) / 4;

          return (
            <line
              key={line}
              x1={padding}
              y1={y}
              x2={width - padding}
              y2={y}
              className="admin-analytics-grid-line"
            />
          );
        })}

        <polyline
          points={userPoints}
          className="admin-analytics-users-line"
        />

        <polyline
          points={activePoints}
          className="admin-analytics-active-line"
        />

        {data.map((item, index) => (
          <React.Fragment key={item.label}>
            <circle
              cx={getX(index)}
              cy={getY(item.users)}
              r="4"
              className="admin-analytics-user-point"
            />

            <circle
              cx={getX(index)}
              cy={getY(item.active)}
              r="4"
              className="admin-analytics-active-point"
            />
          </React.Fragment>
        ))}
      </svg>

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
   DONUT
========================================================= */

function DonutChart({ data }) {
  const total = data.reduce(
    (sum, item) => sum + item.value,
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

  let current = 0;

  const gradient = data
    .map((item, index) => {
      const start = (current / total) * 100;

      current += item.value;

      const end = (current / total) * 100;

      return `${colors[index]} ${start}% ${end}%`;
    })
    .join(",");

  return (
    <div className="admin-analytics-donut-layout">
      <div
        className="admin-analytics-donut"
        style={{
          background: `conic-gradient(${gradient})`,
        }}
      >
        <div>
          <strong>{total}</strong>
          <span>Total Workspaces</span>
        </div>
      </div>

      <div className="admin-analytics-donut-legend">
        {data.map((item, index) => (
          <div key={item.name}>
            <span>
              <i
                style={{
                  background: colors[index],
                }}
              />

              {item.name}
            </span>

            <strong>
              {item.value} (
              {Math.round(
                (item.value / total) * 100
              )}
              %)
            </strong>
          </div>
        ))}
      </div>
    </div>
  );
}

/* =========================================================
   REVENUE CHART
========================================================= */

function RevenueChart({ data }) {
  const max = Math.max(
    ...data.map((item) => item.revenue)
  );

  return (
    <div className="admin-analytics-revenue-chart">
      <div className="admin-analytics-revenue-bars">
        {data.map((item) => (
          <div
            className="admin-analytics-revenue-column"
            key={item.month}
          >
            <span className="admin-analytics-bar-value">
              ${(item.revenue / 1000).toFixed(1)}k
            </span>

            <div
              className="admin-analytics-revenue-bar"
              style={{
                height: `${
                  (item.revenue / max) * 150
                }px`,
              }}
            />

            <small>{item.month}</small>
          </div>
        ))}
      </div>
    </div>
  );
}

/* =========================================================
   PLAN DISTRIBUTION
========================================================= */

function PlanDistribution({ data }) {
  const total = data.reduce(
    (sum, item) => sum + item.value,
    0
  );

  return (
    <div className="admin-analytics-plan-list">
      {data.map((item) => {
        const percentage = Math.round(
          (item.value / total) * 100
        );

        return (
          <div
            className="admin-analytics-plan-row"
            key={item.name}
          >
            <div>
              <span>{item.name}</span>
              <strong>{item.value}</strong>
            </div>

            <div className="admin-analytics-progress">
              <span
                className={item.name.toLowerCase()}
                style={{
                  width: `${percentage}%`,
                }}
              />
            </div>

            <small>{percentage}%</small>
          </div>
        );
      })}
    </div>
  );
}

/* =========================================================
   ACTIVITY CHART
========================================================= */

function ActivityChart({ data }) {
  const max = Math.max(
    ...data.flatMap((item) => [
      item.created,
      item.updated,
      item.completed,
    ])
  );

  return (
    <div className="admin-analytics-activity">
      <div className="admin-analytics-activity-bars">
        {data.map((item) => (
          <div
            className="admin-analytics-activity-column"
            key={item.day}
          >
            <div className="admin-analytics-activity-bar-group">
              <span
                className="created"
                style={{
                  height: `${
                    (item.created / max) * 125
                  }px`,
                }}
              />

              <span
                className="updated"
                style={{
                  height: `${
                    (item.updated / max) * 125
                  }px`,
                }}
              />

              <span
                className="completed"
                style={{
                  height: `${
                    (item.completed / max) * 125
                  }px`,
                }}
              />
            </div>

            <small>{item.day}</small>
          </div>
        ))}
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
   SYSTEM HEALTH
========================================================= */

function SystemMetric({ metric, index }) {
  const icons = [
    Activity,
    Database,
    Bot,
    HardDrive,
  ];

  const Icon = icons[index] || Activity;

  return (
    <div className="admin-analytics-system-metric">
      <div className="admin-analytics-system-icon">
        <Icon size={17} />
      </div>

      <div className="admin-analytics-system-info">
        <div>
          <span>{metric.name}</span>

          <strong>{metric.value}%</strong>
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