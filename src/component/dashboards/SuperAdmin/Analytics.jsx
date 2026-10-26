import { useMemo, useState } from "react";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Download,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import "./SuperAdminCommon.css";
import "./Analytics.css";

const growthData = {
  "7 days": [
    { label: "Mon", organizations: 8, users: 120 },
    { label: "Tue", organizations: 11, users: 145 },
    { label: "Wed", organizations: 10, users: 160 },
    { label: "Thu", organizations: 15, users: 182 },
    { label: "Fri", organizations: 13, users: 210 },
    { label: "Sat", organizations: 18, users: 225 },
    { label: "Sun", organizations: 21, users: 248 },
  ],
  "30 days": [
    { label: "Week 1", organizations: 18, users: 420 },
    { label: "Week 2", organizations: 27, users: 560 },
    { label: "Week 3", organizations: 35, users: 740 },
    { label: "Week 4", organizations: 46, users: 920 },
  ],
  "90 days": [
    { label: "Month 1", organizations: 35, users: 680 },
    { label: "Month 2", organizations: 58, users: 1050 },
    { label: "Month 3", organizations: 82, users: 1480 },
  ],
};

const METRICS_BY_PERIOD = {
  "7 days": {
    orgs: { value: "186", change: "+4.2%" },
    users: { value: "1,248", change: "+6.8%" },
    active: { value: "892", change: "+5.1%" },
    tasks: { value: "4,820", change: "+12.4%" },
  },
  "30 days": {
    orgs: { value: "248", change: "+12.8%" },
    users: { value: "12,840", change: "+18.4%" },
    active: { value: "8,624", change: "+8.6%" },
    tasks: { value: "34,592", change: "+24.3%" },
  },
  "90 days": {
    orgs: { value: "310", change: "+28.5%" },
    users: { value: "24,650", change: "+32.1%" },
    active: { value: "16,400", change: "+19.4%" },
    tasks: { value: "89,400", change: "+44.8%" },
  },
};

const initialOrganizations = [
  { name: "Acme Technologies", users: 245, tasks: 1240, activity: 92 },
  { name: "Nova Solutions", users: 182, tasks: 980, activity: 84 },
  { name: "Pixel Studios", users: 146, tasks: 765, activity: 76 },
  { name: "Vertex Systems", users: 98, tasks: 520, activity: 63 },
  { name: "Bright Labs", users: 74, tasks: 310, activity: 51 },
];

const taskData = [
  { name: "Completed", value: 64, color: "#16a34a" },
  { name: "In Progress", value: 24, color: "#6366f1" },
  { name: "Pending", value: 12, color: "#f59e0b" },
];

const activityData = [
  { label: "Mon", active: 420 },
  { label: "Tue", active: 510 },
  { label: "Wed", active: 465 },
  { label: "Thu", active: 620 },
  { label: "Fri", active: 570 },
  { label: "Sat", active: 350 },
  { label: "Sun", active: 290 },
];

const tooltipStyle = {
  borderRadius: "10px",
  border: "1px solid #e5e7eb",
  boxShadow: "0 8px 24px rgba(15, 23, 42, 0.08)",
  fontSize: "12px",
};

function MetricCard({
  title,
  value,
  change,
  description,
  icon: Icon,
  positive = true,
}) {
  return (
    <article className="analytics-metric-card">
      <div className="analytics-metric-top">
        <span className="analytics-metric-title">{title}</span>
        <span className="analytics-metric-icon">
          <Icon size={19} />
        </span>
      </div>

      <div className="analytics-metric-value">{value}</div>

      <div className="analytics-metric-bottom">
        <span
          className={`analytics-change ${
            positive ? "analytics-change-positive" : "analytics-change-negative"
          }`}
        >
          {positive ? (
            <ArrowUpRight size={15} />
          ) : (
            <ArrowDownRight size={15} />
          )}
          {change}
        </span>
        <span className="analytics-metric-description">{description}</span>
      </div>
    </article>
  );
}

function Analytics() {
  const [period, setPeriod] = useState("30 days");
  const [organizationQuery, setOrganizationQuery] = useState("");

  const filteredOrganizations = useMemo(() => {
    const query = organizationQuery.trim().toLowerCase();

    if (!query) return initialOrganizations;

    return initialOrganizations.filter((organization) =>
      organization.name.toLowerCase().includes(query)
    );
  }, [organizationQuery]);

  const selectedGrowth = growthData[period];
  const periodMetrics = METRICS_BY_PERIOD[period] || METRICS_BY_PERIOD["30 days"];

  const handleExport = () => {
    const rows = [
      ["Organization", "Users", "Tasks", "Activity Score"],
      ...initialOrganizations.map((organization) => [
        organization.name,
        organization.users,
        organization.tasks,
        `${organization.activity}%`,
      ]),
    ];

    const csv = rows
      .map((row) =>
        row
          .map((value) => `"${String(value).replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "teamflow-platform-analytics.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="analytics-page">
      <header className="analytics-page-header">
        <div>
          <div className="analytics-eyebrow">
            <Activity size={14} />
            PLATFORM OVERVIEW
          </div>

          <h1>Platform Analytics</h1>

          <p>
            Monitor platform growth, user engagement, and organization
            performance from one place.
          </p>
        </div>

        <div className="analytics-header-actions">
          <label className="analytics-period-control">
            <CalendarDays size={17} />
            <select
              value={period}
              onChange={(event) => setPeriod(event.target.value)}
              aria-label="Analytics time period"
            >
              <option value="7 days">Last 7 days</option>
              <option value="30 days">Last 30 days</option>
              <option value="90 days">Last 90 days</option>
            </select>
          </label>

          <button className="analytics-export-button" onClick={handleExport}>
            <Download size={16} />
            Export CSV
          </button>
        </div>
      </header>

      <section className="analytics-metrics-grid">
        <MetricCard
          title="Total Organizations"
          value={periodMetrics.orgs.value}
          change={periodMetrics.orgs.change}
          description="vs. previous period"
          icon={Building2}
        />

        <MetricCard
          title="Total Users"
          value={periodMetrics.users.value}
          change={periodMetrics.users.change}
          description="vs. previous period"
          icon={Users}
        />

        <MetricCard
          title="Active Users"
          value={periodMetrics.active.value}
          change={periodMetrics.active.change}
          description="vs. previous period"
          icon={Activity}
        />

        <MetricCard
          title="Tasks Completed"
          value={periodMetrics.tasks.value}
          change={periodMetrics.tasks.change}
          description="vs. previous period"
          icon={CheckCircle2}
        />
      </section>

      <section className="analytics-main-grid">
        <article className="analytics-panel analytics-growth-panel">
          <div className="analytics-panel-header">
            <div>
              <h2>Platform Growth</h2>
              <p>Organization and user growth over time</p>
            </div>

            <span className="analytics-live-label">
              <span />
              Demo data
            </span>
          </div>

          <div className="analytics-chart-legend">
            <span>
              <i className="analytics-legend-dot analytics-legend-indigo" />
              Organizations
            </span>
            <span>
              <i className="analytics-legend-dot analytics-legend-blue" />
              Users
            </span>
          </div>

          <div className="analytics-growth-chart">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={selectedGrowth}
                margin={{ top: 12, right: 8, left: -18, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="organizationGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="#6366f1"
                      stopOpacity={0.2}
                    />
                    <stop
                      offset="100%"
                      stopColor="#6366f1"
                      stopOpacity={0}
                    />
                  </linearGradient>

                  <linearGradient
                    id="usersGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="#0ea5e9"
                      stopOpacity={0.18}
                    />
                    <stop
                      offset="100%"
                      stopColor="#0ea5e9"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  stroke="#edf0f5"
                  strokeDasharray="4 4"
                  vertical={false}
                />

                <XAxis
                  dataKey="label"
                  tick={{ fill: "#8992a5", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  tickMargin={12}
                />

                <YAxis
                  tick={{ fill: "#8992a5", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  tickMargin={8}
                />

                <Tooltip contentStyle={tooltipStyle} />

                <Area
                  type="monotone"
                  dataKey="organizations"
                  name="Organizations"
                  stroke="#6366f1"
                  strokeWidth={2.5}
                  fill="url(#organizationGradient)"
                  activeDot={{ r: 5 }}
                />

                <Area
                  type="monotone"
                  dataKey="users"
                  name="Users"
                  stroke="#0ea5e9"
                  strokeWidth={2.5}
                  fill="url(#usersGradient)"
                  activeDot={{ r: 5 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="analytics-panel analytics-task-panel">
          <div className="analytics-panel-header">
            <div>
              <h2>Task Overview</h2>
              <p>Distribution across all organizations</p>
            </div>
          </div>

          <div className="analytics-task-chart">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={taskData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={67}
                  outerRadius={94}
                  paddingAngle={4}
                  stroke="none"
                >
                  {taskData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>

                <Tooltip
                  formatter={(value) => [`${value}%`, "Tasks"]}
                  contentStyle={tooltipStyle}
                />
              </PieChart>
            </ResponsiveContainer>

            <div className="analytics-donut-center">
              <strong>100%</strong>
              <span>Task status</span>
            </div>
          </div>

          <div className="analytics-task-legend">
            {taskData.map((task) => (
              <div className="analytics-task-legend-row" key={task.name}>
                <span>
                  <i style={{ background: task.color }} />
                  {task.name}
                </span>
                <strong>{task.value}%</strong>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="analytics-bottom-grid">
        <article className="analytics-panel analytics-activity-panel">
          <div className="analytics-panel-header">
            <div>
              <h2>User Activity</h2>
              <p>Active users throughout the week</p>
            </div>

            <span className="analytics-activity-total">
              <Zap size={15} />
              3,225 active sessions
            </span>
          </div>

          <div className="analytics-activity-chart">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={activityData}
                margin={{ top: 10, right: 4, left: -18, bottom: 0 }}
              >
                <CartesianGrid
                  stroke="#edf0f5"
                  strokeDasharray="4 4"
                  vertical={false}
                />

                <XAxis
                  dataKey="label"
                  tick={{ fill: "#8992a5", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  tickMargin={10}
                />

                <YAxis
                  tick={{ fill: "#8992a5", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip contentStyle={tooltipStyle} />

                <Bar
                  dataKey="active"
                  name="Active users"
                  fill="#6366f1"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={36}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="analytics-panel analytics-performance-panel">
          <div className="analytics-panel-header">
            <div>
              <h2>Platform Health</h2>
              <p>Key operational indicators</p>
            </div>
            <span className="analytics-health-status">Healthy</span>
          </div>

          <div className="analytics-health-list">
            <div className="analytics-health-item">
              <span className="analytics-health-icon analytics-health-purple">
                <TrendingUp size={18} />
              </span>
              <div className="analytics-health-copy">
                <strong>Platform uptime</strong>
                <span>Service availability</span>
              </div>
              <div className="analytics-health-value">
                <strong>99.9%</strong>
                <span>+0.2%</span>
              </div>
            </div>

            <div className="analytics-health-item">
              <span className="analytics-health-icon analytics-health-blue">
                <Clock3 size={18} />
              </span>
              <div className="analytics-health-copy">
                <strong>Average response</strong>
                <span>API response time</span>
              </div>
              <div className="analytics-health-value">
                <strong>142 ms</strong>
                <span>−8.4%</span>
              </div>
            </div>

            <div className="analytics-health-item">
              <span className="analytics-health-icon analytics-health-green">
                <CheckCircle2 size={18} />
              </span>
              <div className="analytics-health-copy">
                <strong>Task success rate</strong>
                <span>Successfully completed</span>
              </div>
              <div className="analytics-health-value">
                <strong>96.8%</strong>
                <span>+2.1%</span>
              </div>
            </div>
          </div>

          <div className="analytics-health-note">
            <span />
            All indicators are within expected ranges.
          </div>
        </article>
      </section>

      <section className="analytics-panel analytics-organizations-panel">
        <div className="analytics-panel-header analytics-organizations-header">
          <div>
            <h2>Top Organizations</h2>
            <p>Organizations ranked by platform activity</p>
          </div>

          <label className="analytics-search">
            <Activity size={15} />
            <input
              type="search"
              value={organizationQuery}
              onChange={(event) => setOrganizationQuery(event.target.value)}
              placeholder="Search organizations..."
            />
          </label>
        </div>

        <div className="analytics-table-wrapper">
          <table className="analytics-table">
            <thead>
              <tr>
                <th>Organization</th>
                <th>Total users</th>
                <th>Tasks created</th>
                <th>Activity score</th>
                <th>Performance</th>
              </tr>
            </thead>

            <tbody>
              {filteredOrganizations.map((organization) => (
                <tr key={organization.name}>
                  <td>
                    <div className="analytics-organization-name">
                      <span>
                        {organization.name
                          .split(" ")
                          .map((word) => word[0])
                          .join("")
                          .slice(0, 2)}
                      </span>
                      <strong>{organization.name}</strong>
                    </div>
                  </td>

                  <td>{organization.users.toLocaleString()}</td>
                  <td>{organization.tasks.toLocaleString()}</td>

                  <td>
                    <strong>{organization.activity}%</strong>
                  </td>

                  <td>
                    <div className="analytics-performance-bar">
                      <span
                        style={{ width: `${organization.activity}%` }}
                      />
                    </div>
                  </td>
                </tr>
              ))}

              {filteredOrganizations.length === 0 && (
                <tr>
                  <td colSpan="5" className="analytics-empty-state">
                    No organizations match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="analytics-table-footer">
          Showing {filteredOrganizations.length} of {initialOrganizations.length}{" "}
          organizations
        </div>
      </section>

      <p className="analytics-disclaimer">
        <Activity size={13} />
        Analytics currently uses sample data. Connect the backend to display
        live platform metrics.
      </p>
    </div>
  );
}

export default Analytics;