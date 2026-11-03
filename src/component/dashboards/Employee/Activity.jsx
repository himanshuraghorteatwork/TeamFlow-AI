import React, { useState, useEffect, useMemo, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Download,
  CheckCircle2,
  Clock,
  FileText,
  Users,
  Video,
  Bug,
  Folder,
  Edit3,
  MessageSquare,
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  MoreVertical,
  ExternalLink,
  Copy,
  Trash2,
  Eye,
  Check,
  X,
  Sparkles,
} from "lucide-react";

import EmployeeShell from "./EmployeeShell";
import "./Activity.css";

/* Storage Key */
const STORAGE_KEY = "tf_my_activity_v1";

/* Default Initial Activities matching reference image exactly */
const initialActivities = [
  // Today, Oct 26, 2024 (8 activities)
  {
    id: "act-1",
    dateGroup: "Today, Oct 26, 2024",
    date: "2024-10-26",
    time: "03:45 PM",
    type: "Task",
    action: "Completed task",
    title: "Fixed UI alignment issue in login page",
    project: "TeamFlow Website",
    icon: "check",
    iconColor: "green",
    tagColor: "green",
    link: "/employee/tasks",
    details: "Finished resolving flexbox alignment on mobile breakpoints in the login view.",
  },
  {
    id: "act-2",
    dateGroup: "Today, Oct 26, 2024",
    date: "2024-10-26",
    time: "02:20 PM",
    type: "Bug",
    action: "Updated bug status",
    title: "Changed status to In Progress",
    project: "Mobile App",
    icon: "bug",
    iconColor: "red",
    tagColor: "red",
    link: "/employee/bugs",
    details: "Assigned bug #BUG-1045 to investigation queue and updated status to In Progress.",
  },
  {
    id: "act-3",
    dateGroup: "Today, Oct 26, 2024",
    date: "2024-10-26",
    time: "01:10 PM",
    type: "File",
    action: "Uploaded file",
    title: "Login_Page_Design.fig",
    project: "TeamFlow Website",
    icon: "file",
    iconColor: "purple",
    tagColor: "purple",
    link: "/employee/files",
    details: "Shared updated Figma design tokens with responsive layout constraints.",
  },
  {
    id: "act-4",
    dateGroup: "Today, Oct 26, 2024",
    date: "2024-10-26",
    time: "11:30 AM",
    type: "Meeting",
    action: "Attended meeting",
    title: "UI Design Discussion (30 mins)",
    project: "Mobile App",
    icon: "video",
    iconColor: "blue",
    tagColor: "blue",
    link: "/employee/meetings",
    details: "Participated in design review discussion covering dark mode palette.",
  },
  {
    id: "act-5",
    dateGroup: "Today, Oct 26, 2024",
    date: "2024-10-26",
    time: "10:15 AM",
    type: "Task",
    action: "Updated task",
    title: "Updated task description and added comments",
    project: "API Integration",
    icon: "edit",
    iconColor: "blue",
    tagColor: "green",
    link: "/employee/tasks",
    details: "Refined acceptance criteria and documented test cases for authentication service.",
  },
  {
    id: "act-6",
    dateGroup: "Today, Oct 26, 2024",
    date: "2024-10-26",
    time: "09:40 AM",
    type: "Task",
    action: "Commented on task",
    title: "Added feedback on API endpoints",
    project: "API Integration",
    icon: "message",
    iconColor: "orange",
    tagColor: "green",
    link: "/employee/tasks",
    details: "Left feedback on payload validation error formats in staging environment.",
  },
  {
    id: "act-7",
    dateGroup: "Today, Oct 26, 2024",
    date: "2024-10-26",
    time: "09:10 AM",
    type: "Project",
    action: "Viewed project",
    title: "Checked project dashboard and progress",
    project: "Mobile App",
    icon: "folder",
    iconColor: "purple",
    tagColor: "purple",
    link: "/employee/projects",
    details: "Reviewed sprint burn-down chart and pending deliverables for Sprint 4.",
  },
  {
    id: "act-8",
    dateGroup: "Today, Oct 26, 2024",
    date: "2024-10-26",
    time: "08:45 AM",
    type: "File",
    action: "Accessed file",
    title: "API_Documentation.docx",
    project: "API Integration",
    icon: "file",
    iconColor: "blue",
    tagColor: "purple",
    link: "/employee/files",
    details: "Downloaded latest endpoint specs for REST endpoints integration.",
  },

  // Yesterday, Oct 25, 2024 (6 activities)
  {
    id: "act-9",
    dateGroup: "Yesterday, Oct 25, 2024",
    date: "2024-10-25",
    time: "05:20 PM",
    type: "Task",
    action: "Completed task",
    title: "Prepared demo presentation",
    project: "TeamFlow Website",
    icon: "check",
    iconColor: "green",
    tagColor: "green",
    link: "/employee/tasks",
    details: "Assembled slides and key metrics demo for client presentation.",
  },
  {
    id: "act-10",
    dateGroup: "Yesterday, Oct 25, 2024",
    date: "2024-10-25",
    time: "03:10 PM",
    type: "Bug",
    action: "Resolved bug",
    title: "Fixed responsive design issue",
    project: "Mobile App",
    icon: "bug",
    iconColor: "red",
    tagColor: "red",
    link: "/employee/bugs",
    details: "Fixed overflow glitch on iPhone Safari viewports.",
  },
  {
    id: "act-11",
    dateGroup: "Yesterday, Oct 25, 2024",
    date: "2024-10-25",
    time: "11:00 AM",
    type: "Meeting",
    action: "Attended meeting",
    title: "Sprint Review (1 hour)",
    project: "Mobile App",
    icon: "video",
    iconColor: "blue",
    tagColor: "blue",
    link: "/employee/meetings",
    details: "Discussed Sprint 4 velocity and sprint retrospective action items.",
  },
  {
    id: "act-12",
    dateGroup: "Yesterday, Oct 25, 2024",
    date: "2024-10-25",
    time: "10:00 AM",
    type: "Task",
    action: "Updated task",
    title: "Updated task description and requirements",
    project: "TeamFlow Website",
    icon: "edit",
    iconColor: "blue",
    tagColor: "green",
    link: "/employee/tasks",
    details: "Revised milestone deliverables for frontend deployment phase.",
  },
  {
    id: "act-13",
    dateGroup: "Yesterday, Oct 25, 2024",
    date: "2024-10-25",
    time: "09:15 AM",
    type: "File",
    action: "Accessed file",
    title: "Sprint_Review.pptx",
    project: "Mobile App",
    icon: "file",
    iconColor: "purple",
    tagColor: "purple",
    link: "/employee/files",
    details: "Reviewed slide deck before client sprint alignment meeting.",
  },
  {
    id: "act-14",
    dateGroup: "Yesterday, Oct 25, 2024",
    date: "2024-10-25",
    time: "08:30 AM",
    type: "Task",
    action: "Commented on task",
    title: "Added progress notes to daily standup",
    project: "TeamFlow Website",
    icon: "message",
    iconColor: "orange",
    tagColor: "green",
    link: "/employee/tasks",
    details: "Confirmed staging build passed automated UI smoke tests.",
  },
  // Oct 24, 2024
  {
    id: "act-15",
    dateGroup: "Oct 24, 2024",
    date: "2024-10-24",
    time: "04:30 PM",
    type: "Task",
    action: "Completed task",
    title: "Optimized SVG assets and icons",
    project: "TeamFlow Website",
    icon: "check",
    iconColor: "green",
    tagColor: "green",
    link: "/employee/tasks",
    details: "Reduced asset bundle size by compressing iconography across the dashboard.",
  },
  {
    id: "act-16",
    dateGroup: "Oct 24, 2024",
    date: "2024-10-24",
    time: "02:15 PM",
    type: "File",
    action: "Uploaded file",
    title: "Architecture_Diagram_v2.png",
    project: "API Integration",
    icon: "file",
    iconColor: "purple",
    tagColor: "purple",
    link: "/employee/files",
    details: "Uploaded high-resolution service topology diagram for backend team.",
  },
  {
    id: "act-17",
    dateGroup: "Oct 24, 2024",
    date: "2024-10-24",
    time: "11:30 AM",
    type: "Meeting",
    action: "Attended meeting",
    title: "Weekly Tech Architecture Sync",
    project: "Mobile App",
    icon: "video",
    iconColor: "blue",
    tagColor: "blue",
    link: "/employee/meetings",
    details: "Aligned on caching strategies and Redis connection pooling.",
  },
  {
    id: "act-18",
    dateGroup: "Oct 24, 2024",
    date: "2024-10-24",
    time: "09:00 AM",
    type: "Bug",
    action: "Created bug",
    title: "Reported session timeout issue on Safari",
    project: "TeamFlow Website",
    icon: "bug",
    iconColor: "red",
    tagColor: "red",
    link: "/employee/bugs",
    details: "Filed bug report regarding cookie persistence on cross-site requests.",
  },
  // Oct 23, 2024
  {
    id: "act-19",
    dateGroup: "Oct 23, 2024",
    date: "2024-10-23",
    time: "05:10 PM",
    type: "Task",
    action: "Updated task",
    title: "Finalized client onboarding user flows",
    project: "TeamFlow Website",
    icon: "edit",
    iconColor: "blue",
    tagColor: "green",
    link: "/employee/tasks",
    details: "Wrapped up wireframes for multi-tenant invitation links.",
  },
  {
    id: "act-20",
    dateGroup: "Oct 23, 2024",
    date: "2024-10-23",
    time: "03:45 PM",
    type: "Bug",
    action: "Resolved bug",
    title: "Fixed badge notification counter lag",
    project: "Mobile App",
    icon: "bug",
    iconColor: "red",
    tagColor: "red",
    link: "/employee/bugs",
    details: "Corrected WebSocket re-subscription logic on app resume.",
  },
  {
    id: "act-21",
    dateGroup: "Oct 23, 2024",
    date: "2024-10-23",
    time: "01:20 PM",
    type: "File",
    action: "Accessed file",
    title: "Design_System_Tokens.json",
    project: "TeamFlow Website",
    icon: "file",
    iconColor: "purple",
    tagColor: "purple",
    link: "/employee/files",
    details: "Imported CSS variables into global theme file.",
  },
  {
    id: "act-22",
    dateGroup: "Oct 23, 2024",
    date: "2024-10-23",
    time: "10:30 AM",
    type: "Meeting",
    action: "Attended meeting",
    title: "Quarterly OKR Review (45 mins)",
    project: "TeamFlow Website",
    icon: "video",
    iconColor: "blue",
    tagColor: "blue",
    link: "/employee/meetings",
    details: "Reviewed company-wide performance goals and employee milestones.",
  },
  {
    id: "act-23",
    dateGroup: "Oct 22, 2024",
    date: "2024-10-22",
    time: "04:15 PM",
    type: "Task",
    action: "Completed task",
    title: "Configured CORS policy for test environment",
    project: "API Integration",
    icon: "check",
    iconColor: "green",
    tagColor: "green",
    link: "/employee/tasks",
    details: "Whitelist staging origins to support automated Cypress runs.",
  },
  {
    id: "act-24",
    dateGroup: "Oct 22, 2024",
    date: "2024-10-22",
    time: "11:00 AM",
    type: "Project",
    action: "Updated project",
    title: "Updated milestone roadmap dates",
    project: "Mobile App",
    icon: "folder",
    iconColor: "purple",
    tagColor: "purple",
    link: "/employee/projects",
    details: "Shifted mobile beta release to next Monday.",
  },
];

/* Available Date Ranges */
const dateRangeOptions = [
  "Oct 20, 2024 - Oct 26, 2024",
  "Oct 13, 2024 - Oct 19, 2024",
  "Oct 1, 2024 - Oct 31, 2024",
  "Last 30 Days",
  "All Time",
];

/* Available Projects */
const projectOptions = [
  "All Projects",
  "TeamFlow Website",
  "Mobile App",
  "AI Integration",
  "Marketing Portal",
];

/* Filter Tabs */
const filterTabs = [
  { label: "All Activity", value: "All" },
  { label: "Tasks", value: "Task" },
  { label: "Bugs", value: "Bug" },
  { label: "Projects", value: "Project" },
  { label: "Meetings", value: "Meeting" },
  { label: "Files", value: "File" },
];

/* Activity Breakdown Segments (Total: 42) */
const breakdownData = [
  { name: "Tasks", count: 16, pct: 38, color: "#10B981" },
  { name: "Bugs", count: 6, pct: 14, color: "#EF4444" },
  { name: "Meetings", count: 8, pct: 19, color: "#3B82F6" },
  { name: "Files", count: 9, pct: 21, color: "#8B5CF6" },
  { name: "Projects", count: 3, pct: 7, color: "#F59E0B" },
];

function Activity() {
  const navigate = useNavigate();

  // Activities state
  const [activities, setActivities] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 1) return parsed;
      }
    } catch (err) {
      console.warn("Using default activities:", err);
    }
    return initialActivities;
  });

  // Filter states
  const [activeTab, setActiveTab] = useState("All");
  const [selectedProject, setSelectedProject] = useState("All Projects");
  const [selectedDateRange, setSelectedDateRange] = useState("Oct 1, 2024 - Oct 31, 2024");
  const [customStartDate, setCustomStartDate] = useState("2024-10-01");
  const [customEndDate, setCustomEndDate] = useState("2024-10-31");

  const handleApplyCustomRange = () => {
    if (customStartDate && customEndDate) {
      const formatDate = (dateStr) => {
        const [year, month, day] = dateStr.split("-");
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const m = months[parseInt(month, 10) - 1] || month;
        return `${m} ${parseInt(day, 10)}, ${year}`;
      };
      const formatted = `${formatDate(customStartDate)} - ${formatDate(customEndDate)}`;
      setSelectedDateRange(formatted);
      showToast(`Date range set to: ${formatted}`);
    }
    setDateRangeOpen(false);
  };

  // Real-time Calendar state
  const [calendarMonth, setCalendarMonth] = useState(() => new Date());
  const [selectedCalendarDate, setSelectedCalendarDate] = useState(null);

  // Dropdown open states
  const [dateRangeOpen, setDateRangeOpen] = useState(false);
  const [projectDropdownOpen, setProjectDropdownOpen] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState(null);

  // Modal detail state
  const [activeDetailModal, setActiveDetailModal] = useState(null);

  // Toast
  const [toastMessage, setToastMessage] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [rowsDropdownOpen, setRowsDropdownOpen] = useState(false);
  const rowsRef = useRef(null);

  const dateRangeRef = useRef(null);
  const projectRef = useRef(null);

  // Persist activities
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(activities));
  }, [activities]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dateRangeRef.current && !dateRangeRef.current.contains(e.target)) {
        setDateRangeOpen(false);
      }
      if (projectRef.current && !projectRef.current.contains(e.target)) {
        setProjectDropdownOpen(false);
      }
      if (rowsRef.current && !rowsRef.current.contains(e.target)) {
        setRowsDropdownOpen(false);
      }
      if (!e.target.closest(".tf-act-more-btn") && !e.target.closest(".tf-act-dropdown-menu")) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  // Real-time Calendar cells computation
  const calendarCells = useMemo(() => {
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();
    const now = new Date();
    const isCurrentMonthNow = now.getFullYear() === year && now.getMonth() === month;
    const todayDate = now.getDate();

    const firstDayIndex = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const cells = [];

    // Prev month filler
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      cells.push({
        day: daysInPrevMonth - i,
        otherMonth: true,
        level: 0,
      });
    }

    // Activity counts map
    const countMap = {};
    activities.forEach((act) => {
      if (act.date) {
        countMap[act.date] = (countMap[act.date] || 0) + 1;
      }
    });

    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      const count = countMap[dateStr] || 0;

      let level = 0;
      if (count >= 5) level = 3;
      else if (count >= 3) level = 2;
      else if (count >= 1) level = 1;

      const isToday = isCurrentMonthNow && d === todayDate;

      cells.push({
        day: d,
        otherMonth: false,
        level,
        isToday,
        fullDate: dateStr,
      });
    }

    // Next month filler
    const totalCells = cells.length > 35 ? 42 : 35;
    const remaining = totalCells - cells.length;
    for (let j = 1; j <= remaining; j++) {
      cells.push({
        day: j,
        otherMonth: true,
        level: 0,
      });
    }

    return cells;
  }, [calendarMonth, activities]);

  
  // Multi-selection state
  const [selectedActIds, setSelectedActIds] = useState([]);

  // Reset page and selection on filter changes
  useEffect(() => {
    setCurrentPage(1);
    setSelectedActIds([]);
  }, [activeTab, selectedProject, selectedCalendarDate, selectedDateRange]);

  const handleSelectAllActivities = () => {
    const currentItemIds = paginatedActivities.map((a) => a.id);
    const allSelected = currentItemIds.length > 0 && currentItemIds.every((id) => selectedActIds.includes(id));
    if (allSelected) {
      setSelectedActIds((prev) => prev.filter((id) => !currentItemIds.includes(id)));
    } else {
      setSelectedActIds((prev) => Array.from(new Set([...prev, ...currentItemIds])));
    }
  };

  const handleSelectActivity = (id) => {
    setSelectedActIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBatchDeleteActivities = () => {
    if (selectedActIds.length === 0) return;
    const count = selectedActIds.length;
    setActivities((prev) => prev.filter((a) => !selectedActIds.includes(a.id)));
    setSelectedActIds([]);
    showToast(`Deleted ${count} activity record${count > 1 ? "s" : ""}`);
  };

  const handleBatchExportActivities = () => {
    if (selectedActIds.length === 0) return;
    const items = activities.filter((a) => selectedActIds.includes(a.id));
    const jsonStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(items, null, 2));
    const dl = document.createElement("a");
    dl.setAttribute("href", jsonStr);
    dl.setAttribute("download", `my_activities_export_${Date.now()}.json`);
    document.body.appendChild(dl);
    dl.click();
    dl.remove();
    showToast(`Exported ${selectedActIds.length} activity records to JSON`);
  };

  // Filtered Activities
  const filteredActivities = useMemo(() => {
    return activities.filter((act) => {
      // Tab filter
      if (activeTab !== "All" && act.type !== activeTab) {
        return false;
      }
      // Project filter
      if (selectedProject !== "All Projects" && act.project !== selectedProject) {
        return false;
      }
      // Calendar day filter
      if (selectedCalendarDate && act.date !== selectedCalendarDate) {
        return false;
      }
      return true;
    });
  }, [activities, activeTab, selectedProject, selectedCalendarDate]);

  // Pagination Calculations
  const totalPages = Math.max(1, Math.ceil(filteredActivities.length / rowsPerPage));
  const paginatedActivities = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredActivities.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredActivities, currentPage, rowsPerPage]);

  // Grouped by dateGroup for current page view
  const paginatedGroupedActivities = useMemo(() => {
    const groups = {};
    paginatedActivities.forEach((act) => {
      const g = act.dateGroup || "Recent Activity";
      if (!groups[g]) groups[g] = [];
      groups[g].push(act);
    });
    return groups;
  }, [paginatedActivities]);

  // Delete Activity
  const handleDeleteActivity = (id, e) => {
    e.stopPropagation();
    setActivities((prev) => prev.filter((a) => a.id !== id));
    setActiveMenuId(null);
    showToast("Activity entry removed from history.");
  };

  // Copy Link
  const handleCopyLink = (act, e) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(window.location.origin + (act.link || "/employee/activity"));
    setActiveMenuId(null);
    showToast("Activity link copied to clipboard!");
  };

  // Render activity icon
  const renderActivityIcon = (iconType, color) => {
    if (iconType === "check") {
      return (
        <div className="tf-act-icon-badge green">
          <CheckCircle2 size={16} />
        </div>
      );
    }
    if (iconType === "bug") {
      return (
        <div className="tf-act-icon-badge red">
          <Bug size={16} />
        </div>
      );
    }
    if (iconType === "file") {
      return (
        <div className={`tf-act-icon-badge ${color === "blue" ? "blue" : "purple"}`}>
          <FileText size={16} />
        </div>
      );
    }
    if (iconType === "video") {
      return (
        <div className="tf-act-icon-badge blue">
          <Video size={16} />
        </div>
      );
    }
    if (iconType === "edit") {
      return (
        <div className="tf-act-icon-badge blue">
          <Edit3 size={16} />
        </div>
      );
    }
    if (iconType === "message") {
      return (
        <div className="tf-act-icon-badge orange">
          <MessageSquare size={16} />
        </div>
      );
    }
    return (
      <div className="tf-act-icon-badge purple">
        <Folder size={16} />
      </div>
    );
  };

  return (
    <EmployeeShell
      activeRoute="/employee/activity"
      searchPlaceholder="Search tasks, projects, files, meetings..."
    >
      <div className="tf-activity-page">
        {/* Toast */}
        {toastMessage && (
          <div className="tf-act-toast">
            <Check size={16} />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* ====================================================================
            PAGE HEADER
            Title & Subtitle on Left, Date Range Dropdown on Right
            ==================================================================== */}
        <header className="tf-act-header">
          <div className="tf-act-header-left">
            <h1>My Activity</h1>
            <p>Track your work activity across tasks, projects, meetings, files and more.</p>
          </div>

          {/* Date Range Picker Dropdown (Exact match to Dashboard / Screenshot) */}
          <div className="tf-emp-date-range-container" ref={dateRangeRef}>
            <button
              type="button"
              className="tf-emp-date-range-btn"
              onClick={() => setDateRangeOpen(!dateRangeOpen)}
              aria-expanded={dateRangeOpen}
            >
              <Calendar size={15} color="#475569" />
              <span>{selectedDateRange}</span>
              <ChevronDown size={14} className={dateRangeOpen ? "open" : ""} />
            </button>

            {dateRangeOpen && (
              <div className="tf-emp-date-picker-dropdown">
                {/* Active selection banner at top */}
                <button
                  type="button"
                  className={`tf-emp-date-preset-item ${
                    selectedDateRange === "Oct 1, 2024 - Oct 31, 2024" ||
                    !["Today", "Last 7 Days", "Last 30 Days", "This Quarter", "This Year"].includes(selectedDateRange)
                      ? "active"
                      : ""
                  }`}
                  onClick={() => {
                    if (["Today", "Last 7 Days", "Last 30 Days", "This Quarter", "This Year"].includes(selectedDateRange)) {
                      setSelectedDateRange("Oct 1, 2024 - Oct 31, 2024");
                    }
                    setDateRangeOpen(false);
                  }}
                >
                  {!["Today", "Last 7 Days", "Last 30 Days", "This Quarter", "This Year"].includes(selectedDateRange)
                    ? selectedDateRange
                    : "Oct 1, 2024 - Oct 31, 2024"}
                </button>

                {/* Preset List */}
                {["Today", "Last 7 Days", "Last 30 Days", "This Quarter", "This Year"].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    className={`tf-emp-date-preset-item ${selectedDateRange === preset ? "active" : ""}`}
                    onClick={() => {
                      setSelectedDateRange(preset);
                      setDateRangeOpen(false);
                      showToast(`Date range set to: ${preset}`);
                    }}
                  >
                    {preset}
                  </button>
                ))}

                {/* Divider */}
                <div className="tf-emp-date-divider" />

                {/* Custom Range Section */}
                <div className="tf-emp-custom-range-block">
                  <div className="tf-emp-custom-range-label">CUSTOM RANGE</div>
                  <div className="tf-emp-custom-range-inputs">
                    <input
                      type="date"
                      className="tf-emp-custom-date-input"
                      value={customStartDate}
                      onChange={(e) => setCustomStartDate(e.target.value)}
                    />
                    <input
                      type="date"
                      className="tf-emp-custom-date-input"
                      value={customEndDate}
                      onChange={(e) => setCustomEndDate(e.target.value)}
                    />
                  </div>
                  <button
                    type="button"
                    className="tf-emp-apply-range-btn"
                    onClick={handleApplyCustomRange}
                  >
                    Apply Range
                  </button>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* ====================================================================
            TOP 4 KPI SUMMARY CARDS
            Tasks Worked On, Total Work Time, Files Accessed, Meetings Attended
            ==================================================================== */}
        <section className="tf-act-kpi-grid">
          {/* Card 1: Tasks Worked On */}
          <div
            className="tf-act-kpi-card"
            onClick={() => {
              setActiveTab("Task");
              showToast("Filtered by Tasks");
            }}
          >
            <div className="tf-act-kpi-icon-wrap purple">
              <CheckCircle2 size={18} />
            </div>
            <div className="tf-act-kpi-content">
              <strong className="tf-act-kpi-val">12</strong>
              <span className="tf-act-kpi-lbl">Tasks Worked On</span>
              <div className="tf-act-kpi-trend">
                <span className="tf-act-trend-badge green">↑ 20%</span>
                <span className="tf-act-trend-sub">vs last week</span>
              </div>
            </div>
          </div>

          {/* Card 2: Total Work Time */}
          <div className="tf-act-kpi-card">
            <div className="tf-act-kpi-icon-wrap green">
              <Clock size={18} />
            </div>
            <div className="tf-act-kpi-content">
              <strong className="tf-act-kpi-val">18h 30m</strong>
              <span className="tf-act-kpi-lbl">Total Work Time</span>
              <div className="tf-act-kpi-trend">
                <span className="tf-act-trend-badge green">↑ 12%</span>
                <span className="tf-act-trend-sub">vs last week</span>
              </div>
            </div>
          </div>

          {/* Card 3: Files Accessed */}
          <div
            className="tf-act-kpi-card"
            onClick={() => {
              setActiveTab("File");
              showToast("Filtered by Files");
            }}
          >
            <div className="tf-act-kpi-icon-wrap blue">
              <FileText size={18} />
            </div>
            <div className="tf-act-kpi-content">
              <strong className="tf-act-kpi-val">6</strong>
              <span className="tf-act-kpi-lbl">Files Accessed</span>
              <div className="tf-act-kpi-trend">
                <span className="tf-act-trend-badge green">↑ 50%</span>
                <span className="tf-act-trend-sub">vs last week</span>
              </div>
            </div>
          </div>

          {/* Card 4: Meetings Attended */}
          <div
            className="tf-act-kpi-card"
            onClick={() => {
              setActiveTab("Meeting");
              showToast("Filtered by Meetings");
            }}
          >
            <div className="tf-act-kpi-icon-wrap orange">
              <Users size={18} />
            </div>
            <div className="tf-act-kpi-content">
              <strong className="tf-act-kpi-val">4</strong>
              <span className="tf-act-kpi-lbl">Meetings Attended</span>
              <div className="tf-act-kpi-trend">
                <span className="tf-act-trend-badge green">↑ 33%</span>
                <span className="tf-act-trend-sub">vs last week</span>
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================================
            FILTER BAR: Category Tabs (Left) + Project Dropdown (Right)
            ==================================================================== */}
        <section className="tf-act-filter-bar">
          <div className="tf-act-filter-tabs">
            {filterTabs.map((tab) => (
              <button
                key={tab.value}
                type="button"
                className={`tf-act-pill-tab ${activeTab === tab.value ? "active" : ""}`}
                onClick={() => setActiveTab(tab.value)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Project Dropdown */}
          <div className="tf-act-proj-dropdown-wrapper" ref={projectRef}>
            <button
              type="button"
              className="tf-act-proj-btn"
              onClick={() => setProjectDropdownOpen((prev) => !prev)}
            >
              <span>{selectedProject}</span>
              <ChevronDown size={14} className="tf-act-chevron" />
            </button>

            {projectDropdownOpen && (
              <div className="tf-act-dropdown-menu right">
                {projectOptions.map((proj) => (
                  <button
                    key={proj}
                    type="button"
                    className={`tf-act-dropdown-item ${selectedProject === proj ? "active" : ""}`}
                    onClick={() => {
                      setSelectedProject(proj);
                      setProjectDropdownOpen(false);
                      showToast(`Project filter: ${proj}`);
                    }}
                  >
                    {proj}
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ====================================================================
            MAIN TWO-COLUMN WORKSPACE
            Left: Detailed Grouped Activity Feed (~68%)
            Right: Activity Calendar, Breakdown Donut, Recent Activity (~32%)
            ==================================================================== */}
        <div className="tf-act-workspace-grid">
          {/* ------------------------------------------------------------------
              LEFT COLUMN: Grouped Activity Cards
              ------------------------------------------------------------------ */}
          <div className="tf-act-left-col">
            {Object.keys(paginatedGroupedActivities).length === 0 ? (
              <div className="tf-act-empty-card">
                <Clock size={36} className="tf-act-empty-icon" />
                <h3>No activity found</h3>
                <p>Try switching filter tabs or changing the selected project.</p>
                <button
                  type="button"
                  className="tf-act-reset-btn"
                  onClick={() => {
                    setActiveTab("All");
                    setSelectedProject("All Projects");
                    setCurrentPage(1);
                  }}
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <>
                {/* Multi-Selection Batch Actions Banner */}
                {selectedActIds.length > 0 && (
                  <div className="tf-batch-banner" style={{ marginBottom: "16px", borderRadius: "10px" }}>
                    <span className="tf-batch-count">
                      <strong>{selectedActIds.length}</strong> activity record{selectedActIds.length > 1 ? "s" : ""} selected
                    </span>
                    <div className="tf-batch-actions">
                      <button
                        type="button"
                        className="tf-batch-btn tf-batch-btn-secondary"
                        onClick={handleBatchExportActivities}
                      >
                        <Download size={13} /> Export Selected
                      </button>
                      <button
                        type="button"
                        className="tf-batch-btn tf-batch-btn-danger"
                        onClick={handleBatchDeleteActivities}
                      >
                        <Trash2 size={13} /> Delete Selected
                      </button>
                      <button
                        type="button"
                        className="tf-batch-btn tf-batch-btn-clear"
                        onClick={() => setSelectedActIds([])}
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                )}

                {Object.entries(paginatedGroupedActivities).map(([groupTitle, items]) => {
                  const groupItemIds = items.map((a) => a.id);
                  const isAllGroupSelected = groupItemIds.length > 0 && groupItemIds.every((id) => selectedActIds.includes(id));

                  return (
                    <div key={groupTitle} className="tf-act-group-card">
                      {/* Group Header */}
                      <div className="tf-act-group-header">
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <button
                            type="button"
                            className="tf-row-check-btn"
                            onClick={() => {
                              if (isAllGroupSelected) {
                                setSelectedActIds((prev) => prev.filter((id) => !groupItemIds.includes(id)));
                              } else {
                                setSelectedActIds((prev) => Array.from(new Set([...prev, ...groupItemIds])));
                              }
                            }}
                            aria-label={`Select all activities in ${groupTitle}`}
                          >
                            <div className={`tf-custom-checkbox ${isAllGroupSelected ? "checked" : ""}`}>
                              {isAllGroupSelected && <Check size={12} color="#FFFFFF" strokeWidth={3} />}
                            </div>
                          </button>
                          <h3>{groupTitle}</h3>
                        </div>
                        <span className="tf-act-group-badge">{items.length} activities</span>
                      </div>

                      {/* List of activity rows */}
                      <div className="tf-act-items-list">
                        {items.map((act) => {
                          const srNumber = filteredActivities.findIndex((a) => a.id === act.id) + 1;
                          const isSelected = selectedActIds.includes(act.id);

                          return (
                            <div
                              key={act.id}
                              className={`tf-act-item-row ${isSelected ? "row-selected" : ""}`}
                              onClick={() => setActiveDetailModal(act)}
                            >
                              {/* Checkbox */}
                              <div className="tf-act-check-col" onClick={(e) => e.stopPropagation()}>
                                <button
                                  type="button"
                                  className="tf-row-check-btn"
                                  onClick={() => handleSelectActivity(act.id)}
                                  aria-label={`Select activity ${act.title}`}
                                >
                                  <div className={`tf-custom-checkbox ${isSelected ? "checked" : ""}`}>
                                    {isSelected && <Check size={12} color="#FFFFFF" strokeWidth={3} />}
                                  </div>
                                </button>
                              </div>

                              {/* Sr No */}
                              <div className="tf-act-num-col">
                                <span className="tf-row-num-badge">{srNumber}</span>
                              </div>

                              {/* Time */}
                              <div className="tf-act-time-col">
                                <span>{act.time}</span>
                              </div>

                              {/* Icon Badge */}
                              <div className="tf-act-icon-col">
                                {renderActivityIcon(act.icon, act.iconColor)}
                              </div>

                              {/* Action & Title */}
                              <div className="tf-act-info-col">
                                <strong className="tf-act-action-title">{act.action}</strong>
                                <span className="tf-act-subtext">{act.title}</span>
                              </div>

                              {/* Project */}
                              <div className="tf-act-project-col">
                                <span>{act.project}</span>
                              </div>

                              {/* Tag Pill Badge */}
                              <div className="tf-act-tag-col">
                                <span className={`tf-act-tag-pill ${act.tagColor || "green"}`}>
                                  {act.type}
                                </span>
                              </div>

                              {/* Jewel Action Buttons */}
                              <div
                                className="tf-act-actions-col"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <div className="tf-table-actions-row">
                                  <button
                                    type="button"
                                    className="tf-table-action-btn view"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setActiveDetailModal(act);
                                    }}
                                    title="View Details"
                                  >
                                    <Eye size={14} />
                                  </button>
                                  <button
                                    type="button"
                                    className="tf-table-action-btn edit"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      navigate(act.link);
                                    }}
                                    title="Open Related Item"
                                  >
                                    <ExternalLink size={14} />
                                  </button>
                                  <button
                                    type="button"
                                    className="tf-table-action-btn warning"
                                    onClick={(e) => handleCopyLink(act, e)}
                                    title="Copy Link"
                                  >
                                    <Copy size={14} />
                                  </button>
                                  <button
                                    type="button"
                                    className="tf-table-action-btn delete"
                                    onClick={(e) => handleDeleteActivity(act.id, e)}
                                    title="Delete Entry"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}

                {/* Pagination Footer Section */}
                <div className="tf-act-pagination-card">
                  <footer className="tf-act-pagination-footer">
                    <span className="tf-act-pagination-info">
                      Showing {filteredActivities.length === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1} to{" "}
                      {Math.min(currentPage * rowsPerPage, filteredActivities.length)} of{" "}
                      {filteredActivities.length} activities
                    </span>

                    <div className="tf-act-pagination-controls">
                      <button
                        type="button"
                        className="tf-act-page-nav-btn"
                        disabled={currentPage <= 1}
                        onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                        aria-label="Previous page"
                      >
                        <ChevronLeft size={16} />
                      </button>

                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                        <button
                          key={pg}
                          type="button"
                          className={`tf-act-page-btn ${currentPage === pg ? "active" : ""}`}
                          onClick={() => setCurrentPage(pg)}
                        >
                          {pg}
                        </button>
                      ))}

                      <button
                        type="button"
                        className="tf-act-page-nav-btn"
                        disabled={currentPage >= totalPages}
                        onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                        aria-label="Next page"
                      >
                        <ChevronRight size={16} />
                      </button>

                      {/* Rows per page dropdown */}
                      <div className="tf-rows-per-page-wrap" ref={rowsRef}>
                        <button
                          type="button"
                          className="tf-act-page-size-btn"
                          onClick={() => setRowsDropdownOpen(!rowsDropdownOpen)}
                          aria-label="Select activities per page"
                          aria-expanded={rowsDropdownOpen}
                        >
                          <span>{rowsPerPage} per page</span>
                          <ChevronDown size={13} className={rowsDropdownOpen ? "open" : ""} />
                        </button>

                        {rowsDropdownOpen && (
                          <div className="tf-act-rows-dropdown-menu">
                            {[5, 10, 20, 50].map((num) => (
                              <button
                                key={num}
                                type="button"
                                className={rowsPerPage === num ? "active" : ""}
                                onClick={() => {
                                  setRowsPerPage(num);
                                  setCurrentPage(1);
                                  setRowsDropdownOpen(false);
                                }}
                              >
                                {num} per page
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </footer>
                </div>
              </>
            )}
          </div>

          {/* ------------------------------------------------------------------
              RIGHT COLUMN: Calendar, Breakdown Chart, Recent Activity
              ------------------------------------------------------------------ */}
          <div className="tf-act-right-col">
            {/* Widget 1: Activity Calendar */}
            <article className="tf-act-sidebar-card tf-act-calendar-widget">
              <div className="tf-act-widget-header">
                <h4>Activity Calendar</h4>
                <div className="tf-act-cal-month-nav">
                  <button
                    type="button"
                    className="tf-act-cal-nav-btn"
                    onClick={() =>
                      setCalendarMonth(
                        (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
                      )
                    }
                    title="Previous month"
                    aria-label="Previous month"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  <span className="tf-act-cal-month-title">
                    {calendarMonth.toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                  <button
                    type="button"
                    className="tf-act-cal-nav-btn"
                    onClick={() =>
                      setCalendarMonth(
                        (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
                      )
                    }
                    title="Next month"
                    aria-label="Next month"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>

              {/* Day Headers */}
              <div className="tf-act-cal-day-names">
                <span>Sun</span>
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
              </div>

              {/* Day Cells Grid */}
              <div className="tf-act-cal-grid">
                {calendarCells.map((cell, idx) => {
                  const isDaySelected =
                    !cell.otherMonth && selectedCalendarDate === cell.fullDate;
                  const isToday = cell.isToday;

                  let cellClasses = "tf-act-cal-cell";
                  if (cell.otherMonth) cellClasses += " other-month";
                  cellClasses += ` level-${cell.level}`;
                  if (isDaySelected) cellClasses += " selected";
                  if (isToday) cellClasses += " today";

                  return (
                    <button
                      key={idx}
                      type="button"
                      className={cellClasses}
                      onClick={() => {
                        if (!cell.otherMonth) {
                          if (selectedCalendarDate === cell.fullDate) {
                            setSelectedCalendarDate(null);
                            showToast("Cleared calendar date filter");
                          } else {
                            setSelectedCalendarDate(cell.fullDate);
                            showToast(`Filtered activities for ${cell.fullDate}`);
                          }
                        }
                      }}
                      title={
                        cell.otherMonth
                          ? ""
                          : `${cell.fullDate}: ${
                              activities.filter((a) => a.date === cell.fullDate).length
                            } activities`
                      }
                    >
                      {cell.day}
                    </button>
                  );
                })}
              </div>

              {/* Heat Legend */}
              <div className="tf-act-cal-legend">
                <div className="tf-act-legend-item">
                  <span className="tf-act-legend-dot level-0" />
                  <span>No activity</span>
                </div>
                <div className="tf-act-legend-item">
                  <span className="tf-act-legend-dot level-1" />
                  <span>Low</span>
                </div>
                <div className="tf-act-legend-item">
                  <span className="tf-act-legend-dot level-2" />
                  <span>Medium</span>
                </div>
                <div className="tf-act-legend-item">
                  <span className="tf-act-legend-dot level-3" />
                  <span>High</span>
                </div>
              </div>
            </article>

            {/* Widget 2: Activity Breakdown Donut Chart */}
            <article className="tf-act-sidebar-card tf-act-breakdown-widget">
              <div className="tf-act-widget-header">
                <h4>Activity Breakdown</h4>
              </div>

              <div className="tf-act-breakdown-body">
                {/* SVG Donut Chart */}
                <div className="tf-act-donut-wrap">
                  <svg
                    viewBox="0 0 180 180"
                    className="tf-act-donut-svg"
                    role="img"
                    aria-label="Activity breakdown chart"
                  >
                    {/* Circumference = 2 * PI * 65 ≈ 408.4 */}
                    {/* Tasks: 38% -> dash: 155.2, offset: 0 */}
                    <circle
                      cx="90"
                      cy="90"
                      r="65"
                      fill="transparent"
                      stroke="#10B981"
                      strokeWidth="20"
                      strokeDasharray="155.2 253.2"
                      strokeDashoffset="0"
                      transform="rotate(-90 90 90)"
                    />
                    {/* Files: 21% -> dash: 85.8, offset: -155.2 */}
                    <circle
                      cx="90"
                      cy="90"
                      r="65"
                      fill="transparent"
                      stroke="#8B5CF6"
                      strokeWidth="20"
                      strokeDasharray="85.8 322.6"
                      strokeDashoffset="-155.2"
                      transform="rotate(-90 90 90)"
                    />
                    {/* Meetings: 19% -> dash: 77.6, offset: -241.0 */}
                    <circle
                      cx="90"
                      cy="90"
                      r="65"
                      fill="transparent"
                      stroke="#3B82F6"
                      strokeWidth="20"
                      strokeDasharray="77.6 330.8"
                      strokeDashoffset="-241.0"
                      transform="rotate(-90 90 90)"
                    />
                    {/* Bugs: 14% -> dash: 57.2, offset: -318.6 */}
                    <circle
                      cx="90"
                      cy="90"
                      r="65"
                      fill="transparent"
                      stroke="#EF4444"
                      strokeWidth="20"
                      strokeDasharray="57.2 351.2"
                      strokeDashoffset="-318.6"
                      transform="rotate(-90 90 90)"
                    />
                    {/* Projects: 7% -> dash: 28.6, offset: -375.8 */}
                    <circle
                      cx="90"
                      cy="90"
                      r="65"
                      fill="transparent"
                      stroke="#F59E0B"
                      strokeWidth="20"
                      strokeDasharray="28.6 379.8"
                      strokeDashoffset="-375.8"
                      transform="rotate(-90 90 90)"
                    />

                    {/* Donut Center Text */}
                    <text
                      x="90"
                      y="84"
                      textAnchor="middle"
                      className="tf-act-donut-count"
                    >
                      42
                    </text>
                    <text
                      x="90"
                      y="102"
                      textAnchor="middle"
                      className="tf-act-donut-label"
                    >
                      Total Activities
                    </text>
                  </svg>
                </div>

                {/* Breakdown Legend List */}
                <div className="tf-act-breakdown-legend">
                  {breakdownData.map((item) => (
                    <div
                      key={item.name}
                      className="tf-act-breakdown-row"
                      onClick={() => {
                        const targetTab = item.name.slice(0, -1);
                        setActiveTab(targetTab);
                        showToast(`Filtered by ${item.name}`);
                      }}
                    >
                      <div className="tf-act-b-left">
                        <span
                          className="tf-act-b-dot"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="tf-act-b-name">{item.name}</span>
                      </div>
                      <span className="tf-act-b-stat">
                        {item.count} ({item.pct}%)
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </article>

            {/* Widget 3: Recent Activity (Streamlined mini-feed) */}
            <article className="tf-act-sidebar-card tf-act-recent-widget">
              <div className="tf-act-widget-header">
                <h4>Recent Activity</h4>
                <button
                  type="button"
                  className="tf-act-view-all-link"
                  onClick={() => {
                    setActiveTab("All");
                    setSelectedProject("All Projects");
                    showToast("Showing all activities in feed");
                  }}
                >
                  View All <ArrowRight size={13} />
                </button>
              </div>

              <div className="tf-act-recent-list">
                {activities.slice(0, 5).map((act) => (
                  <div
                    key={act.id}
                    className="tf-act-recent-item"
                    onClick={() => setActiveDetailModal(act)}
                  >
                    <span className="tf-act-recent-time">{act.time}</span>
                    <div className="tf-act-recent-icon">
                      {renderActivityIcon(act.icon, act.iconColor)}
                    </div>
                    <div className="tf-act-recent-info">
                      <strong>{act.action}</strong>
                      <span>{act.title}</span>
                    </div>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </div>

        {/* ====================================================================
            MODAL: ACTIVITY DETAILS
            ==================================================================== */}
        {activeDetailModal && (
          <div
            className="tf-act-modal-backdrop"
            onClick={(e) => {
              if (e.target === e.currentTarget) setActiveDetailModal(null);
            }}
          >
            <div className="tf-act-modal-card" role="dialog" aria-modal="true">
              <div className="tf-act-modal-header">
                <div className="tf-act-modal-title-left">
                  {renderActivityIcon(
                    activeDetailModal.icon,
                    activeDetailModal.iconColor
                  )}
                  <div>
                    <h3>{activeDetailModal.action}</h3>
                    <p>{activeDetailModal.dateGroup} • {activeDetailModal.time}</p>
                  </div>
                </div>
                <button
                  type="button"
                  className="tf-act-modal-close"
                  onClick={() => setActiveDetailModal(null)}
                >
                  <X size={18} />
                </button>
              </div>

              <div className="tf-act-modal-body">
                <div className="tf-act-modal-detail-row">
                  <span className="tf-detail-label">Title / Description:</span>
                  <strong className="tf-detail-val">{activeDetailModal.title}</strong>
                </div>

                <div className="tf-act-modal-detail-row">
                  <span className="tf-detail-label">Project:</span>
                  <span className="tf-detail-val">{activeDetailModal.project}</span>
                </div>

                <div className="tf-act-modal-detail-row">
                  <span className="tf-detail-label">Activity Type:</span>
                  <span className={`tf-act-tag-pill ${activeDetailModal.tagColor || "green"}`}>
                    {activeDetailModal.type}
                  </span>
                </div>

                {activeDetailModal.details && (
                  <div className="tf-act-modal-notes">
                    <span className="tf-detail-label">Activity Details:</span>
                    <p>{activeDetailModal.details}</p>
                  </div>
                )}
              </div>

              <div className="tf-act-modal-footer">
                <button
                  type="button"
                  className="tf-act-btn-sec"
                  onClick={() => setActiveDetailModal(null)}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="tf-act-btn-pri"
                  onClick={() => {
                    navigate(activeDetailModal.link);
                    setActiveDetailModal(null);
                  }}
                >
                  <ExternalLink size={14} /> Open in {activeDetailModal.type}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </EmployeeShell>
  );
}

export default Activity;
