
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import {
  Building2,
  Users,
  TrendingUp,
  DollarSign,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Clock,
  CheckCircle2,
  MoreHorizontal,
  Sparkles,
} from "lucide-react";
import "./SuperAdminDashboard.css";

const growthData = {
  "7d": [
    { name: "Mon", organizations: 108, users: 1820 },
    { name: "Tue", organizations: 111, users: 1885 },
    { name: "Wed", organizations: 113, users: 1910 },
    { name: "Thu", organizations: 115, users: 1980 },
    { name: "Fri", organizations: 119, users: 2040 },
    { name: "Sat", organizations: 123, users: 2100 },
    { name: "Sun", organizations: 128, users: 2180 },
  ],
  "30d": [
    { name: "Week 1", organizations: 82, users: 1240 },
    { name: "Week 2", organizations: 94, users: 1510 },
    { name: "Week 3", organizations: 107, users: 1760 },
    { name: "Week 4", organizations: 128, users: 2180 },
  ],
  "6m": [
    { name: "May", organizations: 52, users: 740 },
    { name: "Jun", organizations: 64, users: 930 },
    { name: "Jul", organizations: 73, users: 1100 },
    { name: "Aug", organizations: 88, users: 1390 },
    { name: "Sep", organizations: 105, users: 1740 },
    { name: "Oct", organizations: 128, users: 2180 },
  ],
  "12m": [
    { name: "Nov", organizations: 24, users: 310 },
    { name: "Dec", organizations: 31, users: 420 },
    { name: "Jan", organizations: 40, users: 550 },
    { name: "Feb", organizations: 48, users: 680 },
    { name: "Mar", organizations: 57, users: 810 },
    { name: "Apr", organizations: 65, users: 960 },
    { name: "May", organizations: 72, users: 1120 },
    { name: "Jun", organizations: 82, users: 1310 },
    { name: "Jul", organizations: 91, users: 1510 },
    { name: "Aug", organizations: 103, users: 1740 },
    { name: "Sep", organizations: 115, users: 1960 },
    { name: "Oct", organizations: 128, users: 2180 },
  ],
};

const revenueData = {
  "7d": [
    { name: "Mon", revenue: 1240 },
    { name: "Tue", revenue: 1580 },
    { name: "Wed", revenue: 1420 },
    { name: "Thu", revenue: 1860 },
    { name: "Fri", revenue: 1740 },
    { name: "Sat", revenue: 2150 },
    { name: "Sun", revenue: 2380 },
  ],
  "30d": [
    { name: "Week 1", revenue: 6200 },
    { name: "Week 2", revenue: 7800 },
    { name: "Week 3", revenue: 9100 },
    { name: "Week 4", revenue: 12400 },
  ],
  "6m": [
    { name: "May", revenue: 18400 },
    { name: "Jun", revenue: 22100 },
    { name: "Jul", revenue: 25800 },
    { name: "Aug", revenue: 30200 },
    { name: "Sep", revenue: 34700 },
    { name: "Oct", revenue: 42100 },
  ],
  "12m": [
    { name: "Nov", revenue: 8200 },
    { name: "Dec", revenue: 10500 },
    { name: "Jan", revenue: 14200 },
    { name: "Feb", revenue: 16800 },
    { name: "Mar", revenue: 19300 },
    { name: "Apr", revenue: 21500 },
    { name: "May", revenue: 18400 },
    { name: "Jun", revenue: 22100 },
    { name: "Jul", revenue: 25800 },
    { name: "Aug", revenue: 30200 },
    { name: "Sep", revenue: 34700 },
    { name: "Oct", revenue: 42100 },
  ],
};

const subscriptionData = [
  { name: "Free", value: 45 },
  { name: "Pro", value: 35 },
  { name: "Business", value: 20 },
];

const subscriptionColors = ["#94A3B8", "#7C6CF2", "#22B8A7"];

const organizations = [
  {
    id: 1,
    name: "Acme Technologies",
    initials: "AT",
    email: "admin@acmetech.com",
    plan: "Business",
    users: 248,
    status: "Active",
    color: "#E8E5FF",
    textColor: "#6554C0",
  },
  {
    id: 2,
    name: "Nova Solutions",
    initials: "NS",
    email: "hello@novasolutions.com",
    plan: "Pro",
    users: 124,
    status: "Active",
    color: "#DDF7EE",
    textColor: "#16866C",
  },
  {
    id: 3,
    name: "PixelCraft Studio",
    initials: "PC",
    email: "team@pixelcraft.io",
    plan: "Pro",
    users: 86,
    status: "Active",
    color: "#FFF0D8",
    textColor: "#B7791F",
  },
  {
    id: 4,
    name: "Vertex Digital",
    initials: "VD",
    email: "contact@vertex.digital",
    plan: "Free",
    users: 32,
    status: "Pending",
    color: "#DDEBFF",
    textColor: "#356BC5",
  },
];

const activities = [
  {
    id: 1,
    title: "New organization registered",
    description: "Acme Technologies joined the platform",
    time: "12 minutes ago",
    type: "organization",
  },
  {
    id: 2,
    title: "Subscription upgraded",
    description: "Nova Solutions upgraded to Pro",
    time: "38 minutes ago",
    type: "subscription",
  },
  {
    id: 3,
    title: "New user registered",
    description: "A new member joined PixelCraft Studio",
    time: "1 hour ago",
    type: "user",
  },
  {
    id: 4,
    title: "Security settings updated",
    description: "Platform security configuration changed",
    time: "2 hours ago",
    type: "security",
  },
];

const dateOptions = [
  { label: "7 Days", value: "7d" },
  { label: "30 Days", value: "30d" },
  { label: "6 Months", value: "6m" },
  { label: "12 Months", value: "12m" },
];

const tooltipStyle = {
  borderRadius: "12px",
  border: "1px solid #E9EAF2",
  boxShadow: "0 8px 24px rgba(25, 25, 55, 0.09)",
  fontSize: "12px",
  padding: "8px 12px",
};

const formatNumber = (value) =>
  Number(value).toLocaleString("en-IN");

const formatCurrency = (value) =>
  `₹${Number(value).toLocaleString("en-IN")}`;

function SuperAdminDashboard() {
  const navigate = useNavigate();

  const [dateRange, setDateRange] = useState("6m");
  const [refreshCount, setRefreshCount] = useState(0);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const selectedGrowthData = useMemo(
    () => growthData[dateRange] ?? growthData["6m"],
    [dateRange]
  );

  const selectedRevenueData = useMemo(
    () => revenueData[dateRange] ?? revenueData["6m"],
    [dateRange]
  );

  const latestGrowth =
    selectedGrowthData[selectedGrowthData.length - 1];

  const totalRevenue = useMemo(
    () =>
      selectedRevenueData.reduce(
        (total, item) => total + item.revenue,
        0
      ),
    [selectedRevenueData]
  );

  const handleRefresh = () => {
    setRefreshCount((count) => count + 1);
    setLastUpdated(new Date());
  };

  const stats = [
    {
      title: "Total Organizations",
      value: "128",
      change: "+12.8%",
      positive: true,
      description: "compared to last month",
      icon: Building2,
      iconClass: "sa-icon-purple",
      data: [30, 38, 34, 48, 45, 59, 67],
    },
    {
      title: "Total Users",
      value: "2,180",
      change: "+18.6%",
      positive: true,
      description: "compared to last month",
      icon: Users,
      iconClass: "sa-icon-blue",
      data: [24, 32, 30, 43, 48, 55, 69],
    },
    {
      title: "Monthly Revenue",
      value: "₹4.21L",
      change: "+8.4%",
      positive: true,
      description: "compared to last month",
      icon: DollarSign,
      iconClass: "sa-icon-green",
      data: [28, 33, 31, 45, 40, 58, 68],
    },
    {
      title: "Platform Activity",
      value: "94.8%",
      change: "-1.2%",
      positive: false,
      description: "compared to last month",
      icon: Activity,
      iconClass: "sa-icon-orange",
      data: [68, 64, 72, 65, 73, 68, 62],
    },
  ];

  const activityIcon = (type) => {
    switch (type) {
      case "organization":
        return <Building2 size={17} />;
      case "subscription":
        return <DollarSign size={17} />;
      case "user":
        return <Users size={17} />;
      default:
        return <ShieldCheck size={17} />;
    }
  };

  return (
    <div className="superadmin-dashboard">
      {/* Page header */}
      <header className="sa-page-header">
        <div className="sa-page-heading">
          <div className="sa-eyebrow">
            <Sparkles size={14} />
            <span>PLATFORM OVERVIEW</span>
          </div>

          <h1>Dashboard Overview</h1>

          <p>
            Welcome back! Here&apos;s what&apos;s happening across
            TeamFlow AI.
          </p>
        </div>

        <div className="sa-header-actions">
          <span className="sa-updated-label">
            <span className="sa-live-dot" />
            Demo data
          </span>

          <button
            type="button"
            className="sa-refresh-button"
            onClick={handleRefresh}
            title="Refresh dashboard view"
          >
            <RefreshCw
              size={16}
              className={refreshCount > 0 ? "sa-refresh-icon" : ""}
            />
            Refresh
          </button>
        </div>
      </header>

      <div className="sa-last-updated">
        Last refreshed: {lastUpdated.toLocaleTimeString()}
      </div>

      {/* Welcome banner */}
      <section className="sa-welcome-banner">
        <div className="sa-welcome-content">
          <span className="sa-welcome-tag">
            <ShieldCheck size={14} />
            SUPER ADMIN CONTROL CENTER
          </span>

          <h2>Your platform, at a glance.</h2>

          <p>
            Monitor organizations, user growth, subscriptions, and
            platform performance from one place.
          </p>

          <button
            type="button"
            className="sa-welcome-button"
            onClick={() => navigate("/superadmin/organizations")}
          >
            Manage organizations
            <ArrowUpRight size={16} />
          </button>
        </div>

        <div className="sa-welcome-decoration" aria-hidden="true">
          <div className="sa-decoration-circle sa-circle-one" />
          <div className="sa-decoration-circle sa-circle-two" />
          <div className="sa-decoration-icon">
            <Activity size={52} strokeWidth={1.4} />
          </div>
          <span className="sa-decoration-dot sa-dot-one" />
          <span className="sa-decoration-dot sa-dot-two" />
          <span className="sa-decoration-dot sa-dot-three" />
        </div>
      </section>

      {/* KPI cards */}
      <section className="sa-stats-grid" aria-label="Platform statistics">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const gradientId = `gradient-${stat.title
            .replace(/\s/g, "")
            .replace(/[^a-zA-Z0-9]/g, "")}`;

          const chartColor = stat.positive ? "#7C6CF2" : "#F59E0B";

          return (
            <article className="sa-stat-card" key={stat.title}>
              <div className="sa-stat-top">
                <div className={`sa-stat-icon ${stat.iconClass}`}>
                  <Icon size={20} />
                </div>

                <button
                  type="button"
                  className="sa-card-more"
                  aria-label={`More information about ${stat.title}`}
                  title={stat.title}
                  onClick={() => {
                    if (stat.title === "Total Organizations") {
                      navigate("/superadmin/organizations");
                    }
                  }}
                >
                  <MoreHorizontal size={20} />
                </button>
              </div>

              <p className="sa-stat-title">{stat.title}</p>

              <div className="sa-stat-value-row">
                <h3>{stat.value}</h3>

                <span
                  className={`sa-stat-change ${
                    stat.positive
                      ? "sa-change-positive"
                      : "sa-change-negative"
                  }`}
                >
                  {stat.positive ? (
                    <ArrowUpRight size={14} />
                  ) : (
                    <ArrowDownRight size={14} />
                  )}
                  {stat.change}
                </span>
              </div>

              <p className="sa-stat-description">
                {stat.description}
              </p>

              <div className="sa-stat-sparkline">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={stat.data.map((value, index) => ({
                      index,
                      value,
                    }))}
                    margin={{ top: 3, right: 0, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id={gradientId}
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor={chartColor}
                          stopOpacity={0.25}
                        />
                        <stop
                          offset="100%"
                          stopColor={chartColor}
                          stopOpacity={0.01}
                        />
                      </linearGradient>
                    </defs>

                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke={chartColor}
                      strokeWidth={2}
                      fill={`url(#${gradientId})`}
                      isAnimationActive
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </article>
          );
        })}
      </section>

      {/* Analytics heading and filters */}
      <div className="sa-section-heading">
        <div>
          <h2>Platform analytics</h2>
          <p>Explore growth and revenue across your platform.</p>
        </div>

        <div
          className="sa-date-filters"
          aria-label="Chart date range"
          role="group"
        >
          {dateOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              className={
                dateRange === option.value ? "sa-filter-active" : ""
              }
              onClick={() => setDateRange(option.value)}
              aria-pressed={dateRange === option.value}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main charts */}
      <section className="sa-charts-grid">
        <article className="sa-chart-card sa-growth-chart-card">
          <div className="sa-chart-header">
            <div>
              <h3>Platform growth</h3>
              <p>Organizations and registered users</p>
            </div>

            <span className="sa-chart-icon sa-chart-icon-purple">
              <TrendingUp size={19} />
            </span>
          </div>

          <div className="sa-chart-summary">
            <div>
              <span className="sa-summary-label">Organizations</span>
              <strong>{formatNumber(latestGrowth.organizations)}</strong>
            </div>

            <div>
              <span className="sa-summary-label">Users</span>
              <strong>{formatNumber(latestGrowth.users)}</strong>
            </div>
          </div>

          <div className="sa-chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={selectedGrowthData}
                margin={{ top: 12, right: 12, left: -12, bottom: 0 }}
              >
                <CartesianGrid
                  stroke="#EEEFF5"
                  strokeDasharray="4 4"
                  vertical={false}
                />

                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9293A6", fontSize: 11 }}
                  dy={10}
                  minTickGap={8}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9293A6", fontSize: 11 }}
                  tickFormatter={formatNumber}
                  width={48}
                />

                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(value, name) => [
                    formatNumber(value),
                    name === "organizations" ? "Organizations" : "Users",
                  ]}
                  labelStyle={{
                    color: "#292A42",
                    fontWeight: 600,
                    marginBottom: 4,
                  }}
                />

                <Legend
                  verticalAlign="top"
                  align="right"
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{
                    fontSize: "11px",
                    paddingBottom: "14px",
                  }}
                  formatter={(value) =>
                    value === "organizations" ? "Organizations" : "Users"
                  }
                />

                <Line
                  type="monotone"
                  dataKey="organizations"
                  name="organizations"
                  stroke="#7C6CF2"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: "#7C6CF2", strokeWidth: 0 }}
                  activeDot={{
                    r: 6,
                    strokeWidth: 2,
                    stroke: "#FFFFFF",
                  }}
                  isAnimationActive
                />

                <Line
                  type="monotone"
                  dataKey="users"
                  name="users"
                  stroke="#21B8A6"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: "#21B8A6", strokeWidth: 0 }}
                  activeDot={{
                    r: 6,
                    strokeWidth: 2,
                    stroke: "#FFFFFF",
                  }}
                  isAnimationActive
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </article>

        {/* Revenue chart */}
        <article className="sa-chart-card sa-revenue-chart-card">
          <div className="sa-chart-header">
            <div>
              <h3>Revenue trends</h3>
              <p>Revenue over the selected period</p>
            </div>

            <span className="sa-chart-icon sa-chart-icon-green">
              <DollarSign size={19} />
            </span>
          </div>

          <div className="sa-revenue-total">
            <strong>{formatCurrency(totalRevenue)}</strong>
            <span>
              <TrendingUp size={13} />
              Sample revenue
            </span>
          </div>

          <div className="sa-chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={selectedRevenueData}
                margin={{ top: 12, right: 8, left: -8, bottom: 0 }}
                barCategoryGap="30%"
              >
                <CartesianGrid
                  stroke="#EEEFF5"
                  strokeDasharray="4 4"
                  vertical={false}
                />

                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9293A6", fontSize: 11 }}
                  dy={10}
                  minTickGap={8}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9293A6", fontSize: 10 }}
                  tickFormatter={(value) =>
                    value >= 1000
                      ? `₹${Number(value / 1000).toLocaleString("en-IN")}k`
                      : `₹${value}`
                  }
                  width={52}
                />

                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(value) => [formatCurrency(value), "Revenue"]}
                  labelStyle={{
                    color: "#292A42",
                    fontWeight: 600,
                    marginBottom: 4,
                  }}
                />

                <Bar
                  dataKey="revenue"
                  name="Revenue"
                  fill="#21B8A6"
                  radius={[5, 5, 0, 0]}
                  maxBarSize={42}
                  isAnimationActive
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>
      </section>

      {/* Subscription and platform health */}
      <section className="sa-secondary-grid">
        <article className="sa-chart-card sa-subscription-card">
          <div className="sa-chart-header">
            <div>
              <h3>Subscription distribution</h3>
              <p>Illustrative plan mix across organizations</p>
            </div>

            <span className="sa-chart-icon sa-chart-icon-blue">
              <Building2 size={19} />
            </span>
          </div>

          <div className="sa-subscription-content">
            <div className="sa-donut-container">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={subscriptionData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius="58%"
                    outerRadius="82%"
                    paddingAngle={4}
                    stroke="none"
                    isAnimationActive
                  >
                    {subscriptionData.map((entry, index) => (
                      <Cell
                        key={entry.name}
                        fill={subscriptionColors[index]}
                      />
                    ))}
                  </Pie>

                  <Tooltip
                    contentStyle={tooltipStyle}
                    formatter={(value) => [`${value}%`, "Organizations"]}
                  />
                </PieChart>
              </ResponsiveContainer>

              <div className="sa-donut-center">
                <strong>128</strong>
                <span>Organizations</span>
              </div>
            </div>

            <div className="sa-subscription-legend">
              {subscriptionData.map((item, index) => (
                <div
                  className="sa-subscription-legend-item"
                  key={item.name}
                >
                  <span
                    className="sa-legend-dot"
                    style={{ backgroundColor: subscriptionColors[index] }}
                  />
                  <span className="sa-legend-name">{item.name}</span>
                  <strong>{item.value}%</strong>
                </div>
              ))}
            </div>
          </div>
        </article>

        {/* Platform health */}
        <article className="sa-chart-card sa-health-card">
          <div className="sa-chart-header">
            <div>
              <h3>Platform health</h3>
              <p>Illustrative service status</p>
            </div>

            <span className="sa-health-status">
              <span className="sa-live-dot" />
              Demo
            </span>
          </div>

          <div className="sa-health-score">
            <div>
              <span className="sa-health-label">Platform activity</span>
              <strong>94.8%</strong>
            </div>

            <span className="sa-health-trend">
              <TrendingUp size={14} />
              Healthy
            </span>
          </div>

          <div
            className="sa-health-progress"
            role="progressbar"
            aria-label="Platform activity"
            aria-valuenow={94.8}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div style={{ width: "94.8%" }} />
          </div>

          <div className="sa-health-items">
            <div className="sa-health-item">
              <span className="sa-health-item-icon sa-health-ok">
                <CheckCircle2 size={17} />
              </span>

              <div className="sa-health-item-content">
                <strong>Application services</strong>
                <span>Demo status: operational</span>
              </div>

              <span className="sa-health-pill">Healthy</span>
            </div>

            <div className="sa-health-item">
              <span className="sa-health-item-icon sa-health-ok">
                <ShieldCheck size={17} />
              </span>

              <div className="sa-health-item-content">
                <strong>Security monitoring</strong>
                <span>Live checks not connected</span>
              </div>

              <span className="sa-health-pill sa-health-pill-muted">
                Demo
              </span>
            </div>

            <div className="sa-health-item">
              <span className="sa-health-item-icon sa-health-warning">
                <Clock size={17} />
              </span>

              <div className="sa-health-item-content">
                <strong>Background jobs</strong>
                <span>Live checks not connected</span>
              </div>

              <span className="sa-health-pill sa-health-pill-muted">
                Demo
              </span>
            </div>
          </div>
        </article>
      </section>

      {/* Organizations and recent activity */}
      <section className="sa-bottom-grid">
        <article className="sa-table-card">
          <div className="sa-panel-header">
            <div>
              <h3>Recent organizations</h3>
              <p>Overview of organizations on the platform</p>
            </div>

            <button
              type="button"
              className="sa-text-button"
              onClick={() => navigate("/superadmin/organizations")}
            >
              View all
              <ExternalLink size={14} />
            </button>
          </div>

          <div className="sa-table-wrapper">
            <table className="sa-organizations-table">
              <thead>
                <tr>
                  <th>Organization</th>
                  <th>Plan</th>
                  <th>Users</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {organizations.map((organization) => (
                  <tr key={organization.id}>
                    <td>
                      <div className="sa-organization-cell">
                        <div
                          className="sa-organization-avatar"
                          style={{
                            backgroundColor: organization.color,
                            color: organization.textColor,
                          }}
                        >
                          {organization.initials}
                        </div>

                        <div className="sa-organization-info">
                          <strong>{organization.name}</strong>
                          <span>{organization.email}</span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span
                        className={`sa-plan-badge sa-plan-${organization.plan.toLowerCase()}`}
                      >
                        {organization.plan}
                      </span>
                    </td>

                    <td className="sa-user-count">
                      {formatNumber(organization.users)}
                    </td>

                    <td>
                      <span
                        className={`sa-status-badge ${
                          organization.status === "Active"
                            ? "sa-status-active"
                            : "sa-status-pending"
                        }`}
                      >
                        <span />
                        {organization.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        {/* Recent activity */}
        <article className="sa-activity-card">
          <div className="sa-panel-header">
            <div>
              <h3>Recent activity</h3>
              <p>Latest platform events</p>
            </div>

            <button
              type="button"
              className="sa-icon-button"
              title="Activity preview"
              aria-label="Activity preview"
              onClick={() => navigate("/superadmin/activity-logs")}
            >
              <MoreHorizontal size={20} />
            </button>
          </div>

          <div className="sa-activity-list">
            {activities.map((activity, index) => (
              <div className="sa-activity-item" key={activity.id}>
                <div
                  className={`sa-activity-icon sa-activity-${activity.type}`}
                >
                  {activityIcon(activity.type)}
                </div>

                <div className="sa-activity-content">
                  <strong>{activity.title}</strong>
                  <p>{activity.description}</p>

                  <span className="sa-activity-time">
                    <Clock size={11} />
                    {activity.time}
                  </span>
                </div>

                {index !== activities.length - 1 && (
                  <div className="sa-activity-connector" />
                )}
              </div>
            ))}
          </div>

          <button
            type="button"
            className="sa-activity-footer-button"
            onClick={() => navigate("/superadmin/activity-logs")}
          >
            View activity logs
            <ArrowUpRight size={15} />
          </button>
        </article>
      </section>

      {/* Dashboard footer */}
      <footer className="sa-dashboard-footer">
        <span>
          <ShieldCheck size={14} />
          TeamFlow AI · Super Admin Console
        </span>

        <span>Frontend demo · Backend integration pending</span>
      </footer>
    </div>
  );
}

export default SuperAdminDashboard;
