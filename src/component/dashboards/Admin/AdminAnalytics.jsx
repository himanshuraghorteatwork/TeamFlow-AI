import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart3,
  TrendingUp,
  Users,
  Building2,
  FolderKanban,
  CircleDollarSign,
  Activity,
  Download,
  RefreshCw,
  ArrowUpRight,
  CheckCircle2,
  Zap,
  HardDrive,
  Cpu,
  Clock,
  Sparkles,
  ChevronRight,
  Search,
  Filter,
  ArrowUp,
  ArrowDown,
  Layers,
  FileSpreadsheet
} from "lucide-react";
import AdminSidebar from "./AdminSidebar.jsx";
import AdminTopbar from "./AdminTopbar.jsx";
import {
  analyticsSummary,
  growthData,
  revenueData,
  workspaceDistribution,
  planDistribution,
  activityData,
  topWorkspaces,
  systemMetrics
} from "./adminAnalyticsData.js";
import "./AdminAnalytics.css";

export default function AdminAnalytics() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [range, setRange] = useState("30 Days");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState(new Date());
  const [chartMetric, setChartMetric] = useState("both"); // 'both' | 'users' | 'active'
  const [workspaceSearch, setWorkspaceSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("all");
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [hoveredBar, setHoveredBar] = useState(null);
  const [selectedDonutDept, setSelectedDonutDept] = useState(null);

  // Growth Data based on range
  const currentGrowth = useMemo(() => {
    return growthData[range] || growthData["30 Days"];
  }, [range]);

  // Filtered Top Workspaces
  const filteredWorkspaces = useMemo(() => {
    return topWorkspaces.filter(ws => {
      const matchesSearch = ws.name.toLowerCase().includes(workspaceSearch.toLowerCase()) ||
        ws.department.toLowerCase().includes(workspaceSearch.toLowerCase());
      const matchesDept = deptFilter === "all" || ws.department.toLowerCase() === deptFilter.toLowerCase();
      return matchesSearch && matchesDept;
    });
  }, [workspaceSearch, deptFilter]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setLastRefreshed(new Date());
      setIsRefreshing(false);
    }, 650);
  };

  const handleExportCSV = () => {
    const headers = ["Metric", "Value", "Trend", "Timeframe"];
    const rows = [
      ["Total Users", analyticsSummary.totalUsers, "+14.2%", range],
      ["Active Users", analyticsSummary.activeUsers, "+11.8%", range],
      ["Total Workspaces", analyticsSummary.totalWorkspaces, "+8.5%", range],
      ["Active Projects", analyticsSummary.totalProjects, "+9.1%", range],
      ["Monthly Recurring Revenue ($)", analyticsSummary.monthlyRevenue, "+12.4%", range],
      ["SLA Uptime", "99.98%", "Optimal", "Trailing 30 Days"]
    ];

    const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `teamflow_analytics_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // SVG Line Chart coordinates calculation
  const chartWidth = 720;
  const chartHeight = 220;
  const chartPadding = { top: 20, right: 25, bottom: 35, left: 45 };

  const maxVal = useMemo(() => {
    const allVals = currentGrowth.flatMap(d => [d.users, d.active]);
    return Math.max(...allVals, 100) * 1.15;
  }, [currentGrowth]);

  const pointsUsers = useMemo(() => {
    const innerW = chartWidth - chartPadding.left - chartPadding.right;
    const innerH = chartHeight - chartPadding.top - chartPadding.bottom;
    const step = innerW / Math.max(currentGrowth.length - 1, 1);

    return currentGrowth.map((d, i) => {
      const x = chartPadding.left + i * step;
      const y = chartPadding.top + innerH - (d.users / maxVal) * innerH;
      return { x, y, ...d };
    });
  }, [currentGrowth, maxVal]);

  const pointsActive = useMemo(() => {
    const innerW = chartWidth - chartPadding.left - chartPadding.right;
    const innerH = chartHeight - chartPadding.top - chartPadding.bottom;
    const step = innerW / Math.max(currentGrowth.length - 1, 1);

    return currentGrowth.map((d, i) => {
      const x = chartPadding.left + i * step;
      const y = chartPadding.top + innerH - (d.active / maxVal) * innerH;
      return { x, y, ...d };
    });
  }, [currentGrowth, maxVal]);

  const makePath = (points) => {
    if (points.length === 0) return "";
    return points.reduce((acc, pt, i) => {
      if (i === 0) return `M ${pt.x} ${pt.y}`;
      // Smooth cubic bezier curve
      const prev = points[i - 1];
      const cx1 = prev.x + (pt.x - prev.x) / 2;
      const cy1 = prev.y;
      const cx2 = prev.x + (pt.x - prev.x) / 2;
      const cy2 = pt.y;
      return `${acc} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${pt.x} ${pt.y}`;
    }, "");
  };

  const lineUsers = useMemo(() => makePath(pointsUsers), [pointsUsers]);
  const lineActive = useMemo(() => makePath(pointsActive), [pointsActive]);

  const areaUsers = useMemo(() => {
    if (pointsUsers.length === 0) return "";
    const bottomY = chartHeight - chartPadding.bottom;
    const firstX = pointsUsers[0].x;
    const lastX = pointsUsers[pointsUsers.length - 1].x;
    return `${lineUsers} L ${lastX} ${bottomY} L ${firstX} ${bottomY} Z`;
  }, [lineUsers, pointsUsers]);

  const areaActive = useMemo(() => {
    if (pointsActive.length === 0) return "";
    const bottomY = chartHeight - chartPadding.bottom;
    const firstX = pointsActive[0].x;
    const lastX = pointsActive[pointsActive.length - 1].x;
    return `${lineActive} L ${lastX} ${bottomY} L ${firstX} ${bottomY} Z`;
  }, [lineActive, pointsActive]);

  // Donut chart total
  const totalWorkspaceCount = useMemo(() => {
    return workspaceDistribution.reduce((acc, item) => acc + item.value, 0);
  }, []);

  const donutColors = ["#6366f1", "#06b6d4", "#10b981", "#f59e0b", "#ec4899", "#8b5cf6"];

  return (
    <div className="admin-analytics-app">
      <AdminSidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <main className="admin-analytics-main">
        <AdminTopbar onMobileMenuToggle={() => setMobileOpen(true)} />

        <div className="admin-analytics-content">
          {/* Header Section */}
          <div className="admin-analytics-header">
            <div>
              <div className="admin-analytics-title-row">
                <h1>Analytics & Performance</h1>
                <div className="live-status-pill">
                  <span className="pulse-dot" />
                  <span>Live telemetry</span>
                  <span className="timestamp">
                    Updated {lastRefreshed.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                  </span>
                </div>
              </div>
              <p>Real-time organizational insights, user adoption rates, velocity trends, and platform metrics.</p>
            </div>

            <div className="admin-analytics-header-actions">
              <div className="range-selector">
                {["7 Days", "30 Days", "90 Days"].map((r) => (
                  <button
                    key={r}
                    className={`range-btn ${range === r ? "active" : ""}`}
                    onClick={() => setRange(r)}
                  >
                    {r}
                  </button>
                ))}
              </div>

              <button
                className={`admin-analytics-btn-secondary ${isRefreshing ? "spin" : ""}`}
                onClick={handleRefresh}
                title="Refresh Analytics Data"
              >
                <RefreshCw size={15} />
                <span>{isRefreshing ? "Syncing..." : "Refresh"}</span>
              </button>

              <button className="admin-analytics-btn-primary" onClick={handleExportCSV}>
                <FileSpreadsheet size={15} />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          {/* KPI Cards Row */}
          <div className="admin-analytics-kpi-grid">
            <div className="admin-analytics-kpi-card">
              <div className="kpi-top">
                <span className="kpi-label">Total Users</span>
                <div className="kpi-icon-box purple">
                  <Users size={18} />
                </div>
              </div>
              <div className="kpi-val-row">
                <span className="kpi-val">{analyticsSummary.totalUsers.toLocaleString()}</span>
                <span className="kpi-badge positive">
                  <ArrowUp size={12} /> +14.2%
                </span>
              </div>
              <div className="kpi-subtext">
                <strong>{analyticsSummary.activeUsers}</strong> active now ({Math.round((analyticsSummary.activeUsers / analyticsSummary.totalUsers) * 100)}% engagement)
              </div>
            </div>

            <div className="admin-analytics-kpi-card">
              <div className="kpi-top">
                <span className="kpi-label">Active Workspaces</span>
                <div className="kpi-icon-box blue">
                  <Building2 size={18} />
                </div>
              </div>
              <div className="kpi-val-row">
                <span className="kpi-val">{analyticsSummary.totalWorkspaces.toLocaleString()}</span>
                <span className="kpi-badge positive">
                  <ArrowUp size={12} /> +8.5%
                </span>
              </div>
              <div className="kpi-subtext">Across 6 organizational departments</div>
            </div>

            <div className="admin-analytics-kpi-card">
              <div className="kpi-top">
                <span className="kpi-label">Total Projects</span>
                <div className="kpi-icon-box green">
                  <FolderKanban size={18} />
                </div>
              </div>
              <div className="kpi-val-row">
                <span className="kpi-val">{analyticsSummary.totalProjects.toLocaleString()}</span>
                <span className="kpi-badge positive">
                  <ArrowUp size={12} /> +9.1%
                </span>
              </div>
              <div className="kpi-subtext">3,421 tasks tracked with 94% on-time velocity</div>
            </div>

            <div className="admin-analytics-kpi-card">
              <div className="kpi-top">
                <span className="kpi-label">Monthly Revenue (MRR)</span>
                <div className="kpi-icon-box amber">
                  <CircleDollarSign size={18} />
                </div>
              </div>
              <div className="kpi-val-row">
                <span className="kpi-val">${analyticsSummary.monthlyRevenue.toLocaleString()}</span>
                <span className="kpi-badge positive">
                  <ArrowUp size={12} /> +12.4%
                </span>
              </div>
              <div className="kpi-subtext">Enterprise tiers driving 58% of growth</div>
            </div>

            <div className="admin-analytics-kpi-card">
              <div className="kpi-top">
                <span className="kpi-label">System Uptime</span>
                <div className="kpi-icon-box teal">
                  <Activity size={18} />
                </div>
              </div>
              <div className="kpi-val-row">
                <span className="kpi-val">99.98%</span>
                <span className="kpi-badge positive">
                  <CheckCircle2 size={12} /> SLA Met
                </span>
              </div>
              <div className="kpi-subtext">Avg latency 48ms • Zero security incidents</div>
            </div>
          </div>

          {/* Main Visualizations Grid */}
          <div className="admin-analytics-main-grid">
            {/* User Growth Line Chart */}
            <div className="admin-analytics-card growth-chart-card">
              <div className="card-header">
                <div>
                  <h3>User Growth & Daily Active Telemetry</h3>
                  <p>Tracking registered members vs active concurrent sessions over time</p>
                </div>
                <div className="chart-controls">
                  <div className="metric-toggle">
                    <button
                      className={chartMetric === "both" ? "active" : ""}
                      onClick={() => setChartMetric("both")}
                    >
                      All
                    </button>
                    <button
                      className={chartMetric === "users" ? "active" : ""}
                      onClick={() => setChartMetric("users")}
                    >
                      Registered
                    </button>
                    <button
                      className={chartMetric === "active" ? "active" : ""}
                      onClick={() => setChartMetric("active")}
                    >
                      Active
                    </button>
                  </div>
                </div>
              </div>

              <div className="chart-legend">
                {(chartMetric === "both" || chartMetric === "users") && (
                  <div className="legend-item">
                    <span className="legend-color-dot purple" />
                    <span>Total Members</span>
                  </div>
                )}
                {(chartMetric === "both" || chartMetric === "active") && (
                  <div className="legend-item">
                    <span className="legend-color-dot cyan" />
                    <span>Active Sessions</span>
                  </div>
                )}
              </div>

              {/* SVG Curve Chart */}
              <div className="svg-chart-container">
                <svg
                  viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                  className="interactive-svg-chart"
                >
                  <defs>
                    <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366f1" stopOpacity="0.32" />
                      <stop offset="100%" stopColor="#6366f1" stopOpacity="0.01" />
                    </linearGradient>
                    <linearGradient id="cyanGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.32" />
                      <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.01" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal Gridlines */}
                  {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
                    const y = chartPadding.top + (chartHeight - chartPadding.top - chartPadding.bottom) * pct;
                    const val = Math.round(maxVal * (1 - pct));
                    return (
                      <g key={i}>
                        <line
                          x1={chartPadding.left}
                          y1={y}
                          x2={chartWidth - chartPadding.right}
                          y2={y}
                          stroke="currentColor"
                          strokeDasharray="4 4"
                          className="chart-gridline"
                        />
                        <text
                          x={chartPadding.left - 8}
                          y={y + 4}
                          textAnchor="end"
                          className="chart-axis-label"
                        >
                          {val}
                        </text>
                      </g>
                    );
                  })}

                  {/* Areas */}
                  {(chartMetric === "both" || chartMetric === "users") && (
                    <path d={areaUsers} fill="url(#purpleGradient)" />
                  )}
                  {(chartMetric === "both" || chartMetric === "active") && (
                    <path d={areaActive} fill="url(#cyanGradient)" />
                  )}

                  {/* Lines */}
                  {(chartMetric === "both" || chartMetric === "users") && (
                    <path d={lineUsers} fill="none" stroke="#6366f1" strokeWidth="2.5" />
                  )}
                  {(chartMetric === "both" || chartMetric === "active") && (
                    <path d={lineActive} fill="none" stroke="#06b6d4" strokeWidth="2.5" />
                  )}

                  {/* Interactive Points and Labels */}
                  {pointsUsers.map((pt, i) => (
                    <g key={i}>
                      <text
                        x={pt.x}
                        y={chartHeight - 12}
                        textAnchor="middle"
                        className="chart-axis-label"
                      >
                        {pt.label}
                      </text>

                      {/* Hover Trigger Vertical line */}
                      {hoveredPoint === i && (
                        <line
                          x1={pt.x}
                          y1={chartPadding.top}
                          x2={pt.x}
                          y2={chartHeight - chartPadding.bottom}
                          stroke="#94a3b8"
                          strokeDasharray="3 3"
                          strokeWidth="1.2"
                        />
                      )}

                      {/* Target circles */}
                      {(chartMetric === "both" || chartMetric === "users") && (
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r={hoveredPoint === i ? 5.5 : 3.5}
                          fill="#ffffff"
                          stroke="#6366f1"
                          strokeWidth="2.5"
                          style={{ cursor: "pointer", transition: "all 0.15s ease" }}
                        />
                      )}

                      {(chartMetric === "both" || chartMetric === "active") && (
                        <circle
                          cx={pointsActive[i].x}
                          cy={pointsActive[i].y}
                          r={hoveredPoint === i ? 5.5 : 3.5}
                          fill="#ffffff"
                          stroke="#06b6d4"
                          strokeWidth="2.5"
                          style={{ cursor: "pointer", transition: "all 0.15s ease" }}
                        />
                      )}

                      {/* Invisible hover overlay column */}
                      <rect
                        x={pt.x - 20}
                        y={chartPadding.top}
                        width={40}
                        height={chartHeight - chartPadding.top - chartPadding.bottom}
                        fill="transparent"
                        style={{ cursor: "pointer" }}
                        onMouseEnter={() => setHoveredPoint(i)}
                        onMouseLeave={() => setHoveredPoint(null)}
                      />
                    </g>
                  ))}
                </svg>

                {/* Tooltip Overlay */}
                {hoveredPoint !== null && (
                  <div
                    className="chart-hover-tooltip"
                    style={{
                      left: `${(pointsUsers[hoveredPoint].x / chartWidth) * 100}%`,
                      top: "20px"
                    }}
                  >
                    <div className="tooltip-title">{pointsUsers[hoveredPoint].label}</div>
                    <div className="tooltip-item purple">
                      <span>Total Users:</span>
                      <strong>{pointsUsers[hoveredPoint].users}</strong>
                    </div>
                    <div className="tooltip-item cyan">
                      <span>Active Sessions:</span>
                      <strong>{pointsUsers[hoveredPoint].active}</strong>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Department Workspace Donut Chart */}
            <div className="admin-analytics-card donut-chart-card">
              <div className="card-header">
                <div>
                  <h3>Workspaces by Department</h3>
                  <p>Resource utilization by business unit</p>
                </div>
              </div>

              <div className="donut-content-layout">
                {/* Visual Conic Donut */}
                <div className="donut-circle-container">
                  <div
                    className="donut-circle"
                    style={{
                      background: `conic-gradient(
                        #6366f1 0% 38%,
                        #06b6d4 38% 62%,
                        #10b981 62% 78%,
                        #f59e0b 78% 88%,
                        #ec4899 88% 95%,
                        #8b5cf6 95% 100%
                      )`
                    }}
                  >
                    <div className="donut-center-hole">
                      <span className="donut-total-count">{totalWorkspaceCount}</span>
                      <span className="donut-total-label">Workspaces</span>
                    </div>
                  </div>
                </div>

                {/* Legend & Breakdown List */}
                <div className="donut-legend-list">
                  {workspaceDistribution.map((item, index) => {
                    const color = donutColors[index % donutColors.length];
                    const percent = Math.round((item.value / totalWorkspaceCount) * 100);
                    const isSelected = selectedDonutDept === item.name;

                    return (
                      <div
                        key={item.name}
                        className={`donut-legend-row ${isSelected ? "selected" : ""}`}
                        onMouseEnter={() => setSelectedDonutDept(item.name)}
                        onMouseLeave={() => setSelectedDonutDept(null)}
                      >
                        <div className="legend-left">
                          <span className="dot" style={{ background: color }} />
                          <span className="name">{item.name}</span>
                        </div>
                        <div className="legend-right">
                          <span className="val">{item.value} units</span>
                          <span className="pct">({percent}%)</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Three-Column Insights Row */}
          <div className="admin-analytics-three-grid">
            {/* Revenue Trend Bars */}
            <div className="admin-analytics-card">
              <div className="card-header">
                <div>
                  <h3>Monthly Revenue Trend</h3>
                  <p>Recurring billing cash flow</p>
                </div>
                <CircleDollarSign size={18} className="text-muted" />
              </div>

              <div className="revenue-bars-container">
                {revenueData.map((item, index) => {
                  const maxRev = Math.max(...revenueData.map(r => r.revenue));
                  const heightPct = Math.round((item.revenue / maxRev) * 100);
                  const isHovered = hoveredBar === index;

                  return (
                    <div
                      key={item.month}
                      className="rev-col-wrapper"
                      onMouseEnter={() => setHoveredBar(index)}
                      onMouseLeave={() => setHoveredBar(null)}
                    >
                      {isHovered && (
                        <div className="bar-tooltip">
                          ${(item.revenue / 1000).toFixed(1)}k
                        </div>
                      )}
                      <div className="rev-bar-track">
                        <div
                          className={`rev-bar-fill ${isHovered ? "active" : ""}`}
                          style={{ height: `${heightPct}%` }}
                        />
                      </div>
                      <span className="rev-col-label">{item.month}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Plan Distribution */}
            <div className="admin-analytics-card">
              <div className="card-header">
                <div>
                  <h3>Subscription Tier Mix</h3>
                  <p>Paid seats vs enterprise licenses</p>
                </div>
                <Layers size={18} className="text-muted" />
              </div>

              <div className="plan-bars-list">
                {planDistribution.map((plan) => {
                  const totalPlans = planDistribution.reduce((a, b) => a + b.value, 0);
                  const pct = Math.round((plan.value / totalPlans) * 100);

                  return (
                    <div key={plan.name} className="plan-item-box">
                      <div className="plan-header-row">
                        <div className="plan-name-badge">
                          <span className={`plan-dot ${plan.name.toLowerCase()}`} />
                          <span className="plan-title">{plan.name}</span>
                        </div>
                        <div className="plan-nums">
                          <strong>{plan.value}</strong>
                          <span className="pct">({pct}%)</span>
                        </div>
                      </div>
                      <div className="plan-progress-track">
                        <div
                          className={`plan-progress-fill ${plan.name.toLowerCase()}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Weekly Velocity Activity */}
            <div className="admin-analytics-card">
              <div className="card-header">
                <div>
                  <h3>Weekly Task Activity</h3>
                  <p>Daily volume of created vs completed tasks</p>
                </div>
                <Zap size={18} className="text-muted" />
              </div>

              <div className="activity-bars-container">
                {activityData.map((act) => {
                  const maxAct = 120;
                  const createdH = Math.round((act.created / maxAct) * 100);
                  const doneH = Math.round((act.completed / maxAct) * 100);

                  return (
                    <div key={act.day} className="act-col-wrapper">
                      <div className="act-dual-bars">
                        <div
                          className="act-bar created"
                          style={{ height: `${createdH}%` }}
                          title={`Created: ${act.created}`}
                        />
                        <div
                          className="act-bar done"
                          style={{ height: `${doneH}%` }}
                          title={`Completed: ${act.completed}`}
                        />
                      </div>
                      <span className="act-col-label">{act.day}</span>
                    </div>
                  );
                })}
              </div>

              <div className="activity-footer-legend">
                <div className="legend-item">
                  <span className="legend-box purple" />
                  <span>Created</span>
                </div>
                <div className="legend-item">
                  <span className="legend-box emerald" />
                  <span>Completed</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Grid: Workspaces Performance & System Metrics */}
          <div className="admin-analytics-bottom-grid">
            {/* Top Workspaces Table */}
            <div className="admin-analytics-card workspace-table-card">
              <div className="card-header">
                <div>
                  <h3>Top Performing Workspaces</h3>
                  <p>Workspaces ranked by team member engagement and output</p>
                </div>
                <button
                  className="table-action-link"
                  onClick={() => navigate("/admin/workspaces")}
                >
                  <span>View All Workspaces</span>
                  <ArrowUpRight size={15} />
                </button>
              </div>

              {/* Table Toolbar */}
              <div className="table-toolbar">
                <div className="table-search">
                  <Search size={15} />
                  <input
                    type="text"
                    placeholder="Search top workspaces..."
                    value={workspaceSearch}
                    onChange={(e) => setWorkspaceSearch(e.target.value)}
                  />
                </div>

                <div className="table-filter">
                  <Filter size={14} />
                  <select
                    value={deptFilter}
                    onChange={(e) => setDeptFilter(e.target.value)}
                  >
                    <option value="all">All Departments</option>
                    <option value="engineering">Engineering</option>
                    <option value="product">Product</option>
                    <option value="marketing">Marketing</option>
                    <option value="sales">Sales</option>
                    <option value="operations">Operations</option>
                  </select>
                </div>
              </div>

              <div className="table-container">
                <table className="admin-analytics-table">
                  <thead>
                    <tr>
                      <th style={{ width: 44, textAlign: "center" }}>#</th>
                      <th>WORKSPACE</th>
                      <th>DEPARTMENT</th>
                      <th>PLAN</th>
                      <th>MEMBERS</th>
                      <th>STORAGE USED</th>
                      <th>HEALTH SCORE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredWorkspaces.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="empty-cell">
                          No workspaces match your query.
                        </td>
                      </tr>
                    ) : (
                      filteredWorkspaces.map((ws, idx) => (
                        <tr key={ws.name}>
                          <td style={{ textAlign: "center" }}>
                            <span className="admin-row-num">{idx + 1}</span>
                          </td>
                          <td>
                            <div className="workspace-name-cell">
                              <span className="ws-avatar">{ws.name.slice(0, 2).toUpperCase()}</span>
                              <span className="ws-title">{ws.name}</span>
                            </div>
                          </td>
                          <td>
                            <span className="dept-pill">{ws.department}</span>
                          </td>
                          <td>
                            <span className={`plan-badge ${ws.plan.toLowerCase()}`}>{ws.plan}</span>
                          </td>
                          <td>
                            <span className="members-count">{ws.users} seats</span>
                          </td>
                          <td>
                            <div className="storage-meter">
                              <div className="meter-track">
                                <div
                                  className="meter-fill"
                                  style={{ width: `${Math.min(ws.storage, 100)}%` }}
                                />
                              </div>
                              <span className="meter-val">{ws.storage}%</span>
                            </div>
                          </td>
                          <td>
                            <div className="health-score-cell">
                              <span className="score-val">{ws.activity}%</span>
                              <span className="score-status good">Optimal</span>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* System Health Card */}
            <div className="admin-analytics-card system-health-card">
              <div className="card-header">
                <div>
                  <h3>Infrastructure Telemetry</h3>
                  <p>Resource utilization & uptime</p>
                </div>
                <Cpu size={18} className="text-muted" />
              </div>

              <div className="system-metrics-list">
                {systemMetrics.map((metric) => {
                  let statusColor = "green";
                  if (metric.value > 80) statusColor = "amber";
                  if (metric.value > 90) statusColor = "red";

                  return (
                    <div key={metric.name} className="system-metric-row">
                      <div className="metric-info-row">
                        <span className="metric-name">{metric.name}</span>
                        <div className="metric-val-wrap">
                          <span className={`metric-tag ${statusColor}`}>
                            {metric.value < 75 ? "Normal" : metric.value < 85 ? "Moderate" : "High"}
                          </span>
                          <strong className="metric-percent">{metric.value}%</strong>
                        </div>
                      </div>
                      <div className="metric-track">
                        <div
                          className={`metric-fill ${statusColor}`}
                          style={{ width: `${metric.value}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="system-status-footer">
                <CheckCircle2 size={16} className="text-success" />
                <span>All platform clusters operating within normal limits.</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}