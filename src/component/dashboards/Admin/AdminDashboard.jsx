import React, { useEffect, useMemo, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarDays,
  Calendar,
  Users,
  FolderKanban,
  ListChecks,
  Bug,
  Building2,
  Database,
  Activity,
  Zap,
  TrendingUp,
  ArrowRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Check,
  Server,
  ShieldCheck,
  HardDrive,
  Mail,
  Bot,
  X,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";

import AdminSidebar from "./AdminSidebar.jsx";
import AdminTopbar from "./AdminTopbar.jsx";
import "./AdminDashboard.css";

/* =========================================================
   ANIMATED NUMBER COMPONENT
========================================================= */
function AnimatedNumber({ value, prefix = "", suffix = "" }) {
  const numericValue = useMemo(() => {
    if (typeof value === "number") return value;
    const cleaned = String(value).replace(/[^0-9]/g, "");
    return parseInt(cleaned, 10) || 0;
  }, [value]);

  const [displayValue, setDisplayValue] = useState(numericValue);

  useEffect(() => {
    let startVal = displayValue;
    let endVal = numericValue;
    if (startVal === endVal) return;

    let startTime = null;
    const duration = 400;

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const factor = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = Math.floor(startVal + (endVal - startVal) * factor);
      setDisplayValue(current);
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    const animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [numericValue]);

  return (
    <span className="tf-live-num">
      {prefix}
      {displayValue.toLocaleString()}
      {suffix}
    </span>
  );
}

/* =========================================================
   TIMEFRAME DATA PRESETS
========================================================= */
const TIMEFRAME_PRESETS = {
  "This Month": {
    label: "Oct 1, 2024 - Oct 31, 2024",
    users: 248,
    usersTrend: "↑ 12%",
    usersSub: "+ 26 this month",
    projects: 48,
    projectsTrend: "↑ 20%",
    projectsSub: "+ 8 this month",
    tasks: 1256,
    tasksTrend: "↑ 15%",
    tasksSub: "+ 165 this month",
    bugs: 86,
    bugsTrend: "↑ 8%",
    bugsSub: "+ 12 this month",
    activeWorkspaces: 12,
    activeWorkspacesTrend: "↑ 9%",
    activeWorkspacesSub: "+1 this month",
    activeTeams: 8,
    activeTeamsTrend: "↑ 14%",
    activeTeamsSub: "+1 this month",
    storageUsed: "426 GB",
    storageUsedTrend: "↑ 12%",
    storageUsedSub: "of 1 TB",
    apiCalls: "84,520",
    apiCallsTrend: "↑ 18%",
    apiCallsSub: "+12,250 this month",
    taskBreakdown: {
      total: 1256,
      completed: 565,
      completedPct: 45,
      inProgress: 314,
      inProgressPct: 25,
      pending: 251,
      pendingPct: 20,
      overdue: 126,
      overduePct: 10,
    },
    userGrowth: [
      { label: "Jan", val: 32, height: "13%" },
      { label: "Feb", val: 48, height: "19%" },
      { label: "Mar", val: 65, height: "26%" },
      { label: "Apr", val: 82, height: "33%" },
      { label: "May", val: 104, height: "42%" },
      { label: "Jun", val: 132, height: "53%" },
      { label: "Jul", val: 160, height: "64%" },
      { label: "Aug", val: 188, height: "75%" },
      { label: "Sep", val: 216, height: "86%" },
      { label: "Oct", val: 248, height: "99%" },
    ],
    projectProgress: [
      { id: 1, name: "Website Redesign", progress: 85, color: "#6366f1" },
      { id: 2, name: "Mobile App", progress: 70, color: "#0ea5e9" },
      { id: 3, name: "AI Integration", progress: 60, color: "#10b981" },
      { id: 4, name: "Marketing Portal", progress: 45, color: "#f59e0b" },
      { id: 5, name: "Internal Tools", progress: 30, color: "#ef4444" },
    ],
  },

  "Today": {
    label: "Today (Oct 26, 2024)",
    users: 248,
    usersTrend: "↑ 4%",
    usersSub: "64 active today",
    projects: 48,
    projectsTrend: "↑ 2%",
    projectsSub: "6 updated sprints",
    tasks: 42,
    tasksTrend: "↑ 18%",
    tasksSub: "+ 22 completed today",
    bugs: 84,
    bugsTrend: "↓ 2%",
    bugsSub: "4 resolved today",
    activeWorkspaces: 12,
    activeWorkspacesTrend: "↑ 5%",
    activeWorkspacesSub: "All active",
    activeTeams: 8,
    activeTeamsTrend: "↑ 6%",
    activeTeamsSub: "On shift",
    storageUsed: "426 GB",
    storageUsedTrend: "↑ 2%",
    storageUsedSub: "of 1 TB",
    apiCalls: "3,420",
    apiCallsTrend: "↑ 14%",
    apiCallsSub: "Normal latency",
    taskBreakdown: {
      total: 42,
      completed: 22,
      completedPct: 52,
      inProgress: 12,
      inProgressPct: 29,
      pending: 6,
      pendingPct: 14,
      overdue: 2,
      overduePct: 5,
    },
    userGrowth: [
      { label: "08:00", val: 12, height: "18%" },
      { label: "10:00", val: 28, height: "42%" },
      { label: "12:00", val: 45, height: "68%" },
      { label: "14:00", val: 56, height: "84%" },
      { label: "16:00", val: 64, height: "96%" },
    ],
    projectProgress: [
      { id: 1, name: "Website Redesign", progress: 88, color: "#6366f1" },
      { id: 2, name: "Mobile App", progress: 72, color: "#0ea5e9" },
      { id: 3, name: "AI Integration", progress: 62, color: "#10b981" },
      { id: 4, name: "Marketing Portal", progress: 48, color: "#f59e0b" },
      { id: 5, name: "Internal Tools", progress: 32, color: "#ef4444" },
    ],
  },

  "7 Days": {
    label: "Last 7 Days (Oct 20 - Oct 26, 2024)",
    users: 248,
    usersTrend: "↑ 8%",
    usersSub: "+ 12 this week",
    projects: 48,
    projectsTrend: "↑ 10%",
    projectsSub: "+ 3 this week",
    tasks: 312,
    tasksTrend: "↑ 20%",
    tasksSub: "+ 156 completed",
    bugs: 84,
    bugsTrend: "↑ 4%",
    bugsSub: "+ 8 new issues",
    activeWorkspaces: 12,
    activeWorkspacesTrend: "↑ 9%",
    activeWorkspacesSub: "100% health",
    activeTeams: 8,
    activeTeamsTrend: "↑ 10%",
    activeTeamsSub: "Stable quotas",
    storageUsed: "426 GB",
    storageUsedTrend: "↑ 5%",
    storageUsedSub: "of 1 TB",
    apiCalls: "21,800",
    apiCallsTrend: "↑ 16%",
    apiCallsSub: "High throughput",
    taskBreakdown: {
      total: 312,
      completed: 156,
      completedPct: 50,
      inProgress: 82,
      inProgressPct: 26,
      pending: 52,
      pendingPct: 17,
      overdue: 22,
      overduePct: 7,
    },
    userGrowth: [
      { label: "Mon", val: 185, height: "74%" },
      { label: "Tue", val: 198, height: "80%" },
      { label: "Wed", val: 210, height: "85%" },
      { label: "Thu", val: 226, height: "91%" },
      { label: "Fri", val: 238, height: "96%" },
      { label: "Sat", val: 242, height: "97%" },
      { label: "Sun", val: 248, height: "99%" },
    ],
    projectProgress: [
      { id: 1, name: "Website Redesign", progress: 85, color: "#6366f1" },
      { id: 2, name: "Mobile App", progress: 70, color: "#0ea5e9" },
      { id: 3, name: "AI Integration", progress: 60, color: "#10b981" },
      { id: 4, name: "Marketing Portal", progress: 45, color: "#f59e0b" },
      { id: 5, name: "Internal Tools", progress: 30, color: "#ef4444" },
    ],
  },
};

/* =========================================================
   STATIC SUB-DATASETS (MATCHING THE SCREENSHOT EXACTLY)
========================================================= */
const RECENT_USERS = [
  { id: 1, initials: "RS", name: "Rahul Sharma", email: "rahul@abc.com", role: "Team Lead", status: "Active", joined: "2 hours ago", avatarBg: "#eff6ff", avatarColor: "#3b82f6" },
  { id: 2, initials: "PP", name: "Priya Patel", email: "priya@xyz.com", role: "Member", status: "Active", joined: "5 hours ago", avatarBg: "#eef2ff", avatarColor: "#6366f1" },
  { id: 3, initials: "AK", name: "Amit Kumar", email: "amit@startup.com", role: "Member", status: "Active", joined: "1 day ago", avatarBg: "#f5f3ff", avatarColor: "#8b5cf6" },
  { id: 4, initials: "SS", name: "Sneha Singh", email: "sneha@designhub.com", role: "Member", status: "Active", joined: "2 days ago", avatarBg: "#fdf2f8", avatarColor: "#ec4899" },
  { id: 5, initials: "VR", name: "Vikram Reddy", email: "vikram@nextgen.com", role: "Member", status: "Inactive", joined: "3 days ago", avatarBg: "#fef2f2", avatarColor: "#ef4444" },
];

const RECENT_PROJECTS = [
  {
    id: 1,
    name: "Website Redesign",
    extraTeam: "+3",
    progress: 85,
    barColor: "#6366f1",
    status: "On Track",
    statusType: "success",
    team: [
      { name: "Priya Patel", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop" },
      { name: "Rahul Sharma", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop" },
    ],
  },
  {
    id: 2,
    name: "Mobile App",
    extraTeam: "+5",
    progress: 70,
    barColor: "#0ea5e9",
    status: "On Track",
    statusType: "success",
    team: [
      { name: "Abhishek Verma", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop" },
      { name: "Priya Patel", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop" },
    ],
  },
  {
    id: 3,
    name: "AI Integration",
    extraTeam: "+4",
    progress: 60,
    barColor: "#10b981",
    status: "At Risk",
    statusType: "warning",
    team: [
      { name: "David Lee", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop" },
      { name: "Sarah Chen", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop" },
    ],
  },
  {
    id: 4,
    name: "Marketing Portal",
    extraTeam: "+2",
    progress: 45,
    barColor: "#f59e0b",
    status: "On Track",
    statusType: "success",
    team: [
      { name: "Elena Rostova", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop" },
      { name: "Sneha Gupta", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=80&h=80&fit=crop" },
    ],
  },
  {
    id: 5,
    name: "Internal Tools",
    extraTeam: "+3",
    progress: 30,
    barColor: "#ef4444",
    status: "Delayed",
    statusType: "danger",
    team: [
      { name: "Alex Rivera", avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=80&h=80&fit=crop" },
      { name: "Michael Chang", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&h=80&fit=crop" },
    ],
  },
];

const SYSTEM_HEALTH_ITEMS = [
  { id: 1, name: "API Server", icon: Server, status: "Operational", metric: "99.9% uptime" },
  { id: 2, name: "Database", icon: Database, status: "Operational", metric: "32ms latency" },
  { id: 3, name: "Authentication", icon: ShieldCheck, status: "Operational", metric: "99.8% uptime" },
  { id: 4, name: "File Storage", icon: HardDrive, status: "Operational", metric: "42% used" },
  { id: 5, name: "Email Service", icon: Mail, status: "Operational", metric: "99.7% success" },
  { id: 6, name: "AI Service", icon: Bot, status: "Operational", metric: "1.2s response" },
];

/* =========================================================
   CUSTOM CALENDAR CONSTANTS & HELPERS
========================================================= */
const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const MONTH_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const CALENDAR_PRESETS = [
  { id: "Today", label: "Today", start: "2024-10-26", end: "2024-10-26" },
  { id: "Yesterday", label: "Yesterday", start: "2024-10-25", end: "2024-10-25" },
  { id: "7 Days", label: "Last 7 Days", start: "2024-10-20", end: "2024-10-26" },
  { id: "30 Days", label: "Last 30 Days", start: "2024-09-27", end: "2024-10-26" },
  { id: "This Month", label: "This Month", start: "2024-10-01", end: "2024-10-31" },
  { id: "Last Month", label: "Last Month", start: "2024-09-01", end: "2024-09-30" },
  { id: "This Year", label: "This Year", start: "2024-01-01", end: "2024-12-31" },
  { id: "custom", label: "Custom Range", start: "", end: "" },
];

function formatPrettyDate(str) {
  if (!str) return "";
  const parts = str.split("-").map(Number);
  if (parts.length < 3) return str;
  const [y, m, d] = parts;
  return `${MONTH_SHORT[m - 1]} ${d}, ${y}`;
}

function formatDateRangeStr(start, end) {
  if (!start || !end) return "";
  if (start === end) return formatPrettyDate(start);
  return `${formatPrettyDate(start)} - ${formatPrettyDate(end)}`;
}

function buildCustomDataset(startDate, endDate) {
  const s = new Date(startDate);
  const e = new Date(endDate);
  const days = Math.max(1, Math.round(Math.abs(e - s) / (1000 * 60 * 60 * 24)) + 1);
  const label = formatDateRangeStr(startDate, endDate);

  const tasksTotal = Math.max(12, Math.round(1256 * (days / 31)));
  const completed = Math.round(tasksTotal * 0.45);
  const inProgress = Math.round(tasksTotal * 0.25);
  const pending = Math.round(tasksTotal * 0.20);
  const overdue = Math.max(0, tasksTotal - (completed + inProgress + pending));

  let userGrowth = [];
  if (days <= 7) {
    const daysArr = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].slice(0, days);
    userGrowth = daysArr.map((lbl, idx) => ({
      label: lbl,
      val: Math.round(200 + idx * 8),
      height: `${Math.min(99, Math.round(50 + idx * 7))}%`,
    }));
  } else if (days <= 35) {
    userGrowth = [
      { label: "W1", val: 54, height: "22%" },
      { label: "W2", val: 98, height: "40%" },
      { label: "W3", val: 172, height: "70%" },
      { label: "W4", val: 248, height: "99%" },
    ];
  } else {
    userGrowth = [
      { label: "Jan", val: 32, height: "13%" },
      { label: "Feb", val: 48, height: "19%" },
      { label: "Mar", val: 65, height: "26%" },
      { label: "Apr", val: 82, height: "33%" },
      { label: "May", val: 104, height: "42%" },
      { label: "Jun", val: 132, height: "53%" },
      { label: "Jul", val: 160, height: "64%" },
      { label: "Aug", val: 188, height: "75%" },
      { label: "Sep", val: 216, height: "86%" },
      { label: "Oct", val: 248, height: "99%" },
    ];
  }

  return {
    label,
    users: 248,
    usersTrend: `↑ ${Math.min(25, Math.max(2, Math.round(days * 0.4)))}%`,
    usersSub: `+ ${Math.max(2, Math.round(days * 0.8))} in this range`,
    projects: 48,
    projectsTrend: "↑ 20%",
    projectsSub: "+ 8 active sprints",
    tasks: tasksTotal,
    tasksTrend: "↑ 15%",
    tasksSub: `+ ${Math.max(5, Math.round(tasksTotal * 0.15))} this period`,
    bugs: Math.min(120, Math.max(30, Math.round(18 + days * 2.2))),
    bugsTrend: "↑ 8%",
    bugsSub: "Active issues in range",
    activeWorkspaces: 12,
    activeWorkspacesTrend: "↑ 9%",
    activeWorkspacesSub: "Healthy uptime",
    activeTeams: 8,
    activeTeamsTrend: "↑ 14%",
    activeTeamsSub: "All teams active",
    storageUsed: "426 GB",
    storageUsedTrend: "↑ 12%",
    storageUsedSub: "of 1 TB",
    apiCalls: (Math.round(days * 2726)).toLocaleString(),
    apiCallsTrend: "↑ 18%",
    apiCallsSub: "Normal latency",
    taskBreakdown: {
      total: tasksTotal,
      completed,
      completedPct: 45,
      inProgress,
      inProgressPct: 25,
      pending,
      pendingPct: 20,
      overdue,
      overduePct: 10,
    },
    userGrowth,
    projectProgress: [
      { id: 1, name: "Website Redesign", progress: 85, color: "#6366f1" },
      { id: 2, name: "Mobile App", progress: 70, color: "#0ea5e9" },
      { id: 3, name: "AI Integration", progress: 60, color: "#10b981" },
      { id: 4, name: "Marketing Portal", progress: 45, color: "#f59e0b" },
      { id: 5, name: "Internal Tools", progress: 30, color: "#ef4444" },
    ],
  };
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Global Timeframe selection
  const [dateRangeKey, setDateRangeKey] = useState("This Month");
  const [customDataset, setCustomDataset] = useState(null);

  // Calendar popover & range selection state
  const calendarRef = useRef(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState("This Month");
  const [startDate, setStartDate] = useState("2024-10-01");
  const [endDate, setEndDate] = useState("2024-10-31");

  // Temporary selection inside the popover (committed only on "Apply")
  const [tempStartDate, setTempStartDate] = useState("2024-10-01");
  const [tempEndDate, setTempEndDate] = useState("2024-10-31");
  const [tempPreset, setTempPreset] = useState("This Month");
  const [hoverDate, setHoverDate] = useState(null);
  const [isSelectingRange, setIsSelectingRange] = useState(false);

  // Month navigation for the calendar grid (default: October 2024)
  const [calendarViewDate, setCalendarViewDate] = useState(new Date(2024, 9, 1));

  // Resolved Dataset
  const dataset = useMemo(() => {
    if (dateRangeKey === "Custom" && customDataset) {
      return customDataset;
    }
    return TIMEFRAME_PRESETS[dateRangeKey] || TIMEFRAME_PRESETS["This Month"];
  }, [dateRangeKey, customDataset]);

  // Click outside to dismiss calendar popover
  useEffect(() => {
    function handleClickOutside(event) {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setIsCalendarOpen(false);
      }
    }
    if (isCalendarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isCalendarOpen]);

  // Escape key to close popover
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") {
        setIsCalendarOpen(false);
      }
    }
    if (isCalendarOpen) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [isCalendarOpen]);

  // Calendar Toggle
  const handleToggleCalendar = () => {
    if (!isCalendarOpen) {
      setTempStartDate(startDate);
      setTempEndDate(endDate);
      setTempPreset(selectedPreset);
      setIsSelectingRange(false);
      setHoverDate(null);
      if (startDate) {
        const [y, m] = startDate.split("-").map(Number);
        if (!isNaN(y) && !isNaN(m)) {
          setCalendarViewDate(new Date(y, m - 1, 1));
        }
      }
    }
    setIsCalendarOpen((prev) => !prev);
  };

  // Month Navigation Handlers
  const handlePrevMonth = () => {
    setCalendarViewDate(new Date(calendarViewDate.getFullYear(), calendarViewDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCalendarViewDate(new Date(calendarViewDate.getFullYear(), calendarViewDate.getMonth() + 1, 1));
  };

  const handleTodayMonth = () => {
    setCalendarViewDate(new Date(2024, 9, 1));
  };

  // Day Selection Handlers
  const handleDayClick = (dateStr) => {
    const [y, m] = dateStr.split("-").map(Number);
    if (y !== calendarViewDate.getFullYear() || m - 1 !== calendarViewDate.getMonth()) {
      setCalendarViewDate(new Date(y, m - 1, 1));
    }

    if (!isSelectingRange) {
      setTempStartDate(dateStr);
      setTempEndDate(dateStr);
      setIsSelectingRange(true);
      setTempPreset("custom");
    } else {
      if (dateStr < tempStartDate) {
        setTempEndDate(tempStartDate);
        setTempStartDate(dateStr);
      } else {
        setTempEndDate(dateStr);
      }
      setIsSelectingRange(false);
      setHoverDate(null);
      setTempPreset("custom");
    }
  };

  const handleDayHover = (dateStr) => {
    if (isSelectingRange) {
      setHoverDate(dateStr);
    }
  };

  const handleSelectPreset = (preset) => {
    setTempPreset(preset.id);
    setIsSelectingRange(false);
    setHoverDate(null);
    if (preset.id !== "custom" && preset.start && preset.end) {
      setTempStartDate(preset.start);
      setTempEndDate(preset.end);
      const [y, m] = preset.start.split("-").map(Number);
      if (!isNaN(y) && !isNaN(m)) {
        setCalendarViewDate(new Date(y, m - 1, 1));
      }
    }
  };

  const handleStartDateChange = (val) => {
    setTempStartDate(val);
    setTempPreset("custom");
    if (val) {
      const [y, m] = val.split("-").map(Number);
      if (!isNaN(y) && !isNaN(m)) {
        setCalendarViewDate(new Date(y, m - 1, 1));
      }
    }
  };

  const handleEndDateChange = (val) => {
    setTempEndDate(val);
    setTempPreset("custom");
  };

  const handleResetToDefault = () => {
    setTempStartDate("2024-10-01");
    setTempEndDate("2024-10-31");
    setTempPreset("This Month");
    setIsSelectingRange(false);
    setHoverDate(null);
    setCalendarViewDate(new Date(2024, 9, 1));
  };

  const handleApplyRange = () => {
    let finalStart = tempStartDate;
    let finalEnd = tempEndDate;
    if (finalStart > finalEnd) {
      const swap = finalStart;
      finalStart = finalEnd;
      finalEnd = swap;
    }
    setStartDate(finalStart);
    setEndDate(finalEnd);
    setSelectedPreset(tempPreset);
    setIsSelectingRange(false);
    setHoverDate(null);

    if (tempPreset === "This Month") {
      setDateRangeKey("This Month");
    } else if (tempPreset === "Today") {
      setDateRangeKey("Today");
    } else if (tempPreset === "7 Days") {
      setDateRangeKey("7 Days");
    } else {
      setDateRangeKey("Custom");
      setCustomDataset(buildCustomDataset(finalStart, finalEnd));
    }

    setIsCalendarOpen(false);
  };

  // Effective Range for Visual Highlighting in Grid
  const effectiveRange = useMemo(() => {
    if (isSelectingRange && hoverDate) {
      if (hoverDate < tempStartDate) {
        return { start: hoverDate, end: tempStartDate };
      }
      return { start: tempStartDate, end: hoverDate };
    }
    if (tempStartDate && tempEndDate) {
      if (tempStartDate > tempEndDate) {
        return { start: tempEndDate, end: tempStartDate };
      }
      return { start: tempStartDate, end: tempEndDate };
    }
    return { start: tempStartDate, end: tempStartDate };
  }, [isSelectingRange, hoverDate, tempStartDate, tempEndDate]);

  // Duration in days
  const durationDays = useMemo(() => {
    if (!effectiveRange.start || !effectiveRange.end) return 1;
    const s = new Date(effectiveRange.start);
    const e = new Date(effectiveRange.end);
    return Math.max(1, Math.round(Math.abs(e - s) / (1000 * 60 * 60 * 24)) + 1);
  }, [effectiveRange]);

  // Generate 35 or 42 grid cells for the current viewed month
  const calendarCells = useMemo(() => {
    const year = calendarViewDate.getFullYear();
    const month = calendarViewDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const totalDays = lastDay.getDate();
    const startDay = firstDay.getDay(); // 0 is Sunday

    const cells = [];
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startDay - 1; i >= 0; i--) {
      const d = prevMonthLastDay - i;
      const prevM = month === 0 ? 11 : month - 1;
      const prevY = month === 0 ? year - 1 : year;
      const dateStr = `${prevY}-${String(prevM + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      cells.push({ day: d, dateStr, isCurrentMonth: false });
    }

    for (let d = 1; d <= totalDays; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      cells.push({ day: d, dateStr, isCurrentMonth: true });
    }

    const totalSlots = cells.length > 35 ? 42 : 35;
    const remaining = totalSlots - cells.length;
    for (let d = 1; d <= remaining; d++) {
      const nextM = month === 11 ? 0 : month + 1;
      const nextY = month === 11 ? year + 1 : year;
      const dateStr = `${nextY}-${String(nextM + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      cells.push({ day: d, dateStr, isCurrentMonth: false });
    }

    return cells;
  }, [calendarViewDate]);

  // Sub-card filter dropdown states
  const [userGrowthTimeframe, setUserGrowthTimeframe] = useState("This Year");
  const [taskStatusTimeframe, setTaskStatusTimeframe] = useState("This Month");
  const [projectProgressTimeframe, setProjectProgressTimeframe] = useState("This Month");

  // Health modal state
  const [healthModalOpen, setHealthModalOpen] = useState(false);

  // Derived user growth bars
  const userGrowthBars = useMemo(() => {
    if (userGrowthTimeframe === "Last 6 Months") {
      return dataset.userGrowth.slice(-6);
    }
    if (userGrowthTimeframe === "This Month") {
      return [
        { label: "W1", val: 54, height: "22%" },
        { label: "W2", val: 98, height: "40%" },
        { label: "W3", val: 172, height: "70%" },
        { label: "W4", val: 248, height: "99%" },
      ];
    }
    return dataset.userGrowth;
  }, [userGrowthTimeframe, dataset]);

  // Donut chart math for Task Status Overview
  const taskData = dataset.taskBreakdown;
  const radius = 54;
  const circumference = 2 * Math.PI * radius; // ~339.29
  const strokeW = 16;

  // Offsets for 4 slices
  const cPct = taskData.completedPct / 100;
  const ipPct = taskData.inProgressPct / 100;
  const pPct = taskData.pendingPct / 100;
  const oPct = taskData.overduePct / 100;

  const lenCompleted = cPct * circumference;
  const lenInProgress = ipPct * circumference;
  const lenPending = pPct * circumference;
  const lenOverdue = oPct * circumference;

  const offCompleted = 0;
  const offInProgress = -lenCompleted;
  const offPending = -(lenCompleted + lenInProgress);
  const offOverdue = -(lenCompleted + lenInProgress + lenPending);

  return (
    <div className="tfSaasAdmin">
      {/* SIDEBAR NAVIGATION */}
      <AdminSidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="tfSaasAdmin__container">
        {/* TOPBAR */}
        <AdminTopbar onMobileMenuToggle={() => setMobileOpen(true)} />

        <main className="tfSaasAdmin__content">
          {/* =========================================================
              HEADER SECTION: GREETING & DATE RANGE PICKER
          ========================================================= */}
          <section className="tfSaasAdmin__header">
            <div className="tfSaasAdmin__headerText">
              <h1>Welcome back, Amit! 👋</h1>
              <p>Here's what's happening in your organization today.</p>
            </div>

            <div className="tfSaasAdmin__headerControls">
              <div className="tfSaasAdmin__datePickerWrapper" ref={calendarRef}>
                <button
                  type="button"
                  className={`tfSaasAdmin__dateTriggerBtn ${isCalendarOpen ? "active" : ""}`}
                  onClick={handleToggleCalendar}
                  aria-label="Filter dashboard by date range"
                  aria-expanded={isCalendarOpen}
                >
                  <CalendarDays size={16} className="date-icon" />
                  <span className="date-label">{dataset.label}</span>
                  <ChevronDown size={14} className={`chevron-icon ${isCalendarOpen ? "rotate" : ""}`} />
                </button>

                {/* CUSTOM INTERACTIVE CALENDAR POPOVER */}
                {isCalendarOpen && (
                  <div
                    className="tfSaasAdmin__calendarPopover"
                    role="dialog"
                    aria-modal="true"
                    aria-label="Custom Date Range Picker"
                  >
                    <div className="tfSaasAdmin__calendarHeader">
                      <div className="tfSaasAdmin__calendarHeaderTitle">
                        <Calendar size={14} className="header-cal-icon" />
                        <span>Custom Date Range</span>
                      </div>
                      <button
                        type="button"
                        className="tfSaasAdmin__calendarCloseBtn"
                        onClick={() => setIsCalendarOpen(false)}
                        title="Close date picker"
                      >
                        <X size={14} />
                      </button>
                    </div>

                    <div className="tfSaasAdmin__calendarBody">
                      {/* Presets Sidebar */}
                      <div className="tfSaasAdmin__presetsCol">
                        <span className="tfSaasAdmin__presetsHeading">Presets</span>
                        <div className="tfSaasAdmin__presetsList">
                          {CALENDAR_PRESETS.map((preset) => {
                            const isActive = tempPreset === preset.id;
                            return (
                              <button
                                key={preset.id}
                                type="button"
                                className={`tfSaasAdmin__presetBtn ${isActive ? "active" : ""}`}
                                onClick={() => handleSelectPreset(preset)}
                              >
                                <span>{preset.label}</span>
                                {isActive && <Check size={11} className="preset-check" />}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Interactive Calendar Month */}
                      <div className="tfSaasAdmin__calendarCol">
                        {/* Month Navigation */}
                        <div className="tfSaasAdmin__monthNav">
                          <button
                            type="button"
                            className="tfSaasAdmin__navBtn"
                            onClick={handlePrevMonth}
                            title="Previous Month"
                          >
                            <ChevronLeft size={13} />
                          </button>

                          <div className="tfSaasAdmin__monthTitleWrap">
                            <span className="tfSaasAdmin__currentMonthLabel">
                              {MONTH_NAMES[calendarViewDate.getMonth()]} {calendarViewDate.getFullYear()}
                            </span>
                            <button
                              type="button"
                              className="tfSaasAdmin__todayJumpBtn"
                              onClick={handleTodayMonth}
                              title="Jump to current demo month (Oct 2024)"
                            >
                              Current
                            </button>
                          </div>

                          <button
                            type="button"
                            className="tfSaasAdmin__navBtn"
                            onClick={handleNextMonth}
                            title="Next Month"
                          >
                            <ChevronRight size={13} />
                          </button>
                        </div>

                        {/* Weekday headers */}
                        <div className="tfSaasAdmin__weekdaysRow">
                          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                            <span key={day} className="tfSaasAdmin__weekdayHeader">
                              {day}
                            </span>
                          ))}
                        </div>

                        {/* Days Grid */}
                        <div className="tfSaasAdmin__daysGrid">
                          {calendarCells.map((cell, idx) => {
                            const isStart = cell.dateStr === effectiveRange.start;
                            const isEnd = cell.dateStr === effectiveRange.end;
                            const isSingle = isStart && isEnd;
                            const isInRange =
                              cell.dateStr > effectiveRange.start && cell.dateStr < effectiveRange.end;
                            const isRangePreview =
                              isSelectingRange &&
                              hoverDate &&
                              ((cell.dateStr >= tempStartDate && cell.dateStr <= hoverDate) ||
                                (cell.dateStr <= tempStartDate && cell.dateStr >= hoverDate));

                            return (
                              <button
                                key={`${cell.dateStr}-${idx}`}
                                type="button"
                                className={`tfSaasAdmin__dayCell ${
                                  !cell.isCurrentMonth ? "outside-month" : ""
                                } ${isSingle ? "range-single" : ""} ${
                                  isStart && !isSingle ? "range-start" : ""
                                } ${isEnd && !isSingle ? "range-end" : ""} ${
                                  isInRange ? "in-range" : ""
                                } ${isRangePreview ? "hover-preview" : ""}`}
                                onClick={() => handleDayClick(cell.dateStr)}
                                onMouseEnter={() => handleDayHover(cell.dateStr)}
                                title={cell.dateStr}
                              >
                                <span className="cell-num">{cell.day}</span>
                              </button>
                            );
                          })}
                        </div>

                        {/* Selected Range Display Badges */}
                        <div className="tfSaasAdmin__rangeInputRow">
                          <div className="tfSaasAdmin__rangeBadge">
                            <span className="badge-lbl">Start</span>
                            <span className="badge-val">{tempStartDate || "Select date"}</span>
                          </div>
                          <span className="tfSaasAdmin__rangeArrow">→</span>
                          <div className="tfSaasAdmin__rangeBadge">
                            <span className="badge-lbl">End</span>
                            <span className="badge-val">{tempEndDate || "Select date"}</span>
                          </div>
                          <div className="tfSaasAdmin__rangeDuration">
                            {durationDays} {durationDays === 1 ? "day" : "days"}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Popover Footer */}
                    <div className="tfSaasAdmin__calendarFooter">
                      <button
                        type="button"
                        className="tfSaasAdmin__btnReset"
                        onClick={handleResetToDefault}
                        title="Reset to default October 2024"
                      >
                        <RotateCcw size={12} />
                        <span>Reset</span>
                      </button>

                      <div className="tfSaasAdmin__footerRightBtns">
                        <button
                          type="button"
                          className="tfSaasAdmin__btnCancel"
                          onClick={() => setIsCalendarOpen(false)}
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          className="tfSaasAdmin__btnApply"
                          onClick={handleApplyRange}
                        >
                          <Check size={13} />
                          <span>Apply Range</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* =========================================================
              ROW 1: 4 KPI CARDS WITH SPARKLINES
          ========================================================= */}
          <section className="tfSaasAdmin__kpiGrid">
            {/* 1. TOTAL USERS */}
            <article
              className="tfSaasAdmin__kpiCard"
              onClick={() => navigate("/admin/users")}
              title="Click to view all users"
            >
              <div className="tfSaasAdmin__kpiLeft">
                <div className="tfSaasAdmin__kpiIconBox tfSaasAdmin__kpiIconBox--blue">
                  <Users size={22} />
                </div>
                <div className="tfSaasAdmin__kpiMeta">
                  <span className="tfSaasAdmin__kpiLabel">Total Users</span>
                  <div className="tfSaasAdmin__kpiValueRow">
                    <strong className="tfSaasAdmin__kpiValue">
                      <AnimatedNumber value={dataset.users} />
                    </strong>
                    <span className="tfSaasAdmin__kpiTrend text-green">
                      <TrendingUp size={12} />
                      {dataset.usersTrend}
                    </span>
                  </div>
                  <small className="tfSaasAdmin__kpiSub">{dataset.usersSub}</small>
                </div>
              </div>

              {/* Blue Sparkline SVG */}
              <div className="tfSaasAdmin__kpiSpark">
                <svg viewBox="0 0 100 40" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="tfSparkBlue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.32" />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 0 32 C 20 32, 35 22, 55 20 C 75 18, 85 8, 100 4 L 100 40 L 0 40 Z"
                    fill="url(#tfSparkBlue)"
                  />
                  <path
                    d="M 0 32 C 20 32, 35 22, 55 20 C 75 18, 85 8, 100 4"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </article>

            {/* 2. TOTAL PROJECTS */}
            <article
              className="tfSaasAdmin__kpiCard"
              onClick={() => navigate("/admin/projects")}
              title="Click to view all projects"
            >
              <div className="tfSaasAdmin__kpiLeft">
                <div className="tfSaasAdmin__kpiIconBox tfSaasAdmin__kpiIconBox--purple">
                  <FolderKanban size={22} />
                </div>
                <div className="tfSaasAdmin__kpiMeta">
                  <span className="tfSaasAdmin__kpiLabel">Total Projects</span>
                  <div className="tfSaasAdmin__kpiValueRow">
                    <strong className="tfSaasAdmin__kpiValue">
                      <AnimatedNumber value={dataset.projects} />
                    </strong>
                    <span className="tfSaasAdmin__kpiTrend text-green">
                      <TrendingUp size={12} />
                      {dataset.projectsTrend}
                    </span>
                  </div>
                  <small className="tfSaasAdmin__kpiSub">{dataset.projectsSub}</small>
                </div>
              </div>

              {/* Purple Sparkline SVG with nodes */}
              <div className="tfSaasAdmin__kpiSpark">
                <svg viewBox="0 0 100 40" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="tfSparkPurple" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.32" />
                      <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 0 30 C 25 30, 35 20, 55 22 C 75 25, 85 10, 100 6 L 100 40 L 0 40 Z"
                    fill="url(#tfSparkPurple)"
                  />
                  <path
                    d="M 0 30 C 25 30, 35 20, 55 22 C 75 25, 85 10, 100 6"
                    fill="none"
                    stroke="#8b5cf6"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  <circle cx="55" cy="22" r="2.8" fill="#ffffff" stroke="#8b5cf6" strokeWidth="2" />
                  <circle cx="100" cy="6" r="2.8" fill="#ffffff" stroke="#8b5cf6" strokeWidth="2" />
                </svg>
              </div>
            </article>

            {/* 3. TOTAL TASKS */}
            <article
              className="tfSaasAdmin__kpiCard"
              onClick={() => navigate("/admin/tasks")}
              title="Click to view all tasks"
            >
              <div className="tfSaasAdmin__kpiLeft">
                <div className="tfSaasAdmin__kpiIconBox tfSaasAdmin__kpiIconBox--green">
                  <ListChecks size={22} />
                </div>
                <div className="tfSaasAdmin__kpiMeta">
                  <span className="tfSaasAdmin__kpiLabel">Total Tasks</span>
                  <div className="tfSaasAdmin__kpiValueRow">
                    <strong className="tfSaasAdmin__kpiValue">
                      <AnimatedNumber value={dataset.tasks} />
                    </strong>
                    <span className="tfSaasAdmin__kpiTrend text-green">
                      <TrendingUp size={12} />
                      {dataset.tasksTrend}
                    </span>
                  </div>
                  <small className="tfSaasAdmin__kpiSub">{dataset.tasksSub}</small>
                </div>
              </div>

              {/* Green Sparkline SVG */}
              <div className="tfSaasAdmin__kpiSpark">
                <svg viewBox="0 0 100 40" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="tfSparkGreen" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity="0.32" />
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 0 34 C 20 34, 40 24, 60 22 C 80 18, 90 8, 100 4 L 100 40 L 0 40 Z"
                    fill="url(#tfSparkGreen)"
                  />
                  <path
                    d="M 0 34 C 20 34, 40 24, 60 22 C 80 18, 90 8, 100 4"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </article>

            {/* 4. OPEN BUGS */}
            <article
              className="tfSaasAdmin__kpiCard"
              onClick={() => navigate("/admin/bugs")}
              title="Click to view bug tracking"
            >
              <div className="tfSaasAdmin__kpiLeft">
                <div className="tfSaasAdmin__kpiIconBox tfSaasAdmin__kpiIconBox--red">
                  <Bug size={22} />
                </div>
                <div className="tfSaasAdmin__kpiMeta">
                  <span className="tfSaasAdmin__kpiLabel">Open Bugs</span>
                  <div className="tfSaasAdmin__kpiValueRow">
                    <strong className="tfSaasAdmin__kpiValue">
                      <AnimatedNumber value={dataset.bugs} />
                    </strong>
                    <span className="tfSaasAdmin__kpiTrend text-red">
                      <TrendingUp size={12} />
                      {dataset.bugsTrend}
                    </span>
                  </div>
                  <small className="tfSaasAdmin__kpiSub">{dataset.bugsSub}</small>
                </div>
              </div>

              {/* Red Sparkline SVG */}
              <div className="tfSaasAdmin__kpiSpark">
                <svg viewBox="0 0 100 40" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="tfSparkRed" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ef4444" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#ef4444" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 0 30 C 20 30, 35 18, 55 22 C 75 25, 85 14, 100 8 L 100 40 L 0 40 Z"
                    fill="url(#tfSparkRed)"
                  />
                  <path
                    d="M 0 30 C 20 30, 35 18, 55 22 C 75 25, 85 14, 100 8"
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </article>
          </section>

          {/* =========================================================
              ROW 2: 3 ANALYTICS CARDS (USER GROWTH | TASK STATUS | PROJECT PROGRESS)
          ========================================================= */}
          <section className="tfSaasAdmin__middleGrid">
            {/* 1. USER GROWTH CARD */}
            <article className="tfSaasAdmin__card">
              <div className="tfSaasAdmin__cardHeader">
                <h2>User Growth</h2>
                <div className="tfSaasAdmin__selectPill">
                  <select
                    value={userGrowthTimeframe}
                    onChange={(e) => setUserGrowthTimeframe(e.target.value)}
                    aria-label="Filter user growth timeframe"
                  >
                    <option value="This Year">This Year</option>
                    <option value="Last 6 Months">Last 6 Months</option>
                    <option value="This Month">This Month</option>
                  </select>
                  <ChevronDown size={13} />
                </div>
              </div>

              <div className="tfSaasAdmin__growthChartContainer">
                <div className="tfSaasAdmin__growthYAxis">
                  <span>250</span>
                  <span>200</span>
                  <span>150</span>
                  <span>100</span>
                  <span>50</span>
                  <span>0</span>
                </div>

                <div className="tfSaasAdmin__growthBarsArea">
                  <div className="tfSaasAdmin__gridLines">
                    <span /><span /><span /><span /><span />
                  </div>

                  <div className="tfSaasAdmin__barsTrack">
                    {userGrowthBars.map((b) => (
                      <div key={b.label} className="tfSaasAdmin__barGroup" title={`${b.label}: ${b.val} Users`}>
                        <div className="tfSaasAdmin__barRail">
                          <div className="tfSaasAdmin__barFill" style={{ height: b.height }} />
                        </div>
                        <span className="tfSaasAdmin__barLabel">{b.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </article>

            {/* 2. TASK STATUS OVERVIEW CARD */}
            <article className="tfSaasAdmin__card">
              <div className="tfSaasAdmin__cardHeader">
                <h2>Task Status Overview</h2>
                <div className="tfSaasAdmin__selectPill">
                  <select
                    value={taskStatusTimeframe}
                    onChange={(e) => setTaskStatusTimeframe(e.target.value)}
                    aria-label="Filter task status timeframe"
                  >
                    <option value="This Month">This Month</option>
                    <option value="Today">Today</option>
                    <option value="7 Days">Last 7 Days</option>
                  </select>
                  <ChevronDown size={13} />
                </div>
              </div>

              <div className="tfSaasAdmin__taskOverviewBody">
                {/* SVG DONUT CHART */}
                <div className="tfSaasAdmin__donutBox">
                  <svg viewBox="0 0 140 140" className="tfSaasAdmin__donutSvg">
                    {/* Background ring */}
                    <circle
                      cx="70"
                      cy="70"
                      r={radius}
                      fill="none"
                      stroke="var(--tf-border-color, #f1f5f9)"
                      strokeWidth={strokeW}
                    />
                    {/* Overdue (Red) */}
                    <circle
                      cx="70"
                      cy="70"
                      r={radius}
                      fill="none"
                      stroke="#ef4444"
                      strokeWidth={strokeW}
                      strokeDasharray={`${lenOverdue} ${circumference - lenOverdue}`}
                      strokeDashoffset={offOverdue}
                      transform="rotate(-90 70 70)"
                    />
                    {/* Pending (Amber) */}
                    <circle
                      cx="70"
                      cy="70"
                      r={radius}
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth={strokeW}
                      strokeDasharray={`${lenPending} ${circumference - lenPending}`}
                      strokeDashoffset={offPending}
                      transform="rotate(-90 70 70)"
                    />
                    {/* In Progress (Blue) */}
                    <circle
                      cx="70"
                      cy="70"
                      r={radius}
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth={strokeW}
                      strokeDasharray={`${lenInProgress} ${circumference - lenInProgress}`}
                      strokeDashoffset={offInProgress}
                      transform="rotate(-90 70 70)"
                    />
                    {/* Completed (Emerald) */}
                    <circle
                      cx="70"
                      cy="70"
                      r={radius}
                      fill="none"
                      stroke="#10b981"
                      strokeWidth={strokeW}
                      strokeDasharray={`${lenCompleted} ${circumference - lenCompleted}`}
                      strokeDashoffset={offCompleted}
                      transform="rotate(-90 70 70)"
                    />
                  </svg>
                  <div className="tfSaasAdmin__donutCenterText">
                    <strong>
                      <AnimatedNumber value={taskData.total} />
                    </strong>
                    <span>Total</span>
                  </div>
                </div>

                {/* STATUS LEGEND BREAKDOWN */}
                <div className="tfSaasAdmin__statusList">
                  <div className="tfSaasAdmin__statusRow">
                    <div className="status-label-group">
                      <span className="dot dot-green" />
                      <span>Completed</span>
                    </div>
                    <span className="status-pct">{taskData.completedPct}%</span>
                    <strong className="status-count">{taskData.completed}</strong>
                  </div>

                  <div className="tfSaasAdmin__statusRow">
                    <div className="status-label-group">
                      <span className="dot dot-blue" />
                      <span>In Progress</span>
                    </div>
                    <span className="status-pct">{taskData.inProgressPct}%</span>
                    <strong className="status-count">{taskData.inProgress}</strong>
                  </div>

                  <div className="tfSaasAdmin__statusRow">
                    <div className="status-label-group">
                      <span className="dot dot-amber" />
                      <span>Pending</span>
                    </div>
                    <span className="status-pct">{taskData.pendingPct}%</span>
                    <strong className="status-count">{taskData.pending}</strong>
                  </div>

                  <div className="tfSaasAdmin__statusRow">
                    <div className="status-label-group">
                      <span className="dot dot-red" />
                      <span>Overdue</span>
                    </div>
                    <span className="status-pct">{taskData.overduePct}%</span>
                    <strong className="status-count">{taskData.overdue}</strong>
                  </div>
                </div>
              </div>
            </article>

            {/* 3. PROJECT PROGRESS CARD */}
            <article className="tfSaasAdmin__card">
              <div className="tfSaasAdmin__cardHeader">
                <h2>Project Progress</h2>
                <div className="tfSaasAdmin__selectPill">
                  <select
                    value={projectProgressTimeframe}
                    onChange={(e) => setProjectProgressTimeframe(e.target.value)}
                    aria-label="Filter project progress timeframe"
                  >
                    <option value="This Month">This Month</option>
                    <option value="This Quarter">This Quarter</option>
                  </select>
                  <ChevronDown size={13} />
                </div>
              </div>

              <div className="tfSaasAdmin__projectProgressList">
                {dataset.projectProgress.map((proj) => (
                  <div key={proj.id} className="tfSaasAdmin__progressRow">
                    <div className="progress-info">
                      <span className="proj-name">{proj.name}</span>
                      <strong className="proj-pct">{proj.progress}%</strong>
                    </div>
                    <div className="progress-rail">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${proj.progress}%`,
                          backgroundColor: proj.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </article>
          </section>

          {/* =========================================================
              ROW 3: 4 SECONDARY METRIC CARDS
          ========================================================= */}
          <section className="tfSaasAdmin__secGrid">
            {/* ACTIVE WORKSPACES */}
            <article
              className="tfSaasAdmin__secCard"
              onClick={() => navigate("/admin/workspaces")}
              title="Click to manage workspaces"
            >
              <div className="sec-icon-box sec-icon-purple">
                <Building2 size={20} />
              </div>
              <div className="sec-content">
                <span className="sec-label">Active Workspaces</span>
                <div className="sec-val-row">
                  <strong className="sec-val">
                    <AnimatedNumber value={dataset.activeWorkspaces} />
                  </strong>
                  <span className="sec-trend text-green">
                    <TrendingUp size={11} />
                    {dataset.activeWorkspacesTrend}
                  </span>
                </div>
                <small className="sec-sub">{dataset.activeWorkspacesSub}</small>
              </div>
            </article>

            {/* ACTIVE TEAMS */}
            <article
              className="tfSaasAdmin__secCard"
              onClick={() => navigate("/admin/users")}
              title="Click to manage teams"
            >
              <div className="sec-icon-box sec-icon-blue">
                <Users size={20} />
              </div>
              <div className="sec-content">
                <span className="sec-label">Active Teams</span>
                <div className="sec-val-row">
                  <strong className="sec-val">
                    <AnimatedNumber value={dataset.activeTeams} />
                  </strong>
                  <span className="sec-trend text-green">
                    <TrendingUp size={11} />
                    {dataset.activeTeamsTrend}
                  </span>
                </div>
                <small className="sec-sub">{dataset.activeTeamsSub}</small>
              </div>
            </article>

            {/* STORAGE USED */}
            <article
              className="tfSaasAdmin__secCard"
              onClick={() => navigate("/admin/analytics")}
              title="Click to view storage metrics"
            >
              <div className="sec-icon-box sec-icon-purple">
                <Database size={20} />
              </div>
              <div className="sec-content">
                <span className="sec-label">Storage Used</span>
                <div className="sec-val-row">
                  <strong className="sec-val">{dataset.storageUsed}</strong>
                  <span className="sec-trend text-green">
                    <TrendingUp size={11} />
                    {dataset.storageUsedTrend}
                  </span>
                </div>
                <small className="sec-sub">{dataset.storageUsedSub}</small>
              </div>
            </article>

            {/* API CALLS */}
            <article
              className="tfSaasAdmin__secCard"
              onClick={() => navigate("/admin/ai-usage")}
              title="Click to view API logs"
            >
              <div className="sec-icon-box sec-icon-green">
                <Activity size={20} />
              </div>
              <div className="sec-content">
                <span className="sec-label">API Calls (This Month)</span>
                <div className="sec-val-row">
                  <strong className="sec-val">{dataset.apiCalls}</strong>
                  <span className="sec-trend text-green">
                    <TrendingUp size={11} />
                    {dataset.apiCallsTrend}
                  </span>
                </div>
                <small className="sec-sub">{dataset.apiCallsSub}</small>
              </div>
            </article>
          </section>

          {/* =========================================================
              ROW 4: 3 BOTTOM CARDS (RECENT USERS | RECENT PROJECTS | SYSTEM HEALTH)
          ========================================================= */}
          <section className="tfSaasAdmin__bottomGrid">
            {/* 1. RECENT USERS */}
            <article className="tfSaasAdmin__card tfSaasAdmin__tableCard">
              <div className="tfSaasAdmin__cardHeader">
                <h2>Recent Users</h2>
                <button
                  type="button"
                  className="tfSaasAdmin__viewAllBtn"
                  onClick={() => navigate("/admin/users")}
                >
                  <span>View all</span>
                  <ArrowRight size={13} />
                </button>
              </div>

              <div className="tfSaasAdmin__tableWrap">
                <table className="tfSaasAdmin__table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {RECENT_USERS.map((u) => (
                      <tr key={u.id}>
                        <td>
                          <div className="user-info-cell">
                            <span
                              className="user-avatar-chip"
                              style={{ backgroundColor: u.avatarBg, color: u.avatarColor }}
                            >
                              {u.initials}
                            </span>
                            <strong className="user-name">{u.name}</strong>
                          </div>
                        </td>
                        <td className="text-muted">{u.email}</td>
                        <td>
                          <span className={`role-badge ${u.role === "Team Lead" ? "role-lead" : "role-member"}`}>
                            {u.role}
                          </span>
                        </td>
                        <td>
                          <span className="status-indicator">
                            <span className={`status-dot ${u.status === "Active" ? "dot-active" : "dot-inactive"}`} />
                            {u.status}
                          </span>
                        </td>
                        <td className="text-muted">{u.joined}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </article>

            {/* 2. RECENT PROJECTS */}
            <article className="tfSaasAdmin__card tfSaasAdmin__tableCard">
              <div className="tfSaasAdmin__cardHeader">
                <h2>Recent Projects</h2>
                <button
                  type="button"
                  className="tfSaasAdmin__viewAllBtn"
                  onClick={() => navigate("/admin/projects")}
                >
                  <span>View all</span>
                  <ArrowRight size={13} />
                </button>
              </div>

              <div className="tfSaasAdmin__tableWrap">
                <table className="tfSaasAdmin__table">
                  <thead>
                    <tr>
                      <th>Project Name</th>
                      <th>Team</th>
                      <th>Progress</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {RECENT_PROJECTS.map((p) => (
                      <tr key={p.id}>
                        <td>
                          <strong className="project-name-cell">{p.name}</strong>
                        </td>
                        <td>
                          <div className="team-avatar-stack">
                            {p.team.map((m, i) => (
                              <img key={i} src={m.avatar} alt={m.name} className="stacked-avatar" />
                            ))}
                            {p.extraTeam && <span className="avatar-extra">{p.extraTeam}</span>}
                          </div>
                        </td>
                        <td>
                          <div className="table-progress-cell">
                            <div className="table-progress-rail">
                              <div
                                className="table-progress-fill"
                                style={{ width: `${p.progress}%`, backgroundColor: p.barColor }}
                              />
                            </div>
                            <span className="table-progress-pct">{p.progress}%</span>
                          </div>
                        </td>
                        <td>
                          <span className={`project-status-pill status-${p.statusType}`}>
                            {p.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </article>

            {/* 3. SYSTEM HEALTH */}
            <article className="tfSaasAdmin__card">
              <div className="tfSaasAdmin__cardHeader">
                <h2>System Health</h2>
                <button
                  type="button"
                  className="tfSaasAdmin__viewAllBtn"
                  onClick={() => setHealthModalOpen(true)}
                >
                  <span>View details</span>
                  <ArrowRight size={13} />
                </button>
              </div>

              <div className="tfSaasAdmin__healthList">
                {SYSTEM_HEALTH_ITEMS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.id} className="health-row">
                      <div className="health-left">
                        <div className="health-icon-box">
                          <Icon size={16} />
                        </div>
                        <span className="health-name">{item.name}</span>
                      </div>

                      <div className="health-right">
                        <span className="health-status-badge">
                          <span className="dot dot-green" />
                          {item.status}
                        </span>
                        <span className="health-metric">{item.metric}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </article>
          </section>
        </main>
      </div>

      {/* =========================================================
          SYSTEM HEALTH DETAILS MODAL
      ========================================================= */}
      {healthModalOpen && (
        <div
          className="modal-overlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setHealthModalOpen(false);
          }}
        >
          <div className="modal-box health-details-modal">
            <div className="modal-header">
              <div className="health-modal-title">
                <CheckCircle2 size={20} className="text-green" />
                <h2>System Infrastructure Telemetry</h2>
              </div>
              <button
                type="button"
                className="modal-close"
                onClick={() => setHealthModalOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="health-modal-body">
              <div className="health-overall-banner">
                <span className="pulse-dot" />
                <div>
                  <strong>All 6 Microservices Operational</strong>
                  <p>Global load balancer routing 100% of telemetry traffic with zero detected anomalies.</p>
                </div>
              </div>

              <div className="health-detail-grid">
                {SYSTEM_HEALTH_ITEMS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.id} className="health-detail-card">
                      <div className="health-detail-card-top">
                        <div className="health-icon-box sm">
                          <Icon size={16} />
                        </div>
                        <strong>{item.name}</strong>
                      </div>
                      <div className="health-detail-stat">
                        <span>Metric:</span>
                        <strong>{item.metric}</strong>
                      </div>
                      <div className="health-detail-stat">
                        <span>State:</span>
                        <span className="text-green">● Operational</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="btn-primary"
                onClick={() => setHealthModalOpen(false)}
              >
                Close Diagnostic View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
