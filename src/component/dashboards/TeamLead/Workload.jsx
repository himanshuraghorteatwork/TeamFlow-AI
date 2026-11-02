import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Search,
  Sparkles,
  Users,
  AlertTriangle,
  BriefcaseBusiness,
  Trash2,
  Download,
  X,
  ExternalLink,
  TrendingUp,
  Check,
  ArrowUpDown,
  CheckCircle2,
  Clock,
  SlidersHorizontal,
  Minus,
  Plus,
  RotateCcw,
  Percent,
  Link2,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";
import "./Workload.css";

const WORKLOAD_STORAGE_KEY = "teamflow_workload_members";

const DEFAULT_MEMBERS = [
  { id: 1, name: "Komal Pawar", role: "Frontend Developer", initials: "KP", tone: "purple", assigned: 8, completed: 5, inProgress: 2, overdue: 1, hours: 36, maxHours: 40, capacity: 90 },
  { id: 2, name: "Aarav Shah", role: "Backend Developer", initials: "AS", tone: "blue", assigned: 6, completed: 4, inProgress: 2, overdue: 0, hours: 29, maxHours: 40, capacity: 72 },
  { id: 3, name: "Priya Rao", role: "UI/UX Designer", initials: "PR", tone: "pink", assigned: 5, completed: 2, inProgress: 2, overdue: 1, hours: 34, maxHours: 40, capacity: 84 },
  { id: 4, name: "Rohan Kulkarni", role: "QA Engineer", initials: "RK", tone: "green", assigned: 4, completed: 3, inProgress: 1, overdue: 0, hours: 22, maxHours: 40, capacity: 55 },
  { id: 5, name: "Neha Patil", role: "Full Stack Developer", initials: "NP", tone: "orange", assigned: 7, completed: 3, inProgress: 3, overdue: 1, hours: 38, maxHours: 40, capacity: 96 },
  { id: 6, name: "Alex Morgan", role: "DevOps Engineer", initials: "AM", tone: "purple", assigned: 5, completed: 4, inProgress: 1, overdue: 0, hours: 26, maxHours: 40, capacity: 65 },
  { id: 7, name: "Devendra Singh", role: "Mobile App Developer", initials: "DS", tone: "blue", assigned: 6, completed: 5, inProgress: 1, overdue: 0, hours: 31, maxHours: 40, capacity: 78 },
  { id: 8, name: "Ananya Deshmukh", role: "Product Designer", initials: "AD", tone: "pink", assigned: 4, completed: 2, inProgress: 2, overdue: 0, hours: 20, maxHours: 40, capacity: 50 },
  { id: 9, name: "Vikram Malhotra", role: "Security Engineer", initials: "VM", tone: "green", assigned: 5, completed: 3, inProgress: 2, overdue: 0, hours: 28, maxHours: 40, capacity: 70 },
  { id: 10, name: "Sara Jenkins", role: "Cloud Architect", initials: "SJ", tone: "purple", assigned: 7, completed: 4, inProgress: 2, overdue: 1, hours: 37, maxHours: 40, capacity: 92 },
];

const PERIOD_CHART_DATA = {
  "This week": [
    { day: "Mon", assigned: 10, completed: 7 },
    { day: "Tue", assigned: 12, completed: 9 },
    { day: "Wed", assigned: 9, completed: 8 },
    { day: "Thu", assigned: 14, completed: 11 },
    { day: "Fri", assigned: 8, completed: 6 },
  ],
  "Last week": [
    { day: "Mon", assigned: 8, completed: 6 },
    { day: "Tue", assigned: 11, completed: 8 },
    { day: "Wed", assigned: 10, completed: 9 },
    { day: "Thu", assigned: 12, completed: 10 },
    { day: "Fri", assigned: 7, completed: 5 },
  ],
  "This month": [
    { day: "W1", assigned: 38, completed: 32 },
    { day: "W2", assigned: 44, completed: 39 },
    { day: "W3", assigned: 41, completed: 35 },
    { day: "W4", assigned: 46, completed: 41 },
  ],
};

function getStoredWorkload() {
  try {
    const saved = localStorage.getItem(WORKLOAD_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // ignore
  }
  return DEFAULT_MEMBERS;
}

function CapacityBadge({ capacity }) {
  const state = capacity >= 90 ? "high" : capacity >= 75 ? "medium" : capacity >= 50 ? "optimal" : "healthy";
  const label = capacity >= 90 ? "Overloaded" : capacity >= 75 ? "Near capacity" : capacity >= 50 ? "Optimal" : "Available";
  return (
    <span className={`wl-capacity-badge ${state}`}>
      <i />
      {label}
    </span>
  );
}

// Custom Tooltip for Squad Task Activity Chart
function CustomTaskTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    const assignedItem = payload.find((p) => p.dataKey === "assigned");
    const completedItem = payload.find((p) => p.dataKey === "completed");
    const assigned = assignedItem ? Number(assignedItem.value) : 0;
    const completed = completedItem ? Number(completedItem.value) : 0;
    const completionRate = assigned > 0 ? Math.round((completed / assigned) * 100) : 0;
    const inFlight = Math.max(0, assigned - completed);

    return (
      <div className="wl-custom-tooltip">
        <div className="wl-tt-header">
          <span className="wl-tt-day">{label}</span>
          <span className="wl-tt-rate">{completionRate}% Done</span>
        </div>
        <div className="wl-tt-body">
          <div className="wl-tt-stat blue">
            <span className="wl-tt-dot blue" />
            <span className="wl-tt-name">Assigned Tasks:</span>
            <strong className="wl-tt-val">{assigned} tasks</strong>
          </div>
          <div className="wl-tt-stat green">
            <span className="wl-tt-dot green" />
            <span className="wl-tt-name">Completed Tasks:</span>
            <strong className="wl-tt-val">{completed} tasks</strong>
          </div>
          <div className="wl-tt-stat purple">
            <span className="wl-tt-dot purple" />
            <span className="wl-tt-name">In Progress:</span>
            <strong className="wl-tt-val">{inFlight} tasks</strong>
          </div>
        </div>
        <div className="wl-tt-progress-track">
          <div
            className="wl-tt-progress-fill"
            style={{ width: `${Math.min(100, completionRate)}%` }}
          />
        </div>
      </div>
    );
  }
  return null;
}

// Custom Tooltip for Capacity Utilization Chart
function CustomCapacityTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const isOverloaded = data.capacity >= 90;
    const isNear = data.capacity >= 75 && data.capacity < 90;
    const statusText = isOverloaded
      ? "Overloaded"
      : isNear
      ? "Near capacity"
      : data.capacity >= 50
      ? "Optimal"
      : "Available";
    const statusClass = isOverloaded
      ? "high"
      : isNear
      ? "medium"
      : data.capacity >= 50
      ? "optimal"
      : "healthy";

    return (
      <div className="wl-custom-tooltip">
        <div className="wl-tt-header">
          <div>
            <strong className="wl-tt-member-name">{data.name}</strong>
            <small className="wl-tt-member-role">{data.role}</small>
          </div>
          <span className={`wl-capacity-badge ${statusClass}`}>
            <i /> {statusText}
          </span>
        </div>
        <div className="wl-tt-body">
          <div className="wl-tt-stat blue">
            <span className="wl-tt-dot blue" />
            <span className="wl-tt-name">Workload Capacity:</span>
            <strong className="wl-tt-val">{data.capacity}%</strong>
          </div>
          <div className="wl-tt-stat green">
            <span className="wl-tt-dot green" />
            <span className="wl-tt-name">Bandwidth Logged:</span>
            <strong className="wl-tt-val">{data.hours}h / {data.maxHours || 40}h</strong>
          </div>
          <div className="wl-tt-stat purple">
            <span className="wl-tt-dot purple" />
            <span className="wl-tt-name">Active Tasks:</span>
            <strong className="wl-tt-val">
              {data.assigned} assigned ({data.completed} done{data.overdue > 0 ? `, ${data.overdue} overdue` : ""})
            </strong>
          </div>
        </div>
      </div>
    );
  }
  return null;
}

export default function Workload() {
  const navigate = useNavigate();
  const [members, setMembers] = useState(getStoredWorkload);
  const [search, setSearch] = useState("");
  const [capacityFilter, setCapacityFilter] = useState("All");
  const [period, setPeriod] = useState("This week");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [adjustTarget, setAdjustTarget] = useState(null);
  const [toast, setToast] = useState(null);

  // Sorting state
  const [sortField, setSortField] = useState("capacity");
  const [sortAsc, setSortAsc] = useState(false);

  // Multi-select bulk state
  const [selectedIds, setSelectedIds] = useState(new Set());

  // Interactive Chart Hover States
  const [hoveredDay, setHoveredDay] = useState(null);
  const [hoveredMember, setHoveredMember] = useState(null);

  // Rows per page & pagination state
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  // Edit form state
  const [adjustForm, setAdjustForm] = useState({
    assigned: 0,
    completed: 0,
    inProgress: 0,
    overdue: 0,
    capacity: 0,
    hours: 0,
    autoSync: true,
  });

  const toastTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  const showToast = (message) => {
    setToast(message);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => {
      setToast(null);
    }, 3400);
  };

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(WORKLOAD_STORAGE_KEY, JSON.stringify(members));
      window.dispatchEvent(new Event("teamflow_data_update"));
    } catch {
      // ignore
    }
  }, [members]);

  // Keyboard shortcut: Escape closes modals
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setDeleteTarget(null);
        setAdjustTarget(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Compute live statistics
  const totalSquad = members.length;
  const totalAssigned = members.reduce((sum, m) => sum + (Number(m.assigned) || 0), 0);
  const totalCompleted = members.reduce((sum, m) => sum + (Number(m.completed) || 0), 0);
  const totalOverdue = members.reduce((sum, m) => sum + (Number(m.overdue) || 0), 0);
  const avgCapacity = members.length > 0 ? Math.round(members.reduce((sum, m) => sum + (Number(m.capacity) || 0), 0) / members.length) : 0;
  const overloadedCount = members.filter((m) => m.capacity >= 90).length;
  const nearCapacityCount = members.filter((m) => m.capacity >= 75 && m.capacity < 90).length;
  const optimalCount = members.filter((m) => m.capacity >= 50 && m.capacity < 75).length;
  const availableCount = members.filter((m) => m.capacity < 50).length;

  // Filter and sort members
  const filteredMembers = useMemo(() => {
    const q = search.trim().toLowerCase();
    const result = members.filter((member) => {
      const matchesSearch =
        !q ||
        member.name.toLowerCase().includes(q) ||
        member.role.toLowerCase().includes(q);

      const matchesCapacity =
        capacityFilter === "All" ||
        (capacityFilter === "Overloaded" && member.capacity >= 90) ||
        (capacityFilter === "Near capacity" && member.capacity >= 75 && member.capacity < 90) ||
        (capacityFilter === "Optimal" && member.capacity >= 50 && member.capacity < 75) ||
        (capacityFilter === "Available" && member.capacity < 50);

      return matchesSearch && matchesCapacity;
    });

    result.sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];
      if (typeof valA === "string") {
        valA = valA.toLowerCase();
        valB = (valB || "").toLowerCase();
      } else {
        valA = Number(valA) || 0;
        valB = Number(valB) || 0;
      }
      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });

    return result;
  }, [members, search, capacityFilter, sortField, sortAsc]);

  // Pagination calculations
  const totalPages =
    rowsPerPage === "All"
      ? 1
      : Math.max(1, Math.ceil(filteredMembers.length / Number(rowsPerPage)));

  const safeCurrentPage = Math.min(currentPage, totalPages);

  const startIndex =
    rowsPerPage === "All" ? 0 : (safeCurrentPage - 1) * Number(rowsPerPage);

  const paginatedMembers = useMemo(() => {
    if (rowsPerPage === "All") return filteredMembers;
    return filteredMembers.slice(startIndex, startIndex + Number(rowsPerPage));
  }, [filteredMembers, rowsPerPage, startIndex]);

  // Handle table header sorting
  const handleSort = (field) => {
    if (sortField === field) {
      setSortAsc((prev) => !prev);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  // Toggle row selection
  const handleToggleSelectRow = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Toggle select all on current view
  const handleToggleSelectAll = () => {
    const pageIds = paginatedMembers.map((m) => m.id);
    const allPageSelected = pageIds.length > 0 && pageIds.every((id) => selectedIds.has(id));
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (allPageSelected) {
        pageIds.forEach((id) => next.delete(id));
      } else {
        pageIds.forEach((id) => next.add(id));
      }
      return next;
    });
  };

  // Handle rows per page selector
  const handleRowsPerPageChange = (val) => {
    const nextVal = val === "All" ? "All" : Number(val);
    setRowsPerPage(nextVal);
    setCurrentPage(1);
    showToast(`Displaying ${nextVal === "All" ? "all" : nextVal} rows per page.`);
  };

  // AI Rebalance Action
  const handleAiRebalance = () => {
    const overloadedIdx = members.findIndex((m) => m.capacity >= 85);
    const availableIdx = members.findIndex((m) => m.capacity < 75);

    if (overloadedIdx === -1 || availableIdx === -1) {
      showToast("Squad workload is currently balanced optimal.");
      return;
    }

    setMembers((prev) => {
      const updated = [...prev];
      const donor = { ...updated[overloadedIdx] };
      const receiver = { ...updated[availableIdx] };

      if (donor.assigned > 1) {
        donor.assigned -= 1;
        donor.hours = Math.max(10, donor.hours - 4);
        donor.capacity = Math.max(40, Math.round((donor.hours / (donor.maxHours || 40)) * 100));

        receiver.assigned += 1;
        receiver.hours = Math.min(receiver.maxHours || 40, receiver.hours + 4);
        receiver.capacity = Math.round((receiver.hours / (receiver.maxHours || 40)) * 100);

        updated[overloadedIdx] = donor;
        updated[availableIdx] = receiver;
      }
      return updated;
    });

    showToast(`AI Rebalance applied: Transferred 1 task from ${members[overloadedIdx].name} to ${members[availableIdx].name}.`);
  };

  // Rebalance Selected
  const handleRebalanceSelected = () => {
    if (selectedIds.size === 0) return;
    setMembers((prev) =>
      prev.map((m) => {
        if (selectedIds.has(m.id) && m.capacity > 85) {
          const newHours = Math.max(20, m.hours - 5);
          return {
            ...m,
            hours: newHours,
            assigned: Math.max(1, m.assigned - 1),
            capacity: Math.round((newHours / (m.maxHours || 40)) * 100),
          };
        }
        return m;
      })
    );
    setSelectedIds(new Set());
    showToast("Rebalanced assignments for selected members.");
  };

  // Confirm delete/remove from workload
  const confirmDeleteWorkload = () => {
    if (!deleteTarget) return;
    const name = deleteTarget.name;
    setMembers((prev) => prev.filter((m) => m.id !== deleteTarget.id));
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(deleteTarget.id);
      return next;
    });
    setDeleteTarget(null);
    showToast(`Cleared workload assignment for "${name}".`);
  };

  // Open adjust modal
  const startAdjustMember = (member) => {
    setAdjustTarget(member);
    setAdjustForm({
      assigned: member.assigned,
      completed: member.completed,
      inProgress: member.inProgress,
      overdue: member.overdue,
      capacity: member.capacity,
      hours: member.hours || Math.round((member.capacity / 100) * (member.maxHours || 40)),
      autoSync: true,
    });
  };

  // Interactive Capacity Change
  const handleCapacityChange = (val) => {
    const cap = Math.max(0, Math.min(150, Number(val) || 0));
    setAdjustForm((prev) => ({
      ...prev,
      capacity: cap,
      hours: prev.autoSync ? Math.round((cap / 100) * (adjustTarget?.maxHours || 40)) : prev.hours,
    }));
  };

  // Interactive Hours Change
  const handleHoursChange = (val) => {
    const hrs = Math.max(0, Math.min(80, Number(val) || 0));
    setAdjustForm((prev) => ({
      ...prev,
      hours: hrs,
      capacity: prev.autoSync ? Math.min(150, Math.round((hrs / (adjustTarget?.maxHours || 40)) * 100)) : prev.capacity,
    }));
  };

  // Preset Click
  const handleApplyPreset = (presetCap) => {
    const hrs = Math.round((presetCap / 100) * (adjustTarget?.maxHours || 40));
    setAdjustForm((prev) => ({
      ...prev,
      capacity: presetCap,
      hours: hrs,
    }));
  };

  // Task Stepper
  const handleTaskStep = (field, delta) => {
    setAdjustForm((prev) => {
      const cur = Number(prev[field]) || 0;
      const nextVal = Math.max(0, Math.min(60, cur + delta));
      return {
        ...prev,
        [field]: nextVal,
      };
    });
  };

  // Auto sum assigned tasks
  const handleAutoSumAssigned = () => {
    setAdjustForm((prev) => ({
      ...prev,
      assigned: (Number(prev.completed) || 0) + (Number(prev.inProgress) || 0) + (Number(prev.overdue) || 0),
    }));
  };

  // Reset form to initial
  const handleResetAdjustForm = () => {
    if (!adjustTarget) return;
    setAdjustForm({
      assigned: adjustTarget.assigned,
      completed: adjustTarget.completed,
      inProgress: adjustTarget.inProgress,
      overdue: adjustTarget.overdue,
      capacity: adjustTarget.capacity,
      hours: adjustTarget.hours || Math.round((adjustTarget.capacity / 100) * (adjustTarget.maxHours || 40)),
      autoSync: true,
    });
  };

  // Save adjusted workload
  const saveAdjustMember = (e) => {
    e.preventDefault();
    if (!adjustTarget) return;

    const validCapacity = Math.max(0, Math.min(150, Number(adjustForm.capacity) || 0));
    const validHours = Math.max(0, Math.min(80, Number(adjustForm.hours) || 0));

    setMembers((prev) =>
      prev.map((m) => {
        if (m.id === adjustTarget.id) {
          return {
            ...m,
            assigned: Math.max(0, Number(adjustForm.assigned) || 0),
            completed: Math.max(0, Number(adjustForm.completed) || 0),
            inProgress: Math.max(0, Number(adjustForm.inProgress) || 0),
            overdue: Math.max(0, Number(adjustForm.overdue) || 0),
            capacity: validCapacity,
            hours: validHours,
          };
        }
        return m;
      })
    );

    setAdjustTarget(null);
    showToast(`Updated workload parameters for "${adjustTarget.name}".`);
  };

  // Export CSV Handler
  const handleExportCSV = (targetList = filteredMembers) => {
    const headers = [
      "Team Member",
      "Role",
      "Capacity (%)",
      "Assigned Tasks",
      "Completed Tasks",
      "In Progress",
      "Overdue",
      "Weekly Hours",
      "Max Hours",
      "Status",
    ];

    const rows = targetList.map((m) => {
      const statusLabel =
        m.capacity >= 90
          ? "Overloaded"
          : m.capacity >= 75
          ? "Near capacity"
          : m.capacity >= 50
          ? "Optimal"
          : "Available";

      return [
        `"${m.name}"`,
        `"${m.role}"`,
        m.capacity,
        m.assigned,
        m.completed,
        m.inProgress,
        m.overdue,
        m.hours || Math.round((m.capacity / 100) * 40),
        m.maxHours || 40,
        `"${statusLabel}"`,
      ];
    });

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `teamflow-squad-workload-${period.toLowerCase().replace(/\s+/g, "-")}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    showToast("Workload CSV report exported successfully.");
  };

  const handleExportSelectedCSV = () => {
    const selectedList = members.filter((m) => selectedIds.has(m.id));
    handleExportCSV(selectedList);
  };

  const chartData = PERIOD_CHART_DATA[period] || PERIOD_CHART_DATA["This week"];
  const chartTotalAssigned = chartData.reduce((acc, c) => acc + c.assigned, 0);

  // Capacity Horizontal Bar Chart Data
  const capacityChartData = useMemo(() => {
    return members.map((m) => ({
      id: m.id,
      name: m.name,
      shortName: m.name.split(" ")[0],
      role: m.role,
      capacity: m.capacity,
      hours: m.hours || Math.round((m.capacity / 100) * 40),
      maxHours: m.maxHours || 40,
      assigned: m.assigned,
      completed: m.completed,
      overdue: m.overdue,
      initials: m.initials,
    }));
  }, [members]);

  // Real-time calculation for modal preview
  const currentCap = Number(adjustForm.capacity) || 0;
  const currentHrs = Number(adjustForm.hours) || 0;
  const targetMaxHrs = adjustTarget?.maxHours || 40;
  const capStatus =
    currentCap >= 90
      ? { label: "Overloaded", class: "danger", dotColor: "#ef4444" }
      : currentCap >= 75
      ? { label: "Near Capacity", class: "warning", dotColor: "#f59e0b" }
      : currentCap >= 50
      ? { label: "Optimal Bandwidth", class: "normal", dotColor: "#10b981" }
      : { label: "Available Capacity", class: "healthy", dotColor: "#0ea5e9" };

  return (
    <div className="wl-page">
      {/* Toast Notification */}
      {toast && (
        <aside className="wl-toast-alert" role="status" aria-live="polite">
          <Sparkles size={16} />
          <span>{toast}</span>
          <button type="button" onClick={() => setToast(null)} aria-label="Dismiss toast">
            <X size={14} />
          </button>
        </aside>
      )}

      <main className="wl-main">
        {/* Page Header */}
        <header className="wl-page-heading">
          <div>
            <div className="wl-breadcrumb">
              Workspace <span>/</span> My Team <span>/</span> Workload
            </div>
            <h1>Team Workload &amp; Capacity</h1>
            <p>
              Monitor developer bandwidth, real-time sprint velocity, and balance workload to prevent engineering burnout.
            </p>
          </div>

          <div className="wl-heading-actions">
            <div className="wl-period-select">
              <CalendarDays size={15} />
              <select
                value={period}
                onChange={(e) => {
                  setPeriod(e.target.value);
                  showToast(`Viewing workload metrics for ${e.target.value.toLowerCase()}.`);
                }}
                aria-label="Workload period"
              >
                <option value="This week">This week</option>
                <option value="Last week">Last week</option>
                <option value="This month">This month</option>
              </select>
              <ChevronDown size={14} />
            </div>

            <button
              type="button"
              className="wl-secondary-button"
              onClick={() => handleExportCSV()}
              title="Export workload data to CSV"
            >
              <Download size={15} />
              <span>Export CSV</span>
            </button>

            <button
              type="button"
              className="wl-rebalance-btn"
              onClick={handleAiRebalance}
              title="Auto-rebalance workload using AI suggestions"
            >
              <Sparkles size={15} />
              <span>AI Rebalance</span>
            </button>
          </div>
        </header>

        {/* Top Metric Cards */}
        <section className="wl-stats-grid" aria-label="Workload Overview">
          <article className="wl-stat-card">
            <span className="wl-stat-icon purple">
              <Users size={20} />
            </span>
            <div className="wl-stat-content">
              <span className="wl-stat-label">Total Squad</span>
              <strong className="wl-stat-value">{totalSquad}</strong>
              <div className="wl-stat-foot">
                <span className="wl-trend up">
                  <ArrowUpRight size={12} /> Active sprint
                </span>
                <span>all roles covered</span>
              </div>
            </div>
          </article>

          <article className="wl-stat-card">
            <span className="wl-stat-icon blue">
              <BriefcaseBusiness size={20} />
            </span>
            <div className="wl-stat-content">
              <span className="wl-stat-label">Assigned Tasks</span>
              <strong className="wl-stat-value">{totalAssigned}</strong>
              <div className="wl-stat-foot">
                <span className="wl-trend up">
                  <ArrowUpRight size={12} /> {totalCompleted} completed
                </span>
                <span>{totalAssigned - totalCompleted} remaining</span>
              </div>
            </div>
          </article>

          <article className="wl-stat-card">
            <span className="wl-stat-icon green">
              <Activity size={20} />
            </span>
            <div className="wl-stat-content">
              <span className="wl-stat-label">Avg. Capacity</span>
              <strong className="wl-stat-value">{avgCapacity}%</strong>
              <div className="wl-stat-foot">
                <span className="wl-trend up">
                  <ArrowDownRight size={12} /> Target &le; 80%
                </span>
                <span>{optimalCount} optimal squad</span>
              </div>
            </div>
          </article>

          <article className="wl-stat-card">
            <span className="wl-stat-icon orange">
              <AlertTriangle size={20} />
            </span>
            <div className="wl-stat-content">
              <span className="wl-stat-label">Overloaded Members</span>
              <strong className="wl-stat-value">{overloadedCount}</strong>
              <div className="wl-stat-foot">
                <span>{totalOverdue} overdue tasks</span>
                {overloadedCount > 0 && (
                  <span className="wl-trend down">
                    <AlertTriangle size={12} /> Action needed
                  </span>
                )}
              </div>
            </div>
          </article>
        </section>

        {/* Charts & Capacity Overview Row */}
        <section className="wl-overview-grid">
          {/* Chart 1: Squad Task Activity with Interactive Recharts Hover */}
          <article className="wl-card wl-chart-card">
            <div className="wl-card-header">
              <div>
                <h2>Squad Task Activity ({period})</h2>
                <p>Interactive telemetry: tasks assigned vs completed per day</p>
              </div>
              <div className="wl-chart-header-badge">
                <TrendingUp size={14} />
                <span>Live Telemetry</span>
              </div>
            </div>

            <div className="wl-chart-legend">
              <div className="wl-legend-pills">
                <span className="wl-legend-pill">
                  <i className="wl-legend-dot blue" /> Assigned Tasks
                </span>
                <span className="wl-legend-pill">
                  <i className="wl-legend-dot green" /> Completed Tasks
                </span>
              </div>
              <span className="wl-chart-total">
                {chartTotalAssigned} <small>total tasks</small>
              </span>
            </div>

            {/* Dynamic Live Hover Readout */}
            <div className={`wl-chart-telemetry-banner ${hoveredDay ? "active" : "idle"}`}>
              {hoveredDay ? (
                <>
                  <span className="wl-telemetry-pulse" />
                  <span className="wl-telemetry-day">
                    <strong>{hoveredDay.day} Breakdown:</strong>
                  </span>
                  <span className="wl-telemetry-item blue">
                    <b>{hoveredDay.assigned}</b> Assigned
                  </span>
                  <span className="wl-telemetry-item green">
                    <b>{hoveredDay.completed}</b> Completed
                  </span>
                  <span className="wl-telemetry-item purple">
                    <b>{hoveredDay.assigned > 0 ? Math.round((hoveredDay.completed / hoveredDay.assigned) * 100) : 0}%</b> velocity
                  </span>
                </>
              ) : (
                <span className="wl-telemetry-hint">
                  <Sparkles size={13} /> Hover over any bar to view exact daily task velocity &amp; actual values
                </span>
              )}
            </div>

            <div className="wl-recharts-wrap">
              <ResponsiveContainer width="100%" height={215}>
                <BarChart
                  data={chartData}
                  margin={{ top: 12, right: 12, left: -20, bottom: 0 }}
                  onMouseMove={(state) => {
                    if (state && state.activePayload && state.activePayload.length) {
                      setHoveredDay(state.activePayload[0].payload);
                    }
                  }}
                  onMouseLeave={() => setHoveredDay(null)}
                >
                  <CartesianGrid stroke="#edf0f6" strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: "#64748b" }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: "#64748b" }}
                  />
                  <Tooltip
                    content={<CustomTaskTooltip />}
                    cursor={{ fill: "rgba(99, 102, 241, 0.08)", radius: 6 }}
                  />
                  <Bar
                    dataKey="assigned"
                    name="Assigned"
                    fill="#6366f1"
                    radius={[6, 6, 0, 0]}
                    cursor="pointer"
                    activeBar={{
                      fill: "#4338ca",
                      stroke: "#312e81",
                      strokeWidth: 1.5,
                      filter: "drop-shadow(0 4px 10px rgba(79, 70, 229, 0.35))",
                    }}
                  />
                  <Bar
                    dataKey="completed"
                    name="Completed"
                    fill="#10b981"
                    radius={[6, 6, 0, 0]}
                    cursor="pointer"
                    activeBar={{
                      fill: "#059669",
                      stroke: "#047857",
                      strokeWidth: 1.5,
                      filter: "drop-shadow(0 4px 10px rgba(16, 185, 129, 0.35))",
                    }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </article>

          {/* Chart 2: Capacity Utilization Interactive Recharts Chart */}
          <article className="wl-card wl-capacity-card">
            <div className="wl-card-header">
              <div>
                <h2>Capacity Utilization</h2>
                <p>Member bandwidth and velocity health</p>
              </div>
              <span className="wl-capacity-summary">{avgCapacity}% squad avg.</span>
            </div>

            {/* Dynamic Live Hover Readout for Teammates */}
            <div className={`wl-chart-telemetry-banner ${hoveredMember ? "active" : "idle"}`}>
              {hoveredMember ? (
                <>
                  <span className="wl-telemetry-pulse" />
                  <span className="wl-telemetry-day">
                    <strong>{hoveredMember.name}:</strong>
                  </span>
                  <span className={`wl-telemetry-item ${hoveredMember.capacity >= 90 ? "red" : hoveredMember.capacity >= 75 ? "orange" : "green"}`}>
                    <b>{hoveredMember.capacity}%</b> Capacity
                  </span>
                  <span className="wl-telemetry-item blue">
                    <b>{hoveredMember.hours}h</b>/{hoveredMember.maxHours || 40}h
                  </span>
                  <span className="wl-telemetry-item purple">
                    <b>{hoveredMember.assigned}</b> tasks
                  </span>
                </>
              ) : (
                <span className="wl-telemetry-hint">
                  <Sparkles size={13} /> Hover over any teammate bar to view live bandwidth &amp; actual values
                </span>
              )}
            </div>

            <div className="wl-recharts-wrap">
              <ResponsiveContainer width="100%" height={215}>
                <BarChart
                  layout="vertical"
                  data={capacityChartData}
                  margin={{ top: 8, right: 24, left: 10, bottom: 0 }}
                  onMouseMove={(state) => {
                    if (state && state.activePayload && state.activePayload.length) {
                      setHoveredMember(state.activePayload[0].payload);
                    }
                  }}
                  onMouseLeave={() => setHoveredMember(null)}
                >
                  <CartesianGrid stroke="#edf0f6" strokeDasharray="3 3" horizontal={false} />
                  <XAxis
                    type="number"
                    domain={[0, 100]}
                    unit="%"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: "#64748b" }}
                  />
                  <YAxis
                    type="category"
                    dataKey="shortName"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: "#1e293b", fontWeight: 600 }}
                    width={65}
                  />
                  <Tooltip
                    content={<CustomCapacityTooltip />}
                    cursor={{ fill: "rgba(99, 102, 241, 0.08)", radius: 6 }}
                  />
                  <Bar
                    dataKey="capacity"
                    radius={[0, 6, 6, 0]}
                    cursor="pointer"
                    activeBar={{
                      stroke: "#0f172a",
                      strokeWidth: 2,
                      filter: "drop-shadow(0 2px 8px rgba(0, 0, 0, 0.25))",
                    }}
                  >
                    {capacityChartData.map((entry, index) => {
                      let barFill = "#10b981";
                      if (entry.capacity >= 90) barFill = "#ef4444";
                      else if (entry.capacity >= 75) barFill = "#f59e0b";
                      else if (entry.capacity < 50) barFill = "#0ea5e9";
                      return <Cell key={`cap-cell-${index}`} fill={barFill} />;
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="wl-capacity-note">
              <span className="wl-note-icon">
                <Sparkles size={16} />
              </span>
              <div className="wl-note-text">
                <b>AI Telemetry Recommendation</b>
                <p>
                  Neha ({members.find((m) => m.name.includes("Neha"))?.capacity || 96}%) is overloaded.
                  Rebalancing 1 task to Rohan ({members.find((m) => m.name.includes("Rohan"))?.capacity || 55}%) will reduce sprint burnout risk by 35%.
                </p>
              </div>
              <button
                type="button"
                className="wl-note-rebalance-link"
                onClick={handleAiRebalance}
              >
                Rebalance
              </button>
            </div>
          </article>
        </section>

        {/* Member Workload SaaS Table */}
        <section className="wl-card wl-members-card">
          <div className="wl-card-header wl-members-header">
            <div>
              <h2>Squad Workload Matrix</h2>
              <p>Granular breakdown of assignments, sprint delivery, and weekly bandwidth.</p>
            </div>

            <div className="wl-table-tools">
              <label className="wl-table-search">
                <Search size={15} />
                <input
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search by name or role..."
                  aria-label="Search members"
                />
                {search && (
                  <button
                    type="button"
                    className="wl-search-clear"
                    onClick={() => {
                      setSearch("");
                      setCurrentPage(1);
                    }}
                    aria-label="Clear search"
                  >
                    <X size={13} />
                  </button>
                )}
              </label>

              {/* Filter chips */}
              <div className="wl-filter-chips" role="group" aria-label="Capacity filter">
                {[
                  { key: "All", label: "All", count: totalSquad },
                  { key: "Overloaded", label: "Overloaded", count: overloadedCount },
                  { key: "Near capacity", label: "Near capacity", count: nearCapacityCount },
                  { key: "Optimal", label: "Optimal", count: optimalCount },
                  { key: "Available", label: "Available", count: availableCount },
                ].map((chip) => (
                  <button
                    type="button"
                    key={chip.key}
                    className={`wl-filter-chip ${capacityFilter === chip.key ? "active" : ""}`}
                    onClick={() => {
                      setCapacityFilter(chip.key);
                      setCurrentPage(1);
                    }}
                  >
                    <span>{chip.label}</span>
                    <span className="wl-chip-count">({chip.count})</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* SaaS Bulk Action Floating Bar */}
          {selectedIds.size > 0 && (
            <div className="wl-bulk-action-bar">
              <div className="wl-bulk-info">
                <span className="wl-bulk-count">{selectedIds.size}</span>
                <span>teammate{selectedIds.size > 1 ? "s" : ""} selected</span>
              </div>
              <div className="wl-bulk-actions">
                <button
                  type="button"
                  className="wl-bulk-btn primary"
                  onClick={handleRebalanceSelected}
                >
                  <Sparkles size={14} /> Rebalance Selected
                </button>
                <button
                  type="button"
                  className="wl-bulk-btn secondary"
                  onClick={handleExportSelectedCSV}
                >
                  <Download size={14} /> Export Selected
                </button>
                <button
                  type="button"
                  className="wl-bulk-btn text"
                  onClick={() => setSelectedIds(new Set())}
                >
                  Clear Selection
                </button>
              </div>
            </div>
          )}

          <div className="wl-table-wrap">
            <table className="wl-table">
              <thead>
                <tr>
                  <th className="wl-th-checkbox">
                    <label className="wl-checkbox-label">
                      <input
                        type="checkbox"
                        checked={paginatedMembers.length > 0 && paginatedMembers.every((m) => selectedIds.has(m.id))}
                        onChange={handleToggleSelectAll}
                        aria-label="Select all members on current page"
                      />
                      <span className="wl-custom-checkbox" />
                    </label>
                  </th>
                  <th onClick={() => handleSort("name")} className="sortable-th">
                    <div className="th-content">
                      <span>TEAM MEMBER</span>
                      <ArrowUpDown size={12} />
                    </div>
                  </th>
                  <th onClick={() => handleSort("capacity")} className="sortable-th">
                    <div className="th-content">
                      <span>CAPACITY UTILIZATION</span>
                      <ArrowUpDown size={12} />
                    </div>
                  </th>
                  <th onClick={() => handleSort("assigned")} className="sortable-th">
                    <div className="th-content">
                      <span>ASSIGNED</span>
                      <ArrowUpDown size={12} />
                    </div>
                  </th>
                  <th onClick={() => handleSort("completed")} className="sortable-th">
                    <div className="th-content">
                      <span>COMPLETED</span>
                      <ArrowUpDown size={12} />
                    </div>
                  </th>
                  <th onClick={() => handleSort("inProgress")} className="sortable-th">
                    <div className="th-content">
                      <span>IN PROGRESS</span>
                      <ArrowUpDown size={12} />
                    </div>
                  </th>
                  <th onClick={() => handleSort("overdue")} className="sortable-th">
                    <div className="th-content">
                      <span>OVERDUE</span>
                      <ArrowUpDown size={12} />
                    </div>
                  </th>
                  <th onClick={() => handleSort("hours")} className="sortable-th">
                    <div className="th-content">
                      <span>HOURS / WK</span>
                      <ArrowUpDown size={12} />
                    </div>
                  </th>
                  <th>STATUS</th>
                  <th className="text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {paginatedMembers.map((member) => (
                  <tr key={member.id} className={selectedIds.has(member.id) ? "is-selected" : ""}>
                    <td className="wl-td-checkbox">
                      <label className="wl-checkbox-label">
                        <input
                          type="checkbox"
                          checked={selectedIds.has(member.id)}
                          onChange={() => handleToggleSelectRow(member.id)}
                          aria-label={`Select ${member.name}`}
                        />
                        <span className="wl-custom-checkbox" />
                      </label>
                    </td>

                    <td>
                      <div className="wl-member-cell">
                        <div className="wl-avatar-wrap">
                          <span className={`wl-avatar ${member.tone}`}>{member.initials}</span>
                          <span className="wl-presence-dot online" />
                        </div>
                        <div>
                          <b className="wl-member-name">{member.name}</b>
                          <small className="wl-member-role">{member.role}</small>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div className="wl-table-capacity">
                        <span
                          className={`wl-table-cap-badge ${
                            member.capacity >= 90
                              ? "danger"
                              : member.capacity >= 75
                              ? "warning"
                              : member.capacity >= 50
                              ? "normal"
                              : "healthy"
                          }`}
                        >
                          {member.capacity}%
                        </span>
                        <div className="wl-progress-track">
                          <span
                            className={
                              member.capacity >= 90
                                ? "danger"
                                : member.capacity >= 75
                                ? "warning"
                                : member.capacity >= 50
                                ? "normal"
                                : "healthy"
                            }
                            style={{ width: `${Math.min(100, member.capacity)}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="wl-task-tag assigned">
                        <BriefcaseBusiness size={12} />
                        <b>{member.assigned}</b> tasks
                      </span>
                    </td>

                    <td>
                      <span className="wl-task-tag completed">
                        <CheckCircle2 size={12} />
                        <b>{member.completed}</b> done
                      </span>
                    </td>

                    <td>
                      <span className="wl-task-tag in-progress">
                        <Clock size={12} />
                        <b>{member.inProgress}</b> active
                      </span>
                    </td>

                    <td>
                      {member.overdue > 0 ? (
                        <span className="wl-task-tag overdue">
                          <AlertTriangle size={12} />
                          <b>{member.overdue}</b> overdue
                        </span>
                      ) : (
                        <span className="wl-task-tag clean">
                          <Check size={12} />
                          <span>0 on track</span>
                        </span>
                      )}
                    </td>

                    <td>
                      <div className="wl-hours-cell">
                        <span className="wl-hours-val">
                          <b>{member.hours || Math.round((member.capacity / 100) * 40)}h</b>
                          <small> / {member.maxHours || 40}h</small>
                        </span>
                        <div className="wl-hours-track">
                          <span
                            style={{
                              width: `${Math.min(
                                100,
                                Math.round(((member.hours || (member.capacity / 100) * 40) / (member.maxHours || 40)) * 100)
                              )}%`,
                            }}
                          />
                        </div>
                      </div>
                    </td>

                    <td>
                      <CapacityBadge capacity={member.capacity} />
                    </td>

                    <td className="text-right">
                      <div className="wl-actions-row">
                        <button
                          type="button"
                          className="wl-action-btn edit"
                          title={`Adjust workload parameters for ${member.name}`}
                          aria-label={`Adjust workload for ${member.name}`}
                          onClick={() => startAdjustMember(member)}
                        >
                          <SlidersHorizontal size={14} />
                        </button>

                        <button
                          type="button"
                          className="wl-action-btn view"
                          title={`View ${member.name} in squad directory`}
                          aria-label={`View ${member.name} in squad directory`}
                          onClick={() => navigate("/teamlead/team")}
                        >
                          <ExternalLink size={14} />
                        </button>

                        <button
                          type="button"
                          className="wl-action-btn delete"
                          title={`Remove ${member.name} from workload tracking`}
                          aria-label={`Remove ${member.name} from workload tracking`}
                          onClick={() => setDeleteTarget(member)}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredMembers.length === 0 && (
                  <tr>
                    <td colSpan={10}>
                      <div className="wl-empty">
                        <Users size={32} />
                        <b>No squad members match your filter criteria</b>
                        <span>Try clearing your search or choosing another capacity filter chip.</span>
                        <button
                          type="button"
                          className="wl-reset-filter-btn"
                          onClick={() => {
                            setSearch("");
                            setCapacityFilter("All");
                            setCurrentPage(1);
                          }}
                        >
                          Reset Filters
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer with Rows Per Page & SaaS Pagination */}
          <div className="wl-table-footer">
            <div className="wl-footer-left">
              <div className="wl-rows-per-page">
                <label htmlFor="wl-rows-select">Rows per page:</label>
                <div className="wl-rows-select-wrap">
                  <select
                    id="wl-rows-select"
                    value={rowsPerPage}
                    onChange={(e) => handleRowsPerPageChange(e.target.value)}
                    aria-label="Rows per page"
                  >
                    <option value={5}>5 rows</option>
                    <option value={10}>10 rows</option>
                    <option value={20}>20 rows</option>
                    <option value={50}>50 rows</option>
                    <option value="All">All rows</option>
                  </select>
                  <ChevronDown size={13} />
                </div>
              </div>

              <div className="wl-footer-telemetry">
                <span>
                  Showing{" "}
                  <b>
                    {filteredMembers.length > 0 ? startIndex + 1 : 0}&ndash;
                    {Math.min(
                      startIndex + (rowsPerPage === "All" ? filteredMembers.length : Number(rowsPerPage)),
                      filteredMembers.length
                    )}
                  </b>{" "}
                  of <b>{filteredMembers.length}</b> squad members &bull; Avg. capacity:{" "}
                  <b>{avgCapacity}%</b> &bull; Total tasks: <b>{totalAssigned}</b>
                </span>
              </div>
            </div>

            <div className="wl-footer-right">
              {rowsPerPage !== "All" && totalPages > 1 && (
                <nav className="wl-pagination-controls" aria-label="Workload table pagination">
                  <button
                    type="button"
                    className="wl-page-nav-btn"
                    disabled={safeCurrentPage <= 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    aria-label="Previous page"
                  >
                    <ChevronLeft size={14} />
                    <span>Prev</span>
                  </button>

                  <div className="wl-page-numbers">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        type="button"
                        key={page}
                        className={`wl-page-num-btn ${safeCurrentPage === page ? "active" : ""}`}
                        onClick={() => setCurrentPage(page)}
                        aria-label={`Page ${page}`}
                        aria-current={safeCurrentPage === page ? "page" : undefined}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    className="wl-page-nav-btn"
                    disabled={safeCurrentPage >= totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    aria-label="Next page"
                  >
                    <span>Next</span>
                    <ChevronRight size={14} />
                  </button>
                </nav>
              )}

              <div className="wl-footer-links">
                <button
                  type="button"
                  className="wl-link-button"
                  onClick={() => navigate("/teamlead/team")}
                >
                  <span>Squad Directory</span>
                  <ExternalLink size={13} />
                </button>
                <button
                  type="button"
                  className="wl-link-button"
                  onClick={() => navigate("/teamlead/sprint-hub")}
                >
                  <span>AI Sprint Hub</span>
                  <ExternalLink size={13} />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ADJUST MEMBER WORKLOAD INTERACTIVE MODAL */}
        {adjustTarget && (
          <div
            className="wl-modal-overlay"
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) setAdjustTarget(null);
            }}
          >
            <div
              className="wl-modal-box"
              role="dialog"
              aria-modal="true"
              aria-labelledby="wl-adjust-title"
            >
              {/* Header */}
              <div className="wl-modal-header">
                <div className="wl-modal-profile">
                  <span className={`wl-avatar ${adjustTarget.tone}`}>
                    {adjustTarget.initials}
                  </span>
                  <div className="wl-modal-profile-text">
                    <div className="wl-modal-title-row">
                      <h2 id="wl-adjust-title">Adjust Workload: {adjustTarget.name}</h2>
                      <span className="wl-modal-role-pill">{adjustTarget.role}</span>
                    </div>
                    <p>Fine-tune capacity limits, sprint assignments, and weekly logged hours.</p>
                  </div>
                </div>
                <button
                  type="button"
                  className="wl-modal-close"
                  onClick={() => setAdjustTarget(null)}
                  aria-label="Close modal"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={saveAdjustMember} className="wl-modal-form">
                {/* Live Workload Telemetry Preview Card */}
                <div className="wl-modal-preview-card">
                  <div className="wl-preview-header">
                    <div className="wl-preview-title">
                      <Sparkles size={14} />
                      <span>Real-Time Bandwidth Simulation</span>
                    </div>
                    <span className={`wl-capacity-badge ${capStatus.class}`}>
                      <i style={{ background: capStatus.dotColor }} />
                      {capStatus.label} ({currentCap}%)
                    </span>
                  </div>

                  <div className="wl-preview-meter-track">
                    <div
                      className={`wl-preview-meter-fill ${capStatus.class}`}
                      style={{ width: `${Math.min(100, currentCap)}%` }}
                    />
                    <div className="wl-meter-marker" title="Optimal target: 75%">
                      <span>75% Target</span>
                    </div>
                  </div>

                  <div className="wl-preview-meta">
                    <span className="wl-preview-metric">
                      <Clock size={13} />
                      <b>{currentHrs}h</b> / {targetMaxHrs}h weekly bandwidth
                    </span>
                    <span className="wl-preview-metric">
                      <BriefcaseBusiness size={13} />
                      <b>{adjustForm.assigned}</b> active tasks
                    </span>
                    <span className={`wl-preview-metric note ${capStatus.class}`}>
                      {currentCap >= 90
                        ? "⚠️ High burnout risk"
                        : currentCap >= 75
                        ? "⚡ Approaching ceiling"
                        : currentCap >= 50
                        ? "✓ Balanced allocation"
                        : "ℹ️ Available for tasks"}
                    </span>
                  </div>
                </div>

                {/* 1-Click Presets */}
                <div className="wl-presets-section">
                  <span className="wl-presets-label">Quick Presets:</span>
                  <div className="wl-presets-chips">
                    {[
                      { label: "Light (50%)", cap: 50 },
                      { label: "Optimal (70%)", cap: 70 },
                      { label: "Target (80%)", cap: 80 },
                      { label: "Sprint Full (90%)", cap: 90 },
                      { label: "Max (100%)", cap: 100 },
                    ].map((p) => (
                      <button
                        type="button"
                        key={p.label}
                        className={`wl-preset-chip ${currentCap === p.cap ? "active" : ""}`}
                        onClick={() => handleApplyPreset(p.cap)}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Capacity & Weekly Hours Sliders */}
                <div className="wl-modal-sliders-row">
                  {/* Capacity Utilization */}
                  <div className="wl-slider-card">
                    <div className="wl-slider-card-header">
                      <label htmlFor="wl-cap-slider" className="wl-input-label">
                        <Percent size={14} /> Capacity Utilization
                      </label>
                      <div className="wl-number-badge">
                        <input
                          id="wl-cap-num"
                          type="number"
                          min="0"
                          max="150"
                          value={adjustForm.capacity}
                          onChange={(e) => handleCapacityChange(e.target.value)}
                          aria-label="Capacity percentage"
                        />
                        <span>%</span>
                      </div>
                    </div>

                    <div className="wl-range-wrap">
                      <input
                        id="wl-cap-slider"
                        type="range"
                        min="0"
                        max="130"
                        step="1"
                        value={adjustForm.capacity}
                        onChange={(e) => handleCapacityChange(e.target.value)}
                        className="wl-interactive-range"
                      />
                      <div className="wl-range-ticks">
                        <span>0%</span>
                        <span>50%</span>
                        <span>75%</span>
                        <span>100%</span>
                        <span>130%</span>
                      </div>
                    </div>
                  </div>

                  {/* Weekly Hours */}
                  <div className="wl-slider-card">
                    <div className="wl-slider-card-header">
                      <label htmlFor="wl-hrs-num" className="wl-input-label">
                        <Clock size={14} /> Weekly Bandwidth (Hours)
                      </label>
                      <div className="wl-number-badge">
                        <input
                          id="wl-hrs-num"
                          type="number"
                          min="0"
                          max="80"
                          value={adjustForm.hours}
                          onChange={(e) => handleHoursChange(e.target.value)}
                          aria-label="Weekly hours"
                        />
                        <span>hrs</span>
                      </div>
                    </div>

                    <div className="wl-range-wrap">
                      <input
                        type="range"
                        min="0"
                        max="60"
                        step="1"
                        value={adjustForm.hours}
                        onChange={(e) => handleHoursChange(e.target.value)}
                        className="wl-interactive-range hours"
                      />
                      <div className="wl-range-ticks">
                        <span>0h</span>
                        <span>20h</span>
                        <span>30h</span>
                        <span>40h</span>
                        <span>60h</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Auto Sync Toggle */}
                <div className="wl-autosync-row">
                  <label className="wl-autosync-toggle">
                    <input
                      type="checkbox"
                      checked={adjustForm.autoSync}
                      onChange={(e) => setAdjustForm({ ...adjustForm, autoSync: e.target.checked })}
                    />
                    <Link2 size={13} />
                    <span>Link capacity &amp; weekly hours automatically (based on {targetMaxHrs}h weekly standard)</span>
                  </label>
                </div>

                {/* Task Allocations Stepper Section */}
                <div className="wl-modal-tasks-section">
                  <div className="wl-tasks-header">
                    <div>
                      <span className="wl-tasks-title">Task Breakdown &amp; Velocity</span>
                      <p className="wl-tasks-sub">
                        Adjust assignments across the sprint lifecycle with increment controls.
                      </p>
                    </div>
                    <button
                      type="button"
                      className="wl-auto-sum-btn"
                      onClick={handleAutoSumAssigned}
                      title="Calculate Assigned = Completed + In Progress + Overdue"
                    >
                      <Sparkles size={13} /> Auto-Sync Assigned Tasks
                    </button>
                  </div>

                  <div className="wl-steppers-grid">
                    {/* Assigned */}
                    <div className="wl-stepper-card assigned">
                      <div className="wl-stepper-top">
                        <span className="wl-stepper-icon">
                          <BriefcaseBusiness size={14} />
                        </span>
                        <span className="wl-stepper-label">Assigned Tasks</span>
                      </div>
                      <div className="wl-stepper-controls">
                        <button
                          type="button"
                          className="wl-step-btn"
                          onClick={() => handleTaskStep("assigned", -1)}
                          aria-label="Decrease assigned"
                        >
                          <Minus size={14} />
                        </button>
                        <input
                          type="number"
                          min="0"
                          max="60"
                          value={adjustForm.assigned}
                          onChange={(e) => setAdjustForm({ ...adjustForm, assigned: Math.max(0, Number(e.target.value) || 0) })}
                          className="wl-step-input"
                          aria-label="Assigned tasks value"
                        />
                        <button
                          type="button"
                          className="wl-step-btn"
                          onClick={() => handleTaskStep("assigned", 1)}
                          aria-label="Increase assigned"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <span className="wl-stepper-hint">Total commitments</span>
                    </div>

                    {/* Completed */}
                    <div className="wl-stepper-card completed">
                      <div className="wl-stepper-top">
                        <span className="wl-stepper-icon green">
                          <CheckCircle2 size={14} />
                        </span>
                        <span className="wl-stepper-label">Completed</span>
                      </div>
                      <div className="wl-stepper-controls">
                        <button
                          type="button"
                          className="wl-step-btn"
                          onClick={() => handleTaskStep("completed", -1)}
                          aria-label="Decrease completed"
                        >
                          <Minus size={14} />
                        </button>
                        <input
                          type="number"
                          min="0"
                          max="60"
                          value={adjustForm.completed}
                          onChange={(e) => setAdjustForm({ ...adjustForm, completed: Math.max(0, Number(e.target.value) || 0) })}
                          className="wl-step-input"
                          aria-label="Completed tasks value"
                        />
                        <button
                          type="button"
                          className="wl-step-btn"
                          onClick={() => handleTaskStep("completed", 1)}
                          aria-label="Increase completed"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <span className="wl-stepper-hint green">Sprint deliveries</span>
                    </div>

                    {/* In Progress */}
                    <div className="wl-stepper-card in-progress">
                      <div className="wl-stepper-top">
                        <span className="wl-stepper-icon blue">
                          <Clock size={14} />
                        </span>
                        <span className="wl-stepper-label">In Progress</span>
                      </div>
                      <div className="wl-stepper-controls">
                        <button
                          type="button"
                          className="wl-step-btn"
                          onClick={() => handleTaskStep("inProgress", -1)}
                          aria-label="Decrease in progress"
                        >
                          <Minus size={14} />
                        </button>
                        <input
                          type="number"
                          min="0"
                          max="60"
                          value={adjustForm.inProgress}
                          onChange={(e) => setAdjustForm({ ...adjustForm, inProgress: Math.max(0, Number(e.target.value) || 0) })}
                          className="wl-step-input"
                          aria-label="In progress tasks value"
                        />
                        <button
                          type="button"
                          className="wl-step-btn"
                          onClick={() => handleTaskStep("inProgress", 1)}
                          aria-label="Increase in progress"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <span className="wl-stepper-hint blue">Active in development</span>
                    </div>

                    {/* Overdue */}
                    <div className="wl-stepper-card overdue">
                      <div className="wl-stepper-top">
                        <span className="wl-stepper-icon red">
                          <AlertTriangle size={14} />
                        </span>
                        <span className="wl-stepper-label">Overdue</span>
                      </div>
                      <div className="wl-stepper-controls">
                        <button
                          type="button"
                          className="wl-step-btn"
                          onClick={() => handleTaskStep("overdue", -1)}
                          aria-label="Decrease overdue"
                        >
                          <Minus size={14} />
                        </button>
                        <input
                          type="number"
                          min="0"
                          max="60"
                          value={adjustForm.overdue}
                          onChange={(e) => setAdjustForm({ ...adjustForm, overdue: Math.max(0, Number(e.target.value) || 0) })}
                          className="wl-step-input"
                          aria-label="Overdue tasks value"
                        />
                        <button
                          type="button"
                          className="wl-step-btn"
                          onClick={() => handleTaskStep("overdue", 1)}
                          aria-label="Increase overdue"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <span className="wl-stepper-hint red">Needs re-allocation</span>
                    </div>
                  </div>
                </div>

                {/* Modal Actions Footer */}
                <div className="wl-modal-actions-bar">
                  <button
                    type="button"
                    className="wl-modal-reset-btn"
                    onClick={handleResetAdjustForm}
                  >
                    <RotateCcw size={14} />
                    <span>Reset to Initial</span>
                  </button>

                  <div className="wl-modal-primary-actions">
                    <button
                      type="button"
                      className="wl-modal-cancel-btn"
                      onClick={() => setAdjustTarget(null)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="wl-modal-save-btn">
                      <Check size={16} />
                      <span>Save Workload</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* DELETE CONFIRMATION MODAL */}
        {deleteTarget && (
          <div
            className="tl-delete-modal-overlay"
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) setDeleteTarget(null);
            }}
          >
            <div className="tl-delete-modal-box">
              <div className="tl-delete-modal-icon-circle">
                <Trash2 size={24} />
              </div>
              <h3>Remove "{deleteTarget.name}" from Workload?</h3>
              <p>
                Are you sure you want to clear this member from the active workload tracker? They will remain registered in the squad directory.
              </p>
              <div className="tl-delete-modal-footer">
                <button
                  type="button"
                  className="tl-delete-btn-cancel"
                  onClick={() => setDeleteTarget(null)}
                >
                  Keep Member
                </button>
                <button
                  type="button"
                  className="tl-delete-btn-confirm"
                  onClick={confirmDeleteWorkload}
                >
                  Yes, Remove
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
