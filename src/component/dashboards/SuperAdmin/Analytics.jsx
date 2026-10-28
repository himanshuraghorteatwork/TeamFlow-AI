import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import {
  Activity,
  AlertTriangle,
  ArrowDown,
  ArrowDownRight,
  ArrowUp,
  ArrowUpDown,
  ArrowUpRight,
  BarChart3,
  Building2,
  CalendarDays,
  CheckCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Cpu,
  Database,
  Download,
  Eye,
  FileSpreadsheet,
  Filter,
  Layers,
  RotateCcw,
  Search,
  Server,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  TrendingUp,
  Users,
  X,
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
import orgAvatarImg from "../../../assets/images/organization-avatar.png";

// Growth Data by Period
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

// Activity Data by Period
const activityDataByPeriod = {
  "7 days": [
    { label: "Mon", active: 420 },
    { label: "Tue", active: 510 },
    { label: "Wed", active: 465 },
    { label: "Thu", active: 620 },
    { label: "Fri", active: 570 },
    { label: "Sat", active: 350 },
    { label: "Sun", active: 290 },
  ],
  "30 days": [
    { label: "Week 1", active: 1850 },
    { label: "Week 2", active: 2420 },
    { label: "Week 3", active: 2980 },
    { label: "Week 4", active: 3225 },
  ],
  "90 days": [
    { label: "Month 1", active: 6800 },
    { label: "Month 2", active: 9400 },
    { label: "Month 3", active: 12450 },
  ],
};

const sessionsByPeriod = {
  "7 days": "3,225 active sessions",
  "30 days": "31,400 active sessions",
  "90 days": "112,000 active sessions",
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

const ORGANIZATIONS_DATA = [
  {
    id: "ORG-2001",
    name: "Acme Technologies",
    domain: "Cloud & DevSecOps",
    plan: "Enterprise",
    users: 245,
    activeUsers: 226,
    tasks: 1240,
    storage: "42.5 GB",
    storageLimit: "100 GB",
    storagePct: 42.5,
    tokensUsed: "1.42M tokens",
    activity: 92,
    status: "Optimal",
    trend: "+14.2%",
    lastActive: "Just now",
    createdDate: "2025-08-14",
    sla: "99.99%",
    modules: ["AI Workflow Copilot", "Kanban Boards", "Team Chat", "REST Webhooks", "Enterprise SSO"],
  },
  {
    id: "ORG-2002",
    name: "Nova Solutions",
    domain: "FinTech & Payments",
    plan: "Business",
    users: 182,
    activeUsers: 153,
    tasks: 980,
    storage: "28.1 GB",
    storageLimit: "50 GB",
    storagePct: 56.2,
    tokensUsed: "890k tokens",
    activity: 84,
    status: "Optimal",
    trend: "+9.8%",
    lastActive: "5m ago",
    createdDate: "2025-09-20",
    sla: "99.95%",
    modules: ["AI Workflow Copilot", "Kanban Boards", "Team Chat", "Bug Tracking"],
  },
  {
    id: "ORG-2003",
    name: "Pixel Studios",
    domain: "UI/UX & Creative Agency",
    plan: "Starter",
    users: 146,
    activeUsers: 111,
    tasks: 765,
    storage: "19.4 GB",
    storageLimit: "25 GB",
    storagePct: 77.6,
    tokensUsed: "420k tokens",
    activity: 76,
    status: "Healthy",
    trend: "+5.1%",
    lastActive: "18m ago",
    createdDate: "2025-10-05",
    sla: "99.90%",
    modules: ["Kanban Boards", "Cloud File Storage", "Team Chat"],
  },
  {
    id: "ORG-2004",
    name: "Vertex Systems",
    domain: "Enterprise Supply Chain",
    plan: "Business",
    users: 98,
    activeUsers: 62,
    tasks: 520,
    storage: "14.2 GB",
    storageLimit: "50 GB",
    storagePct: 28.4,
    tokensUsed: "610k tokens",
    activity: 63,
    status: "Healthy",
    trend: "+2.4%",
    lastActive: "1h ago",
    createdDate: "2025-11-12",
    sla: "99.92%",
    modules: ["AI Workflow Copilot", "Kanban Boards", "REST Webhooks"],
  },
  {
    id: "ORG-2005",
    name: "Bright Labs",
    domain: "EdTech & Learning Labs",
    plan: "Starter",
    users: 74,
    activeUsers: 38,
    tasks: 310,
    storage: "8.6 GB",
    storageLimit: "25 GB",
    storagePct: 34.4,
    tokensUsed: "250k tokens",
    activity: 51,
    status: "Healthy",
    trend: "-1.8%",
    lastActive: "3h ago",
    createdDate: "2025-11-28",
    sla: "99.88%",
    modules: ["Kanban Boards", "Meeting Scheduler", "Team Chat"],
  },
  {
    id: "ORG-2006",
    name: "Orbit Digital",
    domain: "Global Media Group",
    plan: "Enterprise",
    users: 310,
    activeUsers: 288,
    tasks: 2150,
    storage: "68.0 GB",
    storageLimit: "150 GB",
    storagePct: 45.3,
    tokensUsed: "2.18M tokens",
    activity: 95,
    status: "Optimal",
    trend: "+18.6%",
    lastActive: "Just now",
    createdDate: "2025-07-02",
    sla: "99.99%",
    modules: ["AI Workflow Copilot", "Kanban Boards", "Team Chat", "Cloud File Storage", "Enterprise SSO"],
  },
  {
    id: "ORG-2007",
    name: "CloudPeak",
    domain: "Distributed Infrastructure",
    plan: "Business",
    users: 125,
    activeUsers: 94,
    tasks: 640,
    storage: "22.3 GB",
    storageLimit: "50 GB",
    storagePct: 44.6,
    tokensUsed: "740k tokens",
    activity: 75,
    status: "Healthy",
    trend: "+4.2%",
    lastActive: "45m ago",
    createdDate: "2025-12-01",
    sla: "99.96%",
    modules: ["AI Workflow Copilot", "Kanban Boards", "REST Webhooks"],
  },
  {
    id: "ORG-2008",
    name: "NextGen Works",
    domain: "AI Workflow Solutions",
    plan: "Starter",
    users: 65,
    activeUsers: 31,
    tasks: 290,
    storage: "6.8 GB",
    storageLimit: "25 GB",
    storagePct: 27.2,
    tokensUsed: "310k tokens",
    activity: 48,
    status: "Warning",
    trend: "-5.0%",
    lastActive: "1d ago",
    createdDate: "2026-01-15",
    sla: "99.75%",
    modules: ["AI Workflow Copilot", "Kanban Boards"],
  },
  {
    id: "ORG-2009",
    name: "Summit Consulting",
    domain: "Strategic Advisory",
    plan: "Business",
    users: 160,
    activeUsers: 139,
    tasks: 890,
    storage: "25.7 GB",
    storageLimit: "50 GB",
    storagePct: 51.4,
    tokensUsed: "930k tokens",
    activity: 87,
    status: "Optimal",
    trend: "+11.3%",
    lastActive: "12m ago",
    createdDate: "2025-09-08",
    sla: "99.97%",
    modules: ["AI Workflow Copilot", "Team Chat", "Meeting Scheduler", "Kanban Boards"],
  },
  {
    id: "ORG-2010",
    name: "Greenline Tech",
    domain: "Renewables & Climate",
    plan: "Starter",
    users: 54,
    activeUsers: 23,
    tasks: 210,
    storage: "5.1 GB",
    storageLimit: "25 GB",
    storagePct: 20.4,
    tokensUsed: "180k tokens",
    activity: 42,
    status: "Warning",
    trend: "-3.2%",
    lastActive: "2d ago",
    createdDate: "2026-02-10",
    sla: "99.70%",
    modules: ["Kanban Boards", "Meeting Scheduler"],
  },
  {
    id: "ORG-2011",
    name: "CyberGuard Inc",
    domain: "Cybersecurity & Compliance",
    plan: "Enterprise",
    users: 290,
    activeUsers: 275,
    tasks: 1890,
    storage: "54.2 GB",
    storageLimit: "100 GB",
    storagePct: 54.2,
    tokensUsed: "1.95M tokens",
    activity: 94,
    status: "Optimal",
    trend: "+16.5%",
    lastActive: "Just now",
    createdDate: "2025-08-01",
    sla: "99.99%",
    modules: ["AI Workflow Copilot", "REST Webhooks", "Enterprise SSO", "Bug Tracking", "Team Chat"],
  },
  {
    id: "ORG-2012",
    name: "Nexus Dynamics",
    domain: "Precision Engineering",
    plan: "Business",
    users: 115,
    activeUsers: 82,
    tasks: 580,
    storage: "17.9 GB",
    storageLimit: "50 GB",
    storagePct: 35.8,
    tokensUsed: "590k tokens",
    activity: 71,
    status: "Healthy",
    trend: "+6.7%",
    lastActive: "2h ago",
    createdDate: "2025-10-18",
    sla: "99.94%",
    modules: ["Kanban Boards", "Bug Tracking", "Cloud File Storage"],
  },
];

const HISTORICAL_METRICS = {
  "7 days": [
    { period: "Sunday (Today)", date: "2026-10-25", orgs: 186, dau: 892, sessions: 3225, tasks: 680, apiCalls: 84200, latency: 138, uptime: "99.99%" },
    { period: "Saturday", date: "2026-10-24", orgs: 184, dau: 780, sessions: 2850, tasks: 590, apiCalls: 76500, latency: 140, uptime: "99.98%" },
    { period: "Friday", date: "2026-10-23", orgs: 182, dau: 940, sessions: 3620, tasks: 810, apiCalls: 98400, latency: 145, uptime: "99.95%" },
    { period: "Thursday", date: "2026-10-22", orgs: 180, dau: 915, sessions: 3480, tasks: 760, apiCalls: 91200, latency: 142, uptime: "99.99%" },
    { period: "Wednesday", date: "2026-10-21", orgs: 178, dau: 890, sessions: 3340, tasks: 720, apiCalls: 88900, latency: 144, uptime: "99.99%" },
    { period: "Tuesday", date: "2026-10-20", orgs: 175, dau: 860, sessions: 3190, tasks: 690, apiCalls: 85200, latency: 141, uptime: "99.97%" },
    { period: "Monday", date: "2026-10-19", orgs: 173, dau: 820, sessions: 2980, tasks: 570, apiCalls: 79800, latency: 139, uptime: "99.99%" },
  ],
  "30 days": [
    { period: "Week 4 (Current)", date: "Oct 19 - Oct 25", orgs: 248, dau: 8624, sessions: 31400, tasks: 9240, apiCalls: 684000, latency: 141, uptime: "99.98%" },
    { period: "Week 3", date: "Oct 12 - Oct 18", orgs: 236, dau: 7940, sessions: 28900, tasks: 8710, apiCalls: 621000, latency: 143, uptime: "99.96%" },
    { period: "Week 2", date: "Oct 05 - Oct 11", orgs: 224, dau: 7200, sessions: 26400, tasks: 8120, apiCalls: 574000, latency: 146, uptime: "99.95%" },
    { period: "Week 1", date: "Sep 28 - Oct 04", orgs: 212, dau: 6510, sessions: 23800, tasks: 7450, apiCalls: 512000, latency: 144, uptime: "99.99%" },
  ],
  "90 days": [
    { period: "Month 3 (October)", date: "Oct 01 - Oct 31", orgs: 310, dau: 16400, sessions: 112000, tasks: 34500, apiCalls: 2450000, latency: 142, uptime: "99.97%" },
    { period: "Month 2 (September)", date: "Sep 01 - Sep 30", orgs: 275, dau: 13800, sessions: 94000, tasks: 28900, apiCalls: 1980000, latency: 145, uptime: "99.95%" },
    { period: "Month 1 (August)", date: "Aug 01 - Aug 31", orgs: 240, dau: 11200, sessions: 78000, tasks: 24200, apiCalls: 1620000, latency: 148, uptime: "99.92%" },
  ],
};

const FEATURE_ADOPTION_DATA = [
  { feature: "AI Workflow Copilot", category: "AI Tools", activeOrgs: 184, interactions: "45.2k", adoption: 94, status: "Optimal", trend: "+24.8%" },
  { feature: "Kanban & Sprint Boards", category: "Work Management", activeOrgs: 196, interactions: "92.4k", adoption: 98, status: "Optimal", trend: "+8.2%" },
  { feature: "Bug Tracking & QA", category: "Work Management", activeOrgs: 142, interactions: "31.8k", adoption: 72, status: "Healthy", trend: "+12.1%" },
  { feature: "Realtime Team Chat", category: "Communications", activeOrgs: 178, interactions: "124.0k", adoption: 89, status: "Optimal", trend: "+15.4%" },
  { feature: "Meeting Scheduler & Calendar", category: "Communications", activeOrgs: 120, interactions: "18.4k", adoption: 61, status: "Healthy", trend: "+4.3%" },
  { feature: "Cloud File Storage & Assets", category: "Content", activeOrgs: 165, interactions: "41.2k", adoption: 83, status: "Healthy", trend: "+9.0%" },
  { feature: "Custom Webhooks & REST API", category: "Platform & Dev", activeOrgs: 88, interactions: "340.0k", adoption: 45, status: "Healthy", trend: "+18.9%" },
  { feature: "Enterprise SSO & Two-Factor", category: "Security & Access", activeOrgs: 76, interactions: "28.5k", adoption: 39, status: "Optimal", trend: "+22.5%" },
];

const taskData = [
  { name: "Completed", value: 64, color: "#16a34a" },
  { name: "In Progress", value: 24, color: "#6366f1" },
  { name: "Pending", value: 12, color: "#f59e0b" },
];

// Custom Recharts Tooltip Component
const CustomAnalyticsTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="anl-custom-tooltip">
        <div className="anl-tooltip-header">{label}</div>
        <div className="anl-tooltip-body">
          {payload.map((entry, index) => (
            <div key={`item-${index}`} className="anl-tooltip-item">
              <span
                className="anl-tooltip-dot"
                style={{ backgroundColor: entry.color || entry.fill || entry.stroke }}
              />
              <span className="anl-tooltip-label">{entry.name}:</span>
              <strong className="anl-tooltip-val">
                {typeof entry.value === "number" ? entry.value.toLocaleString() : entry.value}
              </strong>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
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
  const [activePieIndex, setActivePieIndex] = useState(null);
  const [analyticsTab, setAnalyticsTab] = useState("organizations"); // "organizations" | "daily" | "features"
  const [searchQuery, setSearchQuery] = useState("");
  const [planFilter, setPlanFilter] = useState("All plans");
  const [activityFilter, setActivityFilter] = useState("All activity");
  const [sortField, setSortField] = useState("activity");
  const [sortOrder, setSortOrder] = useState("desc");
  const [page, setPage] = useState(1);
  const [density, setDensity] = useState("standard");
  const [pageSize, setPageSize] = useState(10);
  const [selectedOrgModal, setSelectedOrgModal] = useState(null);

  // Lock background scroll and listen for Escape key when modal is open
  useEffect(() => {
    if (!selectedOrgModal) return undefined;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setSelectedOrgModal(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedOrgModal]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  const resetFilters = () => {
    setSearchQuery("");
    setPlanFilter("All plans");
    setActivityFilter("All activity");
    setSortField("activity");
    setSortOrder("desc");
    setPage(1);
  };

  // Filtered Organizations
  const filteredOrganizations = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    let list = ORGANIZATIONS_DATA.filter((org) => {
      const matchesSearch =
        !q ||
        org.name.toLowerCase().includes(q) ||
        org.domain.toLowerCase().includes(q) ||
        org.plan.toLowerCase().includes(q);

      const matchesPlan =
        planFilter === "All plans" ||
        org.plan.toLowerCase() === planFilter.toLowerCase();

      let matchesActivity = true;
      if (activityFilter === "High (>=80%)") {
        matchesActivity = org.activity >= 80;
      } else if (activityFilter === "Medium (50-79%)") {
        matchesActivity = org.activity >= 50 && org.activity < 80;
      } else if (activityFilter === "Low (<50%)") {
        matchesActivity = org.activity < 50;
      }

      return matchesSearch && matchesPlan && matchesActivity;
    });

    list.sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];
      if (typeof valA === "string") valA = valA.toLowerCase();
      if (typeof valB === "string") valB = valB.toLowerCase();
      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return list;
  }, [searchQuery, planFilter, activityFilter, sortField, sortOrder]);

  // Filtered Daily Records
  const currentDailyRecords = useMemo(() => {
    const raw = HISTORICAL_METRICS[period] || HISTORICAL_METRICS["30 days"];
    const q = searchQuery.trim().toLowerCase();
    if (!q) return raw;
    return raw.filter((item) =>
      item.period.toLowerCase().includes(q) || item.date.toLowerCase().includes(q)
    );
  }, [period, searchQuery]);

  // Filtered Feature Adoption
  const filteredFeatures = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return FEATURE_ADOPTION_DATA;
    return FEATURE_ADOPTION_DATA.filter((item) =>
      item.feature.toLowerCase().includes(q) || item.category.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  // Pagination for Organizations
  const totalOrgPages = Math.max(1, Math.ceil(filteredOrganizations.length / pageSize));
  const currentOrgPage = Math.min(page, totalOrgPages);
  const visibleOrganizations = filteredOrganizations.slice(
    (currentOrgPage - 1) * pageSize,
    currentOrgPage * pageSize
  );

  const selectedGrowth = growthData[period];
  const selectedActivity = activityDataByPeriod[period] || activityDataByPeriod["30 days"];
  const selectedSessions = sessionsByPeriod[period] || sessionsByPeriod["30 days"];
  const periodMetrics = METRICS_BY_PERIOD[period] || METRICS_BY_PERIOD["30 days"];

  const handleExport = () => {
    let rows = [];
    let filename = `teamflow-analytics-${period.replace(/\s+/g, "_")}.csv`;

    if (analyticsTab === "organizations") {
      rows = [
        ["Organization ID", "Organization", "Domain", "Plan Tier", "Total Users", "Active Users", "Tasks Created", "Storage Used", "Tokens Consumed", "Activity Score %", "Status", "Trend"],
        ...filteredOrganizations.map((o) => [
          o.id,
          o.name,
          o.domain,
          o.plan,
          o.users,
          o.activeUsers,
          o.tasks,
          o.storage,
          o.tokensUsed,
          `${o.activity}%`,
          o.status,
          o.trend,
        ]),
      ];
      filename = `teamflow-organization-analytics.csv`;
    } else if (analyticsTab === "daily") {
      rows = [
        ["Period", "Date", "Active Organizations", "Daily Active Users", "Total Sessions", "Tasks Handled", "API Calls", "Avg Latency (ms)", "Platform Uptime"],
        ...currentDailyRecords.map((r) => [
          r.period,
          r.date,
          r.orgs,
          r.dau,
          r.sessions,
          r.tasks,
          r.apiCalls,
          r.latency,
          r.uptime,
        ]),
      ];
      filename = `teamflow-daily-metrics-${period.replace(/\s+/g, "_")}.csv`;
    } else {
      rows = [
        ["Feature Name", "Category", "Active Organizations", "Interactions", "Adoption Rate %", "Status", "Growth Trend"],
        ...filteredFeatures.map((f) => [
          f.feature,
          f.category,
          f.activeOrgs,
          f.interactions,
          `${f.adoption}%`,
          f.status,
          f.trend,
        ]),
      ];
      filename = `teamflow-feature-adoption.csv`;
    }

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
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const handleExportSingleOrg = (org) => {
    const rows = [
      ["Organization Metric", "Value"],
      ["Organization ID", org.id],
      ["Organization Name", org.name],
      ["Industry Domain", org.domain],
      ["Subscription Plan", org.plan],
      ["Licensed Seats", org.users],
      ["Active Seats", org.activeUsers],
      ["Seat Utilization", `${Math.round((org.activeUsers / org.users) * 100)}%`],
      ["Tasks Completed", org.tasks],
      ["Storage Quota Used", `${org.storage} of ${org.storageLimit}`],
      ["AI Tokens Consumed", org.tokensUsed],
      ["Activity Score", `${org.activity}%`],
      ["Health Status", org.status],
      ["Growth Trend", org.trend],
      ["Platform SLA Uptime", org.sla],
      ["Created Date", org.createdDate],
      ["Enabled Modules", org.modules.join("; ")],
    ];

    const csv = rows.map((r) => `"${r[0]}","${r[1]}"`).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${org.name.toLowerCase().replace(/\s+/g, "_")}_scorecard.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="analytics-page">
      <header className="analytics-page-header sap-header-panel">
        <div className="sa-page-header-left">
          <h1>Platform Analytics & Insights</h1>
          <p>
            Monitor real-time system performance, multi-tenant adoption benchmarks, and
            operational health metrics across all organizations.
          </p>
        </div>

        <div className="analytics-header-actions">
          <label className="analytics-period-control">
            <CalendarDays size={16} />
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

          <button className="analytics-export-button" onClick={handleExport} type="button">
            <Download size={15} />
            Export CSV
          </button>
        </div>
      </header>

      {/* Primary KPI Metrics */}
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

      {/* Main Charts Grid: Growth & Task Breakdown */}
      <section className="analytics-main-grid">
        <article className="analytics-panel analytics-growth-panel">
          <div className="analytics-panel-header">
            <div>
              <h2>Platform Growth Trend</h2>
              <p>Tenant organization registrations and active users over time</p>
            </div>

            <span className="analytics-live-label">
              <span />
              Live Platform Metrics ({period})
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
                margin={{ top: 12, right: 12, left: -16, bottom: 0 }}
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
                      stopOpacity={0.28}
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
                      stopOpacity={0.24}
                    />
                    <stop
                      offset="100%"
                      stopColor="#0ea5e9"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  stroke="var(--sa-border-subtle, #edf0f5)"
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

                <Tooltip content={<CustomAnalyticsTooltip />} />

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

              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <h2>Task Overview</h2>
                <span className="chart-live-badge">
                  <span className="chart-live-dot" /> LIVE
                </span>
              </div>
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
                  outerRadius={activePieIndex !== null ? 97 : 94}

                  paddingAngle={4}
                  stroke="none"
                  onMouseEnter={(_, index) => setActivePieIndex(index)}
                  onMouseLeave={() => setActivePieIndex(null)}
                >
                  {taskData.map((entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={entry.color}
                      opacity={activePieIndex !== null && activePieIndex !== index ? 0.45 : 1}
                      style={{ cursor: "pointer", transition: "all 0.2s ease" }}
                    />
                  ))}
                </Pie>

                <Tooltip content={<CustomAnalyticsTooltip />} />
              </PieChart>
            </ResponsiveContainer>

            <div className="analytics-donut-center">
              {activePieIndex !== null && taskData[activePieIndex] ? (
                <>
                  <strong style={{ color: taskData[activePieIndex].color }}>{taskData[activePieIndex].value}%</strong>
                  <span>{taskData[activePieIndex].name}</span>
                </>
              ) : (
                <>
                  <strong>100%</strong>
                  <span>Task status</span>
                </>
              )}
            </div>
          </div>

          <div className="analytics-task-legend">
            {taskData.map((task, index) => (
              <div
                className={`analytics-task-legend-row ${activePieIndex === index ? "active" : ""}`}
                key={task.name}
                onMouseEnter={() => setActivePieIndex(index)}
                onMouseLeave={() => setActivePieIndex(null)}
                style={{
                  cursor: "pointer",
                  borderRadius: 6,
                  padding: "4px 8px",
                  transition: "all 0.15s ease",
                  background: activePieIndex === index ? "rgba(99, 102, 241, 0.1)" : "transparent"
                }}
              >
                <span>
                  <i style={{ background: task.color, transform: activePieIndex === index ? "scale(1.3)" : "scale(1)", transition: "transform 0.15s ease" }} />
                  {task.name}
                </span>
                <strong>{task.value}%</strong>
              </div>
            ))}
          </div>
        </article>
      </section>

      {/* Secondary Grid: Activity Bar Chart & Platform Health */}
      <section className="analytics-bottom-grid">
        <article className="analytics-panel analytics-activity-panel">
          <div className="analytics-panel-header">
            <div>
              <h2>User Activity Breakdown</h2>
              <p>Active user volume and concurrent session traffic</p>
            </div>

            <span className="analytics-activity-total">
              <Zap size={14} />
              {selectedSessions}
            </span>
          </div>

          <div className="analytics-activity-chart">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={selectedActivity}
                margin={{ top: 10, right: 8, left: -16, bottom: 0 }}
              >
                <CartesianGrid
                  stroke="var(--sa-border-subtle, #edf0f5)"
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

                <Tooltip content={<CustomAnalyticsTooltip />} />

                <Bar
                  dataKey="active"
                  name="Active users"
                  fill="#6366f1"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={38}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="analytics-panel analytics-performance-panel">
          <div className="analytics-panel-header">
            <div>
              <h2>Platform Health & SLAs</h2>
              <p>Key operational and availability indicators</p>
            </div>
            <span className="analytics-health-status">Optimal</span>
          </div>

          <div className="analytics-health-list">
            <div className="analytics-health-item">
              <span className="analytics-health-icon analytics-health-purple">
                <TrendingUp size={18} />
              </span>
              <div className="analytics-health-copy">
                <strong>Platform uptime</strong>
                <span>Service availability across regions</span>
              </div>
              <div className="analytics-health-value">
                <strong>99.98%</strong>
                <span>+0.2%</span>
              </div>
            </div>

            <div className="analytics-health-item">
              <span className="analytics-health-icon analytics-health-blue">
                <Clock3 size={18} />
              </span>
              <div className="analytics-health-copy">
                <strong>Average response</strong>
                <span>API Gateway edge response time</span>
              </div>
              <div className="analytics-health-value">
                <strong>138 ms</strong>
                <span>−8.4%</span>
              </div>
            </div>

            <div className="analytics-health-item">
              <span className="analytics-health-icon analytics-health-green">
                <CheckCircle2 size={18} />
              </span>
              <div className="analytics-health-copy">
                <strong>Task execution rate</strong>
                <span>Successfully processed automation</span>
              </div>
              <div className="analytics-health-value">
                <strong>97.4%</strong>
                <span>+2.1%</span>
              </div>
            </div>
          </div>

          <div className="analytics-health-note">
            <span />
            All infrastructure nodes operational. Auto-failover clusters in standby.
          </div>
        </article>
      </section>

      {/* Comprehensive SaaS Platform Analytics Data Tables */}
      <section className="sap-table-card analytics-panel analytics-organizations-panel">
        <div className="analytics-panel-header analytics-organizations-header">
          <div>
            <h2>Platform Analytics Data Explorer</h2>
            <p>Drill down into tenant organization activity, historical telemetry records, and feature adoption</p>
          </div>

          {/* Table View Switcher Tabs */}
          <div className="sub-plans-view-toggle">
            <button
              type="button"
              className={`sub-plans-toggle-btn ${analyticsTab === "organizations" ? "active" : ""}`}
              onClick={() => {
                setAnalyticsTab("organizations");
                setPage(1);
              }}
            >
              <Building2 size={14} />
              Tenant Organizations ({filteredOrganizations.length})
            </button>
            <button
              type="button"
              className={`sub-plans-toggle-btn ${analyticsTab === "daily" ? "active" : ""}`}
              onClick={() => {
                setAnalyticsTab("daily");
                setPage(1);
              }}
            >
              <Server size={14} />
              Historical Records ({currentDailyRecords.length})
            </button>
            <button
              type="button"
              className={`sub-plans-toggle-btn ${analyticsTab === "features" ? "active" : ""}`}
              onClick={() => {
                setAnalyticsTab("features");
                setPage(1);
              }}
            >
              <Sparkles size={14} />
              Feature Adoption ({filteredFeatures.length})
            </button>
          </div>
        </div>

        {/* Live Filter Controls */}
        <div className="subscriptions-filters" style={{ margin: "0 0 16px" }}>
          <label className="subscriptions-search">
            <Search size={16} />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              placeholder={
                analyticsTab === "organizations"
                  ? "Search organization, industry or plan..."
                  : analyticsTab === "daily"
                  ? "Search date or time period..."
                  : "Search platform feature or category..."
              }
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setPage(1);
                }}
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </label>

          {analyticsTab === "organizations" && (
            <>
              <label className="subscriptions-filter-label">
                <Filter size={14} />
                <select
                  value={planFilter}
                  onChange={(e) => {
                    setPlanFilter(e.target.value);
                    setPage(1);
                  }}
                >
                  <option>All plans</option>
                  <option>Enterprise</option>
                  <option>Business</option>
                  <option>Starter</option>
                </select>
              </label>

              <select
                className="subscriptions-filter-select"
                value={activityFilter}
                onChange={(e) => {
                  setActivityFilter(e.target.value);
                  setPage(1);
                }}
              >
                <option>All activity</option>
                <option>High (&gt;=80%)</option>
                <option>Medium (50-79%)</option>
                <option>Low (&lt;50%)</option>
              </select>
            </>
          )}

          <button
            type="button"
            className="subscriptions-reset-button"
            onClick={resetFilters}
          >
            <RotateCcw size={14} /> Reset
          </button>

          <button
            type="button"
            className="sap-icon-btn"
            title={`Switch density (currently ${density})`}
            onClick={() =>
              setDensity((prev) => (prev === "standard" ? "compact" : "standard"))
            }
          >
            <SlidersHorizontal size={14} />
          </button>
        </div>

        {/* TAB 1: ORGANIZATIONS TABLE */}
        {analyticsTab === "organizations" && (
          <>
            <div className="analytics-table-wrapper">
              <table className={`sap-grid is-${density} analytics-table`}>
                <thead>
                  <tr>
                    <th
                      onClick={() => handleSort("name")}
                      style={{ cursor: "pointer", userSelect: "none" }}
                    >
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                        Organization
                        {sortField === "name" ? (
                          sortOrder === "asc" ? <ArrowUp size={13} /> : <ArrowDown size={13} />
                        ) : (
                          <ArrowUpDown size={12} opacity={0.4} />
                        )}
                      </span>
                    </th>
                    <th
                      onClick={() => handleSort("plan")}
                      style={{ cursor: "pointer", userSelect: "none" }}
                    >
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                        Plan
                        {sortField === "plan" ? (
                          sortOrder === "asc" ? <ArrowUp size={13} /> : <ArrowDown size={13} />
                        ) : (
                          <ArrowUpDown size={12} opacity={0.4} />
                        )}
                      </span>
                    </th>
                    <th
                      onClick={() => handleSort("users")}
                      style={{ cursor: "pointer", userSelect: "none" }}
                    >
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                        Total Users
                        {sortField === "users" ? (
                          sortOrder === "asc" ? <ArrowUp size={13} /> : <ArrowDown size={13} />
                        ) : (
                          <ArrowUpDown size={12} opacity={0.4} />
                        )}
                      </span>
                    </th>
                    <th>Active Users</th>
                    <th
                      onClick={() => handleSort("tasks")}
                      style={{ cursor: "pointer", userSelect: "none" }}
                    >
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                        Tasks
                        {sortField === "tasks" ? (
                          sortOrder === "asc" ? <ArrowUp size={13} /> : <ArrowDown size={13} />
                        ) : (
                          <ArrowUpDown size={12} opacity={0.4} />
                        )}
                      </span>
                    </th>
                    <th>Storage</th>
                    <th
                      onClick={() => handleSort("activity")}
                      style={{ cursor: "pointer", userSelect: "none" }}
                    >
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                        Activity Score
                        {sortField === "activity" ? (
                          sortOrder === "asc" ? <ArrowUp size={13} /> : <ArrowDown size={13} />
                        ) : (
                          <ArrowUpDown size={12} opacity={0.4} />
                        )}
                      </span>
                    </th>
                    <th>Health</th>
                    <th>Last Active</th>
                    <th style={{ textAlign: "center" }}>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {visibleOrganizations.map((organization) => (
                    <tr key={organization.id || organization.name}>
                      <td>
                        <div className="analytics-organization-name">
                          <div className="analytics-org-avatar-wrap">
                            <img
                              src={orgAvatarImg}
                              alt={organization.name}
                              className="analytics-org-avatar-img"
                              loading="lazy"
                            />
                          </div>
                          <div>
                            <strong>{organization.name}</strong>
                            <div style={{ fontSize: 11, color: "var(--sa-text-muted, #94a3b8)" }}>
                              {organization.domain}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span className={`subscriptions-plan-badge subscriptions-plan-${organization.plan.toLowerCase()}`}>
                          {organization.plan}
                        </span>
                      </td>

                      <td>
                        <strong>{organization.users.toLocaleString()}</strong>
                      </td>

                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ fontSize: 12.5, fontWeight: 600 }}>
                            {organization.activeUsers}
                          </span>
                          <span style={{ fontSize: 11, color: "var(--sa-text-muted, #94a3b8)" }}>
                            ({Math.round((organization.activeUsers / organization.users) * 100)}%)
                          </span>
                        </div>
                      </td>

                      <td>{organization.tasks.toLocaleString()}</td>

                      <td>
                        <span style={{ fontSize: 12.5, color: "var(--sa-text-secondary, #475569)" }}>
                          {organization.storage}
                        </span>
                      </td>

                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <strong>{organization.activity}%</strong>
                          <div className="analytics-performance-bar" style={{ width: 60 }}>
                            <span style={{ width: `${organization.activity}%` }} />
                          </div>
                        </div>
                      </td>

                      <td>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 4,
                            padding: "2px 8px",
                            borderRadius: "12px",
                            fontSize: "11.5px",
                            fontWeight: 700,
                            backgroundColor:
                              organization.status === "Optimal"
                                ? "#ecfdf5"
                                : organization.status === "Healthy"
                                ? "#eff6ff"
                                : "#fffbeb",
                            color:
                              organization.status === "Optimal"
                                ? "#059669"
                                : organization.status === "Healthy"
                                ? "#2563eb"
                                : "#d97706",
                          }}
                        >
                          <span
                            style={{
                              width: 6,
                              height: 6,
                              borderRadius: "50%",
                              backgroundColor: "currentColor",
                            }}
                          />
                          {organization.status}
                        </span>
                      </td>

                      <td>
                        <span style={{ fontSize: 12, color: "var(--sa-text-muted, #94a3b8)" }}>
                          {organization.lastActive}
                        </span>
                      </td>

                      <td style={{ textAlign: "center" }}>
                        <button
                          type="button"
                          className="anl-action-btn anl-action-btn-inspect"
                          onClick={() => setSelectedOrgModal(organization)}
                          title={`Inspect ${organization.name} analytics scorecard`}
                        >
                          <Eye size={14} />
                          Inspect
                        </button>
                      </td>
                    </tr>
                  ))}

                  {visibleOrganizations.length === 0 && (
                    <tr>
                      <td colSpan="10" className="analytics-empty-state">
                        No organizations match your current search and filter criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination footer */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: 14,
                padding: "8px 4px",
                fontSize: 13,
                color: "var(--sa-text-secondary, #64748b)",
                flexWrap: "wrap",
                gap: 12,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <span>
                  Showing {filteredOrganizations.length === 0 ? 0 : (currentOrgPage - 1) * pageSize + 1}–
                  {Math.min(currentOrgPage * pageSize, filteredOrganizations.length)} of {filteredOrganizations.length} organizations
                </span>
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#64748b" }}>
                  <span>Rows per page:</span>
                  <select
                    className="sap-filter-select"
                    style={{ padding: "3px 6px", fontSize: 12, height: 26 }}
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value));
                      setPage(1);
                    }}
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <button
                  type="button"
                  className="subscriptions-button subscriptions-button-light"
                  style={{ padding: "5px 10px", width: "auto", minWidth: "max-content", whiteSpace: "nowrap" }}
                  disabled={currentOrgPage <= 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  <ChevronLeft size={16} />
                </button>
                <span>
                  Page {currentOrgPage} of {totalOrgPages}
                </span>
                <button
                  type="button"
                  className="subscriptions-button subscriptions-button-light"
                  style={{ padding: "5px 10px", width: "auto", minWidth: "max-content", whiteSpace: "nowrap" }}
                  disabled={currentOrgPage >= totalOrgPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </>
        )}

        {/* TAB 2: DAILY & HISTORICAL METRICS TABLE */}
        {analyticsTab === "daily" && (
          <div className="analytics-table-wrapper">
            <table className={`sap-grid is-${density} analytics-table`}>
              <thead>
                <tr>
                  <th>Period</th>
                  <th>Date</th>
                  <th>Active Orgs</th>
                  <th>Daily Active Users</th>
                  <th>Total Sessions</th>
                  <th>Tasks Completed</th>
                  <th>API Calls</th>
                  <th>Avg Latency</th>
                  <th>Platform Uptime</th>
                </tr>
              </thead>
              <tbody>
                {currentDailyRecords.map((rec) => (
                  <tr key={rec.period}>
                    <td>
                      <strong>{rec.period}</strong>
                    </td>
                    <td>
                      <span style={{ fontSize: 12, color: "var(--sa-text-muted, #94a3b8)" }}>
                        {rec.date}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontWeight: 600 }}>{rec.orgs}</span>
                    </td>
                    <td>
                      <span style={{ fontWeight: 700, color: "#6366f1" }}>
                        {rec.dau.toLocaleString()}
                      </span>
                    </td>
                    <td>{rec.sessions.toLocaleString()}</td>
                    <td>
                      <span style={{ color: "#16a34a", fontWeight: 600 }}>
                        {rec.tasks.toLocaleString()}
                      </span>
                    </td>
                    <td>{rec.apiCalls.toLocaleString()}</td>
                    <td>
                      <span style={{ fontSize: 12.5 }}>{rec.latency} ms</span>
                    </td>
                    <td>
                      <span
                        style={{
                          display: "inline-flex",
                          padding: "2px 8px",
                          borderRadius: "4px",
                          background: "#ecfdf5",
                          color: "#059669",
                          fontSize: 12,
                          fontWeight: 700,
                        }}
                      >
                        {rec.uptime}
                      </span>
                    </td>
                  </tr>
                ))}

                {currentDailyRecords.length === 0 && (
                  <tr>
                    <td colSpan="9" className="analytics-empty-state">
                      No historical records match your search criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 3: FEATURE ADOPTION TABLE */}
        {analyticsTab === "features" && (
          <div className="analytics-table-wrapper">
            <table className={`sap-grid is-${density} analytics-table`}>
              <thead>
                <tr>
                  <th>Platform Feature</th>
                  <th>Category</th>
                  <th>Active Organizations</th>
                  <th>Total Interactions</th>
                  <th>Adoption Rate</th>
                  <th>Status</th>
                  <th>Trend</th>
                </tr>
              </thead>
              <tbody>
                {filteredFeatures.map((feat) => (
                  <tr key={feat.feature}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <Sparkles size={16} color="#6366f1" />
                        <strong>{feat.feature}</strong>
                      </div>
                    </td>
                    <td>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "2px 8px",
                          borderRadius: "4px",
                          backgroundColor: "var(--sa-bg, #f1f5f9)",
                          fontSize: 12,
                          color: "var(--sa-text-secondary, #475569)",
                        }}
                      >
                        {feat.category}
                      </span>
                    </td>
                    <td>
                      <strong>{feat.activeOrgs} orgs</strong>
                    </td>
                    <td>
                      <span style={{ fontWeight: 600 }}>{feat.interactions}</span>
                    </td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <strong style={{ minWidth: 35 }}>{feat.adoption}%</strong>
                        <div className="analytics-performance-bar" style={{ width: 80 }}>
                          <span style={{ width: `${feat.adoption}%` }} />
                        </div>
                      </div>
                    </td>
                    <td>
                      <span
                        style={{
                          display: "inline-flex",
                          padding: "2px 8px",
                          borderRadius: "12px",
                          background: "#ecfdf5",
                          color: "#059669",
                          fontSize: 11.5,
                          fontWeight: 700,
                        }}
                      >
                        {feat.status}
                      </span>
                    </td>
                    <td>
                      <span style={{ color: "#16a34a", fontWeight: 700, fontSize: 12.5 }}>
                        {feat.trend}
                      </span>
                    </td>
                  </tr>
                ))}

                {filteredFeatures.length === 0 && (
                  <tr>
                    <td colSpan="7" className="analytics-empty-state">
                      No features match your search criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <p className="analytics-disclaimer">
        <Activity size={13} />
        Live analytics data synchronized with platform telemetry and tenant organizations across AWS us-east-1 and eu-central-1.
      </p>

      {/* Organization Scorecard Inspect Modal - Rendered via Portal directly in front of the viewport */}
      {selectedOrgModal &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="anl-modal-overlay"
            onClick={() => setSelectedOrgModal(null)}
            role="dialog"
            aria-modal="true"
          >
            <div
              className="anl-modal-container"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Compact Header */}
              <div className="anl-modal-header">
                <div className="anl-modal-title-box">
                  <div className="anl-modal-avatar-wrap">
                    <img
                      src={orgAvatarImg}
                      alt={selectedOrgModal.name}
                      className="anl-modal-avatar-img"
                    />
                  </div>
                  <div>
                    <div className="anl-modal-title-row">
                      <h3>{selectedOrgModal.name}</h3>
                      <span className="anl-modal-id">{selectedOrgModal.id}</span>
                    </div>
                    <div className="anl-modal-sub-meta">
                      <span>{selectedOrgModal.domain}</span>
                      <span className="anl-modal-dot">•</span>
                      <span className={`subscriptions-plan-badge subscriptions-plan-${selectedOrgModal.plan.toLowerCase()}`}>
                        {selectedOrgModal.plan}
                      </span>
                      <span className="anl-modal-dot">•</span>
                      <span
                        className="anl-modal-status-badge"
                        style={{
                          color: selectedOrgModal.status === "Optimal" ? "#059669" : "#2563eb",
                          backgroundColor: selectedOrgModal.status === "Optimal" ? "#ecfdf5" : "#eff6ff",
                        }}
                      >
                        <span className="anl-modal-status-dot" style={{ backgroundColor: "currentColor" }} />
                        {selectedOrgModal.status}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  className="anl-modal-close-btn"
                  onClick={() => setSelectedOrgModal(null)}
                  aria-label="Close scorecard"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Compact Body - Completely fits on screen without any scrolling */}
              <div className="anl-modal-body">
                {/* 4 KPI Cards in a single row */}
                <div className="anl-modal-kpi-row">
                  <div className="anl-modal-kpi-card">
                    <div className="anl-modal-kpi-label">
                      <Users size={13} />
                      <span>Seats Active</span>
                    </div>
                    <div className="anl-modal-kpi-val">
                      {selectedOrgModal.activeUsers} <small>/ {selectedOrgModal.users}</small>
                    </div>
                    <div className="anl-modal-kpi-bar">
                      <div
                        className="anl-modal-kpi-bar-fill"
                        style={{
                          width: `${Math.round((selectedOrgModal.activeUsers / selectedOrgModal.users) * 100)}%`,
                        }}
                      />
                    </div>
                    <div className="anl-modal-kpi-sub">
                      {Math.round((selectedOrgModal.activeUsers / selectedOrgModal.users) * 100)}% utilized
                    </div>
                  </div>

                  <div className="anl-modal-kpi-card">
                    <div className="anl-modal-kpi-label">
                      <CheckCircle2 size={13} />
                      <span>Tasks Done</span>
                    </div>
                    <div className="anl-modal-kpi-val">
                      {selectedOrgModal.tasks.toLocaleString()}
                    </div>
                    <div className="anl-modal-kpi-badge positive">
                      {selectedOrgModal.trend}
                    </div>
                    <div className="anl-modal-kpi-sub">
                      High sprint velocity
                    </div>
                  </div>

                  <div className="anl-modal-kpi-card">
                    <div className="anl-modal-kpi-label">
                      <Database size={13} />
                      <span>Storage Quota</span>
                    </div>
                    <div className="anl-modal-kpi-val">
                      {selectedOrgModal.storage}
                    </div>
                    <div className="anl-modal-kpi-bar">
                      <div
                        className="anl-modal-kpi-bar-fill storage"
                        style={{ width: `${selectedOrgModal.storagePct}%` }}
                      />
                    </div>
                    <div className="anl-modal-kpi-sub">
                      of {selectedOrgModal.storageLimit} limit
                    </div>
                  </div>

                  <div className="anl-modal-kpi-card">
                    <div className="anl-modal-kpi-label">
                      <Cpu size={13} />
                      <span>AI Invocations</span>
                    </div>
                    <div className="anl-modal-kpi-val">
                      {selectedOrgModal.tokensUsed}
                    </div>
                    <div className="anl-modal-kpi-badge optimal">
                      Optimal SLA
                    </div>
                    <div className="anl-modal-kpi-sub">
                      Copilot Gateway
                    </div>
                  </div>
                </div>

                {/* 2-Column Middle Row: Modules + Telemetry */}
                <div className="anl-modal-split-row">
                  {/* Left Column: Modules */}
                  <div className="anl-modal-split-box">
                    <div className="anl-modal-box-header">
                      <Sparkles size={14} color="#6366f1" />
                      <h4>Enabled Platform Entitlements</h4>
                    </div>
                    <div className="anl-modal-module-chips">
                      {selectedOrgModal.modules.map((mod) => (
                        <span key={mod} className="anl-modal-module-chip">
                          <CheckCircle size={12} color="#16a34a" />
                          {mod}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Right Column: Telemetry */}
                  <div className="anl-modal-split-box">
                    <div className="anl-modal-box-header">
                      <Activity size={14} color="#0ea5e9" />
                      <h4>Telemetry & Compliance</h4>
                    </div>
                    <div className="anl-modal-telemetry-grid">
                      <div className="anl-modal-telemetry-item">
                        <span>Platform SLA</span>
                        <strong>{selectedOrgModal.sla}</strong>
                      </div>
                      <div className="anl-modal-telemetry-item">
                        <span>Activity Score</span>
                        <strong style={{ color: "#6366f1" }}>{selectedOrgModal.activity}%</strong>
                      </div>
                      <div className="anl-modal-telemetry-item">
                        <span>Last Heartbeat</span>
                        <strong>{selectedOrgModal.lastActive}</strong>
                      </div>
                      <div className="anl-modal-telemetry-item">
                        <span>Onboarded</span>
                        <strong>{selectedOrgModal.createdDate}</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Compact Footer */}
              <div className="anl-modal-footer">
                <button
                  type="button"
                  className="anl-modal-btn anl-modal-btn-download"
                  onClick={() => handleExportSingleOrg(selectedOrgModal)}
                >
                  <Download size={14} />
                  Download Scorecard CSV
                </button>
                <button
                  type="button"
                  className="anl-modal-btn anl-modal-btn-close"
                  onClick={() => setSelectedOrgModal(null)}
                >
                  Close Scorecard
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}

export default Analytics;