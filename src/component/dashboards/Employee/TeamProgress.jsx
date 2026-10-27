import React, { useState, useEffect, useMemo, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Users,
  Target,
  CheckSquare,
  Folder,
  Bug,
  Calendar,
  ChevronDown,
  ArrowRight,
  FileText,
  Zap,
  Smartphone,
  Cpu,
  BarChart2,
  CheckCircle2,
  Edit3,
  Cloud,
  X,
  Check,
} from "lucide-react";

import EmployeeShell from "./EmployeeShell";
import "./TeamProgress.css";

/* Team Member Avatars matching reference image */
const memberAvatars = {
  john: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
  priya: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
  amit: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
  sneha: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop",
  rohit: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
};

/* Initial Team Members matching reference image */
const initialMembers = [
  {
    id: 1,
    name: "John Doe (you)",
    shortName: "John",
    role: "Frontend Developer",
    tasks: 6,
    completed: 4,
    inProgress: 2,
    overdue: 0,
    workload: 67,
    barColor: "green",
    avatar: memberAvatars.john,
    email: "john.doe@teamflow.ai",
  },
  {
    id: 2,
    name: "Priya Sharma",
    shortName: "Priya",
    role: "UI/UX Designer",
    tasks: 6,
    completed: 4,
    inProgress: 2,
    overdue: 0,
    workload: 67,
    barColor: "green",
    avatar: memberAvatars.priya,
    email: "priya.sharma@teamflow.ai",
  },
  {
    id: 3,
    name: "Amit Patil",
    shortName: "Amit",
    role: "Backend Developer",
    tasks: 6,
    completed: 4,
    inProgress: 1,
    overdue: 1,
    workload: 67,
    barColor: "green",
    avatar: memberAvatars.amit,
    email: "amit.patil@teamflow.ai",
  },
  {
    id: 4,
    name: "Sneha Kulkarni",
    shortName: "Sneha",
    role: "QA Engineer",
    tasks: 5,
    completed: 3,
    inProgress: 2,
    overdue: 0,
    workload: 60,
    barColor: "green",
    avatar: memberAvatars.sneha,
    email: "sneha.kulkarni@teamflow.ai",
  },
  {
    id: 5,
    name: "Rohit Jadhav",
    shortName: "Rohit",
    role: "DevOps Engineer",
    tasks: 5,
    completed: 3,
    inProgress: 0,
    overdue: 2,
    workload: 60,
    barColor: "orange",
    avatar: memberAvatars.rohit,
    email: "rohit.jadhav@teamflow.ai",
  },
];

/* Initial Projects matching reference image */
const initialProjects = [
  {
    id: 1,
    name: "TeamFlow Website",
    progress: 80,
    tasksCount: "12/15 tasks",
    icon: "zap",
    iconBg: "purple",
    barColor: "blue-purple",
  },
  {
    id: 2,
    name: "Mobile App",
    progress: 65,
    tasksCount: "13/20 tasks",
    icon: "phone",
    iconBg: "blue",
    barColor: "blue",
  },
  {
    id: 3,
    name: "API Integration",
    progress: 90,
    tasksCount: "9/10 tasks",
    icon: "cpu",
    iconBg: "orange",
    barColor: "green",
  },
  {
    id: 4,
    name: "Marketing Portal",
    progress: 50,
    tasksCount: "5/10 tasks",
    icon: "chart",
    iconBg: "purple-soft",
    barColor: "orange",
  },
];

/* Overdue Items (Team) */
const overdueItemsData = [
  {
    id: "ov-1",
    title: "Fix responsive issue",
    project: "Mobile App",
    date: "Oct 22, 2024",
    priority: "High",
    icon: "bug",
    iconColor: "red",
  },
  {
    id: "ov-2",
    title: "Update api documentation",
    project: "API Integration",
    date: "Oct 23, 2024",
    priority: "Medium",
    icon: "file",
    iconColor: "red",
  },
  {
    id: "ov-3",
    title: "Add error handling",
    project: "TeamFlow Website",
    date: "Oct 24, 2024",
    priority: "Medium",
    icon: "doc",
    iconColor: "blue",
  },
];

/* Recent Team Activity Feed */
const recentTeamActivities = [
  {
    id: "act-1",
    actor: "Priya Sharma",
    action: "completed a task",
    title: "Updated home page design",
    time: "10:24 AM",
    avatar: memberAvatars.priya,
    icon: "check",
    iconColor: "green",
  },
  {
    id: "act-2",
    actor: "Amit Patil",
    action: "resolved a bug",
    title: "Fixed API response issue",
    time: "10:15 AM",
    avatar: memberAvatars.amit,
    icon: "bug",
    iconColor: "red",
  },
  {
    id: "act-3",
    actor: "Sneha Kulkarni",
    action: "updated a task",
    title: "Added test cases for login",
    time: "09:50 AM",
    avatar: memberAvatars.sneha,
    icon: "edit",
    iconColor: "blue",
  },
  {
    id: "act-4",
    actor: "Rohit Jadhav",
    action: "deployed to staging",
    title: "Version 1.0.2 deployed",
    time: "09:30 AM",
    avatar: memberAvatars.rohit,
    icon: "cloud",
    iconColor: "purple",
  },
  {
    id: "act-5",
    actor: "John Doe (you)",
    action: "completed a task",
    title: "Fixed UI alignment issue",
    time: "09:10 AM",
    avatar: memberAvatars.john,
    icon: "check",
    iconColor: "green",
  },
];

/* Date Range Options */
const dateRangeOptions = [
  "Oct 20, 2024 - Oct 26, 2024",
  "Oct 13, 2024 - Oct 19, 2024",
  "Oct 1, 2024 - Oct 31, 2024",
  "Last 30 Days",
  "All Time",
];

function TeamProgress() {
  const navigate = useNavigate();

  // State
  const [selectedDateRange, setSelectedDateRange] = useState("Oct 1, 2024 - Oct 31, 2024");
  const [dateRangeOpen, setDateRangeOpen] = useState(false);
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

  const [topPerfTimeframe, setTopPerfTimeframe] = useState("This Week");
  const [topPerfOpen, setTopPerfOpen] = useState(false);

  // Sorting state for team members table
  const [sortField, setSortField] = useState("workload");
  const [sortAsc, setSortAsc] = useState(false);

  // Selected Member Modal
  const [selectedMember, setSelectedMember] = useState(null);

  // Toast
  const [toastMessage, setToastMessage] = useState("");

  const dateRangeRef = useRef(null);
  const topPerfRef = useRef(null);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dateRangeRef.current && !dateRangeRef.current.contains(e.target)) {
        setDateRangeOpen(false);
      }
      if (topPerfRef.current && !topPerfRef.current.contains(e.target)) {
        setTopPerfOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  // Sort team members
  const sortedMembers = useMemo(() => {
    const list = [...initialMembers];
    list.sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];
      if (typeof valA === "string") {
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();
      }
      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });
    return list;
  }, [sortField, sortAsc]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortAsc((prev) => !prev);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  return (
    <EmployeeShell
      activeRoute="/employee/team-progress"
      searchPlaceholder="Search tasks, projects, team members, meetings..."
    >
      <div className="tf-progress-page">
        {/* Toast */}
        {toastMessage && (
          <div className="tf-tp-toast">
            <Check size={16} />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* ====================================================================
            PAGE HEADER (Title + Subtitle + Date Range Dropdown)
            ==================================================================== */}
        <header className="tf-tp-header">
          <div className="tf-tp-header-left">
            <div className="tf-tp-title-row">
              <div className="tf-tp-header-icon-box">
                <Users size={22} color="#5051F9" />
              </div>
              <h1>Team Progress</h1>
            </div>
            <p>See how your team is doing across projects, tasks, and goals. Stay aligned and informed.</p>
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
            Team Members, Total Tasks, Active Projects, Total Bugs
            ==================================================================== */}
        <section className="tf-tp-kpi-grid">
          {/* Card 1: Team Members */}
          <div
            className="tf-tp-kpi-card"
            onClick={() => showToast("5 active members in your team workspace")}
          >
            <div className="tf-tp-kpi-icon-wrap purple">
              <Target size={20} />
            </div>
            <div className="tf-tp-kpi-content">
              <strong className="tf-tp-kpi-num">5</strong>
              <span className="tf-tp-kpi-lbl">Team Members</span>
              <div className="tf-tp-kpi-badge-row">
                <span className="tf-tp-pill green">↑ 1 new this month</span>
              </div>
            </div>
          </div>

          {/* Card 2: Total Tasks */}
          <div
            className="tf-tp-kpi-card"
            onClick={() => navigate("/employee/tasks")}
          >
            <div className="tf-tp-kpi-icon-wrap green">
              <CheckSquare size={20} />
            </div>
            <div className="tf-tp-kpi-content">
              <strong className="tf-tp-kpi-num">28</strong>
              <span className="tf-tp-kpi-lbl">Total Tasks</span>
              <div className="tf-tp-kpi-badge-row">
                <span className="tf-tp-pill green">18 Completed</span>
                <span className="tf-tp-pill blue">7 In Progress</span>
                <span className="tf-tp-pill red">3 Overdue</span>
              </div>
            </div>
          </div>

          {/* Card 3: Active Projects */}
          <div
            className="tf-tp-kpi-card"
            onClick={() => navigate("/employee/projects")}
          >
            <div className="tf-tp-kpi-icon-wrap blue">
              <Folder size={20} />
            </div>
            <div className="tf-tp-kpi-content">
              <strong className="tf-tp-kpi-num">4</strong>
              <span className="tf-tp-kpi-lbl">Active Projects</span>
              <div className="tf-tp-project-progress-row">
                <div className="tf-tp-bar-track">
                  <div className="tf-tp-bar-fill gradient" style={{ width: "75%" }} />
                </div>
                <span className="tf-tp-progress-pct">75%</span>
              </div>
            </div>
          </div>

          {/* Card 4: Total Bugs */}
          <div
            className="tf-tp-kpi-card"
            onClick={() => navigate("/employee/bugs")}
          >
            <div className="tf-tp-kpi-icon-wrap red">
              <Bug size={20} />
            </div>
            <div className="tf-tp-kpi-content">
              <strong className="tf-tp-kpi-num">6</strong>
              <span className="tf-tp-kpi-lbl">Total Bugs</span>
              <div className="tf-tp-kpi-badge-row">
                <span className="tf-tp-pill green">4 Resolved</span>
                <span className="tf-tp-pill red">2 Open</span>
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================================
            MIDDLE ROW (3 CARDS)
            Task Status Overview (Donut) | Team Workload (Bar) | Project Progress
            ==================================================================== */}
        <section className="tf-tp-middle-grid">
          {/* 1. Task Status Overview */}
          <div className="tf-tp-card tf-task-status-card">
            <h3 className="tf-tp-card-title">Task Status Overview</h3>

            <div className="tf-tp-donut-container">
              {/* SVG Donut Chart */}
              <div className="tf-tp-donut-wrap">
                <svg
                  viewBox="0 0 160 160"
                  className="tf-tp-donut-svg"
                  role="img"
                  aria-label="Task Status Overview Donut Chart"
                >
                  {/* Circumference = 2 * PI * 58 ≈ 364.42 */}
                  {/* Completed: 18 / 28 = 64.28% -> stroke: 234.2 */}
                  <circle
                    cx="80"
                    cy="80"
                    r="58"
                    fill="transparent"
                    stroke="#10B981"
                    strokeWidth="18"
                    strokeDasharray="234.2 130.2"
                    strokeDashoffset="0"
                    transform="rotate(-90 80 80)"
                  />
                  {/* In Progress: 7 / 28 = 25% -> stroke: 91.1 */}
                  <circle
                    cx="80"
                    cy="80"
                    r="58"
                    fill="transparent"
                    stroke="#2563EB"
                    strokeWidth="18"
                    strokeDasharray="91.1 273.3"
                    strokeDashoffset="-234.2"
                    transform="rotate(-90 80 80)"
                  />
                  {/* Overdue: 3 / 28 = 10.7% -> stroke: 39.1 */}
                  <circle
                    cx="80"
                    cy="80"
                    r="58"
                    fill="transparent"
                    stroke="#EF4444"
                    strokeWidth="18"
                    strokeDasharray="39.1 325.3"
                    strokeDashoffset="-325.3"
                    transform="rotate(-90 80 80)"
                  />
                  {/* Center Text */}
                  <text x="80" y="76" textAnchor="middle" className="tf-donut-center-num">
                    28
                  </text>
                  <text x="80" y="94" textAnchor="middle" className="tf-donut-center-lbl">
                    Total Tasks
                  </text>
                </svg>
              </div>

              {/* Donut Legend */}
              <div className="tf-tp-donut-legend">
                <div
                  className="tf-donut-legend-item"
                  onClick={() => showToast("18 Completed Tasks")}
                >
                  <span className="tf-donut-dot green" />
                  <span className="tf-donut-legend-name">Completed</span>
                  <span className="tf-donut-legend-val">18 (64%)</span>
                </div>
                <div
                  className="tf-donut-legend-item"
                  onClick={() => showToast("7 Tasks in Progress")}
                >
                  <span className="tf-donut-dot blue" />
                  <span className="tf-donut-legend-name">In Progress</span>
                  <span className="tf-donut-legend-val">7 (25%)</span>
                </div>
                <div
                  className="tf-donut-legend-item"
                  onClick={() => showToast("3 Overdue Tasks")}
                >
                  <span className="tf-donut-dot red" />
                  <span className="tf-donut-legend-name">Overdue</span>
                  <span className="tf-donut-legend-val">3 (11%)</span>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Team Workload Bar Chart */}
          <div className="tf-tp-card tf-team-workload-card">
            <div className="tf-tp-card-header-flex">
              <h3 className="tf-tp-card-title">Team Workload</h3>
              <div className="tf-tp-bar-legend">
                <span className="tf-bar-legend-item">
                  <span className="tf-bar-dot green" />
                  <span>Completed</span>
                </span>
                <span className="tf-bar-legend-item">
                  <span className="tf-bar-dot blue" />
                  <span>In Progress</span>
                </span>
              </div>
            </div>

            <div className="tf-tp-barchart-container">
              {/* Y Axis */}
              <div className="tf-tp-barchart-yaxis">
                <span>8</span>
                <span>6</span>
                <span>4</span>
                <span>2</span>
                <span>0</span>
              </div>

              {/* Columns Area */}
              <div className="tf-tp-barchart-columns">
                {initialMembers.map((member) => (
                  <div
                    key={member.id}
                    className="tf-tp-bar-col-group"
                    onClick={() => setSelectedMember(member)}
                  >
                    <div className="tf-tp-bars-pair">
                      {/* Completed Bar (Green) */}
                      <div
                        className="tf-tp-bar completed"
                        style={{ height: `${(member.completed / 8) * 100}%` }}
                        title={`${member.shortName}: ${member.completed} Completed`}
                      />
                      {/* In Progress Bar (Blue) */}
                      <div
                        className="tf-tp-bar in-progress"
                        style={{ height: `${(member.inProgress / 8) * 100}%` }}
                        title={`${member.shortName}: ${member.inProgress} In Progress`}
                      />
                    </div>

                    {/* Member Avatar & Name beneath column */}
                    <img
                      src={member.avatar}
                      alt={member.shortName}
                      className="tf-tp-bar-avatar"
                    />
                    <span className="tf-tp-bar-member-name">{member.shortName}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 3. Project Progress */}
          <div className="tf-tp-card tf-project-progress-card">
            <div className="tf-tp-card-header-flex">
              <h3 className="tf-tp-card-title">Project Progress</h3>
              <Link to="/employee/projects" className="tf-tp-view-all-link">
                View All <ArrowRight size={13} />
              </Link>
            </div>

            <div className="tf-tp-projects-list">
              {initialProjects.map((p) => (
                <div
                  key={p.id}
                  className="tf-tp-project-row"
                  onClick={() => navigate("/employee/projects")}
                >
                  <div className={`tf-tp-proj-icon-box ${p.iconBg}`}>
                    {p.icon === "zap" && <Zap size={15} />}
                    {p.icon === "phone" && <Smartphone size={15} />}
                    {p.icon === "cpu" && <Cpu size={15} />}
                    {p.icon === "chart" && <BarChart2 size={15} />}
                  </div>

                  <div className="tf-tp-proj-info">
                    <div className="tf-tp-proj-title-row">
                      <strong>{p.name}</strong>
                    </div>
                    <div className="tf-tp-proj-track">
                      <div
                        className={`tf-tp-proj-fill ${p.barColor}`}
                        style={{ width: `${p.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="tf-tp-proj-stat-col">
                    <strong className="tf-tp-proj-pct">{p.progress}%</strong>
                    <span className="tf-tp-proj-count">{p.tasksCount}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ====================================================================
            BOTTOM SECTION (Two Main Columns)
            Left: Team Members Table + (Top Performing Members & Overdue Items)
            Right: Recent Team Activity Feed
            ==================================================================== */}
        <div className="tf-tp-bottom-grid">
          {/* ------------------------------------------------------------------
              LEFT MAIN COLUMN (~65% width)
              ------------------------------------------------------------------ */}
          <div className="tf-tp-bottom-left-col">
            {/* Card 1: Team Members Table */}
            <div className="tf-tp-card tf-team-members-card">
              <div className="tf-tp-card-header-flex">
                <h3 className="tf-tp-card-title">Team Members</h3>
                <Link to="/employee/team" className="tf-tp-view-all-link">
                  View All <ArrowRight size={13} />
                </Link>
              </div>

              <div className="tf-tp-table-wrap">
                <table className="tf-tp-members-table">
                  <thead>
                    <tr>
                      <th className="tf-th-num">Sr</th>
                      <th onClick={() => handleSort("name")} className="sortable">
                        Name
                      </th>
                      <th>Role</th>
                      <th onClick={() => handleSort("tasks")} className="sortable">
                        Tasks
                      </th>
                      <th onClick={() => handleSort("completed")} className="sortable">
                        Completed
                      </th>
                      <th onClick={() => handleSort("inProgress")} className="sortable">
                        In Progress
                      </th>
                      <th onClick={() => handleSort("overdue")} className="sortable">
                        Overdue
                      </th>
                      <th onClick={() => handleSort("workload")} className="sortable">
                        Workload
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedMembers.map((m, idx) => (
                      <tr
                        key={m.id}
                        onClick={() => setSelectedMember(m)}
                        className="tf-tp-table-row"
                      >
                        {/* Row Number */}
                        <td className="tf-td-num">
                          <span className="tf-row-num-badge">{idx + 1}</span>
                        </td>

                        {/* Name + Avatar */}
                        <td>
                          <div className="tf-tp-member-name-group">
                            <img src={m.avatar} alt={m.name} className="tf-tp-table-avatar" />
                            <span className="tf-tp-name-text">{m.name}</span>
                          </div>
                        </td>

                        {/* Role */}
                        <td className="tf-tp-role-cell">{m.role}</td>

                        {/* Tasks */}
                        <td className="tf-tp-num-cell">{m.tasks}</td>

                        {/* Completed */}
                        <td>
                          <span className="tf-tp-badge green">{m.completed}</span>
                        </td>

                        {/* In Progress */}
                        <td>
                          <span className="tf-tp-badge blue">{m.inProgress}</span>
                        </td>

                        {/* Overdue */}
                        <td>
                          <span className={`tf-tp-badge ${m.overdue > 0 ? "red" : "gray"}`}>
                            {m.overdue}
                          </span>
                        </td>

                        {/* Workload Bar */}
                        <td>
                          <div className="tf-tp-workload-cell">
                            <div className="tf-tp-workload-track">
                              <div
                                className={`tf-tp-workload-fill ${m.barColor}`}
                                style={{ width: `${m.workload}%` }}
                              />
                            </div>
                            <span className="tf-tp-workload-pct">{m.workload}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Subrow (2 Cards): Top Performing Members & Overdue Items (Team) */}
            <div className="tf-tp-left-subgrid">
              {/* Card 2: Top Performing Members */}
              <div className="tf-tp-card tf-top-perf-card">
                <div className="tf-tp-card-header-flex">
                  <div className="tf-tp-header-with-icon">
                    <span className="tf-tp-trophy-icon">🏆</span>
                    <h3 className="tf-tp-card-title">Top Performing Members</h3>
                  </div>

                  {/* Dropdown */}
                  <div className="tf-tp-date-wrapper" ref={topPerfRef}>
                    <button
                      type="button"
                      className="tf-tp-mini-dropdown-btn"
                      onClick={() => setTopPerfOpen((prev) => !prev)}
                    >
                      <span>{topPerfTimeframe}</span>
                      <ChevronDown size={12} />
                    </button>

                    {topPerfOpen && (
                      <div className="tf-tp-dropdown-menu right">
                        {["This Week", "This Month", "All Time"].map((t) => (
                          <button
                            key={t}
                            type="button"
                            className={`tf-tp-dropdown-item ${topPerfTimeframe === t ? "active" : ""}`}
                            onClick={() => {
                              setTopPerfTimeframe(t);
                              setTopPerfOpen(false);
                              showToast(`Performance timeframe set to: ${t}`);
                            }}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="tf-tp-top-perf-list">
                  {initialMembers.slice(0, 3).map((m, idx) => (
                    <div
                      key={m.id}
                      className="tf-tp-perf-item"
                      onClick={() => setSelectedMember(m)}
                    >
                      {/* Rank Number Badge */}
                      <span className={`tf-tp-rank-badge rank-${idx + 1}`}>{idx + 1}</span>

                      {/* Member Avatar */}
                      <img src={m.avatar} alt={m.name} className="tf-tp-perf-avatar" />

                      {/* Name */}
                      <span className="tf-tp-perf-name">{m.shortName}</span>

                      {/* Ratio */}
                      <span className="tf-tp-perf-ratio">4/6 tasks</span>

                      {/* Pct */}
                      <span className="tf-tp-perf-pct">67%</span>

                      {/* Workload Mini Bar */}
                      <div className="tf-tp-perf-track">
                        <div
                          className={`tf-tp-perf-fill ${idx === 2 ? "yellow" : "green"}`}
                          style={{ width: "67%" }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card 3: Overdue Items (Team) */}
              <div className="tf-tp-card tf-overdue-card">
                <div className="tf-tp-card-header-flex">
                  <div className="tf-tp-header-with-icon">
                    <span className="tf-tp-clock-red">⏰</span>
                    <h3 className="tf-tp-card-title">Overdue Items (Team)</h3>
                  </div>

                  <Link to="/employee/tasks" className="tf-tp-view-all-link">
                    View All <ArrowRight size={13} />
                  </Link>
                </div>

                <div className="tf-tp-overdue-list">
                  {overdueItemsData.map((item) => (
                    <div
                      key={item.id}
                      className="tf-tp-overdue-item"
                      onClick={() => navigate("/employee/tasks")}
                    >
                      {/* Icon */}
                      <div className={`tf-tp-overdue-icon ${item.iconColor}`}>
                        {item.icon === "bug" && <Bug size={14} />}
                        {item.icon === "file" && <FileText size={14} />}
                        {item.icon === "doc" && <FileText size={14} />}
                      </div>

                      {/* Title & Project */}
                      <div className="tf-tp-overdue-info">
                        <strong>{item.title}</strong>
                        <span>{item.project}</span>
                      </div>

                      {/* Date */}
                      <span className="tf-tp-overdue-date">{item.date}</span>

                      {/* Priority Badge */}
                      <span className={`tf-tp-priority-badge ${item.priority.toLowerCase()}`}>
                        {item.priority}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ------------------------------------------------------------------
              RIGHT MAIN COLUMN (~35% width): Recent Team Activity
              ------------------------------------------------------------------ */}
          <div className="tf-tp-bottom-right-col">
            <div className="tf-tp-card tf-recent-team-activity-card">
              <div className="tf-tp-card-header-flex">
                <h3 className="tf-tp-card-title">Recent Team Activity</h3>
                <Link to="/employee/activity" className="tf-tp-view-all-link">
                  View All <ArrowRight size={13} />
                </Link>
              </div>

              <div className="tf-tp-team-activity-list">
                {recentTeamActivities.map((act) => (
                  <div
                    key={act.id}
                    className="tf-tp-team-act-item"
                    onClick={() => showToast(`Activity by ${act.actor}: ${act.title}`)}
                  >
                    {/* Status Icon */}
                    <div className={`tf-tp-act-icon-badge ${act.iconColor}`}>
                      {act.icon === "check" && <CheckCircle2 size={15} />}
                      {act.icon === "bug" && <Bug size={15} />}
                      {act.icon === "edit" && <Edit3 size={15} />}
                      {act.icon === "cloud" && <Cloud size={15} />}
                    </div>

                    {/* Actor Avatar */}
                    <img src={act.avatar} alt={act.actor} className="tf-tp-act-avatar" />

                    {/* Actor Text & Title */}
                    <div className="tf-tp-act-info">
                      <div className="tf-tp-act-actor-row">
                        <strong>{act.actor}</strong>
                        <span className="tf-tp-act-action">{act.action}</span>
                      </div>
                      <span className="tf-tp-act-title">{act.title}</span>
                    </div>

                    {/* Time */}
                    <span className="tf-tp-act-time">{act.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ====================================================================
            MODAL: TEAM MEMBER DETAILS
            ==================================================================== */}
        {selectedMember && (
          <div
            className="tf-tp-modal-backdrop"
            onClick={(e) => {
              if (e.target === e.currentTarget) setSelectedMember(null);
            }}
          >
            <div className="tf-tp-modal-card" role="dialog" aria-modal="true">
              <div className="tf-tp-modal-header">
                <div className="tf-tp-modal-user">
                  <img
                    src={selectedMember.avatar}
                    alt={selectedMember.name}
                    className="tf-tp-modal-avatar"
                  />
                  <div>
                    <h3>{selectedMember.name}</h3>
                    <p>{selectedMember.role} • {selectedMember.email}</p>
                  </div>
                </div>
                <button
                  type="button"
                  className="tf-tp-modal-close"
                  onClick={() => setSelectedMember(null)}
                >
                  <X size={18} />
                </button>
              </div>

              <div className="tf-tp-modal-body">
                <div className="tf-tp-modal-stats-grid">
                  <div className="tf-modal-stat-box">
                    <span className="lbl">Total Assigned</span>
                    <strong>{selectedMember.tasks} tasks</strong>
                  </div>
                  <div className="tf-modal-stat-box green">
                    <span className="lbl">Completed</span>
                    <strong>{selectedMember.completed}</strong>
                  </div>
                  <div className="tf-modal-stat-box blue">
                    <span className="lbl">In Progress</span>
                    <strong>{selectedMember.inProgress}</strong>
                  </div>
                  <div className="tf-modal-stat-box red">
                    <span className="lbl">Overdue</span>
                    <strong>{selectedMember.overdue}</strong>
                  </div>
                </div>

                <div className="tf-tp-modal-workload-row">
                  <span className="lbl">Sprint Task Completion:</span>
                  <div className="tf-modal-workload-track">
                    <div
                      className={`tf-modal-workload-fill ${selectedMember.barColor}`}
                      style={{ width: `${selectedMember.workload}%` }}
                    />
                  </div>
                  <strong className="pct">{selectedMember.workload}%</strong>
                </div>

                <div className="tf-tp-modal-tasks-preview">
                  <h4>Recent Sprint Tasks</h4>
                  <div className="tf-modal-task-item">
                    <span className="dot green" />
                    <span>Design responsive mobile navbar</span>
                    <span className="status">Done</span>
                  </div>
                  <div className="tf-modal-task-item">
                    <span className="dot blue" />
                    <span>Audit typography tokens & color contrast</span>
                    <span className="status">Active</span>
                  </div>
                </div>
              </div>

              <div className="tf-tp-modal-footer">
                <button
                  type="button"
                  className="tf-tp-btn-secondary"
                  onClick={() => setSelectedMember(null)}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="tf-tp-btn-primary"
                  onClick={() => {
                    navigate(`/employee/chat`);
                    setSelectedMember(null);
                  }}
                >
                  <Users size={14} /> Send Message
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </EmployeeShell>
  );
}

export default TeamProgress;
